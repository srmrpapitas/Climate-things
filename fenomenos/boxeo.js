// El puñetazo que se duplica: cada golpe lleva el doble de energía que el anterior, de 150 J (un directo normal)
// a 80.500 millones de julios en el golpe 30, que son 19 toneladas de TNT metidas en un guante.
// El rival pesa 80 kg y sale despedido a v = √(2E/m): 9.600 J ≈ 56 km/h, 9,83 MJ ≈ Mach 1,4,
// 5,03 GJ = 11,2 km/s (velocidad de escape de la Tierra) y 80,5 GJ = 44,9 km/s (se sale del Sistema Solar).
// El golpe arrasa lo que hay alrededor a partir de unos kilos de TNT: radio de 5 psi ≈ 4,7·(kg)^⅓ metros.
// Cifras aproximadas: compruébalas antes de publicar.
//
// Todo pasa dentro de un pabellón (gradas llenas, focos, marcador) que se va rompiendo: la pared, el tejado y al final
// el pabellón entero. El fenómeno lleva su propia cámara (planos cortos a la altura del ring, como un combate de verdad):
// cada fase del escenario dice qué planos tocan (f.planos) respecto al momento del golpe. Los gritos de anime
// (f.grito: 'corto', 'carga', 'final'; f.rival: el que sale volando grita) llevan rótulos, líneas de velocidad y aura.
window.FENOMENOS.boxeo = (() => {
  const reloj = COMUN.reloj(), EN = COMUN.EN;
  const MASA = 80, CX = 0, CZ = 150, LONA = 1.05, LADO = 3.6;   // rival (kg) · centro del ring · alto de la lona · medio lado
  const RA = 40, HW = 20, CUMBRE = 27;                            // pabellón: radio de la pared, su altura y la del centro del tejado
  const R0 = 11, PASO = 1.2, ALTO = .7, NT = 20;                 // gradas: empiezan a 11 m, escalones de 1,2 m × 0,7 m, 20 filas
  const YOX = CX - .5, RVX = CX + .5;                             // de pie uno frente al otro, a la distancia de un directo
  const velocidad = E => Math.sqrt(2 * E / MASA);
  const kgTNT = E => E / 4.184e6;
  // a cámara lenta por encima de 45 m/s (si no, cruzaría el pabellón en un fotograma); la gravedad se escala para que
  // la trayectoria tenga la misma forma que a velocidad real
  const vista = v => v <= 45 ? v : 45 + 13 * Math.log2(v / 45);
  // sonidos: audio/sfx/bomboclat_anime/*.mp3 y la envolvente de cada uno para mover la boca (boca.json)
  const GRITOS = { corto: { n: 'corto', clat: 1.09 }, carga: { n: 'carga', clat: 3.36 }, final: { n: 'final_carga', clat: 0 }, rival: { n: 'rival' }, nani: { n: 'nani' }, clat: { n: 'final_clat' },
    // los cortos de cada golpe normal: «¡BOMBO!», «¡CLAT!» o las dos
    bombo: { n: 'bombo' }, bombo2: { n: 'bombo2' }, clat1: { n: 'clat' }, clat2: { n: 'clat2' } };
  let ctx, T, H, tiempo = 0, ft = 0, fa = 0, dice = 'clat', golpe = 0, E = 150, fActual = {}, tp = .45, lanzar = null, lento = 1, lentoT = 0;
  let yo = null, rival = null, arbitro = null, entrenador = null, cola = [], jueces = [], protector = null;
  let vuelo = null, onda = null, radio = 0, fuera = false, pegando = 0, sacudida = 0, cargando = 0, aura = null, voces = [], envBoca = {};
  let edif = [], col = {}, gradas = [], paredes = [], techo = [], ring = null, pedestal = null, crater = null, luces = {}, publico = null, marcador = null;
  let retroceso = null, arbitroVuela = null, interior = true, destruido = 0, cuerdasRotas = false, cuerdas = [], efectos = [], hongo = null, haz = null, cono = null, estela = null, sol = null;
  let plan = [], planoAct = null, planoT = 0, listoRes = null;
  const listo = new Promise(r => listoRes = r);

  // ---------- el pabellón ----------
  const alturaGrada = r => r < R0 ? ctx.GROUND : ctx.GROUND + (Math.min(NT - 1, Math.floor((r - R0) / PASO)) + 1) * ALTO;
  const RS = (RA * RA + (CUMBRE - HW) ** 2) / (2 * (CUMBRE - HW));   // radio de la esfera del tejado
  const alturaTecho = r => ctx.GROUND + CUMBRE - RS + Math.sqrt(Math.max(0, RS * RS - r * r));
  const M = (c, o = {}) => new T.MeshStandardMaterial({ color: c, roughness: .85, flatShading: true, ...o });
  const pinta = (g, c) => { const cc = new T.Color(c), n = g.attributes.position.count, a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { a[i * 3] = cc.r; a[i * 3 + 1] = cc.g; a[i * 3 + 2] = cc.b; } g.setAttribute('color', new T.BufferAttribute(a, 3)); return g; };
  const caja = (w, h, d, x, y, z, ry, c) => { const g = new T.BoxGeometry(w, h, d); if (ry) g.rotateY(ry); g.translate(x, y, z); return pinta(g.toNonIndexed(), c); };

  // quita de la manzana lo que ocupa el pabellón (edificios, farolas, gente, coches)
  function despejar() {
    for (const o of ctx.objects) { const d = Math.hypot(o.x - CX, o.z - CZ) - Math.max(o.w || 0, o.d || 0) / 2;
      if (d < RA + 8 && o.state !== 2) { o.state = 2; if (o.g) { o.g.visible = false; o.g.parent && o.g.parent.remove(o.g); } } }
    const m0 = new T.Matrix4().makeScale(0, 0, 0);
    for (const { im, list } of ctx.inst) { let n = 0; list.forEach((p, i) => { if (p && !p.dead && Math.hypot(p.x - CX, p.z - CZ) < RA + 4) { p.dead = true; im.setMatrixAt(i, m0); n++; } }); if (n) im.instanceMatrix.needsUpdate = true; }
  }

  function montarPabellon() {
    const VC = new T.MeshStandardMaterial({ vertexColors: true, roughness: .9, flatShading: true });
    // suelo oscuro de pista
    const suelo = new T.Mesh(new T.CircleGeometry(RA, 64), M(0x17181f, { roughness: .6 })); suelo.rotation.x = -Math.PI / 2;
    suelo.position.set(CX, ctx.GROUND + .07, CZ); suelo.receiveShadow = true; suelo.userData.fenPropio = true; ctx.scene.add(suelo); luces.suelo = suelo;
    // gradas: 16 sectores × 3 bandas de filas, cada trozo una malla que puede salir volando
    const NS = 16, BANDAS = [[0, 7], [7, 14], [14, NT]];
    for (let s = 0; s < NS; s++) for (const [k0, k1] of BANDAS) {
      const a = (s + .5) / NS * Math.PI * 2, geos = [];
      for (let k = k0; k < k1; k++) {
        const rOut = R0 + (k + 1) * PASO, w = 2 * rOut * Math.tan(Math.PI / NS) + .05, h = (k + 1) * ALTO, rc = R0 + k * PASO + PASO / 2;
        const ry = -a + Math.PI / 2;
        geos.push(caja(w, h, PASO, Math.cos(a) * rc, h / 2, Math.sin(a) * rc, ry, k % 2 ? 0x2a2c35 : 0x31333d));
        const rf = R0 + k * PASO + .14; geos.push(caja(w * (R0 + k * PASO) / rOut, .12, .26, Math.cos(a) * rf, h + .06, Math.sin(a) * rf, ry, 0x8a1d26));
        if (s === NS / 2 && k < 4) geos.push(caja(3.2, 2.7, .1, Math.cos(Math.PI) * (R0 - .06), 1.35, 0, Math.PI / 2, 0x050507)); // boca del túnel
      }
      const g = new T.Mesh(ctx.merge(geos), VC); g.position.set(CX, ctx.GROUND, CZ); g.castShadow = g.receiveShadow = true; g.userData.fenPropio = true; ctx.scene.add(g);
      gradas.push({ m: g, a, r: R0 + (k0 + k1) / 2 * PASO, roto: false });
    }
    // pared: 36 paneles; el 18 (oeste) es la entrada, con dintel; los tres del este llevan el rótulo
    const rot = rotuloPabellon();
    for (let i = 0; i < 36; i++) {
      const a = i / 36 * Math.PI * 2, g = new T.Group(); g.position.set(CX + Math.cos(a) * RA, ctx.GROUND, CZ + Math.sin(a) * RA); g.rotation.y = -a - Math.PI / 2;
      const w = 2 * RA * Math.sin(Math.PI / 36) + .1, puerta = i === 18, y0 = puerta ? 5.5 : 0;
      const ext = new T.Mesh(new T.BoxGeometry(w, HW - y0, .7), M(0xd5d9de)); ext.position.y = y0 + (HW - y0) / 2; ext.castShadow = ext.receiveShadow = true; g.add(ext);
      const int = new T.Mesh(new T.BoxGeometry(w, HW - y0, .05), M(0x1a1d29)); int.position.set(0, y0 + (HW - y0) / 2, .38); g.add(int);
      const vid = new T.Mesh(new T.BoxGeometry(w, 1.6, .1), M(0x4f7ea6, { roughness: .25, metalness: .3 })); vid.position.set(0, 13.2, -.4); g.add(vid);
      const ban = new T.Mesh(new T.BoxGeometry(w, .5, .12), M(0xc0262d)); ban.position.set(0, 3.2, -.4); if (!puerta) g.add(ban);
      const j = i === 1 ? 0 : i === 0 ? 1 : i === 35 ? 2 : -1;
      if (j >= 0) { const pg = new T.PlaneGeometry(w, 3.4), uv = pg.attributes.uv; for (let q = 0; q < uv.count; q++) uv.setX(q, (j + uv.getX(q)) / 3);
        const pl = new T.Mesh(pg, new T.MeshStandardMaterial({ map: rot, roughness: .5, emissive: 0xffffff, emissiveMap: rot, emissiveIntensity: .25 }));
        pl.rotation.y = Math.PI; pl.position.set(0, 17.2, -.37); g.add(pl); }
      g.userData.fenPropio = true; ctx.scene.add(g); paredes.push({ g, a, roto: false });
    }
    // tejado: casquete de esfera en tres anillos de paneles
    const cy = ctx.GROUND + CUMBRE - RS, tMax = Math.asin(RA / RS), anillos = [[0, .1, 6], [.1, .22, 12], [.22, tMax, 18]];
    const matT = M(0xaab4bf, { side: T.DoubleSide });
    for (const [t0, t1, n] of anillos) for (let s = 0; s < n; s++) {
      const geo = new T.SphereGeometry(RS, 6, 3, s / n * Math.PI * 2, Math.PI * 2 / n, t0, t1 - t0), p = geo.attributes.position, c = new T.Vector3();
      for (let q = 0; q < p.count; q++) c.add(new T.Vector3(p.getX(q), p.getY(q), p.getZ(q))); c.divideScalar(p.count); geo.translate(-c.x, -c.y, -c.z);
      const m = new T.Mesh(geo, matT); m.position.set(CX + c.x, cy + c.y, CZ + c.z); m.castShadow = m.receiveShadow = true; m.userData.fenPropio = true; ctx.scene.add(m);
      techo.push({ m, roto: false });
    }
    // focos colgados en corona sobre el ring, sus haces de luz y el marcador del centro
    const brillo = new T.MeshBasicMaterial({ color: new T.Color(5, 4.8, 4.2), toneMapped: false, fog: false });
    const haces = new T.MeshBasicMaterial({ color: 0xfff1d6, transparent: true, opacity: .022, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide, fog: false });
    const rig = new T.Group(); rig.position.set(CX, ctx.GROUND, CZ); rig.userData.fenPropio = true; ctx.scene.add(rig); luces.rig = rig;
    for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2, x = Math.cos(a) * 9, z = Math.sin(a) * 9, y = 18.5;
      const caja = new T.Mesh(new T.BoxGeometry(.9, .6, .9), M(0x1d1f26)); caja.position.set(x, y + .3, z); rig.add(caja);
      const f = new T.Mesh(new T.SphereGeometry(.34, 12, 8), brillo); f.position.set(x, y, z); rig.add(f);
      // haz de luz: un cono con la punta en el foco y la base sobre la lona, hacia el centro
      if (k % 2 === 0) { const arriba = new T.Vector3(x, y, z), abajo = new T.Vector3(x * .3, LONA + 1.2, z * .3), eje = arriba.clone().sub(abajo), L = eje.length();
        const cono = new T.Mesh(new T.ConeGeometry(1.5, L, 18, 1, true), haces); cono.position.copy(abajo).addScaledVector(eje, .5);
        cono.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), eje.normalize()); rig.add(cono); } }
    for (let k = 0; k < 24; k++) { const a = k / 24 * Math.PI * 2, f = new T.Mesh(new T.SphereGeometry(.28, 10, 6), brillo); f.position.set(Math.cos(a) * 25, 19.2 - Math.abs(Math.sin(a * 3)) * .3, Math.sin(a) * 25); rig.add(f); }
    marcador = pantallas(); marcador.g.position.set(0, 15.8, 0); rig.add(marcador.g);
    // luces: un foco sobre el ring (con sombras) y cuatro para las gradas
    luces.foco = new T.SpotLight(0xfff3df, 950, 0, .6, .5, 2); luces.foco.position.set(CX, ctx.GROUND + 19, CZ); luces.foco.target.position.set(CX, ctx.GROUND + LONA, CZ);
    luces.foco.castShadow = true; luces.foco.shadow.mapSize.set(1024, 1024); luces.foco.shadow.bias = -.0004; ctx.scene.add(luces.foco, luces.foco.target);
    luces.cara = new T.PointLight(0xfff4ea, 0, 5, 2); ctx.scene.add(luces.cara);
    luces.gradas = [0, 1, 2, 3].map(k => { const l = new T.PointLight(0xffe9d0, 650, 0, 2), a = (k + .5) / 4 * Math.PI * 2; l.position.set(CX + Math.cos(a) * 20, ctx.GROUND + 17, CZ + Math.sin(a) * 20); ctx.scene.add(l); return l; });
  }
  // «BOMBOCLAT ARENA» en grande, en la fachada este (por donde salen los rivales)
  function rotuloPabellon() {
    const cv = document.createElement('canvas'); cv.width = 1536; cv.height = 340; const g = cv.getContext('2d');
    g.fillStyle = '#16171d'; g.fillRect(0, 0, 1536, 340); g.fillStyle = '#c0262d'; g.fillRect(0, 300, 1536, 40);
    g.font = "900 190px 'Archivo Black', 'Arial Black', Impact, sans-serif"; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#ffffff';
    g.fillText('BOMBOCLAT ARENA', 768, 158, 1480);
    const t = new T.CanvasTexture(cv); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 4; return t;
  }
  // el marcador que cuelga sobre el ring: cuatro pantallas con la energía del golpe
  function pantallas() {
    const g = new T.Group(), cv = document.createElement('canvas'); cv.width = 512; cv.height = 300; const c2 = cv.getContext('2d');
    const tx = new T.CanvasTexture(cv); tx.colorSpace = T.SRGBColorSpace;
    const cuerpo = new T.Mesh(new T.BoxGeometry(4.6, 2.8, 4.6), M(0x111217)); g.add(cuerpo);
    const mat = new T.MeshBasicMaterial({ map: tx, toneMapped: false, color: new T.Color(1.6, 1.6, 1.6) });
    for (let k = 0; k < 4; k++) { const p = new T.Mesh(new T.PlaneGeometry(4.2, 2.45), mat), a = k * Math.PI / 2; p.position.set(Math.sin(a) * 2.32, 0, Math.cos(a) * 2.32); p.rotation.y = a; g.add(p); }
    const pon = (arriba, abajo) => { c2.fillStyle = '#05070c'; c2.fillRect(0, 0, 512, 300); c2.textAlign = 'center'; c2.textBaseline = 'middle';
      c2.fillStyle = '#ffd23f'; c2.font = "900 54px 'Archivo Black', 'Arial Black', sans-serif"; c2.fillText(arriba, 256, 92, 480);
      c2.fillStyle = '#ffffff'; c2.font = "900 74px 'Archivo Black', 'Arial Black', sans-serif"; c2.fillText(abajo, 256, 200, 490); tx.needsUpdate = true; };
    pon('BOMBOCLAT', 'ARENA'); return { g, pon };
  }

  // ---------- el ring ----------
  function montarRing() {
    const g = new T.Group(), L = LADO + .45;
    const add = (geo, m, x, y, z) => { const b = new T.Mesh(geo, m); b.position.set(x, y, z); b.castShadow = b.receiveShadow = true; g.add(b); return b; };
    add(new T.BoxGeometry(L * 2, LONA - .12, L * 2), M(0x111116), 0, (LONA - .12) / 2, 0);                                   // el cajón negro
    for (const s of [-1, 1]) { add(new T.BoxGeometry(L * 2 + .02, .34, .02), M(0xc0262d), 0, .6, s * (L + .01)); add(new T.BoxGeometry(.02, .34, L * 2 + .02), M(0xc0262d), s * (L + .01), .6, 0); }
    add(new T.BoxGeometry(L * 2, .12, L * 2), M(0x2b86d6, { roughness: .95 }), 0, LONA - .06, 0);                            // la lona azul
    const circ = new T.Mesh(new T.RingGeometry(1.25, 1.42, 48), new T.MeshStandardMaterial({ color: 0xf2f6ff, roughness: .9 })); circ.rotation.x = -Math.PI / 2; circ.position.y = LONA + .005; g.add(circ);
    const logo = new T.Mesh(new T.CircleGeometry(.6, 36), new T.MeshStandardMaterial({ color: 0xb8932a, roughness: .95 })); logo.rotation.x = -Math.PI / 2; logo.position.y = LONA + .006; g.add(logo);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      add(new T.CylinderGeometry(.1, .1, 1.75, 10), M(0xdedede, { metalness: .5, roughness: .4 }), sx * LADO, LONA + .87, sz * LADO);
      add(new T.BoxGeometry(.3, 1.3, .3), M(sx < 0 && sz < 0 ? 0xc0262d : sx > 0 && sz > 0 ? 0x2456c9 : 0xf2f2f2), sx * (LADO - .12), LONA + .8, sz * (LADO - .12));
    }
    for (let k = 0; k < 3; k++) {                                                                                             // las tres cuerdas de cada lado
      const y = LONA + .45 + k * .45, m = M([0xd8282f, 0xf2f2f2, 0x2f5fd8][k], { roughness: .6 });
      for (const [w, d, x, z, lado] of [[LADO * 2, .06, 0, -LADO, 'n'], [LADO * 2, .06, 0, LADO, 's'], [.06, LADO * 2, -LADO, 0, 'o'], [.06, LADO * 2, LADO, 0, 'e']]) {
        const c = add(new T.BoxGeometry(w, .06, d), m, x, y, z); cuerdas.push({ m: c, lado, k });
      }
    }
    g.position.set(CX, ctx.GROUND, CZ); g.userData.fenPropio = true; ctx.scene.add(g);
    return g;
  }

  // ---------- el público ----------
  // ~4.000 personas instanciadas (tronco + cabeza + brazos), de pie en sus filas mirando al ring.
  // Cada una: sitio, giro, colores y estado (0 en su sitio, 1 volando, 2 tirada, 3 marchándose, 4 fuera)
  function montarPublico() {
    const sitios = [];
    for (let k = 0; k < NT; k++) { const r = R0 + k * PASO + PASO * .55, n = Math.floor(2 * Math.PI * r / .64);
      for (let i = 0; i < n; i++) { const a = (i + (k % 2) * .5) / n * Math.PI * 2, arco = r * (((a + Math.PI / 8) % (Math.PI / 4)) - Math.PI / 8);
        if (Math.abs(arco) < .6) continue;                                                                  // pasillos
        const dt = Math.abs(Math.atan2(Math.sin(a - Math.PI), Math.cos(a - Math.PI))) * r; if (k < 5 && dt < 2) continue; // túnel
        if (ctx.R() < .04) continue;
        sitios.push([CX + Math.cos(a) * r + ctx.rr(-.06, .06), alturaGrada(r), CZ + Math.sin(a) * r + ctx.rr(-.06, .06), a, r]); } }
    for (const r of [6.9, 8.1]) { const n = Math.floor(2 * Math.PI * r / .7);                                  // pista: dos filas alrededor del ring
      for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, d0 = Math.abs(Math.atan2(Math.sin(a), Math.cos(a))), dP = Math.abs(Math.atan2(Math.sin(a - Math.PI), Math.cos(a - Math.PI)));
        if (d0 < .5 || dP < .4) continue; sitios.push([CX + Math.cos(a) * r, ctx.GROUND + .07, CZ + Math.sin(a) * r, a, r]); } }
    const N = sitios.length;
    const cuerpo = ctx.merge([pinta(new T.BoxGeometry(.36, .78, .24).translate(0, .39, 0).toNonIndexed(), 0x555555), pinta(new T.BoxGeometry(.46, .6, .28).translate(0, 1.05, 0).toNonIndexed(), 0xffffff)]);
    const cabeza = ctx.merge([pinta(new T.BoxGeometry(.25, .28, .25).translate(0, 1.5, 0).toNonIndexed(), 0xffffff), pinta(new T.BoxGeometry(.27, .09, .27).translate(0, 1.66, -.01).toNonIndexed(), 0x2a2018)]);
    const brazos = ctx.merge([pinta(new T.BoxGeometry(.11, .55, .12).translate(-.29, .27, 0).toNonIndexed(), 0xffffff), pinta(new T.BoxGeometry(.11, .55, .12).translate(.29, .27, 0).toNonIndexed(), 0xffffff)]);
    const mat = new T.MeshStandardMaterial({ vertexColors: true, roughness: .85, flatShading: true });
    const ims = [cuerpo, cabeza, brazos].map(g => { const im = new T.InstancedMesh(g, mat, N); im.instanceMatrix.setUsage(T.DynamicDrawUsage); im.frustumCulled = false; im.castShadow = false; im.receiveShadow = true; im.userData.fenPropio = true; ctx.scene.add(im); return im; });
    const ROPA = [0xe74c3c, 0xf1c40f, 0x3498db, 0x2ecc71, 0xf5f5f5, 0x9b59b6, 0xe67e22, 0x1abc9c, 0xff6f9c, 0x34495e, 0xc0392b, 0x2980b9], PIEL = [0xf1c9a5, 0xe0ac85, 0xc68b62, 0x8d5a3b, 0x5e3b25];
    const c = new T.Color(), P = { N, ims, x: new Float32Array(N), y: new Float32Array(N), z: new Float32Array(N), a: new Float32Array(N), r: new Float32Array(N),
      est: new Uint8Array(N), vx: new Float32Array(N), vy: new Float32Array(N), vz: new Float32Array(N), giro: new Float32Array(N), fase: new Float32Array(N), anima: new Float32Array(N), q: [] };
    sitios.forEach(([x, y, z, a, r], i) => { P.x[i] = x; P.y[i] = y; P.z[i] = z; P.a[i] = Math.atan2(-Math.cos(a), -Math.sin(a)); P.r[i] = r; P.fase[i] = ctx.R() * 6.28;
      ims[0].setColorAt(i, c.set(ROPA[(ctx.R() * ROPA.length) | 0])); ims[2].setColorAt(i, c); ims[1].setColorAt(i, c.set(PIEL[(ctx.R() * PIEL.length) | 0])); });
    for (const im of ims) im.instanceColor.needsUpdate = true;
    return P;
  }
  // cada fotograma: botan un poco; tras un golpe saltan con los brazos arriba; los que se lleva la onda vuelan y caen
  let animoPub = 0;
  function moverPublico(dt) {
    const P = publico; if (!P) return; const [b0, b1, b2] = P.ims.map(im => im.instanceMatrix.array), t = tiempo;
    const m4 = moverPublico.m4 ||= new T.Matrix4(), q = moverPublico.q ||= new T.Quaternion(), e = moverPublico.e ||= new T.Euler(), v = moverPublico.v ||= new T.Vector3(), s = moverPublico.s ||= new T.Vector3(1, 1, 1);
    animoPub = Math.max(0, animoPub - dt * .35);
    for (let i = 0; i < P.N; i++) {
      const st = P.est[i], o = i * 16;
      if (st === 0 || st === 3) {
        if (st === 3) { const dr = dt * 1.1; const ang = Math.atan2(P.z[i] - CZ, P.x[i] - CX); P.x[i] += Math.cos(ang) * dr; P.z[i] += Math.sin(ang) * dr; P.r[i] += dr; P.y[i] = alturaGrada(P.r[i]);
          P.a[i] = Math.atan2(Math.cos(ang), Math.sin(ang)); if (P.r[i] > R0 + NT * PASO - .5) { P.est[i] = 4; } }
        const ex = Math.min(1, animoPub * (.6 + .4 * Math.sin(P.fase[i] * 3.1))), salto = ex * Math.max(0, Math.sin(t * 9 + P.fase[i] * 5)) * .32 + Math.sin(t * 2.3 + P.fase[i] * 7) * .02;
        const ca = Math.cos(P.a[i]), sa = Math.sin(P.a[i]), y = P.y[i] + salto;
        for (const [b, sy] of [[b0, 1], [b1, 1]]) { b[o] = ca; b[o + 1] = 0; b[o + 2] = -sa; b[o + 3] = 0; b[o + 4] = 0; b[o + 5] = sy; b[o + 6] = 0; b[o + 7] = 0; b[o + 8] = sa; b[o + 9] = 0; b[o + 10] = ca; b[o + 11] = 0; b[o + 12] = P.x[i]; b[o + 13] = y; b[o + 14] = P.z[i]; b[o + 15] = 1; }
        const arriba = st === 0 && ex > .35 && ((P.fase[i] * 10) % 1) < .7 ? 1 : -1;
        b2[o] = ca; b2[o + 1] = 0; b2[o + 2] = -sa; b2[o + 3] = 0; b2[o + 4] = 0; b2[o + 5] = arriba; b2[o + 6] = 0; b2[o + 7] = 0; b2[o + 8] = sa; b2[o + 9] = 0; b2[o + 10] = ca; b2[o + 11] = 0; b2[o + 12] = P.x[i]; b2[o + 13] = y + 1.33; b2[o + 14] = P.z[i]; b2[o + 15] = 1;
      } else if (st === 1 || st === 2) {
        if (st === 1) { P.vy[i] -= 9.8 * dt; P.x[i] += P.vx[i] * dt; P.y[i] += P.vy[i] * dt; P.z[i] += P.vz[i] * dt; P.giro[i] += dt * 8;
          if (P.y[i] < ctx.GROUND + .15 && P.vy[i] < 0) { P.y[i] = ctx.GROUND + .15; P.est[i] = 2; P.giro[i] = Math.PI / 2; } }
        q.setFromEuler(e.set(st === 2 ? -Math.PI / 2 : P.giro[i], P.a[i], P.giro[i] * .6)); m4.compose(v.set(P.x[i], P.y[i], P.z[i]), q, s);
        m4.toArray(b0, o); m4.toArray(b1, o); m4.toArray(b2, o); b2[o + 5] *= -1; b2[o + 4] *= -1; b2[o + 6] *= -1; // brazos abajo
        const lt = new T.Vector3(0, 1.33, 0).applyQuaternion(q); b2[o + 12] = P.x[i] + lt.x; b2[o + 13] = P.y[i] + lt.y; b2[o + 14] = P.z[i] + lt.z;
      } else { for (const b of [b0, b1, b2]) { b[o] = b[o + 5] = b[o + 10] = 0; b[o + 13] = -1e5; } }
    }
    for (const im of P.ims) im.instanceMatrix.needsUpdate = true;
  }
  // la onda (o el rival al pasar) se lleva a los que pilla dentro de r metros de (x, z)
  function barrer(x, z, r, fuerza, y = null) {
    const P = publico; if (!P) return 0; let n = 0;
    for (let i = 0; i < P.N; i++) { if (P.est[i] > 1 && P.est[i] !== 3) continue; if (P.est[i] === 1) continue;
      const dx = P.x[i] - x, dz = P.z[i] - z, d = Math.hypot(dx, dz); if (d > r || (y !== null && Math.abs(P.y[i] + .9 - y) > 3)) continue;
      const k = fuerza * (1 - d / r * .6) * ctx.rr(.6, 1.1); P.est[i] = 1; P.vx[i] = dx / (d || 1) * k; P.vz[i] = dz / (d || 1) * k; P.vy[i] = k * ctx.rr(.25, .6); P.giro[i] = 0; n++; }
    return n;
  }

  // ---------- los personajes ----------
  // envoltorio común: g (posición y hacia dónde mira) > cuerpo (inclinarse, girar al volar) > figura
  function envolver(fig, x, ry) { const g = new T.Group(), cuerpo = new T.Group(); cuerpo.add(fig); g.add(cuerpo); g.position.set(x, H, CZ); g.rotation.y = ry; g.userData.fenPropio = g.userData.sobrePlaneta = true; ctx.scene.add(g); return { g, cuerpo }; }
  // muñeco de COMUN.heroe con guantes de boxeo
  function luchadorHeroe(color, guante, x, ry) {
    const fig = COMUN.heroe(ctx, color), { g, cuerpo } = envolver(fig, x, ry), bs = [];
    const ropa = []; fig.traverse(m => { if (m.isMesh && m.material.color && m.material.color.getHex() === color && !ropa.includes(m.material)) ropa.push(m.material); });
    const matG = new T.MeshStandardMaterial({ color: guante, roughness: .45 });
    fig.traverse(m => { if (m.isMesh && Math.abs(m.scale.y - .065) < .002 && Math.abs(m.scale.z - .03) < .002) { m.material = matG; m.scale.set(.095, .115, .085); bs.push({ codo: m.parent, hom: m.parent.parent }); } });
    fig.traverse(m => { if (m.isMesh) m.castShadow = true; });
    const cab = fig.userData.cabeza;
    return { g, cuerpo, fig, cabeza: cab, hablar: fig.userData.hablar, alto: 1.75, cara: () => cab.localToWorld(new T.Vector3(0, .08, .02)),
      color(c) { for (const m of ropa) m.color.set(c); }, guantes(c) { matG.color.set(c); },
      // guardia (0-1), golpe con la derecha (0-1), carga (0-1: el brazo atrás y agachado), volar (brazos sueltos)
      pose({ golpe = 0, carga = 0, volar = 0 } = {}) {
        fig.userData.andar(0, 0);
        bs.forEach((b, i) => { const k = i === 1 ? golpe : golpe * .25, c = i === 1 ? carga : 0;
          b.hom.rotation.x = -1.15 - .4 * k + c * 1.3 + volar * -.9; b.hom.rotation.z = (i ? 1 : -1) * (.12 - .1 * k + volar * 1.1);
          b.codo.rotation.x = -1.75 + 1.68 * k + c * .3 + volar * 1.2; });
        cuerpo.position.y = -carga * .08; cuerpo.rotation.x = carga * .1 + golpe * .12;
      } };
  }
  // Personaje con modelo de Avaturn (modelos/*.glb, esqueleto de Mixamo). Se mueve con las animaciones de Mixamo de
  // modelos/anim (directo, cruzado, golpe en la cabeza) y encima se colocan a mano las poses que no tienen animación
  // (cargar el golpe, volar): cada hueso del brazo se apunta a una dirección del espacio del modelo
  // (+x su izquierda, +y arriba, +z al frente).
  function luchadorAvatar(gltf, x, ry, guante, clips) {
    const fig = gltf.scene, { g, cuerpo } = envolver(fig, x, ry), hueso = {}, reposo = new Map();
    fig.traverse(o => { if (o.isBone) { hueso[o.name] = o; reposo.set(o, o.quaternion.clone()); } if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; o.frustumCulled = false; } });
    const matG = new T.MeshStandardMaterial({ color: guante, roughness: .4 });
    for (const lado of ['Left', 'Right']) { const m = new T.Mesh(new T.SphereGeometry(1, 20, 14), matG); m.scale.set(.085, .11, .1); m.position.set(0, .085, .025); m.castShadow = true; hueso[lado + 'Hand'].add(m); }
    // mandíbula: el modelo no trae gestos, así que se le añade uno (los vértices de la barbilla bajan) y una boca oscura
    const boca = mandibula(fig, hueso.Head), Hd = hueso.Head;
    const mixer = new T.AnimationMixer(fig), acc = {}; let actual = null;
    for (const n in clips) acc[n] = mixer.clipAction(clips[n]);
    const Q = new T.Quaternion(), W = new T.Quaternion(), D = new T.Vector3(), Y = new T.Vector3(), qm = new T.Quaternion();
    // apunta el eje Y del hueso (hacia su hijo) a la dirección d del espacio del modelo
    function apuntar(b, d) { fig.getWorldQuaternion(qm); D.copy(d).normalize().applyQuaternion(qm);
      b.getWorldQuaternion(W); Y.set(0, 1, 0).applyQuaternion(W); Q.setFromUnitVectors(Y, D); W.premultiply(Q);
      b.parent.getWorldQuaternion(Q); b.quaternion.copy(Q.invert().multiply(W)); b.updateMatrixWorld(true); }
    const V = (x, y, z) => new T.Vector3(x, y, z);
    const mezcla = (b, d, k) => { if (k <= 0) return; b.getWorldQuaternion(W); fig.getWorldQuaternion(qm); Y.set(0, 1, 0).applyQuaternion(W).applyQuaternion(qm.invert()); apuntar(b, Y.lerp(d.clone().normalize(), k)); };
    const POSE = {
      carga: { R: [V(-.35, -.55, -.6), V(.15, .6, .7)], L: [V(.35, -.35, .8), V(-.2, .55, .8)] },
      volar: { L: [V(.8, .55, -.2), V(.6, .8, -.2)], R: [V(-.8, .55, -.2), V(-.6, .8, -.2)] },
      guardia: { L: [V(.3, -.62, .62), V(-.42, .7, .55)], R: [V(-.3, -.62, .62), V(.42, .7, .55)] },
    };
    return { g, cuerpo, fig, cabeza: Hd, alto: 1.85, avatar: true, hablar: boca.abrir, color() {}, guantes(c) { matG.color.set(c); }, cara: () => Hd.localToWorld(boca.cara.clone()),
      // clip: [nombre, segundo] de una animación; carga y volar (0-1) se mezclan encima
      pose({ clip = null, carga = 0, volar = 0 } = {}) {
        if (clip && acc[clip[0]]) { const a = acc[clip[0]]; if (actual !== a) { mixer.stopAllAction(); a.play(); actual = a; }
          a.time = Math.max(0, Math.min(clip[1], a.getClip().duration - .001)); mixer.update(0); }
        else { if (actual) { mixer.stopAllAction(); actual = null; } for (const [b, q] of reposo) b.quaternion.copy(q); }
        fig.updateMatrixWorld(true);
        if (!clip) for (const l of ['L', 'R']) { const nom = l === 'L' ? 'Left' : 'Right'; apuntar(hueso[nom + 'Arm'], POSE.guardia[l][0]); apuntar(hueso[nom + 'ForeArm'], POSE.guardia[l][1]); }
        if (carga > 0) { hueso.Spine1.quaternion.multiply(Q.setFromAxisAngle(V(0, 1, 0), carga * .45)); hueso.Spine.quaternion.multiply(Q.setFromAxisAngle(V(1, 0, 0), carga * .2)); fig.updateMatrixWorld(true); }
        for (const [k, P] of [[carga, POSE.carga], [volar, POSE.volar]]) if (k > 0) for (const l of ['L', 'R']) { const nom = l === 'L' ? 'Left' : 'Right'; mezcla(hueso[nom + 'Arm'], P[l][0], k); mezcla(hueso[nom + 'ForeArm'], P[l][1], k); }
        cuerpo.position.y = -carga * .1;
      } };
  }
  // Crea un gesto de «abrir la boca» en la malla del cuerpo: los vértices de la mandíbula giran alrededor de un eje
  // a la altura de las orejas. Detrás de los labios va una boca oscura para que no se vea el hueco.
  function mandibula(fig, cabeza) {
    let cuerpo = null; fig.traverse(o => { if (o.isSkinnedMesh && /body/.test(o.name)) cuerpo = o; });
    if (!cuerpo) return { abrir() {}, cara: new T.Vector3(0, .1, .05) };
    const geo = cuerpo.geometry, p = geo.attributes.position, n = p.count;
    // la punta de la nariz: lo más adelantado de la línea media de la cara
    // (por encima del arranque de la cabeza, que si no gana la tripa)
    fig.updateMatrixWorld(true); const hy = fig.worldToLocal(cabeza.getWorldPosition(new T.Vector3())).y;
    let zN = -1, yN = 1.6;
    for (let i = 0; i < n; i++) { const y = p.getY(i), z = p.getZ(i); if (y > hy && Math.abs(p.getX(i)) < .008 && z > zN) { zN = z; yN = y; } }
    const yLab = yN - .031, piv = new T.Vector3(0, yLab + .03, zN - .1), d = new Float32Array(n * 3), v = new T.Vector3(), r = new T.Quaternion().setFromAxisAngle(new T.Vector3(1, 0, 0), .32);
    const S = T.MathUtils.smoothstep;
    for (let i = 0; i < n; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      if (y > yLab + .002 || y < yLab - .15 || z < zN - .13) continue;
      const w = (1 - S(Math.abs(x), .035, .075)) * S(yLab + .002 - y, 0, .006) * (1 - S(yLab - y, .11, .15)) * S(z, zN - .13, zN - .08);
      if (w <= 0) continue;
      v.set(x, y, z).sub(piv).applyQuaternion(r).add(piv); d[i * 3 + 1] = (v.y - y) * w; d[i * 3 + 2] = (v.z - z) * w; }
    geo.morphAttributes.position = [new T.BufferAttribute(d, 3)]; geo.morphTargetsRelative = true;
    cuerpo.updateMorphTargets(); cuerpo.morphTargetInfluences[0] = 0; cuerpo.material.needsUpdate = true;
    // el hueco de la boca: una elipse oscura justo delante de la línea de los labios que se abre con la mandíbula
    // (la malla no tiene labios separados: sin esto solo se estiraría la barbilla). Va en coordenadas de la cabeza,
    // girada para que sus ejes sean los del modelo.
    fig.updateMatrixWorld(true); const inv = cabeza.matrixWorld.clone().invert(), aCab = q => q.applyMatrix4(fig.matrixWorld).applyMatrix4(inv); // los vértices están en el espacio del modelo
    const qCab = cabeza.getWorldQuaternion(new T.Quaternion()).invert().multiply(fig.getWorldQuaternion(new T.Quaternion()));
    const hueco = new T.Mesh(new T.SphereGeometry(1, 20, 12), new T.MeshBasicMaterial({ color: 0x1c0505 }));
    const dientes = new T.Mesh(new T.BoxGeometry(1, 1, 1), new T.MeshStandardMaterial({ color: 0xf2efe6, roughness: .4 })); dientes.position.set(0, .62, .55); dientes.scale.set(1.3, .32, .4); hueco.add(dientes);
    hueco.quaternion.copy(qCab); hueco.visible = false; cabeza.add(hueco);
    const base = aCab(new T.Vector3(0, yLab - .004, zN - .017)), abajo = new T.Vector3(0, -1, 0).applyQuaternion(qCab);
    const cara = aCab(new T.Vector3(0, yN - .01, zN - .07));
    return { abrir(k) { k = Math.max(0, Math.min(1, k)); cuerpo.morphTargetInfluences[0] = k;
      hueco.visible = k > .04; hueco.position.copy(base).addScaledVector(abajo, k * .011); hueco.scale.set(.02 + k * .003, .0015 + k * .013, .006); }, cara };
  }

  // el árbitro, el entrenador del rincón azul, la mesa de jueces, el protector bucal y la cola de retadores
  function secundarios() {
    arbitro = luchadorHeroe(0xf4f4f4, 0xf4f4f4, CX - 2.2, Math.atan2(2.2, -2.3)); arbitro.g.position.z = CZ + 2.3;   // mirando a los dos
    arbitro.fig.traverse(m => { if (m.isMesh && m.material.color && m.material.color.getHex() === 0xd8282f) m.material = m.material.clone(), m.material.color.set(0x222222); });
    entrenador = COMUN.heroe(ctx, 0x2456c9); entrenador.position.set(CX + LADO + .9, ctx.GROUND + .07, CZ + LADO + .9); entrenador.rotation.y = -Math.PI * .75; entrenador.userData.fenPropio = true; ctx.scene.add(entrenador);
    const mesa = new T.Group(); mesa.position.set(CX + 9.2, ctx.GROUND, CZ); mesa.userData.fenPropio = true; ctx.scene.add(mesa);
    const tab = new T.Mesh(new T.BoxGeometry(1.1, .08, 6), M(0xf2f2f2)); tab.position.y = .76; tab.castShadow = tab.receiveShadow = true; mesa.add(tab);
    const fal = new T.Mesh(new T.BoxGeometry(.05, .7, 6), M(0xc0262d)); fal.position.set(-.55, .38, 0); mesa.add(fal);
    for (const z of [-2, 0, 2]) { const j = COMUN.persona(ctx); j.position.set(.9, 0, z); j.rotation.y = -Math.PI / 2; mesa.add(j); jueces.push(j); }
    jueces.mesa = mesa;
    protector = new T.Mesh(new T.CapsuleGeometry(.025, .05, 3, 8), M(0xffffff, { roughness: .4 })); protector.rotation.z = Math.PI / 2; protector.visible = false; protector.userData.fenPropio = true; ctx.scene.add(protector);
    // la cola: del ring al túnel por dentro, y por fuera sigue por la calle hacia el oeste
    for (let k = 0; k < 90; k++) {
      const m = COMUN.persona(ctx); let x, z;
      if (k < 6) { x = CX - 4.6 - k * .95; z = CZ + 1.1; } else if (k < 30) { x = CX - 10.4 - (k - 6) * 1.25; z = CZ + 1.1; } else { x = CX - RA - 2 - (k - 30) * 1.3; z = CZ + 1.1 + Math.sin(k) * .3; }
      m.position.set(x, ctx.GROUND + .07, z); m.rotation.y = Math.PI / 2; m.userData.fenPropio = true; ctx.scene.add(m); cola.push(m);
    }
  }

  // ---------- crear ----------
  function crear(c) {
    ctx = c; T = ctx.THREE; H = ctx.GROUND + LONA; ANIME.crear(ctx);
    despejar(); montarPabellon(); ring = montarRing(); publico = montarPublico(); secundarios();
    edif = COMUN.edificios(ctx).filter(o => o.state !== 2);
    rival = luchadorHeroe(0xf2f2f2, 0x2456c9, RVX, -Math.PI / 2);
    yo = luchadorHeroe(0xd8282f, 0xf2f2f2, YOX, Math.PI / 2);                   // hasta que cargue el modelo de verdad
    aura = ANIME.aura(yo.g);
    col = { chispa: new T.Color(0xfff0b0), fuego: new T.Color(0xff7a1a), humo: new T.Color(0x4a4440), sudor: new T.Color(0xdff0ff), polvo: new T.Color(0xcfc6b8), oro: new T.Color(0xffc23a), roca: new T.Color(0x8a7a6a), vapor: new T.Color(0xf4f6ff) };
    fetch('audio/sfx/bomboclat_anime/boca.json').then(r => r.json()).then(b => { envBoca = b; }).catch(() => {});
    // el protagonista: el modelo de modelos/nico.glb si se puede cargar
    // los dos con modelo de verdad (modelos/nico.glb y leo.glb, de Avaturn con esqueleto de Mixamo) si se pueden cargar
    const cargar = (url, fn) => new Promise(ok => { if (!ctx.GLTF) return ok();
      new ctx.GLTF().load(url, gl => { try { fn(gl); } catch (e) { console.warn(url, e); } ok(); }, undefined, e => { console.warn(url, e); ok(); }); });
    const clips = {};
    Promise.all(['cross', 'punching', 'golpe_cabeza'].map(n => fetch(`modelos/anim/${n}.json`).then(r => r.json()).then(j => { clips[n] = T.AnimationClip.parse(j); }).catch(() => {})))
      .then(() => Promise.all([
        cargar('modelos/nico.glb', gl => { const n = luchadorAvatar(gl, YOX, Math.PI / 2, 0xd8282f, clips); ctx.scene.remove(yo.g); n.g.add(aura.g); yo = n; yo.pose({ clip: ['cross', 0] }); }),
        cargar('modelos/leo.glb', gl => { const n = luchadorAvatar(gl, RVX, -Math.PI / 2, 0x2456c9, clips); n.g.visible = rival.g.visible; ctx.scene.remove(rival.g); rival = n; rival.pose({ clip: ['punching', 0] }); }),
      ])).then(() => listoRes(true));
    yo.pose({}); rival.pose({}); arbitro.pose({});
  }

  // ---------- gritos ----------
  // mezcla: narrador (bus de voz, el más alto) > gritos (.85) > grada (cama .35 y ovaciones) > música (cama .14)
  function gritar(tipo, retraso = 0, quien = 'yo', gan = .85) {
    const g = GRITOS[tipo]; if (!g) return; const n = 'bomboclat_anime/' + g.n;
    ctx.sfx(n, gan, retraso); voces.push({ quien, n: g.n, t: ft + retraso });
  }
  function boca(quien) {
    for (let i = voces.length - 1; i >= 0; i--) { const v = voces[i]; if (v.quien !== quien) continue; const env = envBoca[v.n]; if (!env) continue;
      const k = Math.floor((ft - v.t) * 30); if (k < 0) continue; if (k >= env.length) { voces.splice(i, 1); continue; } return env[k]; }
    return 0;
  }

  // ---------- el golpe ----------
  function fase(c, n, valor, f) {
    E = valor; golpe = n; fActual = f; ft = 0; fa = 0; radio = 0; lento = 1; voces = [];
    if (estela) { ctx.scene.remove(estela); estela = null; } if (cono) { ctx.scene.remove(cono); cono = null; }   // lo que dejó el golpe anterior
    retroceso = null; if (vuelo || rival.tirado || !rival.g.visible || Math.abs(rival.g.position.x - RVX) > .01) { vuelo = null; reponer(); }
    if (marcador) marcador.pon(`${EN ? 'PUNCH' : 'GOLPE'} #${n}`, COMUN.grande(valor) + (valor >= 1e6 ? COMUN.DE : ' ') + 'J');
    // cuándo llega el puño: depende del grito
    tp = f.grito === 'corto' ? .3 + GRITOS.corto.clat : f.grito === 'carga' ? .3 + GRITOS.carga.clat : f.grito === 'final' ? 4.75 : .8;
    // en los golpes sin grito largo también dicen algo: «¡CLAT!» al pegar, «¡BOMBO!» al cargar el brazo, o «BOMBO… CLAT!»
    dice = f.grito ? 'clat' : f.rival ? 'bombo' : ['clat', 'bombo', 'bomboclat'][n % 3];
    if (!f.grito) {
      const rot = (texto, kana, t, y = -.66) => reloj.luego(t, () => ANIME.rotulo({ texto, kana, y, ancho: 1.05, dur: .85, rot: n % 2 ? -.08 : .07 }));
      if (dice !== 'clat') { gritar(n % 2 ? 'bombo' : 'bombo2', tp - .74); rot('BOMBO!', 'ボンボ！', tp - .66, -.6); }
      if (dice !== 'bombo') { gritar(n % 2 ? 'clat1' : 'clat2', tp - .08); if (E < 1e6) rot('CLAT!', 'クラット！', tp, -.74); }
    }
    if (f.grito === 'corto') { gritar('corto', .3); reloj.luego(.3, () => ANIME.rotulo({ texto: 'BOMBO…', kana: 'ボンボ…', y: -.66, ancho: 1.2, dur: .95, rot: -.08 })); }
    if (f.grito === 'carga') { gritar('carga', .3); reloj.luego(.45, () => ANIME.rotulo({ texto: 'BOOOOM…', kana: 'ボォォォム…', y: -.7, ancho: 1.3, dur: 1.2, rot: -.06 }));
      reloj.luego(1.95, () => ANIME.rotulo({ texto: 'BOOOOOOO…', kana: 'ボォォォォ…', y: -.58, ancho: 1.6, dur: 1.35, rot: .05 })); }
    if (f.grito === 'final') { gritar('final', .3); gritar('nani', 3.35, 'rival');
      reloj.luego(.45, () => ANIME.rotulo({ texto: 'BOOOOM…', kana: 'ボォォォム…', y: -.7, ancho: 1.3, dur: 1.2, rot: -.06 }));
      reloj.luego(1.95, () => ANIME.rotulo({ texto: 'BOOOOOOO…', kana: 'ボォォォォ…', y: -.58, ancho: 1.7, dur: 1.4, rot: .05 }));
      reloj.luego(3.45, () => ANIME.rotulo({ texto: EN ? 'NANI?!' : '¿¡NANI!?', kana: 'なに！？', estilo: 'azul', y: -.64, ancho: 1.25, dur: 1.15, rot: .1 }));
      gritar('clat', tp - .1); }
    cargando = f.grito === 'carga' || f.grito === 'final' ? 1 : 0;
    lanzar = () => golpear(c, n, f);
    if (f.fuera) fuera = true;
    if (f.grito === 'final' && hongo) { for (const b of hongo.bolas) ctx.scene.remove(b.m); hongo = null; }
    plan = (f.planos || [[-99, 'dos', { v: n % 4 }]]).map(([t, nombre, o = {}]) => ({ t: t <= -50 ? 0 : o.ev ? Infinity : tp + t, rel: t, nombre, o })).sort((a, b) => a.t - b.t);
    planoAct = null;
  }

  function golpear(c, n, f) {
    pegando = 1; const v = velocidad(E), vv = vista(v), ang = f.angulo ?? .32, gran = f.grito || E >= 1e6;
    let dir = new T.Vector3(Math.cos(ang), Math.sin(ang), ctx.rr(-.04, .04)).normalize();
    if (f.grito === 'final') dir = new T.Vector3(.475, .863, .173).normalize();
    if (v >= 6 || f.grito === 'final') {
      vuelo = { v: dir.clone().multiplyScalar(vv), g: 9.8 * (vv / v) ** 2, real: v, t: 0, giro: Math.min(14, 2 + v * .05), arrasa: vv >= 34, salio: false, final: f.grito === 'final', d0: rival.g.position.clone() };
      if (vuelo.final) { vuelo.g = 0; vuelo.v.set(0, 0, 0); }
      prever();
    } else retroceso = { d: v * .25, t: 0 };
    // los planos que van respecto a un choque (pared, tejado) ya saben cuándo toca
    const espera = (f.grito === 'final' ? .45 : f.grito ? .22 : gran ? .12 : 0) * .94;
    for (const e of plan) if (e.o.ev) { const v = vuelo?.ev?.[e.o.ev]; e.t = v ? tp + espera + v.t + e.rel : Infinity; }
    plan.sort((a, b) => a.t - b.t);
    const cab = rival.g.position.clone(); cab.y += 1.55;
    for (let q = 0; q < 18 + Math.min(40, n * 2); q++) ctx.emit(cab.x - .3, cab.y, cab.z, ctx.rr(-2, 7), ctx.rr(-1, 4), ctx.rr(-3, 3), ctx.R() < .6 ? col.chispa : col.sudor, ctx.rr(.3, .8), 4);
    ctx.sfx('impacto', Math.min(1, .35 + n * .03), 0, n > 20 ? .8 : 1); COMUN.tono(ctx, 160, 38, .4, 'square', Math.min(.45, .12 + n * .015));
    if (gran) { ANIME.negativo(n >= 13 ? .1 : .067); ANIME.destello(.7, .25); lento = .06; lentoT = f.grito === 'final' ? .45 : f.grito ? .22 : .12; ANIME.lineas(1); reloj.luego(.5, () => ANIME.lineas(0));
      if (dice !== 'bombo') ANIME.rotulo(f.grito === 'final' ? { texto: 'CLAAAAAT!!', kana: 'クラアアアット！！', estilo: 'rojo', y: -.68, ancho: 1.95, dur: 1.6, rot: -.12, temblor: 2 }
        : { texto: 'CLAAAT!!', kana: 'クラアアット！！', y: -.7, ancho: 1.8, dur: 1.25, rot: -.1, temblor: 1.5 }); }
    if (f.rival) { gritar('rival', .08, 'rival', .9); reloj.luego(.1, () => ANIME.rotulo({ texto: 'BOMBOCLAAAT!', kana: 'ボンボクラアアット！', estilo: 'azul', y: -.62, ancho: 1.7, dur: 1.4, rot: .08 })); }
    if (n === 4) { protector.visible = true; protector.position.copy(cab).add(new T.Vector3(.12, -.06, 0)); protector.userData.v = new T.Vector3(9, 3.5, ctx.rr(-.5, .5)); }
    sacudida = Math.min(1.2, .25 + n * .04); animoPub = Math.min(1.5, .8 + n * .03);
    if (destruido < 3) ctx.sfx('ovacion', Math.min(.55, .3 + n * .01), .3, ctx.rr(.94, 1.06));   // la grada responde
    cargando = 0; aura.rayos(0); aura.nivel(f.grito === 'final' ? .9 : 0); if (f.grito !== 'final') reloj.luego(.4, () => aura.nivel(0));
    // a partir de 0,5 kg de TNT se rompen las cuerdas del lado este
    if (kgTNT(E) >= .5 && !cuerdasRotas) { cuerdasRotas = true; for (const c of cuerdas) if (c.lado === 'e') ctx.addDebris(c.m, new T.Vector3(ctx.rr(6, 14), ctx.rr(2, 6), ctx.rr(-4, 4)), { size: 1, spin: 2 }); }
    const kg = kgTNT(E);
    if (kg >= 2) explotar(n, kg);
  }

  // dónde va a chocar: pared, tejado, gradas o suelo (para preparar los planos de antes)
  function prever() {
    const p = rival.g.position.clone(), v = vuelo.v.clone(), dt = 1 / 60; vuelo.ev = {};
    for (let t = 0; t < 8; t += dt) { v.y -= vuelo.g * dt; p.addScaledVector(v, dt); const r = Math.hypot(p.x - CX, p.z - CZ);
      if (!vuelo.ev.pared && r > RA - .5 && p.y < ctx.GROUND + HW && destruido < 3) { vuelo.ev.pared = { t, p: p.clone() }; break; }
      if (!vuelo.ev.techo && r < RA && p.y > alturaTecho(r) - .5 && destruido < 3) { vuelo.ev.techo = { t, p: p.clone() }; break; }
      if (!vuelo.arrasa && r > R0 && p.y < alturaGrada(r) && v.y < 0) { vuelo.ev.cae = { t, p: p.clone() }; break; }
      if (p.y < (r < LADO * 1.2 ? H : ctx.GROUND + .1) && v.y < 0) { vuelo.ev.cae = { t, p: p.clone() }; break; } }
  }

  // la explosión: bola de fuego, onda por el suelo, el público y las gradas por los aires, y los edificios cercanos
  function explotar(n, kg) {
    radio = 4.7 * Math.cbrt(kg); const c0 = rival.g.position.clone(), fin = fActual.grito === 'final';
    onda = { r: 2, max: radio * 1.25 };
    if (!fin) {   // en el final la cámara se va con el rival: ni bola de fuego ni hongo que la tapen
    const bola = new T.Mesh(new T.SphereGeometry(1, 28, 18), new T.MeshBasicMaterial({ color: new T.Color(4, 2.2, .7), toneMapped: false, transparent: true, depthWrite: false, fog: false }));
    bola.position.copy(c0); bola.position.y = Math.max(bola.position.y, H + .5); bola.userData.fenPropio = true; ctx.scene.add(bola);
    const anillo = new T.Mesh(new T.RingGeometry(.86, 1, 64), new T.MeshBasicMaterial({ color: 0xfff4e0, transparent: true, opacity: .8, side: T.DoubleSide, depthWrite: false, fog: false }));
    anillo.rotation.x = -Math.PI / 2; anillo.position.set(CX, ctx.GROUND + .4, CZ); anillo.userData.fenPropio = true; ctx.scene.add(anillo);
    efectos.push({ bola, anillo, t: 0, r: radio }); }
    const rEdif = fin ? Math.min(radio, 260) : radio;
    for (const o of edif) { const dx = o.x - CX, dz = o.z - CZ, d = Math.hypot(dx, dz);
      if (d > rEdif || o.state === 2) continue;
      reloj.luego(ctx.rr(.05, .5) + d / 340, () => COMUN.derribar(ctx, o, new T.Vector3(dx / d * 14, 5, dz / d * 14), { polvo: 12, colorPolvo: col.polvo })); }
    barrer(CX, CZ, radio * 1.15, 22 + radio * .6);
    // gradas, pared y tejado
    for (const s of gradas) if (!s.roto && s.r - PASO * 3 < radio) { s.roto = true; const d = new T.Vector3(Math.cos(s.a), .5, Math.sin(s.a)).multiplyScalar(10 + radio * .5); reloj.luego(s.r / 340, () => ctx.addDebris(s.m, d, { size: 12, spin: .5 })); }
    if (radio > RA * .75) { destruido = 3; for (const p of paredes) if (!p.roto) { p.roto = true; const d = new T.Vector3(Math.cos(p.a), .35, Math.sin(p.a)).multiplyScalar(ctx.rr(12, 24)); reloj.luego(RA / 340 + ctx.rr(0, .1), () => ctx.addDebris(p.g, d, { size: 14, spin: .4 })); }
      for (const t of techo) if (!t.roto) { t.roto = true; const d = t.m.position.clone().sub(new T.Vector3(CX, ctx.GROUND, CZ)).setY(0).normalize().multiplyScalar(ctx.rr(8, 20)); d.y = ctx.rr(15, 35); ctx.addDebris(t.m, d, { size: 14, spin: .6 }); }
      luces.rig.visible = false; }
    else if (radio > 20 && destruido < 2) { destruido = 2; for (const t of techo) if (!t.roto && ctx.R() < .6) { t.roto = true; ctx.addDebris(t.m, new T.Vector3(ctx.rr(-6, 6), ctx.rr(18, 30), ctx.rr(-6, 6)), { size: 14, spin: .6 }); } }
    if (radio > 7 && arbitro && arbitro.g.visible) { const a = arbitro; ctx.addDebris(a.g, new T.Vector3(-9, 11, 7), { size: 2, spin: 3 }); arbitroVuela = a; arbitro = null; }
    if (radio > 9 && jueces.mesa && jueces.mesa.parent) ctx.addDebris(jueces.mesa, new T.Vector3(14, 8, ctx.rr(-3, 3)), { size: 4, spin: 1.5 }), jueces.mesa = null;
    if (radio > 30 && !pedestal) {                         // el ring es un cráter: queda un pilar de tierra bajo los dos
      for (const ch of [...ring.children]) if (ctx.R() < .8) ctx.addDebris(ch, new T.Vector3(ctx.rr(-12, 12), ctx.rr(8, 20), ctx.rr(-12, 12)), { size: 3, spin: 2 });
      ring.visible = false; luces.suelo.visible = false;
      pedestal = new T.Mesh(new T.CylinderGeometry(1.9, 2.6, H - ctx.GROUND + 2, 9), M(0x6e5a44)); pedestal.position.set(CX, (H + ctx.GROUND - 2) / 2, CZ); pedestal.castShadow = pedestal.receiveShadow = true; pedestal.userData.fenPropio = true; ctx.scene.add(pedestal);
      const top = new T.Mesh(new T.CylinderGeometry(1.92, 1.92, .1, 9), M(0x2b86d6)); top.position.set(CX, H - .05, CZ); top.userData.fenPropio = true; ctx.scene.add(top); pedestal.userData.top = top;
      crater = new T.Mesh(new T.CircleGeometry(1, 48), M(0x3a2e26, { roughness: 1 })); crater.rotation.x = -Math.PI / 2; crater.position.set(CX, ctx.GROUND + .09, CZ); crater.userData.fenPropio = true; ctx.scene.add(crater);
    }
    if (crater) crater.scale.setScalar(Math.max(crater.scale.x, radio * .55));
    // a partir de una tonelada, hongo
    if (kg >= 1000 && !fin) hongoNuevo(c0, radio);
    COMUN.ruido(ctx, 3.5, 160, Math.min(.85, .25 + n * .02)); ctx.boom(n); if (n >= 22) ctx.sfx('derrumbe', .6, .2);
  }
  // hongo de humo: un tallo y un sombrero de bolas que suben y se abren
  function hongoNuevo(c0, r) {
    if (hongo) for (const b of hongo.bolas) ctx.scene.remove(b.m);
    const bolas = [], k = Math.max(1, r / 40), mats = [0x8f7a66, 0xa38c74, 0x6f6052, 0xc9a77a].map(c => M(c, { roughness: 1 }));
    const fuego = new T.MeshBasicMaterial({ color: new T.Color(3.2, 1.4, .4), toneMapped: false, fog: false });
    for (let i = 0; i < 70; i++) { const tallo = i < 22, a = ctx.rr(0, 6.283);
      const m = new T.Mesh(new T.IcosahedronGeometry(1, 1), i % 9 === 0 ? fuego : mats[i % 4]); m.userData.fenPropio = true; ctx.scene.add(m);
      const rr = tallo ? ctx.rr(0, .25) : ctx.rr(.3, 1.1), hy = tallo ? ctx.rr(0, 1) : ctx.rr(.9, 1.25);
      bolas.push({ m, a, rr, hy, s: (tallo ? ctx.rr(.18, .3) : ctx.rr(.3, .55)) * k * 30, tallo }); }
    hongo = { bolas, t: 0, c: new T.Vector3(c0.x, ctx.GROUND, c0.z), k };
  }

  // el siguiente de la cola entra al ring (y la cola avanza un paso)
  function reponer(ya) {
    if (fuera) { rival.g.visible = false; return; }
    rival.g.visible = true; rival.tirado = false; rival.g.position.set(RVX, H, CZ); rival.g.rotation.set(0, -Math.PI / 2, 0); rival.cuerpo.rotation.set(0, 0, 0); rival.cuerpo.position.set(0, 0, 0); rival.cabeza.scale.setScalar(1);
    const ROPA = [0xf2f2f2, 0x1f2a44, 0xf1c40f, 0x7d3c98, 0x27ae60, 0x222222, 0xe67e22, 0x16a085];
    rival.color(ROPA[golpe % ROPA.length]); rival.guantes(golpe % 2 ? 0xf2c14e : 0x2456c9);
    if (cola.length > 8) { const m = cola.shift(); m.visible = false; for (const o of cola) o.position.x += .95; }
  }

  // ---------- cada fotograma ----------
  function actualizar(c, dt, t) {
    tiempo += dt; ft += dt; reloj.tick(tiempo);
    if (lentoT > 0) { lentoT -= dt; if (lentoT <= 0) lento = 1; }
    const dtl = dt * lento;
    if (lanzar && ft >= tp) { const f = lanzar; lanzar = null; f(); }
    // el que pega: carga (agachado, brazo atrás, aura) → golpe (medio segundo) → guardia
    const fc = fActual.grito === 'carga' || fActual.grito === 'final';
    if (cargando && fc) { const k = Math.min(1, ft / Math.max(.5, tp - .6)); aura.nivel(.25 + k * .75); aura.rayos(k > .45 ? k : 0); if (fActual.grito === 'final') aura.grande(1 + k * .35);
      if (ctx.R() < dt * 30) { const p = yo.g.position, a = ctx.rr(0, 6.283), r = ctx.rr(.4, 1.8); ctx.emit(p.x + Math.cos(a) * r, H + .05, p.z + Math.sin(a) * r, 0, ctx.rr(.8, 2.5), 0, ctx.R() < .5 ? col.oro : col.roca, ctx.rr(.6, 1.4), -.4); }
      if (k > .3) ANIME.lineas(.35 * k, [.5, .5]); }
    if (fActual.grito === 'corto' && ft < tp && ft > .3) cargando = .6;
    if (pegando > 0) { pegando = Math.max(0, pegando - dtl / .5); }
    const kp = pegando > 0 ? Math.sin(Math.min(1, (1 - pegando) * 1.6) * Math.PI / 2) * (pegando > .3 ? 1 : pegando / .3) : 0;
    const kc = lanzar && (fc || fActual.grito === 'corto') ? Math.min(1, ft / .5) * (fActual.grito === 'corto' ? .6 : 1) : 0;
    fa += dtl;
    if (yo.avatar) {     // con animaciones de Mixamo: el directo (golpes 1 y 2) o el cruzado, cuadrados para que el puño llegue en tp
      const ligero = golpe <= 2, imp = ligero ? .55 : 1.07, falta = tp - fa;
      let tc = imp - falta; if (fc && lanzar && falta > .34) tc = Math.min(.73, fa * .5);
      const kca = (fc || fActual.grito === 'corto') && lanzar ? Math.min(1, ft / .5) * Math.min(1, Math.max(0, (falta - .05) / .3)) * (fc ? 1 : .6) : 0;
      yo.pose({ clip: [ligero ? 'punching' : 'cross', Math.max(0, tc)], carga: kca });
    } else { yo.g.position.x = YOX + kp * .45 - kc * .1; yo.pose({ golpe: kp, carga: kc }); }
    yo.hablar(boca('yo'));
    aura.tick(dt); aura.g.visible = aura.g.visible && Math.hypot(ctx.camera.position.x - yo.g.position.x, ctx.camera.position.z - yo.g.position.z) > 1.4;   // con la cámara dentro del aura, todo blanco
    if (retroceso) { retroceso.t += dtl; const k = Math.min(1, retroceso.t / .45); rival.g.position.x = RVX + retroceso.d * (1 - (1 - k) ** 2); if (k >= 1) retroceso = null; }
    // el rival: guardia, encaja el golpe; en el final, antes del golpe, abre los brazos del susto (¿¡NANI!?)
    const susto = fActual.grito === 'final' && lanzar && ft > 3.25 ? Math.min(1, (ft - 3.25) / .3) * .5 : 0;
    if (!vuelo && rival.g.visible && !rival.tirado) { const th = fa - tp; rival.pose({ clip: th >= 0 && th < 1.25 && fa > .1 ? ['golpe_cabeza', th + .08] : ['punching', 0], volar: susto }); rival.hablar(boca('rival')); }
    if (arbitro) arbitro.pose({ golpe: golpe >= 8 ? Math.max(0, Math.sin(tiempo * 3.2)) : 0 });   // a partir del golpe 8, contando hasta diez con el brazo
    // el protector bucal
    if (protector.visible) { const v = protector.userData.v; v.y -= 9.8 * dt; protector.position.addScaledVector(v, dtl); protector.rotation.x += dt * 12;
      if (protector.position.y < ctx.GROUND + .1) protector.visible = false; }
    if (vuelo) volar(dtl, dt);
    // la onda del golpe: un anillo que se abre por el suelo
    if (onda) { onda.r += dt * 320; const n = Math.min(26, 6 + Math.floor(onda.max / 8));
      for (let q = 0; q < n; q++) { const a = ctx.rr(0, 6.283);
        ctx.emit(CX + Math.cos(a) * onda.r, ctx.GROUND + .4, CZ + Math.sin(a) * onda.r, Math.cos(a) * 12, ctx.rr(2, 9), Math.sin(a) * 12, ctx.R() < .4 ? col.fuego : col.polvo, ctx.rr(.8, 1.8), 1.5); }
      if (onda.r > onda.max) onda = null; }
    for (let i = efectos.length - 1; i >= 0; i--) { const e = efectos[i]; e.t += dt; const k = e.t;
      e.bola.scale.setScalar(Math.max(.1, e.r * .32 * Math.min(1, k / .25))); e.bola.material.opacity = Math.max(0, 1 - k / 1.1);
      e.anillo.scale.setScalar(Math.max(.1, e.r * 1.3 * Math.min(1, k / .6))); e.anillo.material.opacity = Math.max(0, .8 * (1 - k / 1.4));
      if (k > 1.5) { ctx.scene.remove(e.bola, e.anillo); efectos.splice(i, 1); } }
    if (hongo) { hongo.t += dt; const k = 1 - Math.exp(-hongo.t / 2.2), K = hongo.k * 30;
      for (const b of hongo.bolas) { const y = b.tallo ? b.hy * K * 3.2 * k : K * 3.2 * k * b.hy + K * .4, r = b.rr * K * (b.tallo ? 1 : 1.7) * (.4 + k);
        b.m.position.set(hongo.c.x + Math.cos(b.a + hongo.t * .1) * r, hongo.c.y + y, hongo.c.z + Math.sin(b.a + hongo.t * .1) * r); b.m.scale.setScalar(b.s * (.3 + k * .9)); b.m.rotation.y += dt * .2; } }
    moverPublico(dt);
    ANIME.tick(dt);
  }

  // el rival por los aires
  function volar(dt, dtReal) {
    const V = vuelo, p = rival.g.position; V.t += dt;
    if (V.final) return volarFinal(dt, dtReal);
    V.v.y -= V.g * dt; p.addScaledVector(V.v, dt);
    rival.cuerpo.rotation.z -= dt * V.giro; rival.cuerpo.rotation.x -= dt * V.giro * .3; rival.pose({ clip: ['golpe_cabeza', Math.min(.28, V.t + .08)], volar: Math.min(1, V.t / .35) }); rival.hablar(boca('rival'));
    const r = Math.hypot(p.x - CX, p.z - CZ);
    if (V.real > 120) for (let q = 0; q < 8; q++) ctx.emit(p.x - V.v.x * ctx.rr(0, .03), p.y + 1, p.z - V.v.z * ctx.rr(0, .03), -V.v.x * .05, ctx.rr(-1, 2), ctx.rr(-2, 2), ctx.R() < .6 ? col.fuego : col.chispa, ctx.rr(.3, .9), -1.5);
    if (V.real > 300 && !cono) conoSonico();
    if (V.real > 900 && !estela) estelaFuego();
    if (V.arrasa && r > R0 - 1 && r < RA) barrer(p.x, p.z, 1.8 + V.real * .002, 12, p.y);
    // contra la pared o el tejado: lo rompe y sigue
    if (!V.salio && destruido < 3) {
      if (r > RA - .6 && p.y < ctx.GROUND + HW) { V.salio = true; romper(paredes, p, 7); }
      else if (r < RA && p.y > alturaTecho(r) - .6) { V.salio = true; romper(techo, p, 8, true); }
    }
    if (V.real > 60 && V.salio) for (const o of edif) { if (o.state === 2) continue;
      if (Math.abs(o.x - p.x) < o.w * .6 + 3 && Math.abs(o.z - p.z) < o.d * .6 + 3 && p.y < o.y0 + o.h) COMUN.derribar(ctx, o, new T.Vector3(V.v.x * .1, 4, 0), { polvo: 10, colorPolvo: col.polvo }); }
    // aterriza: en la lona, en la pista, en las gradas o en la calle
    const suelo = !V.salio ? (r < LADO + .3 && !pedestal ? H : r < R0 || V.arrasa ? ctx.GROUND + .07 : alturaGrada(r)) : ctx.groundAt(p.x, p.z);
    if (p.y <= suelo + .05 && V.v.y < 0) {
      p.y = suelo; rival.cuerpo.rotation.set(-Math.PI / 2, 0, 0); rival.cuerpo.position.y = .15; rival.pose({ volar: .6 }); rival.tirado = true; vuelo = null; animoPub = 1.5;
      for (let q = 0; q < 16; q++) ctx.emit(p.x, p.y + .3, p.z, ctx.rr(-2, 2), ctx.rr(1, 4), ctx.rr(-2, 2), col.polvo, ctx.rr(.6, 1.2), 3);
      if (r > R0 && !V.salio) barrer(p.x, p.z, 1.6, 4);
      ctx.sfx('impacto', .35, 0, .7); const pr = golpe; reloj.luego(1.6, () => { if (golpe === pr) reponer(); });
    } else if (V.t > 6 || r > 1600 || p.y > 1500) { vuelo = null; rival.g.visible = false; const pr = golpe; reloj.luego(.8, () => { if (golpe === pr) reponer(); }); }
    if (cono) { cono.position.copy(p).add(new T.Vector3(0, .9, 0)); cono.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), V.v.clone().normalize().negate()); cono.material.opacity = Math.max(0, cono.material.opacity - dtReal * .25); if (!vuelo) { ctx.scene.remove(cono); cono = null; } }
    if (estela) { estela.position.copy(p).add(new T.Vector3(0, .9, 0)); estela.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), V.v.clone().normalize().negate()); if (!vuelo) { ctx.scene.remove(estela); estela = null; } }
  }
  function romper(lista, p, d, arriba) {
    let n = 0; for (const o of lista) { if (o.roto) continue; const q = o.g ? o.g.position : o.m.position;
      if (Math.hypot(q.x - p.x, (o.g ? p.y - (ctx.GROUND + HW / 2) : q.y - p.y) * .3, q.z - p.z) < d) { o.roto = true; n++;
        const v = vuelo.v.clone().normalize().multiplyScalar(ctx.rr(10, 22)); if (arriba) v.y = ctx.rr(14, 26); else v.y += 4;
        ctx.addDebris(o.g || o.m, v, { size: 10, spin: 1.2 }); } }
    for (let q = 0; q < 60; q++) ctx.emit(p.x, p.y + 1, p.z, vuelo.v.x * ctx.rr(.05, .2) + ctx.rr(-4, 4), ctx.rr(-2, 8), vuelo.v.z * ctx.rr(.05, .2) + ctx.rr(-4, 4), ctx.R() < .5 ? col.polvo : col.humo, ctx.rr(1, 2.2), 6);
    ctx.sfx('derrumbe', .55, 0); ctx.sfx('cristales', .35, .05); sacudida = Math.max(sacudida, .6);
    if (!arriba && destruido < 1) destruido = 1;
  }
  // el cono de vapor de la barrera del sonido y la estela de fuego de Mach 3 en adelante
  function conoSonico() {
    cono = new T.Mesh(new T.ConeGeometry(1.9, 3.6, 32, 1, true), new T.MeshBasicMaterial({ color: 0xf4f8ff, transparent: true, opacity: .55, side: T.DoubleSide, depthWrite: false, fog: false }));
    cono.geometry.translate(0, -1.2, 0); cono.userData.fenPropio = cono.userData.sobrePlaneta = true; ctx.scene.add(cono);
  }
  function estelaFuego() {
    const g = new T.CylinderGeometry(.55, .15, 60, 16, 1, true); g.translate(0, 30, 0);
    estela = new T.Mesh(g, new T.MeshBasicMaterial({ color: new T.Color(3.4, 1.5, .35), toneMapped: false, transparent: true, opacity: .85, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide, fog: false }));
    const nucleo = new T.Mesh(new T.CylinderGeometry(.22, .05, 40, 10, 1, true).translate(0, 20, 0), new T.MeshBasicMaterial({ color: new T.Color(4, 3.6, 3), toneMapped: false, transparent: true, blending: T.AdditiveBlending, depthWrite: false, fog: false }));
    estela.add(nucleo); estela.userData.fenPropio = estela.userData.sobrePlaneta = true; ctx.scene.add(estela);
  }

  // ---------- el final: estilo One Punch Man ----------
  // golpe en la cara a cámara lentísima, sale disparado hacia la cámara, la atraviesa y la cámara se va detrás de él
  // cada vez más rápido, cielo arriba, hasta el Sol
  function THREE_DIR() { return new T.Vector3(.475, .863, .173).normalize(); }
  function volarFinal(dt, dtReal) {
    const V = vuelo, p = rival.g.position, D = THREE_DIR();
    // la cara se aplasta con el puño (los primeros instantes)
    const k = Math.min(1, V.t / .25); rival.cabeza.scale.set(1 + .25 * Math.sin(k * Math.PI), 1 - .2 * Math.sin(k * Math.PI), 1);
    // distancia recorrida: lento al principio y luego exponencial, hasta salir de la atmósfera (600 km);
    // de ahí en adelante lo que crece es el Sol (más lejos, las coordenadas ya no tienen precisión)
    const s = V.t < .35 ? V.t * 2 : Math.min(6e5, .7 + 25 * (Math.exp(1.1 * (V.t - .35)) - 1));
    p.copy(V.d0).addScaledVector(D, s);
    rival.cuerpo.rotation.z -= dt * 3; rival.pose({ volar: 1 }); rival.hablar(.8);
    if (V.t > .35) for (let q = 0; q < 3; q++) { const b = ctx.rr(6, 14); ctx.emit(p.x - D.x * b, p.y + .9 - D.y * b, p.z - D.z * b, 0, 0, 0, col.vapor, ctx.rr(.08, .16), 0); }
    if (V.t > .5) ANIME.lineas(Math.min(.85, (V.t - .5) * .6), [.5, .55]);
    if (!sol) solNuevo();
    // al llegar al Sol, destello blanco
    if (V.t > 12.6 && !V.sol) { V.sol = true; ANIME.destello(1, 2.2, 0xfff1c0); ctx.sfx('whoosh', .5); }   // llega al Sol justo al acabar la frase
  }
  function solNuevo() {
    sol = new T.Group(); sol.userData.fenPropio = sol.userData.sobrePlaneta = true;
    const disco = new T.Mesh(new T.SphereGeometry(1, 48, 32), new T.ShaderMaterial({ fog: false,
      vertexShader: 'varying vec3 vN, vV, vP; void main() { vP = position; vec4 mv = modelViewMatrix * vec4(position, 1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }',
      fragmentShader: `varying vec3 vN, vV, vP; float h(vec3 p) { return fract(sin(dot(p, vec3(12.9, 78.2, 37.7))) * 43758.5); }
        void main() { float mu = clamp(dot(normalize(vN), normalize(vV)), 0.0, 1.0); vec3 q = floor(vP * 40.0);
          float gran = .85 + .15 * h(q); vec3 c = mix(vec3(1.0, .32, .04), vec3(1.0, .82, .45), pow(mu, .6)) * gran;
          gl_FragColor = vec4(c * (.55 + .9 * mu), 1.0); }` }));
    const halo = new T.Mesh(new T.SphereGeometry(1.35, 48, 32), new T.ShaderMaterial({ transparent: true, depthWrite: false, blending: T.AdditiveBlending, fog: false, side: T.BackSide,
      vertexShader: 'varying vec3 vN, vV; void main() { vec4 mv = modelViewMatrix * vec4(position, 1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }',
      fragmentShader: 'varying vec3 vN, vV; void main() { float f = clamp(abs(dot(normalize(vN), normalize(vV))), 0.0, 1.0); float a = pow(f, 4.0) * .8; gl_FragColor = vec4(vec3(1.3, .55, .15) * a, a); }' }));
    sol.add(disco, halo); ctx.scene.add(sol); sol.userData.t = 0;
  }

  // ---------- la cámara ----------
  const V3 = (x, y, z) => new T.Vector3(x, y, z);
  const cabezaDe = l => l.cara();
  const PLANOS = {
    // dos planos: los dos en guardia con el público detrás (4 variantes) y un travelling muy lento
    dos(k, o) { const y = H + 1.3, d = k * .05;
      switch ((o.v ?? 0) % 4) {
        case 0: return { pos: [CX + 1.75 - d, y - .05, CZ - 2.35 + d], mira: [CX - .2, y + .12, CZ], fov: 50 };       // de tres cuartos, la cara del que pega
        case 1: return { pos: [CX - 1.75 + d, y, CZ + 2.35 - d], mira: [CX + .2, y + .08, CZ], fov: 50 };             // la del rival
        case 2: return { pos: [YOX - 1.35 + d, y + .38, CZ - .85], mira: [RVX + .1, y + .15, CZ + .1], fov: 46 };      // por encima del hombro
        default: return { pos: [RVX + 1.55 - d, H + .55, CZ - 1.25], mira: [YOX, y + .3, CZ], fov: 52 };             // contrapicado
      } },
    cara(k) { const c = cabezaDe(yo); return { pos: [c.x + .75 - k * .03, c.y + .03, c.z + .8], mira: [c.x, c.y, c.z], fov: 40 }; },
    rival(k) { const c = cabezaDe(rival); return { pos: [c.x - .62 + k * .02, c.y + .02, c.z + .62], mira: [c.x, c.y, c.z], fov: 40 }; },
    // héroe desde abajo, acercándose mientras carga
    carga(k) { const c = cabezaDe(yo), e = Math.min(1, k / 2.5); return { pos: [c.x + 2.3 - e * .9, H + .35 + e * .3, c.z + 1.7 - e * .8], mira: [c.x, c.y - .35, c.z], fov: 52 - e * 6 }; },
    cargaCerca(k) { const c = cabezaDe(yo); return { pos: [c.x + .62 - k * .03, c.y - .12, c.z - .62], mira: [c.x, c.y - .04, c.z], fov: 42 }; },
    // de lado, muy cerca del choque (la cabeza del rival)
    impacto(k) { const c = cabezaDe(rival); return { pos: [YOX - .15, c.y + .28, CZ - .8 + k * .05], mira: [c.x, c.y - .05, c.z], fov: 46 }; },   // por encima del hombro del que pega, pegado
    // cámara fija junto al ring que sigue al rival y cierra el plano según se aleja
    pan(k, o) { const p = rival.g.position, pos = o.pos || [CX - 3.4, H + 1.4, CZ - 5.6], d = Math.hypot(p.x - pos[0], p.y - pos[1], p.z - pos[2]);
      return { pos, mira: [p.x, p.y + .8, p.z], fov: Math.max(9, Math.min(55, 2 * Math.atan(2.4 / d) * 57.3)) }; },
    grada(k, o) { return PLANOS.pan(k, { pos: [CX - 14, ctx.GROUND + 12, CZ + 12.5] }); },
    ringAlto(k) { return { pos: [CX - 9 + k * .2, H + 7.5, CZ - 9 + k * .1], mira: [CX + .5, H + .6, CZ], fov: 50 }; },
    jueces(k) { return { pos: [CX + 6.2, ctx.GROUND + 2.2, CZ - 3.2], mira: [CX + 9.2, ctx.GROUND + .9, CZ], fov: 46 }; },
    esquina(k) { const p = entrenador.position; return { pos: [p.x + 1.9, p.y + 1.65, p.z - 2.3], mira: [p.x, p.y + 1.45, p.z], fov: 42 }; },
    arbitro(k) { if (!arbitro) return null; const c = cabezaDe(arbitro); return { pos: [c.x + 1.0, c.y + .05, c.z - .55], mira: [c.x, c.y - .1, c.z], fov: 42 }; },
    publico(k) { return { pos: [CX - 4, H + 2.2, CZ - 4 + k * .2], mira: [CX + 12, ctx.GROUND + 7, CZ + 14], fov: 48 }; },
    // fuera: la fachada por donde sale (con el rótulo) y el tejado
    pared(k, o) { const e = vuelo?.ev?.pared?.p || o.p || V3(CX + RA, ctx.GROUND + 9, CZ); return { pos: [e.x + 26 + k * 1.5, ctx.GROUND + 5, e.z - 24], mira: [e.x, e.y, e.z], fov: 50 }; },
    tejado(k, o) { const e = vuelo?.ev?.techo?.p || V3(CX + 10, ctx.GROUND + 25, CZ); return { pos: [e.x - 45, e.y + 22 + k * 2, e.z - 50], mira: [e.x, e.y + 4 + k * 6, e.z], fov: 50 }; },
    // persecución por fuera: detrás y a un lado del rival
    sigue(k) { if (!rival.g.visible) return null; const p = rival.g.position, v = vuelo ? vuelo.v.clone().setY(0).normalize() : V3(1, 0, 0);
      return { pos: [p.x - v.x * 9 + 3, p.y + 3.5, p.z - v.z * 9 - 7], mira: [p.x + v.x * 3, p.y + .8, p.z + v.z * 3], fov: 55 }; },
    // cámara fija junto a la trayectoria: pasa por delante como un meteorito (se coloca al empezar el plano)
    fuego(k, o) { const p = rival.g.position; if (k < .02 || !o.f) { const d = vuelo ? vuelo.v.clone().normalize() : V3(1, 0, 0); o.f = p.clone().addScaledVector(d, 32).add(V3(0, 1.5, -9)).toArray(); }
      return { pos: o.f, mira: [p.x, p.y + .8, p.z], fov: 55 }; },
    // desde lo alto de las gradas, bajo el tejado: para ver las explosiones de dentro
    // el árbitro, camino del hospital
    arbitroVuela(k) { if (!arbitroVuela) return null; const p = arbitroVuela.g.position; return { pos: [p.x + 6, p.y + 2.5, p.z - 7], mira: [p.x, p.y + .8, p.z], fov: 50 }; },
    alto(k) { return { pos: [CX - 19 + k * .3, ctx.GROUND + 15.5, CZ - 17 + k * .3], mira: [CX + 1, H + .5, CZ + 1], fov: 52 }; },
    aereo(k) { const a = fActual.ancho; if (!a) return PLANOS.ringAlto(k); const p = V3(...a.pos), m = V3(...a.mira), d = p.clone().sub(m).multiplyScalar(1 - k * .015); return { pos: m.clone().add(d).toArray(), mira: a.mira, fov: 55 }; },
    cielo(k) { return { pos: [CX - 9, ctx.GROUND + 3 + k * .5, CZ - 13], mira: [CX + 8, ctx.GROUND + 90 + k * 30, CZ + 5], fov: 68 }; },
    cola(k) { return { pos: [CX - 2.4, ctx.GROUND + 1.9, CZ + 3.4], mira: [CX - 30 - k * 3, ctx.GROUND + 1.4, CZ + .8], fov: 46 }; },
    ciudad(k) { const o = PLANOS.ciudad.o ||= edif.find(b => b.state !== 2 && Math.hypot(b.x - CX, b.z - CZ) > 120 && b.h > 25) || { x: CX + 200, z: CZ + 100, h: 40, y0: ctx.GROUND };
      if (k < .05) for (let q = 0; q < 120; q++) ctx.emit(o.x + ctx.rr(-1, 1) * o.w * .5, o.y0 + ctx.rr(.2, 1) * o.h, o.z - (o.d || 20) * .5, ctx.rr(-4, 4), ctx.rr(-2, 4), ctx.rr(-8, -2), col.vapor, ctx.rr(1, 2), 9.8);
      return { pos: [o.x - 20, ctx.GROUND + 8, o.z - 70 + k * 3], mira: [o.x, o.y0 + o.h * .5, o.z], fov: 50 }; },
    // final
    golpeCara(k) { const c = cabezaDe(rival); return { pos: [c.x - .6 + k * .04, c.y + .03, c.z + .42], mira: [c.x, c.y, c.z], fov: 40 }; },
    atraviesa(k) { const D = THREE_DIR(), c = vuelo ? vuelo.d0.clone().add(V3(0, 1.6, 0)) : cabezaDe(rival), cam = c.clone().addScaledVector(D, 7);
      return { pos: cam.toArray(), mira: c.toArray(), fov: 55 }; },
    persigue(k) { const D = THREE_DIR(), p = rival.g.position.clone().add(V3(0, .9, 0)), lado = V3(-D.z, 0, D.x).normalize();
      const atras = 4.5 + Math.min(6, k * .8), cam = p.clone().addScaledVector(D, -atras).addScaledVector(lado, 1.2).add(V3(0, .8, 0));
      return { pos: cam.toArray(), mira: p.clone().addScaledVector(D, 30).toArray(), fov: Math.min(80, 58 + k * 3) }; },
  };
  // qué plano toca ahora; al cambiar de plano, corte seco
  function director(dt) {
    let sel = plan[0]; for (const e of plan) if (ft >= e.t) sel = e;
    if (!sel) return;
    if (sel !== planoAct) { planoAct = sel; planoT = 0; }
    planoT += dt;
    let c = PLANOS[sel.nombre]?.(planoT, sel.o || {});
    if (!c) c = PLANOS.dos(planoT, { v: golpe % 4 });
    ctx.camTo(c.pos, c.mira, 1e-4);
    const dc = Math.hypot(c.pos[0] - c.mira[0], c.pos[1] - c.mira[1], c.pos[2] - c.mira[2]);
    luces.cara.position.set(c.pos[0], c.pos[1] + .35, c.pos[2]); luces.cara.intensity = dc < 2.5 ? 4 : 0;
    ctx.camera.fov = c.fov || 55;
    const d = Math.hypot(c.pos[0] - c.mira[0], c.pos[1] - c.mira[1], c.pos[2] - c.mira[2]);
    sacudida = Math.max(0, sacudida - dt * 2.2); ctx.setShake(sacudida * Math.min(1.5, d * .012));
    // el sol del final se queda delante, cada vez más grande
    if (sol && vuelo && vuelo.final) { sol.userData.t += dt; const kk = Math.min(1, Math.max(0, (vuelo.t - 1.5) / 11)), ang = .012 + Math.pow(kk, 2.2) * .42, D = THREE_DIR();
      const dist = 30000; sol.position.copy(ctx.camera.position).addScaledVector(D, dist); sol.scale.setScalar(Math.tan(ang) * dist); }
  }

  // ---------- después de la cámara del motor: luz, niebla y partículas según dónde está la cámara ----------
  const hemiBase = { v: null };
  function tras(c, dt) {
    if (hemiBase.v === null) hemiBase.v = ctx.hemi.intensity;
    const cp = ctx.camera.position, r = Math.hypot(cp.x - CX, cp.z - CZ);
    interior = destruido < 3 && r < RA - .5 && cp.y < alturaTecho(r);
    ctx.hemi.intensity = interior ? hemiBase.v * .22 : hemiBase.v;
    for (const l of luces.gradas) l.intensity = interior ? 650 : 0;
    luces.foco.intensity = destruido >= 3 ? 0 : 950;
    if (interior) { ctx.scene.fog.color.set(0x0c0d14); ctx.scene.fog.near = 45; ctx.scene.fog.far = 160; ctx.scene.background.set(0x0c0d14); }
    // partículas más pequeñas en los planos cortos
    const d = cp.distanceTo(ctx.camTgt), tam = Math.max(.04, Math.min(4000, d * .01));
    for (const P of ctx.pools) P.mat.size = interior || d < 30 ? Math.min(P.mat.size, tam) : P.mat.size;
    if (golpe === 0) moverPublico(dt);
  }

  // ---------- HUD ----------
  const COSAS = [[0, 'un empujón en el metro', 'a shove on the tube'], [3, 'una bofetada de las buenas', 'a proper slap'],
    [6, 'un balonazo en la cara', 'a football to the face'], [11, 'una coz de caballo', 'a horse kick'],
    [20, 'un choque en bicicleta', 'crashing a bike'], [40, 'un atropello en ciudad', 'being hit by a city car'],
    [90, 'un coche en autopista', 'a car on the motorway'], [200, 'un tren de alta velocidad', 'a high-speed train']];
  function velTexto(v) {
    if (v >= 2000) return `${COMUN.num(v / 1000, 1)} km/s`;
    if (v >= 343) return `Mach ${COMUN.num(v / 343, 1)}`;
    return `${COMUN.num(v * 3.6, 0)} km/h`;
  }

  window.__boxeo = () => ({ yo, rival, ft, tp, plan, planoAct, vuelo });   // para las pruebas automáticas (planos y capturas)
  return {
    crear, fase, sinBoom: true, tras, listo,
    actualizar(c, dt, t) { actualizar(c, dt, t); director(dt); },
    activo: () => ft < tp + 3 || !!vuelo || !!onda || reloj.pendientes > 0,
    mag: v => `${COMUN.grande(v)}${v >= 1e6 ? COMUN.DE : ' '}J`,
    linea3: v => {
      const vel = velocidad(v), kg = kgTNT(v);
      const l1 = (EN ? 'LAUNCH SPEED: ' : 'SALE DESPEDIDO A ') + velTexto(vel);
      if (kg >= .5) return [l1, '= ' + COMUN.textoTNT(kg / 1000).toUpperCase()];
      const c = COSAS.filter(([x]) => vel >= x).pop();
      return [l1, (EN ? 'LIKE ' : 'COMO ') + (EN ? c[2] : c[1]).toUpperCase()];
    },
    danos: () => {
      const v = velocidad(E), kg = kgTNT(E);
      if (fActual.grito === 'final') return EN ? 'Straight into the Sun · he gets there in two days' : 'Directo al Sol · llega en dos días';
      if (kg >= 2) { const r = 4.7 * Math.cbrt(kg);
        return EN ? `Everything flattened within ${COMUN.num(r, 0)} m · ${COMUN.num(ctx.caidos, 0)} buildings down`
          : `Todo plano en ${COMUN.num(r, 0)} m · ${COMUN.num(ctx.caidos, 0)} edificios caídos`; }
      if (v >= 11186) return EN ? 'Past escape velocity · he is not coming back' : 'Supera la velocidad de escape · ya no vuelve';
      const a = v * v * Math.sin(2 * .32) / 9.8, d = a < 1000 ? `${COMUN.num(a, a < 10 ? 1 : 0)} m` : `${COMUN.num(a / 1000, 1)} km`;
      return EN ? `He lands ${d} away` : `Cae a ${d} de aquí`;
    },
  };
})();
