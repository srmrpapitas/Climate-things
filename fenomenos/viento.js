// Viento: la velocidad del viento se duplica fase a fase (sopla de oeste a este, hacia x positivo).
// Línea del HUD: cuánto empuja (presión dinámica ½·ρ·v², en kg por m²) y a qué se parece asomarse a esa velocidad.
// Al final supera la velocidad de escape (40.300 km/h) y el aire se va al espacio. Cifras aproximadas: compruébalas antes de publicar.
window.FENOMENOS.viento = (() => {
  const reloj = COMUN.reloj();
  let ctx, V = 0, t0 = 0, tiempo = 0, todo = [], edif = [], col = {}, yo = null, vuela = null, planeta = null, cola = null;
  const ms = kmh => kmh / 3.6;
  const est = { cola: 0, aire: 1, pelado: 0 }, obj = { ...est };
  // a qué velocidad va cada cosa por la que asomar la cabeza
  const COSAS = [[5, 'una persona andando', 'someone walking'], [10, 'una bici tranquila', 'a lazy bike ride'], [20, 'un patinete', 'a scooter'],
    [40, 'un autobús en la ciudad', 'a city bus'], [80, 'un coche en carretera', 'a car on the road'], [160, 'un tren rápido', 'a fast train'],
    [320, 'un Fórmula 1', 'a Formula 1 car'], [640, 'un avión despegando', 'a plane taking off'], [1280, 'un caza', 'a fighter jet'],
    [2560, 'una bala', 'a bullet'], [5120, 'un misil', 'a missile'], [10240, 'un meteorito', 'a meteor'],
    [20480, 'una nave volviendo del espacio', 'a capsule coming back from space'], [40960, 'un cohete que se escapa de la Tierra', 'a rocket leaving Earth']];

  // [número, efecto en castellano, en inglés, hasta km/h]
  const BEAUFORT = [[0, 'calma', 'calm', 1], [1, 'ventolina: el humo se inclina', 'light air: smoke drifts', 5], [2, 'flojito: se mueven las hojas', 'light breeze: leaves rustle', 11],
    [3, 'flojo: ondean las banderas', 'gentle breeze: flags flap', 19], [4, 'bonancible: vuelan papeles y polvo', 'moderate breeze: dust and paper fly', 28],
    [5, 'fresquito: se mecen los árboles', 'fresh breeze: small trees sway', 38], [6, 'fresco: cuesta usar el paraguas', 'strong breeze: umbrellas are hard to use', 49],
    [7, 'frescachón: cuesta andar', 'near gale: hard to walk', 61], [8, 'temporal: se rompen ramas', 'gale: twigs break off', 74],
    [9, 'temporal fuerte: vuelan tejas', 'strong gale: roof tiles fly', 88], [10, 'temporal duro: caen árboles', 'storm: trees are uprooted', 102],
    [11, 'temporal muy duro: daños por todas partes', 'violent storm: damage everywhere', 117]];
  const HURACAN = [[1, 'tejados y cables dañados', 'roofs and power lines damaged', 153], [2, 'arranca árboles y tejados', 'trees and roofs torn off', 177],
    [3, 'casas destrozadas, días sin luz', 'homes wrecked, days without power', 208], [4, 'casas sin tejado ni paredes', 'homes lose roofs and walls', 251],
    [5, 'casas destruidas, zona inhabitable durante meses', 'homes destroyed, area unlivable for months', 1e9]];
  // velocidad (km/h) a la que cae o sale volando cada cosa
  function aguante(o) {
    if (o.kind === 'person') return ctx.rr(110, 160);
    if (o.kind === 'tree' || o.kind === 'palm') return ctx.rr(140, 230);
    if (o.kind === 'car') return ctx.rr(230, 320);
    if (o.kind === 'boat') return ctx.rr(150, 250);
    if (o.kind !== 'building') return 200;
    if (o.landmark) return o.h > 300 ? ctx.rr(1500, 2500) : ctx.rr(900, 1600);
    if (o.h > 60) return ctx.rr(900, 1280);
    if (o.h > 13) return ctx.rr(400, 640);
    return ctx.rr(260, 400);
  }

  function crear(c) {
    ctx = c; const C = ctx.THREE.Color;
    yo = COMUN.protagonista(ctx); // el chico de la sudadera: se inclina contra el viento y a 160 km/h sale volando
    COMUN.materiales(ctx);
    // unos cuantos coches aparcados en la calle del protagonista, para verlos salir volando
    ctx.objects.filter(o => o.kind === 'car').slice(0, 10).forEach((o, k) => { o.x = k % 2 ? 4.2 : -4.2; o.z = 140 + k * 6; o.g.position.set(o.x, ctx.GROUND, o.z); o.g.rotation.y = k % 2 ? 0 : Math.PI; });
    todo = ctx.objects.filter(o => o.g); edif = COMUN.edificios(ctx);
    for (const o of todo) { o.aguante = aguante(o); o.rz0 = o.g.rotation.z; }
    col = { raya: new C(0xffffff), arena: new C(0xe6d49c), tierra: new C(0x6e5a44), hoja: new C(0x5aa84f), aire: new C(0xbfe4ff), mar: new C(0x5aa0d8) };
  }

  // la estela de aire que deja la Tierra: elipsoides que brillan más en el centro y se difuminan en el borde (clamp: sin NaN en el iPhone)
  function crearCola() {
    const T = ctx.THREE, R = COMUN.RT, g = new T.Group(), capas = [];
    for (let k = 0; k < 3; k++) {
      const m = new T.Mesh(new T.SphereGeometry(R, 40, 24), new T.ShaderMaterial({ uniforms: { opacity: { value: 0 } }, transparent: true, blending: T.AdditiveBlending, depthWrite: false, fog: false,
        vertexShader: 'varying vec3 vN; varying vec3 vV; void main() { vec4 p = modelViewMatrix * vec4(position, 1.0); vN = normalMatrix * normal; vV = -p.xyz; gl_Position = projectionMatrix * p; }',
        fragmentShader: 'uniform float opacity; varying vec3 vN; varying vec3 vV; void main() { float c = clamp(dot(normalize(vN), normalize(vV)), 0.0, 1.0); float a = clamp(pow(c, 2.0) * opacity, 0.0, 1.0); gl_FragColor = vec4(vec3(.65, .85, 1.0) * a, a); }' }));
      g.add(m); capas.push(m);
    }
    g.position.set(0, -R, 0); g.userData = { fenPropio: true, sobrePlaneta: true }; ctx.scene.add(g);
    return capas;
  }

  function fase(c, n, valor, f) {
    V = valor; t0 = tiempo;
    // el protagonista: anda normal, luego se inclina y va más despacio, y a 160 km/h el viento se lo lleva
    Object.assign(yo.est, { lento: V >= 80 ? .2 : V >= 40 ? .6 : 1, cabeza: V >= 40 ? .3 : 0, hablar: V === 20 || V === 80 ? .4 : 0 });
    if (V >= 160 && !vuela) reloj.luego(.8, () => { const p = yo.g.position; vuela = { x: p.x, y: p.y, z: p.z, vx: 2, vy: 6, w: 0 }; });
    // lo que no aguanta sale volando en el sentido del viento, en los primeros segundos de la fase
    for (const o of todo) {
      if (o.state === 2 || o.aguante > V) continue;
      reloj.luego(ctx.rr(.3, 2.8), () => {
        if (o.state === 2) return;
        const v = Math.min(ms(V), 200), lift = o.kind === 'building' ? ctx.rr(0, .05) : ctx.rr(.1, .35);
        const vel = new ctx.THREE.Vector3(v * ctx.rr(.25, .6), v * lift, ctx.rr(-.08, .08) * v);
        if (o.kind === 'building') COMUN.derribar(ctx, o, vel, { polvo: 14 }); else ctx.derribar(o, vel, { float: false });
      });
    }
    // sombrillas, farolas y árboles de la calle (instanciados) desaparecen arrancados
    if (V >= 160) { const m0 = new ctx.THREE.Matrix4().makeScale(0, 0, 0), lim = V >= 640 ? 20 : V >= 320 ? 8 : 3;
      for (const { im, list } of ctx.inst) { let ch = false;
        list.forEach((p, i) => { if (p && !p.dead && p.h <= lim && p.h > .5) { p.dead = true; im.setMatrixAt(i, m0); ch = true; } });
        if (ch) im.instanceMatrix.needsUpdate = true; } }
    if (f.planeta && !planeta) { planeta = COMUN.planeta(ctx); cola = crearCola(); }
    // en el planeta: la atmósfera se estira como la cola de un cometa, el suelo se pela y al final el aire se escapa
    obj.cola = V >= 40960 ? 2.5 : V >= 20480 ? 1.2 : V >= 10240 ? .5 : V >= 5120 ? .2 : 0;
    obj.pelado = V >= 10240 ? 1 : V >= 5120 ? .35 : 0;
    obj.aire = V >= 40960 ? 0 : 1;
    // a partir de la velocidad del sonido (1.235 km/h), cada ráfaga es un estampido
    if (V > 1235 && !planeta) ctx.sfx && ctx.sfx('impacto', .5, .4);
    if (V >= 320 && !planeta) ctx.sfx && ctx.sfx('derrumbe', .5, .8);
    COMUN.ruido(ctx, 5, 250 + Math.min(V, 2000) * 1.5, Math.min(.7, .1 + n * .05), 0, 'bandpass');
  }

  function actualizar(c, dt, t) {
    tiempo = t; reloj.tick(t); COMUN.corte.tick(ctx, dt); const v = ms(V);
    const k = 1 - Math.exp(-dt * 1.2); for (const key in est) est[key] += (obj[key] - est[key]) * k;
    const racha = .5 + .5 * Math.sin(t * 2.3) * Math.sin(t * .9 + 1);
    // el protagonista: inclinado contra el viento y, cuando ya no aguanta, por los aires dando vueltas
    yo.actualizar(dt, t);
    if (vuela) { vuela.vx += dt * 6; vuela.vy -= dt * 2.5; vuela.x += vuela.vx * dt; vuela.y += Math.max(-2, vuela.vy) * dt; vuela.w += dt * 5;
      yo.g.position.set(vuela.x, Math.max(ctx.GROUND, vuela.y), vuela.z); yo.g.rotation.z = -vuela.w; yo.g.rotation.x = vuela.w * .4; }
    else yo.g.rotation.z = -Math.min(.25, V / 320) * (.7 + .3 * racha);
    // los que aún aguantan se inclinan y tiemblan con las ráfagas
    for (const o of todo) {
      if (o.state === 2 || o.kind === 'building' || o.kind === 'boat') continue;
      const q = Math.min(1, V / o.aguante);
      o.g.rotation.z = (o.rz0 || 0) - q * q * (o.kind === 'person' ? .5 : .35) * (.7 + .3 * racha) - Math.sin(t * 9 + o.x) * .02 * q;
    }
    for (const o of edif) if (o.state === 0 && V > o.aguante * .7) { o.state = 1; o.tilt = ctx.rr(.02, .08); }
    if (planeta) {
      planeta.update(dt);
      cola.forEach((m, i) => { const L = 1 + est.cola * (1 + i * 1.3), w = 1.05 - i * .12; m.scale.set(L, w, w); m.position.x = COMUN.RT * (L - .9);
        m.material.uniforms.opacity.value = Math.min(1, est.cola) * (.5 - i * .12) * (1 + (1 - est.aire) * .6); });
      planeta.atm.material.opacity = .18 * est.aire + .1 * est.cola * est.aire;
      planeta.nubes.rotation.y += dt * Math.min(.6, V / 20000); planeta.nubes.material.opacity = .62 * Math.max(0, 1 - est.cola * .6);
      planeta.teñir(0x8a7258, est.pelado * .75, 0x000000, 0);
      // el aire (y al final el mar) sale disparado hacia el lado del viento
      const R = COMUN.RT, nq = V >= 40960 ? 40 : V >= 20480 ? 18 : 6;
      for (let q = 0; q < nq; q++) { const a = ctx.rr(0, 6.283), u = ctx.rr(-1, 1), r = Math.sqrt(1 - u * u), x = r * Math.cos(a), y = u, z = r * Math.sin(a);
        const s = R * ctx.rr(1.01, 1.05), vv = R * ctx.rr(.15, .4) * (1 + est.cola);
        ctx.emit(x * s, -R + y * s, z * s, vv, y * vv * .1, z * vv * .1, q % 4 === 0 && V >= 20480 ? col.mar : col.aire, ctx.rr(2, 4), 0); }
      ctx.setShake(0); return;
    }
    // rayas de viento, arena y hojas cerca de lo que ve la cámara
    const r = Math.max(40, Math.min(3000, ctx.camDist * .9)), cx = ctx.camTgt.x, cz = ctx.camTgt.z;
    const n = Math.round(Math.min(40, 6 + V / 40));
    for (let q = 0; q < n; q++) {
      const y = ctx.GROUND + ctx.rr(.5, r * .4);
      ctx.emit(cx - r + ctx.rr(-r * .3, r * .5), y, cz + ctx.rr(-r, r), Math.min(v, 300) * ctx.rr(.8, 1.2) + r * .3, ctx.rr(-1, 1), ctx.rr(-1, 1), col.raya, ctx.rr(.6, 1.4), 0);
    }
    if (V >= 40) for (let q = 0; q < Math.min(30, V / 20); q++)
      ctx.emit(cx + ctx.rr(-r, r), ctx.GROUND + ctx.rr(0, 3 + Math.min(V, 2560) / 50), cz + ctx.rr(-r, r), Math.min(v, 300) * ctx.rr(.5, 1), ctx.rr(0, 3), ctx.rr(-1, 1), col.arena, ctx.rr(1, 2), 2);
    if (V >= 20 && V < 640) for (let q = 0; q < 6; q++) ctx.emit(cx + ctx.rr(-r, r), ctx.GROUND + ctx.rr(2, 20), cz + ctx.rr(-r, r), Math.min(v, 120) * ctx.rr(.4, .9), ctx.rr(-2, 4), ctx.rr(-3, 3), col.hoja, ctx.rr(1.5, 3), 1);
    if (V >= 2560) for (let q = 0; q < 50; q++) ctx.emit(cx + ctx.rr(-r, r), ctx.GROUND + ctx.rr(0, 40), cz + ctx.rr(-r, r), 300 * ctx.rr(.4, .8), ctx.rr(2, 20), ctx.rr(-5, 5), col.tierra, ctx.rr(1.5, 3), 3);
    if (!ctx.corte) ctx.skyT.set(V >= 1280 ? 0x8a7d6a : V >= 320 ? 0x7b8794 : V >= 160 ? 0x8a99a8 : V >= 80 ? 0xa3b6c6 : 0x9fd3f0);
    ctx.setShake(V >= 320 ? Math.min(ctx.camDist * .004, V / 800) * (.6 + .4 * racha) : 0);
  }

  return {
    crear, fase, actualizar, sinBoom: true, camara: c => yo.camara(c), inserto: (ctx, ef, on) => COMUN.corte.on(ctx, ef, on),
    // qué rompe el viento a esa velocidad: escala de Beaufort, huracanes de Saffir-Simpson y, más allá, la presión del aire comparada con bucear
    danos: () => {
      const EN = COMUN.EN, n = COMUN.num;
      if (V <= 117) { const [b, es, en] = BEAUFORT.find(([, , , m]) => V <= m); return EN ? `Beaufort ${b} · ${en}` : `Beaufort ${b} · ${es}`; }
      if (V < 330) { const [c, es, en] = HURACAN.find(([, , , m]) => V <= m); return EN ? `Category ${c} hurricane · ${en}` : `Huracán de categoría ${c} · ${es}`; }
      if (V < 1235) return EN ? 'Stronger than any hurricane or tornado measured · no house left standing' : 'Más que cualquier huracán o tornado medido · no queda casa en pie';
      const m = .5 * 1.2 * ms(V) ** 2 / (1025 * 9.81);
      if (V < 2560) return EN ? 'Supersonic: a sonic boom in every gust · skyscrapers fall' : 'Supersónico: un estampido en cada ráfaga · caen los rascacielos';
      return EN ? `Pressure like ${n(m, 0)} m under the sea` : `Presión como a ${n(m, 0)} m bajo el mar`;
    },
    activo: () => tiempo - t0 < 4 || reloj.pendientes > 0,
    mag: v => `${COMUN.num(v, 0)} km/h`,
    linea3: v => { const kg = .5 * 1.2 * ms(v) ** 2 / 9.81, c = COSAS.find(([s]) => s >= v * .99), x = kg < 10 ? COMUN.num(kg, 1) : COMUN.num(kg, 0);
      return [COMUN.EN ? `Pushes like ${x} kg per m²` : `Empuja como ${x} kg por m²`, c ? (COMUN.EN ? `LIKE LEANING OUT OF ${c[2].toUpperCase()}` : `COMO ASOMARTE A ${c[1].toUpperCase()}`) : ''];
    },
  };
})();
