// ROʻYXAT BOSHQARUVI — patch
(function(){
  // Modal HTML qo'shish
  if(!document.getElementById('ovReg')){
    const div = document.createElement('div');
    div.innerHTML = `<div class="ov" id="ovReg"><div class="modal" style="max-width:460px">
<h2>📋 Ro'yxat Boshqaruvi</h2>
<div id="regStatusBox" style="border-radius:12px;padding:14px;margin-bottom:16px;text-align:center;font-weight:800;font-size:16px;background:#1a2a1a;color:#22c55e;border:1px solid #22c55e44">⏳ Yuklanmoqda...</div>
<button id="regToggleBtn" onclick="toggleRegStatus()" style="width:100%;padding:14px;border-radius:10px;border:none;color:#fff;font-weight:800;font-size:16px;cursor:pointer;margin-bottom:14px;background:#22c55e">✅ Ro'yxatni Ochish</button>
<div style="background:#0f1117;border:1px solid #2d3252;border-radius:12px;padding:14px;margin-bottom:12px">
<div style="font-size:13px;color:#9ca3af;margin-bottom:8px">📅 Imtihon sanasi va vaqti</div>
<div style="display:flex;gap:8px;margin-bottom:8px;flex-wrap:wrap">
<input type="date" id="regDateInput" style="flex:1;min-width:130px;padding:10px;background:#1a1f35;border:1px solid #2d3252;border-radius:8px;color:#fff;font-size:14px">
<input type="time" id="regTimeInput" value="11:00" style="width:110px;padding:10px;background:#1a1f35;border:1px solid #2d3252;border-radius:8px;color:#fff;font-size:14px">
</div>
<button onclick="saveRegDate()" style="width:100%;padding:11px;border-radius:8px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border:none;font-weight:700;font-size:14px;cursor:pointer">💾 Saqlash</button>
<div id="regDateInfo" style="font-size:12px;color:#6b7280;margin-top:8px;text-align:center"></div>
</div>
<div style="background:#0f1117;border:1px solid #2d3252;border-radius:12px;padding:14px;margin-bottom:12px">
<div style="font-size:13px;color:#9ca3af;margin-bottom:8px">📢 Bildirishnoma yuborish</div>
<textarea id="regNotifMsg" rows="3" placeholder="Misol: Imtihonga qabul 15 daqiqadan so'ng boshlanadi..." style="width:100%;padding:10px;background:#1a1f35;border:1px solid #2d3252;border-radius:8px;color:#fff;font-size:13px;resize:vertical;margin-bottom:8px"></textarea>
<button onclick="sendRegNotif()" style="width:100%;padding:11px;border-radius:8px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border:none;font-weight:700;font-size:14px;cursor:pointer">📤 Yuborish</button>
</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
<div style="background:#0f1117;border:1px solid #2d3252;border-radius:10px;padding:12px;text-align:center">
<div style="font-size:11px;color:#6b7280;margin-bottom:4px">Jami ro'yxatda</div>
<div id="regStatTotal" style="font-size:28px;font-weight:900;color:#22c55e">0</div>
</div>
<div style="background:#0f1117;border:1px solid #2d3252;border-radius:10px;padding:12px;text-align:center">
<div style="font-size:11px;color:#6b7280;margin-bottom:4px">Bugun</div>
<div id="regStatToday" style="font-size:28px;font-weight:900;color:#6366f1">0</div>
</div>
</div>
<div style="background:#0f1117;border:1px solid #2d3252;border-radius:10px;padding:12px;margin-bottom:14px">
<div style="font-size:11px;color:#6b7280;margin-bottom:6px">🔗 Ro'yxat sahifasi</div>
<div style="display:flex;gap:6px;align-items:center">
<div id="regLink" style="flex:1;font-size:12px;color:#38bdf8;word-break:break-all;font-family:monospace"></div>
<button onclick="copyRegLink()" style="padding:6px 12px;border-radius:8px;border:1px solid #38bdf855;background:transparent;color:#38bdf8;font-size:12px;cursor:pointer;font-weight:700;white-space:nowrap">Nusxa</button>
</div>
</div>
<div style="background:#0f1117;border:1px solid #2d3252;border-radius:12px;padding:14px;margin-bottom:12px">
<div style="font-size:13px;color:#9ca3af;margin-bottom:8px">💬 Talabalar savollari (bugungi)</div>
<div id="regQuestions" style="max-height:200px;overflow-y:auto"></div>
<button onclick="loadRegQuestions()" style="margin-top:8px;padding:6px 14px;border-radius:8px;border:1px solid #2d3252;background:transparent;color:#6b7280;font-size:12px;cursor:pointer">🔄 Yangilash</button>
</div>
<button class="mbtn sec" onclick="hide('ovReg')">Yopish</button>
</div></div>`;
    document.body.appendChild(div.firstChild);
  }

  // navTo ni kengaytirish
  const _oldNavTo = window.navTo;
  window.navTo = function(id){
    if(id === 'ovReg'){ openRegPanel(); show('ovReg'); closeDrawer(); return; }
    _oldNavTo(id);
  };

  // Funksiyalar
  window.openRegPanel = async function(){
    const regUrl = location.origin + location.pathname.replace('index.html','') + 'student-registration.html';
    const el = document.getElementById('regLink');
    if(el) el.textContent = regUrl;
    await loadRegStatus();
    await loadRegStats();
    await loadRegQuestions();
  };

  window.loadRegStatus = async function(){
    try{
      const d = await db.collection('config').doc('registration').get();
      updateRegUI(d.exists ? d.data() : {});
    }catch(e){ console.error(e); }
  };

  window.updateRegUI = function(data){
    const isOpen = data && data.open;
    const sb = document.getElementById('regStatusBox');
    const tb = document.getElementById('regToggleBtn');
    if(!sb||!tb) return;
    if(isOpen){
      sb.style.background='#1a2a1a'; sb.style.color='#22c55e'; sb.style.borderColor='#22c55e44';
      sb.textContent='✅ Ro\'yxatga olish OCHIQ';
      tb.style.background='#ef4444'; tb.textContent='🔒 Ro\'yxatni Yopish';
    } else {
      sb.style.background='#2a1a1a'; sb.style.color='#ef4444'; sb.style.borderColor='#ef444444';
      sb.textContent='🔒 Ro\'yxatga olish YOPIQ';
      tb.style.background='#22c55e'; tb.textContent='✅ Ro\'yxatni Ochish';
    }
    if(data && data.date){
      const di = document.getElementById('regDateInput');
      const ti = document.getElementById('regTimeInput');
      const ri = document.getElementById('regDateInfo');
      if(di) di.value = data.date;
      if(ti) ti.value = data.time||'11:00';
      if(ri) ri.textContent = '📅 Belgilangan: '+data.date+' soat '+(data.time||'11:00');
    }
  };

  window.toggleRegStatus = async function(){
    try{
      const d = await db.collection('config').doc('registration').get();
      const cur = d.exists ? !!d.data().open : false;
      const data = d.exists ? d.data() : {};
      await db.collection('config').doc('registration').set({...data, open:!cur, updatedAt:new Date().toISOString()});
      updateRegUI({...data, open:!cur});
      toast(!cur?'✅ Ro\'yxat OCHILDI!':'🔒 Ro\'yxat YOPILDI!');
    }catch(e){ toast('Xato: '+e.message); }
  };

  window.saveRegDate = async function(){
    const date = document.getElementById('regDateInput').value;
    const time = document.getElementById('regTimeInput').value||'11:00';
    if(!date){ toast('Sanani tanlang!'); return; }
    try{
      const d = await db.collection('config').doc('registration').get();
      const cur = d.exists ? d.data() : {};
      await db.collection('config').doc('registration').set({...cur, date, time, updatedAt:new Date().toISOString()});
      const ri = document.getElementById('regDateInfo');
      if(ri) ri.textContent = '📅 Belgilangan: '+date+' soat '+time;
      toast('✅ Sana saqlandi!');
    }catch(e){ toast('Xato: '+e.message); }
  };

  window.sendRegNotif = async function(){
    const msg = document.getElementById('regNotifMsg').value.trim();
    if(!msg){ toast('Xabar yozing!'); return; }
    try{
      await db.collection('config').doc('regNotification').set({msg, sentAt:new Date().toISOString()});
      document.getElementById('regNotifMsg').value='';
      toast('📤 Xabar yuborildi!');
    }catch(e){ toast('Xato: '+e.message); }
  };

  window.loadRegStats = async function(){
    try{
      const snap = await db.collection('registrations').get();
      const today = new Date().toLocaleDateString('uz-UZ');
      const all = []; snap.forEach(d=>all.push(d.data()));
      const ts = document.getElementById('regStatTotal');
      const td = document.getElementById('regStatToday');
      if(ts) ts.textContent = all.length;
      if(td) td.textContent = all.filter(s=>s.date===today).length;
    }catch(e){}
  };

  window.loadRegQuestions = async function(){
    const el = document.getElementById('regQuestions');
    if(!el) return;
    try{
      const TODAY = new Date().toISOString().split('T')[0];
      const snap = await db.collection('studentQuestions').where('date','==',TODAY).get();
      if(snap.empty){ el.innerHTML='<div style="font-size:12px;color:#6b7280;padding:8px">Hali savol yo\'q</div>'; return; }
      el.innerHTML = snap.docs.map(d=>{
        const q=d.data();
        return `<div style="background:#161b22;border:1px solid #2d3252;border-radius:8px;padding:10px;margin-bottom:6px">
          <div style="font-size:11px;color:#9ca3af;margin-bottom:3px">👤 ${q.from||''} ${q.ochred?'(Navbat: №'+q.ochred+')':''}</div>
          <div style="font-size:13px;color:#e6edf3">${q.msg||''}</div>
        </div>`;
      }).join('');
    }catch(e){ el.innerHTML='<div style="font-size:12px;color:#ef4444">'+e.message+'</div>'; }
  };

  window.copyRegLink = function(){
    const u = document.getElementById('regLink').textContent;
    navigator.clipboard.writeText(u).then(()=>toast('📋 Nusxalandi!')).catch(()=>{});
  };

  console.log('✅ reg-patch.js yuklandi');
})();
