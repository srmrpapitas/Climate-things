# Biblioteca de títeres (teatro de sombras animado)

Personajes dibujados **en cada fotograma** (12 dibujos por segundo, como la animación clásica), con esqueleto: nada de recortar
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
- `camara`: `[segundo, x, y, zoom]`. **Dos claves en el mismo segundo = corte de plano** (plano general → medio → primer plano → contraplano).

## Ideas de estilo (el usuario: «como un corto de Netflix»)
- Contar la historia del narrador con planos: general para situar, medio para la acción, primer plano para la reacción.
- Algo nuevo cada 1–2 s; nada quieto. Los secundarios reaccionan (asienten, aplauden, se encogen).
- Para un personaje nuevo, copiar una ficha de `personajes.js` y cambiar ropa, pelo, barba, nariz, altura o grosor.
