// Graba titeres.html fotograma a fotograma (12 por segundo) y lo pasa a MP4.
// Uso (desde la raíz del repo, con un servidor en marcha: python3 -m http.server 8765):
//   node fabrica/manual/pruebas-animacion/grabar.mjs out/titeres.mp4
import { chromium } from 'playwright';
import { mkdirSync, rmSync } from 'fs';
import { execFileSync } from 'child_process';
const salida = process.argv[2] || 'out/titeres.mp4', dir = 'out/titeres_fotos';
rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true });
const nav = await chromium.launch();
const pag = await nav.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1.5 });
await pag.goto('http://localhost:8765/fabrica/manual/pruebas-animacion/titeres.html');
await pag.evaluate(async () => { window.grabando = true; await window.listo; });
const [dura, fps] = await pag.evaluate(() => [window.DURA, window.FPS]);
for (let i = 0; i < dura * fps; i++) {
  await pag.evaluate(t => window.dibuja(t), i / fps);
  await pag.screenshot({ path: `${dir}/${String(i).padStart(4, '0')}.png` });
}
await nav.close();
execFileSync('ffmpeg', ['-y', '-v', 'error', '-framerate', String(fps), '-i', `${dir}/%04d.png`, '-r', '24', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', salida]);
console.log('hecho', salida);
