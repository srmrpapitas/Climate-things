# Parte 1 del SCD: voz, tiempos, planos, mezcla del audio (voz + público + samba + efectos) y comprobación de capas.
# Uso (desde la raíz del repo): python3 fabrica/videos/scd/mezcla.py
#   → audio/voz/scd/seco-v4.wav (voz pegada), audio/voz/scd/parte1-v4.mp3 (mezcla), planos.txt y tiempos.json (para escena.html)
#
# LÓGICA (cronológica; nada de segundos escritos a mano):
#  1. FRASES: la voz manda. Las frases se pegan en orden con 0,3 s entre ellas; sus tiempos salen de ahí.
#  2. PALABRAS: faster-whisper da el segundo de cada palabra (se guarda en palabras.json). Todo se ancla a una palabra
#     o al principio/fin de una frase, así que cambiar una frase recoloca solo todo lo demás (audio y escena).
#  3. EVENTOS: cada cosa que pasa en pantalla con su segundo. Un sonido solo si se VE algo que lo motive y la voz
#     no lo contradice (en el walk-out no hay golpes: va caminando).
#  4. RECETAS: cada tipo de evento suena siempre igual; el PICO del sonido cae en el segundo del evento.
#  5. CAPAS: voz arriba (≥ 8 dB sobre todo en su banda); golpes cortos encima; colas (ovación, trueno, riser) agachadas
#     bajo la voz y las reacciones del público al TERMINAR la frase; cama (público + samba) constante, ≤ 6 dB de bombeo.
#     Como mucho tres sonidos a la vez; la misma muestra repetida cambia de tono. Golpes ≤ .4 de volumen.
#  6. COMPROBAR: al final, márgenes, bombeo, sonidos a la vez, LUFS y pico. Si algo falla, sale «REVISAR».
import subprocess, os, sys, json, unicodedata, numpy as np
SFX, VOZ, FR, AQUI = 'audio/sfx/', 'audio/voz/scd/', 'audio/voz/scd/frases/', 'fabrica/videos/scd/'
TMP = os.environ.get('TMPDIR', '/tmp')
SAMBA = 'eleven/samba-a.mp3'  # samba de capoeira (ElevenLabs Efectos, 30 s en bucle); otra toma: samba-b.mp3
HUECO = .3

# ---------- 1. frases en orden: (clave, archivo en frases/, velocidad[, {'pausa': s máximos de silencio dentro de la frase,
#            'antes': s de silencio delante (el apagón antes del final)}])
FRASES = [('apertura', '00.mp3', 1), ('bienvenidos', '03.mp3', 1),
          # «introducing» espera a que Trump llegue a la jaula: el walk-out sigue con música y público (3 s más)
          ('introducing', '04.mp3', 1.25, {'antes': 3.0}), ('record', '05.mp3', 1.1),
          ('mestre', '16.mp3', 1), ('altura', '17.mp3', 1.3, {'pausa': .1}), ('presentando', '13.mp3', 1), ('one', '14.mp3', 1),
          ('nombre', '18.mp3', 1),
          # final: primer plano del presentador pidiendo seguir/compartir y la barra del capítulo 2 (el apagón dura NEGRO s)
          ('sigue', '19.mp3', 1, {'antes': 2.95}), ('comparte', '20.mp3', 1), ('veinte', '21.mp3', 1)]
NEGRO = 2.95
dur = lambda f: float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], capture_output=True, text=True).stdout)
INI, FINF, clips, t = {}, {}, [], 0.0
for clave, arch, vel, *op in FRASES:
  op = op[0] if op else {}; c = os.path.join(TMP, f'scd-frase-{clave}.wav'); clips.append(c)
  af = 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse'
  if 'pausa' in op: af += f',silenceremove=stop_periods=-1:stop_duration={op["pausa"]}:stop_threshold=-40dB:stop_silence={op["pausa"] / 2}'
  af += (f',atempo={vel}' if vel != 1 else '') + ',aformat=sample_rates=48000:channel_layouts=mono:sample_fmts=s16'
  subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', FR + arch, '-af', af, c], check=True)
  if 'antes' in op:  # silencio delante: se pega como un clip más
    sil = os.path.join(TMP, f'scd-antes-{clave}.wav'); clips.insert(len(clips) - 1, sil); t += op['antes']
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=mono', '-t', str(op['antes']), '-sample_fmt', 's16', sil], check=True)
  INI[clave] = round(t, 3); t += dur(c); FINF[clave] = round(t, 3); t += HUECO
hueco = os.path.join(TMP, 'scd-hueco.wav')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=mono', '-t', str(HUECO), '-sample_fmt', 's16', hueco], check=True)
lista = os.path.join(TMP, 'scd-lista.txt'); open(lista, 'w').write(''.join(f"file '{c}'\n" + ('' if '-antes-' in c else f"file '{hueco}'\n") for c in clips))
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lista, '-c', 'copy', VOZ + 'seco-v4.wav'], check=True)

# ---------- 2. palabras (caché: solo se transcribe lo que ha cambiado)
cache_f = AQUI + 'palabras.json'; cache = json.load(open(cache_f)) if os.path.exists(cache_f) else {}
firma = {k: f'{a}|{v}|{o}|{os.path.getmtime(FR + a):.0f}' for k, a, v, *o in FRASES}
faltan = [k for k, *_ in FRASES if cache.get(k, {}).get('firma') != firma[k]]
if faltan:
  r = json.loads(subprocess.run([os.path.expanduser('~/qw/bin/python'), 'fabrica/herramientas/palabras.py',
                                 *[os.path.join(TMP, f'scd-frase-{k}.wav') for k in faltan]], capture_output=True, text=True, check=True).stdout)
  for k in faltan: cache[k] = {'firma': firma[k], 'palabras': r[os.path.join(TMP, f'scd-frase-{k}.wav')]}
  json.dump(cache, open(cache_f, 'w'), ensure_ascii=False, indent=0)
llano = lambda s: ''.join(c for c in unicodedata.normalize('NFD', s.lower()) if c.isalnum())
def en(clave, *posibles, fin=False):
  for w, a, b in cache[clave]['palabras']:
    if any(llano(w).startswith(llano(p)) for p in posibles): return round(INI[clave] + (b if fin else a), 2)
  raise SystemExit(f'No encuentro {posibles} en «{clave}»: {[w for w, _, _ in cache[clave]["palabras"]]}')
def en_o(defecto, clave, *posibles, fin=False):  # como en(), pero si whisper no la oye (gritos alargados), vale el defecto
  try: return en(clave, *posibles, fin=fin)
  except SystemExit: return round(defecto, 2)

# ---------- anclas (s): palabras, frases y momentos de imagen que salen de ellas
A = dict(hora=en('apertura', 'hora', 'jura', 'ora'), ano=en('bienvenidos', 'año', 'ano'),
         dos=en('record', 'dos'), deportaciones=en('record', 'deport'), una=en('record', 'una'), cero=en('record', 'cero'),
         mestre=en('mestre', 'mestre', 'maestre', 'mest'), mundial=en('mestre', 'mundial'),
         altura=en('altura', 'metro', 'un'), peso=en('altura', 'ciento', '108', 'cien'), trump=en('nombre', 'trump', 'tram', 'trom'))
B, I0 = INI['bienvenidos'], INI['introducing']
# walk-out en 5 planos largos (con 10 cortes de 0,5 s se sentía forzado): túnel con fuego, steadicam por el pasillo,
# grúa que descubre la jaula y la pantalla TRUMP («AÑO»), escalera con el cutman (guantes), entra por la puerta
A.update(cortes_walkout=[B, B + 1.66, A['ano'], I0 - 2.55, I0 - .75],
         guantes=I0 - 1.2, ko=[A['cero'] + .23, A['cero'] + .83], armada=A['mestre'] - .6, macaco=INI['presentando'] + 2.5)
# capoeira épica (escena.html): cada golpe en su plano con rampa de velocidad y el pico (pie más alto) en estos segundos
INTRO = en('introducing', 'intro'); REC = [INI['record'], A['dos'] - .15, A['deportaciones'] - .15, A['una'] - .15]
A.update(introd=INTRO, au=INTRO + .45,                                   # el presentador gira en «AAAND»; corte al Au en «INTRODUCING»
         picos_rec=[REC[0] + 1.9, REC[1] + .55, REC[2] + .5, REC[3] + .6],  # Troca, Armada, Queshada, Meia lua de frente
         kip=A['peso'] - .3 + .55,                                         # «ciento ocho kilos»: kip-up (corte en peso − 0,3)
         au_cenital=INI['presentando'] + 1.1)                              # dron cenital: rueda (Cartwheel)
APAGON = round(FINF['nombre'] + HUECO, 2); CTA = round(INI['sigue'] - .25, 2); FIN = round(FINF['veinte'] + 1.8, 2)
A.update(apagon=APAGON, silueta=APAGON + .4, rotulo=APAGON + 1.1, cta=CTA, fin=FIN,
         diez=en('sigue', 'diez', '10'), gradas=en_o(INI['comparte'] + 2.4, 'comparte', 'grada'), veinte=en('veinte', 'veinte', '20'),
         dos_final=en_o(FINF['veinte'] - .45, 'veinte', 'dos', 'do'))
for k in INI: A['ini_' + k] = INI[k]; A['fin_' + k] = FINF[k]
json.dump(A, open(AQUI + 'tiempos.json', 'w'), indent=1)
# boca del presentador: cada palabra en su segundo del vídeo y la envolvente de la voz (60 por segundo) → boca.json
x = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', VOZ + 'seco-v4.wav', '-af', 'highpass=f=120,lowpass=f=3500', '-f', 's16le', '-ac', '1', '-ar', '12000', '-'],
                                 capture_output=True).stdout, np.int16).astype(np.float32) / 32768
n = len(x) // 200; envol = np.sqrt(np.mean(x[:n * 200].reshape(n, 200) ** 2, axis=1)); envol = np.clip(envol / np.percentile(envol[envol > envol.max() * .05], 95), 0, 1.2)
json.dump({'fps': 60, 'env': [round(float(e), 3) for e in envol],
           'palabras': [[w, round(INI[k] + a, 3), round(INI[k] + b, 3)] for k, *_ in FRASES for w, a, b in cache[k]['palabras']]}, open(AQUI + 'boca.json', 'w'))

# (inicio, plano, animación de Trump, frase) — cada plano dura hasta el siguiente
PLANOS = [
  (0, 'Primer plano del presentador, foco cenital, humo; grita desde el primer segundo', '-', 'Señoras y señores… ¡ES LA HORA!'),
  (A['hora'], 'Dron sobre la jaula SCD, gradas llenas, flashes de móviles, carteles con @', '-', '(«HORA» y ovación)'),
  (B, 'Walk-out AMV hasta la jaula: túnel con fuego (steadicam de frente), steadicam detrás por el pasillo, grúa que descubre la jaula y la pantalla TRUMP, escalera con el cutman y guantes, entra por la puerta', 'Walk / Entry', '¡Bienvenidos al COMBATE DEL AÑO! (y música)'),
  (INI['introducing'], 'El presentador gira 360° en «AAAND» y señala la esquina roja; en «INTRODUCING», Au de Trump', 'Ginga → Au_To_Role', 'AAAND INTRODUCING FIRST!'),
  (INI['record'], 'Un golpe por tarjeta, cada uno en su plano con rampa (rápido → cámara lenta en el pico → rápido); en «cero empates», flash: KO', 'Troca, Armada, Queshada, Meia lua de frente → Esquiva', 'Récord: dos guerras, deportaciones, una elección perdida, cero empates'),
  (INI['mestre'], 'Dron alto sobre el pabellón; en «MESTRE», armada en contrapicado; en «MUNDIAL», dron sobre la grada', 'Ginga → Armada_To_Esquiva', 'Es empresario… golfista… ¡y MESTRE de capoeira de fama mundial!'),
  (INI['altura'], 'Tarjetas 1,90 m · 108 kg: la cámara sube de los zapatos a la cara; en «ciento ocho kilos», kip-up', 'Ginga → Kip_Up', 'Con un metro noventa de altura… y ciento ocho kilos de peso'),
  (INI['presentando'], 'Dron cenital bajando y girando (rueda); luego órbita con el macaco, carteles con @ detrás', 'Cartwheel → Macaco_Side', 'Presentando… al presidente… de los Estados Unidos'),
  (INI['one'], 'Plano heroico a cámara lenta, confeti dorado', 'capoei3 (lento)', 'THE ONE… AND ONLY'),
  (INI['nombre'], 'Golpe final a cámara: patada clavada en «TRUMP»', 'Meia_Lua_De_Compasso', '¡DOOONALD… TRUUUMP!'),
  (APAGON, 'Apagón. Foco azul en el túnel, silueta de Sánchez. «PARTE 2»', '-', '(sin voz)'),
  (CTA, 'Primer plano del presentador; contador «10K» en «DIEZ MIL»', '-', '¡Síguenos… que llegamos a los DIEZ MIL!'),
  (A['gradas'] - .1, 'La grada: cartel «@TU_NOMBRE» entre los demás', '-', '…en las GRADAS del próximo combate'),
  (A['veinte'] - .3, 'Primer plano + barra «CAPÍTULO 2» cargando hasta 20K; en «DOS», golpe', '-', 'Y a los VEINTE MIL… ¡CAPÍTULO DOOOS!'),
]

# ---------- 3–4. recetas y eventos
PICO = {'scd/punch-03.mp3': .40, 'scd/power-punch.mp3': .20, 'whoosh.mp3': .40, 'trueno.mp3': .25, 'ovacion.mp3': .15,
        'impacto.mp3': .15, 'riser.mp3': 3.05, 'eleven/sello.mp3': .05, 'eleven/brillo.mp3': .05, 'eleven/apagon.mp3': .05}
COLA = {'scd/punch-03.mp3': .5, 'scd/power-punch.mp3': .25, 'whoosh.mp3': .7, 'trueno.mp3': 1.1, 'ovacion.mp3': 1.35,
        'impacto.mp3': 1.15, 'riser.mp3': 3.45, 'eleven/sello.mp3': .1, 'eleven/brillo.mp3': .45, 'eleven/apagon.mp3': 1.1}
# tipo → [(archivo, volumen, capa, {vel: tono/velocidad, lp: corte de agudos, dur: s que se quedan})]
RECETAS = {
  'corte':        [('whoosh.mp3', .14, 'golpes', {})],
  'corte-fuerte': [('whoosh.mp3', .24, 'golpes', {})],
  'flash':        [('whoosh.mp3', .24, 'golpes', {'vel': 1.15})],
  'golpe':        [('scd/punch-03.mp3', .32, 'golpes', {'lp': 7000})],                 # Pixabay · Universfield «Punch 03»
  'guantes':      [('scd/punch-03.mp3', .14, 'golpes', {'lp': 1500, 'vel': 1.15})],    # guante con guante: el mismo golpe, sordo
  'acrobacia':    [('whoosh.mp3', .30, 'golpes', {'vel': .9})],
  'esquiva':      [('whoosh.mp3', .20, 'golpes', {'vel': 1.25})],
  'tarjeta':      [('eleven/sello.mp3', .20, 'golpes', {'lp': 6000})],                 # el sello aterriza 0,15 s antes de la palabra
  'reaccion':     [('ovacion.mp3', .55, 'ambiente', {})],
  'reaccion-grande': [('ovacion.mp3', .85, 'ambiente', {})],
  'camara-lenta': [('whoosh.mp3', .30, 'golpes', {'vel': .6}), ('eleven/brillo.mp3', 1.0, 'golpes', {})],
  'subida':       [('riser.mp3', .32, 'ambiente', {})],
  'subida-suave': [('riser.mp3', .16, 'ambiente', {})],
  'golpe-final':  [('scd/power-punch.mp3', .36, 'golpes', {}), ('trueno.mp3', .25, 'ambiente', {'lp': 300})],  # Pixabay · Universfield «Power Punch»
  'apagon':       [('eleven/apagon.mp3', .50, 'golpes', {})],
  'silueta':      [('trueno.mp3', .34, 'golpes', {'lp': 250, 'vel': .85})],
  'rotulo':       [('scd/power-punch.mp3', .26, 'golpes', {'lp': 5000})],
}
c = A['cortes_walkout']
# (segundo del evento, tipo, motivo[, {'hasta': s}]) — se ordenan solos; 'hasta' corta la cola antes de la frase siguiente
EVENTOS = sorted([
  (A['hora'] - .04, 'corte-fuerte', 'corte al dron en «HORA»'),
  (FINF['apertura'] - .05, 'reaccion', 'la grada responde al terminar «HORA»'),
  (c[0], 'corte', 'walk-out: túnel'), (c[1], 'corte', 'steadicam por el pasillo'), (c[2], 'corte-fuerte', 'grúa: jaula y pantalla TRUMP en «AÑO»'),
  (c[3], 'corte', 'escalera con el cutman'), (c[4], 'corte', 'entra por la puerta de la jaula'),
  (A['guantes'], 'guantes', 'choca los guantes junto al cutman'),
  (c[4] + .35, 'reaccion-grande', 'la grada estalla: Trump en la jaula', {'hasta': INI['introducing'] - .05}),
  (FINF['bienvenidos'] - .05, 'reaccion', 'la grada responde a «combate del año»'),
  (INI['introducing'], 'corte', 'corte al presentador: gira y señala'),
  (A['introd'] - .05, 'corte', 'corte al Au'), (A['au'], 'acrobacia', 'Au en «INTRODUCING»'),
  *[(p, 'acrobacia', m) for p, m in zip(A['picos_rec'], ['troca', 'armada', 'queshada', 'meia lua de frente'])],
  (INI['mestre'], 'corte', 'dron alto sobre el pabellón'), (A['armada'] - .2, 'corte', 'corte a la armada'),
  (A['peso'] - .3, 'corte', 'corte al kip-up'), (A['kip'], 'acrobacia', 'kip-up en «ciento ocho kilos»'),
  (A['au_cenital'], 'acrobacia', 'rueda vista desde el dron cenital'), (A['macaco'] - .6, 'corte', 'corte a la órbita'),
  (FINF['introducing'] - .05, 'reaccion-grande', 'la grada estalla con «INTRODUCING FIRST»'),
  (A['dos'] - .15, 'tarjeta', 'tarjeta: guerras'), (A['deportaciones'] - .15, 'tarjeta', 'tarjeta: deportaciones'),
  (A['una'] - .15, 'tarjeta', 'tarjeta: elecciones perdidas'), (A['cero'] - .15, 'tarjeta', 'tarjeta: empates'),
  (A['ko'][0], 'flash', 'flash: pelea vieja (por eso no empata)'), (A['ko'][0] + .22, 'golpe', 'flash: el KO entra'),
  (A['ko'][1], 'esquiva', 'vuelve a la jaula con la esquiva'),
  (FINF['record'] - .05, 'reaccion', 'aplausos tras «cero empates»'),
  (A['mestre'] + .26, 'acrobacia', 'armada en «MESTRE»'),
  (A['mundial'], 'corte', 'corte a la grada en «MUNDIAL»'),
  (FINF['mestre'] - .05, 'reaccion-grande', 'la grada estalla tras «MUNDIAL»', {'hasta': INI['altura'] - .05}),
  (INI['altura'], 'corte', 'corte a la meia lua'),
  (A['altura'] - .15, 'tarjeta', 'tarjeta: 1,90 m'), (A['peso'] - .15, 'tarjeta', 'tarjeta: 108 kg'),
  (INI['presentando'], 'corte', 'corte a la vuelta'),
  (A['macaco'], 'acrobacia', 'macaco a mitad de vuelta'),
  (FINF['presentando'] - .05, 'reaccion', 'la grada sube tras «Estados Unidos»'),
  (INI['one'], 'camara-lenta', 'cámara lenta y confeti'),
  (INI['nombre'], 'corte', 'corte al golpe final'),
  (A['trump'], 'subida', 'el riser culmina en «TRUMP»'),
  (A['trump'], 'golpe-final', 'patada en «TRUMP»'),
  (FINF['nombre'] - .05, 'reaccion-grande', 'ovación al terminar el nombre'),
  (APAGON + .02, 'apagon', 'apagón: el público se calla'),
  (A['silueta'], 'silueta', 'aparece la silueta de Sánchez'),
  (A['rotulo'], 'rotulo', 'rótulo PARTE 2'),
  (CTA, 'corte-fuerte', 'vuelve la luz: primer plano del presentador'),
  (A['diez'] - .15, 'tarjeta', 'contador 10K'),
  (A['gradas'] - .1, 'corte', 'corte a la grada: @TU_NOMBRE'),
  (A['veinte'] - .3, 'corte', 'vuelta al presentador; aparece la barra'),
  (A['dos_final'], 'subida-suave', 'el riser culmina en «DOS» (bajo: hay voz encima)'), (A['dos_final'], 'rotulo', 'CAPÍTULO 2: golpe'),
  (FINF['veinte'] - .05, 'reaccion-grande', 'ovación final'),
], key=lambda e: e[0])

with open(AQUI + 'planos.txt', 'w') as f:
  f.write('# Parte 1 · planos (generado por mezcla.py; la lógica está al principio de mezcla.py)\n# inicio–fin | plano | Trump | voz | eventos con sonido\n')
  bordes = [p[0] for p in PLANOS] + [FIN]
  for i, (a, plano, anim, voz) in enumerate(PLANOS):
    b = bordes[i + 1]; ev = ', '.join(f'{t:.2f} {tipo} ({m})' for t, tipo, m, *_ in EVENTOS if a <= t < b)
    f.write(f'P{i + 1:02} {a:5.2f}–{b:5.2f} | {plano} | {anim} | {voz} | {ev}\n')

# ---------- 5. grafo de ffmpeg
ent = ['-i', VOZ + 'seco-v4.wav', '-i', SFX + 'grada.mp3', '-stream_loop', '-1', '-i', SFX + SAMBA]
calla = f"volume='if(lt(t,{APAGON}),1,if(lt(t,{CTA}),max(0.25,1-(t-{APAGON})*2.2),min(0.6,0.25+(t-{CTA})*1.2)))':eval=frame"  # el apagón calla la arena; en el final vuelve a medias (primer plano)
g = ['[0]aformat=channel_layouts=mono,volume=0.7,highpass=f=90,equalizer=f=3000:t=q:w=1.5:g=3,'
     'acompressor=threshold=-22dB:ratio=4:attack=5:release=150:makeup=5,asoftclip=type=tanh:threshold=0.85,'
     f'aecho=0.9:0.9:45:0.12,apad=whole_dur={FIN},asplit=4[v][sc1][sc2][sc3]',
     # público: cinco copias de la grada encadenadas con fundido (sin costura de bucle cada 12 s)
     '[1]aformat=channel_layouts=mono,asplit=5[g1][g2][g3][g4][g5]',
     '[g1][g2]acrossfade=d=2[gx1]', '[gx1][g3]acrossfade=d=2[gx2]', '[gx2][g4]acrossfade=d=2[gx3]', '[gx3][g5]acrossfade=d=2[gx4]',
     f'[gx4]atrim=0:{FIN},volume=0.35,afade=t=in:d=0.15[g]',
     # samba por los altavoces del pabellón: sin graves ni brillo, rebotes largos, lejos
     f'[2]atrim=0:{FIN},aformat=channel_layouts=mono,highpass=f=220,lowpass=f=4200,'
     'acompressor=threshold=-20dB:ratio=3:makeup=2,aecho=0.8:0.75:140|290|460:0.35|0.22|0.12,'
     f"volume=0.46,afade=t=in:d=0.3,volume='if(lt(t,{APAGON - .15}),1,if(lt(t,{CTA}),max(0,1-(t-{APAGON - .15})/0.6),min(1,(t-{CTA})/0.4)))':eval=frame[m]",
     f'[g][m]amix=inputs=2:normalize=0,{calla}[cama]',
     '[cama][sc1]sidechaincompress=threshold=0.07:ratio=2.6:attack=40:release=450:knee=4[camad]']
capas, usos = {'golpes': [], 'ambiente': []}, {}
for t, tipo, m, *extra in EVENTOS:
  hasta = extra[0].get('hasta') if extra else None
  for n, vol, capa, op in RECETAS[tipo]:
    vel = op.get('vel', 1)
    if n == 'ovacion.mp3':  # la misma ovación repetida cambia de tono
      k = usos[n] = usos.get(n, -1) + 1; vel *= [1, .94, 1.05, .97, 1.03, .92][k % 6]
    ini = t - PICO.get(n, 0) / vel  # el pico cae en el segundo del evento
    ent += ['-i', SFX + n]; i = ent.count('-i') - 1
    f = 'aresample=48000,aformat=channel_layouts=mono'
    if vel != 1: f += f',asetrate={int(48000 * vel)},aresample=48000'
    if 'lp' in op: f += f',lowpass=f={op["lp"]}'
    f += f',volume={vol}'
    if 'dur' in op: f += f',atrim=0:{op["dur"]},afade=t=out:st={op["dur"] - .08:.2f}:d=0.08'
    if hasta: f += f',afade=t=out:st={max(0, hasta - max(ini, 0) - .15):.3f}:d=0.15'  # en el tiempo del propio sonido
    f += f',atrim=start={-ini:.3f},asetpts=PTS-STARTPTS' if ini < 0 else f',adelay={int(ini * 1000)}'
    g.append(f'[{i}]{f}[e{i}]'); capas[capa].append(f'e{i}')
for capa, sc, opc in [('golpes', 'sc2', 'threshold=0.1:ratio=2:attack=2:release=120'),
                      ('ambiente', 'sc3', 'threshold=0.03:ratio=8:attack=5:release=260')]:
  ls = capas[capa]
  g.append(f'{"".join(f"[{l}]" for l in ls)}amix=inputs={len(ls)}:normalize=0:duration=longest,apad=whole_dur={FIN},atrim=0:{FIN}'
           + (f',{calla}' if capa == 'ambiente' else '') + f'[{capa}]')
  g.append(f'[{capa}][{sc}]sidechaincompress={opc}[{capa}d]')
g += ['[v]asplit[v1][vC]', '[camad]asplit[c1][cC]', '[golpesd]asplit[o1][oC]', '[ambiented]asplit[a1][aC]',
      f'[v1][c1][o1][a1]amix=inputs=4:normalize=0:duration=first,atrim=0:{FIN},afade=t=out:st={FIN - 1.2}:d=1.2,'
      'loudnorm=I=-14:TP=-1.5:LRA=11[out]']
grafo = os.path.join(TMP, 'scd-grafo.txt'); open(grafo, 'w').write(';\n'.join(g))
cap = {c: os.path.join(TMP, f'scd-{c}.wav') for c in ['voz', 'cama', 'golpes', 'ambiente']}
subprocess.run(['ffmpeg', '-v', 'error', '-y', *ent, '-/filter_complex', grafo, '-map', '[out]', '-ar', '48000', '-b:a', '192k',
                VOZ + 'parte1-v4.mp3', *sum([['-map', f'[{l}]', cap[c]] for l, c in zip(['vC', 'cC', 'oC', 'aC'], cap)], [])], check=True)
print('→', VOZ + 'parte1-v4.mp3', f'({FIN} s) · {AQUI}planos.txt · {AQUI}tiempos.json')

# ---------- 6. comprobación de capas (banda de la voz 300–4000 Hz, ventanas de 100 ms)
def lee(f, banda=True):
  af = ['-af', 'highpass=f=300,lowpass=f=4000'] if banda else []
  x = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, *af, '-f', 's16le', '-ac', '1', '-ar', '16000', '-'], capture_output=True).stdout
  x = np.frombuffer(x, np.int16).astype(np.float32) / 32768; n = len(x) // 1600
  return np.mean(x[:n * 1600].reshape(n, 1600) ** 2, axis=1) + 1e-10
pot = {c: lee(f) for c, f in cap.items()}; n = min(len(p) for p in pot.values()); pot = {c: p[:n] for c, p in pot.items()}
db = {c: 10 * np.log10(p) for c, p in pot.items()}
v = db['voz']; habla = v > np.median(v[v > v.max() - 30]) - 8  # sílabas de verdad; las pausas y colas son para la cama
resto = 10 * np.log10(pot['cama'] + pot['golpes'] + pot['ambiente']); margen = db['voz'] - resto
malos = [(i / 10, margen[i], max(['cama', 'golpes', 'ambiente'], key=lambda c: db[c][i])) for i in np.where(habla & (margen < 8))[0]]
camaT = 10 * np.log10(lee(cap['cama'], False)[:n]); calla_i = int(APAGON * 10)
bombeo = np.median(camaT[:calla_i][~habla[:calla_i]]) - np.median(camaT[:calla_i][habla[:calla_i]])
med = subprocess.run(['ffmpeg', '-hide_banner', '-i', VOZ + 'parte1-v4.mp3', '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
I = float(med.split('I:')[-1].split('LUFS')[0]); pk = float(med.split('Peak:')[-1].split('dBFS')[0])
dura = lambda r: min(COLA.get(r[0][0], .5), r[0][3].get('dur', 9)) / r[0][3].get('vel', 1)
tramos = [(t - PICO.get(RECETAS[tp][0][0], 0), t - PICO.get(RECETAS[tp][0][0], 0) + dura(RECETAS[tp])) for t, tp, *_ in EVENTOS]
a_la_vez = max((sum(a <= x < b for a, b in tramos), x) for x in np.arange(0, FIN, .05))
print(f'margen voz/resto (banda voz, hablando): mediana {np.median(margen[habla]):.1f} dB · p10 {np.percentile(margen[habla], 10):.1f} · ventanas < 8 dB: {len(malos)} de {habla.sum()}')
for t, m, c in malos: print(f'   {t:5.1f}s  {m:5.1f} dB  ← {c}')
print(f'bombeo de la cama: {bombeo:.1f} dB · sonidos a la vez: {a_la_vez[0]} (en {a_la_vez[1]:.2f} s) · LUFS {I} · pico {pk} dBFS')
ok = len(malos) <= 3 and bombeo <= 6.5 and a_la_vez[0] <= 3 and -15 <= I <= -13.5 and pk <= -1.0
print('COMPROBACIÓN:', 'OK' if ok else 'REVISAR'); sys.exit(0 if ok else 1)
