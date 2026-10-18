'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { createBackend, call } = require('./helpers');

const createInvoice = require('../api/create-invoice');
const slots = require('../api/slots');
const book = require('../api/book');

const CUSTOMER = { name: 'Khalid Aldosari', phone: '0551234567', summary: 'Land in Khobar that I want to build on', website: '' };

function setup(t) {
  const backend = createBackend();
  const realFetch = global.fetch;
  global.fetch = backend.fakeFetch;
  Object.assign(process.env, {
    MOYASAR_SECRET_KEY: 'sk_test_x', SITE_URL: 'https://www.example.com/', VAT_PERCENT: '0',
    GOOGLE_CLIENT_ID: 'id', GOOGLE_CLIENT_SECRET: 'secret', GOOGLE_REFRESH_TOKEN: 'refresh', WHATSAPP_NUMBER: '966559178666',
  });
  t.mock.timers.enable({ apis: ['Date'], now: Date.parse('2026-10-17T05:00:00Z') });   // Saturday 08:00 Mecca
  t.after(() => { global.fetch = realFetch; });
  return backend;
}

const ref = (backend) => backend.state.invoices[0].metadata.ref;
const FIRST_SLOT = '2026-10-18T10:00:00+03:00';   // Sunday, the first working day after Saturday morning

test('create-invoice: the server sets the amount and links the invoice to a booking page', async (t) => {
  const backend = setup(t);
  const { status, body } = await call(createInvoice, { method: 'POST', body: { ...CUSTOMER, stage: 'r2', amount: 1, lang: 'en' } });
  assert.equal(status, 200);
  assert.match(body.url, /^https:\/\/checkout\.moyasar\.com\//);

  const invoice = backend.state.invoices[0];
  assert.equal(invoice.amount, 300000);                                  // 3000 SAR, ignoring the amount sent by the browser
  assert.equal(invoice.success_url, `https://www.example.com/en/booking.html?ref=${ref(backend)}`);
  assert.match(invoice.description, /Masar Projects and Development APT/);
  assert.equal(invoice.metadata.stage, 'r2');
  assert.equal(invoice.metadata.lang, 'en');
});

test('create-invoice: Arabic customers return to the Arabic booking page', async (t) => {
  const backend = setup(t);
  const { body } = await call(createInvoice, { method: 'POST', body: { ...CUSTOMER, stage: 's1', alt: true, lang: 'ar' } });
  assert.match(body.url, /lang=ar/);
  assert.equal(backend.state.invoices[0].amount, 200000);                // the "idea from the platform" fee
  assert.match(backend.state.invoices[0].success_url, /\/booking\.html\?ref=/);
  assert.ok(!backend.state.invoices[0].success_url.includes('/en/'));
});

test('create-invoice: stages without a fixed fee and bad input are refused', async (t) => {
  setup(t);
  const post = (extra) => call(createInvoice, { method: 'POST', body: { ...CUSTOMER, stage: 'r2', ...extra } });
  assert.equal((await post({ stage: 's3' })).status, 400);
  assert.equal((await post({ stage: 'nope' })).status, 400);
  assert.equal((await post({ phone: '123' })).body.code, 'invalid_phone');
  assert.equal((await post({ website: 'bot' })).status, 400);
});

test('slots: nothing is offered until the invoice is paid', async (t) => {
  const backend = setup(t);
  await call(createInvoice, { method: 'POST', body: { ...CUSTOMER, stage: 'r2' } });

  const unpaid = await call(slots, { url: `/api/slots?ref=${ref(backend)}` });
  assert.equal(unpaid.status, 402);
  assert.equal(unpaid.body.code, 'unpaid');

  assert.equal((await call(slots, { url: '/api/slots?ref=MSR-AAAAAAAAAAAA' })).status, 404);
  assert.equal((await call(slots, { url: '/api/slots?ref=bad' })).status, 400);

  backend.markPaid(ref(backend));
  const paid = await call(slots, { url: `/api/slots?ref=${ref(backend)}` });
  assert.equal(paid.status, 200);
  assert.equal(paid.body.booked, false);
  assert.equal(paid.body.days[0].slots[0], FIRST_SLOT);
});

test('book: refused before payment, and no calendar event is written', async (t) => {
  const backend = setup(t);
  await call(createInvoice, { method: 'POST', body: { ...CUSTOMER, stage: 'r2' } });
  const result = await call(book, { method: 'POST', body: { ref: ref(backend), start: FIRST_SLOT } });
  assert.equal(result.status, 402);
  assert.equal(backend.state.events.length, 0);
  assert.ok(!backend.state.calls.some((c) => c.includes('calendar/v3') && c.startsWith('POST')));
});

test('book: a paid invoice gets one Meet session, and repeating returns the same booking', async (t) => {
  const backend = setup(t);
  await call(createInvoice, { method: 'POST', body: { ...CUSTOMER, email: 'khalid@example.com', stage: 'r2', lang: 'en' } });
  backend.markPaid(ref(backend));

  const first = await call(book, { method: 'POST', body: { ref: ref(backend), start: FIRST_SLOT, notes: 'Please focus on licensing' } });
  assert.equal(first.status, 200);
  assert.match(first.body.meetUrl, /^https:\/\/meet\.google\.com\//);

  const event = backend.state.events[0];
  assert.equal(event.conferenceData.createRequest.conferenceSolutionKey.type, 'hangoutsMeet');
  assert.deepEqual(event.attendees, [{ email: 'khalid@example.com' }]);
  assert.match(event.description, /Khalid Aldosari/);
  assert.match(event.description, /wa\.me\/966551234567/);
  assert.match(event.description, /Please focus on licensing/);
  assert.match(event.description, /wa\.me\/966559178666/);

  const again = await call(book, { method: 'POST', body: { ref: ref(backend), start: '2026-10-18T11:00:00+03:00' } });
  assert.equal(again.body.meetUrl, first.body.meetUrl);
  assert.equal(backend.state.events.length, 1);                          // one booking per payment

  const afterBooking = await call(slots, { url: `/api/slots?ref=${ref(backend)}` });
  assert.equal(afterBooking.body.booked, true);
});

test('book: invalid and taken slots are rejected', async (t) => {
  const backend = setup(t);
  await call(createInvoice, { method: 'POST', body: { ...CUSTOMER, stage: 'r2' } });
  backend.markPaid(ref(backend));
  const post = (start) => call(book, { method: 'POST', body: { ref: ref(backend), start } });

  assert.equal((await post('2026-10-18T09:00:00+03:00')).body.code, 'invalid_slot');
  assert.equal((await post('2026-10-23T10:00:00+03:00')).body.code, 'invalid_slot');   // Friday

  backend.state.events.push({ start: { dateTime: '2026-10-18T10:00:00+03:00' }, end: { dateTime: '2026-10-18T10:30:00+03:00' }, extendedProperties: { private: { ref: 'other' } } });
  assert.equal((await post(FIRST_SLOT)).status, 409);
  assert.equal((await post('2026-10-18T10:30:00+03:00')).status, 200);
});
