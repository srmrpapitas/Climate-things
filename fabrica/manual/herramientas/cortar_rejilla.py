# Corta una rejilla 2×2 de retratos (Seedream) en dos parejas boca cerrada/abierta y alinea la abierta con la cerrada (ECC).
# Uso: /home/user/qw/bin/python -I cortar_rejilla.py rejilla.png CARPETA  →  p1_cerrada.webp, p1_abierta.webp, p2_cerrada.webp, p2_abierta.webp (1920 de ancho)
import cv2, numpy as np, sys
im = cv2.imread(sys.argv[1]); out = sys.argv[2]; g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY); H, W = g.shape
def huecos(perfil, n):  # tramos claros (gutter) cerca del centro
    c = n // 2; zona = perfil[c - n//8:c + n//8]; idx = np.where(zona > 240)[0] + c - n//8
    return (idx.min(), idx.max()) if len(idx) else (c, c)
cx0, cx1 = huecos(g.mean(0), W); cy0, cy1 = huecos(g.mean(1), H)
print('gutters', cx0, cx1, cy0, cy1)
m = 14  # quita el marco negro
cajas = {'p1_cerrada': (m, m, cx0 - m, cy0 - m), 'p1_abierta': (cx1 + m, m, W - m, cy0 - m),
         'p2_cerrada': (m, cy1 + m, cx0 - m, H - m), 'p2_abierta': (cx1 + m, cy1 + m, W - m, H - m)}
P = {}
for k, (x0, y0, x1, y1) in cajas.items(): P[k] = im[y0:y1, x0:x1]
for p in ('p1', 'p2'):
    a, b = P[p + '_cerrada'], P[p + '_abierta']; h = min(a.shape[0], b.shape[0]); w = min(a.shape[1], b.shape[1]); a, b = a[:h, :w], b[:h, :w]
    ga, gb = [cv2.cvtColor(x, cv2.COLOR_BGR2GRAY).astype(np.float32) for x in (a, b)]
    M = np.eye(2, 3, dtype=np.float32)
    try: _, M = cv2.findTransformECC(ga, gb, M, cv2.MOTION_AFFINE, (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 200, 1e-5), None, 5)
    except cv2.error as e: print('ECC falla', p, e)
    b = cv2.warpAffine(b, M, (w, h), flags=cv2.INTER_LINEAR + cv2.WARP_INVERSE_MAP, borderMode=cv2.BORDER_REPLICATE)
    print(p, 'desplazamiento', M[:, 2])
    s = 1920 / w
    for nom, x in (('cerrada', a), ('abierta', b)):
        x = cv2.resize(x, (1920, round(h * s)), interpolation=cv2.INTER_CUBIC)
        cv2.imwrite(f'{out}/{p}_{nom}.webp', x, [cv2.IMWRITE_WEBP_QUALITY, 90])
