# Retomar: títeres de Españistán (estado al 27-10-2026)

> **Para Claude en un chat nuevo:** lee esto, `fabrica/titeres/README.md` y `CLAUDE.md`. Rama: `claude/espanistan-ep04`.
> El usuario (Nicholas) no es programador: háblale en español, corto y claro.

## Qué hay hecho
- **Biblioteca de títeres** en `fabrica/titeres/`, con personajes dibujados en cada fotograma (12 dibujos/s). Ya no se recortan fotos.
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

## Lo que pidió el usuario y falta
1. **Mejor animación de movimiento** (lo último que pidió).
   - Que hombros, torso y cuello se muevan encadenados y con lógica: cuando el brazo sube, el hombro se levanta y el pecho gira; el cuello sigue al torso y la cabeza llega después.
   - Hoy el brazo sale de un punto fijo y el tronco es rígido.
   - Mirar sus referencias de Samurai Jack: poses con peso, contrapposto, siluetas claras.
   - Idea: hombro como articulación propia (sube y se adelanta con el brazo), torso en dos piezas (pecho y cadera, con giro entre ellas), cuello con su propio ángulo y retraso.
2. **Voces elegidas (27-10-2026)**: narrador **Danny Your Storyteller** `wnKyx1zkUEUnfURKiuaP`; Acascar **Leónidas** `YKrm0N1EAM9Bw27j8kuD` (`eleven_v3`).
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
