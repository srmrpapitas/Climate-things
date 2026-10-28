// Españistán ep. 4 · secuencia A, «Gancho» (bloques 1–2). Estilo `jack`, 30 fps. Tiempos: tiempos-04.js (estimados hasta que exista la voz).
// Plan: fabrica/titeres/CAPITULO-04-PLANOS.md. Escala: la noria tapa el cielo y la gente, diminuta, mira desde abajo.
//   b1      feria de noche bajo la llovizna: la noria entera contra la luna; «dos partidos» → la cámara sube a las dos cabinas encendidas.
//   b1.2    «se pelean» → las cabinas se zarandean. Calma (se apaga el ambiente) y, en «la misma mesa», corte seco al banquete.
//   b2      el salón: lámparas, el pastel con el mapa, dos sillones vacíos; fuera, la gente pegada al cristal bajo la lluvia.
//           «quién se sienta» → dos sombras entran por los lados hacia los sillones.  → INTRO (intro.js con EPISODIO del ep. 4)
const G = T.guion([1, 2]), en = G.en;
const SA = PERSONAJES.sanchis, FE = PERSONAJES.feijolo;
const jack = { jack: true, quieto: true, figura: '#2b2522', sombra: 9, contraluz: 0, bordes: ['rgb(190,215,255)', 'rgb(255,150,90)'], borde: .8 };
const PELEAN = en['b1.2'] + 1.1, MESA = en['b1.2'] + 4.9;   // «se pelean» y «la misma mesa» (ajustar con el audio real)
const feria = [
  { tipo: 'plano', color: '#131b30', raya: 'rgba(0,0,0,.28)', luz: 'rgba(110,140,210,.08)', par: .2 },
  { tipo: 'astro', x: 900, y: 120, r: 46, luna: true, par: .2 },
  { tipo: 'nubes', tono: .35, n: 5, y: 60, par: .25 },
  { tipo: 'ciudad', tono: .55, par: .35, y: 560, s: 4 },
  { tipo: 'noria', x: 640, y: 640, r: 300, vel: .025, fase: -.025 * T.TAU * PELEAN, sacude: [PELEAN], extra: [], par: .8 },   // en PELEAN, cabinas a los lados del eje
  { tipo: 'farola', x: 160, par: 1 }, { tipo: 'farola', x: 1120, par: 1 },
  { tipo: 'suelo', par: 1, matas: 0 }];
// la gente, pequeña al pie de la noria: miran hacia arriba; un niño señala
const gente = [80, 81, 82, 83, 84, 85, 86, 87].map((n, i) => ({ p: ciudadano(n, { escala: .27 + .04 * (i % 3) }), x: 330 + i * 88 + 20 * T.azar(n), mira: i < 4 ? 1 : -1,
  acciones: i === 2 ? [{ hace: 'senala', en: en.b1 + 2.5, hasta: en.b1 + 6 }] : i === 5 ? [{ hace: 'encoge', en: PELEAN + .3, hasta: PELEAN + 2 }] : [] }));
const sombra = (p, x, a, en0) => ({ p, x, mira: x < 640 ? 1 : -1, acciones: [{ hace: 'camina', en: en0, hasta: en0 + 2.4, a }] });
window.ESCENA = {
  dura: G.fin, fps: 30, suelo: 600, voces: G.voces,
  silencios: [[MESA - 1, MESA]],
  sonidos: [
    { en: 0, hasta: MESA, archivo: 'audio/sfx/lluvia.mp3', volumen: .35, bucle: true },
    { en: 0, hasta: MESA, archivo: 'audio/sfx/viento.mp3', volumen: .25, bucle: true },
    { en: PELEAN, archivo: 'audio/sfx/impacto.mp3', volumen: .35 },
    { en: MESA, hasta: G.fin, archivo: 'audio/sfx/lluvia.mp3', volumen: .1, bucle: true },     // dentro: la lluvia, tras el cristal
    { en: MESA, hasta: G.fin, archivo: 'audio/sfx/dron.mp3', volumen: .22, bucle: true },
    { en: MESA, archivo: 'audio/sfx/impacto.mp3', volumen: .5 }],
  planos: [
    { desde: 0, ...jack, viento: .4, franjas: true, decorado: feria, actores: gente,
      particulas: [{ tipo: 'lluvia', n: 320, viento: 120, fuerza: [[0, .35], [MESA, .7]] }],
      camara: [[0, 640, 360, 1], [en['b1.2'] - .1, 640, 330, 1.1], [en['b1.2'] - .1, 640, 330, 1.25], [PELEAN, 640, 325, 1.3], [MESA, 640, 320, 1.38]] },
    { desde: MESA, ...jack, viento: 0, borde: 0, decorado: [{ tipo: 'salon', lluvia: .8, par: 1 }],
      actores: [sombra(SA, -140, 200, en.b2 + 1.6), sombra(FE, 1420, 1080, en.b2 + 1.9)],
      camara: [[0, 640, 330, 1.08], [G.fin, 640, 340, 1.2]] },
  ],
};
