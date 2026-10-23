// Terremoto: la ciudad tiembla y cae según la magnitud. Al final se abre una grieta y la Tierra se parte.
// Datos del escenario: escenarios/terremoto.js. Energía: E = 10^(1,5·M + 4,8) julios.
window.FENOMENOS.terremoto = (() => {
  const reloj = COMUN.reloj();
  let edif = [], cola = [], t0 = 0, dur = 0, M = 0, tiempo = 0, grietas = [], sima = null, planeta = null, fin = false, fase = 0;
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
    for (const o of edif) o.mth = umbral(ctx, o);
    for (const o of ctx.objects) base.set(o, { x: o.g.position.x, y: o.g.position.y, z: o.g.position.z, ry: o.g.rotation.y });
  }

  // grieta en zigzag sobre el suelo
  function grieta(ctx, x, z, largo, ancho) {
    const T = ctx.THREE, g = new T.Group(); let a = ctx.rr(0, Math.PI * 2), px = x, pz = z;
    const segs = Math.ceil(largo / 25);
    for (let i = 0; i < segs; i++) {
      a += ctx.rr(-.6, .6); const l = ctx.rr(15, 35), nx = px + Math.sin(a) * l, nz = pz + Math.cos(a) * l;
      const m = new T.Mesh(ctx.BOX, ctx.mat(0x1b1612)); m.scale.set(ancho * ctx.rr(.5, 1.2), .3, l + 2);
      m.position.set((px + nx) / 2, ctx.GROUND + .12, (pz + nz) / 2); m.rotation.y = a; g.add(m); px = nx; pz = nz;
    }
    g.scale.set(.01, 1, .01); ctx.cityGroup.add(g); grietas.push({ g, t: 0 });
  }

  function fase_(ctx, n, valor, f) {
    fase = n; M = valor; t0 = tiempo; dur = f.duracion ?? clampD(2.5 + (M - 2) * .55); cola = [];
    // qué cae en esta fase
    for (const o of edif) {
      if (o.state === 2) continue;
      if (o.mth <= M) cola.push({ o, t: tiempo + ctx.rr(.4, Math.min(dur * .8, 4.5)) });
      else if (o.mth <= M + .6 && o.state === 0 && M >= 5) { o.state = 1; o.tilt = ctx.rr(.03, .09); }
    }
    if (M >= 5) ctx.people.forEach(p => { if (p.state === 0) p.run = 1; });
    if (M >= 7.5) for (let k = 0; k < (M >= 9 ? 14 : 6); k++) grieta(ctx, ctx.rr(-650, 650), ctx.rr(150, 1550), ctx.rr(120, 380), M >= 9 ? 9 : 4);
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
    tiempo = t; reloj.tick(t);
    ctx.skyT.set(0x9fd3f0).lerp(POLVO(ctx), Math.max(0, Math.min(.8, (M - 5.5) / 5)));
    const e = tiempo - t0, k = e < dur ? Math.sin(Math.PI * Math.min(1, e / dur)) ** .6 : 0; // envolvente del temblor
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

  return {
    crear, fase: fase_, actualizar,
    activo: () => tiempo - t0 < dur + 1.2 || cola.length > 0 || (planeta && planeta.split < .9),
    tnt: m => energiaJ(m) / COMUN.TNT_J,
    mag: m => `${COMUN.EN ? 'Magnitude' : 'Magnitud'} ${COMUN.num(m, m % 1 ? 1 : 0)}`,
  };
})();
