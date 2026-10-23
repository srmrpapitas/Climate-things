// La gravedad que se duplica: de un día normal (1 g) a un agujero negro.
// Cifras aproximadas: compruébalas antes de publicar.
window.ESCENARIOS = window.ESCENARIOS || {};
(() => {
  const C = (pos, mira) => ({ pos, mira }), H = (pos, mira) => ({ pos, mira, cerca: true }), // H: sigue al protagonista (suelo a 3 m)
    P = (sub, texto, camara, extra) => ({ sub, texto, camara, ...extra });
  const ESP = [0, -6.371e6, 0];
  window.ESCENARIOS.gravedad = {
    id: 'gravedad',
    tipo: 'gravedad',
    titulo: T('La gravedad que se duplica', 'The doubling gravity'),
    pregunta: T('¿Y si la gravedad se duplicara cada día?', 'What if gravity doubled every day?'),
    unidad: 'g',
    inicial: 1,
    multiplicador: 2,
    ritmo: 3, introDur: 2.8,
    paso: T('DÍA', 'DAY'),
    lema: T('EL DOBLE DE GRAVEDAD CADA VEZ', 'TWICE THE GRAVITY EVERY TIME'),
    intro: { pos: [-10.6, 8.2, 127.5], mira: [-11.5, 7.4, 120] },
    sonido: { camas: { dron: .3, ciudad: .5 }, paso: 'whoosh', pasoGan: .35 },
    fases: [
      P(T('UN DÍA NORMAL', 'A NORMAL DAY'), T('Pesas lo de siempre. De momento.', 'You weigh what you always weigh. For now.'), H([-10.9, 4.9, 125.2], [-11.5, 4.25, 120])),
      P(T('LA MOCHILA MÁS PESADA', 'THE HEAVIEST BACKPACK'), T('Como llevar a otro tú a caballito todo el día.', 'Like giving yourself a piggyback all day.'), H([-9.8, 5.6, 127.5], [-11.5, 4.3, 120])),
      P(T('UN PILOTO DE CAZA', 'A FIGHTER PILOT'), T('Levantarse del sofá es un deporte olímpico.', 'Getting off the sofa is an Olympic sport.'), H([-8.6, 4.4, 124], [-11.5, 3.9, 120])),
      P(T('NADIE AGUANTA DE PIE', 'NOBODY CAN STAND'), T('La sangre no llega a la cabeza. Todo el mundo se desmaya.', 'Blood can\'t reach the brain. Everyone passes out.'), H([-8, 7, 131], [-11.5, 3.6, 120]), { sfx: [['panico', .3, .3]] }),
      P(T('PEGADO AL SUELO', 'STUCK TO THE FLOOR'), T('No puedes ni levantar un dedo.', 'You can\'t even lift a finger.'), H([-9.6, 3.9, 123], [-11.5, 3.1, 119.5])),
      P(T('COCHES COMO LATAS', 'CARS LIKE CANS'), T('Los coches se aplastan solos, sin que nadie los pise.', 'Cars crush themselves. Nobody even stepped on them.'), C([-1.5, 4.6, 122], [1, 3, 150]), { sfx: [['cristales', .4, .3]] }),
      P(T('LAS CASAS CEDEN', 'HOUSES GIVE WAY'), T('Las casas bajas se hunden bajo su propio peso.', 'Low houses sink under their own weight.'), C([-200, 90, -100], [0, 10, 400]), { sfx: [['derrumbe', .6, .5]] }),
      P(T('NI LOS RASCACIELOS', 'NOT EVEN SKYSCRAPERS'), T('El acero no aguanta. La ciudad es una alfombra de escombros.', 'Steel gives up. The city is a carpet of rubble.'), C([-500, 380, -300], [0, 20, 800]), { sfx: [['derrumbe', .8, .4]] }),
      P(T('EL MAR, UN ESPEJO', 'THE SEA, A MIRROR'), T('Ni una ola. Las montañas se desmoronan.', 'Not a single wave. Mountains crumble.'), C([-1500, 900, -900], [0, 0, 900])),
      P(T('CIELO NEGRO DE DÍA', 'BLACK SKY AT NOON'), T('La atmósfera se aplasta contra el suelo.', 'The atmosphere is squashed against the ground.'), C([-3000, 1500, -1800], [0, 0, 900])),
      P(T('LA TIERRA SE ENCOGE', 'EARTH SHRINKS'), T('El planeta se aprieta sobre sí mismo.', 'The planet squeezes in on itself.'), C([0, 1.5e6, 1.8e7], ESP), { planeta: true, camas: { ciudad: 0, espacio: .3 }, sfx: [['riser', .5, 0]] }),
      P(T('UNA ENANA BLANCA', 'A WHITE DWARF'), T('Tan comprimida que brilla.', 'So squeezed it glows.'), C([0, 1.5e6, 1.8e7], ESP), { planeta: true, sfx: [['planeta', .5, .2]] }),
      P(T('UNA ESTRELLA DE NEUTRONES', 'A NEUTRON STAR'), T('Una cucharadita pesa como una montaña.', 'A teaspoon weighs as much as a mountain.'), C([0, 1.2e6, 1.4e7], ESP), { planeta: true }),
      P(T('UN AGUJERO NEGRO', 'A BLACK HOLE'), T('La Tierra entera, del tamaño de una canica.', 'The whole Earth, the size of a marble.'), C([0, 1.2e6, 1.4e7], ESP), { planeta: true, agujero: true, dur: 4.5, sfx: [['impacto', .6, .3]] }),
    ],
    cierre: { titulo: T('Ni la luz escapa.', 'Not even light escapes.'), pregunta: T('¿Qué duplicamos ahora? 👇', 'What should we double next? 👇') },
  };
})();
