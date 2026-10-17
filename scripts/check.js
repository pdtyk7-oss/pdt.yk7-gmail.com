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
  if (!/<html[^>]+lang="ar"[^>]+dir="rtl"/.test(h)) err(r + ': lang/dir غير صحيحين');
  if (!/<title>[^<]{5,}<\/title>/.test(h)) err(r + ': عنوان ناقص');
  if (!/<meta name="description" content="[^"]{20,}"/.test(h)) err(r + ': وصف ناقص');
  if (r !== 'thanks.html' && !/rel="canonical" href="https:\/\/[^"]+"/.test(h)) err(r + ': canonical مفقود');
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
  const node = fs.readFileSync(path.join(root, 'api/create-invoice.js'), 'utf8');
  const apiStages = JSON.parse(node.match(/const STAGES = (\{[\s\S]*?\n\});/)[1]);
  const php = fs.readFileSync(path.join(root, 'create-invoice.php'), 'utf8');
  const phpStages = JSON.parse(php.match(/<<<'JSON'\n([\s\S]*?)\nJSON/)[1]);
  Object.keys(expect).forEach(id => {
    [['api/create-invoice.js', apiStages], ['create-invoice.php', phpStages]].forEach(([n, S]) => {
      if (!S[id] || S[id].fee !== expect[id].fee || S[id].altFee !== expect[id].altFee) err(`السعر غير متطابق للمرحلة ${id} في ${n}`);
    });
  });
  if (Object.keys(apiStages).length !== Object.keys(expect).length) err('عدد المراحل في api يختلف عن data.js');
} catch (e) { err('تعذّر فحص تطابق الأسعار: ' + e.message); }

if (errors.length) { console.error('فشلت الفحوص:\n - ' + errors.join('\n - ')); process.exit(1); }
console.log('كل الفحوص نجحت (' + files.length + ' ملفاً).');
