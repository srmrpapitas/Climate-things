// El CO2 que se duplica: desde las 420 ppm de hoy hasta que hay más CO2 que aire.
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
      P(T('EL AIRE DE HOY', 'TODAY\'S AIR'), T('Antes de la industria había 280 ppm.', 'Before industry there were 280 ppm.'), H([-10.9, 4.9, 125.2], [-11.5, 4.25, 120])),
      P(T('UN AULA SIN VENTILAR', 'A STUFFY CLASSROOM'), T('El planeta se calienta varios grados.', 'The planet warms by several degrees.'), H([-9.8, 5.6, 127.5], [-11.5, 4.3, 120])),
      P(T('UNA REUNIÓN DE TRES HORAS', 'A THREE-HOUR MEETING'), T('Dolor de cabeza y sueño.', 'Headaches and drowsiness.'), H([-8, 7, 131], [-11.5, 4.2, 120])),
      P(T('HACE 50 MILLONES DE AÑOS', '50 MILLION YEARS AGO'), T('Ya no queda hielo en los polos.', 'No ice left at the poles.'), C([-220, 70, -140], [0, 0, 150])),
      P(T('UN SUBMARINO', 'A SUBMARINE'), T('Por encima del límite para trabajar. Respirar cansa.', 'Above the workplace limit. Breathing is tiring.'), C([-60, 30, 40], [0, 2, 320])),
      P(T('UN MAL DÍA EN LA ESTACIÓN ESPACIAL', 'A BAD DAY ON THE SPACE STATION'), T('Mareos. La calima ya no deja ver los rascacielos.', 'Dizziness. The haze hides the skyscrapers.'), C([-300, 160, -120], [0, 20, 700])),
      P(T('UNA BODEGA FERMENTANDO VINO', 'A WINE CELLAR DURING FERMENTATION'), T('Confusión y pánico. Los coches se paran en mitad de la calle.', 'Confusion and panic. Cars stop in the middle of the street.'), { ...H([-6, 12, 134], [-11.5, 3.5, 118]), dur: 1.8 }, { camas: { ciudad: .15, asfixia: .3 }, sfx: [['panico', .35, .3]] }),
      P(T('AIRE MORTAL', 'DEADLY AIR'), T('La gente empieza a desmayarse.', 'People start fainting.'), H([-9, 5.5, 128], [-11.5, 3.8, 120]), { camas: { ciudad: 0, asfixia: .5 } }),
      P(T('EL 10 % DEL AIRE', '10% OF THE AIR'), T('La ciudad entera se queda dormida.', 'The whole city falls asleep.'), H([-7, 9, 133], [-11.5, 3.3, 120])),
      P(T('EL LAGO NYOS, 1986', 'LAKE NYOS, 1986'), T('Una sola bocanada y te desmayas.', 'One breath and you pass out.'), H([-4, 20, 140], [-11.5, 3, 118])),
      P(T('CASI LA MITAD ES CO2', 'ALMOST HALF IS CO2'), T('Hasta las plantas están preocupadas.', 'Even the plants are worried.'), C([-60, 60, 200], [0, 5, 400])),
      P(T('MÁS CO2 QUE AIRE', 'MORE CO2 THAN AIR'), T('El aire de la Tierra ya se parece al de Venus.', 'Earth\'s air now looks like Venus.'), C([-300, 200, -100], [0, 10, 600]), { dur: 4.5, camas: { asfixia: .3 } }),
    ],
    cierre: { titulo: T('Todos dormidos.', 'Everyone is asleep.'), pregunta: T('¿Qué duplicamos ahora? 👇', 'What should we double next? 👇') },
  };
})();
