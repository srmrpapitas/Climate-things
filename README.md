# Si se duplica

Simulador cinemático low poly para vídeos verticales de Instagram (@siseduplica): un fenómeno que duplica su intensidad en cada fase hasta que no queda nada. Primer escenario: **la ola que se duplica** (20 m → 10.240 m) sobre una ciudad costera.

## Cómo se usa

- Abre `index.html` desde un servidor (Cloudflare Pages, o `python3 -m http.server` en local).
- **Play** muestra la pregunta sobre la ciudad tranquila. **Clic** o **espacio** lanza la siguiente fase.
- **A**: modo auto (las fases avanzan solas). **H**: oculta la ayuda y el cursor. **R**: reinicia.
- La imagen va en 9:16. Añade `?full` a la dirección para ocupar toda la ventana, `?auto=1` para arrancar en modo auto e `?intervalo=2` para cambiar la pausa entre fases (segundos).

## Crear un vídeo nuevo

Todo el contenido de un vídeo está en `escenarios.js`: pregunta, valor inicial, multiplicador, texto de cada fase, cámara, alcance de la ola y etiquetas de escala. Las cifras son aproximadas y hay que comprobarlas antes de publicar.

## Técnica

Three.js 0.160 (incluido en `vendor/`, sin dependencias externas ni paso de compilación). Sonido sintetizado con Web Audio, sin música con derechos.
