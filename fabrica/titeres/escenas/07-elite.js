// Españistán ep. 7 · secuencia 7, «Cómo aprende la élite» (bloques 20–30). `cartoon`, 60 fps. Cada vez menos alumnos por adulto.
//   b20–21 el aula de 30; «Aristóteles» → viento al ágora: Aristóteles y Alejandro, uno a uno.
//   b22–23 la campana de Gauss: la del tutor se desplaza dos desviaciones; «noventa y ocho» → 98 %; «Matiz» → encoge a 0,37 y sigue a la derecha.
//   b24    viento → el claustro: veinte chisteras en fila (los primeros ministros de Eton).
//   b25    la mesa ovalada de Exeter vista desde arriba: las flechas van de alumno a alumno; el profesor, en gris.
//   b26    el estudio de Oxford: Lucía lee su ensayo y el tutor la interrumpe. Plutarco: el vaso que rebosa y la leña que prende.
//   b27–28 viento → el aula Waldorf: madera, lana y nada de pantallas; el niño Montessori y su pregunta.
//   b29    «¿Cómo sabes lo que sabes?»; «respuestas» / «preguntas» → las filas de pupitres se doblan en un círculo.
//   b30    las dos mochilas: el método pesa menos que el dinero y los contactos; «No veinte buenos» → las chisteras caen como fichas de dominó.
const G = T.guion([20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]), en = G.en, k = G.k, P = PERSONAJES;
const cartoon = { cartoon: true, jack: true, figura: '#2b2235', sombra: 8, contraluz: 0, bordes: ['rgb(150,210,255)', 'rgb(255,150,90)'], borde: .8 };
const aristoteles = { ropa: 'tunica', pelo: 'corto', barba: 'larga', nariz: 1.1, narizForma: 'recta', menton: 'marcado', arrugas: .7, alto: 1.02, grueso: .95, piernas: 1.06, jirones: true, semilla: 131 };
const alejandro = { ropa: 'tunica', pelo: 'loco', nariz: .95, narizForma: 'recta', menton: 'marcado', alto: .82, grueso: .85, piernas: 1.05, jirones: true, semilla: 137 };
const tutor = { ropa: 'traje', pelo: 'entradas', gafas: 'redondas', barba: 'corta', nariz: 1.1, narizForma: 'aguilena', arrugas: .6, alto: 1, grueso: .95, semilla: 139 };
const plutarco = { ropa: 'tunica', pelo: 'calvo', barba: 'larga', nariz: 1.05, narizForma: 'aguilena', arrugas: .9, alto: .98, grueso: .95, jirones: true, semilla: 149 };
const nino = ciudadano(707, { escala: .62 });
const TREINTA = k(21, 'treinta'), ARISTOTELES = k(21, 'Aristóteles'), BLOOM = k(22, 'Bloom'), TUTOR = k(22, 'Un tutor'), DOMINAR = k(22, 'dominar'), NOVENTA = k(22, 'noventa'),
  MATIZ = en.b23, MILES = k(23, 'miles'), ETON = k(24, 'Eton'), VEINTE = k(24, 'veinte'), EXETER = k(25, 'Exeter'), DOCE = k(25, 'doce'), ARGUMENTO = k(25, 'argumento'),
  OXFORD = en.b26, DEFIENDES = k(26, 'defiendes'), PLUTARCO = k(26, 'Plutarco'), VASO = k(26, 'vaso'), ENCENDER = k(26, 'encender'), SILICON = en.b27, MADERA = k(27, 'Madera'),
  GOOGLE = k(28, 'Google'), MONTESSORI = k(28, 'Montessori'), PREGUNTAR = k(28, 'preguntar'), TEORIA = k(29, 'Teoría'), COMO_SABES = k(29, 'cómo sabes'), RESPUESTAS = k(29, 'respuestas'),
  PREGUNTAS = k(29, 'preguntas'), DINERO = k(30, 'dinero'), HABLAR = k(30, 'saber hablar'), BUENOS = k(30, 'No veinte');
const gris = { tipo: 'cieloNoche', arriba: '#1c1a2c', abajo: '#4a3a5a', n: 12, par: .2 };
window.ESCENA = {
  dura: G.fin, fps: 60, suelo: 600, voces: G.voces,
  sonidos: [{ en: 0, hasta: ARISTOTELES, archivo: 'audio/sfx/dron.mp3', volumen: .1, bucle: true }, { en: ARISTOTELES - .5, archivo: 'audio/sfx/whoosh.mp3', volumen: .35 },
    { en: NOVENTA, archivo: 'audio/sfx/riser.mp3', volumen: .25 }, { en: ETON - .6, archivo: 'audio/sfx/whoosh.mp3', volumen: .35 }, { en: ETON, hasta: OXFORD, archivo: 'audio/sfx/campana.mp3', volumen: .2 },
    { en: OXFORD, hasta: SILICON, archivo: 'audio/sfx/fuego.mp3', volumen: .08, bucle: true }, { en: ENCENDER, archivo: 'audio/sfx/eleven/brillo.mp3', volumen: .4 },
    { en: SILICON - .6, archivo: 'audio/sfx/whoosh.mp3', volumen: .35 }, { en: PREGUNTAS, archivo: 'audio/sfx/eleven/aparece.mp3', volumen: .35 },
    { en: DINERO + .2, archivo: 'audio/sfx/impacto.mp3', volumen: .3 }, ...Array.from({ length: 20 }, (_, i) => ({ en: BUENOS + .2 + i * .08, archivo: 'audio/sfx/eleven/tic.mp3', volumen: .12 }))],
  carteles: [
    { en: BLOOM - .2, hasta: MATIZ - .3, x: 60, y: 40, ancho: 470, titulo: 'Bloom, «El problema de las 2 sigmas» (1984)', fuente: 'Educational Researcher, 1984',
      filas: [['Tutor uno a uno + dominio', '+2 σ'], ['Supera a la clase normal', '98 %', '#7a1410']], tiempos: [TUTOR, NOVENTA] },
    { en: MILES - .4, hasta: ETON - .4, x: 60, y: 40, ancho: 470, titulo: 'Metaanálisis de tutorías (2020)', fuente: 'Nickow, Oreopoulos y Quan, NBER w27476', filas: [['Mejora media', '0,37 σ', '#7a1410']], tiempos: [MILES] },
    { en: EXETER + .3, hasta: OXFORD - .3, x: 60, y: 40, ancho: 440, titulo: 'Phillips Exeter · mesa Harkness', fuente: 'donación de E. Harkness, 1930', filas: [['Alumnos por mesa', '≈ 12']], tiempos: [DOCE] },
    { en: SILICON + .6, hasta: GOOGLE - .3, x: 720, y: 40, ancho: 500, titulo: 'Waldorf School of the Peninsula', fuente: 'M. Richtel, The New York Times, 22-10-2011', filas: [['Ordenadores en clase', '0']], tiempos: [SILICON + 1.2] },
    { en: GOOGLE - .1, hasta: TEORIA - .3, x: 720, y: 40, ancho: 500, titulo: 'Larry Page y Sergey Brin', fuente: 'entrevista de Barbara Walters, ABC, 2004', filas: [['Escuela', 'Montessori']], tiempos: [MONTESSORI] }],
  planos: [
    { desde: 0, ...cartoon, decorado: [{ tipo: 'aulaHoy', par: .3 }], delante: [{ tipo: 'pupitres', epoca: 'hoy', filas: 3, cols: 6, ninos: true, y: 650 }],
      camara: [[0, 640, 380, 1.05], [TREINTA, 640, 400, .98]] },
    { desde: ARISTOTELES - .3, transicion: 'viento', ...cartoon, viento: .25, decorado: [{ tipo: 'cieloNoche', arriba: '#4a3060', abajo: '#f0a060', n: 0, par: .2 }, { tipo: 'agora', par: .8 }],
      delante: [{ tipo: 'nombre', x: 520, y: 300, texto: 'Aristóteles', en: ARISTOTELES + .3, hasta: en.b22 - .2 }, { tipo: 'nombre', x: 760, y: 360, texto: 'Alejandro', en: ARISTOTELES + .8, hasta: en.b22 - .2 }],
      actores: [{ p: aristoteles, x: 520, mira: 1, acciones: [{ hace: 'senala', en: ARISTOTELES + .5, hasta: en.b22 }] }, { p: alejandro, x: 760, mira: -1, acciones: [{ hace: 'asiente', en: ARISTOTELES + 1, hasta: en.b22 }] }],
      camara: [[ARISTOTELES, 640, 380, 1.1], [en.b22, 640, 400, 1.3]] },
    { desde: en.b22 - .3, ...cartoon, decorado: [gris],
      delante: [{ tipo: 'campanaGauss', en: en.b22, x: 700, y: 560, sigma: [[TUTOR, 0], [DOMINAR + .4, 2], [MATIZ + .6, 2], [MILES + .6, .37]], cifra: [NOVENTA, '98 %'] }],
      actores: [{ p: P.decano, x: 120, mira: 1, acciones: [{ hace: 'senala', en: TUTOR, hasta: NOVENTA + 1 }, { hace: 'mano', en: MATIZ, hasta: MILES + 1.5 }] }],
      camara: [[en.b22, 640, 360, 1], [NOVENTA, 700, 340, 1.08], [MILES + 1, 700, 360, 1]] },
    { desde: ETON - .3, transicion: 'viento', ...cartoon, viento: .3, decorado: [{ tipo: 'cieloNoche', arriba: '#3a3a5a', abajo: '#e8b070', n: 0, par: .2 }, { tipo: 'claustro', par: .7 }],
      delante: [{ tipo: 'chisteras', en: VEINTE - .1, n: 20 }, { tipo: 'nombre', x: 640, y: 120, texto: 'Eton · Oxford', en: ETON, hasta: EXETER - .3 }],
      camara: [[ETON, 500, 380, 1.15], [EXETER, 760, 400, 1.05]] },
    { desde: EXETER - .3, ...cartoon, decorado: [{ tipo: 'cieloNoche', arriba: '#2a1a14', abajo: '#4a3020', n: 0, par: .2 }],
      delante: [{ tipo: 'mesaOvalada', flechas: ARGUMENTO - 1.4, profesor: true }],
      camara: [[EXETER, 640, 360, 1.15], [ARGUMENTO, 640, 360, .98]] },
    { desde: OXFORD - .3, ...cartoon, decorado: [{ tipo: 'estudioOxford', par: .4 }],
      delante: [{ tipo: 'vasoLena', x: 640, y: 600, prende: ENCENDER - .2, desde: VASO - .5 }, { tipo: 'nombre', x: 1020, y: 220, texto: 'Plutarco · siglo I', en: PLUTARCO, hasta: ENCENDER + 1 },
        { tipo: 'burbuja', x: 880, y: 180, texto: '¿por qué?', en: DEFIENDES + .3, hasta: PLUTARCO - .3, ancho: 200, tam: 32 }],
      actores: [{ p: { ...P.lucia, objeto: 'papel' }, x: 430, mira: 1, hasta: VASO - .5, acciones: [{ hace: 'habla', en: OXFORD + .5, hasta: DEFIENDES }, { hace: 'piensa', en: DEFIENDES + .5, hasta: PLUTARCO }] },
        { p: tutor, x: 860, mira: -1, hasta: VASO - .5, acciones: [{ hace: 'senala', en: DEFIENDES + .2, hasta: DEFIENDES + 1.8 }] },
        { p: plutarco, x: 1020, mira: -1, desde: VASO - .5, acciones: [{ hace: 'senala', en: ENCENDER - .4, hasta: ENCENDER + 1.4 }] }],
      camara: [[OXFORD, 640, 380, 1.05], [DEFIENDES, 720, 360, 1.18], [VASO, 700, 420, 1.05], [ENCENDER, 820, 440, 1.15]] },
    { desde: SILICON - .3, transicion: 'viento', ...cartoon, viento: .3, decorado: [{ tipo: 'aulaWaldorf', par: .3 }],
      delante: [{ tipo: 'burbuja', x: 640, y: 380, texto: '¿y por qué?', en: PREGUNTAR - .2, hasta: TEORIA - .2, ancho: 240, tam: 30 }],
      particulas: [{ tipo: 'hojas', n: 26, zona: [200, 200, 1080, 520], en: MADERA - .4, hasta: GOOGLE }],
      actores: [{ p: nino, x: 640, mira: 1, desde: GOOGLE - .3, forma: { aparece: GOOGLE - .3, dura: 1.2 }, acciones: [{ hace: 'senala', en: PREGUNTAR, hasta: TEORIA }] }],
      camara: [[SILICON, 640, 330, 1.05], [MONTESSORI, 640, 420, 1.25]] },
    { desde: TEORIA - .3, ...cartoon, decorado: [gris],
      delante: [{ tipo: 'burbuja', x: 640, y: 120, texto: '¿cómo sabes lo que sabes?', en: COMO_SABES - .2, hasta: RESPUESTAS - .2, ancho: 420, tam: 30 },
        { tipo: 'burbuja', x: 640, y: 120, texto: 'RESPUESTAS', en: RESPUESTAS - .1, hasta: PREGUNTAS - .1, ancho: 300, tam: 32, color: '#7a1410' },
        { tipo: 'burbuja', x: 640, y: 120, texto: 'PREGUNTAS', en: PREGUNTAS, hasta: en.b30 - .2, ancho: 280, tam: 32, color: '#2c5a2c' },
        { tipo: 'pupitres', epoca: 'hoy', filas: 3, cols: 4, ninos: true, y: 640, circulo: [[PREGUNTAS - .2, 0], [PREGUNTAS + 3.5, 1]] }],
      camara: [[TEORIA, 640, 380, 1.05], [PREGUNTAS + 3.5, 640, 400, .98]] },
    { desde: en.b30 - .3, ...cartoon, decorado: [gris],
      delante: [{ tipo: 'mochilas', x: 640, y: 560, pesa: DINERO + .1, hasta: HABLAR - .2 }, { tipo: 'chisteras', en: HABLAR - .2, n: 20, caen: BUENOS + .2, desde: HABLAR - .2 }],
      camara: [[en.b30, 640, 380, 1.05], [DINERO, 760, 400, 1.12], [HABLAR, 640, 420, 1.05], [G.fin, 900, 470, 1.2]] },
  ],
};
