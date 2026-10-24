// Gritar BOMBOCLAT cada vez el doble de fuerte (+10 dB = el oído lo nota el doble de fuerte).
// Potencia del grito: 4π · 10^-12 · 10^(dB/10) W. 374 dB ≈ la potencia del Sol. Cifras aproximadas: compruébalas antes de publicar.
// Cámaras relativas a donde empieza a andar (x -11.5, z 120); el fenómeno les suma lo que ha andado.
window.ESCENARIOS = window.ESCENARIOS || {};
(() => {
  const RT = 6.371e6, C = (pos, mira) => ({ pos, mira }), ESP = [0, -RT, 0];
  const cerca = C([-10.9, 1.9, 125.2], [-11.5, 1.25, 120]), medio = C([-9.8, 2.6, 127.5], [-11.5, 1.3, 120]);
  const P = (valor, sub, texto, camara, extra) => ({ valor, sub, texto, camara, ...extra });
  window.ESCENARIOS.decibelios = {
    id: 'decibelios',
    tipo: 'decibelios',
    titulo: T('Gritar BOMBOCLAT cada vez más fuerte', 'Shouting BOMBOCLAT louder and louder'),
    pregunta: T('¿Y si cada BOMBOCLAT sonara el doble de fuerte que el anterior?', 'What if every BOMBOCLAT was twice as loud as the last?'),
    unidad: 'dB',
    ritmo: 2.6, introDur: 2.8, vozRetraso: 1.1,
    paso: T('GRITO', 'SHOUT'),
    lema: T('EL DOBLE DE FUERTE CADA VEZ', 'TWICE AS LOUD EVERY TIME'),
    intro: { pos: [-10.6, 5.2, 127.5], mira: [-11.5, 4.4, 120] }, // absoluta (el suelo está a 3 m)
    sonido: { camas: { dron: .3, ciudad: .55 }, extra: [...Array(10)].map((_, i) => 'bomboclat/' + String(i).padStart(2, '0')).concat('impacto') },
    fases: [
      P(60, T('UNA CONVERSACIÓN NORMAL', 'A NORMAL CONVERSATION'), T('Tu voz da una cienmilésima de vatio. Ni para encender un LED.', 'Your voice puts out a hundred-thousandth of a watt. Not even enough for an LED.'), cerca),
      P(70, T('UNA ASPIRADORA', 'A VACUUM CLEANER'), T('Diez veces más potencia. Y nadie se da cuenta.', 'Ten times the power. Still, nobody notices.'), cerca),
      P(80, T('UNA CALLE CON TRÁFICO', 'A BUSY STREET'), T('Cada 10 decibelios, diez veces más potencia. Un señor se gira.', 'Every 10 decibels is ten times the power. A guy turns around.'), cerca),
      P(90, T('UN CORTACÉSPED', 'A LAWNMOWER'), T('Una centésima de vatio. Ahora le mira todo el mundo.', 'A hundredth of a watt. Now everyone is staring.'), medio),
      P(100, T('UN MARTILLO NEUMÁTICO', 'A JACKHAMMER'), T('Horas a este volumen ya dañan el oído. La gente se aparta.', 'Hours at this volume damage your hearing. People back away.'), medio),
      P(110, T('UN CONCIERTO DE ROCK', 'A ROCK CONCERT'), T('Un vatio de sonido. Alguien llama a la policía.', 'One watt of sound. Someone calls the police.'), medio),
      P(120, T('UN TRUENO', 'A THUNDERCLAP'), T('Doce vatios, como una bombilla LED. Duelen los oídos.', 'Twelve watts, like an LED bulb. Ears start to hurt.'), C([-9.6, 2.8, 128.5], [-11.5, 1.3, 120])),
      P(130, T('EL UMBRAL DEL DOLOR', 'THE THRESHOLD OF PAIN'), T('Cien vatios: el umbral del dolor. Todos huyen.', 'A hundred watts: the threshold of pain. Everyone runs.'), C([-9.3, 3.2, 129.5], [-11.5, 1.4, 120]), { sfx: [['panico', .5, .3]] }),
      P(140, T('UN AVIÓN DESPEGANDO', 'A JET TAKING OFF'), T('La potencia de un microondas, en sonido. Daño auditivo al instante.', 'A microwave\'s worth of power, as sound. Instant hearing damage.'), C([-9, 3.6, 130.5], [-11.5, 1.5, 120])),
      P(150, T('UN MOTOR A REACCIÓN A 1 METRO', 'A JET ENGINE, 1 METRE AWAY'), T('Tres gramos de TNT por segundo. Revientan los tímpanos.', 'Three grams of TNT per second. Eardrums burst.'), C([-8.5, 4.2, 131.5], [-11.5, 1.5, 120])),
      P(160, T('UN DISPARO DE ESCOPETA', 'A SHOTGUN BLAST'), T('Treinta gramos de TNT por segundo. Tiemblan los cristales.', 'Thirty grams of TNT a second. The windows rattle.'), C([-8, 5, 132.5], [-11.5, 1.5, 120])),
      P(170, T('UNA GRANADA ATURDIDORA', 'A STUN GRENADE'), T('Un tercio de kilo de TNT por segundo. Saltan las alarmas.', 'A third of a kilo of TNT a second. Car alarms go off.'), C([-6, 16, 132], [-11.5, 0, 118]), { alarmas: true, sfx: [['alarmas', .45, .35]] }),
      P(180, T('EL DESPEGUE DE UN COHETE', 'A ROCKET LAUNCH'), T('Casi una granada de mano por segundo. Revientan las ventanas.', 'Almost a hand grenade every second. Windows shatter.'), C([-5, 22, 134], [-11.5, 0, 116]), { sfx: [['cristales', .55, .3]] }),
      P(190, T('EL COHETE SATURNO V', 'THE SATURN V ROCKET'), T('Siete granadas por segundo. La manzana se queda sin cristales.', 'Seven grenades a second. The whole block loses its windows.'), C([-4, 30, 137], [-11.5, 0, 114]), { sfx: [['cristales', .7, .3]], inserto: { rel: true, pos: [-5, 3, 133], mira: [-16, 7, 121], t: 1, dur: 1.7, efecto: 'cristales' } }),
      P(194, T('EL LÍMITE DEL SONIDO EN EL AIRE', 'THE LIMIT OF SOUND IN AIR'), T('El aire no da para más. El sonido se vuelve onda de choque.', 'Air can\'t carry any more. Sound turns into a shockwave.'), C([-3, 38, 140], [-11.5, 0, 112]), { sfx: [['riser', .5, 0]] }),
      P(200, T('UNA ONDA EXPANSIVA', 'A SHOCKWAVE'), T('Trescientos kilos de TNT por segundo. Los coches salen volando.', 'Three hundred kilos of TNT a second. Cars go flying.'), C([0, 55, 150], [-11, 0, 110]), { sfx: [['impacto', .8, .25]], camas: { ciudad: .25 }, inserto: { rel: true, pos: [-10, 2.2, 118], mira: [-1, 2, 140], t: .4, dur: 2 } }),
      P(210, T('UNA DEMOLICIÓN', 'A BUILDING DEMOLITION'), T('Tres toneladas de TNT por segundo. Cae el edificio de enfrente.', 'Three tonnes of TNT a second. The building across the street falls.'), C([70, 120, 260], [-11, 3, 105]), { sfx: [['derrumbe', .7, .35]] }),
      P(220, T('UN MISIL DE CRUCERO', 'A CRUISE MISSILE'), T('Treinta toneladas de TNT por segundo. Se viene abajo la manzana.', 'Thirty tonnes of TNT a second. The whole block comes down.'), C([110, 190, 340], [-11, 0, 100]), { sfx: [['derrumbe', .8, .35]], camas: { ciudad: 0 } }),
      P(230, T('UNA PEQUEÑA BOMBA NUCLEAR', 'A SMALL NUKE'), T('Trescientas toneladas por segundo. Los vecinos se quejan del ruido.', 'Three hundred tonnes a second. The neighbours complain about the noise.'), C([250, 450, 650], [0, 0, 100]), { sfx: [['derrumbe', .8, .4]] }),
      P(240, T('UNA BOMBA DE HIROSHIMA CADA 5 SEGUNDOS', 'A HIROSHIMA BOMB EVERY 5 SECONDS'), T('Una bomba de Hiroshima cada cinco segundos. El centro, arrasado.', 'One Hiroshima bomb every five seconds. Downtown is gone.'), C([600, 1100, 1500], [0, 0, 200])),
      P(250, T('UNA BOMBA ATÓMICA', 'AN ATOMIC BOMB'), T('Dos Hiroshimas por segundo. La ONU te pide que pares.', 'Two Hiroshimas a second. The UN asks you to please stop.'), C([1500, 2800, 3500], [0, 0, 300])),
      P(260, T('UNA BOMBA DE HIDRÓGENO', 'A HYDROGEN BOMB'), T('Veinte Hiroshimas por segundo. Ya no queda ciudad.', 'Twenty Hiroshimas a second. There is no city left.'), C([4000, 8000, 9000], [0, 0, 0])),
      P(270, T('UNA GUERRA NUCLEAR', 'A NUCLEAR WAR'), T('Tres megatones por segundo. Te llama tu madre. No la oyes.', 'Three megatons a second. Your mom calls. You can\'t hear her.'), C([1e4, 2.2e4, 2.4e4], [0, 0, 0])),
      P(280, T('UN SUPERVOLCÁN', 'A SUPERVOLCANO'), T('Treinta megatones por segundo. Lo oye todo el país.', 'Thirty megatons a second. The whole country hears it.'), C([3e4, 7e4, 7e4], [0, 0, 0])),
      P(290, T('EL KRAKATOA', 'KRAKATOA'), T('Cada segundo, más energía que la erupción del Krakatoa.', 'Every second, more energy than the Krakatoa eruption.'), C([1e5, 2.4e5, 2.2e5], [0, 0, 0])),
      P(300, T('UNA ONDA DEL TAMAÑO DE UN PAÍS', 'A COUNTRY-SIZED SHOCKWAVE'), T('Tres gigatones por segundo. La onda se ve desde el espacio.', 'Three gigatons a second. You can see the shockwave from space.'), C([0, 7e6, 1.3e7], ESP), { espacio: true, camas: { dron: .35, espacio: .3 } }),
      P(320, T('EL ASTEROIDE DE LOS DINOSAURIOS', 'THE DINOSAUR ASTEROID'), T('En cinco minutos, la energía del asteroide de los dinosaurios.', 'In five minutes, as much energy as the dinosaur asteroid.'), C([0, 4e6, 1.2e7], ESP), { espacio: true }),
      P(345, T('2 MILLONES DE VECES LA LUZ DEL SOL EN LA TIERRA', '2 MILLION TIMES THE SUNLIGHT ON EARTH'), T('Millones de veces el calor del Sol. Hierven los océanos.', 'Millions of times the Sun\'s heat on Earth. The oceans boil.'), C([0, 3e6, 2e7], ESP), { espacio: true, brillo: [.35, .25], sfx: [['fuego', .4, .2]], inserto: { pos: [10, 9, -8], mira: [0, 0, -80], t: 1.2, dur: 2.2, efecto: 'oceano' } }),
      P(374, T('TANTA POTENCIA COMO EL SOL', 'AS POWERFUL AS THE SUN'), T('Tanta potencia como el Sol entero. La atmósfera sale volando.', 'As much power as the whole Sun. The atmosphere blows away.'), C([0, 3e6, 2e7], ESP), { espacio: true, sinAire: true, brillo: [.6, .5] }),
      P(395, T('100 SOLES', '100 SUNS'), T('Cien soles gritando a la vez. La Tierra, al rojo vivo.', 'A hundred suns shouting at once. Earth glows red hot.'), C([0, 3e6, 2.1e7], ESP), { espacio: true, brillo: [.85, .8] }),
      P(420, T('40.000 SOLES', '40,000 SUNS'), T('Brilla como una estrella gigante. Se derrite la corteza.', 'As bright as a giant star. The crust melts.'), C([0, 3e6, 2.2e7], ESP), { espacio: true, brillo: [1, 1.2], inserto: { pos: [-60, 30, 40], mira: [0, 0, 200], t: 1.2, dur: 2, efecto: 'lava' } }),
      P(445, T('12 MILLONES DE SOLES', '12 MILLION SUNS'), T('Más energía por segundo de la que mantiene unida la Tierra. Explota.', 'More energy each second than what holds Earth together. It explodes.'), C([0, 5e6, 3e7], ESP), { planeta: true, sfx: [['planeta', 1, .5]], camas: { espacio: 0 } }),
      P(0, T('SILENCIO', 'SILENCE'), T('Sin aire no hay sonido. Nadie puede oírte gritar bomboclat.', 'No air, no sound. In space, no one can hear you bomboclat.'), C([0, 8e6, 4e7], ESP), { final: true, dur: 4.5, camas: { dron: 0, espacio: 0 } }),
    ],
    cierre: { titulo: T('Ya nadie te oye.', 'No one can hear you now.'), pregunta: T('¿Qué duplicamos ahora? 👇', 'What should we double next? 👇') },
  };
})();
