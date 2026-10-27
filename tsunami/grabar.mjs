// Saca un MP4 1080×1920 de una página del tsunami, fotograma a fotograma, con el sonido mezclado por ffmpeg.
// Uso (desde la raíz del repo, con `python3 -m http.server 8765` en marcha):
//   node tsunami/grabar.mjs "tsunami/index.html?estilo=cine" out/tsunami-cine.mp4
// La página debe exponer window.__peli = { dur, fps, ir(t), sonidos: [{ src, t, gan, filtro }], listo }.
import { createRequire } from 'module';
const { chromium } = createRequire(import.meta.url)('playwright'); // el Playwright instalado en el sistema
import { spawn, execFileSync } from 'child_process';
import fs from 'fs'; import path from 'path';

const [pagina, salida, puerto = '8765'] = process.argv.slice(2);
if (!pagina || !salida) { console.log('uso: node tsunami/grabar.mjs "<página?params>" <salida.mp4>'); process.exit(1); }
const url = `http://localhost:${puerto}/${pagina}${pagina.includes('?') ? '&' : '?'}grabar=1`;
fs.mkdirSync(path.dirname(salida), { recursive: true });

// En el Mac: ANGLE sobre Metal con la gráfica dedicada (AMD Radeon Pro 5300M) → ~0,1 s/fotograma.
// Con GRABAR_CPU=1 usa SwiftShader (sin tarjeta gráfica, como en la nube: 3–7 s/fotograma).
const args = process.env.GRABAR_CPU ? ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist']
  : ['--use-angle=metal', '--force_high_performance_gpu', '--ignore-gpu-blocklist'];
const nav = await chromium.launch({ args });
const p = await nav.newPage({ viewport: { width: 1080, height: 1920 } });
p.on('pageerror', e => console.log('[error en la página]', e.message));
await p.goto(url);
await p.waitForFunction(() => window.__peli?.listo, null, { timeout: 300000 });
await p.evaluate(() => document.fonts.ready);
const gpu = await p.evaluate(() => { const gl = document.createElement('canvas').getContext('webgl2'); const e = gl.getExtension('WEBGL_debug_renderer_info'); return gl.getParameter(e.UNMASKED_RENDERER_WEBGL); });
console.log('gráfica:', gpu);
if (/SwiftShader/i.test(gpu) && !process.env.GRABAR_CPU) console.log('¡ojo! va por CPU (SwiftShader): será lento');
const { dur, fps, sonidos } = await p.evaluate(() => ({ dur: __peli.dur, fps: __peli.fps, sonidos: __peli.sonidos }));
const N = Math.round(dur * fps), mudo = salida.replace(/\.mp4$/, '.mudo.mp4');

// vídeo: cada captura va por una tubería a ffmpeg (jpeg de calidad alta → H.264)
const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', mudo], { stdio: ['pipe', 'inherit', 'inherit'] });
const t0 = Date.now();
for (let i = 0; i < N; i++) {
  await p.evaluate(t => __peli.ir(t), i / fps);
  const img = await p.locator('#stage').screenshot({ type: 'jpeg', quality: 95 });
  if (!ff.stdin.write(img)) await new Promise(ok => ff.stdin.once('drain', ok));
  if (i % 15 === 0) { const s = (Date.now() - t0) / 1000; console.log(`${i}/${N} · ${(s / (i + 1)).toFixed(1)} s/fotograma · quedan ${Math.round(s / (i + 1) * (N - i - 1) / 60)} min`); }
}
ff.stdin.end(); await new Promise(ok => ff.on('close', ok));
await nav.close();

// sonido: cada pista a su tiempo, con su ganancia y su filtro; se corta a la duración del vídeo
const dir = path.dirname(pagina.split('?')[0]);
const ent = [], fil = [];
sonidos.forEach((s, i) => { ent.push('-i', path.join(dir, s.src));
  fil.push(`[${i + 1}:a]aresample=48000,${s.filtro ? s.filtro + ',' : ''}volume=${s.gan},adelay=${Math.round(s.t * 1000)}|${Math.round(s.t * 1000)}[a${i}]`); });
const mezcla = `${fil.join(';')};${sonidos.map((_, i) => `[a${i}]`).join('')}amix=inputs=${sonidos.length}:normalize=0,alimiter=limit=0.95,atrim=0:${dur}[a]`;
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', mudo, ...ent, '-filter_complex', mezcla, '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', salida], { stdio: 'inherit' });
fs.unlinkSync(mudo);
console.log('listo:', salida, `(${Math.round((Date.now() - t0) / 60000)} min)`);
