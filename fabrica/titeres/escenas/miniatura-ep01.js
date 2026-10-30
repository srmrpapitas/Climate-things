// Españistán ep. 1 · miniatura (un fotograma, en t = 1,5). Sanchís saluda desde lo alto; la gente aplaude. Letras con miniatura.sh 1.
const jack = { jack: true, quieto: true, figura: '#3b3431', sombra: 9, contraluz: 0, bordes: ['rgb(255,226,190)', 'rgb(255,120,70)'], borde: .7 };
const gente = [470, 540, 610, 680, 1000, 1070, 1140, 1210, 1280, 1350].map((x, i) => ({ p: Object.assign({}, ciudadano(20 + i), { escala: .62, tono: .85 }), x, y: -10 + (i % 3) * 8,
  mira: x < 840 ? 1 : -1, acciones: [{ hace: 'aplaude', en: 0, hasta: 999 }] }));
window.ESCENA = {
  dura: 2, fps: 30, suelo: 600,
  planos: [
    { desde: 0, ...jack, viento: 1, camara: [[0, 660, 290, .85]],
      decorado: [{ tipo: 'plano', color: '#7a1630', par: .3 }, { tipo: 'disco', x: 840, y: 250, r: 240, color: '#f08a3c', par: .3 },
        { tipo: 'roca', x: 840, y: 600, escala: 1.6, par: 1 }, { tipo: 'suelo', par: 1, matas: 0 }],
      actores: [
        { p: PERSONAJES.sanchis, x: 830, y: -95, mira: -1, acciones: [{ hace: 'saluda', en: 0, hasta: 999, entra: .01 }] },
        ...gente] },
  ],
};
