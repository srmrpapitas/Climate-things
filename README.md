# Fábrica de vídeos

> **¿Eres una IA que retoma el trabajo?** Lee `CLAUDE.md`, luego `fabrica/manual/RETOMAR.md` y `fabrica/manual/GUIA.md`.

Vídeos animados por código, fotograma a fotograma, con voces de ElevenLabs:
- **Españistán** (YouTube): sátira política con datos reales, títeres a lo Samurai Jack.
- **Anime y reels virales** (Instagram @siseduplica).

## Mapa del repo
| Carpeta | Qué hay |
|---|---|
| `fabrica/manual/` | `GUIA.md` (cómo se hace todo), `RETOMAR.md` (estado), calendario de shorts, borradores de X, `difusion/` (textos de YouTube por capítulo) |
| `fabrica/titeres/` | Motor de títeres (`titeres.js`, `personajes.js`, `decorados*.js`, `escena.html`), escenas de los ep. 4–7, grabar, montar, shorts y miniaturas |
| `fabrica/explicado/` | Motor de vídeos verticales y anime (`video.html`, `motor.js`), voz, efectos, escenas (`golpe`, `paralepipedo`, `chorizo-portuano`) |
| `fabrica/herramientas/` | Voz del narrador, música, Whisper, recorte de fotos, hojas de contacto y guiones de los ep. 4–7 |
| `historias/espanistan/` | Datos y fuentes de cada capítulo |
| `audio/` | Voces (`voz/es/`) y efectos (`sfx/`, los de ElevenLabs en `sfx/eleven/`) |
| `referencias/` | Dibujos clave y secuencias del anime (paralepípedo) |
| `out/` | Renders (no está en git). Se queda lo final: `subir/`, `shorts/`, miniaturas y `fotos-reales/` |

Servidor para ver y grabar: `python3 -m http.server 8765` en la raíz.
