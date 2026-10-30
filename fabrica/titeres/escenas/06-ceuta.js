// Españistán ep. 6 · secuencia 4, «Ceuta» (bloques 8–10). `cartoon`. Plan: CAPITULO-06-PLANOS.md.
//   b8   noche: el móvil gigante; «bulo» → la burbuja «ESPAÑA DA ASILO A TODOS» y los «me gusta» que suben. La cámara entra en la pantalla.
//   b9   metamorfosis: la pantalla se deshace en tinta y dibuja la playa al amanecer. «Miles» → los nadadores entran en oleadas;
//        «policía marroquí» → dos guardias (con su nombre) se apartan y se cruzan de brazos.
//   b10  «ya había vuelto» → los nadadores se van nadando hacia la izquierda, deprisa; la playa se queda vacía.
//        La pregunta del Decano (metamorfosis en hojas): la cancela de la frontera; una mano gigante, «el vecino», la abre y la cierra a su antojo.
const G = T.guion([8, 9, 10]), en = G.en, k = G.k, P = PERSONAJES;
const cartoon = { cartoon: true, jack: true, figura: '#2b2235', sombra: 8, contraluz: 0, bordes: ['rgb(150,210,255)', 'rgb(255,150,90)'], borde: .8 };
const BULO = k(8, 'bulo'), ASILO = k(8, 'asilo'), MILES = k(9, 'Miles'), POLICIA = k(9, 'policía'), PARA = k(9, 'no los para'), VUELTO = k(10, 'vuelto'),
  QUEDO = k(10, 'se quedó'), DECANO = en['b10.3'] ?? k(10, 'Pregunta'), VECINO = k(10, 'vecino'), ABRIR = k(10, 'abrir'), CERRAR = k(10, 'cerrar'), MANDA = k(10, 'quién manda');
const nota = (en0, hasta, titulo, filas, fuente, x = 830) => ({ en: en0, hasta, x, y: 40, ancho: 420, titulo, filas, fuente });
const guardia = (x, n) => ({ p: ciudadano(700 + n, { sombrero: 'gorra', escala: .8 }), x, mira: n ? -1 : 1, acciones: [{ hace: 'camina', en: POLICIA - .2, hasta: POLICIA + 1, a: x + (n ? 120 : -120) },
  { hace: 'gira', en: POLICIA + 1.1 }, { hace: 'brazos', en: PARA - .2, hasta: VUELTO, h: .9, c: 1.9, h2: .9, c2: 1.9, mano: 'puno' }] });
window.ESCENA = {
  dura: G.fin, fps: 30, suelo: 600, voces: G.voces,
  silencios: [[QUEDO, DECANO]],
  sonidos: [
    { en: 0, hasta: en.b9, archivo: 'audio/sfx/dron.mp3', volumen: .2, bucle: true }, { en: BULO, archivo: 'audio/sfx/eleven/enviar.mp3', volumen: .5 },
    { en: ASILO, archivo: 'audio/sfx/eleven/pop.mp3', volumen: .4 }, { en: en.b9 - 1.2, archivo: 'audio/sfx/whoosh.mp3', volumen: .4 },
    { en: en.b9, hasta: DECANO, archivo: 'audio/sfx/ola.mp3', volumen: .4, bucle: true }, { en: MILES, hasta: VUELTO, archivo: 'audio/sfx/panico.mp3', volumen: .18, bucle: true },
    { en: DECANO - .3, hasta: G.fin, archivo: 'audio/sfx/viento.mp3', volumen: .25, bucle: true },
    { en: ABRIR, archivo: 'audio/sfx/eleven/tic.mp3', volumen: .5 }, { en: CERRAR, archivo: 'audio/sfx/eleven/tic.mp3', volumen: .5 }, { en: MANDA, archivo: 'audio/sfx/impacto.mp3', volumen: .4 }],
  carteles: [
    nota(ASILO + .5, en.b9 - .3, 'El bulo', [['«España da asilo', ''], ['a todo el que entre»', 'FALSO', '#7a1410']], 'Infobae, 2-8-2026'),
    nota(VUELTO - .2, QUEDO + .6, 'Después', [['Entradas', '72.000'], ['Retornos', '48.300', '#7a1410']], 'Interior, 4-8-2026'),
  ],
  planos: [
    { desde: 0, ...cartoon, decorado: [{ tipo: 'cieloNoche', arriba: '#0b0b22', abajo: '#2b1d4d', par: .2 }],
      delante: [{ tipo: 'movil', aparece: .2, en: BULO + .2, x: 640, y: 660, escala: 1.05, texto: 'ESPAÑA DA ASILO\nA TODOS' }],
      particulas: [{ tipo: 'estrellas', n: 40 }],
      camara: [[0, 640, 380, 1], [ASILO, 640, 330, 1.2], [en.b9, 640, 300, 1.5]] },
    { desde: en.b9 - .2, transicion: 'metamorfosis', ...cartoon, viento: .3, decorado: [{ tipo: 'cieloNoche', arriba: '#2a2a6a', abajo: '#f39a5a', n: 15, par: .2 }, { tipo: 'astro', x: 300, y: 430, r: 60, par: .25 }, { tipo: 'playa', y: 560, par: .8 }],
      delante: [{ tipo: 'nadadores', n: 120, en: MILES - .3, oleadas: 2.5, zona: [-200, 1250, 390, 545], vuelven: VUELTO - .3 },
        { tipo: 'nombre', x: 1080, y: 330, texto: 'Policía marroquí', en: POLICIA + .1, hasta: VUELTO - .2 }],
      actores: [guardia(1000, 0), guardia(1160, 1)],
      camara: [[en.b9, 640, 420, 1.3], [MILES + 1, 640, 380, 1.02], [POLICIA, 960, 400, 1.2], [VUELTO, 640, 380, 1], [QUEDO + .4, 640, 400, .98]] },
    { desde: DECANO - .2, transicion: 'metamorfosis', materia: 'hojas', ...cartoon, viento: .5, decorado: [{ tipo: 'cieloNoche', arriba: '#1d2050', abajo: '#e2885a', n: 10, par: .2 }, { tipo: 'playa', y: 560, calma: .7, par: .8 }],
      delante: [{ tipo: 'cancela', x: 760, y: 600, texto: 'TU FRONTERA', mano: 'el vecino', abre: [[ABRIR, 1], [ABRIR + .9, 0], [CERRAR, 1], [CERRAR + .7, 0], [MANDA - .4, 1], [MANDA + .5, 0]] }],
      particulas: [{ tipo: 'hojas', n: 25 }],
      actores: [{ p: P.decano, x: 260, mira: 1, acciones: [{ hace: 'senala', en: VECINO, hasta: CERRAR + .5 }, { hace: 'miraCamara', en: MANDA - .3, hasta: G.fin }] }],
      camara: [[DECANO, 620, 380, 1.15], [VECINO, 820, 300, 1.2], [MANDA - .5, 600, 380, 1.05], [G.fin, 480, 400, 1.18]] },
  ],
};
