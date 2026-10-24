// El viento que se duplica: de una brisa (5 km/h) a más que la velocidad de escape. Sopla de oeste a este (hacia x positivo).
// Cifras aproximadas: compruébalas antes de publicar.
window.ESCENARIOS = window.ESCENARIOS || {};
(() => {
  const C = (pos, mira) => ({ pos, mira }), H = (pos, mira) => ({ pos, mira, cerca: true }), // H: sigue al protagonista (suelo a 3 m)
    P = (sub, texto, camara, extra) => ({ sub, texto, camara, ...extra });
  const ESP = [0, -6.371e6, 0];
  // la cámara gira un poco alrededor del punto al que mira: con un punto lejano se metería en los edificios,
  // así que se mira a un punto a 60 m en la misma dirección
  const CC = (pos, mira) => { const d = mira.map((v, i) => v - pos[i]), l = Math.hypot(...d); return C(pos, pos.map((v, i) => v + d[i] / l * 60)); };
  window.ESCENARIOS.viento = {
    id: 'viento',
    tipo: 'viento',
    titulo: T('El viento que se duplica', 'The doubling wind'),
    pregunta: T('¿Y si el viento soplara cada vez el doble de fuerte?', 'What if the wind blew twice as hard every time?'),
    unidad: 'km/h',
    inicial: 5,
    multiplicador: 2,
    ritmo: 3.2, introDur: 2.8,
    paso: T('RÁFAGA', 'GUST'),
    lema: T('EL DOBLE DE FUERTE CADA VEZ', 'TWICE AS STRONG EVERY TIME'),
    intro: { pos: [-10.6, 8.2, 127.5], mira: [-11.5, 7.4, 120] },
    sonido: { camas: { dron: .25, ciudad: .5 }, paso: 'whoosh', pasoGan: .4 },
    fases: [
      P(T('UNA BRISA', 'A BREEZE'), T('Cada metro cuadrado lleva vatio y medio. Menos que un cargador. Día perfecto para un helado.', 'Each square metre carries one and a half watts. Less than a phone charger. Perfect ice cream weather.'), H([-10.9, 4.9, 125.2], [-11.5, 4.25, 120])),
      P(T('SE MUEVEN LAS HOJAS', 'LEAVES RUSTLE'), T('El doble de viento lleva ocho veces más energía. Te despeina un poco.', 'Twice the wind carries eight times the energy. It messes up your hair.'), H([-9.8, 5.6, 127.5], [-11.5, 4.3, 120])),
      P(T('DÍA DE COMETAS', 'KITE WEATHER'), T('Cien vatios por metro cuadrado. Perfecto para volar una cometa. La tuya se escapa.', 'A hundred watts per square metre. Perfect for flying a kite. Yours gets away.'), H([-8.6, 4.4, 124], [-11.5, 3.9, 120])),
      P(T('PARAGUAS DEL REVÉS', 'UMBRELLAS INSIDE OUT'), T('Un microondas por metro cuadrado. Los paraguas se dan la vuelta. El tuyo era nuevo.', 'A microwave\'s worth per square metre. Umbrellas flip inside out. Yours was brand new.'), H([-8, 6, 129], [-11.5, 3.9, 120])),
      P(T('TEMPORAL', 'A GALE'), T('Treinta kilos empujando cada metro cuadrado. Andar cuesta como subir una cuesta. Llegas tarde al trabajo y nadie te cree.', 'Thirty kilos pushing on every square metre. Walking feels like climbing a hill. You\'re late for work and nobody believes you.'), H([-9.6, 4.2, 124], [-11.5, 3.6, 119.5]), { sfx: [['panico', .2, .5]] }),
      P(T('HURACÁN', 'A HURRICANE'), T('Huracán de categoría dos. Ciento veinte kilos por metro cuadrado. Agárrate. Demasiado tarde.', 'A category two hurricane. A hundred and twenty kilos per square metre. Hold on. Too late.'), H([-1, 5, 135], [-6, 6.5, 121]), { sfx: [['panico', .4, .6]] }),
      P(T('CATEGORÍA 5', 'CATEGORY 5'), T('Casi como Patricia, el huracán más fuerte medido. Media tonelada por metro cuadrado. Los coches salen volando.', 'Almost Hurricane Patricia, the strongest ever measured. Half a tonne per square metre. Cars take off.'), CC([-3, 14, 112], [3, 2, 160]),
        { inserto: { pos: [-2, 5, 124], mira: [3, 9, 158], t: .5, dur: 2.2, efecto: 'vendaval' } }),
      P(T('NINGÚN TORNADO', 'NO TORNADO EVER'), T('Más que el tornado más fuerte medido. Dos toneladas por metro cuadrado. Caen las casas.', 'Stronger than the strongest tornado ever measured. Two tonnes per square metre. Houses fall.'), CC([-200, 90, -100], [0, 10, 400]), { camas: { ciudad: 0 } }),
      P(T('MÁS QUE EL SONIDO', 'FASTER THAN SOUND'), T('Más rápido que el sonido. Ocho toneladas por metro cuadrado. Caen los rascacielos.', 'Faster than sound. Eight tonnes per square metre. Skyscrapers fall.'), CC([-500, 380, -300], [0, 20, 800])),
      P(T('ARRANCA EL SUELO', 'IT RIPS UP THE GROUND'), T('Treinta toneladas por metro cuadrado. Se lleva el asfalto, la tierra y los monumentos. La Estatua de la Libertad vuelve a Francia.', 'Thirty tonnes per square metre. It takes the asphalt, the soil and the monuments. The Statue of Liberty flies back to France.'), CC([-1500, 900, -900], [0, 0, 900]),
        { inserto: { pos: [0, 4, 100], mira: [8, 3, 170], t: 1, dur: 2, efecto: 'arranca' } }),
      P(T('EL MAR SE LEVANTA', 'THE SEA TAKES OFF'), T('Como estar a ciento veinte metros bajo el mar. Olas de kilómetros barren los continentes.', 'Like being a hundred and twenty metres under the sea. Mile-high waves sweep the continents.'), C([0, 2e6, 3.2e7], ESP), { planeta: true, camas: { espacio: .3 }, sfx: [['riser', .5, 0]] }),
      P(T('SE PELA LA TIERRA', 'EARTH GETS PEELED'), T('La presión de quinientos metros de mar. El viento arranca la corteza a tiras.', 'The pressure of five hundred metres of sea. The wind strips the crust off in layers.'), C([0, 2e6, 3.2e7], ESP), { planeta: true }),
      P(T('UNA COLA DE COMETA', 'A COMET TAIL'), T('Cada metro cuadrado de viento lleva cien centrales nucleares. La Tierra deja una estela de aire. Desde Marte parece un cometa.', 'Every square metre of wind carries a hundred nuclear power plants. Earth leaves a trail of air behind it. From Mars it looks like a comet.'), C([0, 2e6, 3.2e7], ESP), { planeta: true }),
      P(T('SE ESCAPA EL AIRE', 'THE AIR ESCAPES'), T('Once kilómetros por segundo, más que la velocidad de escape. Adiós, atmósfera.', 'Eleven kilometres per second, faster than escape velocity. Bye bye, atmosphere.'), C([0, 2e6, 3.2e7], ESP), { planeta: true, sfx: [['planeta', .5, .3]] }),
    ],
    cierre: { titulo: T('Por lo menos ya no hace viento.', 'At least it\'s not windy anymore.'), pregunta: T('¿Qué duplicamos ahora? 👇', 'What should we double next? 👇') },
  };
})();
