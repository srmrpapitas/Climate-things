// Españistán ep. 6 · secuencia 8, «Las familias» (bloques 27–36). El pasado va en pergamino (sin `jack`), en modo `cartoon`.
// Construir y deshacer: cada presidente se forma con tinta cuando la voz lo nombra y se deshace en tinta cuando llega el siguiente.
//   b27–b29  Ansar (2000-2001, sello REGULARIZACIÓN) → Zapatitos (2005, +500.000, chorro de papeles) → Rajoyo (2012, se quita la sanidad)
//            → Sanchís (2018, se devuelve). Todo en el mismo plano; la cámara pasa de uno a otro.
//   b30      metamorfosis: el hemiciclo vacío; «por decreto» → el sello gigante lo aplasta; Sanchís se asusta y sonríe.
//   b31      (sin cortar) la cámara viaja a la cumbre: la bandera de la UE, todos le señalan y él responde «bla», «bla», «bla».
//   b32      (viento) Feijolo con el cartel PUNTOS Y CUOTAS; el marcador de 2024: todos SÍ, uno NO; Feijolo esconde el cartel.
//   b33      (sin cortar) Acascar se forma con tinta junto al NO; «los datos le dan la razón» → ✓.
//   b34–b35  metamorfosis: cinco tronos caen como fichas de dominó; 347 menores, «unos treinta por comunidad»; el megáfono grita 8.000.000
//            y se desinfla hasta «matizado».
//   b36      (tajo) las pancartas REGULARIZAR · CERRAR LOS CIE y, detrás, un bloque con todas las persianas bajadas: ¿dónde vivirán?
const G = T.guion([27, 28, 29, 30, 31, 32, 33, 34, 35, 36]), en = G.en, k = G.k, P = PERSONAJES;
const recuerdo = { cartoon: true, contraluz: .35 }, cartoon = { cartoon: true, jack: true, figura: '#2b2235', sombra: 8, contraluz: 0, bordes: ['rgb(150,210,255)', 'rgb(255,150,90)'], borde: .8 };
const ANSAR = k(28, 'Ansar'), ZAPA = k(28, 'Zapatitos'), MEDIO = k(28, 'medio millón'), RAJOYO = k(29, 'Rajoyo'), QUITO = k(29, 'quitó'), SANCHIS = k(29, 'Sanchís'), DEVOLVIO = k(29, 'devolvió'),
  MAYOR = k(30, 'mayor'), MILLON = k(30, 'un millón'), DECRETO = k(30, 'decreto'), CONGRESO = k(30, 'Congreso'), CUMBRE = k(31, 'cumbre'), CRITICAS = k(31, 'críticas'), BLA = k(31, 'bla'),
  FEIJOLO = k(32, 'Feijolo'), PUNTOS = k(32, 'puntos'), FAVOR = k(32, 'a favor'), CONTRA = k(32, 'en contra'), ACASCAR = k(33, 'Acascar'), EXPULS = k(33, 'expulsiones'), RAZON = k(33, 'razón'),
  ROMPIO = k(34, 'rompió'), MENORES = k(34, 'menores'), TREINTA = k(34, 'treinta'), OCHO = k(35, 'ocho millones'), SIETE = k(35, 'siete millones'), MATIZAR = k(35, 'matizarlo'),
  SUMAR = k(36, 'Sumar'), CERRAR = k(36, 'cerrar'), VIVIR = k(36, 'vivir');
const nota = (en0, hasta, titulo, filas, fuente, x = 830) => ({ en: en0, hasta, x, y: 40, ancho: 420, titulo, filas, fuente });
const tinta = (aparece, desaparece) => ({ aparece, desaparece, materia: 'tinta', dura: 1.1 });
window.ESCENA = {
  dura: G.fin, fps: 30, suelo: 600, voces: G.voces,
  sonidos: [
    { en: 0, hasta: en.b30, archivo: 'audio/sfx/viento.mp3', volumen: .18, bucle: true }, { en: ANSAR + .9, archivo: 'audio/sfx/eleven/sello.mp3', volumen: .45 },
    { en: MEDIO, archivo: 'audio/sfx/eleven/sello.mp3', volumen: .45 }, { en: QUITO, archivo: 'audio/sfx/eleven/sello.mp3', volumen: .45 }, { en: DEVOLVIO, archivo: 'audio/sfx/eleven/sello.mp3', volumen: .45 },
    { en: DECRETO, archivo: 'audio/sfx/derrumbe.mp3', volumen: .18 }, { en: CRITICAS, hasta: BLA + 2, archivo: 'audio/sfx/grada.mp3', volumen: .2, bucle: true },
    { en: en.b32 - .3, archivo: 'audio/sfx/whoosh.mp3', volumen: .4 }, { en: CONTRA, archivo: 'audio/sfx/impacto.mp3', volumen: .14 }, { en: RAZON, archivo: 'audio/sfx/eleven/brillo.mp3', volumen: .45 },
    { en: ROMPIO + .4, archivo: 'audio/sfx/derrumbe.mp3', volumen: .16 }, { en: OCHO, archivo: 'audio/sfx/alarmas.mp3', volumen: .25 }, { en: MATIZAR, archivo: 'audio/sfx/eleven/pop.mp3', volumen: .4 },
    { en: en.b36 - .2, archivo: 'audio/sfx/whoosh.mp3', volumen: .35 }, { en: SUMAR, hasta: G.fin, archivo: 'audio/sfx/grada.mp3', volumen: .2, bucle: true }],
  carteles: [
    nota(MILLON + .3, CUMBRE - .2, 'Regularización de 2026', [['Solicitudes', '1.174.978', '#7a1410'], ['Cómo', 'Real Decreto 316/2026']], 'La Moncloa'),
    nota(CRITICAS, FEIJOLO - .3, 'Cumbre europea, 16-10-2026', [['Críticas a España', 'varios países'], ['Respuesta', '«bla, bla, bla»', '#7a1410']], 'Infobae, 16-10-2026'),
    nota(FAVOR, ACASCAR - .2, 'Congreso, 2024', [['Tramitar la regularización', 'PP a favor'], ['En contra', 'solo Vox', '#7a1410']], 'Newtral'),
    nota(EXPULS, ROMPIO - .3, 'Expulsiones', [['Se cumplen', '17 %', '#7a1410']], 'Eurostat'),
    nota(MENORES, OCHO - .3, 'Julio de 2024', [['Menores a repartir', '347'], ['Por comunidad', '≈ 30', '#7a1410']], 'Infobae, 11-7-2024'),
    nota(SIETE, SUMAR - .3, 'Extranjeros en el país', [['Total', '≈ 7.000.000'], ['Con papeles', 'casi todos', '#7a1410']], 'INE'),
  ],
  planos: [
    { desde: 0, ...recuerdo, viento: .2, decorado: [{ tipo: 'colinas', tono: .5, par: .4 }, { tipo: 'suelo', par: 1, matas: 4 }],
      delante: [
        { tipo: 'sello', en: ANSAR + .9, texto: '2000 · 2001\nREGULARIZACIÓN', x: 200, y: 170, escala: .5, hasta: ZAPA + .3 },
        { tipo: 'nombre', x: 200, y: 330, texto: 'Ansar', en: ANSAR, hasta: ZAPA - .3 },
        { tipo: 'sello', en: MEDIO, texto: '2005 · +500.000', x: 520, y: 170, escala: .5, hasta: RAJOYO + .3 }, { tipo: 'nombre', x: 520, y: 330, texto: 'Zapatitos', en: ZAPA, hasta: RAJOYO - .3 },
        { tipo: 'sello', en: QUITO, texto: '2012 · SIN SANIDAD\nSIN PAPELES', x: 840, y: 170, escala: .5, hasta: SANCHIS + .3 }, { tipo: 'nombre', x: 840, y: 330, texto: 'Rajoyo', en: RAJOYO, hasta: SANCHIS - .3 },
        { tipo: 'sello', en: DEVOLVIO, texto: '2018 · SANIDAD\nDEVUELTA', x: 1160, y: 170, escala: .5, color: '#2e6b2e' }, { tipo: 'nombre', x: 1160, y: 330, texto: 'Sanchís', en: SANCHIS, hasta: DEVOLVIO + 1.5 }],
      particulas: [{ tipo: 'papeles', n: 40, en: MEDIO, hasta: RAJOYO }],
      actores: [
        { p: P.ansar, x: 200, mira: 1, forma: tinta(ANSAR - .5, ZAPA - .2), acciones: [{ hace: 'senala', en: ANSAR + .6, hasta: ANSAR + 2 }] },
        { p: P.zapatitos, x: 520, mira: 1, forma: tinta(ZAPA - .5, RAJOYO - .2), acciones: [{ hace: 'celebra', en: MEDIO, hasta: MEDIO + 2 }] },
        { p: P.rajoyo, x: 840, mira: 1, forma: tinta(RAJOYO - .5, SANCHIS - .2), acciones: [{ hace: 'golpea', en: QUITO - .1, hasta: QUITO + 1.4 }] },
        { p: P.sanchis, x: 1160, mira: -1, forma: { aparece: SANCHIS - .5, materia: 'tinta', dura: 1.1 }, acciones: [{ hace: 'saluda', en: DEVOLVIO, hasta: DEVOLVIO + 1.6 }] }],
      camara: [[0, 640, 360, 1], [ANSAR - .6, 330, 380, 1.15], [ZAPA - .6, 330, 380, 1.15], [ZAPA, 560, 380, 1.15], [RAJOYO - .6, 560, 380, 1.15], [RAJOYO, 800, 380, 1.15],
        [SANCHIS - .6, 800, 380, 1.15], [SANCHIS, 980, 380, 1.15], [en.b30, 980, 380, 1.2]] },
    { desde: en.b30 - .2, transicion: 'metamorfosis', ...cartoon, decorado: [{ tipo: 'cieloNoche', arriba: '#2a1240', abajo: '#7a3a5a', n: 15, par: .2 }, { tipo: 'hemiciclo', x: 640, y: 660, filas: 5, escala: .9, par: 1 }],
      delante: [{ tipo: 'sello', en: DECRETO, texto: '1.175.000\nPOR DECRETO', x: 640, y: 380, escala: .9 },
        { tipo: 'burbuja', x: 640, y: 120, texto: 'SIN PASAR POR EL CONGRESO', en: CONGRESO, hasta: CUMBRE - .3, ancho: 460, tam: 26, color: '#a3140f' },
        { tipo: 'estandarte', x: 1900, y: 60, ancho: 260, alto: 300, en: CUMBRE - .8 }, { tipo: 'mesa', x: 1900, y: 600, ancho: 520, par: 1 },
        { tipo: 'burbuja', x: 1700, y: 200, texto: 'bla', en: BLA, ancho: 120, tam: 34 }, { tipo: 'burbuja', x: 1830, y: 150, texto: 'bla', en: BLA + .35, ancho: 120, tam: 34 }, { tipo: 'burbuja', x: 1960, y: 110, texto: 'bla', en: BLA + .7, ancho: 120, tam: 34 }],
      actores: [
        { p: P.sanchis, x: 980, mira: -1, acciones: [{ hace: 'sorprende', en: DECRETO + .1, hasta: DECRETO + 1.2 }, { hace: 'celebra', en: DECRETO + 1.4, hasta: CUMBRE - .4 },
          { hace: 'camina', en: CUMBRE - .6, hasta: CRITICAS, a: 1640 }, { hace: 'gira', en: CRITICAS + .1 }, { hace: 'habla', en: BLA - .1, hasta: BLA + 1.5 }] },
        ...[0, 1, 2].map(i => ({ p: ciudadano(760 + i, { escala: .9 }), x: 1900 + i * 140, mira: -1, acciones: [{ hace: 'senala', en: CRITICAS + .15 * i, hasta: BLA + 2 }] }))],
      camara: [[en.b30, 640, 380, 1.05], [DECRETO, 640, 360, 1], [CUMBRE - .7, 700, 360, 1], [CUMBRE + .3, 1900, 360, 1.05], [en.b32, 1900, 360, 1.08]] },
    { desde: en.b32 - .1, transicion: 'viento', ...cartoon, viento: .3, decorado: [{ tipo: 'cieloNoche', arriba: '#1a1a3a', abajo: '#3a5a8a', n: 20, par: .2 }, { tipo: 'suelo', par: 1, matas: 2 }],
      delante: [{ tipo: 'letrero', x: 360, y: 160, texto: 'PUNTOS Y CUOTAS', enciende: PUNTOS - .2, apaga: FAVOR + .3, ancho: 420 }, { tipo: 'nombre', x: 360, y: 310, texto: 'Feijolo', en: FEIJOLO, hasta: PUNTOS + 1.5 },
        { tipo: 'marcador', x: 920, y: 90, titulo: 'CONGRESO · 2024', en: FAVOR, cada: .25, filas: [['PSOE', 'SÍ'], ['PP', 'SÍ'], ['SUMAR', 'SÍ'], ['OTROS', 'SÍ'], ['VOX', 'NO']] },
        { tipo: 'nombre', x: 1420, y: 330, texto: 'Acascar', en: ACASCAR, hasta: EXPULS + 1 }, { tipo: 'sello', en: RAZON, texto: '✓ EN ESO, SÍ', x: 1420, y: 160, escala: .5, color: '#2e6b2e' }],
      actores: [
        { p: P.feijolo, x: 360, mira: 1, acciones: [{ hace: 'senala', en: PUNTOS, hasta: FAVOR - .3 }, { hace: 'esconde', en: FAVOR + .3, hasta: ACASCAR }, { hace: 'sorprende', en: CONTRA, hasta: CONTRA + 1 }] },
        { p: P.acascar, x: 1420, mira: -1, forma: { aparece: ACASCAR - .6, materia: 'tinta', dura: 1.1 }, acciones: [{ hace: 'puno', en: EXPULS, hasta: EXPULS + 1.4 }, { hace: 'miraCamara', en: RAZON + .2, hasta: en.b34 }] }],
      camara: [[en.b32, 380, 380, 1.15], [FAVOR - .3, 760, 360, 1], [ACASCAR - .6, 1100, 370, 1], [RAZON, 1300, 380, 1.15], [en.b34, 1350, 380, 1.15]] },
    { desde: en.b34 - .2, transicion: 'metamorfosis', ...cartoon, viento: .2, decorado: [{ tipo: 'cieloNoche', arriba: '#2a0f1a', abajo: '#7a3020', n: 10, par: .2 }, { tipo: 'suelo', par: 1, matas: 0 }],
      delante: [...['ARAGÓN', 'C. VALENCIANA', 'CASTILLA Y LEÓN', 'MURCIA', 'EXTREMADURA'].map((r, i) => ({ tipo: 'tronoCae', x: 220 + i * 150, y: 600, escala: 1, rotulo: r, cae: ROMPIO + .3 + .18 * i })),
        { tipo: 'figuras', aparece: MENORES - .2, n: 30, cols: 10, x: 1050, y: 580, alto: 44, paso: 36, encienden: [[TREINTA, 30, '#f0a03a', '347 MENORES · ≈ 30 POR COMUNIDAD']], tamRotulo: 22 },
        { tipo: 'megafono', x: 1900, y: 330, en: OCHO - .4, cada: .4, quedan: 99, escala: .9 }, { tipo: 'contador', en: OCHO, dura: .8, a: 8000000, x: 1900, y: 140, tam: 70, color: '#ff8a70', hasta: MATIZAR },
        { tipo: 'burbuja', x: 1900, y: 140, texto: 'matizado', en: MATIZAR, ancho: 220, tam: 34 }],
      actores: [{ p: P.acascar, x: 1600, mira: 1, acciones: [{ hace: 'puno', en: OCHO - .2, hasta: OCHO + 1.4 }, { hace: 'encoge', en: MATIZAR, hasta: MATIZAR + 1.5 }] }],
      camara: [[en.b34, 560, 380, 1.05], [MENORES, 820, 380, 1], [OCHO - .8, 900, 380, 1], [OCHO, 1800, 360, 1.05], [en.b36, 1800, 360, 1.08]] },
    { desde: en.b36 - .1, transicion: 'tajo', ...cartoon, viento: .3, decorado: [{ tipo: 'cieloNoche', arriba: '#1a2440', abajo: '#c07050', n: 10, par: .2 }, { tipo: 'bloque', x: 640, y: 600, cols: 7, pisos: 6, todas: VIVIR, par: .7 }, { tipo: 'suelo', par: 1, matas: 0 }],
      delante: [{ tipo: 'pancartas', en: SUMAR + .2, textos: ['REGULARIZAR', 'CERRAR LOS CIE'], x0: 420, paso: 440, y: 330 }, { tipo: 'sello', en: VIVIR + .6, texto: '¿Y DÓNDE VIVEN?', x: 640, y: 160, escala: .6 }],
      actores: [0, 1, 2, 3, 4, 5].map(i => ({ p: ciudadano(780 + i, { escala: .6 }), x: 230 + i * 160, mira: 1, acciones: [{ hace: i % 2 ? 'puno' : 'celebra', en: SUMAR + .3 + .1 * i, hasta: CERRAR + 2 }, { hace: 'encoge', en: VIVIR + .4, hasta: G.fin }] })),
      camara: [[en.b36, 640, 400, 1.15], [VIVIR, 640, 330, 1], [G.fin, 640, 300, 1.05]] },
  ],
};
