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
      P(T('UN DÍA NORMAL', 'A NORMAL DAY'), T('Pesas setenta kilos, como siempre. De momento.', 'You weigh seventy kilos, like always. For now.'), H([-10.9, 4.9, 125.2], [-11.5, 4.25, 120])),
      P(T('CASI JÚPITER', 'ALMOST JUPITER'), T('Casi como en Júpiter. Como llevar a otro tú a caballito todo el día.', 'Almost like Jupiter. Like giving yourself a piggyback all day.'), H([-9.8, 5.6, 127.5], [-11.5, 4.3, 120])),
      P(T('MONTAÑA RUSA SIN FIN', 'A ROLLER COASTER THAT NEVER ENDS'), T('Como el peor momento de una montaña rusa, pero sin parar. Levantarse del sofá es un deporte olímpico.', 'Like the worst moment of a roller coaster, nonstop. Getting off the sofa is an Olympic sport.'), H([-8.6, 4.4, 124], [-11.5, 3.9, 120])),
      P(T('NADIE AGUANTA DE PIE', 'NOBODY CAN STAND'), T('Como un piloto de caza en pleno giro. La sangre no llega a la cabeza y todo el mundo se desmaya.', 'Like a fighter pilot in a hard turn. Blood can\'t reach the brain and everyone passes out.'), H([-8, 7, 131], [-11.5, 3.6, 120]), { sfx: [['panico', .3, .3]] }),
      P(T('PEGADO AL SUELO', 'STUCK TO THE FLOOR'), T('Pesas más de una tonelada. No puedes ni levantar un dedo.', 'You weigh over a tonne. You can\'t even lift a finger.'), H([-9.6, 3.9, 123], [-11.5, 3.1, 119.5])),
      P(T('MÁS QUE EN EL SOL', 'MORE THAN ON THE SUN'), T('Más gravedad que en la superficie del Sol. Los coches se aplastan solos.', 'More gravity than on the surface of the Sun. Cars crush themselves.'), C([-1.5, 4.6, 122], [1, 3, 150]), { sfx: [['cristales', .4, .3]] }),
      P(T('LAS CASAS CEDEN', 'HOUSES GIVE WAY'), T('Cada ladrillo pesa como dos personas. Las casas bajas se hunden bajo su propio peso.', 'Every brick weighs as much as two people. Low houses sink under their own weight.'), C([-200, 90, -100], [0, 10, 400]),
        { sfx: [['derrumbe', .6, .5]], inserto: { plano: 'cae', alto: [0, 14], t: 1, dur: 2.4 } }),
      P(T('NI LOS RASCACIELOS', 'NOT EVEN SKYSCRAPERS'), T('Cada rascacielos pesa como ciento veintiocho. El acero no aguanta. La ciudad es una alfombra de escombros.', 'Every skyscraper weighs as much as a hundred and twenty-eight. Steel gives up. The city is a carpet of rubble.'), C([-500, 380, -300], [0, 20, 800]),
        { sfx: [['derrumbe', .8, .4]], inserto: { plano: 'cae', alto: [60, 1e4], t: 1, dur: 2.8 } }),
      P(T('EL MAR, UN ESPEJO', 'THE SEA, A MIRROR'), T('La montaña más alta posible mediría treinta y cinco metros. Ni una ola. Las montañas se desmoronan.', 'The tallest possible mountain would be thirty-five metres high. Not a single wave. Mountains crumble.'), C([-1500, 900, -900], [0, 0, 900]),
        { inserto: { pos: [10, 14, -6], mira: [0, 0, -90], t: 1, dur: 2.2 } }),
      P(T('EL AIRE, 17 METROS', 'THE AIR, 17 METRES THICK'), T('Todo el aire se aplasta en una capa de diecisiete metros. Respirarlo es como bucear a cinco kilómetros.', 'All the air is squashed into a layer seventeen metres thick. Breathing it is like diving five kilometres deep.'), C([-3000, 1500, -1800], [0, 0, 900])),
      P(T('LA TIERRA SE ENCOGE', 'EARTH SHRINKS'), T('Pesas setenta toneladas. El planeta se aprieta sobre sí mismo.', 'You weigh seventy tonnes. The planet squeezes in on itself.'), C([0, 1.5e6, 1.8e7], ESP), { planeta: true, camas: { ciudad: 0, espacio: .3 }, sfx: [['riser', .5, 0]] }),
      P(T('SE COMPRIME Y BRILLA', 'SQUEEZED UNTIL IT GLOWS'), T('La presión funde las rocas. El planeta brilla al rojo.', 'The pressure melts the rocks. The planet glows red hot.'), C([0, 1.5e6, 1.8e7], ESP), { planeta: true, sfx: [['planeta', .5, .2]] }),
      P(T('MÁS QUE CUALQUIER ESTRELLA', 'MORE THAN ANY STAR'), T('Más gravedad que en cualquier estrella normal. Una piedra de trescientos gramos pesa como un coche.', 'More gravity than on any ordinary star. A three hundred gram pebble weighs as much as a car.'), C([0, 1.2e6, 1.4e7], ESP), { planeta: true }),
      // el último salta de golpe: con la gravedad 700 millones de veces más fuerte, la propia Tierra cabe dentro de su horizonte (radio de Schwarzschild = 9 mm × 7·10⁸ ≈ 6.400 km)
      P(T('UN AGUJERO NEGRO', 'A BLACK HOLE'), T('Setecientos millones de veces más fuerte. Ni la luz puede escapar. La Tierra se convierte en un agujero negro.', 'Seven hundred million times stronger. Not even light can escape. Earth becomes a black hole.'), C([0, 1.2e6, 1.4e7], ESP),
        { valor: 7e8, planeta: true, agujero: true, dur: 4.5, sfx: [['impacto', .6, .3]] }),
    ],
    cierre: { titulo: T('Ni la luz escapa.', 'Not even light escapes.'), pregunta: T('¿Qué duplicamos ahora? 👇', 'What should we double next? 👇') },
  };
})();
