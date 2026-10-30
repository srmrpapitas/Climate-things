// Españistán · outro (12 s, 30 fps). Estilo `jack`: sol plano enorme, siluetas, franjas de cine. Ritmo rápido: la voz empieza ya.
// El Elegido, en el llano de los tres monumentos, los activa: salta al «me gusta», pisa SUSCRÍBETE y se cuelga de la cuerda de la campana.
//   0–2,9    junto al pulgar: «dale a like» y salta encima, que se enciende; alza la espada.
//   2,9–4,5  salta al botón; corte al contrapicado: lo hunde y pasa a SUSCRITO («suscríbete»).
//   4,5–8    salta a la cuerda y se cuelga; cada tirón, un toque de campana («y activa la campana»).
//   8–12     se deja caer, se gira hacia nosotros y alza la espada. Título.
const E = Object.assign({}, PERSONAJES.elegido, { escala: .5 });   // colgado, su mano queda 232 por encima de los pies y 13 por delante
const jack = { jack: true, quieto: true, figura: '#3b3431', sombra: 9, contraluz: 0, bordes: ['rgb(255,226,190)', 'rgb(255,120,70)'], borde: .7 };
// los monumentos: pulgar (puño arriba en y = 400), botón (hundido arriba en y = 493), campana (nudo de la cuerda en y = 301)
const tirones = [5.9, 6.6, 7.3];
const CAMP = { tipo: 'campana', x: 1060, escala: .85, par: 1, toca: tirones.map(p => p + .05), tirones };
const llano = [
  { tipo: 'plano', color: '#c8611f', raya: 'rgba(90,20,6,.25)', luz: 'rgba(255,170,80,.12)', par: .3 },
  { tipo: 'disco', x: 1000, y: 330, r: 190, color: '#eba13c', par: .3 },
  { tipo: 'montes', tono: .25, par: .45, y: 520 },
  { tipo: 'pulgar', x: 170, escala: .85, en: 2, par: 1 },
  { tipo: 'boton', x: 610, escala: .8, en: 3.6, par: 1 },
  CAMP,
  { tipo: 'suelo', par: 1, matas: 6 }];
const aire = [{ tipo: 'hojas', n: 7, zona: [0, 150, 1280, 560] }];
// el Elegido: un único guion de acciones para todos los planos, así nunca salta de sitio entre cortes
const heroe = { p: E, x: 120, mira: 1, acciones: [
  { hace: 'brinca', en: 1.4, hasta: 2, dx: 110, dy: -200, alto: 120 },
  { hace: 'puno', en: 2.2, hasta: 2.9 },
  { hace: 'brinca', en: 3, hasta: 3.6, dx: 380, dy: 93, alto: 150 },
  { hace: 'brinca', en: 4.6, hasta: 5.2, dx: 437, dy: 40, alto: 170 },
  { hace: 'cuelga', en: 5.2, hasta: 8, campana: CAMP, largo: 230, tirones },
  { hace: 'brinca', en: 8, hasta: 8.4, dx: 90, dy: 67, alto: 30 },
  { hace: 'vista', en: 8.6, a: 'frente' },
  { hace: 'puno', en: 8.9, hasta: 12.5 }] };
const plano = (desde, camara, extra = {}) => Object.assign({ desde, ...jack, viento: .5, decorado: llano, particulas: aire, actores: [heroe], camara }, extra);
// la frase final del narrador («dale a like, suscríbete y activa la campana»): el último bloque del guion del capítulo, si ya está grabado
const TI = window.TIEMPOS, ULTIMO = TI && Math.max(...Object.keys(TI.b).map(Number));
// partida en sus pausas (b51a «…dale a like», b51b «suscríbete», b51c «y activa la campana») para que cada palabra caiga en su monumento
const vozFinal = TI ? [[.3, 2.08, 'a'], [3.1, .93, 'b'], [4.4, 1.4, 'c']].map(([en, dura, k]) =>
  ({ en, dura, quien: 'narrador', texto: '', sinSub: true, archivo: `${TI.voz}b${String(ULTIMO).padStart(2, '0')}${k}.mp3` })) : [];
window.ESCENA = {
  dura: 12, fps: 30, suelo: 600, voces: vozFinal,
  titulos: [{ en: 9, hasta: 12, texto: 'ESPAÑISTÁN', sub: 'Dale a me gusta · Suscríbete · Activa la campana', y: 190 }],
  sonidos: [
    ...[1.3, 2.9, 4.5, 7.95].map(en => ({ en, archivo: 'audio/sfx/whoosh.mp3', volumen: .5 })),
    { en: 2, archivo: 'audio/sfx/impacto.mp3', volumen: .14 }, { en: 3.6, archivo: 'audio/sfx/impacto.mp3', volumen: .32 }, { en: 8.4, archivo: 'audio/sfx/impacto.mp3', volumen: .12 },
    ...CAMP.toca.map(en => ({ en, archivo: 'audio/sfx/campana.mp3', volumen: .8 }))],
  planos: [
    plano(0, [[0, 300, 350, 1.15], [2, 300, 350, 1.15], [2, 230, 340, 1.6]], { franjas: true }),
    plano(2.9, [[2.9, 420, 380, 1.1], [3.6, 420, 380, 1.1], [3.6, 610, 470, 2], [4.5, 610, 460, 2.1]]),
    plano(4.5, [[4.5, 830, 330, 1.05], [5.2, 830, 330, 1.05], [5.2, 1060, 310, 1.5], [6.5, 1060, 310, 1.5], [6.5, 1060, 150, 2.6], [7.2, 1060, 150, 2.6], [7.2, 1000, 330, 1.2], [8, 1000, 330, 1.2]]),
    plano(8, [[8, 900, 330, 1], [12, 800, 320, .9]], { franjas: true }),
  ],
};
