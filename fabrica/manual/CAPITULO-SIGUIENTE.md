# Españistán · cómo hacer el capítulo siguiente (pegar esto en una conversación nueva)

> **Formato nuevo desde el 28-10-2026 (manda sobre todo lo de abajo; el usuario: «todos los episodios se harán así»):**
> - **El capítulo entero animado con los títeres** (`fabrica/titeres/`), a lo Samurai Jack: color plano, siluetas, franjas de cine, pantalla partida,
>   cortes secos dentro de un lugar y viento entre lugares. Nada de fotos que se mueven ni de retratos a lápiz.
> - **30 fps** en todas las escenas; **≈ 8 minutos** con la historia y las frases de los personajes (si el guion se alarga, apretarlo sin tocar los datos).
> - Narrador **Gabo** `o0SveC0zgHFuCsEO3vHR`, modelo **eleven_v4**, la voz tal cual, en frases enteras con entonación enlazada (`fabrica/herramientas/voz_frases.py`).
> - Final con el **outro** `fabrica/titeres/escenas/outro.js` (el Elegido salta al «me gusta», pisa SUSCRÍBETE y se cuelga de la campana).
> - Pasos: guion → plan de planos (ejemplo: `fabrica/titeres/CAPITULO-03-PLANOS.md`) → narrador (pedir permiso y decir los créditos) →
>   `python3 fabrica/titeres/tiempos.py` → escenas con `T.guion([...])` → revisar con `fotos.mjs` → grabar con `grabar.mjs`.

## Los primeros 30 segundos (métricas de YouTube, 30-10-2026; manda para el ep. 6 y siguientes)
En los ep. 1–3 la mitad del público se va antes del segundo 30; quien pasa del minuto suele quedarse hasta el final (≈ 20 %).
- **La primera frase es el dato más fuerte del capítulo, con una cifra y una persona** («31 años y en litera»). Nunca «En el episodio anterior…».
- **La cita de filósofo, nunca al principio**: después del gancho o de la intro. En las métricas, las citas no hacen subir la curva.
- **Antes del segundo 20, una pregunta abierta** que solo se responde viendo el vídeo («¿por qué faltan 750.000 casas?»).
- Lo que más se vuelve a ver (ep. 2): **cifras concretas y sentencias con fecha** («ganó con 137, necesitaba 176»; la caja B). Que salgan pronto y a menudo.
- Título y miniatura deben prometer lo que dicen los primeros 10 s (ep. 3: 3 % de clics y 29 % a los 30 s; ep. 2: 7,6 % y 49 %).
- Capítulos en la descripción (como el ep. 3): «Capítulos:» y una línea por secuencia, `m:ss Tema`, la primera en 0:00, cada una ≥ 10 s (la intro va con el gancho).
  El inicio de cada secuencia = suma de (duración de `out/<sec>.mp4` − 0,5) de las anteriores (lo que hace `montar.py`).

## Antes de montar cada capítulo (checklist, 30-10-2026)
- Golpes (`impacto`, `derrumbe`, `cristales`, `trueno`) con `volumen` ≤ 0,4 (lo normal, 0,15–0,3), siempre por debajo de la voz.
- Primera frase: el dato más fuerte, con cifra o persona, o un acertijo (el bate y la pelota del ep. 7). Pregunta abierta antes del segundo 20.
- Final: Pregunta del Decano → «Te leo en comentarios» → avance del capítulo siguiente → outro.
- Transiciones 60/40: contarlas al escribir cada secuencia.
- El mismo día que se programa:
  - shorts;
  - comentario fijado con la pregunta del Decano;
  - pantalla final y tarjeta al capítulo que se cite;
  - lista de reproducción;
  - subtítulos `.srt`.

## Lecciones del ep. 3 para el ep. 4 (valoración del usuario, 28-10-2026: «por lo demás está perfecto»)
**Lo que funcionó y se repite**
- **Los frascos (`escenas/frascos.js`) son el modelo**: cada cosa que dice el narrador tiene su propio objeto en pantalla y reacciona
  justo cuando se nombra (el sello cae al decir la etiqueta). Imagen y voz cuentan lo mismo a la vez.
- **El viento es la mejor transición**: es la de por defecto entre lugares. Las demás (tinta, humo, tajo), solo de vez en cuando.
- Los planos se cuadran solos con el audio (`tiempos.py` + `T.guion`).
- **Intro** (`escenas/intro.js`, 9,5 s), justo después del gancho: voz de Gabo ya grabada; en cada capítulo solo cambia `EPISODIO`.
- **Outro** de 12 s como máximo, con la voz desde el segundo 0 y cada palabra sobre su acción: «like» en el pulgar, «suscríbete» en el botón,
  «campana» justo antes de que suene. Si una frase de voz no cuadra con la acción, se parte por sus pausas (sin regenerarla).
- Nunca hay segundos muertos: la voz entra en menos de 1 s en cada secuencia, y no hay esperas largas entre acciones.

**Lo que hay que mejorar**
1. **Una lógica mejor entre audio e imagen** (lo más importante). Ejemplo de lo que no se entendió: el PP y Vox hablando uno frente al otro.
   - Antes de escribir una escena, hacer una tabla: *frase → qué se ve → qué cambia justo en la palabra clave*.
   - Prueba: **si la imagen no explica la frase sin sonido, se cambia**.
   - Metáforas con objetos (frascos, balanza, muralla, tronos, daga) en vez de dos personajes de pie hablando.
   - Cada personaje lleva su nombre la primera vez que sale; el usuario dudó de quién era quién.
   - Que no queden frases sin una escena propia: hacer crecer la biblioteca de decorados y acciones para cada tema.
2. **Un 5 % más de calidad en todo**:
   - movimientos encadenados (hombro, torso y cuello, ver `fabrica/titeres/RETOMAR.md`);
   - formas más cuidadas;
   - animales con más vida;
   - transiciones, todas al nivel del viento.
   Son detalles, pero sumados se nota.
3. **Que no se sienta vacío**:
   - sonido de ambiente siempre (viento, gente, fuego, pasos) y música algo más presente;
   - vida al fondo (gente, pájaros, banderas, humo);
   - algo nuevo cada 2–3 s como máximo.

> **Para Claude:** estás en el repo `srmrpapitas/Climate-things`. Todo el trabajo está en la rama `claude/new-session-k0kf29`
> (si la rama de la sesión no lo tiene: `git fetch origin claude/new-session-k0kf29` y llevar la rama de trabajo a ese commit).
> Lee este archivo y `fabrica/manual/COMO-HACER-UN-VIDEO.md`. El modelo a copiar es el **ep. 3**: `fabrica/videos/espanistan-03-sombras/`
> (`hacer_escenas.py` → `escenas.json`). No cambies el estilo: ya está aprobado.
> **Nada más empezar**, en segundo plano: `tmux new -d -s inst "sh fabrica/instalar_todo.sh --flux > /tmp/inst.log 2>&1"`
> (Whisper + OpenCV + FLUX local, ≈ 20 min). Mientras, guion y voces.
> El usuario autoriza a terminar el capítulo solo, sin preguntar en cada paso; hablarle en español, corto y sin tecnicismos.

## La serie
- 15 vídeos. Ep. 1 Sanchís (hecho), ep. 2 Feijolo y el PP (hecho), ep. 3 Acascar = Abascal y Vox (hecho, 27-10-2026, 10 min),
  **ep. 4 el bipartidismo** (enfoque del usuario: España es una partidocracia; listas cerradas: no eliges a las personas,
  y quienes mandan dependen de su partido y no de tus votos; por qué no funciona)…
- Nombres de sátira (los elige el usuario): Sánchez = **Sanchís**, Feijóo = **Feijolo**, Abascal = **Acascar**. Para uno nuevo, preguntar.
- País ficticio con **datos reales y fuentes**; la palabra **exacta** de cada sentencia (presunción de inocencia: nadie es culpable sin sentencia).
- **Nunca** decir a quién votar. Lo bueno también se cuenta.
- El **Decano** (profesor platónico, pelo loco, gafas redondas, candil y lupa) guía; **un filósofo por bloque** con su frase.
- Conclusiones con efecto de sonido; música según el tema (silencio en los temas graves); final con la CTA propia («dale a like, suscríbete y activa la campana»).

## El estilo (aprobado el 26-10-2026, «casi una película de Disney»)
1. **Escenas base = teatro de sombras animado**: siluetas negras articuladas sobre pergamino ámbar con luz de candil.
   - Las marionetas **actúan lo que cuenta el narrador**: asienten, niegan, alzan, saludan, saltan, tiemblan, se inclinan…
   - Movimientos **suaves y con lógica**, más zooms de cámara a quien reacciona.
2. **Primeros planos = retratos de perfil a lápiz y tinta** (Batman DC + trazo de Harry Potter) sobre papel blanco sombreado a grafito.
   - Bandas negras finas arriba y abajo.
   - **Una frase = un plano**, alternando la mirada derecha/izquierda.
   - Se reutilizan las mismas parejas de boca cerrada/abierta en distinto orden y con distinto zoom.
3. **Reparto** (norma del usuario):
   - **El protagonista solo habla en su primer plano**, con **su propia voz**.
   - Los secundarios **no hablan**: si la cámara se acerca, aparece una **nota** (`nota`) con quién es y lo que le afecta.
   - El narrador puede dejar caer «X dice que…» y entonces entra el primer plano de X.
4. **Personaje-protagonista satírico**: vendehúmos que promete; frases de sátira sobre promesas y hechos documentados. **Nunca** atribuirle delitos sin sentencia.

## Animación por escena (lección del ep. 2, el usuario: «las animaciones son mínimas»)
- **Movimiento continuo y elaborado**: varias cosas moviéndose a la vez y algo nuevo cada 1–2 s, nunca un plano quieto.
- **Cambios de plano: 60 % sin cortes, 40 % transiciones** (el usuario, 30-10-2026, a lo «Cuento de los tres hermanos» de Harry Potter):
  - **60 % sin cortar**: el plano sigue y se transforma.
    - Primer plano que sigue al que corre y se aleja para enseñar el sitio nuevo.
    - `transicion: 'metamorfosis'`: todo se deshace en tinta y redibuja el plano nuevo.
    - `forma` en los actores: se construyen y se deshacen con hojas o tinta.
    - Zooms y paneos de cámara dentro del mismo plano.
  - **40 % transiciones de verdad**: `viento` (entre lugares), `tajo`, `humo`, `paneo`, `pajaros`, `papeles`, y cortes secos dentro del mismo sitio.
  - Contar al escribir cada secuencia: de cada 5 cambios, 3 sin cortar.
  - El viento y las hojas son la «Muerte» del teatro: lo que se va se lo lleva el viento, y lo que llega lo trae.
  - **Notas del ep. 6, para el ep. 7** (el usuario, 31-10-2026):
    - **Dejar respirar la tinta.** Lo que acaba de formarse con tinta tiene que quedarse en pantalla un rato. A veces, en menos de un segundo, ya había otra transición, y así no se aprecia el arte.
      - Regla: dejar **≥ 3 s** entre que termina un `forma.aparece` o una `metamorfosis` y el siguiente cambio de plano o `desaparece`.
      - Si el guion va rápido, se juntan dos bloques en el mismo plano.
    - **Coherencia de la tinta.** La tinta que se deshace debe ser la misma que forma lo nuevo: mismo color y misma materia (tinta o hojas). Tiene que viajar con sentido, de lo viejo a lo nuevo y a favor del viento, sin aparecer de la nada.
    - **Más natural, el viento y la tinta.** Ha mejorado, pero aún se nota mecánico. Con 60 fps hay que afinarlos:
      - Ráfagas que cambian de fuerza.
      - Remolinos que se abren y se cierran.
      - Hojas que giran sobre sí mismas.
      - Gotas que gotean y se estiran.
      - Más tiempo para cada `metamorfosis`, ≈ 3 s en vez de 2,4 s.
- **Suave, nunca a tirones** (el usuario, 30-10-2026: «muchísimo más smooth»): el motor ya trae muelle, anticipación, cámara curva y desenfoque de movimiento (ver `fabrica/titeres/README.md`). No hay que hacer nada en la escena, pero hay que dejar ≥ 0,3 s entre gestos para que se asienten.
- **Cronológico, no en bucle**: la escena **evoluciona** con lo que cuenta el narrador, de principio a fin.
  Ejemplo, la dana de Valencia:
  1. Empieza a llover.
  2. La lluvia arrecia.
  3. El agua sube por la calle.
  4. Se lleva los coches.
  5. La gente trepa a los tejados.
  6. Llega la ola.
  7. El responsable mira hacia otro lado.
  Cada paso, anclado a su palabra del guion. Nada de vaivenes repetidos.
- **Más piezas articuladas**: brazos, antebrazos, cabeza y piernas si camina (`poli`, `pivote`, `padre`, como el Decano de `ep02/promesas.json`).
  Además, cada elemento que tenga que hacer algo es su propia pieza: el agua, cada coche, cada grupo de gente, la lluvia.
- **Acciones nuevas en la plantilla** para contar historias: `sube` (nivel que crece), `arrastra` (cruza la escena), `cae`, `entra`/`sale`
  (desde fuera de cuadro), `gira`, más partículas (lluvia, polvo, humo, chispas) con intensidad que cambia en el tiempo.
- **Parallax y cámara**: fondo más lento que las figuras; zoom o paneo siguiendo la acción.
- No cuesta créditos: es trabajo de montaje (más piezas y acciones por plano).
- **Más escenas, cada una muy animada** (el usuario, 27-10-2026): ≈ 12–15 escenarios por capítulo con FLUX local (gratis, ≈ 15 min cada uno; lanzarlos todos en tmux al empezar, mientras se hace la voz).
- **Ritmo: un vídeo cada dos días** (≈ 15 al mes ≈ 120.000 créditos con el narrador normal, ≈ 66.000 con flash). Render siempre por partes (`render_partes.py`).

## Decisión del usuario (27-10-2026): narrador con ElevenLabs, escenas con FLUX
- **Narrador: ElevenLabs** (voz D, paso 2). **Escenarios: FLUX local** (paso 5), sin ElevenLabs.
- Truco del pergamino: el FLUX sale con un degradado naranja liso. Encima se pone una textura de pergamino manchado y una viñeta:
  1. La silueta se queda negra.
  2. Lo claro toma el pergamino.
  3. Se oscurecen los bordes.
  - Ejemplo: `historias/espanistan/sombras/prueba_flux2.png` (semilla 11).
  - Usar un pergamino **limpio**, sin dibujos: generarlo una vez con FLUX y guardarlo en `historias/espanistan/sombras/pergamino.png`.
  - Código de la prueba: `luz = clip((gris − 0,12) / 0,6)`, `resultado = pergamino × luz × 1,05 × viñeta`.

## Pasos (≈ 2–3 h de trabajo de Claude por capítulo)
1. **Guion** `historias/espanistan/NN-tema.md` (datos + fuentes) → `fabrica/herramientas/guion_espanistan-NN.txt`.
   - Una frase por línea, números en letra.
   - Deja una línea partida donde vaya a entrar el protagonista («…Abascal dice que…» / siguiente línea).
2. **Voz del narrador** (lección del 27-10-2026: el usuario prefiere la voz del ep. 1, «nada robótica»): ElevenLabs, voz D `EZDj5TBPpANsOzwaukxI`, `eleven_multilingual_v2`.
   - **Como en el ep. 1: una llamada por frase** (o por 2 frases cortas), no bloques de 1–2 min.
     En bloques largos el modelo cae en un soniquete de lectura; frase a frase cada una tiene su entonación.
   - **Nunca ralentizar después** (`atempo`/`rubberband`): el estiramiento aplana las pequeñas subidas y bajadas
     del tono (medido: −15 % de microvariación en el ep. 2 y el ep. 3) y es lo que suena a robot.
     Si hace falta más calma: más pausa entre frases en `escenas.json` (`"pausa": 0.8`) y puntuación en el texto.
   - Normalizar solo volumen y silencios con el `ffmpeg` del manual (sin cambiar la velocidad).
   - Coste igual (se paga por letra); son más llamadas, pero se lanzan todas a la vez.
3. **Voz del protagonista**: buscar en `creative_list_voices` (`es`, acento `peninsular`, `characters_animation`).
   - Feijolo = «Johnny The Rogue» `HMCmDsbKeaSZp5LMOYKR` (`eleven_v3`, etiquetas `[confident]` `[sly]` `[chuckles]`).
   - Acascar = «Leónidas - Legendary Spartan Warrior» `YKrm0N1EAM9Bw27j8kuD` (`eleven_v3`, 1 toma, ≈450 cr. por 5 frases). Frases en `fabrica/herramientas/guion_espanistan-03-abascal.txt`.
   - **Todas sus frases en una sola llamada**, separadas por líneas en blanco.
   - Cortar con Whisper (`fabrica/manual/herramientas/tiempos.py`) y `ffmpeg`, como en `audio/voz/es/espanistan-02/feijolo/`.
4. **Retratos del protagonista**: 1 imagen Seedream 5 lite 2×2 (≈212 cr.) con perfil estricto, parejas boca cerrada/abierta, papel blanco a grafito.
   - Prompt que funcionó (ep. 3): `historias/espanistan/retratos/acascar/prompt.txt`.
   - Cortar y alinear con ECC: `/home/user/qw/bin/python -I fabrica/manual/herramientas/cortar_rejilla.py rejilla.png CARPETA` → `p1_*`, `p2_*`.
   - En el ep. 3 bastaron 2 parejas: p1 y p2 alternando lado (1 / −1) y zoom distinto en cada frase.
5. **Escenarios — GRATIS con FLUX local**: escribir `historias/espanistan/sombras/epNN/escenas.txt` (una línea por escena: `nombre|qué sale`, en inglés,
   describiendo de izquierda a derecha quién está y qué hace) y lanzar el lote en tmux:
   `tmux new -d -s escenas "sh fabrica/manual/herramientas/escenarios_lote.sh historias/espanistan/sombras/epNN/escenas.txt > /tmp/escenas.log 2>&1"`.
   - Espera sola a que acabe la instalación; ≈ 15–25 min por escena (12 escenas ≈ 4 h). Si se corta, relanzar: salta las hechas.
   - Pone sola el **pergamino** (`pergamino.py`): `epNN/nombre.webp` listo para recortar; el crudo queda en `epNN/flux/`.
   - FLUX a veces no dibuja lo pedido (ep. 3: ni muralla ni casetas de playa). No repetir: **adaptar las acciones a lo que salió**.
   - Se pueden reutilizar escenarios de otros episodios (el ep. 3 usa `tribunal` del ep. 2: copiar carpeta, `.webp` y `.json`).
   - Ejemplo de 12 escenas: `historias/espanistan/sombras/ep03/escenas.txt`.
6. **Piezas** (hacerlo con cada escena según sale, mientras FLUX hace la siguiente):
   - Mirar la escena a 1280 px (`ffmpeg -i ESCENA.webp -vf scale=1280:-1 /tmp/esc.jpg`) y escribir `ESCENA.json` con `"ref": 1280`:
     `caja` [x0, y0, x1, y1], `cuello` (y que separa la cabeza), `pivote`, `tipo` (`figura|grupo|objeto|brazo|baston|iconos`).
   - Lo que deba moverse aparte (llave, mazo, lupa, bandera) va **primero** en la lista: cada pieza se queda los píxeles que nadie cogió antes.
   - Cajas ajustadas: si una caja pisa el suelo o una roca oscura, ese trozo se mueve con la pieza.
   - Recortar: `/home/user/qw/bin/python -I fabrica/manual/herramientas/sombras.py ESCENA.webp ESCENA.json ESCENA --ancho 2560` y mirar `ESCENA/previa.jpg`.
   - `--auto` falla cuando las figuras tocan el suelo (salen 0 piezas): usar cajas a mano. Para renombrar piezas de `--auto`: `renombra_piezas.py`.
   - Ejemplos: los 12 `.json` de `historias/espanistan/sombras/ep03/`.
7. **Montaje**: copiar `fabrica/videos/espanistan-03-sombras/hacer_escenas.py` (y su `.gitignore`) y adaptarlo: lista de voces, planos, acciones, partículas, capas.
   - `python3 hacer_escenas.py && /home/user/qw/bin/python -I ../../generar.py escenas.json` (desde la carpeta del vídeo).
   - Los tiempos de Whisper se guardan en `tiempos/NN.json` (uno por voz). **Comprobar que ninguno sale vacío**: si una voz es silencio, Whisper devuelve `[]`.
   - **Prueba en seco** antes de tener todos los escenarios: cambiar en una copia de `escenas.json` los que faltan por `tribunal` y generar; así salen los fallos de anclas pronto.
8. **Render a prueba de reinicios** (la nube recicla la máquina cuando el chat está inactivo): en tmux,
   `tmux new -d -s render "cd fabrica/videos/espanistan-NN-sombras && python3 ../../manual/herramientas/render_partes.py . out/espanistan-NN.mp4; sleep 900"`.
   Renderiza en trozos de 90 s guardados en disco; si se corta, relanzar el mismo comando y sigue donde iba. Programar con `send_later` una comprobación cada ~45 min.
9. **Revisar**: `npx hyperframes@0.8.204 check`; **una** tanda de capturas con `snapshot --at t1,t2,…`; el render va con `render_partes.py` (paso 8).
10. **Entregar en HD** (el usuario lo descarga desde GitHub): partir sin recomprimir en trozos < 95 MB y subirlos a `videos/espanistan-NN/`:
    `ffmpeg -i out/espanistan-NN.mp4 -c copy -map 0 -f segment -segment_time 80 -reset_timestamps 1 videos/espanistan-NN/espanistan-NN_parte%d.mp4`
    (renombrar para que empiecen en 1), más `lista.txt` y `LEEME.txt` para unirlos (copiar los de `videos/espanistan-03/`).
    Comprobar que unidos dan la duración entera. GitHub avisa de archivos > 50 MB pero los acepta (< 100 MB).
    Pasar al usuario el enlace `https://github.com/srmrpapitas/Climate-things/tree/<rama>/videos/espanistan-NN`.

## Audios y tiempos por palabra (cómo encaja todo)
1. **Un audio por frase del guion** (narrador): la línea N de `guion_espanistan-NN.txt` → `audio/voz/es/espanistan-NN/NN.mp3`
   (01.mp3, 02.mp3…), normalizado sin cambiar la velocidad. Bajarlos en cuanto estén (los enlaces caducan en 2 h).
2. **Frases del protagonista**: todas en una llamada, cortadas después con Whisper + `ffmpeg` (`-ss`/`-t` antes de `-i`)
   → `audio/voz/es/espanistan-NN/<personaje>/f1_xxx.mp3`… Comprobar volumen de cada trozo (`volumedetect`: ninguno a −91 dB).
3. **Lista de voces** en `hacer_escenas.py`, en el orden en que suenan: cada frase del narrador es
   `{"archivo": ".../07.mp3", "lineas": "7"}` y cada frase del protagonista `{"archivo": ".../f2.mp3", "texto": "…", "quien": "acascar"}`,
   metida justo detrás de la línea que le da paso («Acascar lo dice sin rodeos.»). Pausa: 0,6–1 s entre frases (`"pausa"`).
   Generar la lista con un bucle, no a mano (ver `V` en `fabrica/videos/espanistan-03-sombras/hacer_escenas.py`).
4. **Tiempos por palabra**: `generar.py` pasa Whisper a cada voz (`tiempos/NN.json`, NN = posición en la lista de voces,
   se hace una vez y se guarda) y alinea cada palabra del guion con su instante. De ahí salen:
   - los **subtítulos** (trozos de ≤ 8 palabras, las de `negrita` en dorado; las del protagonista en cursiva);
   - las **anclas** `"B:palabras"` de planos, capas, acciones y partículas: B = número de la voz en la lista (1, 2, 3…),
     palabras tal cual en el guion (`"#2"` = la segunda vez que aparecen). Con audios por frase, B ya no es el número de
     línea en cuanto hay frases del protagonista intercaladas: imprimir la lista numerada antes de escribir anclas.
   - la **boca** del Decano y del retrato (volumen fotograma a fotograma).
5. Si un ancla no existe, `generar.py` para con «Ancla no encontrada»: corregir la palabra y volver a generar (segundos).

## Trampas que costaron tiempo en el ep. 3
- **Cortar audio con fundido**: poner `-ss` y `-t` **antes** de `-i`. Con `-ss` después, el `afade` usa el tiempo del archivo original y deja el trozo en silencio.
- Las voces se piden todas a la vez; ElevenLabs encola las que pasan del límite («concurrency limit») y las hace solas: no repetir la llamada.
- Los enlaces de descarga de ElevenLabs caducan en 2 h: bajar los audios en cuanto estén.
- Una frase del guion puede quedar inexacta al montar (ep. 3: «de aquella mesa, hoy solo queda Ortega Lara», pero Acascar también sigue).
  Releer el guion buscando estas cosas **antes** de generar la voz.
- No usar `Bash sleep` para esperar: vigilar con Monitor (escenarios, render) y programar con `send_later` una comprobación de seguridad.

## Tipos de plano del generador
- `teatro` (`escena`, `cam`/`cam2` [x, y, zoom] en 1280×720, `zooms`, `acciones`).
- `retrato` (`img`, `lado`, `z`, `y`).
- `decano`, `cueva`, `imagen`.
- Capas: `dato` · `cita` · `frasco` · `nota` · `barras` · `lista` · `comparacion` · `linea` · `pines` · `sello` · `titulo` · `suscribete`.
- Acciones que vuelven a su sitio: `asiente` · `niega` · `alza` · `saluda` · `salta` · `tiembla` · `inclina` · `golpea` · `balancea` · `crece` · `avanza` (con `g` = cuánto).
- Acciones que **se quedan hechas** (la escena evoluciona, ep. 3): `entra` (desde fuera de cuadro; antes no se ve) · `sale` · `camina` · `arrastra` · `cae` · `sube` · `gira` · `late` · `aparece` · `desaparece`.
  Se suman: para que alguien se vaya y vuelva, `sale` g=−900 y luego `camina` g=+900 (no `entra`, que lo esconde desde el principio).
- `particulas` del plano: `lluvia` · `chispas` · `humo` · `monedas` · `papeles` · `pajaros` · `estrellas` · `polvo` (`en`, `hasta`, `n`, `zona` [x0, y0, x1, y1] en 1280×720, `sube` = segundos hasta la intensidad máxima).
  Siempre hay un polvo suave flotando; la cámara del teatro respira sola y el telón hace parallax.
- `barras` admite `unidad` (`''` para escaños, por defecto ` %`).

## Presupuesto por capítulo (créditos ElevenLabs; ver `PLAN-10-SEMANA.md`)
- Narrador ≈ 7.000 (o ≈ 3.500 con `eleven_flash_v2_5`).
- Protagonista ≈ 700.
- Escenarios: 0 (FLUX local); ≈ 1.300–1.500 si se hicieran con ElevenLabs.
- Retratos ≈ 212.
- **Total ≈ 7.900** (≈ 4.400 con flash).
- Claude: guion + montaje en una sesión, una sola hoja de capturas por revisión.
