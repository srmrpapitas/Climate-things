// Duración (window.DURA) y voces de cada escena, sin grabar: para sacar shorts de un capítulo cuyos MP4 de escena ya se borraron.
// Uso (con `python3 -m http.server 8765` en marcha): node fabrica/titeres/duraciones.mjs 05-resta 05-madrid … > out/duraciones-05.json
import { chromium } from 'playwright';
const nav = await chromium.launch(), pag = await nav.newPage({ viewport: { width: 1280, height: 720 } }), out = {};
for (const e of process.argv.slice(2)) {
  await pag.goto(`http://localhost:8765/fabrica/titeres/escena.html?e=${e}`);
  await pag.evaluate(async () => { await window.listo; });
  out[e] = await pag.evaluate(() => ({ dura: window.DURA, fps: window.FPS, voces: (window.ESCENA.voces || []).map(v => ({ en: v.en, dura: v.dura, quien: v.quien, texto: v.texto, archivo: v.archivo })) }));
}
console.log(JSON.stringify(out)); await nav.close();
