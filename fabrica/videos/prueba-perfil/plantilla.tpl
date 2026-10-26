<!doctype html>
<html lang="es" data-resolution="landscape">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=1920, height=1080" />
<!-- Prueba: teatro de sombras con marionetas que actúan lo que se dice (brazos, cabezas que asienten o niegan, zooms)
     alternado con primeros planos de perfil a lápiz (bandas negras), un plano por frase, izquierda/derecha, voz propia de Feijolo. -->
<script src="assets/gsap.min.js"></script>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1920px; height: 1080px; overflow: hidden; background: #000; }
  #root { position: relative; width: 1920px; height: 1080px; overflow: hidden; background: #000; }
  #teatro { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; transform-origin: 0 0; overflow: hidden; }
  #teatro img, #teatro div { position: absolute; }
  #candil { inset: 0; background: radial-gradient(ellipse at 40% 45%, rgba(255,190,90,.35), rgba(255,170,60,0) 60%); mix-blend-mode: screen; }
  #vin { inset: 0; background: radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0) 55%, rgba(15,6,0,.8) 100%); }
  .plano { position: absolute; left: 0; top: 50%; width: 1920px; height: 920px; margin-top: -460px; overflow: hidden; opacity: 0; background: #eceae4; }
  .cara { position: absolute; inset: 0; transform-origin: 50% 50%; filter: url(#hervir) contrast(1.06) sepia(.12); }
  .cara img { position: absolute; left: 0; top: 0; width: 1920px; }
  .banda { position: absolute; left: 0; width: 1920px; height: 82px; background: #000; z-index: 5; opacity: 0; }
  #cortina { position: absolute; inset: 0; background: #000; opacity: 0; z-index: 6; }
</style>
</head>
<body>
<svg width="0" height="0" style="position:absolute"><filter id="hervir"><feTurbulence id="turb" type="fractalNoise" baseFrequency=".02" numOctaves="2" seed="1" /><feDisplacementMap in="SourceGraphic" scale="2.2" /></filter></svg>
<div id="root" data-composition-id="main" data-start="0" data-duration="20" data-width="1920" data-height="1080">
  <div id="teatro"><img src="assets/fondo.jpg" alt="" style="left:0;top:0" /></div>
  <div id="a" class="plano"><div class="cara"><img src="assets/p1_cerrada.webp" alt="" /><img class="ab" src="assets/p1_abierta.webp" alt="" style="opacity:0" /></div></div>
  <div id="b" class="plano"><div class="cara"><img src="assets/p2_cerrada.webp" alt="" /><img class="ab" src="assets/p2_abierta.webp" alt="" style="opacity:0" /></div></div>
  <div class="banda" style="top:0"></div><div class="banda" style="bottom:0"></div>
  <div id="cortina"></div>
  <audio id="voz" src="assets/voz.mp3" data-start="1.0" data-duration="16.2" data-volume="1"></audio>
  <audio id="w1" src="assets/whoosh.mp3" data-start="2.7" data-duration="1.2" data-volume="0.06"></audio>
</div>
<script>
const BOCA = __BOCA__, CAJAS = __PIEZAS__, VOZ = 1.0, $ = id => document.getElementById(id);
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), su = x => x * x * (3 - 2 * x), r = (t, a, b) => su(cl((t - a) / (b - a))), ven = (t, a, b, f = .3) => r(t, a, a + f) * (1 - r(t, b - f, b));
// ---- marionetas: cada pieza sale de piezas.json (sombras.py); pivote = punto de giro en coordenadas de la escena ----
const E = {};
function pieza(n, pivote, padre) {
  const [x, y, w, h] = CAJAS[n], [ox, oy] = padre ? CAJAS[padre.dataset.n] || padre._caja : [0, 0];
  const el = document.createElement('img'); el.src = `assets/${n}.png`; el.alt = '';
  Object.assign(el.style, { left: `${x - ox}px`, top: `${y - oy}px`, transformOrigin: pivote ? `${pivote[0] - x}px ${pivote[1] - y}px` : '50% 100%' });
  (padre || $('teatro')).appendChild(el); return E[n] = el;
}
function grupo(n, caja, pivote) {     // contenedor para que cabeza y brazo sigan al cuerpo
  const g = document.createElement('div'); g._caja = caja;
  Object.assign(g.style, { left: `${caja[0]}px`, top: `${caja[1]}px`, width: `${caja[2]}px`, height: `${caja[3]}px`, transformOrigin: `${pivote[0] - caja[0]}px ${pivote[1] - caja[1]}px` });
  $('teatro').appendChild(g); return E[n] = g;
}
const dec = grupo('dec', [48, 384, 702, 637], [300, 1015]);
pieza('dbaston', [223, 673], dec); pieza('decano', null, dec); pieza('dbaston2', [393, 693], dec);
pieza('dcabeza', [490, 580], dec); pieza('dantebrazo', [497, 650], dec);
const CAB1 = Object.keys(CAJAS).filter(k => k.startsWith('cab1_')), CAB2 = Object.keys(CAJAS).filter(k => k.startsWith('cab2_'));
const p1 = grupo('p1', [758, 720, 346, 303], [930, 1020]); pieza('publico1', null, p1); CAB1.forEach(k => pieza(k, null, p1));
const fei = grupo('fei', [1027, 344, 320, 347], [1140, 690]);
pieza('brazo', [1200, 523], fei); pieza('feijolo', null, fei); pieza('fcabeza', [1125, 505], fei);
pieza('podio');
const p2 = grupo('p2', [1532, 720, 369, 303], [1716, 1020]); pieza('publico2', null, p2); CAB2.forEach(k => pieza(k, null, p2));
const ICON = Object.keys(CAJAS).filter(k => k.startsWith('iconos_')); ICON.forEach(k => pieza(k, null));
['candil', 'vin'].forEach(id => { const d = document.createElement('div'); d.id = id; $('teatro').appendChild(d); });

// ---- guion de planos: teatro (T) o primer plano (a/b), alternando izquierda/derecha; una frase, un plano ----
const PLANOS = [{ t: 'T', ini: 0, fin: 3.0 }, { t: 'a', ini: 3.0, fin: 5.65, lado: 1, z: [1.0, 1.05], y: 0 },
  { t: 'T', ini: 5.65, fin: 8.6 }, { t: 'b', ini: 8.6, fin: 11.8, lado: -1, z: [1.04, 1.1], y: -10 },
  { t: 'a', ini: 11.8, fin: 15.3, lado: 1, z: [1.22, 1.3], y: 40 }, { t: 'T', ini: 15.3, fin: 20 }];
const HABLA = [[0.92, 1.56], [2.06, 7.02], [7.8, 10.38], [11.0, 13.88], [14.44, 16.14]];   // tramos con voz (Whisper)
// cámara del teatro por toma: [zoom, foco x, foco y] interpolados
function camara(t) {
  const L = (a, b, k) => a.map((v, i) => v + (b[i] - v) * k);
  if (t < 3.0) return L([1, 960, 540], [1.9, 1150, 470], r(t, 2.2, 3.0));                     // entra en Feijolo
  if (t < 8.6) return L([1.7, 930, 800], [1.3, 1120, 560], r(t, 5.8, 8.5));                    // del público que asiente a Feijolo
  return L(L([2.1, 470, 560], [2.1, 520, 520], r(t, 15.3, 17.4)), [1, 960, 540], r(t, 17.6, 19.4));   // el Decano niega; abre a general
}
function pinta(t) {
  $('turb').setAttribute('seed', Math.floor(t * 12) % 7 + 1);
  const ta = t - VOZ, habla = HABLA.some(([a, e]) => ta >= a && ta <= e), b = habla ? BOCA[Math.floor(ta * 30)] || 0 : 0;
  const pl = PLANOS.find(p => t >= p.ini && t < p.fin) || PLANOS[PLANOS.length - 1], teatro = pl.t === 'T';
  // ---- acciones (lo que cuenta la voz) ----
  const brazoArriba = r(t, 1.3, 2.1) * (1 - r(t, 2.9, 3.5)) + r(t, 5.8, 6.7) * (1 - r(t, 8.2, 9.0));    // «¡Españistaníes!» / «os daré una casa»
  const asienten = ven(t, 1.6, 3.2, .5) + ven(t, 5.7, 8.8, .6);                                              // el público asiente, embobado
  const niega = ven(t, 15.4, 17.6, .6), lupa = r(t, 15.3, 16.4) * (1 - r(t, 18.0, 19.2));                    // el Decano niega y alza la lupa
  // todo con senos lentos y envolventes suaves (sin tirones): cada articulación sigue a la anterior con un pequeño retraso
  const paso = Math.sin(t * 1.6);                                                                  // el anciano «camina» apoyando los bastones
  E.dec.style.transform = `rotate(${.5 * paso + 1 * lupa}deg) translateY(${3 * Math.abs(paso)}px)`;
  E.dcabeza.style.transform = `rotate(${niega * 6 * Math.sin(t * 4.2) + 1.5 * Math.sin(t * 1.3 - .4) + 4 * lupa}deg)`;
  E.dantebrazo.style.transform = `rotate(${-14 * lupa + 4 * Math.sin(t * 1.2 - .6) + 2 * niega * Math.sin(t * 4.2 - .5)}deg)`;   // alza la lupa hacia Feijolo
  E.dbaston.style.transform = `rotate(${2.5 * Math.sin(t * 1.6 - .8)}deg)`;
  E.dbaston2.style.transform = `rotate(${-2.5 * Math.sin(t * 1.6 + .6)}deg)`;
  E.fei.style.transform = `rotate(${1.2 * Math.sin(t * 1.1 + 1) + 1.5 * brazoArriba}deg) translateY(${2 * Math.sin(t * 2.2)}px)`;
  E.brazo.style.transform = `rotate(${-18 + 24 * brazoArriba + 4 * Math.sin(t * 2.0 - .5)}deg)`;
  E.fcabeza.style.transform = `rotate(${-3 * brazoArriba + (habla ? 2 * Math.sin(t * 3.4) : 0)}deg)`;
  [[CAB1, 0], [CAB2, 1.7]].forEach(([cabs, f]) => cabs.forEach((k, i) =>
    E[k].style.transform = `rotate(${asienten * 7 * (.5 + .5 * Math.sin(t * 3.6 + i * 1.1 + f)) + 1.2 * Math.sin(t * 1.2 + i)}deg)`));
  E.p1.style.transform = `translateY(${-3 * (.5 + .5 * Math.sin(t * 2.4)) * (.3 + asienten)}px)`;
  E.p2.style.transform = `translateY(${-3 * (.5 + .5 * Math.sin(t * 2.2 + 1.3)) * (.3 + asienten)}px)`;
  const casa = r(t, 6.7, 7.2), humo = r(t, 15.6, 18.5);                                             // las casas crecen… y se las lleva el humo
  ICON.forEach((k, i) => { const big = CAJAS[k][2] > 60;
    E[k].style.transform = `translateY(${-12 * Math.sin(t * .9 + i) - 160 * humo * (1 + i % 3 * .4)}px) rotate(${2 * Math.sin(t * .7 + i)}deg) scale(${1 + (big ? .18 * casa : 0)})`;
    E[k].style.opacity = (.8 + .2 * Math.sin(t * 1.7 + i)) * (1 - humo); });
  $('candil').style.opacity = .7 + .2 * Math.sin(t * 5.3) + .1 * Math.sin(t * 9.1);
  const [z, fx, fy] = camara(t), ex = Math.min(0, Math.max(1920 - 1920 * z, 960 - fx * z)), ey = Math.min(0, Math.max(1080 - 1080 * z, 540 - fy * z));
  $('teatro').style.transform = `translate(${ex}px, ${ey}px) scale(${z})`;
  // ---- primeros planos ----
  ['a', 'b'].forEach(id => $(id).style.opacity = 0);
  if (!teatro) { const k = r(t, pl.ini, pl.fin), el = $(pl.t); el.style.opacity = 1; el.querySelector('.ab').style.opacity = cl((b - .25) / .2);
    el.querySelector('.cara').style.transform = `scaleX(${pl.lado}) translateY(${pl.y * k}px) scale(${pl.z[0] + (pl.z[1] - pl.z[0]) * k})`; }
  document.querySelectorAll('.banda').forEach(e => e.style.opacity = teatro ? 0 : 1);
  $('cortina').style.opacity = cl((r(t, 2.85, 3.0) - r(t, 3.0, 3.15)) + r(t, 19.5, 20));
}
const est = { t: 0 }, tl = gsap.timeline({ paused: true, onUpdate: () => pinta(est.t) });
tl.to(est, { t: 20, duration: 20, ease: 'none' }, 0);
window.__timelines = window.__timelines || {}; window.__timelines['main'] = tl; tl.seek(0); pinta(0);
</script>
</body>
</html>
