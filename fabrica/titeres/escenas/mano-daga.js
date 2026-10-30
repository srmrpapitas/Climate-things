// Españistán ep. 3 · secuencia G, «La mano y la daga» (bloques 26–27). Estilo `jack`, 30 fps. Tiempos del audio (tiempos.js).
// La daga es la metáfora de romper un pacto (lleva escrito RUPTURA) y la esconden los dos. Datos: 03-abascal.md, bloque 5 (BOE autonómicos; prensa).
//   b26     2023: Feijolo y Acascar se dan la mano ante cinco tronos; primer plano de las manos; plano bajo: las dos dagas a la espalda.
//   b26.2   (tajo, rojo) julio de 2024: Feijolo va hacia los tronos; Acascar se acerca por detrás y se la clava. Se marcha. La daga en la espalda.
//   b27     (papeletas) 2026: vuelven a darse la mano, Feijolo con una tirita, y otra vez las dagas detrás. Tres tronos.
const G = T.guion([26, 27]), en = G.en;
const AC = PERSONAJES.acascar, FE = PERSONAJES.feijolo;
const jack = { jack: true, quieto: true, figura: '#3b3431', sombra: 9, contraluz: 0, bordes: ['rgb(255,226,190)', 'rgb(255,120,70)'], borde: .7 };
const fondoDe = (color, n) => [{ tipo: 'plano', color, par: .3 },
  ...Array.from({ length: n }, (_, i) => ({ tipo: 'trono', x: 640 + (i - (n - 1) / 2) * 150, y: 470, escala: .75, tono: .35, par: .8 })),
  { tipo: 'suelo', par: 1, matas: 0 }];
const pacto = fondoDe('#c06a28', 5), rojo = [{ tipo: 'plano', color: '#b11d18', par: .3 }, ...fondoDe('#b11d18', 5).slice(1)], vuelta = fondoDe('#c06a28', 3);
// el apretón: los dos con la daga escondida (mano de atrás) y la mano de delante estirada
const saludo = (desde, hasta, extra = []) => [
  { p: FE, x: 492, mira: 1, acciones: [{ hace: 'coge', que: 'daga', mano: 'lejos', en: 0 }, { hace: 'esconde', en: 0, hasta: 999, entra: .01 }, { hace: 'mano', en: desde, hasta, h: .1 }, ...extra] },
  { p: AC, x: 788, mira: -1, acciones: [{ hace: 'coge', que: 'daga', mano: 'lejos', en: 0 }, { hace: 'esconde', en: 0, hasta: 999, entra: .01 }, { hace: 'mano', en: desde, hasta, h: -.1 }] }];
const S = en['b26.2'] - .4, R = en.b27 - .2;   // S: empieza la puñalada (julio de 2024); R: la vuelta (2026)
window.ESCENA = {
  dura: G.fin, fps: 30, suelo: 600, voces: G.voces,
  sonidos: [{ en: S + 1.95, archivo: 'audio/sfx/impacto.mp3', volumen: .28 }],
  carteles: [
    { en: en.b26 + .3, hasta: S - .2, x: 40, y: 40, ancho: 470, titulo: '2023', filas: [['Gobiernos PP + Vox', '5']], fuente: 'BOE de cada comunidad' },
    { en: S + .2, hasta: R - .2, x: 40, y: 40, ancho: 520, titulo: 'Julio de 2024', filas: [['Vox sale de los gobiernos', '5 de 5']], fuente: 'prensa, julio de 2024 (reparto de menores migrantes)' },
    { en: R + .3, hasta: G.fin - .2, x: 40, y: 40, ancho: 600, titulo: '2026', paso: 1.4, filas: [['Vuelven a gobernar juntos', '3'], ['Extremadura, Aragón', 'y Castilla y León']], fuente: 'acuerdos PP-Vox, 2026' }],
  planos: [
    { desde: 0, ...jack, viento: .5, decorado: pacto, actores: saludo(.9, S - .6), camara: [[0, 640, 320, 1.15]] },
    { desde: 3.2, ...jack, viento: .5, decorado: pacto, actores: saludo(.9, S - .6), camara: [[0, 640, 330, 3.4]] },
    { desde: 4.6, ...jack, viento: .5, decorado: pacto, actores: saludo(.9, S - .6), camara: [[0, 640, 470, 2.1]] },
    { desde: S, transicion: 'tajo', ...jack, viento: .9, decorado: rojo, camara: [[0, 600, 400, 1.3]],
      actores: [
        { p: FE, x: 560, mira: 1, acciones: [{ hace: 'camina', en: S + .2, hasta: S + 1.7, a: 680 }, { hace: 'clavada', en: S + 2 }, { hace: 'recibe', en: S + 2, hasta: R, sale: .6 }] },
        { p: AC, x: 300, mira: 1, acciones: [{ hace: 'coge', que: 'daga', mano: 'cerca', en: 0 }, { hace: 'camina', en: S + .3, hasta: S + 1.6, a: 495 },
          { hace: 'apunala', en: S + 1.95, hasta: S + 3 }, { hace: 'suelta', mano: 'cerca', en: S + 2.1 }, { hace: 'gira', en: S + 3.1 }, { hace: 'camina', en: S + 3.3, hasta: S + 4.4, a: 120 }] }] },
    { desde: S + 4.4, ...jack, viento: .9, decorado: rojo, camara: [[0, 640, 330, 3]],
      actores: [{ p: FE, x: 680, mira: 1, acciones: [{ hace: 'clavada', en: 0 }, { hace: 'recibe', en: S + 3.6, hasta: R + .2, sale: .6 }] }] },
    { desde: R, transicion: 'papeles', ...jack, viento: .5, decorado: vuelta, actores: saludo(R + .8, G.fin - .3, [{ hace: 'tirita', en: 0 }]), camara: [[0, 640, 300, 1.1]] },
  ],
};
