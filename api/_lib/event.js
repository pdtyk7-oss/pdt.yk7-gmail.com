'use strict';
const cfg = require('./config');
const STAGES = require('./stages');
const { waNumber } = require('./validate');

const digits = (value) => String(value || '').replace(/\D/g, '');

/** Title and description of the calendar event, in the language the customer used on the site. */
function eventText({ ref, invoice, notes }) {
  const meta = invoice.metadata || {};
  const en = meta.lang === 'en';
  const stage = STAGES[meta.stage];
  const company = cfg[en ? 'COMPANY_EN' : 'COMPANY_AR'];
  const ownerWhatsapp = digits(process.env.WHATSAPP_NUMBER);
  const label = en
    ? { customer: 'Customer', mobile: 'Mobile', service: 'Service', order: 'Order', summary: 'Project summary', notes: 'Booking notes', invoice: 'Invoice', whatsapp: 'WhatsApp' }
    : { customer: 'العميل', mobile: 'الجوال', service: 'الخدمة', order: 'رقم الطلب', summary: 'نبذة المشروع', notes: 'ملاحظات الحجز', invoice: 'الفاتورة', whatsapp: 'واتساب' };

  const lines = [`${label.customer}: ${meta.name || '-'}`];
  if (meta.phone) lines.push(`${label.mobile}: ${meta.phone} (https://wa.me/${waNumber(meta.phone)})`);
  if (stage) lines.push(`${label.service}: ${en ? `${stage.track_en} - ${stage.name_en}` : `${stage.track} - ${stage.name}`}`);
  lines.push(`${label.order}: ${ref}`);
  if (meta.note) lines.push(`${label.summary}: ${meta.note}`);
  if (notes) lines.push(`${label.notes}: ${notes}`);
  if (!stage && invoice.description) lines.push(`${label.invoice}: ${invoice.description}`);   // fallback when metadata is missing
  if (ownerWhatsapp) lines.push(`${label.whatsapp}: https://wa.me/${ownerWhatsapp}`);

  return {
    summary: en ? `${company}: consultation - ${meta.name || ref}` : `${company}: استشارة - ${meta.name || ref}`,
    description: lines.join('\n'),
  };
}

module.exports = { eventText };
