// Españistán ep. 4 · miniatura (un fotograma, en t = 1,5): el banquete de las dos familias, de frente a cada lado del pastel 10/10; fuera, la gente bajo la lluvia.
// Las letras se ponen después con ffmpeg (fabrica/titeres/miniatura.sh 4). Izquierda libre para ellas.
const SA = { ...PERSONAJES.sanchis, escala: 1.3 }, FE = { ...PERSONAJES.feijolo, escala: 1.3 };
const jack = { jack: true, quieto: true, figura: '#2b2522', sombra: 9, contraluz: 0, bordes: ['rgb(255,226,190)', 'rgb(255,120,70)'], borde: .7 };
window.ESCENA = {
  dura: 2, fps: 30, suelo: 600,
  planos: [
    { desde: 0, ...jack, viento: 0, borde: .4, camara: [[0, 330, 360, 1]],
      decorado: [{ tipo: 'salon', sinMesa: true, lluvia: 1, par: 1 }],
      delante: [{ tipo: 'banquete', velas: [[200, 0], [1080, 0], [260, 1], [1020, 1]], cortes: [{ en: -1, partes: [10, 10] }], pastel: 1.3, par: 1 }],
      actores: [{ p: SA, x: 545, mira: 1, acciones: [{ hace: 'vista', a: 'frente', en: 0 }] }, { p: FE, x: 745, mira: -1, acciones: [{ hace: 'vista', a: 'frente', en: 0 }] }] },
  ],
};
