// Españistán ep. 6 · secuencia 8 bis, «Coherencia» (bloques 51–58), entre las familias y las frases. `cartoon`. Plan: CAPITULO-06-PLANOS.md.
//   b51  la noria de las dos familias (ep. 4) gira; Paolo Iglesias (con su nombre) entra con la escoba de la CASTA; «sesenta y nueve» → se engancha
//        una cabina morada en la noria y el hemiciclo se tiñe.
//   b52  (sin cortar) la cámara viaja al móvil con el tuit del ático; «se compran un chalet» → el chalé aparece con su precio; «consulta» → SÍ.
//   b53  «cabalgar contradicciones» → Paolo da un brinco y se asusta.
//   b54  metamorfosis: Irena Montera se forma con tinta; SOLO SÍ ES SÍ; el contador de rebajas llega a 1.205 y la cancela se abre: 121. Plano serio, sin música.
//   b55  (viento) el podio «5.º»: Paolo se deshace en hojas esa misma noche; el letrero TV se enciende.
//   b56  metamorfosis: la Eurocámara. Alviso habla (burbuja con corazón y «JEFE»); el micrófono se apaga; Montera señala «VIOLENCIA»;
//        cae el sello AMONESTACIÓN FORMAL; «meses después» → la frase de la entrevista, tal cual, en grande.
//   b57  (tajo) la noria otra vez: los votos bajan de 5,2 millones a 578.000 y la cabina morada se desprende. «La casta sigue ahí».
//   b58  la pregunta del Decano delante de un trono vacío.
const G = T.guion([51, 52, 53, 54, 55, 56, 57, 58]), en = G.en, k = G.k, P = PERSONAJES;
const cartoon = { cartoon: true, jack: true, figura: '#2b2235', sombra: 8, contraluz: 0, bordes: ['rgb(150,210,255)', 'rgb(255,150,90)'], borde: .8 };
const FAMILIA = k(51, 'familia'), PAOLO = k(51, 'Paolo'), SESENTA = k(51, 'sesenta'), CASTA = k(51, 'casta'), ESCRITO = k(52, 'escrito'), ATICO = k(52, 'ático'), CHALET = k(52, 'chalet'),
  CONSULTA = k(52, 'consulta'), CABALGAR = k(53, 'cabalgar'), MONTERA = k(54, 'Irena'), SOLO = k(54, 'solo sí'), MIL = k(54, 'mil doscientos'), CIENTO = k(54, 'Ciento'),
  QUINTO = k(55, 'quinto'), DEJA = k(55, 'deja la política'), TELE = k(55, 'televisión'), ALVISO = k(56, 'Alviso'), JEFE = k(56, 'jefe'), MICRO = k(56, 'micrófono'),
  VIOLENCIA = k(56, 'violencia'), AMONESTA = k(56, 'amonestación'), MESES = k(56, 'Meses'), NAZIS = k(56, 'lleno de nazis'), CINCO = k(57, 'cinco millones'), QUINIENTOS = k(57, 'quinientos'),
  PODEMOS = k(57, '¿Podemos'), SIGUE = k(57, 'sigue ahí'), CASI = k(57, 'casi no'), DECANO = en.b58, SILLON = k(58, 'sillón');
const nota = (en0, hasta, titulo, filas, fuente, x = 830) => ({ en: en0, hasta, x, y: 40, ancho: 420, titulo, filas, fuente });
const noria = extra => ({ tipo: 'noria', x: 640, y: 600, r: 230, vel: .04, extra, par: .7 });
const morada = { color: '#7b3fa0', en: SESENTA };
window.ESCENA = {
  dura: G.fin, fps: 30, suelo: 600, voces: G.voces,
  silencios: [[MONTERA - .3, en.b55]],
  sonidos: [
    { en: 0, hasta: en.b54, archivo: 'audio/sfx/grada.mp3', volumen: .15, bucle: true }, { en: SESENTA, archivo: 'audio/sfx/ovacion.mp3', volumen: .3 },
    { en: ATICO, archivo: 'audio/sfx/eleven/enviar.mp3', volumen: .45 }, { en: CHALET, archivo: 'audio/sfx/eleven/pop.mp3', volumen: .45 }, { en: CABALGAR + .3, archivo: 'audio/sfx/eleven/pop.mp3', volumen: .4 },
    { en: en.b54 - 1.2, archivo: 'audio/sfx/whoosh.mp3', volumen: .35 }, { en: CIENTO, archivo: 'audio/sfx/derrumbe.mp3', volumen: .25 },
    { en: en.b55 - .3, archivo: 'audio/sfx/whoosh.mp3', volumen: .4 }, { en: DEJA, hasta: TELE, archivo: 'audio/sfx/viento.mp3', volumen: .35, bucle: true },
    { en: en.b56 - 1.2, archivo: 'audio/sfx/whoosh.mp3', volumen: .35 }, { en: MICRO, archivo: 'audio/sfx/eleven/apagon.mp3', volumen: .5 }, { en: AMONESTA, archivo: 'audio/sfx/eleven/sello.mp3', volumen: .5 },
    { en: en.b57 - .2, archivo: 'audio/sfx/whoosh.mp3', volumen: .35 }, { en: CASI, archivo: 'audio/sfx/derrumbe.mp3', volumen: .35 }, { en: DECANO - .2, hasta: G.fin, archivo: 'audio/sfx/viento.mp3', volumen: .25, bucle: true }],
  carteles: [
    nota(ESCRITO, CHALET - .3, 'Tuit de 2012', [['El ático criticado', '600.000 €']], 'Twitter, 20-8-2012'),
    nota(CHALET + .2, CABALGAR - .2, '2018', [['El chalé', '≈ 615.000 €', '#7a1410'], ['Con', 'hipoteca y consulta']], 'El Independiente, 16-5-2018'),
    nota(MIL, en.b55 - .3, 'Ley del «solo sí es sí» · primer año', [['Rebajas de condena', '1.205', '#7a1410'], ['Excarcelados', '121', '#7a1410']], 'CGPJ'),
    nota(ALVISO, MESES - .3, 'Eurocámara, diciembre de 2025', [['Debate', 'sobre acoso'], ['A Alviso', 'amonestación formal', '#7a1410']], 'Parlamento Europeo'),
    nota(MESES, en.b57 - .3, 'Entrevista, junio de 2026', [['No fue en el pleno', 'fue en «El Sótano»']], 'Libertad Digital, 27-6-2026'),
    nota(CINCO, PODEMOS + 1, 'Votos de Podemos', [['Generales 2015', '5.212.711'], ['Europeas 2024', '578.007', '#7a1410']], 'Resultados electorales'),
  ],
  planos: [
    { desde: 0, ...cartoon, viento: .2, decorado: [{ tipo: 'cieloNoche', arriba: '#140c2e', abajo: '#6a2c5c', luna: [1080, 120, 40], par: .2 }, noria([morada]), { tipo: 'suelo', par: 1, matas: 3 }],
      delante: [{ tipo: 'nombre', x: 300, y: 300, texto: 'Paolo Iglesias', en: PAOLO, hasta: CASTA + 1 }, { tipo: 'burbuja', x: 300, y: 160, texto: 'FUERA LA CASTA', en: CASTA, hasta: ESCRITO - .3, ancho: 290, tam: 30, color: '#7b3fa0' },
        { tipo: 'contador', en: SESENTA - .3, dura: 1, a: 69, x: 640, y: 120, tam: 70, color: '#c9a0ff', rotulo: 'DIPUTADOS', hasta: ESCRITO },
        { tipo: 'movil', aparece: ESCRITO - .6, en: ATICO - .4, x: 1900, y: 660, escala: .9, texto: '¿Entregarías la\npolítica económica\na quien se gasta\n600.000 € en un ático?' },
        { tipo: 'casa', x: 2620, escala: .9, desde: CHALET - .1 }, { tipo: 'sello', en: CHALET + .4, texto: 'CHALÉ · 600.000 €+', x: 2500, y: 150, escala: .5 }, { tipo: 'burbuja', x: 2750, y: 300, texto: 'SÍ', en: CONSULTA + .3, ancho: 110, tam: 40, color: '#2e6b2e' },
        { tipo: 'burbuja', x: 2500, y: 240, texto: 'CABALGAR CONTRADICCIONES', en: CABALGAR, ancho: 420, tam: 26, color: '#7b3fa0' }],
      decoradoExtra: null,
      actores: [{ p: { ...P.paolo, objeto: 'baston' }, x: -120, mira: 1, acciones: [{ hace: 'camina', en: PAOLO - .8, hasta: PAOLO + .9, a: 300 }, { hace: 'celebra', en: SESENTA, hasta: SESENTA + 1.6 },
          { hace: 'puno', en: CASTA, hasta: CASTA + 1.2 }, { hace: 'camina', en: ESCRITO - .3, hasta: CHALET - .5, a: 2300 }, { hace: 'brinca', en: CABALGAR + .2, hasta: CABALGAR + .9, alto: 110, dx: 40 },
          { hace: 'sorprende', en: CABALGAR + 1.1, hasta: en.b54 }] },
        { p: P.montera, x: 2380, mira: 1, desde: CHALET - .3, acciones: [{ hace: 'celebra', en: CONSULTA, hasta: CONSULTA + 1.5 }] }],
      camara: [[0, 640, 360, 1], [PAOLO, 440, 380, 1.1], [CASTA + .8, 560, 360, 1], [ESCRITO, 1900, 360, 1.05], [CHALET - .4, 1900, 360, 1.05], [CHALET + .3, 2500, 380, 1.05], [en.b54, 2440, 380, 1.15]] },
    { desde: en.b54 - .2, transicion: 'metamorfosis', ...cartoon, decorado: [{ tipo: 'cieloNoche', arriba: '#0c0c18', abajo: '#2a2438', n: 0, par: .2 }, { tipo: 'suelo', par: 1, matas: 0 }],
      delante: [{ tipo: 'nombre', x: 360, y: 300, texto: 'Irena Montera, ministra', en: MONTERA, hasta: SOLO + .5 }, { tipo: 'letrero', x: 640, y: 150, texto: 'SOLO SÍ ES SÍ', enciende: SOLO - .2, ancho: 400 },
        { tipo: 'contador', en: MIL - .3, dura: 2, a: 1205, x: 900, y: 300, tam: 76, color: '#ff8a70', rotulo: 'CONDENAS REBAJADAS' },
        { tipo: 'cancela', x: 900, y: 600, texto: 'CÁRCEL', abre: [[CIENTO, 1]], ancho: 260, alto: 180 }, { tipo: 'contador', en: CIENTO + .2, dura: 1, a: 121, x: 900, y: 380, tam: 50, color: '#ff8a70', rotulo: 'SALIERON' }],
      actores: [{ p: P.montera, x: 360, mira: 1, forma: { aparece: MONTERA - .6, materia: 'tinta', dura: 1.1 }, acciones: [{ hace: 'saluda', en: SOLO - .2, hasta: SOLO + 1.2 }] }],
      camara: [[en.b54, 420, 380, 1.15], [MIL, 700, 360, 1], [en.b55, 760, 360, 1.05]] },
    { desde: en.b55 - .1, transicion: 'viento', ...cartoon, viento: .5, decorado: [{ tipo: 'cieloNoche', arriba: '#140c2e', abajo: '#3a2a66', n: 30, par: .2 }, { tipo: 'rascacielos', y: 600, tono: .35, n: 7, par: .5 }, { tipo: 'suelo', par: 1, matas: 3 }],
      delante: [{ tipo: 'sello', en: QUINTO, texto: 'MADRID 2021 · 5.º', x: 640, y: 170, escala: .55 }, { tipo: 'letrero', x: 1000, y: 230, texto: 'TV', enciende: TELE, ancho: 200, tam: 60 }],
      particulas: [{ tipo: 'hojas', n: 40, en: DEJA }],
      actores: [{ p: P.paolo, x: 560, mira: 1, forma: { desaparece: DEJA - .1, materia: 'hojas', dura: 1.4 }, acciones: [{ hace: 'encoge', en: QUINTO, hasta: DEJA }] }],
      camara: [[en.b55, 600, 380, 1.15], [DEJA, 640, 360, 1.05], [TELE, 860, 330, 1.1]] },
    { desde: en.b56 - .2, transicion: 'metamorfosis', ...cartoon, decorado: [{ tipo: 'cieloNoche', arriba: '#0a1a40', abajo: '#24407a', n: 15, par: .2 }, { tipo: 'estandarte', x: 640, y: 40, ancho: 220, alto: 240, en: en.b56 - .5, par: .6 },
      { tipo: 'hemiciclo', x: 640, y: 700, filas: 4, escala: .85, par: .8 }, { tipo: 'suelo', par: 1, matas: 0 }],
      delante: [{ tipo: 'nombre', x: 330, y: 300, texto: 'Alviso, eurodiputado', en: ALVISO, hasta: JEFE + .5 }, { tipo: 'burbuja', x: 330, y: 150, texto: 'JEFE', corazon: true, en: JEFE, hasta: MICRO + .2, ancho: 200, tam: 34 },
        { tipo: 'burbuja', x: 950, y: 150, texto: 'VIOLENCIA', en: VIOLENCIA, hasta: MESES, ancho: 260, tam: 36, color: '#c0392b' },
        { tipo: 'sello', en: AMONESTA + .4, texto: 'AMONESTACIÓN\nFORMAL', x: 330, y: 420, escala: .5, hasta: MESES },
        { tipo: 'burbuja', x: 640, y: 330, texto: '«Está lleno de nazis, y a un nazi no te lo puedes tirar»', en: NAZIS - .3, hasta: en.b57 - .1, ancho: 1150, alto: 130, tam: 34, cola: 0 }],
      actores: [
        { p: P.alviso, x: 330, mira: 1, acciones: [{ hace: 'habla', en: ALVISO + .2, hasta: MICRO }, { hace: 'sorprende', en: AMONESTA + .4, hasta: AMONESTA + 1.4 }], hasta: MESES - .2 },
        { p: P.montera, x: 950, mira: -1, acciones: [{ hace: 'senala', en: VIOLENCIA - .2, hasta: AMONESTA }, { hace: 'habla', en: MESES, hasta: en.b57 - .4 }] }],
      camara: [[en.b56, 640, 380, 1.05], [ALVISO, 420, 380, 1.15], [VIOLENCIA, 760, 360, 1.05], [AMONESTA, 420, 400, 1.12], [MESES, 640, 360, 1], [en.b57, 640, 360, 1]] },
    { desde: en.b57 - .1, transicion: 'tajo', ...cartoon, viento: .3, decorado: [{ tipo: 'cieloNoche', arriba: '#140c2e', abajo: '#6a2c5c', luna: [1080, 120, 40], par: .2 }, noria([{ color: '#7b3fa0', en: -9, cae: CASI }]), { tipo: 'suelo', par: 1, matas: 3 }],
      delante: [{ tipo: 'contador', en: CINCO, dura: .8, a: 5212711, x: 1000, y: 140, tam: 56, color: '#c9a0ff', rotulo: '2015', hasta: QUINIENTOS },
        { tipo: 'contador', en: QUINIENTOS, dura: 1, de: 5212711, a: 578007, x: 1000, y: 140, tam: 56, color: '#ff8a70', rotulo: 'EUROPEAS 2024' },
        { tipo: 'burbuja', x: 380, y: 130, texto: '¿Podemos… o no podemos?', en: PODEMOS, hasta: DECANO - .3, ancho: 420, tam: 30, color: '#7b3fa0' },
        { tipo: 'trono', x: 1080, y: 600, escala: 1.3, desde: DECANO - .4 }, { tipo: 'burbuja', x: 900, y: 160, texto: '¿LA CASTA… O EL SILLÓN?', en: SILLON - .4, ancho: 400, tam: 30, color: '#a3140f' }],
      actores: [{ p: P.decano, x: 820, mira: 1, forma: { aparece: DECANO - .4, dura: 1.2 }, acciones: [{ hace: 'senala', en: SILLON - .6, hasta: G.fin }] }],
      camara: [[en.b57, 640, 360, 1], [CASI, 640, 330, 1.05], [DECANO, 900, 380, 1.1], [G.fin, 960, 400, 1.25]] },
  ],
};
