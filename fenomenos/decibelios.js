// Decibelios: alguien va por la acera gritando "BOMBOCLAT" y cada grito suena el doble de fuerte (+10 dB).
// Presión a 1 m: p = 20 µPa · 10^(dB/20). Potencia del grito: 4π · 10^-12 · 10^(dB/10) W (intensidad a 1 m).
// Por encima de unos 194 dB la onda es de choque: se trata como sobrepresión p/r (cristales ~1 kPa, edificios ~35 kPa).
// Cada fase (f) puede llevar: espacio (la cámara sale al espacio), brillo [k, ke] (la Tierra se pone al rojo),
// sinAire (se va la atmósfera), planeta (la Tierra explota) y final (0 dB: el protagonista flota en el espacio).
window.FENOMENOS.decibelios = (() => {
  const X0 = -11.5, Z0 = 120, VEL = 1.25; // acera oeste de la avenida central; anda hacia el norte (z+)
  const reloj = COMUN.reloj();
  let ctxRef, stage, quien, cabeza, boca, burbuja, gente = [], ondas = [], dB = 0, t0 = 0, tiempo = 0, ventanas = 0, caidos0 = 0;
  let efectos = [], grietas = null, planeta = null, explota = 0, astronauta = null, andar = true, zAndado = 0, fActual = {}, cupula = null, brillo = [0, 0], brilloObj = [0, 0];
  const vatios = L => 4 * Math.PI * 1e-12 * Math.pow(10, L / 10);
  const presion = L => 20e-6 * Math.pow(10, L / 20); // Pa a 1 m
  const pos = () => quien.position;

  function crear(ctx) {
    const T = ctx.THREE; ctxRef = ctx; stage = document.getElementById('stage');
    quien = new T.Group(); quien.position.set(X0, ctx.GROUND, Z0);
    const fig = COMUN.heroe(ctx, 0xd8282f); quien.add(fig); cabeza = fig.userData.cabeza; boca = fig.userData.boca;
    ctx.cityGroup.add(quien);
    // gente paseando por las dos aceras y la calzada (en este tramo no hay coches)
    gente = COMUN.multitud(ctx, 46, -15, -3, 100, 260, { andar: true }).concat(COMUN.multitud(ctx, 24, 3, 15, 100, 260, { andar: true }));
    for (const p of gente) { if (Math.abs(p.x - X0) < 1.5 && p.z > Z0 - 4 && p.z < Z0 + 60) { p.x += 3; p.g.position.x = p.x; } p.g.traverse(m => { if (m.isMesh) m.castShadow = true; }); }
    burbuja = document.createElement('div');
    Object.assign(burbuja.style, { position: 'absolute', transform: 'translate(-50%,-100%) scale(.2)', fontFamily: "'Archivo Black', Inter, sans-serif", color: '#ffd23f',
      fontSize: '1.1em', whiteSpace: 'nowrap', pointerEvents: 'none', opacity: 0, transition: 'opacity .2s', textShadow: '0 .06em .2em rgba(0,0,0,.6)' });
    burbuja.textContent = COMUN.EN ? 'BOMBOCLAT!' : '¡BOMBOCLAT!'; stage.appendChild(burbuja);
  }

  // anillo de sonido: esfera transparente que se expande desde la boca
  function onda(ctx, radio, dur, color = 0xffffff, op = .35) {
    const T = ctx.THREE, m = new T.Mesh(new T.SphereGeometry(1, 32, 16), new T.MeshBasicMaterial({ color, transparent: true, opacity: op, depthWrite: false, side: T.DoubleSide, wireframe: radio < 50 }));
    m.position.copy(pos()); m.position.y += 1.6; m.userData.fenPropio = true; m.scale.setScalar(.01); ctx.scene.add(m);
    ondas.push({ m, radio, dur, t: 0, op });
  }

  // cúpula de polvo marrón que crece y se disipa, y un cráter oscuro con borde claro donde estaba
  function polvo(ctx, r) {
    const T = ctx.THREE, P = pos();
    const domo = new T.Mesh(new T.SphereGeometry(1, 36, 14, 0, Math.PI * 2, 0, Math.PI / 2), new T.MeshStandardMaterial({ color: 0x9a7a58, transparent: true, opacity: .7, flatShading: true, roughness: 1, depthWrite: false }));
    domo.position.set(P.x, P.y - .2, P.z); domo.userData.fenPropio = true; ctx.scene.add(domo);
    const crater = new T.Mesh(new T.CircleGeometry(1, 40), new T.MeshStandardMaterial({ color: 0x3a2e26, roughness: 1, transparent: true, opacity: .92, polygonOffset: true, polygonOffsetFactor: -2 }));
    crater.rotation.x = -Math.PI / 2; crater.position.set(P.x, P.y + .15, P.z); crater.scale.setScalar(.01); crater.userData.fenPropio = true; ctx.scene.add(crater);
    const borde = new T.Mesh(new T.RingGeometry(.92, 1.08, 48), new T.MeshBasicMaterial({ color: 0xe8d8b8, transparent: true, opacity: .8, side: T.DoubleSide, depthWrite: false }));
    borde.rotation.x = -Math.PI / 2; borde.position.set(P.x, P.y + .3, P.z); borde.scale.setScalar(.01); borde.userData.fenPropio = true; ctx.scene.add(borde);
    efectos.push({ domo, crater, borde, r, t: 0 });
  }

  function gritar(ctx, L) {
    const g = Math.min(1, .25 + Math.max(0, L - 60) * .006);
    ctx.sfx('grito', g, 0, L > 250 ? .82 : L > 180 ? .92 : 1); // grito grabado (audio/sfx/grito.mp3)
    if (L >= 194) ctx.sfx('impacto', Math.min(1, .4 + (L - 194) * .01), .05, L > 260 ? .75 : 1);
    if (L >= 200) { ctx.boom(10); COMUN.ruido(ctx, 4, 200, .9, .1); }
  }

  // las cámaras del escenario están puestas respecto a donde empieza a andar: se mueven con él
  function camara(c) { const P = pos(), d = [P.x - X0, P.y, P.z - Z0], m = v => v.map((x, i) => x + d[i]); return { ...c, pos: m(c.pos), mira: m(c.mira) }; }

  function fase(ctx, n, valor, f) {
    dB = valor; t0 = tiempo; fActual = f; caidos0 = ctx.caidos;
    if (dB >= 150 || f.espacio || f.final) andar = false;
    burbuja.textContent = COMUN.EN ? 'BOMBOCLAT!' : '¡BOMBOCLAT!';
    if (f.final) { // en el espacio no hay sonido: el protagonista flota entre los restos
      const T = ctx.THREE; astronauta = COMUN.heroe(ctx, 0xd8282f); astronauta.userData.andar(1.2, .9); astronauta.scale.setScalar(1300); astronauta.userData.fenPropio = true; ctx.scene.add(astronauta);
      return;
    }
    if (f.brillo) brilloObj = f.brillo;
    if (f.espacio || f.planeta) { planeta = COMUN.planeta(ctx); if (f.planeta) planeta.mostrar(); } // en espacio aparece sola al alejarse
    if (f.sinAire && planeta) planeta.atm.visible = false;
    if (f.planeta) explota = tiempo + .6;
    reloj.luego(.25, () => {
      gritar(ctx, dB);
      burbuja.style.fontSize = Math.min(2.4, .55 + Math.max(0, dB - 60) * .012) + 'em';
      const visual = Math.max(.6, Math.min(30, Math.pow(10, (dB - 60) / 40)));
      if (dB < 194) for (let k = 0; k < 3; k++) reloj.luego(k * .15, () => onda(ctx, visual * (1 + k * .4), 1.2));
      else if (!f.espacio && !f.planeta) {
        const rCae = Math.min(3e5, presion(dB) / 35e3), rCri = Math.min(3e6, presion(dB) / 1e3);
        onda(ctx, rCae * 1.1, 2.4, 0xffffff, .55); onda(ctx, Math.max(rCae * 3, Math.min(rCri, rCae * 30)), 3, 0xfff2c0, .25);
        if (dB >= 220) polvo(ctx, Math.max(40, rCae));
      }
      if (!f.espacio && !f.planeta) reaccionar(ctx, f);
    });
  }

  function reaccionar(ctx, f) {
    const T = ctx.THREE, p1 = presion(dB), P = pos();
    for (const p of [...gente, ...ctx.people]) {
      if (p.state === 2) continue;
      const r = Math.max(1, Math.hypot(p.x - P.x, p.z - P.z)), L = dB - 20 * Math.log10(r);
      const haciaEl = Math.atan2(P.x - p.x, P.z - p.z);
      if (p1 / r > 35e3) { // la onda de choque se los lleva
        const d = new T.Vector3(p.x - P.x, 0, p.z - P.z).normalize().multiplyScalar(ctx.rr(20, 60)); d.y = ctx.rr(5, 15);
        reloj.luego(r / 340 * .35, () => ctx.derribar(p, d, { float: false }));
      } else if (L > 95) { p.huir = haciaEl + Math.PI + ctx.rr(-.5, .5); p.andar = 1; }
      else if (L > 62) { p.andar = 0; p.g.rotation.y = haciaEl; p.mira = haciaEl; }
    }
    // derrumbes y ventanas rotas según la sobrepresión que llega a cada edificio
    let rotas = 0;
    for (const o of COMUN.edificios(ctx)) {
      if (o.state === 2) continue;
      const r = Math.max(1, Math.hypot(o.x - P.x, o.z - P.z) - Math.max(o.w, o.d) / 2), p = p1 / r;
      const retraso = r / 340 * .35; // la onda llega antes a lo cercano (tiempo acortado para el vídeo)
      if (p > 35e3) reloj.luego(retraso, () => {
        const dir = new T.Vector3(o.x - P.x, 0, o.z - P.z).normalize();
        COMUN.derribar(ctx, o, dir.clone().multiplyScalar(ctx.rr(10, 40) * Math.min(4, p / 35e3)).add(new T.Vector3(0, ctx.rr(2, 12), 0)), { polvo: 20 });
      });
      else if (p > 1e3 && !o.cristales) { o.cristales = true; rotas++; reloj.luego(retraso, () => { ventanas += Math.round(o.w * o.h / 40);
        if (r < 400) for (let q = 0; q < 14; q++) ctx.emit(o.x + ctx.rr(-.5, .5) * o.w, o.y0 + ctx.rr(0, o.h), o.z + ctx.rr(-.5, .5) * o.d, ctx.rr(-4, 4), ctx.rr(0, 5), ctx.rr(-4, 4), CR(ctx), ctx.rr(1, 2), 9.8);
      }); }
    }
    if (rotas) COMUN.ruido(ctx, 1.2, 5000, Math.min(.5, .15 + rotas * .02), .3, 'highpass');
    for (const o of ctx.objects) if ((o.kind === 'car' || o.kind === 'tree' || o.kind === 'palm' || o.kind === 'boat') && o.state !== 2) {
      const r = Math.max(1, Math.hypot(o.x - P.x, o.z - P.z)); if (p1 / r < 35e3) continue;
      const d = new T.Vector3(o.x - P.x, 0, o.z - P.z).normalize().multiplyScalar(ctx.rr(15, 50)); d.y = ctx.rr(3, 12);
      reloj.luego(r / 340 * .35, () => ctx.derribar(o, d, { float: false }));
    }
    if (dB >= 200) { // anillo de polvo a ras de suelo
      const v0 = Math.min(3000, 60 * Math.pow(10, (dB - 200) / 20));
      for (let k = 0; k < 900; k++) { const a = ctx.rr(0, 6.283), v = v0 * ctx.rr(.5, 1.4);
        ctx.emit(P.x + Math.sin(a) * 5, P.y + ctx.rr(0, 8), P.z + Math.cos(a) * 5, Math.sin(a) * v, ctx.rr(0, v * .08), Math.cos(a) * v, DUST(ctx), dB >= 270 ? ctx.rr(1, 1.8) : ctx.rr(2.5, 4.5), 2); }
    }
  }
  let _cr, _du;
  const CR = ctx => _cr ||= new ctx.THREE.Color(0xd8f4ff), DUST = ctx => _du ||= new ctx.THREE.Color(0xc9b99c);

  function actualizar(ctx, dt, t) {
    tiempo = t; reloj.tick(t); const e = t - t0;
    // anda por la acera y la cámara le sigue
    if (andar) { const dz = VEL * dt; quien.position.z += dz; zAndado += dz; ctx.pushCamera(0, 0, dz); }
    const fig = quien.children[0]; fig.position.y = andar ? Math.abs(Math.sin(t * 5)) * .05 : 0; fig.userData.andar(t * 5, andar ? 1 : 0);
    quien.rotation.y = 0;
    ctx.skyT.set(fActual.espacio || fActual.planeta || fActual.final ? 0x05070c : dB >= 230 ? 0xc9b89a : dB >= 200 && e > .4 ? 0xb9c4c8 : 0x9fd3f0);
    // boca abierta y burbuja mientras grita
    const grita = e > .25 && e < 1.1 && !fActual.final;
    boca.scale.y = grita ? .06 + Math.abs(Math.sin(e * 22)) * .1 : .03;
    cabeza.rotation.x = grita ? -.25 : 0;
    const v = quien.position.clone(); v.y += 2.2; v.project(ctx.camera);
    const r = stage.getBoundingClientRect(), vis = grita && v.z < 1 && Math.abs(v.x) < 1.2 && Math.abs(v.y) < 1.2 && ctx.camDist < 400;
    burbuja.style.opacity = vis ? 1 : 0;
    if (vis) { burbuja.style.left = ((v.x + 1) / 2 * r.width) + 'px'; burbuja.style.top = Math.max(r.height * .3, (1 - v.y) / 2 * r.height) + 'px';
      burbuja.style.transform = `translate(-50%,-100%) scale(${Math.min(1, .3 + (e - .25) * 4)}) rotate(-4deg)`; }
    for (let i = ondas.length - 1; i >= 0; i--) { const o = ondas[i]; o.t += dt; const k = Math.min(1, o.t / o.dur);
      o.m.scale.setScalar(.01 + o.radio * (1 - Math.pow(1 - k, 2))); o.m.material.opacity = o.op * (1 - k);
      if (k >= 1) { ctx.scene.remove(o.m); o.m.geometry.dispose(); o.m.material.dispose(); ondas.splice(i, 1); } }
    for (const ef of efectos) { ef.t += dt; const k = Math.min(1, ef.t / 1.8), ease = 1 - Math.pow(1 - k, 3);
      ef.domo.scale.set(ef.r * 1.3 * ease + .01, ef.r * .55 * ease + .01, ef.r * 1.3 * ease + .01);
      ef.domo.material.opacity = .7 * Math.max(0, 1 - Math.max(0, ef.t - 1.5) / 3);
      ef.crater.scale.setScalar(ef.r * .8 * ease + .01); ef.borde.scale.setScalar(ef.r * .8 * ease + .01);
      ef.borde.material.opacity = .8 * Math.max(.35, 1 - ef.t / 4); }
    COMUN.moverGente(ctx, gente.concat(ctx.people), dt, t);
    const choque = dB >= 200 && !fActual.espacio && e > .3 && e < 2 ? (1 - (e - .3) / 1.7) : 0;
    ctx.setShake(choque * Math.min(ctx.camDist * .01, 40));
    if (planeta) {
      planeta.update(dt);
      brillo[0] += (brilloObj[0] - brillo[0]) * (1 - Math.exp(-dt * 1.5)); brillo[1] += (brilloObj[1] - brillo[1]) * (1 - Math.exp(-dt * 1.5));
      if (brillo[0] > .01) planeta.teñir(0xff8a40, brillo[0], 0xff4a10, brillo[1]);
      // cúpula de choque que crece sobre la superficie desde donde gritas
      if (fActual.espacio && !explota) {
        if (!cupula) { const T = ctx.THREE; cupula = new T.Mesh(new T.SphereGeometry(1, 40, 20), new T.MeshBasicMaterial({ color: 0xffb060, transparent: true, opacity: .45, depthWrite: false, blending: T.AdditiveBlending }));
          cupula.userData.fenPropio = cupula.userData.sobrePlaneta = true; ctx.scene.add(cupula); }
        const meta = Math.min(COMUN.RT * 1.2, presion(dB) / 35e3);
        const s = cupula.scale.x + (meta - cupula.scale.x) * (1 - Math.exp(-dt * 2)); cupula.scale.setScalar(Math.max(1, s));
        cupula.material.opacity = .45 + Math.sin(t * 6) * .08;
        // grietas brillantes que salen de la zona del impacto sobre la superficie
        if (!grietas) { const T = ctx.THREE, RT = COMUN.RT, pts = [];
          for (let k = 0; k < 14; k++) { let a = k / 14 * 6.283 + ctx.rr(-.2, .2), th = 0;
            for (let j = 0; j < 9; j++) { const p0 = [RT * Math.sin(th) * Math.cos(a), RT * Math.cos(th) - RT + 2e3, RT * Math.sin(th) * Math.sin(a)];
              th += ctx.rr(.03, .07); a += ctx.rr(-.12, .12);
              pts.push(...p0, RT * Math.sin(th) * Math.cos(a), RT * Math.cos(th) - RT + 2e3, RT * Math.sin(th) * Math.sin(a)); } }
          const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.Float32BufferAttribute(pts, 3));
          grietas = new T.LineSegments(geo, new T.LineBasicMaterial({ color: 0xffb040, transparent: true, opacity: 0, fog: false, blending: T.AdditiveBlending }));
          grietas.userData.fenPropio = grietas.userData.sobrePlaneta = true; grietas.scale.setScalar(.01); ctx.scene.add(grietas); }
        const gk = Math.min(1, s / (COMUN.RT * .6)); grietas.material.opacity = Math.min(1, brillo[0] * 1.5 + gk * .6);
        grietas.scale.setScalar(1); grietas.geometry.setDrawRange(0, Math.floor(grietas.geometry.attributes.position.count * Math.max(.15, Math.min(1, brillo[0] + gk * .5))));
      }
      if (explota && tiempo > explota && !planeta.rota) { planeta.rota = true; planeta.partir(.35); planeta.reventar(80); COMUN.estallarPlaneta(ctx, 2600, 0xfff3c4); if (cupula) cupula.visible = false; if (grietas) grietas.visible = false; }
    }
    if (astronauta) { // flota delante de la cámara, girando despacio
      const fw = new ctx.THREE.Vector3(); ctx.camera.getWorldDirection(fw);
      astronauta.position.copy(ctx.camera.position).addScaledVector(fw, 7000); astronauta.position.y -= 2300;
      astronauta.rotation.set(.4 + Math.sin(t * .4) * .2, t * .25, Math.sin(t * .3) * .5);
    }
  }

  return {
    sinBoom: true,
    crear, fase, actualizar, camara,
    activo: () => tiempo - t0 < (dB >= 200 ? 4 : 2) || (planeta && explota && planeta.split < .9),
    mag: v => `${COMUN.num(v, 0)} dB`,
    linea3(v) {
      if (fActual.final) return [''];
      const W = vatios(v), t = W / COMUN.TNT_J, EN = COMUN.EN;
      if (W < 1e3) return [`${EN ? 'Power' : 'Potencia'}: ${W < 1 ? COMUN.num(W * 1e3, W < 1e-2 ? 3 : 1) + (EN ? ' milliwatts' : ' milivatios') : COMUN.num(W) + (EN ? ' watts' : ' vatios')}`];
      return [`${EN ? 'Energy' : 'Energía'} ≈ ${COMUN.textoTNT(t)} ${EN ? 'per second' : 'por segundo'}`];
    },
    danos: () => {
      const v = ventanas, c = ctxRef.caidos, n = COMUN.num, EN = COMUN.EN; if (!v && !c) return '';
      return EN ? `${n(v, 0)} window${v === 1 ? '' : 's'} broken · ${n(c, 0)} building${c === 1 ? '' : 's'} down`
        : `${n(v, 0)} ventana${v === 1 ? '' : 's'} rota${v === 1 ? '' : 's'} · ${n(c, 0)} edificio${c === 1 ? '' : 's'} caído${c === 1 ? '' : 's'}`;
    },
  };
})();
