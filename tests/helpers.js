'use strict';

/** In-memory stand-ins for Moyasar and Google Calendar, plus a tiny req/res pair for the handlers. */
function createBackend() {
  const state = { invoices: [], events: [], calls: [] };
  let counter = 0;

  const json = (status, body) => ({ ok: status < 400, status, json: async () => body });

  async function fakeFetch(url, options = {}) {
    const u = new URL(url);
    const method = options.method || 'GET';
    const body = options.body && typeof options.body === 'string' && options.body.startsWith('{') ? JSON.parse(options.body) : {};
    state.calls.push(`${method} ${u.host}${u.pathname}`);

    if (u.host === 'api.moyasar.com') {
      if (method === 'POST' && u.pathname === '/v1/invoices') {
        counter += 1;
        const invoice = { id: `inv-${counter}`, status: 'initiated', url: `https://checkout.moyasar.com/invoices/inv-${counter}?lang=en`, metadata: {}, ...body };
        state.invoices.push(invoice);
        return json(201, invoice);
      }
      const id = u.pathname.split('/')[3];
      if (method === 'PUT') {
        const invoice = state.invoices.find((i) => i.id === id);
        invoice.metadata = { ...invoice.metadata, ...body.metadata };
        return json(200, invoice);
      }
      if (method === 'GET') {
        const ref = u.searchParams.get('metadata[ref]');
        return json(200, { invoices: state.invoices.filter((i) => !ref || i.metadata.ref === ref) });
      }
    }
    if (u.host === 'oauth2.googleapis.com') return json(200, { access_token: 'token', expires_in: 3600 });

    if (u.host === 'www.googleapis.com') {
      if (u.pathname.endsWith('/freeBusy')) {
        const id = body.items[0].id;
        return json(200, { calendars: { [id]: { busy: state.events.map((e) => ({ start: e.start.dateTime, end: e.end.dateTime })) } } });
      }
      if (method === 'GET' && u.pathname.endsWith('/events')) {
        const [, ref] = u.searchParams.get('privateExtendedProperty').split('=');
        return json(200, { items: state.events.filter((e) => e.extendedProperties.private.ref === ref) });
      }
      if (method === 'POST' && u.pathname.endsWith('/events')) {
        counter += 1;
        const event = { id: `evt-${counter}`, status: 'confirmed', hangoutLink: `https://meet.google.com/abc-defg-${counter}`, ...body };
        state.events.push(event);
        return json(200, event);
      }
    }
    return json(404, {});
  }

  const markPaid = (ref) => { state.invoices.find((i) => i.metadata.ref === ref).status = 'paid'; };
  return { state, fakeFetch, markPaid };
}

/** Calls an endpoint handler and returns { status, body }. */
async function call(handler, { method = 'GET', url = '/', body } = {}) {
  const res = {
    headers: {}, statusCode: 200, payload: undefined,
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    json(data) { this.payload = data; return this; },
    end() { return this; },
  };
  await handler({ method, url, body }, res);
  return { status: res.statusCode, body: res.payload };
}

module.exports = { createBackend, call };
