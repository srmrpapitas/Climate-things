// Saca fotogramas sueltos de una escena para revisarla sin grabar el vídeo entero.
// Uso (con `python3 -m http.server 8765` en marcha): node fabrica/titeres/fotos.mjs NOMBRE 2 4.5 9.3   → out/fotos_NOMBRE/2.png …
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'fs';
const [nombre, ...tiempos] = process.argv.slice(2), dir = `out/fotos_${nombre}`; mkdirSync(dir, { recursive: true });
const nav = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu-rasterization', '--ignore-gpu-blocklist'] });
const pag = await nav.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
pag.on('pageerror', e => { console.error('ERROR en la escena:', e.message); process.exit(1); });
await pag.goto(`http://localhost:8765/fabrica/titeres/escena.html?e=${nombre}`);
await pag.evaluate(async () => { window.grabando = true; await window.listo; });
for (const t of tiempos) {
  const png = await pag.evaluate(t => { window.dibuja(t); return document.getElementById('c').toDataURL('image/png').split(',')[1]; }, +t);
  writeFileSync(`${dir}/${t}.png`, Buffer.from(png, 'base64'));
}
await nav.close(); console.log(`hecho ${dir}: ${tiempos.length} fotogramas`);
