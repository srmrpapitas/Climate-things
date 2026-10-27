# Pergamino: pone la textura de pergamino manchado y la viñeta encima de un escenario de FLUX (que sale con un degradado naranja liso).
# Uso: /home/user/qw/bin/python -I pergamino.py ESCENA_FLUX.png SALIDA.webp [--ancho 2560]
#   La silueta se queda negra, lo claro toma el pergamino y se oscurecen los bordes (truco de CAPITULO-SIGUIENTE.md).
#   El pergamino limpio se crea una sola vez (ruido + manchas, semilla fija) en historias/espanistan/sombras/pergamino.png.
import argparse, os
import cv2, numpy as np

ap = argparse.ArgumentParser(); ap.add_argument('entrada'); ap.add_argument('salida'); ap.add_argument('--ancho', type=int, default=2560)
a = ap.parse_args()
REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')); PERG = os.path.join(REPO, 'historias/espanistan/sombras/pergamino.png')
W, H = a.ancho, a.ancho * 9 // 16

def crea_pergamino(w, h):
    r = np.random.default_rng(11); t = np.zeros((h, w), np.float32)
    for esc, peso in ((4, .5), (16, .25), (64, .15), (256, .1)):           # ruido a varias escalas = fibras y nubes del papel
        n = r.random((max(2, h // esc), max(2, w // esc))).astype(np.float32)
        t += cv2.resize(n, (w, h), interpolation=cv2.INTER_CUBIC) * peso
    for _ in range(40):                                                     # manchas de humedad
        cx, cy, rad = r.integers(0, w), r.integers(0, h), r.integers(w // 40, w // 8)
        m = np.zeros((h, w), np.float32); cv2.circle(m, (int(cx), int(cy)), int(rad), 1, -1)
        t -= cv2.GaussianBlur(m, (0, 0), rad / 2) * r.uniform(.04, .12)
    t = (t - t.min()) / (t.max() - t.min())
    base = np.array([60, 150, 225], np.float32) / 255                         # ámbar (BGR) a la luz del candil
    img = base[None, None, :] * (.72 + .38 * t[..., None])
    return np.clip(img * 255, 0, 255).astype(np.uint8)

if not os.path.exists(PERG): cv2.imwrite(PERG, crea_pergamino(2560, 1440))
perg = cv2.resize(cv2.imread(PERG), (W, H)).astype(np.float32) / 255
im = cv2.resize(cv2.imread(a.entrada), (W, H), interpolation=cv2.INTER_CUBIC)
gris = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY).astype(np.float32) / 255
alto = max(float(np.percentile(gris, 92)), .3)                                # el naranja de FLUX es oscuro: lo claro pasa a 1
luz = np.clip((gris - .12) / (alto - .12), 0, 1)[..., None]
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32); d = np.sqrt(((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2)
vin = np.clip(1.15 - .55 * d ** 2, .25, 1)[..., None]
res = np.clip(perg * luz * 1.05 * vin * 255, 0, 255).astype(np.uint8)
cv2.imwrite(a.salida, res, [cv2.IMWRITE_WEBP_QUALITY, 90])
print('ok', a.salida)
