# Apertura de la boca fotograma a fotograma según el volumen de la voz (para marionetas en HyperFrames).
# Uso: python3 boca.py VOZ.mp3 [fps=30] > boca.json   → lista de valores 0..1, uno por fotograma.
import json, subprocess, sys
import numpy as np

fps = int(sys.argv[2]) if len(sys.argv) > 2 else 30
sr = 16000
pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', sys.argv[1], '-f', 'f32le', '-ac', '1', '-ar', str(sr), '-'],
                     capture_output=True, check=True).stdout
a = np.frombuffer(pcm, np.float32)
n = sr // fps
rms = np.array([np.sqrt(np.mean(a[i:i + n] ** 2)) for i in range(0, len(a) - n + 1, n)])
v = np.clip((20 * np.log10(rms + 1e-6) + 42) / 24, 0, 1)   # -42 dB cerrada … -18 dB abierta del todo
v = np.convolve(v, [.25, .5, .25], 'same')                    # sin temblores entre fotogramas
print(json.dumps([round(float(x), 2) for x in v]))
