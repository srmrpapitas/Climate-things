// Españistán ep. 6 · secuencia 9, «Las frases» (bloques 37–39 y frases f1–f3). `cartoon`. Un solo plano, sin cortar:
// cada uno se forma con tinta en el centro, de frente y con su foco, dice su frase y se deshace en tinta para que se forme el siguiente.
//   b37 + f1  Sanchís (fondo rojo) · b38 + f2 Feijolo (azul) · b39 + f3 Acascar (verde)
const G = T.guion([37, 'f1', 38, 'f2', 39, 'f3'], { desde: 1 }), en = G.en, P = PERSONAJES;
const cartoon = { cartoon: true, jack: true, figura: '#2b2235', sombra: 8, contraluz: 0, bordes: ['rgb(150,210,255)', 'rgb(255,150,90)'], borde: .8 };
const T1 = en.f1 + G.voces.find(v => v.quien === 'Sanchís').dura, T2 = en.f2 + G.voces.find(v => v.quien === 'Feijolo').dura, T3 = en.f3 + G.voces.find(v => v.quien === 'Acascar').dura;
const turno = (p, nombre, desde, frase, fin, gesto, sale) => [{ p, x: 640, vista: 'frente', forma: { aparece: desde - .2, desaparece: sale, materia: 'tinta', dura: 1 },
  acciones: [{ hace: 'habla', en: frase, hasta: fin }, { hace: gesto, en: frase + 1.2, hasta: frase + 3 }, { hace: 'encoge', en: fin - 1.6, hasta: fin }] }];
const cielo = (desde, hasta, abajo) => ({ tipo: 'cieloNoche', arriba: '#0c0a18', abajo, n: 20, par: .2, desde, hasta });
window.ESCENA = {
  dura: G.fin + .6, fps: 30, suelo: 600, voces: G.voces,
  sonidos: [{ en: 0, hasta: G.fin, archivo: 'audio/sfx/dron.mp3', volumen: .15, bucle: true },
    ...[en.b37, en.b38, en.b39].map(t => ({ en: t - .1, archivo: 'audio/sfx/whoosh.mp3', volumen: .35 }))],
  planos: [
    { desde: 0, ...cartoon, decorado: [cielo(0, en.b38, '#7a1f1f'), cielo(en.b38, en.b39, '#1f3f7a'), cielo(en.b39, 1e9, '#1f5a2f'), { tipo: 'suelo', par: 1, matas: 0 }],
      delante: [{ tipo: 'nombre', x: 640, y: 110, texto: 'Sanchís', en: en.b37 + .6, hasta: T1 - .3 }, { tipo: 'nombre', x: 640, y: 110, texto: 'Feijolo', en: en.b38 + .6, hasta: T2 - .3 },
        { tipo: 'nombre', x: 640, y: 110, texto: 'Acascar', en: en.b39 + .6, hasta: T3 - .3 }],
      luces: [[640, 330]],
      actores: [...turno(P.sanchis, 'Sanchís', en.b37, en.f1, T1, 'encoge', T1 + .1), ...turno(P.feijolo, 'Feijolo', en.b38, en.f2, T2, 'senala', T2 + .1), ...turno(P.acascar, 'Acascar', en.b39, en.f3, T3, 'puno', 1e9)],
      camara: [[0, 640, 360, 1.2], [en.b38, 640, 350, 1.25], [en.b39, 640, 360, 1.2], [G.fin, 640, 350, 1.3]] },
  ],
};
