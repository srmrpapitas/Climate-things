// Virus: en cada fase se duplica el R₀ (a cuánta gente contagia cada enfermo). No explota nada: la ciudad se va contagiando.
// Lo que se ve: una onda de contagio que sale del primer enfermo y, dentro de ella, cada persona se enciende en verde.
// Días para contagiar a todo el planeta: 3 días por ronda · ln(8.100 millones) / ln(R₀). Con R₀ = 1 no arranca nunca.
// Tope físico: no puedes contagiar a más gente de la que existe, y nunca en menos de dos rondas (6 días).
// Cifras aproximadas: compruébalas antes de publicar.
window.FENOMENOS.virus = (() => {
  const MUNDO = 8.1e9, RONDA = 3;                 // habitantes del planeta y días por ronda de contagios
  const Z0 = [-11, 116];                          // el primer enfermo: en el corrillo de la acera, donde miran las cámaras de calle
  // fracción de la ciudad contagiada y tumbada según las veces que se ha duplicado el R₀ (log2)
  const CONTAGIO = [0, .02, .05, .12, .25, .42, .6, .75, .86, .93, .97, .99, 1, 1, 1];
  const TUMBADOS = [0, 0, 0, 0, .04, .08, .14, .22, .32, .42, .52, .62, .72, .8, .88];
  const reloj = COMUN.reloj();
  let ctx, R0 = 1, t0 = 0, tiempo = 0, gente = [], todos = [], orden = [], planeta = null, yo = null;
  let motas = null, pos = null, nInf = 0, anillos = [], tos = 0, verde = null;
  let apagar = false, apagado = 0;                // último paso: sin nadie sano, la cadena se corta y el virus se extingue
  let dFin = null, durCuenta = 5;                 // contador mundial: días hasta el final del contagio y segundos que tarda en contarlos
  let cSup = null, cEmi = null, apagadoSup = null, apagadoEmi = null;   // la superficie del planeta mientras se apaga el verde
  const est = { pandemia: 0 }, obj = { ...est };
  let cieloObj = 0x9fd3f0;
  let vomito = null, xr = null, fase_i = 0;       // color del vómito · rayos X del pecho (plano 'rayos') · veces duplicado

  function crear(c) {
    ctx = c; const T = ctx.THREE;
    verde = new T.Color(0x8fe06a); vomito = new T.Color(0xa8b832);
    xr = rayosX(T); ANIME.crear(ctx);
    cSup = new T.Color(); cEmi = new T.Color(); apagadoSup = new T.Color(0x4a4f46); apagadoEmi = new T.Color(0x2a2e28);
    yo = COMUN.protagonista(ctx, { x: -11.5, z: 120, vel: .55 });
    // la multitud, apretada en el tramo por el que pasea el protagonista: así se ve la mancha verde desde la acera
    gente = COMUN.multitud(ctx, 120, -10, 10, 115, 320, { andar: true });
    todos = gente.concat(ctx.people);
    // un corrillo quieto en la acera, alrededor y por detrás del protagonista: es lo que encuadran las cámaras de calle,
    // y al no andar se queda en el plano los primeros pasos (si no, los primeros contagiados caían fuera de cuadro)
    const puestos = [];
    for (let q = 0; q < 16; q++) { const p = gente[q];
      // sitio libre: con 16 a dedo salían parejas metidas una dentro de otra, y en fila recta parecía la cola del autobús
      for (let intento = 0; intento < 24; intento++) {
        const x = -12.4 + ctx.rr(0, 3), z = 104 + ctx.rr(0, 21);
        if (intento < 23 && puestos.some(o => Math.hypot(o[0] - x, o[1] - z) < 1.1)) continue;
        p.x = x; p.z = z; puestos.push([x, z]); break;
      }
      p.andar = q % 4 === 0 ? ctx.rr(.25, .45) : 0;   // unos cuantos se mueven para que el grupo no parezca una cola
      p.dir = ctx.rr(0, 6.28);
      p.g.position.set(p.x, ctx.groundAt(p.x, p.z), p.z); p.g.rotation.y = p.dir; p.y0 = p.g.position.y; }
    // se contagian por cercanía al primer enfermo: así la mancha crece desde un punto
    orden = todos.slice().sort((a, b) => Math.hypot(a.x - Z0[0], a.z - Z0[1]) - Math.hypot(b.x - Z0[0], b.z - Z0[1]));
    // una sola nube de puntos para todos los enfermos (430 mallas sueltas no las mueve un iPhone).
    // El punto lleva su propia textura redonda: el cuadrado de PointsMaterial, sumado sobre el asfalto claro,
    // se iba a blanco y parecían folios flotando sobre la gente.
    const cv = document.createElement('canvas'); cv.width = cv.height = 64;
    const g2 = cv.getContext('2d'), gr = g2.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(236,255,206,1)'); gr.addColorStop(.3, 'rgba(118,226,78,.95)');
    gr.addColorStop(.7, 'rgba(78,190,52,.45)'); gr.addColorStop(1, 'rgba(68,170,46,0)');
    g2.fillStyle = gr; g2.beginPath(); g2.arc(32, 32, 32, 0, 6.2832); g2.fill();
    pos = new Float32Array(todos.length * 3);
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(pos, 3)); g.setDrawRange(0, 0);
    motas = new T.Points(g, new T.PointsMaterial({ map: new T.CanvasTexture(cv), size: .95, transparent: true, opacity: .9, depthWrite: false, fog: false }));
    motas.frustumCulled = false; motas.userData.fenPropio = true; ctx.scene.add(motas);
  }

  // una onda verde que se abre desde el primer enfermo, más grande cuanto mayor es el R₀
  function anillo(r) {
    const T = ctx.THREE;
    const m = new T.Mesh(new T.RingGeometry(.9, 1, 96), new T.MeshBasicMaterial({ color: 0x9cff78, transparent: true, opacity: .55, side: T.DoubleSide, blending: T.AdditiveBlending, depthWrite: false }));
    m.rotation.x = -Math.PI / 2; m.position.set(Z0[0], ctx.GROUND + 1.2, Z0[1]); m.userData.fenPropio = true; ctx.scene.add(m);
    anillos.push({ m, t: 0, dur: 2.2, r });
  }

  function fase(c, n, valor, f) {
    R0 = valor; t0 = tiempo;
    // el contador de días corre mientras habla el narrador (y si aún no se sabe cuánto dura la frase, unos 5 s)
    dFin = dias(R0); durCuenta = Math.max(3, (ctx.vozDur(n) || 6) * .65);
    const i = Math.max(0, Math.min(CONTAGIO.length - 1, Math.round(Math.log2(Math.max(1, R0)))));
    // el primer enfermo siempre, y a partir de ahí la fracción que toque
    const quiero = R0 <= 1 ? 1 : Math.round(CONTAGIO[i] * orden.length);
    for (; nInf < quiero; nInf++) orden[nInf].enfermo = tiempo + ctx.rr(0, .7);
    const cae = TUMBADOS[i]; fase_i = i;
    for (const p of orden.slice(0, nInf)) {
      p.lento = i >= 6 ? Math.max(.2, 1 - (i - 5) * .14) : 1; if (p.andar == null) p.andar = 0;
      if (!p.caer && ctx.R() < cae) { p.caer = ctx.rr(.6, 2.4); p.retraso = tiempo + ctx.rr(.2, 2.4); }
    }
    if (!planeta) anillo(R0 <= 1 ? 14 : Math.min(2600, 18 * Math.pow(1.7, i)));
    // el protagonista: se contagia con el sarampión, tose, se arrastra y al final cae
    obj.pandemia = i >= 5 ? Math.min(1, (i - 4) / 7) : 0;
    if (i >= 4) yo.est.tinte = { c: verde, k: Math.min(.3, .08 + (i - 4) * .04) };
    yo.est.lento = i >= 11 ? .15 : i >= 8 ? .4 : i >= 6 ? .7 : 1;
    yo.est.cabeza = i >= 6 ? .22 : i >= 4 ? .1 : 0;
    tos = i >= 4 ? Math.min(1, (i - 3) / 6) : 0;
    if (i >= 13 && !yo.est.caer) reloj.luego(1.4, () => { yo.est.caer = true; });
    cieloObj = i >= 12 ? 0x7f8a76 : i >= 9 ? 0x9aa88e : i >= 6 ? 0xb3c2a4 : 0x9fd3f0;
    // desde el espacio: la Tierra se apaga, cubierta de verde
    if (f.planeta && !planeta) { planeta = COMUN.planeta(ctx); cieloObj = 0x05070c; motas.visible = false; }
    // nada explota: solo un golpe sordo y un siseo
    COMUN.tono(ctx, 140, 95, 2.4, 'sine', .12);
    COMUN.ruido(ctx, 1.4, 2600, .07);
    // la epidemia se acaba sola: el verde del planeta se apaga despacio, sin estruendo
    if (f.apagar) { apagar = true; obj.pandemia = 0; COMUN.tono(ctx, 90, 42, 5.5, 'sine', .14); }
  }

  function actualizar(c, dt, t) {
    tiempo = t; reloj.tick(t); ANIME.tick(dt); yo.actualizar(dt, t);
    if (apagar) apagado = Math.min(1, apagado + dt / 5);
    COMUN.corte.tick(ctx, dt);
    const k = 1 - Math.exp(-dt * 1.1);
    for (const key in est) est[key] += (obj[key] - est[key]) * k;
    if (!ctx.corte) ctx.skyT.set(cieloObj);
    ctx.setShake(0);
    // el protagonista tose: la cabeza da una sacudida y se le abre la boca
    if (tos) { const ciclo = (t % 4.5) / 4.5, golpe = ciclo < .18 ? Math.sin(ciclo / .18 * Math.PI) : 0;
      yo.est.hablar = golpe * .8 * tos; yo.est.tiembla = golpe * tos;
      if (fase_i >= 6 && ciclo < .02 && !(yo.vomita > tiempo - 2)) yo.vomita = tiempo; } else { yo.est.hablar = 0; yo.est.tiembla = 0; }
    // vómitos: de vez en cuando un enfermo cerca de la cámara se dobla y echa un chorro
    if (fase_i >= 3 && nInf && ctx.camDist < 220 && ctx.R() < dt * (1 + fase_i * .5)) { const p = orden[Math.floor(ctx.R() * nInf)];
      if (p && p.enfermo && tiempo > p.enfermo && !(p.vomita > tiempo - 3) && Math.hypot(p.g.position.x - ctx.camTgt.x, p.g.position.z - ctx.camTgt.z) < 60) p.vomita = tiempo; }
    for (const p of [yo, ...orden.slice(0, nInf)]) if (p.vomita > tiempo - 1.4) vomitar(p, tiempo - p.vomita);
    tickRayos(dt, t);
    // la gente contagiada anda más despacio y la que se desploma se queda en el suelo
    for (const p of todos) if (p.caer && tiempo > p.retraso && !p.caido) { p.cae = Math.min(1, (p.cae || 0) + dt / p.caer);
      p.g.rotation.x = -Math.PI / 2 * p.cae * p.cae; if (p.cae >= 1) p.caido = true; }
    COMUN.moverGente(ctx, gente.filter(p => !p.caer || tiempo < p.retraso), dt, t);
    // un punto verde encendido en cada enfermo
    if (motas.visible) {
      let j = 0;
      for (let q = 0; q < nInf; q++) { const p = orden[q]; if (!p.enfermo || tiempo < p.enfermo) continue;
        // a la altura del pecho, no sobre la cabeza: desde las cámaras de calle, un punto por encima de la cabeza
        // se iba al tercio de arriba de la pantalla, justo donde están el marcador y la frase
        const m = p.g, alto = p.caido || (p.cae > .5) ? .4 : 1.25;
        pos[j * 3] = m.position.x; pos[j * 3 + 1] = m.position.y + alto + Math.sin(t * 3 + q) * .05; pos[j * 3 + 2] = m.position.z; j++; }
      motas.geometry.setDrawRange(0, j); motas.geometry.attributes.position.needsUpdate = true;
      motas.material.opacity = .55 + .35 * Math.abs(Math.sin(t * 2.2));
      // a pie de calle los puntos quedan muy pequeños: los enfermos que están cerca de la cámara sueltan vaho verde
      if (j && ctx.camDist < 220) for (let q = 0; q < 5; q++) { const p = orden[Math.floor(ctx.R() * nInf)];
        if (!p || !p.enfermo || tiempo < p.enfermo) continue; const m = p.g;
        if (Math.hypot(m.position.x - ctx.camTgt.x, m.position.z - ctx.camTgt.z) > 70) continue;
        ctx.emit(m.position.x + ctx.rr(-.3, .3), m.position.y + (p.caido ? .4 : 1.4), m.position.z + ctx.rr(-.3, .3),
          ctx.rr(-.4, .4), ctx.rr(.4, 1.2), ctx.rr(-.4, .4), verde, ctx.rr(.2, .45), -.4); }
    }
    // ondas de contagio
    for (let i = anillos.length - 1; i >= 0; i--) { const a = anillos[i]; a.t += dt;
      const q = Math.min(1, a.t / a.dur); a.m.scale.setScalar(1 + a.r * Math.pow(q, .55)); a.m.material.opacity = .55 * (1 - q);
      if (q >= 1) { a.m.parent && a.m.parent.remove(a.m); a.m.geometry.dispose(); anillos.splice(i, 1); } }
    // motas de virus flotando cerca de la cámara cuando la ciudad está infectada
    const r = Math.max(25, Math.min(700, ctx.camDist * .55)), n = Math.round(est.pandemia * 8);
    for (let q = 0; q < n; q++) ctx.emit(ctx.camTgt.x + ctx.rr(-r, r), ctx.camTgt.y + ctx.rr(-r, r) * .5, ctx.camTgt.z + ctx.rr(-r, r),
      ctx.rr(-1, 1), ctx.rr(-.4, .6), ctx.rr(-1, 1), verde, Math.max(.6, Math.min(2.4, ctx.camDist * .006)), 0);
    if (planeta) { planeta.update(dt);
      // la Tierra se pone verde a la vez que sube el contador mundial; al apagarse la epidemia queda una Tierra gris
      const k2 = apagado * apagado, kv = apagar ? 1 : Math.min(1, cuenta().inf / MUNDO);
      cSup.set(0x6f8f4a).lerp(apagadoSup, k2); cEmi.set(0x4a7a22).lerp(apagadoEmi, k2);
      planeta.teñir(cSup.getHex(), (.8 + .15 * k2) * kv, cEmi.getHex(), .08 * kv);
      planeta.nubes.material.color.set(0xffffff).lerp(verde, .55 * (1 - k2) * kv); }
  }

  // días que tarda en contagiar a todo el planeta: una ronda cada 3 días, y nunca menos de dos rondas
  const dias = r => r <= 1 ? null : Math.max(2, Math.log(MUNDO) / Math.log(r)) * RONDA;
  // tope de una epidemia: quien se cura queda inmune y frena al virus, así que no se contagia todo el mundo.
  // Fracción final z de z = 1 − e^(−R₀·z): R₀ 2 → 80 %, R₀ 4 → 98 %, R₀ 8 o más → prácticamente todos.
  // un chorro de vómito desde la boca, hacia delante y al suelo; el que vomita se dobla un poco
  function vomitar(p, k) {
    const m = p.g, a = m.rotation.y, tirado = p.caido || p.cae > .5, y = m.position.y + (tirado ? .25 : 1.35);
    if (!tirado && p !== yo) m.rotation.x = -.45 * Math.sin(Math.min(1, k / 1.4) * Math.PI);
    if (k < .02) { COMUN.ruido(ctx, .5, 500, .06); COMUN.tono(ctx, 160, 70, .4, 'sawtooth', .04); }
    for (let q = 0; q < 4; q++) ctx.emit(m.position.x + Math.sin(a) * .25, y, m.position.z + Math.cos(a) * .25,
      Math.sin(a) * ctx.rr(1.2, 2.2) + ctx.rr(-.3, .3), ctx.rr(-.2, .6), Math.cos(a) * ctx.rr(1.2, 2.2) + ctx.rr(-.3, .3), vomito, ctx.rr(.5, .9), 9.8);
  }
  // rayos X del pecho de un enfermo, flotando muy por encima de la ciudad (detrás solo hay cielo, que tapa una esfera oscura):
  // los pulmones se llenan de virus según la fase y, en las últimas, el corazón se para
  const XR = [0, 1500, 0];
  function rayosX(T) {
    const g = new T.Group(); g.position.set(...XR); g.visible = false; g.userData.fenPropio = true;
    const mb = (c, o = {}) => new T.MeshBasicMaterial({ color: c, fog: false, ...o }), A = { blending: T.AdditiveBlending, transparent: true, depthWrite: false };
    const pon = (geo, mat, x, y, z, sx, sy = sx, sz = sx) => { const m = new T.Mesh(geo, mat); m.position.set(x, y, z); m.scale.set(sx, sy, sz); g.add(m); return m; };
    const esf = new T.SphereGeometry(1, 20, 14), cil = new T.CylinderGeometry(1, 1, 1, 10);
    const fondo = pon(esf, mb(0x03060c, { side: T.BackSide }), 0, 1, 0, 8); fondo.renderOrder = -1;
    const piel = mb(0x4aa8ff, { ...A, opacity: .16 });
    pon(esf, piel, 0, .95, 0, .42, .62, .26); pon(esf, piel, 0, 1.85, 0, .22, .26, .22); pon(cil, piel, 0, 1.55, 0, .09, .25, .09);
    const hueso = mb(0xdfe8f2, { ...A, opacity: .7 });
    pon(cil, hueso, 0, 1.0, -.12, .035, 1.1, .035); pon(esf, hueso, 0, 1.87, 0, .17, .2, .17);
    for (let k = 0; k < 6; k++) { const r = pon(new T.TorusGeometry(1, .05, 6, 20, Math.PI * 1.4), hueso, 0, 1.38 - k * .1, -.02, .3 - Math.abs(k - 2) * .015, .3, .2);
      r.rotation.set(Math.PI / 2, 0, -Math.PI * .2); }
    const pul = [-1, 1].map(sd => pon(esf, mb(0xff8aa0, { ...A, opacity: .5 }), sd * .15, 1.15, 0, .13, .24, .12));
    const cora = pon(esf, mb(0xff2433), -.05, 1.05, .06, .075);
    const virus = []; for (let q = 0; q < 60; q++) { const sd = q % 2 ? 1 : -1, v = pon(esf, mb(0x8fe06a), sd * .15 + ctx.rr(-.09, .09), 1.15 + ctx.rr(-.2, .2), ctx.rr(-.07, .07), .018);
      v.visible = false; virus.push(v); }
    ctx.scene.add(g);
    return { g, pul, cora, virus, t: 0, k: 0, para: false, fin: 0 };
  }
  function verRayos(dur) {
    const k = Math.min(1, Math.max(.15, (fase_i - 3) / 9)); Object.assign(xr, { t: 0, k, para: k > .8, fin: tiempo + dur + .3 }); xr.g.visible = true;
    xr.virus.forEach((v, q) => { v.visible = q < k * xr.virus.length; });
    for (const m of xr.pul) m.material.color.set(0xff8aa0).lerp(verde, k);
    ctx.sfx('whoosh', .35); COMUN.tono(ctx, 1400, 700, .35, 'sine', .05);
    ANIME.rotulo({ texto: xr.para ? (COMUN.EN ? 'THE HEART STOPS' : 'EL CORAZÓN SE PARA') : (COMUN.EN ? 'LUNGS FILLING WITH VIRUS' : 'LOS PULMONES SE LLENAN DE VIRUS'),
      estilo: 'rojo', y: -.22, ancho: 1.1, dur: Math.min(2.2, dur), rot: -.04 });
  }
  function tickRayos(dt, t) {
    if (!xr || !xr.g.visible) return; xr.t += dt;
    if (tiempo > xr.fin) { xr.g.visible = false; return; }
    for (const v of xr.virus) if (v.visible) v.position.x += Math.sin(t * 9 + v.id) * .0006;
    // el corazón late deprisa (fiebre) y, si toca, se para a mitad del plano con el pitido plano del monitor
    const vivo = !xr.para || xr.t < 1.3, lat = vivo ? Math.pow(Math.max(0, Math.sin(xr.t * 2.4 * 6.283)), 6) : 0;
    xr.cora.scale.setScalar(.075 * (1 + .3 * lat));
    if (!vivo && !xr.pita) { xr.pita = true; COMUN.tono(ctx, 1000, 1000, 1.4, 'sine', .07); }
    if (vivo) xr.pita = false;
  }
  const tope = r => { let z = .5; for (let q = 0; q < 60; q++) z = 1 - Math.exp(-r * z); return z; };
  // el contador mundial en este momento de la fase: día y contagiados (R₀ elevado al número de rondas, con su tope)
  const cuenta = () => {
    if (!dFin) return { dia: 0, inf: 1, fin: false };
    const q = Math.min(1, (tiempo - t0) / durCuenta), k = 1 - Math.pow(1 - q, 2), dia = dFin * k;
    return { dia, inf: Math.min(MUNDO * tope(R0), Math.pow(R0, dia / RONDA)), fin: q >= 1 };
  };
  // «6.457 millones» como dice el narrador, no «6,5 mil millones»
  const LET = .025;  // mortalidad: la de la gripe de 1918 (≈ 1 de cada 40 contagiados)
  const cifra = n => { const EN = COMUN.EN;
    if (n < 1e6) return COMUN.num(n, 0);
    return EN ? (n >= 1e9 ? `${COMUN.num(n / 1e9, 1)} billion` : `${COMUN.num(n / 1e6, 0)} million`) : `${COMUN.num(n / 1e6, 0)} millones`; };
  // siempre en días mientras quepan (las frases hablan en días; en meses solo cuando ya no dice nada)
  const texto = d => { const n = COMUN.num;
    if (d >= 100) return COMUN.EN ? `${n(d / 30.4, 0)} months` : `${n(d / 30.4, 0)} meses`;
    return COMUN.EN ? `${n(d, 0)} days` : `${n(d, 0)} días`; };

  return {
    sinBoom: true,
    crear, fase, actualizar,
    camara: c => yo.camara(c),
    inserto: (c, ef, on) => COMUN.corte.on(c, ef, on),
    // 'enfermo': el contagiado más cercano al protagonista · 'heroe': un plano del protagonista · 'calle': la acera con la gente tumbada
    // si no hay a quién mirar, se queda el plano fijo que trae la fase (fi.pos/fi.mira): nunca devuelve null,
    // porque el motor haría new Vector3(...undefined) y reventaría a media fase
    plano: (c, fi) => {
      const fijo = fi.pos ? { pos: fi.pos, mira: fi.mira } : null;
      if (fi.plano === 'heroe') return yo.camara({ pos: fi.pos, mira: fi.mira, cerca: true });
      if (fi.plano === 'rayos') { verRayos(fi.dur || 2.4); return { pos: [XR[0] + .9, XR[1] + 1.25, XR[2] + 2.1], mira: [XR[0], XR[1] + 1.1, XR[2]] }; }
      const hz = yo.g.position.z, cerca = (a, b) => Math.hypot(a.g.position.x - b.g.position.x, a.g.position.z - b.g.position.z);
      if (fi.plano === 'enfermo') {
        // mejor uno de los que están quietos: los que pasean se salen del plano, que no se mueve mientras dura el corte
        const hay = orden.slice(0, nInf).filter(q => q.enfermo && tiempo > q.enfermo && !q.caer && Math.abs(q.g.position.z - hz) < 70)
          .sort((a, b) => cerca(a, yo) - cerca(b, yo));
        const p = hay.find(q => !q.andar) || hay[0];
        if (!p) return fijo && yo.camara({ ...fijo, cerca: true }); // el plano fijo, movido a donde ya ha llegado el protagonista
        // cada uno mira hacia donde le tocó al crearlo (p.dir es aleatorio), así que la cámara se pone delante de ESTA
        // persona, no en un lado fijo: si no, la mitad de las veces el corte era una espalda y el punto verde del pecho
        // no se veía. Un poco por encima de los ojos y algo ladeada, para que el punto quede por debajo de la frase.
        p.vomita = tiempo + .6;  // en el corte, el enfermo vomita
        const P = p.g.position, a = p.g.rotation.y + .45, d = 3.8;
        return { pos: [P.x + Math.sin(a) * d, ctx.GROUND + 2.6, P.z + Math.cos(a) * d], mira: [P.x, ctx.GROUND + 2.1, P.z] };
      }
      // la acera con la gente tumbada: se enfoca a un cuerpo de verdad, no a un punto de la calle
      if (fi.plano === 'calle') {
        const p = todos.filter(q => (q.caido || q.cae > .4) && Math.abs(q.g.position.z - hz) < 140)
          .sort((a, b) => cerca(a, yo) - cerca(b, yo))[0];
        if (!p) return fijo;
        // en tres cuartos desde el lado de la avenida (siempre despejado): así se ve el suelo y el cuerpo no queda flotando
        const P = p.g.position, lado = P.x > 0 ? -9 : 9;
        return { pos: [P.x + lado, ctx.GROUND + 4.5, P.z - 7], mira: [P.x, ctx.GROUND + .4, P.z] };
      }
      return fijo;
    },
    activo: () => tiempo - t0 < 4 || anillos.length > 0 || reloj.pendientes > 0 || (apagar && apagado < 1),
    mag: v => `R₀ ${COMUN.num(v, 0)}`,
    // tercera línea del marcador: a cuánta gente llega un solo enfermo en dos rondas (seis días).
    // Dos rondas y no tres: con tres, a partir del paso 12 ya sale «todo el planeta» y la línea deja de cambiar.
    linea3: v => {
      const EN = COMUN.EN;
      if (apagar) return EN ? ['KILLS IN A DAY → STAYS HOME', '(and the virus dies with them)'] : ['MATA EN UN DÍA → NO SALE DE CASA', '(y el virus se apaga con él)'];
      if (v <= 1) return EN ? ['IT NEVER TAKES OFF', '(and it never goes away)'] : ['NO ARRANCA NUNCA', '(y nunca se va)'];
      const dos = Math.min(MUNDO, v * v), c = dos < 1e6 ? COMUN.num(dos, 0) : COMUN.grande(dos); // 1.024 y 16.384 enteros, no «1 mil»
      return EN ? [`≈ ${c} people in 6 days`, '(from a single patient)'] : [`≈ ${c}${dos >= 1e6 ? COMUN.DE : ' '}personas en 6 días`, '(a partir de un solo enfermo)'];
    },
    // daños a escala real: cuánto tarda en contagiar al planeta entero y cómo va la ciudad del juego
    danos: () => {
      const EN = COMUN.EN, pc = COMUN.num(Math.round(100 * nInf / orden.length), 0);
      const n = todos.filter(p => p.caer && tiempo > p.retraso).length, cama = COMUN.num(Math.round(100 * n / todos.length), 0);
      if (apagar) return EN ? 'Ebola kills 1 in 2: 28,600 cases · 1918 flu, 1 in 40: 500 million' : 'Ébola, mata a 1 de cada 2: 28.600 casos · Gripe de 1918, a 1 de cada 40: 500 millones';
      const d = dias(R0);
      if (!d) return EN ? 'It never dies out · patient zero still has it' : 'No se apaga nunca · el primer enfermo sigue igual';
      // mientras habla el narrador corre el contador mundial; al acabar queda el resultado de la fase
      const c = cuenta(), dia = COMUN.num(Math.max(1, Math.ceil(c.dia)), 0);
      const m = cifra(Math.floor(c.inf * LET));
      if (!c.fin) return EN ? `Day ${dia} · ${cifra(c.inf)} infected · ${m} dead` : `Día ${dia} · ${cifra(c.inf)} contagiados · ${m} muertos`;
      const z = tope(R0), muertos = cifra(MUNDO * z * LET);
      const todo = z > .99 ? (EN ? `Everyone on Earth in ${texto(d)}` : `Todo el planeta en ${texto(d)}`)
        : (EN ? `${cifra(MUNDO * z)} infected in ${texto(d)}, the rest are immune` : `${cifra(MUNDO * z)} contagiados en ${texto(d)}; el resto ya es inmune`);
      if (planeta) return EN ? `${todo} · ${muertos} dead` : `${todo} · ${muertos} muertos`;
      return EN ? `${todo} · ${muertos} dead` : `${todo} · ${muertos} muertos`;
    },
  };
})();
