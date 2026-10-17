'use strict';
/**
 * GET /api/slots?ref=MSR-...
 * Returns the free consultation slots, but only after Moyasar confirms the invoice is paid.
 * If the payment already has a booking, returns that booking instead.
 */
const cfg = require('./_lib/config');
const { endpoint, readQuery } = require('./_lib/http');
const { validRef } = require('./_lib/validate');
const { findPaidInvoice } = require('./_lib/moyasar');
const { busyIntervals, findEventByRef, toBooking } = require('./_lib/calendar');
const { openDays, withoutBusy, range } = require('./_lib/schedule');

module.exports = endpoint('GET', async (req) => {
  const ref = validRef(readQuery(req).get('ref'));
  await findPaidInvoice(ref);                                           // 402 while unpaid

  const existing = await findEventByRef(ref);
  if (existing) return { booked: true, ...toBooking(existing) };

  const days = openDays();
  const window = range(days);
  const free = window ? withoutBusy(days, await busyIntervals(window)) : [];
  return { booked: false, tz: cfg.TZ, minutes: cfg.SLOT_MINUTES, days: free };
});
