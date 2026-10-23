// Lluvia: la intensidad (mm por hora) se duplica fase a fase. El agua que no cabe en las alcantarillas se acumula.
// Nivel tras un día de lluvia: (intensidad − 50 mm/h que tragan las alcantarillas) · 24 h.
// TNT: energía potencial del agua que cae en una hora desde 1 km de altura sobre 10 km² (m · g · h).
window.FENOMENOS.lluvia = (() => {
  let ctx, I = 0, t0 = 0, tiempo = 0, agua = null, nivel = 0, nivelObj = 0, col = {}, flotan = [], sumergidos = 0, edif = [];
  const nivelDia = mmh => Math.max(0, mmh - 50) * 24 / 1000; // metros

  function crear(c) {
    ctx = c; const T = ctx.THREE;
    col = { gota: new T.Color(0xbfd9ee), salpica: new T.Color(0xe6f3ff) };
    const g = new T.PlaneGeometry(1.2e5, 1.2e5, 64, 64).rotateX(-Math.PI / 2);
    agua = new T.Mesh(g, new T.MeshStandardMaterial({ color: 0x4f7f99, transparent: true, opacity: .78, roughness: .2, flatShading: true }));
    agua.userData.fenPropio = true; agua.visible = false; agua.position.set(0, ctx.GROUND - 1, 0); ctx.scene.add(agua);
    flotan = ctx.objects.filter(o => o.kind === 'car' || o.kind === 'person');
    edif = COMUN.edificios(ctx).filter(o => !o.landmark);
  }

  function fase(c, n, valor, f) {
    I = valor; t0 = tiempo; nivelObj = nivelDia(I);
    if (I >= 150) ctx.people.forEach(p => { if (p.state === 0) p.run = 1; });
  }

  function actualizar(c, dt, t) {
    tiempo = t; const e = t - t0;
    nivel += (nivelObj - nivel) * (1 - Math.exp(-dt * .5));
    agua.visible = nivel > .05; agua.position.y = ctx.GROUND - .3 + nivel;
    // lo que queda bajo el agua flota y se va con la corriente
    for (const o of flotan) if (o.state !== 2 && nivel > (o.kind === 'car' ? .6 : 1.2)) {
      o.state = 2; ctx.derribar(o, new ctx.THREE.Vector3(ctx.rr(-1, 1), .5, ctx.rr(-3, -1)), { float: true });
    }
    sumergidos = edif.filter(o => o.h < nivel).length;
    // gotas alrededor de la cámara: más densas y largas cuanto más llueve
    const r = Math.max(30, Math.min(2500, ctx.camDist * .7)), cx = ctx.camTgt.x, cz = ctx.camTgt.z, top = ctx.camTgt.y + r * .8;
    const n = Math.round(Math.min(160, 8 + Math.sqrt(I) * 3.2)), vy = -Math.max(r * .9, 9);
    for (let q = 0; q < n; q++) ctx.emit(cx + ctx.rr(-r, r), top * ctx.rr(.5, 1), cz + ctx.rr(-r, r), r * .05, vy, 0, col.gota, ctx.rr(1, 2), 0);
    if (nivel < 3) for (let q = 0; q < n / 6; q++) ctx.emit(cx + ctx.rr(-r, r) * .6, ctx.GROUND + nivel + .1, cz + ctx.rr(-r, r) * .6, ctx.rr(-1, 1), ctx.rr(1, 3), ctx.rr(-1, 1), col.salpica, .3, 9.8);
    ctx.skyT.set(I >= 1000 ? 0x3f4852 : I >= 200 ? 0x56616c : I >= 40 ? 0x76838f : 0x98a7b4);
    ctx.setShake(0);
  }

  return {
    crear, fase, actualizar,
    activo: () => tiempo - t0 < 4.5,
    // el agua acumulada arrastra los restos (el motor la usa para que floten)
    corriente: (x, z) => nivel > .3 ? { y: ctx.GROUND - .3 + nivel, vz: 1.5 } : null,
    tnt: v => v / 1000 * 1e7 * 1000 * 9.81 * 1000 / COMUN.TNT_J,
    mag: v => `${COMUN.num(v, 0)} mm/h`,
    danos: () => `Agua tras un día: ${COMUN.num(nivelObj, nivelObj < 10 ? 1 : 0)} m · ${COMUN.num(sumergidos, 0)} edificios bajo el agua`,
  };
})();
