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

## Regla del esqueleto (26-10-2026, el usuario)
- **El esqueleto es la estructura** (generador, cámara, tarjetas, frascos, música, subtítulos), **no los dibujos**. Cada episodio lleva **escenarios nuevos con su propio estilo** y los personajes que se nombran **salen en pantalla y se mueven**.
- Solo se repite lo que es de la serie: el Decano, la cueva del inicio y la portada.
- Dibujos baratos: **Seedream 5 lite**, una imagen 2×2 = 4 escenarios por ≈ 212 créditos (≈ 53 cada uno); se cortan en 4 con Python. Personajes: una hoja con 6 caricaturas por ≈ 212 créditos → `marioneta.py`.
- Voz del narrador **calmada**: en ElevenLabs `voice_settings` → `speed: 0.88`, `stability: 0.7` (más lenta y serena) y pausas de 1 s entre bloques. Para audios ya hechos: `ffmpeg -af rubberband=tempo=0.92`.
- **Estilo visual (26-10-2026)**: narrador y escenas normales = animación pintada a pincel (`fabrica/pintado`, gratis). **Zooms y diálogos de los protagonistas** = retratos a mano alzada, tinta y plumilla, dramatismo de cómic de Batman (DC) + trazo del cuento de la Varita de Saúco; 3–4 s, ~1 cada 40 s y en momentos clave; animados con mandíbula/parpadeo/efectos de cómic. Retratos en cuadrícula 2×2 (Seedream 5 lite, ≈212 créditos por 4) → biblioteca.
- **Retratos (norma del usuario)**: expresiones MUY marcadas (sonrisa amplia con patas de gallo, enfado con ceño y mandíbula apretada…), detalle a lápiz y plumilla: arrugas, sombras bajo la barbilla, poros, pelos de la barba. Planos tipo **Tarantino**: perfil y boca, de la nariz para abajo; «primer plano del primer plano» con detalle extremo. Pedir **parejas boca cerrada / boca abierta con el mismo encuadre** para que hable en 2D alternando dibujos. Feijolo habla siempre que sale (mandíbula o parejas) y cambia de gesto entre frases. Transiciones con poco volumen. Cada retrato 6–8 s para amortizarlo.
- **Escenas base**: teatro de sombras (siluetas de perfil articuladas, pantalla de luz ámbar, calados, decorados recortados en capas).

## Coste real del ep. 2 (26-10-2026)
- Voz ElevenLabs: ≈ 7.000 créditos (1 crédito por letra; ~8 min de vídeo).
- Dibujos nuevos: 3 imágenes de Feijolo ≈ 1.300 créditos (en adelante: 0, se reutilizan y recortan).
- Música, efectos, animación y render: 0 €.
