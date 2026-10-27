# Españistán · cómo hacer el capítulo siguiente (pegar esto en una conversación nueva)

> **Para Claude:** estás en el repo `srmrpapitas/Climate-things`, rama `claude/quirky-thompson-xa9rrz`. Lee este archivo y
> `fabrica/manual/COMO-HACER-UN-VIDEO.md`. El modelo a copiar es el **ep. 2**: `fabrica/videos/espanistan-02-sombras/`
> (`escenas.json` + `hacer_escenas.py`). No cambies el estilo: ya está aprobado. Trabaja con Sonnet si puedes.
> Antes de empezar: `sh fabrica/instalar_todo.sh` (Whisper) (instala Whisper y OpenCV en `/home/user/qw`).

## La serie
- 15 vídeos. Ep. 1 Sanchís (hecho), ep. 2 Feijolo y el PP (hecho), **ep. 3 Acascar (Abascal, Vox)** (guion: `historias/espanistan/03-abascal.md`), ep. 4 el bipartidismo (enfoque del usuario: partidocracia, listas cerradas, quienes mandan no necesitan tus votos ni los puedes elegir)…
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
2. **Voz del narrador**: ElevenLabs, voz D `EZDj5TBPpANsOzwaukxI`, `eleven_multilingual_v2`, `speed 0.88`, `stability 0.7`.
   - Por bloques; normalizar con el `ffmpeg` del manual.
   - Si sale rápida: `atempo=0.92`.
3. **Voz del protagonista**: buscar en `creative_list_voices` (`es`, acento `peninsular`, `characters_animation`).
   - Feijolo = «Johnny The Rogue» `HMCmDsbKeaSZp5LMOYKR` (`eleven_v3`, etiquetas `[confident]` `[sly]` `[chuckles]`).
   - **Todas sus frases en una sola llamada**, separadas por líneas en blanco.
   - Cortar con Whisper (`fabrica/manual/herramientas/tiempos.py`) y `ffmpeg`, como en `audio/voz/es/espanistan-02/feijolo/`.
4. **Retratos del protagonista**: 1 imagen Seedream 5 lite 2×2 (≈212 cr.) con perfil estricto, parejas boca cerrada/abierta, papel blanco a grafito.
   - Prompt en `historias/espanistan/retratos/feijolo/` (ver el de `perfil_lapiz`).
   - Recortar y alinear con ECC (`p1_*`, `p2_*`).
5. **Escenarios — GRATIS con FLUX local** (decisión del usuario, 26-10-2026): `sh fabrica/instalar_todo.sh --flux` (una vez) y
   `sh fabrica/manual/herramientas/escenario.sh historias/espanistan/sombras/epNN/ESCENA.png "qué sale" [semilla]` (≈ 15 min/imagen, en segundo plano;
   el estilo va ya dentro del script). Probar 2 semillas en las escenas clave. ElevenLabs (Seedream 5 lite, ≈212 cr.) solo si FLUX no da el resultado.
   Antes: 5–7 imágenes de teatro de sombras (Seedream 5 lite, 16:9 2K, ≈212 cr. cada una).
   - Prompt base en `historias/espanistan/sombras/ep02/` (copiar el párrafo de estilo).
   - Pedir «figures clearly separated, not overlapping».
6. **Piezas**: por escena, un JSON con cajas (medidas sobre la imagen a 889 px de ancho, `"ref": 889`): `caja`, `cuello` (separa la cabeza), `pivote`, `tipo` (`figura|grupo|objeto|brazo|baston|iconos`), `padre`.
   - Recortar con `/home/user/qw/bin/python -I fabrica/manual/herramientas/sombras.py ESCENA.webp ESCENA.json ESCENA --ancho 2560`.
   - Mirar `ESCENA/previa.jpg`.
7. **Montaje**: copiar `fabrica/videos/espanistan-02-sombras/hacer_escenas.py` y adaptarlo (voces, planos, acciones, capas de datos).
   - Generar con `/home/user/qw/bin/python -I fabrica/generar.py fabrica/videos/espanistan-NN-sombras/escenas.json`.
8. **Render a prueba de reinicios** (la nube recicla la máquina cuando el chat está inactivo): en tmux,
   `tmux new -d -s render "cd fabrica/videos/espanistan-NN-sombras && python3 ../../manual/herramientas/render_partes.py . out/espanistan-NN.mp4; sleep 900"`.
   Renderiza en trozos de 90 s guardados en disco; si se corta, relanzar el mismo comando y sigue donde iba. Programar con `send_later` una comprobación cada ~45 min.
9. **Revisar**: `npx hyperframes@0.8.204 check`; **una** tanda de capturas con `snapshot --at t1,t2,…`; el render va con `render_partes.py` (paso 8).
10. **Subir** al repo (commit + push); el `.mp4` va en `out/` (no se sube); pasárselo al usuario.

## Tipos de plano del generador
- `teatro` (`escena`, `cam`/`cam2` [x, y, zoom] en 1280×720, `zooms`, `acciones`).
- `retrato` (`img`, `lado`, `z`, `y`).
- `decano`, `cueva`, `imagen`.
- Capas: `dato` · `cita` · `frasco` · `nota` · `barras` · `lista` · `comparacion` · `linea` · `pines` · `sello` · `titulo` · `suscribete`.
- Acciones: `asiente` · `niega` · `alza` · `saluda` · `salta` · `tiembla` · `inclina` · `golpea` · `balancea` · `crece` · `avanza` · `aparece` · `desaparece` (con `g` = cuánto).

## Presupuesto por capítulo (créditos ElevenLabs; ver `PLAN-10-SEMANA.md`)
- Narrador ≈ 7.000 (o ≈ 3.500 con `eleven_flash_v2_5`).
- Protagonista ≈ 700.
- Escenarios: 0 (FLUX local); ≈ 1.300–1.500 si se hicieran con ElevenLabs.
- Retratos ≈ 212.
- **Total ≈ 7.900** (≈ 4.400 con flash).
- Claude: guion + montaje en una sesión, una sola hoja de capturas por revisión.
