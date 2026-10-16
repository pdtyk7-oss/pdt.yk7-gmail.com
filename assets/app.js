/* الصفحة الرئيسية: عرض المسارات + نموذج الطلب متعدد الخطوات.
   لا يُخزَّن شيء في المتصفح ولا على الخادم. عند الدفع يُنشأ طلب فاتورة لدى ميسر
   ثم يُنقل العميل إلى صفحة الفاتورة المستضافة لدى ميسر. */

/* ---------- عرض المسارات ---------- */
function stampHTML(st){
  if(st.fee!=null) return `<div class="stamp"><b>${fmt(st.fee)}</b><small>ريال</small></div>`;
  return `<div class="stamp agree"><span>${esc(st.feeLabel||'حسب الاتفاق')}</span></div>`;
}
function stageHTML(st, i){
  const lead = st.lead ? `<p class="lead2">${esc(st.lead)}</p>` : '';
  const list = st.numbered
    ? `<ol class="steps13">${st.items.map(x=>`<li>${esc(x)}</li>`).join('')}</ol>`
    : `<ul class="items">${st.items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;
  const alt  = st.alt ? `<p class="alt">${esc(st.alt.label)}: الرسوم <b>${fmt(st.alt.fee)} ريال</b></p>` : '';
  const note = st.feeNote ? `<span class="feenote">${esc(st.feeNote)}</span>` : '';
  return `<li class="stage">
    <span class="num" aria-hidden="true">${i+1}</span>
    <div><h4>${esc(st.name)}</h4>${note}${lead}${list}${alt}</div>
    <div class="stamp-col">${stampHTML(st)}</div></li>`;
}
function panelHTML(t, idx){
  const pts = `<ul class="dashes">${t.points.map(p=>`<li>${esc(p)}</li>`).join('')}</ul>`;
  const crit = t.critical ? `<div class="callout sketch red"><b>${esc(t.critical.title)}</b>${esc(t.critical.text)}</div>` : '';
  const ntc  = t.notice ? `<div class="callout sketch soft"><b>${esc(t.notice.title)}</b>${esc(t.notice.text)}</div>` : '';
  const scopeList = t.scopeList ? `<h4 class="sub-h">ماذا نقدم؟</h4><ul class="dashes" style="columns:2;column-gap:2rem">${t.scopeList.map(x=>`<li style="break-inside:avoid">${esc(x)}</li>`).join('')}</ul>` : '';
  const scope = t.scope ? `<h4 class="sub-h">ماذا يشمل التطوير العقاري؟</h4><div class="scope">${t.scope.map(s=>`<div><b>${esc(s.t)}</b><p>${esc(s.d)}</p>${s.q?`<ul>${s.q.map(q=>`<li>${esc(q)}</li>`).join('')}</ul>`:''}</div>`).join('')}</div>` : '';
  const flow = t.flow ? `<h4 class="sub-h">كيف نعمل؟</h4><ol class="flow">${t.flow.map(f=>`<li>${esc(f)}</li>`).join('')}</ol>` : '';
  return `<div class="tp" role="tabpanel" id="tp-${t.id}" aria-labelledby="tab-${t.id}" ${idx?'hidden':''} tabindex="0">
    <div class="tp-head"><div><h3>${esc(t.name)}</h3><p class="tp-tag">${esc(t.tag)}</p><p class="tp-intro">${esc(t.intro)}</p></div><div>${pts}</div></div>
    ${crit}${ntc}${scopeList}${scope}${flow}
    <h4 class="sub-h">مراحل ${esc(t.name)} ورسومها</h4>
    <ol class="journey">${t.stages.map(stageHTML).join('')}</ol>
    <div class="cta-row"><button class="btn" type="button" data-pick="${t.id}">ابدأ طلب «${esc(t.name)}»</button></div>
  </div>`;
}
function renderTracks(){
  $('#tablist').innerHTML = TRACKS.map((t,i)=>`<button class="tab" role="tab" id="tab-${t.id}" aria-controls="tp-${t.id}" aria-selected="${i===0}" tabindex="${i===0?0:-1}" data-tab="${t.id}">${esc(t.name)}</button>`).join('');
  $('#tabpanels').innerHTML = TRACKS.map(panelHTML).join('');
  const tabs = $$('.tab');
  const show = id => {
    tabs.forEach(b => { const on=b.dataset.tab===id; b.setAttribute('aria-selected',on); b.tabIndex=on?0:-1; });
    $$('.tp').forEach(p => p.hidden = p.id!=='tp-'+id);
  };
  tabs.forEach((b,i)=>{
    b.addEventListener('click',()=>show(b.dataset.tab));
    b.addEventListener('keydown',e=>{
      let n=null;
      if(e.key==='ArrowLeft') n=(i+1)%tabs.length;
      if(e.key==='ArrowRight') n=(i-1+tabs.length)%tabs.length;
      if(n!==null){ e.preventDefault(); tabs[n].focus(); show(tabs[n].dataset.tab); }
    });
  });
}

/* ---------- نموذج الطلب ---------- */
const STEPS = ['المسار','المرحلة','بياناتك','المراجعة والدفع'];
const blank = () => ({name:'',phone:'',email:'',city:'',capital:'',summary:''});
const S = { step:1, track:null, stage:null, alt:false, data:blank(), agree1:false, agree2:false, errors:{}, busy:false, done:null };
const trackOf = () => TRACKS.find(t=>t.id===S.track);
const stageOf = () => { const t=trackOf(); return t && t.stages.find(s=>s.id===S.stage); };
const baseFee = () => { const st=stageOf(); if(!st||st.fee==null) return null; return (st.alt && S.alt) ? st.alt.fee : st.fee; };
const vatPct  = () => Number(CONFIG.VAT_PERCENT)||0;
const totalFee = () => { const b=baseFee(); return b==null ? null : Math.round(b*(1+vatPct()/100)*100)/100; };
const cleanPhone = p => toLatinDigits(p).replace(/[\s\-()]/g,'');

function renderProg(){
  $('#prog').innerHTML = STEPS.map((n,i)=>{
    const k=i+1, cur=k===S.step && !S.done, done=k<S.step || !!S.done;
    return `<li class="${done?'done':''}" ${cur?'aria-current="step"':''}><span>${k}</span><b>${n}</b></li>`;
  }).join('');
}
function step1(){
  return `<h3 tabindex="-1" id="wz-h">ما المسار الذي يناسب وضعك؟</h3>
  <p class="hint">اختر مساراً واحداً، ويمكنك تغييره لاحقاً.</p>
  <div class="opts" role="radiogroup" aria-label="المسار">
  ${TRACKS.map(t=>`<label class="opt"><input type="radio" name="track" value="${t.id}" ${S.track===t.id?'checked':''}><span class="box"><span><strong>${esc(t.name)}</strong><em>${esc(t.tag)}</em></span></span></label>`).join('')}
  </div>
  <p class="err" id="e-track" style="color:var(--red-d);font:600 .95rem var(--f-hand);margin-top:.7rem" role="alert"></p>
  <div class="wz-nav"><span></span><button class="btn" type="button" data-act="next">التالي</button></div>`;
}
function step2(){
  const t=trackOf();
  const rows = t.stages.map(st=>{
    const price = st.fee!=null ? `<span class="price">${fmt(st.fee)} ريال</span>` : `<span class="price agree">${esc(st.feeLabel)}</span>`;
    const note = st.feeNote ? `<em style="color:var(--red-d)">${esc(st.feeNote)}</em>` : '';
    return `<label class="opt"><input type="radio" name="stage" value="${st.id}" ${S.stage===st.id?'checked':''}><span class="box"><span><strong>${esc(st.name)}</strong>${note}</span>${price}</span></label>`;
  }).join('');
  const st=stageOf();
  const alt = (st && st.alt) ? `<label class="altchk"><input type="checkbox" id="alt" ${S.alt?'checked':''}><span>${esc(st.alt.label)}. تصبح رسوم المرحلة <b>${fmt(st.alt.fee)} ريال</b> بدلاً من ${fmt(st.fee)}.</span></label>` : '';
  return `<h3 tabindex="-1" id="wz-h">في أي مرحلة تريد أن تبدأ؟</h3>
  <p class="hint">مسار «${esc(t.name)}». إن لم تكن متأكداً فابدأ بالمرحلة الأولى. المراحل «حسب الاتفاق» لا تُدفع من الموقع، وسنتواصل معك لتحديدها.</p>
  <div class="opts" role="radiogroup" aria-label="المرحلة">${rows}</div>${alt}
  <p class="err" id="e-stage" style="color:var(--red-d);font:600 .95rem var(--f-hand);margin-top:.7rem" role="alert"></p>
  <div class="wz-nav"><button class="btn ghost" type="button" data-act="back">السابق</button><button class="btn" type="button" data-act="next">التالي</button></div>`;
}
function fld(id,label,type,opt,extra=''){
  const e=S.errors[id]; const v=S.data[id]||'';
  const input = type==='textarea'
    ? `<textarea id="f-${id}" name="${id}" ${extra}>${esc(v)}</textarea>`
    : type==='select'
      ? `<select id="f-${id}" name="${id}">${['','أقل من 50 ألف ريال','من 50 إلى 200 ألف ريال','من 200 ألف إلى مليون ريال','أكثر من مليون ريال'].map(o=>`<option value="${o}" ${v===o?'selected':''}>${o||'اختر (اختياري)'}</option>`).join('')}</select>`
      : `<input id="f-${id}" name="${id}" type="${type}" value="${esc(v)}" ${extra}>`;
  return `<label class="f ${e?'bad':''} ${type==='textarea'?'full':''}" for="f-${id}">${label}${opt?'<span class="o">(اختياري)</span>':''}${input}<span class="err" role="alert">${e?esc(e):''}</span></label>`;
}
function step3(){
  return `<h3 tabindex="-1" id="wz-h">بياناتك ونبذة عن مشروعك</h3>
  <p class="hint">تظهر بياناتك على الفاتورة وتُستخدم للتواصل معك، ولا يحتفظ الموقع بنسخة منها.</p>
  <div class="fields">
    ${fld('name','الاسم الكامل','text',false,'autocomplete="name" required')}
    ${fld('phone','رقم الجوال (واتساب)','tel',false,'autocomplete="tel" inputmode="tel" dir="ltr" placeholder="05XXXXXXXX" style="text-align:end"')}
    ${fld('email','البريد الإلكتروني','email',true,'autocomplete="email" dir="ltr" style="text-align:end"')}
    ${fld('city','المدينة','text',true,'autocomplete="address-level2"')}
    ${fld('capital','رأس المال المتاح تقريباً','select',true)}
    ${fld('summary','نبذة مختصرة عن فكرتك أو مشروعك أو وضعك الحالي','textarea',false,'placeholder="مثال: لدي أرض في الخبر وأريد البناء عليها..."')}
  </div>
  <div class="hp" aria-hidden="true"><label>لا تملأ هذا الحقل<input type="text" id="f-website" name="website" tabindex="-1" autocomplete="off"></label></div>
  <div class="wz-nav"><button class="btn ghost" type="button" data-act="back">السابق</button><button class="btn" type="button" data-act="next">مراجعة الطلب</button></div>`;
}
function step4(){
  const t=trackOf(), st=stageOf(), base=baseFee(), total=totalFee();
  const row=(k,v,cls='')=>`<div class="${cls}"><dt>${k}</dt><dd>${v}</dd></div>`;
  const vatRows = (base!=null && vatPct()>0) ? row('الرسوم',`${fmt(base)} ريال`)+row(`ضريبة القيمة المضافة (${vatPct()}%)`,`${fmt(Math.round(base*vatPct())/100)} ريال`) : '';
  const feeTxt = total!=null ? `${fmt(total)} ريال` : esc(st.feeLabel||'حسب الاتفاق');
  const noteRow = st.feeNote ? row('ملاحظة',esc(st.feeNote)) : '';
  const btn = total!=null ? `الانتقال إلى الفاتورة والدفع (${fmt(total)} ريال)` : 'إرسال الطلب عبر واتساب';
  return `<h3 tabindex="-1" id="wz-h">راجع طلبك قبل المتابعة</h3>
  <dl class="sum sketch">
    ${row('المسار',esc(t.name))}${row('المرحلة',esc(st.name))}${noteRow}
    ${row('الاسم',esc(S.data.name))}${row('الجوال',`<span dir="ltr">${esc(S.data.phone)}</span>`)}${vatRows}
    ${row('المبلغ',feeTxt,'total')}
  </dl>
  ${total!=null?`<p class="hint" style="margin-top:.8rem">بعد الضغط ننقلك إلى صفحة الفاتورة المعتمدة لدى ميسر، وفيها بياناتك ونوع الخدمة والمبلغ، وتدفع من هناك. لا يمر رقم بطاقتك بموقعنا.</p>`:''}
  <div class="agree-box">
    <label class="chk"><input type="checkbox" id="a1" ${S.agree1?'checked':''}><span>أفهم أن «${esc(CONFIG.COMPANY)}» جهة توعية وإرشاد وإشراف ومتابعة فقط، ولا تنفّذ الأعمال ولا تحل محل المكتب الهندسي أو الجهات المرخصة، وأن الأعمال التنفيذية تتم عبر جهات متخصصة مستقلة تحت إشرافها حسب الاتفاق المبرم.</span></label>
    <label class="chk"><input type="checkbox" id="a2" ${S.agree2?'checked':''}><span>اطلعت على <a href="policy.html" target="_blank" rel="noopener">سياستنا</a> و<a href="privacy.html" target="_blank" rel="noopener">سياسة الخصوصية</a>${total!=null?'، وأوافق على رسوم المرحلة المذكورة':''}.</span></label>
  </div>
  <p class="err" id="e-agree" style="color:var(--red-d);font:600 .95rem var(--f-hand);margin-top:.7rem" role="alert"></p>
  <div class="wz-nav"><button class="btn ghost" type="button" data-act="back">السابق</button><button class="btn" type="button" data-act="confirm" ${S.busy?'disabled':''}>${btn}</button></div>`;
}
function leadText(){
  const t=trackOf(), st=stageOf(), total=totalFee();
  return `السلام عليكم، أرغب بالتسجيل لدى ${CONFIG.COMPANY}.\nالمسار: ${t.name}\nالمرحلة: ${st.name}\nالرسوم: ${total!=null?fmt(total)+' ريال':(st.feeLabel||'حسب الاتفاق')}\nالاسم: ${S.data.name}\nالجوال: ${cleanPhone(S.data.phone)}${S.data.city?'\nالمدينة: '+S.data.city:''}${S.data.capital?'\nرأس المال: '+S.data.capital:''}\nنبذة: ${S.data.summary}`;
}
function doneWA(){
  const st=stageOf();
  return `<h3 tabindex="-1" id="wz-h">طلبك جاهز للإرسال</h3>
  <div class="alert ok"><b>لا يوجد دفع الآن</b>مرحلة «${esc(st.name)}» تُحدَّد رسومها ${esc(st.feeLabel||'بالاتفاق')}. أرسل طلبك عبر واتساب لنتواصل معك ونحدد نطاق العمل والرسوم.</div>
  <div class="cta-row"><button class="btn wa" type="button" data-act="wa">فتح واتساب وإرسال الطلب</button></div>
  <div class="wz-nav"><button class="btn ghost" type="button" data-act="reset">طلب جديد</button><span></span></div>`;
}
function doneRedirect(url){
  return `<h3 tabindex="-1" id="wz-h">جاري نقلك إلى صفحة الفاتورة</h3>
  <div class="alert ok"><b>فاتورتك جاهزة لدى ميسر</b>سيتم نقلك خلال لحظات. إن لم يحدث ذلك فاضغط الرابط: <a href="${esc(url)}" rel="noopener">فتح صفحة الفاتورة والدفع</a></div>`;
}
function doneError(msg){
  return `<h3 tabindex="-1" id="wz-h">تعذّر إنشاء الفاتورة</h3>
  <div class="alert"><b>${esc(msg)}</b>لم يُخصم أي مبلغ. يمكنك إعادة المحاولة بعد قليل، أو إرسال طلبك عبر واتساب ونكمل معك مباشرة.</div>
  <div class="wz-nav"><button class="btn ghost" type="button" data-act="back">رجوع للمراجعة</button><button class="btn wa" type="button" data-act="wa">إرسال الطلب عبر واتساب</button></div>`;
}

function validate3(){
  const d=S.data, e={};
  if(!d.name.trim() || d.name.trim().length<3) e.name='اكتب اسمك الكامل.';
  if(!/^(?:\+?966|00966|0)?5\d{8}$/.test(cleanPhone(d.phone))) e.phone='اكتب رقم جوال سعودي صحيح، مثل 05XXXXXXXX.';
  if(d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) e.email='صيغة البريد غير صحيحة.';
  if(!d.summary.trim() || d.summary.trim().length<10) e.summary='اكتب نبذة قصيرة (10 أحرف على الأقل) لنفهم احتياجك.';
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
  const res = await fetch(CONFIG.INVOICE_ENDPOINT, {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({
      stage:S.stage, alt:!!S.alt,
      name:S.data.name.trim(), phone:cleanPhone(S.data.phone), email:S.data.email.trim(),
      city:S.data.city.trim(), capital:S.data.capital, summary:S.data.summary.trim(), website:hp
    })
  });
  let j=null; try{ j=await res.json(); }catch(e){}
  if(!res.ok || !j || !j.url) throw new Error((j && j.message) || 'خطأ في الاتصال بالخادم.');
  const u=new URL(j.url);
  if(u.protocol!=='https:' || !/(^|\.)moyasar\.com$/.test(u.hostname)) throw new Error('رابط الفاتورة غير معتمد.');
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
    if(S.step===1){ if(!S.track){ $('#e-track').textContent='اختر مساراً للمتابعة.'; return; } go(2); }
    else if(S.step===2){ if(!S.stage){ $('#e-stage').textContent='اختر مرحلة للمتابعة.'; return; } go(3); }
    else if(S.step===3){ if(!validate3()){ render(false); const f=$('.f.bad input, .f.bad textarea, .f.bad select'); if(f) f.focus(); return; } go(4); }
  }
  if(a==='confirm'){
    if(!S.agree1 || !S.agree2){ $('#e-agree').textContent='يلزم الموافقة على الإقرارين للمتابعة.'; return; }
    if(totalFee()==null){ openWA(leadText()); S.done=doneWA(); render(); return; }
    S.busy=true; b.disabled=true; b.textContent='نجهّز فاتورتك...';
    try{
      const url = await createInvoice();
      S.done=doneRedirect(url); render();
      setTimeout(()=>window.location.assign(url), 900);
    }catch(err){
      S.done=doneError(err.message||'حدث خطأ غير متوقع.'); render();
    }finally{ S.busy=false; }
  }
  if(a==='wa') openWA(leadText());
  if(a==='reset'){ Object.assign(S,{step:1,track:null,stage:null,alt:false,agree1:false,agree2:false,errors:{},done:null,data:blank()}); go(1); }
});

function pickTrack(id){
  if(S.track!==id){ S.track=id; S.stage=null; S.alt=false; }
  S.done=null; S.step=2; render(false);
  $('#start').scrollIntoView({behavior:'smooth'});
  setTimeout(()=>{ const h=$('#wz-h'); if(h) h.focus({preventScroll:true}); },450);
}
document.addEventListener('click', e=>{ const p=e.target.closest('[data-pick]'); if(p) pickTrack(p.dataset.pick); });

renderTracks();
render(false);
