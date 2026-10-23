// El calor que se duplica: de una ola de calor a casi la superficie del Sol (5.500 °C).
// TNT: energía para calentar 1 km³ de aire desde 15 °C. Cifras aproximadas: compruébalas antes de publicar.
window.ESCENARIOS.calor = {
  id: 'calor',
  tipo: 'calor',
  titulo: 'El calor que se duplica',
  pregunta: '¿Qué pasaría si el calor se duplicara cada vez?',
  unidad: '°C',
  inicial: 40,
  multiplicador: 2,
  // planeta: la cámara sale al espacio y se ve la Tierra incandescente.
  fases: [
    { texto: 'Ola de calor. El asfalto quema y todo el mundo busca la sombra.',
      camara: { pos: [2, 5, 160], mira: [0, 14, 520] } },
    { texto: 'Más que el récord de la Tierra (56,7 °C en el Valle de la Muerte). Los árboles se secan.',
      camara: { pos: [-20, 26, 120], mira: [0, 10, 500] } },
    { texto: 'El agua del mar hierve en la orilla (100 °C). Nadie aguanta en la calle.',
      camara: { pos: [-200, 60, -120], mira: [0, 0, 160] } },
    { texto: 'Arden la madera, el papel y los árboles (unos 250-300 °C). La ciudad entera en llamas.',
      camara: { pos: [-350, 220, -250], mira: [0, 10, 600] } },
    { texto: 'Casi como para fundir el aluminio (660 °C). Los coches se deforman y el cristal se ablanda.',
      camara: { pos: [-60, 40, 260], mira: [0, 3, 430] } },
    { texto: 'El hormigón revienta y el vidrio se derrite. Los edificios se desploman.',
      camara: { pos: [-600, 450, -300], mira: [0, 20, 800] } },
    { texto: 'Se funden el acero (1.500 °C) y la roca (unos 1.200 °C). El suelo es lava y el mar se ha evaporado.',
      camara: { pos: [-1500, 1200, -900], mira: [0, 0, 900] } },
    { planeta: true, texto: 'Casi como la superficie del Sol (5.500 °C). La Tierra brilla como una brasa.',
      camara: { pos: [0, 1.5e6, 1.8e7], mira: [0, -6.371e6, 0] } },
  ],
  cierre: { titulo: 'No queda nada.', pregunta: '¿Qué duplicamos ahora? 👇' },
};
