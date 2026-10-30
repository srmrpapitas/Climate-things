# Biblioteca de títeres (teatro de sombras animado)

Personajes dibujados **en cada fotograma** (30 dibujos por segundo), con esqueleto: nada de recortar
fotos y moverlas. Todo es reutilizable: una escena nueva = combinar personajes, decorados y gestos en un archivo de `escenas/`.

## Ver y grabar
- Vista previa: `python3 -m http.server 8765` (raíz del repo) y abrir `http://localhost:8765/fabrica/titeres/escena.html?e=mitin`.
- Grabar a 1080p: `node fabrica/titeres/grabar.mjs mitin out/mitin.mp4` (≈ 4 s por segundo de vídeo). Un trozo: añadir `desde hasta`.

## Piezas
| Archivo | Qué hay |
|---|---|
| `frente.js` | Vistas de frente y de espaldas: cara con ojos, cejas, nariz y boca; ropa por delante y por detrás; gestos. |
| `titeres.js` | El motor: esqueleto, caminar con los pies apoyados, gestos, boca, parpadeo, movimiento secundario, cámara, luz, partículas. |
| `personajes.js` | Fichas: `decano`, `acascar`, `sanchis`, `feijolo` y `ciudadano(n)` (gente variada y siempre igual para el mismo n). |
| `decorados.js` | `suelo`, `colinas`, `montes`, `ciudad`, `congreso`, `arbol`, `farola`, `atril`, `bandera`, `urna`, `mesa`, `molino`, `nubes`, `astro`, `telon`. |
| `escenas/*.js` | Escenas. `mitin.js` es el ejemplo completo (18 s, 5 planos con cortes). |

## Cómo se escribe una escena
- `actores`: `{ p: PERSONAJES.x o ciudadano(n, {escala, tono}), x, mira (1/-1), acciones: [...] }`.
- Acciones (`en`/`hasta` en segundos):
  - `camina` (con `a`: x de destino; se gira solo);
  - `gira`;
  - gestos: `puno`, `senala`, `saluda`, `celebra`, `aplaude`, `encoge`, `piensa`, `golpea`, `asiente`, `niega`, `inclina`, `salta`;
  - `brazos` (ángulos a mano: `h`, `c`, `h2`, `c2`);
  - `habla` (mueve la mandíbula);
  - `vista` (con `a`: `perfil` | `frente` | `espalda`; se da la vuelta como una carta);
  - `acerca` (con `a`: escala final; anda hacia la cámara o se aleja).
- También se puede empezar ya de frente o de espaldas: `{ ..., vista: 'frente', z: 1.5 }` (`z` = cerca o lejos de la cámara).
- **Varios planos con decorado y reparto propios** (contraplanos): `planos: [{ desde, decorado, actores, camara, ... }, ...]`.
  Ejemplo: `escenas/mitin2.js` (primer plano de frente, contraplano desde la espalda).
- `decorado` (detrás, con `par` = parallax y `tono` = lejanía), `delante` (por delante de los títeres), `luces`, `particulas`
  (`pajaros`, `papeles`, `confeti`, `hojas`, `polvo`).
- Por plano: `cartoon: true` (temporada 2, desde el ep. 6): modo dibujo animado.
  - Se encogen antes de cada gesto y se estiran al lanzarlo, con más rebote; al andar rebotan, y las cejas y la cabeza exageran.
  - Al correr dejan líneas de velocidad.
  - Acción nueva `sorprende`: el susto de dibujo animado, con los ojos como platos y un rebote.
  - Intro nueva: `escenas/intro2.js`, con los fondos `cieloNoche` y `mapaPartido`. Se alterna con `intro.js`.
- **Suavidad (30-10-2026, para todo)**: los gestos entran con un muelle (salen con velocidad 0, se pasan un poco y se asientan) y salen frenando.
  - Antes de cada gesto, el brazo y el cuerpo van un poco al lado contrario (anticipación). No la llevan `habla`, `asiente`, `niega`, `recibe`, `repta`, `agacha` ni `corta`.
  - La cámara pasa por sus claves sin pararse si sigue en el mismo sentido.
  - Desenfoque de movimiento: 5 muestras por fotograma dentro del obturador; el render tarda ≈ +30 %. Por plano: `desenfoque: 0` lo apaga, `muestras: 3` lo abarata.
  - Sin gemelos: el brazo de atrás va ≈ 0,06 s más tarde que el de delante.
  - Peso por personaje (de `grueso`, `barriga` y `alto`, o `masa` en la ficha): los grandes arrancan y paran más despacio y rebotan menos.
  - La cara no salta: la mirada de los gestos se mezcla, y la puñalada entra en 0,12 s.
  - Prueba: `escenas/prueba-suave.js` (antes/después en `out/suave-comparacion2.mp4`).
- **Giros con poses dibujadas** (30-10-2026): perfil → tres cuartos → frente → tres cuartos → perfil en 0,42 s, sin estrecharse como un papel; la cara va por delante del cuerpo.
  - En tres cuartos, el cuerpo se estrecha un poco, la cara se corre hacia donde mira, la nariz asoma por el borde y se tapa la oreja de ese lado. Lo usan `gira`, `camina` (al cambiar de sentido) y `vista` perfil ↔ frente.
  - Acción nueva `{ hace: 'miraCamara', en, hasta }`: de perfil, mira a cámara (a lo Cartoon Network). Prueba: `escenas/prueba-giros.js`.
- **Tinta viva** (30-10-2026, a lo «Cuento de los tres hermanos»):
  - `transicion: 'metamorfosis'` (2,4 s): todo el plano viejo se deshace en gotas de tinta; el viento las lleva por el pergamino y redibujan el plano nuevo, cada una en su sitio (lo de la izquierda va a lo de la izquierda: un personaje se convierte en otro). Con `materia: 'hojas'` en el plano nuevo, vuelan hechas hojas.
  - Por actor: `forma: { aparece, desaparece, dura: 1.4, materia: 'hojas' | 'tinta' }`: se forma con hojas o tinta que trae el viento, o se deshace y se lo lleva. Mientras, ese plano va sin desenfoque.
  - Para el plano secuencia: plano 1 en primer plano con la cámara siguiendo al que corre; plano 2 con `metamorfosis` y la cámara que empieza cerca y se aleja. Prueba: `escenas/prueba-tinta.js`.
- Por plano: `transicion: 'viento'` (una ráfaga dibujada barre la pantalla y cambia de plano) y `tinte: 'rojo' | 'noche' | 'sepia'`
  (rojo = momento tenso, cielo rojo con siluetas negras).
- `voces: [{ en, dura, quien, texto, archivo }]` (subtítulos con el nombre en dorado; el audio se mezcla al grabar si el archivo existe) y
  `carteles: [{ en, hasta, titulo, filas: [[texto, valor, color]], fuente }]` (datos reales con su fuente). Ejemplo: `escenas/sueldo.js`.
- Por plano: `viento` (0–1: pelo, barba, corbatas, faldones y túnicas ondean a rachas), `borde` (doble contraluz turquesa/cálido;
  `0` lo quita) y `bordes: [color1, color2]`.
- Protagonistas estilizados a lo Samurai Jack (fichas con `piernas`, `hombros`, `cintura`, `jirones`).
- `camara`: `[segundo, x, y, zoom]`. **Dos claves en el mismo segundo = corte de plano** (plano general → medio → primer plano → contraplano).

## Ideas de estilo (el usuario: «como un corto de Netflix»)
- Contar la historia del narrador con planos: general para situar, medio para la acción, primer plano para la reacción.
- Algo nuevo cada 1–2 s; nada quieto. Los secundarios reaccionan (asienten, aplauden, se encogen).
- Para un personaje nuevo, copiar una ficha de `personajes.js` y cambiar ropa, pelo, barba, nariz, altura o grosor.
