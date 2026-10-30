// Españistán ep. 7 · secuencia 6, «Qué se aprende» (bloques 16–19). `cartoon`, 60 fps.
//   b16  Lucía en su pupitre: «Memorizar» → los papeles le entran; «examen» → salen volando; «verano» → amanece y se los lleva el viento.
//        Séneca (viento → la puerta del colegio): «NON VITAE SED SCHOLAE»; «le dieron la vuelta» → la tinta gira el lema.
//   b17  pizarra: «Ética · 4.º ESO» se tacha (2013); debajo «Historia de la Filosofía · 2.º de Bachillerato» y el aviso «no obligatorio».
//   b18  Lucía sale con su título por la puerta; sello «SIN FILOSOFÍA NI LÓGICA».
//   b19  el bombo de la oposición: salen las bolas y el opositor escribe de un tirón.
const G = T.guion([16, 17, 18, 19]), en = G.en, k = G.k, P = PERSONAJES;
const cartoon = { cartoon: true, jack: true, figura: '#2b2235', sombra: 8, contraluz: 0, bordes: ['rgb(150,210,255)', 'rgb(255,150,90)'], borde: .8 };
const seneca = { ropa: 'tunica', pelo: 'calvo', barba: 'corta', nariz: 1.15, narizForma: 'gruesa', menton: 'redondo', arrugas: .8, alto: 1, grueso: 1.02, piernas: 1.05, jirones: true, semilla: 127 };
const opositor = ciudadano(640, { objeto: 'papel' });
const MEMO = k(16, 'Memorizar'), EXAMEN = k(16, 'examen'), VERANO = k(16, 'verano'), SENECA = k(16, 'Séneca'), VIDA = k(16, 'vida'), VUELTA = k(16, 'vuelta'), PUERTAS = k(16, 'puertas'),
  QUITO = k(17, 'quitó'), DEVOLVIO = k(17, 'devolvió'), HISTORIA = k(17, 'Historia'), QUE_NO = k(17, 'Que no'), PUEDES = en.b18, LOGICA = k(18, 'lógica'),
  OPOSICION = k(19, 'oposición'), TEMARIO = k(19, 'temario'), TIRON = k(19, 'tirón');
window.ESCENA = {
  dura: G.fin, fps: 60, suelo: 600, voces: G.voces,
  sonidos: [{ en: 0, hasta: SENECA - .4, archivo: 'audio/sfx/dron.mp3', volumen: .1, bucle: true }, { en: EXAMEN, archivo: 'audio/sfx/whoosh.mp3', volumen: .3 },
    { en: VERANO, hasta: SENECA - .4, archivo: 'audio/sfx/viento.mp3', volumen: .25, bucle: true }, { en: SENECA - .6, archivo: 'audio/sfx/whoosh.mp3', volumen: .35 },
    { en: VUELTA, archivo: 'audio/sfx/eleven/brillo.mp3', volumen: .35 }, { en: QUITO + .2, archivo: 'audio/sfx/eleven/tic.mp3', volumen: .35 }, { en: LOGICA + .2, archivo: 'audio/sfx/eleven/sello.mp3', volumen: .45 },
    { en: OPOSICION, hasta: G.fin, archivo: 'audio/sfx/eleven/teclas.mp3', volumen: .2, bucle: true }],
  planos: [
    { desde: 0, ...cartoon, viento: .35, decorado: [{ tipo: 'aulaHoy', dia: [[0, 0], [VERANO - .2, 0], [VERANO + .6, 1]], par: .3 }],
      delante: [{ tipo: 'pupitres', epoca: 'hoy', filas: 1, cols: 3, ninos: false, y: 640, escala: 1.3 },
        { tipo: 'burbuja', x: 640, y: 170, texto: 'memorizar', en: MEMO - .1, hasta: EXAMEN - .1, ancho: 260, tam: 34 },
        { tipo: 'burbuja', x: 640, y: 170, texto: 'examen', en: EXAMEN, hasta: VERANO - .1, ancho: 230, tam: 34, color: '#7a1410' },
        { tipo: 'burbuja', x: 640, y: 170, texto: 'olvidado', en: VERANO + .2, hasta: SENECA - .4, ancho: 240, tam: 34 }],
      particulas: [{ tipo: 'papeles', n: 22, zona: [440, 60, 840, 420], en: MEMO, hasta: EXAMEN + 1.2 }, { tipo: 'hojas', n: 30, en: VERANO, zona: [-100, 150, 1380, 520] }],
      actores: [{ p: P.lucia, x: 640, mira: 1, vista: 'frente', acciones: [{ hace: 'piensa', en: MEMO, hasta: EXAMEN }, { hace: 'brazos', en: EXAMEN, hasta: VERANO }, { hace: 'encoge', en: VERANO + .3, hasta: SENECA - .3 }] }],
      camara: [[0, 640, 360, 1.2], [EXAMEN, 640, 340, 1.3], [VERANO + .5, 640, 360, 1.05]] },
    { desde: SENECA - .4, transicion: 'viento', ...cartoon, viento: .4, decorado: [{ tipo: 'cieloNoche', arriba: '#3a5a8a', abajo: '#f0c890', n: 0, par: .2 }, { tipo: 'puertaColegio', lema: 'NON VITAE SED SCHOLAE', lema2: 'NON SCHOLAE SED VITAE', gira: VUELTA - .2, par: .8 }],
      delante: [{ tipo: 'nombre', x: 240, y: 300, texto: 'Séneca · siglo I', en: SENECA + .4, hasta: VIDA + 1 }, { tipo: 'burbuja', x: 640, y: 110, texto: 'era una queja', en: VIDA + .6, hasta: VUELTA - .3, ancho: 280, tam: 28 }],
      particulas: [{ tipo: 'goteo', n: 10, zona: [340, 250, 940, 300], en: VUELTA - .3, hasta: PUERTAS + 1 }],
      actores: [{ p: seneca, x: 240, mira: 1, acciones: [{ hace: 'senala', en: SENECA + .6, hasta: VIDA + .8 }, { hace: 'niega', en: VUELTA + .4, hasta: PUERTAS + .8 }] }],
      camara: [[SENECA, 520, 360, 1.05], [VIDA, 640, 260, 1.3], [VUELTA, 640, 240, 1.4], [en.b17, 640, 300, 1.2]] },
    { desde: en.b17 - .3, transicion: 'viento', ...cartoon, decorado: [{ tipo: 'aulaHoy', dia: 1, par: .3 }],
      delante: [{ tipo: 'tiza', x: 640, y: 260, ancho: 900, alto: 300, tam: 36, paso: 80, tacha: QUITO + .2, tachaLinea: 0,
          lineas: [[en.b17 + .2, 'Ética · 4.º ESO · obligatoria'], [HISTORIA - .2, 'Historia de la Filosofía · 2.º Bach.'], [QUE_NO, 'Bachillerato: NO obligatorio', '#ffd060']] },
        { tipo: 'nombre', x: 340, y: 470, texto: '2013', en: QUITO - .2, hasta: DEVOLVIO }],
      camara: [[en.b17, 640, 300, 1.15], [QUITO, 640, 240, 1.25], [QUE_NO, 640, 330, 1.2]] },
    { desde: PUEDES - .3, ...cartoon, viento: .3, decorado: [{ tipo: 'cieloNoche', arriba: '#3a5a8a', abajo: '#f0c890', n: 0, par: .2 }, { tipo: 'puertaColegio', lema: 'ESO · TÍTULO', par: .8 }],
      delante: [{ tipo: 'sello', en: LOGICA + .2, texto: 'SIN FILOSOFÍA\nNI LÓGICA', x: 900, y: 300, escala: .55 }],
      actores: [{ p: { ...P.lucia, objeto: 'papel' }, x: 640, mira: 1, acciones: [{ hace: 'camina', en: PUEDES, hasta: LOGICA + 1, a: 1080 }] }],
      camara: [[PUEDES, 640, 360, 1.05], [LOGICA, 860, 360, 1.15]] },
    { desde: en.b19 - .3, transicion: 'viento', ...cartoon, decorado: [{ tipo: 'cieloNoche', arriba: '#1c1a2c', abajo: '#4a3a5a', n: 10, par: .2 }],
      delante: [{ tipo: 'bombo', x: 420, y: 330, saca: [[OPOSICION + .3, 17], [OPOSICION + 1, 42], [TEMARIO, 8]] }, { tipo: 'nombre', x: 900, y: 280, texto: 'el opositor', en: OPOSICION, hasta: TEMARIO + 1 }],
      actores: [{ p: opositor, x: 920, mira: -1, acciones: [{ hace: 'mano', en: TEMARIO + .2, hasta: G.fin }] }],
      camara: [[en.b19, 560, 360, 1.05], [TIRON, 820, 380, 1.3]] },
  ],
};
