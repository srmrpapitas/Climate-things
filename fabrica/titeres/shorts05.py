"""Shorts verticales del ep. 5 (vivienda), con el mismo montaje que shorts.py (fondo desenfocado, gancho, subtítulos, pie).
Los MP4 de las escenas ya no existen: los tiempos salen de out/duraciones-05.json (duraciones.mjs), de tiempos-05.js y del guion.

Uso (desde la raíz del repo):
  node fabrica/titeres/duraciones.mjs 05-gancho 05-intro 05-resta 05-tenerife 05-madrid 05-barcelona 05-leyes 05-grua 05-solucion 05-balanza outro > out/duraciones-05.json
  python3 fabrica/titeres/shorts05.py [nombre …]   → out/shorts/NOMBRE.mp4
"""
import json, os, re, sys
sys.path.insert(0, 'fabrica/titeres')
import shorts
from montar import CRUCE

shorts.CAPITULO = os.path.expanduser('~/Desktop/Espanistan-05/espanistan-05-NUEVO.mp4')
GUION = 'fabrica/herramientas/guion_espanistan-05-8min.tsv'
SHORTS = [
    ('ep5-resta', ('b2', 'ini', -.3), ('b6', 'fin', .8), ['FALTAN 750.000', 'CASAS. ¿POR QUÉ?']),
    ('ep5-tenerife', ('b7', 'ini', -.3), ('b13', 'fin', .8), ['CONTRATO FIJO', 'Y EN UNA CARAVANA']),
    ('ep5-madrid', ('b14', 'ini', -.3), ('b18', 'fin', .8), ['2.000 € AL MES', 'POR 90 METROS']),
    ('ep5-orsola', ('b19', 'ini', -.3), ('b25', 'fin', .8), ['UN FONDO COMPRÓ', 'SU EDIFICIO']),
    ('ep5-okupacion', ('b26', 'ini', -.3), ('b32', 'fin', .8), ['OKUPACIÓN:', 'LEYES ABSURDAS']),
    ('ep5-1998', ('b33', 'ini', -.3), ('b38', 'fin', .8), ['1998: LA LEY', 'QUE LO EMPEZÓ']),
    ('ep5-promesas', ('b39', 'ini', -.3), ('b43', 'fin', .8), ['270.000 PROMETIDAS', '49.000 HECHAS']),
    ('ep5-solucion', ('b44', 'ini', -.3), ('b48', 'fin', .8), ['CÓMO SE ARREGLA:', '4 COSAS A LA VEZ']),
]
# de más larga a más corta: se reemplazan en orden
shorts.CIFRAS = [
    ('dos mil trescientos cincuenta y cinco euros', '2.355 euros'), ('nueve millones y doscientos mil euros', '9,2 millones de euros'),
    ('dieciséis mil cuatrocientas veintiséis', '16.426'), ('Mil novecientos noventa y ocho', '1998'), ('sesenta y cinco mil millones', '65.000 millones'),
    ('setecientas cincuenta mil', '750.000'), ('doscientas setenta mil', '270.000'), ('doscientos cuarenta mil', '240.000'),
    ('cuarenta y nueve mil', '49.000'), ('noventa y dos mil', '92.000'), ('ciento cincuenta por ciento', '150 %'), ('cuarenta por ciento', '40 %'),
    ('veinte por ciento', '20 %'), ('dos mil veintiuno', '2021'), ('dos mil veinticuatro', '2024'), ('dos mil veinticinco', '2025'),
    ('dos mil veintiocho', '2028'), ('dos mil treinta', '2030'), ('dos mil veinte', '2020'), ('dos mil ocho', '2008'),
    ('mil trescientos euros', '1.300 euros'), ('dos mil euros', '2.000 euros'), ('diez mil pisos', '10.000 pisos'),
    ('veintiséis millones', '26 millones'), ('treinta y un años', '31 años'), ('veintinueve años', '29 años'), ('veintitrés euros', '23 euros'),
    ('noventa metros', '90 metros'), ('Cuatro de cada diez', '4 de cada 10'), ('cinco minutos', '5 minutos'), ('diez años', '10 años'),
    ('cien años', '100 años'), ('apenas el dos', 'apenas el 2 %'), ('noventa y ocho', '98'), ('treinta años', '30 años')]

def marcas():
    """{'b7': (ini, fin, [(t, d, texto, quien)])} en segundos del capítulo, con cada línea del guion en su trozo de voz."""
    s = open('fabrica/titeres/escenas/tiempos-05.js', encoding='utf-8').read(); TI = json.loads(s[s.index('{'):s.rindex('}') + 1])
    textos = {}
    for linea in open(GUION, encoding='utf-8'):
        if linea.strip(): b, t = linea.rstrip('\n').split('\t', 1); textos.setdefault(b, []).append(t)
    M, ini = {}, 0.0
    for escena in json.load(open('out/duraciones-05.json')).values():
        for v in escena['voces']:
            t = ini + v['en']
            if v['quien'] == 'narrador':
                m = re.search(r'espanistan-05-gabo/b(\d\d)\.mp3$', v['archivo'])
                if not m: continue   # intro y outro: sin subtítulo
                b = m.group(1).lstrip('0'); of = TI['s'].get(b, [0]) + [v['dura']]
                M['b' + b] = (t, t + v['dura'], [(t + of[j], of[j + 1] - of[j], tx, '') for j, tx in enumerate(textos[b])])
            else:
                M[v['texto']] = (t, t + v['dura'], [(t, v['dura'], v['texto'], v['quien'].upper() + ': ')])
        ini += escena['dura'] - CRUCE
    return M

def main():
    M = marcas(); pedidos = sys.argv[1:]
    for nombre, desde, hasta, gancho in SHORTS:
        if not pedidos or nombre in pedidos: shorts.hacer(nombre, desde, hasta, gancho, M)

if __name__ == '__main__':
    main()
