// Hoja de capturas para revisar: node tsunami/capturas.mjs "<página?params>" <salida.jpg> <expr JS por captura>...
// Cada expresión se evalúa en la página (p. ej. "__peli.ir(12.5)" o "__prueba(.8, 0)") y se captura #stage a 360 px de ancho.
import { createRequire } from 'module';
const { chromium } = createRequire(import.meta.url)('playwright');
import { execFileSync } from 'child_process'; import fs from 'fs'; import os from 'os'; import path from 'path';
const [pagina, salida, ...exprs] = process.argv.slice(2);
const nav = await chromium.launch({ args: ['--use-angle=metal', '--force_high_performance_gpu', '--ignore-gpu-blocklist'] });
const p = await nav.newPage({ viewport: { width: 1080, height: 1920 } });
p.on('pageerror', e => console.log('[error en la página]', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('[consola]', m.text()); });
await p.goto(`http://localhost:8765/${pagina}${pagina.includes('?') ? '&' : '?'}grabar=1`);
await p.waitForFunction(() => window.__peli?.listo, null, { timeout: 120000 });
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cap-')), fotos = [];
for (const [i, e] of exprs.entries()) { await p.evaluate(e); const f = path.join(dir, `${i}.jpg`); await p.locator('#stage').screenshot({ path: f, type: 'jpeg', quality: 85 }); fotos.push(f); }
await nav.close();
const cols = Math.min(fotos.length, 6);
execFileSync('ffmpeg', ['-v', 'error', '-y', ...fotos.flatMap(f => ['-i', f]), '-filter_complex',
  fotos.map((_, i) => `[${i}]scale=360:-1[s${i}]`).join(';') + ';' + fotos.map((_, i) => `[s${i}]`).join('') + `xstack=inputs=${fotos.length}:layout=` +
  fotos.map((_, i) => `${(i % cols) ? Array.from({ length: i % cols }, () => 'w0').join('+') : '0'}_${Math.floor(i / cols) ? Array.from({ length: Math.floor(i / cols) }, () => 'h0').join('+') : '0'}`).join('|') + (fotos.length === 1 ? '' : ''), salida]);
console.log('hoja:', salida);
