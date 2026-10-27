# Voz gratis en el Mac: clona la voz «narrador» con F5-TTS (modelo F5-Spanish) frase corta a frase corta y las pega.
# Uso: ~/clon/bin/python -I fabrica/manual/herramientas/voz_f5.py GUION.txt SALIDA_DIR [--nfe 32] [--gpu]
#   --gpu usa la gráfica del Mac (Metal/MPS): ≈ 1 min por frase corta (≈ 3-4 min con el procesador). Lanzar con
#   PYTORCH_ENABLE_MPS_FALLBACK=1. La AMD no hace números complejos: en f5_tts se parchearon a mano (27-10-2026)
#   torch.xpu.is_available() → False, MelSpec.forward en CPU (model/modules.py) y el vocoder en CPU (api.py y utils_infer.py).
#   GUION.txt: una frase por línea. Las frases largas se parten por las comas en trozos cortos (suenan menos a robot).
#   Sale SALIDA_DIR/NN.wav por línea (los trozos pegados con pausas cortas) y SALIDA_DIR/todo.wav con todas las líneas.
#   Instalación (Mac Intel): Python 3.11 aparte (~/clon) con torch 2.2.2; modelo en ~/modelos/f5es (ver CAPITULO-SIGUIENTE.md).
#   OJO: el modelo F5-Spanish es CC-BY-NC 4.0 (no comercial).
import os, re, sys, time
import numpy as np, soundfile as sf

GUION, SAL = sys.argv[1], sys.argv[2]
NFE = int(sys.argv[sys.argv.index('--nfe') + 1]) if '--nfe' in sys.argv else 32
REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..'))
REF = os.path.join(REPO, 'audio/voz/es/narrador/ref.wav')
REF_TEXTO = 'Montaigne escribió que nada se cree con tanta fuerza como lo que menos se conoce. Así que hoy toca conocer.'
M = os.path.expanduser('~/modelos/f5es')
PAUSA_COMA, PAUSA_FRASE, PAUSA_LINEA = .28, .45, .8

def trozos(linea, maximo=70):
    # parte en frases y, si una frase es larga, por comas, dos puntos y punto y coma
    frases = re.findall(r'[^.!?…]+[.!?…]*', linea)
    out = []
    for f in (x.strip() for x in frases if x.strip()):
        if len(f) <= maximo: out.append((f, PAUSA_FRASE)); continue
        partes = re.split(r'(?<=[,:;])\s+', f)
        actual = ''
        for p in partes:
            if actual and len(actual) + len(p) > maximo: out.append((actual, PAUSA_COMA)); actual = p
            else: actual = (actual + ' ' + p).strip()
        out.append((actual, PAUSA_FRASE))
    return out

from f5_tts.api import F5TTS
tts = F5TTS(model='F5TTS_Base', ckpt_file=f'{M}/model_1250000.safetensors', vocab_file=f'{M}/vocab.txt', device='mps' if '--gpu' in sys.argv else 'cpu')
os.makedirs(SAL, exist_ok=True)
lineas = [l.strip() for l in open(GUION, encoding='utf-8') if l.strip()]
todo, sr = [], 24000
for i, linea in enumerate(lineas, 1):
    destino = f'{SAL}/{i:02d}.wav'
    if not os.path.exists(destino):
        piezas = []
        for texto, pausa in trozos(linea):
            t0 = time.time()
            wav, sr, _ = tts.infer(REF, REF_TEXTO, texto, nfe_step=NFE, remove_silence=False, show_info=lambda *a: None, progress=None)
            # quita el silencio del principio y del final de cada trozo y añade la pausa natural
            a = np.abs(wav) > .01; ini, fin = (np.argmax(a), len(a) - np.argmax(a[::-1])) if a.any() else (0, len(wav))
            piezas += [wav[max(0, ini - 600):fin + 1200], np.zeros(int(pausa * sr))]
            print(f'{i:02d} {time.time() - t0:5.1f}s  {texto}', flush=True)
        sf.write(destino, np.concatenate(piezas[:-1]), sr)
    w, sr = sf.read(destino); todo += [w, np.zeros(int(PAUSA_LINEA * sr))]
sf.write(f'{SAL}/todo.wav', np.concatenate(todo), sr)
print('hecho', len(lineas), 'líneas')
