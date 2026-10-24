// Gravedad: en cada fase la gravedad de la Tierra se duplica (1 g, 2 g, 4 g…). Primero pesa todo, luego se aplasta
// la ciudad, después la Tierra entera se comprime hasta acabar en un agujero negro. Cifras aproximadas: compruébalas antes de publicar.
window.FENOMENOS.gravedad = (() => {
  const reloj = COMUN.reloj();
  let ctx, G = 1, t0 = 0, tiempo = 0, edif = [], arboles = [], coches = [], planeta = null, yo = null, agujero = null;
  const est = { aplastar: 0, mar: 0, cielo: 0, encoger: 1, brillo: 0 }, obj = { ...est };
  let cieloObj = 0x9fd3f0;
  // peso de una persona de 70 kg y algo que pese lo mismo en la Tierra normal
  const COSAS = [[140, 'una persona más a la espalda', 'another person on your back'], [280, 'una moto', 'a motorbike'], [560, 'un caballo', 'a horse'],
    [1120, 'un coche', 'a car'], [2240, 'un rinoceronte', 'a rhino'], [4480, 'un elefante', 'an elephant'], [8960, 'un camión', 'a lorry'],
    [17920, 'un autobús', 'a bus'], [35840, 'un tanque', 'a tank'], [71680, 'una ballena azul joven', 'a young blue whale'], [143360, 'un avión de pasajeros', 'an airliner'],
    [286720, 'la Estatua de la Libertad', 'the Statue of Liberty'], [573440, 'un barco de carga', 'a cargo ship']];

  function crear(c) {
    ctx = c;
    yo = COMUN.protagonista(ctx); // el chico de la sudadera: anda cada vez más despacio, se dobla y cae
    COMUN.materiales(ctx);
    edif = COMUN.edificios(ctx);
    arboles = ctx.objects.filter(o => o.kind === 'tree' || o.kind === 'palm');
    coches = ctx.objects.filter(o => o.kind === 'car');
    // unos cuantos coches aparcados en la calle del protagonista, para verlos aplastarse
    coches.slice(0, 10).forEach((o, k) => { o.x = k % 2 ? 4.2 : -4.2; o.z = 128 + k * 6; o.g.position.set(o.x, ctx.GROUND, o.z); o.g.rotation.y = k % 2 ? 0 : Math.PI; });
  }

  // el agujero negro del final: esfera negra con un disco de gas brillante alrededor
  function crearAgujero() {
    const T = ctx.THREE, g = new T.Group(), R = COMUN.RT;
    const negro = new T.Mesh(new T.SphereGeometry(R * .05, 32, 20), new T.MeshBasicMaterial({ color: 0x000000, fog: false }));
    const disco = new T.Mesh(new T.RingGeometry(R * .09, R * .55, 96, 1), new T.MeshBasicMaterial({ color: 0xffa040, transparent: true, opacity: 0, side: T.DoubleSide,
      blending: T.AdditiveBlending, depthWrite: false, fog: false }));
    disco.rotation.x = Math.PI / 2 - .35;
    const halo = new T.Mesh(new T.RingGeometry(R * .055, R * .085, 64, 1), new T.MeshBasicMaterial({ color: 0xfff0d0, transparent: true, opacity: 0, side: T.DoubleSide,
      blending: T.AdditiveBlending, depthWrite: false, fog: false }));
    g.add(negro, disco, halo); g.position.set(0, -R, 0); g.visible = false; g.userData = { fenPropio: true, sobrePlaneta: true }; ctx.scene.add(g);
    return { g, disco, halo, k: 0 };
  }

  function fase(c, n, valor, f) {
    G = valor; t0 = tiempo;
    Object.assign(yo.est, { lento: G >= 8 ? 0 : G >= 4 ? .25 : G >= 2 ? .55 : 1, cabeza: G >= 4 ? .35 : G >= 2 ? .15 : 0, hablar: G === 2 || G === 4 ? .4 : 0 });
    if (G >= 8 && !yo.est.caer) reloj.luego(.5, () => { yo.est.caer = true; });
    // la gente: primero va despacio y a 8 g se desmaya (la sangre no sube a la cabeza)
    for (const p of ctx.people) { if (G >= 2) p.lento = G >= 4 ? .2 : .5; if (G >= 8 && p.state === 0) { p.state = 1; p.cae = 0; p.caer = ctx.rr(.3, 1.2); } }
    obj.aplastar = G >= 16 ? Math.min(1, (Math.log2(G) - 3) / 5) : 0;
    obj.mar = G >= 256 ? 1 : 0;
    obj.cielo = G >= 512 ? 1 : 0;
    cieloObj = G >= 512 ? 0x3a5068 : G >= 128 ? 0x7f98ad : G >= 32 ? 0x93b7cf : 0x9fd3f0;
    // los coches se aplastan como latas
    if (G >= 32) coches.forEach(o => o.aplasta = 1);
    // primero ceden las casas bajas, luego todo
    const limite = G >= 128 ? Infinity : G >= 64 ? 30 : 0;
    for (const o of edif) if (o.state !== 2 && o.h < limite) reloj.luego(ctx.rr(.2, 3), () => {
      COMUN.derribar(ctx, o, new ctx.THREE.Vector3(ctx.rr(-.5, .5), -Math.min(o.h, 300) * .6, ctx.rr(-.5, .5)), { polvo: o.h > 60 ? 26 : 12 });
    });
    if (f.planeta) { planeta = COMUN.planeta(ctx); cieloObj = 0x05070c; }
    obj.encoger = G >= 8192 ? .02 : G >= 4096 ? .08 : G >= 2048 ? .35 : G >= 1024 ? .7 : 1;
    obj.brillo = G >= 4096 ? 1 : G >= 2048 ? .6 : 0;
    if (f.agujero) { agujero ||= crearAgujero(); agujero.g.visible = true; }
    COMUN.tono(ctx, 90 / Math.sqrt(Math.log2(G) + 1), 30, 3, 'sine', Math.min(.35, .08 + n * .025)); // un zumbido grave que baja de tono
    if (G >= 16) COMUN.ruido(ctx, 2.5, 160, Math.min(.5, .1 + n * .03));
  }

  function actualizar(c, dt, t) {
    tiempo = t; reloj.tick(t); const k = 1 - Math.exp(-dt * 1.3);
    yo.actualizar(dt, t);
    for (const key in est) est[key] += (obj[key] - est[key]) * k;
    COMUN.corte.tick(ctx, dt);
    if (!ctx.corte) ctx.skyT.set(cieloObj);
    // todo lo que sigue en pie se va achatando
    const sq = 1 - est.aplastar * .55;
    for (const o of edif) if (o.state === 0) o.g.scale.y = sq;
    for (const o of arboles) if (o.state !== 2) { o.g.scale.y = Math.max(.15, 1 - est.aplastar * .85); o.g.rotation.z = est.aplastar * .4; }
    for (const o of coches) if (o.aplasta && o.state !== 2) o.g.scale.y = Math.max(.22, o.g.scale.y - dt * .5);
    for (const p of ctx.people) if (p.state === 1 && p.caer) { p.cae = Math.min(1, p.cae + dt * 1.6 / p.caer); p.g.rotation.x = -Math.PI / 2 * p.cae; if (G >= 64) p.g.scale.y = Math.max(.25, 1 - est.aplastar * .7); }
    if (G >= 64 && yo.g.scale.y > .3) yo.g.scale.y = Math.max(.3, 1 - est.aplastar * .7);
    // el mar se queda plano como un espejo
    ctx.seaNear.scale.y = 1 - est.mar * .95;
    ctx.setShake(G >= 16 && t - t0 < 1.5 ? .03 + Math.min(.3, Math.log2(G) * .01) : 0);
    if (planeta) {
      planeta.update(dt); planeta.g.scale.setScalar(est.encoger);
      planeta.teñir(0xfff4e0, est.brillo * .9, 0xffd8a0, est.brillo * 1.2);
      planeta.atm.material.opacity = .18 * Math.max(0, 1 - (1 - est.encoger) * 2);
      planeta.nubes.visible = est.encoger > .5;
      if (agujero && agujero.g.visible) { agujero.k = Math.min(1, agujero.k + dt * .5); agujero.disco.material.opacity = .85 * agujero.k; agujero.halo.material.opacity = agujero.k;
        agujero.disco.rotation.z += dt * .6; planeta.g.visible = est.encoger > .03; }
    }
  }

  // plano de corte 'cae': un edificio de la altura pedida (alto: [min, max]) que se hunde bajo su peso mientras se mira
  function plano(c, fi) {
    const [a, b] = fi.alto || [0, 1e9], o = edif.filter(o => o.state === 0 && o.h >= a && o.h <= b && !o.landmark)
      .sort((p, q) => Math.abs(p.z - 450) + p.w * p.d / 10 - Math.abs(q.z - 450) - q.w * q.d / 10)[0];
    if (!o) return null;
    reloj.luego(fi.cae ?? .5, () => COMUN.derribar(ctx, o, new ctx.THREE.Vector3(ctx.rr(-.5, .5), -Math.min(o.h, 300) * .6, ctx.rr(-.5, .5)), { polvo: o.h > 60 ? 26 : 12 }));
    const mira = [o.x, ctx.GROUND + o.h * .4, o.z];
    return { pos: COMUN.mirador(ctx, edif, mira, Math.max(40, o.h * 2.2, Math.max(o.w, o.d) * 2), o.h * .6 + 10, o), mira };
  }

  return {
    crear, fase, actualizar, camara: c => yo.camara(c), plano, inserto: (c, ef, on) => COMUN.corte.on(c, ef, on),
    activo: () => tiempo - t0 < 4 || reloj.pendientes > 0,
    mag: v => v >= 1e6 ? `${COMUN.grande(v)} g` : `${COMUN.num(v, 0)} g`,
    // a escala real: la montaña más alta que aguantaría la roca (≈ 8.848 m / g) y el grosor del aire (altura de escala ≈ 8,5 km / g);
    // con el planeta, la presión en el centro (≈ 3,6 millones de atmósferas × g)
    danos: () => {
      const EN = COMUN.EN, n = COMUN.num, d = m => m >= 1000 ? `${n(m / 1000, 1)} km` : m >= 10 ? `${n(m, 0)} m` : m >= .1 ? `${n(m * 100, 0)} cm` : `${n(m * 1000, 0)} mm`;
      if (G >= 7e8) return EN ? 'Planet Earth: a black hole' : 'Planeta Tierra: un agujero negro';
      if (G >= 1024) { const p = 3.6e6 * G; return EN ? `Pressure at the core: ${COMUN.grande(p)} atmospheres` : `Presión en el centro: ${COMUN.grande(p)}${COMUN.DE}atmósferas`; }
      return EN ? `Tallest possible mountain: ${d(8848 / G)} · air ${d(8500 / G)} thick` : `Montaña más alta posible: ${d(8848 / G)} · aire de ${d(8500 / G)}`;
    },
    linea3: v => { const kg = 70 * v, c = COSAS.find(([p]) => p >= kg * .99);
      const t = kg / 1000, peso = kg < 1e4 ? `${COMUN.num(kg, 0)} kg` : t < 1e6 ? (COMUN.EN ? `${COMUN.num(t, 0)} tonnes` : `${COMUN.num(t, 0)} toneladas`) : (COMUN.EN ? `${COMUN.grande(t)} tonnes` : `${COMUN.grande(t)}${COMUN.DE}toneladas`);
      return [COMUN.EN ? `You weigh ${peso}` : `Pesas ${peso}`, v > 1 && c ? (COMUN.EN ? `LIKE ${c[2].toUpperCase()}` : `COMO ${c[1].toUpperCase()}`) : ''];
    },
  };
})();
