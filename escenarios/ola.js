// Escenario: la ola que se duplica. Para crear un vídeo nuevo, copia un archivo de escenario,
// cambia los datos y añádelo a lista.js. Las cifras son aproximadas: compruébalas antes de publicar.
window.ESCENARIOS.ola = {
    id: 'ola',
    tipo: 'ola', // fenómeno que lo anima (fenomenos/ola.js)
    titulo: 'La ola que se duplica',
    pregunta: '¿Qué pasaría si una ola fuera cada vez el doble de grande?',
    unidad: 'm',
    inicial: 20,
    multiplicador: 2,
    // Energía potencial de una ola de 10 km de costa y 1 km de fondo: ½ · ρ · g · h² · área
    energia: { tipo: 'ola', costa_m: 10000, fondo_m: 1000 },
    // alcance: hasta dónde llega la ola tierra adentro (m). duracion: segundos que tarda.
    // asentar (opcional): cuánto baja el agua al pararse la ola (0 = nada, 0.4 por defecto).
    // camara: posición y punto al que mira [x, y, z]. El mar está en z negativo y la ciudad en z positivo.
    // Si la cámara está a pie de calle, retrocede sola para que la ola no se la trague.
    fases: [
      { texto: 'Revienta escaparates y arrastra coches. Con 60 cm de agua en movimiento un coche ya flota.',
        alcance: 430, duracion: 5, camara: { pos: [-4, 4.8, 150], mira: [0, 13, -150] } },
      { texto: 'Las casas bajas desaparecen. Es casi la altura máxima del tsunami de Japón en 2011.',
        alcance: 1150, duracion: 5, camara: { pos: [-70, 62, 930], mira: [0, 16, 250] } },
      { texto: 'Se traga la Torre de Pisa (56 m). Los cristales estallan: en la base hay 8 atmósferas de presión.',
        alcance: 2300, duracion: 5, camara: { pos: [750, 330, 3000], mira: [0, 30, 800] } },
      { texto: 'Más alta que el Big Ben (96 m), la noria (135 m) y la Gran Pirámide (139 m). Entra kilómetros tierra adentro.',
        alcance: 4200, duracion: 4.5, camara: { pos: [-1700, 900, 6200], mira: [0, 60, 1800] } },
      { texto: 'Llega casi a la punta de la Torre Eiffel (330 m). Ya no hay edificio donde refugiarse.',
        alcance: 7500, duracion: 4.5, camara: { pos: [-3600, 3000, 9800], mira: [0, 100, 2600] } },
      { texto: 'Cubre el Empire State (443 m) y la CN Tower (553 m). Solo asoma el Burj Khalifa (828 m).',
        alcance: 12500, duracion: 4, camara: { pos: [-6500, 6500, 17000], mira: [0, 200, 5000] } },
      { texto: 'Se traga el Burj Khalifa y cubre colinas y valles enteros.',
        alcance: 20000, duracion: 4, camara: { pos: [-9000, 13000, 30000], mira: [0, 0, 10000] } },
      { texto: 'La ciudad entera ha desaparecido. No queda ningún relieve urbano.',
        alcance: 32000, duracion: 3.5, camara: { pos: [-4000, 30000, 36000], mira: [0, 0, 14000] } },
      { texto: 'Más profunda que el océano medio (3.700 m). El agua avanza sobre el continente.',
        alcance: 50000, duracion: 3.5, camara: { pos: [0, 60000, 62000], mira: [0, 0, 26000] } },
      { texto: 'Pasa por encima del Everest (8.849 m). En la Tierra no hay agua para esto.',
        alcance: 80000, duracion: 3.5, asentar: 0, camara: { pos: [0, 140000, 95000], mira: [0, 0, 40000] } },
    ],
    // Etiquetas que aparecen en el mundo para entender la escala (fase = número de fase, desde 1)
    marcas: [
      { texto: 'Torre de Pisa · 56 m', pos: [-420, 66, 260], fases: [2, 3] },
      { texto: 'Estatua de la Libertad · 93 m', pos: [750, 105, -330], fases: [3] },
      { texto: 'Big Ben · 96 m', pos: [540, 108, 620], fases: [4] },
      { texto: 'Noria · 135 m', pos: [520, 148, 92], fases: [4] },
      { texto: 'Gran Pirámide · 139 m', pos: [1800, 152, 1000], fases: [4] },
      { texto: 'Torre Eiffel · 330 m', pos: [-120, 345, 1280], fases: [5] },
      { texto: 'Empire State · 443 m', pos: [660, 458, 1340], fases: [6] },
      { texto: 'CN Tower · 553 m', pos: [-780, 568, 1460], fases: [6] },
      { texto: 'Burj Khalifa · 828 m', pos: [360, 845, 1640], fases: [6, 7] },
      { texto: 'Montaña · 8.849 m', pos: [7000, 9300, 56000], fases: [8, 9, 10] },
    ],
    cierre: { titulo: 'No queda nada.', pregunta: '¿Qué duplicamos ahora? 👇' },
  };
