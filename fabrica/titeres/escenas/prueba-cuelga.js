// prueba: medir dónde queda la mano del Elegido al colgarse (no es del capítulo)
const E = Object.assign({}, PERSONAJES.elegido, { escala: .5 });
window.ESCENA = { dura: 1, fps: 30, suelo: 600, planos: [{ desde: 0, jack: true, quieto: true, figura: '#3b3431', sombra: 9, contraluz: 0, borde: .7,
  decorado: [{ tipo: 'plano', color: '#c8611f' }, { tipo: 'suelo', par: 1, matas: 0 }],
  actores: [{ p: E, x: 640, mira: 1, acciones: [{ hace: 'cuelga', en: -1 }] }],
  camara: [[0, 640, 470, 2.5]] }] };
