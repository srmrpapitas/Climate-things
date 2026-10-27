# Renombra las piezas que sacó «sombras.py --auto» (p1, p2_c…) para usarlas por su nombre en hacer_escenas.py.
# Uso: python3 renombra_piezas.py CARPETA '{"p3": "jinete", "p5": "publico:grupo"}'
#   "nombre:tipo" cambia también el tipo (figura|grupo|objeto|brazo|baston|iconos). Las piezas que no se nombran se quedan como están.
#   La cabeza «pN_c» sigue a su cuerpo: pasa a llamarse «nombre_c».
import json, os, sys

D, mapa = sys.argv[1], json.loads(sys.argv[2])
P = json.load(open(f'{D}/piezas.json')); nuevo, nombres = {}, {}
for k in P:
    base = k[:-2] if k.endswith('_c') else k
    if base not in mapa: nombres[k] = k; continue
    n = mapa[base].split(':')[0]
    nombres[k] = n + '_c' if k.endswith('_c') else n
for k, q in P.items():
    n = nombres[k]
    base = k[:-2] if k.endswith('_c') else k
    if not k.endswith('_c') and base in mapa and ':' in mapa[base]: q['tipo'] = mapa[base].split(':')[1]
    if 'padre' in q: q['padre'] = nombres[q['padre']]
    if n != k: os.rename(f'{D}/{k}.png', f'{D}/{n}.png.tmp')
    nuevo[n] = q
for n in nuevo:
    if os.path.exists(f'{D}/{n}.png.tmp'): os.rename(f'{D}/{n}.png.tmp', f'{D}/{n}.png')
json.dump(nuevo, open(f'{D}/piezas.json', 'w'), indent=1)
print(' '.join(sorted(nuevo)))
