# Trazos: saca las líneas de tinta de un dibujo para que en el vídeo «se dibuje solo» (estilo cuento ilustrado).
# Uso: /home/user/ad/bin/python -I trazos.py DIBUJO SALIDA.json [--mascara MASCARA.png] [--umbral 70] [--max 900]
# Salida: {"tam": [w, h], "trazos": [{"d": "M x y L …", "l": longitud}, …]} ordenados de arriba a abajo y de grandes a pequeños,
#         que es como dibuja una persona: primero el contorno, luego el detalle.
import json, sys, argparse
import cv2, numpy as np

ap = argparse.ArgumentParser(); ap.add_argument('dibujo'); ap.add_argument('salida')
ap.add_argument('--mascara'); ap.add_argument('--umbral', type=int, default=70); ap.add_argument('--max', type=int, default=900); ap.add_argument('--bordes', action='store_true')  # dibujos con zonas oscuras: líneas por cambio de color
a = ap.parse_args()
im = cv2.imread(a.dibujo, cv2.IMREAD_UNCHANGED)
gris = cv2.cvtColor(im[..., :3], cv2.COLOR_BGR2GRAY)
tinta = (gris < a.umbral).astype(np.uint8) * 255                      # la tinta del dibujo es lo más oscuro
if a.bordes: tinta = cv2.dilate(cv2.Canny(cv2.GaussianBlur(gris, (3, 3), 0), 60, 160), np.ones((2, 2), np.uint8))
if a.mascara:
    m = cv2.imread(a.mascara, cv2.IMREAD_UNCHANGED); m = m[..., 3] if m.ndim == 3 and m.shape[2] == 4 else (m if m.ndim == 2 else m[..., 0])
    tinta &= (m > 128).astype(np.uint8) * 255
elif im.ndim == 3 and im.shape[2] == 4:
    tinta &= (im[..., 3] > 128).astype(np.uint8) * 255
tinta = cv2.morphologyEx(tinta, cv2.MORPH_OPEN, np.ones((2, 2), np.uint8))
cont, _ = cv2.findContours(tinta, cv2.RETR_LIST, cv2.CHAIN_APPROX_NONE)
trazos = []
for c in cont:
    l = cv2.arcLength(c, True)
    if l < 25: continue
    p = cv2.approxPolyDP(c, 1.0, True)[:, 0, :]
    trazos.append((l, p))
trazos.sort(key=lambda x: -x[0]); trazos = trazos[:a.max]
trazos.sort(key=lambda x: (int(x[1][:, 1].min() // 120), int(x[1][:, 0].min())))   # por franjas, de arriba a abajo
out = [{'d': 'M' + ' L'.join(f'{x} {y}' for x, y in p) + ' Z', 'l': round(l, 1)} for l, p in trazos]
json.dump({'tam': [int(im.shape[1]), int(im.shape[0])], 'trazos': out}, open(a.salida, 'w'), separators=(',', ':'))
print(f'{len(out)} trazos, {sum(len(t["d"]) for t in out) // 1024} KB')
