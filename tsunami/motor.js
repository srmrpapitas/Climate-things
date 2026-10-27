// Motor del tsunami (estilo 3D ilustrado): render, materiales de bandas con contorno de tinta, posproceso, Nico con su
// boca, utilidades de animación y las capas de texto. Las escenas (tsunami/escenas/*.js) lo importan y la película
// (tsunami/peli.js) decide qué escena se ve en cada instante. Todo es determinista: el fotograma t solo depende de t.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { Pass } from 'three/addons/postprocessing/Pass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';
export { THREE, RoundedBoxGeometry, mergeGeometries };

export const params = new URLSearchParams(location.search);
export const GRABAR = params.get('grabar') === '1';
export const FPS = 30;

// ---------- utilidades ----------
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), lerp = (a, b, t) => a + (b - a) * t;
export const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
export const easeOutBack = (t, s = 2.2) => { t = clamp(t, 0, 1) - 1; return 1 + t * t * ((s + 1) * t + s); };   // se pasa y vuelve: el latigazo
export const easeInOut = t => (t = clamp(t, 0, 1), t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOut = t => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
export const easeIn = t => Math.pow(clamp(t, 0, 1), 3);
export function azar(s = 7) { let seed = s; const R = () => (seed = (seed * 16807) % 2147483647) / 2147483647; return { R, rr: (a, b) => a + R() * (b - a) }; }
export const ruido = t => Math.sin(t * 1.7) * .5 + Math.sin(t * 3.1 + 1.3) * .3 + Math.sin(t * 7.3 + .4) * .2;
export const V = (x, y, z) => new THREE.Vector3(x, y, z);
export const hash = (a, b = 0) => { const n = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return n - Math.floor(n); };

// ---------- render ----------
export const stage = document.getElementById('stage');
export const W = GRABAR ? 1080 : Math.round(Math.min(innerWidth, innerHeight * 9 / 16)), H = Math.round(W * 16 / 9);
stage.style.width = W + 'px'; stage.style.height = H + 'px'; stage.style.fontSize = (W / 15) + 'px';
export const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: GRABAR });
renderer.setPixelRatio(GRABAR ? 1 : Math.min(devicePixelRatio, 2)); renderer.setSize(W, H);
renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
stage.prepend(renderer.domElement);
export const camera = new THREE.PerspectiveCamera(40, 9 / 16, .03, 4000);

// ---------- materiales: sombreado por bandas (3 tonos) con contorno de tinta ----------
const gradiente = v => { const t = new THREE.DataTexture(new Uint8Array(v), v.length, 1, THREE.RedFormat); t.needsUpdate = true; return t; };
export const bandas = gradiente([70, 150, 255]), bandasPiel = gradiente([150, 205, 255]);
export const TINTA = [.04, .05, .09];
export function material(o = {}) { // o: { color, map, emissive, transparent, opacity, fuera (niebla), sinContorno, grosor, side, vertexColors }
  const m = new THREE.MeshToonMaterial({ color: o.color ?? 0xffffff, map: o.map || null, gradientMap: o.gradiente ?? bandas, emissive: o.emissive ?? 0, emissiveIntensity: o.emissiveIntensity ?? 1,
    transparent: !!o.transparent, opacity: o.opacity ?? 1, fog: o.fuera ?? true, side: o.side ?? THREE.FrontSide, vertexColors: !!o.vertexColors });
  m.userData.outlineParameters = o.sinContorno ? { visible: false } : { thickness: o.grosor ?? .0045, color: TINTA, alpha: 1 };
  return m;
}
// los modelos de Poly Haven: cada material pasa a su versión de bandas
export function adaptar(obj, fuera = true) {
  obj.traverse(m => { if (!m.isMesh) return; m.castShadow = m.receiveShadow = true;
    const conv = a => { const n = material({ color: a.color, map: a.map, transparent: a.transparent, opacity: a.opacity, emissive: a.emissive, fuera, side: a.side });
      if (a.map) n.map.colorSpace = THREE.SRGBColorSpace; return n; };
    m.material = Array.isArray(m.material) ? m.material.map(conv) : conv(m.material); });
  return obj;
}
const texLoader = new THREE.TextureLoader();
export const tex = (ruta, rep = [1, 1]) => { const t = texLoader.load(ruta); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...rep); t.anisotropy = 8; t.colorSpace = THREE.SRGBColorSpace; return t; };
export const pbr = (id, rep, extra = {}) => material({ map: tex(`assets/${id}/diff.jpg`, rep), ...extra });
const gltf = new GLTFLoader();
export const cargar = url => new Promise((ok, mal) => gltf.load(url, ok, undefined, mal));
export function caja(padre, w, h, d, mat, x, y, z) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; padre.add(m); return m; }
export function redonda(padre, w, h, d, r, mat, x, y, z) { const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 4, r), mat); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; padre.add(m); return m; }
export function lienzo(w, h, pintar) { const c = document.createElement('canvas'); c.width = w; c.height = h; pintar(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }
// fachada con ventanas (hormigón y cristales, algunas con luz)
export function texFachada(o = {}) { const base = o.base ?? '#b7a58f', cri = o.cristal ?? '#1e3f55', luz = o.luz ?? true;
  const t = lienzo(288, 240, g => { g.fillStyle = base; g.fillRect(0, 0, 288, 240);
    for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) { const on = luz && ((i * 7 + j * 3 + (o.semilla ?? 0)) % 7 === 0);
      g.fillStyle = on ? '#ffcf7a' : cri; g.fillRect(i * 72 + 18, j * 60 + 16, 36, 27); g.fillStyle = o.cornisa ?? '#e8dccb'; g.fillRect(i * 72 + 15, j * 60 + 43, 42, 3); } });
  t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; }

// ---------- escenas: cada una tiene su THREE.Scene; la película elige cuál se pinta ----------
export const actual = { scene: new THREE.Scene() };

// ---------- posproceso ----------
const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: 4 }));
composer.setPixelRatio(1); composer.setSize(W, H);
const contorno = new OutlineEffect(renderer, { defaultThickness: .0045, defaultColor: TINTA, defaultAlpha: 1 });
class PaseContorno extends Pass { constructor() { super(); this.needsSwap = false; }
  render(r, wb, rb) { r.setRenderTarget(this.renderToScreen ? null : rb); r.setClearColor(0x000000, 1); r.clear(); contorno.render(actual.scene, camera); } }
composer.addPass(new PaseContorno());
export const bloom = new UnrealBloomPass(new THREE.Vector2(W / 2, H / 2), .25, .5, .95); composer.addPass(bloom);
composer.addPass(new OutputPass());
// gradación final: papel, colores vivos, viñeta; y efectos de montaje (rebobinado de cinta, blanco, tinte bajo el agua)
export const grado = new ShaderPass({ uniforms: { tDiffuse: { value: null }, tiempo: { value: 0 }, res: { value: new THREE.Vector2(W, H) }, rebobina: { value: 0 }, sat: { value: 1.3 }, tinte: { value: new THREE.Vector4(1, 1, 1, 0) } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
  fragmentShader: `uniform sampler2D tDiffuse; uniform float tiempo, rebobina, sat; uniform vec2 res; uniform vec4 tinte; varying vec2 vUv;
    float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }
    float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f); return mix(mix(h(i),h(i+vec2(1,0)),f.x), mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x), f.y); }
    void main(){ vec2 uv = vUv, d = uv - .5;
      // rebobinado: la imagen tiembla en bandas horizontales, aberración y rayas de cinta
      float bandaR = step(.5, h(vec2(floor(uv.y * 40.), floor(tiempo * 24.)))) * rebobina;
      uv.x += (h(vec2(floor(uv.y * 90.), floor(tiempo * 30.))) - .5) * .03 * rebobina + bandaR * .02 * sin(tiempo * 80.);
      float ab = .004 * rebobina;
      vec3 c = vec3(texture2D(tDiffuse, uv + vec2(ab, 0.)).r, texture2D(tDiffuse, uv).g, texture2D(tDiffuse, uv - vec2(ab, 0.)).b);
      float l = dot(c, vec3(.2126,.7152,.0722)); c = mix(vec3(l), c, sat);
      c = mix(c, c * tinte.rgb, tinte.a);
      float papel = vn(vUv * res / 3.) * .5 + vn(vUv * res / 11.) * .5; c *= .94 + papel * .1;   // textura de papel
      c *= 1. - .3 * smoothstep(.3, .9, dot(d, d) * 2.4);
      // rayas de la cinta al rebobinar
      float raya = smoothstep(.985, 1., sin((vUv.y + tiempo * 2.3) * 9.) ) + smoothstep(.992, 1., h(vec2(floor(vUv.y * 300.), floor(tiempo * 30.))));
      c = mix(c, vec3(1.), raya * rebobina * .8);
      c = mix(c, vec3(dot(c, vec3(.3,.59,.11))), rebobina * .35);
      gl_FragColor = vec4(max(c, 0.), 1.); }` });
composer.addPass(grado);
export function pintar(t) { grado.uniforms.tiempo.value = t; composer.render(1 / FPS); }

// ---------- capas HTML: textos de cómic, HUD de cada ola, subtítulos, flash, negro ----------
export const capa = id => document.getElementById(id);
export function hud(nOla, metros, linea, d) { // d: segundos desde que aparece (negativo o null: oculto)
  const h = capa('hud'); if (d == null || d < 0) { h.style.opacity = 0; return; }
  h.querySelector('.a').textContent = `TSUNAMI Nº ${nOla}`; h.querySelector('.b').textContent = `${metros} m`; h.querySelector('.c').textContent = linea;
  h.style.opacity = clamp(d / .2, 0, 1); h.style.transform = `translateX(${(1 - easeOutBack(clamp(d / .35, 0, 1))) * -60}px)`;
}
export function comic(texto, d, dur, o = {}) { // grito de cómic que entra de golpe y tiembla
  const g = capa('grito'); if (d == null || d < 0 || d > dur) { g.style.opacity = 0; return; }
  g.textContent = texto; g.style.top = (o.top ?? 15) + '%'; g.style.fontSize = (o.tam ?? 1.6) + 'em';
  const s = easeOutBack(d / .25, 3.5) * (1 + Math.sin(d * 18) * .02 * (o.temblor ?? 1)), fuera = smooth(dur - .15, dur, d);
  g.style.opacity = 1 - fuera; g.style.transform = `scale(${s}) rotate(${(o.giro ?? -4) + Math.sin(d * 9) * 1.2}deg)`;
}
export function subtitulo(texto, d, dur) { const s = capa('sub'); if (!texto || d < 0 || d > dur) { s.style.opacity = 0; return; }
  if (s.textContent !== texto) s.textContent = texto; s.style.opacity = Math.min(clamp(d / .12, 0, 1), clamp((dur - d) / .15, 0, 1)); }

// ---------- líneas de velocidad (SVG): radios hacia el centro ----------
{ let s = ''; for (let k = 0; k < 46; k++) { const a = k / 46 * 6.283 + Math.sin(k * 7) * .05, r0 = 520 + (k * 37 % 5) * 40, r1 = 1300;
    s += `<polygon points="${540 + Math.cos(a) * r0},${900 + Math.sin(a) * r0} ${540 + Math.cos(a + .012) * r1},${900 + Math.sin(a + .012) * r1} ${540 + Math.cos(a - .012) * r1},${900 + Math.sin(a - .012) * r1}" fill="#10131c"/>`; }
  capa('lineas').innerHTML = s; }
export function lineas(k, t) { const l = capa('lineas'); l.style.opacity = .85 * k; l.style.transform = `scale(${1 + (1 - k) * .15}) rotate(${t * 20}deg)`; }

// ---------- Nico (modelos/nico.glb, de Avaturn, esqueleto de Mixamo) ----------
export const nico = { g: new THREE.Group(), modelo: null, hueso: {}, reposo: new Map(), boca: null, envBoca: [] };
const _D = new THREE.Vector3(), _Y = new THREE.Vector3(), _qm = new THREE.Quaternion(), _Q = new THREE.Quaternion(), _W = new THREE.Quaternion();
// apunta el eje Y del hueso (hacia su hijo) a la dirección d del espacio del modelo (+x su izquierda, +y arriba, +z al frente)
export function apuntar(b, d) { nico.modelo.getWorldQuaternion(_qm); _D.copy(d).normalize().applyQuaternion(_qm);
  b.getWorldQuaternion(_W); _Y.set(0, 1, 0).applyQuaternion(_W); _Q.setFromUnitVectors(_Y, _D); _W.premultiply(_Q);
  b.parent.getWorldQuaternion(_Q); b.quaternion.copy(_Q.invert().multiply(_W)); b.updateMatrixWorld(true); }
// gira un hueso alrededor de un eje del espacio del modelo
const _q = new THREE.Quaternion(), _w = new THREE.Quaternion(), _p = new THREE.Quaternion(), _e = new THREE.Vector3();
export function girar(b, eje, ang) { if (!b || !ang) return; nico.modelo.getWorldQuaternion(_qm); _e.copy(eje).applyQuaternion(_qm);
  b.getWorldQuaternion(_w); _q.setFromAxisAngle(_e, ang); _w.premultiply(_q); b.parent.getWorldQuaternion(_p); b.quaternion.copy(_p.invert().multiply(_w)); b.updateMatrixWorld(true); }
export const EY = V(0, 1, 0), EX = V(1, 0, 0), EZ = V(0, 0, 1);
export const mezclaV = (a, b, k) => a.clone().lerp(b, k);
export function nicoReposo() { for (const [b, q] of nico.reposo) b.quaternion.copy(q); nico.modelo.position.set(0, 0, 0); nico.g.updateMatrixWorld(true); }
// brazos: k = 0 abajo, 1 susto (manos al pecho)
export function nicoBrazos(susto = 0) { const hb = nico.hueso;
  for (const [L, sg] of [['Left', 1], ['Right', -1]]) {
    apuntar(hb[L + 'Arm'], mezclaV(V(.16 * sg, -1, -.02), V(.62 * sg, -.55, .38), susto));
    apuntar(hb[L + 'ForeArm'], mezclaV(V(.06 * sg, -1, .16), V(.16 * sg, .1, .95), susto));
    apuntar(hb[L + 'Hand'], mezclaV(V(.03 * sg, -1, .12), V(.06 * sg, .55, .8), susto)); } }
// carrera a mano (el plano es corto y la cámara se mueve mucho): fase en radianes
export function nicoCorrer(fase, k = 1) { const hb = nico.hueso, s = Math.sin(fase), c = Math.cos(fase);
  for (const [L, sg, f] of [['Left', 1, 1], ['Right', -1, -1]]) {
    const a = s * f; // + adelante
    apuntar(hb[L + 'UpLeg'], V(.04 * sg, -1, a * .9 * k).normalize());
    const dobla = Math.max(0, -a) * 1.3 + .35;
    apuntar(hb[L + 'Leg'], V(.02 * sg, -1, a * .9 * k - dobla * k).normalize());
    apuntar(hb[L + 'Foot'], V(0, -.35, 1));
    apuntar(hb[L + 'Arm'], V(.3 * sg, -1, -a * .8 * k).normalize());
    apuntar(hb[L + 'ForeArm'], V(.1 * sg, -.3, 1 - a * .3).normalize());
  }
  girar(hb.Spine, EX, .22 * k); girar(hb.Spine1, EY, s * .12 * k);
  nico.modelo.position.y = Math.abs(c) * .06 * k - .03 * k;
}
// tumbado o sentado en la cama: dobla la cadera (las piernas quedan bajo el edredón)
export function nicoSentado(k) { const hb = nico.hueso; for (const L of ['Left', 'Right']) { apuntar(hb[L + 'UpLeg'], mezclaV(V(0, -1, 0), V(0, -.05, 1), k)); apuntar(hb[L + 'Leg'], mezclaV(V(0, -1, 0), V(0, -.1, 1), k)); } }
export function nicoCabeza() { return nico.hueso.Head.getWorldPosition(new THREE.Vector3()).add(V(0, .08, 0).applyQuaternion(nico.hueso.Head.getWorldQuaternion(new THREE.Quaternion()))); }
export function nicoHablar(envIdx, d, gan = 1.15) { const env = nico.envBoca[envIdx] || [], kb = Math.floor(d * 30); nico.boca.abrir(d >= 0 && kb < env.length ? env[kb] * gan : 0); }

// boca: la barbilla baja (morph) y detrás de los labios va un hueco oscuro.
// AJUSTE_BOCA: el usuario pidió subirlo un poco y moverlo medio centímetro a la derecha de Nico (izquierda en pantalla).
export const AJUSTE_BOCA = { arriba: .004, derecha: .005, ancho: .019, alto: .0135, baja: .005, hondo: .004, fondo: .017 };
function mandibula(fig, cabeza) {
  let cuerpo = null; fig.traverse(o => { if (o.isSkinnedMesh && /body/.test(o.name)) cuerpo = o; });
  if (!cuerpo) return { abrir() {} };
  const geo = cuerpo.geometry, p = geo.attributes.position, n = p.count;
  fig.updateMatrixWorld(true); const hy = fig.worldToLocal(cabeza.getWorldPosition(new THREE.Vector3())).y;
  let zN = -1, yN = 1.6;
  for (let i = 0; i < n; i++) { const y = p.getY(i), z = p.getZ(i); if (y > hy && Math.abs(p.getX(i)) < .008 && z > zN) { zN = z; yN = y; } }
  // la línea de los labios está 4,5 cm por debajo de la punta de la nariz (medido en la malla): solo baja el labio de abajo y la barbilla
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
  // el hueco es un óvalo oscuro justo delante de la cara interior del labio de abajo (que es rosa): la tapa entera
  const A = AJUSTE_BOCA;
  const hueco = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), new THREE.MeshBasicMaterial({ color: 0x140303, fog: false }));
  hueco.material.userData.outlineParameters = { visible: false };
  hueco.quaternion.copy(qCab); hueco.visible = false; cabeza.add(hueco);
  // -x del modelo = la derecha de Nico
  const base = aCab(new THREE.Vector3(-A.derecha, yLab + A.arriba - .004, zN - A.fondo)), abajo = new THREE.Vector3(0, -1, 0).applyQuaternion(qCab);
  return { hueco, abrir(k) { k = clamp(k, 0, 1); cuerpo.morphTargetInfluences[0] = k; hueco.visible = k > .04;
    hueco.position.copy(base).addScaledVector(abajo, k * A.baja); hueco.scale.set(A.ancho * (.8 + k * .2), .002 + k * A.alto, A.hondo); } };
}
export async function cargarNico() {
  const [gl, boca] = await Promise.all([cargar('../modelos/nico.glb'), fetch('../audio/sfx/bomboclat/boca.json').then(r => r.json())]);
  nico.envBoca = boca; nico.modelo = gl.scene;
  nico.modelo.traverse(o => { if (o.isBone) nico.hueso[o.name.replace('mixamorig', '')] = o; if (o.isMesh) { o.castShadow = o.receiveShadow = true; o.frustumCulled = false;
    const a = o.material; o.material = material({ map: a.map, color: a.color, gradiente: bandasPiel, grosor: .0035 }); } });
  nico.g.add(nico.modelo);
  nico.modelo.traverse(o => { if (o.isBone) nico.reposo.set(o, o.quaternion.clone()); }); nico.g.updateMatrixWorld(true);
  nico.boca = mandibula(nico.modelo, nico.hueso.Head);
}

// ---------- cámara ----------
export function ponerCamara(c, t, sac = 0) { // c: { pos, mira, fov, giro }
  camera.position.copy(c.pos).add(V(ruido(t * 31) * sac, ruido(t * 27 + 4) * sac, 0)); camera.fov = c.fov ?? 40; camera.lookAt(c.mira);
  camera.rotateZ((c.giro ?? 0) + ruido(t * 1.3) * .004 + ruido(t * 23) * sac * .6); camera.near = c.near ?? .03; camera.far = c.far ?? 4000; camera.updateProjectionMatrix(); }
