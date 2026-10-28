// Españistán ep. 4 · secuencias E y F, «Los hilos» y «El Senado» (bloques 18–26, frases f1 y f2). Estilo `jack`, 30 fps. Tiempos: tiempos-04.js (estimados hasta que exista la voz).
// Datos: 04-bipartidismo.md (Rousseau, Michels, multa de 2016, Senado art. 166 LOREG, propuesta de Feijóo de enero de 2023).
//   b18     el voto de Rousseau: una mano echa la papeleta y, al salir, un grillete se le cierra («esclavos»).
//   b18.2   (corte) la lista: la mano del partido la escribe renglón a renglón.
//   b19     un diputado-marioneta bajo el foco; en «se lo debe» le salen hilos hacia arriba. b19.2 Michels: la cámara sube por los hilos hasta la mano.
//   b20     (viento) octubre de 2016: el hemiciclo de marionetas; «quince» → quince tiran al revés; calma y, en «multa», el sello y vuelven de golpe.
//   b21, f1 Sanchís se levanta y se va; primer plano de frente: «No es no. Hasta que es sí.»
//   b23     (viento) colegio electoral de día: la papeleta sepia del Senado se despliega y se marcan tres cruces. b23.3 la gente pasa de largo.
//   b24, f2 Feijolo con el letrero LISTA MÁS VOTADA.
//   b26     la pregunta del Decano: la marioneta mira a la gente y luego arriba, a la mano.
const G = T.guion([18, 19, 20, 21, 'f1', 23, 24, 'f2', 26]), en = G.en;
const SA = PERSONAJES.sanchis, FE = PERSONAJES.feijolo, DE = PERSONAJES.decano;
const jack = { jack: true, quieto: true, figura: '#2b2522', sombra: 9, contraluz: 0, bordes: ['rgb(255,226,190)', 'rgb(255,120,70)'], borde: .7 };
// palabras clave (segundos dentro de su frase, a 14 letras/s; afinar con el audio real)
const ECHA = G.x('b18', 4.6), ESCLAVOS = G.x('b18', 7.4), ESCRIBE = G.x('b18.2', 2.6), DEBE = G.x('b19', 4), QUINCE = G.x('b20.2', .3), MULTA = G.x('b20.2', 3.6);
const ABRE = G.x('b23', 3), CRUCES = [G.x('b23.2', 1), G.x('b23.2', 2), G.x('b23.2', 3)], LETRERO = G.x('b24', .9);
const oscuro = (luz = .1) => [{ tipo: 'plano', color: '#1e1612', raya: 'rgba(0,0,0,.35)', luz: `rgba(255,210,150,${luz})`, par: .2 }];
const foco = (x, y, r) => ({ tipo: 'astro', x, y, r, par: .9 });
const nota = (en0, hasta, titulo, filas, fuente, ancho = 560) => ({ en: en0, hasta, x: 40, y: 40, ancho, titulo, filas, fuente });
const gente = (desde, n0) => [0, 1, 2, 3, 4, 5].map(i => ({ p: ciudadano(n0 + i, { escala: .62 }), x: -160 - i * 170, mira: 1,
  acciones: [{ hace: 'camina', en: desde + .3 * i, hasta: desde + 6 + .3 * i, a: 1500 - i * 40 }] }));
window.ESCENA = {
  dura: G.fin, fps: 30, suelo: 600, voces: G.voces,
  silencios: [[ESCLAVOS - .8, ESCLAVOS], [MULTA - 1, MULTA]],
  sonidos: [
    { en: 0, hasta: en.b20, archivo: 'audio/sfx/grada.mp3', volumen: .1, bucle: true },
    { en: ECHA + .2, archivo: 'audio/sfx/whoosh.mp3', volumen: .25 }, { en: ESCLAVOS, archivo: 'audio/sfx/impacto.mp3', volumen: .6 },
    { en: DEBE, archivo: 'audio/sfx/riser.mp3', volumen: .3 },
    { en: en.b20, hasta: en.b23, archivo: 'audio/sfx/grada.mp3', volumen: .2, bucle: true }, { en: en.b20 - .2, archivo: 'audio/sfx/viento.mp3', volumen: .3 },
    { en: QUINCE + .3, archivo: 'audio/sfx/riser.mp3', volumen: .3 }, { en: MULTA, archivo: 'audio/sfx/impacto.mp3', volumen: .9 },
    { en: en.b23 - .2, archivo: 'audio/sfx/viento.mp3', volumen: .3 }, { en: en.b23, hasta: en.b26, archivo: 'audio/sfx/ciudad.mp3', volumen: .15, bucle: true },
    { en: ABRE, archivo: 'audio/sfx/whoosh.mp3', volumen: .3 },
    { en: en.b26, hasta: G.fin, archivo: 'audio/sfx/viento.mp3', volumen: .12, bucle: true }],
  carteles: [
    nota(G.x('b18', .6), ESCLAVOS - .2, 'Rousseau · El contrato social, 1762', [['«El pueblo inglés cree ser libre…', ''], ['…solo lo es durante la elección»', '']], 'libro III, capítulo 15', 620),
    nota(G.x('b18.2', 1), en.b19 - .3, 'Listas cerradas', [['Las escribe', 'el partido', '#7a1410'], ['El orden', 'también']], 'LOREG, art. 96', 480),
    nota(G.x('b19.2', .5), en.b20 - .3, 'Robert Michels · 1911', [['«Quien dice organización…', ''], ['…dice oligarquía»', '']], 'Los partidos políticos', 560),
    { en: QUINCE + .4, hasta: en.b21 - .3, x: 40, y: 40, ancho: 560, titulo: 'Investidura de Rajoyo · 29-10-2016', tiempos: [QUINCE + .4, QUINCE + 1, MULTA + .4],
      filas: [['Orden del PSOE', 'abstenerse'], ['Votaron no', '15', '#7a1410'], ['Multa', '600 € cada uno', '#7a1410']], fuente: 'Comisión gestora del PSOE' },
    nota(G.x('b21', 1.2), en.f1 - .3, 'Sanchís', [['Deja su escaño', '29-10-2016'], ['Gana las primarias', '2017']], 'Congreso · PSOE', 480),
    nota(G.x('b23', 3.4), en['b23.3'] - .2, 'Senado', [['Listas abiertas', 'hasta 3 nombres'], ['Pueden ser de', 'partidos distintos']], 'LOREG, art. 166', 520),
    nota(LETRERO + .6, en.f2 - .3, 'Feijolo · enero de 2023', [['Propone', 'que gobierne la lista más votada'], ['Hoy solo pasa en', 'los ayuntamientos']], 'Partido Popular · LOREG', 640),
    { en: G.x('b26', .5), hasta: G.fin - .2, x: 40, y: 40, ancho: 600, titulo: 'Pregunta del Decano', tiempos: [G.x('b26', 2), G.x('b26', 3.8)],
      filas: [['Si vota lo que manda el partido…', ''], ['…¿a quién representa?', '']], fuente: 'Españistán' }],
  planos: [
    // b18: el voto de Rousseau
    { desde: 0, ...jack, viento: 0, borde: .4, decorado: [...oscuro(.12), foco(640, 300, 260), { tipo: 'voto', x: 640, y: 600, echa: ECHA, grillete: ESCLAVOS, par: 1 }, { tipo: 'suelo', par: 1, matas: 0 }],
      particulas: [{ tipo: 'polvo', n: 30 }],
      camara: [[0, 640, 330, 1.05], [ECHA, 640, 300, 1.15], [ESCLAVOS - .05, 640, 290, 1.18], [ESCLAVOS - .05, 700, 220, 1.5], [en['b18.2'], 700, 225, 1.45]] },
    // b18.2: la lista la escribe el partido
    { desde: en['b18.2'] - .1, ...jack, viento: 0, borde: .4, decorado: [...oscuro(.08), foco(640, 260, 300), { tipo: 'lista', x: 640, y: 640, escala: 1.1, texto: 'LISTA DEL PARTIDO', n: 9, escribe: ESCRIBE, ritmo: 3, par: 1 }],
      camara: [[0, 640, 330, 1], [en.b19, 640, 320, 1.06]] },
    // b19: el diputado-marioneta; los hilos nacen en «se lo debe»; con Michels la cámara sube hasta la mano
    { desde: en.b19 - .1, ...jack, viento: 0, borde: .4, decorado: [...oscuro(.06), foco(640, 330, 220),
        { tipo: 'marionetas', uno: true, x: 640, y: 600, escala: 1, crecen: DEBE, mano: { x: 640, y: -330, escala: 1.4 }, par: 1 }, { tipo: 'suelo', par: 1, matas: 0 }],
      camara: [[0, 640, 400, 1.3], [DEBE, 640, 390, 1.25], [en['b19.2'], 640, 330, 1], [G.x('b19.2', 3), 640, -60, .95], [en.b20, 640, -80, .95]] },
    // b20: octubre de 2016, el hemiciclo de marionetas; los quince y la multa
    { desde: en.b20 - .2, transicion: 'viento', ...jack, viento: 0, borde: .4, decorado: [...oscuro(.1), foco(640, 120, 340),
        { tipo: 'marionetas', x: 640, y: 720, escala: .95, filas: 6, mano: { x: 640, y: -40, escala: 1.6 }, rebeldes: { n: 15, en: QUINCE, multa: MULTA }, par: 1 },
        { tipo: 'sello', x: 820, y: 330, en: MULTA, texto: 'MULTA\n600 €', ancho: 360, par: 1 }],
      camara: [[0, 640, 300, 1.05], [QUINCE - .05, 640, 330, 1.1], [QUINCE - .05, 640, 420, 1.35], [MULTA - .05, 650, 410, 1.4], [MULTA - .05, 640, 340, 1.05], [en.b21, 640, 340, 1.08]] },
    // b21: Sanchís se levanta y se va
    { desde: en.b21 - .1, ...jack, viento: 0, borde: .4, decorado: [...oscuro(.1), foco(500, 300, 240),
        { tipo: 'marionetas', x: 640, y: 900, escala: 1.2, filas: 3, mano: { x: 640, y: -200, escala: 1.6 }, tono: .25, par: .6 },
        { tipo: 'mesa', x: 520, escala: .8, ancho: 300, sillas: [], par: 1 }, { tipo: 'suelo', par: 1, matas: 0 }],
      actores: [{ p: SA, x: 520, mira: 1, acciones: [{ hace: 'gira', en: G.x('b21', .2), hasta: G.x('b21', .8) }, { hace: 'camina', en: G.x('b21', .9), hasta: en.f1 - .4, a: 1050 }] }],
      camara: [[0, 560, 330, 1.15], [en.f1 - .3, 760, 330, 1.1]] },
    // f1: primer plano de frente
    { desde: en.f1 - .2, ...jack, viento: .1, decorado: [...oscuro(.14), foco(640, 280, 260)],
      actores: [{ p: SA, x: 640, vista: 'frente', acciones: [{ hace: 'habla', en: en.f1, hasta: en.f1 + 2.3 }, { hace: 'encoge', en: en.f1 + 1.3, hasta: en.f1 + 2.6 }] }],
      camara: [[0, 640, 250, 1.75], [en.b23, 640, 245, 1.8]] },
    // b23: el Senado, el único rato limpio: luz de ventana
    { desde: en.b23 - .2, transicion: 'viento', ...jack, viento: .1, decorado: [{ tipo: 'plano', color: '#b9a383', raya: 'rgba(0,0,0,.1)', luz: 'rgba(255,250,235,.15)', par: .2 },
        { tipo: 'disco', x: 1060, y: 230, r: 110, color: '#efe3c8', par: .2 }, { tipo: 'senado', x: 740, y: 620, abre: ABRE, cruces: CRUCES, escala: .9, par: .9 },
        { tipo: 'urna', x: 1190, escala: 1.1, par: 1 }, { tipo: 'suelo', par: 1, matas: 0 }],
      actores: gente(en['b23.3'] - .2, 70),
      camara: [[0, 640, 360, 1], [ABRE, 640, 340, 1.04], [CRUCES[0] - .1, 640, 330, 1.12], [en['b23.3'], 640, 345, 1.05], [en.b24, 640, 350, 1]] },
    // b24, f2: Feijolo y la lista más votada
    { desde: en.b24 - .1, ...jack, viento: .2, decorado: [{ tipo: 'plano', color: '#2f4a5c', raya: 'rgba(0,0,0,.2)', luz: 'rgba(160,200,255,.07)', par: .2 },
        { tipo: 'letrero', x: 760, y: 170, ancho: 560, texto: 'LISTA MÁS VOTADA', enciende: LETRERO, tam: 34, par: .6 }, { tipo: 'suelo', par: 1, matas: 0 }],
      actores: [{ p: FE, x: 380, mira: 1, acciones: [{ hace: 'senala', en: LETRERO, hasta: en.f2 - .3 }, { hace: 'habla', en: en.f2, hasta: en.f2 + 4.4 }, { hace: 'puno', en: en.f2 + 2.6, hasta: en.f2 + 4.4 }] }],
      camara: [[0, 600, 330, 1.05], [en.f2 - .05, 560, 320, 1.15], [en.f2 + 2.4, 440, 290, 1.5], [en.b26, 430, 285, 1.55]] },
    // b26: la pregunta del Decano: la marioneta mira a la gente y luego arriba
    { desde: en.b26 - .2, transicion: 'viento', ...jack, viento: .2, decorado: [...oscuro(.1), foco(760, 320, 240),
        { tipo: 'marionetas', uno: true, x: 760, y: 600, escala: .8, mano: { x: 760, y: -120, escala: 1.2 }, mira: [[G.x('b26', 1.8), Math.PI], [G.x('b26', 3.6), -Math.PI / 2]], par: 1 },
        { tipo: 'suelo', par: 1, matas: 0 }],
      actores: [...[0, 1, 2].map(i => ({ p: ciudadano(80 + i, { escala: .62 }), x: 140 + i * 110, mira: 1, acciones: [] })),
        { p: DE, x: 1380, mira: -1, acciones: [{ hace: 'camina', en: en.b26, hasta: G.x('b26', 1.8), a: 1060 }, { hace: 'senala', en: G.x('b26', 2), hasta: G.fin }] }],
      camara: [[0, 700, 340, 1.05], [G.fin, 700, 320, 1.12]] },
  ],
};
