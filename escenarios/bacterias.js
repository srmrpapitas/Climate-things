// Las bacterias que mutan el doble de rápido: se duplica la velocidad de mutación, 16 pasos de ×1 a ×32.768.
// Lo normal: una bacteria se copia cada 20 minutos y comete ≈ 0,001 mutaciones por copia del genoma
// (4,6 millones de letras a ≈ 10⁻¹⁰ por letra). Con eso ya ganan: 1,27 millones de muertes al año por resistencia (2019).
// Si la resistencia aparece proporcional a la velocidad de mutación, el antibiótico nuevo que hoy aguanta diez años
// aguanta diez años divididos por la velocidad (lo calcula fenomenos/bacterias.js).
// Tope físico: el umbral de error. Pasado ≈ 1 fallo por copia, cada copia sale rota y la estirpe se deshace sola.
// Cifras aproximadas: compruébalas antes de publicar.
window.ESCENARIOS = window.ESCENARIOS || {};
(() => {
  const C = (pos, mira) => ({ pos, mira }), H = (pos, mira) => ({ pos, mira, cerca: true }), // H: sigue al protagonista
    P = (sub, texto, camara, extra) => ({ sub, texto, camara, ...extra });
  const ESP = [0, -6.371e6, 0];
  window.ESCENARIOS.bacterias = {
    id: 'bacterias',
    tipo: 'bacterias',
    titulo: T('Las bacterias que mutan más rápido', 'The faster-mutating bacteria'),
    pregunta: T('¿Y si las bacterias mutaran el doble de rápido cada vez?', 'What if bacteria mutated twice as fast every time?'),
    unidad: '×',
    inicial: 1,
    multiplicador: 2,
    ritmo: 3.6, introDur: 2.8,
    paso: T('VELOCIDAD', 'SPEED'),
    lema: T('MUTAN EL DOBLE DE RÁPIDO CADA VEZ', 'TWICE THE MUTATION RATE EVERY TIME'),
    intro: { pos: [-10.4, 8.2, 127.5], mira: [-11.5, 7.4, 120] },
    sonido: { camas: { dron: .3, ciudad: .5 }, paso: 'whoosh', pasoGan: .25 },
    fases: [
      P(T('COMO SIEMPRE', 'JUST LIKE TODAY'),
        T('Una de cada mil copias sale con un fallo, y se copian cada veinte minutos. Con eso ya nos ganan: la resistencia a los antibióticos mata a más de un millón de personas al año. Tú, de momento, desayunas.',
          'One copy in a thousand comes out with a mistake, and they copy themselves every twenty minutes. That is already enough to beat us: antibiotic resistance kills over a million people a year. You, meanwhile, are having breakfast.'),
        H([-10.7, 4.9, 125.2], [-11.5, 4.25, 120])),
      P(T('EL DOBLE DE DEPRISA', 'TWICE AS FAST'),
        T('El doble de fallos es el doble de lotería: la resistencia aparece el doble de rápido. El antibiótico nuevo aguanta cinco años en vez de diez. En el laboratorio cancelan la fiesta de lanzamiento.',
          'Twice the mistakes means twice the lottery tickets: resistance turns up twice as fast. A new antibiotic lasts five years instead of ten. Back at the lab, they cancel the launch party.'),
        H([-9.9, 5.4, 127], [-11.5, 4.3, 120])),
      P(T('DOS AÑOS Y MEDIO', 'TWO AND A HALF YEARS'),
        T('Cuatro veces más deprisa. Un antibiótico tarda diez años en desarrollarse y ahora dura dos y medio: nace caducado. Los médicos empiezan a guardar los buenos bajo llave.',
          'Four times faster. An antibiotic takes ten years to develop and now lasts two and a half: it is born expired. Doctors start keeping the good ones under lock and key.'),
        H([-9.2, 5.9, 129], [-11.5, 4.3, 120]),
        { inserto: { plano: 'enfermo', pos: [-8.2, 4.4, 124.8], mira: [-11.2, 3.3, 121.2], t: 1.6, dur: 1.5 } }),
      P(T('QUINCE MESES', 'FIFTEEN MONTHS'),
        T('Ocho veces. Cada bacteria de tu intestino prueba una llave nueva cada veinte minutos, y hay más bacterias en ti que células tuyas. Se acabó eso de pedir antibióticos por teléfono.',
          'Eight times. Every bacterium in your gut tries a new key every twenty minutes, and there are more of them in you than you have cells. So much for getting antibiotics over the phone.'),
        H([-8.6, 6.6, 131], [-11.5, 4.2, 120])),
      P(T('SIETE MESES Y MEDIO', 'SEVEN AND A HALF MONTHS'),
        T('Dieciséis veces más deprisa. El antibiótico caduca antes que el yogur de la nevera. Las operaciones de rodilla se vuelven una apuesta.',
          'Sixteen times faster. The antibiotic expires before the yoghurt in your fridge. A knee operation becomes a gamble.'),
        // casi en línea con la acera (las farolas van por x ≈ -9): si la cámara se abre hacia la avenida, una le tapa la cara
        H([-11.1, 4.7, 128.2], [-11.5, 4.15, 121.5]),
        { sfx: [['grito', .25, 1.4]] }),
      P(T('CASI CUATRO MESES', 'NOT QUITE FOUR MONTHS'),
        T('Treinta y dos veces. Ningún antibiótico aguanta un curso escolar. El hospital pone un cartel nuevo cada lunes.',
          'Thirty-two times. No antibiotic survives a school year. The hospital puts up a new sign every Monday.'),
        H([-7, 9, 136], [-11.5, 4, 120]),
        { camas: { panico: .2 } }),
      P(T('DOS MESES', 'TWO MONTHS'),
        T('Sesenta y cuatro veces. Las bacterias se pasan las resistencias unas a otras como cromos, incluso entre especies distintas. Dos meses y a por el siguiente.',
          'Sixty-four times. Bacteria swap resistances with each other like trading cards, even between different species. Two months and on to the next one.'),
        // mira a media avenida y no al punto de fuga: el enjambre se centra en lo que mira la cámara
        C([5, 18, 118], [-4, 3, 165]),
        { sfx: [['alarmas', .25, 1]] }),
      P(T('UN MES', 'ONE MONTH'),
        T('Ciento veintiocho veces. Un antibiótico dura lo que una suscripción de prueba. En el hospital ya no preguntan cuál te va bien, sino cuál queda.',
          'A hundred and twenty-eight times. An antibiotic lasts about as long as a free trial. At the hospital they no longer ask which one works for you, but which one is left.'),
        C([-70, 40, 100], [0, 10, 300]),
        { inserto: { plano: 'heroe', pos: [-6.8, 5.2, 123.5], mira: [-11.5, 3.9, 121], t: 1.2, dur: 2.4 } }),
      P(T('DOS SEMANAS', 'TWO WEEKS'),
        T('Doscientas cincuenta y seis veces. Se nos acaban los antibióticos de reserva, los que se guardaban para lo peor. Ya solo quedan los nombres impronunciables.',
          'Two hundred and fifty-six times. We run out of last-resort antibiotics, the ones saved for the worst cases. All that is left are the unpronounceable names.'),
        C([-160, 70, 40], [0, 10, 320]),
        { camas: { ciudad: .25, panico: .3 } }),
      P(T('UNA SEMANA', 'ONE WEEK'),
        T('Quinientas doce veces. Un arañazo vuelve a ser algo serio, como en 1850. Nadie se atreve a ponerse un piercing.',
          'Five hundred and twelve times. A scratch is serious business again, like in 1850. Nobody dares get a piercing.'),
        C([-320, 150, -60], [0, 20, 420]),
        { sfx: [['panico', .3, .4]] }),
      // aquí se cruza el umbral de error: 0,001 × 1.024 ≈ 1 fallo por copia
      P(T('UN FALLO POR COPIA', 'ONE MISTAKE PER COPY'),
        T('Mil veinticuatro veces, y aquí la física pone el freno: el umbral de error. A un fallo por copia, cada hija nace con una pieza mal puesta y la estirpe empieza a deshacerse sola.',
          'A thousand and twenty-four times, and here physics puts its foot down: the error threshold. At one mistake per copy, every daughter cell is born with a part in the wrong place, and the line starts to fall apart by itself.'),
        C([-700, 320, -300], [0, 30, 500]),
        { camas: { panico: .15 } }),
      P(T('SE ROMPEN SOLAS', 'THEY BREAK THEMSELVES'),
        T('Dos mil cuarenta y ocho veces: dos fallos por copia. Se rompen más rápido de lo que se multiplican, y por primera vez en cuatro mil millones de años las bacterias van perdiendo.',
          'Two thousand and forty-eight times: two mistakes per copy. They break faster than they multiply, and for the first time in four billion years the bacteria are losing.'),
        C([-1500, 700, -900], [0, 40, 600]),
        { camas: { ciudad: .1 }, inserto: { plano: 'calle', pos: [-4, 3.4, 168], mira: [-9, 3.2, 186], t: 1.4, dur: 2.4 } }),
      P(T('Y RESULTA QUE HACÍAN FALTA', 'TURNS OUT WE NEEDED THEM'),
        T('Cuatro mil noventa y seis veces. Las que te digerían la comida se deshacen dentro de ti. Resulta que llevabas cuarenta billones de ellas y no eran de adorno.',
          'Four thousand and ninety-six times. The ones that digested your food fall apart inside you. Turns out you were carrying forty trillion of them and they were not decoration.'),
        C([-2600, 1200, -1500], [0, 50, 700])),
      P(T('EL SUELO SE PARA', 'THE SOIL STOPS'),
        T('Ocho mil ciento noventa y dos veces. Nadie fija el nitrógeno y nadie descompone nada: las plantas se quedan sin abono y lo que se muere ya no se pudre, se queda ahí.',
          'Eight thousand one hundred and ninety-two times. Nobody fixes nitrogen and nobody decomposes anything: plants are left without fertiliser and what dies no longer rots, it just stays there.'),
        C([-5200, 2400, -3000], [0, 60, 800])),
      P(T('EL MAR SE APAGA', 'THE SEA GOES OUT'),
        T('Dieciséis mil veces. Casi la mitad del oxígeno que respiras lo hacen bacterias del mar, y se están deshaciendo todas a la vez. El aire deja de reponerse.',
          'Sixteen thousand times. Almost half the oxygen you breathe is made by bacteria in the sea, and they are all falling apart at once. The air stops being topped up.'),
        C([0, 9e6, 1.5e7], ESP),
        { planeta: true, camas: { ciudad: 0, panico: 0, espacio: .3 }, dur: 5 }),
      // último paso: las 10³⁰ bacterias del planeta (70 gigatoneladas de carbono, más que todos los animales juntos)
      // se rompen a la vez. Sin ellas no hay ciclos: la Tierra se queda esterilizada y el aire no se repone.
      P(T('UNA TIERRA ESTÉRIL', 'A STERILE EARTH'),
        T('Treinta y dos mil veces. Las bacterias de la Tierra son un uno con treinta ceros de células y pesan más que todos los animales juntos, y se rompen todas a la vez. Se paran los ciclos, se apaga el aire y queda una Tierra estéril: una piedra con mares.',
          'Thirty-two thousand times. Earth\'s bacteria are a one with thirty zeros of cells and weigh more than every animal put together, and they all break at once. The cycles stop, the air goes flat, and what is left is a sterile Earth: a rock with oceans.'),
        C([0, 6e6, 3.2e7], ESP),
        { planeta: true, dur: 8, sfx: [['riser', .6, 0], ['asfixia', .4, 1.6]], camas: { dron: .35, espacio: .3 } }),
    ],
    // el cierre, corto: con un título largo la pregunta se sale del encuadre 9:16
    cierre: { titulo: T('Invictas cuatro mil millones de años. Hasta hoy.', 'Four billion years unbeaten. Until today.'), pregunta: T('¿Qué duplicamos ahora? 👇', 'What should we double next? 👇') },
  };
})();
