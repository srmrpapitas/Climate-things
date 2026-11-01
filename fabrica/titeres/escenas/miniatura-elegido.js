// Miniaturas: el Elegido (el personaje del canal) a la izquierda, grande, alzando la espada sobre el sol rojo del avatar.
// La mitad derecha se tapa con la escena de Gemini (fabrica/titeres/miniatura_gemini.py). Un fotograma en t = 1,5.
const jack = { jack: true, quieto: true, figura: '#3b3431', sombra: 9, contraluz: 0, bordes: ['rgb(255,226,190)', 'rgb(255,120,70)'], borde: .9 };
window.ESCENA = {
  dura: 2, fps: 30, suelo: 880,
  planos: [
    { desde: 0, ...jack, viento: .9, camara: [[0, 640, 360, 1]],
      decorado: [{ tipo: 'plano', color: '#c41f19', par: .3 }, { tipo: 'disco', x: 270, y: 300, r: 250, color: '#ef5a2c', par: 1 }],
      actores: [{ p: { ...PERSONAJES.elegido, escala: 1.55 }, x: 270, vista: 'frente', acciones: [{ hace: 'puno', en: 0, hasta: 9 }] }] },
  ],
};
