// Españistán ep. 5 · secuencia B, «La resta» (bloques 2–6). Estilo `jack`, 30 fps. Tiempos: tiempos-05.js (estimados hasta que exista la voz).
// Datos: 05-vivienda.md (Banco de España, Informe Anual 2025: ≈ 240.000 hogares y ≈ 92.000 casas en 2025; déficit ≈ 750.000 en 2021-2025;
// 2.355 €/m², valor tasado, 2.º trimestre de 2026, Ministerio de Vivienda).
//   b2      pergamino de mapa de guerra; dos columnas vacías. «doscientos cuarenta mil» → la columna HOGARES se llena de personitas; llega gente por los lados.
//   b3      «noventa y dos mil» → la de CASAS se para a media altura; golpe y el hueco se pinta de rojo, latiendo.
//   b4      calma; «Banco de España» → sello; «setecientas cincuenta mil» → el hueco se abre en el suelo como una grieta, de lado a lado.
//   b5      corte seco a la cola ante un portal (SE ALQUILA): Lucía y Dani esperan; «quien más paga» → uno con maletín pasa delante y la llave vuela a su mano.
//   b6      «récord» → la cifra corre hasta 2.355 €/m² y cae el sello RÉCORD. b6.2 «tres ciudades» → el mapa, tres chinchetas.
const G = T.guion([2, 3, 4, 5, 6]), en = G.en;
const LU = PERSONAJES.lucia, DA = PERSONAJES.dani;
const jack = { jack: true, quieto: true, figura: '#2b2522', sombra: 9, contraluz: 0, bordes: ['rgb(255,226,190)', 'rgb(255,120,70)'], borde: .7 };
// palabras clave (a ojo, a 14 letras/s; G.x las pasa al segundo real)
const HOGARES = G.x('b2.2', 2.1), CASAS = G.x('b3', 1.5), BANCO = G.x('b4', 2.3), FALTAN = G.x('b4', 5.2), SUBASTAN = G.x('b5', 2.9), PAGA = G.x('b5', 4.8),
  RECORD = G.x('b6', 2), CIUDADES = G.x('b6.2', 2.3);
const pergamino = [{ tipo: 'plano', color: '#9c5a26', raya: 'rgba(60,25,8,.25)', luz: 'rgba(255,200,120,.12)', par: .2 }, { tipo: 'penumbra', a: .7, r: 620, par: 1 }];
// gente diminuta que llega por los dos lados hacia la columna de los hogares, sin parar
const llegan = [0, 1, 2, 3, 4, 5, 6, 7].map(i => { const izq = i % 2 === 0, x0 = izq ? -80 - 70 * i : 1360 + 70 * i, t0 = HOGARES - 1.2 + .45 * i;
  return { p: ciudadano(200 + i, { escala: .3 }), x: x0, mira: izq ? 1 : -1, desde: t0 - .2, acciones: [{ hace: 'camina', en: t0, hasta: t0 + 3.4, a: izq ? 380 + 12 * i : 900 - 12 * i }] }; });
const cola = [0, 1, 2, 3, 4, 5].map(i => ({ p: ciudadano(220 + i, { escala: .62 }), x: 470 + i * 120, mira: -1, acciones: [{ hace: 'inclina', en: SUBASTAN + .3 * i, hasta: SUBASTAN + 1 + .3 * i, g: .4 }] }));
window.ESCENA = {
  dura: G.fin, fps: 30, suelo: 600, voces: G.voces,
  silencios: [[CASAS - .5, CASAS], [BANCO - .6, BANCO]],
  sonidos: [
    { en: 0, hasta: en.b5, archivo: 'audio/sfx/dron.mp3', volumen: .2, bucle: true },
    { en: HOGARES - .8, archivo: 'audio/sfx/grada.mp3', volumen: .12 },
    { en: CASAS, archivo: 'audio/sfx/impacto.mp3', volumen: .20 },
    { en: BANCO, archivo: 'audio/sfx/impacto.mp3', volumen: .16 },
    { en: FALTAN, archivo: 'audio/sfx/terremoto.mp3', volumen: .45 }, { en: FALTAN + .2, archivo: 'audio/sfx/derrumbe.mp3', volumen: .12 },
    { en: en.b5, hasta: en.b6, archivo: 'audio/sfx/ciudad.mp3', volumen: .2, bucle: true },
    { en: PAGA, archivo: 'audio/sfx/whoosh.mp3', volumen: .35 },
    { en: RECORD + 1.4, archivo: 'audio/sfx/impacto.mp3', volumen: .22 }, { en: CIUDADES, archivo: 'audio/sfx/riser.mp3', volumen: .25 }],
  carteles: [
    { en: en.b5 + .3, hasta: en.b6 - .2, x: 40, y: 40, ancho: 380, titulo: 'Se alquila', filas: [['Piso de 60 m²', '1.200 €/mes', '#7a1410']], fuente: 'Ejemplo' },
  ],
  planos: [
    { desde: 0, ...jack, viento: .15, decorado: [...pergamino, { tipo: 'suelo', par: 1, matas: 0 }],
      delante: [{ tipo: 'columnas', x: 640, y: 560, max: 400, hogares: [[HOGARES - .4, 0], [HOGARES + 1.4, .95]], casas: [[CASAS - 1, 0], [CASAS, .36]],
          hueco: CASAS + .1, grieta: FALTAN, faltan: 'FALTAN', cifras: [[HOGARES + 1.2, -1, '240.000'], [CASAS, 1, '92.000']] },
        { tipo: 'sello', en: BANCO, x: 1060, y: 190, texto: 'BANCO\nDE ESPAÑA', ancho: 380, escala: .75, giro: .06 },
        { tipo: 'contador', en: FALTAN + .3, x: 640, y: 680, a: 750000, tam: 62, color: '#ffb59a', rotulo: 'viviendas que faltan desde 2021 · Banco de España', dura: 1.8 }],
      actores: llegan,
      camara: [[0, 640, 380, 1.15], [HOGARES, 640, 360, 1], [CASAS - .3, 640, 360, 1], [CASAS, 760, 330, 1.12], [BANCO - .3, 700, 340, 1.05], [FALTAN, 640, 400, .95], [en.b5, 640, 420, .92]] },
    { desde: en.b5, ...jack, viento: .2, decorado: [{ tipo: 'plano', color: '#c8611f', raya: 'rgba(90,30,10,.25)', luz: 'rgba(255,200,120,.18)', par: .2 },
        { tipo: 'rascacielos', tono: .5, n: 10, par: .4 }, { tipo: 'casa', x: 330, escala: 1.1, pintada: '1.200 €', par: 1 }, { tipo: 'suelo', par: 1, matas: 0 }],
      delante: [{ tipo: 'llave', x: 330, y: 300, en: en.b5, vuela: [PAGA + .5, 360, 360], escala: .8 }],
      actores: [{ p: { ...LU, escala: .62 }, x: 470, mira: -1, acciones: [{ hace: 'gira', en: PAGA + .8 }, { hace: 'encoge', en: PAGA + 1.4, hasta: G.fin }] },
        { p: { ...DA, escala: .62 }, x: 560, mira: -1, acciones: [{ hace: 'niega', en: PAGA + 1, hasta: PAGA + 2.2 }] },
        ...cola.map(c => ({ ...c, x: c.x + 200 })),
        { p: { ...ciudadano(240, { escala: .66 }), objeto: 'papel' }, x: 1400, mira: -1, desde: SUBASTAN, acciones: [{ hace: 'camina', en: SUBASTAN + .2, hasta: PAGA + .3, a: 380 }, { hace: 'recibe', en: PAGA + .5, hasta: PAGA + 1.6 }] }],
      camara: [[en.b5, 700, 380, 1.1], [PAGA, 520, 380, 1.18], [en.b6, 440, 370, 1.3]] },
    { desde: en.b6, ...jack, viento: .1, decorado: [...pergamino],
      delante: [{ tipo: 'contador', en: RECORD - .2, x: 640, y: 300, a: 2355, despues: ' €/m²', tam: 96, rotulo: 'precio de la vivienda · máximo desde 1995', dura: 1.6, hasta: en['b6.2'] },
        { tipo: 'sello', en: RECORD + 1.4, x: 640, y: 470, texto: 'RÉCORD', ancho: 320, escala: .8 }],
      camara: [[en.b6, 640, 360, 1.15], [RECORD + 1.4, 640, 360, 1.08], [en['b6.2'], 640, 360, 1.02]] },
    { desde: en['b6.2'] - .05, ...jack, decorado: [...pergamino],
      delante: [{ tipo: 'mapa05', x: 700, y: 330, ancho: 620, puntos: [[CIUDADES - .3, .1, 1.02, 'TENERIFE'], [CIUDADES, .47, .47, 'MADRID'], [CIUDADES + .3, .9, .3, 'BARCELONA']] }],
      camara: [[en['b6.2'] - .05, 680, 360, 1.12], [CIUDADES, 680, 380, 1], [G.fin, 640, 400, .95]] },
  ],
};
