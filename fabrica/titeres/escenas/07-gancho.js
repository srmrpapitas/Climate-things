// Españistán ep. 7 · secuencia 1, «Gancho» (bloques 1–3). Temporada 2, `cartoon`, 60 fps. Plan: CAPITULO-07-PLANOS.md. 60 % sin cortes.
//   b1   aula de hoy, de noche: la tiza escribe el problema del bate y la pelota palabra a palabra; «¿Cuánto cuesta?» → la cámara se acerca.
//   b2   «diez céntimos» → 0,10 € y la tiza lo tacha en rojo; «Harvard, MIT, Princeton» → caen tres birretes; «comprobar» → reloj de arena.
//   b3   Lucía y Dani se forman con tinta en sus pupitres; «cómo se arregla» → el trapo tapa la respuesta y la cámara se acerca.  → INTRO
const G = T.guion([1, 2, 3]), en = G.en, k = G.k, P = PERSONAJES;
const cartoon = { cartoon: true, jack: true, figura: '#2b2235', sombra: 8, contraluz: 0, bordes: ['rgb(150,210,255)', 'rgb(255,150,90)'], borde: .8 };
const BATE = k(1, 'bate'), MAS = k(1, 'un euro más'), CUANTO = k(1, '¿Cuánto'), DIEZ = k(2, 'diez'), HARVARD = k(2, 'Harvard'), PARAR = k(2, 'parar'),
  COMPROBAR = k(2, 'comprobar'), ESCUELA = en.b3, APROBAR = k(3, 'aprobar'), PENSAR = k(3, 'pensar'), ARREGLA = k(3, 'arregla');
window.ESCENA = {
  dura: G.fin, fps: 60, suelo: 600, voces: G.voces,
  silencios: [[CUANTO + 1.2, DIEZ - .3]],
  sonidos: [
    { en: 0, hasta: G.fin, archivo: 'audio/sfx/dron.mp3', volumen: .12, bucle: true },
    { en: BATE - .2, archivo: 'audio/sfx/eleven/tic.mp3', volumen: .3 }, { en: CUANTO + 1.1, archivo: 'audio/sfx/eleven/tic.mp3', volumen: .3 },
    { en: DIEZ + 1.2, archivo: 'audio/sfx/impacto.mp3', volumen: .3 }, { en: HARVARD, archivo: 'audio/sfx/eleven/pop.mp3', volumen: .35 },
    { en: ESCUELA - .2, archivo: 'audio/sfx/whoosh.mp3', volumen: .3 }, { en: ARREGLA, archivo: 'audio/sfx/campana.mp3', volumen: .3 }],
  planos: [
    { desde: 0, ...cartoon, viento: .1, decorado: [{ tipo: 'aulaHoy', par: .4 }],
      delante: [
        { tipo: 'tiza', x: 640, y: 250, ancho: 860, alto: 330, tam: 38, paso: 62, tapado: [ARREGLA, 1e9], tacha: DIEZ + 1.2, tachaLinea: 3,
          lineas: [[BATE - .1, 'bate + pelota = 1,10 €'], [MAS - .4, 'bate = pelota + 1 €'], [CUANTO, 'pelota = ¿?', '#ffd060'], [DIEZ + .1, '0,10 €', '#ffd060']] },
        { tipo: 'birretes', en: HARVARD - .1, y: 470, x: 640 },
        { tipo: 'relojArena', en: PARAR, dura: 2.4, x: 1130, y: 520, escala: .7, hasta: ESCUELA },
        { tipo: 'pupitres', epoca: 'hoy', filas: 2, cols: 6, y: 700, escala: 1.05, ninos: true, vacio: [8, 9] },
        { tipo: 'nombre', x: 520, y: 470, texto: 'Lucía', en: APROBAR, hasta: PENSAR }, { tipo: 'nombre', x: 760, y: 470, texto: 'Dani', en: APROBAR + .3, hasta: PENSAR }],
      actores: [
        { p: { ...P.lucia, escala: .8 }, x: 567, y: 70, mira: 1, forma: { aparece: ESCUELA - .1, dura: 1.3, materia: 'tinta' }, acciones: [{ hace: 'piensa', en: PENSAR, hasta: G.fin }] },
        { p: { ...P.dani, escala: .8 }, x: 712, y: 70, mira: -1, forma: { aparece: ESCUELA + .2, dura: 1.3, materia: 'tinta' }, acciones: [{ hace: 'encoge', en: APROBAR, hasta: APROBAR + 1.4 }] }],
      particulas: [{ tipo: 'polvo', n: 30 }],
      camara: [[0, 640, 300, 1.25], [CUANTO, 640, 300, 1.25], [CUANTO + 1.3, 640, 290, 1.45], [DIEZ, 640, 300, 1.3], [HARVARD + .2, 640, 360, 1],
        [COMPROBAR + .6, 900, 380, 1.15], [ESCUELA, 640, 420, 1.05], [ARREGLA, 640, 330, 1.2], [G.fin, 640, 300, 1.45]] },
  ],
};
