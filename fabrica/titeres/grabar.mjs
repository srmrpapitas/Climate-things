// Graba una escena de títeres fotograma a fotograma (12 dibujos por segundo) y la pasa a MP4 1080p a 24 fps.
// Uso (desde la raíz del repo, con `python3 -m http.server 8765` en marcha):
//   node fabrica/titeres/grabar.mjs mitin out/mitin.mp4 [desde hasta]   (desde/hasta en segundos, para probar un trozo)
import { chromium } from 'playwright';
import { mkdirSync, rmSync, writeFileSync, existsSync } from 'fs';
import { execFileSync } from 'child_process';
const [nombre = 'mitin', salida = `out/${nombre}.mp4`, desde, hasta] = process.argv.slice(2), dir = `out/titeres_${nombre}`;
rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true });
const nav = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu-rasterization', '--ignore-gpu-blocklist'] });
const pag = await nav.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
pag.on('pageerror', e => console.error('ERROR en la escena:', e.message));
await pag.goto(`http://localhost:8765/fabrica/titeres/escena.html?e=${nombre}`);
await pag.evaluate(async () => { window.grabando = true; await window.listo; });
const [dura, fps, voces0] = await pag.evaluate(() => [window.DURA, window.FPS, window.ESCENA.voces || []]);
const i0 = Math.round((+desde || 0) * fps), i1 = Math.round((+hasta || dura) * fps), t0 = Date.now();
for (let i = i0; i < i1; i++) {
  const png = await pag.evaluate(t => { window.dibuja(t); return document.getElementById('c').toDataURL('image/png').split(',')[1]; }, i / fps);
  writeFileSync(`${dir}/${String(i - i0).padStart(5, '0')}.png`, Buffer.from(png, 'base64'));   // el lienzo tal cual, a 1920×1080
}
await nav.close();
// voces: cada archivo entra en su segundo (adelay); si aún no existe, el vídeo sale mudo con subtítulos
const voces = (await (async () => voces0)()).filter(v => v.archivo && existsSync(v.archivo) && v.en >= i0 / fps && v.en < i1 / fps);
const entradas = voces.flatMap(v => ['-i', v.archivo]);
const mezcla = voces.map((v, k) => `[${k + 1}:a]adelay=${Math.round((v.en - i0 / fps) * 1000)}:all=1,volume=${v.volumen ?? 1}[a${k}]`).join(';');
const audio = voces.length ? ['-filter_complex', `${mezcla};${voces.map((_, k) => `[a${k}]`).join('')}amix=inputs=${voces.length}:normalize=0[a]`, '-map', '0:v', '-map', '[a]', '-c:a', 'aac', '-b:a', '192k'] : [];
execFileSync('ffmpeg', ['-y', '-v', 'error', '-framerate', String(fps), '-i', `${dir}/%05d.png`, ...entradas, ...audio, '-r', '24', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '17', '-t', String((i1 - i0) / fps), salida]);
console.log(`hecho ${salida}: ${i1 - i0} dibujos en ${((Date.now() - t0) / 1000).toFixed(0)} s`);
