// El meteorito que se duplica: de una estrella fugaz (1 m) al que acabó con los dinosaurios (unos 10 km).
// Cifras aproximadas: compruébalas antes de publicar.
window.ESCENARIOS = window.ESCENARIOS || {};
(() => {
  const C = (pos, mira) => ({ pos, mira }), H = (pos, mira) => ({ pos, mira, cerca: true }), // H: sigue al protagonista (suelo a 3 m)
    P = (sub, texto, camara, extra) => ({ sub, texto, camara, ...extra });
  const ESP = [0, -6.371e6, 0], CIELO = [0, 150, 650]; // a dónde se mira: el cielo sobre el centro, donde cae
  // la cámara gira un poco alrededor del punto al que mira: con un punto lejano se movería decenas de metros y se metería
  // en los edificios, así que se mira a un punto a 40 m en la misma dirección
  const cerca = pos => { const d = CIELO.map((v, i) => v - pos[i]), l = Math.hypot(...d); return pos.map((v, i) => v + d[i] / l * 40); };
  const HC = pos => H(pos, cerca(pos));
  const CC = (pos, mira) => { const d = mira.map((v, i) => v - pos[i]), l = Math.hypot(...d); return C(pos, pos.map((v, i) => v + d[i] / l * 60)); }; // lo mismo con planos lejanos
  window.ESCENARIOS.meteorito = {
    id: 'meteorito',
    tipo: 'meteorito',
    titulo: T('El meteorito que se duplica', 'The doubling meteor'),
    pregunta: T('¿Y si cada meteorito fuera el doble de grande que el anterior?', 'What if every meteor was twice as big as the last?'),
    unidad: 'm',
    inicial: 1,
    multiplicador: 2,
    ritmo: 3.4, introDur: 2.8,
    paso: T('METEORITO', 'METEOR'),
    lema: T('EL DOBLE DE GRANDE CADA VEZ', 'TWICE AS BIG EVERY TIME'),
    intro: { pos: [.6, 6.2, 122], mira: [-1, 5.2, 130] },
    sonido: { camas: { dron: .3, ciudad: .5 }, paso: 'whoosh', pasoGan: .2 },
    fases: [
      P(T('UNA PIEDRA', 'A PEBBLE FROM SPACE'), T('Una estrella fugaz muy brillante. Pide un deseo.', 'A very bright shooting star. Make a wish.'), HC([1.2, 4.4, 123])),
      P(T('UNA LAVADORA', 'A WASHING MACHINE'), T('Explota en el aire. Se ve desde tres países.', 'It explodes in the sky. Seen from three countries.'), HC([1.5, 4.7, 122])),
      P(T('UN COCHE', 'A CAR'), T('El estruendo hace saltar las alarmas de los coches.', 'The boom sets off every car alarm.'), HC([2, 5.2, 121])),
      P(T('UN AUTOBÚS', 'A BUS'), T('Llegan trozos al suelo. Hay quien se lleva uno a casa.', 'Pieces hit the ground. Someone takes one home.'), HC([2.5, 6, 119])),
      P(T('COMO EL DE CHELIÁBINSK', 'LIKE CHELYABINSK'), T('La onda rompe los cristales de toda la ciudad.', 'The shockwave shatters every window in the city.'), CC([-24, 30, 60], [0, 60, 650])),
      P(T('COMO EL DE TUNGUSKA', 'LIKE TUNGUSKA'), T('Arrasó 2.000 km² de bosque en 1908. Aquí, el centro.', 'It flattened 2,000 km² of forest in 1908. Here, downtown.'), CC([-80, 160, 40], [0, 0, 650])),
      P(T('UN ESTADIO', 'A STADIUM'), T('Un cráter de un kilómetro. Adiós al barrio.', 'A crater one kilometre wide. Bye bye, neighbourhood.'), CC([-300, 220, -400], [0, 0, 700]), { camas: { ciudad: 0, fuego: .4 } }),
      P(T('UN RASCACIELOS', 'A SKYSCRAPER'), T('La ciudad entera, borrada del mapa.', 'The whole city, wiped off the map.'), CC([-900, 600, -900], [0, 0, 800])),
      P(T('UNA MONTAÑA PEQUEÑA', 'A SMALL MOUNTAIN'), T('Fuego en cien kilómetros a la redonda.', 'Fire for a hundred kilometres around.'), CC([-2400, 1500, -2000], [0, 0, 900])),
      P(T('MEDIO KILÓMETRO', 'HALF A KILOMETRE'), T('Un terremoto de magnitud 7 y un tsunami gigante.', 'A magnitude 7 earthquake and a giant tsunami.'), CC([-5000, 3000, -4000], [0, 0, 900]), { sfx: [['terremoto', .5, 1.6]] }),
      P(T('UN KILÓMETRO', 'ONE KILOMETRE'), T('El polvo tapa el Sol en todo un continente.', 'Dust blocks out the Sun over a whole continent.'), C([0, 9e6, 1.5e7], ESP), { planeta: true, camas: { fuego: 0, espacio: .3 } }),
      P(T('DOS KILÓMETROS', 'TWO KILOMETRES'), T('Llueve roca fundida sobre medio planeta.', 'Molten rock rains down on half the planet.'), C([0, 9e6, 1.5e7], ESP), { planeta: true }),
      P(T('CUATRO KILÓMETROS', 'FOUR KILOMETRES'), T('El cielo arde. Se queman los bosques del mundo.', 'The sky burns. The world\'s forests catch fire.'), C([0, 9e6, 1.5e7], ESP), { planeta: true }),
      P(T('COMO EL DE LOS DINOSAURIOS', 'LIKE THE DINOSAUR KILLER'), T('Hace 66 millones de años, uno así acabó con ellos.', '66 million years ago, one like this wiped them out.'), C([0, 9e6, 1.5e7], ESP), { planeta: true, dur: 4.8 }),
    ],
    cierre: { titulo: T('Que vuelvan los dinosaurios.', 'Bring back the dinosaurs.'), pregunta: T('¿Qué duplicamos ahora? 👇', 'What should we double next? 👇') },
  };
})();
