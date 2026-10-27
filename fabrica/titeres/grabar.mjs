// Graba una escena de títeres fotograma a fotograma (12 dibujos por segundo) y la pasa a MP4 1080p a 24 fps.
// Uso (desde la raíz del repo, con `python3 -m http.server 8765` en marcha):
//   node fabrica/titeres/grabar.mjs mitin out/mitin.mp4 [desde hasta]   (desde/hasta en segundos, para probar un trozo)
import { chromium } from 'playwright';
import { mkdirSync, rmSync, writeFileSync } from 'fs';
import { execFileSync } from 'child_process';
const [nombre = 'mitin', salida = `out/${nombre}.mp4`, desde, hasta] = process.argv.slice(2), dir = `out/titeres_${nombre}`;
rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true });
const nav = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu-rasterization', '--ignore-gpu-blocklist'] });
const pag = await nav.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
pag.on('pageerror', e => console.error('ERROR en la escena:', e.message));
await pag.goto(`http://localhost:8765/fabrica/titeres/escena.html?e=${nombre}`);
await pag.evaluate(async () => { window.grabando = true; await window.listo; });
const [dura, fps] = await pag.evaluate(() => [window.DURA, window.FPS]);
const i0 = Math.round((+desde || 0) * fps), i1 = Math.round((+hasta || dura) * fps), t0 = Date.now();
for (let i = i0; i < i1; i++) {
  const png = await pag.evaluate(t => { window.dibuja(t); return document.getElementById('c').toDataURL('image/png').split(',')[1]; }, i / fps);
  writeFileSync(`${dir}/${String(i - i0).padStart(5, '0')}.png`, Buffer.from(png, 'base64'));   // el lienzo tal cual, a 1920×1080
}
await nav.close();
execFileSync('ffmpeg', ['-y', '-v', 'error', '-framerate', String(fps), '-i', `${dir}/%05d.png`, '-r', '24', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '17', salida]);
console.log(`hecho ${salida}: ${i1 - i0} dibujos en ${((Date.now() - t0) / 1000).toFixed(0)} s`);
