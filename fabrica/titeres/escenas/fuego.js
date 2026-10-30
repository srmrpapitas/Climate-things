// Españistán ep. 3 · secuencia B, «El fuego» (bloques 5–8 del guion de 8 min). Estilo `jack`, 30 fps. Tiempos del audio (tiempos.js).
// Datos: 03-abascal.md, bloque 1 (eldiario.es; Vozpópuli).
//   b5      noche en Amurrio: la casa con el niño en la ventana y la tienda del padre; corte al padre delante de su tienda.
//   b6      pintadas y cristal roto; prende el fuego; primer plano del niño con el fuego delante. b6.2: la mañana, el padre con escolta mira bajo el coche.
//   b7      (viento) años después: el hijo, Acascar, hace lo mismo. Cartel: concejal y diputado, también con escolta.
//   b8      (humo) el Decano con el candil: ¿qué le hace el miedo a una persona?
const G = T.guion([5, 6, 7, 8]), en = G.en;
const AC = PERSONAJES.acascar, DE = PERSONAJES.decano;
const jack = { jack: true, quieto: true, figura: '#3b3431', sombra: 9, contraluz: 0, bordes: ['rgb(255,226,190)', 'rgb(255,120,70)'], borde: .7 };
const padre = ciudadano(40, { ropa: 'traje', pelo: 'entradas', barba: 'bigote', sombrero: null, gafas: null, alto: 1.02, grueso: 1.1, barriga: .3 });
const escolta = ciudadano(41, { ropa: 'traje', pelo: 'corto', barba: null, sombrero: null, gafas: 'cuadradas', alto: 1.12, grueso: 1.15, barriga: 0 });
const noche = [{ tipo: 'plano', color: '#1c2640', raya: 'rgba(0,0,0,.25)', luz: 'rgba(120,150,220,.08)', par: .3 }, { tipo: 'astro', x: 1080, y: 120, r: 34, luna: true, par: .3 }];
const fuegoEn = en.b6 + 3.6;   // «…la tienda acabó quemada»
const pueblo = [...noche, { tipo: 'montes', tono: .15, par: .4, y: 470 },
  { tipo: 'casa', x: 330, par: 1, nino: true }, { tipo: 'tienda', x: 900, par: 1, rota: true, rotulo: 'ROPA' },
  { tipo: 'llamas', x: 880, y: 600, ancho: 330, alto: 300, en: fuegoEn, par: 1 }, { tipo: 'suelo', par: 1, matas: 0 }];
const manana = [{ tipo: 'plano', color: '#c06a28', par: .3 }, { tipo: 'montes', tono: .3, par: .4, y: 480 }, { tipo: 'coche', x: 900, escala: 2.1, par: 1 }, { tipo: 'suelo', par: 1, matas: 0 }];
// mira debajo del coche: se agacha con rodillas y espalda, aguanta y se levanta despacio
const mira = (t) => [{ hace: 'agacha', g: .9, en: t, hasta: t + 2.6, entra: .6, sale: .8 }, { hace: 'inclina', en: t + .2, hasta: t + 2.4, entra: .5, sale: .7 }];
window.ESCENA = {
  dura: G.fin, fps: 30, suelo: 600, voces: G.voces,
  sonidos: [{ en: fuegoEn, archivo: 'audio/sfx/fuego.mp3', volumen: .45 }, { en: en.b6 + 1.2, archivo: 'audio/sfx/cristales.mp3', volumen: .4 }],
  carteles: [
    { en: en.b5 + .5, hasta: en['b5.2'] - .3, x: 40, y: 40, ancho: 470, titulo: 'Amurrio · País Vasco', filas: [['Los años de ETA', '']], fuente: 'eldiario.es · Vozpópuli' },
    { en: fuegoEn + .2, hasta: en['b6.2'] - .3, x: 40, y: 40, ancho: 470, titulo: '1999', filas: [['La tienda del padre', 'quemada']], fuente: 'eldiario.es · Vozpópuli' },
    { en: en['b6.2'] + .4, hasta: en.b7 - .3, x: 640, y: 40, ancho: 610, titulo: 'Años de amenazas de ETA', paso: 1,
      filas: [['El padre vivía', 'con escolta'], ['Los amenazados miraban bajo el coche', 'por si había una bomba lapa']], fuente: 'eldiario.es · Vozpópuli' },
    { en: en.b7 + .5, hasta: en.b8 - .3, x: 620, y: 40, ancho: 640, titulo: 'El hijo, en el PP', paso: 1.6,
      filas: [['Concejal en Llodio', 'con escolta'], ['Diputado en el Parlamento Vasco', 'con escolta']], fuente: 'Parlamento Vasco' },
    { en: en.b8 + .5, hasta: G.fin - .2, x: 40, y: 40, ancho: 520, titulo: 'Pregunta del Decano', paso: 2.4,
      filas: [['¿Qué le hace el miedo a una persona?', ''], ['¿Y qué hace esa persona con él?', '']], fuente: 'Españistán' }],
  planos: [
    { desde: 0, ...jack, viento: .3, franjas: true, decorado: pueblo, actores: [], camara: [[0, 640, 360, 1.02], [en['b5.2'] - .1, 640, 380, 1.1]] },
    { desde: en['b5.2'] - .1, ...jack, viento: .3, decorado: pueblo, camara: [[0, 820, 380, 1.5]],
      actores: [{ p: padre, x: 700, mira: 1, acciones: [{ hace: 'senala', en: en['b5.2'] + .5, hasta: en['b5.2'] + 2.4 }, { hace: 'asiente', en: en['b5.2'] + 2.6, hasta: en['b5.2'] + 3.2 }] }] },
    { desde: en.b6, ...jack, viento: .3, decorado: pueblo, actores: [], camara: [[0, 860, 400, 1.6], [fuegoEn - .1, 860, 400, 1.6], [fuegoEn - .1, 640, 380, 1.02]] },
    { desde: fuegoEn + 2, ...jack, viento: .3, decorado: pueblo, actores: [], camara: [[0, 340, 450, 3.2], [en['b6.2'], 340, 445, 3.4]] },
    { desde: en['b6.2'] - .1, transicion: 'humo', ...jack, viento: .3, decorado: manana, camara: [[0, 640, 400, 1.3]],
      actores: [
        { p: escolta, x: 300, mira: 1, acciones: [{ hace: 'gira', en: en['b6.2'] + 1.2 }, { hace: 'gira', en: en['b6.2'] + 3.2 }] },
        { p: padre, x: 520, mira: 1, acciones: [{ hace: 'camina', en: en['b6.2'], hasta: en['b6.2'] + .9, a: 545 }, ...mira(en['b6.2'] + 1)] }] },
    { desde: en.b7 - .2, transicion: 'viento', ...jack, viento: .4, decorado: manana, camara: [[0, 640, 400, 1.3], [en.b7 + 2.2, 640, 400, 1.3], [en.b7 + 2.2, 640, 470, 1.9], [en.b7 + 3.7, 640, 470, 1.9], [en.b7 + 3.7, 640, 400, 1.3]],
      actores: [
        { p: escolta, x: 300, mira: 1, acciones: [{ hace: 'gira', en: en.b7 + 1.4 }, { hace: 'gira', en: en.b7 + 4 }] },
        { p: AC, x: 520, mira: 1, acciones: [{ hace: 'camina', en: en.b7, hasta: en.b7 + .9, a: 545 }, ...mira(en.b7 + 1.2)] }] },
    { desde: en.b8 - .2, transicion: 'humo', ...jack, tinte: 'noche', viento: .3, decorado: [...noche, { tipo: 'suelo', par: 1, matas: 4 }],
      actores: [{ p: DE, x: 860, mira: -1, acciones: [{ hace: 'piensa', en: en.b8 + .2, hasta: en.b8 + 3.2 }, { hace: 'senala', en: en.b8 + 3.6, hasta: G.fin }] }],
      camara: [[0, 760, 340, 1.08], [G.fin, 760, 330, 1.15]] },
  ],
};
