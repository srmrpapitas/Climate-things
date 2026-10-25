// Altura: una persona que duplica su altura en cada fase (escenarios/altura.js). El chico de la sudadera crece en mitad de
// una calle y la cámara va con él (a pie de calle, en primera persona, a los pies, junto a un monumento, entre las nubes).
// Para contar qué falla: rayos X al estilo Mortal Kombat (huesos, músculos, tendones, corazón y sangre, que se rompen o no
// llegan) y zoom hasta los átomos del material de los huesos (hueso, acero, diamante, neutrones), con cara.
// Cada plano o efecto del escenario puede ir a la palabra que dice el narrador: tr('@palabra', '@word').
window.FENOMENOS.altura = (() => {
  const reloj = COMUN.reloj(), tr = (es, en) => window.T(es, en);   // T es THREE dentro de este archivo
  let ctx, T, V, yo, ud, edif = [], tiempo = 0, ft = 0, n = 0, fAct = null, planeta = null, luna = null, nubes = null, fondo = null, XRM = null;
  const X0 = -360, Z0 = 170;                         // calle de la acera de la Torre de Pisa, mirando hacia +z
  let s = 1, s0 = 1, s1 = 1, crT = 99, crDur = 1.3;  // escala (altura / 1,75 m) y crecimiento de la fase
  const est = { anda: 0, rodilla: 0, inclina: 0, brazo: 0, tiembla: 0, hund: 0, gris: 0, pisa: 0 }, obj = { ...est };
  let ph = 0, pasoAnt = 0, sacude = 0, plan = [], planoAct = null, planoT = 0, xr = null, mic = null, nervio = null;
  let gente = [], chispa = null;
  function brillo() { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'), r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    r.addColorStop(0, '#fff'); r.addColorStop(.25, 'rgba(255,240,140,.9)'); r.addColorStop(1, 'rgba(255,200,60,0)'); g.fillStyle = r; g.fillRect(0, 0, 64, 64); return new T.CanvasTexture(c); }
  const M = {}, ANA = { mallas: [], piel: [], femur: [], tendon: [], pulsos: [], musculos: [] }, grietas = [], dom = {};
  const lerp = (a, b, k) => a + (b - a) * k, cl = (v, a, b) => Math.max(a, Math.min(b, v)), suave = (a, b, v) => { const k = cl((v - a) / (b - a), 0, 1); return k * k * (3 - 2 * k); };
  const wp = o => o.getWorldPosition(new V());
  const H = () => 1.75 * s;

  // ---------- montaje ----------
  function crear(c) {
    ctx = c; T = c.THREE; V = T.Vector3; ANIME.crear(ctx); COMUN.materiales(ctx);
    edif = COMUN.edificios(ctx).filter(o => o.state !== 2);
    yo = COMUN.heroe(ctx, 0xd8282f); ud = yo.userData; yo.userData.fenPropio = yo.userData.sobrePlaneta = true;
    yo.position.set(X0, ctx.GROUND, Z0); yo.traverse(m => { if (m.isMesh) { m.castShadow = true; m.userData.mat0 = m.material; ANA.piel.push(m); } });
    ctx.scene.add(yo); ud.andar(0, 0);
    for (const o of ctx.objects) if (o.kind === 'car' && Math.abs(o.x - X0) < 9 && o.z > Z0 - 15 && o.z < Z0 + 260) o.g.visible = false; // la calle por donde anda
    anatomia(); gente = calle();
    XRM = new T.MeshBasicMaterial({ color: 0x4aa8ff, transparent: true, opacity: .13, blending: T.AdditiveBlending, depthWrite: false, fog: false });
    // rayos X: una esfera oscura alrededor de la cámara apaga todo lo que queda detrás de la pierna
    fondo = new T.Mesh(new T.SphereGeometry(1, 24, 16), new T.MeshBasicMaterial({ color: 0x03060c, side: T.BackSide, transparent: true, opacity: .9, depthWrite: false, fog: false }));
    fondo.renderOrder = -1; fondo.visible = false; fondo.frustumCulled = false; fondo.userData.fenPropio = true; ctx.scene.add(fondo);
    nubes = crearNubes();
    chispa = new T.Sprite(new T.SpriteMaterial({ map: brillo(), color: 0xfff27a, transparent: true, blending: T.AdditiveBlending, depthTest: false, depthWrite: false, fog: false }));
    chispa.renderOrder = 5; chispa.visible = false; chispa.userData.fenPropio = true; ctx.scene.add(chispa);
    // textos en pantalla (son del DOM: también salen en el MP4 exportado)
    const stage = document.getElementById('stage'), ref = stage.querySelector('canvas');
    const div = (css, antes) => { const e = document.createElement('div'); e.style.cssText = 'position:absolute;pointer-events:none;opacity:0;transition:opacity .25s;' + css;
      if (antes && ref) ref.after(e); else stage.appendChild(e); return e; };
    dom.gris = div('left:0;top:0;width:100%;height:100%;background:rgba(118,120,126,.72);transition:none;', true);
    const letra = 'font-family:"Archivo Black","Arial Black",Impact,sans-serif;color:#fff;text-transform:uppercase;white-space:nowrap;';
    dom.ban = div(letra + 'left:50%;bottom:16%;transform:translateX(-50%);background:rgba(8,10,16,.78);padding:.32em .75em;border-radius:.28em;text-shadow:0 0 8px rgba(255,50,40,.95);');
    dom.marcas = [0, 1].map(() => div(letra + 'transform:translate(-50%,-100%);text-shadow:0 2px 6px rgba(0,0,0,.9);text-align:center;'));
    ctx.escenario.intro = { pos: [X0 + 1.15, ctx.GROUND + 1.6, Z0 + 2.5], mira: [X0, ctx.GROUND + 1.3, Z0], dur: 0 };
  }

  // esqueleto, músculos, tendones, corazón, arteria y cerebro, colgados de las articulaciones del héroe (solo con rayos X)
  function anatomia() {
    const G = { esf: new T.SphereGeometry(1, 16, 12), cil: new T.CylinderGeometry(1, 1, 1, 10), caja: new T.BoxGeometry(1, 1, 1), costilla: new T.TorusGeometry(1, .06, 6, 24, Math.PI * 1.7) };
    const mb = (c, o = {}) => new T.MeshBasicMaterial({ color: c, fog: false, ...o });
    const HUESO = ANA.hueso = mb(0xdfe8f2), MUSC = ANA.musc = mb(0xff3346, { transparent: true, opacity: .26, blending: T.AdditiveBlending, depthWrite: false }),
      TEND = mb(0xffb347), CORA = mb(0xff2433), SANG = mb(0xff3040, { transparent: true, opacity: .55, depthWrite: false }),
      CRAN = mb(0xf4f8ff, { transparent: true, opacity: .25, depthWrite: false }), CERE = ANA.cere = mb(0xff9ab8, { transparent: true, opacity: .85 });
    const pon = (padre, geo, mat, x, y, z, sx, sy = sx, sz = sx, rx = 0, rz = 0) => { const m = new T.Mesh(geo, mat); m.position.set(x, y, z); m.scale.set(sx, sy, sz);
      m.rotation.set(rx, 0, rz); m.visible = false; m.renderOrder = mat.transparent ? 2 : 1; padre.add(m); ANA.mallas.push(m); if (mat === MUSC) ANA.musculos.push(m); return m; };
    const hueso = (padre, a, b, r, mat = HUESO) => { const pa = new V(...a), pb = new V(...b), m = pon(padre, G.cil, mat, 0, 0, 0, r, pa.distanceTo(pb), r);
      m.position.copy(pa).add(pb).multiplyScalar(.5); m.quaternion.setFromUnitVectors(new V(0, 1, 0), pb.clone().sub(pa).normalize()); return m; };
    const grupo = (padre, x, y, z) => { const g = new T.Group(); g.position.set(x, y, z); padre.add(g); return g; };
    ud.piernas.forEach(({ cad, rod }, i) => { const sd = i ? 1 : -1;
      pon(cad, G.esf, HUESO, -sd * .01, 0, 0, .03);                                       // cabeza del fémur
      const fb = grupo(cad, 0, -.22, 0);                                                   // mitad de abajo: se parte o se dobla
      hueso(cad, [0, -.01, 0], [0, -.225, 0], .017); hueso(fb, [0, .005, 0], [0, -.2, 0], .017); pon(fb, G.esf, HUESO, 0, -.205, .005, .036, .028, .032);
      ANA.femur.push({ fb, sd });
      pon(cad, G.esf, MUSC, 0, -.2, .025, .066, .19, .058); pon(cad, G.esf, MUSC, 0, -.22, -.03, .052, .17, .048);   // cuádriceps e isquios
      pon(rod, G.esf, HUESO, 0, -.005, .05, .022, .026, .012);                            // rótula
      hueso(rod, [0, -.03, 0], [0, -.4, 0], .015); hueso(rod, [sd * .024, -.05, -.005], [sd * .024, -.38, -.005], .007);   // tibia y peroné
      pon(rod, G.esf, MUSC, 0, -.13, -.042, .052, .125, .048);                            // gemelo
      const ta = hueso(rod, [0, -.2, -.058], [0, -.31, -.054], .009, TEND), tb = hueso(rod, [0, -.31, -.054], [0, -.41, -.045], .009, TEND);   // tendón de Aquiles
      ANA.tendon.push({ ta, tb, a0: ta.position.clone(), b0: tb.position.clone(), sa: ta.scale.clone(), sb: tb.scale.clone() });
      pon(rod, G.esf, HUESO, 0, -.425, -.02, .026); pon(rod, G.caja, HUESO, 0, -.437, .06, .05, .018, .12);   // talón y pie
      M['pie' + i] = grupo(rod, 0, -.43, .04); M['tobillo' + i] = grupo(rod, 0, -.34, -.02); M['rodilla' + i] = grupo(rod, 0, 0, 0); M['cadera' + i] = grupo(cad, 0, 0, 0);
    });
    pon(yo, G.esf, HUESO, 0, .95, 0, .14, .065, .08);                                      // pelvis
    for (let k = 0; k < 11; k++) pon(yo, G.caja, HUESO, 0, 1.0 + k * .046, -.055, .03);    // columna
    for (let k = 0; k < 6; k++) { const r = .105 - Math.abs(k - 2) * .006; pon(yo, G.costilla, HUESO, 0, 1.13 + k * .045, 0, r, r * .72, r, Math.PI / 2, -Math.PI * .35); }
    pon(yo, G.caja, HUESO, 0, 1.25, .09, .022, .15, .012);                                // esternón
    for (const sd of [-1, 1]) hueso(yo, [sd * .02, 1.43, .05], [sd * .19, 1.41, 0], .009); // clavículas
    ANA.corazon = pon(yo, G.esf, CORA, .03, 1.25, .03, .045, .052, .04);
    hueso(yo, [.02, 1.29, .03], [0, 1.6, 0], .008, SANG); ANA.arteria = [new V(.02, 1.29, .03), new V(0, 1.66, 0)];
    for (let k = 0; k < 5; k++) ANA.pulsos.push(pon(yo, G.esf, CORA, 0, 0, 0, .016));
    for (const sd of [-1, 1]) pon(yo, G.esf, MUSC, sd * .085, 1.3, .07, .085, .06, .035); // pectorales
    pon(yo, G.esf, MUSC, 0, 1.08, .085, .085, .13, .03);                                  // abdominales
    M.pecho = grupo(yo, 0, 1.36, 0); M.espalda = [grupo(yo, 0, 1.0, -.05), grupo(yo, 0, 1.45, -.05)];
    ud.brazos.forEach(({ hom, codo }, i) => {
      pon(hom, G.esf, HUESO, 0, 0, 0, .026); hueso(hom, [0, -.02, 0], [0, -.28, 0], .014);
      pon(hom, G.esf, MUSC, 0, -.14, .03, .042, .11, .036); pon(hom, G.esf, MUSC, 0, -.14, -.028, .04, .11, .034);   // bíceps y tríceps
      hueso(codo, [.008, -.01, 0], [.008, -.26, 0], .008); hueso(codo, [-.008, -.01, 0], [-.008, -.26, 0], .008);
      pon(codo, G.esf, MUSC, 0, -.1, 0, .036, .1, .034); pon(codo, G.caja, HUESO, 0, -.31, .005, .03, .06, .012);
      M['hombro' + i] = hom; M['codo' + i] = codo; });
    const cab = ud.cabeza; pon(cab, G.esf, CRAN, 0, .09, 0, .1, .115, .108);               // cráneo (translúcido: se ve el cerebro)
    ANA.cerebro = pon(cab, G.esf, CERE, 0, .11, -.005, .082, .07, .088);
    pon(cab, G.esf, HUESO, 0, .015, .045, .06, .025, .05);                                 // mandíbula
    M.cabeza = grupo(cab, 0, .09, 0);
  }

  // gente por las aceras y coches aparcados en la calle por donde anda (para ver lo pequeño que se queda todo)
  function calle() {
    const lista = [];
    for (let k = 0; k < 90; k++) { const g = COMUN.persona(ctx), x = X0 + (ctx.R() < .5 ? -1 : 1) * ctx.rr(7.5, 10), z = Z0 + ctx.rr(-25, 320);
      g.position.set(x, ctx.GROUND, z); g.rotation.y = ctx.R() < .5 ? 0 : Math.PI; g.userData.fenPropio = true; ctx.scene.add(g);
      lista.push({ g, x, z, v: ctx.rr(.9, 1.5) * (g.rotation.y ? -1 : 1), ph: ctx.R() * 6 }); }
    for (let k = 0; k < 14; k++) { const o = ctx.objects.find(c => c.kind === 'car' && !c.puesto && c.g.visible && Math.abs(c.x - X0) > 30); if (!o) break;
      o.puesto = true; o.x = X0 + (k % 2 ? 6.2 : -6.2); o.z = Z0 + 14 + k * 17; o.g.position.set(o.x, ctx.GROUND, o.z); o.g.rotation.y = k % 2 ? Math.PI : 0; o.g.visible = true; }
    return lista;
  }
  function crearNubes() {
    const g = new T.Group(), m = new T.MeshStandardMaterial({ color: 0xffffff, flatShading: true, roughness: 1, emissive: 0x8a96a8, emissiveIntensity: .35 });
    const bola = new T.IcosahedronGeometry(1, 1), R = ctx.R;
    const puff = (x, y, z, r) => { for (let k = 0; k < 6; k++) { const b = new T.Mesh(bola, m); b.position.set(x + (R() - .5) * r * 2.4, y + (R() - .5) * r * .5, z + (R() - .5) * r * 1.6);
      b.scale.set(r * (.6 + R() * .6), r * (.4 + R() * .3), r * (.6 + R() * .5)); g.add(b); } };
    for (let k = 0; k < 70; k++) { const a = R() * 6.28, d = 700 + R() * 5000; puff(X0 + Math.cos(a) * d, 1500 + R() * 700, Z0 + 600 + Math.sin(a) * d, 120 + R() * 220); }
    for (let k = 0; k < 7; k++) { const a = R() * 6.28, d = 160 + R() * 380; puff(X0 + Math.cos(a) * d, 1640 + R() * 260, Z0 + 150 + Math.sin(a) * d, 90 + R() * 90); }   // a la altura de la cabeza en la fase 10
    ctx.scene.add(g); return g;
  }

  // ---------- fases ----------
  // cuándo: segundos o '@palabra' (cuando el narrador la dice, repartiendo la frase por letras)
  function cuando(w, o = {}, f = fAct) {
    let t = w;
    if (typeof w === 'string') { const i = f.texto.toLowerCase().indexOf(w.slice(1).toLowerCase()); if (i < 0) console.warn('altura: no encuentro', w);
      const dur = ctx.vozDur?.(n) || f.texto.length / 16, ret = ctx.retrasoVoz ? ctx.retrasoVoz(n) : 0; t = ret + Math.max(0, i) / f.texto.length * dur; }
    return t + (o.d || 0);
  }
  function fase(c, num, valor, f) {
    n = num; fAct = f; ft = 0; s0 = s; s1 = valor / 1.75; crT = 0; crDur = f.crecer ?? 1.3;
    reloj.tick(1e9); reloj.tick(tiempo); // lo que quedara pendiente de la fase anterior, ya (y el reloj otra vez en hora)
    Object.assign(obj, { anda: f.anda || 0, rodilla: 0, inclina: 0, brazo: 0, tiembla: 0, pisa: 0 }); obj.hund = est.hund ? .05 : 0;
    rayos(null); micro(null); nervio = null; reponerHuesos();
    plan = (f.planos || [[0, 'calle']]).map(([w, nombre, o = {}]) => ({ t: cuando(w, o, f), nombre, o: { ...o } })).sort((a, b) => a.t - b.t); planoAct = null;
    for (const [w, nombre, o = {}] of f.efectos || []) reloj.luego(cuando(w, o, f), () => efecto(nombre, o));
    // el estirón: zumbido que sube y aire
    ctx.sfx('whoosh', .5); COMUN.tono(ctx, 55, 120, crDur + .3, 'sawtooth', .1); COMUN.ruido(ctx, crDur + .4, 300, .18);
    if (f.valor && !planeta) { planeta = COMUN.planeta(ctx); luna = crearLuna(); }
    for (const e of plan) if (e.nombre === 'espacio') e.t = Math.max(e.t, crDur + .3);   // la Luna, cuando ya mide lo que tiene que medir
    for (const e of plan) if (e.nombre === 'compara' && LM[e.o.lm].junto) traer(e.o.lm);
    ctx.setShake(0);
  }

  // ---------- efectos ----------
  function efecto(nombre, o) {
    if (nombre === 'gris') { obj.gris = 1; reloj.luego(2.8, () => { obj.gris = 0; }); COMUN.tono(ctx, 220, 110, 2.5, 'sine', .08); }
    if (nombre === 'desmayo') { obj.anda = 0; obj.rodilla = 1; reloj.luego(.9, () => { sacude = .35; ctx.sfx('impacto', .5); polvo(wp(M.rodilla1), 60); }); }
    if (nombre === 'levanta') { obj.rodilla = 0; }
    if (nombre === 'brazo') { obj.brazo = -.5; obj.tiembla = 1; reloj.luego(1.3, () => { obj.brazo = 0; obj.tiembla = 0; COMUN.tono(ctx, 90, 40, .4, 'sine', .25); }); }
    if (nombre === 'hunde') { obj.hund = .05; for (const i of [0, 1]) { const p = wp(M['pie' + i]); grieta(p.x, p.z, .22 * s); polvo(p, 120); } sacude = .5; ctx.sfx('derrumbe', .45); ctx.sfx('terremoto', .35); }
    if (nombre === 'tropiezo') { obj.inclina = .2; ctx.sfx('whoosh', .45); reloj.luego(.8, () => { obj.inclina = 0; }); banner(tr('UNA CAÍDA: 57 m/s ≈ 200 km/h', 'ONE FALL: 57 m/s ≈ 200 km/h'), 2.6); }
    if (nombre === 'para') obj.anda = 0;
    if (nombre === 'pisoton') { obj.pisa = 1; reloj.luego(.75, () => { obj.pisa = 0; }); reloj.luego(.95, () => {
      const p = wp(M.pie1); grieta(p.x, p.z, .5 * s); polvo(p, 260); sacude = 1; derribarCerca(p, .45 * s, 1);
      ctx.sfx('terremoto', .7); ctx.sfx('derrumbe', .6); COMUN.tono(ctx, 70, 25, 1.4, 'sine', .4); ANIME.destello(.35, .2, 0xfff0d0); }); }
    if (nombre === 'nervio') { nervio = { t: 0, dur: o.dur ?? 4.5 }; banner(tr('SEÑAL NERVIOSA: 51 s DEL PIE AL CEREBRO', 'NERVE SIGNAL: 51 s FROM FOOT TO BRAIN'), 4.8); COMUN.tono(ctx, 600, 900, .25, 'square', .06); }
  }
  function polvo(p, k) { const c = ctx.C.dust; for (let i = 0; i < k; i++) { const a = ctx.rr(0, 6.28), v = ctx.rr(.2, 1) * Math.sqrt(s) * 3;
    ctx.emit(p.x + Math.cos(a) * .15 * s, ctx.GROUND + .2, p.z + Math.sin(a) * .15 * s, Math.cos(a) * v, ctx.rr(.2, 1) * v * .5, Math.sin(a) * v, c, ctx.rr(1, 2.5), 2); } }
  function grieta(x, z, r) {
    const g = new T.CircleGeometry(1, 30), p = g.attributes.position;
    for (let i = 1; i < p.count; i++) { const k = ctx.rr(.55, 1.2); p.setXY(i, p.getX(i) * k, p.getY(i) * k); }
    g.rotateX(-Math.PI / 2);
    const m = new T.Mesh(g, new T.MeshBasicMaterial({ color: 0x2b2622, transparent: true, opacity: .8, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 }));
    m.position.set(x, ctx.GROUND + .12, z); m.scale.setScalar(r); m.userData.fenPropio = true; ctx.scene.add(m); grietas.push(m);
  }
  function derribarCerca(p, r, fuerza = .6) {
    for (const o of edif) if (o.state === 0 && !o.landmark && Math.hypot(o.x - p.x, o.z - p.z) < r + Math.max(o.w, o.d) / 2)
      COMUN.derribar(ctx, o, new V(ctx.rr(-.3, .3), -Math.min(o.h, 200) * fuerza, ctx.rr(-.3, .3)), { polvo: o.h > 60 ? 20 : 10 });
  }
  // lo que pisa: gente y coches aplastados; con los pies ya enormes, también los edificios
  function pisar(p) {
    const r = .12 * s + 1;
    for (const q of gente.concat(ctx.people)) if (!q.aplastado && Math.hypot(q.x - p.x, q.z - p.z) < r) { q.aplastado = true; q.g.scale.y = .08; }
    for (const o of ctx.objects) if (o.kind === 'car' && !o.aplastado && Math.hypot(o.x - p.x, o.z - p.z) < r + 2) { o.aplastado = true; o.g.scale.y = .25; }
    if (s > 40) derribarCerca(p, .12 * s);
  }

  // ---------- rayos X ----------
  const COL_HUESO = { hueso: 0xf4f8ff, acero: 0xc3cdd8, diamante: 0xd8fbff, neutron: 0xaab8ff };
  function materialFase() { const m = (fAct?.material || '').toLowerCase(); return /acero|steel/.test(m) ? 'acero' : /diamant/.test(m) ? 'diamante' : /neutr/.test(m) ? 'neutron' : 'hueso'; }
  function reponerHuesos() {
    for (const { fb } of ANA.femur) { fb.rotation.set(0, 0, 0); fb.position.x = 0; }
    for (const t of ANA.tendon) { t.ta.position.copy(t.a0); t.tb.position.copy(t.b0); t.ta.scale.copy(t.sa); t.tb.scale.copy(t.sb); }
    ANA.corazon.userData.k = 1;
  }
  function rayos(o) {
    const on = !!o;
    if (on !== !!xr) { for (const m of ANA.piel) m.material = on ? XRM : m.userData.mat0; for (const m of ANA.mallas) m.visible = on; fondo.visible = on; }
    xr = on ? { o, t: 0, roto: false } : null;
    if (!on) return;
    reponerHuesos(); ANA.hueso.color.set(COL_HUESO[o.rompe ? 'hueso' : materialFase()]);
    ctx.sfx('whoosh', .4); ANIME.destello(.45, .18, 0x8fd0ff); COMUN.tono(ctx, 1400, 700, .35, 'sine', .05);
  }
  function crack() {
    const { fb, sd } = ANA.femur[1]; fb.rotation.z = sd * .55; fb.position.x = sd * .022; xr.roto = true;
    const p = wp(fb), c = new T.Color(0xf4f8ff);
    for (let k = 0; k < 50; k++) ctx.emit(p.x, p.y, p.z, ctx.rr(-1, 1) * s * .5, ctx.rr(-.3, 1) * s * .5, ctx.rr(-1, 1) * s * .5, c, ctx.rr(.4, .9), 9.8 * Math.sqrt(s));
    ANIME.negativo(.08); ANIME.destello(.7, .25, 0xff2020);
    ANIME.rotulo({ texto: COMUN.EN ? 'CRACK!' : '¡CRACK!', estilo: 'rojo', y: -.22, ancho: 1.3, dur: 1.1, rot: -.08 });
    ctx.sfx('impacto', .85); COMUN.ruido(ctx, .3, 2500, .5, 0, 'highpass'); COMUN.tono(ctx, 180, 40, .4, 'square', .22); sacude = .6;
  }
  function chas() {
    const t = ANA.tendon[1]; xr.roto = true;
    t.ta.scale.y = t.sa.y * .4; t.ta.position.y = t.a0.y + .035; t.tb.scale.y = t.sb.y * .45; t.tb.position.y = t.b0.y - .025;
    ANIME.destello(.6, .22, 0xff3020); ANIME.rotulo({ texto: COMUN.EN ? 'SNAP!' : '¡CHAS!', estilo: 'rojo', y: -.22, ancho: 1.2, dur: 1, rot: .07 });
    COMUN.tono(ctx, 900, 120, .3, 'triangle', .3); ctx.sfx('impacto', .5); sacude = .4;
  }
  function tickRayos(dt) {
    if (!xr) return; xr.t += dt; const o = xr.o, t = xr.t;
    if (o.rompe === 'femur' && !xr.roto && t >= (o.en ?? 1)) crack();
    if (o.rompe === 'aquiles' && !xr.roto && t >= (o.en ?? 1)) chas();
    if (o.dobla) { const { fb, sd } = ANA.femur[1], k = suave(.6, 2, t); fb.rotation.z = sd * .32 * k;
      if (k > 0 && !xr.cruje) { xr.cruje = true; COMUN.tono(ctx, 95, 55, 1.6, 'sawtooth', .1); } }
    if (o.tinte === 'carga') ANA.hueso.color.set(COL_HUESO[materialFase()]).lerp(new T.Color(0xff7a2a), (.5 + .5 * Math.sin(t * 7)) * suave(.2, 1, t) * .8);
    ANA.musc.opacity = o.musculo ? .42 + .2 * Math.sin(t * 23) : .26;
    if (o.musculo) for (const m of ANA.musculos) m.position.x += Math.sin(t * 60 + m.id) * .0004;
    // corazón: late más rápido cuanto más tiene que empujar; con «refuerza» crece (el de jirafa)
    const ritmo = o.latido ? 2.6 : 1.3, lat = Math.pow(Math.max(0, Math.sin(t * ritmo * 6.283)), 6), cora = ANA.corazon;
    if (o.refuerza) cora.userData.k = 1 + .5 * suave(.3, 1.6, t);
    const kc = cora.userData.k || 1; cora.scale.set(.045 * kc * (1 + .18 * lat), .052 * kc * (1 + .18 * lat), .04 * kc * (1 + .18 * lat));
    if (o.latido && lat > .9 && !xr.bum) { xr.bum = true; COMUN.tono(ctx, 70, 40, .18, 'sine', .35); COMUN.tono(ctx, 60, 35, .15, 'sine', .25, .2); } if (lat < .1) xr.bum = false;
    // sangre: hasta dónde llega (n = 2: no sube del todo; con el corazón reforzado, sí)
    const llega = o.refuerza ? lerp(.45, 1, suave(.3, 1.6, t)) : o.sangre && n === 2 ? .6 : 1;
    ANA.pulsos.forEach((p, i) => { const u = ((t * .9 + i / ANA.pulsos.length) % 1); p.visible = u <= llega; p.position.lerpVectors(ANA.arteria[0], ANA.arteria[1], u); });
    ANA.cere.color.set(0xff9ab8).lerp(new T.Color(0x6f7a88), 1 - suave(.55, .95, llega));
  }

  // ---------- átomos ----------
  const MICRO = 3e7;                                    // muy por encima de todo: cielo de espacio y nada más a la vista
  const NOMBRES = {
    hueso: tr('HUESO · CALCIO, FÓSFORO Y OXÍGENO', 'BONE · CALCIUM, PHOSPHORUS, OXYGEN'), acero: tr('ACERO · HIERRO Y UN POCO DE CARBONO', 'STEEL · IRON AND A LITTLE CARBON'),
    diamante: tr('DIAMANTE · SOLO CARBONO', 'DIAMOND · PURE CARBON'), neutron: tr('ESTRELLA DE NEUTRONES · NEUTRONES APRETADOS', 'NEUTRON STAR · PACKED NEUTRONS') };
  const caras = {};
  function textCara(tipo) {
    if (caras[tipo]) return caras[tipo];
    const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'); g.lineCap = 'round'; g.lineJoin = 'round';
    const ojo = x => { g.fillStyle = '#111'; g.beginPath(); g.ellipse(x, 105, 15, 22, 0, 0, 7); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.arc(x + 5, 96, 6, 0, 7); g.fill(); };
    g.strokeStyle = '#111'; g.lineWidth = 11;
    if (tipo === 'rota') { for (const x of [92, 164]) { g.beginPath(); g.moveTo(x - 16, 88); g.lineTo(x + 16, 120); g.moveTo(x + 16, 88); g.lineTo(x - 16, 120); g.stroke(); }
      g.fillStyle = '#3a0d0d'; g.beginPath(); g.ellipse(128, 176, 26, 30, 0, 0, 7); g.fill(); }
    else if (tipo === 'chulo') { g.fillStyle = '#111'; g.beginPath(); g.roundRect(54, 86, 66, 38, 12); g.roundRect(136, 86, 66, 38, 12); g.fill(); g.fillRect(110, 94, 36, 9);
      g.fillStyle = 'rgba(255,255,255,.7)'; g.fillRect(64, 92, 16, 6); g.fillRect(146, 92, 16, 6);
      g.beginPath(); g.moveTo(90, 172); g.quadraticCurveTo(140, 196, 172, 160); g.stroke(); }
    else if (tipo === 'suda') { ojo(92); ojo(164); g.lineWidth = 8; g.beginPath(); g.moveTo(70, 72); g.lineTo(108, 82); g.moveTo(186, 72); g.lineTo(148, 82); g.stroke();
      g.lineWidth = 10; g.beginPath(); g.moveTo(84, 180); for (let k = 0; k <= 8; k++) g.lineTo(84 + k * 11, 180 + (k % 2 ? -10 : 10)); g.stroke();
      g.fillStyle = '#5fc4ff'; g.beginPath(); g.moveTo(206, 40); g.quadraticCurveTo(226, 74, 206, 84); g.quadraticCurveTo(186, 74, 206, 40); g.fill(); }
    else { ojo(92); ojo(164); g.beginPath(); g.arc(128, 150, 50, .2, Math.PI - .2); g.stroke();
      g.fillStyle = 'rgba(255,110,140,.55)'; for (const x of [64, 192]) { g.beginPath(); g.ellipse(x, 150, 20, 12, 0, 0, 7); g.fill(); } }
    const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; return caras[tipo] = t;
  }
  const GEO = {};
  function red(tipo) {
    const g = new T.Group(); g.position.set(X0, MICRO, Z0); g.userData.fenPropio = g.userData.sobrePlaneta = true;
    const at = [], enl = [], add = (x, y, z, r, c) => at.push({ p: new V(x, y, z), p0: new V(x, y, z), v: new V(), r, c: new T.Color(c) });
    let a = 8, dEnl = 0, colEnl = 0xdddddd;
    if (tipo === 'diamante') { const N = 3, base = [[0, 0, 0], [0, .5, .5], [.5, 0, .5], [.5, .5, 0]], vis = new Set();
      for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) for (let k = 0; k < N; k++) for (const b of base) for (const o of [0, .25]) {
        const p = [(i + b[0] + o) * a, (j + b[1] + o) * a, (k + b[2] + o) * a], key = p.map(v => Math.round(v * 10)).join(); if (!vis.has(key)) { vis.add(key); add(...p, .95, 0x5aa9c4); } }
      dEnl = .433 * a; colEnl = 0x9fd4e2; }
    else if (tipo === 'acero') { a = 6; const N = 4;
      for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) for (let k = 0; k <= N; k++) { add(i * a, j * a, k * a, 1.5, 0x6d7782); if (i < N && j < N && k < N) add((i + .5) * a, (j + .5) * a, (k + .5) * a, 1.5, 0x6d7782); }
      for (let q = 0; q < 7; q++) add((Math.floor(ctx.R() * N) + .5) * a, Math.floor(ctx.R() * N) * a + a * .5, (Math.floor(ctx.R() * N) + .5) * a - a * .5, .6, 0x2b2b2b);
      dEnl = .866 * a; colEnl = 0x7d8790; }
    else if (tipo === 'hueso') { a = 6.5;
      for (let k = 0; k < 4; k++) for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) { const x = (j + (i % 2) * .5) * a, z = i * a * .866, y = k * a * .9;
        if ((i + j + k) % 3 === 0) { const ip = at.length; add(x, y, z, 1.05, 0xff9a3c);                       // fósforo con sus cuatro oxígenos
          for (const d of [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]]) { add(x + d[0] * 1.15, y + d[1] * 1.15, z + d[2] * 1.15, .7, 0xff3b3b); enl.push([ip, at.length - 1]); } }
        else add(x, y, z, 1.4, 0xb8e6a0); }                                                                    // calcio
      colEnl = 0xffd0a0; }
    else { const s2 = 2.05 * Math.SQRT2, N = 4, base = [[0, 0, 0], [0, .5, .5], [.5, 0, .5], [.5, .5, 0]];          // neutrones, apretados como naranjas en una caja
      for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) for (let k = 0; k < N; k++) for (const b of base) add((i + b[0]) * s2, (j + b[1]) * s2, (k + b[2]) * s2, 1, 0x8fa9e6);
      a = 4; }
    const cen = new V(); for (const q of at) cen.add(q.p); cen.multiplyScalar(1 / at.length); for (const q of at) { q.p.sub(cen); q.p0.sub(cen); }
    if (dEnl) for (let i = 0; i < at.length; i++) for (let j = i + 1; j < at.length; j++) if (Math.abs(at[i].p.distanceTo(at[j].p) - dEnl) < .08 * a) enl.push([i, j]);
    // el átomo protagonista: el de la cara de delante más cerca del centro
    let cara = 0, mejor = -1e9; for (let i = 0; i < at.length; i++) { const q = at[i].p, v = q.z - (Math.abs(q.x) + Math.abs(q.y)) * 1.5 + at[i].r * 3; if (v > mejor) { mejor = v; cara = i; } }
    at[cara].r *= 1.35;
    GEO.esf ||= new T.SphereGeometry(1, 22, 16); GEO.cil ||= new T.CylinderGeometry(1, 1, 1, 8);
    const ia = new T.InstancedMesh(GEO.esf, new T.MeshStandardMaterial({ roughness: tipo === 'acero' ? .35 : .45, metalness: tipo === 'acero' ? .55 : .05,
      emissive: tipo === 'diamante' ? 0x06141a : tipo === 'neutron' ? 0x101a3a : 0x000000 }), at.length);
    at.forEach((q, i) => ia.setColorAt(i, q.c));
    const ib = new T.InstancedMesh(GEO.cil, new T.MeshStandardMaterial({ color: colEnl, roughness: .5, emissive: 0 }), Math.max(1, enl.length));
    ib.count = enl.length; ia.frustumCulled = ib.frustumCulled = false; g.add(ia, ib);
    const spr = new T.Sprite(new T.SpriteMaterial({ map: textCara('feliz'), transparent: true, depthWrite: false, fog: false })); spr.renderOrder = 3; g.add(spr);
    const luz = new T.PointLight(0xffffff, 500, 0, 1.6); g.add(luz);
    const cielo = new T.Mesh(new T.SphereGeometry(600, 24, 16), new T.MeshBasicMaterial({ color: 0x070b18, side: T.BackSide, fog: false })); g.add(cielo);
    ia.material.envMapIntensity = .3;
    ctx.scene.add(g);
    return { g, at, enl, ia, ib, spr, luz, cara, a, tipo, t: 0, roto: false };
  }
  function dibujarRed(R, cam) {
    const m = new T.Matrix4(), q = new T.Quaternion(), sc = new V(), up = new V(0, 1, 0), d = new V();
    R.at.forEach((a, i) => { sc.setScalar(a.r); m.compose(a.p, q.identity(), sc); R.ia.setMatrixAt(i, m); }); R.ia.instanceMatrix.needsUpdate = true;
    if (!R.roto) { R.enl.forEach(([i, j], k) => { const A = R.at[i].p, B = R.at[j].p; d.subVectors(B, A); const L = d.length();
      if (R.corte && (A.y > 0) !== (B.y > 0) && R.corte > .04 && R.corte < .96) sc.set(0, 0, 0); else sc.set(R.tipo === 'hueso' ? .22 : .32, L, R.tipo === 'hueso' ? .22 : .32);
      q.setFromUnitVectors(up, d.normalize()); m.compose(A.clone().add(B).multiplyScalar(.5), q, sc); R.ib.setMatrixAt(k, m); }); R.ib.instanceMatrix.needsUpdate = true; }
    const c = R.at[R.cara], hacia = cam.clone().sub(R.g.position).sub(c.p).normalize();
    R.spr.position.copy(c.p).addScaledVector(hacia, c.r * 1.02); R.spr.scale.setScalar(c.r * 1.75);
    R.luz.position.copy(c.p).addScaledVector(hacia, c.r * 14);
  }
  function micro(o) {
    if (mic) { ctx.scene.remove(mic.g); mic = null; }
    if (!o) return;
    mic = red(o.antes || o.tipo); mic.o = o; mic.paso = o.antes ? 0 : 1; mic.spr.material.map = textCara(o.antes ? 'suda' : o.cara || 'feliz');
    ctx.sfx('riser', .25); COMUN.tono(ctx, 300, 1400, .5, 'sine', .08);
  }
  function romperRed(R, conCara = true) {
    R.roto = true; R.ib.count = 0; if (conCara) R.spr.material.map = textCara('rota');
    for (const a of R.at) a.v.copy(a.p).normalize().multiplyScalar(ctx.rr(6, 18) * R.a / 8).add(new V(ctx.rr(-3, 3), ctx.rr(-3, 3), ctx.rr(-3, 3)));
    R.at[R.cara].v.multiplyScalar(.15);
    ANIME.destello(.6, .25, 0xff3030); ANIME.rotulo({ texto: COMUN.EN ? 'CRACK!' : '¡CRACK!', estilo: 'rojo', y: -.25, ancho: 1.2, dur: 1, rot: .06 });
    ctx.sfx('cristales', .5); COMUN.tono(ctx, 300, 60, .5, 'square', .18);
  }
  function tickMicro(dt) {
    if (!mic) return; mic.t += dt; const o = mic.o;
    if (mic.paso === 0) { if (mic.t > .5 && !mic.roto) romperRed(mic);
      if (mic.t > 1.5) { micro({ ...o, antes: null }); mic.o = o; planoT = 0; ANIME.destello(1, .35); ctx.sfx('whoosh', .5); banner(NOMBRES[o.tipo], 99); return; } }
    if (mic.paso === 1 && o.rompe != null && !mic.roto && mic.t > o.rompe) romperRed(mic);
    if (o.desliza) { const k = suave(.6, 2.4, mic.t); mic.corte = k; for (const a of mic.at) if (a.p0.y > 0) a.p.x = a.p0.x + k * mic.a; }   // un plano de átomos resbala sobre otro: así se dobla el acero
    if (mic.roto) for (const a of mic.at) { a.p.addScaledVector(a.v, dt); a.v.multiplyScalar(1 - dt * .6); }
    if (mic.tipo === 'diamante' && !mic.roto && ctx.R() < dt * 14) { const a = mic.at[Math.floor(ctx.R() * mic.at.length)], p = a.p.clone().add(mic.g.position);
      ctx.emit(p.x, p.y + a.r, p.z, 0, 1, 0, new T.Color(0xffffff), .35, 0); }
    // la cara: tranquila, sudando o rota según lo que pasa
    dibujarRed(mic, ctx.camera.position);
  }

  // ---------- la Luna (solo para comparar, al final) ----------
  function crearLuna() {
    const g = new T.IcosahedronGeometry(1, 4), p = g.attributes.position, c = new Float32Array(p.count * 3), col = new T.Color();
    for (let i = 0; i < p.count; i++) { const v = new V(p.getX(i), p.getY(i), p.getZ(i)), k = .72 + .28 * Math.abs(Math.sin(v.x * 9) * Math.cos(v.y * 7 + v.z * 5));
      col.setRGB(.78 * k, .77 * k, .74 * k); c.set([col.r, col.g, col.b], i * 3); }
    g.setAttribute('color', new T.BufferAttribute(c, 3));
    const m = new T.Mesh(g, new T.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 1 }));
    m.scale.setScalar(1.737e6); m.visible = false; m.userData.fenPropio = m.userData.sobrePlaneta = true; ctx.scene.add(m); return m;
  }

  // ---------- la cámara ----------
  function ojos() { return wp(M.cabeza); }
  function parte(nombre) {
    if (nombre === 'tobillo') return wp(M.tobillo1);
    if (nombre === 'pecho') return wp(M.pecho);
    if (nombre === 'brazo') return wp(M.codo1);
    return wp(M.cadera1).lerp(wp(M.rodilla1), .85);
  }
  const lado = h => h > 300 ? .45 * h : Math.min(8, .35 * h);   // por debajo de los tejados, la cámara no sale de la calle
  const suelo = (x, z) => ctx.groundAt ? ctx.groundAt(x, z) : ctx.GROUND;
  // monumentos para comparar; los lejanos se traen a la manzana de al lado (en vertical no caben dos cosas a un kilómetro)
  const LM = { pisa: { x: -420, z: 260, h: 56 }, empire: { x: 660, z: 1340, h: 443, junto: [95, 70] }, burj: { x: 360, z: 1640, h: 828, junto: [190, -110] } };
  function traer(lm) {
    const L = LM[lm], o = ctx.objects.find(q => q.landmark && Math.hypot(q.x - L.x, q.z - L.z) < 40); if (!o || L.traido) return; L.traido = true;
    const x = X0 + L.junto[0], z = yo.position.z + L.junto[1], r = Math.max(o.w, o.d) / 2 + 12;
    for (const q of edif) if (q !== o && q.state !== 2 && Math.abs(q.x - x) < r + q.w / 2 && Math.abs(q.z - z) < r + q.d / 2) { q.g.visible = false; q.state = 2; for (const e of q.extras || []) e.visible = false; }
    o.g.position.x += x - o.x; o.g.position.z += z - o.z; o.x = L.x = x; o.z = L.z = z;
  }
  // sube la cámara hasta que ningún edificio tape lo que mira (se calcula una vez, al empezar el plano)
  function libre(p, t, dy) {
    for (let i = 1; i < 20; i++) { const k = i / 20, x = p[0] + (t[0] - p[0]) * k, y = p[1] + dy + (t[1] - p[1] - dy) * k, z = p[2] + (t[2] - p[2]) * k;
      for (const o of edif) if (o.state !== 2 && Math.abs(x - o.x) < o.w / 2 + 1 && Math.abs(z - o.z) < o.d / 2 + 1 && y < o.y0 + o.h) return false; }
    return true;
  }
  function despeja(o, c) {
    if (o.dy == null) { o.dy = 0; for (let k = 0; k < 8 && !libre(c.pos, c.mira, o.dy); k++) o.dy = (o.dy || Math.max(4, c.pos[1] * .3)) * 1.8; }
    c.pos = [c.pos[0], c.pos[1] + o.dy, c.pos[2]]; return c;
  }
  const PLANOS = {
    // la cámara se queda quieta (a la altura de los ojos de alguien de la calle) y él crece delante
    crece(k, o) { const P = yo.position, h = H();
      if (!o.p) { const h0 = 1.75 * s0, d = 2.4 * h0 + 2, x = P.x + Math.min(3, .3 * d), z = P.z + d; o.p = [x, suelo(x, z) + Math.max(1.6, h0 > 400 ? .12 * h0 : 0), z]; }
      const d = Math.hypot(o.p[0] - P.x, o.p[2] - P.z), my = P.y + .55 * h;
      return { pos: o.p, mira: [P.x, my, P.z], fov: cl(2 * Math.atan(.62 * h / d) * 57.3 + 10, 42, 100) }; },
    calle(k, o) { const P = yo.position, h = H(), d = 2.3 * h + 2, x = P.x + Math.min(3, .3 * d), z = P.z + d;
      return { pos: [x, suelo(x, z) + Math.max(1.6, h > 400 ? .12 * h : 0), z - k * .02 * h], mira: [P.x, P.y + .5 * h, P.z], fov: 62 }; },
    pov(k) { const e = ojos(), P = yo.position, h = H(); return { pos: [e.x, e.y + .02 * s, e.z + .16 * s], mira: [P.x + .05 * h, ctx.GROUND, P.z + 1.3 * h + k * .02 * h], fov: 72 }; },
    pies(k, o) { const P = yo.position, f = wp(M.pie1), w = o.v ? 2.2 : 1;
      return { pos: [f.x + Math.min(s > 150 ? 1e9 : 8, .5 * s * w), ctx.GROUND + Math.max(.3, .12 * s * w), f.z + .9 * s * w - k * .02 * s], mira: [P.x, ctx.GROUND + .2 * s * w, f.z], fov: 58 }; },
    lado(k, o) { const P = yo.position, h = H(), sg = o.v ? -1 : 1;
      return { pos: [P.x + lado(h), P.y + .42 * h + 1.5, P.z + sg * (1.25 * h + 2) - sg * k * .015 * h], mira: [P.x, P.y + .5 * h, P.z], fov: 55 }; },
    aereo(k) { const P = yo.position, h = H(); return { pos: [P.x + .9 * h, P.y + 1.3 * h, P.z + 1.6 * h + k * .02 * h], mira: [P.x, P.y + .4 * h, P.z], fov: 55 }; },
    nubes(k) { const e = ojos(), h = H(); return { pos: [e.x + .32 * h, e.y + .01 * h, e.z + .5 * h - k * .01 * h], mira: [e.x, e.y - .06 * h, e.z], fov: 58 }; },
    // él y un monumento a la vez: la cámara a un lado de la línea que los une, a la distancia justa para que quepan los dos
    compara(k, o) { const P = yo.position, L = LM[o.lm], h = H(), mh = Math.max(h, L.h), mx = (P.x + L.x) / 2, mz = (P.z + L.z) / 2;
      const D = Math.hypot(L.x - P.x, L.z - P.z), dx = (L.x - P.x) / D, dz = (L.z - P.z) / D; let px = -dz, pz = dx; if (pz < 0) { px = -px; pz = -pz; }
      const dist = Math.max(D * 2.4, mh * 1.7) * (1 - k * .01);
      return { pos: [mx + px * dist, ctx.GROUND + mh * .3 + 2, mz + pz * dist], mira: [mx, ctx.GROUND + mh * .45, mz], fov: 50 }; },
    rayos(k, o) { const t = parte(o.parte), d = { pierna: 1.25, tobillo: .75, pecho: 1.05, brazo: .7 }[o.parte] * s * (1 - Math.min(.15, k * .03));
      return { pos: [t.x + d * .82, t.y + d * .12, t.z + d * .58], mira: t.toArray(), fov: 40 }; },
    atomo(k) { if (!mic) return PLANOS.calle(k, {}); const c = mic.at[mic.cara].p.clone().add(mic.g.position);
      const e = 1 - Math.pow(1 - Math.min(1, k / 2.4), 3), rf = mic.at[mic.cara].r, d = lerp(34, 6.5, e) * rf, a = .55 - k * .08;
      return { pos: [c.x + Math.sin(a) * d, c.y + d * .2, c.z + Math.cos(a) * d], mira: c.toArray(), fov: 45 }; },
    nervio(k) { const P = yo.position, h = H(); return { pos: [P.x + .55 * h, P.y + .45 * h, P.z + 1.2 * h], mira: [P.x, P.y + .48 * h, P.z], fov: 58 }; },
    // el estirón final: la cámara se aleja a la vez que crece, hasta que se ve la Tierra
    despega(k) { const P = yo.position, h = H(); return { pos: [P.x + .9 * h, P.y + .75 * h + 2, P.z + 2.1 * h], mira: [P.x, P.y + .5 * h, P.z], fov: 55 }; },
    espacio(k, o) { const P = yo.position, h = H(), f = 1 + k * (o.v ? .04 : .015);
      return { pos: [P.x + .95 * h * f, P.y + .75 * h * f, P.z + 3.1 * h * f], mira: [P.x + .62 * h, P.y + .45 * h, P.z], fov: 50 }; },
  };
  function director(dt) {
    let sel = plan[0]; for (const e of plan) if (ft >= e.t) sel = e;
    if (!sel) return;
    if (sel !== planoAct) { const ant = planoAct; planoAct = sel; planoT = 0; entrar(sel, ant); }
    planoT += dt;
    let c = (PLANOS[sel.nombre] || PLANOS.calle)(planoT, sel.o);
    if (['crece', 'calle', 'lado', 'pies', 'compara'].includes(sel.nombre) && H() < 2500) c = despeja(sel.o, c);
    ctx.camTo(c.pos, c.mira, 1e-4); ctx.camera.fov = c.fov || 55;
  }
  function entrar(e, ant) {
    const era = ant?.nombre;
    if (era === 'rayos' || e.nombre === 'rayos') rayos(e.nombre === 'rayos' ? e.o : null);
    if (era === 'atomo' || e.nombre === 'atomo') micro(e.nombre === 'atomo' ? e.o : null);
    const txt = e.o.etiqueta || (e.nombre === 'atomo' ? NOMBRES[e.o.antes || e.o.tipo] : '');
    if (txt) banner(txt, 99); else if (ant && (ant.o.etiqueta || ant.nombre === 'atomo')) banner('', 0);   // los rótulos de los efectos se quedan
    if (e.nombre === 'atomo' || era === 'atomo' || e.nombre === 'rayos') { ANIME.lineas(.85, [.5, .5]); reloj.luego(.35, () => ANIME.lineas(0)); if (e.nombre === 'atomo') ANIME.destello(1, .3); }
    if (e.nombre === 'espacio' && luna) luna.visible = true;
  }
  let banT = 0;
  function banner(txt, dur) { dom.ban.textContent = txt || ''; dom.ban.style.opacity = txt ? 1 : 0; banT = txt ? dur : 0; }

  // ---------- cada fotograma ----------
  function actualizar(c, dt, t) {
    const dtR = dt; tiempo = t; ft += dt; reloj.tick(t); ANIME.tick(dt);
    // crecer (en escala logarítmica: cada duplicación tarda lo mismo)
    if (crT < crDur + .1) { crT += dt; const e = suave(0, 1, crT / crDur); s = Math.exp(lerp(Math.log(s0), Math.log(s1), e));
      if (s > 40 && ctx.R() < dt * 6) for (const i of [0, 1]) derribarCerca(wp(M['pie' + i]), .1 * s, .5); }
    yo.scale.setScalar(s);
    const k = 1 - Math.exp(-dt * 3); for (const key in est) est[key] += (obj[key] - est[key]) * (key === 'gris' ? 1 - Math.exp(-dt * 5) : k);
    // andar: una pierna es un péndulo, el paso va más lento cuanto más grande (∝ √tamaño) y la zancada, más larga
    const andando = crT > crDur && est.anda > .05;
    if (andando) { ph += dt * 5 / Math.sqrt(s) * Math.max(.4, est.anda); yo.position.z += dt * .9 * Math.sqrt(s) * est.anda; }
    ud.andar(ph, andando ? Math.min(1, est.anda * 1.4) : 0);
    const sn = Math.sin(ph); if (andando && Math.sign(sn) !== Math.sign(pasoAnt) && s > 1.5) { const p = wp(M['pie' + (sn > 0 ? 0 : 1)]); pisar(p);
      if (s >= 8) { sacude = Math.max(sacude, Math.min(.5, s * .01)); COMUN.tono(ctx, 70 / Math.sqrt(Math.log2(s) + 1), 30, .5, 'sine', Math.min(.35, .05 * Math.log2(s))); if (s >= 16) polvo(p, 20); } }
    pasoAnt = sn;
    // de rodillas (desmayo), brazo que no sube, tropiezo, pisotón y pies hundidos
    for (const { rod } of ud.piernas) rod.rotation.x += est.rodilla * 1.5;
    yo.position.y = ctx.GROUND - est.hund * s - est.rodilla * .42 * s;
    yo.rotation.x = est.rodilla * .18 + est.inclina; ud.cabeza.rotation.x = est.rodilla * .5;
    ud.brazos[1].hom.rotation.x += est.brazo + (est.tiembla > .1 ? Math.sin(t * 40) * .03 * est.tiembla : 0);
    ud.piernas[1].cad.rotation.x += -.6 * est.pisa; ud.piernas[1].rod.rotation.x += .5 * est.pisa;
    if (andando && est.anda < .7) yo.rotation.z = Math.sin(ph) * .04; else yo.rotation.z = 0;   // cojea
    yo.updateMatrixWorld(true);
    for (const q of gente) if (!q.aplastado) { q.z += q.v * dt * (q.huye ? 3 : 1); q.ph += dt * 9; q.g.position.z = q.z; q.g.position.y = ctx.GROUND + Math.abs(Math.sin(q.ph)) * .06; }
    tickRayos(dt); tickMicro(dt);
    if (nervio) { nervio.t += dt; const u = Math.min(1, nervio.t / nervio.dur), ruta = [wp(M.pie1), wp(M.rodilla1), wp(M.cadera1), wp(M.espalda[0]), wp(M.espalda[1]), ojos()];
      const x = u * (ruta.length - 1), i = Math.min(ruta.length - 2, Math.floor(x)), p = ruta[i].lerp(ruta[i + 1], x - i);
      chispa.position.copy(p);
      for (let q = 0; q < 6; q++) ctx.emit(p.x, p.y, p.z, ctx.rr(-1, 1) * s * .01, ctx.rr(-1, 1) * s * .01, ctx.rr(-1, 1) * s * .01, new T.Color(0xfff27a), .6, 0);
      if (u >= 1 && !nervio.fin) { nervio.fin = true; ANIME.destello(.5, .25, 0xfff27a); ANIME.rotulo({ texto: COMUN.EN ? 'OUCH!' : '¡AY!', estilo: 'oro', y: -.2, ancho: 1, dur: 1.1 }); COMUN.tono(ctx, 500, 900, .2, 'square', .1); } }
    if (planeta) { if (H() > 4e4 && !planeta.visto) { planeta.visto = true; planeta.mostrar(); } planeta.update(dt); if (luna && luna.visible) { const P = yo.position, h = H(); luna.position.set(P.x + .68 * h, P.y + .5 * h, P.z); luna.rotation.y += dt * .02; } }
    director(dtR);
    sacude = Math.max(0, sacude - dt * 1.6); ctx.setShake(sacude * ctx.camDist * .012);
    banT -= dt; if (banT <= 0 && dom.ban.style.opacity !== '0') dom.ban.style.opacity = 0;
    dom.gris.style.opacity = est.gris * .85;
  }

  // ---------- después de la cámara del motor ----------
  function tras(c, dt) {
    const cam = ctx.camera, d = cam.position.distanceTo(ctx.camTgt);
    if (fondo.visible) { fondo.position.copy(cam.position); fondo.scale.setScalar(d * 1.8); }
    for (const P of ctx.pools) P.mat.size = Math.min(P.mat.size, Math.max(.03, d * .006));
    if (nubes.visible) for (const b of nubes.children) b.visible = b.position.distanceToSquared(cam.position) > (d * .3) ** 2;   // ninguna nube pegada a la cámara
    if (chispa) { chispa.visible = !!nervio && !nervio.fin; chispa.scale.setScalar(d * .05); }
    // marcas en el espacio: tú y la Luna
    const fs = document.getElementById('stage').clientWidth * .04;
    dom.ban.style.fontSize = fs + 'px';
    const marcas = luna && luna.visible && planoAct?.nombre === 'espacio' ? [[ojos().add(new V(0, H() * .08, 0)), tr('TÚ · 3.670 km', 'YOU · 3,670 km')],
      [luna.position.clone().add(new V(0, 1.85e6, 0)), tr('LA LUNA · 3.475 km', 'THE MOON · 3,475 km')]] : [];
    dom.marcas.forEach((e, i) => { const m = marcas[i]; if (!m) { e.style.opacity = 0; return; } const p = m[0].clone().project(cam), st = document.getElementById('stage');
      e.textContent = m[1]; e.style.fontSize = fs * .9 + 'px'; e.style.left = (p.x + 1) / 2 * st.clientWidth + 'px'; e.style.top = (1 - p.y) / 2 * st.clientHeight + 'px'; e.style.opacity = 1; });
  }

  // ---------- marcador ----------
  const COSAS = [[560, 'un caballo', 'a horse'], [4480, 'un elefante', 'an elephant'], [35840, 'un camión cargado', 'a loaded lorry'], [286720, 'dos ballenas azules', 'two blue whales'],
    [2.29e6, 'un tren de mercancías', 'a freight train'], [1.84e7, 'dos Torres Eiffel y media', 'two and a half Eiffel Towers'], [1.47e8, 'un portaaviones y medio', 'one and a half aircraft carriers'],
    [1.17e9, 'tres Empire State', 'three Empire States'], [9.4e9, 'una Gran Pirámide y media', 'one and a half Great Pyramids'], [6.5e20, 'casi el planeta enano Ceres', 'almost the dwarf planet Ceres']];
  return {
    crear, fase, actualizar, tras,
    activo: () => crT < crDur || reloj.pendientes > 0,
    mag: v => v >= 1e5 ? `${COMUN.num(v / 1000, 0)} km` : `${COMUN.num(v, v < 10 ? 1 : 0)} m`,
    linea3: v => { const kg = 70 * Math.pow(v / 1.75, 3), t = kg / 1000, c = COSAS.find(([p]) => Math.abs(Math.log(kg / p)) < .3);
      const peso = kg < 1e4 ? `${COMUN.num(kg, 0)} kg` : t < 1e6 ? (COMUN.EN ? `${COMUN.num(t, 0)} tonnes` : `${COMUN.num(t, 0)} toneladas`) : (COMUN.EN ? `${COMUN.grande(t)} tonnes` : `${COMUN.grande(t)}${COMUN.DE}toneladas`);
      return [COMUN.EN ? `You weigh ${peso}` : `Pesas ${peso}`, c ? (COMUN.EN ? `LIKE ${c[2].toUpperCase()}` : `COMO ${c[1].toUpperCase()}`) : ''];
    },
    danos: () => fAct ? `${tr('Huesos', 'Bones')}: ${fAct.material} · ${fAct.cuerpo}` : '',
  };
})();
