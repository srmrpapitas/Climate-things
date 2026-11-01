# Secuencias a 60 imágenes por segundo para el paralepípedo (un dibujo distinto en cada fotograma):
#  - cadenas: RIFE dibuja K intermedios entre cada par de dibujos clave alineados (boca, grito, se congela, se levanta…);
#  - planos: los clips de Veo se rellenan a 24·SUB fps con RIFE y se retiman al segundo exacto de cada plano.
# Uso (desde la raíz del repo): RIFE=/ruta/rife-ncnn-vulkan python3 -I fabrica/explicado/secuencias.py [cadenas|planos]
# Sale referencias/paralepipedo/sec/<nombre>/NNN.jpg y sec/indice.json, que lee escenas/paralepipedo.js.
import json, os, shutil, subprocess, sys, tempfile
RIFE = os.environ['RIFE']; MODELO = os.path.join(os.path.dirname(RIFE), 'rife-v4.6')
BASE = 'referencias/paralepipedo'; SAL = f'{BASE}/sec'; K = 16; SUB = 5
CADENAS = {'pasillo': ['pasillo', 'pasillo-2', 'pasillo-3'], 'lado': ['lado-grita', 'lado', 'lado-congela'], 'manga': ['susto', 'susto-mm', 'susto-que'],
           'baki': ['furia-aprieta', 'furia-grito'], 'nino': ['nino', 'nino-grita', 'nino-salta'], 'sombra': ['sombra-0', 'sombra']}
# plano: (clip de Veo, tramos [segundo del vídeo desde, hasta, segundo del clip, velocidad]); los tramos van seguidos
PLANOS = {'cuadro': ('padre-habla-veo', [(2.0, 3.9, .797, .886)]),            # «Dime, hijo» de Veo (1,24 s) cae en el de la voz (2,5 s)
          'manga': ('padre-estres-veo', [(5.4, 7.5, 1.5, 1.62)]),              # la sonrisa se congela y pasa a manga en blanco y negro justo en el «¿Qué?»
          'baki': ('padre-estres-veo', [(10.4, 11.17, 5.3, 2.2)]),             # dientes apretados, el ojo le tiembla, sudor: hasta el «¡Cállate!»
          'piensa': ('padre-estres-veo', [(100, 101.8, 4.9, -.55), (101.8, 104.2, 3.91, .55)]),   # «pensando» (inserto, tiempo propio desde 100): vuelve atrás y adelante en el susto
          'carga': ('puno-veo', [(17.8, 18.7, 2.27, 1.5)]),
          'golpe': ('puno-veo', [(18.7, 19.5, 3.62, 1.5)]),                  # lanza el puño; luego el niño dice «parale…»
          'puno': ('puno-veo', [(20.12, 20.4, 5.2, 1.96), (20.4, 21.44, 7.42, .5)])}   # llega a cámara en el impacto; sin la explosión: salta al puño, a cámara lenta

# planos del niño repitiendo: cada palabra suya cae en una «Paralepípedo» del clip de Veo (sus tiempos, de STT) y se acelera a su duración;
# las palabras van de dos en dos como los cortes del plano (cortesEn), así el salto entre palabras de Veo cae en un corte
NINO = ('nino-veo', [(.3, 2.16), (2.5, 4.72), (4.86, 7.76)], {'abajo': (7.5, 10.4, 7.5, 0), 'abajo2': (13.2, 14.8, 11.8, 1), 'abajo3': (19.5, 20.12, 19.5, 2)})
def palabras_nino():                                                   # como bocaN en la escena: frases a, c, e, g, h y j
    s = open('fabrica/explicado/escenas/tiempos_paralepipedo.js').read(); d = json.loads(s[s.index('{'):s.rindex('}') + 1])
    return [(p[1], p[2]) for f in d['frases'] if f['escena'] in 'acegh' for p in f['palabras']] + [(p[1], p[2]) for f in d['frases'] if f['escena'] == 'j' for p in f['palabras']]
def segundo_veo(t, W, veo, base):                                      # el segundo del clip que toca en t; base: 0 usa las palabras 1-2 de Veo, 1 las 2-3, 2 solo la 3
    j = lambda i: 2 if base == 2 else base + (0 if i % 2 else 1)       # primera palabra de cada corte → primera del par
    if t < W[0][0]: return max(0, veo[j(0)][0] - (W[0][0] - t))
    for i, (a, b) in enumerate(W):
        A, B = veo[j(i)]
        if t <= b: return A + (t - a) / (b - a) * (B - A)
        if i + 1 < len(W) and t < W[i + 1][0]:                          # hueco entre palabras: sigue el de Veo si no hay corte, si no se queda
            return B + (t - b) / (W[i + 1][0] - b) * (veo[j(i + 1)][0] - B) if (i + 1) % 2 == 0 and base != 2 else B
    return veo[j(len(W) - 1)][1] + (t - W[-1][1])

def rife(ent, sal, n): subprocess.run([RIFE, '-i', ent, '-o', sal, '-n', str(n), '-m', MODELO, '-f', '%08d.png'], check=True, capture_output=True)
def jpg(src, dst): subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-q:v', '2', dst], check=True)
def limpia(d): shutil.rmtree(d, ignore_errors=True); os.makedirs(d)

ix = {'k': K, 'cadenas': {}, 'planos': {}}                             # lo que hace esta pasada; al final se suma al índice
que = sys.argv[1:] or ['cadenas', 'planos', 'nino']
with tempfile.TemporaryDirectory() as tmp:
    if 'cadenas' in que:
        for nombre, dibujos in CADENAS.items():
            ent, sal = f'{tmp}/{nombre}-e', f'{tmp}/{nombre}-s'; limpia(ent); limpia(sal); limpia(f'{SAL}/{nombre}')
            for i, d in enumerate(dibujos): shutil.copy(f'{BASE}/clave/{d}.png', f'{ent}/{i:08d}.png')
            rife(ent, sal, len(dibujos) * K)                                   # la salida i cae en i/K de la cadena; lo que pasa del último se descarta
            n = (len(dibujos) - 1) * K + 1
            for i in range(n): jpg(f'{sal}/{i + 1:08d}.png', f'{SAL}/{nombre}/{i:03d}.jpg')
            ix['cadenas'][nombre] = n; print(nombre, n, flush=True)
    if 'planos' in que:
        solo = [a for a in que if a in PLANOS] or list(PLANOS)              # «planos manga baki» rehace solo esos
        for plano, (clip, tramos) in ((p, PLANOS[p]) for p in solo):
            todo = f'{tmp}/{clip}'
            if not os.path.exists(todo): os.makedirs(todo); subprocess.run(['ffmpeg', '-v', 'error', '-i', f'{BASE}/veo/{clip}.mp4', f'{todo}/%08d.png'], check=True)
            total = len(os.listdir(todo)); limpia(f'{SAL}/{plano}'); desde0 = tramos[0][0]; j = 0
            for a, b, v0, vel in tramos:
                lo, hi = sorted((v0, v0 + (b - a) * vel)); f0 = max(0, int(lo * 24) - 1); f1 = min(total - 1, int(hi * 24) + 2)   # vel < 0: el clip va hacia atrás
                ent, sal = f'{tmp}/{plano}-{a}-e', f'{tmp}/{plano}-{a}-s'; limpia(ent); limpia(sal)
                for f in range(f0, f1 + 1): shutil.copy(f'{todo}/{f + 1:08d}.png', f'{ent}/{f:08d}.png')
                m = f1 - f0 + 1; rife(ent, sal, m * SUB)                       # la salida i es el fotograma f0 + i/SUB del clip
                while desde0 + j / 60 < b - 1e-6:
                    p = ((v0 + (desde0 + j / 60 - a) * vel) * 24 - f0) * SUB
                    jpg(f'{sal}/{min((m - 1) * SUB, max(0, round(p))) + 1:08d}.png', f'{SAL}/{plano}/{j:03d}.jpg'); j += 1
            ix['planos'][plano] = {'desde': desde0, 'n': j}; print(plano, j, flush=True)
    if 'nino' in que:
        clip, veo, planos = NINO; todo, fino = f'{tmp}/{clip}', f'{tmp}/{clip}-s'; limpia(todo); limpia(fino)
        subprocess.run(['ffmpeg', '-v', 'error', '-i', f'{BASE}/veo/{clip}.mp4', f'{todo}/%08d.png'], check=True)
        m = len(os.listdir(todo)); rife(todo, fino, m * 2)                 # a 48 fps: dentro de cada palabra va unas 4 veces más rápido
        pal = palabras_nino()
        for plano, (a, b, desde, base) in planos.items():
            W = [p for p in pal if p[0] >= desde]; limpia(f'{SAL}/{plano}'); j = 0
            while a + j / 60 < b - 1e-6:
                v = min(segundo_veo(a + j / 60, W, veo, base), (m - 1) / 24)
                jpg(f'{fino}/{min((m - 1) * 2, max(0, round(v * 48))) + 1:08d}.png', f'{SAL}/{plano}/{j:03d}.jpg'); j += 1
            ix['planos'][plano] = {'desde': a, 'n': j}; print(plano, j, flush=True)
viejo = json.load(open(f'{SAL}/indice.json')) if os.path.exists(f'{SAL}/indice.json') else {'k': K, 'cadenas': {}, 'planos': {}}
for c in ('cadenas', 'planos'): viejo[c].update(ix[c])
json.dump(viejo, open(f'{SAL}/indice.json', 'w'))
