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
    # chorizo portuano
    'campanilla': ('small brass shop door bell jingling as a door opens', 1.5),
    'congelado': ('comedic record scratch, freeze frame', 1.0),
    'zoom': ('comedic dramatic zoom whoosh ending in a sitcom sting hit', 1.2),
    'bolso': ('handbag dropping on a tiled floor, keys and coins rattling', 1.0),
    'rec': ('smartphone camera start recording beep', 0.6),
    'flambe': ('alcohol flambe catching fire with a whoosh and sizzle', 1.5),
    'corte': ('knife slicing cured chorizo on a wooden board, three quick slices', 1.2),
    'bascula': ('digital shop scale beep followed by a small receipt printer', 1.5),
    'coro': ('crowd of people in a small shop shouting the same two words together, comedic', 1.6),
    'shh': ('several people whispering shhh at the same time, hushed, small room', 1.2),
    'notificacion': ('single phone message notification ping, modern, clean', 0.5),
    'tiza': ('chalk writing quickly on a blackboard', 1.2),
    'transicion': ('fast smooth cinematic whoosh transition, airy, no impact', 0.7),
    'musica-chorizo':('upbeat comedic portuguese guitar and accordion loop, light and bouncy, no vocals, simple', 22),
    # paralepípedo
    'cortina': ('heavy fabric curtain pulled down slowly, cloth rustling and rings sliding', 2.5),
    'golpe-seco': ('single dull muffled thud behind a curtain, comedic, offscreen', 0.8),
    'tension': ('low ominous horror drone swelling, anime dramatic tension sting', 4),
    'manga': ('sharp anime dramatic impact zoom sting, whoosh and hit', 1.0),
    'grillos': ('crickets chirping in awkward silence, comedic', 2.5),
    'cargar': ('anime power charging up, rising energy whine with crackling electricity, building fast', 1.0),
    'latigazo': ('extremely fast anime punch swing whoosh, air tearing', 0.6),
    'impacto-anime': ('massive anime impact frame boom, deep sub bass hit with bright metallic crack, explosive', 1.5),
    'cristal': ('glass window shattering into many pieces after a hit', 1.2),
    'onda': ('shockwave blast rushing outward, wind gust and deep rumble', 1.8),
    'escombros': ('rubble and small debris falling and settling after an explosion, dust', 2.0),
    'pitido': ('high pitched ear ringing tinnitus after a loud explosion, fading', 2.0),
    'punetazo': ('anime serious punch: fast whoosh into one massive deep impact boom with a shockwave', 1.3),
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
