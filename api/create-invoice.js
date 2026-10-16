/* api/create-invoice.js  (Vercel Serverless Function)
   ينشئ فاتورة لدى ميسر ويعيد رابط صفحة الفاتورة المستضافة. لا يخزّن أي بيانات ولا يسجّلها.
   متغيرات البيئة المطلوبة:
     MOYASAR_SECRET_KEY  المفتاح السري (sk_test_... للتجربة ثم sk_live_...)
     SITE_URL            رابط الموقع بدون شرطة أخيرة، مثل https://example.com
   اختيارية:
     VAT_PERCENT         نسبة الضريبة المضافة فوق الرسوم (الافتراضي 0) ويجب أن تطابق assets/config.js
     INVOICE_EXPIRY_HOURS  مدة صلاحية الفاتورة بالساعات
*/
const STAGES = {
  "s1": {
    "track": "المشاريع الناشئة",
    "name": "التسجيل وتقييم المشروع والاستشارة التوعوية",
    "fee": 1000,
    "altFee": 2000
  },
  "s2": {
    "track": "المشاريع الناشئة",
    "name": "اختيار المشروع والتخطيط والدراسة لتحديد المسار",
    "fee": 4000,
    "altFee": null
  },
  "s3": {
    "track": "المشاريع الناشئة",
    "name": "الإشراف والمتابعة على تنفيذ المشروع",
    "fee": null,
    "altFee": null
  },
  "d1": {
    "track": "تطوير المشاريع",
    "name": "التقييم والمراجعة والتحليل وتحديد فرص التطوير",
    "fee": 3000,
    "altFee": null
  },
  "d2": {
    "track": "تطوير المشاريع",
    "name": "مسار التطوير وتصور أولي لخطة التطوير والتنفيذ",
    "fee": null,
    "altFee": null
  },
  "d3": {
    "track": "تطوير المشاريع",
    "name": "تحديد مسار المشروع والتنفيذ",
    "fee": null,
    "altFee": null
  },
  "t1": {
    "track": "المشاريع المتعثرة",
    "name": "دراسة المشروع واستنتاج المشكلة",
    "fee": 5000,
    "altFee": null
  },
  "t2": {
    "track": "المشاريع المتعثرة",
    "name": "الحلول ومعالجة التعثر وحجم المشكلة",
    "fee": null,
    "altFee": null
  },
  "t3": {
    "track": "المشاريع المتعثرة",
    "name": "تحديد مسار المشروع والتنفيذ",
    "fee": null,
    "altFee": null
  },
  "r1": {
    "track": "التطوير العقاري",
    "name": "الاستشارة التمهيدية قبل البناء",
    "fee": 2000,
    "altFee": null
  },
  "r2": {
    "track": "التطوير العقاري",
    "name": "التصميم والتخطيط وإصدار المخططات",
    "fee": 3000,
    "altFee": null
  },
  "r3": {
    "track": "التطوير العقاري",
    "name": "التراخيص والإجراءات النظامية",
    "fee": 2000,
    "altFee": null
  },
  "r4": {
    "track": "التطوير العقاري",
    "name": "التنفيذ والإشراف والمتابعة",
    "fee": null,
    "altFee": null
  }
};
const COMPANY = 'شركة مسار للمشاريع والتطوير السعودية';

const clean = (s, n) => String(s == null ? '' : s).replace(/[\u0000-\u001F\u007F<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n);
const toLatin = s => String(s).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));

module.exports = async function handler(req, res) {
  const SITE = (process.env.SITE_URL || '').replace(/\/+$/, '');
  const SK = process.env.MOYASAR_SECRET_KEY || '';
  const VAT = Number(process.env.VAT_PERCENT || 0) || 0;

  res.setHeader('Cache-Control', 'no-store');
  if (SITE) { res.setHeader('Access-Control-Allow-Origin', SITE); res.setHeader('Vary', 'Origin'); }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'طريقة الطلب غير مسموحة.' });
  if (!SK || !SITE) return res.status(500).json({ message: 'خدمة الدفع غير مهيأة بعد.' });

  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }
  b = b || {};
  if (b.website) return res.status(400).json({ message: 'طلب غير صالح.' });          // فخ للروبوتات

  const st = STAGES[b.stage];
  if (!st || st.fee == null) return res.status(400).json({ message: 'المرحلة غير صالحة.' });

  const name = clean(b.name, 80);
  const phone = toLatin(clean(b.phone, 20)).replace(/[\s\-()]/g, '');
  const email = clean(b.email, 100);
  const city = clean(b.city, 60);
  const capital = clean(b.capital, 60);
  const note = clean(b.summary, 300);
  if (name.length < 3) return res.status(400).json({ message: 'الاسم غير صالح.' });
  if (!/^(?:\+?966|00966|0)?5\d{8}$/.test(phone)) return res.status(400).json({ message: 'رقم الجوال غير صالح.' });
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ message: 'البريد الإلكتروني غير صالح.' });

  // المبلغ يُحدَّد هنا من الخادم وليس من المتصفح
  const useAlt = !!b.alt && st.altFee != null;
  const base = useAlt ? st.altFee : st.fee;
  const amount = Math.round(base * (1 + VAT / 100) * 100);                           // بالهللة
  const ref = 'MSR-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();

  const description = `${COMPANY} - ${st.track} - ${st.name}${useAlt ? ' (فكرة من المنصة)' : ''} - العميل: ${name} - الجوال: ${phone} - رقم الطلب: ${ref}`;
  const metadata = { ref, track: st.track, stage: st.name, customer_name: name, customer_phone: phone };
  if (email) metadata.customer_email = email;
  if (city) metadata.city = city;
  if (capital) metadata.capital = capital;
  if (note) metadata.note = note;

  const payload = {
    amount, currency: 'SAR', description, metadata,
    success_url: `${SITE}/thanks.html?ref=${ref}`,
    back_url: `${SITE}/index.html#start`
  };
  const hrs = Number(process.env.INVOICE_EXPIRY_HOURS || 0);
  if (hrs > 0) payload.expired_at = new Date(Date.now() + hrs * 3600 * 1000).toISOString();

  try {
    const r = await fetch('https://api.moyasar.com/v1/invoices', {
      method: 'POST',
      headers: { 'Authorization': 'Basic ' + Buffer.from(SK + ':').toString('base64'), 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const j = await r.json().catch(() => null);
    if (!r.ok || !j || !j.url) {
      console.error('moyasar invoice failed, status', r.status);                      // لا نسجّل بيانات العميل
      return res.status(502).json({ message: 'تعذّر إنشاء الفاتورة لدى ميسر.' });
    }
    return res.status(200).json({ url: String(j.url).replace('lang=en', 'lang=ar') });
  } catch (e) {
    console.error('moyasar request error');
    return res.status(502).json({ message: 'تعذّر الاتصال بميسر.' });
  }
};
