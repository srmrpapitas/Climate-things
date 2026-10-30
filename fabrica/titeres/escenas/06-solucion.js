// Españistán ep. 6 · secuencia 10, «La solución» (bloques 40–46). `cartoon`, amanecer. Plan: CAPITULO-06-PLANOS.md.
//   b40  la puerta de una casa y una sola llave; Lucía, Dani y el recién llegado con su maleta delante. Pregunta del Decano.
//   b41  (sin cortar) la cámara sube al cielo: «Cuatro cosas» → salen las cuatro casillas 1 · 2 · 3 · 4.
//   b42  metamorfosis: el grifo con CASAS y MÉDICOS; el chorro solo sube si suben los dos; Canadá −21 %.
//   b43  (sin cortar) la cámara viaja a la cancela de SALIDA, que ahora funciona; las barras pasan del 17 % al 25 %.
//   b44  (viento) el aula: HOLA · KAIXO · BON DIA; Dinamarca, 7 de cada 10 trabajan; «repartir» → el mapa con puntos por todas partes.
//   b45  metamorfosis en hojas: la grúa, la casa y el centro de salud; cada uno con su llave.  b46 (sin cortar) el pacto: los cuatro firman.
const G = T.guion([40, 41, 42, 43, 44, 45, 46]), en = G.en, k = G.k, P = PERSONAJES;
const cartoon = { cartoon: true, jack: true, figura: '#2b2235', sombra: 8, contraluz: 0, bordes: ['rgb(150,210,255)', 'rgb(255,150,90)'], borde: .8 };
const PISO = k(40, 'piso'), INTEGRARSE = k(40, 'integrarse'), LOGICA = k(41, 'lógica'), DESORDEN = k(41, 'desorden'), CUATRO = k(41, 'Cuatro cosas'),
  UNO = en.b42, CASAS = k(42, 'casas y los médicos'), CANADA = k(42, 'Canadá'), DOS = en.b43, SALE = k(43, 'sale de verdad'), DIECISIETE = k(43, 'diecisiete'), MEDIA = k(43, 'media europea'),
  TRES = en.b44, DINAMARCA = k(44, 'Dinamarca'), SIETE = k(44, 'siete de cada diez'), REPARTIR = k(44, 'repartir'), CUATRO2 = en.b45, TODOS = k(45, 'para todos'), INTEGRA = k(45, 'se integra'),
  PACTO = k(46, 'pacto'), GOBIERNO = k(46, 'Gobierno');
const nota = (en0, hasta, titulo, filas, fuente, x = 830) => ({ en: en0, hasta, x, y: 40, ancho: 420, titulo, filas, fuente });
const alba = [{ tipo: 'cieloNoche', arriba: '#2a2a6a', abajo: '#f39a5a', n: 20, par: .2 }, { tipo: 'astro', x: 1050, y: 440, r: 70, par: .25 }];
const casilla = (n, x, en0) => ({ tipo: 'sello', en: en0, texto: String(n), x, y: -380, escala: .45, color: '#f0c46a', giro: 0 });
window.ESCENA = {
  dura: G.fin, fps: 30, suelo: 600, voces: G.voces,
  sonidos: [
    { en: 0, hasta: G.fin, archivo: 'audio/sfx/viento.mp3', volumen: .18, bucle: true }, { en: CUATRO, archivo: 'audio/sfx/eleven/pop.mp3', volumen: .4 },
    { en: UNO - 1.2, archivo: 'audio/sfx/whoosh.mp3', volumen: .35 }, { en: CASAS, archivo: 'audio/sfx/eleven/brillo.mp3', volumen: .4 }, { en: SALE, archivo: 'audio/sfx/eleven/tic.mp3', volumen: .45 },
    { en: TRES - .2, archivo: 'audio/sfx/whoosh.mp3', volumen: .35 }, { en: TRES, hasta: CUATRO2, archivo: 'audio/sfx/eleven/teclas.mp3', volumen: .12, bucle: true },
    { en: CUATRO2 - 1.2, archivo: 'audio/sfx/whoosh.mp3', volumen: .35 }, { en: PACTO, archivo: 'audio/sfx/eleven/sello.mp3', volumen: .5 }],
  carteles: [
    nota(CANADA, DOS - .3, 'Canadá, octubre de 2024', [['Objetivo de inmigración', '−21 %', '#7a1410'], ['Por qué', 'faltaban casas']], 'Bloomberg Línea'),
    nota(DIECISIETE, TRES - .3, 'Expulsiones que se cumplen', [['Españistán', '17 %'], ['Objetivo: media UE', '≈ 25 %', '#2e6b2e']], 'Eurostat'),
    nota(DINAMARCA, REPARTIR - .2, 'Dinamarca', [['Residencia permanente', 'idioma y trabajo'], ['Nacidos fuera de la UE que trabajan', '72 %', '#2e6b2e']], 'Eurostat · Fondapol'),
  ],
  planos: [
    { desde: 0, ...cartoon, viento: .2, decorado: [...alba, { tipo: 'suelo', par: 1, matas: 4 }],
      delante: [{ tipo: 'puertaCasa', x: 640, y: 600, rotulo: 'SE ALQUILA' }, { tipo: 'llave', x: 640, y: 180, en: PISO - .3 },
        { tipo: 'maleta', x: 1000, y: 600, escala: .9 }, { tipo: 'nombre', x: 960, y: 300, texto: 'el recién llegado', en: en.b40 + .4, hasta: PISO },
        casilla(1, 340, CUATRO), casilla(2, 540, CUATRO + .2), casilla(3, 740, CUATRO + .4), casilla(4, 940, CUATRO + .6)],
      actores: [{ p: P.lucia, x: 330, mira: 1, acciones: [{ hace: 'piensa', en: PISO, hasta: INTEGRARSE + 1 }] }, { p: P.dani, x: 430, mira: 1, acciones: [{ hace: 'senala', en: PISO - .2, hasta: PISO + 1.4 }] },
        { p: P.llegado, x: 900, mira: -1, acciones: [{ hace: 'encoge', en: INTEGRARSE - .2, hasta: INTEGRARSE + 1.4 }] }],
      camara: [[0, 640, 380, 1.1], [INTEGRARSE, 640, 380, 1], [LOGICA, 640, 360, 1], [DESORDEN, 640, -140, 1], [UNO, 640, -200, 1.05]] },
    { desde: UNO - .2, transicion: 'metamorfosis', ...cartoon, decorado: [{ tipo: 'cieloNoche', arriba: '#3d74b8', abajo: '#f7d79a', n: 0, par: .2 }, { tipo: 'suelo', par: 1, matas: 3 }],
      delante: [{ tipo: 'grifo', x: 480, y: 600, niveles: [[UNO + .3, .2, .3], [CASAS, .7, .75]] }, { tipo: 'letrero', enciende: UNO + .2, texto: '1 · ENTRA QUIEN SE PUEDE ACOGER', x: 640, y: 90, ancho: 760, tam: 30, apaga: DOS },
        { tipo: 'letrero', enciende: DOS + .2, texto: '2 · LA LEY SE CUMPLE', x: 1900, y: 90, ancho: 760, tam: 30 },
        { tipo: 'cancela', x: 1800, y: 600, texto: 'SALIDA', abre: [[SALE - .2, 1], [SALE + 1.6, 0]], ancho: 260, alto: 230 },
        { tipo: 'barras', en: DIECISIETE - .4, x: 2260, y: 560, alto: 260, sep: 170, max: 30, barras: [['HOY', 17, '#c0392b', DIECISIETE], ['OBJETIVO', 25, '#3fa34d', MEDIA]] }],
      actores: [0, 1].map(i => ({ p: ciudadano(800 + i, { escala: .75 }), x: 1640 + 60 * i, mira: 1, desde: SALE - .4, acciones: [{ hace: 'camina', en: SALE + .3 * i, hasta: SALE + 1.6, a: 2000 }], hasta: SALE + 1.7 })),
      camara: [[UNO, 560, 360, 1], [CANADA, 560, 360, 1.05], [DOS - .5, 600, 360, 1.05], [DOS + .5, 1900, 360, 1.05], [DIECISIETE, 2050, 360, 1], [TRES, 2100, 360, 1.05]] },
    { desde: TRES - .1, transicion: 'viento', ...cartoon, viento: .3, decorado: [...alba, { tipo: 'suelo', par: 1, matas: 0 }],
      delante: [{ tipo: 'pizarra', x: 640, y: 290, en: TRES + .3, lineas: ['HOLA · KAIXO', 'BON DIA · OLÁ'] }, { tipo: 'letrero', enciende: TRES + .2, texto: '3 · INTEGRAR EXIGIENDO', x: 640, y: 90, ancho: 760, tam: 30 },
        { tipo: 'figuras', aparece: DINAMARCA, n: 10, x: 1900, y: 560, alto: 110, paso: 80, encienden: [[SIETE, 7, '#3fa34d', 'DINAMARCA: 7 DE CADA 10 TRABAJAN']] },
        { tipo: 'mapa05', x: 3100, y: 360, ancho: 620, puntos: Array.from({ length: 14 }, (_, i) => [REPARTIR + .12 * i, .15 + .7 * T.azar(i + 30), .2 + .6 * T.azar(i + 50)]) }],
      actores: [0, 1, 2].map(i => ({ p: ciudadano(810 + i, { escala: .7 }), x: 450 + 190 * i, mira: 1, acciones: [{ hace: 'saluda', en: TRES + 1 + .3 * i, hasta: TRES + 2.6 + .3 * i }] })),
      camara: [[TRES, 640, 360, 1], [DINAMARCA - .5, 640, 360, 1], [DINAMARCA + .3, 1900, 360, 1], [REPARTIR - .4, 1900, 360, 1], [REPARTIR + .4, 3100, 360, 1], [CUATRO2, 3100, 360, 1.05]] },
    { desde: CUATRO2 - .2, transicion: 'metamorfosis', materia: 'hojas', ...cartoon, viento: .2, decorado: [...alba, { tipo: 'grua', x: 260, y: 600, alto: 420, arranca: CUATRO2, par: .8 }, { tipo: 'bloque', x: 560, y: 600, par: .8 },
        { tipo: 'casa', x: 900, escala: .8, par: .9, pintada: 'SALUD' }, { tipo: 'suelo', par: 1, matas: 3 }],
      delante: [{ tipo: 'letrero', enciende: CUATRO2 + .2, texto: '4 · CASAS Y SERVICIOS PARA TODOS', x: 640, y: 90, ancho: 760, tam: 30, apaga: PACTO - .4 },
        ...[0, 1, 2].map(i => ({ tipo: 'llave', x: 420 + 200 * i, y: 330, en: TODOS + .3 * i, escala: .7 })),
        { tipo: 'mesa', x: 1900, y: 600, ancho: 560 }, { tipo: 'sello', en: PACTO + .3, texto: 'PACTO DE ESTADO', x: 1900, y: 160, escala: .6 }],
      actores: [{ p: P.lucia, x: 420, mira: 1, acciones: [{ hace: 'celebra', en: TODOS + .3, hasta: INTEGRA }] }, { p: P.dani, x: 620, mira: -1, acciones: [{ hace: 'celebra', en: TODOS + .5, hasta: INTEGRA }] },
        { p: P.llegado, x: 820, mira: -1, acciones: [{ hace: 'celebra', en: TODOS + .7, hasta: INTEGRA }] },
        ...[P.sanchis, P.feijolo, ciudadano(820)].map((p, i) => ({ p, x: 1720 + 180 * i, mira: i < 1 ? 1 : -1, acciones: [{ hace: 'mano', en: PACTO + .3, hasta: PACTO + 2 }] })),
        { p: P.acascar, x: 2260, mira: -1, acciones: [{ hace: 'mano', en: PACTO + .3, hasta: GOBIERNO - .2 }, { hace: 'camina', en: GOBIERNO - .1, hasta: GOBIERNO + 1, a: 2420 }, { hace: 'sorprende', en: GOBIERNO + 1.1, hasta: G.fin }] }],
      camara: [[CUATRO2, 640, 360, 1.02], [TODOS + .3, 620, 380, 1.1], [PACTO - .6, 640, 360, 1.05], [PACTO, 1980, 360, 1.05], [G.fin, 2260, 380, 1.2]] },
  ],
};
