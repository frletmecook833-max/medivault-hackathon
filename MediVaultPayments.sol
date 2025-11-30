// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title MediVaultPayments
 * @dev Handles research query payments and automatic distribution to patients
 * @notice This contract demonstrates privacy-preserving medical data marketplace payments
 */
contract MediVaultPayments is Ownable, Pausable, ReentrancyGuard {
    
    // ============ STATE VARIABLES ============
    
    uint256 public queryCounter;
    uint256 public totalPaymentsDistributed;
    uint256 public constant MIN_PAYMENT_PER_PATIENT = 0.00005 ether; // ~$0.10 at $2000/ETH
    
    struct Query {
        address researcher;
        uint256 paymentAmount;
        uint256 patientCount;
        uint256 timestamp;
        bool executed;
    }
    
    struct QueryProof {
        bytes32 proofHash;       // ZK proof hash from Midnight
        uint256 resultCount;     // Number of patients matched
        bool verified;
    }
    
    mapping(uint256 => Query) public queries;
    mapping(uint256 => QueryProof) public queryProofs;
    mapping(address => uint256) public patientEarnings;
    
    // ============ EVENTS ============
    
    event QuerySubmitted(
        uint256 indexed queryId,
        address indexed researcher,
        uint256 paymentAmount,
        uint256 patientCount,
        uint256 timestamp
    );
    
    event ProofVerified(
        uint256 indexed queryId,
        bytes32 proofHash,
        uint256 resultCount
    );
    
    event PaymentDistributed(
        uint256 indexed queryId,
        address indexed patient,
        uint256 amount
    );
    
    event FundsWithdrawn(
        address indexed patient,
        uint256 amount
    );
    
    // ============ CONSTRUCTOR ============
    
    constructor() Ownable(msg.sender) {
        queryCounter = 0;
        totalPaymentsDistributed = 0;
    }
    
    // ============ CORE FUNCTIONS ============
    
    /**
     * @dev Submit a research query with payment
     * @param _patientCount Expected number of patients in result set
     */
    function submitQuery(uint256 _patientCount) 
        external 
        payable 
        whenNotPaused 
    {
        require(_patientCount > 0, "Patient count must be > 0");
        require(msg.value > 0, "Must send payment");
        
        uint256 minPayment = _patientCount * MIN_PAYMENT_PER_PATIENT;
        require(msg.value >= minPayment, "Payment too low");
        
        queries[queryCounter] = Query({
            researcher: msg.sender,
            paymentAmount: msg.value,
            patientCount: _patientCount,
            timestamp: block.timestamp,
            executed: false
        });
        
        emit QuerySubmitted(
            queryCounter,
            msg.sender,
            msg.value,
            _patientCount,
            block.timestamp
        );
        
        queryCounter++;
    }
    
    /**
     * @dev Submit query with zero-knowledge proof (for privacy track)
     * @param _patientCount Expected number of patients
     * @param _proofHash Hash of ZK proof from Midnight
     * @param _resultCount Actual matched patients (verified off-chain)
     */
    function submitQueryWithProof(
        uint256 _patientCount,
        bytes32 _proofHash,
        uint256 _resultCount
    ) 
        external 
        payable 
        whenNotPaused 
    {
        require(_patientCount > 0, "Patient count must be > 0");
        require(msg.value > 0, "Must send payment");
        require(_proofHash != bytes32(0), "Invalid proof hash");
        require(_resultCount > 0, "Result count must be > 0");
        
        uint256 minPayment = _patientCount * MIN_PAYMENT_PER_PATIENT;
        require(msg.value >= minPayment, "Payment too low");
        
        queries[queryCounter] = Query({
            researcher: msg.sender,
            paymentAmount: msg.value,
            patientCount: _patientCount,
            timestamp: block.timestamp,
            executed: false
        });
        
        queryProofs[queryCounter] = QueryProof({
            proofHash: _proofHash,
            resultCount: _resultCount,
            verified: true // In production, verify proof validity here
        });
        
        emit QuerySubmitted(
            queryCounter,
            msg.sender,
            msg.value,
            _patientCount,
            block.timestamp
        );
        
        emit ProofVerified(queryCounter, _proofHash, _resultCount);
        
        queryCounter++;
    }
    
    /**
     * @dev Distribute payments to patients in batches (gas optimization)
     * @param _queryId Query to process
     * @param _patients Array of patient wallet addresses
     * @param _batchSize Number of patients to process in this transaction
     */
    function distributePaymentsBatch(
        uint256 _queryId,
        address[] memory _patients,
        uint256 _batchSize
    ) 
        external 
        onlyOwner 
        nonReentrant 
    {
        Query storage query = queries[_queryId];
        require(!query.executed, "Already executed");
        require(_patients.length > 0, "Empty patient list");
        
        // Calculate payment distribution: 70% to patients, 20% hospital, 10% platform
        uint256 patientPool = (query.paymentAmount * 70) / 100;
        uint256 hospitalShare = (query.paymentAmount * 20) / 100;
        uint256 platformShare = (query.paymentAmount * 10) / 100;
        
        uint256 perPatient = patientPool / query.patientCount;
        
        // Process batch
        uint256 end = _batchSize;
        if (end > _patients.length) {
            end = _patients.length;
        }
        
        for (uint256 i = 0; i < end; i++) {
            require(_patients[i] != address(0), "Invalid patient address");
            patientEarnings[_patients[i]] += perPatient;
            emit PaymentDistributed(_queryId, _patients[i], perPatient);
        }
        
        // If this was the final batch, send hospital + platform shares
        if (end == query.patientCount) {
            query.executed = true;
            totalPaymentsDistributed += query.paymentAmount;
            
            // Transfer hospital + platform shares to contract owner
            (bool success, ) = payable(owner()).call{value: hospitalShare + platformShare}("");
            require(success, "Transfer to owner failed");
        }
    }
    
    /**
     * @dev Patient withdraws accumulated earnings
     */
    function withdrawEarnings() external nonReentrant {
        uint256 amount = patientEarnings[msg.sender];
        require(amount > 0, "No earnings to withdraw");
        
        patientEarnings[msg.sender] = 0;
        
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
        
        emit FundsWithdrawn(msg.sender, amount);
    }
    
    // ============ VIEW FUNCTIONS ============
    
    function getQueryDetails(uint256 _queryId) 
        external 
        view 
        returns (Query memory) 
    {
        return queries[_queryId];
    }
    
    function getProofDetails(uint256 _queryId) 
        external 
        view 
        returns (QueryProof memory) 
    {
        return queryProofs[_queryId];
    }
    
    // ============ ADMIN FUNCTIONS ============
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    // Allow contract to receive ETH
    receive() external payable {}
}
