// El CO2 que se duplica: desde las 420 ppm de hoy hasta que todo el aire es CO2 y la Tierra va camino de Venus.
// Calentamiento a la larga: ≈ 3 °C por cada vez que se duplica respecto a las 280 ppm de antes de la industria (IPCC).
// En vez de TNT, el marcador muestra cuántos coches tendrían que funcionar un año para echar el CO2 que hay de más
// respecto a antes de la industria (1 ppm ≈ 7,8 mil millones de t de CO2; un coche ≈ 4,6 t al año).
// Cifras aproximadas: compruébalas antes de publicar.
window.ESCENARIOS = window.ESCENARIOS || {};
(() => {
  const C = (pos, mira) => ({ pos, mira }), H = (pos, mira) => ({ pos, mira, cerca: true }), // H: sigue al protagonista (suelo a 3 m)
    P = (sub, texto, camara, extra) => ({ sub, texto, camara, ...extra });
  window.ESCENARIOS.co2 = {
    id: 'co2',
    tipo: 'co2',
    titulo: T('El CO2 que se duplica', 'The doubling CO2'),
    pregunta: T('¿Y si el CO2 del aire se duplicara cada vez?', 'What if the CO2 in the air doubled every time?'),
    unidad: 'ppm',
    inicial: 420,
    multiplicador: 2,
    ritmo: 3.2, introDur: 2.8,
    paso: T('DUPLICACIÓN', 'DOUBLING'),
    lema: T('EL DOBLE DE CO2 CADA VEZ', 'TWICE THE CO2 EVERY TIME'),
    intro: { pos: [-10.6, 8.2, 127.5], mira: [-11.5, 7.4, 120] },
    sonido: { camas: { dron: .3, ciudad: .5 }, paso: 'whoosh', pasoGan: .3 },
    fases: [
      P(T('EL AIRE DE HOY', 'TODAY\'S AIR'), T('Cuatro de cada diez mil moléculas del aire. Antes de la industria eran menos de tres. Cada año echamos treinta y siete mil millones de toneladas más.', 'Four in every ten thousand molecules of air. Before industry it was under three. Every year we add thirty-seven billion tonnes more.'), H([-10.9, 4.9, 125.2], [-11.5, 4.25, 120])),
      P(T('UN AULA SIN VENTILAR', 'A STUFFY CLASSROOM'), T('Un aula cerrada ya llega a esto. Para el planeta, a la larga, casi cinco grados más que antes de la industria. Nadie abre la ventana.', 'A closed classroom gets this high. For the planet, in the long run, almost five degrees warmer than before industry. Nobody opens a window.'), H([-9.8, 5.6, 127.5], [-11.5, 4.3, 120])),
      P(T('UNA REUNIÓN DE TRES HORAS', 'A THREE-HOUR MEETING'), T('Con más de mil, en pruebas, la gente ya toma peores decisiones. Y casi ocho grados más: cada verano, olas de calor de récord. Esto explica muchas reuniones.', 'Above a thousand, people in tests already make worse decisions. And almost eight degrees warmer: record heatwaves every summer. That explains a lot of meetings.'), H([-8, 7, 131], [-11.5, 4.2, 120])),
      P(T('MÁS QUE CON LOS DINOSAURIOS', 'MORE THAN THE DINOSAURS HAD'), T('Más que en la época de los dinosaurios. Con el tiempo se derrite todo el hielo de los polos y el mar sube setenta metros. Tu piso es ahora primera línea de playa.', 'More than in the age of the dinosaurs. In time all the polar ice melts and the sea rises seventy metres. Your flat is beachfront now.'), C([-220, 70, -140], [0, 0, 150]),
        { inserto: { pos: [-40, 14, -60], mira: [0, 4, 40], t: 1.4, dur: 2.2 } }),
      P(T('EL LÍMITE PARA TRABAJAR', 'THE WORKPLACE LIMIT'), T('Pasa del límite para trabajar, cinco mil. Los submarinos no dejan que suba de ocho mil. Y catorce grados más: en media Tierra el calor húmedo mata.', 'Past the workplace limit of five thousand. Submarines never let it go above eight thousand. And fourteen degrees warmer: across half the Earth, humid heat kills.'), C([-60, 30, 40], [0, 2, 320])),
      P(T('RESPIRAR CANSA', 'BREATHING IS HARD WORK'), T('Más del uno por ciento. Respiras más rápido sin darte cuenta y te mareas. Nadie lo ve venir: el CO₂ no huele ni se ve.', 'Over one percent. You breathe faster without noticing, and feel dizzy. Nobody sees it coming: CO₂ has no smell and no colour.'), C([-300, 160, -120], [0, 20, 700])),
      P(T('UNA BODEGA FERMENTANDO VINO', 'A WINE CELLAR DURING FERMENTATION'), T('Casi el tres por ciento, como una bodega sin ventilar. Respiras el doble de rápido, te estalla la cabeza y nadie puede conducir. Y eso que no has bebido.', 'Almost three percent, like an unventilated wine cellar. You breathe twice as fast, your head pounds, and nobody can drive. And you haven\'t even had a drink.'), { ...H([-6, 12, 134], [-11.5, 3.5, 118]), dur: 1.8 },
        { camas: { ciudad: .15, asfixia: .3 }, sfx: [['panico', .35, .3]], inserto: { plano: 'coche', t: 1.6, dur: 2.2 } }),
      P(T('PELIGRO INMEDIATO', 'IMMEDIATELY DANGEROUS'), T('Más del cuatro por ciento: peligro inmediato para la vida. Confusión, pánico, y la gente empieza a desmayarse.', 'Over four percent: immediately dangerous to life. Confusion, panic, and people start to faint.'), H([-9, 5.5, 128], [-11.5, 3.8, 120]),
        { camas: { ciudad: 0, asfixia: .5 }, inserto: { plano: 'heroe', pos: [-5, 4.4, 123.5], mira: [-11.5, 3.6, 121], t: .9, dur: 2.6 } }),
      P(T('EL 10 % DEL AIRE', '10% OF THE AIR'), T('Más del diez por ciento: pierdes el conocimiento en un minuto. La ciudad entera se queda dormida.', 'Over ten percent: you black out within a minute. The whole city falls asleep.'), H([-7, 9, 133], [-11.5, 3.3, 120]),
        { inserto: { plano: 'heroe', pos: [-3, 6.5, 128], mira: [-10, 3, 145], t: 1.6, dur: 2.4 } }),
      P(T('EL LAGO NYOS, 1986', 'LAKE NYOS, 1986'), T('En 1986 el lago Nyos, en Camerún, soltó una nube de CO₂ así. Mató a mil setecientas personas mientras dormían.', 'In 1986 Lake Nyos, in Cameroon, released a cloud of CO₂ like this. It killed seventeen hundred people in their sleep.'), H([-4, 20, 140], [-11.5, 3, 118])),
      P(T('CASI LA MITAD ES CO₂', 'ALMOST HALF IS CO₂'), T('Casi la mitad es CO₂. Queda tan poco oxígeno como a cuatro mil quinientos metros de altura. Hasta las plantas están preocupadas.', 'Almost half is CO₂. There\'s as little oxygen as four and a half thousand metres up. Even the plants are worried.'), C([-60, 60, 200], [0, 5, 400])),
      P(T('CASI COMO VENUS', 'ALMOST LIKE VENUS'), T('El ochenta y seis por ciento del aire. El de Venus es un noventa y seis por ciento CO₂. Ya casi somos Venus, pero con atascos.', 'Eighty-six percent of the air. Venus\'s air is ninety-six percent CO₂. Almost Venus, but with traffic jams.'), C([-300, 200, -100], [0, 10, 600]), { camas: { asfixia: .3 } }),
      // último paso: ya no cabe más CO2 en el aire (100 %); el efecto invernadero se desboca y la Tierra se vuelve como Venus
      P(T('UNA TIERRA COMO VENUS', 'AN EARTH LIKE VENUS'), T('Todo es CO₂. El efecto invernadero se desboca, hierven los océanos y la Tierra va camino de Venus, que está a cuatrocientos sesenta grados.', 'Nothing but CO₂. The greenhouse effect runs away, the oceans boil, and Earth heads the way of Venus, at four hundred and sixty degrees.'), C([0, 1.5e6, 1.8e7], [0, -6.371e6, 0]),
        { valor: 1e6, planeta: true, dur: 5.5, camas: { asfixia: 0, espacio: .3 }, sfx: [['riser', .5, 0]], inserto: { pos: [10, 9, -8], mira: [0, 0, -80], t: .4, dur: 2.6, efecto: 'oceano' } }),
    ],
    cierre: { titulo: T('Bienvenidos a Venus.', 'Welcome to Venus.'), pregunta: T('¿Qué duplicamos ahora? 👇', 'What should we double next? 👇') },
  };
})();
