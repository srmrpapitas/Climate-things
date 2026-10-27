# Cómo se hizo «El tsunami que se duplica» (y cómo hacer otro igual mucho más rápido)

> **Para Claude:** lee esto antes de hacer un vídeo parecido (vertical, 3D ilustrado, Nico, narrador + «bomboclat»).
> Casi todo se reutiliza: copia `tsunami/` como base, cambia `guion.js` y las escenas, y sigue los pasos de abajo.

## Resultado

- `tsunami/peli.html` + `tsunami/peli.js`: la película entera (70 s, 1080×1920, 30 fps).
- Render: `node tsunami/grabar.mjs "tsunami/peli.html" out/tsunami.mp4` (servidor en marcha:
  `python3 -m http.server 8765` desde la raíz). En el Mac tarda **unos 5–8 min**.
- Vista previa en el navegador: `http://localhost:8765/tsunami/peli.html` (clic: pausa; `?t=40` empieza en el segundo 40).

## Cómo está organizado el código

| Archivo | Qué hace |
|---|---|
| `motor.js` | Render, materiales de bandas con contorno de tinta (`material()`, `adaptar()`), posproceso (papel, viñeta, **rebobinado de cinta**), Nico (carga, poses `apuntar()`/`girar()`, `nicoBrazos`, `nicoCorrer`, `nicoSentado`, boca), textos (HUD, cómic, subtítulos), cámara (`ponerCamara`). |
| `guion.js` | **Todo lo que pasa y cuándo**: frases del narrador (con subtítulo), «bomboclat», tramos de escena, HUD de cada ola y todos los efectos de sonido. |
| `escenas/cuarto.js` | El cuarto bajo el agua: dormido en la cama → despertar; Nico en la ventana → grieta. |
| `escenas/playa.js` | Playa al atardecer, el mar se retira, peces, sombrillas, chiringuito, gente que huye, ola de 10 m. |
| `escenas/ciudad.js` | Rascacielos (planta 45 por dentro) y ciudad; ola 3 rompe edificios en trozos; ola 4 sube el agua; ola 5 llena el cristal. |
| `escenas/ola.js` | El muro de agua (perfil que rompe + espuma). Se usa en playa y ciudad: `hacerOla(scene, {ancho, h}).ir(zFrente, altura, t)`. |
| `peli.js` | Elige la escena de cada tramo, pinta textos, flashes, el rebobinado y el final. |
| `capturas.mjs` | **Hoja de capturas** para revisar sin renderizar: `node tsunami/capturas.mjs "tsunami/peli.html" out/hoja.jpg "__peli.ir(5)" "__peli.ir(20)" …` |
| `voz/cortar.py` | Corta la toma única del narrador en frases normalizadas y escribe `voz/duraciones.json`. |
| `prueba-boca.js` | Banco de pruebas de la boca: `capturas.mjs "tsunami/peli.html?prueba=boca" out/boca.jpg "__prueba(1,0)" "__prueba(.6,.35)"`. |

Cada escena es `crear()` → `{ scene, ir(t, …), preparar() }`. `ir(t)` es **determinista** (no guarda estado entre
fotogramas: posiciones calculadas con fórmulas de `t`), así se puede saltar a cualquier segundo y renderizar en orden.

## Los pasos, en orden (con lo que costó cada uno)

1. **Render con la gráfica del Mac** (hecho, no repetir): `grabar.mjs` lanza Chromium con
   `--use-angle=metal --force_high_performance_gpu` → usa la **AMD Radeon Pro 5300M**, ~0,1–0,2 s por fotograma
   (en la nube, con SwiftShader, eran 3–7 s). `GRABAR_CPU=1` vuelve a la CPU. El script avisa si cae en SwiftShader.
2. **Voces** (≈ 760 créditos de ElevenLabs para 736 caracteres):
   - Voz del narrador «D»: `EZDj5TBPpANsOzwaukxI` (**sigue en la cuenta nueva**, «Narrador Si se duplica (castellano) D»).
   - **Truco para ahorrar:** generar **todas las frases en una sola toma** (`eleven_multilingual_v2`, `generations_count: 1`,
     frases separadas por línea en blanco) y cortarla después. Primero `estimate_only: true` para ver el precio.
     Por defecto el conector genera 2 tomas (el doble de créditos): pon siempre `generations_count: 1`.
   - Descargar con `creative_get_generations` (da la URL del mp3) → `tsunami/voz/narrador_bruto.mp3`.
   - Cortes: Whisper con tiempos por palabra (el `av` del entorno falla con mp3: convertir antes a wav 16 kHz con ffmpeg
     y pasarle el array a `faster_whisper`) + `ffmpeg -af silencedetect=n=-38dB:d=0.35`. Los cortes van en `voz/cortar.py`.
   - **Los tiempos del guion salen de las duraciones** (`voz/duraciones.json`). Con esta voz el narrador dura 54 s;
     el vídeo quedó en 70 s.
3. **Guion con tiempos** (`guion.js`): narrador, después los «bomboclat» en los huecos (nunca encima del narrador), la
   acción entre medias. Los subtítulos salen del mismo texto.
4. **Escenas.** Partir siempre de las existentes. Ideas que funcionaron:
   - Ola: el perfil de `fenomenos/ola.js` con colores por vértice (espuma en la cresta) + puntos de espuma.
   - Edificios que se rompen: cada uno precortado en 2×N×2 cajas en **una sola `InstancedMesh`** (sin contorno); cuando
     llega el frente salen con velocidad, gravedad y arrastre, calculado con `t - tGolpe` (sin física con estado).
   - Mar que se retira: bajar el plano del mar sobre una arena en pendiente (la arena por debajo de 0 es más oscura).
   - Nico tumbado: un **pivote en la cadera**; se gira el pivote (tumbado → sentado) y `nicoSentado()` deja las piernas
     horizontales bajo el edredón.
   - Correr: `nicoCorrer(fase)` a mano con `apuntar()` (las animaciones de Mixamo no valen tal cual: ver PLAN.md).
5. **Sonido** (`guion.js` → `EFECTOS`): efectos de `audio/sfx/` con `filtro` de ffmpeg (bajo el agua `lowpass=f=300–500`;
   rebobinado `areverse,asetrate=60000`). Narrador a `gan: 1.25`, bomboclat a 1.05 (el bajito a .55).
6. **Revisar con hojas de capturas** (12 instantes por hoja, ~1 min) antes de renderizar. Corregir encuadres ahí.
7. **Render** en segundo plano y abrir `out/tsunami.mp4`.

## Lo aprendido aquí (no repetirlo)

- **Contorno de tinta:** `OutlineEffect` lee `outlineParameters` del **material** (`mat.userData`), no del objeto. Si se pone
  en el objeto, el cielo (esfera) se pinta entero de tinta: sale un cielo azul marino.
- **Boca:** el hueco negro es un óvalo **delante** de la cara interior del labio de abajo (que es rosa). Si se mete detrás
  de los labios, lo rosa queda por delante. Ajustes aprobados por el usuario en `AJUSTE_BOCA` (`motor.js`):
  un poco más arriba, medio centímetro a la derecha de Nico (izquierda en pantalla), ancho 1,9 cm, alto hasta ~2,8 cm.
- **Texto de cómic:** a 1,6 em el «¡BOMBOCLAT!» se salía por los lados con el rebote; 1,35 em (1,25 el largo) cabe.
  Si hay HUD, bajar el cómic (top 21 %).
- **`preparar()` de las escenas se llama cada vez que se vuelve a la escena:** no medir nada ahí con el estado de otra
  escena (pasó con la altura de la cadera de Nico: lo tumbaba un metro desplazado).
- **zsh no separa palabras** en `for r in "0 3.66"…; set -- $r`: usar Python para bucles con listas de números.
- Encuadres por encima del hombro: calcular que la cabeza cae dentro del campo horizontal (en 9:16 el ángulo horizontal
  es poco más de la mitad del vertical).

## Para el próximo vídeo parecido

1. Copiar `tsunami/` a una carpeta nueva; reutilizar `motor.js`, `ola.js`, `capturas.mjs`, `grabar.mjs`, `voz/cortar.py`.
2. Escribir el guion → generar el narrador en **una toma** → cortar → tiempos en `guion.js`.
3. Adaptar escenas, revisar con 2–3 hojas de capturas, renderizar.
