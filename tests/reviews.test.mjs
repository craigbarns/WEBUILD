import test from 'node:test';
import assert from 'node:assert/strict';
import { reviewRequests } from '../scripts/review-requests.mjs';
const now = new Date('2026-09-13T12:00:00Z');
const customer = { projectId: 'test-only', email: 'test@example.invalid', verifiedCustomer: true, receptionConfirmed: true, contactPermission: true, receptionDate: '2026-09-10T12:00:00Z' };
const base = { now, reviewUrl: 'https://g.page/r/TEST_ONLY/review', customers: [customer] };
test('review requests exclude unverified, too recent and opted-out contacts, without satisfaction filtering', () => {
    assert.equal(reviewRequests(base).length, 1);
    assert.equal(reviewRequests({ ...base, customers: [{ ...customer, satisfaction: 'negative' }] }).length, 1);
    for (const patch of [{ verifiedCustomer: false }, { receptionConfirmed: false }, { contactPermission: false }, { optedOut: true }, { reviewReceived: true }, { receptionDate: '2026-09-13T12:00:00Z' }]) assert.equal(reviewRequests({ ...base, customers: [{ ...customer, ...patch }] }).length, 0);
});
test('stable idempotency key and one reminder, seven days after confirmed delivery', () => {
    const first = reviewRequests(base)[0];
    assert.equal(reviewRequests(base)[0].id, first.id);
    const sent = [{ id: first.id, status: 'sent', sentAt: '2026-09-12T12:00:00Z' }];
    assert.equal(reviewRequests({ ...base, sent }).length, 0);
    assert.equal(reviewRequests({ ...base, sent: [{ ...sent[0], sentAt: null }] }).length, 0);
    assert.equal(reviewRequests({ ...base, sent: [{ ...sent[0], sentAt: 'invalid' }] }).length, 0);
    sent[0].sentAt = '2026-09-01T12:00:00Z';
    const reminder = reviewRequests({ ...base, sent })[0];
    assert.equal(reminder.stage, 'reminder');
    assert.equal(reviewRequests({ ...base, sent: [...sent, { id: reminder.id, status: 'sent' }] }).length, 0);
});
