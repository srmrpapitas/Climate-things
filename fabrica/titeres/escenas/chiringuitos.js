// Españistán ep. 3 · secuencia F, «Los chiringuitos» (bloques 22–25 y la frase f3). Estilo `jack`, 30 fps. Tiempos del audio (tiempos.js).
// Datos: 03-abascal.md, bloque 5 (cuentas de Vox en el Tribunal de Cuentas, vía El Español: Disenso 2,5 M en 2023 + 2 M en 2024).
//   b22     el Decano, en sepia: ¿se vota por lo que propone o por contra quién está?
//   b23     (viento) una fila de chiringuitos con un afín en cada ventanilla. b23.2: llega Acascar y los va tirando a golpes.
//   b24, f3 (tinta) primer plano de frente: «Hay que cerrar todos los chiringuitos. Empezando por los de los demás.»
//   b25     (humo) la letra pequeña: los chiringuitos, por los suelos; uno sigue en pie, DISENSO, y su saco engorda. b25.2: plano corto.
const G = T.guion([22, 23, 24, 'f3', 25]), en = G.en;
const AC = PERSONAJES.acascar, DE = PERSONAJES.decano;
const jack = { jack: true, quieto: true, figura: '#3b3431', sombra: 9, contraluz: 0, bordes: ['rgb(255,226,190)', 'rgb(255,120,70)'], borde: .7 };
const playa = [{ tipo: 'plano', color: '#d08a3a', raya: 'rgba(90,40,10,.2)', luz: 'rgba(255,220,150,.12)', par: .3 }, { tipo: 'disco', x: 1080, y: 200, r: 90, color: '#efb85c', par: .3 },
  { tipo: 'colinas', tono: .35, par: .45, y: 540, alto: 30 }];
const golpe = en['b23.2'] + 1.6;   // cuándo cae el primero
const NOMBRES = ['OBSERVATORIO', 'CONSEJO ASESOR', 'AGENCIA', 'COMISIONADO'];
const XS = [330, 590, 850, 1110];   // de pie: grandes, a la altura de Acascar
const casetas = (caidas, xs = XS, escala = 1.75) => NOMBRES.map((rotulo, i) => ({ tipo: 'caseta', x: xs[i], escala, par: 1, rotulo, tam: rotulo.length > 11 ? 12 : 15, cae: caidas ? caidas[i] : null }));
const CAEN = NOMBRES.map((_, i) => golpe + 1.1 * i);
window.ESCENA = {
  dura: G.fin, fps: 30, suelo: 600, voces: G.voces,
  sonidos: CAEN.map(en => ({ en, archivo: 'audio/sfx/derrumbe.mp3', volumen: .35 })),
  carteles: [
    { en: en.b22 + .4, hasta: en.b23 - .3, x: 40, y: 40, ancho: 520, titulo: 'Pregunta del Decano', paso: 2.2,
      filas: [['¿Se vota por lo que propone…', ''], ['…o por contra quién está?', '']], fuente: 'Españistán' },
    { en: en.b23 + .5, hasta: en['b23.2'] + 1, x: 40, y: 40, ancho: 600, titulo: 'Chiringuitos', paso: 1.4,
      filas: [['Dinero público en organismos', ''], ['para colocar a los afines', '']], fuente: '03-abascal.md' },
    { en: en.b25 + .4, hasta: G.fin - .2, x: 40, y: 40, ancho: 620, titulo: 'La letra pequeña · 2023 – 2024', paso: en['b25.2'] - en.b25 - .4,
      filas: [['Vox vive sobre todo de', 'dinero público'], ['A su propia fundación, Disenso', '4,5 millones €', '#7a1410']], fuente: 'Cuentas de Vox (Tribunal de Cuentas), vía El Español' }],
  planos: [
    { desde: 0, ...jack, tinte: 'sepia', viento: .1, decorado: [{ tipo: 'plano', color: '#6b4426', par: .3 }, { tipo: 'astro', x: 700, y: 260, r: 70, par: .3 }, { tipo: 'suelo', par: 1, matas: 0 }],
      actores: [{ p: DE, x: 900, mira: -1, acciones: [{ hace: 'piensa', en: en.b22 + .2, hasta: en.b22 + 2.6 }, { hace: 'senala', en: en.b22 + 2.9, hasta: en.b23 }] }],
      camara: [[0, 760, 330, 1.05]] },
    { desde: en.b23 - .2, transicion: 'viento', ...jack, viento: .4, franjas: true, decorado: [...playa, ...casetas(CAEN), { tipo: 'suelo', par: 1, matas: 0 }],
      actores: [{ p: AC, x: -160, mira: 1, acciones: [{ hace: 'camina', en: en['b23.2'] - .6, hasta: golpe - .4, a: XS[0] - 170 },   // delante de cada caseta, un golpe y a la siguiente
        ...CAEN.flatMap((c, i) => [{ hace: 'golpea', en: c - .35, hasta: c + .1, entra: .1 }, ...(i < 3 ? [{ hace: 'camina', en: c + .15, hasta: c + .85, a: XS[i + 1] - 170 }] : [])]),
        { hace: 'gira', en: CAEN[3] + .6 }] }],
      camara: [[0, 640, 360, .95]] },
    { desde: en.b24 - .2, transicion: 'tinta', ...jack, viento: .3, decorado: [...playa, { tipo: 'suelo', par: 1, matas: 0 }],
      actores: [{ p: AC, x: 640, vista: 'frente', acciones: [{ hace: 'habla', en: en.f3, hasta: en.f3 + 4.6 }, { hace: 'senala', en: en.f3 + 2.6, hasta: en.f3 + 4.6 }] }],
      camara: [[0, 640, 290, 2], [en.b25, 640, 285, 2.15]] },
    { desde: en.b25 - .2, transicion: 'humo', ...jack, viento: .3, camara: [[0, 640, 360, .95], [en['b25.2'] - .1, 640, 360, .95], [en['b25.2'] - .1, 1060, 345, 1.45]],
      decorado: [...playa, ...casetas(NOMBRES.map(() => -9), [40, 270, 500, 730], 1.3), { tipo: 'caseta', x: 1050, escala: 1.8, par: 1, rotulo: 'DISENSO' },
        { tipo: 'saco', x: 1230, y: 600, escala: 1.1, crece: .5, en: en['b25.2'], par: 1 }, { tipo: 'suelo', par: 1, matas: 0 }],
      actores: [] },
  ],
};
