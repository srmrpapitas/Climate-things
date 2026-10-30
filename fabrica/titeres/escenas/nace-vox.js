// Españistán ep. 3 · secuencia D, «Nace Vox» (bloques 13–16 del guion de 8 min). Estilo `jack`, 30 fps. Tiempos del audio (tiempos.js).
// Datos: 03-abascal.md, bloques 2 y 3 (Maldita.es; Registro de partidos; El País; 3Cat).
//   b13     militantes del PP, de espaldas, ante un líder lejano en su atril: niegan y alzan el puño. b13.2: se dan la vuelta y se van.
//   b14     (humo) la mesa fundadora: tres sentados; cartel con quién es cada uno.
//   b15     (papeletas) europeas de 2014: ni un escaño. b15.2: el saco del dinero crece; el 80 %, de simpatizantes de la oposición iraní.
//   b16     la mesa otra vez: nunca hubo causa; Vidal-Quadras se levanta y se va; quedan dos sillas ocupadas.
const G = T.guion([13, 14, 15, 16]), en = G.en;
const jack = { jack: true, quieto: true, figura: '#3b3431', sombra: 9, contraluz: 0, bordes: ['rgb(255,226,190)', 'rgb(255,120,70)'], borde: .7 };
const cielo = (color = '#2a2230') => [{ tipo: 'plano', color, raya: 'rgba(0,0,0,.25)', luz: 'rgba(255,200,140,.06)', par: .3 }];
const lider = ciudadano(60, { barba: 'corta', pelo: 'entradas', gafas: 'cuadradas', sombrero: null, escala: .55, tono: .45 });
// militantes en primera fila, de espaldas a nosotros y de cara al líder; en b13.2 se giran hacia nosotros y se marchan
const militantes = [90, 250, 410, 870, 1030, 1190].map((x, i) => ({ p: ciudadano(70 + i, { escala: 1, sombrero: null }), x: x + 25 * T.azar(i), y: 90, vista: 'espalda',   // hueco en medio: se ve al líder
  acciones: [{ hace: i % 2 ? 'niega' : 'puno', en: en.b13 + 1 + .3 * i, hasta: en.b13 + 3.2 + .3 * i },
    { hace: 'vista', a: 'perfil', en: en['b13.2'] + .2 * i }, { hace: 'camina', en: en['b13.2'] + .4 + .2 * i, hasta: en.b14, a: 1500 + i * 120 }] }));
const mesa = (vaVidal) => ({ tipo: 'mesa', x: 640, y: 600, par: 1, sillas: [{ en: 999 }, { en: vaVidal }, { en: 999 }] });
const VIDAL = en.b16 + 2.4;   // «Vidal-Quadras se fue al año siguiente»
window.ESCENA = {
  dura: G.fin, fps: 30, suelo: 600, voces: G.voces,
  carteles: [
    { en: en.b13 + 2.2, hasta: en.b14 - .3, x: 40, y: 40, ancho: 600, titulo: 'Contra Rajoy: «blando»', paso: 1.3,
      filas: [['Con los presos de ETA', ''], ['Con los impuestos', ''], ['Con el independentismo catalán', '']], fuente: '03-abascal.md · El País' },
    { en: en.b14 + .6, hasta: en.b15 - .3, x: 40, y: 40, ancho: 900, titulo: 'La mesa fundadora', paso: 2.6,
      filas: [['Acascar', ''], ['Alejo Vidal-Quadras', 'antiguo líder del PP catalán'], ['José Antonio Ortega Lara', '532 días secuestrado por ETA']], fuente: 'Registro de partidos · Maldita.es' },
    { en: en.b15 + .4, hasta: en.b16 - .3, x: 40, y: 40, ancho: 680, titulo: 'Europeas de 2014', paso: en['b15.2'] - en.b15,
      filas: [['Escaños', '0'], ['La campaña costó', '≈ 1 millón €'], ['Simpatizantes de la oposición iraní en el exilio', '80 %', '#7a1410']], fuente: 'El País (2019) · 3Cat' },
    { en: en.b16 + .3, hasta: G.fin - .2, x: 40, y: 40, ancho: 560, titulo: 'Después', paso: 2.3,
      filas: [['Causa judicial', 'ninguna'], ['Vidal-Quadras', 'se va en 2015'], ['De la mesa queda', 'Ortega Lara']], fuente: 'Valencia Plaza · Newtral' }],
  planos: [
    { desde: 0, ...jack, viento: .3, franjas: true, camara: [[0, 640, 360, .95], [en['b13.2'], 640, 350, 1.02]],
      decorado: [...cielo('#3a2a24'), { tipo: 'congreso', x: 640, y: 470, escala: .55, tono: .35, par: .6 }, { tipo: 'suelo', y: 470, tono: .3, par: .6, matas: 0 }, { tipo: 'suelo', par: 1, matas: 0 }],
      actores: [{ p: lider, x: 640, y: -130, mira: 1, vista: 'frente', acciones: [{ hace: 'habla', en: 0, hasta: en['b13.2'] }] }, ...militantes] },
    { desde: en.b14 - .2, transicion: 'humo', ...jack, viento: .2, actores: [], camara: [[0, 640, 300, 1.1], [en['b14.2'], 640, 330, 1.35]],
      decorado: [...cielo('#4a2a1c'), mesa(999), { tipo: 'suelo', par: 1, matas: 0 }] },
    { desde: en.b15 - .2, transicion: 'papeles', ...jack, viento: .6, actores: [], camara: [[0, 640, 400, 1.05]],
      particulas: [{ tipo: 'papeles', n: 40, zona: [0, -100, 1280, 600] }],
      decorado: [...cielo('#b11d18'), { tipo: 'saco', x: 900, y: 600, escala: 1.6, crece: .4, en: en['b15.2'], par: 1 }, { tipo: 'suelo', par: 1, matas: 0 }] },
    { desde: en.b16 - .2, transicion: 'humo', ...jack, viento: .2, actores: [], camara: [[0, 640, 300, 1.1]],
      decorado: [...cielo('#4a2a1c'), mesa(VIDAL), { tipo: 'suelo', par: 1, matas: 0 }] },
  ],
};
