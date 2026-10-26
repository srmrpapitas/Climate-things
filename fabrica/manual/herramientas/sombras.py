# Sombras: recorta las siluetas de una escena de teatro de sombras en piezas que se pueden mover (marionetas) y rellena el fondo.
# Uso: /home/user/ad/bin/python -I sombras.py ESCENA.png PIEZAS.json CARPETA_SALIDA [--ancho 1920]
# PIEZAS.json: {"umbral": 60, "piezas": [{"nombre": "decano", "poli": [[x, y], …]}, …]} en coordenadas del ancho de salida.
#   "separar": true parte la pieza en sus manchas sueltas (nombre_1, nombre_2…). Cada pieza se queda con los píxeles oscuros (silueta) dentro de su polígono. El orden importa: una pieza no coge lo que ya cogió otra.
# Salida: fondo.jpg (sin las siluetas, rellenado) y NOMBRE.png (recorte con transparencia) + piezas.json con la caja de cada una.
import json, os, argparse
import cv2, numpy as np

ap = argparse.ArgumentParser(); ap.add_argument('escena'); ap.add_argument('piezas'); ap.add_argument('salida'); ap.add_argument('--ancho', type=int, default=1920)
a = ap.parse_args(); os.makedirs(a.salida, exist_ok=True)
im = cv2.imread(a.escena); h = round(im.shape[0] * a.ancho / im.shape[1]); im = cv2.resize(im, (a.ancho, h), interpolation=cv2.INTER_AREA)
cfg = json.load(open(a.piezas)); gris = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
oscuro = (gris < cfg.get('umbral', 60)).astype(np.uint8) * 255
usado = np.zeros_like(oscuro); hueco = np.zeros_like(oscuro); cajas = {}
for p in cfg['piezas']:
    zona = np.zeros_like(oscuro); cv2.fillPoly(zona, [np.array(p['poli'], np.int32)], 255)
    m = cv2.bitwise_and(oscuro, zona); m[usado > 0] = 0
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
    m = cv2.dilate(m, np.ones((3, 3), np.uint8)) & zona                    # un poco de borde para no dejar halo claro
    usado |= m; hueco |= cv2.dilate(m, np.ones((7, 7), np.uint8))
    trozos = [m]
    if p.get('separar'):                                                  # cada mancha suelta, su pieza (p. ej. una cabeza por persona)
        n, lab, st, _ = cv2.connectedComponentsWithStats(m)
        orden = sorted((i for i in range(1, n) if st[i, 4] > 150), key=lambda i: st[i, 0])
        trozos = [((lab == i) * 255).astype(np.uint8) for i in orden]
    for j, t in enumerate(trozos):
        nom = p['nombre'] + (f'_{j + 1}' if p.get('separar') else '')
        x, y, w, hh = cv2.boundingRect(t); alfa = cv2.GaussianBlur(t, (3, 3), 0)
        cv2.imwrite(f"{a.salida}/{nom}.png", np.dstack([im, alfa])[y:y + hh, x:x + w]); cajas[nom] = [x, y, w, hh]
# relleno por «convolución normalizada»: media borrosa solo de los píxeles claros, para que la tinta del suelo no manche el telón
claro = (gris >= cfg.get('umbral', 60)).astype(np.float32); claro[hueco > 0] = 0
fondo = im.astype(np.float32)
for k in (31, 81, 201):                                                  # de cerca a lejos, hasta tapar los huecos grandes
    num = cv2.GaussianBlur(fondo * claro[..., None], (0, 0), k / 3); den = cv2.GaussianBlur(claro, (0, 0), k / 3)[..., None]
    rel = num / np.maximum(den, 1e-4); falta = ((claro == 0) & (hueco > 0))[..., None] & (den > .02)   # solo donde había una pieza
    fondo = np.where(falta, rel, fondo); claro = np.maximum(claro, (den[..., 0] > .02).astype(np.float32))
fondo = np.clip(fondo, 0, 255).astype(np.uint8)
cv2.imwrite(f'{a.salida}/fondo.jpg', fondo, [cv2.IMWRITE_JPEG_QUALITY, 90])
json.dump(cajas, open(f'{a.salida}/piezas.json', 'w'), indent=1); print(cajas)
