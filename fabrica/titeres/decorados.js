// Decorados reutilizables del teatro de sombras. Cada uno es una función (g, t, d) que dibuja en coordenadas de la escena
// (1280×720, suelo en y = 600). En la escena se ponen en `decorado: [{tipo, par, ...}]`; `par` es el parallax
// (0,2 = muy lejos, 1 = en el plano de los títeres). `tono`: 0 = negro, 1 = casi el color del pergamino (lejanía).
(() => {
  const D = T.DECORADOS, A = T.azar, N = T.NEGRO, TAU = T.TAU;
  const color = d => d.tono ? `rgba(${Math.round(11 + 70 * d.tono)},${Math.round(7 + 45 * d.tono)},${Math.round(5 + 25 * d.tono)},${1 - .45 * d.tono})` : N;
  const hueco = (g, f) => { g.save(); g.globalCompositeOperation = 'destination-out'; g.beginPath(); f(); g.fill(); g.restore(); };

  D.suelo = (g, t, d) => {                       // tablas del escenario con matas que se mecen
    const y = d.y || 600; g.fillStyle = color(d); g.beginPath(); g.moveTo(-400, y + 4);
    for (let x = -400; x <= 3800; x += 30) g.lineTo(x, y + 4 + 3 * Math.sin(x * .07)); g.lineTo(3800, 1400); g.lineTo(-400, 1400); g.fill();   // ancho para los planos que la cámara recorre
    g.strokeStyle = color(d); g.lineWidth = 2.5;
    for (let i = 0; i < (d.matas ?? 12); i++) { const x = -100 + i * 130 + 40 * A(i), h = 14 + 16 * A(i + 4), w = .2 * Math.sin(t * 1.8 + i);
      for (let k = -2; k <= 2; k++) { g.beginPath(); g.moveTo(x + k * 5, y + 6); g.quadraticCurveTo(x + k * 7 + w * 20, y - h / 2, x + k * 10 + w * 40, y - h + Math.abs(k) * 4); g.stroke(); } }
  };
  D.colinas = (g, t, d) => { g.fillStyle = color(d); g.beginPath(); const y = d.y || 520; g.moveTo(-400, y + 40);
    for (let x = -400; x <= 1700; x += 40) g.lineTo(x, y - (d.alto || 40) * Math.sin(x / 210 + (d.s || 0)) - 20 * Math.sin(x / 90)); g.lineTo(1700, 900); g.lineTo(-400, 900); g.fill(); };
  D.montes = (g, t, d) => { g.fillStyle = color(d); g.beginPath(); const y = d.y || 520; g.moveTo(-400, 900);
    for (let i = 0; i <= 14; i++) { const x = -400 + i * 150; g.lineTo(x, y - (i % 2 ? 140 + 80 * A(i) : 40 * A(i + 3))); } g.lineTo(1700, 900); g.fill(); };
  D.ciudad = (g, t, d) => {                      // perfil de ciudad con torres, cúpulas y ventanas que se encienden
    const y = d.y || 560, s = d.s || 1; let x = -300;
    for (let i = 0; x < 1600; i++) {
      const w = 50 + 70 * A(i * 3 + s), h = 90 + 180 * A(i * 3 + 1 + s), r = A(i * 3 + 2 + s); g.fillStyle = color(d);
      g.fillRect(x, y - h, w, h);
      if (r < .2) { g.beginPath(); g.arc(x + w / 2, y - h, w * .42, Math.PI, 0); g.fill(); g.fillRect(x + w / 2 - 2, y - h - w * .42 - 22, 4, 22); }
      else if (r < .35) { g.beginPath(); g.moveTo(x + w * .2, y - h); g.lineTo(x + w / 2, y - h - 70); g.lineTo(x + w * .8, y - h); g.fill(); }
      else if (r < .5) { g.fillRect(x + w * .3, y - h - 26, w * .4, 26); g.beginPath(); g.moveTo(x + w * .25, y - h - 26); g.lineTo(x + w / 2, y - h - 50); g.lineTo(x + w * .75, y - h - 26); g.fill(); }
      g.fillStyle = `rgba(255,214,140,${.18 + .12 * (d.tono ? 0 : 1)})`;
      for (let fy = y - h + 14; fy < y - 16; fy += 22) for (let fx = x + 8; fx < x + w - 10; fx += 16) if (A(fx * 7 + fy) < .35 && Math.sin(t * .3 + fx) > -.6) g.fillRect(fx, fy, 6, 9);
      x += w + 6 + 20 * A(i + 50);
    }
  };
  D.congreso = (g, t, d) => {                    // fachada con escalinata, columnas, frontón y dos leones
    const x = d.x || 640, y = d.y || 600, e = d.escala || 1; g.save(); g.translate(x, y); g.scale(e, e); g.fillStyle = color(d);
    for (let i = 0; i < 4; i++) g.fillRect(-260 + i * 12, -18 * (i + 1), 520 - i * 24, 18);
    g.fillRect(-230, -262, 460, 22); g.beginPath(); g.moveTo(-250, -262); g.lineTo(0, -350); g.lineTo(250, -262); g.fill();
    for (let i = 0; i < 6; i++) { const cx = -190 + i * 76; g.fillRect(cx - 14, -240, 28, 168); g.fillRect(cx - 20, -246, 40, 10); g.fillRect(cx - 20, -82, 40, 10); }
    hueco(g, () => { g.moveTo(-160, -270); g.lineTo(0, -330); g.lineTo(160, -270); g.closePath(); });
    g.beginPath(); g.moveTo(-120, -275); g.lineTo(0, -320); g.lineTo(120, -275); g.closePath(); g.fill();
    for (const lado of [-1, 1]) { g.save(); g.translate(lado * 330, -20); g.scale(lado, 1);   // león
      g.beginPath(); g.ellipse(0, -40, 55, 26, 0, 0, TAU); g.fill(); g.beginPath(); g.arc(-50, -70, 30, 0, TAU); g.fill();
      g.fillRect(-60, -30, 14, 30); g.fillRect(30, -30, 14, 30); g.fillRect(-80, 0, 150, 14);
      g.beginPath(); g.moveTo(50, -50); g.quadraticCurveTo(90, -60, 80, -100); g.lineTo(84, -100); g.quadraticCurveTo(96, -56, 52, -42); g.fill(); g.restore(); }
    g.restore();
  };
  D.arbol = (g, t, d) => {                       // tronco y copa calada que se mece
    const x = d.x, y = d.y || 600, e = d.escala || 1, s = d.s || x; g.save(); g.translate(x, y); g.scale(e, e); g.rotate(.02 * Math.sin(t * .8 + s)); g.fillStyle = color(d);
    g.beginPath(); g.moveTo(-14, 0); g.quadraticCurveTo(-8, -90, -18, -170); g.lineTo(14, -170); g.quadraticCurveTo(6, -90, 14, 0); g.fill();
    for (let i = 0; i < 9; i++) { const a = A(s + i), b = A(s + i + 20); g.beginPath(); g.arc(-70 + 140 * a + 6 * Math.sin(t + i), -170 - 90 * b, 38 + 22 * A(s + i + 40), 0, TAU); g.fill(); }
    hueco(g, () => { for (let i = 0; i < 14; i++) { const a = A(s + i + 60), b = A(s + i + 80); g.moveTo(-60 + 120 * a + 5, -150 - 110 * b); g.ellipse(-60 + 120 * a, -150 - 110 * b, 5, 3, a * 3, 0, TAU); } });
    g.restore();
  };
  D.farola = (g, t, d) => { const x = d.x, y = d.y || 600; g.fillStyle = color(d); g.fillRect(x - 4, y - 240, 8, 240); g.fillRect(x - 14, y - 12, 28, 12);
    g.beginPath(); g.moveTo(x - 18, y - 240); g.lineTo(x + 18, y - 240); g.lineTo(x + 12, y - 280); g.lineTo(x - 12, y - 280); g.closePath(); g.fill(); g.fillRect(x - 20, y - 286, 40, 8);
    g.fillStyle = `rgba(255,214,140,${.55 + .1 * Math.sin(t * 9 + x)})`; g.fillRect(x - 9, y - 272, 18, 26); };
  D.atril = (g, t, d) => { const x = d.x, y = d.y || 600; g.fillStyle = color(d);
    g.beginPath(); g.moveTo(x - 50, y - 150); g.lineTo(x + 50, y - 160); g.lineTo(x + 34, y); g.lineTo(x - 34, y); g.closePath(); g.fill();
    hueco(g, () => { g.moveTo(x + 22, y - 110); g.arc(x, y - 110, 22, 0, TAU); g.moveTo(x + 12, y - 110); g.arc(x, y - 110, 12, 0, TAU); });
    g.beginPath(); g.arc(x, y - 110, 9, 0, TAU); g.fill();
    g.lineWidth = 3; g.strokeStyle = color(d); g.beginPath(); g.moveTo(x - 30, y - 152); g.quadraticCurveTo(x - 50, y - 190, x - 70, y - 196); g.stroke(); g.beginPath(); g.ellipse(x - 74, y - 198, 7, 5, .4, 0, TAU); g.fill(); };
  D.bandera = (g, t, d) => { const x = d.x, y = d.y || 600, h = d.alto || 330; g.fillStyle = color(d); g.fillRect(x - 4, y - h, 8, h); g.beginPath(); g.arc(x, y - h, 9, 0, TAU); g.fill();
    T.tela(g, x + 4, y - h + 10, d.ancho || 170, d.tela || 105, t, d.lado || 1); };
  D.urna = (g, t, d) => { const x = d.x, y = d.y || 600, e = d.escala || 1; g.save(); g.translate(x, y); g.scale(e, e); g.fillStyle = color(d);
    g.fillRect(-60, -110, 120, 110); g.fillRect(-70, -122, 140, 14); hueco(g, () => g.rect(-30, -118, 60, 6)); hueco(g, () => g.rect(-44, -88, 88, 60)); g.fillRect(-36, -80, 72, 44);
    hueco(g, () => { g.rect(-30, -74, 60, 4); g.rect(-30, -64, 46, 4); g.rect(-30, -54, 52, 4); }); g.restore(); };
  D.mesa = (g, t, d) => { const x = d.x, y = d.y || 600, w = d.ancho || 260; g.fillStyle = color(d); g.fillRect(x - w / 2, y - 92, w, 14); g.fillRect(x - w / 2 + 14, y - 80, 12, 80); g.fillRect(x + w / 2 - 26, y - 80, 12, 80);
    hueco(g, () => { for (let i = 0; i < 5; i++) g.rect(x - w / 2 + 20 + i * (w - 40) / 5, y - 88, 14, 6); }); };
  D.saco = (g, t, d) => {                       // saco de monedas con el símbolo del euro; `crece` lo hincha con el tiempo
    const x = d.x, y = d.y || 600, e = (d.escala || 1) * (1 + (d.crece || 0) * T.suave((t - (d.en ?? 0)) / 2)); g.save(); g.translate(x, y); g.scale(e, e); g.fillStyle = color(d);
    g.beginPath(); g.moveTo(-14, -78); g.quadraticCurveTo(-58, -60, -50, -18); g.quadraticCurveTo(-44, 0, 0, 0); g.quadraticCurveTo(44, 0, 50, -18); g.quadraticCurveTo(58, -60, 14, -78); g.closePath(); g.fill();
    g.fillRect(-16, -90, 32, 12); g.beginPath(); g.moveTo(-10, -90); g.lineTo(-22, -104); g.lineTo(0, -96); g.lineTo(22, -104); g.lineTo(10, -90); g.fill();
    hueco(g, () => { g.font = '700 46px Georgia, serif'; g.textAlign = 'center'; g.fillText('€', 0, -20); g.textAlign = 'left'; }); g.restore(); };
  D.horizonte = (g, t, d) => {                  // llanura nocturna con el horizonte encendido y brasas, y torres lejanas
    const y = d.y || 520, gr = g.createLinearGradient(0, y - 70, 0, y + 30); gr.addColorStop(0, 'rgba(255,90,40,0)'); gr.addColorStop(.7, `rgba(255,96,48,${.55 + .1 * Math.sin(t * 3)})`); gr.addColorStop(1, 'rgba(255,150,70,.9)');
    g.fillStyle = gr; g.fillRect(-400, y - 70, 2100, 100);
    g.fillStyle = N; for (let i = 0; i < 60; i++) { const x = -300 + i * 32 + 10 * A(i), h = 6 + 22 * A(i + 3); g.fillRect(x, y - h, 3 + 4 * A(i + 7), h + 2); }
    for (const [x, h] of d.torres || [[300, 150]]) { g.beginPath(); g.moveTo(x - 14, y); g.lineTo(x - 8, y - h); g.lineTo(x - 18, y - h - 16); g.lineTo(x, y - h - 6); g.lineTo(x + 18, y - h - 16); g.lineTo(x + 8, y - h); g.lineTo(x + 14, y); g.fill(); }
    g.fillRect(-400, y, 2100, 400);
    g.fillStyle = 'rgba(255,140,60,.9)'; for (let i = 0; i < 30; i++) { const u = ((t * (.2 + .3 * A(i + 9)) + A(i)) % 1); g.beginPath(); g.arc(-200 + 1700 * A(i + 40), y - 10 - u * 160, 1.5 * (1 - u) + .5, 0, TAU); g.fill(); }
    g.strokeStyle = 'rgba(255,120,60,.25)'; g.lineWidth = 1.2; for (let i = -8; i <= 8; i++) { g.beginPath(); g.moveTo(640 + i * 30, y + 2); g.lineTo(640 + i * 260, y + 220); g.stroke(); } };
  D.roca = (g, t, d) => { const x = d.x, y = d.y || 600, e = d.escala || 1; g.save(); g.translate(x, y); g.scale(e, e); g.fillStyle = color(d);
    g.beginPath(); g.moveTo(-160, 10); g.lineTo(-130, -40); g.lineTo(-70, -62); g.lineTo(-20, -90); g.lineTo(40, -84); g.lineTo(90, -60); g.lineTo(150, -30); g.lineTo(180, 10); g.closePath(); g.fill();
    hueco(g, () => { g.moveTo(-60, -50); g.lineTo(-30, -66); g.lineTo(-28, -64); g.lineTo(-58, -48); g.moveTo(50, -60); g.lineTo(80, -44); g.lineTo(78, -42); g.lineTo(48, -58); }); g.restore(); };
  D.molino = (g, t, d) => { const x = d.x, y = d.y || 520; g.fillStyle = color(d); g.beginPath(); g.moveTo(x - 26, y); g.lineTo(x - 14, y - 120); g.lineTo(x + 14, y - 120); g.lineTo(x + 26, y); g.fill();
    g.save(); g.translate(x, y - 120); g.rotate(t * .6); for (let i = 0; i < 4; i++) { g.rotate(TAU / 4); g.fillRect(-3, 0, 6, 90); g.fillRect(3, 20, 18, 66); } g.restore(); };
  D.nubes = (g, t, d) => { g.fillStyle = color(d);
    for (let i = 0; i < (d.n || 4); i++) { const x = ((A(i) * 1800 + t * (8 + 6 * A(i + 9))) % 1900) - 300, y = (d.y || 120) + 80 * A(i + 3);
      for (let k = 0; k < 5; k++) { g.beginPath(); g.ellipse(x + k * 34, y - 14 * Math.sin(k * 1.2), 40, 22, 0, 0, TAU); g.fill(); } } };
  D.astro = (g, t, d) => { const x = d.x || 1000, y = d.y || 130, r = d.r || 50;   // sol o luna: un brillo cálido en el pergamino
    const gr = g.createRadialGradient(x, y, 4, x, y, r * 3.5); gr.addColorStop(0, 'rgba(255,236,190,.75)'); gr.addColorStop(.25, 'rgba(255,214,150,.35)'); gr.addColorStop(1, 'rgba(255,200,120,0)');
    g.fillStyle = gr; g.fillRect(x - r * 4, y - r * 4, r * 8, r * 8); if (d.luna) { g.fillStyle = 'rgba(70,45,25,.35)'; g.beginPath(); g.arc(x + r * .35, y - r * .1, r * .85, 0, TAU); g.fill(); } };
  D.telon = (g, t, d) => {                       // cortinas de teatro a los lados (en `delante`), con pliegues que respiran
    for (const lado of [-1, 1]) { g.save(); g.translate(lado < 0 ? -10 : 1290, 0); g.scale(lado < 0 ? 1 : -1, 1); g.fillStyle = N;
      g.beginPath(); g.moveTo(-40, -40); g.lineTo(150, -40);
      for (let y = 0; y <= 760; y += 40) g.lineTo(110 + 14 * Math.sin(y * .03 + t * .8) - (y > 500 ? (y - 500) * .25 : 0), y);
      g.lineTo(-40, 760); g.closePath(); g.fill(); g.restore(); }
    g.fillStyle = N; g.beginPath(); g.moveTo(-20, -20); g.lineTo(1300, -20); g.lineTo(1300, 40);
    for (let x = 1300; x >= -20; x -= 64) g.quadraticCurveTo(x - 32, 78, x - 64, 40); g.closePath(); g.fill();
  };
  // ---------- planos `jack` (a lo Samurai Jack): color plano, sin pergamino ----------
  D.plano = (g, t, d) => {                       // cielo de un color con pinceladas horizontales quietas (d.color, d.raya, d.luz)
    g.fillStyle = d.color || '#b3201a'; g.fillRect(-900, -600, 3100, 2000);
    for (let i = 0; i < 70; i++) { const y = -200 + 1100 * A(i + 3), x = -500 + 2200 * A(i + 7), l = 300 + 900 * A(i + 11), w = 4 + 26 * A(i + 13);
      g.fillStyle = A(i + 17) < .55 ? (d.raya || 'rgba(70,6,6,.22)') : (d.luz || 'rgba(255,90,60,.14)');
      g.beginPath(); g.moveTo(x, y); g.bezierCurveTo(x + l * .3, y - w * .6, x + l * .7, y - w * .4, x + l, y + w * .2);
      g.bezierCurveTo(x + l * .7, y + w * .5, x + l * .3, y + w * .7, x + 10, y + w); g.closePath(); g.fill(); }
  };
  D.trono = (g, t, d) => {                       // trono de respaldo alto con picos (los gobiernos autonómicos)
    const e = d.escala || 1; g.save(); g.translate(d.x, d.y || 600); g.scale(e, e); g.fillStyle = color(d);
    g.fillRect(-34, -70, 68, 12); g.fillRect(-30, -58, 8, 58); g.fillRect(22, -58, 8, 58); g.fillRect(-36, -96, 8, 30); g.fillRect(28, -96, 8, 30);
    g.beginPath(); g.moveTo(-30, -70); g.lineTo(-30, -190); g.lineTo(-18, -214); g.lineTo(-8, -196); g.lineTo(0, -228); g.lineTo(8, -196); g.lineTo(18, -214); g.lineTo(30, -190); g.lineTo(30, -70); g.closePath(); g.fill();
    hueco(g, () => { g.moveTo(0, -176); g.lineTo(10, -150); g.lineTo(0, -124); g.lineTo(-10, -150); g.closePath(); }); g.restore(); };
  D.mesa = (g, t, d) => {                        // mesa larga con sentados que se levantan y se van (d.sillas: [{ en }], en = cuándo se va; sin en, silla vacía)
    const e = d.escala || 1; g.save(); g.translate(d.x || 640, d.y || 600); g.scale(e, e); const sillas = d.sillas || [], n = sillas.length, paso = 150;
    sillas.forEach((q, i) => { const x = (i - (n - 1) / 2) * paso; g.fillStyle = color(d);
      g.fillRect(x - 30, -170, 8, 170); g.fillRect(x - 30, -70, 60, 9); g.fillRect(x + 22, -70, 8, 70);   // silla
      const k = q.en == null ? 1 : T.clamp((t - q.en) / .6); if (k >= 1) return;
      g.save(); g.globalAlpha = 1 - k; g.translate(x + 40 * k, -70 - 20 * Math.sin(Math.PI * Math.min(k * 2, 1)));
      g.beginPath(); g.moveTo(-26, 0); g.lineTo(-30, -78); g.lineTo(-8, -96); g.lineTo(20, -92); g.lineTo(24, -40); g.lineTo(30, 0); g.closePath(); g.fill();   // tronco
      g.beginPath(); g.ellipse(4, -116, 15, 19, 0, 0, TAU); g.fill(); g.restore(); });
    const ancho = n ? n * paso + 60 : (d.ancho || 260) / e;   // sin sillas: mesa sola de d.ancho
    g.fillStyle = color(d); g.fillRect(-ancho / 2, -84, ancho, 14); for (const x of [-ancho / 2 + 20, ancho / 2 - 28]) g.fillRect(x, -70, 8, 70);
    g.restore(); };
  D.pinchos = (g, t, d) => {                     // matorral de púas negras en primer término, que se dobla con el viento
    const y = d.y || 720, e = d.escala || 1; g.fillStyle = color(d);
    for (let i = 0; i < (d.n || 22); i++) { const x = -200 + i * (1700 / (d.n || 22)) + 50 * A(i), h = (60 + 130 * A(i + 5)) * e, w = (14 + 22 * A(i + 9)) * e,
        dob = (A(i + 2) < .5 ? -1 : 1) * (.4 + .5 * A(i + 4)) + .06 * Math.sin(t * 2.2 + i);
      g.beginPath(); g.moveTo(x - w, y + 20); g.quadraticCurveTo(x - w * .3 + dob * h * .3, y - h * .5, x + dob * h * .8, y - h);
      g.quadraticCurveTo(x + w * .2 + dob * h * .3, y - h * .4, x + w, y + 20); g.closePath(); g.fill(); }
    g.fillRect(-400, y, 2100, 400);
  };
  // ---------- ep. 3: el fuego, el sueldo, la fundación, la muralla y la balanza ----------
  const texto = (g, s, x, y, tam, alinea = 'center') => { g.font = `700 ${tam}px Georgia, serif`; g.textAlign = alinea; g.fillText(s, x, y); g.textAlign = 'left'; };
  D.llamas = (g, t, d) => {                      // fuego que crece desde d.en: lenguas que suben y chispas (en color, también en planos `jack`)
    const k = T.clamp((t - (d.en ?? 0)) / (d.crece || 1.5)); if (k <= 0) return;
    const x = d.x, y = d.y || 600, w = (d.ancho || 200) / 2, h = (d.alto || 220) * k;
    for (const [col, f] of [['rgba(150,20,8,.9)', 1], ['rgba(235,90,20,.92)', .78], ['rgba(255,190,70,.95)', .5]]) {
      g.fillStyle = col; g.beginPath(); g.moveTo(x - w * f, y);
      for (let i = 0; i <= 12; i++) { const u = i / 12, px = x - w * f + 2 * w * f * u, alto = h * f * (.45 + .55 * Math.sin(Math.PI * u)) * (.75 + .25 * Math.sin(t * 9 + i * 1.7));
        g.lineTo(px, y - alto); g.lineTo(px + w * f / 12, y - alto * .7); }
      g.lineTo(x + w * f, y); g.closePath(); g.fill(); }
    g.fillStyle = 'rgba(255,170,70,.9)';
    for (let i = 0; i < 24 * k; i++) { const u = (t * (.4 + .4 * A(i + 3)) + A(i)) % 1; g.beginPath(); g.arc(x + (A(i + 9) - .5) * 2 * w + 20 * Math.sin(t * 2 + i), y - h * .5 - u * 260, 2 * (1 - u) + .6, 0, TAU); g.fill(); }
  };
  D.casa = (g, t, d) => {                        // casa de pueblo con ventana encendida; d.nino = niño asomado; d.rota = cristal roto; d.pintada = texto en la pared
    const e = d.escala || 1; g.save(); g.translate(d.x, d.y || 600); g.scale(e, e); g.fillStyle = color(d);
    g.fillRect(-150, -260, 300, 260); g.beginPath(); g.moveTo(-175, -255); g.lineTo(0, -360); g.lineTo(175, -255); g.closePath(); g.fill(); g.fillRect(70, -340, 30, 60);
    hueco(g, () => { g.rect(-60, -200, 120, 100); g.rect(-30, -70, 60, 70); });
    g.fillStyle = `rgba(255,${190 + 20 * Math.sin(t * 7)},110,.95)`; g.fillRect(-60, -200, 120, 100);   // ventana encendida
    g.fillStyle = color(d); g.fillRect(-3, -200, 6, 100); g.fillRect(-60, -153, 120, 6);
    if (d.nino) { g.beginPath(); g.ellipse(18, -150, 15, 17, 0, 0, TAU); g.fill(); g.beginPath(); g.moveTo(-6, -100); g.quadraticCurveTo(18, -138, 42, -100); g.fill(); }
    if (d.rota) { g.strokeStyle = color(d); g.lineWidth = 2; g.beginPath(); for (const [a, b] of [[-40, -180], [-20, -120], [-52, -110], [40, -190], [52, -130]]) { g.moveTo(-30, -160); g.lineTo(a, b); } g.stroke(); }
    if (d.pintada) { g.fillStyle = 'rgba(190,30,20,.85)'; g.save(); g.rotate(-.06); texto(g, d.pintada, -95, -30, 26); g.restore(); }
    g.restore(); };
  D.tienda = (g, t, d) => {                      // tienda con escaparate y letrero; con d.rota el cristal está roto
    const e = d.escala || 1; g.save(); g.translate(d.x, d.y || 600); g.scale(e, e); g.fillStyle = color(d);
    g.fillRect(-170, -250, 340, 250); g.fillRect(-190, -270, 380, 26);
    hueco(g, () => { g.rect(-140, -180, 180, 140); g.rect(70, -150, 60, 150); texto(g, d.rotulo || 'ROPA', 0, -205, 30); });
    if (d.rota) { g.lineWidth = 3; g.strokeStyle = color(d); g.beginPath(); for (const [a, b] of [[-130, -170], [-60, -50], [30, -170], [-140, -90], [20, -60]]) { g.moveTo(-70, -120); g.lineTo(a, b); } g.stroke(); }
    g.restore(); };
  D.coche = (g, t, d) => {                       // coche de los años noventa, de perfil
    const e = d.escala || 1; g.save(); g.translate(d.x, d.y || 600); g.scale(e * (d.lado || 1), e); g.fillStyle = color(d);
    g.beginPath(); g.moveTo(-150, -26); g.lineTo(-150, -66); g.lineTo(-80, -72); g.lineTo(-45, -116); g.lineTo(60, -116); g.lineTo(100, -72); g.lineTo(150, -64); g.lineTo(150, -26); g.closePath(); g.fill();
    hueco(g, () => { g.moveTo(-38, -108); g.lineTo(2, -108); g.lineTo(2, -76); g.lineTo(-66, -76); g.closePath(); g.moveTo(10, -108); g.lineTo(54, -108); g.lineTo(86, -76); g.lineTo(10, -76); g.closePath(); });
    for (const x of [-92, 92]) { g.beginPath(); g.arc(x, -24, 26, 0, TAU); g.fill(); }
    g.restore(); };
  D.nomina = (g, t, d) => {                      // nómina gigante: baja desde arriba en d.en y se queda con un leve vaivén
    const k = T.suave(T.clamp((t - (d.en ?? 0)) / .7)); if (k <= 0) return; const e = d.escala || 1;
    g.save(); g.translate(d.x, mezclaY(d.y || 330, k)); g.rotate(.04 * Math.sin(t * 1.3) * k); g.scale(e, e);
    g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(-112, -152, 236, 316);
    g.fillStyle = '#efe2c4'; g.fillRect(-120, -160, 240, 320); g.fillStyle = '#3b2a1c';
    texto(g, 'NÓMINA', 0, -118, 26); g.fillRect(-90, -100, 180, 3);
    for (let i = 0; i < 6; i++) g.fillRect(-90, -78 + i * 22, 80 + 60 * A(i + 3), 6);
    g.fillStyle = '#7a1410'; texto(g, d.texto || '82.491 €', 0, 110, 38); g.fillStyle = '#3b2a1c'; texto(g, 'al año', 0, 140, 18);
    g.restore(); };
  const mezclaY = (y, k) => -260 + (y + 260) * k;
  D.letrero = (g, t, d) => {                     // letrero colgado con el nombre; encendido de d.enciende a d.apaga (parpadea al encenderse y al apagarse)
    const x = d.x, y = d.y || 200, w = d.ancho || 420; g.fillStyle = color(d);
    g.fillRect(x - w / 2 + 30, y - 120, 4, 80); g.fillRect(x + w / 2 - 34, y - 120, 4, 80); g.fillRect(x - w / 2, y - 44, w, 78);
    const u = t - (d.apaga ?? 99), v = t - (d.enciende ?? -99), luz = v < 0 ? 0 : v < .4 ? (Math.sin(v * 40) > 0 ? .8 : .1) : u < 0 ? 1 : u < .6 ? (Math.sin(u * 40) > 0 ? .8 : .1) : 0;
    if (luz > 0) { const gr = g.createRadialGradient(x, y - 5, 10, x, y - 5, w * .8); gr.addColorStop(0, `rgba(255,214,150,${.45 * luz})`); gr.addColorStop(1, 'rgba(255,214,150,0)'); g.fillStyle = gr; g.fillRect(x - w, y - 200, 2 * w, 400); }
    g.fillStyle = luz > 0 ? `rgba(255,${200 + 30 * luz},140,${.4 + .6 * luz})` : 'rgba(90,70,50,.6)'; texto(g, d.texto || 'FUNDACIÓN', x, y + 8, d.tam || 34); };
  D.muralla = (g, t, d) => {                     // muralla que crece ladrillo a ladrillo desde d.en (d.filas, d.ritmo = filas por segundo)
    const x = d.x || 640, y = d.y || 600, w = d.ancho || 900, lh = 34, lw = 76, filas = d.filas || 8, hechos = T.clamp((t - (d.en ?? 0)) * (d.ritmo || 2), 0, filas);
    g.fillStyle = color(d);
    for (let f = 0; f < Math.ceil(hechos); f++) { const k = T.clamp(hechos - f), off = f % 2 ? lw / 2 : 0, n = Math.ceil(w / lw);
      for (let i = 0; i < n; i++) { if (i / n > k) break; const bx = x - w / 2 + i * lw - off; g.fillRect(Math.max(bx, x - w / 2), y - (f + 1) * lh, Math.min(lw - 5, x + w / 2 - Math.max(bx, x - w / 2)), lh - 5); } }
    if (hechos >= filas) for (let i = 0; i < w / 60; i++) g.fillRect(x - w / 2 + i * 60, y - filas * lh - 26, 34, 26);   // almenas
  };
  D.balanza = (g, t, d) => {                     // balanza de dos platos; d.peso (-1 izquierda … 1 derecha) y un vaivén que no se decide
    const x = d.x || 640, y = d.y || 600, e = d.escala || 1, inc = (d.pesos || []).reduce((p, [tt, v]) => p + (v - p) * T.suave(T.clamp(t - tt)), d.peso || 0) * .12 + .07 * Math.sin(t * 1.1) * Math.exp(-((t - (d.en ?? 0)) % 6) * .1);
    g.save(); g.translate(x, y); g.scale(e, e); g.fillStyle = color(d); g.strokeStyle = color(d);
    g.beginPath(); g.moveTo(-70, 0); g.lineTo(70, 0); g.lineTo(14, -24); g.lineTo(8, -330); g.lineTo(-8, -330); g.lineTo(-14, -24); g.closePath(); g.fill();
    g.beginPath(); g.arc(0, -340, 16, 0, TAU); g.fill();
    g.save(); g.translate(0, -340); g.rotate(inc); g.fillRect(-260, -6, 520, 12);
    for (const [lado, lista, cuando] of [[-1, d.izq || [], d.izqEn || []], [1, d.der || [], d.derEn || []]]) {   // izqEn / derEn: cuándo cae cada cosa en su plato
      g.save(); g.translate(lado * 250, 0); g.rotate(-inc); g.lineWidth = 3; g.beginPath(); g.moveTo(0, 0); g.lineTo(-90, 170); g.moveTo(0, 0); g.lineTo(90, 170); g.stroke();
      g.beginPath(); g.moveTo(-110, 170); g.quadraticCurveTo(0, 230, 110, 170); g.closePath(); g.fill();
      lista.forEach((s, i) => { if (t < (cuando[i] ?? -1)) return; g.font = '700 15px Georgia, serif'; const an = Math.max(240, g.measureText(s).width + 20); g.fillStyle = '#efe2c4'; g.fillRect(-an / 2, 136 - i * 30, an, 26); g.fillStyle = '#3b2a1c'; texto(g, s, 0, 155 - i * 30, 15); g.fillStyle = color(d); });
      g.restore(); }
    g.restore(); g.restore(); };
  D.caseta = (g, t, d) => {                      // chiringuito: caseta con toldo a rayas, ventanilla con alguien dentro y su letrero; en d.cae se viene abajo
    const x = d.x, y = d.y || 600, e = d.escala || 1, k = d.cae == null ? 0 : T.clamp((t - d.cae) / .45), giro = k * k * 1.5;
    g.save(); g.translate(x, y); g.scale(e, e); g.translate(64, 0); g.rotate(giro); g.translate(-64, 0);
    g.fillStyle = color(d); g.fillRect(-64, -118, 128, 118);
    g.fillStyle = 'rgba(160,96,44,.85)'; g.fillRect(-48, -92, 96, 42);                                   // ventanilla con luz
    g.fillStyle = color(d); g.beginPath(); g.arc(-10, -66, 11, 0, TAU); g.fill(); g.fillRect(-24, -56, 28, 8);   // el afín, dentro
    for (let i = 0; i < 6; i++) { g.fillStyle = i % 2 ? color(d) : '#e9dcc0'; g.beginPath(); g.moveTo(-74 + i * 24.7, -118); g.lineTo(-74 + (i + 1) * 24.7, -118);
      g.lineTo(-74 + (i + 1) * 24.7, -140); g.lineTo(-74 + i * 24.7, -140); g.fill(); g.beginPath(); g.arc(-74 + (i + .5) * 24.7, -118, 12.3, 0, Math.PI); g.fill(); }   // toldo
    g.fillStyle = '#efe0bd'; g.fillRect(-62, -172, 124, 28); g.fillStyle = '#2a1708'; texto(g, d.rotulo || 'CHIRINGUITO', 0, -152, d.tam || 15);
    g.restore();
    if (k > 0 && t - d.cae < 1.2) { const u = (t - d.cae) / 1.2; g.fillStyle = `rgba(60,40,28,${.5 * (1 - u)})`;                       // polvo al caer
      for (let i = 0; i < 9; i++) { g.beginPath(); g.arc(x + (i - 4) * 26 * e * (1 + u), y - 20 * e * u - 8 * A(i) * e, (14 + 22 * u) * e * (.6 + A(i + 3)), 0, TAU); g.fill(); } }
  };
  D.estante = (g, t, d) => {                     // balda larga de laboratorio con escuadras (los frascos se ponen encima, en y = d.y)
    const y = d.y || 520, x0 = d.x0 ?? 20, x1 = d.x1 ?? 1060; g.fillStyle = color(d); g.fillRect(x0, y, x1 - x0, 16);
    for (let x = x0 + 40; x < x1; x += 260) { g.beginPath(); g.moveTo(x, y + 16); g.lineTo(x + 8, y + 16); g.lineTo(x + 8, y + 70); g.lineTo(x - 40, y + 16); g.fill(); }
  };
  // frasco del Decano: vidrio con algo dentro (d.icono), su nombre (d.titulo) y, en d.sella, el sello de la etiqueta (d.etiqueta); d.luz: [desde, hasta] lo ilumina el candil
  const ICONOS = {
    euros(g, t) { for (let i = 0; i < 3; i++) { const x = -32 + i * 32, y = -150 + 8 * Math.sin(t * 2 + i * 2); g.beginPath(); g.arc(x, y, 15, 0, TAU); g.fill();
      g.fillStyle = '#e9dcc0'; texto(g, '€', x, y + 7, 18); g.fillStyle = N; } },
    banco(g) { g.beginPath(); g.moveTo(-42, -168); g.lineTo(0, -188); g.lineTo(42, -168); g.fill(); g.fillRect(-40, -166, 80, 6); for (let i = 0; i < 4; i++) g.fillRect(-34 + i * 21, -158, 9, 34); g.fillRect(-44, -124, 88, 7); },
    hucha(g, t) { g.save(); g.translate(0, -148 + 3 * Math.sin(t * 3)); g.beginPath(); g.ellipse(0, 0, 40, 27, 0, 0, TAU); g.fill(); g.beginPath(); g.ellipse(40, 2, 9, 11, 0, 0, TAU); g.fill();
      g.beginPath(); g.moveTo(-14, -22); g.lineTo(-6, -36); g.lineTo(0, -22); g.fill(); for (const x of [-24, -8, 10, 24]) g.fillRect(x, 20, 7, 14); g.fillStyle = '#e9dcc0'; g.fillRect(-12, -27, 22, 4); g.fillStyle = N; g.restore(); },
    factura(g, t) { g.save(); g.translate(0, -150); g.rotate(.08 * Math.sin(t * 1.5)); g.fillStyle = '#e9dcc0'; g.fillRect(-30, -36, 60, 72); g.fillStyle = N;
      for (let i = 0; i < 5; i++) g.fillRect(-22, -26 + i * 10, i === 4 ? 24 : 44, 3); texto(g, '€', 14, 30, 20); g.restore(); },
    agua(g, t) { g.beginPath(); g.moveTo(-58, -128); for (let x = -58; x <= 58; x += 6) g.lineTo(x, -138 + 5 * Math.sin(x / 9 + t * 3)); g.lineTo(58, -118); g.lineTo(-58, -118); g.fill();
      for (let i = 0; i < 4; i++) { const u = (t * .9 + i / 4) % 1, x = -30 + i * 20; g.beginPath(); g.ellipse(x, -186 + 50 * u, 4, 7, 0, 0, TAU); g.fill(); } },
    mazo(g, t) { const a = -.5 + .5 * Math.max(0, Math.sin(t * 3)); g.fillRect(-36, -128, 60, 10); g.save(); g.translate(18, -136); g.rotate(a); g.fillRect(-4, -46, 8, 46); g.fillRect(-22, -62, 44, 20); g.restore(); },
    sillas(g) { for (let i = 0; i < 3; i++) { const x = -40 + i * 40; g.fillRect(x - 12, -176, 4, 52); g.fillRect(x - 12, -146, 24, 4); g.fillRect(x + 8, -146, 4, 22); g.fillRect(x - 12, -146, 4, 22); } },
  };
  D.frasco = (g, t, d) => {
    const x = d.x, y = d.y || 520, e = d.escala || 1, luz = d.luz && t >= d.luz[0] && t < d.luz[1] ? Math.min(1, (t - d.luz[0]) / .3, (d.luz[1] - t) / .3) : 0;
    g.save(); g.translate(x, y); g.scale(e, e);
    if (luz > 0) { const gr = g.createRadialGradient(0, -110, 10, 0, -110, 190); gr.addColorStop(0, `rgba(255,214,140,${.55 * luz})`); gr.addColorStop(1, 'rgba(255,214,140,0)'); g.fillStyle = gr; g.fillRect(-200, -310, 400, 400); }
    g.fillStyle = 'rgba(235,222,190,.16)'; g.beginPath(); g.roundRect(-66, -192, 132, 192, 20); g.fill();                     // vidrio
    g.strokeStyle = N; g.lineWidth = 5; g.stroke(); g.fillStyle = N; g.fillRect(-46, -208, 92, 16); g.fillRect(-54, -226, 108, 20);   // cuello y tapa
    g.fillStyle = 'rgba(255,250,235,.35)'; g.fillRect(-52, -178, 8, 120);                                                   // brillo del vidrio
    g.fillStyle = N; (ICONOS[d.icono] || (() => {}))(g, t);
    g.fillStyle = '#efe0bd'; g.fillRect(-54, -112, 108, 52); g.strokeStyle = '#3a2410'; g.lineWidth = 2; g.strokeRect(-50, -108, 100, 44);   // etiqueta
    g.fillStyle = '#2a1708'; (d.titulo || '').split('\n').forEach((l, i, ls) => { g.font = '700 12px Georgia, serif'; texto(g, l, 0, -84 + (i - (ls.length - 1) / 2) * 15, Math.min(12, 12 * 92 / g.measureText(l).width)); });   // encoge si no cabe
    if (d.sella != null && t >= d.sella) { const k = T.clamp((t - d.sella) / .14), s0 = 1.7 - .7 * k, lineas = (d.etiqueta || '').split('\n');   // el sello cae y se queda
      g.save(); g.translate(0, -46); g.rotate(-.22); g.scale(s0, s0); g.globalAlpha = Math.min(1, k * 1.5);
      g.strokeStyle = '#a3140f'; g.lineWidth = 4; g.strokeRect(-64, -16 - 8 * (lineas.length - 1), 128, 32 + 16 * (lineas.length - 1)); g.fillStyle = '#a3140f';
      lineas.forEach((l, i) => texto(g, l, 0, 7 + (i - (lineas.length - 1) / 2) * 17, 17)); g.restore(); }
    g.restore();
  };
  D.lista = (g, t, d) => {                       // lista cerrada: papel alto con su cabecera y nombres tachados que no eliges (d.texto, d.n renglones)
    const x = d.x, y = d.y || 600, e = d.escala || 1, n = d.n || 9; g.save(); g.translate(x, y); g.scale(e, e); g.rotate(d.giro || 0);
    g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(-82, -30 - n * 34 - 70, 172, n * 34 + 100); g.fillStyle = '#efe0bd'; g.fillRect(-90, -36 - n * 34 - 70, 180, n * 34 + 100);
    g.fillStyle = '#2a1708'; texto(g, d.texto || 'LISTA', 0, -36 - n * 34 - 30, 22);
    const vis = d.escribe == null ? n : Math.min(n, Math.floor((t - d.escribe) * (d.ritmo || 2.5)));     // d.escribe: la mano del partido la va escribiendo
    for (let i = 0; i < vis; i++) { const yy = -36 - (n - i) * 34 + 10; g.fillStyle = '#3a2410'; g.fillRect(-64, yy, 16, 16); g.fillRect(-36, yy + 5, 100 - 20 * A(i + (d.s || 0)), 6); }
    if (d.escribe != null && t > d.escribe - 1 && vis < n) { const yy = -36 - (n - Math.max(0, vis)) * 34 + 10; mano(g, 50 + 30 * Math.sin(t * 7), yy - 50, .55, -.35, 1); }
    g.restore(); };
  D.disco = (g, t, d) => { g.fillStyle = d.color || '#e9a23b'; g.beginPath(); g.arc(d.x || 1000, d.y || 300, d.r || 160, 0, TAU); g.fill(); };   // sol plano y enorme, a lo Jack
  // ---------- outro: «me gusta», suscribirse y campana (monumentos en el llano; el Elegido salta encima y se cuelga) ----------
  const destello = (g, x, y, r, k, col = '255,214,120') => {      // brillo y rayos de un golpe (k: 0 → 1 en el tiempo del golpe)
    if (k <= 0 || k >= 1) return; const a = 1 - k, gr = g.createRadialGradient(x, y, 4, x, y, r * (1 + k));
    gr.addColorStop(0, `rgba(${col},${.7 * a})`); gr.addColorStop(1, `rgba(${col},0)`); g.fillStyle = gr; g.fillRect(x - 3 * r, y - 3 * r, 6 * r, 6 * r);
    g.strokeStyle = `rgba(${col},${a})`; g.lineWidth = 6 * a + 1;
    for (let i = 0; i < 12; i++) { const an = i / 12 * TAU + .2, r0 = r * (.55 + .9 * k), r1 = r0 + r * .45 * a; g.beginPath(); g.moveTo(x + r0 * Math.cos(an), y + r0 * Math.sin(an)); g.lineTo(x + r1 * Math.cos(an), y + r1 * Math.sin(an)); g.stroke(); }
  };
  const encendido = (t, en, dura = .25) => en == null ? 0 : T.clamp((t - en) / dura);
  D.pulgar = (g, t, d) => {                      // «me gusta»: un pulgar arriba de piedra sobre su peana; en d.en se enciende (pisada encima: arriba del puño, y = -235)
    const x = d.x, y = d.y || 600, e = d.escala || 1, k = encendido(t, d.en), pop = d.en != null && t > d.en ? 1 + .07 * Math.sin(Math.PI * T.clamp((t - d.en) / .3)) : 1;
    g.save(); g.translate(x, y); g.scale(e, e); g.fillStyle = color(d); g.fillRect(-160, -70, 320, 70); g.fillRect(-175, -82, 350, 16);
    g.translate(0, -70); g.scale(pop, pop);
    const forma = () => { g.beginPath(); g.roundRect(-150, -190, 62, 190, 8); g.roundRect(-76, -165, 206, 165, 30);
      g.save(); g.translate(-40, -165); g.rotate(.22); g.roundRect(-34, -150, 68, 165, 32); g.restore(); };
    g.fillStyle = color(d); forma(); g.fill();
    if (k > 0) { g.save(); g.globalAlpha = k; g.shadowColor = 'rgba(255,200,110,.9)'; g.shadowBlur = 40; g.fillStyle = '#f3e6c6'; forma(); g.fill(); g.restore(); }
    g.fillStyle = k > 0 ? 'rgba(59,52,49,.9)' : 'rgba(255,230,190,.12)';                     // ranuras de los dedos
    for (const fy of [-122, -84, -46]) g.fillRect(60, fy, 70, 5);
    g.restore(); destello(g, x + 30 * e, y - 230 * e, 120 * e, (t - (d.en ?? 99)) / .7);
  };
  D.boton = (g, t, d) => {                       // botón SUSCRÍBETE: una tecla roja gigante; en d.en se hunde (de y = -160 a -134), se apaga a gris y pone SUSCRITO
    const x = d.x, y = d.y || 600, e = d.escala || 1, k = encendido(t, d.en, .12), arriba = -160 + 26 * k, w = 440;
    g.save(); g.translate(x, y); g.scale(e, e);
    g.fillStyle = k < 1 ? '#c4161c' : '#4b4644'; g.fillRect(-w / 2, arriba + 18, w, -arriba);           // cara de delante
    g.fillStyle = k < 1 ? '#86100f' : '#2f2b29'; g.fillRect(-w / 2, arriba, w, 18);                     // cara de arriba
    g.fillStyle = k < 1 ? '#fff6ea' : '#d9d2c6'; g.letterSpacing = '4px';
    g.font = '700 54px Georgia, serif'; g.textAlign = 'center'; g.fillText(k < 1 ? 'SUSCRÍBETE' : 'SUSCRITO ✓', 0, (arriba + 18 - 40) / 2 + 19); g.textAlign = 'left'; g.letterSpacing = '0px';
    g.fillStyle = color(d); g.fillRect(-w / 2 - 30, -40, w + 60, 40);                                    // la base en la que se hunde
    g.restore(); destello(g, x, y + (arriba + 40) * e, 170 * e, (t - (d.en ?? 99)) / .6, '255,120,90');
  };
  D.campana = (g, t, d) => {                     // pórtico con una campana colgada y su cuerda; d.toca: cuándo suena (se lanza y vibra); d.tirones: quien cuelga tira
    const x = d.x, y = d.y || 600, e = d.escala || 1, ang = T.vaivenCampana(t, d), baja = T.tironCuerda(t, d.tirones), pivote = -622;   // la punta de la cuerda: 270 bajo el pivote
    const ultimo = Math.max(-99, ...(d.toca || []).filter(p => p <= t)), oro = d.toca && t >= d.toca[d.toca.length - 1] ? 1 : T.clamp(1 - (t - ultimo) / .35);
    g.save(); g.translate(x, y); g.scale(e, e); g.fillStyle = color(d);
    for (const s of [-1, 1]) { g.beginPath(); g.moveTo(s * 190, 0); g.lineTo(s * 212, 0); g.lineTo(s * 204, -650); g.lineTo(s * 184, -650); g.fill(); }   // postes
    g.fillRect(-235, -560, 470, 20);                                                                    // travesaño bajo
    g.beginPath(); g.moveTo(-300, -675); g.quadraticCurveTo(0, -638, 300, -675); g.lineTo(290, -646); g.quadraticCurveTo(0, -616, -290, -646); g.closePath(); g.fill();   // travesaño alto, curvo
    g.save(); g.translate(0, pivote); g.rotate(ang);
    g.fillRect(-4, 0, 8, 30);                                                                            // cadena
    const forma = () => { g.beginPath(); g.moveTo(-26, 30); g.bezierCurveTo(-60, 34, -58, 110, -78, 150); g.quadraticCurveTo(-86, 166, -70, 168); g.lineTo(70, 168); g.quadraticCurveTo(86, 166, 78, 150); g.bezierCurveTo(58, 110, 60, 34, 26, 30); g.closePath(); };
    if (oro > 0) { g.save(); g.shadowColor = `rgba(255,200,90,${oro})`; g.shadowBlur = 50 * oro; g.fillStyle = '#d9a53a'; forma(); g.fill(); g.restore(); }
    g.save(); g.globalAlpha = 1 - oro; g.fillStyle = color(d); forma(); g.fill(); g.restore();
    g.fillStyle = color(d); g.beginPath(); g.arc(0, 176 + 4 * Math.sin(t * 9) * (oro > 0), 13, 0, TAU); g.fill();   // badajo
    g.strokeStyle = color(d); g.lineWidth = 7; g.lineCap = 'round'; g.beginPath(); g.moveTo(0, 182); g.lineTo(0, 270 + baja / e); g.stroke(); g.fillRect(-9, 262 + baja / e, 18, 14);   // cuerda con su nudo al final
    g.restore();
    for (const p of d.toca || []) { const v = t - p; if (v < 0 || v > 1.1) continue;                    // ondas del sonido, a los dos lados
      for (let j = 0; j < 3; j++) { const r = 110 + 260 * v + 40 * j, a = Math.max(0, 1 - v / 1.1) * (1 - j * .25);
        g.strokeStyle = `rgba(255,214,140,${a})`; g.lineWidth = 7 - 2 * j;
        for (const s of [-1, 1]) { g.beginPath(); g.arc(0, pivote + 110, r, s > 0 ? -.5 : Math.PI - .5, s > 0 ? .5 : Math.PI + .5); g.stroke(); } } }
    g.restore();
  };
  // ---------- ep. 4: las dos familias (noria, cuerda, relámpagos, balcón, hemiciclo, reglas y banquete) ----------
  // contorno de Españistán (península sin Portugal), en 0–1; lo usan el pastel y las reglas
  const MAPA = [[.04, .2], [.2, .1], [.42, .07], [.62, .08], [.74, .05], [.86, .12], [1, .15], [.96, .3], [.9, .38], [.82, .5], [.85, .62], [.76, .7], [.74, .8],
    [.62, .92], [.48, .95], [.38, 1], [.3, .92], [.22, .84], [.24, .7], [.2, .58], [.26, .45], [.18, .36], [.08, .34], [.02, .27]];
  const mapa = (g, x, y, w, h) => { g.beginPath(); MAPA.forEach(([u, v], i) => g[i ? 'lineTo' : 'moveTo'](x + u * w, y + v * h)); g.closePath(); };
  const brillo = (g, x, y, r, col, a) => { if (a <= 0) return; const gr = g.createRadialGradient(x, y, 1, x, y, r); gr.addColorStop(0, `rgba(${col},${a})`); gr.addColorStop(1, `rgba(${col},0)`); g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); };
  // la noria de las dos familias: dos cabinas grandes (roja y azul) en lados opuestos, bombillas que corren por el aro.
  //   d.r radio · d.vel vueltas por segundo · d.para (segundo en que frena hasta pararse) · d.sacude: [s] las cabinas se zarandean
  //   d.extra: [{ color, en, cae }] cabinas pequeñas que aparecen en `en` y se desprenden en `cae` · d.luces: 0–1 (se apagan)
  //   d.fase: giro inicial (radianes) · d.arranca: parada hasta ese segundo y luego coge velocidad poco a poco
  D.noria = (g, t, d) => {
    const x = d.x || 640, y = d.y || 600, R = d.r || 280, hub = y - R - 40, vel = (d.vel ?? .03) * TAU, p = d.para ?? 1e9;
    const v0 = d.arranca == null ? t : Math.max(0, t - d.arranca), mov = d.arranca == null ? v0 : v0 - (1 - Math.exp(-v0 * 1.2)) / 1.2;   // arranca: acelera suave
    const ang = (d.fase || 0) + (t < p ? vel * mov : vel * (p + (1 - Math.exp(-(t - p) * 1.4)) / 1.4));
    const luz = d.luces ?? 1; g.save(); g.fillStyle = color(d); g.strokeStyle = color(d);
    g.lineWidth = 16; g.lineCap = 'round'; for (const s of [-1, 1]) { g.beginPath(); g.moveTo(x + s * R * .62, y); g.lineTo(x, hub); g.stroke(); }   // patas en A
    g.lineWidth = 6; g.beginPath(); g.moveTo(x - R * .42, y - R * .45); g.lineTo(x + R * .42, y - R * .45); g.stroke();
    g.lineWidth = 9; g.beginPath(); g.arc(x, hub, R, 0, TAU); g.stroke(); g.lineWidth = 4; g.beginPath(); g.arc(x, hub, R * .9, 0, TAU); g.stroke();   // aro doble
    g.lineWidth = 3; for (let i = 0; i < 16; i++) { const a = ang + i * TAU / 16; g.beginPath(); g.moveTo(x, hub); g.lineTo(x + R * Math.cos(a), hub + R * Math.sin(a)); g.stroke(); }
    for (let i = 0; i < 16; i++) { const a = ang + (i + .5) * TAU / 16; g.beginPath(); g.moveTo(x + R * .9 * Math.cos(a - TAU / 32), hub + R * .9 * Math.sin(a - TAU / 32)); g.lineTo(x + R * Math.cos(a), hub + R * Math.sin(a)); g.stroke(); }   // celosía
    g.beginPath(); g.arc(x, hub, 22, 0, TAU); g.fill();
    // bombillas: una ola de luz que corre por el aro
    for (let i = 0; i < 48; i++) { const a = ang + i * TAU / 48, bx = x + R * Math.cos(a), by = hub + R * Math.sin(a), on = luz * (.45 + .55 * Math.max(0, Math.sin(i * .9 - t * 5)));
      brillo(g, bx, by, 16, '255,206,120', .5 * on); g.fillStyle = `rgba(255,${200 + 40 * on},${130 + 60 * on},${.35 + .65 * on})`; g.beginPath(); g.arc(bx, by, 3.2, 0, TAU); g.fill(); }
    // cabinas: 8 en el aro; la 0 roja y la 4 azul; las extra, en 2 y 6
    const sac = (d.sacude || []).reduce((s, q) => { const v = t - q; return v > 0 && v < 2.2 ? s + .35 * Math.exp(-v * 2) * Math.sin(v * 11) : s; }, 0);
    const extra = d.extra || [], hueco0 = [2, 6];
    for (let i = 0; i < 8; i++) {
      const a = ang + i * TAU / 8, cx = x + R * Math.cos(a), cy = hub + R * Math.sin(a), grande = i === 0 || i === 4, ex = extra[hueco0.indexOf(i)];
      let col = grande ? (i === 0 ? '#c0281c' : '#1f5fae') : null, s = grande ? 1.35 : .9, caida = 0, giro = .05 * Math.sin(t * 1.3 + i) + (grande ? sac * (i === 0 ? 1 : -1) : 0);
      if (ex) { if (t < (ex.en ?? 0)) { col = null; } else { col = ex.color; s = 1; } if (ex.cae != null && t > ex.cae) { const v = t - ex.cae; caida = 260 * v * v; giro += v * 2.4 * (i === 2 ? -1 : 1); if (cy + 40 + caida > y + 30) continue; } }
      g.save(); g.translate(cx, cy + caida); g.rotate(giro); g.scale(s, s);
      g.fillStyle = color(d); g.fillRect(-2, 0, 4, 18);                                                       // enganche
      g.beginPath(); g.moveTo(-26, 18); g.lineTo(26, 18); g.lineTo(32, 30); g.lineTo(-32, 30); g.closePath(); g.fill();   // techo
      g.fillStyle = col || color(d); g.beginPath(); g.roundRect(-28, 30, 56, 44, [2, 2, 10, 10]); g.fill();
      if (col) { g.fillStyle = `rgba(255,230,170,${.6 * luz})`; g.fillRect(-21, 35, 42, 27); brillo(g, 0, 50, 80, col === '#c0281c' ? '255,80,60' : col === '#1f5fae' ? '90,150,255' : '255,200,140', .25 * luz);
        g.fillStyle = color(d); for (const [px, h] of [[-9, 0], [9, -2]]) { g.beginPath(); g.ellipse(px, 48 + h, 4.5, 5.5, 0, 0, TAU); g.fill(); g.beginPath(); g.ellipse(px, 63 + h, 8, 8, 0, Math.PI, TAU); g.fill(); }   // dos pasajeros a contraluz
        g.fillRect(-28, 60, 56, 3); }
      g.restore();
    }
    g.restore();
  };
  // cuerda «atado y bien atado»: cruza el cuadro de (x0,y0) a (x1,y1) con su comba; se tiende de d.en a d.en + d.tiende;
  //   d.nudos: [{ u (0–1 a lo largo), en }] cada nudo se aprieta en su segundo (latigazo, destello y se queda) · d.color
  D.cuerda = (g, t, d) => {
    const [x0, y0, x1, y1] = [d.x0 ?? -60, d.y0 ?? 120, d.x1 ?? 1340, d.y1 ?? 160], k = T.suave(T.clamp((t - (d.en ?? -9)) / (d.tiende || 1.2))); if (k <= 0) return;
    const tiron = (d.nudos || []).reduce((s, n) => { const v = t - n.en; return v > 0 && v < 1.5 ? s + Math.exp(-v * 4) * Math.sin(v * 18) : s; }, 0);
    const comba = (d.comba ?? 90) * (1 - .35 * tiron) + 6 * Math.sin(t * .9);
    const P = u => [x0 + (x1 - x0) * u, y0 + (y1 - y0) * u + comba * 4 * u * (1 - u) + 4 * Math.sin(u * 9 + t * 1.6) * u * (1 - u)];
    const col = d.color || '#8a6a3e', oscuro = d.oscuro || '#2a1a0c', n = 90, m = Math.ceil(n * k);
    g.save(); g.lineCap = 'round'; g.lineJoin = 'round';
    g.strokeStyle = oscuro; g.lineWidth = (d.grosor || 12) + 4; g.beginPath(); for (let i = 0; i <= m; i++) g[i ? 'lineTo' : 'moveTo'](...P(i / n)); g.stroke();
    g.strokeStyle = col; g.lineWidth = d.grosor || 12; g.stroke();
    g.strokeStyle = oscuro; g.lineWidth = 2.2;                                                                   // trenzado
    for (let i = 0; i < m * 2; i++) { const u = i / (n * 2), [px, py] = P(u), [qx, qy] = P(u + .004), a = Math.atan2(qy - py, qx - px), w = (d.grosor || 12) * .5;
      g.beginPath(); g.moveTo(px - Math.sin(a) * w + Math.cos(a) * 3, py + Math.cos(a) * w + Math.sin(a) * 3); g.lineTo(px + Math.sin(a) * w - Math.cos(a) * 3, py - Math.cos(a) * w - Math.sin(a) * 3); g.stroke(); }
    for (const nd of d.nudos || []) { if (t < nd.en || nd.u > k) continue; const v = t - nd.en, s = 1 + .8 * Math.exp(-v * 7), [px, py] = P(nd.u);
      brillo(g, px, py, 120, '255,220,150', .7 * Math.exp(-v * 2.5));
      g.save(); g.translate(px, py); g.scale(s, s); g.fillStyle = oscuro; g.beginPath(); g.ellipse(0, 0, 21, 17, .3, 0, TAU); g.fill();
      g.fillStyle = col; g.beginPath(); g.ellipse(-2, -2, 17, 13, .3, 0, TAU); g.fill();
      g.strokeStyle = oscuro; g.lineWidth = 3; g.beginPath(); g.arc(0, 0, 10, -.6, 2.4); g.stroke(); g.beginPath(); g.moveTo(-14, 10); g.quadraticCurveTo(-6, 34, 4, 40); g.stroke();
      g.strokeStyle = col; g.lineWidth = 7; g.beginPath(); g.moveTo(-12, 12); g.quadraticCurveTo(-5, 32, 4, 38); g.stroke(); g.restore(); }
    g.restore();
  };
  // relámpagos: en cada segundo de d.en el cielo se enciende dos veces (destello doble) y cae un rayo quebrado con ramas.
  //   Va detrás de las siluetas: así las recorta. d.x (o d.xs por rayo), d.y (suelo del rayo), d.color
  D.relampago = (g, t, d) => {
    (d.en || []).forEach((p, j) => { const v = t - p; if (v < 0 || v > 1.2) return;
      const f = v < .06 ? 1 : v < .12 ? .25 : v < .2 ? .85 : .85 * Math.exp(-(v - .2) * 5), col = d.color || '225,232,255';
      g.fillStyle = `rgba(${col},${.55 * f})`; g.fillRect(-900, -600, 3100, 2000);
      if (v > .45) return; const x = (d.xs || [])[j] ?? d.x ?? 300 + 700 * A(j + 7), suelo = d.y || 560;
      const rayo = (sx, sy, len, dir, sem, w) => { let px = sx, py = sy; g.lineWidth = w; g.beginPath(); g.moveTo(px, py);
        for (let i = 0; i < 14; i++) { px += (A(sem + i) - .5) * 70 + dir * 6; py += len / 14; g.lineTo(px, py); if (w > 3 && A(sem + i + 40) < .22) { g.stroke(); rayo(px, py, len * .35, A(sem + i) < .5 ? -3 : 3, sem + i * 9, w * .45); g.lineWidth = w; g.beginPath(); g.moveTo(px, py); } }
        g.stroke(); };
      g.save(); g.shadowColor = `rgba(${col},1)`; g.shadowBlur = 30; g.strokeStyle = `rgba(255,255,255,${Math.min(1, f * 1.3)})`; g.lineJoin = 'miter';
      rayo(x, -40, suelo + 40, 0, j * 31 + 5, 5); g.restore(); });
  };
  // el General: silueta de espaldas en el balcón, sin cara (gorra de plato, capote, fajín); en d.saluda alza el brazo y lo deja
  D.general = (g, t, d) => {
    const x = d.x || 640, y = d.y || 600, e = d.escala || 1, k = d.saluda == null ? 0 : T.suave(T.clamp((t - d.saluda) / .5)) * (d.baja == null ? 1 : 1 - T.suave(T.clamp((t - d.baja) / .6)));
    g.save(); g.translate(x, y); g.scale(e, e); g.fillStyle = color(d);
    g.beginPath(); g.moveTo(-38, 0); g.lineTo(-34, -96); g.lineTo(-46, -150); g.quadraticCurveTo(-40, -176, 0, -180); g.quadraticCurveTo(40, -176, 46, -150); g.lineTo(34, -96); g.lineTo(38, 0); g.closePath(); g.fill();   // capote
    g.beginPath(); g.moveTo(-46, -150); g.quadraticCurveTo(-60, -60, -58, 0); g.lineTo(-30, 0); g.fill(); g.beginPath(); g.moveTo(46, -150); g.quadraticCurveTo(60, -60, 58, 0); g.lineTo(30, 0); g.fill();
    g.fillRect(-10, -196, 20, 18); g.beginPath(); g.ellipse(0, -210, 20, 23, 0, 0, TAU); g.fill();                      // cuello y cabeza
    g.beginPath(); g.ellipse(0, -228, 30, 9, 0, 0, TAU); g.fill(); g.beginPath(); g.moveTo(-22, -230); g.quadraticCurveTo(0, -262, 26, -236); g.closePath(); g.fill();   // gorra de plato
    g.save(); g.translate(40, -160); g.rotate(-.15 - k * 2.3); g.fillRect(-9, 0, 18, 70); g.beginPath(); g.ellipse(0, 76, 10, 12, 0, 0, TAU); g.fill(); g.restore();   // brazo
    g.fillStyle = 'rgba(160,30,20,.85)'; g.fillRect(-40, -100, 80, 10);                                         // fajín
    g.restore();
  };
  // balcón de palacio: fachada con ventanales, balaustrada y dos colgaduras al viento (d.ancho)
  D.balcon = (g, t, d) => {
    const x = d.x || 640, y = d.y || 600, w = d.ancho || 760, e = d.escala || 1; g.save(); g.translate(x, y); g.scale(e, e); g.fillStyle = color(d);
    g.fillRect(-w / 2, -720, w, 720);
    hueco(g, () => { for (const s of [-1, 1]) for (let i = 0; i < 2; i++) { const cx = s * (w / 2 - 90 - i * 150); g.rect(cx - 40, -560, 80, 180); g.moveTo(cx + 40, -560); g.arc(cx, -560, 40, 0, Math.PI, true); } });
    for (const s of [-1, 1]) for (let i = 0; i < 2; i++) { const cx = s * (w / 2 - 90 - i * 150); g.fillStyle = 'rgba(255,190,110,.28)'; g.fillRect(cx - 40, -560, 80, 180); g.fillStyle = color(d); g.fillRect(cx - 2, -560, 4, 180); g.fillRect(cx - 40, -480, 80, 4); }
    hueco(g, () => { g.rect(-80, -470, 160, 300); g.moveTo(80, -470); g.arc(0, -470, 80, 0, Math.PI, true); });                   // puerta del balcón, abierta
    const lz = .85 + .1 * Math.sin(t * 7) * Math.sin(t * 2.3), gr = g.createLinearGradient(0, -550, 0, -170);
    gr.addColorStop(0, `rgba(255,214,150,${lz})`); gr.addColorStop(1, `rgba(255,150,80,${lz})`); g.fillStyle = gr;
    g.beginPath(); g.rect(-80, -470, 160, 300); g.moveTo(80, -470); g.arc(0, -470, 80, 0, Math.PI, true); g.fill(); brillo(g, 0, -330, 330, '255,190,110', .35 * lz);
    g.fillStyle = color(d); g.fillRect(-w / 2 - 20, -170, w + 40, 26);                                           // losa
    g.fillRect(-w / 2 - 10, -244, w + 20, 14); for (let bx = -w / 2; bx <= w / 2; bx += 26) { g.beginPath(); g.ellipse(bx, -200, 7, 24, 0, 0, TAU); g.fill(); }   // balaustrada
    for (const s of [-1, 1]) { const cx = s * 150, ondula = u => 10 * Math.sin(u * 7 - t * 2.6 + s) * u;          // colgaduras
      g.fillStyle = 'rgba(150,22,14,.95)'; g.beginPath(); g.moveTo(cx - 40, -244); for (let u = 0; u <= 1; u += .1) g.lineTo(cx - 40 + ondula(u), -244 + 170 * u); g.lineTo(cx + ondula(1), -64);
      for (let u = 1; u >= 0; u -= .1) g.lineTo(cx + 40 + ondula(u), -244 + 170 * u); g.fill(); g.fillStyle = 'rgba(214,170,40,.9)'; g.fillRect(cx - 40 + ondula(.4), -190, 80, 10); g.fillStyle = color(d); }
    g.restore();
  };
  // hemiciclo en gradas (de frente): d.filas, sentados que en d.alzan levantan la mano en ola desde el centro; d.rojo = { en, parte } se tiñen
  D.hemiciclo = (g, t, d) => {
    const x = d.x || 640, y = d.y || 640, e = d.escala || 1, filas = d.filas || 6; g.save(); g.translate(x, y); g.scale(e, e);
    let n = 0; const total = Array.from({ length: filas }, (_, f) => 14 + f * 5).reduce((a, b) => a + b, 0);
    for (let f = filas - 1; f >= 0; f--) { const rx = 240 + f * 95, ry = 70 + f * 34, cuantos = 14 + f * 5;
      g.fillStyle = color(d); g.beginPath(); g.ellipse(0, -f * 26, rx + 20, ry + 14, 0, Math.PI, TAU); g.ellipse(0, -f * 26, rx - 30, ry - 18, 0, TAU, Math.PI, true); g.fill();   // grada
      for (let i = 0; i < cuantos; i++, n++) { const a = Math.PI + (i + .5) / cuantos * Math.PI, px = rx * Math.cos(a), py = -f * 26 + ry * Math.sin(a) - 22;
        const rojo = d.rojo && t > d.rojo.en + (i / cuantos) * 1.2 && n < total * d.rojo.parte;
        g.fillStyle = rojo ? '#b0231a' : color(d); g.beginPath(); g.ellipse(px, py + 14, 13, 12, 0, Math.PI, TAU); g.fill(); g.beginPath(); g.arc(px, py - 4, 8, 0, TAU); g.fill();
        if (d.alzan != null) { const k = T.suave(T.clamp((t - d.alzan - Math.abs(Math.cos(a)) * .7 - f * .05) / .25)) * (d.bajan == null ? 1 : 1 - T.clamp((t - d.bajan) / .4));
          if (k > 0) { g.strokeStyle = g.fillStyle; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(px + 9, py + 6); g.lineTo(px + 13, py + 2 - 44 * k); g.stroke(); g.beginPath(); g.ellipse(px + 13, py - 4 - 44 * k, 5, 7, 0, 0, TAU); g.fill(); } } } }
    g.restore();
  };
  // las reglas de 1977: la urna en su peana y, en cada d.piezas[i].en, cae su pieza a su sitio con su rótulo
  //   iconos: mapa (provincias), balanza (las pequeñas pesan más), cabinas (premia a los grandes), rollo (lista cerrada, se sella)
  const PIEZAS = {
    mapa(g, t) { g.fillStyle = '#d8c39a'; mapa(g, -70, -60, 140, 110); g.fill(); g.strokeStyle = '#3a2410'; g.lineWidth = 2.5; g.stroke();
      g.save(); mapa(g, -70, -60, 140, 110); g.clip(); g.lineWidth = 1.2; for (let i = 0; i < 9; i++) { g.beginPath(); g.moveTo(-70 + 140 * A(i + 3), -60); g.lineTo(-70 + 140 * A(i + 9), 50); g.stroke(); } g.restore(); },
    balanza(g, t) { g.fillStyle = '#3a2410'; g.fillRect(-4, -50, 8, 70); g.fillRect(-26, 18, 52, 6); g.save(); g.translate(0, -50); g.rotate(-.32 + .03 * Math.sin(t * 2));
      g.fillRect(-64, -3, 128, 6); g.fillStyle = '#d8c39a'; g.beginPath(); g.arc(-60, 22, 14, 0, Math.PI); g.fill(); g.beginPath(); g.arc(60, 22, 24, 0, Math.PI); g.fill(); g.restore(); },
    cabinas(g) { for (const [s, col] of [[-1, '#c0281c'], [1, '#1f5fae']]) { g.fillStyle = col; g.beginPath(); g.roundRect(s * 34 - 26, -40, 52, 46, 8); g.fill(); g.fillStyle = 'rgba(255,230,170,.7)'; g.fillRect(s * 34 - 18, -32, 36, 14); }
      g.fillStyle = '#3a2410'; for (const s of [-1, 1]) for (let i = 0; i < 2; i++) { g.beginPath(); g.roundRect(s * (90 + i * 22) - 8, -10, 16, 16, 3); g.fill(); } },
    rollo(g, t, sello) { g.fillStyle = '#efe0bd'; g.fillRect(-40, -70, 80, 120); g.fillStyle = '#c9b58a'; g.beginPath(); g.ellipse(0, -70, 44, 9, 0, 0, TAU); g.fill(); g.beginPath(); g.ellipse(0, 50, 44, 9, 0, 0, TAU); g.fill();
      g.fillStyle = '#3a2410'; for (let i = 0; i < 7; i++) g.fillRect(-28, -52 + i * 14, 40 + 16 * A(i), 4);
      if (sello > 0) { const s = 1.8 - .8 * T.clamp(sello / .15); g.save(); g.scale(s, s); g.globalAlpha = T.clamp(sello * 8); g.fillStyle = '#a3140f'; g.beginPath(); g.arc(0, 0, 26, 0, TAU); g.fill();
        g.fillStyle = '#efe0bd'; g.font = '700 22px Georgia, serif'; g.textAlign = 'center'; g.fillText('✕', 0, 8); g.textAlign = 'left'; g.restore(); } },
  };
  D.reglas = (g, t, d) => {
    const x = d.x || 640, y = d.y || 600, e = d.escala || 1, sitios = [[-330, -330], [330, -330], [-330, -90], [330, -90]];
    g.save(); g.translate(x, y); g.scale(e, e);
    g.fillStyle = color(d); g.fillRect(-90, -40, 180, 40); g.fillRect(-110, -52, 220, 14); D.urna(g, t, { x: 0, y: -52, escala: 1.5, tono: d.tono });
    (d.piezas || []).forEach((p, i) => { const v = t - p.en; if (v < 0) return; const [sx, sy] = sitios[i], k = T.clamp(v / .35), rb = v < .35 ? 0 : 14 * Math.exp(-(v - .35) * 7) * Math.sin((v - .35) * 20);
      g.save(); g.translate(sx, sy - 500 * (1 - k * k) - rb); PIEZAS[p.icono](g, t, p.sella != null ? t - p.sella : 0); g.restore();
      if (k >= 1) { g.globalAlpha = T.clamp((v - .35) / .3); g.fillStyle = '#efe0bd'; g.font = '700 20px Georgia, serif'; const w0 = g.measureText(p.texto).width + 28;
        g.fillRect(sx - w0 / 2, sy + 72, w0, 32); g.fillStyle = '#2a1708'; texto(g, p.texto, sx, sy + 95, 20); g.globalAlpha = 1; }
      if (v < .5) { g.fillStyle = `rgba(60,40,28,${.45 * (1 - v / .5)})`; for (let j = 0; j < 6; j++) { g.beginPath(); g.arc(sx + (j - 2.5) * 22 * (1 + v * 2), sy + 60, 10 + 30 * v, 0, TAU); g.fill(); } } });
    g.restore();
  };
  // el salón del banquete visto desde dentro: pared, ventanal con la gente fuera bajo la lluvia, dos lámparas de araña, mesa larga,
  //   el pastel con el mapa y dos sillones. d.cortina: cuándo se corre · d.lluvia: 0–1 · d.cortes: [{ en, partes: [n, m] }] (11/9, 10/10)
  D.salon = (g, t, d) => {
    const muro = d.muro || '#4a2a1c'; g.fillStyle = muro; g.fillRect(-900, -600, 3100, 2000);
    for (let i = 0; i < 14; i++) { g.fillStyle = i % 2 ? 'rgba(0,0,0,.08)' : 'rgba(255,200,140,.03)'; g.fillRect(-200 + i * 120, -100, 60, 800); }   // papel pintado a franjas
    const vx = 640, vy = 110, vw = 380, vh = 330;                                                                    // ventanal
    g.fillStyle = '#16233a'; g.beginPath(); g.moveTo(vx - vw / 2, vy + vh); g.lineTo(vx - vw / 2, vy + 60); g.quadraticCurveTo(vx, vy - 60, vx + vw / 2, vy + 60); g.lineTo(vx + vw / 2, vy + vh); g.fill();
    g.save(); g.clip(); const ll = d.lluvia ?? .6;
    for (let i = 0; i < 9; i++) { const px = vx - vw / 2 + 25 + i * 42, py = vy + vh - 20 + 6 * Math.sin(t * .7 + i); g.fillStyle = '#0b1220';   // la gente, fuera
      g.beginPath(); g.ellipse(px, py - 70, 15, 18, 0, 0, TAU); g.fill(); g.fillRect(px - 20, py - 52, 40, 80);
      if (A(i + 5) < .45) { g.beginPath(); g.arc(px + 4, py - 92, 34, Math.PI, 0); g.fill(); g.fillRect(px + 3, py - 92, 2, 40); } }   // paraguas
    g.strokeStyle = 'rgba(190,210,240,.5)'; g.lineWidth = 1; for (let i = 0; i < 70 * ll; i++) { const u = ((t * (1.6 + A(i)) + A(i + 3)) % 1), px = vx - vw / 2 + vw * A(i + 9) + 20 * u, py = vy - 40 + (vh + 60) * u;
      g.beginPath(); g.moveTo(px, py); g.lineTo(px - 4, py - 16); g.stroke(); }
    g.fillStyle = 'rgba(160,190,230,.08)'; g.fillRect(vx - vw / 2, vy - 60, vw, vh + 60); g.restore();
    g.fillStyle = '#1d120b'; g.fillRect(vx - 4, vy - 10, 8, vh + 10); g.fillRect(vx - vw / 2, vy + 160, vw, 6); g.lineWidth = 12; g.strokeStyle = '#1d120b';
    g.beginPath(); g.moveTo(vx - vw / 2, vy + vh); g.lineTo(vx - vw / 2, vy + 60); g.quadraticCurveTo(vx, vy - 60, vx + vw / 2, vy + 60); g.lineTo(vx + vw / 2, vy + vh); g.stroke();
    const kc = d.cortina == null ? 0 : T.suave(T.clamp((t - d.cortina) / 1.4));                                       // cortinas que se corren
    for (const s of [-1, 1]) { const borde = vx + s * (vw / 2 + 70) - s * (vw / 2 + 70) * kc; g.fillStyle = '#6e1410'; g.beginPath(); g.moveTo(vx + s * (vw / 2 + 140), vy - 80);
      g.lineTo(borde, vy - 80); for (let yy = vy - 80; yy <= vy + vh + 20; yy += 20) g.lineTo(borde + s * 10 * Math.sin(yy * .05 + t), yy); g.lineTo(vx + s * (vw / 2 + 140), vy + vh + 20); g.fill();
      g.fillStyle = 'rgba(0,0,0,.18)'; for (let i = 1; i < 5; i++) { const fx = mezclaX(borde, vx + s * (vw / 2 + 140), i / 5); g.fillRect(fx - 3, vy - 80, 6, vh + 100); } }
    for (const lx of [300, 980]) { brillo(g, lx, 110, 260, '255,200,120', .35 + .03 * Math.sin(t * 3 + lx)); g.fillStyle = '#1d120b'; g.fillRect(lx - 2, -40, 4, 110);   // lámparas de araña
      g.beginPath(); g.moveTo(lx - 70, 100); g.quadraticCurveTo(lx, 150, lx + 70, 100); g.lineTo(lx + 50, 95); g.quadraticCurveTo(lx, 130, lx - 50, 95); g.fill();
      for (let i = -3; i <= 3; i++) { g.fillStyle = '#1d120b'; g.fillRect(lx + i * 22 - 2, 82 + Math.abs(i) * 3, 4, 14); g.fillStyle = `rgba(255,${210 + 30 * Math.sin(t * 8 + i)},140,.95)`; g.beginPath(); g.ellipse(lx + i * 22, 76 + Math.abs(i) * 3, 3, 6, 0, 0, TAU); g.fill(); } }
    const my = d.mesaY || 520;                                                                                       // mesa con mantel
    for (const s of [-1, 1]) { const cx = 640 + s * 420; g.fillStyle = '#1d120b';                                    // sillones de respaldo alto, tapizados
      g.beginPath(); g.moveTo(cx - 44, my - 40); g.lineTo(cx - 40, my - 200); g.quadraticCurveTo(cx - 40, my - 236, cx - 20, my - 240); g.quadraticCurveTo(cx, my - 262, cx + 20, my - 240);
      g.quadraticCurveTo(cx + 40, my - 236, cx + 40, my - 200); g.lineTo(cx + 44, my - 40); g.closePath(); g.fill();
      g.fillStyle = s < 0 ? '#5c1712' : '#16304f'; g.beginPath(); g.roundRect(cx - 28, my - 214, 56, 160, 14); g.fill();   // tapizado: rojo y azul
      g.fillStyle = 'rgba(214,170,40,.85)'; g.beginPath(); g.arc(cx, my - 246, 6, 0, TAU); g.fill();
      for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) { g.beginPath(); g.arc(cx - 12 + j * 24, my - 180 + i * 40, 2.5, 0, TAU); g.fill(); } }
    if (!d.sinMesa) D.banquete(g, t, { ...d, mesaY: my });                                                         // sinMesa: la mesa va aparte, en `delante`
  };
  // ── Ep. 4, secuencia G: la mesa ──
  // mesa del banquete (mantel, velas, pastel). En `delante`, los títeres quedan detrás, de cintura para arriba. Opciones:
  //   d.sinPastel · d.libro (la Constitución) y d.monedas (t: cae encima la pila de la deuda) · d.togas (t: aparecen veinte juececitos;
  //   se tiñen con el último corte) · d.movil (t: vibra y se enciende) · d.cae (t: el pastel se cae) · d.vuelve (t: baja un pastel nuevo con d.cortes2)
  D.banquete = (g, t, d) => {
    const my = d.mesaY || 520, px = 640, tela = d.mantel || '#e8dcc0';
    g.fillStyle = tela; g.fillRect(140, my - 20, 1000, 24); g.beginPath(); g.moveTo(140, my + 4); for (let xx = 140; xx <= 1140; xx += 50) g.quadraticCurveTo(xx + 25, my + 30, xx + 50, my + 4); g.lineTo(1140, my + 70); g.lineTo(140, my + 70); g.fill();
    g.fillStyle = '#1d120b'; g.fillRect(140, my + 70, 1000, 200);
    for (const [cx, alt] of d.velas || [[360, 0], [920, 0], [470, 1], [810, 1]]) { g.fillStyle = '#1d120b'; g.fillRect(cx - 3, my - 60 - 20 * alt, 6, 40 + 20 * alt); g.fillStyle = `rgba(255,${200 + 40 * Math.sin(t * 9 + cx)},120,.95)`; g.beginPath(); g.ellipse(cx, my - 66 - 20 * alt, 4, 9, 0, 0, TAU); g.fill(); brillo(g, cx, my - 66 - 20 * alt, 60, '255,200,120', .3); }   // velas
    if (d.libro != null && t >= d.libro) {                                                                           // la Constitución, de pie, y la pila de la deuda encima
      g.fillStyle = '#3a0d0a'; g.fillRect(px - 92, my - 214, 184, 194); g.fillStyle = '#efe0bd'; g.fillRect(px - 92, my - 28, 184, 10);
      g.fillStyle = '#5c1712'; g.fillRect(px - 84, my - 210, 168, 180); g.fillStyle = '#d6aa28'; texto(g, 'CONSTITUCIÓN', px, my - 140, 21); texto(g, '1978', px, my - 106, 26);
      g.strokeStyle = '#d6aa28'; g.lineWidth = 2; g.strokeRect(px - 74, my - 200, 148, 160);
      if (d.monedas != null && t >= d.monedas) { const k = T.rebote(T.clamp((t - d.monedas) / .7));
        for (let i = 0; i < 9; i++) { const yy = my - 222 - i * 15 - 520 * (1 - k) * (1 + i * .08), xx = px + 6 * Math.sin(i * 2.3);
          g.fillStyle = '#8a6a1a'; g.beginPath(); g.ellipse(xx, yy + 5, 62, 13, 0, 0, TAU); g.fill(); g.fillStyle = '#d6aa28'; g.beginPath(); g.ellipse(xx, yy, 62, 13, 0, 0, TAU); g.fill(); }
        brillo(g, px, my - 300, 160, '255,215,130', .4 * Math.exp(-(t - d.monedas) * 1.5)); g.fillStyle = '#5a3a08'; texto(g, 'DEUDA', px, my - 222 - 8 * 15 + 7, 18); } }
    const cortes = [...(d.cortes || []), ...(d.vuelve != null ? d.cortes2 || [] : [])].filter(c => t >= c.en).pop();
    if (d.togas != null && t >= d.togas) for (let i = 0; i < 20; i++) {                                              // veinte vocales con toga y birrete
      const k = T.rebote(T.clamp((t - d.togas - i * .07) / .4)); if (k <= 0) continue;
      const lado = i < 10 ? -1 : 1, j = i % 10, x = px + lado * (175 + j * 30), y = my - 20, h = 54 * k;
      const col = !cortes ? '#16100c' : (lado < 0 ? j : 10 + j) < cortes.partes[0] ? '#7a1a14' : '#16305a';
      g.fillStyle = col; g.beginPath(); g.moveTo(x - 11, y); g.lineTo(x - 7, y - h * .72); g.lineTo(x + 7, y - h * .72); g.lineTo(x + 11, y); g.fill();
      g.fillStyle = '#efe0bd'; g.fillRect(x - 5, y - h * .72, 10, 5 * k); g.fillStyle = '#16100c'; g.beginPath(); g.arc(x, y - h * .83, 7 * k, 0, TAU); g.fill();
      g.fillRect(x - 8 * k, y - h - 2, 16 * k, 7 * k); }
    const pastel = (cx, cy, c) => D.pastel(g, t, { x: cx, y: cy, cortes: c, escala: d.pastel || 1 });
    if (!d.sinPastel && (d.cae == null || t < d.cae + 1.2)) { const v = d.cae == null ? 0 : Math.max(0, t - d.cae), k = T.clamp(v / 1);
      g.save(); g.translate(px + 300 * k, my - 20 + 600 * k * k); g.rotate(1.9 * k); g.translate(-px, -(my - 20)); pastel(px, my - 20, d.cortes); g.restore(); }
    if (d.vuelve != null && t >= d.vuelve) { const k = T.rebote(T.clamp((t - d.vuelve) / .8)); pastel(px, my - 20 - 560 * (1 - k), d.cortes2); }
    if (d.movil != null) { const v = t - d.movil, vib = v > 0 && v < 2.5 ? 3 * Math.sin(v * 90) * (Math.sin(v * 9) > 0) : 0, mx = (d.movilX || 1110) + vib, luz = v > 0 ? 1 : 0;   // móvil de pie en su soporte
      g.fillStyle = '#16100c'; g.beginPath(); g.roundRect(mx - 26, my - 116, 52, 96, 8); g.fill(); g.fillRect(mx - 20, my - 24, 40, 6);
      g.fillStyle = luz ? '#cfe3ff' : '#2a2a32'; g.beginPath(); g.roundRect(mx - 21, my - 110, 42, 82, 4); g.fill();
      if (luz) { brillo(g, mx, my - 70, 110, '190,220,255', .5); g.fillStyle = '#9fd88a'; g.beginPath(); g.roundRect(mx - 17, my - 92, 34, 26, 5); g.fill(); g.fillStyle = 'rgba(30,60,20,.6)'; g.fillRect(mx - 12, my - 84, 24, 3); g.fillRect(mx - 12, my - 77, 16, 3); } }
  };
  // reloj de pared: corre deprisa entre d.corre y d.para (los años que pasan); d.x, d.y, d.r
  D.reloj = (g, t, d) => {
    const x = d.x || 1180, y = d.y || 180, r = d.r || 46, v = Math.max(0, Math.min(t, d.para ?? 1e9) - (d.corre ?? 1e9)), giro = t / 60 + v * 4;
    g.fillStyle = '#1d120b'; g.beginPath(); g.arc(x, y, r + 8, 0, TAU); g.fill(); g.fillStyle = '#e8dcc0'; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
    g.fillStyle = '#1d120b'; for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; g.fillRect(x + Math.sin(a) * (r - 8) - 2, y - Math.cos(a) * (r - 8) - 2, 4, 4); }
    g.strokeStyle = '#1d120b'; g.lineCap = 'round'; for (const [a, l, w] of [[giro / 12 * TAU, r * .5, 5], [giro * TAU, r * .8, 3]]) { g.lineWidth = w; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.sin(a) * l, y - Math.cos(a) * l); g.stroke(); }
    g.fillRect(x - 3, y + r + 6, 6, 70); g.beginPath(); g.arc(x + 26 * Math.sin(t * 3), y + r + 80, 12, 0, TAU); g.fill(); };   // péndulo
  // telarañas en las esquinas que aparecen en d.en y se van en d.hasta
  D.telaranas = (g, t, d) => {
    const a = T.clamp((t - (d.en ?? 1e9)) / 1.5) * (1 - T.clamp((t - (d.hasta ?? 1e9)) / .6)); if (a <= 0) return;
    g.save(); g.strokeStyle = `rgba(230,225,215,${.55 * a})`; g.lineWidth = 1.3;
    for (const [cx, cy, sx, sy, r] of d.donde || [[0, 0, 1, 1, 230], [1280, 0, -1, 1, 200], [140, 500, 1, -1, 120], [1140, 500, -1, -1, 120]]) {
      for (let i = 0; i <= 6; i++) { const ang = i / 6 * Math.PI / 2; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + sx * Math.cos(ang) * r * a, cy + sy * Math.sin(ang) * r * a); g.stroke(); }
      for (let k = 1; k <= 5; k++) { const rr = r * a * k / 5; g.beginPath(); for (let i = 0; i <= 6; i++) { const ang = i / 6 * Math.PI / 2, px = cx + sx * Math.cos(ang) * rr, py = cy + sy * Math.sin(ang) * rr; i ? g.quadraticCurveTo(cx + sx * Math.cos(ang - .13) * rr * .9, cy + sy * Math.sin(ang - .13) * rr * .9, px, py) : g.moveTo(px, py); } g.stroke(); } }
    g.restore(); };
  // estandarte azul con el círculo de doce estrellas que se desenrolla desde arriba en d.en (Bruselas); d.x, d.y (arriba), d.ancho, d.alto
  D.estandarte = (g, t, d) => {
    const k = T.suave(T.clamp((t - (d.en ?? 1e9)) / .9)); if (k <= 0) return; const x = d.x || 640, y = d.y || 60, w = d.ancho || 260, h = (d.alto || 300) * k;
    g.fillStyle = '#1d120b'; g.fillRect(x - w / 2 - 20, y - 8, w + 40, 10); g.fillStyle = '#123a8c'; g.beginPath(); g.moveTo(x - w / 2, y); g.lineTo(x + w / 2, y);
    for (let yy = y; yy <= y + h; yy += 20) g.lineTo(x + w / 2 + 4 * Math.sin(yy * .05 + t * 1.3), yy); g.lineTo(x - w / 2, y + h); g.closePath(); g.fill();
    g.save(); g.beginPath(); g.rect(x - w / 2, y, w, h); g.clip(); g.fillStyle = '#f2c81e'; const cy = y + (d.alto || 300) * .42, R = w * .3;
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU, sx = x + Math.sin(a) * R, sy = cy - Math.cos(a) * R; g.beginPath(); for (let j = 0; j < 10; j++) { const b = j / 10 * TAU, q = j % 2 ? 4 : 10; g.lineTo(sx + Math.sin(b) * q, sy - Math.cos(b) * q); } g.fill(); }
    g.restore(); brillo(g, x, cy, 220, '255,220,120', .3 * Math.exp(-(t - d.en) * 1.2)); };
  const mezclaX = (a, b, k) => a + (b - a) * k;
  // el encasillado: mapa de Españistán en un tablero con casillas; desde d.en se van rellenando nombres (d.ritmo casillas/s) antes de votar
  D.encasillado = (g, t, d) => {
    const x = d.x || 640, y = d.y || 330, w = d.ancho || 520, h = w * .78; g.save(); g.translate(x - w / 2, y - h / 2);
    g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(10, 10, w, h + 50); g.fillStyle = '#e6d6b0'; g.fillRect(0, 0, w, h + 50);
    g.fillStyle = '#2a1708'; texto(g, d.titulo || 'ENCASILLADO', w / 2, 34, 24); g.fillRect(30, 46, w - 60, 2);
    g.save(); g.translate(30, 60); const mw = w - 60, mh = h - 20; mapa(g, 0, 0, mw, mh); g.fillStyle = '#d2bd8e'; g.fill(); g.strokeStyle = '#3a2410'; g.lineWidth = 2; g.stroke();
    mapa(g, 0, 0, mw, mh); g.clip(); const cols = 8, filas = 6, hechos = Math.max(0, (t - (d.en ?? 1e9)) * (d.ritmo || 6));
    let n = 0; for (let f = 0; f < filas; f++) for (let c = 0; c < cols; c++, n++) { const cx = c * mw / cols, cy = f * mh / filas; g.strokeStyle = 'rgba(58,36,16,.5)'; g.lineWidth = 1; g.strokeRect(cx, cy, mw / cols, mh / filas);
      const k = T.clamp(hechos - A(n + 3) * 40); if (k <= 0) continue; g.fillStyle = A(n) < .5 ? `rgba(150,30,20,${.85 * k})` : `rgba(30,60,120,${.85 * k})`;   // el escaño ya tiene dueño
      g.fillRect(cx + 4, cy + 4 + (1 - k) * 10, mw / cols - 8, 6); g.fillRect(cx + 4, cy + 13 + (1 - k) * 10, (mw / cols - 8) * .6, 4); }
    g.restore(); g.restore();
  };
  // el puchero: olla de barro con tapa que humea; aparece en d.en cayendo con golpe y polvo (sustituye a la urna)
  D.puchero = (g, t, d) => {
    const v = t - (d.en ?? -9); if (v < 0) return; const x = d.x, y = d.y || 600, e = d.escala || 1, k = T.clamp(v / .22), rb = v < .22 ? 0 : 10 * Math.exp(-(v - .22) * 8) * Math.sin((v - .22) * 22);
    g.save(); g.translate(x, y - 300 * (1 - k * k) - rb); g.scale(e, e); g.fillStyle = color(d);
    g.beginPath(); g.moveTo(-50, -10); g.quadraticCurveTo(-74, -60, -46, -100); g.lineTo(46, -100); g.quadraticCurveTo(74, -60, 50, -10); g.quadraticCurveTo(0, 6, -50, -10); g.fill();
    for (const s of [-1, 1]) { g.beginPath(); g.ellipse(s * 64, -78, 14, 9, 0, 0, TAU); g.fill(); }
    g.beginPath(); g.ellipse(0, -104, 54, 10, 0, 0, TAU); g.fill(); g.fillRect(-8, -126, 16, 18);
    g.fillStyle = 'rgba(240,228,200,.9)'; for (let i = 0; i < 3; i++) { g.save(); g.translate(-10 + i * 10, -112); g.rotate(-.3 + .3 * i); g.fillRect(-7, -22, 14, 20); g.restore(); }   // papeletas que asoman
    g.restore();
    for (let i = 0; i < 6; i++) { const u = ((t * .5 + i / 6) % 1); g.fillStyle = `rgba(240,228,200,${.25 * (1 - u)})`; g.beginPath(); g.arc(x + 10 * Math.sin(u * 6 + i), y - 140 * e - u * 120, 10 + 16 * u, 0, TAU); g.fill(); }   // vapor
    if (v > .2 && v < 1.1) { const u = (v - .2) / .9; for (let i = 0; i < 10; i++) { g.fillStyle = `rgba(90,62,40,${.28 * (1 - u) * (.6 + .4 * A(i))})`;   // polvo del golpe
      g.beginPath(); g.arc(x + (i - 4.5) * 18 * (1 + u * 3) * e, y - 8 - 30 * u * A(i + 4), (10 + 40 * u) * (.6 + .6 * A(i + 9)) * e, 0, TAU); g.fill(); } }
  };
  // la bota del general: baja del cielo en d.en y pisa (d.x, d.y); se queda apoyada
  D.bota = (g, t, d) => {
    const v = t - (d.en ?? -9); if (v < -.6) return; const k = T.suave(T.clamp((v + .6) / .6)), e = d.escala || 1;
    g.save(); g.translate(d.x, (d.y || 300) - 900 * (1 - k)); g.scale(e, e); g.fillStyle = color(d);
    g.fillRect(-60, -620, 120, 520); g.beginPath(); g.moveTo(-70, -100); g.lineTo(70, -100); g.lineTo(80, -40); g.quadraticCurveTo(220, -40, 230, 0); g.lineTo(-74, 0); g.closePath(); g.fill();   // caña y pie
    g.fillRect(-80, 0, 300, 18); g.fillRect(-70, 18, 60, 20);                                                    // suela y tacón
    g.fillStyle = 'rgba(214,170,40,.85)'; g.fillRect(-60, -160, 120, 10); g.beginPath(); g.arc(70, -70, 8, 0, TAU); g.fill();   // hebilla y espuela
    g.restore();
    if (v > 0 && v < 1) destello(g, d.x + 60 * e, d.y || 300, 160 * e, v, '255,200,140');
  };
  // el pastel: tarta de dos pisos con el mapa encima; d.cortes: [{ en, partes: [rojas, azules] }] lo reparte (porciones de colores)
  D.pastel = (g, t, d) => {
    const e = d.escala || 1; g.save(); g.translate(d.x || 640, d.y || 500); g.scale(e, e);
    g.fillStyle = '#b8a27a'; g.fillRect(-12, -10, 24, 10); g.fillStyle = '#d9cfb8'; g.beginPath(); g.ellipse(0, -8, 130, 14, 0, 0, TAU); g.fill();   // bandeja
    g.fillStyle = '#7a3e22'; g.fillRect(-110, -78, 220, 66); g.fillStyle = '#efe0bd'; for (let i = 0; i < 11; i++) { g.beginPath(); g.arc(-100 + i * 20, -78, 10, 0, Math.PI); g.fill(); }
    g.fillStyle = '#6a3420'; g.fillRect(-80, -128, 160, 50); g.fillStyle = '#efe0bd'; g.beginPath(); g.ellipse(0, -128, 82, 14, 0, 0, TAU); g.fill();
    const corte = (d.cortes || []).filter(c => t >= c.en).pop();
    g.save(); g.translate(0, -130); g.scale(1, .18); mapa(g, -70, -55, 140, 110); g.fillStyle = '#d8c39a'; g.fill();
    if (corte) { const [r, a] = corte.partes, n = r + a, k = T.clamp((t - corte.en) / .5); g.save(); mapa(g, -70, -55, 140, 110); g.clip();
      for (let i = 0; i < n; i++) { if (i / n > k) break; g.fillStyle = i < r ? '#c0281c' : '#1f5fae'; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, 120, -Math.PI / 2 + i / n * TAU, -Math.PI / 2 + (i + 1) / n * TAU); g.fill();
        g.strokeStyle = '#efe0bd'; g.lineWidth = 3; g.stroke(); } g.restore(); }
    g.restore(); g.restore();
  };

  // corona que baja del cielo en d.en y se queda flotando con un brillo (el Rey que elige): d.x, d.y, d.escala, d.color
  D.corona = (g, t, d) => {
    if (d.en == null || t < d.en) return; const k = T.rebote(T.clamp((t - d.en) / .8)), e = d.escala || 1, y = (d.y || 150) - 260 * (1 - k) + 5 * Math.sin(t * 1.4);
    brillo(g, d.x || 640, y - 30 * e, 150 * e, '255,215,130', .45 * T.clamp((t - d.en) / .8));
    g.save(); g.translate(d.x || 640, y); g.scale(e, e); g.fillStyle = d.color || '#c9a24a';
    g.beginPath(); g.moveTo(-70, 0); g.lineTo(-80, -70); g.lineTo(-40, -36); g.lineTo(0, -86); g.lineTo(40, -36); g.lineTo(80, -70); g.lineTo(70, 0); g.closePath(); g.fill();
    g.fillRect(-72, -4, 144, 18); g.fillStyle = '#7a1410'; for (const cx of [-40, 0, 40]) { g.beginPath(); g.arc(cx, 5, 6, 0, TAU); g.fill(); }
    g.fillStyle = d.color || '#c9a24a'; for (const [cx, cy] of [[-80, -70], [0, -86], [80, -70]]) { g.beginPath(); g.arc(cx, cy - 6, 8, 0, TAU); g.fill(); }
    g.restore(); };

  // ── Ep. 4, secuencias E–F: los hilos ──
  // mano gigante que baja de lo alto (dedos hacia abajo, puño de la manga arriba); `coge` = dedos cerrados sobre algo
  const mano = (g, x, y, e, giro = 0, coge = 0, col = N) => {
    g.save(); g.translate(x, y); g.rotate(giro); g.scale(e, e); g.fillStyle = col;
    g.fillRect(-30, -420, 60, 360); g.fillRect(-36, -78, 72, 22);                                                // manga y puño
    g.beginPath(); g.ellipse(0, -10, 32, 44, 0, 0, TAU); g.fill();                                                // palma
    for (let i = 0; i < 4; i++) { const fx = -21 + i * 14, l = (46 - 6 * Math.abs(i - 1.5)) * (1 - .45 * coge);
      g.beginPath(); g.roundRect(fx - 6, 14, 12, l, 6); g.fill(); }
    g.save(); g.translate(-30, -8); g.rotate(.6 - .5 * coge); g.beginPath(); g.roundRect(-6, 0, 12, 40, 6); g.fill(); g.restore();   // pulgar
    g.restore(); };
  D.mano = (g, t, d) => { const y = (d.baja ? d.baja[1] + (d.baja[2] - d.baja[1]) * T.suave(T.clamp((t - d.baja[0]) / 1.2)) : d.y || 200) + 6 * Math.sin(t * .8), e = d.escala || 1;
    if (d.hilos) { const k = T.suave(T.clamp((t - (d.crecen ?? -9)) / 1.2)); g.strokeStyle = 'rgba(235,225,205,.85)'; g.lineWidth = 2;
      d.hilos.forEach(([hx, hy], i) => { const fx = d.x + (-21 + (i % 4) * 14) * e, fy = y + 50 * e; g.beginPath(); g.moveTo(fx, fy); g.lineTo(fx + (hx - fx) * k, fy + (hy - fy) * k); g.stroke(); }); }
    mano(g, d.x, y, e, d.giro || 0, d.coge || 0, color(d)); };
  // sello que cae y se queda (d.en, d.texto con \n, d.giro, d.escala, d.color); golpe con un temblor
  D.sello = (g, t, d) => {
    if (t < d.en) return; const v = t - d.en, k = T.clamp(v / .14), s = (2.2 - 1.2 * k) * (d.escala || 1), tiembla = v > .14 ? 3 * Math.exp(-(v - .14) * 9) * Math.sin(v * 70) : 0;
    const lineas = (d.texto || 'SELLO').split('\n'), w = d.ancho || 420, h = 60 + 54 * lineas.length, col = d.color || '#a3140f';
    g.save(); g.translate(d.x || 640, (d.y || 360) + tiembla); g.rotate(d.giro ?? -.12); g.scale(s, s); g.globalAlpha = T.clamp(k * 1.5);
    g.strokeStyle = col; g.lineWidth = 10; g.strokeRect(-w / 2, -h / 2, w, h); g.lineWidth = 3; g.strokeRect(-w / 2 + 12, -h / 2 + 12, w - 24, h - 24);
    g.fillStyle = col; lineas.forEach((l, i) => texto(g, l, 0, -h / 2 + 76 + i * 54, 48)); g.restore(); };
  // el voto de Rousseau: una mano baja y echa la papeleta en la urna (d.echa); al salir, un grillete se le cierra en la muñeca (d.grillete) y tira la cadena
  D.voto = (g, t, d) => {
    const x = d.x || 640, y = d.y || 600, e = d.escala || 1;
    D.urna(g, t, { x, y, escala: 1.6 * e, tono: d.tono });
    const baja = T.suave(T.clamp((t - d.echa + 1.6) / 1.2)), sube = T.suave(T.clamp((t - d.echa - .7) / 1.1));
    const tir = d.grillete != null && t > d.grillete + .5 ? 18 * Math.exp(-(t - d.grillete - .5) * 3) * Math.sin((t - d.grillete - .5) * 14) : 0;
    const hy = y - 1.6 * e * 150 - 120 - 380 * (1 - baja) - 70 * sube + tir, hx = x + 40 * sube;
    if (t < d.echa + .45) { const cae = T.clamp((t - d.echa) / .45); g.save(); g.beginPath(); g.rect(x - 300, -2000, 600, 2000 + y - 1.6 * e * 150 + 6); g.clip();   // la papeleta entra por la ranura
      g.fillStyle = '#efe0bd'; g.fillRect(hx - 30, hy + 52 + 90 * cae, 60, 80); g.fillStyle = '#3a2410'; g.fillRect(hx - 18, hy + 70 + 90 * cae, 36, 4); g.fillRect(hx - 18, hy + 82 + 90 * cae, 26, 4); g.restore(); }
    mano(g, hx, hy, e, 0, t < d.echa ? 1 : 0, color(d));
    if (d.grillete != null && t > d.grillete) { const k = T.clamp((t - d.grillete) / .16), s = 1.7 - .7 * k, cy = hy - 95;
      g.strokeStyle = '#6d6a64'; g.lineWidth = 14; g.lineCap = 'round';
      g.lineWidth = 6; for (let i = 0; i < 26; i++) { const lx = hx + 58 + i * 34 * k, ly = cy + i * 3 + 4 * Math.sin(i * 1.3 + t * 3) * (1 - k);   // cadena de eslabones hacia fuera
        g.beginPath(); g.ellipse(lx, ly, 20, i % 2 ? 6 : 11, .08, 0, TAU); g.stroke(); }
      g.save(); g.translate(hx, cy); g.scale(s, s); g.strokeStyle = '#8c8880'; g.lineWidth = 16; g.beginPath(); g.ellipse(0, 0, 46, 18, 0, 0, TAU); g.stroke();
      g.strokeStyle = '#3a3834'; g.lineWidth = 4; g.beginPath(); g.ellipse(0, 0, 46, 18, 0, 0, TAU); g.stroke(); g.restore(); } };
  // diputados-marioneta: cada títere cuelga con tres hilos (cabeza y manos) de la cruceta que agarra una mano en lo alto.
  //   d.uno: un solo títere grande en (d.x, d.y); si no, gradas de hemiciclo (d.filas). d.mano: { x, y, escala } (sin mano, los hilos se pierden arriba)
  //   d.crecen: los hilos nacen del títere y suben (s). d.rebeldes: { n, en, multa }: n títeres tiran al revés (hilos tensos) y en la multa vuelven de golpe con su marca roja
  //   d.mira: [[t, a]] hacia dónde mira el títere suelto (a en radianes: 0 = derecha, -π/2 = arriba, π = izquierda; null = de frente)
  D.marionetas = (g, t, d) => {
    const x = d.x || 640, y = d.y || 640, e = d.escala || 1, M = d.mano, k = d.crecen == null ? 1 : T.suave(T.clamp((t - d.crecen) / 1.4));
    const tiron = M && d.rebeldes && t > d.rebeldes.multa ? 40 * Math.exp(-(t - d.rebeldes.multa) * 4) : 0;
    const bx = M ? M.x : x, by = M ? M.y + 70 * (M.escala || 1) - tiron + 6 * Math.sin(t * .8) : -600;
    const pos = [];
    if (d.uno) pos.push({ px: x, py: y, s: e * 3, i: 0, f: 0 });
    else for (let f = (d.filas || 6) - 1; f >= 0; f--) { const rx = 240 + f * 95, ry = 70 + f * 34, cuantos = 14 + f * 5;
      g.fillStyle = color(d); g.beginPath(); g.ellipse(x, y - f * 26 * e, (rx + 20) * e, (ry + 14) * e, 0, Math.PI, TAU); g.ellipse(x, y - f * 26 * e, (rx - 30) * e, (ry - 18) * e, 0, TAU, Math.PI, true); g.fill();
      for (let i = 0; i < cuantos; i++) { const a = Math.PI + (i + .5) / cuantos * Math.PI; pos.push({ px: x + rx * Math.cos(a) * e, py: y + (-f * 26 + ry * Math.sin(a) - 2) * e, s: e * .62, i: pos.length, f, a }); } }
    const R = d.rebeldes, rebelde = new Set(R ? pos.map(p => p.i).sort((a, b) => A(a + 77) - A(b + 77)).slice(0, R.n) : []);
    const mira = (d.mira || []).filter(m => t >= m[0]).pop();
    // títeres de atrás hacia delante, y luego los hilos por encima (cogen la luz del foco)
    const hilos = [];
    for (const p of pos) { const r = rebelde.has(p.i), sw = Math.sin(t * 1.7 + p.i * 1.3);
      const tira = r && t > R.en ? T.suave(T.clamp((t - R.en - A(p.i) * .6) / .5)) * (t > R.multa ? 1 - T.rebote(T.clamp((t - R.multa) / .35)) : 1) : 0;
      const lean = .05 * sw * (d.uno ? .4 : 1) + tira * (p.a == null || Math.cos(p.a) > 0 ? .45 : -.45), c = Math.cos(lean), sn = Math.sin(lean), s = p.s;
      const W = (lx, ly) => [p.px + s * (lx * c - ly * sn), p.py + s * (lx * sn + ly * c)], hy = -68 - 8 * sw - 10 * tira;
      g.save(); g.translate(p.px, p.py); g.rotate(lean); g.scale(s, s); g.fillStyle = color(d);
      g.fillRect(-10, -42, 8, 42); g.fillRect(2, -42, 8, 42);                                                    // piernas
      g.beginPath(); g.moveTo(-17, -40); g.lineTo(-15, -86); g.lineTo(15, -86); g.lineTo(17, -40); g.closePath(); g.fill();   // chaqueta
      g.strokeStyle = g.fillStyle; g.lineWidth = 7; g.lineCap = 'round';
      for (const sx of [-1, 1]) { g.beginPath(); g.moveTo(sx * 14, -82); g.lineTo(sx * 25, hy + sx * 3 * sw); g.stroke(); g.beginPath(); g.arc(sx * 25, hy + sx * 3 * sw, 4.5, 0, TAU); g.fill(); }
      g.fillRect(-4, -94, 8, 10); g.beginPath(); g.arc(0, -101, 12, 0, TAU); g.fill();                         // cuello y cabeza
      if (d.uno && mira && mira[1] != null) { g.beginPath(); g.moveTo(10 * Math.cos(mira[1] - .4), -101 + 10 * Math.sin(mira[1] - .4)); g.lineTo(17 * Math.cos(mira[1]), -101 + 17 * Math.sin(mira[1])); g.lineTo(10 * Math.cos(mira[1] + .4), -101 + 10 * Math.sin(mira[1] + .4)); g.fill(); }   // nariz: hacia dónde mira
      if (r && R.multa != null && t > R.multa) { g.fillStyle = '#b0231a'; g.beginPath(); g.arc(0, -66, 6, 0, TAU); g.fill(); }   // la marca de la multa
      g.restore();
      for (const [lx, ly, dx] of [[0, -113, 0], [-25, hy - 3 * sw, -1], [25, hy + 3 * sw, 1]]) hilos.push({ a: W(lx, ly), b: [bx + dx * 34 * (M ? M.escala || 1 : 1) + (M ? 0 : (p.px - x) * .3), by], r: r && tira > .05 }); }
    g.save(); g.lineCap = 'round';
    for (const h of hilos) { const [ax, ay] = h.a, [cx, cy] = h.b, ex = ax + (cx - ax) * k, ey = ay + (cy - ay) * k, comba = h.r ? 0 : 10 * (1 - k * .5), vib = h.r ? 1.5 * Math.sin(t * 60 + ax) : 0;
      g.strokeStyle = h.r ? 'rgba(255,190,150,.95)' : `rgba(235,220,185,${d.uno ? .85 : .45})`; g.lineWidth = h.r ? 2 : (d.uno ? 2 : 1.1);
      g.beginPath(); g.moveTo(ax, ay); g.quadraticCurveTo((ax + ex) / 2 + comba + vib, (ay + ey) / 2, ex, ey); g.stroke(); }
    g.restore();
    if (M) { const me = M.escala || 1; g.fillStyle = '#4a3a2a'; g.fillRect(bx - 40 * me, by - 4 * me, 80 * me, 8 * me); g.fillRect(bx - 4 * me, by - 26 * me, 8 * me, 40 * me);   // cruceta
      mano(g, bx, by - 30 * me, me, 0, 1, color(d)); } };
  // papeleta del Senado (sepia): se despliega en d.abre como un mapa; columnas de partidos con nombres y casillas; d.cruces: [segundos] en que se marca una cruz
  D.senado = (g, t, d) => {
    const x = d.x || 640, y = d.y || 600, e = d.escala || 1, k = T.suave(T.clamp((t - (d.abre ?? -9)) / .9)); if (k <= 0) return;
    const w = 760, h = 440; g.save(); g.translate(x, y); g.scale(e, e * k);
    g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(-w / 2 + 10, -h + 10, w, h); g.fillStyle = '#d9c29a'; g.fillRect(-w / 2, -h, w, h);
    g.strokeStyle = 'rgba(90,60,30,.25)'; g.lineWidth = 2; for (const fx of [-w / 6, w / 6]) { g.beginPath(); g.moveTo(fx, -h); g.lineTo(fx, 0); g.stroke(); }   // pliegues
    g.fillStyle = '#2a1708'; texto(g, 'SENADO', 0, -h + 44, 34); g.font = '400 18px Georgia, serif'; g.textAlign = 'center'; g.fillText('Marque con una cruz hasta tres nombres', 0, -h + 72); g.textAlign = 'left';
    const cruces = (d.cruces || []).map((c, j) => [c, [[0, 1], [2, 3], [3, 0]][j % 3]]);
    for (let c = 0; c < 4; c++) { const cx = -w / 2 + 30 + c * (w - 60) / 4; g.fillStyle = '#5a3a1a'; g.fillRect(cx, -h + 92, (w - 60) / 4 - 16, 22);
      for (let r = 0; r < 6; r++) { const ry = -h + 136 + r * 46; g.strokeStyle = '#2a1708'; g.lineWidth = 2.5; g.strokeRect(cx, ry, 26, 26);
        g.fillStyle = '#3a2410'; g.fillRect(cx + 36, ry + 10, 90 - 30 * A(c * 7 + r), 6);
        for (const [ct, [cc, rr]] of cruces) if (cc === c && rr === r && t > ct) { const m = T.clamp((t - ct) / .25); g.strokeStyle = '#1a3a8a'; g.lineWidth = 5;
          g.beginPath(); g.moveTo(cx + 2, ry + 2); g.lineTo(cx + 2 + 22 * Math.min(1, m * 2), ry + 2 + 22 * Math.min(1, m * 2)); if (m > .5) { g.moveTo(cx + 24, ry + 2); g.lineTo(cx + 24 - 22 * (m * 2 - 1), ry + 2 + 22 * (m * 2 - 1)); } g.stroke(); } } }
    g.restore(); };

  // ── Ep. 4, secuencia H: la puerta giratoria ──
  // avenida de rascacielos a contraluz (d.y suelo, d.tono lejanía, d.n edificios): ventanas que se encienden al azar
  D.rascacielos = (g, t, d) => {
    const y = d.y || 600, n = d.n || 11; g.fillStyle = color(d);
    for (let i = 0; i < n; i++) { const w = 70 + 70 * A(i + 41), h = 220 + 300 * A(i + 43), x = -200 + i * (1700 / n) + 30 * A(i + 47);
      g.fillStyle = color(d); g.fillRect(x, y - h, w, h); if (A(i + 49) < .4) g.fillRect(x + w / 2 - 2, y - h - 40, 4, 40);
      for (let r = 0; r < h / 26 - 1; r++) for (let c = 0; c < w / 18 - 1; c++) if (A(i * 97 + r * 13 + c) < .22 + .1 * Math.sin(t * .3 + i + r)) {
        g.fillStyle = 'rgba(255,190,110,.55)'; g.fillRect(x + 8 + c * 18, y - h + 14 + r * 26, 8, 12); } } };
  // la torre de la eléctrica (genérica, sin marca real): un rayo en lo alto que se enciende en d.enciende y late; d.x, d.alto
  D.torre = (g, t, d) => {
    const x = d.x || 1050, y = d.y || 600, h = d.alto || 520, w = d.ancho || 230; g.fillStyle = color(d);
    g.beginPath(); g.moveTo(x - w / 2, y); g.lineTo(x - w / 2 + 20, y - h); g.lineTo(x + w / 2 - 20, y - h); g.lineTo(x + w / 2, y); g.fill();
    g.fillRect(x - 4, y - h - 70, 8, 70);
    for (let r = 0; r < h / 30 - 2; r++) for (let c = 0; c < 6; c++) if (A(r * 7 + c + 300) < .55) { g.fillStyle = 'rgba(255,200,120,.45)'; g.fillRect(x - w / 2 + 34 + c * (w - 60) / 6, y - h + 90 + r * 30, 14, 14); }
    const k = d.enciende == null ? 0 : T.clamp((t - d.enciende) / .4), late = k * (.85 + .15 * Math.sin(t * 5));
    if (k > 0) brillo(g, x, y - h + 40, 200, '255,210,90', .55 * late);
    g.fillStyle = k > 0 ? `rgba(255,${200 + 40 * late},90,${.4 + .6 * late})` : 'rgba(70,50,30,.9)';
    g.beginPath(); g.moveTo(x + 8, y - h + 4); g.lineTo(x - 24, y - h + 48); g.lineTo(x - 2, y - h + 48); g.lineTo(x - 12, y - h + 86); g.lineTo(x + 26, y - h + 36); g.lineTo(x + 4, y - h + 36); g.closePath(); g.fill(); };
  // puerta giratoria de cristal (va en `delante`): cuatro hojas que giran desde d.arranca (d.vel vueltas/s); destellos en d.destellos
  D.puerta = (g, t, d) => {
    const x = d.x || 640, y = d.y || 600, R = d.r || 110, H = d.alto || 300, v = d.vel || .25, giro = Math.max(0, t - (d.arranca ?? 0)) * v * TAU;
    g.fillStyle = 'rgba(30,20,14,.95)'; g.fillRect(x - R - 20, y - H - 40, 2 * R + 40, 40); g.fillRect(x - R - 20, y - 8, 2 * R + 40, 10);   // techo y suelo
    g.fillStyle = 'rgba(255,215,150,.9)'; g.font = '700 18px Georgia, serif'; g.textAlign = 'center'; g.fillText(d.texto || 'SALIDA', x, y - H - 14); g.textAlign = 'left';
    g.fillStyle = 'rgba(180,215,235,.10)'; g.fillRect(x - R, y - H, 2 * R, H);                                         // el tambor de cristal
    const hojas = [0, 1, 2, 3].map(i => giro + i * Math.PI / 2).sort((a, b) => Math.cos(a) - Math.cos(b));            // de atrás a delante
    for (const a of hojas) { const px = x + R * Math.sin(a), delante = Math.cos(a), w = Math.abs(R * Math.sin(a + .01) - R * Math.sin(a)) * 0 + 6;
      g.fillStyle = `rgba(190,225,245,${.16 + .14 * Math.max(0, delante)})`; g.beginPath(); g.moveTo(x, y - H); g.lineTo(px, y - H); g.lineTo(px, y); g.lineTo(x, y); g.fill();
      g.fillStyle = 'rgba(30,20,14,.9)'; g.fillRect(px - 3, y - H, w, H); if (delante > 0) { g.fillStyle = 'rgba(255,240,220,.25)'; g.fillRect(x + (px - x) * .3, y - H + 20, 3, H - 40); } }
    g.fillStyle = 'rgba(30,20,14,.95)'; g.fillRect(x - 4, y - H, 8, H); for (const s of [-1, 1]) g.fillRect(x + s * R - 6, y - H, 12, H);
    for (const e of d.destellos || []) { const u = t - e; if (u > 0 && u < .6) brillo(g, x, y - H / 2, 260, '255,235,180', .8 * (1 - u / .6)); } };

  // penumbra: todo a oscuras salvo un círculo de luz (d.x, d.y, d.r); d.a = cuánto oscurece; d.en la va cerrando (de luz a oscuro en 1,5 s)
  D.penumbra = (g, t, d) => {
    const k = d.en == null ? 1 : T.clamp((t - d.en) / 1.5), x = d.x || 640, y = d.y || 380, r = d.r || 480;
    const gr = g.createRadialGradient(x, y, r * .15, x, y, r); gr.addColorStop(0, 'rgba(6,3,2,0)'); gr.addColorStop(1, `rgba(6,3,2,${(d.a ?? .85) * k})`);
    g.fillStyle = gr; g.fillRect(-900, -600, 3100, 2000); };
  // ── Ep. 5, «La casa de los dos»: la vivienda ──
  // cuarto de Lucía y Dani: papel pintado, ventana con lluvia y la noria a lo lejos, pósters de los quince años y lámpara de pie.
  // d.lluvia (0–1), d.ventana (x del centro de la ventana)
  D.cuarto = (g, t, d) => {
    g.fillStyle = '#3d2417'; g.fillRect(-900, -600, 3100, 2000);
    for (let i = 0; i < 34; i++) { g.fillStyle = i % 2 ? 'rgba(0,0,0,.1)' : 'rgba(255,200,140,.035)'; g.fillRect(-400 + i * 70, -200, 35, 900); }
    const vx = d.ventana ?? 950, vy = 140, vw = 280, vh = 240;
    const cielo = g.createLinearGradient(0, vy, 0, vy + vh); cielo.addColorStop(0, d.amanece ? '#3a4a78' : '#0b1430'); cielo.addColorStop(1, d.amanece ? '#f0a860' : '#22325a'); g.fillStyle = cielo; g.fillRect(vx - vw / 2, vy, vw, vh);
    g.save(); g.beginPath(); g.rect(vx - vw / 2, vy, vw, vh); g.clip();
    if (d.grua != null) { const gx = vx + 50, gy = vy + vh - 30, giro = .6 * Math.sin(Math.max(0, t - d.grua) * .5);   // al amanecer: una grúa que arranca (d.grua)
      brillo(g, vx + 90, vy + vh, 160, '255,200,130', .35); g.fillStyle = '#1a1420'; g.fillRect(gx - 3, gy - 150, 6, 150);
      g.save(); g.translate(gx, gy - 150); g.scale(Math.cos(giro), 1); g.fillRect(-40, -4, 150, 5); g.fillRect(90, 0, 1.5, 40 + 25 * Math.sin(Math.max(0, t - d.grua) * .9)); g.restore();
      g.fillStyle = `rgba(255,190,90,${t > d.grua ? .6 + .4 * Math.sin(t * 6) : 0})`; g.beginPath(); g.arc(gx, gy - 158, 3, 0, TAU); g.fill(); }
    const nx = vx + 60, ny = d.grua != null ? -999 : vy + vh - 120, R = 64, a = t * .12;        // la noria del ep. 4, lejos, girando (no, si hay grúa)
    brillo(g, nx, ny, 120, '255,190,120', .18);
    g.strokeStyle = 'rgba(255,205,150,.5)'; g.lineWidth = 1.6; g.beginPath(); g.arc(nx, ny, R, 0, TAU); g.stroke();
    for (let i = 0; i < 8; i++) { const b = a + i * TAU / 8, px = nx + R * Math.cos(b), py = ny + R * Math.sin(b);
      g.beginPath(); g.moveTo(nx, ny); g.lineTo(px, py); g.stroke();
      g.fillStyle = i % 2 ? 'rgba(235,80,60,.9)' : 'rgba(90,150,255,.9)'; g.beginPath(); g.arc(px, py + 5, 4.5, 0, TAU); g.fill(); }
    g.fillStyle = '#060a14'; for (let i = 0; i < 8; i++) { const x = vx - vw / 2 + i * 38 - 10, h = 40 + 50 * A(i + 3); g.fillRect(x, vy + vh - h, 40, h);   // tejados
      if (A(i + 9) < .6) { g.fillStyle = `rgba(255,200,120,${.5 + .3 * Math.sin(t * .4 + i)})`; g.fillRect(x + 12, vy + vh - h + 12, 6, 8); g.fillStyle = '#060a14'; } }
    g.strokeStyle = 'rgba(200,220,255,.4)'; g.lineWidth = 1;                                   // gotas resbalando por el cristal
    for (let i = 0; i < 70 * (d.lluvia ?? .6); i++) { const u = (t * (.5 + A(i)) + A(i + 5)) % 1, x = vx - vw / 2 + vw * A(i + 9), y = vy + vh * u; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 2, y - 12); g.stroke(); }
    g.restore();
    g.fillStyle = N; g.fillRect(vx - vw / 2 - 16, vy - 16, vw + 32, 16); g.fillRect(vx - vw / 2 - 22, vy + vh, vw + 44, 20);
    g.fillRect(vx - vw / 2 - 16, vy, 16, vh); g.fillRect(vx + vw / 2, vy, 16, vh); g.fillRect(vx - 4, vy, 8, vh); g.fillRect(vx - vw / 2, vy + vh / 2 - 4, vw, 8);
    for (const [px, py, w, h, r, c] of [[150, 190, 130, 180, -.05, '#7d3418'], [310, 225, 100, 140, .07, '#284566']]) {   // pósters de cuando tenía quince
      g.save(); g.translate(px, py); g.rotate(r + .01 * Math.sin(t * .7 + px)); g.fillStyle = c; g.fillRect(-w / 2, -h / 2, w, h);
      g.fillStyle = 'rgba(255,225,170,.45)'; g.beginPath(); g.arc(0, -12, w * .26, 0, TAU); g.fill(); g.fillRect(-w * .36, h * .22, w * .72, 9); g.fillRect(-w * .25, h * .34, w * .5, 6);
      g.fillStyle = 'rgba(0,0,0,.35)'; g.beginPath(); g.moveTo(w / 2, -h / 2); g.lineTo(w / 2 - 18, -h / 2); g.lineTo(w / 2, -h / 2 + 18); g.fill(); g.restore(); }   // esquina despegada
    brillo(g, 600, 220, 360, '255,196,120', .32 + .03 * Math.sin(t * 4));
    g.fillStyle = N; g.fillRect(597, 236, 7, 364); g.fillRect(575, 594, 50, 8);
    g.beginPath(); g.moveTo(560, 236); g.lineTo(640, 236); g.lineTo(624, 186); g.lineTo(576, 186); g.closePath(); g.fill();
    g.fillStyle = '#1c100a'; g.fillRect(-900, 600, 3100, 400);
  };
  // litera: dos camas estrechas una sobre otra, con su escalera (d.x, d.escala)
  D.litera = (g, t, d) => { const e = d.escala || 1; g.save(); g.translate(d.x || 640, d.y || 600); g.scale(e, e); g.fillStyle = color(d);
    for (const x of [-220, 206]) g.fillRect(x, -420, 14, 420);
    for (const y of [-340, -110]) { g.fillStyle = '#cdbb96'; g.fillRect(-206, y - 30, 412, 30); g.fillStyle = '#e0d2b2'; g.fillRect(-196, y - 46, 74, 20);
      g.fillStyle = '#6b4a35'; g.fillRect(-120, y - 34, 326, 10); g.fillStyle = color(d); g.fillRect(-220, y, 440, 14); g.fillRect(-220, y - 70, 14, 70); }
    g.fillRect(150, -340, 6, 230); g.fillRect(200, -340, 6, 230); for (let i = 0; i < 5; i++) g.fillRect(150, -150 - i * 44, 56, 6);
    g.restore(); };
  // tarta con velas y una etiqueta (d.texto, d.velas, d.en: aparece con un saltito)
  D.tarta = (g, t, d) => { if (t < (d.en ?? 0)) return; const k = T.rebote(T.clamp((t - d.en) / .5)), e = (d.escala || 1) * k;
    g.save(); g.translate(d.x, d.y || 600); g.scale(e, e); g.fillStyle = '#3a1f12'; g.fillRect(-70, -18, 140, 18);
    g.fillStyle = '#e7d4ac'; g.beginPath(); g.roundRect(-58, -86, 116, 68, 8); g.fill(); g.fillStyle = '#b23a2a'; g.fillRect(-58, -66, 116, 8);
    const n = d.velas || 3; for (let i = 0; i < n; i++) { const vx = -40 + i * 80 / Math.max(1, n - 1); g.fillStyle = '#f1e6cc'; g.fillRect(vx - 3, -112, 6, 26);
      brillo(g, vx, -120, 22, '255,200,110', .6); g.fillStyle = `rgba(255,${200 + 40 * Math.sin(t * 12 + i)},90,.95)`; g.beginPath(); g.ellipse(vx, -120 + Math.sin(t * 9 + i), 3.5, 7, 0, 0, TAU); g.fill(); }
    g.fillStyle = '#efe0bd'; texto(g, d.texto || '', 0, 32, 30); g.restore(); };

  // la resta: dos columnas sobre el pergamino. HOGARES se llena de personitas y CASAS de ladrillos; el hueco entre las dos, en rojo.
  // d.hogares / d.casas: [[t, valor], …] (0–1 de la altura), d.max (alto en px), d.etiquetas, d.hueco (t en que se pinta), d.grieta (t en que se abre)
  const curvaV = (claves, t) => (claves || [[0, 0]]).reduce((v, [tt, x], i, c) => i ? v + (x - c[i - 1][1]) * T.suave(T.clamp((t - c[i - 1][0]) / Math.max(.01, tt - c[i - 1][0]))) : x, 0);
  D.columnas = (g, t, d) => { const x = d.x || 640, y = d.y || 600, H = d.max || 420, sep = d.sep || 150, w = d.ancho || 170, e = d.escala || 1;
    g.save(); g.translate(x, y); g.scale(e, e);
    const hh = H * curvaV(d.hogares, t), hc = H * curvaV(d.casas, t);
    if (d.panel) { g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(-sep - w / 2 - 50, -H - 74, 2 * sep + w + 112, H + 98); g.fillStyle = '#b98a52'; g.fillRect(-sep - w / 2 - 56, -H - 80, 2 * sep + w + 112, H + 96); }   // tablero de pergamino sobre fondos oscuros
    g.fillStyle = 'rgba(40,22,12,.3)'; g.fillRect(-sep - w / 2 - 6, -H - 10, w + 12, H + 10); g.fillRect(sep - w / 2 - 6, -H - 10, w + 12, H + 10);   // huecos de las columnas
    g.save(); g.beginPath(); g.rect(-sep - w / 2, -hh, w, hh); g.clip();                     // personitas apiladas, cada fila un poco desplazada
    for (let f = 0; f * 34 < hh + 34; f++) for (let i = 0; i < 6; i++) { const px = -sep - w / 2 + 14 + i * 28 + (f % 2) * 12, py = -f * 34 - 4, s = .9 + .2 * A(f * 7 + i);
      g.fillStyle = f * 34 > hh - 40 ? '#3a2410' : '#2a1708'; g.beginPath(); g.arc(px, py - 24 * s, 6 * s, 0, TAU); g.fill(); g.beginPath(); g.moveTo(px - 8 * s, py); g.quadraticCurveTo(px, py - 36 * s, px + 8 * s, py); g.fill(); }
    g.restore();
    const lh = 22, lw = 42; g.save(); g.beginPath(); g.rect(sep - w / 2, -hc, w, hc); g.clip();   // ladrillos
    for (let f = 0; f * lh < hc + lh; f++) for (let i = -1; i < 5; i++) { const bx = sep - w / 2 + i * lw + (f % 2 ? lw / 2 : 0), by = -(f + 1) * lh;
      g.fillStyle = A(f * 13 + i) < .5 ? '#8a3c1e' : '#7a3218'; g.fillRect(bx + 2, by + 2, lw - 4, lh - 4); }
    g.restore();
    if (d.hueco != null && t > d.hueco && hh > hc) {                                            // el hueco rojo: lo que falta
      const k = T.clamp((t - d.hueco) / .35), late = .75 + .25 * Math.sin(t * 5);
      g.fillStyle = `rgba(190,25,15,${.75 * k * late})`; g.fillRect(sep - w / 2, -hh, w, hh - hc);
      g.strokeStyle = `rgba(255,90,60,${k})`; g.lineWidth = 3; g.setLineDash([10, 8]); g.strokeRect(sep - w / 2, -hh, w, hh - hc); g.setLineDash([]);
      brillo(g, sep, -(hh + hc) / 2, 160, '220,40,20', .3 * k * late);
      g.fillStyle = `rgba(255,230,200,${k})`; texto(g, d.faltan || 'FALTAN', sep, -(hh + hc) / 2 + 10, 26); }
    g.fillStyle = '#efe0bd'; const [et1, et2] = d.etiquetas || ['HOGARES', 'CASAS'];                // rótulos encima de cada columna
    texto(g, et1, -sep, -H - 30, 30); texto(g, et2, sep, -H - 30, 30);
    if (d.cifras) { g.fillStyle = '#f3e6c6'; d.cifras.forEach(([tt, lado, s]) => { if (t < tt) return; const a = T.clamp((t - tt) / .3);
      g.globalAlpha = a; texto(g, s, lado * sep, -(lado < 0 ? hh : hc) + 40 - 10 * (1 - a), 34); g.globalAlpha = 1; }); }
    if (d.piezas) { const n = d.piezas.length, b0 = H * (d.base ?? .4), sh = (H * (d.tope ?? .95) - b0) / n;   // el plan: huecos a trazos que se rellenan de oro, uno por pieza
      d.piezas.forEach(([tt, s], i) => { if (t < (d.plan ?? tt)) return; const yy = -b0 - (i + 1) * sh, k = T.clamp((t - tt) / .45), cae = (1 - T.rebote(k)) * 140;
        g.strokeStyle = 'rgba(255,220,150,.85)'; g.lineWidth = 2; g.setLineDash([8, 6]); g.strokeRect(sep - w / 2 + 4, yy + 3, w - 8, sh - 6); g.setLineDash([]);
        if (t < tt) return; g.globalAlpha = T.clamp(k * 3) * (d.vidrio ?? .85); g.fillStyle = '#d9a53a'; g.fillRect(sep - w / 2 + 4, yy + 3 - cae, w - 8, sh - 6);
        g.globalAlpha = T.clamp(k * 3); brillo(g, sep, yy + sh / 2 - cae, 120, '255,210,110', .35); g.fillStyle = '#2a1708'; texto(g, s, sep, yy + sh / 2 + 7 - cae, 19); g.globalAlpha = 1; }); }
    g.restore();
    if (d.grieta != null && t > d.grieta) {                                                    // el hueco se abre en el suelo, de lado a lado
      const k = T.suave(T.clamp((t - d.grieta) / 1.4)), gy = y + 20; g.fillStyle = '#120604';
      g.beginPath(); g.moveTo(x - 700 * k, gy); for (let i = 0; i <= 40; i++) { const u = i / 40, px = x - 700 * k + 1400 * k * u; g.lineTo(px, gy - (8 + 18 * A(i)) * Math.sin(Math.PI * u) * k); }
      for (let i = 40; i >= 0; i--) { const u = i / 40, px = x - 700 * k + 1400 * k * u; g.lineTo(px, gy + (10 + 26 * A(i + 50)) * Math.sin(Math.PI * u) * k); } g.closePath(); g.fill();
      brillo(g, x, gy, 400 * k, '220,40,20', .35 * k); }
  };
  // cifra que corre hasta su valor y se para con un golpe (d.en, d.hasta, d.de, d.a, d.formato: 'miles' | 'euros' | '', d.tam, d.antes, d.despues)
  D.contador = (g, t, d) => { if (t < d.en) return; const k = T.suave(T.clamp((t - d.en) / ((d.dura ?? 1.4)))), v = (d.de || 0) + ((d.a || 0) - (d.de || 0)) * k;
    const s = d.decimales ? v.toFixed(d.decimales).replace('.', ',') : String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const golpe = k >= 1 ? 1 + .12 * Math.exp(-(t - d.en - (d.dura ?? 1.4)) * 8) : 1;
    g.save(); g.translate(d.x || 640, d.y || 200); g.scale(golpe, golpe); brillo(g, 0, -12, 180, '255,210,140', .25 * T.clamp((t - d.en) / .4));
    g.fillStyle = d.color || '#f3e6c6'; texto(g, (d.antes || '') + s + (d.despues || ''), 0, 0, d.tam || 64);
    if (d.rotulo) { g.fillStyle = 'rgba(243,230,198,.75)'; texto(g, d.rotulo, 0, (d.tam || 64) * .55, 20); } g.restore(); };
  // mapa de Españistán (silueta) con manchas o chinchetas que se encienden en su segundo: d.puntos [[t, u, v, texto?, rojo?]] (u, v de 0 a 1)
  D.mapa05 = (g, t, d) => { const w = d.ancho || 520, h = w * .78, x = (d.x || 640) - w / 2, y = (d.y || 330) - h / 2;
    g.fillStyle = 'rgba(0,0,0,.3)'; mapa(g, x + 8, y + 10, w, h); g.fill();
    g.fillStyle = d.relleno || '#d8c39a'; mapa(g, x, y, w, h); g.fill(); g.strokeStyle = '#3a2410'; g.lineWidth = 3; g.stroke();
    for (const [tt, u, v, s, rojo] of d.puntos || []) { if (t < tt) continue; const k = T.rebote(T.clamp((t - tt) / .45)), px = x + u * w, py = y + v * h, late = 1 + .15 * Math.sin(t * 5 + u * 9);
      if (rojo) { brillo(g, px, py, 70 * k * late, '210,30,15', .7); g.fillStyle = 'rgba(170,20,10,.85)'; g.beginPath(); g.arc(px, py, 16 * k * late, 0, TAU); g.fill(); }
      else { g.fillStyle = '#a3140f'; g.beginPath(); g.arc(px, py - 26 * k, 11, 0, TAU); g.fill(); g.fillRect(px - 2, py - 26 * k, 4, 26 * k); brillo(g, px, py - 26, 50, '255,190,110', .5 * k); }
      if (s) { g.fillStyle = '#2a1708'; g.font = '700 17px Georgia, serif'; g.textAlign = u > .6 ? 'right' : 'left'; g.fillText(s, px + (u > .6 ? -16 : 16), py + 6); g.textAlign = 'left'; } } };
  // llave dorada que flota (d.en para aparecer, d.vuela [t, x, y] para irse a otro sitio)
  D.llave = (g, t, d) => { if (t < (d.en ?? 0)) return; let x = d.x, y = d.y;
    if (d.vuela && t > d.vuela[0]) { const k = T.suave(T.clamp((t - d.vuela[0]) / .6)); x += (d.vuela[1] - x) * k; y += (d.vuela[2] - y) * k - 120 * Math.sin(Math.PI * k); }
    const e = d.escala || 1, giro = .3 * Math.sin(t * 1.6); brillo(g, x, y, 90 * e, '255,210,110', .45 + .1 * Math.sin(t * 4));
    g.save(); g.translate(x, y + 6 * Math.sin(t * 2)); g.rotate(giro); g.scale(e, e); g.fillStyle = '#d9a53a'; g.strokeStyle = '#d9a53a'; g.lineWidth = 9;
    g.beginPath(); g.arc(-30, 0, 18, 0, TAU); g.stroke(); g.fillRect(-12, -5, 70, 10); g.fillRect(40, 5, 8, 16); g.fillRect(54, 5, 8, 12); g.restore(); };

  // Tenerife: el Teide al fondo, con su pico nevado; d.y (pie), d.escala
  D.teide = (g, t, d) => { const x = d.x || 900, y = d.y || 560, e = d.escala || 1; g.save(); g.translate(x, y); g.scale(e, e); g.fillStyle = color(d);
    g.beginPath(); g.moveTo(-700, 0); g.quadraticCurveTo(-300, -60, -120, -250); g.lineTo(-50, -330); g.lineTo(40, -335); g.lineTo(110, -255); g.quadraticCurveTo(300, -60, 700, 0); g.closePath(); g.fill();
    g.fillStyle = 'rgba(255,240,220,.35)'; g.beginPath(); g.moveTo(-50, -330); g.lineTo(40, -335); g.lineTo(70, -300); g.lineTo(30, -290); g.lineTo(0, -305); g.lineTo(-30, -288); g.lineTo(-70, -305); g.closePath(); g.fill();
    g.restore(); };
  // mar al fondo con el brillo del sol que tiembla (d.y, d.color)
  D.mar = (g, t, d) => { const y = d.y || 470; g.fillStyle = d.color || 'rgba(30,60,90,.85)'; g.fillRect(-900, y, 3100, 600);
    for (let i = 0; i < 40; i++) { const px = -200 + 1700 * A(i + 3), py = y + 10 + 120 * A(i + 7), l = 30 + 60 * A(i + 9);
      g.fillStyle = `rgba(255,220,170,${.15 + .2 * Math.max(0, Math.sin(t * 2 + i))})`; g.fillRect(px + 10 * Math.sin(t * .8 + i), py, l, 2); } };
  // fila de hoteles blancos en la costa, con balcones, toallas que ondean y piscinas; d.n, d.x0, d.x1, d.tono (0 = blanco)
  D.hoteles = (g, t, d) => { const x0 = d.x0 ?? -100, x1 = d.x1 ?? 1380, n = d.n || 5, y = d.y || 600, paso = (x1 - x0) / n;
    for (let i = 0; i < n; i++) { const w = paso * .86, h = 200 + 120 * A(i + 21), x = x0 + i * paso, k = d.tono ?? 0;
      g.fillStyle = `rgb(${236 - 60 * k},${226 - 70 * k},${208 - 70 * k})`; g.fillRect(x, y - h, w, h);
      g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(x + w * .82, y - h, w * .18, h);                         // sombra de un lado (sol duro)
      for (let f = 0; f < h / 30 - 1; f++) { const fy = y - h + 16 + f * 30; g.fillStyle = 'rgba(60,40,30,.55)'; g.fillRect(x + 6, fy + 16, w - 12, 3);   // balcones
        for (let c = 0; c < w / 26 - 1; c++) { const fx = x + 12 + c * 26; g.fillStyle = 'rgba(40,60,80,.55)'; g.fillRect(fx, fy, 14, 14);
          if (A(i * 50 + f * 7 + c) < .12) { g.fillStyle = ['#c0392b', '#2e86c1', '#f1c40f'][Math.floor(A(f + c + i) * 3)]; g.save(); g.translate(fx + 7, fy + 16); g.rotate(.08 * Math.sin(t * 3 + c)); g.fillRect(-6, 0, 12, 12); g.restore(); } } }
      g.fillStyle = 'rgba(60,40,30,.6)'; texto(g, 'HOTEL', x + w / 2, y - h - 8, 18); } };
  // autocaravana vieja con ropa tendida y una luz dentro (d.x, d.escala, d.lado, d.luz: t en que se enciende)
  D.caravana = (g, t, d) => { const e = d.escala || 1; g.save(); g.translate(d.x, d.y || 600); g.scale(e * (d.lado || 1), e); g.fillStyle = color(d);
    g.beginPath(); g.moveTo(-170, -30); g.lineTo(-170, -150); g.quadraticCurveTo(-170, -176, -140, -176); g.lineTo(110, -176); g.lineTo(140, -130); g.lineTo(175, -120); g.lineTo(175, -30); g.closePath(); g.fill();
    g.fillRect(-120, -196, 120, 20);                                                                  // la cama de arriba
    const luz = d.luz == null ? 0 : T.clamp((t - d.luz) / .4);
    hueco(g, () => { g.rect(-140, -140, 60, 40); g.rect(-60, -140, 60, 40); g.rect(120, -122, 40, 34); });
    if (luz > 0) { g.fillStyle = `rgba(255,${200 + 15 * Math.sin(t * 6)},120,${.9 * luz})`; g.fillRect(-140, -140, 60, 40); g.fillRect(-60, -140, 60, 40); brillo(g, -70, -120, 140, '255,190,110', .4 * luz); }
    g.fillStyle = color(d); for (const x of [-110, 120]) { g.beginPath(); g.arc(x, -26, 26, 0, TAU); g.fill(); }
    g.restore();
    if (d.ropa) { const rx = d.x + (d.lado || 1) * 190 * e, ry = (d.y || 600) - 150 * e; g.strokeStyle = color(d); g.lineWidth = 2;   // cuerda con ropa tendida que ondea
      g.beginPath(); g.moveTo(d.x + (d.lado || 1) * 150 * e, ry); g.quadraticCurveTo(rx + 60 * e * (d.lado || 1), ry + 14, rx + 130 * e * (d.lado || 1), ry - 4); g.stroke(); g.fillRect(rx + 130 * e * (d.lado || 1) - 2, ry - 4, 4, 150 * e);
      for (let i = 0; i < 4; i++) { const px = rx + (10 + i * 30) * e * (d.lado || 1), py = ry + 6 + 6 * Math.sin(i), ol = 4 * Math.sin(t * 4 + i);
        g.fillStyle = ['#d9c7a2', '#9b3b2a', '#3d5f8a', '#d9c7a2'][i]; g.beginPath(); g.moveTo(px - 10 * e, py); g.lineTo(px + 10 * e, py); g.lineTo(px + 9 * e + ol, py + 30 * e); g.lineTo(px - 11 * e + ol, py + 30 * e); g.closePath(); g.fill(); } } };
  // boca de cueva en la ladera, con una luz dentro (d.luz)
  D.cueva = (g, t, d) => { const e = d.escala || 1; g.save(); g.translate(d.x, d.y || 600); g.scale(e, e); g.fillStyle = color(d);
    g.beginPath(); g.moveTo(-240, 0); g.quadraticCurveTo(-180, -170, 0, -200); g.quadraticCurveTo(180, -170, 240, 0); g.closePath(); g.fill();
    const luz = d.luz == null ? 0 : T.clamp((t - d.luz) / .6);
    g.fillStyle = '#0a0503'; g.beginPath(); g.moveTo(-60, 0); g.quadraticCurveTo(-56, -90, 0, -96); g.quadraticCurveTo(56, -90, 60, 0); g.closePath(); g.fill();
    if (luz > 0) { brillo(g, 0, -40, 110, '255,170,90', .6 * luz * (.85 + .15 * Math.sin(t * 9))); } g.restore(); };
  // cartel de inmobiliaria con un piso «por semanas» (d.texto, d.precio)
  D.escaparate = (g, t, d) => { const e = d.escala || 1; g.save(); g.translate(d.x, d.y || 600); g.scale(e, e); g.fillStyle = color(d);
    g.fillRect(-160, -300, 320, 300); g.fillRect(-180, -322, 360, 26); hueco(g, () => g.rect(-136, -250, 272, 180));
    g.fillStyle = 'rgba(255,214,150,.25)'; g.fillRect(-136, -250, 272, 180); g.fillStyle = '#efe0bd'; texto(g, d.rotulo || 'INMOBILIARIA', 0, -303, 18);
    for (let i = 0; i < 2; i++) { const cx = -66 + i * 132; g.fillStyle = '#efe0bd'; g.fillRect(cx - 54, -236, 108, 150); g.fillStyle = '#7a1410'; texto(g, i ? (d.precio2 || '') : (d.precio || ''), cx, -150, 22);
      g.fillStyle = '#2a1708'; texto(g, i ? (d.texto2 || '') : (d.texto || ''), cx, -118, 14); g.fillStyle = '#3a2410'; g.beginPath(); g.moveTo(cx - 30, -196); g.lineTo(cx, -220); g.lineTo(cx + 30, -196); g.fill(); g.fillRect(cx - 24, -196, 48, 26); }
    g.restore(); };
  // pancartas en alto sobre la multitud, que se mecen (d.textos, d.en, d.y)
  D.pancartas = (g, t, d) => { if (t < (d.en ?? 0)) return; const k = T.suave(T.clamp((t - d.en) / .6));
    (d.textos || []).forEach((s, i) => { const x = (d.x0 ?? 220) + i * (d.paso ?? 320), y = (d.y || 380) + 60 * (1 - k) + 6 * Math.sin(t * 2 + i * 1.7); g.font = '700 24px Georgia, serif'; const w = Math.max(200, g.measureText(s).width + 44);
      g.save(); g.translate(x, y); g.rotate(.04 * Math.sin(t * 1.5 + i)); g.fillStyle = color(d); g.fillRect(-w / 2 + 12, 30, 6, 160); g.fillRect(w / 2 - 18, 30, 6, 160);
      g.fillStyle = '#efe0bd'; g.fillRect(-w / 2, -30, w, 64); g.strokeStyle = '#2a1708'; g.lineWidth = 3; g.strokeRect(-w / 2 + 5, -25, w - 10, 54);
      g.fillStyle = '#9a1c10'; texto(g, s, 0, 12, 24); g.restore(); }); };
  // verja que se cierra (d.cierra) con su cartel (d.texto)
  D.verja = (g, t, d) => { const x = d.x || 640, y = d.y || 600, w = d.ancho || 520, h = d.alto || 300, k = d.cierra == null ? 1 : T.suave(T.clamp((t - d.cierra) / .8));
    const golpe = d.cierra != null && t > d.cierra + .8 ? 4 * Math.exp(-(t - d.cierra - .8) * 10) * Math.sin((t - d.cierra) * 60) : 0;
    g.fillStyle = color(d); g.fillRect(x - w / 2 - 30, y - h - 30, 30, h + 30); g.fillRect(x + w / 2, y - h - 30, 30, h + 30);
    for (const s of [-1, 1]) { const ab = (1 - k) * w * .45, bx = x + s * (w / 4 + ab) + golpe;            // dos hojas que se juntan
      g.fillRect(bx - w / 4, y - h, w / 2, 10); g.fillRect(bx - w / 4, y - 14, w / 2, 10);
      for (let i = 0; i <= 8; i++) { const px = bx - w / 4 + i * w / 16; g.fillRect(px - 3, y - h - 16, 6, h + 16); g.beginPath(); g.moveTo(px - 8, y - h - 14); g.lineTo(px, y - h - 34); g.lineTo(px + 8, y - h - 14); g.fill(); } }
    if (d.texto && k > .6) { const a = T.clamp((k - .6) / .4); g.save(); g.globalAlpha = a; g.translate(x + golpe, y - h * .55); g.rotate(-.03);
      g.font = '700 24px Georgia, serif'; const cw = g.measureText(d.texto).width / 2 + 30;
      g.fillStyle = '#efe0bd'; g.fillRect(-cw, -36, 2 * cw, 72); g.strokeStyle = '#7a1410'; g.lineWidth = 4; g.strokeRect(-cw + 6, -30, 2 * cw - 12, 60); g.fillStyle = '#7a1410'; texto(g, d.texto, 0, 10, 24); g.restore(); } };
  // maleta con ruedas (d.x, d.escala, d.rueda: se desplaza de d.x a d.a entre d.en y d.hasta)
  D.maleta = (g, t, d) => { let x = d.x; if (d.a != null) x += (d.a - d.x) * T.suave(T.clamp((t - d.en) / ((d.hasta ?? d.en + 1) - d.en)));
    const e = d.escala || 1; g.save(); g.translate(x, d.y || 600); g.scale(e, e); if (d.color) brillo(g, 0, -60, 70, '255,190,100', .35); g.fillStyle = d.color || color(d);
    g.beginPath(); g.roundRect(-34, -110, 68, 96, 8); g.fill(); g.fillRect(-4, -150, 8, 40); g.fillRect(-18, -154, 36, 8);
    for (const s of [-1, 1]) { g.beginPath(); g.arc(s * 20, -8, 8, 0, TAU); g.fill(); } g.fillStyle = 'rgba(255,214,150,.25)'; g.fillRect(-20, -96, 40, 4); g.fillRect(-20, -40, 40, 4); g.restore(); };
  // chabola de tablas desiguales con techo de chapa ondulada y una bombilla que se enciende (d.luz)
  D.chabola = (g, t, d) => { const e = d.escala || 1; g.save(); g.translate(d.x, d.y || 600); g.scale(e, e); g.fillStyle = color(d);
    for (let i = 0; i < 7; i++) { const h = 150 + 22 * A(i + 31); g.save(); g.translate(-105 + i * 30, 0); g.rotate(.03 * (A(i + 7) - .5)); g.fillRect(0, -h, 28, h); g.restore(); }
    g.beginPath(); g.moveTo(-125, -160); for (let x = -125; x <= 125; x += 12) g.lineTo(x, -178 + 8 * (x < 0 ? 1 : 0) + 3 * Math.sin(x * .5)); g.lineTo(125, -150); g.closePath(); g.fill();
    const luz = d.luz == null ? 0 : T.clamp((t - d.luz) / .3);
    hueco(g, () => g.rect(-40, -110, 44, 34)); if (luz > 0) { g.fillStyle = `rgba(255,${190 + 20 * Math.sin(t * 13)},110,${.9 * luz})`; g.fillRect(-40, -110, 44, 34); brillo(g, -18, -93, 90, '255,190,110', .4 * luz); }
    g.restore(); };
  // grúa torre: la pluma gira despacio desde d.arranca (antes, quieta) y el gancho sube y baja; con d.cae se desploma como una ficha de dominó
  D.grua = (g, t, d) => { const e = d.escala || 1, x = d.x, y = d.y || 600, h = d.alto || 420;
    const cae = d.cae == null ? 0 : T.clamp((t - d.cae) / .9), giro = cae * cae * 1.45 * (d.lado || 1);
    g.save(); g.translate(x, y); g.rotate(giro); g.scale(e, e); g.fillStyle = g.strokeStyle = color(d); g.lineWidth = 2;
    g.fillRect(-12, -h, 24, h); for (let yy = -h; yy < 0; yy += 24) { g.beginPath(); g.moveTo(-12, yy); g.lineTo(12, yy + 24); g.moveTo(12, yy); g.lineTo(-12, yy + 24); g.stroke(); }
    hueco(g, () => { for (let yy = -h + 4; yy < -4; yy += 24) { g.moveTo(-8, yy + 3); g.lineTo(-2, yy + 12); g.lineTo(-8, yy + 21); g.closePath(); g.moveTo(8, yy + 3); g.lineTo(2, yy + 12); g.lineTo(8, yy + 21); g.closePath(); } });
    const mov = d.arranca == null ? 0 : Math.max(0, t - d.arranca), a = .18 * Math.sin(mov * .5) * Math.min(1, mov);   // la pluma, de lado: se acorta al girar
    const L = 300 * Math.cos(a), C = 90 * Math.cos(a);
    g.fillRect(-C, -h - 16, L + C, 14); g.fillRect(-8, -h - 60, 16, 46); g.beginPath(); g.moveTo(0, -h - 60); g.lineTo(L * .9, -h - 14); g.moveTo(0, -h - 60); g.lineTo(-C, -h - 14); g.stroke();
    g.fillRect(-C - 6, -h - 24, 40, 26);                                                                   // contrapeso
    const gx = L * .7, gy = -h - 2 + 120 + 70 * Math.sin(mov * .7); g.beginPath(); g.moveTo(gx, -h - 2); g.lineTo(gx, gy); g.stroke(); g.fillRect(gx - 6, gy, 12, 10);
    if (d.luz) { g.fillStyle = `rgba(255,60,40,${.5 + .5 * Math.sin(t * 4 + x)})`; g.beginPath(); g.arc(L, -h - 12, 4, 0, TAU); g.fill(); }
    if (d.cabina) { const c = d.cabina.reduce((v, [tt, col]) => t >= tt ? col : v, null); if (c) {               // la cabina del gruista, del color de quien manda
      g.fillStyle = c; g.fillRect(14, -h - 2, 50, 40); g.fillStyle = 'rgba(255,230,180,.75)'; g.fillRect(22, -h + 6, 34, 16); brillo(g, 39, -h + 18, 90, c === '#1f5fae' ? '90,150,255' : '255,80,60', .45); } }
    g.restore();
    if (d.cae != null && t > d.cae + .85 && t < d.cae + 2.2) { const u = (t - d.cae - .85) / 1.35; g.fillStyle = `rgba(80,55,35,${.45 * (1 - u)})`;
      for (let i = 0; i < 8; i++) { g.beginPath(); g.arc(x + (d.lado || 1) * h * e * (.3 + .1 * i) , y - 10 - 40 * u, 20 + 40 * u, 0, TAU); g.fill(); } } };
  // edificio cortado como una casa de muñecas: cuartos que se encienden en su segundo con su rótulo (d.cuartos: [[t, 'MAESTRA'], …]), d.pisos, d.cols
  D.munecas = (g, t, d) => { const x = d.x || 640, y = d.y || 600, cols = d.cols || 3, pisos = d.pisos || 4, cw = d.cw || 170, ch = d.ch || 110, w = cols * cw, h = pisos * ch;
    g.fillStyle = color(d); g.fillRect(x - w / 2 - 14, y - h - 40, w + 28, h + 40); g.beginPath(); g.moveTo(x - w / 2 - 30, y - h - 40); g.lineTo(x, y - h - 110); g.lineTo(x + w / 2 + 30, y - h - 40); g.closePath(); g.fill();
    (d.cuartos || []).forEach(([tt, rot], i) => { const c = i % cols, f = Math.floor(i / cols), cx = x - w / 2 + c * cw + 8, cy = y - (f + 1) * ch + 8, k = T.clamp((t - tt) / .3);
      g.fillStyle = '#1b0f08'; g.fillRect(cx, cy, cw - 16, ch - 16);
      if (k <= 0) return; g.fillStyle = d.rojos && d.rojos.includes(i) ? `rgba(200,30,20,${.9 * k})` : `rgba(255,${196 + 10 * Math.sin(t * 3 + i)},120,${.85 * k})`; g.fillRect(cx, cy, cw - 16, ch - 16);
      g.fillStyle = N; const px = cx + 30 + 10 * Math.sin(t * .6 + i), py = cy + ch - 16;                   // una persona en su cuarto, con su cama
      g.fillRect(cx + cw - 76, py - 22, 56, 22); g.beginPath(); g.arc(px, py - 52, 9, 0, TAU); g.fill(); g.beginPath(); g.moveTo(px - 12, py); g.quadraticCurveTo(px, py - 56, px + 12, py); g.fill();
      if (rot) { g.globalAlpha = k; g.fillStyle = '#efe0bd'; g.fillRect(cx + 4, cy + 4, cw - 24, 24); g.fillStyle = '#7a1410'; texto(g, rot, cx + (cw - 16) / 2, cy + 22, 15); g.globalAlpha = 1; } });
    for (let f = 1; f < pisos; f++) g.fillStyle = color(d), g.fillRect(x - w / 2, y - f * ch - 4, w, 8); };
  // recibo del alquiler que se desenrolla hacia abajo hasta el suelo (d.en, d.texto, d.largo)
  D.recibo = (g, t, d) => { if (t < d.en) return; const k = T.suave(T.clamp((t - d.en) / 1.1)), x = d.x, y0 = d.y || 140, L = (d.largo || 420) * k;
    g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(x - 64, y0 + 8, 136, L); g.fillStyle = '#efe2c4'; g.fillRect(x - 70, y0, 140, L);
    g.fillStyle = '#3b2a1c'; texto(g, d.titulo || 'ALQUILER', x, y0 + 30, 18); for (let i = 0; i * 26 + 60 < L - 20; i++) g.fillRect(x - 50, y0 + 50 + i * 26, 60 + 30 * A(i + 4), 4);
    g.fillStyle = '#7a1410'; texto(g, d.texto || '', x, y0 + L - 12, 19); g.fillStyle = '#d8c9a6'; g.beginPath(); g.ellipse(x, y0 + L, 72, 9, 0, 0, TAU); g.fill(); };
  // fachada modernista (la Casa Orsola): balcones de hierro curvo, cornisa ondulada, pancartas en los balcones; d.mano: [t] una mano gigante la coge y la levanta
  D.fachada = (g, t, d) => { const x = d.x || 640, y = d.y || 600, w = d.ancho || 460, h = d.alto || 470, e = d.escala || 1;
    const sube = d.mano == null ? 0 : T.suave(T.clamp((t - d.mano - .9) / 1)) * 90;
    g.save(); g.translate(x, y - sube); g.scale(e, e); g.fillStyle = color(d);
    g.beginPath(); g.moveTo(-w / 2, 0); g.lineTo(-w / 2, -h); for (let i = 0; i <= 20; i++) { const u = i / 20; g.lineTo(-w / 2 + w * u, -h - 30 * Math.sin(Math.PI * u) - 10 * Math.sin(u * TAU * 3)); } g.lineTo(w / 2, 0); g.closePath(); g.fill();
    for (let f = 0; f < 5; f++) for (let c = 0; c < 4; c++) { const wx = -w / 2 + 40 + c * (w - 80) / 3.2, wy = -h + 60 + f * 82, luz = (f + c) % 3 !== 0;
      hueco(g, () => { g.moveTo(wx, wy + 50); g.lineTo(wx, wy + 14); g.quadraticCurveTo(wx + 28, wy - 8, wx + 56, wy + 14); g.lineTo(wx + 56, wy + 50); g.closePath(); });
      if (luz) { g.fillStyle = `rgba(255,${200 + 15 * Math.sin(t * 2 + f + c)},125,.8)`; g.beginPath(); g.moveTo(wx, wy + 50); g.lineTo(wx, wy + 14); g.quadraticCurveTo(wx + 28, wy - 8, wx + 56, wy + 14); g.lineTo(wx + 56, wy + 50); g.closePath(); g.fill(); }
      g.strokeStyle = color(d); g.lineWidth = 2.5; g.beginPath(); g.moveTo(wx - 8, wy + 50); g.bezierCurveTo(wx + 10, wy + 72, wx + 46, wy + 72, wx + 64, wy + 50); g.stroke();   // balcón de hierro
      for (let b = 0; b < 5; b++) { g.beginPath(); g.moveTo(wx + b * 14, wy + 52); g.lineTo(wx + b * 14, wy + 64); g.stroke(); } }
    g.fillStyle = color(d); g.fillRect(-60, -110, 120, 110); hueco(g, () => { g.moveTo(-40, 0); g.lineTo(-40, -70); g.arc(0, -70, 40, Math.PI, 0); g.lineTo(40, 0); g.closePath(); });
    (d.pancartas || []).forEach(([tt, f, c, txt]) => { if (t < tt) return; const k = T.suave(T.clamp((t - tt) / .5)), wx = -w / 2 + 40 + c * (w - 80) / 3.2, wy = -h + 60 + f * 82 + 56;
      g.save(); g.translate(wx + 28, wy); g.rotate(.03 * Math.sin(t * 2 + f)); g.fillStyle = '#efe0bd'; g.fillRect(-46, 0, 92, 40 * k); g.fillStyle = '#9a1c10'; if (k > .8) texto(g, txt, 0, 26, 13); g.restore(); });
    g.fillStyle = '#efe0bd'; texto(g, d.rotulo || '', 0, -h - 46, 26);
    g.restore();
    if (d.mano != null && t > d.mano) { const k = T.suave(T.clamp((t - d.mano) / .9)), my = y - h * e - sube + 20 - 560 * (1 - k), s = 2.4 * e;   // la mano baja, coge y levanta
      brillo(g, x, my - 60 * s, 260 * s, '150,180,255', .35);                                               // contraluz de luna para que la mano se lea sobre la noche
      mano(g, x, my, s, 0, T.clamp((t - d.mano - .7) / .3), '#120c0a');
      g.fillStyle = '#d9a53a'; g.fillRect(x - 36 * s, my - 72 * s, 72 * s, 7 * s); g.beginPath(); g.arc(x + 20 * s, my - 68 * s, 6 * s, 0, TAU); g.fill(); brillo(g, x + 20 * s, my - 68 * s, 70, '255,210,120', .6); } };   // puño con gemelo de oro
  // olla con tapa (el tope): el vapor se escapa por los lados con carteles (d.en, d.carteles, d.texto en la tapa)
  D.olla = (g, t, d) => { if (t < (d.en ?? 0)) return; const x = d.x || 640, y = d.y || 600, e = d.escala || 1, k = T.rebote(T.clamp((t - d.en) / .6));
    g.save(); g.translate(x, y); g.scale(e * k, e * k); g.fillStyle = color(d);
    g.beginPath(); g.moveTo(-170, -230); g.lineTo(170, -230); g.lineTo(150, -20); g.quadraticCurveTo(0, 10, -150, -20); g.closePath(); g.fill();
    g.fillRect(-210, -200, 44, 16); g.fillRect(166, -200, 44, 16);
    const tapa = 4 * Math.sin(t * 9) * T.clamp((t - (d.hierve ?? 1e9)) / .5); g.fillRect(-182, -248 + tapa, 364, 18); g.fillRect(-20, -272 + tapa, 40, 24);
    g.fillStyle = '#efe0bd'; texto(g, d.texto || 'TOPE', 0, -120, 34); g.restore();
    const hv = T.clamp((t - (d.hierve ?? 1e9)) / .8);
    for (let i = 0; i < 14 * hv; i++) { const lado = i % 2 ? 1 : -1, u = ((t * .45 + A(i + 3)) % 1), vx = x + lado * (190 + 160 * u) * e, vy = y - 240 * e - 260 * u;
      g.fillStyle = `rgba(240,228,205,${.35 * (1 - u)})`; g.beginPath(); g.arc(vx + 20 * Math.sin(t * 2 + i), vy, (18 + 40 * u) * e, 0, TAU); g.fill(); }
    (d.carteles || []).forEach((s, i) => { const tt = (d.hierve ?? 1e9) + .5 + i * .5; if (t < tt) return; const u = T.suave(T.clamp((t - tt) / 1.4)), lado = i % 2 ? 1 : -1;
      const cx = x + lado * (240 + 120 * u) * e, cy = y - 280 * e - 200 * u - 40 * i; g.save(); g.translate(cx, cy); g.rotate(.15 * Math.sin(t * 2 + i)); g.font = '700 18px Georgia, serif';
      const w = g.measureText(s).width + 26; g.fillStyle = '#efe0bd'; g.fillRect(-w / 2, -18, w, 34); g.fillStyle = '#9a1c10'; texto(g, s, 0, 6, 18); g.restore(); }); };
  // hucha grande que se vacía (d.vacia: t) con monedas que caen por debajo
  D.huchaGrande = (g, t, d) => { const x = d.x || 640, y = d.y || 600, e = d.escala || 1, v = d.vacia == null ? 0 : T.clamp((t - d.vacia) / 2.4);
    g.save(); g.translate(x, y - 140 * e); g.scale(e, e); g.fillStyle = color(d); g.beginPath(); g.ellipse(0, 0, 150, 105, 0, 0, TAU); g.fill();
    g.beginPath(); g.ellipse(150, 6, 30, 38, 0, 0, TAU); g.fill(); for (const lx of [-80, 70]) g.fillRect(lx - 16, 80, 32, 60); g.fillRect(-40, -112, 80, 12);
    g.fillStyle = '#efe0bd'; texto(g, d.texto || '', 0, 12, 30); g.restore();
    if (v > 0 && v < 1) for (let i = 0; i < 18; i++) { const u = (v * 3 + A(i)) % 1, mx = x + (A(i + 4) - .5) * 80 * e, my = y - 40 * e + u * 160;
      g.fillStyle = '#d9a53a'; g.beginPath(); g.ellipse(mx, my, 10, 10 * Math.abs(Math.sin(t * 9 + i)) + 2, 0, 0, TAU); g.fill(); } };
  // plano del Eixample visto desde arriba: manzanas cuadradas con las esquinas cortadas y calles de luz (d.x, d.y, d.n columnas, d.m filas, d.lado)
  D.manzanas = (g, t, d) => { const n = d.n || 12, m = d.m || 5, L = d.lado || 84, x0 = (d.x || 640) - n * L / 2, y0 = (d.y || 380) - m * L / 2, c = L * .2;
    g.fillStyle = 'rgba(255,200,120,.12)'; g.fillRect(x0 - 10, y0 - 10, n * L + 20, m * L + 20);
    for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) { const x = x0 + i * L + 6, y = y0 + j * L + 6, w = L - 12;
      g.fillStyle = color(d); g.beginPath(); g.moveTo(x + c, y); g.lineTo(x + w - c, y); g.lineTo(x + w, y + c); g.lineTo(x + w, y + w - c); g.lineTo(x + w - c, y + w); g.lineTo(x + c, y + w); g.lineTo(x, y + w - c); g.lineTo(x, y + c); g.closePath(); g.fill();
      g.fillStyle = 'rgba(40,60,90,.5)'; g.fillRect(x + w * .3, y + w * .3, w * .4, w * .4); } };   // el patio de manzana
  // puerta de una vivienda con su marco y un letrero encima (d.rotulo); d.forzada: cerradura rota y la puerta entreabierta; d.reloj: reloj de arena al lado
  D.puertaCasa = (g, t, d) => { const x = d.x || 640, y = d.y || 600, e = d.escala || 1; g.save(); g.translate(x, y); g.scale(e, e); g.fillStyle = color(d);
    g.fillRect(-110, -330, 220, 330); hueco(g, () => g.rect(-80, -300, 160, 300));
    const ab = d.forzada ? .25 + .03 * Math.sin(t * 2) : 0; g.fillStyle = 'rgba(255,190,110,.35)'; if (ab) g.fillRect(-80, -300, 160, 300);
    g.fillStyle = color(d); g.save(); g.translate(-80, 0); g.scale(1 - ab, 1); g.fillRect(0, -300, 160, 300); g.fillStyle = 'rgba(255,220,170,.25)'; g.fillRect(20, -270, 120, 100); g.fillRect(20, -150, 120, 120); g.restore();
    if (d.forzada) { g.strokeStyle = 'rgba(255,220,170,.9)'; g.lineWidth = 3; g.beginPath(); for (const [a1, b1] of [[-20, -10], [10, -30], [20, 15], [-10, 25]]) { g.moveTo(40 * (1 - ab), -150); g.lineTo(40 * (1 - ab) + a1, -150 + b1); } g.stroke(); }
    else { g.fillStyle = '#d9a53a'; g.beginPath(); g.arc(50, -150, 8, 0, TAU); g.fill(); }
    if (d.rotulo) { g.fillStyle = '#efe0bd'; g.fillRect(-120, -390, 240, 46); g.fillStyle = '#2a1708'; texto(g, d.rotulo, 0, -358, 22); }
    g.restore(); };
  // reloj de arena: la arena cae de arriba abajo en d.dura segundos desde d.en (d.escala: el tamaño cuenta la espera)
  D.relojArena = (g, t, d) => { const x = d.x, y = d.y || 600, e = d.escala || 1, k = T.clamp((t - (d.en ?? 0)) / (d.dura || 3)); g.save(); g.translate(x, y); g.scale(e, e);
    g.fillStyle = color(d); g.fillRect(-60, -16, 120, 16); g.fillRect(-60, -236, 120, 16); g.fillRect(-56, -220, 8, 204); g.fillRect(48, -220, 8, 204);
    g.fillStyle = 'rgba(230,240,255,.18)'; g.beginPath(); g.moveTo(-44, -220); g.lineTo(44, -220); g.lineTo(6, -118); g.lineTo(44, -16); g.lineTo(-44, -16); g.lineTo(-6, -118); g.closePath(); g.fill();
    g.fillStyle = '#d9a35a'; const a = 1 - k; g.beginPath(); g.moveTo(-40 * a, -220 + 98 * (1 - a)); g.lineTo(40 * a, -220 + 98 * (1 - a)); g.lineTo(4, -120); g.lineTo(-4, -120); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(-40, -18); g.lineTo(40, -18); g.lineTo(40 * (1 - k * .9), -18 - 90 * k); g.lineTo(-40 * (1 - k * .9), -18 - 90 * k); g.closePath(); g.fill();
    if (k > 0 && k < 1) g.fillRect(-1.5, -120, 3, 100 - 90 * k);
    if (d.texto) { g.fillStyle = '#efe0bd'; texto(g, d.texto, 0, 40 / Math.sqrt(e), 22 / e); } g.restore(); };
  // calendario de taco: pasa una hoja por año desde d.en (d.anos, d.cada s) y cada hoja recibe un sello rojo (d.sello)
  D.calendario = (g, t, d) => { const x = d.x || 640, y = d.y || 400, e = d.escala || 1, anos = d.anos || [], cada = d.cada || .7, i = Math.max(0, Math.min(anos.length - 1, Math.floor((t - d.en) / cada)));
    if (t < d.en) return; g.save(); g.translate(x, y); g.scale(e, e);
    g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(-142, -168, 296, 350); g.fillStyle = '#2a1708'; g.fillRect(-150, -180, 300, 50); for (const rx of [-90, 0, 90]) { g.fillStyle = '#888'; g.fillRect(rx - 4, -196, 8, 30); }
    g.fillStyle = '#efe2c4'; g.fillRect(-150, -130, 300, 300);
    const u = ((t - d.en) % cada) / cada, vuela = i < anos.length - 1 && u > .75 ? (u - .75) / .25 : 0;
    g.fillStyle = '#7a1410'; texto(g, String(anos[i]), 0, 10, 96);
    if (d.sello && (u > .3 || i === anos.length - 1)) { g.save(); g.rotate(-.18); g.strokeStyle = '#a3140f'; g.lineWidth = 6; g.strokeRect(-130, 50, 260, 60); g.fillStyle = '#a3140f'; texto(g, d.sello, 0, 92, 30); g.restore(); }
    if (vuela) { g.save(); g.translate(0, -130); g.rotate(-1.2 * vuela); g.globalAlpha = 1 - vuela; g.fillStyle = '#efe2c4'; g.fillRect(-150, 0, 300, 300); g.restore(); }
    g.restore(); };
  // caja que cae de un punto a otro en arco (d.de [x, y], d.a [x, y], d.cae, d.texto) y vuelve si hay d.vuelve
  D.caja = (g, t, d) => { if (t < (d.desde0 ?? -1e9)) return; let [x, y] = d.de; const ida = d.cae == null ? 0 : T.suave(T.clamp((t - d.cae) / 1)), vuelta = d.vuelve == null ? 0 : T.suave(T.clamp((t - d.vuelve) / 1));
    const k = ida - vuelta; x += (d.a[0] - x) * k; y += (d.a[1] - y) * k - 160 * Math.sin(Math.PI * k);
    const e = d.escala || 1; g.save(); g.translate(x, y); g.rotate(.4 * Math.sin(Math.PI * k)); g.scale(e, e);
    g.fillStyle = '#8a5a2e'; g.fillRect(-80, -60, 160, 60); g.fillStyle = '#6e4420'; g.fillRect(-80, -60, 160, 10); g.fillRect(-6, -60, 12, 60);
    g.fillStyle = '#efe0bd'; g.font = '700 14px Georgia, serif'; const w = g.measureText(d.texto || '').width + 12; g.fillRect(-w / 2, -42, w, 22); g.fillStyle = '#7a1410'; texto(g, d.texto || '', 0, -26, 14); g.restore(); };
  // barras que crecen sobre un tablero de pergamino (d.barras [[rótulo, valor, color, t, cifra?]], d.max, d.alto): la cifra encima y el rótulo debajo
  D.barras = (g, t, d) => { if (t < (d.en ?? 0)) return; const x = d.x || 640, y = d.y || 560, H = d.alto || 300, n = d.barras.length, w = d.ancho || 130, sep = d.sep || 220, W = n * sep;
    g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(x - W / 2 + 6, y - H - 84, W, H + 150); g.fillStyle = '#b98a52'; g.fillRect(x - W / 2, y - H - 90, W, H + 150);
    d.barras.forEach(([s, v, col, tt, cifra], i) => { const bx = x + (i - (n - 1) / 2) * sep, k = T.suave(T.clamp((t - (tt ?? 0)) / 1)), h = Math.max(4, H * v / (d.max || 100) * k);
      g.fillStyle = 'rgba(40,22,12,.3)'; g.fillRect(bx - w / 2, y - H, w, H); g.fillStyle = col || '#8a3c1e'; g.fillRect(bx - w / 2, y - h, w, h);
      g.fillStyle = '#2a1708'; texto(g, s, bx, y + 42, 26); if (t > (tt ?? 0)) texto(g, k < 1 ? Math.round(v * k) + (d.unidad ?? ' %') : cifra || v + (d.unidad ?? ' %'), bx, y - h - 16, 34); }); };
  // bloque de pisos con ventanas encendidas cuyas persianas bajan (d.bajan: [[t, i], …]); d.todas: t en que bajan todas a la vez; d.suben: t en que vuelven a subir
  D.bloque = (g, t, d) => { const x = d.x || 640, y = d.y || 600, cols = d.cols || 5, pisos = d.pisos || 5, cw = 70, ch = 66, w = cols * cw + 40, h = pisos * ch + 50;
    g.fillStyle = color(d); g.fillRect(x - w / 2, y - h, w, h);
    for (let f = 0; f < pisos; f++) for (let c = 0; c < cols; c++) { const i = f * cols + c, wx = x - w / 2 + 28 + c * cw, wy = y - h + 26 + f * ch;
      const b = (d.bajan || []).find(q => q[1] === i), cuando = b ? b[0] : d.todas, k = cuando == null ? 0 : T.suave(T.clamp((t - cuando - (b ? 0 : .05 * (i % 7))) / .5)) * (d.suben == null ? 1 : 1 - T.suave(T.clamp((t - d.suben - .06 * (i % 7)) / .6)));
      g.fillStyle = `rgba(255,${196 + 12 * Math.sin(t * 2 + i)},120,.85)`; g.fillRect(wx, wy, 42, 44);
      g.fillStyle = '#5a4030'; g.fillRect(wx, wy, 42, 44 * k); g.fillStyle = 'rgba(0,0,0,.35)'; for (let r = 0; r < 44 * k; r += 6) g.fillRect(wx, wy + r, 42, 2); } };
  // megáfono del que salen casas de humo que se desvanecen; solo unas pocas se quedan de ladrillo (d.en, d.cada, d.quedan: cada cuántas se queda una)
  D.megafono = (g, t, d) => { const x = d.x, y = d.y || 300, e = d.escala || 1; if (t < (d.en ?? 0)) return;
    g.save(); g.translate(x, y); g.scale(e, e); g.fillStyle = color(d); g.beginPath(); g.moveTo(0, -18); g.lineTo(120, -60); g.lineTo(120, 60); g.lineTo(0, 18); g.closePath(); g.fill(); g.fillRect(-30, -14, 34, 28); g.restore();
    const n = Math.floor((t - d.en) / (d.cada || .35));
    for (let i = Math.max(0, n - 14); i <= n; i++) { const v = t - d.en - i * (d.cada || .35); if (v < 0) continue; const queda = i % (d.quedan || 6) === 0;
      const px = x + (140 + 160 * v) * e * (d.lado || 1), py = y - 30 * v * (A(i) - .3) + (queda ? Math.min(v, 1.2) * 180 : 0), a = queda ? 1 : Math.max(0, 1 - v / 1.8), s = (.5 + .3 * A(i + 3)) * e;
      if (a <= 0) continue; g.save(); g.translate(Math.min(px, x + 900 * e), Math.min(py, (d.suelo || 560))); g.scale(s, s); g.globalAlpha = a;
      g.fillStyle = queda ? '#8a3c1e' : 'rgba(225,215,200,.75)'; g.fillRect(-30, -40, 60, 40); g.beginPath(); g.moveTo(-38, -40); g.lineTo(0, -70); g.lineTo(38, -40); g.closePath(); g.fill(); g.restore(); } };
  // archivador gigante con cajones que se cierran con casas dentro (d.cierra: t del primero; d.texto)
  D.archivador = (g, t, d) => { const x = d.x || 640, y = d.y || 600, e = d.escala || 1; g.save(); g.translate(x, y); g.scale(e, e); g.fillStyle = color(d);
    g.fillRect(-170, -460, 340, 460); g.fillStyle = '#efe0bd'; texto(g, d.texto || 'SAREB', 0, -476, 34);
    for (let i = 0; i < 4; i++) { const cy = -440 + i * 110, k = d.cierra == null ? 0 : T.suave(T.clamp((t - d.cierra - .35 * i) / .5)), sale = 120 * (1 - k);
      g.fillStyle = '#2a1708'; g.fillRect(-150, cy, 300, 92);
      for (let c = 0; c < 4; c++) { const hx = -110 + c * 70, hy = cy + 30 - sale * .3; g.fillStyle = 'rgba(230,200,150,.75)'; g.fillRect(hx - 18, hy, 36, 26); g.beginPath(); g.moveTo(hx - 22, hy); g.lineTo(hx, hy - 18); g.lineTo(hx + 22, hy); g.fill(); }
      g.fillStyle = color(d); g.fillRect(-160, cy + 92 - 92 * k * .0 - 30, 320, 30 + 62 * k); g.fillStyle = '#d9a53a'; g.fillRect(-30, cy + 70, 60, 8); }
    g.restore(); };
  // carretilla llena de billetes que avanza de d.x a d.a entre d.en y d.hasta y se vacía al final (d.vacia)
  D.carretilla = (g, t, d) => { const k = T.suave(T.clamp((t - d.en) / ((d.hasta ?? d.en + 2) - d.en))), x = d.x + (d.a - d.x) * k, y = d.y || 600, e = d.escala || 1, vac = d.vacia == null ? 0 : T.clamp((t - d.vacia) / .8);
    g.save(); g.translate(x, y); g.scale(e, e); g.fillStyle = color(d); g.beginPath(); g.arc(70, -28, 28, 0, TAU); g.fill();
    g.beginPath(); g.moveTo(-90, -110); g.lineTo(100, -110); g.lineTo(80, -50); g.lineTo(-60, -50); g.closePath(); g.fill(); g.fillRect(-170, -96, 90, 8);
    for (let i = 0; i < 10 * (1 - vac); i++) { g.fillStyle = i % 2 ? '#6f8f4e' : '#5d7a40'; g.save(); g.translate(-60 + (i % 5) * 32, -118 - Math.floor(i / 5) * 14); g.rotate(.2 * (A(i) - .5)); g.fillRect(-16, -8, 32, 16); g.fillStyle = '#d9e2b8'; texto(g, '€', 0, 5, 12); g.restore(); }
    g.restore(); };
  // bola de hierro con cadena atada al tobillo de alguien (d.x, d.y del pie; la bola queda detrás, a d.lado)
  D.bola = (g, t, d) => { const x = d.x, y = d.y || 600, bx = x + (d.lado || -1) * 120; g.strokeStyle = color(d); g.lineWidth = 4;
    g.beginPath(); g.moveTo(x, y - 12); for (let i = 1; i <= 8; i++) g.lineTo(x + (bx - x) * i / 8, y - 12 + 10 * Math.sin(Math.PI * i / 8) + 2 * Math.sin(t * 3 + i)); g.stroke();
    g.fillStyle = color(d); g.beginPath(); g.arc(bx, y - 28, 30, 0, TAU); g.fill(); g.fillStyle = '#efe0bd'; texto(g, 'DEUDA', bx, y - 22, 13); };
  // plano de una ley sobre la mesa que se rompe en dos al tirar de él (d.rompe, d.texto)
  D.leyRota = (g, t, d) => { const x = d.x || 640, y = d.y || 420, k = d.rompe == null ? 0 : T.suave(T.clamp((t - d.rompe) / .6)), e = d.escala || 1;
    for (const s of [-1, 1]) { g.save(); g.translate(x + s * 90 * k * e, y + 20 * k); g.rotate(s * .25 * k); g.scale(e, e); g.fillStyle = '#e8dcc0';
      g.beginPath(); g.moveTo(0, -110); for (let i = 0; i <= 10; i++) g.lineTo(s * (8 * Math.sin(i * 2.3)) * (k > 0 ? 1 : 0), -110 + 22 * i); g.lineTo(s * 150, 110); g.lineTo(s * 150, -110); g.closePath(); g.fill();
      g.strokeStyle = 'rgba(60,40,20,.35)'; g.lineWidth = 2; for (let r = 0; r < 6; r++) { g.beginPath(); g.moveTo(s * 20, -50 + r * 26); g.lineTo(s * 130, -50 + r * 26); g.stroke(); } g.restore(); }
    g.fillStyle = '#7a1410'; if (k < .3) texto(g, d.texto || 'LEY DEL SUELO', x, y - 70, 26 * e); };

  // ---------- intro nueva (temporada 2): fondos de dibujo animado ----------
  // cielo de noche con degradado morado, estrellas que titilan y una luna grande con cráteres. d.arriba, d.abajo: colores; d.luna: [x, y, r]
  D.cieloNoche = (g, t, d) => { const gr = g.createLinearGradient(0, -200, 0, 720); gr.addColorStop(0, d.arriba || '#140c2e'); gr.addColorStop(1, d.abajo || '#6a2c5c');
    g.fillStyle = gr; g.fillRect(-900, -600, 3100, 2000);
    for (let i = 0; i < (d.n || 70); i++) { const x = -300 + 1900 * A(i + 40), y = -150 + 620 * A(i + 90), b = .5 + .5 * Math.sin(t * (2 + 3 * A(i)) + i);
      g.fillStyle = `rgba(255,245,215,${.25 + .6 * b})`; g.beginPath(); g.arc(x, y, 1 + 2.2 * A(i + 7) * b, 0, TAU); g.fill(); }
    if (d.luna) { const [x, y, r] = d.luna; const h = g.createRadialGradient(x, y, r * .8, x, y, r * 2.4); h.addColorStop(0, 'rgba(255,228,160,.35)'); h.addColorStop(1, 'rgba(255,228,160,0)');
      g.fillStyle = h; g.fillRect(x - r * 2.5, y - r * 2.5, r * 5, r * 5); g.fillStyle = '#f6dc9a'; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
      g.fillStyle = 'rgba(190,140,80,.35)'; for (const [u, v, k] of [[-.3, -.2, .22], [.25, .1, .16], [-.05, .4, .12], [.4, -.35, .1]]) { g.beginPath(); g.arc(x + u * r, y + v * r, k * r, 0, TAU); g.fill(); } } };
  // el mapa de Españistán que se parte en dos: en d.en cae la grieta y las mitades se separan (izquierda roja, derecha azul) con rebote.
  //   d.x, d.y, d.ancho, d.abre (px que se separan), d.colores [izq, der]
  D.mapaPartido = (g, t, d) => { const w = d.ancho || 620, h = w * .78, x = (d.x || 640) - w / 2, y = (d.y || 340) - h / 2, cx = d.x || 640;
    const k = T.clamp((t - (d.en ?? 0)) / .25), sep = (d.abre ?? 60) * T.rebote(T.clamp((t - (d.en ?? 0) - .15) / .5), 2.6) * (t > (d.en ?? 0) + .15);
    const zig = [...Array(13)].map((_, i) => [cx + 18 * (A(i + 3) - .5) * 2, y - 20 + (h + 40) * i / 12]);
    const [c1, c2] = d.colores || ['#c0392b', '#2e6da4'];
    for (const s of [-1, 1]) { g.save(); g.translate(s * sep, 0); g.beginPath();
      g.moveTo(s < 0 ? x - 40 : x + w + 40, y - 30); zig.forEach(p => g.lineTo(p[0], p[1])); g.lineTo(s < 0 ? x - 40 : x + w + 40, y + h + 30); g.closePath(); g.clip();
      g.fillStyle = 'rgba(0,0,0,.35)'; mapa(g, x + 10, y + 12, w, h); g.fill();
      g.fillStyle = t < (d.en ?? 0) ? '#e8cf96' : (s < 0 ? c1 : c2); mapa(g, x, y, w, h); g.fill(); g.strokeStyle = '#1a0f08'; g.lineWidth = 6; g.stroke(); g.restore(); }
    if (k > 0 && k < 1 || sep < 2) { g.strokeStyle = '#1a0f08'; g.lineWidth = 7; g.beginPath(); zig.slice(0, 1 + Math.round(12 * k)).forEach((p, i) => g[i ? 'lineTo' : 'moveTo'](p[0], p[1])); if (t >= (d.en ?? 0)) g.stroke(); }
    if (t > (d.en ?? 0) && t < (d.en ?? 0) + .6) for (let i = 0; i < 14; i++) { const u = (t - (d.en ?? 0)) / .6, a = A(i + 50) * TAU;   // cascotes que saltan de la grieta
      g.fillStyle = '#1a0f08'; g.fillRect(cx + Math.cos(a) * 160 * u, y + h * A(i + 60) + Math.sin(a) * 90 * u + 300 * u * u, 7 * (1 - u), 7 * (1 - u)); } };
})();
