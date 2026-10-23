// El calor que se duplica: de una ola de calor a casi la superficie del Sol (5.500 °C).
// TNT: energía para calentar 1 km³ de aire desde 15 °C. Cifras aproximadas: compruébalas antes de publicar.
window.ESCENARIOS.calor = {
  id: 'calor',
  tipo: 'calor',
  titulo: T('El calor que se duplica', 'The doubling heat'),
  pregunta: T('¿Qué pasaría si el calor se duplicara cada vez?', 'What if the heat doubled every time?'),
  unidad: '°C',
  inicial: 40,
  multiplicador: 2,
  // planeta: la cámara sale al espacio y se ve la Tierra incandescente.
  fases: [
    { texto: T('Ola de calor. El asfalto quema y todo el mundo busca la sombra.', 'Heatwave. The asphalt burns and everyone looks for shade.'),
      camara: { pos: [2, 5, 160], mira: [0, 14, 520] } },
    { texto: T('Más que el récord de la Tierra (56,7 °C en el Valle de la Muerte). Los árboles se secan.', 'Hotter than Earth\'s record (56.7 °C in Death Valley). The trees dry out.'),
      camara: { pos: [-20, 26, 120], mira: [0, 10, 500] } },
    { texto: T('El agua del mar hierve en la orilla (100 °C). Nadie aguanta en la calle.', 'Seawater boils at the shore (100 °C). No one can stay outside.'),
      camara: { pos: [-200, 60, -120], mira: [0, 0, 160] } },
    { texto: T('Arden la madera, el papel y los árboles (unos 250-300 °C). La ciudad entera en llamas.', 'Wood, paper and trees catch fire (around 250-300 °C). The whole city is in flames.'),
      camara: { pos: [-350, 220, -250], mira: [0, 10, 600] } },
    { texto: T('Casi como para fundir el aluminio (660 °C). Los coches se deforman y el cristal se ablanda.', 'Almost hot enough to melt aluminium (660 °C). Cars warp and glass softens.'),
      camara: { pos: [-60, 40, 260], mira: [0, 3, 430] } },
    { texto: T('El hormigón revienta y el vidrio se derrite. Los edificios se desploman.', 'Concrete bursts and glass melts. Buildings collapse.'),
      camara: { pos: [-600, 450, -300], mira: [0, 20, 800] } },
    { texto: T('Se funden el acero (1.500 °C) y la roca (unos 1.200 °C). El suelo es lava y el mar se ha evaporado.', 'Steel (1,500 °C) and rock (around 1,200 °C) melt. The ground is lava and the sea has boiled away.'),
      camara: { pos: [-1500, 1200, -900], mira: [0, 0, 900] } },
    { planeta: true, texto: T('Casi como la superficie del Sol (5.500 °C). La Tierra brilla como una brasa.', 'Almost as hot as the surface of the Sun (5,500 °C). The Earth glows like an ember.'),
      camara: { pos: [0, 1.5e6, 1.8e7], mira: [0, -6.371e6, 0] } },
  ],
  cierre: { titulo: T('No queda nada.', 'Nothing is left.'), pregunta: T('¿Qué duplicamos ahora? 👇', 'What should we double next? 👇') },
};
