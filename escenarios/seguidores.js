// Especial 10k: la avenida se llena con el doble de gente cada vez y todos gritan BOMBOCLAT (seguidores reales: 8.206 el 30-10-2026).
// dB = 88 + 10·log10(personas): todos igual de cerca, caso ideal. «Veces más fuerte» = 2^(ΔdB/10) (+10 dB ≈ el doble para el oído).
// Récord de ruido en un estadio: 142,2 dB, Arrowhead Stadium (Kansas City), 29-9-2014, Guinness.
// Cámaras absolutas: el protagonista está en (0, 3, 200) mirando a −z.
window.ESCENARIOS = window.ESCENARIOS || {};
(() => {
  // plano según cuánta gente hay: más lejos y más alto cuanto más ocupa la multitud
  const C = d => ({ pos: [d * .32, 4.2 + d * .58, 200 - d * .85], mira: [0, 3.6 + d * .05, 200 + d * .25] });
  const P = (valor, sub, texto, d, extra) => ({ valor, sub, texto, camara: C(d), cielo: 0x9fd3f0, ...extra });
  window.ESCENARIOS.seguidores = {
    id: 'seguidores',
    tipo: 'seguidores',
    titulo: T('Especial 10.000: todos gritando BOMBOCLAT', '10K special: everyone shouting BOMBOCLAT'),
    pregunta: T('8.206 personas gritando NO suenan 8.206 veces más fuerte', '8,206 people shouting are NOT 8,206 times louder'),
    unidad: '',
    ritmo: 2.4, introDur: 3.2, vozRetraso: .9, pausa: .4,
    paso: T('PASO', 'STEP'),
    lema: T('EL DOBLE DE GENTE CADA VEZ', 'TWICE THE CROWD EVERY TIME'),
    intro: { pos: [60, 95, 40], mira: [0, 0, 215], dur: 0 },
    sonido: { camas: { ciudad: .35, dron: .12 }, extra: [...Array(10)].map((_, i) => 'bomboclat/' + String(i).padStart(2, '0')).concat(['ovacion', 'impacto']) },
    fases: [
      P(1, T('UNO SOLO', 'JUST ONE'), T('Uno solo. Ochenta y ocho decibelios, como un cortacésped.', 'Just one. Eighty-eight decibels, like a lawnmower.'), 5),
      P(2, T('EL DOBLE', 'DOUBLE'), T('Dos. El doble de energía, pero solo tres decibelios más.', 'Two. Twice the energy, but only three decibels more.'), 6),
      P(4, T('CUATRO', 'FOUR'), T('Cuatro. Tu oído casi no nota la diferencia.', 'Four. Your ear barely notices.'), 7),
      P(8, T('OCHO', 'EIGHT'), T('Ocho. Para sonar el doble de fuerte hace falta diez veces más gente.', 'To sound twice as loud you need ten times the people.'), 8),
      P(16, T('POR FIN, EL DOBLE', 'FINALLY, TWICE AS LOUD'), T('Dieciséis. Por fin, el doble de fuerte que uno solo.', 'Sixteen. Finally, twice as loud as one.'), 10),
      P(32, T('UN MARTILLO NEUMÁTICO', 'A JACKHAMMER'), T('Treinta y dos. Como un martillo neumático.', 'Thirty-two. Like a jackhammer.'), 12),
      P(64, T('LOS VECINOS SE ASOMAN', 'THE NEIGHBOURS LOOK OUT'), T('Sesenta y cuatro. Los vecinos se asoman.', 'Sixty-four. The neighbours look out.'), 15),
      P(128, T('UN CONCIERTO DE ROCK', 'A ROCK CONCERT'), T('Ciento veintiocho. Un concierto de rock.', 'A hundred and twenty-eight. A rock concert.'), 19),
      P(256, T('UNA SIRENA DE CERCA', 'A SIREN UP CLOSE'), T('Doscientos cincuenta y seis. Una sirena pegada a la oreja.', 'Two hundred and fifty-six. A siren right by your ear.'), 25),
      P(512, T('NI EL MÓVIL', 'NOT EVEN YOUR PHONE'), T('Quinientos doce. Ya no oyes ni el móvil.', 'Five hundred and twelve. You can\'t even hear your phone.'), 33),
      P(1024, T('UN TRUENO', 'A THUNDERCLAP'), T('Mil veinticuatro. Ciento dieciocho decibelios: un trueno.', 'One thousand and twenty-four. A hundred and eighteen decibels: thunder.'), 44),
      P(2048, T('EL UMBRAL DEL DOLOR', 'THE THRESHOLD OF PAIN'), T('Dos mil cuarenta y ocho. El umbral del dolor.', 'Two thousand and forty-eight. The threshold of pain.'), 60),
      P(4096, T('UN AVIÓN DESPEGANDO', 'A JET TAKING OFF'), T('Cuatro mil noventa y seis. Un avión despegando al lado.', 'Four thousand and ninety-six. A jet taking off next to you.'), 85),
      P(8206, T('SOIS VOSOTROS', 'THIS IS YOU'), T('Ocho mil doscientos seis: sois vosotros. Quince veces más fuerte que uno. Gracias, esto lo habéis hecho vosotros.', 'Eight thousand two hundred and six: this is you. Fifteen times louder than one. Thank you, you made this.'), 130,
        { lema: T('GRACIAS A VOSOTROS', 'THANK YOU ALL'), fuegos: true, cielo: 0x1d2440, dur: 5, sfx: [['ovacion', .9, .6]] }),
      P(10000, T('LA META', 'THE GOAL'), T('A diez mil: ciento veintiocho decibelios. El récord de un estadio es ciento cuarenta y dos. Comenta bomboclat y tu nombre sale en el vídeo de los diez mil.', 'At ten thousand: a hundred and twenty-eight decibels. The stadium record is a hundred and forty-two. Comment bomboclat and your name goes in the ten thousand video.'), 150,
        { lema: T('META: 10.000', 'GOAL: 10,000'), fuegos: true, cielo: 0x141a30, dur: 5 }),
    ],
    cierre: { titulo: T('GRACIAS, 8.206', 'THANK YOU, 8,206'), pregunta: T('Comenta BOMBOCLAT + tu @ y sales en el vídeo de los 10.000 👇', 'Comment BOMBOCLAT + your @ to be in the 10K video 👇') },
  };
})();
