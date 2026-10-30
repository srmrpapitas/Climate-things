"""Shorts verticales (1080×1920) de los ep. 1 y 2, que no salen de los títeres: el vídeo horizontal en el centro (sin su franja de
subtítulos pequeños), fondo desenfocado, gancho arriba, subtítulos grandes debajo y «capítulo entero en el canal» al pie.
Cada short lleva un razonamiento entero (dato → letra pequeña → pregunta del Decano), de 45 a 120 s.

Los tiempos y el texto salen de la transcripción con Whisper (out/transcripciones/epNN.json, frase a frase), corregida con ARREGLOS.
Uso (desde la raíz): python3 fabrica/titeres/shorts_ep.py [nombre …]   → out/shorts/NOMBRE.mp4
"""
import json, os, subprocess, sys
sys.path.insert(0, 'fabrica/titeres')
from shorts import lineas, texto, FUENTE

HOME = os.path.expanduser('~')
EPISODIOS = {  # vídeo, transcripción y qué fracción de arriba se queda (quita la franja de subtítulos)
    'ep01': ('out/espanistan-01-720.mp4'  # copia a 720p del de ~/Desktop: con el 1080p, drawtext se atasca en el fotograma 0
             , 'out/transcripciones/ep01.json', .88),
    'ep02': (f'{HOME}/Downloads/espanistan-02-movil.mp4', 'out/transcripciones/ep02.json', .78),
}
# (nombre, episodio, desde la frase que empieza en, hasta la frase que empieza en (incluida), gancho en dos líneas)
SHORTS = [
    ('ep1-mochila', 'ep01', 58.1, 126.8, ['¿LA DEUDA BAJA', 'O SUBE?']),
    ('ep1-vivienda', 'ep01', 129.7, 171.4, ['98,7 % DEL SUELDO', 'EN ALQUILER']),
    ('ep1-decretos', 'ep01', 206.8, 251.9, ['GOBERNAR SIN', 'PARLAMENTO']),
    ('ep1-frascos', 'ep01', 254.8, 342.7, ['¿QUIÉN VIGILA A', 'LOS VIGILANTES?']),
    ('ep1-balanza', 'ep01', 348.3, 413.2, ['¿APRUEBA O', 'SUSPENDE?']),
    ('ep2-ganar', 'ep02', 19.1, 84.4, ['GANÓ LAS ELECCIONES', '¿Y NO GOBIERNA?']),
    ('ep2-rajoy', 'ep02', 90.7, 187.9, ['LO QUE PROMETIÓ', 'RAJOY…']),
    ('ep2-mapa', 'ep02', 195.1, 238.0, ['EL MAPA DE LA', 'CORRUPCIÓN']),
    ('ep2-frascos-1', 'ep02', 244.5, 321.9, ['LA CAJA B', 'DEL PP (1/2)']),
    ('ep2-frascos-2', 'ep02', 329.0, 381.8, ['LOS FRASCOS', 'DEL PP (2/2)']),
    ('ep2-rio', 'ep02', 387.5, 457.4, ['¿UN PP', 'NUEVO?']),
    ('ep2-promesas', 'ep02', 460.9, 541.6, ['BAJARÉ IMPUESTOS…', '¿CÓMO?']),
]
# lo que Whisper oye mal (y el guion escribe así)
ARREGLOS = [('Faye Hollow', 'Feijolo'), ('Santallana', 'Santayana'), ('se han tornado', 'se han turnado'), ('Goberna', 'Gobierna'),
            ('pay prunup, acerca del', 'PIB a cerca del'), ('el IVI', 'el IBI'), ('Cuibono', 'Cui bono'), ('El peso E', 'El PSOE'),
            ('sonrado', 'honrado'), ('Gurtel', 'Gürtel'), ('excesorero', 'extesorero'), ('Ladana', 'La dana'), ('PIMRV', 'PIB'),
            ('Valance', 'Balance'), ('subire', 'subiré'), ('record', 'récord'), ('Sanchez', 'Sanchís'), ('sanchís', 'Sanchís'),
            ('Sanchis', 'Sanchís'), ('España, un país', 'Españistán, un país'), ('España funciona', 'Españistán funciona'),
            ('Españistan', 'Españistán'), ('Hazla cuenta', 'Haz la cuenta'), ('conjurado', 'con jurado'), ('juvenal', 'Juvenal'),
            ('qué votes', 'que votes'), ('1,221', '1.221'), ('1,191', '1.191'), ('1,176', '1.176'), ('1,763,000 millones', '1,763 billones'), ('decano', 'Decano'), ('Ese paro', 'Ese paro')]

def arregla(t):
    for a, b in ARREGLOS: t = t.replace(a, b)
    return t

def subtitulos(frases):
    """Cada frase → trozos de dos líneas como máximo, repartidos por letras dentro de su tiempo."""
    out = []
    for a, b, tx in frases:
        filas = lineas(arregla(tx)); grupos = [filas[k:k + 2] for k in range(0, len(filas), 2)]
        total = sum(len(' '.join(g)) for g in grupos); t = a
        for g in grupos:
            d = (b - a) * len(' '.join(g)) / total; out.append((t, t + d, g)); t += d
    return out

def hacer(nombre, ep, desde, hasta, gancho):
    video, trans, alto = EPISODIOS[ep]; segs = json.load(open(trans))
    frases = [(s['a'], s['b'], s['t']) for s in segs if desde - .05 <= s['a'] <= hasta + .05]
    t0, t1 = frases[0][0] - .3, frases[-1][1] + .8
    f = [f'[0:v]crop=iw:ih*{alto}:0:0,split[a][b]', '[a]scale=270:480:force_original_aspect_ratio=increase,crop=270:480,boxblur=7:2,eq=brightness=-0.22,scale=1080:1920[bg]',  # desenfocar en pequeño: mucho más rápido
         '[b]scale=1080:-2[fg]', '[bg][fg]overlay=0:(1080-h)/2+400[v0]']
    dt = lambda txt, size, color, y, extra='': f"drawtext=fontfile={FUENTE}:textfile={texto(txt)}:expansion=none:fontsize={size}:fontcolor={color}:borderw={size // 9}:bordercolor=black:x=(w-tw)/2:y={y}{extra}"
    capas = [dt(l, 120, '0xFFD400', 190 + 140 * k) for k, l in enumerate(gancho)]
    for a, b, g in subtitulos([(a - t0, b - t0, tx) for a, b, tx in frases]):
        en = f":enable='between(t,{a:.2f},{b:.2f})'"
        capas += [dt(l.upper(), 78, 'white', 1260 + 100 * k, en) for k, l in enumerate(g)]
    capas.append(dt('CAPÍTULO ENTERO EN EL CANAL', 54, '0xFFD400', 1700))
    f.append('[v0]' + ','.join(capas) + '[v]')
    os.makedirs('out/shorts', exist_ok=True); salida = f'out/shorts/{nombre}.mp4'
    # imagen y sonido por separado: con el audio en el mismo paso, el ep. 1 se atasca en el fotograma 0
    solo, sonido = f'out/shorts/{nombre}.v.mp4', f'out/shorts/{nombre}.a.m4a'
    ff = ['ffmpeg', '-nostdin', '-y', '-v', 'error', '-ss', f'{t0:.3f}', '-t', f'{t1 - t0:.3f}', '-i', video]
    subprocess.run(ff + ['-filter_complex', ';'.join(f), '-map', '[v]', '-an', '-c:v', 'libx264', '-crf', '19', '-pix_fmt', 'yuv420p', '-r', '30', solo], check=True)
    # el sonido sale de un WAV del episodio entero si existe (out/espanistan-01-audio.wav): del mp4 del ep. 1 ffmpeg se atasca
    wav = f'out/espanistan-{ep[2:]}-audio.wav'; fuente = wav if os.path.exists(wav) else video
    subprocess.run(['ffmpeg', '-nostdin', '-y', '-v', 'error', '-ss', f'{t0:.3f}', '-t', f'{t1 - t0:.3f}', '-i', fuente, '-vn', '-c:a', 'aac', '-b:a', '192k', sonido], check=True)
    subprocess.run(['ffmpeg', '-nostdin', '-y', '-v', 'error', '-i', solo, '-i', sonido, '-c', 'copy', '-shortest', '-movflags', '+faststart', salida], check=True)
    os.remove(solo); os.remove(sonido)
    print(f'hecho {salida}: {t1 - t0:.1f} s ({int(t0 // 60)}:{t0 % 60:04.1f} del {ep})')

if __name__ == '__main__':
    pedidos = sys.argv[1:]
    for s in SHORTS:
        if not pedidos or s[0] in pedidos: hacer(*s)
