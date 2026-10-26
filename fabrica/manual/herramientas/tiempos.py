# Tiempos de cada frase de una narración (para subtítulos y para sincronizar efectos).
# Uso: python -I tiempos.py VOZ.mp3 > tiempos.json
# Salida: [{"texto", "inicio", "fin"}, ...] por frase, más "palabras" con el tiempo de cada palabra.
import json, subprocess, sys, numpy as np
from faster_whisper import WhisperModel

# se decodifica con ffmpeg porque el lector de audio de faster-whisper falla con la versión de PyAV instalada
pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', sys.argv[1], '-f', 'f32le', '-ac', '1', '-ar', '16000', '-'],
                     capture_output=True, check=True).stdout
audio = np.frombuffer(pcm, np.float32)
m = WhisperModel('medium', device='cpu', compute_type='int8')
seg, _ = m.transcribe(audio, language='es', word_timestamps=True)
res = [{'texto': s.text.strip(), 'inicio': round(s.start, 3), 'fin': round(s.end, 3),
        'palabras': [[w.word.strip(), round(w.start, 3), round(w.end, 3)] for w in s.words]} for s in seg]
print(json.dumps(res, ensure_ascii=False, indent=1))
