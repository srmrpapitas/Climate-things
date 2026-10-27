// El cuarto de Nico, en un tercer piso, con la calle inundada fuera (la base es tsunami/muestra.js).
// Dos partes: «despertar» (dormido en la cama, una silla choca contra el cristal, se incorpora: «¿bomboclat?»)
// y «ventana» (ola 2: diez metros de agua sobre la ventana, el cristal se raja: «bomboclat…»).
import { THREE, mergeGeometries, RoundedBoxGeometry, material, adaptar, pbr, cargar, caja, redonda, lienzo, texFachada, azar, clamp, lerp, smooth, easeOutBack, easeInOut, easeOut, ruido, V,
  nico, nicoReposo, nicoBrazos, nicoSentado, nicoCabeza, nicoHablar, girar, EX, EY, EZ, ponerCamara, camera, renderer } from '../motor.js';

export async function crear() {
  const { R, rr } = azar(7);
  const scene = new THREE.Scene();
  const AGUA = new THREE.Color(0x0d5a80);
  scene.fog = new THREE.FogExp2(AGUA, .07);

  // ---------- el agua de fuera: degradado (claro arriba, donde está la superficie) ----------
  const fondoU = { tiempo: { value: 0 }, cArr: { value: new THREE.Color(0x6fd6ea) }, cMed: { value: AGUA.clone() }, cAba: { value: new THREE.Color(0x052a45) } };
  const fondo = new THREE.Mesh(new THREE.SphereGeometry(180, 48, 24), new THREE.ShaderMaterial({ uniforms: fondoU, side: THREE.BackSide, depthWrite: false, fog: false,
    vertexShader: 'varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
    fragmentShader: `uniform vec3 cArr,cMed,cAba; uniform float tiempo; varying vec3 vD;
      void main(){ float y = vD.y; vec3 c = mix(cMed, cAba, smoothstep(.0,-.6,y)); c = mix(c, cArr, smoothstep(.15,.9,y));
        float r = sin(vD.x*40.+tiempo*1.3)*sin(vD.z*37.-tiempo)*.5+.5; float s = smoothstep(.72,.98,y);
        c += vec3(.55,.8,.85) * s * (step(.55,r)*.6+.25);
        gl_FragColor = vec4(c,1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }` }));
  fondo.renderOrder = -5; scene.add(fondo);

  // ---------- cáusticas: la luz ondulada que entra por la ventana (textura del foco) ----------
  const causRT = new THREE.WebGLRenderTarget(512, 512, { type: THREE.HalfFloatType, wrapS: THREE.RepeatWrapping, wrapT: THREE.RepeatWrapping });
  const causU = { tiempo: { value: 0 } };
  const causQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({ uniforms: causU, depthTest: false,
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy,0.,1.); }',
    fragmentShader: `uniform float tiempo; varying vec2 vUv;
      float caus(vec2 uv, float t){ vec2 p = mod(uv*6.28318, 6.28318) - 250.; vec2 i = p; float c = 1.; float inten = .005;
        for (int n = 0; n < 5; n++) { float tt = t * (1. - (3.5 / float(n+1))); i = p + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));
          c += 1. / length(vec2(p.x / (sin(i.x + tt) / inten), p.y / (cos(i.y + tt) / inten))); }
        c /= 5.; c = 1.17 - pow(c, 1.4); return pow(abs(c), 8.); }
      void main(){ float c = caus(vUv * 1.6, tiempo * .55 + 23.); c = step(.5, c) * .55 + step(.85, c) * .3;
        float borde = smoothstep(.0,.18,vUv.x)*smoothstep(1.,.82,vUv.x)*smoothstep(.0,.18,vUv.y)*smoothstep(1.,.82,vUv.y);
        vec3 col = vec3(.35,.62,.78) * .55 + vec3(.75,.95,1.) * c * 1.4; gl_FragColor = vec4(col * (.35 + .65 * borde), 1.); }` }));
  const causScene = new THREE.Scene(); causScene.add(causQuad); const causCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  // ---------- luces ----------
  scene.add(new THREE.HemisphereLight(0x9fe3ff, 0x0b2233, .9));
  // la luz del agua entra por la ventana desde arriba (cono estrecho: así no mancha la fachada de fuera)
  const foco = new THREE.SpotLight(0xbfefff, 4.5, 0, .36, .55, 0);
  foco.position.set(.9, 9.5, -10.5); foco.target.position.set(-.3, .2, -.4); foco.map = causRT.texture;
  foco.castShadow = true; foco.shadow.mapSize.set(1024, 1024); foco.shadow.bias = -.0002; foco.shadow.camera.near = 4; foco.shadow.camera.far = 25;
  scene.add(foco, foco.target);
  const azul = new THREE.PointLight(0x52b8e0, 1.2, 6, 2); azul.position.set(0, 1.6, -1.6); scene.add(azul);
  const lampara = new THREE.PointLight(0xffa860, 1.8, 7, 2); scene.add(lampara);
  const arriba = new THREE.DirectionalLight(0xa8eaff, 1.1); arriba.position.set(2, 20, -8); scene.add(arriba);

  // ---------- el cuarto (suelo a y = 0; la ventana en la pared z = -2) ----------
  const ROOM = { x0: -2, x1: 2, z0: -2, z1: 2, alto: 2.7 }, VEN = { x0: -1.1, x1: 1.1, y0: .78, y1: 2.38 };
  const cuarto = new THREE.Group(); scene.add(cuarto);
  const mSuelo = pbr('wood_floor', [2, 2]), mPared = pbr('white_plaster_02', [2, 1.4], { color: 0xcfc8f5 }), mTecho = material({ color: 0xe8e8ee });
  caja(cuarto, 4.4, .1, 4.4, mSuelo, 0, -.05, 0);
  const techo = caja(cuarto, 4.4, .1, 4.4, mTecho, 0, ROOM.alto + .05, 0);
  caja(cuarto, .1, ROOM.alto, 4.4, mPared, ROOM.x0 - .05, ROOM.alto / 2, 0); caja(cuarto, .1, ROOM.alto, 4.4, mPared, ROOM.x1 + .05, ROOM.alto / 2, 0);
  caja(cuarto, 4.4, ROOM.alto, .1, mPared, 0, ROOM.alto / 2, ROOM.z1 + .05);
  const G = .3, zc = ROOM.z0 - G / 2;
  caja(cuarto, VEN.x0 - ROOM.x0 + .2, ROOM.alto, G, mPared, (ROOM.x0 - .2 + VEN.x0) / 2, ROOM.alto / 2, zc);
  caja(cuarto, ROOM.x1 + .2 - VEN.x1, ROOM.alto, G, mPared, (VEN.x1 + ROOM.x1 + .2) / 2, ROOM.alto / 2, zc);
  caja(cuarto, VEN.x1 - VEN.x0, VEN.y0, G, mPared, 0, VEN.y0 / 2, zc);
  caja(cuarto, VEN.x1 - VEN.x0, ROOM.alto - VEN.y1, G, mPared, 0, (VEN.y1 + ROOM.alto) / 2, zc);
  const mMarco = material({ color: 0xf4f4f2 });
  for (const [w, h, x, y] of [[2.3, .07, 0, VEN.y0], [2.3, .07, 0, VEN.y1], [.07, 1.67, VEN.x0, (VEN.y0 + VEN.y1) / 2], [.07, 1.67, VEN.x1, (VEN.y0 + VEN.y1) / 2], [.05, 1.6, 0, (VEN.y0 + VEN.y1) / 2]])
    caja(cuarto, w, h, .09, mMarco, x, y, ROOM.z0 - .12);
  caja(cuarto, 2.4, .05, .34, mMarco, 0, VEN.y0 - .02, ROOM.z0 + .05);
  const cristal = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.6), material({ color: 0xbff4ff, transparent: true, opacity: .1, sinContorno: true }));
  cristal.position.set(0, (VEN.y0 + VEN.y1) / 2, ROOM.z0 - .13); cristal.renderOrder = 3; cuarto.add(cristal);

  // la grieta: ramas que crecen desde el golpe (se pintan en un lienzo encima del cristal)
  const GR = { x: .38, y: .62 }, ramas = [];
  { const brotar = (x, y, a, largo, nivel, t0) => { let px = x, py = y; const n = 6 + Math.floor(R() * 5), paso = largo / n;
      for (let i = 0; i < n; i++) { a += rr(-.45, .45); const nx = px + Math.cos(a) * paso, ny = py + Math.sin(a) * paso;
        ramas.push({ x0: px, y0: py, x1: nx, y1: ny, t: t0 + i * .05 * (1 + nivel), g: 3.2 - nivel }); px = nx; py = ny;
        if (nivel < 2 && R() < .35) brotar(px, py, a + rr(-1.2, 1.2), largo * .45, nivel + 1, t0 + i * .05 + .1); } };
    for (let k = 0; k < 9; k++) brotar(GR.x, GR.y, k / 9 * 6.283 + rr(-.2, .2), rr(.35, .8), 0, k < 3 ? 0 : 2.4 + rr(0, .8)); // la mitad crece al principio y el resto después
    for (let k = 0; k < 14; k++) { const a = k / 14 * 6.283, r = rr(.04, .08); ramas.push({ x0: GR.x + Math.cos(a) * r, y0: GR.y + Math.sin(a) * r, x1: GR.x + Math.cos(a + .45) * r, y1: GR.y + Math.sin(a + .45) * r, t: .05, g: 2.4 }); } }
  const grietaCv = document.createElement('canvas'); grietaCv.width = 1100; grietaCv.height = 800; const gg = grietaCv.getContext('2d');
  const grietaTex = new THREE.CanvasTexture(grietaCv); grietaTex.colorSpace = THREE.SRGBColorSpace;
  const grieta = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.6), new THREE.MeshBasicMaterial({ map: grietaTex, transparent: true, depthWrite: false, fog: false }));
  grieta.material.userData.outlineParameters = { visible: false }; grieta.position.copy(cristal.position).add(V(0, 0, .004)); grieta.renderOrder = 4; cuarto.add(grieta);
  let grietaK = -1;
  function pintarGrieta(k) { // k: segundos desde el golpe
    const kk = Math.round(k * 30) / 30; if (kk === grietaK) return; grietaK = kk; gg.clearRect(0, 0, 1100, 800); gg.lineCap = 'round';
    const px = (x, y) => [(x + 1.1) / 2.2 * 1100, (1 - (y + .8) / 1.6) * 800];
    for (const pasada of [0, 1]) for (const r of ramas) { const f = clamp((kk - r.t) / .08, 0, 1); if (f <= 0) continue;
      const [a, b] = px(r.x0, r.y0), [c, d] = px(lerp(r.x0, r.x1, f), lerp(r.y0, r.y1, f));
      gg.strokeStyle = pasada ? 'rgba(255,255,255,.95)' : 'rgba(10,20,35,.85)'; gg.lineWidth = pasada ? r.g : r.g + 3;
      gg.beginPath(); gg.moveTo(a, b); gg.lineTo(c, d); gg.stroke(); }
    grietaTex.needsUpdate = true; }
  // gotas que se cuelan por la grieta y bajan por el cristal
  const gotas = Array.from({ length: 7 }, (_, i) => { const m = new THREE.Mesh(new THREE.SphereGeometry(.006, 10, 8), material({ color: 0xd8fbff, transparent: true, opacity: .85, grosor: .002 }));
    m.scale.set(1, 1.6, .6); m.userData = { x: GR.x + rr(-.15, .15), t0: rr(.6, 3.5), v: rr(.08, .16) }; cuarto.add(m); m.visible = false; return m; });

  // la cama: el cabecero contra la pared izquierda
  const mMadera = material({ color: 0x7a5136 }), mSabana = pbr('waffle_pique_cotton', [3, 3], { color: 0xf1f1f4 }), mEdredon = pbr('rough_linen', [3, 3], { color: 0x3f6fe0 });
  caja(cuarto, 2.1, .32, 1.5, mMadera, -.95, .16, .5); caja(cuarto, .08, 1.05, 1.56, mMadera, -1.97, .52, .5);
  redonda(cuarto, 2, .24, 1.42, .06, mSabana, -.97, .44, .5);
  redonda(cuarto, .42, .14, .62, .06, mSabana, -1.68, .62, .5).rotation.z = .12;
  const arrugar = (g, a = .035) => { const p = g.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i); p.setY(i, p.getY(i) + Math.sin(x * 7 + z * 3) * a + Math.sin(z * 11) * a * .6); } g.computeVertexNormals(); return g; };
  // edredón echado hacia atrás (parte «ventana»: ya se ha levantado)
  const edredonSuelto = new THREE.Mesh(arrugar(new RoundedBoxGeometry(1.25, .14, 1.55, 6, .07)), mEdredon); edredonSuelto.position.set(-.45, .6, .55); edredonSuelto.rotation.y = .1; edredonSuelto.castShadow = edredonSuelto.receiveShadow = true; cuarto.add(edredonSuelto);
  // edredón que le tapa dormido (parte «despertar»): sobre las piernas y otro trozo hasta el pecho que se cae al incorporarse
  const edPiernas = new THREE.Mesh(arrugar(new RoundedBoxGeometry(1.25, .3, 1.45, 6, .12), .02), mEdredon); edPiernas.position.set(-.35, .9, .5); edPiernas.castShadow = edPiernas.receiveShadow = true; cuarto.add(edPiernas);
  const edPecho = new THREE.Mesh(arrugar(new RoundedBoxGeometry(.6, .22, 1.45, 6, .1), .02), mEdredon); edPecho.castShadow = edPecho.receiveShadow = true; cuarto.add(edPecho);
  const alf = new THREE.Mesh(new THREE.CircleGeometry(.9, 48), material({ color: 0xe9735a })); alf.rotation.x = -Math.PI / 2; alf.position.set(.3, .005, -.7); alf.receiveShadow = true; cuarto.add(alf);
  { const t = lienzo(256, 360, g => { g.fillStyle = '#f3ead6'; g.fillRect(0, 0, 256, 360); g.fillStyle = '#1d3f7a'; g.beginPath(); g.moveTo(0, 360); g.bezierCurveTo(40, 140, 200, 60, 230, 170); g.bezierCurveTo(180, 120, 140, 200, 256, 260); g.lineTo(256, 360); g.fill();
      g.fillStyle = '#fff'; for (let k = 0; k < 9; k++) { g.beginPath(); g.arc(150 + k * 10, 150 + Math.sin(k) * 10, 7, 0, 7); g.fill(); }
      g.fillStyle = '#c33'; g.beginPath(); g.arc(70, 70, 26, 0, 7); g.fill(); });
    const p = new THREE.Mesh(new THREE.PlaneGeometry(.62, .86), material({ map: t })); p.position.set(.9, 1.6, ROOM.z1 - .01); p.rotation.y = Math.PI; cuarto.add(p);
    const p2 = p.clone(); p2.position.set(ROOM.x1 - .02, 1.62, -.95); p2.rotation.y = -Math.PI / 2; p2.scale.setScalar(.8); cuarto.add(p2); }

  // ---------- fuera: la calle bajo el agua ----------
  const CALLE = -8.6, SUP = 11.6;
  const fuera = new THREE.Group(); scene.add(fuera);
  function fachada(w, h, x, y, z, ry, luz = true) { const t = texFachada({ luz }); t.repeat.set(w / 18, h / 12);
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 1), material({ map: t, grosor: .002 })); m.position.set(x, y, z); m.rotation.y = ry; m.receiveShadow = true; fuera.add(m); return m; }
  fachada(60, 40, 0, CALLE + 20, -18.5, 0); fachada(40, 34, -24, CALLE + 17, -6, Math.PI / 2); fachada(40, 26, 26, CALLE + 13, -6, -Math.PI / 2);
  { const t = texFachada({ luz: false }), mk = (w, h, x, y) => { const tt = t.clone(); tt.needsUpdate = true; tt.repeat.set(w / 18, h / 12); tt.offset.set(x / 18 - w / 36, (y - CALLE) / 12 - h / 24);
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, .5), material({ map: tt, grosor: .002 })); m.position.set(x, y, ROOM.z0 - G - .25); fuera.add(m); m.receiveShadow = true; };
    mk(30, 40, -16.1, CALLE + 20); mk(30, 40, 16.1, CALLE + 20); mk(2.2, VEN.y0 - CALLE, 0, (VEN.y0 + CALLE) / 2); mk(2.2, 40 + CALLE - VEN.y1 + 20, 0, VEN.y1 + (40 + CALLE - VEN.y1 + 20) / 2); }
  const suelo = new THREE.Mesh(new THREE.PlaneGeometry(80, 60), material({ color: 0x3d5b66 })); suelo.rotation.x = -Math.PI / 2; suelo.position.set(0, CALLE, -10); suelo.receiveShadow = true; fuera.add(suelo);
  const rayos = [];
  { const t = lienzo(64, 256, g => { const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 256);
      const x = g.getImageData(0, 0, 64, 256); for (let i = 0; i < 64; i++) { const k = Math.pow(Math.sin(i / 63 * Math.PI), 2); for (let j = 0; j < 256; j++) x.data[(j * 64 + i) * 4 + 3] *= k; } g.putImageData(x, 0, 0); });
    for (let k = 0; k < 9; k++) { const m = new THREE.Mesh(new THREE.PlaneGeometry(rr(1.2, 3.2), 26), new THREE.MeshBasicMaterial({ map: t, color: 0xbff3ff, transparent: true, opacity: .2, blending: THREE.AdditiveBlending, depthWrite: false, fog: false, side: THREE.DoubleSide }));
      m.material.userData.outlineParameters = { visible: false }; m.position.set(rr(-14, 14), SUP - 13, rr(-16, -5)); m.rotation.set(0, rr(-.4, .4), rr(-.25, .1)); m.userData.f = rr(0, 6); fuera.add(m); rayos.push(m); } }
  const luzFarola = new THREE.PointLight(0xffb35c, 30, 14, 2); fuera.add(luzFarola);
  // el coche a la deriva: lejos del cristal (en la muestra pasaba demasiado cerca de la cámara)
  const coche = new THREE.Group(); fuera.add(coche);
  { const mc = material({ color: 0xe63946 }), mv = material({ color: 0x14212b }), mr = material({ color: 0x111111 });
    redonda(coche, 4.2, .8, 1.8, .25, mc, 0, .55, 0); redonda(coche, 2.3, .75, 1.65, .3, mv, -.2, 1.25, 0);
    for (const [x, z] of [[-1.35, .9], [1.35, .9], [-1.35, -.9], [1.35, -.9]]) { const r = new THREE.Mesh(new THREE.CylinderGeometry(.38, .38, .3, 20), mr); r.rotation.x = Math.PI / 2; r.position.set(x, .2, z); coche.add(r); }
    for (const z of [.91, -.91]) { const f = new THREE.Mesh(new THREE.CircleGeometry(.13, 16), new THREE.MeshBasicMaterial({ color: 0xfff2c0, fog: false })); f.position.set(2.1, .62, z * .7); f.rotation.y = Math.PI / 2; coche.add(f); } }
  const NP = 70; let peces;
  { const cuerpo = new THREE.SphereGeometry(.5, 10, 6); cuerpo.scale(1, .42, .16); const cola = new THREE.ConeGeometry(.22, .32, 4); cola.rotateZ(Math.PI / 2); cola.scale(1, 1, .3); cola.translate(-.6, 0, 0);
    const g = mergeGeometries([cuerpo.toNonIndexed(), cola.toNonIndexed()]); g.computeVertexNormals(); g.scale(.32, .32, .32);
    peces = new THREE.InstancedMesh(g, material({ color: 0xffd36b, grosor: .003 }), NP); peces.castShadow = true; fuera.add(peces);
    peces.userData.p = Array.from({ length: NP }, () => ({ a: rr(0, 6.28), r: rr(0, 1.8), y: rr(-1, 1.6), f: rr(0, 6), v: rr(.9, 1.2) })); }
  const NB = 260, burb = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({ color: 0xdffaff, size: .09, transparent: true, opacity: .75, depthWrite: false, fog: true,
    map: lienzo(64, 64, g => { g.strokeStyle = '#fff'; g.lineWidth = 6; g.beginPath(); g.arc(32, 32, 24, 0, 7); g.stroke(); g.fillStyle = 'rgba(255,255,255,.25)'; g.fill(); }) }));
  const pb = new Float32Array(NB * 3), vb = []; for (let i = 0; i < NB; i++) { pb[i * 3] = rr(-8, 8); pb[i * 3 + 1] = rr(CALLE, SUP); pb[i * 3 + 2] = rr(-15, -2.8); vb.push(rr(.5, 1.6)); }
  burb.geometry.setAttribute('position', new THREE.BufferAttribute(pb.slice(), 3)); fuera.add(burb);
  const NM = 1800, mota = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({ color: 0x9fd9e8, size: .03, transparent: true, opacity: .5, depthWrite: false }));
  { const p = new Float32Array(NM * 3); for (let i = 0; i < NM; i++) { p[i * 3] = rr(-12, 12); p[i * 3 + 1] = rr(CALLE, SUP); p[i * 3 + 2] = rr(-17, -2.6); } mota.geometry.setAttribute('position', new THREE.BufferAttribute(p, 3)); fuera.add(mota); }

  // ---------- los modelos de Poly Haven ----------
  const [sil, mesita, reloj_, planta, far, cuadro] = await Promise.all([
    cargar('assets/plastic_monobloc_chair_01/plastic_monobloc_chair_01.gltf'), cargar('assets/ClassicNightstand_01/ClassicNightstand_01.gltf'),
    cargar('assets/alarm_clock_01/alarm_clock_01.gltf'), cargar('assets/potted_plant_02/potted_plant_02.gltf'), cargar('assets/street_lamp_01/street_lamp_01.gltf'),
    cargar('assets/hanging_picture_frame_01/hanging_picture_frame_01.gltf')]);
  const m = adaptar(mesita.scene); m.position.set(-1.72, 0, -.58); m.rotation.y = Math.PI / 2; cuarto.add(m);
  const arriba_ = new THREE.Box3().setFromObject(m).max.y;
  const r = adaptar(reloj_.scene); r.position.set(-1.78, arriba_, -.42); r.rotation.y = Math.PI / 2 + .5; cuarto.add(r);
  const pl = adaptar(planta.scene); pl.position.set(1.55, 0, -1.6); pl.scale.setScalar(1.4); cuarto.add(pl);
  const cu = adaptar(cuadro.scene); cu.position.set(-.2, 1.45, ROOM.z1 - .02); cu.rotation.y = Math.PI; cu.scale.setScalar(1.1); cuarto.add(cu);
  { const pie = new THREE.Mesh(new THREE.CylinderGeometry(.03, .07, .32, 16), material({ color: 0x2b2b2b })); pie.position.set(-1.7, arriba_ + .16, -.75); cuarto.add(pie);
    const pan = new THREE.Mesh(new THREE.CylinderGeometry(.11, .16, .2, 24, 1, true), material({ color: 0xffd9a0, emissive: 0xffa040, emissiveIntensity: .9, side: THREE.DoubleSide })); pan.position.set(-1.7, arriba_ + .38, -.75); cuarto.add(pan);
    lampara.position.set(-1.7, arriba_ + .36, -.75); }
  const silla = adaptar(sil.scene); silla.scale.setScalar(1.05); fuera.add(silla);
  const farola = adaptar(far.scene); farola.position.set(-4.6, CALLE, -9.8); farola.scale.setScalar(1.35); fuera.add(farola);
  farola.traverse(o => { if (o.isMesh && /bulb|glass/i.test(o.material.name || o.name)) { o.material.emissive = new THREE.Color(0xffb35c); o.material.emissiveIntensity = 4; } });
  { const fb = new THREE.Box3().setFromObject(farola); luzFarola.position.set((fb.min.x + fb.max.x) / 2, fb.max.y - .5, (fb.min.z + fb.max.z) / 2); }

  // ---------- Nico: un pivote en la cadera para tumbarlo en la cama o ponerlo de pie junto a la ventana ----------
  const pivote = new THREE.Group(); scene.add(pivote);
  let cadera = null;
  const qTumbado = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(V(0, 0, -1), V(-1, 0, 0), V(0, 1, 0))); // cabeza hacia el cabecero, cara arriba
  const qSentado = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(V(0, 0, -1), V(0, 1, 0), V(1, 0, 0)));  // mira hacia los pies de la cama
  const qVentana = new THREE.Quaternion().setFromAxisAngle(EY, Math.PI);                                                                // de cara a la ventana
  const NICO = { x: .05, z: -1.28 };

  // ---------- los planos ----------
  const ventanaC = V(0, 1.55, -2.6);
  function cabeza() { return nicoCabeza(); }
  const PLANOS = {
    despertar: [
      // 1. cenital desde el techo: dormido y arropado; la cámara gira despacio
      { t0: 0, t1: 2.3, cam: (k, t) => { const h = cabeza(); return { pos: h.clone().add(V(.25 - k * .1, 1.55 - k * .25, .02)), mira: h.clone().add(V(.2, 0, 0)), fov: 44, giro: 1.9 - k * .4 }; } },
      // 2. baja y gira hacia la ventana: fuera, peces y un coche a la deriva
      { t0: 2.3, t1: 4.35, cam: (k, t) => { const e = easeInOut(k); return { pos: V(lerp(.1, .55, e), lerp(2.25, 1.45, e), lerp(1.6, .45, e)), mira: mezcla(V(-1.3, .75, .45), ventanaC, e), fov: lerp(52, 46, e) }; } },
      // 3. latigazo a su cara cuando se incorpora
      { t0: 4.35, t1: 6.3, cam: (k, t) => { const z = easeOutBack((t - 4.35) / .3, 2.6), h = cabeza(), d = lerp(1.9, .95, z) - (t - 4.7) * .05;
          const dir = V(.55, .08, -.83).normalize(); return { pos: h.clone().addScaledVector(dir, d), mira: h.clone().add(V(0, -.08, 0)), fov: lerp(46, 32, z) }; } },
    ],
    ventana: [
      // 1. de espaldas, junto a la cama: se acerca despacio a la ventana
      { t0: 24.6, t1: 27.6, cam: (k) => ({ pos: V(lerp(1.05, .7, easeInOut(k)), 1.58, lerp(.6, .05, easeInOut(k))), mira: V(-.08, 1.47, -2.6), fov: 44 - k * 4 }) },
      // 2. desde fuera: la ventana encendida, el agua por encima; la cámara sube hacia la superficie
      { t0: 27.6, t1: 30.05, cam: (k) => { const e = easeInOut(k); return { pos: V(lerp(1.6, 3.2, e), lerp(.6, 6.5, e), lerp(-7.2, -12.5, e)), mira: V(0, lerp(1.6, 4.5, e), -2), fov: 46 }; } },
      // 3. primer plano del cristal que se raja
      { t0: 30.05, t1: 33.2, cam: (k, t) => { const e = easeOut(k); return { pos: V(lerp(.1, .3, e), lerp(1.75, 1.85, e), lerp(-1.0, -1.45, e)), mira: V(GR.x, VEN.y0 + .8 + GR.y - .08, -2.13), fov: lerp(50, 38, e) }; } },
      // 4. de lado: Nico mira la grieta
      { t0: 33.2, t1: 35.0, cam: (k) => { const h = cabeza(); return { pos: h.clone().add(V(-.95 + k * .12, -.05, .55)), mira: h.clone().add(V(.3, -.15, -.3)), fov: 40 }; } },
      // 5. su cara: «bomboclat…» bajito
      { t0: 35.0, t1: 36.6, cam: (k) => { const h = cabeza(), dir = V(.55, .02, -.83).normalize(); return { pos: h.clone().addScaledVector(dir, .62 - k * .08), mira: h.clone().add(V(0, -.08, 0)), fov: 34 }; } },
    ],
  };
  const mezcla = (a, b, k) => a.clone().lerp(b, k);

  // ---------- un instante ----------
  function ir(t, parte, bombo) {
    const desp = parte === 'despertar';
    // Nico
    nicoReposo();
    const choque = desp ? 4.25 : 29.95;
    if (desp) {
      const sube = t < 4.3 ? 0 : easeOutBack(clamp((t - 4.3) / .32, 0, 1), 1.8), resp = Math.sin(t * 1.6) * .5 + .5;
      pivote.position.set(-.98, .7 + sube * .02, .5);
      pivote.quaternion.copy(qTumbado).slerp(qSentado, clamp(sube, 0, 1.08));
      nico.g.position.set(0, -cadera, 0);
      nicoSentado(clamp(sube, 0, 1)); nicoBrazos(sube > 0 ? .35 * (1 - smooth(5.2, 6, t)) : 0);
      girar(nico.hueso.Spine1, EX, -resp * .02 * (1 - sube));
      // gira la cabeza hacia la ventana (a su izquierda) y la inclina al preguntar
      const mira = t < 4.4 ? 0 : easeOutBack(clamp((t - 4.4) / .25, 0, 1), 2.5);
      girar(nico.hueso.Neck, EY, mira * .35); girar(nico.hueso.Head, EY, mira * .55);
      const duda = smooth(4.75, 5.1, t); girar(nico.hueso.Head, EZ, duda * .2); girar(nico.hueso.Head, EX, -duda * .06);
      edPiernas.visible = edPecho.visible = true; edredonSuelto.visible = false;
      edPecho.position.set(lerp(-1.2, -.62, sube), lerp(.9, .95, sube), .5); edPecho.rotation.z = lerp(0, -.25, sube);
    } else {
      edPiernas.visible = edPecho.visible = false; edredonSuelto.visible = true;
      pivote.position.set(NICO.x, 0, NICO.z); pivote.quaternion.copy(qVentana); nico.g.position.set(0, 0, 0);
      const resp = Math.sin(t * 2.4) * .5 + .5, susto = t < choque + .05 ? 0 : easeOutBack(clamp((t - choque - .05) / .25, 0, 1), 2.5) * (1 - smooth(31, 32, t) * .6);
      girar(nico.hueso.Spine1, EX, -.02 - resp * .015); nicoBrazos(susto);
      const salto = t < choque ? 0 : Math.sin(clamp((t - choque) / .35, 0, 1) * Math.PI) * Math.exp(-(t - choque) * 2);
      nico.g.position.y = salto * .045; girar(nico.hueso.Spine2, EX, salto * .12);
      // mira hacia la grieta (arriba a su izquierda) y luego a cámara
      const aGrieta = smooth(choque + .1, choque + .5, t) * (1 - smooth(34.8, 35.2, t)), aCam = smooth(34.8, 35.2, t);
      girar(nico.hueso.Neck, EY, aGrieta * .3 - aCam * .25); girar(nico.hueso.Head, EY, aGrieta * .4 - aCam * .35); girar(nico.hueso.Head, EX, -aGrieta * .18);
      girar(nico.hueso.Head, EZ, aCam * .15);
    }
    if (bombo) nicoHablar(bombo.toma, t - bombo.t, bombo.bajito ? .8 : 1.15); else nico.boca.abrir(0);
    pivote.updateMatrixWorld(true);

    // cámara
    const lista = PLANOS[parte], plano = lista.find(p => t < p.t1) || lista[lista.length - 1], k = clamp((t - plano.t0) / (plano.t1 - plano.t0), 0, 1), c = plano.cam(k, t);
    const sac = (t > choque ? Math.exp(-(t - choque) * 5) * .018 : 0) + (desp && t > 4.35 && t < 4.8 ? Math.exp(-(t - 4.35) * 9) * .03 : 0);
    techo.visible = !(desp && t < 2.3); // en el cenital la cámara está en el techo
    ponerCamara(c, t, sac);

    // el agua, las cáusticas y lo que flota
    fondoU.tiempo.value = t; causU.tiempo.value = t; fondo.position.copy(camera.position);
    renderer.setRenderTarget(causRT); renderer.render(causScene, causCam); renderer.setRenderTarget(null);
    for (const m of rayos) m.material.opacity = .2 * (.65 + .35 * Math.sin(t * .9 + m.userData.f));
    const tt = desp ? t : t - 24.6, DD = desp ? 6.3 : 12;
    coche.position.set(lerp(-6, 4, tt / DD), lerp(-1.4, -.6, tt / DD), -10.5); coche.rotation.set(.25 + tt * .03, .5 + tt * .06, .35 - tt * .02);
    { const mm = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s = V(1, 1, 1);
      peces.userData.p.forEach((f, i) => { const a = f.a + tt * .5 * f.v, cx = lerp(6, -3, tt / DD), x = cx + Math.cos(a) * (1.5 + f.r), z = -6.2 + Math.sin(a) * (1 + f.r * .6), y = 1.4 + f.y + Math.sin(tt * 2 + f.f) * .15;
        e.set(0, -a - Math.PI / 2 + Math.sin(tt * 9 + f.f) * .2, 0); q.setFromEuler(e); mm.compose(V(x, y, z), q, s); peces.setMatrixAt(i, mm); }); peces.instanceMatrix.needsUpdate = true; }
    { const p = burb.geometry.attributes.position; for (let i = 0; i < NB; i++) { p.setY(i, CALLE + ((pb[i * 3 + 1] - CALLE + t * vb[i]) % (SUP - CALLE))); p.setX(i, pb[i * 3] + Math.sin(t * 3 + i) * .05); } p.needsUpdate = true; }
    // la silla: entra por la derecha, choca contra el cristal y sigue a la deriva (en «despertar»); en «ventana» flota lejos
    { const t0 = choque - 1.45; const ts = t - t0;
      const kc = ts < 1.45 ? 1 - Math.pow(1 - clamp(ts / 1.45, 0, 1), 2) : 1; let x = lerp(4.2, .55, kc), z = lerp(-4.8, -2.62, kc), y = lerp(1.0, 1.35, kc), rz = lerp(.9, .25, kc);
      if (ts > 1.45) { const d = ts - 1.45; z = -2.62 - (1 - Math.exp(-d * 3)) * .7; x = .55 - d * .25; y = 1.35 + d * .12; rz = .25 + d * .4; }
      silla.position.set(x, y, z); silla.rotation.set(.3 + ts * .1, -.8 + ts * .2, rz); }
    cristal.position.z = ROOM.z0 - .13 + (t > choque ? Math.sin((t - choque) * 60) * Math.exp(-(t - choque) * 9) * .006 : 0);
    // la grieta y las gotas (solo en «ventana»)
    grieta.visible = !desp && t > choque; if (grieta.visible) pintarGrieta(t - choque);
    for (const g of gotas) { const d = t - choque - g.userData.t0; g.visible = !desp && d > 0;
      if (g.visible) { const yy = VEN.y0 + .8 + GR.y - .06 - d * g.userData.v - d * d * .02; g.position.set(g.userData.x, Math.max(VEN.y0 + .05, yy), ROOM.z0 - .1); } }
  }
  return { scene, ir, preparar() { if (cadera === null) { nicoReposo(); cadera = nico.hueso.Hips.getWorldPosition(new THREE.Vector3()).y - nico.g.getWorldPosition(new THREE.Vector3()).y; } pivote.add(nico.g); } };
}
