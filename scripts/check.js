/* فحوص آلية قبل النشر: تُشغَّل محلياً بالأمر `node scripts/check.js` وتلقائياً في GitHub Actions.
   تفشل (exit 1) عند أي مشكلة. */
const fs = require('fs'), path = require('path'), cp = require('child_process');
const root = path.resolve(__dirname, '..');
let errors = [];
const err = m => errors.push(m);
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => {
  if (['.git', 'node_modules', '.vercel'].includes(e.name)) return [];
  const p = path.join(d, e.name); return e.isDirectory() ? walk(p) : [p];
});
const files = walk(root);
const rel = f => path.relative(root, f);

// 1) صياغة ملفات JavaScript
files.filter(f => f.endsWith('.js') && !f.includes('node_modules')).forEach(f => {
  try { cp.execFileSync('node', ['--check', f], { stdio: 'pipe' }); } catch (e) { err('خطأ صياغة JS: ' + rel(f)); }
});

// 2) صفحات HTML: العنوان والوصف واللغة والبيانات المنظمة والروابط المحلية
files.filter(f => f.endsWith('.html')).forEach(f => {
  const h = fs.readFileSync(f, 'utf8'), r = rel(f);
  const isEn = r.startsWith('en/');
  const wantAttr = isEn ? /<html[^>]+lang="en"[^>]+dir="ltr"/ : /<html[^>]+lang="ar"[^>]+dir="rtl"/;
  if (!wantAttr.test(h)) err(r + ': lang/dir غير صحيحين لهذه النسخة');
  const noindex = /<meta name="robots" content="noindex">/.test(h);
  if (!noindex && !/hreflang="ar"/.test(h)) err(r + ': hreflang مفقود');
  if (!/<title>[^<]{5,}<\/title>/.test(h)) err(r + ': عنوان ناقص');
  if (!/<meta name="description" content="[^"]{20,}"/.test(h)) err(r + ': وصف ناقص');
  if (!/rel="canonical" href="https:\/\/[^"]+"/.test(h)) err(r + ': canonical مفقود');
  [...h.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].forEach(m => {
    try { JSON.parse(m[1]); } catch (e) { err(r + ': JSON-LD غير صالح'); }
  });
  [...h.matchAll(/(?:href|src)="([^"]+)"/g)].map(m => m[1])
    .filter(u => !/^(https?:|mailto:|tel:|#|javascript:|data:)/.test(u))
    .forEach(u => {
      const p = path.join(path.dirname(f), u.split('#')[0].split('?')[0]);
      if (u.split('#')[0] && !fs.existsSync(p)) err(r + ': رابط محلي مكسور → ' + u);
    });
});

// 3) فحص تسرّب الأسرار
const secretRe = [/sk_(live|test)_[A-Za-z0-9]{8,}/, /ghp_[A-Za-z0-9]{20,}/, /github_pat_[A-Za-z0-9_]{20,}/, /-----BEGIN [A-Z ]*PRIVATE KEY-----/];
files.filter(f => !/\.(woff2?|png|jpg|jpeg|gif|ico)$/.test(f)).forEach(f => {
  const t = fs.readFileSync(f, 'utf8');
  secretRe.forEach(re => { if (re.test(t)) err('سر محتمل في الملف: ' + rel(f)); });
});
if (files.some(f => /(^|\/)\.env(\.|$)/.test(rel(f)))) err('ملف .env موجود في المستودع');

// 4) تطابق الأسعار بين الواجهة (data.js) والخادم (api و php)
try {
  const data = fs.readFileSync(path.join(root, 'assets/data.js'), 'utf8');
  const TRACKS = new Function(data + '; return TRACKS;')();
  const expect = {};
  TRACKS.forEach(t => t.stages.forEach(s => expect[s.id] = { fee: s.fee, altFee: s.alt ? s.alt.fee : null }));
  const dataEn = fs.readFileSync(path.join(root, 'assets/data.en.js'), 'utf8');
  const TRACKS_EN = new Function(dataEn + '; return TRACKS;')();
  TRACKS_EN.forEach(t => t.stages.forEach(s => {
    const e = expect[s.id];
    if (!e || e.fee !== s.fee || e.altFee !== (s.alt ? s.alt.fee : null)) err(`السعر/المعرّف في data.en.js لا يطابق data.js للمرحلة ${s.id}`);
  }));
  if (TRACKS_EN.flatMap(t => t.stages).length !== Object.keys(expect).length) err('عدد المراحل في data.en.js يختلف عن data.js');
  const serverStages = require(path.join(root, 'api/_lib/stages.js'));
  Object.keys(expect).forEach(id => {
    const row = serverStages[id];
    if (!row || row.fee !== expect[id].fee || row.altFee !== expect[id].altFee) err(`السعر غير متطابق للمرحلة ${id} في api/_lib/stages.js (شغّل البناء)`);
  });
  if (Object.keys(serverStages).length !== Object.keys(expect).length) err('عدد المراحل في api/_lib/stages.js يختلف عن data.js');

} catch (e) { err('تعذّر فحص تطابق الأسعار: ' + e.message); }

// 5) تطابق مفاتيح نصوص الواجهة بين العربية والإنجليزية
try {
  const cfg = { COMPANY: 'x', COMPANY_EN: 'y' };
  const loadT = f => new Function('CONFIG', 'fmt', fs.readFileSync(path.join(root, 'assets/' + f), 'utf8') + '; return T;')(cfg, n => n);
  const keys = (o, pre = '') => Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' && !Array.isArray(v)) ? keys(v, pre + k + '.') : [pre + k]);
  const a = keys(loadT('lang.ar.js')).sort(), e = keys(loadT('lang.en.js')).sort();
  a.filter(k => !e.includes(k)).forEach(k => err('مفتاح ترجمة مفقود في lang.en.js: ' + k));
  e.filter(k => !a.includes(k)).forEach(k => err('مفتاح ترجمة مفقود في lang.ar.js: ' + k));
} catch (e) { err('تعذّر فحص ملفات اللغة: ' + e.message); }

if (errors.length) { console.error('فشلت الفحوص:\n - ' + errors.join('\n - ')); process.exit(1); }
console.log('كل الفحوص نجحت (' + files.length + ' ملفاً).');
