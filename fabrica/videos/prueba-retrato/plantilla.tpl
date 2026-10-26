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
  #mand { clip-path: polygon(918px 606px, 1155px 603px, 1163px 705px, 1140px 765px, 1050px 785px, 960px 773px, 922px 720px); }
  #luz { position: absolute; inset: 0; pointer-events: none; background: radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0) 35%, rgba(20,10,0,.75) 100%); }
  #mancha { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
</style>
</head>
<body>
<svg width="0" height="0" style="position:absolute"><filter id="hervir"><feTurbulence id="turb" type="fractalNoise" baseFrequency=".018" numOctaves="2" seed="1" /><feDisplacementMap in="SourceGraphic" scale="3.5" /></filter></svg>
<div id="root" data-composition-id="main" data-start="0" data-duration="6.4" data-width="1920" data-height="1080">
  <img id="esc" class="capa" src="assets/escena.jpg" alt="" />
  <div id="ret" class="capa" style="opacity:0">
    <img src="assets/retrato.webp" alt="" />
    <svg viewBox="0 0 1920 1080" style="position:absolute;left:0;top:0;width:1920px;height:1080px"><ellipse id="hueco" cx="1040" cy="606" rx="62" ry="1" fill="#4a1d14" /></svg>
    <img id="mand" src="assets/retrato.webp" alt="" />
  </div>
  <div id="luz"></div>
  <svg id="mancha" viewBox="0 0 1920 1080"><filter id="borde"><feTurbulence type="fractalNoise" baseFrequency=".012" numOctaves="3" seed="4" /><feDisplacementMap in="SourceGraphic" scale="140" /></filter><circle id="gota" cx="1000" cy="520" r="0" fill="#1d1209" filter="url(#borde)" /></svg>
  <audio id="voz" src="assets/voz.mp3" data-start="1.6" data-duration="2.74" data-volume="1"></audio>
  <audio id="w1" src="assets/whoosh.mp3" data-start="1.0" data-duration="1.2" data-volume="0.4"></audio>
  <audio id="w2" src="assets/whoosh.mp3" data-start="4.55" data-duration="1.2" data-volume="0.35"></audio>
  <audio id="imp" src="assets/impacto.mp3" data-start="1.35" data-duration="2" data-volume="0.35"></audio>
</div>
<script>
const BOCA = __BOCA__, $ = id => document.getElementById(id), cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), su = x => x * x * (3 - 2 * x), r = (t, a, b) => su(cl((t - a) / (b - a)));
function pinta(t) {
  // 1 · escena pintada: la cámara entra hasta la cara de Feijolo
  const ze = 1 + 2.6 * r(t, .3, 1.5) + 2.4 * (1 - r(t, 4.7, 6.2)) * (t > 4.7 ? 1 : 0) * 0;
  const zin = t < 3 ? 1 + 2.6 * r(t, .3, 1.5) : 3.6 - 2.6 * r(t, 4.75, 6.0), fx = 1310, fy = 430;
  const ex = Math.min(0, Math.max(1920 - 1920 * zin, 960 - fx * zin)), ey = Math.min(0, Math.max(1080 - 1080 * zin, 540 - fy * zin));
  $('esc').style.transform = `translate(${ex}px, ${ey}px) scale(${zin})`;
  // 2 · el retrato: entra tras la mancha, empuja despacio y gira un poco
  const vis = t > 1.45 && t < 4.75; $('ret').style.opacity = vis ? 1 : 0;
  const z = 1.0 + .07 * r(t, 1.45, 4.75), rot = .6 * Math.sin(t * 1.3);
  $('ret').style.transform = `translate(${960 - 960 * z}px, ${520 - 520 * z}px) scale(${z}) rotate(${rot}deg)`;
  $('turb').setAttribute('seed', Math.floor(t * 12) % 7 + 1);        // la tinta «hierve» 12 veces por segundo
  const b = BOCA[Math.floor((t - 1.6) * 30)] || 0;
  $('mand').style.transform = `translateY(${b * 13}px)`; $('hueco').setAttribute('ry', b * 7 + .5); $('hueco').setAttribute('cy', 605 + b * 7);
  // mancha de tinta que cubre y destapa en los dos cortes
  const k = t < 3 ? (r(t, 1.15, 1.45) - r(t, 1.45, 1.8)) : (r(t, 4.45, 4.75) - r(t, 4.75, 5.1));
  $('gota').setAttribute('r', 1400 * su(cl(k)));
  $('luz').style.opacity = .55 + .2 * Math.sin(t * 4.1) * (vis ? 1 : 0);
}
const est = { t: 0 }, tl = gsap.timeline({ paused: true, onUpdate: () => pinta(est.t) });
tl.to(est, { t: 6.4, duration: 6.4, ease: 'none' }, 0);
window.__timelines = window.__timelines || {}; window.__timelines['main'] = tl; tl.seek(0); pinta(0);
</script>
</body>
</html>
