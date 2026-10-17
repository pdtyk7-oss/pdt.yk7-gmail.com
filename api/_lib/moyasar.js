'use strict';
const { HttpError } = require('./http');

const BASE = 'https://api.moyasar.com/v1';

async function request(method, path, body) {
  const key = process.env.MOYASAR_SECRET_KEY;
  if (!key) throw new HttpError(500, 'not_configured');
  const res = await fetch(BASE + path, {
    method,
    headers: {
      Authorization: 'Basic ' + Buffer.from(key + ':').toString('base64'),
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data) {
    console.error('moyasar', method, path.split('?')[0], res.status);
    throw new HttpError(502, 'upstream');
  }
  return data;
}

const createInvoice = (payload) => request('POST', '/invoices', payload);
const setMetadata = (id, metadata) => request('PUT', `/invoices/${encodeURIComponent(id)}`, { metadata });

/** Finds the invoice created for `ref`. The ref must match exactly, so a loose API filter cannot leak another invoice. */
async function findInvoice(ref) {
  const query = new URLSearchParams({ 'metadata[ref]': ref });
  const { invoices = [] } = await request('GET', `/invoices?${query}`);
  return invoices.find((i) => (i.metadata && i.metadata.ref === ref) || String(i.description || '').includes(ref)) || null;
}

/** Booking gate: returns the invoice only when Moyasar says it is paid. */
async function findPaidInvoice(ref) {
  const invoice = await findInvoice(ref);
  if (!invoice) throw new HttpError(404, 'not_found');
  if (invoice.status !== 'paid') throw new HttpError(402, 'unpaid');
  return invoice;
}

module.exports = { createInvoice, setMetadata, findPaidInvoice };
