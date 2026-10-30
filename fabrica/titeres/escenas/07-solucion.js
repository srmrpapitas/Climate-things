// Españistán ep. 7 · secuencia 11, «La solución» (bloques 43–48). `cartoon`, 60 fps, amanecer. Cuatro casillas, como en el ep. 6.
//   b43  Montaigne: la cabeza bien llena (rebosa papeles) y la bien hecha (engranajes); «Cuatro cosas» → letreros.
//   b44  1 · la mesa ovalada pequeña, en la pública; «casi nada» → burbuja.
//   b45  2 · un niño de primaria con una pregunta gigante; el matiz de la Filosofía para Niños en una nota.
//   b46  3 · grupos de cuatro en vez de repetir; el tutor con IA es un candil que pregunta y no responde.
//   b47  4 · el profesor en prácticas como un médico; la ley con el sello PACTADA.
//   b48  las filas de pupitres se doblan en un círculo (4 s, sin cortar).
const G = T.guion([43, 44, 45, 46, 47, 48]), en = G.en, k = G.k, P = PERSONAJES;
const cartoon = { cartoon: true, jack: true, figura: '#2b2235', sombra: 8, contraluz: 0, bordes: ['rgb(150,210,255)', 'rgb(255,150,90)'], borde: .8 };
const montaigne = { ropa: 'traje', pelo: 'calvo', barba: 'bigote', nariz: 1.15, narizForma: 'aguilena', menton: 'marcado', arrugas: .6, alto: 1, grueso: .95, semilla: 167 };
const nina = ciudadano(1013, { ropa: 'vestido', escala: .6 });
const MONTAIGNE = k(43, 'Montaigne'), HECHA = k(43, 'bien hecha'), LLENA = k(43, 'bien llena'), CUATRO = k(43, 'Cuatro'), UNO = en.b44, EXETER = k(44, 'Exeter'), NADA = k(44, 'casi nada'),
  DOS = en.b45, MATIZ = k(45, 'Matiz'), RAZONAR = k(45, 'razonar'), TRES = en.b46, GRUPOS = k(46, 'grupos'), IA = k(46, 'inteligencia'), ALEJANDRO = k(46, 'Alejandro'), PREGUNTAR = k(46, 'preguntar'),
  CUATRO2 = en.b47, MEDICOS = k(47, 'médicos'), PACTADA = k(47, 'pactada'), NADA2 = en.b48, PAISES = k(48, 'países');
const amanecer = [{ tipo: 'cieloNoche', arriba: '#3a5a9a', abajo: '#f8c890', n: 0, par: .2 }, { tipo: 'colinas', par: .5, tono: .25 }, { tipo: 'suelo', par: 1, matas: 4 }];
const casilla = (n, texto, enciende, apaga) => ({ tipo: 'letrero', enciende, apaga, texto: `${n} · ${texto}`, x: 640, y: 80, ancho: 820, tam: 30 });
window.ESCENA = {
  dura: G.fin, fps: 60, suelo: 600, voces: G.voces,
  sonidos: [{ en: 0, hasta: G.fin, archivo: 'audio/sfx/viento.mp3', volumen: .12, bucle: true }, ...[UNO, DOS, TRES, CUATRO2].map(t => ({ en: t, archivo: 'audio/sfx/eleven/aparece.mp3', volumen: .3 })),
    { en: PACTADA + .2, archivo: 'audio/sfx/eleven/sello.mp3', volumen: .45 }, { en: NADA2, hasta: PAISES + 1, archivo: 'audio/sfx/riser.mp3', volumen: .2 }],
  carteles: [{ en: MATIZ - .2, hasta: TRES - .3, x: 700, y: 140, ancho: 520, titulo: 'Filosofía para Niños · Inglaterra (EEF)', fuente: 'Education Endowment Foundation',
    filas: [['1.ª prueba (48 colegios)', '+2 meses'], ['Prueba grande (198 colegios)', 'sin mejora', '#7a1410']], tiempos: [MATIZ + .2, MATIZ + 1.4] }],
  planos: [
    { desde: 0, ...cartoon, viento: .25, decorado: amanecer,
      delante: [{ tipo: 'cabezas', y: 380, desde: HECHA - 1.2, hasta: CUATRO - .3 }, { tipo: 'nombre', x: 640, y: 120, texto: 'Montaigne · Ensayos, 1580', en: MONTAIGNE, hasta: HECHA - .4 }],
      actores: [{ p: montaigne, x: 640, mira: 1, vista: 'frente', hasta: HECHA - 1.2, forma: { aparece: .4, dura: 1.2 }, acciones: [{ hace: 'senala', en: MONTAIGNE + .4, hasta: HECHA - 1.3 }] }],
      camara: [[0, 640, 360, 1.15], [HECHA, 520, 360, 1.05], [LLENA, 760, 360, 1.05], [CUATRO, 640, 330, 1]] },
    { desde: UNO - .3, ...cartoon, decorado: amanecer,
      delante: [casilla(1, 'LEER, ESCRIBIR Y DISCUTIR', UNO + .1, DOS), { tipo: 'mesaOvalada', n: 8, y: 400, flechas: EXETER - .6 }, { tipo: 'burbuja', x: 1080, y: 260, texto: '≈ 0 €', en: NADA, hasta: DOS - .2, ancho: 160, tam: 34, color: '#2c5a2c' }],
      camara: [[UNO, 640, 360, 1.05], [NADA, 760, 340, 1.1]] },
    { desde: DOS - .3, ...cartoon, decorado: amanecer,
      delante: [casilla(2, 'LÓGICA Y FILOSOFÍA DESDE PRIMARIA', DOS + .1, TRES), { tipo: 'burbuja', x: 400, y: 260, texto: '?', en: DOS + .8, hasta: TRES - .2, ancho: 160, alto: 160, tam: 110, color: '#7a1410' }],
      actores: [{ p: nina, x: 400, mira: 1, acciones: [{ hace: 'piensa', en: DOS + .6, hasta: MATIZ }, { hace: 'senala', en: RAZONAR - .4, hasta: TRES }] }],
      camara: [[DOS, 500, 380, 1.12], [MATIZ, 640, 360, 1]] },
    { desde: TRES - .3, ...cartoon, decorado: amanecer,
      delante: [casilla(3, 'DOMINAR ANTES DE AVANZAR', TRES + .1, CUATRO2), { tipo: 'figuras', n: 4, cols: 4, x: 360, y: 590, alto: 90, paso: 70, aparece: GRUPOS - .3 },
        { tipo: 'burbuja', x: 900, y: 230, texto: '¿por qué crees eso?', en: PREGUNTAR - .4, hasta: CUATRO2 - .2, ancho: 330, tam: 28 },
        { tipo: 'nombre', x: 900, y: 330, texto: 'tutor con IA', en: IA, hasta: PREGUNTAR - .5 }],
      actores: [{ p: { ...P.dani, objetoLejos: 'candil' }, x: 900, mira: -1, desde: IA - .5, forma: { aparece: IA - .5, dura: 1.2 }, acciones: [{ hace: 'piensa', en: PREGUNTAR, hasta: CUATRO2 }] }],
      camara: [[TRES, 420, 400, 1.12], [IA, 780, 380, 1.1], [PREGUNTAR, 880, 360, 1.25]] },
    { desde: CUATRO2 - .3, ...cartoon, decorado: amanecer,
      delante: [casilla(4, 'PROFESORES FORMADOS COMO MÉDICOS', CUATRO2 + .1, NADA2 - .2),
        { tipo: 'pergamino', en: PACTADA - 1.2, x: 860, y: 330, ancho: 380, alto: 300, titulo: 'Ley de Educación', sello: PACTADA + .1 },
        { tipo: 'sello', en: PACTADA + .4, texto: 'PACTADA', x: 860, y: 470, escala: .45, color: '#2c5a2c' }],
      actores: [{ p: { ...ciudadano(1031), objeto: 'papel' }, x: 360, mira: 1, acciones: [{ hace: 'asiente', en: MEDICOS, hasta: MEDICOS + 1.4 }] }],
      camara: [[CUATRO2, 520, 380, 1.05], [PACTADA, 800, 360, 1.12]] },
    { desde: NADA2 - .3, ...cartoon, decorado: amanecer,
      delante: [{ tipo: 'pupitres', epoca: 'hoy', filas: 3, cols: 4, ninos: true, y: 640, circulo: [[NADA2 + .4, 0], [NADA2 + 4.4, 1]] }],
      camara: [[NADA2, 640, 380, 1.05], [G.fin, 640, 400, .98]] },
  ],
};
