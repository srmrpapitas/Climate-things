// Españistán · intro de la serie (9,5 s, 30 fps). Va tras el gancho de cada capítulo; solo cambia EPISODIO.
// Voz: Gabo, «En un país partido en dos, un hombre busca la verdad con una espada. Esto es Españistán.» (audio/voz/es/espanistan-intro/intro.mp3)
//   0–2,3    «un país partido en dos»: pantalla partida, Sanchís en rojo y Feijolo en azul, cada uno de espaldas al otro.
//   2,3–4    (viento) «un hombre busca la verdad»: el Elegido cruza el llano al atardecer, en silueta.
//   4–5,3    «con una espada»: corte a plano corto; se para y alza la espada.
//   5,3–9,5  (tajo, rojo) «Esto es Españistán»: título y episodio.
const EPISODIO = 'Episodio 5 · La casa de los dos';
const E = PERSONAJES.elegido, SA = PERSONAJES.sanchis, FE = PERSONAJES.feijolo;
const jack = { jack: true, quieto: true, figura: '#3b3431', sombra: 9, contraluz: 0, bordes: ['rgb(255,226,190)', 'rgb(255,120,70)'], borde: .7 };
const mitad = (p, color, mira) => ({ decorado: [{ tipo: 'plano', color, par: .3 }, { tipo: 'suelo', par: 1, matas: 0 }],
  actores: [{ p, x: 640, mira, acciones: [{ hace: 'encoge', en: 1, hasta: 2.3 }] }] });
const llano = [
  { tipo: 'plano', color: '#c8611f', raya: 'rgba(90,20,6,.25)', luz: 'rgba(255,170,80,.12)', par: .3 },
  { tipo: 'disco', x: 900, y: 360, r: 170, color: '#eba13c', par: .3 },
  { tipo: 'montes', tono: .25, par: .45, y: 520 }, { tipo: 'suelo', par: 1, matas: 6 }];
const rojo = [{ tipo: 'plano', color: '#b11d18', par: .3 }, { tipo: 'disco', x: 640, y: 400, r: 190, color: '#d8452a', par: .3 }, { tipo: 'suelo', par: 1, matas: 0 }];
const heroe = { p: E, x: -140, mira: 1, acciones: [{ hace: 'camina', en: 2.3, hasta: 4, a: 520 }, { hace: 'puno', en: 4.2, hasta: 5.4 }] };
window.ESCENA = {
  dura: 9.5, fps: 30, suelo: 600,
  voces: [{ en: .4, dura: 7.04, quien: 'narrador', texto: '', sinSub: true, archivo: 'audio/voz/es/espanistan-intro/intro.mp3' }],
  sonidos: [{ en: 2.2, archivo: 'audio/sfx/whoosh.mp3', volumen: .4 }, { en: 2.3, archivo: 'audio/sfx/riser.mp3', volumen: .25 },
    { en: 5.1, archivo: 'audio/sfx/whoosh.mp3', volumen: .7 }, { en: 5.35, archivo: 'audio/sfx/impacto.mp3', volumen: .24 }],
  titulos: [{ en: 5.6, hasta: 9.5, texto: 'ESPAÑISTÁN', sub: EPISODIO, y: 175 }],
  planos: [
    { desde: 0, ...jack, viento: .4, franjas: true, decorado: [{ tipo: 'plano', color: '#14141c', par: .3 }], actores: [], camara: [[0, 640, 360, 1]], paneles: [
      { en: .2, rect: [0, 88, 636, 544], entra: 'izq', camara: [[0, 640, 360, 1], [2.3, 640, 350, 1.08]], ...mitad(SA, '#7d3b2c', 1) },
      { en: .6, rect: [644, 88, 636, 544], entra: 'der', camara: [[0, 640, 360, 1], [2.3, 640, 350, 1.08]], ...mitad(FE, '#2f4a5c', -1) }] },
    { desde: 2.3, transicion: 'viento', ...jack, viento: .8, franjas: true, decorado: llano, actores: [heroe], camara: [[0, 520, 340, .95]] },
    { desde: 4, ...jack, viento: .9, decorado: llano, actores: [heroe], camara: [[0, 540, 300, 2.1], [5.3, 540, 290, 2.25]] },
    { desde: 5.3, transicion: 'tajo', ...jack, viento: .9, franjas: true, decorado: rojo, camara: [[0, 640, 360, 1], [9.5, 640, 360, 1.06]],
      actores: [{ p: Object.assign({}, E, { escala: .68 }), x: 640, vista: 'frente', acciones: [{ hace: 'puno', en: 5.3, hasta: 10 }] }] },
  ],
};
