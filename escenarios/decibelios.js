// Gritar BOMBOCLAT cada vez el doble de fuerte (+10 dB = el oído lo nota el doble de fuerte).
// Potencia del grito: 4π · 10^-12 · 10^(dB/10) W. 374 dB ≈ la potencia del Sol. Cifras aproximadas: compruébalas antes de publicar.
// Cámaras relativas a donde empieza a andar (x -11.5, z 120); el fenómeno les suma lo que ha andado.
window.ESCENARIOS = window.ESCENARIOS || {};
(() => {
  const RT = 6.371e6, C = (pos, mira) => ({ pos, mira }), ESP = [0, -RT, 0];
  const cerca = C([-6.5, 3, 129], [-11.5, 2.3, 120]), medio = C([-4.5, 4.8, 133], [-11.5, 2.2, 120]);
  const P = (valor, sub, texto, camara, extra) => ({ valor, sub, texto, camara, ...extra });
  window.ESCENARIOS.decibelios = {
    id: 'decibelios',
    tipo: 'decibelios',
    titulo: T('Gritar BOMBOCLAT cada vez más fuerte', 'Shouting BOMBOCLAT louder and louder'),
    pregunta: T('¿Y si cada BOMBOCLAT sonara el doble de fuerte que el anterior?', 'What if every BOMBOCLAT was twice as loud as the last?'),
    unidad: 'dB',
    ritmo: 2.6, introDur: 2.8,
    paso: T('GRITO', 'SHOUT'),
    lema: T('EL DOBLE DE FUERTE CADA VEZ', 'TWICE AS LOUD EVERY TIME'),
    intro: { pos: [-5, 7.5, 133], mira: [-11.5, 5.2, 120] }, // absoluta (el suelo está a 3 m)
    sonido: { camas: { dron: .3, ciudad: .55 }, extra: ['grito', 'impacto'] },
    fases: [
      P(60, T('UNA CONVERSACIÓN NORMAL', 'A NORMAL CONVERSATION'), T('Un tipo cualquiera paseando por la calle.', 'Just a guy walking down the street.'), cerca),
      P(70, T('UNA ASPIRADORA', 'A VACUUM CLEANER'), T('Nadie se da cuenta.', 'Nobody notices.'), cerca),
      P(80, T('UNA CALLE CON TRÁFICO', 'A BUSY STREET'), T('Un señor se gira.', 'A guy turns around.'), cerca),
      P(90, T('UN CORTACÉSPED', 'A LAWNMOWER'), T('Ahora le mira todo el mundo.', 'Now everyone is staring.'), medio),
      P(100, T('UN MARTILLO NEUMÁTICO', 'A JACKHAMMER'), T('La gente empieza a apartarse.', 'People start backing away.'), medio),
      P(110, T('UN CONCIERTO DE ROCK', 'A ROCK CONCERT'), T('Alguien llama a la policía.', 'Someone calls the police.'), medio),
      P(120, T('UN TRUENO', 'A THUNDERCLAP'), T('Empiezan a doler los oídos.', 'Ears start to hurt.'), C([-3, 8, 137], [-11.5, 2.5, 120])),
      P(130, T('EL UMBRAL DEL DOLOR', 'THE THRESHOLD OF PAIN'), T('Todos huyen tapándose los oídos.', 'Everyone runs, covering their ears.'), C([-3, 8, 137], [-11.5, 2.5, 120]), { sfx: [['panico', .5, .3]] }),
      P(140, T('UN AVIÓN DESPEGANDO', 'A JET TAKING OFF'), T('Daño auditivo instantáneo.', 'Instant hearing damage.'), C([0, 11, 142], [-11.5, 2.8, 119])),
      P(150, T('UN MOTOR A REACCIÓN A 1 METRO', 'A JET ENGINE, 1 METRE AWAY'), T('Pueden reventar los tímpanos.', 'Eardrums can burst.'), C([4, 14, 148], [-11.5, 3, 118])),
      P(160, T('UN DISPARO DE ESCOPETA', 'A SHOTGUN BLAST'), T('Tiemblan los cristales de al lado.', 'The windows next to him rattle.'), C([6, 17, 152], [-11.5, 3, 118])),
      P(170, T('UNA GRANADA ATURDIDORA', 'A STUN GRENADE'), T('Saltan todas las alarmas de coche.', 'Every car alarm goes off.'), C([9, 21, 157], [-11.5, 4, 117]), { alarmas: true, sfx: [['alarmas', .45, .35]] }),
      P(180, T('EL DESPEGUE DE UN COHETE', 'A ROCKET LAUNCH'), T('Revientan las primeras ventanas.', 'The first windows shatter.'), C([15, 28, 165], [-11.5, 5, 115]), { sfx: [['cristales', .55, .3]] }),
      P(190, T('EL COHETE SATURNO V', 'THE SATURN V ROCKET'), T('Toda la manzana se queda sin cristales.', 'The whole block loses its windows.'), C([22, 38, 178], [-11.5, 5, 113]), { sfx: [['cristales', .7, .3]] }),
      P(194, T('EL LÍMITE DEL SONIDO EN EL AIRE', 'THE LIMIT OF SOUND IN AIR'), T('El sonido ya no puede ser más fuerte. Se convierte en onda de choque.', 'Sound can\'t get any louder. It becomes a shockwave.'), C([28, 48, 190], [-11.5, 5, 112]), { sfx: [['riser', .5, 0]] }),
      P(200, T('UNA ONDA EXPANSIVA', 'A SHOCKWAVE'), T('Los coches de al lado salen volando.', 'The cars next to him go flying.'), C([40, 70, 210], [-11, 5, 110]), { sfx: [['impacto', .8, .25]], camas: { ciudad: .25 } }),
      P(210, T('UNA DEMOLICIÓN', 'A BUILDING DEMOLITION'), T('Se cae el edificio de enfrente.', 'The building across the street collapses.'), C([70, 120, 260], [-11, 3, 105]), { sfx: [['derrumbe', .7, .35]] }),
      P(220, T('UN MISIL DE CRUCERO', 'A CRUISE MISSILE'), T('Se viene abajo toda la manzana.', 'The whole block comes down.'), C([110, 190, 340], [-11, 0, 100]), { sfx: [['derrumbe', .8, .35]], camas: { ciudad: 0 } }),
      P(230, T('UNA PEQUEÑA BOMBA NUCLEAR', 'A SMALL NUKE'), T('Los vecinos ponen una queja por ruido.', 'The neighbours file a noise complaint.'), C([250, 450, 650], [0, 0, 100]), { sfx: [['derrumbe', .8, .4]] }),
      P(240, T('UNA BOMBA DE HIROSHIMA CADA 5 SEGUNDOS', 'A HIROSHIMA BOMB EVERY 5 SECONDS'), T('El centro de la ciudad queda arrasado.', 'The city centre is flattened.'), C([600, 1100, 1500], [0, 0, 200])),
      P(250, T('UNA BOMBA ATÓMICA', 'AN ATOMIC BOMB'), T('La ONU te pide, por favor, que pares.', 'The UN asks you to please stop.'), C([1500, 2800, 3500], [0, 0, 300])),
      P(260, T('UNA BOMBA DE HIDRÓGENO', 'A HYDROGEN BOMB'), T('Ya no queda ciudad.', 'There is no city left.'), C([4000, 8000, 9000], [0, 0, 0])),
      P(270, T('UNA GUERRA NUCLEAR', 'A NUCLEAR WAR'), T('Te llama tu madre. No la oyes.', 'Your mom calls. You can\'t hear her.'), C([1e4, 2.2e4, 2.4e4], [0, 0, 0])),
      P(280, T('UN SUPERVOLCÁN', 'A SUPERVOLCANO'), T('Se oye en la otra punta del país.', 'They hear it on the other side of the country.'), C([3e4, 7e4, 7e4], [0, 0, 0])),
      P(290, T('EL KRAKATOA', 'KRAKATOA'), T('El Krakatoa llama: quiere su récord.', 'Krakatoa called. It wants its record back.'), C([1e5, 2.4e5, 2.2e5], [0, 0, 0])),
      P(300, T('UNA ONDA DEL TAMAÑO DE UN PAÍS', 'A COUNTRY-SIZED SHOCKWAVE'), T('La onda se ve desde el espacio.', 'You can see the shockwave from space.'), C([0, 3e6, 4e6], ESP), { espacio: true, camas: { dron: .35, espacio: .3 } }),
      P(320, T('EL ASTEROIDE DE LOS DINOSAURIOS', 'THE DINOSAUR ASTEROID'), T('La Tierra suena como una campana.', 'Earth rings like a bell.'), C([0, 4e6, 1.2e7], ESP), { espacio: true }),
      P(345, T('2 MILLONES DE VECES LA LUZ DEL SOL EN LA TIERRA', '2 MILLION TIMES THE SUNLIGHT ON EARTH'), T('Hierven los océanos.', 'The oceans start to boil.'), C([0, 3e6, 2e7], ESP), { espacio: true, brillo: [.35, .25], sfx: [['fuego', .4, .2]] }),
      P(374, T('TANTA POTENCIA COMO EL SOL', 'AS POWERFUL AS THE SUN'), T('La atmósfera sale volando al espacio.', 'The atmosphere is blown into space.'), C([0, 3e6, 2e7], ESP), { espacio: true, sinAire: true, brillo: [.6, .5] }),
      P(395, T('100 SOLES', '100 SUNS'), T('La Tierra se pone al rojo vivo.', 'Earth glows red hot.'), C([0, 3e6, 2.1e7], ESP), { espacio: true, brillo: [.85, .8] }),
      P(420, T('40.000 SOLES', '40,000 SUNS'), T('Se derrite la corteza.', 'The crust melts.'), C([0, 3e6, 2.2e7], ESP), { espacio: true, brillo: [1, 1.2] }),
      P(445, T('12 MILLONES DE SOLES', '12 MILLION SUNS'), T('La Tierra explota.', 'Earth explodes.'), C([0, 5e6, 3e7], ESP), { planeta: true, sfx: [['planeta', 1, .5]], camas: { espacio: 0 } }),
      P(0, T('SILENCIO', 'SILENCE'), T('En el espacio, nadie puede oírte gritar bomboclat.', 'In space, no one can hear you bomboclat.'), C([0, 8e6, 4e7], ESP), { final: true, dur: 4.5, camas: { dron: 0, espacio: 0 } }),
    ],
    cierre: { titulo: T('Ya nadie te oye.', 'No one can hear you now.'), pregunta: T('¿Qué duplicamos ahora? 👇', 'What should we double next? 👇') },
  };
})();
