// Escena de prueba (18 s): un mitin al atardecer contado en planos, como un corto.
//   0–4 s   plano general: la plaza, la gente llega y espera.
//   4–8 s   plano medio: Acascar cruza hasta el atril y se vuelve al público.
//   8–11 s  primer plano: alza el puño y habla.
//   11–13,5 contraplano: el público lo celebra; vuelan papeles.
//   13,5–18 plano general: entra el Decano con su candil, le señala con la lupa; Acascar se encoge de hombros; el Decano piensa.
// camara: [segundo, x, y, zoom]; dos claves en el mismo segundo = corte de plano.
const gente = [0, 1, 2, 3, 4, 5, 6].map(i => ({ p: ciudadano(i + 1, { escala: .8, tono: .82 }), x: 110 + i * 58 + 14 * T.azar(i), mira: 1,
  acciones: [
    ...(i % 3 === 0 ? [{ hace: 'camina', en: .3 + i * .1, hasta: 2.6 + i * .1, a: 110 + i * 58 + 14 * T.azar(i) }] : []),
    { hace: 'asiente', en: 6 + i * .3, hasta: 7.2 + i * .3 },
    { hace: i % 2 ? 'celebra' : 'aplaude', en: 10.6 + i * .09, hasta: 13.4 + i * .05 },
    { hace: i === 2 ? 'piensa' : 'brazos', h: .2, c: .3, en: 15, hasta: 18 },
  ] }));
gente[0].x = -60; gente[3].x = -20; gente[6].x = 40;                 // tres que llegan andando desde fuera
window.ESCENA = {
  dura: 18, fps: 30, suelo: 600,
  decorado: [
    { tipo: 'astro', x: 980, y: 190, r: 60, par: .15 },
    { tipo: 'nubes', tono: .75, par: .2, n: 4 },
    { tipo: 'montes', tono: .8, par: .25, y: 470 },
    { tipo: 'ciudad', tono: .55, par: .45, y: 545 },
    { tipo: 'arbol', x: 40, tono: .3, escala: 1.1, par: .8 },
    { tipo: 'arbol', x: 1240, tono: .3, escala: 1.2, par: .8, s: 9 },
    { tipo: 'farola', x: 560, par: 1 },
    { tipo: 'bandera', x: 1060, par: 1, alto: 340, ancho: 150, tela: 95 },
    { tipo: 'suelo', par: 1 },
  ],
  delante: [{ tipo: 'atril', x: 900 }],
  actores: [
    ...gente,
    { p: PERSONAJES.acascar, x: 1460, mira: -1, acciones: [
      { hace: 'camina', en: 4.2, hasta: 7.2, a: 960 },
      { hace: 'gira', en: 7.3 }, { hace: 'gira', en: 7.6 },
      { hace: 'puno', en: 8.4, hasta: 10.6 }, { hace: 'habla', en: 8.2, hasta: 11 },
      { hace: 'golpea', en: 11.2, hasta: 12.6 }, { hace: 'habla', en: 11.2, hasta: 12.8 },
      { hace: 'encoge', en: 15.6, hasta: 17.2 },
    ] },
    { p: PERSONAJES.decano, x: -180, mira: 1, acciones: [
      { hace: 'camina', en: 13.4, hasta: 15.6, a: 620 },
      { hace: 'senala', en: 15.4, hasta: 16.6 }, { hace: 'asiente', en: 15.8, hasta: 16.5 },
      { hace: 'piensa', en: 16.8, hasta: 18.2 }, { hace: 'habla', en: 16.9, hasta: 17.9 },
    ] },
  ],
  luces: [[560, 314]],
  particulas: [
    { tipo: 'pajaros', n: 7, zona: [0, 60, 1280, 260] },
    { tipo: 'papeles', en: 11, hasta: 13.6, n: 26, zona: [60, -40, 700, 640] },
    { tipo: 'hojas', n: 6, zona: [0, 200, 1280, 560] },
  ],
  camara: [
    [0, 640, 360, 1.0], [4, 620, 370, 1.07],
    [4, 1050, 400, 1.55], [7.4, 960, 410, 1.6],
    [7.4, 960, 330, 2.35], [11, 950, 320, 2.5],
    [11, 330, 440, 1.7], [13.5, 300, 430, 1.85],
    [13.5, 640, 380, 1.05], [16.6, 700, 380, 1.15], [18, 640, 340, 1.75],
  ],
};
