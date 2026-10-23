// El CO2 que se duplica: desde las 420 ppm de hoy hasta más del 10 % del aire.
// En vez de TNT, el marcador muestra cuántos coches tendrían que funcionar un año para echar el CO2 que hay de más
// respecto a antes de la industria
// (1 ppm ≈ 7,8 mil millones de t de CO2; un coche ≈ 4,6 t al año). Cifras aproximadas: compruébalas antes de publicar.
window.ESCENARIOS.co2 = {
  id: 'co2',
  tipo: 'co2',
  titulo: T('El CO2 que se duplica', 'The doubling CO2'),
  pregunta: T('¿Qué pasaría si el CO2 del aire se duplicara cada vez?', 'What if the CO2 in the air doubled every time?'),
  unidad: 'ppm',
  inicial: 420,
  multiplicador: 2,
  fases: [
    { texto: T('El aire de hoy. Antes de la industria había 280 ppm.', 'Today\'s air. Before industry there were 280 ppm.'),
      camara: { pos: [3, 5, 90], mira: [0, 4, 300] } },
    { texto: T('El clima se dispara: la Tierra se calienta varios grados. En una oficina cerrada ya cuesta concentrarse.', 'The climate runs wild: the Earth warms by several degrees. In a closed office it is already hard to focus.'),
      camara: { pos: [0, 7, 90], mira: [0, 3, 320] } },
    { texto: T('Dolor de cabeza y sueño (a partir de unas 1.000 ppm). El mar se vuelve más ácido.', 'Headaches and drowsiness (from about 1,000 ppm). The sea becomes more acidic.'),
      camara: { pos: [-30, 30, 60], mira: [0, 2, 300] } },
    { texto: T('Como hace 50 millones de años: sin hielo en los polos. Con el tiempo el mar subiría decenas de metros.', 'Like 50 million years ago: no ice at the poles. Over time the sea would rise by tens of metres.'),
      camara: { pos: [-220, 70, -140], mira: [0, 0, 150] } },
    { texto: T('Por encima del límite para trabajar (5.000 ppm). Respirar cansa y todo va más lento.', 'Above the workplace limit (5,000 ppm). Breathing is tiring and everything slows down.'),
      camara: { pos: [3, 4, 80], mira: [0, 2, 320] } },
    { texto: T('Respiración acelerada y mareos. La calima ya no deja ver los rascacielos.', 'Rapid breathing and dizziness. The haze now hides the skyscrapers.'),
      camara: { pos: [-300, 160, -120], mira: [0, 20, 700] } },
    { texto: T('Confusión y pánico. Los coches se quedan parados en mitad de la calle.', 'Confusion and panic. Cars stop in the middle of the street.'),
      camara: { pos: [-40, 35, 120], mira: [0, 2, 360] } },
    { texto: T('Más de 40.000 ppm: peligro inmediato para la vida. La gente empieza a desmayarse.', 'Over 40,000 ppm: immediately dangerous to life. People start fainting.'),
      camara: { pos: [6, 6, 100], mira: [0, 1, 260] } },
    { texto: T('Más del 10 % del aire. En pocos minutos se pierde la consciencia: la ciudad entera se queda dormida.', 'More than 10% of the air. Within minutes people pass out: the whole city falls asleep.'),
      camara: { pos: [8, 12, 140], mira: [0, 1, 260] } },
  ],
  cierre: { titulo: T('Todos dormidos.', 'Everyone is asleep.'), pregunta: T('¿Qué duplicamos ahora? 👇', 'What should we double next? 👇') },
};
