// prueba (no es del capítulo): giro suave de un títere y transición `paneo` con la cámara que se aleja en el plano nuevo
const S = PERSONAJES.sanchis, R = PERSONAJES.rajoyo;
const jack = { jack: true, quieto: true, figura: '#2b2522', sombra: 9, contraluz: 0, bordes: ['rgb(255,226,190)', 'rgb(255,120,70)'], borde: .7 };
window.ESCENA = { dura: 6, fps: 30, suelo: 600, planos: [
  { desde: 0, ...jack, decorado: [{ tipo: 'plano', color: '#c8611f', par: .2 }, { tipo: 'rascacielos', tono: .45, n: 10, par: .4 }, { tipo: 'suelo', par: 1, matas: 0 }],
    actores: [{ p: S, x: 500, mira: 1, acciones: [{ hace: 'gira', en: .5 }, { hace: 'camina', en: 1.4, hasta: 2.6, a: 800 }] }],
    camara: [[0, 640, 360, 1], [3, 700, 360, 1.05]] },
  { desde: 3.2, transicion: 'paneo', ...jack, decorado: [{ tipo: 'plano', color: '#3d5f8a', par: .2 }, { tipo: 'astro', x: 900, y: 200, r: 60, par: .2 }, { tipo: 'montes', par: .5 }, { tipo: 'suelo', par: 1, matas: 8 }],
    actores: [{ p: R, x: 640, mira: -1, acciones: [] }],
    camara: [[3.2, 700, 420, 1.35], [5.5, 640, 360, 1]] },
] };
