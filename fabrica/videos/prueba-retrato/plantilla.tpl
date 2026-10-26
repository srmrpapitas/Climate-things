<!doctype html>
<html lang="es" data-resolution="landscape">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=1920, height=1080" />
<!-- Prueba: de la escena pintada al retrato a tinta (zoom + mancha de tinta), boca con la voz, tinta que vibra, y vuelta. -->
<script src="assets/gsap.min.js"></script>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1920px; height: 1080px; overflow: hidden; background: #1a120a; }
  #root { position: relative; width: 1920px; height: 1080px; overflow: hidden; background: #1a120a; }
  .capa { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; transform-origin: 0 0; }
  #ret { filter: url(#hervir) contrast(1.12) sepia(.25); }
  #ret img { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
  #luz { position: absolute; inset: 0; pointer-events: none; background: radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0) 35%, rgba(20,10,0,.75) 100%); }
  #mancha { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
</style>
</head>
<body>
<svg width="0" height="0" style="position:absolute"><filter id="hervir"><feTurbulence id="turb" type="fractalNoise" baseFrequency=".018" numOctaves="2" seed="1" /><feDisplacementMap in="SourceGraphic" scale="3.5" /></filter></svg>
<div id="root" data-composition-id="main" data-start="0" data-duration="12.6" data-width="1920" data-height="1080">
  <img id="esc" class="capa" src="assets/escena.jpg" alt="" />
  <div id="ret" class="capa" style="opacity:0"></div>
  <div id="luz"></div>
  <svg id="mancha" viewBox="0 0 1920 1080"><filter id="borde"><feTurbulence type="fractalNoise" baseFrequency=".012" numOctaves="3" seed="4" /><feDisplacementMap in="SourceGraphic" scale="140" /></filter><circle id="gota" cx="1000" cy="520" r="0" fill="#1d1209" filter="url(#borde)" /></svg>
  <audio id="voz" src="assets/voz.mp3" data-start="1.6" data-duration="9.0" data-volume="1"></audio>
  <audio id="w1" src="assets/whoosh.mp3" data-start="1.0" data-duration="1.2" data-volume="0.15"></audio>
  <audio id="w2" src="assets/whoosh.mp3" data-start="10.75" data-duration="1.2" data-volume="0.12"></audio>
  <audio id="imp" src="assets/impacto.mp3" data-start="1.35" data-duration="2" data-volume="0.12"></audio>
</div>
<script>
const BOCA = __BOCA__, $ = id => document.getElementById(id), cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), su = x => x * x * (3 - 2 * x), r = (t, a, b) => su(cl((t - a) / (b - a)));
// cada expresión: imagen, mandíbula (polígono en coordenadas 1280×720) y boca [cx, cy, ancho]; se ve en [ini, fin]
const EXPR = [
  { img: 'retrato.webp', ini: 0, fin: 4.8, mand: [[612,404],[770,402],[775,470],[760,510],[700,523],[640,515],[615,480]], boca: [693, 404, 42] },
  { img: 'ladino.webp', ini: 4.8, fin: 8.2, mand: [[620,404],[755,402],[765,460],[745,505],[690,516],[635,506],[615,460]], boca: [687, 404, 38] },
  { img: 'preocupado.webp', ini: 8.2, fin: 99, mand: [[638,421],[770,419],[778,480],[760,528],[705,540],[650,530],[632,480]], boca: [703, 421, 40] } ];
const K = 1.5, NSS = 'http://www.w3.org/2000/svg';
EXPR.forEach(e => { const g = document.createElement('div'); g.className = 'capa'; g.style.opacity = 0;
  g.innerHTML = `<img src="assets/${e.img}" style="position:absolute;left:0;top:0;width:1920px;height:1080px" />` +
    `<svg viewBox="0 0 1920 1080" style="position:absolute;left:0;top:0;width:1920px;height:1080px"><ellipse cx="${e.boca[0] * K}" cy="${e.boca[1] * K}" rx="${e.boca[2] * K}" ry="1" fill="#4a1d14" /></svg>` +
    `<img src="assets/${e.img}" style="position:absolute;left:0;top:0;width:1920px;height:1080px;clip-path:polygon(${e.mand.map(([x, y]) => `${x * K}px ${y * K}px`).join(',')})" />`;
  $('ret').appendChild(g); e.el = g; e.hueco = g.querySelector('ellipse'); e.mandEl = g.querySelectorAll('img')[1]; });
function pinta(t) {
  // 1 · escena pintada: la cámara entra hasta la cara de Feijolo
  const ze = 1 + 2.6 * r(t, .3, 1.5) + 2.4 * (1 - r(t, 4.7, 6.2)) * (t > 4.7 ? 1 : 0) * 0;
  const zin = t < 6 ? 1 + 2.6 * r(t, .3, 1.5) : 3.6 - 2.6 * r(t, 10.95, 12.3), fx = 1310, fy = 430;
  const ex = Math.min(0, Math.max(1920 - 1920 * zin, 960 - fx * zin)), ey = Math.min(0, Math.max(1080 - 1080 * zin, 540 - fy * zin));
  $('esc').style.transform = `translate(${ex}px, ${ey}px) scale(${zin})`;
  // 2 · el retrato: entra tras la mancha, empuja despacio y gira un poco
  const vis = t > 1.45 && t < 10.95; $('ret').style.opacity = vis ? 1 : 0;
  const z = 1.0 + .1 * r(t, 1.45, 10.95), rot = .6 * Math.sin(t * 1.3);
  $('ret').style.transform = `translate(${960 - 960 * z}px, ${520 - 520 * z}px) scale(${z}) rotate(${rot}deg)`;
  $('turb').setAttribute('seed', Math.floor(t * 12) % 7 + 1);        // la tinta «hierve» 12 veces por segundo
  const b = BOCA[Math.floor((t - 1.6) * 30)] || 0;
  EXPR.forEach(e => { const op = r(t, e.ini - .25, e.ini + .25) * (1 - r(t, e.fin - .25, e.fin + .25)) + (e.ini === 0 ? 1 - r(t, -1, 0) : 0);
    e.el.style.opacity = Math.min(1, e.ini === 0 ? 1 - r(t, e.fin - .25, e.fin + .25) : op);
    e.mandEl.style.transform = `translateY(${b * 13}px)`; e.hueco.setAttribute('ry', b * 7 + .5); e.hueco.setAttribute('cy', e.boca[1] * K - 1 + b * 7); });
  // mancha de tinta que cubre y destapa en los dos cortes
  const k = t < 6 ? (r(t, 1.15, 1.45) - r(t, 1.45, 1.8)) : (r(t, 10.65, 10.95) - r(t, 10.95, 11.3));
  $('gota').setAttribute('r', 1400 * su(cl(k)));
  $('luz').style.opacity = .55 + .2 * Math.sin(t * 4.1) * (vis ? 1 : 0);
}
const est = { t: 0 }, tl = gsap.timeline({ paused: true, onUpdate: () => pinta(est.t) });
tl.to(est, { t: 12.6, duration: 12.6, ease: 'none' }, 0);
window.__timelines = window.__timelines || {}; window.__timelines['main'] = tl; tl.seek(0); pinta(0);
</script>
</body>
</html>
