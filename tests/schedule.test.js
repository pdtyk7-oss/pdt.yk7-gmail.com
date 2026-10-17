'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { openDays, isOfferedSlot, withoutBusy } = require('../api/_lib/schedule');

// Sunday 18 October 2026, 08:00 Mecca time (05:00 UTC)
const SUNDAY_MORNING = new Date('2026-10-18T05:00:00Z');
// Saturday 17 October 2026, 08:00 Mecca time
const SATURDAY_MORNING = new Date('2026-10-17T05:00:00Z');

test('sessions run from 10:00 to 15:00 Mecca time in 30-minute slots', () => {
  const days = openDays(SATURDAY_MORNING);
  const monday = days.find((d) => d.date === '2026-10-19');
  assert.equal(monday.slots.length, 10);
  assert.equal(monday.slots[0], '2026-10-19T10:00:00+03:00');
  assert.equal(monday.slots.at(-1), '2026-10-19T14:30:00+03:00');   // the last session ends at 15:00
});

test('Friday and Saturday are never offered', () => {
  const dates = openDays(SUNDAY_MORNING).map((d) => d.date);
  assert.ok(!dates.includes('2026-10-23'));   // Friday
  assert.ok(!dates.includes('2026-10-24'));   // Saturday
  assert.ok(dates.includes('2026-10-25'));    // Sunday
});

test('the minimum notice hides slots that are too soon', () => {
  const today = openDays(SUNDAY_MORNING)[0];
  assert.equal(today.date, '2026-10-18');
  assert.equal(today.slots[0], '2026-10-18T12:00:00+03:00');       // 08:00 + 4 hours
});

test('only offered slots can be booked', () => {
  const now = SATURDAY_MORNING;
  assert.ok(isOfferedSlot('2026-10-19T10:00:00+03:00', now));
  assert.ok(!isOfferedSlot('2026-10-19T09:30:00+03:00', now));     // before opening
  assert.ok(!isOfferedSlot('2026-10-19T15:00:00+03:00', now));     // would end after closing
  assert.ok(!isOfferedSlot('2026-10-19T10:15:00+03:00', now));     // not on the 30-minute grid
  assert.ok(!isOfferedSlot('2026-10-23T10:00:00+03:00', now));     // Friday
  assert.ok(!isOfferedSlot('2026-10-19T10:00:00+00:00', now));     // wrong offset
});

test('busy calendar time removes the overlapping slots', () => {
  const days = [{ date: '2026-10-19', slots: ['2026-10-19T10:00:00+03:00', '2026-10-19T10:30:00+03:00', '2026-10-19T11:00:00+03:00'] }];
  const busy = [{ start: '2026-10-19T07:30:00Z', end: '2026-10-19T08:00:00Z' }];   // 10:30-11:00 Mecca
  assert.deepEqual(withoutBusy(days, busy)[0].slots, ['2026-10-19T10:00:00+03:00', '2026-10-19T11:00:00+03:00']);
});
