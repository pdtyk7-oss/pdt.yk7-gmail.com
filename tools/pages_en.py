import json, os
from pages import (ROOT, SITE, CO_EN, ADDR_EN, WA_ICON, head, header, footer, tail, doc_page,
                   hero_svg)

CHEV = '<svg viewBox="0 0 40 24" aria-hidden="true"><path d="M36 12 H5 M13 4 L5 12 L13 20"/></svg>'

ORG_EN = {
  "@context": "https://schema.org", "@type": "ProfessionalService",
  "name": CO_EN,
  "description": "Consulting and guidance with field experience for emerging projects, stalled projects, project development and real estate development, by live online broadcast.",
  "url": SITE + "/en/",
  "areaServed": "SA", "availableLanguage": "en",
  "address": {"@type": "PostalAddress", "streetAddress": "Dammam", "addressRegion": "Eastern Province", "addressCountry": "SA"},
  "serviceType": ["Emerging Projects", "Project Development", "Stalled Projects", "Real Estate Development"]
}

FAQ_EN = [
 ("Do you execute the project yourselves?", "No. Our task is awareness and clarifying the right path, plus supervision and follow-up as per the signed agreement. Any execution service is carried out by the competent independent party, under our supervision and follow-up."),
 ("Do you replace the engineering office or licensed bodies?", "No. We do not replace the engineering office and we do not practice licensed engineering work in its place. We help you define your need and choose the suitable office, then follow the path and supervise execution as per the agreement."),
 ("What if my idea is not suitable?", "If the idea is not suitable after the initial assessment in the first stage of the Emerging Projects track, we present three suitable alternatives."),
 ("Where are you based and how are the sessions held?", "We are based in the Dammam, in the Eastern Province of Saudi Arabia, and sessions are held by live online broadcast, so you do not need to attend or travel."),
 ("When can I book my consultation?", "Booking opens only after the system confirms Moyasar received your payment. After paying, you are taken to the booking page where you choose a day and a time between 10:00 and 15:00 Mecca time. You get a Google Meet link on screen and by email if you entered one, and you can send it to us on WhatsApp."),
 ("How do I pay, and are all stages paid on the site?", "The fees of the fixed-fee stages are paid through an electronic invoice on the approved Moyasar page, showing your details, the service and the amount. Once the payment is confirmed, booking your consultation opens. Stages marked “as per agreement” or “as per contract” are not paid on the site; we contact you to define the scope of work and the fees, and then an agreement is signed."),
 ("Do you store my card or my data?", "Your card number never passes through our site, because payment is made on the Moyasar page. The site does not keep a database of requests. The details are on the privacy and security pages."),
 ("Do the design and license fees in real estate development include the engineering office fees and government fees?", "No. The fee of the design and planning stage does not include the engineering office fees, and the fee of the licenses stage does not include government fees."),
 ("How do you choose implementers and contractors?", "We evaluate the suitable implementer according to the nature and requirements of your project, not on price alone. When needed we use the best three offices for each specialized execution section."),
]
FAQ_LD_EN = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
  {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in FAQ_EN]}

# ============================ Home ============================
def index():
    faq_html = ''.join(f'<details><summary>{q}</summary><p>{a}</p></details>' for q, a in FAQ_EN)
    scn = [("startup", "I have a project idea and I don’t know if it is worth starting", "Emerging Projects"),
           ("develop", "My business is running but its performance does not satisfy me and I want to develop it", "Project Development"),
           ("stalled", "My project has stalled and I don’t know the real reason", "Stalled Projects"),
           ("realestate", "I want to build or develop a property and I fear mistakes and unnecessary costs", "Real Estate Development")]
    scn_html = ''.join(f'<button class="scn" data-pick="{k}" type="button"><span class="q">{q}<span class="t">{t}</span></span>{CHEV}</button>' for k, q, t in scn)
    arrow = '<svg viewBox="0 0 28 36" aria-hidden="true"><path d="M14 35 V6 M6 13 L14 5 L22 13"/></svg>'
    svg = hero_svg('en')
    body = head(f'{CO_EN} | Consulting for emerging and stalled projects and real estate development in the Eastern Province',
                'Consulting and guidance with field experience for emerging projects, stalled projects, project development and real estate development, from the Eastern Province to all of Saudi Arabia. Live online sessions and payment by Moyasar invoice.',
                [ORG_EN, FAQ_LD_EN], path='index.html', lang='en') + header('home', 'en', 'index.html') + f'''
<section class="hero" aria-labelledby="h1">
  <div class="wrap">
    <div class="card card-title"><h1 id="h1">Experience, when it turns into knowledge that others benefit from, becomes a lasting value that shortens the road and serves the generations to come</h1></div>
    <div class="hero-col">
      <div class="card card-text">
        <p class="lead">We are a platform that works to pass on wide, accumulated field experience in a simple, practical way, and to help and support members of the community and project owners see the road more clearly before they start, while they develop, and when they face a stall, so they avoid early mistakes and losses in a project or a financial or executive commitment.</p>
        <p class="lead close">So the client knows the nature of the information they rely on before making their future decisions.</p>
      </div>
      <div class="card card-cta">
        <div class="cta-row">
          <span class="cta-wrap"><a class="btn" href="#start">Start your request now</a><span class="note cta-note">{arrow}Start here</span></span>
          <a class="btn wa" href="#" data-wa="Hello, I would like to ask about the services of {CO_EN}.">{WA_ICON}Chat with us on WhatsApp</a>
        </div>
      </div>
    </div>
    <div class="figcol">
      {svg}
      <div class="card live-box"><span class="live"><i aria-hidden="true"></i>Live online broadcast</span></div>
    </div>
  </div>
</section>

<section id="who" aria-labelledby="who-h">
  <div class="wrap">
    <h2 id="who-h">Choose the closest one and we take you straight to the right track in the request form</h2>
    <div class="scn-list">{scn_html}</div>
  </div>
</section>

<section class="role" id="role" aria-labelledby="role-h">
  <div class="wrap">
    <h2 id="role-h">Awareness, supervision and follow-up of the executing party</h2>
    <p class="sec-sub">“{CO_EN}” is a guidance and awareness body. Any execution service is carried out by an independent specialized party, under our supervision and follow-up as per the signed agreement.</p>
    <div class="role-grid">
      <span class="stamp-big" aria-hidden="true">We supervise, we don’t execute</span>
      <div class="panel do frame">
        <h3>What we do</h3>
        <ul>
          <li>We understand your need and analyze your situation and capabilities.</li>
          <li>We explain the available options and the potential risks before any decision.</li>
          <li>We guide you to what you need, who you need, and when you need them.</li>
          <li>We supervise and follow up on the executing party as per the signed agreement.</li>
        </ul>
      </div>
      <div class="panel dont frame red">
        <h3>What we don’t do</h3>
        <ul>
          <li>We do not carry out the work ourselves, ever.</li>
          <li>We do not replace the engineering office, and we do not practice licensed engineering work in its place.</li>
          <li>We do not make our opinion a substitute for the opinion of the licensed technical, regulatory or legal body.</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section id="method" aria-labelledby="method-h">
  <div class="wrap">
    <h2 id="method-h">We start by understanding your need, then tell you which kind of information you hold</h2>
    <p class="sec-sub">We analyze the situation and clarify the options, and we always distinguish between four types of information:</p>
    <div class="kinds">
      <div class="kind"><svg viewBox="0 0 56 56" aria-hidden="true"><circle class="mk" cx="25" cy="25" r="15" transform="translate(3 3)"/><circle cx="24" cy="24" r="15"/><path d="M35 35 L50 50"/></svg><b>Information that needs verification</b></div>
      <div class="kind"><svg viewBox="0 0 56 56" aria-hidden="true"><path class="mk" d="M8 48 V10 L46 48 Z" transform="translate(3 3)"/><path d="M8 48 V10 L46 48 Z M8 20 H14 M8 30 H16 M8 40 H14 M20 48 V42 M30 48 V40 M40 48 V44"/></svg><b>Technical or engineering information</b></div>
      <div class="kind"><svg viewBox="0 0 56 56" aria-hidden="true"><circle class="mk" cx="13" cy="39" r="8" transform="translate(3 3)"/><path d="M28 8 V48 M16 48 H40 M10 16 H46 M10 16 L4 32 H18 Z M46 16 L40 32 H52 Z"/></svg><b>Regulatory or legal information</b></div>
      <div class="kind"><svg viewBox="0 0 56 56" aria-hidden="true"><circle class="mk" cx="28" cy="28" r="19" transform="translate(3 3)"/><circle cx="28" cy="28" r="19"/><path d="M28 16 V40 M22 21 C22 17 34 17 34 22 C34 27 22 28 22 33 C22 38 34 38 34 34"/></svg><b>A commercial recommendation</b></div>
    </div>
    <p class="after">This way you know the nature of the information you rely on before you make your future decisions.</p>
  </div>
</section>

<section class="start" id="start" aria-labelledby="start-h">
  <div class="wrap">
    <h2 id="start-h">Start your request in four steps</h2>
    <p class="sec-sub">Choose the track and the stage, enter your details, then we take you to an official invoice on the approved Moyasar page where you pay. If the stage is “as per agreement”, we send your request via WhatsApp and contact you to define the details.</p>
    <div class="form-sheet frame" id="wz">
      <ol class="prog" id="prog" aria-label="Request steps"></ol>
      <div id="wz-body" aria-live="polite"></div>
    </div>
  </div>
</section>

<section id="faq" aria-labelledby="faq-h">
  <div class="wrap">
    <h2 id="faq-h">Questions clients ask before registering</h2>
    <div class="faq">{faq_html}</div>
  </div>
</section>
''' + footer('en') + tail('<script src="../assets/data.en.js"></script>\n<script src="../assets/app.js"></script>\n', 'en')
    os.makedirs(ROOT + '/en', exist_ok=True)
    open(ROOT + '/en/index.html', 'w', encoding='utf-8').write(body)

# ============================ About ============================
def about():
    sea = '<svg viewBox="0 0 84 68" aria-hidden="true"><path class="pin" d="M42 38 C34 28 32 24 32 19 A10 10 0 0 1 52 19 C52 24 50 28 42 38 Z"/><circle cx="42" cy="19" r="3.5" fill="#fff" stroke="none"/><path class="sea" d="M4 52 H80"/><path class="sea" d="M14 60 H70"/></svg>'
    secs = [
     ('who', 'About us', f'''<p>{CO_EN} is based in the Dammam, in the Eastern Province of Saudi Arabia. It is a platform that aims to contribute consulting, experience and awareness guidance to a segment of the community, drawing on accumulated practical and field experience in several fields.</p>
<p>We help individuals and owners of emerging projects, develop existing and stalled projects, and accompany real estate developers, so that we see the road more clearly before starting and know the right path in a practical and simple way.</p>
<div class="place">{sea}<span>{ADDR_EN}. Sessions are held by live online broadcast.</span></div>'''),
     ('what', 'What we offer', '''<p>Consulting with us is not merely referring the client to advisers and specialists. The core awareness and guidance is provided by us from our practical and field experience. When a matter requires a specific specialization or license, we make the client aware of what they need, who they need and when they need them, using specialists and licensed bodies in the technical, engineering, regulatory and legal fields and in government departments.</p>
<p>Our tracks:</p>
<ul>
<li><a href="tracks.html">Emerging Projects</a>: from an idea to a project that can be studied and executed.</li>
<li><a href="tracks.html">Project Development</a>: reviewing the existing project and identifying opportunities for improvement and expansion.</li>
<li><a href="tracks.html">Stalled Projects</a>: understanding the cause of the stall first, then choosing the solution worth basing the decision on.</li>
<li><a href="tracks.html">Real Estate Development</a>: from the idea of building and its stages to licenses and supervision of execution.</li>
</ul>'''),
     ('how', 'How we work', '''<p>We start by understanding the need, then analyze the situation and clarify the options. Throughout, we distinguish between four types of information: information that needs verification, technical or engineering information, regulatory or legal information, and a commercial recommendation. This way the client knows the nature of the information they rely on before making their decisions.</p>
<p>We also recognize that the aim is not merely to provide a piece of information or an idea, but to help the client avoid mistakes and reach the right path so that they make a better decision.</p>'''),
     ('limits', 'The limits of our role', f'''<div class="callout frame red"><b>We supervise, we don’t execute</b>The task of “{CO_EN}” is limited to awareness and clarifying the right and sound path to avoid potential risks, and supervision and follow-up as per the signed agreement. We do not carry out the work ourselves, ever. Any execution service is through the competent independent party, under our supervision and follow-up as per the agreement.</div>
<p>We do not replace the engineering office and we do not practice licensed engineering work in its place. Professional service and consulting offices and the competent licensed bodies are independent specialized executing parties, and we guide the client to the suitable choice among them.</p>'''),
     ('mission', 'Our message and purpose', '''<p>Experience, once turned into knowledge that others benefit from, becomes value. We aim to pass on experience in a practical and simple way, and to help members of the community and project owners see the road more clearly before starting, during development, and when facing a stall.</p>'''),
     ('contact', 'Contact us', f'''<p>Address: {ADDR_EN}.</p><ul data-contact></ul><p><span data-legal></span></p>
<p><a class="btn" href="index.html#start">Start your request</a></p>'''),
    ]
    doc_page('about.html', 'about', 'About us', f'Get to know {CO_EN} in the Eastern Province: a consulting and guidance platform with field experience for emerging and stalled projects and real estate development.',
             'A Saudi platform that provides consulting and awareness guidance, and supervises and follows up but does not execute.', secs, [ORG_EN], lang='en')

# ============================ Privacy ============================
def privacy():
    secs = [
     ('intro', 'Introduction', f'''<p>This page explains how {CO_EN} (“we”) deals with your data when you use this website. We are based in {ADDR_EN}. We comply with the Personal Data Protection Law in the Kingdom of Saudi Arabia, and we collect as little data as possible.</p>'''),
     ('collect', 'The data we receive', '''<p>When you fill in the request form you enter:</p>
<ul><li>Full name and mobile number (required).</li><li>Email, city and a capital range (optional).</li><li>A short summary of your idea or project.</li><li>When booking: your email (optional) and your notes for the session.</li></ul>
<p>If you choose to contact us via WhatsApp, what you send us there is what you write.</p>
<div class="callout frame soft"><b>Your card details</b>We do not ask for them, see them or store them. You enter payment details only on the invoice page hosted by Moyasar.</div>'''),
     ('use', 'How we use your data', '''<ul><li>Creating the payment invoice for your request, which shows your details, the service and the amount.</li><li>Booking your consultation and sending you the Google Meet link.</li><li>Contacting you to set the scope of work.</li><li>Providing the agreed service, and accounting and financial reconciliation.</li></ul>
<p>We do not use your data to market for other parties, and we do not sell it.</p>'''),
     ('store', 'Does the website store my data?', '''<p>This website does not keep a database of requests, and it does not save what you enter in your browser after you close the page. When you press the payment button, your data is sent once to the website’s server to create the invoice at Moyasar, and then you move to the invoice page. We do not record your data in server logs.</p>
<p>The invoice data (including the contact details and your short summary) remains saved within the invoice records in our account at Moyasar, for accounting and reconciliation purposes and to serve you.</p>
<p>When you book a time, an event is created in our Google Calendar containing your name, mobile, the service and your notes, so our team knows when the session is. We keep no other copy of this data.</p>'''),
     ('share', 'Who we share your data with', '''<ul>
<li><b>Moyasar</b>: the payment services provider through which the invoice and payment are made, licensed by the Saudi Central Bank. Its processing of your data is subject to its policies.</li>
<li><b>Google</b>: Google Calendar and Google Meet to schedule the session and create the meeting link; the meeting invitation is sent to your email if you entered one. Its processing is subject to Google’s policies.</li>
<li><b>WhatsApp</b>: only if you choose to contact us through it, and the conversation is subject to WhatsApp’s policy.</li>
<li><b>The website hosting provider</b>: technically processes requests to run the site.</li>
<li><b>Specialized and licensed bodies</b>: we do not share your data with them except with your consent and when needed to carry out what we agreed on.</li>
</ul>
<p>We may disclose data if a competent regulatory authority requests it under the regulations in force in the Kingdom.</p>'''),
     ('cookies', 'Cookies and tracking', '''<p>The website does not use tracking cookies or analytics or advertising tools. The fonts are stored on the website’s own server and are not loaded from third parties. The invoice page that belongs to Moyasar has its own policies.</p>'''),
     ('rights', 'Your rights', '''<p>You have the right to access your personal data and request that it be corrected or destroyed, and to object to its processing, under the Personal Data Protection Law. To exercise any right, contact us: <span data-contact-line></span>. We will respond within a reasonable time.</p>
<p>Note that invoice data may have to be kept at Moyasar and in our accounting records for a period required by law.</p>'''),
     ('minors', 'Minors', '''<p>Our services are aimed at adults, and we do not knowingly collect data from minors.</p>'''),
     ('changes', 'Changes', '''<p>We may update this page when our practices change, and the date of the last update appears at the bottom.</p>'''),
    ]
    doc_page('privacy.html', 'privacy', 'Privacy Policy', f'How {CO_EN} handles your data: no database of requests, payment on the Moyasar page, and no tracking or ads.',
             'We collect as little data as possible, and we never store your card data.', secs, lang='en')

# ============================ Security ============================
def security():
    secs = [
     ('pay', 'Payment on the Moyasar page', '''<p>When you pay, we take you to an invoice page hosted by Moyasar. You enter your card details there only, so they do not pass through our site or our servers. Moyasar is a Saudi company licensed by the Saudi Central Bank (SAMA) and compliant with the Payment Card Industry Data Security Standard (PCI DSS), and it processes its transactions through encrypted channels.</p>'''),
     ('amount', 'The amount is not set by your browser', '''<p>The stage prices are kept on the server. The browser sends only the name of the stage, and the server is the one that sets the amount and creates the invoice, so the amount cannot be changed from your side or from any third party.</p>'''),
     ('booking', 'Booking opens only after payment', '''<p>The page link alone is not enough to open booking. Before showing any time or confirming any booking, the website’s server asks Moyasar directly for the invoice status, accepts only a paid invoice, and allows only one booking per payment.</p>'''),
     ('keys', 'Payment and calendar keys are kept on the server', '''<p>Our account’s secret key at Moyasar and the keys that access the Google Calendar do not exist in the website pages or in any file that reaches the browser. They are used only by the server.</p>'''),
     ('data', 'The least amount of data', '''<p>There is no database of requests on the website, and therefore no customer data store that could be breached from the site. The details of what we collect and why are on the <a href="privacy.html">privacy page</a>.</p>'''),
     ('transport', 'Encrypted connection and no third parties', '''<p>The website is served over an encrypted HTTPS connection. We do not load fonts, tracking tools or ads from external servers, so your visit is not sent to other parties.</p>'''),
     ('tips', 'How to protect yourself', '''<ul>
<li>Make sure the payment page address starts with <span dir="ltr">https://checkout.moyasar.com</span>.</li>
<li>We will never ask you for your card number, verification code (OTP) or PIN via WhatsApp, phone or email, whatever the reason.</li>
<li>If you receive a message claiming to be from us that asks for payment outside the official invoice page, do not pay and tell us.</li>
<li>Keep your device and browser up to date.</li>
</ul>'''),
     ('report', 'Reporting a security issue', '''<p>If you notice a vulnerability in the website or an attempt at fraud in our name, write to us at: <span data-contact-line></span>. We thank you for it and treat it seriously.</p>'''),
    ]
    doc_page('security.html', 'security', 'Security', f'How {CO_EN} protects your payment and data: a Moyasar payment page, an amount set by the server, and no database of requests.',
             'Payment on the licensed Moyasar page, the amount set by the server, and no database of requests.', secs, lang='en')

# ============================ Policy ============================
def policy():
    secs = [
     ('nature', 'The nature of our services', f'''<p>“{CO_EN}” is an awareness, guidance, supervision and follow-up body. We provide consulting and awareness based on our practical and field experience, and we guide the client to the most suitable path so that they can make their decision.</p>
<div class="callout frame red"><b>Awareness, supervision and follow-up of execution</b>We do not carry out the work ourselves, we do not replace the engineering office, and we do not practice licensed engineering work in its place. Any execution service is carried out through an independent competent party, under our supervision and follow-up as per the signed agreement.</div>
<p>In real estate development, some aspects involve governmental, engineering, technical, regulatory or legal matters that require the opinion or approval of a competent body. We therefore explain to the client the nature of each piece of information or recommendation, and use specialists and licensed bodies when needed.</p>'''),
     ('info', 'The types of information we provide', '''<p>We distinguish for the client between information that needs verification, technical or engineering information, regulatory or legal information, and a commercial recommendation. Our opinion on technical, regulatory or legal matters does not replace the opinion of the competent licensed body.</p>'''),
     ('fees', 'Fees and stages', '''<p>Each track has defined stages, and the fee of each stage is announced on the <a href="tracks.html">tracks page</a> before registration. Some stages have fees set “as per the signed agreement” or “as per the signed contract”; these are not paid on the site but after we get in touch and define the scope of work.</p>
<ul><li>The fee of the design and planning stage in real estate development does not include the engineering office fees.</li><li>The fee of the licenses stage in real estate development does not include government fees.</li></ul>
<p data-vat-note></p>'''),
     ('payment', 'Payment', '''<p>The fees of the fixed-fee stages are paid through an electronic invoice issued on the approved Moyasar page, which includes the client’s details, the service and the amount. A request is not approved until we confirm receipt of the payment. For the technical details, see the <a href="security.html">security</a> page.</p>'''),
     ('booking', 'Consultation booking', '''<p>Booking a consultation opens only after the system confirms Moyasar received the payment. Sessions run from 10:00 to 15:00 Mecca time through a Google Meet meeting, and the available days and times appear on the booking page. You receive the meeting link after booking, and by email if you entered one, and you can contact us on WhatsApp to confirm the time.</p>'''),
     ('refund', 'Cancellation and refund', '''<p>The terms of cancellation and refund are set before each stage starts, and any refund request is studied case by case according to the scope of work delivered up to the date of the request. To make a request, contact us through the contact details announced on the site, stating the order number.</p>'''),
     ('client', 'The client’s obligations', '''<ul><li>Providing correct and complete information about their project and situation, because the quality of the awareness depends on it.</li><li>Knowing that the final decision is theirs after reviewing the options and risks.</li><li>Using the service for lawful purposes.</li></ul>'''),
     ('third', 'Executing and specialized parties', '''<div class="callout frame red"><b>Executing and specialized parties</b>Execution, engineering, regulatory and legal work is carried out through independent licensed specialized parties. The scope of our supervision and follow-up of each party is defined in the signed agreement. We evaluate implementers according to the nature and requirements of the project, not on price alone.</div>'''),
     ('ip', 'Content and ownership', f'''<p>The content published on this website belongs to {CO_EN}, and may not be copied or republished without prior permission.</p>'''),
     ('law', 'Governing law', '''<p>This policy and the related services are subject to the regulations in force in the Kingdom of Saudi Arabia.</p>'''),
     ('contact', 'Contact and amendments', '''<p>We may amend this policy, and the date of the last update appears at the bottom. For inquiries: <span data-contact-line></span>. See also <a href="privacy.html">Privacy</a> and <a href="security.html">Security</a>.</p>'''),
    ]
    doc_page('policy.html', 'policy', 'Our Policy', f'Service policy of {CO_EN}: our role in awareness and supervision, fees and stages, payment, and cancellation and refund.',
             'What we do and what we don’t do, and how fees, stages and payment work.', secs, lang='en')

# ============================ Consultation booking ============================
def booking():
    html = head(f'Book your consultation | {CO_EN}', 'Book a consultation time after payment is confirmed.', path='booking.html', noindex=True, lang='en') + header('', 'en', 'booking.html') + """
<div class="wrap doc-hero">
  <h1>Book your consultation</h1>
  <p>Booking opens once Moyasar confirms your payment. Sessions run from 10:00 to 15:00 Mecca time, by Google Meet.</p>
</div>
<section class="start" aria-label="Consultation booking" style="padding-top:1.5rem">
  <div class="wrap">
    <div class="form-sheet frame" id="bk"><div id="bk-body" aria-live="polite"></div></div>
  </div>
</section>
""" + footer('en') + tail('<script src="../assets/booking.js"></script>\n', 'en')
    os.makedirs(ROOT + '/en', exist_ok=True)
    open(ROOT + '/en/booking.html', 'w', encoding='utf-8').write(html)

# ============================ Tracks and fees ============================
def tracks():
    html = head(f'Tracks and fees | {CO_EN}', 'The four tracks with the stages and announced fees of each: Emerging Projects, Project Development, Stalled Projects and Real Estate Development.',
                [ORG_EN], path='tracks.html', lang='en') + header('tracks', 'en', 'tracks.html') + """
<div class="wrap doc-hero">
  <h1>Tracks and fees</h1>
  <p>Learn what each stage includes and what it costs before you register. Stages that depend on the project size have fees set by agreement. The fees of fixed-fee stages are paid on Moyasar’s external page, and then booking your consultation opens. <span data-vat-note></span></p>
</div>
<section class="tracks-page" id="tracks" aria-label="Tracks and fees">
  <div class="wrap">
    <div class="tabs" role="tablist" aria-label="Service tracks" id="tablist"></div>
    <div id="tabpanels"></div>
  </div>
</section>
""" + footer('en') + tail('<script src="../assets/data.en.js"></script>\n<script src="../assets/app.js"></script>\n', 'en')
    os.makedirs(ROOT + '/en', exist_ok=True)
    open(ROOT + '/en/tracks.html', 'w', encoding='utf-8').write(html)

def main():
    tracks(); index(); about(); privacy(); security(); policy(); booking()
    print('english pages ok')
