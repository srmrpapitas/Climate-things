// Españistán ep. 5 · secuencia H, «La solución» (bloques 44–48). Estilo `jack`, 30 fps. Tiempos: tiempos-05.js (estimados hasta que exista la voz).
// Sin la noria del ep. 4. La resta vuelve al amanecer y se le suman cuatro piezas de oro (el plan), una por idea; las casas de verdad suben despacio.
// Datos: 05-vivienda.md (Viena ≈ 43 % de vivienda municipal o subvencionada, socialhousing.wien; UE ≈ 10 %; Españistán 1,5–2,5 % según la definición;
// Tokio: licencia «por derecho» si se cumple la zonificación nacional).
//   b44     (viento) la resta al amanecer con su hueco rojo. «sumar» → se dibujan cuatro huecos a trazos en la columna de CASAS.
//   b44.2   PANEO a Tokio: sol rojo, rascacielos y grúas que no paran. «licencia» → sello LICENCIA; en la esquina, la resta recibe la pieza 1.
//   b45     (viento) Viena: un bloque con el sello NO SE VENDE; «cuarenta» → las barras Viena / UE / Españistán. Pieza 2.
//   b46     corte a Españistán en invierno: la caja VIVIENDA SOCIAL vuelve del propietario al Estado; «recuperar» → la llave vuela a su mano;
//           «vuelven» → suben las persianas del bloque. Pieza 3.
//   b47     (viento) la resta: Sanchís y Feijolo sostienen juntos la pieza 4; «legislatura» → la suben a su sitio y se dan la mano.
//   b48     «cien años» → reloj de arena enorme; las casas de verdad suben poco; «crece» → los hogares siguen subiendo y el hueco late arriba.
const G = T.guion([44, 45, 46, 47, 48], { desde: 1 }), en = G.en;
const SA = PERSONAJES.sanchis, FE = PERSONAJES.feijolo;
const PR = ciudadano(400, { escala: .95, arrugas: .8, pelo: 'calvo', gafas: 'cuadradas', objeto: 'papel', encorvado: .08 });   // el propietario de la secuencia F
const jack = { jack: true, quieto: true, figura: '#2b2522', sombra: 9, contraluz: 0, bordes: ['rgb(255,226,190)', 'rgb(255,120,70)'], borde: .7 };
// palabras clave (a ojo, a 14 letras/s; G.x las pasa al segundo real)
const SUMAR = G.x('b44', 5), CUATRO = G.x('b44', 6), TOKIO = G.x('b44.2', 3.8), LICENCIA = G.x('b44.2', 5.9), NUNCA = G.x('b45', 2.7), VIENA = G.x('b45', 4.3),
  CUARENTA = G.x('b45', 5.4), ESPANISTAN = G.x('b45', 7.1), CASAS = G.x('b46', 5), RECUPERAR = G.x('b46', 7.3), VUELVEN = G.x('b46', 9.3),
  FAMILIAS = G.x('b47', 1.7), LEGISLATURA = G.x('b47', 4.1), CIEN = G.x('b48', 1.8), CRECE = G.x('b48', 5.7);
const PIEZA = [LICENCIA + .6, ESPANISTAN + 1.2, VUELVEN + .6, LEGISLATURA + 1];
const nota = (en0, hasta, titulo, filas, fuente, x = 40) => ({ en: en0, hasta, x, y: 40, ancho: 480, titulo, filas, fuente });
const piezas = [[PIEZA[0], '1 · SUELO'], [PIEZA[1], '2 · ALQUILER'], [PIEZA[2], '3 · ESTADO'], [PIEZA[3], '4 · PACTO']];
const alba = [{ tipo: 'plano', color: '#c98a4a', raya: 'rgba(90,40,10,.22)', luz: 'rgba(255,230,170,.2)', par: .2 }, { tipo: 'astro', x: 1060, y: 170, r: 70, par: .2 }];
// la resta grande (b44, b47–b48) y la pequeña de la esquina (b44.2–b46): la misma, con sus piezas
const resta = extra => ({ tipo: 'columnas', hogares: [[0, .95]], casas: [[0, .4]], hueco: -1, piezas, plan: SUMAR, ...extra });
const esquina = resta({ x: 1110, y: 590, max: 230, escala: .5, sep: 75, ancho: 90, panel: true, etiquetas: ['HOG.', 'CASAS'] });
// gente diminuta que sigue llegando a la resta por los bordes (el agujero crece si no se empieza)
const llegan = t0 => [0, 1, 2, 3, 4, 5].map(i => { const izq = i % 2 === 0, t1 = t0 + .5 * i;
  return { p: ciudadano(500 + i, { escala: .3 }), x: izq ? -60 : 1340, mira: izq ? 1 : -1, desde: t1 - .1, acciones: [{ hace: 'camina', en: t1, hasta: t1 + 3.5, a: izq ? 330 + 14 * i : 1040 - 14 * i }] }; });
const pasan = (n, t0, cada) => Array.from({ length: n }, (_, i) => { const izq = i % 2 === 0, t1 = t0 + i * cada;
  return { p: ciudadano(520 + i, { escala: .4 + .05 * (i % 3) }), x: izq ? -60 : 1340, mira: izq ? 1 : -1, desde: t1 - .1, hasta: t1 + 7, acciones: [{ hace: 'camina', en: t1, hasta: t1 + 6.5, a: izq ? 1340 : -60 }] }; });
window.ESCENA = {
  dura: G.fin, fps: 30, suelo: 600, voces: G.voces,
  silencios: [[CIEN - .5, CIEN]],
  sonidos: [
    { en: 0, archivo: 'audio/sfx/viento.mp3', volumen: .25 }, { en: 0, hasta: en['b44.2'], archivo: 'audio/sfx/dron.mp3', volumen: .12, bucle: true },
    { en: SUMAR, archivo: 'audio/sfx/riser.mp3', volumen: .18 },
    { en: en['b44.2'] - .4, archivo: 'audio/sfx/whoosh.mp3', volumen: .45 }, { en: en['b44.2'], hasta: en.b45, archivo: 'audio/sfx/ciudad.mp3', volumen: .22, bucle: true },
    { en: LICENCIA, archivo: 'audio/sfx/impacto.mp3', volumen: .18 }, { en: en.b45 - .2, archivo: 'audio/sfx/viento.mp3', volumen: .3 },
    { en: NUNCA, archivo: 'audio/sfx/impacto.mp3', volumen: .16 }, { en: RECUPERAR, archivo: 'audio/sfx/whoosh.mp3', volumen: .3 },
    { en: en.b47 - .2, archivo: 'audio/sfx/viento.mp3', volumen: .3 }, { en: LEGISLATURA, archivo: 'audio/sfx/riser.mp3', volumen: .25 },
    ...PIEZA.map(t => ({ en: t + .2, archivo: 'audio/sfx/impacto.mp3', volumen: .10 })),
    { en: CRECE, archivo: 'audio/sfx/dron.mp3', volumen: .15 }],
  carteles: [
    nota(LICENCIA + .4, en.b45 - .2, 'Tokio', [['Si cumples la norma', 'tienes la licencia'], ['La zonificación', 'la fija el Estado']], 'Ley de urbanismo de Japón · Xataka'),
    nota(ESPANISTAN + .5, en.b46 - .2, 'Vivienda pública de alquiler', [['Viena · UE · Españistán', '> 40 % · ≈ 10 % · ≈ 2 %', '#7a1410']], 'socialhousing.wien · Ministerio de Vivienda', 400),
    nota(CIEN + .4, G.fin, 'Viena', [['Empezó', 'en los años veinte'], ['Hoy', '> 40 % vivienda pública']], 'socialhousing.wien'),
  ],
  planos: [
    // b44: la resta al amanecer; «sumar» → los cuatro huecos del plan
    { desde: 0, ...jack, viento: .3, decorado: [...alba, { tipo: 'penumbra', a: .45, r: 640, par: 1 }],
      delante: [resta({ x: 640, y: 570, max: 380 })],
      actores: llegan(.6),
      camara: [[0, 640, 380, 1.05], [CUATRO, 700, 330, 1.2], [en['b44.2'], 760, 320, 1.35]] },
    // b44.2: Tokio, sol rojo y grúas que no paran
    { desde: en['b44.2'], transicion: 'paneo', ...jack, viento: .2, franjas: true,
      decorado: [{ tipo: 'plano', color: '#e2c89a', raya: 'rgba(120,70,30,.18)', luz: 'rgba(255,240,200,.18)', par: .2 }, { tipo: 'disco', x: 900, y: 240, r: 110, color: '#c4381f', par: .2 },
        { tipo: 'nubes', tono: .6, n: 3, y: 110, par: .25 }, { tipo: 'rascacielos', tono: .45, n: 15, par: .45 },
        { tipo: 'grua', x: 180, alto: 440, escala: .9, tono: .3, arranca: 0, par: .6 }, { tipo: 'grua', x: 560, alto: 380, escala: .75, tono: .35, arranca: 0, par: .55 },
        { tipo: 'grua', x: 860, alto: 470, escala: .9, tono: .3, arranca: 0, par: .6 }, { tipo: 'suelo', par: 1, matas: 0 }],
      delante: [{ tipo: 'sello', en: LICENCIA, x: 560, y: 330, texto: 'LICENCIA', ancho: 320, escala: .75, giro: -.1 }, esquina],
      actores: pasan(6, en['b44.2'] + .2, 1.2),
      camara: [[en['b44.2'], 700, 400, 1.35], [en['b44.2'] + 2.4, 640, 360, 1], [TOKIO, 620, 360, 1.03], [en.b45, 640, 360, 1]] },
    // b45: Viena, el bloque que no se vende y las barras
    { desde: en.b45, transicion: 'viento', ...jack, viento: .25,
      decorado: [{ tipo: 'plano', color: '#b98a6a', raya: 'rgba(70,35,20,.2)', luz: 'rgba(255,230,190,.16)', par: .2 }, { tipo: 'ciudad', tono: .4, par: .3, y: 560, s: 7 },
        { tipo: 'bloque', x: 230, cols: 3, pisos: 4, par: 1 }, { tipo: 'suelo', par: 1, matas: 0 }],
      delante: [{ tipo: 'sello', en: NUNCA, x: 230, y: 420, texto: 'NO SE VENDE', ancho: 330, escala: .55, giro: -.14 },
        { tipo: 'barras', en: VIENA - .2, x: 690, y: 560, alto: 220, sep: 190, ancho: 110, max: 50,
          barras: [['VIENA', 43, '#3f6b4a', VIENA, '> 40 %'], ['UE', 10, '#5a6e8a', CUARENTA + .5, '≈ 10 %'], ['ESPAÑISTÁN', 2, '#a3140f', ESPANISTAN, '≈ 2 %']] }, esquina],
      camara: [[en.b45, 260, 380, 1.3], [VIENA - .3, 640, 360, 1], [ESPANISTAN, 640, 365, 1.02]] },
    // b46: Españistán en invierno; la caja vuelve al Estado y las persianas suben
    { desde: en.b46, ...jack, viento: .2,
      decorado: [{ tipo: 'plano', color: '#3b4a5e', raya: 'rgba(10,15,30,.3)', luz: 'rgba(200,220,255,.08)', par: .2 }, { tipo: 'congreso', x: 220, escala: .7, par: .9 },
        { tipo: 'bloque', x: 880, cols: 4, pisos: 5, todas: -9, suben: VUELVEN, par: 1 }, { tipo: 'suelo', par: 1, matas: 0 }],
      delante: [{ tipo: 'caja', de: [540, 470], a: [230, 560], cae: CASAS - .6, texto: 'VIVIENDA SOCIAL', escala: .8 },
        { tipo: 'llave', x: 880, y: 230, en: en.b46 + .5, vuela: [RECUPERAR, 615, 410], escala: .7 }, esquina],
      actores: [{ p: PR, x: 560, mira: -1, acciones: [{ hace: 'brazos', en: en.b46, hasta: CASAS - .4, h: 1.4 }, { hace: 'gira', en: RECUPERAR - .5 }, { hace: 'asiente', en: RECUPERAR + .3, hasta: RECUPERAR + 1.6 }] }],
      camara: [[en.b46, 400, 380, 1.15], [CASAS, 360, 360, 1.1], [RECUPERAR, 640, 360, 1], [VUELVEN, 840, 360, 1.12]] },
    // b47–b48: la resta otra vez; las dos familias suben la pieza 4; después, cien años
    { desde: en.b47, transicion: 'viento', ...jack, viento: .3, decorado: [...alba, { tipo: 'penumbra', a: .35, r: 700, par: 1 }],
      delante: [resta({ x: 790, y: 590, max: 300, sep: 130, ancho: 150, casas: [[CIEN, .4], [CIEN + 4, .47]], hogares: [[CRECE - .3, .95], [CRECE + 1.2, 1.03]] }),
        { tipo: 'caja', de: [360, 250], a: [920, 356], cae: LEGISLATURA, texto: '4 · PACTO', escala: .8, hasta: PIEZA[3] - .05 },
        { tipo: 'relojArena', x: 260, y: 600, en: CIEN, dura: 40, escala: 1.15, desde: CIEN - .1 }],
      actores: [
        { p: SA, x: 250, mira: 1, hasta: CIEN + 1, acciones: [{ hace: 'brazos', en: en.b47, hasta: LEGISLATURA, h: 2.6, h2: 2.5 }, { hace: 'mano', en: PIEZA[3] + .2, hasta: PIEZA[3] + 2.4, h: .1 }, { hace: 'camina', en: PIEZA[3] + 2.5, hasta: CIEN + .8, a: -200 }] },
        { p: FE, x: 470, mira: -1, hasta: CIEN + 1, acciones: [{ hace: 'brazos', en: en.b47, hasta: LEGISLATURA, h: 2.6, h2: 2.5 }, { hace: 'mano', en: PIEZA[3] + .2, hasta: PIEZA[3] + 2.4, h: -.1 }, { hace: 'camina', en: PIEZA[3] + 2.6, hasta: CIEN + .9, a: -120 }] },
        ...llegan(CRECE - 1.4)],
      camara: [[en.b47, 420, 360, 1.15], [FAMILIAS, 400, 350, 1.2], [LEGISLATURA, 640, 360, 1], [CIEN, 640, 360, 1], [CRECE, 760, 300, 1.12], [G.fin, 760, 290, 1.16]] },
  ],
};
