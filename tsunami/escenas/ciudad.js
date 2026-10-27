// El rascacielos (planta 45, a 162 m) y la ciudad de abajo. El mar está hacia -z; la torre, en z = 140…180.
// Ola 3 (40 m): entra en la ciudad y rompe los edificios en trozos, fotograma a fotograma.
// Ola 4 (80 m): el agua sube hasta la planta 22; el edificio tiembla y revientan cristales.
// Ola 5 (160 m): un muro de agua llena el cristal; Nico se gira a cámara y grita.
import { THREE, material, lienzo, texFachada, caja, pbr, azar, clamp, lerp, smooth, easeOutBack, easeInOut, easeOut, easeIn, V, hash, ruido,
  nico, nicoReposo, nicoBrazos, nicoCabeza, nicoHablar, girar, EX, EY, EZ, ponerCamara, camera } from '../motor.js';
import { hacerOla, espumaTex } from './ola.js';

export async function crear() {
  const { R, rr } = azar(23);
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xcfe3ef, 350, 2600);

  // ---------- cielo ----------
  const cielo = new THREE.Mesh(new THREE.SphereGeometry(3500, 48, 24), new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { oscuro: { value: 0 } },
    vertexShader: 'varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
    fragmentShader: `uniform float oscuro; varying vec3 vD;
      void main(){ float y = vD.y; vec3 c = mix(vec3(.86,.93,.97), vec3(.45,.68,.92), smoothstep(.0,.35,y)); c = mix(c, vec3(.25,.45,.8), smoothstep(.35,.9,y));
        float n = sin(vD.x*7.+sin(vD.z*5.)*2.)*sin(vD.z*4.+vD.x*2.); c = mix(c, vec3(.98), step(.5, n) * smoothstep(.06,.12,y) * (1.-smoothstep(.25,.35,y)) * .7);
        c = mix(c, c * vec3(.55,.6,.7), oscuro);
        gl_FragColor = vec4(c,1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }` }));
  cielo.renderOrder = -5; cielo.material.userData.outlineParameters = { visible: false }; scene.add(cielo);

  // ---------- luces ----------
  const hemi = new THREE.HemisphereLight(0xdff1ff, 0x6b7a6a, 1.15); scene.add(hemi);
  const sol = new THREE.DirectionalLight(0xfff0d8, 2.1); sol.position.set(-160, 260, -120); sol.target.position.set(0, 0, 0);
  sol.castShadow = true; sol.shadow.mapSize.set(2048, 2048); Object.assign(sol.shadow.camera, { left: -260, right: 260, top: 260, bottom: -260, near: 10, far: 900 }); sol.shadow.bias = -.0006;
  scene.add(sol, sol.target);
  const interior = new THREE.PointLight(0xffd7a8, 60, 30, 1.6); interior.position.set(0, 165, 147); scene.add(interior);

  // ---------- suelo, costa y mar ----------
  const COSTA = -260;
  const suelo = new THREE.Mesh(new THREE.PlaneGeometry(1400, 700), material({ color: 0x8d949a, sinContorno: true })); suelo.rotation.x = -Math.PI / 2; suelo.position.set(0, 0, 90); suelo.receiveShadow = true; scene.add(suelo);
  const playa = new THREE.Mesh(new THREE.PlaneGeometry(1400, 40), material({ color: 0xeacb8c, sinContorno: true })); playa.rotation.x = -Math.PI / 2; playa.position.set(0, .05, COSTA + 15); scene.add(playa);
  // calles: líneas claras entre manzanas
  { const t = lienzo(256, 256, g => { g.fillStyle = '#8d949a'; g.fillRect(0, 0, 256, 256); g.fillStyle = '#5d646b'; g.fillRect(0, 0, 256, 60); g.fillRect(0, 0, 60, 256); g.fillStyle = '#e9e4d6'; for (let i = 0; i < 256; i += 32) { g.fillRect(i, 28, 16, 4); g.fillRect(28, i, 4, 16); } });
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1400 / 24, 700 / 26); suelo.material.map = t; suelo.material.color.set(0xffffff); }
  const marMat = material({ color: 0x2b86b5, sinContorno: true });
  const mar = new THREE.Mesh(new THREE.PlaneGeometry(6000, 4000), marMat); mar.rotation.x = -Math.PI / 2; mar.position.set(0, -.3, COSTA - 2000); scene.add(mar);

  // ---------- la ciudad: manzanas de edificios; los que la ola rompe tienen sus trozos preparados ----------
  const tonos = ['#f0d9b5', '#e9b9a0', '#cfe0e8', '#f5f0e6', '#e8c98f', '#c9d4c5', '#d6c4e4'];
  const mats = tonos.map((b, i) => material({ map: texFachada({ base: b, semilla: i }), grosor: .0015 }));
  function bloque(w, h, d) { const g = new THREE.BoxGeometry(w, h, d), uv = g.attributes.uv, n = g.attributes.normal;
    for (let i = 0; i < uv.count; i++) { const ax = Math.abs(n.getX(i)) > .5 ? d : w; uv.setXY(i, uv.getX(i) * ax / 18, uv.getY(i) * (Math.abs(n.getY(i)) > .5 ? d / 12 : h / 12)); } return g; }
  const edificios = [];
  for (let gz = COSTA + 40; gz < 115; gz += 26) for (let gx = -330; gx <= 330; gx += 24) {
    if (Math.abs(gx) < 36 && gz > 95) continue;
    if (R() < .12) continue;
    const w = rr(12, 19), d = rr(12, 19), lejos = Math.abs(gx) > 200, alto_ = R() < .08 && gz < 0 ? rr(70, 110) : rr(12, 48) * (gz > 40 ? 1.3 : 1);
    const ti = Math.floor(R() * mats.length), m = new THREE.Mesh(bloque(w, alto_, d), mats[ti]); m.position.set(gx + rr(-2, 2), alto_ / 2, gz + rr(-2, 2)); m.castShadow = m.receiveShadow = true; scene.add(m);
    edificios.push({ m, x: m.position.x, z: m.position.z, w, d, h: alto_, color: new THREE.Color(tonos[ti]), lejos });
  }
  // trozos: cajas en una sola malla instanciada (sin contorno), con el color de su edificio
  const trozos = [];
  for (const e of edificios) { if (e.lejos || e.h > 75) continue; const nx = 2, nz = 2, ny = Math.max(2, Math.round(e.h / 12));
    for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) for (let k = 0; k < nz; k++) {
      trozos.push({ e, s: V(e.w / nx * rr(.85, 1.05), e.h / ny * rr(.85, 1.05), e.d / nz * rr(.85, 1.05)), p: V(e.x - e.w / 2 + e.w / nx * (i + .5), e.h / ny * (j + .5), e.z - e.d / 2 + e.d / nz * (k + .5)),
        v: V(rr(-5, 5), rr(2, 12) * (j / ny + .3), rr(14, 30)), w: V(rr(-2, 2), rr(-2, 2), rr(-2, 2)), j: j / ny }); } }
  const NT = trozos.length, trozMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), material({ sinContorno: true }), NT);
  trozMesh.castShadow = true; trozMesh.frustumCulled = false; trozos.forEach((t, i) => trozMesh.setColorAt(i, t.e.color.clone().multiplyScalar(.95 + hash(i) * .1))); scene.add(trozMesh);
  // polvo y espuma cuando se rompe un edificio
  const NPol = 2600, polG = new THREE.BufferGeometry(), polP = new Float32Array(NPol * 3); polG.setAttribute('position', new THREE.BufferAttribute(polP, 3));
  const polvo = new THREE.Points(polG, new THREE.PointsMaterial({ map: espumaTex, color: 0xf4f1ea, size: 9, transparent: true, depthWrite: false, opacity: .85 })); polvo.frustumCulled = false; polvo.material.userData.outlineParameters = { visible: false }; scene.add(polvo);
  const polvoDe = Array.from({ length: NPol }, (_, i) => ({ e: edificios[Math.floor(hash(i, 9) * edificios.length)], a: hash(i, 1) * 6.28, r: hash(i, 2), v: hash(i, 3), y: hash(i, 4) }));

  // ---------- la torre ----------
  const T = { z0: 140, z1: 180, x: 20, piso: 162, techo: 165.6, alto: 178 };
  const torre = new THREE.Group(); scene.add(torre);
  const muro = lienzo(256, 256, g => { g.fillStyle = '#5c7a92'; g.fillRect(0, 0, 256, 256); g.fillStyle = '#86a9c4'; for (let i = 0; i < 4; i++) g.fillRect(i * 64 + 4, 6, 56, 104); for (let i = 0; i < 4; i++) g.fillRect(i * 64 + 4, 134, 56, 104);
    g.fillStyle = '#b8d3e6'; for (let i = 0; i < 4; i++) { g.fillRect(i * 64 + 8, 10, 10, 40); g.fillRect(i * 64 + 8, 138, 10, 40); } g.fillStyle = '#dfe7ee'; g.fillRect(0, 118, 256, 10); g.fillRect(0, 246, 256, 10); });
  muro.wrapS = muro.wrapT = THREE.RepeatWrapping;
  const matTorre = (w, h) => { const t = muro.clone(); t.needsUpdate = true; t.repeat.set(w / 8, h / 7.2); return material({ map: t, grosor: .0012 }); };
  caja(torre, 40, T.piso, 40, matTorre(40, T.piso), 0, T.piso / 2, 160);
  caja(torre, 40, T.alto - T.techo, 40, matTorre(40, T.alto - T.techo), 0, (T.techo + T.alto) / 2, 160);
  caja(torre, 40, T.techo - T.piso, 30, matTorre(40, 4), 0, (T.piso + T.techo) / 2, 165);
  // la planta 45 por dentro: suelo de madera, techo, pared del fondo, sofá, lámpara; cristal de suelo a techo con montantes
  const planta = new THREE.Group(); torre.add(planta);
  caja(planta, 39.8, .05, 10, pbr('wood_floor', [8, 2]), 0, T.piso + .02, 145);
  caja(planta, 39.8, .05, 10, material({ color: 0xf2f2f4 }), 0, T.techo - .03, 145);
  caja(planta, 39.8, 3.6, .1, pbr('white_plaster_02', [8, 1], { color: 0xe6e1f5 }), 0, (T.piso + T.techo) / 2, 149.95);
  for (const s of [-1, 1]) caja(planta, .1, 3.6, 10, material({ color: 0xe6e1f5 }), s * 19.9, (T.piso + T.techo) / 2, 145);
  { const mSofa = material({ color: 0xe76f51 }); caja(planta, 2.4, .45, .9, mSofa, -4, T.piso + .25, 148.5); caja(planta, 2.4, .5, .2, mSofa, -4, T.piso + .7, 149);
    const pie = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, 1.6, 8), material({ color: 0x222222 })); pie.position.set(5, T.piso + .8, 148.8); planta.add(pie);
    const pan = new THREE.Mesh(new THREE.ConeGeometry(.3, .35, 16, 1, true), material({ color: 0xffe2b0, emissive: 0xffb050, emissiveIntensity: .8, side: THREE.DoubleSide })); pan.position.set(5, T.piso + 1.7, 148.8); planta.add(pan); }
  const montantes = []; for (let x = -20; x <= 20; x += 2.5) montantes.push(caja(planta, .1, 3.6, .14, material({ color: 0x2b3440 }), x, (T.piso + T.techo) / 2, T.z0 - .05));
  caja(planta, 40, .14, .2, material({ color: 0x2b3440 }), 0, T.piso + .07, T.z0 - .05); caja(planta, 40, .14, .2, material({ color: 0x2b3440 }), 0, T.techo - .07, T.z0 - .05);
  const cristal = new THREE.Mesh(new THREE.PlaneGeometry(40, 3.6), material({ color: 0xcfefff, transparent: true, opacity: .1, sinContorno: true, side: THREE.DoubleSide }));
  cristal.position.set(0, (T.piso + T.techo) / 2, T.z0); cristal.renderOrder = 3; planta.add(cristal);
  // cristales que revientan con la ola 4 (justo encima del agua) y con la ola 5 (en su planta)
  const NV = 1400, vidG = new THREE.BufferGeometry(), vidP = new Float32Array(NV * 3); vidG.setAttribute('position', new THREE.BufferAttribute(vidP, 3));
  const vidrios = new THREE.Points(vidG, new THREE.PointsMaterial({ color: 0xe8fbff, size: .6, transparent: true, opacity: .9, depthWrite: false })); vidrios.frustumCulled = false; vidrios.material.userData.outlineParameters = { visible: false }; scene.add(vidrios);

  // ---------- las olas ----------
  const ola3 = hacerOla(scene, { ancho: 1600, columnas: 170, espuma: 2400, tamEspuma: 2.6, atras: 4000 });
  const ola5 = hacerOla(scene, { ancho: 2400, columnas: 170, espuma: 2200, tamEspuma: 2.6, atras: 4000, hondo: 0x12496d, claro: 0x3a9cc0 });
  // ola 3: entra por la costa a las 39,8 s y llega al pie de la torre hacia las 48 s
  const frente3 = t => lerp(COSTA - 420, T.z0 - 2, Math.pow(clamp((t - 39.3) / 8.6, 0, 1), 1.1));
  const alto3 = t => lerp(40 * smooth(38.6, 40.4, t), 80, smooth(48.3, 51.5, t)); // con la ola 4 el agua sube hasta 80 m (planta 22)
  const frente5 = t => lerp(-1300, T.z0 + 6, Math.pow(clamp((t - 53.4) / 6.9, 0, 1), 1.3));
  const alto5 = t => 168 * smooth(53.4, 55.5, t);
  const golpe = e => { // cuándo alcanza la ola 3 a un edificio
    const z = e.z - e.d / 2; let a = 39.3, b = 48.2; for (let i = 0; i < 20; i++) { const m = (a + b) / 2; if (frente3(m) < z) a = m; else b = m; } return b; };
  for (const e of edificios) e.tg = golpe(e);

  // ---------- Nico en la planta 45, con la frente pegada al cristal ----------
  const nicoG = new THREE.Group(); nicoG.position.set(1.5, T.piso, T.z0 + .42); nicoG.rotation.y = Math.PI; scene.add(nicoG);
  const ojoNico = () => nicoCabeza();

  // ---------- los planos ----------
  const P = T.piso, Z = T.z0;
  const PLANOS = [
    // 1. desde fuera, la cámara sube por la fachada hasta su ventana
    { t0: 36.6, t1: 38.7, cam: (k, t) => { const e = easeOut(k); return { pos: V(lerp(-14, 2.5, e), lerp(110, P + 2.2, e), lerp(Z - 34, Z - 6.5, e)), mira: V(lerp(-2, 1.5, e), lerp(140, P + 1.75, e), Z + 2), fov: 44 }; } },
    // 2. por encima de su hombro: la ciudad y el mar; en el horizonte se levanta la ola
    { t0: 38.7, t1: 40.4, cam: (k, t) => ({ pos: V(3.3, P + 2.05, Z + 2.6), mira: V(-60, 40, -260 - k * 40), fov: 52 }) },
    // 3. vista aérea: la ola entra en la ciudad
    { t0: 40.4, t1: 42.8, cam: (k, t) => { const zf = frente3(t); return { pos: V(lerp(-200, -150, k), lerp(150, 120, k), zf + 140), mira: V(-40, 10, zf - 30), fov: 50 }; } },
    // 4. más cerca: los edificios se parten en trozos
    { t0: 42.8, t1: 45.1, cam: (k, t) => { const zf = frente3(t); return { pos: V(lerp(110, 80, k), lerp(55, 45, k), zf + 110), mira: V(0, 18, zf - 10), fov: 50 }; } },
    // 5. su cara pegada al cristal: «BOMBOCLAT»
    { t0: 45.1, t1: 47.3, cam: (k, t) => { const h = ojoNico(); return { pos: h.clone().add(V(-.35, -.05, -1.05 + k * .12)), mira: h.clone().add(V(0, -.08, 0)), fov: 36 }; } },
    // 6. la ciudad inundada llega al pie de la torre
    { t0: 47.3, t1: 48.4, cam: (k, t) => ({ pos: V(-2.5, P + 2.6, Z + 2.2), mira: V(10, 70, Z - 140), fov: 56 }) },
    // 7. desde fuera: el agua sube por la torre hasta la planta 22 y revientan cristales
    { t0: 48.4, t1: 51.2, cam: (k, t) => ({ pos: V(lerp(-30, -18, k), lerp(82, 98, k), Z - 70), mira: V(0, lerp(70, 95, k), Z), fov: 52 }) },
    // 8. dentro: mira abajo, todo tiembla
    { t0: 51.2, t1: 53.6, cam: (k, t) => ({ pos: V(4.2, P + 2.1, Z + 1.6), mira: V(-6, 105, Z - 120), fov: 56 }) },
    // 9. el muro de 160 m llega a la altura de sus ojos
    { t0: 53.6, t1: 56.6, cam: (k, t) => ({ pos: V(lerp(4.5, 3.6, k), P + 1.95, lerp(Z + 4.2, Z + 3.4, k)), mira: V(-10, P - 4, Z - 300), fov: lerp(58, 50, k) }) },
    // 10. se gira a cámara con el muro detrás y grita
    { t0: 56.6, t1: 60.45, cam: (k, t) => { const h = ojoNico(), z = t < 57.85 ? 0 : easeOutBack((t - 57.85) / .3, 2.2);
        return { pos: h.clone().add(V(.2, .05, lerp(3.2, .95, z))), mira: h.clone().add(V(0, lerp(-.1, -.06, z), 0)), fov: lerp(54, 40, z) }; } },
  ];

  function ir(t, bombo) {
    // olas
    const zf3 = t > 48.2 ? T.z0 + 300 : frente3(t), h3 = alto3(t);
    ola3.ir(zf3, h3, t, 0);
    ola5.ir(frente5(t), alto5(t), t, 0); ola5.mesh.visible = ola5.espuma.visible = t > 53.4;
    // edificios: intactos hasta que llega la ola; luego sus trozos salen empujados, caen y se hunden
    const mm = new THREE.Matrix4(), q = new THREE.Quaternion(), e3 = new THREE.Euler();
    for (const e of edificios) e.m.visible = !(t > e.tg && !e.lejos && e.h <= 75) && !(t > 48.6 && e.h < h3 - 4);
    trozos.forEach((tr, i) => { const d = t - tr.e.tg;
      if (d <= 0 || t > 49) { mm.makeScale(0, 0, 0); trozMesh.setMatrixAt(i, mm); return; }
      const arrastre = 1 - Math.exp(-d * 1.2), x = tr.p.x + tr.v.x * arrastre / 1.2, z = tr.p.z + tr.v.z * arrastre / 1.2 + d * 9,
        y = Math.max(tr.p.y + tr.v.y * d - 4.9 * d * d, Math.min(h3 * .6, 30) - 6 - d * 2);
      e3.set(tr.w.x * d, tr.w.y * d, tr.w.z * d); q.setFromEuler(e3); mm.compose(V(x, y, z), q, tr.s); trozMesh.setMatrixAt(i, mm); });
    trozMesh.instanceMatrix.needsUpdate = true;
    for (let i = 0; i < NPol; i++) { const p = polvoDe[i], d = t - p.e.tg; if (d < 0 || p.e.lejos || t > 49) { polP[i * 3 + 1] = -500; continue; }
      const r = (p.r * 14 + d * (10 + p.v * 18)); polP[i * 3] = p.e.x + Math.cos(p.a) * r; polP[i * 3 + 1] = p.e.h * p.y + d * (4 + p.v * 8); polP[i * 3 + 2] = p.e.z + Math.sin(p.a) * r * .6 + d * 14; }
    polG.attributes.position.needsUpdate = true; polvo.material.opacity = .85;
    // cristales que revientan: con la ola 4 a ras de agua y con la ola 5 en su planta
    for (let i = 0; i < NV; i++) { const a = hash(i, 1), b = hash(i, 2), c = hash(i, 3), cuatro = i < NV * .7;
      const t0 = cuatro ? 48.9 + a * 2.6 : 60.05 + a * .2, d = t - t0; if (d < 0 || d > 3) { vidP[i * 3 + 1] = -500; continue; }
      const nivel = cuatro ? h3 + 2 + b * 10 : P + 1 + b * 2.4, cara = c < .5;
      vidP[i * 3] = cara ? -20 + hash(i, 5) * 40 : -20 - d * 6 * hash(i, 6); vidP[i * 3 + 1] = nivel + d * 4 - 4.9 * d * d; vidP[i * 3 + 2] = cara ? Z - d * (6 + 10 * hash(i, 7)) : 140 + hash(i, 5) * 40; }
    vidG.attributes.position.needsUpdate = true;

    // Nico: la frente en el cristal; tiembla con la ola 4; al final se gira a cámara
    nicoReposo();
    const gira = t < 57.3 ? 0 : easeOutBack(clamp((t - 57.3) / .45, 0, 1), 1.6);
    nicoG.rotation.y = Math.PI * (1 - gira); nicoG.position.z = T.z0 + .42 + gira * .5;
    const tiembla = smooth(48.3, 49, t) * (1 - smooth(53, 53.6, t)) + smooth(53.6, 60, t) * .6;
    girar(nico.hueso.Spine1, EX, .12 * (1 - gira)); girar(nico.hueso.Neck, EX, .14 * (1 - gira));
    const miraAbajo = smooth(38.7, 39.2, t) * (1 - smooth(52.8, 53.4, t)); girar(nico.hueso.Head, EX, miraAbajo * .35 * (1 - gira));
    nicoBrazos(gira > 0 ? .9 : smooth(48.4, 48.7, t) * .5);
    if (gira > 0) { girar(nico.hueso.Head, EX, -.1); }
    if (bombo) nicoHablar(bombo.toma, t - bombo.t, bombo.toma === 9 ? 1.25 : 1.15); else nico.boca.abrir(0);
    nicoG.position.x = 1.5 + Math.sin(t * 60) * .01 * tiembla;
    nicoG.updateMatrixWorld(true);
    // la torre se balancea con la ola 4
    torre.position.x = Math.sin(t * 9) * .08 * tiembla; torre.rotation.z = Math.sin(t * 3.1) * .002 * tiembla;
    cielo.material.uniforms.oscuro.value = smooth(53.6, 58, t) * .8;
    hemi.intensity = 1.15 - smooth(54, 59, t) * .45;

    const plano = PLANOS.find(p => t < p.t1) || PLANOS[PLANOS.length - 1], k = clamp((t - plano.t0) / (plano.t1 - plano.t0), 0, 1), c = plano.cam(k, t);
    const sac = .004 + tiembla * .03 + (t > 57.85 && t < 58.3 ? Math.exp(-(t - 57.85) * 9) * .04 : 0) + smooth(59.4, 60.3, t) * .08;
    ponerCamara({ ...c, near: .05, far: 6000 }, t, sac);
    cielo.position.copy(camera.position);
  }
  return { scene, ir, preparar() { nicoG.add(nico.g); nico.g.position.set(0, 0, 0); } };
}
