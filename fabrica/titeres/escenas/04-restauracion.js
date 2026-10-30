// Españistán ep. 4 · secuencia C, «El turno» (bloques 6–9). Estilo `jack` en sepia (siglo XIX), 30 fps. Tiempos: tiempos-04.js (estimados).
// Datos: 04-bipartidismo.md, bloque 2 (la Restauración, 1875–1923: turno pacífico, encasillado, caciques y pucherazo).
//   b6      (viento) la misma noria, en sepia: Cánovas entra por la izquierda, Sagasta por la derecha; cada uno, con su nota.
//   b7      «turno pacífico»: la noria gira tranquila. b7.2 (corte) el despacho de Gobernación: el de la levita rellena el ENCASILLADO.
//   b8      (viento) un pueblo de Castilla al sol: el cacique, gigante a contraluz en la puerta; la fila de campesinos, diminuta.
//           «pucherazo» → calma; el puchero cae sobre la mesa donde estaba la urna. Golpe y polvo.
//   b9      (viento) la noria otra vez: Lampedusa. b9.2 «Primo de Rivera» → una bota baja del cielo y pisa la noria, que se para.
const G = T.guion([6, 7, 8, 9]), en = G.en;
const CA = { ropa: 'traje', pelo: 'entradas', barba: 'bigote', nariz: 1.15, narizForma: 'aguilena', menton: 'marcado', gafas: 'redondas', alto: 1, grueso: 1, semilla: 51 };
const SG = { ropa: 'traje', pelo: 'calvo', barba: 'larga', nariz: 1.1, narizForma: 'gruesa', menton: 'redondo', arrugas: .6, alto: 1.02, grueso: 1.05, semilla: 53 };
const LEVITA = ciudadano(70, { ropa: 'traje', sombrero: 'chistera', barba: 'bigote', objeto: 'papel' });
const CACIQUE = ciudadano(71, { ropa: 'traje', sombrero: 'boina', barba: 'bigote', objeto: 'baston', grueso: 1.35, barriga: .9, escala: 1.25 });
const jack = { jack: true, quieto: true, figura: '#2b1d12', sombra: 9, contraluz: 0, bordes: ['rgb(255,236,200)', 'rgb(220,140,70)'], borde: .6, tinte: 'sepia' };
const CANOVAS = G.x('b6.2', 4.2), SAGASTA = G.x('b6.2', 6.4), GOBERNACION = G.x('b7.2', 2.4), PUCHERAZO = G.x('b8.2', 3.4), BOTA = G.x('b9.2', 3.4);
const cielo = [{ tipo: 'plano', color: '#b98a52', raya: 'rgba(80,40,10,.2)', luz: 'rgba(255,230,180,.12)', par: .2 }, { tipo: 'disco', x: 1000, y: 200, r: 90, color: '#e8c088', par: .2 },
  { tipo: 'montes', tono: .4, par: .35, y: 540 }];
const noria = (extra = {}) => ({ tipo: 'noria', x: 640, y: 640, r: 300, vel: .02, luces: 0, par: .8, ...extra });
window.ESCENA = {
  dura: G.fin, fps: 30, suelo: 600, voces: G.voces,
  silencios: [[PUCHERAZO - .8, PUCHERAZO], [BOTA - .9, BOTA]],
  sonidos: [
    { en: 0, hasta: en['b7.2'], archivo: 'audio/sfx/viento.mp3', volumen: .2, bucle: true },
    { en: en['b7.2'], hasta: en.b8, archivo: 'audio/sfx/ciudad.mp3', volumen: .08, bucle: true },
    { en: en.b8, hasta: en.b9, archivo: 'audio/sfx/viento.mp3', volumen: .25, bucle: true }, { en: G.x('b8', .5), archivo: 'audio/sfx/campana.mp3', volumen: .15 },
    { en: PUCHERAZO, archivo: 'audio/sfx/impacto.mp3', volumen: .24 },
    { en: en.b9, hasta: G.fin, archivo: 'audio/sfx/viento.mp3', volumen: .2, bucle: true },
    { en: BOTA - .5, archivo: 'audio/sfx/whoosh.mp3', volumen: .6 }, { en: BOTA, archivo: 'audio/sfx/derrumbe.mp3', volumen: .24 }, { en: BOTA, archivo: 'audio/sfx/impacto.mp3', volumen: .32 }],
  carteles: [
    { en: G.x('b6', 1), hasta: en.b7 - .2, x: 40, y: 40, ancho: 520, titulo: 'La Restauración · 1875–1923', tiempos: [CANOVAS, SAGASTA],
      filas: [['Conservadores', 'Cánovas'], ['Liberales', 'Sagasta']], fuente: 'historia de España' },
    { en: G.x('b9', .5), hasta: en['b9.2'] - .2, x: 40, y: 40, ancho: 640, titulo: 'Lampedusa', paso: 2,
      filas: [['«Si queremos que todo siga como está,', ''], ['es necesario que todo cambie»', '']], fuente: 'Giuseppe Tomasi di Lampedusa, El Gatopardo (1958)' },
    { en: BOTA + .8, hasta: G.fin - .2, x: 40, y: 40, ancho: 460, titulo: '1923', filas: [['Fin del turno', 'Primo de Rivera', '#7a1410']], fuente: 'historia de España' }],
  planos: [
    { desde: 0, transicion: 'viento', ...jack, viento: .3, franjas: true, decorado: [...cielo, noria(), { tipo: 'suelo', par: 1, matas: 6 }],
      particulas: [{ tipo: 'pajaros', n: 5, zona: [0, 60, 1280, 260] }],
      actores: [{ p: CA, x: -120, mira: 1, acciones: [{ hace: 'camina', en: CANOVAS - 2, hasta: CANOVAS, a: 360 }, { hace: 'saluda', en: CANOVAS + .1, hasta: CANOVAS + 1.8 }] },
        { p: SG, x: 1400, mira: -1, acciones: [{ hace: 'camina', en: SAGASTA - 2, hasta: SAGASTA, a: 920 }, { hace: 'saluda', en: SAGASTA + .1, hasta: SAGASTA + 1.8 }] }],
      camara: [[0, 640, 360, 1], [en.b7, 640, 340, 1.08], [en['b7.2'], 640, 330, 1.12]] },
    { desde: en['b7.2'] - .1, ...jack, viento: 0, decorado: [{ tipo: 'plano', color: '#5a3a22', raya: 'rgba(0,0,0,.2)', luz: 'rgba(255,200,130,.07)', par: .2 },
        { tipo: 'encasillado', x: 640, y: 300, ancho: 520, en: GOBERNACION, ritmo: 7, par: .8 }, { tipo: 'mesa', x: 640, ancho: 360, par: 1 }, { tipo: 'suelo', par: 1, matas: 0 }],
      actores: [{ p: LEVITA, x: 960, mira: -1, acciones: [{ hace: 'senala', en: GOBERNACION - .3, hasta: en.b8 - .3 }] }],
      camara: [[0, 640, 340, 1.05], [GOBERNACION, 640, 320, 1.15], [en.b8, 640, 315, 1.2]] },
    { desde: en.b8 - .2, transicion: 'viento', ...jack, tinte: null, viento: .4, decorado: [{ tipo: 'plano', color: '#d9a35a', raya: 'rgba(120,60,10,.18)', luz: 'rgba(255,240,200,.15)', par: .2 },
        { tipo: 'disco', x: 1080, y: 150, r: 110, color: '#f3d28c', par: .2 }, { tipo: 'casa', x: 230, escala: .9, par: .8 }, { tipo: 'casa', x: 1150, escala: .7, tono: .3, par: .6 },
        { tipo: 'urna', x: 640, y: 508, escala: .8, hasta: PUCHERAZO, par: 1 }, { tipo: 'puchero', x: 640, y: 508, en: PUCHERAZO, escala: .9, par: 1 },
        { tipo: 'mesa', x: 640, ancho: 240, par: 1 }, { tipo: 'suelo', par: 1, matas: 10 }],
      particulas: [{ tipo: 'polvo', n: 60 }],
      actores: [{ p: CACIQUE, x: 330, mira: 1, acciones: [{ hace: 'golpea', en: G.x('b8', 1.2), hasta: G.x('b8', 2.6) }, { hace: 'senala', en: PUCHERAZO + .4, hasta: en.b9 - .3 }] },
        ...[72, 73, 74, 75, 76].map((n, i) => ({ p: ciudadano(n, { sombrero: i % 2 ? 'boina' : null, escala: .5 }), x: 820 + i * 85, mira: -1,
          acciones: [{ hace: 'encoge', en: PUCHERAZO + .2 + .1 * i, hasta: PUCHERAZO + 1.8 }] }))],
      camara: [[0, 640, 360, 1], [PUCHERAZO - .05, 640, 350, 1.05], [PUCHERAZO - .05, 640, 430, 1.8], [en.b9, 640, 425, 1.85]] },
    { desde: en.b9 - .2, transicion: 'viento', ...jack, viento: .3, franjas: true,
      decorado: [...cielo, noria({ para: BOTA, sacude: [BOTA] }), { tipo: 'bota', x: 560, y: 350, en: BOTA, escala: .9, par: .8 }, { tipo: 'suelo', par: 1, matas: 6 }],
      camara: [[0, 640, 360, 1], [BOTA - .05, 640, 350, 1.06], [BOTA - .05, 640, 360, 1.18], [G.fin, 640, 360, 1.2]] },
  ],
};
