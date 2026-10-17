'use strict';
const cfg = require('./config');

const MS = { minute: 60 * 1000, hour: 60 * 60 * 1000, day: 24 * 60 * 60 * 1000 };
const pad = (n) => String(n).padStart(2, '0');
const OFFSET_MS = Number(cfg.UTC_OFFSET.slice(1, 3)) * MS.hour;

/** Calendar date (YYYY-MM-DD) and weekday of `date` in Mecca time. */
function meccaDate(date) {
  const t = new Date(date.getTime() + OFFSET_MS);
  return { y: t.getUTCFullYear(), m: t.getUTCMonth(), d: t.getUTCDate() };
}

const isoDate = ({ y, m, d }) => `${y}-${pad(m + 1)}-${pad(d)}`;
const slotIso = (date, minutesFromMidnight) =>
  `${date}T${pad(Math.floor(minutesFromMidnight / 60))}:${pad(minutesFromMidnight % 60)}:00${cfg.UTC_OFFSET}`;
const endOf = (startIso) => new Date(new Date(startIso).getTime() + cfg.SLOT_MINUTES * MS.minute);

/** Every start time of one working day, as ISO strings with the Mecca offset. */
function daySlots(date) {
  const slots = [];
  const first = cfg.OPEN_HOUR * 60;
  const last = cfg.CLOSE_HOUR * 60 - cfg.SLOT_MINUTES;
  for (let t = first; t <= last; t += cfg.SLOT_MINUTES) slots.push(slotIso(date, t));
  return slots;
}

/** Working days from today up to DAYS_AHEAD, each with the slots that respect the minimum notice. */
function openDays(now = new Date()) {
  const base = meccaDate(now);
  const earliest = now.getTime() + cfg.MIN_NOTICE_HOURS * MS.hour;
  const days = [];
  for (let i = 0; i <= cfg.DAYS_AHEAD; i += 1) {
    const day = new Date(Date.UTC(base.y, base.m, base.d + i));
    if (!cfg.WORK_DAYS.includes(day.getUTCDay())) continue;
    const date = isoDate({ y: day.getUTCFullYear(), m: day.getUTCMonth(), d: day.getUTCDate() });
    const slots = daySlots(date).filter((s) => new Date(s).getTime() >= earliest);
    if (slots.length) days.push({ date, slots });
  }
  return days;
}

/** True when `startIso` is exactly one of the offered slots (rules out tampered times). */
function isOfferedSlot(startIso, now = new Date()) {
  return openDays(now).some((day) => day.slots.includes(startIso));
}

const overlaps = (startIso, busy) => {
  const s = new Date(startIso).getTime();
  const e = endOf(startIso).getTime();
  return busy.some((b) => s < new Date(b.end).getTime() && e > new Date(b.start).getTime());
};

const withoutBusy = (days, busy) =>
  days.map((d) => ({ date: d.date, slots: d.slots.filter((s) => !overlaps(s, busy)) })).filter((d) => d.slots.length);

/** Time range that covers all offered days (used for one free/busy query). */
function range(days) {
  if (!days.length) return null;
  return { timeMin: new Date(days[0].slots[0]).toISOString(), timeMax: endOf(days[days.length - 1].slots.at(-1)).toISOString() };
}

module.exports = { openDays, isOfferedSlot, overlaps, withoutBusy, range, endOf };
