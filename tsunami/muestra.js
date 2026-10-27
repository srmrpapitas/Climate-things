// Muestra de 5 s del tsunami: Nico mira por la ventana de su cuarto, que está a diez metros bajo el agua.
// Una silla choca contra el cristal, gira la cabeza de golpe y dice «¿bomboclat?». Luego, plano desde fuera.
// ?estilo=cine (texturas reales, profundidad de campo) o ?estilo=ilustrado (sombreado por bandas y contorno de tinta).
// ?grabar=1: el tiempo solo avanza con __peli.ir(t) (tsunami/grabar.mjs saca los fotogramas y mezcla el sonido).
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { Pass } from 'three/addons/postprocessing/Pass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const params = new URLSearchParams(location.search);
const ESTILO = params.get('estilo') === 'ilustrado' ? 'ilustrado' : 'cine', ILU = ESTILO === 'ilustrado';
const GRABAR = params.get('grabar') === '1';
document.body.classList.add(ESTILO);
const DUR = 5, FPS = 30;

// ---------- utilidades ----------
const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), lerp = (a, b, t) => a + (b - a) * t;
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const easeOutBack = (t, s = 2.2) => { t = clamp(t, 0, 1) - 1; return 1 + t * t * ((s + 1) * t + s); };   // se pasa y vuelve: el latigazo
const easeInOut = t => (t = clamp(t, 0, 1), t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = t => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
let seed = 7; const R = () => (seed = (seed * 16807) % 2147483647) / 2147483647, rr = (a, b) => a + R() * (b - a);
const ruido = t => Math.sin(t * 1.7) * .5 + Math.sin(t * 3.1 + 1.3) * .3 + Math.sin(t * 7.3 + .4) * .2;

// ---------- render ----------
const stage = document.getElementById('stage');
const W = GRABAR ? 1080 : Math.round(Math.min(innerWidth, innerHeight * 9 / 16)), H = Math.round(W * 16 / 9);
stage.style.width = W + 'px'; stage.style.height = H + 'px'; stage.style.fontSize = (W / 15) + 'px';
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: GRABAR });
renderer.setPixelRatio(GRABAR ? 1 : Math.min(devicePixelRatio, 2)); renderer.setSize(W, H);
renderer.toneMapping = ILU ? THREE.NeutralToneMapping ?? THREE.ACESFilmicToneMapping : THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = ILU ? 1.05 : 1.0;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
stage.prepend(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, 9 / 16, .03, 400);
const AGUA = new THREE.Color(ILU ? 0x0d5a80 : 0x05304a);
scene.fog = new THREE.FogExp2(AGUA, ILU ? .07 : .075);

// en el estilo ilustrado todo pasa a sombreado por bandas (3 tonos) con contorno de tinta
const bandas = (() => { const d = new Uint8Array([70, 150, 255]); const t = new THREE.DataTexture(d, 3, 1, THREE.RedFormat); t.needsUpdate = true; return t; })();
const TINTA = [.04, .05, .09];
function material(o) { // o: { color, map, normalMap, roughness, metalness, emissive, transparent, opacity, fuera }
  const fog = !!o.fuera; let m;
  if (ILU) m = new THREE.MeshToonMaterial({ color: o.color ?? 0xffffff, map: o.map || null, gradientMap: bandas, emissive: o.emissive ?? 0, emissiveIntensity: o.emissiveIntensity ?? 1,
    transparent: !!o.transparent, opacity: o.opacity ?? 1, fog, side: o.side ?? THREE.FrontSide });
  else m = new THREE.MeshStandardMaterial({ color: o.color ?? 0xffffff, map: o.map || null, normalMap: o.normalMap || null, roughness: o.roughness ?? .8, metalness: o.metalness ?? 0,
    roughnessMap: o.roughnessMap || null, emissive: o.emissive ?? 0, emissiveIntensity: o.emissiveIntensity ?? 1, transparent: !!o.transparent, opacity: o.opacity ?? 1, fog, side: o.side ?? THREE.FrontSide });
  if (o.sinContorno) m.userData.outlineParameters = { visible: false };
  else m.userData.outlineParameters = { thickness: o.grosor ?? .0045, color: TINTA, alpha: 1 };
  return m;
}
// los modelos de Poly Haven: en el estilo ilustrado se cambia cada material por su versión de bandas
function adaptar(obj, fuera = false) {
  obj.traverse(m => { if (!m.isMesh) return; m.castShadow = m.receiveShadow = true;
    const mats = Array.isArray(m.material) ? m.material : [m.material];
    const nuevos = mats.map(a => {
      if (!ILU) { a.fog = fuera; return a; }
      const n = material({ color: a.color, map: a.map, transparent: a.transparent, opacity: a.opacity, emissive: a.emissive, fuera, side: a.side });
      if (a.map) { n.map.colorSpace = THREE.SRGBColorSpace; }
      return n; });
    m.material = Array.isArray(m.material) ? nuevos : nuevos[0]; });
  return obj;
}
const texLoader = new THREE.TextureLoader();
const tex = (ruta, rep = [1, 1], color = true) => { const t = texLoader.load(ruta); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...rep); t.anisotropy = 8;
  if (color) t.colorSpace = THREE.SRGBColorSpace; return t; };
const pbr = (id, rep, extra = {}) => ILU ? material({ map: tex(`assets/${id}/diff.jpg`, rep), ...extra })
  : material({ map: tex(`assets/${id}/diff.jpg`, rep), normalMap: tex(`assets/${id}/nor.jpg`, rep, false), roughnessMap: tex(`assets/${id}/rough.jpg`, rep, false), ...extra });
const gltf = new GLTFLoader();
const cargar = url => new Promise((ok, mal) => gltf.load(url, ok, undefined, mal));

// ---------- el agua de fuera: degradado (claro arriba, donde está la superficie) ----------
const fondoU = { tiempo: { value: 0 }, cArr: { value: new THREE.Color(ILU ? 0x6fd6ea : 0x2f8fb0) }, cMed: { value: AGUA.clone() }, cAba: { value: new THREE.Color(ILU ? 0x052a45 : 0x010b12) }, ilu: { value: ILU ? 1 : 0 } };
const fondo = new THREE.Mesh(new THREE.SphereGeometry(180, 48, 24), new THREE.ShaderMaterial({ uniforms: fondoU, side: THREE.BackSide, depthWrite: false, fog: false,
  vertexShader: 'varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
  fragmentShader: `uniform vec3 cArr,cMed,cAba; uniform float tiempo, ilu; varying vec3 vD;
    void main(){ float y = vD.y; vec3 c = mix(cMed, cAba, smoothstep(.0,-.6,y)); c = mix(c, cArr, smoothstep(.15,.9,y));
      // la ventana de Snell: la superficie se ve brillante y ondulada justo encima
      float r = sin(vD.x*40.+tiempo*1.3)*sin(vD.z*37.-tiempo)*.5+.5; float s = smoothstep(.72,.98,y);
      c += vec3(.55,.8,.85) * s * (ilu > .5 ? step(.55,r)*.6+.25 : r*.5+.2);
      gl_FragColor = vec4(c,1.);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }` }));
fondo.renderOrder = -5; scene.add(fondo);

// ---------- cáusticas: la luz ondulada que entra por la ventana (textura de la luz del foco) ----------
const causRT = new THREE.WebGLRenderTarget(512, 512, { type: THREE.HalfFloatType, wrapS: THREE.RepeatWrapping, wrapT: THREE.RepeatWrapping });
const causU = { tiempo: { value: 0 }, ilu: { value: ILU ? 1 : 0 } };
const causQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({ uniforms: causU, depthTest: false,
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy,0.,1.); }',
  // fórmula de cáusticas de agua tileable (Dave_Hoskins, Shadertoy)
  fragmentShader: `uniform float tiempo, ilu; varying vec2 vUv;
    float caus(vec2 uv, float t){ vec2 p = mod(uv*6.28318, 6.28318) - 250.; vec2 i = p; float c = 1.; float inten = .005;
      for (int n = 0; n < 5; n++) { float tt = t * (1. - (3.5 / float(n+1))); i = p + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));
        c += 1. / length(vec2(p.x / (sin(i.x + tt) / inten), p.y / (cos(i.y + tt) / inten))); }
      c /= 5.; c = 1.17 - pow(c, 1.4); return pow(abs(c), 8.); }
    void main(){ float c = caus(vUv * 1.6, tiempo * .55 + 23.); if (ilu > .5) c = step(.5, c) * .55 + step(.85, c) * .3;
      float borde = smoothstep(.0,.18,vUv.x)*smoothstep(1.,.82,vUv.x)*smoothstep(.0,.18,vUv.y)*smoothstep(1.,.82,vUv.y);
      vec3 col = vec3(.35,.62,.78) * .55 + vec3(.75,.95,1.) * c * 1.4; gl_FragColor = vec4(col * (.35 + .65 * borde), 1.); }` }));
const causScene = new THREE.Scene(); causScene.add(causQuad); const causCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

// ---------- luces ----------
const hemi = new THREE.HemisphereLight(0x9fe3ff, 0x0b2233, ILU ? .9 : .35); scene.add(hemi);
const foco = new THREE.SpotLight(0xbfefff, ILU ? 4.5 : 5, 0, .42, .55, 0); // la luz del agua entra por la ventana desde arriba
foco.position.set(.9, 9.5, -10.5); foco.target.position.set(-.3, .2, -.4); foco.map = causRT.texture;
foco.castShadow = true; foco.shadow.mapSize.set(1024, 1024); foco.shadow.bias = -.0002; foco.shadow.camera.near = 4; foco.shadow.camera.far = 25;
scene.add(foco, foco.target);
const azul = new THREE.PointLight(0x52b8e0, ILU ? 1.2 : 1.1, 6, 2); azul.position.set(0, 1.6, -1.6); scene.add(azul);  // relleno frío junto al cristal
const lampara = new THREE.PointLight(0xffa860, ILU ? 1.8 : 2.4, 7, 2); lampara.castShadow = !ILU; lampara.shadow.mapSize.set(512, 512); scene.add(lampara);
const arriba = new THREE.DirectionalLight(0xa8eaff, ILU ? 1.1 : 1.0); arriba.position.set(2, 20, -8); scene.add(arriba); // fuera, la luz baja desde la superficie
if (!ILU) { const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(new RoomEnvironment(renderer), .04).texture; scene.environmentIntensity = .25; }

// ---------- el cuarto (suelo a y = 0; la ventana en la pared z = -2) ----------
const ROOM = { x0: -2, x1: 2, z0: -2, z1: 2, alto: 2.7 }, VEN = { x0: -1.1, x1: 1.1, y0: .78, y1: 2.38 };
const cuarto = new THREE.Group(); scene.add(cuarto);
function caja(w, h, d, mat, x, y, z, padre = cuarto) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; padre.add(m); return m; }
function redonda(w, h, d, r, mat, x, y, z, padre = cuarto) { const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 4, r), mat); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; padre.add(m); return m; }
const mSuelo = pbr('wood_floor', [2, 2]), mPared = pbr('white_plaster_02', [2, 1.4], { color: ILU ? 0xcfc8f5 : 0xa9b0ba }), mTecho = material({ color: 0xe8e8ee });
caja(4.4, .1, 4.4, mSuelo, 0, -.05, 0);
caja(4.4, .1, 4.4, mTecho, 0, ROOM.alto + .05, 0);
caja(.1, ROOM.alto, 4.4, mPared, ROOM.x0 - .05, ROOM.alto / 2, 0); caja(.1, ROOM.alto, 4.4, mPared, ROOM.x1 + .05, ROOM.alto / 2, 0);
caja(4.4, ROOM.alto, .1, mPared, 0, ROOM.alto / 2, ROOM.z1 + .05);
// la pared de la ventana: cuatro trozos alrededor del hueco (gruesa, de fachada)
const G = .3, zc = ROOM.z0 - G / 2;
caja(VEN.x0 - ROOM.x0 + .2, ROOM.alto, G, mPared, (ROOM.x0 - .2 + VEN.x0) / 2, ROOM.alto / 2, zc);
caja(ROOM.x1 + .2 - VEN.x1, ROOM.alto, G, mPared, (VEN.x1 + ROOM.x1 + .2) / 2, ROOM.alto / 2, zc);
caja(VEN.x1 - VEN.x0, VEN.y0, G, mPared, 0, VEN.y0 / 2, zc);
caja(VEN.x1 - VEN.x0, ROOM.alto - VEN.y1, G, mPared, 0, (VEN.y1 + ROOM.alto) / 2, zc);
// marco blanco, alféizar y el cristal
const mMarco = material({ color: 0xf4f4f2, roughness: .4 });
for (const [w, h, x, y] of [[2.3, .07, 0, VEN.y0], [2.3, .07, 0, VEN.y1], [.07, 1.67, VEN.x0, (VEN.y0 + VEN.y1) / 2], [.07, 1.67, VEN.x1, (VEN.y0 + VEN.y1) / 2], [.05, 1.6, 0, (VEN.y0 + VEN.y1) / 2]])
  caja(w, h, .09, mMarco, x, y, ROOM.z0 - .12);
caja(2.4, .05, .34, mMarco, 0, VEN.y0 - .02, ROOM.z0 + .05);
const mCristal = ILU ? material({ color: 0xbff4ff, transparent: true, opacity: .12, sinContorno: true })
  : new THREE.MeshPhysicalMaterial({ color: 0xd8f6ff, transparent: true, opacity: .05, roughness: .05, metalness: 0, envMapIntensity: .3, fog: false });
const cristal = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.6), mCristal); cristal.position.set(0, (VEN.y0 + VEN.y1) / 2, ROOM.z0 - .13); cristal.renderOrder = 3; cuarto.add(cristal);
// gotas que se cuelan por la junta del cristal: brillos en el alféizar (solo detalles)
// la cama: el cabecero contra la pared izquierda, el edredón echado hacia atrás (se acaba de levantar)
const mMadera = material({ color: 0x7a5136, roughness: .6 }), mSabana = pbr('waffle_pique_cotton', [3, 3], { color: 0xf1f1f4 }), mEdredon = pbr('rough_linen', [3, 3], { color: ILU ? 0x3f6fe0 : 0x41598c });
caja(2.1, .32, 1.5, mMadera, -.95, .16, .5); caja(.08, 1.05, 1.56, mMadera, -1.97, .52, .5);
redonda(2, .24, 1.42, .06, mSabana, -.97, .44, .5);
redonda(.42, .14, .62, .06, mSabana, -1.68, .62, .2).rotation.z = .12; redonda(.42, .14, .62, .06, mSabana, -1.7, .63, .84).rotation.z = .08;
{ // edredón arrugado: caja redondeada con ondas
  const g = new RoundedBoxGeometry(1.25, .14, 1.55, 6, .07); g.translate(0, 0, 0); const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i); p.setY(i, p.getY(i) + Math.sin(x * 7 + z * 3) * .035 + Math.sin(z * 11) * .02 + Math.max(0, .3 - Math.abs(x + .2)) * .18); }
  g.computeVertexNormals(); const e = new THREE.Mesh(g, mEdredon); e.position.set(-.45, .6, .55); e.rotation.y = .1; e.castShadow = e.receiveShadow = true; cuarto.add(e); }
// alfombra
const alf = new THREE.Mesh(new THREE.CircleGeometry(.9, 48), material({ color: ILU ? 0xe9735a : 0x8c4a3c, roughness: 1 })); alf.rotation.x = -Math.PI / 2; alf.position.set(.3, .005, -.7); alf.receiveShadow = true; cuarto.add(alf);
// póster en la pared del fondo (una ola de Hokusai a su manera: rayas)
{ const c = document.createElement('canvas'); c.width = 256; c.height = 360; const g = c.getContext('2d');
  g.fillStyle = '#f3ead6'; g.fillRect(0, 0, 256, 360); g.fillStyle = '#1d3f7a'; g.beginPath(); g.moveTo(0, 360); g.bezierCurveTo(40, 140, 200, 60, 230, 170); g.bezierCurveTo(180, 120, 140, 200, 256, 260); g.lineTo(256, 360); g.fill();
  g.fillStyle = '#fff'; for (let k = 0; k < 9; k++) { g.beginPath(); g.arc(150 + k * 10, 150 + Math.sin(k) * 10, 7, 0, 7); g.fill(); }
  g.fillStyle = '#c33'; g.beginPath(); g.arc(70, 70, 26, 0, 7); g.fill();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const p = new THREE.Mesh(new THREE.PlaneGeometry(.62, .86), material({ map: t, roughness: .7 })); p.position.set(.9, 1.6, ROOM.z1 - .01); p.rotation.y = Math.PI; cuarto.add(p);
  const p2 = p.clone(); p2.position.set(ROOM.x0 + .02, 1.62, -.95); p2.rotation.y = Math.PI / 2; p2.scale.setScalar(.8); cuarto.add(p2); }

// ---------- fuera: la calle bajo el agua (el suelo de la calle está diez metros por debajo de la ventana) ----------
const CALLE = -8.6, SUP = 11.6;
const fuera = new THREE.Group(); scene.add(fuera);
// fachadas con ventanas (textura hecha a mano: hormigón y cristales, algunas con luz)
function texFachada(luz) { const c = document.createElement('canvas'); c.width = 288; c.height = 240; const g = c.getContext('2d');
  g.fillStyle = ILU ? '#b7a58f' : '#5e6266'; g.fillRect(0, 0, 288, 240);
  for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) { const on = luz && ((i * 7 + j * 3) % 7 === 0);
    g.fillStyle = on ? '#ffcf7a' : ILU ? '#1e3f55' : '#0e171d'; g.fillRect(i * 72 + 18, j * 60 + 16, 36, 27);
    g.fillStyle = ILU ? '#e8dccb' : '#7b7f83'; g.fillRect(i * 72 + 15, j * 60 + 43, 42, 3); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; }
function fachada(w, h, x, y, z, ry, luz = true) { const t = texFachada(luz); t.repeat.set(w / 18, h / 12);
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 1), material({ map: t, fuera: true, roughness: .9, emissive: luz ? 0x000000 : 0, grosor: .002 })); m.position.set(x, y, z); m.rotation.y = ry; m.receiveShadow = true; fuera.add(m); return m; }
// la de enfrente y las de los lados de la calle
fachada(60, 40, 0, CALLE + 20, -18.5, 0); fachada(40, 34, -24, CALLE + 17, -6, Math.PI / 2); fachada(40, 26, 26, CALLE + 13, -6, -Math.PI / 2);
// nuestra fachada: un gran muro alrededor de la ventana (desde fuera solo se ve esta ventana encendida)
{ const t = texFachada(false), mk = (w, h, x, y) => { const tt = t.clone(); tt.needsUpdate = true; tt.repeat.set(w / 18, h / 12); tt.offset.set(x / 18 - w / 36, (y - CALLE) / 12 - h / 24);
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, .5), material({ map: tt, fuera: true, grosor: .002 })); m.position.set(x, y, ROOM.z0 - G - .25); fuera.add(m); m.receiveShadow = true; };
  mk(30, 40, -16.1, CALLE + 20); mk(30, 40, 16.1, CALLE + 20); mk(2.2, VEN.y0 - CALLE, 0, (VEN.y0 + CALLE) / 2); mk(2.2, 40 + CALLE - VEN.y1 + 20, 0, VEN.y1 + (40 + CALLE - VEN.y1 + 20) / 2); }
// el asfalto y la acera
const suelo = new THREE.Mesh(new THREE.PlaneGeometry(80, 60), material({ color: ILU ? 0x3d5b66 : 0x2a3438, fuera: true, roughness: 1 })); suelo.rotation.x = -Math.PI / 2; suelo.position.set(0, CALLE, -10); suelo.receiveShadow = true; fuera.add(suelo);
// rayos de luz que bajan desde la superficie
const rayos = [];
{ const c = document.createElement('canvas'); c.width = 64; c.height = 256; const g = c.getContext('2d'); const gr = g.createLinearGradient(0, 0, 0, 256);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 256);
  const x = g.getImageData(0, 0, 64, 256); for (let i = 0; i < 64; i++) { const k = Math.pow(Math.sin(i / 63 * Math.PI), 2); for (let j = 0; j < 256; j++) x.data[(j * 64 + i) * 4 + 3] *= k; } g.putImageData(x, 0, 0);
  const t = new THREE.CanvasTexture(c);
  for (let k = 0; k < 9; k++) { const m = new THREE.Mesh(new THREE.PlaneGeometry(rr(1.2, 3.2), 26), new THREE.MeshBasicMaterial({ map: t, color: 0xbff3ff, transparent: true, opacity: ILU ? .2 : .13, blending: THREE.AdditiveBlending, depthWrite: false, fog: false, side: THREE.DoubleSide }));
    m.position.set(rr(-14, 14), SUP - 13, rr(-16, -5)); m.rotation.set(0, rr(-.4, .4), rr(-.25, .1)); m.userData.f = rr(0, 6); fuera.add(m); rayos.push(m); } }
// la farola, que sigue encendida bajo el agua
let farola = null; const luzFarola = new THREE.PointLight(0xffb35c, 30, 14, 2); luzFarola.position.set(-4.6, CALLE + 6.2, -9.5); fuera.add(luzFarola);
// el coche a la deriva (hecho con cajas redondeadas)
const coche = new THREE.Group(); fuera.add(coche);
{ const mc = material({ color: ILU ? 0xe63946 : 0x9b1d24, roughness: .35, metalness: .3, fuera: true }), mv = material({ color: 0x14212b, roughness: .1, metalness: .5, fuera: true }), mr = material({ color: 0x111111, roughness: .9, fuera: true });
  redonda(4.2, .8, 1.8, .25, mc, 0, .55, 0, coche); redonda(2.3, .75, 1.65, .3, mv, -.2, 1.25, 0, coche);
  for (const [x, z] of [[-1.35, .9], [1.35, .9], [-1.35, -.9], [1.35, -.9]]) { const r = new THREE.Mesh(new THREE.CylinderGeometry(.38, .38, .3, 20), mr); r.rotation.x = Math.PI / 2; r.position.set(x, .2, z); coche.add(r); }
  for (const z of [.91, -.91]) for (const x of [2.1]) { const f = new THREE.Mesh(new THREE.CircleGeometry(.13, 16), new THREE.MeshBasicMaterial({ color: 0xfff2c0, fog: false })); f.position.set(x, .62, z * .7); f.rotation.y = Math.PI / 2; coche.add(f); } }
// los peces: un banco que pasa por delante de la ventana
const NP = 70; let peces;
{ const cuerpo = new THREE.SphereGeometry(.5, 10, 6); cuerpo.scale(1, .42, .16); const cola = new THREE.ConeGeometry(.22, .32, 4); cola.rotateZ(Math.PI / 2); cola.scale(1, 1, .3); cola.translate(-.6, 0, 0);
  const g = mergeGeometries([cuerpo.toNonIndexed(), cola.toNonIndexed()]); g.computeVertexNormals(); g.scale(.32, .32, .32);
  peces = new THREE.InstancedMesh(g, material({ color: ILU ? 0xffd36b : 0xc7d2d8, roughness: .3, metalness: .6, fuera: true, grosor: .003 }), NP); peces.castShadow = true; fuera.add(peces);
  peces.userData.p = Array.from({ length: NP }, () => ({ a: rr(0, 6.28), r: rr(0, 1.8), y: rr(-1, 1.6), f: rr(0, 6), v: rr(.9, 1.2) })); }
// burbujas y partículas suspendidas
const NB = 260, burb = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({ color: 0xdffaff, size: ILU ? .09 : .06, transparent: true, opacity: .75, depthWrite: false, fog: true,
  map: (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'); g.strokeStyle = '#fff'; g.lineWidth = 6; g.beginPath(); g.arc(32, 32, 24, 0, 7); g.stroke(); g.fillStyle = 'rgba(255,255,255,.25)'; g.fill(); return new THREE.CanvasTexture(c); })() }));
const pb = new Float32Array(NB * 3), vb = []; for (let i = 0; i < NB; i++) { pb[i * 3] = rr(-8, 8); pb[i * 3 + 1] = rr(CALLE, SUP); pb[i * 3 + 2] = rr(-15, -2.8); vb.push(rr(.5, 1.6)); }
burb.geometry.setAttribute('position', new THREE.BufferAttribute(pb, 3)); fuera.add(burb);
const NM = 1800, mota = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({ color: 0x9fd9e8, size: .03, transparent: true, opacity: .5, depthWrite: false }));
{ const p = new Float32Array(NM * 3); for (let i = 0; i < NM; i++) { p[i * 3] = rr(-12, 12); p[i * 3 + 1] = rr(CALLE, SUP); p[i * 3 + 2] = rr(-17, -2.6); } mota.geometry.setAttribute('position', new THREE.BufferAttribute(p, 3)); fuera.add(mota); }
// la silla de plástico que choca contra el cristal
let silla = null;

// ---------- Nico (modelos/nico.glb, de Avaturn, con las animaciones de Mixamo) ----------
const NICO = { x: .05, z: -1.28 };
let nico = null, hueso = {}, reposo = new Map(), boca = null, envBoca = [];
// apunta el eje Y del hueso (hacia su hijo) a la dirección d del espacio del modelo (+x su izquierda, +y arriba, +z al frente), como en el boxeo
const _D = new THREE.Vector3(), _Y = new THREE.Vector3(), _qm = new THREE.Quaternion(), _Q = new THREE.Quaternion(), _W = new THREE.Quaternion();
function apuntar(b, d) { nico.getWorldQuaternion(_qm); _D.copy(d).normalize().applyQuaternion(_qm);
  b.getWorldQuaternion(_W); _Y.set(0, 1, 0).applyQuaternion(_W); _Q.setFromUnitVectors(_Y, _D); _W.premultiply(_Q);
  b.parent.getWorldQuaternion(_Q); b.quaternion.copy(_Q.invert().multiply(_W)); b.updateMatrixWorld(true); }
const mezclaV = (a, b, k) => a.clone().lerp(b, k);
function mandibula(fig, cabeza) { // igual que en fenomenos/boxeo.js: la barbilla baja y detrás va una boca oscura
  let cuerpo = null; fig.traverse(o => { if (o.isSkinnedMesh && /body/.test(o.name)) cuerpo = o; });
  if (!cuerpo) return { abrir() {} };
  const geo = cuerpo.geometry, p = geo.attributes.position, n = p.count;
  fig.updateMatrixWorld(true); const hy = fig.worldToLocal(cabeza.getWorldPosition(new THREE.Vector3())).y;
  let zN = -1, yN = 1.6;
  for (let i = 0; i < n; i++) { const y = p.getY(i), z = p.getZ(i); if (y > hy && Math.abs(p.getX(i)) < .008 && z > zN) { zN = z; yN = y; } }
  // la línea de los labios de Nico está 4,5 cm por debajo de la punta de la nariz (medido en la malla): solo baja el labio de abajo y la barbilla
  const yLab = yN - .045, piv = new THREE.Vector3(0, yLab + .02, zN - .1), d = new Float32Array(n * 3), v = new THREE.Vector3(), r = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), .26);
  const S = THREE.MathUtils.smoothstep;
  for (let i = 0; i < n; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    if (y > yLab + .002 || y < yLab - .13 || z < zN - .13) continue;
    const w = (1 - S(Math.abs(x), .03, .065)) * S(yLab + .002 - y, 0, .005) * (1 - S(yLab - y, .09, .13)) * S(z, zN - .13, zN - .08);
    if (w <= 0) continue;
    v.set(x, y, z).sub(piv).applyQuaternion(r).add(piv); d[i * 3 + 1] = (v.y - y) * w; d[i * 3 + 2] = (v.z - z) * w; }
  geo.morphAttributes.position = [new THREE.BufferAttribute(d, 3)]; geo.morphTargetsRelative = true;
  cuerpo.updateMorphTargets(); cuerpo.morphTargetInfluences[0] = 0;
  fig.updateMatrixWorld(true); const inv = cabeza.matrixWorld.clone().invert(), aCab = q => q.applyMatrix4(fig.matrixWorld).applyMatrix4(inv);
  const qCab = cabeza.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(fig.getWorldQuaternion(new THREE.Quaternion()));
  const hueco = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 12), new THREE.MeshBasicMaterial({ color: 0x1c0505 }));
  hueco.userData.outlineParameters = { visible: false };
  hueco.quaternion.copy(qCab); hueco.visible = false; cabeza.add(hueco);
  const base = aCab(new THREE.Vector3(0, yLab - .003, zN - .019)), abajo = new THREE.Vector3(0, -1, 0).applyQuaternion(qCab);
  return { abrir(k) { k = clamp(k, 0, 1); cuerpo.morphTargetInfluences[0] = k; hueco.visible = k > .04; hueco.position.copy(base).addScaledVector(abajo, k * .009); hueco.scale.set(.019 + k * .005, .001 + k * .0125, .004); } };
}
// gira un hueso en el espacio del mundo (eje del mundo y ángulo) y lo devuelve a su espacio local
const _q = new THREE.Quaternion(), _w = new THREE.Quaternion(), _p = new THREE.Quaternion();
function girar(b, eje, ang) { if (!b || !ang) return; b.getWorldQuaternion(_w); _q.setFromAxisAngle(eje, ang); _w.premultiply(_q); b.parent.getWorldQuaternion(_p); b.quaternion.copy(_p.invert().multiply(_w)); b.updateMatrixWorld(true); }
const EY = new THREE.Vector3(0, 1, 0), EX = new THREE.Vector3(1, 0, 0), EZ = new THREE.Vector3(0, 0, 1);

// ---------- posproceso ----------
const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: 4 }));
composer.setPixelRatio(renderer.getPixelRatio()); composer.setSize(W, H);
const contorno = ILU ? new OutlineEffect(renderer, { defaultThickness: .0045, defaultColor: TINTA, defaultAlpha: 1 }) : null;
class PaseContorno extends Pass { constructor() { super(); this.needsSwap = false; }
  render(r, wb, rb) { r.setRenderTarget(this.renderToScreen ? null : rb); r.setClearColor(0x000000, 1); r.clear(); contorno.render(scene, camera); } }
composer.addPass(ILU ? new PaseContorno() : new RenderPass(scene, camera));
const bokeh = ILU ? null : new BokehPass(scene, camera, { focus: 1.2, aperture: .0025, maxblur: .004 });
if (bokeh) composer.addPass(bokeh);
const bloom = new UnrealBloomPass(new THREE.Vector2(W / 2, H / 2), ILU ? .25 : .35, .5, ILU ? .95 : .92); composer.addPass(bloom);
composer.addPass(new OutputPass());
// gradación final: el cine lleva grano, viñeta y aberración cromática; el ilustrado, papel y colores más vivos
const grado = new ShaderPass({ uniforms: { tDiffuse: { value: null }, tiempo: { value: 0 }, ilu: { value: ILU ? 1 : 0 }, choque: { value: 0 }, res: { value: new THREE.Vector2(W, H) } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
  fragmentShader: `uniform sampler2D tDiffuse; uniform float tiempo, ilu, choque; uniform vec2 res; varying vec2 vUv;
    float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }
    float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f); return mix(mix(h(i),h(i+vec2(1,0)),f.x), mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x), f.y); }
    void main(){ vec2 d = vUv - .5; vec3 c;
      if (ilu < .5) { float ab = .0018 + choque * .006; c.r = texture2D(tDiffuse, vUv + d * ab).r; c.g = texture2D(tDiffuse, vUv).g; c.b = texture2D(tDiffuse, vUv - d * ab).b;
        float l = dot(c, vec3(.2126,.7152,.0722)); c = mix(vec3(l), c, 1.08);
        c += mix(vec3(-.015,.0,.02), vec3(.03,.012,-.02), smoothstep(.2,.8,l)); // sombras verdeazuladas, luces cálidas
        c += (h(vUv * res + fract(tiempo * 7.13) * 91.) - .5) * .06;           // grano
        c *= 1. - .55 * smoothstep(.2, .85, dot(d * vec2(1., 1.2), d * vec2(1., 1.2)) * 2.4); }
      else { c = texture2D(tDiffuse, vUv).rgb; float l = dot(c, vec3(.2126,.7152,.0722)); c = mix(vec3(l), c, 1.3);
        float papel = vn(vUv * res / 3.) * .5 + vn(vUv * res / 11.) * .5; c *= .94 + papel * .1;   // textura de papel
        c *= 1. - .3 * smoothstep(.3, .9, dot(d, d) * 2.4); }
      gl_FragColor = vec4(max(c, 0.), 1.); }` });
composer.addPass(grado);

// ---------- cámara: tres planos con movimientos exagerados ----------
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const PLANOS = [
  // 1. de espaldas, junto a la cama: se acerca despacio a la ventana
  { t0: 0, t1: 1.75, cam: (k, t) => ({ pos: V(lerp(.95, .7, easeInOut(k)), 1.58, lerp(.45, .05, easeInOut(k))), mira: V(-.08, 1.47, -2.6), fov: 44 - k * 4, foco: 1.9 }) },
  // 2. latigazo a su cara junto a la ventana (zoom de golpe que se pasa y vuelve)
  { t0: 1.75, t1: 3.75, cam: (k, t) => { const z = easeOutBack((t - 1.75) / .32, 2.6), d = lerp(2.1, 1.3, z) - (t - 2.1) * .06;
      const dir = V(.84, 0, -.5).normalize(); const h = cabeza(); return { pos: h.clone().addScaledVector(dir, d).add(V(0, -.02, 0)), mira: h.clone().add(V(0, -.1, 0)), fov: lerp(46, 30, z), foco: d }; } },
  // 3. desde fuera, bajo el agua: la ventana encendida en la fachada y la cámara que se aleja deprisa
  { t0: 3.75, t1: 5, cam: (k, t) => { const e = easeOut(k * 1.15); return { pos: V(lerp(2.2, 5.5, e), lerp(-.4, -2.6, e), lerp(-7.5, -15.5, e)), mira: V(0, lerp(1.5, 2.6, e), -2), fov: 42, foco: 9 }; } },
];
const _h = new THREE.Vector3(); function cabeza() { return nico ? hueso.Head.getWorldPosition(_h).clone().add(V(0, .08, 0)) : V(NICO.x, 1.68, NICO.z); }
// cuándo pasa cada cosa (s)
const EV = { choque: 1.45, giro: 1.5, grito: 2.05, salto: 1.52 };

// ---------- montaje de un instante ----------
const reloj = { t: 0 };
const lineas = document.getElementById('lineas'), flash = document.getElementById('flash'), negro = document.getElementById('negro'), grito = document.getElementById('grito'), hud = document.getElementById('hud');
grito.textContent = '¿BOMBOCLAT?';
hud.querySelector('.a').textContent = 'TSUNAMI Nº 2'; hud.querySelector('.b').textContent = '20 m'; hud.querySelector('.c').textContent = '10 m de agua sobre su ventana';
// líneas de velocidad (como en el boxeo): radios blancos hacia el centro
{ let s = ''; for (let k = 0; k < 46; k++) { const a = k / 46 * 6.283 + Math.sin(k * 7) * .05, r0 = 520 + (k * 37 % 5) * 40, r1 = 1300;
    s += `<polygon points="${540 + Math.cos(a) * r0},${900 + Math.sin(a) * r0} ${540 + Math.cos(a + .012) * r1},${900 + Math.sin(a + .012) * r1} ${540 + Math.cos(a - .012) * r1},${900 + Math.sin(a - .012) * r1}" fill="${ILU ? '#10131c' : '#fff'}"/>`; }
  lineas.innerHTML = s; }

function ir(t) {
  reloj.t = t;
  // Nico: respira (animación de reposo), gira la cabeza de golpe hacia la silla y da un respingo
  if (nico) {
    for (const [b, q] of reposo) b.quaternion.copy(q); nico.updateMatrixWorld(true);
    // reposo: brazos abajo y respiración; con el susto los brazos saltan hacia arriba (manos a la altura del pecho)
    const resp = Math.sin(t * 2.4) * .5 + .5, susto = t < EV.salto ? 0 : easeOutBack(clamp((t - EV.salto) / .25, 0, 1), 2.5) * (1 - smooth(2.3, 2.9, t) * .55);
    girar(hueso.Spine1, EX, -.02 - resp * .015); girar(hueso.Spine2, EX, -resp * .01);
    for (const [L, sg] of [['Left', 1], ['Right', -1]]) {
      apuntar(hueso[L + 'Arm'], mezclaV(V(.16 * sg, -1, -.02), V(.62 * sg, -.55, .38), susto));
      apuntar(hueso[L + 'ForeArm'], mezclaV(V(.06 * sg, -1, .16), V(.16 * sg, .1, .95), susto));
      apuntar(hueso[L + 'Hand'], mezclaV(V(.03 * sg, -1, .12), V(.06 * sg, .55, .8), susto)); }
    const giro = t < EV.giro ? 0 : easeOutBack((t - EV.giro) / .22, 3), mira = giro * -.75 + (t > 2.05 ? smooth(2.05, 2.5, t) * .12 : 0); // hacia su derecha (+x)
    const salto = t < EV.salto ? 0 : Math.sin(clamp((t - EV.salto) / .35, 0, 1) * Math.PI) * Math.exp(-(t - EV.salto) * 2);
    nico.position.y = salto * .045;
    girar(hueso.Spine2, EX, -salto * .12); girar(hueso.Neck, EY, mira * .35); girar(hueso.Head, EY, mira * .65);
    // inclina la cabeza al preguntar (exagerado)
    const duda = smooth(2.0, 2.35, t) * (1 - smooth(3.4, 3.7, t)); girar(hueso.Head, V(.5, 0, -.85).normalize(), duda * .28); girar(hueso.Head, EX, -duda * .1 - salto * .15);
    // los brazos: se le escapan un poco hacia arriba con el susto
    const kb = Math.floor((t - EV.grito) * 30); boca.abrir(kb >= 0 && kb < envBoca.length ? envBoca[kb] * 1.15 : 0);
  }
  const plano = PLANOS.find(p => t < p.t1) || PLANOS[PLANOS.length - 1], k = (t - plano.t0) / (plano.t1 - plano.t0), c = plano.cam(k, t);
  // temblor: cuando choca la silla y en el latigazo
  const sac = Math.exp(-Math.max(0, t - EV.choque) * 5) * (t > EV.choque ? 1 : 0) * .018 + (t > 1.75 && t < 2.2 ? Math.exp(-(t - 1.75) * 9) * .03 : 0);
  camera.position.copy(c.pos).add(V(ruido(t * 31) * sac, ruido(t * 27 + 4) * sac, 0)); camera.fov = c.fov; camera.lookAt(c.mira); camera.rotateZ(ruido(t * 1.3) * .004 + ruido(t * 23) * sac * .6);
  camera.updateProjectionMatrix();
  if (bokeh) { bokeh.uniforms.focus.value = c.foco; bokeh.uniforms.aperture.value = plano.t0 >= 3.75 ? .0006 : .0025; }
  // el agua de fuera, las cáusticas y lo que flota
  fondoU.tiempo.value = t; causU.tiempo.value = t; fondo.position.copy(camera.position);
  renderer.setRenderTarget(causRT); renderer.render(causScene, causCam); renderer.setRenderTarget(null);
  for (const m of rayos) m.material.opacity = (ILU ? .2 : .13) * (.65 + .35 * Math.sin(t * .9 + m.userData.f));
  coche.position.set(lerp(-4.5, 2.5, t / DUR), lerp(-.4, .3, t / DUR), -8.4); coche.rotation.set(.25 + t * .03, .5 + t * .06, .35 - t * .02);
  { const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s = V(1, 1, 1);
    peces.userData.p.forEach((f, i) => { const a = f.a + t * .5 * f.v, cx = lerp(6, -3, t / DUR), x = cx + Math.cos(a) * (1.5 + f.r), z = -6.2 + Math.sin(a) * (1 + f.r * .6), y = 1.4 + f.y + Math.sin(t * 2 + f.f) * .15;
      e.set(0, -a - Math.PI / 2 + Math.sin(t * 9 + f.f) * .2, 0); q.setFromEuler(e); m.compose(V(x, y, z), q, s); peces.setMatrixAt(i, m); }); peces.instanceMatrix.needsUpdate = true; }
  { const p = burb.geometry.attributes.position; for (let i = 0; i < NB; i++) { const y0 = CALLE + ((pb[i * 3 + 1] - CALLE + t * vb[i]) % (SUP - CALLE)); p.setY(i, y0); p.setX(i, pb[i * 3] + Math.sin(t * 3 + i) * .05); }
    p.needsUpdate = true; if (t === 0) p.array.set(pb); }
  if (silla) { // entra por la derecha, choca contra el cristal (rebota) y sigue a la deriva
    const kc = t < EV.choque ? 1 - Math.pow(1 - t / EV.choque, 2) : 1; let x = lerp(4.2, .55, kc), z = lerp(-4.8, -2.62, kc), y = lerp(1.0, 1.35, kc), rz = lerp(.9, .25, kc);
    if (t > EV.choque) { const d = t - EV.choque; z = -2.62 - (1 - Math.exp(-d * 3)) * .7; x = .55 - d * .25; y = 1.35 + d * .12; rz = .25 + d * .4; }
    silla.position.set(x, y, z); silla.rotation.set(.3 + t * .1, -.8 + t * .2, rz); }
  cristal.position.z = ROOM.z0 - .13 + (t > EV.choque ? Math.sin((t - EV.choque) * 60) * Math.exp(-(t - EV.choque) * 9) * .006 : 0);
  // capas de texto y efectos
  const kl = t > 1.75 && t < 2.15 ? 1 - (t - 1.75) / .4 : 0; lineas.style.opacity = (ILU ? .85 : .35) * kl; lineas.style.transform = `scale(${1 + (1 - kl) * .15}) rotate(${t * 20}deg)`;
  flash.style.opacity = t > 1.75 && t < 1.85 ? (ILU ? .9 : .45) * (1 - (t - 1.75) / .1) : 0;
  negro.style.opacity = t < .15 ? 1 - t / .15 : t > 4.75 ? (t - 4.75) / .25 : 0;
  { const d = t - 2.1, s = d < 0 ? 0 : easeOutBack(d / .25, 3.5); grito.style.opacity = d < 0 || t > 3.7 ? 0 : 1;
    grito.style.transform = `scale(${s * (1 + Math.sin(d * 18) * .02 * (ILU ? 1 : 0))}) rotate(${ILU ? -6 + Math.sin(d * 9) * 1.5 : 0}deg)`; }
  { const d = t - 3.9; hud.style.opacity = d < 0 ? 0 : clamp(d / .2, 0, 1); hud.style.transform = `translateX(${(1 - easeOutBack(clamp(d / .35, 0, 1))) * -60}px)`; }
  grado.uniforms.tiempo.value = t; grado.uniforms.choque.value = Math.exp(-Math.max(0, t - EV.choque) * 6) * (t > EV.choque ? 1 : 0);
  composer.render(1 / FPS);
}

// ---------- sonido (en la exportación lo mezcla tsunami/grabar.mjs con estos mismos tiempos) ----------
const SONIDOS = [
  { src: '../audio/sfx/dron.mp3', t: 0, gan: .5, filtro: 'lowpass=f=500' },
  { src: '../audio/sfx/ola.mp3', t: 0, gan: .35, filtro: 'lowpass=f=350' },
  { src: '../audio/sfx/impacto.mp3', t: EV.choque, gan: .9, filtro: 'lowpass=f=900' },
  { src: '../audio/sfx/whoosh.mp3', t: 1.62, gan: .55 },
  { src: '../audio/sfx/bomboclat/00.mp3', t: EV.grito, gan: 1 },
  { src: '../audio/sfx/riser.mp3', t: 3.7, gan: .25, filtro: 'lowpass=f=1500' },
];

// ---------- carga ----------
async function preparar() {
  const [nicoGl, idle, sil, mesita, reloj_, planta, far, cuadro] = await Promise.all([
    cargar('../modelos/nico.glb'), fetch('../modelos/anim/idle.json').then(r => r.json()),
    cargar('assets/plastic_monobloc_chair_01/plastic_monobloc_chair_01.gltf'), cargar('assets/ClassicNightstand_01/ClassicNightstand_01.gltf'),
    cargar('assets/alarm_clock_01/alarm_clock_01.gltf'), cargar('assets/potted_plant_02/potted_plant_02.gltf'), cargar('assets/street_lamp_01/street_lamp_01.gltf'),
    cargar('assets/hanging_picture_frame_01/hanging_picture_frame_01.gltf')]);
  envBoca = (await fetch('../audio/sfx/bomboclat/boca.json').then(r => r.json()))[0];
  // la mesita, con el despertador, la lámpara y la planta, junto al cabecero
  const m = adaptar(mesita.scene); m.position.set(-1.72, 0, -.58); m.rotation.y = Math.PI / 2; cuarto.add(m);
  const bb = new THREE.Box3().setFromObject(m), arriba_ = bb.max.y;
  const r = adaptar(reloj_.scene); r.position.set(-1.78, arriba_, -.42); r.rotation.y = Math.PI / 2 + .5; r.scale.setScalar(1); cuarto.add(r);
  const pl = adaptar(planta.scene); pl.position.set(1.55, 0, -1.6); pl.scale.setScalar(1.4); cuarto.add(pl);
  const cu = adaptar(cuadro.scene); cu.position.set(-.2, 1.45, ROOM.z1 - .02); cu.rotation.y = Math.PI; cu.scale.setScalar(1.1); cuarto.add(cu);
  { // lámpara de mesilla: pie y pantalla que brilla
    const pie = new THREE.Mesh(new THREE.CylinderGeometry(.03, .07, .32, 16), material({ color: 0x2b2b2b, roughness: .4, metalness: .5 })); pie.position.set(-1.7, arriba_ + .16, -.75); cuarto.add(pie);
    const pan = new THREE.Mesh(new THREE.CylinderGeometry(.11, .16, .2, 24, 1, true), material({ color: 0xffd9a0, emissive: 0xffa040, emissiveIntensity: ILU ? .9 : 1.4, side: THREE.DoubleSide })); pan.position.set(-1.7, arriba_ + .38, -.75); cuarto.add(pan);
    lampara.position.set(-1.7, arriba_ + .36, -.75); }
  silla = adaptar(sil.scene, true); silla.scale.setScalar(1.05); fuera.add(silla);
  farola = adaptar(far.scene, true); farola.position.set(-4.6, CALLE, -9.8); farola.scale.setScalar(1.35); fuera.add(farola);
  farola.traverse(o => { if (o.isMesh && /bulb|glass/i.test(o.material.name || o.name)) { o.material.emissive = new THREE.Color(0xffb35c); o.material.emissiveIntensity = 4; } });
  const fb = new THREE.Box3().setFromObject(farola); luzFarola.position.set((fb.min.x + fb.max.x) / 2, fb.max.y - .5, (fb.min.z + fb.max.z) / 2);
  // Nico
  nico = nicoGl.scene; nico.traverse(o => { if (o.isBone) hueso[o.name] = o; if (o.isMesh) { o.castShadow = o.receiveShadow = true; o.frustumCulled = false; } });
  const bandasPiel = (() => { const d = new Uint8Array([150, 205, 255]); const t = new THREE.DataTexture(d, 3, 1, THREE.RedFormat); t.needsUpdate = true; return t; })();
  if (ILU) nico.traverse(o => { if (o.isMesh) { const a = o.material; o.material = material({ map: a.map, color: a.color }); o.material.gradientMap = bandasPiel; o.material.userData.outlineParameters = { thickness: .0035, color: TINTA, alpha: 1 }; } });
  const gNico = new THREE.Group(); gNico.position.set(NICO.x, 0, NICO.z); gNico.rotation.y = Math.PI; gNico.add(nico); scene.add(gNico);
  nico.traverse(o => { if (o.isBone) reposo.set(o, o.quaternion.clone()); }); nico.updateMatrixWorld(true);
  boca = mandibula(nico, hueso.Head);
  document.getElementById('carga').remove();
  // un fotograma de calentamiento para que compilen los shaders
  ir(0);
}
await preparar();
window.__peli = { dur: DUR, fps: FPS, ir, sonidos: SONIDOS, listo: true };
if (!GRABAR) { // vista previa: en bucle a tiempo real (clic: pausa)
  let t0 = performance.now(), parado = false, tp = 0; addEventListener('click', () => { parado = !parado; if (!parado) t0 = performance.now() - tp * 1000; });
  const bucle = () => { if (!parado) { tp = ((performance.now() - t0) / 1000) % DUR; ir(tp); } requestAnimationFrame(bucle); }; bucle();
}
