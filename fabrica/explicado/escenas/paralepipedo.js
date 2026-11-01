// «Paralepípedo»: meme de padre e hijo en anime, a 60 fps. Audio aprobado: out/paralepipedo-voz.mp3 (tiempos en RETOMAR.md).
// Los planos son dibujos clave hechos con Gemini (referencias/paralepipedo/clave/, ver PROMPTS.md) animados aquí: cámara, boca con
// 3 posiciones como en el anime (cerrada, milímetros, abierta) a 12 dibujos/s, temblor, bandas negras, cortes en la palabra y el puñetazo.
M.FPS = 60;
const { k, e, eo, cl, mez, az } = M;
const TINTA = '#1a1220';
const hervor = t => Math.floor(t * 12);                         // las líneas «hierven» a 12 dibujos por segundo, como el anime
const tiembla = (g, t, a) => { if (a > 0) g.translate(a * Math.sin(t * 53), a * Math.cos(t * 47)); };
const hierve = (g, t, a = 1.5) => { const s = hervor(t); g.translate((az(s) - .5) * 2 * a, (az(s + 7) - .5) * 2 * a); };
const P = d => new Path2D(d);
function cel(g, p, base, sombra, sombraP, lw = 6, linea = TINTA) {
  g.fillStyle = base; g.fill(p);
  if (sombra && sombraP) { g.save(); g.clip(p); g.fillStyle = sombra; g.fill(sombraP); g.restore(); }
  if (lw) { g.lineWidth = lw; g.strokeStyle = linea; g.lineJoin = 'round'; g.lineCap = 'round'; g.stroke(p); }
}
const trazo = (g, d, lw, col = TINTA) => { g.lineWidth = lw; g.strokeStyle = col; g.lineCap = 'round'; g.lineJoin = 'round'; g.stroke(P(d)); };
const poli = (g, pts, col) => { g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(...p) : g.moveTo(...p)); g.closePath(); g.fillStyle = col; g.fill(); };

// ---------- bocas: se abren con cada sílaba de las palabras de TIEMPOS ----------
const silabas = s => Math.max(1, (s.toLowerCase().match(/[aeiouáéíóú]+/g) || []).length);
const PALABRAS = q => TIEMPOS.frases.filter(f => q.includes(f.escena)).flatMap(f => f.palabras);
let BN, BP;
const boca = (lista, t) => { for (const [s, a, b] of lista) if (t >= a && t <= b) return Math.abs(Math.sin(Math.PI * silabas(s) * (t - a) / (b - a))); return 0; };
const bocaN = t => boca(BN ??= PALABRAS('acegh').concat(PALABRAS('j')), t), bocaP = t => boca(BP ??= PALABRAS('bdf'), t);

// ---------- bandas negras, destello y líneas de velocidad ----------
const barras = (g, h) => { if (h <= 0) return; g.fillStyle = '#000'; g.fillRect(0, 0, M.W, h); g.fillRect(0, M.H - h, M.W, h); };
const cierra = (tl, h) => h * eo(cl(tl / .35));
const destello = (g, tl) => { const a = 1 - k(tl, 0, .12); if (a > 0) { g.fillStyle = `rgba(255,255,255,${a})`; g.fillRect(0, 0, M.W, M.H); } };
function velocidad(g, cx, cy, n, col, s, r0 = 380, grueso = 9) {
  g.fillStyle = col;
  for (let i = 0; i < n; i++) {
    const a = az(i * 3.1 + s) * 6.283, r = r0 + az(i * 7.7 + s) * 260, w = (.2 + az(i * 1.3 + s)) * grueso / 1000;
    g.beginPath(); g.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    g.lineTo(cx + Math.cos(a - w) * 2400, cy + Math.sin(a - w) * 2400); g.lineTo(cx + Math.cos(a + w) * 2400, cy + Math.sin(a + w) * 2400); g.fill();
  }
}
const punetazo = (g, tl, cx, cy, z = .2) => { const s = 1 + z * (1 - eo(cl(tl / .25))); g.translate(cx, cy); g.scale(s, s); g.translate(-cx, -cy); };

let SEM = 0, T = 0;
const IMPACTO = 20.4;                                                 // el puño de Veo llega a cámara y corta el «parale…» (secuencias.py: plano «puno»)
function espiral(g, t) {
  g.fillStyle = '#f3efff'; g.fillRect(0, 0, M.W, M.H);
  const cols = ['#262a6e', '#5d4fc9', '#ffffff', '#f2b04a', '#b8407e', '#8fa0ff'], s = hervor(t) % 3;
  g.save(); g.translate(560, 800); g.lineCap = 'round';
  for (let i = 0; i < 280; i++) {
    const r = 60 + Math.pow(az(i * 3.7), .8) * 1250, a = az(i * 1.9) * 6.283 + t * (3 + 900 / r) + s * .03, l = .4 + az(i * 5.1) * 1.1;
    g.strokeStyle = cols[i % cols.length]; g.globalAlpha = .7 + .3 * az(i * 2.3); g.lineWidth = 6 + 46 * az(i * 8.3) * (r / 1300);
    g.beginPath(); g.arc(0, 0, r, a, a + l); g.stroke();
  }
  g.globalAlpha = 1; const luz = g.createRadialGradient(0, 0, 0, 0, 0, 380); luz.addColorStop(0, 'rgba(255,255,255,1)'); luz.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = luz; g.fillRect(-400, -400, 800, 800); g.restore();
}
function estallido(g, x, y, u, t) {                                 // la explosión del golpe: púas blancas con brillo rosa
  if (u <= 0) return; const s = hervor(t);
  g.save(); g.translate(x, y); g.shadowColor = '#ff3d8b'; g.shadowBlur = 60;
  g.beginPath(); for (let i = 0; i < 36; i++) { const a = i / 36 * 6.283, r = (i % 2 ? 140 : 300 + 260 * az(i + s)) * u; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); } g.closePath();
  g.fillStyle = '#fff'; g.fill(); g.lineWidth = 10; g.strokeStyle = '#ff7ab0'; g.stroke(); g.restore();
}
const X0 = 711, Y0 = 1224;                                            // punto de impacto en pantalla
function energia(g, t, cx = X0, cy = Y0) {                                            // chispas que se meten en el puño mientras carga
  g.save(); g.globalCompositeOperation = 'lighter'; g.lineCap = 'round';
  for (let i = 0; i < 46; i++) { const p = (t * 2.2 + az(i * 2.7)) % 1, a = az(i * 9.1) * 6.283, r = 760 * (1 - p), l = 60 + 90 * (1 - p);
    g.strokeStyle = i % 3 ? 'rgba(255,240,170,.9)' : 'rgba(255,120,200,.9)'; g.lineWidth = 3 + 5 * p;
    g.beginPath(); g.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); g.lineTo(cx + Math.cos(a) * (r + l), cy + Math.sin(a) * (r + l)); g.stroke(); }
  g.restore();
}
function ondas(g, d) {                                              // anillos de la onda expansiva
  g.save(); for (let j = 0; j < 4; j++) { const r = (d - j * .06) * 2800; if (r <= 0) continue; const a = cl(1 - (d - j * .06) / .7);
    if (a <= 0) continue; g.lineWidth = 50 * a + 4; g.strokeStyle = `rgba(255,255,255,${.85 * a})`; g.beginPath(); g.ellipse(X0, Y0, r, r * .8, -.3, 0, 6.29); g.stroke();
    g.lineWidth = 10 * a; g.strokeStyle = `rgba(90,40,140,${.6 * a})`; g.beginPath(); g.ellipse(X0, Y0, r * .96, r * .77, -.3, 0, 6.29); g.stroke(); }
  g.restore();
}
function escombros(g, d) {                                          // trozos y chispas que salen volando con gravedad
  for (let i = 0; i < 70; i++) { const a = az(i * 1.7) * 6.283, v = 700 + az(i * 3.3) * 1900, x = X0 + Math.cos(a) * v * d, y = Y0 + Math.sin(a) * v * d + 1500 * d * d, s = 10 + 34 * az(i * 5.9);
    if (y > M.H + 60) continue; g.save(); g.translate(x, y); g.rotate(d * (6 + 10 * az(i))); g.fillStyle = i % 4 ? '#2a2230' : '#9c8aa6'; g.strokeStyle = '#000'; g.lineWidth = 3;
    g.beginPath(); g.moveTo(-s, -s * .4); g.lineTo(s * .2, -s); g.lineTo(s, s * .3); g.lineTo(-s * .3, s * .8); g.closePath(); g.fill(); g.stroke(); g.restore(); }
  const vida = 1 - k(d, .05, .5); if (vida <= 0) return;
  g.save(); g.globalCompositeOperation = 'lighter'; g.lineCap = 'round';
  for (let i = 0; i < 90; i++) { const a = az(i * 7.3) * 6.283, v = 1200 + az(i * 2.1) * 2600, r = v * d, x = X0 + Math.cos(a) * r, y = Y0 + Math.sin(a) * r + 900 * d * d;
    g.strokeStyle = `rgba(255,${200 + 55 * az(i) | 0},140,${vida})`; g.lineWidth = 3 + 4 * az(i * 4); g.beginPath(); g.moveTo(x, y); g.lineTo(x - Math.cos(a) * 70, y - Math.sin(a) * 70); g.stroke(); }
  g.restore();
}
function grietas(g, u, d) {                                         // la pantalla se raja desde el puño
  if (u <= 0) return; g.save(); g.lineJoin = 'round'; g.lineCap = 'round';
  for (let i = 0; i < 11; i++) { const a = i / 11 * 6.283 + az(i) * .5, L = (350 + az(i * 3) * 900) * u, pts = [[X0, Y0]];
    for (let n = 1; n <= 7; n++) { const r = L * n / 7, b = a + (az(i * 13 + n) - .5) * .5; pts.push([X0 + Math.cos(b) * r, Y0 + Math.sin(b) * r]); }
    const rama = pts[3 + (i % 3)], br = a + (i % 2 ? .6 : -.6), rama2 = [rama, [rama[0] + Math.cos(br) * L * .3, rama[1] + Math.sin(br) * L * .3]];
    for (const [w, c] of [[11, '#000'], [4, '#fff']]) { g.lineWidth = w; g.strokeStyle = c; g.beginPath(); pts.forEach((p, n) => n ? g.lineTo(...p) : g.moveTo(...p)); g.moveTo(...rama2[0]); g.lineTo(...rama2[1]); g.stroke(); } }
  for (let i = 0; i < 8; i++) { const a = az(i * 4.4) * 6.283, r = 60 + 140 * az(i * 6.6); g.fillStyle = `rgba(255,255,255,${.35 * (1 - k(d, .3, .8))})`;
    g.beginPath(); g.moveTo(X0, Y0); g.lineTo(X0 + Math.cos(a) * r * 2, Y0 + Math.sin(a) * r * 2); g.lineTo(X0 + Math.cos(a + .3) * r * 2.2, Y0 + Math.sin(a + .3) * r * 2.2); g.fill(); }
  g.restore();
}
function humo(g, d) {                                               // nube de polvo que crece y se va
  const a = 1 - k(d, .5, .8); if (a <= 0) return;
  for (let i = 0; i < 26; i++) { const b = az(i * 3.9) * 6.283, R = (180 + 520 * az(i * 1.1)) * eo(cl(d / .9)), x = X0 + Math.cos(b) * R, y = Y0 + Math.sin(b) * R * .8 + 80 * d, r = 110 + 160 * az(i * 2.2);
    const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(230,220,240,${.75 * a})`); gr.addColorStop(1, 'rgba(160,140,180,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
}
function onomatopeya(g, d) {                                        // ドンッ!!
  const u = M.rebote(k(d, .02, .16)); if (u <= 0) return;
  g.save(); g.translate(560 + Math.sin(d * 70) * 6 * (1 - k(d, 0, .4)), 560); g.rotate(-.14); g.scale(u * 1.1, u * 1.1); g.font = '900 290px "Hiragino Sans", "Hiragino Kaku Gothic ProN", sans-serif'; g.textAlign = 'center'; g.lineJoin = 'round';
  g.lineWidth = 60; g.strokeStyle = '#fff'; g.strokeText('ドンッ!!', 0, 0); g.lineWidth = 30; g.strokeStyle = '#000'; g.strokeText('ドンッ!!', 0, 0);
  const gr = g.createLinearGradient(0, -230, 0, 20); gr.addColorStop(0, '#ffe14a'); gr.addColorStop(1, '#e8202a'); g.fillStyle = gr; g.fillText('ドンッ!!', 0, 0); g.restore();
}
const capaFx = document.createElement("canvas"), cc = capaFx.getContext("2d"), canal = document.createElement('canvas'), ch = canal.getContext('2d');
function copia(g) { const c = g.canvas; for (const x of [capaFx, canal]) if (x.width !== c.width || x.height !== c.height) { x.width = c.width; x.height = c.height; } cc.clearRect(0, 0, c.width, c.height); cc.drawImage(c, 0, 0); return c; }
function impactoFoto(g, tipo) {                                     // fotogramas de impacto del anime: negativo en blanco y negro o silueta roja
  const c = copia(g); g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
  g.filter = tipo === 'rojo' ? 'grayscale(1) contrast(9)' : 'grayscale(1) contrast(9) invert(1)'; g.drawImage(capaFx, 0, 0); g.filter = "none";
  if (tipo === 'rojo') { g.globalCompositeOperation = 'multiply'; g.fillStyle = '#e3102a'; g.fillRect(0, 0, c.width, c.height); }
  g.restore();
}
function aberracion(g, dx) {                                        // los colores se separan después del golpe
  const c = copia(g), W = c.width, H = c.height, s = W / M.W; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = '#000'; g.fillRect(0, 0, W, H); g.globalCompositeOperation = 'lighter';
  for (const [col, o] of [['#f00', dx], ['#0f0', 0], ['#00f', -dx]]) { ch.globalCompositeOperation = 'source-over'; ch.clearRect(0, 0, W, H); ch.drawImage(capaFx, 0, 0);
    ch.globalCompositeOperation = 'multiply'; ch.fillStyle = col; ch.fillRect(0, 0, W, H); g.drawImage(canal, o * s, 0); }
  g.restore();
}
// ---------- cortes en la palabra y rampa de velocidad (cortes anclados a palabras; rampa: rápido, lento en el pico, rápido) ----------
const ENCUADRES = [[1, 0, 0], [1.45, -.1, 70], [1.18, .09, -30]];
function cortes(g, t, desde) {                                     // cambia de encuadre cada dos «paralepípedo»; devuelve los segundos desde el último corte
  bocaN(0); const ps = BN.filter(p => p[1] >= desde && p[1] <= t), c = Math.floor(ps.length / 2), [z, r, dy] = ENCUADRES[c % 3];
  g.translate(540, 1000 + dy); g.rotate(r); g.scale(z, z); g.translate(-540, -1000);
  return c > 0 ? t - ps[c * 2 - 1][1] : 9;
}
const blanco = (g, d) => { if (d < .06) { g.fillStyle = 'rgba(255,255,255,.85)'; g.fillRect(0, 0, M.W, M.H); } };
const cortesEn = (desde, a, b) => { bocaN(0); return BN.filter(p => p[1] >= desde).map(p => p[1]).filter((x, i) => i % 2 && x >= a && x < b); };
// antes del «Cállate» la imagen se frena (×0,3) y luego recupera de golpe; la voz va a su ritmo
const rampa = t => t < 10.55 ? t : t < 11.15 ? 10.55 + (t - 10.55) * .3 : t < 11.45 ? 10.73 + (t - 11.15) * 2.4 : t;


// ---------- los dibujos clave ----------
const CLAVES = ['pasillo', 'sonrisa', 'sonrisa-mm', 'sonrisa-habla', 'lado', 'lado-grita', 'susto', 'susto-mm', 'susto-que', 'nino', 'nino-grita',
  'furia-aprieta', 'furia-grito', 'ojos', 'sombra', 'carga', 'puno', 'pasillo-2', 'pasillo-3', 'lado-congela', 'nino-salta', 'sombra-0', 'carga-0', 'carga-1'];
const IMG = {};
// ---------- 60 imágenes distintas por segundo (secuencias.py): RIFE dibuja los intermedios entre dibujos clave (cadenas) y retima los clips de Veo (planos) ----------
const CADENAS = { pasillo: ['pasillo', 'pasillo-2', 'pasillo-3'], lado: ['lado-grita', 'lado', 'lado-congela'], manga: ['susto', 'susto-mm', 'susto-que'],
  baki: ['furia-aprieta', 'furia-grito'], nino: ['nino', 'nino-grita', 'nino-salta'], sombra: ['sombra-0', 'sombra'] };
const SEC = { k: 16, cadenas: {}, planos: {} }, RSEC = '../../referencias/paralepipedo/sec';
const abre = src => new Promise(r => { const i = new Image(); i.onload = i.onerror = () => r(i); i.src = src; });
const fotos = (d, n) => Promise.all([...Array(n).keys()].map(i => abre(`${RSEC}/${d}/${String(i).padStart(3, '0')}.jpg`)));
const prepara = Promise.all([...CLAVES.map(async n => IMG[n] = await abre(`../../referencias/paralepipedo/clave/${n}.png`)),
  fetch(`${RSEC}/indice.json`).then(r => r.json()).then(ix => (SEC.k = ix.k, Promise.all([
    ...Object.entries(ix.cadenas).map(async ([c, n]) => SEC.cadenas[c] = await fotos(c, n)),
    ...Object.entries(ix.planos).map(async ([p, { desde, n }]) => SEC.planos[p] = { desde, fotos: await fotos(p, n) })]))).catch(() => {})]);   // sin secuencias quedan los dibujos clave
const cad = (c, x) => { const f = SEC.cadenas[c]; return f ? f[Math.max(0, Math.min(f.length - 1, Math.round(x * SEC.k)))] : IMG[CADENAS[c][Math.round(x)]]; };   // x: 0 primer dibujo, 1 el segundo…
function clip(g, p, t, z = 1, fx = .5, fy = .5) {                  // el fotograma de Veo que toca, a pantalla completa (sin malla: ya se mueve solo)
  const c = SEC.planos[p]; if (!c) return false;
  const im = c.fotos[Math.max(0, Math.min(c.fotos.length - 1, Math.round((t - c.desde) * 60)))], s = Math.max(M.W / im.width, M.H / im.height) * z, w = im.width * s, h = im.height * s;
  g.drawImage(im, (M.W - w / z) / 2 + fx * (w / z - w), (M.H - h / z) / 2 + fy * (h / z - h), w, h); return true;
}
function dibujo(g, n, z = 1, fx = .5, fy = .5, dx = 0, dy = 0, im = IMG[n]) {   // la imagen cubre la pantalla; z acerca hacia el punto (fx, fy); im: un intermedio en vez del dibujo
  const s = Math.max(M.W / im.width, M.H / im.height) * z, w = im.width * s, h = im.height * s;
  const w0 = w / z, h0 = h / z, px = (M.W - w0) / 2 + fx * w0, py = (M.H - h0) / 2 + fy * h0;   // el punto (fx, fy) no se mueve al acercar
  malla(g, im, MALLA[n.replace(/-(mm|habla|grita|que|aprieta|congela|salta|\d)$/, '')] || {}, px - fx * w + dx, py - fy * h + dy, s, n);
}
// ---------- animar el dibujo: malla de triángulos que respira, balancea la cabeza, mueve el pelo, baja la mandíbula y «hierve» ----------
// Puntos en píxeles de la captura (790 × 1414): caras [x, y, radio], boca [x, y], cuerpo = altura desde la que respira.
const MALLA = {
  pasillo: { caras: [[400, 385, 70], [400, 860, 60]], cuerpo: 420 },
  sonrisa: { caras: [[400, 700, 430]], boca: [420, 900], cuerpo: 1050 },
  lado: { caras: [[590, 250, 160], [220, 640, 130]], boca: [280, 690], cuerpo: 400 },
  susto: { caras: [[400, 700, 470]], boca: [400, 1040], cuerpo: 1200 },
  nino: { caras: [[370, 560, 200]], boca: [390, 660], cuerpo: 720 },
  furia: { caras: [[400, 700, 470]], boca: [400, 1000], cuerpo: 1200 },
  ojos: { caras: [[400, 680, 420]] },
  sombra: { caras: [[395, 320, 170]], cuerpo: 480 },
  carga: { caras: [[390, 440, 120], [560, 470, 140]], cuerpo: 560 },
  puno: { caras: [[520, 900, 320]] },
};
let HABLA = 0;                                                       // cuánto abre la boca el que habla ahora (0–1), lo pone cada plano
function malla(g, im, m, ox, oy, s, n) {
  const W = im.width, H = im.height, C = 14, F = 24, t = T, sem = hervor(t), cs = m.caras || [];
  const mueve = (x, y) => {
    let dx = 1.3 * Math.sin(x * .021 + sem * 1.7) * Math.cos(y * .017 + sem * 2.3), dy = 1.3 * Math.cos(x * .019 + sem * 2.9) * Math.sin(y * .023 + sem * 1.1);   // hervor
    if (m.cuerpo != null && y > m.cuerpo) { const q = Math.min(1, (y - m.cuerpo) / 300); dy -= 5 * q * (.5 + .5 * Math.sin(t * 2.3)); dx += 2 * q * Math.sin(t * 1.15); }   // respira
    cs.forEach(([cx, cy, r], i) => {
      const d2 = ((x - cx) ** 2 + (y - cy) ** 2) / (r * r), w = Math.exp(-d2 * 1.4), a = .018 * Math.sin(t * 1.3 + i * 2) + .006 * Math.sin(t * 3.1 + i);
      const rx = x - cx, ry = y - cy; dx += w * (rx * Math.cos(a) - ry * Math.sin(a) - rx); dy += w * (rx * Math.sin(a) + ry * Math.cos(a) - ry) + w * 3 * Math.sin(t * 2.3 + i);
      if (y < cy - r * .45) { const p = Math.min(1, (cy - r * .45 - y) / (r * .6)); dx += p * 4 * Math.sin(t * 2.6 + x * .02 + i); }   // pelo
    });
    if (m.boca && HABLA > 0) { const [bx, by] = m.boca, d2 = ((x - bx) ** 2 + (y - by) ** 2) / 22000; if (y > by - 20) dy += HABLA * 10 * Math.exp(-d2); }   // mandíbula
    return [ox + (x + dx) * s, oy + (y + dy) * s];
  };
  const P = [];
  for (let j = 0; j <= F; j++) for (let i = 0; i <= C; i++) { const x = W * i / C, y = H * j / F; P.push([x, y, ...mueve(x, y)]); }
  const q = (i, j) => P[j * (C + 1) + i];
  for (let j = 0; j < F; j++) for (let i = 0; i < C; i++) { tri(g, im, q(i, j), q(i + 1, j), q(i, j + 1)); tri(g, im, q(i + 1, j), q(i + 1, j + 1), q(i, j + 1)); }
}
function tri(g, im, a, b, c) {                                        // copia el triángulo a-b-c de la imagen a su sitio deformado
  const [x0, y0, u0, v0] = a, [x1, y1, u1, v1] = b, [x2, y2, u2, v2] = c, mx = (u0 + u1 + u2) / 3, my = (v0 + v1 + v2) / 3, ex = p => [p[2] + (p[2] - mx) * .03 + Math.sign(p[2] - mx) * .6, p[3] + (p[3] - my) * .03 + Math.sign(p[3] - my) * .6];
  const det = (x1 - x0) * (y2 - y0) - (x2 - x0) * (y1 - y0); if (!det) return;
  const A = ((u1 - u0) * (y2 - y0) - (u2 - u0) * (y1 - y0)) / det, B = ((u2 - u0) * (x1 - x0) - (u1 - u0) * (x2 - x0)) / det;
  const Cc = ((v1 - v0) * (y2 - y0) - (v2 - v0) * (y1 - y0)) / det, D = ((v2 - v0) * (x1 - x0) - (v1 - v0) * (x2 - x0)) / det;
  g.save(); g.beginPath(); const [p0, p1, p2] = [a, b, c].map(ex); g.moveTo(...p0); g.lineTo(...p1); g.lineTo(...p2); g.closePath(); g.clip();
  g.transform(A, Cc, B, D, u0 - A * x0 - B * y0, v0 - Cc * x0 - D * y0); g.drawImage(im, 0, 0); g.restore();
}
const boca3 = a => a < .15 ? 0 : a < .55 ? 1 : 2;                   // cerrada, milímetros, abierta
const grano = (g, t) => { g.save(); g.globalAlpha = .06; g.fillStyle = '#000'; for (let i = 0; i < 70; i++) { const x = az(i * 3.3 + hervor(t)) * M.W, y = az(i * 7.1 + hervor(t) * 1.3) * M.H; g.fillRect(x, y, 2 + 3 * az(i), 2 + 3 * az(i + 1)); } g.restore(); };
const vineta = (g, a, col = '0,0,0') => { const r = g.createRadialGradient(540, 960, 380, 540, 960, 1250); r.addColorStop(0, `rgba(${col},0)`); r.addColorStop(1, `rgba(${col},${a})`); g.fillStyle = r; g.fillRect(0, 0, M.W, M.H); };

// ---------- los planos ----------
const nino = t => {                                                  // dónde va la cadena nino → grita → salta: la boca sigue las sílabas y una palabra de cada dos salta
  bocaN(0); const i = BN.findIndex(p => t >= p[1] && t <= p[2]); if (i < 0) return 0;
  const u = (t - BN[i][1]) / (BN[i][2] - BN[i][1]), abre = Math.min(1, u / .08, (1 - u) / .08);
  return i % 2 ? abre + Math.sin(Math.PI * u) : abre * (.4 + .6 * bocaN(t));
};
const PLANOS = [[0, 'pasillo'], [2.0, 'cuadro'], [3.9, 'lado'], [5.4, 'manga'], [7.5, 'abajo'], [10.4, 'baki'], [13.2, 'abajo2'], [14.8, 'ojos'],
  [16.2, 'sombra'], [17.8, 'carga'], [18.7, 'golpe'], [19.5, 'abajo3'], [20.12, 'puno'], [IMPACTO + 1.3, 'negro']];
const DIBUJA = {
  pasillo(g, t, tl) {                                                // el niño corre detrás del padre, le toca la espalda y el padre se gira
    g.save(); g.translate(0, t < 1.3 ? Math.abs(Math.sin(t * 9)) * -12 : 0); dibujo(g, 'pasillo', 1.05 + .07 * e(tl / 2), .5, .55, 0, 0, cad('pasillo', 2 * e(k(t, .1, 1.6)))); g.restore(); vineta(g, .45);
  },
  cuadro(g, t, tl) {                                                 // «Dime, hijo»: retrato dorado de Veo; los labios se despegan antes de hablar
    const h = cierra(tl, 300), a = bocaP(t), pre = t > 2.3 && t < 2.5 ? 1 : 0, b = Math.max(boca3(a), pre && !a ? 1 : 0);
    g.save(); if (!clip(g, 'cuadro', t, 1.02 + .04 * tl / 1.9, .5, .45)) { hierve(g, t, .8); dibujo(g, ['sonrisa', 'sonrisa-mm', 'sonrisa-habla'][b], 1.04 + .05 * tl / 1.9, .5, .45); } g.restore();
    g.save(); g.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 9; i++) { const u = (t * .5 + az(i)) % 1, x = 80 + az(i * 9) * 920, y = 300 + az(i * 4) * 1300, r = 4 + 8 * az(i * 2);
      g.fillStyle = `rgba(255,220,150,${.6 * Math.sin(Math.PI * u)})`; g.beginPath(); g.arc(x, y - 120 * u, r, 0, 6.29); g.fill(); }
    g.restore(); destello(g, tl); barras(g, h);
  },
  lado(g, t, tl) {                                                   // de lado: el niño suelta «¡Paralepípedo!» (la boca sigue las sílabas) y el padre se congela
    const ab = t >= 4.02 && t <= 5.04 ? (.35 + .65 * bocaN(t)) * e(k(t, 4.02, .06)) * (1 - e(k(t, 4.96, .08))) : 0;
    g.save(); if (ab > .2) tiembla(g, t, 4); dibujo(g, 'lado', 1.02 + .04 * tl / 1.5, .3, .45, 0, 0, cad('lado', t > 5.04 ? 1 + e(k(t, 5.1, .3)) : 1 - ab)); g.restore();
    if (t > 4.02 && t < 5.2) velocidad(g, 330, 880, 40, 'rgba(255,255,255,.5)', hervor(t) % 3, 420, 5);
  },
  manga(g, t, tl) {                                                  // «¿Qué?»: manga en blanco y negro; ojos que se salen, sudor, temblor
    const h = cierra(tl, 300), x = t < 6.2 ? 0 : t < 6.4 ? e(k(t, 6.2, .2)) : t <= 6.8 ? 1 + bocaP(t) : 1 - e(k(t, 6.8, .3));   // milímetros, «¿Qué?» y cierra
    g.fillStyle = '#fff'; g.fillRect(0, 0, M.W, M.H);
    g.save(); punetazo(g, tl, 540, 900, .25); tiembla(g, t, 2 + 3 * k(t, 5.9, .4) + (x > 1.5 ? 5 : 0)); hierve(g, t, 1.5);
    if (!clip(g, 'manga', t, 1.02 + .04 * e(k(t, 5.4, 2)), .5, .45)) dibujo(g, 'susto', 1.03 + .06 * e(k(t, 5.4, 2)), .5, .45, 0, 0, cad('manga', x)); g.restore();
    g.save(); g.globalCompositeOperation = 'multiply'; velocidad(g, 540, 820, 60, 'rgba(0,0,0,.35)', hervor(t) % 4, 620, 4); g.restore();
    destello(g, tl); barras(g, h);
  },
  abajo(g, t, tl) {                                                  // el padre mira abajo: el niño repite sin parar (cortes en la palabra)
    const tens = k(t, 9.4, 1);
    g.save(); const d = cortes(g, t, 7.5); tiembla(g, t, 2 + 6 * tens); if (!clip(g, 'abajo', t, 1.02 + .03 * tl, .5, .45)) dibujo(g, 'nino', 1.02 + .03 * tl, .5, .45, 0, 0, cad('nino', nino(t))); g.restore(); blanco(g, d);
    vineta(g, .25 + .5 * tens, '120,0,10');
  },
  baki(g, t, tl) {                                                   // «¡Cállate!»: cámara lenta acercándose a los dientes apretados y estalla
    const tw = rampa(t), h = cierra(tl, 340), grita = t >= 11.2 && t < 11.8, z = grita ? 1.12 + .05 * bocaP(t) : 1.04 + .18 * e(k(t, 10.5, .7));
    const x = k(t, 11.17, .06) * (1 - k(t, 11.7, .12)) * (.55 + .45 * bocaP(t));                       // de apretar los dientes al grito, sílaba a sílaba
    g.fillStyle = '#000'; g.fillRect(0, 0, M.W, M.H);
    g.save(); punetazo(g, tl, 540, 960, .3); if (grita) punetazo(g, t - 11.2, 540, 1000, .25);
    tiembla(g, tw, grita ? 9 + 6 * bocaP(t) : 2); hierve(g, tw, 1.5);
    if (grita || t >= 11.17 || !clip(g, 'baki', t, z, .5, .62)) dibujo(g, 'furia', z, .5, grita ? .58 : .62, 0, 0, cad('baki', x)); g.restore();
    g.save(); g.globalCompositeOperation = 'multiply'; velocidad(g, 540, 1000, 70, 'rgba(0,0,0,.4)', hervor(tw) % 5, 560, 5); g.restore();
    if (!grita) gogogo(g, tw, tl);
    vineta(g, .5, '90,0,0'); destello(g, tl); if (grita) blanco(g, t - 11.2); barras(g, h);
  },
  abajo2(g, t, tl) {                                                 // el niño sigue, aún más pesado
    g.save(); const d = cortes(g, t, 11.8); tiembla(g, t, 8); if (!clip(g, 'abajo2', t, 1.1, .5, .45)) dibujo(g, 'nino', 1.1, .5, .45, 0, 0, cad('nino', nino(t))); g.restore(); blanco(g, d);
    vineta(g, .7, '110,0,10');
  },
  ojos(g, t, tl) {                                                   // la mirada: bandas que casi se cierran
    const h = cierra(tl, 620), tic = t > 15.3 && t < 15.55 ? 6 : 0;
    g.fillStyle = '#000'; g.fillRect(0, 0, M.W, M.H);
    g.save(); tiembla(g, t, 2 + tic); dibujo(g, 'ojos', 1.6 + .25 * tl / 1.4, .5, .48); g.restore(); barras(g, h);
  },
  sombra(g, t, tl) {                                                 // el padre se alza sobre el niño; el niño ni se entera
    g.save(); tiembla(g, t, 1 + 2 * k(t, 17, .6)); hierve(g, t, 1); dibujo(g, 'sombra', 1.0 + .1 * e(tl / 1.6), .5, .3, 0, 0, cad('sombra', e(k(t, 16.3, 1.1)))); g.restore();
    vineta(g, .55, '40,0,60');
  },
  carga(g, t, tl) {                                                  // Serious Punch: carga, la espiral gira, chispas al puño
    const u = tl / .9;
    g.save(); tiembla(g, t, 2 + 8 * u); if (!clip(g, 'carga', t, 1.02 + .06 * e(u), .55, .4)) { hierve(g, t, 1.5); dibujo(g, tl < .7 ? 'carga-0' : 'carga', 1.02 + .12 * e(u), .55, .4); } g.restore();
    g.save(); g.globalCompositeOperation = 'lighter'; g.translate(540, 760); g.rotate(t * 2.5);
    for (let i = 0; i < 26; i++) { const a = i / 26 * 6.283, r0 = 300 + 400 * az(i); g.strokeStyle = `rgba(200,150,255,${.25 + .2 * az(i * 3)})`; g.lineWidth = 4 + 6 * az(i * 5);
      g.beginPath(); g.arc(0, 0, r0, a, a + .5); g.stroke(); }
    g.restore();
    energia(g, t, 760, 650); vineta(g, .4, '60,0,90');
  },
  golpe(g, t, tl) {                                                  // lanza el puñetazo (Veo) mientras el niño sigue con lo suyo
    g.save(); tiembla(g, t, 4 + 6 * tl / .8); if (!clip(g, 'golpe', t, 1.02)) dibujo(g, 'carga-1', 1.05, .5, .55); g.restore(); vineta(g, .4, '60,0,90');
  },
  abajo3(g, t, tl) {                                                 // el niño, ajeno: «parale…»
    g.save(); tiembla(g, t, 5); if (!clip(g, 'abajo3', t, 1.15, .5, .45)) dibujo(g, 'nino', 1.15, .5, .45, 0, 0, cad('nino', nino(t))); g.restore(); vineta(g, .6, '110,0,10');
  },
  puno(g, t, tl) {                                                   // el puñetazo de Veo hasta el impacto (sin su explosión); luego fotogramas de impacto, onda, grietas, escombros y humo
    const d = t - IMPACTO, f = Math.floor(d * 60), parado = d >= 0 && d < .1, tf = parado ? IMPACTO : t;
    const sacude = d > 0 ? 34 * Math.pow(1 - k(t, IMPACTO, .7), 2) : 2 + 6 * k(t, IMPACTO - .4, .4);
    g.save(); tiembla(g, t, sacude); if (d > 0) punetazo(g, d, X0, Y0, .3);
    if (!clip(g, 'puno', tf, 1.02 - (d > .1 ? .06 * e(k(t, IMPACTO + .1, 1)) : 0))) { hierve(g, tf, 1.5); dibujo(g, 'puno', 1, 520 / 790, 900 / 1414); }
    if (d > 0) { velocidad(g, X0, Y0, 120, 'rgba(255,255,255,.8)', hervor(tf) % 4, 160, 8); humo(g, d); ondas(g, d); estallido(g, X0, Y0, M.rebote(k(t, IMPACTO, .12)) * (1 - .4 * k(t, IMPACTO + .3, .6)), tf); escombros(g, d); grietas(g, e(k(t, IMPACTO, .08)), d); onomatopeya(g, d); }
    g.restore();
    if (f >= 0 && f < 10) { if (f < 2 || f === 8 || f === 9) { g.fillStyle = '#fff'; g.fillRect(0, 0, M.W, M.H); } else impactoFoto(g, f === 4 || f === 5 ? 'rojo' : 'negativo'); }
    else if (d >= 0 && d < .45) aberracion(g, 26 * (1 - d / .45));
    const fin = k(t, IMPACTO + .8, .45); if (fin > 0) { g.fillStyle = `rgba(0,0,0,${fin})`; g.fillRect(0, 0, M.W, M.H); }
  },
  negro(g) { g.fillStyle = '#000'; g.fillRect(0, 0, M.W, M.H); },
};
function gogogo(g, t, tl) {                                          // ゴゴゴ: la amenaza del manga
  g.save(); g.font = '900 150px "Hiragino Sans", "Hiragino Kaku Gothic ProN", sans-serif'; g.textAlign = 'center'; g.lineJoin = 'round';
  [[880, 620, .2], [940, 860, .15], [170, 1300, -.2], [120, 1060, -.12]].forEach(([x, y, r], i) => {
    const u = k(tl, .15 + i * .12, .2); if (u <= 0) return;
    g.save(); g.translate(x + Math.sin(t * 30 + i) * 4, y); g.rotate(r); g.globalAlpha = u;
    g.lineWidth = 14; g.strokeStyle = '#000'; g.strokeText('ゴ', 0, 0); g.fillStyle = '#8e3fb0'; g.fillText('ゴ', 0, 0); g.restore();
  });
  g.restore();
}


window.VIDEO = {
  dura: IMPACTO + 2.2, prepara,
  sonidos: [...cortesEn(7.5, 7.5, 10.4), ...cortesEn(11.8, 13.2, 14.8), 11.15, 2.0, 3.9, 5.4, 14.8, 16.2, 17.8, 18.7, 19.5].map(en => ({ en, archivo: '../../audio/sfx/eleven/transicion.mp3', volumen: .3, dura: .6 }))
    .concat([[-.55, 'cargar', .22, .55], [-.12, 'latigazo', .35], [-.1, 'punetazo', .35], [0, 'impacto-anime', .4], [.02, 'cristal', .25], [.05, 'onda', .3], [.2, 'pitido', .07], [.5, 'escombros', .25]]
    .map(([d, f, volumen, dura]) => ({ en: IMPACTO + d, archivo: `../../audio/sfx/eleven/${f}.mp3`, volumen, dura }))),
  escenas: [{ en: 0, dibuja(g, t) {
    const i = PLANOS.findLastIndex(p => t >= p[0]), [t0, nombre] = PLANOS[Math.max(0, i)];
    SEM = hervor(t); T = t; HABLA = Math.max(bocaP(t), bocaN(t)); g.save(); DIBUJA[nombre](g, t, t - t0); g.restore(); grano(g, t);
  } }],
};
