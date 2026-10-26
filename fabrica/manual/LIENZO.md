# El lienzo: cómo se hace un episodio sin empezar de cero

Un vídeo es un cuadro por capas. Las primeras ya están pintadas y se reutilizan siempre. En cada episodio solo se rellena lo que falta y se anima.

## Capa 1 · Fondo (hecho, no se toca)
| Pieza | Dónde | Qué da |
|---|---|---|
| Composición base | `fabrica/videos/espanistan-02-intro/index.html` | Cámara sobre dibujos 1280×720, subtítulos `FRASES`, cortes con destello, `golpe()` (temblor), título final |
| Cueva con fuego | `espanistan-01-intro` (plano 1) | Fuego que late, chispas, sombras; sirve para abrir y cerrar cada episodio |
| Tarjetas | mismas carpetas | Dato con fuente, cita de filósofo, nombre, sello rojo, reglas con ✓, línea del tiempo por partidos |
| Marionetas | `historias/espanistan/marionetas/` + `herramientas/marioneta.py` | Personaje en piezas (cuerpo, cabeza, mano) que respira, cabecea, gesticula y parpadea |
| Narrador que habla | `herramientas/boca.py` + plano del Decano | Boca que sigue el volumen de la voz fotograma a fotograma |
| Música propia | `herramientas/musica.py <ambiente>` | neutro, misterio, esperanza, tensión (sin derechos) |
| Efectos | `fabrica/videos/espanistan-01-intro/assets/sfx/` + `audio/sfx/` | golpe, whoosh, trazo, riser, impacto, cadenas, fuego |

## Capa 2 · Lo que cambia en cada episodio (rellenar)
1. **Guion** (`historias/espanistan/NN-tema.md` + `fabrica/herramientas/guion_espanistan-NN.txt`): mismas reglas, el Decano como guía, un filósofo por bloque, una pregunta al final de cada bloque.
2. **Voz** (CosyVoice3, perfil «Voz D»): una frase por línea → `audio/voz/es/espanistan-NN/`.
3. **Tiempos** (Whisper) → `FRASES` y los momentos de cada efecto.
4. **Personajes nuevos**: un dibujo de cuerpo entero sobre fondo liso → `marioneta.py` con su JSON (polígonos de cabeza y mano). Reutilizar al Decano, a Sanchís y a Feijolo.
5. **Datos**: tarjetas, frascos con la etiqueta judicial exacta, mapa o línea del tiempo.

## Capa 3 · Animar (reglas fijas)
- Un cambio visual cada 4–8 s. Todo lo que se nombra se ve en pantalla.
- **Personajes**: giros suaves (cabeza ±2°, mano ±4°), parpadeo cada 3–4 s, zoom al protagonista cuando se le nombra.
- **Sonido**: casi nada de efectos cuando la cámara va a personas; un **golpe o impacto en cada conclusión o remate**; sellos con golpe.
- **Música por tema**: misterio en la cueva y los escándalos; esperanza en lo que salió bien; tensión en los frascos y los juicios; neutro en el resto. Siempre por debajo de la voz (~0,15). En lo muy serio (muertes, víctimas) la música se corta.
- Antes de renderizar: `npx hyperframes@0.8.204 check` y `snapshot --at …` para revisar las capturas.

## Coste y tiempo (medido el 26-10-2026, servidor en la nube sin tarjeta gráfica)
| Paso | Medida | Para 8–10 min de vídeo |
|---|---|---|
| Voz CosyVoice3 | ~2,5 min por frase de ~10 s | 45–55 frases ≈ **2–2,5 h** de máquina, gratis |
| Tiempos (Whisper) | ~20 s por frase | ≈ 15 min, gratis |
| Render HyperFrames | 41,5 s de vídeo en 181 s (≈ 4,4× la duración) | ≈ 35–45 min, gratis |
| Dibujos nuevos | ElevenLabs ≈ 430 créditos por imagen (≈ 0,09 $) | **0**: se reutilizan los dibujos y se recortan en piezas (decisión del 26-10-2026) |
| Música y efectos | propios | 0 |
| **Total en dinero** | | **0 €** (solo el tiempo de máquina y de Claude) |

Optimizar: generar la voz en segundo plano mientras se monta el vídeo; montar y revisar con capturas por bloques (no renderizar entero hasta el final); reutilizar los planos de la cueva, el laboratorio de frascos, la balanza y el consejo final, que se repiten en todos los episodios.
