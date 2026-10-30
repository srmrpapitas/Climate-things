// Españistán ep. 7 · secuencia 8, «Qué es pensar» (bloques 31–35). `cartoon`, 60 fps. Un filósofo por bloque, cada uno en su paisaje.
//   b31  el ágora: Sócrates dibuja en la arena el cuadrado del Menón y el esclavo descubre la diagonal; «Preguntaba» → la línea roja.
//   b32  viento → Königsberg nevado, 1784: Kant pasea; «Sapere aude» se escribe en el aire.
//   b33  la hucha con forma de cabeza: el profesor deposita datos (monedas) y el sello «EDUCACIÓN BANCARIA» (Freire, 1968).
//   b34  la barca de dos remos: con «memoria» sola gira en círculos; «Hacen falta las dos» → con «pensar» avanza recta (Willingham).
//   b35  el pergamino de Aristóteles con sus 13 trampas; «tres expertos» → se forman tres atriles con tinta.
const G = T.guion([31, 32, 33, 34, 35]), en = G.en, k = G.k, P = PERSONAJES;
const cartoon = { cartoon: true, jack: true, figura: '#2b2235', sombra: 8, contraluz: 0, bordes: ['rgb(150,210,255)', 'rgb(255,150,90)'], borde: .8 };
const socrates = { ropa: 'tunica', pelo: 'calvo', barba: 'larga', nariz: 1.4, narizForma: 'respingona', menton: 'redondo', arrugas: 1, alto: .96, grueso: 1.08, piernas: 1, jirones: true, semilla: 151 };
const esclavo = ciudadano(733, { ropa: 'tunica', escala: .8 });
const kant = { ropa: 'traje', pelo: 'peinado', nariz: 1.2, narizForma: 'aguilena', menton: 'redondo', arrugas: .8, alto: .9, grueso: .82, piernas: 1.02, sombrero: 'chistera', objeto: 'baston', semilla: 157 };
const freire = { ropa: 'traje', pelo: 'loco', barba: 'larga', gafas: 'cuadradas', nariz: 1.05, narizForma: 'recta', arrugas: .8, alto: 1, grueso: .95, semilla: 163 };
const SOCRATES = k(31, 'Sócrates'), PREGUNTABA = k(31, 'Preguntaba'), NO_SABIA = k(31, 'no sabía'), KANT = k(32, 'Kant'), SAPERE = k(32, 'Sapere'), ATREVETE = k(32, 'Atrévete'),
  FREIRE = k(33, 'Freire'), BANCARIA = k(33, 'bancaria'), DEPOSITA = k(33, 'deposita'), WILLINGHAM = k(34, 'Willingham'), NO_SE_SABE = k(34, 'no se sabe'), DOS = k(34, 'las dos'),
  ARISTOTELES = k(35, 'Aristóteles'), TRES = k(35, 'tres'), EXPERTOS = k(35, 'expertos');
window.ESCENA = {
  dura: G.fin, fps: 60, suelo: 600, voces: G.voces,
  sonidos: [{ en: 0, hasta: KANT - .4, archivo: 'audio/sfx/viento.mp3', volumen: .1, bucle: true }, { en: KANT - .6, archivo: 'audio/sfx/whoosh.mp3', volumen: .35 },
    { en: KANT, hasta: FREIRE - .4, archivo: 'audio/sfx/viento.mp3', volumen: .22, bucle: true }, { en: SAPERE, archivo: 'audio/sfx/eleven/brillo.mp3', volumen: .4 },
    { en: BANCARIA + .2, archivo: 'audio/sfx/eleven/sello.mp3', volumen: .45 }, { en: en.b34, hasta: en.b35, archivo: 'audio/sfx/ola.mp3', volumen: .25, bucle: true },
    { en: ARISTOTELES, archivo: 'audio/sfx/eleven/aparece.mp3', volumen: .3 }, { en: EXPERTOS, archivo: 'audio/sfx/whoosh.mp3', volumen: .3 }],
  carteles: [{ en: FREIRE + .2, hasta: en.b34 - .3, x: 760, y: 60, ancho: 460, titulo: 'Paulo Freire', fuente: 'Pedagogía del oprimido, 1968', filas: [['La «educación bancaria»', '']], tiempos: [BANCARIA] },
    { en: WILLINGHAM, hasta: en.b35 - .3, x: 60, y: 50, ancho: 520, titulo: 'Daniel Willingham, psicólogo', fuente: 'American Educator, 2007', filas: [['«No se puede pensar sobre', ''], ['lo que no se sabe»', '']], tiempos: [NO_SE_SABE - .6, NO_SE_SABE] },
    { en: ARISTOTELES - .1, hasta: TRES, x: 60, y: 40, ancho: 470, titulo: 'Aristóteles', fuente: 'Refutaciones sofísticas, s. IV a. C.', filas: [['Trampas catalogadas', '13']], tiempos: [ARISTOTELES + .6] }],
  planos: [
    { desde: 0, ...cartoon, viento: .2, decorado: [{ tipo: 'cieloNoche', arriba: '#4a3060', abajo: '#f0a060', n: 0, par: .2 }, { tipo: 'agora', cuadrado: PREGUNTABA - .4, cx: 700, par: 1 }],
      delante: [{ tipo: 'nombre', x: 520, y: 300, texto: 'Sócrates', en: SOCRATES, hasta: PREGUNTABA + 1 }],
      actores: [{ p: socrates, x: 540, mira: 1, acciones: [{ hace: 'agacha', en: PREGUNTABA - .6, hasta: NO_SABIA - .4 }, { hace: 'senala', en: NO_SABIA - .2, hasta: KANT }] },
        { p: esclavo, x: 980, mira: -1, acciones: [{ hace: 'piensa', en: PREGUNTABA, hasta: NO_SABIA }, { hace: 'sorprende', en: NO_SABIA, hasta: KANT }] }],
      camara: [[0, 640, 380, 1.05], [PREGUNTABA, 760, 520, 1.35], [NO_SABIA, 760, 460, 1.15]] },
    { desde: KANT - .3, transicion: 'viento', ...cartoon, viento: .35, decorado: [{ tipo: 'cieloNoche', arriba: '#0e1030', abajo: '#3a4a6a', n: 30, par: .2 }, { tipo: 'konigsberg', nieve: 110, par: .8 }],
      delante: [{ tipo: 'nombre', x: 360, y: 330, texto: 'Kant · Königsberg, 1784', en: KANT + .2, hasta: SAPERE - .2 },
        { tipo: 'burbuja', x: 760, y: 170, texto: 'Sapere aude', en: SAPERE - .1, hasta: FREIRE - .4, ancho: 300, tam: 40, color: '#7a1410' },
        { tipo: 'burbuja', x: 760, y: 270, texto: 'atrévete a pensar', en: ATREVETE, hasta: FREIRE - .4, ancho: 300, tam: 28 }],
      actores: [{ p: kant, x: 200, mira: 1, acciones: [{ hace: 'camina', en: KANT, hasta: SAPERE, a: 560 }, { hace: 'miraCamara', en: ATREVETE, hasta: FREIRE }] }],
      camara: [[KANT, 400, 380, 1.15], [SAPERE, 640, 330, 1.05], [FREIRE, 620, 330, 1.12]] },
    { desde: FREIRE - .3, transicion: 'viento', ...cartoon, decorado: [{ tipo: 'cieloNoche', arriba: '#1c1a2c', abajo: '#4a3a5a', n: 10, par: .2 }],
      delante: [{ tipo: 'huchaGrande', x: 600, y: 600, escala: 1 }, { tipo: 'sello', en: BANCARIA + .2, texto: 'EDUCACIÓN\nBANCARIA', x: 600, y: 230, escala: .5, hasta: en.b34 - .3 },
        { tipo: 'nombre', x: 1020, y: 330, texto: 'el profesor', en: DEPOSITA - .3, hasta: en.b34 - .4 }],
      particulas: [{ tipo: 'confeti', n: 14, zona: [560, 260, 640, 330], en: DEPOSITA - .2, hasta: en.b34 }],
      actores: [{ p: freire, x: 200, mira: 1, acciones: [{ hace: 'senala', en: BANCARIA - .2, hasta: BANCARIA + 1.6 }] }, { p: ciudadano(811, { objeto: 'papel' }), x: 1000, mira: -1, acciones: [{ hace: 'mano', en: DEPOSITA - .2, hasta: en.b34 }] }],
      camara: [[FREIRE, 600, 380, 1.05], [BANCARIA, 600, 330, 1.15], [DEPOSITA, 760, 380, 1.05]] },
    { desde: en.b34 - .3, transicion: 'viento', ...cartoon, viento: .3, decorado: [{ tipo: 'cieloNoche', arriba: '#3a5a8a', abajo: '#f0c890', n: 0, par: .2 }, { tipo: 'barcaRemos', solo: DOS - .2, par: 1 }],
      camara: [[en.b34, 640, 400, 1.05], [DOS, 760, 430, 1.1], [en.b35, 900, 440, 1.12]] },
    { desde: en.b35 - .3, ...cartoon, decorado: [{ tipo: 'cieloNoche', arriba: '#1c1a2c', abajo: '#4a3a5a', n: 10, par: .2 }],
      delante: [{ tipo: 'pergamino', en: ARISTOTELES - .8, x: 640, y: 320, ancho: 520, alto: 300, titulo: 'Refutaciones sofísticas', casillas: 13, marca: ARISTOTELES + .6, hasta: EXPERTOS - .2 },
        { tipo: 'atril', x: 330, y: 600, desde: EXPERTOS }, { tipo: 'atril', x: 640, y: 600, desde: EXPERTOS + .3 }, { tipo: 'atril', x: 950, y: 600, desde: EXPERTOS + .6 }],
      particulas: [{ tipo: 'goteo', n: 12, zona: [250, 380, 1030, 420], en: EXPERTOS - .3, hasta: G.fin }],
      camara: [[en.b35, 640, 380, 1.05], [ARISTOTELES, 640, 330, 1.15], [EXPERTOS, 640, 400, 1.02]] },
  ],
};
