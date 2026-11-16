// Tekin Holding — izometrik piksel ofis. Sahne düşük çözünürlükte çizilir, büyütülür; yazılar tam çözünürlükte çizilir (okunur kalır).
const cv = document.getElementById('c'), g = cv.getContext('2d');
const $ = id => document.getElementById(id);
const S = 4, LW = 300, LH = 225;
const lo = document.createElement('canvas'); lo.width = LW; lo.height = LH; const l = lo.getContext('2d');
const R = (x, y, w, h, c) => { l.fillStyle = c; l.fillRect(Math.round(x), Math.round(y), Math.max(0, Math.round(w)), Math.max(0, Math.round(h))); };
const OX = 150, OY = 70, WH = 52;
const sx = (a, b) => OX + (a - b) * 16, sy = (a, b) => OY + (a + b) * 8;
const OL = '#1a1a24';

const CH = {
  selim:  { ad: 'Selim',  rol: 'Müdür',        gx: 4,   gy: 1.2, sit: 1, shirt: '#2f5597', shade: '#244377', pants: '#2a2f45', hair: '#2b2b2b', skin: '#e0b48a', c: '#5b8def', parts: ['$', 'rapor', '✓'] },
  elif:   { ad: 'Elif',   rol: 'Asistan',      gx: 1.6, gy: 2.9, sit: 1, shirt: '#d9548c', shade: '#b03f6f', pants: '#2a2f45', hair: '#2a1408', skin: '#f0c8a0', c: '#ff7ab5', parts: ['✓', '+görev', '☎'] },
  zeynep: { ad: 'Zeynep', rol: 'Ders Koçu',    gx: 6.9, gy: 1.9, sit: 0, shirt: '#8a63d2', shade: '#6a4aa8', pants: '#3a3350', hair: '#5a2d0c', skin: '#f0c8a0', c: '#a98aee', parts: ['A+', '∑', '📖'] },
  emre:   { ad: 'Emre',   rol: 'Antrenör',     gx: 2,   gy: 6.5, sit: 0, shirt: '#e0662a', shade: '#b84f1c', pants: '#2a2f45', hair: '#3a2a1a', skin: '#d9a273', c: '#ff8a4d', parts: ['+1', '💪', '💧'] },
  burak:  { ad: 'Burak',  rol: 'Yazılım',      gx: 6,   gy: 4.2, sit: 1, shirt: '#2aa56e', shade: '#1c8057', pants: '#2a2f45', hair: '#1a1a1a', skin: '#d9a273', c: '#43d08f', parts: ['</>', '{ }', '01'] },
};
let durum = {}, hover = null, active = null;
const getJ = async u => { const r = await fetch(u); if (!r.ok) throw 0; return r.json(); };
const fetchState = () => getJ('api/state').catch(() => getJ('state.json')).then(s => durum = s).catch(() => {});
fetchState(); setInterval(fetchState, 15000);

// ---------- izometrik yardımcılar ----------
function tile(gx, gy, c) {
  const cx = sx(gx, gy), top = sy(gx, gy);
  for (let i = 0; i < 16; i++) { const h = i < 8 ? 2 * (i + 1) : 2 * (16 - i); R(cx - h, top + i, 2 * h, 1, c); }
}
function box(gx, gy, w, d, h, ct, cl, cr, z0 = 0) {
  const xA = sx(gx, gy + d), yA = sy(gx, gy + d), xB = sx(gx + w, gy + d), yB = sy(gx + w, gy + d), xC = sx(gx + w, gy), xD = sx(gx, gy), yD = sy(gx, gy);
  for (let x = xA; x < xB; x++) { const gr = yA + (x - xA) / 2 - z0; R(x, gr - h, 1, h, cl); }
  for (let x = xB; x < xC; x++) { const gr = yB - (x - xB) / 2 - z0; R(x, gr - h, 1, h, cr); }
  for (let x = xA; x < xC; x++) {
    const lower = x < xB ? yA + (x - xA) / 2 : yB - (x - xB) / 2;
    const upper = x < xD ? yA - (x - xA) / 2 : yD + (x - xD) / 2;
    R(x, upper - h - z0, 1, lower - upper + 1, ct);
  }
  R(xB, yB - z0 - h, 1, h, 'rgba(0,0,0,.25)');
}
function wall(side, t0, t1, z0, z1, c) {           // side: 'r' (gy=0), 'l' (gx=0)
  for (let t = t0; t < t1; t++) { const x = side === 'r' ? OX + t : OX - t - 1, by = OY + Math.floor(t / 2); R(x, by - z1, 1, z1 - z0, typeof c === 'function' ? c(t) : c); }
}

// ---------- sabit sahne ----------
function room(t) {
  R(0, 0, LW, LH, '#143a5c');
  for (let gx = 0; gx < 8; gx++) for (let gy = 0; gy < 8; gy++) {
    const rug = gx >= 3 && gx <= 5 && gy >= 3 && gy <= 5, edge = rug && (gx === 3 || gx === 5 || gy === 3 || gy === 5);
    tile(gx, gy, rug ? (edge ? '#d9b44a' : '#a8323e') : (gx + gy) % 2 ? '#2b3a7a' : '#34448c');
  }
  const pl = (a, b) => t => ((t >> 2) & 1) ? a : b;
  wall('r', 0, 128, 0, WH, pl('#9a5a34', '#8a4b2a')); wall('l', 0, 128, 0, WH, pl('#7d4526', '#6f3a20'));
  wall('r', 0, 128, 0, 3, '#3a1d0f'); wall('l', 0, 128, 0, 3, '#2d170c');
  wall('r', 0, 128, WH - 2, WH, '#c98a58'); wall('l', 0, 128, WH - 2, WH, '#a56a40');
  R(OX, OY - WH, 1, WH, '#2a1208');
  // sağ duvar: poster, pencere, saat
  wall('r', 14, 38, 20, 44, '#2a1c4a'); wall('r', 17, 35, 23, 41, '#4a3a8a'); wall('r', 24, 28, 30, 36, '#e0c040');
  const cloud = Math.floor((t / 120) % 40);
  wall('r', 78, 114, 16, 44, '#3b2a1a'); wall('r', 80, 112, 18, 42, '#7ec8ff'); wall('r', 80 + cloud % 28, 86 + cloud % 28, 32, 36, '#fff'); wall('r', 95, 97, 18, 42, '#3b2a1a'); wall('r', 80, 112, 29, 31, '#3b2a1a');
  wall('r', 48, 68, 22, 44, '#1d5a2e'); wall('r', 51, 65, 25, 41, '#43b36a'); wall('r', 55, 61, 28, 36, '#e8f3ff');
  // sol duvar: beyaz tahta (Elif'in görevleri), poster, saat
  wall('l', 14, 52, 16, 42, '#cfd6e0'); wall('l', 16, 50, 18, 40, '#f4f6fa');
  [[20, 34, '#d9548c'], [20, 29, '#5b8def'], [20, 24, '#43d08f']].forEach(([z, zz, c], i) => wall('l', 20, 20 + 14 + (i % 2) * 8, zz - 2, zz, c));
  wall('l', 70, 94, 20, 44, '#4a1a1a'); wall('l', 73, 91, 23, 41, '#c24a4a'); wall('l', 78, 86, 28, 36, '#ffe08a');
  wall('l', 104, 116, 28, 40, '#e8e1d0'); wall('l', 109, 111, 30, 38, '#222');
}

function person(c, t, key) {
  const x = Math.round(sx(c.gx, c.gy)), y = Math.round(sy(c.gx, c.gy));
  const bob = Math.round(Math.sin(t / 420 + key.length) * 0.8), so = c.sit ? 5 : 0, b = bob + so;
  R(x - 8, y - 1, 16, 3, 'rgba(0,0,0,.3)');
  if (!c.sit) { R(x - 5, y - 10, 11, 10, OL); R(x - 4, y - 9, 4, 7, c.pants); R(x, y - 9, 4, 7, c.pants); R(x - 5, y - 3, 5, 3, '#222'); R(x, y - 3, 5, 3, '#222'); }
  // gövde
  R(x - 7, y - 21 + b, 14, 13, OL); R(x - 6, y - 20 + b, 12, 11, c.shirt); R(x + 3, y - 20 + b, 3, 11, c.shade);
  // kafa
  R(x - 7, y - 32 + b, 14, 13, OL); R(x - 6, y - 31 + b, 12, 11, c.skin);
  R(x - 6, y - 32 + b, 12, 4, c.hair);
  if (key === 'zeynep' || key === 'elif') { R(x - 7, y - 30 + b, 2, 12, c.hair); R(x + 5, y - 30 + b, 2, 12, c.hair); }
  const blink = (t + key.length * 700) % 3200 < 130;
  if (blink) { R(x - 4, y - 25 + b, 3, 1, '#111'); R(x + 1, y - 25 + b, 3, 1, '#111'); } else { R(x - 4, y - 26 + b, 2, 3, '#111'); R(x + 2, y - 26 + b, 2, 3, '#111'); }
  R(x - 2, y - 21 + b, 4, 1, '#a33');
  // karaktere özel
  if (key === 'selim') { R(x - 6, y - 27 + b, 5, 4, 'rgba(255,255,255,.0)'); R(x - 6, y - 28 + b, 6, 1, '#111'); R(x + 1, y - 28 + b, 6, 1, '#111'); R(x - 6, y - 25 + b, 6, 1, '#111'); R(x + 1, y - 25 + b, 6, 1, '#111'); R(x - 6, y - 28 + b, 1, 4, '#111'); R(x + 6, y - 28 + b, 1, 4, '#111'); R(x, y - 27 + b, 1, 1, '#111'); R(x - 4, y - 8 + b, 8, 3, '#d7263d'); }
  if (key === 'burak') { R(x - 6, y - 17 + b, 12, 4, '#d9a273'); R(x - 5, y - 19 + b, 10, 3, '#2a1a10'); R(x - 8, y - 29 + b, 16, 2, '#222'); R(x - 9, y - 27 + b, 3, 6, '#222'); R(x + 6, y - 27 + b, 3, 6, '#222'); }
  if (key === 'elif') { R(x - 8, y - 29 + b, 16, 2, '#333'); R(x - 9, y - 27 + b, 3, 5, '#ff7ab5'); R(x + 6, y - 27 + b, 3, 5, '#ff7ab5'); R(x - 9, y - 23 + b, 1, 4, '#333'); R(x - 9, y - 20 + b, 5, 1, '#333'); }
  if (key === 'emre') { R(x - 7, y - 29 + b, 14, 3, '#fff'); R(x - 7, y - 29 + b, 14, 1, '#e0662a'); }
  // kollar
  const w = (t / 350) % (Math.PI * 2);
  if (key === 'emre') {
    [[-1, 0], [1, 0.5]].forEach(([d, ph]) => {
      const lift = (Math.sin(t / 380 + ph * Math.PI * 2) + 1) / 2, ax = x + d * 9, hy = y - 10 - Math.round(lift * 10);
      R(ax - 2, y - 20, 4, 8, c.skin); R(ax - 2, hy, 4, y - 12 - hy, c.skin); R(ax - 5, hy - 2, 10, 3, '#cfd3da'); R(ax - 6, hy - 3, 2, 5, '#444'); R(ax + 4, hy - 3, 2, 5, '#444');
    });
    const d = Math.floor((t / 1500) % 3); R(x + 8, y - 28 + b + ((t / 200) % 8), 1, 2, '#7ec8ff');
  } else if (key === 'zeynep') {
    R(x - 9, y - 17, 3, 7, c.skin); R(x + 6, y - 17, 3, 7, c.skin);
    R(x - 7, y - 19, 14, 9, OL); R(x - 6, y - 18, 12, 7, '#c9a96a'); R(x - 5, y - 17, 10, 5, '#f5f0e0'); R(x, y - 17, 1, 5, '#999'); R(x - 4, y - 16, 3, 1, '#999'); R(x + 2, y - 16, 3, 1, '#999'); R(x - 4, y - 14, 3, 1, '#999'); R(x + 2, y - 14, 3, 1, '#999');
    const ph = (t % 3200) / 3200; if (ph < 0.18) { const k = ph / 0.18; R(x - 5 + k * 9, y - 18 - Math.sin(k * 3.14) * 2, 5 - k * 4, 6, '#fff'); }
  } else if (key === 'selim') {
    const p = (t % 5000) / 5000, up = p < 0.3 ? Math.sin(p / 0.3 * Math.PI) : 0;
    R(x - 9, y - 18 + b, 3, 8, c.skin); R(x + 6, y - 18 + b - Math.round(up * 8), 3, 8, c.skin);
    const cy = y - 10 + b - Math.round(up * 12); R(x + 5, cy, 6, 6, '#fff'); R(x + 6, cy + 1, 4, 1, '#6b3a1a'); R(x + 11, cy + 1, 2, 3, '#fff');
    if (up < 0.05) { R(x + 6 + (Math.sin(t / 300) > 0 ? 1 : 0), cy - 4, 1, 3, 'rgba(255,255,255,.5)'); }
  } else {
    const a = Math.sin(t / 90) > 0; R(x - 9, y - 18 + b, 3, 8, c.skin); R(x + 6, y - 18 + b, 3, 8, c.skin); R(x - 5 + (a ? 0 : 6), y - 11 + b, 3, 2, c.skin);
  }
  // hover vurgusu
  if (hover === key || active === key) { R(x - 9, y - 34 + b, 18, 1, '#fff'); }
  HIT[key] = [x - 11, y - 36, x + 11, y + 2];
}
const HIT = {};

function dino(t) {
  const p = (t / 7000) % 1, gx = 0.7 + (p < .5 ? p * 2 : 2 - p * 2) * 2.6, gy = 4.8, dir = p < .5 ? 1 : -1;
  const x = sx(gx, gy), y = sy(gx, gy), st = Math.sin(t / 120) > 0 ? 1 : 0;
  R(x - 6, y - 1, 13, 2, 'rgba(0,0,0,.3)');
  R(x - 5 * dir - 3, y - 7, 9, 5, '#2f9d4f'); R(x - 5 * dir - 3, y - 7, 9, 1, '#46c26a'); R(x + 3 * dir - 2, y - 11, 5, 5, '#2f9d4f'); R(x + 5 * dir - (dir > 0 ? 0 : 1), y - 10, 1, 1, '#111');
  R(x - 9 * dir - 1, y - 6, 4, 2, '#2f9d4f'); R(x - 3, y - 3 + st, 2, 3 - st, '#1f7a3a'); R(x + 1, y - 3 + (1 - st), 2, 3 - (1 - st), '#1f7a3a');
}

function items(t) {
  const L = [];
  const add = (z, f) => L.push([z, f]);
  // Selim masası
  add(1.1, () => box(3.65, 0.9, 0.7, 0.18, 14, '#454a6a', '#33375a', '#2a2e4a'));
  add(CH.selim.gx + CH.selim.gy, () => person(CH.selim, t, 'selim'));
  add(5.4, () => { box(3, 1.6, 2, 1, 13, '#e0607e', '#b8445f', '#98364e'); box(3.65, 1.95, 0.7, 0.14, 9, '#5a5f66', '#3a3e45', '#4a4e55', 13); R(sx(4, 2.1) - 4, sy(4, 2.1) - 26, 8, 1, 'rgba(120,200,255,.35)'); });
  // Elif masası
  add(1.5, () => box(1.25, 2.5, 0.7, 0.18, 14, '#454a6a', '#33375a', '#2a2e4a'));
  add(CH.elif.gx + CH.elif.gy, () => person(CH.elif, t, 'elif'));
  add(7.4, () => { box(0.6, 3.4, 2, 1, 13, '#e0607e', '#b8445f', '#98364e'); box(1.25, 3.75, 0.7, 0.14, 9, '#5a5f66', '#3a3e45', '#4a4e55', 13); box(2.15, 3.55, 0.35, 0.3, 3, '#e8e1d0', '#c9c3b0', '#b0aa98', 13); });
  // Kitaplık + Zeynep
  add(7.8, () => { box(6, 0.1, 1.9, 0.6, 38, '#7a4a2a', '#5a341c', '#4a2a16'); for (let r = 0; r < 3; r++) for (let i = 0; i < 9; i++) { const cc = ['#c33', '#36c', '#3a3', '#cc3', '#a3c', '#3cc'][(i + r * 2) % 6]; R(sx(6.15 + i * 0.19, 0.7) - 1 + 0, sy(6.15 + i * 0.19, 0.7) - 33 + r * 11, 3, 8, cc); } });
  add(CH.zeynep.gx + CH.zeynep.gy, () => person(CH.zeynep, t, 'zeynep'));
  // Burak
  add(9.4, () => { box(5.55, 3.5, 0.65, 0.16, 14, '#454a6a', '#33375a', '#2a2e4a'); });
  add(CH.burak.gx + CH.burak.gy, () => person(CH.burak, t, 'burak'));
  add(12.4, () => { box(5, 4.7, 2.2, 1.1, 13, '#3a6fa8', '#2c5586', '#22456d'); [5.2, 6.15].forEach((m, i) => { box(m, 5.0, 0.7, 0.14, 9, '#5a5f66', '#3a3e45', '#4a4e55', 13); const mx = sx(m + 0.35, 5.07), my = sy(m + 0.35, 5.07) - 31; R(mx - 6 + (i ? 12 : -12), my + 8 + Math.sin(t / 200 + i) * 1, 1, 1, '#43d08f'); }); });
  // Emre köşesi
  add(0.5, () => { for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) tile(1 + i * 0.5, 5.2 + j * 0.5, '#3a3f55'); });
  add(7.6, () => { box(0.4, 5.3, 0.4, 1.2, 10, '#555a66', '#3a3e48', '#2e323c'); [0, 1, 2].forEach(i => { R(sx(0.8, 5.5 + i * 0.35) - 3, sy(0.8, 5.5 + i * 0.35) - 14, 6, 3, ['#d33', '#3a3', '#36c'][i]); }); });
  add(12.2, () => { R(sx(3.2, 6.8) - 5, sy(3.2, 6.8) - 3, 10, 3, '#cfd3da'); });
  // Bitkiler / süs
  const plant = (gx, gy) => add(gx + gy, () => { const x = sx(gx, gy), y = sy(gx, gy); R(x - 4, y - 8, 8, 8, '#8a4b2a'); R(x - 6, y - 18, 12, 11, '#2f9d4f'); R(x - 3, y - 22, 6, 6, '#46c26a'); R(x + 1, y - 17, 2, 2, '#d33'); });
  plant(7.4, 6.6); plant(0.6, 5.2 > 0 ? 0.9 : 0.9); plant(6.4, 0.9 + 0.0 > 0 ? 3.4 : 3.4);
  add(CH.emre.gx + CH.emre.gy, () => person(CH.emre, t, 'emre'));
  add(4.8 + 2.6, () => dino(t));
  L.sort((a, b) => a[0] - b[0]); return L;
}

// ---------- yazı katmanı (tam çözünürlük) ----------
function txt(s, x, y, font, color, align = 'left') { g.font = font; g.fillStyle = color; g.textAlign = align; g.textBaseline = 'middle'; g.fillText(s, x, y); }
function pill(x, y, w, h, c, hot) { g.fillStyle = 'rgba(12,16,32,.88)'; g.strokeStyle = c; g.lineWidth = hot ? 4 : 2.5; g.beginPath(); g.roundRect(x - w / 2, y - h / 2, w, h, 12); g.fill(); g.stroke(); }
function labels(t) {
  // üst başlık
  pill(600, 44, 520, 62, '#3fd0d8', false); txt('TEKİN HOLDİNG', 600, 38, 'bold 28px system-ui,sans-serif', '#fff', 'center'); txt('ofis · bir karaktere tıkla', 600, 62, '14px system-ui,sans-serif', '#9fd7dc', 'center');
  Object.entries(CH).forEach(([k, c]) => {
    const x = sx(c.gx, c.gy) * S + (k === 'zeynep' ? 10 : 0), below = k === 'burak' || k === 'zeynep';
    let y = (sy(c.gx, c.gy) - (c.sit ? 28 : 36) - 10) * S + 4; if (below) y = (sy(c.gx, c.gy) + (k === 'burak' ? 38 : 14)) * S;
    const d = durum[k] || {}; let note = (hover === k || active === k) ? (d.not || 'Boşta') : ''; if (note.length > 30) note = note.slice(0, 29) + '…';
    g.font = 'bold 22px system-ui,sans-serif'; const w1 = g.measureText(`${c.ad} · ${c.rol}`).width; g.font = '17px system-ui,sans-serif'; const w2 = note ? g.measureText(note).width : 0;
    const w = Math.max(w1, w2) + 28, h = note ? 62 : 38, hot = hover === k || active === k;
    pill(x, y - h / 2, w, h, c.c, hot);
    txt(`${c.ad} · ${c.rol}`, x, y - h + (note ? 19 : 19), 'bold 22px system-ui,sans-serif', '#fff', 'center');
    if (note) txt(note, x, y - 18, '17px system-ui,sans-serif', '#c8d0e8', 'center');
    // yükselen minik semboller
    if (!below) for (let i = 0; i < 3; i++) { const ph = ((t / 3200) + i / 3 + k.length * 0.13) % 1, px = x + w / 2 + 18 + Math.sin(ph * 6 + i) * 8, py = y - h - ph * 40; g.globalAlpha = Math.max(0, 1 - ph); txt(c.parts[i], px, py + 40, 'bold 20px ui-monospace,monospace', c.c); g.globalAlpha = 1; }
  });
}

function frame(t) {
  room(t); items(t).forEach(([, f]) => f());
  g.imageSmoothingEnabled = false; g.drawImage(lo, 0, 0, LW * S, LH * S);
  labels(t); requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

function hit(e) {
  const r = cv.getBoundingClientRect(), x = (e.clientX - r.left) * LW / r.width, y = (e.clientY - r.top) * LH / r.height;
  return Object.keys(HIT).find(k => { const h = HIT[k]; return x >= h[0] && x <= h[2] && y >= h[1] && y <= h[3]; }) || null;
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
  try { const res = await fetch('api/chat', { method: 'POST', body: JSON.stringify({ ajan: k, mesaj: m }) }); if (res.status === 404) throw 0; const r = await res.json(); w.textContent = r.cevap || ('Hata: ' + r.hata); }
  catch { w.textContent = 'Sohbet bu linkte kapalı. Bilgisayarında `node server.mjs` çalıştırıp localhost:5174 üzerinden yaz.'; }
};
