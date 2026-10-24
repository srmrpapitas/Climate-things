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
      P(0, T('UNA MAÑANA DE INVIERNO', 'A WINTER MORNING'), T('Cero grados: el agua se hiela. Hielo en las aceras y escarcha en los coches. Llegas tarde rascando el parabrisas.', 'Zero degrees Celsius: water freezes. Ice on the pavement, frost on the cars. You\'re late, scraping the windscreen.'), H([-10.9, 4.9, 125.2], [-11.5, 4.25, 120])),
      P(-136.6, T('MÁS FRÍO QUE LA ANTÁRTIDA', 'COLDER THAN ANTARCTICA'), T('Mucho más que el récord de la Antártida, menos ochenta y nueve. El mar se congela y el CO₂ del aire cae como hielo seco.', 'Far colder than Antarctica\'s record, minus eighty-nine. The sea freezes and the air\'s CO₂ falls as dry ice.'), C([-200, 60, -120], [0, 0, 160]),
        { camas: { ciudad: 0, helado: .55 }, sfx: [['cristales', .35, .5]], inserto: { pos: [-40, 18, -90], mira: [0, 6, 90], t: 1.2, dur: 2.2, efecto: 'nieve' } }),
      P(-204.9, T('AIRE LÍQUIDO', 'LIQUID AIR'), T('El oxígeno y el nitrógeno se vuelven líquidos. Llueve aire. Y tú sin paraguas.', 'Oxygen and nitrogen turn liquid. It rains air. And you forgot your umbrella.'), H([-6, 9, 134], [-11.5, 3.6, 119]),
        { inserto: { pos: [6, 4, 140], mira: [-12, 8, 110], t: 1, dur: 2.2, efecto: 'aire' } }),
      P(-238.9, T('NITRÓGENO CONGELADO', 'FROZEN NITROGEN'), T('El aire se congela. Toda la atmósfera cae como nieve.', 'The air freezes. The whole atmosphere falls as snow.'), C([-350, 200, -250], [0, 10, 600]),
        { inserto: { pos: [-30, 14, 150], mira: [0, 4, 230], t: 1, dur: 2.4, efecto: 'nieve' } }),
      P(-256.1, T('SIN AIRE', 'NO AIR LEFT'), T('Todo el aire está en el suelo, congelado. Sin aire no hay sonido y el cielo es negro a mediodía. Por fin, silencio.', 'All the air is frozen on the ground. No air means no sound, and the sky is black at noon. Finally, some peace and quiet.'), C([-600, 350, -300], [0, 60, 800]), { camas: { helado: 0, espacio: .3 } }),
      P(-264.6, T('ACERO COMO CRISTAL', 'STEEL LIKE GLASS'), T('El acero normal ya se vuelve frágil a menos cincuenta. Aquí, los edificios se hacen añicos.', 'Ordinary steel turns brittle at minus fifty. Down here, buildings shatter.'), C([-300, 170, 100], [0, 30, 700]),
        { romper: true, sfx: [['cristales', .5, .4], ['derrumbe', .5, .8]], inserto: { pos: [-60, 30, 280], mira: [0, 20, 420], t: 1.4, dur: 2.4, efecto: 'cristales' } }),
      P(-268.9, T('HELIO LÍQUIDO', 'LIQUID HELIUM'), T('El helio, el último gas, se vuelve líquido. Ya todo es sólido o líquido.', 'Helium, the last gas, turns liquid. Everything is solid or liquid now.'), C([-900, 600, -500], [0, 0, 900])),
      P(-271.0, T('MÁS FRÍO QUE EL ESPACIO', 'COLDER THAN SPACE'), T('Más frío que el espacio vacío, que está a menos doscientos setenta. Más frío que el eco del Big Bang. Y tu casero sigue sin poner la calefacción.', 'Colder than empty space, which sits at minus two hundred and seventy. Colder than the echo of the Big Bang. And the landlord still won\'t turn the heating on.'), C([-1600, 1400, -1000], [0, 0, 1000])),
      P(-272.1, T('CASI EL CERO ABSOLUTO', 'ALMOST ABSOLUTE ZERO'), T('A un grado del cero absoluto. Los átomos casi no se mueven.', 'One degree from absolute zero. Atoms barely move.'), C([-4000, 4000, -3000], [0, 0, 1200])),
      P(-272.6, T('EL CERO ABSOLUTO NUNCA LLEGA', 'ABSOLUTE ZERO NEVER ARRIVES'), T('Puedes partirlo por la mitad para siempre. En un laboratorio se ha llegado a treinta y ocho billonésimas de grado, pero nunca a cero.', 'You can halve it forever. A lab once reached thirty-eight trillionths of a degree, but never zero.'), C([0, 1.5e6, 1.8e7], [0, -6.371e6, 0]), { planeta: true, dur: 4.5 }),
    ],
    cierre: { titulo: T('Todo congelado.', 'Everything is frozen.'), pregunta: T('¿Qué duplicamos ahora? 👇', 'What should we double next? 👇') },
  };
})();
