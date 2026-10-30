// Españistán ep. 5 · secuencia I, «La balanza» (bloques 49–50). Estilo `jack`, 30 fps. Tiempos: tiempos-05.js (estimados hasta que exista la voz).
// Como la del ep. 4, pero sin la noria: al fondo, la obra al amanecer con una grúa parada. Nunca dice a quién votar.
//   b49     (viento) la balanza ante la obra; lo bueno cae en un plato cuando se nombra. b49.2 lo otro, en el otro plato.
//   b49.3   «lo decides tú»: plano corto de la balanza, que no se decide.
//   b50     (viento) el cuarto de Lucía y Dani al amanecer; deja de llover. «votes» → se miran; «la resta» → por la ventana la grúa arranca
//           y la llave brilla en el cristal.
const G = T.guion([49, 50]), en = G.en;
const LU = PERSONAJES.lucia, DA = PERSONAJES.dani;
const jack = { jack: true, quieto: true, figura: '#2b2522', sombra: 9, contraluz: 0, bordes: ['rgb(255,226,190)', 'rgb(255,120,70)'], borde: .7 };
// palabras clave (a ojo, a 14 letras/s; G.x las pasa al segundo real)
const IZQ = [G.x('b49', 3.6), G.x('b49', 5.6), G.x('b49', 8)];
const DER = [G.x('b49.2', 4.4), G.x('b49.2', 5.2), G.x('b49.2', 6.2), G.x('b49.2', 9.8)];
const DECIDES = G.x('b49.3', 1.6), VOTES = G.x('b50', 3.6), RESTA = G.x('b50', 7.9);
const alba = [{ tipo: 'plano', color: '#d98a3c', raya: 'rgba(120,50,10,.2)', luz: 'rgba(255,230,170,.18)', par: .2 }, { tipo: 'astro', x: 640, y: 420, r: 110, par: .2 }];
const balanza = { tipo: 'balanza', x: 640, y: 640, escala: 1, par: 1,
  izq: ['Un país que sabe construir', 'Solares que ya son públicos', 'Ciudades que enseñan cómo'], izqEn: IZQ,
  der: ['Treinta años turnándose la grúa', 'El rescate', 'El megáfono', '750.000 casas que faltan'], derEn: DER };
window.ESCENA = {
  dura: G.fin + 1.5, fps: 30, suelo: 600, voces: G.voces,
  silencios: [[DECIDES - .7, DECIDES]],
  sonidos: [{ en: 0, hasta: en.b50, archivo: 'audio/sfx/viento.mp3', volumen: .12, bucle: true }, { en: 0, archivo: 'audio/sfx/viento.mp3', volumen: .25 },
    ...[...IZQ, ...DER].map(t => ({ en: t, archivo: 'audio/sfx/impacto.mp3', volumen: .18 })),
    { en: en.b50 - .2, archivo: 'audio/sfx/viento.mp3', volumen: .3 }, { en: en.b50, hasta: VOTES, archivo: 'audio/sfx/lluvia.mp3', volumen: .12 },
    { en: RESTA, archivo: 'audio/sfx/riser.mp3', volumen: .2 }, { en: RESTA + .8, archivo: 'audio/sfx/campana.mp3', volumen: .3 }],
  carteles: [
    { en: DECIDES - .2, hasta: en.b50 - .2, x: 340, y: 40, ancho: 600, titulo: 'Cuál pesa más', filas: [['lo decides tú', '']], fuente: 'Españistán no te dice a quién votar' },
  ],
  planos: [
    // b49: la balanza ante la obra parada al amanecer
    { desde: 0, ...jack, viento: .3, decorado: [...alba, { tipo: 'ciudad', tono: .35, par: .3, y: 560, s: 5 },
        { tipo: 'grua', x: 1090, alto: 440, escala: .9, tono: .3, par: .4 }, { tipo: 'grua', x: 170, alto: 360, escala: .7, tono: .4, par: .35 }, balanza, { tipo: 'suelo', par: 1, matas: 0 }],
      camara: [[0, 640, 380, 1.05], [en['b49.2'], 640, 380, 1.05], [en['b49.3'] - .1, 640, 380, 1.05], [DECIDES, 640, 360, 1.3], [en.b50, 640, 355, 1.34]] },
    // b50: el cuarto al amanecer; por la ventana, la grúa arranca
    { desde: en.b50 - .2, transicion: 'viento', ...jack, viento: .1, bordes: ['rgb(150,180,255)', 'rgb(255,170,100)'], borde: .8,
      decorado: [{ tipo: 'cuarto', lluvia: 0, amanece: true, grua: RESTA, par: 1 }, { tipo: 'litera', x: 250, par: 1 }],
      delante: [{ tipo: 'llave', x: 1000, y: 230, en: RESTA + .6, escala: .55 }],
      actores: [
        { p: LU, x: 560, mira: 1, acciones: [{ hace: 'senala', en: RESTA + .5, hasta: G.fin + 1.5 }] },
        { p: DA, x: 760, mira: -1, acciones: [{ hace: 'asiente', en: VOTES + .2, hasta: VOTES + 1.4 }, { hace: 'gira', en: RESTA }] }],
      camara: [[en.b50, 640, 360, 1], [VOTES, 660, 370, 1.08], [RESTA, 820, 320, 1.2], [G.fin + 1.5, 950, 270, 1.7]] },
  ],
};
