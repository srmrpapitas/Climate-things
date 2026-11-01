"""Miniaturas: escena de Gemini con la izquierda en blanco (out/miniaturas-gemini/epNN-blanco.png) + el Elegido recortado
(escenas/recorte-elegido.js, croma verde) con rayos, sombra y borde + textos en mayúsculas, banda roja y etiquetas de partido.
Uso: python3 fabrica/titeres/miniatura_gemini.py [5 6 7]   → out/miniatura-ep0N.jpg
"""
import math, sys
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

IMPACT = '/System/Library/Fonts/Supplemental/Impact.ttf'
PERSONAJE = (250, 1010)   # centro x y alto (px) del Elegido recortado
AMARILLO, ROJO, AZUL, VERDE, BLANCO, NEGRO = '#FFD400', '#E3161B', '#1F5FBF', '#2E9E3E', 'white', 'black'
# grande: (texto, x, y, tamaño, color) · banda: (texto, x, y, tamaño) · etiquetas: (texto, x centro, y, color de fondo)
MINIS = {
    4: dict(grande=[('ES TEATRO', 745, -5, 120, AMARILLO)],
            banda=('DESDE 1982 MANDAN LOS MISMOS', 15, 622, 64),
            caras=[('feijoo-brazos', 790, 110, 640), ('sanchez-manosb', 1115, 200, 530)],
            etiquetas=[('PP', 800, 470, AZUL), ('PSOE', 1150, 640, ROJO)]),
    5: dict(grande=[('VIVIENDA', 735, 0, 140, AMARILLO), ('IMPOSIBLE', 735, 150, 118, BLANCO)],
            banda=('31 AÑOS, 2 SUELDOS... Y SIN CASA', 560, 610, 70),
            caras=[('feijoo-2025', 830, 250, 520), ('sanchez-2024b', 1120, 240, 520)],
            etiquetas=[('PP', 830, 520, AZUL), ('PSOE', 1120, 520, ROJO)]),
    6: dict(grande=[('CEUTA', 760, -10, 165, AMARILLO), ('DESBORDADA', 728, 160, 98, BLANCO)],
            banda=('72.000 EN 2 DÍAS · CEUTA TIENE 83.000', 600, 625, 60),
            caras=[('feijoo-2018', 800, 300, 440), ('sanchez-hablab', 995, 380, 350), ('abascal-cpac', 1185, 290, 460)],
            etiquetas=[('PP', 800, 540, AZUL), ('PSOE', 990, 540, ROJO), ('VOX', 1180, 540, VERDE)]),
    7: dict(grande=[('TE ENSEÑAN', 740, 0, 112, AMARILLO), ('A OBEDECER', 740, 110, 112, BLANCO)],
            banda=('¿Y A PENSAR? NO', 600, 622, 76),
            caras=[('feijoo-2023', 850, 270, 480), ('sanchez-seriob', 1115, 300, 430)],
            etiquetas=[('PP', 850, 530, AZUL), ('PSOE', 1110, 530, ROJO)]),
}

def texto(d, xy, t, tam, color, borde=10):
    f = ImageFont.truetype(IMPACT, tam)
    d.text((xy[0] + 8, xy[1] + 8), t, font=f, fill=(0, 0, 0, 150), stroke_width=borde, stroke_fill=(0, 0, 0, 150))   # sombra
    d.text(xy, t, font=f, fill=color, stroke_width=borde, stroke_fill=NEGRO)

def elegido():
    """El Elegido sin el verde: alfa por croma, sin halo verde, con sombra y borde blanco; en su sitio a la izquierda."""
    fig = Image.open('out/fotos_recorte-elegido/1.5.png').convert('RGB'); r, g, b = fig.split()
    verde = ImageChops.subtract(g, ImageChops.lighter(r, b)).point(lambda v: 255 if v > 60 else v * 4)   # cuánto más verde que rojo/azul
    alfa = ImageChops.invert(verde).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(.8))
    fig = Image.merge('RGB', (r, ImageChops.darker(g, ImageChops.lighter(r, b)), b)).convert('RGBA'); fig.putalpha(alfa)
    fig = fig.crop(alfa.getbbox()); k = PERSONAJE[1] / fig.height; fig = fig.resize((round(fig.width * k), PERSONAJE[1]), Image.LANCZOS)
    lienzo = Image.new('RGBA', (1280, 720)); x, y = PERSONAJE[0] - fig.width // 2, -60
    a = fig.getchannel('A')
    sombra = Image.new('RGBA', fig.size, (0, 0, 0, 0)); sombra.putalpha(a.point(lambda v: v * .45).filter(ImageFilter.GaussianBlur(14)))
    borde = Image.new('RGBA', fig.size, (255, 255, 255, 0)); borde.putalpha(a.filter(ImageFilter.MaxFilter(13)))
    lienzo.alpha_composite(sombra, (x + 18, y + 14)); lienzo.alpha_composite(borde, (x, y)); lienzo.alpha_composite(fig, (x, y))
    return lienzo

def rayos():
    """Rayos grises suaves detrás del personaje, que se apagan antes de llegar a la escena."""
    r = Image.new('RGBA', (1280, 720)); d = ImageDraw.Draw(r); cx, cy = PERSONAJE[0], 300
    for i in range(24):
        a0, a1 = 2 * math.pi * i / 24, 2 * math.pi * (i + .5) / 24
        d.polygon([(cx, cy), (cx + 2000 * math.cos(a0), cy + 2000 * math.sin(a0)), (cx + 2000 * math.cos(a1), cy + 2000 * math.sin(a1))], fill=(225, 230, 238, 255))
    m = Image.new('L', (1280, 720)); md = ImageDraw.Draw(m)
    for x in range(1280): md.line([(x, 0), (x, 720)], fill=max(0, min(255, int(255 * (560 - x) / 200))))
    r.putalpha(ImageChops.multiply(r.getchannel('A'), m))
    halo = Image.new('L', (1280, 720)); ImageDraw.Draw(halo).ellipse([cx - 300, cy - 300, cx + 300, cy + 300], fill=200)
    dorado = Image.new('RGBA', (1280, 720), (255, 196, 40, 0)); dorado.putalpha(halo.filter(ImageFilter.GaussianBlur(90)))
    r.alpha_composite(dorado); return r

def cara(nombre, cx, y, alto):
    """Foto real recortada (out/fotos-reales/NOMBRE-recorte.png, Commons libre) con sombra y borde blanco, encima del dibujo."""
    fig = Image.open(f'out/fotos-reales/{nombre}-recorte.png').convert('RGBA'); fig = fig.crop(fig.getchannel('A').getbbox())
    fig = fig.resize((round(fig.width * alto / fig.height), alto), Image.LANCZOS); a = fig.getchannel('A')
    capa = Image.new('RGBA', (1280, 720)); x = cx - fig.width // 2
    sombra = Image.new('RGBA', fig.size, (0, 0, 0, 0)); sombra.putalpha(a.point(lambda v: v * .5).filter(ImageFilter.GaussianBlur(12)))
    borde = Image.new('RGBA', fig.size, (255, 255, 255, 0)); borde.putalpha(a.filter(ImageFilter.MaxFilter(9)))
    capa.alpha_composite(sombra, (x + 12, y + 10)); capa.alpha_composite(borde, (x, y)); capa.alpha_composite(fig, (x, y)); return capa

def hacer(ep):
    m = MINIS[ep]; im = Image.open(f'out/miniaturas-gemini/ep{ep:02d}-blanco.png').convert('RGBA').resize((1280, 720), Image.LANCZOS)
    im = Image.alpha_composite(im, rayos())
    for c in m.get('caras', []): im = Image.alpha_composite(im, cara(*c))
    im = Image.alpha_composite(im, elegido())
    capa = Image.new('RGBA', im.size); d = ImageDraw.Draw(capa)
    for t, x, y, tam, color in m['grande']: texto(d, (x, y), t, tam, color)
    t, x, y, tam = m['banda']; f = ImageFont.truetype(IMPACT, tam); b = d.textbbox((0, 0), t, font=f)
    w = b[2] - b[0] + 50; x = min(x, 1270 - w)
    d.rectangle([x, y, x + w, y + tam + 20], fill=ROJO, outline=NEGRO, width=6)
    d.text((x + 25, y + 10 - b[1]), t, font=f, fill=BLANCO)
    for t, cx, y, fondo in m['etiquetas']:
        f = ImageFont.truetype(IMPACT, 54); b = d.textbbox((0, 0), t, font=f); w = b[2] - b[0] + 34
        d.rounded_rectangle([cx - w / 2, y, cx + w / 2, y + 70], 14, fill=fondo, outline=BLANCO, width=5)
        d.text((cx - w / 2 + 17, y + 8 - b[1]), t, font=f, fill=BLANCO)
    Image.alpha_composite(im, capa).convert('RGB').save(f'out/miniatura-ep{ep:02d}.jpg', quality=93)
    print(f'hecho out/miniatura-ep{ep:02d}.jpg')

if __name__ == "__main__":
    for ep in map(int, sys.argv[1:] or MINIS): hacer(ep)
