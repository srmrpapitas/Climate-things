// Españistán ep. 5 · secuencia C, «Tenerife» (bloques 7–13). Estilo `jack`, 30 fps. Tiempos: tiempos-05.js (estimados hasta que exista la voz).
// Datos: 05-vivienda.md (Cáritas Tenerife; chico de 29 años con 1.300 €/mes, El Día; funcionarios en caravanas, COPE 2024 y Diario de Avisos 2026;
// propuesta del Gobierno canario de 10 años de padrón para comprar, 15-10-2026, sin aprobar).
//   b7      sur de Tenerife con calima: el Teide al fondo, el mar, la fila de hoteles blancos. «a cinco minutos» → la cámara barre a la derecha: el descampado de las autocaravanas.
//   b8      nota de Cáritas. b8.2 «coches / caravanas / chabolas / cuevas» → cada cosa se enciende en su palabra (la cueva, en la ladera).
//   b9      amanece: el camarero sale de su caravana y mira el escaparate («7 noches»). b9.2 «funcionarios» → otro sale de otra caravana con su carpeta.
//   b10     la balanza: SUELDO DE UN MES contra UNA SEMANA DE TURISTA; «no compiten» → la maleta gana.
//   b11     viento: la calle llena; «Canarias tiene un límite» → suben las pancartas. b12 «diez años» → la verja se cierra con el cartel.
//   b13     el Decano, con el candil, delante de la verja.
const G = T.guion([7, 8, 9, 10, 11, 12, 13]), en = G.en;
const CA = PERSONAJES.camarero, DE = PERSONAJES.decano;
const jack = { jack: true, quieto: true, figura: '#2b2522', sombra: 9, contraluz: 0, bordes: ['rgb(255,232,200)', 'rgb(255,130,70)'], borde: .7 };
// palabras clave (a ojo, a 14 letras/s; G.x las pasa al segundo real)
const MINUTOS = G.x('b7', 2.9), COCHES = G.x('b8.2', .9), CARAVANAS = G.x('b8.2', 1.6), CHABOLAS = G.x('b8.2', 2.4), CUEVAS = G.x('b8.2', 3.6),
  MIL = G.x('b9', 3.4), PISO = G.x('b9', 5.6), FUNCIONARIOS = G.x('b9.2', .8), SUELO = G.x('b10', 2.4), TURISMO = G.x('b10', 3.5), COMPITEN = G.x('b10.2', 2.4),
  LIMITE = G.x('b11', 2), DIEZ = G.x('b12', 3);
const nota = (en0, hasta, titulo, filas, fuente, x = 40) => ({ en: en0, hasta, x, y: 40, ancho: 470, titulo, filas, fuente });
const sur = [
  { tipo: 'plano', color: '#d27a34', raya: 'rgba(120,50,15,.22)', luz: 'rgba(255,220,150,.2)', par: .2 },
  { tipo: 'astro', x: 260, y: 150, r: 70, par: .2 },
  { tipo: 'teide', x: 980, y: 470, escala: 1.1, tono: .55, par: .3 },
  { tipo: 'mar', y: 470, color: 'rgba(40,70,95,.8)', par: .45 },
  { tipo: 'hoteles', x0: -260, x1: 760, n: 5, y: 600, par: .8 },
  { tipo: 'cueva', x: 1180, y: 470, escala: .55, tono: .5, luz: CUEVAS, par: .3 },
  { tipo: 'coche', x: 790, escala: .8, par: 1 },
  { tipo: 'caravana', x: 1060, escala: .9, luz: CARAVANAS, ropa: true, par: 1 },
  { tipo: 'caravana', x: 1430, escala: .8, lado: -1, luz: CARAVANAS + .3, par: 1 },
  { tipo: 'chabola', x: 1290, escala: .8, tono: .25, luz: CHABOLAS, par: .9 },
  { tipo: 'suelo', par: 1, matas: 6 }];
const calima = [{ tipo: 'polvo', n: 90, zona: [-200, 100, 1500, 620] }, { tipo: 'pajaros', n: 5, zona: [0, 60, 1280, 260] }];
const gente = n => Array.from({ length: n }, (_, i) => ({ p: ciudadano(260 + i, { escala: .46 + .06 * (i % 3) }), x: 120 + i * (1060 / n) + 20 * T.azar(i), mira: i % 2 ? -1 : 1,
  acciones: [{ hace: i % 3 ? 'puno' : 'aplaude', en: LIMITE + .1 * i, hasta: LIMITE + 2.4 + .1 * i }] }));
window.ESCENA = {
  dura: G.fin, fps: 30, suelo: 600, voces: G.voces,
  silencios: [[COMPITEN - .5, COMPITEN], [DIEZ - .6, DIEZ]],
  sonidos: [
    { en: 0, hasta: en.b10, archivo: 'audio/sfx/ola.mp3', volumen: .25, bucle: true },
    { en: 0, hasta: en.b10, archivo: 'audio/sfx/viento.mp3', volumen: .2, bucle: true },
    { en: MINUTOS - .2, archivo: 'audio/sfx/whoosh.mp3', volumen: .3 },
    { en: en.b10, hasta: en.b11, archivo: 'audio/sfx/dron.mp3', volumen: .18, bucle: true }, { en: COMPITEN, archivo: 'audio/sfx/impacto.mp3', volumen: .18 },
    { en: en.b11, hasta: en.b13, archivo: 'audio/sfx/grada.mp3', volumen: .3, bucle: true },
    { en: DIEZ + .8, archivo: 'audio/sfx/impacto.mp3', volumen: .22 },
    { en: en.b13, hasta: G.fin, archivo: 'audio/sfx/viento.mp3', volumen: .2, bucle: true }],
  carteles: [
    nota(en.b8 + .3, en.b9 - .2, 'Cáritas · sur de Tenerife', [['Con trabajo y sin casa', 'cada vez más', '#7a1410']], 'Cáritas Tenerife, vía Diario de Avisos'),
    nota(MIL - .4, en['b9.2'] - .1, 'Un caso real', [['Edad', '29 años'], ['Contrato', 'fijo'], ['Sueldo', '1.300 €/mes', '#7a1410']], 'El Día'),
    nota(FUNCIONARIOS, en.b10 - .2, 'También funcionarios', [['Viven en', 'caravanas', '#7a1410']], 'COPE (2024) · Diario de Avisos (2026)'),
    nota(DIEZ + 1, en.b13 - .2, 'Propuesta del Gobierno canario', [['Para comprar casa', '10 años de padrón', '#7a1410'], ['Estado', 'sin aprobar']], 'RTVC · 15-10-2026', 770),
  ],
  planos: [
    { desde: 0, ...jack, viento: .35, franjas: true, decorado: sur, particulas: calima,
      actores: [{ p: ciudadano(250, { escala: .5 }), x: 300, mira: 1, acciones: [{ hace: 'camina', en: .5, hasta: 6, a: 560 }] }],
      camara: [[0, 360, 380, 1.1], [MINUTOS - .3, 400, 380, 1.12], [MINUTOS + 1.6, 1000, 400, 1.15], [COCHES, 950, 420, 1.2], [CUEVAS, 1080, 400, 1.12], [en.b9, 1040, 410, 1.15]] },
    { desde: en.b9, ...jack, viento: .2, decorado: [{ ...sur[0], color: '#d98c55' }, sur[1], sur[2], sur[3], { tipo: 'escaparate', x: 330, escala: .95, rotulo: 'INMOBILIARIA',
        precio: '1.400 €', texto: '7 NOCHES', precio2: '—', texto2: 'ALQUILER: NO HAY', par: 1 }, sur[7], sur[8], sur[9], sur[10]], particulas: calima,
      actores: [{ p: CA, x: 1010, mira: -1, acciones: [{ hace: 'camina', en: en.b9 + .4, hasta: MIL, a: 560 }, { hace: 'piensa', en: MIL + .2, hasta: PISO }, { hace: 'niega', en: PISO, hasta: PISO + 1.4 }] },
        { p: { ...ciudadano(251, { escala: .95 }), objeto: 'papel' }, x: 1330, mira: -1, desde: FUNCIONARIOS - .3, acciones: [{ hace: 'camina', en: FUNCIONARIOS - .2, hasta: FUNCIONARIOS + 2.2, a: 900 }] }],
      camara: [[en.b9, 960, 400, 1.3], [MIL, 520, 400, 1.25], [PISO, 450, 380, 1.35], [FUNCIONARIOS, 820, 400, 1.1], [en.b10, 900, 400, 1.08]] },
    { desde: en.b10, ...jack, viento: .2, decorado: [{ tipo: 'plano', color: '#b8662a', raya: 'rgba(90,30,10,.25)', luz: 'rgba(255,200,120,.18)', par: .2 }, sur[3], { tipo: 'suelo', par: 1, matas: 0 }],
      delante: [{ tipo: 'balanza', x: 640, y: 600, izq: ['SUELDO DE UN MES'], izqEn: [SUELO], der: ['UNA SEMANA DE TURISTA'], derEn: [TURISMO], pesos: [[COMPITEN, 1]] },
        { tipo: 'maleta', x: 1500, a: 900, en: TURISMO - .4, hasta: TURISMO + .6, y: 600, escala: 1.4 }],
      camara: [[en.b10, 640, 360, 1], [COMPITEN, 760, 330, 1.12], [en.b11, 740, 340, 1.15]] },
    { desde: en.b11, transicion: 'viento', ...jack, viento: .3, decorado: [{ ...sur[0], color: '#c9682e' }, sur[2], sur[4], { tipo: 'suelo', par: 1, matas: 0 }],
      delante: [{ tipo: 'pancartas', en: LIMITE - .2, textos: ['CANARIAS TIENE UN LÍMITE', 'VIVIR AQUÍ', 'NO SOMOS DECORADO'], x0: 270, paso: 380, y: 300 }],
      actores: gente(10), particulas: [{ tipo: 'papeles', n: 25, en: LIMITE }],
      camara: [[en.b11, 640, 380, 1.2], [LIMITE, 640, 350, 1.02], [en.b12, 640, 350, 1]] },
    { desde: en.b12, ...jack, viento: .2, decorado: [{ ...sur[0], color: '#a8562a' }, sur[2], sur[4], { tipo: 'suelo', par: 1, matas: 0 }],
      delante: [{ tipo: 'verja', x: 640, cierra: DIEZ, texto: 'SOLO CON 10 AÑOS DE PADRÓN', ancho: 600, alto: 320 }],
      actores: [{ p: { ...CA, escala: .9 }, x: 520, mira: 1, acciones: [{ hace: 'camina', en: en.b12 + .2, hasta: DIEZ - .2, a: 600 }, { hace: 'encoge', en: DIEZ + .9, hasta: DIEZ + 2.4 }] }],
      camara: [[en.b12, 640, 380, 1.1], [DIEZ, 640, 360, 1.18], [DIEZ + 1, 640, 360, 1.05]] },
    { desde: en.b13, ...jack, viento: .25, contraluz: .4, decorado: [{ ...sur[0], color: '#6e3a20' }, sur[2], { tipo: 'verja', x: 640, ancho: 600, alto: 320, texto: 'SOLO CON 10 AÑOS DE PADRÓN', par: .7 }, { tipo: 'suelo', par: 1, matas: 0 }],
      actores: [{ p: DE, x: 300, mira: 1, acciones: [{ hace: 'camina', en: en.b13, hasta: en.b13 + 2.2, a: 420 }, { hace: 'senala', en: G.x('b13', 3), hasta: G.x('b13', 5.5) }, { hace: 'piensa', en: en['b13.2'], hasta: G.fin }] }],
      camara: [[en.b13, 560, 380, 1.25], [G.fin, 460, 360, 1.45]] },
  ],
};
