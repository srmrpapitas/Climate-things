"""Voz del narrador frase a frase con tiempos por palabra (ElevenLabs /with-timestamps), para los vídeos explicados en vertical.

Uso (desde fabrica/explicado): python3 voz.py SLUG [--estimar] [--voz ID]
  guion_SLUG.tsv: «escena<TAB>frase». *palabra* = clave (recuadro en el subtítulo); {voz|pantalla} = lo que dice la voz y lo que se lee.
  Con --estimar no gasta: reparte cada frase a 14 letras/s, para animar antes de tener la voz.
  Deja ../../audio/voz/es/SLUG/NN.mp3 + NN.json y escenas/tiempos_SLUG.js (window.TIEMPOS).
"""
import base64, json, os, re, subprocess, sys

VOZ = "851ejYcv2BoNPjrkw93G"   # Tony «Your Casual Voice»: cercano, elegido por el usuario el 29-10-2026 (más amigable que Gabo)
MODELO = "eleven_v4"
PAUSA = 0.18                   # entre frases: corto, ritmo de vídeo vertical
LPS = 14.0

def fichas(frase):
    """[(voz, pantalla, clave)] por palabra de pantalla; voz puede ser varias palabras."""
    out = []
    frase = re.sub(r"\}\*([.,:;?!]+)", r"}\1*", frase)   # *{a|b}*, → *{a|b},*
    for m in re.finditer(r"(\*?)(\{[^}]*\}[.,:;?!]*|[^\s{]+)(\*?)", frase):
        a, cuerpo, b = m.groups()
        clave = bool(a or b) or cuerpo.endswith('*')
        cuerpo = cuerpo.strip('*')
        if cuerpo.startswith('{'):
            cola = cuerpo[cuerpo.rindex('}') + 1:]
            voz, pant = cuerpo[1:cuerpo.rindex('}')].split('|'); voz += cola; pant += cola
        else:
            voz = pant = cuerpo
        out.append([voz, pant, clave])
    # una clave de varias palabras (*Emergence World*): marcar las de en medio
    abierta = False
    frase = re.sub(r"\}\*([.,:;?!]+)", r"}\1*", frase)
    for f, m in zip(out, re.finditer(r"(\*?)(\{[^}]*\}[.,:;?!]*|[^\s{]+)(\*?)", frase)):
        tok = m.group(0)
        if tok.startswith('*') and not tok.rstrip('.,:;?!').endswith('*'): abierta = True; f[2] = True
        elif abierta: f[2] = True; abierta = not tok.rstrip('.,:;?!').endswith('*')
    for f in out: f[1] = f[1].replace('*', '')
    return out

def texto_voz(fs): return ' '.join(re.sub(r"[{}*]", '', v) for v, _, _ in fs)

def tiempos_estimados(fs):
    t, pal = 0.15, []
    for voz, pant, clave in fs:
        d = len(voz) / LPS + .04
        pal.append([pant, round(t, 3), round(t + d, 3), clave]); t += d + .03
    return pal, round(t + .1, 3)

def tiempos_reales(fs, al):
    chars, ini, fin = al['characters'], al['character_start_times_seconds'], al['character_end_times_seconds']
    texto, pos, pal = ''.join(chars), 0, []
    for voz, pant, clave in fs:
        voz = re.sub(r"[*{}]", '', voz)
        i = texto.index(voz.split()[0], pos); j = texto.index(voz.split()[-1], i) + len(voz.split()[-1]) - 1
        pal.append([pant, round(ini[i], 3), round(fin[j], 3), clave]); pos = j + 1
    return pal

def generar(texto, destino, antes, despues, voz):
    clave = open(os.path.expanduser("~/.elevenlabs_key")).read().strip()
    cuerpo = {"text": texto, "model_id": MODELO, "language_code": "es", "previous_text": antes, "next_text": despues}
    r = subprocess.run(["curl", "-sS", "--fail-with-body", "-K", "-", "-H", "Content-Type: application/json", "--data-binary", json.dumps(cuerpo),
                        f"https://api.elevenlabs.io/v1/text-to-speech/{voz}/with-timestamps?output_format=mp3_44100_128"],
                       input=f'header = "xi-api-key: {clave}"\n', text=True, capture_output=True)
    if r.returncode: sys.exit(f"ElevenLabs falló en «{texto}»: {r.stdout[:300]} {r.stderr[:200]}")
    j = json.loads(r.stdout)
    open(destino + '.mp3', 'wb').write(base64.b64decode(j['audio_base64']))
    json.dump(j['alignment'], open(destino + '.json', 'w'))

def dura(a):
    """Hasta donde acaba la voz: se descuenta el silencio del final (sin tocar la velocidad); el audio entero se mezcla igual."""
    total = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', a], capture_output=True, text=True).stdout)
    r = subprocess.run(['ffmpeg', '-i', a, '-af', 'silencedetect=n=-40dB:d=0.08', '-f', 'null', '-'], capture_output=True, text=True).stderr
    ini, fin = re.findall(r'silence_start: ([0-9.]+)', r), re.findall(r'silence_end: ([0-9.]+)', r)
    if ini and len(ini) > len(fin) or (fin and float(fin[-1]) >= total - .02):
        return min(total, float(ini[-1]) + .1)
    return total

def dura_total(a):
    return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', a], capture_output=True, text=True).stdout)

def generar_id(texto, destino, previas, voz):
    """Como generar, pero encadena la entonación con los bloques anteriores (previous_request_ids) y devuelve el id."""
    clave = open(os.path.expanduser("~/.elevenlabs_key")).read().strip()
    cuerpo = {"text": texto, "model_id": MODELO, "language_code": "es", "previous_request_ids": previas[-3:]}
    r = subprocess.run(["curl", "-sS", "--fail-with-body", "-K", "-", "-D", destino + ".cab", "-H", "Content-Type: application/json", "--data-binary", json.dumps(cuerpo),
                        f"https://api.elevenlabs.io/v1/text-to-speech/{voz}/with-timestamps?output_format=mp3_44100_128"],
                       input=f'header = "xi-api-key: {clave}"\n', text=True, capture_output=True)
    if r.returncode: sys.exit(f"ElevenLabs falló en «{texto[:60]}»: {r.stdout[:300]} {r.stderr[:200]}")
    j = json.loads(r.stdout)
    open(destino + '.mp3', 'wb').write(base64.b64decode(j['audio_base64'])); json.dump(j['alignment'], open(destino + '.json', 'w'))
    rid = re.search(r"(?im)^request-id:\s*(\S+)", open(destino + ".cab").read()); os.remove(destino + ".cab")
    open(destino + '.id', 'w').write(rid.group(1) if rid else '')

if __name__ == '__main__':
    # Por bloques (una escena = una llamada): la voz sale seguida, con su entonación y sus pausas naturales en comas y puntos.
    slug = sys.argv[1]
    voz = sys.argv[sys.argv.index('--voz') + 1] if '--voz' in sys.argv else VOZ
    lineas = [l.rstrip('\n').split('\t') for l in open(f'guion_{slug}.tsv', encoding='utf-8') if l.strip()]
    carpeta = f'../../audio/voz/es/{slug}'; os.makedirs(carpeta, exist_ok=True)
    bloques = []
    for n, (escena, frase) in enumerate(lineas, 1):
        if not bloques or bloques[-1][0] != escena: bloques.append([escena, []])
        bloques[-1][1].append((n, fichas(frase)))
    frases, audios, t, previas = [], [], 0.3, []
    for k, (escena, ls) in enumerate(bloques, 1):
        base = f'{carpeta}/b{k:02d}_{escena}'
        todas = [f for _, fs in ls for f in fs]
        if not os.path.exists(base + '.mp3'):
            generar_id(texto_voz(todas), base, previas, voz); print('voz bloque', k, escena)
        previas.append(open(base + '.id').read().strip()) if os.path.exists(base + '.id') else None
        pal = tiempos_reales(todas, json.load(open(base + '.json'))); d = dura(base + '.mp3')
        audios.append({'en': round(t, 3), 'archivo': f'audio/voz/es/{slug}/b{k:02d}_{escena}.mp3'})
        i = 0
        for n, fs in ls:
            p = pal[i:i + len(fs)]; i += len(fs)
            frases.append({'n': n, 'escena': escena, 'en': round(t + p[0][1], 3), 'dura': round(p[-1][2] - p[0][1], 3),
                           'palabras': [[w, round(t + a, 3), round(t + b, 3), c] for w, a, b, c in p]})
        t += d + .35
    with open(f'escenas/tiempos_{slug}.js', 'w', encoding='utf-8') as s:
        s.write(f'// Generado por voz.py {slug} (por bloques).\nwindow.TIEMPOS = ' + json.dumps({'frases': frases, 'audios': audios, 'fin': round(t, 3)}, ensure_ascii=False) + ';\n')
    print(f'{len(bloques)} bloques, {len(frases)} frases, {t:.1f} s')
