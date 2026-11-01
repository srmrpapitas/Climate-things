# Efectos épicos: primeros planos que hablan, drones, rampas y cortes en la palabra

Guía para cualquier IA. Sale del vídeo **SCD (Trump vs Sánchez, estilo UFC)**, pero las recetas valen para todo:
Españistán (tinta), explicados verticales, shorts. Léela entera antes de tocar una escena «épica».

---

## 1. La idea en una frase
**La voz manda.** Primero se pega la voz, luego un programa saca el segundo exacto de cada palabra, y la imagen
(cortes, golpes, tarjetas, boca) se ancla a esas palabras. Si cambia una frase, todo se recoloca solo.

```
frases de voz (mp3) ──► mezcla.py ──► tiempos.json  (anclas: «hora», «mestre», cortes, picos de golpes…)
                                  ├─► boca.json     (cada palabra con su segundo + volumen de la voz 60 veces/s)
                                  ├─► planos.txt    (lista legible de planos y sonidos)
                                  └─► parte1-v4.mp3 (mezcla final, comprobada)
escena.html (Three.js) lee tiempos.json y boca.json ──► window.dibuja(t) dibuja el fotograma t
graba.mjs (Chrome + GPU) llama a dibuja(t) 30 veces por segundo ──► mp4 con el audio
```

## 2. Dónde está cada cosa (SCD)
| Archivo | Para qué |
|---|---|
| `fabrica/videos/scd/mezcla.py` | Voz → tiempos, eventos con sonido, mezcla y **comprobación** (sale «OK» o «REVISAR»). La lógica va explicada arriba del archivo. |
| `fabrica/videos/scd/escena.html` | La escena 3D. Cada plano es una rama de `window.dibuja(t)` con su cámara. |
| `fabrica/herramientas/presentador.js` | **El presentador que habla**: modelo con cara, boca desde la voz, manos con micro, gestos. Reutilizable. |
| `fabrica/herramientas/personajes.js` | Personajes con esqueleto Mixamo y clips (`clipMixamo('Armada')`). |
| `fabrica/herramientas/graba.mjs` | Grabar con la GPU. También saca fotos sueltas para revisar. |
| `fabrica/herramientas/palabras.py` | Whisper: segundo de cada palabra. |
| `modelos/scd/` | Octógono, Trump, clips (`anim/*.fbx`), presentador (`presentador/`, Rocketbox, licencia MIT). |

## 3. Grabar y revisar (lo primero que hay que saber)
- Servidor: `python3 -m http.server 8765` en la raíz del repo (déjalo encendido).
- **Fotos de prueba** (2–3 min, en segundo plano):
  `node fabrica/herramientas/graba.mjs fabrica/videos/scd/escena.html out/prueba.mp4 61 audio/voz/scd/parte1-v4.mp3 1.2,4.9,13.4`
  Las fotos quedan en `out/prueba.mp4.fotos/prueba-<t>.jpg`. Hoja de contacto para mirarlas de un vistazo (en orden de tiempo):
  `sh fabrica/herramientas/hoja.sh out/prueba.mp4.fotos out/hoja.jpg 6 1 24` (6 columnas, de la 1.ª foto, 24 fotos).
- **Vídeo entero**: el mismo comando sin la lista de segundos. Unos 7 min. Si se corta, se relanza y sigue donde iba.
- **Nunca en CPU** (swiftshader): la escena ni carga. Siempre `graba.mjs` (Chrome + Metal).
- Si pruebas un módulo en el navegador y «no cambia nada», es la **caché**: impórtalo con `?v=' + Date.now()`.
- Al acabar, borra `out/*.fotos` y las pruebas: llenan el disco.

## 4. Recetas de imagen (qué hacer y cuándo)

### 4.1 Primer plano que habla (cara)
`presentador.js` → `const pr = await cargaPresentador(boca); pr.pon(t, { mira: cámara, gestos: [[t0, 'puño'], …] })`
- **Boca**: cada letra de cada palabra es un visema (el español se escribe como suena: a, e, i, o, u, p/b/m cierran, f…).
  Las vocales abren **según el volumen real de la voz** en ese instante (boca.json). Así nunca habla en un silencio.
- **Cara viva**: en los gritos sube las cejas, abre los ojos y se inclina hacia delante; parpadea cada 2,5–4,5 s;
  la cabeza mira a la cámara y cabecea en las sílabas fuertes.
- **Manos**: brazos por IK (se le dice dónde va la muñeca y hacia dónde el codo). La derecha sujeta el micro bajo los labios
  con la muñeca recta; la izquierda hace gestos: `abajo`, `pecho`, `presenta`, `señala`, `al_frente` (señala al que mira), `puño`, `abre`.
- **Encuadre de cara**: lente estrecha (fov 28–32), cámara a la altura de los ojos, 1,4–1,7 m. Empuje lento hacia él
  y un **golpe de cámara** (0,35 m en 0,4 s) justo antes de la palabra fuerte. Cámara un poco al lado contrario del micro, para ver la boca.
- Luz de cara: un cenital fuerte y los focos bajos (120). Con mucha luz de relleno la piel se aplana.

### 4.2 Cortes en la palabra (estilo AMV / tele de UFC)
- Cada corte se ancla a una palabra de whisper (`en('record', 'dos')`), nunca a un segundo escrito a mano.
- En cada corte: destello blanco de 0,06 s (`bl`) y un «whoosh» suave.
- **Elipsis**: entre cortes el tiempo salta; dentro de cada plano el personaje anda a velocidad real (1,35 m/s).
- **Pocos planos, largos y con la cámara moviéndose.** Diez cortes de 0,5 s en el walk-out se sentían «forzados». Ahora son 5 (1,5–1,8 s):
  túnel con fuego (steadicam de frente que retrocede) → steadicam detrás, por encima del hombro → grúa que se aleja y sube y descubre
  la jaula y la pantalla → escalera con el cutman (la cámara gira despacio) → entra por la puerta. Como en la tele de UFC.
- **Cortar cuando cueste**: si un movimiento es difícil de enseñar seguido, se corta en un sitio con lógica (cambio de lugar, palabra fuerte)
  y el plano siguiente empieza ya resuelto. Ahorra trabajo y queda mejor que forzarlo.

### 4.3 Rampa de velocidad (lo más épico)
El golpe entra rápido, **se frena en el pico** (cámara lenta ×0,3) y sale rápido. El pico es el instante en que el pie está más alto
(`contacto()` lo mide solo). Fórmula en `rampa(lt, tp, pico)` de `escena.html`. El whoosh de sonido va en el pico.
Úsalo en cualquier gesto fuerte: un puñetazo en la mesa, un salto, un giro.

### 4.4 Cámara de los golpes y «más zoom»
**Al usuario no le gustan los contrapicados desde el suelo ni la cámara quieta.** Cámara **un poco por encima de la cabeza**
(1,7–2 m), a 2,5–3,3 m, fov 40–46, mirando al pecho (0,9–1,1 m), y **siempre moviéndose**: gira alrededor (0,3 rad/s),
sube despacio (0,12 m/s) y se acerca. Un plano por golpe. Así además se ve la lona y el ring parece grande.
La cámara sigue la **cadera suavizada** (media de ±0,3 s): los clips de Mixamo desplazan al personaje y si no se sale del plano.

### 4.5 Drones (vistas del local)
- **Alto orbitando**: radio 13, altura 9 → 6,5, mira al centro. Para presentar el sitio.
- **Cenital girando**: encima del personaje (3,5–5 m), mirando abajo y girando poco a poco. Para acrobacias.
- **Sobre el pasillo**: 9 m arriba, un poco por delante del que camina.
- **Subiendo sobre la grada**: para «fama mundial», «todo el país»…
- Cuidado con el techo, el marcador y las vigas de luces: pasa por debajo. Los drones van con `libre = true` (sin el límite de la jaula).

### 4.6 Golpe fuerte (dato clave, final de frase)
Todo a la vez, en el mismo fotograma: sacudida de cámara (`sacude`), aberración cromática que se apaga en 0,4 s,
destello blanco, confeti y rótulo grande. Sonido: golpe + trueno grave. **Un solo golpe fuerte por momento**.

### 4.7 Fuego, apagón y silueta
- Pirotecnia: llamas = planos aditivos que suben y miran siempre a la cámara, más una luz naranja que parpadea.
- Apagón: negro 0,4 s, el público se calla (en el audio también), foco azul al fondo y un **halo detrás** de la silueta
  (si no, la silueta negra no se ve contra el fondo negro).

### 4.8 Rótulos de tele
Tarjetas que entran de lado justo cuando suena el sello, rótulo de luchador (`#chyron`), mosca «SCD · EN DIRECTO», contador 10K,
barra «cargando» con rayas que se mueven. Todo HTML encima del lienzo, movido desde `dibuja(t)`.

## 5. Sonido (mezcla.py)
- Voz siempre arriba: ≥ 8 dB sobre todo lo demás mientras habla. La comprobación lo mide.
- **Solo suena lo que se ve**: si no hay golpe en imagen, no hay sonido de golpe.
- Golpes ≤ 0,4 de volumen. El público reacciona **al terminar** la frase, no encima.
- Como mucho 3 sonidos a la vez. LUFS −14, pico ≤ −1 dB. Si sale «REVISAR», se arregla antes de grabar.
- Para alargar un tramo sin voz (p. ej., el walk-out): `{'antes': 3.0}` en la frase siguiente.

## 6. Errores que ya pasaron (y su arreglo)
| Síntoma | Causa | Arreglo |
|---|---|---|
| El brazo sale disparado hacia arriba | sumar una **dirección normalizada** como si fuera un desplazamiento | `vecMundo` (desplazamiento) ≠ `dirMundo` (dirección) |
| Dedos doblados hacia atrás | signo de la palma cambiado | izquierda `n = f × s`, derecha `−(f × s)` (medido con «presenta» y «señala») |
| Muñeca retorcida con el micro | todo el giro en la muñeca | el antebrazo se lleva el 65 % del giro alrededor de su eje |
| Lengua azul | su trozo de textura | color por vértice rosa oscuro en los vértices del hueso de la lengua |
| Personaje hundido 0,9 m | el andar viene de otro esqueleto | medir el pie más bajo del ciclo y subirlo (`HUNDE`) |
| Cámara detrás de un poste | la jaula es pequeña | límite de radio (`RC`) y abrir el fov para conservar el encuadre |
| Suelo quemado | material metálico y brillante | rugosidad 0,85, metal 0, color ×0,35 |
| Huecos «transparentes» en la chaqueta | el auto-rig pegó la cintura a los hombros | pasar ese peso a la columna y material a dos caras |
| Octógono «de juguete» / «pequeño» | escala pequeña frente a la gente | ×1,75 en planta (≈ 11 m) y ×1,1 en alto (la valla no debe pasar de ~1,9 m). Las distancias escritas a mano van × `S = K / 1,45`, así se puede cambiar K sin romper planos |
| **Trozos transparentes** en la chaqueta al patear | la malla (IA + auto-rig) quedó en triángulos sueltos con pesos distintos: al moverse se abren grietas | `sueldaPesos(malla, {y0: rodilla, y1: pecho, vueltas: 4})` (personajes.js): los vértices que coinciden comparten pesos y se suavizan. Nunca partir triángulos para «arreglar» pesos |
| Trump **se mete en la lona** | los clips de capoeira bajan la cadera más que el esqueleto de Trump | `alSuelo(p, suelo)` (personajes.js) cada fotograma tras posar: mira la piel deformada y sube al personaje si algo queda bajo el suelo |
| Carteles con la @ **boca abajo** | tras `lookAt`, Three guarda a veces el giro como (π, y, π); poner `rotation.z = balanceo` borra ese π y el cartel se da la vuelta | guardar el giro (`userData.giro = rotation.clone()`) y cada fotograma `rotation.copy(giro); rotateZ(balanceo)`. Nunca escribir `rotation.x/z` sobre algo orientado con `lookAt` |
| Carteles con la @ **en espejo** | plano con `DoubleSide`: por detrás se ve al revés | material de una cara + copia girada 180° (`m.add(copia.rotateY(Math.PI))`). Nunca `DoubleSide` con texto |
| Carteles tapando la cámara en el walk-out | repartidos en círculo, algunos caían en el pasillo | saltar los ángulos del pasillo al colocarlos |
| Trump «quemado» en el túnel de fuego | luz puntual de 60 a 1 m de la cara | 14 ± 6: el fuego se ve por las llamas, no por quemar la cara |
| Medio plano negro en un golpe | contrapicado mirando a 1,1 m cuando en el pico el cuerpo va agachado: se ve el techo negro | más lejos (2,8 m), mirada a 0,9 m, fov 42 |
| Plano ilegible y oscuro (acrobacia) | cámara a 0,2 m pegada al cuerpo, sin luz encima | 0,5 m, a 3 m, y cenital sobre el personaje |

## 7. Cómo llevarlo a Españistán (tinta)
El motor de títeres (`fabrica/titeres`) es 2D, pero las ideas son las mismas:
1. **Primer plano que habla**: usar `boca.json` (palabras + volumen) para la boca del títere: vocales abiertas según volumen,
   p/b/m cerradas, «o/u» redondas. Encuadre de cara con empuje lento y golpe de cámara en la palabra fuerte.
2. **Cortes en la palabra**: anclar planos y gestos a palabras de whisper, no a segundos a mano.
3. **Rampa** en los gestos fuertes (`golpea`, `puno`, `salta`): rápido → lento en el pico → rápido.
4. **Contrapicado** para el que manda; **dron** = cámara que se eleva sobre el decorado con parallax.
5. **Golpe del dato fuerte**: sacudida + destello + rótulo, una vez por escena.
6. Después de lo épico, **volver a la tinta** con la transición de viento (cambio de lugar/año) y el ritmo calmado del narrador.

## 8. Cómo se anima un golpe de anime de verdad (medido en One Punch Man, 1-11-2026)
Ejemplo del usuario (~/Downloads/«Visual changes).mp4», 7:37–7:47), fotograma a fotograma. Lo que hacíamos mal: planos largos de un solo dibujo con malla = **parece cómic**.
- **24 imágenes distintas por segundo**: los personajes van a dos o tres dibujos, pero los efectos (luz, brillo, chispas, capa, cámara) cambian en cada fotograma.
- **Planos cortos**: en el clímax casi todos duran menos de 0,5 s; solo se aguantan el contacto (~1 s) y la reacción (~1,3 s).
- **Secuencia del golpe**: 1) acercamiento en estroboscopio (≈2 s alternando fotogramas casi blancos/magenta con el personaje cada 2–3 fotogramas); 2) un fotograma borroso (smear) del puño; 3) **contacto** visto por encima del hombro del que pega, aguantado ~1 s pero vivo (capa y pelo ondean, brillo que late, temblor); 4) destello blanco con líneas de velocidad (2 fotogramas) y 2 fotogramas en negativo; 5) **plano detalle de la reacción** del que recibe (el ojo: la pupila se encoge y salen venas, dibujos progresivos); 6) plano general: anillos de onda, escombros y el objetivo sale volando dentro de una estela de energía.
- Paleta corta: blanco + un color (magenta) en el impacto; el resto oscuro.
- Lo que falta para hacerlo así: dibujos clave nuevos (contacto por encima del hombro, ojo de la reacción) con Gemini/Nano Banana; los efectos y el montaje, en el motor.
- **El plano del contacto, fotograma a fotograma** (36 fotogramas, 7:39.4–7:40.6): Saitama es **un solo dibujo que no cambia de pose**. Lo que se mueve: 1) 2 fotogramas de smear (puño rojo borroso); 2) la cámara empieza pegada al puño y se aleja en 4 fotogramas sobre el **mismo dibujo**; 3) temblor de cámara en **cada** fotograma (toda la imagen cambia aunque el dibujo no); 4) la capa redibujada en 3–4 poses que se repiten; 5) capa de luz magenta que late; 6) una mancha blanca crece desde el puño y se traga al objetivo y luego se retira; 7) líneas de velocidad en los bordes al final. Conclusión: es dibujo + efectos, como nuestro motor, pero con **el encuadre del contacto**, **capas separadas** (cuerpo, capa/pelo, objetivo, luz) y temblor fuerte cada fotograma.
- **El acercamiento** (7:37.4–7:39.4, 60 fotogramas): 2–3 dibujos de Saitama volando; casi todo el tiempo la pantalla está sobreexpuesta (luz blanca y magenta que se mueve) y él solo asoma 2 fotogramas cada vez. El dibujo casi no cambia: lo que se anima es la luz.
- **La reacción** (7:40.6–7:43, 71 fotogramas): 2–3 fotogramas en negativo (blanco con grietas negras) del mismo dibujo a distintas distancias; luego **un solo dibujo del ojo** durante ~1,5 s: el blanco del ojo pasa de blanco a rosa y a rojo (cambio de color), las venas aparecen poco a poco (capa que se funde), la cámara se acerca despacio y los mechones blancos de alrededor se mueven a dos fotogramas; al final 4–5 dibujos del párpado que se cierra y otro dibujo que se abre de golpe.
- **Regla general**: en los ~5 s del golpe hay unos **10–12 dibujos de verdad**; el resto de los ~120 fotogramas sale de cámara, color, luz y capas. Eso es lo que tenemos que hacer: pocos dibujos buenos por capas + todo lo demás por código en cada fotograma.
