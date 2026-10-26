# Narración gratis con Qwen3-TTS clonando la voz D (plan B cuando no hay créditos de ElevenLabs).
# Uso: python -I voz_qwen.py GUION.txt CARPETA_SALIDA [1,4,20|all] [--grave]
# Una frase por línea del guion → CARPETA/NN.mp3 (160k). Salta las que ya existen (se puede reanudar).
# --grave: baja 1,5 semitonos la voz de referencia antes de clonar (más grave y limpio que filtrar el resultado).
import os, sys, subprocess, tempfile, time, torch, soundfile as sf
from qwen_tts import Qwen3TTSModel

AQUI = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(AQUI, '..', '..', '..'))
REF = f'{REPO}/audio/voz/es/altura/01.mp3'
REF_TEXTO = ('El doble de alto pesa 8 veces más, como un caballo, pero tus huesos sólo son 4 veces más gruesos. '
             'Galileo lo vio en 1638. Cada hueso carga el doble.')

guion, out = sys.argv[1], sys.argv[2]
idx = sys.argv[3] if len(sys.argv) > 3 and not sys.argv[3].startswith('--') else 'all'
os.makedirs(out, exist_ok=True)
tmp = tempfile.mkdtemp()
ref = REF
if '--grave' in sys.argv:
    ref = f'{tmp}/ref_grave.wav'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', REF, '-af', 'rubberband=pitch=0.92:formant=preserved',
                    '-ar', '24000', '-ac', '1', ref], check=True)

lineas = [l.strip() for l in open(guion, encoding='utf-8') if l.strip()]
todo = range(1, len(lineas) + 1) if idx == 'all' else [int(x) for x in idx.split(',')]
torch.set_num_threads(os.cpu_count())
m = Qwen3TTSModel.from_pretrained('Qwen/Qwen3-TTS-12Hz-1.7B-Base', device_map='cpu', dtype=torch.float32)
p = m.create_voice_clone_prompt(ref_audio=ref, ref_text=REF_TEXTO)
for i in todo:
    dst = f'{out}/{i:02d}.mp3'
    if os.path.exists(dst): continue
    t0 = time.time()
    wavs, sr = m.generate_voice_clone(text=lineas[i - 1], language='Spanish', voice_clone_prompt=p)
    sf.write(f'{tmp}/x.wav', wavs[0], sr)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{tmp}/x.wav', '-b:a', '160k', dst], check=True)
    print(f'{i:02d}/{len(lineas)} {len(wavs[0]) / sr:.1f}s en {time.time() - t0:.0f}s', flush=True)
print('FIN', flush=True)
