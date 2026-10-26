import json, sys
viejo = json.load(open('/home/user/Climate-things/fabrica/videos/espanistan-02/escenas.json'))
L = 'audio/voz/es/espanistan-02/lento/'; F = 'audio/voz/es/espanistan-02/feijolo/'
V = [(L+'01.mp3','1'),(L+'02.mp3','2'),(L+'03.mp3','3'),
 (F+'f1_gestion.mp3','¡Españistaníes! Lo mío es gestión. Gestión, gestión… y más gestión.'),
 (L+'04.mp3','4'),(L+'b1.mp3','5-8'),(F+'f2_detalle.mp3','Yo gané las elecciones. Que los demás sumaran más… eso es un detalle técnico.'),
 (L+'b2.mp3','9-11'),(L+'b3.mp3','12-14'),(L+'b4.mp3','15-19'),(L+'b5.mp3','20-23'),(L+'b6a.mp3','24-32'),
 (F+'f6_aguapasada.mp3','¿Los escándalos de mi partido? Agua pasada… de anteayer, pero pasada.'),
 (L+'b6b.mp3','33-34'),(F+'f3_nosabia.mp3','¿Yo? En aquella época yo no sabía a qué se dedicaba.'),
 (L+'b6c.mp3','35'),(F+'f4_rio.mp3','Este es otro PP. Un río nuevo. Limpito. El cauce… mejor no lo miréis.'),
 (L+'b6d.mp3','36'),(L+'b7a.mp3','37'),
 (F+'f5_promesas.mp3','Bajaré los impuestos, subiré las pensiones y os daré una casa a cada uno. ¿Cómo? Eso es un detalle técnico.'),
 (L+'b7b.mp3','38'),(L+'b8.mp3','39-45'),(L+'b9.mp3','46')]
voces = []
for i, (a, x) in enumerate(V):
    f = a.startswith(F); siguiente_f = i + 1 < len(V) and V[i + 1][0].startswith(F)
    v = {'archivo': a, 'pausa': .5 if f or siguiente_f else 1.0}
    if f: v.update(texto=x, quien='feijolo')
    else: v['lineas'] = x
    voces.append(v)
# capas del montaje anterior, por su ancla de plano
C = {p['en']: p for p in viejo['planos']}
def capas(en, mapa):
    out = json.loads(json.dumps(C[en].get('capas', [])))
    def fix(o):
        if isinstance(o, dict): return {k: fix(v) for k, v in o.items()}
        if isinstance(o, list): return [fix(v) for v in o]
        if isinstance(o, str) and ':' in o and o.split(':', 1)[0].isdigit() and int(o.split(':', 1)[0]) <= 13:
            b, w = o.split(':', 1); return f'{mapa(int(b), w)}:{w}'
        return o
    return fix(out)
def sfx(en, mapa): return capas.__globals__['json'].loads(json.dumps([[n, f"{mapa(int(a.split(':')[0]), a.split(':',1)[1])}:{a.split(':',1)[1]}", v] for n, a, v in C[en].get('sfx', [])]))
M = {1: 1, 2: 2, 3: 3, 4: 5, 5: 6, 6: 8, 7: 9, 8: 10, 9: 11, 12: 22, 13: 23}
def mv(b, w):
    if b in M: return M[b]
    if b == 10:   # b6 partido en 4
        for clave, n in (('La dana', 14), ('Las fotos', 14), ('No hay causa', 14), ('Heráclito', 16), ('nadie se baña', 16), ('Pero el cauce', 18), ('La pregunta del Decano', 18), ('no con palabras', 18)):
            if w.startswith(clave) or clave in w: return n
        return 12
    if b == 11:   # b7 partido en 2
        return 21 if any(k in w for k in ('Pero acuérdate', 'Bajar impuestos puede', 'ciento uno', 'pregúntalo')) else 19
    raise SystemExit(f"voz sin mapa: {b} {w}")
def cp(en): return capas(en, mv)
def sx(en): return sfx(en, mv)
T = lambda en, escena, cam, cam2, **k: dict(en=en, tipo='teatro', escena=escena, cam=cam, cam2=cam2, **k)
R = lambda en, img, lado, z=(1, 1.06), y=0: dict(en=en, tipo='retrato', img=img, lado=lado, z=list(z), y=y, musica='neutro')
P = [
 C[0],
 C['2:El filósofo'],
 T('3:Este es Feijolo', 'promesas', [760, 330, 2.0], [640, 360, 1.0], capas=cp('3:Este es Feijolo'),
   acciones=[{'pieza': 'fbrazo', 'hace': 'saluda', 'en': '3:Este es Feijolo'}, {'pieza': 'publico1', 'hace': 'salta', 'en': '3:el PP'}, {'pieza': 'publico2', 'hace': 'salta', 'en': '3:el PP'}]),
 R('4:Españistaníes', 'p1', 1),
 T('5:Mismas reglas', 'tribunal', [780, 200, 1.5], [700, 330, 1.15], capas=cp('4:Mismas reglas'),
   acciones=[{'pieza': 'balanza', 'hace': 'balancea', 'en': '5:Mismas reglas', 'hasta': '5:lo bueno', 'g': 4}]),
 T('6:Feijolo presidió', 'galicia', [634, 300, 1.7], [640, 360, 1.05], capas=cp('5:Feijolo presidió'),
   acciones=[{'pieza': 'feijolo_c', 'hace': 'saluda', 'en': '6:cuatro mayorías', 'g': 4}, {'pieza': 'olas', 'hace': 'balancea', 'en': '6:Feijolo presidió', 'hasta': '6:Pero no gobernó', 'g': 2}]),
 T('6:Pero no gobernó', 'galicia', [900, 430, 1.6], [1000, 450, 2.0], capas=cp('5:Pero no gobernó'), sfx=sx('5:Pero no gobernó'),
   acciones=[{'pieza': 'feijolo', 'hace': 'inclina', 'en': '6:Pero no gobernó', 'g': -4, 'hasta': '6:Primera lección'}]),
 R('7:Yo gané', 'p2', -1),
 T('8:El último gobierno', 'crisis', [681, 400, 2.1], [681, 380, 1.7], musica='esperanza',
   capas=[{'tipo': 'nota', 'texto': 'Mariano Rajoy', 'sub': 'Presidente del Gobierno, 2011–2018', 'dato': 'Llegó en plena crisis', 'pos': 'izq', 'en': '8:Mariano Rajoy', 'hasta': '8:El paro llegó'}],
   acciones=[{'pieza': 'paraguas', 'hace': 'tiembla', 'en': '8:plena crisis', 'g': 1.5}]),
 T('8:El paro llegó', 'crisis', [320, 470, 1.6], [480, 420, 1.15], musica='esperanza', capas=cp('6:El último gobierno'),
   acciones=[{'pieza': 'cola', 'hace': 'tiembla', 'en': '8:veintiséis', 'g': 1.5}, {'pieza': 'cola', 'hace': 'avanza', 'en': '8:Cuando Rajoy', 'g': -30}]),
 T('9:Ahora, la letra', 'crisis', [980, 420, 1.7], [960, 400, 1.4], musica='misterio', capas=cp('7:Ahora, la letra'),
   acciones=[{'pieza': 'mochila', 'hace': 'avanza', 'en': '9:Ahora, la letra', 'g': -15}]),
 T('9:La deuda pública', 'crisis', [930, 580, 2.1], [900, 540, 1.7], musica='misterio', capas=cp('7:La deuda pública'),
   acciones=[{'pieza': 'mochila', 'hace': 'tiembla', 'en': '9:La deuda', 'g': 2}, {'pieza': 'mochila', 'hace': 'inclina', 'en': '9:noventa y ocho', 'g': 5}]),
 dict(C['7:Pregunta del Decano'], en='9:Pregunta del Decano', sfx=sx('7:Pregunta del Decano')),
 T('10:En la campaña', 'impuestos', [260, 330, 1.8], [420, 380, 1.3], capas=cp('8:En la campaña'),
   acciones=[{'pieza': 'balcon', 'hace': 'saluda', 'en': '10:prometió', 'g': 6}, {'pieza': 'palanca', 'hace': 'alza', 'en': '10:Un mes después', 'hasta': '10:Él dijo', 'g': 12}, {'pieza': 'recaudador', 'hace': 'inclina', 'en': '10:Un mes después', 'g': 4}]),
 T('10:En dos mil doce aprobó', 'impuestos', [1044, 518, 1.8], [1044, 500, 1.5], musica='misterio', capas=cp('8:En dos mil doce aprobó'),
   zooms=[['10:En dos mil diecisiete', 1073, 240, 1.7, 1.0]],
   acciones=[{'pieza': 'encapuchados', 'hace': 'tiembla', 'en': '10:amnistía fiscal', 'g': 1.2}, {'pieza': 'mazo', 'hace': 'golpea', 'en': '10:inconstitucional y nula', 'g': 25}]),
 dict(C['8:Cicerón'], en='10:Cicerón', capas=cp('8:Cicerón'), sfx=sx('8:Cicerón')),
 T('11:El Decano saca', 'mapa', [470, 360, 1.45], [450, 340, 1.3], musica='tension',
   capas=[{'tipo': 'dato', 'pos': 'der', 'valor': '3.743', 'texto': 'casos de corrupción en 20 años: uno cada dos días', 'fuente': 'Abreu, IREA-UB 2022', 'color': 'rojo', 'en': '11:tres mil setecientos', 'hasta': '11:Galicia'},
          {'tipo': 'pines', 'en': '11:Por comunidades', 'pines': [[420, 470, 'Andalucía', '1.028', '11:Andalucía'], [560, 360, 'C. Valenciana', '455', '11:La Comunidad Valenciana'], [300, 190, 'Galicia', '338', '11:Galicia']]}],
   acciones=[{'pieza': 'decano', 'hace': 'inclina', 'en': '11:El Decano saca', 'g': -3}, {'pieza': 'decano', 'hace': 'asiente', 'en': '11:Entre las tres'}]),
 T('11:Y por partidos', 'mapa', [440, 340, 1.2], [440, 340, 1.1], musica='tension', capas=cp('9:Y por partidos')),
 dict(C['9:Lección del Decano'], en='11:Lección del Decano', capas=cp('9:Lección del Decano'), sfx=sx('9:Lección del Decano')),
 T('12:Platón contó', 'mapa', [857, 400, 1.9], [857, 380, 1.5], musica='misterio', capas=cp('10:Platón contó'),
   acciones=[{'pieza': 'pastor', 'hace': 'alza', 'en': '12:encuentra un anillo', 'g': 4, 'hasta': '12:lo hace invisible'}, {'pieza': 'pastor', 'hace': 'desaparece', 'en': '12:lo hace invisible'}, {'pieza': 'pastor_c', 'hace': 'desaparece', 'en': '12:lo hace invisible'}]),
 T('12:Mismas reglas', 'tribunal', [260, 380, 1.6], [300, 380, 1.4], musica='tension', capas=[c for c in cp('10:Mismas reglas') if c['tipo'] == 'sello'],
   acciones=[{'pieza': 'decano', 'hace': 'asiente', 'en': '12:nadie es culpable'}]),
 T('12:Gürtel', 'tribunal', [700, 300, 1.25], [700, 330, 1.15], musica='tension', capas=[c for c in cp('10:Mismas reglas') if c['tipo'] == 'frasco'], sfx=sx('10:Mismas reglas'),
   zooms=[['12:La sede', 610, 360, 1.15, 1.0], ['12:Kitchen', 605, 470, 1.8, 1.0], ['12:Montoro', 870, 470, 1.8, 1.0], ['12:Rato', 1015, 470, 1.8, 1.0], ['12:Zaplana', 1150, 460, 1.8, 1.0], ['12:Granados', 1270, 460, 1.8, 1.0]],
   acciones=[{'pieza': 'balanza', 'hace': 'inclina', 'en': '12:condenó al PP', 'g': 7, 'hasta': '12:La sede'}, {'pieza': 'r1', 'hace': 'inclina', 'en': '12:Kitchen', 'g': 3},
             {'pieza': 'r3', 'hace': 'niega', 'en': '12:Él lo niega'}, {'pieza': 'r4', 'hace': 'inclina', 'en': '12:condenado de forma firme', 'g': 4},
             {'pieza': 'r5', 'hace': 'inclina', 'en': '12:diez años', 'g': 4}, {'pieza': 'r6', 'hace': 'inclina', 'en': '12:dos años y medio', 'g': 4}]),
 R('13:escándalos', 'p1', 1, (1.2, 1.3), 40),
 T('14:La dana', 'dana', [500, 330, 1.6], [560, 360, 1.15], musica='silencio', capas=[c for c in cp('10:La dana') if c['nombre'] == 'La DANA'],
   acciones=[{'pieza': 'ola', 'hace': 'balancea', 'en': '14:La dana', 'hasta': '14:Las fotos', 'g': 3}, {'pieza': 'cargo', 'hace': 'inclina', 'en': '14:dimitió', 'g': 5}]),
 T('14:Las fotos', 'dana', [900, 470, 1.8], [900, 460, 1.4], musica='misterio', capas=[c for c in cp('10:La dana') if c['nombre'] == 'Las fotos'],
   acciones=[{'pieza': 'barca', 'hace': 'balancea', 'en': '14:Las fotos', 'hasta': '15:Yo', 'g': 2.5}]),
 R('15:Yo', 'p2', -1),
 T('16:Heráclito', 'rio', [740, 330, 1.6], [700, 340, 1.3], musica='misterio', capas=[c for c in cp('10:Heráclito') if c['tipo'] == 'cita'],
   acciones=[{'pieza': 'feijolo', 'hace': 'saluda', 'en': '16:Feijolo dice', 'g': 5}]),
 R('17:Este es otro', 'p1', 1),
 T('18:Pero el cauce', 'rio', [1150, 330, 1.9], [1100, 340, 1.5], musica='misterio', sfx=sx('10:Heráclito'),
   acciones=[{'pieza': 'decano', 'hace': 'niega', 'en': '18:Pero el cauce'}, {'pieza': 'decano', 'hace': 'asiente', 'en': '18:Pídeselo'}]),
 T('19:Para el veintinueve', 'promesas', [820, 280, 1.7], [760, 330, 1.3], capas=cp('11:Para el veintinueve'),
   acciones=[{'pieza': 'fbrazo', 'hace': 'alza', 'en': '19:Feijolo promete', 'g': 18}, {'pieza': 'iconos', 'hace': 'crece', 'en': '19:bajar impuestos', 'hasta': '20:Bajaré', 'g': .15}]),
 R('20:Bajaré', 'p2', -1),
 T('21:Bajar impuestos', 'promesas', [380, 460, 1.6], [640, 360, 1.05], capas=cp('11:Pero acuérdate'), sfx=sx('11:Pero acuérdate'),
   acciones=[{'pieza': 'iconos', 'hace': 'desaparece', 'en': '21:acuérdate de la mochila'}, {'pieza': 'decano', 'hace': 'niega', 'en': '21:Qué gasto se recorta'}, {'pieza': 'dbrazo', 'hace': 'alza', 'en': '21:Bajar impuestos', 'g': 14}]),
 T('22:Balance', 'rio', [1020, 330, 1.7], [960, 360, 1.2], capas=cp('12:Balance'), sfx=sx('12:Balance'),
   acciones=[{'pieza': 'balanza', 'hace': 'balancea', 'en': '22:Balance', 'hasta': '22:En el otro', 'g': 4}, {'pieza': 'balanza', 'hace': 'balancea', 'en': '22:En el otro', 'hasta': '22:Eso lo decides', 'g': 7}, {'pieza': 'decano', 'hace': 'asiente', 'en': '22:Eso lo decides'}]),
 dict(C['12:Hume'], en='22:Hume', capas=cp('12:Hume')),
 T('22:Las tres preguntas', 'rio', [320, 330, 1.5], [400, 340, 1.2], capas=cp('12:Las tres preguntas'), sfx=sx('12:Las tres preguntas'),
   acciones=[{'pieza': 'cola', 'hace': 'avanza', 'en': '22:Aquí no te decimos', 'g': -25}]),
 dict(C['12:En el próximo episodio'], en='22:En el próximo episodio', capas=cp('12:En el próximo episodio')),
 T('23:Y no te olvides', 'promesas', [640, 360, 1.05], [640, 360, 1.12], capas=cp('13:Y no te olvides'),
   acciones=[{'pieza': 'publico1', 'hace': 'salta', 'en': '23:dale a like'}, {'pieza': 'publico2', 'hace': 'salta', 'en': '23:suscríbete'}, {'pieza': 'decano', 'hace': 'asiente', 'en': '23:la campana'}]),
]
P[0] = dict(P[0])
cfg = {'titulo': viejo['titulo'], 'guion': 'fabrica/herramientas/guion_espanistan-02b.txt', 'sombras': 'historias/espanistan/sombras/ep02', 'pausa': .6,
       'voces': voces, 'negrita': viejo['negrita'], 'planos': P}
json.dump(cfg, open('escenas.json', 'w'), ensure_ascii=False, indent=1)
print(len(P), 'planos', len(voces), 'voces')
