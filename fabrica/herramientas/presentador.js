// Presentador del SCD: Rocketbox «Business_Male_01» (Microsoft, licencia MIT: modelos/scd/presentador/LICENSE-Rocketbox.txt),
// con 15 visemas, las 52 formas de ARKit y FACS. Se mueve sin clips, todo en función de t (el mismo fotograma sale igual):
//   - brazos por IK de dos huesos: la derecha sujeta el micro delante de la boca; la izquierda hace gestos (señala, puño…)
//   - dedos que se cierran hacia la palma; columna, cuello y cabeza que miran a un punto y cabecean con las sílabas fuertes
//   - cara: visemas desde las palabras de whisper (boca.json, lo escribe mezcla.py) por la envolvente de la voz; parpadeos
//   const pr = await cargaPresentador(boca); esc.add(pr.obj); pr.pon(t, { mira: cam.position, gestos: [[t0, 'puño'], …] })
import * as THREE from 'three';
import { FBXLoader } from '../../vendor/loaders/FBXLoader.js';

const DIR = new URL('../../modelos/scd/presentador/', import.meta.url).href;
const V = (x, y, z) => new THREE.Vector3(x, y, z), lim = (k, a = 0, b = 1) => Math.max(a, Math.min(b, k)), suave = k => k * k * (3 - 2 * k);
const hash = n => { const x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x); };

// letra → visema (el español se escribe casi como suena)
const VIS = { a: 'aa', e: 'E', i: 'I', y: 'I', o: 'O', u: 'U', p: 'PP', b: 'PP', m: 'PP', v: 'PP', f: 'FF', t: 'DD', d: 'DD',
  c: 'KK', k: 'KK', q: 'KK', g: 'KK', j: 'KK', s: 'SS', z: 'SS', x: 'SS', n: 'nn', ñ: 'nn', l: 'nn', r: 'RR', w: 'U' };
const VOCAL = new Set(['aa', 'E', 'I', 'O', 'U']);
const fonemas = palabras => { const out = [];
  for (const [w, a, b] of palabras) {
    const s = w.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ch/g, '§').replace(/ll/g, 'y').replace(/qu/g, 'k').replace(/h/g, '').replace(/[^a-zñ§]/g, '');
    const l = [...s].map(c => c === '§' ? 'CH' : VIS[c]).filter(Boolean); if (!l.length) continue;
    const pesos = l.map(v => VOCAL.has(v) ? 2.2 : 1), tot = pesos.reduce((x, y) => x + y, 0); let t = a;
    l.forEach((v, i) => { const d = (b - a) * pesos[i] / tot; out.push([v, t, t + d]); t += d; }); }
  return out; };

export async function cargaPresentador(boca = { fps: 60, env: [], palabras: [] }) {
  const obj = await new FBXLoader().loadAsync(DIR + 'Business_Male_01_facial.fbx');
  obj.scale.setScalar(.0099);  // cm → m (1,79 m)
  const tl = new THREE.TextureLoader(), tx = (n, srgb = true) => { const t = tl.load(DIR + n); t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace; t.anisotropy = 8; return t; };
  let piel; obj.traverse(o => { if (o.isSkinnedMesh) piel = o; });
  piel.castShadow = true; piel.frustumCulled = false;
  piel.material = [
    new THREE.MeshStandardMaterial({ name: 'cuerpo', map: tx('body_color.jpg'), normalMap: tx('body_normal.jpg', false), roughness: .72 }),
    new THREE.MeshStandardMaterial({ name: 'cara', map: tx('head_color.jpg'), normalMap: tx('head_normal.jpg', false), roughness: .55 }),
    new THREE.MeshStandardMaterial({ name: 'pelo', map: tx('opacity.png'), alphaTest: .35, side: THREE.DoubleSide, roughness: .8 })];
  const H = {}; obj.traverse(o => { if (o.isBone) H[o.name.replace(/^Bip01_?/, '') || 'raiz'] = o; });
  // la lengua sale azulada (su trozo de textura): color por vértice, rosa oscuro donde manda el hueso de la lengua
  { const g = piel.geometry, si = g.attributes.skinIndex, sw = g.attributes.skinWeight, lengua = piel.skeleton.bones.indexOf(H.MTongue);
    const col = new Float32Array(si.count * 3).fill(1);
    for (let i = 0; i < si.count; i++) for (let k = 0; k < 4; k++) if (si.getComponent(i, k) === lengua && sw.getComponent(i, k) > .4) col.set([.62, .22, .25], i * 3);
    g.setAttribute('color', new THREE.BufferAttribute(col, 3)); piel.material.forEach(m => m.vertexColors = true); }
  const reposo = new Map(Object.values(H).map(b => [b, [b.quaternion.clone(), b.position.clone()]]));
  const dicc = piel.morphTargetDictionary, morfo = n => dicc['blendShape1.' + n];
  const VISEMA = Object.fromEntries(['Sil', 'PP', 'FF', 'TH', 'DD', 'KK', 'CH', 'SS', 'nn', 'RR', 'aa', 'E', 'I', 'O', 'U'].map((v, i) => [v, morfo(`AA_VI_${String(i).padStart(2, '0')}_${v}`)]));
  const AK = n => morfo(Object.keys(dicc).find(k => k.endsWith('_' + n)).slice(12));
  const fon = fonemas(boca.palabras);
  const env = t => { const i = t * boca.fps, a = Math.floor(i); if (a < 0 || a + 1 >= boca.env.length) return 0; return boca.env[a] + (boca.env[a + 1] - boca.env[a]) * (i - a); };

  // micro de mano con su banderita SCD
  const micro = new THREE.Group(), negro = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: .35, metalness: .6 });
  const mango = new THREE.Mesh(new THREE.CylinderGeometry(1.75, 1.35, 19, 20), negro); mango.position.y = -9.5;
  const anillo = new THREE.Mesh(new THREE.CylinderGeometry(2.05, 1.8, 1.2, 20), new THREE.MeshStandardMaterial({ color: 0xbfc4cc, roughness: .25, metalness: 1 }));
  const rejilla = new THREE.Mesh(new THREE.SphereGeometry(2.7, 20, 14), new THREE.MeshStandardMaterial({ color: 0x3a3c42, roughness: .45, metalness: .8 }));
  rejilla.position.y = 2.3;
  const cv = document.createElement('canvas'); cv.width = 256; cv.height = 128; const x = cv.getContext('2d');
  x.fillStyle = '#d0021b'; x.fillRect(0, 0, 256, 128); x.fillStyle = '#fff'; x.font = '900 86px Impact, Arial Black'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('SCD', 128, 68);
  const tb = new THREE.CanvasTexture(cv); tb.colorSpace = THREE.SRGBColorSpace;
  const logoMic = new THREE.MeshStandardMaterial({ map: tb, roughness: .6 });  // logo en las cuatro caras de la banderita
  const bandera = new THREE.Mesh(new THREE.BoxGeometry(6.4, 3.4, 6.4), [logoMic, logoMic, negro, negro, logoMic, logoMic]); bandera.position.y = -3.4;
  micro.add(mango, anillo, rejilla, bandera); micro.traverse(o => { if (o.isMesh) o.castShadow = true; });
  obj.add(micro);  // en unidades del modelo (cm)

  // ---------- ayudas de pose (todo en el mundo)
  const _q = new THREE.Quaternion(), _q2 = new THREE.Quaternion(), _m = new THREE.Matrix4(), _m2 = new THREE.Matrix4();
  const P = b => b.getWorldPosition(V(0, 0, 0));
  const giraMundo = (b, qMundo) => { b.updateWorldMatrix(true, false); const qw = b.getWorldQuaternion(_q).premultiply(qMundo);
    b.quaternion.copy(b.parent.getWorldQuaternion(_q2).invert().multiply(qw)); b.updateMatrixWorld(true); };
  const apunta = (b, hijo, dir, peso = 1) => { const d = P(hijo).sub(P(b)).normalize(); const q = new THREE.Quaternion().setFromUnitVectors(d, dir.clone().normalize());
    if (peso < 1) q.slerp(new THREE.Quaternion(), 1 - peso); giraMundo(b, q); };
  const eje = (b, v, ang) => giraMundo(b, new THREE.Quaternion().setFromAxisAngle(v.clone().normalize(), ang));
  // espacio del personaje (m, mirando a +z, su izquierda en +x) ↔ mundo
  const aMundo = v => obj.localToWorld(v.clone());  // v en unidades del modelo (cm)
  const vecMundo = v => v.clone().applyQuaternion(obj.getWorldQuaternion(new THREE.Quaternion())), dirMundo = v => vecMundo(v).normalize();  // desplazamiento (m) / dirección
  const enCm = v => v.clone().multiplyScalar(100);

  // marco de la mano: f = hacia los dedos, s = del meñique al índice, n = hacia donde mira la palma
  const marco = l => { const h = P(H[`${l}_Hand`]), f = P(H[`${l}_Finger2`]).sub(h).normalize();
    const s = P(H[`${l}_Finger1`]).sub(P(H[`${l}_Finger4`])); s.sub(f.clone().multiplyScalar(s.dot(f))).normalize();
    return { f, s, n: f.clone().cross(s).multiplyScalar(signo[l]) }; };
  // palma: n = f × s en la izquierda y −(f × s) en la derecha (medido: con «presenta» se ve la palma y con «señala» el índice estirado)
  const signo = { L: 1, R: -1 };
  obj.updateMatrixWorld(true);
  // la mano gira hasta el marco (f, n); antes, el antebrazo se lleva parte del giro alrededor de su eje (si no, la muñeca se retuerce)
  const orienta = (l, fT, nT, torsion = .65) => { const n = nT.clone().normalize(), f = fT.clone().sub(n.clone().multiplyScalar(fT.dot(n))).normalize();
    const s = n.clone().cross(f).multiplyScalar(signo[l]);  // de n = signo·(f × s)
    const fo = H[`${l}_Forearm`], a = P(H[`${l}_Hand`]).sub(P(fo)).normalize(), c0 = marco(l);
    const pc = c0.n.clone().sub(a.clone().multiplyScalar(c0.n.dot(a))), pt = n.clone().sub(a.clone().multiplyScalar(n.dot(a)));
    if (pc.lengthSq() > 1e-4 && pt.lengthSq() > 1e-4) { pc.normalize(); pt.normalize(); eje(fo, a, Math.atan2(pc.clone().cross(pt).dot(a), pc.dot(pt)) * torsion); }
    const c = marco(l); _m.makeBasis(c.f, c.s, c.n); _m2.makeBasis(f, s, n);
    giraMundo(H[`${l}_Hand`], new THREE.Quaternion().setFromRotationMatrix(_m2.multiply(_m.transpose()))); };
  // dedos: [pulgar, índice, corazón, anular, meñique], 0 = estirado, 1 = cerrado
  const dedos = (l, cierre) => { for (let d = 0; d < 5; d++) { const k = cierre[d]; if (!k) continue;
    const cad = [H[`${l}_Finger${d}`], H[`${l}_Finger${d}1`], H[`${l}_Finger${d}2`]], angs = d ? [1.45, 1.55, 1.05] : [.35, .7, .8];
    for (let j = 0; j < 3; j++) { const b = cad[j], sig = cad[j + 1] ?? null, n = marco(l).n;
      const dir = sig ? P(sig).sub(P(b)) : P(b).sub(P(cad[j - 1])); const ax = dir.normalize().cross(n);
      if (d === 0) ax.copy(marco(l).f).multiplyScalar(-signo[l]);  // el pulgar cruza por delante de la palma
      eje(b, ax, angs[j] * k); } } };
  // IK de dos huesos: el hombro se queda, la muñeca va a «p» (mundo) y el codo hacia «polo»
  const ik = (l, p, polo) => { const a0 = H[`${l}_UpperArm`], a1 = H[`${l}_Forearm`], a2 = H[`${l}_Hand`];
    const S = P(a0), la = P(a1).distanceTo(S), lb = P(a2).distanceTo(P(a1)), u = p.clone().sub(S), d = lim(u.length(), .05, (la + lb) * .999); u.normalize();
    const cosA = (la * la + d * d - lb * lb) / (2 * la * d), n = polo.clone().sub(u.clone().multiplyScalar(polo.dot(u))).normalize();
    const E = S.clone().add(u.clone().multiplyScalar(la * cosA)).add(n.multiplyScalar(la * Math.sqrt(Math.max(0, 1 - cosA * cosA))));
    apunta(a0, a1, E.clone().sub(S)); apunta(a1, a2, S.clone().add(u.multiplyScalar(d)).sub(E)); };

  // ---------- gestos de la mano izquierda (espacio del personaje, m): muñeca, codo, dedos y orientación de la mano
  const G = {
    abajo:    { p: [.27, .98, .06], polo: [.4, 0, -1], f: [0, -1, .15], n: [-1, 0, 0], d: [.2, .25, .3, .35, .4] },
    presenta: { p: [.42, 1.18, .38], polo: [.6, -1, -.3], f: [.45, .15, 1], n: [0, 1, 0], d: [.05, .05, .1, .15, .2] },
    señala:   { p: [.62, 1.42, .42], polo: [0, -1, 0], f: [.8, .05, .6], n: [0, -1, 0], d: [.6, 0, 1, 1, 1] },
    al_frente:{ p: [.12, 1.4, .62], polo: [.5, -1, 0], f: [-.1, .05, 1], n: [0, -1, 0], d: [.6, 0, 1, 1, 1] },
    puño:     { p: [.3, 2.02, .12], polo: [1, 0, 0], f: [0, 1, 0], n: [0, 0, 1], d: [.9, 1, 1, 1, 1] },
    abre:     { p: [.66, 1.62, .25], polo: [.3, -1, -.4], f: [.6, .5, .2], n: [0, .3, 1], d: [.05, 0, 0, .05, .1] },
    pecho:    { p: [.08, 1.3, .3], polo: [1, -.5, 0], f: [-1, .3, .1], n: [0, 0, 1], d: [.3, .2, .25, .3, .35] },
  };
  const mezclaG = (a, b, k) => Object.fromEntries(Object.keys(a).map(c => [c, a[c].map((v, i) => v + (b[c][i] - v) * k)]));
  const gestoEn = (t, lista) => { let i = lista.findLastIndex(([t0]) => t >= t0); if (i < 0) return G[lista[0]?.[1]] ?? G.abajo;
    const [t0, n] = lista[i], ant = i ? G[lista[i - 1][1]] : G[n]; return mezclaG(ant, G[n], suave(lim((t - t0) / .28))); };

  // ---------- cara
  const visemas = t => { const w = {};
    for (const [v, a, b] of fon) { if (b < t - .12 || a > t + .12) continue;
      const k = lim(Math.min((t - (a - .06)) / .08, ((b + .05) - t) / .08)); if (k > (w[v] ?? 0)) w[v] = k; }
    return w; };

  const pon = (t, { mira = null, gestos = [[0, 'abajo']], fuerza = 1, sonrisa = 0 } = {}) => {
    for (const [b, [q, p]] of reposo) { b.quaternion.copy(q); b.position.copy(p); }
    obj.updateMatrixWorld(true);
    const e = env(t), alto = lim((e - .55) * 2.2) * fuerza;  // grito: se inclina, abre más y sube las cejas
    // columna: respiración, balanceo y un empujón hacia delante en los gritos
    const dcha = dirMundo(V(-1, 0, 0)), arriba = dirMundo(V(0, 1, 0));
    for (const [n, k] of [['Spine', .35], ['Spine1', .35], ['Spine2', .3]]) {
      eje(H[n], dcha, (.05 + alto * .16 + Math.sin(t * 1.7) * .015) * k); eje(H[n], arriba, Math.sin(t * .9) * .05 * k); }
    // cabeza: mira al punto (la cámara) y cabecea con las sílabas fuertes
    if (mira) { const cab = P(H.Head), haz = mira.clone().sub(cab).normalize(), fr = dirMundo(V(0, 0, 1));
      const peso = lim((fr.dot(haz) + .2) / .6);  // si el punto queda a su espalda (gira sobre sí mismo), no retuerce el cuello
      const q = new THREE.Quaternion().setFromUnitVectors(fr, haz.lerp(fr, .25).normalize());
      giraMundo(H.Neck, new THREE.Quaternion().slerp(q, .4 * peso)); giraMundo(H.Head, new THREE.Quaternion().slerp(q, .55 * peso)); }
    const pulso = lim(e - env(t - .09)) * 2.4;
    eje(H.Head, dcha, -.06 * alto + pulso * .1 + Math.sin(t * 2.3) * .02);
    eje(H.Head, dirMundo(V(0, 0, 1)), Math.sin(t * 1.3) * .035);
    // brazo derecho: el micro delante de la boca, agarre de martillo con la muñeca recta. Se prueba el giro de la mano
    // alrededor del micro que deja el codo justo a un brazo del hombro, por fuera del cuerpo y lo más bajo posible
    const boca = P(H.MUpperLip).lerp(P(H.MBottomLip), .5), m = dirMundo(V(-.12, .72, -.68));  // eje del micro: del mango a la cabeza
    const cabezaMic = boca.clone().add(vecMundo(V(-.03, -.055, .065 - alto * .012))), agarre = cabezaMic.clone().sub(m.clone().multiplyScalar(.115));
    const S = P(H.R_UpperArm), la = P(H.R_Forearm).distanceTo(S), lb = P(H.R_Hand).distanceTo(P(H.R_Forearm)), largo = P(H.R_Finger2).distanceTo(P(H.R_Hand));
    const u = arriba.clone().cross(m).normalize(), w2 = m.clone().cross(u), pecho = P(H.Spine2);
    let mejor = [1e9];
    for (let i = 0; i < 90; i++) { const a = i / 90 * Math.PI * 2, f = u.clone().multiplyScalar(Math.cos(a)).add(w2.clone().multiplyScalar(Math.sin(a)));
      const n = f.clone().cross(m).multiplyScalar(signo.R), W = agarre.clone().sub(n.clone().multiplyScalar(.024)).sub(f.clone().multiplyScalar(largo * .5)), E = W.clone().sub(f.clone().multiplyScalar(lb));
      const coste = Math.abs(E.distanceTo(S) - la) * 30 + E.clone().sub(S).dot(arriba) + Math.max(0, .1 - E.clone().sub(pecho).dot(dcha)) * 8;
      if (coste < mejor[0]) mejor = [coste, f, n, W, E]; }
    const [, fR, nR, W, E] = mejor;
    ik('R', W, E.clone().sub(S.clone().lerp(W, .5))); orienta('R', fR, nR); dedos('R', [.5, .82, .86, .9, .95]);
    micro.position.copy(obj.worldToLocal(agarre.clone().add(m.clone().multiplyScalar(.115))));
    micro.quaternion.copy(obj.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), m)));
    // brazo izquierdo: el gesto del momento
    const g = gestoEn(t, gestos), mano = aMundo(enCm(V(...g.p))).add(vecMundo(V(0, Math.sin(t * 2.1) * .015 + alto * .04, 0)));
    ik('L', mano, dirMundo(V(...g.polo))); orienta('L', dirMundo(V(...g.f)), dirMundo(V(...g.n))); dedos('L', g.d);
    // cara: visemas por la envolvente (las vocales abren con el volumen; p/b/m y f cierran siempre)
    const inf = piel.morphTargetInfluences; inf.fill(0);
    const w = visemas(t), voz = lim(e * 1.6);
    for (const [v, k] of Object.entries(w)) { const i = VISEMA[v]; if (i === undefined) continue;
      inf[i] = Math.max(inf[i], VOCAL.has(v) ? k * lim(.35 + voz * .9) : k * (v === 'PP' || v === 'FF' ? 1 : .55 + voz * .4)); }
    inf[AK('JawOpen')] = lim(voz * .35 + alto * .35) * (w.PP || w.FF ? .2 : 1);
    inf[AK('MouthStretchLeft')] = inf[AK('MouthStretchRight')] = alto * .35;
    inf[AK('BrowInnerUp')] = lim(.15 + alto * .7); inf[AK('BrowOuterUpLeft')] = inf[AK('BrowOuterUpRight')] = lim(alto * .6 + pulso * .3);
    inf[AK('EyeWideLeft')] = inf[AK('EyeWideRight')] = alto * .5;
    inf[AK('MouthSmileLeft')] = inf[AK('MouthSmileRight')] = sonrisa;
    inf[AK('NoseSneerLeft')] = inf[AK('NoseSneerRight')] = alto * .25;
    // parpadeo cada 2,5–4,5 s
    const ciclo = Math.floor(t / 3.4), fase = t - ciclo * 3.4 - hash(ciclo) * 2.2, parp = fase > 0 && fase < .16 ? Math.sin(fase / .16 * Math.PI) : 0;
    inf[AK('EyeBlinkLeft')] = inf[AK('EyeBlinkRight')] = parp;
    obj.updateMatrixWorld(true);
  };
  return { obj, piel, huesos: H, micro, pon, morfo, env, G, signo };
}
