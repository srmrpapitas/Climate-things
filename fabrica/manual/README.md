# Manual de la fábrica (leer esto primero en cada conversación)

Todo lo necesario para hacer un video sin buscar en conversaciones viejas.
Aquí está el **cómo**; lo **ya hecho** está en git (`git log`), no aquí.

## 1. Flujo de un video
1. **Guion**: una frase por línea en `fabrica/herramientas/guion_<slug>.txt`. Aplicar `reglas/retencion.md` (R1–R8).
2. **Voz** (ver §2) → `audio/voz/es/<slug>/NN.mp3` y una línea `"es/<slug>": N` en `audio/voz/lista.json`.
3. **Tiempos** de cada frase/palabra: `herramientas/tiempos.py` (Whisper). Usar solo los tiempos; el texto de los subtítulos sale del guion (Whisper confunde nombres: «Sanchís» → «Sánchez»).
4. **Video** con HyperFrames (ver §4): carpeta `fabrica/videos/<slug>/`, copiando la estructura de `fabrica/videos/espanistan-01-prueba/` (ejemplo de arquitectura, no el video final).
5. **Música y efectos** (ver §3).
6. **Checklist R8** de `reglas/retencion.md` → render → el usuario revisa y pide cambios por número de escena.

## 2. Voz
Narrador oficial: **voz D** de ElevenLabs («Narrador Si se duplica (castellano) D», cuenta nueva).
Muestra de referencia: `audio/voz/es/altura/01.mp3`.

| Orden | Motor | Coste | Notas |
|---|---|---|---|
| 1º | **ElevenLabs, voz D** (conector ElevenLabs) | ~1 crédito por carácter; el ep. 1 entero ≈ 6.600 | Usar hasta gastar los créditos (había ~30.000 el 26-10-2026). El buscador de voces del conector **no encuentra la voz D**: pedir al usuario el *voice ID* (Voices → ⋯ → Copy voice ID) y apuntarlo aquí: `VOICE_ID_D = (pendiente)` |
| 2º | **Qwen3-TTS** gratis, clonando la voz D, con `--grave` | 0 €; ~40 s por frase en CPU | Al usuario le gustó. `--grave` es la versión elegida (más grave y limpia) |
| ✗ | Chatterbox | — | Descartado: en español suena muy mal |
| ✗ | Bajar el tono con filtro después de generar | — | Descartado: suena deformado y poco nítido |

Qwen3 (primera vez: `sh fabrica/manual/herramientas/instalar.sh`):
```
/home/user/qw/bin/python -I fabrica/manual/herramientas/voz_qwen.py fabrica/herramientas/guion_<slug>.txt audio/voz/es/<slug> all --grave
```
Lanzarlo en segundo plano (37 frases ≈ 25–30 min). Para probar antes: cambiar `all` por `1,4,20`.
Red necesaria: `pypi.org`, `huggingface.co`, `*.hf.co` (si da 403, el usuario lo abre en ajustes del entorno → Network access).

## 3. Música y efectos de sonido (reglas en `reglas/retencion.md` R5 y R5b)
- **Música**: sin copyright y simple. La genera `herramientas/musica.py` (acordes La m–Fa–Do–Sol + piano suave, 84 bpm, ~46 s en bucle; es nuestra, sin derechos). Cambiar `acordes`/`bpm` para otro ambiente. Siempre por debajo de la voz (volumen ~0,12–0,18).
- **Temas serios: la música se corta** (fundido a 0 en ~0,5 s y vuelve después).
- **Todo lo que se nombra se ve en pantalla, con su efecto de sonido.** Conclusiones y remates: un efecto que case (golpe, sello, *riser*…).
- Efectos disponibles: `audio/sfx/` → alarmas, asfixia, ciudad, cristales, derrumbe, dron, espacio, fuego, golpe, grada, grito, helado, impacto, ola, ovacion, panico, planeta, riser, terremoto, whoosh (+ `bomboclat*/`). En el ejemplo: `assets/sfx/` golpe, trazo, whoosh.
- Si falta un efecto: generarlo con el conector de ElevenLabs (gasta créditos) o sintetizarlo con un script como `musica.py`.

## 4. Video (HyperFrames)
- Una composición = `index.html` (1920×1080) con GSAP; la línea de tiempo se registra en `window.__timelines['main']`. Cada sonido es un `<audio data-start data-duration data-volume>`.
- Subtítulos: lista `FRASES` con `ini`/`fin` (de `tiempos.json`) y la palabra clave en `<b>`.
- Imágenes del episodio: `historias/espanistan/img/` (balanza, coche, congreso, cueva, despacho, hucha, laboratorio, llave, mochila, portada, urna). Guion con lo que se ve entre corchetes: `historias/espanistan/01-sanchis.md`.
- Render (dentro de la carpeta del video):
  ```
  npx --yes hyperframes@0.8.204 render -o <salida>.mp4
  ```
  Medido: **10 s de video ≈ 57 s de render** (≈6× tiempo real). Un video de 9,5 min ≈ 55 min → lanzarlo en segundo plano.
- `npx hyperframes@0.8.204 check` revisa errores antes de renderizar.

## 5. Entorno (nube)
- Sin GPU, 4 núcleos, 15 GB de RAM: **no cargar dos modelos de voz a la vez**.
- Rama de trabajo indicada en cada sesión; subir siempre lo generado (`git add`, `commit`, `push`).
- Hablar con el usuario en español, corto y sin tecnicismos.
