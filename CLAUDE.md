# Para Claude: trabajas en el Mac del usuario (en local, no en la nube)

Lee esto entero antes de empezar. El usuario (Nicholas) no es programador: háblale en **español**, con pasos cortos y
claros, y no le pidas que ejecute nada que puedas hacer tú.

## El equipo

- **MacBook Pro Intel (`x86_64`), macOS 26.** **No hay Homebrew** (ya no se instala en los Mac Intel): no lo intentes.
- Herramientas instaladas:
  - git (de Apple).
  - **Node 24** (instalador de nodejs.org).
  - **Python 3.13** (instalador de python.org; `python3`).
  - **ffmpeg y ffprobe** en `~/bin` (builds de evermeet.cx; `~/bin` ya está en el PATH desde `~/.zprofile`).
  - **cmake 4.5** en `/Applications/CMake.app/Contents/bin` (también en el PATH).
  - Herramientas de compilación de Apple (`/Library/Developer/CommandLineTools`).
- El proyecto está en **`~/Documents/Climate-things`**.
- Si falta algo, instálalo sin Homebrew: `pip` dentro de un entorno virtual, `npm`, o el instalador oficial del programa.
  Si hace falta contraseña o pulsar algo en una ventana, explícale al usuario exactamente qué hacer.

## Permisos (lo ha dicho el usuario)

Puedes trabajar sin preguntar: editar, ejecutar comandos, renderizar, hacer commit y push a la rama del proyecto.
**Pregunta antes de**:
- **gastar créditos de ElevenLabs** (di cuántos);
- **elegir una voz** (enséñale 2–3 opciones);
- borrar algo que no hayas creado tú.

## Diferencias con la nube (las guías del repo se escribieron allí)

- Las rutas `/home/user/...` de las guías y scripts son de la nube. Aquí:
  - `/home/user/Climate-things` → `~/Documents/Climate-things`
  - `/home/user/qw` → `~/qw`
  - `/home/user/sdcpp` → `~/sdcpp`
  - `/home/user/modelos` → `~/modelos`
- Adapta los scripts (por ejemplo `fabrica/instalar_todo.sh`) a estas rutas en vez de crear `/home/user`.
- **Entorno de Python** (Whisper y OpenCV), si no existe:
  `python3 -m venv ~/qw && ~/qw/bin/pip install faster-whisper soundfile numpy opencv-python-headless`.
- **Navegador de los renders**: desde la raíz del repo, `npm install playwright` (no se sube: va en `node_modules/`) y
  `npx playwright install chromium`.
- **Renders con la tarjeta gráfica**: `tsunami/grabar.mjs` lanza Chromium con SwiftShader (en la nube no había tarjeta
  gráfica). Aquí quita esos argumentos y usa la gráfica del Mac. Comprueba con `WEBGL_debug_renderer_info` que el renderer
  no sea SwiftShader. Si el modo headless no usa la gráfica, prueba `headless: false`. Mide los segundos por fotograma.
- **FLUX** (escenarios gratis de Españistán): en un Intel va por CPU y lento.
  - Compila `stable-diffusion.cpp` con cmake (como en `fabrica/instalar_todo.sh --flux`, con las rutas de aquí) y mide
    cuánto tarda una imagen.
  - Si tarda demasiado, propónle al usuario ElevenLabs (Seedream 5 lite, ≈ 212 créditos por imagen).
- **ElevenLabs**: usa el conector (cuenta nueva del usuario).
  - La voz del narrador «D» (`EZDj5TBPpANsOzwaukxI`) era de la cuenta antigua. Si no está, diseña una parecida con
    `creative_design_voice` y deja que el usuario elija.
  - Guarda en el repo el id de la voz nueva y dónde se usa.

## Los proyectos

1. **El tsunami que se duplica** (Instagram, 9:16, ~65 s). Rama **`claude/serene-clarke-eeypc0`**.
   - **Todo el plan está en `tsunami/PLAN.md`**: guion, planos, pasos, lo aprendido.
   - El estilo aprobado es **3D ilustrado** (`tsunami/referencia/`).
   - La base es `tsunami/muestra.js`. Vista previa: `python3 -m http.server 8765` y abrir
     `http://localhost:8765/tsunami/index.html?estilo=ilustrado`.
2. **Españistán** (serie de YouTube, 16:9). Rama **`claude/quirky-thompson-xa9rrz`**.
   - Guías: `fabrica/manual/CAPITULO-SIGUIENTE.md` y `fabrica/manual/COMO-HACER-UN-VIDEO.md`.
   - El siguiente es el **ep. 3 (Abascal / Vox)**. El modelo a copiar es el ep. 2 (`fabrica/videos/espanistan-02-sombras/`).
   - Normas de la serie: datos reales con fuentes; nadie es culpable sin sentencia; nunca decir a quién votar; lo bueno
     también se cuenta.
   - Esta rama no tiene este `CLAUDE.md`. Tráelo con `git checkout claude/serene-clarke-eeypc0 -- CLAUDE.md` o léelo
     desde la otra rama.

## Al terminar cada trabajo

- **Commit y push a la rama del proyecto.**
- El MP4 va en `out/` (no se sube); dile al usuario dónde está y ábreselo con `open out/<archivo>.mp4`.
