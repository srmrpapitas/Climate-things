// Motor de los vídeos explicados en vertical (1080×1920, 30 fps): cada palabra tiene su imagen.
// Estilo del ejemplo del usuario: fondo azul noche, formas limpias con luz dorada, etiquetas con línea guía
// y subtítulos palabra a palabra con la clave en un recuadro de selección.
const M = window.M = {};
M.W = 1080; M.H = 1920; M.FPS = 30;
M.cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
M.k = (t, a, d = .35) => M.cl((t - a) / d);                      // 0→1 desde el segundo a, en d segundos
M.e = u => u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;  // entra y sale suave
M.eo = u => 1 - Math.pow(1 - u, 3);                                // sale disparado y frena
M.rebote = u => { const c = 1.9; return u <= 0 ? 0 : 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2); };
M.mez = (a, b, u) => a + (b - a) * u;
M.az = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
M.C = { fondo: '#0d121b', fondo2: '#05070b', oro: '#ffcf6e', oro2: '#ffb347', azul: '#4d8dff', rojo: '#ff4a3d', blanco: '#f4f6fa', gris: '#8a93a6',
        claude: '#e07a52', chatgpt: '#19c39b', grok: '#d9dde6', gemini: '#6f8cff' };

// ---------- tiempos de la voz ----------
const norma = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\p{L}\p{N}%,]/gu, '').replace(/,$/, '');
M.F = n => TIEMPOS.frases[n - 1];                                   // frase n (desde 1): {en, dura, palabras}
M.fin = n => M.F(n).en + M.F(n).dura;
// instante en que suena una palabra de la frase n («#2» detrás = la segunda vez); para fallar pronto si se cambia el guion
M.w = (n, palabra, cual = 1) => {
  const p = M.F(n).palabras.filter(p => norma(p[0]) === norma(palabra))[cual - 1];
  if (!p) throw new Error(`Palabra «${palabra}» no está en la frase ${n}`); return p[1];
};

// ---------- cámara y perspectiva isométrica ----------
// mundo: x hacia la derecha-abajo, y hacia la izquierda-abajo, z hacia arriba (en píxeles de mundo)
M.iso = (x, y, z = 0) => [(x - y) * .866, (x + y) * .5 - z];
M.cam = (g, cx, cy, z) => { g.translate(M.W / 2, M.H * .56); g.scale(z, z); g.translate(-cx, -cy); };
const cara = (g, pts, color) => { g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(...p) : g.moveTo(...p)); g.closePath(); g.fillStyle = color; g.fill(); };
// caja isométrica: tejado claro, cara izquierda media, cara derecha oscura; con `ventanas` dibuja luces que se encienden con `luz` (0–1 o función)
M.caja = (g, x, y, w, d, h, o = {}) => {
  const P = (a, b, c) => M.iso(x + a, y + b, c), tono = o.tono || ['#3b4354', '#272d3a', '#1b2029'];
  cara(g, [P(0, d, 0), P(w, d, 0), P(w, d, h), P(0, d, h)], tono[1]);
  cara(g, [P(w, 0, 0), P(w, d, 0), P(w, d, h), P(w, 0, h)], tono[2]);
  cara(g, [P(0, 0, h), P(w, 0, h), P(w, d, h), P(0, d, h)], tono[0]);
  g.strokeStyle = 'rgba(255,255,255,.07)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(...P(0, d, h)); g.lineTo(...P(w, d, h)); g.lineTo(...P(w, 0, h)); g.stroke();
  if (o.ventanas && h > 30) {
    const filas = Math.floor((h - 14) / 26);
    for (const [lado, largo] of [[0, w], [1, d]]) {
      const cols = Math.max(1, Math.floor((largo - 10) / 22));
      for (let f = 0; f < filas; f++) for (let c = 0; c < cols; c++) {
        const s = o.semilla * 31 + lado * 997 + f * 13 + c, enc = typeof o.luz === 'function' ? o.luz(s) : (o.luz ?? 1);
        if (M.az(s) < .3 || enc <= 0) continue;
        const a = 8 + c * (largo - 10) / cols, z0 = 12 + f * 26, q = lado ? [[w, a], [w, a + 10]] : [[a, d], [a + 10, d]];
        const pts = [[...q[0], z0], [...q[1], z0], [...q[1], z0 + 14], [...q[0], z0 + 14]].map(([u, v, zz]) => P(u, v, zz));
        g.globalAlpha = enc * (.55 + .45 * M.az(s + 5)); cara(g, pts, o.colorLuz || M.C.oro); g.globalAlpha = 1;
      }
    }
  }
};
// suelo: rejilla isométrica que se desvanece en los bordes
M.suelo = (g, cx, cy, r, a = 1, color = '120,140,180') => {
  for (let i = -r; i <= r; i += 60) for (const eje of [0, 1]) {
    const p0 = eje ? M.iso(cx + i, cy - r) : M.iso(cx - r, cy + i), p1 = eje ? M.iso(cx + i, cy + r) : M.iso(cx + r, cy + i);
    const gr = g.createLinearGradient(...p0, ...p1); const al = a * .16 * (1 - Math.abs(i) / r);
    gr.addColorStop(0, `rgba(${color},0)`); gr.addColorStop(.5, `rgba(${color},${al})`); gr.addColorStop(1, `rgba(${color},0)`);
    g.strokeStyle = gr; g.lineWidth = 1.5; g.beginPath(); g.moveTo(...p0); g.lineTo(...p1); g.stroke();
  }
};

// ---------- agente: cápsula con cabeza, luz de su color debajo y ojo que parpadea ----------
M.agente = (g, x, y, color, o = {}) => {
  const [sx, sy] = M.iso(x, y, 0), s = o.s ?? 1, salto = o.z || 0, t = o.t || 0, ph = o.fase || 0;
  if (s <= 0) return;
  g.save(); g.translate(sx, sy); g.scale(s, s);
  const halo = g.createRadialGradient(0, 0, 2, 0, 0, 46); halo.addColorStop(0, color + 'aa'); halo.addColorStop(1, color + '00');
  g.fillStyle = halo; g.save(); g.scale(1, .5); g.beginPath(); g.arc(0, 0, 46, 0, 6.29); g.fill(); g.restore();
  const bob = Math.sin(t * 3 + ph) * 2 - salto;
  g.translate(0, bob); g.rotate(o.ang || 0);
  const cuerpo = g.createLinearGradient(-14, 0, 14, 0); cuerpo.addColorStop(0, color); cuerpo.addColorStop(1, '#0d121b');
  g.fillStyle = cuerpo; g.beginPath(); g.roundRect(-14, -44, 28, 44, 14); g.fill();
  g.fillStyle = color; g.beginPath(); g.arc(0, -56, 12, 0, 6.29); g.fill();
  const parp = (t * .7 + ph) % 3 < .08 ? .15 : 1, mira = o.mira ?? 1;
  g.fillStyle = '#0d121b'; g.beginPath(); g.ellipse(4 * mira, -57, 2.4, 3.4 * parp, 0, 0, 6.29); g.fill();
  if (o.ojos) { g.fillStyle = o.ojos; g.beginPath(); g.ellipse(4 * mira, -57, 2.4, 3.4 * parp, 0, 0, 6.29); g.fill(); }
  if (o.modelo) { g.save(); g.translate(0, -24); g.scale(.85, .85); M.emblema(g, o.modelo, 9); g.restore(); }   // su logo en el pecho
  if (o.sueno) { g.fillStyle = 'rgba(230,240,255,.8)'; g.font = '700 18px Helvetica'; const u = (t * .6 + ph) % 1; g.globalAlpha = 1 - u; g.fillText('z', 14 + 10 * u, -72 - 30 * u); g.globalAlpha = 1; }
  g.restore();
};
// onda que se abre en el suelo (al aterrizar, al nombrar algo)
M.onda = (g, x, y, u, color = M.C.oro) => {
  if (u <= 0 || u >= 1) return; const [sx, sy] = M.iso(x, y);
  g.save(); g.strokeStyle = color; g.globalAlpha = 1 - u; g.lineWidth = 3; g.translate(sx, sy); g.scale(1, .5);
  g.beginPath(); g.arc(0, 0, 10 + 70 * M.eo(u), 0, 6.29); g.stroke(); g.restore();
};

// ---------- fuego y humo (luz que suma) ----------
M.fuego = (g, sx, sy, tam, t, sem) => {
  if (tam <= 0) return; g.save(); g.globalCompositeOperation = 'lighter';
  const gl = g.createRadialGradient(sx, sy - tam * .4, 0, sx, sy - tam * .4, tam * 2.2); gl.addColorStop(0, 'rgba(255,120,40,.45)'); gl.addColorStop(1, 'rgba(255,60,20,0)');
  g.fillStyle = gl; g.fillRect(sx - tam * 2.2, sy - tam * 2.6, tam * 4.4, tam * 4.4);
  for (let i = 0; i < 7; i++) {
    const u = (t * (1.6 + M.az(sem + i)) + M.az(sem + i * 3)) % 1, x = sx + (M.az(sem + i * 7) - .5) * tam * .9 + Math.sin(t * 7 + i) * tam * .08;
    const h = tam * (1.1 - u * .6) * (.7 + .5 * M.az(sem + i * 11)), y = sy - u * tam * .5, w = h * .42 * (1 - u * .5);
    g.fillStyle = `rgba(${255},${Math.round(150 + 90 * (1 - u))},${Math.round(40 + 60 * (1 - u))},${.55 * (1 - u)})`;
    g.beginPath(); g.moveTo(x - w, y); g.quadraticCurveTo(x - w * .9, y - h * .55, x + Math.sin(t * 9 + i) * w * .4, y - h);
    g.quadraticCurveTo(x + w * .9, y - h * .55, x + w, y); g.quadraticCurveTo(x, y + w * .5, x - w, y); g.fill();
  }
  g.restore();
};
M.humo = (g, sx, sy, tam, t, sem, a = 1) => {
  for (let i = 0; i < 6; i++) {
    const u = (t * .35 + M.az(sem + i * 5)) % 1, x = sx + (M.az(sem + i) - .3) * tam + u * tam * .8, y = sy - tam - u * tam * 3.2, r = tam * (.35 + u * .9);
    const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(30,32,40,${.55 * a * (1 - u)})`); gr.addColorStop(1, 'rgba(30,32,40,0)');
    g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r);
  }
};

// ---------- tarjetas, etiquetas y números ----------
// etiqueta con línea guía (como «CRISTAL», «CABLES»): del punto (px,py) al texto (tx,ty)
M.etiqueta = (g, px, py, tx, ty, texto, a = 1, color = 'rgba(244,246,250,.9)') => {
  if (a <= 0) return; g.save(); g.globalAlpha = a; g.strokeStyle = color; g.lineWidth = 2;
  const u = M.eo(a); g.beginPath(); g.moveTo(px, py); g.lineTo(M.mez(px, tx, u), M.mez(py, ty + 8, u)); g.stroke();
  g.fillStyle = color; g.beginPath(); g.arc(px, py, 4, 0, 6.29); g.fill();
  g.font = '700 30px "Helvetica Neue", Helvetica, Arial'; g.letterSpacing = '5px'; g.textAlign = tx < px ? 'right' : 'left';
  g.fillText(texto, tx + (tx < px ? -10 : 10), ty); g.restore();
};
// tarjeta de cristal oscuro con borde fino (fondo de los datos)
M.tarjeta = (g, x, y, w, h, a = 1, r = 28) => {
  g.save(); g.globalAlpha = a; g.fillStyle = 'rgba(20,26,38,.86)'; g.beginPath(); g.roundRect(x, y, w, h, r); g.fill();
  g.strokeStyle = 'rgba(255,255,255,.12)'; g.lineWidth = 2; g.stroke(); g.restore();
};
// recuadro de selección con tiradores en las esquinas (el de las palabras clave)
M.seleccion = (g, x, y, w, h, u, color = M.C.azul) => {
  if (u <= 0) return; const e = M.rebote(M.cl(u)), cx = x + w / 2, cy = y + h / 2; g.save();
  g.translate(cx, cy); g.scale(.85 + .15 * e, .85 + .15 * e); g.translate(-cx, -cy);
  g.globalAlpha = M.cl(u * 3); g.fillStyle = 'rgba(77,141,255,.16)'; g.fillRect(x, y, w, h);
  g.strokeStyle = color; g.lineWidth = 2.5; g.strokeRect(x, y, w, h);
  for (const [a, b] of [[x, y], [x + w, y], [x, y + h], [x + w, y + h]]) {
    g.fillStyle = '#0d121b'; g.beginPath(); g.arc(a, b, 6, 0, 6.29); g.fill(); g.strokeStyle = color; g.lineWidth = 2.5; g.stroke();
  }
  g.restore();
};

// ---------- subtítulos palabra a palabra ----------
// trozos de hasta 4 palabras (corta en la puntuación); las ya dichas en gris, la que suena en blanco y negrita, la clave con recuadro
const FUENTE = '"Helvetica Neue", Helvetica, Arial';
let TROZOS = null;
const trozos = () => {
  if (TROZOS) return TROZOS; TROZOS = [];
  for (const f of TIEMPOS.frases) {
    let tr = [];
    f.palabras.forEach((p, i) => {
      tr.push(p); const ultima = i === f.palabras.length - 1, letras = tr.reduce((s, q) => s + q[0].length + 1, 0);
      if (ultima || /[,.:;?!]$/.test(p[0]) || tr.length >= 4 || letras > 20) { TROZOS.push(tr); tr = []; }
    });
  }
  TROZOS.forEach((tr, i) => { tr.desde = tr[0][1] - .04; tr.hasta = i + 1 < TROZOS.length ? Math.min(TROZOS[i + 1][0][1] - .04, tr.at(-1)[2] + .9) : tr.at(-1)[2] + .9; });
  return TROZOS;
};
M.subtitulos = (g, t, y0 = 330) => {
  const tr = trozos().find(tr => t >= tr.desde && t < tr.hasta); if (!tr) return;
  g.save(); const T = 66; g.textBaseline = 'alphabetic';
  // reparto en líneas de ≤ 18 letras, con la posición fija (no salta al ir apareciendo)
  const lineas = [[]]; let n = 0;
  for (const p of tr) { if (n && n + p[0].length > 18) { lineas.push([]); n = 0; } lineas.at(-1).push(p); n += p[0].length + 1; }
  lineas.forEach((l, j) => {
    const anchos = l.map(p => { g.font = `700 ${T}px ${FUENTE}`; return g.measureText(p[0]).width; }), esp = T * .28;
    let x = M.W / 2 - (anchos.reduce((s, a) => s + a, 0) + esp * (l.length - 1)) / 2; const y = y0 + j * T * 1.18;
    l.forEach((p, i) => {
      const [txt, en, , clave] = p, dicha = t >= en, actual = dicha && (i === l.length - 1 ? true : t < l[i + 1][1]) && !(j < lineas.length - 1 && false);
      const ultimaDicha = dicha && !tr.some(q => q[1] > en && q[1] <= t);
      if (dicha) {
        const u = M.k(t, en, .12);
        if (clave) M.seleccion(g, x - 12, y - T * .82, anchos[i] + 24, T * 1.08, M.k(t, en, .18));
        g.globalAlpha = u; g.font = `700 ${T}px ${FUENTE}`;
        g.fillStyle = ultimaDicha || clave ? M.C.blanco : 'rgba(205,212,226,.55)';
        g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowBlur = 18; g.fillText(txt, x, y + 8 * (1 - M.eo(u))); g.shadowBlur = 0;
      }
      x += anchos[i] + esp;
    });
  });
  g.restore();
};

// ---------- fondo y polvo ----------
M.fondo = (g, t, tinte = null) => {
  const gr = g.createRadialGradient(M.W / 2, M.H * .55, 100, M.W / 2, M.H * .55, M.H * .8);
  gr.addColorStop(0, '#18202e'); gr.addColorStop(1, M.C.fondo2); g.fillStyle = gr; g.fillRect(0, 0, M.W, M.H);
  if (tinte) { g.fillStyle = tinte; g.fillRect(0, 0, M.W, M.H); }
  for (let i = 0; i < 60; i++) {                         // motas que flotan, como en el ejemplo
    const x = (M.az(i) * M.W + t * 6 * (M.az(i + 9) - .5)) % M.W, y = (M.az(i + 3) * M.H - t * 10 * M.az(i + 5) + M.H) % M.H;
    g.fillStyle = `rgba(200,210,235,${.08 + .18 * M.az(i + 7) * (.6 + .4 * Math.sin(t * 2 + i))})`; g.beginPath(); g.arc(x, y, 1 + 2 * M.az(i + 2), 0, 6.29); g.fill();
  }
};

// ---------- los cuatro modelos: logo simplificado, color y personalidad ----------
// claude: ordenado y amable (gafas redondas, libreta) · chatgpt: tranquilo y despistado (cascos, taza, ojos de sueño)
// grok: rebelde (cresta de antena, ceja levantada, espray) · gemini: emocional (degradado azul-violeta, corazón, antorcha)
M.MODELOS = {
  claude: { color: '#e07a52', oscuro: '#7a3a22', nombre: 'CLAUDE', firma: 'Anthropic' },
  chatgpt: { color: '#19c39b', oscuro: '#0b5e4b', nombre: 'CHATGPT', firma: 'OpenAI · GPT-5 Mini' },
  grok: { color: '#d9dde6', oscuro: '#2a2d35', nombre: 'GROK', firma: 'xAI' },
  gemini: { color: '#6f8cff', oscuro: '#3b2a8f', nombre: 'GEMINI', firma: 'Google · 3 Flash' },
};
M.emblema = (g, m, r) => {
  g.save();
  if (m === 'claude') {                                    // estallido de rayos irregulares
    g.fillStyle = '#ffffff'; g.strokeStyle = '#ffffff'; g.lineCap = 'round';
    for (let i = 0; i < 11; i++) { const a = i / 11 * 6.283 + .2, l = r * (.75 + .25 * M.az(i + 4)); g.lineWidth = r * .22;
      g.beginPath(); g.moveTo(Math.cos(a) * r * .15, Math.sin(a) * r * .15); g.lineTo(Math.cos(a) * l, Math.sin(a) * l); g.stroke(); }
  } else if (m === 'chatgpt') {                            // nudo de seis lazos
    g.strokeStyle = '#ffffff'; g.lineWidth = r * .17;
    for (let i = 0; i < 6; i++) { g.save(); g.rotate(i / 6 * 6.283); g.beginPath(); g.ellipse(0, -r * .42, r * .26, r * .55, .5, 0, 6.283); g.stroke(); g.restore(); }
  } else if (m === 'grok') {                               // aro roto con la barra en diagonal
    g.strokeStyle = '#ffffff'; g.lineWidth = r * .2; g.lineCap = 'round';
    g.beginPath(); g.arc(0, 0, r * .62, 2.6, 5.3); g.stroke();
    g.beginPath(); g.moveTo(-r * .75, r * .8); g.lineTo(r * .8, -r * .8); g.stroke();
  } else {                                                 // estrella de cuatro puntas en degradado
    const gr = g.createLinearGradient(-r, -r, r, r); gr.addColorStop(0, '#5fb0ff'); gr.addColorStop(.5, '#7b6bff'); gr.addColorStop(1, '#e06bff');
    g.fillStyle = gr; g.beginPath();
    for (let i = 0; i < 4; i++) { const a = i * 1.5708 - 1.5708, b = a + .785; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); g.quadraticCurveTo(Math.cos(b) * r * .12, Math.sin(b) * r * .12, Math.cos(a + 1.5708) * r, Math.sin(a + 1.5708) * r); }
    g.fill();
  }
  g.restore();
};
// personaje grande (primer plano): x, y = pies en pantalla; s = escala (1 ≈ 360 px de alto)
// o.gesto: 'saluda' | 'bosteza' | 'rie' | 'enamorado' | 'miedo'; o.ojos: 0–1 (1 = abiertos); o.mira: -1/1
M.personaje = (g, x, y, m, o = {}) => {
  const P = M.MODELOS[m], t = o.t || 0, s = o.s ?? 1, mira = o.mira ?? 1, ph = o.fase || 0; if (s <= 0) return;
  g.save(); g.translate(x, y); g.scale(s, s); g.globalAlpha = o.alfa ?? 1;
  const halo = g.createRadialGradient(0, 0, 10, 0, 0, 170); halo.addColorStop(0, P.color + '77'); halo.addColorStop(1, P.color + '00');
  g.save(); g.scale(1, .3); g.fillStyle = halo; g.beginPath(); g.arc(0, 0, 170, 0, 6.29); g.fill(); g.restore();
  const resp = Math.sin(t * 2.4 + ph), salto = o.salto || 0; g.translate(0, -salto);
  g.scale(1 + resp * .012, 1 - resp * .012);
  const cuerpo = (x0, y0, w, h, r) => { const gr = g.createLinearGradient(x0, 0, x0 + w, 0);
    if (m === 'gemini') { gr.addColorStop(0, '#5fb0ff'); gr.addColorStop(1, '#5b3fd0'); } else { gr.addColorStop(0, P.color); gr.addColorStop(1, P.oscuro); }
    g.fillStyle = gr; g.beginPath(); g.roundRect(x0, y0, w, h, r); g.fill(); };
  // piernas y brazos
  g.strokeStyle = P.oscuro; g.lineCap = 'round'; g.lineWidth = 22;
  for (const lado of [-1, 1]) { g.beginPath(); g.moveTo(lado * 26, -60); g.lineTo(lado * 30, -4); g.stroke(); }
  cuerpo(-62, -230, 124, 180, 56);
  const brazo = (lado, ang) => { g.save(); g.translate(lado * 58, -190); g.rotate(ang); g.strokeStyle = m === 'gemini' ? '#5b3fd0' : P.color; g.lineWidth = 24;
    g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 92); g.stroke(); g.restore(); };
  const ola = o.gesto === 'saluda' ? -2.6 + .35 * Math.sin(t * 9) : .25 + .05 * resp;
  brazo(-1, .25 - .05 * resp); brazo(1, -ola);
  // emblema en el pecho, sobre una placa oscura
  g.fillStyle = 'rgba(10,14,22,.55)'; g.beginPath(); g.arc(0, -140, 34, 0, 6.29); g.fill(); g.save(); g.translate(0, -140); M.emblema(g, m, 22); g.restore();
  // cabeza
  g.save(); g.translate(0, -300); g.rotate((o.inclina || 0) + .03 * Math.sin(t * 1.3 + ph));
  cuerpo(-66, -66, 132, 128, 60);
  if (m === 'grok') { g.fillStyle = '#f2f4f8'; g.beginPath(); for (let i = 0; i < 5; i++) { const xx = -36 + i * 18; g.moveTo(xx - 10, -58); g.lineTo(xx + 4 * Math.sin(t * 5 + i), -98 - 10 * (i % 2)); g.lineTo(xx + 10, -58); } g.fill(); }
  if (m === 'chatgpt') { g.strokeStyle = '#cfd8dc'; g.lineWidth = 12; g.beginPath(); g.arc(0, -4, 74, 3.5, 5.92); g.stroke();
    for (const lado of [-1, 1]) { g.fillStyle = '#cfd8dc'; g.beginPath(); g.roundRect(lado * 74 - 14, -24, 28, 50, 12); g.fill(); } }
  if (m === 'gemini' && o.gesto === 'enamorado') { const u = (t * .8) % 1; g.save(); g.globalAlpha = 1 - u; g.translate(40, -90 - 60 * u); g.scale(.8 + u * .4, .8 + u * .4);
    g.fillStyle = '#ff5c8a'; g.beginPath(); g.moveTo(0, 12); g.bezierCurveTo(-26, -6, -12, -28, 0, -12); g.bezierCurveTo(12, -28, 26, -6, 0, 12); g.fill(); g.restore(); }
  // cara: ojos con brillo, ceja de Grok, gafas de Claude, boca según el gesto
  const parp = (t * .6 + ph) % 3.3 < .1 ? .1 : 1, ab = (o.ojos ?? (m === 'chatgpt' ? .45 : 1)) * parp;
  for (const lado of [-1, 1]) { const ex = lado * 26 + mira * 8;
    g.fillStyle = '#0d121b'; g.beginPath(); g.ellipse(ex, -6, 11, 15 * ab, 0, 0, 6.29); g.fill();
    g.fillStyle = '#ffffff'; g.beginPath(); g.arc(ex + 4, -11 * ab, 3.5 * ab, 0, 6.29); g.fill();
    if (m === 'chatgpt') { g.fillStyle = P.color; g.fillRect(ex - 13, -24, 26, 18 * (1 - ab)); } }
  if (m === 'claude') { g.strokeStyle = '#2b1810'; g.lineWidth = 4; for (const lado of [-1, 1]) { g.beginPath(); g.arc(lado * 26 + mira * 8, -6, 21, 0, 6.29); g.stroke(); }
    g.beginPath(); g.moveTo(-5 + mira * 8, -8); g.lineTo(5 + mira * 8, -8); g.stroke(); }
  if (m === 'grok') { g.strokeStyle = '#0d121b'; g.lineWidth = 7; g.lineCap = 'round'; g.beginPath(); g.moveTo(-42, -34); g.lineTo(-12, -28); g.moveTo(12, -26); g.lineTo(42, -40); g.stroke(); }
  g.strokeStyle = '#0d121b'; g.lineWidth = 6; g.lineCap = 'round'; g.beginPath();
  if (o.gesto === 'bosteza') { const b = .5 + .5 * Math.sin(t * 2); g.fillStyle = '#0d121b'; g.ellipse(mira * 6, 34, 12, 8 + 12 * b, 0, 0, 6.29); g.fill(); }
  else if (o.gesto === 'miedo') { g.ellipse(mira * 6, 34, 10, 8, 0, 0, 6.29); g.stroke(); }
  else if (m === 'grok' || o.gesto === 'rie') { g.moveTo(-22 + mira * 6, 26); g.quadraticCurveTo(mira * 6 + 6, 46, 26 + mira * 6, 22); g.stroke(); }
  else { g.moveTo(-16 + mira * 6, 30); g.quadraticCurveTo(mira * 6, 42, 16 + mira * 6, 30); g.stroke(); }
  g.restore();
  // objetos de cada uno, en la mano izquierda
  g.save(); g.translate(-58 + Math.sin(.25) * 92, -190 + Math.cos(.25) * 92);
  if (m === 'claude') { g.rotate(-.15); g.fillStyle = '#f4ecdc'; g.fillRect(-34, -44, 50, 64); g.strokeStyle = '#b9a98c'; g.lineWidth = 3; for (let i = 0; i < 5; i++) { g.beginPath(); g.moveTo(-28, -32 + i * 11); g.lineTo(8, -32 + i * 11); g.stroke(); } }
  if (m === 'chatgpt') { g.fillStyle = '#e9eef0'; g.beginPath(); g.roundRect(-26, -38, 40, 46, 8); g.fill(); g.strokeStyle = '#e9eef0'; g.lineWidth = 7; g.beginPath(); g.arc(-32, -16, 12, 1.6, 4.7); g.stroke();
    g.strokeStyle = 'rgba(255,255,255,.4)'; g.lineWidth = 3; for (const k of [0, 1]) { g.beginPath(); g.moveTo(-14 + k * 14, -46); g.quadraticCurveTo(-4 + k * 14 + 6 * Math.sin(t * 3 + k), -62, -14 + k * 14, -78); g.stroke(); } }
  if (m === 'grok') { g.rotate(.3); g.fillStyle = '#ff4a3d'; g.beginPath(); g.roundRect(-16, -50, 32, 64, 8); g.fill(); g.fillStyle = '#e9eef0'; g.fillRect(-7, -62, 14, 12); }
  if (m === 'gemini' && o.antorcha) { g.fillStyle = '#7a5a3a'; g.save(); g.rotate(-.3); g.fillRect(-7, -80, 14, 92); g.restore(); M.fuego(g, -18, -84, 34, t, 7); }
  g.restore();
  g.restore();
};
// ficha con el nombre y la empresa, unida al personaje por una línea guía
M.ficha = (g, px, py, tx, ty, m, a = 1) => {
  if (a <= 0) return; const P = M.MODELOS[m];
  M.etiqueta(g, px, py, tx, ty, P.nombre, a, P.color);
  g.save(); g.globalAlpha = a; g.fillStyle = M.C.gris; g.font = '500 26px "Helvetica Neue"'; g.textAlign = tx < px ? 'right' : 'left';
  g.fillText(P.firma, tx + (tx < px ? -10 : 10), ty + 36); g.restore();
};
