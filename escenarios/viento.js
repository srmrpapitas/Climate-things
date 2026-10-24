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
      P(T('UNA BRISA', 'A BREEZE'), T('Ni se nota. Día perfecto para un helado.', 'You barely notice. Perfect ice cream weather.'), H([-10.9, 4.9, 125.2], [-11.5, 4.25, 120])),
      P(T('SE MUEVEN LAS HOJAS', 'LEAVES RUSTLE'), T('Te despeina un poco. Nada grave.', 'It messes up your hair a bit. No big deal.'), H([-9.8, 5.6, 127.5], [-11.5, 4.3, 120])),
      P(T('DÍA DE COMETAS', 'KITE WEATHER'), T('Perfecto para volar una cometa.', 'Perfect for flying a kite.'), H([-8.6, 4.4, 124], [-11.5, 3.9, 120])),
      P(T('PARAGUAS DEL REVÉS', 'UMBRELLAS INSIDE OUT'), T('Los paraguas se dan la vuelta. La arena pica.', 'Umbrellas flip. The sand stings.'), H([-8, 6, 129], [-11.5, 3.9, 120])),
      P(T('TEMPORAL', 'A GALE'), T('Andar cuesta como subir una cuesta.', 'Walking feels like climbing a hill.'), H([-9.6, 4.2, 124], [-11.5, 3.6, 119.5]), { sfx: [['panico', .2, .5]] }),
      P(T('HURACÁN', 'A HURRICANE'), T('Agárrate a algo. Demasiado tarde.', 'Hold on to something. Too late.'), H([-1, 5, 135], [-6, 6.5, 121]), { sfx: [['panico', .4, .6]] }),
      P(T('MÁS QUE PATRICIA', 'STRONGER THAN PATRICIA'), T('El huracán más fuerte medido. Los coches salen volando.', 'The strongest hurricane ever measured. Cars take off.'), CC([-3, 14, 112], [3, 2, 160]), { dur: 4.4 }),
      P(T('NINGÚN TORNADO', 'NO TORNADO EVER'), T('Nunca se ha medido nada igual. Caen las casas.', 'Nothing like it was ever measured. Houses fall.'), CC([-200, 90, -100], [0, 10, 400]), { camas: { ciudad: 0 }, dur: 4 }),
      P(T('MÁS QUE EL SONIDO', 'FASTER THAN SOUND'), T('Cada ráfaga, un estampido sónico. Caen los rascacielos.', 'Every gust is a sonic boom. Skyscrapers fall.'), CC([-500, 380, -300], [0, 20, 800]), { dur: 4.7 }),
      P(T('ARRANCA EL SUELO', 'IT RIPS UP THE GROUND'), T('Se lleva el asfalto, la tierra y los monumentos.', 'It takes the asphalt, the soil and the monuments.'), CC([-1500, 900, -900], [0, 0, 900]), { dur: 3.7 }),
      P(T('EL MAR SE LEVANTA', 'THE SEA TAKES OFF'), T('Olas de kilómetros barren los continentes.', 'Mile-high waves sweep the continents.'), C([0, 2e6, 3.2e7], ESP), { planeta: true, camas: { espacio: .3 }, sfx: [['riser', .5, 0]] }),
      P(T('SE PELA LA TIERRA', 'EARTH GETS PEELED'), T('El viento arranca la corteza a tiras.', 'The wind strips the crust off in layers.'), C([0, 2e6, 3.2e7], ESP), { planeta: true }),
      P(T('UNA COLA DE COMETA', 'A COMET TAIL'), T('La Tierra deja una estela de aire detrás.', 'Earth leaves a trail of air behind it.'), C([0, 2e6, 3.2e7], ESP), { planeta: true }),
      P(T('SE ESCAPA EL AIRE', 'THE AIR ESCAPES'), T('Más que la velocidad de escape. Adiós, atmósfera.', 'Faster than escape velocity. Bye bye, atmosphere.'), C([0, 2e6, 3.2e7], ESP), { planeta: true, dur: 4.5, sfx: [['planeta', .5, .3]] }),
    ],
    cierre: { titulo: T('Por lo menos ya no hace viento.', 'At least it\'s not windy anymore.'), pregunta: T('¿Qué duplicamos ahora? 👇', 'What should we double next? 👇') },
  };
})();
