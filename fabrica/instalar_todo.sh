#!/bin/sh
# Prepara una sesión nueva para producir vídeos: Whisper (tiempos) y, si se pide, VoiceStudio + CosyVoice3 (voz gratis).
# Uso: sh fabrica/instalar_todo.sh            → solo Whisper (la voz va con ElevenLabs, voz D: EZDj5TBPpANsOzwaukxI)
#      sh fabrica/instalar_todo.sh --cosyvoice → además la voz gratis (≈ 15 GB, ~20 min). Lanzarlo en segundo plano.
set -e
if [ ! -x /home/user/qw/bin/python ]; then
  python3 -m venv /home/user/qw
  /home/user/qw/bin/pip install -q faster-whisper soundfile numpy
fi
echo "Whisper listo: /home/user/qw/bin/python"
[ "$1" = "--cosyvoice" ] || exit 0

VS=/home/user/VoiceStudio
[ -d $VS ] || git clone -q --depth 1 https://github.com/debpalash/VoiceStudio.git $VS
cd $VS
sed -i 's/^MIN_FREE_GB = 5$/MIN_FREE_GB = 0/' backend/services/sidecar_install.py   # el disco de la nube va justo
[ -d .venv ] || OMNIVOICE_TORCH_VARIANT=cpu node scripts/setup-api.mjs
nohup bun scripts/dev-backend.mjs > /tmp/voicestudio.log 2>&1 &
until curl -s localhost:3900/health | grep -q '"ok"'; do sleep 3; done
# GitHub bloquea aquí los .tar.gz: las piezas de CosyVoice se clonan con git en su revisión exacta
T=/root/.omnivoice/engines/cosyvoice/CosyVoice/third_party
if [ ! -d /root/.omnivoice/engines/cosyvoice/CosyVoice ]; then
  curl -s -X POST localhost:3900/engines/sidecar/cosyvoice/install > /dev/null; sleep 20
fi
mkdir -p $T
pieza() { [ -f "$T/$1/.voicestudio_source_revision" ] && return; git clone -q "$2" "$T/$1" && git -C "$T/$1" checkout -q "$3" && echo "$3" > "$T/$1/.voicestudio_source_revision"; }
pieza Matcha-TTS https://github.com/shivammehta25/Matcha-TTS.git dd9105b34bf2be2230f4aa1e4769fb586a3c824e
pieza PyWorld https://github.com/JeremyCCHsu/Python-Wrapper-for-World-Vocoder.git f31ad88d543fdaebbda2d0c9a5e4d4f991ae0b6c
mkdir -p $T/PyWorld/lib; pieza PyWorld/lib/World https://github.com/mmorise/World.git d625e7608ca23a870018f01e7c562ac683d9847f
curl -s -X POST localhost:3900/engines/sidecar/cosyvoice/install > /dev/null
until curl -s localhost:3900/engines/sidecar/cosyvoice/install/status | grep -q -E '"state":"(succeeded|failed)"'; do sleep 15; done
curl -s localhost:3900/engines/sidecar/cosyvoice/install/status | grep -o '"state":"[a-z]*"' | head -1
curl -s -X POST localhost:3900/engines/select -H 'Content-Type: application/json' -d '{"family":"tts","backend_id":"cosyvoice"}' > /dev/null
REF_TXT="El doble de alto pesa 8 veces más, como un caballo, pero tus huesos sólo son 4 veces más gruesos. Galileo lo vio en 1638. Cada hueso carga el doble."
curl -s -X POST localhost:3900/profiles -F name="Voz D" -F language=es -F ref_audio=@/home/user/Climate-things/audio/voz/es/altura/01.mp3 -F ref_text="$REF_TXT" | grep -o '"id":"[^"]*"'
echo "CosyVoice listo. Generar: curl -X POST localhost:3900/generate -F text=... -F profile_id=<id> -F engine=cosyvoice -F language=es -o frase.wav"
