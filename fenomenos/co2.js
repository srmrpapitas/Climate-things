// CO2: la concentración en el aire se duplica fase a fase. No hay explosión: la ciudad se queda dormida.
// 1 ppm de CO2 en la atmósfera ≈ 7,8 mil millones de toneladas. Un coche emite unas 4,6 t de CO2 al año.
window.FENOMENOS.co2 = (() => {
  let ctx, ppm = 420, t0 = 0, tiempo = 0, gente = [], coches = [], todos = [];
  const est = { niebla: 0, mar: 0 }, obj = { ...est };
  let cieloObj = 0x9fd3f0, gris = null, nieblaCol = null;
  const extraGt = p => Math.max(0, p - 280) * 7.8;           // CO2 de más respecto a antes de la industria (Gt)
  const cochesAno = p => extraGt(p) * 1e9 / 4.6;

  function crear(c) {
    ctx = c; gris = new ctx.THREE.Color(0x9a9a8c); nieblaCol = new ctx.THREE.Color(0xb8b49a);
    gente = COMUN.multitud(ctx, 90, -10, 10, 120, 420, { andar: true });
    todos = gente.concat(ctx.people);
    coches = ctx.objects.filter(o => o.kind === 'car');
    for (const o of coches) o.vel = ctx.R() < .5 ? ctx.rr(4, 9) : 0;
    // la calima: acerca la niebla después de que el motor la coloque
    // (si el juego está en pausa no se vuelve a aplicar: el motor solo la recoloca en cada paso)
    let ultimo = -1;
    ctx.scene.onBeforeRender = () => {
      const f = ctx.scene.fog, k = est.niebla;
      if (k < .01 || f.near === ultimo) return;
      f.near *= 1 - k * .97; f.far *= 1 - k * .93; f.color.lerp(nieblaCol, k * .8); ctx.scene.background.lerp(nieblaCol, k * .6);
      ultimo = f.near;
    };
  }

  function fase(c, n, valor, f) {
    ppm = valor; t0 = tiempo;
    obj.niebla = Math.min(.92, Math.max(0, Math.log2(ppm / 420) / 8));
    obj.mar = ppm >= 3000 ? Math.min(1, Math.log2(ppm / 1680) / 4) : 0;
    cieloObj = ppm >= 20000 ? 0x8d8b7a : ppm >= 5000 ? 0xa3aa9e : ppm >= 1500 ? 0xb3c4c6 : 0x9fd3f0;
    const lento = ppm >= 5000 ? Math.max(.15, 1 - Math.log2(ppm / 5000) * .3) : 1;
    // fracción de gente que se desmaya
    const caen = ppm >= 100000 ? 1 : ppm >= 40000 ? .55 : ppm >= 20000 ? .08 : 0;
    for (const p of todos) {
      if (p.state === 2) continue;
      p.lento = lento; if (p.andar == null) p.andar = 0;
      if (!p.caer && ctx.R() < caen) { p.caer = ctx.rr(.6, 2.5); p.retraso = tiempo + ctx.rr(0, 3); }
    }
    if (ppm >= 20000) for (const o of coches) o.vel = 0;
    COMUN.tono(ctx, 110, 90, 3, 'sine', .1); // golpe suave: aquí no explota nada
  }

  function actualizar(c, dt, t) {
    tiempo = t; const k = 1 - Math.exp(-dt * .9);
    for (const key in est) est[key] += (obj[key] - est[key]) * k;
    ctx.skyT.set(cieloObj);
    // el mar sube (el hielo de los polos se derrite con el tiempo)
    ctx.seaNear.position.y = est.mar * 2.6;
    // gente: pasea cada vez más lenta y, al final, se desploma
    for (const p of todos) if (p.caer && tiempo > p.retraso && !p.caido) { p.cae = Math.min(1, (p.cae || 0) + dt / p.caer);
      p.g.rotation.x = -Math.PI / 2 * p.cae * p.cae; if (p.cae >= 1) p.caido = true; }
    COMUN.moverGente(ctx, gente.filter(p => !p.caer || tiempo < p.retraso), dt, t);
    for (const o of coches) if (o.vel && o.state !== 2) { const d = o.g.rotation.y; o.g.position.x -= Math.sin(d) * o.vel * dt; o.g.position.z -= Math.cos(d) * o.vel * dt; }
    // moléculas de CO2 flotando cerca de la cámara
    const r = Math.max(30, Math.min(800, ctx.camDist * .6)), n = Math.round(est.niebla * 10);
    for (let q = 0; q < n; q++) ctx.emit(ctx.camTgt.x + ctx.rr(-r, r), ctx.camTgt.y + ctx.rr(-r, r) * .5, ctx.camTgt.z + ctx.rr(-r, r), ctx.rr(-1, 1), ctx.rr(-.5, .5), ctx.rr(-1, 1), gris, 3, 0);
    ctx.setShake(0);
  }

  return {
    sinBoom: true,
    crear, fase, actualizar,
    activo: () => tiempo - t0 < 4,
    mag: v => `${COMUN.num(v, 0)} ppm`,
    linea3: v => COMUN.EN ? [`≈ ${COMUN.grande(cochesAno(v))} cars for a year`, `(${COMUN.grande(extraGt(v) * 1e9)} t of extra CO2)`] : [`≈ ${COMUN.grande(cochesAno(v))} de coches un año`, `(${COMUN.grande(extraGt(v) * 1e9)} de t de CO2 de más)`],
    danos: () => { const n = todos.filter(p => p.caer && tiempo > p.retraso).length; const pc = COMUN.num(Math.round(100 * n / todos.length), 0); return COMUN.EN ? `${pc}% of people unconscious` : `${pc} % de la gente inconsciente`; },
  };
})();
