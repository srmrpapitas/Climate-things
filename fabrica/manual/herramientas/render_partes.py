# Render a prueba de reinicios: trocea el vídeo en partes que se guardan en disco, renderiza solo las que falten,
# monta el audio con ffmpeg y lo une todo. Si la máquina se reinicia (la nube la recicla cuando el chat está inactivo),
# basta con volver a lanzarlo: sigue donde se quedó.
# Uso: python3 render_partes.py CARPETA_DEL_VIDEO SALIDA.mp4 [--trozo 90] [--workers 4]
#   Lanzarlo dentro de tmux:  tmux new -d -s render "python3 …/render_partes.py … ; sleep 600"
import argparse, os, re, subprocess, sys

ap = argparse.ArgumentParser(); ap.add_argument('dir'); ap.add_argument('salida'); ap.add_argument('--trozo', type=float, default=90); ap.add_argument('--workers', default='4')
a = ap.parse_args(); D = os.path.abspath(a.dir); P = os.path.join(D, 'partes'); os.makedirs(P, exist_ok=True)
html = open(os.path.join(D, 'index.html'), encoding='utf-8').read()
TOTAL = float(re.search(r'data-composition-id="main"[^>]*data-duration="([0-9.]+)"', html).group(1))
dur = lambda f: float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], capture_output=True, text=True).stdout or 0)
run = lambda *c, **k: subprocess.run(c, check=True, **k)

# 1. vídeo por partes (sin audio)
partes, t0, k = [], 0.0, 0
while t0 < TOTAL - .01:
    t1 = min(TOTAL, t0 + a.trozo); f = os.path.join(P, f'parte_{k:02d}.mp4'); partes.append(f)
    if not (os.path.exists(f) and abs(dur(f) - (t1 - t0)) < .5):
        h = re.sub(r'<audio[^>]*></audio>\n?', '', html)
        h = re.sub(r'(data-composition-id="main"[^>]*data-duration=")[0-9.]+', rf'\g<1>{t1 - t0:.2f}', h)
        h = h.replace('const est = { t: 0 };', f'const est = {{ t: {t0} }};')
        h = re.sub(r"tl\.to\(est, \{ t: D\.TOTAL, duration: D\.TOTAL", f"tl.to(est, {{ t: {t1}, duration: {t1 - t0}", h)
        h = h.replace('tl.seek(0); pinta(0);', f'tl.seek(0); pinta({t0});')
        comp = os.path.join(D, '_parte.html'); open(comp, 'w', encoding='utf-8').write(h)
        print(f'parte {k}: {t0:.1f}–{t1:.1f} s', flush=True)
        run('npx', '--yes', 'hyperframes@0.8.204', 'render', '-c', '_parte.html', '-w', str(a.workers), '-o', f + '.tmp.mp4', cwd=D)
        os.replace(f + '.tmp.mp4', f)
    t0, k = t1, k + 1

# 2. unir el vídeo
lista = os.path.join(P, 'lista.txt'); open(lista, 'w').write(''.join(f"file '{f}'\n" for f in partes))
video = os.path.join(P, 'video.mp4'); run('ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lista, '-c', 'copy', video)

# 3. audio: cada <audio> en su sitio (data-start, data-duration, data-volume)
ent, fil = [], []
for i, m in enumerate(re.finditer(r'<audio[^>]*src="([^"]+)"[^>]*data-start="([0-9.]+)"[^>]*data-duration="([0-9.]+)"[^>]*data-volume="([0-9.]+)"', html)):
    src, st, du, vo = m.groups(); ent += ['-i', os.path.join(D, src)]; ms = int(float(st) * 1000)
    fil.append(f'[{i}:a]atrim=0:{du},aresample=44100,pan=stereo|c0=c0|c1=c0,volume={vo},adelay={ms}|{ms}[a{i}]')
n = len(fil); audio = os.path.join(P, 'audio.m4a')
run('ffmpeg', '-v', 'error', '-y', *ent, '-filter_complex', ';'.join(fil) + ';' + ''.join(f'[a{i}]' for i in range(n)) + f'amix=inputs={n}:normalize=0:duration=longest,apad,atrim=0:{TOTAL}[out]',
    '-map', '[out]', '-c:a', 'aac', '-b:a', '192k', audio)

# 4. juntar
run('ffmpeg', '-v', 'error', '-y', '-i', video, '-i', audio, '-c:v', 'copy', '-c:a', 'copy', '-shortest', os.path.abspath(a.salida))
print('listo:', a.salida, f'{dur(a.salida):.1f} s', flush=True)
