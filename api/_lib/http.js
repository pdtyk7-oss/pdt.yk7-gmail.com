'use strict';

/** An error that maps directly to an HTTP response. `code` is a stable machine-readable key. */
class HttpError extends Error {
  constructor(status, code, message) {
    super(message || code);
    this.status = status;
    this.code = code;
  }
}

const siteUrl = () => (process.env.SITE_URL || '').replace(/\/+$/, '');

function applyHeaders(res) {
  res.setHeader('Cache-Control', 'no-store');
  const site = siteUrl();
  if (site) {
    res.setHeader('Access-Control-Allow-Origin', site);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function readJson(req) {
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  return body && typeof body === 'object' ? body : {};
}

function readQuery(req) {
  return new URL(req.url || '/', 'http://localhost').searchParams;
}

/**
 * Wraps an endpoint with headers, preflight, a method check and a safe error fallback.
 * `run(req, res)` returns the JSON payload; throw HttpError for expected failures.
 */
function endpoint(method, run) {
  return async function handler(req, res) {
    applyHeaders(res);
    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== method) return res.status(405).json({ code: 'method_not_allowed' });
    try {
      const payload = await run(req);
      return res.status(200).json(payload);
    } catch (err) {
      if (err instanceof HttpError) return res.status(err.status).json({ code: err.code });
      console.error('unhandled error:', err && err.message);   // never log customer data
      return res.status(500).json({ code: 'server_error' });
    }
  };
}

module.exports = { HttpError, siteUrl, readJson, readQuery, endpoint };
