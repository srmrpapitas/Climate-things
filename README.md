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

## El puñetazo (boxeo)

- `fenomenos/boxeo.js` monta un pabellón con ~4.000 espectadores, lleva su propia cámara (planos cortos a la altura del ring, definidos en cada paso de `escenarios/punetazo.js` con `planos`) y va rompiendo pared, tejado y gradas según crece el golpe.
- Los luchadores son modelos de Avaturn con esqueleto de Mixamo: `modelos/nico.glb` (el que pega) y `modelos/leo.glb` (el rival). Se mueven con las animaciones de Mixamo de `modelos/anim/*.json` (convertidas desde FBX: directo, cruzado y golpe en la cabeza). La boca se abre con la voz (`audio/sfx/bomboclat_anime/boca.json`).
- Gritos de anime en `audio/sfx/bomboclat_anime/` (voces de ElevenLabs: Ryu para el que pega, VALF para el rival). En los golpes normales el que pega grita «¡BOMBOCLAT!» (`bomboclat.mp3`) y el puño entra en el «CLAT»; el narrador va justo detrás con una frase corta. Cada paso puede llevar `grito` ('corto', 'carga', 'final'), `rival: true` (el rival grita al salir volando) y `vozRetraso` (la narración espera a que acabe el grito).
- `fenomenos/anime.js`: líneas de velocidad, fotograma de impacto en negativo, destellos, rótulos con katakana, aura y rayos. Todo se pinta en la escena 3D, así que sale en el MP4 exportado.

## Técnica

Three.js 0.160 (incluido en `vendor/`, sin dependencias externas ni paso de compilación). Sonido sintetizado con Web Audio, sin música con derechos.

## La altura que se duplica

- `escenarios/altura.js` + `fenomenos/altura.js`: una persona promedio que duplica su altura en 12 fases hasta medir más que la Luna de ancho. Enseña la ley cuadrado-cubo (el peso crece más rápido que la fuerza); la física y las cifras están comentadas en el escenario.
- El chico de la sudadera (`COMUN.heroe`) crece en una calle; la cámara la lleva el fenómeno (planos `crece`, `calle`, `pov`, `pies`, `lado`, `aereo`, `nubes`, `compara`, `rayos`, `atomo`, `nervio`, `despega`, `espacio`).
- Rayos X estilo Mortal Kombat: huesos, músculos, tendones, corazón y sangre (`rayos` con `rompe`, `dobla`, `latido`, `sangre`, `musculo`). Zoom a los átomos (`atomo`: hueso, acero, diamante o neutrones, con cara `feliz`, `suda`, `rota` o `chulo`).
- Los planos y efectos pueden ir a la palabra del narrador: `T('@palabra', '@word')` (usa la duración real de la frase si ya está cargada).
- Narración en español con la voz D («Narrador Si se duplica (castellano) D», diseñada en la cuenta nueva de ElevenLabs para parecerse a la voz C, que se quedó en la cuenta antigua): `audio/voz/es/altura/00.mp3` = pregunta, `01`–`12` = fases. En inglés no hay voz.

