// Españistán ep. 5 · secuencia A, «Gancho» (bloque 1). Estilo `jack`, 30 fps. Tiempos: tiempos-05.js (estimados hasta que exista la voz).
// Plan: fabrica/titeres/CAPITULO-05-PLANOS.md. Escala: la litera, ridícula para dos adultos, en un cuarto grande y oscuro.
//   b1      cuarto de noche, lluvia en la ventana. Lucía (mira el piso en el papel) y Dani junto a la litera. «dos sueldos» → bajan dos nóminas;
//           «litera» → Lucía se gira hacia la litera (giro natural) y la cámara se abre: la litera entera, diminuta para dos adultos.
//   b1.2    corte seco a la mesa: dos tartas. «a los treinta» → ESPAÑISTÁN · 30; «veintiséis» → EUROPA · 26.
//   b1.3    la cámara viaja a la ventana: la noria del ep. 4 gira a lo lejos bajo la lluvia. «quién la dejó así» → se acerca más.  → INTRO
const G = T.guion([1]), en = G.en;
const LU = PERSONAJES.lucia, DA = PERSONAJES.dani;
const jack = { jack: true, quieto: true, figura: '#2b2522', sombra: 9, contraluz: 0, bordes: ['rgb(150,180,255)', 'rgb(255,170,100)'], borde: .8 };
// palabras clave (a ojo, a 14 letras/s; G.x las pasa al segundo real)
const SUELDOS = G.x('b1', 2.9), LITERA = G.x('b1', 4.3), TREINTA = G.x('b1.2', 3.6), VEINTISEIS = G.x('b1.2', 5.7), VIVIENDA = G.x('b1.3', .9), DEJO = G.x('b1.3', 4.2);
const nota = (en0, hasta, titulo, filas, fuente, x = 40) => ({ en: en0, hasta, x, y: 40, ancho: 420, titulo, filas, fuente });
const cuarto = [{ tipo: 'cuarto', lluvia: .7, par: 1 }];
window.ESCENA = {
  dura: G.fin, fps: 30, suelo: 600, voces: G.voces,
  silencios: [[TREINTA - .55, TREINTA - .05]],
  sonidos: [
    { en: 0, hasta: G.fin, archivo: 'audio/sfx/lluvia.mp3', volumen: .22, bucle: true },
    { en: 0, hasta: G.fin, archivo: 'audio/sfx/ciudad.mp3', volumen: .06, bucle: true },
    { en: SUELDOS, archivo: 'audio/sfx/whoosh.mp3', volumen: .2 },
    { en: LITERA, archivo: 'audio/sfx/whoosh.mp3', volumen: .3 },
    { en: TREINTA, archivo: 'audio/sfx/impacto.mp3', volumen: .35 }, { en: VEINTISEIS, archivo: 'audio/sfx/impacto.mp3', volumen: .3 },
    { en: DEJO, archivo: 'audio/sfx/riser.mp3', volumen: .2 }, { en: DEJO + 1.5, archivo: 'audio/sfx/trueno.mp3', volumen: .3 }],
  carteles: [
    nota(G.x('b1', .4), en['b1.2'] - .2, 'Lucía y Dani', [['Edad', '31 años'], ['Viven', 'con los padres de él', '#7a1410']], 'Personajes de ejemplo'),
    nota(TREINTA + .2, en['b1.3'] + 1.5, 'Edad media al irse de casa', [['Españistán', '≈ 30 años', '#7a1410'], ['Unión Europea', '26,3 años']], 'Eurostat, 2025', 770),
  ],
  planos: [
    { desde: 0, ...jack, franjas: true, decorado: [...cuarto, { tipo: 'litera', x: 250, par: 1 }],
      delante: [{ tipo: 'nomina', en: SUELDOS, x: 660, y: 190, escala: .34, texto: '22.000 €' }, { tipo: 'nomina', en: SUELDOS + .25, x: 950, y: 200, escala: .34, texto: '21.000 €' }],
      actores: [
        { p: LU, x: 560, mira: -1, acciones: [{ hace: 'piensa', en: .8, hasta: SUELDOS }, { hace: 'gira', en: LITERA - .2 }, { hace: 'encoge', en: LITERA + .7, hasta: LITERA + 2 }] },
        { p: { ...DA, objeto: 'papel' }, x: 840, mira: -1, acciones: [{ hace: 'inclina', en: SUELDOS + .3, hasta: SUELDOS + 1.6 }, { hace: 'niega', en: LITERA + .5, hasta: LITERA + 1.8 }] }],
      camara: [[0, 720, 400, 1.5], [SUELDOS, 720, 390, 1.55], [LITERA, 720, 390, 1.55], [LITERA + 1.3, 560, 360, 1.02], [en['b1.2'], 540, 360, .98]] },
    { desde: en['b1.2'] - .05, ...jack, decorado: [...cuarto, { tipo: 'litera', x: 260, par: 1 }, { tipo: 'mesa', x: 640, y: 600, ancho: 520, par: 1 }],
      delante: [{ tipo: 'tarta', en: TREINTA, x: 500, y: 520, velas: 3, texto: 'ESPAÑISTÁN · 30', escala: .95 },
        { tipo: 'tarta', en: VEINTISEIS, x: 820, y: 520, velas: 2, texto: 'EUROPA · 26', escala: .95 }],
      camara: [[en['b1.2'] - .05, 650, 420, 1.55], [TREINTA, 640, 430, 1.6], [VEINTISEIS, 680, 420, 1.62], [en['b1.3'], 670, 410, 1.7]] },
    { desde: en['b1.3'], ...jack, decorado: [...cuarto, { tipo: 'litera', x: 260, par: 1 }],
      actores: [{ p: LU, x: 700, mira: 1, acciones: [] }, { p: DA, x: 560, mira: 1, acciones: [{ hace: 'camina', en: VIVIENDA + .3, hasta: VIVIENDA + 1.8, a: 640 }] }],
      camara: [[en['b1.3'], 640, 360, 1], [VIVIENDA, 760, 300, 1.35], [DEJO, 950, 270, 2.1], [G.fin, 990, 250, 2.6]] },
  ],
};
