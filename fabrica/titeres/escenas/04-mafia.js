// Españistán ep. 4 · secuencia I, «¿Mafia?» (bloques 35–36). Estilo `jack`, 30 fps. Tiempos: tiempos-04.js (G.x pasa las palabras clave a segundos reales).
// Datos: 04-bipartidismo.md. La palabra «mafia» solo la pregunta el Decano (no hay sentencias que lo digan); la que se dice es «cártel» (definición de la RAE).
//   b35     el banquete a oscuras; el Decano entra con su candil. «¿mafia?» → las dos familias se giran a la vez hacia la cámara.
//   b35.2   «violencia» → el Decano niega con la cabeza.
//   b36     «compiten en público» → se encaran; «en privado» → asienten; calma y, en «cártel», cae el sello CÁRTEL como una losa.
const G = T.guion([35, 36]), en = G.en;
const SA = PERSONAJES.sanchis, FE = PERSONAJES.feijolo, DE = PERSONAJES.decano;
const grande = p => ({ ...p, escala: 1.3 });
const jack = { jack: true, quieto: true, figura: '#2b2522', sombra: 9, contraluz: 0, bordes: ['rgb(255,226,190)', 'rgb(255,120,70)'], borde: .7 };
// palabras clave (a ojo, a 14 letras/s; G.x las pasa al segundo real)
const MAFIA = G.x('b35', 2.6), VIOLENCIA = G.x('b35.2', 1.4), PUBLICO = G.x('b36', 4), PRIVADO = G.x('b36', 6.3), CARTEL = G.x('b36', 8);
const velas = [[200, 0], [1080, 0], [260, 1], [1020, 1]];
window.ESCENA = {
  dura: G.fin + 2.5, fps: 30, suelo: 600, voces: G.voces,
  silencios: [[MAFIA - .6, MAFIA], [CARTEL - .9, CARTEL]],
  sonidos: [
    { en: 0, hasta: G.fin + 2.5, archivo: 'audio/sfx/lluvia.mp3', volumen: .1, bucle: true },
    { en: MAFIA, archivo: 'audio/sfx/whoosh.mp3', volumen: .3 }, { en: CARTEL, archivo: 'audio/sfx/impacto.mp3', volumen: 1 }, { en: CARTEL + .05, archivo: 'audio/sfx/derrumbe.mp3', volumen: .5 }],
  carteles: [
    { en: CARTEL + .9, hasta: G.fin + 2.5, x: 40, y: 40, ancho: 600, titulo: 'cártel', filas: [['Convenio entre empresas', ''], ['para no competir entre sí', '']], fuente: 'Diccionario de la lengua española (RAE)' },
  ],
  planos: [
    { desde: 0, ...jack, viento: 0, borde: .3, decorado: [{ tipo: 'salon', sinMesa: true, cortina: -9, lluvia: .5, par: 1 }, { tipo: 'reloj', x: 1190, y: 170, par: 1 }],
      delante: [{ tipo: 'banquete', velas, cortes: [{ en: -1, partes: [10, 10] }], par: 1 }, { tipo: 'penumbra', x: 520, y: 380, r: 600, a: .88, par: 1 },
        { tipo: 'sello', en: CARTEL, x: 640, y: 470, texto: 'CÁRTEL', ancho: 560, escala: 1.4, giro: -.05, par: 1 }],
      actores: [
        { p: grande(SA), x: 470, mira: 1, acciones: [{ hace: 'vista', a: 'frente', en: MAFIA }, { hace: 'puno', en: PUBLICO, hasta: PUBLICO + 1.4 }, { hace: 'asiente', en: PRIVADO, hasta: PRIVADO + 1.2 }] },
        { p: grande(FE), x: 810, mira: -1, acciones: [{ hace: 'vista', a: 'frente', en: MAFIA }, { hace: 'puno', en: PUBLICO + .1, hasta: PUBLICO + 1.4 }, { hace: 'asiente', en: PRIVADO + .1, hasta: PRIVADO + 1.2 }] },
        { p: DE, x: -120, mira: 1, acciones: [{ hace: 'camina', en: .2, hasta: 2.6, a: 215 }, { hace: 'niega', en: VIOLENCIA, hasta: VIOLENCIA + 1.6 }] }],
      camara: [[0, 560, 380, 1.05], [MAFIA - .1, 620, 380, 1.08], [MAFIA + .3, 640, 330, 1.25], [en.b36, 640, 360, 1.08], [CARTEL - .1, 640, 370, 1.04], [CARTEL + .2, 640, 390, 1.12], [CARTEL + .9, 640, 400, 1.15], [G.fin + 2.5, 640, 470, 1.45]] },
  ],
};
