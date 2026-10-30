# Españistán ep. 3 · el capítulo entero animado (≈ 8 min, 30 fps)

Todo en títeres a lo Samurai Jack: color plano, siluetas, cámara quieta, cortes secos dentro de un lugar y viento entre lugares,
franjas de cine en los planos grandes y pantalla partida en los momentos clave. Nada de fotos que se mueven.

- Guion de 8 minutos: `fabrica/herramientas/guion_espanistan-03-8min.tsv` (79 trozos, ≈ 5.600 créditos; el largo de 10,5 min sigue en `guion_espanistan-03-frases.tsv`).
- Narrador: **Gabo** `o0SveC0zgHFuCsEO3vHR` (elegido el 28-10-2026; audio en `audio/voz/es/espanistan-03-gabo/`), modelo `eleven_v4`, la voz tal cual, sin clones ni ajustes.
- Acascar: Leónidas, ya grabado (`audio/voz/es/espanistan-03-acascar/f1…f5`).
- Cada secuencia es una escena de `escenas/` con sus `voces` (los bloques del narrador y las frases de Acascar) y sus `sonidos`.
  Los tiempos salen de la duración real de cada bloque en cuanto exista el audio.

| Sec. | Bloques | ≈ s | Escena | Qué se ve |
|---|---|---|---|---|
| A · Apertura | 1–4 | 30 | `apertura` (nueva) | El Decano y su candil en la oscuridad; pantalla partida Sanchís / Feijolo que se turnan; una tercera silueta rompe el turno. Montaigne en pergamino. Acascar de frente, cartel de 0 a ≈ 20 %. |
| B · El fuego | 5–8 | 32 | `fuego` (hecha, se alarga) | Amurrio de noche, la tienda en llamas, el niño en la ventana; el padre y el hijo miran bajo el coche. Pregunta del Decano. |
| C · La Condesa | 9–12 + f1 | 38 | `condesa` + `nace-vox` (hechas) | La mano de la Condesa, la nómina gigante (82.491 € frente a 78.185 €). El letrero de la fundación se apaga y se enciende VOX. «A mí nadie me ha regalado nada…» |
| D · Nace Vox | 13–16 | 50 | `nace-vox` (se alarga) | Militantes del PP dando la espalda; la mesa fundadora con sus notas; lluvia de papeles de 2014 y el saco; las sillas se vacían. |
| E · Desierto y subida | 17–21 + f2 | 50 | `desierto` + `subida` (hechas) | Repta por el desierto rojo, trepa la roca; el público se gira a escalones (12, 24, 52, 33, ≈ 68). «Los jóvenes me adoran…» |
| F · Chiringuitos | 22–25 + f3 | 32 | `chiringuitos` (nueva) | Pregunta del Decano; Acascar cierra casetas a martillazos; el saco de Disenso engorda detrás. |
| G · La mano y la daga | 26–27 | 22 | `mano-daga` (hecha) | Pacto con el PP, la puñalada de 2024, la tirita de 2026. |
| H · Los frascos | 29–40 + f4 | 95 | `frascos` (nueva) | Juvenal: dos guardias que se vigilan. El laboratorio del Decano: siete frascos, cada uno con su escena dentro y su etiqueta sellada (SIN CAUSA, ARCHIVADO, ANULADO, PREGUNTAS ABIERTAS, CONDENADO). «Los bancos españoles no me querían…». Lección del Decano. |
| I · Muralla y balanza | 41–47 + f5 | 55 | `balanza` (hecha, se alarga) | La muralla que crece; «Yo prometo mano dura…»; la balanza con los dos platos; «lo decides tú». Hume. |
| J · Cierre | 49–50 | 12 | `cierre` (nueva) | El Decano apaga el candil; adelanto del ep. 4 (Sanchís y Feijolo encima de una lista cerrada). |
| K · Outro | 51 | 24 | `outro` (hecha) | El Elegido salta al «me gusta», pisa SUSCRÍBETE y se cuelga de la campana. |

## Orden de trabajo
1. El usuario elige la voz del narrador → generar el guion de 8 min (pedir permiso: ≈ 5.600 créditos).
2. Ajustar cada escena a la duración real de sus bloques; escribir las nuevas (A, F, H, J).
3. Grabar cada secuencia a 30 fps (`grabar.mjs`, en paralelo) y revisarla con `fotos.mjs` antes de grabar.
4. Unir las 11 secuencias con música de fondo y dejar el capítulo en `~/Desktop/Espanistan-03/`.
