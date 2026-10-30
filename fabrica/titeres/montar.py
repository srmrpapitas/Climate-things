"""Monta el capítulo de títeres: une las secuencias grabadas (out/NOMBRE.mp4) con la ráfaga de viento entre lugares
(cortina que entra por la izquierda, como la transición `viento` de las escenas) y la música propia por ambiente, bajo la voz.

Uso (desde la raíz del repo): python3 fabrica/titeres/montar.py out/espanistan-03-animado.mp4
  Antes: cada secuencia grabada con grabar.mjs, la ráfaga con `node fabrica/titeres/rafaga.mjs out/rafaga`
  y la música con `~/qw/bin/python -I fabrica/manual/herramientas/musica.py out/musica03/AMBIENTE.wav AMBIENTE`.
"""
import subprocess, sys

SECUENCIAS = [  # (escena, ambiente de la música): misterio, tension, neutro, esperanza
    ('apertura', 'misterio'), ('intro', 'tension'), ('fuego', 'tension'), ('condesa', 'neutro'), ('nace-vox', 'misterio'), ('subida', 'esperanza'),
    ('chiringuitos', 'neutro'), ('mano-daga', 'tension'), ('frascos', 'tension'), ('balanza', 'neutro'), ('cierre', 'esperanza'), ('outro', 'esperanza')]
SECUENCIAS_04 = [('04-gancho', 'tension'), ('04-intro', 'tension'), ('04-noria', 'neutro'), ('04-restauracion', 'misterio'), ('04-atado', 'tension'), ('04-hilos', 'tension'),
    ('04-mesa', 'misterio'), ('04-puerta', 'neutro'), ('04-mafia', 'tension'), ('04-balanza', 'esperanza'), ('outro', 'esperanza')]
if len(sys.argv) > 2 and sys.argv[2] == '04': SECUENCIAS = SECUENCIAS_04   # python3 fabrica/titeres/montar.py out/espanistan-04.mp4 04
SECUENCIAS_05 = [('05-gancho', 'misterio'), ('05-intro', 'tension'), ('05-resta', 'tension'), ('05-tenerife', 'neutro'), ('05-madrid', 'misterio'), ('05-barcelona', 'tension'),
    ('05-leyes', 'tension'), ('05-grua', 'misterio'), ('05-solucion', 'esperanza'), ('05-balanza', 'esperanza'), ('outro', 'esperanza')]
if len(sys.argv) > 2 and sys.argv[2] == '05': SECUENCIAS = SECUENCIAS_05   # python3 fabrica/titeres/montar.py out/espanistan-05.mp4 05
SECUENCIAS_06 = [('06-gancho', 'misterio'), ('intro2', 'tension'), ('06-cuenta', 'neutro'), ('06-ceuta', 'tension'), ('06-trabajo', 'neutro'), ('06-delitos', 'misterio'),
    ('06-papel', 'tension'), ('06-familias', 'tension'), ('06-coherencia', 'misterio'), ('06-frases', 'tension'), ('06-solucion', 'esperanza'), ('06-balanza', 'esperanza'), ('outro', 'esperanza')]
if len(sys.argv) > 2 and sys.argv[2] == '06': SECUENCIAS = SECUENCIAS_06   # python3 fabrica/titeres/montar.py out/espanistan-06.mp4 06
SECUENCIAS_07 = [('07-gancho', 'misterio'), ('intro-07', 'tension'), ('07-prusia', 'misterio'), ('07-matiz', 'neutro'), ('07-hoy', 'tension'), ('07-memoria', 'tension'),
    ('07-elite', 'misterio'), ('07-pensar', 'neutro'), ('07-falacias', 'tension'), ('07-estonia', 'esperanza'), ('07-solucion', 'esperanza'), ('07-final', 'esperanza'), ('outro', 'esperanza')]
if len(sys.argv) > 2 and sys.argv[2] == '07': SECUENCIAS = SECUENCIAS_07   # python3 fabrica/titeres/montar.py out/espanistan-07.mp4 07
FPS = 60 if len(sys.argv) > 2 and sys.argv[2] >= '07' else 30   # desde el ep. 7, a 60 fps (ráfaga: node fabrica/titeres/rafaga.mjs out/rafaga60 60)
RAFAGA = 'out/rafaga60' if FPS == 60 else 'out/rafaga'
# un tercer número = segundos que se recortan del principio de esa secuencia (el outro entra ya en la pantalla partida, hablando)
CRUCE = .5          # segundos que se solapan dos secuencias
MUSICA = .12        # volumen de la música, siempre por debajo de la voz
ANTES = .19         # la ráfaga empieza a cruzar la pantalla 0,19 s después de su primer fotograma

def dura(archivo):
    return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', archivo], capture_output=True, text=True).stdout)

def main():
    salida = sys.argv[1] if len(sys.argv) > 1 else 'out/espanistan-03-animado.mp4'
    n = len(SECUENCIAS); R = [s[2] if len(s) > 2 else 0 for s in SECUENCIAS]
    D = [dura(f'out/{s[0]}.mp4') - r for s, r in zip(SECUENCIAS, R)]
    args = []
    for s, r in zip(SECUENCIAS, R): args += ['-ss', str(r), '-i', f'out/{s[0]}.mp4']
    for s in SECUENCIAS: args += ['-stream_loop', '-1', '-i', f'out/musica03/{s[1]}.wav']
    args += ['-framerate', str(FPS), '-i', f'{RAFAGA}/%03d.png']
    f = []
    for i in range(n):
        f.append(f'[{i}:v]fps={FPS},format=yuv420p,setsar=1[v{i}]')
        f.append(f'[{i}:a]aformat=sample_rates=44100:channel_layouts=stereo,apad=whole_dur={D[i]:.3f}[va{i}]')   # el audio de la secuencia dura lo que su imagen
        f.append(f'[{n + i}:a]aformat=sample_rates=44100:channel_layouts=stereo,atrim=0:{D[i]:.3f},asetpts=PTS-STARTPTS,volume={MUSICA},'
                 f'afade=t=in:d=0.8,afade=t=out:st={max(0, D[i] - 1):.3f}:d=1[mu{i}]')
        f.append(f'[va{i}][mu{i}]amix=inputs=2:normalize=0:duration=first[a{i}]')
    f.append(f'[{2 * n}:v]format=rgba,split={n - 1}' + ''.join(f'[w{k}]' for k in range(1, n)))
    v, a, inicio = 'v0', 'a0', 0.0
    for k in range(1, n):
        inicio += D[k - 1] - CRUCE   # cuándo empieza el cruce k en el capítulo
        f.append(f'[{v}][v{k}]xfade=transition=wiperight:duration={CRUCE}:offset={inicio:.3f}[x{k}]')
        f.append(f'[w{k}]setpts=PTS-STARTPTS+{max(0, inicio - ANTES):.3f}/TB[r{k}]')
        f.append(f'[x{k}][r{k}]overlay=eof_action=pass:format=auto[y{k}]')
        f.append(f'[{a}][a{k}]acrossfade=d={CRUCE}[z{k}]')
        v, a = f'y{k}', f'z{k}'
    total = sum(D) - CRUCE * (n - 1)
    print(f'{n} secuencias, {total:.1f} s ({total / 60:.1f} min)')
    subprocess.run(['ffmpeg', '-y', '-v', 'error', *args, '-filter_complex', ';'.join(f), '-map', f'[{v}]', '-map', f'[{a}]',
                    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', str(FPS),
                    '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-t', f'{total:.3f}', salida], check=True)
    print('hecho', salida)

if __name__ == '__main__':
    main()
