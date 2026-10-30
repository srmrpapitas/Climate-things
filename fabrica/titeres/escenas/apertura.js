// Españistán ep. 3 · secuencia A, «Apertura» (bloques 1–4 del guion de 8 min). Estilo `jack`, 30 fps. Los tiempos salen del audio (tiempos.js).
//   b1      noche, el Congreso en silueta (franjas); pantalla partida: Sanchís a un lado, Feijolo al otro, cada uno con su trono: se turnan.
//   b1.2    «romper ese turno»: tajo que parte la imagen; cielo rojo, Acascar con la bandera al viento, en contrapicado.
//   b2      (viento, noche) el Decano entra con el candil y alza la lupa. Montaigne en pergamino.
//   b3      (viento, amanecer) Acascar en lo alto de la roca; corte a su primer plano de frente. Cartel: 0 diputados → ≈ 19 %.
//   b4      (humo) el Decano, sepia, piensa y alza la lupa: las reglas de siempre.
const G = T.guion([1, 2, 3, 4]), en = G.en;
const AC = PERSONAJES.acascar, DE = PERSONAJES.decano, SA = PERSONAJES.sanchis, FE = PERSONAJES.feijolo;
const jack = { jack: true, quieto: true, figura: '#3b3431', sombra: 9, contraluz: 0, bordes: ['rgb(255,226,190)', 'rgb(255,120,70)'], borde: .7 };
const nocheAzul = [{ tipo: 'plano', color: '#1f2a44', raya: 'rgba(0,0,0,.25)', luz: 'rgba(120,150,220,.07)', par: .3 }, { tipo: 'astro', x: 1060, y: 120, r: 30, luna: true, par: .3 }];
const congreso = [...nocheAzul, { tipo: 'ciudad', tono: .15, par: .45, y: 560 }, { tipo: 'congreso', x: 640, escala: 1.1, par: .8 }, { tipo: 'suelo', par: 1, matas: 0 }];
const rojo = [{ tipo: 'plano', color: '#b11d18', par: .3 }, { tipo: 'disco', x: 900, y: 300, r: 170, color: '#d8452a', par: .3 }];
const alba = [{ tipo: 'plano', color: '#c8611f', raya: 'rgba(90,20,6,.25)', luz: 'rgba(255,170,80,.12)', par: .3 }, { tipo: 'disco', x: 980, y: 380, r: 150, color: '#eba13c', par: .3 },
  { tipo: 'montes', tono: .25, par: .45, y: 520 }];
const turno = (p, color, mira) => ({ decorado: [{ tipo: 'plano', color, par: .3 }, { tipo: 'trono', x: 640 - 120 * mira, escala: 1.6, par: 1 }, { tipo: 'suelo', par: 1, matas: 0 }],
  actores: [{ p, x: 640 + 60 * mira, mira: -mira, acciones: [{ hace: 'saluda', en: 0, hasta: 0 }] }] });
const izq = turno(SA, '#7d3b2c', -1), der = turno(FE, '#2f4a5c', 1);
izq.actores[0].acciones = [{ hace: 'saluda', en: en.b1 + 1, hasta: en.b1 + 2.6 }, { hace: 'encoge', en: en['b1.2'] - 1.2, hasta: en['b1.2'] }];
der.actores[0].acciones = [{ hace: 'saluda', en: en.b1 + 2.4, hasta: en.b1 + 4 }, { hace: 'puno', en: en['b1.2'] - 1.2, hasta: en['b1.2'] }];
const decanoNoche = { p: DE, x: 1180, mira: -1, acciones: [{ hace: 'camina', en: en.b2, hasta: en.b2 + 2.6, a: 820 }, { hace: 'senala', en: en.b2 + 3, hasta: en.b3 - .6 }] };
window.ESCENA = {
  dura: G.fin, fps: 30, suelo: 600, voces: G.voces,
  sonidos: [{ en: en['b1.2'] - .45, archivo: 'audio/sfx/whoosh.mp3', volumen: .7 }, { en: en['b1.2'] - .2, archivo: 'audio/sfx/impacto.mp3', volumen: .20 }],
  carteles: [
    { en: en.b2 + .6, hasta: en.b3 - .5, x: 40, y: 40, ancho: 500, titulo: 'Montaigne', paso: 1.4,
      filas: [['«Nada se cree con tanta fuerza', ''], ['como lo que menos se conoce»', '']], fuente: 'Michel de Montaigne, Ensayos' },
    { en: en['b3.2'] + .2, hasta: en.b4 - .4, x: 40, y: 40, ancho: 560, titulo: 'Vox', paso: (en.b4 - en['b3.2']) / 3,
      filas: [['2014', 'ningún diputado'], ['Encuestas, octubre de 2026', '≈ 19 %', '#7a1410']], fuente: 'Sigma Dos y GAD3 (12-10-2026)' },
    { en: en.b4 + .6, hasta: G.fin - .3, x: 40, y: 40, ancho: 560, titulo: 'Las reglas de siempre', paso: 1.2,
      filas: [['Datos públicos', 'con su fuente'], ['Lo bueno', 'también se cuenta', '#2c4a1a']], fuente: 'Españistán' }],
  titulos: [{ en: .3, hasta: en.b1 + .4, texto: 'ESPAÑISTÁN', sub: 'Episodio 3 · El jinete y la daga', y: 250 }],
  planos: [
    { desde: 0, ...jack, viento: .3, franjas: true, decorado: congreso, actores: [], camara: [[0, 640, 360, 1], [en.b1 + .6, 640, 380, 1.12]] },
    { desde: en.b1 + .6, ...jack, viento: .3, franjas: true, decorado: congreso, actores: [], camara: [[0, 640, 380, 1.12]], paneles: [
      { en: en.b1 + .65, rect: [0, 88, 636, 544], entra: 'izq', camara: [[0, 640, 330, .95]], ...izq },
      { en: en.b1 + 2.2, rect: [644, 88, 636, 544], entra: 'der', camara: [[0, 640, 330, .95]], ...der }] },
    { desde: en['b1.2'] - .1, transicion: 'tajo', ...jack, viento: 1, franjas: true, decorado: [...rojo, { tipo: 'roca', x: 640, y: 640, escala: 1.5, par: 1 }],
      actores: [{ p: Object.assign({}, AC, { objeto: 'bandera' }), x: 610, y: -97, mira: 1, acciones: [{ hace: 'brazos', h: 2.75, c: .1, en: 0, hasta: 999, entra: .01 }] }],
      camara: [[0, 640, 268, .92], [en.b2, 632, 262, .97]] },
    { desde: en.b2 - .2, transicion: 'viento', ...jack, tinte: 'noche', viento: .4, decorado: [...nocheAzul, { tipo: 'suelo', par: 1, matas: 4 }],
      actores: [decanoNoche], camara: [[0, 700, 340, 1.05], [en.b3, 700, 330, 1.12]] },
    { desde: en.b3 - .2, transicion: 'viento', ...jack, viento: .8, decorado: [...alba, { tipo: 'roca', x: 560, y: 640, escala: 1.5, par: 1 }, { tipo: 'suelo', par: 1, matas: 0 }],
      actores: [{ p: Object.assign({}, AC, { objeto: 'bandera' }), x: 525, y: -97, mira: 1, acciones: [{ hace: 'brazos', h: 2.75, c: .1, en: 0, hasta: 999, entra: .01 }] }],
      camara: [[0, 600, 300, .9], [en['b3.2'] - .1, 590, 290, .97]] },
    { desde: en['b3.2'] - .1, ...jack, viento: .6, decorado: [...alba, { tipo: 'suelo', par: 1, matas: 0 }],
      actores: [{ p: AC, x: 760, vista: 'frente', acciones: [{ hace: 'asiente', en: en['b3.2'] + 1.5, hasta: en['b3.2'] + 2.2 }] }],
      camara: [[0, 690, 300, 1.9], [en.b4, 690, 295, 2.1]] },
    { desde: en.b4 - .2, transicion: 'humo', ...jack, tinte: 'sepia', viento: .1, decorado: [{ tipo: 'plano', color: '#6b4426', par: .3 }, { tipo: 'astro', x: 700, y: 260, r: 70, par: .3 }, { tipo: 'suelo', par: 1, matas: 0 }],
      actores: [{ p: DE, x: 980, mira: -1, acciones: [{ hace: 'piensa', en: en.b4, hasta: en.b4 + 1.8 }, { hace: 'senala', en: en.b4 + 2.1, hasta: G.fin }] }],
      camara: [[0, 820, 330, 1.05]] },
  ],
};
