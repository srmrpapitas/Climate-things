// El frío que se duplica: en cada paso la temperatura absoluta (kelvin) baja a la mitad, desde 0 °C (273,15 K).
// TNT: energía que hay que quitarle a 1 km³ de aire desde 15 °C. Cifras aproximadas: compruébalas antes de publicar.
// valor: temperatura en °C. romper: los edificios se hacen añicos. planeta: se ve la Tierra congelada.
window.ESCENARIOS = window.ESCENARIOS || {};
(() => {
  const C = (pos, mira) => ({ pos, mira }), H = (pos, mira) => ({ pos, mira, cerca: true }), // H: sigue al protagonista (suelo a 3 m)
    P = (valor, sub, texto, camara, extra) => ({ valor, sub, texto, camara, ...extra });
  window.ESCENARIOS.frio = {
    id: 'frio',
    tipo: 'frio',
    titulo: T('El frío que se duplica', 'The doubling cold'),
    pregunta: T('¿Y si cada día tuviera la mitad de calor que el anterior?', 'What if every day had half the heat of the last?'),
    unidad: '°C',
    ritmo: 3.2, introDur: 2.8,
    paso: T('MITAD', 'HALVING'),
    lema: T('LA MITAD DE CALOR CADA VEZ', 'HALF THE HEAT EVERY TIME'),
    intro: { pos: [-10.6, 8.2, 127.5], mira: [-11.5, 7.4, 120] },
    sonido: { camas: { dron: .3, ciudad: .4, helado: .2 }, paso: 'whoosh', pasoGan: .35 },
    fases: [
      P(0, T('UNA MAÑANA DE INVIERNO', 'A WINTER MORNING'), T('Hielo en las aceras y escarcha en los coches.', 'Ice on the pavement. Frost on the cars.'), H([-10.9, 4.9, 125.2], [-11.5, 4.25, 120])),
      P(-136.6, T('MÁS FRÍO QUE LA ANTÁRTIDA', 'COLDER THAN ANTARCTICA'), T('El mar se congela. Respirar quema los pulmones.', 'The sea freezes. Breathing burns your lungs.'), C([-200, 60, -120], [0, 0, 160]), { camas: { ciudad: 0, helado: .55 }, sfx: [['cristales', .35, .5]] }),
      P(-204.9, T('AIRE LÍQUIDO', 'LIQUID AIR'), T('El aire se vuelve líquido. Llueve aire.', 'The air turns to liquid. It rains air.'), H([-6, 9, 134], [-11.5, 3.6, 119])),
      P(-238.9, T('NITRÓGENO CONGELADO', 'FROZEN NITROGEN'), T('Toda la atmósfera cae como nieve.', 'The whole atmosphere falls as snow.'), C([-350, 200, -250], [0, 10, 600])),
      P(-256.1, T('SIN AIRE', 'NO AIR LEFT'), T('Sin aire no hay sonido. El cielo es negro a mediodía.', 'No air, no sound. The sky is black at noon.'), C([-600, 350, -300], [0, 60, 800]), { camas: { helado: 0, espacio: .3 } }),
      P(-264.6, T('ACERO COMO CRISTAL', 'STEEL LIKE GLASS'), T('Los edificios se hacen añicos.', 'Buildings shatter.'), C([-300, 170, 100], [0, 30, 700]), { romper: true, sfx: [['cristales', .5, .4], ['derrumbe', .5, .8]] }),
      P(-268.9, T('HELIO LÍQUIDO', 'LIQUID HELIUM'), T('Ya todo es sólido.', 'Everything is solid now.'), C([-900, 600, -500], [0, 0, 900])),
      P(-271.0, T('MÁS FRÍO QUE EL ESPACIO', 'COLDER THAN SPACE'), T('Más frío que el eco del Big Bang.', 'Colder than the echo of the Big Bang.'), C([-1600, 1400, -1000], [0, 0, 1000])),
      P(-272.1, T('CASI EL CERO ABSOLUTO', 'ALMOST ABSOLUTE ZERO'), T('Los átomos casi no se mueven.', 'Atoms barely move.'), C([-4000, 4000, -3000], [0, 0, 1200])),
      P(-272.6, T('EL CERO ABSOLUTO NUNCA LLEGA', 'ABSOLUTE ZERO NEVER ARRIVES'), T('Puedes partirlo por la mitad para siempre.', 'You can halve it forever.'), C([0, 1.5e6, 1.8e7], [0, -6.371e6, 0]), { planeta: true, dur: 4.5 }),
    ],
    cierre: { titulo: T('Todo congelado.', 'Everything is frozen.'), pregunta: T('¿Qué duplicamos ahora? 👇', 'What should we double next? 👇') },
  };
})();
