"""Mide el audio del capítulo y escribe escenas/tiempos.js, para que cada escena cuadre con la voz.

Uso: python3 fabrica/titeres/tiempos.py [04]   (desde la raíz del repo; sin número, el ep. 3 → escenas/tiempos.js; con 04 → escenas/tiempos-04.js)
  Si aún no hay audio, estima cada trozo a 14 letras por segundo (lo que mide Gabo en el ep. 3), para animar antes de grabar la voz.
  window.TIEMPOS = { voz: carpeta del narrador, b: {bloque: segundos}, s: {bloque: [inicio de cada frase dentro del bloque]},
                     f: {frase de Acascar: [archivo, segundos, texto]} }
  En la escena: const G = T.guion([5, 6, 'f1', 7]) → G.voces (para ESCENA.voces), G.en.b6 / G['en']['b6.2'] (segunda frase) / G.en.f1, G.fin.
"""
import glob, json, os, re, subprocess, sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'herramientas'))
import voz_frases as V  # mismo reparto en trozos que al generar

EP = sys.argv[1] if len(sys.argv) > 1 else '03'
LETRAS_POR_SEGUNDO = 14.0   # Gabo, medido en el ep. 3 (5.582 letras en 399 s)
EPISODIOS = {
    '03': dict(guion='fabrica/herramientas/guion_espanistan-03-8min.tsv', voz='audio/voz/es/espanistan-03-gabo/', salida='tiempos.js', frases={
        # las cinco frases de Acascar (Leónidas), en el orden del capítulo: (archivo, texto, quien)
        'f1': ('audio/voz/es/espanistan-03-acascar/f1_sueldo', 'A mí nadie me ha regalado nada. Bueno… salvo aquel sueldo. Pero era vocación.', 'Acascar'),
        'f2': ('audio/voz/es/espanistan-03-acascar/f2_caballo', 'Los jóvenes me adoran. Será por el caballo.', 'Acascar'),
        'f3': ('audio/voz/es/espanistan-03-acascar/f3_chiringuitos', 'Hay que cerrar todos los chiringuitos. Empezando por los de los demás.', 'Acascar'),
        'f4': ('audio/voz/es/espanistan-03-acascar/f4_hungaros', 'Los bancos españoles no me querían. Los húngaros, sí. Será por el idioma.', 'Acascar'),
        'f5': ('audio/voz/es/espanistan-03-acascar/f5_manodura', 'Yo prometo mano dura. Lo de cómo se paga, ya si eso, después.', 'Acascar')}),
    '04': dict(guion='fabrica/herramientas/guion_espanistan-04-8min.tsv', voz='audio/voz/es/espanistan-04-gabo/', salida='tiempos-04.js', frases={
        'f1': ('audio/voz/es/espanistan-04-personajes/f1_sanchis', 'No es no. Hasta que es sí.', 'Sanchís'),
        'f2': ('audio/voz/es/espanistan-04-personajes/f2_feijolo', 'Que gobierne la lista más votada. Sobre todo si es la mía.', 'Feijolo')}),
    '05': dict(guion='fabrica/herramientas/guion_espanistan-05-8min.tsv', voz='audio/voz/es/espanistan-05-gabo/', salida='tiempos-05.js', frases={
        'f1': ('audio/voz/es/espanistan-05-personajes/f1_sanchis', 'Hemos anunciado más viviendas que nadie. Construirlas… ya es otro tema.', 'Sanchís'),
        'f2': ('audio/voz/es/espanistan-05-personajes/f2_feijolo', 'La solución es liberar suelo. Ya lo hicimos en el noventa y ocho. Y mira qué bien salió.', 'Feijolo')}),
    '06': dict(guion='fabrica/herramientas/guion_espanistan-06-8min.tsv', voz='audio/voz/es/espanistan-06-gabo/', salida='tiempos-06.js', frases={
        'f1': ('audio/voz/es/espanistan-06-personajes/f1_sanchis', 'Hemos regularizado a más gente que nadie. Lo de la frontera… lo vemos después.', 'Sanchís'),
        'f2': ('audio/voz/es/espanistan-06-personajes/f2_feijolo', 'Visado por puntos y cuotas cada año. Como ya hicimos en dos mil… bueno, como no hicimos.', 'Feijolo'),
        'f3': ('audio/voz/es/espanistan-06-personajes/f3_acascar', 'Devolverlos a todos. Cuántos son, cómo y con qué aviones, eso ya es otro tema.', 'Acascar')}),
    '07': dict(guion='fabrica/herramientas/guion_espanistan-07-8min.tsv', voz='audio/voz/es/espanistan-07-gabo/', salida='tiempos-07.js', frases={
        'f1': ('audio/voz/es/espanistan-07-personajes/f1_sanchis', 'O estás con la escuela pública, o estás con los que quieren venderla a trozos.', 'Sanchís'),
        'f2': ('audio/voz/es/espanistan-07-personajes/f2_feijolo', 'Ellos quieren que tus hijos pasen de curso sin estudiar. Aprobado general, como en el sesenta y ocho.', 'Feijolo'),
        'f3': ('audio/voz/es/espanistan-07-personajes/f3_acascar', 'Eso lo dicen los profesores, que son todos unos rojos. Siguiente pregunta.', 'Acascar')}),
}
E = EPISODIOS[EP]; GUION, VOZ, FRASES = E['guion'], E['voz'], E['frases']

def dura(archivo, texto=''):
    if not os.path.exists(archivo):   # sin audio todavía: estimación por letras
        return round(len(texto) / LETRAS_POR_SEGUNDO + .3, 3)
    r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', archivo], capture_output=True, text=True)
    return round(float(r.stdout), 3)

f = {k: [n + '.mp3', dura(n + '.mp3', texto), texto, quien] for k, (n, texto, quien) in FRASES.items()}
# inicio de cada trozo dentro de su bloque (los fNNN se pegan con su pausa detrás, como en voz_frases.pegar)
trozos, textos = [], {}
for linea in open(GUION, encoding='utf-8'):
    if linea.strip():
        bloque, frase = linea.rstrip('\n').split('\t', 1); piezas = V.partir(frase); textos.setdefault(int(bloque), []).extend(piezas)
        trozos += [(int(bloque), V.PAUSA_FRASE if j == len(piezas) - 1 else V.PAUSA_TROZO) for j in range(len(piezas))]
inicios, cursor, piezas = {}, {}, {}
todas = [p for k in sorted(textos) for p in textos[k]]
for i, (bloque, pausa) in enumerate(trozos):
    inicios.setdefault(bloque, []).append(round(cursor.get(bloque, 0), 3))
    d = dura(f'{VOZ}f{i + 1:03d}.mp3', todas[i]); cursor[bloque] = cursor.get(bloque, 0) + d + pausa
    # [estimado a 14 letras/s, real, pausa detrás]: G.x() pasa a segundos reales las palabras clave que se pusieron con la estimación
    piezas.setdefault(bloque, []).append([round(len(todas[i]) / LETRAS_POR_SEGUNDO + .3, 3), d, pausa])
# duración de cada bloque: la de su audio pegado (bNN.mp3) o, si no existe, la suma de sus trozos
b = {k: dura(f'{VOZ}b{k:02d}.mp3') if os.path.exists(f'{VOZ}b{k:02d}.mp3') else round(cursor[k] - V.PAUSA_FRASE, 3) for k in sorted(cursor)}
estimado = not glob.glob(VOZ + 'b*.mp3')
salida = os.path.join(os.path.dirname(__file__), 'escenas', E['salida'])
with open(salida, 'w', encoding='utf-8') as s:
    s.write(f'// Generado por fabrica/titeres/tiempos.py {EP}: duración {"ESTIMADA (aún sin audio)" if estimado else "real"} de cada bloque del narrador y de cada frase de los personajes.\n')
    s.write('window.TIEMPOS = ' + json.dumps({'voz': VOZ, 'b': b, 's': inicios, 'p': piezas, 'f': f, 'txt': textos}, ensure_ascii=False) + ';\n')
print(f'{salida}: {len(b)} bloques ({sum(b.values()):.1f} s de narrador{" ESTIMADOS" if estimado else ""}) y {len(f)} frases de personajes ({sum(v[1] for v in f.values()):.1f} s)')
