// El frío que se duplica: en cada fase la temperatura absoluta (kelvin) baja a la mitad, desde 0 °C (273,15 K).
// TNT: energía que hay que quitarle a 1 km³ de aire desde 15 °C. Cifras aproximadas: compruébalas antes de publicar.
window.ESCENARIOS.frio = {
  id: 'frio',
  tipo: 'frio',
  titulo: 'El frío que se duplica',
  pregunta: '¿Qué pasaría si el frío se duplicara cada vez?',
  unidad: '°C',
  // valor: temperatura en °C de cada fase (273,15 K dividido entre 2 cada vez).
  // romper: los edificios se hacen añicos. planeta: la cámara sale al espacio y se ve la Tierra congelada.
  fases: [
    { valor: 0, texto: 'El agua se congela: hielo en las aceras y escarcha en los coches.',
      camara: { pos: [2, 5, 160], mira: [0, 14, 520] } },
    { valor: -136.6, texto: 'Mucho más que el récord de la Tierra (−89 °C en la Antártida). El mar se congela y respirar este aire quema los pulmones.',
      camara: { pos: [-200, 60, -120], mira: [0, 0, 160] } },
    { valor: -204.9, texto: 'El aire se vuelve líquido: el oxígeno a −183 °C y el nitrógeno a −196 °C. Llueve aire.',
      camara: { pos: [-20, 20, 140], mira: [0, 6, 450] } },
    { valor: -238.9, texto: 'El nitrógeno se congela (−210 °C). Toda la atmósfera es ahora una capa de nieve de unos 10 m.',
      camara: { pos: [-350, 200, -250], mira: [0, 10, 600] } },
    { valor: -256.1, texto: 'Sin aire, el cielo es negro en pleno día. Hasta el hidrógeno sería líquido (−253 °C).',
      camara: { pos: [-600, 350, -300], mira: [0, 60, 800] } },
    { valor: -264.6, romper: true, texto: 'El acero se vuelve frágil como el cristal. Los edificios se hacen añicos.',
      camara: { pos: [-300, 170, 100], mira: [0, 30, 700] } },
    { valor: -268.9, texto: 'El helio se vuelve líquido (−269 °C). Ya no queda nada que no sea sólido.',
      camara: { pos: [-900, 600, -500], mira: [0, 0, 900] } },
    { valor: -271.0, texto: 'Más frío que el espacio vacío (−270,4 °C, el eco del Big Bang).',
      camara: { pos: [-1600, 1400, -1000], mira: [0, 0, 1000] } },
    { valor: -272.1, texto: 'Los átomos casi no se mueven. Cada fase quita la mitad del calor que quedaba.',
      camara: { pos: [-4000, 4000, -3000], mira: [0, 0, 1200] } },
    { valor: -272.6, planeta: true, texto: 'Puedes partir el frío por la mitad para siempre: el cero absoluto (−273,15 °C) nunca se alcanza.',
      camara: { pos: [0, 1.5e6, 1.8e7], mira: [0, -6.371e6, 0] } },
  ],
  cierre: { titulo: 'Todo congelado.', pregunta: '¿Qué duplicamos ahora? 👇' },
};
