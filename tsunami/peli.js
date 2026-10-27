// La película entera (≈70 s): elige la escena de cada tramo (tsunami/guion.js), pone los textos y el sonido.
// Vista previa: http://localhost:8765/tsunami/peli.html  (clic: pausa; ?t=30 empieza en el segundo 30)
// Render: node tsunami/grabar.mjs "tsunami/peli.html" out/tsunami.mp4
import { params, GRABAR, FPS, actual, pintar, grado, bloom, capa, hud, comic, subtitulo, lineas, cargarNico, clamp, smooth, easeOutBack, lerp } from './motor.js';
import { DUR, NARRADOR, BOMBO, TRAMOS, OLAS, sonidos } from './guion.js';

if (params.get('prueba') === 'boca') { const { prueba } = await import('./prueba-boca.js'); await prueba(); }
else {
  await cargarNico();
  const [cuarto, playa, ciudad] = await Promise.all(['cuarto', 'playa', 'ciudad'].map(n => import(`./escenas/${n}.js`).then(m => m.crear())));
  const escenas = { cuarto, playa, ciudad };
  let enEscena = null;
  const usar = e => { if (enEscena !== e) { e.preparar(); enEscena = e; } actual.scene = e.scene; };
  const flash = capa('flash'), negro = capa('negro'), fin = capa('final'), cierre = capa('cierre');

  function ir(t) {
    const tr = TRAMOS.find(x => t < x.t1) || TRAMOS[TRAMOS.length - 1];
    // el «bomboclat» que suena ahora (para la boca de Nico y el texto de cómic)
    const b = BOMBO.filter(x => t >= x.t - .05 && t < x.t + 2.4).pop();
    let reb = 0;
    if (tr.escena === 'cuarto') { usar(cuarto); cuarto.ir(t, tr.parte, b); }
    else if (tr.escena === 'rebobinado') { // el cuarto hacia atrás a toda velocidad, y la playa entra con un destello
      const d = t - tr.t0;
      if (d < 1.35) { usar(cuarto); cuarto.ir(Math.max(0, 6.25 - d * 4.4), 'despertar', null); }
      else { usar(playa); playa.ir(8.3 + (2 - d) * 1.5, null); }
      reb = 1 - smooth(1.75, 2, d);
    } else if (tr.escena === 'playa') { usar(playa); playa.ir(t, b); }
    else if (tr.escena === 'ciudad') { usar(ciudad); ciudad.ir(t, b); }
    else { usar(ciudad); ciudad.ir(60.44, null); }
    grado.uniforms.rebobina.value = reb;

    // capas: flash blanco en los cortes fuertes, negro al principio y al final
    const f = (a, d) => t > a && t < a + d ? 1 - (t - a) / d : 0;
    flash.style.opacity = Math.max(f(4.37, .12) * .9, f(7.62, .25), f(17.55, .1) * .9, f(24.15, .45), f(57.85, .1) * .8, t > 59.9 && t < 60.4 ? smooth(59.9, 60.2, t) : 0, f(60.4, .35));
    negro.style.opacity = t < .2 ? 1 - t / .2 : t >= 60.4 ? 1 : 0;
    // HUD de la ola
    const o = OLAS.find(x => t >= x.t && t < x.t1); hud(o?.n, o?.m, o?.linea, o ? t - o.t : null);
    // «bomboclat» de cómic
    if (b) comic(b.txt, t - b.t - .1, b.toma === 9 ? 2.3 : 1.8, { tam: b.bajito ? 1.05 : b.toma === 9 ? 1.25 : 1.35, top: b.bajito ? 60 : o ? 21 : 13, temblor: b.toma === 9 ? 3 : 1 }); else comic('', null, 0);
    // líneas de velocidad en los latigazos
    const kl = Math.max(...[4.37, 17.55, 57.85].map(a => t > a && t < a + .4 ? 1 - (t - a) / .4 : 0)); lineas(kl, t);
    // subtítulos del narrador
    const n = NARRADOR.find(x => t >= x.t && t < x.t + x.d + .15); subtitulo(n?.txt, n ? t - n.t : -1, n ? n.d + .15 : 0);
    capa('sub').style.bottom = tr.escena === 'final' ? '18%' : '13%';
    // el final: el dato de Lituya y la pregunta
    const df = t - 62.45; fin.style.opacity = df < 0 ? 0 : clamp(df / .15, 0, 1) * (1 - smooth(66.9, 67.2, t));
    fin.querySelector('.n').textContent = '524 m'; fin.querySelector('.l').textContent = t > 64.7 ? 'Bahía de Lituya · Alaska · 1958' : 'la ola más alta de la historia';
    fin.style.transform = `scale(${df < 0 ? 1 : .9 + easeOutBack(clamp(df / .4, 0, 1), 2) * .1 + df * .01})`;
    const dc = t - 67.25; cierre.textContent = '¿Qué duplicamos ahora? 👇'; cierre.style.opacity = dc < 0 ? 0 : clamp(dc / .2, 0, 1);
    cierre.style.transform = `scale(${dc < 0 ? 1 : easeOutBack(clamp(dc / .35, 0, 1), 2.5)})`;
    pintar(t);
  }

  document.getElementById('carga')?.remove();
  for (const t of [0.5, 9, 40, 58]) ir(t);   // calentamiento: compila los shaders de cada escena
  ir(0);
  window.__peli = { dur: DUR, fps: FPS, ir, sonidos: sonidos(), listo: true };
  if (!GRABAR) { // vista previa a tiempo real (clic: pausa)
    let t0 = performance.now() - (+params.get('t') || 0) * 1000, parado = false, tp = 0;
    addEventListener('click', () => { parado = !parado; if (!parado) t0 = performance.now() - tp * 1000; });
    const bucle = () => { if (!parado) { tp = ((performance.now() - t0) / 1000) % DUR; ir(tp); } requestAnimationFrame(bucle); }; bucle();
  }
}
