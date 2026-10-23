// Volcán: la columna de ceniza de la erupción duplica su altura fase a fase.
// Potencia de la erupción a partir de la altura de la columna (Sparks, 1986): H ≈ 8,2 · Q^¼ (H en m, Q en W).
window.FENOMENOS.volcan = (() => {
  const VX = -3000, VZ = 6500, ALTO = 1800, BASE = 3200; // dónde está y cómo es el volcán
  let ctx, H = 0, t0 = 0, tiempo = 0, vy0 = 0, columna = null, puffs = [], hongo = null, flujo = null, flujoR = 0, flujoMax = 0, col = {}, objs = [];
  const potencia = h => Math.pow(h / 8.2, 4); // W

  function crear(c) {
    ctx = c; const T = ctx.THREE;
    vy0 = ctx.terrainY(VX, VZ);
    const g = new T.CylinderGeometry(260, BASE, ALTO, 28, 6, true).toNonIndexed();
    const p = g.attributes.position, cc = new Float32Array(p.count * 3), C = new T.Color();
    for (let i = 0; i < p.count; i += 3) { const y = (p.getY(i) + p.getY(i + 1) + p.getY(i + 2)) / 3 + ALTO / 2;
      C.set(y > ALTO * .82 ? 0x4a3f3a : y > ALTO * .5 ? 0x6e5f55 : 0x7f8a55).multiplyScalar(.9 + Math.random() * .2);
      for (let k = 0; k < 3; k++) { cc[(i + k) * 3] = C.r; cc[(i + k) * 3 + 1] = C.g; cc[(i + k) * 3 + 2] = C.b; } }
    for (let i = 0; i < p.count; i++) { const y = p.getY(i); if (y > -ALTO / 2 + 1 && y < ALTO / 2 - 1) { const a = Math.atan2(p.getZ(i), p.getX(i)), n = 1 + Math.sin(a * 5 + y * .01) * .06; p.setX(i, p.getX(i) * n); p.setZ(i, p.getZ(i) * n); } }
    g.setAttribute('color', new T.BufferAttribute(cc, 3)); g.computeVertexNormals();
    const m = new T.Mesh(g, new T.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 1 })); m.position.set(VX, vy0 + ALTO / 2 - 40, VZ); ctx.scene.add(m);
    const crater = new T.Mesh(new T.CircleGeometry(250, 20).rotateX(-Math.PI / 2), new T.MeshBasicMaterial({ color: 0xff5a14 })); crater.position.set(VX, vy0 + ALTO - 60, VZ); ctx.scene.add(crater);
    col = { ceniza: new T.Color(0x6b6560), lava: new T.Color(0xff6a1a), chispa: new T.Color(0xffc040) };
    objs = ctx.objects.filter(o => o.g);
    columna = new T.Group(); columna.userData.fenPropio = true; ctx.scene.add(columna);
  }

  function fase(c, n, valor, f) {
    H = valor * 1000; t0 = tiempo;
    // columna nueva: bolas de ceniza apiladas y el hongo arriba
    for (const p of puffs) columna.remove(p.m); puffs = [];
    const T = ctx.THREE, mat = new T.MeshStandardMaterial({ color: 0x8a837c, flatShading: true, roughness: 1 }), mat2 = new T.MeshStandardMaterial({ color: 0x5e5853, flatShading: true, roughness: 1 });
    const N = 34;
    for (let i = 0; i < N; i++) {
      const k = i / (N - 1), m = new T.Mesh(new T.IcosahedronGeometry(1, 1), i % 3 ? mat : mat2);
      const r = Math.max(250, H * (.05 + .1 * k));
      m.userData.base = new T.Vector3(VX + ctx.rr(-.3, .3) * r, vy0 + ALTO + k * H * .9, VZ + ctx.rr(-.3, .3) * r); m.userData.r = r * ctx.rr(.8, 1.2); m.userData.k = k;
      m.scale.setScalar(.001); columna.add(m); puffs.push({ m });
    }
    if (hongo) columna.remove(hongo);
    hongo = new T.Mesh(new T.IcosahedronGeometry(1, 2), mat); hongo.position.set(VX, vy0 + ALTO + H * .92, VZ); hongo.scale.setScalar(.001); columna.add(hongo);
    // flujo piroclástico: una nube que baja por las laderas y arrasa lo que alcanza
    flujoMax = H >= 15000 ? H * .3 : 0;
    if (flujoMax && !flujo) { flujo = new T.Mesh(new T.SphereGeometry(1, 28, 10, 0, Math.PI * 2, 0, Math.PI / 2), mat2); flujo.position.set(VX, vy0, VZ); flujo.scale.setScalar(.001); columna.add(flujo); }
    ctx.boom(8); FEN_ruido(n);
  }
  function FEN_ruido(n) { COMUN.ruido(ctx, 6, 90, Math.min(.8, .2 + n * .08)); }

  function actualizar(c, dt, t) {
    tiempo = t; const e = t - t0, k = Math.min(1, e / 4), ease = 1 - Math.pow(1 - k, 3);
    for (const p of puffs) { const m = p.m, u = m.userData; if (u.k > ease + .05) { m.scale.setScalar(.001); continue; }
      m.position.copy(u.base); m.position.x += Math.sin(t * .3 + u.k * 9) * u.r * .15; m.scale.setScalar(u.r * (.6 + .4 * Math.min(1, (ease - u.k) * 4 + .3))); }
    if (hongo) { const s = Math.max(.001, H * 1.1 * smooth01((e - 2) / 3)); hongo.scale.set(s, s * .22, s); }
    // lava y chispas en el cráter
    const sc = Math.max(1, H / 2000);
    for (let q = 0; q < 12; q++) ctx.emit(VX + ctx.rr(-150, 150), vy0 + ALTO, VZ + ctx.rr(-150, 150), ctx.rr(-30, 30) * sc, ctx.rr(60, 160) * sc, ctx.rr(-30, 30) * sc, ctx.R() < .6 ? col.lava : col.chispa, ctx.rr(2, 4), 9.8 * sc);
    // ceniza que cae sobre la ciudad
    if (H >= 4000) { const r = Math.max(60, Math.min(4000, ctx.camDist * .7)), n = Math.round(Math.min(80, H / 400));
      for (let q = 0; q < n; q++) ctx.emit(ctx.camTgt.x + ctx.rr(-r, r), ctx.camTgt.y + r * ctx.rr(.3, .9), ctx.camTgt.z + ctx.rr(-r, r), ctx.rr(-.05, .05) * r, -r * .25, 0, col.ceniza, 4, 0); }
    // el flujo piroclástico avanza y arrasa
    if (flujo && flujoMax) {
      flujoR += (flujoMax - flujoR) * (1 - Math.exp(-dt * .35));
      flujo.scale.set(flujoR, Math.min(1500, flujoR * .12), flujoR);
      for (const o of objs) { if (o.state === 2) continue; const dx = o.x - VX, dz = o.z - VZ, d = Math.hypot(dx, dz); if (d > flujoR) continue;
        const v = new ctx.THREE.Vector3(dx / d * 60, 10, dz / d * 60);
        if (o.kind === 'building') COMUN.derribar(ctx, o, v, { colorEscombros: 0x5e5853, polvo: 8, colorPolvo: col.ceniza }); else ctx.derribar(o, v, { float: false }); }
    }
    ctx.skyT.set(H >= 60000 ? 0x1c1a19 : H >= 30000 ? 0x3b3633 : H >= 15000 ? 0x5e5853 : H >= 4000 ? 0x8a8a86 : 0x9fd3f0);
    ctx.setShake(e < 3 ? Math.min(ctx.camDist * .003, H / 6000) * (1 - e / 3) : 0);
    ctx.rumble(Math.min(.5, .1 + H / 100000));
  }
  const smooth01 = x => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };

  return {
    crear, fase, actualizar,
    activo: () => tiempo - t0 < 6,
    mag: v => `${COMUN.num(v, v < 1 ? 1 : 0)} km de ceniza`,
    linea3: v => { const t = potencia(v * 1000) / COMUN.TNT_J; return [`≈ ${COMUN.textoTNT(t)} por segundo`, COMUN.comparaTNT(t) ? `(${COMUN.comparaTNT(t)} cada segundo)` : '']; },
  };
})();
