// Meteorito: en cada fase cae una roca el doble de grande (diámetro en metros) sobre el centro de la ciudad.
// Energía: roca de 3.000 kg/m³ a 20 km/s, E = ½·m·v². Hasta unos 20 m explotan en el aire; a partir de ahí llegan al suelo.
// Cifras aproximadas: compruébalas antes de publicar.
window.FENOMENOS.meteorito = (() => {
  const reloj = COMUN.reloj();
  let ctx, D = 1, t0 = 0, tiempo = 0, edif = [], planeta = null, yo = null, roca = null, cayendo = null;
  const efectos = [], DIR = [.1, -.7, -.7], IMPACTO = { x: 0, z: 650 };
  let cieloObj = 0x9fd3f0, polvoObj = 0, polvo = 0, brasaObj = 0, brasa = 0, fogon = null;
  const col = {};

  function crear(c) {
    ctx = c; const T = ctx.THREE;
    yo = COMUN.protagonista(ctx, { x: -1, z: 130, vel: .5 }); // mira hacia el centro, por donde cae
    COMUN.materiales(ctx);
    edif = COMUN.edificios(ctx);
    for (const [k, v] of Object.entries({ fuego: 0xff7a1a, amarillo: 0xffd25a, humo: 0x5a5048, polvo: 0xa08a70, cristal: 0xd8f4ff, roca: 0x6f5a48 })) col[k] = new T.Color(v);
    // la roca: piedra oscura con una capa incandescente que brilla
    const g = new T.Group();
    const piedra = new T.Mesh(new T.IcosahedronGeometry(1, 1), new T.MeshStandardMaterial({ color: 0x4a3c32, flatShading: true, roughness: 1, emissive: 0xff5a10, emissiveIntensity: .35 }));
    const halo = new T.Mesh(new T.SphereGeometry(1.6, 24, 16), new T.MeshBasicMaterial({ color: 0xffb060, transparent: true, opacity: .45, blending: T.AdditiveBlending, depthWrite: false, fog: false }));
    g.add(piedra, halo); g.visible = false; g.userData.fenPropio = true; ctx.scene.add(g); roca = { g, halo };
    // fogonazo del impacto (en la ciudad y, al final, sobre el planeta)
    // bola de luz: brilla más en el centro y se difumina hacia el borde (clamp para no dar NaN en el iPhone)
    fogon = new T.Mesh(new T.SphereGeometry(1, 32, 20), new T.ShaderMaterial({ uniforms: { opacity: { value: 0 } }, transparent: true, blending: T.AdditiveBlending, depthWrite: false, fog: false,
      vertexShader: 'varying vec3 vN; varying vec3 vV; void main() { vec4 p = modelViewMatrix * vec4(position, 1.0); vN = normalMatrix * normal; vV = -p.xyz; gl_Position = projectionMatrix * p; }',
      fragmentShader: 'uniform float opacity; varying vec3 vN; varying vec3 vV; void main() { float c = clamp(dot(normalize(vN), normalize(vV)), 0.0, 1.0); float a = clamp(pow(c, 1.6) * opacity, 0.0, 1.0); gl_FragColor = vec4(mix(vec3(1.0, .45, .1), vec3(1.0, .82, .5), c) * a, a); }' }));
    fogon.visible = false; fogon.userData = { fenPropio: true, sobrePlaneta: true }; ctx.scene.add(fogon);
  }

  // radio que arrasa la onda expansiva, en metros (a ojo: crece con la energía, E ∝ D³ → R ∝ D)
  const radio = d => d < 32 ? 0 : d < 64 ? 220 : d < 128 ? 700 : d < 256 ? 1800 : 1e9;
  const alturaExplosion = d => d <= 4 ? 300 : d <= 16 ? 150 : 0; // en realidad a varios km; más bajo para que se vea en el plano

  function fase(c, n, valor, f) {
    D = valor; t0 = tiempo;
    if (f.planeta) { planeta = COMUN.planeta(ctx); cieloObj = 0x05070c; }
    // la roca entra en diagonal; tarda más cuanto más lejos se ve
    const enPlaneta = !!planeta, dur = enPlaneta ? 2.2 : 1.6, h = alturaExplosion(D);
    const fin = enPlaneta ? { x: 0, y: 0, z: 0 } : { x: IMPACTO.x, y: ctx.GROUND + h, z: IMPACTO.z };
    const L = enPlaneta ? Math.max(4e6, D * 2.5) : 3000, ini = { x: fin.x - DIR[0] * L, y: fin.y - DIR[1] * L, z: fin.z - DIR[2] * L };
    const visible = enPlaneta ? Math.max(9e4, D / 2) : Math.max(D / 2, 6 + D * .5);
    roca.g.scale.setScalar(visible); roca.g.position.set(ini.x, ini.y, ini.z); roca.g.visible = true;
    cayendo = { ini, fin, dur, t: 0, h };
    sfx('whoosh', .5); if (D >= 64) sfx('riser', .45);
    Object.assign(yo.est, { cabeza: -.35, lento: D >= 8 ? 0 : 1, hablar: D >= 2 && D < 64 ? .45 : 0 });
  }
  const sfx = (n, g, t = 0) => ctx.sfx && ctx.sfx(n, g, t);

  function impacto() {
    const T = ctx.THREE, aire = cayendo.h > 0, enPlaneta = !!planeta, p = cayendo.fin;
    roca.g.visible = false;
    // fogonazo: en el aire, una bola de luz; en el suelo, una cúpula de fuego
    const tam = enPlaneta ? Math.min(1.5e6, 1e5 + D * 60) : aire ? 20 + D * 12 : Math.min(5000, 30 + D * 5);
    fogon.position.set(p.x, p.y, p.z); fogon.visible = true; efectos.push({ tipo: 'fogon', t: 0, dur: enPlaneta ? 3 : 1.6, tam });
    COMUN.ruido(ctx, 3 + Math.log2(D) * .3, 120, Math.min(.9, .25 + Math.log2(D) * .05));
    COMUN.tono(ctx, 60, 25, 3, 'sawtooth', Math.min(.3, .05 + Math.log2(D) * .02));
    sfx('impacto', Math.min(1, .35 + Math.log2(D) * .05));
    if (enPlaneta) { brasaObj = Math.min(1, (Math.log2(D) - 9) / 4); polvoObj = 1; if (D >= 2048) sfx('planeta', .5, .3);
      // casi otra Tierra: el planeta se parte en dos
      if (D >= 1e6) { planeta.partir(.14); COMUN.estallarPlaneta(ctx, 1600); COMUN.ruido(ctx, 6, 120, .9); COMUN.tono(ctx, 70, 20, 5, 'sawtooth', .35); }
      return; }
    ctx.setShake(Math.min(4, .05 + D * .02));
    ctx.rumble(Math.min(.6, .1 + Math.log2(D) * .04));
    // a partir de 8 m llegan trozos al suelo; desde 32 m, cráter y onda expansiva
    if (!aire || D >= 8) {
      const rc = aire ? 3 : Math.max(8, D * 8);
      const crater = new T.Mesh(new T.CircleGeometry(1, 48), new T.MeshStandardMaterial({ color: 0x2e2620, roughness: 1, polygonOffset: true, polygonOffsetFactor: -2 }));
      crater.rotation.x = -Math.PI / 2; crater.position.set(IMPACTO.x, ctx.GROUND + .2, IMPACTO.z); crater.scale.setScalar(.01); crater.userData.fenPropio = true; ctx.scene.add(crater);
      const borde = new T.Mesh(new T.RingGeometry(.9, 1.15, 48), new T.MeshStandardMaterial({ color: 0x8a7258, roughness: 1, side: T.DoubleSide, polygonOffset: true, polygonOffsetFactor: -3 }));
      borde.rotation.x = -Math.PI / 2; borde.position.set(IMPACTO.x, ctx.GROUND + .35, IMPACTO.z); borde.scale.setScalar(.01); borde.userData.fenPropio = true; ctx.scene.add(borde);
      efectos.push({ tipo: 'crater', t: 0, crater, borde, r: rc });
      for (let q = 0; q < Math.min(400, 30 + D * 4); q++) { const a = ctx.rr(0, 6.28), v = ctx.rr(.3, 1) * Math.min(300, 20 + D * 2);
        ctx.emit(IMPACTO.x, ctx.GROUND + 2, IMPACTO.z, Math.cos(a) * v * .6, v, Math.sin(a) * v * .6, ctx.R() < .5 ? col.roca : col.fuego, ctx.rr(2, 4), 9.8); }
    }
    const R = radio(D);
    if (R) {
      const onda = new T.Mesh(new T.RingGeometry(.86, 1, 96), new T.MeshBasicMaterial({ color: 0xfff2d8, transparent: true, opacity: .8, side: T.DoubleSide, blending: T.AdditiveBlending, depthWrite: false }));
      onda.rotation.x = -Math.PI / 2; onda.position.set(IMPACTO.x, ctx.GROUND + 3, IMPACTO.z); onda.userData.fenPropio = true; ctx.scene.add(onda);
      const Rv = Math.min(R, 6000);
      efectos.push({ tipo: 'onda', t: 0, dur: 1.5 + Rv / 2500, onda, r: Rv });
      for (const o of edif) { if (o.state === 2) continue; const d = Math.hypot(o.x - IMPACTO.x, o.z - IMPACTO.z); if (d > R) continue;
        const dx = (o.x - IMPACTO.x) / (d || 1), dz = (o.z - IMPACTO.z) / (d || 1), fuerza = Math.max(.2, 1 - d / Math.min(R, 6000));
        reloj.luego(Math.min(4, d / 1500 + ctx.rr(0, .3)), () => COMUN.derribar(ctx, o, new T.Vector3(dx * 30 * fuerza, -Math.min(o.h, 300) * .1, dz * 30 * fuerza), { polvo: o.h > 60 ? 24 : 10, colorPolvo: col.polvo })); }
      for (const p of ctx.people) if (p.state === 0 && Math.hypot(p.x - IMPACTO.x, p.z - IMPACTO.z) < R) { p.state = 1; p.caer = ctx.rr(.3, 1); p.cae = 0; }
      if (D >= 64 && !yo.est.caer) reloj.luego(Math.min(3, 530 / 1500), () => { yo.est.caer = true; });
      polvoObj = Math.min(1, (Math.log2(D) - 4) / 4); sfx('derrumbe', .7, .4);
    }
    // cristales rotos en toda la ciudad desde 16 m (la onda de un airburst como el de Cheliábinsk)
    if (D >= 16 && D < 256) { sfx('cristales', .5, .6); for (let q = 0; q < 160; q++) { const o = edif[Math.floor(ctx.R() * edif.length)]; if (!o || o.state === 2) continue;
      ctx.emit(o.x + ctx.rr(-.5, .5) * o.w, o.y0 + ctx.rr(0, o.h), o.z + ctx.rr(-.5, .5) * o.d, ctx.rr(-4, 4), ctx.rr(0, 4), ctx.rr(-4, 4), col.cristal, ctx.rr(1, 2), 9.8); } }
    if (D >= 4 && D < 64) sfx('alarmas', .35, .8);
    cieloObj = D >= 256 ? 0x3a2a22 : D >= 128 ? 0x7a5a44 : D >= 64 ? 0xb09078 : 0x9fd3f0;
  }

  function actualizar(c, dt, t) {
    tiempo = t; reloj.tick(t); yo.actualizar(dt, t);
    COMUN.corte.tick(ctx, dt);
    const k = 1 - Math.exp(-dt * 1.6); polvo += (polvoObj - polvo) * k; brasa += (brasaObj - brasa) * k;
    // la roca en caída, con su estela de fuego y humo
    if (cayendo && roca.g.visible) {
      cayendo.t += dt; const u = Math.min(1, cayendo.t / cayendo.dur), e = u * u, { ini, fin } = cayendo;
      roca.g.position.set(ini.x + (fin.x - ini.x) * e, ini.y + (fin.y - ini.y) * e, ini.z + (fin.z - ini.z) * e);
      roca.g.rotation.x += dt * 2; roca.halo.material.opacity = .35 + .25 * Math.sin(t * 40);
      const s = roca.g.scale.x, P = roca.g.position;
      if (!planeta) for (let q = 0; q < 8; q++) ctx.emit(P.x + ctx.rr(-s, s) * .5, P.y + ctx.rr(-s, s) * .5, P.z + ctx.rr(-s, s) * .5, ctx.rr(-3, 3), ctx.rr(-3, 3), ctx.rr(-3, 3),
        q < 5 ? (ctx.R() < .5 ? col.fuego : col.amarillo) : col.humo, ctx.rr(.8, 2), 0);
      if (u >= 1) impacto();
    }
    for (let i = efectos.length - 1; i >= 0; i--) { const ef = efectos[i]; ef.t += dt;
      if (ef.tipo === 'fogon') { const q = Math.min(1, ef.t / ef.dur); fogon.scale.setScalar(ef.tam * (.2 + Math.pow(q, .4))); fogon.material.uniforms.opacity.value = Math.pow(1 - q, 2) * 1.2; if (q >= 1) { fogon.visible = false; efectos.splice(i, 1); } }
      else if (ef.tipo === 'crater') { const q = 1 - Math.pow(1 - Math.min(1, ef.t / .8), 3); ef.crater.scale.setScalar(.01 + ef.r * q); ef.borde.scale.setScalar(.01 + ef.r * q); }
      else if (ef.tipo === 'onda') { const q = Math.min(1, ef.t / ef.dur); ef.onda.scale.setScalar(5 + ef.r * Math.pow(q, .6)); ef.onda.material.opacity = .8 * (1 - q);
        if (q >= 1) { ef.onda.parent && ef.onda.parent.remove(ef.onda); efectos.splice(i, 1); } }
    }
    for (const p of ctx.people) if (p.state === 1 && p.caer) { p.cae = Math.min(1, p.cae + dt * 1.6 / p.caer); p.g.rotation.x = -Math.PI / 2 * p.cae; }
    // columna de polvo y fuego sobre el cráter mientras dura
    if (polvo > .05 && !planeta) for (let q = 0; q < 6 * polvo; q++) ctx.emit(IMPACTO.x + ctx.rr(-1, 1) * D * 4, ctx.GROUND + ctx.rr(0, 30), IMPACTO.z + ctx.rr(-1, 1) * D * 4,
      ctx.rr(-4, 4), ctx.rr(10, 40) * (1 + D / 64), ctx.rr(-4, 4), ctx.R() < .3 ? col.fuego : col.humo, ctx.rr(3, 6), -1);
    if (!ctx.corte) ctx.skyT.set(cieloObj);
    if (!planeta && t - t0 > 1.8) ctx.setShake(0);
    if (planeta) { planeta.update(dt); planeta.teñir(0x3a3430, brasa * .85, 0xff5a1a, brasa * .12); planeta.nubes.material.color.set(0xffffff).lerp(col.polvo, polvo * .8); }
  }

  return {
    crear, fase, actualizar, sinBoom: true, camara: c => yo.camara(c), inserto: (ctx, ef, on) => COMUN.corte.on(ctx, ef, on),
    // daños a escala real (los de la ciudad del juego son de juguete). Hasta ~25 m explotan en el aire, muy alto.
    // Al llegar al suelo: cráter ≈ 20 veces el diámetro, arrasa (≈ 5 psi) 4,7 m·kg^⅓, cristales rotos (≈ 0,5 psi) 24 m·kg^⅓,
    // ≈ 1.000 edificios por km² si cae en una ciudad
    danos: () => {
      const n = COMUN.num, EN = COMUN.EN, d = m => m >= 1000 ? `${n(m / 1000, m < 1e4 ? 1 : 0)} km` : `${n(m, 0)} m`;
      const kg = .5 * 3000 * Math.PI / 6 * D ** 3 * 2e4 ** 2 / COMUN.TNT_J * 1000, R5 = 4.7 * Math.cbrt(kg), R1 = 24 * Math.cbrt(kg);
      if (D >= 1e6) return EN ? 'Planet Earth: split in two' : 'Planeta Tierra: partido en dos';
      if (D <= 8) { const h = D <= 1 ? 55 : D <= 2 ? 50 : D <= 4 ? 42 : 35; return EN ? `Explodes ${h} km up · the ground is untouched` : `Explota a ${h} km de altura · el suelo, intacto`; }
      if (D <= 32) { const h = D <= 16 ? 27 : 12; return EN ? `Explodes ${h} km up · glass breaks up to ${d(R1)} away` : `Explota a ${h} km de altura · cristales rotos hasta ${d(R1)}`; }
      const ed = Math.PI * (R5 / 1000) ** 2 * 1000, zona = R5 < 3e4 ? (EN ? ` (≈ ${ed >= 1e6 ? COMUN.grande(ed) + ' ' : n(ed, 0) + ' '}buildings)` : ` (≈ ${ed >= 1e6 ? COMUN.grande(ed) + COMUN.DE : n(ed, 0) + ' '}edificios)`) : '';
      return EN ? `${d(D * 20)} crater · flattens ${d(R5)} around${zona}` : `Cráter de ${d(D * 20)} · arrasa ${d(R5)} a la redonda${zona}`;
    },
    activo: () => tiempo - t0 < 4.5 || reloj.pendientes > 0 || (planeta && planeta.split > 0 && planeta.split < .9),
    tnt: d => .5 * 3000 * Math.PI / 6 * d ** 3 * 2e4 ** 2 / COMUN.TNT_J,
    mag: d => d >= 1000 ? `${COMUN.num(d / 1000, d % 1000 ? 1 : 0)} km` : `${COMUN.num(d, 0)} m`,
  };
})();
