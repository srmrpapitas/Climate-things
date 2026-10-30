// Prueba de estilo «a lo Samurai Jack» con Acascar (≈ 8 s): color plano, figura en dos tonos, cámara quieta,
// planos que se aguantan y gestos secos. Cortes secos entre planos (sin transición).
//   0–3     general: cielo rojo plano, Acascar diminuto en lo alto de una roca con la bandera al viento. No se mueve: solo el viento.
//   3–5,6   primer plano de frente: aguanta la mirada… y de golpe, el puño.
//   5,6–8   contraplano desde atrás, lejísimos: él solo ante el cielo.
const A = PERSONAJES.acascar;
const jack = { jack: true, quieto: true, figura: '#3b3431', sombra: 9, contraluz: 0, bordes: ['rgb(255,236,214)', 'rgb(255,120,70)'], borde: .8 };
const rojo = [{ tipo: 'plano', color: '#b11d18', par: .3 }];
window.ESCENA = {
  dura: 8, fps: 30, suelo: 600,
  planos: [
    { desde: 0, ...jack, viento: 1, decorado: [...rojo, { tipo: 'roca', x: 560, y: 640, escala: 1.4, par: 1 }, { tipo: 'pinchos', y: 690, par: 1 }],
      actores: [{ p: Object.assign({}, A, { escala: .7, objeto: 'bandera' }), x: 560, y: -75, mira: 1, acciones: [] }],
      camara: [[0, 640, 360, 1]] },
    { desde: 3, ...jack, viento: .8, decorado: [...rojo],
      actores: [{ p: A, x: 640, vista: 'frente', acciones: [{ hace: 'puno', en: 4.3, hasta: 5.8, entra: .08, sale: .05 }] }],
      camara: [[3, 640, 250, 2.6]] },
    { desde: 5.6, ...jack, viento: 1, decorado: [{ tipo: 'plano', color: '#9e1914', par: .3 }, { tipo: 'roca', x: 640, y: 660, escala: .9, par: 1 }, { tipo: 'pinchos', y: 700, escala: .6, par: 1 }],
      actores: [{ p: Object.assign({}, A, { escala: .35, objeto: 'bandera' }), x: 640, y: -50, vista: 'espalda', acciones: [] }],
      camara: [[5.6, 640, 360, 1]] },
  ],
};
