// La playa al atardecer: el mar se retira (peces saltando en la arena), aparece la ola 1 (10 m) en el horizonte,
// Nico grita «¡BOMBOCLAT!» y corre hacia la ciudad; la ola arrasa sombrillas y chiringuito y le alcanza.
// El mar está hacia -z; la ciudad, hacia +z. Nico empieza en z = 6 mirando al mar.
import { THREE, mergeGeometries, material, lienzo, texFachada, caja, azar, clamp, lerp, smooth, easeOutBack, easeInOut, easeOut, easeIn, V, hash,
  nico, nicoReposo, nicoBrazos, nicoCorrer, nicoCabeza, nicoHablar, girar, EX, EY, EZ, ponerCamara, camera } from '../motor.js';
import { hacerOla } from './ola.js';

export async function crear() {
  const { R, rr } = azar(11);
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xf3a37a, 120, 1400);

  // ---------- cielo de atardecer con el sol bajo sobre el mar ----------
  const cielo = new THREE.Mesh(new THREE.SphereGeometry(3000, 48, 24), new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, fog: false,
    vertexShader: 'varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
    fragmentShader: `varying vec3 vD;
      void main(){ float y = vD.y; vec3 c = mix(vec3(1.,.62,.38), vec3(.98,.42,.42), smoothstep(.0,.18,y)); c = mix(c, vec3(.42,.3,.62), smoothstep(.15,.5,y)); c = mix(c, vec3(.16,.16,.38), smoothstep(.5,.95,y));
        // el sol: disco con dos bandas (ilustrado)
        vec3 s = normalize(vec3(-.18,.06,-1.)); float d = dot(vD, s);
        c = mix(c, vec3(1.,.86,.55), step(.9975, d)); c = mix(c, vec3(1.,.78,.5), smoothstep(.985,.9975,d) * .45);
        // nubes alargadas
        float n = sin(vD.x*9.+sin(vD.z*7.)*2.)*sin(vD.z*5.+vD.x*3.); c = mix(c, vec3(1.,.7,.6), step(.55, n) * smoothstep(.08,.14,y) * (1.-smoothstep(.22,.3,y)) * .55);
        gl_FragColor = vec4(c,1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }` }));
  cielo.renderOrder = -5; cielo.material.userData.outlineParameters = { visible: false }; scene.add(cielo);

  // ---------- luces ----------
  scene.add(new THREE.HemisphereLight(0xffd2b0, 0x6a5a8a, 1.0));
  const sol = new THREE.DirectionalLight(0xffb27a, 2.3); sol.position.set(-40, 30, -120); sol.target.position.set(0, 0, 10);
  sol.castShadow = true; sol.shadow.mapSize.set(2048, 2048); Object.assign(sol.shadow.camera, { left: -45, right: 45, top: 45, bottom: -45, near: 10, far: 400 }); sol.shadow.bias = -.0004;
  scene.add(sol, sol.target);
  const relleno = new THREE.DirectionalLight(0x9db4ff, .6); relleno.position.set(30, 20, 60); scene.add(relleno);

  // ---------- arena: sube hacia la ciudad; por debajo de y = 0 está mojada (más oscura) ----------
  const arena = y => y;
  const alto = z => z > 0 ? z * .025 : Math.max(-7, z * .06);
  { const g = new THREE.PlaneGeometry(900, 520, 90, 130); g.rotateX(-Math.PI / 2); g.translate(0, 0, -100);
    const p = g.attributes.position, col = new Float32Array(p.count * 3), seca = new THREE.Color(0xf2cf8f), mojada = new THREE.Color(0xb8925f), c = new THREE.Color();
    for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i), y = alto(z) + Math.sin(x * .15 + z * .3) * .04; p.setY(i, y);
      c.copy(seca).lerp(mojada, smooth(.3, -.2, y)).multiplyScalar(.95 + hash(i) * .08); col.set([c.r, c.g, c.b], i * 3); }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3)); g.computeVertexNormals();
    const m = new THREE.Mesh(g, material({ vertexColors: true, grosor: .001 })); m.receiveShadow = true; m.material.userData.outlineParameters = { visible: false }; scene.add(m); }

  // ---------- el mar: olitas animadas; su nivel baja cuando se retira ----------
  const marU = { tiempo: { value: 0 } };
  const marMat = material({ color: 0x2f8fb8, transparent: true, opacity: .93, sinContorno: true });
  marMat.onBeforeCompile = s => { s.uniforms.tiempo = marU.tiempo;
    s.vertexShader = 'uniform float tiempo;\n' + s.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
      vec4 wp = modelMatrix * vec4(position, 1.); transformed.z += (sin(wp.x * .08 + tiempo * 1.3) * .25 + sin(wp.z * .21 - tiempo * 1.9) * .18 + sin((wp.x + wp.z) * .05 + tiempo) * .3);`);
    s.fragmentShader = s.fragmentShader.replace('#include <dithering_fragment>', `#include <dithering_fragment>
      float esp = step(.86, sin(vViewPosition.x * .9 + vViewPosition.z * .4) * sin(vViewPosition.z * 1.3)); gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(.95,.98,1.), esp * .35);`); };
  const mar = new THREE.Mesh(new THREE.PlaneGeometry(4000, 3000, 200, 150), marMat); mar.rotation.x = -Math.PI / 2; mar.position.z = -1500; mar.receiveShadow = true; scene.add(mar);
  // la orilla: una franja de espuma que sigue al nivel del mar
  const orilla = new THREE.Mesh(new THREE.PlaneGeometry(900, 2.2), material({ color: 0xffffff, transparent: true, opacity: .8, sinContorno: true })); orilla.rotation.x = -Math.PI / 2; scene.add(orilla);

  // ---------- figurantes, sombrillas, toallas, chiringuito ----------
  const piel = [0xf1c27d, 0xe0ac69, 0xc68642, 0x8d5524, 0xffdbac], ropa = [0xe85d4a, 0xf2b134, 0x3b82c4, 0x58b368, 0xf5f5f5, 0x9b59b6, 0xf28db2, 0x2d3436];
  function persona(k) { const parts = [], add = (g, c) => { const col = new THREE.Color(c), n = g.attributes.position.count, a = new Float32Array(n * 3); for (let i = 0; i < n; i++) col.toArray(a, i * 3); g.setAttribute('color', new THREE.BufferAttribute(a, 3)); g.deleteAttribute('uv'); parts.push(g.toNonIndexed ? (g.index ? g.toNonIndexed() : g) : g); };
    const pi = piel[k % 5], ro = ropa[k % 8], pa = ropa[(k * 3 + 2) % 8];
    for (const s of [-1, 1]) { const l = new THREE.CapsuleGeometry(.08, .7, 3, 8); l.translate(s * .1, .45, 0); add(l, k % 3 ? pi : pa);
      const a = new THREE.CapsuleGeometry(.06, .55, 3, 8); a.rotateZ(s * .12); a.translate(s * .25, 1.12, 0); add(a, pi); }
    const tr = new THREE.CapsuleGeometry(.19, .45, 4, 10); tr.translate(0, 1.12, 0); add(tr, ro);
    const sh = new THREE.CylinderGeometry(.2, .19, .22, 10); sh.translate(0, .82, 0); add(sh, pa);
    const he = new THREE.SphereGeometry(.13, 12, 10); he.translate(0, 1.6, 0); add(he, pi);
    const pe = new THREE.SphereGeometry(.135, 12, 8, 0, 6.3, 0, 1.3); pe.translate(0, 1.62, -.01); add(pe, [0x2a1d14, 0x6b4423, 0xe8c27a, 0x111111][k % 4]);
    const m = new THREE.Mesh(mergeGeometries(parts), material({ vertexColors: true, grosor: .004 })); m.castShadow = true; return m; }
  const gente = [];
  for (let i = 0; i < 34; i++) { const p = persona(i), x = rr(-40, 40), z = rr(-2, 22), tumbado = R() < .35;
    p.position.set(x, alto(z), z); p.rotation.y = rr(-3, 3); if (tumbado) { p.rotation.set(-Math.PI / 2, 0, rr(-3, 3)); p.position.y += .15; }
    if (Math.abs(x) < 3 && z < 12) p.position.x += 6;
    scene.add(p); gente.push({ m: p, x: p.position.x, z, tumbado, f: rr(0, 6), v: rr(4, 6.5), reac: rr(0, .8) }); }
  const lona = (a, b) => lienzo(256, 32, g => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? a : b; g.fillRect(i * 32, 0, 32, 32); } });
  const sombrillas = [];
  for (let i = 0; i < 16; i++) { const g = new THREE.Group(), x = rr(-38, 38), z = rr(0, 20);
    const palo = new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, 2.4, 8), material({ color: 0xeeeeee })); palo.position.y = 1.2; g.add(palo);
    const t = lona(['#e63946', '#2a9d8f', '#f4a261', '#3a86ff'][i % 4], '#ffffff'); t.wrapS = THREE.RepeatWrapping;
    const tela = new THREE.Mesh(new THREE.ConeGeometry(1.5, .55, 16, 1, true), material({ map: t, side: THREE.DoubleSide })); tela.position.y = 2.4; g.add(tela);
    const toalla = new THREE.Mesh(new THREE.PlaneGeometry(.9, 1.8), material({ color: ropa[i % 8], side: THREE.DoubleSide, grosor: .002 })); toalla.rotation.x = -Math.PI / 2; toalla.position.set(.9, .03, .2); g.add(toalla);
    g.position.set(x, alto(z), z); g.rotation.y = rr(0, 6); g.traverse(o => { if (o.isMesh) o.castShadow = true; }); scene.add(g); sombrillas.push({ g, x, z, f: rr(0, 6) }); }
  const chiringuito = new THREE.Group();
  { const mad = material({ color: 0x9b6a3c }), paja = material({ color: 0xe0b45c });
    caja(chiringuito, 6, 1.1, 2.2, mad, 0, .55, 0); caja(chiringuito, 6.4, .12, 2.6, material({ color: 0xf4efe6 }), 0, 1.15, 0);
    for (const [x, z] of [[-3, -1.6], [3, -1.6], [-3, 1.4], [3, 1.4]]) caja(chiringuito, .15, 3, .15, mad, x, 1.5, z);
    const techo = new THREE.Mesh(new THREE.ConeGeometry(5.2, 1.6, 4, 1), paja); techo.rotation.y = Math.PI / 4; techo.scale.set(1, 1, .7); techo.position.y = 3.6; chiringuito.add(techo);
    const cartel = new THREE.Mesh(new THREE.PlaneGeometry(3, .6), material({ map: lienzo(512, 100, g => { g.fillStyle = '#1d3f7a'; g.fillRect(0, 0, 512, 100); g.fillStyle = '#ffd23f'; g.font = 'bold 64px Archivo Black, sans-serif'; g.textAlign = 'center'; g.fillText('CHIRINGUITO', 256, 74); }) }));
    cartel.position.set(0, 2.55, 1.55); chiringuito.add(cartel); chiringuito.traverse(o => { if (o.isMesh) o.castShadow = o.receiveShadow = true; }); }
  chiringuito.position.set(-14, alto(16), 16); chiringuito.rotation.y = .15; scene.add(chiringuito);

  // ---------- el paseo y la ciudad al fondo (hacia +z) ----------
  { const pas = new THREE.Mesh(new THREE.BoxGeometry(900, 1.2, 10), material({ color: 0xd9c6a5 })); pas.position.set(0, alto(34) + .2, 36); pas.receiveShadow = true; scene.add(pas);
    for (let i = 0; i < 26; i++) { const w = rr(14, 24), h = rr(10, 34), x = -230 + i * 18 + rr(-3, 3), z = rr(50, 70), t = texFachada({ base: ['#f0d9b5', '#e9b9a0', '#cfe0e8', '#f5f0e6', '#e8c98f'][i % 5], semilla: i });
      t.repeat.set(w / 18, h / 12); const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, 14), material({ map: t, grosor: .002 })); b.position.set(x, alto(34) + h / 2, z); b.castShadow = b.receiveShadow = true; scene.add(b); }
    for (let i = 0; i < 18; i++) { const palm = new THREE.Group(), tr = new THREE.Mesh(new THREE.CylinderGeometry(.18, .28, 7, 8), material({ color: 0x8a6a45 })); tr.position.y = 3.5; tr.rotation.z = .08; palm.add(tr);
      for (let k = 0; k < 6; k++) { const h = new THREE.Mesh(new THREE.ConeGeometry(.5, 3.4, 4), material({ color: 0x3f9a4a })); h.position.set(Math.cos(k) * 1.3, 7, Math.sin(k) * 1.3); h.rotation.set(Math.sin(k) * 1.2, 0, -Math.cos(k) * 1.2); palm.add(h); }
      palm.position.set(-160 + i * 19, alto(32), 31); scene.add(palm); } }

  // ---------- peces que se quedan en la arena cuando el mar se retira ----------
  const NP = 40; let peces;
  { const cuerpo = new THREE.SphereGeometry(.5, 10, 6); cuerpo.scale(1, .42, .16); const cola = new THREE.ConeGeometry(.22, .32, 4); cola.rotateZ(Math.PI / 2); cola.scale(1, 1, .3); cola.translate(-.6, 0, 0);
    const g = mergeGeometries([cuerpo.toNonIndexed(), cola.toNonIndexed()]); g.computeVertexNormals(); g.scale(.55, .55, .55);
    peces = new THREE.InstancedMesh(g, material({ color: 0xffd36b, sinContorno: true }), NP); peces.castShadow = true; scene.add(peces);
    peces.userData.p = Array.from({ length: NP }, (_, i) => { const z = i < 10 ? rr(-14, -3) : rr(-60, -3); return { x: i < 10 ? rr(-6, 6) : rr(-50, 50), z, f: rr(0, 6), v: rr(5, 9) }; }); }

  // ---------- la ola ----------
  const ola = hacerOla(scene, { ancho: 1400, columnas: 160, espuma: 1600, tamEspuma: 2.6 });
  // dónde está el frente (z) y cuánto mide en cada instante
  const frente = t => t < 15.9 ? -900 : lerp(-520, 70, Math.pow(clamp((t - 15.9) / 8.5, 0, 1), 1.35));
  const altura = t => 10 * smooth(15.9, 17.4, t);
  const nivel = t => -6.5 * smooth(9.2, 14.5, t) + 6.5 * smooth(16.4, 18.5, t) * 0;   // el mar se retira

  // ---------- Nico ----------
  const nicoG = new THREE.Group(); scene.add(nicoG);
  const corrida = t => t < 18.6 ? 0 : (t - 18.6) * 6.2 - Math.pow(Math.max(0, 19.2 - t), 2) * 2.5;  // metros que lleva corridos
  const posNico = t => V(0, 0, 6 + Math.max(0, corrida(t)));

  // ---------- los planos ----------
  const PLANOS = [
    // 1. de espaldas a Nico, la playa y el mar al atardecer; la cámara avanza despacio
    { t0: 8.3, t1: 10.7, cam: (k, t) => ({ pos: V(lerp(1.6, 1.2, k), lerp(2.2, 2.0, k), lerp(12, 10.6, k)), mira: V(-4, .6, -30), fov: 50 }) },
    // 2. desde arriba y de lado: la orilla se retira y deja peces saltando
    { t0: 10.7, t1: 15.3, cam: (k, t) => { const e = easeInOut(k); return { pos: V(lerp(16, 12, e), lerp(9, 6, e), lerp(14, 9, e)), mira: V(-2, -2, lerp(-8, -22, e)), fov: 48 }; } },
    // 3. su cara de extrañeza: «¿bomboclat?»
    { t0: 15.3, t1: 16.9, cam: (k, t) => { const h = nicoCabeza(); return { pos: h.clone().add(V(-.55 + k * .1, -.05, -1.25 + k * .15)), mira: h.clone().add(V(0, -.1, 0)), fov: 34 }; } },
    // 4. por encima de su hombro: el muro de agua en el horizonte; latigazo a su cara para el «¡BOMBOCLAT!»
    { t0: 16.9, t1: 17.55, cam: (k, t) => { const h = nicoCabeza(); return { pos: h.clone().add(V(.25, .15, 2.6)), mira: V(-10, 4 + k * 2, -300), fov: lerp(34, 26, easeOut(k)) }; } },
    { t0: 17.55, t1: 18.6, cam: (k, t) => { const z = easeOutBack((t - 17.55) / .28, 2.6), h = nicoCabeza(); return { pos: h.clone().add(V(-.15, -.02, -lerp(2.6, .85, z))), mira: h.clone().add(V(0, -.08, 0)), fov: lerp(40, 32, z) }; } },
    // 5. corre hacia la cámara; detrás, la ola crece
    { t0: 18.6, t1: 22.2, cam: (k, t) => { const p = posNico(t); return { pos: p.clone().add(V(1.2 - k * .8, 1.1, 4.2 - k * .6)), mira: p.clone().add(V(0, 1.6 + k * 1.5, -6)), fov: 52 }; } },
    // 6. desde lo alto: la ola arrasa la playa y le alcanza
    { t0: 22.2, t1: 24.65, cam: (k, t) => { const p = posNico(t), e = easeInOut(k); return { pos: V(lerp(28, 22, e), lerp(14, 11, e), p.z + lerp(10, 4, e)), mira: V(0, 2, p.z - 22), fov: 52 }; } },
  ];

  function ir(t, bombo) {
    const zf = frente(t), h = altura(t), lvl = nivel(t);
    ola.ir(zf, h, t, lvl);
    mar.position.y = lvl; marU.tiempo.value = t;
    // la orilla: donde la arena corta al agua (alto(z) = nivel)
    const zo = lvl > 0 ? lvl / .025 : lvl / .06; orilla.position.set(0, lvl + .03, zo + Math.sin(t * 1.4) * .5); orilla.visible = zf < zo - 5;
    // Nico: mira al mar, se extraña, grita y corre
    nicoReposo();
    const p = posNico(t); nicoG.position.copy(p).setY(alto(p.z));
    const corre = t > 18.6, giro = t < 18.35 ? 0 : easeOutBack(clamp((t - 18.35) / .3, 0, 1), 1.5);
    nicoG.rotation.y = Math.PI * (1 - giro);   // de cara al mar (π) → de cara a la ciudad (0)
    if (corre) nicoCorrer((t - 18.6) * 11, clamp((t - 18.6) / .25, 0, 1));
    else { const susto = smooth(16.95, 17.15, t); nicoBrazos(susto * .9);
      const duda = smooth(15.3, 15.6, t) * (1 - smooth(16.8, 17, t)); girar(nico.hueso.Head, EZ, duda * .22); girar(nico.hueso.Head, EX, duda * .18); // mira los peces, con la cabeza ladeada
      girar(nico.hueso.Spine1, EX, -susto * .12); }
    // al correr mira hacia atrás un momento
    if (corre) { const atras = smooth(20.2, 20.5, t) * (1 - smooth(21.1, 21.4, t)); girar(nico.hueso.Neck, EY, atras * .6); girar(nico.hueso.Head, EY, atras * .5); }
    if (bombo) nicoHablar(bombo.toma, t - bombo.t); else nico.boca.abrir(0);
    nicoG.updateMatrixWorld(true);
    // la gente: se levanta y huye cuando aparece la ola; la que alcanza el agua desaparece
    for (const g of gente) { const d = t - 17.6 - g.reac;
      if (d > 0) { const z = g.z + d * g.v; g.m.rotation.set(0, 0, 0); g.m.position.set(g.x + Math.sin(g.f) * d * .6, alto(z) + Math.abs(Math.sin(d * 11 + g.f)) * .12, z); g.m.rotation.x = .25; }
      g.m.visible = g.m.position.z > zf + 2; }
    for (const s of sombrillas) { const d = t - (s.z - (zf)) * 0; const tocada = zf > s.z - 1;
      if (tocada) { const dd = (zf - s.z) / 10; s.g.position.set(s.x, alto(s.z) + Math.min(6, dd * 4), s.z + dd * 6); s.g.rotation.set(dd * 2 + s.f, s.f, dd); } s.g.visible = zf < s.z + 30; }
    chiringuito.visible = zf < 16 + 12; if (zf > 15) { const dd = (zf - 15) / 10; chiringuito.position.set(-14, alto(16) + dd * 2, 16 + dd * 8); chiringuito.rotation.set(dd * .5, .15 + dd, dd * .3); }
    // los peces: saltan en la arena mojada que ha quedado al aire
    { const mm = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s = V(1, 1, 1);
      peces.userData.p.forEach((f, i) => { const y0 = alto(f.z), fuera = y0 > lvl + .1 && zf < f.z - 3, salto = Math.abs(Math.sin(t * f.v + f.f)) * .45;
        e.set(Math.sin(t * f.v * 1.3 + f.f) * .8, f.f, Math.PI / 2 + Math.sin(t * f.v + f.f) * .6); q.setFromEuler(e); mm.compose(V(f.x, fuera ? y0 + .15 + salto : -50, f.z), q, s); peces.setMatrixAt(i, mm); });
      peces.instanceMatrix.needsUpdate = true; }

    const plano = PLANOS.find(p => t < p.t1) || PLANOS[PLANOS.length - 1], k = clamp((t - plano.t0) / (plano.t1 - plano.t0), 0, 1), c = plano.cam(k, t);
    const temblor = h > 1 ? .02 + smooth(20, 24.5, t) * .12 : 0, latigo = t > 17.55 && t < 18 ? Math.exp(-(t - 17.55) * 9) * .03 : 0;
    ponerCamara(c, t, temblor + latigo);
    cielo.position.copy(camera.position);
  }
  return { scene, ir, preparar() { nicoG.add(nico.g); nico.g.position.set(0, 0, 0); } };
}
