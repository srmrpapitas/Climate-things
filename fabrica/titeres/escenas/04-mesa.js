// Españistán ep. 4 · secuencia G, «La mesa» (bloques 27–32). Estilo `jack`, 30 fps. Tiempos: tiempos-04.js (estimados hasta que exista la voz).
// Datos: 04-bipartidismo.md (art. 135 en 2011, CGPJ 11 + 9, mensaje de Cosidó de 2018, acuerdo de Bruselas del 25-6-2024 10 + 10, Montesquieu).
//   b27     «Ahora, la mesa»: el salón en calma. «en lo grande» → corte al plató, Sanchís y Feijolo a gritos. «se ponen de acuerdo» → corte seco: los dos, tranquilos, a la mesa.
//   b28     (viento) agosto de 2011: Zapatitos y Rajoyo se dan la mano sobre la Constitución; «la deuda» → la pila de monedas cae encima del libro;
//           «sin referéndum» → calma, la cortina se corre sobre el ventanal y la cuerda hace su segundo nudo.
//   b29     los jueces: veinte togas en la mesa; «once… nueve» → el pastel se corta y las togas se tiñen.
//   b30     el móvil vibra en la mesa («mensaje») y sale el texto con su fuente.
//   b31     «saltó» → el pastel se cae; «cinco años y medio» → el reloj corre y salen telarañas; «Bruselas» → baja el estandarte de las estrellas;
//           «diez para cada uno» → pastel nuevo 10/10 y tercer nudo.
//   b32     (viento) Montesquieu: una balanza GOBIERNO / JUECES que se frena sola. Pregunta del Decano: baja una mano y tira del plato de los jueces.
const G = T.guion([27, 28, 29, 30, 31, 32]), en = G.en;
const SA = PERSONAJES.sanchis, FE = PERSONAJES.feijolo, ZA = PERSONAJES.zapatitos, RA = PERSONAJES.rajoyo, DE = PERSONAJES.decano;
const grande = p => ({ ...p, escala: 1.3 });   // detrás de la mesa: más grandes, para que el mantel les llegue a la cintura
const jack = { jack: true, quieto: true, figura: '#2b2522', sombra: 9, contraluz: 0, bordes: ['rgb(255,226,190)', 'rgb(255,120,70)'], borde: .7 };
// palabras clave (segundos dentro de su frase, a 14 letras/s; afinar con el audio real)
const GRANDE = G.x('b27', 1.4), ACUERDO = G.x('b27', 4.3), PACTAN = G.x('b28', 3.2), DEUDA = G.x('b28.2', .8), REFERENDUM = G.x('b28.3', 3);
const JUECES = G.x('b29', .3), ONCE = G.x('b29.3', 2.1), MENSAJE = G.x('b30', 5.6), SALTO = G.x('b31', .9), CINCO = G.x('b31', 2.6);
const BRUSELAS = G.x('b31.3', 2.8), DIEZ = G.x('b31.3', 6), FRENA = G.x('b32', 5.5), VIGILADOS = G.x('b32.2', 3);
const nota = (en0, hasta, titulo, filas, fuente, ancho = 560, y = 425) => ({ en: en0, hasta, x: 40, y, ancho, titulo, filas, fuente });   // abajo, sobre el mantel: arriba están las caras
const velas = [[200, 0], [1080, 0], [260, 1], [1020, 1]];
const cuerda = { tipo: 'cuerda', x0: -60, y0: 30, x1: 1340, y1: 50, comba: 50, grosor: 9, nudos: [{ u: .3, en: -9 }, { u: .5, en: REFERENDUM }, { u: .7, en: DIEZ }], par: 1 };
const salon = (extra = {}) => ({ tipo: 'salon', sinMesa: true, lluvia: .7, par: 1, ...extra });
window.ESCENA = {
  dura: G.fin, fps: 30, suelo: 600, voces: G.voces,
  silencios: [[REFERENDUM - .7, REFERENDUM], [SALTO - .7, SALTO]],
  sonidos: [
    { en: 0, hasta: GRANDE, archivo: 'audio/sfx/lluvia.mp3', volumen: .2, bucle: true },
    { en: GRANDE, hasta: ACUERDO, archivo: 'audio/sfx/grada.mp3', volumen: .35, bucle: true },
    { en: ACUERDO, hasta: en.b32, archivo: 'audio/sfx/lluvia.mp3', volumen: .2, bucle: true }, { en: en.b28 - .2, archivo: 'audio/sfx/viento.mp3', volumen: .3 },
    { en: DEUDA, archivo: 'audio/sfx/impacto.mp3', volumen: .5 }, { en: REFERENDUM, archivo: 'audio/sfx/trueno.mp3', volumen: .7 }, { en: REFERENDUM, archivo: 'audio/sfx/impacto.mp3', volumen: .5 },
    { en: JUECES, archivo: 'audio/sfx/whoosh.mp3', volumen: .2 }, { en: ONCE, archivo: 'audio/sfx/whoosh.mp3', volumen: .3 }, { en: MENSAJE, archivo: 'audio/sfx/impacto.mp3', volumen: .2 },
    { en: SALTO, archivo: 'audio/sfx/derrumbe.mp3', volumen: .6 }, { en: SALTO + .9, archivo: 'audio/sfx/cristales.mp3', volumen: .4 }, { en: CINCO, archivo: 'audio/sfx/viento.mp3', volumen: .25 },
    { en: BRUSELAS, archivo: 'audio/sfx/whoosh.mp3', volumen: .3 }, { en: DIEZ, archivo: 'audio/sfx/campana.mp3', volumen: .4 }, { en: DIEZ, archivo: 'audio/sfx/impacto.mp3', volumen: .4 },
    { en: en.b32 - .2, archivo: 'audio/sfx/viento.mp3', volumen: .3 }, { en: en.b32, hasta: G.fin, archivo: 'audio/sfx/viento.mp3', volumen: .12, bucle: true },
    { en: VIGILADOS - 1.2, archivo: 'audio/sfx/riser.mp3', volumen: .3 }],
  carteles: [
    nota(G.x('b28', .4), en['b28.3'] - .2, 'Agosto de 2011', [['Pacto PSOE–PP', 'reforma del art. 135'], ['La deuda', 'se paga antes que lo demás', '#7a1410']], 'Propuesta del 23-08-2011'),
    nota(G.x('b28.3', .2), en.b29 - .2, 'Artículo 135', [['Congreso', '02-09-2011'], ['Senado', '07-09-2011'], ['Referéndum', 'no', '#7a1410']], 'BOE 27-09-2011 · art. 167.3 de la Constitución'),
    nota(G.x('b29', .4), en.b30 - .2, 'Consejo General del Poder Judicial', [['Vocales', '20'], ['Los eligen', 'Congreso y Senado'], ['Reparto habitual', '11 + 9']], 'Ley Orgánica del Poder Judicial'),
    nota(en['b30.2'], en.b31 - .2, 'Mensaje del portavoz del PP en el Senado', [['«…controlando la sala segunda', ''], ['desde detrás…»', '']], 'Prensa, noviembre de 2018 · él dijo que lo reenviaba', 600),
    nota(CINCO, en['b31.3'] - .2, 'El Consejo, sin renovar', [['Mandato caducado', 'diciembre de 2018'], ['Bloqueo', '5 años y medio', '#7a1410']], 'CGPJ'),
    nota(BRUSELAS, en.b32 - .2, '25-06-2024, Bruselas', [['Acuerdo PSOE–PP', 'ante la Comisión Europea'], ['Reparto', '10 + 10']], 'Texto del acuerdo, 25-06-2024'),
    nota(G.x('b32', .5), en['b32.2'] - .2, 'Montesquieu · Del espíritu de las leyes, 1748', [['«Para que no se pueda abusar del poder…', ''], ['…el poder frene al poder»', '']], 'libro XI, capítulo 4', 640, 40),
  ],
  planos: [
    // b27: el salón en calma
    { desde: 0, ...jack, viento: 0, borde: .3, decorado: [salon()], delante: [{ tipo: 'banquete', velas, par: 1 }],
      camara: [[0, 640, 360, 1], [GRANDE, 640, 380, 1.06]] },
    // «en lo grande»: el plató, a gritos
    { desde: GRANDE, ...jack, viento: 0, borde: .6, decorado: [{ tipo: 'plano', color: '#16213a', raya: 'rgba(0,0,0,.3)', luz: 'rgba(120,170,255,.08)', par: .2 },
        { tipo: 'letrero', x: 640, y: 150, ancho: 520, texto: 'CARA A CARA', enciende: GRANDE, tam: 38, par: .6 }, { tipo: 'suelo', par: 1, matas: 0 }],
      delante: [{ tipo: 'atril', x: 420, par: 1 }, { tipo: 'atril', x: 860, par: 1 }],
      actores: [{ p: SA, x: 420, mira: 1, acciones: [{ hace: 'habla', en: GRANDE, hasta: ACUERDO }, { hace: 'puno', en: GRANDE + .4, hasta: GRANDE + 1.6 }] },
        { p: FE, x: 860, mira: -1, acciones: [{ hace: 'habla', en: GRANDE + .2, hasta: ACUERDO }, { hace: 'senala', en: GRANDE + 1.2, hasta: ACUERDO }] }],
      camara: [[0, 640, 360, 1.1], [ACUERDO, 640, 350, 1.18]] },
    // «se ponen de acuerdo»: corte seco, los dos tranquilos a la mesa
    { desde: ACUERDO, ...jack, viento: 0, borde: .3, decorado: [salon()], delante: [{ tipo: 'banquete', velas, par: 1 }],
      actores: [{ p: grande(SA), x: 470, mira: 1, acciones: [{ hace: 'asiente', en: ACUERDO + .3, hasta: ACUERDO + 1.3 }] },
        { p: grande(FE), x: 810, mira: -1, acciones: [{ hace: 'asiente', en: ACUERDO + .5, hasta: ACUERDO + 1.5 }] }],
      camara: [[0, 640, 380, 1.05], [en.b28, 640, 370, 1]] },
    // b28: agosto de 2011, la Constitución y la deuda; «sin referéndum» → cortina y segundo nudo
    { desde: en.b28 - .2, transicion: 'viento', ...jack, viento: 0, borde: .3, decorado: [salon({ cortina: REFERENDUM, lluvia: .9 })],
      delante: [{ tipo: 'banquete', velas, sinPastel: true, libro: 0, monedas: DEUDA, par: 1 }, cuerda],
      actores: [{ p: grande(ZA), x: 500, mira: 1, acciones: [{ hace: 'mano', en: PACTAN, hasta: PACTAN + 2.6, h: .1 }] },
        { p: grande(RA), x: 780, mira: -1, acciones: [{ hace: 'mano', en: PACTAN, hasta: PACTAN + 2.6, h: -.1 }] }],
      camara: [[0, 640, 360, 1], [PACTAN, 640, 330, 1.12], [DEUDA - .1, 640, 300, 1.28], [en['b28.3'], 640, 330, 1.1], [REFERENDUM - .8, 640, 300, 1.02], [REFERENDUM + 1, 640, 330, 1]] },
    // b29–b31: la mesa de los jueces (el mismo salón, con la cortina corrida)
    { desde: en.b29 - .1, ...jack, viento: 0, borde: .3, decorado: [salon({ cortina: -9, lluvia: 1 }), { tipo: 'reloj', x: 1190, y: 170, corre: CINCO, para: en['b31.3'], par: 1 },
        { tipo: 'estandarte', x: 640, y: 50, en: BRUSELAS, par: 1 }],
      delante: [{ tipo: 'banquete', velas, togas: JUECES, cortes: [{ en: ONCE, partes: [11, 9] }], movil: MENSAJE, cae: SALTO, vuelve: DIEZ - .5, cortes2: [{ en: DIEZ, partes: [10, 10] }], par: 1 },
        { tipo: 'telaranas', en: CINCO + .3, hasta: DIEZ, par: 1 }, cuerda],
      camara: [[0, 640, 400, 1.4], [ONCE + 1, 640, 410, 1.35], [MENSAJE - .3, 760, 460, 1.4], [MENSAJE + .4, 1060, 450, 2], [en.b31 - .1, 1060, 450, 2.05],
        [G.x('b31', .1), 640, 400, 1.15], [CINCO + .5, 640, 360, 1], [BRUSELAS - .3, 640, 360, 1], [DIEZ - .6, 640, 400, 1.15], [en.b32, 640, 390, 1.1]] },
    // b32: Montesquieu, el poder frena al poder; la pregunta del Decano: una mano tira del plato de los jueces
    { desde: en.b32 - .2, transicion: 'viento', ...jack, viento: .1, decorado: [{ tipo: 'plano', color: '#2a1d16', raya: 'rgba(0,0,0,.35)', luz: 'rgba(255,210,150,.08)', par: .2 },
        { tipo: 'astro', x: 640, y: 300, r: 200, par: .9 },
        { tipo: 'mano', x: 865, baja: [VIGILADOS - 1.2, -480, 150], escala: .9, hilos: [[850, 480], [858, 480], [866, 480], [874, 480]], crecen: VIGILADOS, par: 1 },
        { tipo: 'balanza', x: 640, y: 640, escala: .9, izq: ['GOBIERNO'], der: ['JUECES'], izqEn: [0], derEn: [0],
          pesos: [[G.x('b32', .5), .9], [G.x('b32', 2.5), -.9], [FRENA, 0], [VIGILADOS + .4, -1]], par: 1 }, { tipo: 'suelo', par: 1, matas: 0 }],
      actores: [{ p: DE, x: 1400, mira: -1, acciones: [{ hace: 'camina', en: en['b32.2'] - .3, hasta: G.x('b32.2', 1.5), a: 1190 }, { hace: 'senala', en: VIGILADOS, hasta: G.fin }] }],
      camara: [[0, 640, 400, 1.15], [FRENA, 640, 390, 1.2], [VIGILADOS - 1.3, 720, 360, 1.15], [G.fin, 770, 340, 1.25]] },
  ],
};
