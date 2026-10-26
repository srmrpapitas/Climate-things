# Marioneta: corta un personaje dibujado sobre fondo liso en capas para animarlo en HyperFrames.
# Uso: python3 marioneta.py CONFIG.json
# CONFIG: {"imagen", "salida", "fondo": [r,g,b], "tolerancia", "piezas": {nombre: {"poligono": [[x,y],...],
#          "pivote": [x,y], "relleno": {"poligono", "color"} (opcional: tapa el hueco que deja la pieza sobre el cuerpo)}},
#          "cara": {"ojos": [[x,y,rx,ry],...], "boca": [x,y,ancho], "piel": [r,g,b]}}
# Salida: SALIDA/cuerpo.webp + SALIDA/<pieza>.webp (lienzo completo, transparentes) y SALIDA/marioneta.json con pivotes y cara.
import json, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

cfg = json.load(open(sys.argv[1], encoding='utf-8'))
base = os.path.dirname(os.path.abspath(sys.argv[1]))
im = Image.open(os.path.join(base, cfg['imagen'])).convert('RGBA')
W, H = im.size
px = np.asarray(im).astype(np.int16)

# fondo: relleno por inundación desde los bordes con los píxeles parecidos al color de fondo
lejos = np.abs(px[..., :3] - np.array(cfg['fondo'])).sum(-1) > cfg.get('tolerancia', 30)
fondo = np.zeros((H, W), bool)
pila = [(x, y) for x in range(W) for y in (0, H - 1)] + [(x, y) for y in range(H) for x in (0, W - 1)]
while pila:
    x, y = pila.pop()
    if 0 <= x < W and 0 <= y < H and not fondo[y, x] and not lejos[y, x]:
        fondo[y, x] = True
        pila += [(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)]
alfa = Image.fromarray(np.where(fondo, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(.8))
figura = im.copy(); figura.putalpha(alfa)

out = os.path.join(base, cfg['salida']); os.makedirs(out, exist_ok=True)
cuerpo = figura.copy(); meta = {'tam': [W, H], 'piezas': {}, 'cara': cfg.get('cara')}
for nombre, p in cfg['piezas'].items():
    m = Image.new('L', (W, H), 0); ImageDraw.Draw(m).polygon([tuple(v) for v in p['poligono']], fill=255)
    m = m.filter(ImageFilter.GaussianBlur(.6))
    pieza = figura.copy(); pieza.putalpha(Image.fromarray(np.minimum(np.asarray(figura.getchannel('A')), np.asarray(m))))
    pieza.save(f'{out}/{nombre}.webp', lossless=True)
    # en el cuerpo la pieza se borra; si tapaba otra parte del personaje, ese hueco se pinta con el relleno
    c = np.asarray(cuerpo).copy(); c[np.asarray(m) > 128, 3] = 0
    if p.get('relleno'):
        r = Image.new('L', (W, H), 0); ImageDraw.Draw(r).polygon([tuple(v) for v in p['relleno']['poligono']], fill=255)
        dentro = np.asarray(r) > 128
        c[dentro, :3] = p['relleno']['color']; c[dentro, 3] = 255
    cuerpo = Image.fromarray(c)
    meta['piezas'][nombre] = {'pivote': p['pivote']}
cuerpo.save(f'{out}/cuerpo.webp', lossless=True)
json.dump(meta, open(f'{out}/marioneta.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('ok', out, list(meta['piezas']))
