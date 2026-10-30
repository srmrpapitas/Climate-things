// Españistán ep. 3 · acto 4, «El desierto» (≈ 24 s, sin voz todavía). Estilo `jack`. Datos: 03-abascal.md, bloques 3 y 4.
//   0–5      general: el desierto rojo; Acascar repta arrastrando la bandera. Cartel: europeas de 2014, cero escaños.
//   5–8,5    plano corto: los codos tiran, las rodillas empujan, la cara apretada.
//   8,5–13   la mesa de los que levantaron Vox: las sillas se vacían una a una (sin acusar a nadie de nada).
//   13–21    la roca: llega reptando, trepa con manos y pies, se pone de pie arriba y alza la bandera.
//   21–24    contrapicado: él y la bandera al viento. Cartel: Andalucía 2018, doce escaños (puente al acto 5).
const AC = PERSONAJES.acascar;
const jack = { jack: true, quieto: true, figura: '#3b3431', sombra: 9, contraluz: 0, bordes: ['rgb(255,226,190)', 'rgb(255,120,70)'], borde: .7 };
const cielo = (color = '#b11d18') => [{ tipo: 'plano', color, par: .3 }, { tipo: 'astro', x: 1010, y: 170, r: 46, par: .3 }];
const repta = (en, hasta, a, extra = []) => [{ hace: 'coge', que: 'arrastra', mano: 'lejos', en: 0 }, { hace: 'repta', en: 0, hasta, entra: .01 }, { hace: 'camina', en, hasta, a }, ...extra];
window.ESCENA = {
  dura: 24, fps: 30, suelo: 600,
  carteles: [
    { en: 1, hasta: 4.7, x: 40, y: 40, ancho: 470, titulo: '2014 · Elecciones europeas', filas: [['Escaños de Vox', '0']], fuente: 'Ministerio del Interior' },
    { en: 8.7, hasta: 12.8, x: 40, y: 40, ancho: 600, titulo: 'Los que levantaron Vox', paso: 1,
      filas: [['Alejo Vidal-Quadras', 'se va en 2015'], ['Macarena Olona', '2022'], ['Iván Espinosa de los Monteros', '2023']], fuente: 'Valencia Plaza · Newtral' },
    { en: 21.2, hasta: 23.8, x: 40, y: 40, ancho: 470, titulo: '2018 · Andalucía', filas: [['Escaños de Vox', '12']], fuente: 'Junta de Andalucía' }],
  planos: [
    { desde: 0, ...jack, viento: .9, decorado: [...cielo(), { tipo: 'pinchos', y: 700, escala: .8, par: 1 }, { tipo: 'suelo', par: 1, matas: 0 }],
      actores: [{ p: AC, x: -80, mira: 1, acciones: repta(0, 5, 480) }], camara: [[0, 640, 380, 1]] },
    { desde: 5, ...jack, viento: .9, decorado: [...cielo(), { tipo: 'suelo', par: 1, matas: 0 }],
      actores: [{ p: AC, x: 430, mira: 1, acciones: repta(5, 8.5, 820) }], camara: [[5, 640, 540, 2.6]] },
    { desde: 8.5, transicion: 'humo', ...jack, viento: .7, decorado: [...cielo('#8f1713'), { tipo: 'suelo', par: 1, matas: 0 },
        { tipo: 'mesa', x: 640, y: 600, par: 1, sillas: [{ en: 9.4 }, { en: 10.4 }, { en: 11.4 }, { en: -9 }] }],
      actores: [], camara: [[8.5, 640, 400, 1.05]] },
    { desde: 13, transicion: 'viento', ...jack, viento: .9, decorado: [...cielo(), { tipo: 'roca', x: 560, y: 640, escala: 1.5, par: 1 }, { tipo: 'pinchos', y: 705, escala: .6, par: 1 }, { tipo: 'suelo', par: 1, matas: 0 }],
      actores: [{ p: AC, x: 60, mira: 1, acciones: [{ hace: 'coge', que: 'arrastra', mano: 'lejos', en: 0 }, { hace: 'repta', en: 0, hasta: 15.7, entra: .01, sale: .3 },
        { hace: 'camina', en: 13, hasta: 15.5, a: 335 }, { hace: 'trepa', en: 15.6, hasta: 18.6, dx: 190, dy: -97, pasos: 5 },
        { hace: 'suelta', mano: 'lejos', en: 18.8 }, { hace: 'coge', que: 'bandera', mano: 'cerca', en: 18.8 }, { hace: 'brazos', h: 2.75, c: .1, en: 19, hasta: 99, entra: .12 }] }],
      camara: [[13, 600, 380, 1.1]] },
    { desde: 21, ...jack, viento: 1, decorado: [...cielo(), { tipo: 'roca', x: 560, y: 640, escala: 1.5, par: 1 }],
      actores: [{ p: Object.assign({}, AC, { objeto: 'bandera' }), x: 525, y: -97, mira: 1, acciones: [{ hace: 'brazos', h: 2.75, c: .1, en: 0, hasta: 99, entra: .01 }] }],
      camara: [[21, 560, 330, 1.9]] },
  ],
};
