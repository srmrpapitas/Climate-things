// Españistán ep. 5 · secuencia G, «Treinta años de grúa» (bloques 33–43 y frases f1, f2). Estilo `jack`, 30 fps. Tiempos: tiempos-05.js (estimados hasta que exista la voz).
// Sin la noria del ep. 4 (el usuario: no copiarla). La imagen es la del guion: las dos familias «turnándose la grúa». Una grúa gigante cuya cabina cambia
// de azul a rojo con cada presidente; a sus pies, la resta.
// Datos: 05-vivienda.md (Ley 6/1998; +150 % 1997-2006, Banco de España; rescate ≈ 65.725 M€ sin recuperar, públicos y privados; Sareb, 2012;
// ≈ 270.000 viviendas anunciadas y ≈ 49.000 con calificación definitiva desde 2021; ley del suelo retirada el 23-5-2024).
//   b33     la obra de noche, la grúa gigante; «turnándose» → la cabina cambia de color, azul, rojo, azul.
//   b34     Ansar (azul) con el plano. «urbanizable» → brota un bosque de grúas y la columna de CASAS se dispara por encima de HOGARES.
//   b35     Zapatitos (rojo): «ciento cincuenta» → la cifra. b36 calma; «reventó» → las grúas caen en dominó; una familia sale con su caja y la bola de la deuda.
//   b37     Rajoyo (azul): la carretilla de billetes; «sin recuperar» → la cifra. b37.2 «la Sareb» → el archivador se cierra con las casas dentro.
//   b38     la resta: las CASAS se hunden por debajo de HOGARES y vuelve el hueco rojo.
//   b39     Sanchís (rojo) con el megáfono: casas de humo; 270.000 → b39.2 49.000. b40 + f1: primer plano de Sanchís.
//   b41 + f2 primer plano de Feijolo. b42 la mesa: el plano de la LEY DEL SUELO, cada uno tira de una esquina y se rompe. b43 el Decano al pie de la grúa.
const G = T.guion([33, 34, 35, 36, 37, 38, 39, 40, 'f1', 41, 'f2', 42, 43], { desde: 1 }), en = G.en;
const AN = PERSONAJES.ansar, ZA = PERSONAJES.zapatitos, RA = PERSONAJES.rajoyo, SA = PERSONAJES.sanchis, FE = PERSONAJES.feijolo, DE = PERSONAJES.decano;
const AZUL = '#1f5fae', ROJO = '#c0281c';
const jack = { jack: true, quieto: true, figura: '#2b2522', sombra: 9, contraluz: 0, bordes: ['rgb(190,215,255)', 'rgb(255,150,90)'], borde: .8 };
// palabras clave (a ojo, a 14 letras/s; G.x las pasa al segundo real)
const TURNANDO = G.x('b33', 3.4), URBANIZABLE = G.x('b34', 5.4), CIENTO = G.x('b35.2', 2.6), REVENTO = G.x('b36', 1.5), PERDIERON = G.x('b36', 3),
  RECUPERAR = G.x('b37', 4.6), SAREB = G.x('b37.2', 4), NOVOLVIERON = G.x('b38', 1.6), ANUNCIADAS = G.x('b39', 4.6), CUARENTA = G.x('b39.2', 4.2),
  RETIRO = G.x('b42.2', 2), VOTOS = G.x('b42.2', 5.6);
const nota = (en0, hasta, titulo, filas, fuente, x = 40) => ({ en: en0, hasta, x, y: 40, ancho: 480, titulo, filas, fuente });
// la cabina: azul con Ansar (1996), roja con Zapatitos (2004), azul con Rajoyo (2011), roja con Sanchís (2018); en b33, un baile rápido de los dos
const cabina = [[0, AZUL], [TURNANDO, ROJO], [TURNANDO + .35, AZUL], [TURNANDO + .7, ROJO], [en.b34, AZUL], [en.b35, ROJO], [en.b37, AZUL], [en.b39, ROJO]];
const noche = [{ tipo: 'plano', color: '#16223a', raya: 'rgba(0,0,0,.28)', luz: 'rgba(110,140,210,.08)', par: .2 }, { tipo: 'astro', x: 1060, y: 110, r: 40, luna: true, par: .2 },
  { tipo: 'nubes', tono: .35, n: 4, y: 70, par: .25 }, { tipo: 'ciudad', tono: .55, par: .35, y: 560, s: 21 }];
const gruaGrande = { tipo: 'grua', x: 640, alto: 520, escala: 1.05, luz: true, arranca: 0, cabina, par: .8 };
// el bosque de grúas que brota con Ansar y cae en dominó cuando revienta
const bosque = Array.from({ length: 9 }, (_, i) => ({ tipo: 'grua', x: 60 + i * 140 + (i > 3 ? 120 : 0), alto: 260 + 90 * T.azar(i + 4), escala: .7, tono: .35, luz: true,
  arranca: URBANIZABLE + .2 * i, desde: URBANIZABLE - .1 + .18 * i, cae: REVENTO + .16 * i, lado: 1, par: .6 }));
const resta = (claves, extra = {}) => ({ tipo: 'columnas', x: 1110, y: 590, max: 250, escala: .62, sep: 75, ancho: 90, panel: true, ...claves, ...extra });
const foco = (x, y, r) => ({ tipo: 'astro', x, y, r, par: 1 });
window.ESCENA = {
  dura: G.fin, fps: 30, suelo: 600, voces: G.voces,
  silencios: [[REVENTO - .8, REVENTO], [en.f1 - .3, en.f1], [RETIRO - .5, RETIRO]],
  sonidos: [
    { en: 0, hasta: en.f1 - .2, archivo: 'audio/sfx/viento.mp3', volumen: .22, bucle: true },
    { en: TURNANDO, archivo: 'audio/sfx/whoosh.mp3', volumen: .3 },
    { en: URBANIZABLE, archivo: 'audio/sfx/riser.mp3', volumen: .3 }, { en: URBANIZABLE + .3, hasta: REVENTO, archivo: 'audio/sfx/ciudad.mp3', volumen: .2, bucle: true },
    { en: REVENTO + .6, archivo: 'audio/sfx/derrumbe.mp3', volumen: .24 }, { en: REVENTO + .7, archivo: 'audio/sfx/terremoto.mp3', volumen: .4 },
    { en: RECUPERAR, archivo: 'audio/sfx/impacto.mp3', volumen: .16 }, { en: SAREB, archivo: 'audio/sfx/impacto.mp3', volumen: .18 },
    { en: en.b39, hasta: en.f1, archivo: 'audio/sfx/grada.mp3', volumen: .15, bucle: true }, { en: CUARENTA, archivo: 'audio/sfx/impacto.mp3', volumen: .16 },
    { en: RETIRO, archivo: 'audio/sfx/cristales.mp3', volumen: .12 }, { en: en.b43, hasta: G.fin, archivo: 'audio/sfx/viento.mp3', volumen: .22, bucle: true }],
  carteles: [
    nota(G.x('b34', 1), en.b35 - .2, 'Ansar · 1998', [['Ley del suelo (Ley 6/1998)', ''], ['Todo es urbanizable', 'salvo lo protegido', '#7a1410']], 'BOE, 14-4-1998'),
    nota(G.x('b35', .5), en.b36 - .2, 'Zapatitos · 2004-2011', [['Precio de la vivienda, 1997-2006', '+150 %', '#7a1410']], 'Banco de España'),
    nota(G.x('b37', .5), SAREB - .3, 'Rajoyo · 2011-2018', [['Rescate sin recuperar', '≈ 65.700 M€', '#7a1410'], ['(fondos públicos y privados)', ''], ['Sareb', '2012']], 'Banco de España'),
    nota(G.x('b39', .5), en.b40 - .2, 'Sanchís · desde 2018', [['Viviendas anunciadas', '≈ 270.000'], ['Con calificación final, desde 2021', '≈ 49.000', '#7a1410']], 'Observatorio de Vivienda y Suelo, vía El Español'),
    nota(RETIRO + .3, en.b43 - .2, 'Ley del suelo · 23-5-2024', [['Retirada del Congreso', '1 hora antes', '#7a1410'], ['Motivo', 'no tenía los votos']], 'BOCG · prensa', 770),
  ],
  planos: [
    { desde: 0, ...jack, viento: .25, franjas: true, decorado: [...noche, ...bosque, gruaGrande, { tipo: 'suelo', par: 1, matas: 0 }],
      delante: [resta({ hogares: [[en.b34, .5], [URBANIZABLE + 2, .7]], casas: [[en.b34, .3], [URBANIZABLE + .5, .3], [URBANIZABLE + 2.5, 1]] })],
      actores: [{ p: AN, x: 380, mira: 1, desde: en.b34 - .3, acciones: [{ hace: 'camina', en: en.b34 - .2, hasta: en.b34 + 1.8, a: 520 }, { hace: 'brazos', en: URBANIZABLE - .4, hasta: URBANIZABLE + 2, h: 2.2, c: .2 }] }],
      camara: [[0, 640, 200, 1.4], [TURNANDO - .3, 660, 160, 1.6], [en.b34, 640, 360, 1], [URBANIZABLE, 640, 360, .92], [en.b35, 640, 360, .92]] },
    { desde: en.b35, ...jack, viento: .25, decorado: [...noche, ...bosque, gruaGrande, { tipo: 'suelo', par: 1, matas: 0 }],
      delante: [{ tipo: 'contador', en: CIENTO - .3, x: 900, y: 250, de: 0, a: 150, antes: '+', despues: ' %', tam: 78, rotulo: 'precio de la vivienda, 1997-2006', dura: 1.2, hasta: en.b36 },
        { tipo: 'bola', x: 790, y: 600, desde: PERDIERON }],
      actores: [{ p: ZA, x: 420, mira: 1, hasta: REVENTO, acciones: [{ hace: 'saluda', en: en.b35 + .3, hasta: en.b35 + 2.2 }, { hace: 'aplaude', en: CIENTO, hasta: CIENTO + 1.5 }] },
        ...[0, 1, 2].map(i => ({ p: { ...ciudadano(410 + i, { escala: i === 2 ? .5 : .85 }), objeto: i === 0 ? 'papel' : undefined }, x: 640 + i * 80, mira: 1, desde: PERDIERON - .4,
          acciones: [{ hace: 'camina', en: PERDIERON - .3, hasta: PERDIERON + 3, a: 860 + i * 80 }] }))],
      camara: [[en.b35, 640, 360, .95], [CIENTO, 640, 300, 1.05], [REVENTO - .2, 640, 300, 1.05], [REVENTO + .6, 640, 360, .9], [PERDIERON, 760, 430, 1.25], [en.b37, 760, 430, 1.25]] },
    { desde: en.b37, ...jack, viento: .2, decorado: [...noche, gruaGrande, { tipo: 'suelo', par: 1, matas: 0 }],
      delante: [{ tipo: 'carretilla', x: -100, a: 760, en: en.b37 + .3, hasta: RECUPERAR, vacia: RECUPERAR + .2, escala: .9 },
        { tipo: 'contador', en: RECUPERAR - .2, x: 900, y: 250, a: 65700, despues: ' M€', tam: 72, rotulo: 'sin recuperar del rescate · Banco de España', dura: 1.2, hasta: en['b37.2'] },
        { tipo: 'archivador', x: 980, y: 600, escala: .75, cierra: SAREB, texto: 'SAREB', desde: en['b37.2'] }],
      actores: [{ p: RA, x: -220, mira: 1, acciones: [{ hace: 'camina', en: en.b37 + .3, hasta: RECUPERAR, a: 640 }, { hace: 'encoge', en: RECUPERAR + .4, hasta: RECUPERAR + 1.6 }] }],
      camara: [[en.b37, 520, 380, 1.1], [RECUPERAR, 680, 360, 1.05], [SAREB - .3, 900, 360, 1.15], [en.b38, 900, 360, 1.1]] },
    { desde: en.b38, ...jack, viento: .2, decorado: [...noche, { ...gruaGrande, arranca: null }, { tipo: 'suelo', par: 1, matas: 0 }],
      delante: [{ ...resta({ hogares: [[0, .55], [NOVOLVIERON + 2.5, .95]], casas: [[0, .75], [NOVOLVIERON + .2, .35]], hueco: NOVOLVIERON + 1.5 }), x: 640, escala: 1, sep: 120, ancho: 140, max: 300, y: 560 }],
      camara: [[en.b38, 640, 380, 1.05], [en.b39, 640, 360, 1.1]] },
    { desde: en.b39, ...jack, viento: .2, decorado: [...noche, gruaGrande, { tipo: 'suelo', par: 1, matas: 0 }],
      delante: [{ tipo: 'megafono', x: 470, y: 330, en: en.b39 + .5, cada: .3, quedan: 6, escala: .8, suelo: 560 },
        { tipo: 'contador', en: ANUNCIADAS - .3, x: 960, y: 470, a: 270000, tam: 62, rotulo: 'viviendas anunciadas', dura: 1.2, hasta: CUARENTA - .2 },
        { tipo: 'contador', en: CUARENTA - .2, x: 960, y: 470, de: 270000, a: 49000, tam: 62, color: '#ffb59a', rotulo: 'con calificación final desde 2021', dura: 1.2 }],
      actores: [{ p: SA, x: 380, mira: 1, acciones: [{ hace: 'brazos', en: en.b39 + .3, hasta: en.b40, h: 1.5, c: .1 }] }],
      camara: [[en.b39, 560, 380, 1.1], [ANUNCIADAS, 640, 340, 1], [CUARENTA, 760, 330, 1.08], [en.b40, 600, 330, 1.1]] },
    // f1 y f2: primeros planos de frente, con un foco
    { desde: en.b40, ...jack, viento: .1, decorado: [{ ...noche[0], color: '#101828' }, foco(640, 260, 120), { tipo: 'suelo', par: 1, matas: 0 }],
      actores: [{ p: SA, x: 640, vista: 'frente', acciones: [{ hace: 'habla', en: en.f1, hasta: en.f1 + 2.8 }, { hace: 'encoge', en: en.f1 + 3, hasta: en.f1 + 4.6 }, { hace: 'habla', en: en.f1 + 3.4, hasta: en.f1 + 5.2 }] }],
      camara: [[en.b40, 640, 330, 1.6], [en.b41, 640, 320, 1.75]] },
    { desde: en.b41, ...jack, viento: .1, decorado: [{ ...noche[0], color: '#101828' }, foco(640, 260, 120), { tipo: 'suelo', par: 1, matas: 0 }],
      actores: [{ p: FE, x: 640, vista: 'frente', acciones: [{ hace: 'habla', en: en.f2, hasta: en.f2 + 6.4 }, { hace: 'senala', en: en.f2 + 2.4, hasta: en.f2 + 4.2 }, { hace: 'encoge', en: en.f2 + 4.6, hasta: en.f2 + 6.4 }] }],
      camara: [[en.b41, 640, 330, 1.6], [en.b42, 640, 320, 1.75]] },
    { desde: en.b42, ...jack, viento: .15, decorado: [{ tipo: 'plano', color: '#2a1a12', raya: 'rgba(0,0,0,.3)', luz: 'rgba(255,200,120,.08)', par: .2 }, foco(640, 200, 90),
        { tipo: 'mesa', x: 640, y: 600, ancho: 560, par: 1 }],
      delante: [{ tipo: 'leyRota', x: 640, y: 420, rompe: RETIRO, escala: .9 }],
      actores: [{ p: SA, x: 300, mira: 1, acciones: [{ hace: 'brazos', en: RETIRO - 1.2, hasta: RETIRO + .4, h: 1.3, c: .1, mano: 'puno' }, { hace: 'inclina', en: RETIRO - .2, hasta: RETIRO + .8, g: -.5 }] },
        { p: FE, x: 980, mira: -1, acciones: [{ hace: 'brazos', en: RETIRO - 1.2, hasta: RETIRO + .4, h: 1.3, c: .1, mano: 'puno' }, { hace: 'inclina', en: RETIRO - .2, hasta: RETIRO + .8, g: -.5 }] }],
      camara: [[en.b42, 640, 380, 1.05], [RETIRO, 640, 400, 1.15], [VOTOS, 640, 380, 1.05]] },
    { desde: en.b43, ...jack, viento: .25, contraluz: .4, decorado: [...noche, { ...gruaGrande, arranca: null, cabina: [[0, '#3a3a3a']] }, { tipo: 'suelo', par: 1, matas: 0 }],
      actores: [{ p: DE, x: 380, mira: 1, acciones: [{ hace: 'camina', en: en.b43, hasta: en.b43 + 2, a: 500 }, { hace: 'senala', en: G.x('b43', 2.5), hasta: G.x('b43', 5) }, { hace: 'piensa', en: G.x('b43', 5.2), hasta: G.fin }] }],
      camara: [[en.b43, 520, 380, 1.3], [G.fin, 600, 260, 1.05]] },
  ],
};
