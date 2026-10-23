// Gritar BOMBOCLAT duplicando los decibelios. +10 dB = el oído lo nota el doble de fuerte; +3 dB = el doble de energía.
// Potencia del grito: 4π · 10^-12 · 10^(dB/10) W. Cifras aproximadas: compruébalas antes de publicar.
window.ESCENARIOS = window.ESCENARIOS || {};
window.ESCENARIOS.decibelios = {
  id: 'decibelios',
  tipo: 'decibelios',
  titulo: T('Gritar BOMBOCLAT cada vez más fuerte', 'Shouting BOMBOCLAT louder and louder'),
  pregunta: T('¿Qué pasaría si gritaras BOMBOCLAT duplicando los decibelios?', 'What if you shouted BOMBOCLAT, doubling the decibels every time?'),
  unidad: 'dB',
  inicial: 15,
  multiplicador: 2,
  // planeta: la cámara sale al espacio y el grito revienta la Tierra.
  fases: [
    { texto: T('Un susurro. Solo lo oye quien está justo a tu lado.', 'A whisper. Only the person right next to you hears it.'),
      camara: { pos: [1.3, 4.8, 524], mira: [0, 4.5, 520] } },
    { texto: T('Como una biblioteca en silencio. Nadie levanta la vista.', 'Like a quiet library. Nobody looks up.'),
      camara: { pos: [3.5, 5.6, 528], mira: [0, 4.4, 520] } },
    { texto: T('Una conversación normal. La gente de alrededor se gira a mirarte.', 'A normal conversation. People around you turn to look.'),
      camara: { pos: [12, 11, 546], mira: [0, 4, 516] } },
    { texto: T('Como delante de los altavoces de un concierto. Duele: todo el mundo huye tapándose los oídos.', 'Like standing in front of the speakers at a concert. It hurts: everyone runs away covering their ears.'),
      camara: { pos: [-38, 43, 630], mira: [0, 3, 505] } },
    { texto: T('Por encima de unos 194 dB el sonido se convierte en onda de choque: revienta ventanas a kilómetros y tumba edificios.', 'Above about 194 dB sound becomes a shockwave: it blows out windows kilometres away and knocks down buildings.'),
      camara: { pos: [-900, 650, 1800], mira: [0, 0, 600] } },
    { planeta: true, texto: T('Más potencia que miles de millones de soles juntos. La Tierra no aguanta ni un instante.', 'More power than billions of Suns combined. The Earth can\'t survive it for even an instant.'),
      camara: { pos: [0, 1.5e6, 1.8e7], mira: [0, -6.371e6, 0] } },
  ],
  cierre: { titulo: T('Ya nadie te oye.', 'No one can hear you now.'), pregunta: T('¿Qué duplicamos ahora? 👇', 'What should we double next? 👇') },
};
