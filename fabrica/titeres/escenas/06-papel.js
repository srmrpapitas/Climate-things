// Españistán ep. 6 · secuencia 7, «De papel» (bloques 24–26). `cartoon`, oficina de noche. Todo en un plano, sin cortar.
//   b24  la impresora escupe ÓRDENES DE EXPULSIÓN y se apilan en una montaña; el contador llega a 51.030.
//   b25  la cámara viaja a la puerta: de doce figuras solo salen dos; las barras 17 % contra 25 % de la UE.
//   b26  vuelve a la montaña: «Es de papel» → el viento se la lleva, hoja a hoja.
const G = T.guion([24, 25, 26]), en = G.en, k = G.k;
const cartoon = { cartoon: true, jack: true, figura: '#2b2235', sombra: 8, contraluz: 0, bordes: ['rgb(150,210,255)', 'rgb(255,150,90)'], borde: .8 };
const ORDENO = k(24, 'ordenó'), CINCUENTA = k(24, 'cincuenta'), SALIERON = k(25, 'Salieron'), DIECISIETE = k(25, 'diecisiete'), MEDIA = k(25, 'media europea'),
  DURA = k(26, 'dura'), PAPEL = k(26, 'de papel');
const nota = (en0, hasta, titulo, filas, fuente, x = 830) => ({ en: en0, hasta, x, y: 40, ancho: 420, titulo, filas, fuente });
const salen = [0, 1].map(i => ({ p: ciudadano(740 + i, { escala: .7 }), x: 1500 + i * 60, mira: 1, desde: SALIERON - .2, acciones: [{ hace: 'camina', en: SALIERON + .2 * i, hasta: SALIERON + 2.2, a: 1880 }], hasta: SALIERON + 2.3 }));
window.ESCENA = {
  dura: G.fin, fps: 30, suelo: 600, voces: G.voces,
  silencios: [[PAPEL - .6, PAPEL]],
  sonidos: [
    { en: ORDENO - .2, hasta: SALIERON, archivo: 'audio/sfx/eleven/teclas.mp3', volumen: .3, bucle: true }, { en: CINCUENTA + 1.2, archivo: 'audio/sfx/eleven/sello.mp3', volumen: .4 },
    { en: DIECISIETE, archivo: 'audio/sfx/eleven/pop.mp3', volumen: .4 }, { en: PAPEL, hasta: G.fin, archivo: 'audio/sfx/viento.mp3', volumen: .45, bucle: true },
    { en: PAPEL, archivo: 'audio/sfx/whoosh.mp3', volumen: .5 }],
  carteles: [nota(SALIERON + .2, PAPEL - .4, 'Expulsiones en 2024', [['Órdenes', '51.030'], ['Salidas', '8.725 · 17 %', '#7a1410'], ['Media de la UE', '≈ 25 %']], 'Eurostat')],
  planos: [
    { desde: 0, ...cartoon, viento: .1, decorado: [{ tipo: 'cieloNoche', arriba: '#0c0f24', abajo: '#2a2a50', n: 20, par: .2 }, { tipo: 'rascacielos', y: 600, tono: .3, n: 8, par: .5 }, { tipo: 'suelo', par: 1, matas: 0 }],
      delante: [{ tipo: 'impresora', x: 330, y: 600, en: ORDENO - .3, para: SALIERON, vuela: PAPEL, texto: 'ORDEN DE EXPULSIÓN' },
        { tipo: 'contador', en: CINCUENTA - .2, dura: 1.6, a: 51030, x: 640, y: 130, tam: 76, rotulo: 'ÓRDENES DE EXPULSIÓN', hasta: SALIERON + .5 },
        { tipo: 'figuras', aparece: SALIERON - .6, n: 10, x: 1320, y: 590, alto: 100, paso: 62 },
        { tipo: 'cancela', x: 1640, y: 600, texto: 'SALIDA', abre: [[SALIERON - .2, 1], [SALIERON + 2.3, 0]], ancho: 240, alto: 240 },
        { tipo: 'barras', en: DIECISIETE - .4, x: 2350, y: 580, alto: 260, sep: 200, barras: [['ESPAÑISTÁN', 17, '#c0392b', DIECISIETE], ['MEDIA UE', 25, '#7fb3e6', MEDIA]], max: 30 }],
      actores: salen,
      camara: [[0, 400, 380, 1.15], [CINCUENTA, 560, 360, 1], [SALIERON - .4, 1480, 380, 1.05], [DIECISIETE - .5, 1480, 380, 1.05], [DIECISIETE, 2350, 360, 1.05], [PAPEL - 1.2, 2350, 360, 1.05],
        [PAPEL - .3, 560, 360, 1], [G.fin, 900, 330, 1]] },
  ],
};
