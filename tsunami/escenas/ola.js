// El muro de agua de un tsunami: un perfil que rompe (sacado de fenomenos/ola.js), estirado a lo ancho, con espuma
// en la cresta. hacerOla(scene, { ancho, h }) → { mesh, ir(zFrente, h, t, base) }: la ola avanza hacia +z.
import { THREE, material, lienzo, clamp, hash } from '../motor.js';

// perfil en unidades de la altura: [avance respecto al frente, altura]
const PB0 = [[-3.2, 1], [-1.4, 1.03], [-.6, 1.1], [-.1, 1.12], [.3, 1.02], [.5, .84], [.42, .72], [.18, .7], [.04, .52], [0, .3], [.12, .08], [.45, -.02], [.45, -1.6]];
function chaikin(P) { const out = [P[0]];
  for (let i = 0; i < P.length - 1; i++) { const a = P[i], b = P[i + 1]; out.push([a[0] * .75 + b[0] * .25, a[1] * .75 + b[1] * .25], [a[0] * .25 + b[0] * .75, a[1] * .25 + b[1] * .75]); }
  out.push(P[P.length - 1]); return out; }
const PB = chaikin(chaikin(PB0));

export const espumaTex = lienzo(64, 64, g => { const gr = g.createRadialGradient(32, 32, 4, 32, 32, 30); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.6, 'rgba(240,252,255,.8)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); });

export function hacerOla(scene, o = {}) {
  const ancho = o.ancho ?? 800, N = o.columnas ?? 140, P = PB.length + 1, atras = o.atras ?? 3000;
  const nv = N * (P - 1) * 6, pos = new Float32Array(nv * 3), col = new Float32Array(nv * 3);
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const c = new THREE.Color(), hondo = new THREE.Color(o.hondo ?? 0x1a5f8a), claro = new THREE.Color(o.claro ?? 0x46b6d2), espuma = new THREE.Color(0xf2fcff);
  let k = 0;
  for (let j = 0; j < N; j++) for (let i = 0; i < P - 1; i++) {
    const a = i === 0 ? [-9, 1] : PB[i - 1], b = PB[Math.min(i, PB.length - 1)], u = (a[0] + b[0]) / 2, v = (a[1] + b[1]) / 2;
    if (u > -.8 && v > .97) c.copy(claro).lerp(espuma, clamp((u + .8) / .8, 0, 1));      // cresta con espuma
    else if (u > -.05 && v > .4 && v < .97) c.copy(espuma).lerp(claro, .25);            // el labio que rompe
    else c.copy(hondo).lerp(claro, clamp(v, 0, 1) * .9);
    c.multiplyScalar(.92 + hash(j, i) * .16);
    for (let q = 0; q < 6; q++) { col[k++] = c.r; col[k++] = c.g; col[k++] = c.b; }
  }
  const mesh = new THREE.Mesh(geo, material({ vertexColors: true, side: THREE.DoubleSide, grosor: .003 }));
  mesh.frustumCulled = false; mesh.castShadow = false; mesh.receiveShadow = true; scene.add(mesh);
  // espuma en la cresta y rociones delante
  const NE = o.espuma ?? 900, eg = new THREE.BufferGeometry(), ep = new Float32Array(NE * 3); eg.setAttribute('position', new THREE.BufferAttribute(ep, 3));
  const esp = new THREE.Points(eg, new THREE.PointsMaterial({ map: espumaTex, color: 0xffffff, size: o.tamEspuma ?? 3, transparent: true, depthWrite: false, opacity: .9 }));
  esp.frustumCulled = false; esp.material.userData.outlineParameters = { visible: false }; scene.add(esp);

  const A = [0, 0, 0], B = [0, 0, 0], C = [0, 0, 0], D = [0, 0, 0];
  function ir(zF, h, t, base = 0) {
    mesh.visible = esp.visible = h > .01;
    const vert = (i, j, out) => { const x = -ancho / 2 + ancho * j / N, zoff = Math.sin(x / (h * 6 + 20) + t * .6) * h * .35 + Math.sin(x / 90 + 1.3) * h * .5;
      if (i === 0) { out[0] = x; out[1] = base + h; out[2] = zF - atras; return; }
      const [u, v] = PB[i - 1], wob = v > .5 ? Math.sin(j * 1.9 + i * 2.3 + t * 2.2) * .02 + Math.sin(j * .7 - t * 1.3) * .015 : 0;
      out[0] = x; out[1] = base + (v + wob) * h; out[2] = zF + zoff + u * h; };
    let q = 0; const put = v => { pos[q++] = v[0]; pos[q++] = v[1]; pos[q++] = v[2]; };
    for (let j = 0; j < N; j++) for (let i = 0; i < P - 1; i++) { vert(i, j, A); vert(i + 1, j, B); vert(i, j + 1, C); vert(i + 1, j + 1, D); put(A); put(B); put(C); put(B); put(D); put(C); }
    geo.attributes.position.needsUpdate = true; geo.computeVertexNormals();
    for (let e = 0; e < NE; e++) { const x = -ancho / 2 + ancho * hash(e, 1), zoff = Math.sin(x / (h * 6 + 20) + t * .6) * h * .35 + Math.sin(x / 90 + 1.3) * h * .5, f = (hash(e, 2) + t * (.4 + hash(e, 3) * .6)) % 1;
      ep[e * 3] = x + Math.sin(t * 3 + e) * h * .05; ep[e * 3 + 1] = base + h * (1.02 + f * .35 * hash(e, 4)) - f * f * h * .9 * hash(e, 5); ep[e * 3 + 2] = zF + zoff + h * (.2 + f * .6 * hash(e, 6)); }
    eg.attributes.position.needsUpdate = true; esp.material.size = (o.tamEspuma ?? 3) * Math.max(.4, h / 10);
  }
  return { mesh, espuma: esp, ir };
}
