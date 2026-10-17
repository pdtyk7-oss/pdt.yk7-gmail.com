'use strict';
/**
 * POST /api/book  { ref, start, email?, notes? }
 * Books one consultation for a paid invoice: creates the calendar event with a Google Meet room.
 * Booking is refused until Moyasar confirms the payment, and each payment can book only once.
 */
const { endpoint, readJson, HttpError } = require('./_lib/http');
const { clean, validRef, optionalEmail } = require('./_lib/validate');
const { findPaidInvoice } = require('./_lib/moyasar');
const { busyIntervals, findEventByRef, createEvent, toBooking } = require('./_lib/calendar');
const { isOfferedSlot, overlaps, endOf } = require('./_lib/schedule');
const { eventText } = require('./_lib/event');

module.exports = endpoint('POST', async (req) => {
  const body = readJson(req);
  const ref = validRef(body.ref);
  const start = String(body.start || '');
  const email = optionalEmail(body.email);
  const notes = clean(body.notes, 300);
  if (!isOfferedSlot(start)) throw new HttpError(400, 'invalid_slot');

  const invoice = await findPaidInvoice(ref);                           // payment gate, before any calendar write

  const existing = await findEventByRef(ref);
  if (existing) return { booked: true, ...toBooking(existing) };

  const end = endOf(start);
  const busy = await busyIntervals({ timeMin: new Date(start).toISOString(), timeMax: end.toISOString() });
  if (overlaps(start, busy)) throw new HttpError(409, 'slot_taken');

  const meta = invoice.metadata || {};
  const event = await createEvent({
    ref,
    start,
    end: end.toISOString(),
    email: email || meta.email || '',
    ...eventText({ ref, invoice, notes }),
  });
  return { booked: true, ...toBooking(event) };
});
