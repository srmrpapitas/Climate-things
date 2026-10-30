// Sonidos: VIDEO.sonidos = [{ en, archivo, volumen, dura }] (dura corta el efecto con un fundido).
// Graba un vídeo explicado fotograma a fotograma (1080×1920, 30 fps) y le mezcla la voz y los sonidos.
// Uso (desde la raíz del repo, con `python3 -m http.server 8765` en marcha):
//   node fabrica/explicado/grabar.mjs SLUG out/SLUG.mp4 [desde hasta]
//   FOTOS=1.2,3.5,… node fabrica/explicado/grabar.mjs SLUG out/hoja.jpg   → solo una hoja de fotogramas en esos segundos
//   SOLO_MEZCLA=1 node …   → no dibuja: monta los fotogramas que ya hay en out/explicado_SLUG con la voz y los sonidos
import { chromium } from 'playwright';
import { mkdirSync, rmSync, writeFileSync, existsSync } from 'fs';
import { execFileSync } from 'child_process';
const [slug = 'ia-ciudades', salida = `out/${slug}.mp4`, desde, hasta] = process.argv.slice(2), dir = `out/explicado_${slug}`;
if (!process.env.SOLO_MEZCLA) { rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true }); }
const nav = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu-rasterization', '--ignore-gpu-blocklist'] });
const pag = await nav.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
pag.on('pageerror', e => console.error('ERROR en la escena:', e.message));
await pag.goto(`http://localhost:8765/fabrica/explicado/video.html?v=${slug}`);
await pag.evaluate(async () => { window.grabando = true; await window.listo; });
const [dura, fps, voces] = await pag.evaluate(() => [window.DURA, window.FPS,
  [...(TIEMPOS.audios || TIEMPOS.frases).map(f => ({ en: f.en, archivo: '../../' + f.archivo, voz: true })), ...(VIDEO.sonidos || [])]]);
const foto = async (t, f) => { const png = await pag.evaluate(t => { window.dibuja(t); return document.getElementById('c').toDataURL('image/png').split(',')[1]; }, t); writeFileSync(f, Buffer.from(png, 'base64')); };
if (process.env.FOTOS) {
  const ts = process.env.FOTOS.split(',').map(Number);
  for (const [i, t] of ts.entries()) await foto(t, `${dir}/${String(i).padStart(3, '0')}.png`);
  await nav.close();
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', `${dir}/%03d.png`, '-vf', `scale=360:-1,tile=${Math.min(6, ts.length)}x${Math.ceil(ts.length / 6)}`, '-frames:v', '1', salida]);
  console.log('hoja', salida); process.exit(0);
}
const i0 = Math.round((+desde || 0) * fps), i1 = Math.round((+hasta || dura) * fps), t0 = Date.now();
if (!process.env.SOLO_MEZCLA) for (let i = i0; i < i1; i++) await foto(i / fps, `${dir}/${String(i - i0).padStart(5, '0')}.png`);
await nav.close();
const base = 'fabrica/explicado/', vs = voces.map(v => ({ ...v, archivo: v.archivo.startsWith('../../') ? v.archivo.slice(6) : base + v.archivo }))
  .filter(v => existsSync(v.archivo) && v.en >= i0 / fps && v.en < i1 / fps);
const entradas = vs.flatMap(v => ['-i', v.archivo]);
// la voz manda: efectos y música bajan solos (sidechain) cuando habla Tony, como en EJEMPLO.md
const pista = (v, k) => `[${k + 1}:a]${v.dura ? `atrim=0:${v.dura},afade=t=out:st=${Math.max(0, v.dura - .35).toFixed(3)}:d=0.35,` : ''}adelay=${Math.round((v.en - i0 / fps) * 1000)}:all=1,volume=${v.volumen ?? 1}[a${k}]`;
const junta = (ks, et) => ks.length > 1 ? `${ks.map(k => `[a${k}]`).join('')}amix=inputs=${ks.length}:normalize=0:duration=longest[${et}]` : `[a${ks[0]}]anull[${et}]`;
const ks = vs.map((_, k) => k), kv = ks.filter(k => vs[k].voz), ke = ks.filter(k => !vs[k].voz), largo = ((i1 - i0) / fps).toFixed(3);
const audio = !vs.length ? [] : ['-filter_complex', vs.map(pista).join(';') + ';' + (kv.length && ke.length
  ? `${junta(kv, 'v0')};[v0]asplit[v][l0];[l0]apad[llave];${junta(ke, 'e0')};[e0][llave]sidechaincompress=threshold=0.01:ratio=10:attack=5:release=300[e];[v][e]amix=inputs=2:normalize=0:duration=longest,atrim=0:${largo}[a]`
  : `${junta(ks, 'm')};[m]atrim=0:${largo}[a]`), '-map', '0:v', '-map', '[a]', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2'];
execFileSync('ffmpeg', ['-y', '-v', 'error', '-framerate', String(fps), '-i', `${dir}/%05d.png`, ...entradas, ...audio, '-r', String(fps), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '17', '-t', String((i1 - i0) / fps), salida]);
console.log(`hecho ${salida}: ${i1 - i0} dibujos en ${((Date.now() - t0) / 1000).toFixed(0)} s`);
