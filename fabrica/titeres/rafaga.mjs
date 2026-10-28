// Dibuja la ráfaga de viento sola, sobre fondo transparente (PNG con alfa), para usarla entre secuencias al montar el capítulo.
// Uso (con `python3 -m http.server 8765` en marcha): node fabrica/titeres/rafaga.mjs out/rafaga   → out/rafaga/000.png … (0,9 s a 30 fps)
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'fs';
const dir = process.argv[2] || 'out/rafaga'; mkdirSync(dir, { recursive: true });
const nav = await chromium.launch(); const pag = await nav.newPage({ viewport: { width: 1280, height: 720 } });
await pag.goto('http://localhost:8765/fabrica/titeres/escena.html?e=outro');
await pag.evaluate(async () => { window.grabando = true; await window.listo; });
const n = 27;   // 0,9 s: la misma ráfaga que la transición `viento` de las escenas (frente = -500 + 2400·k)
for (let j = 0; j < n; j++) {
  const png = await pag.evaluate(([j, n]) => { const c = document.createElement('canvas'); c.width = 1920; c.height = 1080; const g = c.getContext('2d');
    g.setTransform(1.5, 0, 0, 1.5, 0, 0); const k = j / (n - 1); viento(g, j / 30, k, -500 + 2400 * k); return c.toDataURL('image/png').split(',')[1]; }, [j, n]);
  writeFileSync(`${dir}/${String(j).padStart(3, '0')}.png`, Buffer.from(png, 'base64'));
}
await nav.close(); console.log(`hecho ${dir}: ${n} fotogramas`);
