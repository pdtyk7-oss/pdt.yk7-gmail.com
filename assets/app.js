/* الصفحة الرئيسية (عربي/إنجليزي): عرض المسارات + نموذج الطلب متعدد الخطوات.
   كل النصوص تأتي من ملف اللغة (lang.ar.js أو lang.en.js) عبر الكائن T.
   لا يُخزَّن شيء في المتصفح ولا على الخادم. عند الدفع يُنشأ طلب فاتورة لدى ميسر
   ثم يُنقل العميل إلى صفحة الفاتورة المستضافة لدى ميسر. */

/* ---------- عرض المسارات ---------- */
function stampHTML(st){
  if(st.fee!=null) return `<div class="stamp"><b>${fmt(st.fee)}</b><small>${T.cur}</small></div>`;
  return `<div class="stamp agree"><span>${esc(st.feeLabel||T.agreeDefault)}</span></div>`;
}
function stageHTML(st, i, trackId){
  const lead = st.lead ? `<p class="lead2">${esc(st.lead)}</p>` : '';
  const list = st.numbered
    ? `<ol class="steps13">${st.items.map(x=>`<li>${esc(x)}</li>`).join('')}</ol>`
    : `<ul class="items">${st.items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;
  const alt  = st.alt ? `<p class="alt">${T.altLine(esc(st.alt.label), T.money(st.alt.fee))}</p>` : '';
  const note = st.feeNote ? `<span class="feenote">${esc(st.feeNote)}</span>` : '';
  const paid = st.fee != null;
  const action = `<button class="btn${paid ? '' : ' ghost'}" type="button" data-pick="${trackId}" data-stage="${st.id}">${paid ? T.payBook : T.askWA}</button>`;
  return `<li class="stage">
    <span class="num" aria-hidden="true">${i+1}</span>
    <div><h4>${esc(st.name)}</h4>${note}${lead}${list}${alt}<div class="stage-actions">${action}</div></div>
    <div class="stamp-col">${stampHTML(st)}</div></li>`;
}
function panelHTML(t, idx){
  const pts = `<ul class="dashes">${t.points.map(p=>`<li>${esc(p)}</li>`).join('')}</ul>`;
  const crit = t.critical ? `<div class="callout frame red"><b>${esc(t.critical.title)}</b>${esc(t.critical.text)}</div>` : '';
  const ntc  = t.notice ? `<div class="callout frame soft"><b>${esc(t.notice.title)}</b>${esc(t.notice.text)}</div>` : '';
  const scopeList = t.scopeList ? `<h4 class="sub-h">${T.scopeListH}</h4><ul class="dashes" style="columns:2;column-gap:2rem">${t.scopeList.map(x=>`<li style="break-inside:avoid">${esc(x)}</li>`).join('')}</ul>` : '';
  const scope = t.scope ? `<h4 class="sub-h">${T.scopeH}</h4><div class="scope">${t.scope.map(s=>`<div><b>${esc(s.t)}</b><p>${esc(s.d)}</p>${s.q?`<ul>${s.q.map(q=>`<li>${esc(q)}</li>`).join('')}</ul>`:''}</div>`).join('')}</div>` : '';
  const flow = t.flow ? `<h4 class="sub-h">${T.flowH}</h4><ol class="flow">${t.flow.map(f=>`<li>${esc(f)}</li>`).join('')}</ol>` : '';
  return `<div class="tp" role="tabpanel" id="tp-${t.id}" aria-labelledby="tab-${t.id}" ${idx?'hidden':''} tabindex="0">
    <div class="tp-head"><div><h3>${esc(t.name)}</h3><p class="tp-tag">${esc(t.tag)}</p><p class="tp-intro">${esc(t.intro)}</p></div><div>${pts}</div></div>
    ${crit}${ntc}${scopeList}${scope}${flow}
    <h4 class="sub-h">${T.stagesH(esc(t.name))}</h4>
    <ol class="journey">${t.stages.map((st, i) => stageHTML(st, i, t.id)).join('')}</ol>
    <div class="cta-row"><button class="btn" type="button" data-pick="${t.id}">${T.startOrder(esc(t.name))}</button></div>
  </div>`;
}
function renderTracks(){
  const startingFee = t => Math.min(...t.stages.filter(s => s.fee != null).map(s => s.fee));
  $('#tablist').innerHTML = TRACKS.map((t,i)=>`<button class="tab" role="tab" id="tab-${t.id}" aria-controls="tp-${t.id}" aria-selected="${i===0}" tabindex="${i===0?0:-1}" data-tab="${t.id}"><strong>${esc(t.name)}</strong><span class="tab-tag">${esc(t.tag)}</span><span class="tab-from">${T.fromFee(T.money(startingFee(t)))}</span></button>`).join('');
  $('#tabpanels').innerHTML = TRACKS.map(panelHTML).join('');
  const tabs = $$('.tab');
  const show = id => {
    tabs.forEach(b => { const on=b.dataset.tab===id; b.setAttribute('aria-selected',on); b.tabIndex=on?0:-1; });
    $$('.tp').forEach(p => p.hidden = p.id!=='tp-'+id);
  };
  const fromHash = () => { const h=location.hash.slice(1); if(TRACKS.some(t=>t.id===h)) show(h); };
  fromHash(); window.addEventListener('hashchange', fromHash);
  const rtl = T.dir==='rtl';
  tabs.forEach((b,i)=>{
    b.addEventListener('click',()=>{
      show(b.dataset.tab);
      $('#tabpanels').scrollIntoView({behavior:'smooth', block:'start'});   // the cards stay on top, the details open below
    });
    b.addEventListener('keydown',e=>{
      let n=null;
      const next = rtl ? 'ArrowLeft' : 'ArrowRight', prev = rtl ? 'ArrowRight' : 'ArrowLeft';
      if(e.key===next) n=(i+1)%tabs.length;
      if(e.key===prev) n=(i-1+tabs.length)%tabs.length;
      if(n!==null){ e.preventDefault(); tabs[n].focus(); show(tabs[n].dataset.tab); }
    });
  });
}

if($('#tablist')) renderTracks();

if($('#wz-body')){
/* ---------- نموذج الطلب ---------- */
const blank = () => ({name:'',phone:'',email:'',city:'',capital:'',summary:''});
const S = { step:1, track:null, stage:null, alt:false, data:blank(), agree1:false, agree2:false, errors:{}, busy:false, done:null };
const trackOf = () => TRACKS.find(t=>t.id===S.track);
const stageOf = () => { const t=trackOf(); return t && t.stages.find(s=>s.id===S.stage); };
const baseFee = () => { const st=stageOf(); if(!st||st.fee==null) return null; return (st.alt && S.alt) ? st.fee + st.alt.fee : st.fee; };
const vatPct  = () => Number(CONFIG.VAT_PERCENT)||0;
const totalFee = () => { const b=baseFee(); return b==null ? null : Math.round(b*(1+vatPct()/100)*100)/100; };
const cleanPhone = p => toLatinDigits(p).replace(/[\s\-()]/g,'');
const errStyle = 'color:var(--red-d);font:700 .95rem var(--f-body);margin-top:.7rem';

function renderProg(){
  $('#prog').innerHTML = T.steps.map((n,i)=>{
    const k=i+1, cur=k===S.step && !S.done, done=k<S.step || !!S.done;
    return `<li class="${done?'done':''}" ${cur?'aria-current="step"':''}><span>${k}</span><b>${n}</b></li>`;
  }).join('');
}
function step1(){
  return `<h3 tabindex="-1" id="wz-h">${T.s1.title}</h3>
  <p class="hint">${T.s1.hint}</p>
  <div class="opts" role="radiogroup" aria-label="${T.s1.aria}">
  ${TRACKS.map(t=>`<label class="opt"><input type="radio" name="track" value="${t.id}" ${S.track===t.id?'checked':''}><span class="box"><span><strong>${esc(t.name)}</strong><em>${esc(t.tag)}</em></span></span></label>`).join('')}
  </div>
  <p class="err" id="e-track" style="${errStyle}" role="alert"></p>
  <div class="wz-nav"><span></span><button class="btn" type="button" data-act="next">${T.next}</button></div>`;
}
function step2(){
  const t=trackOf();
  const rows = t.stages.map(st=>{
    const price = st.fee!=null ? `<span class="price">${T.money(st.fee)}</span>` : `<span class="price agree">${esc(st.feeLabel)}</span>`;
    const note = st.feeNote ? `<em style="color:var(--red-d)">${esc(st.feeNote)}</em>` : '';
    return `<label class="opt"><input type="radio" name="stage" value="${st.id}" ${S.stage===st.id?'checked':''}><span class="box"><span><strong>${esc(st.name)}</strong>${note}</span>${price}</span></label>`;
  }).join('');
  const st=stageOf();
  const alt = (st && st.alt) ? `<label class="altchk"><input type="checkbox" id="alt" ${S.alt?'checked':''}><span>${T.altChk(esc(st.alt.label), T.money(st.fee), T.money(st.alt.fee), T.money(st.fee + st.alt.fee))}</span></label>` : '';
  return `<h3 tabindex="-1" id="wz-h">${T.s2.title}</h3>
  <p class="hint">${T.s2.hint(esc(t.name))}</p>
  <div class="opts" role="radiogroup" aria-label="${T.s2.aria}">${rows}</div>${alt}
  <p class="err" id="e-stage" style="${errStyle}" role="alert"></p>
  <div class="wz-nav"><button class="btn ghost" type="button" data-act="back">${T.back}</button><button class="btn" type="button" data-act="next">${T.next}</button></div>`;
}
function fld(id,label,type,opt,extra=''){
  const e=S.errors[id]; const v=S.data[id]||'';
  const input = type==='textarea'
    ? `<textarea id="f-${id}" name="${id}" ${extra}>${esc(v)}</textarea>`
    : type==='select'
      ? `<select id="f-${id}" name="${id}">${T.capOpts.map((o,i)=>`<option value="${i?o:''}" ${v===(i?o:'')?'selected':''}>${i?o:T.capPick}</option>`).join('')}</select>`
      : `<input id="f-${id}" name="${id}" type="${type}" value="${esc(v)}" ${extra}>`;
  return `<label class="f ${e?'bad':''} ${type==='textarea'?'full':''}" for="f-${id}">${label}${opt?`<span class="o">(${T.optional})</span>`:''}${input}<span class="err" role="alert">${e?esc(e):''}</span></label>`;
}
function step3(){
  const pa = T.dir==='rtl' ? 'end' : 'start';
  return `<h3 tabindex="-1" id="wz-h">${T.s3.title}</h3>
  <p class="hint">${T.s3.hint}</p>
  <div class="fields">
    ${fld('name',T.f.name,'text',false,'autocomplete="name" required')}
    ${fld('phone',T.f.phone,'tel',false,`autocomplete="tel" inputmode="tel" dir="ltr" placeholder="05XXXXXXXX" style="text-align:${pa}"`)}
    ${fld('email',T.f.email,'email',true,`autocomplete="email" dir="ltr" style="text-align:${pa}"`)}
    ${fld('city',T.f.city,'text',true,'autocomplete="address-level2"')}
    ${fld('capital',T.f.capital,'select',true)}
    ${fld('summary',T.f.summary,'textarea',false,`placeholder="${T.ph.summary}"`)}
  </div>
  <div class="hp" aria-hidden="true"><label>${T.s3.honeypot}<input type="text" id="f-website" name="website" tabindex="-1" autocomplete="off"></label></div>
  <div class="wz-nav"><button class="btn ghost" type="button" data-act="back">${T.back}</button><button class="btn" type="button" data-act="next">${T.review}</button></div>`;
}
function step4(){
  const t=trackOf(), st=stageOf(), base=baseFee(), total=totalFee();
  const row=(k,v,cls='')=>`<div class="${cls}"><dt>${k}</dt><dd>${v}</dd></div>`;
  const vatRows = (base!=null && vatPct()>0) ? row(T.s4.fee,T.money(base))+row(T.s4.vatLine(vatPct()),T.money(Math.round(base*vatPct())/100)) : '';
  const feeTxt = total!=null ? T.money(total) : esc(st.feeLabel||T.agreeDefault);
  const noteRow = st.feeNote ? row(T.s4.note,esc(st.feeNote)) : '';
  const btn = total!=null ? T.s4.payBtn(T.money(total)) : T.s4.waBtn;
  return `<h3 tabindex="-1" id="wz-h">${T.s4.title}</h3>
  <dl class="sum frame">
    ${row(T.s4.track,esc(t.name))}${row(T.s4.stage,esc(st.name))}${noteRow}
    ${row(T.s4.name,esc(S.data.name))}${row(T.s4.mobile,`<span dir="ltr">${esc(S.data.phone)}</span>`)}${vatRows}
    ${row(T.s4.amount,feeTxt,'total')}
  </dl>
  ${total!=null?`<p class="hint" style="margin-top:.8rem">${T.s4.redirectNote}</p>`:''}
  <div class="agree-box">
    <label class="chk"><input type="checkbox" id="a1" ${S.agree1?'checked':''}><span>${T.s4.agree1(esc(T.company))}</span></label>
    <label class="chk"><input type="checkbox" id="a2" ${S.agree2?'checked':''}><span>${T.s4.agree2(total!=null)}</span></label>
  </div>
  <p class="err" id="e-agree" style="${errStyle}" role="alert"></p>
  <div class="wz-nav"><button class="btn ghost" type="button" data-act="back">${T.back}</button><button class="btn" type="button" data-act="confirm" ${S.busy?'disabled':''}>${btn}</button></div>`;
}
function leadText(){
  const t=trackOf(), st=stageOf(), total=totalFee();
  return T.lead({company:T.company, track:t.name, stage:st.name, fee: total!=null ? T.money(total) : (st.feeLabel||T.agreeDefault),
    name:S.data.name, phone:cleanPhone(S.data.phone), city:S.data.city, capital:S.data.capital, summary:S.data.summary});
}
function doneWA(){
  const st=stageOf();
  return `<h3 tabindex="-1" id="wz-h">${T.dWA.title}</h3>
  <div class="alert ok"><b>${T.dWA.box}</b>${T.dWA.text(esc(st.name), esc(st.feeLabel||T.agreeDefault))}</div>
  <div class="cta-row"><button class="btn wa" type="button" data-act="wa">${T.dWA.btn}</button></div>
  <div class="wz-nav"><button class="btn ghost" type="button" data-act="reset">${T.newOrder}</button><span></span></div>`;
}
function doneRedirect(url){
  return `<h3 tabindex="-1" id="wz-h">${T.dRed.title}</h3>
  <div class="alert ok"><b>${T.dRed.box}</b>${T.dRed.text(esc(url))}</div>`;
}
function doneError(msg){
  return `<h3 tabindex="-1" id="wz-h">${T.dErr.title}</h3>
  <div class="alert"><b>${esc(msg)}</b>${T.dErr.text}</div>
  <div class="wz-nav"><button class="btn ghost" type="button" data-act="back">${T.dErr.back}</button><button class="btn wa" type="button" data-act="wa">${T.dErr.wa}</button></div>`;
}

function validate3(){
  const d=S.data, e={};
  if(!d.name.trim() || d.name.trim().length<3) e.name=T.v.name;
  if(!/^(?:\+?966|00966|0)?5\d{8}$/.test(cleanPhone(d.phone))) e.phone=T.v.phone;
  if(d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) e.email=T.v.email;
  if(!d.summary.trim() || d.summary.trim().length<10) e.summary=T.v.summary;
  S.errors=e; return !Object.keys(e).length;
}

function render(focus=true){
  renderProg();
  const body=$('#wz-body');
  if(S.done){ body.innerHTML=S.done; }
  else body.innerHTML = [null,step1,step2,step3,step4][S.step]();
  if(focus){ const h=$('#wz-h'); if(h) h.focus({preventScroll:true}); }
}
function go(n){ S.done=null; S.step=n; render(); $('#wz').scrollIntoView({behavior:'smooth',block:'start'}); }

async function createInvoice(){
  const hp = ($('#f-website')||{}).value || '';
  const res = await fetch(`${CONFIG.API_BASE}/create-invoice`, {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({
      lang:T.lang, stage:S.stage, alt:!!S.alt,
      name:S.data.name.trim(), phone:cleanPhone(S.data.phone), email:S.data.email.trim(),
      city:S.data.city.trim(), capital:S.data.capital, summary:S.data.summary.trim(), website:hp
    })
  });
  let j=null; try{ j=await res.json(); }catch(e){}
  if(!res.ok || !j || !j.url) throw new Error(T.e[j && j.code] || T.e.conn);
  const u=new URL(j.url);
  if(u.protocol!=='https:' || !/(^|\.)moyasar\.com$/.test(u.hostname)) throw new Error(T.e.badUrl);
  return j.url;
}

const wz=$('#wz-body');
wz.addEventListener('change', e=>{
  const el=e.target;
  if(el.name==='track'){ if(S.track!==el.value){ S.track=el.value; S.stage=null; S.alt=false; } $('#e-track').textContent=''; }
  if(el.name==='stage'){ S.stage=el.value; S.alt=false; $('#e-stage').textContent=''; render(false); const c=$(`input[name=stage][value=${el.value}]`); if(c) c.focus(); }
  if(el.id==='alt') S.alt=el.checked;
  if(el.id==='a1') S.agree1=el.checked;
  if(el.id==='a2') S.agree2=el.checked;
  if(el.name==='capital') S.data.capital=el.value;
});
wz.addEventListener('input', e=>{
  const el=e.target; if(el.name && el.name in S.data && el.name!=='capital') S.data[el.name]=el.value;
});
wz.addEventListener('click', async e=>{
  const b=e.target.closest('[data-act]'); if(!b) return;
  const a=b.dataset.act;
  if(a==='back') go(S.step>1 ? (S.done? 4 : S.step-1) : 1);
  if(a==='next'){
    if(S.step===1){ if(!S.track){ $('#e-track').textContent=T.s1.err; return; } go(2); }
    else if(S.step===2){ if(!S.stage){ $('#e-stage').textContent=T.s2.err; return; } go(3); }
    else if(S.step===3){ if(!validate3()){ render(false); const f=$('.f.bad input, .f.bad textarea, .f.bad select'); if(f) f.focus(); return; } go(4); }
  }
  if(a==='confirm'){
    if(!S.agree1 || !S.agree2){ $('#e-agree').textContent=T.s4.err; return; }
    if(totalFee()==null){ openWA(leadText()); S.done=doneWA(); render(); return; }
    S.busy=true; b.disabled=true; b.textContent=T.s4.preparing;
    try{
      const url = await createInvoice();
      S.done=doneRedirect(url); render();
      setTimeout(()=>window.location.assign(url), 900);
    }catch(err){
      S.done=doneError(err.message||T.e.unexpected); render();
    }finally{ S.busy=false; }
  }
  if(a==='wa') openWA(leadText());
  if(a==='reset'){ Object.assign(S,{step:1,track:null,stage:null,alt:false,agree1:false,agree2:false,errors:{},done:null,data:blank()}); go(1); }
});

/** Opens the form for a track, or for a specific stage (priced stages go straight to the details step). */
function pick(trackId, stageId){
  const track = TRACKS.find(t=>t.id===trackId);
  const stage = track && track.stages.find(x=>x.id===stageId);
  if(S.track!==trackId){ S.track=trackId; S.stage=null; S.alt=false; }
  if(stage){ S.stage=stage.id; S.alt=false; }
  S.done=null; S.step = stage && !stage.alt ? 3 : 2;
  render(false);
  $('#start').scrollIntoView({behavior:'smooth'});
  setTimeout(()=>{ const h=$('#wz-h'); if(h) h.focus({preventScroll:true}); },450);
}
document.addEventListener('click', e=>{ const p=e.target.closest('[data-pick]'); if(p) pick(p.dataset.pick, p.dataset.stage); });

render(false);
const params=new URLSearchParams(location.search);
if(TRACKS.some(t=>t.id===params.get('track'))) pick(params.get('track'), params.get('stage'));
} else {
  // صفحة المسارات: أزرار الدفع تنقل إلى نموذج الطلب في الرئيسية مع المسار والمرحلة المختارين
  document.addEventListener('click', e=>{
    const p=e.target.closest('[data-pick]'); if(!p) return;
    const stage = p.dataset.stage ? '&stage='+encodeURIComponent(p.dataset.stage) : '';
    location.href='index.html?track='+encodeURIComponent(p.dataset.pick)+stage+'#start';
  });
}
