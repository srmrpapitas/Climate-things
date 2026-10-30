// Españistán ep. 7 · secuencia 9, «Tres trampas» (bloques 36–40 y frases f1–f3). `cartoon`, 60 fps. Un solo plano, sin cortar.
// Cada político se forma con tinta en su atril, dice su frase y el Decano le estampa el nombre de la trampa; luego se deshace en tinta.
//   f1 Sanchís → b37 FALSO DILEMA: dos caminos y se abre un tercero · f2 Feijolo → b38 HOMBRE DE PAJA: el muñeco de paja se lo lleva el viento
//   f3 Acascar → b39 ATAQUE A LA PERSONA: el dato sigue en pie · b40 la urna; la pregunta del Decano se queda 3 s.
const G = T.guion([36, 'f1', 37, 'f2', 38, 'f3', 39, 40], { desde: .9 }), en = G.en, k = G.k, P = PERSONAJES;
const cartoon = { cartoon: true, jack: true, figura: '#2b2235', sombra: 8, contraluz: 0, bordes: ['rgb(150,210,255)', 'rgb(255,150,90)'], borde: .8 };
const dura = q => G.voces.find(v => v.quien === q).dura, T1 = en.f1 + dura('Sanchís'), T2 = en.f2 + dura('Feijolo'), T3 = en.f3 + dura('Acascar');
const FALSO = k(37, 'Falso'), SE_PUEDE = k(37, 'Se puede'), FEIJOLO = k(37, 'Feijolo'), PAJA = k(38, 'Hombre'), TUMBAR = k(38, 'tumbar'), NADIE = k(38, 'Nadie'),
  ACASCAR = k(38, 'Acascar'), ATAQUE = k(39, 'Ataque'), DATO = k(39, 'Un dato'), PREGUNTA = en.b40, VOTAS = k(40, 'votas');
const turno = (p, desde, frase, fin, gesto, sale) => ({ p, x: 640, vista: 'frente', forma: { aparece: desde - .2, desaparece: sale, materia: 'tinta', dura: 1.1 },
  acciones: [{ hace: 'habla', en: frase, hasta: fin }, { hace: gesto, en: frase + 1.2, hasta: frase + 3 }, { hace: 'encoge', en: fin + 1.4, hasta: fin + 3.4 }] });
const cielo = (desde, hasta, abajo) => ({ tipo: 'cieloNoche', arriba: '#0c0a18', abajo, n: 20, par: .2, desde, hasta });
const burbuja = (x, y, texto, en0, hasta, color, ancho = 260) => ({ tipo: 'burbuja', x, y, texto, en: en0, hasta, ancho, tam: 28, color });
window.ESCENA = {
  dura: G.fin + 1.4, fps: 60, suelo: 600, voces: G.voces,
  sonidos: [{ en: 0, hasta: G.fin, archivo: 'audio/sfx/dron.mp3', volumen: .14, bucle: true },
    ...[en.b36, FEIJOLO, ACASCAR].map(t => ({ en: t - .1, archivo: 'audio/sfx/whoosh.mp3', volumen: .3 })),
    ...[FALSO, PAJA, ATAQUE].map(t => ({ en: t + .2, archivo: 'audio/sfx/eleven/sello.mp3', volumen: .5 })), { en: TUMBAR, archivo: 'audio/sfx/viento.mp3', volumen: .3 }],
  planos: [
    { desde: 0, ...cartoon, viento: .3,
      decorado: [cielo(0, FEIJOLO, '#7a1f1f'), cielo(FEIJOLO, ACASCAR, '#1f3f7a'), cielo(ACASCAR, PREGUNTA, '#1f5a2f'), cielo(PREGUNTA, 1e9, '#3a2a5a'), { tipo: 'suelo', par: 1, matas: 0 }],
      delante: [
        { tipo: 'atril', x: 640, y: 600, hasta: PREGUNTA },
        { tipo: 'nombre', x: 640, y: 110, texto: 'Sanchís', en: en.f1 - .2, hasta: T1 }, { tipo: 'nombre', x: 640, y: 110, texto: 'Feijolo', en: en.f2 - .2, hasta: T2 },
        { tipo: 'nombre', x: 640, y: 110, texto: 'Acascar', en: en.f3 - .2, hasta: T3 },
        { tipo: 'sello', en: FALSO + .2, texto: 'FALSO DILEMA', x: 980, y: 250, escala: .5, hasta: FEIJOLO - .2 },
        burbuja(300, 180, 'la pública', FALSO + 1.2, FEIJOLO - .2), burbuja(300, 300, 'venderla', FALSO + 1.6, FEIJOLO - .2),
        burbuja(300, 420, 'defenderla Y mejorarla', SE_PUEDE, FEIJOLO - .2, '#2c5a2c', 340),
        { tipo: 'sello', en: PAJA + .2, texto: 'HOMBRE DE PAJA', x: 980, y: 250, escala: .5, hasta: ACASCAR - .2 },
        burbuja(300, 200, '«aprobado general»', PAJA + 1, NADIE - .1, '#7a1410', 300), burbuja(300, 330, 'cuándo repetir', NADIE + .4, ACASCAR - .2, '#2c5a2c', 280),
        { tipo: 'sello', en: ATAQUE + .2, texto: 'ATAQUE A\nLA PERSONA', x: 980, y: 250, escala: .5, hasta: PREGUNTA - .2 },
        burbuja(300, 260, 'EL DATO', DATO - .2, PREGUNTA - .2, '#2c5a2c', 220),
        { tipo: 'urna', x: 640, y: 600, desde: PREGUNTA + .2 }],
      particulas: [{ tipo: 'hojas', n: 40, en: TUMBAR - .3, hasta: NADIE + 1, zona: [300, 260, 1280, 560] }, { tipo: 'remolino', n: 30, x: 700, y: 520, r: 150, ciclo: 3, en: TUMBAR - .3, hasta: NADIE + 1 }],
      luces: [[640, 330]],
      actores: [turno(P.sanchis, en.f1, en.f1, T1, 'encoge', FEIJOLO - .3), turno(P.feijolo, en.f2, en.f2, T2, 'senala', ACASCAR - .3), turno(P.acascar, en.f3, en.f3, T3, 'puno', PREGUNTA - .3),
        { p: P.decano, x: 160, mira: 1, desde: PREGUNTA - .2, forma: { aparece: PREGUNTA - .2, dura: 1.2 }, acciones: [{ hace: 'senala', en: PREGUNTA + 1.2, hasta: VOTAS - .4 }, { hace: 'miraCamara', en: VOTAS - .2, hasta: G.fin + 1.4 }] }],
      camara: [[0, 640, 360, 1.15], [FALSO, 700, 340, 1.05], [en.f2, 640, 350, 1.2], [PAJA, 700, 340, 1.05], [en.f3, 640, 360, 1.2], [ATAQUE, 700, 340, 1.05],
        [PREGUNTA, 520, 380, 1.05], [VOTAS, 300, 400, 1.35], [G.fin + 1.4, 280, 400, 1.42]] },
  ],
};
