// Personajes con animación de verdad: los GLB de modelos/personajes-extras/glb (esqueleto Mixamo) con los clips de
// la Universal Animation Library de Quaternius (modelos/anim-ual, esqueleto tipo Unreal), adaptados hueso a hueso.
//   import { cargaPersonaje, clipsUAL } from '../herramientas/personajes.js';
//   const p = await cargaPersonaje('Character_Male_33');  → { obj, mixer, accion(nombre, {bucle, fundido}) }
//   p.accion('Jog_Fwd_Loop'); p.mixer.setTime(t)  (setTime para grabar fotograma a fotograma)
// Clips gratis (43): Idle_Loop, Jog_Fwd_Loop, Sprint_Loop, Walk_Loop, Jump_Start/Loop/Land, Dance_Loop, Interact,
// Idle_Talking_Loop, Punch_Jab, Roll, Sitting_*, Death01… (la lista entera: Object.keys(await clipsUAL())).
import * as THREE from 'three';
import { GLTFLoader } from '../../vendor/GLTFLoader.js';

const RAIZ = new URL('../../', import.meta.url).href;
// hueso de Mixamo (como lo deja GLTFLoader, sin los dos puntos) → hueso de la UAL
const LADOS = { Left: 'l', Right: 'r' };
const MAPA = { mixamorigHips: 'pelvis', mixamorigSpine: 'spine_01', mixamorigSpine1: 'spine_02', mixamorigSpine2: 'spine_03',
  mixamorigNeck: 'neck_01', mixamorigHead: 'Head' };
for (const [L, s] of Object.entries(LADOS)) Object.assign(MAPA, {
  [`mixamorig${L}Shoulder`]: `clavicle_${s}`, [`mixamorig${L}Arm`]: `upperarm_${s}`, [`mixamorig${L}ForeArm`]: `lowerarm_${s}`,
  [`mixamorig${L}Hand`]: `hand_${s}`, [`mixamorig${L}UpLeg`]: `thigh_${s}`, [`mixamorig${L}Leg`]: `calf_${s}`,
  [`mixamorig${L}Foot`]: `foot_${s}`, [`mixamorig${L}ToeBase`]: `ball_${s}` });

const carga = url => new GLTFLoader().loadAsync(RAIZ + url);
let ual = null;
export async function clipsUAL() {
  if (!ual) ual = carga('modelos/anim-ual/UAL1_Standard.glb').then(g => {
    const huesos = {}; g.scene.traverse(o => { if (o.isBone) huesos[o.name] = o; });
    return { escena: g.scene, huesos, mixer: new THREE.AnimationMixer(g.scene), clips: Object.fromEntries(g.animations.map(c => [c.name, c])) };
  });
  return ual;
}

// Adapta un clip de la UAL a otro esqueleto copiando la rotación de cada hueso EN EL MUNDO respecto a la pose en T de
// los dos (A_TPose en la UAL, la pose de carga en el personaje), y la cadera escalada por la altura de cada uno.
// SkeletonUtils.retargetClip no sirve aquí: el personaje viene escalado ×0,01 (Mixamo en cm) y se hunde en el suelo.
const _q = new THREE.Quaternion(), _q2 = new THREE.Quaternion(), _v = new THREE.Vector3();
const mundoQ = (o, q) => o.getWorldQuaternion(q);
function adapta(fuente, destino, clip, fps = 30) {
  const pares = Object.entries(MAPA).map(([d, f]) => [destino[d], fuente.huesos[f]]).filter(([d, f]) => d && f);
  const ordenados = pares.sort((a, b) => profundidad(a[0]) - profundidad(b[0]));
  const ver = (c, t) => { fuente.mixer.stopAllAction(); fuente.mixer.clipAction(c).play(); fuente.mixer.setTime(t); fuente.escena.updateMatrixWorld(true); };
  // poses en T de los dos
  ver(fuente.clips.A_TPose, 0);
  const restoF = new Map(pares.map(([, f]) => [f, mundoQ(f, new THREE.Quaternion())]));
  const caderaF = fuente.huesos.pelvis.getWorldPosition(new THREE.Vector3());
  const raizD = destino.mixamorigHips.parent; raizD.updateMatrixWorld(true);
  const restoD = new Map(pares.map(([d]) => [d, { mundo: mundoQ(d, new THREE.Quaternion()), local: d.quaternion.clone() }]));
  const caderaD = destino.mixamorigHips.getWorldPosition(new THREE.Vector3()), caderaLocal = destino.mixamorigHips.position.clone();
  const escala = caderaD.y / caderaF.y;
  const n = Math.max(2, Math.round(clip.duration * fps) + 1), tiempos = [], rot = new Map(pares.map(([d]) => [d, []])), pos = [];
  for (let i = 0; i < n; i++) {
    const t = Math.min(clip.duration, i / fps); tiempos.push(t); ver(clip, t);
    for (const [d, f] of ordenados) {
      // rotación del mundo que se ha añadido a la pose en T, aplicada a la pose en T del destino
      const q = mundoQ(f, _q).multiply(_q2.copy(restoF.get(f)).invert()).multiply(restoD.get(d).mundo);
      d.parent.updateMatrixWorld(true); d.quaternion.copy(mundoQ(d.parent, _q2).invert().multiply(q)); d.updateMatrixWorld(true);
      rot.get(d).push(...d.quaternion.toArray());
    }
    // desplazamiento de la cadera respecto a la pose en T, pasado a las unidades del padre de la cadera del destino
    const delta = fuente.huesos.pelvis.getWorldPosition(_v).sub(caderaF).multiplyScalar(escala);
    const s = raizD.getWorldScale(new THREE.Vector3());
    pos.push(caderaLocal.x + delta.x / s.x, caderaLocal.y + delta.y / s.y, caderaLocal.z + delta.z / s.z);
  }
  for (const [d] of pares) d.quaternion.copy(restoD.get(d).local);
  destino.mixamorigHips.position.copy(caderaLocal);
  return new THREE.AnimationClip(clip.name, clip.duration, [
    ...pares.map(([d]) => new THREE.QuaternionKeyframeTrack(`${d.name}.quaternion`, tiempos, rot.get(d))),
    new THREE.VectorKeyframeTrack('mixamorigHips.position', tiempos, pos)]);
}
const profundidad = o => { let k = 0; while (o.parent) { k++; o = o.parent; } return k; };

const cache = new Map();
export async function cargaPersonaje(nombre) {
  // 'Character_Male_33' → de personajes-extras; con barra, ruta completa ('modelos/scd/trump')
  const g = await carga(nombre.includes('/') ? `${nombre}.glb` : `modelos/personajes-extras/glb/${nombre}.glb`);
  const obj = g.scene;
  let piel = null; obj.traverse(o => { if (o.isSkinnedMesh) { piel ??= o; o.castShadow = true; o.frustumCulled = false; } });
  const fuente = await clipsUAL(), mixer = new THREE.AnimationMixer(obj), huesos = {};
  obj.traverse(o => { if (o.isBone) huesos[o.name] = o; });
  let actual = null;
  // cada personaje tiene sus proporciones: el clip se adapta una vez por personaje y clip
  const clip = n => {
    const k = nombre + '|' + n;
    if (!cache.has(k)) cache.set(k, adapta(fuente, huesos, fuente.clips[n]));
    return cache.get(k);
  };
  const accion = (n, { bucle = true, fundido = .25 } = {}) => {
    const a = mixer.clipAction(typeof n === 'string' ? clip(n) : n); a.reset(); a.setLoop(bucle ? THREE.LoopRepeat : THREE.LoopOnce, Infinity); a.clampWhenFinished = !bucle;
    if (actual && actual !== a) a.crossFadeFrom(actual, fundido, false); a.play(); actual = a; return a;
  };
  return { obj, piel, mixer, accion };
}

// Clips de Mixamo bajados en FBX (modelos/scd/anim/*.fbx, «Without Skin»): valen tal cual para estos personajes,
// porque FBXLoader deja los huesos con el mismo nombre que GLTFLoader (mixamorigHips…). Uso: p.accion(await clipMixamo('Mma_Kick'))
const fbx = {};
export async function clipMixamo(nombre, dir = 'modelos/scd/anim') {
  if (!fbx[nombre]) fbx[nombre] = import('../../vendor/loaders/FBXLoader.js')
    .then(({ FBXLoader }) => new FBXLoader().loadAsync(`${RAIZ}${dir}/${nombre}.fbx`))
    .then(o => { const c = o.animations[0]; c.name = nombre;
      // según el personaje con que se bajó, Mixamo nombra los huesos mixamorig5:Hips…: se quita el número
      c.tracks.forEach(t => { t.name = t.name.replace(/^mixamorig\d+/, 'mixamorig');
        if (t.name.endsWith('.position')) t.values = t.values.map(v => v * .01); });  // Mixamo en cm, los GLB en m
      return c; });
  return fbx[nombre];
}

// Modelos con auto-rig (malla de IA + Mixamo, o retocada con faldon-a-cadera.mjs): la malla viene en triángulos sueltos y,
// si dos vértices en el mismo sitio tienen pesos distintos, al patear se abren grietas («trozos transparentes» en la chaqueta).
// sueldaPesos: los vértices que coinciden comparten pesos (ya no se separan nunca); en la franja de alto [y0, y1] (espacio del
// modelo, p. ej. rodilla–pecho) los pesos se suavizan con los vecinos `vueltas` veces, para que la tela se estire sin romperse.
// piernas: [[huesos izq.], [huesos dcha.]] (mismo orden): al suavizar, un punto de un lado no toma pesos de la otra pierna
// (si no, la entrepierna se vuelve una cortina entre las piernas al patear).
export function sueldaPesos(o, { y0 = -Infinity, y1 = Infinity, vueltas = 0, piernas = null } = {}) {
  const g = o.geometry, pos = g.attributes.position, si = g.attributes.skinIndex, sw = g.attributes.skinWeight, n = pos.count;
  const clave = new Map(), nodo = new Int32Array(n); let nn = 0;
  for (let i = 0; i < n; i++) { const k = `${Math.round(pos.getX(i) * 1e4)},${Math.round(pos.getY(i) * 1e4)},${Math.round(pos.getZ(i) * 1e4)}`;
    let j = clave.get(k); if (j === undefined) clave.set(k, j = nn++); nodo[i] = j; }
  let W = Array.from({ length: nn }, () => new Map()); const alto = new Float32Array(nn);
  for (let i = 0; i < n; i++) { const m = W[nodo[i]]; alto[nodo[i]] = pos.getY(i);
    for (let k = 0; k < 4; k++) { const w = sw.getComponent(i, k), b = si.getComponent(i, k); if (w) m.set(b, (m.get(b) || 0) + w); } }
  W.forEach(m => { let s = 0; for (const w of m.values()) s += w; for (const [b, w] of m) m.set(b, w / s); });
  let lado = null, otra = null; const ancho = new Float32Array(nn);
  if (piernas) { const xr = b => new THREE.Vector3().setFromMatrixPosition(o.skeleton.boneInverses[b].clone().invert()).x;
    const [xI, xD] = piernas.map(l => xr(l[0])), mid = (xI + xD) / 2, borde = Math.abs(xI - xD) * .1;
    for (let i = 0; i < n; i++) ancho[nodo[i]] = pos.getX(i);
    otra = new Map(piernas[0].flatMap((b, i) => [[b, piernas[1][i]], [piernas[1][i], b]]));
    const [sI, sD] = piernas.map(l => new Set(l)); lado = j => Math.abs(ancho[j] - mid) < borde ? null : (ancho[j] - mid) * (xI - mid) > 0 ? sI : sD; }
  if (vueltas) {
    const vec = Array.from({ length: nn }, () => new Set()), ix = g.index ? i => g.index.getX(i) : i => i, nt = g.index ? g.index.count : n;
    for (let f = 0; f < nt; f += 3) { const a = nodo[ix(f)], b = nodo[ix(f + 1)], c = nodo[ix(f + 2)]; vec[a].add(b).add(c); vec[b].add(a).add(c); vec[c].add(a).add(b); }
    for (let v = 0; v < vueltas; v++) W = W.map((m, j) => { if (alto[j] < y0 || alto[j] > y1) return m;
      const r = new Map(), k = .5 / vec[j].size, mio = lado?.(j); for (const [b, w] of m) r.set(b, w * .5);
      for (const q of vec[j]) for (let [b, w] of W[q]) { if (mio && otra.has(b) && !mio.has(b)) b = otra.get(b); r.set(b, (r.get(b) || 0) + w * k); } return r; });
  }
  const top = W.map(m => { const o4 = [...m].sort((a, b) => b[1] - a[1]).slice(0, 4), s = o4.reduce((t, [, w]) => t + w, 0); return o4.map(([b, w]) => [b, w / s]); });
  for (let i = 0; i < n; i++) { const o4 = top[nodo[i]]; for (let k = 0; k < 4; k++) { const [b, w] = o4[k] || [0, 0]; si.setComponent(i, k, b); sw.setComponent(i, k, w); } }
  si.needsUpdate = sw.needsUpdate = true; return { vertices: n, puntos: nn };
}

// Que el cuerpo no atraviese el suelo: mira la piel ya deformada (1 de cada `paso` vértices) y, si lo más bajo queda por debajo
// de `suelo`, sube el personaje entero. Solo sube, nunca baja (los saltos siguen en el aire). Llamar después de posar, antes de dibujar.
const _vs = new THREE.Vector3();
export function alSuelo(p, suelo = 0, paso = 25) {
  p.obj.updateMatrixWorld(true); let min = Infinity;
  p.obj.traverse(o => { if (!o.isSkinnedMesh || !o.visible) return; const pos = o.geometry.attributes.position;
    for (let i = 0; i < pos.count; i += paso) { _vs.fromBufferAttribute(pos, i); o.applyBoneTransform(i, _vs).applyMatrix4(o.matrixWorld); if (_vs.y < min) min = _vs.y; } });
  if (min < suelo) { p.obj.position.y += suelo - min; p.obj.updateMatrixWorld(true); }
  return min;
}
