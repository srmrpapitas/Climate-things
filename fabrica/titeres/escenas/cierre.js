// Españistán ep. 3 · secuencia J, «Cierre» (bloques 49–50). Estilo `jack`, 30 fps. Tiempos del audio (tiempos.js).
//   b49     la urna: un vecino llega con su papeleta, se para a pensar y vota; el Decano asiente al fondo. Nunca decimos a quién.
//   b50     (viento) próximo episodio: pantalla partida, Sanchís y Feijolo, cada uno delante de su lista cerrada.
const G = T.guion([49, 50]), en = G.en;
const DE = PERSONAJES.decano, SA = PERSONAJES.sanchis, FE = PERSONAJES.feijolo;
const jack = { jack: true, quieto: true, figura: '#3b3431', sombra: 9, contraluz: 0, bordes: ['rgb(255,226,190)', 'rgb(255,120,70)'], borde: .7 };
const vecino = ciudadano(95, { objeto: 'papel', sombrero: null });
const VOTA = en.b49 + 4.6;   // «…y que votes pensando»
const lista = (p, color, nombre) => ({ decorado: [{ tipo: 'plano', color, par: .3 }, { tipo: 'lista', x: 640, y: 600, escala: 1.05, texto: 'LISTA ' + nombre, s: nombre.length, par: 1 }, { tipo: 'suelo', par: 1, matas: 0 }],
  actores: [{ p, x: 470, mira: 1, acciones: [{ hace: 'senala', en: en.b50 + 2.2, hasta: G.fin }] }] });
window.ESCENA = {
  dura: G.fin, fps: 30, suelo: 600, voces: G.voces,
  sonidos: [{ en: VOTA + .3, archivo: 'audio/sfx/impacto.mp3', volumen: .2 }],
  titulos: [{ en: en.b50 + .4, hasta: G.fin, texto: 'PRÓXIMO EPISODIO', sub: 'El bipartidismo · las listas cerradas', y: 175 }],
  planos: [
    { desde: 0, ...jack, viento: .2, franjas: true, camara: [[0, 640, 360, 1], [VOTA - .2, 640, 360, 1], [VOTA - .2, 600, 420, 1.8]],
      decorado: [{ tipo: 'plano', color: '#c06a28', par: .3 }, { tipo: 'disco', x: 640, y: 300, r: 170, color: '#e39a3d', par: .3 },
        { tipo: 'mesa', x: 640, y: 600, ancho: 320, par: 1 }, { tipo: 'urna', x: 640, y: 508, escala: 1.25, par: 1 }, { tipo: 'suelo', par: 1, matas: 0 }],
      actores: [
        { p: vecino, x: -120, mira: 1, acciones: [{ hace: 'camina', en: en.b49, hasta: en.b49 + 2.2, a: 470 }, { hace: 'piensa', en: en.b49 + 2.4, hasta: VOTA - .3 },
          { hace: 'brazos', h: 1.75, c: .25, en: VOTA - .2, hasta: VOTA + 1.2, mano: 'abierta' }, { hace: 'suelta', en: VOTA + .3 }] },
        { p: DE, x: 1080, mira: -1, acciones: [{ hace: 'asiente', en: VOTA + .6, hasta: VOTA + 1.4 }] }] },
    { desde: en.b50 - .2, transicion: 'viento', ...jack, viento: .3, franjas: true, decorado: [{ tipo: 'plano', color: '#1f2a44', par: .3 }], actores: [], camara: [[0, 640, 360, 1]], paneles: [
      { en: en.b50 - .1, rect: [0, 88, 636, 544], entra: 'izq', camara: [[0, 600, 330, .95]], ...lista(SA, '#7d3b2c', 'A') },
      { en: en.b50 + .7, rect: [644, 88, 636, 544], entra: 'der', camara: [[0, 600, 330, .95]], ...lista(FE, '#2f4a5c', 'B') }] },
  ],
};
