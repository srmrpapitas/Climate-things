# Tiempos de cada palabra de uno o varios audios (faster-whisper, español). Necesita el entorno ~/qw:
#   ~/qw/bin/python fabrica/herramientas/palabras.py a.wav b.wav  → JSON {archivo: [[palabra, inicio, fin], …]}
import sys, json, subprocess, numpy as np
from faster_whisper import WhisperModel
m = WhisperModel('small', compute_type='int8')
salida = {}
for f in sys.argv[1:]:
    a = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-f', 's16le', '-ac', '1', '-ar', '16000', '-'], capture_output=True).stdout
    segs, _ = m.transcribe(np.frombuffer(a, np.int16).astype(np.float32) / 32768, language='es', word_timestamps=True)
    salida[f] = [[w.word.strip(), round(w.start, 2), round(w.end, 2)] for s in segs for w in s.words]
print(json.dumps(salida, ensure_ascii=False))
