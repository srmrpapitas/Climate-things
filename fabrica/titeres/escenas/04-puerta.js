// Españistán ep. 4 · secuencia H, «La puerta» (bloques 33–34). Estilo `jack`, 30 fps. Tiempos: tiempos-04.js (G.x pasa las palabras clave a segundos reales).
// Datos: 04-bipartidismo.md (Felipe González, consejero de Gas Natural Fenosa 2010–2015; Aznar, asesor externo de Endesa desde 2011). Empresas sin logo: una torre con un rayo.
//   b33     avenida de rascacielos al atardecer; entre el Congreso y la torre, la puerta giratoria. «otra puerta» → empieza a girar.
//   b33.2   Felipón sale del Congreso, entra en la puerta y, con un destello, sale por el otro lado con un contrato en la mano.
//   b34     Ansar, igual, por el mismo hueco. b34.2 «contratan» → se enciende el rayo de la torre.
//   b34.3   calma; «No es delito» → sello NO ES DELITO; «costumbre» → la cámara se acerca a la puerta, que sigue girando sola.
const G = T.guion([33, 34]), en = G.en;
const FP = PERSONAJES.felipon, AN = PERSONAJES.ansar;
const jack = { jack: true, quieto: true, figura: '#2b2522', sombra: 9, contraluz: 0, bordes: ['rgb(255,226,190)', 'rgb(255,120,70)'], borde: .7 };
// palabras clave (a ojo, a 14 letras/s; G.x las pasa al segundo real)
const PUERTA = G.x('b33', 2.9), CRUZA1 = G.x('b33.2', 3), CRUZA2 = G.x('b34', 2.4), CONTRATAN = G.x('b34.2', 4.9), DELITO = G.x('b34.3', .5), COSTUMBRE = G.x('b34.3', 1.5);
const nota = (en0, hasta, titulo, filas, fuente) => ({ en: en0, hasta, x: 40, y: 40, ancho: 600, titulo, filas, fuente });
// pasar por la puerta: entra uno por la izquierda y sale «otro» (el mismo, con el contrato) por la derecha
const cruza = (p, desde, cruce, hasta, x1) => [
  { p, x: 250, mira: 1, desde: desde - .3, hasta: cruce, acciones: [{ hace: 'camina', en: desde, hasta: cruce, a: 640 }] },
  { p: { ...p, objeto: 'papel' }, x: 640, mira: 1, desde: cruce, acciones: [{ hace: 'camina', en: cruce, hasta, a: x1 }] }];
window.ESCENA = {
  dura: G.fin, fps: 30, suelo: 600, voces: G.voces,
  silencios: [[DELITO - .7, DELITO]],
  sonidos: [
    { en: 0, hasta: G.fin, archivo: 'audio/sfx/ciudad.mp3', volumen: .18, bucle: true }, { en: 0, archivo: 'audio/sfx/viento.mp3', volumen: .25 },
    { en: PUERTA, archivo: 'audio/sfx/whoosh.mp3', volumen: .25 }, { en: CRUZA1, archivo: 'audio/sfx/whoosh.mp3', volumen: .35 }, { en: CRUZA2, archivo: 'audio/sfx/whoosh.mp3', volumen: .35 },
    { en: CONTRATAN, archivo: 'audio/sfx/riser.mp3', volumen: .25 }, { en: DELITO, archivo: 'audio/sfx/impacto.mp3', volumen: .32 }],
  carteles: [
    nota(G.x('b33.2', .5), en.b34 - .2, 'Felipón', [['Presidente del Gobierno', '1982–1996'], ['Consejero de Gas Natural Fenosa', '2010–2015', '#7a1410']], 'Gas Natural Fenosa · prensa'),
    nota(G.x('b34', .5), en['b34.2'] - .2, 'Ansar', [['Presidente del Gobierno', '1996–2004'], ['Asesor externo de Endesa', 'desde 2011', '#7a1410']], 'Endesa · prensa'),
  ],
  planos: [
    { desde: 0, ...jack, viento: .2, decorado: [{ tipo: 'plano', color: '#c8611f', raya: 'rgba(90,30,10,.25)', luz: 'rgba(255,200,120,.18)', par: .2 },
        { tipo: 'astro', x: 640, y: 330, r: 90, par: .2 }, { tipo: 'rascacielos', tono: .45, n: 12, par: .4 },
        { tipo: 'congreso', x: 230, escala: .55, par: .9 }, { tipo: 'torre', x: 1060, alto: 500, enciende: CONTRATAN, par: .9 }, { tipo: 'suelo', par: 1, matas: 0 }],
      delante: [{ tipo: 'puerta', x: 640, r: 135, alto: 400, arranca: PUERTA, vel: .3, texto: 'SALIDA', destellos: [CRUZA1, CRUZA2], par: 1 },
        { tipo: 'sello', en: DELITO, x: 640, y: 110, texto: 'NO ES DELITO', ancho: 520, giro: -.08, par: 1 }],
      actores: [...cruza(FP, en['b33.2'], CRUZA1, CRUZA1 + 2.6, 900), ...cruza(AN, en.b34, CRUZA2, CRUZA2 + 2.6, 1010)],
      camara: [[0, 640, 360, 1], [PUERTA, 640, 370, 1.06], [en['b34.2'], 700, 360, 1.02], [CONTRATAN, 900, 330, 1.15], [DELITO - .3, 640, 360, 1], [COSTUMBRE, 640, 380, 1.05], [G.fin, 640, 430, 1.6]] },
  ],
};
