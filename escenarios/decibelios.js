// Gritar BOMBOCLAT duplicando los decibelios. +10 dB = el oído lo nota el doble de fuerte; +3 dB = el doble de energía.
// Potencia del grito: 4π · 10^-12 · 10^(dB/10) W. Cifras aproximadas: compruébalas antes de publicar.
window.ESCENARIOS = window.ESCENARIOS || {};
window.ESCENARIOS.decibelios = {
  id: 'decibelios',
  tipo: 'decibelios',
  titulo: 'Gritar BOMBOCLAT cada vez más fuerte',
  pregunta: '¿Qué pasaría si gritaras BOMBOCLAT duplicando los decibelios?',
  unidad: 'dB',
  inicial: 15,
  multiplicador: 2,
  // planeta: la cámara sale al espacio y el grito revienta la Tierra.
  fases: [
    { texto: 'Un susurro. Solo lo oye quien está justo a tu lado.',
      camara: { pos: [1.3, 4.8, 524], mira: [0, 4.5, 520] } },
    { texto: 'Como una biblioteca en silencio. Nadie levanta la vista.',
      camara: { pos: [3.5, 5.6, 528], mira: [0, 4.4, 520] } },
    { texto: 'Una conversación normal. La gente de alrededor se gira a mirarte.',
      camara: { pos: [12, 11, 546], mira: [0, 4, 516] } },
    { texto: 'Como delante de los altavoces de un concierto. Duele: todo el mundo huye tapándose los oídos.',
      camara: { pos: [-38, 43, 630], mira: [0, 3, 505] } },
    { texto: 'Por encima de unos 194 dB el sonido se convierte en onda de choque: revienta ventanas a kilómetros y tumba edificios.',
      camara: { pos: [-900, 650, 1800], mira: [0, 0, 600] } },
    { planeta: true, texto: 'Más potencia que miles de millones de soles juntos. La Tierra no aguanta ni un instante.',
      camara: { pos: [0, 1.5e6, 1.8e7], mira: [0, -6.371e6, 0] } },
  ],
  cierre: { titulo: 'Ya nadie te oye.', pregunta: '¿Qué duplicamos ahora? 👇' },
};
