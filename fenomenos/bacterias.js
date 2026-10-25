// Bacterias: en cada fase se duplica la velocidad con la que mutan. No explota nada: primero ganan ellas y después
// se deshacen solas al pasar el umbral de error (≈ 1 fallo por copia), y con ellas se para todo lo que sostienen.
// Lo que se ve: un enjambre de bacterias alrededor del protagonista que cambia de color cada vez más rápido
// (cada cambio es una mutación); pasado el umbral, empiezan a reventar y el enjambre se vacía.
// Natural: 0,001 mutaciones por copia del genoma, una copia cada 20 minutos.
// Cifras aproximadas: compruébalas antes de publicar.
window.FENOMENOS.bacterias = (() => {
  const MUT = .001, DIAS = 3650;                  // mutaciones por copia hoy · un antibiótico nuevo aguanta diez años
  const Z0 = [-11, 116];                          // el primer enfermo: en el corrillo de la acera, donde miran las cámaras de calle
  const UMBRAL = 1;                               // umbral de error: más de un fallo por copia y la estirpe se deshace
  // fracción de la ciudad enferma y tumbada según las veces que se ha duplicado la velocidad (log2)
  const ENFERMOS = [0, .02, .05, .1, .18, .28, .4, .52, .64, .74, .82, .88, .94, 1, 1, 1];
  const TUMBADOS = [0, 0, 0, 0, 0, .02, .05, .1, .18, .28, .4, .55, .7, .85, .95, 1];
  const N_ENJ = 420;                              // bacterias del enjambre que se ve
  const reloj = COMUN.reloj();
  let ctx, VEL = 1, t0 = 0, tiempo = 0, gente = [], todos = [], orden = [], planeta = null, yo = null;
  let motas = null, pos = null, nEnf = 0, tos = 0, ambar = null, gris = null;
  let enjambre = null, ePos = null, eCol = null, eVivas = N_ENJ, eBase = null, mutar = 0, resto = 0, esteril = false;
  const est = { muerto: 0, atm: 1, ciudad: 0 }, obj = { muerto: 0, atm: 1, ciudad: 0 };
  let cieloObj = 0x9fd3f0;

  // los colores que va tomando una bacteria al mutar: cada cambio de color es un fallo de copia
  // sin ámbar ni amarillo: son el color de los puntos de los enfermos y de un vistazo se confundían
  const COLORES = [0x7ad1a0, 0x9ad94f, 0xd96a6a, 0xc77ad1, 0x6aa7d9, 0x7ad1c7];

  function crear(c) {
    ctx = c; const T = ctx.THREE;
    ambar = new T.Color(0xffb347); gris = new T.Color(0xb8b2a2);
    COMUN.materiales(ctx);                        // guarda los colores de la ciudad: al final se apaga todo
    yo = COMUN.protagonista(ctx, { x: -11.5, z: 120, vel: .55 });
    gente = COMUN.multitud(ctx, 120, -10, 10, 115, 320, { andar: true });
    todos = gente.concat(ctx.people);
    // un corrillo quieto en la acera, alrededor y por detrás del protagonista: es lo que encuadran las cámaras de calle
    const puestos = [];
    for (let q = 0; q < 16; q++) { const p = gente[q];
      for (let intento = 0; intento < 24; intento++) {
        const x = -12.4 + ctx.rr(0, 3), z = 104 + ctx.rr(0, 21);
        if (intento < 23 && puestos.some(o => Math.hypot(o[0] - x, o[1] - z) < 1.1)) continue;
        p.x = x; p.z = z; puestos.push([x, z]); break;
      }
      p.andar = q % 4 === 0 ? ctx.rr(.25, .45) : 0;
      p.dir = ctx.rr(0, 6.28);
      p.g.position.set(p.x, ctx.groundAt(p.x, p.z), p.z); p.g.rotation.y = p.dir; p.y0 = p.g.position.y; }
    orden = todos.slice().sort((a, b) => Math.hypot(a.x - Z0[0], a.z - Z0[1]) - Math.hypot(b.x - Z0[0], b.z - Z0[1]));
    // textura redonda para los puntos (el cuadrado de PointsMaterial se nota mucho sobre el asfalto claro)
    const cv = document.createElement('canvas'); cv.width = cv.height = 64;
    const g2 = cv.getContext('2d'), gr = g2.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.35, 'rgba(255,255,255,.9)');
    gr.addColorStop(.75, 'rgba(255,255,255,.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g2.fillStyle = gr; g2.beginPath(); g2.arc(32, 32, 32, 0, 6.2832); g2.fill();
    const redondo = new T.CanvasTexture(cv);
    // un punto ámbar en cada enfermo (una sola nube: 430 mallas sueltas no las mueve un iPhone)
    pos = new Float32Array(todos.length * 3);
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(pos, 3)); g.setDrawRange(0, 0);
    // más grandes que las del enjambre: si no, con 420 bacterias de colores alrededor no se distinguen
    motas = new T.Points(g, new T.PointsMaterial({ map: redondo, color: 0xffb347, size: 1.6, transparent: true, opacity: .95, depthWrite: false, fog: false }));
    motas.frustumCulled = false; motas.userData.fenPropio = true; ctx.scene.add(motas);
    // el enjambre: bacterias flotando alrededor de lo que mira la cámara, cada una con su color
    ePos = new Float32Array(N_ENJ * 3); eCol = new Float32Array(N_ENJ * 3); eBase = new Float32Array(N_ENJ * 3);
    const col = new T.Color();
    for (let q = 0; q < N_ENJ; q++) {
      // posición en una esfera alrededor del centro, guardada en unidades de radio (se escala con la distancia de cámara)
      const u = ctx.rr(-1, 1), a = ctx.rr(0, 6.283), r = Math.sqrt(1 - u * u), d = Math.cbrt(ctx.rr(.05, 1));
      eBase[q * 3] = r * Math.cos(a) * d; eBase[q * 3 + 1] = u * d * .6; eBase[q * 3 + 2] = r * Math.sin(a) * d;
      col.set(COLORES[q % COLORES.length]); eCol[q * 3] = col.r; eCol[q * 3 + 1] = col.g; eCol[q * 3 + 2] = col.b;
    }
    const ge = new T.BufferGeometry();
    ge.setAttribute('position', new T.BufferAttribute(ePos, 3));
    ge.setAttribute('color', new T.BufferAttribute(eCol, 3));
    enjambre = new T.Points(ge, new T.PointsMaterial({ map: redondo, vertexColors: true, size: .55, transparent: true, opacity: .85, depthWrite: false, fog: false }));
    enjambre.frustumCulled = false; enjambre.userData.fenPropio = true; ctx.scene.add(enjambre);
  }

  function fase(c, n, valor, f) {
    VEL = valor; t0 = tiempo;
    const i = Math.max(0, Math.min(ENFERMOS.length - 1, Math.round(Math.log2(Math.max(1, VEL)))));
    const quiero = Math.round(ENFERMOS[i] * orden.length) || (i ? 1 : 0);
    for (; nEnf < quiero; nEnf++) orden[nEnf].enfermo = tiempo + ctx.rr(0, .7);
    const cae = TUMBADOS[i];
    for (const p of orden.slice(0, nEnf)) {
      p.lento = i >= 6 ? Math.max(.2, 1 - (i - 5) * .14) : 1; if (p.andar == null) p.andar = 0;
      if (!p.caer && ctx.R() < cae) { p.caer = ctx.rr(.6, 2.4); p.retraso = tiempo + ctx.rr(.2, 2.4); }
    }
    // cada duplicación son el doble de cambios de color por segundo; a partir del umbral también revientan.
    // El suelo de 8 por segundo es para que a ×1 ya se vea parpadear alguna, y el techo está alto (seis vueltas
    // al enjambre por segundo) para que no deje de acelerar a mitad del vídeo.
    mutar = Math.min(2600, 8 + 1.2 * VEL);
    const pasado = MUT * VEL / UMBRAL;            // 1 = justo en el umbral de error
    // a los 7 fallos por copia ya no queda nada: así se ve cómo se vacía el enjambre antes de irnos al espacio
    if (pasado > 1) obj.muerto = Math.min(1, (pasado - 1) / 7);
    // la ciudad se apaga por pasos y no según los fallos: atada a los fallos no se notaba hasta que la cámara
    // ya estaba a cuatro kilómetros y la ciudad era una miniatura
    obj.ciudad = Math.max(0, Math.min(1, (i - 8) / 4));          // la ciudad empieza a apagarse desde la fase 9: si arranca en la 11 no se llega a leer
    // el protagonista: aguanta hasta que se le deshacen las suyas
    yo.est.lento = i >= 13 ? .15 : i >= 11 ? .4 : i >= 8 ? .7 : 1;
    yo.est.cabeza = i >= 11 ? .22 : i >= 8 ? .1 : 0;
    tos = i >= 7 ? Math.min(1, (i - 6) / 6) : 0;
    if (i >= 14 && !yo.est.caer) reloj.luego(1.4, () => { yo.est.caer = true; });
    cieloObj = i >= 13 ? 0x8a8070 : i >= 11 ? 0xa8a290 : i >= 7 ? 0xc0c4ae : 0x9fd3f0;
    // desde el espacio: la Tierra se queda gris y el halo de aire se va apagando
    if (f.planeta && !planeta) { planeta = COMUN.planeta(ctx); cieloObj = 0x05070c; motas.visible = false; enjambre.visible = false; }
    if (planeta) obj.atm = pasado > 20 ? 0 : .35;   // en el último paso el halo de aire se apaga del todo
    if (planeta && pasado > 20) esterilizar();
    COMUN.tono(ctx, 150, 100, 2.2, 'sine', .11);
    COMUN.ruido(ctx, 1.2, 3200, .06);
  }

  // La Tierra estéril: los continentes se quedan grises. El color de la esfera va en los vértices, así que teñir()
  // solo la oscurece (multiplica); hay que pasar los propios vértices a su luminancia para que pierdan el color.
  function esterilizar() {
    if (!planeta || esteril) return; esteril = true;
    for (const hf of planeta.halves) {
      const a = hf.m.geometry.attributes.color;
      for (let i = 0; i < a.count; i++) {
        const l = a.getX(i) * .3 + a.getY(i) * .59 + a.getZ(i) * .11;   // luminancia: mantiene el relieve, quita el color
        a.setXYZ(i, l * .95 + .05, l * .93 + .05, l * .88 + .04);
      }
      a.needsUpdate = true;
      hf.m.material.color.set(0xffffff);                                 // ya no hace falta teñir por encima
    }
  }

  // revienta una bacteria del enjambre: se cambia por la última viva y se deja de pintar
  function reventar(q) {
    const u = --eVivas;
    for (let k = 0; k < 3; k++) { const a = ePos[q * 3 + k]; ePos[q * 3 + k] = ePos[u * 3 + k]; ePos[u * 3 + k] = a;
      const b = eBase[q * 3 + k]; eBase[q * 3 + k] = eBase[u * 3 + k]; eBase[u * 3 + k] = b;
      const c = eCol[q * 3 + k]; eCol[q * 3 + k] = eCol[u * 3 + k]; eCol[u * 3 + k] = c; }
  }

  function actualizar(c, dt, t) {
    tiempo = t; reloj.tick(t); yo.actualizar(dt, t);
    COMUN.corte.tick(ctx, dt);
    const k = 1 - Math.exp(-dt * 1.1);
    for (const key in est) est[key] += (obj[key] - est[key]) * k;
    if (!ctx.corte) ctx.skyT.set(cieloObj);
    ctx.setShake(0);
    // la ciudad se apaga cuando se para el suelo: nada crece y nada se pudre.
    // Gris de verdad (0x8a8a8a): con un beige cálido la ciudad solo se oscurecía y seguía igual de viva.
    if (est.ciudad > .01 && !planeta) COMUN.tintar(ctx, 0x8a8a8a, est.ciudad * .8);
    // el protagonista tose
    if (tos) { const ciclo = (t % 4.5) / 4.5, golpe = ciclo < .18 ? Math.sin(ciclo / .18 * Math.PI) : 0;
      yo.est.hablar = golpe * .8 * tos; yo.est.tiembla = golpe * tos; } else { yo.est.hablar = 0; yo.est.tiembla = 0; }
    for (const p of todos) if (p.caer && tiempo > p.retraso && !p.caido) { p.cae = Math.min(1, (p.cae || 0) + dt / p.caer);
      p.g.rotation.x = -Math.PI / 2 * p.cae * p.cae; if (p.cae >= 1) p.caido = true; }
    COMUN.moverGente(ctx, gente.filter(p => !p.caer || tiempo < p.retraso), dt, t);
    // un punto ámbar a la altura del pecho de cada enfermo (más arriba se iría detrás del marcador y la frase)
    if (motas.visible) {
      let j = 0;
      for (let q = 0; q < nEnf; q++) { const p = orden[q]; if (!p.enfermo || tiempo < p.enfermo) continue;
        const m = p.g, alto = p.caido || (p.cae > .5) ? .4 : 1.25;
        pos[j * 3] = m.position.x; pos[j * 3 + 1] = m.position.y + alto + Math.sin(t * 3 + q) * .05; pos[j * 3 + 2] = m.position.z; j++; }
      motas.geometry.setDrawRange(0, j); motas.geometry.attributes.position.needsUpdate = true;
      motas.material.opacity = .55 + .35 * Math.abs(Math.sin(t * 2.2));
    }
    // el enjambre: flota alrededor de lo que mira la cámara y cambia de color tantas veces por segundo como diga la velocidad
    if (enjambre.visible) {
      // el enjambre crece con la distancia de cámara: con el tope en 90 m desaparecía en los planos aéreos,
      // que es justo donde se tiene que ver cómo se vacía
      const R = Math.max(3, Math.min(400, ctx.camDist * .16));
      const ojo = ctx.corte ? ctx.corte.p : ctx.camPos, fin = ctx.corte ? ctx.corte.t : ctx.camTgt;
      // en los planos aéreos el punto al que mira la cámara cae dentro de la ciudad y los edificios tapaban el enjambre:
      // desde lejos se pone a media distancia, en el aire libre que hay delante del objetivo
      const d = ctx.camDist > 60 ? .45 : 1, C0 = { x: ojo.x + (fin.x - ojo.x) * d, y: ojo.y + (fin.y - ojo.y) * d, z: ojo.z + (fin.z - ojo.z) * d };
      for (let q = 0; q < eVivas; q++) {
        const f = t * .35 + q;
        let x = eBase[q * 3] * R + Math.sin(f) * R * .03,
          y = eBase[q * 3 + 1] * R + Math.sin(f * 1.3) * R * .03,
          z = eBase[q * 3 + 2] * R + Math.cos(f * .9) * R * .03;
        // la que se queda pegada al objetivo se pone al otro lado: delante de la lente tapaba el plano con un borrón
        if (Math.hypot(C0.x + x - ojo.x, C0.y + y - ojo.y, C0.z + z - ojo.z) < 1.8) { x = -x; y = -y; z = -z; }
        ePos[q * 3] = C0.x + x; ePos[q * 3 + 1] = C0.y + y; ePos[q * 3 + 2] = C0.z + z;
      }
      // mutaciones: a cada una le toca un color nuevo (el resto se acumula para que a ×1 también se vea alguna)
      resto += mutar * dt;
      const cuantas = Math.min(eVivas, Math.floor(resto)); resto -= cuantas;
      const col = new ctx.THREE.Color();
      for (let m = 0; m < cuantas; m++) { const q = Math.floor(ctx.R() * eVivas);
        col.set(COLORES[Math.floor(ctx.R() * COLORES.length)]);
        eCol[q * 3] = col.r; eCol[q * 3 + 1] = col.g; eCol[q * 3 + 2] = col.b; }
      // pasado el umbral revientan: una parte del enjambre se queda por el camino
      const quedan = Math.max(6, Math.round(N_ENJ * (1 - est.muerto * .99)));
      while (eVivas > quedan) { const q = Math.floor(ctx.R() * eVivas), x = ePos[q * 3], y = ePos[q * 3 + 1], z = ePos[q * 3 + 2];
        for (let e = 0; e < 3; e++) ctx.emit(x, y, z, ctx.rr(-2, 2), ctx.rr(-2, 2), ctx.rr(-2, 2), ambar, Math.max(.3, R * .02), 0);
        reventar(q); }
      enjambre.geometry.setDrawRange(0, eVivas);
      enjambre.geometry.attributes.position.needsUpdate = true;
      enjambre.geometry.attributes.color.needsUpdate = true;
      enjambre.material.size = Math.max(.25, Math.min(40, R * .07));
    }
    if (planeta) { planeta.update(dt); if (!esteril) planeta.teñir(0x8c8575, .55 + est.muerto * .4);
      planeta.nubes.material.color.set(0xffffff).lerp(gris, .7);
      planeta.atm.material.opacity = .18 * est.atm; }
  }

  // lo que aguanta un antibiótico nuevo: diez años partidos por la velocidad de mutación
  const aguanta = v => DIAS / v;
  // Los cortes están puestos para que la unidad del marcador sea la misma que dice el titular de la fase:
  // años desde dos años (730 días), meses desde mes y medio (50 días), y con un decimal mientras ayude.
  const texto = d => { const n = COMUN.num, EN = COMUN.EN;
    if (d >= 730) { const a = d / 365; return EN ? `${n(a, a < 10 ? 1 : 0)} years` : `${n(a, a < 10 ? 1 : 0)} años`; }
    if (d >= 50) { const m = d / 30.4; return EN ? `${n(m, m < 10 ? 1 : 0)} months` : `${n(m, m < 10 ? 1 : 0)} meses`; }
    if (d >= 1) return EN ? `${n(d, 0)} days` : `${n(d, 0)} días`;
    return EN ? `${n(d * 24, 0)} hours` : `${n(d * 24, 0)} horas`; };
  // «1 fallos por copia» quedaba justo debajo de un titular que dice UN FALLO POR COPIA
  const fallos = n => COMUN.EN ? `${n} mistake${n === '1' ? '' : 's'} per copy` : `${n} fallo${n === '1' ? '' : 's'} por copia`;
  const cuantos = m => COMUN.num(m, m < 1 ? 3 : 1);

  return {
    sinBoom: true,
    crear, fase, actualizar,
    camara: c => yo.camara(c),
    inserto: (c, ef, on) => COMUN.corte.on(c, ef, on),
    // 'enfermo': el enfermo más cercano al protagonista · 'heroe': un plano del protagonista · 'calle': un cuerpo en la acera.
    // Si no hay a quién mirar se queda el plano fijo de la fase (fi.pos/fi.mira): nunca devuelve null, porque el motor
    // haría new Vector3(...undefined) y reventaría a media fase.
    plano: (c, fi) => {
      const fijo = fi.pos ? { pos: fi.pos, mira: fi.mira } : null;
      if (fi.plano === 'heroe') return yo.camara({ pos: fi.pos, mira: fi.mira, cerca: true });
      const hz = yo.g.position.z, cerca = (a, b) => Math.hypot(a.g.position.x - b.g.position.x, a.g.position.z - b.g.position.z);
      if (fi.plano === 'enfermo') {
        const hay = orden.slice(0, nEnf).filter(q => q.enfermo && tiempo > q.enfermo && !q.caer && Math.abs(q.g.position.z - hz) < 70)
          .sort((a, b) => cerca(a, yo) - cerca(b, yo));
        const p = hay.find(q => !q.andar) || hay[0];
        if (!p) return fijo && yo.camara({ ...fijo, cerca: true });
        // por delante (la multitud camina hacia +z): desde atrás solo se le veía la espalda.
        // Y algo escorado a la derecha, que es la única columna del encuadre que no tapa la frase.
        const P = p.g.position;
        return { pos: [P.x + 3.4, ctx.GROUND + 3, P.z + 3.4], mira: [P.x - .9, ctx.GROUND + .9, P.z] };
      }
      if (fi.plano === 'calle') {
        // uno que esté en la acera o la calzada, no en el césped de detrás, y de cerca: de lejos no se distinguía
        const caidos = todos.filter(q => (q.caido || q.cae > .4) && Math.abs(q.g.position.z - hz) < 140)
          .sort((a, b) => cerca(a, yo) - cerca(b, yo));
        const p = caidos.find(q => Math.abs(q.g.position.x) < 13) || caidos[0];
        if (!p) return fijo;
        const P = p.g.position, lado = P.x > 0 ? -6 : 6;
        return { pos: [P.x + lado, ctx.GROUND + 3.2, P.z - 4.5], mira: [P.x, ctx.GROUND + .4, P.z] };
      }
      return fijo;
    },
    activo: () => tiempo - t0 < 4 || reloj.pendientes > 0,
    mag: v => `×${COMUN.num(v, 0)}`,
    // tercera línea: fallos por copia, que es lo que de verdad se está duplicando
    linea3: v => COMUN.EN ? [fallos(cuantos(MUT * v)), '(0.001 is normal · one copy every 20 min)']
      : [fallos(cuantos(MUT * v)), '(lo normal es 0,001 · una copia cada 20 min)'],
    // daños a escala real: lo que aguanta un antibiótico nuevo, hasta que se cruza el umbral y se deshacen ellas
    danos: () => {
      const EN = COMUN.EN, m = MUT * VEL;
      const n = todos.filter(p => p.caer && tiempo > p.retraso).length, cama = COMUN.num(Math.round(100 * n / todos.length), 0);
      if (planeta) return EN ? 'Planet Earth: sterile · the air stops being topped up' : 'Planeta Tierra: estéril · el aire no se repone';
      if (m > UMBRAL) return EN ? `Past the error threshold · ${fallos(cuantos(m))} · city ${cama}% in bed`
        : `Pasado el umbral de error · ${fallos(cuantos(m))} · ciudad ${cama} % en la cama`;
      const t = texto(aguanta(VEL));
      return EN ? `A new antibiotic lasts ${t} · city ${cama}% in bed` : `Un antibiótico nuevo aguanta ${t} · ciudad ${cama} % en la cama`;
    },
  };
})();
