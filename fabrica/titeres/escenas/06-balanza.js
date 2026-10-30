// Españistán ep. 6 · secuencia 11, «Balance» (bloques 47–50). `cartoon`. Plan: CAPITULO-06-PLANOS.md.
//   b47  el barrio de noche: el calendario pasa años sin plan; «los que llegan» → una patera; «los barrios» → las ventanas se apagan.
//   b48  metamorfosis en hojas: la playa de Ceuta al amanecer, el mar en calma, la balanza en la arena. Cada cosa cae en su plato en su palabra;
//        «setenta y cinco muertos» → las 75 velas en la orilla.
//   b49  «lo decides tú» → plano corto: la balanza tiembla y no se decide.
//   b50  (sin cortar) la cámara se aleja: Lucía, Dani y el recién llegado miran el amanecer; la urna y «VOTA · PREGUNTA».
const G = T.guion([47, 48, 49, 50]), en = G.en, k = G.k, P = PERSONAJES;
const cartoon = { cartoon: true, jack: true, figura: '#2b2235', sombra: 8, contraluz: 0, bordes: ['rgb(150,210,255)', 'rgb(255,150,90)'], borde: .8 };
const ANO = k(47, 'cada año'), LLEGAN = k(47, 'los que llegan'), BARRIOS = k(47, 'barrios'), DIEZ = k(48, 'diez millones'), TRES = k(48, 'tres millones'), MANOS = k(48, 'manos'),
  EXPUL = k(48, 'expulsiones'), REGUL = k(48, 'regularizaciones'), CASAS = k(48, 'casas'), MUERTOS = k(48, 'setenta y cinco'), DECIDES = k(49, 'decides'), VOTES = k(50, 'votes'), ORDENAR = k(50, 'ordenar');
window.ESCENA = {
  dura: G.fin + 1, fps: 30, suelo: 600, voces: G.voces,
  silencios: [[MUERTOS, DECIDES + 1]],
  sonidos: [
    { en: 0, hasta: en.b48, archivo: 'audio/sfx/ciudad.mp3', volumen: .15, bucle: true }, { en: en.b48 - 1.2, archivo: 'audio/sfx/whoosh.mp3', volumen: .35 },
    { en: en.b48, hasta: G.fin + 1, archivo: 'audio/sfx/ola.mp3', volumen: .35, bucle: true },
    ...[DIEZ, TRES, MANOS, EXPUL, REGUL, CASAS].map(t => ({ en: t + .2, archivo: 'audio/sfx/eleven/tic.mp3', volumen: .35 })), { en: MUERTOS + .3, archivo: 'audio/sfx/campana.mp3', volumen: .3 }],
  planos: [
    { desde: 0, ...cartoon, viento: .2, decorado: [{ tipo: 'cieloNoche', arriba: '#0c0f24', abajo: '#2a2a50', n: 30, par: .2 }, { tipo: 'bloque', x: 900, y: 600, cols: 6, pisos: 6, todas: BARRIOS + .3, par: .8 }, { tipo: 'suelo', par: 1, matas: 0 }],
      delante: [{ tipo: 'calendario', x: 330, y: 300, en: ANO - .5, anos: [2020, 2021, 2022, 2023, 2024, 2025, 2026], cada: .5, sello: 'SIN PLAN' }],
      actores: [0, 1, 2].map(i => ({ p: ciudadano(830 + i, { escala: .7 }), x: 640 + 140 * i, mira: -1, desde: LLEGAN - .3, acciones: [{ hace: 'camina', en: LLEGAN - .2 + .2 * i, hasta: BARRIOS + .4, a: 760 + 120 * i }, { hace: 'encoge', en: BARRIOS + .6, hasta: en.b48 }] })),
      camara: [[0, 500, 380, 1.1], [LLEGAN, 700, 380, 1.05], [en.b48, 800, 380, 1.12]] },
    { desde: en.b48 - .2, transicion: 'metamorfosis', materia: 'hojas', ...cartoon, viento: .15,
      decorado: [{ tipo: 'cieloNoche', arriba: '#2a2a6a', abajo: '#f39a5a', n: 10, par: .2 }, { tipo: 'astro', x: 640, y: 450, r: 80, par: .25 }, { tipo: 'playa', y: 560, calma: .8, par: .8 }],
      delante: [{ tipo: 'balanza', x: 640, y: 610, escala: .95, en: en.b48, izq: ['10 MILLONES DE VECINOS', '3,5 MILLONES COTIZANDO', 'UN PAÍS QUE NECESITA MANOS'], izqEn: [DIEZ, TRES, MANOS],
          der: ['EXPULSIONES DE PAPEL', 'REGULARIZACIONES A GOLPE', 'CASAS QUE NO LLEGAN', '75 MUERTOS EN EL AGUA'], derEn: [EXPUL, REGUL, CASAS, MUERTOS], pesos: [[MANOS, -.5], [CASAS, .3], [MUERTOS + .5, 0]] },
        { tipo: 'velas', en: MUERTOS + .2, dura: 3, n: 75, x0: 60, x1: 1220, y: 650 }, { tipo: 'urna', x: 1060, y: 600, escala: .9, desde: VOTES - .4 },
        { tipo: 'burbuja', x: 1080, y: 250, texto: 'VOTA · PREGUNTA', en: VOTES, ancho: 300, tam: 32, color: '#2e6b2e' }],
      actores: [{ p: P.lucia, x: -200, mira: 1, desde: DECIDES + 1, acciones: [{ hace: 'camina', en: DECIDES + 1.2, hasta: VOTES, a: 40 }, { hace: 'vista', en: ORDENAR, a: 'frente' }] },
        { p: P.dani, x: -300, mira: 1, desde: DECIDES + 1, acciones: [{ hace: 'camina', en: DECIDES + 1.3, hasta: VOTES + .2, a: 140 }] },
        { p: P.llegado, x: -420, mira: 1, desde: DECIDES + 1, acciones: [{ hace: 'camina', en: DECIDES + 1.4, hasta: VOTES + .4, a: 250 }, { hace: 'miraCamara', en: ORDENAR, hasta: G.fin + 1 }] }],
      camara: [[en.b48, 640, 360, 1.05], [MUERTOS, 640, 420, 1], [DECIDES - .3, 640, 300, 1.35], [DECIDES + 1, 640, 300, 1.35], [VOTES, 640, 380, .98], [G.fin + 1, 600, 400, 1]] },
  ],
};
