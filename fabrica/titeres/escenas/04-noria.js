// Españistán ep. 4 · secuencia B, «Dos de cada tres» (bloques 3–5). Estilo `jack`, 30 fps. Tiempos: tiempos-04.js.
// Datos: 04-bipartidismo.md, bloque 1 (Ministerio del Interior: PP + PSOE sobre votos válidos).
//   b3      la feria sigue; cartel con 2008 → 83,8 %. b3.2 «Podemos y Ciudadanos» → se encienden dos cabinas pequeñas (morada y naranja); 2015 → 50,7 %.
//   b4      «Parecía el final»: se apaga el ambiente, todo quieto. «volvieron» → las dos cabinas se desprenden y caen; la noria ni se inmuta. 2023 → ≈ 65 %.
//   b5      el Decano entra con el candil al pie de la noria: la pregunta.
const G = T.guion([3, 4, 5]), en = G.en;
const DE = PERSONAJES.decano;
const jack = { jack: true, quieto: true, figura: '#2b2522', sombra: 9, contraluz: 0, bordes: ['rgb(190,215,255)', 'rgb(255,150,90)'], borde: .8 };
const ENCIENDE = G.x('b3.2', 1.6), CAEN = G.x('b4', 2.6);   // «con Podemos y Ciudadanos» y «volvieron» (ajustar con el audio real)
const noria = { tipo: 'noria', x: 640, y: 640, r: 300, vel: .025, par: .8, extra: [{ color: '#6b2f8f', en: ENCIENDE, cae: CAEN }, { color: '#e07a1c', en: ENCIENDE + .4, cae: CAEN + .25 }] };
const feria = [
  { tipo: 'plano', color: '#131b30', raya: 'rgba(0,0,0,.28)', luz: 'rgba(110,140,210,.08)', par: .2 },
  { tipo: 'astro', x: 900, y: 120, r: 46, luna: true, par: .2 }, { tipo: 'nubes', tono: .35, n: 5, y: 60, par: .25 },
  { tipo: 'ciudad', tono: .55, par: .35, y: 560, s: 4 }, noria,
  { tipo: 'farola', x: 160, par: 1 }, { tipo: 'farola', x: 1120, par: 1 }, { tipo: 'suelo', par: 1, matas: 0 }];
const gente = [80, 81, 82, 83, 84, 85].map((n, i) => ({ p: ciudadano(n, { escala: .27 + .04 * (i % 3) }), x: 360 + i * 110, mira: i < 3 ? 1 : -1,
  acciones: [{ hace: i % 2 ? 'encoge' : 'senala', en: CAEN + .2 + .15 * i, hasta: CAEN + 2 }] }));
window.ESCENA = {
  dura: G.fin, fps: 30, suelo: 600, voces: G.voces,
  silencios: [[en.b4, CAEN]],
  sonidos: [
    { en: 0, hasta: G.fin, archivo: 'audio/sfx/lluvia.mp3', volumen: .3, bucle: true },
    { en: 0, hasta: G.fin, archivo: 'audio/sfx/viento.mp3', volumen: .2, bucle: true },
    { en: ENCIENDE, archivo: 'audio/sfx/whoosh.mp3', volumen: .3 },
    { en: CAEN + .7, archivo: 'audio/sfx/derrumbe.mp3', volumen: .5 }, { en: CAEN + .75, archivo: 'audio/sfx/impacto.mp3', volumen: .45 }],
  carteles: [
    { en: G.x('b3', .4), hasta: en.b5 - .3, x: 40, y: 40, ancho: 470, titulo: 'PP + PSOE', tiempos: [G.x('b3', 3), G.x('b3.2', 3.4), CAEN + 1],
      filas: [['2008', '83,8 %'], ['2015', '50,7 %'], ['2023', '≈ 65 %', '#7a1410']], fuente: 'Ministerio del Interior' },
    { en: G.x('b5', .5), hasta: G.fin - .2, x: 40, y: 40, ancho: 560, titulo: 'Pregunta del Decano', tiempos: [G.x('b5', 2.4), G.x('b5.2', .4)],
      filas: [['¿Son los mejores…', ''], ['…o las reglas son para dos?', '']], fuente: 'Españistán' }],
  planos: [
    { desde: 0, ...jack, viento: .4, franjas: true, decorado: feria, actores: gente,
      particulas: [{ tipo: 'lluvia', n: 320, viento: 120, fuerza: [[0, .6], [en.b4, .6], [CAEN, .9]] }],
      camara: [[0, 640, 360, 1], [ENCIENDE - .2, 640, 340, 1.06], [ENCIENDE - .2, 640, 330, 1.18], [en.b4, 640, 325, 1.22], [CAEN - .05, 640, 325, 1.22], [CAEN - .05, 640, 360, 1], [en.b5, 640, 350, 1.04]] },
    { desde: en.b5 - .2, transicion: 'viento', ...jack, viento: .4, decorado: feria,
      particulas: [{ tipo: 'lluvia', n: 260, viento: 120, fuerza: [[0, .5]] }],
      actores: [{ p: DE, x: 1380, mira: -1, acciones: [{ hace: 'camina', en: en.b5, hasta: G.x('b5', 2.2), a: 1000 }, { hace: 'piensa', en: G.x('b5', 2.4), hasta: en['b5.2'] }, { hace: 'senala', en: G.x('b5.2', .2), hasta: G.fin }] }],
      camara: [[0, 820, 330, 1.35], [G.fin, 820, 320, 1.42]] },
  ],
};
