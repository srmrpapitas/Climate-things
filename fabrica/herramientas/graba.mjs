// Graba una página Three.js fotograma a fotograma con la GPU (Chrome + Metal, ≈ 0,2 s por fotograma) y la monta con su audio.
// Uso: node fabrica/herramientas/graba.mjs <ruta.html> <salida.mp4> <segundos> <audio> [t1,t2… solo esas fotos]
//   - servidor en :8765; la página expone window.listo y window.dibuja(t)
//   - los fotogramas van a <salida>.fotos/ y se saltan los que ya existen: si se corta, se relanza igual y sigue
//   - con una lista de segundos solo saca esas fotos (para revisar) en <salida>.fotos/prueba-<t>.jpg
//   - en CPU (swiftshader) la escena del SCD no llegó a cargar en 10 min: por eso la GPU
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readdirSync, rmSync } from 'fs';
import { execFileSync } from 'child_process';
const [url, sal, seg, audio, prueba] = process.argv.slice(2);
const FPS = 30, n = Math.round(+seg * FPS), dir = sal + '.fotos', t0 = Date.now(), reloj = () => ((Date.now() - t0) / 1000).toFixed(0) + ' s';
mkdirSync(dir, { recursive: true });
const foto = i => `${dir}/${String(i).padStart(5, '0')}.jpg`;
const tareas = prueba ? prueba.split(',').map(t => [+t, `${dir}/prueba-${t}.jpg`]) : [...Array(n).keys()].filter(i => !existsSync(foto(i))).map(i => [i / FPS, foto(i)]);
if (tareas.length) {
  const nav = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
  const p = await nav.newPage({ viewport: { width: 540, height: 960 } });
  p.on('pageerror', e => console.error('ERROR:', e.message));
  await p.goto(`http://localhost:8765/${url}`);
  await p.waitForFunction(() => window.listo, null, { timeout: 300000, polling: 2000 });  // sondeo cada 2 s: con 'raf' se queda colgado
  console.log('página lista', reloj());
  for (const [j, [t, f]] of tareas.entries()) {
    await p.evaluate(t => window.dibuja(t), t);
    await p.screenshot({ path: f, type: 'jpeg', quality: 94 });
    if (j % 150 === 149) console.log(`${j + 1}/${tareas.length} fotogramas`, reloj());
  }
  await nav.close();
}
if (prueba) { console.log('fotos de prueba en', dir); process.exit(0); }
execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', String(FPS), '-i', `${dir}/%05d.jpg`, '-i', audio,
  '-vf', 'scale=1080:1920:flags=lanczos,format=yuv420p', '-c:v', 'libx264', '-crf', '17', '-preset', 'slow',
  '-c:a', 'aac', '-b:a', '256k', '-shortest', '-movflags', '+faststart', sal], { stdio: 'inherit' });
console.log('listo:', sal, reloj());
if (readdirSync(dir).length) rmSync(dir, { recursive: true });
