# El tsunami que se duplica · plan para hacerlo (pegar esto en una conversación nueva)

> **Hecho (27-10-2026):** la película completa está en `tsunami/peli.html` (motor + escenas + guion). Cómo se hizo,
> qué se aprendió y cómo repetirlo deprisa: **`tsunami/COMO-SE-HIZO.md`**. Voz del narrador: la «D» de siempre
> (`EZDj5TBPpANsOzwaukxI`), que sigue en la cuenta nueva; la toma está en `tsunami/voz/`.

> **Para Claude:** estás en el repo `srmrpapitas/Climate-things`. Lee este archivo entero antes de empezar.
> El estilo ya está **aprobado**: **3D ilustrado** (ver `tsunami/referencia/estilo-3d-ilustrado.jpg`): sombreado por bandas,
> contorno de tinta, textura de papel, colores vivos, movimiento muy exagerado. No lo cambies.
> La base está hecha en `tsunami/muestra.js` (muestra de 5 s del cuarto bajo el agua): parte de ahí.
> Arranca el servidor con `python3 -m http.server 8765` desde la raíz y mira la muestra en
> `http://localhost:8765/tsunami/index.html?estilo=ilustrado`.

## Antes de empezar (lo hace el usuario)

1. **Modo de permisos.** En el desplegable que hay junto a la caja de texto, elige **Auto** (si te sale). Así Claude edita,
   ejecuta comandos y renderiza sin pedirte permiso a cada paso. Si no aparece Auto, elige **Accept edits**: edita sin
   preguntar, pero pedirá permiso para algunos comandos. Para que no los pida nunca, el usuario (no Claude: el sistema no le
   deja darse permisos a sí mismo) puede crear `.claude/settings.json` en el repo con
   `{"permissions": {"allow": ["Bash(node:*)", "Bash(python3:*)", "Bash(ffmpeg:*)", "Bash(ffprobe:*)", "Bash(curl:*)", "Bash(git add:*)", "Bash(git commit:*)", "Bash(git push:*)"]}}`
   y subirlo (commit).
2. **ElevenLabs.** La cuenta actual no tiene créditos. Conecta la cuenta nueva en claude.ai → Ajustes → Conectores
   (ElevenLabs) **antes** de abrir el chat. La voz del narrador «D» (`EZDj5TBPpANsOzwaukxI`) era de la cuenta antigua: en la
   nueva Claude tendrá que diseñarla otra vez (o elegir una parecida con `creative_list_voices`). Te enseñará 2–3 opciones
   para que elijas.
3. Dile a Claude: **«Lee tsunami/PLAN.md y hazlo. Estás autorizado a trabajar sin preguntarme salvo para gastar créditos de
   ElevenLabs y para elegir la voz.»**

## La idea (60–65 s, vertical 9:16)

¿Y si cada tsunami fuera el doble que el anterior? **5 olas: 10 → 20 → 40 → 80 → 160 m.** El protagonista es **Nico**
(`modelos/nico.glb`). Va diciendo **«bomboclat»** cada vez que ve algo que le sorprende (los «bombo followers»):
de tranquilo y extrañado («¿bomboclat?») a gritarlo con todo al final. Hay 10 tomas en `audio/sfx/bomboclat/00–09.mp3`,
de tranquilo (00) a gritando (09), cada una con su envolvente para la boca (`boca.json`).

**Gancho:** el vídeo empieza por el final de la historia (el cuarto bajo el agua) y luego rebobina.

## Guion (una frase por línea, números en letra; cifras comprobadas abajo)

| t | Plano | Narrador | Nico |
|---|---|---|---|
| 0:00 | **Cuarto, plano cenital** desde el techo: Nico dormido y arropado. La cámara baja y gira hacia la ventana: fuera, peces y un coche a la deriva | «Este chico duerme bajo diez metros de agua. Y no lo sabe.» | — |
| 0:03 | Una silla choca contra el cristal; Nico se incorpora de golpe (exagerado) | — | «¿Bomboclat?» (toma 00) |
| 0:05 | Rebobinado rápido (efecto de cinta) hasta la playa | «¿Y si cada tsunami fuera el doble que el anterior? Rebobinemos.» | — |
| 0:09 | **Playa** al atardecer. El mar se retira y deja peces saltando en la arena | «Primera señal: el mar se retira. Si lo ves, corre.» | «¿Bomboclat?» (01) |
| 0:13 | **Ola 1 · 10 m** llega a la playa; Nico corre hacia la ciudad (zoom de golpe a su cara) | «Diez metros, como en Banda Aceh en dos mil cuatro. Corre a casa: un tercer piso.» | «¡BOMBOCLAT!» (05) |
| 0:19 | **Cuarto** (lo de la muestra): Nico en la ventana | «Veinte metros. Encima de su ventana pasan diez de agua: dos atmósferas.» | — |
| 0:24 | El cristal se raja (sonido de cristal, primer plano de la grieta) | «Cada metro cuadrado de cristal aguanta diez toneladas. Por poco tiempo.» | «bomboclat…» (00, bajito) |
| 0:31 | **Rascacielos**, planta 45: Nico con la frente pegada al cristal; abajo, la ciudad | «Lección aprendida: planta cuarenta y cinco.» | — |
| 0:34 | **Ola 3 · 40 m** entra en la ciudad y la destruye **fotograma a fotograma** (edificios que se parten en trozos, coches, espuma) | «Cuarenta metros, como Japón en dos mil once. Setenta kilómetros por hora.» | «BOMBOCLAT» (03, asombrado) |
| 0:42 | **Ola 4 · 80 m**: el agua llega a la planta 22; el edificio tiembla, revientan cristales de abajo | «Ochenta. El agua ya va por la planta veintidós. El edificio cruje.» | — |
| 0:50 | **Ola 5 · 160 m**: el muro de agua llena la ventana; Nico se gira a cámara | «Ciento sesenta metros. Planta cuarenta y cinco: la suya.» | «¡¡BOMBOCLAAAT!!» (09) |
| 0:57 | Blanco → negro | «La más alta de la historia midió quinientos veinticuatro metros. Alaska, mil novecientos cincuenta y ocho.» | — |
| 1:02 | Cierre | — | Texto: «¿Qué duplicamos ahora? 👇» |

**Cifras** (comprobarlas antes de publicar):
- Banda Aceh, 2004: el agua llegó a unos 9–12 m de altura en la ciudad.
- Japón, 2011: la ola subió hasta 40,5 m (Miyako).
- Velocidad ≈ √(g·h): 40 m dan 71 km/h y 160 m dan 143 km/h.
- Presión: 10 m de agua suman 1 atmósfera (2 en total) y empujan unas 10 t por m² de cristal.
- Alturas del edificio: con plantas de 3,6 m, la planta 22 está a ≈ 79 m y la 45 a ≈ 162 m.
- Bahía de Lituya, Alaska, 1958: 524 m.

**HUD** en cada ola: «TSUNAMI Nº N» · «XX m» (Archivo Black) · una línea amarilla (velocidad o comparación).

## Cómo está hecho (y qué falta)

- `tsunami/index.html` es la página: capas HTML para el texto y la carga de `muestra.js`.
  - Estilos: `?estilo=ilustrado` (el elegido) o `?estilo=cine`.
- `tsunami/muestra.js` ya tiene:
  - Materiales de bandas con contorno de tinta (`material()`, `adaptar()`).
  - Agua de fuera (degradado con ventana de Snell), cáusticas que entran por la ventana (foco con textura), rayos de luz,
    peces, burbujas, coche, farola encendida, silla flotando.
  - El cuarto: cama, mesilla, lámpara, póster de la ola…
  - Nico con poses a mano (`apuntar()`, `girar()`), respiración, susto exagerado (`easeOutBack`) y boca sincronizada.
  - Cámara por planos con latigazos y temblor, gradación con papel y líneas de velocidad.
  - Todo va con `ir(t)`, que es determinista.
- `tsunami/grabar.mjs` saca el MP4:
  - Comando: `node tsunami/grabar.mjs "tsunami/index.html?estilo=ilustrado" out/tsunami.mp4`.
  - Renderiza fotograma a fotograma y mezcla el sonido de `__peli.sonidos` con ffmpeg.
  - El `.mp4` va en `out/`, que no se sube al repo.
- Recursos CC0 de Poly Haven en `tsunami/assets/`. Para bajar más: `api.polyhaven.com/files/<id>`, gltf 1k.
  - Interesantes: `throw_pillows_01`, `rubber_duck_toy`, `lifebuoy`, `street_lamp_02`, `vintage_suitcase`.
  - Cielos HDRI para la playa: `qwantani_dusk_2_puresky`, `belfast_sunset_puresky`.

**Pasos:**
1. **Reorganizar** `muestra.js` en motor + escenas: `tsunami/motor.js` (render, estilo, posproceso, Nico, cámara) y
   `tsunami/escenas/{cuarto,playa,rascacielos}.js`, más `tsunami/guion.js` con la tabla de arriba (tiempos, planos, frases,
   sonidos).
2. **Voces.**
   - Narrador: ElevenLabs `eleven_multilingual_v2`, `speed 0.88`, `stability 0.7`, por bloques.
   - Normalizar con ffmpeg (`loudnorm`) y medir la duración de cada frase.
   - **Los tiempos del guion salen de esas duraciones**, no al revés.
   - Si hace falta un «¿bomboclat?» con entonación de pregunta, generar 2–3 tomas nuevas con la voz del protagonista
     (lo más barato: `eleven_flash_v2_5`) y su `boca.json` (envolvente a 30 fps, como `audio/sfx/bomboclat/boca.json`).
3. **Cuarto** (casi hecho):
   - Plano cenital del principio: cámara en el techo mirando a la cama, Nico tumbado con el edredón por encima.
     Hay que posar los huesos tumbado y girar el grupo; el edredón tapa las piernas.
   - Despertar con respingo.
   - Grieta del cristal: textura de grieta que crece sobre el cristal y unas gotas.
4. **Playa**:
   - Arena (`coast_sand_01` de Poly Haven), mar con olas (geometría animada + espuma) y cielo de atardecer.
   - Sombrillas, chiringuito y gente (`COMUN.persona` de `fenomenos/comun.js` como figurantes).
   - El mar se retira (la orilla baja y quedan peces en la arena) y luego llega la ola de 10 m.
   - El perfil de la ola se puede sacar de `fenomenos/ola.js` (PB/PF), con espuma en la cresta.
   - **Nico corriendo:** las animaciones de Mixamo de `modelos/anim/{idle,run,walk}.json` (sacadas del Xbot de three.js)
     **no se pueden aplicar tal cual**: su pose de reposo es distinta y dejaban a Nico boca abajo. Hay que reorientarlas
     con `SkeletonUtils.retargetClip` (en `vendor/jsm/utils/SkeletonUtils.js`) o calculando para cada hueso
     `q = reposoNico · (reposoXbot⁻¹ · qXbot)`. Si da guerra, la carrera a mano con `apuntar()` (muslos, piernas y brazos
     con un seno) también vale, porque el plano es corto y con cámara movida.
5. **Rascacielos + ciudad**:
   - Interior con cristal de suelo a techo y Nico de silueta.
   - Abajo, la ciudad con edificios en instancias (ventanas como en `texFachada`).
   - La ola entra desde el mar y rompe los edificios **fotograma a fotograma**: cada edificio son 6–12 trozos (cajas) que
     salen empujados con gravedad y se hunden, más polvo, espuma y cristales.
   - Ola 4: sube el nivel del agua y tiemblan la cámara y el edificio.
   - Ola 5: un muro de agua llena el cristal y la imagen se funde a blanco.
6. **Sonido**:
   - Fondo: `audio/sfx/` (`ola`, `derrumbe`, `cristales`, `riser`, `whoosh`, `alarmas`, `dron`, `ciudad`, `impacto`).
   - Bajo el agua, todo con `lowpass`.
   - Las tomas de bomboclat van encima; el narrador siempre manda.
7. **Revisar**: una sola hoja de capturas por tanda (`ir(t)` + captura de `#stage`), mirarla y corregir.
8. **Render y subida**:
   - Render en segundo plano (ver tiempos abajo). Commit + push a la rama que te den.
   - Pasarle el MP4 al usuario.
   - Recomendación al publicar: **Trial Reel** primero (se enseña solo a gente que no te sigue).

## Lo que ya se aprendió (no repetirlo)

- **Huesos de Mixamo:** el GLTFLoader quita los dos puntos de los nombres: `mixamorig:Hips` → `mixamorigHips`.
- **Boca de Nico:** la línea de los labios está **4,5 cm por debajo de la punta de la nariz**, medido en la malla.
  - El hueco negro tapa todo el rosa de dentro al hablar: centro 0,3 cm bajo esa línea y 1,9 cm por detrás de la punta de la nariz;
    tamaño 1,9–2,4 cm de ancho y hasta 1,35 cm de alto (ver `tsunami/referencia/boca.jpg`). El usuario aprobó así la boca.
  - Con 3,1 cm (lo que usa `fenomenos/boxeo.js`) bajaba también el labio de arriba y se separaba de la nariz.
  - Ya está corregido en `muestra.js`; si se toca el boxeo, aplicar lo mismo.
- **Exposición y bloom:** con mucho bloom y el foco fuerte todo sale lechoso.
  - Valores buenos: foco 4,5–5; bloom 0,25 con umbral 0,95; niebla del agua 0,07; cristal casi invisible
    (opacidad 0,05, sin `clearcoat`).
- **Cáusticas:** el foco de las cáusticas también ilumina la fachada de fuera; en el ilustrado salen manchas grandes.
  Limitar el cono o bajar el contraste fuera.
- **Pendiente en la muestra:**
  - El «¿BOMBOCLAT?» de cómic se corta por la derecha al girarlo (bajar tamaño o quitar giro).
  - En el plano de fuera el coche pasa demasiado cerca de la cámara.
- **Rendimiento:** sin tarjeta gráfica (SwiftShader) cada fotograma tarda **3–11 s** a 1080×1920 (el ilustrado unos 3–7 s;
  la primera captura, ~20 s, por compilar shaders).
  - 65 s × 30 fps = 1.950 fotogramas, unas **2–4 h**.
  - Truco: lanzar 2 procesos con mitades de fotogramas y unir con ffmpeg (`concat`), o bajar sombras (1024) donde no se vean.
- **Los Mixamo de Ready Player Me no valen:** su licencia solo permite usarlos con avatares de Ready Player Me y prohíbe
  redistribuirlos.

## Presupuesto de créditos ElevenLabs

- Narrador: ≈ 900 caracteres ≈ 900–1.000 créditos con `multilingual_v2` (o la mitad con `flash_v2_5`). Con repeticiones,
  ≈ 1.500.
- Bomboclat nuevos (opcional): ≈ 50–100.
- Voz del narrador rediseñada (si hace falta): unos pocos cientos.
- Escenas, imágenes y render: **0** (todo se pinta aquí).
