// La altura que se duplica: una persona promedio (1,75 m, en la pregunta) que duplica su altura en cada fase hasta medir
// más que la Luna de ancho (3.475 km). Fases 1 a 11: 3,5 m → 3.584 m. Fase 12: no se duplica, se multiplica por 1.024
// (diez duplicaciones de golpe, como el golpe final del puñetazo) → 3.670 km. Unos 130 s con la narración.
//
// Lo que enseña (ley cuadrado-cubo; Galileo la explicó con los huesos de los gigantes en sus «Dos nuevas ciencias», 1638): con el doble de altura pesas 8 veces más (volumen), pero huesos,
// tendones y músculos solo son 4 veces más gruesos (sección). Cada duplicación, todo lo que te sostiene soporta el DOBLE
// de presión. Por eso no existen los gigantes, una hormiga carga muchas veces su peso y un elefante no salta.
// En la fase 3 ya estarías muerto: desde ahí el narrador «supone» mejoras (huesos de acero, corazón más fuerte que el
// de una jirafa, diamante y, al final, estrella de neutrones), y cada fase cuenta qué haría falta.
//
// Cifras de partida (orden de magnitud, varían entre personas). Persona de 1,75 m y 70 kg, misma densidad y proporciones:
//  - fémur: ~3,8 cm² de hueso cortical; de pie carga ~1 peso corporal → ~1,8 MPa; al andar, con la flexión, ~25 MPa.
//    El hueso cortical rompe a ~190 MPa. Andando: 25 × 2ⁿ > 190 en n = 3 (14 m). Quieto: 1,8 × 2ⁿ > 190 en n = 7 (224 m).
//  - tendón de Aquiles: ~30 MPa al andar, rompe a ~100 MPa → falla andando en n = 2 (7 m).
//  - músculo: su fuerza crece ×4 y tu peso ×8: cada duplicación, la mitad de fuerza para lo que pesas (n = 4: 16 veces menos).
//  - sangre: columna corazón-cabeza 0,35 m → 27 mmHg; ×2 cada vez. n = 2: 108 mmHg (como un piloto a 4 g: visión gris);
//    n = 3: 216 mmHg (desmayo; la jirafa va a ~200-300 mmHg); n = 5: 864 mmHg, más de una atmósfera;
//    n = 8: ~6.900 mmHg ≈ 9 atmósferas, la presión a 90 m bajo el agua.
//  - pies: ~20 kPa de pie × 2ⁿ. n = 5: 640 kPa, más de lo que aguanta el suelo bajo una zapata ancha (100-600 kPa).
//    n = 11: 41 MPa, más que el hormigón (~30 MPa).
//  - andar: una pierna es un péndulo: el paso dura ~1 s × √(2ⁿ). n = 6: 8 s por paso, a ~40 km/h.
//    Caerse de tu altura (una barra que cae): la cabeza llega a √(3·g·h); n = 6 → 57 m/s ≈ caer desde 166 m (50 pisos).
//  - huesos de acero (el mejor, ~2 GPa; el de construcción, ~355 MPa): andando (25 MPa × 2ⁿ) aguanta hasta n = 6;
//    quieto (1,8 MPa × 2ⁿ), el de construcción hasta n = 7 y el mejor hasta n = 10, justo al límite (1.843 MPa).
//    El acero no se rompe de golpe: cede y se dobla (los planos de átomos de hierro se deslizan).
//  - diamante (~100 GPa, el dato más incierto): andando hasta n = 11 (51 GPa), quieto hasta n = 15. Con la altura de la
//    Luna (n = 21, gravedad media sobre el cuerpo × 0,63): ~2.400 GPa, 20-25 veces el diamante. Ningún material hecho de
//    átomos llega; solo la corteza de una estrella de neutrones (~10¹⁰ veces más resistente que el acero).
//  - nervios: el tacto viaja a ~60-70 m/s. n = 11 (3.584 m): del pie al cerebro, casi un minuto.
//  - n = 21: 3.670 km, 6,5·10²⁰ kg (≈ 70 % de Ceres, 9,4·10²⁰ kg).
// Cifras aproximadas: compruébalas antes de publicar.
window.ESCENARIOS = window.ESCENARIOS || {};
(() => {
  // planos y efectos: [cuándo, nombre, opciones]. «cuándo» son segundos desde el principio de la fase o T('@palabra', '@word'):
  // el momento en que el narrador dice esa palabra (con la duración real de la frase si ya está cargada); o.d lo adelanta o retrasa.
  // cuerpo: qué le pasa al cuerpo (línea de daños); material: de qué son los huesos en esa fase.
  const RETRASO = 1.3; // el narrador entra cuando ha acabado de crecer
  const P = (sub, texto, cuerpo, material, planos, extra = {}) => ({ sub, texto, cuerpo, material, planos, cielo: 0x9fd3f0,
    dur: (extra.vozRetraso ?? RETRASO) + texto.length / 16 + .7, ...extra });
  window.ESCENARIOS.altura = {
    id: 'altura',
    tipo: 'altura',
    titulo: T('La altura que se duplica', 'The doubling height'),
    pregunta: T('Eres una persona promedio. ¿Y si tu altura se duplicara?', 'You are an average person. What if your height doubled?'),
    unidad: 'm',
    inicial: 3.5,   // fase 1 = el doble de una persona promedio (1,75 m)
    multiplicador: 2,
    ritmo: 3, introDur: 3, vozRetraso: RETRASO, pausa: .5,
    paso: T('FASE', 'STAGE'),
    lema: T('EL DOBLE DE ALTO CADA VEZ', 'TWICE AS TALL EVERY TIME'),
    sonido: { camas: { ciudad: .45, dron: .12 }, extra: ['whoosh', 'riser', 'impacto', 'cristales', 'derrumbe', 'terremoto', 'espacio'] },
    fases: [
      P(T('EL DOBLE', 'DOUBLE'),
        T('El doble de alto pesa ocho veces más: como un caballo. Pero tus huesos solo son cuatro veces más gruesos. Galileo lo vio en 1638: cada hueso carga el doble.',
          'Twice as tall weighs eight times more: a horse. But your bones are only four times thicker. Galileo saw it in 1638: each bone carries twice the load.'),
        T('Cada hueso carga el doble', 'Every bone carries twice the load'), T('Hueso', 'Bone'),
        [[0, 'crece'], [2.4, 'pov'], [T('@huesos', '@bones'), 'rayos', { parte: 'pierna', tinte: 'carga', etiqueta: T('FÉMUR · EL DOBLE DE PRESIÓN', 'FEMUR · TWICE THE PRESSURE'), d: -.3 }]],
        { anda: 1 }),
      P(T('UN ELEFANTE EN LOS TOBILLOS', 'AN ELEPHANT ON YOUR ANKLES'),
        T('Siete metros, cuatro toneladas y media. Al andar se rompe el tendón de Aquiles. Y lo ves todo gris: el corazón no sube la sangre tan alto.',
          'Seven metres, four and a half tonnes. Walking snaps your Achilles tendon. And everything goes grey: your heart can\'t pump blood that high.'),
        T('Tendón de Aquiles roto · visión gris', 'Achilles tendon snapped · greyed-out vision'), T('Hueso', 'Bone'),
        [[0, 'crece'], [2.2, 'calle'], [T('@andar', '@Walking'), 'rayos', { parte: 'tobillo', rompe: 'aquiles', en: 1.1, etiqueta: T('TENDÓN DE AQUILES', 'ACHILLES TENDON') }],
          [T('@gris', '@grey'), 'rayos', { parte: 'pecho', sangre: true, etiqueta: T('LA SANGRE NO LLEGA ARRIBA', 'BLOOD CAN\'T REACH THE TOP') }]],
        { anda: .5, efectos: [[T('@gris', '@grey'), 'gris', { d: .3 }]] }),
      P(T('AQUÍ MORIRÍAS', 'YOU\'D DIE HERE'),
        T('Catorce metros. Al primer paso se te parte el fémur y te desmayas. Aquí morirías. Pero hagamos como los matemáticos: supongamos huesos de acero y un corazón más fuerte que el de una jirafa.',
          'Fourteen metres. Your femur snaps on the first step and you pass out. You\'d die here. But let\'s do what mathematicians do: suppose steel bones and a heart stronger than a giraffe\'s.'),
        T('Supón: huesos de acero y corazón de jirafa', 'Suppose: steel bones and a giraffe heart'), T('Acero', 'Steel'),
        [[0, 'crece'], [1.8, 'pies'], [T('@fémur', '@femur'), 'rayos', { parte: 'pierna', rompe: 'femur', en: 1, etiqueta: T('FÉMUR', 'FEMUR'), d: -1 }],
          [T('@desmayas', '@pass out'), 'lado'], [T('@supongamos', '@suppose'), 'atomo', { tipo: 'acero', cara: 'feliz', antes: 'hueso', d: -.3 }],
          [T('@jirafa', '@giraffe'), 'rayos', { parte: 'pecho', latido: true, refuerza: true, d: -.9, etiqueta: T('CORAZÓN DE JIRAFA', 'GIRAFFE HEART') }]],
        { anda: 1, efectos: [[T('@desmayas', '@pass out'), 'desmayo'], [T('@supongamos', '@suppose'), 'levanta']] }),
      P(T('NI LEVANTAR UN BRAZO', 'CAN\'T EVEN LIFT AN ARM'),
        T('Veintiocho metros. Tus músculos tienen dieciséis veces menos fuerza para lo que pesas: no levantas ni un brazo. Por eso una hormiga carga cincuenta veces su peso y un elefante no salta.',
          'Twenty-eight metres. Your muscles have sixteen times less strength for your weight: you can\'t even lift an arm. That\'s why an ant carries fifty times its weight and an elephant can\'t jump.'),
        T('Músculos 16 veces más débiles', 'Muscles 16 times weaker'), T('Acero', 'Steel'),
        [[0, 'crece'], [1.8, 'lado'], [T('@músculos', '@muscles'), 'rayos', { parte: 'brazo', musculo: true, etiqueta: T('MÚSCULOS · 16 VECES MÁS DÉBILES', 'MUSCLES · 16 TIMES WEAKER') }],
          [T('@brazo', '@arm'), 'calle'], [T('@hormiga', '@ant'), 'pov']],
        { anda: .4, efectos: [[T('@brazo', '@arm'), 'brazo', { d: -.6 }]] }),
      P(T('LA TORRE DE PISA', 'THE LEANING TOWER'),
        T('Cincuenta y seis metros, la Torre de Pisa. Tanto peso en tan poca superficie que el suelo cede. Y tu corazón empujaría con más de una atmósfera.',
          'Fifty-six metres, the Leaning Tower of Pisa. So much weight on so little area that the ground gives way. And your heart would push with more than one atmosphere.'),
        T('El suelo cede bajo tus pies', 'The ground gives way under your feet'), T('Acero', 'Steel'),
        [[0, 'crece'], [1.8, 'compara', { lm: 'pisa' }], [T('@superficie', '@area'), 'pies'],
          [T('@corazón', '@heart'), 'rayos', { parte: 'pecho', latido: true, etiqueta: T('CORAZÓN · MÁS DE 1 ATMÓSFERA', 'HEART · OVER 1 ATMOSPHERE') }]],
        { anda: .6, efectos: [[T('@cede', '@gives'), 'hunde']] }),
      P(T('CÁMARA LENTA', 'SLOW MOTION'),
        T('Ciento doce metros. Cada paso dura ocho segundos: una pierna larga se balancea despacio, como un péndulo. Tropezar sería como tirarte de un piso cincuenta.',
          'A hundred and twelve metres. Each step takes eight seconds: a long leg swings slowly, like a pendulum. Tripping would be like jumping off a fiftieth floor.'),
        T('Una caída: a 200 km/h', 'One fall: at 200 km/h'), T('Acero', 'Steel'),
        [[0, 'crece'], [1.8, 'pies'], [T('@péndulo', '@pendulum'), 'lado'], [T('@Tropezar', '@Tripping'), 'lado', { v: 1 }]],
        { anda: 1, efectos: [[T('@Tropezar', '@Tripping'), 'tropiezo']] }),
      P(T('NI UN PASO MÁS', 'NOT ONE MORE STEP'),
        T('Doscientos veinticuatro metros. Ya no puedes dar ni un paso: tu fémur de acero se doblaría. El acero no se rompe de golpe: cede y se dobla.',
          'Two hundred and twenty-four metres. You can\'t take a single step: your steel femur would bend. Steel doesn\'t snap: it gives and bends.'),
        T('Andando, el acero se dobla', 'Walking, steel bends'), T('Acero', 'Steel'),
        [[0, 'crece'], [1.8, 'lado'], [T('@fémur', '@femur'), 'rayos', { parte: 'pierna', dobla: true, etiqueta: T('FÉMUR DE ACERO', 'STEEL FEMUR'), d: -.4 }],
          [T('@no se rompe', '@doesn\'t snap'), 'atomo', { tipo: 'acero', cara: 'suda', desliza: true }]],
        { anda: .3, efectos: [[T('@paso', '@step'), 'para']] }),
      P(T('EL EMPIRE STATE', 'THE EMPIRE STATE'),
        T('Cuatrocientos cuarenta y ocho metros, el Empire State. Para subir la sangre al cerebro, tu corazón empujaría como el agua a noventa metros de profundidad.',
          'Four hundred and forty-eight metres, the Empire State. To get blood up to your brain, your heart would push like water ninety metres down.'),
        T('Corazón a 9 atmósferas', 'Heart at 9 atmospheres'), T('Acero', 'Steel'),
        [[0, 'crece'], [1.8, 'compara', { lm: 'empire' }], [T('@sangre', '@blood'), 'rayos', { parte: 'pecho', latido: true, sangre: true, etiqueta: T('CORAZÓN · 9 ATMÓSFERAS', 'HEART · 9 ATMOSPHERES') }]]),
      P(T('MÁS QUE EL BURJ KHALIFA', 'TALLER THAN THE BURJ KHALIFA'),
        T('Casi novecientos metros, más que el Burj Khalifa. El acero de los edificios ya no aguantaría tu peso. Solo el acero más duro que existe.',
          'Almost nine hundred metres, taller than the Burj Khalifa. Building steel couldn\'t take your weight any more. Only the hardest steel there is.'),
        T('Fémur a 920 MPa', 'Femur at 920 MPa'), T('El mejor acero', 'The best steel'),
        [[0, 'crece'], [1.8, 'compara', { lm: 'burj' }], [T('@acero de', '@Building'), 'atomo', { tipo: 'acero', cara: 'suda' }], [T('@más duro', '@hardest'), 'aereo']]),
      P(T('LA CABEZA EN LAS NUBES', 'HEAD IN THE CLOUDS'),
        T('Casi dos kilómetros: la cabeza en las nubes. El mejor acero ya está al límite. Así que supongamos huesos de diamante, lo más duro de la naturaleza.',
          'Almost two kilometres: head in the clouds. The best steel is at its limit. So let\'s suppose diamond bones, the hardest thing in nature.'),
        T('Supón: huesos de diamante', 'Suppose: diamond bones'), T('Diamante', 'Diamond'),
        [[0, 'crece'], [1.8, 'nubes'], [T('@límite', '@limit'), 'rayos', { parte: 'pierna', tinte: 'carga', etiqueta: T('FÉMUR · 1.800 MPa', 'FEMUR · 1,800 MPa'), d: -.8 }],
          [T('@diamante', '@diamond'), 'atomo', { tipo: 'diamante', cara: 'feliz', d: -.3 }]]),
      P(T('APLASTAS EL HORMIGÓN', 'CRUSHING CONCRETE'),
        T('Tres kilómetros y medio. Pisas tan fuerte que aplastas el hormigón. Y si alguien te pisa un pie, lo notas casi un minuto después: los nervios no van tan rápido.',
          'Three and a half kilometres. You step so hard you crush concrete. And if someone treads on your foot, you feel it almost a minute later: nerves aren\'t that fast.'),
        T('Pies a 41 MPa · señal nerviosa: 51 s', 'Feet at 41 MPa · nerve signal: 51 s'), T('Diamante', 'Diamond'),
        [[0, 'crece'], [1.8, 'lado'], [T('@aplastas', '@crush'), 'pies', { d: -.5 }], [T('@pisa un', '@treads'), 'nervio']],
        { efectos: [[T('@aplastas', '@crush'), 'pisoton', { d: -.3 }], [T('@pisa un', '@treads'), 'nervio']] }),
      // la última no se duplica: diez duplicaciones de golpe (× 1.024) → 3.670 km, más que el diámetro de la Luna (3.475 km)
      P(T('COMO LA LUNA', 'AS BIG AS THE MOON'),
        T('Y ahora, de golpe, mil veces más: mides más que la Luna de ancho. Ni el diamante aguanta: harían falta huesos de estrella de neutrones. Protágoras decía que el hombre es la medida de todas las cosas. La física le da la razón: el peso crece más rápido que la fuerza.',
          'And now, all at once, a thousand times more: you\'re taller than the Moon is wide. Not even diamond holds: you\'d need neutron star bones. Protagoras said man is the measure of all things. Physics agrees: weight grows faster than strength.'),
        T('Ningún material hecho de átomos aguanta', 'No material made of atoms can hold'), T('Estrella de neutrones', 'Neutron star'),
        [[0, 'despega'], [T('@Luna', '@Moon'), 'espacio', { d: -.5 }], [T('@diamante', '@diamond'), 'atomo', { tipo: 'diamante', cara: 'rota', rompe: .9 }],
          [T('@neutrones', '@neutron'), 'atomo', { tipo: 'neutron', cara: 'chulo', d: -.6 }], [T('@La física', '@Physics'), 'espacio', { v: 1 }]],
        { valor: 1.75 * 2 ** 21, crecer: 4.5, vozRetraso: .4, sfx: [['riser', .5, 0]], camas: { ciudad: 0, espacio: .35 }, lema: T('¡MIL VECES MÁS, DE GOLPE!', 'A THOUSAND TIMES MORE, AT ONCE!') }),
    ],
    cierre: { titulo: T('Por eso no existen los gigantes.', 'That\'s why giants don\'t exist.'), pregunta: T('¿Qué duplicamos ahora? 👇', 'What should we double next? 👇') },
  };
})();
