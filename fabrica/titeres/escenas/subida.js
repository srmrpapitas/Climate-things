// Españistán ep. 3 · secuencia E, «El desierto y la subida» (bloques 17–21 y la frase f2). Estilo `jack`, 30 fps. Tiempos del audio (tiempos.js).
// Datos: 03-abascal.md, bloque 4 (Ministerio del Interior; Sigma Dos y GAD3, 12-10-2026).
//   b17     cuatro años casi invisibles: repta por el desierto rojo arrastrando la bandera; de golpe trepa la roca y la alza. Andalucía: 12.
//   b18–19  el público, de espaldas a él, se va girando a escalones: 24, 52; en 2023 algunos se vuelven (33); en 2026 se gira todo el mundo (≈ 68).
//   b19.3   (pájaros) contraplano: jóvenes que alzan el puño. Menores de 45 años.
//   b20     (viento) lo bueno también se cuenta: gente de la calle que se siente escuchada; el Decano asiente: «se debe entender».
//   b21, f2 primer plano de frente: «Los jóvenes me adoran. Será por el caballo.»
const G = T.guion([17, 18, 19, 20, 21, 'f2']), en = G.en;
const AC = PERSONAJES.acascar, DE = PERSONAJES.decano;
const jack = { jack: true, quieto: true, figura: '#3b3431', sombra: 9, contraluz: 0, bordes: ['rgb(255,226,190)', 'rgb(255,120,70)'], borde: .7 };
const cielo = (color = '#b11d18') => [{ tipo: 'plano', color, par: .3 }, { tipo: 'astro', x: 1010, y: 170, r: 46, par: .3 }];
const roca = (x, y = 560, e = 1.2) => ({ tipo: 'roca', x, y, escala: e, par: 1 });
const sube = en.b17 + 3.4;   // «y en dos mil dieciocho, de golpe»
const conBandera = Object.assign({}, AC, { objeto: 'bandera', escala: .75 });
// el público: 12 personas en primer término, de espaldas a Acascar. Se giran hacia él a escalones; en 2023 tres le dan la espalda otra vez
const A24 = en.b18 + .4, A52 = en.b18 + 4.2, A33 = en['b18.2'], A68 = en.b19 + 1.2;
const GIRA = [A24, A24, A52, A52, A52, A52, A52, A68, A68, A68, A68, A68], VUELVE = { 2: A33, 4: A33, 6: A33 };
const publico = GIRA.map((g, i) => {
  const acciones = [{ hace: 'vista', a: 'espalda', en: g }];
  if (VUELVE[i]) acciones.push({ hace: 'vista', a: 'frente', en: VUELVE[i] + .1 * i }, { hace: 'vista', a: 'espalda', en: A68 });
  acciones.push({ hace: i % 3 ? 'aplaude' : 'celebra', en: A68 + .5 + (i % 4) * .15, hasta: en['b19.3'] - .3 });
  return { p: ciudadano(i + 40, { escala: 1.05, tono: 1 }), x: 70 + i * 104 + 20 * T.azar(i), y: 110, vista: 'frente', acciones };
});
const calle = [{ tipo: 'plano', color: '#c98a2e', par: .3 }, { tipo: 'ciudad', tono: .25, par: .45, y: 545 }, { tipo: 'suelo', par: 1, matas: 0 }];
window.ESCENA = {
  dura: G.fin, fps: 30, suelo: 600, voces: G.voces,
  carteles: [
    { en: en.b17 + .4, hasta: sube - .2, x: 40, y: 40, ancho: 470, titulo: '2014 – 2018', filas: [['Diputados de Vox', '0']], fuente: 'Ministerio del Interior' },
    { en: sube + 1.4, hasta: en.b18 - .3, x: 40, y: 40, ancho: 470, titulo: '2018 · Andalucía', filas: [['Diputados de Vox', '12']], fuente: 'Junta de Andalucía' },
    { en: en.b18, hasta: en['b19.3'] - .3, x: 770, y: 24, ancho: 480, titulo: 'Diputados de Vox', paso: 1,
      filas: [['Congreso, abril 2019', '24'], ['Congreso, nov. 2019', '52'], ['Congreso, 2023', '33', '#3a2410'], ['Encuestas, oct. 2026', '≈ 68']],
      fuente: 'Ministerio del Interior · Sigma Dos y GAD3 (12-10-2026)', tiempos: [A24, A52, A33, A68] },
    { en: en['b19.3'] + .2, hasta: en.b20 - .3, x: 40, y: 40, ancho: 560, titulo: 'Dónde más sube', filas: [['Menores de 45 años', '▲']], fuente: 'Sigma Dos y GAD3 (12-10-2026)' },
    { en: en.b20 + .4, hasta: en.b21 - .3, x: 40, y: 40, ancho: 560, titulo: 'Lo bueno también se cuenta', paso: 1.2,
      filas: [['Vivienda', ''], ['Inmigración', ''], ['Seguridad', '']], fuente: '03-abascal.md' }],
  planos: [
    { desde: 0, ...jack, viento: .9, franjas: true, decorado: [...cielo(), { tipo: 'pinchos', y: 700, escala: .8, par: 1 }, { tipo: 'suelo', par: 1, matas: 0 }],
      actores: [{ p: AC, x: -80, mira: 1, acciones: [{ hace: 'coge', que: 'arrastra', mano: 'lejos', en: 0 }, { hace: 'repta', en: 0, hasta: 99, entra: .01 }, { hace: 'camina', en: 0, hasta: sube - .4, a: 520 }] }],
      camara: [[0, 640, 380, 1], [sube - 1.6, 640, 380, 1], [sube - 1.6, 640, 540, 2.4]] },
    { desde: sube - .3, transicion: 'viento', ...jack, viento: .9, decorado: [...cielo(), { tipo: 'roca', x: 560, y: 640, escala: 1.5, par: 1 }, { tipo: 'suelo', par: 1, matas: 0 }],
      actores: [{ p: AC, x: 335, mira: 1, acciones: [{ hace: 'trepa', en: sube, hasta: sube + 2, dx: 190, dy: -97, pasos: 4 },
        { hace: 'coge', que: 'bandera', mano: 'cerca', en: sube + 2.1 }, { hace: 'brazos', h: 2.75, c: .1, en: sube + 2.2, hasta: 999, entra: .12 }] }],
      camara: [[0, 600, 330, .95]] },
    { desde: en.b18 - .2, transicion: 'viento', ...jack, viento: .8, decorado: [...cielo(), roca(400)], particulas: [{ tipo: 'cuervos', n: 4, zona: [0, 70, 1280, 260] }],
      actores: [{ p: conBandera, x: 380, y: -55, mira: 1, acciones: [{ hace: 'brazos', h: 2.75, c: .1, en: 0, hasta: 999, entra: .01 }] }, ...publico],
      camara: [[0, 640, 380, 1]] },
    { desde: en['b19.3'] - .1, transicion: 'pajaros', ...jack, viento: .8, decorado: [...cielo(), roca(1180, 640, 1.6)],
      actores: [0, 1, 2, 3, 4, 5].map(i => ({ p: ciudadano(i + 40, { escala: .9 }), x: 120 + i * 150, mira: 1,
        acciones: i % 2 ? [{ hace: 'puno', en: en['b19.3'] + .4 + i * .2, hasta: en.b20 - .2, entra: .1 }] : [{ hace: 'asiente', en: en['b19.3'] + .6 + i * .2, hasta: en.b20 - .4 }] })),
      camara: [[0, 640, 380, 1.05]] },
    { desde: en.b20 - .2, transicion: 'viento', ...jack, viento: .3, decorado: calle, camara: [[0, 640, 360, .95], [en['b20.3'] - .1, 640, 360, .95], [en['b20.3'] - .1, 900, 340, 1.4]],
      actores: [...[0, 1, 2, 3, 4].map(i => ({ p: ciudadano(80 + i, { escala: .95 }), x: 110 + i * 150, mira: 1, vista: 'frente',
        acciones: [{ hace: i % 2 ? 'asiente' : 'saluda', en: en['b20.2'] + .3 * i, hasta: en['b20.2'] + 2 + .3 * i }] })),
        { p: DE, x: 1000, mira: -1, acciones: [{ hace: 'asiente', en: en['b20.3'] + .5, hasta: en['b20.3'] + 1.6 }, { hace: 'senala', en: en['b20.3'] + 1.8, hasta: en.b21 }] }] },
    { desde: en.b21 - .2, transicion: 'tinta', ...jack, viento: .6, decorado: [...cielo()],
      actores: [{ p: AC, x: 640, vista: 'frente', acciones: [{ hace: 'habla', en: en.f2, hasta: en.f2 + 3.4 }, { hace: 'encoge', en: en.f2 + 2, hasta: en.f2 + 3.8, entra: .12 }] }],
      camara: [[0, 640, 290, 2], [G.fin, 640, 285, 2.15]] },
  ],
};
