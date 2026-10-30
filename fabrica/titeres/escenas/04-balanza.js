// Españistán ep. 4 · secuencia J, «La balanza» (bloques 37–41). Estilo `jack`, 30 fps. Tiempos: tiempos-04.js (G.x pasa las palabras clave a segundos reales).
// Datos: 04-bipartidismo.md. Popper: «La sociedad abierta y sus enemigos» (1945) y su artículo «On democracy» (The Economist, 1988).
//   b37     (viento) la feria al amanecer, vacía, con la noria parada; delante, la balanza: lo bueno cae en un plato cuando se nombra.
//   b38     lo otro cae en el otro plato. b39 «lo decides tú»: plano corto de la balanza, que no se decide.
//   b40     (viento) Popper: la noria parada contra el sol y la cuerda con sus tres nudos, colgando y moviéndose con el viento.
//   b41     una mano echa la papeleta en la urna, sin grillete; «pensando» → la urna se enciende.
const G = T.guion([37, 38, 39, 40, 41]), en = G.en;
const jack = { jack: true, quieto: true, figura: '#2b2522', sombra: 9, contraluz: 0, bordes: ['rgb(255,226,190)', 'rgb(255,120,70)'], borde: .7 };
// palabras clave (a ojo, a 14 letras/s; G.x las pasa al segundo real)
const IZQ = [G.x('b37', 3.7), G.x('b37', 5.2), G.x('b37.2', 4.1), G.x('b37.2', 5.8)];
const DER = [G.x('b38', 4.5), G.x('b38', 6.2), G.x('b38.2', 2), G.x('b38.2', 4), G.x('b38.2', 5.6)];
const DECIDES = G.x('b39', 1.6), VOTES = G.x('b41', 3), PENSANDO = G.x('b41', 5.2);
const alba = [{ tipo: 'plano', color: '#d98a3c', raya: 'rgba(120,50,10,.2)', luz: 'rgba(255,230,170,.18)', par: .2 }, { tipo: 'astro', x: 640, y: 420, r: 110, par: .2 }];
const noria = { tipo: 'noria', x: 1080, y: 600, r: 200, vel: 0, luces: 0, tono: .5, par: .4 };
const balanza = { tipo: 'balanza', x: 640, y: 640, escala: 1, par: 1,
  izq: ['Democracia que llegó sin guerra', 'Cuarenta años de gobiernos estables', 'El pacto de las pensiones', 'La entrada en Europa'], izqEn: IZQ,
  der: ['Reglas de 1977, casi intactas', 'Listas que no puedes abrir', 'Multa por votar lo que piensas', 'Jueces repartidos', 'La puerta giratoria'], derEn: DER };
window.ESCENA = {
  dura: G.fin + 1, fps: 30, suelo: 600, voces: G.voces,
  silencios: [[DECIDES - .7, DECIDES]],
  sonidos: [{ en: 0, hasta: G.fin + 1, archivo: 'audio/sfx/viento.mp3', volumen: .12, bucle: true }, { en: 0, archivo: 'audio/sfx/viento.mp3', volumen: .25 },
    ...[...IZQ, ...DER].map(t => ({ en: t, archivo: 'audio/sfx/impacto.mp3', volumen: .07 })),
    { en: en.b40 - .2, archivo: 'audio/sfx/viento.mp3', volumen: .3 }, { en: VOTES + .3, archivo: 'audio/sfx/whoosh.mp3', volumen: .2 }, { en: PENSANDO, archivo: 'audio/sfx/campana.mp3', volumen: .3 }],
  carteles: [
    { en: DECIDES - .2, hasta: en.b40 - .2, x: 340, y: 40, ancho: 600, titulo: 'Cuál pesa más', filas: [['lo decides tú', '']], fuente: 'Españistán no te dice a quién votar' },
    { en: en.b40 + .4, hasta: en.b41 - .2, x: 40, y: 40, ancho: 660, titulo: 'Idea de Karl Popper', filas: [['Lo importante no es quién manda', ''], ['sino poder echarlo sin sangre', '']], fuente: 'La sociedad abierta y sus enemigos (1945); «On democracy» (1988)' },
  ],
  planos: [
    // b37–b39: la balanza ante la feria vacía
    { desde: 0, ...jack, viento: .3, decorado: [...alba, { tipo: 'ciudad', tono: .35, par: .3, y: 560, s: 4 }, noria, balanza, { tipo: 'suelo', par: 1, matas: 0 }],
      camara: [[0, 640, 380, 1.05], [en.b38, 640, 380, 1.05], [en.b39 - .1, 640, 380, 1.05], [DECIDES, 640, 360, 1.3], [en.b40, 640, 355, 1.34]] },
    // b40: Popper, la noria parada y la cuerda de los tres nudos
    { desde: en.b40 - .2, transicion: 'viento', ...jack, viento: .5, decorado: [...alba, { tipo: 'noria', x: 640, y: 660, r: 320, vel: 0, luces: 0, par: .8 },
        { tipo: 'cuerda', x0: -60, y0: 140, x1: 1340, y1: 120, comba: 160, grosor: 11, nudos: [{ u: .3, en: -9 }, { u: .5, en: -9 }, { u: .7, en: -9 }], par: 1 }, { tipo: 'suelo', par: 1, matas: 0 }],
      camara: [[0, 640, 360, 1], [en.b41, 640, 340, 1.08]] },
    // b41: el voto, esta vez sin grillete
    { desde: en.b41 - .1, ...jack, viento: .2, decorado: [...alba, { tipo: 'voto', x: 640, y: 600, echa: VOTES, par: 1 }, { tipo: 'suelo', par: 1, matas: 0 },
        { tipo: 'astro', x: 640, y: 420, r: 60, desde: PENSANDO, par: 1 }],
      camara: [[0, 640, 380, 1.1], [PENSANDO, 640, 400, 1.2], [G.fin + 1, 640, 410, 1.25]] },
  ],
};
