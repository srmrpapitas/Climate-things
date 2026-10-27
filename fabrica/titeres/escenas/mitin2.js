// Escena de prueba (24 s) en 6 planos, con vistas de frente y de espaldas:
//   0–4     general: la plaza al atardecer, llega la gente.
//   4–7,4   medio, de perfil: Acascar cruza hasta el atril.
//   7,4–11  primer plano DE FRENTE: Acascar habla y alza el puño.
//   11–14   contraplano DESDE SU ESPALDA: el público, de frente, lo celebra.
//   14–19   general: entra el Decano, le señala con la lupa; Acascar se encoge de hombros.
//   19–24   primer plano DE FRENTE del Decano: piensa, levanta una ceja y habla.
const cielo = [
  { tipo: 'astro', x: 980, y: 190, r: 60, par: .15 },
  { tipo: 'nubes', tono: .75, par: .2, n: 4 },
  { tipo: 'montes', tono: .8, par: .25, y: 470 },
  { tipo: 'ciudad', tono: .55, par: .45, y: 545 },
];
const plaza = [...cielo,
  { tipo: 'arbol', x: 40, tono: .3, escala: 1.1, par: .8 },
  { tipo: 'arbol', x: 1240, tono: .3, escala: 1.2, par: .8, s: 9 },
  { tipo: 'farola', x: 560, par: 1 },
  { tipo: 'bandera', x: 1060, par: 1, alto: 340, ancho: 150, tela: 95 },
  { tipo: 'suelo', par: 1 },
];
const aire = [{ tipo: 'pajaros', n: 7, zona: [0, 60, 1280, 260] }, { tipo: 'hojas', n: 6, zona: [0, 200, 1280, 560] }];
const gente = [0, 1, 2, 3, 4, 5, 6].map(i => ({ p: ciudadano(i + 1, { escala: .8, tono: .82 }), x: 110 + i * 58 + 14 * T.azar(i), mira: 1,
  acciones: [
    ...(i % 3 === 0 ? [{ hace: 'camina', en: .3 + i * .1, hasta: 2.6 + i * .1, a: 110 + i * 58 + 14 * T.azar(i) }] : []),
    { hace: 'asiente', en: 5 + i * .3, hasta: 6.2 + i * .3 },
    { hace: i === 2 ? 'piensa' : 'brazos', h: .2, c: .3, en: 15.5, hasta: 19 },
  ] }));
gente[0].x = -60; gente[3].x = -20; gente[6].x = 40;
const acascar = { p: PERSONAJES.acascar, x: 1460, mira: -1, acciones: [
  { hace: 'camina', en: 4.2, hasta: 7.2, a: 960 },
  { hace: 'encoge', en: 16.4, hasta: 18 }, { hace: 'habla', en: 16.6, hasta: 17.6 },
] };
const decano = { p: PERSONAJES.decano, x: -180, mira: 1, acciones: [
  { hace: 'camina', en: 14.1, hasta: 16.3, a: 620 },
  { hace: 'senala', en: 16, hasta: 17.4 }, { hace: 'asiente', en: 16.6, hasta: 17.3 },
] };
window.ESCENA = {
  dura: 24, fps: 12, suelo: 600,
  planos: [
    { desde: 0, decorado: plaza, delante: [{ tipo: 'atril', x: 900 }], actores: [...gente, acascar, decano], luces: [[560, 314]], particulas: aire,
      camara: [[0, 640, 360, 1.0], [4, 620, 370, 1.07], [4, 1050, 400, 1.55], [7.4, 960, 410, 1.6]] },
    { desde: 7.4, decorado: [...cielo, { tipo: 'bandera', x: 860, par: .9, alto: 420, ancho: 170, tela: 110 }, { tipo: 'suelo', par: 1 }],
      delante: [{ tipo: 'atril', x: 640 }], particulas: aire,
      actores: [{ p: PERSONAJES.acascar, x: 640, vista: 'frente', acciones: [
        { hace: 'habla', en: 7.7, hasta: 8.6 }, { hace: 'puno', en: 8.5, hasta: 10.5 }, { hace: 'habla', en: 8.8, hasta: 10.8 }] }],
      camara: [[7.4, 640, 300, 2.1], [11, 640, 290, 2.45]] },
    { desde: 11, decorado: [...cielo, { tipo: 'farola', x: 200, par: .9 }, { tipo: 'farola', x: 860, par: .9 }, { tipo: 'suelo', par: 1, y: 560 }],
      luces: [[200, 288], [860, 288]], particulas: [...aire, { tipo: 'papeles', en: 11.3, hasta: 14, n: 30, zona: [60, -40, 1000, 600] }],
      actores: [
        ...[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => ({ p: ciudadano(i + 1, { escala: .62 + .06 * T.azar(i + 3), tono: .78 }), x: 120 + i * 92 + 20 * T.azar(i), vista: 'frente', z: 1,
          acciones: [{ hace: i % 3 === 1 ? 'aplaude' : 'celebra', en: 11.2 + i * .07, hasta: 14.2 }, { hace: 'salta', en: 12 + (i % 4) * .25 }] })),
        { p: PERSONAJES.acascar, x: 1010, vista: 'espalda', z: 1.75, acciones: [{ hace: 'puno', en: 11.1, hasta: 13.6 }, { hace: 'saluda', en: 13.4, hasta: 14.4 }] },
      ],
      camara: [[11, 640, 380, 1.0], [14, 680, 360, 1.08]] },
    { desde: 14, decorado: plaza, delante: [{ tipo: 'atril', x: 900 }], actores: [...gente, acascar, decano], luces: [[560, 314]], particulas: aire,
      camara: [[14, 640, 380, 1.05], [17.4, 700, 380, 1.15], [19, 680, 370, 1.22]] },
    { desde: 19, decorado: [...cielo, { tipo: 'farola', x: 380, par: .8 }, { tipo: 'suelo', par: 1 }], luces: [[380, 314]], particulas: aire,
      actores: [{ p: Object.assign({}, PERSONAJES.decano, { objeto: 'lupa', objetoLejos: 'candil' }), x: 640, vista: 'frente', acciones: [
        { hace: 'asiente', en: 19.2, hasta: 19.9 }, { hace: 'piensa', en: 20, hasta: 22.2 },
        { hace: 'senala', en: 22.3, hasta: 24.2 }, { hace: 'habla', en: 22.5, hasta: 23.8 }] }],
      camara: [[19, 640, 320, 2.2], [24, 640, 300, 2.6]] },
  ],
};
