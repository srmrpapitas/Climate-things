// Fenómeno «ola»: un muro de agua que entra desde el mar y arrasa lo que queda por debajo de su altura.
// En cada paso la misma ola crece hasta la altura nueva y avanza tierra adentro (escenarios/ola.js).
// Se registra en window.FENOMENOS.ola; el motor (index.html) lo elige con escenario.tipo = 'ola'.
(function () {
  // Perfil en unidades de la altura h: [avance respecto al frente, altura]. Rompiendo (PB) y ya asentada (PF).
  const PB0 = [[-3.2, 1], [-1.4, 1.03], [-.6, 1.1], [-.1, 1.12], [.3, 1.02], [.5, .84], [.42, .72], [.18, .7], [.04, .52], [0, .3], [.12, .08], [.45, -.02], [.45, -1.6]];
  const PF0 = [[-3.2, 1], [-1.4, 1], [-.6, 1], [-.1, 1], [.5, .96], [1.2, .86], [2, .72], [2.8, .56], [3.6, .4], [4.4, .26], [5.2, .13], [6, .02], [6, -1.6]];
  function chaikin(P) { const out = [P[0]]; // suaviza el perfil: más polígonos en la cresta
    for (let i = 0; i < P.length - 1; i++) { const a = P[i], b = P[i + 1];
      out.push([a[0] * .75 + b[0] * .25, a[1] * .75 + b[1] * .25], [a[0] * .25 + b[0] * .75, a[1] * .25 + b[1] * .75]); }
    out.push(P[P.length - 1]); return out; }
  const PB = chaikin(PB0), PF = chaikin(PF0);

  let ctx, THREE, waves = [], w = null;

  class Wave {
    constructor(h, f) {
      const { lerp, clamp, hash } = ctx;
      this.h0 = h; this.H = h; this.cfg = f; this.N = 170; this.time = 0; this.speed = 0; this.b = 1;
      this.zf = -Math.max(90, h * 40); this.back = this.zf - Math.max(30000, h * 60);
      this.crecer(h, f);
      const P = PB.length + 1, nv = this.N * (P - 1) * 6;
      this.geo = new THREE.BufferGeometry(); this.pos = new Float32Array(nv * 3);
      this.geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
      const col = new Float32Array(nv * 3), c = new THREE.Color(), deep = new THREE.Color(0x15557f), light = new THREE.Color(0x3aa6c8), foam = new THREE.Color(0xeaf9ff);
      let o = 0;
      for (let j = 0; j < this.N; j++) for (let i = 0; i < P - 1; i++) {
        const a = i === 0 ? [-9, 1] : PB[i - 1], b = PB[Math.min(i, PB.length - 1)], u = (a[0] + b[0]) / 2, v = (a[1] + b[1]) / 2;
        if (u > -.7 && v > .95) c.copy(light).lerp(foam, clamp((u + .7) / .9, 0, 1));          // cresta con espuma
        else if (u > -.05 && v > .45 && v < .95) c.copy(foam).lerp(light, .35);                 // labio que rompe
        else c.copy(deep).lerp(light, clamp(v, 0, 1) * .9);
        c.multiplyScalar(.93 + hash(j, i) * .14);
        for (let k = 0; k < 6; k++) { col[o++] = c.r; col[o++] = c.g; col[o++] = c.b; }
      }
      this.geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
      this.mesh = new THREE.Mesh(this.geo, new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: .28, metalness: .05, side: THREE.DoubleSide, transparent: true, opacity: .86 }));
      this.mesh.frustumCulled = false; this.mesh.renderOrder = 2; ctx.scene.add(this.mesh); this.build();
    }
    // cada paso la misma ola crece hasta la nueva altura y avanza hasta f.alcance (plano continuo, sin volver a salir del mar)
    crecer(h, f) { this.cfg = f; this.hFrom = this.h0; this.hTo = h; this.zStart = this.zf; this.z1 = Math.max(f.alcance, this.zf);
      this.t = 0; this.T = f.duracion ?? Math.max(1.5, (ctx.escenario.ritmo || 2.8) * .85); }
    get width() { return Math.max(6000, this.h0 * 420); }
    zoff(x) { const h = this.h0; return Math.sin(x / (h * 9) + this.time * .6) * h * .25 + Math.sin(x / (h * 31) + 1.3) * h * .9; }
    vert(i, j, out) { // i: punto del perfil (0 = fondo lejano), j: columna
      const x = -this.width / 2 + this.width * j / this.N, h = this.h0, lerp = ctx.lerp;
      if (i === 0) { out[0] = x; out[1] = this.H; out[2] = this.back; return; }
      const a = PB[i - 1], b = PF[i - 1], u = lerp(b[0], a[0], this.b), v = lerp(b[1], a[1], this.b);
      const wob = v > .5 ? Math.sin(j * 1.9 + i * 2.3 + this.time * 2.2) * .022 + Math.sin(j * .7 - this.time * 1.3) * .018 : 0;
      out[0] = x; out[1] = (v + wob) * this.H; out[2] = this.zf + this.zoff(x) + u * h * (1 + (1 - this.b) * .8);
    }
    build() {
      const P = PB.length + 1, A = [0, 0, 0], B = [0, 0, 0], C = [0, 0, 0], D = [0, 0, 0]; let o = 0; const p = this.pos;
      const put = v => { p[o++] = v[0]; p[o++] = v[1]; p[o++] = v[2]; };
      for (let j = 0; j < this.N; j++) for (let i = 0; i < P - 1; i++) {
        this.vert(i, j, A); this.vert(i + 1, j, B); this.vert(i, j + 1, C); this.vert(i + 1, j + 1, D);
        put(A); put(B); put(C); put(B); put(D); put(C);
      }
      this.geo.attributes.position.needsUpdate = true; this.geo.computeVertexNormals();
    }
    get moving() { return this.t < this.T; }
    update(dt) {
      const { smooth, lerp } = ctx; this.time += dt; const prev = this.zf;
      if (this.t < this.T) { this.t = Math.min(this.T, this.t + dt); const k = this.t / this.T;
        this.zf = lerp(this.zStart, this.z1, 1 - Math.pow(1 - k, 2.2));
        this.h0 = this.H = Math.exp(lerp(Math.log(this.hFrom), Math.log(this.hTo), smooth(0, .55, k)));
        this.b = 1 - smooth(.75, 1, k) * .3; }
      else { this.zf += dt * this.h0 * .05; this.b = Math.max(.6, this.b - dt * .2); }
      this.back = Math.min(this.back, this.zf - Math.max(30000, this.h0 * 60));
      this.speed = (this.zf - prev) / Math.max(dt, 1e-4); this.build();
      // el agua refleja el mismo cielo que el mar
      const env = ctx.seaNear?.material?.envMap; if (env && this.mesh.material.envMap !== env) { this.mesh.material.envMap = env; this.mesh.material.envMapIntensity = .8; this.mesh.material.needsUpdate = true; }
    }
    dispose() { ctx.scene.remove(this.mesh); this.geo.dispose(); this.mesh.material.dispose(); }
  }

  function hit(o) {
    const { rr, R, emit, C } = ctx, depth = w.H - o.y0; if (depth <= .4) return;
    const s = Math.max(w.speed, 30), hs = w.h0 / 20, vel = new THREE.Vector3(rr(-2, 2), rr(1, 4), s * rr(.4, .8));
    if (o.kind === 'building') {
      const ratio = depth / o.h;
      for (let k = 0; k < Math.min(60, 8 + o.w * .4); k++) emit(o.x + rr(-o.w, o.w) * .5, o.y0 + rr(1, Math.min(depth, o.h)), o.z - o.d / 2, rr(-4, 4) * hs, rr(2, 9) * hs, rr(4, 18) * hs, C.glass, rr(1, 2.2), 9.8 * hs);
      if (ratio >= 1.2 || (o.h < 13 && ratio > .45)) ctx.derribar(o, vel, { escala: hs });
      else if (ratio > .55 && o.state < 1) { o.state = 1; o.tilt = rr(.08, .2); }
    } else if (!o.state) {
      ctx.derribar(o, vel);
      if (o.kind === 'car') for (let k = 0; k < 4; k++) emit(o.x, o.y0 + 1, o.z, rr(-2, 2), rr(2, 6), rr(2, 8), C.glass, 1, 9.8);
    }
  }
  function checkHits(dt) {
    const { rr, R, emit, C, clamp } = ctx;
    for (const o of ctx.objects) {
      if (o.state === 2 || (o.hitH && w.H < o.hitH * 1.25 + .3)) continue; // se vuelve a mirar cuando el agua ha subido
      if (w.zf + w.zoff(o.x) >= o.z - o.d / 2 && w.H - o.y0 > .4) { o.hitH = w.H; hit(o); }
    }
    const m0 = new THREE.Matrix4().makeScale(0, 0, 0);
    for (const { im, list } of ctx.inst) { let ch = false;
      for (let i = 0; i < list.length; i++) { const p = list[i]; if (!p || p.dead) continue;
        if (w.zf + w.zoff(p.x) >= p.z && w.H > p.y + p.h * .5) { p.dead = true; im.setMatrixAt(i, m0); ch = true;
          if (p.h > 1 && R() < .3) emit(p.x, p.y + p.h * .5, p.z, rr(-3, 3) * w.h0 / 40, rr(3, 9) * w.h0 / 40, rr(4, 12) * w.h0 / 40, R() < .5 ? C.dust : C.foam, rr(1, 2.5), 9.8 * w.h0 / 40); } }
      if (ch) im.instanceMatrix.needsUpdate = true; }
    // espuma en la cresta, cerca de lo que ve la cámara
    const n = Math.round(clamp(60 * dt * 60, 10, 90) * clamp(w.h0 / 8, .15, 1)), spread = clamp(ctx.camDist * 1.4, 200, w.width * .45), hs = w.h0 / 20;
    for (let k = 0; k < n; k++) { const x = ctx.camTgt.x + rr(-spread, spread), zf = w.zf + w.zoff(x);
      emit(x, w.H * rr(.85, 1.12), zf + w.h0 * rr(.2, .5), rr(-2, 2) * hs, rr(3, 10) * hs, rr(5, 14) * hs + w.speed * .25, R() < .6 ? C.foam : C.spray, rr(.6, 1.4), 9.8 * hs); }
  }

  window.FENOMENOS = window.FENOMENOS || {};
  window.FENOMENOS.ola = {
    sinBoom: true,
    crear(c) { ctx = c; THREE = c.THREE; },
    fase(c, n, valor, f) { if (!w) { w = new Wave(valor, f); waves.push(w); } else w.crecer(valor, f); },
    actualizar(c, dt) {
      if (!w) return;
      w.update(dt);
      if (w.t < w.T || w.speed > 1) checkHits(dt);
      // a pie de calle la cámara huye de la ola
      if (w.t < w.T && ctx.camPos.y < w.h0 * .5) { const d = w.zf + w.h0 * 7 - ctx.camPos.z; if (d > 0) ctx.pushCamera(0, 0, d); }
      for (const p of ctx.people) if (p.state === 0) { if (!p.run && w.h0 >= 1.5 && w.zf > p.z - Math.max(60, w.h0 * 25)) p.run = 1;
        if (p.run) { p.ph += dt * 12; p.g.rotation.y = 0; p.g.position.z += p.speed * dt; p.z = p.g.position.z; p.g.position.y = ctx.groundAt(p.g.position.x, p.z) + Math.abs(Math.sin(p.ph)) * .15; } }
      ctx.setShake(w.t < w.T && w.h0 > 3 ? Math.min(w.h0 * .006, ctx.camDist * .004) * Math.max(0, 1 - Math.abs(w.zf - ctx.camPos.z) / (w.h0 * 25 + 200)) : 0);
    },
    activo() { return !!w && w.t < w.T; },
    // altura: con decimales por debajo de 10 m
    mag(h) { return `${ctx.fmt(h, h < 10 && h % 1 ? 1 : 0)} m`; },
    // energía potencial de la ola sobre la costa: ½ · ρ · g · h² · área, en toneladas de TNT (1 t = 4,184·10⁹ J)
    tnt(h) { const e = ctx.escenario.energia || { costa_m: 10000, fondo_m: 1000 }; return .5 * 1000 * 9.81 * h * h * e.costa_m * e.fondo_m / 4.184e9; },
    // corriente que arrastra los restos: altura del agua y velocidad hacia tierra en ese punto
    corriente(x, z) { return w && z < w.zf ? { y: w.H, vz: w.t < w.T ? w.speed : 0 } : null; },
  };
})();
