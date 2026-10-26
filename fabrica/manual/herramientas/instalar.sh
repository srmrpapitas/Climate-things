#!/bin/sh
# Instala lo necesario para voz gratis (Qwen3-TTS) y tiempos (Whisper) en /home/user/qw, fuera del repo.
# Requiere red a pypi.org, huggingface.co y *.hf.co (ajustes del entorno → Network access).
# Sin GPU: todo en CPU. Primera ejecución descarga ~4 GB de modelos.
set -e
python3 -m venv /home/user/qw
/home/user/qw/bin/pip install -q -U qwen-tts faster-whisper
echo "Listo. Usa: /home/user/qw/bin/python -I fabrica/manual/herramientas/voz_qwen.py ..."
