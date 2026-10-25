// El puñetazo que se duplica: cada golpe lleva el doble de energía que el anterior, de 150 J (un directo normal)
// a 80.500 millones de julios en el golpe 30, que son 19 toneladas de TNT metidas en un guante.
// El rival pesa 80 kg y sale despedido a v = √(2E/m): 9.600 J ≈ 56 km/h, 9,83 MJ ≈ Mach 1,4,
// 5,03 GJ = 11,2 km/s (velocidad de escape de la Tierra) y 80,5 GJ = 44,9 km/s (se sale del Sistema Solar).
// El vuelo se ve a cámara lenta a partir de 180 m/s: a 45 km/s el rival desaparecería en un fotograma.
// El golpe arrasa la manzana a partir de unos kilos de TNT: radio de 5 psi ≈ 4,7·(kg)^⅓ metros.
// Cifras aproximadas: compruébalas antes de publicar.
window.FENOMENOS.boxeo = (() => {
  const reloj = COMUN.reloj();
  const MASA = 80, CX = 0, CZ = 150, LONA = 1.05, LADO = 3.6; // rival (kg) · centro del ring · alto de la lona · medio lado
  const ANG = .32, VIS = 180;                                 // ángulo de salida (≈18°) y tope de velocidad que se ve en pantalla
  const velocidad = E => Math.sqrt(2 * E / MASA);             // m/s
  const kgTNT = E => E / 4.184e6;
  const alcance = v => v * v * Math.sin(2 * ANG) / 9.8;       // dónde caería sin aire (m)
  let ctx, E = 150, t0 = 0, tiempo = 0, yo = null, rival = null, vuelo = null, onda = null;
  let ring = null, cola = [], edif = [], col = {}, radio = 0, golpe = 0, fuera = false, pegando = 0, sacudida = 0;
  let brazosYo = [], brazosRival = [], espera = 0, lanzar = null;
  const YOX = CX - .85, RVX = CX + .85;   // de pie uno frente al otro, a la distancia de un gancho

  // ---------- el ring ----------
  function montarRing() {
    const T = ctx.THREE, g = new T.Group(), M = (c, r = .8, e = 0) => new T.MeshStandardMaterial({ color: c, roughness: r, emissive: e, emissiveIntensity: e ? 1 : 0 });
    const caja = (w, h, d, x, y, z, m) => { const b = new T.Mesh(new T.BoxGeometry(w, h, d), m); b.position.set(x, y, z); b.castShadow = b.receiveShadow = true; g.add(b); return b; };
    const L = LADO + .4;
    caja(L * 2, .55, L * 2, 0, ctx.GROUND + .5, 0, M(0xb3261e, .9));                       // el cajón de debajo
    const lona = caja(L * 2, .12, L * 2, 0, ctx.GROUND + LONA - .06, 0, M(0x2f6ea8, .95)); // la lona azul
    lona.receiveShadow = true;
    caja(2.2, .13, 2.2, 0, ctx.GROUND + LONA - .055, 0, M(0xe8f2ff, .95));                 // el círculo del centro (cuadrado, que nadie lo mira)
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      const p = new T.Mesh(new T.CylinderGeometry(.11, .11, 2.1, 10), M(0xd8282f, .6));
      p.position.set(sx * LADO, ctx.GROUND + LONA + 1.05, sz * LADO); p.castShadow = true; g.add(p);
      const t = new T.Mesh(new T.SphereGeometry(.16, 10, 8), M(0xf2f2f2, .5)); t.position.copy(p.position); t.position.y += 1.05; g.add(t);
    }
    for (let k = 0; k < 3; k++) {                                                          // las tres cuerdas de cada lado
      const y = ctx.GROUND + LONA + .5 + k * .52, m = M([0xd8282f, 0xf2f2f2, 0x3b6fd8][k], .7);
      caja(LADO * 2, .07, .07, 0, y, -LADO, m); caja(LADO * 2, .07, .07, 0, y, LADO, m);
      caja(.07, .07, LADO * 2, -LADO, y, 0, m); caja(.07, .07, LADO * 2, LADO, y, 0, m);
    }
    for (let k = 0; k < 6; k++) {                                                          // los focos de encima, como los del pabellón
      const f = new T.Mesh(new T.SphereGeometry(.5, 10, 8), M(0xfff6d8, .3, 0xfff0c0));
      f.position.set(-5 + (k % 3) * 5, ctx.GROUND + 13, (k < 3 ? -1 : 1) * 4.5); g.add(f);
    }
    g.position.set(CX, 0, CZ); g.userData.fenPropio = true; ctx.scene.add(g);
    return g;
  }

  // el público pegado al ring y la cola de retadores esperando turno en la esquina
  function montarPublico() {
    const grupos = [[-13, -6, CZ - 16, CZ + 16], [6, 13, CZ - 16, CZ + 16], [-13, 13, CZ - 20, CZ - 8], [-13, 13, CZ + 8, CZ + 20]];
    for (const [x0, x1, z0, z1] of grupos) COMUN.multitud(ctx, 24, x0, x1, z0, z1);
    for (const p of ctx.objects) if (p.kind === 'person' && p.g) {                          // todos mirando al ring
      const dx = CX - p.g.position.x, dz = CZ - p.g.position.z;
      if (dx * dx + dz * dz < 900) p.g.rotation.y = Math.atan2(dx, dz);
    }
    for (let k = 0; k < 14; k++) {                                                          // la cola: el siguiente retador, y el siguiente
      const m = COMUN.persona(ctx), x = CX - LADO - 2.2, z = CZ - 2 - k * 1.1;
      m.position.set(x, ctx.groundAt(x, z), z); m.rotation.y = 0; ctx.cityGroup.add(m); cola.push(m);
    }
  }

  function crear(c) {
    ctx = c; const C = ctx.THREE.Color;
    ring = montarRing();
    // el de la sudadera roja es el que pega: de pie en el ring, mirando a +x (aquí no pasea, así que no es protagonista())
    yo = COMUN.heroe(ctx, 0xd8282f); yo.userData.fenPropio = true;
    yo.position.set(YOX, ctx.GROUND + LONA, CZ); yo.rotation.y = Math.PI / 2; ctx.scene.add(yo);
    rival = COMUN.heroe(ctx, 0x2a9d8f); rival.userData.fenPropio = true;
    rival.position.set(RVX, ctx.GROUND + LONA, CZ); rival.rotation.y = -Math.PI / 2; ctx.scene.add(rival);
    brazosYo = guantes(yo, 0xd8282f); brazosRival = guantes(rival, 0xf2f2f2);
    montarPublico();
    edif = COMUN.edificios(ctx);
    col = { chispa: new C(0xfff0b0), fuego: new C(0xff7a1a), humo: new C(0x4a4440), sudor: new C(0xdff0ff), polvo: new C(0xcfc6b8) };
  }

  // las manos del muñeco (las bolitas de piel al final del brazo) pasan a ser guantes: más gordas y de color.
  // De paso se queda con los pivotes del hombro y el codo, que es lo que hace falta para ponerlo en guardia.
  function guantes(g, color) {
    const T = ctx.THREE, bs = [];
    g.traverse(m => { if (m.isMesh && Math.abs(m.scale.y - .065) < .002 && Math.abs(m.scale.z - .03) < .002) {
      m.material = new T.MeshStandardMaterial({ color, roughness: .55 }); m.scale.set(.09, .11, .08);
      bs.push({ codo: m.parent, hom: m.parent.parent }); } });
    return bs;
  }
  // p = 0: guardia, los dos guantes a la altura de la barbilla · p = 1: el brazo de atrás estirado del todo
  function pose(bs, p) {
    bs.forEach((b, i) => { const k = i === 1 ? p : p * .25;
      b.hom.rotation.x = -1.15 - .4 * k; b.hom.rotation.z = (i ? 1 : -1) * (.12 - .1 * k);
      b.codo.rotation.x = -1.75 + 1.68 * k; });
  }

  // ---------- el golpe ----------
  function fase(c, n, valor, f) {
    E = valor; t0 = tiempo; golpe = n; radio = 0;
    const v = velocidad(E), vv = Math.min(v, VIS);
    espera = .45;                                              // se cuenta con dt: en la primera fase el reloj del juego aún no ha arrancado
    lanzar = () => {                                           // el puñetazo: el de rojo se echa encima y el otro sale disparado
      pegando = 1;
      vuelo = { v: new ctx.THREE.Vector3(Math.cos(ANG) * vv, Math.sin(ANG) * vv, ctx.rr(-.04, .04) * vv), real: v, t: 0, giro: Math.min(16, 2 + v * .08) };
      for (let q = 0; q < 18; q++) ctx.emit(rival.position.x - .4, rival.position.y + 1.4, rival.position.z, ctx.rr(-3, 6), ctx.rr(-1, 4), ctx.rr(-3, 3), ctx.R() < .6 ? col.chispa : col.sudor, ctx.rr(.3, .8), 4);
      COMUN.tono(ctx, 140, 40, .35, 'square', Math.min(.5, .12 + n * .02));
      sacudida = Math.min(2.4, .1 + n * .09);
      // a partir de unos kilos de TNT el golpe ya no es un golpe: es una onda que se lleva la manzana por delante
      const kg = kgTNT(E);
      if (kg >= 2) {
        radio = 4.7 * Math.cbrt(kg);
        onda = { r: 2, max: radio * 1.25, k: 1 };
        for (const o of edif) { const dx = o.x - CX, dz = o.z - CZ, d = Math.hypot(dx, dz);
          if (d > radio || o.state === 2) continue;
          reloj.luego(ctx.rr(.05, .5) + d / 340, () => COMUN.derribar(ctx, o, new ctx.THREE.Vector3(dx / d * 14, 5, dz / d * 14), { polvo: 12, colorPolvo: col.polvo }));
        }
        for (const p of ctx.objects) if (p.kind === 'person' && p.state === 0 && Math.hypot(p.g.position.x - CX, p.g.position.z - CZ) < radio * 1.4) {
          p.state = 1; p.cae = 0; p.caer = ctx.rr(.2, .9);
        }
        COMUN.ruido(ctx, 3.5, 160, Math.min(.8, .2 + n * .02));
      }
    };
    if (f.fuera) fuera = true;                                 // ya no quedan rivales: el ring está vacío
  }

  // el siguiente de la cola entra al ring (y la cola avanza un paso)
  function reponer() {
    if (fuera) { rival.visible = false; return; }
    rival.visible = true; rival.position.set(RVX, ctx.GROUND + LONA, CZ); rival.rotation.set(0, -Math.PI / 2, 0);
    const m = cola.shift(); if (m) { m.visible = false; for (const o of cola) o.position.z += 1.1; }
  }

  function actualizar(c, dt, t) {
    tiempo = t; reloj.tick(t);
    COMUN.corte.tick(ctx, dt);
    sacudida = Math.max(0, sacudida - dt * 2.2); ctx.setShake(sacudida);
    if (espera > 0 && (espera -= dt) <= 0 && lanzar) { const f = lanzar; lanzar = null; f(); }
    // el puñetazo: medio segundo de estirarse y volver a la guardia
    if (pegando > 0) { pegando = Math.max(0, pegando - dt / .45); const k = Math.sin((1 - pegando) * Math.PI);
      yo.position.x = YOX + k * .5; yo.userData.andar(0, 0); pose(brazosYo, k); }
    else { yo.position.x = YOX; yo.userData.andar(0, 0); pose(brazosYo, 0); }
    rival.userData.andar(0, 0); pose(brazosRival, vuelo ? .8 : 0);
    // el rival por los aires: gira, deja estela y va tirando lo que pilla por el camino
    if (vuelo) {
      vuelo.t += dt;
      const p = rival.position;
      p.addScaledVector(vuelo.v, dt); vuelo.v.y -= 9.8 * dt;
      rival.rotation.z -= dt * vuelo.giro; rival.rotation.y -= dt * vuelo.giro * .4;
      if (vuelo.real > 120) for (let q = 0; q < 6; q++)                                     // por encima de Mach 0,35 va dejando fuego
        ctx.emit(p.x - ctx.rr(0, 3), p.y + 1, p.z, ctx.rr(-4, -1), ctx.rr(-1, 2), ctx.rr(-2, 2), ctx.R() < .6 ? col.fuego : col.chispa, ctx.rr(.3, .9), -1.5);
      if (vuelo.real > 60) for (const o of edif) {                                          // lo que se encuentra de frente se cae
        if (o.state === 2) continue;
        if (Math.abs(o.x - p.x) < o.w * .6 + 3 && Math.abs(o.z - p.z) < o.d * .6 + 3 && p.y < o.y0 + o.h)
          COMUN.derribar(ctx, o, new ctx.THREE.Vector3(vuelo.v.x * .12, 4, 0), { polvo: 10, colorPolvo: col.polvo });
      }
      const suelo = ctx.groundAt ? ctx.groundAt(p.x, p.z) : ctx.GROUND;
      if (p.y <= suelo + .1 && vuelo.v.y < 0) {                                             // aterriza entre el público
        p.y = suelo; rival.rotation.set(-Math.PI / 2, rival.rotation.y, 0); vuelo = null;
        for (let q = 0; q < 14; q++) ctx.emit(p.x, p.y + .3, p.z, ctx.rr(-2, 2), ctx.rr(1, 4), ctx.rr(-2, 2), col.polvo, ctx.rr(.6, 1.2), 3);
        reloj.luego(1.3, reponer);
      } else if (vuelo.t > 4.5 || p.x > 1500 || p.y > 900) { vuelo = null; rival.visible = false; reloj.luego(1.2, reponer); }
    }
    // la onda del golpe: un anillo que se abre por el suelo
    if (onda) { onda.r += dt * 320; onda.k = Math.max(0, 1 - onda.r / onda.max);
      const n = Math.min(26, 6 + Math.floor(onda.max / 8));
      for (let q = 0; q < n; q++) { const a = ctx.rr(0, 6.283);
        ctx.emit(CX + Math.cos(a) * onda.r, ctx.GROUND + .4, CZ + Math.sin(a) * onda.r, Math.cos(a) * 12, ctx.rr(2, 9), Math.sin(a) * 12, ctx.R() < .4 ? col.fuego : col.polvo, ctx.rr(.8, 1.8), 1.5); }
      if (onda.r > onda.max) onda = null; }
    for (const p of ctx.objects) if (p.kind === 'person' && p.state === 1 && p.caer) {      // el público que se lleva la onda
      p.cae = Math.min(1, p.cae + dt * 1.5 / p.caer); p.g.rotation.x = -Math.PI / 2 * p.cae; }
  }

  // ---------- HUD ----------
  // tercera línea: a qué velocidad sale el rival y, cuando ya es un explosivo, cuánto TNT es el golpe
  const COSAS = [[0, 'un empujón en el metro', 'a shove on the tube'], [3, 'una bofetada de las buenas', 'a proper slap'],
    [6, 'un balonazo en la cara', 'a football to the face'], [11, 'una coz de caballo', 'a horse kick'],
    [20, 'un choque en bicicleta', 'crashing a bike'], [40, 'un atropello en ciudad', 'being hit by a city car'],
    [90, 'un coche en autopista', 'a car on the motorway'], [200, 'un tren de alta velocidad', 'a high-speed train']];
  function velTexto(v) {
    if (v >= 2000) return `${COMUN.num(v / 1000, 1)} km/s`;
    if (v >= 343) return `Mach ${COMUN.num(v / 343, 1)}`;
    return `${COMUN.num(v * 3.6, 0)} km/h`;
  }

  return {
    crear, fase, actualizar, sinBoom: true,
    camara: c => c,                                          // nadie se mueve del ring: las cámaras de las fases valen tal cual
    inserto: (c, ef, on) => COMUN.corte.on(c, ef, on),
    // 'rival': adonde ha ido a parar el rival · 'cara': la cara del que pega · 'cola': los que esperan turno
    // nunca devuelve null: el motor haría new Vector3(...undefined) y reventaría a media fase
    plano: (c, fi) => {
      const fijo = fi.pos ? { pos: fi.pos, mira: fi.mira } : null;
      if (fi.plano === 'rival' && rival.visible) { const p = rival.position;
        return { pos: [p.x - 5.5, Math.max(ctx.GROUND + 2.2, p.y + 1.8), p.z + 6.5], mira: [p.x, p.y + .9, p.z] }; }
      if (fi.plano === 'cara') { const p = yo.position;
        return { pos: [p.x + 2.4, ctx.GROUND + LONA + 1.75, p.z + 1.1], mira: [p.x, ctx.GROUND + LONA + 1.5, p.z] }; }
      if (fi.plano === 'cola') { const m = cola.find(o => o.visible);
        if (!m) return fijo;
        return { pos: [m.position.x - 3.4, ctx.GROUND + 2.3, m.position.z - 2.2], mira: [m.position.x, ctx.GROUND + 1.2, m.position.z + 2] }; }
      return fijo;
    },
    activo: () => tiempo - t0 < 3.5 || !!vuelo || !!onda || reloj.pendientes > 0,
    mag: v => `${COMUN.grande(v)}${v >= 1e6 ? COMUN.DE : ' '}J`,
    linea3: v => {
      const EN = COMUN.EN, vel = velocidad(v), kg = kgTNT(v);
      const l1 = (EN ? 'LAUNCH SPEED: ' : 'SALE DESPEDIDO A ') + velTexto(vel);
      if (kg >= .5) return [l1, (EN ? '= ' : '= ') + COMUN.textoTNT(kg / 1000).toUpperCase()];
      const c = COSAS.filter(([x]) => vel >= x).pop();
      return [l1, (EN ? 'LIKE ' : 'COMO ') + (EN ? c[2] : c[1]).toUpperCase()];
    },
    danos: () => {
      const EN = COMUN.EN, v = velocidad(E), kg = kgTNT(E);
      if (kg >= 2) { const r = 4.7 * Math.cbrt(kg);                       // radio de 5 psi: lo que queda plano
        return EN ? `Everything flattened within ${COMUN.num(r, 0)} m · ${COMUN.num(ctx.caidos, 0)} buildings down`
          : `Todo plano en ${COMUN.num(r, 0)} m · ${COMUN.num(ctx.caidos, 0)} edificios caídos`; }
      if (v >= 11186) return EN ? 'Past escape velocity · he is not coming back' : 'Supera la velocidad de escape · ya no vuelve';
      const a = alcance(v), d = a < 1000 ? `${COMUN.num(a, a < 10 ? 1 : 0)} m` : `${COMUN.num(a / 1000, 1)} km`;
      return EN ? `He lands ${d} away` : `Cae a ${d} de aquí`;
    },
  };
})();
