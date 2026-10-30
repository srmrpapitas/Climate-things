// Españistán ep. 5 · secuencia F, «La okupación y las leyes absurdas» (bloques 26–32). Estilo `jack`, 30 fps. Tiempos: tiempos-05.js (estimados hasta que exista la voz).
// Datos: 05-vivienda.md (16.426 denuncias en 2024, ≈ 40 % en Cataluña, Interior; ≈ 26,6 millones de viviendas, Censo 2021; arts. 202 y 245.2 CP;
// suspensión de desahucios de vulnerables desde el RDL 11/2020, prorrogada año tras año; el RDL 29/2026 (6-10-2026) la alarga hasta el 31-12-2030; juicio rápido desde el 3-4-2025, LO 1/2025).
//   b26     una puerta forzada en un rellano de invierno; el propietario mayor con el papel del juzgado. b26.2 «dieciséis mil» → la cifra; «Cataluña» → el mapa, la mancha grande.
//   b27     plano general: un bloque enorme con todas las ventanas encendidas y una sola en rojo; «el miedo» → la cámara se clava en la roja.
//   b28     «leyes absurdas»: dos puertas iguales. «allanamiento» → reloj de arena pequeño, se vacía en un suspiro; «usurpación» → reloj enorme, casi no cae.
//   b29     PANEO al calendario: «dos mil veinte» → empiezan a pasar las hojas, cada una con su sello PRORROGADO, hasta 2030.
//   b30     el edificio del ESTADO (vacío, sin casas sociales) suelta la caja VIVIENDA SOCIAL en brazos del propietario.
//   b31     «no alquilar» → bajan las persianas del bloque, todas; la resta pierde un ladrillo.
//   b32     lo bueno: sello JUICIO RÁPIDO sobre las puertas; b32.2 Montesquieu.
const G = T.guion([26, 27, 28, 29, 30, 31, 32], { desde: 1 }), en = G.en;
const PR = ciudadano(400, { escala: .95, arrugas: .8, pelo: 'calvo', gafas: 'cuadradas', objeto: 'papel', encorvado: .08 });
const jack = { jack: true, quieto: true, figura: '#2b2522', sombra: 9, contraluz: 0, bordes: ['rgb(190,210,255)', 'rgb(255,160,100)'], borde: .7 };
// palabras clave (a ojo, a 14 letras/s; G.x las pasa al segundo real)
const OKUPACION = G.x('b26', 4.3), DIECISEIS = G.x('b26.2', 2.2), CATALUNA = G.x('b26.2', 7.2), MILLONES = G.x('b27', 2.5), MIEDO = G.x('b27', 4.9),
  ALLANAMIENTO = G.x('b28.2', 3), RAPIDO = G.x('b28.2', 5.8), USURPACION = G.x('b28.3', 2.6), MESES = G.x('b28.3', 6.2),
  VEINTE = G.x('b29', 1.2), PARAR = G.x('b29', 7), PRORROGADO = G.x('b29.2', 1.5), TREINTA = G.x('b29.2', 6), PASA = G.x('b30', 4.3), ALQUILAR = G.x('b31', 2.8), EMPEORA = G.x('b31', 4.6),
  JUICIO = G.x('b32', 7);
const nota = (en0, hasta, titulo, filas, fuente, x = 40) => ({ en: en0, hasta, x, y: 40, ancho: 480, titulo, filas, fuente });
const invierno = { tipo: 'plano', color: '#3b4a5e', raya: 'rgba(10,15,30,.3)', luz: 'rgba(200,220,255,.08)', par: .2 };
const hojas = [{ tipo: 'hojas', n: 18, zona: [-100, 0, 1380, 600] }, { tipo: 'papeles', n: 8, zona: [-100, 200, 1380, 600] }];
window.ESCENA = {
  dura: G.fin, fps: 30, suelo: 600, voces: G.voces,
  silencios: [[MIEDO - .5, MIEDO], [EMPEORA - .5, EMPEORA]],
  sonidos: [
    { en: 0, hasta: G.fin, archivo: 'audio/sfx/viento.mp3', volumen: .25, bucle: true },
    { en: OKUPACION, archivo: 'audio/sfx/cristales.mp3', volumen: .10 }, { en: CATALUNA, archivo: 'audio/sfx/impacto.mp3', volumen: .14 },
    { en: MIEDO, archivo: 'audio/sfx/dron.mp3', volumen: .3 }, { en: RAPIDO, archivo: 'audio/sfx/whoosh.mp3', volumen: .25 },
    { en: en.b29 - .5, archivo: 'audio/sfx/whoosh.mp3', volumen: .45 },
    { en: PASA, archivo: 'audio/sfx/impacto.mp3', volumen: .16 }, { en: ALQUILAR, archivo: 'audio/sfx/derrumbe.mp3', volumen: .08 },
    { en: EMPEORA, archivo: 'audio/sfx/impacto.mp3', volumen: .18 }, { en: JUICIO, archivo: 'audio/sfx/impacto.mp3', volumen: .22 }],
  carteles: [
    nota(OKUPACION + .3, en.b26 + 3.6, 'Un propietario', [['Su segunda casa', 'okupada'], ['Papel del juzgado', 'en espera', '#7a1410']], 'Caso de ejemplo'),
    nota(DIECISEIS + 1.2, en.b27 - .2, 'Denuncias por okupación, 2024', [['España', '16.426', '#7a1410'], ['En Cataluña', '≈ 4 de cada 10']], 'Ministerio del Interior', 770),
    nota(MILLONES, en.b28 - .2, 'Viviendas en España', [['Total', '≈ 26,6 millones'], ['Denuncias al año', '≈ 1 de cada 1.600', '#7a1410']], 'INE, Censo 2021 · Interior', 770),
    nota(ALLANAMIENTO, en['b28.3'] - .2, 'Tu casa, donde vives', [['Allanamiento de morada', 'art. 202 CP'], ['Desalojo', 'inmediato', '#7a1410']], 'Código Penal'),
    nota(USURPACION, en.b29 - .5, 'Una casa vacía', [['Usurpación, sin violencia', 'art. 245.2 CP'], ['Delito', 'leve: multa', '#7a1410']], 'Código Penal', 770),
    nota(PARAR, en.b30 - .2, 'Desahucios de vulnerables', [['Suspensión desde', '2020 (RDL 11/2020)'], ['Prorrogada hasta', '31-12-2030', '#7a1410'], ['Última prórroga', 'octubre de 2026']], 'BOE · RDL 29/2026'),
    nota(en.b30 + .2, PASA + 1.5, 'El Estado', [['Vivienda pública', '≈ 2 % del total', '#7a1410'], ['Media de la UE', '≈ 10 %']], 'Banco de España · Funcas', 770),
    nota(JUICIO + .4, G.fin, 'Lo bueno', [['Okupación por juicio rápido', 'desde 3-4-2025', '#2f5a1f']], 'Ley Orgánica 1/2025'),
    { en: en['b32.2'] + .2, hasta: G.fin, x: 770, y: 40, ancho: 470, titulo: 'Montesquieu', filas: [['«Las leyes inútiles', ''], ['debilitan las necesarias»', '']], fuente: 'Del espíritu de las leyes (1748)' },
  ],
  planos: [
    { desde: 0, ...jack, viento: .3, franjas: true, decorado: [invierno, { tipo: 'ciudad', tono: .5, par: .35, y: 560, s: 13 }, { tipo: 'puertaCasa', x: 760, forzada: true, rotulo: '2.º B', par: 1 }, { tipo: 'suelo', par: 1, matas: 0 }],
      actores: [{ p: PR, x: 470, mira: 1, acciones: [{ hace: 'piensa', en: .4, hasta: OKUPACION }, { hace: 'encoge', en: OKUPACION, hasta: OKUPACION + 1.2 }, { hace: 'niega', en: OKUPACION + 1.3, hasta: OKUPACION + 2.8 }] }],
      particulas: hojas,
      camara: [[0, 640, 380, 1.25], [OKUPACION, 700, 380, 1.4], [en['b26.2'], 640, 360, 1.05]] },
    { desde: en['b26.2'], ...jack, viento: .2, decorado: [invierno, { tipo: 'suelo', par: 1, matas: 0 }],
      delante: [{ tipo: 'contador', en: DIECISEIS - .3, x: 380, y: 220, a: 16426, tam: 80, rotulo: 'denuncias por okupación en 2024', dura: 1.4 },
        { tipo: 'mapa05', x: 380, y: 430, ancho: 380, puntos: [[CATALUNA - 1.2, .45, .45, '', true], [CATALUNA - 1, .3, .8, '', true], [CATALUNA - .8, .7, .65, '', true], [CATALUNA - .6, .45, .9, '', true], [CATALUNA, .9, .3, 'CATALUÑA · 40 %', true]] }],
      camara: [[en['b26.2'], 520, 360, 1.05], [CATALUNA, 520, 380, 1.12]] },
    { desde: en.b27, ...jack, viento: .2, decorado: [invierno, { tipo: 'ciudad', tono: .5, par: .35, y: 560, s: 13 }, { tipo: 'suelo', par: 1, matas: 0 }],
      delante: [{ tipo: 'munecas', x: 640, y: 600, cols: 8, pisos: 6, cw: 120, ch: 80, rojos: [29], cuartos: Array.from({ length: 48 }, (_, i) => [en.b27 - 1, '']) }],
      actores: [{ p: { ...PR, escala: .45, objeto: 'lupa' }, x: 180, mira: 1, acciones: [{ hace: 'brazos', en: MIEDO - .5, hasta: G.fin, h: 1.4, c: .2 }] }],
      camara: [[en.b27, 640, 360, .95], [MILLONES, 640, 360, .9], [MIEDO, 760, 260, 2.2], [en.b28, 760, 260, 2.3]] },
    { desde: en.b28, ...jack, viento: .2, decorado: [invierno, { tipo: 'suelo', par: 1, matas: 0 }],
      delante: [{ tipo: 'puertaCasa', x: 380, rotulo: 'TU CASA' }, { tipo: 'puertaCasa', x: 900, rotulo: 'CASA VACÍA', forzada: true },
        { tipo: 'relojArena', x: 560, en: ALLANAMIENTO, dura: RAPIDO - ALLANAMIENTO, escala: .5, texto: 'días' },
        { tipo: 'relojArena', x: 1100, en: USURPACION, dura: 40, escala: 1.25, texto: 'meses' }],
      camara: [[en.b28, 640, 360, 1], [ALLANAMIENTO - .2, 450, 400, 1.35], [USURPACION - .2, 980, 380, 1.2], [MESES, 980, 360, 1.05], [en.b29, 1000, 360, 1.05]] },
    { desde: en.b29, transicion: 'paneo', ...jack, viento: .15, decorado: [{ tipo: 'plano', color: '#4a3a2e', raya: 'rgba(0,0,0,.25)', luz: 'rgba(255,210,150,.1)', par: .2 }, { tipo: 'suelo', par: 1, matas: 0 }],
      delante: [{ tipo: 'calendario', x: 640, y: 380, en: VEINTE, cada: (TREINTA - VEINTE) / 11, anos: [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030], sello: 'PRORROGADO', escala: 1.05 }],
      camara: [[en.b29, 700, 380, 1.35], [en.b29 + 2.2, 640, 370, 1.05], [en.b30, 640, 360, 1]] },
    { desde: en.b30, ...jack, viento: .2, decorado: [invierno, { tipo: 'congreso', x: 280, escala: .75, par: .9 }, { tipo: 'bloque', x: 960, cols: 5, pisos: 5, todas: ALQUILAR, par: 1 }, { tipo: 'suelo', par: 1, matas: 0 }],
      delante: [{ tipo: 'caja', de: [300, 230], a: [640, 470], cae: PASA - .8, texto: 'VIVIENDA SOCIAL', escala: .8 },
        { tipo: 'columnas', x: 640, y: 250, max: 150, escala: .7, sep: 70, ancho: 80, panel: true, desde: en.b31, hogares: [[0, .95]], casas: [[EMPEORA - .3, .4], [EMPEORA, .3]], hueco: en.b31, etiquetas: ['HOG.', 'CASAS'] }],
      actores: [{ p: PR, x: 640, mira: -1, acciones: [{ hace: 'recibe', en: PASA - .1, hasta: PASA + 1.5 }, { hace: 'agacha', en: PASA + .2, hasta: PASA + 1, g: .5 }, { hace: 'gira', en: ALQUILAR - .6 }] }],
      camara: [[en.b30, 480, 360, 1.05], [PASA, 600, 400, 1.2], [ALQUILAR, 860, 360, 1.05], [EMPEORA, 700, 300, 1.15], [en.b32, 700, 320, 1.1]] },
    { desde: en.b32, ...jack, viento: .2, decorado: [invierno, { tipo: 'suelo', par: 1, matas: 0 }],
      delante: [{ tipo: 'puertaCasa', x: 380, rotulo: 'TU CASA' }, { tipo: 'puertaCasa', x: 900, rotulo: 'CASA VACÍA', forzada: true },
        { tipo: 'sello', en: JUICIO, x: 640, y: 300, texto: 'JUICIO RÁPIDO', ancho: 460, escala: .85 }],
      camara: [[en.b32, 640, 360, 1], [JUICIO, 640, 340, 1.08], [G.fin, 640, 360, 1.02]] },
  ],
};
