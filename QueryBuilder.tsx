import React, { useState } from 'react';

export default function QueryBuilder() {
  const [condition, setCondition] = useState('Diabetes');
  const [minAge, setMinAge] = useState(30);
  const [maxAge, setMaxAge] = useState(40);
  const [estimate, setEstimate] = useState(347);
  const [loading, setLoading] = useState(false);

  const runQuery = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 900));
    setEstimate(Math.floor(Math.random() * 800) + 50);
    setLoading(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-card">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm">Select Condition</label>
          <select value={condition} onChange={(e) => setCondition(e.target.value)} className="w-full mt-2 p-2 border rounded">
            <option>Diabetes</option>
            <option>Hypertension</option>
            <option>Cancer</option>
            <option>Asthma</option>
            <option>Arthritis</option>
          </select>
        </div>

        <div>
          <label className="block text-sm">Age Range</label>
          <div className="flex gap-2 mt-2">
            <input type="number" value={minAge} onChange={(e) => setMinAge(Number(e.target.value))} className="p-2 border rounded w-1/2" />
            <input type="number" value={maxAge} onChange={(e) => setMaxAge(Number(e.target.value))} className="p-2 border rounded w-1/2" />
          </div>
        </div>
      </div>

      <div className="mt-4 bg-surface-alt p-4 rounded">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-text-muted">Estimated Patients Matched</div>
            <div className="text-2xl font-bold">{estimate}</div>
          </div>
          <div>
            <div className="text-sm text-text-muted">Privacy Score</div>
            <div className="text-lg">🟢 Safe</div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <button onClick={runQuery} className="bg-primary text-white px-5 py-2 rounded" disabled={loading}>
          {loading ? 'Processing...' : `Run Query ($${(estimate * 0.35).toFixed(2)})`}
        </button>
        <button className="px-4 py-2 border rounded">Save Query</button>
      </div>
    </div>
  );
}

