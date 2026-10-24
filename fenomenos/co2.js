// CO2: la concentración en el aire se duplica fase a fase. No hay explosión: la ciudad se queda dormida.
// 1 ppm de CO2 en la atmósfera ≈ 7,8 mil millones de toneladas. Un coche emite unas 4,6 t de CO2 al año.
window.FENOMENOS.co2 = (() => {
  let ctx, ppm = 420, t0 = 0, tiempo = 0, gente = [], coches = [], todos = [];
  const est = { niebla: 0, mar: 0, venus: 0 }, obj = { ...est };
  let cieloObj = 0x9fd3f0, gris = null, nieblaCol = null;
  const X0 = -11.5, Z0 = 120, VEL = .8, reloj = COMUN.reloj();
  let planeta = null, heroe = null, heroeLento = 1, heroeCae = 0, andado = 0;
  const extraGt = p => Math.max(0, p - 280) * 7.8;           // CO2 de más respecto a antes de la industria (Gt)
  const cochesAno = p => extraGt(p) * 1e9 / 4.6;

  function crear(c) {
    ctx = c; gris = new ctx.THREE.Color(0x9a9a8c); nieblaCol = new ctx.THREE.Color(0xb8b49a);
    // protagonista: el mismo chico de la sudadera roja, paseando por la acera
    heroe = COMUN.heroe(ctx, 0xd8282f); heroe.position.set(X0, ctx.GROUND, Z0); heroe.userData.fenPropio = true;
    heroe.traverse(m => { if (m.isMesh) m.castShadow = true; }); ctx.scene.add(heroe);
    gente = COMUN.multitud(ctx, 90, -10, 10, 120, 420, { andar: true });
    for (const p of gente) if (Math.abs(p.x - X0) < 1.5 && p.z > Z0 - 4 && p.z < Z0 + 60) { p.x += 3; p.g.position.x = p.x; }
    todos = gente.concat(ctx.people);
    coches = ctx.objects.filter(o => o.kind === 'car');
    for (const o of coches) o.vel = ctx.R() < .5 ? ctx.rr(4, 9) : 0;
    // la calima: acerca la niebla después de que el motor la coloque
    // (si el juego está en pausa no se vuelve a aplicar: el motor solo la recoloca en cada paso)
    let ultimo = -1;
    ctx.scene.onBeforeRender = () => {
      const f = ctx.scene.fog, k = est.niebla;
      if (k < .01 || f.near === ultimo || (planeta && ctx.camDist > 1e5)) return; // desde el espacio, sin calima
      f.near *= 1 - k * .97; f.far *= 1 - k * .93; f.color.lerp(nieblaCol, k * .8); ctx.scene.background.lerp(nieblaCol, k * .6);
      ultimo = f.near;
    };
  }

  function fase(c, n, valor, f) {
    ppm = valor; t0 = tiempo;
    obj.niebla = Math.min(.92, Math.max(0, Math.log2(ppm / 420) / 8));
    obj.mar = ppm >= 3000 ? Math.min(1, Math.log2(ppm / 1680) / 4) : 0;
    cieloObj = ppm >= 20000 ? 0x8d8b7a : ppm >= 5000 ? 0xa3aa9e : ppm >= 1500 ? 0xb3c4c6 : 0x9fd3f0;
    heroeLento = ppm >= 40000 ? .15 : ppm >= 10000 ? .4 : ppm >= 5000 ? .65 : 1;
    if (ppm >= 40000 && !heroeCae) reloj.luego(1.2, () => { heroeCae = .001; });
    const lento = ppm >= 5000 ? Math.max(.15, 1 - Math.log2(ppm / 5000) * .3) : 1;
    // fracción de gente que se desmaya
    const caen = ppm >= 100000 ? 1 : ppm >= 40000 ? .55 : ppm >= 20000 ? .08 : 0;
    for (const p of todos) {
      if (p.state === 2) continue;
      p.lento = lento; if (p.andar == null) p.andar = 0;
      if (!p.caer && ctx.R() < caen) { p.caer = ctx.rr(.6, 2.5); p.retraso = tiempo + ctx.rr(0, 3); }
    }
    if (ppm >= 20000) for (const o of coches) o.vel = 0;
    // todo el aire es CO2: se ve la Tierra desde el espacio, volviéndose amarilla como Venus
    if (f.planeta && !planeta) { planeta = COMUN.planeta(ctx); cieloObj = 0x05070c; obj.venus = 1; obj.niebla = .5; }
    COMUN.tono(ctx, 110, 90, 3, 'sine', .1); // golpe suave: aquí no explota nada
  }

  function actualizar(c, dt, t) {
    tiempo = t; reloj.tick(t); const k = 1 - Math.exp(-dt * .9);
    for (const key in est) est[key] += (obj[key] - est[key]) * k;
    COMUN.corte.tick(ctx, dt);
    if (!ctx.corte) ctx.skyT.set(cieloObj);
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
    // el protagonista anda cada vez más despacio, tose con la cabeza gacha y al final se desploma
    const vel = heroeCae ? 0 : VEL * heroeLento; heroe.position.z += vel * dt; andado += vel * dt;
    heroe.userData.andar(t * 5 * heroeLento, vel > .05 ? 1 : 0);
    heroe.userData.cabeza.rotation.x = ppm >= 5000 && !heroeCae ? .25 + Math.sin(t * 9) * .08 * (ppm >= 10000 ? 1 : 0) : 0;
    if (heroeCae) { heroeCae = Math.min(1, heroeCae + dt / 1.4); heroe.rotation.x = -Math.PI / 2 * heroeCae * heroeCae; }
    if (planeta) { planeta.update(dt); planeta.teñir(0xe3c27a, .85 * est.venus, 0xf0d890, .8 * est.venus); }
  }

  // las cámaras de los pasos están puestas respecto a donde empieza a andar
  function camara(c) { const d = andado, m = v => [v[0], v[1], v[2] + d]; return c.cerca ? { ...c, pos: m(c.pos), mira: m(c.mira) } : c; }

  return {
    sinBoom: true,
    crear, fase, actualizar, camara,
    inserto: (c, ef, on) => COMUN.corte.on(c, ef, on),
    // plano 'heroe': las coordenadas del plano van respecto a donde empezó a andar el protagonista
    // 'coche': el coche parado más cerca del protagonista, visto desde donde no lo tape ningún edificio
    plano: (c, fi) => {
      if (fi.plano === 'heroe') return camara({ pos: fi.pos, mira: fi.mira, cerca: true });
      if (fi.plano === 'coche') {
        const hz = Z0 + andado, o = coches.filter(o => o.state !== 2).sort((p, q) => Math.hypot(p.g.position.x - X0, p.g.position.z - hz - 20) - Math.hypot(q.g.position.x - X0, q.g.position.z - hz - 20))[0];
        if (!o) return null; const mira = [o.g.position.x, ctx.GROUND + 1, o.g.position.z];
        return { pos: COMUN.mirador(ctx, COMUN.edificios(ctx), mira, 9, 2.5), mira };
      }
      return null;
    },
    activo: () => tiempo - t0 < 4,
    mag: v => `${COMUN.num(v, 0)} ppm`,
    linea3: v => COMUN.EN ? [`≈ ${COMUN.grande(cochesAno(v))} cars for a year`, `(${COMUN.grande(extraGt(v) * 1e9)} t of extra CO2)`] : [`≈ ${COMUN.grande(cochesAno(v))} de coches un año`, `(${COMUN.grande(extraGt(v) * 1e9)} de t de CO2 de más)`],
    // a la larga ≈ 3 °C por cada duplicación desde 280 ppm; el oxígeno baja porque el CO2 ocupa su sitio; y cuánta gente se ha desmayado
    danos: () => {
      const EN = COMUN.EN, o2 = COMUN.num(20.95 * (1 - ppm / 1e6), 1), dT = COMUN.num(3 * Math.log2(ppm / 280), 0);
      const n = todos.filter(p => p.caer && tiempo > p.retraso).length, pc = COMUN.num(Math.round(100 * n / todos.length), 0);
      if (ppm < 2e4) return EN ? `+${dT} °C in the long run · oxygen ${o2}%` : `+${dT} °C a la larga · oxígeno ${o2} %`;
      return EN ? `Oxygen ${o2}% · ${pc}% of people unconscious` : `Oxígeno ${o2} % · ${pc} % de la gente inconsciente`;
    },
  };
})();
