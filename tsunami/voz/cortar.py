# Corta el narrador (una sola toma de ElevenLabs con todas las frases) en una pista por frase, normalizada,
# y escribe sus duraciones en duraciones.json (el guion de tsunami/guion.js sale de ellas).
# Los cortes salen de Whisper (tiempos por palabra) y de `ffmpeg -af silencedetect`: ver tsunami/COMO-SE-HIZO.md.
# Uso (desde la raíz del repo): python3 tsunami/voz/cortar.py
import json, subprocess, os
DIR = os.path.dirname(os.path.abspath(__file__))
CORTES = [(0, 3.66), (4.36, 8.51), (8.76, 13.25), (13.58, 19.38), (19.64, 24.43), (24.6, 29.2),
          (29.46, 32.41), (32.62, 37.16), (37.4, 42.27), (42.5, 46.64), (46.98, 53.2)]
dur = {}
for i, (a, b) in enumerate(CORTES, 1):
    sal = os.path.join(DIR, f'n{i:02d}.mp3')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(DIR, 'narrador_bruto.mp3'), '-ss', str(a), '-to', str(b),
                    '-af', 'afade=t=in:d=0.03,areverse,afade=t=in:d=0.08,areverse,loudnorm=I=-16:TP=-1.5:LRA=7,aresample=48000',
                    '-ac', '1', '-b:a', '160k', sal], check=True)
    d = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', sal],
                             capture_output=True, text=True).stdout)
    dur[f'n{i:02d}'] = round(d, 2); print(f'n{i:02d}', round(d, 2))
json.dump(dur, open(os.path.join(DIR, 'duraciones.json'), 'w'), indent=1)
