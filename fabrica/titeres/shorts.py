"""Shorts verticales (1080×1920) sacados del capítulo montado: fondo desenfocado, el vídeo en el centro,
gancho grande arriba, subtítulos grandes del narrador y de Acascar debajo, y «capítulo entero en el canal» al pie.

Uso (desde la raíz del repo): python3 fabrica/titeres/shorts.py [nombre …]   → out/shorts/NOMBRE.mp4
Los tiempos salen solos del audio (tiempos.js, los trozos fNNN.mp3 del narrador y el orden de montar.py).
"""
import json, os, re, subprocess, sys
sys.path.insert(0, 'fabrica/herramientas'); sys.path.insert(0, 'fabrica/titeres')
from voz_frases import partir, PAUSA_TROZO, PAUSA_FRASE
from montar import SECUENCIAS, CRUCE, dura

CAPITULO = 'out/espanistan-03-animado.mp4'
GUION = 'fabrica/herramientas/guion_espanistan-03-8min.tsv'
FUENTE = '/System/Library/Fonts/Supplemental/Impact.ttf'
# (nombre, desde, hasta, gancho en dos líneas): desde/hasta = bloque ('b21', 'f2') y su borde ('ini' o 'fin') ± segundos
SHORTS = [
    ('01-caballo', ('b21', 'ini', -.3), ('f2', 'fin', .8), ['¿POR QUÉ LO ADORAN', 'LOS JÓVENES?']),
    ('02-de-0-a-68', ('b17', 'ini', -.3), ('b19', 'fin', .6), ['DE 0 A 68', 'ESCAÑOS']),
    ('03-idioma', ('b32', 'ini', -.3), ('f4', 'fin', .8), ['6,5 MILLONES DE', 'UN BANCO HÚNGARO']),
    # largos (45-80 s), cada uno con el razonamiento entero: dato → letra pequeña → pregunta del Decano. Los de arriba se quedaron cortos.
    ('ep3-origen', ('b5', 'ini', -.3), ('f1', 'fin', .8), ['AMENAZADO POR ETA', 'HOY, LÍDER DE VOX']),
    ('ep3-nace', ('b13', 'ini', -.3), ('b16', 'fin', .8), ['ASÍ NACIÓ VOX', '¿Y QUIÉN PAGÓ?']),
    ('ep3-subida', ('b17', 'ini', -.3), ('b22', 'fin', .8), ['DE 0 A 68 ESCAÑOS', '¿CÓMO LO HIZO?']),
    ('ep3-chiringuitos', ('b23', 'ini', -.3), ('b27', 'fin', .8), ['CERRAR LOS', 'CHIRINGUITOS…']),
    ('ep3-frascos-1', ('b29', 'ini', -.3), ('b36', 'fin', .8), ['LOS FRASCOS', 'DE VOX (1/2)']),
    ('ep3-frascos-2', ('b37', 'ini', -.3), ('b40', 'fin', .8), ['LOS FRASCOS', 'DE VOX (2/2)']),
    ('ep3-balanza', ('b41', 'ini', -.3), ('b49', 'fin', .8), ['MANO DURA…', '¿Y QUIÉN PAGA?']),
]
# el guion escribe los números en letra (para la voz); en pantalla, en cifras
CIFRAS = [('seis millones y medio', '6,5 millones'), ('diecinueve por ciento', '19 %'), ('dos mil dieciocho', '2018'), ('dos mil diecinueve', '2019'),
          ('dos mil veintitrés', '2023'), ('dos mil veintiséis', '2026'), ('cincuenta y dos', '52'), ('treinta y tres', '33'), ('sesenta y ocho', '68'),
          ('cuarenta y cinco', '45'), ('veinticuatro', '24'), ('doce diputados', '12 diputados')]

def tiempos():
    s = open('fabrica/titeres/escenas/tiempos.js', encoding='utf-8').read()
    return json.loads(s[s.index('{'):s.rindex('}') + 1])

def trozos(TI):
    """Cada bloque del narrador → [(inicio dentro del bloque, duración, texto)], con los trozos tal cual se grabaron."""
    out, i = {}, 0
    for linea in open(GUION, encoding='utf-8'):
        if not linea.strip(): continue
        b, frase = linea.rstrip('\n').split('\t', 1); piezas = partir(frase)
        for j, t in enumerate(piezas):
            i += 1; d = dura(f"{TI['voz']}f{i:03d}.mp3"); lista = out.setdefault(b, [])
            ini = lista[-1][0] + lista[-1][1] + lista[-1][3] if lista else 0
            lista.append([ini, d, t, PAUSA_FRASE if j == len(piezas) - 1 else PAUSA_TROZO])
    return {b: [(a, d, t) for a, d, t, _ in l] for b, l in out.items()}

def marcas(TI, TR):
    """Igual que T.guion en cada escena, desplazado a su sitio en el capítulo: {'b17': (ini, fin, [(t, d, texto, quien)])}."""
    M, ini = {}, 0.0
    for sec in SECUENCIAS:
        js = open(f'fabrica/titeres/escenas/{sec[0]}.js', encoding='utf-8').read(); m = re.search(r'T\.guion\((\[[^\]]*\])', js)
        if m:
            t = .8
            for x in json.loads(m.group(1).replace("'", '"')):
                if isinstance(x, int):
                    d = TI['b'][str(x)]; M[f'b{x}'] = (ini + t, ini + t + d, [(ini + t + a, dd, tx, '') for a, dd, tx in TR[str(x)]]); t += d + .45
                else:
                    t += .25; _, d, tx = TI['f'][x]; M[x] = (ini + t, ini + t + d, [(ini + t, d, tx, 'ACASCAR: ')]); t += d + .7
        ini += dura(f'out/{sec[0]}.mp4') - CRUCE
    return M

def cifras(t):
    for a, b in CIFRAS: t = t.replace(a, b)
    return t

def lineas(texto, ancho=24):
    filas = ['']
    for p in texto.split():
        filas[-1:] = [filas[-1] + ' ' + p] if len(filas[-1]) + len(p) < ancho else [filas[-1], p]
    return [f.strip() for f in filas if f.strip()]

def subtitulos(frases):
    """Cada frase → trozos de dos líneas como máximo, repartidos por letras dentro de su tiempo."""
    out = []
    for t, d, tx, quien in frases:
        filas = lineas(quien + cifras(tx)); grupos = [filas[k:k + 2] for k in range(0, len(filas), 2)]
        total = sum(len(' '.join(g)) for g in grupos); a = t
        for g in grupos:
            dd = d * len(' '.join(g)) / total; out.append((a, a + dd, g)); a += dd
    return out

def texto(s, n=[0]):
    """Cada texto va en su archivo (textfile): así no hay que escapar comas, dos puntos ni %."""
    # con el pid: dos renders a la vez se pisaban los textos
    n[0] += 1; ruta = f'out/shorts/txt/{os.getpid()}-{n[0]:03d}.txt'; os.makedirs('out/shorts/txt', exist_ok=True)
    open(ruta, 'w', encoding='utf-8').write(s); return ruta

def hacer(nombre, desde, hasta, gancho, M):
    t0 = M[desde[0]][0 if desde[1] == 'ini' else 1] + desde[2]; t1 = M[hasta[0]][0 if hasta[1] == 'ini' else 1] + hasta[2]
    frases = [f for k, (a, b, fr) in M.items() if a < t1 and b > t0 for f in fr if t0 - .1 <= f[0] < t1 - .5]
    f = ['[0:v]split[a][b]', '[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=28:2,eq=brightness=-0.22[bg]',
         '[b]scale=1080:-2[fg]', '[bg][fg]overlay=0:560[v0]']
    dt = lambda txt, size, color, y, extra='': f"drawtext=fontfile={FUENTE}:textfile={texto(txt)}:expansion=none:fontsize={size}:fontcolor={color}:borderw={size // 9}:bordercolor=black:x=(w-tw)/2:y={y}{extra}"
    capas = [dt(l, 120, '0xFFD400', 190 + 140 * k) for k, l in enumerate(gancho)]
    for a, b, g in subtitulos(frases):
        en = f":enable='between(t,{a - t0:.2f},{b - t0:.2f})'"
        capas += [dt(l.upper(), 78, 'white', 1260 + 100 * k, en) for k, l in enumerate(g)]
    capas.append(dt('CAPÍTULO ENTERO EN EL CANAL', 54, '0xFFD400', 1700))
    f.append('[v0]' + ','.join(capas) + '[v]')
    os.makedirs('out/shorts', exist_ok=True); salida = f'out/shorts/{nombre}.mp4'
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-ss', f'{t0:.3f}', '-t', f'{t1 - t0:.3f}', '-i', CAPITULO, '-filter_complex', ';'.join(f),
                    '-map', '[v]', '-map', '0:a', '-c:v', 'libx264', '-crf', '19', '-pix_fmt', 'yuv420p', '-r', '30', '-c:a', 'aac', '-b:a', '192k',
                    '-movflags', '+faststart', salida], check=True)
    print(f'hecho {salida}: {t1 - t0:.1f} s ({int(t0 // 60)}:{t0 % 60:04.1f} del capítulo)')

def main():
    TI = tiempos(); M = marcas(TI, trozos(TI)); pedidos = sys.argv[1:]
    for nombre, desde, hasta, gancho in SHORTS:
        if not pedidos or nombre in pedidos: hacer(nombre, desde, hasta, gancho, M)

if __name__ == '__main__':
    main()
