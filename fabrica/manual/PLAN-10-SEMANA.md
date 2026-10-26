# Coste real y plan para 10 vídeos a la semana (26-10-2026)

## Lo gastado hasta ahora en ElevenLabs (créditos)
| Concepto | Créditos |
|---|---|
| Ep. 2 · narrador (voz D, ~8 min) | ≈ 7.000 |
| Ep. 2 · primeros dibujos de Feijolo (montaje antiguo) | ≈ 1.300 |
| Pruebas de retrato (rejilla + Tarantino) | ≈ 424 |
| Voz de Feijolo · prueba (2 tomas) | 446 |
| Retratos de perfil a lápiz (1 rejilla) | 212 |
| Muestra del teatro de sombras | 212 |
| 7 escenarios del ep. 2 | 1.485 |
| Frases de Feijolo (2 tomas) | 666 |
| **Total** | **≈ 11.745** |

Lo que se ha gastado en esta sesión para el estilo nuevo es ≈ 3.000; el resto ya estaba hecho. Animación, música, efectos, recortes y render: 0 €.

## Coste de un capítulo nuevo con la fábrica ya hecha
| Parte | Créditos | Cómo abaratar |
|---|---|---|
| Narrador 8–9 min (`multilingual_v2`) | ≈ 7.000 | `eleven_flash_v2_5` cuesta la mitad (≈ 3.500); vídeos de 6 min ≈ 5.000 |
| Voz del protagonista (4–6 frases, 1 llamada, 2 tomas) | ≈ 700 | 1 sola toma: ≈ 350 |
| Escenarios de teatro de sombras (5–7) | ≈ 1.100–1.500 | reutilizar escenarios comunes (tribunal, mapa, río, Decano) entre capítulos cambiando cámara y acciones: 3–4 nuevos ≈ 750 |
| Retratos del protagonista (1 rejilla) | 212 | solo cuando el protagonista es nuevo |
| **Total** | **≈ 9.400** | **≈ 5.000 con todo lo de la derecha** |

## 10 vídeos a la semana (≈ 43 al mes)
- **Créditos de ElevenLabs**: ≈ 400.000 al mes con la voz normal, o ≈ 215.000 al mes en modo ahorro. Eso es un plan de **500.000 créditos al mes** (Pro) o similar; comprobar el plan y el precio actuales en la cuenta.
- **Render**: ≈ 41 min por vídeo de 9 min en este contenedor, ≈ 7 h a la semana. Se lanza en segundo plano mientras se prepara el siguiente.
- **Tokens de Claude**: esta sesión ha sido cara porque se construyó la fábrica (estilo, herramientas, plantilla). Un capítulo ya solo es:
  1. Investigar y escribir el guion.
  2. Escribir `hacer_escenas.py`.
  3. Revisar una hoja de capturas.

  Con **Sonnet**, una conversación por capítulo y este archivo pegado al inicio (`CAPITULO-SIGUIENTE.md`), se reparte la cuota en ≈ 10 sesiones a la semana.
- **Ritmo recomendado**:
  - Lunes: 3–4 guiones con sus fuentes.
  - Martes a viernes: 2 capítulos al día (voces → escenarios → piezas → montaje → render en segundo plano).
  - Revisar cada vídeo con 1 hoja de 10 capturas, no con varias.
- **Biblioteca que abarata**: cada escenario de sombras y cada retrato se guarda en `historias/espanistan/sombras/` y `retratos/`.
  - Al llegar al capítulo 6–7 la mitad de los escenarios se pueden reutilizar con otra cámara y otras acciones. El estilo lo permite: son marionetas en un teatro.
