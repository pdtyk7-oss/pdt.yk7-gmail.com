/* Booking page. It opens only after the server confirms (with Moyasar) that the invoice is paid.
   All times are shown in Mecca time. Strings come from T.bk in the language file. */
(function () {
  const root = $('#bk-body');
  const ref = new URLSearchParams(location.search).get('ref') || '';
  const TZ = 'Asia/Riyadh';
  const state = { days: [], day: null, slot: null, email: '', notes: '' };

  const api = async (path, options) => {
    const res = await fetch(`${CONFIG.API_BASE}${path}`, options);
    return { status: res.status, data: await res.json().catch(() => ({})) };
  };
  const format = (options) => new Intl.DateTimeFormat(T.locale, { timeZone: TZ, ...options });
  const dayLabel = (date) => format({ weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`));
  const timeLabel = (iso) => format({ hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(iso));
  const whenLabel = (iso) => format({ weekday: 'long', day: 'numeric', month: 'long', hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(iso));
  const safeMeet = (url) => (/^https:\/\/meet\.google\.com\//.test(url) ? url : '');

  const show = (html) => { root.innerHTML = html; const h = $('#bk-h2'); if (h) h.focus({ preventScroll: true }); };
  const waButton = (text, label) => {
    const link = waLink(text);
    return link ? `<a class="btn wa" href="${esc(link)}" target="_blank" rel="noopener">${WA_SVG}${label}</a>` : '';
  };
  const WA_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z"/></svg>';

  const views = {
    checking: () => `<h3 id="bk-h2" tabindex="-1">${T.bk.checking}</h3>`,

    locked: (title, text) => `<h3 id="bk-h2" tabindex="-1">${title}</h3>
      <div class="alert"><b>${title}</b>${text}</div>
      <div class="cta-row">
        <a class="btn" href="index.html#start">${T.bk.start}</a>
        <button class="btn ghost" type="button" data-act="reload">${T.bk.refresh}</button>
        ${waButton('', T.waL)}
      </div>`,

    error: () => `<h3 id="bk-h2" tabindex="-1">${T.bk.errorTitle}</h3>
      <div class="alert"><b>${T.bk.errorTitle}</b>${T.bk.errorText}</div>
      <div class="cta-row"><button class="btn" type="button" data-act="reload">${T.bk.retry}</button>${waButton('', T.waL)}</div>`,

    chooser: (message = '') => {
      if (!state.days.length) return `<h3 id="bk-h2" tabindex="-1">${T.bk.h}</h3><div class="alert"><b>${T.bk.noSlots}</b></div><div class="cta-row">${waButton('', T.waL)}</div>`;
      const day = state.days.find((d) => d.date === state.day);
      const days = state.days.map((d) => `<button type="button" class="chip" data-day="${d.date}" aria-pressed="${d.date === state.day}">${esc(dayLabel(d.date))}</button>`).join('');
      const slots = day.slots.map((s) => `<button type="button" class="chip slot" data-slot="${s}" aria-pressed="${s === state.slot}">${esc(timeLabel(s))}</button>`).join('');
      return `<h3 id="bk-h2" tabindex="-1">${T.bk.h}</h3>
        <p class="hint">${T.bk.tzNote}</p>
        <h4 class="pick-h">${T.bk.pickDay}</h4><div class="chips" role="group" aria-label="${T.bk.pickDay}">${days}</div>
        <h4 class="pick-h">${T.bk.pickTime}</h4><div class="chips" role="group" aria-label="${T.bk.pickTime}">${slots}</div>
        <div class="fields" style="margin-top:1.4rem">
          <label class="f" for="bk-email">${T.bk.email}<span class="o">(${T.optional})</span><input id="bk-email" type="email" dir="ltr" autocomplete="email" value="${esc(state.email)}" style="text-align:${T.dir === 'rtl' ? 'end' : 'start'}"></label>
          <label class="f full" for="bk-notes">${T.bk.notes}<span class="o">(${T.optional})</span><textarea id="bk-notes">${esc(state.notes)}</textarea></label>
        </div>
        <p class="hint" style="margin-top:.5rem">${T.bk.emailHint}</p>
        <p class="err" role="alert" style="${message ? '' : 'display:none;'}color:var(--red-d);font:700 .95rem var(--f-hand)">${message}</p>
        <div class="wz-nav"><span></span><button class="btn" type="button" data-act="confirm" ${state.slot ? '' : 'disabled'}>${T.bk.confirm}</button></div>`;
    },

    done: (booking, emailed) => {
      const meet = safeMeet(booking.meetUrl);
      const when = whenLabel(booking.start);
      return `<h3 id="bk-h2" tabindex="-1">${T.bk.doneTitle}</h3>
        <dl class="sum sketch"><div><dt>${T.bk.whenLabel}</dt><dd>${esc(when)}</dd></div><div><dt>${T.bk.orderLabel}</dt><dd dir="ltr">${esc(ref)}</dd></div></dl>
        ${emailed ? `<p class="hint" style="margin-top:.8rem">${T.bk.emailed}</p>` : ''}
        <p class="hint" style="margin-top:.8rem">${T.bk.keepLink}</p>
        <div class="cta-row">
          ${meet ? `<a class="btn" href="${esc(meet)}" target="_blank" rel="noopener">${T.bk.meet}</a>` : ''}
          ${waButton(T.bk.waText(when, meet || '-', ref), T.bk.waBtn)}
        </div>
        <p class="hint" style="margin-top:.8rem">${T.bk.waNote}</p>`;
    },
  };

  function load(data) {
    state.days = data.days;
    if (!state.days.some((d) => d.date === state.day)) state.day = state.days.length ? state.days[0].date : null;
    if (!state.days.some((d) => d.slots.includes(state.slot))) state.slot = null;
  }

  async function start() {
    if (!ref) return show(views.locked(T.bk.notFoundTitle, T.bk.notFoundText));
    show(views.checking());
    try {
      const { status, data } = await api(`/slots?ref=${encodeURIComponent(ref)}`);
      if (status === 402) return show(views.locked(T.bk.lockedTitle, T.bk.lockedText));
      if (status === 404 || status === 400) return show(views.locked(T.bk.notFoundTitle, T.bk.notFoundText));
      if (status !== 200) return show(views.error());
      if (data.booked) return show(views.done(data, false));
      load(data);
      show(views.chooser());
    } catch (err) { show(views.error()); }
  }

  async function confirm() {
    const button = $('[data-act=confirm]');
    button.disabled = true; button.textContent = T.bk.confirming;
    const email = state.email;
    try {
      const { status, data } = await api('/book', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ref, start: state.slot, email: email.trim(), notes: state.notes.trim() }),
      });
      if (status === 200) return show(views.done(data, Boolean(email.trim())));
      if (status === 402) return show(views.locked(T.bk.lockedTitle, T.bk.lockedText));
      if (status === 409 || data.code === 'invalid_slot') {
        const fresh = await api(`/slots?ref=${encodeURIComponent(ref)}`);
        if (fresh.status === 200 && !fresh.data.booked) load(fresh.data);
        state.slot = null;
        return show(views.chooser(status === 409 ? T.bk.taken : T.bk.invalidSlot));
      }
      show(views.chooser(T.e[data.code] || T.bk.errorText));
    } catch (err) { show(views.chooser(T.bk.errorText)); }
  }

  root.addEventListener('input', (e) => {
    if (e.target.id === 'bk-email') state.email = e.target.value;
    if (e.target.id === 'bk-notes') state.notes = e.target.value;
  });

  root.addEventListener('click', (e) => {
    const target = e.target.closest('[data-day],[data-slot],[data-act]');
    if (!target) return;
    if (target.dataset.day) { state.day = target.dataset.day; state.slot = null; show(views.chooser()); }
    else if (target.dataset.slot) { state.slot = target.dataset.slot; show(views.chooser()); }
    else if (target.dataset.act === 'confirm') confirm();
    else if (target.dataset.act === 'reload') start();
  });

  start();
})();
