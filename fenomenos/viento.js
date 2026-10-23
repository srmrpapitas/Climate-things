// Viento: la velocidad del viento se duplica fase a fase (sopla de oeste a este, hacia x positivo).
// TNT: energía cinética del aire de 1 km³ moviéndose a esa velocidad (½ · 1,2·10⁹ kg · v²).
window.FENOMENOS.viento = (() => {
  const reloj = COMUN.reloj();
  let ctx, V = 0, t0 = 0, tiempo = 0, todo = [], edif = [], col = {};
  const ms = kmh => kmh / 3.6;

  // velocidad (km/h) a la que cae o sale volando cada cosa
  function aguante(o) {
    if (o.kind === 'person') return ctx.rr(110, 160);
    if (o.kind === 'tree' || o.kind === 'palm') return ctx.rr(140, 230);
    if (o.kind === 'car') return ctx.rr(230, 330);
    if (o.kind === 'boat') return ctx.rr(150, 250);
    if (o.kind !== 'building') return 200;
    if (o.landmark) return o.h > 300 ? ctx.rr(1500, 2400) : ctx.rr(900, 1600);
    if (o.h > 60) return ctx.rr(900, 1500);
    if (o.h > 13) return ctx.rr(450, 900);
    return ctx.rr(260, 420);
  }

  function crear(c) {
    ctx = c; const C = ctx.THREE.Color;
    todo = ctx.objects.filter(o => o.g); edif = COMUN.edificios(ctx);
    for (const o of todo) { o.aguante = aguante(o); o.rz0 = o.g.rotation.z; }
    col = { raya: new C(0xffffff), arena: new C(0xe6d49c), tierra: new C(0x6e5a44), hoja: new C(0x5aa84f) };
  }

  function fase(c, n, valor, f) {
    V = valor; t0 = tiempo;
    // lo que no aguanta sale volando en el sentido del viento, en los primeros segundos de la fase
    for (const o of todo) {
      if (o.state === 2 || o.aguante > V) continue;
      reloj.luego(ctx.rr(.3, 3.5), () => {
        if (o.state === 2) return;
        const v = ms(V), lift = o.kind === 'building' ? ctx.rr(0, .05) : ctx.rr(.1, .35);
        const vel = new ctx.THREE.Vector3(v * ctx.rr(.25, .6), v * lift, ctx.rr(-.08, .08) * v);
        if (o.kind === 'building') COMUN.derribar(ctx, o, vel, { polvo: 14 }); else ctx.derribar(o, vel, { float: false });
      });
    }
    // sombrillas, farolas y árboles de la calle (instanciados) desaparecen arrancados
    if (V >= 160) { const m0 = new ctx.THREE.Matrix4().makeScale(0, 0, 0), lim = V >= 600 ? 20 : V >= 300 ? 8 : 3;
      for (const { im, list } of ctx.inst) { let ch = false;
        list.forEach((p, i) => { if (p && !p.dead && p.h <= lim && p.h > .5) { p.dead = true; im.setMatrixAt(i, m0); ch = true; } });
        if (ch) im.instanceMatrix.needsUpdate = true; } }
    // a partir de la velocidad del sonido (1.235 km/h), una onda de choque
    if (V > 1235) ctx.boom(12);
    COMUN.ruido(ctx, 5, 250 + Math.min(V, 2000) * 1.5, Math.min(.8, .12 + n * .09), 0, 'bandpass');
  }

  function actualizar(c, dt, t) {
    tiempo = t; reloj.tick(t); const e = t - t0, v = ms(V);
    // los que aún aguantan se inclinan y tiemblan con las ráfagas
    const racha = .5 + .5 * Math.sin(t * 2.3) * Math.sin(t * .9 + 1);
    for (const o of todo) {
      if (o.state === 2 || o.kind === 'building' || o.kind === 'boat') continue;
      const k = Math.min(1, V / o.aguante);
      o.g.rotation.z = (o.rz0 || 0) - k * k * (o.kind === 'person' ? .5 : .35) * (.7 + .3 * racha) - Math.sin(t * 9 + o.x) * .02 * k;
    }
    for (const o of edif) if (o.state === 0 && V > o.aguante * .7) { o.state = 1; o.tilt = ctx.rr(.02, .08); }
    // rayas de viento, arena y hojas cerca de lo que ve la cámara
    const r = Math.max(40, Math.min(3000, ctx.camDist * .9)), cx = ctx.camTgt.x, cz = ctx.camTgt.z;
    const n = Math.round(Math.min(40, 6 + V / 40));
    for (let q = 0; q < n; q++) {
      const y = ctx.GROUND + ctx.rr(.5, r * .4);
      ctx.emit(cx - r + ctx.rr(-r * .3, r * .5), y, cz + ctx.rr(-r, r), v * ctx.rr(.8, 1.2) + r * .3, ctx.rr(-1, 1), ctx.rr(-1, 1), col.raya, ctx.rr(.6, 1.4), 0);
    }
    if (V >= 40) for (let q = 0; q < Math.min(30, V / 20); q++)
      ctx.emit(cx + ctx.rr(-r, r), ctx.GROUND + ctx.rr(0, 3 + V / 50), ctx.rr(-20, 60), v * ctx.rr(.5, 1), ctx.rr(0, 3), ctx.rr(-1, 1), col.arena, ctx.rr(1, 2), 2);
    if (V >= 80 && V < 600) for (let q = 0; q < 6; q++) ctx.emit(cx + ctx.rr(-r, r), ctx.GROUND + ctx.rr(2, 20), cz + ctx.rr(-r, r), v * ctx.rr(.4, .9), ctx.rr(-2, 4), ctx.rr(-3, 3), col.hoja, ctx.rr(1.5, 3), 1);
    if (V >= 2000) for (let q = 0; q < 50; q++) ctx.emit(cx + ctx.rr(-r, r), ctx.GROUND + ctx.rr(0, 40), cz + ctx.rr(-r, r), v * ctx.rr(.4, .8), ctx.rr(2, 20), ctx.rr(-5, 5), col.tierra, ctx.rr(1.5, 3), 3);
    ctx.skyT.set(V >= 1200 ? 0x8a7d6a : V >= 300 ? 0x7b8794 : V >= 150 ? 0x8a99a8 : V >= 80 ? 0xa3b6c6 : 0x9fd3f0);
    ctx.setShake(V >= 300 ? Math.min(ctx.camDist * .004, V / 800) * (.6 + .4 * racha) : 0);
  }

  return {
    crear, fase, actualizar,
    activo: () => tiempo - t0 < 4 || reloj.pendientes > 0,
    tnt: v => .5 * 1.2e9 * ms(v) ** 2 / COMUN.TNT_J,
    mag: v => `${COMUN.num(v, 0)} km/h`,
  };
})();
