// Decorados del ep. 7 «La fábrica de respuestas» (la escuela). Mismo contrato que decorados.js: cada uno es (g, t, d) en coordenadas
// 1280×720 con el suelo en y = 600. Todos los paisajes son nuevos (el usuario: nada de parlamento, noria ni balanza). Plan: CAPITULO-07-PLANOS.md.
(() => {
  const D = T.DECORADOS, A = T.azar, N = T.NEGRO, TAU = T.TAU, S = T.suave, C = T.clamp;
  const texto = (g, s, x, y, tam, alinea = 'center', peso = 700, fuente = 'Georgia, serif') => { g.font = `${peso} ${tam}px ${fuente}`; g.textAlign = alinea; g.fillText(s, x, y); g.textAlign = 'left'; };
  const brillo = (g, x, y, r, col, a) => { if (a <= 0) return; const gr = g.createRadialGradient(x, y, 1, x, y, r); gr.addColorStop(0, `rgba(${col},${a})`); gr.addColorStop(1, `rgba(${col},0)`); g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); };
  const pop = (t, en, d = .45) => t < en ? 0 : T.rebote(C((t - en) / d), 2.2);
  const val = (v, t, def) => v == null ? def : Array.isArray(v) ? T.curva(v, t) : v;          // número o curva [[t, v], …]
  const nino = (g, x, y, h, sentado) => { g.beginPath(); g.arc(x, y - h * .78, h * .17, 0, TAU); g.fill();   // niño de silueta (sentado: solo el busto)
    g.beginPath(); g.moveTo(x - h * .2, y - (sentado ? h * .3 : 0)); g.lineTo(x - h * .16, y - h * .5); g.quadraticCurveTo(x, y - h * .66, x + h * .16, y - h * .5); g.lineTo(x + h * .2, y - (sentado ? h * .3 : 0)); g.closePath(); g.fill();
    if (!sentado) { g.fillRect(x - h * .14, y - h * .05, h * .1, h * .05); g.fillRect(x + h * .04, y - h * .05, h * .1, h * .05); } };
  const ventana = (g, x, y, w, h, cielo, luz = 0) => { g.fillStyle = cielo; g.fillRect(x, y, w, h); if (luz) brillo(g, x + w / 2, y + h / 2, w, '255,240,200', luz);
    g.fillStyle = N; g.fillRect(x - 6, y - 6, w + 12, 8); g.fillRect(x - 6, y + h - 2, w + 12, 10); g.fillRect(x - 6, y, 6, h); g.fillRect(x + w, y, 6, h); g.fillRect(x + w / 2 - 3, y, 6, h); g.fillRect(x, y + h / 2 - 3, w, 6); };
  const pared = (g, col, zocalo) => { g.fillStyle = col; g.fillRect(-900, -600, 3100, 1200); if (zocalo) { g.fillStyle = zocalo; g.fillRect(-900, 470, 3100, 130); } };

  // ---------- el hilo del capítulo: los pupitres ----------
  // filas de pupitres en perspectiva (de atrás a delante). Son siempre los mismos: solo cambia el material con la época.
  //   d.epoca: 1763 | 1857 | 1900 | 'hoy'   d.filas, d.cols   d.ninos (bool: niños sentados; d.crecen: 0–1, se hacen adultos)
  //   d.circulo: 0–1 o curva [[t, v]]: de filas a un círculo alrededor de una mesa (la mesa redonda de Exeter)   d.y (fila de delante)
  //   d.vacio: [índices] sin niño   d.repite: índice del niño que se levanta, da la vuelta y vuelve (d.repiteEn, 4 s)
  D.pupitres = (g, t, d) => { const filas = d.filas || 3, cols = d.cols || 6, ep = d.epoca || 'hoy', y0 = d.y || 590, k = S(C(val(d.circulo, t, 0))), crece = val(d.crecen, t, 0);
    const mat = ep === 1763 ? ['#3b2614', '#2a1a0c'] : ep === 1857 || ep === 1900 ? ['#4a3020', '#2e1c10'] : ['#2c3440', '#1a1f28'];
    const sitios = [];
    for (let f = filas - 1; f >= 0; f--) for (let c = 0; c < cols; c++) { const e = 1 - .17 * f, i = f * cols + c;
      const xf = 640 + (c - (cols - 1) / 2) * 175 * e, yf = y0 - f * 62;                                     // en filas
      const a = TAU * (i / (filas * cols)) + Math.PI / 2, xc = 640 + 470 * Math.cos(a), yc = 470 + 110 * Math.sin(a);   // en círculo
      const x = xf + (xc - xf) * k, y = yf + (yc - yf) * k, s = (e + ((.62 + .38 * (yc - 360) / 220) - e) * k) * (d.escala || 1);
      sitios.push([y, x, s, i, a]); }
    sitios.sort((p, q) => p[0] - q[0]);
    if (k > .02) { g.save(); g.globalAlpha = k; g.fillStyle = mat[1]; g.beginPath(); g.ellipse(640, 470, 380, 82, 0, 0, TAU); g.fill();   // la mesa del centro
      g.fillStyle = mat[0]; g.beginPath(); g.ellipse(640, 462, 380, 82, 0, 0, TAU); g.fill(); g.restore(); }
    for (const [y, x, s, i, a] of sitios) { g.save(); g.translate(x, y); g.scale(s, s); const gira = k * Math.cos(a) * .5;
      if (d.ninos && !(d.vacio || []).includes(i)) { let dx = 0, dy = 0;
        if (d.repite === i && d.repiteEn != null) { const u = C((t - d.repiteEn) / 4); if (u > 0 && u < 1) { const ang = TAU * S(u); dx = 260 * Math.sin(ang); dy = -40 * Math.sin(Math.PI * u) + 60 * (1 - Math.cos(ang)) * .5; } }
        const h = 88 + 60 * crece; g.fillStyle = N; nino(g, dx, -48 + dy - 14 * crece, h, !dy); }
      g.fillStyle = mat[0]; if (ep === 1763) { g.fillRect(-70, -50, 140, 12); g.fillStyle = mat[1]; g.fillRect(-62, -38, 10, 38); g.fillRect(52, -38, 10, 38); g.fillRect(-70, -16, 140, 8); }   // tabla y banco
      else if (ep === 'hoy') { g.fillRect(-64, -54, 128, 9); g.fillStyle = mat[1]; g.fillRect(-4, -45, 8, 45); g.fillRect(-40, -4, 80, 5);
        g.fillStyle = `rgba(120,200,255,${.55 + .15 * Math.sin(t * 3 + i)})`; g.fillRect(-26 + gira * 10, -60, 34, 5); brillo(g, -9, -62, 40, '120,200,255', .18); }   // la tablet que brilla
      else { g.beginPath(); g.moveTo(-70, -58); g.lineTo(70, -58); g.lineTo(64, -44); g.lineTo(-64, -44); g.fill(); g.fillStyle = mat[1]; g.fillRect(-60, -44, 120, 16); g.fillRect(-58, -28, 8, 28); g.fillRect(50, -28, 8, 28);
        g.fillStyle = '#0b0705'; g.beginPath(); g.arc(46, -60, 6, 0, TAU); g.fill(); if (ep === 1857) { g.fillStyle = '#2d3a3a'; g.fillRect(-36, -64, 40, 8); } }   // tintero y pizarrín
      g.restore(); } };

  // ---------- Prusia, Jena y el viaje de la idea ----------
  // cuartel prusiano: fachada con frontón y el águila, banderas, y una fila de soldados con casco de pincho. d.marcha: t desde el que desfilan
  D.plazaPrusia = (g, t, d) => { const y = 600; g.fillStyle = 'rgba(20,16,26,.92)'; g.fillRect(140, 250, 1000, 350);
    g.beginPath(); g.moveTo(110, 250); g.lineTo(640, 130); g.lineTo(1170, 250); g.fill();
    for (let i = 0; i < 9; i++) { g.fillStyle = `rgba(255,200,120,${.25 + .15 * Math.sin(t * 1.5 + i)})`; g.fillRect(190 + i * 108, 300, 40, 70); g.fillRect(190 + i * 108, 420, 40, 70); }
    g.fillStyle = N; g.save(); g.translate(640, 205); const al = 1 + .04 * Math.sin(t * 2);   // el águila
    g.beginPath(); g.moveTo(0, -30); g.quadraticCurveTo(-30 * al, -40, -70 * al, -10); g.lineTo(-40, -6); g.lineTo(-60 * al, 12); g.lineTo(-20, 4); g.lineTo(0, 30); g.lineTo(20, 4); g.lineTo(60 * al, 12); g.lineTo(40, -6); g.lineTo(70 * al, -10); g.quadraticCurveTo(30 * al, -40, 0, -30); g.fill(); g.restore();
    for (const bx of [150, 1130]) { g.fillStyle = N; g.fillRect(bx, 90, 5, 170); g.fillStyle = '#e9e2d0'; g.beginPath(); g.moveTo(bx + 5, 96);
      for (let k = 0; k <= 10; k++) g.lineTo(bx + 5 + k * 9 * (bx < 640 ? 1 : -1) * 1, 96 + 6 * Math.sin(t * 4 + k * .8)); g.lineTo(bx + 5 + 90 * (bx < 640 ? 1 : -1), 150 + 6 * Math.sin(t * 4 + 8)); g.lineTo(bx + 5, 150); g.fill();
      g.fillStyle = N; g.fillRect(bx + (bx < 640 ? 34 : -56), 112, 22, 22); }
    const paso = d.marcha == null ? 0 : Math.max(0, t - d.marcha);
    for (let i = 0; i < (d.n || 12); i++) { const x = 120 + i * 90 + 60 * paso % 90, pie = Math.sin(paso * 7 + i) * (paso > 0); g.fillStyle = N; g.save(); g.translate(x, y);
      g.fillRect(-11, -112, 22, 62); g.beginPath(); g.arc(0, -124, 12, 0, TAU); g.fill(); g.fillRect(-13, -140, 26, 12); g.fillRect(-2, -156, 4, 18);   // casco de pincho
      g.fillRect(-10, -50, 8, 50 - 8 * Math.max(0, pie)); g.fillRect(2, -50, 8, 50 - 8 * Math.max(0, -pie)); g.fillRect(13, -150, 3, 100); g.restore(); } };

  // Jena, 1806: lomas con humo de cañones que sube y se tuerce con el viento; Napoleón a caballo con su bicornio en lo alto. d.fogonazos: [t…]
  D.campoJena = (g, t, d) => { g.fillStyle = 'rgba(40,24,30,.9)'; g.beginPath(); g.moveTo(-400, 600); g.quadraticCurveTo(300, 380, 820, 470); g.quadraticCurveTo(1100, 520, 1700, 430); g.lineTo(1700, 900); g.lineTo(-400, 900); g.fill();
    for (let i = 0; i < 5; i++) { const x = 120 + i * 150, y = 560 - 30 * Math.sin(i), fog = (d.fogonazos || []).some(f => t > f + i * .3 && t < f + i * .3 + .25);
      g.fillStyle = N; g.beginPath(); g.arc(x - 16, y, 14, 0, TAU); g.arc(x + 16, y, 14, 0, TAU); g.fill(); g.save(); g.translate(x, y - 12); g.rotate(-.35); g.fillRect(0, -6, 64, 12); g.restore();
      if (fog) brillo(g, x + 64, y - 34, 70, '255,180,80', .9);
      for (let p = 0; p < 7; p++) { const u = ((t * .25 + p / 7 + i * .13) % 1), r = 20 + 70 * u, [cx] = T.campo(x, y - 200 * u, t * .6);
        g.fillStyle = `rgba(200,190,180,${.38 * (1 - u)})`; g.beginPath(); g.arc(x + 70 + 160 * u + 60 * cx * u, y - 40 - 260 * u, r, 0, TAU); g.fill(); } }
    g.save(); g.translate(1010, 470); g.fillStyle = N; const cab = Math.sin(t * 1.4) * .05;   // Napoleón
    g.beginPath(); g.ellipse(0, -60, 70, 30, 0, 0, TAU); g.fill(); g.fillRect(-55, -40, 10, 40); g.fillRect(-30, -40, 10, 40); g.fillRect(30, -40, 10, 40); g.fillRect(50, -40, 10, 40);
    g.save(); g.translate(60, -80); g.rotate(-.5 + cab); g.fillRect(-10, -10, 26, 60); g.beginPath(); g.ellipse(14, -16, 26, 12, -.4, 0, TAU); g.fill(); g.restore();
    g.beginPath(); g.moveTo(-70, -66); g.quadraticCurveTo(-100, -50, -96, -20); g.lineTo(-70, -54); g.fill();
    g.fillRect(-14, -150, 28, 70); g.beginPath(); g.arc(0, -162, 13, 0, TAU); g.fill(); g.beginPath(); g.ellipse(0, -176, 30, 9, 0, Math.PI, 0); g.fill(); g.fillRect(-30, -178, 60, 6); g.restore(); };

  // el Atlántico: olas en capas y un velero que cruza de d.de a d.a entre d.en y d.llega (con su cabeceo)
  D.barcoAtlantico = (g, t, d) => { for (let f = 0; f < 4; f++) { const yy = 470 + f * 40; g.fillStyle = `rgba(${20 + f * 6},${34 + f * 8},${60 + f * 10},.95)`; g.beginPath(); g.moveTo(-500, yy);
      for (let x = -500; x <= 1800; x += 24) g.lineTo(x, yy + 9 * Math.sin(x * .012 + t * (1.2 + .3 * f) + f) + 5 * Math.sin(x * .031 - t * 2)); g.lineTo(1800, 900); g.lineTo(-500, 900); g.fill(); }
    const k = S(C((t - (d.en ?? 0)) / ((d.llega ?? 8) - (d.en ?? 0)))), x = (d.de ?? -100) + ((d.a ?? 1400) - (d.de ?? -100)) * k, y = 500 + 6 * Math.sin(t * 1.6);
    g.save(); g.translate(x, y); g.rotate(.04 * Math.sin(t * 1.3)); g.fillStyle = N; g.beginPath(); g.moveTo(-120, -20); g.lineTo(120, -20); g.lineTo(90, 20); g.lineTo(-96, 20); g.fill();
    g.fillRect(-4, -210, 8, 190); g.fillRect(-64, -170, 6, 150);
    g.fillStyle = '#e8dcc0'; const hinch = 10 + 6 * Math.sin(t * 2); g.beginPath(); g.moveTo(4, -200); g.quadraticCurveTo(70 + hinch, -120, 4, -40); g.fill(); g.beginPath(); g.moveTo(-58, -160); g.quadraticCurveTo(-8 + hinch, -100, -58, -40); g.fill();
    g.fillStyle = N; g.fillRect(-2, -224, 30, 14); g.restore(); };

  // escuela de una sola sala de Massachusetts (1852): madera, campanario, porche y la bandera
  D.escuelaMadera = (g, t, d) => { const x = d.x || 640; g.fillStyle = '#5a2a22'; g.fillRect(x - 230, 360, 460, 240); g.fillStyle = 'rgba(0,0,0,.25)'; for (let i = 0; i < 12; i++) g.fillRect(x - 230, 372 + i * 20, 460, 3);
    g.fillStyle = N; g.beginPath(); g.moveTo(x - 260, 365); g.lineTo(x, 230); g.lineTo(x + 260, 365); g.fill(); g.fillRect(x - 30, 160, 60, 90); g.beginPath(); g.moveTo(x - 40, 165); g.lineTo(x, 110); g.lineTo(x + 40, 165); g.fill();
    g.fillStyle = '#c9a050'; g.save(); g.translate(x, 200); g.rotate(val(d.toca, t, 0) ? .3 * Math.sin(t * 9) : 0); g.beginPath(); g.moveTo(-12, -14); g.quadraticCurveTo(-14, 10, -18, 14); g.lineTo(18, 14); g.quadraticCurveTo(14, 10, 12, -14); g.fill(); g.restore();
    g.fillStyle = N; g.fillRect(x - 40, 470, 80, 130); for (const vx of [x - 170, x + 110]) ventana(g, vx, 420, 60, 90, '#f0c27a', .25);
    g.fillRect(x + 200, 300, 4, 300); g.fillStyle = '#b8342a'; g.fillRect(x + 204, 300, 60 + 4 * Math.sin(t * 3), 36); g.fillStyle = '#2c3a6a'; g.fillRect(x + 204, 300, 24, 18); };

  // escuela de pueblo española (por dentro): pared encalada, mapa de España, estufa de hierro con su tubo y el año en la pizarra pequeña
  D.escuelaRural = (g, t, d) => { pared(g, '#d8c7a0', '#8a6a44'); g.fillStyle = 'rgba(0,0,0,.08)'; for (let i = 0; i < 30; i++) g.fillRect(-300 + 70 * i, -100 + 40 * A(i), 40, 500);
    ventana(g, 90, 150, 170, 220, '#9cc4d8', .3);
    g.fillStyle = '#e9dcb4'; g.fillRect(470, 120, 340, 230); g.strokeStyle = N; g.lineWidth = 6; g.strokeRect(470, 120, 340, 230);   // el mapa de España
    g.fillStyle = '#7d9a5a'; g.beginPath(); const m = [[520, 170], [600, 150], [700, 158], [760, 175], [770, 220], [740, 250], [748, 300], [690, 330], [600, 335], [540, 310], [515, 260], [505, 210]];
    g.moveTo(...m[0]); for (const p of m) g.lineTo(...p); g.closePath(); g.fill(); g.fillStyle = N; texto(g, 'ESPAÑA', 640, 255, 26);
    g.fillStyle = N; g.fillRect(1010, 380, 90, 160); g.beginPath(); g.ellipse(1055, 380, 50, 18, 0, 0, TAU); g.fill(); g.fillRect(1046, 60, 18, 320); g.fillRect(1046, 60, 120, 18);   // estufa
    brillo(g, 1055, 470, 90, '255,140,60', .35 + .15 * Math.sin(t * 6)); g.fillStyle = `rgba(255,${140 + 40 * Math.sin(t * 9)},60,.9)`; g.fillRect(1030, 450, 50, 30);
    if (d.anio) { g.fillStyle = '#1f3a2c'; g.fillRect(860, 150, 120, 80); g.fillStyle = '#efe9d6'; texto(g, String(d.anio), 920, 205, 34); } };

  // aula de hoy, de noche: fluorescentes que parpadean, pantalla del proyector, reloj y ventana oscura. d.dia (0–1: amanece)
  D.aulaHoy = (g, t, d) => { const dia = val(d.dia, t, 0); pared(g, dia > .5 ? '#c9c2b0' : '#3d4152', dia > .5 ? '#7c8a8f' : '#262a36');
    ventana(g, 70, 140, 220, 260, dia > .5 ? '#a8d4f0' : '#141a33', dia * .3); if (dia < .5) for (let i = 0; i < 12; i++) { g.fillStyle = 'rgba(255,240,200,.7)'; g.fillRect(80 + 200 * A(i), 150 + 110 * A(i + 3), 2, 2); }
    for (let i = 0; i < 3; i++) { const on = A(Math.floor(t * 8) + i * 31) > .04 || i !== 1; g.fillStyle = on ? '#f4f6ff' : '#555a66'; g.fillRect(360 + i * 280, 40, 200, 12); if (on && dia < .5) brillo(g, 460 + i * 280, 60, 260, '220,230,255', .22); }
    g.fillStyle = '#e8ecf2'; g.fillRect(420, 110, 440, 250); g.fillStyle = N; g.fillRect(414, 104, 452, 8); brillo(g, 640, 235, 300, '200,220,255', dia < .5 ? .2 : 0);
    g.fillStyle = '#efe9d6'; g.beginPath(); g.arc(1080, 150, 46, 0, TAU); g.fill(); g.strokeStyle = N; g.lineWidth = 6; g.stroke();
    g.lineWidth = 4; g.beginPath(); g.moveTo(1080, 150); g.lineTo(1080 + 30 * Math.sin(t * .5), 150 - 30 * Math.cos(t * .5)); g.stroke(); g.beginPath(); g.moveTo(1080, 150); g.lineTo(1080 + 20 * Math.sin(t * .04), 150 - 20 * Math.cos(t * .04)); g.stroke(); };

  // ---------- la élite ----------
  // claustro gótico (Eton y Oxford): arcos apuntados, césped y la torre; sin escudos
  D.claustro = (g, t, d) => { g.fillStyle = '#3c5a2c'; g.fillRect(-400, 520, 2100, 300); g.fillStyle = 'rgba(30,22,30,.95)';
    g.fillRect(-100, 140, 1480, 80); g.beginPath(); for (let i = -1; i < 12; i++) { const x = 40 + i * 120; g.moveTo(x, 220); g.lineTo(x, 520); g.lineTo(x + 18, 520); g.lineTo(x + 18, 300); g.quadraticCurveTo(x + 60, 230, x + 102, 300); g.lineTo(x + 102, 520); g.lineTo(x + 120, 520); g.lineTo(x + 120, 220); } g.fill();
    g.fillRect(560, -40, 160, 190); for (let i = 0; i < 5; i++) { g.beginPath(); g.moveTo(560 + i * 40, -40); g.lineTo(580 + i * 40, -90); g.lineTo(600 + i * 40, -40); g.fill(); }
    g.fillStyle = `rgba(255,210,140,${.5 + .2 * Math.sin(t)})`; g.beginPath(); g.arc(640, 40, 26, 0, TAU); g.fill(); g.fillStyle = N; g.fillRect(638, 22, 4, 20); };

  // chisteras que pasan en fila (los primeros ministros de Eton) y que en d.caen se derrumban como fichas de dominó. d.n, d.en
  D.chisteras = (g, t, d) => { const n = d.n || 20; for (let i = 0; i < n; i++) { const en = (d.en ?? 0) + i * .12; if (t < en) continue; const x = 60 + i * 60, k = pop(t, en, .3);
      const cae = d.caen == null ? 0 : C((t - d.caen - i * .08) / .25), a = 1.4 * cae * cae; g.save(); g.translate(x, 600); g.rotate(a); g.scale(k, k); g.fillStyle = N;
      g.fillRect(-22, -80, 44, 74); g.fillRect(-34, -10, 68, 10); g.fillStyle = '#7a1410'; g.fillRect(-22, -26, 44, 8); g.restore(); } };

  // mesa ovalada de Exeter vista desde arriba: 12 alumnos alrededor y flechas de quién habla con quién (d.flechas: t desde el que aparecen)
  //   d.profesor: el sitio gris del profesor (casi no habla); d.n
  D.mesaOvalada = (g, t, d) => { const n = d.n || 12, cx = d.x || 640, cy = d.y || 360; g.fillStyle = '#5a3a1e'; g.beginPath(); g.ellipse(cx, cy, 330, 150, 0, 0, TAU); g.fill();
    g.fillStyle = '#6e4a28'; g.beginPath(); g.ellipse(cx, cy - 6, 320, 140, 0, 0, TAU); g.fill();
    const p = i => { const a = TAU * i / n; return [cx + 390 * Math.cos(a), cy + 200 * Math.sin(a)]; };
    if (d.flechas != null && t > d.flechas) { const u = t - d.flechas; for (let j = 0; j < Math.min(14, Math.floor(u * 2.2)); j++) { const a = Math.floor(A(j + 3) * n), b = (a + 2 + Math.floor(A(j + 9) * (n - 3))) % n;
      if (a === 0 || b === 0) continue; const [x0, y0] = p(a), [x1, y1] = p(b), v = C((u - j / 2.2) / .5); g.strokeStyle = `rgba(255,220,140,${.85 - .04 * j})`; g.lineWidth = 4; g.beginPath(); g.moveTo(x0, y0);
      g.quadraticCurveTo(cx + (x0 + x1 - 2 * cx) * .1, cy + (y0 + y1 - 2 * cy) * .1, x0 + (x1 - x0) * v, y0 + (y1 - y0) * v); g.stroke(); } }
    for (let i = 0; i < n; i++) { const [x, y] = p(i), habla = d.flechas != null && t > d.flechas && i && Math.sin(t * 3 + i * 2) > .7; g.fillStyle = i === 0 ? '#6b6b6b' : N;
      g.beginPath(); g.arc(x, y, 30, 0, TAU); g.fill(); g.beginPath(); g.ellipse(x, y, 46, 24, Math.atan2(y - cy, x - cx) + Math.PI / 2, 0, TAU); g.fill();
      if (habla) brillo(g, x, y, 60, '255,220,140', .4); } if (d.profesor) { g.fillStyle = '#efe9d6'; texto(g, 'profesor', p(0)[0] + 10, p(0)[1] - 44, 22, 'center', 400); } };

  // estudio de Oxford: estantes de libros, ventana con agujas góticas, lámpara y dos sillones
  D.estudioOxford = (g, t, d) => { pared(g, '#4a2e22', '#2a1810'); for (let s = 0; s < 4; s++) { g.fillStyle = '#2a1810'; g.fillRect(40, 110 + s * 95, 380, 10);
      for (let b = 0; b < 22; b++) { g.fillStyle = ['#6a2a22', '#2c4a3a', '#7a5a2a', '#3a3050', '#8a6a4a'][Math.floor(A(s * 30 + b) * 5)]; const h = 60 + 22 * A(s * 30 + b + 7); g.fillRect(48 + b * 17, 110 + s * 95 - h, 14, h); } }
    ventana(g, 820, 130, 260, 300, '#e8a868', .25); g.fillStyle = 'rgba(30,22,30,.85)'; for (let i = 0; i < 4; i++) { const x = 840 + i * 60; g.fillRect(x, 330, 30, 100); g.beginPath(); g.moveTo(x, 330); g.lineTo(x + 15, 260 - 20 * (i % 2)); g.lineTo(x + 30, 330); g.fill(); }
    brillo(g, 620, 330, 200, '255,200,120', .35); g.fillStyle = N; g.fillRect(612, 340, 16, 260); g.beginPath(); g.moveTo(580, 340); g.lineTo(660, 340); g.lineTo(640, 290); g.lineTo(600, 290); g.fill();
    for (const [x, f] of [[420, 1], [860, -1]]) { g.fillStyle = '#5a1a1a'; g.save(); g.translate(x, 600); g.scale(f, 1); g.beginPath(); g.roundRect(-90, -150, 40, 150, 12); g.fill(); g.fillRect(-90, -70, 180, 50); g.beginPath(); g.roundRect(60, -110, 34, 110, 10); g.fill(); g.restore(); } };

  // aula Waldorf: madera, ventanales con árboles que se mecen, ovillos de lana y plantas; sin pantallas
  D.aulaWaldorf = (g, t, d) => { pared(g, '#c9a878', '#8a6440'); for (let i = 0; i < 30; i++) { g.fillStyle = 'rgba(90,60,30,.18)'; g.fillRect(-300 + i * 70, -100, 4, 570); }
    for (const vx of [120, 520, 920]) { ventana(g, vx, 110, 240, 300, '#bfe0c8', .2); g.save(); g.beginPath(); g.rect(vx, 110, 240, 300); g.clip();
      for (let j = 0; j < 3; j++) { const ax = vx + 40 + j * 80, m = 8 * Math.sin(t * 1.2 + j + vx); g.fillStyle = '#4a6a3a'; g.beginPath(); g.arc(ax + m, 260, 60, 0, TAU); g.fill(); g.fillStyle = '#3a2a1a'; g.fillRect(ax - 6, 280, 12, 140); } g.restore(); }
    for (let i = 0; i < 5; i++) { const x = 260 + i * 190, c = ['#c8504a', '#e0b040', '#5a8ac8', '#6aa860', '#b070b0'][i]; g.fillStyle = c; g.beginPath(); g.arc(x, 586, 16, 0, TAU); g.fill();
      g.strokeStyle = 'rgba(0,0,0,.3)'; g.lineWidth = 2; for (let k = 0; k < 3; k++) { g.beginPath(); g.arc(x, 586, 16, k, k + 2); g.stroke(); } } };

  // el ágora de Atenas al atardecer: templo con columnas, escalinata y arena donde Sócrates dibuja el cuadrado del Menón (d.cuadrado: t)
  D.agora = (g, t, d) => { g.fillStyle = 'rgba(60,30,30,.9)'; g.fillRect(200, 210, 880, 40); g.beginPath(); g.moveTo(180, 212); g.lineTo(640, 120); g.lineTo(1100, 212); g.fill();
    for (let i = 0; i < 8; i++) { const x = 240 + i * 114; g.fillRect(x, 250, 40, 260); g.fillRect(x - 8, 250, 56, 12); g.fillRect(x - 8, 500, 56, 12); g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(x + 8, 262, 5, 236); g.fillStyle = 'rgba(60,30,30,.9)'; }
    for (let s = 0; s < 3; s++) g.fillRect(160 - s * 20, 512 + s * 30, 960 + s * 40, 30);
    g.fillStyle = '#c8a070'; g.fillRect(-400, 600, 2100, 200);
    if (d.cuadrado != null && t > d.cuadrado) { const u = t - d.cuadrado, lado = 120, x0 = d.cx || 760, y0 = 640; g.strokeStyle = '#5a3a1e'; g.lineWidth = 4; g.lineCap = 'round';
      const tramos = [[[x0, y0], [x0 + lado, y0]], [[x0 + lado, y0], [x0 + lado, y0 + 50]], [[x0 + lado, y0 + 50], [x0, y0 + 50]], [[x0, y0 + 50], [x0, y0]], [[x0, y0 + 50], [x0 + lado, y0]]];
      tramos.forEach(([a, b], i) => { const v = C(u * 1.5 - i); if (v <= 0) return; g.strokeStyle = i === 4 ? '#a3140f' : '#5a3a1e'; g.beginPath(); g.moveTo(...a); g.lineTo(a[0] + (b[0] - a[0]) * v, a[1] + (b[1] - a[1]) * v); g.stroke(); }); } };

  // Königsberg, 1784: calle nevada con casas de tejado en punta, farolas de aceite y nieve que cae (d.nieve: cuántos copos)
  D.konigsberg = (g, t, d) => { g.fillStyle = '#e8eef4'; g.fillRect(-400, 590, 2100, 300);
    for (let i = 0; i < 9; i++) { const x = -80 + i * 170, h = 220 + 60 * A(i + 2); g.fillStyle = 'rgba(28,24,40,.95)'; g.fillRect(x, 600 - h, 150, h); g.beginPath(); g.moveTo(x - 6, 600 - h); g.lineTo(x + 75, 600 - h - 80); g.lineTo(x + 156, 600 - h); g.fill();
      g.fillStyle = '#f2f6fa'; g.beginPath(); g.moveTo(x - 6, 600 - h); g.lineTo(x + 75, 600 - h - 80); g.lineTo(x + 75, 600 - h - 66); g.lineTo(x + 6, 600 - h + 4); g.fill();
      for (let w = 0; w < 2; w++) { g.fillStyle = `rgba(255,200,110,${.5 + .2 * Math.sin(t * 2 + i + w)})`; g.fillRect(x + 25 + w * 70, 600 - h + 40, 30, 40); } }
    for (const fx of [300, 820]) { g.fillStyle = N; g.fillRect(fx - 3, 440, 6, 160); g.fillRect(fx - 14, 420, 28, 26); brillo(g, fx, 432, 80, '255,190,90', .5 + .1 * Math.sin(t * 7 + fx)); }
    for (let i = 0; i < (d.nieve ?? 90); i++) { const u = ((t * (.08 + .05 * A(i + 3)) + A(i)) % 1), x = 1400 * A(i + 7) - 60 + 30 * Math.sin(t + i) + 40 * u, y = -40 + 680 * u;
      g.fillStyle = 'rgba(255,255,255,.85)'; g.beginPath(); g.arc(x, y, 1.5 + 2 * A(i + 9), 0, TAU); g.fill(); } };

  // bosque de Estonia con nieve y, en medio, el aula de cristal iluminada (d.aula: 0–1, se enciende)
  D.bosqueNieve = (g, t, d) => { g.fillStyle = '#e8eef4'; g.fillRect(-400, 580, 2100, 300);
    const pino = (x, y, h, c) => { g.fillStyle = c; for (let k = 0; k < 4; k++) { const w = h * (.42 - .08 * k), yy = y - h * .22 * k; g.beginPath(); g.moveTo(x - w, yy); g.lineTo(x, yy - h * .42); g.lineTo(x + w, yy); g.fill();
      g.fillStyle = 'rgba(255,255,255,.8)'; g.beginPath(); g.moveTo(x - w * .5, yy - h * .2); g.lineTo(x, yy - h * .42); g.lineTo(x + w * .5, yy - h * .2); g.fill(); g.fillStyle = c; } };
    for (let i = 0; i < 14; i++) pino(-60 + i * 105, 560, 200 + 60 * A(i), 'rgba(30,50,46,.6)');
    const a = val(d.aula, t, 1); if (a > 0) { g.globalAlpha = a; g.fillStyle = 'rgba(200,230,255,.35)'; g.fillRect(470, 380, 340, 210); brillo(g, 640, 480, 300, '255,230,160', .45);
      g.fillStyle = N; g.fillRect(462, 372, 356, 10); g.fillRect(462, 586, 356, 8); for (let k = 0; k < 5; k++) g.fillRect(466 + k * 84, 380, 6, 210); g.globalAlpha = 1; }
    for (let i = 0; i < 10; i++) pino(-20 + i * 150 + 75 * (i % 2), 640, 260 + 40 * A(i + 20), 'rgba(16,26,24,.95)');
    for (let i = 0; i < 70; i++) { const u = ((t * (.07 + .04 * A(i + 3)) + A(i)) % 1); g.fillStyle = 'rgba(255,255,255,.9)'; g.beginPath(); g.arc(1400 * A(i + 7) - 60 + 30 * Math.sin(t + i), -40 + 680 * u, 1.5 + 2 * A(i + 9), 0, TAU); g.fill(); } };

  // ---------- los datos ----------
  // dos campanas de Gauss: la clase normal y la del tutor, que se desplaza d.sigma desviaciones (curva) y se ve qué parte de la normal queda por debajo
  D.campanaGauss = (g, t, d) => { if (t < (d.en ?? 0)) return; const x0 = d.x || 640, y0 = d.y || 520, s = 110, sig = val(d.sigma, t, 0), k = pop(t, d.en ?? 0, .6);
    g.fillStyle = 'rgba(239,233,214,.95)'; g.fillRect(x0 - 560, y0 - 330, 1120, 400); g.strokeStyle = N; g.lineWidth = 3; g.beginPath(); g.moveTo(x0 - 520, y0); g.lineTo(x0 + 520, y0); g.stroke();
    const curva = (m, col, rel) => { g.beginPath(); g.moveTo(x0 - 520, y0); for (let x = -520; x <= 520; x += 6) { const z = (x - m * s) / s; g.lineTo(x0 + x, y0 - 240 * k * Math.exp(-z * z / 2)); } g.lineTo(x0 + 520, y0);
      if (rel) { g.fillStyle = col; g.fill(); } else { g.strokeStyle = col; g.lineWidth = 5; g.stroke(); } };
    g.save(); g.beginPath(); g.rect(x0 - 520, y0 - 300, 520 + sig * s, 300); g.clip(); curva(0, 'rgba(90,90,100,.35)', true); g.restore();   // la parte de la clase que el tutor supera
    curva(0, '#3a3a44'); curva(sig, '#a3140f'); g.strokeStyle = '#a3140f'; g.setLineDash([8, 8]); g.lineWidth = 2; g.beginPath(); g.moveTo(x0 + sig * s, y0); g.lineTo(x0 + sig * s, y0 - 250); g.stroke(); g.setLineDash([]);
    g.fillStyle = '#3a3a44'; texto(g, 'clase normal (30 alumnos)', x0 - 250, y0 + 44, 24, 'center', 400); g.fillStyle = '#a3140f'; texto(g, 'con tutor', x0 + sig * s + 90, y0 - 260, 26);
    if (d.cifra && t > d.cifra[0]) { g.fillStyle = '#a3140f'; texto(g, d.cifra[1], x0 - 330, y0 - 250, 46 * pop(t, d.cifra[0], .4)); } };

  // tiza que escribe en la pizarra (d.lineas: [[t, texto, color?]]), con la mano que la mueve y polvo; d.tapado: [t0, t1] trapo que tapa la última línea
  //   d.tacha: t en que se tacha la línea d.tachaLinea en rojo
  D.tiza = (g, t, d) => { const x = d.x || 640, y = d.y || 300, w = d.ancho || 820, h = d.alto || 330; g.fillStyle = '#4a2e18'; g.fillRect(x - w / 2 - 16, y - h / 2 - 16, w + 32, h + 32);
    g.fillStyle = '#1f3a2c'; g.fillRect(x - w / 2, y - h / 2, w, h); g.fillStyle = 'rgba(255,255,255,.04)'; for (let i = 0; i < 9; i++) g.fillRect(x - w / 2 + w * A(i), y - h / 2 + h * A(i + 4), 140, 40);
    let mano = null; (d.lineas || []).forEach(([en, s, col], i) => { if (t < en) return; const yy = y - h / 2 + 70 + i * (d.paso || 66), tam = d.tam || 40; g.font = `italic 700 ${tam}px Georgia, serif`;
      const ancho = g.measureText(s).width, v = C((t - en) / Math.max(.6, s.length * .045)); g.save(); g.beginPath(); g.rect(x - ancho / 2 - 10, yy - tam, (ancho + 20) * v, tam * 1.4); g.clip();
      g.fillStyle = col || '#efe9d6'; g.textAlign = 'center'; g.fillText(s, x, yy); g.restore(); if (v < 1) mano = [x - ancho / 2 + ancho * v, yy - 8];
      if (d.tacha != null && i === d.tachaLinea && t > d.tacha) { const u = C((t - d.tacha) / .4); g.strokeStyle = '#d23a2a'; g.lineWidth = 6; g.beginPath(); g.moveTo(x - ancho / 2 - 10, yy - 12); g.lineTo(x - ancho / 2 - 10 + (ancho + 20) * u, yy - 18); g.stroke(); }
      if (d.tapado && i === (d.lineas.length - 1) && t > d.tapado[0] && t < d.tapado[1] + .6) { const q = t > d.tapado[1] ? S((t - d.tapado[1]) / .6) : 0; g.fillStyle = '#b8a888';
        g.save(); g.translate(x, yy - 14 + 400 * q * q); g.rotate(.05 + .5 * q); g.beginPath(); g.moveTo(-ancho / 2 - 30, -32); g.lineTo(ancho / 2 + 30, -26); g.lineTo(ancho / 2 + 24, 34); g.lineTo(-ancho / 2 - 24, 30); g.fill(); g.restore(); } });
    if (mano) { const [mx, my] = mano; g.fillStyle = '#f4f0e0'; g.fillRect(mx - 3, my - 16, 8, 20); g.fillStyle = N; g.beginPath(); g.ellipse(mx + 22, my + 14, 24, 14, -.5, 0, TAU); g.fill(); g.fillRect(mx + 30, my + 16, 90, 22);
      for (let i = 0; i < 4; i++) { g.fillStyle = 'rgba(240,240,230,.6)'; g.beginPath(); g.arc(mx + 8 * A(i + Math.floor(t * 20)), my + 10 + 30 * A(i + 3 + Math.floor(t * 20)), 1.6, 0, TAU); g.fill(); } } };

  // birretes que caen sobre los pupitres (d.en, d.n, d.rotulos: textos sobre cada uno)
  D.birretes = (g, t, d) => { (d.rotulos || ['HARVARD', 'MIT', 'PRINCETON']).forEach((r, i) => { const en = (d.en ?? 0) + i * .5; if (t < en) return; const u = C((t - en) / .7), y = -80 + (d.y || 430) * T.rebote(u, 1.6), x = (d.x || 640) + (i - 1) * 260;
    g.save(); g.translate(x, y); g.rotate(.3 * Math.sin(t * 2 + i) * (1 - u)); g.fillStyle = N; g.beginPath(); g.moveTo(-70, 0); g.lineTo(0, -26); g.lineTo(70, 0); g.lineTo(0, 26); g.fill(); g.fillRect(-36, 6, 72, 30);
    g.strokeStyle = '#d8b040'; g.lineWidth = 3; g.beginPath(); g.moveTo(0, 0); g.lineTo(48, 14); g.lineTo(52, 50 + 4 * Math.sin(t * 5)); g.stroke(); g.fillStyle = '#efe9d6'; texto(g, r, 0, 76, 24); g.restore(); }); };

  // reglamento con su sello de cera: el papel se desenrolla en d.en y cada palabra de d.items se enciende en su t (d.items: [[t, texto]])
  D.pergamino = (g, t, d) => { if (t < (d.en ?? 0)) return; const x = d.x || 640, y = d.y || 320, w = d.ancho || 420, k = S(C((t - d.en) / .7)), h = (d.alto || 360) * k;
    g.fillStyle = '#e9d8ae'; g.fillRect(x - w / 2, y - h / 2, w, h); g.fillStyle = '#c8b080'; g.beginPath(); g.ellipse(x, y - h / 2, w / 2 + 10, 12, 0, 0, TAU); g.fill(); g.beginPath(); g.ellipse(x, y + h / 2, w / 2 + 10, 12, 0, 0, TAU); g.fill();
    if (k < 1) return; g.fillStyle = N; texto(g, d.titulo || '', x, y - h / 2 + 52, 28); g.fillStyle = 'rgba(0,0,0,.18)'; for (let i = 0; i < 6; i++) g.fillRect(x - w / 2 + 40, y - h / 2 + 80 + i * 18, w - 80 - 60 * A(i), 4);
    (d.items || []).forEach(([en, s], i) => { if (t < en) return; const p = pop(t, en, .4); g.fillStyle = '#7a1410'; g.save(); g.translate(x - w / 2 + 60 + (i % 2) * (w / 2 - 20), y + 10 + Math.floor(i / 2) * 50); g.scale(p, p); texto(g, '• ' + s, 0, 0, 26, 'left'); g.restore(); });
    if (d.casillas) for (let i = 0; i < d.casillas; i++) { const cx = x - w / 2 + 50 + (i % 5) * ((w - 100) / 4), cy = y - 10 + Math.floor(i / 5) * 46, on = t > (d.marca ?? 1e9) + i * .08; g.strokeStyle = N; g.lineWidth = 3; g.strokeRect(cx - 14, cy - 14, 28, 28);
      if (on) { g.strokeStyle = '#7a1410'; g.lineWidth = 4; g.beginPath(); g.moveTo(cx - 9, cy); g.lineTo(cx - 2, cy + 8); g.lineTo(cx + 11, cy - 10); g.stroke(); } }
    if (d.sello != null && t > d.sello) { const p = pop(t, d.sello, .35); g.save(); g.translate(x + w / 2 - 60, y + h / 2 - 50); g.scale(p * 1.4 - .4 * Math.min(1, p), p * 1.4 - .4 * Math.min(1, p)); g.fillStyle = '#9a1a12';
      g.beginPath(); for (let i = 0; i < 14; i++) { const a = TAU * i / 14, r = 40 + 6 * (i % 2); g.lineTo(r * Math.cos(a), r * Math.sin(a)); } g.fill(); g.fillStyle = '#c84a3a'; g.beginPath(); g.arc(0, 0, 26, 0, TAU); g.fill(); g.restore(); } };

  // el bombo de la oposición: gira con sus bolas y suelta una en cada t de d.saca, que rueda con su número
  D.bombo = (g, t, d) => { const x = d.x || 500, y = d.y || 380, r = 150, giro = t * 2.2; g.fillStyle = N; g.fillRect(x - 10, y, 20, 220); g.fillRect(x - 110, y + 210, 220, 14);
    g.strokeStyle = '#c9a050'; g.lineWidth = 6; g.beginPath(); g.arc(x, y, r, 0, TAU); g.stroke(); for (let i = 0; i < 6; i++) { const a = giro + i * TAU / 6; g.beginPath(); g.moveTo(x + r * Math.cos(a), y + r * Math.sin(a)); g.lineTo(x - r * Math.cos(a), y - r * Math.sin(a)); g.stroke(); }
    for (let i = 0; i < 40; i++) { const a = giro * (1 + .2 * A(i)) + TAU * A(i + 4), rr = r * .85 * Math.sqrt(A(i + 8)); g.fillStyle = '#efe9d6'; g.beginPath(); g.arc(x + rr * Math.cos(a), y + rr * Math.sin(a) * .9 + 30, 11, 0, TAU); g.fill(); }
    (d.saca || []).forEach(([en, n], i) => { if (t < en) return; const u = C((t - en) / 1), bx = x + r + 40 + 260 * u + i * 80, by = y + 200 - 120 * Math.abs(Math.sin(u * 7)) * (1 - u);
      g.fillStyle = '#efe9d6'; g.beginPath(); g.arc(bx, by, 26, 0, TAU); g.fill(); g.strokeStyle = N; g.lineWidth = 3; g.stroke(); g.fillStyle = N; texto(g, String(n), bx, by + 10, 26); }); };

  // pila de leyes: un libro por ley cae sobre la mesa del profesor en su t y la mesa se dobla con el peso (d.leyes: [[t, nombre]])
  D.pilaLeyes = (g, t, d) => { const x = d.x || 640, y = d.y || 600, cayo = (d.leyes || []).filter(([en]) => t > en + .35).length, comba = 6 * cayo;
    g.fillStyle = '#4a3020'; g.beginPath(); g.moveTo(x - 220, y - 150); g.quadraticCurveTo(x, y - 150 + 2 * comba, x + 220, y - 150); g.lineTo(x + 220, y - 128); g.quadraticCurveTo(x, y - 128 + 2 * comba, x - 220, y - 128); g.fill();
    g.fillStyle = N; g.save(); g.translate(x - 200, y - 128); g.rotate(-.003 * comba); g.fillRect(0, 0, 16, 128); g.restore(); g.save(); g.translate(x + 184, y - 128); g.rotate(.003 * comba); g.fillRect(0, 0, 16, 128); g.restore();
    (d.leyes || []).forEach(([en, s], i) => { if (t < en) return; const u = C((t - en) / .35), yy = -100 + (y - 150 + comba - 26 * i - 13 + 100) * u * u, cols = ['#7a1410', '#1f3f7a', '#2c5a2c', '#7a5a14', '#4a2a5a', '#14505a', '#6a3a1a', '#3a3a3a'];
      g.save(); g.translate(x + 14 * Math.sin(i * 2.3), yy); g.rotate(.06 * Math.sin(i * 1.7)); g.fillStyle = cols[i % 8]; g.fillRect(-120, -13, 240, 26); g.fillStyle = '#efe9d6'; g.fillRect(-120, -13, 10, 26); texto(g, s, 6, 8, 20); g.restore(); }); };

  // puerta del colegio con el lema en piedra. En d.gira la tinta da la vuelta a las palabras (d.lema → d.lema2)
  D.puertaColegio = (g, t, d) => { const x = d.x || 640; g.fillStyle = 'rgba(40,32,40,.95)'; g.fillRect(x - 330, 140, 660, 460); g.fillStyle = '#5a3a1e'; g.beginPath(); g.moveTo(x - 120, 600); g.lineTo(x - 120, 360); g.arc(x, 360, 120, Math.PI, 0); g.lineTo(x + 120, 600); g.fill();
    g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(x - 3, 250, 6, 350); g.fillStyle = '#c9a050'; g.beginPath(); g.arc(x - 26, 480, 7, 0, TAU); g.arc(x + 26, 480, 7, 0, TAU); g.fill();
    g.fillStyle = '#d8c8a8'; g.fillRect(x - 300, 170, 600, 70); const k = d.gira == null ? 0 : C((t - d.gira) / 1.4), a = k < .5 ? d.lema : d.lema2, e = Math.abs(Math.cos(Math.PI * k));
    g.save(); g.translate(x, 218); g.scale(1, Math.max(.05, e)); g.fillStyle = k > 0 && k < 1 ? '#3a2a20' : '#2a1a10'; texto(g, a || '', 0, 0, 40, 'center', 700, 'Georgia, serif'); g.restore();
    if (k > 0 && k < 1) for (let i = 0; i < 18; i++) { const u = (k + A(i)) % 1; g.fillStyle = N; g.beginPath(); g.arc(x - 280 + 560 * A(i + 3) + 60 * u, 205 - 60 * Math.sin(Math.PI * u), 3 + 3 * A(i + 5), 0, TAU); g.fill(); } };

  // vaso que rebosa y leño que prende (Plutarco): d.prende: t en que salta la chispa
  D.vasoLena = (g, t, d) => { const x = d.x || 640, y = d.y || 600; g.save(); g.translate(x - 220, y); g.strokeStyle = '#d8e4ee'; g.lineWidth = 6; g.beginPath(); g.moveTo(-70, -260); g.lineTo(-56, 0); g.lineTo(56, 0); g.lineTo(70, -260); g.stroke();
    g.fillStyle = 'rgba(120,170,220,.7)'; g.beginPath(); g.moveTo(-68, -250); g.lineTo(-56, 0); g.lineTo(56, 0); g.lineTo(68, -250); g.fill();
    for (let i = 0; i < 6; i++) { const u = (t * .8 + i / 6) % 1, lado = i % 2 ? 1 : -1; g.fillStyle = 'rgba(120,170,220,.7)'; g.beginPath(); g.ellipse(lado * (72 + 30 * u), -250 + 250 * u * u, 5, 9, 0, 0, TAU); g.fill(); } g.restore();
    g.save(); g.translate(x + 220, y); g.fillStyle = '#5a3a1e'; g.save(); g.rotate(-.2); g.fillRect(-100, -30, 200, 34); g.restore(); g.save(); g.rotate(.25); g.fillRect(-90, -40, 180, 30); g.restore();
    if (d.prende != null && t > d.prende) { const f = C((t - d.prende) / 1.2); brillo(g, 0, -90, 200 * f, '255,160,60', .6);
      for (let i = 0; i < 9; i++) { const h = (90 + 60 * A(i)) * f * (.8 + .2 * Math.sin(t * 11 + i)), w = 22 + 10 * A(i + 3); g.fillStyle = i % 3 ? '#f08a2a' : '#ffd060'; g.beginPath(); g.moveTo(-60 + i * 15 - w / 2, -30); g.quadraticCurveTo(-60 + i * 15 + 10 * Math.sin(t * 6 + i), -30 - h, -60 + i * 15 + w / 2, -30); g.fill(); } }
    else if (d.prende != null && t > d.prende - .4) { g.fillStyle = '#ffd060'; g.beginPath(); g.arc(-160 + 160 * C((t - d.prende + .4) / .4), -80, 6, 0, TAU); g.fill(); } g.restore(); };

  // dos mochilas: el método (libros) y el dinero y los contactos; la segunda pesa más y se hunde (d.pesa: t)
  D.mochilas = (g, t, d) => { const x = d.x || 640, y = d.y || 560, h = d.pesa == null ? 0 : 40 * S(C((t - d.pesa) / .8));
    [[x - 220, -h * .3, '#2c4a6a', 'MÉTODO'], [x + 220, h, '#6a4a14', 'DINERO Y CONTACTOS']].forEach(([mx, dy, c, r], i) => { g.save(); g.translate(mx, y + dy); g.fillStyle = c; g.beginPath(); g.roundRect(-90, -200, 180, 200, 30); g.fill();
      g.fillStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.roundRect(-70, -110, 140, 80, 16); g.fill(); g.strokeStyle = c; g.lineWidth = 10; g.beginPath(); g.arc(0, -200, 40, Math.PI, 0); g.stroke();
      if (i === 0) for (let b = 0; b < 4; b++) { g.fillStyle = ['#efe9d6', '#a3140f', '#efe9d6', '#2c5a2c'][b]; g.fillRect(-50 + b * 26, -250 + 6 * b, 20, 60); }
      else for (let m = 0; m < 9; m++) { g.fillStyle = m % 3 ? '#e0b040' : '#efe9d6'; if (m % 3) { g.beginPath(); g.arc(-50 + m * 12, -214 - 8 * (m % 2), 12, 0, TAU); g.fill(); } else g.fillRect(-56 + m * 12, -236, 34, 22); }
      g.fillStyle = '#efe9d6'; texto(g, r, 0, 44, 24); g.restore(); }); };

  // barca con dos remos: «memoria» y «pensar». d.solo: hasta ese t rema con un remo y gira en círculos; después, con los dos, avanza recta
  D.barcaRemos = (g, t, d) => { g.fillStyle = 'rgba(30,60,90,.95)'; g.fillRect(-400, 450, 2100, 400); for (let i = 0; i < 30; i++) { g.fillStyle = 'rgba(255,255,255,.15)'; g.fillRect(-200 + 60 * i + 20 * Math.sin(t + i), 470 + 120 * A(i), 40, 3); }
    const solo = t < (d.solo ?? 0), u = solo ? 0 : t - (d.solo ?? 0), ang = solo ? t * .9 : (d.solo ?? 0) * .9 * 0, x = (d.x || 640) + (solo ? 120 * Math.cos(t * .9) : -120 + 120 * u), y = 540 + (solo ? 50 * Math.sin(t * .9) : 0);
    g.save(); g.translate(x, y); g.rotate(solo ? t * .9 + Math.PI / 2 : 0); g.fillStyle = N; g.beginPath(); g.ellipse(0, 0, 130, 34, 0, 0, TAU); g.fill(); g.fillStyle = '#5a3a1e'; g.fillRect(-20, -30, 40, 60);
    const rema = Math.sin(t * 4); for (const [lado, txt, on] of [[-1, 'memoria', true], [1, 'pensar', !solo]]) { if (!on) continue; g.save(); g.translate(0, lado * 30); g.rotate(lado * (.6 + .4 * rema)); g.fillStyle = '#c9a070'; g.fillRect(-6, 0, 12 * 1, lado * 150); g.restore();
      g.fillStyle = '#efe9d6'; texto(g, txt, 0, lado * 70 + 8, 22); } g.restore(); };

  // dos cabezas de perfil (Montaigne): una rebosa de papeles; la otra tiene engranajes que giran
  D.cabezas = (g, t, d) => { const y = d.y || 420; [[400, false], [880, true]].forEach(([x, bien]) => { g.save(); g.translate(x, y); g.fillStyle = N; g.beginPath(); g.moveTo(-80, 160); g.lineTo(-90, 40); g.quadraticCurveTo(-110, -150, 20, -150);
      g.quadraticCurveTo(130, -150, 120, -20); g.lineTo(150, 20); g.lineTo(118, 40); g.lineTo(122, 80); g.quadraticCurveTo(90, 110, 40, 110); g.lineTo(40, 160); g.fill();
      if (!bien) for (let i = 0; i < 14; i++) { const u = (t * .5 + A(i)) % 1; g.save(); g.translate(-40 + 120 * A(i + 3), -150 - 80 * u); g.rotate(t + i); g.fillStyle = `rgba(239,233,214,${1 - u})`; g.fillRect(-14, -18, 28, 36); g.restore(); }
      else for (const [gx, gy, r, s] of [[0, -60, 38, 1], [50, -10, 26, -1.4], [-40, -10, 22, -1.7]]) { g.save(); g.translate(gx, gy); g.rotate(t * s); g.fillStyle = '#c9a050'; g.beginPath();
        for (let k = 0; k < 16; k++) { const a = TAU * k / 16, rr = k % 2 ? r : r + 8; g.lineTo(rr * Math.cos(a), rr * Math.sin(a)); } g.fill(); g.fillStyle = N; g.beginPath(); g.arc(0, 0, r * .35, 0, TAU); g.fill(); g.restore(); }
      g.fillStyle = '#efe9d6'; texto(g, bien ? 'BIEN HECHA' : 'BIEN LLENA', 20, 210, 28); g.restore(); }); };

  // mapa de la URSS que se resquebraja y Estonia se separa (d.rompe: t)
  D.mapaURSS = (g, t, d) => { const k = d.rompe == null ? 0 : S(C((t - d.rompe) / 1.2)); g.fillStyle = '#7a1f1f'; g.beginPath(); const m = [[260, 220], [520, 160], [880, 150], [1140, 200], [1180, 320], [1000, 420], [700, 430], [420, 420], [300, 360]];
    g.moveTo(...m[0]); for (const p of m) g.lineTo(...p); g.closePath(); g.fill(); g.strokeStyle = 'rgba(0,0,0,.5)'; g.lineWidth = 3; for (let i = 0; i < 8 * k; i++) { g.beginPath(); g.moveTo(300 + 100 * i, 160 + 30 * A(i)); g.lineTo(320 + 100 * i + 30 * A(i + 2), 420); g.stroke(); }
    g.save(); g.translate(-160 * k, -40 * k); g.fillStyle = k > .5 ? '#3a6ab0' : '#7a1f1f'; g.beginPath(); g.moveTo(250, 200); g.lineTo(300, 190); g.lineTo(310, 220); g.lineTo(260, 232); g.fill();
    if (k > .5) { g.fillStyle = '#efe9d6'; texto(g, 'ESTONIA · 1991', 280, 270, 26); } g.restore(); };
})();
