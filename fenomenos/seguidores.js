// Seguidores: la avenida se llena con el doble de gente en cada paso y todos gritan BOMBOCLAT a la vez.
// Sonido: N voces iguales y a la misma distancia suman 10·log10(N) dB (+3 dB cada vez que se duplica la gente).
// Un grito a 1 m ≈ 88 dB. El oído nota «el doble de fuerte» cada +10 dB, así que 8.206 personas (+39 dB) suenan ≈ 15 veces más.
// Es el caso ideal (todos igual de cerca del que escucha): en un estadio de verdad la gente está repartida.
// Al arrancar se ve la avenida llena (el gancho) y en el paso 1 se vacía hasta quedar uno solo.
window.FENOMENOS.seguidores = (() => {
  const X0 = 0, Z0 = 200, MAX = 10000, VAR = 6, SEP = .78, GRITO = 88;
  const reloj = COMUN.reloj();
  let quien, mallas = [], puntos = [], n = 0, nAnt = 0, t0 = 0, tiempo = 0, fActual = {}, salto = 0, ondas = [], fuegos = 0;
  const dB = v => GRITO + 10 * Math.log10(Math.max(1, v));
  const mat = new Array(VAR);

  function crear(ctx) {
    const T = ctx.THREE;
    // sitios en la avenida (|x| < 13), del centro hacia fuera; el primero es el protagonista
    for (let x = -13; x <= 13; x += SEP) for (let z = Z0 - 140; z <= Z0 + 140; z += SEP) puntos.push([x + ctx.rr(-.2, .2), z + ctx.rr(-.2, .2)]);
    const d = ([x, z]) => Math.hypot((x - X0) * 1.15, z - Z0);
    puntos.sort((a, b) => d(a) - d(b)); puntos = puntos.slice(1, MAX + 1);
    // la avenida, sin coches ni gente del motor
    for (const o of ctx.objects) if ((o.kind === 'car' || o.kind === 'person') && !o.extra && Math.abs(o.x) < 16 && Math.abs(o.z - Z0) < 160) { o.g.visible = false; o.state = 2; }
    // 6 variantes de persona, cada una un InstancedMesh (una llamada de dibujo por variante)
    for (let k = 0; k < VAR; k++) {
      const geo = COMUN.geoHumano(T, ctx.merge, { n: 6, ropa: [0xe85d4a, 0xf2b134, 0x3b82c4, 0x58b368, 0xf5f5f5, 0x9b59b6][k], pantalon: [0x34495e, 0x1f2a44, 0x6b5b4b][k % 3], piel: [0xe9c3a0, 0xd8a47f, 0xb07a52, 0x8a5a3b][k % 4] });
      const m = new T.InstancedMesh(geo, new T.MeshStandardMaterial({ vertexColors: true, roughness: .8 }), Math.ceil(MAX / VAR) + 1); m.count = 0; m.frustumCulled = false; m.castShadow = true;
      ctx.cityGroup.add(m); mallas.push(m);
    }
    quien = COMUN.heroe(ctx, 0xd8282f); quien.position.set(X0, ctx.GROUND, Z0); quien.rotation.y = Math.PI; ctx.cityGroup.add(quien);
    poner(ctx, 8206, 0);
  }

  // coloca a los n primeros (el que acaba de llegar crece desde 0 durante «crece» segundos)
  let tmp = null; // Object3D reutilizado: no se crean objetos por fotograma
  function poner(ctx, total, e) {
    const T = ctx.THREE; tmp ||= { o: new T.Object3D() };
    const cuenta = new Array(VAR).fill(0), o = tmp.o, sube = total > 64 ? .9 : .5;
    for (let i = 0; i < total - 1 && i < MAX; i++) {
      const [x, z] = puntos[i], k = i % VAR, nuevo = i >= nAnt - 1;
      const s = nuevo ? Math.min(1, Math.max(.01, (e - (i - nAnt) / Math.max(1, total - nAnt) * sube) / .35)) : 1;
      const brinco = salto > 0 ? Math.max(0, Math.sin((salto + (i % 7) * .04) * Math.PI)) * .35 : 0;
      o.position.set(x, ctx.GROUND + brinco, z); o.rotation.set(0, Math.atan2(X0 - x, Z0 - 30 - z), 0); o.scale.setScalar(s); o.updateMatrix();
      mallas[k].setMatrixAt(cuenta[k]++, o.matrix);
    }
    mallas.forEach((m, k) => { m.count = cuenta[k]; m.instanceMatrix.needsUpdate = true; });
  }

  // anillo en el suelo que sale del centro con cada grito
  function onda(ctx, radio) {
    const T = ctx.THREE, m = new T.Mesh(new T.RingGeometry(.9, 1, 64), new T.MeshBasicMaterial({ color: 0xffd23f, transparent: true, opacity: .6, side: T.DoubleSide, depthWrite: false }));
    m.rotation.x = -Math.PI / 2; m.position.set(X0, ctx.GROUND + .1, Z0); m.userData.fenPropio = true; ctx.scene.add(m); ondas.push({ m, radio, t: 0 });
  }

  // grito a coro: más capas cuanta más gente, con tomas distintas y algo desfasadas
  function gritar(ctx, v) {
    const capas = Math.min(7, 1 + Math.floor(Math.log2(v) / 2)), g = Math.min(1, .35 + (dB(v) - GRITO) * .016);
    for (let c = 0; c < capas; c++) {
      const toma = Math.max(0, Math.min(9, Math.round((dB(v) - GRITO) / 4.5) + (c ? Math.round(ctx.rr(-2, 2)) : 0)));
      ctx.sfx('bomboclat/' + String(toma).padStart(2, '0'), g * (c ? .55 : 1), c * ctx.rr(.01, .06), ctx.rr(.94, 1.06));
    }
    if (v >= 256) ctx.sfx('ovacion', Math.min(.8, .2 + (dB(v) - 112) * .04), .5);
  }

  function fase(ctx, k, valor, f) {
    nAnt = k === 1 ? 1 : n; n = Math.round(valor); t0 = tiempo; fActual = f;
    if (k === 1) poner(ctx, 1, 1);
    reloj.luego(.25, () => { gritar(ctx, n); salto = .001; onda(ctx, Math.max(4, Math.sqrt(n) * 1.6)); });
    if (f.fuegos) fuegos = tiempo + .4;
  }

  const COLF = [0xffd23f, 0xff5a5f, 0x5ad1ff, 0x9bff7a, 0xffffff];
  function actualizar(ctx, dt, t) {
    tiempo = t; reloj.tick(t); const e = t - t0;
    if (n && e < 3) poner(ctx, n, e);
    if (salto > 0) { salto += dt * 2.2; if (salto > 1.6) { salto = 0; poner(ctx, n, 9); } }
    quien.userData.andar(0, 0); quien.userData.hablar(e > .25 && e < 1.1 ? .5 + .5 * Math.abs(Math.sin(e * 12)) : 0);
    for (let i = ondas.length - 1; i >= 0; i--) { const o = ondas[i]; o.t += dt; const k = Math.min(1, o.t / 1.4);
      o.m.scale.setScalar(.5 + o.radio * (1 - Math.pow(1 - k, 2))); o.m.material.opacity = .6 * (1 - k);
      if (k >= 1) { ctx.scene.remove(o.m); o.m.geometry.dispose(); o.m.material.dispose(); ondas.splice(i, 1); } }
    // fuegos artificiales sobre la avenida (gracias y meta)
    if (fuegos && t > fuegos) { fuegos = t + ctx.rr(.25, .5);
      const x = X0 + ctx.rr(-30, 30), y = ctx.rr(45, 80), z = Z0 + ctx.rr(-40, 60), c = new ctx.THREE.Color(COLF[Math.floor(ctx.R() * COLF.length)]);
      for (let q = 0; q < 70; q++) { const a = ctx.rr(0, 6.283), b = ctx.rr(-1, 1), v = ctx.rr(10, 18), r = Math.sqrt(1 - b * b);
        ctx.emit(x, y, z, Math.cos(a) * r * v, b * v, Math.sin(a) * r * v, c, ctx.rr(1.2, 2), 3); }
      ctx.sfx('impacto', .12, 0, 1.6); }
  }

  return {
    sinBoom: true,
    crear, fase, actualizar,
    activo: () => tiempo - t0 < 2,
    mag: v => `${COMUN.num(v, 0)} ${v === 1 ? T('persona', 'person') : T('personas', 'people')}`,
    linea3: v => [`${T('Ruido', 'Noise')}: ${COMUN.num(dB(v), 0)} dB`, v > 1 ? T(`Suena ${COMUN.num(Math.pow(2, (dB(v) - GRITO) / 10), 1)} veces más fuerte que uno solo`, `Sounds ${COMUN.num(Math.pow(2, (dB(v) - GRITO) / 10), 1)} times louder than one`) : T('Un grito a 1 metro', 'One shout, 1 metre away')],
    danos: () => T('+3 dB cada vez que se duplica la gente', '+3 dB every time the crowd doubles'),
  };
})();
