// Españistán ep. 3 · secuencia C, «La mano de la Condesa» (bloques 9–12 y la frase f1). Estilo `jack`, 30 fps. Tiempos del audio (tiempos.js).
// Datos: 03-abascal.md, bloques 2 y 3 (Maldita.es; transparencia de la Comunidad de Madrid; Registro de partidos).
//   b9      Madrid, 2010: la Condesa le da la mano. b9.2: el letrero AGENCIA se apaga y se enciende FUNDACIÓN.
//   b10     baja una nómina gigante; él la recoge con las dos manos. Cartel: 82.491 € frente a 78.185 €.
//   b11     (tinta) 17 de diciembre de 2013: se apaga FUNDACIÓN y, en el mismo segundo, se enciende VOX.
//   b12, f1 primer plano de frente: «A mí nadie me ha regalado nada…»; contraplano final: la nómina enorme y él debajo.
const G = T.guion([9, 10, 11, 12, 'f1']), en = G.en;
const AC = PERSONAJES.acascar, CO = PERSONAJES.condesa;
const jack = { jack: true, quieto: true, figura: '#3b3431', sombra: 9, contraluz: 0, bordes: ['rgb(255,226,190)', 'rgb(255,120,70)'], borde: .7 };
const madrid = (extra = []) => [{ tipo: 'plano', color: '#c98a2e', par: .3 }, { tipo: 'ciudad', tono: .25, par: .45, y: 545 }, ...extra, { tipo: 'suelo', par: 1, matas: 0 }];
const nomina = (desde) => ({ tipo: 'nomina', x: 760, y: 300, en: desde, escala: 1.1, par: 1 });
const cambio = en['b9.2'] + 1;   // «cuando la agencia se cerró»
const vox = en['b11.3'] + .6;    // «se registró un partido nuevo: Vox»
const cieloVox = [{ tipo: 'plano', color: '#2a2230', raya: 'rgba(0,0,0,.25)', luz: 'rgba(255,200,140,.06)', par: .3 }];
window.ESCENA = {
  dura: G.fin, fps: 30, suelo: 600, voces: G.voces,
  sonidos: [{ en: vox, archivo: 'audio/sfx/impacto.mp3', volumen: .4 }],
  carteles: [
    { en: en.b9 + .4, hasta: en['b9.2'] - .3, x: 40, y: 40, ancho: 520, titulo: 'Madrid · 2010', filas: [['Esperanza Aguirre lo nombra', 'director']], fuente: 'Comunidad de Madrid' },
    { en: en.b10 + .3, hasta: en.b11 - .3, x: 40, y: 40, ancho: 560, titulo: 'Sueldo al año (2011–2013)', paso: 1.6,
      filas: [['Acascar', '82.491 € + plus'], ['Presidente del Gobierno', '78.185 €', '#2c4a1a']], fuente: 'Comunidad de Madrid (transparencia) · Maldita.es' },
    { en: en.b11 + .4, hasta: en.b12 - .3, x: 40, y: 40, ancho: 660, titulo: '17 de diciembre de 2013', paso: en['b11.3'] - en.b11 - .2,
      filas: [['Se disuelve la fundación', 'sin dinero público'], ['Se registra un partido', 'Vox', '#7a1410']], fuente: 'Maldita.es · Registro de partidos' }],
  planos: [
    { desde: 0, ...jack, viento: .3, camara: [[0, 640, 390, 1.12]],
      decorado: madrid([{ tipo: 'letrero', x: 820, y: 170, ancho: 320, texto: 'AGENCIA', apaga: cambio, hasta: cambio + .6, par: .8 }, { tipo: 'letrero', x: 820, y: 170, ancho: 320, texto: 'FUNDACIÓN', desde: cambio + .6, enciende: cambio + .6, par: .8 }]),
      actores: [
        { p: CO, x: 500, mira: 1, acciones: [{ hace: 'mano', en: en.b9 + .8, hasta: en.b9 + 3.8, h: .1 }, { hace: 'asiente', en: en.b9 + 2, hasta: en.b9 + 3 }] },
        { p: AC, x: 780, mira: -1, acciones: [{ hace: 'mano', en: en.b9 + .8, hasta: en.b9 + 3.8, h: -.1 }, { hace: 'gira', en: cambio - .4 }, { hace: 'gira', en: cambio + 1.4 }] }] },
    { desde: en.b10 - .2, ...jack, viento: .3, decorado: madrid([nomina(en.b10)]), camara: [[0, 640, 380, 1.05]],
      actores: [
        { p: CO, x: 380, mira: 1, acciones: [{ hace: 'senala', en: en.b10 + .2, hasta: en.b10 + 2 }] },
        { p: AC, x: 760, mira: -1, acciones: [{ hace: 'gira', en: en.b10 + .4 }, { hace: 'brazos', h: 2.3, c: .5, h2: 2.2, c2: .5, en: en.b10 + 1, hasta: en.b11, mano: 'abierta' }] }] },
    { desde: en.b11 - .2, transicion: 'tinta', ...jack, viento: .2, actores: [], camara: [[0, 640, 330, 1.2], [vox, 640, 330, 1.2], [vox, 880, 300, 1.7]],
      decorado: [...cieloVox, { tipo: 'letrero', x: 420, y: 300, texto: 'FUNDACIÓN', apaga: vox - .05, par: 1 }, { tipo: 'letrero', x: 880, y: 300, ancho: 260, texto: 'VOX', tam: 52, enciende: vox, par: 1 }, { tipo: 'suelo', par: 1, matas: 0 }] },
    { desde: en.b12 - .2, transicion: 'viento', ...jack, viento: .3, decorado: madrid(), camara: [[0, 640, 300, 2], [G.fin, 640, 296, 2.15]],
      actores: [{ p: AC, x: 640, vista: 'frente', acciones: [{ hace: 'habla', en: en.f1, hasta: en.f1 + 6.6 }, { hace: 'encoge', en: en.f1 + 3.2, hasta: en.f1 + 5.4 }] }] },
    { desde: en.f1 + 6.9, ...jack, viento: .3, decorado: madrid([nomina(-9)]), camara: [[0, 700, 360, 1.15]],
      actores: [{ p: AC, x: 760, mira: -1, acciones: [{ hace: 'brazos', h: 2.3, c: .5, h2: 2.2, c2: .5, en: 0, hasta: 999, mano: 'abierta', entra: .01 }] }] },
  ],
};
