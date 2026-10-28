# Retomar: títeres de Españistán (estado al 27-10-2026)

> **28-10-2026, 18:30: lo último está en `fabrica/manual/RETOMAR.md`, sección «▶ AHORA» (ep. 4 terminado y programado; qué sigue).**

> **Para Claude en un chat nuevo:** lee esto, `fabrica/titeres/README.md` y `CLAUDE.md`. Rama: `claude/espanistan-ep04`.
> El usuario (Nicholas) no es programador: háblale en español, corto y claro.

## 28-10-2026: ep. 3 entero en títeres (formato de todos los episodios a partir de ahora)
- **30 fps** en todo (`fps: 30` en las escenas; `grabar.mjs` saca 30 fps). Narrador **Gabo** en `eleven_v4`, guion de 8 min
  (`fabrica/herramientas/guion_espanistan-03-8min.tsv`, audio en `audio/voz/es/espanistan-03-gabo/`).
- Las escenas se cuadran solas con la voz: `python3 fabrica/titeres/tiempos.py` → `escenas/tiempos.js`; en la escena,
  `const G = T.guion([5, 6, 'f1'])` da `G.voces`, `G.en.b6`, `G.en['b6.2']` (segunda frase) y `G.fin`.
- Once secuencias (plan en `CAPITULO-03-PLANOS.md`): `apertura`, `fuego`, `condesa`, `nace-vox`, `subida`, `chiringuitos`, `mano-daga`,
  `frascos`, `balanza`, `cierre`, `outro`. Se revisan con `node fabrica/titeres/fotos.mjs ESCENA 3 8.5 …` antes de grabar.
- Montaje: `python3 fabrica/titeres/montar.py out/espanistan-03-animado.mp4` (ráfaga de viento entre secuencias con `rafaga.mjs`
  y música propia por ambiente con `musica.py`).
- Motor nuevo: `brinca` (salto grande), `cuelga` (de una cuerda; sigue a la campana), `paneles` (pantalla partida), `franjas`,
  `sonidos` (efectos), decorados con `desde`/`hasta`, carteles con `tiempos` por fila, subtítulos en dos líneas.
  Decorados nuevos: `pulgar`, `boton`, `campana`, `disco`, `caseta`, `estante`, `frasco`, `lista`.

## Qué hay hecho
- **Biblioteca de títeres** en `fabrica/titeres/`, con personajes dibujados en cada fotograma (30 dibujos/s). Ya no se recortan fotos.
  - Esqueleto con pies apoyados al andar; 15 gestos; vistas de perfil, de frente y de espaldas.
  - Caras con detalle (cara angulosa a lo Jack) y movimiento secundario.
  - Viento (pelo, barba, corbatas, faldones, jirones) y doble contraluz turquesa/cálido.
  - Desenfoque de lo lejano, grano de película.
  - Transición de **viento** (a lo Samurai Jack) y **cielo rojo** para los momentos intensos, que vuelve al marrón con otra ráfaga.
  - Subtítulos con el nombre de quien habla, carteles con datos reales y títulos.
- **Escenas** (`escenas/`), cada una con su vídeo en `out/`:
  - `mitin`, `mitin2`;
  - `sueldo` (Acascar y su sueldo: diálogo + datos reales);
  - `elegido` (presentación de **El Elegido y la Espada de la Verdad**).
- **El Elegido**: el protagonista de toda la serie.
  - Moño y cinta al viento, túnica con jirones.
  - Su espada de Toledo es lo **único en color real** (acero, oro y rojo), incluso en los planos rojos.
  - Con ella **corta la máscara de los mentirosos**: el Vendehúmos, un político genérico que no es nadie real, lleva la máscara de PROMESAS.
- Grabar: `python3 -m http.server 8765` (raíz) y `node fabrica/titeres/grabar.mjs NOMBRE out/NOMBRE.mp4` (≈ 4 s por segundo de vídeo).

## Hecho el 27-10-2026 (tarde)
- Estilo **a lo Samurai Jack** en los planos `jack: true`: color plano, figura en dos tonos, cámara quieta, gestos secos.
- Esqueleto nuevo: espalda en tres tramos, hombros, rodillas, muñecas y dedos; dar la mano, daga y puñalada, reptar, trepar.
- Transiciones: viento, cuervos, papeletas, humo, tinta y tajo. Cambio de escena = transición; dentro de la escena, cortes secos.
- Historia del ep. 3: `historias/espanistan/03-acascar-historia.md`. Actos hechos (sin voz): 4 `desierto`, 5 `subida`, 6 `mano-daga`.
- **28-10: prueba de voces hecha y aprobada** (Danny y Leónidas, Eleven v4, ≈ 1 crédito por carácter, desde la web).
  - El conector de Claude sigue en la cuenta antigua y el navegador integrado no descarga: para guardar audios hace falta la clave de API de la cuenta buena en `~/.elevenlabs_key` (la crea el usuario).
- **28-10 noche:** narrador del ep. 3 hecho con Danny en frases cortas (`fabrica/herramientas/voz_frases.py`, `audio/voz/es/espanistan-03-danny/`) y las 5 frases de Acascar con Leónidas (`audio/voz/es/espanistan-03-acascar/`).
  - Actos 1 `fuego`, 2 `condesa`, 3 `nace-vox` y 7 `balanza` escritos (decorados nuevos: casa, tienda, llamas, coche, nómina, letrero, muralla, balanza; ficha `condesa`).
  - El capítulo entero con la voz nueva se monta solo con `fabrica/videos/espanistan-03-danny/noche.sh` (registro en `noche.log`); deja todo en `~/Desktop/Espanistan-03/`.
- Siguiente: revisar el render de la noche y los actos; meter los actos de títeres en el capítulo.
- **28-10 (cierre):** ep. 3 terminado (≈ 8 min 12 s), con intro (`escenas/intro.js`) y outro de 12 s. Lecciones para el ep. 4 en `fabrica/manual/CAPITULO-SIGUIENTE.md`.

## Lo que pidió el usuario y falta
1. **Mejor animación de movimiento** (lo último que pidió).
   - Que hombros, torso y cuello se muevan encadenados y con lógica: cuando el brazo sube, el hombro se levanta y el pecho gira; el cuello sigue al torso y la cabeza llega después.
   - Hoy el brazo sale de un punto fijo y el tronco es rígido.
   - Mirar sus referencias de Samurai Jack: poses con peso, contrapposto, siluetas claras.
   - Idea: hombro como articulación propia (sube y se adelanta con el brazo), torso en dos piezas (pecho y cadera, con giro entre ellas), cuello con su propio ángulo y retraso.
2. **Voces aprobadas (28-10-2026)**: narrador **Danny Your Storyteller** `wnKyx1zkUEUnfURKiuaP`; Acascar **Leónidas** `YKrm0N1EAM9Bw27j8kuD` (`eleven_v3`).
   - Primero, prueba de ≈ 500 créditos (una frase de narrador + «Los jóvenes me adoran. Será por el caballo.»), en cuanto ElevenLabs esté conectado a la cuenta buena.
   - El 27-10 seguía conectado a la cuenta de «Narrador Si se duplica» (no aparece la voz «narrador»): no gastar ahí.
   Antes: **Voces** de la escena `sueldo` (≈ 700 créditos; pedir permiso).
   - Narrador: voz «narrador» `6M0AS3MD73daMRG01Q0P` (cuenta buena, 40.000 créditos, plan Starter).
   - Acascar: Leónidas `YKrm0N1EAM9Bw27j8kuD`.
   - Vecina: proponer «Mari Carmen Discute» `YDDaC9XKjODs7hY78qEW`.
   - Vecino: «Kurry Caché» `zuKOnzM8OJyC1IQIhCHR` o «Efrayn» `1MxuWc12WPRxDkgfT3kj`.
   - **Ojo**: la conexión de Claude con ElevenLabs apuntaba a la cuenta antigua (sin créditos; todo lo de más de 5 créditos fallaba).
     Comprobar con `creative_list_voices` que aparece la voz «narrador»; si no, pedirle que reconecte ElevenLabs en claude.ai.
   - **Narrador siempre en frases cortas, una llamada por frase, y pegarlas** (`fabrica/herramientas/guion_espanistan-03-frases.tsv`). Nunca ralentizar.
3. **Rehacer el ep. 3** con la biblioteca nueva (y su narrador en frases cortas, ≈ 7.700 créditos).
4. **Ep. 4, el bipartidismo**: protagonistas Sanchís, Feijolo y antiguos representantes de los partidos (preguntar cuáles y sus nombres de sátira).
   Datos ya comprobados en la memoria de Claude (`espanistan-ep04-en-pausa`).
5. Después de los políticos: **capítulos semanales** con El Elegido como hilo de la serie.

## Normas del usuario
- Lo principal: **que sea entretenido**, como un corto de Netflix, con datos reales que tengan sentido.
- Planos de cine (general, medio, primer plano, contraplano, de frente y de espaldas), algo nuevo cada 1–2 s.
- Rojo solo en lo intenso y vuelta al marrón. Toque propio: teatro de sombras sobre pergamino.
- Series: nadie es culpable sin sentencia; nunca decir a quién votar; lo bueno también se cuenta.
- Preguntar antes de gastar créditos (decir cuántos) y antes de elegir voces (enseñar 2–3).
