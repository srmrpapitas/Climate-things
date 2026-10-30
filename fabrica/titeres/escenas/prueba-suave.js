// Prueba de suavidad (antes / después del muelle, la anticipación y el desenfoque de movimiento): gestos rápidos en modo cartoon y
// una cámara con varias claves. 8 s.
const P = PERSONAJES;
window.ESCENA = {
  dura: 8, fps: 30, suelo: 600,
  titulos: [],
  planos: [{ desde: 0, cartoon: true, decorado: [{ tipo: 'cieloNoche', luna: [640, 160, 70], par: .3 }, { tipo: 'ciudad', tono: .3, par: .6, y: 600, s: 4 }, { tipo: 'suelo', par: 1, matas: 3 }],
    camara: [[0, 600, 380, 1], [2.5, 660, 360, 1.12], [5, 700, 350, 1.2], [8, 640, 370, 1.05]],
    actores: [
      { p: P.decano, x: 150, mira: 1, acciones: [{ hace: 'camina', en: .3, hasta: 2.4, a: 520 }, { hace: 'puno', en: 2.8, hasta: 3.8 }, { hace: 'senala', en: 4.1, hasta: 5.1 }, { hace: 'sorprende', en: 5.5, hasta: 6.5 }, { hace: 'saluda', en: 6.9, hasta: 8 }] },
      { p: P.sanchis, x: 900, mira: -1, acciones: [{ hace: 'habla', en: .5, hasta: 3.6 }, { hace: 'encoge', en: 3.9, hasta: 4.9 }, { hace: 'inclina', en: 5.2, hasta: 6.1 }, { hace: 'celebra', en: 6.5, hasta: 8 }] }] }],
};
