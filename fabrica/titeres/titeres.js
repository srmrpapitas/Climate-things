// Biblioteca de títeres de sombras de Españistán (estilo Lotte Reiniger), dibujados en cada fotograma en un <canvas>.
// Personajes con esqueleto (piernas con rodilla que se apoyan en el suelo, brazos con codo, cabeza con mandíbula),
// gestos con anticipación y rebote, y movimiento secundario (faldones, pelo, barba, objetos que cuelgan).
// Guía: fabrica/titeres/README.md. Personajes: personajes.js. Decorados: decorados.js. Escenas: escenas/*.js.
const T = (() => {
  const TAU = Math.PI * 2;
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const suave = x => (x = clamp(x), x * x * (3 - 2 * x));
  const rampa = (t, a, b) => suave((t - a) / (b - a));
  const rebote = x => { x = clamp(x); const c = 1.6; return 1 + (c + 1) * (x - 1) ** 3 + c * (x - 1) ** 2; };   // se pasa un poco y vuelve
  const azar = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const ruido = (t, s) => .5 * Math.sin(t * 1.3 + s * 7.1) + .3 * Math.sin(t * 2.9 + s * 3.3) + .2 * Math.sin(t * 5.3 + s * 1.7);
  const mezcla = (a, b, k) => a + (b - a) * k;
  const dir = (a, l) => [l * Math.sin(a), l * Math.cos(a)];         // ángulo 0 = hacia abajo; + = hacia delante
  const NEGRO = '#0b0705';

  // peso de un gesto: entra con rebote, se mantiene y sale suave; antes de entrar hay una pequeña anticipación
  function peso(t, a, b, entra = .32, sale = .35) {
    if (t < a - .22 || t > b) return [0, 0];
    const ant = t < a ? -Math.sin(Math.PI * clamp((t - (a - .22)) / .22)) : 0;
    return [rebote((t - a) / entra) * (1 - rampa(t, b - sale, b)), ant];
  }

  // pierna en dos huesos: la rodilla hacia delante (+x)
  function ik(hx, hy, fx, fy, L1, L2) {
    const dx = fx - hx, dy = fy - hy, d = Math.min(Math.hypot(dx, dy), L1 + L2 - .5);
    const a = Math.atan2(dy, dx), k = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1));
    return [hx + L1 * Math.cos(a - k), hy + L1 * Math.sin(a - k)];
  }

  // ---------- posición en la escena: caminatas, giros y saltos ----------
  function recorrido(ac, t) {
    const p = ac.p, C0 = 150 * p.alto;
    let x = ac.x, fase = 0, mira = ac.mira || 1, giro = -9, anterior = mira;
    for (const a of ac.acciones) {
      if (a.hace !== 'camina' && a.hace !== 'gira') continue;
      if (a.hace === 'gira') { if (t >= a.en) { anterior = mira; mira = -mira; giro = a.en; } continue; }
      const dx = a.a - x, n = Math.max(1, Math.round(Math.abs(dx) / (C0 / 2)));
      const quiere = Math.sign(dx) || mira;
      if (quiere !== mira && t >= a.en - .3) { anterior = mira; mira = quiere; giro = a.en - .3; }
      if (t <= a.en) break;
      const k = suave((t - a.en) / (a.hasta - a.en));
      fase += k * n / 2; x += dx * k;
      if (t < a.hasta) break;
    }
    const vuelta = clamp((t - giro) / .3);                              // al girarse se estrecha y se da la vuelta
    const f = vuelta < 1 ? anterior * Math.cos(Math.PI * vuelta) : mira;
    return { x, fase, f: Math.abs(f) < .08 ? .08 * Math.sign(f || 1) : f, mira };
  }

  // ---------- la pose de un fotograma ----------
  function pose(ac, t) {
    const p = ac.p, s = p.semilla || 1, r = recorrido(ac, t), r2 = recorrido(ac, t - 1 / 24), r3 = recorrido(ac, t - .2);
    const vel = (r.x - r2.x) * 24, anda = clamp(Math.abs(vel) / (90 * p.alto)), velAtras = (r2.x - r3.x) / .18;
    const o = { x: r.x, y: 0, f: r.f, fase: r.fase, anda, vel: vel * Math.sign(r.mira), velAtras: velAtras * Math.sign(r.mira),
      inclina: .07 * anda + (p.encorvado || 0) + .015 * ruido(t * .7, s), cabeza: .03 * ruido(t * .9, s + 2), boca: 0, aplasta: 1,
      parpadea: (u => u < .12 || (azar(Math.floor((t + azar(s) * 4) / (3.2 + azar(s + 1))) + s) < .3 && u > .26 && u < .36))((t + azar(s) * 4) % (3.2 + azar(s + 1))),
      respira: Math.sin(t * 1.9 + s), hombros: 0, cabezaAncho: 1, cejas: .15 * ruido(t * .6, s + 7),
      ojos: .5 * Math.sin(t * .7 + s) * (Math.sin(t * .23 + s) > 0), activos: [] };
    // vista (perfil / frente / espalda): al cambiar, el títere se estrecha y se da la vuelta como una carta
    let vista = ac.vista || 'perfil', cambio = -9, antes = vista;
    for (const a of ac.acciones) if (a.hace === 'vista' && t >= a.en - .15) { antes = vista; vista = a.a; cambio = a.en - .15; }
    const kv = clamp((t - cambio) / .3); o.vista = kv < .5 ? antes : vista; o.giroVista = kv < 1 ? Math.max(.06, Math.abs(Math.cos(Math.PI * kv))) : 1;
    // acercarse o alejarse de la cámara (crece o encoge mientras anda de frente)
    o.z = ac.z || 1; o.andaFrente = 0; o.faseFrente = 0;
    for (const a of ac.acciones) if (a.hace === 'acerca' && t > a.en) { const q = suave((t - a.en) / (a.hasta - a.en)); o.z = mezcla(o.z, a.a, q);
      if (t < a.hasta) { o.andaFrente = Math.min(1, 4 * q, 4 * (1 - q)); o.faseFrente = (t - a.en) * 1.7; } }
    const sw = Math.sin(TAU * r.fase) * anda;
    o.cerca = [.12 - .42 * sw + .03 * ruido(t, s + 4), .22 + .25 * anda, p.mano || 'abierta'];
    o.lejos = [.1 + .42 * sw + .03 * ruido(t, s + 5), .2 + .25 * anda, p.manoLejos || 'abierta'];
    for (const a of ac.acciones) gesto(a, t, o, s);
    const habla = o.activos.find(a => a.hace === 'habla'), libre = !o.activos.some(a => a.hace !== 'habla' && a.hace !== 'asiente' && a.hace !== 'niega');
    if (habla && libre && o.anda < .2) {                                 // la mano acompaña lo que dice, con golpes de énfasis
      const w = habla.w, golpe = Math.max(0, Math.sin(t * 4.3 + s)) ** 3;
      brazo(o, 'cerca', .75 + .25 * Math.sin(t * 1.7 + s) + .18 * golpe, 1.05 - .35 * golpe, 'abierta', w * .85);
      o.cabeza += .06 * w * golpe; o.cejas += .35 * w * golpe; o.inclina += .02 * w * golpe;
    }
    if (o.anda < .2) { o.cabeza += .05 * Math.sin(t * .31 + s * 2) * (Math.sin(t * .13 + s) > .3); o.inclina += .012 * o.respira; o.x += 2.5 * Math.sin(t * .4 + s); }
    if (!pose.dentro) {                                                  // arrastre: el antebrazo llega un poco después que el brazo
      pose.dentro = true; const atras = pose(ac, t - .09); pose.dentro = false;
      for (const b of ['cerca', 'lejos']) o[b][1] = mezcla(o[b][1], atras[b][1] + (o[b][0] - atras[b][0]) * -.6, .45);
    }
    return o;
  }
  const brazo = (o, cual, sH, sC, mano, w) => { const b = o[cual]; o[cual] = [mezcla(b[0], sH, w), mezcla(b[1], sC, w), w > .5 && mano ? mano : b[2]]; };
  function gesto(a, t, o, s) {
    const hasta = a.hasta ?? a.en + 1.2, [w, ant] = peso(t, a.en, hasta), u = t - a.en;
    if (w === 0 && ant === 0 && a.hace !== 'salta') return;
    o.activos.push({ hace: a.hace, w, ant, u, h: a.h, c: a.c });
    switch (a.hace) {
      case 'puno': o.cejas -= .6 * w; brazo(o, 'cerca', 2.3 + .08 * Math.sin(t * 11) + .5 * ant, .7, 'puno', w); o.inclina -= .06 * w; o.cabeza -= .05 * w; break;
      case 'senala': brazo(o, 'cerca', 1.5 + .04 * Math.sin(t * 3) + .3 * ant, .05, 'indice', w); o.inclina += .05 * w; break;
      case 'saluda': brazo(o, 'cerca', 2.55, .55 + .4 * Math.sin(u * 10), 'abierta', w); o.cabeza -= .05 * w; break;
      case 'celebra': brazo(o, 'cerca', 2.9 + .12 * Math.sin(t * 9 + s), .2, 'abierta', w); brazo(o, 'lejos', 2.75 + .12 * Math.sin(t * 9 + s + 1), .25, 'abierta', w);
        o.y -= 12 * w * Math.abs(Math.sin(t * 6 + s)); o.cabeza -= .1 * w; break;
      case 'aplaude': brazo(o, 'cerca', 1.25, .95 + .3 * Math.sin(t * 15 + s), 'abierta', w); brazo(o, 'lejos', 1.1, 1.05, 'abierta', w); break;
      case 'encoge': o.cejas += .8 * w; brazo(o, 'cerca', .45, 1.7, 'abierta', w); brazo(o, 'lejos', .4, 1.75, 'abierta', w); o.hombros = 8 * w; o.cabeza += .18 * w; break;
      case 'piensa': o.cejas += .4 * w * Math.sin(t * 1.3); o.ojos = .8 * w; brazo(o, 'cerca', .55, 2.45, 'puno', w); o.cabeza += .16 * w + .03 * Math.sin(t * 2) * w; o.inclina += .04 * w; break;
      case 'golpea': brazo(o, 'cerca', 1.25 + .65 * Math.max(0, Math.sin(u * 7)) + .4 * ant, .5, 'puno', w); o.inclina += .06 * w; break;
      case 'asiente': o.cabeza += .2 * w * Math.max(0, Math.sin(u * 8)); break;
      case 'niega': o.cabezaAncho = 1 - .3 * w * Math.abs(Math.sin(u * 9)); o.cabeza += .04 * w; break;
      case 'inclina': o.inclina += .45 * w; o.cabeza += .2 * w; break;
      case 'brazos': brazo(o, 'cerca', a.h ?? 1.2, a.c ?? .3, a.mano, w); if (a.h2 != null) brazo(o, 'lejos', a.h2, a.c2 ?? .3, a.mano, w); break;
      case 'habla': o.boca = Math.max(o.boca, w * clamp(.55 + .45 * Math.sin(t * 17 + s) * Math.sin(t * 5.3 + s * 2) + .25 * Math.sin(t * 29))); break;
      case 'salta': { const k = clamp(u / .55); if (u > -.15 && u < .7) { o.y -= 70 * Math.sin(Math.PI * k) * (k < 1); o.aplasta = u < 0 ? 1 - .12 * Math.sin(Math.PI * (u + .15) / .15) : u > .55 ? 1 - .15 * Math.sin(Math.PI * (u - .55) / .15) : 1.06; } break; }
    }
  }

  // ---------- dibujo de un títere (coordenadas locales: mira a la derecha, pies en y = 0) ----------
  function miembro(g, a, b, w0, w1) {
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), nx = Math.sin(ang), ny = -Math.cos(ang);
    g.beginPath(); g.moveTo(a[0] + nx * w0, a[1] + ny * w0); g.lineTo(b[0] + nx * w1, b[1] + ny * w1);
    g.arc(b[0], b[1], w1, ang - Math.PI / 2, ang + Math.PI / 2); g.lineTo(a[0] - nx * w0, a[1] - ny * w0);
    g.arc(a[0], a[1], w0, ang + Math.PI / 2, ang + 3 * Math.PI / 2); g.fill();
  }
  const hueco = (g, f) => { g.save(); g.globalCompositeOperation = 'destination-out'; g.beginPath(); f(); g.fill(); g.restore(); };
  const circulo = (g, x, y, r) => { g.moveTo(x + r, y); g.arc(x, y, r, 0, TAU); };

  function dibuja(g, ac, t, o) {
    if (o.vista !== 'perfil' && T.dibujaFrente) return T.dibujaFrente(g, ac, t, o);
    const p = ac.p, A = p.alto, G = p.grueso, L1 = 80 * A, L2 = 78 * A, C = 150 * A;
    // pies: cada uno apoyado mientras el cuerpo avanza; en el aire, sube y adelanta
    const pies = [0, .5].map(d => {
      const u = ((o.fase + d) % 1 + 1) % 1;
      if (u < .5) return [C / 4 - C * u, 0, 0];
      const k = (u - .5) / .5; return [-C / 4 + C / 2 * suave(k), -20 * A * Math.sin(Math.PI * k) * o.anda, .35 * Math.sin(Math.PI * k) * o.anda];
    });
    const caderaY = -(L1 + L2) * .965 + 5 * o.anda * (.5 + .5 * Math.cos(2 * TAU * o.fase)) + o.y;
    g.save(); g.translate(o.x, 0); g.scale(o.f * (p.escala || 1) * o.z * o.giroVista, (p.escala || 1) * o.z * o.aplasta); g.fillStyle = g.strokeStyle = NEGRO;
    const [pc, pl] = pies, cad = [0, caderaY];
    const rod = pie => ik(0, caderaY, pie[0], pie[1] - 6 * A, L1, L2);
    // lo de atrás, un poco más claro para que se lea
    g.fillStyle = '#2a1a10'; pierna(g, cad, rod(pl), pl, p, A); g.fillStyle = NEGRO;
    const inc = o.inclina, largo = 112 * A, cuello = [cad[0] + Math.sin(inc) * largo, cad[1] - Math.cos(inc) * largo + o.hombros * .3];
    const hombro = [cad[0] + Math.sin(inc) * (largo - 10), cad[1] - Math.cos(inc) * (largo - 10) - o.hombros];
    g.fillStyle = '#2a1a10'; brazoDib(g, hombro, o.lejos, p, t, o, false, A); g.fillStyle = NEGRO;
    pierna(g, cad, rod(pc), pc, p, A);
    ropa(g, p, t, o, cad, inc, largo, G, A, pies);
    g.save(); g.translate(cuello[0], cuello[1]); g.rotate(o.cabeza + inc * .4); g.scale(o.cabezaAncho * (p.cabeza || 1) * A, (p.cabeza || 1) * A);
    cabeza(g, p, t, o); g.restore();
    brazoDib(g, hombro, o.cerca, p, t, o, true, A);
    g.restore();
  }
  function pierna(g, cad, rod, pie, p, A) {
    const w = (p.ropa === 'vestido' ? 9 : 14) * A * (p.grueso || 1);
    miembro(g, cad, rod, w + 3, w - 2); miembro(g, rod, [pie[0], pie[1] - 6 * A], w - 2, w - 6);
    g.save(); g.translate(pie[0], pie[1] - 6 * A); g.rotate(-pie[2]);               // zapato con punta
    g.beginPath(); g.moveTo(-9 * A, -6 * A); g.quadraticCurveTo(22 * A, -9 * A, 26 * A, 2 * A); g.lineTo(26 * A, 6 * A); g.lineTo(-11 * A, 6 * A); g.closePath(); g.fill();
    g.restore();
  }
  function brazoDib(g, hombro, [sH, sC, mano], p, t, o, cerca, A) {
    const [ax, ay] = dir(sH, 62 * A), codo = [hombro[0] + ax, hombro[1] + ay];
    const [bx, by] = dir(sH + sC, 56 * A), mu = [codo[0] + bx, codo[1] + by], ang = sH + sC;
    const w = 12 * A * (p.grueso || 1);
    miembro(g, hombro, codo, w + 1, w - 2); miembro(g, codo, mu, w - 2, w - 4);
    if (p.ropa === 'traje' || p.ropa === 'tunica') hueco(g, () => circulo(g, mu[0] - bx * .12, mu[1] - by * .12, 1.6 * A));   // botón del puño
    g.save(); g.translate(mu[0], mu[1]); g.rotate(-ang);
    g.beginPath();
    if (mano === 'puno') { g.arc(0, 8 * A, 9 * A, 0, TAU); }
    else if (mano === 'indice') { g.arc(0, 7 * A, 8 * A, 0, TAU); g.fill(); g.beginPath(); g.moveTo(-2.5 * A, 8 * A); g.lineTo(-1.5 * A, 26 * A); g.lineTo(2.5 * A, 26 * A); g.lineTo(3 * A, 8 * A); }
    else { g.ellipse(0, 10 * A, 7 * A, 12 * A, 0, 0, TAU); g.fill(); g.beginPath(); g.ellipse(6 * A, 5 * A, 3 * A, 7 * A, -.6, 0, TAU); }
    g.fill(); g.restore();
    const objeto = cerca ? p.objeto : p.objetoLejos;
    if (objeto && OBJETOS[objeto]) OBJETOS[objeto](g, mu, ang, t, o, A);
  }
  function ropa(g, p, t, o, cad, inc, largo, G, A, pies) {
    const w = 27 * G * A, bar = (p.barriga || 0) * 18 * A, lag = clamp(o.velAtras / 200, -1, 1);
    g.save(); g.translate(cad[0], cad[1]); g.rotate(inc); g.scale(1 + .012 * o.respira, 1 + .008 * o.respira);
    // tronco: espalda curva, pecho y barriga
    g.beginPath(); g.moveTo(-w * .9, 4 * A);
    g.bezierCurveTo(-w * 1.15, -largo * .45, -w * 1.05, -largo * .85, -w * .45, -largo - o.hombros);
    g.lineTo(w * .45, -largo - o.hombros);
    g.bezierCurveTo(w * 1.05 + bar * .3, -largo * .8, w * 1.05 + bar, -largo * .35, w * .9 + bar * .6, 4 * A); g.closePath(); g.fill();
    if (p.ropa === 'traje') {
      // chaqueta con faldones que se quedan atrás al andar
      const fal = -.25 * lag - .03 * Math.sin(t * 1.7 + (p.semilla || 0));
      g.beginPath(); g.moveTo(-w * .95, -6 * A); g.lineTo(-w * 1.05 + Math.sin(fal) * 30, 30 * A); g.lineTo(-w * .2, 26 * A); g.lineTo(w * .3, 30 * A);
      g.lineTo(w * .95 + bar * .6 + Math.sin(fal) * 20, 26 * A); g.lineTo(w * .9 + bar * .6, -6 * A); g.closePath(); g.fill();
      hueco(g, () => { g.moveTo(w * .15, -largo + 4 * A); g.lineTo(w * .85, -largo + 6 * A); g.lineTo(w * .55, -largo * .55); g.closePath(); });   // camisa
      g.beginPath(); g.moveTo(w * .5, -largo + 8 * A); g.lineTo(w * .62, -largo + 10 * A); g.lineTo(w * .62, -largo * .62); g.lineTo(w * .52, -largo * .56); g.fill();   // corbata
      hueco(g, () => { for (let i = 0; i < 2; i++) circulo(g, w * .78 + bar * .4, -largo * (.42 - i * .16), 2 * A); });
      hueco(g, () => { g.moveTo(-w * .6, -largo * .5); g.lineTo(-w * .3, -largo * .52); g.lineTo(-w * .32, -largo * .48); g.closePath(); });   // bolsillo
    }
    if (p.ropa === 'tunica') {
      // túnica hasta los tobillos: el bajo sigue a las piernas, con encaje calado
      g.rotate(-inc); const xs = pies.map(q => q[0]), x0 = Math.min(...xs) - 18 * A, x1 = Math.max(...xs) + 22 * A, bajo = -cad[1] - 14 * A;
      g.beginPath(); g.moveTo(-w * .95, -10 * A); g.lineTo(x0 - 12 * lag * 20, bajo);
      for (let i = 0; i <= 8; i++) { const u = i / 8, x = mezcla(x0 - 12 * lag * 20, x1, u); g.lineTo(x, bajo + (i % 2 ? 7 * A : 0) + 3 * Math.sin(t * 3 + i)); }
      g.lineTo(w * .95, -10 * A); g.closePath(); g.fill();
      hueco(g, () => { for (let i = 0; i < 7; i++) { const x = mezcla(x0, x1, (i + .5) / 7); circulo(g, x, bajo - 14 * A, 3 * A); } });
      hueco(g, () => { for (let i = 0; i < 5; i++) circulo(g, w * .7, -largo * (.85 - i * .17) - 4 * A * 0, 2.2 * A); });
      g.rotate(inc);
    }
    if (p.ropa === 'vestido') {
      g.rotate(-inc); const xs = pies.map(q => q[0]), vu = 6 * Math.sin(t * 2.3 + (p.semilla || 0)) - 25 * lag;
      g.beginPath(); g.moveTo(-w * .8, -20 * A); g.quadraticCurveTo(Math.min(...xs) - 30 * A + vu, -cad[1] * .35, Math.min(...xs) - 26 * A + vu, -cad[1] * .38 + 40 * A);
      for (let i = 0; i <= 6; i++) g.lineTo(mezcla(Math.min(...xs) - 26 * A + vu, Math.max(...xs) + 30 * A + vu * .5, i / 6), -cad[1] * .38 + 40 * A + (i % 2 ? 6 : 0));
      g.quadraticCurveTo(Math.max(...xs) + 26 * A, -cad[1] * .35, w * .8, -20 * A); g.closePath(); g.fill();
      hueco(g, () => { for (let i = 0; i < 6; i++) circulo(g, mezcla(Math.min(...xs) - 18 * A, Math.max(...xs) + 22 * A, (i + .5) / 6) + vu * .7, -cad[1] * .38 + 28 * A, 2.6 * A); });
      g.rotate(inc);
    }
    g.restore();
  }
  // cabeza de perfil; el origen es la base del cuello. Nariz (p.narizForma: recta | aguilena | respingona | gruesa),
  // mentón (p.menton: marcado | redondo | doble), arrugas (p.arrugas: 0–1), ojo con pupila y párpado, ceja que se mueve.
  function cabeza(g, p, t, o) {
    const n = p.nariz || 1, b = o.boca, sw = .25 * Math.sin(t * 2.2 + (p.semilla || 0)) + .4 * clamp(o.vel / 150, -1, 1), ce = clamp(o.cejas, -1, 1);
    g.beginPath(); g.moveTo(-10, 2); g.lineTo(-9, -16); g.lineTo(9, -16); g.lineTo(12, -4); g.quadraticCurveTo(13, -1, 10, 2); g.fill();   // cuello y nuez
    if (p.ropa === 'traje') hueco(g, () => { g.moveTo(-10, 2); g.lineTo(-8, -6); g.lineTo(12, -3); g.lineTo(13, 3); g.closePath(); });   // cuello de la camisa
    // cráneo, frente, ceja, nariz y labio de arriba
    g.beginPath(); g.moveTo(-6, -12);
    g.bezierCurveTo(-31, -16, -31, -59, -4, -65);
    g.bezierCurveTo(14, -68, 22, -58, 21, -50);
    g.quadraticCurveTo(24, -47, 23, -43);                               // arco de la ceja
    const f = p.narizForma || 'recta';
    if (f === 'aguilena') { g.quadraticCurveTo(30, -40, 29 + 7 * n, -30); g.quadraticCurveTo(30 + 7 * n, -26, 26 + 6 * n, -25); }
    else if (f === 'respingona') { g.lineTo(25 + 4 * n, -31); g.quadraticCurveTo(30 + 6 * n, -30, 27 + 4 * n, -26); }
    else if (f === 'gruesa') { g.lineTo(26 + 5 * n, -33); g.bezierCurveTo(36 + 6 * n, -33, 36 + 6 * n, -24, 27 + 4 * n, -24); }
    else { g.lineTo(24 + 9 * n, -27 + 2 * n); }
    g.lineTo(23, -25); g.quadraticCurveTo(25.5, -22, 23.5, -19.5); g.lineTo(6, -17); g.closePath(); g.fill();
    // mandíbula: gira al hablar y abre la boca
    g.save(); g.translate(4, -17); g.rotate(.32 * b);
    const m = p.menton || 'redondo';
    g.beginPath(); g.moveTo(-10, 0); g.lineTo(19.5, 0); g.quadraticCurveTo(22, 3, 18.5, 5);
    if (m === 'marcado') { g.lineTo(19, 11); g.lineTo(14, 14); g.lineTo(-4, 12); }
    else if (m === 'doble') { g.quadraticCurveTo(19, 12, 12, 13); g.quadraticCurveTo(10, 20, -2, 17); }
    else { g.quadraticCurveTo(18, 12, 12, 13); g.quadraticCurveTo(0, 12, -10, 5); }
    g.lineTo(-10, 5); g.closePath(); g.fill();
    if (p.barba === 'corta' || p.barba === 'larga') {
      const lg = p.barba === 'larga' ? 26 : 9, ba = sw * (p.barba === 'larga' ? .25 : .05);
      g.beginPath(); g.moveTo(-14, -6); g.lineTo(20, 2); g.quadraticCurveTo(22, 10, 16, 15 + lg * .3);
      for (let i = 0; i <= 5; i++) { const x = 14 - i * 6, y = 13 + lg * (1 - i / 6) + (i % 2 ? 4 : 0); g.lineTo(x + Math.sin(ba) * (y - 5), y); }
      g.lineTo(-16, 4); g.closePath(); g.fill();
      hueco(g, () => { for (let i = 0; i < 9; i++) circulo(g, -8 + 3.2 * i + 2 * azar(i), 4 + 6 * azar(i + 30), .7); });   // textura de la barba
    }
    hueco(g, () => { g.moveTo(17, 1.5); g.quadraticCurveTo(13, 2.5, 10, 1.5); g.lineTo(10, 2.5); g.quadraticCurveTo(13, 3.5, 17, 2.5); });   // labio de abajo
    g.restore();
    if (p.barba === 'bigote' || p.barba === 'corta') { g.beginPath(); g.moveTo(10, -22); g.quadraticCurveTo(22, -24, 25, -17); g.quadraticCurveTo(16, -17, 10, -19); g.fill();
      hueco(g, () => { for (let i = 0; i < 4; i++) { g.moveTo(14 + i * 2.6, -21); g.lineTo(15 + i * 2.8, -18.4); g.lineTo(15.6 + i * 2.8, -18.4); g.lineTo(14.6 + i * 2.6, -21); } }); }
    // fosa nasal, comisura y surco de la mejilla
    hueco(g, () => { g.ellipse(20.5 + 3 * n, -25.5, 2.2, 1.1, .3, 0, TAU); });
    hueco(g, () => { g.moveTo(9, -18.5); g.quadraticCurveTo(7, -17, 8, -15); g.lineTo(8.8, -15); g.quadraticCurveTo(8, -17, 9.8, -18.5); });
    // oreja con su hélice
    hueco(g, () => { g.moveTo(-3, -44); g.bezierCurveTo(-14, -48, -16, -30, -6, -28); g.lineTo(-6, -30); g.bezierCurveTo(-13, -32, -12, -45, -3, -42); g.closePath(); });
    hueco(g, () => { g.ellipse(-7, -36, 1.8, 3, 0, 0, TAU); });
    // ojo: almendra calada con pupila y párpado; parpadea
    if (!o.parpadea) {
      hueco(g, () => { g.moveTo(8, -41); g.quadraticCurveTo(13, -46, 18.5, -42.5); g.quadraticCurveTo(14, -38.5, 8, -41); });
      g.beginPath(); circulo(g, 15 + o.ojos * 1.2, -42, 1.9); g.fill();
      g.beginPath(); g.moveTo(7.5, -42); g.quadraticCurveTo(13, -47.5, 19.5, -43); g.lineTo(18.5, -42.6); g.quadraticCurveTo(13, -46, 8.5, -41.4); g.fill();
    } else hueco(g, () => { g.moveTo(8, -41.5); g.quadraticCurveTo(13, -39.5, 18.5, -42); g.lineTo(18.5, -41.2); g.quadraticCurveTo(13, -38.5, 8, -40.6); });
    // ceja (sube y baja con la expresión): una línea calada encima del arco
    hueco(g, () => { const y = -49 - 3 * ce; g.moveTo(6, y + 1 + 2 * Math.max(0, -ce)); g.quadraticCurveTo(13, y - 2.5, 21, y + .5 - 1.5 * Math.max(0, -ce)); g.lineTo(21, y + 1.6); g.quadraticCurveTo(13, y - 1, 6, y + 2.2 + 2 * Math.max(0, -ce)); });
    // arrugas: frente, pata de gallo y surco nasolabial
    const ar = p.arrugas || 0;
    if (ar) hueco(g, () => {
      for (let i = 0; i < 3; i++) { const y = -56 - i * 3.5 - 2 * ce; g.moveTo(6 + i, y); g.quadraticCurveTo(12, y - 1.5, 18 - i, y); g.lineTo(18 - i, y + .7 * ar); g.quadraticCurveTo(12, y - .8, 6 + i, y + .7 * ar); }
      for (let i = 0; i < 2; i++) { g.moveTo(4, -43 + i * 3.4); g.lineTo(1, -44 + i * 4.6); g.lineTo(1.4, -43.3 + i * 4.6); g.lineTo(4, -42.3 + i * 3.4); }
      g.moveTo(19, -27); g.quadraticCurveTo(12, -24, 11, -18); g.lineTo(11.8, -18); g.quadraticCurveTo(13, -23.5, 19.5, -26.2);
    });
    if (p.gafas) { g.lineWidth = 2.4; g.beginPath(); circulo(g, 13, -42, p.gafas === 'redondas' ? 8.5 : 7); g.moveTo(5, -43); g.lineTo(-4, -40); g.stroke(); }
    PELO[p.pelo || 'corto'](g, t, o, sw, p);
    if (p.sombrero) SOMBREROS[p.sombrero](g, t, o);
  }
  const PELO = {
    corto(g) { g.beginPath(); g.moveTo(-22, -24); g.bezierCurveTo(-34, -50, -20, -72, 4, -70); g.bezierCurveTo(18, -70, 24, -60, 21, -50);
      for (let i = 0; i < 7; i++) g.lineTo(18 - i * 6, -55 + (i % 2 ? -5 : 0)); g.lineTo(-14, -40); g.lineTo(-16, -26); g.closePath(); g.fill(); },
    peinado(g, t) { g.beginPath(); g.moveTo(-23, -26); g.bezierCurveTo(-36, -54, -18, -78, 10, -76); g.quadraticCurveTo(30, -74, 26, -58);
      g.quadraticCurveTo(18, -64, 8, -60); g.quadraticCurveTo(-6, -56, -12, -44); g.lineTo(-16, -28); g.closePath(); g.fill();
      hueco(g, () => { g.moveTo(-14, -66); g.quadraticCurveTo(0, -74, 14, -70); g.quadraticCurveTo(0, -71, -14, -64); }); },
    entradas(g) { g.beginPath(); g.moveTo(-22, -24); g.bezierCurveTo(-34, -48, -24, -66, -6, -67); g.quadraticCurveTo(-4, -60, -10, -52); g.lineTo(-14, -40); g.lineTo(-16, -26); g.closePath(); g.fill(); },
    loco(g, t, o, sw) { for (let i = 0; i < 12; i++) { const a = -2.9 + i * .25, mu = .22 * Math.sin(t * 3 + i * 1.3) + sw * .6 * Math.sin(i), l = 26 + 16 * azar(i + 9);
      const b = [-2 + 22 * Math.cos(a), -40 + 26 * Math.sin(a)], q = [b[0] + l * Math.cos(a + mu), b[1] + l * Math.sin(a + mu)];
      g.beginPath(); g.moveTo(b[0] - 5, b[1]); g.quadraticCurveTo((b[0] + q[0]) / 2 + 8 * Math.sin(mu * 4), (b[1] + q[1]) / 2, q[0], q[1]); g.lineTo(b[0] + 6, b[1] + 2); g.fill(); } },
    mono(g, t, o, sw) { PELO.corto(g); g.save(); g.translate(-22, -58); g.rotate(sw * .3); g.beginPath(); g.ellipse(-6, 0, 13, 11, 0, 0, TAU); g.fill();
      hueco(g, () => g.ellipse(-6, 0, 5, 3, .4, 0, TAU)); g.restore(); },
    coleta(g, t, o, sw) { PELO.corto(g); g.save(); g.translate(-24, -50); g.rotate(.5 + sw * .8 - .3 * clamp(o.vel / 150, -1, 1)); g.beginPath(); g.moveTo(-4, -5); g.quadraticCurveTo(-14, 20, -4, 44); g.quadraticCurveTo(8, 20, 6, -4); g.fill(); g.restore(); },
    calvo() {},
  };
  const SOMBREROS = {
    gorra(g) { g.beginPath(); g.moveTo(-24, -52); g.quadraticCurveTo(-18, -78, 8, -74); g.quadraticCurveTo(24, -70, 22, -56); g.lineTo(40, -54); g.lineTo(38, -50); g.closePath(); g.fill(); },
    chistera(g) { g.fillRect(-24, -66, 52, 6); g.beginPath(); g.moveTo(-16, -64); g.lineTo(-18, -112); g.lineTo(20, -112); g.lineTo(18, -64); g.fill(); hueco(g, () => g.rect(-17, -76, 36, 4)); },
    boina(g) { g.beginPath(); g.ellipse(0, -64, 28, 10, -.15, 0, TAU); g.fill(); g.fillRect(-2, -78, 4, 8); },
  };
  // objetos que se llevan en la mano (mu = muñeca, ang = ángulo del antebrazo)
  const OBJETOS = {
    candil(g, mu, ang, t, o, A) {                                       // cuelga y se balancea con retraso
      const pen = .12 * Math.sin(t * 2.6) - .5 * clamp(o.velAtras / 150, -1, 1), c = [mu[0] + 34 * A * Math.sin(pen), mu[1] + 10 * A + 34 * A * Math.cos(pen)];
      g.lineWidth = 2; g.beginPath(); g.moveTo(mu[0], mu[1] + 10 * A); g.lineTo(c[0], c[1]); g.stroke();
      g.save(); g.translate(c[0], c[1]); g.rotate(-pen); g.beginPath(); g.moveTo(-11 * A, 0); g.lineTo(11 * A, 0); g.lineTo(8 * A, 28 * A); g.lineTo(-8 * A, 28 * A); g.closePath(); g.fill();
      g.fillRect(-14 * A, 28 * A, 28 * A, 5 * A); hueco(g, () => g.ellipse(0, 15 * A, 4 * A, 7 * A, 0, 0, TAU)); g.restore();
      o.luces = o.luces || []; o.luces.push([c[0], c[1] + 15 * A]);
    },
    lupa(g, mu, ang, t, o, A) { g.save(); g.translate(mu[0], mu[1]); g.rotate(-ang); g.fillRect(-3 * A, 8 * A, 6 * A, 26 * A); g.beginPath(); circulo(g, 0, 50 * A, 17 * A); g.fill();
      hueco(g, () => circulo(g, 0, 50 * A, 12 * A)); g.restore(); },
    bandera(g, mu, ang, t, o, A) { g.save(); g.translate(mu[0], mu[1]); g.rotate(-ang); g.fillRect(-2.5 * A, -40 * A, 5 * A, 150 * A); g.restore();
      const top = [mu[0] - 40 * A * Math.sin(ang) * 0, mu[1]]; DECORADO_TELA(g, mu[0], mu[1] + 30 * A * 0 - 0, 70 * A, 44 * A, t, -1); },
    baston(g, mu, ang, t, o, A) { g.lineWidth = 5 * A; g.beginPath(); g.moveTo(mu[0], mu[1] + 8 * A); g.lineTo(mu[0] + 6 * A, -2); g.stroke(); },
    papel(g, mu, ang, t, o, A) { g.save(); g.translate(mu[0], mu[1]); g.rotate(-ang + .3); g.fillRect(-14 * A, 10 * A, 28 * A, 36 * A); hueco(g, () => { for (let i = 0; i < 4; i++) g.rect(-9 * A, (16 + i * 7) * A, 18 * A, 2 * A); }); g.restore(); },
  };
  // tela que ondea (banderas, telones): la usan los objetos y los decorados
  function DECORADO_TELA(g, x, y, ancho, alto, t, lado = 1) {
    const ond = u => 7 * Math.sin(u * 5 - t * 6) * u + 3 * Math.sin(u * 9 - t * 9) * u;
    g.beginPath(); g.moveTo(x, y);
    for (let i = 0; i <= 12; i++) { const u = i / 12; g.lineTo(x + lado * ancho * u, y + ond(u)); }
    for (let i = 12; i >= 0; i--) { const u = i / 12; g.lineTo(x + lado * ancho * u, y + alto + ond(u) * 1.2); }
    g.closePath(); g.fill();
  }

  // ---------- escena: decorado, títeres, partículas, luz y cámara ----------
  function escena(def, lienzo, fondo) {
    const g = lienzo.getContext('2d'), W = 1280, H = 720, S = lienzo.width / W, capa = document.createElement('canvas'); capa.width = lienzo.width; capa.height = lienzo.height;
    const K = capa.getContext('2d'), halo = document.createElement('canvas'), lejos = document.createElement('canvas');
    halo.width = capa.width / 10; halo.height = capa.height / 10; lejos.width = capa.width / 3; lejos.height = capa.height / 3;
    const cam = t => {                                                 // [x, y, zoom] interpolados entre las claves, más el pulso de la mano
      const c = def.camara || [[0, 640, 360, 1]]; let a = c[0], b = c[0], k = 0;
      for (let i = 0; i < c.length; i++) if (t >= c[i][0]) { a = c[i]; b = c[i + 1] || c[i]; k = b === a ? 0 : suave((t - a[0]) / (b[0] - a[0])); }
      return [mezcla(a[1], b[1], k) + 4 * Math.sin(t * .37) + 2 * Math.sin(t * 1.1), mezcla(a[2], b[2], k) + 3 * Math.sin(t * .29), mezcla(a[3], b[3], k)];
    };
    return function (t) {
      t = Math.floor(t * (def.fps || 12) + 1e-6) / (def.fps || 12);  // animación «a doses»: 12 dibujos por segundo
      const [cx, cy, z] = cam(t), luz = .88 + .05 * Math.sin(t * 5.3) + .04 * Math.sin(t * 11.7 + 1);
      g.setTransform(S, 0, 0, S, 0, 0); g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
      const matriz = par => [z * S, 0, 0, z * S, (W / 2 - (640 + (cx - 640) * par) * z) * S, (H / 2 - (360 + (cy - 360) * par) * z) * S];
      const capaCam = par => g.setTransform(...matriz(par));
      capaCam(.3); g.filter = `brightness(${luz})`; if (fondo && fondo.complete) g.drawImage(fondo, -120, -80, W + 240, H + 160); g.filter = 'none';
      // lo lejano (par < 0,6) se dibuja a un tercio de resolución y se agranda: desenfoque de cine casi gratis
      const lg = lejos.getContext('2d'); let hayLejos = false;
      const vuelca = () => { if (!hayLejos) return; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.imageSmoothingQuality = 'high'; g.drawImage(lejos, 0, 0, lienzo.width, lienzo.height); g.restore(); lg.setTransform(1, 0, 0, 1, 0, 0); lg.clearRect(0, 0, lejos.width, lejos.height); hayLejos = false; };
      lg.setTransform(1, 0, 0, 1, 0, 0); lg.clearRect(0, 0, lejos.width, lejos.height);
      for (const d of def.decorado || []) { const p = d.par ?? 1; if (!DECORADOS[d.tipo]) continue;
        if (p < .6) { const m = matriz(p), f = lejos.width / lienzo.width; lg.setTransform(m[0] * f, 0, 0, m[3] * f, m[4] * f, m[5] * f); DECORADOS[d.tipo](lg, t, d); hayLejos = true; }
        else { vuelca(); capaCam(p); DECORADOS[d.tipo](g, t, d); } }
      vuelca(); capaCam(1);
      capaCam(1);
      // títeres, en su propia capa para que los calados dejen ver el pergamino
      K.setTransform(1, 0, 0, 1, 0, 0); K.clearRect(0, 0, capa.width, capa.height); K.setTransform(...matriz(1)); const luces = [];
      for (const ac of def.actores || []) {
        const o = pose(ac, t); K.save(); K.translate(0, def.suelo || 600);
        K.globalAlpha = ac.p.tono ?? 1; dibuja(K, ac, t, o); K.restore();
        for (const l of o.luces || []) luces.push([o.x + l[0] * o.f * (ac.p.escala || 1), (def.suelo || 600) + l[1] * (ac.p.escala || 1)]);
      }
      g.setTransform(1, 0, 0, 1, 0, 0);
      if (def.contraluz !== 0) { const h = halo.getContext('2d'); h.globalCompositeOperation = 'copy'; h.drawImage(capa, 0, 0, halo.width, halo.height);
        h.globalCompositeOperation = 'source-in'; h.fillStyle = 'rgb(255,190,110)'; h.fillRect(0, 0, halo.width, halo.height);
        g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = (def.contraluz ?? .5) * luz; g.imageSmoothingQuality = 'high'; g.drawImage(halo, 0, 0, capa.width, capa.height); g.restore(); }
      g.drawImage(capa, 0, 0); capaCam(1);
      for (const d of def.delante || []) if (DECORADOS[d.tipo]) DECORADOS[d.tipo](g, t, d);
      g.globalCompositeOperation = 'lighter';
      for (const [lx, ly] of luces.concat((def.luces || []).map(l => [l[0], l[1]]))) {
        const gr = g.createRadialGradient(lx, ly, 2, lx, ly, 130); gr.addColorStop(0, `rgba(255,200,110,${.5 * luz})`); gr.addColorStop(1, 'rgba(255,170,80,0)');
        g.fillStyle = gr; g.fillRect(lx - 140, ly - 140, 280, 280);
      }
      g.globalCompositeOperation = 'source-over';
      PARTICULAS(g, t, def);
      g.setTransform(S, 0, 0, S, 0, 0);
      for (let i = 0; i < 260; i++) { const r = azar(i * 7 + Math.floor(t * 24) * 131); g.fillStyle = r < .5 ? 'rgba(255,240,210,.05)' : 'rgba(0,0,0,.07)';
        g.fillRect(azar(i * 3 + Math.floor(t * 24)) * W, azar(i * 5 + 1 + Math.floor(t * 24)) * H, 1.5 + 2 * r, 1.5 + 2 * r); }
      g.fillStyle = `rgba(0,0,0,${.03 + .03 * azar(Math.floor(t * 12))})`; g.fillRect(0, 0, W, H);
      const v = g.createRadialGradient(640, 380, 300, 640, 380, 820); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.72)'); g.fillStyle = v; g.fillRect(0, 0, W, H);
    };
  }
  function PARTICULAS(g, t, def) {
    const lista = [{ tipo: 'polvo', n: 45 }].concat(def.particulas || []);
    for (const q of lista) {
      const e = clamp((t - (q.en ?? -9)) / (q.sube || 1)) * clamp(((q.hasta ?? 1e9) - t) / .6); if (e <= 0) continue;
      const [x0, y0, x1, y1] = q.zona || [0, 0, 1280, 720], zw = x1 - x0, zh = y1 - y0, n = Math.round((q.n || 40) * e);
      for (let i = 0; i < n; i++) {
        const r1 = azar(i + 1), r2 = azar(i + 101), r3 = azar(i + 201);
        if (q.tipo === 'polvo') { const y = y0 + ((r2 * zh - 12 * t * (.5 + r3)) % zh + zh) % zh, x = x0 + r1 * zw + 18 * Math.sin(t * (.3 + r3) + i);
          g.fillStyle = `rgba(255,225,160,${.12 + .2 * r3})`; g.beginPath(); g.arc(x, y, 1 + 1.6 * r3, 0, TAU); g.fill(); }
        if (q.tipo === 'pajaros') { const vida = 8 + 4 * r3, u = ((t + r1 * vida) % vida) / vida, x = x0 + u * zw, y = y0 + r2 * zh + 15 * Math.sin(t * 2 + i), al = 7 * Math.sin(t * 12 + i);
          g.strokeStyle = '#140c06'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(x - 12, y - al); g.quadraticCurveTo(x - 5, y - al * .3 - 2, x, y); g.quadraticCurveTo(x + 5, y - al * .3 - 2, x + 12, y - al); g.stroke(); }
        if (q.tipo === 'papeles' || q.tipo === 'confeti') { const vida = 3 + 2 * r3, u = ((t + r1 * vida) % vida) / vida, x = x0 + r2 * zw + 60 * Math.sin(u * 5 + i), y = y0 + u * zh;
          g.save(); g.translate(x, y); g.rotate(u * 9 + i); g.scale(1, Math.sin(t * 7 + i)); g.fillStyle = q.tipo === 'papeles' ? 'rgba(240,228,200,.9)' : NEGRO;
          const s = q.tipo === 'papeles' ? 12 : 5; g.fillRect(-s, -s * 1.3, 2 * s, 2.6 * s); g.restore(); }
        if (q.tipo === 'hojas') { const vida = 5 + 3 * r3, u = ((t + r1 * vida) % vida) / vida, x = x0 + u * zw, y = y0 + r2 * zh + 40 * Math.sin(u * 7 + i);
          g.save(); g.translate(x, y); g.rotate(t * 3 + i); g.fillStyle = NEGRO; g.beginPath(); g.ellipse(0, 0, 7, 3, 0, 0, TAU); g.fill(); g.restore(); }
      }
    }
  }
  const DECORADOS = {};
  return { escena, pose, DECORADOS, OBJETOS, PELO, SOMBREROS, tela: DECORADO_TELA, azar, ruido, suave, clamp, mezcla, rebote, peso, ik, miembro, hueco, circulo, dir, NEGRO, TAU };
})();
