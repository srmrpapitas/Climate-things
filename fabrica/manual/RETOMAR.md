# Retomar Españistán (leer al abrir una sesión nueva)

**28-10-2026 (noche): EP. 4 EN MARCHA → leer primero `fabrica/titeres/CAPITULO-04-PLANOS.md` (plan, estado y siguiente paso).**
- Guion aprobado: `historias/espanistan/04-bipartidismo.md` («Las dos familias»), narrador `fabrica/herramientas/guion_espanistan-04-8min.tsv`, personajes `guion_espanistan-04-personajes.txt`.
- Animadas 4 de 11 secuencias con tiempos ESTIMADOS (aún sin voz). Rama `claude/espanistan-ep04`, sin commit.

**28-10-2026: difusión del ep. 3 en curso** (shorts en YouTube hechos; falta X) → `fabrica/manual/DIFUSION-EP03.md`.

**Estado a 27-10-2026: ep. 3 terminado** (Acascar y Vox, 10 min, HD en `videos/espanistan-03/`). Rama con todo: `claude/new-session-k0kf29`.
**Siguiente: ep. 4, el bipartidismo** → seguir `CAPITULO-SIGUIENTE.md` (procedimiento al día). Lo de abajo es el historial del ep. 2.

---

Estado a 26-10-2026. Rama de trabajo: la que indique la sesión. Si no tiene esto, traer `claude/quirky-thompson-xa9rrz`.
El contenedor es nuevo en cada sesión: **lo que no está en git hay que reinstalarlo** (VoiceStudio, Whisper, PhotoCraft).

## 1. Qué está hecho
- **Ep. 1 · intro aprobada**: `fabrica/videos/espanistan-01-intro/` (HyperFrames, voz D original, 30 s). Es el **esqueleto**: copiar la carpeta para cada vídeo nuevo.
- **Ep. 2 · guion**: `historias/espanistan/02-feijolo.md` (con fuentes y lista «Comprobar antes de publicar») y `fabrica/herramientas/guion_espanistan-02.txt` (44 frases, una por línea, números en letra).
- **Dibujo base de Feijolo**: `historias/espanistan/img/feijolo.webp` (ElevenLabs, flujo «Españistán ep. 2 · Feijolo»).
- **Skills** en `.claude/skills/`: hyperframes, hyperframes-cli, hyperframes-registry, media-use, voicestudio, find-skills, photocraft, storytold, storytold-install.

## 2. Decisiones del usuario (no volver a preguntar)
- Ep. 2 = **el PP entero** (no solo Feijolo): qué es, historia, escándalos, promesas incumplidas, datos reales, que la gente saque sus conclusiones. Nombre del líder: **Feijolo**.
- Guía protagonista: **el Decano** (el profesor de la lupa), estilo Platón: pregunta en vez de dar respuestas; un filósofo por bloque.
- **Mapa de corrupción por comunidades** (fuente IREA-UB 2022; si se puede, añadir el repositorio del CGPJ).
- Animación: **más marioneta y más fotogramas**: personajes por capas (cabeza, mandíbula, brazos, ojos), saludo, cabeceo, boca con la voz, parpadeo, **zoom al protagonista**. **Menos efectos de sonido** cuando la cámara va a las personas.
- Voz: **CosyVoice3** en VoiceStudio (gratis, Apache-2.0, uso comercial), clonando la voz D. Primero una frase de prueba para que el usuario la compare con la original.
- Alcance ahora: **guion + intro (~35 s)**. Si gusta, el episodio entero.
- Siguientes capítulos: ep. 3 **Abascal**, ep. 4 **el bipartidismo**.
- **No gastar créditos de ElevenLabs** (26-10-2026). Todo gratis y local: dibujos ya existentes recortados en piezas con Python y animados con HyperFrames; voz con CosyVoice3. Nada de PhotoCraft (no hace falta).
- Hablar en español, corto y sin tecnicismos. Buscar skills con `npx skills find <tema>` cuando falte algo.

## 3. Pendiente (en este orden)
1. **(Hecho si existe `feijolo.webp` nuevo)** Feijolo se parecía a Rajoy. Hacer **una** edición con ElevenLabs (≈430 créditos) sobre `feijolo.webp`: más calvo arriba con entradas grandes, pelo y barba **blancos** y cortos, cara más **alargada y delgada**, gafas finas al aire. Misma postura. Modelo `gpt-image-2.5-sunburst` con la imagen como referencia (raw de GitHub: `https://raw.githubusercontent.com/srmrpapitas/Climate-things/<rama>/historias/espanistan/img/feijolo.webp`).
2. **(Hecho)** Feijolo recortado: `historias/espanistan/marionetas/feijolo/` (cuerpo, cabeza, mano + `marioneta.json`; herramienta `fabrica/manual/herramientas/marioneta.py`). Giros suaves: cabeza ±3°, mano ±8°. Decano: `marionetas/decano.json` (ojos/boca sobre la portada). Antes ponía: Recortar a Feijolo en capas con PhotoCraft (§5) o, si no está, con Python (quitar el fondo beige liso por color, y separar cabeza, mandíbula y brazos con polígonos). Hacer lo mismo con el Decano, recortándolo de `portada.webp`.
3. **Voz**: (26-10: frase 1 generada y enviada al usuario, `fabrica/videos/pruebas-voz/`; ~2,5 min por frase en CPU; perfil «Voz D» = ref altura/01.mp3). Instalar VoiceStudio + CosyVoice3 (§4), clonar la voz D y generar la frase 1 → mandarla al usuario junto a `audio/voz/es/espanistan-01/01.mp3`.
4. Si la voz gusta: frases 1-4 (la intro) → `audio/voz/es/espanistan-02/NN.mp3` → tiempos con `fabrica/manual/herramientas/tiempos.py`.
5. **Intro del ep. 2** en `fabrica/videos/espanistan-02-intro/`, copiando `espanistan-01-intro/`. Planos: cueva con la sombra de Feijolo → el Decano entra y se ajusta las gafas (Santayana) → Feijolo-marioneta saluda sobre el mapa (zoom) → «Mismas reglas». Música `musica.py`; efectos suaves en los personajes. `npx hyperframes@0.8.204 check`, capturas con `snapshot` y render.

## 4. VoiceStudio + CosyVoice3 (cómo se instaló; hay trampas)
```sh
git clone --depth 1 https://github.com/debpalash/VoiceStudio.git /home/user/VoiceStudio
cd /home/user/VoiceStudio && OMNIVOICE_TORCH_VARIANT=cpu node scripts/setup-api.mjs        # ~2,3 GB, unos minutos
bun scripts/dev-backend.mjs   # en segundo plano → http://localhost:3900 (esperar a que /health diga "ok")
curl -X POST localhost:3900/models/install -H 'Content-Type: application/json' -d '{"repo_id":"FunAudioLLM/Fun-CosyVoice3-0.5B-2512"}'
```
Trampas:
- **Disco**: el motor pide 14 GB + 5 de margen. Bajar el margen en la copia local: en `backend/services/sidecar_install.py`, `MIN_FREE_GB = 0`, y reiniciar el servidor.
- **GitHub bloquea los `.tar.gz`** (403) y el instalador falla con Matcha-TTS. Antes de instalar, clonar las piezas con git en sus revisiones (y escribir la marca):
  ```sh
  T=/root/.omnivoice/engines/cosyvoice/CosyVoice/third_party   # existe tras el primer intento de instalación
  git clone -q https://github.com/shivammehta25/Matcha-TTS.git $T/Matcha-TTS && git -C $T/Matcha-TTS checkout -q dd9105b34bf2be2230f4aa1e4769fb586a3c824e && echo dd9105b34bf2be2230f4aa1e4769fb586a3c824e > $T/Matcha-TTS/.voicestudio_source_revision
  git clone -q https://github.com/JeremyCCHsu/Python-Wrapper-for-World-Vocoder.git $T/PyWorld && git -C $T/PyWorld checkout -q f31ad88d543fdaebbda2d0c9a5e4d4f991ae0b6c && echo f31ad88d543fdaebbda2d0c9a5e4d4f991ae0b6c > $T/PyWorld/.voicestudio_source_revision
  mkdir -p $T/PyWorld/lib && git clone -q https://github.com/mmorise/World.git $T/PyWorld/lib/World && git -C $T/PyWorld/lib/World checkout -q d625e7608ca23a870018f01e7c562ac683d9847f && echo d625e7608ca23a870018f01e7c562ac683d9847f > $T/PyWorld/lib/World/.voicestudio_source_revision
  ```
- Instalar el motor: `curl -X POST localhost:3900/engines/sidecar/cosyvoice/install` y seguirlo con `.../install/status`. Al acabar, se puede borrar la copia duplicada de los pesos en `~/.cache/huggingface/hub/models--FunAudioLLM--Fun-CosyVoice3-0.5B-2512` (9 GB) si el motor usa los suyos.
- Clonar la voz: `POST /profiles` (multipart: `name`, `ref_audio=@audio/voz/es/altura/01.mp3`, `ref_text`, `language=es`). El `ref_text` está en `fabrica/manual/herramientas/voz_qwen.py` (REF_TEXTO). Generar: `POST /generate` con `text`, `profile_id`, `engine=cosyvoice`, `language=es`. Ver la skill `voicestudio` y `GET /openapi.json`.
- **OmniVoice** (el motor por defecto) es **no comercial**: no usarlo para el canal.

## 5. PhotoCraft (storytold)
- El control de seguridad bloqueó su instalador (programa externo con pocos usuarios), y Claude no puede darse permisos a sí mismo.
  El usuario debe crear él mismo `.claude/settings.json` en GitHub (rama de trabajo → carpeta `.claude` → Add file → Create new file → Commit) con:
  ```json
  { "permissions": { "allow": ["Bash(python3 .claude/skills/storytold-install/scripts/storytold_tools.py:*)"] } }
  ```
  y abrir una sesión nueva después. Si el archivo no existe, recortar con Python.
- Instalar y comprobar: `python3 .claude/skills/storytold-install/scripts/storytold_tools.py install photocraft` y luego `... verify photocraft`. Usar `photocraft-cli` por su ruta absoluta (la da `status`); leer la skill `photocraft` antes.
- Si sigue bloqueado: hacer el recorte con Python, sin perder tiempo.

## 6. Whisper (tiempos)
`python3 -m venv /home/user/qw && /home/user/qw/bin/pip install -q faster-whisper soundfile`, y después `/home/user/qw/bin/python -I fabrica/manual/herramientas/tiempos.py VOZ.mp3 > tiempos.json`.
