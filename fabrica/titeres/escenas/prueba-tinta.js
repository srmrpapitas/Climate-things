// Prueba de tinta y viento a 60 fps (ep. 7): el Decano cruza la ciudad de noche con ráfagas que cambian de fuerza, hojas que se dan
// la vuelta, un remolino que se abre y se cierra y tinta que gotea del cielo; todo se deshace en tinta (metamorfosis de 3 s) y vuelve a
// dibujar el campo con Sanchís y Feijolo. ≥ 3 s de calma tras cada cambio: luego una figura se forma con hojas y Feijolo se deshace. 15 s.
const P = PERSONAJES;
window.ESCENA = {
  dura: 15, fps: 60, suelo: 600,
  titulos: [],
  planos: [
    { desde: 0, cartoon: true, viento: .5,
      decorado: [{ tipo: 'astro', x: 1010, y: 150, r: 40, luna: true, par: .2 }, { tipo: 'ciudad', tono: .3, par: .6, y: 600, s: 4 },
        { tipo: 'farola', x: 500, par: 1 }, { tipo: 'farola', x: 1000, par: 1 }, { tipo: 'suelo', par: 1, matas: 3 }],
      particulas: [{ tipo: 'hojas', n: 26, zona: [-100, 250, 1380, 560] }, { tipo: 'goteo', n: 14, zona: [80, 0, 1200, 420] },
        { tipo: 'remolino', n: 30, x: 820, y: 575, r: 150, ciclo: 4.5 }],
      camara: [[0, 300, 420, 1.45], [4.6, 900, 420, 1.45]],
      actores: [{ p: P.decano, x: 160, mira: 1, acciones: [{ hace: 'camina', en: .3, hasta: 4.6, a: 1060 }] }] },
    { desde: 5, transicion: 'metamorfosis', cartoon: true, viento: .45,
      decorado: [{ tipo: 'astro', x: 1010, y: 170, r: 46, par: .3 }, { tipo: 'montes', par: .5 }, { tipo: 'arbol', x: 180, tono: .3, escala: 1.2, par: .8 }, { tipo: 'suelo', par: 1, matas: 5 }],
      particulas: [{ tipo: 'hojas', n: 22, zona: [-100, 200, 1380, 540] }, { tipo: 'remolino', n: 26, x: 640, y: 580, r: 130, ciclo: 5, en: 6 }],
      camara: [[0, 640, 400, 1.35], [6.6, 640, 400, 1.35], [9.6, 640, 370, 1.05]],
      actores: [
        { p: P.sanchis, x: 430, mira: 1, acciones: [{ hace: 'habla', en: 6.8, hasta: 8.6 }, { hace: 'senala', en: 10, hasta: 11.4 }] },
        { p: P.feijolo, x: 800, mira: -1, forma: { desaparece: 12.8, materia: 'tinta', dura: 1.4 }, acciones: [{ hace: 'encoge', en: 8.4, hasta: 9.6 }, { hace: 'sorprende', en: 11.6, hasta: 12.8 }] },
        { p: P.elegido, x: 1080, mira: -1, forma: { aparece: 9.6, dura: 1.6 }, acciones: [{ hace: 'senala', en: 12.4, hasta: 14.4 }] }] }],
};
