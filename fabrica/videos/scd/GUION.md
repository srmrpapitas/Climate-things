# SCD (Si se duplica) — Trump vs Sánchez · guion v1 (31-10-2026)

Vertical 9:16, ≈ 45 s, 30 fps. Octógono `modelos/scd/octagono.glb` rebautizado **SCD** (logo en lona y pantallas).
Música: «America, F*** Yeah» (Team America). **Tiene copyright**: el vídeo se renderiza SIN la canción, cortado a su ritmo,
y la canción se añade en la app de Instagram al subir (biblioteca de música). Si se pega en el mp4, IG lo silencia o lo bloquea.

Presentación al estilo de los anunciadores de UFC: **cambios de ritmo** (susurro grave → lista rápida y seca → subida lenta → explosión),
mezcla de español con fogonazos en inglés, giro de 360° del presentador señalando la esquina. Voz propia, no clonada.
(«It's time!» es marca registrada de Buffer: usamos «¡ES LA HOOORA!».)

| # | Tiempo | Imagen | Presentador (ritmo) |
|---|---|---|---|
| 1 | 0,0–3,0 | Primer plano del presentador, foco cenital, humo. Empieza hablando bajito, pegado al micro. | *Susurro grave:* «Señoras y señores…» → *sube de golpe:* «¡ES… LA… HOOOOORAAAA!» |
| 2 | 3,0–4,5 | Dron rápido sobre la jaula SCD, gradas llenas, flashes; **el público levanta carteles con @ de seguidores**. | *A tope:* «¡Bienvenidos… al COMBATE DEL AÑOOOO!» |
| 3 | 4,5–12,0 | **Walk-out AMV**, cortes en cada bombo (túnel, zapatos, corbata, puño, pantalla «TRUMP», público). 2–3 cortes son **primeros planos de carteles con @** en la grada. | Música. En huecos: «¡Desde la Casa Blancaaa…!» · «¡El hombre… el mito… el bronceado!» |
| 4 | 12,0–14,0 | Le ponen los guantes rojos; los choca. | Golpe de guantes. |
| 5 | 14,0–16,0 | Entra en la jaula, la puerta se cierra. El presentador gira 360° y señala la esquina roja. | *Larguísimo:* «AAAAAAAAAND INTRODUCING FIRST!» |
| 6 | 16,0–21,0 | Trump calentando; tarjetas del récord, una por golpe seco. | *Rápido y seco, casi de notario:* «Peleando desde la esquina roja… con un récord profesional de: dos guerras. Deportaciones. Un color naranja. Una elección perdida… y CERO empates.» |
| 7 | 21,0–24,0 | Tarjeta: **1,90 m · 102 kg**. | *Lento, guiño:* «Mide un metro noventa… y pesa ciento dos kilos… según su médico.» |
| 8 | 24,0–28,0 | Trump da **dos vueltas** saludando; cámara orbitando y, detrás, la grada llena de **carteles con @** (legibles al pasar). | *Sube poco a poco:* «Peleando desde Washington D. C.… nacido en Queens, Nueva York… el presidente número cuarenta y cinco… ¡y cuarenta y siete… de los Estados Unidoooos!» |
| 9 | 28,0–33,0 | Plano heroico a cámara lenta, confeti dorado. | *En inglés, explosión:* «THE DEALMAKER… THE TARIFF MAN… THE ONE… AND ONLY…» → «¡DOOOONAAAALD… TRUUUUUUMP!» Ovación, música a tope. |
| 10 | 33,0–38,0 | Apagón. Foco azul en el túnel. Silueta alta. Tarjeta: **también 1,90 m**. | *Vuelve el susurro:* «Y en la esquina azul… con la misma altura…» Latido grave. |
| 11 | 38,0–42,0 | Silueta de Sánchez a negro. «PARTE 2». | «¿Quién gana? Parte 2.» |

Notas:
- **Carteles con @ de seguidores** en la grada (sin pedirlo en audio ni texto: el que se ve, lo comparte). Nombres: comentarios con más likes + seguidores recientes; tamaño legible en vertical (≥ 40 px de alto). Algunos carteles con dibujo (corazón, bandera, «SCD»).
- El gancho es el presentador en el segundo 0 (nada de logos ni intro antes). Nada de «el combate que nadie pidió»: es «el combate del año».
- Datos reales a verificar: nació en Queens; 45.º y 47.º presidente; «Tariff Man» se lo llamó él mismo (tuit de dic. 2018).
- Récord: es broma del usuario; los únicos datos que se presentan como reales son altura y peso (verificar fuente al hacer las tarjetas).
- Sánchez mide ≈ 1,90 m (dato muy citado; verificar antes de usar).
- Voz del presentador: voz propia en ElevenLabs con estilo de presentador de combates (vocales alargadas, sube hasta gritar). NO clonar la voz real de Bruce Buffer.

## Piezas
- Trump con esqueleto: `modelos/scd/trump.glb` (Mixamo + `faldon-a-cadera.mjs`). Estatua original: `trump-estatua.glb`.
- Sánchez: pendiente (Hunyuan3D-2 desde imagen caricatura → Mixamo).
- Clips: `modelos/scd/anim/` (Entry, Victory, golpes…). Faltan de Mixamo: presentador (Yelling, Talking, Pointing), árbitro (Idle, Waving), público (Cheering, Clapping), calentamiento (Warming Up, Shadow Boxing), ponerse guantes.

## Parte 2 — comentaristas (parodia: «Jou Rogán» y «Daniel Comier», voces inventadas, nunca clonadas)
**En inglés, como en la retransmisión original de UFC, con subtítulos en español.** El presentador sigue en español.
| Inglés (lo que dicen) | Subtítulo |
|---|---|
| He's hurt! He's hurt! | ¡Lo ha sentido, lo ha sentido! |
| He's out on his feet! | ¡Está grogui! |
| He's wobbly… | Está medio grogui… |
| He's going fishing! | ¡Lo dejó pescando! |
| Ooh, that one-two was clean… I felt that one! | Uff, ese uno-dos fue limpio… ¡hasta a mí me dolió! |
| This is a slaughterhouse! | Aguita… esto sí es una carnicería. |
| After this fight, [X] is gonna need a new face for his ID. | Después de este combate, [X] tendrá que cambiarse el DNI. |
| Beautiful right hook! | ¡Bonito gancho de derecha! |
| Oh my God! · It's all over! · His legs are gone! | ¡Madre mía! · ¡Se acabó! · ¡Se le doblan las piernas! |

## Daño en los personajes (plan)
- Moratones, cortes e hinchazón pintados encima de la textura de la cara, que van creciendo por asaltos.
- Hinchazón del ojo moviendo los vértices de esa zona.
- En cada golpe: chorro de sudor y saliva (partículas), destello, temblor de cámara y repetición a cámara lenta en los buenos.
- Sangre: solo unas gotas en la lona; si hay mucha, Instagram limita el vídeo.

> **ARCHIVADO (31-10-2026):** no superó las pruebas de calidad (la chaqueta del Trump de IA se rompe en las acrobacias). No retomar salvo que se pida.
