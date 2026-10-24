// La ola que se duplica: en cada paso la misma ola crece al doble de alto y entra más tierra adentro.
// Energía: potencial de una ola de 10 km de costa y 1 km de fondo, ½ · ρ · g · h² · área (al doblar la altura, ×4).
// alcance: hasta dónde llega el frente (m, el mar está en z negativo y la ciudad en z positivo).
// camara: plano continuo; la cámara va de un punto al siguiente sin atravesar edificios altos. Cifras aproximadas.
window.ESCENARIOS = window.ESCENARIOS || {};
(() => {
  const C = (pos, mira) => ({ pos, mira });
  const P = (valor, alcance, sub, texto, camara, extra) => ({ valor, alcance, sub, texto, camara, ...extra });
  window.ESCENARIOS.ola = {
    id: 'ola',
    tipo: 'ola',
    titulo: T('La ola que se duplica', 'The doubling wave'),
    pregunta: T('¿Y si cada ola fuera el doble de alta que la anterior?', 'What if every wave was twice as tall as the last?'),
    unidad: 'm',
    energia: { costa_m: 10000, fondo_m: 1000 },
    ritmo: 2.8, introDur: 3,
    paso: T('OLA', 'WAVE'),
    lema: T('EL DOBLE DE ALTA CADA VEZ', 'TWICE AS TALL EVERY TIME'),
    intro: { pos: [-650, 120, -560], mira: [0, 60, 800] }, // el protagonista espera en el paseo (x .8, z 104)
    sonido: { camas: { ciudad: .5, dron: .2 }, paso: 'whoosh', pasoGan: .3 },
    fases: [
      P(.5, 18, T('UNA OLA DE PLAYA', 'A BEACH WAVE'), T('Medio metro. Un día perfecto de playa.', 'Half a metre. A perfect day at the beach.'), { pos: [2.1, 4.9, 110], mira: [.2, 4.1, 99], dur: 2.4 }),
      P(1, 30, T('UN BUEN DÍA DE SURF', 'A GOOD DAY FOR SURFING'), T('El doble de alta lleva cuatro veces más energía. Los surfistas, encantados.', 'Twice as tall carries four times the energy. The surfers are thrilled.'), { pos: [2.8, 5.4, 112], mira: [-.2, 3.9, 96], dur: 1.5 }),
      P(2, 55, T('UNA OLA DE TEMPORAL', 'A STORM WAVE'), T('Dos metros. Bandera roja: todo el mundo fuera del agua.', 'Two metres. Red flag: everyone out of the water.'), { pos: [-1.8, 5.2, 128], mira: [.6, 3.6, 100], dur: 1.6 }, { sfx: [['panico', .3, .6]] }),
      P(4, 120, T('UN AUTOBÚS DE DOS PISOS', 'A DOUBLE-DECKER BUS'), T('Treinta centímetros de agua en marcha ya arrastran un coche. Esta tiene cuatro metros.', 'A foot of moving water can sweep a car away. This one is four metres.'), C([0, 17, 205], [0, 2, -20]), { sfx: [['ola', .45, .1]] }),
      P(8, 260, T('UNA CASA DE TRES PLANTAS', 'A THREE-STOREY HOUSE'), T('Ocho toneladas contra cada metro cuadrado de pared. Los coches bajan flotando por la calle.', 'Eight tonnes on every square metre of wall. Cars go floating down the street.'), C([-2, 24, 370], [0, 4, 70]), { sfx: [['alarmas', .35, .4]] , inserto: { pos: [12, 12, 330], mira: [0, 2, 245], t: 1.6, dur: 2.2 } }),
      P(16, 520, T('UN EDIFICIO DE CINCO PLANTAS', 'A FIVE-STOREY BUILDING'), T('Como el tsunami de Sumatra en 2004. Revientan todos los escaparates del paseo.', 'Like the 2004 Sumatra tsunami. Every shop window on the seafront bursts.'), C([0, 30, 720], [0, 8, 250]), { sfx: [['cristales', .55, .3], ['ola', .5, 0]] , inserto: { pos: [-14, 10, 600], mira: [-4, 8, 520], t: 1.4, dur: 2, efecto: 'cristales' } }),
      P(32, 1000, T('CASI EL TSUNAMI DE JAPÓN DE 2011', 'ALMOST JAPAN\'S 2011 TSUNAMI'), T('En Japón el agua subió hasta cuarenta metros de altura. Las casas bajas desaparecen.', 'In Japan the water climbed forty metres high. Low houses vanish.'), C([0, 60, 1010], [0, 15, 400]), { sfx: [['derrumbe', .5, .4]] }),
      P(64, 1700, T('MÁS ALTA QUE LA TORRE DE PISA', 'TALLER THAN THE LEANING TOWER OF PISA'), T('Avanza a noventa kilómetros por hora. Por fin se cae la Torre de Pisa.', 'It moves at ninety kilometres an hour. Pisa finally falls over.'), C([0, 260, 1500], [0, 20, 700]), { sfx: [['derrumbe', .6, .3]] , inserto: { pos: [-300, 110, 380], mira: [-420, 30, 260], t: 1, dur: 2.6 } }),
      P(128, 2700, T('MÁS ALTA QUE EL BIG BEN', 'TALLER THAN BIG BEN'), T('Ciento treinta kilómetros por hora. El Big Ben, bajo el agua. Sigue en hora.', 'A hundred and thirty kilometres an hour. Big Ben is underwater. Still on time.'), C([-300, 600, 2600], [0, 40, 900]), { sfx: [['derrumbe', .6, .3], ['ola', .55, 0]], camas: { ciudad: .15 } , inserto: { pos: [420, 170, 780], mira: [540, 60, 620], t: 1, dur: 2.6 } }),
      P(256, 4500, T('MÁS ALTA QUE CASI TODOS LOS RASCACIELOS', 'TALLER THAN MOST SKYSCRAPERS'), T('Ya cubre casi todos los rascacielos. En el fondo hay veinticinco atmósferas de presión.', 'It covers almost every skyscraper. At the bottom the pressure is twenty-five atmospheres.'), C([-900, 1200, 4200], [0, 60, 1200]), { sfx: [['derrumbe', .65, .3]], camas: { ciudad: 0, dron: .3 } }),
      P(512, 7500, T('MÁS ALTA QUE LA TORRE EIFFEL', 'TALLER THAN THE EIFFEL TOWER'), T('Como la ola más alta jamás vista, en Alaska en 1958. Solo queda en pie el edificio más alto.', 'Like the tallest wave ever seen, in Alaska in 1958. Only the tallest building is still standing.'), C([-2000, 2500, 7000], [0, 100, 2000]), { sfx: [['derrumbe', .6, .4]] }),
      P(1024, 12000, T('MÁS ALTA QUE EL BURJ KHALIFA', 'TALLER THAN THE BURJ KHALIFA'), T('Un kilómetro de agua. Cae el edificio más alto del mundo.', 'A kilometre of water. Down goes the tallest building on Earth.'), C([-4000, 5000, 12000], [0, 200, 4000]), { sfx: [['ola', .6, 0]] , inserto: { pos: [-520, 330, 960], mira: [-120, 330, 1280], t: .2, dur: 2.8 } }),
      P(2048, 20000, T('A LA ALTURA DE LAS NUBES', 'AS HIGH AS THE CLOUDS'), T('La energía de la Bomba del Zar en cada diez kilómetros de costa. Se traga colinas y valles enteros.', 'The energy of the Tsar Bomba on every ten kilometres of coast. It swallows whole hills and valleys.'), C([-7000, 10000, 22000], [0, 0, 8000])),
      P(4096, 32000, T('MÁS QUE LA PROFUNDIDAD MEDIA DEL OCÉANO', 'DEEPER THAN THE AVERAGE OCEAN'), T('Más alta de lo que mide de hondo el océano. Ahora el mar está encima de la tierra.', 'Taller than the ocean is deep. Now the sea is on top of the land.'), C([-6000, 22000, 36000], [0, 0, 14000]), { camas: { dron: .35 } }),
      P(8192, 50000, T('CASI EL EVEREST', 'ALMOST EVEREST'), T('Ocho kilómetros de agua. Solo quedan las cumbres más altas.', 'Eight kilometres of water. Only the highest peaks are left.'), C([-2000, 50000, 62000], [0, 0, 26000]), { sfx: [['riser', .5, .4]] }),
      P(16384, 80000, T('MÁS ALTA DE LO QUE VUELAN LOS AVIONES', 'HIGHER THAN PLANES FLY'), T('Dieciséis kilómetros. Se traga el Everest. En la Tierra no hay tanta agua.', 'Sixteen kilometres. It drowns Everest. There isn\'t that much water on Earth.'), C([0, 130000, 100000], [0, 0, 42000]),
        { final: true, dur: 5, sfx: [['ola', .7, 0], ['impacto', .6, .8]], camas: { dron: .4 } }),
    ],
    // Etiquetas para entender la escala (fases = número de paso, desde 1)
    marcas: [
      { texto: T('Torre de Pisa · 56 m', 'Leaning Tower of Pisa · 56 m'), pos: [-420, 66, 260], fases: [7, 8] },
      { texto: T('Big Ben · 96 m', 'Big Ben · 96 m'), pos: [540, 108, 620], fases: [8, 9] },
      { texto: T('Noria · 135 m', 'Ferris wheel · 135 m'), pos: [520, 148, 92], fases: [9] },
      { texto: T('Torre Eiffel · 330 m', 'Eiffel Tower · 330 m'), pos: [-120, 345, 1280], fases: [10, 11] },
      { texto: T('Empire State · 443 m', 'Empire State · 443 m'), pos: [660, 458, 1340], fases: [10, 11] },
      { texto: T('Burj Khalifa · 828 m', 'Burj Khalifa · 828 m'), pos: [360, 845, 1640], fases: [11, 12] },
      { texto: T('Montaña · 8.849 m', 'Mountain · 8,849 m'), pos: [7000, 9300, 56000], fases: [14, 15, 16] },
    ],
    cierre: { titulo: T('No queda nada.', 'Nothing is left.'), pregunta: T('¿Qué duplicamos ahora? 👇', 'What should we double next? 👇') },
  };
})();
