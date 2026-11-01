# Vídeo viral: el chorizo portuano (cómo se hizo)

**Reel vertical de 95 s para Instagram (@siseduplica).** Lo subió el usuario el 31-10-2026.
- Archivo: `out/chorizo-portuano.mp4` (1080×1920, 30 fps, −16 LUFS).
- Guion: `guion_chorizo-portuano.tsv`. Escenas: `escenas/chorizo-portuano.js`.
- Es la receta que hay que repetir para los vídeos virales. Antes, el especial de Trump tuvo un 45 % más de saltos: lo que funciona es copiar un molde probado (el viral de 10 M de `EJEMPLO.md`) y meterle un meme.

## La fórmula
1. **Un meme probado**: un cuento con nombres de doble sentido.
   - Los nombres los da el usuario y van **tal cual**: Elver Galarga, Rosa Melano, Benito Camelo, Debora Meltrozo, la ciudad de Lomas Turbas y el chorizo portuano.
   - Nunca se explica el chiste («portuano» = «por tu ano»): se entiende solo.
2. **El tono**: narrador de documental serio, pedante, cínico y con humor negro.
   - Ejemplos: Rosa tiene 94 años y «cada año jura que no llega a Navidad»; Benito salva a Debora: «lo único útil que ha hecho en su vida».
3. **El molde del viral de 10 M** (`EJEMPLO.md`): gancho con paradoja → pregunta → descartes («no es por el precio, tampoco por el colesterol») → la historia → giro que da la vuelta al gancho → «mándaselo a…» sobre un menú de compartir que acaba en «✓ Enviado».
4. **El chiste, en los 3 primeros segundos.**
   - El usuario notó que tardaba: Elver Galarga tiene que sonar a los ≈ 3 s y el chorizo portuano a los ≈ 5 s.
   - Se quitó el dato pedante del principio; en su hueco van chistes (el cartel que el cura lee en voz alta y luego va a confesarse).
5. **Repetir la palabra clave**: «chorizo portuano» suena 9 veces y los nombres se repiten enteros en el pregón del alcalde.
6. **Final en bucle**: «Mándaselo a tu abuela, a tu hermana y a ese amigo que todavía no lo ha pillado. Y que a todos les llegue… el chorizo portuano.»
7. Usa **«¿Sabías que…?»** al empezar y **«¿Y si te digo…?»** a mitad.

## Paso a paso
### 1. Guion (`guion_chorizo-portuano.tsv`)
- Cada línea es `escena<TAB>frase`; las escenas son gancho, receta, cartel, cola, premio, giro y remate.
- `*palabra*` marca una palabra clave (recuadro en el subtítulo).
- `{voz|pantalla}` separa lo que dice la voz de lo que se lee:
  - `{Devora Meltrozo|Debora Meltrozo}`: se lee «Debora» **sin tilde**, para que suene «de-BO-ra» = devora.
  - `{Noventa y cuatro|94}`: los números van en letra para la voz y en cifra para la pantalla.
- 12 frases, ≈ 300 palabras.

### 2. Voz primero, y esperar el «sí» del usuario
- Voz de Tony (`851ejYcv2BoNPjrkw93G`, eleven_v4), un bloque por escena: `cd fabrica/explicado && python3 voz.py chorizo-portuano --velocidad 1.2`
  - La velocidad 1.2 acerca la voz al ritmo del viral (209 palabras/min).
  - Al cambiar el guion, borrar antes `audio/voz/es/chorizo-portuano/`. Si no, reutiliza bloques viejos y falla con «substring not found».
  - `--estimar` **no** estima: gasta créditos y genera voz de verdad.
- Montar un mp3 a −16 LUFS, comprobarlo con la transcripción de ElevenLabs y mandárselo al usuario (`out/chorizo-portuano-voz.mp3`).
- **No animar nada hasta que lo apruebe.**

### 3. Animación: «cada cosa que dice la voz aparece en pantalla»
Es la regla del usuario. Cada palabra con contenido tiene su imagen, su número o su etiqueta en el instante exacto en que se dice (`M.w(frase, 'palabra')`), y su efecto de sonido.

Las 7 escenas de `escenas/chorizo-portuano.js`:

| # | Tiempo | Qué pasa |
|---|---|---|
| 1 | 0:00 | Cartel de LOMAS TURBAS → fachada → zoom por el escaparate hasta Elver. Tarjetas que se tachan: existencias 40→0 «AGOTADO», susurro ≈ 30 dB, precio 2,90 €, colesterol 88 mg (USDA). |
| 2 | 0:16 | Entra Benito con campanilla y el chorizo. Elver se congela (escarcha + ❚❚), zoom dramático, bocadillos «¿CHORIZO… PORTUANO?» y «DE OPORTO. EL BUENO.» |
| 3 | 0:29 | «DÍA 2». La pizarra se escribe con tiza. El cura lo lee, corre a la iglesia y el confesionario marca «OCUPADO · 40 MIN». |
| 4 | 0:40 | Travelling por la cola hasta Rosa: la edad cuenta de 0 a 94. La báscula cuenta 200 g y los dB caen de 78 a 0 en «Silencio». Debora devora el trozo, se pone morada («ATRAGANTADA»). Benito le hace la maniobra de Heimlich: «COSAS ÚTILES: 0→1». |
| 5 | 1:02 | El alcalde en el balcón con megáfono. Trofeo «EMBUTIDO DEL AÑO». Desfile con verbos (TRAÍDO POR, PROBADO POR, DEVORADO POR). El pueblo grita a 112 dB. |
| 6 | 1:18 | Gráfico «¿POR QUÉ LO COMPRAN?»: sabor 3 %, decirlo en voz alta 97 %, con la fuente «Encuesta inventada · n = 2.340 vecinos de un pueblo que no existe». |
| 7 | 1:25 | Menú de compartir: Abuela, Hermana, «Ese amigo» con «?»; el dedo toca, se marcan todos y aparece «✓ Enviado». Cierra con un chorizo grande y «CHORIZO PORTUANO · LOMAS TURBAS». |

Piezas reciclables del archivo:
- `persona()`: personajes con boca, ojos, gestos, objetos en la mano, andar, temblar y ahogarse.
- `rotulo()`: etiqueta con línea guía que elige el lado para no cortarse en el borde.
- `numero()`: tarjeta con un número en directo.
- `bocadillo()`, `sello()`, `tacha()` y `hielo()`.
- `camara()` y `enf()`: cámara por claves; `enf` coloca un punto del mundo a la altura de pantalla que se elija.

**Zona segura:**
- Nada importante en el 20 % de abajo.
- Los subtítulos van arriba (y ≈ 330); los textos del mundo no deben chocar con ellos.

### 4. Transición: zoom, nunca barrido
- `VIDEO.transicion = 'zoom'` en `video.html`: la cámara se mete en el `foco` de la escena que sale y aterriza desenfocada en la nueva (`entra`).
- Va con el efecto `transicion.mp3`.
- El barrido lateral le pareció al usuario «de película barata».

### 5. Sonido
- Efectos de ElevenLabs con `python3 fabrica/explicado/efectos.py`, en `audio/sfx/eleven/`: campanilla, congelado, zoom, tiza, báscula, coro, shh, transición, `musica-chorizo` (guitarra portuguesa en bucle de 22 s)…
- Volúmenes: música a .08, efectos ≤ .45. `grabar.mjs` los baja solo cuando habla Tony (sidechain).

### 6. Render y repaso
1. Hojas de fotogramas para revisar las escenas: `FOTOS=2,9,17,… node fabrica/explicado/grabar.mjs chorizo-portuano hoja.jpg`
2. Render completo en segundo plano, con el registro entero (no pasarlo por `tail`, o los errores se pierden). Necesita `python3 -m http.server 8765` en la raíz:
   `node fabrica/explicado/grabar.mjs chorizo-portuano out/chorizo-portuano.mp4 > render.log 2>&1`
   - Tarda ≈ 10 min: 2.858 fotogramas en 616 s.
3. **`grabar.mjs` deja la mezcla floja (−22 LUFS).** Normalizar en dos pasadas sin tocar la imagen:
   - medir con `ffmpeg -i X.mp4 -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json -f null -`;
   - volver a pasar con `measured_*`, `linear=true` y `-c:v copy`.
   - Resultado: −16,0 LUFS y picos de −1,5 dB.
4. Invariante de sonido: LUFS, picos y silencios (`silencedetect`). Transcribir la mezcla final con ElevenLabs STT: tiene que salir el guion palabra por palabra (los efectos no tapan nada).

## Errores que no hay que repetir
- **Guiones que no dicen la palabra del meme.** Primero se rechazó uno que no decía «chorizo portuano» ni una vez.
- **Tardar en llegar al chiste.**
- **Poner tilde en Debora.**
- **Cambiar o «mejorar» los nombres que da el usuario.**
- **Etiquetas y bocadillos fuera de pantalla**: usar `rotulo()` y limitar las posiciones.
- **Personajes tapados** (Benito detrás de Debora) y **desfiles diminutos**: s ≥ 1,4.
- **Un plano general vacío** al empezar una escena: arrancar ya encima de la acción.
