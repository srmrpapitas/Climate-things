// Frío: en cada fase la temperatura absoluta (en kelvin) se reduce a la mitad. Nunca se llega al cero absoluto.
// TNT: energía que hay que quitarle a 1 km³ de aire desde 15 °C (≈ 0,29 kt por grado, sin contar los cambios de estado).
window.FENOMENOS.frio = (() => {
  const reloj = COMUN.reloj();
  let ctx, T = 15, t0 = 0, tiempo = 0, edif = [], capa = null, planeta = null;
  const est = { tinte: 0, escarcha: 0, mar: 0, capa: 0, solido: 0 }, obj = { ...est };
  let cieloObj = 0xc9dbe8;
  const col = {};

  function crear(c) {
    ctx = c; const THREE = ctx.THREE;
    COMUN.materiales(ctx);
    edif = COMUN.edificios(ctx);
    for (const [k, v] of Object.entries({ nieve: 0xffffff, gota: 0x7fb8ff, hielo: 0xdff0ff })) col[k] = new THREE.Color(v);
    // capa de aire licuado / congelado que cubre el suelo (toda la atmósfera cabe en unos 10 m de líquido)
    const g = new THREE.PlaneGeometry(1.6e5, 1.6e5, 64, 64).rotateX(-Math.PI / 2);
    capa = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: 0x8fc4ff, transparent: true, opacity: .55, roughness: .15, flatShading: true }));
    capa.userData.fenPropio = true; capa.visible = false; capa.position.set(0, ctx.GROUND - 2, 1000); ctx.scene.add(capa);
  }

  const rad = () => Math.max(60, Math.min(1500, ctx.camDist * .8));
  function fase(c, n, valor, f) {
    T = valor; t0 = tiempo;
    obj.tinte = Math.min(.55, Math.max(0, -T / 380));
    obj.escarcha = T <= -100 ? Math.min(.5, .2 - T / 900) : T <= 0 ? .1 : 0;
    obj.mar = T <= -100 ? 1 : 0;
    obj.capa = T <= -190 ? 1 : 0;
    obj.solido = T <= -210 ? 1 : 0;
    cieloObj = T <= -250 ? 0x04060b : T <= -230 ? 0x1c2333 : T <= -190 ? 0x5d6f8a : T <= -100 ? 0xdfe9f2 : 0xc9d6e0;
    if (T <= -100) for (const p of ctx.people) if (p.state === 0) { p.state = 1; p.helado = true; }
    if (T <= -190) for (const p of ctx.people) if (p.state === 1 && !p.caer) { p.caer = ctx.rr(.5, 2); p.cae = 0; }
    // el acero se vuelve frágil como el cristal y los edificios se hacen añicos
    if (f.romper) for (const o of edif) if (o.state !== 2) reloj.luego(ctx.rr(.3, 4), () => {
      COMUN.derribar(ctx, o, new ctx.THREE.Vector3(ctx.rr(-4, 4), -Math.min(o.h, 300) * .12, ctx.rr(-4, 4)), { colorEscombros: 0xdcebf7, polvo: 16, colorPolvo: col.hielo });
      for (let q = 0; q < 20; q++) ctx.emit(o.x + ctx.rr(-.5, .5) * o.w, o.y0 + ctx.rr(0, o.h), o.z + ctx.rr(-.5, .5) * o.d, ctx.rr(-6, 6), ctx.rr(0, 6), ctx.rr(-6, 6), col.hielo, ctx.rr(1, 2.5), 9.8);
      if (ctx.R() < .2) COMUN.tono(ctx, ctx.rr(1800, 3200), 900, .25, 'triangle', .08);
    });
    if (f.planeta) planeta = COMUN.planeta(ctx);
    COMUN.tono(ctx, 900, 300, 2.5, 'sine', .08); COMUN.ruido(ctx, 3, 3000, .12, 0, 'highpass');
  }

  function actualizar(c, dt, t) {
    tiempo = t; reloj.tick(t); const e = t - t0, k = 1 - Math.exp(-dt * 1.1);
    for (const key in est) est[key] += (obj[key] - est[key]) * k;
    COMUN.tintar(ctx, 0xe4f0ff, est.tinte, 0xcfe4ff, est.escarcha);
    ctx.skyT.set(cieloObj);
    // el mar se congela: deja de moverse y se vuelve blanco
    ctx.seaNear.scale.y = 1 - est.mar;
    // nieve y, por debajo de −190 °C, lluvia de aire líquido
    const r = rad(), cx = ctx.camTgt.x, cz = ctx.camTgt.z, top = ctx.camTgt.y + r * .7;
    if (T <= 0 && T > -190) for (let q = 0; q < 14; q++) ctx.emit(cx + ctx.rr(-r, r), top, cz + ctx.rr(-r, r), ctx.rr(-.5, .5) * r / 60, -ctx.rr(.12, .25) * r, ctx.rr(-.5, .5) * r / 60, col.nieve, 4, 0);
    if (T <= -190 && T > -210) for (let q = 0; q < 20; q++) ctx.emit(cx + ctx.rr(-r, r), top, cz + ctx.rr(-r, r), 0, -r * .4, 0, col.gota, 3, 9.8);
    // la capa de aire licuado sube y luego se congela (de líquido azul a nieve blanca)
    capa.visible = est.capa > .01;
    if (capa.visible) { capa.position.y = ctx.GROUND - 2 + est.capa * 14; capa.material.color.set(0x8fc4ff).lerp(col.nieve, est.solido);
      capa.material.opacity = .55 + est.solido * .4; capa.material.roughness = .15 + est.solido * .8; }
    for (const p of ctx.people) if (p.caer) { p.cae = Math.min(1, p.cae + dt * 1.2 / p.caer); p.g.rotation.z = Math.PI / 2 * p.cae; }
    ctx.setShake(0);
    if (planeta) { planeta.update(dt); planeta.teñir(0xeef6ff, .92, 0x9ec2ff, .25); planeta.atm.visible = false; }
  }

  return {
    crear, fase, actualizar,
    activo: () => tiempo - t0 < 4 || reloj.pendientes > 0,
    tnt: v => Math.max(0, 15 - v) * 1.2e12 / COMUN.TNT_J,
    mag: v => `${v < 0 ? '−' : ''}${COMUN.num(Math.abs(v), Math.abs(v) >= 200 && v % 1 ? 1 : 0)} °C`,
  };
})();
