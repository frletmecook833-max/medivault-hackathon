// crypto/test.js
import { encryptValue, encryptCondition, conditionMap } from './encryption.js';

console.log('conditionMap sample:', conditionMap);
const a = 35;
const encA = encryptValue(a);
console.log('age:', a, '->', encA.slice(0,40) + '...');

const cond = 'diabetes';
const encCond = encryptCondition(cond);
console.log('condition:', cond, '->', encCond.slice(0,40) + '...');

console.log('Test complete.');
