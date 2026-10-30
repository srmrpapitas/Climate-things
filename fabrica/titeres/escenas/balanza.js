// Españistán ep. 3 · secuencia I, «La muralla y la balanza» (bloques 41–47 y la frase f5). Estilo `jack`, 30 fps. Tiempos del audio (tiempos.js).
// Datos: 03-abascal.md, bloques 7 y 8 (programa de Vox para el 29-N).
//   b41     Acascar en el atril; detrás crece una muralla ladrillo a ladrillo; cartel con lo que promete.
//   b42, f5 primer plano de frente: «Yo prometo mano dura. Lo de cómo se paga, ya si eso, después.»
//   b43     (viento) el Decano con la lupa ante la muralla: ¿cuánto cuesta y quién lo paga?
//   b44–45  la balanza: cada cosa cae en su plato cuando la dice el narrador. No se decide.
//   b46     plano corto de la balanza: «lo decides tú». b47: el Decano y Hume.
const G = T.guion([41, 42, 'f5', 43, 44, 45, 46, 47]), en = G.en;
const AC = PERSONAJES.acascar, DE = PERSONAJES.decano;
const jack = { jack: true, quieto: true, figura: '#3b3431', sombra: 9, contraluz: 0, bordes: ['rgb(255,226,190)', 'rgb(255,120,70)'], borde: .7 };
const sala = [{ tipo: 'plano', color: '#c06a28', par: .3 }, { tipo: 'astro', x: 1060, y: 150, r: 40, par: .3 }];
const muralla = (desde) => ({ tipo: 'muralla', x: 640, y: 600, ancho: 1100, filas: 8, en: desde, ritmo: 1, par: .8 });
const balanza = { tipo: 'balanza', x: 560, y: 600, escala: .95, en: en.b44, par: 1,
  izq: ['Creció amenazado por ETA', 'Millones se sienten escuchados', 'Ninguna condena al partido'],
  izqEn: [en.b44 + 2, en['b44.2'] + .2, en['b44.2'] + 2.6],
  der: ['Sueldo mayor que el del presidente', 'Campaña pagada desde fuera', 'Préstamo de un banco de Orbán', 'Fundación propia: millones', 'Fundadores que se fueron'],
  derEn: [en.b45 + 1.2, en.b45 + 3.8, en['b45.2'] + .1, en['b45.2'] + 1.8, en['b45.2'] + 3.6] };
window.ESCENA = {
  dura: G.fin, fps: 30, suelo: 600, voces: G.voces,
  sonidos: [...balanza.izqEn, ...balanza.derEn].map(t => ({ en: t, archivo: 'audio/sfx/impacto.mp3', volumen: .18 })),
  carteles: [
    { en: en.b41 + .3, hasta: en.b42 - .2, x: 40, y: 40, ancho: 600, titulo: 'Lo que promete para el 29 de noviembre', tiempos: [en['b41.2'] + .3, en['b41.2'] + 2.8, en['b41.2'] + 4.3],
      filas: [['Prioridad nacional', 'ayudas y vivienda'], ['Más expulsiones', ''], ['Menos impuestos', '']], fuente: 'programa de Vox' },
    { en: en.b43 + .3, hasta: en.b44 - .2, x: 40, y: 40, ancho: 520, titulo: 'Pregunta del Decano', paso: 1.6, filas: [['¿Cuánto cuesta?', ''], ['¿Quién lo paga?', '']], fuente: 'Españistán' },
    { en: en.b46 + .3, hasta: en.b47 - .2, x: 340, y: 40, ancho: 600, titulo: 'Cuál pesa más', filas: [['lo decides tú', '']], fuente: 'Españistán no te dice a quién votar' },
    { en: en.b47 + .3, hasta: G.fin - .2, x: 40, y: 40, ancho: 640, titulo: 'Hume', filas: [['«El sabio ajusta lo que cree a las pruebas»', '']], fuente: 'David Hume, Investigación sobre el entendimiento humano' }],
  planos: [
    { desde: 0, ...jack, viento: .5, camara: [[0, 640, 380, 1.05]],
      decorado: [...sala, muralla(en.b41 + .5), { tipo: 'suelo', par: 1, matas: 0 }], delante: [{ tipo: 'atril', x: 760 }],
      actores: [{ p: AC, x: 760, vista: 'frente', acciones: [{ hace: 'golpea', en: en.b41 + .6, hasta: en.b41 + 2.4 }, { hace: 'puno', en: en['b41.2'] + 2.6, hasta: en['b41.2'] + 4.2 }] }] },
    { desde: en.b42 - .1, ...jack, viento: .5, camara: [[0, 760, 330, 2], [en.f5 + 5.6, 760, 325, 2.15]],
      decorado: [...sala, muralla(-99), { tipo: 'suelo', par: 1, matas: 0 }], delante: [{ tipo: 'atril', x: 760 }],
      actores: [{ p: AC, x: 760, vista: 'frente', acciones: [{ hace: 'habla', en: en.f5, hasta: en.f5 + 5.5 }, { hace: 'puno', en: en.f5 + .2, hasta: en.f5 + 2.2 }, { hace: 'encoge', en: en.f5 + 3, hasta: en.f5 + 5.4 }] }] },
    { desde: en.b43 - .2, transicion: 'viento', ...jack, viento: .4, camara: [[0, 640, 360, 1]],
      decorado: [...sala, { tipo: 'muralla', x: 640, y: 600, ancho: 1500, filas: 8, en: -99, par: .8 }, { tipo: 'suelo', par: 1, matas: 0 }],
      actores: [{ p: DE, x: 1080, mira: -1, acciones: [{ hace: 'camina', en: en.b43, hasta: en.b43 + 1.6, a: 900 }, { hace: 'senala', en: en.b43 + 1.8, hasta: en.b44 }] }] },
    { desde: en.b44 - .2, transicion: 'viento', ...jack, viento: .4, camara: [[0, 600, 360, 1.25], [en.b45 - .1, 600, 360, 1.25], [en.b45 - .1, 640, 340, 1.3]],
      decorado: [...sala, { tipo: 'muralla', x: 640, y: 600, ancho: 1500, filas: 8, en: -99, tono: .4, par: .5 }, balanza, { tipo: 'suelo', par: 1, matas: 0 }],
      actores: [{ p: DE, x: 1040, mira: -1, acciones: [{ hace: 'piensa', en: en.b44 + .3, hasta: en.b44 + 3 }, { hace: 'senala', en: en.b45 + .5, hasta: en.b45 + 3 }, { hace: 'piensa', en: en['b45.2'] + 1, hasta: en.b46 }] }] },
    { desde: en.b46 - .1, ...jack, viento: .4, camara: [[0, 560, 330, 1.55]], decorado: [...sala, balanza, { tipo: 'suelo', par: 1, matas: 0 }], actores: [] },
    { desde: en.b47 - .2, transicion: 'humo', ...jack, tinte: 'noche', viento: .3, camara: [[0, 760, 340, 1.08]],
      decorado: [{ tipo: 'plano', color: '#1f2a44', par: .3 }, { tipo: 'astro', x: 1080, y: 120, r: 30, luna: true, par: .3 }, { tipo: 'suelo', par: 1, matas: 4 }],
      actores: [{ p: DE, x: 880, mira: -1, acciones: [{ hace: 'asiente', en: en.b47 + 1, hasta: en.b47 + 1.8 }, { hace: 'senala', en: en.b47 + 2, hasta: G.fin }] }] },
  ],
};
