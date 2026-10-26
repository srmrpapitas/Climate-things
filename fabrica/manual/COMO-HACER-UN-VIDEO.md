# Cómo hacer un vídeo (con el generador) — leer esto con Sonnet

1. **Preparar la sesión**: `sh fabrica/instalar_todo.sh` (Whisper). La voz es ElevenLabs, voz D `EZDj5TBPpANsOzwaukxI`, modelo `eleven_multilingual_v2`, 1 toma.
2. **Guion**: `historias/espanistan/NN-tema.md` (con fuentes) + `fabrica/herramientas/guion_espanistan-NN.txt` (una frase por línea, números en letra). Última línea: la de «dale a like, suscríbete y activa la campana».
3. **Voz por bloques** (una llamada por sección, no por frase): guardar en `audio/voz/es/espanistan-NN/bNN.mp3`, normalizado con
   `ffmpeg -i in.mp3 -af "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,loudnorm=I=-17:TP=-1.5" -ar 44100 -b:a 160k out.mp3`.
4. **Escenas**: copiar `fabrica/videos/espanistan-02/escenas.json` a `fabrica/videos/espanistan-NN/escenas.json` y cambiar voces, negritas y planos.
   - Plano: `tipo` = `imagen` (con `fondo`) · `decano` (habla) · `marioneta` (Feijolo; para otro personaje, recortarlo con `marioneta.py`) · `cueva`. `cam`/`cam2` = [x, y, zoom] al empezar/acabar. `musica` = neutro · misterio · esperanza · tension · silencio.
   - Capas: `dato` · `cita` · `frasco` (etiqueta judicial exacta; se acumulan en la estantería) · `barras` · `lista` · `comparacion` · `linea` · `pines` (mapa) · `sello` · `titulo` · `suscribete`.
   - Anclas: `"B:palabras"` (B = número de voz en la lista, palabras tal cual en el guion).
   - Fondos disponibles en `historias/espanistan/img/`. **Ojo**: `coche`, `despacho`, `congreso` y `portada` (lado izquierdo) salen con Sanchís.
5. **Generar**: `/home/user/qw/bin/python -I fabrica/generar.py fabrica/videos/espanistan-NN/escenas.json` (la primera vez ~9 min por Whisper; después segundos).
6. **Revisar**: `npx hyperframes@0.8.204 check` y **una** hoja de capturas: `npx hyperframes@0.8.204 snapshot --frames 18 -o /tmp/snap`.
7. **Render** en segundo plano: `npx hyperframes@0.8.204 render -o out/espanistan-NN.mp4` (~4,4× la duración).
8. Cambios del usuario: **editar `escenas.json`** y volver al paso 5. Nunca editar `index.html` a mano.

## Coste real del ep. 2 (26-10-2026)
- Voz ElevenLabs: ≈ 7.000 créditos (1 crédito por letra; ~8 min de vídeo).
- Dibujos nuevos: 3 imágenes de Feijolo ≈ 1.300 créditos (en adelante: 0, se reutilizan y recortan).
- Música, efectos, animación y render: 0 €.
