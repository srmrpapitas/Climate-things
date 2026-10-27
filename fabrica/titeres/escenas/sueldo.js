// Españistán · «El sueldo» (≈ 32 s): Acascar defiende su sueldo ante la gente; la gente protesta; el narrador cuenta los datos reales.
// Datos (ep. 3, Maldita.es y Comunidad de Madrid vía transparencia): 2011–2013, 82.491 €/año + 11.363 € de plus;
// presidente del Gobierno, 78.185 €/año. Era legal: cargo de libre designación pagado con dinero público.
// Las voces: audio/voz/es/sueldo/NN_quien.mp3 (si aún no existen, el vídeo sale mudo con subtítulos). `dura` = segundos de cada frase.
const V = 'audio/voz/es/sueldo/';
const voces = [
  { en: .4, dura: 4.6, quien: 'narrador', texto: 'Madrid, hace más de diez años. Acascar dirige una fundación pública.', archivo: V + '01_narrador.mp3' },
  { en: 5.9, dura: 3.2, quien: 'Acascar', texto: '¿Mi sueldo? Mi sueldo es mío. Me lo he ganado yo.', archivo: V + '02_acascar.mp3' },
  { en: 9.6, dura: 2.3, quien: 'Vecina', texto: '¡Ese sueldo sale de nuestro dinero!', archivo: V + '03_vecina.mp3' },
  { en: 12.2, dura: 2.1, quien: 'Vecino', texto: '¡Y cobra más que el presidente!', archivo: V + '04_vecino.mp3' },
  { en: 14.7, dura: 2.1, quien: 'Acascar', texto: 'Bueno... es vocación.', archivo: V + '05_acascar.mp3' },
  { en: 17.4, dura: 4.6, quien: 'narrador', texto: 'Los datos. Cobraba unos ochenta y dos mil euros al año, más un plus.', archivo: V + '06_narrador.mp3' },
  { en: 22.6, dura: 3.4, quien: 'narrador', texto: 'El presidente del Gobierno, unos setenta y ocho mil.', archivo: V + '07_narrador.mp3' },
  { en: 26.6, dura: 4.8, quien: 'narrador', texto: 'Era legal: un cargo de libre designación. Pero salía del dinero público.', archivo: V + '08_narrador.mp3' },
];
const H = (i, a, b) => ({ hace: 'habla', en: voces[i].en + (a || 0), hasta: voces[i].en + voces[i].dura + (b || 0) });
const cielo = [
  { tipo: 'astro', x: 980, y: 190, r: 60, par: .15 },
  { tipo: 'nubes', tono: .75, par: .2, n: 4 },
  { tipo: 'montes', tono: .8, par: .25, y: 470 },
  { tipo: 'ciudad', tono: .55, par: .45, y: 545 },
];
const aire = [{ tipo: 'pajaros', n: 7, zona: [0, 60, 1280, 260] }, { tipo: 'hojas', n: 6, zona: [0, 200, 1280, 560] }];
const plaza = [...cielo,
  { tipo: 'arbol', x: 40, tono: .3, escala: 1.1, par: .8 }, { tipo: 'arbol', x: 1240, tono: .3, escala: 1.2, par: .8, s: 9 },
  { tipo: 'farola', x: 560, par: 1 }, { tipo: 'bandera', x: 1060, par: 1, alto: 340, ancho: 150, tela: 95 }, { tipo: 'suelo', par: 1 }];
// las dos personas que hablan del público (siempre las mismas): una vecina y un vecino con gorra
const vecina = ciudadano(5, { ropa: 'vestido', pelo: 'mono', barba: null, sombrero: null, gafas: null, alto: .96, grueso: .95 });
const vecino = ciudadano(8, { ropa: 'traje', pelo: 'corto', sombrero: 'gorra', barba: 'bigote', alto: 1.02, grueso: 1.1, barriga: .5 });
const fila = (escala, tono, quitar = []) => [0, 1, 2, 3, 4, 5, 6, 7].filter(i => !quitar.includes(i)).map(i => ({ p: ciudadano(i + 20, { escala, tono }), x: 90 + i * 112 + 24 * T.azar(i), vista: 'frente' }));
window.ESCENA = {
  dura: 32, fps: 12, suelo: 600, voces,
  carteles: [{ en: 17.6, hasta: 31.4, titulo: 'Sueldo al año (2011–2013)', x: 640, y: 60, ancho: 600, paso: 5,
    filas: [['Acascar', '82.491 € + plus'], ['Presidente del Gobierno', '78.185 €', '#2c4a1a'], ['¿Ilegal?', 'No: libre designación', '#3a2410']],
    fuente: 'Comunidad de Madrid (transparencia) · Maldita.es' }],
  planos: [
    // 1 · general: la plaza; Acascar en el atril y la gente mirando
    { desde: 0, viento: .25, decorado: plaza, delante: [{ tipo: 'atril', x: 900 }], luces: [[560, 314]], particulas: aire,
      actores: [
        ...[0, 1, 2, 3, 4, 5].map(i => ({ p: ciudadano(i + 20, { escala: .8, tono: .82 }), x: 110 + i * 64, mira: 1, acciones: [{ hace: 'asiente', en: 2 + i * .4, hasta: 3 + i * .4 }] })),
        { p: PERSONAJES.acascar, x: 960, mira: -1, acciones: [{ hace: 'saluda', en: 1.2, hasta: 3.2 }, { hace: 'asiente', en: 3.6, hasta: 4.6 }] }],
      camara: [[0, 640, 380, 1.0], [5.8, 760, 380, 1.18]] },
    // 2 · primer plano de frente: «mi sueldo es mío»
    { desde: 5.8, viento: .35, decorado: [...cielo, { tipo: 'bandera', x: 860, par: .9, alto: 420, ancho: 170, tela: 110 }, { tipo: 'suelo', par: 1 }], delante: [{ tipo: 'atril', x: 640 }], particulas: aire,
      actores: [{ p: PERSONAJES.acascar, x: 640, vista: 'frente', acciones: [H(1), { hace: 'golpea', en: 6.3, hasta: 7.6 }, { hace: 'puno', en: 7.8, hasta: 9.4 }] }],
      camara: [[5.8, 640, 300, 2.2], [9.4, 640, 290, 2.45]] },
    // 3 · desde la espalda de Acascar: la vecina se adelanta y le grita
    { desde: 9.4, transicion: 'viento', tinte: 'rojo', viento: .8, decorado: [...cielo, { tipo: 'farola', x: 200, par: .9 }, { tipo: 'farola', x: 980, par: .9 }, { tipo: 'suelo', par: 1, y: 560 }], luces: [[200, 288], [980, 288]], particulas: aire,
      actores: [
        ...fila(.62, .78, [3]).map((a, k) => Object.assign(a, { acciones: [{ hace: k % 2 ? 'niega' : 'asiente', en: 10 + k * .15, hasta: 11.6 + k * .1 }] })),
        { p: Object.assign({}, vecina, { escala: .7 }), x: 430, vista: 'frente', acciones: [{ hace: 'acerca', en: 9.5, hasta: 10.3, a: 1.35 }, H(2), { hace: 'senala', en: 9.9, hasta: 11.9 }] },
        { p: PERSONAJES.acascar, x: 1020, vista: 'espalda', z: 1.75, acciones: [{ hace: 'encoge', en: 10.6, hasta: 12 }] }],
      camara: [[9.4, 640, 380, 1.05], [12, 560, 360, 1.25]] },
    // 4 · plano medio del público: el vecino de la gorra
    { desde: 12, tinte: 'rojo', viento: .7, decorado: [...cielo, { tipo: 'farola', x: 980, par: .9 }, { tipo: 'suelo', par: 1, y: 560 }], luces: [[980, 288]], particulas: aire,
      actores: [
        ...fila(.7, .7, [2, 3]).map((a, k) => Object.assign(a, { acciones: [{ hace: k % 3 ? 'asiente' : 'aplaude', en: 13.2 + k * .1, hasta: 14.5 }] })),
        { p: Object.assign({}, vecino, { escala: 1.05 }), x: 400, vista: 'frente', acciones: [H(3), { hace: 'puno', en: 12.3, hasta: 14.4 }] }],
      camara: [[12, 420, 330, 1.8], [14.5, 410, 320, 1.95]] },
    // 5 · primer plano de frente: «bueno... es vocación»
    { desde: 14.5, transicion: 'viento', viento: .4, decorado: [...cielo, { tipo: 'bandera', x: 860, par: .9, alto: 420, ancho: 170, tela: 110 }, { tipo: 'suelo', par: 1 }], delante: [{ tipo: 'atril', x: 640 }], particulas: aire,
      actores: [{ p: PERSONAJES.acascar, x: 640, vista: 'frente', acciones: [H(4), { hace: 'encoge', en: 14.8, hasta: 17 }] }],
      camara: [[14.5, 640, 290, 2.5], [17.2, 640, 290, 2.3]] },
    // 6 · los datos: el Decano llega con su candil, mira los dos sacos de dinero y señala
    { desde: 17.2, transicion: 'viento', viento: .55, decorado: [...plaza.slice(0, 6), { tipo: 'farola', x: 560, par: 1 }, { tipo: 'suelo', par: 1 },
        { tipo: 'saco', x: 760, escala: 1.15, crece: .25, en: 18.5 }, { tipo: 'saco', x: 900, escala: .95, crece: .1, en: 23 }], luces: [[560, 314]], particulas: aire,
      actores: [
        { p: PERSONAJES.decano, x: -150, mira: 1, acciones: [{ hace: 'camina', en: 17.3, hasta: 20, a: 520 }, { hace: 'senala', en: 20.4, hasta: 22.4 }, { hace: 'asiente', en: 23, hasta: 24 },
          { hace: 'piensa', en: 26.6, hasta: 29.6 }, { hace: 'encoge', en: 29.8, hasta: 31.6 }] }],
      camara: [[17.2, 520, 400, 1.15], [21, 640, 380, 1.2], [32, 600, 380, 1.3]] },
  ],
};
