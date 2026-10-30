# Españistán ep. 5 · «La casa de los dos» (≈ 8 min, 30 fps)

**Mismo formato y nivel que el ep. 4** (el usuario, 29-10-2026: «está bien y quiero que siga por esa línea»):
títeres a lo Samurai Jack, viento entre lugares, cortes secos dentro de un lugar, escala épica (lo que manda, gigante; la gente, diminuta),
calma antes del golpe, clima y luz que cuentan la historia, vida al fondo y ambiente siempre. Copiar la estructura de las escenas `04-*.js`
(`T.guion`, `G.x` para las palabras clave, `silencios`, `sonidos`, `carteles` con `nota`, `camara`).

- Guion e historia: `historias/espanistan/05-vivienda.md`. Pasar a `fabrica/herramientas/guion_espanistan-05-8min.tsv` (bloque ⇥ frase).
- Narrador: **Gabo** `o0SveC0zgHFuCsEO3vHR`, `eleven_v4`, en `audio/voz/es/espanistan-05-gabo/`.
- Hablan: f1 **Sanchís** (Javier narrador `PToUZ7lhIUiz1SP94rGo`), f2 **Feijolo** (Carmelo `5egO01tkUjEzu7xSSE8M`), las mismas voces del ep. 4.
- Fichas que ya existen: `sanchis`, `feijolo`, `ansar`, `zapatitos`, `rajoyo`, `decano`. Nuevas: **Lucía** y **Dani** (pareja joven), el **camarero** (Tenerife), **Josep** (Casa Orsola), el **propietario mayor**, la **maestra**.
- Regla de los frascos: **cada frase tiene su objeto**, que reacciona en su palabra clave. Si sin sonido no se entiende, se cambia.
- Cada personaje y cada ciudad llevan su nombre la primera vez que salen (nota o rótulo).

## Movimiento y cine (el usuario, 29-10-2026: «que no se note que es una figurita», «efecto cine muy bueno»)
- **Giros naturales (hecho en el motor, `titeres.js`)**: el títere ya no se aplasta como una carta. Tarda 0,55 s, la cabeza se adelanta,
  pasa de tres cuartos a frente y de vuelta a tres cuartos, y baja un poco el peso al pivotar. Vale para `gira` y para los giros al caminar.
  Los cambios de `vista` también son más suaves (0,45 s y nunca más finos que el 45 %).
- **Transición `paneo` (hecho, `escena.html`)**: `transicion: 'paneo'` en el plano nuevo. La cámara barre a la derecha como si fuera el mismo sitio,
  un poste negro en primer plano tapa el corte y al otro lado ya es otro lugar. Para el efecto completo, el plano nuevo
  empieza cerca y se aleja: `camara: [[desde, x, y, 1.35], [desde + 2.3, 640, 360, 1]]`. Prueba: `escenas/prueba-paneo.js`.
- Dónde va el paneo (el resto, viento): **C → D** (de las caravanas de Tenerife al skyline de Madrid), **D → E** (de Madrid al Eixample)
  y, dentro de F, de la puerta forzada al calendario. Que no haya más de tres por capítulo, para que no canse.
- **Movimientos**: nada de títeres quietos; cada personaje respira, mira y reacciona con hombro, torso y cuello encadenados.
  Arranques y frenadas con aceleración (nunca a velocidad fija), y un pequeño rebote al pararse.
- **Partículas por lugar**: calima y arena en Tenerife, vapor y luces de coches en Madrid, papeles y hojas en Barcelona,
  polvo en la caída de las grúas, lluvia que crece en el cuarto de Lucía y Dani. Su fuerza sigue a la historia (curva `fuerza`).

## Objetos que vuelven (hilo de todo el capítulo)
| Objeto | Nace en | Vuelve en | Qué hace |
|---|---|---|---|
| **La resta**: columna HOGARES (personitas) y columna CASAS (ladrillos); el hueco, en rojo | B | C (Madrid en pequeño), F, G, H | Sube en su número. En F, cada familia de la noria mueve la columna de CASAS; en G, cuatro ladrillos tapan el hueco poco a poco. |
| **La llave** | A | B, H | Lucía y Dani la persiguen; en B se la lleva el del maletín; en H, una grúa a lo lejos y la llave brilla en la ventana. |
| **La noria de dos cabinas** (del ep. 4, `noria`) | F | H | Cada cabina que sube deja caer su ladrillo (o su caja) en la resta. |
| **El mapa de Españistán** con chinchetas | B | C, D, E | Seis manchas rojas (el déficit); cada ciudad se enciende antes de su viento. |
| **La caja VIVIENDA SOCIAL** | E | G | La noria se la pasa al propietario; en G vuelve a la noria. |

## Secuencias
| Sec. | Bloques | ≈ s | Escena | Qué se ve (palabra clave → qué cambia) |
|---|---|---|---|---|
| A · Gancho | 0 | 25 | `05-gancho` (nueva: cuarto con litera) | Lucía y Dani (nombre en nota) en la litera, pósters en la pared. «dos sueldos» → dos nóminas caen en la cama; «litera» → la cámara se abre y se ve la litera entera, ridícula para dos adultos. «a los treinta / veintiséis» → dos velas de cumpleaños, 30 y 26, sobre una tarta pequeña. «quién la dejó así» → por la ventana, la noria del ep. 4 gira a lo lejos. → INTRO (`05-intro`, `EPISODIO = 'Episodio 5 · La casa de los dos'`). |
| B · La resta | 1 | 50 | `05-resta` (nueva) | Pergamino enorme, las dos columnas. «doscientos cuarenta mil» → llueven personitas y la columna sube; «noventa y dos mil» → los ladrillos se apilan y se paran a media altura; el hueco se pinta de rojo con un golpe. «setecientas cincuenta mil» → el hueco se estira hasta salirse del cuadro; sello BANCO DE ESPAÑA. «se subastan» → corte seco a la cola en un portal; un maletín gigante pasa delante y la llave vuela a su mano. «récord» → contador de €/m² que se para en 2.355. «tres ciudades» → el mapa, tres chinchetas que se encienden. |
| C · Tenerife | 2 | 60 | `05-tenerife` (nueva) | Viento. Rótulo TENERIFE · SUR. Hoteles blancos en fila junto al mar, el Teide al fondo. «a cinco minutos» → paneo a un descampado con autocaravanas y ropa tendida. «Cáritas» → nota con fuente; las autocaravanas se encienden de una en una, una cueva al fondo con una luz. «mil trescientos euros» → el camarero (nota: 29 años, contrato fijo) sale al amanecer; nómina contra el cartel de la inmobiliaria «7 noches». «poco suelo, mucho turismo» → balanza: la maleta con ruedas aplasta la nómina. «límite» → pancartas en silueta CANARIAS TIENE UN LÍMITE. «diez años» → un portero con el cartel SOLO 10 AÑOS DE PADRÓN cierra una verja. Pregunta del Decano con su candil delante de la verja. |
| D · Madrid | 3 | 45 | `05-madrid` (nueva) | Viento. Rótulo MADRID. Skyline con grúas paradas. «veintitrés euros» → contador que sube a 23,3. «dos mil euros» → la nómina al lado del recibo: el recibo es más largo y se desenrolla hasta el suelo. «pisos compartidos» → corte a un edificio cortado como casa de muñecas: en cada cuarto se enciende un rótulo (MAESTRA, ENFERMERO, FUNCIONARIO) en su palabra. «más rápido de lo que construye» → la resta en pequeño sobre Madrid. Lo bueno: un par de grúas se ponen en marcha, despacio. |
| E · Barcelona | 4 | 70 | `05-barcelona` (nueva) | Viento. Rótulo BARCELONA · EIXAMPLE. Fachada modernista, CASA ORSOLA. «un fondo» → una mano gigante con gemelos coge el edificio como una maqueta. «por temporadas» → los vecinos salen con cajas; Josep se queda en el balcón (nota). «cientos de personas» → de noche, la calle llena de siluetas con mantas, y la cámara sube por encima. «Ayuntamiento compró» → sello COMPRADO · 9,2 M€. «parche caro» → la hucha municipal se vacía. «tope» → la olla con tapa: el precio no sube, pero el vapor escapa con carteles ALQUILER DE TEMPORADA. «dos mil veintiocho» → diez mil maletas en el mapa de la ciudad, que se apagan de golpe. «ni una casa más» → la resta: el hueco no se mueve. |
| F · Okupación y leyes | 5 | 70 | `05-leyes` (nueva) | Viento. Una puerta con la cerradura forzada; el propietario mayor con un papel del juzgado (nota). «dieciséis mil» → las denuncias caen como fichas sobre el mapa; montón alto en Cataluña. «veintiséis millones» → plano general: la ciudad entera y solo una ventana roja; el propietario la mira con lupa. Calma. «allanamiento / usurpación» → dos puertas iguales: reloj de arena pequeño en una y enorme en la otra. «desde dos mil veinte» → calendario que pasa hojas con el sello PRORROGADO en cada año. «el Estado… le pasa el problema» → la noria (al fondo) deja caer la caja VIVIENDA SOCIAL en brazos del propietario. «no alquilar» → baja la persiana; en la resta cae un ladrillo. Lo bueno: sello JUICIO RÁPIDO. Montesquieu en pergamino. |
| G · Treinta años de noria | 6 + f1 + f2 | 75 | `05-noria` (copia de `04-noria`, con la resta delante) | La feria del ep. 4, ahora con la resta a sus pies. Cada cabina, al subir, deja caer su ladrillo. Ansar (azul) con el plano «todo urbanizable» → brota un bosque de grúas y CASAS se dispara. Zapatitos (roja) → contador +150 %. «reventó» → silencio, y las grúas caen como dominó (golpe y polvo); familia en la puerta con su caja y la bola de la deuda atada al tobillo. Rajoyo (azul) con la carretilla de billetes; «Sareb» → archivador gigante que se cierra con casas dentro. «no volvieron» → CASAS se encoge. Sanchís (roja) con el megáfono: casas de humo que se desvanecen; contador 270.000 → 49.000. f1 Sanchís. f2 Feijolo. «ley del suelo» → la mesa del ep. 4: el plano encima, cada uno tira de una esquina y se rompe. Pregunta del Decano. |
| H · La solución | 7 | 60 | `05-resta` (vuelve) | La resta con su hueco rojo. Cada solución, un ladrillo que cae en el hueco en su número: «Uno» → sello LICENCIA y un recuadro de Tokio (grúas pequeñas de noche); «Dos» → barras Viena 40 / Europa 10 / Españistán 2, y un edificio vienés con candado NO SE VENDE; «Tres» → la caja VIVIENDA SOCIAL vuelve a la noria y la persiana del propietario sube; «Cuatro» → las dos familias del ep. 4 sostienen juntas el cuarto ladrillo. «cien años» → el hueco se cierra un poco, no del todo. |
| I · La balanza | 8 | 30 | `05-balanza` (copia de `04-balanza`) | Platos: grúa, solares, Viena / noria, carretilla, megáfono, hueco rojo. «lo decides tú» → quieta. Último plano: Lucía y Dani en la litera; por la ventana, una grúa empieza a moverse y la llave brilla. |
| J · Outro | — | 12 | `outro` (hecho) | Como en el ep. 4. |

## Épica y ambiente (las reglas del ep. 4, aplicadas aquí)
| Sec. | Lugar y clima | Luz | Vida al fondo | Sonido | Momento épico |
|---|---|---|---|---|---|
| A | Cuarto pequeño de noche, lluvia en la ventana. | Lámpara cálida en el cuarto; fuera, azul. | La noria lejos girando, coches que pasan. | Lluvia, tele de los padres al otro lado de la pared. | La cámara se abre y la litera se ve diminuta en un cuarto enorme y oscuro. |
| B | Pergamino infinito, como un mapa de guerra. | Foco cenital sobre el hueco rojo. | Personitas que siguen llegando por los bordes. | Pasos de multitud y ladrillos que caen; latido grave bajo el hueco. | El hueco rojo se abre como una grieta en el suelo, con polvo y temblor. |
| C | Sur de Tenerife, calima naranja; el Teide gigante al fondo. | Sol duro en los hoteles; sombra larga en las caravanas. Al final, amanecer frío. | Gaviotas, toallas en los balcones de hotel, ropa tendida que ondea. | Mar, maletas con ruedas, motores de autobús de turistas. | Plano general: un muro de hoteles blancos y, a sus pies, las caravanas diminutas. |
| D | Madrid al anochecer, cielo morado, grúas quietas. | Ventanas encendidas una a una. | Metro que pasa, siluetas con mochila subiendo escaleras. | Tráfico, sirena lejana, tintineo de llaves. | La casa de muñecas se abre como un libro y cada cuarto es una vida. |
| E | Eixample de noche, farolas de hierro. | Farolas cálidas; la mano del fondo, en contraluz frío. | Gente con mantas, pancartas, palomas. | Cacerolas y aplausos lejanos; en la noche, una guitarra. | La mano gigante levanta el edificio y los vecinos quedan colgando de los balcones. |
| F | Bloque de pisos en invierno, viento con papeles. | Luz de escalera intermitente (temporizador). | Persianas que se cierran por todo el bloque. | Reloj, cerrojo, eco de escalera. | Silencio, y todas las persianas del bloque bajan a la vez. |
| G | La feria del ep. 4, ahora en obras: andamios, polvo. | Bombillas de la noria; destello en cada caída de ladrillo. | Grúas, obreros diminutos, después nadie. | Organillo de feria que se desafina; estruendo en el dominó. | El bosque de grúas cae en cadena a contraluz de la luna. |
| H | La resta al amanecer. | Luz dorada que entra con cada ladrillo. | Pájaros y obreros que vuelven. | Música que sube poco a poco. | Las dos familias, juntas, sostienen el último ladrillo. |
| I | Cuarto de A, amanece. | Primera luz por la ventana. | La grúa lejana que arranca. | Lluvia que para, pájaros. | La llave brilla en el cristal. |

## Decorados
- Ya existen y se reutilizan: `noria`, `banquete`/`mesa`, `balanza`, `sello`, `mano`, `reloj`, `rascacielos`, `ciudad`, `casa`, `coche`, `farola`, `hucha`, `nomina`, `mapa`, `astro`, `nubes`, `relampago`, `bandera`, `lista`, `montes`, `suelo`, `plano`, `penumbra`.
- Nuevos: `litera`, `columnas` (la resta: personitas + ladrillos + hueco rojo con `hogares`, `casas`, `en`), `grua` (para, arranca, cae en dominó), `hotel` (fila blanca), `caravana`, `cueva`, `teide`,
  `verja` (con cartel), `casa-munecas` (edificio cortado con cuartos que se encienden), `recibo` (que se desenrolla), `fachada` (modernista), `olla` (tapa y vapor con carteles),
  `maletas` (sobre el mapa, se apagan), `puerta-forzada`, `reloj-arena`, `calendario` (hojas con sello), `persiana`, `archivador` (SAREB), `megafono` (con casas de humo),
  `carretilla` (billetes), `bola` (la deuda en el tobillo), `llave`, `contador` (cifra que sube y se para).
- Fichas nuevas en `personajes.js`: `lucia`, `dani`, `camarero`, `josep`, `propietario`, `maestra`.

## Orden de trabajo
1. Comprobar los datos dudosos (lista del guion) y pasar el guion a `guion_espanistan-05-8min.tsv`. Escribir las frases de Sanchís y Feijolo (`guion_espanistan-05-personajes.txt`).
2. `python3 fabrica/titeres/tiempos.py 05` (tiempos estimados) y, mientras, decorados y escenas A, B y C.
3. Voz de Gabo y de los personajes: **pedir permiso** con los créditos (≈ 6.000 + 100).
4. `tiempos.py 05` con el audio real; afinar las palabras clave con `G.x`.
5. Revisar con `fotos.mjs`, grabar con `grabar.mjs` (escenas de más de ≈ 60 s, por trozos), montar con `montar.py` (lista `SECUENCIAS_05`).

## Hecho (29-10-2026)
- A `05-gancho`: la litera se descubre al abrir la cámara, Lucía se gira (giro nuevo), las tartas 30/26 y la noria en la ventana.
- B `05-resta`: columnas HOGARES/CASAS, hueco rojo, sello del Banco de España, la grieta con 750.000; la cola y la llave que se lleva el del maletín; contador 2.355 €/m² y RÉCORD; mapa con tres chinchetas.
- C `05-tenerife`: hoteles, Teide y mar con calima; barrido a las caravanas, coche, chabola y cueva que se encienden en su palabra; el camarero y el escaparate;
  la balanza sueldo/turista; manifestación con pancartas; la verja de los 10 años; el Decano.
- Tiempos ESTIMADOS: al tener la voz, `python3 fabrica/titeres/tiempos.py 05` y revisar las palabras clave (constantes en mayúsculas de cada escena).
- D `05-madrid`: entra con PANEO desde la verja de Tenerife; 23,3 €/m² y RÉCORD; nómina contra recibo de 2.100 €; casa de muñecas con MAESTRA, ENFERMERO, FUNCIONARIO; la resta pequeña; grúas que arrancan.
- E `05-barcelona`: entra con PANEO desde Madrid; la mano con gemelo de oro levanta la Casa Orsola; vecinos con cajas; la noche de las mantas; COMPRADO 9,2 M€;
  la hucha que se vacía; la olla del tope que hierve con ALQUILER DE TEMPORADA; 48 maletas doradas sobre el Eixample que se apagan; la resta igual.
- F `05-leyes`: puerta forzada y el propietario; 16.426 y la mancha de Cataluña; el bloque con una ventana roja; las dos puertas con relojes de arena (días / meses);
  PANEO al calendario 2020→2026 con PRORROGADO; la caja VIVIENDA SOCIAL cae del Estado al propietario; persianas abajo; JUICIO RÁPIDO; Montesquieu.
- G `05-grua` (en vez de `05-noria`: **sin la noria del ep. 4**, pedido del usuario): una grúa gigante cuya cabina se pone azul o roja con cada presidente.
  Ansar y el bosque de grúas; Zapatitos y +150 %; las grúas en dominó y la familia con la bola de la deuda; Rajoyo, la carretilla, 65.700 M€ y la Sareb;
  la resta con el hueco; Sanchís y el megáfono (270.000 → 49.000); primeros planos con f1 y f2; la ley del suelo rota; el Decano.
