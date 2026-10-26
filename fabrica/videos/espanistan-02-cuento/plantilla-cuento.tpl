<!doctype html>
<html lang="es" data-resolution="landscape">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=1920, height=1080" />
<!-- Españistán ep. 2 · prueba de estilo «cuento ilustrado» (pauta: el Cuento de los tres hermanos).
     Un solo plano continuo sobre una página de pergamino: lo que narra el Decano se dibuja a pluma, coge color sepia y cobra vida.
     Fuente: index.src.html + trazos/boca en assets → index.html (se incrustan con el script de abajo del commit). -->
<script src="assets/gsap.min.js"></script>
<style>
  @font-face { font-family: 'Caveat'; font-weight: 600; src: url(assets/fuentes/caveat-600.woff2); }
  @font-face { font-family: 'Inter'; font-weight: 800; src: url(assets/fuentes/inter-latin-800-normal.woff2); }
  :root { --tinta: #2b1d10; --sepia: #6b4a2b; --rojo: #9e2b20; --azul: #284f86; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1920px; height: 1080px; overflow: hidden; background: #1a120a; }
  #root { position: relative; width: 1920px; height: 1080px; overflow: hidden; background: #1a120a; }
  #mundo { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; transform-origin: 0 0; }
  #mundo > * { position: absolute; }
  #pag { left: 0; top: 0; width: 1920px; height: 1080px; }
  #cuevaColor { left: 0; top: 0; width: 1920px; height: 1080px; }
  svg path { fill: none; stroke: var(--tinta); stroke-linecap: round; stroke-linejoin: round; }
  .fig { filter: sepia(.75) saturate(.8) contrast(1.05); }
  .silueta { filter: brightness(0) sepia(1) opacity(.82); }
  .mano { font: 600 64px/1.15 Caveat; color: var(--tinta); white-space: nowrap; }
  #luz { position: absolute; inset: 0; pointer-events: none; mix-blend-mode: soft-light; background: radial-gradient(ellipse at 55% 40%, rgba(255,214,150,.9) 0%, rgba(255,190,120,0) 60%); }
  #vineta { position: absolute; inset: 0; pointer-events: none; background: radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(30,15,5,.55) 100%); }
  #mancha { position: absolute; left: 960px; top: 540px; width: 10px; height: 10px; border-radius: 50%; background: #1d1309; transform: translate(-50%,-50%) scale(0); }
  #titulo { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; opacity: 0; }
  #titulo h1 { font: 600 190px Caveat; color: #e8c98a; } #titulo h2 { font: 600 70px Caveat; color: #f0e2c4; margin-top: -10px; }
  #sub { position: absolute; left: 200px; right: 200px; bottom: 60px; text-align: center; font: 800 52px Inter; color: #fff;
    -webkit-text-stroke: 9px rgba(20,10,0,.8); paint-order: stroke fill; line-height: 1.2; }
</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="37.5" data-width="1920" data-height="1080">
  <div id="mundo">
    <img id="pag" src="assets/pergamino.webp" alt="" />
    <svg id="cuevaT" viewBox="0 0 1280 720" style="left:0;top:0;width:1920px;height:1080px"></svg>
    <img id="cuevaColor" src="assets/cueva.webp" alt="" />
    <!-- el partido: siluetas pequeñas -->
    <div id="partido" style="left:560px;top:600px;width:820px;height:260px"></div>
    <!-- Feijolo -->
    <div id="feij" style="left:1240px;top:150px;width:400px;height:720px;transform-origin:200px 720px">
      <svg id="feijT" viewBox="0 0 400 720" style="position:absolute;left:0;top:0;width:400px;height:720px"></svg>
      <img id="feijF" class="fig" src="assets/feijolo_fig.png" alt="" style="position:absolute;left:0;top:0;width:400px;height:720px;opacity:0" />
      <video id="feijV" class="fig" src="assets/feijolo_gesto.webm" muted playsinline data-start="17.6" data-duration="12.3"
        style="position:absolute;left:-50px;top:-110px;width:500px;height:500px;opacity:0;transform:scale(1.62);transform-origin:250px 500px"></video>
    </div>
    <div id="nombre" class="mano" style="left:1310px;top:880px;font-size:84px;clip-path:inset(0 100% 0 0)">Feijolo</div>
    <div id="pp" class="mano" style="left:1680px;top:300px;font-size:96px;color:var(--azul);clip-path:inset(0 100% 0 0)">el PP</div>
    <svg id="ppC" viewBox="0 0 300 200" style="left:1640px;top:270px;width:300px;height:200px"><path d="M150 20 C 260 20 290 120 220 165 C 150 205 30 190 20 120 C 10 50 80 18 160 22" stroke="#284f86" stroke-width="6" /></svg>
    <!-- línea del tiempo a pincel -->
    <svg id="linea" viewBox="0 0 1100 160" style="left:430px;top:650px;width:1100px;height:160px"></svg>
    <!-- cita y reglas a mano -->
    <div id="cita" class="mano" style="left:560px;top:250px;line-height:1.25"><span id="c1" style="display:block;clip-path:inset(0 100% 0 0)">«Quien no recuerda su pasado</span><span id="c2" style="display:block;clip-path:inset(0 100% 0 0)">está condenado a repetirlo».</span><span id="c3" style="display:block;font-size:44px;color:var(--sepia);clip-path:inset(0 100% 0 0)">— George Santayana, 1905</span></div>
    <div id="reglas" class="mano" style="left:520px;top:300px;font-size:76px;line-height:1.55"></div>
    <!-- el Decano, narrador, retrato a pluma -->
    <div id="dec" style="left:90px;top:640px;width:270px;height:290px">
      <svg id="decT" viewBox="0 0 270 290" style="position:absolute;left:0;top:0;width:270px;height:290px"></svg>
      <img id="decF" class="fig" src="assets/decano.png" alt="" style="position:absolute;left:0;top:0;width:270px;height:290px;opacity:0" />
      <svg viewBox="0 0 270 290" style="position:absolute;left:0;top:0;width:270px;height:290px">
        <g id="decP" fill="#d9a07c" opacity="0"><ellipse cx="126" cy="142" rx="15" ry="15" /><ellipse cx="90" cy="157" rx="11" ry="11" /></g>
        <ellipse id="decB" cx="138" cy="203" rx="12" ry="1" fill="#3a1a12" style="fill:#3a1a12;stroke:none" />
      </svg>
    </div>
  </div>
  <div id="luz"></div>
  <div id="vineta"></div>
  <div id="mancha"></div>
  <div id="titulo"><h1>Españistán</h1><h2>Episodio 2 · Feijolo y el PP</h2></div>
  <div id="sub"></div>
  <audio id="voz1" src="assets/voz1.mp3" data-start="0.4" data-duration="5.26" data-volume="1"></audio>
  <audio id="voz2" src="assets/voz2.mp3" data-start="6.28" data-duration="10.22" data-volume="1"></audio>
  <audio id="voz3" src="assets/voz3.mp3" data-start="17.12" data-duration="9.02" data-volume="1"></audio>
  <audio id="voz4" src="assets/voz4.mp3" data-start="26.76" data-duration="6.38" data-volume="1"></audio>
  <audio id="fondo" src="assets/fondo.mp3" data-start="0" data-duration="37.45" data-volume="1"></audio>
</div>
<script>
const TR = __TRAZOS__, BOCA = __BOCA__;
const $ = id => document.getElementById(id), NS = 'http://www.w3.org/2000/svg';
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), su = x => x * x * (3 - 2 * x), r = (t, a, b) => su(cl((t - a) / (b - a)));
const FR = [[.4, 3.5, 'En el episodio anterior salimos de la cueva para mirar al que gobierna.'], [3.9, 5.9, 'Hoy miramos al que quiere gobernar.'],
  [6.3, 8.2, 'El filósofo George Santayana escribió'], [8.2, 12.2, 'que quien no recuerda su pasado está condenado a repetirlo.'],
  [12.4, 14.9, 'Por eso hoy no miramos solo a un hombre.'], [15.0, 16.8, 'Miramos a todo un partido.'],
  [17.1, 19.8, 'Este es Feijolo, el líder de la oposición.'], [19.9, 22.4, 'Y este es su partido, el PP,'],
  [22.5, 26.4, 'uno de los dos que se han turnado el poder en Españistán desde hace más de cuarenta años.'],
  [26.7, 28.6, 'Mismas reglas que con Sanchís:'], [28.6, 31.8, 'datos públicos, la palabra exacta de cada sentencia,'], [31.8, 33.4, 'y lo bueno también se cuenta.']];
// trazos → paths con su longitud (para dibujarlos poco a poco)
function pinta_trazos(svg, lista, grosor) { return lista.map(t => { const p = document.createElementNS(NS, 'path'); p.setAttribute('d', t.d); p.setAttribute('stroke-width', grosor);
  p.setAttribute('stroke-dasharray', t.l + ' ' + (t.l + 2)); p.setAttribute('stroke-dashoffset', t.l + 1); svg.appendChild(p); return [p, t.l]; }); }
const TC = pinta_trazos($('cuevaT'), TR.cueva, 1.6), TF = pinta_trazos($('feijT'), TR.feijolo, 2.2), TD = pinta_trazos($('decT'), TR.decano, 1.6);
function dibuja(lista, t, a, b) { const n = lista.length; lista.forEach(([p, l], i) => { const k = cl(((t - a) / (b - a)) * n * 1.15 - i * 1.0); p.setAttribute('stroke-dashoffset', (l + 1) * (1 - k)); }); }
// siluetas del partido
for (let i = 0; i < 9; i++) { const im = document.createElement('img'); im.src = 'assets/feijolo_fig.png'; im.className = 'silueta';
  Object.assign(im.style, { position: 'absolute', left: (i * 90) + 'px', top: (i % 2 ? 40 : 0) + 'px', height: (220 - (i % 3) * 20) + 'px', opacity: 0 }); $('partido').appendChild(im); }
// línea del tiempo a pincel
const LN = [['PSOE', 1982, 1996, '#9e2b20'], ['PP', 1996, 2004, '#284f86'], ['PSOE', 2004, 2011, '#9e2b20'], ['PP', 2011, 2018, '#284f86'], ['PSOE', 2018, 2026, '#9e2b20']];
const LP = LN.map(([n, a, b, c]) => { const x0 = 20 + (a - 1982) * 24, x1 = 20 + (b - 1982) * 24, p = document.createElementNS(NS, 'path');
  p.setAttribute('d', `M${x0} 60 C ${x0 + 30} 52, ${x1 - 30} 68, ${x1} 60`); p.setAttribute('stroke', c); p.setAttribute('stroke-width', 26); const L = x1 - x0 + 4;
  p.setAttribute('stroke-dasharray', L + ' ' + (L + 2)); p.setAttribute('stroke-dashoffset', L + 1); $('linea').appendChild(p);
  const tx = document.createElementNS(NS, 'text'); tx.setAttribute('x', (x0 + x1) / 2); tx.setAttribute('y', 118); tx.setAttribute('text-anchor', 'middle');
  tx.setAttribute('style', `font:600 34px Caveat;fill:${c};opacity:0`); tx.textContent = n; $('linea').appendChild(tx); return [p, L, tx]; });
['1982', '2026'].forEach((y, i) => { const tx = document.createElementNS(NS, 'text'); tx.setAttribute('x', i ? 1070 : 20); tx.setAttribute('y', 30); tx.setAttribute('text-anchor', i ? 'end' : 'start');
  tx.setAttribute('style', 'font:600 34px Caveat;fill:#2b1d10'); tx.textContent = y; tx.classList.add('anio'); $('linea').appendChild(tx); });
// reglas
const RG = [['Datos públicos', 28.6], ['La palabra exacta de cada sentencia', 29.8], ['Lo bueno también se cuenta', 31.9]];
RG.forEach(([t]) => { const d = document.createElement('div'); d.innerHTML = `<span class="chk" style="display:inline-block;width:70px;color:#9e2b20">✓</span><span class="txt">${t}</span>`; $('reglas').appendChild(d); });

const cam = (t) => {   // cámara continua: [x, y, zoom] a lo largo de la historia
  const K = [[0, 960, 540, 1.0], [2.6, 960, 540, 1.0], [5.4, 1180, 520, 1.12], [6.4, 900, 560, 1.0], [12.4, 960, 540, 1.04], [15.0, 960, 600, 1.08],
             [17.4, 1440, 480, 1.35], [21.0, 1500, 470, 1.3], [22.6, 990, 600, 1.0], [26.6, 960, 560, 1.02], [33.2, 960, 540, 1.08], [37.5, 960, 540, 1.12]];
  let i = 0; while (i < K.length - 2 && t > K[i + 1][0]) i++;
  const [t0, x0, y0, z0] = K[i], [t1, x1, y1, z1] = K[i + 1], k = su(cl((t - t0) / (t1 - t0)));
  return [x0 + (x1 - x0) * k, y0 + (y1 - y0) * k, z0 + (z1 - z0) * k];
};
function pinta(t) {
  const [x, y, z] = cam(t), tx = Math.min(0, Math.max(1920 - 1920 * z, 960 - x * z)), ty = Math.min(0, Math.max(1080 - 1080 * z, 540 - y * z));
  $('mundo').style.transform = `translate(${tx}px, ${ty}px) scale(${z})`;
  $('luz').style.opacity = .35 + .12 * Math.sin(t * 1.7) + .06 * Math.sin(t * 4.3);
  // 1 · la cueva en color se convierte en un dibujo a pluma sobre la página
  $('cuevaColor').style.opacity = 1 - r(t, 1.4, 2.8); $('cuevaColor').style.filter = `sepia(${r(t, .6, 1.6)}) blur(${4 * r(t, 1.4, 2.8)}px)`;
  dibuja(TC, t, 1.2, 1.25); $('cuevaT').style.opacity = .55 * (1 - r(t, 5.8, 7.0)); $('cuevaT').style.filter = `blur(${3 * r(t, 5.8, 7)}px)`;
  // Feijolo: se dibuja, coge color, cobra vida
  dibuja(TF, t, 3.3, 5.3); $('feijT').style.opacity = 1 - .7 * r(t, 6.0, 7.0);
  $('feijF').style.opacity = r(t, 5.0, 5.9) * (1 - r(t, 17.5, 17.7)) * (1 - .75 * r(t, 6.2, 7.0) * (1 - r(t, 16.6, 17.4)));
  $('feijV').style.opacity = r(t, 17.5, 17.7) * (1 - .8 * r(t, 26.6, 27.4));
  // el Decano se dibuja y habla
  dibuja(TD, t, 6.3, 7.6); $('decF').style.opacity = r(t, 7.3, 8.1); $('decT').style.opacity = 1 - .6 * r(t, 7.6, 8.4);
  const b = BOCA[Math.floor(t * 30)] || 0; $('decB').setAttribute('ry', (1 + 6 * b) * r(t, 7.6, 8)); $('decB').setAttribute('rx', 12 - 2 * b);
  $('decP').setAttribute('opacity', t > 8 && (t % 3.6) < .13 ? 1 : 0);
  // cita escrita a mano
  [['c1', 8.3, 10.0], ['c2', 10.0, 11.6], ['c3', 11.6, 12.4]].forEach(([id, a, e]) => $(id).style.clipPath = `inset(0 ${100 - 100 * r(t, a, e)}% 0 0)`);
  $('cita').style.opacity = 1 - r(t, 14.8, 15.6);
  // todo un partido: siluetas que aparecen
  [...$('partido').children].forEach((im, i) => im.style.opacity = r(t, 15.1 + i * .1, 15.5 + i * .1) * (1 - r(t, 16.8, 17.5)));
  $('nombre').style.clipPath = `inset(0 ${100 - 100 * r(t, 17.8, 19.0)}% 0 0)`; $('nombre').style.opacity = 1 - r(t, 26.4, 27.0);
  $('pp').style.clipPath = `inset(0 ${100 - 100 * r(t, 21.5, 22.3)}% 0 0)`; $('pp').style.opacity = 1 - r(t, 22.6, 23.2);
  const pc = $('ppC').querySelector('path'), L = 620; pc.setAttribute('stroke-dasharray', L + ' ' + L); pc.setAttribute('stroke-dashoffset', L * (1 - r(t, 21.7, 22.5))); $('ppC').style.opacity = 1 - r(t, 22.6, 23.2);
  LP.forEach(([p, Ln, tx], i) => { const a = 23.0 + i * .55; p.setAttribute('stroke-dashoffset', (Ln + 1) * (1 - r(t, a, a + .5))); tx.style.opacity = r(t, a + .3, a + .6); });
  $('linea').style.opacity = r(t, 22.8, 23.1) * (1 - r(t, 26.4, 27.0));
  // reglas a mano con su ✓
  [...$('reglas').children].forEach((d, i) => { const a = RG[i][1]; d.querySelector('.txt').style.clipPath = `inset(0 ${100 - 100 * r(t, a, a + 1.0)}% 0 0)`;
    d.querySelector('.chk').style.opacity = r(t, a + .9, a + 1.1); d.style.opacity = r(t, a - .1, a) * (1 - r(t, 33.2, 33.6)); });
  // mancha de tinta y título
  $('mancha').style.transform = `translate(-50%,-50%) scale(${400 * r(t, 33.3, 34.3)})`;
  $('titulo').style.opacity = r(t, 34.0, 34.8);
  const f = FR.find(f => t >= f[0] && t < f[1]), h = f ? f[2] : ''; if ($('sub').dataset.h !== h) { $('sub').textContent = h; $('sub').dataset.h = h; }
}
const est = { t: 0 }, tl = gsap.timeline({ paused: true, onUpdate: () => pinta(est.t) });
tl.to(est, { t: 37.5, duration: 37.5, ease: 'none' }, 0);
window.__timelines = window.__timelines || {}; window.__timelines['main'] = tl; tl.seek(0); pinta(0);
</script>
</body>
</html>
