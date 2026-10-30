// Españistán ep. 7 · secuencia 5, «Cómo estamos» (bloques 11–15). `cartoon`, 60 fps. Aula de hoy, de noche; cortes secos dentro del aula.
//   b11  ocho leyes caen una a una sobre la mesa del profesor, que se dobla.
//   b12  PISA 2025: la nota con las tres materias; «lectura» → barras 2015 frente a 2025; «un curso entero» → burbuja.
//   b13  100 alumnos: se encienden 22 (España) y 9 (OCDE); «repetir no arregla» → Dani se levanta, da la vuelta a la clase y vuelve a su sitio.
//   b14  100 jóvenes: 13 se van; barras País Vasco 3,6 % y Murcia 20,6 %; «mismas leyes» → sello.
//   b15  los alumnos crecen en sus pupitres y se hacen adultos; la nota de la prueba de adultos de la OCDE.
const G = T.guion([11, 12, 13, 14, 15]), en = G.en, k = G.k, P = PERSONAJES;
const cartoon = { cartoon: true, jack: true, figura: '#2b2235', sombra: 8, contraluz: 0, bordes: ['rgb(150,210,255)', 'rgb(255,150,90)'], borde: .8 };
const OCHO = k(11, 'ocho'), GOBIERNO = k(11, 'Gobierno'), PEORES = k(12, 'peores'), MATES = k(12, 'matemáticas'), LECTURA = k(12, 'lectura'), CIENCIAS = k(12, 'ciencias'),
  CUARENTA = k(12, 'cuarenta'), CURSO = k(12, 'curso'), VEINTIDOS = k(13, 'veintidós'), OCDE = k(13, 'OCDE'), REPETIR = k(13, 'repetir no'), CIEN = k(13, 'cien'),
  TRECE = k(14, 'trece'), VASCO = k(14, 'Vasco'), MURCIA = k(14, 'Murcia'), MISMO = k(14, 'Mismo'), MAYORES = k(15, 'mayores'), DEBAJO = k(15, 'debajo');
const aula = [{ tipo: 'aulaHoy', par: .3 }];
const leyes = ['LOECE', 'LODE', 'LOGSE', 'LOPEG', 'LOCE', 'LOE', 'LOMCE', 'LOMLOE'].map((s, i) => [OCHO + .1 + i * .42, s]);
window.ESCENA = {
  dura: G.fin, fps: 60, suelo: 600, voces: G.voces,
  sonidos: [{ en: 0, hasta: G.fin, archivo: 'audio/sfx/dron.mp3', volumen: .1, bucle: true }, ...leyes.map(([t]) => ({ en: t + .3, archivo: 'audio/sfx/impacto.mp3', volumen: .18 })),
    { en: PEORES, archivo: 'audio/sfx/trueno.mp3', volumen: .3 }, { en: VEINTIDOS, archivo: 'audio/sfx/eleven/pop.mp3', volumen: .3 }, { en: OCDE + .3, archivo: 'audio/sfx/eleven/pop.mp3', volumen: .3 },
    { en: TRECE, archivo: 'audio/sfx/viento.mp3', volumen: .2 }, { en: MISMO + .3, archivo: 'audio/sfx/eleven/sello.mp3', volumen: .45 }, { en: MAYORES, archivo: 'audio/sfx/eleven/aparece.mp3', volumen: .3 }],
  carteles: [
    { en: OCHO + .6, hasta: en.b12 - .3, x: 60, y: 60, ancho: 420, titulo: 'Leyes educativas', fuente: 'UNED, Historia y Memoria de la Educación', filas: [['Desde 1980', '8'], ['Una cada', '≈ 5,5 años']], tiempos: [OCHO + .8, GOBIERNO] },
    { en: PEORES - .2, hasta: CUARENTA - .4, x: 700, y: 60, ancho: 520, titulo: 'PISA 2025 · España (OCDE)', fuente: 'Ministerio de Educación, 8-9-2026',
      filas: [['Matemáticas', '457 (463)', '#7a1410'], ['Lectura', '451 (461)', '#7a1410'], ['Ciencias', '477 (482)', '#7a1410']], tiempos: [MATES, LECTURA - .3, CIENCIAS] },
    { en: VEINTIDOS - .3, hasta: REPETIR - .2, x: 760, y: 60, ancho: 460, titulo: 'Han repetido curso a los 15 años', fuente: 'PISA 2025 (EsadeEcPol · Save the Children)',
      filas: [['España', '22 %', '#7a1410'], ['OCDE', '< 9 %']], tiempos: [VEINTIDOS, OCDE] },
    { en: CIEN - .6, hasta: en.b14 - .2, x: 760, y: 70, ancho: 460, titulo: 'El que repite', fuente: 'PISA 2025', filas: [['Puntos por detrás', '≈ 100', '#7a1410']], tiempos: [CIEN] },
    { en: MAYORES + .4, hasta: G.fin, x: 720, y: 60, ancho: 500, titulo: 'Adultos · PIAAC 2023 (OCDE)', fuente: 'OCDE, Survey of Adult Skills · Funcas',
      filas: [['Lectura', '247 (260)', '#7a1410'], ['Matemáticas', '250 (263)', '#7a1410'], ['Resolver problemas', '241 (por debajo)', '#7a1410']], tiempos: [DEBAJO, DEBAJO + .9, DEBAJO + 1.8] }],
  planos: [
    { desde: 0, ...cartoon, decorado: aula, delante: [{ tipo: 'pilaLeyes', x: 760, y: 640, leyes }],
      camara: [[0, 700, 380, 1.05], [OCHO, 760, 420, 1.2], [GOBIERNO + 1, 760, 440, 1.3]] },
    { desde: en.b12 - .3, ...cartoon, decorado: aula,
      delante: [{ tipo: 'pupitres', epoca: 'hoy', filas: 2, cols: 6, ninos: true, y: 690 },
        { tipo: 'barras', en: CUARENTA - .6, x: 420, y: 470, alto: 260, ancho: 120, sep: 240, max: 500, barras: [['2015', 496, '#2c5a2c', CUARENTA - .4, '496'], ['2025', 451, '#7a1410', CUARENTA + .2, '451']] },
        { tipo: 'burbuja', x: 950, y: 220, texto: '20 puntos ≈ 1 curso', en: CURSO - .3, hasta: en.b13 - .3, ancho: 320, tam: 30 }],
      camara: [[en.b12, 640, 360, 1], [CIENCIAS + .5, 760, 330, 1.12], [CUARENTA, 520, 340, 1.08], [CURSO, 700, 330, 1.05]] },
    { desde: en.b13 - .3, ...cartoon, decorado: aula,
      delante: [{ tipo: 'figuras', n: 100, cols: 20, x: 360, y: 560, alto: 46, paso: 28, aparece: en.b13 - .2, encienden: [[VEINTIDOS + .2, 22, '#d23a2a', 'España']] },
        { tipo: 'figuras', n: 100, cols: 20, x: 360, y: 560, alto: 46, paso: 28, aparece: OCDE - .3, hasta: REPETIR - .3, encienden: [[OCDE + .2, 9, '#f0c46a']], sombria: true, desde: OCDE - .3 }],
      camara: [[en.b13, 420, 400, 1.05], [OCDE, 440, 400, 1.08]] },
    { desde: REPETIR - .3, ...cartoon, decorado: aula,
      delante: [{ tipo: 'pupitres', epoca: 'hoy', filas: 3, cols: 5, ninos: true, y: 660, repite: 2, repiteEn: REPETIR + .2 }, { tipo: 'nombre', x: 640, y: 470, texto: 'Dani', en: REPETIR, hasta: REPETIR + 2.6 }],
      camara: [[REPETIR, 640, 420, 1.15], [CIEN, 640, 400, 1.05]] },
    { desde: en.b14 - .3, ...cartoon, viento: .4, decorado: aula,
      delante: [{ tipo: 'figuras', n: 100, cols: 20, x: 360, y: 560, alto: 46, paso: 28, aparece: en.b14 - .2, encienden: [[TRECE + .2, 13, '#7a7a8a', '13 se van']], hasta: VASCO - .3 },
        { tipo: 'barras', en: VASCO - .4, x: 640, y: 480, alto: 260, ancho: 130, sep: 300, max: 22, barras: [['País Vasco', 3.6, '#2c5a2c', VASCO, '3,6 %'], ['Murcia', 20.6, '#7a1410', MURCIA, '20,6 %']] },
        { tipo: 'sello', en: MISMO + .3, texto: 'MISMAS LEYES', x: 640, y: 300, escala: .6 }],
      particulas: [{ tipo: 'hojas', n: 16, zona: [-100, 150, 1380, 520] }],
      camara: [[en.b14, 420, 400, 1.05], [TRECE + 1.5, 520, 400, 1.08], [VASCO, 640, 360, 1], [MISMO, 640, 330, 1.1]] },
    { desde: en.b15 - .3, transicion: 'metamorfosis', ...cartoon, decorado: aula,
      delante: [{ tipo: 'pupitres', epoca: 'hoy', filas: 2, cols: 5, ninos: true, y: 680, crecen: [[MAYORES - .2, 0], [MAYORES + 2.6, 1]] }],
      camara: [[en.b15, 640, 380, 1.1], [DEBAJO, 560, 360, 1], [G.fin, 560, 350, 1.04]] },
  ],
};
