// Muestra de estilo: el Decano, con su candil, examina a Feijolo; la luz proyecta la sombra de Feijolo en la pared (teatro de sombras).
(() => {
  function examen(t, lt, dur) {
    camBegin(960 + 25 * Math.sin(lt * .4), 560, 1.02 + .015 * lt);
    boilSeed('fondo'); paint(rectPts(-200, -200, W + 400, H + 400), { wash: SEPIA.fondo, ink: null });
    boilSeed('pared'); paint(rectPts(-200, 760, W + 400, 600), { fill: '#C9A46E', fillOp: 200, bleed: .15, tex: .6, ink: null });
    const lx = 700, ly = 520;                                    // el candil
    glow(lx, ly, 900, '#FFB851', .55 + .08 * Math.sin(lt * 5.3) + .05 * Math.sin(lt * 9.1));
    // sombra gigante de Feijolo en la pared, alargada como en el teatro de sombras
    push(); translate(1500, 900); scale(1.9, 1.75); translate(-1500, -900);
    persona(1500, 900, 23, PERSONAS.feijolo, { aR: .5 + .25 * Math.sin(lt * 1.4), eR: 1.3, silueta: '#4A3018', siluetaOp: 150 });
    pop();
    // suelo
    boilSeed('suelo'); paint(rectPts(-200, 975, W + 400, 300), { wash: '#A8804F', ink: null }); inkLine([[-100, 975], [W + 100, 972]], 1.2, SEPIA.sombra, 'dry');
    // Feijolo
    persona(1300, 980, 30, PERSONAS.feijolo, { aR: .5 + .25 * Math.sin(lt * 1.4), eR: 1.3, aL: .08, lookX: -.8, cejas: .3, parp: (lt % 3.3) < .12 ? 1 : 0, cabezaRot: .03 * Math.sin(lt * 1.1) });
    // el Decano, encorvado, con candil y lupa
    persona(620, 980, 30, PERSONAS.decano, { aR: .55, eR: 1.1, manoR: lupa, aL: .25, eL: .2, manoL: candil, lookX: 1, boca: .5 + .4 * Math.sin(lt * 9), cejas: .6, lean: .06 });
    camEnd();
    if (lt < .6) iris(960, 540, lerp(0, 1400, easeIn(lt / .6)));
  }
  shots([[0, examen]]);
})();
