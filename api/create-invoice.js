'use strict';
/**
 * POST /api/create-invoice
 * Creates a Moyasar invoice for one priced stage and returns the hosted payment page URL.
 * The amount is set here from the server-side price table, never from the browser.
 * Nothing is stored by this site; customer details travel to Moyasar as invoice metadata.
 *
 * Environment: MOYASAR_SECRET_KEY, SITE_URL (required); VAT_PERCENT, INVOICE_EXPIRY_HOURS (optional).
 */
const crypto = require('crypto');
const cfg = require('./_lib/config');
const STAGES = require('./_lib/stages');
const { endpoint, readJson, siteUrl, HttpError } = require('./_lib/http');
const { customerFrom } = require('./_lib/validate');
const { createInvoice, setMetadata } = require('./_lib/moyasar');

const vatPercent = () => Number(process.env.VAT_PERCENT || 0) || 0;
const newRef = () => `MSR-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
const withoutEmpty = (object) => Object.fromEntries(Object.entries(object).filter(([, v]) => v));

/** The text Moyasar shows on the invoice: company, service, customer and order number. */
function invoiceDescription({ lang, stage, useAlt, customer, ref }) {
  if (lang === 'en') {
    const idea = useAlt ? ' (idea from the platform)' : '';
    return `${cfg.COMPANY_EN} - ${stage.track_en} - ${stage.name_en}${idea} - Customer: ${customer.name} - Mobile: ${customer.phone} - Order: ${ref}`;
  }
  const idea = useAlt ? ' (فكرة من المنصة)' : '';
  return `${cfg.COMPANY_AR} - ${stage.track} - ${stage.name}${idea} - العميل: ${customer.name} - الجوال: ${customer.phone} - رقم الطلب: ${ref}`;
}

module.exports = endpoint('POST', async (req) => {
  const site = siteUrl();
  if (!site) throw new HttpError(500, 'not_configured');

  const body = readJson(req);
  if (body.website) throw new HttpError(400, 'bad_request');            // honeypot field for bots

  const stage = STAGES[body.stage];
  if (!stage || stage.fee == null) throw new HttpError(400, 'invalid_stage');
  const customer = customerFrom(body);

  const lang = body.lang === 'en' ? 'en' : 'ar';
  const prefix = lang === 'en' ? '/en' : '';
  const useAlt = Boolean(body.alt) && stage.altFee != null;
  const baseAmount = useAlt ? stage.fee + stage.altFee : stage.fee;   // the idea fee is added to the consultation fee
  const amount = Math.round(baseAmount * (1 + vatPercent() / 100) * 100);   // halalas
  const ref = newRef();

  const payload = {
    amount,
    currency: 'SAR',
    description: invoiceDescription({ lang, stage, useAlt, customer, ref }),
    success_url: `${site}${prefix}/booking.html?ref=${ref}`,            // booking opens only after payment is verified
    back_url: `${site}${prefix}/index.html#start`,
  };
  const expiryHours = Number(process.env.INVOICE_EXPIRY_HOURS || 0);
  if (expiryHours > 0) payload.expired_at = new Date(Date.now() + expiryHours * 3600 * 1000).toISOString();

  const invoice = await createInvoice(payload);
  if (!invoice.url) throw new HttpError(502, 'upstream');
  await setMetadata(invoice.id, withoutEmpty({ ref, lang, stage: body.stage, ...customer }));

  return { url: lang === 'en' ? invoice.url : invoice.url.replace('lang=en', 'lang=ar') };
});
