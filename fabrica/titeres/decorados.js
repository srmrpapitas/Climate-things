// Decorados reutilizables del teatro de sombras. Cada uno es una función (g, t, d) que dibuja en coordenadas de la escena
// (1280×720, suelo en y = 600). En la escena se ponen en `decorado: [{tipo, par, ...}]`; `par` es el parallax
// (0,2 = muy lejos, 1 = en el plano de los títeres). `tono`: 0 = negro, 1 = casi el color del pergamino (lejanía).
(() => {
  const D = T.DECORADOS, A = T.azar, N = T.NEGRO, TAU = T.TAU;
  const color = d => d.tono ? `rgba(${Math.round(11 + 70 * d.tono)},${Math.round(7 + 45 * d.tono)},${Math.round(5 + 25 * d.tono)},${1 - .45 * d.tono})` : N;
  const hueco = (g, f) => { g.save(); g.globalCompositeOperation = 'destination-out'; g.beginPath(); f(); g.fill(); g.restore(); };

  D.suelo = (g, t, d) => {                       // tablas del escenario con matas que se mecen
    const y = d.y || 600; g.fillStyle = color(d); g.beginPath(); g.moveTo(-400, y + 4);
    for (let x = -400; x <= 1700; x += 30) g.lineTo(x, y + 4 + 3 * Math.sin(x * .07)); g.lineTo(1700, 900); g.lineTo(-400, 900); g.fill();
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
})();
