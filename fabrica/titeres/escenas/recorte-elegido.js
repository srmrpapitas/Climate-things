// El Elegido sobre verde puro, para recortarlo (croma) y pegarlo en las miniaturas (fabrica/titeres/miniatura_gemini.py).
const jack = { jack: true, quieto: true, figura: '#2e2a2a', sombra: 0, contraluz: 0, bordes: ['rgb(255,226,190)', 'rgb(255,150,80)'], borde: .9 };
window.ESCENA = {
  dura: 2, fps: 30, suelo: 700,
  planos: [
    { desde: 0, ...jack, viento: .9, camara: [[0, 640, 360, 1]],
      decorado: [{ tipo: 'plano', color: '#00ff00', par: .3 }],
      actores: [{ p: { ...PERSONAJES.elegido, escala: 1.3 }, x: 640, vista: 'frente', acciones: [{ hace: 'puno', en: 0, hasta: 9 }] }] },
  ],
};
