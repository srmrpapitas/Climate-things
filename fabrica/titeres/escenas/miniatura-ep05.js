// Españistán ep. 5 · miniatura (un fotograma, en t = 1,5): Lucía y Dani, de frente, junto a la litera; la llave brilla en la ventana.
// Las letras se ponen después con ffmpeg (fabrica/titeres/miniatura.sh 5). Izquierda libre para ellas.
const LU = { ...PERSONAJES.lucia, escala: 1.2 }, DA = { ...PERSONAJES.dani, escala: 1.2 };
const jack = { jack: true, quieto: true, figura: '#2b2522', sombra: 9, contraluz: 0, bordes: ['rgb(150,180,255)', 'rgb(255,170,100)'], borde: .5 };
window.ESCENA = {
  dura: 2, fps: 30, suelo: 600,
  planos: [
    { desde: 0, ...jack, viento: 0, camara: [[0, 640, 360, 1]],
      decorado: [{ tipo: 'cuarto', lluvia: .5, ventana: 1000, grua: 0, par: 1 }, { tipo: 'litera', x: 1100, escala: .9, par: 1 }],
      delante: [{ tipo: 'llave', x: 1085, y: 300, en: 0, escala: .6 }],
      actores: [{ p: LU, x: 820, mira: 1, acciones: [{ hace: 'vista', a: 'frente', en: 0 }] }, { p: DA, x: 990, mira: -1, acciones: [{ hace: 'vista', a: 'frente', en: 0 }] }] },
  ],
};
