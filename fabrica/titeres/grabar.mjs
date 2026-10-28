// Graba una escena de títeres fotograma a fotograma (30 dibujos por segundo) y la pasa a MP4 1080p a 30 fps.
// Uso (desde la raíz del repo, con `python3 -m http.server 8765` en marcha):
//   node fabrica/titeres/grabar.mjs mitin out/mitin.mp4 [desde hasta]   (desde/hasta en segundos, para probar un trozo)
//   SOLO_AUDIO=1 node … : no dibuja; usa los fotogramas que ya hay en out/titeres_<escena> y solo rehace el sonido
import { chromium } from 'playwright';
import { mkdirSync, rmSync, writeFileSync, existsSync } from 'fs';
import { execFileSync } from 'child_process';
const [nombre = 'mitin', salida = `out/${nombre}.mp4`, desde, hasta] = process.argv.slice(2), dir = `out/titeres_${nombre}`;
const soloAudio = !!process.env.SOLO_AUDIO; if (!soloAudio) { rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true }); }
const nav = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu-rasterization', '--ignore-gpu-blocklist'] });
const pag = await nav.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
pag.on('pageerror', e => console.error('ERROR en la escena:', e.message));
await pag.goto(`http://localhost:8765/fabrica/titeres/escena.html?e=${nombre}`);
await pag.evaluate(async () => { window.grabando = true; await window.listo; });
const [dura, fps, voces0, silencios] = await pag.evaluate(() => [window.DURA, window.FPS, [...(window.ESCENA.voces || []), ...(window.ESCENA.sonidos || [])], window.ESCENA.silencios || []]);
const i0 = Math.round((+desde || 0) * fps), i1 = Math.round((+hasta || dura) * fps), t0 = Date.now();
for (let i = i0; i < i1 && !soloAudio; i++) {
  const png = await pag.evaluate(t => { window.dibuja(t); return document.getElementById('c').toDataURL('image/png').split(',')[1]; }, i / fps);
  writeFileSync(`${dir}/${String(i - i0).padStart(5, '0')}.png`, Buffer.from(png, 'base64'));   // el lienzo tal cual, a 1920×1080
}
await nav.close();
// voces y sonidos (efectos: { en, archivo, volumen }, sin subtítulo): cada archivo entra en su segundo (adelay); si aún no existe, el vídeo sale mudo con subtítulos
// ambiente: { en, hasta, archivo, volumen, bucle: true } se repite de en a hasta con fundidos; ESCENA.silencios: [[desde, hasta], …] lo apaga
// (solo al ambiente, la voz sigue) para la calma antes de un golpe
const voces = (await (async () => voces0)()).filter(v => v.archivo && existsSync(v.archivo) && (v.bucle ? (v.hasta ?? dura) > i0 / fps && v.en < i1 / fps : v.en >= i0 / fps && v.en < i1 / fps));
const entradas = voces.flatMap(v => v.bucle ? ['-stream_loop', '-1', '-i', v.archivo] : ['-i', v.archivo]);
const T0 = (i0 / fps).toFixed(3), calla = silencios.map(([a, b]) => `clip(min((t+${T0}-${a})/0.3\,(${b}-t-${T0})/0.3)\,0\,1)`).join('+');   // baja y sube en 0,3 s
const mezcla = voces.map((v, k) => {
  if (!v.bucle) return `[${k + 1}:a]adelay=${Math.round((v.en - i0 / fps) * 1000)}:all=1,volume=${v.volumen ?? 1}[a${k}]`;
  const ini = Math.max(v.en, i0 / fps), largo = Math.min(v.hasta ?? dura, i1 / fps) - ini;
  // para que el bucle no se note: empieza en un punto distinto cada vez, se le suma una copia desfasada un 7 % más lenta y el volumen ondula despacio
  const o1 = ((v.en * 7.31 + k * 3.7) % 9).toFixed(2), o2 = ((v.en * 3.13 + k * 5.3 + 4.5) % 9).toFixed(2), L = largo.toFixed(3);
  return `[${k + 1}:a]asplit=2[p${k}][q${k}];[p${k}]atrim=start=${o1}:duration=${L},asetpts=PTS-STARTPTS,volume=0.75[r${k}];` +
    `[q${k}]atempo=0.93,atrim=start=${o2}:duration=${L},asetpts=PTS-STARTPTS,volume=0.55[s${k}];` +
    `[r${k}][s${k}]amix=inputs=2:normalize=0,volume='0.8+0.2*sin(2*PI*t/7.3)+0.1*sin(2*PI*t/3.1)':eval=frame,afade=t=in:d=0.6,afade=t=out:st=${Math.max(0, largo - .8).toFixed(3)}:d=0.8,` +
    `adelay=${Math.round((ini - i0 / fps) * 1000)}:all=1,volume=${v.volumen ?? 1}${calla ? `,volume='1-0.96*(${calla})':eval=frame` : ''}[a${k}]`;
}).join(';');
const audio = voces.length ? ['-filter_complex', `${mezcla};${voces.map((_, k) => `[a${k}]`).join('')}amix=inputs=${voces.length}:normalize=0:duration=longest,atrim=0:${((i1 - i0) / fps).toFixed(3)}[a]`, '-map', '0:v', '-map', '[a]', '-c:a', 'aac', '-b:a', '192k'] : [];
execFileSync('ffmpeg', ['-y', '-v', 'error', '-framerate', String(fps), '-i', `${dir}/%05d.png`, ...entradas, ...audio, '-r', String(fps), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '17', '-t', String((i1 - i0) / fps), salida]);
console.log(`hecho ${salida}: ${i1 - i0} dibujos en ${((Date.now() - t0) / 1000).toFixed(0)} s`);
