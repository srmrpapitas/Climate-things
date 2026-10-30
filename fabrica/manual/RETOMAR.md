# Retomar Españistán (leer al abrir una sesión nueva)

## ▶ AHORA (30-10-2026, noche): revisión de los ep. 3–7 y lista de mejoras · para CUALQUIER IA que siga
Lee antes `CLAUDE.md` (sus reglas valen para cualquier IA): ediciones mínimas, no abrir `out/` ni vídeos, respuestas cortas en español.
**Calendario**: ep. 4 público el 30-10 a las 19:00 · ep. 5 programado el 1-11 · ep. 6 el 3-11 · ep. 7 el 5-11 · ep. 8 (pensiones) sin empezar.

**Hecho el 30-10 (noche)**
- Los golpes (`impacto`, `derrumbe`, `cristales`, `trueno`) sonaban muy fuertes. Están bajados al 40 % en el código de las escenas de los ep. 3–7 y en `intro.js`, `intro2.js`, `intro-07.js` y `outro.js`. **Regla: golpes ≤ 0,4 (lo normal, 0,15–0,3).**
- Los vídeos ya montados y subidos **no cambian** hasta volver a grabar y montar (abajo).

**Re-mezclar un episodio** (ejemplo: ep. 5; ≈ 4 s de render por segundo de vídeo)
1. Servidor en la raíz del repo, en otra terminal (`grabar.mjs` lee `localhost:8765`): `python3 -m http.server 8765`
2. Grabar las escenas y montar:
   ```sh
   for s in 05-intro 05-resta 05-tenerife 05-madrid 05-barcelona 05-leyes 05-grua 05-solucion outro; do node fabrica/titeres/grabar.mjs $s out/$s.mp4; done
   python3 fabrica/titeres/montar.py out/espanistan-05.mp4 05
   ffmpeg -i out/espanistan-05.mp4 -c:v copy -af alimiter=limit=0.89:level=false out/espanistan-05-limitado.mp4
   ```
3. Escenas con golpes fuertes: ep. 3 `apertura`, `intro`, `mano-daga`, `frascos`, `outro` · ep. 5 las de arriba · ep. 6 `intro2`, `06-familias`, `outro` · ep. 7: `sh fabrica/titeres/render07.sh` (graba a 30 fps) y además `outro`.
4. YouTube no deja cambiar el archivo: subir el nuevo, copiar título, descripción, miniatura y pantalla final, programarlo a la misma hora y borrar el viejo **solo con el «sí» del usuario**.
5. Borrar `out/titeres_*` al acabar (llenan el disco).

**Lo que falta, por orden de impacto**
1. **Pedir comentarios.** Ningún episodio dice «comenta». Al final, tras la Pregunta del Decano: «Te leo en comentarios». En YouTube, fijar un comentario con esa misma pregunta (ninguno lo tiene).
2. **Shorts de los ep. 4–7: no hay ninguno.** La cola de `SHORTS-CALENDARIO.md` (ep. 1–3) se acaba el **6-11 a las 21:00**.
   - `fabrica/titeres/shorts.py` está atado al ep. 3: cambiar `CAPITULO`, `GUION`, `SECUENCIAS_0N` y `tiempos-0N.js`, y escribir la lista `SHORTS` (bloque de inicio, bloque de fin y gancho en dos líneas).
   - 2 al día, a las 14:00 y a las 21:00.
3. **Re-mezclar los ep. 5, 6 y 7 antes de que salgan** (el 5 tenía 15 golpes fuertes).
4. **Avance del capítulo siguiente** al final. Solo lo tienen el 3 y el 7.
5. **En YouTube:**
   - Pantalla final en los ep. 4 y 5: comprobar que la tienen.
   - Tarjeta al ep. 5 en el ep. 6, donde dice «como vimos en el capítulo anterior».
   - Lista de reproducción «Españistán», en orden.
6. **Subtítulos `.srt`** por episodio, con el texto exacto del guion y los tiempos de `tiempos-0N.js`. Los automáticos destrozan «Feijolo», «Acascar» y «Españistán». Aún no hay script.
7. **Datos «Por comprobar» del ep. 6** (`DIFUSION-EP06.md`, líneas 78 y 92): comprobarlos antes del 3-11.
8. **Biografía del canal**: dice «cada viernes», pero se publica cada 2 días.
9. **Para el ep. 8:**
   - Pregunta abierta antes del segundo 20. En el ep. 4 llegaba hacia el 0:50 y en el 5 hacia el 1:48.
   - Transiciones 60/40. El ep. 7 volvió a casi todo viento: 15 vientos y 3 metamorfosis.

**Comparativa de guiones (30-10)**

| Ep. | Voz | Gancho | 1.ª pregunta | Golpes fuertes |
|---|---|---|---|---|
| 3 | 6:56 | ❌ «en los episodios anteriores» y cita a los 10 s | ~1:06 | 5 |
| 4 | 7:28 | ✅ dato | ~0:50 | ~20 en el vídeo (ya bajados en el código) |
| 5 | 7:20 | ✅ persona y cifra | ~1:48 | 15 |
| 6 | 9:01 | ✅ el mejor: cifra y pregunta a los 13 s | 0:13 | 4 |
| 7 | 10:13 | ✅ acertijo | 0:00 | 3 |

- Ritmo: 141–145 palabras por minuto en todos. Está bien.
- El ep. 3, el de peores métricas, es el que rompe las reglas de los primeros 30 s.

**Repos de GitHub que valen la pena** (comprobados el 30-10-2026, todos de licencia libre). No cambian el motor: se añaden.
1. **Rhubarb Lip Sync** (`DanielSWolf/rhubarb-lip-sync`). Hoy la boca de `habla` es un seno al azar (`titeres.js:234`), no sigue la voz.
   - Rhubarb saca las formas de boca (A–H, X) de cada audio: `rhubarb -r phonetic -f json f1.mp3`. `phonetic` es el modo para el español.
   - Mapear cada forma a `o.boca` (A y X = 0 … D = 0,8).
2. **p5.brush** (`acamposuribe/p5.brush`): fondos con acuarela, tinta y tramas. Se pintan una vez a PNG, así que no ralentizan el render. La skill `painted-animation` lo usa.
3. **perfect-freehand** (`steveruizok/perfect-freehand`): trazos de tinta de grosor variable para siluetas y la «tinta viva».
4. **simplex-noise** (`jwagner/simplex-noise.js`): viento con ráfagas y remolinos (curl noise), lo que pide la nota «Más natural, el viento y la tinta».
5. **flubber** (`veltman/flubber`): una silueta se convierte en otra. Metamorfosis sin cortar.
6. **Matter.js** (`liabru/matter-js`): caídas y derrumbes con física (papeles, monedas, cosas que caen).
7. Opcionales: `paper-design/shaders` (grano y papel) y `PavelDoGreat/WebGL-Fluid-Simulation` (tinta que se disuelve de verdad; probar antes, puede ir lento sin GPU).

No recomendados:
- Cambiar de motor (Remotion, Motion Canvas): se pierde todo lo hecho, y Remotion es de pago para empresas de más de 3 personas.
- ToonCrafter: necesita una GPU grande.
- OpenToonz, Pencil2D y Rive: son para animar a mano.

**Especial 10k de Instagram (@siseduplica, 8.206 seguidores el 30-10)**
- Descartado «la gente que se duplica». Al usuario no le gustó: «mucho bomboclat».
- Idea buena: el pabellón del ring de boxeo (`fenomenos/boxeo.js`), que se llena con los @ de los seguidores uno a uno y se inaugura a los 10.000.
- Falta la lista de @, que solo se ve con la sesión de Instagram del usuario.
- Archivos de la prueba descartada: `escenarios/seguidores.js`, `fenomenos/seguidores.js` y `audio/voz/es/seguidores*`. Ya no están en `lista.js` (daba un error de WebGL). Borrarlos si no se usan.

## ▶ AHORA (30-10-2026, tarde): ep. 6 programado (3-11) y ep. 7 programado (5-11, 19:00, https://youtu.be/IQfOpvF1lPs). Siguiente: shorts ep. 4–6, luego ep. 8 (pensiones)
- **Ep. 6**:
  - Miniatura `out/miniatura-ep06.jpg` (`sh fabrica/titeres/miniatura.sh 6`, escena `escenas/miniatura-ep06.js`).
  - Carpeta `~/Desktop/Espanistan-06/` con el vídeo y la miniatura.
  - Título, descripción, capítulos y fuentes en `DIFUSION-EP06.md`.
  - Estreno: **martes 3-11-2026, 19:00**. **Programado** en YouTube, con pantalla final: https://youtu.be/ubVxHmiKRfA
- **Ep. 7** (tema elegido por el usuario): la escuela prusiana que enseña respuestas, frente a la élite que enseña preguntas, con filosofía, lógica (falacias) y modelos mejores.
  - Datos y fuentes en `historias/espanistan/07-educacion.md`, con una lista «Por comprobar».
  - Guion: `guion_espanistan-07-8min.tsv` (50 bloques, 75 frases, ≈ 11 min, sin relleno: no hace falta). Ya lleva PISA 2025, las citas del Decano (Fichte, Séneca, Plutarco, Aristóteles, Montaigne) y el avance del ep. 8. Frases de los personajes: `guion_espanistan-07-personajes.txt`.
  - Planos, fondos nuevos y mejoras del motor (60 fps, tinta y viento): `fabrica/titeres/CAPITULO-07-PLANOS.md`.
  - **Siguiente**:
    1. ~~`prueba-tinta.js` a 60 fps~~: hecho y aprobado (60 fps; borradores con `FPS=30`).
    2. ~~Voces~~: HECHAS (30-10): Gabo en `audio/voz/es/espanistan-07-gabo/` (50 bloques, 612,6 s) y f1-f3 en `espanistan-07-personajes/`; `tiempos-07.js` real. Para escuchar: `~/Desktop/Espanistan-07/`.
    3. Sin parlamento, noria ni balanza: todos los fondos son nuevos.
    4. Hecho (30-10): `decorados-07.js` (20 fondos y objetos nuevos), las 12 escenas `07-*.js` y la intro `intro-07.js`.
       Borrador a 30 fps: `sh fabrica/titeres/render07.sh` → `out/espanistan-07-borrador.mp4`. Revisado y aprobado (30-10): se publica este, a 30 fps.
       60 fps EN PAUSA (el usuario decide más adelante): `node fabrica/titeres/grabar.mjs 07-xxx` sin FPS (≈ 5 h) y luego `python3 fabrica/titeres/montar.py out/espanistan-07.mp4 07`.
    4. `decorados-07.js` y las escenas.
- **Ep. 8 = las pensiones y el INSS** («la gran estafa del mundo moderno», en palabras del usuario). El ep. 7 termina con su avance.
- Después del ep. 7: shorts de los ep. 4 a 6, programados (como en `SHORTS-CALENDARIO.md`).

## ▶ AHORA (31-10-2026, madrugada): ep. 6 MONTADO con la temporada 2 («tinta viva»)
- **Motor nuevo** (`titeres/README.md`):
  - Movimiento: muelles, anticipación, desenfoque de movimiento, giros con tres cuartos y `miraCamara`.
  - Tinta viva: `transicion: 'metamorfosis'` y, por actor, `forma` (se forma y se deshace con hojas o tinta). El viento las lleva con `T.campo`.
- **Regla 60/40** en `CAPITULO-SIGUIENTE.md`: de cada 5 cambios de plano, 3 sin cortar (metamorfosis, `forma`, cámara) y 2 transiciones de verdad.
- **Ep. 6**:
  - Escenas `escenas/06-*.js` (11) y decorados nuevos en `decorados-06.js`.
  - `G.k(bloque, 'palabra')` pone cada cosa en la palabra exacta (`tiempos.py` guarda ahora el texto).
  - Montaje: `python3 fabrica/titeres/montar.py out/espanistan-06.mp4 06`.
- **Pendiente**: que el usuario lo revise; miniatura y difusión (`DIFUSION-EP06.md`); programarlo.
- **Ep. 7: a 60 fps** (lo pidió el usuario, para comparar con el 6, que va a 30). `montar.py` fuerza 30 fps: cambiarlo para ese capítulo.
- **Ep. 6 HECHO**: `out/espanistan-06.mp4` (10:19). Hay una copia para el móvil en `out/espanistan-06-movil.mp4`. El usuario lo aprobó («perfecto»).
- **Para el ep. 7 (nuevo chat)**: leer las «Notas del ep. 6, para el ep. 7» en `CAPITULO-SIGUIENTE.md`.
  1. Pasar a 60 fps. Hay que tocar `fps` en las escenas, `grabar.mjs` y `montar.py`.
  2. Hacer el viento y la tinta más naturales. Primero, un `prueba-tinta.js` a 60 fps para enseñárselo al usuario.
  3. Dejar ≥ 3 s entre una formación con tinta y el siguiente cambio.
  4. Que la tinta sea coherente.

## ▶ AHORA (30-10-2026, noche): ep. 6 «Los que llegan» (inmigración) con las VOCES HECHAS; faltan los fondos y las escenas
- **Ep. 5 PROGRAMADO**: domingo 1-11-2026 a las 19:00 (https://youtu.be/MY7-rw8KPUA), con su miniatura. El ep. 4 sale el 30-10 a las 19:00.
- **Capítulos** (minutos por tema) puestos en las descripciones de los ep. 4 y 5 en YouTube (30-10). Desde ahora, todos los episodios los llevan (`CAPITULO-SIGUIENTE.md`).
- **Canal**: el usuario lo renombró a «TeatroAnimadoTv» (@animadotvclaude). Banner y foto de perfil publicados. La biografía dice «cada viernes»: el ep. 5 sale en domingo.
- **Métricas (30-10)**:
  - La mitad del público se va antes del segundo 30. Quien pasa del minuto se queda hasta el final (≈ 20 %).
  - El ep. 2 es el modelo: 7,6 % de clics y 49 % a los 30 s. El ep. 3 es el peor: 3 % y 29 %.
  - Regla nueva: «Los primeros 30 segundos», en `CAPITULO-SIGUIENTE.md`. Revisar los ep. 4 y 5 el lunes.
  - Hay una copia privada del ep. 3 (aZYWl6CUDoI) que el usuario debería borrar.
- **Ep. 6 · guion**: `fabrica/herramientas/guion_espanistan-06-8min.tsv`.
  - 58 bloques: b1–b50 de inmigración, b51–b58 el tramo «coherencia» (Paolo Iglesias, Irena Montera, Alviso). El tramo va tras b36.
  - Fuentes y lo que queda por comprobar: `DIFUSION-EP06.md`.
  - Nombres de sátira aprobados: **Paolo Iglesias**, **Irena Montera**, **Alviso**.
  - El usuario pidió: datos que incomodan a izquierda y derecha; soluciones con lógica que piensen también en los de aquí (vivienda); todo resumido, que no aburra; **≥ 9 min** (con 8 ya se monetiza).
- **Voces HECHAS** (≈ 7.200 créditos):
  - Gabo en `audio/voz/es/espanistan-06-gabo/` (58 bloques, 540 s).
  - Personajes en `espanistan-06-personajes/`: f1 Sanchís (Javier), f2 Feijolo (Carmelo), f3 Acascar (Leónidas `YKrm0N1EAM9Bw27j8kuD`).
  - `escenas/tiempos-06.js` real. Total ≈ 9 min 45 s con intro y outro.
- **Plan de planos detallado**: `fabrica/titeres/CAPITULO-06-PLANOS.md`, con 12 secuencias más `06-coherencia`, la lista de fondos nuevos por hacer y las tablas frase → imagen.
- **Temporada 2 («reboot»)**:
  - Modo `cartoon: true` por plano. Lo pidió el usuario: «nivel Cartoon Network, nada robótico».
    - Se encogen antes del gesto y se estiran al lanzarlo; rebotan; acción `sorprende`; líneas de velocidad.
    - Vida en reposo aunque el plano sea `quieto`; la cabeza y los antebrazos llegan tarde; los ojos saltan.
    - Prueba antes/después: `escenas/prueba-cartoon.js` (vídeo en el Escritorio).
  - Intro nueva `escenas/intro2.js` (vídeo en `out/intro2.mp4`). Se alterna con `intro.js`: los pares, la nueva.
  - Fondos nuevos: `cieloNoche`, `mapaPartido`.
- **Siguiente**:
  1. Fondos nuevos del plan (`playa` con nadadores, `movil`, `invernadero`, `barra`, `sillon`, `ventanilla`, `rejas`, `impresora`, `cumbre`, `marcador`, `grifo`, `aula`).
  2. Escenas `06-*` con `T.guion([...])` y `cartoon: true`. Revisar con `fotos.mjs`, grabar con `grabar.mjs` y borrar `out/titeres_*`.
  3. Añadir `SECUENCIAS_06` en `montar.py` (`intro2`; `06-coherencia` tras `06-familias`), montar, y después miniatura y difusión.
- **Mañana (31-10)**: Patreon (el usuario crea la cuenta; Claude prepara texto, niveles e imágenes).
- **Git**: nada de esto tiene commit (rama `claude/espanistan-ep04`, con cambios viejos sin commit). Hacer commit solo si el usuario lo pide.

## ▶ AHORA (29-10-2026): ep. 5 «La casa de los dos» (vivienda), guion en borrador
- Guion: `historias/espanistan/05-vivienda.md` (≈ 8 min). Enfoque del usuario: problemas que deja el bipartidismo, ciudad a ciudad
  (Tenerife/Canarias, Madrid, Barcelona), okupación, leyes absurdas, falta de casas, casos reales y motivos reales, solución con lógica.
- Guion APROBADO (29-10). Plan de planos hecho: `fabrica/titeres/CAPITULO-05-PLANOS.md`, en la línea del ep. 4 (el usuario lo pidió así).
  Comprobados: Casa Orsola, ley del suelo 2024, juicio rápido (LO 1/2025), moratoria (RDL 2/2026).
  Motor mejorado (pedido del usuario): giros naturales de los títeres y transición `paneo` (ver «Movimiento y cine» en el plan).
- Hecho (29-10): `guion_espanistan-05-8min.tsv` (62 frases, 50 bloques), `guion_espanistan-05-personajes.txt`, `tiempos.py 05` (ESTIMADOS),
  escenas `05-gancho` (A, b1), `05-resta` (B, b2–6) y `05-tenerife` (C, b7–13), revisadas con fotogramas. Decorados nuevos al final de `decorados.js`
  (cuarto, litera, tarta, columnas, contador, mapa05, llave, teide, mar, hoteles, caravana, cueva, chabola, escaparate, pancartas, verja, maleta).
  Fichas: lucia, dani, camarero.
- Hecho después: D `05-madrid` (b14–18, entra con paneo desde Tenerife) y E `05-barcelona` (b19–25, entra con paneo desde Madrid).
  Decorados: grua, munecas, recibo (titulo), fachada (mano con gemelo), olla, huchaGrande, manzanas; maleta acepta color; columnas acepta panel.
- Hecho después: F `05-leyes` (b26–32, paneo al calendario) y G `05-grua` (b33–43 + f1 + f2). **El usuario: no copiar la noria del ep. 4** salvo que se hable
  del bipartidismo; en G se usa una grúa gigante cuya cabina cambia de azul a rojo con cada presidente («turnándose la grúa»).
  Decorados: puertaCasa, relojArena, calendario, caja, bloque (persianas), megafono, archivador, carretilla, bola, leyRota; grua acepta cabina; munecas acepta rojos.
- Hechas también H `05-solucion` (resta con 4 piezas de oro, Tokio, Viena con barras, persianas que suben, la pieza 4 entre las dos familias, reloj de 100 años),
  I `05-balanza` (sin noria; final en el cuarto con la grúa que arranca por la ventana) y `05-intro`. Todas las escenas del ep. 5 escritas.
- Voces HECHAS (29-10): narrador en `audio/voz/es/espanistan-05-gabo/` (50 bloques, 438 s) y f1/f2 en `espanistan-05-personajes/`; `tiempos-05.js` real. Total ≈ 8 min 30 s con intro y outro.
- MONTADO (29-10, 22:46): out/espanistan-05.mp4, 8 min 24 s. grabar.mjs arreglado (mezcla a WAV antes del AAC; ffmpeg se colgaba). Ojo: el disco se llenó con los PNG; borrar out/titeres_* tras grabar.
- 30-10: datos comprobados (moratoria corregida a 2030 con nueva voz del b29; Plan Vive 6.419/14.000). Miniatura, banner y perfil en ~/Desktop/Espanistan-05/.
  Título y descripción: DIFUSION-EP05.md. Programar el viernes 6-11 a las 19:00.
- Canal: nombre «AnimadoTV» (@animadotvclaude) y biografía aprobada: «Historias reales contadas por títeres. Los hilos los ponemos nosotros; los datos, no. /
  Política, historia, ciencia o lo que toque: cada vídeo explica algo de verdad, con fuentes. / Primera serie: Españistán. / Nuevo capítulo cada viernes a las 19:00. Animado con ayuda de Claude (IA).»
- Pendiente: subir ep. 5 y cambiar el canal (Chrome); después, analizar métricas de YouTube (retención: dónde sube y baja).
- MAÑANA (31-10): Patreon. El usuario crea la cuenta; Claude prepara texto, niveles (2 € créditos, 5 € un día antes, 10 € votar tema) e imágenes.

## ▶ AHORA (28-10-2026, 18:30): ep. 4 TERMINADO y PROGRAMADO en YouTube
- **Ep. 4 «Las dos familias»** (PP y PSOE, 8 min 25 s) programado como público el **viernes 30-10-2026 a las 19:00**: https://youtu.be/VR17iwWJPzs
  Vídeo y miniatura en `~/Desktop/Espanistan-04/`. Textos aprobados y estado: `fabrica/manual/DIFUSION-EP04.md`. Cómo se hizo: `fabrica/titeres/CAPITULO-04-PLANOS.md` («Hecho»).
- Git: rama `claude/espanistan-ep04`, commit `f5f351d` (solo local, sin push). Quedan sin commit cambios viejos del ep. 3 y otros (no son de esta tarea: preguntar antes de tocarlos).
- **Siguiente, por orden (preguntar al usuario cuál quiere):**
  1. Antes del viernes 19:00: en YouTube Studio, mirar que las comprobaciones del vídeo salieron sin problemas, y que el usuario lo vea entero.
     Si pide cambios: re-grabar solo esa escena (`node fabrica/titeres/grabar.mjs 04-ESCENA out/04-ESCENA.mp4`), `python3 fabrica/titeres/montar.py out/espanistan-04.mp4 04`, limitador de audio
     (`ffmpeg -i … -c:v copy -af alimiter=limit=0.89:level=false …`) y volver a subir (YouTube no deja cambiar el archivo: subir nuevo y borrar el viejo solo con permiso).
  2. Shorts del ep. 4 (como los del ep. 1–3: `fabrica/manual/SHORTS-CALENDARIO.md`) y difusión en X (borradores en `X-BORRADORES.md`; todo texto nuevo, con el «sí» del usuario).
  3. Buscar skills y repos de GitHub para optimizar y gastar menos (el usuario lo autorizó; NO ofrecerlo como sesión aparte).
  4. Ep. 5: preguntar el tema.
- Pendiente del ep. 4: cita de Escohotado solo si el usuario da la fuente. Voces: Gabo `o0SveC0zgHFuCsEO3vHR`, Sanchís = Javier narrador `PToUZ7lhIUiz1SP94rGo`, Feijolo = Carmelo `5egO01tkUjEzu7xSSE8M` (v4). Créditos ElevenLabs: quedan ≈ 27.500.
- Subir a YouTube: Chrome solo sube archivos < 10 MB; el usuario elige el vídeo grande en «Seleccionar archivos» y Claude rellena el resto (título, descripción, miniatura, «no es para niños», Programar).

**28-10-2026: difusión del ep. 3 en curso** (shorts en YouTube hechos; falta X) → `fabrica/manual/DIFUSION-EP03.md`.

**Estado a 27-10-2026: ep. 3 terminado** (Acascar y Vox, 10 min, HD en `videos/espanistan-03/`). Rama con todo: `claude/new-session-k0kf29`.
**Siguiente: ep. 4, el bipartidismo** → seguir `CAPITULO-SIGUIENTE.md` (procedimiento al día). Lo de abajo es el historial del ep. 2.

---

Estado a 26-10-2026. Rama de trabajo: la que indique la sesión. Si no tiene esto, traer `claude/quirky-thompson-xa9rrz`.
El contenedor es nuevo en cada sesión: **lo que no está en git hay que reinstalarlo** (VoiceStudio, Whisper, PhotoCraft).

## 1. Qué está hecho
- **Ep. 1 · intro aprobada**: `fabrica/videos/espanistan-01-intro/` (HyperFrames, voz D original, 30 s). Es el **esqueleto**: copiar la carpeta para cada vídeo nuevo.
- **Ep. 2 · guion**: `historias/espanistan/02-feijolo.md` (con fuentes y lista «Comprobar antes de publicar») y `fabrica/herramientas/guion_espanistan-02.txt` (44 frases, una por línea, números en letra).
- **Dibujo base de Feijolo**: `historias/espanistan/img/feijolo.webp` (ElevenLabs, flujo «Españistán ep. 2 · Feijolo»).
- **Skills** en `.claude/skills/`: hyperframes, hyperframes-cli, hyperframes-registry, media-use, voicestudio, find-skills, photocraft, storytold, storytold-install.

## 2. Decisiones del usuario (no volver a preguntar)
- Ep. 2 = **el PP entero** (no solo Feijolo): qué es, historia, escándalos, promesas incumplidas, datos reales, que la gente saque sus conclusiones. Nombre del líder: **Feijolo**.
- Guía protagonista: **el Decano** (el profesor de la lupa), estilo Platón: pregunta en vez de dar respuestas; un filósofo por bloque.
- **Mapa de corrupción por comunidades** (fuente IREA-UB 2022; si se puede, añadir el repositorio del CGPJ).
- Animación: **más marioneta y más fotogramas**: personajes por capas (cabeza, mandíbula, brazos, ojos), saludo, cabeceo, boca con la voz, parpadeo, **zoom al protagonista**. **Menos efectos de sonido** cuando la cámara va a las personas.
- Voz: **CosyVoice3** en VoiceStudio (gratis, Apache-2.0, uso comercial), clonando la voz D. Primero una frase de prueba para que el usuario la compare con la original.
- Alcance ahora: **guion + intro (~35 s)**. Si gusta, el episodio entero.
- Siguientes capítulos: ep. 3 **Abascal**, ep. 4 **el bipartidismo**.
- **No gastar créditos de ElevenLabs** (26-10-2026). Todo gratis y local: dibujos ya existentes recortados en piezas con Python y animados con HyperFrames; voz con CosyVoice3. Nada de PhotoCraft (no hace falta).
- Hablar en español, corto y sin tecnicismos. Buscar skills con `npx skills find <tema>` cuando falte algo.

## 3. Pendiente (en este orden)
1. **(Hecho si existe `feijolo.webp` nuevo)** Feijolo se parecía a Rajoy. Hacer **una** edición con ElevenLabs (≈430 créditos) sobre `feijolo.webp`: más calvo arriba con entradas grandes, pelo y barba **blancos** y cortos, cara más **alargada y delgada**, gafas finas al aire. Misma postura. Modelo `gpt-image-2.5-sunburst` con la imagen como referencia (raw de GitHub: `https://raw.githubusercontent.com/srmrpapitas/Climate-things/<rama>/historias/espanistan/img/feijolo.webp`).
2. **(Hecho)** Feijolo recortado: `historias/espanistan/marionetas/feijolo/` (cuerpo, cabeza, mano + `marioneta.json`; herramienta `fabrica/manual/herramientas/marioneta.py`). Giros suaves: cabeza ±3°, mano ±8°. Decano: `marionetas/decano.json` (ojos/boca sobre la portada). Antes ponía: Recortar a Feijolo en capas con PhotoCraft (§5) o, si no está, con Python (quitar el fondo beige liso por color, y separar cabeza, mandíbula y brazos con polígonos). Hacer lo mismo con el Decano, recortándolo de `portada.webp`.
3. **Voz**: (26-10: frase 1 generada y enviada al usuario, `fabrica/videos/pruebas-voz/`; ~2,5 min por frase en CPU; perfil «Voz D» = ref altura/01.mp3). Instalar VoiceStudio + CosyVoice3 (§4), clonar la voz D y generar la frase 1 → mandarla al usuario junto a `audio/voz/es/espanistan-01/01.mp3`.
4. Si la voz gusta: frases 1-4 (la intro) → `audio/voz/es/espanistan-02/NN.mp3` → tiempos con `fabrica/manual/herramientas/tiempos.py`.
5. **Intro del ep. 2** en `fabrica/videos/espanistan-02-intro/`, copiando `espanistan-01-intro/`. Planos: cueva con la sombra de Feijolo → el Decano entra y se ajusta las gafas (Santayana) → Feijolo-marioneta saluda sobre el mapa (zoom) → «Mismas reglas». Música `musica.py`; efectos suaves en los personajes. `npx hyperframes@0.8.204 check`, capturas con `snapshot` y render.

## 4. VoiceStudio + CosyVoice3 (cómo se instaló; hay trampas)
```sh
git clone --depth 1 https://github.com/debpalash/VoiceStudio.git /home/user/VoiceStudio
cd /home/user/VoiceStudio && OMNIVOICE_TORCH_VARIANT=cpu node scripts/setup-api.mjs        # ~2,3 GB, unos minutos
bun scripts/dev-backend.mjs   # en segundo plano → http://localhost:3900 (esperar a que /health diga "ok")
curl -X POST localhost:3900/models/install -H 'Content-Type: application/json' -d '{"repo_id":"FunAudioLLM/Fun-CosyVoice3-0.5B-2512"}'
```
Trampas:
- **Disco**: el motor pide 14 GB + 5 de margen. Bajar el margen en la copia local: en `backend/services/sidecar_install.py`, `MIN_FREE_GB = 0`, y reiniciar el servidor.
- **GitHub bloquea los `.tar.gz`** (403) y el instalador falla con Matcha-TTS. Antes de instalar, clonar las piezas con git en sus revisiones (y escribir la marca):
  ```sh
  T=/root/.omnivoice/engines/cosyvoice/CosyVoice/third_party   # existe tras el primer intento de instalación
  git clone -q https://github.com/shivammehta25/Matcha-TTS.git $T/Matcha-TTS && git -C $T/Matcha-TTS checkout -q dd9105b34bf2be2230f4aa1e4769fb586a3c824e && echo dd9105b34bf2be2230f4aa1e4769fb586a3c824e > $T/Matcha-TTS/.voicestudio_source_revision
  git clone -q https://github.com/JeremyCCHsu/Python-Wrapper-for-World-Vocoder.git $T/PyWorld && git -C $T/PyWorld checkout -q f31ad88d543fdaebbda2d0c9a5e4d4f991ae0b6c && echo f31ad88d543fdaebbda2d0c9a5e4d4f991ae0b6c > $T/PyWorld/.voicestudio_source_revision
  mkdir -p $T/PyWorld/lib && git clone -q https://github.com/mmorise/World.git $T/PyWorld/lib/World && git -C $T/PyWorld/lib/World checkout -q d625e7608ca23a870018f01e7c562ac683d9847f && echo d625e7608ca23a870018f01e7c562ac683d9847f > $T/PyWorld/lib/World/.voicestudio_source_revision
  ```
- Instalar el motor: `curl -X POST localhost:3900/engines/sidecar/cosyvoice/install` y seguirlo con `.../install/status`. Al acabar, se puede borrar la copia duplicada de los pesos en `~/.cache/huggingface/hub/models--FunAudioLLM--Fun-CosyVoice3-0.5B-2512` (9 GB) si el motor usa los suyos.
- Clonar la voz: `POST /profiles` (multipart: `name`, `ref_audio=@audio/voz/es/altura/01.mp3`, `ref_text`, `language=es`). El `ref_text` está en `fabrica/manual/herramientas/voz_qwen.py` (REF_TEXTO). Generar: `POST /generate` con `text`, `profile_id`, `engine=cosyvoice`, `language=es`. Ver la skill `voicestudio` y `GET /openapi.json`.
- **OmniVoice** (el motor por defecto) es **no comercial**: no usarlo para el canal.

## 5. PhotoCraft (storytold)
- El control de seguridad bloqueó su instalador (programa externo con pocos usuarios), y Claude no puede darse permisos a sí mismo.
  El usuario debe crear él mismo `.claude/settings.json` en GitHub (rama de trabajo → carpeta `.claude` → Add file → Create new file → Commit) con:
  ```json
  { "permissions": { "allow": ["Bash(python3 .claude/skills/storytold-install/scripts/storytold_tools.py:*)"] } }
  ```
  y abrir una sesión nueva después. Si el archivo no existe, recortar con Python.
- Instalar y comprobar: `python3 .claude/skills/storytold-install/scripts/storytold_tools.py install photocraft` y luego `... verify photocraft`. Usar `photocraft-cli` por su ruta absoluta (la da `status`); leer la skill `photocraft` antes.
- Si sigue bloqueado: hacer el recorte con Python, sin perder tiempo.

## 6. Whisper (tiempos)
`python3 -m venv /home/user/qw && /home/user/qw/bin/pip install -q faster-whisper soundfile`, y después `/home/user/qw/bin/python -I fabrica/manual/herramientas/tiempos.py VOZ.mp3 > tiempos.json`.
