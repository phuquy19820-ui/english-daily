/* English Daily – logic chính */
'use strict';
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const todayStr = () => new Date().toLocaleDateString('sv');
const DAYS = ['CN','T2','T3','T4','T5','T6','T7'];
const ICS_DAYS = ['SU','MO','TU','WE','TH','FR','SA'];

/* ---------- hồ sơ học viên (mỗi người một bộ tiến độ riêng, lưu ngay trên máy) ---------- */
const OLD_KEY = 'english-daily-v1', REG_KEY = 'english-daily-profiles-v1', PCOL = ['#4f7cff','#e8590c','#2f9e44','#ae3ec9','#d6336c','#0c8599','#f08c00'];
let REG;
function regSave() { try { localStorage.setItem(REG_KEY, JSON.stringify(REG)); mirror(); } catch (e) {} }
function regLoad() {
  try { REG = JSON.parse(localStorage.getItem(REG_KEY)); } catch (e) { REG = null; }
  if (!REG || !Array.isArray(REG.profiles) || !REG.profiles.length) {
    const id = 'p' + Date.now().toString(36);
    REG = {active: id, profiles: [{id, name: 'Học viên 1', color: PCOL[0], created: Date.now()}]};
    try { const old = localStorage.getItem(OLD_KEY); if (old) localStorage.setItem('english-daily-p-' + id, old); } catch (e) {}  /* chuyển dữ liệu cũ sang hồ sơ đầu tiên, giữ nguyên bản gốc làm dự phòng */
    regSave();
  }
  if (!REG.profiles.some(p => p.id === REG.active)) { REG.active = REG.profiles[0].id; regSave(); }
}
regLoad();
const pkey = id => 'english-daily-p-' + id;
let KEY = pkey(REG.active);
const curProfile = () => REG.profiles.find(p => p.id === REG.active);
let S;
function load() {
  try { S = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { S = {}; }
  S.vocab ||= {}; S.custom ||= []; S.grammar ||= {}; S.writing ||= []; S.log ||= {};
  S.reminders ||= [{id:'r'+Date.now(), time:'20:00', days:[0,1,2,3,4,5,6], label:'Đến giờ học tiếng Anh rồi! 🎯', on:true}];
  S.fired ||= {}; S.settings ||= {}; S.reading ||= {}; S.listenMin ||= {};
}
let saveWarned = false;
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); mirror(); }
  catch (e) { if (!saveWarned) { saveWarned = true; toast('⚠️ Không lưu được dữ liệu (trình duyệt chặn lưu trữ).'); } }
}
load();
/* bản sao dự phòng tự động mỗi ngày (giữ bản gần nhất) + xin trình duyệt không tự xóa dữ liệu */
try {
  const bk = KEY + '-bak', t = todayStr(), cur = localStorage.getItem(KEY), prev = JSON.parse(localStorage.getItem(bk) || 'null');
  if (cur && (!prev || prev.day !== t)) localStorage.setItem(bk, JSON.stringify({day: t, data: cur}));
} catch (e) {}
try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) {}

const TASKS = [
  {id:'vocab', ic:'🃏', name:'Ôn từ vựng', min:10, href:'#vocab'},
  {id:'grammar', ic:'📘', name:'Ngữ pháp + quiz', min:10, href:'#grammar'},
  {id:'pron', ic:'🗣️', name:'Phát âm / shadowing', min:10, href:'#pron'},
  {id:'listen', ic:'🎧', name:'Nghe tài chính – kế toán', min:15, href:'#listen'},
  {id:'write', ic:'✍️', name:'Viết theo chủ đề', min:15, href:'#write'},
  {id:'ielts', ic:'🎓', name:'IELTS (tuỳ chọn)', min:15, href:'#ielts', optional:true}
];
function dayLog(d = todayStr()) { return (S.log[d] ||= {tasks:{}, newCount:0}); }
function markDone(id) {
  const l = dayLog();
  if (!l.tasks[id]) { l.tasks[id] = true; save(); toast('✅ Hoàn thành: ' + TASKS.find(t => t.id === id).name); }
}
function streak() {
  let n = 0; const d = new Date();
  const has = dt => { const l = S.log[dt.toLocaleDateString('sv')]; return l && Object.values(l.tasks).some(Boolean); };
  if (!has(d)) d.setDate(d.getDate() - 1);
  while (has(d)) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

/* ---------- toast ---------- */
let toastT;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 3500);
}

/* ---------- giọng đọc & nhận dạng ---------- */
let voices = [];
function loadVoices() { voices = window.speechSynthesis ? speechSynthesis.getVoices() : []; }
if (window.speechSynthesis) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }
const SPEEDS = [0.6, 0.7, 0.8, 0.9, 1];
const speedF = () => (S.settings.speed > 0 ? S.settings.speed : 0.8);
function updateSpeedBtn() { const b = document.getElementById('speed'); if (b) b.innerHTML = '🐢 <b>' + speedF().toFixed(1) + '×</b>'; }
const accent = () => (S.settings.accent === 'GB' ? 'GB' : 'US');
const accVoices = a => voices.filter(v => (a === 'GB' ? /en[-_]GB/i : /en[-_]US/i).test(v.lang));
function usVoices() { return accVoices('US'); }
function pickVoice(a = accent()) {
  const list = accVoices(a), saved = a === 'GB' ? S.settings.voiceGB : (S.settings.voiceUS || S.settings.voice);
  if (saved) { const v = voices.find(v => v.name === saved); if (v) return v; }
  const pref = a === 'GB' ? ['Daniel','Kate','Serena','Google UK English','Sonia','Hazel','George','Ryan','Libby','Oliver'] : ['Samantha','Google US English','Aria','Jenny','Ava','Allison','Zira','Guy','Alex'];
  for (const p of pref) { const v = list.find(v => v.name.includes(p)); if (v) return v; }
  return list[0] || null;
}
let warnedGB = false;
function ttsSay(text, rate = 1, pitch = 1, onend, acc) {
  if (!window.speechSynthesis) return toast('Trình duyệt không hỗ trợ đọc giọng nói.');
  acc = acc === 'GB' || acc === 'US' ? acc : accent();
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = acc === 'GB' ? 'en-GB' : 'en-US'; u.rate = Math.max(0.4, Math.min(1.5, rate * speedF())); u.pitch = pitch;
  const v = pickVoice(acc); if (v) u.voice = v;
  else if (acc === 'GB' && voices.length && !warnedGB) { warnedGB = true; toast('Máy chưa có giọng Anh-Anh (en-GB). Hãy cài thêm giọng “English (United Kingdom)” trong cài đặt hệ thống.'); }
  if (onend) u.onend = onend;
  speechSynthesis.speak(u);
}
const sayBtns = t => `<button class="acc" title="Giọng Mỹ" onclick="A.sayA(this.dataset.t,'US')" data-t="${esc(t)}">🔊 US</button><button class="acc" title="Giọng Anh" onclick="A.sayA(this.dataset.t,'GB')" data-t="${esc(t)}">🔊 UK</button>`;
function updateAccentBtn() { const b = document.getElementById('accent'); if (b) b.innerHTML = accent() === 'GB' ? '🔊 <b>UK</b> · US' : '🔊 US · <b>UK</b>'.replace('US · <b>UK</b>', '<b>US</b> · UK'); }
/* ---- giọng người thật cho TỪ ĐƠN: bản ghi âm Wiktionary/Wikimedia Commons (Mỹ ~73%, Anh ~13% từ vựng) ---- */
const HUMAN_KEY = 'english-daily-human-v1';
let humanCache = {}; try { humanCache = JSON.parse(localStorage.getItem(HUMAN_KEY)) || {}; } catch (e) { humanCache = {}; }
const humanOn = () => S.settings.human !== false;
let humanAudio = null, humanWarned = 0;
async function humanUrl(word, acc) {
  const key = acc + ':' + word; if (key in humanCache) return humanCache[key];
  try {
    const title = 'File:En-' + (acc === 'GB' ? 'uk' : 'us') + '-' + word + '.ogg';
    const r = await fetch('https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&prop=imageinfo&iiprop=url&titles=' + encodeURIComponent(title));
    const d = await r.json(), p = Object.values(d.query.pages)[0];
    const url = p && p.imageinfo && p.imageinfo[0] ? p.imageinfo[0].url.split('?')[0] : null;
    humanCache[key] = url; try { localStorage.setItem(HUMAN_KEY, JSON.stringify(humanCache)); } catch (e) {}
    return url;
  } catch (e) { return undefined; }
}
const humanMp3 = u => u.replace('/commons/', '/commons/transcoded/') + '/' + u.split('/').pop() + '.mp3';
function humanPlay(urls, done) {
  if (humanAudio) { try { humanAudio.pause(); } catch (e) {} }
  const tryNext = i => { if (i >= urls.length) return done(false); const a = new Audio(urls[i]); humanAudio = a; a.playbackRate = Math.min(1, speedF() / 0.9); let failed = false; const fail = () => { if (!failed) { failed = true; tryNext(i + 1); } }; a.onerror = fail; a.play().then(() => done(true)).catch(fail); };
  tryNext(0);
}
function say(text, rate = 1, pitch = 1, onend, acc) {
  acc = acc === 'GB' || acc === 'US' ? acc : accent();
  const t = String(text || '').trim();
  if (humanOn() && !onend && /^[A-Za-z]{2,}$/.test(t)) {
    if (window.speechSynthesis) speechSynthesis.cancel();
    humanUrl(t.toLowerCase(), acc).then(u => {
      const fallback = () => { if (++humanWarned % 8 === 1) toast('Từ này chưa có bản ghi người thật' + (acc === 'GB' ? ' giọng Anh' : '') + ' → dùng giọng máy. Xem tab 🎬 Video để nghe người thật.'); ttsSay(text, rate, pitch, onend, acc); };
      if (!u) return fallback();
      humanPlay([humanMp3(u), u], ok => { if (!ok) fallback(); });
    });
    return;
  }
  if (humanAudio) { try { humanAudio.pause(); } catch (e) {} }
  ttsSay(text, rate, pitch, onend, acc);
}
let playToken = 0;
function sayQueue(lines) {
  const tok = ++playToken;
  const next = i => { if (tok !== playToken || i >= lines.length) return; say(lines[i][1], 0.95, lines[i][0] === 'A' ? 1 : 1.25, () => setTimeout(() => next(i + 1), 250)); };
  next(0);
}
const norm = s => s.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9' ]/g, ' ').split(/\s+/).filter(Boolean);
function micTry(target, cb) {
  const R = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!R) return toast('Trình duyệt này chưa hỗ trợ nhận dạng giọng nói. Hãy dùng Chrome/Edge/Safari.');
  const r = new R(); r.lang = accent() === 'GB' ? 'en-GB' : 'en-US'; r.maxAlternatives = 1;
  toast('🎙️ Đang nghe… hãy nói!');
  r.onresult = e => {
    const said = e.results[0][0].transcript, a = norm(target), b = norm(said);
    const hit = a.filter(w => b.includes(w)).length, pct = Math.round(hit / a.length * 100);
    cb(said, pct);
  };
  r.onerror = e => toast('Không nghe được: ' + e.error + (e.error === 'not-allowed' ? ' (hãy cho phép micro)' : ''));
  try { r.start(); } catch (e) {}
}

/* ---------- timer ---------- */
let TM = null;
function startTimer(elId, secs, onEnd) {
  stopTimer();
  let left = secs;
  const paint = () => { const el = document.getElementById(elId); if (el) el.textContent = String(Math.floor(left / 60)).padStart(2, '0') + ':' + String(left % 60).padStart(2, '0'); };
  paint();
  TM = setInterval(() => { left--; paint(); if (left <= 0) { stopTimer(); onEnd && onEnd(); } }, 1000);
}
function stopTimer() { if (TM) clearInterval(TM); TM = null; }

/* ---------- router ---------- */
const NAV = [['home','🏠','Hôm nay'],['i65','🎯','IELTS 6.5'],['path','🗺️','Lộ trình'],['think2','📚','Giáo trình Think 2'],['rmit','🏫','Thi xếp lớp (viết–nói)'],['ctest','📝','Test trắc nghiệm'],['stats','🏆','Thành tích'],['video','🎬','Video người thật'],['vocab','🃏','Từ vựng'],['topics','🗂️','Chủ đề'],['grammar','📘','Ngữ pháp'],['pron','🗣️','Phát âm'],['listen','🎧','Nghe'],['write','✍️','Viết'],['ielts','🎓','IELTS'],['remind','⏰','Nhắc nhở'],['method','🧭','Phương pháp']];
const views = {};
function route() {
  stopTimer(); rmStop(); nbCleanup(); ctStop(); exStop(); playToken++; if (window.speechSynthesis) speechSynthesis.cancel();
  const id = (location.hash.slice(1) || 'home');
  const v = views[id] || views.home;
  $('#view').innerHTML = v.render();
  v.init && v.init();
  document.querySelectorAll('nav a').forEach(a => a.classList.toggle('on', a.dataset.id === id));
  window.scrollTo(0, 0);
}
function rerender() { const y = window.scrollY; const id = (location.hash.slice(1) || 'home'); const v = views[id] || views.home; $('#view').innerHTML = v.render(); v.init && v.init(); window.scrollTo(0, y); }
window.addEventListener('hashchange', route);

/* =====================  HOME  ===================== */
views.home = {render() {
  const l = dayLog(), req = TASKS.filter(t => !t.optional), done = req.filter(t => l.tasks[t.id]).length, pct = Math.round(done / req.length * 100);
  const due = dueCards().length;
  const week = [...Array(7)].map((_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); const k = d.toLocaleDateString('sv'); const n = S.log[k] ? Object.values(S.log[k].tasks).filter(Boolean).length : 0; return {d: DAYS[d.getDay()], n}; });
  const R = 42, C = 2 * Math.PI * R;
  const hr = new Date().getHours(), hi = hr < 12 ? 'Chào buổi sáng' : hr < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';
  return `<h1>${hi}! 👋</h1>
  <div class="grid two">
   <div class="card center"><svg width="110" height="110" viewBox="0 0 100 100"><circle cx="50" cy="50" r="${R}" class="ring-bg"/><circle cx="50" cy="50" r="${R}" class="ring" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct / 100)}" transform="rotate(-90 50 50)"/><text x="50" y="56" text-anchor="middle" class="ringtxt">${pct}%</text></svg>
     <div><b>${done}/${req.length}</b> nhiệm vụ hôm nay</div><div class="muted">🔥 Chuỗi ${streak()} ngày liên tiếp</div></div>
   <div class="card"><h3>7 ngày gần nhất</h3><div class="bars">${week.map(w => `<div class="bar"><i style="height:${w.n * 14 + 4}px" class="${w.n ? 'f' : ''}"></i><span>${w.d}</span></div>`).join('')}</div>
     <p class="muted">Thẻ từ đến hạn ôn: <b>${due}</b> · Bài viết đã lưu: <b>${S.writing.length}</b></p></div>
  </div>
  <div class="card"><h3>Kế hoạch hôm nay (~${req.reduce((a, t) => a + t.min, 0)} phút)</h3>
   ${TASKS.map(t => `<div class="task ${l.tasks[t.id] ? 'done' : ''}"><label><input type="checkbox" ${l.tasks[t.id] ? 'checked' : ''} onchange="A.toggle('${t.id}')"> <span>${t.ic} ${t.name} <small>· ${t.min}′</small></span></label><a class="btn sm" href="${t.href}">Bắt đầu →</a></div>`).join('')}
  </div>
  ${ieltsHomeCard()}
  ${pathHomeCard()}
  <div id="installBanner"></div>
  <div id="notifBanner"></div>
  <div class="card"><h3>💡 Mẹo hôm nay</h3><p>${tipOfDay()}</p></div>`;
}, init() { showInstallBanner(); showNotifBanner(); }};
const TIPS = ['Nói to thành tiếng khi học từ mới: miệng nhớ giúp não nhớ.','Mỗi từ mới hãy đặt 1 câu về công việc của bạn.','Nghe lại cùng một đoạn 3 lần hiệu quả hơn nghe 3 đoạn khác nhau.','Đừng bỏ âm cuối (-s, -ed, -t): nó quyết định người nghe có hiểu bạn không.','Sai là bình thường — viết xong hãy tự sửa 3 lỗi nhỏ.','Học ít mà đều: 30 phút mỗi ngày thắng 3 giờ vào cuối tuần.','Đọc transcript sau khi nghe để “nhìn thấy” các từ bạn đã bỏ lỡ.'];
const tipOfDay = () => TIPS[new Date().getDate() % TIPS.length];
let deferredInstall = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredInstall = e; showInstallBanner(); });
window.addEventListener('appinstalled', () => { deferredInstall = null; toast('✅ Đã cài app!'); showInstallBanner(); });
function pathHomeCard() {
  const p = (S.path ||= {done: {}, xp: 0, start: 'A1', mistakes: [], daily: {}}), n = (typeof nextUnit === 'function') ? nextUnit() : null;
  return `<div class="card"><h3>🗺️ Lộ trình CEFR</h3><p class="muted">⭐ ${p.xp || 0} XP · ${n ? 'Bài tiếp theo: <b>' + n.lv + ' – ' + esc(n.title) + '</b>' : 'Bạn đã hoàn thành lộ trình!'}</p><a class="btn sm" href="#path">${n ? 'Học tiếp →' : 'Xem lộ trình'}</a> ${p.placed ? '' : '<a class="btn sm ghost" href="#path" onclick="A.pplace()">🎯 Kiểm tra xếp lớp</a>'}</div>`;
}
function showInstallBanner() {
  const el = $('#installBanner'); if (!el) return;
  if (matchMedia('(display-mode: standalone)').matches || navigator.standalone) { el.innerHTML = ''; return; }
  const ua = navigator.userAgent, ios = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  el.innerHTML = `<div class="card warn"><b>📲 Cài thành app trên thiết bị này</b><br>` + (deferredInstall
    ? `<button class="btn sm" onclick="A.install()">Cài app ngay</button>`
    : ios ? 'Trong Safari: bấm nút <b>Chia sẻ</b> (ô vuông có mũi tên) → <b>Thêm vào Màn hình chính</b>.'
    : /Android/.test(ua) ? 'Trong Chrome: menu <b>⋮</b> → <b>Cài đặt ứng dụng</b> (hoặc <b>Thêm vào màn hình chính</b>).'
    : 'Trong Chrome/Edge: bấm biểu tượng <b>cài đặt ⊕</b> ở cuối thanh địa chỉ, hoặc menu <b>⋮ → Truyền, lưu và chia sẻ → Cài đặt trang dưới dạng ứng dụng</b>.') + `</div>`;
}
function showNotifBanner() {
  const el = $('#notifBanner'); if (!el) return;
  if ('Notification' in window && Notification.permission === 'default') el.innerHTML = `<div class="card warn">🔔 Bật thông báo để nhận nhắc học hằng ngày. <button class="btn sm" onclick="A.askNotif()">Bật thông báo</button></div>`;
}

/* =====================  VOCAB (Leitner)  ===================== */
const BOX_DAYS = [0, 1, 2, 4, 8, 16, 32, 64];
const allWords = () => (S.settings.ielts !== false ? DATA.vocab.filter(v => v.cat !== 'fin') : DATA.vocab).concat(S.custom);
function addDays(n) { const d = new Date(); d.setDate(d.getDate() + n); return d.toLocaleDateString('sv'); }
function dueCards() { const t = todayStr(); return allWords().filter(w => S.vocab[w.id] && S.vocab[w.id].due <= t); }
function newCards() { const left = Math.max(0, 10 - dayLog().newCount); return allWords().filter(w => !S.vocab[w.id]).slice(0, left); }
let V = {mode: 'study', queue: null, i: 0, flip: false, reviewed: 0};
views.vocab = {render() {
  const tabs = `<div class="tabs"><button class="${V.mode === 'study' ? 'on' : ''}" onclick="A.vmode('study')">Ôn tập</button><button class="${V.mode === 'list' ? 'on' : ''}" onclick="A.vmode('list')">Danh sách</button><button class="${V.mode === 'add' ? 'on' : ''}" onclick="A.vmode('add')">+ Thêm từ</button></div>`;
  if (V.mode === 'list') {
    return `<h1>🃏 Từ vựng</h1>${tabs}<div class="card"><table class="tbl"><tr><th>Từ</th><th>Nghĩa</th><th>Hộp</th></tr>${allWords().map(w => `<tr><td><b>${esc(w.w)}</b><br><small class="muted">${esc(w.ipa || '')}</small> ${sayBtns(w.w)}</td><td>${esc(w.vi)}</td><td>${S.vocab[w.id] ? S.vocab[w.id].box : '—'}</td></tr>`).join('')}</table></div>`;
  }
  if (V.mode === 'add') {
    return `<h1>🃏 Từ vựng</h1>${tabs}<div class="card"><h3>Thêm từ của riêng bạn</h3>
      <label>Từ / cụm từ<input id="nw"></label><label>Phiên âm (tuỳ chọn)<input id="ni" placeholder="/ˈæset/"></label><label>Nghĩa tiếng Việt<input id="nv"></label><label>Câu ví dụ<input id="ne"></label>
      <button class="btn" onclick="A.addWord()">Thêm</button></div>`;
  }
  if (!V.queue) {
    const due = dueCards(), nw = newCards();
    return `<h1>🃏 Từ vựng</h1>${tabs}<div class="card center"><h3>Hôm nay</h3><p><b>${due.length}</b> thẻ cần ôn · <b>${nw.length}</b> thẻ mới (tối đa 10/ngày)</p>
      <button class="btn" onclick="A.vstart()" ${due.length + nw.length ? '' : 'disabled'}>${due.length + nw.length ? 'Bắt đầu phiên ôn' : 'Đã xong hôm nay 🎉'}</button>
      <p class="muted">Chọn “Nhớ” khi nhớ ngay; “Khó” khi nhớ chậm; “Quên” để ôn lại sớm. Thẻ càng nhớ chắc, khoảng cách ôn càng dài (1→2→4→8→16 ngày…).</p></div>`;
  }
  if (V.i >= V.queue.length) {
    return `<h1>🃏 Từ vựng</h1>${tabs}<div class="card center"><h2>🎉 Xong phiên ôn!</h2><p>Bạn đã ôn ${V.reviewed} lượt.</p><button class="btn" onclick="A.vreset()">Quay lại</button></div>`;
  }
  const w = V.queue[V.i], k = S.vocab[w.id];
  return `<h1>🃏 Từ vựng</h1>${tabs}<p class="muted">Thẻ ${V.i + 1}/${V.queue.length} · ${k ? 'Hộp ' + k.box : 'Thẻ mới'}</p>
   <div class="card flash"><div class="word">${esc(w.w)}</div><div class="ipa">${esc(w.ipa || '')} ${sayBtns(w.w)}</div>
   ${V.flip ? `<hr><div class="vi">${esc(w.vi)}</div>${w.ex ? `<div class="ex">“${esc(w.ex)}” <button class="ico" onclick="A.say(this.dataset.t)" data-t="${esc(w.ex)}">🔊</button></div>` : ''}
     ${hsWordBlock(w.w)}<div class="row"><button class="btn bad" onclick="A.grade(0)">Quên</button><button class="btn warn" onclick="A.grade(1)">Khó</button><button class="btn good" onclick="A.grade(2)">Nhớ</button></div>`
   : `<p class="muted">Hãy tự nhớ nghĩa và đọc to từ này, rồi lật thẻ.</p><button class="btn" onclick="A.vflip()">Lật thẻ</button>`}</div>`;
}};

/* =====================  GRAMMAR  ===================== */
let G = {open: null, ans: {}};
views.grammar = {render() {
  if (GM !== 'lessons' && !G.open) return GM === 'tenses' ? tenseView() : posView();
  if (!G.open) {
    return `<h1>📘 Ngữ pháp</h1>${gmTabs()}<p class="muted">Đọc ngắn → làm quiz ngay. Chọn 1 bài mỗi ngày.</p><div class="grid two">${DATA.grammar.map(g => { const sc = S.grammar[g.id]; return `<a class="card link" href="#grammar" onclick="A.gopen('${g.id}')"><h3>${g.title}</h3><small class="muted">Trình độ ${g.level}</small><div>${sc != null ? `Điểm gần nhất: <b>${sc}/${g.quiz.length}</b>` : 'Chưa làm'}</div></a>`; }).join('')}</div>`;
  }
  const g = DATA.grammar.find(x => x.id === G.open), answered = Object.keys(G.ans).length, total = g.quiz.length;
  const score = g.quiz.filter((q, i) => G.ans[i] === q.a).length;
  return `<button class="btn ghost" onclick="A.gclose()">← Danh sách</button><h1>${g.title}</h1><div class="card lesson">${g.body}</div>
   <h2>Bài tập</h2>${g.quiz.map((q, i) => `<div class="card q"><p><b>${i + 1}.</b> ${esc(q.q)}</p><div class="opts">${q.o.map((o, j) => { let c = ''; if (G.ans[i] != null) { if (j === q.a) c = 'ok'; else if (j === G.ans[i]) c = 'no'; } return `<button class="opt ${c}" ${G.ans[i] != null ? 'disabled' : ''} onclick="A.gans(${i},${j})">${esc(o)}</button>`; }).join('')}</div>${G.ans[i] != null ? `<p class="expl">${G.ans[i] === q.a ? '✅ Đúng!' : '❌ Chưa đúng.'} ${esc(q.e)}</p>` : ''}</div>`).join('')}
   ${answered === total ? `<div class="card center"><h3>Kết quả: ${score}/${total}</h3><button class="btn" onclick="A.gretry()">Làm lại</button> <button class="btn ghost" onclick="A.gclose()">Bài khác</button></div>` : ''}`;
}};

/* =====================  PRONUNCIATION  ===================== */
const ACCENT_WORDS = [['Thang máy','lift','elevator'],['Căn hộ','flat','apartment'],['Bánh quy','biscuit','cookie'],['Kỳ nghỉ','holiday','vacation'],['Xe tải','lorry','truck'],['Xăng','petrol','gas'],['Cốp xe','boot','trunk'],['Xếp hàng','queue','line'],['Điện thoại di động','mobile phone','cell phone'],['Bóng đá','football','soccer'],['Rác','rubbish','trash'],['Khoai tây chiên (lát mỏng)','crisps','chips'],['Nhà vệ sinh','toilet','restroom'],['Tầng trệt','ground floor','first floor'],['Ống nghe/ hóa đơn (nhà hàng)','bill','check'],['Quần lót/ quần dài','trousers','pants']];
const ACCENT_SOUNDS = [['water','/ˈwɔːtə/','/ˈwɑːɾɚ/'],['bath','/bɑːθ/','/bæθ/'],['hot','/hɒt/','/hɑːt/'],['car','/kɑː/','/kɑːr/'],['schedule','/ˈʃedjuːl/','/ˈskedʒuːl/'],['tomato','/təˈmɑːtəʊ/','/təˈmeɪɾoʊ/'],['can’t','/kɑːnt/','/kænt/'],['better','/ˈbetə/','/ˈbeɾɚ/'],['advertisement','/ədˈvɜːtɪsmənt/','/ˌædvɚˈtaɪzmənt/'],['garage','/ˈɡærɑːʒ/','/ɡəˈrɑːʒ/']];
let P = {tab: 'sounds', tries: 0};
function vcardHTML(v) { return `<div class="vcard"><div class="vthumb" id="v_${v[0]}" style="background-image:url(https://i.ytimg.com/vi/${v[0]}/hqdefault.jpg)" onclick="A.vplay('${v[0]}')"><span>▶</span></div><b>${esc(v[1])}</b><small class="muted">${esc(v[2])}${v[3] ? ' · ' + esc(v[3]) : ''}${v[4] ? ' · ' + esc(v[4]) : ''}</small></div>`; }
views.pron = {render() {
  const tabs = ['sounds:Âm khó','vowels:Nguyên âm NGẮN – DÀI','pairs:Cặp âm','shadow:Shadowing (người thật)','rules:Quy tắc Anh-Mỹ','accent:So sánh Anh – Mỹ'].map(t => { const [k, n] = t.split(':'); return `<button class="${P.tab === k ? 'on' : ''}" onclick="A.ptab('${k}')">${n}</button>`; }).join('');
  let body = '';
  const sp = (w, cls = '') => `<button class="chip ${cls}" onclick="A.say(this.dataset.t)" data-t="${esc(w)}">🔊 ${esc(w)}</button>`;
  const ci = w => `<button class="chip ci" onclick="A.say(this.dataset.t)" data-t="${esc(w)}"><span>🔊 ${esc(w)}</span><i>${esc(_ipaOf(w))}</i></button>`;
  if (P.tab === 'sounds') body = DATA.sounds.map(s => { const gr = DATA.soundGroups && DATA.soundGroups[s.ipa]; return `<div class="card"><h3>${esc(s.ipa)} <small class="muted">${esc(s.name)}</small></h3><p>${esc(s.tip)}</p>${gr ? gr.map(g => `<div class="grow"><b>${esc(g[0])}</b><div class="chips">${g[1].map(w => ci(w)).join('')}</div></div>`).join('') : `<div class="chips">${s.words.map(w => ci(w)).join('')}</div>`}</div>`; }).join('');
  if (P.tab === 'vowels') { const vrow = (title, cls, arr) => `<div class="vsec ${cls}"><h2>${title}</h2><div class="vrow">${arr.map(v => `<div class="card vcol"><div class="vipa">${esc(v.ipa)}</div><small class="muted">${esc(v.vi)}</small><p class="vtip">${esc(v.tip)}</p><div class="chips" style="justify-content:center">${v.words.map(w => ci(w)).join('')}</div></div>`).join('')}</div></div>`;
    body = `<div class="card"><h3>Nguyên âm NGẮN và DÀI</h3><p><b>Ngắn:</b> phát âm nhanh, gọn (≈ 1 nhịp), cơ miệng thả lỏng. <b>Dài:</b> giữ âm lâu hơn (≈ 2 nhịp), cơ miệng căng hơn. Nhầm hai nhóm này làm đổi nghĩa: <i>ship</i> (tàu) ≠ <i>sheep</i> (cừu). Phiên âm hiện ngay dưới mỗi chữ; ký hiệu <b>ː</b> = kéo dài.</p></div>
    ${vrow('🟦 Hàng 1 – Nguyên âm NGẮN (nhanh, gọn)', 'short', DATA.vowels.short)}${vrow('🟥 Hàng 2 – Nguyên âm DÀI (kéo dài, căng cơ miệng)', 'long', DATA.vowels.long)}
    <div class="card"><h3>So sánh cặp NGẮN ↔ DÀI</h3><p class="muted">Nghe từng từ, so sánh độ dài; rồi tự nói lại.</p>${DATA.vowelPairs.map(p => `<div class="pair"><span class="vtag s">${esc(p[0])}</span>${ci(p[1])} <span>↔</span> <span class="vtag l">${esc(p[2])}</span>${ci(p[3])}</div>`).join('')}</div>
    <div class="card"><h3>🎬 Xem người thật dạy</h3><div class="grid two">${DATA.vowelVideos.map(v => vcardHTML(v)).join('')}</div></div>`; }
  if (P.tab === 'pairs') body = `<p class="muted">Nghe từng từ, phân biệt sự khác nhau, rồi tự nói lại. Bấm “Thử nói” để kiểm tra bằng micro. Phiên âm dưới mỗi chữ.</p><div class="card">${DATA.pairs.map(p => `<div class="pair">${ci(p[0])} <span>vs</span> ${ci(p[1])} <button class="btn sm ghost" onclick="A.mic('${p[0]}')">🎙️ ${p[0]}</button> <button class="btn sm ghost" onclick="A.mic('${p[1]}')">🎙️ ${p[1]}</button></div>`).join('')}</div>`;
  if (P.tab === 'shadow') body = `<div class="card"><h3>Luyện shadowing với giọng người thật</h3><ol><li>Xem video lần 1: <b>chỉ nghe</b>, chưa nói.</li><li>Bật <b>phụ đề (CC)</b> và chọn <b>tốc độ 0.75×</b> (⚙ → Tốc độ phát).</li><li>Nói <b>đồng thời</b> với người trong video (chậm hơn khoảng 1 nhịp): bắt chước nhịp, trọng âm, ngữ điệu.</li><li><b>Thu âm</b> giọng bạn, nghe lại và so với người thật.</li><li>Lặp lại mỗi đoạn 3–5 lần, mỗi ngày 10–15 phút.</li></ol><div class="row"><button class="btn sm" onclick="A.rec()">🔴 Thu âm giọng tôi</button><button class="btn sm ghost" onclick="A.recstop()">⏹ Dừng</button><button class="btn sm ghost" onclick="A.pdone()">✅ Tôi đã luyện xong hôm nay</button></div><audio id="au" controls class="hide"></audio><p class="muted">Tab này không dùng giọng máy: chỉ video và bản ghi người thật.</p></div>${DATA.shadowVideos.map(g => `<h2>${g.g}</h2><div class="grid two">${g.items.map(v => vcardHTML(v)).join('')}</div>`).join('')}<h2>🎙️ Nhại theo câu ngắn (người thật – Tatoeba)</h2>${hsBlock()}`;
  if (P.tab === 'accent') body = `<p class="muted">Bấm 🇺🇸 (Mỹ) và 🇬🇧 (Anh) để nghe khác biệt. Giọng mặc định đổi ở nút <b>US · UK</b> góc trên bên phải.</p>
    <div class="card"><h3>Cùng nghĩa – khác từ</h3><table class="tbl"><tr><th>Nghĩa</th><th>Anh (UK)</th><th>Mỹ (US)</th></tr>${ACCENT_WORDS.map(w => `<tr><td>${esc(w[0])}</td><td>${esc(w[1])} <button class="acc" onclick="A.sayA(this.dataset.t,'GB')" data-t="${esc(w[1])}">🔊 UK</button></td><td>${esc(w[2])} <button class="acc" onclick="A.sayA(this.dataset.t,'US')" data-t="${esc(w[2])}">🔊 US</button></td></tr>`).join('')}</table></div>
    <div class="card"><h3>Cùng từ – khác cách đọc</h3><table class="tbl"><tr><th>Từ</th><th>Anh</th><th>Mỹ</th><th>Nghe</th></tr>${ACCENT_SOUNDS.map(w => `<tr><td><b>${esc(w[0])}</b></td><td>${esc(w[1])}</td><td>${esc(w[2])}</td><td>${sayBtns(w[0])}</td></tr>`).join('')}</table></div>
    <div class="card"><h3>Khác biệt chính</h3><ul><li><b>Âm r cuối từ:</b> Anh thường bỏ (car → /kɑː/), Mỹ đọc rõ (car → /kɑːr/).</li><li><b>T giữa hai nguyên âm:</b> Mỹ đọc như d nhẹ (water → “wadder”), Anh giữ /t/ rõ.</li><li><b>Nguyên âm a:</b> bath, dance, can’t – Anh /ɑː/, Mỹ /æ/.</li><li><b>Nguyên âm o:</b> hot, stop – Anh /ɒ/ (tròn môi), Mỹ /ɑː/.</li><li><b>Chính tả:</b> colour/color, centre/center, realise/realize, favourite/favorite, travelling/traveling.</li></ul></div>`;
  if (P.tab === 'rules') body = DATA.rules.map(r => `<div class="card"><h3>${esc(r[0])}</h3><p>${esc(r[1])}</p></div>`).join('');
  return `<h1>🗣️ Phát âm Anh-Mỹ</h1><div class="tabs">${tabs}</div><div class="card">🎬 Nghe <b>người thật</b> nói: <a href="#video">xem video Rachel’s English (Mỹ), English with Lucy (Anh)…</a>. Các nút 🔊 từ đơn sẽ phát <b>bản ghi người thật</b> nếu có.</div>${voices.length && !usVoices().length ? '<div class="card warn">Thiết bị chưa có giọng en-US; hãy cài giọng “English (United States)” trong cài đặt hệ thống, hoặc chọn giọng ở tab Nhắc nhở → Cài đặt.</div>' : ''}${body}`;
}};

/* =====================  LISTENING  ===================== */
let L = {i: 0, checked: false, done: 0, rate: 1};
views.listen = {render() {
  const d = dictArr()[L.i];
  const dict = `<div class="card"><h3>✏️ Chép chính tả (giọng máy – dự phòng) – câu ${L.i + 1}/${dictArr().length}</h3>
   <p class="muted">Nghe (giọng Mỹ), gõ lại từng từ. Nghe lại tối đa bao nhiêu lần tùy bạn.</p>
   <div class="row"><button class="btn sm" onclick="A.say(dictArr()[${L.i}],1)">▶ Bình thường</button><button class="btn sm ghost" onclick="A.say(dictArr()[${L.i}],0.7)">🐢 Chậm</button></div>
   <textarea id="dic" rows="3" placeholder="Gõ những gì bạn nghe được…" ${L.checked ? 'disabled' : ''}></textarea>
   <div class="row">${L.checked ? '' : '<button class="btn" onclick="A.dcheck()">Kiểm tra</button>'}<button class="btn ghost" onclick="A.dnext()">Câu tiếp →</button></div><div id="dres" class="res"></div></div>`;
  const cnt = todayStr(), mins = S.listenMin[cnt] || 0;
  const log = `<div class="card"><h3>⏱️ Nhật ký nghe hôm nay: <b>${mins}</b> phút</h3><div class="row"><button class="btn sm ghost" onclick="A.lmin(5)">+5′</button><button class="btn sm ghost" onclick="A.lmin(10)">+10′</button><button class="btn sm ghost" onclick="A.lmin(15)">+15′</button></div><p class="muted">Ghi số phút bạn đã nghe ở các nền tảng bên dưới. ≥10 phút sẽ tự đánh dấu hoàn thành nhiệm vụ Nghe.</p></div>`;
  return `<h1>🎧 Luyện nghe</h1>
  <div class="card warn">🎙️ Trong tab này: <b>câu có người thật đọc</b> (tình nguyện viên Tatoeba) và <b>video người bản ngữ</b>. Mục “Chép chính tả (giọng máy)” ở cuối chỉ là bài dự phòng.</div>${hsBlock()}${videoShelf()}
  <div class="card"><h3>Cách nghe 3 lượt</h3><ol><li><b>Lượt 1 – ý chính:</b> nghe không xem chữ, ghi 3 từ khóa.</li><li><b>Lượt 2 – chi tiết:</b> vừa nghe vừa đọc transcript/phụ đề, gạch từ mới → thêm vào “Từ vựng”.</li><li><b>Lượt 3 – shadowing:</b> nghe lại và nhại theo từng câu.</li></ol></div>
  ${log}${dict}
  ${DATA.listenGroups.filter(g => !(ieltsMode() && /Tài chính/.test(g.g))).map(g => `<h2>${g.g}</h2><div class="grid two">${g.items.map(it => `<a class="card link ext" href="${it[2]}" target="_blank" rel="noopener"><h3>${esc(it[0])} ↗</h3><p class="muted">${esc(it[1])}</p></a>`).join('')}</div>`).join('')}
  <div class="card warn">Trang báo <b>“refused to connect / không thể truy cập”</b>? Đó là do mạng hoặc nhà mạng chặn (thường gặp với BBC, VOA, Investopedia), không phải link hỏng. Hãy dùng nhóm <b>🛟 Link dự phòng qua YouTube</b> ở trên, hoặc đổi DNS máy sang 1.1.1.1 / 8.8.8.8, hoặc dùng mạng 4G.</div><p class="muted">Các liên kết là nền tảng bên ngoài; nội dung/quy định có thể thay đổi theo thời gian.</p>`;
}};

/* =====================  WRITING  ===================== */
let W = {open: null, cat: 'Tất cả', view: null};
const wcount = t => (t.trim().match(/\S+/g) || []).length;
views.write = {render() {
  if (WM === 'exam' && W.view == null) return exView();
  if (!W.open && W.view == null && WM !== 'topics') return nbView();
  if (W.view != null) {
    const e = S.writing[W.view]; if (!e) { W.view = null; return views.write.render(); }
    return `<button class="btn ghost" onclick="A.wback()">← Quay lại</button><h1>${esc(e.title)}</h1><p class="muted">${e.date} · ${e.words} từ</p><div class="card pre">${esc(e.text)}</div>`;
  }
  if (W.open) {
    const t = DATA.writing.find(x => x.id === W.open) || W.ielts;
    return `<button class="btn ghost" onclick="A.wback()">← Danh sách</button><h1>${esc(t.title)}</h1>
    <div class="card"><b>Đề bài:</b> ${esc(t.prompt)}<br><small class="muted">Tối thiểu ${t.min} từ</small></div>
    <div class="grid two"><div class="card"><h3>📐 Dàn ý</h3><ol>${t.outline.map(o => `<li>${esc(o)}</li>`).join('')}</ol></div><div class="card"><h3>💬 Cụm từ hữu ích</h3><ul>${t.phrases.map(o => `<li>${esc(o)}</li>`).join('')}</ul></div></div>
    <div class="card"><textarea id="wt" rows="12" placeholder="Viết bài của bạn ở đây (tiếng Anh)…" oninput="A.wcount(${t.min})"></textarea>
    <div class="row"><span id="wc" class="muted">0 / ${t.min} từ</span><button class="btn" onclick="A.gstart('gbox','wt',\'${t.cat === 'Email công việc' ? 'email' : (t.task ? 'ielts' + t.task : 'essay')}\',${t.min})">📝 Chấm điểm & sửa lỗi</button><button class="btn" onclick="A.wsave()">💾 Lưu bài</button><button class="btn ghost" onclick="A.wcopy()">Sao chép</button></div></div><div id="gbox"></div>
    <div class="card"><h3>✅ Checklist tự sửa</h3>${DATA.writeChecklist.map(c => `<label class="chk"><input type="checkbox"> ${esc(c)}</label>`).join('')}</div>`;
  }
  const cats = ['Tất cả', ...new Set(writingList().map(w => w.cat))];
  const hist = S.writing.length ? `<h2>📚 Bài đã viết</h2><div class="card">${S.writing.map((e, i) => `<div class="task"><span><b>${esc(e.title)}</b><br><small class="muted">${e.date} · ${e.words} từ</small></span><span><button class="btn sm ghost" onclick="A.wview(${i})">Xem</button> <button class="btn sm ghost" onclick="A.wdel(${i})">Xóa</button></span></div>`).join('')}</div>` : '';
  return `<h1>✍️ Viết</h1>${wtabs()}<p class="muted">Mỗi chủ đề có đề, dàn ý và cụm từ mẫu. Viết → tự kiểm tra → lưu.</p>
  <div class="tabs wrap">${cats.map(c => `<button class="${W.cat === c ? 'on' : ''}" onclick="A.wcat(this.dataset.c)" data-c="${esc(c)}">${esc(c)}</button>`).join('')}</div>
  <div class="grid two">${writingList().filter(w => W.cat === 'Tất cả' || w.cat === W.cat).map(w => `<a class="card link" href="#write" onclick="A.wopen('${w.id}')"><small class="muted">${esc(w.cat)}</small><h3>${esc(w.title)}</h3><small>≥ ${w.min} từ</small></a>`).join('')}</div>${hist}`;
}};

/* =====================  LUYỆN THI VIẾT 30 PHÚT (đề + video + đồng hồ + chấm + bài mẫu)  ===================== */
const EX = {open: null, cat: 'Tất cả'};
let EXT = null;
function exStop() { if (EXT) clearInterval(EXT); EXT = null; if (window.speechSynthesis) speechSynthesis.cancel(); }
function exView() {
  const list = DATA.exam30 || [];
  if (EX.open) {
    const t = list.find(x => x.id === EX.open); if (!t) { EX.open = null; return exView(); }
    const f = nbFind(t.vid), v = f && f.v;
    return `<button class="btn ghost" onclick="A.exback()">← Danh sách đề</button><h1>⏱️ ${esc(t.title)}</h1><p class="muted">${esc(t.vi)} · ${esc(t.cat)}</p>
    <div class="card"><b>Đề bài:</b> ${esc(t.prompt)}<br><small class="muted">Mục tiêu ≥ ${t.min} từ trong 30 phút</small></div>
    ${v ? `<div class="card"><h3>🎬 Bước 1 – Xem & nghe người thật (lấy ý tưởng)</h3>${vcardHTML(v)}<p class="muted">Bấm ▶ để xem. Bật <b>CC</b> (phụ đề tiếng Anh) để vừa nghe vừa đọc lời, ghi từ khóa. Video cùng chủ đề để gợi ý ý tưởng, không phải đáp án.</p></div>` : ''}
    <div class="card"><h3>✍️ Bước 2 – Viết trong 30 phút</h3>
    <div class="row"><b id="ext" style="font-size:1.6rem">30:00</b><button class="btn" onclick="A.exstart()">▶️ Bắt đầu tính giờ</button><button class="btn sm ghost" onclick="A.exstop()">⏹️ Dừng giờ</button></div>
    <textarea id="wt" rows="14" placeholder="Viết bài của bạn ở đây (tiếng Anh)…" oninput="A.wcount(${t.min})"></textarea>
    <div class="row"><span id="wc" class="muted">0 / ${t.min} từ</span><button class="btn" onclick="A.gstart('gbox','wt','essay',${t.min})">📝 Chấm điểm & sửa lỗi</button><button class="btn" onclick="A.exsave()">💾 Lưu bài</button></div><div id="gbox"></div></div>
    <div class="grid two"><div class="card"><h3>📐 Dàn ý gợi ý</h3><ol>${t.outline.map(o => `<li>${esc(o)}</li>`).join('')}</ol></div><div class="card"><h3>💬 Cụm từ hữu ích</h3><ul>${t.phrases.map(o => `<li>${esc(o)}</li>`).join('')}</ul></div></div>
    <div class="card"><h3>📖 Bước 3 – Bài mẫu & nghe đọc</h3><p class="muted">Hãy viết xong rồi mới xem bài mẫu. Giọng đọc bài mẫu là giọng máy (Mỹ/Anh); nghe giọng người thật ở video phía trên.</p>
    <div class="row"><button class="btn sm" onclick="A.exlisten('US')">🔊 Nghe giọng Mỹ</button><button class="btn sm ghost" onclick="A.exlisten('GB')">🔊 Nghe giọng Anh</button><button class="btn sm ghost" onclick="A.tstop()">⏹️ Dừng</button></div>
    <details><summary><b>Xem bài mẫu (${wcount(t.model)} từ)</b></summary>${t.model.split(/\n+/).map(p => `<p>${esc(p)}</p>`).join('')}</details></div>`;
  }
  const cats = ['Tất cả', ...new Set(list.map(x => x.cat))];
  return `<h1>✍️ Viết</h1>${wtabs()}<p class="muted">${list.length} đề luyện thi viết 30 phút. Mỗi đề có <b>video người thật</b> cùng chủ đề, đồng hồ 30 phút, chấm điểm và bài mẫu để nghe đọc.</p>
  <div class="tabs wrap">${cats.map(c => `<button class="${EX.cat === c ? 'on' : ''}" onclick="A.excat(this.dataset.c)" data-c="${esc(c)}">${esc(c)}</button>`).join('')}</div>
  <div class="grid two">${list.filter(x => EX.cat === 'Tất cả' || x.cat === EX.cat).map(x => `<a class="card link" href="#write" onclick="A.exopen('${x.id}')"><small class="muted">${esc(x.cat)}</small><h3>${esc(x.title)}</h3><small>${esc(x.vi)}</small><br><small class="muted">🎬 có video · ≥ ${x.min} từ · 30 phút</small></a>`).join('')}</div>`;
}
/* =====================  IELTS  ===================== */
views.write.init = () => nbInit();
let I = {tab: 'over', r: null, sub: false, ans: {}, sp: {part: 1, q: 0, cue: 0, phase: 'idle'}, rec: null};
views.ielts = {render() {
  const tabs = ['over:Tổng quan','reading:Reading','writing:Writing','speaking:Speaking','res:Tài nguyên'].map(t => { const [k, n] = t.split(':'); return `<button class="${I.tab === k ? 'on' : ''}" onclick="A.itab('${k}')">${n}</button>`; }).join('');
  let body = '';
  if (I.tab === 'over') body = `<div class="card"><h3>Cấu trúc IELTS (Academic)</h3><table class="tbl"><tr><th>Kỹ năng</th><th>Thời gian</th><th>Nội dung</th></tr><tr><td>Listening</td><td>30′</td><td>4 phần, 40 câu (nghe 1 lần)</td></tr><tr><td>Reading</td><td>60′</td><td>3 bài, 40 câu</td></tr><tr><td>Writing</td><td>60′</td><td>Task 1 (150 từ, 20′) + Task 2 (250 từ, 40′)</td></tr><tr><td>Speaking</td><td>11–14′</td><td>3 phần, phỏng vấn trực tiếp</td></tr></table></div>
   <div class="card"><h3>Tiêu chí chấm Writing/Speaking</h3><ul>${DATA.bands.map(b => `<li><b>${b[0]}:</b> ${b[1]}</li>`).join('')}</ul></div>
   <div class="card"><h3>Lộ trình gợi ý mỗi tuần</h3><p>T2: Reading · T3: Writing Task 1 · T4: Listening (tab Nghe) · T5: Writing Task 2 · T6: Speaking · T7: làm lại phần yếu · CN: nghỉ nhẹ / ôn từ.</p></div>`;
  if (I.tab === 'reading') {
    if (!I.r) body = `<div class="grid two">${DATA.ieltsReading.map(r => `<a class="card link" href="#ielts" onclick="A.ropen('${r.id}')"><h3>${esc(r.title)}</h3><small>${r.qs.length} câu · ${r.mins} phút</small><div>${S.reading[r.id] != null ? 'Điểm gần nhất: <b>' + S.reading[r.id] + '</b>' : ''}</div></a>`).join('')}</div>`;
    else { const r = DATA.ieltsReading.find(x => x.id === I.r); const sc = r.qs.filter((q, i) => I.ans[i] === q.a).length;
      body = `<button class="btn ghost" onclick="A.rclose()">← Danh sách</button><h2>${esc(r.title)}</h2><div class="row"><b>⏱️ <span id="tm">${String(r.mins).padStart(2, '0')}:00</span></b><button class="btn sm" onclick="A.rtimer(${r.mins})">Bắt đầu bấm giờ</button></div>
      <div class="card passage">${esc(r.text)}</div>
      ${r.qs.map((q, i) => { const opts = q.t === 'tfng' ? ['TRUE', 'FALSE', 'NOT GIVEN'] : q.o; return `<div class="card q"><p><b>${i + 1}.</b> ${esc(q.q)}</p><div class="opts">${opts.map((o, j) => { let c = ''; if (I.sub) { if (j === q.a) c = 'ok'; else if (I.ans[i] === j) c = 'no'; } else if (I.ans[i] === j) c = 'sel'; return `<button class="opt ${c}" ${I.sub ? 'disabled' : ''} onclick="A.rans(${i},${j})">${esc(o)}</button>`; }).join('')}</div>${I.sub ? `<p class="expl">${esc(q.e)}</p>` : ''}</div>`; }).join('')}
      ${I.sub ? `<div class="card center"><h3>Kết quả: ${sc}/${r.qs.length}</h3><button class="btn" onclick="A.ropen('${r.id}')">Làm lại</button></div>` : `<button class="btn" onclick="A.rsubmit()">Nộp bài</button>`}
      <p class="muted">Mẹo T/F/NG: FALSE = văn bản nói ngược lại; NOT GIVEN = không có thông tin để kết luận.</p>`; }
  }
  if (I.tab === 'writing') body = `<h3>Task 1 (20 phút, ≥150 từ)</h3>${DATA.ieltsTask1.map(t => { const max = Math.max(...t.rows.map(r => Math.max(...r.slice(1)))); return `<div class="card"><b>${esc(t.title)}</b><table class="tbl"><tr><th></th>${t.cols.map(c => `<th>${c}</th>`).join('')}</tr>${t.rows.map(r => `<tr><td>${r[0]}</td>${r.slice(1).map(v => `<td><div class="mini" style="width:${Math.round(v / max * 100)}%"></div>${v}</td>`).join('')}</tr>`).join('')}</table><p class="muted">${esc(t.prompt)}</p><button class="btn sm" onclick="A.wielts('${t.id}',1)">Viết bài này</button></div>`; }).join('')}
   <div class="card"><h3>Khung Task 1</h3><ol><li>Introduction: paraphrase đề (1 câu).</li><li>Overview: 2 xu hướng/điểm nổi bật nhất (KHÔNG số liệu).</li><li>Body 1 & 2: nhóm số liệu, so sánh (increase by, rise to, peak at, account for…).</li></ol></div>
   <h3>Task 2 (40 phút, ≥250 từ)</h3><div class="card">${DATA.ieltsTask2.map((t, i) => `<div class="task"><span>${esc(t)}</span><button class="btn sm" onclick="A.wielts(${i},2)">Viết</button></div>`).join('')}</div>
   <div class="card"><h3>Khung Task 2</h3><ol><li>Mở bài: paraphrase + nêu quan điểm.</li><li>Thân bài 1: ý chính + giải thích + ví dụ.</li><li>Thân bài 2: ý chính/phản biện + giải thích + ví dụ.</li><li>Kết bài: tóm ý, nhắc lại quan điểm.</li></ol></div>`;
  if (I.tab === 'speaking') body = speakingHTML();
  if (I.tab === 'res') body = `<p class="muted">Nguồn luyện đề IELTS miễn phí và uy tín:</p><div class="grid two">${DATA.ieltsLinks.map(it => `<a class="card link ext" href="${it[2]}" target="_blank" rel="noopener"><h3>${esc(it[0])} ↗</h3><p class="muted">${esc(it[1])}</p></a>`).join('')}</div><p>Listening: xem thêm tab <a href="#listen">🎧 Nghe</a>.</p>`;
  return `<h1>🎓 Luyện thi IELTS</h1><div class="tabs wrap">${tabs}</div>${body}`;
}};
function speakingHTML() {
  const s = I.sp;
  const sel = `<div class="tabs"><button class="${s.part === 1 ? 'on' : ''}" onclick="A.spart(1)">Part 1</button><button class="${s.part === 2 ? 'on' : ''}" onclick="A.spart(2)">Part 2</button><button class="${s.part === 3 ? 'on' : ''}" onclick="A.spart(3)">Part 3</button></div>`;
  const rec = `<div class="row"><button class="btn sm" onclick="A.rec()">🔴 Thu âm</button><button class="btn sm ghost" onclick="A.recstop()">⏹ Dừng</button></div><audio id="au" controls class="hide"></audio>`;
  if (s.part === 1) { const q = DATA.speakP1[s.q % DATA.speakP1.length]; return sel + `<div class="card"><p class="big">${esc(q)}</p><p class="muted">Trả lời 2–3 câu (20–30 giây): trả lời trực tiếp + lý do + ví dụ ngắn.</p><div class="row"><button class="btn sm ghost" onclick="A.say(DATA.speakP1[${s.q % DATA.speakP1.length}])">🔊 Nghe câu hỏi</button><button class="btn sm ghost" onclick="A.snext()">Câu khác</button></div>${rec}</div>`; }
  const cue = DATA.speakP2[s.cue % DATA.speakP2.length];
  if (s.part === 2) return sel + `<div class="card"><h3>Cue card</h3><p class="big">${esc(cue.t)}</p><p>You should say:</p><ul>${cue.pts.map(p => `<li>${esc(p)}</li>`).join('')}</ul>
   <div class="row"><b>⏱️ <span id="tm">01:00</span></b> <span id="ph" class="muted">Chuẩn bị 1 phút → nói 1–2 phút</span></div><div class="row"><button class="btn sm" onclick="A.sprep()">Bắt đầu chuẩn bị</button><button class="btn sm ghost" onclick="A.snext()">Đề khác</button></div>${rec}</div>`;
  return sel + `<div class="card"><p class="muted">Chủ đề: ${esc(cue.t)}</p>${cue.p3.map(q => `<div class="task"><span>${esc(q)}</span><button class="ico" onclick="A.say(this.dataset.t)" data-t="${esc(q)}">🔊</button></div>`).join('')}<p class="muted">Part 3: trả lời 4–6 câu, phát triển ý: quan điểm → lý do → ví dụ → so sánh/dự đoán.</p><button class="btn sm ghost" onclick="A.snext()">Chủ đề khác</button>${rec}</div>`;
}


/* =====================  CHỦ ĐỀ (Tài chính · Đồ vật · Giao tiếp)  ===================== */
/* ---------- BÀI VĂN MẪU theo chủ đề ---------- */
const phrasesOld = u => `<p class="muted">Nghe → nhại lại → bấm 🎙️ để kiểm tra phát âm.</p><div class="card">${u.p.map((x, i) => `<div class="task"><span><b>${esc(x[0])}</b><br><small class="muted">${esc(x[1])}</small><div id="pr${i}" class="res"></div></span><span><button class="ico" onclick="A.say(this.dataset.t)" data-t="${esc(x[0])}">🔊</button><button class="ico" onclick="A.mic(this.dataset.t,'pr${i}')" data-t="${esc(x[0])}">🎙️</button></span></div>`).join('')}</div>`;
function essayView(u) {
  const e = DATA.essay[u.id];
  S.essay ||= {}; const st = (S.essay[u.id] ||= {draft: ''});
  const hl = p => { let h = esc(p); e.k.forEach(k => { const w = esc(k[0].replace(/…/g, '').trim()); if (!w) return; const i = h.toLowerCase().indexOf(w.toLowerCase()); if (i >= 0) h = h.slice(0, i) + '<mark>' + h.slice(i, i + w.length) + '</mark>' + h.slice(i + w.length); }); return h; };
  const paras = e.p.map((p, i) => `<div class="esp"><p>${hl(p)}</p><div class="row"><button class="ico" title="Nghe đoạn này" onclick="A.esay(${i})">🔊</button>${e.v && e.v[i] ? `<button class="acc" onclick="this.nextElementSibling.hidden=!this.nextElementSibling.hidden">Nghĩa VI</button><small class="muted" hidden>${esc(e.v[i])}</small>` : ''}</div></div>`).join('');
  const n = wcount(e.p.join(' '));
  return `<div class="card"><small class="muted">${esc(e.type)} · khoảng ${n} từ</small><h3>${esc(e.q)}</h3>${e.vi ? `<small class="muted">${esc(e.vi)}</small>` : ''}
    <div class="row"><button class="btn sm" onclick="A.eplay('${u.id}')">▶ Nghe cả bài</button><button class="btn sm ghost" onclick="A.tstop()">⏹ Dừng</button><button class="btn sm ghost" onclick="A.eprint()">🖨️ In</button></div></div>
    <div class="card essay ${T.hideEssay ? 'blur' : ''}">${paras}</div>
    <div class="card"><h3>📝 Từ vựng &amp; cụm từ đáng học trong bài</h3>${e.k.map((k, i) => `<div class="task"><span><b>${esc(k[0])}</b> <small class="muted">${esc(k[1])}</small></span><span><button class="ico" onclick="A.say(this.dataset.t)" data-t="${esc(k[0])}">🔊</button><button class="ico" title="Thêm vào thẻ ôn" onclick="A.eadd('${u.id}',${i})">＋</button></span></div>`).join('')}
    <div class="row"><button class="btn sm ghost" onclick="A.eaddall('${u.id}')">＋ Thêm tất cả vào thẻ ôn</button></div></div>
    <div class="card"><h3>📘 Ngữ pháp &amp; cấu trúc trong bài</h3>${e.g.map(g => `<p><b>${esc(g[0])}</b><br>${esc(g[1])}<br><small class="muted"><i>${esc(g[2])}</i></small></p>`).join('')}</div>
    <div class="card"><h3>✍️ Luyện viết lại</h3><p class="muted">Đọc bài mẫu, rồi che lại và tự viết bằng lời của bạn (bài tự động lưu).</p>
    <div class="row"><button class="btn sm ghost" onclick="A.ehide()">${T.hideEssay ? '👁 Hiện bài mẫu' : '🙈 Che bài mẫu'}</button><button class="btn sm ghost" onclick="A.ecopy('${u.id}')">⌨️ Nghe từng câu để chép</button></div>
    <textarea id="esdraft" rows="10" style="width:100%;margin-top:8px;font:inherit;padding:10px;border-radius:10px;border:1px solid var(--bd);background:var(--bg);color:var(--tx)" oninput="A.edraft('${u.id}',this.value)" placeholder="Viết bài của bạn ở đây…">${esc(st.draft || '')}</textarea>
    <div class="row"><small class="muted" id="escount">${wcount(st.draft || '')} từ (mục tiêu ~${n})</small><button class="btn sm" onclick="A.echeck('${u.id}')">Kiểm tra cụm từ khóa đã dùng</button></div><div id="esres"></div></div>`;
}
let T = {track: null, unit: null, tab: 'words', quiz: null, hideB: false, showVi: true};
const tkey = (u, i) => 't_' + u + '_' + i;
const isAdded = id => S.custom.some(c => c.id === id);
function unitOf(id) { for (const tr of DATA.topics) { const u = tr.units.find(x => x.id === id); if (u) return {tr, u}; } return null; }
function makeQuiz(u) {
  const pool = u.w.length >= 4 ? u.w.map(x => [x[0], x[2]]) : u.p.map(x => [x[0], x[1]]);
  const qs = pool.slice().sort(() => Math.random() - 0.5).slice(0, Math.min(6, pool.length));
  return qs.map(q => {
    const others = pool.filter(x => x[0] !== q[0]).sort(() => Math.random() - 0.5).slice(0, 3).map(x => x[0]);
    const opts = [q[0], ...others].sort(() => Math.random() - 0.5);
    return {vi: q[1], en: q[0], opts, ans: null};
  });
}
views.topics = {render() {
  if (!T.track) {
    return `<h1>🗂️ Chủ đề học</h1><p class="muted">Chín nhánh chủ đề: tài chính, đồ vật, giao tiếp, du lịch, thiết kế, mỹ thuật &amp; nghệ thuật, thời trang, thể thao, sức khỏe. Mỗi bài có từ vựng, mẫu câu, hội thoại (nghe giọng Mỹ) và quiz.</p>
    <div class="grid two">${DATA.topics.filter(t => !(ieltsMode() && t.id === 'fin')).sort((a, b) => (b.id === 'ielts') - (a.id === 'ielts')).map(t => { const done = t.units.filter(u => S.topicScore && S.topicScore[u.id] != null).length; return `<a class="card link" href="#topics" onclick="A.ttrack('${t.id}')"><h2 style="margin-top:0">${t.icon} ${esc(t.name)}</h2><p class="muted">${esc(t.desc)}</p><b>${t.units.length} bài</b> · đã làm quiz: ${done}/${t.units.length}</a>`; }).join('')}</div>`;
  }
  const tr = DATA.topics.find(x => x.id === T.track);
  if (!T.unit) {
    return `<button class="btn ghost" onclick="A.tback()">← Các chủ đề</button><h1>${tr.icon} ${esc(tr.name)}</h1><div class="grid two">${tr.units.map(u => { const sc = S.topicScore && S.topicScore[u.id]; return `<a class="card link" href="#topics" onclick="A.tunit('${u.id}')"><h3>${esc(u.title)}</h3><small class="muted">${u.w.length} từ · ${u.p.length} mẫu câu · ${u.d.length} câu hội thoại</small><div>${sc != null ? 'Quiz gần nhất: <b>' + sc + '</b>' : 'Chưa làm quiz'}</div></a>`; }).join('')}</div>`;
  }
  const u = tr.units.find(x => x.id === T.unit);
  const tabs = [['words', 'Từ vựng'], ['phrases', 'Bài văn mẫu'], ['dialog', 'Hội thoại'], ['quiz', 'Quiz']].map(t => `<button class="${T.tab === t[0] ? 'on' : ''}" onclick="A.ttab('${t[0]}')">${t[1]}</button>`).join('');
  let body = '';
  if (T.tab === 'words') {
    const allAdded = u.w.every((x, i) => isAdded(tkey(u.id, i)));
    body = `<div class="row"><button class="btn sm" onclick="A.taddall()" ${allAdded ? 'disabled' : ''}>${allAdded ? '✓ Đã thêm tất cả vào thẻ ôn' : '＋ Thêm tất cả vào thẻ ôn (Leitner)'}</button></div>
    <div class="card">${u.w.map((x, i) => `<div class="task"><span><b>${esc(x[0])}</b> <small class="muted">${esc(x[1])}</small> ${sayBtns(x[0])}${hsFor(x[0],1).length ? `<button class="acc" onclick="A.hword(this.dataset.t)" data-t="${esc(x[0])}">🎙️ câu</button>` : ''}<br>${esc(x[2])}<br><small class="muted"><i>${esc(x[3])}</i></small> <button class="ico" onclick="A.say(this.dataset.t)" data-t="${esc(x[3])}">🔊</button></span><button class="btn sm ghost" onclick="A.tadd(${i})" ${isAdded(tkey(u.id, i)) ? 'disabled' : ''}>${isAdded(tkey(u.id, i)) ? '✓' : '＋ Ôn'}</button></div>`).join('')}</div>`;
  }
  if (T.tab === 'phrases') body = (DATA.essay && DATA.essay[u.id]) ? essayView(u) : phrasesOld(u);
  if (T.tab === 'dialog') body = `<div class="row"><button class="btn sm" onclick="A.tplay()">▶ Nghe cả hội thoại</button><button class="btn sm ghost" onclick="A.tstop()">⏹ Dừng</button><label class="chk"><input type="checkbox" ${T.showVi ? 'checked' : ''} onchange="A.tvi(this.checked)"> Hiện nghĩa tiếng Việt</label><label class="chk"><input type="checkbox" ${T.hideB ? 'checked' : ''} onchange="A.thideB(this.checked)"> Đóng vai A (ẩn lời B để tự nói)</label></div>
    <div class="card">${u.d.map((x, i) => `<div class="task" style="${x[0] === 'B' ? 'flex-direction:row-reverse;text-align:right' : ''}"><span class="${x[0] === 'B' && T.hideB ? 'blur' : ''}" ${x[0] === 'B' && T.hideB ? 'onclick="this.classList.remove(\'blur\')"' : ''}><small class="muted">${x[0]}</small><br><b>${esc(x[1])}</b>${T.showVi ? `<br><small class="muted">${esc(x[2])}</small>` : ''}</span><button class="ico" onclick="A.say(this.dataset.t)" data-t="${esc(x[1])}">🔊</button></div>`).join('')}</div><p class="muted">🎙️ Giọng đọc hội thoại là giọng máy. Nghe người thật ở tab <a href="#video">🎬 Video</a>.</p><p class="muted">Cách luyện: nghe cả đoạn → đọc theo → bật “đóng vai A”, tự nói lời B rồi bấm vào chỗ mờ để đối chiếu.</p>`;
  if (T.tab === 'quiz') {
    if (!T.quiz) T.quiz = makeQuiz(u);
    const done = T.quiz.every(q => q.ans != null), score = T.quiz.filter(q => q.ans === q.en).length;
    body = `<p class="muted">Chọn từ/cụm tiếng Anh đúng với nghĩa tiếng Việt.</p>${T.quiz.map((q, i) => `<div class="card q"><p><b>${i + 1}.</b> ${esc(q.vi)}</p><div class="opts">${q.opts.map(o => { let c = ''; if (q.ans != null) { if (o === q.en) c = 'ok'; else if (o === q.ans) c = 'no'; } return `<button class="opt ${c}" ${q.ans != null ? 'disabled' : ''} onclick="A.tans(${i},this.dataset.o)" data-o="${esc(o)}">${esc(o)}</button>`; }).join('')}</div></div>`).join('')}${done ? `<div class="card center"><h3>Kết quả: ${score}/${T.quiz.length}</h3><button class="btn" onclick="A.tretry()">Làm lại</button></div>` : ''}`;
  }
  return `<button class="btn ghost" onclick="A.tback()">← ${esc(tr.name)}</button><h1>${esc(u.title)}</h1><div class="tabs">${tabs}</div>${body}`;
}};

/* =====================  LỘ TRÌNH CEFR (Path)  ===================== */
const LV = ['A1', 'A2', 'B1', 'B2', 'C1'];
const STEPS = [['vocab', '🃏', 'Từ vựng'], ['grammar', '📘', 'Ngữ pháp'], ['listen', '🎧', 'Nghe'], ['read', '📖', 'Đọc'], ['speak', '🗣️', 'Nói'], ['write', '✍️', 'Viết'], ['test', '🏁', 'Kiểm tra bài']];
const XP_STEP = {vocab: 10, grammar: 10, listen: 10, read: 10, speak: 10, write: 15, test: 30};
const DAILY_XP = 30;
function pathState() { const p = (S.path ||= {}); p.done ||= {}; p.xp ||= 0; p.start ||= 'A1'; p.mistakes ||= []; p.daily ||= {}; return p; }
let PT = {mode: 'home', unit: null, step: null, ans: {}, lists: {}, testQs: null, hideVi: false, showText: false, showModel: false, mlist: null};
const uDone = u => (pathState().done[u.id] ||= {});
const stepsDone = u => STEPS.filter(s => s[0] !== 'test' && uDone(u)[s[0]]).length;
const levelOfXp = xp => 1 + Math.floor(xp / 150);
function addXP(n) { const p = pathState(), d = todayStr(); p.xp += n; p.daily[d] = (p.daily[d] || 0) + n; save(); toast('⭐ +' + n + ' XP'); if (typeof checkBadges === 'function') setTimeout(checkBadges, 300); }
function unitIdx(u) { return DATA.units.indexOf(u); }
function unlocked(u) {
  const p = pathState(), i = unitIdx(u), si = DATA.units.findIndex(x => x.lv === p.start);
  if (p.free || i <= si) return true;
  return !!uDone(DATA.units[i - 1]).passed;
}
function startIdx() { const i = DATA.units.findIndex(x => x.lv === pathState().start); return i < 0 ? 0 : i; }
function nextUnit() { return DATA.units.slice(startIdx()).find(u => unlocked(u) && !uDone(u).passed) || null; }
function finishStep(step, extra) {
  const u = DATA.units.find(x => x.id === PT.unit), d = uDone(u);
  if (extra) Object.assign(d, extra);
  if (!d[step]) { d[step] = true; addXP(XP_STEP[step]); }
  const map = {vocab: 'vocab', grammar: 'grammar', listen: 'listen', speak: 'pron', write: 'write'};
  if (map[step]) markDone(map[step]);
  save();
}
function addMistake(q) { const p = pathState(); if (!p.mistakes.some(m => m.q === q.q)) { p.mistakes.push({q: q.q, o: q.o, a: q.a, e: q.e || '', unit: PT.unit}); save(); } }
function qzHTML(key, qs) {
  PT.lists[key] = qs;
  return qs.map((q, i) => { const sel = PT.ans[key + ':' + i]; return `<div class="card q"><p><b>${i + 1}.</b> ${esc(q.q)}</p><div class="opts">${q.o.map((o, j) => { let c = ''; if (sel != null) { if (j === q.a) c = 'ok'; else if (j === sel) c = 'no'; } return `<button class="opt ${c}" ${sel != null ? 'disabled' : ''} onclick="A.pa('${key}',${i},${j})">${esc(o)}</button>`; }).join('')}</div>${sel != null && q.e ? `<p class="expl">${sel === q.a ? '✅' : '❌'} ${esc(q.e)}</p>` : ''}</div>`; }).join('');
}
const allAnswered = (key, n) => [...Array(n)].every((_, i) => PT.ans[key + ':' + i] != null);
const scoreOf = (key, qs) => qs.filter((q, i) => PT.ans[key + ':' + i] === q.a).length;
function buildTest(u) {
  const qs = [...u.grammar.quiz, ...u.listen.qs, ...u.read.qs].map(q => ({q: q.q, o: q.o, a: q.a, e: q.e}));
  const others = DATA.units.flatMap(x => x.vocab).filter(v => !u.vocab.includes(v));
  qs.sort(() => Math.random() - 0.5); qs.length = Math.min(qs.length, 8);
  u.vocab.slice().sort(() => Math.random() - 0.5).slice(0, 2).forEach(v => {
    const opts = [v[2], ...others.sort(() => Math.random() - 0.5).slice(0, 2).map(x => x[2])].sort(() => Math.random() - 0.5);
    qs.push({q: 'Nghĩa của “' + v[0] + '” là gì?', o: opts, a: opts.indexOf(v[2]), e: v[0] + ' = ' + v[2]});
  });
  return qs;
}
function moreListen(u) {
  const kw = (DATA.unitKw && DATA.unitKw[u.id]) || u.title, q = encodeURIComponent(u.lv + ' English listening ' + kw);
  const base = [['▶ Video luyện nghe chủ đề này (YouTube)', 'https://www.youtube.com/results?search_query=' + q], ['▶ Nghe kèm phụ đề: ' + kw, 'https://www.youtube.com/results?search_query=' + encodeURIComponent(kw + ' english lesson subtitles')], ['ELLLO – nhiều giọng, có bài tập', 'https://www.elllo.org/']];
  const byLv = {A1: [['Breaking News English (dễ)', 'https://breakingnewsenglish.com/']], A2: [['Breaking News English', 'https://breakingnewsenglish.com/']], B1: [['Khan Academy – Kinh tế & tài chính', 'https://www.khanacademy.org/economics-finance-domain']], B2: [['TED – Business', 'https://www.ted.com/topics/business'], ['NPR Planet Money', 'https://www.npr.org/podcasts/510289/planet-money']], C1: [['TED – Business', 'https://www.ted.com/topics/business'], ['NPR Planet Money', 'https://www.npr.org/podcasts/510289/planet-money']]};
  return `<div class="card"><h3>🎧 Nghe thêm (miễn phí)</h3>${base.concat(byLv[u.lv] || []).map(l => `<div class="task"><a href="${l[1]}" target="_blank" rel="noopener">${esc(l[0])} ↗</a></div>`).join('')}<p class="muted">Cách nghe: nghe ý chính → nghe chi tiết + xem phụ đề → nghe lại và nhại theo.</p></div>`;
}
views.path = {render() {
  const p = pathState();
  if (PT.mode === 'placement') {
    const done = allAnswered('pl', DATA.placement.length);
    let res = '';
    if (PT.plResult) { const r = PT.plResult; res = `<div class="card center"><h3>Kết quả: nên bắt đầu ở cấp <b>${r.start}</b></h3><p>${LV.map(l => l + ': ' + r.by[l] + '/4').join(' · ')}</p><button class="btn" onclick="A.plapply()">Bắt đầu từ ${r.start}</button></div>`; }
    return `<button class="btn ghost" onclick="A.pback()">← Lộ trình</button><h1>🎯 Kiểm tra xếp lớp</h1><p class="muted">${DATA.placement.length} câu, khoảng 5 phút. Làm theo khả năng, đừng đoán bừa — kết quả chỉ để chọn điểm bắt đầu.</p>${DATA.placement.map((q, i) => { const sel = PT.ans['pl:' + i]; return `<div class="card q"><small class="muted">${q.lv}</small><p><b>${i + 1}.</b> ${esc(q.q)}</p><div class="opts">${q.o.map((o, j) => `<button class="opt ${sel === j ? 'sel' : ''}" ${PT.plResult ? 'disabled' : ''} onclick="A.plans(${i},${j})">${esc(o)}</button>`).join('')}</div></div>`; }).join('')}${PT.plResult ? res : `<button class="btn" ${done ? '' : 'disabled'} onclick="A.plsubmit()">Nộp bài</button>`}`;
  }
  if (PT.mode === 'mistakes') {
    const list = PT.mlist || [];
    return `<button class="btn ghost" onclick="A.pback()">← Lộ trình</button><h1>📓 Sổ lỗi sai</h1><p class="muted">Câu bạn từng làm sai. Trả lời đúng thì câu đó được gỡ khỏi sổ.</p>${list.length ? qzHTML('mist', list) : '<div class="card center"><h3>🎉 Không còn lỗi sai nào cần ôn!</h3></div>'}`;
  }
  if (PT.mode === 'unit') {
    const u = DATA.units.find(x => x.id === PT.unit), d = uDone(u);
    if (!PT.step) {
      return `<button class="btn ghost" onclick="A.pback()">← Lộ trình</button><h1>${esc(u.title)}</h1><p class="muted">${u.lv} · ${esc(u.goal)}</p>
      <div class="card">${STEPS.map(s => `<div class="task ${d[s[0]] ? 'done' : ''}"><span>${s[1]} ${s[2]} ${d[s[0]] ? '✅' : ''}${s[0] === 'test' && d.pct != null ? ` <small class="muted">(${d.pct}%)</small>` : ''}</span><button class="btn sm" onclick="A.pstep('${s[0]}')">${d[s[0]] ? 'Làm lại' : 'Bắt đầu'}</button></div>`).join('')}</div>
      <p class="muted">Học theo thứ tự 1 → 7. Đạt ≥70% ở bài kiểm tra để mở khóa bài tiếp theo.</p>`;
    }
    const back = `<button class="btn ghost" onclick="A.pstep(null)">← ${esc(u.title)}</button>`;
    if (PT.step === 'vocab') return `${back}<h1>🃏 Từ vựng</h1><div class="row"><label class="chk"><input type="checkbox" ${PT.hideVi ? 'checked' : ''} onchange="A.phide(this.checked)"> Che nghĩa (tự nhớ lại trước khi xem)</label></div><div class="card">${u.vocab.map(v => `<div class="task"><span><b>${esc(v[0])}</b> <small class="muted">${esc(v[1])}</small> ${sayBtns(v[0])}<br><span class="${PT.hideVi ? 'blur' : ''}" ${PT.hideVi ? 'onclick="this.classList.remove(\'blur\')"' : ''}>${esc(v[2])}</span><br><small class="muted"><i>${esc(v[3])}</i></small> <button class="ico" onclick="A.say(this.dataset.t)" data-t="${esc(v[3])}">🔊</button></span></div>`).join('')}</div><button class="btn" onclick="A.pvocab()">＋ Thêm ${u.vocab.length} từ vào thẻ ôn & hoàn thành</button>`;
    if (PT.step === 'grammar') { const qs = u.grammar.quiz; return `${back}<h1>📘 Ngữ pháp</h1><div class="card lesson">${u.grammar.body}</div><h2>Bài tập</h2>${qzHTML('grammar', qs)}${allAnswered('grammar', qs.length) ? `<div class="card center"><h3>${scoreOf('grammar', qs)}/${qs.length}</h3><button class="btn" onclick="A.pstep(null)">Xong</button></div>` : ''}`; }
    if (PT.step === 'listen') { const qs = u.listen.qs; return `${back}<h1>🎧 Nghe</h1>${hsUnitBlock(u)}<p class="muted">Nghe hội thoại (<b>giọng máy</b>) 2–3 lần rồi trả lời. Chỉ xem văn bản sau khi đã thử nghe.</p><div class="row"><button class="btn sm" onclick="A.plisten()">▶ Nghe hội thoại (giọng máy)</button> <a class="btn sm ghost" href="#video">🎬 Nghe người thật</a><button class="btn sm ghost" onclick="A.tstop()">⏹</button><label class="chk"><input type="checkbox" ${PT.showText ? 'checked' : ''} onchange="A.ptext(this.checked)"> Hiện văn bản</label></div>${PT.showText ? `<div class="card">${u.listen.dialog.map(x => `<div class="task"><span><small class="muted">${x[0]}</small><br><b>${esc(x[1])}</b><br><small class="muted">${esc(x[2])}</small></span></div>`).join('')}</div>` : ''}${qzHTML('listen', qs)}${moreListen(u)}`; }
    if (PT.step === 'read') { const qs = u.read.qs; return `${back}<h1>📖 Đọc</h1><div class="card passage">${esc(u.read.text)}</div><div class="row"><button class="btn sm ghost" onclick="A.say(this.dataset.t,0.9)" data-t="${esc(u.read.text)}">🔊 Nghe đọc</button></div>${qzHTML('read', qs)}`; }
    if (PT.step === 'speak') return `${back}<h1>🗣️ Nói</h1><p class="muted">Shadowing: nghe → nói theo → bấm 🎙️ kiểm tra.</p>${u.speak.shadow.map((s, i) => `<div class="card"><p class="big">${esc(s)}</p><div class="row"><button class="btn sm" onclick="A.say(this.dataset.t)" data-t="${esc(s)}">▶</button><button class="btn sm ghost" onclick="A.say(this.dataset.t,0.7)" data-t="${esc(s)}">🐢</button><button class="btn sm ghost" onclick="A.mic(this.dataset.t,'sr${i}')" data-t="${esc(s)}">🎙️ Thử nói</button></div><div id="sr${i}" class="res"></div></div>`).join('')}<div class="card"><h3>Nói tự do</h3><p>${esc(u.speak.prompt)}</p><div class="row"><button class="btn sm" onclick="A.rec()">🔴 Thu âm</button><button class="btn sm ghost" onclick="A.recstop()">⏹ Dừng</button></div><audio id="au" controls class="hide"></audio></div><button class="btn" onclick="A.pspeak()">✅ Tôi đã luyện nói xong</button>`;
    if (PT.step === 'write') return `${back}<h1>✍️ Viết</h1><div class="card"><b>Đề:</b> ${esc(u.write.prompt)}<br><small class="muted">Tối thiểu ${u.write.min} từ</small></div><div class="card"><textarea id="pw" rows="9" oninput="A.pwc(${u.write.min})" placeholder="Viết bài của bạn…"></textarea><div class="row"><span id="pwc" class="muted">0 / ${u.write.min} từ</span><button class="btn" onclick="A.gstart('gbox','pw','essay',${u.write.min})">📝 Chấm điểm & sửa lỗi</button><button class="btn" onclick="A.pwsave()">💾 Lưu bài</button><button class="btn ghost" onclick="A.pmodel()">${PT.showModel ? 'Ẩn' : 'Xem'} bài mẫu</button></div></div><div id="gbox"></div>${PT.showModel ? `<div class="card"><h3>Bài mẫu</h3><p>${esc(u.write.model)}</p><button class="ico" onclick="A.say(this.dataset.t)" data-t="${esc(u.write.model)}">🔊</button><p class="muted">So sánh: bạn đã dùng cấu trúc của bài học chưa? Từ nối? Thì động từ đúng chưa?</p></div>` : ''}<div class="card"><h3>✅ Checklist tự sửa</h3>${DATA.writeChecklist.map(c => `<label class="chk"><input type="checkbox"> ${esc(c)}</label>`).join('')}</div>`;
    if (PT.step === 'test') { if (!PT.testQs) PT.testQs = buildTest(u); const qs = PT.testQs, all = allAnswered('test', qs.length), sc = scoreOf('test', qs), pct = Math.round(sc / qs.length * 100);
      return `${back}<h1>🏁 Kiểm tra bài</h1><p class="muted">${qs.length} câu tổng hợp. Đạt ≥ 70% để mở khóa bài tiếp theo.</p>${qzHTML('test', qs)}${all ? `<div class="card center"><h3>${sc}/${qs.length} (${pct}%) ${pct >= 70 ? '🎉 Đạt!' : '— chưa đạt'}</h3>${pct >= 70 ? '<button class="btn" onclick="A.pback()">Về lộ trình</button>' : '<button class="btn" onclick="A.pretest()">Làm lại</button>'}</div>` : ''}`; }
  }
  /* trang tổng quan */
  const nx = nextUnit(), today = p.daily[todayStr()] || 0, pctGoal = Math.min(100, Math.round(today / DAILY_XP * 100));
  const totalDone = DATA.units.filter(u => uDone(u).passed).length;
  return `<h1>🗺️ Lộ trình CEFR A1 → C1</h1><p class="muted">Học theo trình tự: từ vựng → ngữ pháp → nghe → đọc → nói → viết → kiểm tra. Mỗi bài đạt ≥70% mới mở bài kế.</p>
  <div class="grid two"><div class="card"><h3>⭐ ${p.xp} XP · Cấp ${levelOfXp(p.xp)}</h3><div class="pbar"><i style="width:${pctGoal}%"></i></div><small class="muted">Mục tiêu hôm nay: ${today}/${DAILY_XP} XP · 🔥 Chuỗi ${streak()} ngày</small><p class="muted">Đã đạt ${totalDone}/${DATA.units.length} bài</p></div>
  <div class="card">${nx ? `<h3>Bài tiếp theo</h3><p><b>${nx.lv}</b> · ${esc(nx.title)}</p><button class="btn" onclick="A.punit('${nx.id}')">Học tiếp →</button>` : '<h3>🏆 Bạn đã hoàn thành toàn bộ lộ trình!</h3>'}</div></div>
  <div class="row">${p.placed ? `<small class="muted">Điểm bắt đầu: ${p.start}</small>` : ''}<button class="btn sm ghost" onclick="A.pplace()">🎯 ${p.placed ? 'Làm lại' : 'Làm'} kiểm tra xếp lớp</button><button class="btn sm ghost" onclick="A.pmist()">📓 Sổ lỗi sai (${p.mistakes.length})</button><label class="chk"><input type="checkbox" ${p.free ? 'checked' : ''} onchange="A.pfree(this.checked)"> Học tự do (mở khóa tất cả)</label></div>
  ${DATA.levels.map(l => `<h2>${esc(l.name)}</h2><p class="muted">${esc(l.can)}</p><div class="grid two">${DATA.units.filter(u => u.lv === l.id).map(u => { const d = uDone(u), lock = !unlocked(u); return `<a class="card link ${lock ? 'locked' : ''}" href="#path" onclick="${lock ? "A.plock()" : `A.punit('${u.id}')`}"><h3>${lock ? '🔒' : d.passed ? '✅' : '📘'} ${esc(u.title)}</h3>${(!d.passed && unitIdx(u) < startIdx()) ? '<small class="muted">⏭️ Có thể bỏ qua theo kết quả xếp lớp</small><br>' : ''}<small class="muted">${esc(u.goal)}</small><div class="pbar"><i style="width:${Math.round(stepsDone(u) / 6 * 100)}%"></i></div><small>${stepsDone(u)}/6 bước${d.passed ? ' · Đã đạt ' + d.pct + '%' : ''}</small></a>`; }).join('')}</div>`).join('')}
  <h2>🔎 Phương pháp lấy từ các nền tảng học</h2><div class="card">${DATA.platformMethods.map(m => `<p><b>${esc(m[0])}:</b> ${esc(m[1])}<br><small class="muted">${esc(m[2])}</small></p>`).join('')}</div>
  <h2>📚 Tài liệu tham khảo</h2><div class="grid two">${DATA.pathLinks.map(it => `<a class="card link ext" href="${it[2]}" target="_blank" rel="noopener"><h3>${esc(it[0])} ↗</h3><p class="muted">${esc(it[1])}</p></a>`).join('')}</div>
  <p class="muted">Nội dung bài học do app soạn theo đề cương ngữ pháp và kỹ năng của từng cấp CEFR; không sao chép nội dung của các nền tảng trên.</p>`;
}};

/* =====================  THÀNH TÍCH & THỐNG KÊ  ===================== */
const BADGES = [
  {id:'first', icon:'🌱', name:'Bước đầu', desc:'Đạt bài kiểm tra đầu tiên', ok: s => s.passed >= 1},
  {id:'five', icon:'📚', name:'Chăm chỉ', desc:'Đạt 5 bài kiểm tra', ok: s => s.passed >= 5},
  {id:'fifteen', icon:'🎓', name:'Học giả', desc:'Đạt 15 bài kiểm tra', ok: s => s.passed >= 15},
  {id:'lvA1', icon:'🥉', name:'Hoàn thành A1', desc:'Đạt mọi bài cấp A1', ok: s => s.lvDone('A1')},
  {id:'lvA2', icon:'🥈', name:'Hoàn thành A2', desc:'Đạt mọi bài cấp A2', ok: s => s.lvDone('A2')},
  {id:'lvB1', icon:'🥇', name:'Hoàn thành B1', desc:'Đạt mọi bài cấp B1', ok: s => s.lvDone('B1')},
  {id:'lvB2', icon:'💎', name:'Hoàn thành B2', desc:'Đạt mọi bài cấp B2', ok: s => s.lvDone('B2')},
  {id:'lvC1', icon:'👑', name:'Hoàn thành C1', desc:'Đạt mọi bài cấp C1', ok: s => s.lvDone('C1')},
  {id:'xp100', icon:'⭐', name:'100 XP', desc:'Tích lũy 100 XP', ok: s => s.xp >= 100},
  {id:'xp500', icon:'🌟', name:'500 XP', desc:'Tích lũy 500 XP', ok: s => s.xp >= 500},
  {id:'xp1000', icon:'✨', name:'1000 XP', desc:'Tích lũy 1000 XP', ok: s => s.xp >= 1000},
  {id:'st3', icon:'🔥', name:'Chuỗi 3 ngày', desc:'Học 3 ngày liên tiếp', ok: s => s.streak >= 3},
  {id:'st7', icon:'🔥', name:'Chuỗi 7 ngày', desc:'Học 7 ngày liên tiếp', ok: s => s.streak >= 7},
  {id:'st30', icon:'🚀', name:'Chuỗi 30 ngày', desc:'Học 30 ngày liên tiếp', ok: s => s.streak >= 30},
  {id:'w50', icon:'🃏', name:'50 từ', desc:'Đã ôn 50 từ bằng thẻ', ok: s => s.words >= 50},
  {id:'w200', icon:'🗂️', name:'200 từ', desc:'Đã ôn 200 từ bằng thẻ', ok: s => s.words >= 200},
  {id:'wr5', icon:'✍️', name:'Cây bút', desc:'Lưu 5 bài viết', ok: s => s.writings >= 5},
  {id:'fix10', icon:'📓', name:'Sửa sai', desc:'Sửa đúng 10 câu trong sổ lỗi sai', ok: s => s.cleared >= 10},
  {id:'placed', icon:'🎯', name:'Xếp lớp', desc:'Hoàn thành kiểm tra xếp lớp', ok: s => s.placed}
];
function statSnapshot() {
  const p = pathState();
  return {passed: DATA.units.filter(u => uDone(u).passed).length, xp: p.xp, streak: streak(), words: Object.keys(S.vocab).length, writings: S.writing.length, cleared: p.cleared || 0, placed: !!p.placed,
    lvDone: l => { const us = DATA.units.filter(u => u.lv === l); return us.length > 0 && us.every(u => uDone(u).passed); }};
}
function checkBadges() {
  const p = pathState(); p.badges ||= {}; const snap = statSnapshot(); let n = 0;
  BADGES.forEach(b => { if (!p.badges[b.id] && b.ok(snap)) { p.badges[b.id] = todayStr(); n++; setTimeout(() => toast('🏅 Huy hiệu mới: ' + b.name), 600 * n); } });
  if (n) save();
}
views.stats = {render() {
  const p = pathState(), snap = statSnapshot(); checkBadges();
  const days = [...Array(7)].map((_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); const k = d.toLocaleDateString('sv'); return {d: DAYS[d.getDay()], xp: p.daily[k] || 0, t: S.log[k] ? Object.values(S.log[k].tasks).filter(Boolean).length : 0}; });
  const maxXp = Math.max(30, ...days.map(x => x.xp));
  const skills = STEPS.filter(s => s[0] !== 'test').map(s => ({n: s[1] + ' ' + s[2], c: DATA.units.filter(u => uDone(u)[s[0]]).length}));
  const per = DATA.levels.map(l => { const us = DATA.units.filter(u => u.lv === l.id); return {id: l.id, done: us.filter(u => uDone(u).passed).length, n: us.length}; });
  const earned = BADGES.filter(b => p.badges && p.badges[b.id]).length;
  const due = dueCards().length;
  return `<h1>🏆 Thành tích</h1>
  <div class="grid two">
   <div class="card"><h3>⭐ ${p.xp} XP · Cấp ${levelOfXp(p.xp)}</h3><p class="muted">🔥 Chuỗi ${snap.streak} ngày · Bài đã đạt ${snap.passed}/${DATA.units.length}</p><p class="muted">Từ đã ôn (Leitner): <b>${snap.words}</b> (cần ôn hôm nay: ${due}) · Bài viết: <b>${snap.writings}</b> · Lỗi sai còn lại: <b>${p.mistakes.length}</b></p></div>
   <div class="card"><h3>XP 7 ngày gần nhất</h3><div class="bars">${days.map(x => `<div class="bar"><i style="height:${Math.round(x.xp / maxXp * 90) + 4}px" class="${x.xp ? 'f' : ''}"></i><span>${x.d}</span><small>${x.xp}</small></div>`).join('')}</div></div>
  </div>
  <div class="card"><h3>Tiến độ theo cấp</h3>${per.map(x => `<div style="margin:8px 0"><b>${x.id}</b> <small class="muted">${x.done}/${x.n} bài</small><div class="pbar"><i style="width:${Math.round(x.done / x.n * 100)}%"></i></div></div>`).join('')}</div>
  <div class="card"><h3>Cân bằng các kỹ năng</h3><p class="muted">Số bài bạn đã hoàn thành từng bước — giúp bạn thấy kỹ năng nào đang bị bỏ quên.</p>${skills.map(x => `<div style="margin:8px 0">${x.n} <small class="muted">${x.c}/${DATA.units.length}</small><div class="pbar"><i style="width:${Math.round(x.c / DATA.units.length * 100)}%"></i></div></div>`).join('')}</div>
  <h2>🏅 Huy hiệu (${earned}/${BADGES.length})</h2>
  <div class="grid badges">${BADGES.map(b => { const got = p.badges && p.badges[b.id]; return `<div class="card badge ${got ? '' : 'off'}"><div class="bi">${b.icon}</div><b>${esc(b.name)}</b><small class="muted">${esc(b.desc)}</small>${got ? `<small class="ok">✓ ${got}</small>` : ''}</div>`; }).join('')}</div>`;
}};

/* =====================  THI XẾP LỚP (RMIT – mô phỏng)  ===================== */
function rmState() { const r = (S.rmit ||= {}); r.writings ||= []; r.speaking ||= []; r.plan ||= {}; return r; }
let RM = {tab: 'over', w: null, s: null, wsel: null, noPaste: true, noSpell: true, viewW: null, modelTopic: null};
let RMT = null, RMREC = null;
const fmtT = s => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
function rmCleanup() {
  try { if (RMREC && RMREC.recog) { RMREC.recog.onend = null; RMREC.recog.stop(); } } catch (e) {}
  try { if (RMREC && RMREC.mr && RMREC.mr.state === 'recording') RMREC.mr.stop(); } catch (e) {}
  if (RMREC && RMREC.stream) RMREC.stream.getTracks().forEach(t => t.stop());
  RMREC = null;
}
function rmStop() { if (RMT) clearInterval(RMT); RMT = null; if (RM.s && !RM.s.done) { RM.s = null; } rmCleanup(); }

/* ---------- phân tích bài viết ---------- */
const RM_LINKERS = ['however','moreover','furthermore','in addition','additionally','for example','for instance','such as','as a result','therefore','consequently','although','even though','while','whereas','on the other hand','in contrast','nevertheless','firstly','secondly','finally','in conclusion','to sum up','overall','because','but','first of all','besides','despite','in fact','as well as','instead','meanwhile','since','so that','not only','admittedly','on balance'];
const RM_ERRS = [
  [/\bi\b(?!['’])/g, 'Chữ “I” phải viết hoa.'],
  [/\b(dont|cant|doesnt|didnt|wont|isnt|im|ive|youre|thats)\b/gi, 'Thiếu dấu nháy (don’t, can’t, I’m…).'],
  [/\b(people|children|police) (is|was|has)\b/gi, '“people/children/police” đi với động từ số nhiều (are/were/have).'],
  [/\b(informations|advices|equipments|furnitures|knowledges)\b/gi, 'Danh từ không đếm được không thêm -s.'],
  [/\b(he|she|it) (go|have|do|make|work|live|like|want|need|think|say|get|know)\b/gi, 'Chủ ngữ số ít: động từ cần -s/-es (goes, has, does…).'],
  [/\b(I|we|they|you) (is|was)\b/g, 'Sai động từ to be (I am / we are / they are).'],
  [/\ba (a|e|i|o|u)\w+/gi, 'Trước nguyên âm dùng “an” (an apple, an hour).'],
  [/\bmore (better|easier|bigger|cheaper|faster)\b/gi, 'So sánh hơn của tính từ ngắn không dùng “more” (better, easier…).'],
  [/\b(very very|really really)\b/gi, 'Lặp trạng từ; thử extremely/particularly.'],
  [/\bmany (\w+[^s\W])\b(?=[ ,.])/gi, null]
];
function analyzeWriting(text) {
  const t = text.trim(), words = t.match(/[A-Za-z’']+/g) || [], lw = words.map(w => w.toLowerCase()), nW = Math.max(words.length, (t.match(/\S+/g) || []).length);
  const sents = t.match(/[^.!?]+[.!?]*/g) || [], nS = Math.max(1, sents.filter(x => /[A-Za-z]/.test(x)).length);
  const avg = nW / nS, ttr = nW ? new Set(lw.slice(0, 100)).size / Math.min(100, nW) : 0, longR = nW ? lw.filter(w => w.length >= 7).length / nW : 0;
  const link = RM_LINKERS.filter(k => new RegExp('\\b' + k + '\\b', 'i').test(t));
  const paras = t.split(/\n\s*\n/).filter(x => x.trim()).length;
  const feats = [
    ['Quá khứ (was/did/-ed)', /\b(was|were|did|had)\b|\b\w+ed\b/i.test(t)],
    ['Hiện tại hoàn thành (have/has + V3)', /\b(have|has)\s+(been|\w+ed|\w+en|done|gone|made|seen|had|got|taken|known|learned|learnt)\b/i.test(t)],
    ['Tương lai (will / going to)', /\b(will|won’t|won't|going to)\b/i.test(t)],
    ['Câu điều kiện (if … would/will)', /\bif\b[^.!?]*\b(would|will|could|can)\b|\bwould\b/i.test(t)],
    ['Câu bị động (be + V3)', /\b(is|are|was|were|be|been|being)\s+\w+(ed|en)\b/i.test(t)],
    ['Mệnh đề quan hệ (who/which/where…)', /\b(who|which|whose|whom|where)\b|\bthat\s+(is|was|can|will|has|helps|makes)\b/i.test(t)],
    ['Động từ khuyết thiếu (can/should/might…)', /\b(can|could|should|might|may|must)\b/i.test(t)],
    ['Mệnh đề phụ (because/although/when/while…)', /\b(because|although|even though|while|when|since|unless|whereas)\b/i.test(t)]
  ];
  const featN = feats.filter(f => f[1]).length;
  const errs = []; RM_ERRS.forEach(([re, msg]) => { if (!msg) return; const m = t.match(re); if (m) errs.push({msg, ex: m.slice(0, 2).join(' · ')}); });
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  let score = clamp(nW / 250) * 18 + clamp((avg - 6) / 14) * 14 + clamp((ttr - 0.5) / 0.35) * 6 + clamp(longR / 0.25) * 8 + clamp(link.length / 6) * 12 + featN / 8 * 18 + (paras >= 3 ? 6 : paras === 2 ? 3 : 0) - Math.min(errs.length * 2, 12);
  let lvl = score < 16 ? 1 : score < 28 ? 2 : score < 38 ? 3 : score < 48 ? 4 : score < 58 ? 5 : 6;
  if (nW < 40) lvl = Math.min(lvl, 2); else if (nW < 80) lvl = Math.min(lvl, 3);
  return {nW, nS, avg: Math.round(avg * 10) / 10, ttr: Math.round(ttr * 100), longR: Math.round(longR * 100), link, paras, feats, errs, score: Math.round(score), lvl};
}
const lvlText = n => DATA.rmit.levels.find(l => l[0] === n);

/* ---------- giao diện ---------- */
views.rmit = {render() {
  const tabs = [['over', 'Tổng quan'], ['write', '✍️ Viết 30′'], ['speak', '🗣️ Nói 15′'], ['plan', 'Kế hoạch 14 ngày'], ['tips', 'Mẹo & lỗi hay gặp'], ['hist', 'Lịch sử']].map(t => `<button class="${RM.tab === t[0] ? 'on' : ''}" onclick="A.rmtab('${t[0]}')">${t[1]}</button>`).join('');
  const body = {over: rmOver, write: rmWrite, speak: rmSpeak, plan: rmPlan, tips: rmTips, hist: rmHist}[RM.tab]();
  return `<h1>🏫 Luyện thi xếp lớp tiếng Anh</h1><div class="tabs wrap">${tabs}</div>${body}`;
}};
function rmOver() {
  const r = rmState();
  return `<div class="card">😅 Thấy bài viết 30′ và nói 15′ khó? Hãy làm thử <a href="#ctest"><b>📝 Test trắc nghiệm văn phạm + nghe</b></a> (kiểu trung tâm) để biết cấp độ của bạn trước.</div><div class="card warn">⚠️ Đây là bản <b>mô phỏng để luyện tập</b> theo thông tin bạn cung cấp. Đề thi, tiêu chí chấm và tên các cấp độ chính thức do nhà trường quy định; kết quả “ước lượng” trong app chỉ mang tính tham khảo.</div>
  <div class="card"><h3>Thông tin bài thi</h3>${DATA.rmit.facts.map(f => `<p><b>${esc(f[0])}:</b> ${esc(f[1])}</p>`).join('')}</div>
  <div class="grid two"><div class="card"><h3>✍️ Phần Viết</h3><p>Đồng hồ 30 phút, chọn 1 chủ đề, không giới hạn số chữ. Nộp xong app phân tích: số từ, từ nối, độ đa dạng ngữ pháp, lỗi có thể mắc, so với bài mẫu 3 mức.</p><button class="btn" onclick="A.rmtab('write')">Làm bài viết →</button></div>
  <div class="card"><h3>🗣️ Phần Nói</h3><p>Phỏng vấn 15 phút do “giáo viên ảo” đọc câu hỏi: khởi động → nói dài 2 phút → thảo luận → kết thúc. Có ghi âm, ghi chữ tự động (nếu trình duyệt hỗ trợ) và báo cáo.</p><button class="btn" onclick="A.rmtab('speak')">Làm bài nói →</button></div></div>
  <div class="card"><h3>6 cấp độ (quy đổi ước lượng sang CEFR)</h3><table class="tbl"><tr><th>Cấp</th><th>≈ CEFR</th><th>Bạn làm được</th></tr>${DATA.rmit.levels.map(l => `<tr><td><b>${l[0]}</b></td><td>${esc(l[1])}</td><td>${esc(l[2])}</td></tr>`).join('')}</table><p class="muted">Số cấp và tên cấp có thể khác nhau tùy chương trình/năm; hãy xem trang chính thức của trường.</p></div>
  <div class="card"><h3>Đã luyện</h3><p>Bài viết: <b>${r.writings.length}</b> · Buổi nói: <b>${r.speaking.length}</b> · Ngày kế hoạch hoàn thành: <b>${Object.values(r.plan).filter(Boolean).length}/14</b></p></div>
  <h3>Liên kết chính thức</h3><div class="grid two">${DATA.rmit.links.map(it => `<a class="card link ext" href="${it[2]}" target="_blank" rel="noopener"><h3>${esc(it[0])} ↗</h3><p class="muted">${esc(it[1])}</p></a>`).join('')}</div>`;
}
function rmWrite() {
  const w = RM.w;
  if (!w) {
    const groups = [...new Set(DATA.rmit.topics.map(t => t[0]))];
    return `<div class="card"><h3>Chọn chủ đề</h3><p class="muted">Giống thi thật: bạn được chọn <b>một chủ đề bất kỳ</b>. Không giới hạn số chữ.</p>
    ${groups.map(g => `<h4>${esc(g)}</h4>${DATA.rmit.topics.filter(t => t[0] === g).map(t => `<label class="chk"><input type="radio" name="rt" ${RM.wsel === t[1] ? 'checked' : ''} onchange="A.rmsel(this.dataset.t)" data-t="${esc(t[1])}"> ${esc(t[1])}</label>`).join('')}`).join('')}
    <div class="row"><label class="chk"><input type="checkbox" ${RM.noPaste ? 'checked' : ''} onchange="A.rmopt('noPaste',this.checked)"> Cấm dán văn bản (như thi thật)</label><label class="chk"><input type="checkbox" ${RM.noSpell ? 'checked' : ''} onchange="A.rmopt('noSpell',this.checked)"> Tắt gạch chân chính tả</label></div>
    <div class="row"><button class="btn" onclick="A.rwstart()">▶ Bắt đầu 30 phút</button><button class="btn ghost" onclick="A.rwrandom()">🎲 Chọn ngẫu nhiên và bắt đầu</button></div></div>
    <div class="card"><h3>Kế hoạch 30 phút</h3><ul>${DATA.rmit.writingPlan.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`;
  }
  if (w.running) {
    return `<div class="card"><b>Chủ đề:</b> ${esc(w.topic)}</div>
    <div class="row"><b style="font-size:1.4rem">⏱️ <span id="rmt">--:--</span></b><span id="rmphase" class="muted"></span><span id="rwc" class="muted">0 từ</span><button class="btn sm bad" onclick="A.rwfinish(false)">Nộp bài</button></div>
    <textarea id="rw" rows="16" ${RM.noSpell ? 'spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off"' : ''} ${RM.noPaste ? 'onpaste="return false" ondrop="return false"' : ''} oninput="A.rwinput()" placeholder="Viết bài của bạn ở đây…"></textarea>`;
  }
  const r = w.result, m = DATA.rmit.models[w.topic];
  const L = lvlText(r.lvl);
  return `<div class="card center"><h3>Kết quả ước lượng: Cấp ${r.lvl} (${esc(L[1])})</h3><p class="muted">${esc(L[2])}</p><p class="muted">⚠️ Ước lượng tự động từ số liệu bề mặt của bài viết (độ dài, từ nối, độ đa dạng, lỗi dễ nhận ra). Không phải điểm chính thức.</p></div>
  <div class="grid two"><div class="card"><h3>Số liệu</h3><table class="tbl"><tr><td>Số từ</td><td><b>${r.nW}</b></td></tr><tr><td>Số câu</td><td>${r.nS} (TB ${r.avg} từ/câu)</td></tr><tr><td>Số đoạn</td><td>${r.paras}</td></tr><tr><td>Độ đa dạng từ</td><td>${r.ttr}%</td></tr><tr><td>Từ dài (≥7 chữ)</td><td>${r.longR}%</td></tr><tr><td>Từ nối</td><td>${r.link.length} loại ${r.link.length ? '· ' + esc(r.link.join(', ')) : ''}</td></tr></table></div>
  <div class="card"><h3>Đa dạng ngữ pháp (${r.feats.filter(f => f[1]).length}/8)</h3>${r.feats.map(f => `<div>${f[1] ? '✅' : '⬜'} ${esc(f[0])}</div>`).join('')}<p class="muted">Cố thêm các mục còn trống nếu tự nhiên.</p></div></div>
  <div class="card"><h3>Có thể cần kiểm tra lại</h3>${r.errs.length ? r.errs.map(e => `<p>⚠️ ${esc(e.msg)} <small class="muted">(${esc(e.ex)})</small></p>`).join('') : '<p>Không phát hiện lỗi phổ biến nào bằng bộ kiểm tra tự động. Hãy tự đọc lại một lần nữa.</p>'}<p class="muted">Bộ kiểm tra chỉ bắt vài lỗi phổ biến và có thể báo nhầm.</p></div>
  <div class="card"><h3>Bài của bạn</h3><div class="pre">${esc(w.text)}</div></div>
  <div class="row"><button class="btn" onclick="A.gstart('gbox2',null,'essay',0)">📝 Chấm điểm & sửa lỗi chi tiết</button></div><div id="gbox2"></div>
  <div class="card"><h3>Tự chấm (1–6)</h3>${['Nội dung & ý tưởng', 'Bố cục & liên kết', 'Từ vựng', 'Ngữ pháp & chính xác'].map((c, i) => `<label>${c}<select onchange="A.rwrate(${i},this.value)">${[1, 2, 3, 4, 5, 6].map(n => `<option ${((w.rate || [])[i] || 3) === n ? 'selected' : ''}>${n}</option>`).join('')}</select></label>`).join('')}</div>
  <div class="card"><h3>Bài mẫu để đối chiếu</h3>${m ? m.map(x => `<details><summary><b>${esc(x.lv)}</b> – ${esc(x.note)}</summary><p>${esc(x.text)}</p><button class="ico" onclick="A.say(this.dataset.t,0.95)" data-t="${esc(x.text)}">🔊</button></details>`).join('') : `<p class="muted">Chủ đề này chưa có bài mẫu. Xem bài mẫu của chủ đề khác ở tab “Mẹo & lỗi hay gặp”.</p>`}</div>
  <div class="row"><button class="btn" onclick="A.rwreset()">Làm bài khác</button></div>`;
}
function rmSpeak() {
  const s = RM.s;
  if (!s) return `<div class="card"><h3>Phỏng vấn nói 15 phút</h3><p>Cấu trúc mô phỏng: <b>Khởi động</b> (5 câu cá nhân) → <b>Nói dài</b> (thẻ đề, 1 phút chuẩn bị + tối đa 2 phút nói) → <b>Thảo luận</b> (4 câu) → <b>Kết thúc</b>. Giáo viên ảo đọc câu hỏi bằng giọng bản ngữ.</p>
    <label>Giọng giáo viên<select id="rmacc"><option value="US" ${accent() === 'US' ? 'selected' : ''}>🇺🇸 Mỹ</option><option value="GB" ${accent() === 'GB' ? 'selected' : ''}>🇬🇧 Anh</option></select></label>
    <p class="muted">Cần cho phép <b>micro</b>. Nên dùng Chrome/Edge/Safari và nói to, rõ. Có thể bấm “Nhắc lại câu hỏi” (giống việc nhờ giám khảo nhắc lại).</p>
    <div class="row"><button class="btn" onclick="A.rsstart()">▶ Phỏng vấn kiểu xếp lớp (15′)</button><button class="btn" onclick="A.rsstart('ielts')">🎯 Thi thử IELTS Speaking (Part 1–2–3)</button></div></div>
    <div class="card"><h3>Mẫu câu nên thuộc</h3>${Object.entries(DATA.rmit.phrases).map(([k, v]) => `<p><b>${esc(k)}</b></p><div class="chips">${v.map(x => `<button class="chip" onclick="A.say(this.dataset.t)" data-t="${esc(x)}">🔊 ${esc(x)}</button>`).join('')}</div>`).join('')}</div>`;
  if (s.done) return rmSpeakReport(s);
  const st = s.steps[s.i];
  if (!st) return '<p>Đang chuẩn bị…</p>';
  const stage = {warm: 'Khởi động', card: s.mode === 'ielts' ? 'Part 2' : 'Nói dài', disc: 'Thảo luận', wrap: 'Kết thúc', p1: 'Part 1', p3: 'Part 3'}[st.stage];
  const status = s.state === 'asking' ? '🧑‍🏫 Giáo viên đang hỏi… hãy nghe' : s.state === 'prep' ? '📝 Thời gian chuẩn bị (ghi chú ý chính)' : '🎙️ Mời bạn trả lời';
  return `<div class="row"><b style="font-size:1.3rem">⏱️ Tổng <span id="rmt">--:--</span></b><span class="muted">${stage} · câu ${s.i + 1}/${s.steps.length}</span><button class="btn sm bad" onclick="A.rsfinish()">Kết thúc sớm</button></div>
  <div class="card"><p class="muted">${status}${s.state !== 'asking' ? ' · <b id="rms">--:--</b>' : ''}</p>
   ${st.kind === 'card' ? `<h3>${esc(st.card.t)}</h3><p>You should say:</p><ul>${st.card.pts.map(p => `<li>${esc(p)}</li>`).join('')}</ul>` : `<p class="big">${esc(st.text)}</p>`}
   <div class="row">${s.state === 'prep' ? '<button class="btn" onclick="A.rsbegin()">Bắt đầu nói ngay</button>' : ''}${s.state === 'answering' ? '<button class="btn" onclick="A.rsnext()">✅ Xong, câu tiếp</button>' : ''}<button class="btn sm ghost" onclick="A.rsrepeat()">🔁 Nhắc lại câu hỏi</button></div>
   ${s.state === 'answering' ? `<div class="res" id="rtr">${s.hasRecog ? '<i>(ghi chữ tự động sẽ hiện ở đây)</i>' : 'Trình duyệt không hỗ trợ ghi chữ tự động – app vẫn thu âm để bạn nghe lại.'}</div>` : ''}</div>`;
}
function rmSpeakReport(s) {
  const A_ = s.ans, tw = A_.reduce((a, x) => a + x.words, 0), ts = A_.reduce((a, x) => a + x.secs, 0), fill = A_.reduce((a, x) => a + x.fill, 0);
  const wpm = ts ? Math.round(tw / (ts / 60)) : 0, avg = A_.length ? Math.round(tw / A_.length) : 0;
  const tips = [];
  if (s.hasRecog) {
    if (avg < 25) tips.push('Câu trả lời còn ngắn (TB ' + avg + ' từ). Dùng mẫu: Answer + Reason + Example để nói 3–4 câu cho mỗi câu hỏi.');
    else if (avg < 45) tips.push('Độ dài khá. Thêm ví dụ cụ thể để lên mức cao hơn.');
    else tips.push('Độ dài tốt. Chú ý giữ câu rõ ràng, không lan man.');
    if (wpm && wpm < 70) tips.push('Tốc độ nói chậm (' + wpm + ' từ/phút). Luyện shadowing để tăng độ trôi chảy.');
    if (fill / Math.max(1, tw) > 0.04) tips.push('Nhiều từ đệm (um/uh/you know). Thay bằng cụm câu giờ: “Let me think…”, “That’s an interesting question…”.');
  } else tips.push('Không có ghi chữ tự động. Hãy nghe lại từng đoạn ghi âm và tự đánh giá độ dài, lỗi ngữ pháp, từ đệm.');
  const rated = s.rate || [];
  return `<div class="card center"><h3>Hoàn thành buổi phỏng vấn</h3><p class="muted">${A_.length} câu · ${fmtT(Math.round(ts))} thời gian nói thực tế${s.hasRecog ? ` · ${tw} từ · TB ${avg} từ/câu · ${wpm} từ/phút · ${fill} từ đệm` : ''}</p></div>
  <div class="card"><h3>Nhận xét</h3><ul>${tips.map(t => `<li>${esc(t)}</li>`).join('')}</ul></div>
  <div class="card"><h3>Nghe lại từng câu</h3>${A_.map((x, i) => `<div class="task" style="display:block"><b>${i + 1}. ${esc(x.q)}</b><br><small class="muted">${x.secs}s${s.hasRecog ? ' · ' + x.words + ' từ' : ''}</small>${x.url ? `<audio controls src="${x.url}"></audio>` : '<small class="muted"> (không có ghi âm)</small>'}${x.transcript ? `<p class="muted"><i>${esc(x.transcript)}</i></p>` : ''}</div>`).join('')}</div>
  <div class="card"><h3>Tự chấm (1–6)</h3>${(s.mode === 'ielts' ? ['Fluency & Coherence', 'Lexical Resource', 'Grammatical Range & Accuracy', 'Pronunciation'] : ['Trôi chảy & mạch lạc', 'Từ vựng', 'Ngữ pháp', 'Phát âm', 'Tương tác (nghe hiểu & phản hồi)']).map((c, i) => `<label>${c}<select onchange="A.rsrate(${i},this.value)">${(s.mode === 'ielts' ? [4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5] : [1, 2, 3, 4, 5, 6]).map(n => `<option ${(rated[i] || (s.mode === 'ielts' ? 6 : 3)) === n ? 'selected' : ''}>${n}</option>`).join('')}</select></label>`).join('')}<div id="rsres" class="res"></div></div>
  <div class="row"><button class="btn" onclick="A.rsreset()">Làm buổi khác</button></div>`;
}
function rmPlan() {
  const r = rmState();
  return `<p class="muted">Kế hoạch 14 ngày gợi ý (30–60 phút mỗi ngày). Tick khi hoàn thành.</p><div class="card">${DATA.rmit.plan14.map((d, i) => `<div class="task ${r.plan[i] ? 'done' : ''}"><label><input type="checkbox" ${r.plan[i] ? 'checked' : ''} onchange="A.rmplan(${i},this.checked)"> <span><b>${esc(d[0])}:</b> ${esc(d[1])}</span></label></div>`).join('')}</div>
  <div class="row"><a class="btn sm" href="#path">🗺️ Lộ trình</a><a class="btn sm ghost" href="#grammar">📘 Ngữ pháp</a><a class="btn sm ghost" href="#pron">🗣️ Phát âm</a><a class="btn sm ghost" href="#topics">🗂️ Chủ đề</a></div>`;
}
function rmTips() {
  const topics = Object.keys(DATA.rmit.models);
  RM.modelTopic ||= topics[0];
  const m = DATA.rmit.models[RM.modelTopic];
  return `<div class="card"><h3>Chiến lược phần Viết</h3><ul>${DATA.rmit.writingPlan.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
  <div class="card"><h3>Khung bài viết</h3><ol><li><b>Mở bài:</b> nêu chủ đề + ý kiến (1–2 câu).</li><li><b>Thân bài 1:</b> lý do 1 → giải thích → ví dụ cá nhân.</li><li><b>Thân bài 2:</b> lý do 2 hoặc mặt đối lập → giải thích → ví dụ.</li><li><b>Kết bài:</b> tóm lại ý kiến (không thêm ý mới).</li></ol></div>
  <div class="card"><h3>Lỗi người Việt hay mắc</h3><table class="tbl"><tr><th>Lỗi</th><th>Sai</th><th>Đúng</th></tr>${DATA.rmit.mistakes.map(x => `<tr><td>${esc(x[0])}</td><td>${esc(x[1])}</td><td>${esc(x[2])}</td></tr>`).join('')}</table></div>
  <div class="card"><h3>Bài mẫu theo cấp</h3><label>Chủ đề<select onchange="A.rmmodel(this.value)">${topics.map(t => `<option ${t === RM.modelTopic ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select></label>${m.map(x => `<details><summary><b>${esc(x.lv)}</b> – ${esc(x.note)}</summary><p>${esc(x.text)}</p><button class="ico" onclick="A.say(this.dataset.t,0.95)" data-t="${esc(x.text)}">🔊</button></details>`).join('')}<p class="muted">Mục đích: so sánh cách tổ chức và cấu trúc. Đừng học thuộc nguyên văn.</p></div>
  <div class="card"><h3>Mẫu câu khi nói</h3>${Object.entries(DATA.rmit.phrases).map(([k, v]) => `<p><b>${esc(k)}</b></p><div class="chips">${v.map(x => `<button class="chip" onclick="A.say(this.dataset.t)" data-t="${esc(x)}">🔊 ${esc(x)}</button>`).join('')}</div>`).join('')}</div>
  <div class="card"><h3>Chiến lược phần Nói</h3><ul><li><b>Answer + Reason + Example</b>: trả lời thẳng → vì sao → ví dụ thật của bạn.</li><li>Đừng im lặng: dùng cụm “câu giờ” thay vì “um…”.</li><li>Nghe câu hỏi cẩn thận; không hiểu thì hỏi lại lịch sự.</li><li>Nói tốc độ vừa phải, phát âm rõ âm cuối (-s, -ed).</li><li>Không cần “hay”; cần <b>rõ, đúng, đủ dài</b>.</li></ul></div>`;
}
function rmHist() {
  const r = rmState();
  if (RM.viewW != null) { const x = r.writings[RM.viewW]; return `<button class="btn ghost" onclick="A.rmview(null)">← Lịch sử</button><h3>${esc(x.topic)}</h3><p class="muted">${x.date} · ${x.words} từ · ước lượng cấp ${x.lvl}</p><div class="card pre">${esc(x.text)}</div>`; }
  return `<h3>Bài viết (${r.writings.length})</h3><div class="card">${r.writings.length ? r.writings.map((x, i) => `<div class="task"><span><b>${esc(x.topic)}</b><br><small class="muted">${x.date} · ${x.words} từ · ≈ cấp ${x.lvl}</small></span><span><button class="btn sm ghost" onclick="A.rmview(${i})">Xem</button> <button class="btn sm ghost" onclick="A.rmdel(${i})">Xóa</button></span></div>`).join('') : '<p class="muted">Chưa có bài nào.</p>'}</div>
  <h3>Buổi nói (${r.speaking.length})</h3><div class="card">${r.speaking.length ? r.speaking.map(x => `<div class="task"><span>${x.date} · ${x.q} câu · ${x.words} từ · ${x.wpm} từ/phút${x.avgRate ? ' · tự chấm TB ' + x.avgRate : ''}</span></div>`).join('') : '<p class="muted">Chưa có buổi nào.</p>'}</div>`;
}

/* ---------- động cơ phần Nói ---------- */
function rmSTick() {
  const s = RM.s; if (!s || s.done) return;
  const rem = Math.max(0, Math.round((s.end - Date.now()) / 1000)), el = $('#rmt'); if (el) el.textContent = fmtT(rem);
  if (s.state === 'prep' || s.state === 'answering') { const r2 = Math.max(0, Math.round((s.stepEnd - Date.now()) / 1000)), e2 = $('#rms'); if (e2) e2.textContent = fmtT(r2); if (r2 === 0) { if (s.state === 'prep') rmBeginAnswer(); else rmNextStep(); } }
  if (rem === 0) rmFinishSpeak();
}
function rmEndStep() {
  const s = RM.s; if (!s || s.state !== 'answering') return;
  const st = s.steps[s.i], secs = Math.max(1, Math.round((Date.now() - s.ansStart) / 1000)), cur = s.cur || {text: ''}, txt = (cur.text || '').trim();
  const ans = {q: st.kind === 'card' ? st.card.t : st.text, secs, transcript: txt, words: wcount(txt), fill: (txt.match(/\b(um+|uh+|er+|erm|you know|i mean)\b/gi) || []).length, url: ''};
  s.ans.push(ans);
  try { if (RMREC && RMREC.recog) { RMREC.recog.onend = null; RMREC.recog.stop(); RMREC.recog = null; } } catch (e) {}
  try { if (RMREC && RMREC.mr && RMREC.mr.state === 'recording') { RMREC.mr.onstop = () => { ans.url = URL.createObjectURL(new Blob(RMREC.chunks || [], {type: (RMREC.mr || {}).mimeType || 'audio/webm'})); }; RMREC.mr.stop(); } } catch (e) {}
  s.state = 'idle';
}
function rmNextStep() {
  const s = RM.s; if (!s) return;
  rmEndStep();
  s.i++;
  if (s.i >= s.steps.length || Date.now() >= s.end) return rmFinishSpeak();
  const st = s.steps[s.i], myI = s.i; s.state = 'asking'; rerender();
  say(st.text, 0.92, 1, () => { if (!RM.s || RM.s.i !== myI) return; if (st.kind === 'card') { RM.s.state = 'prep'; RM.s.stepEnd = Date.now() + 60000; rerender(); } else rmBeginAnswer(); }, s.accent);
}
function rmBeginAnswer() {
  const s = RM.s; if (!s) return; const st = s.steps[s.i];
  s.state = 'answering'; s.ansStart = Date.now(); s.stepEnd = Date.now() + st.secs * 1000; s.cur = {text: ''}; rerender();
  const stream = RMREC && RMREC.stream;
  try { if (stream && window.MediaRecorder) { RMREC.chunks = []; RMREC.mr = new MediaRecorder(stream); RMREC.mr.ondataavailable = e => RMREC.chunks.push(e.data); RMREC.mr.start(); } } catch (e) {}
  const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (Rec) {
    try {
      const rc = new Rec(); rc.lang = s.accent === 'GB' ? 'en-GB' : 'en-US'; rc.continuous = true; rc.interimResults = true;
      let fin = '';
      rc.onresult = e => { let interim = ''; for (let i = e.resultIndex; i < e.results.length; i++) { if (e.results[i].isFinal) fin += e.results[i][0].transcript + ' '; else interim += e.results[i][0].transcript; } if (RM.s && RM.s.cur) RM.s.cur.text = fin + interim; const el = $('#rtr'); if (el) el.textContent = fin + interim; };
      rc.onend = () => { if (RM.s && RM.s.state === 'answering' && RMREC && RMREC.recog === rc) { try { rc.start(); } catch (e) {} } };
      rc.onerror = () => {};
      RMREC.recog = rc; rc.start();
    } catch (e) {}
  }
}
function rmFinishSpeak() {
  const s = RM.s; if (!s || s.done) return;
  rmEndStep(); s.done = true; if (RMT) clearInterval(RMT); RMT = null;
  if (window.speechSynthesis) speechSynthesis.cancel();
  setTimeout(() => { try { if (RMREC && RMREC.stream) RMREC.stream.getTracks().forEach(t => t.stop()); } catch (e) {} }, 600);
  const tw = s.ans.reduce((a, x) => a + x.words, 0), ts = s.ans.reduce((a, x) => a + x.secs, 0);
  s.id = Date.now(); const r = rmState(); r.speaking.unshift({id: s.id, date: todayStr(), q: s.ans.length, words: tw, wpm: ts ? Math.round(tw / (ts / 60)) : 0}); if (r.speaking.length > 30) r.speaking.length = 30;
  save(); markDone('pron'); if (typeof addXP === 'function' && s.ans.length >= 5) addXP(20);
  rerender(); window.scrollTo(0, 0);
}

/* =====================  CHẤM ĐIỂM & SỬA LỖI BÀI VIẾT  ===================== */
const G_WEAK = {good: 'excellent / beneficial / valuable', bad: 'harmful / poor / negative', very: 'extremely / highly / particularly', thing: 'aspect / factor / issue', things: 'aspects / factors', nice: 'pleasant / enjoyable', big: 'significant / considerable', important: 'essential / crucial / vital', get: 'obtain / receive / become', make: 'create / produce / cause', think: 'believe / consider / argue', like: 'enjoy / appreciate', many: 'numerous / a large number of', help: 'assist / support', say: 'state / mention / claim', happy: 'delighted / satisfied', hard: 'challenging / demanding', 'a lot of': 'numerous / plenty of / a great deal of'};
const G_COMMON = {teh: 'the', recieve: 'receive', definately: 'definitely', wich: 'which', becuase: 'because', becouse: 'because', freind: 'friend', goverment: 'government', enviroment: 'environment', beleive: 'believe', occured: 'occurred', seperate: 'separate', tommorow: 'tomorrow', alot: 'a lot', thier: 'their', adress: 'address', untill: 'until', writting: 'writing', begining: 'beginning', sucess: 'success', necesary: 'necessary', diffrent: 'different', intresting: 'interesting', comunicate: 'communicate', experiance: 'experience', importent: 'important', knowlege: 'knowledge', mony: 'money', peaple: 'people', studing: 'studying', langauge: 'language', speach: 'speech', bussiness: 'business', accomodation: 'accommodation', allready: 'already', realy: 'really', truely: 'truly', peoples: 'people', informations: 'information', advices: 'advice', equipments: 'equipment', knowledges: 'knowledge', furnitures: 'furniture', childrens: 'children', mathematic: 'mathematics', moneys: 'money'};
const G_STOP = new Set('the a an and or but if of to in on at for with by from as is are was were be been being it its this that these those i you he she we they me him her us them my your his our their not no so do does did have has had will would can could should may might must there here than then also very more most just only into about over after before out up down'.split(' '));
const G_VI = {misspelling: 'Sai chính tả', grammar: 'Lỗi ngữ pháp', typographical: 'Viết hoa / dấu câu', style: 'Gợi ý văn phong', whitespace: 'Khoảng trắng', duplication: 'Lặp từ', uncategorized: 'Cần xem lại', local: 'Lỗi hay gặp'};
function gGloss(m) {
  const id = m.rule || '';
  const map = [[/BASE_FORM/, 'Sau trợ động từ (do/does/did/to/can…) dùng động từ nguyên mẫu.'], [/_VERB_AGR|SUBJECT_VERB|AGREEMENT|VBZ|HE_VERB/, 'Chủ ngữ và động từ không hòa hợp (he/she/it + V-s/es; I am, you are).'], [/MORFOLOGIK|SPELL/, 'Có thể sai chính tả — xem gợi ý.'], [/I_LOWERCASE/, 'Chữ “I” luôn viết hoa.'], [/UPPERCASE_SENTENCE_START/, 'Viết hoa chữ cái đầu câu.'], [/A_VS_AN|EN_A_VS_AN/, 'Dùng a/an đúng: “an” trước nguyên âm.'], [/COMMA/, 'Dấu phẩy: thường cần trước and/but khi nối hai mệnh đề đầy đủ.'], [/WORD_REPEAT/, 'Lặp từ liền nhau.'], [/PLURAL|NNS|MANY_NN/, 'Danh từ cần dạng số nhiều/số ít đúng sau many/much/a few…'], [/TENSE|VERB_FORM|PAST/, 'Kiểm tra thì và dạng động từ.'], [/ARTICLE|DT_|THE/, 'Kiểm tra mạo từ a/an/the.'], [/PREPOSITION|IN_ON|DEPEND/, 'Kiểm tra giới từ đi kèm.']];
  for (const [re, t] of map) if (re.test(id)) return t;
  return G_VI[m.type] ? G_VI[m.type] + '.' : '';
}
/* lỗi hay gặp của người Việt (có gợi ý sửa) */
function gLocalIssues(text) {
  const out = [], push = (off, len, msg, reps, rule) => out.push({off, len, msg, reps, type: 'local', rule: rule || 'LOCAL', src: 'local'});
  let m;
  const re1 = /\b[A-Za-z]+\b/g; while ((m = re1.exec(text))) { const k = m[0].toLowerCase(); if (G_COMMON[k] && !(k === 'peoples' && /people’s|people's/i.test(text.slice(m.index - 1, m.index + 8)))) push(m.index, m[0].length, 'Sai chính tả / sai dạng từ: “' + m[0] + '”.', [m[0][0] === m[0][0].toUpperCase() ? G_COMMON[k][0].toUpperCase() + G_COMMON[k].slice(1) : G_COMMON[k]], 'LOCAL_COMMON'); }
  const re2 = /\b(dont|cant|doesnt|didnt|wont|isnt|arent|im|ive|youre|thats|couldnt|wouldnt|shouldnt)\b/gi; const fixAp = {dont: "don't", cant: "can't", doesnt: "doesn't", didnt: "didn't", wont: "won't", isnt: "isn't", arent: "aren't", im: "I'm", ive: "I've", youre: "you're", thats: "that's", couldnt: "couldn't", wouldnt: "wouldn't", shouldnt: "shouldn't"};
  while ((m = re2.exec(text))) push(m.index, m[0].length, 'Thiếu dấu nháy đơn.', [fixAp[m[0].toLowerCase()]], 'LOCAL_APOS');
  const re3 = /\b(people|children|police)\s+(is|was|has)\b/gi; while ((m = re3.exec(text))) { const v = m[2].toLowerCase(), vi = m.index + m[0].length - m[2].length; push(vi, m[2].length, '“' + m[1] + '” là danh từ số nhiều → dùng ' + ({is: 'are', was: 'were', has: 'have'})[v] + '.', [({is: 'are', was: 'were', has: 'have'})[v]], 'LOCAL_PLURAL'); }
  const re4 = /\b(he|she|it)\s+(go|have|do|make|work|live|like|want|need|think|say|get|know|come|take|use|try|study|watch|play|love|help|give)\b/gi; const s3 = {go: 'goes', have: 'has', do: 'does', try: 'tries', study: 'studies'};
  while ((m = re4.exec(text))) { const v = m[2], vi = m.index + m[0].length - v.length, low = v.toLowerCase(); push(vi, v.length, 'Chủ ngữ ngôi 3 số ít: động từ cần -s/-es.', [s3[low] || v + 's'], 'LOCAL_SV'); }
  const re4b = /\b(I|we|they|you)\s+(likes|goes|has|does|makes|works|wants|needs|thinks|says|gets|knows|comes|takes|uses|tries|studies|watches|plays|loves|helps|gives|lives)\b/gi; const base = {likes: 'like', goes: 'go', has: 'have', does: 'do', makes: 'make', works: 'work', wants: 'want', needs: 'need', thinks: 'think', says: 'say', gets: 'get', knows: 'know', comes: 'come', takes: 'take', uses: 'use', tries: 'try', studies: 'study', watches: 'watch', plays: 'play', loves: 'love', helps: 'help', gives: 'give', lives: 'live'};
  while ((m = re4b.exec(text))) { const v = m[2], vi = m.index + m[0].length - v.length; push(vi, v.length, 'Với “' + m[1] + '” dùng động từ nguyên mẫu (không thêm -s).', [base[v.toLowerCase()]], 'LOCAL_SV2'); }
  const re5 = /\b(I|we|they|you)\s+(is|was)\b/g; while ((m = re5.exec(text))) { const v = m[2], vi = m.index + m[0].length - v.length, subj = m[1]; const rep = subj === 'I' ? (v === 'is' ? 'am' : 'was') : (v === 'is' ? 'are' : 'were'); push(vi, v.length, 'Sai động từ to be với “' + subj + '”.', [rep], 'LOCAL_BE'); }
  const re6 = /\b(a)\s+([aeiou]\w+)/gi; while ((m = re6.exec(text))) { if (/^(uni|use|eu|one|once|ubiq)/i.test(m[2])) continue; push(m.index, 1, 'Trước từ bắt đầu bằng nguyên âm dùng “an”.', ['an'], 'LOCAL_AN'); }
  const re7 = /\bmore\s+(better|easier|bigger|cheaper|faster|worse)\b/gi; while ((m = re7.exec(text))) push(m.index, m[0].length, 'So sánh hơn của tính từ ngắn không dùng “more”.', [m[1]], 'LOCAL_CMP');
  const re8 = /([.!?]\s+)([a-z])/g; while ((m = re8.exec(text))) push(m.index + m[1].length, 1, 'Viết hoa chữ cái đầu câu.', [m[2].toUpperCase()], 'LOCAL_CAP');
  const re9 = /\b(\w+)\s+\1\b/gi; while ((m = re9.exec(text))) if (!/^\d+$/.test(m[1]) && m[1].length > 1) push(m.index, m[0].length, 'Lặp từ liền nhau.', [m[1]], 'LOCAL_REPEAT');
  const re10 = /\bi\b(?!['’])/g; while ((m = re10.exec(text))) push(m.index, 1, 'Chữ “I” phải viết hoa.', ['I'], 'LOCAL_I');
  return out;
}
function gMergeIssues(local, lt) {
  const all = lt.slice(); const overl = (a, b) => a.off < b.off + b.len && b.off < a.off + a.len;
  local.forEach(l => { if (!all.some(x => overl(x, l))) all.push(l); });
  return all.sort((a, b) => a.off - b.off);
}
function gScores(text, kind, min, issues) {
  const a = analyzeWriting(text), nW = a.nW, clamp = (x, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, x));
  const hasGreet = /^\s*(subject:.*\n)?\s*(dear|hi|hello)\b/im.test(text), hasClose = /\b(regards|sincerely|best wishes|yours|thank you|thanks)\b/i.test(text), hasSubj = /^\s*subject:/im.test(text), hasReq = /\b(could you|would you|please|i would like|i’d like|i'd like)\b/i.test(text);
  const goal = Math.max(min || 60, 40);
  let content = clamp(nW / goal) * 6 + (a.paras >= 2 ? 1 : 0) + (kind === 'email' ? ((hasGreet ? 1 : 0) + (hasClose ? 1 : 0) + (hasReq ? 1 : 0)) : (a.paras >= 3 ? 2 : a.paras === 2 ? 1 : 0) + (/for example|for instance|such as/i.test(text) ? 1 : 0));
  const starts = text.match(/[^.!?\n]+[.!?]*/g) || [], firstWords = starts.map(s => (s.trim().split(/\s+/)[0] || '').toLowerCase()).filter(Boolean), variety = firstWords.length ? new Set(firstWords).size / firstWords.length : 0;
  let org = clamp(a.link.length / 5) * 5 + (a.paras >= 3 ? 3 : a.paras === 2 ? 2 : 0) + (variety > 0.65 ? 2 : variety > 0.45 ? 1 : 0);
  const counts = {}; a && text.toLowerCase().match(/[a-z’']+/g).forEach(w => { if (w.length > 3 && !G_STOP.has(w)) counts[w] = (counts[w] || 0) + 1; });
  const repeated = Object.entries(counts).filter(([w, c]) => c >= 4).sort((x, y) => y[1] - x[1]).slice(0, 5);
  let vocab = clamp((a.ttr / 100 - 0.45) / 0.35) * 5 + clamp(a.longR / 100 / 0.2) * 3 + 2 - Math.min(2, repeated.length * 0.7);
  const real = issues.filter(i => i.type !== 'style');
  const density = nW ? real.length / nW * 100 : 0;
  let gram = a.feats.filter(f => f[1]).length / 8 * 5 + Math.max(0, 5 - density * 0.6);
  if (kind === 'ielts1') { vocab += 1.5; gram += 1; }
  if (nW < 15) { content = Math.min(content, 2); org = Math.min(org, 2); vocab = Math.min(vocab, 3); gram = Math.min(gram, 3); }
  const cl = x => Math.round(clamp(x, 0, 10) * 10) / 10;
  const sc = {content: cl(content), org: cl(org), vocab: cl(vocab), gram: cl(gram)};
  const overall = cl((sc.content + sc.org + sc.vocab + sc.gram) / 4);
  let lvl = a.lvl; if (density > 8) lvl = Math.max(1, lvl - 1);
  return {a, sc, overall, lvl, repeated, density: Math.round(density * 10) / 10, hasGreet, hasClose, hasSubj, hasReq, variety, kind};
}
let GR = null;
function gFeedback(r, min) {
  const good = [], fix = [], a = r.a;
  if (a.nW >= (min || 60)) good.push('Đủ độ dài (' + a.nW + ' từ).'); else fix.push('Bài còn ngắn: ' + a.nW + '/' + (min || 60) + ' từ. Thêm lý do hoặc ví dụ cụ thể.');
  if (a.paras >= 3) good.push('Bố cục có nhiều đoạn rõ ràng.'); else fix.push('Chia bài thành ít nhất 3 đoạn (mở – thân – kết) để người đọc dễ theo dõi.');
  if (a.link.length >= 4) good.push('Dùng nhiều từ nối (' + a.link.slice(0, 4).join(', ') + '…).'); else fix.push('Thêm từ nối đa dạng: however, in addition, for example, as a result, although.');
  const miss = a.feats.filter(f => !f[1]).map(f => f[0]); if (miss.length <= 3) good.push('Cấu trúc ngữ pháp khá đa dạng.'); else fix.push('Thử thêm cấu trúc: ' + miss.slice(0, 3).join('; ') + '.');
  if (a.avg < 9 && a.nW > 30) fix.push('Câu khá ngắn (TB ' + a.avg + ' từ). Nối ý bằng because / although / which / and.'); else if (a.avg > 26) fix.push('Câu quá dài (TB ' + a.avg + ' từ). Tách thành 2 câu để rõ nghĩa.'); else if (a.nW > 30) good.push('Độ dài câu hợp lý (TB ' + a.avg + ' từ).');
  if (r.variety < 0.5 && a.nS >= 5) fix.push('Nhiều câu bắt đầu bằng cùng một từ. Thay đổi cách mở câu.');
  if (r.repeated.length) fix.push('Từ lặp nhiều: ' + r.repeated.map(([w, c]) => w + ' (' + c + ' lần)').join(', ') + '. Dùng từ đồng nghĩa.');
  if (r.kind === 'email') { if (!r.hasGreet) fix.push('Email thiếu lời chào (Dear …,).'); if (!r.hasClose) fix.push('Email thiếu câu kết/ chào cuối (Best regards,).'); if (!r.hasReq) fix.push('Chưa có câu đề nghị rõ ràng (Could you please…).'); if (r.hasGreet && r.hasClose && r.hasReq) good.push('Email có đủ lời chào, đề nghị và lời kết.'); }
  if (r.density <= 3 && a.nW > 30) good.push('Ít lỗi ngữ pháp/chính tả được phát hiện.'); else if (r.density > 6) fix.push('Mật độ lỗi khá cao (' + r.density + ' lỗi/100 từ). Sửa theo danh sách bên dưới rồi đọc lại.');
  return {good, fix};
}
function gWeakWords(text) {
  const out = [], low = text.toLowerCase();
  Object.keys(G_WEAK).forEach(w => { const n = (low.match(new RegExp('\\b' + w + '\\b', 'g')) || []).length; if (n >= 2 || (n >= 1 && w.includes(' '))) out.push([w, n, G_WEAK[w]]); });
  return out.slice(0, 6);
}
function gHighlight(text, issues) {
  let html = '', pos = 0;
  issues.forEach((i, idx) => { if (i.off < pos) return; html += esc(text.slice(pos, i.off)) + `<mark class="gm ${i.type === 'style' ? 'st' : ''}" title="${esc(i.msg)}">${esc(text.slice(i.off, i.off + i.len))}</mark>`; pos = i.off + i.len; });
  return html + esc(text.slice(pos));
}
function gApplyAll(text, issues) {
  let t = text, last = Infinity;
  issues.filter(i => i.reps && i.reps.length && i.type !== 'style').sort((a, b) => b.off - a.off).forEach(i => { if (i.off + i.len <= last) { t = t.slice(0, i.off) + i.reps[0] + t.slice(i.off + i.len); last = i.off; } });
  return t.replace(/(^|[.!?]\s+)([a-z])/g, (m, a, b) => a + b.toUpperCase());
}
function ieltsBandOf(sc, nW, min) { const b = x => Math.max(3.5, Math.min(9, Math.round((IELTS_OFF + x * IELTS_K) * 2) / 2)); const pen = (nW && min && nW < min) ? Math.min(3, (1 - nW / min) * 3.5) : 0; const c = {ta: Math.max(3.5, b(sc.content) - Math.round(pen * 2) / 2), cc: b(sc.org), lr: b(sc.vocab), gra: b(sc.gram)}; if (pen > 0) { c.cc = Math.min(c.cc, Math.max(4, c.ta + 1)); c.lr = Math.min(c.lr, Math.max(4, c.ta + 1.5)); c.gra = Math.min(c.gra, Math.max(4, c.ta + 1.5)); } const overall = Math.round((c.ta + c.cc + c.lr + c.gra) / 4 * 2) / 2; return {c, overall}; }
const IELTS_OFF = 1.2, IELTS_K = 0.62;
function gRender() {
  const g = GR; if (!g) return; const box = document.getElementById(g.boxId); if (!box) return;
  const r = gScores(g.text, g.kind, g.min, g.issues), fb = gFeedback(r, g.min), weak = gWeakWords(g.text), L = lvlText ? lvlText : null;
  const cefr = ['A1', 'A2', 'B1 thấp', 'B1 cao', 'B2', 'B2+/C1'][r.lvl - 1];
  const bar = (n, v) => `<div style="margin:6px 0">${n} <b>${v}/10</b><div class="pbar"><i style="width:${v * 10}%"></i></div></div>`;
  const cats = {}; g.issues.forEach(i => { const k = i.type; cats[k] = (cats[k] || 0) + 1; });
  const ltStatus = g.loading ? '<p class="muted">⏳ Đang kiểm tra bằng LanguageTool…</p>' : g.ltDone ? `<p class="muted">✅ Đã kiểm tra bằng LanguageTool (${g.ltCount} gợi ý) và bộ lỗi hay gặp của người Việt.</p>` : g.ltErr ? `<p class="muted">⚠️ Không gọi được LanguageTool (${esc(g.ltErr)}). Đang hiển thị kết quả từ bộ kiểm tra offline.</p>` : '';
  const ltBtn = g.ltDone || g.loading ? '' : (S.settings.ltConsent ? '<button class="btn sm" onclick="A.glt()">🔎 Kiểm tra lỗi sâu hơn (LanguageTool)</button>' : `<div class="card warn"><b>Kiểm tra lỗi sâu hơn bằng LanguageTool</b><br><small>Bài viết sẽ được <b>gửi đến máy chủ languagetool.org</b> (dịch vụ miễn phí của bên thứ ba, có giới hạn lượt dùng). Đừng gửi nếu bài chứa thông tin nhạy cảm (số tài khoản, địa chỉ, mật khẩu…).</small><div class="row"><label class="chk"><input type="checkbox" id="gconsent"> Nhớ lựa chọn, không hỏi lại</label><button class="btn sm" onclick="A.glt(true)">Đồng ý và kiểm tra</button></div></div>`);
  const issuesHTML = g.issues.length ? g.issues.map((i, k) => `<div class="gi"><span class="gtag ${i.type === 'style' ? 'st' : ''}">${esc(G_VI[i.type] || G_VI.uncategorized)}</span> <code>${esc(g.text.slice(Math.max(0, i.off - 18), i.off))}<mark class="gm">${esc(g.text.slice(i.off, i.off + i.len))}</mark>${esc(g.text.slice(i.off + i.len, i.off + i.len + 18))}</code><br><small>${esc(i.msg)}${gGloss(i) && i.src !== 'local' ? ' — <i>' + esc(gGloss(i)) + '</i>' : ''}</small>${i.reps && i.reps.length ? `<div class="row">${i.reps.slice(0, 4).map((x, j) => `<button class="btn sm ghost" ${g.taId ? `onclick="A.gfix(${k},${j})"` : 'disabled'}>→ ${esc(x) || '(xóa)'}</button>`).join('')}</div>` : ''}</div>`).join('') : '<p>🎉 Không phát hiện lỗi nào bằng các bộ kiểm tra hiện có. Hãy đọc lại một lần nữa để chắc chắn.</p>';
  const corrected = gApplyAll(g.text, g.issues);
  box.innerHTML = `<div class="card gradecard"><div class="row" style="justify-content:space-between"><h3 style="margin:0">📝 Kết quả chấm bài</h3><button class="btn sm ghost" onclick="A.gradeclose()">Đóng</button></div>
   <div class="center"><div class="gscore">${r.overall}<small>/10</small></div>${/^ielts/.test(g.kind) ? (() => { const ib = ieltsBandOf(r.sc, r.a.nW, g.min); return `<p><b>Band ước lượng: ${ib.overall.toFixed(1)}</b> ${ib.overall >= 6.5 ? '✅ đạt mục tiêu 6.5' : '(mục tiêu 6.5: còn ' + (6.5 - ib.overall).toFixed(1) + ')'}<br><small class="muted">Task ${g.kind === 'ielts1' ? 'Achievement' : 'Response'} ${ib.c.ta.toFixed(1)} · Coherence & Cohesion ${ib.c.cc.toFixed(1)} · Lexical Resource ${ib.c.lr.toFixed(1)} · Grammar ${ib.c.gra.toFixed(1)}</small></p>`; })() : ''}<p class="muted">Cấp ước lượng: <b>${cefr}</b> · ${r.a.nW} từ · ${g.issues.length} gợi ý sửa (${r.density}/100 từ)</p></div>
   ${bar('Nội dung & hoàn thành yêu cầu', r.sc.content)}${bar('Bố cục & liên kết', r.sc.org)}${bar('Từ vựng', r.sc.vocab)}${bar('Ngữ pháp & chính xác', r.sc.gram)}
   <p class="muted">⚠️ Điểm do máy ước lượng từ số liệu bề mặt và các bộ kiểm tra lỗi; không thay thế giáo viên. Dùng để theo dõi tiến bộ và biết chỗ cần sửa.</p>
   <div class="grid two"><div class="card"><h4>👍 Điểm tốt</h4>${fb.good.length ? '<ul>' + fb.good.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '<p class="muted">Hãy hoàn thiện thêm để có điểm mạnh nổi bật.</p>'}</div><div class="card"><h4>🔧 Cần cải thiện</h4>${fb.fix.length ? '<ul>' + fb.fix.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '<p>Rất tốt!</p>'}</div></div>
   ${weak.length ? `<div class="card"><h4>✨ Nâng cấp từ vựng</h4><ul>${weak.map(w => `<li><b>${esc(w[0])}</b> (${w[1]} lần) → ${esc(w[2])}</li>`).join('')}</ul></div>` : ''}
   ${ltStatus}${ltBtn}
   <h4>Chi tiết lỗi (${g.issues.length})</h4>${issuesHTML}
   <div class="row">${g.taId && g.issues.some(i => i.reps && i.reps.length && i.type !== 'style') ? '<button class="btn" onclick="A.gall()">✅ Áp dụng tất cả gợi ý chính (trừ văn phong)</button>' : ''}${g.undo != null ? '<button class="btn ghost" onclick="A.gundo()">↩ Hoàn tác</button>' : ''}</div>
   <h4>Bài của bạn (đánh dấu lỗi)</h4><div class="pre gtext">${gHighlight(g.text, g.issues)}</div>
   ${!g.taId && corrected !== g.text ? `<h4>Bản đã sửa (gợi ý)</h4><div class="pre gtext">${esc(corrected)}</div><div class="row"><button class="btn sm ghost" onclick="navigator.clipboard&&navigator.clipboard.writeText(GR_corrected()).then(()=>toast('Đã sao chép'))">Sao chép bản đã sửa</button></div>` : ''}</div>`;
}
const GR_corrected = () => gApplyAll(GR.text, GR.issues);
async function gRunLT() {
  const g = GR; if (!g) return; g.loading = true; g.ltErr = ''; gRender();
  try {
    const body = new URLSearchParams({text: g.text, language: accent() === 'GB' ? 'en-GB' : 'en-US'});
    const ctl = new AbortController(), to = setTimeout(() => ctl.abort(), 20000);
    const res = await fetch('https://api.languagetool.org/v2/check', {method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json'}, body, signal: ctl.signal}); clearTimeout(to);
    if (!res.ok) throw new Error(res.status === 429 ? 'quá nhiều lượt, thử lại sau 1 phút' : 'HTTP ' + res.status);
    const d = await res.json();
    g.lt = d.matches.map(m => ({off: m.offset, len: m.length, msg: m.message, reps: (m.replacements || []).slice(0, 4).map(x => x.value), type: m.rule && m.rule.issueType ? (m.rule.issueType === 'misspelling' ? 'misspelling' : m.rule.issueType) : 'uncategorized', rule: m.rule ? m.rule.id : '', src: 'lt', cat: m.rule && m.rule.category ? m.rule.category.id : ''}));
    g.lt.forEach(x => { if (x.cat === 'STYLE' || x.cat === 'REDUNDANCY' || x.cat === 'PLAIN_ENGLISH' || x.cat === 'WIKIPEDIA') x.type = 'style'; if (x.cat === 'CASING' || x.cat === 'PUNCTUATION' || x.cat === 'TYPOGRAPHY') x.type = 'typographical'; });
    g.ltCount = g.lt.length; g.ltDone = true; g.issues = gMergeIssues(gLocalIssues(g.text), g.lt);
  } catch (e) { g.ltErr = e.name === 'AbortError' ? 'hết thời gian chờ' : (e.message || 'lỗi mạng'); }
  g.loading = false; gRender();
}

/* =====================  VIDEO NGƯỜI THẬT  ===================== */
let VD = {g: 'all'};
views.video = {render() {
  const chips = ['all', ...videoGroups().map(v => v.g)].map(g => `<button class="${VD.g === g ? 'on' : ''}" onclick="A.vgroup(this.dataset.g)" data-g="${esc(g)}">${g === 'all' ? 'Tất cả' : esc(g)}</button>`).join('');
  return `<h1>🎬 Video người bản ngữ</h1><p class="muted">Nghe người thật nói — tự nhiên hơn giọng máy. Video nhúng từ YouTube (cần có mạng).</p>
  <div class="card"><b>Mẹo xem:</b> bấm <b>CC</b> để bật phụ đề · bấm ⚙ → <b>Tốc độ phát</b> chọn 0.75× nếu nhanh · xem lại và nhại theo (shadowing) từng câu.</div>
  <div class="tabs wrap">${chips}</div>
  ${videoGroups().filter(g => VD.g === 'all' || g.g === VD.g).map(g => `<h2>${esc(g.g)}</h2><div class="grid two">${g.items.map(v => `<div class="card vcard"><div class="vthumb" id="v_${v[0]}" style="background-image:url(https://i.ytimg.com/vi/${v[0]}/hqdefault.jpg)" onclick="A.vplay('${v[0]}')"><span>▶</span></div><b>${esc(v[1])}</b><small class="muted">${esc(v[2])} · ${esc(v[3])} · ${esc(v[4])}</small><a href="https://www.youtube.com/watch?v=${v[0]}" target="_blank" rel="noopener"><small>Mở trên YouTube ↗</small></a></div>`).join('')}</div>`).join('')}
  <p class="muted">Các kênh trên là kênh dạy tiếng Anh/chuyên môn có người dẫn thật; mình chỉ kiểm tra video còn tồn tại và cho phép nhúng, chưa nghe hết từng video. Video có thể bị chủ kênh gỡ về sau. Cũng xem thêm: tab 🎧 Nghe.</p>`;
}};

/* =====================  CÂU CÓ GHI ÂM NGƯỜI THẬT (Tatoeba, CC BY)  ===================== */
const HS_AUDIO = id => 'https://tatoeba.org/en/audio/download/' + id;
let HSX = null, HS = {topic: 'all', len: 'all', mode: 'dict', i: 0, list: null, checked: false, revealed: false, done: 0};
const hsOn = () => typeof DATA.hs !== 'undefined' && DATA.hs.length > 0;
const hsWords = s => s.toLowerCase().replace(/[’]/g, "'").match(/[a-z']+/g) || [];
function hsIndex() {
  if (HSX) return HSX;
  const topicOf = {}, set = (w, t) => { w = String(w).toLowerCase(); if (!(w in topicOf)) topicOf[w] = t; };
  DATA.vocab.forEach(v => set(v.w, v.cat === 'fin' ? 'Tài chính & kế toán' : 'Học thuật & IELTS'));
  const tn = {fin: 'Tài chính & kế toán', obj: 'Đời sống & giao tiếp', talk: 'Đời sống & giao tiếp', travel: 'Du lịch', design: 'Nghệ thuật & thiết kế', art: 'Nghệ thuật & thiết kế', fashion: 'Thời trang', sport: 'Thể thao', health: 'Sức khỏe'};
  DATA.topics.forEach(t => t.units.forEach(u => u.w.forEach(x => set(x[0], tn[t.id] || 'Đời sống & giao tiếp'))));
  DATA.units.forEach(u => u.vocab.forEach(v => set(v[0], 'Đời sống & giao tiếp')));
  const byWord = {}, meta = DATA.hs.map((s, i) => { const tags = s[4].split('|'); tags.forEach(w => (byWord[w] ||= []).push(i)); let topic = 'Đời sống & giao tiếp'; for (const w of tags) { if (topicOf[w]) { topic = topicOf[w]; break; } } const n = s[0].split(/\s+/).length; return {topic, len: n <= 7 ? 'short' : n <= 12 ? 'mid' : 'long', n}; });
  return (HSX = {byWord, meta, topics: [...new Set(meta.map(m => m.topic))].sort()});
}
function hsList() {
  const x = hsIndex(); let idx = DATA.hs.map((_, i) => i).filter(i => (HS.topic === 'all' ? !(ieltsMode() && x.meta[i].topic === 'Tài chính & kế toán') : x.meta[i].topic === HS.topic) && (HS.len === 'all' || x.meta[i].len === HS.len));
  if (HS.list && HS.list.key === HS.topic + '|' + HS.len) return HS.list.idx;
  for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
  HS.list = {key: HS.topic + '|' + HS.len, idx}; HS.i = 0; return idx;
}
let hsAudio = null;
function hsPlay(i) {
  const s = DATA.hs[i]; if (!s) return;
  if (window.speechSynthesis) speechSynthesis.cancel(); if (humanAudio) { try { humanAudio.pause(); } catch (e) {} } if (hsAudio) { try { hsAudio.pause(); } catch (e) {} }
  const a = new Audio(HS_AUDIO(s[2])); a.playbackRate = Math.max(0.6, Math.min(1, speedF())); hsAudio = a;
  a.onerror = () => { toast('Không tải được âm thanh (cần có mạng). Thử câu khác.'); };
  a.play().catch(() => toast('Không phát được âm thanh. Kiểm tra mạng/âm lượng.'));
}
function diffWordsHTML(target, typed) {
  const a = norm(target), b = norm(typed), m = a.length, n = b.length, dp = Array.from({length: m + 1}, () => Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) for (let j = n - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  let i = 0, j = 0, out = []; while (i < m && j < n) { if (a[i] === b[j]) { out.push(`<span class="ok">${esc(b[j])}</span>`); i++; j++; } else if (dp[i + 1][j] >= dp[i][j + 1]) { out.push(`<span class="miss">[${esc(a[i])}]</span>`); i++; } else { out.push(`<span class="no">${esc(b[j])}</span>`); j++; } }
  while (i < m) out.push(`<span class="miss">[${esc(a[i++])}]</span>`); while (j < n) out.push(`<span class="no">${esc(b[j++])}</span>`);
  return {html: out.join(' '), pct: m ? Math.round(dp[0][0] / m * 100) : 0};
}
const hsCredit = s => `<small class="muted">🎙️ Giọng: <b>${esc(s[3] || 'tình nguyện viên')}</b> · Nguồn: <a href="https://tatoeba.org/en/sentences/show/${s[5] || ''}" target="_blank" rel="noopener">Tatoeba.org</a> (CC BY)</small>`;
function hsBlock() {
  if (!hsOn()) return '';
  const x = hsIndex(), idx = hsList(), cur = idx[HS.i % Math.max(1, idx.length)], s = DATA.hs[cur];
  const modes = [['dict', '✏️ Chép chính tả'], ['shadow', '🗣️ Nhại theo'], ['guess', '🧠 Nghe đoán nghĩa']].map(m => `<button class="${HS.mode === m[0] ? 'on' : ''}" onclick="A.hmode('${m[0]}')">${m[1]}</button>`).join('');
  const sel = `<div class="row"><label>Chủ đề <select onchange="A.hfilter('topic',this.value)"><option value="all">Tất cả</option>${x.topics.filter(t => !(ieltsMode() && t === 'Tài chính & kế toán')).map(t => `<option ${HS.topic === t ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select></label><label>Độ dài <select onchange="A.hfilter('len',this.value)">${[['all', 'Tất cả'], ['short', 'Ngắn (≤7 từ)'], ['mid', 'Vừa (8–12)'], ['long', 'Dài (13+)']].map(o => `<option value="${o[0]}" ${HS.len === o[0] ? 'selected' : ''}>${o[1]}</option>`).join('')}</select></label></div>`;
  if (!idx.length) return `<div class="card"><h3>🎙️ Câu có người thật đọc</h3>${sel}<p class="muted">Chưa có câu nào cho bộ lọc này.</p></div>`;
  let body = '';
  if (HS.mode === 'dict') body = `<p class="muted">Nghe người thật đọc, gõ lại từng từ. Nghe tối đa bao nhiêu lần tùy bạn.</p><div class="row"><button class="btn sm" onclick="A.hplay(${cur})">▶ Nghe</button><button class="btn sm ghost" onclick="A.hrate()">🐢 Tốc độ ${Math.max(0.6, Math.min(1, speedF())).toFixed(1)}×</button></div><textarea id="hdic" rows="2" placeholder="Gõ những gì bạn nghe được…" ${HS.checked ? 'disabled' : ''}></textarea><div class="row">${HS.checked ? '' : '<button class="btn" onclick="A.hcheck()">Kiểm tra</button>'}<button class="btn ghost" onclick="A.hnext()">Câu tiếp →</button></div><div id="hres" class="res"></div>`;
  else if (HS.mode === 'shadow') body = `<p class="big">${esc(s[0])}</p>${s[1] ? `<p class="muted">${esc(s[1])}</p>` : ''}<div class="row"><button class="btn sm" onclick="A.hplay(${cur})">▶ Nghe người thật</button><button class="btn sm ghost" onclick="A.mic(DATA.hs[${cur}][0],'hmic')">🎙️ Tôi nói thử</button><button class="btn ghost sm" onclick="A.hnext()">Câu tiếp →</button></div><div id="hmic" class="res"></div>`;
  else body = `<p class="muted">Chỉ nghe, đoán nghĩa, rồi mới xem đáp án.</p><div class="row"><button class="btn sm" onclick="A.hplay(${cur})">▶ Nghe</button><button class="btn sm ghost" onclick="A.hreveal()">${HS.revealed ? 'Ẩn' : 'Xem câu & nghĩa'}</button><button class="btn sm ghost" onclick="A.hnext()">Câu tiếp →</button></div>${HS.revealed ? `<p class="big">${esc(s[0])}</p>${s[1] ? `<p>${esc(s[1])}</p>` : '<p class="muted">(chưa có bản dịch tiếng Việt cho câu này)</p>'}` : ''}`;
  return `<div class="card"><h3>🎙️ Câu có người thật đọc <small class="muted">(${DATA.hs.length} câu · ${x.topics.length} chủ đề)</small></h3><div class="tabs wrap">${modes}</div>${sel}<small class="muted">Câu ${(HS.i % idx.length) + 1}/${idx.length}</small>${body}<div>${hsCredit(s)}</div></div>`;
}
function hsFor(word, max = 3) { if (!hsOn()) return []; const x = hsIndex(), w = String(word).toLowerCase(); return (x.byWord[w] || []).slice().sort((a, b) => x.meta[a].n - x.meta[b].n).slice(0, max); }
function hsWordBlock(word) {
  const l = hsFor(word, 3); if (!l.length) return '';
  return `<div class="hsw"><small class="muted">🎙️ Câu người thật chứa “${esc(word)}”:</small>${l.map(i => `<div class="hsrow"><button class="ico" onclick="A.hplay(${i})">▶</button> <span>${esc(DATA.hs[i][0])}</span>${DATA.hs[i][1] ? ` <small class="muted">— ${esc(DATA.hs[i][1])}</small>` : ''}</div>`).join('')}</div>`;
}
function hsUnitBlock(u) {
  if (!hsOn()) return '';
  const seen = new Set(), rows = [];
  u.vocab.forEach(v => hsFor(v[0], 2).forEach(i => { if (!seen.has(i) && rows.length < 6) { seen.add(i); rows.push([v[0], i]); } }));
  if (!rows.length) return '';
  return `<div class="card"><h3>🎙️ Nghe câu người thật theo từ vựng bài này</h3><p class="muted">Giọng tình nguyện viên thật (Tatoeba). Nghe 2–3 lần rồi xem chữ.</p>${rows.map(([w, i]) => `<div class="hsrow"><button class="ico" onclick="A.hplay(${i})">▶</button> <b>${esc(w)}</b> <span class="${PT.showText ? '' : 'blur'}" onclick="this.classList.remove('blur')">${esc(DATA.hs[i][0])}${DATA.hs[i][1] ? ' <small class="muted">— ' + esc(DATA.hs[i][1]) + '</small>' : ''}</span></div>`).join('')}<small class="muted">Giấy phép: CC BY – ghi nguồn Tatoeba.org và người đọc.</small></div>`;
}

/* kệ video người thật theo cấp (dùng trong tab Nghe) */
let VSH = 'A';
function videoShelf() {
  const items = videoGroups().flatMap(g => g.items.map(v => ({g: g.g, v})));
  const pick = {A: v => /^A/.test(v[4]), B1: v => /^B1/.test(v[4]), B2: v => /^B2|^C/.test(v[4])}[VSH];
  const list = items.filter(x => pick(x.v)).slice(0, 8);
  const chips = [['A', 'A1–A2'], ['B1', 'B1'], ['B2', 'B2+']].map(c => `<button class="${VSH === c[0] ? 'on' : ''}" onclick="A.vshelf('${c[0]}')">${c[1]}</button>`).join('');
  return `<div class="card"><h3>🎬 Xem & nghe người thật theo cấp</h3><div class="tabs">${chips}</div><div class="grid two">${list.map(x => `<div class="vcard"><div class="vthumb" id="v_${x.v[0]}" style="background-image:url(https://i.ytimg.com/vi/${x.v[0]}/hqdefault.jpg)" onclick="A.vplay('${x.v[0]}')"><span>▶</span></div><b>${esc(x.v[1])}</b><small class="muted">${esc(x.v[2])} · ${esc(x.v[4])}</small></div>`).join('')}</div><p class="muted">Bật CC để có phụ đề; ⚙ → Tốc độ phát 0.75×. Xem thêm ở tab <a href="#video">🎬 Video người thật</a>.</p></div>`;
}

/* =====================  IELTS 6.5 – TRUNG TÂM LUYỆN THI  ===================== */
const ieltsMode = () => S.settings.ielts !== false;
const dictArr = () => (ieltsMode() && DATA.dictationIELTS) ? DATA.dictationIELTS : DATA.dictation;
const shadowArr = () => (ieltsMode() && DATA.shadowIELTS) ? DATA.shadowIELTS : DATA.shadow;
const writingList = () => ieltsMode() ? DATA.writing.filter(w => !/Email công việc|Phỏng vấn/.test(w.cat)) : DATA.writing;
const videoGroups = () => DATA.videos.filter(g => !(ieltsMode() && /Tài chính|công sở/.test(g.g)));
function i65State() { const s = (S.i65 ||= {}); s.plan ||= {}; return s; }
let IH = {tab: 'plan', t2: 0, t1: 0};
function vcards(groupRe, max = 6) {
  const items = DATA.videos.filter(g => groupRe.test(g.g)).flatMap(g => g.items).slice(0, max);
  return `<div class="grid two">${items.map(v => `<div class="vcard"><div class="vthumb" id="v_${v[0]}" style="background-image:url(https://i.ytimg.com/vi/${v[0]}/hqdefault.jpg)" onclick="A.vplay('${v[0]}')"><span>▶</span></div><b>${esc(v[1])}</b><small class="muted">${esc(v[2])} · ${esc(v[3])}</small></div>`).join('')}</div>`;
}
function ieltsHomeCard() {
  if (!ieltsMode() || typeof DATA.ielts65 === 'undefined') return '';
  const st = i65State(); let wk = 0; DATA.ielts65.plan.forEach((w, wi) => { if (!w.tasks.every((_, ti) => st.plan['w' + wi + 't' + ti])) { if (!wk && wk !== 0) wk = wi; } });
  const cur = DATA.ielts65.plan.findIndex((w, wi) => !w.tasks.every((_, ti) => st.plan['w' + wi + 't' + ti]));
  if (cur < 0) return `<div class="card"><h3>🎯 IELTS 6.5</h3><p>🎉 Bạn đã hoàn thành kế hoạch 8 tuần! Hãy thi thử thêm và ôn các lỗi sai.</p><a class="btn sm" href="#i65">Mở trung tâm IELTS</a></div>`;
  const w = DATA.ielts65.plan[cur], ti = w.tasks.findIndex((_, i) => !st.plan['w' + cur + 't' + i]);
  const done = w.tasks.filter((_, i) => st.plan['w' + cur + 't' + i]).length;
  return `<div class="card"><h3>🎯 IELTS 6.5 – ${esc(w.w)}</h3><p class="muted">Tiến độ tuần: ${done}/${w.tasks.length}</p><p><b>Việc tiếp theo:</b> ${esc(w.tasks[ti])}</p><a class="btn sm" href="#i65">Mở kế hoạch IELTS 6.5 →</a></div>`;
}
views.i65 = {render() {
  const D = DATA.ielts65, tabs = [['plan', '📅 Kế hoạch 8 tuần'], ['vocab', '🃏 Từ vựng'], ['listen', '🎧 Listening'], ['read', '📖 Reading'], ['write', '✍️ Writing'], ['speak', '🗣️ Speaking'], ['tips', '💡 Mẹo & band']].map(t => `<button class="${IH.tab === t[0] ? 'on' : ''}" onclick="A.i65tab('${t[0]}')">${t[1]}</button>`).join('');
  const st = i65State();
  const totalW = DATA.topics.find(t => t.id === 'ielts').units.reduce((a, u) => a + u.w.length, 0);
  let body = '';
  if (IH.tab === 'plan') body = `<div class="card"><h3>Mục tiêu: IELTS 6.5 (Academic)</h3><p class="muted">Kế hoạch 8 tuần, khoảng 60–90 phút mỗi ngày. Tick từng việc khi xong. Mọi nội dung trong app đã được chọn lọc theo mục tiêu này.</p><label class="chk"><input type="checkbox" ${ieltsMode() ? 'checked' : ''} onchange="A.ieltsMode(this.checked)"> <b>Chế độ IELTS</b> (ẩn từ vựng/bài nghe/video tài chính – kế toán)</label></div>
    ${D.plan.map((w, wi) => { const done = w.tasks.filter((_, ti) => st.plan['w' + wi + 't' + ti]).length; return `<div class="card"><h3>${esc(w.w)} <small class="muted">· ${done}/${w.tasks.length}</small></h3><p class="muted">Mục tiêu: ${esc(w.goal)}</p><div class="pbar"><i style="width:${Math.round(done / w.tasks.length * 100)}%"></i></div>${w.tasks.map((t, ti) => `<label class="chk" style="margin:6px 0"><input type="checkbox" ${st.plan['w' + wi + 't' + ti] ? 'checked' : ''} onchange="A.i65plan(${wi},${ti},this.checked)"> <span>${esc(t)}</span></label>`).join('')}</div>`; }).join('')}`;
  if (IH.tab === 'vocab') body = `<div class="card"><h3>16 chủ đề · ${totalW} từ vựng IELTS</h3><p class="muted">Mỗi chủ đề có từ vựng (phiên âm, nghĩa, ví dụ), mẫu câu hay dùng và <b>hội thoại Speaking mẫu</b> (giám khảo hỏi – thí sinh trả lời band 6.5–7), cùng quiz. Nút 🔊 từ đơn phát bản ghi người thật khi có.</p><div class="row"><button class="btn" onclick="A.i65addall()">＋ Thêm cả ${totalW} từ vào thẻ ôn (Leitner)</button></div></div>
    <div class="grid two">${DATA.topics.find(t => t.id === 'ielts').units.map(u => `<a class="card link" href="#topics" onclick="A.i65open('${u.id}')"><h3>${esc(u.title)}</h3><small class="muted">${u.w.length} từ · ${u.p.length} mẫu câu · ${u.d.length} câu hội thoại</small></a>`).join('')}</div>`;
  if (IH.tab === 'listen') body = `<div class="card"><h3>Cấu trúc Listening (30 phút, 40 câu)</h3>${D.listenGuide.map(g => `<p><b>${esc(g[0])}</b><br><small class="muted">${esc(g[1])}</small></p>`).join('')}</div>
    <div class="card"><h3>Mẹo làm bài</h3><ul>${D.listenTips.map(t => `<li>${esc(t)}</li>`).join('')}</ul></div>
    <div class="card"><h3>🎬 Đề luyện nghe (giọng người thật)</h3>${vcards(/Listening/, 4)}<p class="muted">Làm bài ở chế độ thi: chỉ nghe 1 lần, ghi đáp án rồi đối chiếu cuối video.</p></div>
    <div class="card"><h3>🎙️ Luyện nghe từng câu</h3><p class="muted">Chép chính tả câu học thuật bằng <b>giọng người thật</b>, hoặc bài chép chính tả IELTS (giọng máy) ở tab Nghe.</p><a class="btn" href="#listen">Mở tab Nghe</a></div>`;
  if (IH.tab === 'read') { const ps = DATA.ieltsReading.filter(r => /^ir/.test(r.id)); body = `<div class="card"><h3>Reading Academic (60 phút, 3 bài, 40 câu)</h3><p class="muted">Mục tiêu 6.5 ≈ 27/40 câu. Mỗi bài tối đa 20 phút. Dạng câu: True/False/Not Given, trắc nghiệm, nối tiêu đề, điền từ.</p>
    <ul><li><b>TRUE</b>: văn bản nói đúng điều đó. <b>FALSE</b>: văn bản nói ngược lại. <b>NOT GIVEN</b>: không có thông tin để kết luận.</li><li>Đọc câu hỏi trước, tìm từ khóa/đồng nghĩa trong bài, đừng dùng kiến thức bên ngoài.</li><li>Đừng dành quá 1 phút 30 giây cho một câu; đánh dấu và quay lại.</li></ul></div>
    <h3>Bài luyện trong app</h3><div class="grid two">${ps.map(r => `<a class="card link" href="#ielts" onclick="A.i65read('${r.id}')"><h3>${esc(r.title.replace('IELTS Reading · ', ''))}</h3><small>${r.qs.length} câu · ${r.mins} phút${S.reading[r.id] != null ? ' · gần nhất ' + S.reading[r.id] : ''}</small></a>`).join('')}</div>
    <div class="card"><h3>🎬 Chiến lược Reading</h3>${vcards(/Reading/, 4)}</div>`; }
  if (IH.tab === 'write') {
    const t2 = D.t2models[IH.t2 % D.t2models.length], t1ids = Object.keys(D.t1models), t1id = t1ids[IH.t1 % t1ids.length], t1 = DATA.ieltsTask1.find(x => x.id === t1id);
    body = `<div class="card"><h3>Writing (60 phút)</h3><p class="muted">Task 1: ≥150 từ, 20 phút · Task 2: ≥250 từ, 40 phút (Task 2 chiếm 2/3 điểm Writing). Bấm <b>📝 Chấm điểm & sửa lỗi</b> trong trình soạn để nhận <b>band ước lượng</b> và danh sách lỗi.</p></div>
    <div class="grid two"><div class="card"><h3>Task 1 – cách làm</h3><ul>${D.t1tips.map(t => `<li>${esc(t)}</li>`).join('')}</ul></div><div class="card"><h3>Task 2 – cách làm</h3><ul>${D.t2tips.map(t => `<li>${esc(t)}</li>`).join('')}</ul></div></div>
    <div class="card"><h3>Bài mẫu Task 2 (band 6.5–7)</h3><div class="tabs wrap">${D.t2models.map((m, i) => `<button class="${i === IH.t2 % D.t2models.length ? 'on' : ''}" onclick="A.i65t2(${i})">${esc(m.type)}</button>`).join('')}</div><p><b>Đề:</b> ${esc(t2.q)}</p><div class="pre">${esc(t2.text)}</div><div class="row"><button class="btn sm ghost" onclick="A.say(this.dataset.t,0.95)" data-t="${esc(t2.text)}">🔊 Nghe (giọng máy)</button><button class="btn sm" onclick="A.i65write2('${esc(t2.q).replace(/'/g, '&#39;')}')">✍️ Viết đề này</button></div><p class="muted">Số từ: ${wcount(t2.text)} · So sánh bố cục, từ nối và ví dụ với bài của bạn. Đừng học thuộc nguyên văn.</p></div>
    <div class="card"><h3>Bài mẫu Task 1</h3><div class="tabs wrap">${t1ids.map((id, i) => `<button class="${i === IH.t1 % t1ids.length ? 'on' : ''}" onclick="A.i65t1(${i})">${esc(DATA.ieltsTask1.find(x => x.id === id).title.split(':')[0])} ${i + 1}</button>`).join('')}</div><p><b>${esc(t1.title)}</b></p><p class="muted">${esc(t1.prompt)}</p><table class="tbl"><tr><th></th>${t1.cols.map(c => `<th>${c}</th>`).join('')}</tr>${t1.rows.map(r => `<tr><td>${r[0]}</td>${r.slice(1).map(v => `<td>${v}</td>`).join('')}</tr>`).join('')}</table><div class="pre">${esc(D.t1models[t1id])}</div><div class="row"><button class="btn sm" onclick="A.wielts('${t1id}',1)">✍️ Viết đề này</button></div></div>
    <div class="card"><h3>Tất cả đề luyện</h3><p class="muted">Task 1: ${DATA.ieltsTask1.length} đề · Task 2: ${DATA.ieltsTask2.length} đề.</p><a class="btn" href="#ielts" onclick="A.itab('writing')">Mở danh sách đề Writing</a></div>
    <div class="card"><h3>🎬 Video Writing</h3>${vcards(/Writing/, 6)}</div>`;
  }
  if (IH.tab === 'speak') body = `<div class="card"><h3>Speaking (11–14 phút)</h3><ul><li><b>Part 1 (4–5′):</b> câu hỏi quen thuộc (học tập, quê hương, sở thích). Trả lời 2–3 câu: ý chính + lý do + ví dụ ngắn.</li><li><b>Part 2 (3–4′):</b> thẻ đề, 1 phút chuẩn bị, nói 1–2 phút. Dùng dàn ý từ các gạch đầu dòng.</li><li><b>Part 3 (4–5′):</b> thảo luận trừu tượng; nêu ý kiến, so sánh, dự đoán, nêu lý do.</li></ul><div class="row"><button class="btn" onclick="A.i65mock()">▶ Thi thử Speaking (theo format IELTS)</button><a class="btn ghost" href="#ielts" onclick="A.itab('speaking')">Luyện từng Part</a></div></div>
    <div class="card"><h3>Bài mẫu Part 2 (band 6.5–7)</h3>${D.speakModels.map(m => `<details><summary><b>${esc(m.card)}</b></summary><p>${esc(m.text)}</p><button class="ico" onclick="A.say(this.dataset.t,0.95)" data-t="${esc(m.text)}">🔊 (giọng máy)</button></details>`).join('')}</div>
    <div class="card"><h3>Mẫu câu & câu giờ</h3>${Object.entries(DATA.rmit.phrases).map(([k, v]) => `<p><b>${esc(k)}</b></p><div class="chips">${v.map(x => `<button class="chip" onclick="A.say(this.dataset.t)" data-t="${esc(x)}">🔊 ${esc(x)}</button>`).join('')}</div>`).join('')}</div>
    <div class="card"><h3>🎬 Video Speaking</h3>${vcards(/Speaking/, 4)}<p class="muted">Thêm: nhóm “IELTS Speaking” trong tab 🎬 Video (đề đầy đủ Part 1–3).</p></div>`;
  if (IH.tab === 'tips') body = `<div class="card"><h3>Band 6.5 nghĩa là gì?</h3>${D.bands.map(b => `<p><b>${esc(b[0])}:</b> ${esc(b[1])}</p>`).join('')}</div>
    <div class="card"><h3>Lỗi người Việt hay mắc</h3><table class="tbl"><tr><th>Lỗi</th><th>Sai</th><th>Đúng</th></tr>${DATA.rmit.mistakes.map(x => `<tr><td>${esc(x[0])}</td><td>${esc(x[1])}</td><td>${esc(x[2])}</td></tr>`).join('')}</table></div>
    <div class="card"><h3>Chiến lược học hiệu quả</h3><ul><li>Học từ theo <b>chủ đề</b> và theo cụm (collocation), không học từ rời rạc.</li><li>Mỗi ngày: 15′ ôn thẻ + 20′ kỹ năng yếu nhất + 20′ kỹ năng mạnh.</li><li>Viết xong luôn chấm, sửa và <b>viết lại</b> – đó là cách tiến bộ nhanh nhất.</li><li>Dùng Sổ lỗi sai trong Lộ trình để ôn lại câu từng sai.</li><li>Thi thử đúng thời gian ít nhất 2 lần trước khi thi thật.</li></ul></div>
    <div class="card"><h3>Nguồn chính thức</h3><div class="grid two">${DATA.ieltsLinks.map(it => `<a class="card link ext" href="${it[2]}" target="_blank" rel="noopener"><h3>${esc(it[0])} ↗</h3><p class="muted">${esc(it[1])}</p></a>`).join('')}</div></div>`;
  return `<h1>🎯 IELTS 6.5</h1><div class="tabs wrap">${tabs}</div>${body}`;
}};

/* =====================  NGHE – XEM – VIẾT LẠI + SỔ TAY  ===================== */
let WM = 'topics';
let NB = {genre: 'all', vid: null, edit: null, player: null, rate: 1, A: null, B: null, loop: null, gf: 'all', title: ''};
const nbState = () => (S.notebook ||= []);
function nbFind(id) { for (const g of DATA.shortVideos) { const v = g.items.find(x => x[0] === id); if (v) return {v, g: g.g}; } return null; }
function wtabs() { return `<div class="tabs wrap">${[['topics', '✍️ Chủ đề viết'], ['exam', '⏱️ Luyện thi 30 phút'], ['video', '🎬 Nghe – xem – viết lại'], ['notes', '📓 Sổ tay của tôi (' + nbState().length + ')']].map(t => `<button class="${WM === t[0] ? 'on' : ''}" onclick="A.wmode('${t[0]}')">${t[1]}</button>`).join('')}</div>`; }
function ytApi(cb) {
  if (window.YT && YT.Player) return cb();
  (window._ytq ||= []).push(cb);
  if (!document.getElementById('ytapi')) { const s = document.createElement('script'); s.id = 'ytapi'; s.src = 'https://www.youtube.com/iframe_api'; document.head.appendChild(s); window.onYouTubeIframeAPIReady = () => { (window._ytq || []).forEach(f => f()); window._ytq = []; }; }
}
function nbCleanup() { if (NB.loop) clearInterval(NB.loop); NB.loop = null; NB.A = NB.B = null; try { if (NB.player && NB.player.destroy) NB.player.destroy(); } catch (e) {} NB.player = null; }
function nbInit() {
  if (WM !== 'video' || !NB.vid || !document.getElementById('ytp')) return;
  const e = NB.edit ? nbState().find(x => x.id === NB.edit) : null, set = (id, val) => { const el = document.getElementById(id); if (el && val != null) el.value = val; };
  if (e) { set('nbk', e.kw); set('nbs', e.sum); set('nbo', e.opi); }
  A.nbwc();
  const vid = NB.vid;
  ytApi(() => {
    if (NB.vid !== vid || !document.getElementById('ytp')) return;
    try { NB.player = new YT.Player('ytp', {videoId: vid, width: '100%', height: '100%', playerVars: {rel: 0, cc_load_policy: 1, cc_lang_pref: 'en', hl: 'en', playsinline: 1, modestbranding: 1}, events: {onReady: () => { try { NB.player.setPlaybackRate(NB.rate); } catch (x) {} }}}); } catch (x) {}
  });
  setTimeout(() => { const el = document.getElementById('ytp'); if (el && el.tagName === 'DIV' && NB.vid === vid) { el.outerHTML = '<iframe id="ytp" src="https://www.youtube-nocookie.com/embed/' + vid + '?rel=0&cc_load_policy=1&playsinline=1" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>'; const c = document.getElementById('nbctl'); if (c) c.innerHTML = '<small class="muted">Chế độ đơn giản (không tải được bộ điều khiển): dùng ⚙ trong video để chỉnh tốc độ.</small>'; } }, 6000);
}
function nbView() {
  if (WM === 'notes') return nbNotes();
  if (NB.vid) return nbStudy();
  const genres = DATA.shortVideos.map(g => g.g), groups = DATA.shortVideos.filter(g => NB.genre === 'all' || g.g === NB.genre);
  return `<h1>✍️ Viết</h1>${wtabs()}
  <div class="card"><h3>🎬 Nghe – xem – viết lại</h3><p class="muted">Chọn thể loại bạn thích → xem video ngắn (người thật dẫn, thường 4–6 phút) → ghi từ khóa → viết tóm tắt vào <b>sổ tay</b> (trong app, hoặc <b>in phiếu để chép tay vào sổ giấy</b>).</p>
  <div class="tabs wrap"><button class="${NB.genre === 'all' ? 'on' : ''}" onclick="A.nbgenre('all')">Tất cả</button>${genres.map(g => `<button class="${NB.genre === g ? 'on' : ''}" onclick="A.nbgenre(this.dataset.g)" data-g="${esc(g)}">${esc(g)}</button>`).join('')}</div>
  <div class="row"><button class="btn sm" onclick="A.nbrandom()">🎲 Chọn ngẫu nhiên trong thể loại này</button></div></div>
  ${groups.map(g => `<h2>${esc(g.g)}</h2><div class="grid two">${g.items.map(v => `<div class="vcard"><div class="vthumb" style="background-image:url(https://i.ytimg.com/vi/${v[0]}/hqdefault.jpg)" onclick="A.nbpick(this.dataset.v,this.dataset.g)" data-v="${v[0]}" data-g="${esc(g.g)}"><span>▶</span></div><b>${esc(v[1])}</b><small class="muted">${esc(v[3])} · ${esc(v[2])} · ${esc(v[4])}</small><button class="btn sm" onclick="A.nbpick(this.dataset.v,this.dataset.g)" data-v="${v[0]}" data-g="${esc(g.g)}">Xem & ghi chép</button></div>`).join('')}</div>`).join('')}
  <p class="muted">Video là bài học TED-Ed và BBC Learning English (người thật đọc lời). Cần có mạng. Tôi chỉ kiểm tra video còn tồn tại và nhúng được; độ dài thực tế có thể khác nhau.</p>`;
}
function nbStudy() {
  const f = nbFind(NB.vid), v = f ? f.v : [NB.vid, NB.title || 'Video', '', '', ''], gname = f ? f.g : (NB.genreName || '');
  return `<button class="btn ghost" onclick="A.nbback()">← Chọn video khác</button><h1>${esc(v[1])}</h1><p class="muted">${esc(v[3])} · ${esc(v[2])} · ${esc(gname)}</p>
  <div class="card"><div class="vthumb playing" style="cursor:default"><div id="ytp"></div></div>
   <div class="row" id="nbctl"><button class="btn sm ghost" onclick="A.nbseek(-5)">⏪ −5 giây</button><button class="btn sm ghost" onclick="A.nbtoggle()">⏯ Phát / dừng</button><button class="btn sm ghost" onclick="A.nbrate()">🐢 Tốc độ <b id="nbrate">${NB.rate}×</b></button><button class="btn sm ghost" onclick="A.nbA()">A: đặt điểm đầu</button><button class="btn sm ghost" onclick="A.nbB()">B: đặt điểm cuối (lặp)</button><button class="btn sm ghost" onclick="A.nbloopoff()">⏹ Bỏ lặp</button></div>
   <small class="muted" id="nbloopinfo">Mẹo: bấm A rồi B để lặp một đoạn khó, nghe đến khi chép được.</small></div>
  <div class="card"><h3>5 bước</h3><ol><li><b>Xem lần 1:</b> tắt phụ đề (nút CC), chỉ nghe, ghi nhanh từ khóa.</li><li><b>Xem lần 2:</b> bật CC, nghe từng đoạn (dùng −5 giây hoặc lặp A–B), ghi từ mới.</li><li><b>Viết tóm tắt:</b> không nhìn video, viết bằng lời của bạn (3–6 câu).</li><li><b>Đối chiếu:</b> xem lại video, sửa thiếu sót.</li><li><b>Chấm & lưu:</b> bấm “Chấm điểm & sửa lỗi” rồi lưu vào sổ tay.</li></ol></div>
  <div class="card"><h3>📓 Sổ tay</h3>
   <details><summary class="muted">Câu hỏi gợi ý khi ghi chép</summary><ul>${DATA.nbPrompts.map(p => `<li>${esc(p)}</li>`).join('')}</ul></details>
   <label>Từ khóa & từ mới (mỗi dòng một từ: <i>từ - nghĩa</i>)<textarea id="nbk" rows="4" placeholder="battery - pin&#10;current - dòng điện"></textarea></label>
   <label>Tóm tắt bằng tiếng Anh (3–6 câu)<textarea id="nbs" rows="6" oninput="A.nbwc()" placeholder="The video explains…"></textarea></label>
   <label>Cảm nghĩ của tôi (tuỳ chọn)<textarea id="nbo" rows="2"></textarea></label>
   <div class="row"><span id="nbwc" class="muted">0 từ</span><button class="btn" onclick="A.nbsave()">💾 Lưu vào sổ tay</button><button class="btn" onclick="A.gstart('gbox','nbs','essay',30)">📝 Chấm điểm & sửa lỗi</button><button class="btn ghost" onclick="A.nbvocab()">＋ Từ vào thẻ ôn</button><button class="btn ghost" onclick="A.nbprint()">🖨️ In phiếu (chép vào sổ giấy)</button></div><div id="gbox"></div></div>`;
}
function nbNotes() {
  const list = nbState(), genres = [...new Set(list.map(e => e.genre))], shown = list.filter(e => NB.gf === 'all' || e.genre === NB.gf);
  return `<h1>✍️ Viết</h1>${wtabs()}<div class="card"><h3>📓 Sổ tay của tôi</h3><p class="muted">Các bài ghi chép sau khi xem video. Bạn có thể sửa, in ra để chép tay, hoặc tải về toàn bộ.</p>
  <div class="row"><button class="btn sm" onclick="A.wmode('video')">＋ Ghi chép video mới</button><button class="btn sm ghost" onclick="A.nbexport()" ${list.length ? '' : 'disabled'}>⬇️ Tải toàn bộ (.txt)</button></div>
  ${genres.length > 1 ? `<div class="tabs wrap"><button class="${NB.gf === 'all' ? 'on' : ''}" onclick="A.nbgf('all')">Tất cả</button>${genres.map(g => `<button class="${NB.gf === g ? 'on' : ''}" onclick="A.nbgf(this.dataset.g)" data-g="${esc(g)}">${esc(g)}</button>`).join('')}</div>` : ''}</div>
  ${shown.length ? shown.map(e => `<div class="card"><b>${esc(e.title)}</b><br><small class="muted">${e.date} · ${esc(e.genre)} · ${e.words} từ tóm tắt</small>${e.sum ? `<p>${esc(e.sum.slice(0, 220))}${e.sum.length > 220 ? '…' : ''}</p>` : ''}${e.kw ? `<p class="muted"><b>Từ khóa:</b> ${esc(e.kw.replace(/\n/g, ' · ').slice(0, 160))}</p>` : ''}<div class="row"><button class="btn sm" onclick="A.nbopen(${e.id})">Mở / sửa</button><button class="btn sm ghost" onclick="A.nbprintid(${e.id})">🖨️ In phiếu</button><button class="btn sm ghost" onclick="A.nbdel(${e.id})">Xóa</button></div></div>`).join('') : '<div class="card center"><p class="muted">Chưa có ghi chép nào. Hãy chọn một video ở tab “Nghe – xem – viết lại”.</p></div>'}`;
}
function nbPrintHTML(title, url, kw, sum, opi) {
  const br = t => esc(t || '').replace(/\n/g, '<br>');
  return `<!doctype html><html><head><meta charset="utf-8"><title>Phiếu ghi chép – ${esc(title)}</title><style>body{font:14px/1.7 system-ui,Arial;margin:24px;color:#111}h1{font-size:19px;margin:0 0 4px}small{color:#555}table{width:100%;border-collapse:collapse;margin:12px 0}td{border:1px solid #777;vertical-align:top;padding:8px}.l{background:repeating-linear-gradient(transparent,transparent 27px,#c9c9c9 28px);min-height:120px}h3{margin:14px 0 4px;font-size:15px}@media print{button{display:none}}</style></head><body><h1>📓 ${esc(title)}</h1><small>Ngày: ................ · Video: ${esc(url)}</small>
  <table><tr><td style="width:36%"><b>Từ khóa / từ mới</b><div class="l" style="min-height:430px">${br(kw)}</div></td><td><b>Ghi chú khi xem</b><div class="l" style="min-height:430px"></div></td></tr></table>
  <h3>Tóm tắt bằng tiếng Anh (3–6 câu)</h3><div class="l" style="min-height:190px">${br(sum)}</div><h3>Cảm nghĩ của tôi</h3><div class="l" style="min-height:90px">${br(opi)}</div><p><small>English Daily – Nghe, xem, viết lại</small></p></body></html>`;
}
function nbOpenPrint(html, name) {
  const w = window.open('', '_blank');
  if (!w) { download(name + '.html', html, 'text/html'); return toast('Trình duyệt chặn cửa sổ in — đã tải phiếu về dạng .html, mở file rồi in.'); }
  w.document.write(html); w.document.close(); setTimeout(() => { try { w.focus(); w.print(); } catch (e) {} }, 500);
}

/* =====================  TEST TRẮC NGHIỆM KIỂU TRUNG TÂM (văn phạm + nghe)  ===================== */
const CTL = ['A1', 'A2', 'B1', 'B2', 'C1'];
const CT_MODES = {
  full: {name: 'Đầy đủ', desc: '40 câu: 30 văn phạm + 10 nghe · 35 phút', g: [4, 6, 8, 8, 4], l: 10, min: 35},
  quick: {name: 'Rút gọn', desc: '20 câu: 15 văn phạm + 5 nghe · 18 phút', g: [2, 4, 4, 4, 1], l: 5, min: 18},
  grammar: {name: 'Chỉ văn phạm', desc: '30 câu trắc nghiệm · 25 phút', g: [4, 6, 8, 8, 4], l: 0, min: 25},
  listen: {name: 'Chỉ nghe', desc: '10 câu nghe, chọn đáp án · 12 phút', g: [0, 0, 0, 0, 0], l: 10, min: 12}
};
let CT = {running: false, mode: null, qs: [], i: 0, ans: {}, plays: {}, end: 0, done: false, res: null};
let CTT = null;
const ctShuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
function ctStop() { if (CTT) clearInterval(CTT); CTT = null; }
function ctWordsN(t) { return (t.match(/[A-Za-z']+/g) || []).length; }
function ctListenQs(n) {
  if (!n || typeof DATA.hs === 'undefined' || !DATA.hs.length) return [];
  const meta = hsIndex().meta, idx = DATA.hs.map((_, i) => i).filter(i => !(ieltsMode() && meta[i].topic === 'Tài chính & kế toán'));
  const band = i => { const w = ctWordsN(DATA.hs[i][0]); return w <= 5 ? 'A2' : w <= 8 ? 'B1' : 'B2'; };
  const want = n >= 10 ? {A2: 3, B1: 4, B2: 3} : {A2: 1, B1: 2, B2: 2}, picked = [];
  Object.entries(want).forEach(([b, k]) => { const pool = ctShuffle(idx.filter(i => band(i) === b && DATA.hs[i][1])); picked.push(...pool.slice(0, k).map(i => ({i, b}))); });
  const out = [];
  picked.forEach((p, k) => {
    const s = DATA.hs[p.i], type = k % 2 === 0 ? 's' : 'v', w = ctWordsN(s[0]);
    const others = idx.filter(j => j !== p.i && DATA.hs[j][0] !== s[0] && Math.abs(ctWordsN(DATA.hs[j][0]) - w) <= 2);
    const tok = new Set(hsWords(s[0])), score = j => hsWords(DATA.hs[j][0]).filter(x => tok.has(x)).length + Math.random();
    const d = others.sort((a, b) => score(b) - score(a)).slice(0, 3);
    const texts = type === 's' ? [s[0], ...d.map(j => DATA.hs[j][0])] : [s[1], ...d.filter(j => DATA.hs[j][1]).map(j => DATA.hs[j][1])];
    if (texts.length < 4) return;
    const opts = ctShuffle(texts);
    out.push({kind: 'l', lv: p.b, topic: 'listen', hs: p.i, type, q: type === 's' ? 'Nghe và chọn CÂU bạn nghe được.' : 'Nghe và chọn NGHĨA tiếng Việt đúng của câu.', o: opts, a: opts.indexOf(type === 's' ? s[0] : s[1]), e: 'Câu nghe: “' + s[0] + '” — ' + s[1]});
  });
  return out;
}
function ctBuild(mode) {
  const m = CT_MODES[mode], qs = [];
  CTL.forEach((lv, i) => ctShuffle(DATA.ctest.grammar.filter(x => x[0] === lv)).slice(0, m.g[i]).forEach(x => { const opts = x[3].map((t, k) => ({t, ok: k === x[4]})), sh = ctShuffle(opts); qs.push({kind: 'g', lv, topic: x[1], q: x[2], o: sh.map(z => z.t), a: sh.findIndex(z => z.ok), e: x[5]}); }));
  qs.push(...ctListenQs(m.l));
  return qs;
}
function ctFinish(auto) {
  if (!CT.running) return; ctStop(); CT.running = false; CT.done = true;
  const by = {}, byT = {}; CTL.forEach(l => by[l] = [0, 0]); let gC = 0, gT = 0, lC = 0, lT = 0; const wrong = [];
  CT.qs.forEach((q, i) => { const ok = CT.ans[i] === q.a; by[q.lv][1]++; if (ok) by[q.lv][0]++; const tk = q.kind === 'l' ? 'listen' : q.topic; (byT[tk] ||= [0, 0])[1]++; if (ok) byT[tk][0]++; if (q.kind === 'g') { gT++; if (ok) gC++; } else { lT++; if (ok) lC++; } if (!ok) wrong.push(i); });
  const total = CT.qs.length, correct = gC + lC; let reached = -1;
  for (let i = 0; i < CTL.length; i++) { const [c, t] = by[CTL[i]]; if (!t) continue; if (c / t >= 0.6) reached = i; else break; }
  if (correct / Math.max(1, total) < 0.3) reached = Math.min(reached, 0) < 0 ? -1 : 0;
  const level = reached < 0 ? 'A1' : CTL[reached];
  CT.res = {total, correct, pct: Math.round(correct / Math.max(1, total) * 100), by, byT, g: [gC, gT], l: [lC, lT], level, belowA1: reached < 0, wrong, auto: !!auto, unanswered: CT.qs.filter((_, i) => CT.ans[i] == null).length};
  const hist = (S.ctest ||= []); hist.unshift({date: todayStr(), mode: CT.mode, score: correct, total, level, g: CT.res.g, l: CT.res.l}); if (hist.length > 30) hist.length = 30;
  PT.unit = 'ctest'; CT.qs.forEach((q, i) => { if (q.kind === 'g' && CT.ans[i] != null && CT.ans[i] !== q.a) addMistake({q: q.q, o: q.o, a: q.a, e: q.e}); });
  save(); if (gT >= 10) markDone('grammar'); if (lT >= 5) markDone('listen'); if (typeof addXP === 'function' && total >= 15) addXP(20);
}
function ctPlay(i) {
  const q = CT.qs[i], s = DATA.hs[q.hs]; if (!s) return;
  CT.plays[i] = (CT.plays[i] || 0) + 1;
  if (window.speechSynthesis) speechSynthesis.cancel(); if (hsAudio) { try { hsAudio.pause(); } catch (e) {} } if (humanAudio) { try { humanAudio.pause(); } catch (e) {} }
  const a = new Audio(HS_AUDIO(s[2])); hsAudio = a;
  a.onerror = () => { toast('Không tải được âm thanh người thật — dùng giọng máy thay thế.'); say(s[0], 1, 1, null, 'US'); };
  a.play().catch(() => {});
}
views.ctest = {render() {
  if (CT.running && Date.now() >= CT.end) ctFinish(true);
  if (CT.done && CT.res) return ctResult();
  if (CT.running) return ctRun();
  return ctIntro();
}};
function ctIntro() {
  const hist = S.ctest || [], hasHs = typeof DATA.hs !== 'undefined' && DATA.hs.length;
  return `<h1>📝 Test trắc nghiệm xếp lớp</h1>
  <div class="card warn">Bài test <b>kiểu trung tâm tiếng Anh ở Việt Nam</b>: chọn đáp án A/B/C/D, gồm <b>văn phạm</b> và <b>nghe</b>. Không có phần viết và nói. Đây là bài tự tạo để luyện tập, không phải đề của một trung tâm cụ thể; kết quả (cấp A1–C1 và quy đổi IELTS) chỉ mang tính tham khảo. Bài thi viết 30′/nói 15′ cũ vẫn có ở mục <a href="#rmit">🏫 Thi xếp lớp</a>.</div>
  <div class="grid two">${Object.entries(CT_MODES).map(([k, m]) => `<div class="card"><h3>${esc(m.name)}</h3><p class="muted">${esc(m.desc)}</p>${m.l && !hasHs ? '<p class="muted">⚠️ Thiếu dữ liệu nghe.</p>' : `<button class="btn" onclick="A.ctstart('${k}')">▶ Bắt đầu</button>`}</div>`).join('')}</div>
  <div class="card"><h3>Cách làm bài</h3><ul><li>Câu hỏi xếp từ dễ đến khó (A1 → C1). Mỗi câu chọn <b>một</b> đáp án. Có thể quay lại sửa trước khi nộp.</li><li>Phần nghe dùng <b>giọng người thật</b> (tình nguyện viên Tatoeba); mỗi câu nghe tối đa <b>2 lần</b>. Cần có mạng và bật âm thanh.</li><li>Hết giờ bài tự nộp. Sau khi nộp có đáp án, giải thích, chủ điểm yếu và bài ôn gợi ý.</li><li>Các câu văn phạm sai tự lưu vào <b>Sổ lỗi sai</b> trong Lộ trình.</li></ul></div>
  <div class="card"><h3>Lịch sử (${hist.length})</h3>${hist.length ? hist.map(h => `<div class="task"><span>${h.date} · ${esc((CT_MODES[h.mode] || {}).name || h.mode)}<br><small class="muted">Văn phạm ${h.g[0]}/${h.g[1]}${h.l[1] ? ' · Nghe ' + h.l[0] + '/' + h.l[1] : ''}</small></span><b>${h.score}/${h.total} → ${h.level}</b></div>`).join('') : '<p class="muted">Chưa có lần làm nào.</p>'}</div>`;
}
function ctRun() {
  const q = CT.qs[CT.i], n = CT.qs.length, sel = CT.ans[CT.i], gN = CT.qs.filter(x => x.kind === 'g').length, part = q.kind === 'g' ? 'Phần 1 – Văn phạm' : 'Phần 2 – Nghe';
  const pal = CT.qs.map((x, i) => `<button class="pal ${i === CT.i ? 'cur' : ''} ${CT.ans[i] != null ? 'done' : ''}" onclick="A.ctgo(${i})">${i + 1}</button>`).join('');
  const left = Math.max(0, Math.round((CT.end - Date.now()) / 1000)), m = Math.floor(left / 60), s = left % 60;
  return `<div class="ctbar"><b>⏱️ <span id="ctt">${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}</span></b><span class="muted">Câu ${CT.i + 1}/${n} · ${part}</span><button class="btn sm bad" onclick="A.ctsubmit()">Nộp bài</button></div>
  <div class="pals">${pal}</div>
  <div class="card q"><small class="muted">Cấp độ câu: ${q.lv}</small><p class="big">${CT.i + 1}. ${esc(q.q)}</p>
   ${q.kind === 'l' ? `<div class="row"><button class="btn" onclick="A.ctplay(${CT.i})">▶ Nghe${(CT.plays[CT.i] || 0) ? ' lại' : ''}</button><small class="muted">Đã nghe ${(CT.plays[CT.i] || 0)}/2 lần</small></div>` : ''}
   <div class="opts">${q.o.map((o, j) => `<button class="opt ${sel === j ? 'sel' : ''}" onclick="A.ctans(${j})"><b>${'ABCD'[j]}.</b> ${esc(o)}</button>`).join('')}</div></div>
  <div class="row"><button class="btn ghost" onclick="A.ctgo(${CT.i - 1})" ${CT.i === 0 ? 'disabled' : ''}>← Câu trước</button><button class="btn" onclick="A.ctgo(${CT.i + 1})" ${CT.i === n - 1 ? 'disabled' : ''}>Câu sau →</button></div>`;
}
function ctRefs(topic) { return (DATA.ctest.refs[topic] || []).map(r => `<button class="btn sm ghost" onclick="A.ctref('${r[1]}','${r[2]}')">${esc(r[0])}</button>`).join(' '); }
function ctResult() {
  const r = CT.res, info = DATA.ctest.levelInfo[r.level];
  const weak = Object.entries(r.byT).filter(([t, v]) => t !== 'listen' && v[0] / v[1] < 0.6).sort((a, b) => (a[1][0] / a[1][1]) - (b[1][0] / b[1][1]));
  return `<h1>📝 Kết quả</h1>
  <div class="card center"><div class="gscore">${r.correct}<small>/${r.total}</small></div><p class="muted">${r.pct}% đúng${r.auto ? ' · hết giờ, bài tự nộp' : ''}${r.unanswered ? ' · ' + r.unanswered + ' câu bỏ trống' : ''}</p>
   <h2>Cấp độ ước lượng: <b>${r.level}</b>${r.belowA1 ? ' (cần củng cố nền tảng)' : ''}</h2><p><b>${esc(info.name)}</b><br><small class="muted">${esc(info.ielts)} (quy đổi tham khảo)</small></p><p class="muted">${esc(info.tip)}</p>
   <div class="row" style="justify-content:center"><button class="btn" onclick="A.ctapply()">Dùng cấp ${r.level} làm điểm bắt đầu trong Lộ trình</button><button class="btn ghost" onclick="A.ctagain()">Làm bài mới</button></div></div>
  <div class="grid two"><div class="card"><h3>Theo phần</h3><p>Văn phạm: <b>${r.g[0]}/${r.g[1]}</b></p>${r.l[1] ? `<p>Nghe: <b>${r.l[0]}/${r.l[1]}</b></p>` : ''}<h3>Theo cấp độ câu hỏi</h3>${CTL.map(l => { const [c, t] = r.by[l]; return t ? `<div style="margin:6px 0"><b>${l}</b> ${c}/${t} <small class="muted">${c / t >= 0.6 ? '✓ đạt' : '✗ chưa đạt (cần ≥60%)'}</small><div class="pbar"><i style="width:${Math.round(c / t * 100)}%"></i></div></div>` : ''; }).join('')}</div>
  <div class="card"><h3>Chủ điểm cần ôn</h3>${weak.length ? weak.map(([t, v]) => `<div style="margin:8px 0"><b>${esc(DATA.ctest.topicVi[t] || t)}</b> <small class="muted">${v[0]}/${v[1]} đúng</small><div>${ctRefs(t)}</div></div>`).join('') : '<p>🎉 Không có chủ điểm nào dưới 60%.</p>'}${r.byT.listen && r.byT.listen[0] / r.byT.listen[1] < 0.6 ? '<p>🎧 Phần nghe còn yếu: luyện tab <a href="#listen">Nghe</a> (chép chính tả câu người thật).</p>' : ''}<p class="muted">Các câu văn phạm sai đã lưu vào <b>Sổ lỗi sai</b> (Lộ trình → Sổ lỗi sai).</p></div></div>
  <h2>Đáp án & giải thích</h2>
  ${CT.qs.map((q, i) => { const ok = CT.ans[i] === q.a; return `<div class="card q"><p><b>${i + 1}.</b> ${esc(q.q)} <small class="muted">(${q.lv})</small> ${ok ? '✅' : CT.ans[i] == null ? '⬜ bỏ trống' : '❌'}</p>${q.kind === 'l' ? `<div class="row"><button class="btn sm ghost" onclick="A.ctreplay(${i})">▶ Nghe lại</button></div>` : ''}<div class="opts">${q.o.map((o, j) => `<div class="opt ${j === q.a ? 'ok' : j === CT.ans[i] ? 'no' : ''}"><b>${'ABCD'[j]}.</b> ${esc(o)}</div>`).join('')}</div><p class="expl">${esc(q.e)}</p></div>`; }).join('')}`;
}

/* =====================  REMINDERS & SETTINGS  ===================== */
let notifSupport = 'Notification' in window;
views.remind = {render() {
  const perm = notifSupport ? Notification.permission : 'unsupported';
  const pl = {granted: '✅ Đã bật', denied: '⛔ Bị chặn (mở cài đặt trình duyệt để cho phép)', default: '⚪ Chưa bật', unsupported: '❌ Thiết bị không hỗ trợ'}[perm];
  return `<h1>⏰ Nhắc nhở học</h1>
  <div class="card"><h3>Trạng thái thông báo: ${pl}</h3><div class="row"><button class="btn" onclick="A.askNotif()">Bật thông báo</button><button class="btn ghost" onclick="A.testNotif()">Gửi thử</button></div>
   <p class="muted">⚠️ Web app không có máy chủ nên chỉ gửi thông báo khi ứng dụng <b>đang mở hoặc chạy nền</b> (nên “Cài đặt ứng dụng” để chạy ổn định). Để nhắc <b>chắc chắn 100%</b> kể cả khi đóng app, hãy nhấn “Thêm vào Lịch” bên dưới — Lịch của máy (Google/Apple/Outlook) sẽ báo thức đúng giờ.</p></div>
  <div class="card"><h3>Lịch nhắc của bạn</h3>${S.reminders.map(r => `<div class="rem"><div><b>${r.time}</b> — ${esc(r.label)}<div class="days">${DAYS.map((d, i) => `<button class="day ${r.days.includes(i) ? 'on' : ''}" onclick="A.rday('${r.id}',${i})">${d}</button>`).join('')}</div></div>
   <div class="row"><label class="sw"><input type="checkbox" ${r.on ? 'checked' : ''} onchange="A.ron('${r.id}',this.checked)"> Bật</label><button class="btn sm ghost" onclick="A.ics('${r.id}')">📅 Thêm vào Lịch</button><button class="btn sm ghost" onclick="A.rdel('${r.id}')">Xóa</button></div></div>`).join('') || '<p class="muted">Chưa có nhắc nhở.</p>'}
   <h4>➕ Thêm nhắc nhở</h4><div class="row"><input type="time" id="rt" value="07:30"><input id="rl" placeholder="Nội dung nhắc" value="Học tiếng Anh 30 phút nào! 💪"><button class="btn" onclick="A.radd()">Thêm</button></div></div>
  <div class="card"><h3>📲 Cài đặt như ứng dụng</h3><ul><li><b>Windows/Mac (Chrome/Edge):</b> biểu tượng “Cài đặt” ⊕ ở thanh địa chỉ → Install.</li><li><b>Android (Chrome):</b> Menu ⋮ → “Thêm vào màn hình chính / Cài đặt ứng dụng”.</li><li><b>iPhone/iPad (Safari):</b> nút Chia sẻ → “Thêm vào Màn hình chính” (bắt buộc để nhận thông báo, iOS 16.4+).</li><li>Trang cần chạy qua HTTPS (hoặc localhost).</li></ul></div>
  <div class="card"><h3>⚙️ Cài đặt</h3><label>Giọng Mỹ 🇺🇸 (en-US)<select onchange="A.setVoice('US',this.value)"><option value="">Tự chọn</option>${accVoices('US').map(v => `<option ${(S.settings.voiceUS || S.settings.voice) === v.name ? 'selected' : ''}>${esc(v.name)}</option>`).join('')}</select></label>
   <label>Giọng Anh 🇬🇧 (en-GB)<select onchange="A.setVoice('GB',this.value)"><option value="">Tự chọn</option>${accVoices('GB').map(v => `<option ${S.settings.voiceGB === v.name ? 'selected' : ''}>${esc(v.name)}</option>`).join('')}</select></label>
   ${accVoices('GB').length ? '' : '<p class="muted">⚠️ Máy chưa có giọng Anh-Anh. Windows: Cài đặt → Thời gian & ngôn ngữ → Giọng nói → thêm giọng “English (United Kingdom)”. Mac: Cài đặt → Trợ năng → Nội dung nói → Giọng hệ thống → thêm giọng Anh (Daniel, Kate…). iPhone/Android: cài gói giọng nói tiếng Anh (Anh).</p>'}
   <label class="chk"><input type="checkbox" ${humanOn() ? 'checked' : ''} onchange="A.humanOpt(this.checked)"> Ưu tiên bản ghi âm <b>người thật</b> cho từ đơn (Wikimedia, khi có)</label>
   <div class="row"><button class="btn sm" onclick="A.sayA('Hello! This is an American voice. Nice to meet you.','US')">🔊 Thử giọng Mỹ</button><button class="btn sm ghost" onclick="A.sayA('Hello! This is a British voice. Lovely to meet you.','GB')">🔊 Thử giọng Anh</button><button class="btn sm ghost" onclick="A.accent()">Đổi giọng mặc định (hiện: ${accent()})</button><button class="btn sm ghost" onclick="A.speed()">Đổi tốc độ đọc (hiện: ${speedF().toFixed(1)}×)</button></div>
   <p class="muted">👤 Đang học với hồ sơ: <b>${esc(curProfile().name)}</b> · ${REG.profiles.length} học viên trên máy này. Tiến độ tự lưu ngay khi học.</p>
   ${storageStatus()}
   <div class="row"><button class="btn sm" onclick="A.pshow()">👤 Đổi / thêm học viên</button><button class="btn sm ghost" onclick="A.backupAll()">⬇️ Sao lưu tất cả học viên</button><button class="btn sm ghost" onclick="A.restoreBak()">♻️ Khôi phục bản dự phòng hôm nay</button></div>
   <div class="row"><button class="btn sm ghost" onclick="A.backup()">⬇️ Sao lưu hồ sơ này</button><label class="btn sm ghost">⬆️ Khôi phục<input type="file" accept=".json" hidden onchange="A.restore(this.files[0])"></label><button class="btn sm bad" onclick="A.reset()">Xóa toàn bộ</button></div></div>`;
}};

/* nhắc nhở: kiểm tra định kỳ khi app mở */
async function notify(title, body) {
  toast('🔔 ' + body);
  if (!notifSupport || Notification.permission !== 'granted') return;
  try {
    const reg = navigator.serviceWorker && await navigator.serviceWorker.getRegistration();
    if (reg) return reg.showNotification(title, {body, icon: 'icon-192.png', badge: 'icon-192.png', tag: 'english-daily', renotify: true});
    new Notification(title, {body, icon: 'icon-192.png'});
  } catch (e) { try { new Notification(title, {body}); } catch (_) {} }
}
function checkReminders() {
  const now = new Date(), d = todayStr(), mins = now.getHours() * 60 + now.getMinutes();
  let fired = false;
  S.reminders.forEach(r => {
    if (!r.on || !r.days.includes(now.getDay())) return;
    const [h, m] = r.time.split(':').map(Number), diff = mins - (h * 60 + m), key = d + '|' + r.id;
    if (diff >= 0 && diff <= 120 && !S.fired[key]) {
      S.fired[key] = 1; fired = true;
      const req = TASKS.filter(t => !t.optional), left = req.filter(t => !dayLog().tasks[t.id]).length;
      notify('English Daily', r.label + (left ? ` (còn ${left} nhiệm vụ hôm nay)` : ' – bạn đã xong nhiệm vụ hôm nay 🎉'));
    }
  });
  if (fired) { Object.keys(S.fired).forEach(k => { if (!k.startsWith(d)) delete S.fired[k]; }); save(); }
}
setInterval(checkReminders, 20000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) checkReminders(); });

/* .ics */
function icsFor(r) {
  const pad = n => String(n).padStart(2, '0'), start = new Date(), [h, m] = r.time.split(':').map(Number);
  for (let i = 0; i < 8 && !r.days.includes(start.getDay()); i++) start.setDate(start.getDate() + 1);
  const ds = `${start.getFullYear()}${pad(start.getMonth() + 1)}${pad(start.getDate())}T${pad(h)}${pad(m)}00`;
  const rule = r.days.length === 7 ? 'FREQ=DAILY' : 'FREQ=WEEKLY;BYDAY=' + r.days.map(i => ICS_DAYS[i]).join(',');
  return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//English Daily//VI','BEGIN:VEVENT',`UID:${r.id}@english-daily`,`DTSTAMP:${ds}`,`DTSTART:${ds}`,`DURATION:PT30M`,`RRULE:${rule}`,'SUMMARY:Học tiếng Anh (English Daily)',`DESCRIPTION:${r.label.replace(/[\n,;]/g, ' ')}`,'BEGIN:VALARM','ACTION:DISPLAY','DESCRIPTION:Học tiếng Anh','TRIGGER:PT0M','END:VALARM','END:VEVENT','END:VCALENDAR'].join('\r\n');
}
function download(name, text, type) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], {type})); a.download = name; document.body.appendChild(a); a.click(); a.remove(); }

/* =====================  METHOD  ===================== */
views.method = {render() {
  return `<h1>🧭 Phương pháp học hiệu quả</h1><p class="muted">Tổng hợp các nguyên tắc học ngôn ngữ được nghiên cứu nhiều (ghi nhớ ngắt quãng, nhớ lại chủ động, đầu vào dễ hiểu, output & phản hồi, luyện có chủ đích) và cách app áp dụng.</p>
  <div class="grid two">${DATA.method.map(m => `<div class="card"><h3>${m[0]} ${esc(m[1])}</h3><p>${esc(m[2])}</p></div>`).join('')}</div>
  <div class="card"><h3>⏱️ Lịch học mẫu ~60 phút/ngày</h3><ol>${DATA.routine.map(r => `<li><b>${r[0]}</b> ${esc(r[1])}</li>`).join('')}</ol><p class="muted">Bận: chỉ cần làm 3 việc — ôn thẻ từ, nghe 10 phút, nói 3 câu shadowing. Giữ chuỗi ngày học quan trọng hơn học thật dài.</p></div>`;
}};

/* =====================  ACTIONS  ===================== */
const A = window.A = {
  install() { if (!deferredInstall) return; deferredInstall.prompt(); deferredInstall.userChoice.finally(() => { deferredInstall = null; showInstallBanner(); }); },
  say, toggle(id) { const l = dayLog(); l.tasks[id] = !l.tasks[id]; save(); rerender(); },
  /* chấm bài */
  gstart(boxId, taId, kind, min) {
    const ta = taId ? document.getElementById(taId) : null;
    const text = ta ? ta.value : ((RM.w && RM.w.text) || '');
    if (wcount(text) < 8) return toast('Hãy viết ít nhất vài câu trước khi chấm.');
    GR = {boxId, taId: taId || null, kind: kind || 'essay', min: min || 0, text, undo: null, ltDone: false, loading: false, ltErr: '', lt: [], ltCount: 0};
    GR.issues = gMergeIssues(gLocalIssues(text), []);
    gRender(); const el = document.getElementById(boxId); if (el) el.scrollIntoView({behavior: 'smooth', block: 'start'});
    if (S.settings.ltConsent) gRunLT();
  },
  glt(first) { if (first) { const c = $('#gconsent'); if (c && c.checked) { S.settings.ltConsent = true; save(); } } gRunLT(); },
  gfix(k, j) {
    const g = GR, i = g.issues[k], ta = document.getElementById(g.taId); if (!ta || !i) return;
    g.undo = ta.value; const t = ta.value;
    ta.value = t.slice(0, i.off) + i.reps[j] + t.slice(i.off + i.len); ta.dispatchEvent(new Event('input'));
    g.text = ta.value; g.issues = gMergeIssues(gLocalIssues(g.text), []); g.ltDone = false; g.lt = [];
    if (S.settings.ltConsent) gRunLT(); else gRender();
  },
  gall() {
    const g = GR, ta = document.getElementById(g.taId); if (!ta) return;
    g.undo = ta.value; ta.value = gApplyAll(ta.value, g.issues); ta.dispatchEvent(new Event('input'));
    g.text = ta.value; g.issues = gMergeIssues(gLocalIssues(g.text), []); g.ltDone = false; g.lt = [];
    toast('Đã áp dụng các gợi ý. Hãy đọc lại để chắc chắn đúng ý bạn.');
    if (S.settings.ltConsent) gRunLT(); else gRender();
  },
  gundo() { const g = GR, ta = document.getElementById(g.taId); if (!ta || g.undo == null) return; ta.value = g.undo; ta.dispatchEvent(new Event('input')); g.text = ta.value; g.undo = null; g.issues = gMergeIssues(gLocalIssues(g.text), []); g.ltDone = false; g.lt = []; gRender(); },
  gradeclose() { const g = GR; GR = null; const el = g && document.getElementById(g.boxId); if (el) el.innerHTML = ''; },
  /* IELTS 6.5 */
  i65tab(t) { IH.tab = t; rerender(); window.scrollTo(0, 0); },
  i65plan(w, t, v) { i65State().plan['w' + w + 't' + t] = v; save(); rerender(); },
  i65t2(i) { IH.t2 = i; rerender(); },
  i65t1(i) { IH.t1 = i; rerender(); },
  i65open(uid) { T = {track: 'ielts', unit: uid, tab: 'words', quiz: null, hideB: false, showVi: true}; rerender(); },
  i65read(id) { I = {...I, tab: 'reading', r: id, sub: false, ans: {}}; rerender(); },
  i65write2(q) { const i = DATA.ieltsTask2.indexOf(q); if (i >= 0) A.wielts(i, 2); else toast('Không tìm thấy đề.'); },
  i65mock() { RM.tab = 'speak'; RM.s = null; location.hash = '#rmit'; rerender(); },
  i65addall() { const tr = DATA.topics.find(t => t.id === 'ielts'); let n = 0; tr.units.forEach(u => u.w.forEach((x, i) => { const id = tkey(u.id, i); if (!isAdded(id)) { S.custom.push({id, w: x[0], ipa: x[1], vi: x[2], ex: x[3], cat: 'ielts65'}); n++; } })); save(); toast('Đã thêm ' + n + ' từ vào thẻ ôn (mỗi ngày học tối đa 10 thẻ mới)'); },
  ieltsMode(v) { S.settings.ielts = v; save(); const t = TASKS.find(x => x.id === 'ielts'); if (t) { t.optional = !v; t.name = v ? 'IELTS 6.5 (1 phần mỗi ngày)' : 'IELTS (tuỳ chọn)'; t.href = v ? '#i65' : '#ielts'; } toast(v ? 'Đã bật chế độ IELTS (ẩn nội dung tài chính)' : 'Đã tắt chế độ IELTS (hiện tất cả nội dung)'); rerender(); },
  /* nghe – xem – viết lại */
  wmode(m) { nbCleanup(); exStop(); WM = m; NB.vid = null; NB.edit = null; W = {open: null, cat: W.cat, view: null}; rerender(); window.scrollTo(0, 0); },
  nbgenre(g) { NB.genre = g; rerender(); },
  nbgf(g) { NB.gf = g; rerender(); },
  nbrandom() { const gs = DATA.shortVideos.filter(g => NB.genre === 'all' || g.g === NB.genre), g = gs[Math.floor(Math.random() * gs.length)], v = g.items[Math.floor(Math.random() * g.items.length)]; A.nbpick(v[0], g.g); },
  nbpick(id, g) { nbCleanup(); NB.vid = id; NB.edit = null; NB.genreName = g; NB.rate = 1; rerender(); window.scrollTo(0, 0); },
  nbback() { nbCleanup(); NB.vid = null; NB.edit = null; rerender(); window.scrollTo(0, 0); },
  nbwc() { const t = $('#nbs'), el = $('#nbwc'); if (t && el) { const n = wcount(t.value); el.textContent = n + ' từ'; el.style.color = n >= 25 ? 'var(--ok)' : ''; } },
  nbseek(d) { if (!NB.player || !NB.player.getCurrentTime) return toast('Trình phát chưa sẵn sàng (cần có mạng).'); NB.player.seekTo(Math.max(0, NB.player.getCurrentTime() + d), true); },
  nbtoggle() { if (!NB.player || !NB.player.getPlayerState) return toast('Trình phát chưa sẵn sàng (cần có mạng).'); NB.player.getPlayerState() === 1 ? NB.player.pauseVideo() : NB.player.playVideo(); },
  nbrate() { if (!NB.player || !NB.player.setPlaybackRate) return toast('Trình phát chưa sẵn sàng (cần có mạng).'); const r = [1, 0.75, 0.5], i = r.indexOf(NB.rate); NB.rate = r[(i + 1) % r.length]; NB.player.setPlaybackRate(NB.rate); const el = $('#nbrate'); if (el) el.textContent = NB.rate + '×'; },
  nbA() { if (!NB.player || !NB.player.getCurrentTime) return toast('Trình phát chưa sẵn sàng.'); NB.A = NB.player.getCurrentTime(); NB.B = null; if (NB.loop) clearInterval(NB.loop); NB.loop = null; $('#nbloopinfo').textContent = 'Điểm A: ' + NB.A.toFixed(1) + 's — bấm B ở cuối đoạn cần lặp.'; },
  nbB() { if (!NB.player || NB.A == null) return toast('Hãy bấm A trước.'); const b = NB.player.getCurrentTime(); if (b <= NB.A + 0.5) return toast('Điểm B phải sau điểm A.'); NB.B = b; if (NB.loop) clearInterval(NB.loop); NB.loop = setInterval(() => { try { if (NB.player.getCurrentTime() >= NB.B) NB.player.seekTo(NB.A, true); } catch (e) {} }, 250); NB.player.seekTo(NB.A, true); $('#nbloopinfo').textContent = 'Đang lặp đoạn ' + NB.A.toFixed(1) + 's → ' + NB.B.toFixed(1) + 's.'; },
  nbloopoff() { if (NB.loop) clearInterval(NB.loop); NB.loop = null; NB.A = NB.B = null; const el = $('#nbloopinfo'); if (el) el.textContent = 'Đã bỏ lặp.'; },
  nbsave() {
    const kw = $('#nbk').value.trim(), sum = $('#nbs').value.trim(), opi = $('#nbo').value.trim();
    if (!kw && !sum) return toast('Hãy ghi từ khóa hoặc viết tóm tắt trước khi lưu.');
    const f = nbFind(NB.vid), title = f ? f.v[1] : (NB.title || 'Video'), genre = f ? f.g : (NB.genreName || ''), words = wcount(sum), list = nbState();
    const ex = NB.edit ? list.find(x => x.id === NB.edit) : null;
    if (ex) Object.assign(ex, {kw, sum, opi, words, date: todayStr()});
    else { const e = {id: Date.now(), vid: NB.vid, title, genre, date: todayStr(), kw, sum, opi, words}; list.unshift(e); NB.edit = e.id; if (list.length > 200) list.length = 200; if (typeof addXP === 'function' && words >= 25) addXP(10); }
    save(); if (words >= 25) markDone('write'); toast('💾 Đã lưu vào sổ tay' + (words < 25 ? ' (viết ≥ 25 từ để tính hoàn thành nhiệm vụ Viết)' : ''));
  },
  nbvocab() {
    const lines = $('#nbk').value.split('\n').map(x => x.trim()).filter(Boolean); if (!lines.length) return toast('Chưa có từ nào trong ô từ khóa.');
    let n = 0; lines.forEach((ln, i) => { const m = ln.split(/\s*[-–:=]\s*/); const w = (m[0] || '').trim(), vi = (m.slice(1).join(' - ') || '').trim(); if (!w || w.split(/\s+/).length > 4) return; if (S.custom.some(c => c.w.toLowerCase() === w.toLowerCase())) return; S.custom.push({id: 'nb_' + Date.now() + '_' + i, w, ipa: '', vi: vi || '(tự thêm từ sổ tay)', ex: '', cat: 'nb'}); n++; });
    save(); toast(n ? 'Đã thêm ' + n + ' từ vào thẻ ôn' : 'Không có từ mới để thêm (có thể đã tồn tại).');
  },
  nbprint() { const f = nbFind(NB.vid), title = f ? f.v[1] : 'Video'; nbOpenPrint(nbPrintHTML(title, 'https://www.youtube.com/watch?v=' + NB.vid, $('#nbk').value, $('#nbs').value, $('#nbo').value), 'phieu-ghi-chep'); },
  nbprintid(id) { const e = nbState().find(x => x.id === id); if (e) nbOpenPrint(nbPrintHTML(e.title, 'https://www.youtube.com/watch?v=' + e.vid, e.kw, e.sum, e.opi), 'phieu-ghi-chep'); },
  nbopen(id) { const e = nbState().find(x => x.id === id); if (!e) return; nbCleanup(); WM = 'video'; NB.vid = e.vid; NB.edit = id; NB.genreName = e.genre; NB.title = e.title; NB.rate = 1; rerender(); window.scrollTo(0, 0); },
  nbdel(id) { if (confirm('Xóa ghi chép này?')) { S.notebook = nbState().filter(x => x.id !== id); save(); rerender(); } },
  nbexport() { const txt = nbState().map(e => `=== ${e.title} ===\nNgày: ${e.date} · Thể loại: ${e.genre}\nVideo: https://www.youtube.com/watch?v=${e.vid}\n\n[Từ khóa]\n${e.kw}\n\n[Tóm tắt]\n${e.sum}\n\n[Cảm nghĩ]\n${e.opi}\n`).join('\n\n'); download('so-tay-english-daily-' + todayStr() + '.txt', txt, 'text/plain'); },
  /* test trắc nghiệm */
  ctstart(mode) {
    const qs = ctBuild(mode); if (!qs.length) return toast('Chưa tạo được câu hỏi.');
    ctStop(); CT = {running: true, mode, qs, i: 0, ans: {}, plays: {}, end: Date.now() + CT_MODES[mode].min * 60000, done: false, res: null};
    rerender(); window.scrollTo(0, 0);
    CTT = setInterval(() => { if (!CT.running) return ctStop(); const left = Math.max(0, Math.round((CT.end - Date.now()) / 1000)), el = $('#ctt'); if (el) el.textContent = String(Math.floor(left / 60)).padStart(2, '0') + ':' + String(left % 60).padStart(2, '0'); if (left === 300) toast('⏰ Còn 5 phút'); if (left === 0) { ctFinish(true); rerender(); window.scrollTo(0, 0); } }, 500);
  },
  ctans(j) { CT.ans[CT.i] = j; const y = window.scrollY; rerender(); window.scrollTo(0, y); },
  ctgo(i) { if (i < 0 || i >= CT.qs.length) return; CT.i = i; rerender(); window.scrollTo(0, 0); },
  ctplay(i) { if ((CT.plays[i] || 0) >= 2) return toast('Bạn đã nghe tối đa 2 lần cho câu này.'); ctPlay(i); const y = window.scrollY; rerender(); window.scrollTo(0, y); },
  ctreplay(i) { const q = CT.qs[i]; if (q && q.hs != null) { const t = CT.plays[i]; ctPlay(i); CT.plays[i] = t; } },
  ctsubmit() { const left = CT.qs.filter((_, i) => CT.ans[i] == null).length; if (left && !confirm('Còn ' + left + ' câu chưa trả lời. Nộp bài ngay?')) return; ctFinish(false); rerender(); window.scrollTo(0, 0); },
  ctagain() { ctStop(); CT = {running: false, mode: null, qs: [], i: 0, ans: {}, plays: {}, end: 0, done: false, res: null}; rerender(); window.scrollTo(0, 0); },
  ctapply() { const p = pathState(); p.start = CT.res.level; p.placed = true; save(); toast('Đã đặt điểm bắt đầu Lộ trình: ' + CT.res.level); location.hash = '#path'; },
  ctref(kind, id) { if (kind === 'u') { location.hash = '#path'; A.punit(id); } else { location.hash = '#grammar'; G = {open: id, ans: {}}; rerender(); } window.scrollTo(0, 0); },
  /* rmit */
  rmtab(t) { RM.tab = t; RM.viewW = null; rerender(); window.scrollTo(0, 0); },
  rmsel(t) { RM.wsel = t; },
  rmopt(k, v) { RM[k] = v; },
  rmplan(i, v) { rmState().plan[i] = v; save(); rerender(); },
  rmview(i) { RM.viewW = i; rerender(); },
  rmdel(i) { if (confirm('Xóa bài viết này?')) { rmState().writings.splice(i, 1); save(); rerender(); } },
  rmmodel(t) { RM.modelTopic = t; rerender(); },
  rwrandom() { RM.wsel = DATA.rmit.topics[Math.floor(Math.random() * DATA.rmit.topics.length)][1]; A.rwstart(); },
  rwstart() {
    if (!RM.wsel) return toast('Hãy chọn một chủ đề (hoặc bấm “Chọn ngẫu nhiên”).');
    RM.w = {topic: RM.wsel, running: true, text: '', end: Date.now() + 30 * 60000, shown: {}};
    rerender(); window.scrollTo(0, 0);
    const tick = () => {
      const w = RM.w; if (!w || !w.running) return;
      const rem = Math.max(0, Math.round((w.end - Date.now()) / 1000)), el = $('#rmt'); if (el) el.textContent = fmtT(rem);
      const el2 = $('#rmphase'); if (el2) { const used = 1800 - rem; el2.textContent = used < 180 ? 'Gợi ý: lập dàn ý' : rem > 300 ? 'Đang viết' : 'Đọc lại & sửa lỗi'; }
      if (rem <= 300 && rem > 0 && !w.shown.five) { w.shown.five = 1; toast('⏰ Còn 5 phút: đọc lại và sửa lỗi'); }
      if (rem === 0) A.rwfinish(true);
    };
    rmCleanup(); if (RMT) clearInterval(RMT); RMT = setInterval(tick, 500); tick();
  },
  rwinput() { const t = $('#rw'); RM.w.text = t.value; const n = wcount(t.value); const el = $('#rwc'); if (el) el.textContent = n + ' từ'; },
  rwfinish(auto) {
    const w = RM.w; if (!w || !w.running) return;
    const ta = $('#rw'); if (ta) w.text = ta.value;
    if (!auto && wcount(w.text) < 15 && !confirm('Bài còn rất ngắn. Nộp bài ngay?')) return;
    w.running = false; if (RMT) clearInterval(RMT); RMT = null;
    w.result = analyzeWriting(w.text);
    const r = rmState(); r.writings.unshift({topic: w.topic, text: w.text, words: w.result.nW, lvl: w.result.lvl, date: todayStr()}); if (r.writings.length > 40) r.writings.length = 40;
    S.writing.unshift({title: 'Thi xếp lớp · ' + w.topic.slice(0, 40), text: w.text, words: w.result.nW, date: todayStr()});
    save(); markDone('write'); if (typeof addXP === 'function' && w.result.nW >= 40) addXP(20);
    if (auto) toast('⏰ Hết giờ! Bài đã được nộp tự động.');
    rerender(); window.scrollTo(0, 0);
  },
  rwrate(i, v) { const w = RM.w; w.rate ||= []; w.rate[i] = +v; },
  rwreset() { RM.w = null; rerender(); window.scrollTo(0, 0); },
  /* nói */
  async rsstart(mode) {
    const acc = ($('#rmacc') || {}).value || accent();
    const warm = [DATA.rmit.speakWarm[0], ...DATA.rmit.speakWarm.slice(1).sort(() => Math.random() - 0.5).slice(0, 4)];
    const card = DATA.rmit.speakCards[Math.floor(Math.random() * DATA.rmit.speakCards.length)];
    const extra = DATA.rmit.speakCards.filter(c => c !== card).flatMap(c => c.follow).sort(() => Math.random() - 0.5)[0];
    let steps;
    if (mode === 'ielts') {
      const p1 = DATA.speakP1.slice().sort(() => Math.random() - 0.5).slice(0, 5).map(q => ({stage: 'p1', kind: 'q', text: q, secs: 35}));
      const c2 = DATA.speakP2[Math.floor(Math.random() * DATA.speakP2.length)];
      steps = [...p1, {stage: 'card', kind: 'card', card: c2, text: 'Now I’m going to give you a topic and I’d like you to talk about it for one to two minutes. You have one minute to think about what you’re going to say. ' + c2.t, secs: 120}, ...c2.p3.concat(DATA.speakP2[Math.floor(Math.random() * DATA.speakP2.length)].p3[0]).map(q => ({stage: 'p3', kind: 'q', text: q, secs: 70})), {stage: 'wrap', kind: 'q', text: 'Thank you. That is the end of the speaking test.', secs: 5}];
    } else steps = [...warm.map(q => ({stage: 'warm', kind: 'q', text: q, secs: 50})), {stage: 'card', kind: 'card', card, text: 'Now I’d like you to talk about a topic for up to two minutes. You have one minute to prepare. ' + card.t, secs: 120}, ...[...card.follow, extra].map(q => ({stage: 'disc', kind: 'q', text: q, secs: 80})), {stage: 'wrap', kind: 'q', text: DATA.rmit.speakWrap[Math.floor(Math.random() * DATA.rmit.speakWrap.length)], secs: 40}];
    const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
    let stream = null;
    try { if (navigator.mediaDevices) stream = await navigator.mediaDevices.getUserMedia({audio: true}); } catch (e) { toast('Không truy cập được micro — hãy cho phép quyền micro. Phiên vẫn chạy nhưng không ghi âm.'); }
    rmCleanup(); if (RMT) clearInterval(RMT);
    RM.s = {steps, mode: mode || 'rmit', i: -1, ans: [], accent: acc, state: 'idle', end: Date.now() + (mode === 'ielts' ? 14 : 15) * 60000, hasRecog: !!Rec, cur: null};
    RMREC = {stream};
    RMT = setInterval(rmSTick, 500);
    rmNextStep();
  },
  rsbegin() { const s = RM.s; if (s && s.state === 'prep') rmBeginAnswer(); },
  rsnext() { rmNextStep(); },
  rsrepeat() { const s = RM.s; if (!s) return; const st = s.steps[s.i]; const prev = s.state; say(st.kind === 'card' ? st.card.t : st.text, 0.92, 1, null, s.accent); },
  rsfinish() { rmFinishSpeak(); },
  rsrate(i, v) { const s = RM.s; s.rate ||= []; s.rate[i] = +v; if (s.mode === 'ielts') { const vals = [0, 1, 2, 3].map(k => s.rate[k] || 6), band = Math.round(vals.reduce((a, b) => a + b, 0) / 4 * 2) / 2; $('#rsres').innerHTML = 'Tự chấm: Speaking band ≈ <b>' + band.toFixed(1) + '</b> ' + (band >= 6.5 ? '— đạt mục tiêu 6.5 🎉' : '— chưa tới 6.5, cần ' + (6.5 - band).toFixed(1) + ' band nữa') + '. Hãy chấm trung thực: nghe lại ghi âm và đối chiếu bài mẫu.'; const r = rmState(); if (r.speaking[0] && r.speaking[0].id === s.id) { r.speaking[0].avgRate = band.toFixed(1); save(); } return; } const vals = [0, 1, 2, 3, 4].map(k => s.rate[k] || 3), avg = vals.reduce((a, b) => a + b, 0) / 5, lvl = Math.max(1, Math.min(6, Math.round(avg))), L = lvlText(lvl); $('#rsres').innerHTML = 'Tự chấm trung bình <b>' + avg.toFixed(1) + '</b> → cấp ước lượng <b>' + lvl + ' (' + esc(L[1]) + ')</b>. ' + esc(L[2]); const r = rmState(); if (r.speaking[0] && r.speaking[0].id === s.id) { r.speaking[0].avgRate = avg.toFixed(1); save(); } },
  rsreset() { rmCleanup(); RM.s = null; if (RMT) clearInterval(RMT); RMT = null; rerender(); window.scrollTo(0, 0); },
  humanOpt(v) { S.settings.human = v; save(); toast(v ? 'Đã bật giọng người thật cho từ đơn' : 'Đã tắt: dùng giọng máy'); },
  vgroup(g) { VD.g = g; rerender(); window.scrollTo(0, 0); },
  vplay(id) { const el = document.getElementById('v_' + id); if (!el) return; el.onclick = null; el.style.backgroundImage = 'none'; el.classList.add('playing'); el.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&cc_load_policy=1&playsinline=1" title="video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>'; },
  /* câu người thật */
  hplay(i) { hsPlay(i); },
  hmode(m) { HS.mode = m; HS.checked = false; HS.revealed = false; rerender(); },
  hfilter(k, v) { HS[k] = v; HS.list = null; HS.checked = false; HS.revealed = false; rerender(); },
  hnext() { HS.i++; HS.checked = false; HS.revealed = false; rerender(); setTimeout(() => { const idx = hsList(); hsPlay(idx[HS.i % idx.length]); }, 150); },
  hreveal() { HS.revealed = !HS.revealed; rerender(); },
  hrate() { A.speed(); setTimeout(rerender, 50); },
  hcheck() {
    const idx = hsList(), s = DATA.hs[idx[HS.i % idx.length]], r = diffWordsHTML(s[0], $('#hdic').value);
    HS.checked = true; HS.done++; $('#hres').innerHTML = `<p>${r.html}</p><p><b>${r.pct}%</b> chính xác. <span class="ok">xanh</span> = đúng · <span class="miss">[ngoặc]</span> = bỏ sót · <span class="no">đỏ</span> = thừa/sai.</p><p class="muted">Đáp án: ${esc(s[0])}${s[1] ? ' — ' + esc(s[1]) : ''}</p>`;
    $('#hdic').disabled = true; if (HS.done >= 3) markDone('listen');
  },
  vshelf(k) { VSH = k; rerender(); },
  hword(w) { const l = hsFor(w, 1); if (!l.length) return toast('Chưa có câu người thật cho từ này.'); hsPlay(l[0]); toast('🎙️ ' + DATA.hs[l[0]][0]); },
  /* path */
  pback() { if (PT.mode === 'unit' && PT.step) { PT.step = null; } else { PT = {...PT, mode: 'home', unit: null, step: null, ans: {}, lists: {}, testQs: null, plResult: null, mlist: null}; } rerender(); window.scrollTo(0, 0); },
  punit(id) { PT = {...PT, mode: 'unit', unit: id, step: null, ans: {}, lists: {}, testQs: null, hideVi: false, showText: false, showModel: false}; rerender(); window.scrollTo(0, 0); },
  pstep(s) { PT.step = s; PT.ans = {}; PT.lists = {}; PT.testQs = null; PT.showModel = false; PT.showText = false; playToken++; if (window.speechSynthesis) speechSynthesis.cancel(); rerender(); window.scrollTo(0, 0); },
  plock() { toast('🔒 Hãy đạt ≥70% ở bài trước, hoặc bật “Học tự do”.'); },
  pfree(v) { pathState().free = v; save(); rerender(); },
  phide(v) { PT.hideVi = v; rerender(); },
  ptext(v) { PT.showText = v; rerender(); },
  pmodel() { PT.showModel = !PT.showModel; rerender(); },
  plisten() { sayQueue(DATA.units.find(x => x.id === PT.unit).listen.dialog); },
  pretest() { PT.ans = {}; PT.lists = {}; PT.testQs = null; rerender(); window.scrollTo(0, 0); },
  pvocab() { const u = DATA.units.find(x => x.id === PT.unit); u.vocab.forEach((v, i) => { const id = 'p_' + u.id + '_' + i; if (!S.custom.some(c => c.id === id)) S.custom.push({id, w: v[0], ipa: v[1], vi: v[2], ex: v[3], cat: 'path'}); }); finishStep('vocab'); toast('Đã thêm ' + u.vocab.length + ' từ vào thẻ ôn'); A.pstep(null); },
  pspeak() { finishStep('speak'); A.pstep(null); },
  pwc(min) { const n = wcount($('#pw').value); $('#pwc').textContent = n + ' / ' + min + ' từ'; $('#pwc').style.color = n >= min ? 'var(--ok)' : ''; },
  pwsave() {
    const u = DATA.units.find(x => x.id === PT.unit), text = $('#pw').value.trim(); if (!text) return toast('Bài viết đang trống.');
    const words = wcount(text); S.writing.unshift({title: u.lv + ' · ' + u.title, text, words, date: todayStr()}); save();
    if (words >= u.write.min * 0.8) { finishStep('write'); toast('💾 Đã lưu (' + words + ' từ). Xem bài mẫu để đối chiếu.'); } else toast('Đã lưu. Viết đủ ~' + Math.ceil(u.write.min * 0.8) + ' từ để hoàn thành bước.');
  },
  pa(key, i, j) {
    const qs = PT.lists[key], q = qs[i]; PT.ans[key + ':' + i] = j;
    if (j !== q.a) { if (key !== 'mist') addMistake(q); } else if (key === 'mist') { const p = pathState(); p.mistakes = p.mistakes.filter(m => m.q !== q.q); p.cleared = (p.cleared || 0) + 1; save(); }
    const n = qs.length;
    if (allAnswered(key, n)) {
      if (key === 'grammar') finishStep('grammar', {gscore: scoreOf(key, qs)});
      if (key === 'listen') finishStep('listen');
      if (key === 'read') finishStep('read');
      if (key === 'test') { const pct = Math.round(scoreOf(key, qs) / n * 100), d = uDone(DATA.units.find(x => x.id === PT.unit)); d.pct = Math.max(d.pct || 0, pct); if (pct >= 70 && !d.passed) { d.passed = true; d.test = true; addXP(XP_STEP.test); toast('🎉 Đạt bài kiểm tra! Đã mở khóa bài kế tiếp'); } save(); }
    }
    const y = window.scrollY; rerender(); window.scrollTo(0, y);
  },
  pplace() { PT = {...PT, mode: 'placement', ans: {}, plResult: null}; rerender(); window.scrollTo(0, 0); },
  plans(i, j) { PT.ans['pl:' + i] = j; const y = window.scrollY; rerender(); window.scrollTo(0, y); },
  plsubmit() {
    const by = {A1: 0, A2: 0, B1: 0, B2: 0, C1: 0}; DATA.placement.forEach((q, i) => { if (PT.ans['pl:' + i] === q.a) by[q.lv]++; });
    let start = 'C1'; for (const l of LV) { if (by[l] < 3) { start = l; break; } }
    PT.plResult = {by, start}; rerender(); window.scrollTo(0, document.body.scrollHeight);
  },
  plapply() { const p = pathState(); p.start = PT.plResult.start; p.placed = true; save(); toast('Đã chuyển đến cấp ' + p.start + ' — bắt đầu bài đầu tiên'); const first = DATA.units[startIdx()]; A.punit(first.id); },
  pmist() { PT = {...PT, mode: 'mistakes', ans: {}, lists: {}, mlist: pathState().mistakes.map(m => ({...m}))}; rerender(); window.scrollTo(0, 0); },
  /* topics */
  ttrack(id) { T = {track: id, unit: null, tab: 'words', quiz: null, hideB: false, showVi: true}; rerender(); window.scrollTo(0, 0); },
  tunit(id) { T.unit = id; T.tab = 'words'; T.quiz = null; rerender(); window.scrollTo(0, 0); },
  tback() { if (T.unit) T.unit = null; else T.track = null; T.quiz = null; playToken++; if (window.speechSynthesis) speechSynthesis.cancel(); rerender(); window.scrollTo(0, 0); },
  ttab(t) { T.tab = t; playToken++; if (window.speechSynthesis) speechSynthesis.cancel(); rerender(); },
  tadd(i) { const {u} = unitOf(T.unit), x = u.w[i], id = tkey(u.id, i); if (!isAdded(id)) S.custom.push({id, w: x[0], ipa: x[1], vi: x[2], ex: x[3], cat: 'topic'}); save(); toast('Đã thêm “' + x[0] + '” vào thẻ ôn'); rerender(); },
  taddall() { const {u} = unitOf(T.unit); u.w.forEach((x, i) => { const id = tkey(u.id, i); if (!isAdded(id)) S.custom.push({id, w: x[0], ipa: x[1], vi: x[2], ex: x[3], cat: 'topic'}); }); save(); toast('Đã thêm ' + u.w.length + ' từ vào thẻ ôn (mỗi ngày học tối đa 10 thẻ mới)'); rerender(); },
  tplay() { sayQueue(unitOf(T.unit).u.d); },
  tstop() { playToken++; if (window.speechSynthesis) speechSynthesis.cancel(); },
  tvi(v) { T.showVi = v; rerender(); },
  thideB(v) { T.hideB = v; rerender(); },
  tans(i, o) { T.quiz[i].ans = o; if (T.quiz.every(q => q.ans != null)) { const sc = T.quiz.filter(q => q.ans === q.en).length; (S.topicScore ||= {})[T.unit] = sc + '/' + T.quiz.length; save(); markDone('vocab'); } const y = window.scrollY; rerender(); window.scrollTo(0, y); },
  tretry() { T.quiz = null; rerender(); },
  /* vocab */
  vmode(m) { V.mode = m; V.queue = null; rerender(); },
  vstart() { V.queue = dueCards().concat(newCards()); V.i = 0; V.flip = false; V.reviewed = 0; rerender(); },
  vflip() { V.flip = true; rerender(); },
  vreset() { V.queue = null; rerender(); },
  grade(g) {
    const w = V.queue[V.i], k = S.vocab[w.id];
    if (!k) dayLog().newCount++;
    let box = k ? k.box : 0;
    if (g === 0) box = 1; else if (g === 1) box = Math.max(1, box); else box = Math.min(BOX_DAYS.length - 1, box + 1);
    S.vocab[w.id] = {box, due: g === 0 ? todayStr() : addDays(BOX_DAYS[box])};
    V.reviewed++;
    if (g === 0) V.queue.push(w);
    V.i++; V.flip = false; save();
    if (V.i >= V.queue.length || V.reviewed >= 5) markDone('vocab');
    rerender();
  },
  addWord() {
    const w = $('#nw').value.trim(), vi = $('#nv').value.trim(); if (!w || !vi) return toast('Cần nhập từ và nghĩa.');
    S.custom.push({id: 'c' + Date.now(), w, ipa: $('#ni').value.trim(), vi, ex: $('#ne').value.trim(), cat: 'my'}); save(); toast('Đã thêm “' + w + '”'); ['nw', 'ni', 'nv', 'ne'].forEach(i => $('#' + i).value = '');
  },
  /* grammar */
  gopen(id) { G = {open: id, ans: {}}; rerender(); window.scrollTo(0, 0); },
  gclose() { G = {open: null, ans: {}}; location.hash = '#grammar'; rerender(); },
  gretry() { G.ans = {}; rerender(); },
  gans(i, j) {
    G.ans[i] = j; const g = DATA.grammar.find(x => x.id === G.open);
    if (Object.keys(G.ans).length === g.quiz.length) { S.grammar[g.id] = g.quiz.filter((q, n) => G.ans[n] === q.a).length; save(); markDone('grammar'); }
    rerender();
  },
  /* pron */
  ptab(t) { P.tab = t; if (t === 'shadow') { HS.mode = 'shadow'; HS.checked = false; HS.revealed = false; } rerender(); },
  pdone() { markDone('pron'); toast('Đã ghi nhận luyện phát âm hôm nay'); },
  mic(t, id) { micTry(t, (said, pct) => { P.tries++; if (P.tries >= 3) markDone('pron'); const el = id && document.getElementById(id); const msg = `Bạn nói: “${said}” — khớp ${pct}% ${pct >= 80 ? '👏' : '🔁 thử lại'}`; if (el) el.textContent = msg; else toast(msg); }); },
  /* listen */
  lmin(n) { const k = todayStr(); S.listenMin[k] = (S.listenMin[k] || 0) + n; save(); if (S.listenMin[k] >= 10) markDone('listen'); rerender(); },
  dcheck() {
    const target = dictArr()[L.i], a = norm(target), b = norm($('#dic').value);
    const m = a.length, n = b.length, dp = Array.from({length: m + 1}, () => Array(n + 1).fill(0));
    for (let i = m - 1; i >= 0; i--) for (let j = n - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    let i = 0, j = 0, out = [];
    while (i < m && j < n) { if (a[i] === b[j]) { out.push(`<span class="ok">${esc(b[j])}</span>`); i++; j++; } else if (dp[i + 1][j] >= dp[i][j + 1]) { out.push(`<span class="miss">[${esc(a[i])}]</span>`); i++; } else { out.push(`<span class="no">${esc(b[j])}</span>`); j++; } }
    while (i < m) out.push(`<span class="miss">[${esc(a[i++])}]</span>`); while (j < n) out.push(`<span class="no">${esc(b[j++])}</span>`);
    const hit = dp[0][0], pct = Math.round(hit / m * 100);
    L.checked = true; L.done++;
    $('#dres').innerHTML = `<p>${out.join(' ')}</p><p><b>${pct}%</b> chính xác. <span class="ok">xanh</span> = đúng · <span class="miss">[ngoặc]</span> = bạn bỏ sót · <span class="no">đỏ</span> = thừa/sai.</p><p class="muted">Đáp án: ${esc(target)}</p>`;
    $('#dic').disabled = true; if (L.done >= 3) markDone('listen');
  },
  dnext() { L.i = (L.i + 1) % dictArr().length; L.checked = false; rerender(); },
  /* write */
  wcat(c) { W.cat = c; rerender(); },
  wopen(id) { W = {open: id, cat: W.cat, view: null}; rerender(); window.scrollTo(0, 0); },
  wielts(id, task) {
    const t = task === 1 ? DATA.ieltsTask1.find(x => x.id === id) : {title: 'IELTS Task 2 #' + (id + 1), prompt: DATA.ieltsTask2[id]};
    W = {cat: W.cat, view: null, open: 'ielts', ielts: {task, id, title: 'IELTS Writing Task ' + task + ' – ' + t.title.slice(0, 40), prompt: t.prompt, min: task === 1 ? 150 : 250, outline: task === 1 ? ['Introduction','Overview','Body 1','Body 2'] : ['Introduction','Body 1','Body 2','Conclusion'], phrases: task === 1 ? ['The table/chart illustrates…','Overall, it is clear that…','increased by… / rose to…','peaked at… in…','accounted for…'] : ['It is widely believed that…','In my opinion, …','For example, …','On the other hand, …','In conclusion, …']}};
    location.hash = '#write';
  },
  wback() { W.open = null; W.view = null; rerender(); },
  wcount(min) { const n = wcount($('#wt').value); $('#wc').textContent = n + ' / ' + min + ' từ'; $('#wc').style.color = n >= min ? 'var(--ok)' : ''; },
  wsave() {
    const t = DATA.writing.find(x => x.id === W.open) || W.ielts, text = $('#wt').value.trim(); if (!text) return toast('Bài viết đang trống.');
    const words = wcount(text); S.writing.unshift({title: t.title, text, words, date: todayStr()}); save();
    toast('💾 Đã lưu (' + words + ' từ)'); if (words >= t.min * 0.8) { markDone('write'); if (W.open === 'ielts') markDone('ielts'); }
    else toast('Đã lưu. Viết đủ ~' + Math.ceil(t.min * 0.8) + ' từ để hoàn thành nhiệm vụ.');
  },
  wcopy() { navigator.clipboard && navigator.clipboard.writeText($('#wt').value).then(() => toast('Đã sao chép.')); },
  wview(i) { W.view = i; rerender(); },
  wdel(i) { if (confirm('Xóa bài viết này?')) { S.writing.splice(i, 1); save(); rerender(); } },
  /* ielts */
  itab(t) { I.tab = t; I.r = null; rerender(); },
  ropen(id) { I.r = id; I.sub = false; I.ans = {}; rerender(); },
  rclose() { I.r = null; stopTimer(); rerender(); },
  rans(i, j) { I.ans[i] = j; const y = window.scrollY; rerender(); window.scrollTo(0, y); },
  rsubmit() {
    const r = DATA.ieltsReading.find(x => x.id === I.r); I.sub = true; stopTimer();
    S.reading[r.id] = r.qs.filter((q, i) => I.ans[i] === q.a).length + '/' + r.qs.length; save(); markDone('ielts'); rerender();
  },
  rtimer(m) { startTimer('tm', m * 60, () => toast('⏰ Hết giờ!')); },
  spart(p) { I.sp.part = p; stopTimer(); rerender(); },
  snext() { I.sp.q++; I.sp.cue++; stopTimer(); rerender(); },
  sprep() {
    startTimer('tm', 60, () => { toast('Hết giờ chuẩn bị – bắt đầu nói!'); const ph = $('#ph'); if (ph) ph.textContent = 'Nói 1–2 phút'; startTimer('tm', 120, () => toast('⏰ Hết giờ nói.')); A.rec(); });
    const ph = $('#ph'); if (ph) ph.textContent = 'Đang chuẩn bị…';
  },
  async rec() {
    if (!navigator.mediaDevices) return toast('Thiết bị không hỗ trợ thu âm.');
    try {
      const st = await navigator.mediaDevices.getUserMedia({audio: true}), ch = [];
      I.rec = new MediaRecorder(st); I.rec.ondataavailable = e => ch.push(e.data);
      I.rec.onstop = () => { st.getTracks().forEach(t => t.stop()); const au = $('#au'); if (au) { au.src = URL.createObjectURL(new Blob(ch, {type: I.rec.mimeType})); au.classList.remove('hide'); } markDone('ielts'); };
      I.rec.start(); toast('🔴 Đang thu âm…');
    } catch (e) { toast('Không truy cập được micro: hãy cho phép quyền micro.'); }
  },
  recstop() { if (I.rec && I.rec.state === 'recording') I.rec.stop(); },
  /* remind */
  askNotif() {
    if (!notifSupport) return toast('Thiết bị/trình duyệt này không hỗ trợ thông báo. Hãy dùng “Thêm vào Lịch”.');
    Notification.requestPermission().then(p => { toast(p === 'granted' ? '🔔 Đã bật thông báo' : 'Chưa được cấp quyền thông báo'); rerender(); });
  },
  testNotif() { notify('English Daily', 'Đây là thông báo thử. Hãy học 30 phút hôm nay nhé! 🚀'); },
  rday(id, d) { const r = S.reminders.find(x => x.id === id), i = r.days.indexOf(d); i >= 0 ? r.days.splice(i, 1) : r.days.push(d); save(); rerender(); },
  ron(id, v) { S.reminders.find(x => x.id === id).on = v; save(); },
  rdel(id) { S.reminders = S.reminders.filter(x => x.id !== id); save(); rerender(); },
  radd() { const t = $('#rt').value; if (!t) return toast('Chọn giờ.'); S.reminders.push({id: 'r' + Date.now(), time: t, days: [1,2,3,4,5,6,0], label: $('#rl').value || 'Học tiếng Anh!', on: true}); save(); rerender(); },
  ics(id) { const r = S.reminders.find(x => x.id === id); if (!r.days.length) return toast('Chọn ít nhất 1 ngày.'); download('english-daily-' + r.time.replace(':', '') + '.ics', icsFor(r), 'text/calendar'); toast('Mở file .ics vừa tải để thêm vào Lịch.'); },
  setVoice(a, v) { if (a === 'GB') S.settings.voiceGB = v; else S.settings.voiceUS = v; save(); },
  sayA(t, a) { say(t, 1, 1, null, a); },
  speed() { const i = SPEEDS.findIndex(x => Math.abs(x - speedF()) < 0.01), nx = SPEEDS[(i + 1) % SPEEDS.length]; S.settings.speed = nx; save(); updateSpeedBtn(); toast('Tốc độ đọc: ' + nx.toFixed(1) + '× (1.0 = bình thường)'); say('This is the new speaking speed. Listen carefully.'); },
  accent() { S.settings.accent = accent() === 'GB' ? 'US' : 'GB'; save(); updateAccentBtn(); toast('Giọng mặc định: ' + (accent() === 'GB' ? '🇬🇧 Anh-Anh (UK)' : '🇺🇸 Anh-Mỹ (US)')); say(accent() === 'GB' ? 'Hello! This is a British voice.' : 'Hello! This is an American voice.'); },
  backup() { download('english-daily-' + (curProfile().name.replace(/[^\w\-]+/g, '_') || 'hocvien') + '-' + todayStr() + '.json', JSON.stringify(S), 'application/json'); },
  backupAll() { const o = {reg: REG, data: {}}; REG.profiles.forEach(p => { try { o.data[p.id] = JSON.parse(localStorage.getItem(pkey(p.id)) || '{}'); } catch (e) {} }); download('english-daily-tat-ca-hoc-vien-' + todayStr() + '.json', JSON.stringify(o), 'application/json'); },
  restoreBak() { try { const b = JSON.parse(localStorage.getItem(KEY + '-bak')); if (!b) return toast('Chưa có bản dự phòng.'); if (!confirm('Khôi phục bản dự phòng tự động ngày ' + b.day + '? (tiến độ hiện tại sẽ bị thay)')) return; localStorage.setItem(KEY, b.data); load(); toast('Đã khôi phục.'); rerender(); } catch (e) { toast('Không khôi phục được.'); } },
  pswitch(id) { if (id === REG.active) { pClose(); return; } REG.active = id; regSave(); try { sessionStorage.setItem('ed-picked', '1'); } catch (e) {} location.reload(); },
  padd() { const n = (prompt('Tên học viên mới:') || '').trim().slice(0, 24); if (!n) return; const id = 'p' + Date.now().toString(36); REG.profiles.push({id, name: n, color: PCOL[REG.profiles.length % PCOL.length], created: Date.now()}); REG.active = id; regSave(); try { sessionStorage.setItem('ed-picked', '1'); } catch (e) {} location.reload(); },
  prename(id) { const p = REG.profiles.find(x => x.id === id); const n = (prompt('Tên mới:', p.name) || '').trim().slice(0, 24); if (!n) return; p.name = n; regSave(); pRender(); pChip(); },
  pdel(id) { const p = REG.profiles.find(x => x.id === id); if (REG.profiles.length < 2) return toast('Cần giữ ít nhất 1 học viên.'); if (!confirm('Xóa học viên "' + p.name + '" cùng toàn bộ tiến độ? Không thể hoàn tác (hãy sao lưu trước).')) return; try { localStorage.removeItem(pkey(id)); localStorage.removeItem(pkey(id) + '-bak'); } catch (e) {} REG.profiles = REG.profiles.filter(x => x.id !== id); if (REG.active === id) { REG.active = REG.profiles[0].id; regSave(); location.reload(); return; } regSave(); pRender(); },
  pshow() { pOpen(); },
  pclose() { pClose(); },
  restore(f) { if (!f) return; f.text().then(t => { try {
    const o = JSON.parse(t);
    if (o && o.reg && o.data) {  /* sao lưu tất cả học viên */
      if (!confirm('Khôi phục tất cả học viên từ file? Hồ sơ cùng mã sẽ bị ghi đè.')) return;
      o.reg.profiles.forEach(p => { if (!REG.profiles.some(x => x.id === p.id)) REG.profiles.push(p); localStorage.setItem(pkey(p.id), JSON.stringify(o.data[p.id] || {})); });
      regSave(); location.reload(); return;
    }
    if (!confirm('Khôi phục vào hồ sơ "' + curProfile().name + '"? Tiến độ hiện tại của hồ sơ này sẽ bị thay.')) return;
    S = o; load(); save(); toast('Đã khôi phục.'); rerender();
  } catch (e) { toast('File không hợp lệ.'); } }); },
  reset() { if (confirm('Xóa toàn bộ tiến độ và cài đặt của "' + curProfile().name + '"?')) { localStorage.removeItem(KEY); load(); save(); rerender(); } }
};

Object.assign(A, {
  excat(c) { EX.cat = c; rerender(); },
  exopen(id) { EX.open = id; exStop(); rerender(); window.scrollTo(0, 0); },
  exback() { EX.open = null; exStop(); rerender(); window.scrollTo(0, 0); },
  exstart() {
    exStop(); const end = Date.now() + 30 * 60000;
    const tick = () => { const el = document.getElementById('ext'); const left = Math.max(0, Math.round((end - Date.now()) / 1000));
      if (el) { el.textContent = String(Math.floor(left / 60)).padStart(2, '0') + ':' + String(left % 60).padStart(2, '0'); el.style.color = left <= 300 ? '#c92a2a' : ''; }
      if (left <= 0) { exStop(); toast('⏰ Hết 30 phút! Hãy hoàn thành câu đang viết rồi bấm Chấm điểm.'); } };
    tick(); EXT = setInterval(tick, 1000); toast('⏱️ Bắt đầu! Chúc bạn viết tốt.');
  },
  exstop() { if (EXT) clearInterval(EXT); EXT = null; toast('Đã dừng đồng hồ.'); },
  exlisten(acc) {
    const t = DATA.exam30.find(x => x.id === EX.open); if (!t) return;
    const lines = t.model.replace(/\n+/g, ' ').split(/(?<=[.!?])\s+/), tok = ++playToken;
    const next = i => { if (tok !== playToken || i >= lines.length) return; ttsSay(lines[i], 0.95, 1, () => setTimeout(() => next(i + 1), 200), acc); };
    next(0);
  },
  exsave() {
    const t = DATA.exam30.find(x => x.id === EX.open), text = ($('#wt').value || '').trim(); if (!t || !text) return toast('Bài viết đang trống.');
    const words = wcount(text); S.writing.unshift({title: '⏱️ ' + t.title, text, words, date: todayStr()}); save();
    toast('💾 Đã lưu (' + words + ' từ)'); if (words >= t.min * 0.8) markDone('write'); else toast('Đã lưu. Viết đủ ~' + Math.ceil(t.min * 0.8) + ' từ để hoàn thành nhiệm vụ.');
  }
});

/* =====================  GIÁO TRÌNH THINK 2 (khung theo mục lục sách; bài tập do app tự soạn)  ===================== */
const T2 = {u: null, tab: 'map', ans: {}, r: null};
const t2s = () => (S.think2 ||= {done: {}, quiz: {}});
const t2units = () => (DATA.think2 && DATA.think2.units) || [];
const t2x = u => (DATA.think2x && DATA.think2x[u.id]) || {};
const t2vocab = u => { const seen = new Set(); return u.vocab.concat(t2x(u).vocab || []).filter(v => !seen.has(v[0]) && seen.add(v[0])); };
const t2quiz = u => u.quiz.concat(t2x(u).quiz || []);
const T2_STEPS = [['map', '📋 Đọc lộ trình unit'], ['vocab', '🔤 Học xong từ vựng'], ['grammar', '📘 Đọc ghi chú ngữ pháp'], ['quiz', '✅ Bài kiểm tra ngữ pháp (đúng ≥ 80%)'], ['read', '📖 Bài đọc hiểu (đúng ≥ 80%)'], ['listen', '🎧 Bài nghe hiểu (đúng ≥ 80%)'], ['speak', '🗣️ Luyện nói & phát âm'], ['write', '✍️ Nộp bài viết'], ['book', '📖 Làm bài trong sách']];
const t2pct = u => { const d = t2s().done[u.id] || {}; return Math.round(T2_STEPS.filter(x => d[x[0]]).length / T2_STEPS.length * 100); };
function t2mark(uid, k, on = true) { const d = (t2s().done[uid] ||= {}); if (on) d[k] = true; else delete d[k]; save(); }
const t2bar = p => `<div style="height:8px;background:var(--bd);border-radius:6px;overflow:hidden"><div style="height:8px;width:${p}%;background:#4f7cff"></div></div>`;
const t2say = t => `<button class="acc" title="Nghe" onclick="A.sayA(this.dataset.t,'US')" data-t="${esc(t)}">🔊</button>`;
function t2Unit(u) {
  const tabs = [['map', '📋 Lộ trình'], ['vocab', '🔤 Từ vựng'], ['grammar', '📘 Ngữ pháp'], ['read', '📖 Đọc'], ['listen', '🎧 Nghe'], ['speak', '🗣️ Nói & phát âm'], ['write', '✍️ Viết']];
  const d = t2s().done[u.id] || {}, head = `<button class="btn ghost" onclick="A.t2back()">← Các unit</button><h1>${u.no ? 'Unit ' + u.no + ' · ' : ''}${esc(u.title)}</h1><p class="muted">${esc(u.vi)} · sách trang ${esc(u.pages)} · tiến độ ${t2pct(u)}%</p>${t2bar(t2pct(u))}
    <div class="tabs wrap" style="margin-top:10px">${tabs.map(t => `<button class="${T2.tab === t[0] ? 'on' : ''}" onclick="A.t2tab('${t[0]}')">${t[1]}</button>`).join('')}</div>`;
  const li = a => `<ul>${a.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
  if (T2.tab === 'vocab') return head + `<div class="card"><table class="tbl"><tr><th>Từ (${t2vocab(u).length})</th><th>Nghĩa & ví dụ</th><th></th></tr>${t2vocab(u).map((v, i) => `<tr><td><b>${esc(v[0])}</b><br>${sayBtns(v[0])}</td><td>${esc(v[1])}<br><small class="muted">${esc(v[2])}</small> ${t2say(v[2])}</td><td><button class="btn sm ghost" title="Thêm vào ôn từ vựng" onclick="A.t2add(${i})">➕</button></td></tr>`).join('')}</table>
    <div class="row"><button class="btn sm" onclick="A.t2addall()">➕ Thêm tất cả vào mục Từ vựng (ôn cách quãng)</button><button class="btn" onclick="A.t2done('vocab')">${d.vocab ? '✅ Đã học xong' : 'Tôi đã học xong từ vựng'}</button></div></div>`;
  if (T2.tab === 'grammar') {
    const x = t2x(u), best = t2s().quiz[u.id];
    return head + u.notes.map(n => `<div class="card"><h3>${esc(n.h)}</h3><p>${esc(n.t)}</p>${n.ex.map(e => `<p class="muted">▸ ${esc(e)} ${t2say(e)}</p>`).join('')}</div>`).join('') +
      (x.mistakes ? `<div class="card"><h3>⚠️ Lỗi thường gặp</h3>${x.mistakes.map(m => `<p>❌ <s>${esc(m.w)}</s><br>✅ <b>${esc(m.r)}</b> ${t2say(m.r)}<br><small class="muted">${esc(m.why)}</small></p>`).join('')}</div>` : '') +
      `<div class="row"><button class="btn sm" onclick="A.t2done('grammar')">${d.grammar ? '✅ Đã đọc xong ghi chú' : 'Tôi đã đọc xong ghi chú'}</button></div>
      <h2>✅ Bài tập ngữ pháp${best ? ` <small class="muted">· điểm cao nhất ${best.score}/${best.total}</small>` : ''}</h2>` + t2qblock(u.id + ':q', t2quiz(u));
  }
  if (T2.tab === 'read') {
    const x = t2x(u); if (!x.reading) return head + '<div class="card">Chưa có bài đọc.</div>';
    return head + `<div class="card"><h3>📖 ${esc(x.reading.title)}</h3><div class="row"><button class="btn sm" onclick="A.t2speakText('US')">🔊 Nghe đọc (Mỹ)</button><button class="btn sm ghost" onclick="A.t2speakText('GB')">🔊 Nghe đọc (Anh)</button><button class="btn sm ghost" onclick="A.tstop()">⏹️ Dừng</button></div>
      ${x.reading.text.split(/\n+/).map(p => `<p>${esc(p)}</p>`).join('')}<p class="muted">Bài đọc do app soạn; nhân vật và sự kiện là hư cấu.</p></div><h2>Câu hỏi đọc hiểu</h2>` + t2qblock(u.id + ':read', x.reading.qs);
  }
  if (T2.tab === 'listen') {
    const x = t2x(u); if (!x.listen) return head + '<div class="card">Chưa có bài nghe.</div>';
    return head + auCard(u) + `<div class="card"><h3>🎧 Hội thoại luyện nghe do app soạn: ${esc(x.listen.title)}</h3><p class="muted">Máy đọc hai giọng (A và B). Nghe trước, trả lời câu hỏi, rồi mới mở lời thoại để đối chiếu.</p>
      <div class="row"><button class="btn" onclick="A.t2dialog('US')">▶️ Nghe (giọng Mỹ)</button><button class="btn ghost" onclick="A.t2dialog('GB')">▶️ Nghe (giọng Anh)</button><button class="btn sm ghost" onclick="A.tstop()">⏹️ Dừng</button></div>
      <details><summary><b>Xem lời thoại</b></summary>${x.listen.lines.map(l => `<p><b>${l[0]}:</b> ${esc(l[1])} ${t2say(l[1])}</p>`).join('')}</details></div><h2>Câu hỏi nghe hiểu</h2>` + t2qblock(u.id + ':listen', x.listen.qs);
  }
  if (T2.tab === 'speak') return head + `<div class="card"><h3>🗣️ Đề luyện nói</h3>${li(u.speak)}<p class="muted">Mỗi đề nói 30–60 giây. Có thể quay lại giọng nói của mình bằng điện thoại và nghe lại để tự sửa.</p></div>
    <div class="card"><h3>🔊 Phát âm: ${esc(u.map.pron)}</h3><p>${esc(u.pron.tip)}</p><table class="tbl">${u.pron.words.map(w => `<tr><td><b>${esc(w)}</b></td><td>${sayBtns(w)}</td><td><button class="btn sm ghost" onclick="A.t2mic(this.dataset.w)" data-w="${esc(w)}">🎙️ Đọc thử</button></td></tr>`).join('')}</table>
    <div id="t2mic" class="muted"></div><div class="row"><button class="btn" onclick="A.t2done('speak')">${d.speak ? '✅ Đã luyện xong' : 'Tôi đã luyện xong'}</button></div></div>`;
  if (T2.tab === 'write') return head + `<div class="card"><h3>✍️ ${esc(u.write.title)}</h3><p><b>Đề bài:</b> ${esc(u.write.prompt)}</p><small class="muted">Tối thiểu ${u.write.min} từ</small></div>
    <div class="card"><h3>📐 Dàn ý gợi ý</h3><ol>${u.write.outline.map(o => `<li>${esc(o)}</li>`).join('')}</ol></div>
    <div class="card"><textarea id="wt" rows="12" placeholder="Viết bài của bạn ở đây (tiếng Anh)…" oninput="A.wcount(${u.write.min})"></textarea>
    <div class="row"><span id="wc" class="muted">0 / ${u.write.min} từ</span><button class="btn" onclick="A.gstart('gbox','wt','essay',${u.write.min})">📝 Chấm điểm & sửa lỗi</button><button class="btn" onclick="A.t2save()">💾 Lưu bài</button></div><div id="gbox"></div></div>`;
  /* tab lộ trình */
  const m = u.map;
  return head + `<div class="grid two"><div class="card"><h3>🎯 Chức năng giao tiếp</h3>${li(m.functions)}</div><div class="card"><h3>📘 Ngữ pháp</h3>${li(m.grammar)}</div>
    <div class="card"><h3>🔤 Từ vựng</h3>${li(m.vocab)}</div><div class="card"><h3>📚 Kỹ năng trong sách</h3>${li(m.skills)}<p class="muted">🗣️ Phát âm: ${esc(m.pron)}<br>💡 ${esc(m.think)}</p></div></div>
    <div class="card"><h3>🗓️ Kế hoạch gợi ý trong 7 ngày</h3><ol><li>Từ vựng: học 10 từ, thêm vào mục Từ vựng.</li><li>Ngữ pháp: đọc ghi chú, tự đặt 3 câu ví dụ.</li><li>Làm bài kiểm tra ngữ pháp, sửa lỗi sai.</li><li>Nói & phát âm: luyện 3 đề nói, đọc thử các từ phát âm.</li><li>Đọc và nghe trong sách (trang ${esc(u.pages)}).</li><li>Viết bài và nhờ app chấm, sửa lỗi.</li><li>Ôn lại từ vựng, làm lại bài kiểm tra, làm phần Review trong sách (nếu có).</li></ol></div>
${u.extra && Object.keys(u.extra).length ? `<div class="card"><h3>📖 Còn có trong sách</h3><ul>${[u.extra.welcome, u.extra.exam, u.extra.pron, u.extra.git, u.extra.speakAct].filter(Boolean).map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>` : ''}
    <div class="card"><h3>✅ Danh sách việc cần làm</h3>${T2_STEPS.map(x => `<label class="chk"><input type="checkbox" ${d[x[0]] ? 'checked' : ''} onchange="A.t2chk('${x[0]}',this.checked)"> ${esc(x[1])}${x[0] === 'book' ? ' <small class="muted">(sách trang ' + esc(u.pages) + ')</small>' : ''}</label>`).join('')}</div>`;
}
function t2qblock(key, qs) {
  const A_ = T2.ans[key] || {}, n = qs.length, all = Object.keys(A_).length === n, score = qs.filter((q, i) => A_[i] === q.a).length, need = Math.ceil(n * 0.8);
  return qs.map((q, i) => `<div class="card"><b>${i + 1}. ${esc(q.q)}</b><div class="row" style="flex-wrap:wrap">${q.o.map((o, j) => { const picked = A_[i] === j, st = A_[i] == null ? '' : (j === q.a ? 'background:#d3f9d8;color:#0b5d1e' : (picked ? 'background:#ffe3e3;color:#a61e1e' : '')); return `<button class="btn sm ghost" style="${st}" ${A_[i] != null ? 'disabled' : ''} onclick="A.t2ans('${key}',${i},${j})">${esc(o)}</button>`; }).join('')}</div>${A_[i] != null ? `<small class="muted">${A_[i] === q.a ? '✔ Đúng. ' : '✘ Chưa đúng. '}${esc(q.e)}</small>` : ''}</div>`).join('') +
    (all ? `<div class="card center"><h3>Kết quả: ${score}/${n} ${score >= need ? '🎉' : '💪'}</h3><p class="muted">${score >= need ? 'Tốt lắm! Bạn đã đạt yêu cầu (≥ 80%).' : 'Ôn lại rồi làm lại để đạt ít nhất ' + need + '/' + n + '.'}</p><button class="btn" onclick="A.t2redo('${key}')">Làm lại</button></div>` : '');
}
function t2Review() {
  const r = (DATA.think2r || []).find(x => x.id === T2.r); if (!r) { T2.r = null; return views.think2.render(); }
  const best = (t2s().review || {})[r.id];
  return `<button class="btn ghost" onclick="A.t2rback()">← Các unit</button><h1>📝 ${esc(r.title)}</h1><p class="muted">Sách trang ${esc(r.pages)} · ${r.qs.length} câu${best ? ' · điểm cao nhất ' + best.score + '/' + best.total : ''}</p>` + t2qblock('rv:' + r.id, r.qs);
}
views.think2 = {render() {
  if (T2.r) return t2Review();
  const us = t2units(); if (!us.length) return '<h1>📚 Giáo trình Think 2</h1><div class="card">Chưa tải được dữ liệu giáo trình.</div>';
  if (T2.u) { const u = us.find(x => x.id === T2.u); if (u) { if (T2.tab === 'map' && !(t2s().done[u.id] || {}).map) { /* mở lộ trình = đã đọc */ t2s().done[u.id] = Object.assign(t2s().done[u.id] || {}, {map: true}); save(); } return t2Unit(u); } T2.u = null; }
  const b = DATA.think2.book, total = Math.round(us.reduce((a, u) => a + t2pct(u), 0) / us.length);
  return `<h1>📚 Giáo trình Think 2 (B1)</h1><div class="card"><b>${esc(b.title)}</b><br><small>${esc(b.authors)} · ${esc(b.pub)}</small>
    <p class="muted">Module học theo <b>khung chương trình</b> của sách (tên unit, ngữ pháp, từ vựng, chức năng, kỹ năng, số trang). Từ vựng, ghi chú, bài kiểm tra, đề nói và đề viết trong module do app <b>tự soạn</b> để luyện thêm; các bài đọc, nghe và bài tập gốc vẫn làm trong sách của bạn (số trang ghi sẵn ở mỗi unit).</p>
    ${t2bar(total)}<small class="muted">Tiến độ toàn giáo trình: ${total}%</small></div>
    ${auSetup()}
    <h2>📚 Các unit</h2><div class="grid two">${us.map(u => `<a class="card link" href="#think2" onclick="A.t2open('${u.id}')"><small class="muted">${u.no ? 'Unit ' + u.no : 'Mở đầu'} · trang ${esc(u.pages)}</small><h3>${esc(u.title)}</h3><small>${esc(u.vi)}</small><br><small class="muted">${esc(u.map.grammar[0] || '')}</small>${t2bar(t2pct(u))}<small class="muted">${t2pct(u)}% hoàn thành</small></a>`).join('')}</div>
    <h2>📝 Test yourself (ôn theo cặp unit)</h2><div class="grid two">${(DATA.think2r || []).map(r => { const b = (t2s().review || {})[r.id]; return `<a class="card link" href="#think2" onclick="A.t2ropen('${r.id}')"><h3>${esc(r.title)}</h3><small class="muted">sách trang ${esc(r.pages)} · ${r.qs.length} câu${b ? ' · cao nhất ' + b.score + '/' + b.total : ''}</small></a>`; }).join('')}</div>`;
}};
Object.assign(A, {
  t2open(id) { T2.u = id; T2.tab = 'map'; rerender(); window.scrollTo(0, 0); },
  t2back() { T2.u = null; rerender(); window.scrollTo(0, 0); },
  t2tab(t) { T2.tab = t; rerender(); window.scrollTo(0, 0); },
  t2chk(k, on) { t2mark(T2.u, k, on); rerender(); },
  t2done(k) { t2mark(T2.u, k, true); toast('✅ Đã đánh dấu hoàn thành'); rerender(); },
  t2add(i) {
    const u = t2units().find(x => x.id === T2.u), v = t2vocab(u)[i], id = 't2' + u.id + '_' + v[0].replace(/\W+/g, '_');
    if (S.custom.some(c => c.id === id)) return toast('Từ này đã có trong mục Từ vựng.');
    S.custom.push({id, w: v[0], ipa: '', vi: v[1], ex: v[2], cat: 'my'}); save(); toast('➕ Đã thêm “' + v[0] + '” vào ôn từ vựng.');
  },
  t2addall() {
    const u = t2units().find(x => x.id === T2.u); let n = 0;
    t2vocab(u).forEach(v => { const id = 't2' + u.id + '_' + v[0].replace(/\W+/g, '_'); if (!S.custom.some(c => c.id === id)) { S.custom.push({id, w: v[0], ipa: '', vi: v[1], ex: v[2], cat: 'my'}); n++; } });
    save(); toast(n ? '➕ Đã thêm ' + n + ' từ vào mục Từ vựng.' : 'Các từ này đã có sẵn.');
  },
  t2ans(key, i, j) {
    const rv = key.startsWith('rv:'), uid = key.split(':')[0], kind = key.split(':')[1];
    const qs = rv ? DATA.think2r.find(x => x.id === key.slice(3)).qs : (kind === 'q' ? t2quiz(t2units().find(x => x.id === uid)) : (kind === 'read' ? t2x(t2units().find(x => x.id === uid)).reading.qs : t2x(t2units().find(x => x.id === uid)).listen.qs));
    const a = (T2.ans[key] ||= {}); if (a[i] != null) return; a[i] = j;
    if (Object.keys(a).length === qs.length) {
      const score = qs.filter((q, k) => a[k] === q.a).length, ok = score >= Math.ceil(qs.length * 0.8);
      if (rv) { const rid = key.slice(3), rr = (t2s().review ||= {}); if (!rr[rid] || score > rr[rid].score) rr[rid] = {score, total: qs.length, date: todayStr()}; save(); }
      else if (kind === 'q') { const best = t2s().quiz[uid]; if (!best || score > best.score) t2s().quiz[uid] = {score, total: qs.length, date: todayStr()}; if (ok) { t2mark(uid, 'quiz'); markDone('grammar'); } else save(); }
      else if (ok) t2mark(uid, kind); else save();
    }
    rerender();
  },
  t2redo(key) { delete T2.ans[key]; rerender(); },
  t2ropen(id) { T2.r = id; rerender(); window.scrollTo(0, 0); },
  t2rback() { T2.r = null; rerender(); window.scrollTo(0, 0); },
  t2speakText(acc) {
    const u = t2units().find(x => x.id === T2.u), txt = t2x(u).reading.text.replace(/\n+/g, ' '), lines = txt.split(/(?<=[.!?])\s+/), tok = ++playToken;
    const next = i => { if (tok !== playToken || i >= lines.length) return; ttsSay(lines[i], 0.95, 1, () => setTimeout(() => next(i + 1), 200), acc); }; next(0);
  },
  t2dialog(acc) {
    const u = t2units().find(x => x.id === T2.u), lines = t2x(u).listen.lines, tok = ++playToken;
    const next = i => { if (tok !== playToken || i >= lines.length) return; ttsSay(lines[i][1], 0.95, lines[i][0] === 'A' ? 1 : 1.3, () => setTimeout(() => next(i + 1), 450), acc); }; next(0);
  },
  t2mic(w) { micTry(w, (said, pct) => { const el = document.getElementById('t2mic'); if (el) el.innerHTML = `Bạn nói: “${esc(said)}” → khớp <b>${pct}%</b> ${pct >= 80 ? '🎉 Rất tốt!' : '— nghe lại mẫu rồi thử lần nữa.'}`; }); },
  t2save() {
    const u = t2units().find(x => x.id === T2.u), text = ($('#wt').value || '').trim(); if (!text) return toast('Bài viết đang trống.');
    const words = wcount(text); S.writing.unshift({title: '📚 Think 2 · ' + (u.no ? 'Unit ' + u.no + ': ' : '') + u.write.title, text, words, date: todayStr()}); save();
    if (words >= u.write.min * 0.8) { t2mark(u.id, 'write'); markDone('write'); toast('💾 Đã lưu (' + words + ' từ) và đánh dấu hoàn thành.'); }
    else toast('Đã lưu. Viết đủ ~' + Math.ceil(u.write.min * 0.8) + ' từ để hoàn thành bước này.');
  }
});

/* =====================  AUDIO SÁCH (chạy riêng trên máy: thư mục do người học chọn, không tải lên đâu cả)  ===================== */
const AU = {dir: null, files: {}, pending: false, url: null, cur: null, map: null, rate: 1, msg: ''};
const AU_KEY = 'english-daily-t2audio-map';  /* thiết lập riêng của thiết bị, không nằm trong tiến độ học */
const auKey = (cd, n) => cd + '.' + String(n).padStart(2, '0');
function auMap() {
  if (AU.map) return AU.map;
  const m = {}, R = (DATA.think2audio || {}).ranges || {};
  Object.keys(R).forEach(uid => R[uid].forEach(seg => { const [c1, n1] = seg[0].split('.').map(Number), n2 = Number(seg[1].split('.')[1]); for (let n = n1; n <= n2; n++) m[auKey(c1, n)] = uid; }));
  try { Object.assign(m, JSON.parse(localStorage.getItem(AU_KEY) || '{}')); } catch (e) {}
  return (AU.map = m);
}
const auTracks = uid => Object.keys(auMap()).filter(k => auMap()[k] === uid).sort((a, b) => Number(a.split('.')[0]) - Number(b.split('.')[0]) || Number(a.split('.')[1]) - Number(b.split('.')[1]));
const auCount = () => Object.keys(AU.files).length;
async function auScan(dir) {
  const files = {};
  async function walk(d, depth) { for await (const [name, h] of d.entries()) { if (h.kind === 'directory') { if (depth < 3) await walk(h, depth + 1); } else { const m = name.match(/CD(\d)[_\- ]?(\d{1,2})\.(mp3|m4a|wav|ogg)$/i); if (m) files[auKey(m[1], +m[2])] = h; } } }
  await walk(dir, 0); return files;
}
async function auInit() {
  try {
    const d = await idbGet('auDir'); if (!d) return;
    AU.dir = d; const p = await d.queryPermission({mode: 'read'});
    if (p === 'granted') { AU.files = await auScan(d); if (location.hash === '#think2') rerender(); } else AU.pending = true;
  } catch (e) {}
}
function auCard(u) {
  const ks = auTracks(u.id), pages = (DATA.think2audio || {}).pages || {};
  if (!auCount()) return `<div class="card"><h3>🎵 Audio trong sách</h3><p class="muted">Chưa nối thư mục audio. Vào trang <b>Giáo trình Think 2</b> (bấm “← Các unit”) và bấm <b>“Chọn thư mục audio”</b>. Audio chỉ được phát ngay trên máy bạn.</p></div>`;
  return `<div class="card"><h3>🎵 Audio trong sách (${ks.length} bài gán cho unit này)</h3><p class="muted">Các bài này do bạn có sẵn trên máy; app chỉ phát lại, không tải lên đâu. Nếu thấy một bài không thuộc unit này, hãy chỉnh ở phần “Gán audio cho unit” ở trang chính.</p>
    <div class="row"><audio id="aup" controls ${AU.url ? 'src="' + AU.url + '"' : ''} style="width:100%"></audio></div>
    <div class="row"><small class="muted">Tốc độ:</small>${[0.75, 0.9, 1].map(r => `<button class="btn sm ${AU.rate === r ? '' : 'ghost'}" onclick="A.aurate(${r})">${r}×</button>`).join('')}${AU.cur ? `<small class="muted">Đang chọn: CD${AU.cur.split('.')[0]} · bài ${Number(AU.cur.split('.')[1])}</small>` : ''}</div>
    <table class="tbl">${ks.map(k => `<tr><td><b>CD${k.split('.')[0]} · bài ${Number(k.split('.')[1])}</b><br><small class="muted">${esc(pages[k] || '')}</small></td><td>${AU.files[k] ? '' : '<small class="muted">(không thấy file)</small>'}</td><td><button class="btn sm ${AU.cur === k ? '' : 'ghost'}" ${AU.files[k] ? '' : 'disabled'} onclick="A.auplay('${k}')">▶️ Nghe</button></td></tr>`).join('')}</table></div>`;
}
function auSetup() {
  const sup = !!window.showDirectoryPicker, n = auCount(), m = auMap();
  const rows = ['1', '2'].map(cd => { const lim = cd === '1' ? 44 : 36; let h = ''; for (let i = 1; i <= lim; i++) { const k = auKey(cd, i); h += `<tr><td>CD${cd} · bài ${i}</td><td><select onchange="A.aumapset('${k}',this.value)"><option value="">—</option>${t2units().map(u => `<option value="${u.id}" ${m[k] === u.id ? 'selected' : ''}>${u.no ? 'Unit ' + u.no : 'Welcome'}</option>`).join('')}</select></td><td>${AU.files[k] ? '✔' : ''}</td></tr>`; } return h; }).join('');
  return `<div class="card"><h3>🎵 Audio của sách (chỉ chạy trên máy này)</h3>
    <p class="muted">Chọn thư mục chứa các file <code>Think_SB2_CD1_01.mp3</code>… Audio được đọc ngay từ máy bạn, <b>không tải lên mạng</b> và không nằm trong app công khai. ${sup ? '' : 'Trình duyệt này không hỗ trợ lưu thư mục; mỗi lần mở app bạn cần chọn lại (khuyên dùng Chrome/Edge trên máy tính).'}</p>
    <div class="row">${sup ? '<button class="btn" onclick="A.aupick()">📂 Chọn thư mục audio</button>' : '<label class="btn">📂 Chọn thư mục audio<input type="file" webkitdirectory multiple hidden onchange="A.aufiles(this.files)"></label>'}${AU.pending ? '<button class="btn" onclick="A.aureconnect()">🔓 Cho phép đọc lại thư mục</button>' : ''}${n ? '<button class="btn sm ghost" onclick="A.auforget()">Bỏ kết nối</button>' : ''}</div>
    <p>${n ? `✅ Đã nối <b>${n}</b> file audio.` : (AU.pending ? '⚠️ Cần bấm “Cho phép đọc lại thư mục” (Chrome yêu cầu mỗi lần mở lại).' : 'Chưa nối thư mục.')} ${AU.msg ? esc(AU.msg) : ''}</p>
    <details><summary><b>Gán audio cho unit</b> (đã gợi ý sẵn theo trang sách – chỉnh nếu thấy chưa khớp)</summary><p class="muted">Gợi ý này suy ra từ số trang trong sách, nên một vài bài có thể lệch. Nghe thử trong từng unit rồi đổi ở đây nếu cần.</p>
    <div class="row"><button class="btn sm ghost" onclick="A.aumapreset()">↩️ Khôi phục gợi ý ban đầu</button></div><table class="tbl">${rows}</table></details></div>`;
}
Object.assign(A, {
  async aupick() {
    try { const d = await showDirectoryPicker({mode: 'read'}); AU.dir = d; AU.pending = false; await idbSet('auDir', d); AU.files = await auScan(d); AU.msg = auCount() ? '' : 'Không thấy file Think_SB2_CD…. Hãy chọn thư mục chứa CD1 và CD2.'; } catch (e) { return; }
    rerender();
  },
  async aureconnect() {
    try { const p = await AU.dir.requestPermission({mode: 'read'}); if (p === 'granted') { AU.files = await auScan(AU.dir); AU.pending = false; } } catch (e) { toast('Không mở lại được thư mục. Hãy chọn lại.'); }
    rerender();
  },
  aufiles(list) { const files = {}; Array.from(list).forEach(f => { const m = f.name.match(/CD(\d)[_\- ]?(\d{1,2})\.(mp3|m4a|wav|ogg)$/i); if (m) files[auKey(m[1], +m[2])] = f; }); AU.files = files; AU.msg = auCount() ? '' : 'Không thấy file Think_SB2_CD….'; rerender(); },
  async auforget() { AU.dir = null; AU.files = {}; AU.pending = false; if (AU.audio) { try { AU.audio.pause(); } catch (e) {} } AU.url = null; AU.cur = null; await idbSet('auDir', null); rerender(); },
  async auplay(k) {
    const x = AU.files[k]; if (!x) return toast('Chưa có file audio này.');
    try {
      toast('⏳ Đang mở bài…'); const f = x.getFile ? await x.getFile() : x;
      if (AU.url) URL.revokeObjectURL(AU.url); AU.url = URL.createObjectURL(f); AU.cur = k; if (window.speechSynthesis) speechSynthesis.cancel();
      rerender(); const a = document.getElementById('aup'); if (a) { a.playbackRate = AU.rate; a.play().catch(() => {}); }
    } catch (e) { toast('Không mở được file. Nếu file đang “chỉ có trên Drive”, hãy chọn “Tải xuống/Khả dụng ngoại tuyến” trong Google Drive.'); }
  },
  aurate(r) { AU.rate = r; const a = document.getElementById('aup'); if (a) a.playbackRate = r; rerender(); const b = document.getElementById('aup'); if (b) b.playbackRate = r; },
  aumapset(k, uid) { const o = JSON.parse(localStorage.getItem(AU_KEY) || '{}'); o[k] = uid; try { localStorage.setItem(AU_KEY, JSON.stringify(o)); } catch (e) {} AU.map = null; auMap(); },
  aumapreset() { try { localStorage.removeItem(AU_KEY); } catch (e) {} AU.map = null; rerender(); toast('Đã khôi phục gợi ý ban đầu.'); }
});
auInit();

/* =====================  NGỮ PHÁP: 13 THÌ + 10 TỪ LOẠI (công thức, giải thích, 45 bài mỗi thì)  ===================== */
let GM = 'lessons';
const TG = {id: null, tab: 'learn', set: 0, vals: {}, shown: {}};
const PG = {id: null, ex: false, set: 0, ans: {}};
const TS = () => DATA.tenseGuide, TE = () => DATA.tenseEx || {};
const tsay = t => `<button class="acc" title="Nghe" onclick="A.sayA(this.dataset.t,'US')" data-t="${esc(t)}">🔊</button>`;
const gmTabs = () => `<div class="tabs wrap">${[['lessons', '📚 Bài học'], ['tenses', '🕒 12 thì: công thức & bài tập'], ['pos', '🔤 10 từ loại']].map(t => `<button class="${GM === t[0] ? 'on' : ''}" onclick="A.gmode('${t[0]}')">${t[1]}</button>`).join('')}</div>`;
const tprog = id => { const r = (S.tenseEx || {})[id] || {}, n = Object.keys(r).length, ok = Object.values(r).filter(Boolean).length; return {n, ok, total: (TE()[id] || []).length}; };
const tbar = (a, b) => `<div style="height:8px;background:var(--bd);border-radius:6px;overflow:hidden"><div style="height:8px;width:${b ? Math.round(a / b * 100) : 0}%;background:#4f7cff"></div></div>`;
function tenseView() {
  const G_ = TS(); if (!G_) return `<h1>📘 Ngữ pháp</h1>${gmTabs()}<div class="card">Chưa tải được dữ liệu.</div>`;
  if (TG.id) return tenseDetail(G_.tenses[TG.id]);
  const m = G_.matrix, total = Object.keys(TE()).reduce((a, k) => a + tprog(k).ok, 0), all = Object.keys(TE()).reduce((a, k) => a + (TE()[k] || []).length, 0);
  return `<h1>📘 Ngữ pháp</h1>${gmTabs()}
   <div class="card"><h2>🧩 Bảng tổng hợp 12 thì (nhìn một lần là nhớ cấu trúc)</h2><p>${esc(m.intro)}</p>
    <div style="overflow-x:auto"><table class="tbl"><tr><th></th>${m.cols.map(c => `<th>${esc(c)}</th>`).join('')}</tr>${m.rows.map(r => `<tr><td><b>${esc(r[0])}</b></td>${r.slice(1).map(c => `<td><code>${esc(c)}</code></td>`).join('')}</tr>`).join('')}</table></div>
    <h3>💡 Mẹo nhớ</h3><ul>${m.memo.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
   <details class="card"><summary><b>❓ Khi nói/viết, chọn thì nào? (hỏi tự nhiên)</b></summary><table class="tbl">${m.choose.map(c => `<tr><td>${esc(c[0])}</td><td><b>${esc(c[1])}</b></td></tr>`).join('')}</table></details>
   <details class="card"><summary><b>✏️ Quy tắc chia động từ: -s/-es, -ing, -ed</b></summary><h4>Thêm -s / -es (hiện tại đơn, ngôi he/she/it)</h4><ul>${G_.spelling.s.map(x => `<li>${esc(x)}</li>`).join('')}</ul><h4>Thêm -ing</h4><ul>${G_.spelling.ing.map(x => `<li>${esc(x)}</li>`).join('')}</ul><h4>Thêm -ed (quá khứ, quá khứ phân từ có quy tắc)</h4><ul>${G_.spelling.ed.map(x => `<li>${esc(x)}</li>`).join('')}</ul></details>
   <details class="card"><summary><b>📋 Bảng động từ bất quy tắc thông dụng (${G_.spelling.irregular.length} từ)</b></summary><table class="tbl"><tr><th>V1</th><th>V2</th><th>V3</th><th></th></tr>${G_.spelling.irregular.map(r => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td>${tsay(r[0] + ', ' + r[1].split('/')[0] + ', ' + r[2].split('/')[0])}</td></tr>`).join('')}</table></details>
   <h2>🗺️ Lộ trình học (dễ → khó)</h2><p class="muted">Đã làm đúng ${total}/${all} bài tập. Mỗi thì có bài giảng và 45 bài luyện.</p>
   ${G_.groups.map(g => `<h3>${esc(g.name)}</h3><p class="muted">${esc(g.tip)}</p><div class="grid two">${g.ids.map(id => { const t = G_.tenses[id], p = tprog(id); return `<a class="card link" href="#grammar" onclick="A.topen('${id}')"><small class="muted">${t.no}. ${esc(t.group)} · ${esc(t.level)}</small><h3>${esc(t.vi)}</h3><small>${esc(t.en)}</small><br><code>${esc(t.formula.aff)}</code>${tbar(p.ok, p.total)}<small class="muted">${p.ok}/${p.total} bài đúng</small></a>`; }).join('')}</div>`).join('')}`;
}
function tenseDetail(t) {
  const p = tprog(TG.id), head = `<button class="btn ghost" onclick="A.gxback()">← Các thì</button><h1>${t.no}. ${esc(t.vi)}</h1><p class="muted">${esc(t.en)} · ${esc(t.group)} · mức ${esc(t.level)}</p>
   <div class="tabs"><button class="${TG.tab === 'learn' ? 'on' : ''}" onclick="A.gxtab('learn')">📖 Bài giảng</button><button class="${TG.tab === 'ex' ? 'on' : ''}" onclick="A.gxtab('ex')">✍️ Luyện tập (${p.ok}/${p.total})</button></div>`;
  if (TG.tab === 'ex') return head + tenseEx(TG.id);
  const li = a => `<ul>${a.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
  return head + `<div class="card"><h3>🎯 Ý chính</h3><p>${esc(t.core)}</p><p class="muted">Trục thời gian: <code>${esc(t.timeline)}</code></p></div>
   <div class="card" style="border-left:5px solid #4f7cff"><h3>🧮 Công thức</h3><table class="tbl"><tr><td>➕ Khẳng định</td><td><code>${esc(t.formula.aff)}</code></td></tr><tr><td>➖ Phủ định</td><td><code>${esc(t.formula.neg)}</code></td></tr><tr><td>❓ Nghi vấn</td><td><code>${esc(t.formula.q)}</code></td></tr></table></div>
   <div class="card"><h3>📌 Cách dùng</h3>${t.uses.map(u => `<p><b>${esc(u[0])}</b> – ${esc(u[1])}<br><i>${esc(u[2])}</i> ${tsay(u[2])}</p>`).join('')}</div>
   <div class="card"><h3>🔎 Dấu hiệu nhận biết</h3><p>${t.signals.map(x => `<span class="chip">${esc(x)}</span>`).join(' ')}</p></div>
   <div class="card"><h3>📝 Quy tắc cần nhớ</h3>${li(t.rules)}</div>
   <div class="card"><h3>💬 Ví dụ</h3>${t.examples.map(e => `<p>${esc(e[0])} ${tsay(e[0])}<br><small class="muted">${esc(e[1])}</small></p>`).join('')}</div>
   <div class="card"><h3>⚠️ Lỗi thường gặp</h3>${t.mistakes.map(m => `<p>❌ <s>${esc(m[0])}</s><br>✅ <b>${esc(m[1])}</b><br><small class="muted">${esc(m[2])}</small></p>`).join('')}</div>
   <div class="card" style="background:var(--okbg,#e7f5ff)"><h3>🧠 Mẹo nhớ</h3><p>${esc(t.memo)}</p><p class="muted"><b>So sánh:</b> ${esc(t.compare)}</p></div>
   <div class="row"><button class="btn" onclick="A.gxtab('ex')">✍️ Làm 45 bài luyện tập</button></div>`;
}
const gnorm = x => String(x).toLowerCase().replace(/[’‘`]/g, "'").replace(/[.?!]+$/g, '').replace(/\s+/g, ' ').trim();
function tenseEx(id) {
  const items = TE()[id] || [], per = 15, sets = Math.ceil(items.length / per), set = Math.min(TG.set, sets - 1), res = (S.tenseEx || {})[id] || {}, vals = (TG.vals[id] ||= {}), shown = (TG.shown[id] ||= {});
  const from = set * per, list = items.slice(from, from + per);
  return `<div class="card"><p class="muted">Điền dạng đúng của động từ trong ngoặc (viết rút gọn hoặc đầy đủ đều được). Với câu “(Câu hỏi)” hãy viết thành câu hỏi hoàn chỉnh. Không phân biệt chữ hoa/thường và dấu câu cuối.</p>
   <div class="tabs">${Array.from({length: sets}, (_, k) => { const sub = items.slice(k * per, k * per + per), ok = sub.filter((_, j) => res[k * per + j] === 1).length; return `<button class="${k === set ? 'on' : ''}" onclick="A.tset(${k})">Bộ ${k + 1} (${ok}/${sub.length})</button>`; }).join('')}</div></div>` +
   list.map((it, j) => { const i = from + j, q = it[0].startsWith('(Câu hỏi)'), st = res[i], checked = shown[i];
     return `<div class="card q"><p><b>${i + 1}.</b> ${esc(it[0])}</p><div class="row"><input class="gin" style="flex:1;min-width:200px" id="gi${i}" placeholder="${q ? 'Viết câu hỏi hoàn chỉnh…' : 'Điền vào chỗ trống…'}" value="${esc(vals[i] || '')}" oninput="TG.vals['${id}'][${i}]=this.value" onkeydown="if(event.key==='Enter')A.tcheck(${i})" ${checked && st === 1 ? 'disabled' : ''}><button class="btn sm" onclick="A.tcheck(${i})">Kiểm tra</button></div>${checked ? (st === 1 ? '<small style="color:#2f9e44">✔ Chính xác!</small>' : `<small style="color:#c92a2a">✘ Chưa đúng. Đáp án: <b>${esc(it[1][0])}</b>${it[1].length > 1 ? ' <span class="muted">(hoặc: ' + esc(it[1].slice(1, 3).join(' / ')) + ')</span>' : ''}</small>`) : ''}</div>`; }).join('') +
   `<div class="row"><button class="btn" onclick="A.tcheckset()">Kiểm tra cả bộ</button><button class="btn ghost" onclick="A.treset()">Làm lại thì này</button></div>`;
}
function posView() {
  const P_ = DATA.pos; if (!P_) return `<h1>📘 Ngữ pháp</h1>${gmTabs()}<div class="card">Chưa tải được dữ liệu.</div>`;
  if (PG.ex) return posEx();
  if (PG.id) { const p = P_.list.find(x => x.id === PG.id), li = a => `<ul>${a.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
    return `<button class="btn ghost" onclick="A.pxback()">← 10 từ loại</button><h1>${esc(p.vi)} <small class="muted">(${esc(p.abbr)} · ${esc(p.en)})</small></h1>
     <div class="card"><h3>📖 Định nghĩa</h3><p>${esc(p.def)}</p><p><b>Chức năng:</b> ${esc(p.role)}</p><p><b>Vị trí trong câu:</b> ${esc(p.position)}</p></div>
     <div class="card"><h3>🔎 Dấu hiệu nhận biết</h3>${li(p.signs)}</div>
     <div class="card"><h3>🗂️ Các loại</h3><table class="tbl">${p.types.map(t => `<tr><td><b>${esc(t[0])}</b><br><small class="muted">${esc(t[1])}</small></td><td>${esc(t[2])} ${tsay(t[2].split(/[,.]/)[0])}</td></tr>`).join('')}</table></div>
     <div class="card"><h3>💬 Ví dụ</h3>${p.examples.map(e => `<p>${esc(e)} ${tsay(e)}</p>`).join('')}</div>
     <div class="card"><h3>💡 Mẹo</h3>${li(p.tips)}</div>
     <div class="card"><h3>⚠️ Lỗi thường gặp</h3>${p.mistakes.map(m => `<p>❌ <s>${esc(m[0])}</s><br>✅ <b>${esc(m[1])}</b><br><small class="muted">${esc(m[2])}</small></p>`).join('')}</div>`; }
  const done = Object.values(S.posEx || {}).filter(Boolean).length;
  return `<h1>📘 Ngữ pháp</h1>${gmTabs()}<div class="card"><h2>🔤 10 loại từ loại trong tiếng Anh</h2><p>${esc(P_.intro)}</p><p><b>Trật tự cơ bản:</b> ${esc(P_.sentenceMap)}</p></div>
   <div class="grid two">${P_.list.map((p, i) => `<a class="card link" href="#grammar" onclick="A.popen('${p.id}')"><small class="muted">${i + 1}</small><h3>${esc(p.vi)} <small class="muted">(${esc(p.abbr)})</small></h3><small>${esc(p.def)}</small></a>`).join('')}</div>
   <div class="card"><h3>✍️ Bài tập nhận biết từ loại (${P_.ex.length} câu)</h3><p class="muted">Đã đúng ${done}/${P_.ex.length}.</p><button class="btn" onclick="A.pex()">Luyện tập</button></div>`;
}
function posEx() {
  const P_ = DATA.pos, per = 10, sets = Math.ceil(P_.ex.length / per), set = Math.min(PG.set, sets - 1), from = set * per, res = S.posEx || {};
  const opts = i => { const ok = P_.ex[i][2], arr = [ok]; for (let k = 1; arr.length < 4; k++) { const c = (ok + k * 3 + i) % 10; if (!arr.includes(c)) arr.push(c); } return arr.map((v, j) => [(v * 7 + i * 3 + j) % 11, v]).sort((a, b) => a[0] - b[0]).map(x => x[1]); };
  return `<button class="btn ghost" onclick="A.pbackex()">← 10 từ loại</button><h1>✍️ Nhận biết từ loại</h1>
   <div class="tabs">${Array.from({length: sets}, (_, k) => `<button class="${k === set ? 'on' : ''}" onclick="A.pset(${k})">Bộ ${k + 1}</button>`).join('')}</div>` +
   P_.ex.slice(from, from + per).map((e, j) => { const i = from + j, a = PG.ans[i]; return `<div class="card q"><p><b>${i + 1}.</b> ${esc(e[0]).replace(esc(e[1]), '<mark>' + esc(e[1]) + '</mark>')}</p><p class="muted">Từ <b>${esc(e[1])}</b> là loại từ gì?</p><div class="opts">${opts(i).map(v => { let c = ''; if (a != null) { if (v === e[2]) c = 'ok'; else if (v === a) c = 'no'; } return `<button class="opt ${c}" ${a != null ? 'disabled' : ''} onclick="A.pans(${i},${v})">${esc(P_.list[v].vi)} (${esc(P_.list[v].abbr)})</button>`; }).join('')}</div></div>`; }).join('');
}
Object.assign(A, {
  gmode(m) { GM = m; G = {open: null, ans: {}}; TG.id = null; PG.id = null; PG.ex = false; rerender(); window.scrollTo(0, 0); },
  topen(id) { TG.id = id; TG.tab = 'learn'; TG.set = 0; rerender(); window.scrollTo(0, 0); },
  gxback() { TG.id = null; rerender(); window.scrollTo(0, 0); },
  gxtab(t) { TG.tab = t; rerender(); window.scrollTo(0, 0); },
  tset(k) { TG.set = k; rerender(); window.scrollTo(0, 0); },
  tcheck(i, quiet) {
    const id = TG.id, it = TE()[id][i], v = (TG.vals[id] || {})[i];
    if (!v || !String(v).trim()) { if (!quiet) toast('Hãy nhập câu trả lời trước.'); return false; }
    const ok = it[1].some(a => gnorm(a) === gnorm(v)); ((S.tenseEx ||= {})[id] ||= {})[i] = ok ? 1 : 0; (TG.shown[id] ||= {})[i] = true; save();
    if (!quiet) { rerender(); const n = Object.values(S.tenseEx[id]).filter(Boolean).length; if (ok && n >= 10) markDone('grammar'); } return ok;
  },
  tcheckset() { const id = TG.id, per = 15, from = TG.set * per, n = Math.min(per, TE()[id].length - from); let c = 0; for (let j = 0; j < n; j++) if (A.tcheck(from + j, true)) c++; rerender(); toast('Bộ này: đúng ' + c + '/' + n); if (Object.values(S.tenseEx[id] || {}).filter(Boolean).length >= 10) markDone('grammar'); },
  treset() { if (!confirm('Làm lại tất cả bài của thì này?')) return; delete (S.tenseEx || {})[TG.id]; TG.vals[TG.id] = {}; TG.shown[TG.id] = {}; save(); rerender(); },
  popen(id) { PG.id = id; rerender(); window.scrollTo(0, 0); },
  pxback() { PG.id = null; rerender(); window.scrollTo(0, 0); },
  pex() { PG.ex = true; PG.set = 0; PG.ans = {}; rerender(); window.scrollTo(0, 0); },
  pbackex() { PG.ex = false; rerender(); window.scrollTo(0, 0); },
  pset(k) { PG.set = k; rerender(); window.scrollTo(0, 0); },
  pans(i, v) { if (PG.ans[i] != null) return; PG.ans[i] = v; const ok = DATA.pos.ex[i][2] === v; (S.posEx ||= {})[i] = ok ? 1 : 0; save(); rerender(); }
});

/* ---------- hành động: bài văn mẫu ---------- */
Object.assign(A, {
  esay(i) { const e = DATA.essay[T.unit]; if (!e) return; playToken++; if (window.speechSynthesis) speechSynthesis.cancel(); say(e.p[i], 0.9, 1); },
  eplay(id) { const e = DATA.essay[id]; const my = ++playToken; if (window.speechSynthesis) speechSynthesis.cancel(); let i = 0; const next = () => { if (my !== playToken || i >= e.p.length) return; say(e.p[i++], 0.9, 1, next); }; next(); },
  eprint() { window.print(); },
  ehide() { T.hideEssay = !T.hideEssay; rerender(); },
  edraft(id, v) { S.essay ||= {}; (S.essay[id] ||= {}).draft = v; const c = document.getElementById('escount'); if (c) c.textContent = wcount(v) + ' từ'; save(); },
  echeck(id) { const e = DATA.essay[id], d = ((S.essay || {})[id] || {}).draft || '', low = d.toLowerCase(); const cl = k => k[0].toLowerCase().replace(/…/g, '').trim(); const used = e.k.filter(k => low.includes(cl(k))); const r = document.getElementById('esres'); if (r) r.innerHTML = `<p>Đã dùng <b>${used.length}/${e.k.length}</b> cụm từ khóa.</p>` + (used.length < e.k.length ? '<p class="muted">Chưa dùng: ' + e.k.filter(k => !used.includes(k)).map(k => esc(k[0])).join(' · ') + '</p>' : '<p>👏 Tuyệt vời!</p>'); },
  ecopy(id) { const e = DATA.essay[id]; T.hideEssay = false; toast('Nghe từng câu rồi gõ lại vào ô bên dưới'); const sents = e.p.join(' ').match(/[^.!?]+[.!?]+/g) || []; let i = 0; const my = ++playToken; const go = () => { if (my !== playToken || i >= sents.length) return; say(sents[i++].trim(), 0.8, 1, () => setTimeout(go, 7000)); }; go(); },
  eadd(id, i) { const k = DATA.essay[id].k[i], key = 'es_' + id + '_' + i; if (isAdded(key)) return toast('Đã có trong thẻ ôn'); S.custom.push({id: key, w: k[0], ipa: '', vi: k[1], ex: '', cat: 'essay'}); save(); toast('Đã thêm vào thẻ ôn'); },
  eaddall(id) { let n = 0; DATA.essay[id].k.forEach((k, i) => { const key = 'es_' + id + '_' + i; if (!isAdded(key)) { S.custom.push({id: key, w: k[0], ipa: '', vi: k[1], ex: '', cat: 'essay'}); n++; } }); save(); toast('Đã thêm ' + n + ' cụm vào thẻ ôn'); }
});

/* ---------- bản sao dự phòng thứ hai: IndexedDB + file tự động (phòng khi trình duyệt xóa dữ liệu trang) ---------- */
var idbP = null, mirT = null, fileT = null, fileH = null, PERSIST = null, lastFile = 0, filePending = false;
function idb() { return idbP ||= new Promise((res, rej) => { try { const r = indexedDB.open('english-daily-db', 1); r.onupgradeneeded = () => r.result.createObjectStore('kv'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); } catch (e) { rej(e); } }); }
const idbSet = (k, v) => idb().then(db => new Promise((res, rej) => { const t = db.transaction('kv', 'readwrite'); t.objectStore('kv').put(v, k); t.oncomplete = res; t.onerror = () => rej(t.error); })).catch(() => {});
const idbGet = k => idb().then(db => new Promise((res, rej) => { const q = db.transaction('kv').objectStore('kv').get(k); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error); })).catch(() => undefined);
const isFreshObj = o => !o || (!Object.keys(o.vocab || {}).length && !Object.keys(o.log || {}).length && !(o.writing || []).length && !o.path && !o.rmit && !o.notebook && !o.ctest && !(o.custom || []).length);
function allData() { const o = {reg: REG, data: {}}; REG.profiles.forEach(p => { try { o.data[p.id] = JSON.parse(localStorage.getItem(pkey(p.id)) || '{}'); } catch (e) {} }); return o; }
function mirror() {
  clearTimeout(mirT);
  mirT = setTimeout(() => { idbSet('reg', JSON.stringify(REG)); idbSet('p:' + REG.active, JSON.stringify(S)); idbSet('savedAt', Date.now()); }, 300);
  if (fileH) { clearTimeout(fileT); fileT = setTimeout(fileWrite, 2000); }
}
async function fileWrite() {
  if (!fileH) return;
  try {
    if ((await fileH.queryPermission({mode: 'readwrite'})) !== 'granted') { filePending = true; return; }
    const w = await fileH.createWritable(); await w.write(JSON.stringify(allData())); await w.close(); lastFile = Date.now(); filePending = false;
  } catch (e) {}
}
function restoreFrom(reg, datas) {  /* ghi lại dữ liệu từ bản sao dự phòng rồi tải lại trang */
  try { sessionStorage.setItem('ed-recovered', '1'); } catch (e) {}
  localStorage.setItem(REG_KEY, JSON.stringify(reg));
  Object.keys(datas).forEach(id => localStorage.setItem(pkey(id), typeof datas[id] === 'string' ? datas[id] : JSON.stringify(datas[id])));
  location.reload();
}
async function recover() {
  try { if (sessionStorage.getItem('ed-recovered')) { sessionStorage.removeItem('ed-recovered'); toast('♻️ Đã tự khôi phục tiến độ học từ bản sao dự phòng.'); return; } } catch (e) {}
  if (!isFreshObj(S)) { REG.profiles.forEach(p => { try { const d = localStorage.getItem(pkey(p.id)); if (d) idbSet('p:' + p.id, d); } catch (e) {} }); idbSet('reg', JSON.stringify(REG)); return; }
  try {
    const r = await idbGet('reg'); if (!r) return;
    const reg = JSON.parse(r), datas = {};
    for (const p of reg.profiles) { const d = await idbGet('p:' + p.id); if (d && !isFreshObj(JSON.parse(d))) datas[p.id] = d; }
    if (Object.keys(datas).length) restoreFrom(reg, datas);
  } catch (e) {}
}
async function fileInit() {
  try { fileH = (await idbGet('fileH')) || null; } catch (e) { fileH = null; }
  /* sau khi mở máy lại, trình duyệt chỉ cho ghi file sau một cú bấm → xử lý ở lần bấm đầu tiên */
  document.addEventListener('click', async function once() {
    try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist().then(ok => PERSIST = ok); } catch (e) {}
    if (!fileH) return;
    document.removeEventListener('click', once);
    try {
      let p = await fileH.queryPermission({mode: 'readwrite'}); if (p !== 'granted') p = await fileH.requestPermission({mode: 'readwrite'});
      if (p !== 'granted') return;
      if (isFreshObj(S)) { const o = JSON.parse(await (await fileH.getFile()).text()); if (o && o.reg && o.data && Object.values(o.data).some(d => !isFreshObj(d))) return restoreFrom(o.reg, o.data); }
      fileWrite();
    } catch (e) {}
  });
}
try { navigator.storage && navigator.storage.persisted && navigator.storage.persisted().then(v => PERSIST = v); } catch (e) {}
Object.assign(A, {
  async fileOn() {
    if (!window.showSaveFilePicker) return toast('Trình duyệt này chưa hỗ trợ (hãy dùng Chrome/Edge trên máy tính).');
    try {
      fileH = await showSaveFilePicker({suggestedName: 'english-daily-tien-do.json', types: [{description: 'Tiến độ English Daily', accept: {'application/json': ['.json']}}]});
      await idbSet('fileH', fileH); await fileWrite(); toast('✅ Đã bật tự động lưu ra file.'); rerender();
    } catch (e) {}
  },
  async fileOff() { fileH = null; await idbSet('fileH', null); toast('Đã tắt tự động lưu ra file.'); rerender(); }
});
const storageStatus = () => `<p class="muted">💾 <b>Độ an toàn của dữ liệu:</b> ${PERSIST ? '✅ trình duyệt đã cam kết giữ dữ liệu' : '⚠️ trình duyệt <b>chưa cam kết</b> giữ dữ liệu (có thể bị xóa nếu bạn bật “xóa dữ liệu khi đóng trình duyệt”, dùng cửa sổ riêng tư, hoặc dọn dẹp bộ nhớ)'} · bản sao thứ hai trong IndexedDB: ✅${fileH ? ' · tự động lưu ra file: ✅' + (filePending ? ' (bấm vào trang để cho phép ghi)' : (lastFile ? ' lúc ' + new Date(lastFile).toLocaleTimeString('vi') : '')) : ''}</p>
 <div class="row">${window.showSaveFilePicker ? (fileH ? '<button class="btn sm ghost" onclick="A.fileOff()">Tắt tự động lưu ra file</button>' : '<button class="btn sm" onclick="A.fileOn()">📁 Bật tự động lưu tiến độ ra file (khuyên dùng)</button>') : '<span class="muted">Tự động lưu ra file chỉ có trên Chrome/Edge máy tính. Trên điện thoại hãy thêm app vào Màn hình chính và sao lưu định kỳ.</span>'}</div>`;
recover(); fileInit();

/* ---------- giao diện chọn học viên ---------- */
function pChip() { const b = document.getElementById('who'); if (!b) return; const p = curProfile(); b.innerHTML = '<i style="background:' + p.color + '">' + esc(p.name.trim().charAt(0).toUpperCase()) + '</i> ' + esc(p.name); }
function pRender() {
  const o = document.getElementById('pick'); if (!o) return;
  o.innerHTML = '<div class="pbox"><h2>👤 Ai đang học?</h2><p class="muted">Mỗi học viên có tiến độ, từ vựng, bài viết, điểm test và nhắc nhở <b>riêng</b>, tự lưu trên máy này.</p>' +
   REG.profiles.map(p => '<div class="prow' + (p.id === REG.active ? ' on' : '') + '"><button class="pgo" onclick="A.pswitch(\'' + p.id + '\')"><i style="background:' + p.color + '">' + esc(p.name.trim().charAt(0).toUpperCase()) + '</i><b>' + esc(p.name) + '</b>' + (p.id === REG.active ? '<small>đang dùng</small>' : '') + '</button><button class="btn sm ghost" onclick="A.prename(\'' + p.id + '\')" title="Đổi tên">✏️</button><button class="btn sm ghost" onclick="A.pdel(\'' + p.id + '\')" title="Xóa">🗑️</button></div>').join('') +
   '<div class="row"><button class="btn" onclick="A.padd()">➕ Thêm học viên</button><button class="btn ghost" onclick="A.pclose()">Đóng</button></div><p class="muted" style="font-size:.8rem">Dữ liệu nằm trong trình duyệt của thiết bị này (không gửi đi đâu). Dùng thiết bị khác hoặc xóa dữ liệu trình duyệt thì cần ⬇️ Sao lưu rồi ⬆️ Khôi phục (mục Nhắc nhở & cài đặt).</p></div>';
}
function pOpen() { let o = document.getElementById('pick'); if (!o) { o = document.createElement('div'); o.id = 'pick'; document.body.appendChild(o); } pRender(); o.style.display = 'flex'; }
function pClose() { const o = document.getElementById('pick'); if (o) o.style.display = 'none'; }

/* ---------- khởi động ---------- */
$('#nav').innerHTML = NAV.map(n => `<a href="#${n[0]}" data-id="${n[0]}"><span>${n[1]}</span><em>${n[2]}</em></a>`).join('');
{ const ti = TASKS.find(x => x.id === 'ielts'); if (ti && ieltsMode()) { ti.optional = false; ti.name = 'IELTS 6.5 (1 phần mỗi ngày)'; ti.href = '#i65'; } }
updateAccentBtn(); updateSpeedBtn(); pChip(); route(); checkReminders();
try { if (REG.profiles.length > 1 && !sessionStorage.getItem('ed-picked')) { sessionStorage.setItem('ed-picked', '1'); pOpen(); } } catch (e) {}
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
