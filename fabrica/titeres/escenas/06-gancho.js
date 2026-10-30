// Españistán ep. 6 · secuencia 1, «Gancho» (bloques 1–3). Temporada 2: `cartoon`, paleta de noche y amanecer, 30 fps.
// Plan: CAPITULO-06-PLANOS.md. Tiempos reales: tiempos-06.js (G.k pone cada cosa en la palabra exacta). 60 % sin cortes.
//   b1   noche en Ceuta: primer plano del agua llena de cabezas; la cámara se aleja y enseña la playa entera (sin cortar). «setenta y dos mil»
//        → contador; «ochenta y tres mil» → las dos barras; «setenta y cinco» → calma, silencio y 75 velas en la orilla.
//   b2   metamorfosis: la playa se deshace en tinta y redibuja la ciudad de día: el contador de afiliados y el sello RÉCORD; la cámara
//        viaja (sin cortar) al escaparate: Lucía y Dani ante «1.400 €» se asustan. «¿Cómo puede…?» → el Decano se forma con hojas y mira a cámara.
//   b3   el mapa se parte en dos detrás del Decano; «quién la dejó así» → la cámara se le acerca.  → INTRO
const G = T.guion([1, 2, 3]), en = G.en, k = G.k, P = PERSONAJES;
const cartoon = { cartoon: true, jack: true, figura: '#2b2235', sombra: 8, contraluz: 0, bordes: ['rgb(150,210,255)', 'rgb(255,150,90)'], borde: .8 };
const LLEGAN = k(1, 'setenta y dos'), CEUTA = k(1, 'ochenta'), MUERTOS = k(1, 'setenta y cinco'), RECORD = k(2, 'récords'), PISO = k(2, 'pagar'),
  COMO = k(2, '¿Cómo'), HOY = en.b3, IZQ = k(3, 'izquierda'), DER = k(3, 'derecha'), DEJO = k(3, 'dejó');
const nota = (en0, hasta, titulo, filas, fuente, x = 40) => ({ en: en0, hasta, x, y: 40, ancho: 440, titulo, filas, fuente });
const noche = [{ tipo: 'cieloNoche', luna: [980, 150, 60], arriba: '#0e1030', abajo: '#3a2a66', par: .2 }, { tipo: 'playa', y: 560, par: .8 }];
const dia = [{ tipo: 'cieloNoche', arriba: '#f0a860', abajo: '#ffd9a0', n: 0, par: .2 }, { tipo: 'rascacielos', y: 600, tono: .35, n: 9, par: .5 }, { tipo: 'suelo', par: 1, matas: 0 }];
window.ESCENA = {
  dura: G.fin, fps: 30, suelo: 600, voces: G.voces,
  silencios: [[MUERTOS - .4, en.b2 - .2]],
  sonidos: [
    { en: 0, hasta: en.b2, archivo: 'audio/sfx/ola.mp3', volumen: .4, bucle: true },
    { en: 0, hasta: MUERTOS, archivo: 'audio/sfx/panico.mp3', volumen: .12, bucle: true },
    { en: LLEGAN, archivo: 'audio/sfx/eleven/tic.mp3', volumen: .4 }, { en: CEUTA, archivo: 'audio/sfx/impacto.mp3', volumen: .35 },
    { en: en.b2 - 1.3, archivo: 'audio/sfx/whoosh.mp3', volumen: .4 }, { en: en.b2, hasta: COMO, archivo: 'audio/sfx/ciudad.mp3', volumen: .2, bucle: true },
    { en: RECORD + .3, archivo: 'audio/sfx/eleven/sello.mp3', volumen: .5 }, { en: PISO + .4, archivo: 'audio/sfx/eleven/pop.mp3', volumen: .4 },
    { en: COMO - .2, hasta: G.fin, archivo: 'audio/sfx/viento.mp3', volumen: .25, bucle: true }, { en: HOY + .2, archivo: 'audio/sfx/trueno.mp3', volumen: .35 }],
  carteles: [
    nota(CEUTA + .2, MUERTOS - .3, 'Ceuta · 30 y 31 de julio', [['Entradas', '72.000', '#7a1410'], ['Habitantes de Ceuta', '≈ 83.000']], 'Interior, 4-8-2026 · INE'),
    nota(MUERTOS + .3, en.b2 - .4, 'En el agua', [['Muertos', '75', '#7a1410']], 'Interior, 4-8-2026'),
    nota(RECORD + .6, PISO - .2, 'Afiliados extranjeros', [['Septiembre de 2026', '3.635.979', '#7a1410'], ['Del total', '16,2 %']], 'Seguridad Social', 800),
  ],
  planos: [
    { desde: 0, ...cartoon, viento: .25, decorado: noche,
      delante: [{ tipo: 'nadadores', n: 90, en: .2, oleadas: 4, zona: [-150, 1350, 380, 545] }, { tipo: 'velas', en: MUERTOS + .3, dura: 3, n: 75, x0: 80, x1: 1200, y: 600 },
        { tipo: 'contador', en: LLEGAN - .3, dura: 1.6, a: 72000, x: 330, y: 130, tam: 70, rotulo: 'PERSONAS EN DOS DÍAS', hasta: en.b2 }],
      particulas: [{ tipo: 'estrellas', n: 30 }],
      camara: [[0, 640, 470, 1.9], [LLEGAN - .5, 600, 450, 1.55], [CEUTA, 640, 380, 1.08], [MUERTOS, 640, 380, 1], [en.b2, 640, 400, .96]] },
    { desde: en.b2 - .3, transicion: 'metamorfosis', ...cartoon, decorado: dia,
      delante: [{ tipo: 'contador', en: en.b2 + .4, dura: 1.8, a: 3635979, x: 360, y: 220, tam: 76, rotulo: 'TRABAJADORES EXTRANJEROS' },
        { tipo: 'sello', en: RECORD + .3, texto: 'RÉCORD', x: 360, y: 380, escala: .7 },
        { tipo: 'escaparate', x: 1180, escala: 1, rotulo: 'SE ALQUILA', precio: '1.400 €', texto: 'AL MES', precio2: '', texto2: '', par: 1 },
        { tipo: 'nombre', x: 1020, y: 330, texto: 'Lucía y Dani', en: PISO - .6, hasta: COMO - .3 }],
      actores: [{ p: P.lucia, x: 960, mira: 1, acciones: [{ hace: 'sorprende', en: PISO + .3, hasta: COMO }] }, { p: P.dani, x: 1060, mira: 1, acciones: [{ hace: 'sorprende', en: PISO + .4, hasta: COMO }, { hace: 'encoge', en: PISO + 1.6, hasta: COMO }] }],
      camara: [[en.b2, 380, 330, 1.25], [RECORD + 1, 420, 340, 1.2], [PISO - 1, 1080, 380, 1.3], [COMO, 1100, 380, 1.32]] },
    { desde: COMO - .2, ...cartoon, viento: .45, decorado: [{ tipo: 'cieloNoche', luna: [1050, 140, 50], par: .2 }, { tipo: 'montes', tono: .2, par: .45, y: 560 }, { tipo: 'suelo', par: 1, matas: 4 }],
      delante: [{ tipo: 'mapaPartido', en: HOY + .2, x: 640, y: 300, ancho: 560, abre: 70 }, { tipo: 'nombre', x: 330, y: 300, texto: 'el Decano', en: COMO + 1.4, hasta: HOY - .2 },
        { tipo: 'burbuja', x: 380, y: 140, texto: 'IZQUIERDA', en: IZQ, hasta: G.fin, ancho: 230, color: '#a3140f', tam: 30 }, { tipo: 'burbuja', x: 900, y: 140, texto: 'DERECHA', en: DER, hasta: G.fin, ancho: 210, color: '#1f4f8a', tam: 30 }],
      particulas: [{ tipo: 'hojas', n: 30 }],
      actores: [{ p: P.decano, x: 330, mira: 1, forma: { aparece: COMO - .2, dura: 1.3 }, acciones: [{ hace: 'miraCamara', en: COMO + 1.2, hasta: HOY - .3 }, { hace: 'senala', en: IZQ - .2, hasta: DER + .8 }, { hace: 'piensa', en: DEJO - .4, hasta: G.fin }] }],
      camara: [[COMO, 420, 400, 1.35], [HOY, 600, 360, 1], [DEJO - .3, 600, 360, 1], [G.fin, 380, 420, 1.45]] },
  ],
};
