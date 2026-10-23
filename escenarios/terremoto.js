// Terremoto cada vez más fuerte. Cada punto de magnitud libera unas 32 veces más energía.
// Energía: E = 10^(1,5·M + 4,8) J (relación de Gutenberg-Richter). Cifras aproximadas: compruébalas antes de publicar.
window.ESCENARIOS = window.ESCENARIOS || {};
window.ESCENARIOS.terremoto = {
  id: 'terremoto',
  tipo: 'terremoto',
  titulo: 'El terremoto que no para de crecer',
  pregunta: '¿Qué pasaría si un terremoto fuera cada vez más fuerte?',
  // valor: magnitud de cada fase. duracion: segundos que tiembla.
  // sima: se abre una grieta enorme en la ciudad. planeta: la cámara sale al espacio y la Tierra se parte.
  // camara: posición y punto al que mira [x, y, z]. El mar está en z negativo y la ciudad en z positivo.
  fases: [
    { valor: 3, duracion: 3.5, texto: 'Apenas se nota: tiemblan las lámparas y los vasos. Hay más de 100.000 así cada año.',
      camara: { pos: [-2, 3.5, 570], mira: [0, 24, 300] } },
    { valor: 4, duracion: 4, texto: 'Vibran las ventanas y se caen cosas de las estanterías. Libera 32 veces más energía que el anterior.',
      camara: { pos: [-6, 9, 600], mira: [0, 22, 320] } },
    { valor: 5, duracion: 4.5, texto: 'Se agrietan las paredes y caen cristales. Las casas antiguas empiezan a ceder.',
      camara: { pos: [0, 28, 40], mira: [0, 18, 420] } },
    { valor: 6, duracion: 5, texto: 'La misma energía que la bomba de Hiroshima. Se hunden las casas bajas.',
      camara: { pos: [-230, 170, -160], mira: [0, 10, 520] } },
    { valor: 7, duracion: 5.5, texto: 'Como el terremoto de Haití en 2010. Caen los edificios de pisos.',
      camara: { pos: [-520, 300, 1950], mira: [0, 10, 850] } },
    { valor: 8, duracion: 6, texto: 'El suelo se agrieta. Los rascacielos se balancean metros de lado a lado y empiezan a caer.',
      camara: { pos: [-900, 650, 2700], mira: [0, 30, 1000] } },
    { valor: 9, duracion: 6.5, texto: 'Como Japón en 2011. Se ven ondas en el suelo, como olas en el agua.',
      camara: { pos: [-1500, 1000, 3500], mira: [0, 40, 1300] } },
    { valor: 9.5, duracion: 7, texto: 'El más fuerte jamás medido: Chile, 1960. No queda nada en pie.',
      camara: { pos: [-2100, 1600, 4400], mira: [0, 0, 1400] } },
    { valor: 12.5, duracion: 7, sima: true, texto: 'Ya es ficción: tanta energía como el asteroide que acabó con los dinosaurios. La tierra se abre en dos.',
      camara: { pos: [-2600, 4200, 5200], mira: [0, 0, 1300] } },
    { valor: 18.4, duracion: 8, planeta: true, texto: 'Magnitud 18: la energía que mantiene unida la Tierra. El planeta se parte.',
      camara: { pos: [0, 1.5e6, 1.8e7], mira: [0, -6.371e6, 0] } },
  ],
  marcas: [
    { texto: 'Torre Eiffel · 330 m', pos: [-120, 350, 1280], fases: [6, 7] },
    { texto: 'Burj Khalifa · 828 m', pos: [300, 850, 1640], fases: [6, 7, 8] },
  ],
  cierre: { titulo: 'No queda nada.', pregunta: '¿Qué duplicamos ahora? 👇' },
};
