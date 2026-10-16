/* أدوات مشتركة لكل الصفحات */
const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const fmt = n => Number(n).toLocaleString('en-US');
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const toLatinDigits = s => String(s).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
let _tt;
function toast(msg){ const t=$('#toast'); if(!t) return; t.textContent=msg; t.hidden=false; clearTimeout(_tt); _tt=setTimeout(()=>t.hidden=true,5500); }
function waLink(text){
  const n=(CONFIG.WHATSAPP||'').replace(/\D/g,'');
  return n ? `https://wa.me/${n}?text=${encodeURIComponent(text||'')}` : null;
}
function openWA(text){
  const l=waLink(text);
  if(!l){ toast('رقم واتساب غير مضاف بعد. أضفه في ملف assets/config.js'); return false; }
  window.open(l,'_blank','noopener'); return true;
}
document.addEventListener('DOMContentLoaded', () => {
  // أزرار واتساب
  $$('[data-wa]').forEach(a => {
    const l = waLink(a.dataset.wa);
    if(l){ a.href=l; a.target='_blank'; a.rel='noopener'; }
    else a.addEventListener('click', e => { e.preventDefault(); toast('رقم واتساب غير مضاف بعد. أضفه في ملف assets/config.js'); });
  });
  // بيانات التواصل والتعريف (تظهر فقط إن وُجدت)
  const rows=[];
  if(CONFIG.PHONE) rows.push(`الجوال: <a href="tel:${esc(CONFIG.PHONE)}" dir="ltr">${esc(CONFIG.PHONE)}</a>`);
  if(CONFIG.EMAIL) rows.push(`البريد: <a href="mailto:${esc(CONFIG.EMAIL)}">${esc(CONFIG.EMAIL)}</a>`);
  if(waLink('')) rows.push(`واتساب: <a href="${waLink('')}" target="_blank" rel="noopener">راسلنا مباشرة</a>`);
  $$('[data-contact]').forEach(el => el.innerHTML = rows.length ? rows.map(r=>`<li>${r}</li>`).join('') : '<li>وسائل التواصل تُضاف قبل التشغيل.</li>');
  const legal=[];
  if(CONFIG.CR_NUMBER) legal.push(`السجل التجاري: <span dir="ltr">${esc(CONFIG.CR_NUMBER)}</span>`);
  if(CONFIG.VAT_NUMBER) legal.push(`الرقم الضريبي: <span dir="ltr">${esc(CONFIG.VAT_NUMBER)}</span>`);
  $$('[data-legal]').forEach(el => el.innerHTML = legal.join(' &nbsp;|&nbsp; '));
  $$('[data-contact-line]').forEach(el => {
    const parts=[]; if(CONFIG.EMAIL) parts.push(esc(CONFIG.EMAIL)); if(CONFIG.PHONE) parts.push(esc(CONFIG.PHONE));
    el.innerHTML = parts.length ? parts.join(' أو ') : 'عبر وسائل التواصل المعلنة في أسفل الصفحة';
  });
  $$('[data-vat-note]').forEach(el => el.textContent = CONFIG.VAT_PERCENT>0
    ? `تُضاف ضريبة القيمة المضافة (${CONFIG.VAT_PERCENT}%) على الرسوم المعلنة، ويظهر المبلغ الإجمالي في الفاتورة قبل الدفع.`
    : 'الرسوم المعلنة هي المبلغ الذي يظهر في الفاتورة، وتُوضَّح فيها أي ضريبة مطبقة.');
});
