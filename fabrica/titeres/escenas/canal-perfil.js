// Foto de perfil del canal: el Elegido alzando la espada sobre el sol rojo de la intro (se recorta un cuadrado del centro). Un fotograma en t = 1,5.
const jack = { jack: true, quieto: true, figura: '#3b3431', sombra: 9, contraluz: 0, bordes: ['rgb(255,226,190)', 'rgb(255,120,70)'], borde: .7 };
window.ESCENA = {
  dura: 2, fps: 30, suelo: 600,
  planos: [
    { desde: 0, ...jack, viento: .9, camara: [[0, 640, 330, 1.25]],
      decorado: [{ tipo: 'plano', color: '#b11d18', par: .3 }, { tipo: 'disco', x: 640, y: 330, r: 200, color: '#d8452a', par: 1 }, { tipo: 'suelo', par: 1, matas: 0 }],
      actores: [{ p: { ...PERSONAJES.elegido, escala: .8 }, x: 640, vista: 'frente', acciones: [{ hace: 'puno', en: 0, hasta: 9 }] }] },
  ],
};
