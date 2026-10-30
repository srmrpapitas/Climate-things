// Españistán · intro de la temporada 2 para el ep. 7 (copia de intro2.js; solo cambia EPISODIO).
// Misma voz de Gabo: «En un país partido en dos, un hombre busca la verdad con una espada. Esto es Españistán.» (audio/voz/es/espanistan-intro/intro.mp3)
//   0–2,3    «un país partido en dos»: el mapa se raja con un rayo; Sanchís y Feijolo, uno en cada mitad, se asustan y se dan la espalda.
//   2,3–4    (viento) «un hombre busca la verdad»: el Elegido cruza corriendo bajo la luna, con líneas de velocidad.
//   4–5,3    «con una espada»: salta y alza la espada contra la luna.
//   5,3–9,5  (tajo) «Esto es Españistán»: todo el reparto salta a escena uno tras otro, y el título.
const EPISODIO = 'Episodio 7 · La fábrica de respuestas';
const P = PERSONAJES, E = P.elegido;
const cartoon = { cartoon: true, jack: true, figura: '#2b2235', sombra: 8, contraluz: 0, bordes: ['rgb(150,210,255)', 'rgb(255,150,90)'], borde: .8 };
const noche = (luna) => [{ tipo: 'cieloNoche', luna, par: .2 }, { tipo: 'montes', tono: .2, par: .45, y: 540 }, { tipo: 'ciudad', tono: .3, par: .6, y: 580, s: 4 }, { tipo: 'suelo', par: 1, matas: 4 }];
const RAYO = .9;
const heroe = { p: E, x: -160, mira: 1, acciones: [{ hace: 'camina', en: 2.3, hasta: 3.7, a: 560 }, { hace: 'brinca', en: 4.05, hasta: 4.8, alto: 150, dx: 60 }, { hace: 'puno', en: 4.5, hasta: 5.5 }] };
const reparto = ['decano', 'sanchis', 'feijolo', 'acascar', 'elegido', 'lucia', 'dani', 'rajoyo', 'zapatitos'];
window.ESCENA = {
  dura: 9.5, fps: 30, suelo: 600,
  voces: [{ en: .4, dura: 7.04, quien: 'narrador', texto: '', sinSub: true, archivo: 'audio/voz/es/espanistan-intro/intro.mp3' }],
  sonidos: [{ en: RAYO, archivo: 'audio/sfx/trueno.mp3', volumen: .20 }, { en: RAYO + .1, archivo: 'audio/sfx/derrumbe.mp3', volumen: .12 },
    { en: 2.2, archivo: 'audio/sfx/whoosh.mp3', volumen: .4 }, { en: 3.9, archivo: 'audio/sfx/riser.mp3', volumen: .3 },
    { en: 5.1, archivo: 'audio/sfx/whoosh.mp3', volumen: .7 }, { en: 5.35, archivo: 'audio/sfx/impacto.mp3', volumen: .24 },
    ...reparto.map((_, i) => ({ en: 5.6 + i * .18, archivo: 'audio/sfx/whoosh.mp3', volumen: .15 })), { en: 7.4, archivo: 'audio/sfx/campana.mp3', volumen: .3 }],
  titulos: [{ en: 7.2, hasta: 9.5, texto: 'ESPAÑISTÁN', sub: EPISODIO, y: 92 }],
  planos: [
    // «un país partido en dos»
    { desde: 0, ...cartoon, viento: .3, franjas: true, camara: [[0, 640, 330, .95], [RAYO, 640, 330, .95], [RAYO + .05, 640, 335, 1.02], [2.3, 640, 330, 1.08]],
      decorado: [{ tipo: 'cieloNoche', par: .3, n: 50 }, { tipo: 'relampago', en: [RAYO], x: 640, y: 520, par: .5 },
        { tipo: 'mapaPartido', en: RAYO, x: 640, y: 330, ancho: 640, abre: 70, par: 1 }],
      actores: [
        { p: { ...P.sanchis, escala: .62 }, x: 470, y: -150, mira: 1, acciones: [{ hace: 'saluda', en: .2, hasta: .8 }, { hace: 'sorprende', en: RAYO + .1, hasta: RAYO + .8 }, { hace: 'gira', en: 1.6 }, { hace: 'encoge', en: 1.8, hasta: 2.4 }] },
        { p: { ...P.feijolo, escala: .62 }, x: 810, y: -150, mira: -1, acciones: [{ hace: 'saluda', en: .3, hasta: .8 }, { hace: 'sorprende', en: RAYO + .1, hasta: RAYO + .8 }, { hace: 'gira', en: 1.7 }, { hace: 'encoge', en: 1.9, hasta: 2.4 }] }] },
    // «un hombre busca la verdad»
    { desde: 2.3, transicion: 'viento', ...cartoon, viento: .45, franjas: true, decorado: noche([980, 170, 90]), actores: [heroe], camara: [[0, 420, 340, .95], [3.7, 600, 340, 1]] },
    // «con una espada»
    { desde: 3.95, ...cartoon, viento: 1, decorado: noche([760, 180, 150]), actores: [heroe], camara: [[0, 600, 330, 1.5], [5.3, 640, 250, 1.9]] },
    // «Esto es Españistán»: el reparto entra saltando, uno tras otro
    { desde: 5.3, transicion: 'tajo', ...cartoon, viento: .6, franjas: true, camara: [[0, 640, 330, .7], [9.5, 640, 325, .74]],
      decorado: [{ tipo: 'cieloNoche', luna: [640, 230, 200], par: .3 }, { tipo: 'mapa05', x: 640, y: 230, ancho: 300, relleno: '#e8cf96', par: .3 }, { tipo: 'ciudad', tono: .3, par: .6, y: 600, s: 3 }, { tipo: 'suelo', par: 1, matas: 0 }],
      actores: reparto.map((n, i) => { const en = 5.5 + i * .18, x = 640 + (i - 4) * 135;
        return { p: { ...P[n], escala: n === 'elegido' ? .95 : .9 }, x, desde: en - .3, vista: 'frente', z: 1,
          acciones: [{ hace: 'salta', en }, n === 'elegido' ? { hace: 'puno', en: en + .4, hasta: 10 } : { hace: i % 2 ? 'celebra' : 'saluda', en: en + .5, hasta: en + 1.6 }] }; }) },
  ],
};
