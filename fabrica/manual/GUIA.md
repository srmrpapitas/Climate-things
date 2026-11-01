# Guía de la fábrica (cómo se hace cada cosa)

Una sola guía. Primero las reglas que valen siempre y después una sección por tarea, con los comandos.
El estado del momento (qué está hecho y qué falta) no va aquí: está en `fabrica/manual/RETOMAR.md`.

**Índice**
0. Reglas que valen siempre
1. Preparar la sesión
2. Capítulo de Españistán (títeres, ≈ 8–10 min)
3. Shorts de un capítulo
4. Miniaturas
5. Subir a YouTube y difundir en X
6. Anime (golpe a lo One Punch Man)
7. Reel viral vertical (Instagram)
8. Herramientas: tabla de comandos

---

## 0. Reglas que valen siempre
**Con el usuario**
- Hablarle en español, corto y sin tecnicismos. No es programador.
- Antes de gastar créditos (ElevenLabs, Flow), decir cuántos y esperar el «sí».
- Antes de publicar (YouTube, X, Instagram), esperar el «sí». Nunca borrar un vídeo subido sin su «sí».
- Primero la voz: mandar el audio entero en mp3 y esperar el «sí» antes de animar.
- Prueba de 3 s antes de rehacer un vídeo entero.

**Contenido**
- Datos reales, siempre con fuente y lo más nuevos posible. Lo dudoso va a una lista «Por comprobar» y no se publica sin comprobarlo.
- Nadie es culpable sin sentencia: la palabra exacta de cada sentencia.
- Nunca decir a quién votar. Lo bueno también se cuenta.
- Gancho sensacionalista sí, pero verdadero: la miniatura no promete nada que el vídeo no cuente. Nada que señale a un grupo por su origen.
- Fotos reales de políticos: solo de Wikimedia Commons con licencia libre (CC0, dominio público o CC BY con crédito). Nunca retocar gestos (lágrimas, heridas) en caras reales.

**Sonido (invariante: revisar el audio VARIAS veces antes de entregar)**
- Golpes (`impacto`, `derrumbe`, `cristales`, `trueno`) con volumen ≤ 0,4 (lo normal, 0,15–0,3). Música siempre por debajo de la voz.
- Medir: `ffmpeg -nostats -i out/X.mp4 -vn -af ebur128=peak=true -f null - 2>&1 | grep -A12 Summary`.
  - Capítulo horizontal: I entre −18 y −14 LUFS · LRA ≤ 6 · pico ≤ −1 dB. Referencia buena: I −17 · LRA 3,3 · pico −2,6.
  - Vertical (reel, short): −16 LUFS, pico −1,5 dB.
- Efectos siempre de ElevenLabs (`fabrica/explicado/efectos.py` → `audio/sfx/eleven/`), nunca sintetizados con ffmpeg.

**Voz**
- Narrador de Españistán: **Gabo** `o0SveC0zgHFuCsEO3vHR`, modelo `eleven_v4`, frase entera por llamada (`voz_frases.py`).
- Narrador de los verticales: **Tony** `851ejYcv2BoNPjrkw93G`, `eleven_v4` (`fabrica/explicado/voz.py`).
- Nunca ralentizar la voz después (`atempo`, `rubberband`): suena a robot. Si hace falta calma, más pausa entre frases.
- Al cambiar de voz, borrar todos los audios viejos de esa carpeta.
- La clave de ElevenLabs se lee de `~/.elevenlabs_key`.

**Trabajo**
- Renders y pruebas largas en segundo plano; seguir respondiendo mientras.
- No abrir vídeos ni `out/` para revisar salvo que haga falta: se revisa con fotogramas sueltos y hojas de contacto.
- Ediciones mínimas en el código. Lo que se aprende se apunta en esta guía, en su sección.
- Al acabar, borrar los fotogramas de `out/titeres_*` y `out/explicado_*`: llenan el disco.

---

## 1. Preparar la sesión
- Servidor en la raíz del repo, en segundo plano (todo lo que graba lee de aquí): `python3 -m http.server 8765`
- `npm install` si falta `node_modules/` (solo Playwright).
- Whisper (para `palabras.py` y `musica.py`) vive en el entorno `~/qw` (`~/qw/bin/python`).
- Navegadores:
  - el **integrado** tiene la sesión de Gemini, Flow y YouTube Studio;
  - **Chrome** (extensión) hace falta para subir archivos. Si no conecta, ver §5.

---

## 2. Capítulo de Españistán (títeres)
Modelo a copiar: el **ep. 7** (`fabrica/titeres/CAPITULO-07-PLANOS.md` y `escenas/07-*.js`). Formato fijo: títeres a lo Samurai Jack, 30 fps (60 si lo pide), ≈ 8–10 min, intro y outro.

### 2.1 La serie
- Nombres de sátira (los elige el usuario): Sánchez = **Sanchís**, Feijóo = **Feijolo**, Abascal = **Acascar**. Para uno nuevo, preguntar.
- Protagonista de la serie: **el Elegido** (samurái con la Espada de la Verdad, lo único en color real).
- El **Decano** guía, con una cita de filósofo verificada por bloque, nunca al principio.
- Final: pregunta del Decano → «Te leo en comentarios» → avance del capítulo siguiente → outro (`escenas/outro.js`).

### 2.2 Los primeros 30 segundos (lo que dicen las métricas)
- La primera frase es el dato más fuerte, con una cifra y una persona, o un acertijo. Nunca «en el episodio anterior».
- Antes del segundo 20, una pregunta abierta que solo se responde viendo el vídeo.
- Título y miniatura prometen lo mismo que los primeros 10 s.

### 2.3 Pasos
1. **Datos y guion.**
   - Datos con fuentes en `historias/espanistan/NN-tema.md`.
   - Guion en `fabrica/herramientas/guion_espanistan-NN-8min.tsv`: una línea por frase, `bloque<TAB>frase`, números en letra.
   - Frases de los personajes en `guion_espanistan-NN-personajes.txt`.
2. **Voz** (pedir permiso y decir los créditos: ≈ 1 crédito por letra):
   `python3 fabrica/herramientas/voz_frases.py fabrica/herramientas/guion_espanistan-NN-8min.tsv audio/voz/es/espanistan-NN-gabo --ver`
   (con `--ver` solo cuenta; sin él, genera). Mandar el audio entero y esperar el «sí».
3. **Tiempos**: `python3 fabrica/titeres/tiempos.py NN` → `escenas/tiempos-NN.js`.
   Sin audio todavía, estima a 14 letras/s para poder animar antes.
4. **Plan de planos** en `fabrica/titeres/CAPITULO-NN-PLANOS.md`: secuencias, fondos nuevos y, para cada frase, qué se ve y qué cambia justo en la palabra clave.
5. **Fondos nuevos** en `decorados-NN.js` (cada capítulo, paisajes nuevos; nada de parlamento, noria ni balanza).
6. **Escenas** `escenas/NN-*.js`: `const G = T.guion([4, 5, 'f1'])` da `G.voces`, `G.en.b5`, `G.en['b5.2']` (2.ª frase) y `G.fin`. Referencia del motor: `fabrica/titeres/README.md`.
7. **Revisar** con fotogramas sueltos: `node fabrica/titeres/fotos.mjs NN-escena 2 4.5 9` → `out/fotos_NN-escena/`.
8. **Grabar** cada escena: `node fabrica/titeres/grabar.mjs NN-escena out/NN-escena.mp4` (≈ 4 s por segundo; `FPS=30` para borradores de escenas a 60).
   Varias a la vez: copiar `fabrica/titeres/render07.sh`.
9. **Montar**:
   - Si faltan, la ráfaga de viento (`node fabrica/titeres/rafaga.mjs out/rafaga`) y la música (`~/qw/bin/python -I fabrica/herramientas/musica.py out/musica03/AMBIENTE.wav AMBIENTE`, ambientes: neutro, misterio, esperanza, tension).
   - Añadir `SECUENCIAS_NN` en `montar.py` y `python3 fabrica/titeres/montar.py out/espanistan-NN.mp4 NN`.
   - Limitar picos: `ffmpeg -i out/espanistan-NN.mp4 -c:v copy -af alimiter=limit=0.89:level=false out/espanistan-NN-limitado.mp4`.
10. **Invariante de sonido** (§0) y el usuario lo ve entero. Copia final en `~/Desktop/Espanistan-NN/`.

### 2.4 Cómo se anima bien (lecciones del usuario)
- **Imagen y voz cuentan lo mismo a la vez** (los frascos del ep. 3 son el modelo). Prueba: si la imagen no explica la frase sin sonido, se cambia.
  Metáforas con objetos, no dos personajes de pie hablando. Cada personaje lleva su nombre la primera vez.
- **Algo nuevo cada 1–2 s**, nunca un plano quieto; la escena evoluciona con lo que se cuenta, nada en bucle.
- **Cambios de plano 60/40**: 60 % sin cortar (metamorfosis de tinta, la cámara sigue y se aleja, `forma` con hojas o tinta) y 40 % transiciones (`viento` entre lugares, cortes secos dentro de un sitio).
- **Dejar respirar la tinta**: ≥ 3 s entre que acaba una metamorfosis o un `forma.aparece` y el siguiente cambio. La tinta que se deshace es la misma que forma lo nuevo y viaja a favor del viento.
- Modo `cartoon: true` (temporada 2): se encogen antes del gesto y rebotan. Dejar ≥ 0,3 s entre gestos.
- Que no se sienta vacío: sonido de ambiente siempre y vida al fondo (gente, pájaros, humo).
- Cámara alta y en movimiento; sin contrapicados desde el suelo; pocos planos largos; cortar en un sitio con lógica si algo cuesta enseñarlo seguido.

---

## 3. Shorts de un capítulo
- Verticales 1080×1920 sacados del capítulo montado: fondo desenfocado, gancho arriba en dos líneas, subtítulos grandes y «capítulo entero en el canal».
- Modelo: `fabrica/titeres/shorts05.py`. Lee las duraciones del navegador (no hace falta tener los MP4 de las escenas):
  1. `node fabrica/titeres/duraciones.mjs <escenas en orden> > out/duraciones-NN.json`
  2. Copiar `shorts05.py`, cambiar `CAPITULO`, `GUION`, `CIFRAS` y la lista `SHORTS` (bloque de inicio, bloque de fin, gancho).
  3. `python3 fabrica/titeres/shortsNN.py` → `out/shorts/*.mp4`; copiar a `out/subir/` (Chrome solo sube archivos < 10 MB).
- Calendario: 2 al día (14:00 y 21:00) o una franja fija; se apunta en `fabrica/manual/SHORTS-CALENDARIO.md`. No creados para niños; vídeo relacionado = el capítulo.

---

## 4. Miniaturas
Estilo aprobado: **el Elegido grande a la izquierda sobre blanco** con rayos y halo dorado, la escena de Gemini a la derecha con **fotos reales recortadas** de los políticos encima, etiquetas PP/PSOE/VOX, texto en MAYÚSCULAS y banda roja. Nunca fondo rojo («parecemos rojos»). Fotos distintas en cada vídeo.

1. **Escena** en Gemini (navegador integrado): la imagen con el 40 % izquierdo en blanco y los políticos en caricatura a la derecha, sin texto.
   Sacarla a 1024×572 (overlay del blob en una vista de 512×286 y 4 capturas por cuadrantes, unidas con ffmpeg) → `out/miniaturas-gemini/epNN-blanco.png`.
2. **Fotos reales**: buscar en Wikimedia Commons (licencia CC0, dominio público o CC BY) y recortar el fondo con Vision de macOS:
   `swift fabrica/herramientas/recorte.swift foto.jpg out/fotos-reales/NOMBRE-recorte.png`.
   Si sale con mesa o botellas, recortar antes la foto al busto. Apuntar autor y licencia en `out/fotos-reales/CREDITOS.md` y poner el crédito en la descripción del vídeo.
3. **El Elegido**: `node fabrica/titeres/fotos.mjs recorte-elegido 1.5` (sobre verde para el croma).
4. **Montar**: añadir el episodio a `MINIS` en `fabrica/titeres/miniatura_gemini.py` (`grande`, `banda`, `caras`, `etiquetas`) y
   `python3 fabrica/titeres/miniatura_gemini.py NN` → `out/miniatura-epNN.jpg`.
   Otra plantilla (fondo verde de Vox, foto con prueba a la derecha): `fabrica/titeres/miniatura_vox.py`.
5. **Gancho**: emoción o paradoja arriba («VIVIENDA IMPOSIBLE», «CEUTA DESBORDADA») y la cifra en la banda. Un número solo («750.000 CASAS») no engancha.

---

## 5. Subir a YouTube y difundir en X
- Textos de cada capítulo (título, descripción, capítulos `m:ss`, fuentes, comentario fijado): `fabrica/manual/difusion/DIFUSION-EPNN.md`.
- Al subir: no creado para niños; **pantalla final** con vídeo recomendado y suscribirse; tarjeta al capítulo que se cite; lista de reproducción «Españistán».
- **Cambiar una miniatura sin Chrome** (desde el navegador integrado; el panel no abre la ventana de archivos):
  1. Con el «sí» del usuario, subir la imagen en base64 a un gist **secreto** temporal (`gh gist create`).
  2. En la página de edición de Studio, con JS: `fetch` del raw del gist → `File` → `DataTransfer` en el `input[type=file]` → evento `change`.
  3. Esperar ~10 s a que se vea la vista previa y guardar con un **clic real** en «Guardar» (el clic por JS a veces no guarda la miniatura).
  4. Comprobar en la lista del canal y **borrar el gist**.
- X: borradores y registro de lo publicado en `fabrica/manual/X-BORRADORES.md`. El botón «Responder» se pulsa por coordenadas, no por referencia.

---

## 6. Anime (golpe a lo One Punch Man)
Motor: `fabrica/explicado/` (vertical u horizontal, fotograma a fotograma). Ejemplos aprobados: `escenas/golpe.js` (3 s) y `escenas/paralepipedo.js` (24 s, 60 fps).

### 6.1 Cómo es un golpe de anime de verdad (medido fotograma a fotograma)
- En ~5 s hay solo **10–12 dibujos de verdad**; el resto lo hacen cámara, luz, color y capas, **cambiando en cada fotograma**.
- Planos cortos (< 0,5 s en el clímax); solo se aguantan el contacto (~1 s) y la reacción (~1,3 s).
- Secuencia: acercamiento en estroboscopio de luz blanca/magenta (el personaje asoma 2 fotogramas de cada 6) → smear del puño → contacto por encima del hombro, vivo (capa y pelo, brillo que late, temblor en cada fotograma) → 2 blancos + 2 negativos y líneas de velocidad → primer plano de la reacción (el ojo) → plano general con onda, escombros y polvo.
- Paleta corta en el impacto: blanco + un color. Un dibujo aguantado con una malla que «respira» **no** es animación: parece un cómic.

### 6.2 Pasos
1. **Audio primero** (voces y efectos) y el «sí» del usuario.
2. **Dibujos clave con Gemini o Nano Banana en Flow** (navegador integrado, cuenta del usuario), todos en la **misma conversación** para que el personaje salga igual.
   - Expresiones y bocas: «EXACTAMENTE la misma imagen cambiando SOLO la boca/la expresión» → salen alineadas. Boca de anime: cerrada, milímetros, abierta.
   - Sacarlas: blob a pantalla completa por JS y `zoom` con `save_to_disk` a escala 1 → `referencias/<proyecto>/clave/`.
   - Nunca dibujar caras por código. Con niños, nada de agresión ni enfado (el filtro lo bloquea; no insistir).
3. **Movimiento grande con Veo en Flow**: fotograma inicial y final = dos dibujos clave (Veo 3.1 Lite = 10 puntos por clip; 50 puntos gratis al día). Preguntar antes de gastar.
   Bajar el clip con curl desde el `src` firmado del `<video>`. Si sale «actividad inusual», que el usuario pulse «Reintentar».
4. **A 60 fps con RIFE**: `RIFE=/ruta/rife-ncnn-vulkan python3 -I fabrica/explicado/secuencias.py [cadenas|planos]` → `referencias/<proyecto>/sec/`.
   RIFE solo entre imágenes casi iguales (boca, ojos, grito); los movimientos grandes los inventa Veo. Si falta, bajar rife-ncnn-vulkan 20221029 para macOS.
5. **Escena** `fabrica/explicado/escenas/<proyecto>.js`: `clip()` y `cad()` pintan las secuencias; encima, efectos por código en cada fotograma (`fluye` para humo, pelo y ropa al viento; `detras` para humo, papeles y brasas detrás del primer plano).
6. **Grabar**: `node fabrica/explicado/grabar.mjs <proyecto> out/<proyecto>-bruto.mp4`, y normalizar a −16 LUFS en dos pasadas (§7.3).

### 6.3 Humo, nubes y polvo «de anime»
No es humo realista: es ruido que se mueve, cortado en 2–3 tonos planos con borde de tinta, con luz dura de un lado. Se hace con código (shaders o canvas) en cada fotograma, y al final brillo, aberración cromática, grano y viñeta.

---

## 7. Reel viral vertical (Instagram)
Receta completa del que funcionó (el chorizo portuano): `fabrica/explicado/VIDEO-VIRAL.md`. El molde del viral de 10 M: `fabrica/explicado/EJEMPLO.md`.
1. Meme probado y los nombres que da el usuario, tal cual. El chiste en los 3 primeros segundos.
2. Guion `fabrica/explicado/guion_SLUG.tsv` (`escena<TAB>frase`, `*clave*`, `{voz|pantalla}`).
3. Voz: `cd fabrica/explicado && python3 voz.py SLUG --velocidad 1.2` → audio a −16 LUFS → «sí» del usuario.
4. Escena `escenas/SLUG.js`: cada cosa que dice la voz aparece en pantalla en su palabra (`M.w(frase, 'palabra')`), con su efecto. Transición de zoom, nunca barrido. Nada importante en el 20 % de abajo.
5. Hoja de revisión: `FOTOS=2,9,17 node fabrica/explicado/grabar.mjs SLUG hoja.jpg`; render: `node fabrica/explicado/grabar.mjs SLUG out/SLUG.mp4 > render.log 2>&1`.
6. Normalizar en dos pasadas: medir con `loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json` y volver a pasar con `measured_*`, `linear=true` y `-c:v copy`.

---

## 8. Herramientas: tabla de comandos
| Para qué | Comando |
|---|---|
| Servidor (siempre) | `python3 -m http.server 8765` |
| Voz del narrador (Españistán) | `python3 fabrica/herramientas/voz_frases.py GUION.tsv CARPETA [--ver]` |
| Voz de un vertical | `cd fabrica/explicado && python3 voz.py SLUG` |
| Efectos de ElevenLabs | `python3 fabrica/explicado/efectos.py` |
| Música propia | `~/qw/bin/python -I fabrica/herramientas/musica.py SALIDA.wav AMBIENTE` |
| Segundo de cada palabra | `~/qw/bin/python fabrica/herramientas/palabras.py a.mp3` |
| Tiempos de un capítulo | `python3 fabrica/titeres/tiempos.py NN` |
| Fotogramas de una escena | `node fabrica/titeres/fotos.mjs ESCENA 2 4.5` |
| Grabar una escena de títeres | `node fabrica/titeres/grabar.mjs ESCENA out/ESCENA.mp4` |
| Duraciones de escenas | `node fabrica/titeres/duraciones.mjs ESC1 ESC2 > out/duraciones-NN.json` |
| Montar un capítulo | `python3 fabrica/titeres/montar.py out/espanistan-NN.mp4 NN` |
| Shorts | `python3 fabrica/titeres/shorts05.py` (copiar por capítulo) |
| Miniaturas | `python3 fabrica/titeres/miniatura_gemini.py NN` · `python3 fabrica/titeres/miniatura_vox.py` |
| Recortar el fondo de una foto | `swift fabrica/herramientas/recorte.swift entrada.jpg salida.png` |
| Hoja de contacto | `sh fabrica/herramientas/hoja.sh CARPETA salida.jpg [columnas] [desde] [cuántas]` |
| Grabar una página con GPU | `node fabrica/herramientas/graba.mjs pagina.html salida.mp4 SEGUNDOS audio.mp3` |
| Grabar un vertical / anime | `node fabrica/explicado/grabar.mjs SLUG out/SLUG.mp4` |
| Secuencias a 60 fps (RIFE) | `RIFE=… python3 -I fabrica/explicado/secuencias.py [cadenas\|planos]` |
