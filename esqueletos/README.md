# Esqueletos de video

Un video = un archivo `videos/<slug>.yaml`. Claude solo escribe y edita ese archivo;
las plantillas de escena (código) no se tocan al producir un video.

## Tipos de escena (cada uno = una plantilla de código)

| tipo | uso | campos |
|---|---|---|
| `gancho` | primeros segundos | `texto`, `broll`, `voz` |
| `promesa` | qué va a ganar quien mira | `texto`, `voz` |
| `punto` | una idea del desarrollo | `titulo`, `texto`, `broll`, `voz` |
| `dato` | número o estadística grande | `numero`, `etiqueta`, `voz` |
| `comparacion` | antes/después, A vs B | `izq`, `der`, `voz` |
| `lista` | 2–4 elementos que aparecen de a uno | `items`, `voz` |
| `regancho` | reabrir atención (R3) | `texto`, `voz` |
| `cta` | cierre | `texto`, `destino` |

Campos comunes opcionales: `dur` (s, si no se calcula por la voz), `sfx`, `zoom`, `nota`.

## Formato

```yaml
slug: ejemplo-short
plataforma: shorts        # youtube | shorts | reels | tiktok  → aplica R7
estilo: base              # paleta/tipografía en estilos/<estilo>
voz: tts                  # tts | grabada (archivo en assets/voz/<slug>.mp3)
escenas:
  - tipo: gancho
    texto: "Perdí 60$ en 2 videos"
    broll: dinero-quemandose
    voz: "Gasté sesenta dólares en hacer solo dos videos."
  - tipo: regancho
    texto: "Ahora hago 20 por semana"
    voz: "Hoy hago veinte por semana. Te enseño cómo."
  - tipo: lista
    items: ["Plantillas fijas", "Reglas de retención", "Render local"]
    voz: "Son solo tres cosas."
  - tipo: cta
    texto: "Parte 2 en mi perfil"
    destino: perfil
```

## Cómo se edita barato
- "Escena 3 más corta" → se cambia una línea del YAML, no el código.
- Un estilo nuevo → se añade `estilos/<nombre>`, sin tocar los videos.
- Un tipo de escena nuevo → se crea una vez con Opus y queda disponible para siempre.
