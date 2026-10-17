#!/usr/bin/env node
'use strict';
/**
 * One-time helper that obtains the Google refresh token used by the booking API.
 *
 *   GOOGLE_CLIENT_ID=... GOOGLE_CLIENT_SECRET=... node scripts/google-auth.js
 *
 * Use an OAuth client of type "Desktop app". Open the printed link, approve access,
 * and copy the refresh token it prints into GOOGLE_REFRESH_TOKEN on the server.
 */
const http = require('http');
const crypto = require('crypto');

const { GOOGLE_CLIENT_ID: clientId, GOOGLE_CLIENT_SECRET: clientSecret } = process.env;
if (!clientId || !clientSecret) {
  console.error('Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET first.');
  process.exit(1);
}

const PORT = 53682;
const redirectUri = `http://127.0.0.1:${PORT}`;
const state = crypto.randomBytes(16).toString('hex');
const scope = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.freebusy',
].join(' ');

const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' + new URLSearchParams({
  client_id: clientId, redirect_uri: redirectUri, response_type: 'code',
  scope, access_type: 'offline', prompt: 'consent', state,
});
console.log(`\nOpen this link in your browser and approve access:\n\n${authUrl}\n`);

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, redirectUri);
  const code = url.searchParams.get('code');
  if (!code || url.searchParams.get('state') !== state) { res.end('Waiting for approval...'); return; }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: 'authorization_code' }),
  });
  const tokens = await response.json();
  if (!tokens.refresh_token) {
    res.end('No refresh token was returned. See the terminal.');
    console.error('Google did not return a refresh token:', tokens.error || tokens);
  } else {
    res.end('Done. You can close this tab and go back to the terminal.');
    console.log('GOOGLE_REFRESH_TOKEN=' + tokens.refresh_token + '\n');
  }
  server.close();
});
server.listen(PORT, '127.0.0.1');
