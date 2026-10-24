// Terremoto: la ciudad tiembla y cae según la magnitud. Al final se abre una grieta y la Tierra se parte.
// Datos del escenario: escenarios/terremoto.js. Energía: E = 10^(1,5·M + 4,8) julios.
window.FENOMENOS.terremoto = (() => {
  const reloj = COMUN.reloj();
  let yo = null, edif = [], cola = [], t0 = 0, dur = 0, M = 0, tiempo = 0, grietas = [], sima = null, planeta = null, fin = false, fase = 0;
  const base = new Map();

  function energiaJ(m) { return Math.pow(10, 1.5 * m + 4.8); }
  // magnitud a partir de la que cae cada edificio, según su altura y una resistencia al azar
  function umbral(ctx, o) {
    if (o.h > 300) return ctx.rr(8.6, 9.4);
    if (o.h > 60) return ctx.rr(7.7, 9.35);
    if (o.h > 13) return ctx.rr(6.3, 8.8);
    return ctx.rr(5.2, 7.6);
  }

  function crear(ctx) {
    edif = COMUN.edificios(ctx);
    yo = COMUN.protagonista(ctx, { z: 560, ry: Math.PI, vel: .8 }); // el chico de la sudadera, por la acera hacia el centro
    for (const o of edif) o.mth = umbral(ctx, o);
    for (const o of ctx.objects) base.set(o, { x: o.g.position.x, y: o.g.position.y, z: o.g.position.z, ry: o.g.rotation.y });
  }

  // grieta en zigzag sobre el suelo
  function grieta(ctx, x, z, largo, ancho) {
    const T = ctx.THREE, g = new T.Group(); let a = ctx.rr(0, Math.PI * 2), px = 0, pz = 0; // crece desde su punto de partida
    const segs = Math.ceil(largo / 25);
    for (let i = 0; i < segs; i++) {
      a += ctx.rr(-.6, .6); const l = ctx.rr(15, 35), nx = px + Math.sin(a) * l, nz = pz + Math.cos(a) * l;
      const m = new T.Mesh(ctx.BOX, ctx.mat(0x1b1612)); m.scale.set(ancho * ctx.rr(.5, 1.2), .3, l + 2);
      m.position.set((px + nx) / 2, ctx.GROUND + .12, (pz + nz) / 2); m.rotation.y = a; g.add(m); px = nx; pz = nz;
    }
    g.position.set(x, 0, z); g.scale.set(.01, 1, .01); ctx.cityGroup.add(g); grietas.push({ g, t: 0 });
  }

  function fase_(ctx, n, valor, f) {
    fase = n; M = valor; t0 = tiempo; dur = f.duracion ?? clampD(2.5 + (M - 2) * .55); cola = [];
    Object.assign(yo.est, { lento: M >= 5 ? .3 : 1, cabeza: M >= 4 ? -.2 : 0, hablar: M >= 5 && M < 6 ? .6 : 0 });
    if (M >= 6 && !yo.est.caer) reloj.luego(.6, () => { yo.est.caer = true; });
    // qué cae en esta fase
    for (const o of edif) {
      if (o.state === 2) continue;
      if (o.mth <= M) cola.push({ o, t: tiempo + ctx.rr(.4, Math.min(dur * .8, 4.5)) });
      else if (o.mth <= M + .6 && o.state === 0 && M >= 5) { o.state = 1; o.tilt = ctx.rr(.03, .09); }
    }
    if (M >= 5) ctx.people.forEach(p => { if (p.state === 0) p.run = 1; });
    if (M >= 7.5) for (let k = 0; k < (M >= 9 ? 14 : 6); k++) grieta(ctx, k ? ctx.rr(-650, 650) : ctx.rr(-40, 40), k ? ctx.rr(150, 1550) : ctx.rr(620, 780), ctx.rr(120, 380), M >= 9 ? 9 : 4);
    if (f.sima && !sima) crearSima(ctx);
    if (f.planeta) { planeta = COMUN.planeta(ctx); reloj.luego(3.2, () => { planeta.partir(.14); COMUN.estallarPlaneta(ctx, 1600); COMUN.ruido(ctx, 6, 120, .9); COMUN.tono(ctx, 70, 20, 5, 'sawtooth', .35); }); fin = true; }
    // sonido: retumbar grave proporcional a la energía
    ctx.rumble(Math.min(.55, .08 + (M - 2) * .05));
    COMUN.ruido(ctx, dur, 90 + M * 6, Math.min(.8, .15 + M * .05));
  }
  const clampD = d => Math.max(3, Math.min(7.5, d));

  function crearSima(ctx) {
    const T = ctx.THREE, g = new T.Group();
    const negro = new T.Mesh(ctx.BOX, new T.MeshBasicMaterial({ color: 0x0a0605 })); negro.scale.set(1, 1, 3600); negro.position.set(0, ctx.GROUND + .3, 1000);
    const lava = new T.Mesh(ctx.BOX, new T.MeshBasicMaterial({ color: 0xff5a14 })); lava.scale.set(.35, 1, 3600); lava.position.set(0, ctx.GROUND + .45, 1000);
    g.add(negro, lava); ctx.cityGroup.add(g); sima = { g, negro, lava, w: 0 };
  }

  function actualizar(ctx, dt, t) {
    tiempo = t; reloj.tick(t); yo.actualizar(dt, t); COMUN.corte.tick(ctx, dt);
    if (!ctx.corte) ctx.skyT.set(0x9fd3f0).lerp(POLVO(ctx), Math.max(0, Math.min(.8, (M - 5.5) / 5)));
    const e = tiempo - t0, k = e < dur ? Math.sin(Math.PI * Math.min(1, e / dur)) ** .6 : 0; // envolvente del temblor
    yo.est.tiembla = k * Math.min(4, M / 1.5);
    const I = Math.max(0, Math.min(1, (M - 2.4) / 6.6)) ** 1.4 * k;
    ctx.setShake(fin ? 0 : ctx.camDist * .006 * I + .02 * k);
    // vaivén de todo lo que está en pie
    const amp = Math.min(3.5, .04 * Math.pow(10, .45 * (M - 3))) * k, onda = M >= 8.8 ? Math.min(30, (M - 8.6) * 18) * k : 0;
    for (const [o, b] of base) {
      if (o.state === 2 || !o.g.parent || o.kind === 'person' || o.kind === 'boat') continue;
      const ph = o.x * .013 + o.z * .007;
      o.g.position.x = b.x + Math.sin(t * 9 + ph) * amp + Math.sin(t * 3.1 + ph * 2) * amp * .6;
      o.g.position.z = b.z + Math.cos(t * 7.3 + ph) * amp * .5;
      if (onda && o.state !== 1) o.g.position.y = b.y + Math.max(-onda * .3, Math.sin(o.z * .006 - t * 2.6) * onda);
      if (o.kind === 'car' && M >= 6 && k > .3 && ctx.R() < dt * .5) o.g.rotation.y += ctx.rr(-.4, .4);
    }
    // derrumbes programados
    for (let i = cola.length - 1; i >= 0; i--) {
      const c = cola[i]; if (tiempo < c.t) continue; cola.splice(i, 1);
      const o = c.o, lado = ctx.rr(-1, 1);
      COMUN.derribar(ctx, o, new ctx.THREE.Vector3(lado * ctx.rr(1, 5), -Math.min(o.h, 400) * .15, ctx.rr(-3, 3)), { polvo: o.h > 60 ? 30 : 14 });
      // cristales
      if (o.glass) for (let q = 0; q < 30; q++) ctx.emit(o.x + ctx.rr(-.5, .5) * o.w, o.y0 + ctx.rr(0, o.h), o.z + ctx.rr(-.5, .5) * o.d, ctx.rr(-5, 5), ctx.rr(0, 6), ctx.rr(-5, 5), CRISTAL(ctx), ctx.rr(1, 2), 9.8);
      if (ctx.R() < .25) COMUN.ruido(ctx, 1.4, 260, .25);
    }
    // cristales que caen de los edificios que aguantan
    if (k > .2 && M >= 4) {
      const n = Math.min(40, Math.round((M - 3.5) * 8 * dt * 60 * .2));
      for (let q = 0; q < n; q++) { const o = edif[Math.floor(ctx.R() * edif.length)]; if (!o || o.state === 2 || o.mth > M + 1.6) continue;
        ctx.emit(o.x + ctx.rr(-.5, .5) * o.w, o.y0 + ctx.rr(o.h * .3, o.h), o.z + ctx.rr(-.5, .5) * o.d, ctx.rr(-2, 2), ctx.rr(0, 2), ctx.rr(-2, 2), CRISTAL(ctx), ctx.rr(1, 2), 9.8); }
    }
    for (const g of grietas) if (g.t < 1) { g.t = Math.min(1, g.t + dt / 1.8); const s = .01 + g.t; g.g.scale.set(s, 1, s); }
    // la sima: se abre por el centro y se traga lo que hay encima
    if (sima && e > .5) {
      sima.w = Math.min(320, sima.w + dt * 70); sima.negro.scale.x = sima.w; sima.lava.scale.x = sima.w * .35;
      for (const o of ctx.objects) if (o.g.parent && Math.abs(o.x) < sima.w / 2 + (o.w || 2) / 2 && o.z > -800 && o.z < 2800) {
        o.state = 2; o.hund = (o.hund || 0) + dt; o.g.position.y -= o.hund * 40 * dt; if (o.g.position.y < -400) o.g.parent.remove(o.g);
      }
      for (const o of edif) if (o.escombros && o.escombros.parent && Math.abs(o.x) < sima.w / 2 + o.w / 2) { o.escombros.position.y -= dt * 60; if (o.escombros.position.y < -300) o.escombros.parent.remove(o.escombros); }
      if (ctx.R() < .9) for (let q = 0; q < 6; q++) ctx.emit(ctx.rr(-.3, .3) * sima.w, ctx.GROUND, ctx.rr(0, 3000), ctx.rr(-8, 8), ctx.rr(30, 90), ctx.rr(-8, 8), LAVA(ctx), ctx.rr(1.5, 3), 30);
    }
    if (planeta) planeta.update(dt);
  }
  let _cr, _lv, _po;
  const POLVO = ctx => _po ||= new ctx.THREE.Color(0xb3a48c);
  const CRISTAL = ctx => _cr ||= new ctx.THREE.Color(0xd8f4ff), LAVA = ctx => _lv ||= new ctx.THREE.Color(0xff7a22);

  // planos de corte que eligen a qué mirar (f.inserto.plano):
  //  'cae': un edificio de la altura pedida (alto: [min, max]) que se derrumba en esta fase; se adelanta su caída para que se vea
  //  'grieta': la primera grieta que se abre en esta fase
  // ¿se ve el punto t desde p sin atravesar ningún edificio en pie (salvo el que se mira)?
  function libre(ctx, p, t, menos) {
    for (let i = 0; i <= 16; i++) { const k = i / 16, x = p[0] + (t[0] - p[0]) * k, y = p[1] + (t[1] - p[1]) * k, z = p[2] + (t[2] - p[2]) * k, m = i ? 2 : 12; // la cámara, con más holgura
      for (const o of edif) if (o !== menos && o.state !== 2 && o.g.parent && Math.abs(x - o.x) < o.w / 2 + m && Math.abs(z - o.z) < o.d / 2 + m && y < o.y0 + o.h + m) return false; }
    return true;
  }
  // prueba varias direcciones y alturas alrededor del punto t y se queda con la primera que lo ve limpio
  function mirador(ctx, t, d, alto, menos) {
    for (const h of [alto, alto * 1.6, alto * 2.4]) for (let i = 0; i < 12; i++) {
      const a = Math.PI * 1.25 + Math.ceil(i / 2) * (i % 2 ? 1 : -1) * Math.PI / 6, p = [t[0] + Math.cos(a) * d, ctx.GROUND + h, t[2] + Math.sin(a) * d];
      if (libre(ctx, p, t, menos)) return p;
    }
    return [t[0] - d * .55, ctx.GROUND + alto * 3, t[2] - d * .85];
  }
  function plano(ctx, fi) {
    if (fi.plano === 'cae') {
      const [a, b] = fi.alto || [0, 1e9], c = cola.filter(c => c.o.h >= a && c.o.h <= b && !c.o.landmark).sort((p, q) => Math.abs(p.o.z - 600) + p.o.w * p.o.d / 10 - Math.abs(q.o.z - 600) - q.o.w * q.o.d / 10)[0]; // cerca del centro y no muy ancho
      if (!c) return null; const o = c.o, d = Math.max(40, o.h * 2.2, Math.max(o.w, o.d) * 2);
      c.t = tiempo + (fi.cae ?? .5);
      const mira = [o.x, ctx.GROUND + o.h * .4, o.z];
      return { pos: mirador(ctx, mira, d, o.h * .6 + 10, o), mira };
    }
    if (fi.plano === 'grieta') {
      const g = grietas.filter(g => g.t < .5).sort((a, b) => Math.hypot(a.g.position.x, a.g.position.z - 700) - Math.hypot(b.g.position.x, b.g.position.z - 700))[0]; if (!g) return null; const m = g.g.position;
      const mira = [m.x, ctx.GROUND, m.z];
      return { pos: mirador(ctx, mira, 60, 35), mira };
    }
    return null;
  }
  // escala de Mercalli (lo que se siente y se rompe cerca del epicentro, en un terremoto poco profundo) y longitud de la falla
  // (Wells y Coppersmith: log10 L = 0,59·M − 2,44 km)
  const MERCALLI = [[3.5, 'III', 'se nota dentro de casa', 'felt indoors'], [4.5, 'IV', 'vibran ventanas y vasos', 'windows and dishes rattle'],
    [5.2, 'VI', 'se agrietan paredes y cae el yeso', 'walls crack, plaster falls'], [5.7, 'VII', 'daños en edificios mal construidos', 'poorly built buildings damaged'],
    [6.3, 'VIII', 'daños graves en edificios corrientes', 'heavy damage to ordinary buildings'], [6.8, 'IX', 'edificios movidos de sus cimientos', 'buildings shifted off foundations'],
    [7.2, 'X', 'caen la mayoría de edificios de obra', 'most masonry buildings destroyed'], [7.8, 'XI', 'quedan pocos edificios en pie', 'few buildings left standing'],
    [9.9, 'XII', 'destrucción total, el suelo hace olas', 'total destruction, the ground ripples']];
  function danos(caidos = 0) {
    const EN = COMUN.EN, n = COMUN.num, L = Math.pow(10, .59 * M - 2.44);
    if (M >= 18) return EN ? 'Planet Earth: broken apart' : 'Planeta Tierra: partido';
    const mm = MERCALLI.find(([m]) => M <= m), esc = mm ? (EN ? `Mercalli ${mm[1]}: ${mm[3]}` : `Mercalli ${mm[1]}: ${mm[2]}`) : (EN ? 'Off every scale' : 'Fuera de toda escala');
    const falla = L >= 40000 ? (EN ? 'the fault circles the planet' : 'la falla da la vuelta al planeta') : M >= 5 ? (EN ? `${n(L < 10 ? L : Math.round(L), L < 10 ? 1 : 0)} km fault` : `falla de ${n(L < 10 ? L : Math.round(L), L < 10 ? 1 : 0)} km`) : '';
    const ed = caidos > 0 ? (EN ? `${n(caidos, 0)} buildings down` : `${n(caidos, 0)} edificios caídos`) : '';
    return [esc, M >= 9.5 ? falla : ed].filter(Boolean).join(' · ');
  }

  return {
    crear, fase: fase_, actualizar, camara: c => yo.camara(c), plano, danos,
    inserto: (ctx, ef, on) => COMUN.corte.on(ctx, ef, on),
    activo: () => tiempo - t0 < dur + 1.2 || cola.length > 0 || (planeta && planeta.split < .9),
    tnt: m => energiaJ(m) / COMUN.TNT_J,
    mag: m => `${COMUN.EN ? 'Magnitude' : 'Magnitud'} ${COMUN.num(m, m % 1 ? 1 : 0)}`,
  };
})();
