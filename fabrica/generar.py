# Generador de vídeos de la fábrica: escenas.json → index.html (HyperFrames) + audio montado.
# Uso: /home/user/qw/bin/python -I fabrica/generar.py fabrica/videos/<slug>/escenas.json
# Necesita: ffmpeg, numpy, soundfile y faster-whisper (los instala fabrica/instalar_todo.sh).
#
# escenas.json (ver fabrica/videos/espanistan-02/escenas.json como ejemplo completo):
#   "guion": ruta del guion (una frase por línea), "voces": [{"archivo", "lineas": "5-8", "pausa": 0.6}, ...]
#   "negrita": palabras que salen resaltadas en los subtítulos
#   "planos": [{"en": "ANCLA", "tipo": "imagen|decano|marioneta|cueva", "fondo": "coche", "cam": [x,y,z], "cam2": [x,y,z],
#               "musica": "neutro|misterio|esperanza|tension|silencio", "capas": [...], "sfx": [[nombre, ANCLA, volumen]]}]
#   capas: {"tipo": "dato|cita|frasco|barras|lista|comparacion|linea|sello|pines|titulo", "en": ANCLA, "hasta": ANCLA, ...}
#   tipo «teatro»: "escena" (carpeta de sombras.py en cfg['sombras']), "acciones": [{"pieza", "hace": asiente|niega|alza|saluda|salta|
#     tiembla|inclina|golpea|balancea|crece|avanza|aparece|desaparece  (vuelven a su sitio) | entra|sale|arrastra|camina|cae|sube|gira|late
#     (se quedan hechas: la escena evoluciona), "en", "hasta", "g": cantidad}],
#     "particulas": [{"tipo": lluvia|chispas|humo|monedas|papeles|pajaros|estrellas|polvo, "en", "hasta", "n", "zona": [x0, y0, x1, y1] en 1280×720}]
#   tipo «retrato»: "img" (p1|p2…), "lado" (1 mira a la derecha, -1 izquierda), "z": [zoom inicio, fin], "y": deriva; habla con BOCA_F
#   voces de personaje: {"archivo", "texto", "quien": "feijolo"} (sin "lineas")
#   ANCLA = "B:palabras" (B = número de voz, 1…; palabras del guion; "#2" = segunda vez) o un número de segundos.
import json, os, re, subprocess, sys, unicodedata
import numpy as np, soundfile as sf

CFG = os.path.abspath(sys.argv[1]); DIR = os.path.dirname(CFG); REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
cfg = json.load(open(CFG, encoding='utf-8'))
HERR = os.path.join(REPO, 'fabrica/manual/herramientas'); IMG = os.path.join(REPO, 'historias/espanistan/img')
SFX = {n: p for n, p in [('golpe', 'fabrica/videos/espanistan-01-intro/assets/sfx/golpe.mp3'), ('whoosh', 'fabrica/videos/espanistan-01-intro/assets/sfx/whoosh.mp3'),
       ('trazo', 'fabrica/videos/espanistan-01-intro/assets/sfx/trazo.mp3'), ('cadenas', 'fabrica/videos/espanistan-01-intro/assets/sfx/cadenas.mp3'),
       ('riser', 'audio/sfx/riser.mp3'), ('impacto', 'audio/sfx/impacto.mp3'), ('fuego', 'audio/sfx/fuego.mp3')]}
A = os.path.join(DIR, 'assets'); os.makedirs(A, exist_ok=True); os.makedirs(os.path.join(DIR, 'tiempos'), exist_ok=True)
sh = lambda *c: subprocess.run(c, check=True, capture_output=True)
dur = lambda f: float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], capture_output=True, text=True).stdout)
norm = lambda w: re.sub(r'[^a-z0-9ñ]', '', unicodedata.normalize('NFKD', w.lower()).replace('̃', '~').encode('ascii', 'ignore').decode().replace('~', ''))

# ---------- 1. voces: posiciones, palabras del guion y sus tiempos (Whisper) ----------
lineas = [l.strip() for l in open(os.path.join(REPO, cfg['guion']), encoding='utf-8') if l.strip()]
voces, t = [], cfg.get('inicio', .4)
for i, v in enumerate(cfg['voces'], 1):
    src = os.path.join(REPO, v['archivo']); dst = f'{A}/voz{i:02d}.mp3'
    if not os.path.exists(dst): sh('cp', src, dst)
    tj = os.path.join(DIR, 'tiempos', f'{i:02d}.json')
    if not os.path.exists(tj):
        open(tj, 'w').write(subprocess.run([sys.executable, '-I', f'{HERR}/tiempos.py', dst], capture_output=True, text=True, check=True).stdout)
    ww = [w for s in json.load(open(tj)) for w in s['palabras']]
    if 'texto' in v: texto = v['texto']                                      # voz de un personaje (Feijolo…): su propio texto
    else:
        a, b = map(int, v['lineas'].split('-')) if '-' in v['lineas'] else (int(v['lineas']),) * 2
        texto = ' '.join(lineas[a - 1:b])
    gw = texto.split()
    # alinear palabras del guion con las de Whisper (iguales → su tiempo; el resto se interpola)
    tw, j = [None] * len(gw), 0
    for k, g in enumerate(gw):
        for d in range(6):
            if j + d < len(ww) and norm(ww[j + d][0]) == norm(g) and norm(g): tw[k] = ww[j + d][1]; j += d + 1; break
    D = dur(dst); known = [(k, x) for k, x in enumerate(tw) if x is not None] or [(0, 0.)]
    known = [(-1, 0.)] + known + [(len(gw), D)]
    for (k0, x0), (k1, x1) in zip(known, known[1:]):
        for k in range(k0 + 1, k1): tw[k] = x0 + (x1 - x0) * (k - k0) / (k1 - k0)
    voces.append({'ini': t, 'dur': D, 'texto': texto, 'pal': gw, 'tw': [t + x for x in tw], 'quien': v.get('quien')})
    t += D + v.get('pausa', cfg.get('pausa', .6))
TOTAL = t + cfg.get('cola', 3.5)

def ancla(s, desde=0):
    if isinstance(s, (int, float)): return float(s)
    b, txt = s.split(':', 1); n = 1
    if '#' in txt: txt, n = txt.split('#'); n = int(n)
    v = voces[int(b) - 1]; q = [norm(x) for x in txt.split()]; P = [norm(x) for x in v['pal']]
    for k in range(len(P)):
        if P[k:k + len(q)] == q:
            n -= 1
            if n == 0: return v['tw'][k]
    sys.exit(f'Ancla no encontrada: {s}')

# ---------- 2. subtítulos: trozos del guion de ≤ 8 palabras, cortados en la puntuación ----------
neg = sorted(cfg.get('negrita', []), key=len, reverse=True)
FR = []
for v in voces:
    trozo = []
    for k, w in enumerate(v['pal']):
        trozo.append(k)
        if re.search(r'[.:;?!…]$', w) or (re.search(r',$', w) and len(trozo) >= 4) or len(trozo) >= 8 or k == len(v['pal']) - 1:
            txt = ' '.join(v['pal'][x] for x in trozo)
            for n in neg: txt = re.sub(r'(?<![\w>])(' + re.escape(n) + r')(?![\w<])', r'<b>\1</b>', txt, count=1)
            fin = v['tw'][k + 1] if k + 1 < len(v['pal']) else v['ini'] + v['dur']
            FR.append({'ini': round(v['tw'][trozo[0]] - .05, 2), 'fin': round(fin + .15, 2), 'txt': txt, 'q': v['quien']}); trozo = []

# ---------- 3. planos y capas (tiempos absolutos) ----------
planos = cfg['planos']
for i, p in enumerate(planos):
    p['ini'] = 0 if i == 0 else ancla(p['en']) - .25
for i, p in enumerate(planos): p['fin'] = planos[i + 1]['ini'] if i + 1 < len(planos) else TOTAL
for p in planos:
    for c in p.get('capas', []):
        c['ini'] = ancla(c['en']) if 'en' in c else p['ini'] + .3
        c['fin'] = ancla(c['hasta']) if 'hasta' in c else p['fin'] - .1
        if c['tipo'] == 'comparacion' and 'en' in c.get('der', {}): c['items'] = [{'en': c['der']['en']}]
        for it in c.get('items', []):
            if isinstance(it, dict) and 'en' in it: it['ini'] = ancla(it['en'])
        for it in c.get('pines', []):
            if len(it) > 4: it[4] = ancla(it[4])
    for z in p.get('zooms', []): z[0] = ancla(z[0])
    for q in p.get('particulas', []):
        q['ini'] = ancla(q['en']) if 'en' in q else p['ini']; q['fin'] = ancla(q['hasta']) if 'hasta' in q else p['fin'] + .3
    for ac in p.get('acciones', []):
        ac['ini'] = ancla(ac['en']) if 'en' in ac else p['ini'] + .3
        ac['fin'] = ancla(ac['hasta']) if 'hasta' in ac else (p['fin'] if ac['hace'] in ('desaparece', 'aparece') else ac['ini'] + 2.5)

# ---------- 4. audio: música por ambiente + efectos (se mezclan aquí; las voces van como <audio>) ----------
SR = 44100; mus = np.zeros((int(TOTAL * SR) + SR, 2)); cache = {}
def ambiente(nombre):
    if nombre not in cache:
        w = f'/tmp/musica_{nombre}.wav'
        if not os.path.exists(w): sh(sys.executable, '-I', f'{HERR}/musica.py', w, nombre)
        cache[nombre] = sf.read(w)[0]
    return cache[nombre]
for p in planos:
    m = p.get('musica', 'neutro')
    if m == 'silencio': continue
    a, b = int(p['ini'] * SR), int(p['fin'] * SR); x = ambiente(m); n = b - a
    seg = np.tile(x, (n // len(x) + 1, 1))[(a % len(x)):(a % len(x)) + n]
    f = min(SR, n // 2); env = np.ones(n); env[:f] = np.linspace(0, 1, f); env[-f:] = np.linspace(1, 0, f)
    mus[a:a + len(seg)] += seg * env[:len(seg), None]
mus *= cfg.get('volumen_musica', .14)
fin_m = int((TOTAL - 2) * SR); mus[fin_m:] *= np.linspace(1, 0, len(mus) - fin_m)[:, None]
def efecto(nombre, t0, vol):
    p = f'/tmp/sfx_{nombre}.wav'
    if not os.path.exists(p): sh('ffmpeg', '-v', 'error', '-y', '-i', os.path.join(REPO, SFX[nombre]), '-ar', str(SR), '-ac', '2', p)
    x = sf.read(p)[0]; a = int(t0 * SR); x = x[:len(mus) - a]; mus[a:a + len(x)] += x * vol
for k, p in enumerate(planos):
    tp = p.get('tipo')
    if k and tp not in ('decano', 'marioneta', 'retrato'): efecto('whoosh', p['ini'] - .1, .07 if tp == 'teatro' else .2)   # poco sonido en personas
    for c in p.get('capas', []):
        if c['tipo'] == 'suscribete':
            for dt in (1.1, 2.2, 3.3): efecto('trazo', c['ini'] + dt, .7)
        d = {'frasco': ('golpe', .45), 'sello': ('golpe', .45), 'dato': ('trazo', .5), 'cita': ('trazo', .5), 'barras': ('trazo', .4)}.get(c['tipo'])
        if d: efecto(d[0], c['ini'], d[1])
        for it in c.get('items', []):
            if isinstance(it, dict) and 'ini' in it: efecto('golpe', it['ini'], .3)
    for nombre, an, vol in p.get('sfx', []): efecto(nombre, ancla(an), vol)
sf.write(f'{A}/fondo.wav', np.clip(mus, -1, 1), SR); sh('ffmpeg', '-v', 'error', '-y', '-i', f'{A}/fondo.wav', '-b:a', '160k', f'{A}/fondo.mp3'); os.remove(f'{A}/fondo.wav')

# boca del narrador: volumen de toda la voz, un valor por fotograma
BOCA = np.zeros(int(TOTAL * 30) + 1); BOCA_F = np.zeros_like(BOCA)
for i, v in enumerate(voces, 1):
    b = json.loads(subprocess.run([sys.executable, '-I', f'{HERR}/boca.py', f'{A}/voz{i:02d}.mp3'], capture_output=True, text=True, check=True).stdout)
    a = int(v['ini'] * 30); (BOCA_F if v['quien'] else BOCA)[a:a + len(b)] = b[:len(BOCA) - a]

# ---------- 5. dibujos ----------
for p in planos:
    if p.get('tipo') == 'teatro':
        src = os.path.join(REPO, cfg['sombras'], p['escena']); dst = f"{A}/sombras/{p['escena']}"
        if not os.path.exists(dst): os.makedirs(f'{A}/sombras', exist_ok=True); sh('cp', '-r', src, dst); os.remove(f'{dst}/previa.jpg') if os.path.exists(f'{dst}/previa.jpg') else None
        p['piezas'] = json.load(open(f'{dst}/piezas.json'))
        p['ancho'] = int(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'stream=width', '-of', 'csv=p=0', f'{dst}/fondo.jpg'], capture_output=True, text=True).stdout)
    if p.get('tipo') == 'retrato':
        for ab in ('cerrada', 'abierta'):
            f = f"{p['img']}_{ab}.webp"
            if not os.path.exists(f'{A}/{f}'): sh('cp', os.path.join(REPO, cfg.get('retratos', 'historias/espanistan/retratos/feijolo'), f), f'{A}/{f}')
fondos = {p.get('fondo') for p in planos if p.get('tipo') not in ('teatro', 'retrato')} | {'portada', 'escenario', 'cueva'}
for f in fondos:
    if f and not os.path.exists(f'{A}/{f}.webp'): sh('cp', f'{IMG}/{f}.webp', f'{A}/{f}.webp')
for f in ('cuerpo', 'cabeza', 'mano'):
    if not os.path.exists(f'{A}/{f}.webp'): sh('cp', os.path.join(REPO, 'historias/espanistan/marionetas/feijolo', f + '.webp'), f'{A}/{f}.webp')
# cp -n en macOS sale con 1 si el archivo ya está: no es error
subprocess.run(('cp', '-rn', os.path.join(REPO, 'fabrica/videos/espanistan-01-intro/assets/fuentes'), A), capture_output=True); subprocess.run(('cp', '-n', os.path.join(REPO, 'fabrica/videos/espanistan-01-intro/assets/gsap.min.js'), A), capture_output=True)
for f in ('hyperframes.json', 'package.json'):
    if not os.path.exists(f'{DIR}/{f}'): sh('cp', os.path.join(REPO, 'fabrica/videos/espanistan-01-intro', f), DIR)

# ---------- 6. HTML ----------
plantilla = open(os.path.join(os.path.dirname(__file__), 'plantilla.html'), encoding='utf-8').read()
audios = ''.join(f'<audio id="voz{i:02d}" src="assets/voz{i:02d}.mp3" data-start="{v["ini"]:.2f}" data-duration="{v["dur"] - .02:.2f}" data-volume="1"></audio>\n'
                 for i, v in enumerate(voces, 1))
audios += f'<audio id="fondo" src="assets/fondo.mp3" data-start="0" data-duration="{TOTAL - .05:.2f}" data-volume="1"></audio>\n'
datos = {'TOTAL': round(TOTAL, 2), 'FRASES': FR, 'PLANOS': planos, 'BOCA': [round(float(x), 2) for x in BOCA], 'BOCA_F': [round(float(x), 2) for x in BOCA_F], 'TITULO': cfg.get('titulo', {})}
html = plantilla.replace('__TOTAL__', f'{TOTAL:.2f}').replace('__AUDIOS__', audios).replace('__DATOS__', json.dumps(datos, ensure_ascii=False))
open(f'{DIR}/index.html', 'w', encoding='utf-8').write(html)
print(f'ok {DIR}/index.html · {TOTAL:.1f} s · {len(planos)} planos · {len(FR)} subtítulos')
