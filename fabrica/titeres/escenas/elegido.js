// EL ELEGIDO y la Espada de la Verdad (≈ 22 s): presentación del protagonista de la serie.
//   0–5     general nocturno: llanura, horizonte en llamas, estrellas; el Elegido camina contra el viento.
//   5–8,5   (viento) primer plano de frente: la mirada, el moño y la cinta al viento.
//   8,5–13  plano medio: el Vendehúmos, con su máscara de PROMESAS, sonríe y habla; el Elegido avanza.
//   13–16,5 (viento, rojo) el tajo: la espada corta la máscara, que cae en dos mitades; debajo, la cara real.
//   16,5–22 (viento, noche) el Elegido en lo alto de una roca, espada en alto; a lo lejos, los políticos. Título.
// La espada es lo único en color real de todo el teatro.
const noche = [
  { tipo: 'astro', x: 1000, y: 140, r: 34, luna: true, par: .1 },
  { tipo: 'nubes', tono: .8, par: .2, n: 3, y: 90 },
  { tipo: 'horizonte', par: .35, y: 500, torres: [[260, 170], [1080, 110]] },
  { tipo: 'suelo', par: 1, matas: 8 },
];
const cielo = [{ tipo: 'estrellas', n: 90, zona: [0, 0, 1280, 420] }, { tipo: 'polvo', n: 30 }, { tipo: 'hojas', n: 5, zona: [0, 200, 1280, 560] }];
const E = PERSONAJES.elegido, VH = PERSONAJES.vendehumos;
window.ESCENA = {
  dura: 22, fps: 30, suelo: 600,
  titulos: [{ en: 18, hasta: 22, texto: 'EL ELEGIDO', sub: 'y la Espada de la Verdad', y: 600 }],
  planos: [
    { desde: 0, tinte: 'noche', viento: .7, decorado: noche, particulas: cielo,
      actores: [{ p: E, x: -120, mira: 1, acciones: [{ hace: 'camina', en: .4, hasta: 4.8, a: 600 }] }],
      camara: [[0, 520, 380, 1.05], [5, 600, 360, 1.25]] },
    { desde: 5, transicion: 'viento', tinte: 'noche', viento: .8, decorado: noche, particulas: cielo,
      actores: [{ p: E, x: 640, vista: 'frente', acciones: [{ hace: 'asiente', en: 7.4, hasta: 8 }] }],
      camara: [[5, 640, 250, 2.3], [8.5, 640, 245, 2.55]] },
    { desde: 8.5, tinte: 'noche', viento: .6, decorado: noche, particulas: cielo,
      actores: [
        { p: VH, x: 860, mira: -1, acciones: [{ hace: 'habla', en: 8.7, hasta: 12.6 }, { hace: 'saluda', en: 8.8, hasta: 10.2 }, { hace: 'encoge', en: 11, hasta: 12.4 }] },
        { p: E, x: 260, mira: 1, acciones: [{ hace: 'camina', en: 10, hasta: 12.6, a: 520 }] }],
      camara: [[8.5, 560, 380, 1.45], [13, 640, 370, 1.55]] },
    { desde: 13, transicion: 'viento', tinte: 'rojo', viento: .9, decorado: noche, particulas: cielo,
      actores: [
        { p: VH, x: 800, mira: -1, acciones: [{ hace: 'habla', en: 13, hasta: 14 }, { hace: 'desenmascara', en: 14.25, hasta: 16.4 }, { hace: 'inclina', en: 15.2, hasta: 16.4 }] },
        { p: E, x: 560, mira: 1, acciones: [{ hace: 'corta', en: 14.2, hasta: 16.2 }] }],
      camara: [[13, 690, 360, 1.7], [14.2, 700, 350, 1.95], [16.5, 720, 340, 2.05]] },
    { desde: 16.5, transicion: 'viento', tinte: 'noche', viento: .75, decorado: [noche[0], noche[1], { tipo: 'horizonte', par: .35, y: 590, torres: [[260, 170], [1080, 110]] }, noche[3],
        { tipo: 'roca', x: 520, y: 612, escala: 1.8, par: 1, tono: .12 }],
      particulas: cielo,
      actores: [
        { p: E, x: 520, y: -158, mira: 1, acciones: [{ hace: 'puno', en: 17.2, hasta: 23 }] },
        ...[['sanchis', 960], ['feijolo', 1060], ['acascar', 1160]].map(([n, x]) => ({ p: Object.assign({}, PERSONAJES[n], { escala: .55, tono: .6 }), x, mira: -1, acciones: [{ hace: 'encoge', en: 18.5 + x / 2000, hasta: 20 }] })),
      ],
      camara: [[16.5, 640, 300, .96], [22, 620, 280, 1.02]] },
  ],
};
