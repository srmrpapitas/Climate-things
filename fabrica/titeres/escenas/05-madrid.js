// Españistán ep. 5 · secuencia D, «Madrid» (bloques 14–18). Estilo `jack`, 30 fps. Tiempos: tiempos-05.js (estimados hasta que exista la voz).
// Datos: 05-vivienda.md (idealista, agosto de 2026: 23,3 €/m² en la capital; piso de 90 m² ≈ 2.100 €/mes).
//   entrada  PANEO desde Tenerife: la cámara barre a la derecha desde la verja y, al otro lado del poste, ya es Madrid; luego se aleja.
//   b14      skyline morado al anochecer con grúas quietas. «veintitrés» → la cifra corre hasta 23,3 €/m²; «récord» → sello.
//   b15      «dos mil euros» → la nómina y el recibo del alquiler, lado a lado: el recibo se desenrolla hasta el suelo.
//   b16      corte al edificio cortado como casa de muñecas: «compartidos» → los cuartos se encienden uno a uno; MAESTRA, ENFERMERO, FUNCIONARIO en su palabra.
//   b17      la resta en pequeño sobre Madrid: la gente sube rápido, las casas despacio.
//   b18      lo bueno: «en marcha» → dos grúas arrancan; b18.2 «cuentagotas» → por las calles sigue llegando gente.
const G = T.guion([14, 15, 16, 17, 18], { desde: 1.2 }), en = G.en;
const jack = { jack: true, quieto: true, figura: '#2b2522', sombra: 9, contraluz: 0, bordes: ['rgb(200,180,255)', 'rgb(255,150,90)'], borde: .7 };
// palabras clave (a ojo, a 14 letras/s; G.x las pasa al segundo real)
const PANEO = .9, VEINTITRES = G.x('b14', 3.3), RECORD = G.x('b14', 5.6), DOSMIL = G.x('b15', 2.6), COMPARTIDOS = G.x('b16', 3), MAESTRAS = G.x('b16.2', 1.9),
  ENFERMEROS = G.x('b16.2', 2.7), FUNCIONARIOS = G.x('b16.2', 3.6), RAPIDO = G.x('b17', 3.6), MARCHA = G.x('b18', 5.8), GOTAS = G.x('b18.2', 1.4);
const nota = (en0, hasta, titulo, filas, fuente, x = 40) => ({ en: en0, hasta, x, y: 40, ancho: 470, titulo, filas, fuente });
const cielo = { tipo: 'plano', color: '#4a2f5c', raya: 'rgba(25,10,40,.3)', luz: 'rgba(255,160,200,.12)', par: .2 };
const madrid = [cielo, { tipo: 'astro', x: 1050, y: 160, r: 40, luna: true, par: .2 }, { tipo: 'nubes', tono: .5, n: 4, y: 90, par: .25 },
  { tipo: 'rascacielos', tono: .45, n: 13, par: .45 },
  { tipo: 'grua', x: 230, alto: 430, escala: .9, tono: .3, luz: true, arranca: MARCHA, par: .6 }, { tipo: 'grua', x: 1040, alto: 380, escala: .8, tono: .3, luz: true, arranca: MARCHA + .5, par: .6 },
  { tipo: 'farola', x: 120, par: 1 }, { tipo: 'farola', x: 1160, par: 1 }, { tipo: 'suelo', par: 1, matas: 0 }];
// gente que pasa con mochila por las aceras (vida al fondo) y, en el b18, la que sigue llegando
const pasan = (n, t0, cada) => Array.from({ length: n }, (_, i) => { const izq = i % 2 === 0, t1 = t0 + i * cada;
  return { p: ciudadano(300 + i, { escala: .42 + .05 * (i % 3) }), x: izq ? -60 : 1340, mira: izq ? 1 : -1, desde: t1 - .1, hasta: t1 + 7, acciones: [{ hace: 'camina', en: t1, hasta: t1 + 6.5, a: izq ? 1340 : -60 }] }; });
window.ESCENA = {
  dura: G.fin, fps: 30, suelo: 600, voces: G.voces,
  silencios: [[RECORD - .5, RECORD]],
  sonidos: [
    { en: PANEO - .5, archivo: 'audio/sfx/whoosh.mp3', volumen: .45 },
    { en: PANEO, hasta: G.fin, archivo: 'audio/sfx/ciudad.mp3', volumen: .28, bucle: true },
    { en: RECORD, archivo: 'audio/sfx/impacto.mp3', volumen: .20 }, { en: DOSMIL, archivo: 'audio/sfx/whoosh.mp3', volumen: .25 },
    { en: en.b16, hasta: en.b17, archivo: 'audio/sfx/dron.mp3', volumen: .15, bucle: true },
    { en: MARCHA, archivo: 'audio/sfx/riser.mp3', volumen: .2 }],
  carteles: [
    nota(VEINTITRES + .8, en.b16 - .2, 'Alquiler en Madrid capital', [['Precio', '23,3 €/m² al mes', '#7a1410'], ['Piso de 90 m²', '≈ 2.100 €/mes']], 'idealista · agosto de 2026', 770),
    nota(MARCHA + .3, G.fin, 'Lo bueno: Plan Vive', [['Pisos entregados', '6.419 (julio de 2026)'], ['Objetivo', '14.000', '#7a1410']], 'Comunidad de Madrid'),
  ],
  planos: [
    // de dónde venimos (el final de Tenerife), solo para que el paneo arranque desde allí
    { desde: 0, jack: true, quieto: true, figura: '#2b2522', sombra: 9, contraluz: .4, borde: .7, bordes: jack.bordes,
      decorado: [{ tipo: 'plano', color: '#6e3a20', raya: 'rgba(120,50,15,.22)', luz: 'rgba(255,220,150,.2)', par: .2 }, { tipo: 'teide', x: 980, y: 470, escala: 1.1, tono: .55, par: .3 },
        { tipo: 'verja', x: 640, ancho: 600, alto: 320, texto: 'SOLO CON 10 AÑOS DE PADRÓN', par: .7 }, { tipo: 'suelo', par: 1, matas: 0 }],
      actores: [{ p: PERSONAJES.decano, x: 420, mira: 1, acciones: [{ hace: 'piensa', en: -1, hasta: 9 }] }],
      camara: [[0, 460, 360, 1.45], [PANEO, 520, 360, 1.45]] },
    { desde: PANEO, transicion: 'paneo', ...jack, viento: .2, franjas: true, decorado: madrid,
      delante: [{ tipo: 'contador', en: VEINTITRES - .3, x: 470, y: 210, a: 23.3, decimales: 1, despues: ' €/m²', tam: 84, rotulo: 'alquiler en Madrid capital, al mes', dura: 1.2, hasta: en.b15 },
        { tipo: 'sello', en: RECORD, x: 470, y: 330, texto: 'RÉCORD', ancho: 300, escala: .7, hasta: en.b15 },
        { tipo: 'recibo', en: DOSMIL - .2, x: 330, y: 150, largo: 190, titulo: 'NÓMINA', texto: 'un sueldo' },
        { tipo: 'recibo', en: DOSMIL, x: 560, y: 150, largo: 440, titulo: 'ALQUILER', texto: '2.100 €/mes' }],
      actores: pasan(6, PANEO + .3, 1.6),
      camara: [[PANEO, 700, 400, 1.35], [PANEO + 2.4, 640, 360, 1], [DOSMIL, 640, 340, 1.05], [en.b16, 640, 330, 1.12]] },
    { desde: en.b16, ...jack, viento: .1, decorado: [cielo, { tipo: 'rascacielos', tono: .45, n: 13, par: .45 }, { tipo: 'suelo', par: 1, matas: 0 }],
      delante: [{ tipo: 'munecas', x: 640, y: 600, cols: 3, pisos: 4, cw: 180, ch: 112, tono: 0,
        cuartos: [[COMPARTIDOS - .6, ''], [COMPARTIDOS - .4, ''], [COMPARTIDOS - .2, ''], [MAESTRAS, 'MAESTRA'], [COMPARTIDOS, ''], [ENFERMEROS, 'ENFERMERO'],
          [COMPARTIDOS + .2, ''], [FUNCIONARIOS, 'FUNCIONARIO'], [COMPARTIDOS + .4, ''], [COMPARTIDOS + .6, ''], [COMPARTIDOS + .8, ''], [COMPARTIDOS + 1, '']] }],
      camara: [[en.b16, 640, 380, 1.05], [MAESTRAS - .3, 470, 420, 1.5], [ENFERMEROS - .1, 640, 420, 1.5], [FUNCIONARIOS - .1, 470, 300, 1.5], [en.b17, 640, 360, 1.05]] },
    { desde: en.b17, ...jack, viento: .15, decorado: madrid,
      delante: [{ tipo: 'columnas', x: 640, y: 540, max: 300, escala: .9, panel: true, sep: 120, ancho: 140, hogares: [[en.b17, 0], [RAPIDO, .95]], casas: [[en.b17 + .3, 0], [RAPIDO + 1.2, .4]], hueco: RAPIDO + .9 }],
      actores: pasan(4, en.b17, 1.2),
      camara: [[en.b17, 640, 380, 1.1], [RAPIDO + 1, 640, 360, 1.02]] },
    { desde: en.b18, ...jack, viento: .15, decorado: madrid, actores: pasan(12, GOTAS - 1, .5),
      camara: [[en.b18, 640, 360, 1], [MARCHA, 420, 300, 1.25], [GOTAS, 640, 400, 1.05], [G.fin, 640, 420, 1]] },
  ],
};
