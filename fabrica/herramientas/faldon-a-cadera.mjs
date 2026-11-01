// Arregla la chaqueta (o falda, abrigo…) que el auto-rig de Mixamo une a las dos piernas a la vez y se estira entre ellas:
// los vértices que dependen de las dos piernas siguen a la cadera (encima de la entrepierna) o solo a la pierna de su lado. Guarda la textura en JPG (pesa menos).
// Uso (desde la raíz del repo): node fabrica/herramientas/faldon-a-cadera.mjs modelos/scd/trump.glb [umbral=0.08] [caida=0.25]
import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFileSync, writeFileSync, existsSync, statSync } from 'fs';
import { extname } from 'path';
const [glb, umbral = '0.08', caida = '0.25'] = process.argv.slice(2);  // caida: metros bajo la ingle que cuelgan de la cadera
const srv = createServer((q, r) => { const p = decodeURIComponent(q.url.split('?')[0]).slice(1);
  if (!existsSync(p) || statSync(p).isDirectory()) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'Content-Type': extname(p) === '.js' ? 'text/javascript' : extname(p) ? 'application/octet-stream' : 'text/plain' }); r.end(readFileSync(p)); }).listen(0);
const nav = await chromium.launch(), pag = await nav.newPage();
pag.on('pageerror', e => console.error('ERROR:', e.message));
await pag.goto(`http://localhost:${srv.address().port}/vendor/THREE-LICENSE`);
await pag.setContent(`<script type="importmap">{"imports":{"three":"/vendor/three.module.min.js"}}</script>
<script type="module">
import * as THREE from 'three';
import { GLTFLoader } from '/vendor/GLTFLoader.js';
import { GLTFExporter } from '/vendor/exporters/GLTFExporter.js';
window.arregla = async (url, umbral, caida) => {
  const g = await new GLTFLoader().loadAsync(url); let n = 0, total = 0;
  g.scene.traverse(o => { if (!o.isSkinnedMesh) return;
    const hb = o.skeleton.bones, id = s => hb.findIndex(b => b.name === s);
    const cadera = id('mixamorigHips'), lado = L => ['UpLeg', 'Leg'].map(p => id('mixamorig' + L + p));
    const izq = lado('Left'), der = lado('Right');
    // se trabaja por triángulo suelto: si un triángulo une las dos piernas, se mueve entero con una sola (no se estira)
    if (o.geometry.index) o.geometry = o.geometry.toNonIndexed();
    const si = o.geometry.attributes.skinIndex, sw = o.geometry.attributes.skinWeight; total += si.count / 3;
    // pose de reposo en el mundo: altura de la entrepierna y en qué lado cae cada pierna
    g.scene.updateMatrixWorld(true);
    const P = i => hb[i].getWorldPosition(new THREE.Vector3()), pI = P(izq[0]), pD = P(der[0]);
    const entrepierna = Math.min(pI.y, pD.y) - caida;  // hasta el borde de la chaqueta
    const pos = o.geometry.attributes.position, x = new THREE.Vector3(), c = new THREE.Vector3();
    const otra = new Map([...izq.map((b, i) => [b, der[i]]), ...der.map((b, i) => [b, izq[i]])]);
    const pesosDe = v => { const m = new Map(); let l = 0, r = 0;
      for (let k = 0; k < 4; k++) { const b = si.getComponent(v, k), w = sw.getComponent(v, k); if (!w) continue;
        m.set(b, (m.get(b) || 0) + w); if (izq.includes(b)) l += w; if (der.includes(b)) r += w; }
      return { m, l, r }; };
    for (let f = 0; f < si.count; f += 3) {
      const vs = [f, f + 1, f + 2].map(pesosDe);
      if (Math.max(...vs.map(p => p.l)) < umbral || Math.max(...vs.map(p => p.r)) < umbral) continue;
      c.set(0, 0, 0); for (let k = 0; k < 3; k++) c.add(x.fromBufferAttribute(pos, f + k)); c.divideScalar(3).applyMatrix4(o.matrixWorld);
      // por encima del borde de la chaqueta: cuelga de la cadera; por debajo: sigue solo a la pierna de su lado
      const lado = c.y > entrepierna ? null : (Math.abs(c.x - pI.x) < Math.abs(c.x - pD.x) ? izq : der);
      vs.forEach(({ m }, k) => { const nuevos = new Map();
        for (const [b, w] of m) { const d = !otra.has(b) ? b : lado ? (lado.includes(b) ? b : otra.get(b)) : cadera;
          nuevos.set(d, (nuevos.get(d) || 0) + w); }
        const orden = [...nuevos].sort((a, b) => b[1] - a[1]).slice(0, 4), suma = orden.reduce((s, [, w]) => s + w, 0);
        for (let j = 0; j < 4; j++) { const [b, w] = orden[j] || [0, 0]; si.setComponent(f + k, j, b); sw.setComponent(f + k, j, w / suma); } });
      n++;
    }
    si.needsUpdate = sw.needsUpdate = true;
    const m = o.material; if (m.map) m.map.userData.mimeType = 'image/jpeg';
  });
  const out = await new GLTFExporter().parseAsync(g.scene, { binary: true, animations: g.animations });
  const b = new Uint8Array(out); let s = ''; for (let i = 0; i < b.length; i += 32768) s += String.fromCharCode(...b.subarray(i, i + 32768));
  return { glb: btoa(s), n, total };
};
window.listo = true;
</script>`);
await pag.waitForFunction(() => window.listo);
const r = await pag.evaluate(([a, u, c]) => window.arregla(a, u, c), ['/' + glb, +umbral, +caida]);
writeFileSync(glb, Buffer.from(r.glb, 'base64'));
console.log(`${r.n} de ${r.total} triángulos arreglados → ${glb} (${(statSync(glb).size / 1e6).toFixed(1)} MB)`);
await nav.close(); srv.close();
