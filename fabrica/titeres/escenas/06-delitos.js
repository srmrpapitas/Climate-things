// Españistán ep. 6 · secuencia 6, «La delincuencia» (bloques 15–23). `cartoon`, noche azul, la lupa del Decano. Plan: CAPITULO-06-PLANOS.md.
//   b15  el Decano con su candil en la penumbra: «esconden» → se cierra la luz; «exageran» → un megáfono berrea.
//   b16  (sin cortar) la luz vuelve: diez figuras, siete se encienden «ESPAÑOLES».  b17 la cámara viaja a las barras: 15 contra 6 por mil, «×2,5».
//   b18  metamorfosis: la celda (1 de 3 presos se enciende) y, fuera, 1 de cada 7 vecinos.  b19 (sin cortar) diez siluetas sombrías, se encienden 4.
//   b20  (viento) el Decano mira con la lupa; b21 «hombres jóvenes» → las barras bajan: «≈ ×2»; b22 «pobreza» → nube gris sobre el barrio.
//   b23  metamorfosis en hojas: la balanza; el pasaporte cae y no la mueve, la pobreza sí. «negarlo» → la alfombra se levanta.
const G = T.guion([15, 16, 17, 18, 19, 20, 21, 22, 23]), en = G.en, k = G.k, P = PERSONAJES;
const cartoon = { cartoon: true, jack: true, figura: '#2b2235', sombra: 8, contraluz: 0, bordes: ['rgb(150,210,255)', 'rgb(255,150,90)'], borde: .8 };
const ESCONDEN = k(15, 'esconden'), EXAGERAN = k(15, 'exageran'), SIETE = k(16, 'siete'), ESP = k(16, 'españoles'), QUINCE = k(17, 'quince'), SEIS = k(17, 'seis'), VECES = k(17, 'Dos veces'),
  CARCEL = k(18, 'cárceles'), TRES = k(18, 'uno de cada tres'), CALLE = k(18, 'En la calle'), SIETE2 = k(18, 'siete'), SEXUALES = k(19, 'sexuales'), CUATRO = k(19, 'cuatro'),
  LUPA = k(20, 'lupa'), JOVENES = k(21, 'jóvenes'), BAJA = k(21, 'baja'), DOBLE = k(21, 'doble'), POBREZA = k(22, 'pobreza'), PAIS = k(22, 'país de origen'),
  PASAPORTE = k(23, 'pasaporte'), POBREZA2 = k(23, 'pobreza'), NEGARLO = k(23, 'negarlo');
const nota = (en0, hasta, titulo, filas, fuente, x = 830) => ({ en: en0, hasta, x, y: 40, ancho: 420, titulo, filas, fuente });
const azul = [{ tipo: 'cieloNoche', arriba: '#0a1430', abajo: '#24407a', n: 40, par: .2 }];
window.ESCENA = {
  dura: G.fin, fps: 30, suelo: 600, voces: G.voces,
  silencios: [[PASAPORTE - .5, PASAPORTE + .3]],
  sonidos: [
    { en: 0, hasta: G.fin, archivo: 'audio/sfx/dron.mp3', volumen: .16, bucle: true }, { en: EXAGERAN, archivo: 'audio/sfx/alarmas.mp3', volumen: .2 },
    { en: SIETE, archivo: 'audio/sfx/eleven/pop.mp3', volumen: .35 }, { en: VECES, archivo: 'audio/sfx/impacto.mp3', volumen: .35 },
    { en: en.b18 - 1.2, archivo: 'audio/sfx/whoosh.mp3', volumen: .4 }, { en: TRES, archivo: 'audio/sfx/eleven/tic.mp3', volumen: .4 }, { en: CUATRO, archivo: 'audio/sfx/eleven/tic.mp3', volumen: .4 },
    { en: en.b20 - .3, archivo: 'audio/sfx/whoosh.mp3', volumen: .35 }, { en: POBREZA, hasta: en.b23, archivo: 'audio/sfx/lluvia.mp3', volumen: .2, bucle: true },
    { en: en.b23 - 1.2, archivo: 'audio/sfx/whoosh.mp3', volumen: .4 }, { en: POBREZA2 + .3, archivo: 'audio/sfx/impacto.mp3', volumen: .4 }],
  carteles: [
    nota(ESP, VECES + 1.6, 'Condenados en 2025', [['Españoles', '70,2 %'], ['Tasa por mil · extranjeros', '15,3', '#7a1410'], ['Tasa por mil · españoles', '6,1']], 'INE, 14-7-2026'),
    nota(TRES, SEXUALES - .3, 'Presos extranjeros', [['31-7-2026', '33,9 %', '#7a1410'], ['Extranjeros en la calle', '≈ 1 de cada 7']], 'Instituciones Penitenciarias · INE'),
    nota(CUATRO, en.b20 - .3, 'Delitos sexuales (2024)', [['Detenidos o investigados', '14.375'], ['Extranjeros', '5.641 · ≈ 39 %', '#7a1410']], 'Ministerio del Interior'),
    nota(LUPA, PAIS + 1, 'Universidad Carlos III', [['Con la misma edad y sexo', 'casi el doble', '#7a1410'], ['El resto', 'pobreza y exclusión']], 'Sánchez Barricarte, REIS 195', 40),
  ],
  planos: [
    { desde: 0, ...cartoon, viento: .15, decorado: [...azul, { tipo: 'rascacielos', y: 600, tono: .3, n: 8, par: .5 }, { tipo: 'suelo', par: 1, matas: 0 }],
      delante: [{ tipo: 'penumbra', x: 300, y: 400, r: 260, a: .85, en: ESCONDEN, hasta: SIETE - .6 }, { tipo: 'megafono', x: 980, y: 300, en: EXAGERAN, cada: .5, quedan: 99, escala: .8, hasta: SIETE - .6 },
        { tipo: 'figuras', aparece: SIETE - .8, n: 10, x: 520, y: 560, alto: 110, paso: 82, encienden: [[SIETE + .2, 7, '#f0a03a', '7 DE CADA 10: ESPAÑOLES']] },
        { tipo: 'barras', en: QUINCE - .8, x: 1700, y: 580, alto: 240, sep: 180, max: 16, unidad: ' ‰', barras: [['EXTRANJEROS', 15, '#c0392b', QUINCE, '15 ‰'], ['ESPAÑOLES', 6, '#7fb3e6', SEIS, '6 ‰']] },
        { tipo: 'burbuja', x: 1700, y: 120, texto: '× 2,5', en: VECES, ancho: 180, tam: 40, color: '#a3140f' }],
      actores: [{ p: P.decano, x: 300, mira: 1, hasta: SIETE - .4, acciones: [{ hace: 'encoge', en: ESCONDEN, hasta: EXAGERAN }, { hace: 'sorprende', en: EXAGERAN + .1, hasta: EXAGERAN + 1.1 }] }],
      camara: [[0, 400, 380, 1.15], [EXAGERAN, 640, 360, 1], [SIETE - .5, 520, 380, 1.05], [QUINCE - 1, 560, 380, 1.05], [QUINCE, 1700, 380, 1.05], [en.b18, 1700, 360, 1.12]] },
    { desde: en.b18 - .2, transicion: 'metamorfosis', ...cartoon, decorado: [...azul, { tipo: 'suelo', par: 1, matas: 0 }],
      delante: [{ tipo: 'rejas', x: 380, y: 560, n: 3, encienden: [[TRES, 1]], rotulo: 'PRESOS: 1 DE CADA 3' },
        { tipo: 'figuras', aparece: CALLE - .3, n: 7, x: 930, y: 560, alto: 110, paso: 70, encienden: [[SIETE2, 1, '#e07a2e', 'VECINOS: 1 DE CADA 7']] },
        { tipo: 'figuras', aparece: SEXUALES - .3, n: 10, x: 1900, y: 560, alto: 120, paso: 95, sombria: true, encienden: [[CUATRO + .2, 4, '#e07a2e', 'DELITOS SEXUALES: 4 DE CADA 10']] }],
      camara: [[en.b18, 380, 380, 1.2], [CALLE, 640, 360, 1], [SEXUALES - .6, 640, 360, 1], [SEXUALES + .2, 1900, 360, 1], [en.b20, 1900, 360, 1.05]] },
    { desde: en.b20 - .1, transicion: 'viento', ...cartoon, viento: .3, decorado: [...azul, { tipo: 'bloque', x: 1080, par: .8 }, { tipo: 'suelo', par: 1, matas: 0 }],
      delante: [{ tipo: 'barras', en: en.b20 + .5, hasta: JOVENES, x: 600, y: 540, sep: 190, alto: 280, max: 16, unidad: ' ‰', barras: [['EXTRANJEROS', 15, '#c0392b', 0, '15 ‰'], ['ESPAÑOLES', 6, '#7fb3e6', 0, '6 ‰']] },
        { tipo: 'barras', desde: JOVENES, x: 600, y: 540, sep: 190, alto: 280, max: 16, unidad: ' ‰', barras: [['HOMBRES JÓVENES EXTR.', 11, '#c0392b', JOVENES, '≈ ×2'], ['HOMBRES JÓVENES ESP.', 6, '#7fb3e6', JOVENES, '']] },
        { tipo: 'burbuja', x: 640, y: 110, texto: 'casi el doble', en: DOBLE, hasta: POBREZA - .2, ancho: 260, tam: 34, color: '#a3140f' },
        { tipo: 'letrero', x: 1060, y: 150, texto: 'POBREZA Y EXCLUSIÓN', enciende: POBREZA, ancho: 480 }],
      particulas: [{ tipo: 'lluvia', n: 120, en: POBREZA }],
      actores: [{ p: P.decano, x: 230, mira: 1, acciones: [{ hace: 'senala', en: LUPA - .3, hasta: BAJA + .5 }, { hace: 'piensa', en: POBREZA, hasta: G.fin }] }],
      camara: [[en.b20, 400, 380, 1.2], [JOVENES, 640, 360, 1], [POBREZA, 900, 340, 1.1], [en.b23, 900, 340, 1.12]] },
    { desde: en.b23 - .2, transicion: 'metamorfosis', materia: 'hojas', ...cartoon, viento: .3, decorado: [{ tipo: 'cieloNoche', arriba: '#14204a', abajo: '#5a4a8a', n: 30, par: .2 }, { tipo: 'suelo', par: 1, matas: 3 }],
      delante: [{ tipo: 'balanza', x: 640, y: 600, izq: ['PASAPORTE'], izqEn: [PASAPORTE], der: ['POBREZA SIN INTEGRACIÓN'], derEn: [POBREZA2], pesos: [[POBREZA2 + .2, 1]] },
        { tipo: 'sello', en: NEGARLO + .4, texto: 'NEGARLO\nTAMPOCO AYUDA', x: 640, y: 160, escala: .55 }],
      camara: [[en.b23, 640, 380, 1.15], [POBREZA2, 760, 380, 1.05], [G.fin, 640, 330, 1]] },
  ],
};
