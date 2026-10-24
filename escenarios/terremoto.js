// Terremoto cada vez más fuerte. Cada punto de magnitud libera unas 32 veces más energía.
// Energía: E = 10^(1,5·M + 4,8) J (relación de Gutenberg-Richter). Cifras aproximadas: compruébalas antes de publicar.
// valor: magnitud. duracion: segundos que tiembla. sima: se abre una grieta enorme. planeta: la Tierra se parte.
// camara: posición y punto al que mira [x, y, z]. El mar está en z negativo y la ciudad en z positivo.
window.ESCENARIOS = window.ESCENARIOS || {};
(() => {
  const C = (pos, mira) => ({ pos, mira }), D = 3.4, H = (pos, mira) => ({ pos, mira, cerca: true }); // H: sigue al protagonista
  const P = (valor, sub, texto, camara, extra) => ({ valor, duracion: D, sub, texto, camara, ...extra });
  const calle = H([-10.9, 4.9, 554.8], [-11.5, 4.25, 560]), calle2 = H([-8, 7.5, 550], [-11.5, 4.2, 560]);
  window.ESCENARIOS.terremoto = {
    id: 'terremoto',
    tipo: 'terremoto',
    titulo: T('El terremoto que no para de crecer', 'The earthquake that keeps growing'),
    pregunta: T('¿Y si cada terremoto fuera más fuerte que el anterior?', 'What if every earthquake was stronger than the last?'),
    ritmo: 3.2, introDur: 2.8,
    paso: T('TERREMOTO', 'QUAKE'),
    lema: T('CADA PUNTO, 32 VECES MÁS ENERGÍA', 'EVERY POINT = 32× MORE ENERGY'),
    intro: { pos: [-10.6, 8.2, 552.5], mira: [-11.5, 7.4, 560] },
    sonido: { camas: { dron: .3, ciudad: .5 }, paso: 'terremoto', pasoGan: .55 },
    fases: [
      P(3, T('UN CAMIÓN QUE PASA', 'A TRUCK DRIVING PAST'), T('Media tonelada de TNT bajo tierra. Las lámparas se balancean un poco.', 'Half a tonne of TNT underground. The lamps sway a little.'), calle),
      P(4, T('UN TEMBLOR PEQUEÑO', 'A SMALL TREMOR'), T('Quince toneladas de TNT. Tintinean los vasos de la estantería.', 'Fifteen tonnes of TNT. Glasses rattle on the shelves.'), calle),
      P(5, T('UN TERREMOTO MODERADO', 'A MODERATE QUAKE'), T('Quinientas toneladas de TNT. Se agrietan las paredes y todos salen a la calle.', 'Five hundred tonnes of TNT. Walls crack and everyone runs outside.'), calle2,
        { sfx: [['panico', .4, .5]], inserto: { pos: [4, 2.5, 538], mira: [-16, 9, 572], t: 1.2, dur: 2, efecto: 'cristales' } }),
      P(5.5, T('UN TERREMOTO FUERTE', 'A STRONG QUAKE'), T('Casi tres mil toneladas de TNT. Las casas viejas empiezan a ceder.', 'Almost three thousand tonnes of TNT. Old houses start to give way.'), calle2),
      P(6, T('LA BOMBA DE HIROSHIMA', 'THE HIROSHIMA BOMB'), T('Una bomba de Hiroshima bajo tus pies. Se hunden las casas bajas.', 'A Hiroshima bomb under your feet. Low houses collapse.'), C([-20, 90, 640], [0, 10, 380]),
        { sfx: [['derrumbe', .5, .8]], inserto: { plano: 'cae', alto: [0, 13], t: 1, dur: 2.4 } }),
      P(6.7, T('LOS ÁNGELES, 1994', 'LOS ANGELES, 1994'), T('Once Hiroshimas. En Los Ángeles se partieron las autopistas.', 'Eleven Hiroshimas. In Los Angeles, freeways snapped in half.'), C([-200, 180, 650], [0, 10, 550]), { sfx: [['derrumbe', .5, .6]] }),
      P(7, T('HAITÍ, 2010', 'HAITI, 2010'), T('Treinta Hiroshimas, como Haití en 2010. Caen los bloques de pisos.', 'Thirty Hiroshimas, like Haiti in 2010. Apartment blocks come down.'), C([-500, 350, 500], [0, 10, 800]),
        { sfx: [['derrumbe', .6, .5]], camas: { ciudad: .2 }, inserto: { plano: 'cae', alto: [13, 60], t: 1, dur: 2.6 } }),
      P(7.5, T('UN GRAN TERREMOTO', 'A MAJOR QUAKE'), T('Casi tres megatones. El suelo empieza a abrirse.', 'Almost three megatons. The ground starts to split open.'), C([-900, 500, 700], [0, 10, 900]),
        { sfx: [['derrumbe', .6, .5]], inserto: { plano: 'grieta', t: .3, dur: 2.2 } }),
      P(8, T('MÉXICO, 1985', 'MEXICO CITY, 1985'), T('Quince megatones, como México en 1985. Los rascacielos se balancean metros de lado a lado.', 'Fifteen megatons, like Mexico City in 1985. Skyscrapers sway metres from side to side.'), C([-1300, 750, 1000], [0, 30, 1000]), { camas: { ciudad: 0 } }),
      P(8.5, T('UN MEGATERREMOTO', 'A MEGAQUAKE'), T('Casi el doble que la bomba más grande de la historia. Empiezan a caer las torres.', 'Almost twice the biggest bomb ever built. The towers start to fall.'), C([-1700, 950, 1300], [0, 30, 1100]),
        { sfx: [['derrumbe', .7, .6]], inserto: { plano: 'cae', alto: [60, 1e4], t: 1, dur: 3 } }),
      P(9, T('JAPÓN, 2011', 'JAPAN, 2011'), T('Quinientos megatones, como Japón en 2011. Acortó el día y el suelo hizo olas.', 'Five hundred megatons, like Japan in 2011. It shortened the day, and the ground rolled in waves.'), C([-2100, 1200, 1700], [0, 40, 1300]),
        { inserto: { pos: [-140, 110, 280], mira: [0, 0, 800], t: 1.2, dur: 2.6 } }),
      P(9.5, T('CHILE, 1960: EL RÉCORD', 'CHILE, 1960: THE RECORD'), T('Casi tres gigatones. El más fuerte jamás medido. No queda nada en pie.', 'Almost three gigatons. The strongest ever recorded. Nothing is left standing.'), C([-2500, 1600, 2600], [0, 0, 1400]), { sfx: [['derrumbe', .7, .4]] }),
      P(10, T('NUNCA REGISTRADO', 'NEVER RECORDED'), T('Quince gigatones. Los sismólogos revisan si se les ha roto la máquina.', 'Fifteen gigatons. Seismologists check if their machines are broken.'), C([-2700, 2200, 3600], [0, 0, 1400])),
      P(11, T('TIEMBLA UN CONTINENTE', 'A WHOLE CONTINENT SHAKES'), T('Tres horas de toda la luz del Sol que llega a la Tierra. Se nota en la otra punta del planeta.', 'Three hours of all the sunlight that reaches Earth. They feel it on the other side of the planet.'), C([-2800, 3100, 4600], [0, 0, 1300])),
      P(12.5, T('EL ASTEROIDE DE LOS DINOSAURIOS', 'THE DINOSAUR ASTEROID'), T('Ochenta millones de megatones, como el asteroide de los dinosaurios. La tierra se abre en dos.', 'Eighty million megatons, like the dinosaur asteroid. The ground splits in two.'), C([-2600, 4200, 5200], [0, 0, 1300]),
        { sima: true, sfx: [['impacto', .8, .3]], inserto: { pos: [-420, 260, 600], mira: [0, 0, 1000], t: 1.6, dur: 2.4 } }),
      P(15, T('CINCO SEGUNDOS DE SOL', 'FIVE SECONDS OF SUN'), T('Todo lo que brilla el Sol en cinco segundos. Se derrumban las cordilleras.', 'Everything the Sun gives off in five seconds. Mountain ranges crumble.'), C([-6000, 12000, 12000], [0, 0, 1300]), { sfx: [['riser', .5, 1.4]] }),
      P(18.4, T('LA ENERGÍA QUE MANTIENE UNIDA LA TIERRA', 'THE ENERGY HOLDING EARTH TOGETHER'), T('Más de una semana de todo el Sol. Más de lo que mantiene unida la Tierra. El planeta se parte.', 'More than a week of the whole Sun. More than holds Earth together. The planet breaks apart.'), C([0, 1.5e6, 1.8e7], [0, -6.371e6, 0]),
        { duracion: 8, dur: 7, planeta: true, sfx: [['planeta', 1, 3.1]], camas: { dron: .35, espacio: .3 } }),
    ],
    cierre: { titulo: T('No queda nada.', 'Nothing is left.'), pregunta: T('¿Qué duplicamos ahora? 👇', 'What should we double next? 👇') },
  };
})();
