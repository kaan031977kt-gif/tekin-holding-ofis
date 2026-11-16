const cv = document.getElementById('c'), g = cv.getContext('2d');
const $ = id => document.getElementById(id);
const R = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), w, h); };

// Karakterler: konum (ayak merkezi), renkler, poz
const CH = {
  selim:  { ad: 'Selim Aksoy',  rol: 'Müdür',        x: 160, y: 70,  shirt: '#24406b', hair: '#2b2b2b', skin: '#e0b48a', pose: 'pace' },
  emre:   { ad: 'Emre Kaya',    rol: 'Antrenör',     x: 50,  y: 150, shirt: '#c4521d', hair: '#3a2a1a', skin: '#d9a273', pose: 'lift' },
  zeynep: { ad: 'Zeynep Demir', rol: 'Ders Koçu',    x: 270, y: 150, shirt: '#6a4aa8', hair: '#5a2d0c', skin: '#f0c8a0', pose: 'read' },
  burak:  { ad: 'Burak Yıldız', rol: 'Pazar/Yazılım',x: 215, y: 100, shirt: '#1c8057', hair: '#1a1a1a', skin: '#d9a273', pose: 'type' },
  elif:   { ad: 'Elif Şahin',   rol: 'Asistan',      x: 100, y: 100, shirt: '#b83a72', hair: '#2a1408', skin: '#f0c8a0', pose: 'type' },
};
let durum = {};
const getJ = async u => { const r = await fetch(u); if (!r.ok) throw 0; return r.json(); };
const fetchState = () => getJ('api/state').catch(() => getJ('state.json')).then(s => durum = s).catch(() => {});
fetchState(); setInterval(fetchState, 15000);

function room() {
  R(0, 0, 320, 180, '#3b3f52');            // duvar
  R(0, 60, 320, 120, '#8a6b4a');           // zemin
  for (let i = 0; i < 320; i += 16) R(i, 60, 1, 120, '#7a5d40');
  R(0, 58, 320, 3, '#2a2d3c');
  R(20, 10, 40, 30, '#9ed0ff'); R(39, 10, 2, 30, '#3b3f52'); R(20, 24, 40, 2, '#3b3f52'); // pencere
  R(250, 8, 50, 6, '#e8e1d0'); R(252, 10, 46, 2, '#b33');                                   // tabela
  g.fillStyle = '#e8e1d0'; g.font = '5px monospace'; g.fillText('TEKİN HOLDİNG', 255, 13);
  R(8, 112, 30, 4, '#555'); R(10, 108, 4, 4, '#999'); R(32, 108, 4, 4, '#999');            // spor köşesi paspas
  R(238, 70, 70, 8, '#5a3a20'); for (let i = 0; i < 6; i++) R(242 + i * 11, 64, 8, 6, ['#c33', '#36c', '#3a3', '#cc3', '#a3c', '#3cc'][i]); // kitaplık
}
function desk(x, y, w) { R(x, y, w, 8, '#5a3a20'); R(x, y + 8, 3, 8, '#3a2410'); R(x + w - 3, y + 8, 3, 8, '#3a2410'); }

function person(c, t, key) {
  const bob = Math.round(Math.sin(t / 300 + key.length) * 0.6);
  let { x, y } = c;
  if (c.pose === 'pace') x += Math.round(Math.sin(t / 900) * 28);
  const sx = x - 4, sy = y - 24 + bob;
  R(x - 5, y - 1, 10, 2, 'rgba(0,0,0,.25)');           // gölge
  const step = c.pose === 'pace' ? Math.sin(t / 150) > 0 : 0;
  R(sx + 1, sy + 18, 3, 6, '#2a2f45'); R(sx + 4, sy + 18 + (step ? 1 : 0), 3, 6 - (step ? 1 : 0), '#2a2f45'); // bacaklar
  R(sx, sy + 8, 8, 10, c.shirt);                         // gövde
  R(sx + 1, sy, 6, 7, c.skin);                           // kafa
  R(sx, sy - 1, 8, 3, c.hair); if (key === 'zeynep' || key === 'elif') R(sx - 1, sy, 2, 9, c.hair); // saç
  const blink = (t % 3000) < 120;
  if (!blink) { R(sx + 2, sy + 3, 1, 1, '#111'); R(sx + 5, sy + 3, 1, 1, '#111'); }
  // kollar
  const s = Math.sin(t / 110);
  if (c.pose === 'type') { R(sx - 1, sy + 10, 2, 5, c.skin); R(sx + 7, sy + 10, 2, 5, c.skin); R(sx + (s > 0 ? 1 : 5), sy + 14, 2, 2, c.skin); }
  else if (c.pose === 'lift') { const up = Math.round((Math.sin(t / 400) + 1) * 4); R(sx - 2, sy + 12 - up, 2, 4 + up / 2, c.skin); R(sx + 8, sy + 12 - up, 2, 4 + up / 2, c.skin);
    R(sx - 5, sy + 10 - up, 5, 2, '#999'); R(sx + 8, sy + 10 - up, 5, 2, '#999'); }
  else if (c.pose === 'read') { R(sx - 1, sy + 10, 2, 5, c.skin); R(sx + 7, sy + 10, 2, 5, c.skin); R(sx, sy + 12, 8, 5, '#f5f0e0'); R(sx + 3, sy + 12, 1, 5, '#999'); if ((t % 2400) < 200) R(sx + 4, sy + 11, 4, 5, '#fff'); }
  else { R(sx - 1, sy + 9, 2, 6, c.skin); R(sx + 7, sy + 9, 2, 6, c.skin); R(sx - 3, sy + 12, 5, 4, '#e8e1d0'); } // klasör
}

function bubble(c, text, t) {
  g.font = '5px monospace'; const w = Math.min(90, g.measureText(text).width + 6);
  const bx = Math.max(2, Math.min(318 - w, c.x - w / 2)), by = c.y - 38;
  R(bx, by, w, 9, '#fff'); R(c.x - 1, by + 9, 3, 2, '#fff'); g.fillStyle = '#222'; g.fillText(text.slice(0, 22), bx + 3, by + 6.5);
}

let hover = null, active = null;
function frame(t) {
  room();
  desk(195, 100, 40); desk(80, 100, 40); desk(140, 66, 40);   // masalar
  desk(250, 152, 36);
  // Burak'ın ekranı
  R(206, 90, 16, 10, '#111'); for (let i = 0; i < 4; i++) R(208, 92 + i * 2, 4 + ((t / 200 + i * 3) | 0) % 9, 1, '#4f4');
  // Elif'in ekranı
  R(91, 90, 16, 10, '#111'); R(93, 92, 8, 5, '#6af');
  // Selim'in kağıtları
  R(150, 64, 10, 3, '#eee'); R(163, 64, 8, 3, '#ddd');
  // Spor: dambıl rafı
  R(70, 160, 20, 3, '#444'); R(72, 157, 4, 3, '#888'); R(84, 157, 4, 3, '#888');
  Object.entries(CH).sort((a, b) => a[1].y - b[1].y).forEach(([k, c]) => {
    person(c, t, k);
    const d = durum[k]; const label = (hover === k || active === k) ? c.ad : (d && d.not) || '';
    if (label) bubble(c, label, t);
  });
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

function hit(e) {
  const r = cv.getBoundingClientRect(), x = (e.clientX - r.left) * 320 / r.width, y = (e.clientY - r.top) * 180 / r.height;
  return Object.keys(CH).find(k => Math.abs(x - CH[k].x) < 14 && y > CH[k].y - 30 && y < CH[k].y + 2) || null;
}
cv.addEventListener('mousemove', e => hover = hit(e));
cv.addEventListener('click', e => { const k = hit(e); if (k) open(k); });

const log = $('log');
function add(cls, text) { const d = document.createElement('div'); d.className = 'm ' + cls; d.textContent = text; log.append(d); log.scrollTop = 1e9; return d; }
async function open(k) {
  active = k; $('panel').classList.add('on'); $('pn').textContent = `${CH[k].ad} · ${CH[k].rol}`; log.innerHTML = '';
  try { (await getJ('api/history?ajan=' + k)).forEach(m => add(m.k === 'Kaan' ? 'k' : 'a', m.t)); } catch {}
  $('i').focus();
}
$('x').onclick = () => { active = null; $('panel').classList.remove('on'); };
$('f').onsubmit = async e => {
  e.preventDefault(); const m = $('i').value.trim(); if (!m || !active) return; $('i').value = '';
  add('k', m); const w = add('a', '…'); const k = active;
  try { const res = await fetch('api/chat', { method: 'POST', body: JSON.stringify({ ajan: k, mesaj: m }) }); if (!res.ok && res.status === 404) throw 0; const r = await res.json(); w.textContent = r.cevap || ('Hata: ' + r.hata); }
  catch { w.textContent = 'Sohbet bu linkte kapalı. Bilgisayarında `node server.mjs` çalıştırıp localhost:5174 üzerinden yaz.'; }
};
