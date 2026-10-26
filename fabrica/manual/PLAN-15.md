# Plan: 15 vídeos sin gastar el límite semanal

Punto de partida (26-10-2026): ~10 % del límite semanal gastado, casi todo en montar la fábrica (instalar herramientas, probar, investigar). Eso ya no se repite.

## 1. Dónde se van los tokens (y cómo se corta)
| Gasto | Por qué cuesta | Cómo se corta |
|---|---|---|
| Escribir el HTML del vídeo a mano | Archivos largos que se escriben y se releen | **Generador**: el vídeo se describe en un `escenas.json` corto y un script crea el `index.html` |
| Instalar voz/Whisper en cada sesión | El contenedor se borra; instalar y depurar a mano cuesta mucho | **`instalar_todo.sh`**: un comando con todos los atajos ya resueltos, en segundo plano |
| Investigar datos | Muchas búsquedas web | Lista cerrada de datos por episodio; **máximo 12 búsquedas**; lo dudoso va a «Comprobar antes de publicar» |
| Mirar imágenes | Cada captura gasta como mucho texto | **Una sola hoja de capturas** por vídeo (`snapshot --at …`), no capturas sueltas |
| Esperas y comprobaciones | Preguntar «¿ya acabó?» repetidas veces | Todo lo largo en segundo plano, sin preguntar hasta que avisa |
| Conversación | Muchos mensajes cortos de ida y vuelta | Un mensaje con todas las decisiones al empezar cada vídeo |
| Modelo | Opus para todo | **Opus solo para la estructura**; **Sonnet** para producir los vídeos |

## 2. Lo que falta de estructura (una vez, con Opus, ~5 %)
1. **`fabrica/instalar_todo.sh`**: VoiceStudio + CosyVoice3 (con los arreglos de disco y de GitHub) + Whisper + perfil «Voz D». Un comando, en segundo plano.
2. **`fabrica/generar.py`**: lee `fabrica/videos/<slug>/escenas.json` y escribe el `index.html` con los planos ya hechos:
   `cueva`, `decano` (habla), `marioneta` (personaje), `dato`, `cita`, `linea` (quién gobernó), `mapa`, `frascos` (etiqueta judicial), `balanza`, `reglas`, `titulo`. Cada plano lleva su música y su efecto por defecto (golpe en conclusiones).
3. **`fabrica/voz.sh <slug>`**: guion → voces → tiempos → `escenas.json` con los tiempos puestos.
4. **El ep. 2 entero** hecho con ese sistema, como prueba y como molde.

## 3. Cada vídeo después (con Sonnet, objetivo ≤ 4 % por vídeo)
| Paso | Quién | Coste |
|---|---|---|
| 1. Decisiones en un mensaje (tema, personajes, tono) | Usuario | 0 |
| 2. Investigación: ≤ 12 búsquedas, datos con fuente | Sonnet | bajo |
| 3. Guion (~1.200 palabras) + `escenas.json` | Sonnet | medio |
| 4. `instalar_todo.sh` + `voz.sh` en segundo plano (~2,5 h de máquina) | Script | casi 0 |
| 5. `generar.py` + `check` + una hoja de capturas | Script + Sonnet | bajo |
| 6. Render (~6× la duración) y envío | Script | casi 0 |
| 7. Cambios del usuario por número de escena (editar `escenas.json`, no el HTML) | Sonnet | bajo |

**Truco grande**: hacer **2–3 vídeos por sesión**. La instalación (voz, Whisper) se hace una vez y sirve para todos.

## 4. Presupuesto
| Bloque | Límite semanal |
|---|---|
| Ya gastado (fábrica) | ~10 % |
| Estructura que falta (§2) | ~5 % |
| 15 vídeos × ≤ 4 % | ≤ 60 % |
| Margen para cambios y sorpresas | ~25 % |

Si un vídeo pasa del 5 %, se para y se mira qué paso se ha disparado (casi siempre: investigar de más, o editar el HTML en vez de `escenas.json`).

## 5. Los 15 vídeos (orden propuesto, a confirmar por el usuario)
1. Españistán 2 · Feijolo y el PP (en curso)
2. Españistán 3 · Abascal
3. Españistán 4 · El bipartidismo
4–15. Por decidir (más partidos o temas de la serie, o vídeos de «Si se duplica»).
