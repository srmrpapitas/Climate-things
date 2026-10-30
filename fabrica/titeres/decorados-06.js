// Decorados del ep. 6 «Los que llegan» (temporada 2, paleta de noche y amanecer). Mismo contrato que decorados.js:
// cada uno es (g, t, d) en coordenadas 1280×720 con el suelo en y = 600. Plan: CAPITULO-06-PLANOS.md.
(() => {
  const D = T.DECORADOS, A = T.azar, N = T.NEGRO, TAU = T.TAU, S = T.suave, C = T.clamp;
  const texto = (g, s, x, y, tam, alinea = 'center', peso = 700) => { g.font = `${peso} ${tam}px Georgia, serif`; g.textAlign = alinea; g.fillText(s, x, y); g.textAlign = 'left'; };
  const brillo = (g, x, y, r, col, a) => { if (a <= 0) return; const gr = g.createRadialGradient(x, y, 1, x, y, r); gr.addColorStop(0, `rgba(${col},${a})`); gr.addColorStop(1, `rgba(${col},0)`); g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); };
  const pop = (t, en, d = .45) => t < en ? 0 : T.rebote(C((t - en) / d), 2.2);
  const persona = (g, x, y, h) => { g.beginPath(); g.arc(x, y - h * .82, h * .15, 0, TAU); g.fill(); g.beginPath(); g.moveTo(x - h * .2, y); g.lineTo(x - h * .17, y - h * .45);
    g.quadraticCurveTo(x, y - h * .7, x + h * .17, y - h * .45); g.lineTo(x + h * .2, y); g.closePath(); g.fill(); };

  // playa de Ceuta: arena, mar con olas que rompen y espuma; al fondo el espigón y la valla. d.y (orilla), d.mar (color), d.arena, d.calma (0–1: menos olas)
  D.playa = (g, t, d) => { const y = d.y || 560, ola = 1 - (d.calma || 0);
    g.fillStyle = d.mar || 'rgba(28,52,92,.95)'; g.fillRect(-900, y - 150, 3100, 170);
    for (let i = 0; i < 46; i++) { const px = -300 + 1900 * A(i + 3), py = y - 140 + 130 * A(i + 7), l = 20 + 50 * A(i + 9);   // brillos del agua
      g.fillStyle = `rgba(255,214,170,${.12 + .2 * Math.max(0, Math.sin(t * 2 + i))})`; g.fillRect(px + 12 * Math.sin(t * .8 + i), py, l, 2); }
    g.fillStyle = 'rgba(12,10,18,.9)'; g.fillRect(-200, y - 196, 260, 48); for (let k = 0; k < 9; k++) g.fillRect(-180 + k * 30, y - 214 - 6 * (k % 2), 18, 24);   // espigón
    g.strokeStyle = 'rgba(12,10,18,.85)'; g.lineWidth = 2; for (let k = 0; k < 16; k++) { g.beginPath(); g.moveTo(60 + k * 9, y - 150); g.lineTo(60 + k * 9, y - 230); g.stroke(); }   // la valla
    g.fillRect(56, y - 232, 150, 4);
    for (let f = 0; f < 3; f++) { const yy = y - 40 + f * 22, fase = t * (1.1 + .25 * f) + f * 2;   // olas que rompen y dejan espuma
      g.fillStyle = `rgba(240,232,214,${(.35 + .2 * f) * ola})`; g.beginPath(); g.moveTo(-400, yy);
      for (let x = -400; x <= 1700; x += 20) g.lineTo(x, yy + 6 * Math.sin(x * .015 + fase) * ola - 4 * Math.max(0, Math.sin(x * .004 - fase * .7)) * ola); g.lineTo(1700, yy + 6); g.lineTo(-400, yy + 6); g.fill(); }
    g.fillStyle = d.arena || '#3a2c2a'; g.beginPath(); g.moveTo(-400, y + 20); for (let x = -400; x <= 1700; x += 40) g.lineTo(x, y + 14 + 5 * Math.sin(x * .01)); g.lineTo(1700, 900); g.lineTo(-400, 900); g.fill(); };

  // nadadores: cabezas que suben y bajan con la ola y brazos que bracean hacia la orilla. d.n, d.zona [x0, x1, y0, y1],
  //   d.en (entran en oleadas: cada uno a su hora durante d.oleadas s), d.vuelven (t: nadan de vuelta hacia la izquierda, deprisa), d.escala
  D.nadadores = (g, t, d) => { const [x0, x1, y0, y1] = d.zona || [-100, 1300, 420, 520], e = d.escala || 1;
    for (let i = 0; i < (d.n || 40); i++) { const llega = (d.en ?? 0) + (d.oleadas ?? 2) * A(i + 11); if (t < llega) continue;
      const u = t - llega, vuelve = d.vuelven == null ? 0 : C((t - d.vuelven - .4 * A(i + 5)) / 1.6), prof = A(i + 7), s = e * (.55 + .7 * prof);
      const x = x0 + (x1 - x0) * A(i + 3) + 40 * Math.min(u, 3) - 1500 * vuelve * vuelve, y = y0 + (y1 - y0) * prof + 5 * Math.sin(t * 2.4 + i);
      if (x < -200) continue; const b = t * 4.2 + i * 1.7;
      g.fillStyle = N; g.beginPath(); g.ellipse(x, y - 10 * s, 9 * s, 10 * s, 0, 0, TAU); g.fill();   // la cabeza
      g.lineWidth = 5 * s; g.strokeStyle = N; g.lineCap = 'round';
      for (const l of [0, Math.PI]) { const a = b + l, ax = x + 16 * s * Math.cos(a) * (vuelve > 0 ? -1 : 1), ay = y - 4 * s - 20 * s * Math.max(0, Math.sin(a));
        if (Math.sin(a) > -.3) { g.beginPath(); g.moveTo(x, y - 2 * s); g.quadraticCurveTo((x + ax) / 2, ay - 8 * s, ax, ay); g.stroke(); } }
      g.fillStyle = 'rgba(240,232,214,.5)'; g.fillRect(x - 14 * s, y + 1, 28 * s, 2.5); } };

  // velas en la orilla que se encienden una a una desde d.en (d.n, d.x0, d.x1, d.y): por los que murieron
  D.velas = (g, t, d) => { const n = d.n || 75, y = d.y || 600;
    for (let i = 0; i < n; i++) { const en = (d.en ?? 0) + (d.dura ?? 3) * i / n; if (t < en) continue; const x = (d.x0 ?? 120) + ((d.x1 ?? 1160) - (d.x0 ?? 120)) * (i + .5 * A(i)) / n, yy = y + 18 * A(i + 4) - 9;
      const k = pop(t, en, .3), fl = .8 + .2 * Math.sin(t * 13 + i * 3); brillo(g, x, yy - 14, 26 * k, '255,190,100', .5 * fl);
      g.fillStyle = '#efe2c4'; g.fillRect(x - 3, yy - 12 * k, 6, 12 * k); g.fillStyle = `rgba(255,${190 + 40 * fl},120,.95)`; g.beginPath(); g.ellipse(x, yy - 16 * k, 2.6, 5 * fl * k, 0, 0, TAU); g.fill(); } };

  // móvil gigante: la burbuja del bulo crece en d.en con d.texto y suben «me gusta»; d.x, d.y (pie), d.escala, d.tuit (otro texto, estilo tuit)
  D.movil = (g, t, d) => { const e = d.escala || 1, k = pop(t, d.aparece ?? -1, .5); if (k <= 0) return; g.save(); g.translate(d.x || 640, d.y || 600); g.scale(e * k, e * k);
    g.fillStyle = N; g.beginPath(); g.roundRect(-150, -560, 300, 560, 34); g.fill(); const vibra = d.en != null && t > d.en && t < d.en + .5 ? 3 * Math.sin(t * 90) : 0;
    g.translate(vibra, 0); g.fillStyle = '#1d2a44'; g.beginPath(); g.roundRect(-134, -530, 268, 500, 18); g.fill(); brillo(g, 0, -280, 260, '120,170,255', .25);
    if (d.en != null && t > d.en) { const b = pop(t, d.en, .6), lineas = (d.texto || '').split('\n'); g.save(); g.translate(0, -340); g.scale(b, b);
      const tam = d.tam || (lineas.length > 2 ? 21 : 26); g.font = `700 ${tam}px Georgia, serif`; const an = Math.min(250, Math.max(...lineas.map(l => g.measureText(l).width)) / 2 + 14), esc = Math.min(1, 118 / an);
      g.scale(esc, 1); g.fillStyle = '#f2ead8'; g.beginPath(); g.roundRect(-an, -80, 2 * an, 60 + 34 * lineas.length, 16); g.fill(); g.beginPath(); g.moveTo(-60, -20 + 34 * lineas.length); g.lineTo(-90, 10 + 34 * lineas.length); g.lineTo(-30, -20 + 34 * lineas.length); g.fill();
      g.fillStyle = '#7a1410'; lineas.forEach((l, i) => texto(g, l, 0, -38 + i * 34, tam)); g.restore();
      for (let i = 0; i < 16; i++) { const u = ((t - d.en) * .6 + A(i)) % 1, x = -100 + 200 * A(i + 3) + 18 * Math.sin(t * 3 + i), y = -60 - 560 * u;   // los «me gusta» que suben
        g.globalAlpha = Math.sin(Math.PI * u); g.fillStyle = '#e0443a'; g.beginPath(); g.arc(x - 6, y, 7, 0, TAU); g.arc(x + 6, y, 7, 0, TAU); g.moveTo(x - 13, y + 2); g.lineTo(x, y + 16); g.lineTo(x + 13, y + 2); g.fill(); }
      g.globalAlpha = 1; }
    g.restore(); };

  // personitas en filas: d.n, d.cols, d.x, d.y (fila de abajo), d.alto, d.paso; d.encienden: [[t, cuántas, color, rótulo?]] (las primeras n se pintan)
  //   d.papeles: t en que casi todas levantan un papel (salvo una de cada d.sinPapel); d.sombria: siluetas en gris
  D.figuras = (g, t, d) => { const n = d.n || 10, cols = d.cols || n, h = d.alto || 90, paso = d.paso || h * .7, x0 = (d.x || 640) - (cols - 1) * paso / 2, y0 = d.y || 560;
    if (t < (d.aparece ?? -1)) return; let col = null, cuantas = 0, rot = null;
    for (const [tt, c, color, r] of d.encienden || []) if (t >= tt) { cuantas = c; col = color; rot = r; }
    for (let i = 0; i < n; i++) { const fx = x0 + (i % cols) * paso, fy = y0 - Math.floor(i / cols) * h * 1.15, k = pop(t, (d.aparece ?? -1) + .02 * i, .35), sube = 2 * Math.sin(t * 2 + i);
      g.save(); g.translate(fx, fy + sube); g.scale(k, k); g.fillStyle = i < cuantas ? col : d.sombria ? 'rgba(40,36,50,.85)' : N; if (i < cuantas) brillo(g, 0, -h * .5, h * .8, '255,210,140', .25);
      g.fillStyle = i < cuantas ? col : d.sombria ? 'rgba(40,36,50,.85)' : N; persona(g, 0, 0, h);
      if (d.papeles != null && t > d.papeles && i % (d.sinPapel || 99) !== d.sinPapel - 1) { const p = S(C((t - d.papeles - .03 * i) / .4)); g.fillStyle = '#f2ead8'; g.fillRect(h * .18, -h * (.55 + .4 * p), h * .22, h * .28); }
      g.restore(); }
    if (rot) { g.fillStyle = col; texto(g, rot, d.x || 640, y0 - Math.ceil(n / cols) * h * 1.15 - 18, d.tamRotulo || 30); } };

  // impresora que escupe hojas (d.texto) desde d.en hasta d.para y las apila en una montaña; en d.vuela el viento se la lleva
  D.impresora = (g, t, d) => { const x = d.x || 400, y = d.y || 600, e = d.escala || 1; g.save(); g.translate(x, y); g.scale(e, e);
    const imp = C((Math.min(t, d.para ?? 1e9) - (d.en ?? 0)) / ((d.para ?? 10) - (d.en ?? 0))), vuela = d.vuela == null ? 0 : C((t - d.vuela) / 2);
    const alto = 330 * S(imp) * (1 - vuela);   // la montaña de papel, a la derecha de la impresora
    g.fillStyle = '#e9dfc8'; g.beginPath(); g.moveTo(120, 0); g.quadraticCurveTo(300, -alto * 1.1, 480, 0); g.fill(); g.strokeStyle = 'rgba(80,60,40,.35)'; g.lineWidth = 1.5;
    for (let i = 0; i < alto / 9; i++) { const yy = -i * 9, an = 180 * (1 - i * 9 / (alto + 1)); g.beginPath(); g.moveTo(300 - an, yy); g.lineTo(300 + an, yy - 3); g.stroke(); }
    if (alto > 60) { g.fillStyle = '#7a1410'; texto(g, d.texto || 'ORDEN DE EXPULSIÓN', 300, -alto * .45, 20); }
    g.fillStyle = N; g.fillRect(-120, -150, 240, 150); g.fillRect(-100, -200, 200, 50); g.fillStyle = '#2b2235'; g.fillRect(-90, -70, 180, 12);   // la impresora
    brillo(g, 80, -120, 16, '120,255,140', .9 * (imp > 0 && imp < 1));
    if (t > (d.en ?? 0) && t < (d.para ?? 1e9)) for (let i = 0; i < 4; i++) { const u = ((t - d.en) * 2.2 + i / 4) % 1, hx = -60 + 380 * u, hy = -64 - 110 * Math.sin(Math.PI * u);   // hojas en vuelo
      g.save(); g.translate(hx, hy); g.rotate(u * 3); g.fillStyle = '#f2ead8'; g.fillRect(-26, -18, 52, 36); g.fillStyle = '#7a1410'; g.fillRect(-18, -8, 36, 3); g.restore(); }
    if (vuela > 0 && vuela < 1) for (let i = 0; i < 60; i++) { const u = C(vuela * 1.4 - .4 * A(i)), [cx, cy] = T.campo(300 + 900 * u, -200 * A(i + 3), t), hx = 300 + 180 * (A(i + 1) - .5) + 1300 * u + 60 * cx * u, hy = -alto * A(i + 2) - 400 * u * A(i + 4) + 50 * cy * u;
      g.save(); g.translate(hx, hy); g.rotate(t * 3 + i); g.scale(1, Math.cos(t * 6 + i)); g.fillStyle = '#f2ead8'; g.fillRect(-22, -15, 44, 30); g.restore(); }
    g.restore(); };

  // grifo con su válvula y dos indicadores (d.indicadores: ['CASAS', 'MÉDICOS']): d.niveles [[t, a, b]] (0–1); el chorro es el menor de los dos
  D.grifo = (g, t, d) => { const x = d.x || 640, y = d.y || 600, e = d.escala || 1; let a = 0, b = 0, pa = 0, pb = 0, t0 = -9;
    for (const [tt, na, nb] of d.niveles || []) if (t >= tt) { pa = a; pb = b; a = na; b = nb; t0 = tt; }
    const k = S(C((t - t0) / 1.2)), va = pa + (a - pa) * k, vb = pb + (b - pb) * k, chorro = Math.min(va, vb);
    g.save(); g.translate(x, y); g.scale(e, e); g.fillStyle = N;
    g.fillRect(-260, -420, 40, 420); g.fillRect(-260, -420, 260, 46); g.beginPath(); g.moveTo(0, -420); g.quadraticCurveTo(60, -420, 60, -360); g.lineTo(60, -330); g.lineTo(10, -330); g.lineTo(10, -374); g.lineTo(0, -374); g.fill();
    g.save(); g.translate(-130, -440); g.rotate(t * .6 * chorro); g.fillRect(-50, -8, 100, 16); g.fillRect(-8, -50, 16, 100); g.restore();   // la válvula
    if (chorro > .02) { g.fillStyle = 'rgba(120,180,255,.75)'; const w = 8 + 34 * chorro; g.fillRect(35 - w / 2, -330, w, 330); for (let i = 0; i < 8; i++) { g.beginPath(); g.arc(35 + (A(i) - .5) * 80, -10 - 30 * ((t * 2 + A(i + 3)) % 1), 5, 0, TAU); g.fill(); } }
    const indic = (lx, v, nombre) => { g.fillStyle = N; g.fillRect(lx - 34, -380, 68, 290); g.fillStyle = '#2b2235'; g.fillRect(lx - 24, -370, 48, 270); g.fillStyle = v < .4 ? '#c0392b' : '#3fa34d'; g.fillRect(lx - 24, -100 - 270 * v, 48, 270 * v);
      g.fillStyle = '#f2ead8'; texto(g, nombre, lx, -50, 24); };
    const [n1, n2] = d.indicadores || ['CASAS', 'MÉDICOS']; indic(200, va, n1); indic(310, vb, n2); g.restore(); };

  // rejas de una celda con d.n figuras dentro; d.encienden [[t, cuántas]] en color (d.color); d.x, d.y, d.ancho
  D.rejas = (g, t, d) => { const x = d.x || 640, y = d.y || 600, w = d.ancho || 360, h = d.alto || 300, n = d.n || 3; let c = 0; for (const [tt, k] of d.encienden || []) if (t >= tt) c = k;
    g.fillStyle = 'rgba(30,26,40,.9)'; g.fillRect(x - w / 2, y - h, w, h);
    for (let i = 0; i < n; i++) { g.fillStyle = i < c ? d.color || '#e07a2e' : 'rgba(10,8,14,.95)'; persona(g, x - w / 2 + w * (i + .5) / n, y - 6, h * .55); }
    g.fillStyle = N; g.fillRect(x - w / 2 - 12, y - h - 14, w + 24, 18); g.fillRect(x - w / 2 - 12, y - 6, w + 24, 12); for (let i = 0; i <= 8; i++) g.fillRect(x - w / 2 + i * w / 8 - 4, y - h, 8, h);
    if (d.rotulo) { g.fillStyle = '#f2ead8'; texto(g, d.rotulo, x, y - h - 30, 28); } };

  // pizarra de aula con su texto (d.lineas, que se escriben desde d.en) y pupitres delante
  D.pizarra = (g, t, d) => { const x = d.x || 640, y = d.y || 330, w = d.ancho || 620; g.fillStyle = '#5a3a1e'; g.fillRect(x - w / 2 - 14, y - 150, w + 28, 300);
    g.fillStyle = '#1f3a2c'; g.fillRect(x - w / 2, y - 136, w, 272); g.fillStyle = '#efe9d6';
    (d.lineas || []).forEach((l, i) => { const k = C((t - (d.en ?? 0) - i * .9) / .8); if (k <= 0) return; g.save(); g.beginPath(); g.rect(x - w / 2, y - 140, w * k, 280); g.clip(); g.font = `italic 700 ${d.tam || 46}px Georgia, serif`; g.textAlign = 'center'; g.fillText(l, x, y - 60 + i * 70); g.restore(); });
    g.fillStyle = N; for (let i = 0; i < 4; i++) { const px = x - 300 + i * 200; g.fillRect(px - 60, 520, 120, 14); g.fillRect(px - 50, 534, 10, 66); g.fillRect(px + 40, 534, 10, 66); } };

  // marcador de votos: filas [partido, 'SÍ' | 'NO'] que se encienden una a una desde d.en
  D.marcador = (g, t, d) => { const x = d.x || 640, y = d.y || 120, filas = d.filas || [], w = d.ancho || 420; g.fillStyle = 'rgba(8,6,12,.95)'; g.fillRect(x - w / 2, y, w, 70 + filas.length * 54);
    g.fillStyle = '#f2ead8'; texto(g, d.titulo || 'VOTACIÓN', x, y + 46, 30);
    filas.forEach(([p, v], i) => { const yy = y + 76 + i * 54, on = t > (d.en ?? 0) + i * (d.cada ?? .35); g.fillStyle = '#e9dfc8'; texto(g, p, x - w / 2 + 30, yy + 32, 28, 'left');
      g.fillStyle = on ? (v === 'NO' ? '#d23a2a' : '#3fa34d') : '#2b2b2b'; g.beginPath(); g.roundRect(x + w / 2 - 130, yy + 4, 100, 40, 8); g.fill(); if (on) { brillo(g, x + w / 2 - 80, yy + 24, 70, v === 'NO' ? '240,60,40' : '80,220,100', .3); g.fillStyle = '#fff'; texto(g, v, x + w / 2 - 80, yy + 36, 28); } }); };

  // tarta de datos: d.trozos porciones; en d.en se ilumina d.resalta (índice) con su cifra (d.texto)
  D.quesito = (g, t, d) => { const x = d.x || 640, y = d.y || 340, r = d.r || 150, n = d.trozos || 6, k = pop(t, d.aparece ?? -1, .5); if (k <= 0) return;
    for (let i = 0; i < n; i++) { const a0 = -Math.PI / 2 + TAU * i / n, a1 = a0 + TAU / n, on = i === (d.resalta ?? 0) && t > (d.en ?? 1e9), sale = on ? 22 * S(C((t - d.en) / .4)) : 0, am = (a0 + a1) / 2;
      g.fillStyle = on ? d.color || '#e07a2e' : i % 2 ? '#2b2235' : '#3a3048'; g.beginPath(); g.moveTo(x + sale * Math.cos(am), y + sale * Math.sin(am)); g.arc(x + sale * Math.cos(am), y + sale * Math.sin(am), r * k, a0, a1); g.closePath(); g.fill();
      g.strokeStyle = N; g.lineWidth = 4; g.stroke(); if (on) { g.fillStyle = '#fff'; texto(g, d.texto || '', x + (r * .62 + sale) * Math.cos(am), y + (r * .62 + sale) * Math.sin(am) + 12, 34); } } };

  // dos líneas que suben desde d.en durante d.dura: d.lineas [[rótulo, subida 0–1, color]]; entre ellas se abre el hueco en rojo (d.hueco: t) con d.etiqueta
  D.lineas = (g, t, d) => { const x = d.x || 340, y = d.y || 560, w = d.ancho || 620, h = d.alto || 360, k = S(C((t - (d.en ?? 0)) / (d.dura ?? 3))); if (t < (d.en ?? 0)) return;
    g.fillStyle = 'rgba(8,6,12,.75)'; g.fillRect(x - 40, y - h - 40, w + 200, h + 90); g.strokeStyle = '#e9dfc8'; g.lineWidth = 3; g.beginPath(); g.moveTo(x, y - h); g.lineTo(x, y); g.lineTo(x + w, y); g.stroke();
    const pts = sube => Array.from({ length: 30 }, (_, i) => [x + w * k * i / 29, y - 20 - h * .85 * sube * (k * i / 29) ** 1.15]);
    const [l1, l2] = (d.lineas || []).map(([, s]) => pts(s));
    if (d.hueco != null && t > d.hueco && l1 && l2) { g.fillStyle = `rgba(210,40,30,${.45 * S(C((t - d.hueco) / .6))})`; g.beginPath(); l1.forEach(([px, py], i) => g[i ? 'lineTo' : 'moveTo'](px, py)); [...l2].reverse().forEach(([px, py]) => g.lineTo(px, py)); g.fill(); }
    (d.lineas || []).forEach(([s, , col], j) => { const P = j ? l2 : l1; g.strokeStyle = col; g.lineWidth = 7; g.beginPath(); P.forEach(([px, py], i) => g[i ? 'lineTo' : 'moveTo'](px, py)); g.stroke();
      const [ex, ey] = P[P.length - 1]; g.fillStyle = col; texto(g, s, ex + 14, ey + 8, 26, 'left'); });
    if (d.etiqueta && d.hueco != null && t > d.hueco + .4) { g.fillStyle = '#ffcf9a'; texto(g, d.etiqueta, x + w * .55, y - h * .25, 30); } };

  // burbuja de diálogo con texto (d.texto) en d.x, d.y, de d.en a d.hasta; sale con rebote. d.corazon: dibuja un corazón delante
  D.burbuja = (g, t, d) => { if (t < d.en || t > (d.hasta ?? 1e9)) return; const k = pop(t, d.en, .4) * C(((d.hasta ?? 1e9) - t) / .2), w = d.ancho || 170, h = d.alto || 80;
    g.save(); g.translate(d.x, d.y); g.scale(k, k); g.fillStyle = '#f2ead8'; g.beginPath(); g.ellipse(0, 0, w / 2, h / 2, 0, 0, TAU); g.fill(); g.beginPath(); g.moveTo(-14, h / 2 - 6); g.lineTo(-30 * (d.cola ?? 1), h / 2 + 26); g.lineTo(10, h / 2 - 4); g.fill();
    g.fillStyle = d.color || '#2a1708'; if (d.corazon) { g.fillStyle = '#e0443a'; g.beginPath(); g.arc(-w * .28 - 7, -4, 10, 0, TAU); g.arc(-w * .28 + 7, -4, 10, 0, TAU); g.moveTo(-w * .28 - 17, 0); g.lineTo(-w * .28, 18); g.lineTo(-w * .28 + 17, 0); g.fill(); g.fillStyle = d.color || '#2a1708'; }
    texto(g, d.texto || 'bla', d.corazon ? 16 : 0, 12, d.tam || 32); g.restore(); };

  // nombre de un personaje la primera vez que sale: rótulo dorado con una flechita (d.x, d.y, d.texto, d.en, d.hasta)
  D.nombre = (g, t, d) => { if (t < d.en || t > (d.hasta ?? d.en + 3)) return; const k = pop(t, d.en, .4) * C(((d.hasta ?? d.en + 3) - t) / .3); g.save(); g.translate(d.x, d.y); g.scale(k, k);
    g.font = '700 26px Georgia, serif'; const w = g.measureText(d.texto).width + 34; g.fillStyle = 'rgba(12,8,6,.85)'; g.beginPath(); g.roundRect(-w / 2, -24, w, 40, 10); g.fill();
    g.beginPath(); g.moveTo(-8, 16); g.lineTo(0, 30); g.lineTo(8, 16); g.fill(); g.fillStyle = '#f0c46a'; texto(g, d.texto, 0, 5, 26); g.restore(); };

  // cancela de la frontera en una valla (d.x, d.y, d.texto) que se abre y se cierra según d.abre [[t, 0–1], …]; una mano gigante con su
  //   rótulo (d.mano) gira la llave cada vez que cambia
  D.cancela = (g, t, d) => { const x = d.x || 640, y = d.y || 600, w = d.ancho || 300, h = d.alto || 260; let v = 0, p = 0, t0 = -9;
    for (const [tt, a] of d.abre || []) if (t >= tt) { p = v; v = a; t0 = tt; } const k = p + (v - p) * T.rebote(C((t - t0) / .5), 1.8), gira = C((t - t0 + .4) / .4) * (t - t0 < .6);
    g.fillStyle = N; for (let i = -6; i <= 6; i++) if (Math.abs(i) > 2) g.fillRect(x + i * 60 - 4, y - h, 8, h); g.fillRect(x - 420, y - h, 840, 10); g.fillRect(x - 420, y - h / 2, 840, 6);
    for (const s of [-1, 1]) { g.save(); g.translate(x + s * w / 2, y); g.scale(1 - k * .85, 1); g.fillRect(-s * w / 2 - 6, -h + 10, 12, h - 10);
      for (let i = 0; i < 6; i++) g.fillRect(-s * (i * w / 12), -h + 10, 6, h - 10); g.fillRect(-s * w / 2, -h + 10, s * w / 2, 8); g.fillRect(-s * w / 2, -24, s * w / 2, 8); g.restore(); }
    g.fillStyle = '#f2ead8'; texto(g, d.texto || 'FRONTERA', x, y - h - 20, 30);
    if (d.mano) { const mx = x + w / 2 + 60, my = y - h - 120 + 10 * Math.sin(t * 1.3); g.save(); g.translate(mx, my); g.rotate(-.3 + 1.2 * gira); g.fillStyle = N;
      g.fillRect(-26, -160, 52, 120); g.beginPath(); g.ellipse(0, -10, 44, 48, 0, 0, TAU); g.fill(); for (let i = 0; i < 4; i++) { g.beginPath(); g.ellipse(-30 + i * 20, 34, 9, 24, 0, 0, TAU); g.fill(); }
      g.fillStyle = '#e8b84a'; g.fillRect(-4, 40, 8, 60); g.beginPath(); g.arc(0, 108, 14, 0, TAU); g.fill(); g.restore();
      g.fillStyle = '#f0c46a'; texto(g, d.mano, mx, my - 180, 26); } };
  // invernaderos de Almería: arcos de plástico en hilera que brillan al sol (d.x, d.n, d.y, d.escala)
  D.invernadero = (g, t, d) => { const y = d.y || 600, e = d.escala || 1, n = d.n || 4;
    for (let i = 0; i < n; i++) { const x = (d.x ?? 200) + i * 230 * e; g.fillStyle = 'rgba(220,226,230,.55)'; g.beginPath(); g.moveTo(x - 110 * e, y); g.quadraticCurveTo(x, y - 230 * e, x + 110 * e, y); g.fill();
      g.strokeStyle = 'rgba(30,26,40,.7)'; g.lineWidth = 2; for (let k = -2; k <= 2; k++) { g.beginPath(); g.moveTo(x + k * 44 * e, y); g.lineTo(x + k * 36 * e, y - (115 - 18 * Math.abs(k)) * e); g.stroke(); }
      brillo(g, x + 30 * e, y - 120 * e, 60 * e, '255,250,220', .25 + .1 * Math.sin(t * 2 + i));
      g.fillStyle = '#c0392b'; for (let k = 0; k < 6; k++) { g.beginPath(); g.arc(x - 70 * e + k * 28 * e, y - 16 * e - 10 * (k % 2) * e, 6 * e, 0, TAU); g.fill(); } } };
  // barra de bar con cafetera que humea y tazas (d.x, d.y, d.ancho)
  D.barra = (g, t, d) => { const x = d.x || 640, y = d.y || 600, w = d.ancho || 380; g.fillStyle = N; g.fillRect(x - w / 2, y - 120, w, 120); g.fillRect(x - w / 2 - 16, y - 132, w + 32, 16);
    g.fillRect(x + w / 2 - 120, y - 210, 90, 78); g.fillRect(x + w / 2 - 110, y - 226, 70, 18); for (let i = 0; i < 3; i++) { g.fillRect(x - w / 2 + 40 + i * 50, y - 156, 26, 24); }
    for (let i = 0; i < 5; i++) { const u = ((t * .5 + i / 5) % 1); g.fillStyle = `rgba(240,232,214,${.4 * (1 - u)})`; g.beginPath(); g.arc(x + w / 2 - 75 + 14 * Math.sin(t * 2 + i), y - 236 - 90 * u, 10 + 16 * u, 0, TAU); g.fill(); }
    g.fillStyle = '#f0c46a'; texto(g, d.texto || 'BAR', x, y - 60, 30); };
  // trono que cae como una ficha de dominó en d.cae (gira sobre su pata derecha) con su rótulo (d.rotulo)
  D.tronoCae = (g, t, d) => { const x = d.x, y = d.y || 600, e = d.escala || 1, a = d.cae == null ? 0 : 1.45 * Math.min(1, ((t - d.cae) / .5) ** 2) * (t > d.cae);
    g.save(); g.translate(x + 36 * e, y); g.rotate(a); g.translate(-x - 36 * e, -y); D.trono(g, t, d); g.restore();
    if (d.rotulo) { g.fillStyle = '#2a1708'; texto(g, d.rotulo, x, y + 34, 18); } };
  // patera pequeña que cruza el mar (d.de → d.a entre d.en y d.llega), con gente dentro; d.escala
  D.patera = (g, t, d) => { if (t < (d.en ?? 0)) return; const k = S(C((t - d.en) / ((d.llega ?? d.en + 5) - d.en))), x = d.de + (d.a - d.de) * k, y = (d.y || 500) + 4 * Math.sin(t * 2.3), e = d.escala || 1;
    g.save(); g.translate(x, y); g.rotate(.05 * Math.sin(t * 2.3 + 1)); g.scale(e, e); g.fillStyle = N; g.beginPath(); g.moveTo(-90, -14); g.lineTo(90, -14); g.lineTo(64, 12); g.lineTo(-70, 12); g.closePath(); g.fill();
    for (let i = 0; i < 8; i++) { g.beginPath(); g.arc(-70 + i * 20, -24 - 3 * Math.sin(t * 3 + i), 7, 0, TAU); g.fill(); } g.restore(); };
})();
