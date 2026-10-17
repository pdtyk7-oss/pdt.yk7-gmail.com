'use strict';
const { HttpError } = require('./http');

const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';
const toLatinDigits = (s) => String(s).replace(/[٠-٩]/g, (d) => ARABIC_DIGITS.indexOf(d));

/** Strips control characters and angle brackets, collapses whitespace, and truncates. */
const clean = (value, max) =>
  String(value == null ? '' : value)
    .replace(/[\u0000-\u001F\u007F<>]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);

const PHONE_RE = /^(?:\+?966|00966|0)?5\d{8}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REF_RE = /^MSR-[0-9A-F]{12}$/;

function customerFrom(body) {
  const name = clean(body.name, 80);
  const phone = toLatinDigits(clean(body.phone, 20)).replace(/[\s\-()]/g, '');
  const email = clean(body.email, 100);
  if (name.length < 3) throw new HttpError(400, 'invalid_name');
  if (!PHONE_RE.test(phone)) throw new HttpError(400, 'invalid_phone');
  if (email && !EMAIL_RE.test(email)) throw new HttpError(400, 'invalid_email');
  return {
    name, phone, email,
    city: clean(body.city, 60),
    capital: clean(body.capital, 60),
    note: clean(body.summary, 300),
  };
}

function validRef(value) {
  const ref = String(value || '');
  if (!REF_RE.test(ref)) throw new HttpError(400, 'invalid_ref');
  return ref;
}

const optionalEmail = (value) => {
  const email = clean(value, 100);
  if (email && !EMAIL_RE.test(email)) throw new HttpError(400, 'invalid_email');
  return email;
};

/** Saudi mobile number in international form without "+" (for wa.me links). */
function waNumber(phone) {
  const d = String(phone || '').replace(/\D/g, '').replace(/^00/, '');
  if (d.startsWith('966')) return d;
  return '966' + d.replace(/^0/, '');
}

module.exports = { clean, toLatinDigits, customerFrom, validRef, optionalEmail, waNumber };
