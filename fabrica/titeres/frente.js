// Vistas de frente y de espaldas de los títeres (las usa titeres.js cuando un actor tiene `vista: 'frente' | 'espalda'`).
// Mismo personaje y mismos gestos que de perfil: los brazos se abren hacia los lados, la cara tiene dos ojos con pupila,
// cejas, nariz, boca que se abre al hablar, orejas, barba con textura y gafas; de espaldas se ve la nuca y la abertura de la chaqueta.
(() => {
  const { clamp, mezcla, suave, azar, miembro, hueco, circulo, NEGRO, TAU, PELO, OBJETOS } = T;
  const LEJOS = '#2a1a10';

  // brazos de frente: ángulo desde abajo (+ hacia fuera) y codo (+ sube hacia fuera, − hacia el pecho)
  function brazosFrente(o, t, s) {
    const sw = Math.sin(TAU * o.faseFrente) * o.andaFrente;
    let d = [.16 + .05 * sw + .03 * T.ruido(t, s + 4), .12, 'abierta'], i = [.16 - .05 * sw + .03 * T.ruido(t, s + 5), .12, 'abierta'];
    const pon = (b, a, c, mano, w) => [mezcla(b[0], a, w), mezcla(b[1], c, w), w > .5 && mano ? mano : b[2]];
    for (const g of o.activos) {
      const w = g.w, ant = g.ant || 0, u = g.u;
      if (g.hace === 'puno') d = pon(d, 2.55 + .08 * Math.sin(t * 11) + .4 * ant, .35, 'puno', w);
      if (g.hace === 'senala') d = pon(d, 1.25 + .3 * ant, -.15, 'indice', w);
      if (g.hace === 'saluda') d = pon(d, 2.3, .5 + .4 * Math.sin(u * 10), 'abierta', w);
      if (g.hace === 'celebra') { d = pon(d, 2.75 + .12 * Math.sin(t * 9 + s), .15, 'abierta', w); i = pon(i, 2.75 + .12 * Math.sin(t * 9 + s + 1), .15, 'abierta', w); }
      if (g.hace === 'aplaude') { const k = .5 + .5 * Math.sin(t * 15 + s); d = pon(d, .55, -1.9 + .35 * k, 'abierta', w); i = pon(i, .55, -1.9 + .35 * k, 'abierta', w); }
      if (g.hace === 'encoge') { d = pon(d, .5, 1.3, 'abierta', w); i = pon(i, .5, 1.3, 'abierta', w); }
      if (g.hace === 'piensa') d = pon(d, .35, -2.5, 'puno', w);
      if (g.hace === 'golpea') d = pon(d, .9 + .5 * Math.max(0, Math.sin(u * 7)), -.6, 'puno', w);
      if (g.hace === 'brazos') { d = pon(d, g.h ?? 1, g.c ?? 0, null, w); }
    }
    const habla = o.activos.find(a => a.hace === 'habla');
    if (habla && !o.activos.some(a => !['habla', 'asiente', 'niega'].includes(a.hace))) { const golpe = Math.max(0, Math.sin(t * 4.3 + s)) ** 3;
      d = pon(d, .55 + .15 * Math.sin(t * 1.7 + s) + .15 * golpe, -1.2 + .5 * golpe, 'abierta', habla.w * .85); }
    return [d, i];
  }

  T.dibujaFrente = function (g, ac, t, o) {
    const p = ac.p, A = p.alto, G = p.grueso || 1, s = p.semilla || 1, esp = o.vista === 'espalda', E = (p.escala || 1) * o.z;
    const L1 = 80 * A * (p.piernas || 1), L2 = 78 * A * (p.piernas || 1), ph = TAU * o.faseFrente, lev = o.andaFrente, vf = (o.vf || 0) * (esp ? -1 : 1);
    g.save(); g.translate(o.x, 0); g.scale(E * o.giroVista, E * o.aplasta); g.fillStyle = g.strokeStyle = NEGRO;
    const caderaY = -(L1 + L2) * .965 + 4 * lev * Math.abs(Math.sin(ph)) + o.y, hw = 15 * G * A * (p.cintura || 1);
    // piernas: de frente, la que da el paso sube la rodilla
    for (const lado of [-1, 1]) {
      const sube = lev * Math.max(0, Math.sin(ph + (lado > 0 ? 0 : Math.PI))) * 26 * A;
      const cad = [lado * hw * .7, caderaY], pie = [lado * hw * .85, -sube], rod = [lado * hw * .8, mezcla(cad[1], pie[1], .5) - sube * .2];
      const w = (p.ropa === 'vestido' ? 9 : 14) * A * G;
      miembro(g, cad, rod, w + 2, w - 1); miembro(g, rod, [pie[0], pie[1] - 6 * A], w - 1, w - 5);
      g.beginPath(); g.ellipse(pie[0] + lado * 4 * A, pie[1] - 3 * A, 13 * A, 6 * A, 0, 0, TAU); g.fill();
    }
    // tronco y ropa
    const largo = 112 * A, hom = 31 * G * A * (p.hombros || 1) + 2 * o.hombros, top = caderaY - largo - o.hombros, bar = (p.barriga || 0) * 14 * A;
    g.save(); g.translate(0, caderaY); g.rotate(.02 * Math.sin(t * 1.1 + s)); g.scale(1 + .015 * o.respira, 1 + .008 * o.respira);
    g.beginPath(); g.moveTo(-hw * 1.35 - bar, 6 * A); g.bezierCurveTo(-hw * 1.6 - bar, -largo * .4, -hom - 4, -largo * .75, -hom, -largo - o.hombros);
    g.quadraticCurveTo(0, -largo - 8 * A - o.hombros, hom, -largo - o.hombros); g.bezierCurveTo(hom + 4, -largo * .75, hw * 1.6 + bar, -largo * .4, hw * 1.35 + bar, 6 * A); g.closePath(); g.fill();
    if (p.ropa === 'traje') {
      g.beginPath(); g.moveTo(-hw * 1.45 - bar, -4 * A); g.lineTo(-hw * 1.5 - bar, 28 * A); g.lineTo(hw * 1.5 + bar, 28 * A); g.lineTo(hw * 1.45 + bar, -4 * A); g.fill();
      if (!esp) {
        hueco(g, () => { g.moveTo(-10 * A, -largo + 2 * A); g.lineTo(10 * A, -largo + 2 * A); g.lineTo(0, -largo * .5); g.closePath(); });   // camisa
        const cv = vf * 22 * A * (.7 + .3 * Math.sin(t * 11)), cy = -Math.abs(vf) * 12 * A;   // corbata al viento
        g.beginPath(); g.moveTo(-3 * A, -largo + 6 * A); g.lineTo(3 * A, -largo + 6 * A); g.quadraticCurveTo(4 * A + cv * .4, -largo * .75, 4.5 * A + cv, -largo * .58 + cy); g.lineTo(cv, -largo * .52 + cy); g.lineTo(-4.5 * A + cv, -largo * .58 + cy); g.quadraticCurveTo(-4 * A + cv * .4, -largo * .75, -3 * A, -largo + 6 * A); g.closePath(); g.fill();   // corbata
        g.beginPath(); g.moveTo(-3.5 * A, -largo + 3 * A); g.lineTo(3.5 * A, -largo + 3 * A); g.lineTo(2.5 * A, -largo + 8 * A); g.lineTo(-2.5 * A, -largo + 8 * A); g.fill();   // nudo
        hueco(g, () => { for (const l of [-1, 1]) { g.moveTo(l * 11 * A, -largo + 2 * A); g.lineTo(l * 1.5 * A, -largo * .48); g.lineTo(l * 2.5 * A, -largo * .47); g.lineTo(l * 12.5 * A, -largo + 3 * A); } });   // solapas
        hueco(g, () => { for (let k = 0; k < 2; k++) circulo(g, 0, -largo * (.4 - k * .14), 2 * A); g.rect(-hw * 1.3, -largo * .56, 9 * A, 2 * A); });   // botones y bolsillo
      } else hueco(g, () => { g.rect(-1 * A, -4 * A, 2 * A, 30 * A); });   // abertura de atrás
    }
    if (p.ropa === 'tunica') {
      const vt = vf * 20 * A, bajo = -caderaY - 12 * A;
      g.beginPath(); g.moveTo(-hom, -largo); g.quadraticCurveTo(-hw * 2.2 + vt * .4, bajo * .5, -hw * 2.6 + vt, bajo);
      for (let k = 0; k <= 10; k++) g.lineTo(mezcla(-hw * 2.6, hw * 2.6, k / 10) + vt, bajo + (k % 2 ? 7 * A : 0) + 2 * Math.sin(t * 3 + k));
      g.quadraticCurveTo(hw * 2.2 + vt * .4, bajo * .5, hom, -largo); g.closePath(); g.fill();
      if (p.jirones) for (let k = 0; k < 18; k++) { const x = mezcla(-hw * 2.6, hw * 2.6, (k + .5) / 18) + vt, l = (12 + 26 * azar(k + 7)) * A, an = vf * .9 + .35 * Math.sin(t * 8 + k * 1.7) * (.3 + Math.abs(vf));
        g.beginPath(); g.moveTo(x - 4 * A, bajo); g.lineTo(x + 4 * A, bajo); g.lineTo(x + Math.sin(an) * l, bajo + Math.cos(an) * l); g.closePath(); g.fill(); }
      hueco(g, () => { for (let k = 0; k < 9; k++) circulo(g, mezcla(-hw * 2.3, hw * 2.3, (k + .5) / 9), -caderaY - 26 * A, 2.8 * A);
        if (!esp) for (let k = 0; k < 6; k++) circulo(g, 0, -largo * (.88 - k * .15), 2.2 * A); });
    }
    if (p.ropa === 'vestido') {
      const vu = 5 * Math.sin(t * 2.3 + s);
      g.beginPath(); g.moveTo(-hw * 1.2, -largo * .45); g.quadraticCurveTo(-hw * 2.6 + vu, -caderaY * .2, -hw * 2.9 + vu, -caderaY * .42);
      for (let k = 0; k <= 8; k++) g.lineTo(mezcla(-hw * 2.9, hw * 2.9, k / 8) + vu, -caderaY * .42 + (k % 2 ? 6 * A : 0));
      g.quadraticCurveTo(hw * 2.6 + vu, -caderaY * .2, hw * 1.2, -largo * .45); g.closePath(); g.fill();
      hueco(g, () => { for (let k = 0; k < 7; k++) circulo(g, mezcla(-hw * 2.5, hw * 2.5, (k + .5) / 7) + vu, -caderaY * .42 - 10 * A, 2.4 * A); });
      if (!esp) hueco(g, () => { g.moveTo(-9 * A, -largo + 2 * A); g.quadraticCurveTo(0, -largo + 16 * A, 9 * A, -largo + 2 * A); g.lineTo(7 * A, -largo + 2 * A); g.quadraticCurveTo(0, -largo + 12 * A, -7 * A, -largo + 2 * A); });
    }
    g.restore();
    // brazos (de espaldas, el derecho queda a la izquierda)
    const [bd, bi] = brazosFrente(o, t, s);
    for (const [lado, b] of [[1, bd], [-1, bi]]) {
      const x = (esp ? -lado : lado) * hom * .92, hombro = [x, top + 8 * A], sl = Math.sign(x) || 1;
      const codo = [hombro[0] + sl * 62 * A * Math.sin(b[0]), hombro[1] + 62 * A * Math.cos(b[0])];
      const a2 = b[0] + b[1], mu = [codo[0] + sl * 56 * A * Math.sin(a2), codo[1] + 56 * A * Math.cos(a2)], w = 12 * A * G;
      miembro(g, hombro, codo, w + 1, w - 2); miembro(g, codo, mu, w - 2, w - 4);
      g.save(); g.translate(mu[0], mu[1]); g.rotate(-sl * a2);
      if (b[2] === 'puno') { g.beginPath(); g.arc(0, 8 * A, 9 * A, 0, TAU); g.fill(); if (!esp) hueco(g, () => { for (let k = 0; k < 3; k++) g.rect(-6 * A + k * 4 * A, 10 * A, 1.2 * A, 4 * A); }); }
      else if (b[2] === 'indice') { g.beginPath(); g.arc(0, 7 * A, 8 * A, 0, TAU); g.fill(); g.beginPath(); g.ellipse(0, 9 * A, 3.5 * A, 3.5 * A, 0, 0, TAU); g.fill(); }
      else { g.beginPath(); g.ellipse(0, 10 * A, 7 * A, 12 * A, 0, 0, TAU); g.fill(); g.beginPath(); g.ellipse(sl * -6 * A, 5 * A, 3 * A, 7 * A, sl * .6, 0, TAU); g.fill();
        if (!esp) hueco(g, () => { for (let k = 0; k < 3; k++) g.rect(-4 * A + k * 3 * A, 14 * A, 1 * A, 6 * A); }); }
      g.restore();
      const ob = lado > 0 ? p.objeto : p.objetoLejos;
      if (ob && OBJETOS[ob]) OBJETOS[ob](g, mu, sl * a2, t, o, A);
    }
    // cabeza
    g.save(); g.translate(0, top - 2 * A); g.rotate(.5 * o.cabeza + .03 * Math.sin(t * .9 + s)); g.scale((p.cabeza || 1) * A * o.cabezaAncho, (p.cabeza || 1) * A);
    if (o.activos.some(a => a.hace === 'asiente')) g.translate(0, 3 * Math.max(0, Math.sin(t * 8)));
    esp ? cabezaEspalda(g, p, t, o) : cabezaFrente(g, p, t, o);
    g.restore();
    g.restore();
  };

  function cara(g, p, ancho, boca) {   // óvalo de la cara con mentón; la mandíbula baja al hablar
    const m = p.menton || 'redondo', bj = 4 * boca, w = ancho;
    g.beginPath(); g.moveTo(-w, -44); g.bezierCurveTo(-w, -74, w, -74, w, -44);
    if (m === 'marcado') { g.lineTo(w * .92, -22); g.lineTo(w * .45, -8 + bj); g.lineTo(-w * .45, -8 + bj); g.lineTo(-w * .92, -22); }
    else if (m === 'doble') { g.bezierCurveTo(w * 1.05, -16, w * .5, -6 + bj, 0, -6 + bj); g.bezierCurveTo(-w * .5, -6 + bj, -w * 1.05, -16, -w, -44); }
    else { g.bezierCurveTo(w, -20, w * .45, -9 + bj, 0, -9 + bj); g.bezierCurveTo(-w * .45, -9 + bj, -w, -20, -w, -44); }
    g.closePath(); g.fill();
  }
  function cabezaFrente(g, p, t, o) {
    const w = 23, b = o.boca, ce = clamp(o.cejas, -1, 1), ojos = o.ojos, n = p.nariz || 1;
    g.fillRect(-9, -16, 18, 18);                                        // cuello
    if (p.ropa === 'traje') hueco(g, () => { g.moveTo(-10, 0); g.lineTo(-9, -6); g.lineTo(0, 2); g.lineTo(9, -6); g.lineTo(10, 0); g.lineTo(0, 6); g.closePath(); });   // cuello de la camisa
    for (const l of [-1, 1]) { g.beginPath(); g.ellipse(l * (w + 2), -42, 5, 9, 0, 0, TAU); g.fill(); hueco(g, () => g.ellipse(l * (w + 2.5), -42, 1.6, 4.5, 0, 0, TAU)); }   // orejas
    cara(g, p, w, b);
    if (p.barba === 'corta' || p.barba === 'larga') {
      const lg = p.barba === 'larga' ? 24 : 6;
      g.beginPath(); g.moveTo(-w - 1, -36); g.quadraticCurveTo(-w, -8, -8, -2 - lg); for (let k = 0; k <= 6; k++) g.lineTo(-8 + k * 16 / 6, -2 - lg + (k % 2 ? 5 : 0) - lg * .1 * Math.sin(k));
      g.quadraticCurveTo(w, -8, w + 1, -36); g.lineTo(w - 3, -36); g.quadraticCurveTo(w - 4, -18, 0, -16); g.quadraticCurveTo(-w + 4, -18, -w + 3, -36); g.closePath(); g.fill();
      hueco(g, () => { for (let k = 0; k < 26; k++) { const a = azar(k + p.semilla), c = azar(k + 40 + p.semilla); circulo(g, (a - .5) * 2 * (w - 4), -34 + c * 26, .7); } });
    }
    // ojos: almendra calada, pupila que mira, párpado; parpadean
    for (const l of [-1, 1]) {
      const x = l * 9;
      if (!o.parpadea) {
        hueco(g, () => { g.moveTo(x - 6, -44); g.quadraticCurveTo(x, -49.5, x + 6, -44); g.quadraticCurveTo(x, -40.5, x - 6, -44); });
        g.beginPath(); circulo(g, x + ojos * 2, -44.3, 2.3); g.fill();
        g.beginPath(); g.moveTo(x - 6.5, -44.2); g.quadraticCurveTo(x, -50.5, x + 6.5, -44.2); g.lineTo(x + 5.5, -44.5); g.quadraticCurveTo(x, -48.8, x - 5.5, -44.5); g.fill();
      } else hueco(g, () => { g.moveTo(x - 6, -44); g.quadraticCurveTo(x, -42, x + 6, -44); g.lineTo(x + 6, -43.2); g.quadraticCurveTo(x, -41, x - 6, -43.2); });
      hueco(g, () => { const y = -52 - 3 * ce, i = -l * Math.max(0, -ce) * 2.5; g.moveTo(x - 6.5, y + 1.5 + i); g.quadraticCurveTo(x, y - 2.5, x + 6.5, y + 1.5 - i); g.lineTo(x + 6.5, y + 3 - i); g.quadraticCurveTo(x, y - .8, x - 6.5, y + 3 + i); });
      if (p.gafas) { g.save(); g.globalCompositeOperation = 'destination-out'; g.lineWidth = 1.6; g.beginPath(); circulo(g, x, -44, p.gafas === 'redondas' ? 8.5 : 7.5); g.stroke(); g.restore(); }
    }
    if (p.gafas) hueco(g, () => g.rect(-2, -45.5, 4, 1.4));
    // nariz: un lado iluminado y las fosas
    hueco(g, () => { g.moveTo(-1.5, -42); g.quadraticCurveTo(-3 - n, -33, -5 - 2 * n, -29); g.lineTo(-4.2 - 2 * n, -28.4); g.quadraticCurveTo(-2 - n, -33, -.6, -42); });
    hueco(g, () => { g.ellipse(-3.5, -28, 1.6, 1, .3, 0, TAU); g.moveTo(5.1, -28); g.ellipse(3.5, -28, 1.6, 1, -.3, 0, TAU); });
    if ((p.arrugas || 0) > 0) hueco(g, () => { for (const l of [-1, 1]) { g.moveTo(l * 7, -30); g.quadraticCurveTo(l * 11, -24, l * 9, -18); g.lineTo(l * 9.8, -18); g.quadraticCurveTo(l * 12, -24, l * 7.8, -30); }
      for (let k = 0; k < 2; k++) { g.moveTo(-9, -60 - k * 3.5); g.quadraticCurveTo(0, -62 - k * 3.5, 9, -60 - k * 3.5); g.lineTo(9, -59.3 - k * 3.5); g.quadraticCurveTo(0, -61 - k * 3.5, -9, -59.3 - k * 3.5); } });
    // boca: sonrisa fina cerrada; al hablar se abre (calada) con los dientes de arriba
    const y = -20 + 2 * b, ab = 7 * b, an = 7 + 2 * b;
    if (ab < 1) hueco(g, () => { g.moveTo(-an, y - 1); g.quadraticCurveTo(0, y + 2.5, an, y - 1); g.lineTo(an, y - .1); g.quadraticCurveTo(0, y + 3.6, -an, y - .1); });
    else { hueco(g, () => { g.moveTo(-an, y - 1); g.quadraticCurveTo(0, y + 1, an, y - 1); g.quadraticCurveTo(0, y + ab + 2, -an, y - 1); }); g.fillRect(-an * .6, y - .6, an * 1.2, .9); }
    if (p.barba === 'bigote' || p.barba === 'corta') { g.beginPath(); g.moveTo(-11, -21); g.quadraticCurveTo(0, -27, 11, -21); g.quadraticCurveTo(0, -23.5, -11, -21); g.fill();
      g.beginPath(); g.moveTo(-12, -21.5); g.quadraticCurveTo(-6, -26, 0, -24); g.quadraticCurveTo(6, -26, 12, -21.5); g.quadraticCurveTo(6, -23, 0, -22); g.quadraticCurveTo(-6, -23, -12, -21.5); g.fill(); }
    PELO_FRENTE[p.pelo || 'corto'](g, t, o, p, false);
    if (p.sombrero) SOMBRERO_FRENTE[p.sombrero](g);
  }
  function cabezaEspalda(g, p, t, o) {
    g.fillRect(-9, -16, 18, 18);
    for (const l of [-1, 1]) { g.beginPath(); g.ellipse(l * 25, -42, 5, 9, 0, 0, TAU); g.fill(); }
    cara(g, p, 23, 0);
    PELO_FRENTE[p.pelo || 'corto'](g, t, o, p, true);
    if (p.sombrero) SOMBRERO_FRENTE[p.sombrero](g);
  }
  // pelo visto de frente (o de espaldas, que tapa más)
  const PELO_FRENTE = {
    corto(g, t, o, p, esp) { g.beginPath(); g.moveTo(-25, -40); g.bezierCurveTo(-28, -80, 28, -80, 25, -40); g.lineTo(23, -52);
      for (let k = 0; k <= 8; k++) g.lineTo(23 - k * 46 / 8, -60 + (k % 2 ? 4 : 0)); g.closePath(); g.fill();
      if (esp) { g.beginPath(); g.moveTo(-24, -50); g.quadraticCurveTo(0, -12, 24, -50); g.lineTo(22, -24); g.quadraticCurveTo(0, -14, -22, -24); g.closePath(); g.fill(); }
      hueco(g, () => { for (let k = 0; k < 6; k++) { const x = -15 + k * 6; g.moveTo(x, -66); g.quadraticCurveTo(x + 2, -62, x + 1, -58); g.lineTo(x + 1.6, -58); g.quadraticCurveTo(x + 2.6, -62, x + .8, -66); } }); },
    peinado(g, t, o, p, esp) { g.beginPath(); g.moveTo(-26, -40); g.bezierCurveTo(-32, -92, 30, -98, 27, -48); g.quadraticCurveTo(12, -70, -4, -66); g.quadraticCurveTo(-18, -64, -22, -50); g.closePath(); g.fill();
      if (esp) { g.beginPath(); g.moveTo(-25, -50); g.quadraticCurveTo(0, -14, 25, -50); g.lineTo(22, -26); g.quadraticCurveTo(0, -16, -22, -26); g.closePath(); g.fill(); }
      hueco(g, () => { g.moveTo(-10, -84); g.quadraticCurveTo(4, -92, 18, -76); g.lineTo(18, -74.6); g.quadraticCurveTo(4, -89, -10, -82.6); g.moveTo(-14, -78); g.quadraticCurveTo(0, -86, 12, -72); g.lineTo(12, -70.8); g.quadraticCurveTo(0, -83, -14, -76.8); }); },
    entradas(g, t, o, p, esp) { for (const l of [-1, 1]) { g.beginPath(); g.moveTo(l * 25, -36); g.quadraticCurveTo(l * 28, -62, l * 14, -70); g.quadraticCurveTo(l * 18, -56, l * 20, -36); g.fill(); }
      if (esp) { g.beginPath(); g.moveTo(-25, -40); g.quadraticCurveTo(0, -84, 25, -40); g.quadraticCurveTo(0, -16, -25, -40); g.fill(); } else { g.beginPath(); g.ellipse(0, -71, 5, 2.5, 0, 0, TAU); g.fill(); } },
    loco(g, t, o, p) { for (let k = 0; k < 15; k++) { const a = Math.PI + k * Math.PI / 14, mu = .2 * Math.sin(t * 3 + k * 1.3), v = o.vf || 0, l = (18 + 14 * azar(k + 9)) * (1 + .6 * Math.abs(v));
      const b = [22 * Math.cos(a), -46 + 26 * Math.sin(a)], q = [b[0] + l * Math.cos(a + mu) + v * l * (1 + .25 * Math.sin(t * 10 + k)), b[1] + l * Math.sin(a + mu)];
      g.beginPath(); g.moveTo(b[0] - 5, b[1]); g.quadraticCurveTo((b[0] + q[0]) / 2 + 6 * Math.sin(mu * 4), (b[1] + q[1]) / 2, q[0], q[1]); g.lineTo(b[0] + 5, b[1] + 2); g.fill(); } },
    mono(g, t, o, p, esp) { PELO_FRENTE.corto(g, t, o, p, esp); g.beginPath(); g.ellipse(0, -78, 12, 10, 0, 0, TAU); g.fill(); hueco(g, () => g.ellipse(0, -78, 5, 2.5, 0, 0, TAU)); },
    coleta(g, t, o, p, esp) { PELO_FRENTE.corto(g, t, o, p, esp); g.save(); g.translate(esp ? 0 : 22, -52); g.rotate(.15 * Math.sin(t * 2.2 + p.semilla)); g.beginPath(); g.moveTo(-4, 0); g.quadraticCurveTo(10, 20, 2, 44); g.quadraticCurveTo(-6, 20, 4, 0); g.fill(); g.restore(); },
    calvo(g, t, o, p) { for (const l of [-1, 1]) { g.beginPath(); g.moveTo(l * 25, -34); g.quadraticCurveTo(l * 27, -50, l * 21, -54); g.lineTo(l * 20, -36); g.fill(); } },
  };
  const SOMBRERO_FRENTE = {
    gorra(g) { g.beginPath(); g.moveTo(-26, -58); g.bezierCurveTo(-26, -86, 26, -86, 26, -58); g.closePath(); g.fill(); g.beginPath(); g.ellipse(0, -58, 26, 5, 0, 0, TAU); g.fill(); },
    chistera(g) { g.fillRect(-34, -66, 68, 7); g.fillRect(-22, -114, 44, 50); hueco(g, () => g.rect(-21, -76, 42, 4)); },
    boina(g) { g.beginPath(); g.ellipse(0, -66, 30, 12, 0, 0, TAU); g.fill(); g.fillRect(-2, -82, 4, 8); },
  };
})();
