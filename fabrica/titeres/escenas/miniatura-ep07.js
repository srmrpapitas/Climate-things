// Españistán ep. 7 · miniatura (un fotograma, en t = 1,5): el aula de hoy con la pizarra del bate y la pelota; el Decano, de frente, a la derecha.
// Las letras se ponen después con ffmpeg (fabrica/titeres/miniatura.sh 7). Izquierda libre para ellas.
const DE = { ...PERSONAJES.decano, escala: 1.25 };
const cartoon = { cartoon: true, jack: true, quieto: true, figura: '#2b2235', sombra: 8, contraluz: 0, bordes: ['rgb(150,210,255)', 'rgb(255,150,90)'], borde: .8 };
window.ESCENA = {
  dura: 2, fps: 30, suelo: 600,
  planos: [
    { desde: 0, ...cartoon, camara: [[0, 640, 360, 1]],
      decorado: [{ tipo: 'aulaHoy', dia: 1, par: .3 }],
      delante: [{ tipo: 'pupitres', epoca: 'hoy', filas: 2, cols: 4, ninos: true, y: 660 }],
      actores: [{ p: DE, x: 1060, mira: -1, acciones: [{ hace: 'vista', a: 'frente', en: 0 }] }] },
  ],
};
