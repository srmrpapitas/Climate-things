// Españistán ep. 6 · secuencia 3, «La cuenta» (bloques 4–7). `cartoon`, amanecer. Plan: CAPITULO-06-PLANOS.md.
//   b4   amanecer: el cartel «SE BUSCAN MANOS» cuelga solo; en «personas», cinco personas se forman con hojas que trae el viento.
//   b5   (sin cortar) la cámara se aleja: cinco figuras, una se enciende; luego cincuenta, y se encienden diez («uno de cada cinco»).
//   b6   «papeles» → casi todas levantan su papel; «veintidós mil» → la cámara baja al mar: una patera pequeñita, para la escala.
//   b7   (viento) el mapa: Canarias se apaga a la mitad, Baleares se pone en rojo: «primera ruta».
const G = T.guion([4, 5, 6, 7]), en = G.en, k = G.k, P = PERSONAJES;
const cartoon = { cartoon: true, jack: true, figura: '#2b2235', sombra: 8, contraluz: 0, bordes: ['rgb(150,210,255)', 'rgb(255,150,90)'], borde: .8 };
const OBRA = k(4, 'mano de obra'), PERSONAS = k(4, 'vinieron'), DIEZ = k(5, 'diez millones'), CINCO = k(5, 'Uno de cada'), PAPELES = k(6, 'papeles'),
  VEINTIDOS = k(6, 'veintidós'), CANARIAS = k(7, 'Canarias'), MITAD = k(7, 'mitad'), BALEARES = k(7, 'Baleares'), RUTA = k(7, 'primera');
const nota = (en0, hasta, titulo, filas, fuente, x = 40) => ({ en: en0, hasta, x, y: 40, ancho: 440, titulo, filas, fuente });
const alba = [{ tipo: 'cieloNoche', arriba: '#2a2a6a', abajo: '#f39a5a', n: 25, par: .2 }, { tipo: 'astro', x: 1000, y: 470, r: 70, par: .25 }, { tipo: 'montes', tono: .25, par: .45, y: 560 }, { tipo: 'suelo', par: 1, matas: 5 }];
const gente = [0, 1, 2, 3, 4].map(i => ({ p: ciudadano(600 + i, { escala: .85 }), x: 380 + i * 130, mira: i < 2 ? 1 : -1, forma: { aparece: PERSONAS - .2 + .25 * i, dura: 1.3 },
  acciones: [{ hace: i % 2 ? 'saluda' : 'encoge', en: PERSONAS + 1.6 + .2 * i, hasta: PERSONAS + 3 }], hasta: en.b5 + .3 }));
window.ESCENA = {
  dura: G.fin, fps: 30, suelo: 600, voces: G.voces,
  sonidos: [
    { en: 0, hasta: en.b7, archivo: 'audio/sfx/viento.mp3', volumen: .22, bucle: true }, { en: PERSONAS - .3, archivo: 'audio/sfx/whoosh.mp3', volumen: .35 },
    { en: CINCO, archivo: 'audio/sfx/eleven/pop.mp3', volumen: .4 }, { en: PAPELES + .1, archivo: 'audio/sfx/eleven/brillo.mp3', volumen: .35 },
    { en: VEINTIDOS - .3, hasta: en.b7, archivo: 'audio/sfx/ola.mp3', volumen: .3, bucle: true },
    { en: en.b7 - .3, archivo: 'audio/sfx/whoosh.mp3', volumen: .4 }, { en: RUTA, archivo: 'audio/sfx/impacto.mp3', volumen: .35 }],
  carteles: [
    nota(en.b4 + .3, en.b5 - .3, 'Max Frisch, escritor suizo (1965)', [['«Queríamos mano de obra', ''], ['y vinieron personas»', '', '#7a1410']], 'Prólogo de «Siamo Italiani»', 830),
    nota(DIEZ + .2, PAPELES - .4, 'Nacidos fuera de Españistán', [['1-1-2026', '10.004.581', '#7a1410'], ['De la población', '1 de cada 5']], 'INE, Estadística Continua de Población', 830),
    nota(VEINTIDOS - .2, en.b7 - .3, 'Entradas irregulares', [['Hasta el 15-9-2026', '21.906', '#7a1410'], ['Frente a 2025', '−16,5 %']], 'Ministerio del Interior', 830),
    nota(MITAD - .2, G.fin - .3, 'Rutas por mar', [['Canarias', '−44,5 %'], ['Baleares', '1.ª ruta', '#7a1410']], 'Interior, a 30-9-2026', 800),
  ],
  planos: [
    { desde: 0, ...cartoon, viento: .5, decorado: alba,
      delante: [{ tipo: 'letrero', x: 640, y: 210, texto: 'SE BUSCAN MANOS', enciende: OBRA - .4, ancho: 460 },
        { tipo: 'figuras', aparece: en.b5 + .2, n: 5, x: 640, y: 560, alto: 120, paso: 140, encienden: [[CINCO - 1.2, 1, '#f0a03a', '1 DE CADA 5']], hasta: CINCO + .4 },
        { tipo: 'figuras', aparece: CINCO + .3, n: 50, cols: 10, x: 640, y: 590, alto: 62, paso: 66, encienden: [[CINCO + .7, 10, '#f0a03a']], papeles: PAPELES + .1, sinPapel: 12 },
        { tipo: 'patera', en: VEINTIDOS - .4, llega: en.b7, de: 1500, a: 760, y: 690, escala: .35 }],
      particulas: [{ tipo: 'hojas', n: 18 }],
      actores: gente,
      camara: [[0, 640, 300, 1.25], [PERSONAS, 640, 380, 1.12], [en.b5, 640, 380, 1], [CINCO + .3, 640, 330, 1], [VEINTIDOS - .5, 640, 360, 1], [VEINTIDOS + 1, 760, 560, 1.7], [en.b7, 780, 600, 1.9]] },
    { desde: en.b7 - .2, transicion: 'viento', ...cartoon, viento: .4, decorado: [{ tipo: 'cieloNoche', arriba: '#1b2a5a', abajo: '#4b7ab0', n: 10, par: .2 }],
      delante: [{ tipo: 'mapa05', x: 600, y: 360, ancho: 640, puntos: [[CANARIAS, .08, .96, 'CANARIAS', true], [MITAD, .08, .96, '−44 %'], [BALEARES, .86, .52, 'BALEARES', true], [RUTA, .86, .52, '1.ª RUTA POR MAR', true]] },
        { tipo: 'patera', en: CANARIAS - .5, llega: MITAD + 1, de: -100, a: 230, y: 650, escala: .45 }, { tipo: 'patera', en: BALEARES - .3, llega: RUTA + 1.5, de: 1400, a: 1040, y: 330, escala: .45 },
        { tipo: 'patera', en: BALEARES + .2, llega: RUTA + 2, de: 1450, a: 1100, y: 390, escala: .35 }],
      camara: [[en.b7, 620, 380, 1.05], [MITAD, 420, 470, 1.25], [BALEARES, 820, 340, 1.2], [G.fin, 640, 360, 1]] },
  ],
};
