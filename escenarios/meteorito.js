// El meteorito que se duplica: de una estrella fugaz (1 m) al que acabó con los dinosaurios (unos 10 km).
// Cifras aproximadas: compruébalas antes de publicar.
window.ESCENARIOS = window.ESCENARIOS || {};
(() => {
  const C = (pos, mira) => ({ pos, mira }), H = (pos, mira) => ({ pos, mira, cerca: true }), // H: sigue al protagonista (suelo a 3 m)
    P = (sub, texto, camara, extra) => ({ sub, texto, camara, ...extra });
  const ESP = [0, -6.371e6, 0], CIELO = [0, 150, 650]; // a dónde se mira: el cielo sobre el centro, donde cae
  // la cámara gira un poco alrededor del punto al que mira: con un punto lejano se movería decenas de metros y se metería
  // en los edificios, así que se mira a un punto a 40 m en la misma dirección
  const cerca = pos => { const d = CIELO.map((v, i) => v - pos[i]), l = Math.hypot(...d); return pos.map((v, i) => v + d[i] / l * 40); };
  const HC = pos => H(pos, cerca(pos));
  const CC = (pos, mira) => { const d = mira.map((v, i) => v - pos[i]), l = Math.hypot(...d); return C(pos, pos.map((v, i) => v + d[i] / l * 60)); }; // lo mismo con planos lejanos
  window.ESCENARIOS.meteorito = {
    id: 'meteorito',
    tipo: 'meteorito',
    titulo: T('El meteorito que se duplica', 'The doubling meteor'),
    pregunta: T('¿Y si cada meteorito fuera el doble de grande que el anterior?', 'What if every meteor was twice as big as the last?'),
    unidad: 'm',
    inicial: 1,
    multiplicador: 2,
    ritmo: 3.4, introDur: 2.8,
    paso: T('METEORITO', 'METEOR'),
    lema: T('EL DOBLE DE GRANDE CADA VEZ', 'TWICE AS BIG EVERY TIME'),
    intro: { pos: [.6, 6.2, 122], mira: [-1, 5.2, 130] },
    sonido: { camas: { dron: .3, ciudad: .5 }, paso: 'whoosh', pasoGan: .2 },
    fases: [
      P(T('UNA PIEDRA', 'A PEBBLE FROM SPACE'), T('Como 75 toneladas de TNT, pero a 50 km de altura. Pide un deseo.', 'Like 75 tonnes of TNT, but 50 km up. Make a wish.'), HC([1.2, 4.4, 123])),
      P(T('UNA LAVADORA', 'A WASHING MACHINE'), T('Seiscientas toneladas de TNT en el cielo. Pasa varias veces al año.', 'Six hundred tonnes of TNT in the sky. It happens a few times a year.'), HC([1.5, 4.7, 122])),
      P(T('UN COCHE', 'A CAR'), T('Un tercio de Hiroshima. El estruendo dispara las alarmas.', 'A third of a Hiroshima. The boom sets off car alarms.'), HC([2, 5.2, 121])),
      P(T('UN AUTOBÚS', 'A BUS'), T('Dos Hiroshimas y media. Llegan trozos al suelo.', 'Two and a half Hiroshimas. Pieces reach the ground.'), HC([2.5, 6, 119])),
      P(T('COMO EL DE CHELIÁBINSK', 'LIKE CHELYABINSK'), T('Veinte Hiroshimas, como Cheliábinsk en 2013. Mil quinientos heridos por cristales.', 'Twenty Hiroshimas, like Chelyabinsk in 2013. Fifteen hundred hurt by flying glass.'), CC([-24, 30, 60], [0, 60, 650]), { inserto: { pos: [-6, 3, 132], mira: [-16, 7, 121], t: 2, dur: 1.7, efecto: 'cristales' } }),
      P(T('COMO EL DE TUNGUSKA', 'LIKE TUNGUSKA'), T('Ciento sesenta Hiroshimas, un Tunguska pequeño. El centro, arrasado.', 'A hundred and sixty Hiroshimas, a small Tunguska. Downtown is flattened.'), CC([-80, 160, 40], [0, 0, 650])),
      P(T('UN ESTADIO', 'A STADIUM'), T('Veinte megatones. Un cráter de un kilómetro. Adiós al barrio.', 'Twenty megatons. A crater a kilometre wide. Bye bye, neighbourhood.'), CC([-300, 220, -400], [0, 0, 700]), { camas: { ciudad: 0, fuego: .4 } }),
      P(T('UN RASCACIELOS', 'A SKYSCRAPER'), T('Tres veces la bomba más grande de la historia. La ciudad, borrada.', 'Three times the biggest bomb ever built. The city is wiped out.'), CC([-900, 600, -900], [0, 0, 800])),
      P(T('UNA MONTAÑA PEQUEÑA', 'A SMALL MOUNTAIN'), T('Mil doscientos megatones. Fuego en cien kilómetros a la redonda.', 'Twelve hundred megatons. Fire for a hundred kilometres around.'), CC([-2400, 1500, -2000], [0, 0, 900])),
      P(T('MEDIO KILÓMETRO', 'HALF A KILOMETRE'), T('Diez gigatones. Un terremoto de magnitud 7 y un tsunami gigante.', 'Ten gigatons. A magnitude 7 earthquake and a giant tsunami.'), CC([-5000, 3000, -4000], [0, 0, 900]), { sfx: [['terremoto', .5, 1.6]] }),
      P(T('UN KILÓMETRO', 'ONE KILOMETRE'), T('Más que todas las bombas nucleares del mundo juntas. El polvo tapa el Sol.', 'More than every nuclear bomb on Earth combined. Dust blocks out the Sun.'), C([0, 9e6, 1.5e7], ESP), { inserto: { pos: [-80, 70, 60], mira: [0, 0, 420], t: 2.5, dur: 2, efecto: 'polvo' }, planeta: true, camas: { fuego: 0, espacio: .3 } }),
      P(T('DOS KILÓMETROS', 'TWO KILOMETRES'), T('Seiscientos gigatones. Llueve roca fundida sobre medio planeta.', 'Six hundred gigatons. Molten rock rains down on half the planet.'), C([0, 9e6, 1.5e7], ESP), { inserto: { pos: [-90, 80, 40], mira: [0, 0, 400], t: 2.5, dur: 2, efecto: 'lluvia' }, planeta: true }),
      P(T('CUATRO KILÓMETROS', 'FOUR KILOMETRES'), T('Cinco mil gigatones. El cielo arde y se queman los bosques del mundo.', 'Five thousand gigatons. The sky burns and the world\'s forests catch fire.'), C([0, 9e6, 1.5e7], ESP), { inserto: { pos: [-70, 50, 70], mira: [0, 0, 400], t: 2.5, dur: 2, efecto: 'incendio' }, planeta: true }),
      P(T('COMO EL DE LOS DINOSAURIOS', 'LIKE THE DINOSAUR KILLER'), T('Cuarenta mil gigatones. Hace 66 millones de años, uno así acabó con los dinosaurios.', 'Forty thousand gigatons. 66 million years ago, one like this wiped out the dinosaurs.'), C([0, 9e6, 1.5e7], ESP), { planeta: true, dur: 4.8 }),
    ],
    cierre: { titulo: T('Que vuelvan los dinosaurios.', 'Bring back the dinosaurs.'), pregunta: T('¿Qué duplicamos ahora? 👇', 'What should we double next? 👇') },
  };
})();
