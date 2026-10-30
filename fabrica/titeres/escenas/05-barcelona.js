// Españistán ep. 5 · secuencia E, «Barcelona» (bloques 19–25). Estilo `jack`, 30 fps. Tiempos: tiempos-05.js (estimados hasta que exista la voz).
// Datos: 05-vivienda.md (Casa Orsola: Lioness Inversiones, 2021, ≈ 5,4 M€; Ayuntamiento + Hàbitat3, 2025, 9,2 M€; 26 pisos.
// Tope en Cataluña: contratos −1,3 % (Agència de l'Habitatge), anuncios −20,5 % (Fedea). Barcelona: ≈ 10.000 licencias turísticas, noviembre de 2028).
//   entrada  PANEO desde Madrid (la calle de las grúas) hasta el Eixample de noche.
//   b19      la fachada modernista: CASA ORSOLA. «un fondo» → baja una mano gigante con gemelos de oro; «Casa Orsola» → la coge y la levanta con los vecinos dentro.
//   b20      «no renovar» → se apagan ventanas; «por temporadas» → los vecinos salen con sus cajas; Josep se queda.
//   b21      de noche, la calle llena de gente sentada con mantas; la cámara sube por encima. Pancartas en los balcones.
//   b22      «compraron» → sello COMPRADO · 9,2 M€; b22.2 «el doble» → nota 5,4 frente a 9,2.
//   b23      «parche caro» → la hucha se vacía. b23.2 «tope» → la olla; b23.3 «anuncios» → hierve y se escapan los carteles ALQUILER DE TEMPORADA.
//   b24      «diez mil pisos turísticos» → el mapa de la ciudad lleno de maletas, que se apagan de golpe.
//   b25      la resta: «ni una casa más» → el hueco no se mueve.
const G = T.guion([19, 20, 21, 22, 23, 24, 25], { desde: 1.2 }), en = G.en;
const jack = { jack: true, quieto: true, figura: '#2b2522', sombra: 9, contraluz: 0, bordes: ['rgb(170,200,255)', 'rgb(255,160,90)'], borde: .7 };
// palabras clave (a ojo, a 14 letras/s; G.x las pasa al segundo real)
const PANEO = .9, FONDO = G.x('b19', 2.9), ORSOLA = G.x('b19', 4.2), RENOVAR = G.x('b20', 1.5), TEMPORADAS = G.x('b20', 4.3), CIENTOS = G.x('b21', 3), FRENAR = G.x('b21', 5.6),
  COMPRARON = G.x('b22', 4), DOBLE = G.x('b22.2', 3.6), PARCHE = G.x('b23', 1.2), TOPE = G.x('b23.2', 2.4), ANUNCIOS = G.x('b23.3', 1), LICENCIAS = G.x('b24', 3.4), DIEZMIL = G.x('b24', 4.6),
  NIUNA = G.x('b25', 4.8);
const nota = (en0, hasta, titulo, filas, fuente, x = 40) => ({ en: en0, hasta, x, y: 40, ancho: 480, titulo, filas, fuente });
const noche = { tipo: 'plano', color: '#1d2a48', raya: 'rgba(5,10,25,.3)', luz: 'rgba(140,170,255,.1)', par: .2 };
const eixample = [noche, { tipo: 'astro', x: 1080, y: 120, r: 36, luna: true, par: .2 }, { tipo: 'ciudad', tono: .55, par: .35, y: 560, s: 9 },
  { tipo: 'farola', x: 150, par: 1 }, { tipo: 'farola', x: 1130, par: 1 }, { tipo: 'suelo', par: 1, matas: 0 }];
const vecinos = [0, 1, 2, 3].map(i => ({ p: { ...ciudadano(320 + i, { escala: .5 }), objeto: 'papel' }, x: 640, mira: i % 2 ? 1 : -1, desde: TEMPORADAS + .5 * i,
  acciones: [{ hace: 'camina', en: TEMPORADAS + .5 * i, hasta: TEMPORADAS + 3.5 + .5 * i, a: i % 2 ? 1400 : -120 }] }));
const sentados = Array.from({ length: 16 }, (_, i) => ({ p: ciudadano(340 + i, { escala: .4 + .05 * (i % 3) }), x: 60 + i * 76 + 14 * T.azar(i), mira: i % 2 ? -1 : 1, y: 8,
  acciones: [{ hace: 'agacha', en: -1, hasta: 99, g: .9 }, ...(i % 4 === 0 ? [{ hace: 'aplaude', en: FRENAR + .1 * i, hasta: FRENAR + 2 }] : [])] }));
// diez mil pisos turísticos: una cuadrícula de maletas sobre el plano del Eixample que se apagan todas a la vez
const maletas = Array.from({ length: 48 }, (_, i) => ({ tipo: 'maleta', x: 156 + (i % 12) * 88, y: 280 + Math.floor(i / 12) * 88, escala: .45, color: '#d9a53a',
  desde: en.b24 + .03 * i, hasta: DIEZMIL + .02 * (i % 7) }));
window.ESCENA = {
  dura: G.fin, fps: 30, suelo: 600, voces: G.voces,
  silencios: [[ORSOLA - .5, ORSOLA], [DIEZMIL - .6, DIEZMIL]],
  sonidos: [
    { en: PANEO - .5, archivo: 'audio/sfx/whoosh.mp3', volumen: .45 },
    { en: PANEO, hasta: en.b21, archivo: 'audio/sfx/ciudad.mp3', volumen: .22, bucle: true },
    { en: FONDO, archivo: 'audio/sfx/riser.mp3', volumen: .25 }, { en: ORSOLA + .7, archivo: 'audio/sfx/impacto.mp3', volumen: .20 },
    { en: en.b21, hasta: en.b23, archivo: 'audio/sfx/grada.mp3', volumen: .22, bucle: true },
    { en: COMPRARON, archivo: 'audio/sfx/impacto.mp3', volumen: .20 }, { en: PARCHE, archivo: 'audio/sfx/campana.mp3', volumen: .12 },
    { en: ANUNCIOS, archivo: 'audio/sfx/helado.mp3', volumen: .15 }, { en: DIEZMIL, archivo: 'audio/sfx/impacto.mp3', volumen: .22 },
    { en: en.b25, hasta: G.fin, archivo: 'audio/sfx/dron.mp3', volumen: .18, bucle: true }],
  carteles: [
    nota(ORSOLA + 1, en.b20 + 2, 'Casa Orsola · Eixample', [['26 pisos con', 'vecinos dentro'], ['Comprada en 2021 por', 'un fondo', '#7a1410']], 'Newtral · idealista'),
    nota(TEMPORADAS + 1, en.b21 - .2, 'Josep, vecino', [['Primer desahucio', 'aplazado', '#7a1410']], '31-1-2025 · prensa', 770),
    nota(DOBLE - .2, en.b23 - .2, 'Lo que costó', [['El fondo, en 2021', '≈ 5,4 M€'], ['Ayuntamiento y Hàbitat3, 2025', '9,2 M€', '#7a1410']], 'idealista · VilaWeb'),
    nota(ANUNCIOS + .3, en.b24 - .2, 'El tope en Cataluña', [['Precio de los contratos', '−1,3 %'], ['Anuncios de alquiler', '−20,5 %', '#7a1410']], "Agència de l'Habitatge · Fedea", 770),
    nota(DIEZMIL + .5, en.b25 - .2, 'Barcelona, noviembre de 2028', [['Licencias de pisos turísticos', '≈ 10.000 fuera', '#7a1410']], 'Ayuntamiento de Barcelona'),
  ],
  planos: [
    // de dónde venimos (la calle de Madrid), para que el paneo arranque desde allí
    { desde: 0, ...jack, decorado: [{ tipo: 'plano', color: '#4a2f5c', raya: 'rgba(25,10,40,.3)', luz: 'rgba(255,160,200,.12)', par: .2 }, { tipo: 'rascacielos', tono: .45, n: 13, par: .45 },
        { tipo: 'grua', x: 230, alto: 430, escala: .9, tono: .3, luz: true, arranca: -5, par: .6 }, { tipo: 'suelo', par: 1, matas: 0 }],
      camara: [[0, 640, 420, 1], [PANEO, 700, 420, 1]] },
    { desde: PANEO, transicion: 'paneo', ...jack, viento: .2, franjas: true, decorado: eixample,
      delante: [{ tipo: 'fachada', x: 640, y: 600, rotulo: 'CASA ORSOLA', mano: FONDO, pancartas: [[CIENTOS, 1, 0, 'NOS QUEDAMOS'], [CIENTOS + .4, 2, 3, 'ORSOLA SE QUEDA']] }],
      actores: [...vecinos, { p: ciudadano(330, { escala: .5 }), x: 760, mira: -1, desde: TEMPORADAS, acciones: [{ hace: 'niega', en: TEMPORADAS + 1, hasta: TEMPORADAS + 2.5 }] }],
      camara: [[PANEO, 640, 300, 1.4], [PANEO + 2.4, 640, 320, 1], [ORSOLA + .5, 640, 260, .92], [RENOVAR, 640, 330, 1.05], [TEMPORADAS, 640, 470, 1.25], [en.b21, 640, 450, 1.15]] },
    { desde: en.b21, ...jack, viento: .15, decorado: [...eixample.slice(0, 3), { tipo: 'suelo', par: 1, matas: 0 }],
      delante: [{ tipo: 'fachada', x: 640, y: 600, rotulo: 'CASA ORSOLA', pancartas: [[-1, 1, 0, 'NOS QUEDAMOS'], [-1, 2, 3, 'ORSOLA SE QUEDA'], [FRENAR, 3, 1, 'NO AL DESAHUCIO']] }],
      actores: sentados, particulas: [{ tipo: 'estrellas', n: 30, zona: [0, 0, 1280, 220] }],
      camara: [[en.b21, 640, 560, 1.4], [CIENTOS, 640, 470, 1.05], [FRENAR, 640, 360, .9], [en.b22, 640, 360, .9]] },
    { desde: en.b22, ...jack, viento: .1, decorado: [...eixample.slice(0, 3), { tipo: 'suelo', par: 1, matas: 0 }],
      delante: [{ tipo: 'fachada', x: 640, y: 600, rotulo: 'CASA ORSOLA', pancartas: [[-1, 1, 0, 'NOS QUEDAMOS']] },
        { tipo: 'sello', en: COMPRARON, x: 640, y: 340, texto: 'COMPRADO\n9,2 M€', ancho: 380, escala: .85 }],
      camara: [[en.b22, 640, 360, 1], [COMPRARON, 640, 340, 1.08], [en.b23, 640, 350, 1.04]] },
    { desde: en.b23, ...jack, viento: .1, decorado: [noche, { tipo: 'ciudad', tono: .55, par: .35, y: 560, s: 9 }, { tipo: 'suelo', par: 1, matas: 0 }],
      delante: [{ tipo: 'huchaGrande', x: 640, y: 600, texto: 'BARCELONA', vacia: PARCHE, escala: .9, hasta: en['b23.2'] },
        { tipo: 'olla', x: 640, y: 600, en: en['b23.2'], texto: 'TOPE', hierve: ANUNCIOS, carteles: ['ALQUILER DE TEMPORADA', 'POR MESES', 'TEMPORADA', 'HABITACIONES'] }],
      camara: [[en.b23, 640, 400, 1.1], [en['b23.2'], 640, 380, 1.05], [ANUNCIOS, 640, 320, .95], [en.b24, 640, 320, .95]] },
    { desde: en.b24, ...jack, viento: .1, decorado: [noche, { tipo: 'manzanas', x: 640, y: 390, n: 12, m: 4, lado: 88, tono: .55, par: 1 }, ...maletas],
      camara: [[en.b24, 640, 400, 1.15], [DIEZMIL, 640, 380, 1.02], [en.b25, 640, 380, 1]] },
    { desde: en.b25, ...jack, viento: .1, decorado: [noche, { tipo: 'ciudad', tono: .55, par: .35, y: 560, s: 9 }, { tipo: 'suelo', par: 1, matas: 0 }],
      delante: [{ tipo: 'columnas', x: 640, y: 540, max: 300, escala: .9, sep: 120, ancho: 140, panel: true, hogares: [[0, .95]], casas: [[0, .4]], hueco: en.b25, faltan: 'IGUAL' }],
      camara: [[en.b25, 640, 380, 1.05], [NIUNA, 760, 330, 1.2], [G.fin, 760, 330, 1.25]] },
  ],
};
