const { test } = require('node:test');
const assert = require('node:assert/strict');
const policy = require('../dist/policy.js');

test('review requires authority and fresh evidence', () => {
  assert.equal(policy.canApprove({canApprove: true}, {stale: false, confidence: 87}), true);
  assert.equal(policy.canApprove({canApprove: false}, {stale: false, confidence: 87}), false);
});
test('stale evidence remains blocked even for an approver', () => {
  assert.equal(policy.canApprove({canApprove: true}, {stale: true, confidence: 93}), false);
});
test('missing or weak evidence fails closed', () => {
  for (const item of [null, {}, {confidence: 59, stale: false}]) {
    assert.equal(policy.canApprove({canApprove: true}, item), false);
  }
});
test('viewing a task does not grant execution authority', () => {
  for (const status of ['todo', 'blocked', 'doing', 'verifying']) {
    assert.equal(policy.canAdvance({canExecute: false}, {status}), false);
    assert.equal(policy.canAdvance({canExecute: true}, {status}), true);
  }
});
test('closed and unknown task states cannot advance', () => {
  for (const status of ['done', 'unknown', undefined]) {
    assert.equal(policy.canAdvance({canExecute: true}, {status}), false);
  }
});
