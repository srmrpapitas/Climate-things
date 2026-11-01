// Personajes sueltos, sin fondo (PNG con transparencia) para componer miniaturas: ?e=recorte&p=feijolo,sanchis
// ?p=feijolo&color=1d4fa8&escala=3&y=900 (fotos.mjs: Q='p=feijolo&color=1d4fa8' node fabrica/titeres/fotos.mjs recorte 1.5)
const q = new URLSearchParams(location.search), nombres = (q.get('p') || 'feijolo').split(','), esc = +(q.get('escala') || 1.6);
window.ESCENA = {
  dura: 2, fps: 30, suelo: 600,
  planos: [{ desde: 0, cartoon: true, jack: true, quieto: true, figura: '#' + (q.get('color') || '2b2235'), sombra: 0, contraluz: 0, bordes: ['rgb(150,210,255)', 'rgb(255,150,90)'], borde: .8,
    camara: [[0, 640, +(q.get('y') || 360), 1]], decorado: [],
    actores: nombres.map((n, i) => ({ p: { ...PERSONAJES[n], escala: esc }, x: 640 + (i - (nombres.length - 1) / 2) * 420 * esc / 1.6, mira: i ? -1 : 1, acciones: [{ hace: 'vista', a: 'frente', en: 0 }] })) }],
};
