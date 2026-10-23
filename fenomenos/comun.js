// Utilidades compartidas por los fenómenos (terremoto, decibelios, calor, frío, CO2...).
// Cada fenómeno se registra en window.FENOMENOS[tipo] = { crear, fase, actualizar, activo, tnt | hud, mag, danos }.
// El motor (index.html) les pasa un ctx con la escena, la ciudad y sus herramientas.
window.FENOMENOS = window.FENOMENOS || {};
window.COMUN = (() => {
  const TNT_J = 4.184e9; // 1 t de TNT en julios
  const RT = 6.371e6;    // radio de la Tierra (m)

  // ---------- números y textos en el idioma elegido (window.LANG, ver lista.js) ----------
  const EN = window.LANG === 'en';
  function num(n, dec) {
    if (dec === undefined) dec = n < 10 ? 1 : 0;
    let s = n.toFixed(dec); let [i, d] = s.split('.');
    i = i.replace(/\B(?=(\d{3})+(?!\d))/g, EN ? ',' : '.');
    return d && +d !== 0 ? i + (EN ? '.' : ',') + d.replace(/0+$/, '') : i;
  }
  // 1,2 millones · 3,4 billones (escala larga española) · 1.2 million · 3.4 trillion (escala corta inglesa)
  function grande(n) {
    const u = EN ? [[1e18, 'quintillion'], [1e15, 'quadrillion'], [1e12, 'trillion'], [1e9, 'billion'], [1e6, 'million'], [1e3, 'thousand']]
      : [[1e18, 'trillones'], [1e12, 'billones'], [1e9, 'mil millones'], [1e6, 'millones'], [1e3, 'mil']];
    for (const [v, t] of u) if (n >= v) { const x = n / v; return `${num(x, x < 10 ? 1 : 0)} ${!EN && x < 1.05 && v >= 1e6 && t !== 'mil millones' ? t.replace(/ones$/, 'ón') : t}`; }
    return num(n, 0);
  }
  const DE = EN ? ' ' : ' de '; // «2 millones de coches» / «2 million cars»
  const uno = n => n < 1.05 && n > .95;
  // toneladas de TNT → texto con la unidad más cómoda (de microgramos a gigatones)
  function textoTNT(t) {
    const de = EN ? ' of TNT' : ' de TNT';
    if (t <= 0) return '0 g' + de;
    const g = t * 1e6;
    if (g < 1e-6) return (EN ? 'almost 0 g' : 'casi 0 g') + de;
    if (g < 1e-3) return `${num(g * 1e6)} µg${de}`;
    if (g < 1) return `${num(g * 1e3)} mg${de}`;
    if (g < 1000) return `${num(g)} g${de}`;
    if (t < 1) return `${num(g / 1000)} kg${de}`;
    if (t < 1000) return `${num(t)} ${EN ? (uno(t) ? 'tonne' : 'tonnes') : (uno(t) ? 'tonelada' : 'toneladas')}${de}`;
    if (t < 1e6) return `${num(t / 1e3)} ${EN ? 'kilotons' : 'kilotones'}${de}`;
    if (t < 1e9) return `${num(t / 1e6)} ${EN ? 'megatons' : 'megatones'}${de}`;
    if (t < 1e12) return `${num(t / 1e9)} ${EN ? 'gigatons' : 'gigatones'}${de}`;
    return t / 1e9 < 1e6 ? `${num(t / 1e9, 0)} ${EN ? 'gigatons' : 'gigatones'}${de}` : `${grande(t / 1e9)}${DE}${EN ? 'gigatons' : 'gigatones'}${de}`;
  }
  function comparaTNT(t) {
    if (t >= 50e6) { const n = t / 50e6, nom = EN ? (uno(n) ? 'Tsar Bomba' : 'Tsar Bombas') : (uno(n) ? 'Tsar Bomba' : 'Tsar Bombas'); return n >= 1e4 ? `${grande(n)}${DE}Tsar Bombas` : `${num(n)} ${nom}`; }
    if (t >= 1500) { const n = t / 15000; return EN ? `${num(n)} Hiroshima ${uno(n) ? 'bomb' : 'bombs'}` : `${num(n)} ${uno(n) ? 'bomba' : 'bombas'} de Hiroshima`; }
    if (t >= 1) { const n = t / .0042; return `${n >= 1e4 ? grande(n) : num(n, 0)} ${EN ? 'hand grenades' : 'granadas de mano'}`; } // ≈ 4,2 kg de explosivo por granada
    return '';
  }

  // ---------- color de toda la escena ----------
  // Guarda el color original de cada material y permite teñirlo todo a la vez (calor, frío...).
  let mats = null;
  function materiales(ctx) {
    if (mats) return mats;
    mats = new Map();
    ctx.scene.traverse(o => {
      if (!o.isMesh || o.userData.fenPropio) return;
      for (const m of [].concat(o.material)) if (m && m.color && !mats.has(m))
        mats.set(m, { c: m.color.clone(), e: m.emissive ? m.emissive.clone() : null });
    });
    return mats;
  }
  // k: 0 = color original, 1 = color destino. ke: brillo propio (emisivo) hacia `emisivo`.
  function tintar(ctx, color, k, emisivo, ke = 0) {
    const T = ctx.THREE, dst = new T.Color(color), em = emisivo != null ? new T.Color(emisivo) : null;
    for (const [m, o] of materiales(ctx)) {
      m.color.copy(o.c).lerp(dst, k);
      if (m.emissive && o.e) { m.emissive.copy(o.e); if (em) m.emissive.lerp(em, ke); }
    }
  }

  // ---------- derrumbes ----------
  // Derriba con el motor (rompe en trozos y cuenta los caídos) y deja un montón de escombros.
  function derribar(ctx, o, vel, opts = {}) {
    if (o.state === 2) return false;
    const T = ctx.THREE;
    ctx.derribar(o, vel || new T.Vector3(), { float: false, ...opts });
    if (o.kind === 'building' && opts.escombros !== false) {
      const m = new T.Mesh(ctx.BOX, ctx.mat(opts.colorEscombros ?? 0x8f8678));
      const hh = Math.min(o.h * .12, 26) + 1.5;
      m.scale.set(o.w * 1.1, hh, o.d * 1.1); m.position.set(o.x, o.y0 + hh / 2 - .5, o.z); m.rotation.y = ctx.rr(-.2, .2);
      ctx.cityGroup.add(m); o.escombros = m;
    }
    for (let k = 0; k < (opts.polvo ?? 0); k++)
      ctx.emit(o.x + ctx.rr(-.5, .5) * (o.w || 3), o.y0 + ctx.rr(0, o.h * .8), o.z + ctx.rr(-.5, .5) * (o.d || 3),
        ctx.rr(-6, 6), ctx.rr(2, 10), ctx.rr(-6, 6), opts.colorPolvo || ctx.C.dust, ctx.rr(1.8, 3.5), 3);
    return true;
  }
  function edificios(ctx) { return ctx.objects.filter(o => o.kind === 'building'); }

  // ---------- planeta Tierra (para los finales vistos desde el espacio) ----------
  // Dos hemisferios low poly que se pueden separar, y un núcleo incandescente dentro.
  function hash3(x, y, z) { const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return n - Math.floor(n); }
  function ruido3(x, y, z) {
    const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z), xf = x - xi, yf = y - yi, zf = z - zi;
    const s = t => t * t * (3 - 2 * t), u = s(xf), v = s(yf), w = s(zf), L = (a, b, t) => a + (b - a) * t;
    const h = (a, b, c) => hash3(xi + a, yi + b, zi + c);
    return L(L(L(h(0, 0, 0), h(1, 0, 0), u), L(h(0, 1, 0), h(1, 1, 0), u), v), L(L(h(0, 0, 1), h(1, 0, 1), u), L(h(0, 1, 1), h(1, 1, 1), u), v), w);
  }
  function tierra(x, y, z) { let s = 0, a = .5, f = 1.6; for (let i = 0; i < 4; i++) { s += a * ruido3(x * f + 7, y * f + 3, z * f + 11); f *= 2.1; a *= .5; } return s / .9375; }
  let planetaObj = null;
  function planeta(ctx) {
    if (planetaObj) return planetaObj;
    const T = ctx.THREE, g = new T.Group(); g.position.set(0, -RT, 0); g.visible = false; g.userData.fenPropio = true;
    const cOc = new T.Color(0x2f7fc0), cOc2 = new T.Color(0x23679f), cLand = new T.Color(0x6aa94f), cDes = new T.Color(0xc9b47a), cHie = new T.Color(0xf2f6fa), c = new T.Color();
    const halves = [];
    for (let s = 0; s < 2; s++) {
      const geo = new T.SphereGeometry(RT, 56, 36, s * Math.PI, Math.PI).toNonIndexed();
      const p = geo.attributes.position, col = new Float32Array(p.count * 3);
      for (let i = 0; i < p.count; i += 3) {
        const x = (p.getX(i) + p.getX(i + 1) + p.getX(i + 2)) / 3 / RT, y = (p.getY(i) + p.getY(i + 1) + p.getY(i + 2)) / 3 / RT, z = (p.getZ(i) + p.getZ(i + 1) + p.getZ(i + 2)) / 3 / RT;
        const n = tierra(x, y, z), lat = Math.abs(y);
        if (lat > .95 || (lat > .88 && n > .5)) c.copy(cHie); else if (n > .53) c.copy(n > .66 || lat < .3 && n > .6 ? cDes : cLand); else c.copy(cOc).lerp(cOc2, (.53 - n) * 3);
        c.multiplyScalar(.93 + hash3(i, 1, 2) * .12);
        for (let k = 0; k < 3; k++) { col[(i + k) * 3] = c.r; col[(i + k) * 3 + 1] = c.g; col[(i + k) * 3 + 2] = c.b; }
      }
      geo.setAttribute('color', new T.BufferAttribute(col, 3)); geo.computeVertexNormals();
      const m = new T.Mesh(geo, new T.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: .9, emissive: 0x000000 }));
      m.rotation.x = -1.05; // gira la esfera (sobre el eje del corte) para que la ciudad no caiga en el casquete polar
      // cara del corte: magma
      const cut = new T.Mesh(new T.CircleGeometry(RT * .995, 40), new T.MeshStandardMaterial({ color: 0xff6a1a, emissive: 0xff3b00, emissiveIntensity: .9, flatShading: true, side: T.DoubleSide }));
      cut.rotation.y = Math.PI / 2;
      const h = new T.Group(); h.add(m, cut); g.add(h); halves.push({ h, m, dir: s === 0 ? 1 : -1 });
    }
    const core = new T.Mesh(new T.IcosahedronGeometry(RT * .55, 2), new T.MeshBasicMaterial({ color: 0xffd27a }));
    g.add(core);
    // halo de atmósfera
    const atm = new T.Mesh(new T.SphereGeometry(RT * 1.025, 48, 32), new T.MeshBasicMaterial({ color: 0x9fd3ff, transparent: true, opacity: .18, side: T.BackSide, depthWrite: false }));
    g.add(atm);
    // nubes: trozos sueltos de una esfera algo mayor, blancos y semitransparentes
    const geoN = new T.SphereGeometry(RT * 1.012, 48, 30).toNonIndexed(), pN = geoN.attributes.position, keep = [];
    for (let i = 0; i < pN.count; i += 3) { const x = pN.getX(i) / RT, y = pN.getY(i) / RT, z = pN.getZ(i) / RT;
      if (tierra(x * 1.7 + 3, y * 1.7, z * 1.7 - 2) > .56) for (let k = 0; k < 3; k++) keep.push(pN.getX(i + k), pN.getY(i + k), pN.getZ(i + k)); }
    const geoNub = new T.BufferGeometry(); geoNub.setAttribute('position', new T.Float32BufferAttribute(keep, 3)); geoNub.computeVertexNormals();
    const nubes = new T.Mesh(geoNub, new T.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: .62, flatShading: true, roughness: 1, depthWrite: false }));
    g.add(nubes);
    // estrellas alrededor (solo se ven cuando el planeta está en pantalla)
    const est = new Float32Array(1800 * 3);
    for (let k = 0; k < 1800; k++) { const u = Math.random() * 2 - 1, a = Math.random() * 6.283, r = Math.sqrt(1 - u * u), d = 4e8;
      est[k * 3] = r * Math.cos(a) * d; est[k * 3 + 1] = u * d; est[k * 3 + 2] = r * Math.sin(a) * d; }
    const geoE = new T.BufferGeometry(); geoE.setAttribute('position', new T.BufferAttribute(est, 3));
    const estrellas = new T.Points(geoE, new T.PointsMaterial({ color: 0xffffff, size: 1.6, sizeAttenuation: false, fog: false }));
    estrellas.frustumCulled = false; g.add(estrellas);
    // trozos de roca para cuando revienta, y un fogonazo
    const trozos = [];
    const fogonazo = new T.Mesh(new T.SphereGeometry(RT, 32, 20), new T.MeshBasicMaterial({ color: 0xfff6dc, transparent: true, opacity: 0, depthWrite: false, blending: T.AdditiveBlending, fog: false }));
    fogonazo.visible = false; g.add(fogonazo); let flash = -1;
    ctx.scene.add(g);
    let split = 0, splitV = 0, ocultos = null, forzado = false;
    planetaObj = {
      g, halves, core, atm, nubes, trozos,
      // el planeta aparece cuando la cámara se aleja lo bastante; el resto de la escena se oculta
      update(dt) {
        const lejos = forzado || ctx.camera.position.distanceTo(g.position) > RT + 6e5;
        if (lejos && !g.visible) { g.visible = true; ocultos = [];
          for (const ch of ctx.scene.children) if (ch !== g && ch.visible && !ch.isLight && !ch.isPoints && !ch.userData.sobrePlaneta) { ch.visible = false; ocultos.push(ch); } }
        if (splitV) { split = Math.min(1, split + dt * splitV); const e = 1 - Math.pow(1 - split, 2);
          for (const hf of halves) { hf.h.position.x = hf.dir * e * RT * .9; hf.h.rotation.z = hf.dir * e * .5; hf.h.rotation.y = hf.dir * e * .3; }
          atm.material.opacity = .18 * (1 - e); core.scale.setScalar(1 + e * .25); nubes.material.opacity = .62 * (1 - e); }
        nubes.rotation.y += dt * .01;
        for (const t of trozos) { t.m.position.addScaledVector(t.v, dt); t.m.rotation.x += t.w * dt; t.m.rotation.y += t.w * .7 * dt; }
        if (flash >= 0) { flash += dt; const k = flash / 1.6; fogonazo.visible = k < 1; fogonazo.scale.setScalar(1 + k * 2.2); fogonazo.material.opacity = Math.max(0, 1 - k) * .95; }
      },
      // revienta: fogonazo blanco y n trozos de corteza que salen girando
      reventar(n = 70) {
        flash = 0;
        const cs = [0x8a6a4c, 0x6f5a48, 0xff7a22, 0xc65a1e, 0x5a8a3c];
        for (let k = 0; k < n; k++) { const u = ctx.rr(-1, 1), a = ctx.rr(0, 6.283), r = Math.sqrt(1 - u * u), d = new T.Vector3(r * Math.cos(a), u, r * Math.sin(a));
          const m = new T.Mesh(new T.IcosahedronGeometry(1, 0), new T.MeshStandardMaterial({ color: cs[k % cs.length], flatShading: true, emissive: k % 5 === 2 || k % 5 === 3 ? 0xff4a10 : 0x000000, emissiveIntensity: .6 }));
          m.scale.set(ctx.rr(.03, .11), ctx.rr(.02, .07), ctx.rr(.03, .1)).multiplyScalar(RT); m.position.copy(d).multiplyScalar(RT * ctx.rr(.6, 1));
          g.add(m); trozos.push({ m, v: d.multiplyScalar(ctx.rr(.6e6, 2.4e6)), w: ctx.rr(-1.5, 1.5) }); }
      },
      // separa la Tierra en dos (vel: fracción por segundo)
      partir(vel = .16) { splitV = vel; },
      mostrar() { forzado = true; },
      // color de toda la superficie (calor, hielo)
      teñir(color, k, emisivo, ke = 0) {
        for (const hf of halves) { const m = hf.m.material; m.color.set(0xffffff).lerp(new T.Color(color), k); if (emisivo != null) m.emissive.set(emisivo).multiplyScalar(ke); }
      },
      get split() { return split; },
    };
    return planetaObj;
  }
  // fragmentos que salen despedidos del planeta
  function estallarPlaneta(ctx, n = 1400, color = 0xffa040) {
    const T = ctx.THREE, c1 = new T.Color(color), c2 = new T.Color(0x6f5a48);
    for (let k = 0; k < n; k++) {
      const u = ctx.rr(-1, 1), a = ctx.rr(0, Math.PI * 2), r = Math.sqrt(1 - u * u), dx = r * Math.cos(a), dz = r * Math.sin(a), dy = u;
      const v = ctx.rr(.3e6, 2.2e6);
      ctx.emit(dx * RT, -RT + dy * RT, dz * RT, dx * v, dy * v, dz * v, ctx.R() < .5 ? c1 : c2, ctx.rr(4, 9), 0);
    }
  }

  // ---------- gente ----------
  // Grupo de personas extra cerca de la cámara (las del motor están repartidas por la ciudad).
  function multitud(ctx, n, x0, x1, z0, z1, opts = {}) {
    const T = ctx.THREE, list = [];
    const cols = [0xe85d4a, 0xf2b134, 0x3b82c4, 0x58b368, 0xf5f5f5, 0x9b59b6, 0x2d3436, 0xf28db2];
    for (let k = 0; k < n; k++) {
      const x = ctx.rr(x0, x1), z = ctx.rr(z0, z1);
      const m = persona(ctx, cols[Math.floor(ctx.R() * cols.length)]);
      m.position.set(x, ctx.groundAt(x, z), z); m.rotation.y = ctx.R() * 6; ctx.cityGroup.add(m);
      const p = { kind: 'person', g: m, x, z, y0: m.position.y, h: 1.7, w: .5, d: .5, state: 0, float: true, run: 0, speed: ctx.rr(3, 5.5), ph: ctx.R() * 6, extra: true,
        andar: opts.andar ? ctx.rr(.6, 1.3) : 0, dir: ctx.R() * 6.28, caer: 0 };
      list.push(p); ctx.objects.push(p);
    }
    return list;
  }
  // figura sin cara: piernas, cuerpo y cabeza
  function persona(ctx, color) {
    const T = ctx.THREE, g = new T.Group();
    const parte = (c, sx, sy, sz, y) => { const m = new T.Mesh(ctx.BOX, ctx.mat(c)); m.scale.set(sx, sy, sz); m.position.y = y; g.add(m); return m; };
    parte(0x3b4250, .45, .75, .28, .38); parte(color, .52, .7, .32, 1.1); g.userData.cabeza = parte(0xf1c9a5, .3, .3, .3, 1.62);
    return g;
  }
  // protagonista con más detalle (como el del clip de referencia): pelo, barba, brazos y piernas que se mueven al andar.
  // userData: cabeza, boca y andar(fase, amplitud) para animar el paso.
  function heroe(ctx, color = 0xd8282f) {
    const T = ctx.THREE, g = new T.Group();
    const caja = (padre, c, sx, sy, sz, x, y, z) => { const m = new T.Mesh(ctx.BOX, ctx.mat(c)); m.scale.set(sx, sy, sz); m.position.set(x, y, z); m.castShadow = true; padre.add(m); return m; };
    const piv = (x, y) => { const p = new T.Group(); p.position.set(x, y, 0); g.add(p); return p; };
    const PIEL = 0xe0b48e, PELO = 0x4a2f1f, PANT = 0x9aa0aa;
    const piernas = [-1, 1].map(s => { const p = piv(s * .12, .92); caja(p, PANT, .19, .84, .22, 0, -.42, 0); caja(p, 0x2b2b30, .21, .1, .32, 0, -.87, .05); return p; });
    caja(g, color, .56, .64, .32, 0, 1.22, 0); caja(g, color, .44, .2, .2, 0, 1.5, -.12); // sudadera y capucha
    caja(g, 0xb81f25, .5, .08, .33, 0, .93, 0); // bajo de la sudadera
    const brazos = [-1, 1].map(s => { const p = piv(s * .34, 1.48); caja(p, color, .15, .56, .17, 0, -.27, 0); caja(p, PIEL, .12, .13, .13, 0, -.6, 0); return p; });
    caja(g, PIEL, .14, .1, .14, 0, 1.58, 0);
    const cabeza = new T.Group(); cabeza.position.y = 1.62; g.add(cabeza);
    caja(cabeza, PIEL, .3, .32, .3, 0, .16, 0);
    caja(cabeza, PELO, .33, .1, .33, 0, .34, -.01); caja(cabeza, PELO, .33, .22, .07, 0, .22, -.14); // pelo
    caja(cabeza, PELO, .3, .09, .04, 0, .02, .14); // barba
    for (const s of [-1, 1]) caja(cabeza, 0x1d1d22, .05, .04, .02, s * .075, .2, .151);
    const boca = caja(cabeza, 0x3a1a1a, .12, .025, .02, 0, .08, .16);
    g.userData = { cabeza, boca, andar(ph, k) { const a = Math.sin(ph) * k;
      piernas[0].rotation.x = a * .55; piernas[1].rotation.x = -a * .55; brazos[0].rotation.x = -a * .45; brazos[1].rotation.x = a * .45; } };
    return g;
  }
  // personas que pasean (dir), se caen al suelo (caer 0→1) o huyen (huir = dirección)
  function moverGente(ctx, list, dt, t) {
    for (const p of list) {
      if (p.state === 2) continue;
      const m = p.g;
      if (p.caer > 0) { p.cae = Math.min(1, (p.cae || 0) + dt * 1.6); m.rotation.x = -Math.PI / 2 * p.cae * p.caer; m.position.y = p.y0 + .2 * p.cae; continue; }
      const v = p.huir != null ? p.speed * 1.4 : p.andar * (p.lento ?? 1);
      if (v > 0) {
        const d = p.huir != null ? p.huir : p.dir;
        p.ph += dt * v * 3; m.rotation.y = d;
        p.x += Math.sin(d) * v * dt; p.z += Math.cos(d) * v * dt; m.position.x = p.x; m.position.z = p.z;
        m.position.y = p.y0 + Math.abs(Math.sin(p.ph)) * .12;
        if (p.huir == null && ctx.R() < dt * .2) p.dir += ctx.rr(-1.2, 1.2);
      }
    }
  }

  // ---------- audio ----------
  function tono(ctx, f0, f1, dur, tipo = 'sine', gan = .3, t0 = 0) {
    const a = ctx.audio; if (!a || !a.AC) return; const AC = a.AC, t = AC.currentTime + t0, o = AC.createOscillator(), g = AC.createGain();
    o.type = tipo; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + dur);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(gan, t + .02); g.gain.exponentialRampToValueAtTime(.0005, t + dur);
    o.connect(g).connect(a.master); o.start(t); o.stop(t + dur + .05);
  }
  function ruido(ctx, dur, frec = 800, gan = .3, t0 = 0, tipo = 'lowpass') {
    const a = ctx.audio; if (!a || !a.AC || !a.AC.noiseBuf) return; const AC = a.AC, t = AC.currentTime + t0, s = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain();
    s.buffer = AC.noiseBuf; s.loop = true; f.type = tipo; f.frequency.value = frec;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(gan, t + .05); g.gain.exponentialRampToValueAtTime(.0005, t + dur);
    s.connect(f).connect(g).connect(a.master); s.start(t); s.stop(t + dur + .05);
  }

  // temporizador con el tiempo del juego (respeta pausas y grabación paso a paso, a diferencia de setTimeout)
  function reloj() {
    let ahora = 0; const tareas = [];
    return {
      luego(seg, fn) { tareas.push({ t: ahora + seg, fn }); },
      tick(t) { ahora = t; for (let i = tareas.length - 1; i >= 0; i--) if (tareas[i].t <= t) { const f = tareas[i].fn; tareas.splice(i, 1); f(); } },
      get pendientes() { return tareas.length; },
    };
  }

  return { TNT_J, RT, EN, DE, num, grande, textoTNT, comparaTNT, materiales, tintar, derribar, edificios, planeta, estallarPlaneta, multitud, persona, heroe, moverGente, tono, ruido, reloj };
})();
