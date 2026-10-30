# Españistán ep. 3: difusión en X y YouTube (para retomar en una conversación nueva)

> **Para Claude:** el usuario quiere que lo hagas sin tener que estar pendiente. Háblale en español, corto.
> Antes de nada: comprueba si tienes las herramientas de «computer use» (ratón del Mac). Con ellas puedes elegir tú los archivos en la ventana de «Subir» de macOS.
> Sin ellas, el usuario tiene que elegir el archivo cada vez.
> Las sesiones de X y de YouTube están abiertas en el **navegador lateral** de la app (herramientas `mcp__Claude_Browser__*`). Safari no sirve.
> Cuenta de X: **Nicholas kutznetzsoff**.
> **Publicar en su nombre:** el usuario ya aprobó los textos de abajo. Para cualquier texto nuevo (otra respuesta u otro post), enséñaselo y espera su «sí».

## Hecho (28-10-2026)
- **Capítulo entero** en YouTube; el canal tiene 10 suscriptores.
- **Shorts en YouTube** (los tres pasados a PRIVADO el 28-10: demasiado cortos, 4 vistas):
  1. «¿Por qué los jóvenes votan a VOX? 🐴» https://youtube.com/shorts/d3wFmNBhiRU
  2. «De 0 a 68 escaños» https://youtube.com/shorts/104QBXUL2Ic
  3. «VOX y el banco húngaro» https://youtube.com/shorts/7RLebIm1Ww4
- **Títulos nuevos (gancho) en los ep. 1–3 y miniaturas nuevas en los ep. 1 y 2** (`sh fabrica/titeres/miniatura.sh 1|2`). Chrome tiene YouTube con el canal Españistán (ojo: también hay otro canal del usuario).
- **X (28-10, 13:15):** post gancho «De 0 a 68 escaños…» con el short largo `out/x/ep3-subida.mp4`, FIJADO, + respuesta propia con el enlace (https://x.com/nicholasreich9/status/2115416102436290730). Web del perfil: youtube.com/@Siseduplica. Cuenta: @nicholasreich9.
- **X:** una respuesta publicada al post de electomanía sobre «los restos» del 29-N (https://x.com/electo_mania/status/2115330383201894432).
- Archivos: `~/Desktop/Espanistan-03/` (shorts en `shorts/`, miniatura `Miniatura-ep03.jpg`).
  Los shorts se generan con `python3 fabrica/titeres/shorts.py` y la miniatura con `sh fabrica/titeres/miniatura.sh`.

## Pendiente
> 28-10 (mediodía): short 1 aún SIN publicar en X. Computer use activado por el usuario: abrir sesión nueva para que aparezca.
> Truco en X (navegador lateral): al escribir, el texto tarda en salir; no reescribir o se duplica. Comprobar con JS (`[data-testid^="tweetTextarea_0"]`).
1. **«Vídeo relacionado» en los 3 shorts** → el capítulo entero.
   - YouTube pide antes una **verificación única** del canal (teléfono), y la tiene que hacer el usuario en Studio → Configuración → Canal → Funciones.
   - 28-10 (tarde): verificación pedida; YouTube tarda **24 h** en confirmarla. Volver a intentarlo a partir del 29-10 por la tarde.
   - Después: Studio → cada short → «Vídeo relacionado» → elegir el capítulo.
2. **Subir los 3 shorts a X como vídeo nativo** (no enlace de YouTube en el post principal) y, en una respuesta a uno mismo, el enlace al capítulo:
   - `~/Desktop/Espanistan-03/shorts/01-caballo.mp4` → «Los jóvenes, primera fuerza para Vox. Acascar tiene su propia teoría 🐴 #29N»
   - `02-de-0-a-68.mp4` → «De 0 diputados a rozar el 20 % en doce años. Así fue la subida de Vox, en dibujos 🗡️ #29N #Vox»
   - `03-idioma.mp4` → «6,5 millones de un banco húngaro. Se devolvió y se archivó… pero Acascar tiene una explicación 🇭🇺 #Vox»
   - Respuesta a uno mismo: «Capítulo entero (8 min) 👉 ENLACE DEL CAPÍTULO» (sacar el enlace de YouTube Studio → Contenido).
   - Ritmo: uno al día, sin publicarlos los tres seguidos.
3. **Perfil de X:** enlace del canal en la bio y fijar el mejor short.
4. **Respuestas útiles en X**, 3–5 al día, cada una distinta, con enlace solo en la mitad como mucho.
   - Cuentas de datos: electomanía, Kiko Llaneras, Datadicto, Colmena de Datos.
   - Buscar en X: `(from:kikollan OR from:electo_mania OR from:datadicto_es) Vox` en «Más reciente». Posts de menos de 6 h y con pocas respuestas.
   - Evitar las cuentas muy partidistas: una respuesta neutral ahí solo trae peleas.
   - Borradores aún sin usar (adaptar al post):
     - Jóvenes: «Lo curioso es que el voto joven a Vox lleva subiendo desde 2023 y casi nadie lo explica más allá de "es TikTok". En Españistán lo contamos en dibujos 🗡️ [short 1]»
     - Encuestas: «66 escaños hoy… y en 2014 eran cero. De 0 a 68 en doce años es de las subidas más rápidas de Europa 👇 [short 2]»
     - Sin enlace: «Pregunta seria: ¿cuánto del voto a Vox es por lo que propone y cuánto por contra quién está? Porque las dos cosas no se votan igual.»
5. **Más shorts** (tiempos en el capítulo de Claude, no en el editado en DaVinci):
   - «Ya si eso, después», 6:58–7:06;
   - chiringuitos, 3:53–4:09;
   - frascos 1/3, 4:51–5:17;
   - frascos 2/3, 5:26–6:06;
   - la balanza, 7:11–7:46.
   Se añaden a `SHORTS` en `fabrica/titeres/shorts.py`.
6. **Noche electoral del 29-N:** un short con el resultado comparado con las encuestas del episodio.

## Shorts: qué funciona en este canal (28-10)
- Los de curiosidades (1:28–2:41, una idea entera) tienen **1.100–1.300 vistas**; los de Españistán (8–34 s, frases sueltas) tienen **4**. → Shorts de **60–120 s con el razonamiento entero** (pregunta → datos → letra pequeña → pregunta del Decano). El límite es 3 min.
- **No borrar** los shorts flojos: borrar quita sus estadísticas y la relación con quien los vio; YouTube desaconseja borrar y volver a subir. Si molestan, **Privado** (reversible). No hay pruebas de castigo por subir 3 en un día ni por pasar 3–4 días sin subir; lo que penaliza es lo repetitivo y en masa (10+ al día).
- Ritmo: **1 al día, programado** a la misma hora, alternando capítulos y con ganchos distintos.

## Plan para atraer gente en X (28-10)
Enlace del capítulo entero: **https://youtu.be/6KmuoSjSYCQ (antes aZYWl6CUDoI, ahora privado: audio desfasado)**

Recorrido: **respuesta útil en un post grande → la gente entra en tu perfil → ve el post fijado (gancho) → abre el enlace al capítulo.**

### 1. El post gancho (fijado en el perfil)
- El vídeo va subido a X (no el enlace de YouTube). En el texto, una cifra y una pregunta. El enlace va en la primera respuesta, porque X da menos alcance a los posts con enlace.
- Borrador (pendiente del «sí» del usuario):
  - Post: «De 0 a 68 escaños en doce años. ¿Cómo lo ha hecho Vox? Lo contamos en dibujos, con datos y sin decirte a quién votar 🗡️ #29N» + `02-de-0-a-68.mp4`
  - Respuesta propia: «Capítulo entero (8 min) 👉 https://youtu.be/6KmuoSjSYCQ (antes aZYWl6CUDoI, ahora privado: audio desfasado)»
- Fijarlo y poner el enlace del canal en la bio: «Españistán: la política española en dibujos, con datos. Nuevo capítulo cada semana».

### 2. Dónde comentar (3–5 al día)
- **Datos y encuestas** (los mejores): electomanía, Kiko Llaneras, Datadicto, Colmena de Datos, 40dB, el CIS.
- **Medios con mucho público**: El País, elDiario.es, El Mundo, La Razón, RTVE Noticias, Newtral, Maldita.
- **Temas del día** («Lo que está pasando»): sondeos, debates, Vox y los jóvenes.
- Evitar las cuentas de partido y de militantes: ahí solo hay peleas.

### 3. Cómo comentar
- Llegar pronto: en la **primera hora** del post (mirar «Más reciente»). Horas buenas: 8–10, 14–15 y 21–23.
- Aportar algo que no esté en el post: un dato, una comparación o una pregunta. Que se entienda sin ver el vídeo.
- Si el tema lo pide, adjuntar el short en la respuesta (vídeo de X, sin enlace). El enlace a YouTube, como mucho en la mitad de las respuestas.
- Nunca el mismo texto dos veces. Responder a quien conteste en la primera hora, porque eso empuja la respuesta.

### 4. Calendario hasta el 29-N
- Un short al día en X (1, 2, 3 y los de la sección «Más shorts»), cada uno con su respuesta propia con el enlace.
- Encuestas, debates y el CIS: ese día, responder con el short 2.
- 29-N por la noche: el short con el resultado (punto 6).

### 5. Medir (cada domingo)
- X → Estadísticas: visitas al perfil y clics en el enlace.
- YouTube Studio → el capítulo → «Fuentes de tráfico» → cuánto viene de X.
- Lo que no traiga visitas en una semana, se cambia.

## Normas
- Nunca decir a quién votar. Nadie es culpable sin sentencia. Datos con fuente.
- Sin spam: nada de textos repetidos ni rondas masivas de enlaces.
