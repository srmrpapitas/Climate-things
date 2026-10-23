// El viento que se duplica: de una brisa a 2.560 km/h. Sopla de oeste a este (hacia x positivo).
// TNT: energía cinética de 1 km³ de aire a esa velocidad. Cifras aproximadas: compruébalas antes de publicar.
window.ESCENARIOS.viento = {
  id: 'viento',
  tipo: 'viento',
  titulo: 'El viento que se duplica',
  pregunta: '¿Qué pasaría si el viento soplara cada vez el doble de fuerte?',
  unidad: 'km/h',
  inicial: 20,
  multiplicador: 2,
  fases: [
    { texto: 'Una brisa agradable. Se mueven las hojas y las banderas.',
      camara: { pos: [-30, 4, 30], mira: [20, 3, 60] } },
    { texto: 'Viento fuerte: los paraguas se dan la vuelta y la arena de la playa vuela.',
      camara: { pos: [-40, 6, 20], mira: [20, 3, 55] } },
    { texto: 'Temporal: cuesta mantenerse de pie y se rompen las ramas.',
      camara: { pos: [-25, 9, 120], mira: [10, 4, 250] } },
    { texto: 'Huracán de categoría 2. Arranca árboles y lanza a la gente por los aires.',
      camara: { pos: [-60, 30, 60], mira: [30, 3, 260] } },
    { texto: 'Como el huracán más fuerte medido (Patricia, 2015: 345 km/h). Las casas y los coches salen volando.',
      camara: { pos: [-500, 220, -150], mira: [0, 10, 500] } },
    { texto: 'Más que cualquier viento medido en la Tierra (unos 480 km/h en un tornado). Caen los edificios de pisos.',
      camara: { pos: [-900, 450, -250], mira: [0, 20, 800] } },
    { texto: 'Más rápido que el sonido (1.235 km/h): cada ráfaga es una onda de choque. Caen los rascacielos.',
      camara: { pos: [-1400, 800, -400], mira: [0, 40, 900] } },
    { texto: 'Como el chorro de un avión de combate, pero en todo el planeta. Arranca hasta el suelo.',
      camara: { pos: [-2400, 1600, -900], mira: [0, 0, 1000] } },
  ],
  marcas: [
    { texto: 'Burj Khalifa · 828 m', pos: [300, 850, 1640], fases: [6, 7] },
  ],
  cierre: { titulo: 'No queda nada.', pregunta: '¿Qué duplicamos ahora? 👇' },
};
