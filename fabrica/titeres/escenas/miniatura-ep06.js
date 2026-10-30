// Españistán ep. 6 · miniatura (un fotograma, en t = 1,5): la playa de Ceuta de noche, el agua llena de cabezas; el Decano, de frente, a la derecha.
// Las letras se ponen después con ffmpeg (fabrica/titeres/miniatura.sh 6). Izquierda libre para ellas.
const DE = { ...PERSONAJES.decano, escala: 1.25 };
const cartoon = { cartoon: true, jack: true, quieto: true, figura: '#2b2235', sombra: 8, contraluz: 0, bordes: ['rgb(150,210,255)', 'rgb(255,150,90)'], borde: .8 };
window.ESCENA = {
  dura: 2, fps: 30, suelo: 600,
  planos: [
    { desde: 0, ...cartoon, viento: .2, camara: [[0, 640, 380, 1.05]],
      decorado: [{ tipo: 'cieloNoche', luna: [1000, 140, 60], arriba: '#0e1030', abajo: '#3a2a66', par: .2 }, { tipo: 'playa', y: 560, par: .8 }],
      delante: [{ tipo: 'nadadores', n: 120, en: -4, oleadas: 2, zona: [-150, 1350, 380, 545] }],
      particulas: [{ tipo: 'estrellas', n: 30 }],
      actores: [{ p: DE, x: 1060, mira: -1, acciones: [{ hace: 'vista', a: 'frente', en: 0 }] }] },
  ],
};
