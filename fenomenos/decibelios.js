// Decibelios: alguien grita "¡BOMBOCLAT!" cada vez más fuerte en mitad de la calle.
// Presión a 1 m: p = 20 µPa · 10^(dB/20). Potencia del grito: 4π · 10^-12 · 10^(dB/10) W (intensidad a 1 m).
// Por encima de unos 194 dB la onda es de choque: se trata como sobrepresión p/r (cristales ~1 kPa, edificios ~35 kPa).
window.FENOMENOS.decibelios = (() => {
  const POS = [0, 0, 520]; // dónde está quien grita (calle central, junto al mar)
  const reloj = COMUN.reloj();
  let ctxRef, stage, quien, cabeza, burbuja, gente = [], ondas = [], dB = 0, t0 = 0, tiempo = 0, gritando = false, ventanas = 0, planeta = null, edif = [];
  const vatios = L => 4 * Math.PI * 1e-12 * Math.pow(10, L / 10);
  const presion = L => 20e-6 * Math.pow(10, L / 20); // Pa a 1 m

  function crear(ctx) {
    const T = ctx.THREE; POS[1] = ctx.GROUND; ctxRef = ctx; stage = document.getElementById('stage');
    quien = new T.Group(); quien.position.set(...POS); quien.rotation.y = 0;
    const fig = COMUN.persona(ctx, 0xffd23f); quien.add(fig); cabeza = fig.userData.cabeza; cabeza.scale.setScalar(.34);
    const boca = new T.Mesh(ctx.BOX, ctx.mat(0x3a1a1a)); boca.scale.set(.14, .06, .02); boca.position.set(0, 1.58, .17); quien.add(boca); quien.userData.boca = boca;
    ctx.cityGroup.add(quien);
    gente = COMUN.multitud(ctx, 70, -10, 10, 470, 640, { andar: true });
    for (const p of gente) if (Math.hypot(p.x - POS[0], p.z - POS[2]) < 3) { p.x += 4; p.g.position.x = p.x; }
    edif = COMUN.edificios(ctx);
    burbuja = document.createElement('div');
    Object.assign(burbuja.style, { position: 'absolute', transform: 'translate(-50%,-100%) scale(.2)', fontFamily: "'Archivo Black', Inter, sans-serif", color: '#ffd23f',
      fontSize: '1.1em', whiteSpace: 'nowrap', pointerEvents: 'none', opacity: 0, transition: 'opacity .25s', textShadow: '0 .06em .2em rgba(0,0,0,.6)' });
    burbuja.textContent = '¡BOMBOCLAT!'; stage.appendChild(burbuja);
  }

  // anillo de sonido: esfera transparente que se expande desde la boca
  function onda(ctx, radio, dur, color = 0xffffff, op = .35) {
    const T = ctx.THREE, m = new T.Mesh(new T.SphereGeometry(1, 32, 16), new T.MeshBasicMaterial({ color, transparent: true, opacity: op, depthWrite: false, side: T.DoubleSide, wireframe: radio < 50 }));
    m.position.set(POS[0], POS[1] + 1.6, POS[2]); m.userData.fenPropio = true; m.scale.setScalar(.01); ctx.scene.add(m);
    ondas.push({ m, radio, dur, t: 0, op });
  }

  function gritar(ctx, L) {
    const g = Math.min(.9, .04 + Math.max(0, L - 10) * .006);
    COMUN.tono(ctx, 150, 95, .2, 'square', g * .6, 0); COMUN.tono(ctx, 140, 90, .2, 'square', g * .6, .24);
    COMUN.ruido(ctx, .22, 2600, g, .5, 'highpass'); COMUN.tono(ctx, 320, 180, .25, 'sawtooth', g * .5, .5);
    if (L >= 200) { ctx.boom(10); COMUN.ruido(ctx, 4, 200, .9, .5); }
  }

  function fase(ctx, n, valor, f) {
    dB = valor; t0 = tiempo; gritando = true;
    const visual = Math.max(.6, Math.min(4000, Math.pow(10, (dB - 35) / 20)));
    reloj.luego(.5, () => {
      gritar(ctx, dB);
      burbuja.style.fontSize = (0.7 + n * .25) + 'em';
      if (dB < 200) for (let k = 0; k < 3; k++) reloj.luego(k * .18, () => onda(ctx, visual, 1.4 + Math.log10(visual + 1) * .3));
      else if (!f.planeta) { onda(ctx, 3500, 3.2, 0xffffff, .5); onda(ctx, 1200, 2.2, 0xfff2c0, .4); }
      reaccionar(ctx, f);
    });
    if (f.planeta) { planeta = COMUN.planeta(ctx); }
  }

  function reaccionar(ctx, f) {
    const T = ctx.THREE, p1 = presion(dB);
    for (const p of [...gente, ...ctx.people]) {
      if (p.state === 2) continue;
      const r = Math.max(1, Math.hypot(p.x - POS[0], p.z - POS[2])), L = dB - 20 * Math.log10(r);
      const haciaEl = Math.atan2(POS[0] - p.x, POS[2] - p.z);
      if (dB >= 200 && r < Math.min(2000, p1 / 35e3 * 3)) { // la onda de choque se los lleva
        const d = new T.Vector3(p.x - POS[0], 0, p.z - POS[2]).normalize().multiplyScalar(ctx.rr(20, 60)); d.y = ctx.rr(5, 15);
        ctx.derribar(p, d, { float: false });
      } else if (L > 85) { p.huir = haciaEl + Math.PI + ctx.rr(-.5, .5); p.andar = 1; }
      else if (L > 40) { p.andar = 0; p.g.rotation.y = haciaEl; p.mira = haciaEl; }
    }
    if (dB < 200) return;
    // onda de choque: derrumbes y ventanas
    for (const o of edif) {
      if (o.state === 2) continue;
      const r = Math.max(1, Math.hypot(o.x - POS[0], o.z - POS[2]) - o.w / 2), p = p1 / r;
      const retraso = r / 340 * .35; // la onda llega antes a lo cercano (tiempo acortado para el vídeo)
      if (p > 35e3) reloj.luego(retraso, () => {
        const dir = new T.Vector3(o.x - POS[0], 0, o.z - POS[2]).normalize();
        COMUN.derribar(ctx, o, dir.clone().multiplyScalar(ctx.rr(10, 40) * Math.min(4, p / 35e3)).add(new T.Vector3(0, ctx.rr(2, 12), 0)), { polvo: 20 });
      });
      else if (p > 1e3) reloj.luego(retraso, () => { ventanas += Math.round(o.w * o.h / 40);
        for (let q = 0; q < 14; q++) ctx.emit(o.x + ctx.rr(-.5, .5) * o.w, o.y0 + ctx.rr(0, o.h), o.z + ctx.rr(-.5, .5) * o.d, ctx.rr(-4, 4), ctx.rr(0, 5), ctx.rr(-4, 4), CR(ctx), ctx.rr(1, 2), 9.8);
      });
    }
    for (const o of ctx.objects) if ((o.kind === 'car' || o.kind === 'tree' || o.kind === 'palm') && o.state !== 2) {
      const r = Math.max(1, Math.hypot(o.x - POS[0], o.z - POS[2])); if (p1 / r < 35e3) continue;
      const d = new T.Vector3(o.x - POS[0], 0, o.z - POS[2]).normalize().multiplyScalar(ctx.rr(15, 50)); d.y = ctx.rr(3, 12);
      reloj.luego(r / 340 * .35, () => ctx.derribar(o, d, { float: false }));
    }
    // anillo de polvo a ras de suelo
    for (let k = 0; k < 900; k++) { const a = ctx.rr(0, 6.283), v = ctx.rr(150, 420);
      ctx.emit(POS[0] + Math.sin(a) * 5, POS[1] + ctx.rr(0, 8), POS[2] + Math.cos(a) * 5, Math.sin(a) * v, ctx.rr(0, 25), Math.cos(a) * v, DUST(ctx), ctx.rr(2.5, 4.5), 2); }
  }
  let _cr, _du;
  const CR = ctx => _cr ||= new ctx.THREE.Color(0xd8f4ff), DUST = ctx => _du ||= new ctx.THREE.Color(0xc9b99c);

  function actualizar(ctx, dt, t) {
    tiempo = t; reloj.tick(t); const e = t - t0;
    ctx.skyT.set(dB >= 200 && e > .6 ? 0xc9b89a : 0x9fd3f0);
    // boca abierta y burbuja mientras grita
    const grita = e > .5 && e < 1.3;
    quien.userData.boca.scale.y = grita ? .06 + Math.abs(Math.sin(e * 22)) * .1 : .03;
    cabeza.rotation.x = grita ? -.2 : 0;
    const v = quien.position.clone(); v.y += 2.2; v.project(ctx.camera);
    const r = stage.getBoundingClientRect(), vis = grita && v.z < 1 && Math.abs(v.x) < 1.2 && Math.abs(v.y) < 1.2 && dB < 400;
    burbuja.style.opacity = vis ? 1 : 0;
    if (vis) { burbuja.style.left = ((v.x + 1) / 2 * r.width) + 'px'; burbuja.style.top = Math.max(r.height * .3, (1 - v.y) / 2 * r.height) + 'px';
      burbuja.style.transform = `translate(-50%,-100%) scale(${Math.min(1, .3 + (e - .5) * 4)}) rotate(-4deg)`; }
    for (let i = ondas.length - 1; i >= 0; i--) { const o = ondas[i]; o.t += dt; const k = Math.min(1, o.t / o.dur);
      o.m.scale.setScalar(.01 + o.radio * (1 - Math.pow(1 - k, 2))); o.m.material.opacity = o.op * (1 - k);
      if (k >= 1) { ctx.scene.remove(o.m); o.m.geometry.dispose(); o.m.material.dispose(); ondas.splice(i, 1); } }
    COMUN.moverGente(ctx, gente.concat(ctx.people), dt, t);
    const choque = dB >= 200 && e > .5 && e < 2.5 ? (1 - (e - .5) / 2) : 0;
    ctx.setShake(choque * ctx.camDist * .01);
    if (planeta) { planeta.update(dt);
      if (e > 3.4 && !planeta.rota) { planeta.rota = true; planeta.partir(.35); COMUN.estallarPlaneta(ctx, 2200, 0xfff3c4); gritar(ctx, 300); } }
  }

  return {
    sinBoom: true,
    crear, fase, actualizar,
    activo: () => tiempo - t0 < (dB >= 200 ? 5 : 2.6) || (planeta && planeta.split < .9),
    mag: v => `${COMUN.num(v, 0)} dB`,
    linea3(v) {
      const W = vatios(v), t = W / COMUN.TNT_J;
      let cmp;
      if (W < 1e-6) cmp = `${COMUN.num(W * 1e9)} nanovatios`;
      else if (W < 1e-3) cmp = `${COMUN.num(W * 1e6)} microvatios`;
      else if (W < 1) cmp = `${COMUN.num(W * 1e3)} milivatios`;
      else if (W < 1e3) cmp = `${COMUN.num(W)} vatios: como una bombilla LED`;
      else if (W < 1e18) cmp = `una bomba de Hiroshima cada ${COMUN.num(15000 / t)} segundos`;
      else cmp = `${COMUN.grande(W / 3.8e26)} de veces la potencia del Sol`;
      return [`≈ ${COMUN.textoTNT(t)} por segundo`, `(${cmp})`];
    },
    danos: () => `${COMUN.num(ventanas, 0)} ventanas rotas · ${COMUN.num(ctxRef.caidos, 0)} edificios caídos`,
  };
})();
