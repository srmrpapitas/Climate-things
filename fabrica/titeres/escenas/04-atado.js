// Españistán ep. 4 · secuencia D, «Atado y bien atado» (bloques 10–17). Estilo `jack`, 30 fps. Tiempos: tiempos-04.js (estimados hasta que exista la voz).
// Datos: 04-bipartidismo.md, bloque 3 (Mensaje de Navidad de 1969; Ley para la Reforma Política; RDL 20/1977; AP y PSOE).
// Hilo del capítulo: la cuerda. Nace aquí, cruza el cielo y se queda; su primer nudo se cierra en «atado».
//   b10     cielo rojo de tormenta, cuervos; el palacio y, en el balcón, el General de espaldas y sin cara. Los relámpagos lo recortan.
//   b11.2   la cuerda se tiende de lado a lado del cielo. Calma (se apaga el ambiente) y, en «atado», trueno, relámpago y el nudo.
//   b11.3   Juancar jura lealtad (cartel).
//   b12     (viento) amanecer gris de 1975: la cuerda sigue en el cielo. b12.2 la corona baja al cielo; b12.3 Suavez entra bajo ella.
//   b13.3   la confesión de Suavez sobre el referéndum (cartel).
//   b13     (corte) las Cortes en gradas, en penumbra; en «cuatrocientos veinticinco», las manos suben en ola desde el centro.
//   b14     (viento) la calle al sol: la gente sale, palomas y papeles. Lo bueno también se cuenta.
//   b15     (viento) las reglas de 1977: la urna, y cada pieza cae en su palabra; «cerradas» → el rollo se sella.
//   b16     (viento) Fragata y la mesa de los siete; el letrero pasa de ALIANZA POPULAR a PARTIDO POPULAR (1989).
//   b17     (corte) Felipón; las Cortes de 1982 se tiñen de rojo (202). «la noria empezó a girar» → (viento) la noria al alba arranca.
const G = T.guion([10, 11, 12, 13, 14, 15, 16, 17]), en = G.en;
const SU = PERSONAJES.suavez, FR = PERSONAJES.fragata, FP = PERSONAJES.felipon;
const jack = { jack: true, quieto: true, figura: '#2b2522', sombra: 9, contraluz: 0, bordes: ['rgb(255,226,190)', 'rgb(255,120,70)'], borde: .7 };
// palabras clave (segundos dentro de su frase, a 14 letras/s; afinar con el audio real)
const ATADO = G.x('b11.2', 3.1), VOTAN = G.x('b13', 4.6), P1 = G.x('b15.2', .9), P2 = G.x('b15.2', 2.4), P3 = G.x('b15.3', .5), P4 = G.x('b15.3', 2.9), SELLO = G.x('b15.3', 4.6);
const AP = G.x('b16.2', 2.2), PP = G.x('b16.3', 1.4), ROJO = G.x('b17.3', 1), GIRA = G.x('b17.3', 4.2);
const RAYOS = [G.x('b10', 1.2), G.x('b10', 5.6), G.x('b11', 2.5), ATADO, ATADO + 3.4];
const cuerda = (extra = {}) => ({ tipo: 'cuerda', x0: -80, y0: 70, x1: 1360, y1: 110, comba: 90, en: en['b11.2'] - .2, tiende: 1.6, nudos: [{ u: .5, en: ATADO }], par: .4, ...extra });
const tormenta = [
  { tipo: 'plano', color: '#8a1a12', raya: 'rgba(40,0,0,.3)', luz: 'rgba(255,90,60,.12)', par: .2 },
  { tipo: 'relampago', en: RAYOS, xs: [260, 1050, 180, 1100, 300], y: 560, par: .2 },
  { tipo: 'nubes', tono: 0, n: 6, y: 40, par: .3 },
  { tipo: 'ciudad', tono: .1, par: .45, y: 580, s: 9 },
  { tipo: 'balcon', x: 640, y: 640, ancho: 700, escala: .78, par: .9 },
  { tipo: 'general', x: 640, y: 640 - 170 * .78, escala: .74, saluda: G.x('b10', 2), baja: en.b11, par: .9 },
  cuerda({ y0: 150, y1: 190, comba: 70, par: .9 }),   // por delante del palacio: cruza todo el cielo
  { tipo: 'suelo', par: 1, matas: 0 }];
const alba = (cielo = '#6f6a68', disco = '#c9b9a2') => [{ tipo: 'plano', color: cielo, raya: 'rgba(0,0,0,.18)', luz: 'rgba(255,240,220,.08)', par: .2 },
  { tipo: 'disco', x: 980, y: 420, r: 130, color: disco, par: .2 }, cuerda({ en: -99, nudos: [{ u: .5, en: -99 }] })];
const cortes = (rojo) => [{ tipo: 'plano', color: '#7a5236', raya: 'rgba(0,0,0,.3)', luz: 'rgba(255,200,140,.1)', par: .2 }, { tipo: 'astro', x: 640, y: 260, r: 120, par: .2 },
  { tipo: 'hemiciclo', x: 640, y: 700, escala: 1, filas: 6, alzan: rojo ? null : VOTAN, bajan: rojo ? null : VOTAN + 4, rojo: rojo ? { en: ROJO, parte: 202 / 350 } : null, par: .9 }];
const nota = (en0, hasta, titulo, filas, fuente) => ({ en: en0, hasta, x: 40, y: 40, ancho: 520, titulo, filas, fuente });
window.ESCENA = {
  dura: G.fin, fps: 30, suelo: 600, voces: G.voces,
  silencios: [[ATADO - 1.1, ATADO], [VOTAN - .9, VOTAN], [SELLO - .7, SELLO]],
  sonidos: [
    { en: 0, hasta: en.b12, archivo: 'audio/sfx/viento.mp3', volumen: .45, bucle: true },
    { en: 0, hasta: en.b12, archivo: 'audio/sfx/lluvia.mp3', volumen: .15, bucle: true },
    ...RAYOS.map((t, i) => ({ en: t + .15 + .3 * (i % 2), archivo: 'audio/sfx/trueno.mp3', volumen: t === ATADO ? 1 : .55 })),
    { en: ATADO, archivo: 'audio/sfx/impacto.mp3', volumen: .28 },
    { en: en.b12, hasta: en.b13, archivo: 'audio/sfx/viento.mp3', volumen: .2, bucle: true },
    { en: en.b13, hasta: en.b14, archivo: 'audio/sfx/grada.mp3', volumen: .18, bucle: true },
    { en: VOTAN, archivo: 'audio/sfx/impacto.mp3', volumen: .20 },
    { en: en.b14, hasta: en.b15, archivo: 'audio/sfx/ciudad.mp3', volumen: .2, bucle: true }, { en: G.x('b14', .6), archivo: 'audio/sfx/ovacion.mp3', volumen: .25 },
    { en: en.b15, hasta: en.b16, archivo: 'audio/sfx/viento.mp3', volumen: .12, bucle: true },
    ...[P1, P2, P3, P4].map(t => ({ en: t + .3, archivo: 'audio/sfx/impacto.mp3', volumen: .12 })), { en: SELLO, archivo: 'audio/sfx/impacto.mp3', volumen: .24 },
    { en: en.b16, hasta: G.fin, archivo: 'audio/sfx/viento.mp3', volumen: .15, bucle: true },
    { en: ROJO, archivo: 'audio/sfx/ovacion.mp3', volumen: .2 }, { en: GIRA - .3, archivo: 'audio/sfx/whoosh.mp3', volumen: .5 }],
  carteles: [
    nota(G.x('b10', .5), en['b11.2'] - .3, 'Españistán', [['1939–1975', 'dictadura'], ['Partidos y elecciones libres', 'no', '#7a1410']], 'historia de España'),
    { en: ATADO + .6, hasta: en['b11.3'] - .2, x: 40, y: 40, ancho: 620, titulo: 'Mensaje de Navidad · 1969', filas: [['«Todo ha quedado atado, y bien atado»', '']], fuente: 'Francisco Franco, 30-12-1969' },
    nota(G.x('b11.3', .4), en.b12 - .3, 'Juancar', [['Sucesor por ley', '22-07-1969'], ['Jura lealtad a Franco y al Movimiento', '23-07-1969']], 'BOE · Ley 62/1969'),
    nota(G.x('b12.2', .6), en['b12.3'] - .2, 'Julio de 1976', [['El Rey nombra presidente', 'a Suavez'], ['Elegido de una terna del', 'Consejo del Reino']], 'BOE, julio de 1976'),
    nota(G.x('b12.3', 1.6), en.b13 - .3, 'Suavez', [['Presidente', '1976–1981'], ['Antes: jefe del Movimiento', '1975–1976']], 'BOE'),
    { en: VOTAN + .5, hasta: en['b13.3'] - .2, x: 40, y: 40, ancho: 500, titulo: 'Ley para la Reforma Política · 1976', tiempos: [VOTAN + .5, VOTAN + 1.4],
      filas: [['A favor', '425', '#2c4a1a'], ['En contra', '59', '#7a1410']], fuente: 'Diario de Sesiones de las Cortes, 18-11-1976' },
    { en: G.x('b13.3', .4), hasta: en.b14 - .3, x: 40, y: 40, ancho: 620, titulo: 'Suavez, en 1995', filas: [['No se votó', 'monarquía o república'], ['¿Por qué?', 'las encuestas', '#7a1410']],
      fuente: 'Entrevista con Victoria Prego (publicada en 2016)' },
    nota(G.x('b16.2', 1), en['b16.3'] - .2, 'Fragata', [['Fundó Alianza Popular', '1976'], ['Antes', 'ministro de Franco']], 'Congreso de los Diputados'),
    { en: G.x('b17', 2), hasta: en['b17.3'] - .2, x: 40, y: 40, ancho: 520, titulo: 'Felipón', filas: [['Líder del PSOE', 'desde 1974'], ['Presidente', '1982–1996']], fuente: 'PSOE · La Moncloa' },
    { en: ROJO + .3, hasta: GIRA - .3, x: 40, y: 40, ancho: 460, titulo: 'Elecciones de 1982', filas: [['PSOE', '202 escaños', '#7a1410']], fuente: 'Ministerio del Interior' }],
  planos: [
    // b10–b11: la tormenta y el nudo
    { desde: 0, ...jack, viento: .8, franjas: true, decorado: tormenta,
      particulas: [{ tipo: 'cuervos', n: 7, zona: [0, 40, 1280, 300] }, { tipo: 'lluvia', n: 220, viento: 220, color: '255,200,190', fuerza: [[0, .3], [ATADO, .5], [ATADO + .2, 1]] }],
      camara: [[0, 640, 360, 1], [en['b11.2'] - .3, 640, 330, 1.12], [en['b11.2'] - .3, 640, 250, 1.05], [ATADO - .05, 640, 300, 1.05], [ATADO - .05, 640, 230, 1.75], [en.b12, 640, 235, 1.68]] },
    // b12: amanecer gris, la cuerda sigue ahí; entra Suavez
    { desde: en.b12 - .2, transicion: 'viento', ...jack, viento: .3, decorado: [...alba(), { tipo: 'ciudad', tono: .3, par: .45, y: 580, s: 2 }, { tipo: 'corona', x: 560, y: 150, en: G.x('b12.2', .3), par: .7 }, { tipo: 'suelo', par: 1, matas: 0 }],
      particulas: [{ tipo: 'pajaros', n: 4, zona: [0, 150, 1280, 320] }],
      actores: [{ p: SU, x: -120, mira: 1, acciones: [{ hace: 'camina', en: en['b12.3'], hasta: G.x('b12.3', 2.4), a: 560 }, { hace: 'senala', en: G.x('b12.3', 3), hasta: en.b13 - .3 }] }],
      camara: [[0, 640, 300, 1.05], [G.x('b12.3', 2.4), 600, 330, 1.25], [en.b13, 590, 330, 1.3]] },
    // b13: las Cortes franquistas votan su final
    { desde: en.b13 - .1, ...jack, viento: 0, borde: .4, decorado: cortes(false),
      camara: [[0, 640, 380, 1.25], [VOTAN - .05, 640, 360, 1.32], [VOTAN - .05, 640, 380, 1], [en.b14, 640, 375, 1.03]] },
    // b14: la calle, sin otra guerra
    { desde: en.b14 - .2, transicion: 'viento', ...jack, viento: .5, decorado: [...alba('#c8611f', '#eba13c'), { tipo: 'ciudad', tono: .2, par: .45, y: 580, s: 5 }, { tipo: 'bandera', x: 1020, alto: 300, par: .9 }, { tipo: 'suelo', par: 1, matas: 0 }],
      particulas: [{ tipo: 'pajaros', n: 10, zona: [0, 60, 1280, 300] }, { tipo: 'papeles', n: 24, en: G.x('b14', .5) }],
      actores: [60, 61, 62, 63, 64, 65, 66].map((n, i) => ({ p: ciudadano(n, { escala: .55 }), x: 180 + i * 140, mira: i % 2 ? -1 : 1,
        acciones: [{ hace: i % 3 ? 'celebra' : 'aplaude', en: G.x('b14', .4) + .2 * i, hasta: en.b15 - .5 }] })),
      camara: [[0, 640, 360, 1], [en.b15, 640, 350, 1.06]] },
    // b15: las reglas de 1977
    { desde: en.b15 - .2, transicion: 'viento', ...jack, viento: .2, decorado: [{ tipo: 'plano', color: '#4a3226', raya: 'rgba(0,0,0,.25)', luz: 'rgba(255,200,140,.06)', par: .2 },
        { tipo: 'reglas', x: 640, y: 600, par: 1, piezas: [{ en: P1, icono: 'mapa', texto: 'POR PROVINCIAS' }, { en: P2, icono: 'balanza', texto: 'LAS PEQUEÑAS PESAN MÁS' },
          { en: P3, icono: 'cabinas', texto: 'PREMIA A LOS GRANDES' }, { en: P4, icono: 'rollo', texto: 'LISTAS CERRADAS', sella: SELLO }] }, { tipo: 'suelo', par: 1, matas: 0 }],
      camara: [[0, 640, 360, 1.1], [en['b15.2'], 640, 340, 1], [SELLO - .05, 640, 340, 1.02], [SELLO - .05, 970, 490, 1.7], [en.b16, 970, 490, 1.75]] },
    // b16: los de la derecha
    { desde: en.b16 - .2, transicion: 'viento', ...jack, viento: .3, decorado: [{ tipo: 'plano', color: '#2f4a5c', raya: 'rgba(0,0,0,.2)', luz: 'rgba(160,200,255,.07)', par: .2 },
        { tipo: 'letrero', x: 640, y: 160, ancho: 520, texto: 'ALIANZA POPULAR', enciende: AP, apaga: PP, tam: 34, par: .6, hasta: PP + .7 },
        { tipo: 'letrero', x: 640, y: 160, ancho: 520, texto: 'PARTIDO POPULAR', enciende: PP + .7, tam: 34, par: .6, desde: PP + .7 },
        { tipo: 'mesa', x: 700, escala: .8, sillas: Array.from({ length: 6 }, () => ({ en: 1e9 })), par: 1 }, { tipo: 'suelo', par: 1, matas: 0 }],
      actores: [{ p: FR, x: 160, mira: 1, acciones: [{ hace: 'camina', en: en['b16.2'], hasta: G.x('b16.2', 1.8), a: 300 }, { hace: 'golpea', en: AP, hasta: AP + 1.6 }, { hace: 'saluda', en: PP + .8, hasta: PP + 2.6 }] }],
      camara: [[0, 640, 330, 1.05], [en.b17, 620, 330, 1.12]] },
    // b17: los de la izquierda, 1982
    { desde: en.b17 - .2, transicion: 'viento', ...jack, viento: .3, decorado: [{ tipo: 'plano', color: '#7d3b2c', raya: 'rgba(0,0,0,.2)', luz: 'rgba(255,170,120,.08)', par: .2 },
        { tipo: 'disco', x: 300, y: 300, r: 120, color: '#c0543a', par: .2 }, { tipo: 'suelo', par: 1, matas: 0 }],
      actores: [{ p: FP, x: 1400, mira: -1, acciones: [{ hace: 'camina', en: G.x('b17', .3), hasta: G.x('b17', 2.6), a: 760 }, { hace: 'saluda', en: G.x('b17.2', 2.4), hasta: G.x('b17.2', 4.4) }] }],
      camara: [[0, 640, 330, 1.05], [en['b17.2'], 700, 300, 1.35], [en['b17.3'], 700, 295, 1.4]] },
    { desde: en['b17.3'] - .1, ...jack, viento: 0, borde: .4, decorado: cortes(true), camara: [[0, 640, 380, 1], [GIRA, 640, 370, 1.05]] },
    // la noria al alba arranca, con la cuerda y su nudo en el cielo
    { desde: GIRA - .2, transicion: 'viento', ...jack, viento: .3, franjas: true,
      decorado: [...alba('#c8611f', '#eba13c'), { tipo: 'ciudad', tono: .2, par: .35, y: 560, s: 4 }, { tipo: 'noria', x: 640, y: 640, r: 300, vel: .03, arranca: GIRA + .3, luces: .3, par: .8 }, { tipo: 'suelo', par: 1, matas: 0 }],
      particulas: [{ tipo: 'pajaros', n: 6, zona: [0, 60, 1280, 260] }],
      camara: [[0, 640, 360, 1.05], [G.fin, 640, 355, 1.1]] },
  ],
};
