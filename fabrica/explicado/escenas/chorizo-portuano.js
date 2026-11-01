// «Chorizo portuano»: cuento de nombres en Lomas Turbas, con el molde del viral de 10 M (EJEMPLO.md). Frases en guion_chorizo-portuano.tsv.
// Noche y luz dorada; la cámara se mete en las cosas (transición de zoom de video.html); cada nombre sale con su etiqueta y línea guía,
// y los números cambian en directo como en el ejemplo.
const { C } = M, W = M.w, F = M.F;
const ROJO = '#a3311f', ORO = C.oro;
const mezclaColor = (a, b, u) => { const h = s => [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16)), A = h(a), B = h(b);
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * M.cl(u)).toString(16).padStart(2, '0')).join(''); };
const habla = (t, a, b) => t > a && t < b ? .25 + .75 * Math.abs(Math.sin(t * 17)) : 0;        // boca que se mueve entre a y b
const ve = (t, a, b, d = .3) => M.k(t, a, d) * (1 - M.k(t, b, d));                                // aparece en a, se va en b
const enf = (x, y, z, sy = 900) => [x, y + (M.H * .56 - sy) / z, z];                                 // el punto (x, y) del mundo, a la altura sy de la pantalla
// cámara por claves [segundo, x, y, zoom, duración del viaje]; devuelve P(x, y) → punto en pantalla (para etiquetas)
const camara = (g, t, claves, temblor = 0) => {
  let [, cx, cy, z] = claves[0];
  for (const [t0, x, y, zz, d] of claves.slice(1)) { const u = M.e(M.k(t, t0, d)); cx = M.mez(cx, x, u); cy = M.mez(cy, y, u); z = M.mez(z, zz, u); }
  cx += temblor * Math.sin(t * 47); cy += temblor * Math.cos(t * 39); M.cam(g, cx, cy, z);
  return (x, y) => [M.W / 2 + (x - cx) * z, M.H * .56 + (y - cy) * z];
};

// ---------- chorizo, colgados y jamones ----------
function chorizo(g, x, y, l, ang, col = ROJO, gr = 34) {
  if (l <= 4) return; g.save(); g.translate(x, y); g.rotate(ang); g.lineCap = 'round';
  g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = gr + 6; g.beginPath(); g.moveTo(-l / 2, 3); g.quadraticCurveTo(0, l * .18 + 3, l / 2, 3); g.stroke();
  g.strokeStyle = col; g.lineWidth = gr; g.beginPath(); g.moveTo(-l / 2, 0); g.quadraticCurveTo(0, l * .18, l / 2, 0); g.stroke();
  g.strokeStyle = 'rgba(255,220,170,.35)'; g.lineWidth = gr * .16; g.beginPath(); g.moveTo(-l * .36, -gr * .2); g.quadraticCurveTo(0, l * .18 - gr * .28, l * .36, -gr * .2); g.stroke();
  g.fillStyle = 'rgba(255,232,205,.4)';
  for (let i = 0; i < 7; i++) { const u = .12 + i * .12, px = M.mez(-l / 2, l / 2, u), py = 2 * u * (1 - u) * l * .18 + (M.az(i + l) - .5) * gr * .5; g.beginPath(); g.arc(px, py, 2.5, 0, 6.29); g.fill(); }
  g.strokeStyle = '#d8c9a8'; g.lineWidth = 3;
  for (const s of [-1, 1]) { g.beginPath(); g.moveTo(s * l / 2, -gr * .4); g.lineTo(s * (l / 2 + 10), -gr * .4 - 12); g.stroke(); }
  g.restore();
}
const colgado = (g, x, y, l, giro) => { g.save(); g.translate(x, y); g.rotate(giro);
  g.strokeStyle = '#d8c9a8'; g.lineWidth = 3; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 22); g.stroke(); chorizo(g, 0, 22 + l / 2, l, Math.PI / 2, ROJO, 30); g.restore(); };
const jamon = (g, x, y, giro) => { g.save(); g.translate(x, y); g.rotate(giro);
  g.strokeStyle = '#d8c9a8'; g.lineWidth = 3; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 30); g.stroke(); g.fillStyle = '#efe6d6'; g.fillRect(-8, 30, 16, 50);
  const gr = g.createLinearGradient(-60, 0, 60, 0); gr.addColorStop(0, '#8a3f26'); gr.addColorStop(1, '#3a160c');
  g.fillStyle = gr; g.beginPath(); g.moveTo(-14, 76); g.bezierCurveTo(-70, 120, -70, 250, 0, 270); g.bezierCurveTo(70, 250, 70, 120, 14, 76); g.fill(); g.restore(); };
// halo dorado que suma luz (focos sobre el chorizo, ventanas)
const halo = (g, x, y, r, a, col = '255,200,120') => { if (a <= 0) return; g.save(); g.globalCompositeOperation = 'lighter';
  const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${col},${.55 * a})`); gr.addColorStop(1, `rgba(${col},0)`); g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); g.restore(); };

// ---------- personas (de frente): x, y = pies; s = escala (1 ≈ 460 px de alto); la cabeza queda en y − 392·s ----------
const TIPOS = {
  elver: { ropa: '#efece6', ropa2: '#b9b3a8', piel: '#e9b38c', pelo: '#2b1d14' },
  benito: { ropa: '#36584a', ropa2: '#1d3329', piel: '#d9a07a', pelo: '#9a9a9a' },
  rosa: { ropa: '#7d4a8f', ropa2: '#4b2858', piel: '#efc3a2', pelo: '#dcdce2' },
  debora: { ropa: '#2f7f86', ropa2: '#1a4b50', piel: '#e8b896', pelo: '#c3c6cc' },
  cura: { ropa: '#1d1d24', ropa2: '#0a0a0e', piel: '#f0c4a4', pelo: '#b8b8b8' },
  alcalde: { ropa: '#25324d', ropa2: '#121a2a', piel: '#e2a77f', pelo: '#3a2a1a' },
};
const CLIENTES = Array.from({ length: 8 }, (_, i) => ({ ropa: ['#8a4b3a', '#3b5f8a', '#6a8a3b', '#8a3b6a', '#4a4a5a', '#a07a2a', '#2f6f6a', '#7a2f2f'][i], ropa2: '#1a1a1e',
  piel: ['#e8b896', '#c98a62', '#f0c8a8', '#a86a46'][i % 4], pelo: ['#222', '#6b3a20', '#c8c8c8', '#3a2a1a'][i % 4] }));
const MORADO = '#9a6fb0';
function persona(g, x, y, s, tipo, o = {}) {
  const T = o.T || TIPOS[tipo], t = o.t || 0, ph = o.fase || 0, boca = o.boca || 0, piel = o.piel || T.piel;
  if (s <= 0) return; M.g = g; g.save(); g.translate(x, y); g.scale(s, s); g.globalAlpha = o.alfa ?? 1;
  g.fillStyle = 'rgba(0,0,0,.4)'; g.beginPath(); g.ellipse(0, 0, 85, 14, 0, 0, 6.29); g.fill();
  const resp = Math.sin(t * 2.2 + ph), paso = o.anda ? Math.sin(t * 11 + ph) : 0;
  g.translate(o.tiembla ? 5 * Math.sin(t * 61) : 0, -(o.salto || 0) - Math.abs(paso) * 6); g.scale(1 + resp * .01, 1 - resp * .01);
  g.strokeStyle = '#211e26'; g.lineWidth = 28; g.lineCap = 'round';
  for (const l of [-1, 1]) { g.beginPath(); g.moveTo(l * 26, -120); g.lineTo(l * 28 + l * paso * 12, -10); g.stroke(); }
  const gr = g.createLinearGradient(-75, 0, 75, 0); gr.addColorStop(0, T.ropa); gr.addColorStop(1, T.ropa2);
  g.fillStyle = gr; g.beginPath(); g.roundRect(-74, -318, 148, 208, [56, 56, 26, 26]); g.fill();
  g.strokeStyle = 'rgba(255,200,120,.28)'; g.lineWidth = 5; g.stroke();                      // luz de borde dorada
  if (tipo === 'elver') { g.save(); g.beginPath(); g.roundRect(-52, -250, 104, 150, 14); g.clip(); g.fillStyle = '#f7f4ef'; g.fillRect(-60, -260, 120, 170);
    g.fillStyle = '#c0392b'; for (let i = -3; i <= 3; i++) g.fillRect(i * 18 - 3, -260, 7, 170); g.restore(); }
  if (tipo === 'benito') { g.fillStyle = '#b8452f'; g.beginPath(); g.roundRect(-46, -322, 92, 30, 14); g.fill(); g.fillRect(14, -300, 22, 70); }
  if (tipo === 'cura') { g.fillStyle = '#f4f4f4'; g.fillRect(-14, -322, 28, 16); }
  if (tipo === 'alcalde') { g.save(); g.beginPath(); g.roundRect(-74, -318, 148, 208, [56, 56, 26, 26]); g.clip(); g.rotate(.6);
    g.fillStyle = '#c0392b'; g.fillRect(-150, -130, 300, 44); g.fillStyle = '#f1c40f'; g.fillRect(-150, -118, 300, 20); g.restore(); }
  // brazos: ángulo 0 = colgando; más = hacia fuera y arriba
  const mano = (lado, ang, objeto) => {
    g.save(); g.translate(lado * 64, -292); g.rotate(-lado * ang);
    g.strokeStyle = T.ropa2; g.lineWidth = 30; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 120); g.stroke();
    g.fillStyle = piel; g.beginPath(); g.arc(0, 130, 18, 0, 6.29); g.fill();
    g.translate(0, 132); g.rotate(lado * ang); objeto && objeto(); g.restore();
  };
  mano(-1, o.brazoI ?? .12, o.objI); mano(1, o.brazoD ?? .12, o.objD);
  // cabeza
  g.translate(0, -392); g.rotate(o.inclina || 0);
  g.fillStyle = piel; for (const l of [-1, 1]) { g.beginPath(); g.arc(l * 64, 6, 14, 0, 6.29); g.fill(); }
  g.beginPath(); g.arc(0, 0, 66, 0, 6.29); g.fill();
  g.fillStyle = T.pelo;
  if (tipo === 'rosa') { g.beginPath(); g.arc(0, -10, 68, 3.3, 6.12); g.fill(); g.beginPath(); g.arc(0, -82, 30, 0, 6.29); g.fill(); }
  else if (tipo === 'debora') { for (let i = 0; i < 9; i++) { const a = 3.2 + i * .37; g.beginPath(); g.arc(Math.cos(a) * 60, Math.sin(a) * 56 - 6, 24, 0, 6.29); g.fill(); } }
  else if (tipo === 'elver') { g.fillStyle = '#ffffff'; g.beginPath(); g.roundRect(-62, -96, 124, 54, [26, 26, 6, 6]); g.fill(); g.fillStyle = '#c0392b'; g.fillRect(-62, -52, 124, 10); }
  else if (tipo === 'benito') { g.fillStyle = '#5a3a24'; g.beginPath(); g.ellipse(0, -48, 96, 18, 0, 0, 6.29); g.fill(); g.beginPath(); g.roundRect(-50, -112, 100, 66, [22, 22, 4, 4]); g.fill();
    g.fillStyle = '#2a1a10'; g.fillRect(-50, -64, 100, 12); }
  else if (tipo === 'cura') { for (const l of [-1, 1]) { g.beginPath(); g.ellipse(l * 58, -12, 14, 30, l * .3, 0, 6.29); g.fill(); } }
  else { g.beginPath(); g.arc(0, -8, 68, 3.3, 6.12); g.fill(); }
  // ojos (>1 = susto), cejas (o.ceja levanta la derecha), gafas, coloretes
  const parp = (t * .55 + ph) % 3.1 < .09 ? .12 : 1, ab = (o.ojos ?? 1) * parp, mira = o.mira ?? 0;
  for (const l of [-1, 1]) { const ex = l * 24 + mira * 8;
    if ((o.ojos ?? 1) > 1.2) { g.fillStyle = '#fff'; g.beginPath(); g.ellipse(ex, -6, 15, 19, 0, 0, 6.29); g.fill(); }
    g.fillStyle = '#1a1412'; g.beginPath(); g.ellipse(ex, -6, 9, 12 * Math.min(ab, 1.3), 0, 0, 6.29); g.fill();
    g.fillStyle = '#fff'; g.beginPath(); g.arc(ex + 3, -10, 3, 0, 6.29); g.fill();
    g.strokeStyle = tipo === 'elver' ? '#2b1d14' : '#6b5a50'; g.lineWidth = 6; g.lineCap = 'round';
    const sube = l === 1 ? (o.ceja || 0) * 16 : (o.ceja || 0) * -3; g.beginPath(); g.moveTo(ex - 13, -30 - sube); g.lineTo(ex + 13, -32 - sube - l * 2); g.stroke(); }
  if (tipo === 'rosa' || tipo === 'debora') { g.strokeStyle = '#3a2f2a'; g.lineWidth = 3.5; for (const l of [-1, 1]) { g.beginPath(); g.arc(l * 24 + mira * 8, -6, 19, 0, 6.29); g.stroke(); } }
  g.fillStyle = 'rgba(220,90,90,.25)'; for (const l of [-1, 1]) { g.beginPath(); g.arc(l * 40, 20, 12, 0, 6.29); g.fill(); }
  if (tipo === 'elver' || tipo === 'benito' || tipo === 'alcalde') { g.fillStyle = tipo === 'benito' ? '#9a9a9a' : '#2b1d14';
    for (const l of [-1, 1]) { g.beginPath(); g.ellipse(l * 16 + mira * 6, 24, 20, 9, l * .25, 0, 6.29); g.fill(); } }
  g.fillStyle = '#3a1512'; g.strokeStyle = '#3a1512'; g.lineWidth = 5; g.lineCap = 'round';
  if (o.gesto === 'o') { g.beginPath(); g.ellipse(mira * 6, 42, 11, 15, 0, 0, 6.29); g.fill(); }
  else if (boca > 0) { g.beginPath(); g.ellipse(mira * 6, 40, 16, 4 + 18 * boca, 0, 0, 6.29); g.fill(); g.fillStyle = '#d4595a'; g.beginPath(); g.ellipse(mira * 6, 44 + 10 * boca, 9, 4 * boca, 0, 0, 6.29); g.fill(); }
  else if (o.gesto === 'serio') { g.beginPath(); g.moveTo(-14 + mira * 6, 40); g.lineTo(14 + mira * 6, 40); g.stroke(); }
  else { g.beginPath(); g.moveTo(-16 + mira * 6, 36); g.quadraticCurveTo(mira * 6, 50, 16 + mira * 6, 36); g.stroke(); }
  if (o.manoBoca) { g.fillStyle = piel; g.beginPath(); g.ellipse(30, 36, 20, 26, -.4, 0, 6.29); g.fill(); g.strokeStyle = 'rgba(0,0,0,.2)'; g.lineWidth = 2; g.stroke(); }
  if (o.ahoga) { g.fillStyle = piel; for (const l of [-1, 1]) { g.beginPath(); g.ellipse(l * 22, 78, 20, 16, 0, 0, 6.29); g.fill(); } }
  g.restore();
}
// objetos en la mano (en el sistema de la mano)
const oChorizo = (l = 150) => () => chorizo(M.g, 0, -30, l, -1.3, ROJO, 30);
const oCuchillo = () => { const g = M.g; g.fillStyle = '#3a2418'; g.fillRect(-8, -40, 16, 46); g.fillStyle = '#dfe5ea'; g.beginPath(); g.moveTo(-8, -40); g.lineTo(8, -40); g.lineTo(4, -150); g.quadraticCurveTo(-14, -110, -8, -40); g.fill(); };
const oMegafono = () => { const g = M.g; g.save(); g.rotate(-1.1); g.fillStyle = '#e4e4ea'; g.beginPath(); g.moveTo(-14, -6); g.lineTo(14, -6); g.lineTo(44, -120); g.lineTo(-44, -120); g.closePath(); g.fill();
  g.fillStyle = '#c0392b'; g.fillRect(-14, -8, 28, 30); g.restore(); };

// ---------- etiquetas, números y bocadillos (en pantalla, como el ejemplo) ----------
function nombre(g, px, py, tx, ty, titulo, sub, a, color = '#f4f6fa') {
  M.etiqueta(g, px, py, tx, ty, titulo, a, color);
  if (sub && a > 0) { g.save(); g.globalAlpha = a; g.fillStyle = '#b8c0d0'; g.font = '600 24px "Helvetica Neue", Helvetica'; g.letterSpacing = '3px';
    g.textAlign = tx < px ? 'right' : 'left'; g.fillText(sub, tx + (tx < px ? -10 : 10), ty + 36); g.restore(); }
}
// rótulo con línea guía que se abre hacia el lado libre de la pantalla (nunca se corta en el borde)
const rotulo = (g, px, py, titulo, sub, a, color) => { const der = px <= 540; nombre(g, px, py, der ? px + 110 : px - 110, M.cl(py - 190, 540, 1380), titulo, sub, a, color); };
// tarjeta con un número que cambia en directo (centrada en x)
function numero(g, x, y, valor, titulo, sub, a, color = '#ffffff') {
  if (a <= 0) return; g.save();
  g.font = '700 62px Menlo, monospace'; const w1 = g.measureText(valor).width;
  g.font = '700 26px "Helvetica Neue", Helvetica'; let w2 = g.measureText(titulo).width;
  if (sub) { g.font = '500 22px "Helvetica Neue", Helvetica'; w2 = Math.max(w2, g.measureText(sub).width); }
  const w = w1 + w2 + 74, e = M.eo(M.cl(a)); g.translate(x - w / 2, y + 24 * (1 - e)); M.tarjeta(g, 0, 0, w, 112, M.cl(a * 2), 24);
  g.globalAlpha = M.cl(a * 2); g.textBaseline = 'middle';
  g.fillStyle = color; g.font = '700 62px Menlo, monospace'; g.fillText(valor, 24, 58);
  g.fillStyle = '#fff'; g.font = '700 26px "Helvetica Neue", Helvetica'; g.fillText(titulo, w1 + 48, sub ? 42 : 58);
  if (sub) { g.fillStyle = C.gris; g.font = '500 22px "Helvetica Neue", Helvetica'; g.fillText(sub, w1 + 48, 76); }
  g.restore();
}
// raya roja que tacha una tarjeta (u: 0→1)
const tacha = (g, x, y, w, u) => { if (u <= 0) return; g.save(); g.strokeStyle = '#ff4a3d'; g.lineWidth = 8; g.lineCap = 'round';
  g.beginPath(); g.moveTo(x - w / 2, y + 70); g.lineTo(x - w / 2 + w * M.eo(u), y + 42); g.stroke(); g.restore(); };
function bocadillo(g, x, y, texto, a, tam = 54, cola = -1, sello = false) {
  if (a <= 0) return; g.save(); g.font = `${sello ? 'italic 600' : '900'} ${tam}px "Helvetica Neue", Helvetica`; const w = g.measureText(texto).width + 70, h = tam * 1.7;
  g.translate(M.cl(x, w / 2 + 24, M.W - w / 2 - 24), M.cl(y, 520 + h, 1450)); const e = M.rebote(M.cl(a)); g.scale(e, e); g.globalAlpha = M.cl(a * 3);
  g.fillStyle = '#fffaf0'; g.beginPath(); g.roundRect(-w / 2, -h, w, h, 36); g.fill();
  g.beginPath(); g.moveTo(cola * 30, -4); g.lineTo(cola * 70, 50); g.lineTo(cola * 80, -4); g.fill();
  g.fillStyle = '#2a1510'; g.textAlign = 'center'; g.fillText(texto, 0, -h * .3); g.restore();
}
function sello(g, x, y, texto, a, color = '#ff4a3d') {
  if (a <= 0) return; g.save(); g.translate(x, y); g.rotate(-.18); const s = 1 + 1.4 * (1 - M.eo(M.cl(a * 1.5))); g.scale(s, s); g.globalAlpha = M.cl(a * 2);
  g.font = '900 84px "Helvetica Neue", Helvetica'; const w = g.measureText(texto).width + 50; g.strokeStyle = color; g.lineWidth = 8; g.strokeRect(-w / 2, -66, w, 100);
  g.fillStyle = color; g.textAlign = 'center'; g.fillText(texto, 0, 14); g.restore();
}
function hielo(g, a) {
  if (a <= 0) return; g.save(); g.globalAlpha = a; g.fillStyle = 'rgba(120,180,255,.2)'; g.fillRect(0, 0, M.W, M.H);
  for (const [x, y] of [[0, 0], [M.W, 0], [0, M.H], [M.W, M.H]]) { const r = g.createRadialGradient(x, y, 0, x, y, 700); r.addColorStop(0, 'rgba(235,248,255,.8)'); r.addColorStop(1, 'rgba(235,248,255,0)'); g.fillStyle = r; g.fillRect(0, 0, M.W, M.H); }
  g.restore();
}
const vineta = g => { const v = g.createRadialGradient(M.W / 2, M.H * .55, M.H * .3, M.W / 2, M.H * .55, M.H * .8); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.65)'); g.fillStyle = v; g.fillRect(0, 0, M.W, M.H); };

// ---------- la tienda por dentro: Elver detrás del mostrador en x = −120 (cabeza a −471), clientes delante con la cabeza a la misma altura ----------
const RIEL = -980;
function tienda(g, t, o = {}) {
  const pared = g.createLinearGradient(0, -1500, 0, 0); pared.addColorStop(0, '#0f0b09'); pared.addColorStop(.55, '#2a1d15'); pared.addColorStop(1, '#160f0b');
  g.fillStyle = pared; g.fillRect(-1600, -1800, 4200, 2600);
  for (let x = -1600; x < 2600; x += 60) for (let y = -300; y < 0; y += 60) { g.fillStyle = Math.abs((x + y) / 60) % 2 ? '#3a3027' : '#2e261e'; g.fillRect(x + 2, y + 2, 56, 56); }
  const su = g.createLinearGradient(0, 0, 0, 700); su.addColorStop(0, '#1a130e'); su.addColorStop(1, '#070504'); g.fillStyle = su; g.fillRect(-1600, 0, 4200, 800);
  for (const [ex, ey] of [[-1250, -700], [-1250, -560], [1000, -700]]) {
    g.fillStyle = '#4a3020'; g.fillRect(ex, ey, 360, 14);
    for (let i = 0; i < 6; i++) { g.fillStyle = ['#8a2b20', '#a8822a', '#2f5f3c', '#b8b0a0'][(i + 4 + ex / 10) & 3]; g.beginPath(); g.roundRect(ex + 16 + i * 56, ey - 66, 42, 66, 6); g.fill();
      g.fillStyle = 'rgba(255,220,170,.18)'; g.fillRect(ex + 22 + i * 56, ey - 58, 6, 48); }
  }
  // letrero luminoso
  g.save(); g.textAlign = 'center'; g.fillStyle = '#120c08'; g.beginPath(); g.roundRect(-620, -1340, 1240, 180, 26); g.fill();
  g.font = '900 104px "Helvetica Neue", Helvetica'; g.letterSpacing = '10px'; g.shadowColor = ORO; g.shadowBlur = 36; g.fillStyle = '#ffe1a8'; g.fillText('CHARCUTERÍA', 0, -1212); g.restore();
  // barra con chorizos y jamones; o.golpe los sacude
  g.fillStyle = '#6a4a30'; g.fillRect(-1300, RIEL - 10, 3000, 14);
  for (let i = 0; i < 26; i++) { const x = -1240 + i * 115, giro = .05 * Math.sin(t * 1.6 + i) + (o.golpe || 0) * Math.sin(t * 9 + i) * .25;
    i % 4 === 2 ? jamon(g, x, RIEL, giro * .5) : colgado(g, x, RIEL, 160 + 40 * M.az(i), giro); }
  for (const lx of [-400, 600, 1500]) halo(g, lx, -1050, 950, .55);
}
function mostrador(g, t, o = {}) {
  // vitrina baja a la izquierda
  for (let i = 0; i < 3; i++) chorizo(g, -540 + i * 90, -335, 80, 0, i % 2 ? ROJO : '#8c2a1a', 26);
  g.fillStyle = 'rgba(200,230,240,.1)'; g.fillRect(-600, -410, 300, 110); g.strokeStyle = 'rgba(255,255,255,.25)'; g.lineWidth = 3; g.strokeRect(-600, -410, 300, 110);
  // frente de madera
  const mg = g.createLinearGradient(0, -300, 0, 0); mg.addColorStop(0, '#6a3e22'); mg.addColorStop(1, '#2a170c'); g.fillStyle = mg; g.fillRect(-640, -300, 1160, 300);
  g.fillStyle = '#9a6438'; g.fillRect(-650, -310, 1180, 20);
  for (let i = 0; i < 5; i++) { g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 4; g.strokeRect(-610 + i * 224, -270, 200, 240); }
  halo(g, -100, -300, 500, .3);
  // báscula con su pantalla (o.peso en gramos)
  if (o.peso !== undefined) {
    g.fillStyle = '#c9ced6'; g.beginPath(); g.roundRect(60, -400, 240, 90, 12); g.fill(); g.fillStyle = '#e8ecf0'; g.fillRect(40, -420, 280, 22);
    g.fillStyle = '#0c1116'; g.fillRect(80, -388, 200, 58); g.fillStyle = '#ff4433'; g.font = '700 46px Menlo, monospace'; g.textAlign = 'right'; g.fillText(`${o.peso} g`, 270, -342);
    if (o.rodajas) for (let i = 0; i < o.rodajas; i++) { g.fillStyle = ROJO; g.beginPath(); g.ellipse(110 + i * 26, -432 - (i % 2) * 6, 20, 8, 0, 0, 6.29); g.fill(); }
  }
}

// ---------- la calle de noche: cartel del pueblo, fachada con escaparate, farola e iglesia ----------
const VENTANA = [-640, -900, 700, 620];                     // x, y, ancho, alto del escaparate
function calle(g, t, o = {}) {
  const su = g.createLinearGradient(0, 0, 0, 900); su.addColorStop(0, '#16181e'); su.addColorStop(1, '#050608'); g.fillStyle = su; g.fillRect(-2600, 0, 6000, 1200);
  g.fillStyle = '#23262e'; g.fillRect(-2600, 0, 6000, 18);
  // cartel de entrada al pueblo
  g.fillStyle = '#5a5e66'; g.fillRect(-1162, -640, 24, 640);
  g.fillStyle = '#f4f4f0'; g.beginPath(); g.roundRect(-1400, -960, 500, 320, 18); g.fill(); g.strokeStyle = '#c0392b'; g.lineWidth = 22; g.beginPath(); g.roundRect(-1385, -945, 470, 290, 12); g.stroke();
  g.fillStyle = '#16181e'; g.textAlign = 'center'; g.font = '900 74px "Helvetica Neue", Helvetica'; g.fillText('LOMAS', -1150, -820); g.fillText('TURBAS', -1150, -730);
  halo(g, -1150, -800, 420, .25, '200,210,255');
  // fachada
  g.fillStyle = '#231b16'; g.fillRect(-780, -1400, 1380, 1400);
  for (let y = -1380; y < 0; y += 46) { g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 2; g.beginPath(); g.moveTo(-780, y); g.lineTo(600, y); g.stroke(); }
  g.fillStyle = '#120c08'; g.beginPath(); g.roundRect(-700, -1370, 1220, 250, 20); g.fill();
  g.save(); g.textAlign = 'center'; g.shadowColor = ORO; g.shadowBlur = 30; g.fillStyle = '#ffe1a8'; g.font = '900 104px "Helvetica Neue", Helvetica'; g.letterSpacing = '8px'; g.fillText('CHARCUTERÍA', -90, -1250);
  g.shadowBlur = 14; g.font = '700 58px "Helvetica Neue", Helvetica'; g.letterSpacing = '12px'; g.fillText('ELVER GALARGA', -90, -1160); g.restore();
  for (let i = 0; i < 12; i++) { g.fillStyle = i % 2 ? '#e9dcc0' : '#9e2a1f'; g.fillRect(-720 + i * 102, -1080, 102, 110); g.beginPath(); g.arc(-669 + i * 102, -970, 51, 0, Math.PI); g.fill(); }
  // escaparate: dentro se ve la tienda (o.dentro dibuja ahí, recortado)
  const [vx, vy, vw, vh] = VENTANA;
  g.save(); g.beginPath(); g.rect(vx, vy, vw, vh); g.clip(); g.fillStyle = '#2a1d15'; g.fillRect(vx, vy, vw, vh); o.dentro && o.dentro();
  g.fillStyle = 'rgba(255,255,255,.05)'; g.beginPath(); g.moveTo(vx + 100, vy); g.lineTo(vx + 260, vy); g.lineTo(vx + 60, vy + vh); g.lineTo(vx - 100, vy + vh); g.fill(); g.restore();
  g.strokeStyle = '#4a3424'; g.lineWidth = 18; g.strokeRect(vx, vy, vw, vh); g.fillStyle = '#3a2818'; g.fillRect(vx - 20, vy + vh, vw + 40, 30);
  halo(g, vx + vw / 2, vy + vh / 2, 700, .45);
  // cartel de pizarra colgado en el escaparate (o.cartel: 0→1 baja; o.tiza1/2: 0→1 escribe cada línea)
  if (o.cartel > 0) { g.save(); g.translate(-290, -860 - 260 * (1 - M.rebote(M.cl(o.cartel)))); g.rotate(.04 * Math.sin(t * 2.5) * (1 - M.k(t, (o.tCartel || 0) + 1, 1)));
    g.strokeStyle = '#c9b48a'; g.lineWidth = 3; g.beginPath(); g.moveTo(-160, 0); g.lineTo(-120, -60); g.moveTo(160, 0); g.lineTo(120, -60); g.stroke();
    g.fillStyle = '#6a4a2a'; g.fillRect(-200, 0, 400, 290); g.fillStyle = '#1e2a22'; g.fillRect(-185, 15, 370, 260);
    g.font = '700 50px "Chalkboard SE", "Comic Sans MS", cursive'; g.textAlign = 'center'; g.fillStyle = '#f2f0e6';
    const linea = (txt, y, u) => { if (u <= 0) return; g.save(); const w = g.measureText(txt).width; g.beginPath(); g.rect(-w / 2 - 5, y - 50, (w + 10) * M.cl(u), 70); g.clip(); g.fillText(txt, 0, y); g.restore(); };
    linea('CHORIZO', 90, o.tiza1); linea('PORTUANO', 150, o.tiza1 * 2 - 1); g.font = '600 34px "Chalkboard SE", "Comic Sans MS", cursive'; linea('recién llegado', 225, o.tiza2); g.restore(); }
  // puerta
  g.fillStyle = '#3a2416'; g.fillRect(140, -920, 340, 920); g.fillStyle = 'rgba(255,190,110,.25)'; g.fillRect(175, -880, 270, 420); g.fillStyle = '#c9a24a'; g.beginPath(); g.arc(420, -460, 12, 0, 6.29); g.fill();
  // farola
  g.fillStyle = '#2a2d34'; g.fillRect(820, -1250, 22, 1250); g.fillRect(780, -1270, 102, 30); halo(g, 831, -1240, 520, .8); g.fillStyle = '#ffe9c0'; g.beginPath(); g.arc(831, -1235, 16, 0, 6.29); g.fill();
  // iglesia (o.iglesia: la ventana del confesionario se enciende)
  g.fillStyle = '#14161d'; g.fillRect(1250, -1150, 560, 1150); g.beginPath(); g.moveTo(1230, -1150); g.lineTo(1530, -1420); g.lineTo(1830, -1150); g.fill();
  g.fillRect(1640, -1800, 170, 700); g.beginPath(); g.moveTo(1630, -1800); g.lineTo(1725, -1930); g.lineTo(1820, -1800); g.fill();
  g.fillStyle = '#5a5e66'; g.fillRect(1718, -2050, 14, 120); g.fillRect(1690, -2010, 70, 14);
  g.fillStyle = mezclaColor('#22252e', '#ffcf6e', o.iglesia || 0); g.beginPath(); g.roundRect(1440, -760, 180, 260, [90, 90, 0, 0]); g.fill(); halo(g, 1530, -640, 500, o.iglesia || 0);
  g.fillStyle = '#2a1d14'; g.beginPath(); g.roundRect(1440, -380, 180, 380, [90, 90, 0, 0]); g.fill();
}

// ---------- 1. gancho: el cartel de Lomas Turbas → Elver Galarga tras el escaparate → el chorizo portuano (frases 1–2) ----------
function escenaGancho(g, t) {
  const tChar = W(1, 'charcutero'), tElv = W(1, 'elver'), tCh = W(1, 'chorizo'), tAg = W(2, 'agota'), tDias = W(2, 'dias'), tNadie = W(2, 'nadie'), tAlta = W(2, 'alta'),
        tNi = W(2, 'ni'), tPre = W(2, 'precio'), tCol = W(2, 'colesterol'), fin = M.fin(2);
  M.fondo(g, t); g.save();
  const P = camara(g, t, [[0, ...enf(-1150, -800, 1.3, 760)], [tChar - .1, ...enf(-90, -1220, .62, 640), .9], [tElv - .35, ...enf(-290, -560, 2.6, 960), .5],
    [tAg - .2, ...enf(-280, -560, 1.55, 1060), .6]]);
  // dentro del escaparate: la tienda a escala 0,62, con la cabeza de Elver en (−290, −560)
  const DX = -290, DY = -560, S = .62, Q = (x, y) => P(DX + (x + 120) * S, DY + (y + 471) * S);
  const alza = M.e(M.k(t, tCh - .45, .4)) * (1 - M.k(t, tNi - .3, .3));
  calle(g, t, { dentro: () => { g.save(); g.translate(DX, DY); g.scale(S, S); g.translate(120, 471);
    tienda(g, t);
    persona(g, -120, -20, 1.15, 'elver', { t, brazoD: M.mez(.15, 2.4, alza), objD: alza > .3 ? oChorizo() : null, manoBoca: t > tNi && t < tPre, mira: .4 });
    halo(g, 30, -520, 260, alza);
    mostrador(g, t);
    persona(g, 230, 59, 1.35, 'otro', { T: CLIENTES[1], t, fase: 2, mira: -1, manoBoca: t > tNadie && t < tNi + .4, ojos: t > tNi ? 1.4 : 1 });
    g.restore(); } });
  g.restore();
  vineta(g);
  // etiquetas: Elver y su chorizo
  const [hx, hy] = Q(-120, -471), [cx, cy] = Q(30, -520);
  rotulo(g, hx + 60, hy - 40, 'ELVER GALARGA', 'CHARCUTERO · LOMAS TURBAS', ve(t, tElv, tCh - .4));
  rotulo(g, cx, cy, 'CHORIZO PORTUANO', 'SU ESPECIALIDAD', ve(t, tCh, tAg - .1), ORO);
  // datos en directo: stock que se agota, el volumen al pedirlo, precio y grasa descartados
  const stock = Math.round(40 * (1 - M.cl((t - tAg) / (tDias + .5 - tAg))));
  numero(g, 540, 520, String(stock).padStart(2, '0'), 'CHORIZOS EN STOCK', 'cada día a las 11:00', ve(t, tAg, tNadie + .2));
  sello(g, 540, 600, 'AGOTADO', ve(t, tDias + .5, tNadie + .2));
  numero(g, 540, 700, `${Math.round(29 + 2 * Math.sin(t * 9))} dB`, 'VOLUMEN AL PEDIRLO', 'susurro ≈ 30 dB · charla ≈ 60 dB', ve(t, tNadie + .2, tPre - .2), '#7fb2ff');
  numero(g, 540, 520, '2,90 €', 'PRECIO', 'cada 100 g', ve(t, tPre - .1, fin + .3)); tacha(g, 540, 520, 420, M.k(t, tPre + .4, .25));
  numero(g, 540, 680, '88 mg', 'COLESTEROL CADA 100 g', 'USDA FoodData Central', ve(t, tCol - .1, fin + .3)); tacha(g, 540, 680, 560, M.k(t, tCol + .6, .25));
  bocadillo(g, hx - 20, hy - 120, '…psst…', ve(t, tNi, tPre), 44, 1, true);
}

// ---------- 2. Benito Camelo llega de Oporto con la receta; Elver se congela (frases 3–4) ----------
function escenaReceta(g, t) {
  const tLl = W(3, 'llego'), tBen = W(3, 'benito'), tDijo = W(3, 'dijo'), tCh = W(3, 'chorizo'), tCong = W(4, 'congelado'), tCh2 = W(4, 'chorizo'),
        tP1 = W(4, 'portuano', 1), tP2 = W(4, 'portuano', 2), tOp = W(4, 'oporto'), tBueno = W(4, 'bueno'), fin = M.fin(4);
  const helado = t > tCong && t < tCh2 - .1, tt = helado ? tCong : t;
  g.fillStyle = '#0b0807'; g.fillRect(0, 0, M.W, M.H); g.save();
  const P = camara(g, t, [[0, ...enf(760, -471, 1.15, 900)], [tDijo - .2, ...enf(120, -471, 1.25, 900), .6], [tCong - .15, ...enf(-120, -471, 2.6, 860), .25],
    [tP1 - .1, ...enf(-120, -480, 3.6, 820), .15], [tP2 - .25, ...enf(330, -440, 2.2, 860), .35]], t > tP1 && t < tP1 + .3 ? 10 : 0);
  tienda(g, tt);
  // puerta con campanilla (derecha)
  g.fillStyle = '#2a1a10'; g.fillRect(1300, -900, 340, 900); g.fillStyle = 'rgba(120,150,190,.25)'; g.fillRect(1340, -860, 260, 420);
  const camp = t > tLl - .4 ? Math.sin(t * 20) * Math.exp(-(t - tLl + .4) * 3) * .5 : 0;
  g.save(); g.translate(1300, -900); g.rotate(camp); g.fillStyle = '#d9a63a'; g.beginPath(); g.moveTo(-18, 40); g.quadraticCurveTo(0, -10, 18, 40); g.fill(); g.restore();
  persona(g, -120, -20, 1.15, 'elver', { t: tt, brazoD: helado ? 2.3 : .5 + .2 * Math.sin(tt * 5), objD: oCuchillo, ceja: M.k(t, tCh2, .3), ojos: helado ? 1.5 : 1,
    gesto: helado ? 'serio' : undefined, boca: habla(t, tCh2, tP1 + .5), mira: .5 });
  mostrador(g, tt);
  const llega = M.e(M.k(t, tLl - .4, 1.7)), ofrece = M.e(M.k(t, tCh - .35, .35)), orgullo = M.k(t, tBueno, .3);
  persona(g, M.mez(1470, 330, llega), 59, 1.35, 'benito', { t: tt, anda: llega > 0 && llega < 1, fase: 3, mira: -1, brazoI: M.mez(.12, 1.35, ofrece), objI: ofrece > .2 ? oChorizo() : null,
    brazoD: M.mez(.12, 2.7, orgullo), boca: habla(t, tDijo + .3, tCh + .7) || habla(t, tP2, tBueno + .4), salto: 20 * Math.sin(Math.PI * M.k(t, tBueno, .4)) });
  halo(g, 70, -330, 280, ofrece);
  g.restore();
  vineta(g);
  const [bx, by] = P(330, -440), [ex, ey] = P(-120, -471), [cx, cy] = P(60, -330);
  rotulo(g, bx, by - 60, 'BENITO CAMELO', 'RECIÉN LLEGADO DE OPORTO', ve(t, tBen, tDijo + .3));
  rotulo(g, cx, cy, 'CHORIZO PORTUANO', 'LA RECETA', ve(t, tCh, tCong - .2), ORO);
  bocadillo(g, ex + 40, ey - 140, '¿CHORIZO… PORTUANO?', ve(t, tCh2, tP2 - .3, .2), 50, -1);
  bocadillo(g, bx - 40, by - 160, 'DE OPORTO. EL BUENO.', ve(t, tOp - .1, fin + .4, .2), 50, 1);
  hielo(g, ve(t, tCong, tCh2 - .1, .15));
  if (helado) { g.save(); g.globalAlpha = M.k(t, tCong, .15); g.fillStyle = '#eaf6ff'; g.font = '900 64px "Helvetica Neue"'; g.textAlign = 'center'; g.fillText('❚❚', M.W / 2, 1480); g.restore(); }
}

// ---------- 3. al día siguiente: el cartel en el escaparate; el cura lo lee en voz alta y corre a confesarse (frase 5) ----------
function escenaCartel(g, t) {
  const tCar = W(5, 'cartel'), tCh = W(5, 'chorizo'), tLleg = W(5, 'llegado'), tCura = W(5, 'cura'), tLeyo = W(5, 'leyo'), tAlta = W(5, 'alta'), tTuvo = W(5, 'tuvo'), tConf = W(5, 'confesarse');
  M.fondo(g, t); g.save();
  const P = camara(g, t, [[0, ...enf(-290, -640, .9, 1100)], [tCura - .7, ...enf(-330, -560, .78, 1060), .7], [tTuvo - .2, ...enf(1150, -800, .7, 1000), 1.1]]);
  calle(g, t, { cartel: M.k(t, tCar - .2, .5), tCartel: tCar, tiza1: M.cl((t - tCh + .1) / .9), tiza2: M.cl((t - tLleg + .3) / .6), iglesia: M.k(t, tConf + .2, .3),
    dentro: () => { g.save(); g.translate(-290, -560); g.scale(.62, .62); g.translate(120, 471); tienda(g, t); persona(g, -120, -20, 1.15, 'elver', { t, mira: .5 }); mostrador(g, t); g.restore(); } });
  // el cura: llega andando, se para a leer, se espanta y sale corriendo a la iglesia
  const llega = M.e(M.k(t, tCura - 1.3, 1.2)), corre = M.e(M.k(t, tTuvo - .1, 1.1));
  const cx = M.mez(M.mez(-1700, -280, llega), 1530, corre);
  persona(g, cx, 40, 1.2, 'cura', { t, anda: (llega > 0 && llega < 1) || (corre > 0 && corre < 1), fase: 1, mira: corre > 0 ? 1 : -1, boca: habla(t, tLeyo, tAlta + .4),
    ojos: t > tAlta + .2 ? 1.6 : 1, gesto: t > tAlta + .2 && corre < .1 ? 'o' : undefined, brazoD: t > tAlta + .2 ? 2.6 : .12, alfa: 1 - M.k(t, tConf + .2, .3) });
  g.restore();
  vineta(g);
  const [px, py] = P(cx, 40 - 392 * 1.2), [ix, iy] = P(1530, -640);
  rotulo(g, px, py - 30, 'EL CURA', 'DE LOMAS TURBAS', ve(t, tCura, tAlta + .2));
  bocadillo(g, px, py - 130, '«CHORIZO PORTUANO»', ve(t, tLeyo, tTuvo, .2), 48, -1);
  numero(g, 540, 1340, 'DÍA 2', 'AL DÍA SIGUIENTE', '08:00 · Lomas Turbas', ve(t, F(5).en, tCar + .8));
  rotulo(g, ix, iy, 'CONFESIONARIO', 'OCUPADO · 40 MIN', M.k(t, tConf + .2, .3), ORO);
}

// ---------- 4. la cola: Rosa Melano, 200 g en voz alta; Debora Meltrozo se atraganta y Benito la salva (frases 6–8) ----------
const COLA = { rosa: 450, debora: 680, benito: 910 };
function escenaCola(g, t) {
  const tRosa = W(6, 'rosa'), t94 = W(6, '94'), tJura = W(6, 'jura'), tNav = W(6, 'navidad'), t200 = W(7, '200'), tPid = W(7, 'pidio'), tEn = W(7, 'en'), tSil = W(7, 'silencio'),
        tDeb = W(8, 'deborameltrozo'), tDev = W(8, 'devoro'), tAtr = W(8, 'atraganto'), tSalvo = W(8, 'salvo'), tBen = W(8, 'benito'), tUtil = W(8, 'util'), fin = M.fin(8);
  g.fillStyle = '#0b0807'; g.fillRect(0, 0, M.W, M.H);
  const grito = ve(t, tEn, tSil, .12), silencio = M.k(t, tSil, .2) * (1 - M.k(t, tDeb - .3, .3));
  g.save();
  const P = camara(g, t, [[0, ...enf(1500, -471, 1.0, 900)], [F(6).en, ...enf(COLA.rosa, -471, 1.9, 880), 2.3], [tPid - .2, ...enf(180, -380, 1.5, 960), .5],
    [tEn - .15, ...enf(560, -471, 1.25, 900), .3], [tSil - .1, ...enf(760, -471, .85, 960), .4], [F(8).en, ...enf(COLA.debora, -471, 1.9, 880), .6],
    [tSalvo - .2, ...enf(760, -460, 1.55, 880), .5], [tUtil - .5, ...enf(COLA.debora + 120, -460, 1.75, 880), .5]], grito * 8 + (t > tAtr && t < tSalvo + .6 ? 3 : 0));
  tienda(g, t, { golpe: grito });
  const peso = Math.round(200 * M.e(M.k(t, t200 - .2, .7)));
  persona(g, -120, -20, 1.15, 'elver', { t, brazoD: .6 + .5 * Math.sin(t * 13) * ve(t, tPid, t200 + .4, .1), objD: oCuchillo, mira: 1, ojos: t > tSil && t < tDeb ? 1.4 : 1 });
  mostrador(g, t, { peso, rodajas: Math.min(6, Math.max(0, Math.floor((t - tPid) * 8))) });
  // la cola, de la puerta hacia el mostrador (los de detrás primero)
  const mira = t > tEn ? -1 : -.4, asombro = t > tSil && t < tDeb;
  for (let i = 7; i >= 0; i--) persona(g, 1140 + i * 230, 59, 1.35, 'otro', { T: CLIENTES[i], t, fase: i, mira, gesto: asombro ? 'o' : undefined, ojos: asombro ? 1.4 : 1 });
  // Benito: espera en la cola; en «salvó» se pone detrás de Debora y le hace la maniobra
  const salva = M.e(M.k(t, tSalvo - .3, .45)), aprieta = ve(t, tSalvo + .2, tUtil - .4, .1) * Math.max(0, Math.sin(t * 16));
  persona(g, M.mez(COLA.benito, COLA.debora + 120, salva), M.mez(59, 10, salva), 1.35, 'benito', { t, fase: 3, mira: salva > .5 ? -.6 : mira, gesto: asombro ? 'o' : undefined,
    brazoI: salva * 1.2, brazoD: salva * 1.2 });
  // Debora: devora el trozo, se atraganta (morada) y se recupera
  const come = M.cl((t - tDev) / (tAtr - tDev)), ahogo = M.k(t, tAtr, .3) * (1 - M.k(t, tUtil - .5, .5));
  persona(g, COLA.debora, 59, 1.35, 'debora', { t, fase: 4, mira, piel: mezclaColor(TIPOS.debora.piel, MORADO, ahogo), ojos: ahogo > .3 ? 1.6 : asombro ? 1.4 : 1,
    gesto: asombro ? 'o' : undefined, boca: t > tDev && t < tAtr ? .3 + .7 * Math.abs(Math.sin(t * 12)) : 0, tiembla: ahogo > .3, ahoga: ahogo > .3,
    brazoD: t > tDeb && t < tAtr ? 1.8 : .12, objD: t > tDeb - .2 && come < 1 ? oChorizo(150 * (1 - come)) : null });
  if (salva > .5) { const yb = 59 - 200 * 1.35, s = 1.35, p = aprieta * 10; g.strokeStyle = TIPOS.benito.ropa2; g.lineWidth = 30 * s * .8; g.lineCap = 'round';
    g.beginPath(); g.moveTo(COLA.debora + 95 * s, yb - 40); g.lineTo(COLA.debora + 10, yb - p); g.moveTo(COLA.debora - 95 * s, yb - 40); g.lineTo(COLA.debora - 10, yb - p); g.stroke();
    g.fillStyle = TIPOS.benito.piel; g.beginPath(); g.arc(COLA.debora, yb - p, 26, 0, 6.29); g.fill(); }
  // el trozo sale disparado
  const vuela = M.k(t, tSalvo + .55, .8); if (vuela > 0 && vuela < 1) { const x0 = COLA.debora, y0 = 59 - 352 * 1.35;
    g.save(); g.translate(x0 - 700 * vuela, y0 - 380 * Math.sin(Math.PI * vuela) + 200 * vuela); g.rotate(vuela * 12); chorizo(g, 0, 0, 50, 0, ROJO, 26); g.restore(); }
  // Rosa, la primera
  persona(g, COLA.rosa, 59, 1.35, 'rosa', { t, fase: 1, mira: t > tEn ? 1 : -.3, boca: habla(t, tJura - .1, tNav + .5) || habla(t, tPid, tSil - .2), brazoD: grito > 0 ? 2.5 : .12,
    salto: 14 * grito * Math.abs(Math.sin(t * 9)) });
  g.restore();
  vineta(g);
  const [rx, ry] = P(COLA.rosa, -471), [dx, dy] = P(COLA.debora, -471), [bx, by] = P(M.mez(COLA.benito, COLA.debora + 120, salva), -480);
  const edad = Math.round(94 * M.e(M.cl((t - t94 + .3) / .8)));
  rotulo(g, rx, ry - 50, 'ROSA MELANO', t > t94 - .3 ? `${edad} AÑOS` : 'LA PRIMERA DE LA COLA', ve(t, tRosa, tPid - .2));
  bocadillo(g, rx + 40, ry - 140, 'ESTE AÑO NO LLEGO A NAVIDAD', ve(t, tJura, tPid - .1, .2), 40, -1);
  numero(g, 540, 1300, String(Math.round(31 * M.cl((t - tNav + .4) / .9))), 'NAVIDADES DICIÉNDOLO', 'desde 1995', ve(t, tNav - .4, tPid - .1));
  bocadillo(g, rx + 30, ry - 140, '¡200 g DE CHORIZO PORTUANO!', ve(t, tPid + .3, tSil, .2) * (1 + .25 * grito), 42, -1);
  numero(g, 540, 1300, `${Math.round(M.mez(78, 0, M.k(t, tSil, .4)))} dB`, 'VOLUMEN EN LA TIENDA', 'el de Rosa: 78 dB', ve(t, tEn, tDeb - .4), '#7fb2ff');
  rotulo(g, dx, dy - 50, 'DEBORA MELTROZO', 'HERMANA DE ROSA', ve(t, tDeb, tSalvo - .2));
  sello(g, 540, 1300, 'ATRAGANTADA', ve(t, tAtr + .1, tSalvo + .6), '#c89bff');
  rotulo(g, bx, by - 60, 'BENITO CAMELO', `COSAS ÚTILES: ${t > tUtil ? 1 : 0}`, ve(t, tBen, fin + .4));
}

// ---------- 5. la plaza: el alcalde lo anuncia; desfilan los nombres; el pueblo grita a coro (frases 9–10) ----------
function plaza(g, t, o) {
  g.fillStyle = '#2b2620'; g.fillRect(-1000, -1900, 2000, 1900);
  for (let y = -1880; y < 0; y += 70) { g.strokeStyle = 'rgba(0,0,0,.2)'; g.lineWidth = 2; g.beginPath(); g.moveTo(-1000, y); g.lineTo(1000, y); g.stroke(); }
  g.save(); g.textAlign = 'center'; g.fillStyle = '#d9c9a8'; g.font = '700 54px "Helvetica Neue", Helvetica'; g.letterSpacing = '14px'; g.fillText('AYUNTAMIENTO', 0, -1640);
  g.font = '900 80px "Helvetica Neue", Helvetica'; g.fillText('LOMAS TURBAS', 0, -1550); g.restore();
  for (const x of [-700, -350, 350, 700]) { g.fillStyle = '#ffcf6e'; g.globalAlpha = .55; g.beginPath(); g.roundRect(x - 70, -1440, 140, 220, [70, 70, 0, 0]); g.fill(); g.globalAlpha = 1; }
  g.fillStyle = '#1a1612'; g.beginPath(); g.roundRect(-160, -1480, 320, 560, [160, 160, 0, 0]); g.fill();
  // tarima abajo
  g.fillStyle = '#5a3a20'; g.fillRect(-800, -70, 1600, 70); g.fillStyle = '#7a5030'; g.fillRect(-820, -80, 1640, 16);
  // guirnalda de bombillas
  for (const [y0, comba] of [[-1900, 220], [-1500, 160]]) for (let i = 0; i <= 40; i++) { const u = i / 40, x = -1400 + 2800 * u, y = y0 + comba * 4 * u * (1 - u);
    g.fillStyle = (i + Math.floor(t * 3)) % 3 ? '#ffd27a' : '#fff1c9'; g.beginPath(); g.arc(x, y, 9, 0, 6.29); g.fill(); halo(g, x, y, 60, .5); }
}
const balcon = (g, t) => { g.fillStyle = '#3a332b'; g.fillRect(-520, -920, 1040, 40);
  g.strokeStyle = '#1a1612'; g.lineWidth = 12; g.beginPath(); g.moveTo(-500, -1100); g.lineTo(500, -1100); g.stroke();
  for (let x = -480; x <= 480; x += 60) { g.lineWidth = 8; g.beginPath(); g.moveTo(x, -1100); g.lineTo(x, -920); g.stroke(); } };
function trofeo(g, x, y, a) {
  if (a <= 0) return; g.save(); g.translate(x, y); const e = M.rebote(M.cl(a)); g.scale(e, e);
  halo(g, 0, -120, 300, 1); g.fillStyle = '#e8b84a'; g.beginPath(); g.moveTo(-70, -200); g.lineTo(70, -200); g.quadraticCurveTo(60, -80, 0, -70); g.quadraticCurveTo(-60, -80, -70, -200); g.fill();
  g.fillRect(-12, -72, 24, 50); g.fillRect(-50, -26, 100, 26); chorizo(g, 0, -230, 120, -.15, ROJO, 28); g.restore();
}
function multitud(g, t, sube, salto) {
  for (let fila = 0; fila < 3; fila++) for (let i = 0; i < 14; i++) {
    const x = -1500 + i * 230 + fila * 115 + 30 * M.az(i + fila * 20), y = 260 + fila * 170 + 600 * (1 - sube) * (1 + fila * .3), s = 1.2 + fila * .25, sa = salto * 30 * Math.abs(Math.sin(t * 8 + i * 1.7 + fila));
    g.save(); g.translate(x, y - sa); g.scale(s, s); const c = ['#3a2e28', '#2c2a35', '#33302a', '#2a3330'][(i + fila) & 3];
    g.fillStyle = c; g.beginPath(); g.roundRect(-70, -150, 140, 200, 60); g.fill(); g.beginPath(); g.arc(0, -200, 52, 0, 6.29); g.fill();
    g.strokeStyle = 'rgba(255,200,120,.35)'; g.lineWidth = 4; g.beginPath(); g.arc(0, -200, 52, 3.6, 5.8); g.stroke();
    if (salto > .2) { g.strokeStyle = c; g.lineWidth = 26; g.lineCap = 'round'; for (const l of [-1, 1]) { g.beginPath(); g.moveTo(l * 60, -130); g.lineTo(l * 110, -280); g.stroke(); } }
    g.restore(); }
}
const DESFILE = [['elver', -660, 'ELVER GALARGA', 'EL CHARCUTERO'], ['benito', -220, 'BENITO CAMELO', 'TRAÍDO POR'], ['rosa', 220, 'ROSA MELANO', 'PROBADO POR'], ['debora', 660, 'DEBORA MELTROZO', 'DEVORADO POR']];
function escenaPremio(g, t) {
  const tAlc = W(9, 'alcalde'), tMeg = W(9, 'megafono'), tEmb = W(9, 'embutido'), tCh = W(9, 'chorizo'), tLom = W(10, 'lomas'), tCoro = W(10, 'chorizo'), fin = M.fin(10);
  const sale = { elver: W(9, 'elver'), benito: W(9, 'benito'), rosa: W(9, 'rosa'), debora: W(9, 'deborameltrozo') };
  const grito = M.k(t, tCoro - .05, .12);
  M.fondo(g, t, 'rgba(40,20,5,.3)'); g.save();
  const P = camara(g, t, [[0, ...enf(0, -1331, 1.55, 1060)], [tEmb - .3, ...enf(80, -1150, 1.05, 1000), .5], [tCh - .2, ...enf(0, -650, .62, 1000), .7],
    [tLom - .2, ...enf(0, -500, .46, 1080), 1.2]], grito * 10 * (1 - M.k(t, fin, .5)));
  plaza(g, t);
  persona(g, 0, -920, 1.1, 'alcalde', { t, brazoD: M.mez(.12, 2.2, M.k(t, tMeg - .3, .3)), objD: t > tMeg - .3 ? oMegafono : null, boca: habla(t, tEmb, M.fin(9)), mira: .3 });
  balcon(g, t); trofeo(g, 300, -1100, M.k(t, tEmb, .4));
  for (const [tipo, x] of DESFILE) { const u = M.e(M.k(t, sale[tipo] - .15, .4)); if (u <= 0) continue;
    persona(g, x, -80 + 300 * (1 - u), 1.4, tipo, { t, fase: x, mira: 0, brazoD: 2.5 * grito + (tipo === 'elver' ? .4 : 0), salto: 30 * grito * Math.abs(Math.sin(t * 8 + x)), boca: habla(t, tCoro, fin), alfa: u }); }
  multitud(g, t, M.e(M.k(t, F(10).en - .2, .9)), grito);
  g.restore();
  vineta(g);
  const [ax, ay] = P(0, -920 - 392 * 1.1), [tx, ty] = P(300, -1300);
  rotulo(g, ax, ay - 20, 'EL ALCALDE', 'CON MEGÁFONO', ve(t, tAlc, tEmb - .1));
  rotulo(g, tx, ty, 'EMBUTIDO DEL AÑO', 'LOMAS TURBAS', ve(t, tEmb + .2, tCh - .1), ORO);
  for (const [tipo, x, nom, rol] of DESFILE) { const [px, py] = P(x, -80 - 392 * 1.4 - 190); const a = ve(t, sale[tipo], F(10).en - .1);
    if (a > 0) { g.save(); g.globalAlpha = a; g.fillStyle = t < sale[tipo] + 1.4 ? ORO : '#f4f6fa'; g.font = '800 28px "Helvetica Neue", Helvetica'; g.letterSpacing = '2px'; g.textAlign = 'center';
      g.fillText(nom.split(' ')[0], px, py - 30); g.fillText(nom.split(' ')[1], px, py + 4);
      g.fillStyle = '#b8c0d0'; g.font = '600 20px "Helvetica Neue", Helvetica'; g.fillText(rol, px, py - 66); g.restore(); } }
  bocadillo(g, 540, 760, '¡CHORIZO PORTUANO!', grito * (1 - M.k(t, fin + .2, .3)), 92, 1);
  numero(g, 540, 1300, `${Math.round(M.mez(40, 112, M.k(t, tCoro, .4)))} dB`, 'LOMAS TURBAS A CORO', 'como un concierto de rock', ve(t, tCoro, fin + .3), '#ff8a6a');
}

// ---------- 6. el giro: por qué lo compran (frase 11) ----------
function escenaGiro(g, t) {
  const tSab = W(11, 'sabor'), tGus = W(11, 'gusto'), tAlta = W(11, 'alta');
  M.fondo(g, t, 'rgba(60,30,10,.25)');
  // chorizo grande en el foco
  g.save(); g.translate(540, 760 + 10 * Math.sin(t * 1.5)); g.rotate(-.12 + .04 * Math.sin(t)); halo(g, 0, 0, 420, .9); chorizo(g, 0, 0, 640, 0, ROJO, 120); g.restore();
  M.tarjeta(g, 90, 1000, 900, 470, M.k(t, F(11).en, .3));
  g.save(); g.globalAlpha = M.k(t, F(11).en, .3); g.fillStyle = '#fff'; g.font = '800 34px "Helvetica Neue", Helvetica'; g.letterSpacing = '3px'; g.fillText('¿POR QUÉ LO COMPRAN?', 140, 1070);
  const barra = (y, txt, valor, u, col) => { g.fillStyle = '#b8c0d0'; g.font = '700 28px "Helvetica Neue", Helvetica'; g.fillText(txt, 140, y);
    g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(140, y + 20, 680, 54); g.fillStyle = col; g.fillRect(140, y + 20, 680 * valor / 100 * M.e(u), 54);
    g.fillStyle = '#fff'; g.font = '700 48px Menlo, monospace'; g.fillText(`${Math.round(valor * M.e(u))} %`, 838, y + 66); };
  barra(1150, 'POR EL SABOR', 3, M.k(t, tSab - .2, .5), '#8a93a6');
  barra(1290, 'POR DECIRLO EN VOZ ALTA', 97, M.k(t, tGus - .2, 1.3), ORO);
  g.fillStyle = C.gris; g.font = '500 22px "Helvetica Neue", Helvetica'; g.letterSpacing = '0px'; g.fillText('Encuesta inventada · n = 2.340 vecinos de un pueblo que no existe', 140, 1440);
  g.restore();
  vineta(g);
  sello(g, 760, 1230, '97 %', M.k(t, tAlta, .2), ORO);
}

// ---------- 7. mándaselo: menú de compartir como el del ejemplo; acaba en el chorizo (frase 12) ----------
const CONTACTOS = [['Abuela', '#7d4a8f', 'abuela'], ['Hermana', '#2f7f86', 'hermana'], ['Ese amigo', '#b8452f', 'amigo'], ['Mamá', '#c0392b'], ['Cuñado', '#3b5f8a'], ['Tía Puri', '#a07a2a'], ['Jefe', '#4a4a5a'], ['Familia', '#2f6f6a']];
function escenaRemate(g, t) {
  const tMan = W(12, 'mandaselo'), tTodos = W(12, 'todos'), tLle = W(12, 'llegue'), tCh = W(12, 'chorizo');
  const baja = M.e(M.k(t, tCh - .25, .6));                                        // el menú se va y queda el chorizo
  M.fondo(g, t, 'rgba(60,30,10,.25)');
  g.save(); g.translate(540, M.mez(560, 1000, baja)); g.scale(M.mez(.8, 1.25, baja), M.mez(.8, 1.25, baja)); g.rotate(-.12); halo(g, 0, 0, 480, .9); chorizo(g, 0, 0, 640, 0, ROJO, 120); g.restore();
  const sube = M.eo(M.k(t, tMan - .3, .45)) * (1 - baja), y0 = 740 + 1200 * (1 - sube);
  if (sube > 0) {
    g.save(); g.fillStyle = '#1d2027'; g.beginPath(); g.roundRect(0, y0, M.W, 1200, [44, 44, 0, 0]); g.fill();
    g.fillStyle = '#4a4f5a'; g.beginPath(); g.roundRect(480, y0 + 22, 120, 10, 5); g.fill();
    g.fillStyle = '#2c3038'; g.beginPath(); g.roundRect(60, y0 + 70, 960, 76, 20); g.fill(); g.fillStyle = '#8a93a6'; g.font = '500 32px "Helvetica Neue", Helvetica'; g.fillText('Buscar', 110, y0 + 120);
    const todos = M.k(t, tTodos, .3);
    CONTACTOS.forEach(([n, col, palabra], i) => { const x = 160 + (i % 4) * 253, y = y0 + 260 + Math.floor(i / 4) * 220;
      const on = Math.max(palabra ? M.k(t, W(12, palabra), .2) : 0, M.k(todos, i / 10, .25));
      g.fillStyle = col; g.beginPath(); g.arc(x, y, 72, 0, 6.29); g.fill(); g.fillStyle = '#fff'; g.font = '800 54px "Helvetica Neue", Helvetica'; g.textAlign = 'center'; g.fillText(palabra === 'amigo' ? '?' : n[0], x, y + 19);
      g.fillStyle = '#e8ebf0'; g.font = '500 28px "Helvetica Neue", Helvetica'; g.fillText(n, x, y + 120);
      if (palabra === 'amigo') { g.globalAlpha = M.k(t, W(12, 'pillado') - .3, .3); g.fillStyle = C.gris; g.font = '500 22px "Helvetica Neue", Helvetica'; g.fillText('aún no lo ha pillado', x, y + 152); g.globalAlpha = 1; }
      if (on > 0) { g.strokeStyle = C.azul; g.lineWidth = 7; g.beginPath(); g.arc(x, y, 82, 0, 6.29); g.stroke();
        g.fillStyle = C.azul; g.beginPath(); g.arc(x + 52, y + 52, 24 * M.rebote(on), 0, 6.29); g.fill(); g.strokeStyle = '#fff'; g.lineWidth = 5; g.beginPath(); g.moveTo(x + 41, y + 52); g.lineTo(x + 49, y + 60); g.lineTo(x + 64, y + 44); g.stroke(); }
      g.textAlign = 'left'; });
    const pulsa = M.k(t, tLle, .15), by = y0 + 660;
    g.fillStyle = pulsa > 0 ? '#3a3f4a' : C.azul; g.beginPath(); g.roundRect(60, by, 960, 100, 24); g.fill();
    g.fillStyle = '#fff'; g.font = '700 40px "Helvetica Neue", Helvetica'; g.textAlign = 'center'; g.fillText(pulsa > 0 ? '✓ Enviado' : 'Enviar', 540, by + 64); g.textAlign = 'left';
    // el dedo que toca cada contacto y luego «Enviar»
    const obj = [[W(12, 'abuela'), 160, y0 + 260], [W(12, 'hermana'), 413, y0 + 260], [W(12, 'amigo'), 666, y0 + 260], [tLle, 540, by + 50]];
    let fx = 1200, fy = 1900; for (const [t0, x, y] of obj) { const u = M.e(M.k(t, t0 - .35, .3)); fx = M.mez(fx, x + 30, u); fy = M.mez(fy, y + 40, u); }
    const toca = obj.some(([t0]) => t > t0 - .05 && t < t0 + .12) ? 10 : 0;
    g.save(); g.translate(fx, fy + toca); g.rotate(-.45); g.fillStyle = '#e2a07c'; g.beginPath(); g.roundRect(-34, 0, 68, 520, 34); g.fill();
    g.fillStyle = '#f2c4a8'; g.beginPath(); g.roundRect(-24, 8, 48, 60, 20); g.fill(); g.restore();
    g.restore();
  }
  const fin = M.k(t, W(12, 'chorizo'), .35); if (fin > 0) { g.save(); g.globalAlpha = fin; g.textAlign = 'center'; g.shadowColor = ORO; g.shadowBlur = 40; g.fillStyle = '#ffe1a8';
    g.font = '900 120px "Helvetica Neue", Helvetica'; g.translate(540, 1320); const e = .85 + .15 * M.rebote(fin); g.scale(e, e); g.fillText('CHORIZO', 0, 0); g.fillText('PORTUANO', 0, 130);
    g.shadowBlur = 0; g.fillStyle = C.gris; g.font = '600 30px "Helvetica Neue", Helvetica'; g.letterSpacing = '8px'; g.fillText('LOMAS TURBAS', 0, 200); g.restore(); }
  vineta(g);
}

window.VIDEO = {
  transicion: 'zoom',
  escenas: [
    { desde: 1, en: 0, dibuja: escenaGancho, foco: [400, 1000] },
    { desde: 3, dibuja: escenaReceta, foco: [540, 900] },
    { desde: 5, dibuja: escenaCartel, foco: [540, 900] },
    { desde: 6, dibuja: escenaCola, foco: [540, 1000] },
    { desde: 9, dibuja: escenaPremio, foco: [540, 760] },
    { desde: 11, dibuja: escenaGiro, foco: [540, 760] },
    { desde: 12, dibuja: escenaRemate },
  ],
  sonidos: [
    ...[0, 22, 44, 66, 88].map(en => ({ en, archivo: '../../audio/sfx/eleven/musica-chorizo.mp3', volumen: .08, dura: 22.2 })),
    ...[3, 5, 6, 9, 11, 12].map(n => ({ en: F(n).en - .45, archivo: '../../audio/sfx/eleven/transicion.mp3', volumen: .35 })),
    { en: W(1, 'elver'), archivo: '../../audio/sfx/eleven/aparece.mp3', volumen: .3 },
    { en: W(1, 'chorizo'), archivo: '../../audio/sfx/eleven/brillo.mp3', volumen: .3 },
    { en: W(2, 'agota'), archivo: '../../audio/sfx/eleven/tic.mp3', volumen: .3 },
    { en: W(2, 'dias') + .5, archivo: '../../audio/sfx/eleven/sello.mp3', volumen: .3 },
    { en: W(2, 'nadie'), archivo: '../../audio/sfx/eleven/shh.mp3', volumen: .35 },
    { en: W(2, 'precio') + .4, archivo: '../../audio/sfx/eleven/pop.mp3', volumen: .3 },
    { en: W(2, 'colesterol') + .6, archivo: '../../audio/sfx/eleven/pop.mp3', volumen: .3 },
    { en: W(3, 'llego') - .4, archivo: '../../audio/sfx/eleven/campanilla.mp3', volumen: .4 },
    { en: W(3, 'chorizo'), archivo: '../../audio/sfx/eleven/brillo.mp3', volumen: .25 },
    { en: W(4, 'congelado'), archivo: '../../audio/sfx/eleven/congelado.mp3', volumen: .45 },
    { en: W(4, 'portuano', 1) - .1, archivo: '../../audio/sfx/eleven/zoom.mp3', volumen: .4 },
    { en: W(4, 'bueno'), archivo: '../../audio/sfx/eleven/brillo.mp3', volumen: .3 },
    { en: W(5, 'cartel') - .2, archivo: '../../audio/sfx/eleven/aparece.mp3', volumen: .3 },
    { en: W(5, 'chorizo') - .1, archivo: '../../audio/sfx/eleven/tiza.mp3', volumen: .35 },
    { en: W(5, 'confesarse'), archivo: '../../audio/sfx/campana.mp3', volumen: .25, dura: 2.5 },
    { en: W(6, 'rosa'), archivo: '../../audio/sfx/eleven/aparece.mp3', volumen: .3 },
    { en: W(6, 'navidad') - .4, archivo: '../../audio/sfx/eleven/tic.mp3', volumen: .3 },
    { en: W(7, '200') - .2, archivo: '../../audio/sfx/eleven/bascula.mp3', volumen: .35 },
    { en: W(7, 'silencio'), archivo: '../../audio/sfx/eleven/congelado.mp3', volumen: .25 },
    { en: W(8, 'deborameltrozo'), archivo: '../../audio/sfx/eleven/aparece.mp3', volumen: .3 },
    { en: W(8, 'atraganto'), archivo: '../../audio/sfx/asfixia.mp3', volumen: .25, dura: 1.2 },
    { en: W(8, 'salvo') + .55, archivo: '../../audio/sfx/eleven/pop.mp3', volumen: .4 },
    { en: W(8, 'util'), archivo: '../../audio/sfx/eleven/tic.mp3', volumen: .35 },
    { en: W(9, 'embutido'), archivo: '../../audio/sfx/eleven/brillo.mp3', volumen: .3 },
    ...['elver', 'benito', 'rosa', 'deborameltrozo'].map(p => ({ en: W(9, p) - .1, archivo: '../../audio/sfx/eleven/pop.mp3', volumen: .3 })),
    { en: W(10, 'chorizo') - .05, archivo: '../../audio/sfx/eleven/coro.mp3', volumen: .4 },
    { en: W(10, 'chorizo') + .2, archivo: '../../audio/sfx/ovacion.mp3', volumen: .2, dura: 2 },
    { en: W(11, 'sabor') - .2, archivo: '../../audio/sfx/eleven/aparece.mp3', volumen: .3 },
    { en: W(11, 'alta'), archivo: '../../audio/sfx/eleven/sello.mp3', volumen: .3 },
    { en: W(12, 'mandaselo') - .3, archivo: '../../audio/sfx/eleven/aparece.mp3', volumen: .3 },
    ...['abuela', 'hermana', 'amigo'].map(p => ({ en: W(12, p), archivo: '../../audio/sfx/eleven/pop.mp3', volumen: .3 })),
    { en: W(12, 'todos'), archivo: '../../audio/sfx/eleven/brillo.mp3', volumen: .3 },
    { en: W(12, 'llegue'), archivo: '../../audio/sfx/eleven/enviar.mp3', volumen: .4 },
  ],
};
