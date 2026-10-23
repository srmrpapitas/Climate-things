// El CO2 que se duplica: desde las 420 ppm de hoy hasta más del 10 % del aire.
// En vez de TNT, el marcador muestra cuántos coches tendrían que funcionar un año para echar el CO2 que hay de más
// respecto a antes de la industria
// (1 ppm ≈ 7,8 mil millones de t de CO2; un coche ≈ 4,6 t al año). Cifras aproximadas: compruébalas antes de publicar.
window.ESCENARIOS.co2 = {
  id: 'co2',
  tipo: 'co2',
  titulo: 'El CO2 que se duplica',
  pregunta: '¿Qué pasaría si el CO2 del aire se duplicara cada vez?',
  unidad: 'ppm',
  inicial: 420,
  multiplicador: 2,
  fases: [
    { texto: 'El aire de hoy. Antes de la industria había 280 ppm.',
      camara: { pos: [3, 5, 90], mira: [0, 4, 300] } },
    { texto: 'El clima se dispara: la Tierra se calienta varios grados. En una oficina cerrada ya cuesta concentrarse.',
      camara: { pos: [0, 7, 90], mira: [0, 3, 320] } },
    { texto: 'Dolor de cabeza y sueño (a partir de unas 1.000 ppm). El mar se vuelve más ácido.',
      camara: { pos: [-30, 30, 60], mira: [0, 2, 300] } },
    { texto: 'Como hace 50 millones de años: sin hielo en los polos. Con el tiempo el mar subiría decenas de metros.',
      camara: { pos: [-220, 70, -140], mira: [0, 0, 150] } },
    { texto: 'Por encima del límite para trabajar (5.000 ppm). Respirar cansa y todo va más lento.',
      camara: { pos: [3, 4, 80], mira: [0, 2, 320] } },
    { texto: 'Respiración acelerada y mareos. La calima ya no deja ver los rascacielos.',
      camara: { pos: [-300, 160, -120], mira: [0, 20, 700] } },
    { texto: 'Confusión y pánico. Los coches se quedan parados en mitad de la calle.',
      camara: { pos: [-40, 35, 120], mira: [0, 2, 360] } },
    { texto: 'Más de 40.000 ppm: peligro inmediato para la vida. La gente empieza a desmayarse.',
      camara: { pos: [6, 6, 100], mira: [0, 1, 260] } },
    { texto: 'Más del 10 % del aire. En pocos minutos se pierde la consciencia: la ciudad entera se queda dormida.',
      camara: { pos: [8, 12, 140], mira: [0, 1, 260] } },
  ],
  cierre: { titulo: 'Todos dormidos.', pregunta: '¿Qué duplicamos ahora? 👇' },
};
