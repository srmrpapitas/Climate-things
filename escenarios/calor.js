// El calor que se duplica: de una mañana de primavera (10 °C) al doble de la superficie del Sol.
// TNT: energía para calentar 1 km³ de aire desde 15 °C. Cifras aproximadas: compruébalas antes de publicar.
window.ESCENARIOS = window.ESCENARIOS || {};
(() => {
  const C = (pos, mira) => ({ pos, mira }), H = (pos, mira) => ({ pos, mira, cerca: true }), // H: sigue al protagonista (suelo a 3 m)
    P = (sub, texto, camara, extra) => ({ sub, texto, camara, ...extra });
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
    intro: { pos: [-10.6, 8.2, 127.5], mira: [-11.5, 7.4, 120] },
    sonido: { camas: { dron: .3, ciudad: .5 }, paso: 'whoosh', pasoGan: .35 },
    // planeta: la cámara sale al espacio y se ve la Tierra incandescente.
    fases: [
      P(T('UNA MAÑANA DE PRIMAVERA', 'A SPRING MORNING'), T('Diez grados. Tiempo perfecto para pasear.', 'Ten degrees Celsius. Perfect weather for a walk.'), H([-10.9, 4.9, 125.2], [-11.5, 4.25, 120])),
      P(T('UN DÍA AGRADABLE', 'A NICE DAY'), T('Veinte grados. Ya se puede ir en manga corta. Tu vecino saca la barbacoa.', 'Twenty degrees. T-shirt weather. Your neighbour gets the barbecue out.'), H([-9.8, 5.6, 127.5], [-11.5, 4.3, 120])),
      P(T('UNA OLA DE CALOR', 'A HEATWAVE'), T('Cuarenta grados. El asfalto llega a setenta y todo el mundo busca la sombra. El aire acondicionado se rinde.', 'Forty degrees. The asphalt hits seventy and everyone looks for shade. The air conditioning gives up.'), H([-8, 7, 131], [-11.5, 4.2, 120])),
      P(T('UNA SAUNA', 'A SAUNA'), T('Más que el récord de la Tierra: casi cincuenta y siete grados en el Valle de la Muerte. Los árboles se secan.', 'Hotter than Earth\'s record: fifty-seven degrees in Death Valley. The trees dry out.'), C([-20, 26, 120], [0, 10, 500])),
      P(T('UN HORNO DE BIZCOCHO', 'A CAKE OVEN'), T('El agua hierve a cien. El mar hierve en la orilla. La sopa se hace sola.', 'Water boils at a hundred. The sea boils at the shore. The soup makes itself.'), C([-200, 60, -120], [0, 0, 160]),
        { camas: { ciudad: 0, fuego: .25 }, sfx: [['panico', .35, .4]], inserto: { pos: [10, 9, -8], mira: [0, 0, -80], t: 1.2, dur: 2.2, efecto: 'oceano' } }),
      P(T('UN HORNO DE PIZZA', 'A PIZZA OVEN'), T('El papel arde a doscientos treinta y la madera a trescientos. La ciudad entera en llamas.', 'Paper burns at two hundred and thirty, wood at three hundred. The whole city is in flames.'), C([-350, 220, -250], [0, 10, 600]),
        { camas: { fuego: .6 }, inserto: { pos: [-60, 30, 150], mira: [0, 0, 300], t: 1.2, dur: 2.2, efecto: 'incendio' } }),
      P(T('EL ALUMINIO SE ABLANDA', 'ALUMINIUM SOFTENS'), T('Casi seiscientos sesenta, cuando se funde el aluminio. Los coches se deforman y el cristal se ablanda. Tu móvil era de aluminio.', 'Almost six hundred and sixty, when aluminium melts. Cars warp and glass softens. Your phone was aluminium.'), C([-60, 40, 260], [0, 3, 430])),
      P(T('LAVA', 'LAVA'), T('Tan caliente como la lava de un volcán. El hormigón revienta y los edificios se desploman.', 'As hot as volcanic lava. Concrete bursts and buildings collapse.'), C([-600, 450, -300], [0, 20, 800]),
        { sfx: [['derrumbe', .7, .5]], inserto: { pos: [-70, 40, 200], mira: [0, 0, 380], t: 1.4, dur: 2.2, efecto: 'lava' } }),
      P(T('SE FUNDE EL ACERO', 'STEEL MELTS'), T('El acero se funde a mil quinientos. El suelo es lava y el mar se ha evaporado.', 'Steel melts at fifteen hundred. The ground is lava and the sea has boiled away.'), C([-1500, 1200, -900], [0, 0, 900]), { sfx: [['derrumbe', .6, .4]] }),
      P(T('CASI EL SOL', 'ALMOST THE SUN'), T('Casi como la superficie del Sol. La roca hierve y la Tierra brilla como una brasa.', 'Almost the surface of the Sun. Rock boils and Earth glows like an ember.'), C([0, 1.5e6, 1.8e7], ESP), { planeta: true, camas: { fuego: 0, espacio: .3 }, sfx: [['riser', .5, 0]] }),
      P(T('EL DOBLE QUE EL SOL', 'TWICE THE SUN\'S SURFACE'), T('El doble que el Sol. Cada metro cuadrado brilla once veces más que el del Sol. Desde el espacio, la Tierra deslumbra.', 'Twice the Sun. Every square metre shines eleven times brighter than the Sun\'s. From space, Earth is blinding.'), C([0, 2.5e6, 2.6e7], ESP), { planeta: true }),
      // el último salta de golpe: a unos cien mil grados la energía de cada átomo supera la que lo ata a la Tierra
      P(T('CIEN MIL GRADOS', 'A HUNDRED THOUSAND DEGREES'), T('Cien mil grados. Los átomos van tan rápido que la gravedad ya no los sujeta. La Tierra se evapora.', 'A hundred thousand degrees. The atoms move so fast that gravity can\'t hold them. Earth evaporates.'), C([0, 3e6, 3e7], ESP),
        { valor: 1e5, planeta: true, dur: 7, sfx: [['planeta', .8, 1.6]], camas: { dron: .35, espacio: .3 } }),
    ],
    cierre: { titulo: T('Por lo menos ya no hace frío.', 'At least it\'s not cold anymore.'), pregunta: T('¿Qué duplicamos ahora? 👇', 'What should we double next? 👇') },
  };
})();
