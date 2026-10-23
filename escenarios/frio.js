// El frío que se duplica: en cada fase la temperatura absoluta (kelvin) baja a la mitad, desde 0 °C (273,15 K).
// TNT: energía que hay que quitarle a 1 km³ de aire desde 15 °C. Cifras aproximadas: compruébalas antes de publicar.
window.ESCENARIOS.frio = {
  id: 'frio',
  tipo: 'frio',
  titulo: T('El frío que se duplica', 'The doubling cold'),
  pregunta: T('¿Qué pasaría si el frío se duplicara cada vez?', 'What if the cold doubled every time?'),
  unidad: '°C',
  // valor: temperatura en °C de cada fase (273,15 K dividido entre 2 cada vez).
  // romper: los edificios se hacen añicos. planeta: la cámara sale al espacio y se ve la Tierra congelada.
  fases: [
    { valor: 0, texto: T('El agua se congela: hielo en las aceras y escarcha en los coches.', 'Water freezes: ice on the pavements and frost on the cars.'),
      camara: { pos: [2, 5, 160], mira: [0, 14, 520] } },
    { valor: -136.6, texto: T('Mucho más que el récord de la Tierra (−89 °C en la Antártida). El mar se congela y respirar este aire quema los pulmones.', 'Far colder than Earth\'s record (−89 °C in Antarctica). The sea freezes and breathing this air burns your lungs.'),
      camara: { pos: [-200, 60, -120], mira: [0, 0, 160] } },
    { valor: -204.9, texto: T('El aire se vuelve líquido: el oxígeno a −183 °C y el nitrógeno a −196 °C. Llueve aire.', 'The air turns liquid: oxygen at −183 °C and nitrogen at −196 °C. It rains air.'),
      camara: { pos: [-20, 20, 140], mira: [0, 6, 450] } },
    { valor: -238.9, texto: T('El nitrógeno se congela (−210 °C). Toda la atmósfera es ahora una capa de nieve de unos 10 m.', 'Nitrogen freezes (−210 °C). The whole atmosphere is now a layer of snow about 10 m deep.'),
      camara: { pos: [-350, 200, -250], mira: [0, 10, 600] } },
    { valor: -256.1, texto: T('Sin aire, el cielo es negro en pleno día. Hasta el hidrógeno sería líquido (−253 °C).', 'With no air, the sky is black in broad daylight. Even hydrogen would be liquid (−253 °C).'),
      camara: { pos: [-600, 350, -300], mira: [0, 60, 800] } },
    { valor: -264.6, romper: true, texto: T('El acero se vuelve frágil como el cristal. Los edificios se hacen añicos.', 'Steel becomes as brittle as glass. Buildings shatter.'),
      camara: { pos: [-300, 170, 100], mira: [0, 30, 700] } },
    { valor: -268.9, texto: T('El helio se vuelve líquido (−269 °C). Ya no queda nada que no sea sólido.', 'Helium turns liquid (−269 °C). Nothing is left that is not solid.'),
      camara: { pos: [-900, 600, -500], mira: [0, 0, 900] } },
    { valor: -271.0, texto: T('Más frío que el espacio vacío (−270,4 °C, el eco del Big Bang).', 'Colder than empty space (−270.4 °C, the echo of the Big Bang).'),
      camara: { pos: [-1600, 1400, -1000], mira: [0, 0, 1000] } },
    { valor: -272.1, texto: T('Los átomos casi no se mueven. Cada fase quita la mitad del calor que quedaba.', 'Atoms barely move. Each phase removes half of the heat that was left.'),
      camara: { pos: [-4000, 4000, -3000], mira: [0, 0, 1200] } },
    { valor: -272.6, planeta: true, texto: T('Puedes partir el frío por la mitad para siempre: el cero absoluto (−273,15 °C) nunca se alcanza.', 'You can halve the heat forever: absolute zero (−273.15 °C) is never reached.'),
      camara: { pos: [0, 1.5e6, 1.8e7], mira: [0, -6.371e6, 0] } },
  ],
  cierre: { titulo: T('Todo congelado.', 'Everything is frozen.'), pregunta: T('¿Qué duplicamos ahora? 👇', 'What should we double next? 👇') },
};
