// La altura que se duplica: 12 fases, de 1,75 m a medir lo que la Luna de ancho (3.475 km).
// Fases 1 a 11: tu altura se duplica (1,75 m → 1.792 m). Fase 12: no se duplica, se multiplica por 2.048 (once duplicaciones
// de golpe, como el golpe final del puñetazo) → 3.670 km.
//
// Física (ley cuadrado-cubo, Galileo 1638): con el doble de altura pesas 8 veces más (volumen), pero huesos, tendones y
// músculos solo son 4 veces más gruesos (sección). Cada duplicación, todo lo que te sostiene soporta el DOBLE de presión:
// para tus huesos, crecer al doble es como vivir con el doble de gravedad.
// Persona de partida: 1,75 m y 70 kg, misma densidad y proporciones. Cifras de partida (orden de magnitud, varían entre personas):
//  - fémur: ~3,8 cm² de hueso cortical; de pie carga ~1 peso corporal → ~1,8 MPa; al andar, con la flexión, ~25 MPa.
//    El hueso cortical rompe a ~190 MPa (compresión). Andando: 25 × 2ⁿ > 190 en n = 3 (14 m). Quieto: 1,8 × 2ⁿ > 190 en n = 7 (224 m).
//  - tendón de Aquiles: ~30 MPa al andar, rompe a ~100 MPa → falla andando en n = 2 (7 m).
//  - músculo: su fuerza crece ×4 y tu peso ×8: cada duplicación tienes la mitad de fuerza para lo que pesas (n = 4: 16 veces menos).
//  - sangre: columna corazón-cabeza 0,35 m → 27 mmHg; ×2 cada vez. n = 2: 108 mmHg (lo que nota un piloto a 4 g: visión gris);
//    n = 3: 216 mmHg (desmayo; la jirafa, con ~2 m de cuello, va a ~200-300 mmHg); n = 5: 864 mmHg, más de una atmósfera;
//    n = 8: ~6.900 mmHg ≈ 9 atmósferas, la presión a 90 m bajo el agua.
//  - pies: ~20 kPa de pie × 2ⁿ. n = 5: 640 kPa, más de lo que aguanta el suelo bajo una zapata ancha (100-600 kPa).
//  - andar: el paso dura ~1 s × √(2ⁿ) y la velocidad 1,4 m/s × √(2ⁿ) (péndulo). n = 6: 8 s por paso, ~40 km/h.
//    Caerse de tu altura (una barra que cae): la cabeza llega a √(3·g·h); n = 6 → 57 m/s ≈ caer desde 166 m (50 pisos).
//  - material para aguantar de pie (fémur quieto ≈ 1,8 MPa × 2ⁿ; andando ≈ 25 MPa × 2ⁿ, en n = 10 ya pide diamante): acero de construcción (~355 MPa) hasta n = 7, el mejor acero
//    (~2 GPa) hasta n = 10, diamante (~100 GPa, el dato más incierto) hasta n = 15. En n = 16 (115 km, la cabeza en el espacio)
//    también se rompe. Con la altura de la Luna (n = 21, gravedad media sobre el cuerpo × 0,63): ~2.400 GPa, unas 20-25 veces
//    el diamante. Ningún material hecho de átomos llega (el límite teórico ronda E/10 y el mayor E es ~1.200 GPa); solo la corteza
//    de una estrella de neutrones (~10¹⁰ veces más resistente que el acero).
//  - n = 21: 3.670 km, 6,5·10²⁰ kg (≈ 70 % de Ceres, 9,4·10²⁰ kg). Gravedad en la cabeza 9,81 × (6.371/10.041)² ≈ 3,9 m/s².
// Cifras aproximadas: compruébalas antes de publicar.
//
// Falta el fenómeno (fenomenos/altura.js: el gigante en la ciudad), por eso todavía no está en lista.js.
window.ESCENARIOS = window.ESCENARIOS || {};
(() => {
  // cuerpo: qué le pasa al cuerpo (línea de daños); material: de qué tendrían que ser tus huesos para seguir de pie
  const P = (sub, texto, cuerpo, material, extra) => ({ sub, texto, cuerpo, material, ...extra });
  window.ESCENARIOS.altura = {
    id: 'altura',
    tipo: 'altura',
    titulo: T('La altura que se duplica', 'The doubling height'),
    pregunta: T('¿Y si tu altura se duplicara?', 'What if your height doubled?'),
    unidad: 'm',
    inicial: 1.75,
    multiplicador: 2,
    ritmo: 3, introDur: 2.6,
    paso: T('FASE', 'STAGE'),
    lema: T('EL DOBLE DE ALTO CADA VEZ', 'TWICE AS TALL EVERY TIME'),
    fases: [
      P(T('TÚ, NORMAL', 'YOU, NORMAL'),
        T('Uno setenta y cinco, setenta kilos. Al andar, tus huesos aguantan siete veces más de lo que les pides.',
          'Five foot nine, seventy kilos. When you walk, your bones can take seven times what you ask of them.'),
        T('Todo en orden', 'All fine'), T('Hueso', 'Bone')),
      P(T('EL DOBLE', 'DOUBLE'),
        T('Mides el doble, pero pesas ocho veces más: como un caballo. Y tus huesos solo son cuatro veces más gruesos.',
          'Twice as tall, but eight times heavier: a horse. And your bones are only four times thicker.'),
        T('Cada hueso soporta el doble de presión', 'Every bone takes twice the pressure'), T('Hueso', 'Bone')),
      P(T('UN ELEFANTE EN LOS TOBILLOS', 'AN ELEPHANT ON YOUR ANKLES'),
        T('Siete metros, cuatro toneladas y media. Al andar se rompe el tendón de Aquiles. Y lo ves todo gris: la sangre no te llega a la cabeza.',
          'Seven metres, four and a half tonnes. Walking snaps your Achilles tendon. And everything goes grey: blood can\'t reach your head.'),
        T('Tendón de Aquiles roto · visión gris', 'Achilles tendon snapped · greyed-out vision'), T('Hueso', 'Bone')),
      P(T('PRIMER PASO, FÉMUR ROTO', 'FIRST STEP, BROKEN FEMUR'),
        T('Catorce metros. En el primer paso se te parte el fémur. Y te desmayas: necesitarías un corazón con más presión que el de una jirafa.',
          'Fourteen metres. Your femur snaps on the first step. And you pass out: you would need a heart with more pressure than a giraffe\'s.'),
        T('Fémur roto al andar · desmayo', 'Femur broken walking · fainted'), T('Hueso', 'Bone')),
      P(T('NI LEVANTAR UN BRAZO', 'CAN\'T EVEN LIFT AN ARM'),
        T('Veintiocho metros, como una ballena azul de pie. Tus músculos tienen dieciséis veces menos fuerza para lo que pesas: ni levantas un brazo.',
          'Twenty-eight metres, a blue whale standing up. Your muscles have sixteen times less strength for your weight: you can\'t even lift an arm.'),
        T('Para aguantar: piernas cuatro veces más gruesas', 'To hold up: legs four times thicker'), T('Hueso', 'Bone')),
      P(T('LA TORRE DE PISA', 'THE LEANING TOWER'),
        T('Cincuenta y seis metros, la Torre de Pisa. El suelo ya no aguanta tus pies. Y tu corazón tendría que empujar con más de una atmósfera.',
          'Fifty-six metres, the Leaning Tower of Pisa. The ground can\'t hold your feet. And your heart would need to push with more than one atmosphere.'),
        T('El suelo cede bajo tus pies', 'The ground gives way under your feet'), T('Hueso', 'Bone')),
      P(T('CÁMARA LENTA', 'SLOW MOTION'),
        T('Ciento doce metros. Cada paso dura ocho segundos, pero vas a cuarenta por hora. Tropezar sería como tirarte de un piso cincuenta.',
          'A hundred and twelve metres. Each step takes eight seconds, but you move at forty an hour. Tripping would be like jumping off a fiftieth floor.'),
        T('Una caída: como desde un rascacielos', 'One fall: like dropping off a skyscraper'), T('Hueso', 'Bone')),
      P(T('ROTO SIN MOVERTE', 'BROKEN STANDING STILL'),
        T('Doscientos veinticuatro metros. Ahora el fémur se rompe aunque estés quieto. Para seguir de pie, tus huesos tendrían que ser de acero.',
          'Two hundred and twenty-four metres. Now your femur breaks even standing still. To stay up, your bones would have to be steel.'),
        T('Fémur roto estando quieto', 'Femur broken standing still'), T('Acero', 'Steel')),
      P(T('EL EMPIRE STATE', 'THE EMPIRE STATE'),
        T('Cuatrocientos cuarenta y ocho metros, como el Empire State. Para regarte el cerebro, tu corazón empujaría como el agua a noventa metros de profundidad.',
          'Four hundred and forty-eight metres, the Empire State. To reach your brain, your heart would push like water ninety metres down.'),
        T('Corazón a 9 atmósferas', 'Heart at 9 atmospheres'), T('Acero', 'Steel')),
      P(T('MÁS QUE EL BURJ KHALIFA', 'TALLER THAN THE BURJ KHALIFA'),
        T('Casi novecientos metros. Más que el Burj Khalifa. El acero de los edificios ya no aguanta tu peso: solo el más duro que existe.',
          'Almost nine hundred metres. Taller than the Burj Khalifa. Building steel can\'t take your weight any more: only the hardest there is.'),
        T('Fémur a 920 MPa, cinco veces su límite', 'Femur at 920 MPa, five times its limit'), T('El mejor acero', 'The best steel')),
      P(T('LA CABEZA EN LAS NUBES', 'HEAD IN THE CLOUDS'),
        T('Casi dos kilómetros. La cabeza en las nubes. Quieto, el mejor acero va justo al límite. Para dar un paso, tus huesos tendrían que ser de diamante.',
          'Almost two kilometres. Head in the clouds. Standing still, the best steel is at its limit. To take a step, your bones would have to be diamond.'),
        T('Fémur a 1.800 MPa quieto · 25.000 al andar', 'Femur at 1,800 MPa still · 25,000 walking'), T('Diamante', 'Diamond')),
      // la última no se duplica: once duplicaciones de golpe (× 2.048) → 3.670 km, más que el diámetro de la Luna (3.475 km)
      P(T('COMO LA LUNA', 'AS BIG AS THE MOON'),
        T('La última no se duplica: se multiplica por dos mil. Tres mil seiscientos kilómetros: mides más que la Luna de ancho. Pesas casi como un planeta enano. Ni el diamante aguanta: solo unos huesos de estrella de neutrones.',
          'The last one does not double: it goes two thousand times bigger. Three thousand six hundred kilometres: taller than the Moon is wide. You weigh almost as much as a dwarf planet. Not even diamond holds: only bones made of neutron star.'),
        T('Ningún material hecho de átomos aguanta', 'No material made of atoms can hold'), T('Estrella de neutrones', 'Neutron star'),
        { valor: 1.75 * 2 ** 21, dur: 9, lema: T('¡DOS MIL VECES MÁS, DE GOLPE!', 'TWO THOUSAND TIMES MORE, AT ONCE!') }),
    ],
    cierre: { titulo: T('Ni el diamante aguanta.', 'Not even diamond holds.'), pregunta: T('¿Qué duplicamos ahora? 👇', 'What should we double next? 👇') },
  };
})();
