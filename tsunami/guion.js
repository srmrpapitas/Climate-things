// El guion con tiempos: sale de las duraciones de las voces (tsunami/voz/duraciones.json), no al revés.
// Cada frase del narrador empieza en `t` y dura lo que dura su pista; entre frases van los «bomboclat» y la acción.
export const DUR = 70;

// narrador: pista, inicio, duración (s) y subtítulo
export const NARRADOR = [
  { src: 'voz/n01.mp3', t: 0.4, d: 3.66, txt: 'Este chico duerme bajo diez metros de agua. Y no lo sabe.' },
  { src: 'voz/n02.mp3', t: 6.4, d: 4.15, txt: '¿Y si cada tsunami fuera el doble que el anterior? Rebobinemos.' },
  { src: 'voz/n03.mp3', t: 10.7, d: 4.49, txt: 'Primera señal: el mar se retira. Si lo ves, corre.' },
  { src: 'voz/n04.mp3', t: 18.6, d: 5.8, txt: 'Diez metros, como en Banda Aceh en 2004. Corre a casa: un tercer piso.' },
  { src: 'voz/n05.mp3', t: 25.0, d: 4.79, txt: 'Veinte metros. Encima de su ventana pasan diez de agua: dos atmósferas.' },
  { src: 'voz/n06.mp3', t: 30.2, d: 4.6, txt: 'Cada metro cuadrado de cristal aguanta diez toneladas. Por poco tiempo.' },
  { src: 'voz/n07.mp3', t: 37.0, d: 2.95, txt: 'Lección aprendida: planta 45.' },
  { src: 'voz/n08.mp3', t: 40.4, d: 4.54, txt: 'Cuarenta metros, como Japón en 2011. Setenta kilómetros por hora.' },
  { src: 'voz/n09.mp3', t: 48.4, d: 4.87, txt: 'Ochenta. El agua ya va por la planta 22. El edificio cruje.' },
  { src: 'voz/n10.mp3', t: 53.6, d: 4.14, txt: 'Ciento sesenta metros. Planta 45: la suya.' },
  { src: 'voz/n11.mp3', t: 61.0, d: 6.13, txt: 'La más alta de la historia midió 524 metros. Alaska, 1958.' },
];

// «bomboclat» de Nico: toma (00 tranquilo … 09 gritando), inicio y texto de cómic
export const BOMBO = [
  { toma: 0, t: 4.75, txt: '¿BOMBOCLAT?' },
  { toma: 1, t: 15.35, txt: '¿BOMBOCLAT?' },
  { toma: 5, t: 16.95, txt: '¡BOMBOCLAT!' },
  { toma: 0, t: 35.0, txt: 'bomboclat…', bajito: true },
  { toma: 3, t: 45.15, txt: 'BOMBOCLAT' },
  { toma: 9, t: 57.9, txt: '¡¡BOMBOCLAAAT!!' },
];

// los planos: qué escena se ve en cada tramo
export const TRAMOS = [
  { escena: 'cuarto', t0: 0, t1: 6.3, parte: 'despertar' },
  { escena: 'rebobinado', t0: 6.3, t1: 8.3 },
  { escena: 'playa', t0: 8.3, t1: 24.6 },
  { escena: 'cuarto', t0: 24.6, t1: 36.6, parte: 'ventana' },
  { escena: 'ciudad', t0: 36.6, t1: 60.4 },
  { escena: 'final', t0: 60.4, t1: 70 },
];

// el HUD de cada ola: número, altura, línea amarilla y cuándo aparece
export const OLAS = [
  { n: 1, m: 10, linea: 'Banda Aceh · 2004', t: 17.2, t1: 24.4 },
  { n: 2, m: 20, linea: '10 m de agua sobre su ventana', t: 25.0, t1: 36.4 },
  { n: 3, m: 40, linea: '71 km/h · Japón 2011', t: 40.4, t1: 48.2 },
  { n: 4, m: 80, linea: 'el agua llega a la planta 22', t: 48.4, t1: 53.4 },
  { n: 5, m: 160, linea: '143 km/h · planta 45', t: 53.6, t1: 60.2 },
];

// sonidos de fondo y efectos (las rutas son relativas a tsunami/). gan: volumen; filtro: filtros de ffmpeg
export const EFECTOS = [
  // el cuarto bajo el agua (todo apagado con lowpass)
  { src: '../audio/sfx/dron.mp3', t: 0, gan: .45, filtro: 'lowpass=f=500,atrim=0:6.4,afade=t=out:st=5.6:d=.8' },
  { src: '../audio/sfx/ola.mp3', t: 0, gan: .3, filtro: 'lowpass=f=350,atrim=0:6.3,afade=t=out:st=5.5:d=.8' },
  { src: '../audio/sfx/impacto.mp3', t: 4.25, gan: .9, filtro: 'lowpass=f=900' },
  { src: '../audio/sfx/whoosh.mp3', t: 4.4, gan: .5 },
  // rebobinado: el whoosh al revés y más agudo, con una subida
  { src: '../audio/sfx/whoosh.mp3', t: 6.25, gan: .7, filtro: 'areverse,asetrate=60000,aresample=48000' },
  { src: '../audio/sfx/riser.mp3', t: 6.3, gan: .35, filtro: 'areverse,atrim=0:2,afade=t=out:st=1.6:d=.4' },
  { src: '../audio/sfx/whoosh.mp3', t: 7.8, gan: .6 },
  // playa: olas tranquilas, se retira el mar (subida), llega la ola con gritos
  { src: '../audio/sfx/ola.mp3', t: 8.1, gan: .55, filtro: 'afade=t=in:d=.4' },
  { src: '../audio/sfx/ola.mp3', t: 15.9, gan: .35, filtro: 'atrim=0:2' },
  { src: '../audio/sfx/riser.mp3', t: 12.6, gan: .4 },
  { src: '../audio/sfx/terremoto.mp3', t: 15.9, gan: .5, filtro: 'afade=t=in:d=1' },
  { src: '../audio/sfx/panico.mp3', t: 17.6, gan: .35, filtro: 'afade=t=out:st=4.5:d=1.5' },
  { src: '../audio/sfx/ola.mp3', t: 18.0, gan: .9 },
  { src: '../audio/sfx/derrumbe.mp3', t: 22.6, gan: .7, filtro: 'afade=t=out:st=1.4:d=.6' },
  { src: '../audio/sfx/impacto.mp3', t: 24.2, gan: .8 },
  // el cuarto otra vez (20 m): agua por encima, el cristal cruje
  { src: '../audio/sfx/dron.mp3', t: 24.6, gan: .45, filtro: 'lowpass=f=500,atrim=0:12,afade=t=out:st=11.4:d=.6' },
  { src: '../audio/sfx/ola.mp3', t: 24.6, gan: .35, filtro: 'lowpass=f=300' },
  { src: '../audio/sfx/ola.mp3', t: 32.6, gan: .3, filtro: 'lowpass=f=300,atrim=0:4' },
  { src: '../audio/sfx/cristales.mp3', t: 29.95, gan: .55, filtro: 'atrim=0:.9,afade=t=out:st=.5:d=.4' },
  { src: '../audio/sfx/cristales.mp3', t: 33.4, gan: .4, filtro: 'atrim=0:.7,afade=t=out:st=.4:d=.3' },
  { src: '../audio/sfx/whoosh.mp3', t: 36.3, gan: .55 },
  // la ciudad desde la planta 45 (detrás del cristal)
  { src: '../audio/sfx/ciudad.mp3', t: 36.6, gan: .35, filtro: 'lowpass=f=2500,atrim=0:5,afade=t=out:st=4:d=1' },
  { src: '../audio/sfx/riser.mp3', t: 38.4, gan: .35 },
  { src: '../audio/sfx/alarmas.mp3', t: 40.0, gan: .3, filtro: 'lowpass=f=3000' },
  { src: '../audio/sfx/ola.mp3', t: 40.2, gan: .8, filtro: 'lowpass=f=2500' },
  { src: '../audio/sfx/derrumbe.mp3', t: 41.4, gan: .7, filtro: 'lowpass=f=2500' },
  { src: '../audio/sfx/derrumbe.mp3', t: 44.2, gan: .6, filtro: 'lowpass=f=2500' },
  { src: '../audio/sfx/alarmas.mp3', t: 46.0, gan: .25, filtro: 'lowpass=f=3000' },
  { src: '../audio/sfx/terremoto.mp3', t: 48.2, gan: .8 },
  { src: '../audio/sfx/cristales.mp3', t: 50.6, gan: .6 },
  { src: '../audio/sfx/ola.mp3', t: 48.4, gan: .6, filtro: 'lowpass=f=1200' },
  { src: '../audio/sfx/riser.mp3', t: 53.8, gan: .55 },
  { src: '../audio/sfx/terremoto.mp3', t: 53.6, gan: .7 },
  { src: '../audio/sfx/ola.mp3', t: 56.4, gan: 1 },
  { src: '../audio/sfx/impacto.mp3', t: 60.15, gan: 1 },
  { src: '../audio/sfx/cristales.mp3', t: 60.1, gan: .8 },
  // final: silencio y un dron grave bajo el dato
  { src: '../audio/sfx/dron.mp3', t: 60.6, gan: .4, filtro: 'lowpass=f=300,atrim=0:9.4,afade=t=in:d=1.5,afade=t=out:st=8:d=1.4' },
  { src: '../audio/sfx/impacto.mp3', t: 64.0, gan: .5, filtro: 'lowpass=f=400' },
];

// todo lo que suena, en el formato de tsunami/grabar.mjs
export function sonidos() {
  return [...EFECTOS,
    ...NARRADOR.map(n => ({ src: n.src, t: n.t, gan: 1.25 })),
    ...BOMBO.map(b => ({ src: `../audio/sfx/bomboclat/${String(b.toma).padStart(2, '0')}.mp3`, t: b.t, gan: b.bajito ? .55 : 1.05 }))];
}
