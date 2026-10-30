"""Efectos de sonido con ElevenLabs (Efectos de sonido), nunca sintetizados: se guardan en audio/sfx/eleven/.
Uso (desde la raíz del repo): python3 fabrica/explicado/efectos.py   (lo ya bajado no se repite)
"""
import json, os, subprocess
EFECTOS = {   # nombre: (descripción en inglés, segundos)
    'pop': ('soft cartoon pop, small character landing, clean UI sound', 0.6),
    'teclas': ('fast typing on a mechanical keyboard, short burst', 1.5),
    'tic': ('single soft digital tick, clean UI counter click', 0.5),
    'sello': ('rubber stamp slammed hard on paper, punchy thud', 0.8),
    'apagon': ('electric power down, lights shutting off with a descending hum', 1.5),
    'brillo': ('magical sparkle chime, cute and soft, hearts appearing', 1.2),
    'enviar': ('message sent swoosh, modern phone UI', 0.8),
    'aparece': ('soft whoosh pop, UI card appearing, clean', 0.6),
}
clave = open(os.path.expanduser('~/.elevenlabs_key')).read().strip()
for nombre, (texto, seg) in EFECTOS.items():
    destino = f'audio/sfx/eleven/{nombre}.mp3'
    if os.path.exists(destino): continue
    r = subprocess.run(['curl', '-sS', '--fail-with-body', '-K', '-', '-o', destino, '-H', 'Content-Type: application/json',
                        '--data-binary', json.dumps({'text': texto, 'duration_seconds': seg, 'prompt_influence': .5}),
                        'https://api.elevenlabs.io/v1/sound-generation'], input=f'header = "xi-api-key: {clave}"\n', text=True, capture_output=True)
    if r.returncode: print('falló', nombre, open(destino, errors='replace').read()[:200]); os.remove(destino)
    else: print('hecho', nombre)
