import test from 'node:test';
import assert from 'node:assert/strict';
import { withBranches } from '../src/services/siteContent.js';
import { branchSchema, contentSchema, inquirySchema } from '../src/validation/schemas.js';
import { seed } from '../seed.js';
test('Older portfolios retain contact details when branches are introduced', () => {
  const { branches, ...legacy } = seed;
  const result = withBranches({ ...legacy, address: 'Existing address', phone: '1234567890' });
  assert.equal(result.branches.length, 1);
  assert.equal(result.branches[0].address, 'Existing address');
  assert.equal(result.branches[0].phone, '1234567890');
  assert.deepEqual(withBranches({ ...legacy, branches: [] }).branches, []);
});
test('Branches support list editing and reject unsafe links or missing address', () => {
  assert.equal(contentSchema.parse(seed).branches.length, 2);
  const valid = seed.branches[1];
  assert.equal(branchSchema.safeParse({ ...valid, mapUrl: 'javascript:alert(1)' }).success, false);
  assert.equal(branchSchema.safeParse({ ...valid, address: '' }).success, false);
  assert.equal(
    contentSchema.safeParse({ ...seed, branches: Array(51).fill(valid) }).success,
    false,
  );
});
test('Enquiries can keep a preferred branch without breaking older forms', () => {
  const input = { name: 'Member', phone: '9999999999', message: 'Please call me' };
  assert.equal(inquirySchema.parse(input).branch, '');
  assert.equal(
    inquirySchema.parse({ ...input, branch: 'Ghatkopar — Ghatkopar, Mumbai' }).branch,
    'Ghatkopar — Ghatkopar, Mumbai',
  );
});
