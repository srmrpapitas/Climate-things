// Biblioteca de títeres de sombras de Españistán (estilo Lotte Reiniger), dibujados en cada fotograma en un <canvas>.
// Personajes con esqueleto (piernas con rodilla que se apoyan en el suelo, brazos con codo, cabeza con mandíbula),
// gestos con anticipación y rebote, y movimiento secundario (faldones, pelo, barba, objetos que cuelgan).
// Guía: fabrica/titeres/README.md. Personajes: personajes.js. Decorados: decorados.js. Escenas: escenas/*.js.
const T = (() => {
  const TAU = Math.PI * 2;
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const suave = x => (x = clamp(x), x * x * (3 - 2 * x));
  const rampa = (t, a, b) => suave((t - a) / (b - a));
  const rebote = (x, c = 1.6) => { x = clamp(x); return 1 + (c + 1) * (x - 1) ** 3 + c * (x - 1) ** 2; };   // se pasa un poco y vuelve
  const azar = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const ruido = (t, s) => .5 * Math.sin(t * 1.3 + s * 7.1) + .3 * Math.sin(t * 2.9 + s * 3.3) + .2 * Math.sin(t * 5.3 + s * 1.7);
  const mezcla = (a, b, k) => a + (b - a) * k;
  const dir = (a, l) => [l * Math.sin(a), l * Math.cos(a)];         // ángulo 0 = hacia abajo; + = hacia delante
  const NEGRO = '#0b0705';
  // campo de viento: corrientes suaves que se mueven despacio. Lo que está cerca se mueve parecido (como el viento de verdad, no cada cosa
  // por su lado); devuelve un empuje de −2 a 2 en x e y
  const campo = (x, y, t) => [Math.sin(y * .004 + t * .7) + .6 * Math.sin((x + y) * .0031 - t * 1.1) + .35 * Math.sin(y * .011 + x * .003 + t * 1.9),
    Math.cos(x * .0037 - t * .6) + .6 * Math.sin((x - y) * .0027 + t * .9) + .35 * Math.cos(x * .012 - t * 1.7)];
  // fuerza de las ráfagas (0,55 a 1): sube y baja despacio, a golpes irregulares, con un temblor encima (el viento de verdad no sopla igual)
  const fuerzaRacha = t => { const s = .5 + .5 * Math.sin(t * .37 + 1.3 * Math.sin(t * .13)); return .55 + .45 * s * s * (.8 + .2 * Math.sin(t * 2.3)); };
  let ANGULOSO = false;                                               // planos `jack`: miembros en cuña, sin puntas redondas

  const suave2 = x => (x = clamp(x), x * x * x * (x * (6 * x - 15) + 10));   // como suave, pero sin tirón al arrancar ni al parar
  // muelle amortiguado: sale de 0 con velocidad 0 (nada arranca de golpe), se pasa un poco, vuelve y se asienta en 1.
  // x = 1 es el tiempo de entrada (el pico llega en x ≈ 0,62); pasa: 1,6 ≈ 9 % de pasada, 2,6 ≈ 20 %
  const muelle = (x, pasa = 1.6) => {
    if (x <= 0) return 0; if (x >= 4) return 1;
    const z = clamp(.95 - .19 * pasa, .2, .95), wd = Math.PI / .62, w = wd / Math.sqrt(1 - z * z), e = Math.exp(-z * w * x);
    return 1 - e * (Math.cos(wd * x) + z * w / wd * Math.sin(wd * x));
  };

  // peso de un gesto: entra con muelle, se mantiene y sale suave; antes de entrar hay una pequeña anticipación (sin tirones en las juntas)
  function peso(t, a, b, entra = .32, sale = .35, pasa = 1.6) {
    if (t < a - .22 || t > b) return [0, 0];
    const ant = t < a ? -(Math.sin(Math.PI * clamp((t - (a - .22)) / .22)) ** 2) : 0;
    return [muelle((t - a) / entra, pasa) * (1 - suave2((t - (b - sale)) / sale)), ant];
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
      if (quiere !== mira && t >= a.en - GIRO) { anterior = mira; mira = quiere; giro = a.en - GIRO; }
      if (t <= a.en) break;
      const k = suave((t - a.en) / (a.hasta - a.en));
      fase += k * n / 2; x += dx * k;
      if (t < a.hasta) break;
    }
    // giro como una persona, no como una carta: la cabeza va delante, el cuerpo pasa de frente a mitad del giro
    // (si hay vista de frente) y nunca se queda fino como un papel
    const vuelta = suave(clamp((t - giro) / GIRO));
    return { x, fase, f: vuelta < 1 ? (vuelta < .5 ? anterior : mira) : mira, mira, vuelta, anterior };
  }
  const GIRO = .42;                                                     // segundos que tarda en darse la vuelta

  // ---------- la pose de un fotograma ----------
  function pose(ac, t) {
    const p = ac.p, s = p.semilla || 1, q = ac.quieto && !ac.cartoon ? 0 : 1, r = recorrido(ac, t), r2 = recorrido(ac, t - 1 / 24), r3 = recorrido(ac, t - .2);
    const vel = (r.x - r2.x) * 24, anda = clamp(Math.abs(vel) / (90 * p.alto)), velAtras = (r2.x - r3.x) / .18;
    const o = { x: r.x, y: 0, f: r.f, fase: r.fase, anda, vel: vel * Math.sign(r.mira), velAtras: velAtras * Math.sign(r.mira),
      inclina: .07 * anda + (p.encorvado || 0) + .015 * q * ruido(t * .7, s), cabeza: .03 * q * ruido(t * .9, s + 2), boca: 0, aplasta: 1,
      parpadea: (u => u < .12 || (azar(Math.floor((t + azar(s) * 4) / (3.2 + azar(s + 1))) + s) < .3 && u > .26 && u < .36))((t + azar(s) * 4) % (3.2 + azar(s + 1))),
      respira: Math.sin(t * 1.9 + s), hombros: 0, cabezaAncho: 1, cejas: .15 * q * ruido(t * .6, s + 7),
      ojos: .5 * q * Math.sin(t * .7 + s) * (Math.sin(t * .23 + s) > 0), activos: [], agacha: 0, dorsal: 0, tumbado: 0, trepaW: 0, dy: 0 };
    // vista (perfil / frente / espalda). Los giros pasan por poses dibujadas, como en los dibujos animados: perfil → tres cuartos →
    // frente → tres cuartos → perfil, sin estrecharse nunca como una hoja de papel. La cabeza va un poco por delante del cuerpo.
    // o.ladeo / o.ladeoCabeza: −1…1, hacia dónde mira el cuerpo / la cara dentro de la vista de frente (0,75 = tres cuartos)
    let vista = ac.vista || 'perfil', cambio = -9, antes = vista;
    for (const a of ac.acciones) if (a.hace === 'vista' && t >= a.en - .15) { antes = vista; vista = a.a; cambio = a.en - .15; }
    const kv = clamp((t - cambio) / .45), fr = Math.sign(r.mira) || 1; o.vista = kv < .5 ? antes : vista; o.giroVista = 1; o.ladeo = 0; o.ladeoCabeza = 0;
    if (kv < 1 && T.dibujaFrente && [antes, vista].includes('perfil') && [antes, vista].includes('frente')) {
      const de = x => { const k = antes === 'perfil' ? clamp(x) : 1 - clamp(x); return k < .3 ? null : .75 * fr * (1 - suave((k - .3) / .7)); };   // 0 perfil … 1 frente
      const L = de(kv); o.vista = L === null ? 'perfil' : 'frente'; o.ladeo = L || 0; o.ladeoCabeza = de(kv + .15) ?? o.ladeo;
    } else if (kv < 1) o.giroVista = .7 + .3 * Math.abs(Math.cos(Math.PI * suave(kv)));   // frente ↔ espalda: media vuelta rápida
    if (r.vuelta < 1 && o.vista === 'perfil' && T.dibujaFrente) {       // darse la vuelta de perfil: pasa por tres cuartos y de frente
      const v = r.vuelta, L = x => .75 * r.anterior * Math.cos(Math.PI * clamp((x - .18) / .64));
      if (v > .18 && v < .82) { o.vista = 'frente'; o.ladeo = L(v); o.ladeoCabeza = L(v + .12); }
      o.cabeza += .1 * Math.sin(Math.PI * v) * -Math.sign(r.mira);
      o.agacha = Math.max(o.agacha, .08 * Math.sin(Math.PI * v));      // baja un poco el peso al pivotar
    } else if (r.vuelta < 1 && o.vista === 'perfil') {                  // sin vista de frente: tres cuartos → de frente → tres cuartos
      const v = r.vuelta, frente = T.dibujaFrente && v > .3 && v < .7;
      const lado = T.dibujaFrente ? .3 : .5;                            // perfil que se estrecha a tres cuartos, y al revés
      if (frente) { o.vista = 'frente'; o.giroVista = .62 + .38 * Math.sin(Math.PI * (v - .3) / .4); }
      else o.giroVista = v < .5 ? mezcla(1, .62, v / lado) : mezcla(.62, 1, (v - (1 - lado)) / lado);
      o.cabeza += .1 * Math.sin(Math.PI * v) * -Math.sign(r.mira);   // la cabeza se adelanta al cuerpo
      o.agacha = Math.max(o.agacha, .06 * Math.sin(Math.PI * v));      // y baja un poco el peso al pivotar
    }
    // acercarse o alejarse de la cámara (crece o encoge mientras anda de frente)
    o.z = ac.z || 1; o.andaFrente = 0; o.faseFrente = 0;
    for (const a of ac.acciones) if (a.hace === 'acerca' && t > a.en) { const q = suave((t - a.en) / (a.hasta - a.en)); o.z = mezcla(o.z, a.a, q);
      if (t < a.hasta) { o.andaFrente = Math.min(1, 4 * q, 4 * (1 - q)); o.faseFrente = (t - a.en) * 1.7; } }
    const sw = Math.sin(TAU * r.fase) * anda * (ac.cartoon ? 1.45 : 1);   // en dibujo animado, los brazos bracean más
    o.cerca = [.12 - .42 * sw + .03 * ruido(t, s + 4), .22 + .25 * anda, p.mano || 'abierta'];
    o.lejos = [.1 + .42 * sw + .03 * ruido(t, s + 5), .2 + .25 * anda, p.manoLejos || 'abierta'];
    o.cartoon = !!ac.cartoon;
    // peso: los grandes tardan más en arrancar y en parar y rebotan menos; los menudos, al revés (ficha: `masa` lo fuerza)
    o.masa = p.masa ?? clamp(((p.grueso || 1) + .5 * (p.barriga || 0)) * (p.alto || 1) / 1.05, .8, 1.4);
    for (const a of ac.acciones) gesto(a, t, o, s);
    if (o.cartoon) {                                                     // modo dibujo animado: se encoge antes de cada gesto y se estira al lanzarlo; al andar, rebota
      let sq = 0;
      for (const a of o.activos) if (a.hace !== 'habla') sq += .9 * a.ant + (a.u > 0 && a.u < .28 ? .7 * Math.sin(Math.PI * a.u / .28) : 0);
      o.aplasta *= 1 + .1 * clamp(sq, -1, 1) + .02 * o.respira * (o.anda < .2) - .07 * anda * Math.cos(2 * TAU * r.fase);
      o.cejas *= 1.4; o.cabeza *= 1.3;
      // que no parezca un robot: nada se queda clavado. El brazo que aguanta un gesto se mece, el peso pasa de un pie a otro,
      // al andar la cabeza cabecea y el pecho contrarrota, y los ojos saltan de un sitio a otro como los de verdad
      o.cerca[0] += .035 * ruido(t * 1.4, s + 11); o.lejos[0] += .03 * ruido(t * 1.2, s + 13);
      if (o.anda < .2) { o.x += 3 * Math.sin(t * .5 + s); o.inclina += .02 * Math.sin(t * .5 + s + 1); }
      o.cabeza += .05 * anda * Math.sin(2 * TAU * r.fase + 1); o.dorsal += .04 * anda * Math.sin(TAU * r.fase);
      const ks = t / 1.3 + s, ki = Math.floor(ks);                      // el salto de mirada dura 0,08 s, no un fotograma
      o.ojos += .45 * (mezcla(azar(ki - 1 + s), azar(ki + s), suave((ks - ki) * 1.3 / .08)) - .5);
    }
    // cadena del cuerpo: el brazo que se estira hacia delante arrastra el pecho; al agacharse, el tronco se inclina para no caerse
    o.dorsal += .1 * clamp((o.cerca[0] - .9) / 1.2, -1, 1) - .06 * clamp(-o.lejos[0] / 1.2);
    o.inclina += .35 * o.agacha;
    const habla = o.activos.find(a => a.hace === 'habla'), libre = !o.activos.some(a => a.hace !== 'habla' && a.hace !== 'asiente' && a.hace !== 'niega');
    if (habla && libre && o.anda < .2) {                                 // la mano acompaña lo que dice, con golpes de énfasis
      const w = habla.w, golpe = Math.max(0, Math.sin(t * 4.3 + s)) ** 3;
      brazo(o, 'cerca', .75 + .25 * Math.sin(t * 1.7 + s) + .18 * golpe, 1.05 - .35 * golpe, 'abierta', w * .85);
      o.cabeza += .06 * w * golpe; o.cejas += .35 * w * golpe; o.inclina += .02 * w * golpe;
    }
    if (o.anda < .2 && q) { o.cabeza += .05 * Math.sin(t * .31 + s * 2) * (Math.sin(t * .13 + s) > .3); o.inclina += .012 * o.respira; o.x += 2.5 * Math.sin(t * .4 + s); }
    if (!pose.dentro) {                                                  // arrastre: el antebrazo llega un poco después que el brazo
      const lag = ac.cartoon ? .13 : .09;
      pose.dentro = true; const atras = pose(ac, t - lag); pose.dentro = false;
      if (!o.trepaW) o.lejos[0] = mezcla(o.lejos[0], atras.lejos[0], .55);   // sin gemelos: el brazo de atrás va un poco más tarde que el de delante
      for (const b of ['cerca', 'lejos']) o[b][1] = mezcla(o[b][1], atras[b][1] + (o[b][0] - atras[b][0]) * (ac.cartoon ? -.85 : -.6), ac.cartoon ? .55 : .45);
      if (ac.cartoon) o.cabeza = mezcla(o.cabeza, atras.cabeza, .35) - .6 * (o.inclina - atras.inclina);   // la cabeza llega tarde: si el cuerpo va, ella se queda
    }
    return o;
  }
  const brazo = (o, cual, sH, sC, mano, w, mu = 0) => { const b = o[cual]; o[cual] = [mezcla(b[0], sH, w), mezcla(b[1], sC, w), w > .5 && mano ? mano : b[2], mezcla(b[3] || 0, mu, w)]; };   // mu: ángulo de la muñeca
  const SIN_ANTICIPO = new Set(['habla', 'asiente', 'niega', 'recibe', 'repta', 'agacha', 'corta']);   // reacciones y gestos que no se preparan
  function gesto(a, t, o, s) {
    const hasta = a.hasta ?? a.en + 1.2, u = t - a.en;
    const m = o.masa || 1;
    let [w, ant] = peso(t, a.en, hasta, (a.entra ?? (o.cartoon ? .2 : .32)) * m, (a.sale ?? .35) * m, (o.cartoon ? 2.6 : 1.6) / m);
    if (ant < 0 && !SIN_ANTICIPO.has(a.hace)) w = ant * (o.cartoon ? .14 : .07);   // anticipación: antes del gesto, brazo y cuerpo van un poco al lado contrario
    if (a.hace === 'desenmascara' && t >= a.en) o.corteMascara = a.en;
    if (a.hace === 'coge' && t >= a.en) o['obj' + (a.mano || 'cerca')] = a.que;            // coger / soltar un objeto (daga, bandera…)
    if (a.hace === 'suelta' && t >= a.en) o['obj' + (a.mano || 'cerca')] = null;
    if (a.hace === 'clavada' && t >= a.en) o.clavada = true;                              // lleva una daga clavada en la espalda
    if (a.hace === 'tirita' && t >= a.en) o.tirita = true;
    if (a.hace === 'trepa' && t >= a.en) {                                // trepar: sube por una pendiente (dx, dy) con manos y pies; arriba se queda
      const k = clamp((t - a.en) / (a.hasta - a.en)), pasos = a.pasos ?? 6, c = TAU * k * pasos, w2 = Math.min(1, k * 6, (1 - k) * 6);
      o.x += (a.dx || 0) * k; o.dy += (a.dy || 0) * k - 10 * Math.abs(Math.sin(c / 2)) * w2;
      if (k < 1) { o.trepaW = w2; o.trepaFase = k * pasos; o.inclina += .72 * w2; o.agacha = Math.max(o.agacha, .3 * w2);
        brazo(o, 'cerca', 2.15 + .55 * Math.sin(c), -.35 - .35 * Math.sin(c), 'agarra', w2, .3); brazo(o, 'lejos', 2.15 - .55 * Math.sin(c), -.35 + .35 * Math.sin(c), 'agarra', w2, .3);
        o.cabeza -= .35 * w2; o.cejas -= .5 * w2; o.boca = Math.max(o.boca, .25 * w2 * (Math.sin(c) > .6)); }
    }
    if (a.hace === 'brinca' && t >= a.en - .3) {                       // salto grande hasta (x + dx, dy): se agacha, vuela encogido en parábola y cae con peso; allí se queda
      const vuelo = (a.hasta ?? a.en + .8) - a.en, u = t - a.en, k = clamp(u / vuelo), alto = a.alto ?? 120, dx = a.dx || 0, dy = a.dy || 0;
      o.x += dx * k; o.dy += dy * k - 4 * alto * k * (1 - k);
      if (u < 0) { const p = Math.sin(Math.PI / 2 * clamp((u + .3) / .3)); o.agacha = Math.max(o.agacha, .55 * p); o.inclina += .25 * p; o.aplasta = 1 - .1 * p;
        brazo(o, 'cerca', -.7, .5, 'abierta', p); brazo(o, 'lejos', -.8, .4, 'abierta', p); o.cejas -= .5 * p; }
      else if (k < 1) { const e = Math.sin(Math.PI * k); o.agacha = Math.max(o.agacha, .4 * e); o.inclina += .12 * e; o.aplasta = 1 + .08 * (1 - k) * (k < .3);
        brazo(o, 'cerca', mezcla(2.7, 1.3, k), .3, 'abierta', 1); brazo(o, 'lejos', mezcla(2.5, 1.1, k), .4, 'abierta', 1); o.cabeza -= .1; o.cejas -= .4; }
      else if (u < vuelo + .35) { const c = Math.sin(Math.PI * (u - vuelo) / .35); o.agacha = Math.max(o.agacha, .5 * c); o.aplasta = 1 - .1 * c * (u - vuelo < .12); o.inclina += .18 * c;
        brazo(o, 'cerca', 1.1, .5, 'abierta', c); brazo(o, 'lejos', .9, .6, 'abierta', c); }
    }
    if (a.hace === 'cuelga' && t >= a.en && t < (a.hasta ?? 1e9)) {     // colgado de una mano (la de atrás); la de la espada, suelta. `campana`: sigue su vaivén; `tirones`: tira hacia abajo
      const u = t - a.en, w2 = clamp(u / .15) * clamp(((a.hasta ?? 1e9) - t) / .15);
      const baja = tironCuerda(t, a.tirones);
      if (a.campana) { const [ang, largo] = [vaivenCampana(t, a.campana), a.largo ?? 260]; o.x -= largo * Math.sin(ang); o.dy -= largo * (1 - Math.cos(ang)); o.inclina += .5 * ang; }   // la campana gira a derechas: la cuerda se va a la izquierda
      o.dy += baja; o.x += 4 * Math.sin(u * 2.2);
      brazo(o, 'lejos', 2.92, .1, 'agarra', w2); brazo(o, 'cerca', 1.05 + .15 * Math.sin(u * 2.2 + 1), .45, 'puno', w2);
      o.agacha = Math.max(o.agacha, (.12 + .06 * Math.sin(u * 2.2 + 2)) * w2); o.cabeza -= .22 * w2; o.dorsal -= .06 * w2; o.cejas -= .5 * w2;
    }
    if (a.hace === 'apunala' && t > a.en - .5 && t < (a.hasta ?? a.en + 1.5)) {             // puñalada: arma arriba y atrás, golpe seco, aguanta y suelta
      const u2 = t - a.en, sal = rampa(t, (a.hasta ?? a.en + 1.5) - .4, a.hasta ?? a.en + 1.5); let h, c, m, d;
      if (u2 < 0) { const k = suave((u2 + .5) / .5); h = mezcla(.4, 3.0, k); c = mezcla(.3, 1.2, k); m = mezcla(0, .6, k); d = -.2 * k; o.inclina -= .08 * k; o.agacha = Math.max(o.agacha, .1 * k); }
      else if (u2 < .09) { const k = u2 / .09; h = mezcla(3.0, 1.2, k); c = mezcla(1.2, .5, k); m = mezcla(.6, -.3, k); d = mezcla(-.2, .3, k); o.inclina += .14 * k; o.impacto = true; }
      else { h = 1.2; c = .5; m = -.3; d = .3; o.inclina += .14; o.agacha = Math.max(o.agacha, .15); }
      const v = (1 - sal) * suave((u2 + .5) / .12); brazo(o, 'cerca', h, c, 'agarra', v, m); o.dorsal += d * v; o.cejas -= .8 * v; o.ojos = mezcla(o.ojos, -.3, v); return;
    }
    if (a.hace === 'corta' && t > a.en - .45 && t < (a.hasta ?? a.en + 1.2)) { o.activos.push({ hace: 'corta', w: 1, u }); }
    if (w === 0 && ant === 0 && a.hace !== 'salta' && !(a.hace === 'corta' && t > a.en - .45 && t < (a.hasta ?? a.en + 1.2))) return;
    o.activos.push({ hace: a.hace, w, ant, u, h: a.h, c: a.c });
    switch (a.hace) {
      case 'puno': o.cejas -= .6 * w; brazo(o, 'cerca', 2.3 + .08 * Math.sin(t * 11) + .5 * ant, .7, 'puno', w); o.inclina -= .06 * w; o.cabeza -= .05 * w; break;
      case 'senala': brazo(o, 'cerca', 1.5 + .04 * Math.sin(t * 3) + .3 * ant, .05, 'indice', w); o.inclina += .05 * w; break;
      case 'saluda': brazo(o, 'cerca', 2.55, .55 + .4 * Math.sin(u * 10), 'abierta', w); o.cabeza -= .05 * w; break;
      case 'celebra': brazo(o, 'cerca', 2.9 + .12 * Math.sin(t * 9 + s), .2, 'abierta', w); brazo(o, 'lejos', 2.75 + .12 * Math.sin(t * 9 + s + 1), .25, 'abierta', w);
        o.y -= 12 * w * Math.abs(Math.sin(t * 6 + s)); o.cabeza -= .1 * w; break;
      case 'aplaude': brazo(o, 'cerca', 1.25, .95 + .3 * Math.sin(t * 15 + s), 'abierta', w); brazo(o, 'lejos', 1.1, 1.05, 'abierta', w); break;
      case 'encoge': o.cejas += .8 * w; brazo(o, 'cerca', .45, 1.7, 'abierta', w); brazo(o, 'lejos', .4, 1.75, 'abierta', w); o.hombros = 8 * w; o.cabeza += .18 * w; break;
      case 'piensa': o.cejas += .4 * w * Math.sin(t * 1.3); o.ojos = mezcla(o.ojos, .8, w); brazo(o, 'cerca', .55, 2.45, 'puno', w); o.cabeza += .16 * w + .03 * Math.sin(t * 2) * w; o.inclina += .04 * w; break;
      case 'golpea': brazo(o, 'cerca', 1.25 + .65 * Math.max(0, Math.sin(u * 7)) + .4 * ant, .5, 'puno', w); o.inclina += .06 * w; break;
      case 'corta': {                                                  // tajo: arma atrás, corta en diagonal y aguanta
        const u2 = t - a.en; let h, c;
        if (u2 < 0) { const k = suave((u2 + .4) / .4); h = mezcla(.4, 3.15, k); c = mezcla(.3, .5, k); o.inclina -= .1 * k; }
        else if (u2 < .12) { const k = u2 / .12; h = mezcla(3.15, .75, k); c = mezcla(.5, -.15, k); o.inclina += .2 * k; }
        else { h = .75; c = -.15; o.inclina += .2; }
        if (u2 > -.4) { o.cerca = [mezcla(o.cerca[0], h, Math.max(w, u2 < .12 ? 1 : 0)), mezcla(o.cerca[1], c, Math.max(w, u2 < .12 ? 1 : 0)), 'puno']; o.tajo = u2; }
        o.cejas -= .7; break; }
      case 'desenmascara': o.corteMascara = a.en; o.cejas += 1.1 * w; o.boca = Math.max(o.boca, .55 * w); o.ojos = mezcla(o.ojos, -.6, w); break;
      case 'asiente': o.cabeza += .2 * w * Math.max(0, Math.sin(u * 8)); break;
      case 'niega': o.cabezaAncho = 1 - .3 * w * Math.abs(Math.sin(u * 9)); o.cabeza += .04 * w; break;
      case 'inclina': o.inclina += .45 * w; o.cabeza += .2 * w; break;
      case 'sorprende': {                                             // susto de dibujo animado: se encoge, se estira de golpe con los ojos como platos y vuelve rebotando
        const e = u < 0 ? 0 : Math.exp(-u * 5) * Math.cos(u * 18);
        o.aplasta *= 1 + .14 * ant + .2 * e * w; o.cejas += 1.4 * w; o.ojos = mezcla(o.ojos, -.6, w); o.boca = Math.max(o.boca, .6 * w);
        brazo(o, 'cerca', 2.4, .9, 'abierta', w); brazo(o, 'lejos', 2.2, 1, 'abierta', w); o.inclina -= .12 * w; o.cabeza -= .12 * w; break; }
      case 'mano': {                                                  // dar la mano: el brazo se estira, la mano de canto, y se agita (sincronizada entre los dos)
        const agita = .1 * Math.sin(u * 13) * clamp((u - .45) / .2) * clamp((hasta - .4 - t) / .2);
        brazo(o, 'cerca', 1.38 + agita + (a.h || 0), .12 - agita * .6, 'estrecha', w, -.15 + agita); o.inclina += .05 * w; o.dorsal += .05 * w; o.cabeza -= .04 * w; break; }
      case 'esconde': brazo(o, 'lejos', -.7, -.95, 'agarra', w, .2); o.dorsal -= .03 * w; break;   // la mano de atrás, a la espalda (con lo que lleve)
      case 'repta': {                                                 // reptar: tumbado, tira con los antebrazos y empuja con las rodillas (anda con `camina`)
        const c = TAU * o.fase, r1 = .5 + .5 * Math.sin(c), r2 = .5 + .5 * Math.sin(c + Math.PI);
        o.tumbado = Math.max(o.tumbado, w); o.inclina = mezcla(o.inclina, 1.4 + .04 * Math.sin(2 * c), w); o.dorsal -= (.14 + .05 * r1) * w;
        o.cabeza = mezcla(o.cabeza, .1 + .06 * Math.sin(2 * c), w); o.cejas -= .6 * w; o.boca = Math.max(o.boca, .3 * w * r1);
        brazo(o, 'cerca', mezcla(.3, 1.2, r1), mezcla(1.3, .4, r1), 'abierta', w, .6); brazo(o, 'lejos', mezcla(.3, 1.2, r2), mezcla(1.3, .4, r2), 'abierta', w, .6); break; }
      case 'miraCamara': if (o.vista === 'perfil' && T.dibujaFrente && w > .3) {   // mira a cámara: tres cuartos y luego casi de frente, la cara por delante
        o.vista = 'frente'; o.ladeo = (w < .65 ? .75 : .5) * o.f; o.ladeoCabeza = (w < .65 ? .55 : .18) * o.f; } break;
      case 'agacha': o.agacha = Math.max(o.agacha, (a.g ?? .5) * w); break;
      case 'recibe': {                                                // recibe una puñalada: se arquea, se le doblan las rodillas, la mano busca la espalda
        const k = clamp(u / .12), sacude = Math.exp(-u * 3) * Math.sin(u * 22);
        o.dorsal -= (.32 * k - .06 * sacude) * w; o.inclina -= .06 * k * w; o.cabeza -= (.28 * k + .05 * sacude) * w; o.agacha = Math.max(o.agacha, (.18 + .12 * clamp((u - .3) / .5)) * w);
        brazo(o, 'cerca', .55 + .2 * sacude, .5, 'abierta', w, .5); brazo(o, 'lejos', -1.6 + .15 * Math.sin(u * 3), 1.9, 'abierta', w * clamp((u - .2) / .3), -.4);
        o.boca = Math.max(o.boca, .7 * w); o.cejas += 1.1 * w; o.ojos = mezcla(o.ojos, .2, w); o.x += 10 * clamp(u / .4) * w + 3 * Math.sin(u * 5) * w * (u > .4); break; }
      case 'brazos': brazo(o, 'cerca', a.h ?? 1.2, a.c ?? .3, a.mano, w); if (a.h2 != null) brazo(o, 'lejos', a.h2, a.c2 ?? .3, a.mano, w); break;
      case 'habla': o.boca = Math.max(o.boca, w * clamp(.55 + .45 * Math.sin(t * 17 + s) * Math.sin(t * 5.3 + s * 2) + .25 * Math.sin(t * 29))); break;
      case 'salta': { const k = clamp(u / .55); if (u > -.15 && u < .7) { o.y -= 70 * Math.sin(Math.PI * k) * (k < 1); o.aplasta = u < 0 ? 1 - .12 * Math.sin(Math.PI * (u + .15) / .15) : u > .55 ? 1 - .15 * Math.sin(Math.PI * (u - .55) / .15) : 1.06; } break; }
    }
  }

  // ---------- dibujo de un títere (coordenadas locales: mira a la derecha, pies en y = 0) ----------
  function miembro(g, a, b, w0, w1) {
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), nx = Math.sin(ang), ny = -Math.cos(ang);
    if (ANGULOSO) { const ux = Math.cos(ang), uy = Math.sin(ang);       // hexágono: puntas en pico, como recortes de papel
      g.beginPath(); g.moveTo(a[0] + nx * w0, a[1] + ny * w0); g.lineTo(b[0] + nx * w1, b[1] + ny * w1); g.lineTo(b[0] + ux * w1 * .7, b[1] + uy * w1 * .7);
      g.lineTo(b[0] - nx * w1, b[1] - ny * w1); g.lineTo(a[0] - nx * w0, a[1] - ny * w0); g.lineTo(a[0] - ux * w0 * .7, a[1] - uy * w0 * .7); g.closePath(); g.fill(); return; }
    g.beginPath(); g.moveTo(a[0] + nx * w0, a[1] + ny * w0); g.lineTo(b[0] + nx * w1, b[1] + ny * w1);
    g.arc(b[0], b[1], w1, ang - Math.PI / 2, ang + Math.PI / 2); g.lineTo(a[0] - nx * w0, a[1] - ny * w0);
    g.arc(a[0], a[1], w0, ang + Math.PI / 2, ang + 3 * Math.PI / 2); g.fill();
  }
  const hueco = (g, f) => { g.save(); g.globalCompositeOperation = 'destination-out'; g.beginPath(); f(); g.fill(); g.restore(); };
  const circulo = (g, x, y, r) => { g.moveTo(x + r, y); g.arc(x, y, r, 0, TAU); };

  function dibuja(g, ac, t, o) {
    if (o.vista !== 'perfil' && T.dibujaFrente) return T.dibujaFrente(g, ac, t, o);
    const p = ac.p, A = p.alto, G = p.grueso, L1 = 80 * A * (p.piernas || 1), L2 = 78 * A * (p.piernas || 1), C = 150 * A * (p.piernas || 1);
    // pies: cada uno apoyado mientras el cuerpo avanza; en el aire, sube y adelanta
    const pies = [0, .5].map(d => {
      const u = ((o.fase + d) % 1 + 1) % 1;
      if (u < .5) return [C / 4 - C * u, 0, 0];
      const k = (u - .5) / .5; return [-C / 4 + C / 2 * suave(k), -20 * A * Math.sin(Math.PI * k) * o.anda, .35 * Math.sin(Math.PI * k) * o.anda];
    });
    if (o.tumbado > 0) pies.forEach((q, i) => {                          // tumbado: piernas estiradas detrás, rodillas al suelo, punta del pie clavada
      const u = TAU * (o.fase + i * .5), ti = [-(L1 + L2) * .8 + 24 * A * Math.sin(u), 0, -1.35];
      for (let j = 0; j < 3; j++) q[j] = mezcla(q[j], ti[j], o.tumbado); });
    if (o.trepaW > 0) pies.forEach((q, i) => {                           // trepando: un pie sube mientras el otro empuja
      const sn = Math.sin(TAU * o.trepaFase + i * Math.PI), ti = [(i ? -8 : 22) * A + 10 * A * sn, -34 * A * (.5 + .5 * sn), .45];
      for (let j = 0; j < 3; j++) q[j] = mezcla(q[j], ti[j], o.trepaW); });
    const caderaY = mezcla(-(L1 + L2) * (.965 - .32 * o.agacha) + 5 * o.anda * (.5 + .5 * Math.cos(2 * TAU * o.fase)), -24 * A * G - 4 * A * Math.abs(Math.sin(TAU * o.fase)), o.tumbado) + o.y;
    g.save(); g.translate(o.x, 0); g.scale(o.f * (p.escala || 1) * o.z * o.giroVista / Math.sqrt(o.aplasta), (p.escala || 1) * o.z * o.aplasta);   // al encogerse, engorda (mismo volumen) g.fillStyle = g.strokeStyle = NEGRO;
    const [pc, pl] = pies, cad = [-26 * A * o.agacha, caderaY];
    const rod = pie => ik(0, caderaY, pie[0], pie[1] - 6 * A, L1, L2);
    // lo de atrás, un poco más claro para que se lea
    g.fillStyle = '#2a1a10'; pierna(g, cad, rod(pl), pl, p, A); g.fillStyle = NEGRO;
    // columna: cadera → espalda media (inc) → espalda alta (inc + dorsal); el cuello sale de arriba
    const inc = o.inclina, sup = inc + o.dorsal, largo = 112 * A, medio = [cad[0] + Math.sin(inc) * largo * .5, cad[1] - Math.cos(inc) * largo * .5];
    const cuello = [medio[0] + Math.sin(sup) * largo * .5, medio[1] - Math.cos(sup) * largo * .5 + o.hombros * .3];
    const hombro0 = [medio[0] + Math.sin(sup) * (largo * .5 - 10), medio[1] - Math.cos(sup) * (largo * .5 - 10) - o.hombros];
    // el hombro sube cuando el brazo se alza y se adelanta o se retrasa con él
    const hombro = b => [hombro0[0] + 6 * A * clamp(b[0] / 1.6, -1, 1), hombro0[1] - 9 * A * clamp((b[0] - 1) / 1.6)];
    g.fillStyle = '#2a1a10'; brazoDib(g, hombro(o.lejos), o.lejos, p, t, o, false, A); g.fillStyle = NEGRO;
    pierna(g, cad, rod(pc), pc, p, A);
    ropa(g, p, t, o, cad, inc, largo, G, A, pies, medio);
    if (o.clavada || o.tirita) {                                         // la daga clavada (o la tirita) en la espalda alta
      const e = [-27 * G * A * (p.hombros || 1) * 1.02, -largo * .28], q = [medio[0] + e[0] * Math.cos(sup) - e[1] * Math.sin(sup), medio[1] + e[0] * Math.sin(sup) + e[1] * Math.cos(sup)];
      enColor(g, o, o.clavada && !o.tirita ? dagaClavada : tiritaColor, q, -sup, A);
    }
    g.save(); g.translate(cuello[0], cuello[1]); g.rotate(o.cabeza + sup * .4 * (1 - o.tumbado)); g.scale(o.cabezaAncho * (p.cabeza || 1) * A, (p.cabeza || 1) * A);
    cabeza(g, p, t, o); g.restore();
    brazoDib(g, hombro(o.cerca), o.cerca, p, t, o, true, A);
    g.restore();
  }
  function pierna(g, cad, rod, pie, p, A) {
    const w = (p.ropa === 'vestido' ? 9 : 14) * A * (p.grueso || 1);
    miembro(g, cad, rod, w + 3, w - 2); miembro(g, rod, [pie[0], pie[1] - 6 * A], w - 2, w - 6);
    g.save(); g.translate(pie[0], pie[1] - 6 * A); g.rotate(-pie[2]);               // zapato con punta
    g.beginPath(); g.moveTo(-9 * A, -6 * A); g.quadraticCurveTo(22 * A, -9 * A, 26 * A, 2 * A); g.lineTo(26 * A, 6 * A); g.lineTo(-11 * A, 6 * A); g.closePath(); g.fill();
    g.restore();
  }
  function brazoDib(g, hombro, [sH, sC, mano, mun = 0], p, t, o, cerca, A) {
    const [ax, ay] = dir(sH, 62 * A), codo = [hombro[0] + ax, hombro[1] + ay];
    const [bx, by] = dir(sH + sC, 56 * A), mu = [codo[0] + bx, codo[1] + by], ang = sH + sC + mun;   // la mano gira en la muñeca
    const w = 12 * A * (p.grueso || 1);
    miembro(g, hombro, codo, w + 1, w - 2); miembro(g, codo, mu, w - 2, w - 4);
    if (p.ropa === 'traje' || p.ropa === 'tunica') hueco(g, () => circulo(g, mu[0] - bx * .12, mu[1] - by * .12, 1.6 * A));   // botón del puño
    g.save(); g.translate(mu[0], mu[1]); g.rotate(-ang); manoDib(g, mano, A, t); g.restore();
    if (cerca) { const m = g.getTransform().transformPoint(new DOMPoint(mu[0] + Math.sin(ang) * 16 * A, mu[1] + Math.cos(ang) * 16 * A)); o.manoPx = [m.x, m.y]; }
    if (cerca && o.tajo != null && o.tajo > -.02 && o.tajo < .4) enColor(g, o, (gg, tt) => estela(gg, o.tajo, A), hombro, 0, A);
    const propio = cerca ? o.objcerca : o.objlejos, objeto = propio !== undefined ? propio : cerca ? p.objeto : p.objetoLejos;
    if (objeto && OBJETOS[objeto]) OBJETOS[objeto](g, mu, ang, t, o, A);
  }
  // manos con dedos (origen en la muñeca, +y a lo largo de la mano, +x hacia el pulgar)
  function manoDib(g, mano, A, t) {
    const dedo = (x0, y0, x1, y1, w) => { g.lineWidth = w * A; g.lineCap = 'round'; g.beginPath(); g.moveTo(x0 * A, y0 * A); g.lineTo(x1 * A, y1 * A); g.stroke(); };
    g.strokeStyle = g.fillStyle; g.beginPath();
    if (mano === 'puno' || mano === 'agarra') {                       // puño cerrado: nudillos marcados y el pulgar por encima
      g.moveTo(-7 * A, 2 * A); g.lineTo(7 * A, 2 * A); g.lineTo(9 * A, 12 * A); g.lineTo(6 * A, 18 * A); g.lineTo(-6 * A, 18 * A); g.lineTo(-9 * A, 10 * A); g.closePath(); g.fill();
      dedo(6, 6, 2, 13, 4.2); if (mano === 'puno') hueco(g, () => { for (let i = 0; i < 3; i++) g.rect(-6 * A, (8 + i * 3.4) * A, 6 * A, .9 * A); }); }
    else if (mano === 'estrecha') {                                   // de canto, para dar la mano: dedos juntos y el pulgar arriba
      g.moveTo(-6 * A, 1 * A); g.lineTo(6 * A, 1 * A); g.lineTo(6 * A, 14 * A); g.lineTo(-6 * A, 15 * A); g.closePath(); g.fill();
      for (let i = 0; i < 4; i++) dedo(-4.5 + i * 2.6, 13, -4.2 + i * 2.6, 27 - Math.abs(i - 1.2) * 2, 3); dedo(5, 5, 11, 14, 3.6); }
    else if (mano === 'indice') {
      g.moveTo(-7 * A, 2 * A); g.lineTo(7 * A, 2 * A); g.lineTo(8 * A, 13 * A); g.lineTo(-7 * A, 15 * A); g.closePath(); g.fill();
      dedo(3, 12, 3, 30, 3.4); dedo(5, 5, 10, 10, 3.6); }
    else {                                                            // abierta: palma y cinco dedos un poco separados
      g.moveTo(-7 * A, 1 * A); g.lineTo(7 * A, 1 * A); g.lineTo(7 * A, 14 * A); g.lineTo(-7 * A, 14 * A); g.closePath(); g.fill();
      for (let i = 0; i < 4; i++) dedo(-5 + i * 3.3, 13, -7 + i * 4.4, 26 - Math.abs(i - 1.3) * 2.5, 2.9); dedo(6, 4, 13, 10, 3.4); }
  }
  // ropa con la espalda en dos tramos: de la cadera al medio gira con `inc`; del medio arriba, además con `dorsal`
  function ropa(g, p, t, o, cad, inc, largo, G, A, pies, medio) {
    if (!medio || Math.abs(o.dorsal) < .005) return ropaTramo(g, p, t, o, cad, inc, largo, G, A, pies);
    const m = g.getTransform(), corte = (arriba, f) => { g.save(); g.translate(cad[0], cad[1]); g.rotate(inc); g.beginPath();
      arriba ? g.rect(-900, -2000, 1800, 2000 - largo * .5 + 4 * A) : g.rect(-900, -largo * .5, 1800, 3000); g.setTransform(m); g.clip(); f(); g.restore(); };
    corte(false, () => ropaTramo(g, p, t, o, cad, inc, largo, G, A, pies));
    corte(true, () => { g.translate(medio[0], medio[1]); g.rotate(o.dorsal); g.translate(-medio[0], -medio[1]); ropaTramo(g, p, t, o, cad, inc, largo, G, A, pies); });
  }
  function ropaTramo(g, p, t, o, cad, inc, largo, G, A, pies) {
    const w = 27 * G * A, bar = (p.barriga || 0) * 18 * A, lag = clamp(o.velAtras / 200, -1, 1);
    g.save(); g.translate(cad[0], cad[1]); g.rotate(inc); g.scale(1 + .012 * o.respira, 1 + .008 * o.respira);
    // tronco: espalda curva, pecho y barriga
    const H = p.hombros || 1, Ci = p.cintura || 1;                    // hombros y pecho anchos, cintura estrecha (silueta heroica)
    g.beginPath(); g.moveTo(-w * .9 * Ci, 4 * A);
    g.bezierCurveTo(-w * 1.1 * Ci, -largo * .45, -w * 1.08 * H, -largo * .85, -w * .5 * H, -largo - o.hombros);
    g.lineTo(w * .5 * H, -largo - o.hombros);
    g.bezierCurveTo(w * 1.12 * H + bar * .3, -largo * .78, w * 1.0 * Ci + bar, -largo * .35, w * .9 * Ci + bar * .6, 4 * A); g.closePath(); g.fill();
    if (p.ropa === 'traje') {
      // chaqueta con faldones que se quedan atrás al andar
      const fal = -.25 * lag - .03 * Math.sin(t * 1.7 + (p.semilla || 0)) + o.vl * (.45 + .12 * Math.sin(t * 9 + (p.semilla || 0)));
      g.beginPath(); g.moveTo(-w * .95, -6 * A); g.lineTo(-w * 1.05 + Math.sin(fal) * 30, 30 * A); g.lineTo(-w * .2, 26 * A); g.lineTo(w * .3, 30 * A);
      g.lineTo(w * .95 + bar * .6 + Math.sin(fal) * 20, 26 * A); g.lineTo(w * .9 + bar * .6, -6 * A); g.closePath(); g.fill();
      hueco(g, () => { g.moveTo(w * .15, -largo + 4 * A); g.lineTo(w * .85, -largo + 6 * A); g.lineTo(w * .55, -largo * .55); g.closePath(); });   // camisa
      const cv = o.vl * 26 * A * (.7 + .3 * Math.sin(t * 11)), cy = -Math.abs(o.vl) * 10 * A;   // corbata: con viento se levanta y ondea
      g.beginPath(); g.moveTo(w * .5, -largo + 8 * A); g.lineTo(w * .62, -largo + 10 * A); g.quadraticCurveTo(w * .62 + cv * .4, -largo * .75, w * .62 + cv, -largo * .62 + cy); g.lineTo(w * .52 + cv, -largo * .56 + cy); g.quadraticCurveTo(w * .52 + cv * .4, -largo * .72, w * .5, -largo + 8 * A); g.fill();   // corbata
      hueco(g, () => { for (let i = 0; i < 2; i++) circulo(g, w * .78 + bar * .4, -largo * (.42 - i * .16), 2 * A); });
      hueco(g, () => { g.moveTo(-w * .6, -largo * .5); g.lineTo(-w * .3, -largo * .52); g.lineTo(-w * .32, -largo * .48); g.closePath(); });   // bolsillo
    }
    if (p.ropa === 'tunica') {
      // túnica hasta los tobillos: el bajo sigue a las piernas, con encaje calado
      g.rotate(-inc); const xs = pies.map(q => q[0]), x0 = Math.min(...xs) - 18 * A, x1 = Math.max(...xs) + 22 * A, bajo = -cad[1] - 14 * A;
      const vt = o.vl * 22 * A, xa = x0 - 12 * lag * 20 + vt, xb = x1 + vt * .7;
      g.beginPath(); g.moveTo(-w * .95, -10 * A); g.quadraticCurveTo(xa - vt * .3, bajo * .55, xa, bajo);
      for (let i = 0; i <= 8; i++) { const u = i / 8, x = mezcla(xa, xb, u); g.lineTo(x, bajo + (i % 2 ? 7 * A : 0) + 3 * Math.sin(t * 3 + i)); }
      g.quadraticCurveTo(xb - vt * .2, bajo * .55, w * .95, -10 * A); g.closePath(); g.fill();
      if (p.jirones) for (let i = 0; i < 16; i++) {                      // jirones del bajo que el viento agita
        const u = (i + .5) / 16, x = mezcla(xa, xb, u), l = (12 + 26 * azar(i + 7)) * A, an = o.vl * .9 + .35 * Math.sin(t * 8 + i * 1.7) * (.3 + Math.abs(o.vl));
        g.beginPath(); g.moveTo(x - 4 * A, bajo); g.lineTo(x + 4 * A, bajo); g.lineTo(x + Math.sin(an) * l, bajo + Math.cos(an) * l); g.closePath(); g.fill(); }
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
      const lg = p.barba === 'larga' ? 26 : 9, ba = sw * (p.barba === 'larga' ? .25 : .05) + (o.vl || 0) * (p.barba === 'larga' ? .7 : .15);
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
    if (p.rostro === 'anguloso') hueco(g, () => {                       // cara angulosa: ceja gruesa y caída hacia la nariz, pómulo marcado
      g.moveTo(5, -51.5); g.lineTo(21, -46.5); g.lineTo(21, -44.6); g.lineTo(6, -48.6);
      g.moveTo(1, -35); g.quadraticCurveTo(8, -31, 15, -29.5); g.lineTo(15, -28.6); g.quadraticCurveTo(8, -30, 1, -33.8); });
    PELO[p.pelo || 'corto'](g, t, o, sw, p);
    if (p.mascara) enColor(g, o, (gg, tt) => mascara(gg, tt, o, true, p.mascara), [0, 0], 0, 1);
    if (p.cinta) {                                                      // cinta en la frente con dos puntas que ondean al viento
      hueco(g, () => { g.moveTo(-20, -55); g.quadraticCurveTo(2, -60, 22, -54); g.lineTo(22, -52.6); g.quadraticCurveTo(2, -58.4, -20, -53.5); });
      for (let k = 0; k < 2; k++) { const v = (o.vl || 0) * 46 - 14, fl = Math.sin(t * 13 + k * 2), y0 = -54 + k * 4;
        g.beginPath(); g.moveTo(-24, y0 - 3); g.quadraticCurveTo(-24 + v * .5, y0 + 4 + fl * 5, -24 + v - 6 * k, y0 + 10 + fl * 9 + k * 6);
        g.lineTo(-24 + v - 6 * k, y0 + 15 + fl * 9 + k * 6); g.quadraticCurveTo(-24 + v * .5, y0 + 9 + fl * 5, -24, y0 + 3); g.fill(); }
    }
    if (p.sombrero) SOMBREROS[p.sombrero](g, t, o);
  }
  const PELO = {
    corto(g) { g.beginPath(); g.moveTo(-22, -24); g.bezierCurveTo(-34, -50, -20, -72, 4, -70); g.bezierCurveTo(18, -70, 24, -60, 21, -50);
      for (let i = 0; i < 7; i++) g.lineTo(18 - i * 6, -55 + (i % 2 ? -5 : 0)); g.lineTo(-14, -40); g.lineTo(-16, -26); g.closePath(); g.fill(); },
    peinado(g, t) { g.beginPath(); g.moveTo(-23, -26); g.bezierCurveTo(-36, -54, -18, -78, 10, -76); g.quadraticCurveTo(30, -74, 26, -58);
      g.quadraticCurveTo(18, -64, 8, -60); g.quadraticCurveTo(-6, -56, -12, -44); g.lineTo(-16, -28); g.closePath(); g.fill();
      hueco(g, () => { g.moveTo(-14, -66); g.quadraticCurveTo(0, -74, 14, -70); g.quadraticCurveTo(0, -71, -14, -64); }); },
    entradas(g) { g.beginPath(); g.moveTo(-22, -24); g.bezierCurveTo(-34, -48, -24, -66, -6, -67); g.quadraticCurveTo(-4, -60, -10, -52); g.lineTo(-14, -40); g.lineTo(-16, -26); g.closePath(); g.fill(); },
    loco(g, t, o, sw) { for (let i = 0; i < 12; i++) { const a = -2.9 + i * .25, mu = .22 * Math.sin(t * 3 + i * 1.3) + sw * .6 * Math.sin(i), l = (26 + 16 * azar(i + 9)) * (1 + .5 * Math.abs(o.vl || 0));
      const b = [-2 + 22 * Math.cos(a), -40 + 26 * Math.sin(a)], q = [b[0] + l * Math.cos(a + mu) + (o.vl || 0) * l * (.9 + .25 * Math.sin(t * 10 + i)), b[1] + l * Math.sin(a + mu)];
      g.beginPath(); g.moveTo(b[0] - 5, b[1]); g.quadraticCurveTo((b[0] + q[0]) / 2 + 8 * Math.sin(mu * 4), (b[1] + q[1]) / 2, q[0], q[1]); g.lineTo(b[0] + 6, b[1] + 2); g.fill(); } },
    mono(g, t, o, sw) { PELO.corto(g); g.save(); g.translate(-22, -58); g.rotate(sw * .3); g.beginPath(); g.ellipse(-6, 0, 13, 11, 0, 0, TAU); g.fill();
      hueco(g, () => g.ellipse(-6, 0, 5, 3, .4, 0, TAU)); g.restore(); },
    coleta(g, t, o, sw) { PELO.corto(g); g.save(); g.translate(-24, -50); g.rotate(.5 + sw * .8 - .3 * clamp(o.vel / 150, -1, 1) - (o.vl || 0) * 1.2); g.beginPath(); g.moveTo(-4, -5); g.quadraticCurveTo(-14, 20, -4, 44); g.quadraticCurveTo(8, 20, 6, -4); g.fill(); g.restore(); },
    calvo() {},
    samurai(g, t, o, sw) {                                             // pelo recogido en un moño, con mechones sueltos que el viento arrastra
      PELO.peinado(g, t);
      g.save(); g.translate(-6, -74); g.rotate(-.2 + .08 * Math.sin(t * 3) - (o.vl || 0) * .3); g.beginPath(); g.ellipse(0, 0, 8, 6, 0, 0, TAU); g.fill();
      g.beginPath(); g.moveTo(-2, -4); g.quadraticCurveTo(-10 + (o.vl || 0) * 20, -18, -16 + (o.vl || 0) * 30, -10 + 3 * Math.sin(t * 9)); g.lineTo(-12 + (o.vl || 0) * 28, -6); g.quadraticCurveTo(-6, -10, 2, -2); g.fill(); g.restore();
      for (let k = 0; k < 6; k++) { const v = o.vl || 0, l = 22 + 18 * azar(k + 3), y0 = -60 + k * 6, fl = Math.sin(t * 10 + k * 1.9);
        g.beginPath(); g.moveTo(-22, y0); g.quadraticCurveTo(-24 + v * l * .6, y0 + 10 + fl * 3, -22 + v * l * 1.3 - (1 - Math.abs(v)) * 6, y0 + l * (1 - Math.abs(v) * .7) + fl * 4);
        g.lineTo(-19 + v * l * 1.2, y0 + l * (1 - Math.abs(v) * .7) + fl * 4 - 3); g.quadraticCurveTo(-20 + v * l * .5, y0 + 8, -18, y0 - 2); g.fill(); } },
  };
  const SOMBREROS = {
    gorra(g) { g.beginPath(); g.moveTo(-24, -52); g.quadraticCurveTo(-18, -78, 8, -74); g.quadraticCurveTo(24, -70, 22, -56); g.lineTo(40, -54); g.lineTo(38, -50); g.closePath(); g.fill(); },
    chistera(g) { g.fillRect(-24, -66, 52, 6); g.beginPath(); g.moveTo(-16, -64); g.lineTo(-18, -112); g.lineTo(20, -112); g.lineTo(18, -64); g.fill(); hueco(g, () => g.rect(-17, -76, 36, 4)); },
    boina(g) { g.beginPath(); g.ellipse(0, -64, 28, 10, -.15, 0, TAU); g.fill(); g.fillRect(-2, -78, 4, 8); },
  };
  // objetos que se llevan en la mano (mu = muñeca, ang = ángulo del antebrazo)
  // objetos en color real: no se pintan en la capa de siluetas; se apuntan y la escena los dibuja al final (T.pintaColores)
  const enColor = (g, o, f, mu, ang, A) => { (o.colores = o.colores || []).push({ m: g.getTransform(), f, mu, ang, A }); };
  function espadaColor(g, t, A) {                                      // espada de Toledo: hoja de acero pulido, guarda de oro, puño rojo
    const L = 132 * A, y0 = 18 * A;
    g.save(); g.globalCompositeOperation = 'lighter'; const gl = g.createLinearGradient(-20 * A, 0, 20 * A, 0);
    gl.addColorStop(0, 'rgba(160,210,255,0)'); gl.addColorStop(.5, 'rgba(190,225,255,.28)'); gl.addColorStop(1, 'rgba(160,210,255,0)');
    g.fillStyle = gl; g.fillRect(-20 * A, y0, 40 * A, L + 10 * A); g.restore();
    const hj = g.createLinearGradient(-4 * A, 0, 4 * A, 0); hj.addColorStop(0, '#6f7c89'); hj.addColorStop(.45, '#f6f9ff'); hj.addColorStop(.55, '#c9d3dd'); hj.addColorStop(1, '#55616d');
    g.fillStyle = hj; g.beginPath(); g.moveTo(-4 * A, y0); g.lineTo(4 * A, y0); g.lineTo(3 * A, y0 + L * .9); g.lineTo(0, y0 + L); g.lineTo(-3 * A, y0 + L * .9); g.closePath(); g.fill();
    g.strokeStyle = 'rgba(70,80,95,.9)'; g.lineWidth = 1.1 * A; g.beginPath(); g.moveTo(0, y0 + 4 * A); g.lineTo(0, y0 + L * .55); g.stroke();   // vaceo
    const u = ((t * .45) % 1.4) / 1.4;                                 // destello que recorre la hoja
    if (u < .75) { const y = y0 + L * u / .75, br = g.createLinearGradient(0, y - 14 * A, 0, y + 14 * A); br.addColorStop(0, 'rgba(255,255,255,0)'); br.addColorStop(.5, 'rgba(255,255,255,.95)'); br.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = br; g.fillRect(-4 * A, y - 14 * A, 8 * A, 28 * A); }
    if (((t * .45) % 1.4) > 1.1) { const k = Math.sin(Math.PI * (((t * .45) % 1.4) - 1.1) / .3); g.save(); g.translate(0, y0 + L); g.fillStyle = `rgba(255,255,255,${k})`;
      for (let r = 0; r < 4; r++) { g.rotate(Math.PI / 4); g.fillRect(-.8 * A, -14 * A * k, 1.6 * A, 28 * A * k); } g.restore(); }
    const oro = g.createLinearGradient(0, 12 * A, 0, 20 * A); oro.addColorStop(0, '#fff1a8'); oro.addColorStop(.5, '#d9a62e'); oro.addColorStop(1, '#7a5310');
    g.fillStyle = oro; g.beginPath(); g.moveTo(-20 * A, 14 * A); g.quadraticCurveTo(0, 20 * A, 20 * A, 14 * A); g.lineTo(21 * A, 19 * A); g.quadraticCurveTo(0, 23 * A, -21 * A, 19 * A); g.closePath(); g.fill();
    for (const l of [-1, 1]) { g.beginPath(); g.arc(l * 21 * A, 12 * A, 3.6 * A, 0, TAU); g.fill(); }
    g.fillStyle = '#7d1010'; g.fillRect(-3.2 * A, -12 * A, 6.4 * A, 26 * A); g.fillStyle = '#e2b24a'; for (let k = 0; k < 4; k++) g.fillRect(-3.2 * A, -9 * A + k * 6 * A, 6.4 * A, 1.4 * A);
    g.fillStyle = oro; g.beginPath(); g.arc(0, -15 * A, 5.5 * A, 0, TAU); g.fill(); g.fillStyle = 'rgba(255,255,255,.7)'; g.beginPath(); g.arc(-1.6 * A, -16.5 * A, 1.6 * A, 0, TAU); g.fill();
  }
  // daga «RUPTURA» a lo Jack: hoja plana de marfil con un filo, puño negro y guarda roja. En la mano atraviesa el puño; la hoja sale por el meñique
  function dagaColor(g, t, A, soloPunta) {
    g.save(); g.translate(0, 10 * A);
    g.fillStyle = '#16100c'; g.fillRect(-4 * A, -4 * A, 22 * A, 8 * A); g.beginPath(); g.arc(19 * A, 0, 4.5 * A, 0, TAU); g.fill();   // puño y pomo
    g.fillStyle = '#8f1410'; g.fillRect(-8 * A, -9 * A, 4 * A, 18 * A);                                              // guarda
    const L = soloPunta ? 14 : 62;
    g.fillStyle = '#efe7d6'; g.beginPath(); g.moveTo(-8 * A, -4 * A); g.lineTo(-(8 + L * .86) * A, -3 * A); g.lineTo(-(8 + L) * A, .5 * A); g.lineTo(-(8 + L * .86) * A, 4 * A); g.lineTo(-8 * A, 4 * A); g.closePath(); g.fill();
    g.fillStyle = '#a69d8e'; g.beginPath(); g.moveTo(-8 * A, .6 * A); g.lineTo(-(8 + L) * A, .5 * A); g.lineTo(-(8 + L * .86) * A, 4 * A); g.lineTo(-8 * A, 4 * A); g.closePath(); g.fill();
    if (!soloPunta) { g.save(); g.translate(-38 * A, -.2 * A); g.scale(-1, 1); g.font = `700 ${5.2 * A}px Georgia, serif`; g.textAlign = 'center'; g.fillStyle = '#9b1510'; g.fillText('RUPTURA', 0, 0); g.restore(); }
    g.restore();
  }
  const dagaClavada = (g, t, A) => { g.rotate(3.75); g.translate(16 * A, -10 * A); dagaColor(g, t, A, true); };   // la punta entra hacia delante y abajo; se ve el puño y un trozo de hoja
  function tiritaColor(g, t, A) { g.fillStyle = '#eadbc0'; for (const r of [.7, -.7]) { g.save(); g.rotate(r); g.fillRect(-14 * A, -4 * A, 28 * A, 8 * A); g.restore(); }
    g.fillStyle = 'rgba(120,80,50,.5)'; g.fillRect(-3 * A, -3 * A, 6 * A, 6 * A); }
  function estela(g, u, A) {                                          // media luna de luz que deja la espada al cortar
    const R = (62 + 56 + 120) * A, a0 = 3.15, a1 = mezcla(3.15, .75, clamp(u / .12)), al = clamp(1 - (u - .05) / .3);
    if (a1 >= a0 - .01) return; g.save(); g.globalCompositeOperation = 'lighter';
    for (const [r, wdt, c] of [[R, 26 * A, `rgba(150,220,255,${.35 * al})`], [R, 9 * A, `rgba(255,255,255,${.9 * al})`]]) {
      g.beginPath(); for (let k = 0; k <= 20; k++) { const a = mezcla(a0, a1, k / 20), ww = wdt * Math.sin(Math.PI * k / 20); g.lineTo(Math.sin(a) * (r + ww), Math.cos(a) * (r + ww)); }
      for (let k = 20; k >= 0; k--) { const a = mezcla(a0, a1, k / 20); g.lineTo(Math.sin(a) * (r - wdt * .3), Math.cos(a) * (r - wdt * .3)); } g.closePath(); g.fillStyle = c; g.fill(); }
    g.restore();
  }
  // máscara de teatro (la mentira): marfil, sonrisa pintada y un rótulo; al cortarla, sus dos mitades caen girando
  function mascara(g, t, o, perfil, texto) {
    const forma = () => { g.beginPath();
      if (perfil) { g.moveTo(2, -70); g.quadraticCurveTo(22, -72, 25, -50); g.lineTo(26, -42); g.lineTo(36, -29); g.lineTo(26, -24); g.lineTo(27, -14); g.quadraticCurveTo(24, -2, 14, 0); g.quadraticCurveTo(4, -2, 0, -14); g.quadraticCurveTo(-4, -44, 2, -70); }
      else { g.moveTo(0, -76); g.bezierCurveTo(30, -76, 30, -30, 22, -14); g.quadraticCurveTo(0, 6, -22, -14); g.bezierCurveTo(-30, -30, -30, -76, 0, -76); } g.closePath(); };
    const pinta = () => {
      const gr = g.createLinearGradient(-20, -70, 25, 0); gr.addColorStop(0, '#f3ead6'); gr.addColorStop(1, '#bfae8c'); forma(); g.fillStyle = gr; g.fill();
      g.lineWidth = 1.6; g.strokeStyle = '#4a3418'; g.stroke(); g.fillStyle = '#1a0f07';
      const ojos = perfil ? [[14, -44]] : [[-10, -46], [10, -46]];
      for (const [x, y] of ojos) { g.beginPath(); g.ellipse(x, y, 5.5, 3.2, perfil ? .1 : (x < 0 ? .25 : -.25), 0, TAU); g.fill(); }
      g.strokeStyle = '#9c1d14'; g.lineWidth = 2.6; g.beginPath(); if (perfil) { g.moveTo(10, -16); g.quadraticCurveTo(20, -10, 27, -19); } else { g.moveTo(-13, -22); g.quadraticCurveTo(0, -8, 13, -22); } g.stroke();
      g.fillStyle = 'rgba(200,70,60,.35)'; for (const [x, y] of perfil ? [[12, -30]] : [[-14, -30], [14, -30]]) { g.beginPath(); g.arc(x, y, 5, 0, TAU); g.fill(); }
      if (texto) { g.save(); g.translate(perfil ? 12 : 0, -60); if (g.getTransform().a < 0) g.scale(-1, 1);   // que el rótulo no salga al revés
        g.fillStyle = '#5a3a18'; g.font = '700 6.5px Georgia, serif'; g.textAlign = 'center'; g.fillText(texto, 0, 0); g.restore(); }
    };
    const c = o.corteMascara;
    if (c == null || t < c) { pinta(); return; }
    const u = t - c; if (u > 2.2) return;
    for (const lado of [-1, 1]) {                                        // dos mitades, cortadas en diagonal, que caen
      g.save(); g.translate(lado * 14 * u, 260 * u * u - 20 * u); g.rotate(lado * 1.8 * u);
      g.beginPath(); if (lado < 0) { g.moveTo(-60, -90); g.lineTo(60, -90); g.lineTo(60, -50); g.lineTo(-60, -20); } else { g.moveTo(-60, -20); g.lineTo(60, -50); g.lineTo(60, 20); g.lineTo(-60, 20); }
      g.closePath(); g.clip(); pinta(); g.restore();
    }
  }
  function pintaColores(g, lista, t) { for (const c of lista || []) { g.save(); g.setTransform(c.m); g.translate(c.mu[0], c.mu[1]); g.rotate(-c.ang); c.f(g, t, c.A); g.restore(); } }
  const OBJETOS = {
    espada(g, mu, ang, t, o, A) { enColor(g, o, espadaColor, mu, ang, A); },
    arrastra(g, mu, ang, t, o, A) {                                   // bandera arrastrada por el suelo: el palo detrás y la tela a ras de tierra
      const fin = [mu[0] - 200 * A, -4 * A]; g.lineWidth = 5 * A; g.beginPath(); g.moveTo(mu[0], mu[1] + 6 * A); g.lineTo(fin[0], fin[1]); g.stroke();
      DECORADO_TELA(g, fin[0] + 70 * A, fin[1] - 34 * A + 6 * Math.sin(t * 5), 70 * A, 30 * A, t, -1); },
    daga(g, mu, ang, t, o, A) { enColor(g, o, dagaColor, mu, ang, A); },
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
      const top = [mu[0] + 106 * A * Math.sin(ang), mu[1] + 106 * A * Math.cos(ang)]; DECORADO_TELA(g, top[0], top[1], 92 * A, 58 * A, t, -1); },   // la tela, en la punta del mástil
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
    halo.width = capa.width / 10; halo.height = capa.height / 10;
    const borde = document.createElement('canvas'); borde.width = capa.width; borde.height = capa.height; lejos.width = capa.width / 3; lejos.height = capa.height / 3;
    // cámara: curva cúbica monótona por las claves. No se para en cada clave si sigue en el mismo sentido; se para al principio,
    // al final y donde da la vuelta o se queda quieta. Con dos claves es igual que suave()
    const pendiente = (c, k, j) => { const h = c[k + 1][0] - c[k][0]; return h > 1e-6 ? (c[k + 1][j] - c[k][j]) / h : NaN; };
    const tangente = (c, k, j) => {
      if (k <= 0 || k >= c.length - 1) return 0;
      const d0 = pendiente(c, k - 1, j), d1 = pendiente(c, k, j), h0 = c[k][0] - c[k - 1][0], h1 = c[k + 1][0] - c[k][0];
      if (!(d0 * d1 > 0)) return 0;
      const w1 = 2 * h1 + h0, w2 = h1 + 2 * h0; return (w1 + w2) / (w1 / d0 + w2 / d1);
    };
    const cam = t => {                                                 // [x, y, zoom] interpolados entre las claves, más el pulso de la mano
      const c = def.camara || [[0, 640, 360, 1]]; let i = 0;
      while (i < c.length - 1 && t >= c[i + 1][0]) i++;
      const val = j => { if (i >= c.length - 1) return c[i][j]; const h = c[i + 1][0] - c[i][0]; if (h <= 1e-6) return c[i + 1][j];
        const u = clamp((t - c[i][0]) / h), u2 = u * u, u3 = u2 * u;
        return (2 * u3 - 3 * u2 + 1) * c[i][j] + (u3 - 2 * u2 + u) * h * tangente(c, i, j) + (3 * u2 - 2 * u3) * c[i + 1][j] + (u3 - u2) * h * tangente(c, i + 1, j); };
      const pulso = def.quieto ? 0 : 1;
      return [val(1) + pulso * (4 * Math.sin(t * .37) + 2 * Math.sin(t * 1.1)), val(2) + pulso * 3 * Math.sin(t * .29), val(3)];
    };
    const sub = document.createElement('canvas'); sub.width = capa.width; sub.height = capa.height; const KS = sub.getContext('2d');   // para el desenfoque de movimiento
    // formarse y deshacerse (actor.forma = { aparece, desaparece, dura: 1,4, materia: 'hojas' | 'tinta' }): el títere se dibuja aparte y
    // se trocea en celdas de 8 px; cada celda llega volando con el viento (o se va volando) como una hoja o una gota, a su hora.
    // La hora de cada celda depende de su sitio dentro del títere, así que el orden no cambia aunque el títere se mueva
    const F = document.createElement('canvas'); F.width = capa.width; F.height = capa.height; const KF = F.getContext('2d');
    const rej = document.createElement('canvas'); rej.width = Math.ceil(capa.width / 8); rej.height = Math.ceil(capa.height / 8);
    const KR = rej.getContext('2d', { willReadFrequently: true }), msk = document.createElement('canvas'); msk.width = rej.width; msk.height = rej.height; const KM = msk.getContext('2d');
    const fase = (ac, t) => { const f = ac.forma; if (!f) return null; const d = f.dura ?? 1.4;
      if (f.aparece != null && t < f.aparece) return 'oculto'; if (f.aparece != null && t < f.aparece + d) return { k: (t - f.aparece) / d, entra: true, f };
      if (f.desaparece != null && t >= f.desaparece + d) return 'oculto'; if (f.desaparece != null && t >= f.desaparece) return { k: (t - f.desaparece) / d, entra: false, f }; return null; };
    const deshaz = (D, { k, entra, f }, ox, oy, t, tam) => {
      const w = rej.width, h = rej.height, vuelo = .32, hojas = f.materia !== 'tinta', i0 = Math.floor(ox / 8), j0 = Math.floor(oy / 8), vuelan = [];
      KR.clearRect(0, 0, w, h); KR.drawImage(F, 0, 0, w, h); const d = KR.getImageData(0, 0, w, h).data;
      KM.clearRect(0, 0, w, h); KM.fillStyle = '#fff';
      for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { if (d[4 * (j * w + i) + 3] < 50) continue;
        const li = i - i0, lj = j - j0, hs = azar(li * 73.1 + lj * 19.7 + 5), x0 = clamp((li + 30) / 60), a = .04 + .6 * (.55 * hs + .45 * (entra ? x0 : x0));
        if (entra ? k >= a + vuelo : k < a) KM.fillRect(i - .3, j - .3, 1.6, 1.6);                     // la celda ya está (o aún está) en su sitio
        else if (k >= a && k < a + vuelo) vuelan.push([(i + .5) * 8, (j + .5) * 8, entra ? (k - a) / vuelo : 1 - (k - a) / vuelo, hs]); }
      KF.save(); KF.setTransform(1, 0, 0, 1, 0, 0); KF.globalCompositeOperation = 'destination-in'; KF.imageSmoothingQuality = 'high'; KF.drawImage(msk, 0, 0, F.width, F.height); KF.restore();
      D.save(); D.setTransform(1, 0, 0, 1, 0, 0); D.globalAlpha = 1; D.drawImage(F, 0, 0); D.fillStyle = D.strokeStyle = NEGRO; D.lineCap = 'round';
      const en = (px, py, hs, e) => { const lx = entra ? -620 - 260 * hs : 640 + 260 * hs, ly = entra ? -120 + 160 * azar(hs * 91) : -260 - 160 * azar(hs * 91);   // todas vienen (o se van) con el mismo viento
        const x = mezcla(px + lx * tam, px, e), y = mezcla(py + ly * tam, py, e) - Math.sin(Math.PI * e) * 90 * tam, [cx, cy] = campo(x, y, t * .8), w = Math.sin(Math.PI * e) * 70 * tam;
        return [x + w * cx, y + w * cy]; };
      for (const [px, py, u, hs] of vuelan) { const e = suave(u), [x, y] = en(px, py, hs, e);   // la hoja se mece y da vueltas sobre sí, no gira como una hélice
        if (hojas) { D.save(); D.translate(x, y); D.rotate(hs * 40 + 1.2 * Math.sin(t * 4 + hs * 9)); D.scale(1, .2 + .8 * Math.abs(Math.cos(t * 5 + hs * 30))); D.beginPath(); D.ellipse(0, 0, 8 * tam, 3.4 * tam, 0, 0, TAU); D.fill(); D.restore(); }
        else { const [x0, y0] = en(px, py, hs, suave(clamp(u + (entra ? -.12 : .12)))), [xm, ym] = en(px, py, hs, suave(clamp(u + (entra ? -.05 : .05))));   // gota con cola que adelgaza
          D.lineWidth = (1.5 + 2 * hs) * tam; D.beginPath(); D.moveTo(x0, y0); D.lineTo(xm, ym); D.stroke(); D.lineWidth = (3 + 5 * hs) * tam; D.beginPath(); D.moveTo(xm, ym); D.lineTo(x, y); D.stroke(); } }
      D.restore(); };
    const pinta = function (t) {
      t = Math.floor(t * (def.fps || 30) + 1e-6) / (def.fps || 30);  // 30 dibujos por segundo (el usuario quiere 30 fps en todo el capítulo)
      ANGULOSO = !!def.jack;
      const [cx, cy, z] = cam(t), luz = .88 + .05 * Math.sin(t * 5.3) + .04 * Math.sin(t * 11.7 + 1);
      g.setTransform(S, 0, 0, S, 0, 0); g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
      const matriz = par => [z * S, 0, 0, z * S, (W / 2 - (640 + (cx - 640) * par) * z) * S, (H / 2 - (360 + (cy - 360) * par) * z) * S];
      const capaCam = par => g.setTransform(...matriz(par));
      capaCam(.3); g.filter = `brightness(${luz})`; if (!def.jack && fondo && fondo.complete) g.drawImage(fondo, -120, -80, W + 240, H + 160); g.filter = 'none';
      // lo lejano (par < 0,6) se dibuja a un tercio de resolución y se agranda: desenfoque de cine casi gratis
      const lg = lejos.getContext('2d'); let hayLejos = false;
      const vuelca = () => { if (!hayLejos) return; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.imageSmoothingQuality = 'high'; g.drawImage(lejos, 0, 0, lienzo.width, lienzo.height); g.restore(); lg.setTransform(1, 0, 0, 1, 0, 0); lg.clearRect(0, 0, lejos.width, lejos.height); hayLejos = false; };
      lg.setTransform(1, 0, 0, 1, 0, 0); lg.clearRect(0, 0, lejos.width, lejos.height);
      const visible = d => (d.desde == null || t >= d.desde) && (d.hasta == null || t < d.hasta);   // un decorado puede aparecer (desde) o irse (hasta)
      for (const d of def.decorado || []) { const p = d.par ?? 1; if (!DECORADOS[d.tipo] || !visible(d)) continue;
        if (p < .6) { const m = matriz(p), f = lejos.width / lienzo.width; lg.setTransform(m[0] * f, 0, 0, m[3] * f, m[4] * f, m[5] * f); DECORADOS[d.tipo](lg, t, d); hayLejos = true; }
        else { vuelca(); capaCam(p); DECORADOS[d.tipo](g, t, d); } }
      vuelca(); capaCam(1);
      capaCam(1);
      // títeres, en su propia capa para que los calados dejen ver el pergamino
      K.setTransform(1, 0, 0, 1, 0, 0); K.clearRect(0, 0, capa.width, capa.height); K.setTransform(...matriz(1)); const luces = [], colores = []; let hayImpacto = false;
      // desenfoque de movimiento: cada títere se dibuja N veces dentro del obturador (media vuelta, 1/60 s) y se promedian;
      // lo quieto sale igual de nítido y lo rápido deja un rastro suave, como en el cine. `desenfoque: 0` lo apaga
      const formandose = (def.actores || []).some(ac => typeof fase(ac, t) === 'object' && fase(ac, t));
      const N = def.desenfoque === 0 || formandose ? 1 : def.muestras || 5, obt = (def.desenfoque ?? .5) / (def.fps || 30);
      for (let j = 0; j < N; j++) {
        const tj = N > 1 ? t + obt * (j / (N - 1) - .5) : t, centro = j === (N - 1) >> 1; let D = N > 1 ? KS : K;
        if (N > 1) { D.setTransform(1, 0, 0, 1, 0, 0); D.clearRect(0, 0, sub.width, sub.height); D.setTransform(...matriz(1)); }
        for (const ac of def.actores || []) {
          if ((ac.desde != null && t < ac.desde) || (ac.hasta != null && t >= ac.hasta)) continue;   // un títere puede aparecer (desde) o irse (hasta)
          const fz = fase(ac, t); if (fz === 'oculto') continue;
          const D0 = D; if (fz) { KF.setTransform(1, 0, 0, 1, 0, 0); KF.clearRect(0, 0, F.width, F.height); KF.setTransform(...matriz(1)); D = KF; }
          if (def.quieto) ac.quieto = true;
          if (def.cartoon) ac.cartoon = true;
          const o = pose(ac, tj), racha = (def.viento || 0) * 1.3 * fuerzaRacha(tj) * (1 + .1 * Math.sin(tj * 6.1 + 1));
          o.vf = -racha; o.vl = o.vista === 'perfil' ? -racha * Math.sign(o.f || 1) : -racha;
          D.save(); D.translate(0, (def.suelo || 600) + (ac.y || 0) + o.dy);             // ac.y: subido a algo (negativo) o hundido
          D.globalAlpha = ac.p.tono ?? 1; dibuja(D, ac, tj, o);
          if (def.cartoon && o.anda > .5) {                                  // líneas de velocidad detrás de quien corre
            const es = (ac.p.escala || 1) * o.z, dx = -(o.f || 1); D.strokeStyle = NEGRO; D.lineCap = 'round'; D.lineWidth = 3 * es;
            for (let i = 0; i < 3; i++) { const yy = -(60 + 55 * i) * es, l = (60 + 50 * azar(i + Math.floor(t * 10))) * es * o.anda, x0 = o.x + dx * (45 + 20 * i) * es;
              D.globalAlpha = .45 * o.anda; D.beginPath(); D.moveTo(x0, yy); D.lineTo(x0 + dx * l, yy); D.stroke(); }
          }
          D.restore();
          if (fz) { D = D0; const m = matriz(1); deshaz(D, fz, m[0] * o.x + m[4], m[3] * ((def.suelo || 600) + (ac.y || 0)) + m[5], t, z * S * (ac.p.escala || 1) / 1.5); }
          if (!centro) continue;
          colores.push(...(o.colores || []));
          if (o.impacto) hayImpacto = true; ac._o = o;
          for (const l of o.luces || []) luces.push([o.x + l[0] * o.f * (ac.p.escala || 1), (def.suelo || 600) + (ac.y || 0) + l[1] * (ac.p.escala || 1)]);
        }
        if (N > 1) { K.save(); K.setTransform(1, 0, 0, 1, 0, 0); K.globalCompositeOperation = 'lighter'; K.globalAlpha = 1 / N; K.drawImage(sub, 0, 0); K.restore(); }
      }
      g.setTransform(1, 0, 0, 1, 0, 0);
      if (def.contraluz !== 0) { const h = halo.getContext('2d'); h.globalCompositeOperation = 'copy'; h.drawImage(capa, 0, 0, halo.width, halo.height);
        h.globalCompositeOperation = 'source-in'; h.fillStyle = 'rgb(255,190,110)'; h.fillRect(0, 0, halo.width, halo.height);
        g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = (def.contraluz ?? .5) * luz; g.imageSmoothingQuality = 'high'; g.drawImage(halo, 0, 0, capa.width, capa.height); g.restore(); }
      if (def.borde !== 0) {                                              // doble contraluz: borde frío por un lado y cálido por el otro
        const r = borde.getContext('2d'), [c1, c2] = def.bordes || ['rgb(110,235,235)', 'rgb(255,178,96)'], d = 3.2 * S * Math.min(z, 1.2) * (def.borde ?? 1), op = .85 * clamp(1.6 - .45 * z, .25, 1);   // de cerca el borde no se separa: no hay doble figura
        for (const [col, dx] of [[c1, -d], [c2, d]]) { r.globalCompositeOperation = 'copy'; r.drawImage(capa, 0, 0); r.globalCompositeOperation = 'source-in'; r.fillStyle = col; r.fillRect(0, 0, borde.width, borde.height);
          g.save(); g.globalAlpha = op; g.drawImage(borde, dx, -d * .4); g.restore(); }
      }
      g.drawImage(capa, 0, 0);
      if (def.figura) {                                                   // dos tonos a lo Jack: gris plano y franja negra en el lado de la sombra
        const r = borde.getContext('2d'), d = (def.sombra ?? 10) * S * z * (def.luzDe === 'derecha' ? 1 : -1);
        r.globalCompositeOperation = 'copy'; r.drawImage(capa, d, -Math.abs(d) * .5); r.globalCompositeOperation = 'source-in'; r.fillStyle = def.figura; r.fillRect(0, 0, borde.width, borde.height);
        r.globalCompositeOperation = 'destination-in'; r.drawImage(capa, 0, 0); r.globalCompositeOperation = 'source-over'; g.drawImage(borde, 0, 0);
      }
      capaCam(1);
      for (const d of def.delante || []) if (DECORADOS[d.tipo] && visible(d)) DECORADOS[d.tipo](g, t, d);
      g.globalCompositeOperation = 'lighter';
      for (const [lx, ly] of luces.concat((def.luces || []).map(l => [l[0], l[1]]))) {
        const gr = g.createRadialGradient(lx, ly, 2, lx, ly, 130); gr.addColorStop(0, `rgba(255,200,110,${.5 * luz})`); gr.addColorStop(1, 'rgba(255,170,80,0)');
        g.fillStyle = gr; g.fillRect(lx - 140, ly - 140, 280, 280);
      }
      g.globalCompositeOperation = 'source-over';
      PARTICULAS(g, t, def);
      if (hayImpacto) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'difference'; g.fillStyle = '#fff'; g.fillRect(0, 0, lienzo.width, lienzo.height); g.restore(); }   // fotograma de impacto: la imagen se invierte
      g.setTransform(S, 0, 0, S, 0, 0);
      pinta.colores = colores;
      for (let i = 0; i < 260; i++) { const r = azar(i * 7 + Math.floor(t * 30) * 131); g.fillStyle = r < .5 ? 'rgba(255,240,210,.05)' : 'rgba(0,0,0,.07)';
        g.fillRect(azar(i * 3 + Math.floor(t * 30)) * W, azar(i * 5 + 1 + Math.floor(t * 30)) * H, 1.5 + 2 * r, 1.5 + 2 * r); }
      g.fillStyle = `rgba(0,0,0,${.03 + .03 * azar(Math.floor(t * 12))})`; g.fillRect(0, 0, W, H);
      const v = g.createRadialGradient(640, 380, 300, 640, 380, 820); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.72)'); g.fillStyle = v; g.fillRect(0, 0, W, H);
    };
    return pinta;
  }
  // cuervo con detalle (vuela hacia la derecha; dir = -1 hacia la izquierda): pico grueso y curvo, cola en abanico,
  // alas con las cinco plumas primarias abiertas como dedos, ojo con brillo y plumas marcadas. fase = momento del aleteo
  function cuervo(g, x, y, s, fase, dir = 1) {
    const al = Math.sin(fase), ala = (lejos) => {
      const th = (lejos ? -.25 : 0) - 1.15 * al, pl = lejos ? .82 : 1;
      g.save(); g.translate(lejos ? 4 : 1, -3); g.rotate(th * .55); g.scale(pl, pl);
      const ab = .55 + .45 * Math.cos(fase);                               // el ala se pliega un poco al subir
      g.rotate(th * .45); g.fillStyle = lejos ? '#1d1714' : '#0b0705'; g.beginPath(); g.moveTo(8, 0); g.lineTo(9, -14 * ab);
      g.quadraticCurveTo(7, -26 * ab, 2, -36);                              // borde de ataque hasta la punta
      const dedos = [[2, -36], [-1, -31], [-3, -37], [-5, -31], [-8, -36], [-10, -30], [-13, -34], [-14, -28], [-17, -30]];
      for (const [dx, dy] of dedos) g.lineTo(dx, dy * (.8 + .2 * ab));
      g.quadraticCurveTo(-20, -16 * ab, -14, 0); g.closePath(); g.fill();
      g.strokeStyle = 'rgba(120,105,95,.35)'; g.lineWidth = .7; g.beginPath();   // plumas de cobertera
      for (let i = 0; i < 4; i++) { g.moveTo(-10 + i * 4, -3); g.lineTo(-12 + i * 3.5, -18 * ab); } g.stroke(); g.restore(); };
    g.save(); g.translate(x, y); g.scale(dir * s / 20, s / 20); g.rotate(.08 * Math.cos(fase));
    ala(true);
    g.fillStyle = '#0b0705'; g.beginPath();                                // cuerpo y pecho
    g.moveTo(-16, 1); g.quadraticCurveTo(-6, -8, 10, -6); g.quadraticCurveTo(16, -6, 18, -3); g.quadraticCurveTo(14, 6, 2, 6); g.quadraticCurveTo(-10, 6, -16, 1); g.fill();
    g.beginPath(); g.moveTo(-14, -1); g.lineTo(-31, -6); g.lineTo(-29, -3); g.lineTo(-33, -1); g.lineTo(-29, 1); g.lineTo(-32, 4); g.lineTo(-14, 3); g.fill();   // cola en abanico
    g.beginPath(); g.ellipse(18, -4, 6.5, 5.5, -.2, 0, TAU); g.fill();     // cabeza
    g.beginPath(); g.moveTo(22, -7); g.quadraticCurveTo(29, -7.5, 33, -3); g.quadraticCurveTo(29, -3, 23, -1); g.closePath(); g.fill();   // pico grueso y curvo
    g.strokeStyle = 'rgba(150,135,125,.45)'; g.lineWidth = .6; g.beginPath(); g.moveTo(23, -4); g.lineTo(30, -4.2); g.stroke();   // comisura
    g.fillStyle = '#7d726a'; g.beginPath(); g.arc(19.5, -5.5, 1.2, 0, TAU); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.arc(19.9, -5.9, .45, 0, TAU); g.fill();   // ojo
    ala(false); g.restore();
  }
  // valor de una curva [[segundo, valor], …] en t (lineal entre claves; antes de la primera y después de la última, se queda)
  const curva = (cl, t) => { if (t <= cl[0][0]) return cl[0][1]; for (let i = 1; i < cl.length; i++) if (t < cl[i][0]) return mezcla(cl[i - 1][1], cl[i][1], (t - cl[i - 1][0]) / (cl[i][0] - cl[i - 1][0])); return cl[cl.length - 1][1]; };
  function PARTICULAS(g, t, def) {
    const lista = [{ tipo: 'polvo', n: 45 }].concat(def.particulas || []);
    for (const q of lista) {
      const e = clamp((t - (q.en ?? -9)) / (q.sube || 1)) * clamp(((q.hasta ?? 1e9) - t) / .6) * (q.fuerza ? curva(q.fuerza, t) : 1); if (e <= 0) continue;
      const [x0, y0, x1, y1] = q.zona || [0, 0, 1280, 720], zw = x1 - x0, zh = y1 - y0, n = Math.round((q.n || 40) * e);
      for (let i = 0; i < n; i++) {
        const r1 = azar(i + 1), r2 = azar(i + 101), r3 = azar(i + 201);
        if (q.tipo === 'polvo') { const y = y0 + ((r2 * zh - 12 * t * (.5 + r3)) % zh + zh) % zh, x = x0 + r1 * zw + 18 * Math.sin(t * (.3 + r3) + i);
          g.fillStyle = `rgba(255,225,160,${.12 + .2 * r3})`; g.beginPath(); g.arc(x, y, 1 + 1.6 * r3, 0, TAU); g.fill(); }
        if (q.tipo === 'cuervos') { const vida = 9 + 5 * r3, u = ((t + r1 * vida) % vida) / vida, x = x0 - 80 + u * (zw + 160), y = y0 + r2 * zh + 18 * Math.sin(t * 1.5 + i);
          cuervo(g, x, y, 22 + 26 * r3, t * (9 + 3 * r3) + i * 2, 1); }
        if (q.tipo === 'pajaros') { const vida = 8 + 4 * r3, u = ((t + r1 * vida) % vida) / vida, x = x0 + u * zw, y = y0 + r2 * zh + 15 * Math.sin(t * 2 + i), al = 7 * Math.sin(t * 12 + i);
          g.strokeStyle = '#140c06'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(x - 12, y - al); g.quadraticCurveTo(x - 5, y - al * .3 - 2, x, y); g.quadraticCurveTo(x + 5, y - al * .3 - 2, x + 12, y - al); g.stroke(); }
        if (q.tipo === 'papeles' || q.tipo === 'confeti') { const vida = 3 + 2 * r3, u = ((t + r1 * vida) % vida) / vida, x = x0 + r2 * zw + 60 * Math.sin(u * 5 + i), y = y0 + u * zh;
          g.save(); g.translate(x, y); g.rotate(u * 9 + i); g.scale(1, Math.sin(t * 7 + i)); g.fillStyle = q.tipo === 'papeles' ? 'rgba(240,228,200,.9)' : NEGRO;
          const s = q.tipo === 'papeles' ? 12 : 5; g.fillRect(-s, -s * 1.3, 2 * s, 2.6 * s); g.restore(); }
        if (q.tipo === 'estrellas') { const b = .35 + .65 * Math.abs(Math.sin(t * (1 + r3) + i * 3)); g.fillStyle = r3 < .3 ? `rgba(140,240,240,${b})` : `rgba(255,240,210,${b})`;
          g.beginPath(); g.arc(x0 + r1 * zw, y0 + r2 * zh, .8 + 1.4 * r3, 0, TAU); g.fill(); }
        if (q.tipo === 'lluvia') { const vida = .55 + .35 * r3, u = ((t + r1 * vida) % vida) / vida, cerca = .5 + r3, x = x0 + r2 * zw + (q.viento ?? 140) * u, y = y0 - 40 + u * (zh + 40);
          g.strokeStyle = `rgba(${q.color || '210,225,240'},${(.18 + .3 * r3) * Math.min(1, e + .3)})`; g.lineWidth = .8 * cerca; g.beginPath(); g.moveTo(x, y); g.lineTo(x - .06 * (q.viento ?? 140) * cerca, y - 26 * cerca); g.stroke();
          if (u > .9 && r1 < .35) { const k = (u - .9) * 10; g.strokeStyle = `rgba(${q.color || '210,225,240'},${.4 * (1 - k)})`; g.beginPath(); g.ellipse(x, y1 - 4 * r2, 4 + 8 * k, 1.5 + 2 * k, 0, Math.PI, 0); g.stroke(); } }
        if (q.tipo === 'hojas') { const vida = 5 + 3 * r3, u = ((t + r1 * vida) % vida) / vida, bx = x0 + u * zw, by = y0 + r2 * zh + 40 * Math.sin(u * 7 + i), rr = fuerzaRacha(t), [cx, cy] = campo(bx, by, t * .8);
          const x = bx + 70 * cx * rr, y = by + 40 * cy * rr;                // las lleva la corriente y la ráfaga, y se dan la vuelta sobre sí mismas
          g.save(); g.translate(x, y); g.rotate(i * 2.3 + 1.4 * Math.sin(t * 2.5 * rr + i)); g.scale(1, .15 + .85 * Math.abs(Math.cos(t * (3 + 3 * r3) + i))); g.fillStyle = NEGRO;
          g.beginPath(); g.ellipse(0, 0, 7 + 3 * r3, 3 + r3, 0, 0, TAU); g.fill(); g.restore(); }
        // remolino: hojas que giran en espiral alrededor de q.x, q.y; se abre y se cierra cada q.ciclo segundos (radio q.r)
        if (q.tipo === 'remolino') { const ci = q.ciclo || 4, k = (((t - (q.en ?? 0)) % ci) + ci) % ci / ci, a = Math.sin(Math.PI * k) ** 2, R = (q.r || 160) * (.2 + .8 * r2) * (.35 + .65 * a);
          const th = r1 * TAU + t * (1.5 + 3 * (1 - r2)) * (.4 + .6 * a), x = (q.x ?? 640) + R * Math.cos(th), y = (q.y ?? 500) + .35 * R * Math.sin(th) - 110 * r3 * a;
          g.save(); g.globalAlpha = .25 + .75 * a; g.translate(x, y); g.rotate(th + 1.5); g.scale(1, .2 + .8 * Math.abs(Math.cos(t * 6 + i))); g.fillStyle = NEGRO;
          g.beginPath(); g.ellipse(0, 0, 6 + 3 * r3, 2.6 + r3, 0, 0, TAU); g.fill(); g.restore(); }
        // goteo: gotas de tinta que cuelgan del borde de arriba de la zona, se estiran, se sueltan y caen (el viento las tuerce)
        if (q.tipo === 'goteo') { const vida = 2.6 + 2.2 * r3, u = ((t + r1 * vida) % vida) / vida, x = x0 + r1 * zw, ya = y0 + 14 * r2, rad = 2.5 + 2.5 * r3; g.fillStyle = g.strokeStyle = NEGRO;
          if (u < .62) { const l = 4 + 34 * suave(u / .62) * (.6 + .4 * r2); g.lineCap = 'round'; g.lineWidth = rad * .9; g.beginPath(); g.moveTo(x, ya); g.lineTo(x, ya + l); g.stroke();
            g.beginPath(); g.arc(x, ya + l, rad * (.6 + .5 * u / .62), 0, TAU); g.fill(); }
          else { const v = (u - .62) / .38, y = ya + 38 + v * v * zh, [cx] = campo(x, y, t * .8), dx = 30 * cx * fuerzaRacha(t) * v;
            g.beginPath(); g.ellipse(x + dx, y, rad * .8, rad * (1.2 + 2.2 * v), Math.atan2(dx, 40) * -.5, 0, TAU); g.fill(); } }
      }
    }
  }
  const DECORADOS = {};
  // ángulo de una campana que se toca en d.toca = [segundos]: cada toque la lanza y se calma sola (lo usan la campana y quien cuelga de ella)
  const vaivenCampana = (t, d) => { let a = .015 * Math.sin(t * 1.3); for (const p of d.toca || []) { const v = t - p; if (v > 0) a += .32 * Math.exp(-v * 1.1) * Math.sin(v * 6.5); } return a; };
  // cuánto baja la cuerda (y quien cuelga de ella) con cada tirón de `tirones`: tira seco y rebota
  const tironCuerda = (t, tirones) => { let b = 0; for (const p of tirones || []) { const v = t - p; if (v > 0 && v < 1.6) b += v < .14 ? 30 * v / .14 : 30 * Math.exp(-(v - .14) * 5) * Math.cos((v - .14) * 13); } return b; };
  // el audio de una escena del capítulo, en orden (window.TIEMPOS, de tiempos.py): números = bloques del narrador, 'f1'… = frases de Acascar,
  // { espera: s } = silencio. Devuelve { voces, en: { b5, f1, … }, fin }. El narrador va sin subtítulo; los personajes, con el suyo.
  function guion(lista, { desde = .8, pausa = .45, pausaFrase = .7 } = {}) {
    const TI = window.TIEMPOS; if (!TI) throw new Error('falta escenas/tiempos.js: python3 fabrica/titeres/tiempos.py');
    let t = desde; const voces = [], en = {};
    for (const x of lista) {
      if (x && x.espera != null) { t += x.espera; continue; }
      if (typeof x === 'number') { const d = TI.b[x]; if (d == null) throw new Error('no hay audio del bloque ' + x);
        en['b' + x] = t; (TI.s[x] || []).forEach((o, j) => { en[`b${x}.${j + 1}`] = t + o; });
        voces.push({ en: t, dura: d, quien: 'narrador', texto: '', sinSub: true, archivo: `${TI.voz}b${String(x).padStart(2, '0')}.mp3` }); t += d + pausa; }
      else { const [archivo, d, texto, quien = 'Acascar'] = TI.f[x]; t += pausaFrase - pausa; en[x] = t; voces.push({ en: t, dura: d, quien, texto, archivo }); t += d + pausaFrase; }
    }
    // G.x('b28.3', 3): el segundo real de una palabra clave que se puso a ojo con la estimación (14 letras/s) a 3 s del inicio de esa frase;
    // se reparte en proporción dentro de su trozo de voz (y salta a los siguientes si cae más allá)
    const x = (clave, s) => { const m = clave.match(/^b(\d+)(?:\.(\d+))?$/), n = +m[1], j0 = m[2] ? +m[2] : 1, P = (TI.p || {})[n];
      if (!P) return en[clave] + s; let j = j0 - 1;
      while (j < P.length - 1 && s > P[j][0] + P[j][2]) { s -= P[j][0] + P[j][2]; j++; }
      const [est, real] = P[j], base = en[`b${n}.${j + 1}`]; return base + (s <= est ? s / est * real : real + (s - est)); };
    // G.k(13, 'seis'): el segundo real en que el narrador dice esa palabra del bloque 13 (busca el trozo y reparte en proporción a las letras);
    // n = qué aparición (1 = la primera); s = segundos de más
    const k = (bloque, palabra, n = 1, s = 0) => { const L = (TI.txt || {})[bloque], P = (TI.p || {})[bloque]; if (!L || !P) throw new Error('sin texto del bloque ' + bloque);
      for (let j = 0, vistas = 0; j < L.length; j++) { let i = -1; while ((i = L[j].toLowerCase().indexOf(palabra.toLowerCase(), i + 1)) >= 0) if (++vistas === n) return en[`b${bloque}.${j + 1}`] + i / L[j].length * P[j][1] + s; }
      throw new Error(`no está «${palabra}» en el bloque ${bloque}`); };
    return { voces, en, x, k, fin: t + .4 };
  }
  return { campo, racha: fuerzaRacha, curva, guion, tironCuerda, vaivenCampana, cuervo, escena, pose, pintaColores, enColor, mascara, DECORADOS, OBJETOS, PELO, SOMBREROS, tela: DECORADO_TELA, azar, ruido, suave, clamp, mezcla, rebote, peso, ik, miembro, hueco, circulo, dir, NEGRO, TAU };
})();
