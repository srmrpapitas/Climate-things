// Prueba de 3,5 s del final del paralepípedo, montada como el golpe de One Punch Man (GUIA.md §6.1): pocos dibujos de verdad
// (clips de Veo + 3 dibujos de Nano Banana) y todo lo demás por código en cada fotograma: estroboscopio, smear, parada en seco,
// destello y negativos, onda, viento que alterna dos dibujos y plano general que se aleja (el «…pípedo» final se quitó: no le gustó).
// El puño NO toca al niño (los generadores lo bloquean y no se esquiva): se para a un dedo de su cara y la onda arrasa lo de detrás.
M.FPS = 60;
const { k, e, eo, cl, az } = M;
const RCL = '../../referencias/paralepipedo/clave', RSEC = '../../referencias/paralepipedo/sec';
const abre = src => new Promise(r => { const i = new Image(); i.onload = i.onerror = () => r(i); i.src = src; });
const IMG = {}, SEC = { k: 16, cadenas: {}, planos: {} };
const fotos = (d, n) => Promise.all([...Array(n).keys()].map(i => abre(`${RSEC}/${d}/${String(i).padStart(3, '0')}.jpg`)));
const prepara = Promise.all([...['viento-a', 'viento-b', 'barrido-padre-b', 'ojos-b', 'pupila-a', 'pupila-b', 'cierra-a', 'cierra-b', 'nino'].map(async n => IMG[n] = await abre(`${RCL}/${n}.png`)),
  fetch(`${RSEC}/indice.json`).then(r => r.json()).then(ix => (SEC.k = ix.k, Promise.all([
    (async () => SEC.cadenas.nino = await fotos('nino', ix.cadenas.nino))(),
    ...['carga', 'puno'].map(async p => SEC.planos[p] = { desde: ix.planos[p].desde, fotos: await fotos(p, ix.planos[p].n) })])))]);

// ---------- dibujar ----------
function cubre(g, im, z = 1, fx = .5, fy = .5) {                    // la imagen cubre la pantalla; z acerca hacia (fx, fy)
  const s = Math.max(M.W / im.width, M.H / im.height) * z, w = im.width * s, h = im.height * s;
  g.drawImage(im, (M.W - w / z) / 2 + fx * (w / z - w), (M.H - h / z) / 2 + fy * (h / z - h), w, h);
}
const veo = (p, tv) => { const c = SEC.planos[p]; return c.fotos[Math.max(0, Math.min(c.fotos.length - 1, Math.round((tv - c.desde) * 60)))]; };
const tiembla = (g, f, a) => { if (a > 0) g.translate((az(f * 3.1) - .5) * 2 * a, (az(f * 7.7) - .5) * 2 * a); };   // cada fotograma a un sitio distinto

// ---------- efectos (cambian en cada fotograma) ----------
function quema(g, a, f) {                                           // sobreexposición blanca y magenta con jirones de luz que cruzan
  if (a <= 0) return; g.save(); g.globalCompositeOperation = 'screen';
  g.fillStyle = `rgba(255,235,250,${.85 * a})`; g.fillRect(0, 0, M.W, M.H);
  g.globalAlpha = a; g.lineCap = 'round';
  for (let i = 0; i < 7; i++) {
    const y = (az(i * 5 + f) * 1.4 - .2) * M.H, x0 = -300 + az(i * 9 + f) * 400, gr = 60 + 160 * az(i * 2 + f);
    g.strokeStyle = i % 2 ? '#ffffff' : '#ff6fd0'; g.lineWidth = gr;
    g.beginPath(); g.moveTo(x0, y); g.bezierCurveTo(400, y - 300 * (az(i + f) - .5), 800, y + 260, 1500, y - 200); g.stroke();
  }
  g.restore();
}
function lineas(g, cx, cy, n, f, col = 'rgba(255,255,255,.85)', r0 = 300) {   // líneas de velocidad radiales, nuevas en cada fotograma
  g.save(); g.fillStyle = col;
  for (let i = 0; i < n; i++) { const a = az(i * 3.1 + f) * 6.283, r = r0 + az(i * 7.7 + f) * 300, w = (.2 + az(i * 1.3 + f)) * .012;
    g.beginPath(); g.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); g.lineTo(cx + Math.cos(a - w) * 2600, cy + Math.sin(a - w) * 2600);
    g.lineTo(cx + Math.cos(a + w) * 2600, cy + Math.sin(a + w) * 2600); g.fill(); }
  g.restore();
}
function viento(g, f, a = 1) {                                      // el viento de la onda: rayas blancas y polvo que cruzan de izquierda a derecha
  g.save(); g.lineCap = 'round';
  for (let i = 0; i < 40; i++) { const y = az(i * 4.1) * M.H, v = 2600 + 2200 * az(i * 2.3), x = ((az(i * 6.7) * 3000 + f / 60 * v) % 3200) - 1000, l = 200 + 500 * az(i * 1.9);
    g.strokeStyle = `rgba(255,255,255,${(.35 + .5 * az(i * 8.3)) * a})`; g.lineWidth = 3 + 10 * az(i * 5.5);
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + l, y + (az(i) - .5) * 40); g.stroke(); }
  for (let i = 0; i < 70; i++) { const v = 1800 + 2400 * az(i * 3.7), x = ((az(i * 9.1) * 2500 + f / 60 * v) % 2400) - 600, y = az(i * 2.9) * M.H + Math.sin(f * .2 + i) * 20;
    g.fillStyle = i % 3 ? `rgba(240,220,190,${.8 * a})` : `rgba(255,140,220,${.8 * a})`; g.fillRect(x, y, 4 + 8 * az(i), 3 + 5 * az(i + 1)); }
  g.restore();
}
function ondas(g, cx, cy, d) {                                      // anillos de la onda expansiva
  g.save(); for (let j = 0; j < 4; j++) { const u = d - j * .05, r = u * 3200; if (r <= 0) continue; const a = cl(1 - u / .45); if (a <= 0) continue;
    g.lineWidth = 60 * a + 4; g.strokeStyle = `rgba(255,255,255,${.9 * a})`; g.beginPath(); g.ellipse(cx, cy, r, r * .85, -.2, 0, 6.29); g.stroke();
    g.lineWidth = 14 * a; g.strokeStyle = `rgba(255,80,200,${.7 * a})`; g.beginPath(); g.ellipse(cx, cy, r * .95, r * .8, -.2, 0, 6.29); g.stroke(); }
  g.restore();
}
// escombros con física: salen disparados de las paredes del túnel hacia fuera y arriba, caen con gravedad, giran, rebotan una vez
// en el suelo (levantan polvo) y se quedan. u = segundos desde que sale cada trozo.
const G = 3400;
function trozo(i, u) {
  const lado = i % 2 ? -1 : 1, x0 = 540 + lado * (50 + 230 * az(i * 2.1)), y0 = 480 + 420 * az(i * 3.7);
  const vx = lado * (250 + (lado > 0 ? 450 : 950) * az(i * 4.3)), vy = -(400 + 1400 * az(i * 5.1)), suelo = 1180 + 170 * az(i * 6.2);
  const tb = (-vy + Math.sqrt(vy * vy + 2 * G * (suelo - y0))) / G, giro = lado * (5 + 9 * az(i * 7.3));
  if (u < tb) return { x: x0 + vx * u, y: y0 + vy * u + G * u * u / 2, rot: giro * u, tb, suelo, cae: true };
  const v = u - tb, vb = -(vy + G * tb) * .32;                     // rebote: pierde dos tercios de la velocidad y frena al rodar
  return { x: x0 + vx * tb + vx * .35 * Math.min(v, .25), y: Math.min(suelo, suelo + vb * v + G * v * v / 2), rot: giro * tb + giro * .3 * Math.min(v, .25), tb, suelo, cae: false };
}
function pinta(g, i, p, s, a = 1) {                                 // teja, libro o cascote con dos tonos (sombreado de anime) y contorno
  g.save(); g.globalAlpha = a; g.translate(p.x, p.y); g.rotate(p.rot); g.lineWidth = 3; g.strokeStyle = '#140c08';
  const tipo = i % 6, [luz, sombra] = tipo === 0 ? ['#a85a40', '#6a3324'] : tipo === 1 ? ['#5e6a78', '#363f4c'] : tipo === 2 ? ['#cdbf9c', '#8e8064'] : ['#7c6a5c', '#47392f'];
  g.beginPath(); if (tipo < 2) g.rect(-s, -s * .55, s * 2, s * 1.1); else { g.moveTo(-s, -s * .4); g.lineTo(s * .2, -s); g.lineTo(s, s * .3); g.lineTo(-s * .3, s * .8); g.closePath(); }
  g.fillStyle = luz; g.fill(); g.save(); g.clip(); g.fillStyle = sombra; g.fillRect(-s * 1.2, 0, s * 2.4, s * 1.2); g.restore(); g.stroke(); g.restore();
}
function escombros(g, f, t) {
  for (let i = 0; i < 70; i++) {
    const u = t - az(i * 1.3) * .3; if (u <= 0) continue;
    const p = trozo(i, u), s = (6 + 20 * az(i * 5.9)) * (1 + Math.min(u, .8) * .4);
    if (p.cae) for (let j = 3; j > 0; j--) if (u - j / 120 > 0) pinta(g, i, trozo(i, u - j / 120), s, .18);   // estela de los que van rápido
    pinta(g, i, p, s);
    const d = u - p.tb; if (d > 0 && d < .35) {                     // polvo al tocar el suelo
      const a = 1 - d / .35; g.save(); g.globalAlpha = .55 * a; g.fillStyle = '#e8d6b4';
      for (let j = 0; j < 5; j++) { g.beginPath(); g.ellipse(p.x + (j - 2) * s * .7 * (1 + d * 3), p.suelo + 4 - d * 40 * az(i + j), s * (.5 + d * 2.5), s * (.3 + d * 1.2), 0, 0, 6.29); g.fill(); }
      g.restore();
    }
  }
}
// ---------- el dibujo se mueve: se corta en celdas y cada una se desplaza con un campo de ruido que fluye (humo que hierve, pelo y ropa al viento) ----------
const LAM = {};
function lamina(n) { if (!LAM[n]) { const c = document.createElement('canvas'); c.width = M.W; c.height = M.H; cubre(c.getContext('2d'), IMG[n]); LAM[n] = c; } return LAM[n]; }
const ss = (a, b, x) => { const u = cl((x - a) / (b - a)); return u * u * (3 - 2 * u); };
const elipse = (x, y, cx, cy, rx, ry, bl = .35) => 1 - ss(1 - bl, 1, Math.hypot((x - cx) / rx, (y - cy) / ry));
function fluye(g, c, campo, x0 = 0, y0 = 0, x1 = M.W, y1 = M.H, L = 20) {
  for (let y = y0; y < y1; y += L) for (let x = x0; x < x1; x += L) {
    const [dx, dy] = campo(x + L / 2, y + L / 2), sx = Math.max(0, Math.min(M.W - L - 2, x - dx)), sy = Math.max(0, Math.min(M.H - L - 2, y - dy));
    g.drawImage(c, sx, sy, L + 2, L + 2, x - 1, y - 1, L + 2, L + 2);
  }
}
// humo de anime: bolas en dos tonos (luz arriba, sombra abajo) que salen de las paredes del túnel, crecen, suben y se abren
function humo(g, t, a = 1) {
  for (let i = 0; i < 34; i++) {
    const per = 1.7 + .8 * az(i * 1.7), u = ((t + az(i * 2.3) * per) % per) / per, lado = i % 2 ? -1 : 1;
    const x = 540 + lado * (90 + 260 * az(i * 3.1) + 260 * u), y = (lado > 0 ? 560 + 150 * az(i * 4.4) : 640 + 430 * az(i * 4.4)) - 160 * u * (.5 + az(i * 5.2));
    let r = (50 + 70 * az(i * 6.6)) * (.6 + 1.6 * u); if (lado > 0) r = Math.min(r, 140); const ax = Math.max(Math.abs(x - 540), y > 860 ? 125 + r * .9 : 0); const al = a * Math.min(1, u * 5) * (1 - u) * .8; if (al <= 0) continue;
    const X = 540 + lado * ax; g.save(); g.globalAlpha = al; g.beginPath();
    for (let j = 0; j < 5; j++) { const q = j / 5 * 6.283 + t * .8 * lado; g.moveTo(X + Math.cos(q) * r * .55 + r * .5, y + Math.sin(q) * r * .4); g.arc(X + Math.cos(q) * r * .55, y + Math.sin(q) * r * .4, r * .5, 0, 6.283); }
    g.fillStyle = '#efe2c8'; g.fill(); g.save(); g.clip(); g.fillStyle = '#b8a283'; g.beginPath(); g.ellipse(X + r * .15, y + r * .55, r * 1.1, r * .55, 0, 0, 6.283); g.fill(); g.restore();
    g.restore();
  }
}
// brasas que suben parpadeando, hojas de los libros que bajan dando vueltas, vapor del puño, rayos de luz que laten desde el horizonte
function brasas(g, t, f, a = 1) {
  g.save(); g.globalCompositeOperation = 'screen';
  for (let i = 0; i < 46; i++) { const per = 1.4 + az(i * 2.2), u = ((t + az(i) * per) % per) / per;
    const x = 540 + (az(i * 3.3) - .5) * 900 + Math.sin(u * 9 + i) * 30, y = 1100 - 700 * u * (.5 + az(i * 4.1)), r = 2 + 5 * az(i * 5.7);
    g.globalAlpha = a * (1 - u) * (az(i + f) > .2 ? 1 : .2); g.fillStyle = i % 3 ? '#ffb347' : '#ff6fd0';
    g.beginPath(); g.arc(x, y, r, 0, 6.283); g.fill(); g.globalAlpha *= .3; g.beginPath(); g.arc(x, y, r * 3.5, 0, 6.283); g.fill(); }
  g.restore();
}
function papeles(g, t) {
  for (let i = 0; i < 12; i++) { const u = t - .25 - az(i * 2.7) * .9; if (u < 0) continue;
    const x = 540 + (az(i * 1.9) - .5) * 1000 + Math.sin(u * 3 + i) * 90 + 40 * u, y = 250 + 300 * az(i * 3.4) + 260 * u, ang = Math.sin(u * 4 + i) * .9, giro = Math.cos(u * 7 + i * 2);
    if (y > 1250) continue;
    g.save(); g.translate(x, y); g.rotate(ang); g.scale(giro, 1); g.fillStyle = Math.abs(giro) > .3 ? '#f4ecd8' : '#cfc3a6'; g.strokeStyle = '#2a2018'; g.lineWidth = 2;
    g.fillRect(-18, -24, 36, 48); g.strokeRect(-18, -24, 36, 48); g.fillStyle = '#9a8e78'; for (let j = 0; j < 4; j++) g.fillRect(-12, -15 + j * 9, 24, 2); g.restore(); }
}
function vapor(g, t, cx, cy, a = 1) {
  g.save(); g.lineCap = 'round';
  for (let i = 0; i < 7; i++) { const u = ((t * .8 + i / 7) % 1); g.strokeStyle = `rgba(255,255,255,${.45 * a * Math.sin(u * Math.PI)})`; g.lineWidth = 10 + 18 * u;
    const x = cx + (i - 3) * 16, y = cy - 220 * u; g.beginPath(); g.moveTo(x, y);
    g.bezierCurveTo(x + 30 * Math.sin(t * 5 + i), y - 40, x - 30 * Math.sin(t * 4 + i), y - 80, x + 20 * Math.sin(t * 6 + i), y - 120); g.stroke(); }
  g.restore();
}
function rayos(g, t, cx, cy, a = 1) {
  g.save(); g.globalCompositeOperation = 'screen';
  for (let i = 0; i < 14; i++) { const q = -Math.PI / 2 + (i - 6.5) * .2 + Math.sin(t * .7 + i) * .04, w = .03 + .03 * az(i * 2.1);
    g.fillStyle = `rgba(255,230,170,${a * (.08 + .1 * (.5 + .5 * Math.sin(t * 6 + i * 1.7)))})`;
    g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(q - w) * 1600, cy + Math.sin(q - w) * 1600); g.lineTo(cx + Math.cos(q + w) * 1600, cy + Math.sin(q + w) * 1600); g.fill(); }
  const r = g.createRadialGradient(cx, cy, 10, cx, cy, 380); r.addColorStop(0, `rgba(255,240,200,${.55 * a * (.8 + .2 * Math.sin(t * 9))})`); r.addColorStop(1, 'rgba(255,200,150,0)');
  g.fillStyle = r; g.fillRect(cx - 400, cy - 400, 800, 800); g.restore();
}
function polvoSuelo(g, t, a = 1) {                                   // polvo que rueda por el suelo hacia los lados
  g.save(); for (let i = 0; i < 16; i++) { const u = ((t * .5 + az(i * 3.9)) % 1), lado = i % 2 ? -1 : 1;
    const x = 540 + lado * (60 + 520 * u), y = 1150 + 110 * az(i * 2.6) + 20 * u, r = 40 + 120 * u;
    g.globalAlpha = a * .35 * Math.sin(u * Math.PI); g.fillStyle = '#e6d3b0'; g.beginPath(); g.ellipse(x, y, r * 1.6, r * .45, 0, 0, 6.283); g.fill(); }
  g.restore();
}

// lo que está delante en el plano general (brazo y espalda del padre, sofá, niño): los efectos van por detrás, se recortan con su silueta
const lienzoFx = document.createElement('canvas'), cfx = lienzoFx.getContext('2d');
function delante(g) {
  g.beginPath(); [[654, 900], [690, 862], [800, 858], [882, 890], [990, 1090], [1080, 1200], [1080, 1920], [0, 1920], [0, 1581], [700, 1560], [805, 1300], [792, 1120], [705, 1035], [650, 990]]
    .forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.fill();
  g.beginPath(); g.ellipse(534, 1440, 140, 160, 0, 0, 6.283); g.fill(); g.fillRect(0, 990, 302, 550);
  g.beginPath(); g.ellipse(545, 965, 80, 58, 0, 0, 6.283); g.fill(); g.beginPath(); g.ellipse(542, 1150, 90, 140, 0, 0, 6.283); g.fill();
}
function detras(g, pinta) {                                          // pinta los efectos en una capa aparte con la transformación actual y les quita lo de delante
  const c = g.canvas; if (lienzoFx.width !== c.width) { lienzoFx.width = c.width; lienzoFx.height = c.height; }
  cfx.setTransform(1, 0, 0, 1, 0, 0); cfx.clearRect(0, 0, c.width, c.height); cfx.setTransform(g.getTransform());
  pinta(cfx); cfx.globalCompositeOperation = 'destination-out'; cfx.fillStyle = '#000'; delante(cfx); cfx.globalCompositeOperation = 'source-over';
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(lienzoFx, 0, 0); g.restore();
}

const lienzoNeg = document.createElement('canvas'), cc = lienzoNeg.getContext('2d');
function negativo(g) {                                               // fotograma de impacto: blanco y negro duro e invertido
  const c = g.canvas; if (lienzoNeg.width !== c.width) { lienzoNeg.width = c.width; lienzoNeg.height = c.height; }
  cc.clearRect(0, 0, c.width, c.height); cc.drawImage(c, 0, 0);
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.filter = 'grayscale(1) contrast(9) invert(1)'; g.drawImage(lienzoNeg, 0, 0); g.filter = 'none'; g.restore();
}
function smear(g, im, f) {                                          // fotograma arrastrado: la misma imagen estirada hacia cámara varias veces
  g.save(); for (let i = 0; i < 9; i++) { g.globalAlpha = .2; cubre(g, im, 1 + i * .09 + az(f) * .03, .5, .55); } g.restore();
  g.save(); g.globalCompositeOperation = 'screen'; g.fillStyle = 'rgba(255,60,170,.35)'; g.fillRect(0, 0, M.W, M.H); g.restore();
}
const vineta = (g, a, col = '0,0,0') => { const r = g.createRadialGradient(540, 960, 380, 540, 960, 1250); r.addColorStop(0, `rgba(${col},0)`); r.addColorStop(1, `rgba(${col},${a})`); g.fillStyle = r; g.fillRect(0, 0, M.W, M.H); };

// ---------- planos ----------
const PARA = 1.1;                                                   // el puño se para en seco a un dedo de la cara del niño
const PLANOS = [[0, 'lanza'], [.78, 'smear'], [.86, 'para'], [1.32, 'sopla'], [2.15, 'barrido'], [3.75, 'ojos']];   // ojos dura 1,65 s
const DIBUJA = {
  lanza(g, t, tl, f) {                                              // el padre carga y lanza (Veo, antes de su explosión); a partir de 0,3 s la luz lo quema y solo asoma a ratos
    g.save(); tiembla(g, f, 3 + 8 * tl); cubre(g, veo('carga', 17.8 + t * 1.15), 1.02 + .08 * e(tl / .78)); g.restore();
    if (t > .3) quema(g, f % 6 < 2 ? .15 : .85, f);
    lineas(g, 540, 900, 50, f, 'rgba(255,255,255,.5)', 500);
  },
  smear(g, t, tl, f) { smear(g, veo('puno', 20.12 + tl * 1.4), f); lineas(g, 540, 1000, 90, f, 'rgba(255,255,255,.8)', 200); },
  para(g, t, tl, f) {                                               // el puño llega a cámara y se para; destello, negativos, onda
    const tv = t < PARA ? 20.12 + (t - .86) / (PARA - .86) * .28 : 20.4, d = t - PARA;
    g.save(); tiembla(g, f, d > 0 ? 30 * (1 - k(t, PARA, .25)) + 6 : 4); cubre(g, veo('puno', tv), 1.02 + (d > 0 ? .05 * eo(k(d, 0, .2)) : 0)); g.restore();
    if (d > 0) { lineas(g, 540, 1000, 110, f, 'rgba(255,255,255,.85)', 260); ondas(g, 540, 1000, d); }
    const i = Math.floor(d * 60);
    if (i >= 0 && i < 2) { g.fillStyle = '#fff'; g.fillRect(0, 0, M.W, M.H); } else if (i >= 2 && i < 4) negativo(g); else if (i >= 4 && i < 5) { g.fillStyle = '#fff'; g.fillRect(0, 0, M.W, M.H); }
    vineta(g, .45, '60,0,50');
  },
  sopla(g, t, tl, f) {                                              // la onda le pega al niño: dos dibujos que se alternan cada 3 fotogramas, temblor, rayas de viento
    g.save(); tiembla(g, f, 14 * (1 - k(tl, 0, .8)) + 4); cubre(g, IMG[Math.floor(f / 3) % 2 ? 'viento-b' : 'viento-a'], 1.04 + .06 * tl, .5, .4); g.restore();
    viento(g, f); g.save(); g.globalCompositeOperation = 'screen'; g.fillStyle = `rgba(255,70,190,${.12 + .1 * az(f)})`; g.fillRect(0, 0, M.W, M.H); g.restore();
    if (tl < .05) { g.fillStyle = 'rgba(255,255,255,.8)'; g.fillRect(0, 0, M.W, M.H); }
    vineta(g, .35);
  },
  barrido(g, t, tl, f) {                                            // plano general por detrás del padre: el niño intacto delante y, detrás de él, la casa partida;
    // nada se queda quieto: el humo hierve y se abre, al niño le azota el viento el pelo y la ropa y tiembla, la camisa del padre ondea
    const w = 1 - .6 * k(tl, .25, 1.4), sh = 1 - .5 * k(tl, .5, 1.5), c = lamina('barrido-padre-b');
    const campo = (x, y) => {
      const nino = elipse(x, y, 542, 1100, 125, 235), puno = Math.max(elipse(x, y, 770, 1000, 160, 190), elipse(x, y, 900, 1300, 200, 300));
      const m = (1 - ss(1040, 1150, y)) * (1 - nino) * (1 - puno) * (1 - (x < 300 && y > 980 ? 1 : 0));
      const vx = x - 540, vy = y - 560, r = Math.hypot(vx, vy) + 1, drift = 28 * tl * m, boil = 9 * m * (.6 + w);
      let dx = drift * vx / r + boil * Math.sin(.012 * y + .008 * x - 2.6 * tl), dy = drift * vy / r * .6 + boil * .8 * Math.cos(.01 * x - .009 * y - 2.2 * tl);
      const pelo = elipse(x, y, 545, 958, 84, 56, .5), ropa = elipse(x, y, 540, 1125, 82, 85), cuerpo = elipse(x, y, 542, 1100, 105, 210, .25);
      dx += pelo * w * 9 * Math.sin(.11 * y + .04 * x - 30 * tl) + ropa * w * 3 * Math.sin(.06 * y - 20 * tl) + cuerpo * sh * (az(f * 1.7) - .5) * 5;
      dy += pelo * w * (6 * Math.sin(.09 * x + .05 * y - 26 * tl) - 4) + cuerpo * sh * (az(f * 2.9) - .5) * 3;
      const camisa = ss(1340, 1460, y) * (1 - elipse(x, y, 540, 1480, 165, 225));
      dx += camisa * w * 3 * Math.sin(.025 * y + .02 * x - 14 * tl); dy += camisa * w * 2 * Math.cos(.03 * x - 12 * tl);
      return [dx, dy];
    };
    g.save(); tiembla(g, f, 5 * (1 - k(tl, 0, .5)) + 1); const z = 1.22 - .2 * eo(k(tl, 0, .7)) - .04 * k(tl, .7, 1.1);
    g.translate(540, 900); g.scale(z, z); g.translate(-540, -900);
    fluye(g, c, campo, 0, 0, M.W, M.H, 18); fluye(g, c, campo, 432, 900, 654, 1302, 6);
    rayos(g, tl, 540, 560, .5 + .5 * (1 - k(tl, 0, .4)));
    detras(g, q => { humo(q, tl, ss(0, .3, tl)); escombros(q, f, tl); papeles(q, tl); polvoSuelo(q, tl, ss(.2, .6, tl)); });
    vapor(g, tl, 770, 880, ss(.3, .8, tl));
    g.restore();
    brasas(g, tl, f, ss(.1, .4, tl)); viento(g, f, .45 * (1 - k(tl, .2, .4)) + .12 * w);
    if (tl < .04) { g.fillStyle = '#fff'; g.fillRect(0, 0, M.W, M.H); }
  },
  ojos(g, t, tl, f) {                                               // reacción del niño (como el primer plano de los ojos de OPM): un dibujo y todo lo demás se mueve
    // la cara cambia como en OPM: se encoge con los ojos cerrados (dos dibujos cada 2 fotogramas), los abre de golpe, las pupilas se le
    // encogen a puntos y el labio le tiembla (dos dibujos cada 3 fotogramas) hasta que se le saltan las lágrimas
    const cara = tl < .13 ? (Math.floor(f / 2) % 2 ? 'cierra-b' : 'cierra-a') : tl < .6 ? 'ojos-b' : tl < 1.05 ? (Math.floor(f / 3) % 2 ? 'pupila-b' : 'pupila-a') : 'pupila-b';
    const w = .75 - .25 * k(tl, .3, 1), c = lamina(cara);
    const campo = (x, y) => {
      const cara = elipse(x, y, 548, 1040, 250, 330, .3), pelo = elipse(x, y, 540, 540, 560, 360, .5) * (1 - cara), fondo = 1 - elipse(x, y, 548, 950, 430, 640, .3);
      const ropa = ss(1380, 1480, y) * (1 - cara), salta = Math.floor(f / 2);
      let dx = pelo * w * 11 * Math.sin(.05 * y + .03 * x - 24 * tl) + fondo * (9 * Math.sin(.011 * y + .008 * x - 2.4 * tl) + 30 * tl) + ropa * w * 5 * Math.sin(.03 * y + .01 * x - 16 * tl);
      let dy = pelo * w * (7 * Math.sin(.045 * x - 20 * tl) - 3) + fondo * 7 * Math.cos(.01 * x - .009 * y - 2 * tl) + ropa * w * 3 * Math.cos(.02 * x - 13 * tl);
      for (const [ex, ey] of [[397, 923], [686, 920]]) { const m = elipse(x, y, ex, ey, 46, 46, .4); dx += m * (az(salta * 1.3) - .5) * 9; dy += m * (az(salta * 2.7) - .5) * 7; }   // pupilas que tiemblan
      return [dx, dy];
    };
    g.save(); tiembla(g, f, 6 * (1 - k(tl, 0, .3)) + 1.5); const z = 1 + .12 * e(k(tl, 0, .6)) + (tl >= .6 ? .06 + .1 * e(k(tl, .6, 1.05)) : 0);   // al encogerse las pupilas, un empujón de cámara
    g.translate(542, 925); g.scale(z, z); g.translate(-542, -925);
    fluye(g, c, campo, 0, 0, M.W, M.H, 14); fluye(g, c, campo, 330, 860, 760, 990, 5);
    // una gota de sudor que nace en la sien y baja por la mejilla hasta la mandíbula, a tirones (se para y vuelve a correr), dejando un rastro mojado
    const gota = u => { const v = 1 - u; return [v * v * 808 + 2 * v * u * 800 + u * u * 735, v * v * 965 + 2 * v * u * 1120 + u * u * 1262]; };
    const r = k(tl, .3, 1), u = cl(r * .55 + .45 * (r - Math.sin(r * 6 * Math.PI) / (6 * Math.PI)));   // a tirones
    if (tl > .25) {
      g.lineCap = 'round'; g.strokeStyle = 'rgba(255,255,255,.45)'; g.lineWidth = 6; g.beginPath();
      for (let j = 0; j <= 20; j++) { const [x, y] = gota(u * j / 20); j ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
      const [gx, gy] = gota(u), cr = 1 + .25 * Math.min(1, (tl - .25) * 5);
      g.save(); g.translate(gx, gy); g.scale(cr * .9, cr); g.fillStyle = 'rgba(225,245,255,.92)'; g.strokeStyle = '#2a2018'; g.lineWidth = 3;
      g.beginPath(); g.moveTo(0, -30); g.quadraticCurveTo(16, 0, 0, 14); g.quadraticCurveTo(-16, 0, 0, -30); g.fill(); g.stroke();
      g.fillStyle = '#fff'; g.beginPath(); g.arc(-4, 0, 4, 0, 6.283); g.fill(); g.restore();
    }
    g.restore();
    viento(g, f, .3 * w); brasas(g, tl + 2, f, .6);
    const ch = tl < .12 ? 1 - tl / .12 : tl >= .6 && tl < .7 ? 1 - (tl - .6) / .1 : 0;
    if (ch > 0) { g.save(); g.globalCompositeOperation = 'screen'; g.fillStyle = `rgba(255,70,190,${.5 * ch})`; g.fillRect(0, 0, M.W, M.H); g.restore(); }
    vineta(g, .4);
  },
  nino(g, t, tl, f) {                                               // silencio... y el niño, tan tranquilo: «…pípedo»
    const u = k(t, 2.95, .45), x = u > 0 && u < 1 ? Math.abs(Math.sin(Math.PI * 3 * u)) * .9 : 0;   // pí-pe-do: abre y cierra tres veces
    const c = SEC.cadenas.nino, im = c ? c[Math.round(x * SEC.k)] : IMG.nino;
    cubre(g, im, 1.12 + .06 * tl, .45, .38); vineta(g, .3);
  },
};
window.VIDEO = {
  dura: 5.4, prepara,
  sonidos: [[0, 'cargar', .18, .8], [.72, 'latigazo', .3], [PARA - .02, 'impacto-anime', .38], [PARA, 'onda', .35], [PARA + .05, 'pitido', .05, .6],
    [1.32, 'transicion', .3, .9], [2.15, 'escombros', .28, 1.6], [2.2, 'transicion', .12, 1.4], [3.75, 'pitido', .05, 1.65], [3.75, 'transicion', .12, 1.65], [4.35, 'zoom', .15, .6]]
    .map(([en, f, volumen, dura]) => ({ en, archivo: `../../audio/sfx/eleven/${f}.mp3`, volumen, dura })),
  escenas: [{ en: 0, dibuja(g, t) {
    const i = PLANOS.findLastIndex(p => t >= p[0]), [t0, n] = PLANOS[Math.max(0, i)], f = Math.round(t * 60);
    g.fillStyle = '#000'; g.fillRect(0, 0, M.W, M.H); g.save(); DIBUJA[n](g, t, t - t0, f); g.restore();
  } }],
};
