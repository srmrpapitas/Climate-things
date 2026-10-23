// Calor: la temperatura del aire se duplica fase a fase hasta acercarse a la superficie del Sol.
// TNT: energía para calentar 1 km³ de aire desde 15 °C (1,2·10⁹ kg · 1.005 J/kg·K ≈ 0,29 kt por grado).
window.FENOMENOS.calor = (() => {
  const reloj = COMUN.reloj();
  let ctx, T = 15, t0 = 0, tiempo = 0, edif = [], arboles = [], coches = [], planeta = null;
  // estado visual que se interpola hacia el objetivo de cada fase
  const est = { tinte: 0, brillo: 0, mar: 0, derretir: 0 }, obj = { ...est };
  let cieloObj = 0x9fd3f0, colTinte = 0xff9a55, colBrillo = 0xff3a00;
  const temp = { naranja: null, amarillo: null, humo: null, vapor: null, ceniza: null };

  function crear(c) {
    ctx = c; const C = ctx.THREE.Color;
    COMUN.materiales(ctx);
    edif = COMUN.edificios(ctx);
    arboles = ctx.objects.filter(o => o.kind === 'tree' || o.kind === 'palm');
    coches = ctx.objects.filter(o => o.kind === 'car');
    temp.naranja = new C(0xff7a1a); temp.amarillo = new C(0xffd04a); temp.humo = new C(0x4a4440); temp.vapor = new C(0xe8f2f6); temp.ceniza = new C(0x2a2522);
  }

  function fuego(x, y, z, s = 1) {
    ctx.emit(x + ctx.rr(-1, 1) * s, y, z + ctx.rr(-1, 1) * s, ctx.rr(-1, 1) * s, ctx.rr(4, 10) * s, ctx.rr(-1, 1) * s, ctx.R() < .6 ? temp.naranja : temp.amarillo, ctx.rr(.6, 1.4), -2 * s);
    if (ctx.R() < .3) ctx.emit(x, y + 3 * s, z, ctx.rr(-1, 1) * s, ctx.rr(6, 12) * s, ctx.rr(-1, 1) * s, temp.humo, ctx.rr(2, 4), -1.5 * s);
  }

  function fase(c, n, valor, f) {
    T = valor; t0 = tiempo;
    obj.tinte = Math.min(.85, Math.max(0, (T - 40) / 900));
    obj.brillo = T >= 5000 ? 1 : Math.max(0, Math.min(.75, (T - 500) / 2600));
    obj.mar = T >= 2500 ? 1 : T >= 600 ? .5 : T >= 150 ? .12 : 0;
    obj.derretir = T >= 2500 ? 1 : 0;
    colBrillo = T >= 5000 ? 0xfff0c8 : 0xff3a00;
    cieloObj = T >= 5000 ? 0xfff2cf : T >= 1200 ? 0xff7a2a : T >= 600 ? 0x8a3a22 : T >= 300 ? 0xa86a45 : T >= 150 ? 0xe8a868 : T >= 70 ? 0xf0c890 : 0xf2e3b8;
    // la gente se desmaya con el calor
    if (T >= 150) for (const p of ctx.people) if (p.state === 0) { p.state = 1; p.cae = 0; p.caer = ctx.rr(.3, 1.5); }
    // los árboles arden
    if (T >= 300) arboles.forEach(o => { if (o.state === 0) { o.state = 1; o.arde = tiempo + ctx.rr(0, 3); } });
    // los coches se deforman
    if (T >= 600) coches.forEach(o => o.funde = 1);
    // los edificios se desploman
    if (T >= 1200) for (const o of edif) if (o.state !== 2) reloj.luego(ctx.rr(.3, 3.5), () => {
      COMUN.derribar(ctx, o, new ctx.THREE.Vector3(ctx.rr(-2, 2), -Math.min(o.h, 300) * .1, ctx.rr(-2, 2)), { colorEscombros: 0x6a4030, polvo: 10, colorPolvo: temp.naranja });
    });
    if (f.planeta) planeta = COMUN.planeta(ctx);
    COMUN.ruido(ctx, 4, 300 + Math.min(T, 3000) * .3, Math.min(.6, .1 + n * .06));
  }

  function actualizar(c, dt, t) {
    tiempo = t; reloj.tick(t); const e = t - t0, k = 1 - Math.exp(-dt * 1.2);
    for (const key in est) est[key] += (obj[key] - est[key]) * k;
    COMUN.tintar(ctx, colTinte, est.tinte, colBrillo, est.brillo);
    ctx.skyT.set(cieloObj);
    // el mar se evapora
    ctx.seaNear.position.y = -est.mar * 40; ctx.seaNear.visible = est.mar < .98;
    if (T >= 150 && T < 2500 && ctx.R() < .8) for (let q = 0; q < 6; q++) ctx.emit(ctx.rr(-900, 900), 0, ctx.rr(-200, 20), 0, ctx.rr(4, 12), 0, temp.vapor, ctx.rr(2, 4), -1);
    // árboles en llamas que acaban en ceniza
    for (const o of arboles) if (o.state === 1 && tiempo > o.arde) {
      if (tiempo < o.arde + 2.5) { if (ctx.R() < .5) fuego(o.x, o.y0 + o.h * .6, o.z, o.h / 6); }
      else { o.state = 2; if (o.g.parent) o.g.parent.remove(o.g); for (let q = 0; q < 6; q++) ctx.emit(o.x, o.y0 + 2, o.z, ctx.rr(-2, 2), ctx.rr(1, 4), ctx.rr(-2, 2), temp.ceniza, 2, 3); }
    }
    if (T >= 300 && T < 2500) { // tejados y fachadas en llamas
      for (let q = 0; q < 10; q++) { const o = edif[Math.floor(ctx.R() * edif.length)]; if (o && o.state !== 2) fuego(o.x + ctx.rr(-.4, .4) * o.w, o.y0 + o.h, o.z + ctx.rr(-.4, .4) * o.d, Math.min(4, 1 + o.h / 40)); }
    }
    for (const o of coches) if (o.funde && o.state !== 2) o.g.scale.y = Math.max(.35, o.g.scale.y - dt * .2);
    for (const p of ctx.people) if (p.state === 1 && p.caer) { p.cae = Math.min(1, p.cae + dt * 1.5 / p.caer); p.g.rotation.x = -Math.PI / 2 * p.cae; }
    // todo se funde en un charco
    if (est.derretir > .01) for (const o of edif) if (o.escombros) o.escombros.scale.y = Math.max(.2, o.escombros.scale.y - dt * .4 * est.derretir);
    ctx.setShake(0);
    if (planeta) { planeta.update(dt); planeta.teñir(0xff8a40, .9, 0xff5a10, .7); }
  }

  return {
    crear, fase, actualizar,
    activo: () => tiempo - t0 < 4 || reloj.pendientes > 0,
    tnt: v => Math.max(0, v - 15) * 1.2e12 / COMUN.TNT_J,
    mag: v => `${COMUN.num(v, 0)} °C`,
  };
})();
