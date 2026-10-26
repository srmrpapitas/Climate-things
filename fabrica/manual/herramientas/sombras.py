# Sombras: recorta las siluetas de una escena de teatro de sombras en piezas que se pueden mover (marionetas) y rellena el fondo.
# Uso automático (lo normal):  /home/user/qw/bin/python -I sombras.py ESCENA.png --auto SALIDA
#   → cada silueta grande es una pieza «pN»; si es una figura (más alta que ancha) se le separa la cabeza por el cuello («pN_c»).
#   → SALIDA/previa.jpg dibuja las cajas con su número: mirarla para decidir qué pieza actúa en cada momento.
# Uso manual (polígonos):     /home/user/qw/bin/python -I sombras.py ESCENA.png PIEZAS.json SALIDA
#   PIEZAS.json: {"umbral": 60, "piezas": [{"nombre": "decano", "poli": [[x, y], …]}, …]} en coordenadas del ancho de salida.
#   "separar": true parte la pieza en sus manchas sueltas (nombre_1, nombre_2…). Cada pieza se queda con los píxeles oscuros
#   (silueta) dentro de su polígono. El orden importa: una pieza no coge lo que ya cogió otra.
#   Con "ref": ANCHO las piezas pueden ser "caja": [x0, y0, x1, y1] medidas en una imagen de ese ancho, con "cuello": y (separa la
#   cabeza), "pivote": [x, y] y "tipo"; la salida usa entonces el formato de --auto (lo que lee la plantilla del generador).
# Salida: fondo.jpg (sin las siluetas, rellenado), NOMBRE.png (recorte con transparencia) y piezas.json:
#   {nombre: [x, y, w, h]} (manual) o {nombre: {"caja": [x, y, w, h], "tipo": "figura|cabeza|objeto", "pivote": [x, y], "padre": …}} (auto).
import json, os, argparse
import cv2, numpy as np

ap = argparse.ArgumentParser(); ap.add_argument('escena'); ap.add_argument('piezas', nargs='?'); ap.add_argument('salida', nargs='?')
ap.add_argument('--auto'); ap.add_argument('--ancho', type=int); ap.add_argument('--umbral', type=int, default=60)
a = ap.parse_args(); SAL = a.auto or a.salida; os.makedirs(SAL, exist_ok=True)
im = cv2.imread(a.escena); W = a.ancho or (im.shape[1] if a.auto else 1920); H = round(im.shape[0] * W / im.shape[1])
im = cv2.resize(im, (W, H), interpolation=cv2.INTER_AREA); gris = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
cfg = json.load(open(a.piezas)) if a.piezas else {}; U = cfg.get('umbral', a.umbral)
oscuro = (gris < U).astype(np.uint8) * 255; hueco = np.zeros_like(oscuro); cajas = {}

def guarda(nom, m, extra=None):
    global hueco
    if not m.any(): return
    hueco |= cv2.dilate(m, np.ones((7, 7), np.uint8)); x, y, w, hh = cv2.boundingRect(m); alfa = cv2.GaussianBlur(m, (3, 3), 0)
    cv2.imwrite(f'{SAL}/{nom}.png', np.dstack([im, alfa])[y:y + hh, x:x + w]); cajas[nom] = dict(caja=[x, y, w, hh], **extra) if extra else [x, y, w, hh]

if a.auto:
    # el suelo (franja oscura de abajo) se queda en el fondo; los pies se cortan justo encima
    fil = (oscuro > 0).mean(1); filas = [y for y in range(int(H * .62), H) if fil[y] > .78]; suelo = min(filas) if filas else H
    m = oscuro.copy(); m[max(0, suelo - 2):] = 0
    n, lab, st, _ = cv2.connectedComponentsWithStats(m); k = 0
    for i in sorted(range(1, n), key=lambda i: st[i, 0]):
        x, y, w, hh, ar = st[i]
        if ar < W * H * .0012 or ar > W * H * .2: continue                          # migas y decorados enormes se quedan en el fondo
        if y <= 2 or (x <= 2 or x + w >= W - 2) and hh > H * .5: continue           # viñeta del borde
        k += 1; pm = ((lab == i) * 255).astype(np.uint8); pm = cv2.dilate(pm, np.ones((3, 3), np.uint8)) & oscuro
        if hh > 1.15 * w and hh > H * .14:                                          # figura: cabeza fuera por el punto más estrecho (cuello)
            anch = (pm[y:y + hh, x:x + w] > 0).sum(1); r0, r1 = int(hh * .1), int(hh * .35)
            cu = r0 + int(np.argmin(anch[r0:r1] + np.arange(r1 - r0) * .02 * w)); cy = y + cu
            xs = np.nonzero(pm[cy])[0]; cx = int(xs.mean()) if len(xs) else x + w // 2
            cab = pm.copy(); cab[cy:] = 0; cue = pm.copy(); cue[:cy] = 0
            guarda(f'p{k}', cue, dict(tipo='figura', pivote=[x + w // 2, y + hh]))
            if cab.any(): guarda(f'p{k}_c', cab, dict(tipo='cabeza', pivote=[cx, cy], padre=f'p{k}'))
        else: guarda(f'p{k}', pm, dict(tipo='objeto', pivote=[x + w // 2, y + hh]))
else:
    usado = np.zeros_like(oscuro)
    K = W / cfg['ref'] if 'ref' in cfg else 1                                 # "ref": ancho de la imagen en la que se midieron las cajas
    for p in cfg['piezas']:
        if 'caja' in p: x0, y0, x1, y1 = p['caja']; p['poli'] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
        zona = np.zeros_like(oscuro); cv2.fillPoly(zona, [(np.array(p['poli']) * K).astype(np.int32)], 255)
        m = cv2.bitwise_and(oscuro, zona); m[usado > 0] = 0
        m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
        m = cv2.dilate(m, np.ones((3, 3), np.uint8)) & zona                    # un poco de borde para no dejar halo claro
        usado |= m; trozos = [m]
        if p.get('separar'):                                                  # cada mancha suelta, su pieza (p. ej. una cabeza por persona)
            nn, lab, st, _ = cv2.connectedComponentsWithStats(m)
            trozos = [((lab == i) * 255).astype(np.uint8) for i in sorted((i for i in range(1, nn) if st[i, 4] > 150), key=lambda i: st[i, 0])]
        if 'ref' in cfg:                                                      # formato con tipo y pivote (como --auto)
            x, y, w, hh = cv2.boundingRect(m)
            piv = [int(v * K) for v in p['pivote']] if 'pivote' in p else [x + w // 2, y + hh]
            if 'cuello' in p:                                                 # figura: cabeza fuera por la línea del cuello
                cy = int(p['cuello'] * K); cab = m.copy(); cab[cy:] = 0; cue = m.copy(); cue[:cy] = 0
                xs = np.nonzero(m[cy])[0]; cx = int(xs.mean()) if len(xs) else x + w // 2
                guarda(p['nombre'], cue, dict(tipo='figura', pivote=piv)); guarda(p['nombre'] + '_c', cab, dict(tipo='cabeza', pivote=[cx, cy], padre=p['nombre']))
            else: guarda(p['nombre'], m, dict(tipo=p.get('tipo', 'objeto'), pivote=piv, **({'padre': p['padre']} if 'padre' in p else {})))
            continue
        for j, t in enumerate(trozos): guarda(p['nombre'] + (f'_{j + 1}' if p.get('separar') else ''), t)

# relleno por «convolución normalizada»: media borrosa solo de los píxeles claros, para que la tinta del suelo no manche el telón
claro = (gris >= U).astype(np.float32); claro[hueco > 0] = 0
fondo = im.astype(np.float32)
for k in (31, 81, 201):                                                  # de cerca a lejos, hasta tapar los huecos grandes
    num = cv2.GaussianBlur(fondo * claro[..., None], (0, 0), k / 3); den = cv2.GaussianBlur(claro, (0, 0), k / 3)[..., None]
    rel = num / np.maximum(den, 1e-4); falta = ((claro == 0) & (hueco > 0))[..., None] & (den > .02)   # solo donde había una pieza
    fondo = np.where(falta, rel, fondo); claro = np.maximum(claro, (den[..., 0] > .02).astype(np.float32))
fondo = np.clip(fondo, 0, 255).astype(np.uint8)
cv2.imwrite(f'{SAL}/fondo.jpg', fondo, [cv2.IMWRITE_JPEG_QUALITY, 90])
json.dump(cajas, open(f'{SAL}/piezas.json', 'w'), indent=1, default=int)
if a.auto or 'ref' in cfg:
    pr = im.copy()
    for nom, c in cajas.items():
        x, y, w, hh = c['caja']; col = (0, 0, 255) if c['tipo'] != 'cabeza' else (255, 120, 0)
        cv2.rectangle(pr, (x, y), (x + w, y + hh), col, 3); cv2.putText(pr, nom, (x + 4, y + 34 if c['tipo'] != 'cabeza' else y - 8), 0, 1.3, col, 3)
    cv2.imwrite(f'{SAL}/previa.jpg', cv2.resize(pr, (1280, round(1280 * H / W))), [cv2.IMWRITE_JPEG_QUALITY, 80])
print(f'{len(cajas)} piezas → {SAL}')
