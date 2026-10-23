// Terremoto cada vez más fuerte. Cada punto de magnitud libera unas 32 veces más energía.
// Energía: E = 10^(1,5·M + 4,8) J (relación de Gutenberg-Richter). Cifras aproximadas: compruébalas antes de publicar.
// valor: magnitud. duracion: segundos que tiembla. sima: se abre una grieta enorme. planeta: la Tierra se parte.
// camara: posición y punto al que mira [x, y, z]. El mar está en z negativo y la ciudad en z positivo.
window.ESCENARIOS = window.ESCENARIOS || {};
(() => {
  const C = (pos, mira) => ({ pos, mira }), D = 3.4;
  const P = (valor, sub, texto, camara, extra) => ({ valor, duracion: D, sub, texto, camara, ...extra });
  const calle = C([-2, 3.5, 570], [0, 24, 300]), calle2 = C([-6, 9, 600], [0, 22, 320]);
  window.ESCENARIOS.terremoto = {
    id: 'terremoto',
    tipo: 'terremoto',
    titulo: T('El terremoto que no para de crecer', 'The earthquake that keeps growing'),
    pregunta: T('¿Y si cada terremoto fuera más fuerte que el anterior?', 'What if every earthquake was stronger than the last?'),
    ritmo: 3.2, introDur: 2.8,
    paso: T('TERREMOTO', 'QUAKE'),
    lema: T('CADA PUNTO, 32 VECES MÁS ENERGÍA', 'EVERY POINT = 32× MORE ENERGY'),
    intro: { pos: [-40, 30, 700], mira: [0, 20, 300] },
    sonido: { camas: { dron: .3, ciudad: .5 }, paso: 'terremoto', pasoGan: .55 },
    fases: [
      P(3, T('UN CAMIÓN QUE PASA', 'A TRUCK DRIVING PAST'), T('Las lámparas se balancean un poco.', 'The lamps sway a little.'), calle),
      P(4, T('UN TEMBLOR PEQUEÑO', 'A SMALL TREMOR'), T('Tintinean los vasos de la estantería.', 'Glasses rattle on the shelves.'), calle),
      P(5, T('UN TERREMOTO MODERADO', 'A MODERATE QUAKE'), T('Se agrietan las paredes. Todos salen a la calle.', 'Walls crack. Everyone runs outside.'), calle2, { sfx: [['panico', .4, .5]] }),
      P(5.5, T('UN TERREMOTO FUERTE', 'A STRONG QUAKE'), T('Las casas viejas empiezan a ceder.', 'Old houses start to give way.'), calle2),
      P(6, T('LA BOMBA DE HIROSHIMA', 'THE HIROSHIMA BOMB'), T('Se hunden las casas bajas.', 'Low houses collapse.'), C([-60, 60, 760], [0, 15, 380]), { sfx: [['derrumbe', .5, .8]] }),
      P(6.7, T('LOS ÁNGELES, 1994', 'LOS ANGELES, 1994'), T('Se parten puentes y autopistas.', 'Bridges and highways snap.'), C([-230, 170, -160], [0, 10, 520]), { sfx: [['derrumbe', .5, .6]] }),
      P(7, T('HAITÍ, 2010', 'HAITI, 2010'), T('Caen los bloques de pisos.', 'Apartment blocks come down.'), C([-400, 240, -250], [0, 10, 620]), { sfx: [['derrumbe', .6, .5]], camas: { ciudad: .2 } }),
      P(7.5, T('UN GRAN TERREMOTO', 'A MAJOR QUAKE'), T('El suelo empieza a abrirse.', 'The ground starts to split open.'), C([-520, 300, 1950], [0, 10, 850]), { sfx: [['derrumbe', .6, .5]] }),
      P(8, T('MÉXICO, 1985', 'MEXICO CITY, 1985'), T('Los rascacielos se balancean metros de lado a lado.', 'Skyscrapers sway metres from side to side.'), C([-900, 650, 2700], [0, 30, 1000]), { camas: { ciudad: 0 } }),
      P(8.5, T('UN MEGATERREMOTO', 'A MEGAQUAKE'), T('Empiezan a caer las torres.', 'The towers start to fall.'), C([-1200, 820, 3100], [0, 30, 1150]), { sfx: [['derrumbe', .7, .6]] }),
      P(9, T('JAPÓN, 2011', 'JAPAN, 2011'), T('Se ven olas recorriendo el suelo.', 'You can see waves rolling through the ground.'), C([-1500, 1000, 3500], [0, 40, 1300])),
      P(9.5, T('CHILE, 1960: EL RÉCORD', 'CHILE, 1960: THE RECORD'), T('No queda nada en pie.', 'Nothing is left standing.'), C([-2100, 1600, 4400], [0, 0, 1400]), { sfx: [['derrumbe', .7, .4]] }),
      P(10, T('NUNCA REGISTRADO', 'NEVER RECORDED'), T('Los sismólogos revisan si se les ha roto la máquina.', 'Seismologists check if their machines are broken.'), C([-2300, 2100, 4700], [0, 0, 1400])),
      P(11, T('TIEMBLA UN CONTINENTE', 'A WHOLE CONTINENT SHAKES'), T('Se nota en la otra punta del planeta.', 'They feel it on the other side of the planet.'), C([-2500, 3000, 5000], [0, 0, 1300])),
      P(12.5, T('EL ASTEROIDE DE LOS DINOSAURIOS', 'THE DINOSAUR ASTEROID'), T('La tierra se abre en dos.', 'The ground splits in two.'), C([-2600, 4200, 5200], [0, 0, 1300]), { sima: true, sfx: [['impacto', .8, .3]] }),
      P(15, T('UN MILLÓN DE SUPERVOLCANES', 'A MILLION SUPERVOLCANOES'), T('Se derrumban las cordilleras.', 'Mountain ranges crumble.'), C([-6000, 12000, 12000], [0, 0, 1300]), { sfx: [['riser', .5, 1.4]] }),
      P(18.4, T('LA ENERGÍA QUE MANTIENE UNIDA LA TIERRA', 'THE ENERGY HOLDING EARTH TOGETHER'), T('El planeta se parte.', 'The planet breaks apart.'), C([0, 1.5e6, 1.8e7], [0, -6.371e6, 0]),
        { duracion: 8, dur: 7, planeta: true, sfx: [['planeta', 1, 3.1]], camas: { dron: .35, espacio: .3 } }),
    ],
    marcas: [
      { texto: T('Torre Eiffel · 330 m', 'Eiffel Tower · 330 m'), pos: [-120, 350, 1280], fases: [10, 11] },
      { texto: T('Burj Khalifa · 828 m', 'Burj Khalifa · 828 m'), pos: [300, 850, 1640], fases: [10, 11, 12] },
    ],
    cierre: { titulo: T('No queda nada.', 'Nothing is left.'), pregunta: T('¿Qué duplicamos ahora? 👇', 'What should we double next? 👇') },
  };
})();
