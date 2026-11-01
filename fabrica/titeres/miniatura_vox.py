"""Miniatura Vox: foto real de Abascal (Commons CC0, recortada con fabrica/herramientas/recorte.swift) sobre verde Vox,
foto real con Orbán (Commons CC0, 2-6-2023) de prueba, cifra en grande y banda.
Uso: python3 fabrica/titeres/miniatura_vox.py   → out/miniatura-vox.jpg
"""
import math, sys
sys.path.insert(0, 'fabrica/titeres')
import miniatura_gemini as mg
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

IMPACT = '/System/Library/Fonts/Supplemental/Impact.ttf'
AMARILLO, ROJO, VERDE, BLANCO, NEGRO = '#FFD400', '#E3161B', '#5BC035', 'white', 'black'

def texto(d, xy, t, tam, color, borde=10):
    f = ImageFont.truetype(IMPACT, tam)
    d.text((xy[0] + 8, xy[1] + 8), t, font=f, fill=(0, 0, 0, 150), stroke_width=borde, stroke_fill=(0, 0, 0, 150))
    d.text(xy, t, font=f, fill=color, stroke_width=borde, stroke_fill=NEGRO)

def fondo():
    im = Image.new('RGBA', (1280, 720), VERDE); d = ImageDraw.Draw(im); cx, cy = 300, 330
    for i in range(28):
        a0, a1 = 2 * math.pi * i / 28, 2 * math.pi * (i + .5) / 28
        d.polygon([(cx, cy), (cx + 2000 * math.cos(a0), cy + 2000 * math.sin(a0)), (cx + 2000 * math.cos(a1), cy + 2000 * math.sin(a1))], fill='#4AA82A')
    v = Image.new('L', (1280, 720)); ImageDraw.Draw(v).ellipse([-300, -400, 1580, 1120], fill=255)   # viñeta
    oscuro = Image.new('RGBA', (1280, 720), (10, 50, 10, 255)); oscuro.putalpha(ImageChops.invert(v.filter(ImageFilter.GaussianBlur(120))))
    im.alpha_composite(oscuro); return im

def abascal(alto=800, cx=300, y=-10):
    fig = Image.open('out/fotos-reales/abascal-2026-recorte.png').convert('RGBA'); fig = fig.crop(fig.getchannel('A').getbbox())
    k = alto / fig.height; fig = fig.resize((round(fig.width * k), alto), Image.LANCZOS); a = fig.getchannel('A')
    capa = Image.new('RGBA', (1280, 720)); x = cx - fig.width // 2
    sombra = Image.new('RGBA', fig.size, (0, 0, 0, 0)); sombra.putalpha(a.point(lambda v: v * .5).filter(ImageFilter.GaussianBlur(16)))
    borde = Image.new('RGBA', fig.size, (255, 255, 255, 0)); borde.putalpha(a.filter(ImageFilter.MaxFilter(13)))
    capa.alpha_composite(sombra, (x + 18, y + 14)); capa.alpha_composite(borde, (x, y)); capa.alpha_composite(fig, (x, y)); return capa

def prueba(caja=(650, 250, 1450, 780), ancho=440, giro=4):
    f = Image.open('out/fotos-reales/abascal-orban-2023.jpg').convert('RGB').crop(caja)
    f = f.resize((ancho, round(ancho * f.height / f.width)), Image.LANCZOS)
    marco = Image.new('RGBA', (f.width + 20, f.height + 20), BLANCO); marco.paste(f, (10, 10))
    return marco.rotate(giro, expand=True, resample=Image.BICUBIC)

def hacer():
    im = fondo(); im.alpha_composite(abascal())
    p = prueba(); px, py = 790, 255
    sombra = Image.new('RGBA', p.size, (0, 0, 0, 0)); sombra.putalpha(p.getchannel('A').point(lambda v: v * .55).filter(ImageFilter.GaussianBlur(12)))
    im.alpha_composite(sombra, (px + 14, py + 14)); im.alpha_composite(p, (px, py))
    mg.PERSONAJE = (700, 640); el = Image.new('RGBA', im.size); el.alpha_composite(mg.elegido().crop((450, 0, 950, 720)), (450, 145)); im.alpha_composite(el)   # el Elegido, nuestro personaje
    capa = Image.new('RGBA', im.size); d = ImageDraw.Draw(capa)
    texto(d, (590, -5), '6,5 MILLONES', 132, AMARILLO)
    texto(d, (600, 140), 'DE UN BANCO HÚNGARO', 66, BLANCO, 8)
    for t, cx, y, fondo_ in [('ORBÁN', 1125, 345, ROJO)]:
        f = ImageFont.truetype(IMPACT, 46); b = d.textbbox((0, 0), t, font=f); w = b[2] - b[0] + 30
        d.rounded_rectangle([cx - w / 2, y, cx + w / 2, y + 60], 12, fill=fondo_, outline=BLANCO, width=4)
        d.text((cx - w / 2 + 15, y + 7 - b[1]), t, font=f, fill=BLANCO)
    t = '¿QUÉ LE DEBE VOX A ORBÁN?'; f = ImageFont.truetype(IMPACT, 76); b = d.textbbox((0, 0), t, font=f)
    w = b[2] - b[0] + 50; x = 1270 - w; y = 616
    d.rectangle([x, y, x + w, y + 96], fill=ROJO, outline=NEGRO, width=6); d.text((x + 25, y + 10 - b[1]), t, font=f, fill=BLANCO)
    Image.alpha_composite(im, capa).convert('RGB').save('out/miniatura-vox.jpg', quality=93); print('hecho out/miniatura-vox.jpg')

hacer()
