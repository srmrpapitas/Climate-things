// Españistán ep. 7 · secuencia 4, «El matiz» (bloques 9–10). `cartoon`, 60 fps. Escuela de pueblo en 1900 → aula de hoy (los pupitres no cambian).
//   b9   el Decano mira con la lupa la frase de la pizarra «para fabricar obreros obedientes»; «media verdad» → la tacha por la mitad;
//        «soldados, súbditos y ciudadanos» se escriben debajo; «funcionó» → sello.
//   b10  barras: 59 % de analfabetos en 1900 y ≈ 1 % hoy. «Pregunta del Decano» → metamorfosis a hoy: cambian las paredes, los pupitres no.
//        La pregunta se queda en el aire (≥ 3 s con el Decano mirando a cámara).
const G = T.guion([9, 10]), en = G.en, k = G.k, P = PERSONAJES;
const cartoon = { cartoon: true, jack: true, figura: '#2b2235', sombra: 8, contraluz: 0, bordes: ['rgb(150,210,255)', 'rgb(255,150,90)'], borde: .8 };
const SE_DICE = k(9, 'Se dice'), MEDIA = k(9, 'media verdad'), SOLDADOS = k(9, 'soldados'), LEER = k(9, 'leer'), FUNCIONO = k(9, 'funcionó'),
  SEIS = k(10, 'seis'), HOY = k(10, 'Hoy'), PREGUNTA = k(10, 'Pregunta'), AULA = k(10, 'aula');
window.ESCENA = {
  dura: G.fin + 1.2, fps: 60, suelo: 600, voces: G.voces,
  sonidos: [{ en: 0, hasta: G.fin, archivo: 'audio/sfx/dron.mp3', volumen: .1, bucle: true }, { en: MEDIA + .3, archivo: 'audio/sfx/eleven/tic.mp3', volumen: .35 },
    { en: FUNCIONO + .1, archivo: 'audio/sfx/eleven/sello.mp3', volumen: .45 }, { en: SEIS, archivo: 'audio/sfx/eleven/pop.mp3', volumen: .3 },
    { en: PREGUNTA - .6, archivo: 'audio/sfx/campana.mp3', volumen: .35 }],
  planos: [
    { desde: 0, ...cartoon, decorado: [{ tipo: 'escuelaRural', anio: 1900, par: .3 }],
      delante: [
        { tipo: 'tiza', x: 700, y: 210, ancho: 700, alto: 260, tam: 34, paso: 64, tacha: MEDIA + .3, tachaLinea: 0,
          lineas: [[SE_DICE + .4, 'para fabricar obreros obedientes'], [SOLDADOS - .2, 'soldados · súbditos · lectores', '#ffd060']] },
        { tipo: 'sello', en: FUNCIONO + .1, texto: 'FUNCIONÓ', x: 1040, y: 330, escala: .55, giro: -.15 },
        { tipo: 'pupitres', epoca: 1900, filas: 2, cols: 5, ninos: true, y: 670 },
        { tipo: 'barras', en: SEIS - .5, x: 700, y: 470, alto: 220, ancho: 120, sep: 240, max: 60, barras: [['1900', 59, '#7a1410', SEIS - .2, '59 %'], ['hoy', 1, '#2c5a2c', HOY, '≈ 1 %']], hasta: PREGUNTA - .2 }],
      actores: [{ p: P.decano, x: 230, mira: 1, acciones: [{ hace: 'senala', en: SE_DICE + .6, hasta: MEDIA - .2 }, { hace: 'niega', en: MEDIA, hasta: MEDIA + 1.4 }, { hace: 'asiente', en: FUNCIONO, hasta: FUNCIONO + 1.2 }] }],
      camara: [[0, 640, 330, 1.1], [MEDIA, 700, 260, 1.35], [SOLDADOS, 700, 280, 1.25], [FUNCIONO, 820, 320, 1.1], [SEIS, 700, 360, 1], [PREGUNTA, 640, 360, 1]] },
    { desde: PREGUNTA - .3, transicion: 'metamorfosis', ...cartoon, decorado: [{ tipo: 'aulaHoy', par: .3 }],
      delante: [{ tipo: 'pupitres', epoca: 'hoy', filas: 2, cols: 5, ninos: true, y: 670 }, { tipo: 'burbuja', x: 420, y: 160, texto: '¿y el aula?', en: AULA, hasta: G.fin + 1.2, ancho: 240, tam: 30 }],
      actores: [{ p: P.decano, x: 230, mira: 1, acciones: [{ hace: 'piensa', en: PREGUNTA + 1, hasta: AULA - .2 }, { hace: 'miraCamara', en: AULA, hasta: G.fin + 1.2 }] }],
      camara: [[PREGUNTA, 640, 360, 1], [AULA, 420, 360, 1.25], [G.fin + 1.2, 360, 380, 1.4]] },
  ],
};
