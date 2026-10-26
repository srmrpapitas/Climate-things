<!doctype html>
<html lang="es" data-resolution="landscape">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=1920, height=1080" />
<!-- Prueba: primeros planos estilo Tarantino (de la nariz para abajo) que hablan alternando boca cerrada/abierta. -->
<script src="assets/gsap.min.js"></script>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1920px; height: 1080px; overflow: hidden; background: #1a120a; }
  #root { position: relative; width: 1920px; height: 1080px; overflow: hidden; background: #1a120a; }
  .plano { position: absolute; inset: 0; transform-origin: 50% 50%; filter: url(#hervir) contrast(1.1) sepia(.2); opacity: 0; }
  .plano img { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
  #vin { position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(20,10,0,.7) 100%); }
  #cortina { position: absolute; inset: 0; background: #1d1209; opacity: 0; }
</style>
</head>
<body>
<svg width="0" height="0" style="position:absolute"><filter id="hervir"><feTurbulence id="turb" type="fractalNoise" baseFrequency=".02" numOctaves="2" seed="1" /><feDisplacementMap in="SourceGraphic" scale="3" /></filter></svg>
<div id="root" data-composition-id="main" data-start="0" data-duration="10.2" data-width="1920" data-height="1080">
  <div id="p1" class="plano"><img src="assets/perfil_cerrada.webp" alt="" /><img class="ab" src="assets/perfil_abierta.webp" alt="" style="opacity:0" /></div>
  <div id="p2" class="plano"><img src="assets/bajo_cerrada.webp" alt="" /><img class="ab" src="assets/bajo_abierta.webp" alt="" style="opacity:0" /></div>
  <div id="vin"></div><div id="cortina"></div>
  <audio id="voz" src="assets/voz.mp3" data-start="0.6" data-duration="9.0" data-volume="1"></audio>
  <audio id="w" src="assets/whoosh.mp3" data-start="4.55" data-duration="1.2" data-volume="0.1"></audio>
</div>
<script>
const BOCA = __BOCA__, $ = id => document.getElementById(id), cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), su = x => x * x * (3 - 2 * x), r = (t, a, b) => su(cl((t - a) / (b - a)));
const P = [[$('p1'), 0, 4.75, [1.0, 1.12], [0, -25]], [$('p2'), 4.75, 10.2, [1.05, 1.16], [20, 10]]];
function pinta(t) {
  $('turb').setAttribute('seed', Math.floor(t * 12) % 7 + 1);
  const b = BOCA[Math.floor((t - .6) * 30)] || 0, ab = cl((b - .25) / .2);          // abre la boca con la voz
  P.forEach(([el, a, e, [z0, z1], [dx, dy]]) => { const vis = t >= a && t < e, k = r(t, a, e);
    el.style.opacity = vis ? 1 : 0; el.querySelector('.ab').style.opacity = ab;
    el.style.transform = `translate(${dx * k}px, ${dy * k}px) scale(${z0 + (z1 - z0) * k})`; });
  $('cortina').style.opacity = 1 - r(t, 0, .5) + (r(t, 4.45, 4.75) - r(t, 4.75, 5.05)) + r(t, 9.7, 10.2);
}
const est = { t: 0 }, tl = gsap.timeline({ paused: true, onUpdate: () => pinta(est.t) });
tl.to(est, { t: 10.2, duration: 10.2, ease: 'none' }, 0);
window.__timelines = window.__timelines || {}; window.__timelines['main'] = tl; tl.seek(0); pinta(0);
</script>
</body>
</html>
