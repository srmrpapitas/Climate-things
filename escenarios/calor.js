// El calor que se duplica: de una mañana de primavera (10 °C) al doble de la superficie del Sol.
// TNT: energía para calentar 1 km³ de aire desde 15 °C. Cifras aproximadas: compruébalas antes de publicar.
window.ESCENARIOS = window.ESCENARIOS || {};
(() => {
  const C = (pos, mira) => ({ pos, mira }), P = (sub, texto, camara, extra) => ({ sub, texto, camara, ...extra });
  const ESP = [0, -6.371e6, 0];
  window.ESCENARIOS.calor = {
    id: 'calor',
    tipo: 'calor',
    titulo: T('El calor que se duplica', 'The doubling heat'),
    pregunta: T('¿Y si cada día hiciera el doble de calor que el anterior?', 'What if every day was twice as hot as the last?'),
    unidad: '°C',
    inicial: 10,
    multiplicador: 2,
    ritmo: 3.2, introDur: 2.8,
    paso: T('DUPLICACIÓN', 'DOUBLING'),
    lema: T('EL DOBLE DE CALOR CADA VEZ', 'TWICE AS HOT EVERY TIME'),
    intro: { pos: [-20, 12, 120], mira: [0, 14, 520] },
    sonido: { camas: { dron: .3, ciudad: .5 }, paso: 'whoosh', pasoGan: .35 },
    // planeta: la cámara sale al espacio y se ve la Tierra incandescente.
    fases: [
      P(T('UNA MAÑANA DE PRIMAVERA', 'A SPRING MORNING'), T('Tiempo perfecto para pasear.', 'Perfect weather for a walk.'), C([2, 5, 160], [0, 14, 520])),
      P(T('UN DÍA AGRADABLE', 'A NICE DAY'), T('Ya se puede ir en manga corta.', 'T-shirt weather.'), C([2, 5, 160], [0, 14, 520])),
      P(T('UNA OLA DE CALOR', 'A HEATWAVE'), T('El asfalto quema y todo el mundo busca la sombra.', 'The asphalt burns. Everyone looks for shade.'), C([-6, 9, 150], [0, 13, 510])),
      P(T('UNA SAUNA', 'A SAUNA'), T('Más que el récord de la Tierra: 56,7 °C. Los árboles se secan.', 'Hotter than Earth\'s record: 56.7 °C. The trees dry out.'), C([-20, 26, 120], [0, 10, 500])),
      P(T('UN HORNO DE PAN', 'A BREAD OVEN'), T('El mar hierve en la orilla.', 'The sea boils at the shore.'), C([-200, 60, -120], [0, 0, 160]), { camas: { ciudad: 0, fuego: .25 }, sfx: [['panico', .35, .4]] }),
      P(T('UN HORNO DE PIZZA', 'A PIZZA OVEN'), T('Arden la madera y los árboles. La ciudad entera en llamas.', 'Wood and trees catch fire. The whole city is in flames.'), C([-350, 220, -250], [0, 10, 600]), { camas: { fuego: .6 } }),
      P(T('SE FUNDE EL ALUMINIO', 'ALUMINIUM MELTS'), T('Los coches se deforman y el cristal se ablanda.', 'Cars warp and glass softens.'), C([-60, 40, 260], [0, 3, 430])),
      P(T('LAVA', 'LAVA'), T('El hormigón revienta. Los edificios se desploman.', 'Concrete bursts. Buildings collapse.'), C([-600, 450, -300], [0, 20, 800]), { sfx: [['derrumbe', .7, .5]] }),
      P(T('SE FUNDE EL ACERO', 'STEEL MELTS'), T('El suelo es lava y el mar se ha evaporado.', 'The ground is lava and the sea has boiled away.'), C([-1500, 1200, -900], [0, 0, 900]), { sfx: [['derrumbe', .6, .4]] }),
      P(T('LA SUPERFICIE DEL SOL', 'THE SURFACE OF THE SUN'), T('La Tierra brilla como una brasa.', 'Earth glows like an ember.'), C([0, 1.5e6, 1.8e7], ESP), { planeta: true, camas: { fuego: 0, espacio: .3 }, sfx: [['riser', .5, 0]] }),
      P(T('EL DOBLE QUE EL SOL', 'TWICE THE SUN\'S SURFACE'), T('La Tierra ya brilla más que el Sol.', 'Earth now outshines the Sun.'), C([0, 2.5e6, 2.6e7], ESP), { planeta: true, dur: 4.5 }),
    ],
    cierre: { titulo: T('No queda nada.', 'Nothing is left.'), pregunta: T('¿Qué duplicamos ahora? 👇', 'What should we double next? 👇') },
  };
})();
