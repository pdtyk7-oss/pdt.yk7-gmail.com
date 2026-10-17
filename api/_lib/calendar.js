'use strict';
const cfg = require('./config');
const { HttpError } = require('./http');

const API = 'https://www.googleapis.com/calendar/v3';
let cachedToken = { value: null, expiresAt: 0 };

const calendarName = () => process.env.GOOGLE_CALENDAR_ID || 'primary';
const calendarPath = () => `/calendars/${encodeURIComponent(calendarName())}`;

async function accessToken() {
  if (cachedToken.value && Date.now() < cachedToken.expiresAt - 60 * 1000) return cachedToken.value;
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } = process.env;
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) throw new HttpError(500, 'not_configured');
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      refresh_token: GOOGLE_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data || !data.access_token) {
    console.error('google token', res.status, data && data.error);   // "invalid_grant" means the refresh token expired
    throw new HttpError(502, 'upstream');
  }
  cachedToken = { value: data.access_token, expiresAt: Date.now() + (data.expires_in || 3600) * 1000 };
  return cachedToken.value;
}

async function request(method, path, body) {
  const res = await fetch(API + path, {
    method,
    headers: { Authorization: `Bearer ${await accessToken()}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data) {
    console.error('google calendar', method, path.split('?')[0], res.status);
    throw new HttpError(502, 'upstream');
  }
  return data;
}

/** Busy intervals of the booking calendar inside `{ timeMin, timeMax }`. */
async function busyIntervals({ timeMin, timeMax }) {
  const id = calendarName();
  const data = await request('POST', '/freeBusy', { timeMin, timeMax, timeZone: cfg.TZ, items: [{ id }] });
  return (data.calendars && data.calendars[id] && data.calendars[id].busy) || [];
}

/** The event already created for a payment, if any (one booking per payment). */
async function findEventByRef(ref) {
  const query = new URLSearchParams({ privateExtendedProperty: `ref=${ref}`, maxResults: '5', singleEvents: 'true' });
  const data = await request('GET', `${calendarPath()}/events?${query}`);
  return (data.items || []).find((e) => e.status !== 'cancelled') || null;
}

const meetUrlOf = (event) =>
  event.hangoutLink ||
  ((event.conferenceData && event.conferenceData.entryPoints) || []).find((p) => p.entryPointType === 'video')?.uri ||
  '';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Creates the event with a Google Meet room. The invite email goes out only when the customer has an email. */
async function createEvent({ ref, start, end, summary, description, email }) {
  const body = {
    summary,
    description,
    start: { dateTime: start, timeZone: cfg.TZ },
    end: { dateTime: end, timeZone: cfg.TZ },
    extendedProperties: { private: { ref } },
    conferenceData: { createRequest: { requestId: ref, conferenceSolutionKey: { type: 'hangoutsMeet' } } },
  };
  if (email) body.attendees = [{ email }];
  const query = new URLSearchParams({ conferenceDataVersion: '1', sendUpdates: email ? 'all' : 'none' });
  let event = await request('POST', `${calendarPath()}/events?${query}`, body);
  for (let tries = 0; tries < 3 && !meetUrlOf(event); tries += 1) {   // the room can still be "pending"
    await wait(1200);
    event = await request('GET', `${calendarPath()}/events/${encodeURIComponent(event.id)}`);
  }
  return event;
}

const toBooking = (event) => ({ start: event.start.dateTime, end: event.end.dateTime, meetUrl: meetUrlOf(event) });

module.exports = { busyIntervals, findEventByRef, createEvent, toBooking };
