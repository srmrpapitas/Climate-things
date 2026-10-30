// Españistán ep. 7 · secuencia 12, «Final» (bloques 49–50). `cartoon`, 60 fps. La pizarra del principio, ahora de día.
//   b49  «Cinco céntimos» → el trapo cae y se ve la respuesta; «el segundo» → reloj de arena de un segundo.
//   b50  la cámara se aleja: el aula entera en círculo, Lucía y Dani discuten; «preguntes, compruebes, votes» → tres burbujas.
//        «tu pensión» → viento: la hucha de las pensiones que se vacía, con el rótulo del próximo capítulo.  → OUTRO
const G = T.guion([49, 50]), en = G.en, k = G.k, P = PERSONAJES;
const cartoon = { cartoon: true, jack: true, figura: '#2b2235', sombra: 8, contraluz: 0, bordes: ['rgb(150,210,255)', 'rgb(255,150,90)'], borde: .8 };
const CINCO = k(49, 'Cinco'), BATE = k(49, 'El bate'), JUNTOS = k(49, 'Juntos'), SEGUNDO = k(49, 'segundo'), ESCUELA = en.b50, LEYES = k(50, 'leyes'), PREGUNTES = k(50, 'preguntes'),
  COMPRUEBES = k(50, 'compruebes'), VOTES = k(50, 'que votes'), PROXIMO = k(50, 'próximo'), ESTAFA = k(50, 'estafa'), DATOS = k(50, 'datos');
window.ESCENA = {
  dura: G.fin + .6, fps: 60, suelo: 600, voces: G.voces,
  sonidos: [{ en: CINCO - .1, archivo: 'audio/sfx/whoosh.mp3', volumen: .3 }, { en: SEGUNDO, archivo: 'audio/sfx/eleven/tic.mp3', volumen: .35 }, { en: ESCUELA, hasta: PROXIMO, archivo: 'audio/sfx/grada.mp3', volumen: .08, bucle: true },
    ...[PREGUNTES, COMPRUEBES, VOTES].map(t => ({ en: t, archivo: 'audio/sfx/eleven/pop.mp3', volumen: .3 })), { en: PROXIMO - .6, archivo: 'audio/sfx/whoosh.mp3', volumen: .35 },
    { en: ESTAFA, archivo: 'audio/sfx/trueno.mp3', volumen: .3 }],
  planos: [
    { desde: 0, ...cartoon, decorado: [{ tipo: 'aulaHoy', dia: 1, par: .3 }],
      delante: [{ tipo: 'tiza', x: 640, y: 250, ancho: 860, alto: 330, tam: 36, paso: 66, tapado: [0, CINCO - .2],
          lineas: [[-1, 'bate + pelota = 1,10 €'], [-1, 'bate = pelota + 1 €'], [-1, 'pelota = 0,05 € · bate = 1,05 €', '#ffd060']] },
        { tipo: 'relojArena', en: SEGUNDO - .2, dura: 1, x: 1140, y: 560, escala: .7 }, { tipo: 'burbuja', x: 1140, y: 230, texto: '1 segundo', en: SEGUNDO, hasta: ESCUELA - .2, ancho: 220, tam: 28 }],
      camara: [[0, 640, 300, 1.35], [CINCO, 640, 300, 1.35], [JUNTOS, 640, 320, 1.2], [SEGUNDO, 900, 380, 1.1]] },
    { desde: ESCUELA - .3, ...cartoon, decorado: [{ tipo: 'aulaHoy', dia: 1, par: .3 }],
      delante: [{ tipo: 'pupitres', epoca: 'hoy', filas: 3, cols: 4, ninos: true, y: 640, circulo: 1 },
        { tipo: 'burbuja', x: 330, y: 150, texto: 'pregunta', en: PREGUNTES, hasta: PROXIMO - .3, ancho: 210, tam: 30 },
        { tipo: 'burbuja', x: 640, y: 120, texto: 'comprueba', en: COMPRUEBES, hasta: PROXIMO - .3, ancho: 230, tam: 30 },
        { tipo: 'burbuja', x: 950, y: 150, texto: 'vota', en: VOTES, hasta: PROXIMO - .3, ancho: 170, tam: 30, color: '#2c5a2c' }],
      actores: [{ p: P.lucia, x: 560, y: -20, mira: 1, acciones: [{ hace: 'habla', en: ESCUELA + .3, hasta: LEYES }, { hace: 'senala', en: LEYES, hasta: PREGUNTES }] },
        { p: P.dani, x: 720, y: -20, mira: -1, acciones: [{ hace: 'piensa', en: ESCUELA + .5, hasta: LEYES }, { hace: 'asiente', en: LEYES + .2, hasta: PREGUNTES + 1 }] }],
      camara: [[ESCUELA, 640, 400, 1.3], [LEYES, 640, 400, 1], [VOTES + 1, 640, 380, .96]] },
    { desde: PROXIMO - .3, transicion: 'viento', ...cartoon, viento: .4, decorado: [{ tipo: 'cieloNoche', arriba: '#1c1a2c', abajo: '#6a3a4a', n: 20, par: .2 }, { tipo: 'suelo', par: 1, matas: 2 }],
      delante: [{ tipo: 'huchaGrande', x: 640, y: 600, escala: .9, vacia: ESTAFA - .2 }, { tipo: 'nombre', x: 640, y: 110, texto: 'Próximo capítulo · Las pensiones', en: PROXIMO, hasta: G.fin + .6 },
        { tipo: 'burbuja', x: 1030, y: 260, texto: '¿estafa?', en: ESTAFA, hasta: G.fin + .6, ancho: 220, tam: 32, color: '#7a1410' }],
      particulas: [{ tipo: 'hojas', n: 20, zona: [-100, 150, 1380, 520] }],
      camara: [[PROXIMO, 640, 380, 1.05], [DATOS, 640, 400, 1.15]] },
  ],
};
