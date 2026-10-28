"""Narrador frase a frase, como el ep. 1: una llamada a ElevenLabs por frase ENTERA y luego se pegan por bloque.

Uso: python3 voz_frases.py GUION.tsv CARPETA [--voz ID] [--solo N] [--ver]
  GUION.tsv: «bloque<TAB>frase» por línea. Solo se parte una frase de más de 110 letras, y solo en un signo
  de puntuación (nunca a mitad de frase ni dentro de una cifra: «mil novecientos noventa | y nueve» sonó entrecortado).
  Deja CARPETA/fNNN.mp3 (un trozo cada uno) y CARPETA/bNN.mp3 (bloque pegado).
  --ver solo enseña los trozos y los créditos, sin gastar. Lo ya generado no se repite.
  La clave se lee de ~/.elevenlabs_key.
"""
import json, os, re, subprocess, sys

VOZ = "o0SveC0zgHFuCsEO3vHR"  # «Gabo - Deep, Evocative and Resonant» (biblioteca), elegida por el usuario el 28-10-2026 tras probar Mario. Nada de clones.
MODELO = "eleven_v4"  # el usuario quiere v4 (multilingual_v2 le sonaba menos pro)
AJUSTES = None  # los de la voz tal cual: forzarla (menos ronca, más lenta) la deja rara
MAXIMO, MINIMO = 110, 35  # letras por trozo
PAUSA_TROZO = 0.25   # dentro de una frase
PAUSA_FRASE = 0.85   # entre frases: aire de narrador de documental

def partir(frase):
    if len(frase) <= MAXIMO:
        return [frase]
    cortes = [m.end() for m in re.finditer(r"[,:;.?!] ", frase) if MINIMO <= m.end() <= len(frase) - MINIMO]
    if not cortes:
        return [frase]
    medio = len(frase) / 2
    c = min(cortes, key=lambda x: abs(x - medio))
    return partir(frase[:c].strip()) + partir(frase[c:].strip())

def generar(texto, antes, despues, voz, destino, previas):
    """previas: request-id de las últimas frases («request stitching» de ElevenLabs: misma entonación seguida)."""
    clave = open(os.path.expanduser("~/.elevenlabs_key")).read().strip()
    cuerpo = {"text": texto, "model_id": MODELO, "language_code": "es",
              "previous_text": antes, "next_text": despues, "previous_request_ids": previas[-3:]}
    if AJUSTES:
        cuerpo["voice_settings"] = AJUSTES
    cabeceras = destino + ".cab"
    # curl en vez de urllib: el Python de este Mac no tiene certificados
    config = f'header = "xi-api-key: {clave}"\n'
    r = subprocess.run(["curl", "-sS", "--fail-with-body", "-K", "-", "-o", destino, "-D", cabeceras,
                        "-H", "Content-Type: application/json", "--data-binary", json.dumps(cuerpo),
                        f"https://api.elevenlabs.io/v1/text-to-speech/{voz}?output_format=mp3_44100_128"],
                       input=config, text=True, capture_output=True)
    if r.returncode:
        msg = open(destino, errors="replace").read()[:300] if os.path.exists(destino) else r.stderr
        if os.path.exists(destino):
            os.remove(destino)
        sys.exit(f"ElevenLabs falló en «{texto}»: {msg}")
    rid = re.search(r"(?im)^request-id:\s*(\S+)", open(cabeceras).read())
    os.remove(cabeceras)
    return rid.group(1) if rid else None

def pegar(partes, destino):
    """partes: [(archivo, pausa_despues)]; normaliza el volumen, sin cambiar la velocidad."""
    args, filtros = [], []
    for i, (p, pausa) in enumerate(partes):
        args += ["-i", p]
        filtros.append(f"[{i}:a]aformat=sample_rates=44100:channel_layouts=mono,"
                       f"loudnorm=I=-16:TP=-1.5,apad=pad_dur={pausa}[a{i}]")
    filtros.append("".join(f"[a{i}]" for i in range(len(partes))) + f"concat=n={len(partes)}:v=0:a=1[o]")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *args, "-filter_complex", ";".join(filtros),
                    "-map", "[o]", "-ar", "44100", "-b:a", "128k", destino], check=True)

def main():
    guion, carpeta, resto = sys.argv[1], sys.argv[2], sys.argv[3:]
    opcion = lambda n: resto[resto.index(n) + 1] if n in resto else None
    voz, solo, ver = opcion("--voz") or VOZ, opcion("--solo"), "--ver" in resto
    if not voz and not ver:
        sys.exit("Falta la voz del narrador: --voz ID")
    trozos = []  # (bloque, texto, pausa_despues)
    for linea in open(guion, encoding="utf-8"):
        if not linea.strip():
            continue
        b, frase = linea.rstrip("\n").split("\t", 1)
        piezas = partir(frase)
        for j, t in enumerate(piezas):
            trozos.append((int(b), t, PAUSA_FRASE if j == len(piezas) - 1 else PAUSA_TROZO))
    if ver:
        for i, (b, t, _) in enumerate(trozos):
            print(f"f{i + 1:03d} [{b}] ({len(t)}) {t}")
        print(len(trozos), "trozos,", sum(len(t) for _, t, _ in trozos), "créditos aprox.")
        return
    os.makedirs(carpeta, exist_ok=True)
    bloques, previas = {}, []
    for i, (b, texto, pausa) in enumerate(trozos):
        if solo and b != int(solo):
            continue
        destino = os.path.join(carpeta, f"f{i + 1:03d}.mp3")
        if not os.path.exists(destino):
            antes = trozos[i - 1][1] if i > 0 else ""
            despues = trozos[i + 1][1] if i + 1 < len(trozos) else ""
            rid = generar(texto, antes, despues, voz, destino, previas)
            previas = previas + [rid] if rid else previas
            print(f"f{i + 1:03d} [{b}] {texto}", flush=True)
        bloques.setdefault(b, []).append((destino, pausa))
    for b, partes in bloques.items():
        partes[-1] = (partes[-1][0], 0)
        pegar(partes, os.path.join(carpeta, f"b{b:02d}.mp3"))
    print("hecho:", len(bloques), "bloques")

if __name__ == "__main__":
    main()
