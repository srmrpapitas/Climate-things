// Granizo: el diámetro de cada piedra se duplica fase a fase.
// Velocidad terminal de una esfera de hielo: v = √(8·g·d·ρ_hielo / (3·ρ_aire·Cd)), con Cd = 0,6.
// TNT: energía con la que llega al suelo cada piedra (½ · m · v²).
window.FENOMENOS.granizo = (() => {
  let ctx, D = 0, t0 = 0, tiempo = 0, piedras = [], geo, matH, crateres = 0, col = {}, objs = [];
  const masa = d => 900 * Math.PI / 6 * d ** 3;
  const vel = d => Math.sqrt(8 * 9.81 * d * 900 / (3 * 1.2 * .6));
  const MAX = 260;

  function crear(c) {
    ctx = c; const T = ctx.THREE;
    geo = new T.IcosahedronGeometry(.5, 0); matH = new T.MeshStandardMaterial({ color: 0xeaf6ff, roughness: .3, flatShading: true });
    col = { hielo: new T.Color(0xeaf6ff), polvo: new T.Color(0xb9ad98) };
    objs = ctx.objects.filter(o => o.g && o.kind !== 'boat');
  }

  function fase(c, n, valor, f) { D = valor / 100; t0 = tiempo; if (D >= .08) ctx.people.forEach(p => { if (p.state === 0) p.run = 1; }); }

  // daño al caer una piedra de diámetro d (m) en x, z
  function impacto(x, y, z, d, vis) {
    const T = ctx.THREE;
    for (let q = 0; q < 6; q++) ctx.emit(x, y + .2, z, ctx.rr(-3, 3) * vis, ctx.rr(2, 6) * vis, ctx.rr(-3, 3) * vis, col.hielo, ctx.rr(.4, 1), 9.8 * vis);
    if (d < .1) return;
    const rad = Math.max(d * 1.5, d < .6 ? .8 : d * 3);
    for (const o of objs) {
      if (o.state === 2 || Math.abs(o.x - x) > rad + (o.w || 2) / 2 || Math.abs(o.z - z) > rad + (o.d || 2) / 2) continue;
      if (o.kind === 'building') { if (d >= (o.h > 60 ? 2.2 : o.h > 13 ? 1.1 : .55)) COMUN.derribar(ctx, o, new T.Vector3(0, -10, 0), { polvo: 12 }); }
      else if (o.kind === 'car' ? d >= .5 : d >= .12) ctx.derribar(o, new T.Vector3(ctx.rr(-2, 2), d * 4, ctx.rr(-2, 2)), { float: false });
    }
    if (d >= 1) { // cráter
      crateres++; const m = new T.Mesh(new T.CylinderGeometry(d * 1.6, d * 1.1, .4, 9), ctx.mat(0x5d5246)); m.position.set(x, ctx.GROUND + .05, z); ctx.cityGroup.add(m);
      for (let q = 0; q < 10; q++) ctx.emit(x, y, z, ctx.rr(-1, 1) * d * 4, ctx.rr(1, 3) * d * 3, ctx.rr(-1, 1) * d * 4, col.polvo, ctx.rr(1, 2.5), 9.8);
    }
  }

  function actualizar(c, dt, t) {
    tiempo = t; const e = t - t0, T = ctx.THREE;
    // más piedras cuanto más pequeñas (lo que se ve en pantalla), menos cuanto más grandes
    const r = Math.max(25, Math.min(1500, ctx.camDist * .6)), cx = ctx.camTgt.x, cz = ctx.camTgt.z;
    const vis = Math.max(1, ctx.camDist * .004 / Math.max(D, .01)); // tamaño mínimo para que se vea
    const dens = D < .1 ? 60 : D < .6 ? 30 : D < 2 ? 14 : 8;
    if (D > 0 && e < 5) for (let q = 0; q < Math.round(dens * dt * 10); q++) {
      if (piedras.length >= MAX) break;
      const m = new T.Mesh(geo, matH), s = D * vis * ctx.rr(.7, 1.3); m.scale.setScalar(s); m.userData.fenPropio = true;
      const x = cx + ctx.rr(-r, r), z = cz + ctx.rr(-r, r), h = ctx.camTgt.y + r * ctx.rr(.6, 1.2);
      m.position.set(x, h, z); m.rotation.set(ctx.R() * 6, ctx.R() * 6, 0); ctx.scene.add(m);
      piedras.push({ m, vy: -Math.max(vel(D), r * .5), d: D * ctx.rr(.7, 1.3), vis });
    }
    for (let i = piedras.length - 1; i >= 0; i--) {
      const p = piedras[i], m = p.m; m.position.y += p.vy * dt; m.rotation.x += dt * 3;
      const g = ctx.groundAt(m.position.x, m.position.z);
      if (m.position.y <= g + m.scale.x * .5) { impacto(m.position.x, g, m.position.z, p.d, Math.min(p.vis, 30)); ctx.scene.remove(m); piedras.splice(i, 1); }
    }
    ctx.skyT.set(D >= 1 ? 0x4a5560 : D >= .1 ? 0x606d78 : 0x7d8b97);
    ctx.setShake(D >= .6 && e < 5 ? Math.min(ctx.camDist * .003, D * .6) * ctx.R() : 0);
    if (D >= .02 && ctx.R() < dt * 30) COMUN.ruido(ctx, .08, 2500, Math.min(.25, D * 2), 0, 'highpass');
  }

  return {
    crear, fase, actualizar,
    activo: () => tiempo - t0 < 6 || piedras.length > 0,
    mag: v => v < 100 ? `${COMUN.num(v, 0)} cm` : `${COMUN.num(v / 100, 2)} m`,
    linea3: v => { const d = v / 100, E = .5 * masa(d) * vel(d) ** 2, t = E / COMUN.TNT_J, kg = masa(d);
      return [`≈ ${COMUN.textoTNT(t)} por piedra`, `(pesa ${kg < 1 ? COMUN.num(kg * 1000) + ' g' : kg < 1000 ? COMUN.num(kg) + ' kg' : COMUN.num(kg / 1000) + ' t'} y cae a ${COMUN.num(vel(d) * 3.6, 0)} km/h)`]; },
    danos: () => `${COMUN.num(ctx.caidos, 0)} edificios destruidos · ${COMUN.num(crateres, 0)} cráteres`,
  };
})();
