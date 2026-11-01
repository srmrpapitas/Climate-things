// Convierte personajes FBX con esqueleto de Mixamo a GLB (con su textura dentro) para cargarlos con GLTFLoader.
// Uso (desde la raíz del repo): node fabrica/herramientas/fbx-a-glb.mjs CARPETA_FBX CARPETA_TEXTURAS SALIDA
//   p. ej. node fabrica/herramientas/fbx-a-glb.mjs modelos/personajes-extras/source/Characters_Extras/Extras_Rig \
//          modelos/personajes-extras/textures modelos/personajes-extras/glb
// La textura se busca por el nombre del FBX (Character_Male_33.fbx → Character_Male_33.png). Recorre subcarpetas.
import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFileSync, readdirSync, statSync, mkdirSync, writeFileSync, existsSync } from 'fs';
import { join, extname, basename } from 'path';
const [dirFbx, dirTex, salida] = process.argv.slice(2);
if (!salida) { console.error('Uso: node fabrica/herramientas/fbx-a-glb.mjs CARPETA_FBX CARPETA_TEXTURAS SALIDA'); process.exit(1); }
const busca = d => readdirSync(d).flatMap(f => { const p = join(d, f); return statSync(p).isDirectory() ? busca(p) : extname(f).toLowerCase() === '.fbx' ? [p] : []; });
const fbx = busca(dirFbx);
mkdirSync(salida, { recursive: true });
const TIPOS = { '.js': 'text/javascript', '.png': 'image/png', '.fbx': 'application/octet-stream' };
const srv = createServer((q, r) => { const p = decodeURIComponent(q.url.split('?')[0]).slice(1) || 'index.html';
  if (!existsSync(p) || statSync(p).isDirectory()) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'Content-Type': TIPOS[extname(p)] || 'text/html' }); r.end(readFileSync(p)); }).listen(0);
const puerto = srv.address().port;
const nav = await chromium.launch(), pag = await nav.newPage();
pag.on('pageerror', e => console.error('ERROR:', e.message));
await pag.goto(`http://localhost:${puerto}/vendor/THREE-LICENSE`);
await pag.setContent(`<script type="importmap">{"imports":{"three":"/vendor/three.module.min.js"}}</script>
<script type="module">
import * as THREE from 'three';
import { FBXLoader } from '/vendor/loaders/FBXLoader.js';
import { GLTFExporter } from '/vendor/exporters/GLTFExporter.js';
window.convierte = async (fbx, png) => {
  const obj = await new FBXLoader().loadAsync(fbx);
  const tex = png ? await new THREE.TextureLoader().loadAsync(png) : null;
  // flipY se queda en true (convención del FBX): GLTFExporter le da la vuelta a la imagen al guardarla para glTF
  if (tex) tex.colorSpace = THREE.SRGBColorSpace;
  obj.traverse(o => { if (o.isMesh) { const ms = Array.isArray(o.material) ? o.material : [o.material];
    o.material = ms.map(m => new THREE.MeshStandardMaterial({ name: m.name, map: tex || m.map || null, color: tex ? 0xffffff : m.color, roughness: .85 }));
    if (o.material.length === 1) o.material = o.material[0]; } });
  // Mixamo exporta en centímetros: lo dejamos en metros
  const caja = new THREE.Box3().setFromObject(obj), alto = caja.max.y - caja.min.y;
  if (alto > 10) obj.scale.multiplyScalar(.01);
  const huesos = []; obj.traverse(o => o.isBone && huesos.push(o.name));
  const glb = await new GLTFExporter().parseAsync(obj, { binary: true, animations: obj.animations });
  const b = new Uint8Array(glb); let s = ''; for (let i = 0; i < b.length; i += 32768) s += String.fromCharCode(...b.subarray(i, i + 32768));
  return { glb: btoa(s), alto: +(alto > 10 ? alto / 100 : alto).toFixed(2), huesos: huesos.length, clips: obj.animations.length };
};
window.listo = true;
</script>`);
await pag.waitForFunction(() => window.listo);
for (const f of fbx) {
  const nombre = basename(f, extname(f)), png = join(dirTex, nombre + '.png');
  const r = await pag.evaluate(([a, b]) => window.convierte(a, b), ['/' + f, existsSync(png) ? '/' + png : null]);
  writeFileSync(join(salida, nombre + '.glb'), Buffer.from(r.glb, 'base64'));
  console.log(`${nombre}.glb  ${r.alto} m  ${r.huesos} huesos  ${r.clips} clips${existsSync(png) ? '' : '  (SIN TEXTURA)'}`);
}
await nav.close(); srv.close();
