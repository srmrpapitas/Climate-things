# Ep. 7 «La fábrica de respuestas» (educación) · plan de planos

Guion: `fabrica/herramientas/guion_espanistan-07-8min.tsv` (50 bloques, 74 frases, ≈ 1.420 palabras ≈ 11 min con intro y outro; datos de PISA 2025). Datos: `historias/espanistan/07-educacion.md`.
**A 60 fps** (aprobado el 30-10-2026 tras la prueba): es el primer capítulo así. Borradores con `FPS=30 node grabar.mjs …` y la versión definitiva, sin FPS. El ep. 6 va a 30 fps y el usuario quiere compararlos.

## Mejoras del motor antes de grabar (notas del ep. 6, en `CAPITULO-SIGUIENTE.md`)
1. **60 fps de punta a punta**:
   - `fps: 60` en cada escena.
   - `grabar.mjs` lee `window.FPS`; revisar el `-framerate` del ffmpeg.
   - `montar.py`: cambiar `fps=30` y el `-framerate 30` de la ráfaga por una variable `FPS` que el ep. 07 ponga a 60. La ráfaga de viento se vuelve a generar a 60.
2. **Tinta que respira**: dejar ≥ 3 s entre que termina un `forma.aparece` o una `metamorfosis` y el siguiente cambio. Comprobarlo con un aviso en `T.guion` que avise en la consola si dos cambios quedan a menos de 3 s.
3. **Tinta coherente**: la que se deshace es la misma que forma lo nuevo (mismo color y materia) y viaja a favor del viento. `metamorfosis` ≈ 3 s, en vez de 2,4.
4. **Viento natural**:
   - Ráfagas que cambian de fuerza (ruido lento sobre `viento`).
   - Remolinos que se abren y se cierran.
   - Hojas que giran sobre sí mismas.
   - Gotas de tinta que gotean y se estiran.
5. **Primero, `escenas/prueba-tinta.js` a 60 fps**: 15 s con viento, una metamorfosis y un actor con `forma`, para que el usuario lo vea antes de hacer el capítulo.

## Hilo visual (lo que vuelve en todo el capítulo)
- **Los pupitres en filas** (`pupitres`, nuevo): son el mismo objeto en 1763, en 1857, en 1900 y hoy.
  - En cada época solo cambia el material (madera tosca, pizarrín, formica, tablet). La tinta los redibuja sin mover las filas.
  - Al final se doblan en un círculo (`pupitres` con `circulo: 0→1`).
- **El timbre** (`campana`, ya existe): suena en cada cambio de época.
- **La pizarra del bate y la pelota** (`pizarra`, ya existe): abre y cierra; la respuesta queda tapada con un trapo hasta b49.

## Fondos nuevos (`decorados-07.js`)
| Fondo | Uso |
|---|---|
| `pupitres` | filas de N × M, `epoca: 1763/1857/1900/hoy`, `circulo` 0-1 (de filas a mesa redonda) |
| `plazaPrusia` | cuartel con águila, soldados en fila (1717-1763) |
| `campoJena` | humo, cañones y la silueta de Napoleón a caballo (1806) |
| `barcoAtlantico` | Horace Mann cruza el mar; el papel viaja con el viento |
| `escuelaMadera` | escuela de una sala de Massachusetts (1852) |
| `escuelaRural` | escuela española de pueblo, estufa y mapa de España (1857 y 1900) |
| `aulaHoy` | aula de hoy de noche; fluorescentes, 30 pupitres, proyector |
| `bombo` | el bombo de bolas de la oposición; las bolas caen con número |
| `claustro` | patio gótico (Eton y Oxford), sin escudos reales |
| `mesaOvalada` | mesa Harkness con 12 sillas, vista cenital y de lado |
| `estudioOxford` | dos sillones, libros, el ensayo en la mano |
| `aulaWaldorf` | madera, lana y ventanales con árboles; sin pantallas |
| `agora` | Atenas al atardecer, columnas nuevas dibujadas para el capítulo |
| `konigsberg` | calle nevada de 1784 con farolas de aceite |
| `bosqueNieve` | Estonia: pinos, nieve y un aula de cristal en medio |
| `campanaGauss` | la curva normal; la del tutor se desplaza dos desviaciones (Bloom) |

**Paisajes nuevos (usuario, 30-10-2026):** nada de parlamento, noria ni balanza, que ya están muy vistos. Cada lugar del capítulo es un fondo nuevo.
Solo se reutilizan piezas pequeñas: `pizarra`, `marcador`, `calendario`, `mapa` (el mapa de abandono por comunidades), `barras`, `campana`, `atril` (falacias), `sello` (la etiqueta de cada falacia), `huchaGrande` (la «educación bancaria») y `cieloNoche`.
También son nuevos `mochilas` (b30: una con libros y otra con monedas y tarjetas de contactos), `barcaRemos` (b34: con un solo remo, la barca gira en círculos; con los dos, avanza) y `puertaColegio` (b16: el lema de Séneca al derecho y al revés).

## Secuencias (≈ 10 min)
### 1 · `07-gancho` (b1–b3) · aula de hoy, de noche; la pizarra
- b1: la tiza escribe el problema palabra a palabra (`G.k`). Al llegar a «¿Cuánto cuesta?», silencio de 1,5 s y un reloj.
- b2: «diez céntimos» → aparece 0,10 € y la tiza lo tacha en rojo.
  - «Harvard, MIT, Princeton»: tres birretes caen sobre los pupitres.
- b3: Lucía y Dani se forman con tinta en sus pupitres (con ≥ 3 s antes del cambio). «cómo se arregla» → la cámara se acerca a la pizarra tapada. → INTRO

### 2 · `intro` (la clásica: los impares, `intro.js`)

### 3 · `07-prusia` (b4–b8) · 60 % de metamorfosis, porque los pupitres no se mueven y la época cambia a su alrededor
- b4: `plazaPrusia`, 1717. Un soldado lleva a los niños en fila. Las filas de soldados se deshacen en tinta y quedan las filas de pupitres.
- b5: 1763, el reglamento con sello de cera; suena el timbre por primera vez. Cada palabra («edades, filas, maestro, timbre») enciende su objeto.
- b6: viento → `campoJena`. Humo y la silueta de Napoleón; Fichte se forma con hojas y señala la escuela.
- b7: el papel de la ley vuela con el viento sobre el `barcoAtlantico` hasta `escuelaMadera` (sin cortar: la cámara sigue el papel).
- b8: el papel cae en `escuelaRural`. Moyano con su nota; los niños de 6 a 9 años entran.

### 4 · `07-matiz` (b9–b10) · `escuelaRural` en 1900 → `aulaHoy`
- b6: la mano de Fichte moldea un niño de arcilla en forma de soldado (su cita).
- b9: el Decano mira con la lupa la frase «para fabricar obreros» y la corta por la mitad: «media verdad».
- b10: `barras`, 59 % en 1900 frente a ≈ 1 % hoy. Metamorfosis de 1900 a hoy: las paredes cambian, los pupitres no. La pregunta del Decano se queda 3 s.

### 5 · `07-hoy` (b11–b15) · aula de hoy
- b11: `calendario` de 1980 a 2020. Cada ley cae como un libro sobre la mesa del profesor; ocho libros y la mesa se dobla.
- b12: `marcador` 473 frente a 472; la cifra de 2012 (484) baja, y una regla mide «un curso».
- b13: Dani repite: se levanta, da la vuelta a la clase y se vuelve a sentar en el mismo sitio. Su nota, −99 puntos.
- b14: `mapa` de comunidades; País Vasco en verde (3,6 %) y Murcia en rojo (20,6 %).
- b15: los alumnos crecen en sus pupitres y se hacen adultos (metamorfosis); tres barras por debajo de la línea de la OCDE.

### 6 · `07-memoria` (b16–b19) · aula de hoy → oposición
- b16: un embudo en la cabeza de Lucía; los datos entran, salen en el examen y en verano se evaporan con el sol.
- b16: `puertaColegio`: «NON VITAE SED SCHOLAE» (Séneca, una queja). La tinta da la vuelta a las palabras y queda «NON SCHOLAE SED VITAE» sobre la puerta.
- b17: en la pizarra, «Ética» se borra sola (2013) y el borrador vuelve en 2020 sin escribirla.
- b18: «Filosofía» queda escrita en una puerta con el cartel «Bachillerato, no obligatorio».
- b19: `bombo`: salen las bolas y el opositor escribe de un tirón; la cámara ve su mano a toda velocidad.

### 7 · `07-elite` (b20–b30) · el mismo tamaño de pupitre, pero cada vez menos alumnos por adulto
- b21: `agora`, Aristóteles y Alejandro, uno a uno (silueta griega).
- b22: `campanaGauss`: la campana del tutor se desplaza; «noventa y ocho por ciento» → la sombra cubre casi toda la clase normal.
- b23: la campana se encoge hasta ≈ 0,4 (el matiz), pero sigue a la derecha.
- b24: viento → `claustro`. Veinte chisteras pasan en fila: los primeros ministros.
- b25: `mesaOvalada` en cenital: 12 alumnos; las flechas de quién habla van de unos a otros y el profesor queda en gris.
- b26: `estudioOxford`: Lucía lee su ensayo y el tutor la interrumpe con una pregunta.
- b26: Plutarco: un vaso que rebosa de agua y, al lado, un leño que prende con una chispa.
- b27: `aulaWaldorf`: un portátil se deshace en hojas que se vuelven lana.
- b28: un niño Montessori monta solo una torre de cubos; nota «Fundadores de Google · ABC, 2004».
- b29: un libro «¿Cómo lo sabes?»; luego pantalla partida: a la izquierda «RESPUESTAS» (filas) y a la derecha «PREGUNTAS» (mesa redonda).
- b30: `mochilas`: en una, el método (libros); en la otra, dinero y contactos, y pesa más. Las chisteras de Eton caen en fila como fichas de dominó.

### 8 · `07-pensar` (b31–b35) · noche azul, la lupa del Decano
- b31: Sócrates en el ágora dibuja el cuadrado en la arena (el *Menón*).
- b32: `konigsberg` nevado; Kant pasea y «Sapere aude» se escribe con tinta en el aire.
- b33: `huchaGrande` con forma de cabeza; el profesor mete monedas-dato.
- b34: `barcaRemos`: un remo es «memoria» y el otro «pensar». Con uno solo, la barca gira en círculos; con los dos, avanza recta.
- b35: un pergamino de Aristóteles con 13 casillas (las trampas); tres atriles se forman con tinta.

### 9 · `07-falacias` (b36–b40) · los tres hablan
- Cada uno en su atril, con su voz. Tras cada frase, el Decano estampa el `sello`: FALSO DILEMA, HOMBRE DE PAJA, ATAQUE A LA PERSONA.
  - Falso dilema: aparecen las dos puertas y una tercera se abre sola.
  - Hombre de paja: se ve el muñeco de paja de Feijolo y el viento se lo lleva.
  - Ataque a la persona: el dato queda en pie mientras la flecha apunta a quien lo dijo.
- b40: la urna; la pregunta del Decano se queda 3 s.

### 10 · `07-estonia` (b41–b42) · viento → `bosqueNieve`
- b41: el mapa de la URSS se resquebraja y Estonia se separa (1991).
- b42: el aula de cristal; la profesora cambia la pizarra a su gusto. El cartel PISA, 1.º de Europa en ciencias.

### 11 · `07-solucion` (b43–b48) · amanecer, las cuatro casillas (como `06-solucion`)
- b43: Montaigne: dos cabezas de perfil; una llena hasta arriba de papeles, la otra con engranajes que giran.
- b44: ensayo, `mesaOvalada` pequeña.
- b45: niños de primaria con un signo de interrogación gigante.
- b46: refuerzo en grupo de 4 y, junto a Dani, un tutor con IA (un candil que pregunta, no responde).
- b47: profesor con bata de prácticas, y el libro de la ley firmado por dos manos de colores distintos.
- b48: las filas de pupitres se doblan en círculo (`circulo: 0→1`, 4 s, sin cortar).

### 12 · `07-final` (b49–b50) · la pizarra del principio, ahora de día
- b49: el trapo cae; la tiza escribe 0,05 + 1,05 = 1,10. Un reloj marca «1 segundo».
- b50: la cámara se aleja: el aula entera en círculo y Lucía y Dani discuten. → OUTRO

## Pasos
1. `prueba-tinta.js` a 60 fps → el usuario la aprueba.
2. Guion aprobado → voces (Gabo en v4, una llamada por frase corta) y frases de los personajes. `tiempos.py` → `escenas/tiempos-07.js`.
3. `decorados-07.js` con los fondos nuevos y revisión con `fotos.mjs`.
4. Escenas `07-*` con `T.guion([...])`, `cartoon: true`, `fps: 60` y la regla 60/40 + ≥ 3 s.
5. `SECUENCIAS_07` en `montar.py` (`intro`), montaje a 60 fps, miniatura y difusión.
