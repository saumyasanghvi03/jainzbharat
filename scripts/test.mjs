import assert from 'node:assert/strict';
function formatJainZId(sequence, year = new Date().getUTCFullYear()) { if (!Number.isInteger(sequence) || sequence < 1) throw new Error('sequence must be a positive integer'); return `JZB-${year}-${String(sequence).padStart(6, '0')}`; }
function parseJainZId(id) { const match = /^JZB-(\d{4})-(\d{6})$/.exec(id); return match ? { year: Number(match[1]), sequence: Number(match[2]) } : null; }
assert.equal(formatJainZId(1, 2026), 'JZB-2026-000001');
assert.deepEqual(parseJainZId('JZB-2026-000123'), { year: 2026, sequence: 123 });
assert.equal(parseJainZId('bad'), null);
console.log('tests passed');
