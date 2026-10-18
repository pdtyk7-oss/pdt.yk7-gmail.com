import json
from pathlib import Path

ROOT = str(Path(__file__).resolve().parent.parent)   # the site folder
CO = 'مسار المشاريع والتطوير APT'
ADDR = 'الدمام، المنطقة الشرقية، المملكة العربية السعودية'
SITE = 'https://www.masarpdt-sa.com'
UPDATED = 'أكتوبر 2026'

DEFS = '''<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
<filter id="rough" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="4" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="3.6" xChannelSelector="R" yChannelSelector="G"/></filter>
<filter id="ink" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="3" seed="9" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="2.6" xChannelSelector="R" yChannelSelector="G"/></filter>
<filter id="rough-s" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="4" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="1.5" xChannelSelector="R" yChannelSelector="G"/></filter>
</svg>'''

WA_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.7 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.3-.2-.5-.3z"/></svg>'

CO_EN = 'Masar Projects and Development APT'
ADDR_EN = 'Dammam, Eastern Province, Saudi Arabia'
UPDATED_EN = 'October 2026'

GLOBE = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12 H21 M12 3 C8 7 8 17 12 21 M12 3 C16 7 16 17 12 21"/></svg>'


def emblem(label):
    return f'''<svg class="emblem" viewBox="0 0 64 64" role="img" aria-label="{label}">
<rect class="badge" width="64" height="64" rx="15"/>
<path class="way" d="M18 51 C18 39 46 42 46 30 C46 21 20 26 22 15"/>
<path class="dash" d="M18 51 C18 39 46 42 46 30 C46 21 20 26 22 15"/>
<circle class="pin" cx="22" cy="14" r="6.6"/><circle class="dot" cx="22" cy="14" r="2.6"/>
</svg>'''

def ico(d, extra=''):
    return f'<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" filter="url(#rough-s)"><path d="{d}"/>{extra}</svg>'

ICONS = {
 'home': ico('M3 11 L12 3 L21 11 M5 10 V20 H19 V10 M10 20 V14 H14 V20'),
 'about': ico('M12 11 V17', '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="7.6" r=".6"/>'),
 'tracks': ico('M12 3 V21 M12 5 H19 L21 7.5 L19 10 H12 M12 12 H5 L3 14.5 L5 17 H12'),
 'policy': ico('M6 3 H14 L19 8 V21 H6 Z M14 3 V8 H19 M9 13 H16 M9 17 H14'),
 'privacy': ico('M6 11 H18 V21 H6 Z M8 11 V8 A4 4 0 0 1 16 8 V11 M12 15 V17.5'),
 'security': ico('M12 3 L19 6 V12 C19 16.5 16 19.5 12 21 C8 19.5 5 16.5 5 12 V6 Z M9 12 L11.5 14.5 L15.5 9.5'),
}

def head(title, desc, jsonld=None, path=None, noindex=False, lang='ar'):
    en = lang == 'en'
    P = '../' if en else ''
    company = CO_EN if en else CO
    canon = ''
    if path is not None:
        cu = f'{SITE}/en/{path}' if en else f'{SITE}/{path}'
        canon = f'<link rel="canonical" href="{cu}">\n<meta property="og:url" content="{cu}">'
        if not noindex:
            canon += f'\n<link rel="alternate" hreflang="ar" href="{SITE}/{path}">\n<link rel="alternate" hreflang="en" href="{SITE}/en/{path}">\n<link rel="alternate" hreflang="x-default" href="{SITE}/{path}">'
    robots = '<meta name="robots" content="noindex">' if noindex else ''
    ld = ''.join('<script type="application/ld+json">%s</script>\n' % json.dumps(o, ensure_ascii=False) for o in (jsonld or []))
    html_attr = 'lang="en" dir="ltr"' if en else 'lang="ar" dir="rtl"'
    skip = 'Skip to content' if en else 'تخطَّ إلى المحتوى'
    return f"""<!doctype html>
<html {html_attr}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#F2F4F0">
<meta property="og:type" content="website">
<meta property="og:locale" content="{'en_US' if en else 'ar_SA'}">
<meta property="og:site_name" content="{company}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="{SITE}/assets/logo.png">
<link rel="icon" href="{P}assets/logo.svg" type="image/svg+xml">
{canon}
{robots}
<link rel="stylesheet" href="{P}assets/style.css">
{ld}</head>
<body>
{DEFS}
<a class="skip" href="#main">{skip}</a>
"""

def header(cur='', lang='ar', page='index.html'):
    en = lang == 'en'
    if en:
        nav = [('index.html','Home','home'),('about.html','About','about'),('tracks.html','Tracks and fees','tracks'),('policy.html','Policy','policy'),('privacy.html','Privacy','privacy'),('security.html','Security','security')]
        cta, brand_word, company, aria_home, aria_nav, logo_lbl = 'Start your request', 'Masar', CO_EN, f'{CO_EN} - Home', 'Main navigation', 'Masar logo'
        sw = f'<a class="lang" href="../{page}" lang="ar" hreflang="ar" aria-label="التبديل إلى العربية">{GLOBE}<span>العربية</span></a>'
    else:
        nav = [('index.html','الرئيسية','home'),('about.html','من نحن','about'),('tracks.html','المسارات والرسوم','tracks'),('policy.html','سياستنا','policy'),('privacy.html','الخصوصية','privacy'),('security.html','الأمان','security')]
        cta, brand_word, company, aria_home, aria_nav, logo_lbl = 'ابدأ طلبك', 'مسار', CO, f'{CO} - الصفحة الرئيسية', 'التنقل الرئيسي', 'شعار مسار'
        sw = f'<a class="lang" href="en/{page}" lang="en" hreflang="en" aria-label="Switch to English">{GLOBE}<span>English</span></a>'
    links = '\n    '.join(
        f'<a href="{h}"' + (' aria-current="page"' if cur == k else '') + f'>{ICONS[k]}<span>{t}</span></a>'
        for h, t, k in nav)
    return f"""<header class="top wrap">
  <div class="top-row">
    <a class="brand" href="index.html" aria-label="{aria_home}">
      {emblem(logo_lbl)}
      <span class="brand-text">
        <span class="wordmark">{brand_word}<svg class="swoosh" viewBox="0 0 120 12" preserveAspectRatio="none" aria-hidden="true"><path d="M3 6 H117"/></svg></span>
        <span class="co">{company}</span>
      </span>
    </a>
    <div class="top-actions">
      {sw}
      <a class="btn" href="index.html#start">{cta}</a>
    </div>
  </div>
  <nav class="nav" aria-label="{aria_nav}">
    {links}
  </nav>
</header>
<main id="main">
"""

def footer(lang='ar'):
    if lang == 'en':
        return f"""</main>
<footer>
  <div class="wrap">
    <div>
      <div class="fbrand">{emblem('Masar logo')}<h2>{CO_EN}</h2></div>
      <p>Consulting and guidance with field experience, by live online broadcast. We guide, supervise and follow up, and we do not execute.</p>
      <p>{ADDR_EN}</p>
    </div>
    <div>
      <h2>Links</h2>
      <ul>
        <li><a href="about.html">About us</a></li>
        <li><a href="tracks.html">Tracks and fees</a></li>
        <li><a href="policy.html">Our policy</a></li>
        <li><a href="privacy.html">Privacy</a></li>
        <li><a href="security.html">Security</a></li>
      </ul>
    </div>
    <div>
      <h2>Contact us</h2>
      <ul data-contact></ul>
    </div>
    <p class="legal"><span data-legal></span> Online payments are made through Moyasar invoices; Moyasar is licensed by the Saudi Central Bank.</p>
  </div>
</footer>
<a class="wa-fab" href="#" data-wa="Hello, I would like to ask about the services of {CO_EN}." aria-label="Contact via WhatsApp">{WA_ICON}<span>WhatsApp</span></a>
<div id="toast" role="status" hidden></div>
"""
    return f"""</main>
<footer>
  <div class="wrap">
    <div>
      <div class="fbrand">{emblem('شعار مسار')}<h2>{CO}</h2></div>
      <p>استشارات وتوعية إرشادية بخبرة ميدانية، بث مباشر أونلاين. نُرشد ونُشرف ونتابع، ولا ننفّذ.</p>
      <p>{ADDR}</p>
    </div>
    <div>
      <h2>روابط</h2>
      <ul>
        <li><a href="about.html">من نحن</a></li>
        <li><a href="tracks.html">المسارات والرسوم</a></li>
        <li><a href="policy.html">سياستنا</a></li>
        <li><a href="privacy.html">الخصوصية</a></li>
        <li><a href="security.html">الأمان</a></li>
      </ul>
    </div>
    <div>
      <h2>تواصل معنا</h2>
      <ul data-contact></ul>
    </div>
    <p class="legal"><span data-legal></span> الدفع الإلكتروني عبر فواتير ميسر المرخصة من البنك المركزي السعودي.</p>
  </div>
</footer>
<a class="wa-fab" href="#" data-wa="السلام عليكم، أرغب في الاستفسار عن خدمات {CO}." aria-label="تواصل عبر واتساب">{WA_ICON}<span>واتساب</span></a>
<div id="toast" role="status" hidden></div>
"""

def tail(extra='', lang='ar'):
    P = '../' if lang == 'en' else ''
    return f"""<script src="{P}assets/config.js"></script>
<script src="{P}assets/lang.{lang}.js"></script>
<script src="{P}assets/common.js"></script>
{extra}</body>
</html>
"""

HERO_P = "M430 432 C350 432 410 372 335 352 C262 332 300 282 228 262 C158 242 198 192 148 162 C108 138 96 118 104 92"
HERO = {
 'ar': dict(aria='مسار من خمس محطات: نفهم احتياجك، نحلل وضعك، نوضح الخيارات، تقرر أنت، نشرف على المسار',
            labels=['نفهم احتياجك','نحلل وضعك','نوضح الخيارات','تقرر أنت','نشرف على المسار']),
 'en': dict(aria='A path with five stops: we understand your need, we analyze your case, we clarify the options, you decide, we oversee the path',
            labels=['We understand your need','We analyze your case','We clarify the options','You decide','We oversee the path']),
}
def hero_svg(lang='ar'):
    mirror = lang == 'en'
    H = HERO[lang]
    pos = [(.6,440,482,'middle'),(1.2,318,382,'end'),(1.8,210,292,'end'),(2.3,172,142,'start'),(2.8,168,70,'start')]
    texts = []
    for (d,x,y,an),lab in zip(pos, H['labels']):
        if mirror:
            x = 560 - x
            an = {'start':'end','end':'start','middle':'middle'}[an]
        texts.append(f'<text class="lab" style="animation-delay:{d}s" x="{x}" y="{y}" text-anchor="{an}">{lab}</text>')
    g_open = '<g transform="translate(560 0) scale(-1 1)">' if mirror else '<g>'
    return f"""<svg class="pathfig" direction="ltr" viewBox="0 0 560 495" role="img" aria-label="{H['aria']}">
      {g_open}<g filter="url(#rough)">
        <path class="ln" d="M20 452 C120 444 240 458 360 448 S500 454 545 446"/>
        <path class="ln trail" d="{HERO_P}"/>
        <path class="pen" pathLength="1" d="{HERO_P}"/>
        <g transform="translate(-22 0)">
          <circle class="mk" cx="470" cy="388" r="28"/>
          <path class="ln" d="M448 382 C448 364 460 356 468 356 C478 356 490 364 490 382 C490 394 480 398 478 408 H458 C456 398 448 394 448 382 Z"/>
          <path class="ln" d="M459 416 H477 M461 424 H475"/>
          <path class="ln" d="M468 342 V330 M490 348 L498 340 M446 348 L438 340 M500 374 H510 M436 374 H426"/>
        </g>
        <path class="ln" d="M335 352 V318"/><path class="flag" style="animation-delay:1.2s" d="M335 318 L362 327 L335 336 Z"/>
        <path class="ln" d="M228 262 V228"/><path class="flag" style="animation-delay:1.8s" d="M228 228 L255 237 L228 246 Z"/>
        <path class="ln" d="M148 162 V128"/><path class="flag" style="animation-delay:2.3s" d="M148 128 L121 137 L148 146 Z"/>
        <path class="mk" transform="translate(5 4)" d="M60 56 L104 18 L148 56 Z"/>
        <path class="ln" d="M70 94 V54 H138 V94 M60 56 L104 18 L148 56 M96 94 V72 H112 V94 M76 62 h12 v10 h-12 z M50 94 H158"/>
      </g></g>
      {''.join(texts)}
    </svg>"""

ORG = {
  "@context": "https://schema.org", "@type": "ProfessionalService",
  "name": CO,
  "description": "استشارات وتوعية إرشادية بخبرة ميدانية للمشاريع الناشئة والمتعثرة وتطوير المشاريع والتطوير العقاري، بث مباشر أونلاين.",
  "url": "https://www.masarpdt-sa.com/",
  "areaServed": "SA", "availableLanguage": "ar",
  "address": {"@type": "PostalAddress", "addressLocality": "الدمام", "addressRegion": "المنطقة الشرقية", "addressCountry": "SA"},
  "serviceType": ["المشاريع الناشئة", "تطوير المشاريع", "المشاريع المتعثرة", "التطوير العقاري"]
}

FAQ = [
 ("هل تنفّذون المشروع بأنفسكم؟", "لا. مهمتنا التوعية وتوضيح المسار الصحيح، والإشراف والمتابعة حسب الاتفاق المبرم. أي خدمة تنفيذية تتم عبر الجهة المختصة المستقلة، وتحت إشرافنا ومتابعتنا."),
 ("هل تغنون عن المكتب الهندسي أو الجهات المرخصة؟", "لا. نحن لا نحل محل المكتب الهندسي ولا نمارس الأعمال الهندسية المرخصة بدلاً عنه. نساعدك على تحديد احتياجك واختيار المكتب المناسب، ثم نتابع المسار ونُشرف على التنفيذ حسب الاتفاق."),
 ("ماذا لو لم تكن فكرتي مناسبة؟", "إذا لم تكن الفكرة مناسبة بعد التقييم الأولي ضمن المرحلة الأولى من مسار المشاريع الناشئة، نطرح عليك ثلاثة بدائل مناسبة."),
 ("أين مقركم وكيف تتم الجلسات؟", "مقرنا في الدمام بالمنطقة الشرقية في المملكة العربية السعودية، وتتم الجلسات عبر بث مباشر أونلاين على Google Meet فلا تحتاج إلى الحضور أو التنقل."),
 ("متى أحجز موعد الاستشارة؟", "لا يُفتح الحجز إلا بعد أن يؤكد النظام استلام الدفع من ميسر. بعد الدفع تُنقل إلى صفحة الحجز فتختار يوماً ووقتاً من 10 صباحاً حتى 3 مساءً بتوقيت مكة المكرمة. يصلك رابط اجتماع Google Meet على الشاشة وعلى بريدك إن أدخلته، ويمكنك إرساله إلينا عبر واتساب."),
 ("كيف أدفع، وهل كل المراحل تُدفع من الموقع؟", "رسوم المراحل المحددة تُدفع عبر فاتورة إلكترونية على صفحة ميسر المعتمدة، وفيها بياناتك ونوع الخدمة والمبلغ. وبعد تأكيد الدفع يُفتح حجز موعد الاستشارة. أما المراحل المكتوب عليها «حسب الاتفاق» أو «حسب العقد» فلا تُدفع من الموقع، بل نتواصل معك لتحديد نطاق العمل والرسوم ثم يُبرم الاتفاق."),
 ("هل تحفظون بيانات بطاقتي أو بياناتي؟", "لا يمر رقم بطاقتك بموقعنا أبداً لأن الدفع يتم على صفحة ميسر. ولا يحتفظ الموقع بقاعدة بيانات للطلبات. تفاصيل ذلك في صفحة الخصوصية وصفحة الأمان."),
 ("هل رسوم التصميم والتراخيص في التطوير العقاري تشمل رسوم المكتب الهندسي والرسوم الحكومية؟", "لا. رسوم مرحلة التصميم والتخطيط غير شاملة رسوم المكتب الهندسي، ورسوم مرحلة التراخيص غير شاملة الرسوم الحكومية."),
 ("كيف تختارون المنفّذين والمقاولين؟", "نقيّم المنفّذ المناسب وفق طبيعة مشروعك ومتطلباته، وليس على أساس السعر فقط. وعند الحاجة نستعين بأفضل ثلاثة مكاتب لكل قسم تنفيذي مختص."),
]
FAQ_LD = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
  {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in FAQ]}

CHEV = '<svg viewBox="0 0 40 24" aria-hidden="true"><path d="M36 12 C26 11 14 12 5 12 M13 4 C10 8 8 10 5 12 C8 14 10 16 13 20"/></svg>'

# ============================ الرئيسية ============================
def index():
    faq_html = ''.join(f'<details><summary>{q}</summary><p>{a}</p></details>' for q, a in FAQ)
    scn = [("startup", "عندي فكرة مشروع ولا أعرف هل تستحق أن أبدأ بها", "المشاريع الناشئة"),
           ("develop", "مشروعي قائم لكن أداءه لا يرضيني وأريد تطويره", "تطوير المشاريع"),
           ("stalled", "مشروعي تعثّر ولا أعرف السبب الحقيقي", "المشاريع المتعثرة"),
           ("realestate", "أريد أن أبني أو أطوّر عقاراً وأخشى الأخطاء والتكاليف غير الضرورية", "التطوير العقاري")]
    scn_html = ''.join(f'<button class="scn" data-pick="{k}" type="button"><span class="q">{q}<span class="t">{t}</span></span>{CHEV}</button>' for k, q, t in scn)
    svg = hero_svg('ar')
    pin = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22 C7 16 5 13 5 10 A7 7 0 0 1 19 10 C19 13 17 16 12 22 Z" fill="none" stroke="#1A2547" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.5" fill="#CF3A2B"/></svg>'
    arrow = '<svg viewBox="0 0 28 36" aria-hidden="true"><path d="M20 34 C10 28 8 16 14 5 M6 12 L14 4 L21 11"/></svg>'
    body = head(f'{CO} | استشارات المشاريع الناشئة والمتعثرة والتطوير العقاري في الدمام',
                'استشارات وتوعية إرشادية بخبرة ميدانية للمشاريع الناشئة والمتعثرة وتطوير المشاريع والتطوير العقاري، من الدمام لكل المملكة. بث مباشر أونلاين وفاتورة دفع عبر ميسر.',
                [ORG, FAQ_LD], path='') + header('home', 'ar', 'index.html') + f'''
<section class="hero" aria-labelledby="h1">
  <div class="wrap">
    <div>
      <span class="where">{pin}{ADDR}</span>
      <h1 id="h1">نوضّح لك الطريق قبل أن تبدأ، وقبل أن تدفع ثمن الخطأ</h1>
      <p class="lead">استشارات وتوعية إرشادية من خبرة عملية ميدانية متراكمة، لأصحاب المشاريع الناشئة والمتعثرة والقائمة، ولمن يريد البناء أو التطوير العقاري. نُرشدك ونُشرف ونتابع، ولا ننفّذ بأنفسنا.</p>
      <span class="live"><i aria-hidden="true"></i>بث مباشر أونلاين</span>
      <div class="cta-row">
        <span class="cta-wrap"><a class="btn" href="#start">ابدأ طلبك الآن</a><span class="note cta-note">{arrow}ابدأ من هنا</span></span>
        <a class="btn wa" href="#" data-wa="السلام عليكم، أرغب في الاستفسار عن خدمات {CO}.">{WA_ICON}تحدّث معنا عبر واتساب</a>
      </div>
    </div>
    {svg}
  </div>
</section>

<section id="who" aria-labelledby="who-h">
  <div class="wrap">
    <h2 id="who-h">أيّ هذه الجمل تشبه وضعك؟</h2>
    <p class="sec-sub">اختر الأقرب إليك، وننقلك مباشرة إلى المسار المناسب في نموذج الطلب.</p>
    <div class="scn-list">{scn_html}</div>
  </div>
</section>

<section class="role" id="role" aria-labelledby="role-h">
  <div class="wrap">
    <h2 id="role-h">دورنا محدد وواضح: توعية وإشراف، لا تنفيذ</h2>
    <p class="sec-sub">«{CO}» جهة إرشاد وتوعية. أي خدمة تنفيذية تتم عبر جهة مختصة مستقلة، وتحت إشرافنا ومتابعتنا حسب الاتفاق المبرم.</p>
    <div class="role-grid">
      <span class="stamp-big" aria-hidden="true">نُشرف ولا ننفّذ</span>
      <div class="panel do sketch">
        <h3>ما نقوم به</h3>
        <ul>
          <li>نفهم احتياجك ونحلل وضعك وإمكانياتك.</li>
          <li>نوضح الخيارات المتاحة والمخاطر المحتملة قبل أي قرار.</li>
          <li>نُرشدك إلى ما تحتاجه، ومن تحتاجه، ومتى تحتاجه.</li>
          <li>نُشرف ونتابع على جهة التنفيذ حسب الاتفاق المبرم.</li>
        </ul>
      </div>
      <div class="panel dont sketch red">
        <h3>ما لا نقوم به</h3>
        <ul>
          <li>لا ننفّذ الأعمال بأنفسنا نهائياً.</li>
          <li>لا نحل محل المكتب الهندسي، ولا نمارس الأعمال الهندسية المرخصة بدلاً عنه.</li>
          <li>لا نجعل رأينا بديلاً عن رأي الجهة الفنية أو النظامية أو القانونية المرخصة.</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section id="method" aria-labelledby="method-h">
  <div class="wrap">
    <h2 id="method-h">نبدأ بفهم احتياجك، ثم نقول لك أيّ نوع من المعلومات بين يديك</h2>
    <p class="sec-sub">نحلل الوضع ونوضح الخيارات، ونميّز دائماً بين أربعة أنواع من المعلومات:</p>
    <div class="kinds">
      <div class="kind"><svg viewBox="0 0 56 56" aria-hidden="true" filter="url(#rough)"><circle class="mk" cx="25" cy="25" r="15" transform="translate(3 3)"/><circle cx="24" cy="24" r="15"/><path d="M35 35 L50 50"/></svg><b>معلومة تحتاج إلى تحقق</b></div>
      <div class="kind"><svg viewBox="0 0 56 56" aria-hidden="true" filter="url(#rough)"><path class="mk" d="M8 48 V10 L46 48 Z" transform="translate(3 3)"/><path d="M8 48 V10 L46 48 Z M8 20 H14 M8 30 H16 M8 40 H14 M20 48 V42 M30 48 V40 M40 48 V44"/></svg><b>معلومة فنية أو هندسية</b></div>
      <div class="kind"><svg viewBox="0 0 56 56" aria-hidden="true" filter="url(#rough)"><circle class="mk" cx="13" cy="39" r="8" transform="translate(3 3)"/><path d="M28 8 V48 M16 48 H40 M10 16 H46 M10 16 L4 32 H18 Z M46 16 L40 32 H52 Z"/></svg><b>معلومة نظامية أو قانونية</b></div>
      <div class="kind"><svg viewBox="0 0 56 56" aria-hidden="true" filter="url(#rough)"><circle class="mk" cx="28" cy="28" r="19" transform="translate(3 3)"/><circle cx="28" cy="28" r="19"/><path d="M28 16 V40 M22 21 C22 17 34 17 34 22 C34 27 22 28 22 33 C22 38 34 38 34 34"/></svg><b>توصية تجارية</b></div>
    </div>
    <p class="after">وبذلك تعرف طبيعة المعلومة التي تعتمد عليها قبل أن تتخذ قراراتك المستقبلية.</p>
  </div>
</section>

<section class="quote" aria-label="رسالتنا">
  <div class="wrap">
    <blockquote>الخبرة عندما تتحول إلى معرفة ويستفيد منها الآخرون، تصبح قيمة.</blockquote>
    <p>نسعى إلى نقل الخبرة بصورة عملية ومبسطة، ومساعدة أفراد المجتمع وأصحاب المشاريع على رؤية الطريق بصورة أوضح قبل البدء، وأثناء التطوير، وعند مواجهة التعثر. <a href="about.html">تعرّف علينا أكثر</a>.</p>
  </div>
</section>

<section class="start" id="start" aria-labelledby="start-h">
  <div class="wrap">
    <h2 id="start-h">ابدأ طلبك في أربع خطوات</h2>
    <p class="sec-sub">اختر المسار والمرحلة، وأدخل بياناتك، ثم ننقلك إلى فاتورة رسمية على صفحة ميسر المعتمدة تدفع منها. وإن كانت المرحلة «حسب الاتفاق» نرسل طلبك عبر واتساب ونتواصل معك لتحديد التفاصيل.</p>
    <div class="form-sheet sketch" id="wz">
      <ol class="prog" id="prog" aria-label="خطوات الطلب"></ol>
      <div id="wz-body" aria-live="polite"></div>
    </div>
  </div>
</section>

<section id="faq" aria-labelledby="faq-h">
  <div class="wrap">
    <h2 id="faq-h">أسئلة يسألها العملاء قبل التسجيل</h2>
    <div class="faq">{faq_html}</div>
  </div>
</section>
''' + footer('ar') + tail('<script src="assets/data.js"></script>\n<script src="assets/app.js"></script>\n', 'ar')
    open(ROOT + '/index.html', 'w', encoding='utf-8').write(body)

# ============================ صفحة المستند ============================
def doc_page(fname, key, title, desc, intro, sections, extra_ld=None, extra_html='', lang='ar'):
    en = lang == 'en'
    company = CO_EN if en else CO
    toc_lbl, toc_h = ('Contents of this page', 'On this page') if en else ('محتويات الصفحة', 'في هذه الصفحة')
    upd = (f'Last updated: {UPDATED_EN}. This page applies from the date it is published unless amended, and the date of the last update appears here.'
           if en else f'آخر تحديث: {UPDATED}. تسري هذه الصفحة منذ نشرها ما لم تُعدَّل، ويظهر تاريخ آخر تحديث هنا.')
    toc = ''.join(f'<a href="#{i}">{t}</a>' for i, t, _ in sections)
    arts = ''.join(f'<h2 id="{i}">{t}</h2>{b}' for i, t, b in sections)
    html = head(f'{title} | {company}', desc, extra_ld, path=fname, lang=lang) + header(key, lang, fname) + f"""
<div class="wrap doc-hero">
  <h1>{title}</h1>
  <p>{intro}</p>
</div>
<div class="wrap doc">
  <aside class="toc sketch" aria-label="{toc_lbl}"><b>{toc_h}</b>{toc}</aside>
  <article class="article">{arts}{extra_html}<p class="updated">{upd}</p></article>
</div>
""" + footer(lang) + tail('', lang)
    import os
    out = f'{ROOT}/en' if en else ROOT
    os.makedirs(out, exist_ok=True)
    open(f'{out}/{fname}', 'w', encoding='utf-8').write(html)

# ============================ من نحن ============================
def about():
    sea = '<svg viewBox="0 0 84 68" aria-hidden="true" filter="url(#rough)"><path class="pin" d="M42 38 C34 28 32 24 32 19 A10 10 0 0 1 52 19 C52 24 50 28 42 38 Z"/><circle cx="42" cy="19" r="3.5" fill="#fff" stroke="none"/><path class="sea" d="M4 50 C14 44 22 56 32 50 S50 44 60 50 S74 56 80 50"/><path class="sea" d="M4 60 C14 54 22 66 32 60 S50 54 60 60 S74 66 80 60"/></svg>'
    secs = [
     ('who', 'من نحن', f'''<p>{CO}، مقرها الدمام في المنطقة الشرقية بالمملكة العربية السعودية. منصة تهدف إلى المساهمة في تقديم الخبرات والاستشارات والتوعية الإرشادية لشريحة من أفراد المجتمع، للاستفادة من الخبرات العملية والميدانية المتراكمة في مجالات متعددة.</p>
<p>نساعد الأفراد وأصحاب المشاريع الناشئة، ونطوّر المشاريع القائمة والمتعثرة، ونرافق المطورين العقاريين، لنرى الطريق بصورة أوضح قبل البدء، ونعرف المسار الصحيح بصورة عملية ومبسطة.</p>
<div class="place">{sea}<span>{ADDR}. الجلسات عبر بث مباشر أونلاين.</span></div>'''),
     ('what', 'ماذا نقدم', '''<p>الاستشارات عندنا ليست مجرد إحالة العميل إلى مستشارين ومتخصصين. التوعية والتوجيه الأساسية نقدمها نحن من خبرتنا العملية والميدانية. وعندما تتطلب المسألة تخصصاً أو ترخيصاً معيناً، نوعّي العميل بما يحتاج إليه، ومن يحتاج إليه، ومتى يحتاج إليه، مع الاستعانة بالمتخصصين والجهات المرخصة في المجالات الفنية والهندسية والنظامية والقانونية والدوائر الحكومية.</p>
<p>مساراتنا:</p>
<ul>
<li><a href="tracks.html">المشاريع الناشئة</a>: من الفكرة إلى مشروع قابل للدراسة والتنفيذ.</li>
<li><a href="tracks.html">تطوير المشاريع</a>: مراجعة المشروع القائم وتحديد فرص التحسين والتوسع.</li>
<li><a href="tracks.html">المشاريع المتعثرة</a>: فهم سبب التعثر أولاً ثم اختيار الحل الذي يستحق أن يُبنى عليه القرار.</li>
<li><a href="tracks.html">التطوير العقاري</a>: من فكرة البناء ومراحله إلى التراخيص والإشراف على التنفيذ.</li>
</ul>'''),
     ('how', 'كيف نعمل', '''<p>نبدأ بفهم الاحتياج، ثم نحلل الوضع، ونوضح الخيارات. وفي كل ذلك نميّز بين أربعة أنواع من المعلومات: المعلومة التي تحتاج إلى تحقق، والمعلومة الفنية أو الهندسية، والمعلومة النظامية أو القانونية، والتوصية التجارية. وبذلك يعرف العميل طبيعة المعلومة التي يعتمد عليها قبل أن يتخذ قراراته.</p>
<p>ونحن ندرك أن الهدف ليس تقديم معلومة أو فكرة فحسب، بل مساعدة العميل على تجنب الأخطاء والوصول إلى المسار الصحيح ليتخذ قراراً أفضل.</p>'''),
     ('limits', 'حدود دورنا', f'''<div class="callout sketch red"><b>نُشرف ولا ننفّذ</b>مهمة «{CO}» مقتصرة على التوعية وتوضيح المسار الصحيح والسليم لتجنب المخاطر المحتملة، والإشراف والمتابعة حسب الاتفاق المبرم. ولا ننفّذ الأعمال بأنفسنا نهائياً. أي خدمة تنفيذية تكون عن طريق الجهة المختصة المستقلة، وتحت إشرافنا ومتابعتنا حسب الاتفاق.</div>
<p>ولا نحل محل المكتب الهندسي ولا نمارس الأعمال الهندسية المرخصة بدلاً عنه. ومكاتب الخدمات والاستشارات المهنية والجهات المختصة والمرخصة جهات تنفيذية متخصصة مستقلة، ونوجه العميل إلى الاختيار المناسب منها.</p>'''),
     ('mission', 'رسالتنا وغايتنا', '''<p>الخبرة عندما تتحول إلى معرفة ويستفيد منها الآخرون، تصبح قيمة. نسعى إلى نقل الخبرة بصورة عملية ومبسطة، ومساعدة أفراد المجتمع وأصحاب المشاريع على رؤية الطريق بصورة أوضح قبل البدء، وأثناء التطوير، وعند مواجهة التعثر.</p>'''),
     ('contact', 'تواصل معنا', f'''<p>العنوان: {ADDR}.</p><ul data-contact></ul><p><span data-legal></span></p>
<p><a class="btn" href="index.html#start">ابدأ طلبك</a></p>'''),
    ]
    doc_page('about.html', 'about', 'من نحن', f'تعرّف على {CO} في الدمام: منصة استشارات وتوعية إرشادية بخبرة ميدانية للمشاريع الناشئة والمتعثرة والتطوير العقاري.',
             'منصة سعودية تقدّم الاستشارات والتوعية الإرشادية، وتُشرف وتتابع ولا تنفّذ.', secs, [ORG])

# ============================ الخصوصية ============================
def privacy():
    secs = [
     ('intro', 'مقدمة', f'''<p>تشرح هذه الصفحة كيف تتعامل {CO} («نحن») مع بياناتك عند استخدامك هذا الموقع، ومقرنا في {ADDR}. نلتزم بنظام حماية البيانات الشخصية في المملكة العربية السعودية، ونحرص على جمع أقل قدر ممكن من البيانات.</p>'''),
     ('collect', 'البيانات التي نتلقاها', '''<p>عند تعبئة نموذج الطلب تُدخل:</p>
<ul><li>الاسم الكامل ورقم الجوال (إلزاميان).</li><li>البريد الإلكتروني والمدينة ونطاق رأس المال (اختيارية).</li><li>نبذة مختصرة عن فكرتك أو مشروعك.</li><li>عند حجز الموعد: بريدك الإلكتروني (اختياري) وملاحظاتك للجلسة.</li></ul>
<p>إن اخترت التواصل عبر واتساب، فإن ما ترسله إلينا هناك هو ما تكتبه أنت.</p>
<div class="callout sketch soft"><b>بيانات بطاقتك</b>لا نطلبها ولا نراها ولا نخزّنها. تُدخل بيانات الدفع في صفحة الفاتورة المستضافة لدى ميسر وحدها.</div>'''),
     ('use', 'كيف نستخدم بياناتك', '''<ul><li>إنشاء فاتورة الدفع الخاصة بطلبك، وتظهر فيها بياناتك ونوع الخدمة والمبلغ.</li><li>حجز موعد الاستشارة وإرسال رابط اجتماع Google Meet إليك.</li><li>التواصل معك لتحديد نطاق العمل.</li><li>تقديم الخدمة المتفق عليها، والمحاسبة والمطابقة المالية.</li></ul>
<p>لا نستخدم بياناتك للتسويق لجهات أخرى، ولا نبيعها.</p>'''),
     ('store', 'هل يخزّن الموقع بياناتي؟', '''<p>لا يحتفظ هذا الموقع بقاعدة بيانات للطلبات، ولا يحفظ ما تدخله في متصفحك بعد إغلاق الصفحة. عند الضغط على زر الدفع تُرسل بياناتك مرة واحدة إلى خادم الموقع لإنشاء الفاتورة لدى ميسر، ثم تنتقل إلى صفحة الفاتورة. لا نسجّل بياناتك في سجلات الخادم.</p>
<p>تبقى بيانات الفاتورة (ومنها بيانات الاتصال ونبذتك المختصرة) محفوظة ضمن سجلات الفاتورة في حسابنا لدى ميسر، لأغراض المحاسبة والمطابقة وخدمتك.</p>
<p>وعند حجز الموعد يُنشأ حدث في تقويم Google الخاص بنا يحوي اسمك وجوالك والخدمة وملاحظاتك، ليعرف فريقنا موعد الجلسة. ولا نحتفظ بنسخة أخرى من هذه البيانات.</p>'''),
     ('share', 'مع من نشارك بياناتك', '''<ul>
<li><b>ميسر</b>: مزود خدمات الدفع الذي تتم عبره الفاتورة والدفع، وهو مرخص من البنك المركزي السعودي. تخضع معالجته لبياناتك لسياساته.</li>
<li><b>Google</b>: تقويم Google وGoogle Meet لجدولة الجلسة وإنشاء رابط الاجتماع، وتُرسل دعوة الاجتماع إلى بريدك إن أدخلته. تخضع معالجتها لسياسات Google.</li>
<li><b>واتساب</b>: فقط إن اخترت التواصل عبره، وتخضع المحادثة لسياسة واتساب.</li>
<li><b>مزود استضافة الموقع</b>: يعالج الطلبات تقنياً لتشغيل الموقع.</li>
<li><b>الجهات المتخصصة والمرخصة</b>: لا نشارك بياناتك معها إلا بموافقتك وعند الحاجة لتنفيذ ما اتفقنا عليه.</li>
</ul>
<p>وقد نفصح عن البيانات إذا طلبت ذلك جهة نظامية مختصة وفق الأنظمة المعمول بها في المملكة.</p>'''),
     ('cookies', 'ملفات تعريف الارتباط والتتبع', '''<p>لا يستخدم الموقع ملفات تعريف ارتباط تتبعية ولا أدوات تحليلات أو إعلانات. والخطوط محفوظة على خادم الموقع ولا تُحمَّل من أطراف خارجية. أما صفحة الفاتورة التابعة لميسر فلها سياساتها الخاصة.</p>'''),
     ('rights', 'حقوقك', f'''<p>لك الحق في الاطلاع على بياناتك الشخصية وطلب تصحيحها أو إتلافها، وفي الاعتراض على معالجتها، وفق نظام حماية البيانات الشخصية. لممارسة أي حق، تواصل معنا: <span data-contact-line></span>. وسنرد عليك خلال مدة معقولة.</p>
<p>ولاحظ أن بيانات الفواتير قد يلزم الاحتفاظ بها لدى ميسر وفي سجلاتنا المحاسبية مدة يفرضها النظام.</p>'''),
     ('minors', 'القاصرون', '''<p>خدماتنا موجهة للبالغين، ولا نجمع بيانات القاصرين عن قصد.</p>'''),
     ('changes', 'التعديلات', '''<p>قد نحدّث هذه الصفحة عند تغيّر ممارساتنا، ويظهر تاريخ آخر تحديث في أسفلها.</p>'''),
    ]
    doc_page('privacy.html', 'privacy', 'سياسة الخصوصية', f'كيف تتعامل {CO} مع بياناتك: لا قاعدة بيانات للطلبات، والدفع على صفحة ميسر، ولا تتبع ولا إعلانات.',
             'نجمع أقل قدر ممكن من البيانات، ولا نخزّن بيانات بطاقتك أبداً.', secs)

# ============================ الأمان ============================
def security():
    secs = [
     ('pay', 'الدفع على صفحة ميسر', '''<p>عند الدفع ننقلك إلى صفحة فاتورة مستضافة لدى ميسر. تُدخل بيانات بطاقتك هناك فقط، فلا تمر عبر موقعنا ولا خوادمنا. وميسر شركة سعودية مرخصة من البنك المركزي السعودي (ساما)، ومتوافقة مع معيار أمن بيانات صناعة بطاقات الدفع (PCI DSS)، وتعالج معاملاتها عبر قنوات مشفرة.</p>'''),
     ('amount', 'المبلغ لا يُحدَّد من متصفحك', '''<p>أسعار المراحل محفوظة في الخادم. المتصفح يرسل فقط اسم المرحلة، والخادم هو الذي يحدد المبلغ وينشئ الفاتورة، فلا يمكن تغيير المبلغ من جهتك أو من جهة أي طرف ثالث.</p>'''),
     ('booking', 'حجز الاستشارة لا يُفتح إلا بعد الدفع', '''<p>لا يكفي رابط الصفحة لفتح الحجز. قبل عرض أي موعد أو تأكيد أي حجز يسأل خادم الموقع ميسر مباشرة عن حالة الفاتورة، ولا يقبل إلا فاتورة مدفوعة، ولا يسمح بأكثر من حجز واحد للدفعة الواحدة.</p>'''),
     ('keys', 'مفاتيح الدفع والتقويم محفوظة في الخادم', '''<p>المفتاح السري لحسابنا لدى ميسر ومفاتيح الوصول إلى تقويم Google لا توجد في صفحات الموقع ولا في أي ملف يصل إلى المتصفح. تُستخدم من الخادم وحده.</p>'''),
     ('data', 'أقل قدر من البيانات', '''<p>لا توجد قاعدة بيانات للطلبات في الموقع، وبالتالي لا يوجد مخزن بيانات عملاء يمكن اختراقه من الموقع. وتفاصيل ما نجمعه ولماذا في <a href="privacy.html">صفحة الخصوصية</a>.</p>'''),
     ('transport', 'اتصال مشفر وبلا أطراف خارجية', '''<p>يُقدَّم الموقع عبر اتصال HTTPS مشفر. ولا نحمّل خطوطاً أو أدوات تتبع أو إعلانات من خوادم خارجية، فلا تُرسل زيارتك إلى أطراف أخرى.</p>'''),
     ('tips', 'كيف تحمي نفسك', '''<ul>
<li>تأكد أن صفحة الدفع عنوانها يبدأ بـ <span dir="ltr">https://checkout.moyasar.com</span>.</li>
<li>لن نطلب منك رقم بطاقتك أو رمز التحقق (OTP) أو الرقم السري عبر واتساب أو الهاتف أو البريد، مهما كان السبب.</li>
<li>إن وصلتك رسالة تدّعي أنها منا وتطلب دفعاً خارج صفحة الفاتورة الرسمية، فلا تدفع وأبلغنا.</li>
<li>أبقِ جهازك ومتصفحك محدّثين.</li>
</ul>'''),
     ('report', 'الإبلاغ عن مشكلة أمنية', '''<p>إن لاحظت ثغرة في الموقع أو محاولة احتيال باسمنا، راسلنا على: <span data-contact-line></span>. نشكر لك ذلك ونتعامل معه بجدية.</p>'''),
    ]
    doc_page('security.html', 'security', 'الأمان', f'كيف تحمي {CO} دفعك وبياناتك: صفحة دفع من ميسر، ومبلغ محدد من الخادم، وبلا قاعدة بيانات للطلبات.',
             'الدفع على صفحة ميسر المرخصة، والمبلغ يحدده الخادم، ولا قاعدة بيانات للطلبات.', secs)

# ============================ سياستنا ============================
def policy():
    secs = [
     ('nature', 'طبيعة خدماتنا', f'''<p>«{CO}» جهة توعية وإرشاد وإشراف ومتابعة. نقدّم الاستشارات والتوعية بحسب خبراتنا العملية والميدانية، ونوجّه العميل إلى المسار الأنسب لاتخاذ قراره.</p>
<div class="callout sketch red"><b>نُشرف ولا ننفّذ</b>لا ننفّذ الأعمال بأنفسنا، ولا نحل محل المكتب الهندسي، ولا نمارس الأعمال الهندسية المرخصة بدلاً عنه. أي خدمة تنفيذية تتم عبر جهة مختصة مستقلة، وتحت إشرافنا ومتابعتنا حسب الاتفاق المبرم.</div>
<p>وفي التطوير العقاري، تتضمن بعض الجوانب أموراً حكومية أو هندسية أو فنية أو نظامية أو قانونية تتطلب رأي جهة مختصة أو اعتمادها. ولذلك نوضح للعميل طبيعة كل معلومة أو توصية، ونستعين بالمتخصصين والجهات المرخصة عند الحاجة.</p>'''),
     ('info', 'أنواع المعلومات التي نقدّمها', '''<p>نميّز للعميل بين المعلومة التي تحتاج إلى تحقق، والمعلومة الفنية أو الهندسية، والمعلومة النظامية أو القانونية، والتوصية التجارية. ولا يُغني رأينا في الأمور الفنية أو النظامية أو القانونية عن رأي الجهة المختصة المرخصة.</p>'''),
     ('fees', 'الرسوم والمراحل', '''<p>لكل مسار مراحل محددة، وتُعلن رسوم كل مرحلة في <a href="tracks.html">صفحة المسارات</a> قبل التسجيل. وبعض المراحل تُحدَّد رسومها «حسب الاتفاق المبرم» أو «حسب العقد المبرم»، وهذه لا تُدفع من الموقع بل بعد التواصل وتحديد نطاق العمل.</p>
<ul><li>رسوم مرحلة التصميم والتخطيط في التطوير العقاري غير شاملة رسوم المكتب الهندسي.</li><li>رسوم مرحلة التراخيص في التطوير العقاري غير شاملة الرسوم الحكومية.</li></ul>
<p data-vat-note></p>'''),
     ('payment', 'الدفع', '''<p>تُدفع رسوم المراحل المحددة عبر فاتورة إلكترونية تصدر على صفحة ميسر المعتمدة، وتتضمن بيانات العميل ونوع الخدمة والمبلغ. ولا يُعتمد الطلب قبل تأكيد استلام الدفع من جهتنا. وللتفاصيل التقنية راجع صفحة <a href="security.html">الأمان</a>.</p>'''),
     ('booking', 'حجز الاستشارة', '''<p>لا يُفتح حجز موعد الاستشارة إلا بعد أن يؤكد النظام استلام الدفع من ميسر. تُعقد الجلسات من 10 صباحاً حتى 3 مساءً بتوقيت مكة المكرمة عبر اجتماع Google Meet، وتظهر الأيام والأوقات المتاحة في صفحة الحجز. يصلك رابط الاجتماع بعد الحجز، وبدعوة على بريدك إن أدخلته، ويمكنك التواصل معنا عبر واتساب لتأكيد الموعد.</p>'''),
     ('refund', 'الإلغاء والاسترجاع', '''<p>تُحدَّد شروط الإلغاء والاسترجاع قبل بدء كل مرحلة، وتُدرس أي طلبات استرجاع حالة بحالة بحسب نطاق ما قُدِّم من عمل حتى تاريخ الطلب. ولطلب ذلك، تواصل معنا عبر وسائل التواصل المعلنة في الموقع مع ذكر رقم الطلب.</p>'''),
     ('client', 'التزامات العميل', '''<ul><li>تقديم معلومات صحيحة وكاملة عن مشروعه ووضعه، لأن جودة التوعية تعتمد عليها.</li><li>أن يعلم أن القرار النهائي له بعد اطلاعه على الخيارات والمخاطر.</li><li>استخدام الخدمة لأغراض مشروعة.</li></ul>'''),
     ('third', 'الجهات المنفّذة والمتخصصة', '''<p>تتم الأعمال التنفيذية والهندسية والنظامية والقانونية عبر جهات متخصصة ومرخصة مستقلة. ويُحدَّد في الاتفاق المبرم نطاق إشرافنا ومتابعتنا على كل جهة. ونقيّم المنفّذين وفق طبيعة المشروع ومتطلباته، وليس على أساس السعر فقط.</p>'''),
     ('ip', 'المحتوى والملكية', f'''<p>المحتوى المنشور في هذا الموقع ملك لـ{CO}، ولا يجوز نسخه أو إعادة نشره دون إذن مسبق.</p>'''),
     ('law', 'النظام الواجب التطبيق', '''<p>تخضع هذه السياسة والخدمات المرتبطة بها للأنظمة المعمول بها في المملكة العربية السعودية.</p>'''),
     ('contact', 'التواصل والتعديلات', f'''<p>قد نعدّل هذه السياسة، ويظهر تاريخ آخر تحديث في أسفلها. وللاستفسار: <span data-contact-line></span>. وانظر أيضاً <a href="privacy.html">الخصوصية</a> و<a href="security.html">الأمان</a>.</p>'''),
    ]
    doc_page('policy.html', 'policy', 'سياستنا', f'سياسة خدمات {CO}: دورنا في التوعية والإشراف، والرسوم والمراحل، والدفع، والإلغاء والاسترجاع.',
             'ما نقوم به وما لا نقوم به، وكيف تعمل الرسوم والمراحل والدفع.', secs)

# ============================ حجز الاستشارة ============================
def booking():
    html = head(f'حجز الاستشارة | {CO}', 'حجز موعد الاستشارة بعد تأكيد الدفع.', path='booking.html', noindex=True) + header('', 'ar', 'booking.html') + """
<div class="wrap doc-hero">
  <h1>حجز موعد الاستشارة</h1>
  <p>يفتح الحجز بعد تأكيد الدفع من ميسر. المواعيد من 10 صباحاً حتى 3 مساءً بتوقيت مكة المكرمة، وتُعقد الجلسة عبر Google Meet.</p>
</div>
<section class="start" aria-label="حجز الاستشارة" style="padding-top:1.5rem">
  <div class="wrap">
    <div class="form-sheet sketch" id="bk"><div id="bk-body" aria-live="polite"></div></div>
  </div>
</section>
""" + footer('ar') + tail('<script src="assets/booking.js"></script>\n', 'ar')
    open(ROOT + '/booking.html', 'w', encoding='utf-8').write(html)

# ============================ المسارات والرسوم ============================
def tracks():
    html = head(f'المسارات والرسوم | {CO}', 'المسارات الأربعة ومراحل كل مسار ورسومها المعلنة: المشاريع الناشئة، تطوير المشاريع، المشاريع المتعثرة، والتطوير العقاري.',
                [ORG], path='tracks.html') + header('tracks', 'ar', 'tracks.html') + """
<div class="wrap doc-hero">
  <h1>المسارات والرسوم</h1>
  <p>تعرف على ما تتضمنه كل مرحلة وكم تكلفتها قبل أن تسجّل. المراحل التي تعتمد على حجم المشروع تُحدَّد رسومها بالاتفاق. تُدفع رسوم المراحل المحددة عبر صفحة ميسر الخارجية، ثم يُفتح لك حجز موعد الاستشارة. <span data-vat-note></span></p>
</div>
<section class="tracks-page" id="tracks" aria-label="المسارات والرسوم">
  <div class="wrap">
    <div class="tabs" role="tablist" aria-label="مسارات الخدمة" id="tablist"></div>
    <div id="tabpanels"></div>
  </div>
</section>
""" + footer('ar') + tail('<script src="assets/data.js"></script>\n<script src="assets/app.js"></script>\n', 'ar')
    open(ROOT + '/tracks.html', 'w', encoding='utf-8').write(html)

def main():
    tracks(); index(); about(); privacy(); security(); policy(); booking()
    print('arabic pages ok')
