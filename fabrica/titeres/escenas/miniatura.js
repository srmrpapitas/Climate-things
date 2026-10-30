// Españistán ep. 3 · miniatura (un fotograma, en t = 1,5). Lo del momento: octubre de 2026, encuestas al 19 % y ≈ 68 escaños, su mejor marca.
// Acascar con la bandera en lo alto de la roca; la multitud alza el puño.
// Las letras se ponen después con ffmpeg (fabrica/titeres/miniatura.sh). Izquierda libre para ellas.
const AC = PERSONAJES.acascar;
const jack = { jack: true, quieto: true, figura: '#3b3431', sombra: 9, contraluz: 0, bordes: ['rgb(255,226,190)', 'rgb(255,120,70)'], borde: .7 };
const gente = [470, 540, 610, 680, 1000, 1070, 1140, 1210, 1280, 1350].map((x, i) => ({ p: Object.assign({}, ciudadano(60 + i), { escala: .62, tono: .85 }), x, y: -10 + (i % 3) * 8,
  mira: x < 840 ? 1 : -1, acciones: [{ hace: 'puno', en: 0, hasta: 999 }] }));
window.ESCENA = {
  dura: 2, fps: 30, suelo: 600,
  planos: [
    { desde: 0, ...jack, viento: 1, camara: [[0, 660, 290, .85]],
      decorado: [{ tipo: 'plano', color: '#b11d18', par: .3 }, { tipo: 'disco', x: 840, y: 250, r: 240, color: '#e0542c', par: .3 },
        { tipo: 'roca', x: 840, y: 600, escala: 1.6, par: 1 }, { tipo: 'suelo', par: 1, matas: 0 }],
      actores: [
        { p: Object.assign({}, AC, { objeto: 'bandera' }), x: 830, y: -95, mira: -1, acciones: [{ hace: 'brazos', h: 2.75, c: .1, en: 0, hasta: 999, entra: .01 }] },
        ...gente] },
  ],
};
