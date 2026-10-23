# Si se duplica

Simulador cinemático low poly para vídeos verticales de Instagram (@siseduplica): un fenómeno que duplica su intensidad en cada fase hasta que no queda nada. Primer escenario: **la ola que se duplica** (20 m → 10.240 m) sobre una ciudad costera.

## Cómo se usa

- Abre `index.html` desde un servidor (Cloudflare Pages, o `python3 -m http.server` en local).
- **Play** muestra la pregunta sobre la ciudad tranquila. **Clic** o **espacio** lanza la siguiente fase.
- **A**: modo auto (las fases avanzan solas). **H**: oculta la ayuda y el cursor. **R**: reinicia.
- La imagen va en 9:16. Añade `?full` a la dirección para ocupar toda la ventana, `?auto=1` para arrancar en modo auto e `?intervalo=2` para cambiar la pausa entre fases (segundos).

## Crear un vídeo nuevo

Cada vídeo es un archivo en `escenarios/` (pregunta, valor inicial, multiplicador, texto de cada fase, cámara y etiquetas de escala) y cada fenómeno es un archivo en `fenomenos/` que anima el mundo. Los dos se dan de alta en `lista.js`. Las cifras son aproximadas y hay que comprobarlas antes de publicar.

Un fenómeno se registra así (ver `fenomenos/ola.js`):

```js
window.FENOMENOS.tipo = {
  crear(ctx) {},                 // una vez, al cargar
  fase(ctx, n, valor, f) {},     // al empezar la fase n con su valor y su entrada de escenario
  actualizar(ctx, dt, t) {},     // cada fotograma
  activo() { return true },      // true mientras dura la animación de la fase (modo auto y cierre)
  tnt(valor) { return null },    // toneladas de TNT para el marcador, o null
  linea3(valor) {},              // opcional: sustituye la línea de TNT (p. ej. CO2)
  mag(valor) {},                 // opcional: texto grande ("Magnitud 6", "120 dB")
  danos() {},                    // opcional: línea de daños
  corriente(x, z) {},            // opcional: { y, vz } si el agua arrastra restos en ese punto
};
```

`ctx` da acceso a la escena, la ciudad (`objects`, `inst`, `people`), `derribar(o, vel)`, partículas (`emit`), restos (`addDebris`), cámara (`camTo`, `pushCamera`, `setShake`), cielo (`skyT`), sonido (`boom`, `rumble`, `audio`) y utilidades (`R`, `rr`, `lerp`, `clamp`, `smooth`, `fmt`).

## Técnica

Three.js 0.160 (incluido en `vendor/`, sin dependencias externas ni paso de compilación). Sonido sintetizado con Web Audio, sin música con derechos.
