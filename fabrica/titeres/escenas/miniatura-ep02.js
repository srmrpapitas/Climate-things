// Españistán ep. 2 · miniatura (un fotograma, en t = 1,5). Feijolo señala desde lo alto; el Decano lo mira con la lupa. Letras con miniatura.sh 2.
const jack = { jack: true, quieto: true, figura: '#3b3431', sombra: 9, contraluz: 0, bordes: ['rgb(200,225,255)', 'rgb(90,150,255)'], borde: .7 };
const gente = [470, 540, 610, 680, 1000, 1070, 1140, 1210].map((x, i) => ({ p: Object.assign({}, ciudadano(40 + i), { escala: .62, tono: .85 }), x, y: -10 + (i % 3) * 8,
  mira: x < 840 ? 1 : -1, acciones: [{ hace: i % 2 ? 'piensa' : 'encoge', en: 0, hasta: 999 }] }));
window.ESCENA = {
  dura: 2, fps: 30, suelo: 600,
  planos: [
    { desde: 0, ...jack, viento: 1, camara: [[0, 660, 290, .85]],
      decorado: [{ tipo: 'plano', color: '#163a7a', par: .3 }, { tipo: 'disco', x: 840, y: 250, r: 240, color: '#3d8bd9', par: .3 },
        { tipo: 'roca', x: 840, y: 600, escala: 1.6, par: 1 }, { tipo: 'suelo', par: 1, matas: 0 }],
      actores: [
        { p: PERSONAJES.feijolo, x: 830, y: -95, mira: -1, acciones: [{ hace: 'senala', en: 0, hasta: 999, entra: .01 }] },
        ...gente,
        { p: PERSONAJES.decano, x: 1350, y: 0, mira: -1, acciones: [{ hace: 'brazos', h: 1.6, c: .2, en: 0, hasta: 999, entra: .01 }] }] },
  ],
};
