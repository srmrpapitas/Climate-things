# Españistán ep. 3 · Acascar y Vox: escribe escenas.json para fabrica/generar.py.
# Uso: python3 hacer_escenas.py && /home/user/qw/bin/python -I ../../generar.py escenas.json
# Voces: 1 b01 · 2 b02 · 3 b03 · 4 f1 · 5 b04 · 6 b05 · 7 f2 · 8 b06 · 9 b07 · 10 f3 · 11 b08 · 12 b09 · 13 b10 · 14 f4 · 15 b11 · 16 b12 · 17 f5 · 18 b13 · 19 b14 · 20 b15
import json
L = 'audio/voz/es/espanistan-03/'; F = L + 'acascar/'
V = [('b01', '1-4'), ('b02', '5-8'), ('b03', '9-12'),
     (F + 'f1_sueldo', 'A mí nadie me ha regalado nada. Bueno... salvo aquel sueldo. Pero era vocación.'),
     ('b04', '13-16'), ('b05', '17-21'),
     (F + 'f2_caballo', 'Los jóvenes me adoran. Será por el caballo.'),
     ('b06', '22'), ('b07', '23-24'),
     (F + 'f3_chiringuitos', 'Hay que cerrar todos los chiringuitos. Empezando por los de los demás.'),
     ('b08', '25-28'), ('b09', '29-31'), ('b10', '32-33'),
     (F + 'f4_hungaros', 'Los bancos españoles no me querían. Los húngaros, sí. Será por el idioma.'),
     ('b11', '34-40'), ('b12', '41-42'),
     (F + 'f5_manodura', 'Yo prometo mano dura. Lo de cómo se paga, ya si eso, después.'),
     ('b13', '43'), ('b14', '44-50'), ('b15', '51')]
voces = []
for i, (a, x) in enumerate(V):
    f = a.startswith(F); sig = i + 1 < len(V) and V[i + 1][0].startswith(F)
    v = {'archivo': (a if f else L + a) + '.mp3', 'pausa': .5 if f or sig else 1.0}
    if f: v.update(texto=x, quien='acascar')
    else: v['lineas'] = x
    voces.append(v)

T = lambda en, escena, cam, cam2, **k: dict(en=en, tipo='teatro', escena=escena, cam=cam, cam2=cam2, **k)
R = lambda en, img, lado, z=(1, 1.06), y=0: dict(en=en, tipo='retrato', img=img, lado=lado, z=list(z), y=y, musica='neutro')
DEC = lambda en, cam, cam2, **k: dict(en=en, tipo='decano', cam=cam, cam2=cam2, **k)
A = lambda pieza, hace, en, **k: dict(pieza=pieza, hace=hace, en=en, **k)
PT = lambda tipo, **k: dict(tipo=tipo, **k)
cita = lambda autor, texto, en, **k: dict(tipo='cita', autor=autor, texto=texto, en=en, **k)
frasco = lambda nombre, corto, texto, etq, color, fuente, en, hasta: dict(tipo='frasco', nombre=nombre, corto=corto, texto=texto, etiqueta=etq, color=color, fuente=fuente, en=en, hasta=hasta)

P = [
 # 0 · intro
 dict(en=0, tipo='cueva', cam=[640, 300, 1.15], cam2=[450, 210, 1.9], musica='misterio'),
 DEC('1:Montaigne', [870, 245, 2.6], [860, 250, 2.2], musica='misterio',
     capas=[cita('MONTAIGNE · 1580', 'Nada se cree con tanta fuerza como lo que menos se conoce.', '1:Montaigne', hasta='1:Así que hoy')]),
 T('1:Este es Acascar', 'caballo', [500, 300, 1.9], [640, 360, 1.05], musica='neutro',
   particulas=[PT('pajaros', n=8, zona=[0, 40, 1280, 260])],
   capas=[dict(tipo='nota', texto='Acascar', sub='Líder de Vox, el tercer partido', dato='2014: 0 diputados · 2026: ~19 % en las encuestas', pos='der', en='1:Este es Acascar', hasta='1:Mismas reglas')],
   acciones=[A('jinete', 'alza', '1:Este es Acascar', g=5, hasta='1:el tercer partido'), A('bandera', 'balancea', '1:Este es Acascar', g=6, hasta='1:Mismas reglas'),
             A('publico', 'salta', '1:el tercer partido', hasta='1:Mismas reglas'), A('m1', 'camina', '1:Hace doce años', g=60, hasta='1:Mismas reglas'), A('m2', 'camina', '1:Hace doce años', g=60, hasta='1:Mismas reglas'),
             A('m3', 'camina', '1:Hoy las encuestas', g=50, hasta='1:Mismas reglas'), A('ave', 'arrastra', '1:Este es Acascar', g=-500, hasta='1:Mismas reglas')]),
 T('1:Mismas reglas', 'tribunal', [780, 200, 1.5], [700, 330, 1.15], musica='neutro',
   acciones=[A('balanza', 'balancea', '1:Mismas reglas', hasta='1:lo bueno', g=4), A('decano', 'asiente', '1:la palabra exacta')]),
 # 1 · quién es
 T('2:Acascar creció', 'amurrio', [640, 330, 1.05], [400, 470, 1.45], musica='misterio',
   particulas=[PT('chispas', en='2:ETA amenazó', n=60, zona=[90, 360, 340, 610]), PT('humo', en='2:ETA amenazó', n=22, zona=[40, 120, 360, 600])],
   zooms=[['2:El padre vivía', 520, 520, 1.9, 1.2], ['2:El hijo entró', 930, 520, 2.1, 1.2]],
   capas=[dict(tipo='nota', texto='Amurrio (Álava)', sub='Años de ETA', dato='1999: la tienda del padre, quemada', pos='der', en='2:ETA amenazó', hasta='2:El padre vivía')],
   acciones=[A('llamas', 'crece', '2:ETA amenazó', g=.6, hasta='2:El padre vivía'), A('llamas', 'tiembla', '2:escaparates rotos', g=2, hasta='2:El padre vivía'),
             A('mujer', 'niega', '2:pintadas', hasta='2:la tienda acabó'), A('nino', 'tiembla', '2:la tienda acabó', g=1.5),
             A('padre', 'inclina', '2:El padre vivía', g=8, hasta='2:El hijo entró'), A('escolta', 'alza', '2:con escolta', g=6, hasta='2:El hijo entró'),
             A('vigia', 'asiente', '2:con escolta'), A('chico', 'camina', '2:El hijo entró', g=-60, hasta='2:Aristóteles'), A('chico', 'asiente', '2:diputado en el Parlamento')]),
 DEC('2:Aristóteles', [870, 245, 2.4], [860, 250, 2.6], musica='misterio',
     capas=[cita('ARISTÓTELES', 'El valor es el punto medio entre el miedo y la temeridad.', '2:Aristóteles', hasta='2:La pregunta del Decano'),
            dict(tipo='sello', texto='¿QUÉ HACES CON EL MIEDO?', en='2:qué hace esa persona')], sfx=[['impacto', '2:qué hace esa persona', .3]]),
 # 2 · el sueldo
 T('3:En dos mil diez', 'despacho', [420, 360, 1.6], [640, 360, 1.1], musica='neutro',
   particulas=[PT('monedas', en='3:Cobraba', hasta='3:El diecisiete', n=35, zona=[980, 60, 1240, 600])],
   capas=[dict(tipo='comparacion', izq=dict(titulo='Acascar (2011-2013)', texto='82.491 € al año + 11.363 € de plus'), der=dict(titulo='Presidente del Gobierno', texto='78.185 € al año', en='3:Más que el presidente'), en='3:Cobraba', hasta='3:El diecisiete')],
   acciones=[A('reina', 'asiente', '3:Esperanza Aguirre', hasta='3:lo nombró'), A('llave', 'arrastra', '3:lo nombró', g=40, hasta='3:de la Comunidad'), A('joven', 'inclina', '3:lo nombró', g=-6, hasta='3:Cuando la agencia'),
             A('escribiente', 'camina', '3:Cuando la agencia', g=-90, hasta='3:Cobraba'), A('sacos', 'crece', '3:Cobraba', g=.25, hasta='3:El diecisiete'), A('joven', 'salta', '3:Más que el presidente', g=6)]),
 T('3:El diecisiete', 'despacho', [900, 380, 1.5], [800, 360, 1.25], musica='misterio',
   capas=[dict(tipo='sello', texto='EL MISMO DÍA: NACE VOX', en='3:se registró un partido')], sfx=[['golpe', '3:se registró un partido', .4]],
   acciones=[A('sacos', 'desaparece', '3:la fundación se disolvió'), A('pila', 'cae', '3:la fundación se disolvió', g=40, hasta='3:Ese mismo día'), A('joven', 'alza', '3:se registró un partido', g=10)]),
 R('4:A mí', 'p1', 1),
 # 3 · por qué fundó Vox
 T('5:Vox nace', 'fundacion', [640, 360, 1.05], [640, 330, 1.2], musica='neutro',
   zooms=[['5:En la mesa fundadora', 640, 380, 1.2, 1.0], ['5:Alejo Vidal-Quadras', 510, 380, 1.7, 1.0], ['5:José Antonio Ortega Lara', 340, 400, 1.8, 1.2]],
   capas=[dict(tipo='lista', titulo='Contra Rajoy, lo acusaban de blando con…', marca='✗', items=[dict(texto='los presos de ETA que salieron', en='5:los presos'), dict(texto='los impuestos', en='5:con los impuestos'), dict(texto='el independentismo catalán', en='5:el independentismo')], en='5:Lo acusaban', hasta='5:En la mesa fundadora'),
          dict(tipo='nota', texto='Ortega Lara', sub='Funcionario de prisiones', dato='532 días secuestrado por ETA', pos='der', en='5:José Antonio Ortega Lara', hasta='5:Se presentaron')],
   acciones=[A('f4', 'niega', '5:Vox nace', hasta='5:Lo acusaban'), A('f2', 'inclina', '5:Lo acusaban', g=5, hasta='5:En la mesa'), A('perro', 'camina', '5:los impuestos', g=-80, hasta='5:En la mesa'),
             A('f3', 'alza', '5:estaban Acascar', g=8), A('f2', 'asiente', '5:Alejo Vidal-Quadras'), A('f1', 'asiente', '5:José Antonio Ortega Lara'), A('asta', 'balancea', '5:En la mesa', g=3, hasta='5:Se presentaron')]),
 T('5:Se presentaron', 'europeas', [640, 360, 1.05], [800, 380, 1.35], musica='misterio',
   particulas=[PT('estrellas', n=40, zona=[80, 40, 1200, 260]), PT('monedas', en='5:el ochenta por ciento', hasta='5:Vidal-Quadras dijo', n=24, zona=[560, 380, 780, 600])],
   capas=[dict(tipo='dato', pos='izq', valor='80 %', texto='de la campaña de 2014, de simpatizantes de la oposición iraní', fuente='El País, 2019', color='rojo', en='5:el ochenta por ciento', hasta='5:Nunca hubo')],
   acciones=[A('orador', 'alza', '5:Se presentaron', g=8, hasta='5:y no sacaron'), A('urna', 'tiembla', '5:ni un escaño', g=2), A('orador', 'inclina', '5:ni un escaño', g=6, hasta='5:Aquella campaña'),
             A('barca', 'entra', '5:Aquella campaña', g=-700, hasta='5:el ochenta por ciento'), A('barca', 'balancea', '5:el ochenta', g=4, hasta='5:De aquella mesa'),
             A('encapuchado', 'inclina', '5:simpatizantes', g=6), A('saco', 'arrastra', '5:simpatizantes', g=-220, hasta='5:Vidal-Quadras dijo'), A('mujer', 'niega', '5:Acascar dijo'),
             A('orador', 'asiente', '5:todo era legal'), A('gente', 'sale', '5:Vidal-Quadras se fue', g=500, hasta='5:De aquella mesa')]),
 T('5:De aquella mesa', 'fundacion', [640, 360, 1.1], [330, 340, 1.6], musica='misterio',
   capas=[dict(tipo='nota', texto='La mesa fundadora', sub='Además del propio Acascar…', dato='hoy solo sigue Ortega Lara', pos='der', en='5:hoy solo queda')],
   acciones=[A('f2', 'desaparece', '5:De aquella mesa'), A('f4', 'desaparece', '5:hoy solo queda'), A('f1', 'asiente', '5:Ortega Lara')]),
 # 4 · la subida
 T('6:Cuatro años', 'hemiciclo', [640, 360, 1.05], [640, 300, 1.25], musica='esperanza',
   capas=[dict(tipo='barras', titulo='Diputados de Vox', unidad='', filas=[['Andalucía 2018', 12, 'verde'], ['Abril 2019', 24, 'verde'], ['Nov. 2019', 52, 'verde'], ['2023', 33, 'verde'], ['Encuestas 2026', 68, 'ambar']],
               fuente='Ministerio del Interior · Sigma Dos y GAD3 (12-10-2026)', en='6:doce diputados', hasta='6:Sube sobre todo',
               items=[dict(en='6:doce diputados'), dict(en='6:veinticuatro'), dict(en='6:cincuenta y dos'), dict(en='6:treinta y tres'), dict(en='6:sesenta y ocho')])],
   acciones=[A('orador', 'alza', '6:cincuenta y dos', g=18, hasta='6:En dos mil veintitrés'), A('orador', 'inclina', '6:bajó a treinta', g=6, hasta='6:Y en octubre'), A('orador', 'saluda', '6:su mejor marca')]),
 T('6:Sube sobre todo', 'caballo', [900, 420, 1.6], [640, 360, 1.05], musica='esperanza',
   particulas=[PT('pajaros', n=10, zona=[0, 40, 1280, 260]), PT('papeles', en='6:Lo bueno', n=25)],
   capas=[dict(tipo='sello', texto='SE DEBE ENTENDER', en='6:se debe entender')], sfx=[['golpe', '6:se debe entender', .35]],
   acciones=[A('publico', 'salta', '6:menores de cuarenta', hasta='6:Lo bueno'), A('publico', 'asiente', '6:nadie les escuchaba', hasta='6:Eso no se puede'), A('bandera', 'balancea', '6:Sube sobre todo', g=8, hasta='7:Los jóvenes'),
             A('m4', 'alza', '6:votos que se van del PP', g=8), A('m1', 'camina', '6:votos que se van', g=90, hasta='6:Lo bueno'), A('m2', 'camina', '6:votos que se van', g=90, hasta='6:Lo bueno'),
             A('jinete', 'alza', '6:Acascar tiene', g=5), A('ave', 'arrastra', '6:Lo bueno', g=-600, hasta='7:Los jóvenes')]),
 R('7:Los jóvenes', 'p2', -1),
 DEC('8:Pregunta del Decano', [870, 245, 2.3], [870, 250, 2.6], musica='misterio',
     capas=[dict(tipo='sello', texto='¿POR O CONTRA?', en='8:contra quién')], sfx=[['impacto', '8:contra quién', .3]]),
 # 5 · promesas contra hechos
 T('9:Vox prometió', 'chiringuitos', [640, 360, 1.05], [380, 380, 1.5], musica='neutro',
   particulas=[PT('pajaros', n=7, zona=[0, 30, 1280, 220])],
   acciones=[A('martillo', 'golpea', '9:acabar con los chiringuitos', hasta='9:Acascar lo dice'), A('choza', 'cae', '9:para colocar', g=300, hasta='9:Acascar lo dice')]),
 R('10:Hay que cerrar', 'p1', 1, (1.15, 1.25), 30),
 T('11:Y aquí, la letra', 'chiringuitos', [900, 380, 1.5], [1000, 380, 1.7], musica='misterio',
   particulas=[PT('monedas', en='11:cuatro millones', hasta='11:En dos mil veintitrés entró', n=35, zona=[880, 80, 1240, 520])],
   capas=[dict(tipo='dato', pos='izq', valor='4,5 M€', texto='de Vox a su fundación, Disenso (2023-2024)', fuente='Cuentas de Vox · El Español', color='ambar', en='11:cuatro millones', hasta='11:En dos mil veintitrés entró')],
   acciones=[A('obreros', 'arrastra', '11:sobre todo de dinero', g=260, hasta='11:En dos mil veintitrés entró')]),
 T('11:En dos mil veintitrés entró', 'castillos', [640, 360, 1.05], [640, 360, 1.3], musica='neutro',
   zooms=[['11:En dos mil veintiséis', 640, 330, 1.5, 1.2]],
   capas=[dict(tipo='nota', texto='2023 → 2024 → 2026', sub='Entra, se va por los menores migrantes, vuelve', dato='«Prioridad nacional» en las ayudas', pos='der', en='11:En julio', hasta='11:Cicerón')],
   acciones=[A('hombre', 'alza', '11:entró en cinco', g=14, hasta='11:En julio'), A('hombre', 'sale', '11:se salió de todos', g=800, hasta='11:por el reparto'),
             A('hombre', 'entra', '11:ha vuelto', g=-800, hasta='11:vicepresidencias'), A('granjeros', 'asiente', '11:prioridad nacional', hasta='11:Cicerón')]),
 DEC('11:Cicerón', [860, 250, 2.4], [760, 260, 2.1],
     capas=[cita('CICERÓN', '¿Cui bono? ¿A quién beneficia?', '11:a quién beneficia')], sfx=[['impacto', '11:donde ya mandan', .3]]),
 # 6 · los frascos
 DEC('12:Juvenal', [870, 245, 2.5], [860, 250, 2.2], musica='tension',
     capas=[cita('JUVENAL', '¿Quién vigila a los vigilantes?', '12:quién vigila', hasta='12:Mismas reglas')]),
 T('12:Mismas reglas', 'tribunal', [260, 380, 1.6], [300, 380, 1.4], musica='tension',
   capas=[dict(tipo='sello', texto='PRESUNCIÓN DE INOCENCIA', en='12:nadie es culpable', hasta='12:Primer frasco')],
   acciones=[A('decano', 'asiente', '12:nadie es culpable')]),
 T('12:Primer frasco', 'europeas', [700, 400, 1.6], [640, 380, 1.3], musica='tension',
   particulas=[PT('estrellas', n=40, zona=[80, 40, 1200, 260]), PT('monedas', en='12:ochenta por ciento', n=18, zona=[560, 380, 780, 600])],
   capas=[frasco('El dinero iraní', 'Irán', '2014: el 80 % de la campaña europea, de simpatizantes de la oposición iraní en el exilio.', 'SIN CAUSA', 'gris', 'El País · 3Cat', '12:Primer frasco', '13:Segundo frasco')],
   acciones=[A('barca', 'balancea', '12:Primer frasco', g=4, hasta='13:Segundo frasco'), A('encapuchado', 'asiente', '12:Primer frasco'), A('urna', 'late', '12:Nunca hubo causa', g=.05)]),
 T('13:Segundo frasco', 'banco', [640, 360, 1.05], [760, 380, 1.4], musica='tension',
   capas=[frasco('El banco húngaro', 'Banco', '2023: préstamo de 6,5 M€ de un banco cercano a Orbán. Devuelto en 2024.', 'ARCHIVADO', 'gris', 'Fiscalía Anticorrupción, 2025', '13:Segundo frasco', '14:Los bancos')],
   acciones=[A('banquero', 'inclina', '13:Vox pidió', g=6), A('saco', 'arrastra', '13:seis millones', g=-160, hasta='13:Anticorrupción'), A('cola', 'camina', '13:Anticorrupción', g=120, hasta='13:Acascar tiene'), A('barco', 'arrastra', '13:Segundo frasco', g=400, hasta='14:Los bancos')]),
 R('14:Los bancos', 'p2', -1, (1.1, 1.2), 20),
 T('15:Tercer frasco', 'huchas', [640, 360, 1.05], [760, 360, 1.3], musica='tension',
   particulas=[PT('monedas', en='15:Tercer frasco', hasta='15:Cuarto frasco', n=25, zona=[200, 100, 700, 500])],
   capas=[frasco('Las huchas', 'Huchas', 'Multa de 862.000 € del Tribunal de Cuentas. El Supremo la anuló: no se probó.', 'ANULADO', 'verde', 'Tribunal Supremo, 3-6-2026', '15:Tercer frasco', '15:Cuarto frasco'),
          dict(tipo='sello', texto='ESTO TAMBIÉN SE CUENTA', en='15:Esto también se cuenta', hasta='15:Cuarto frasco')],
   acciones=[A('juez', 'inclina', '15:multó', g=6, hasta='15:En junio'), A('juez', 'niega', '15:anuló la multa'), A('gente', 'salta', '15:Esto también')]),
 T('15:Cuarto frasco', 'despacho', [640, 360, 1.05], [900, 380, 1.4], musica='tension',
   particulas=[PT('monedas', en='15:veintisiete mil euros', hasta='15:Quinto frasco', n=30, zona=[600, 80, 1200, 560]), PT('papeles', en='15:PP y PSOE', hasta='15:Quinto frasco', n=20)],
   capas=[frasco('Los proveedores', 'Tizona', 'Casi 27.000 € al mes a la empresa de su asesor, sin empleados. Su mujer: 63.600 € al año de una editorial del mismo grupo.', 'SIN CAUSA · PREGUNTAS ABIERTAS', 'ambar', 'El Confidencial · El Español, 2026', '15:Cuarto frasco', '15:Quinto frasco')],
   acciones=[A('sacos', 'late', '15:veintisiete mil euros', g=.08, hasta='15:Vox dice'), A('escribiente', 'camina', '15:Vox dice', g=-160, hasta='15:PP y PSOE'), A('reina', 'niega', '15:PP y PSOE'), A('dama', 'asiente', '15:la mujer de Acascar')]),
 T('15:Quinto frasco', 'dana', [640, 360, 1.05], [500, 380, 1.4], musica='silencio',
   particulas=[PT('lluvia', n=140)],
   capas=[frasco('La dana', 'Dana', 'Revuelta recogió donativos para Valencia. Dos miembros de Vox la denunciaron. La Fiscalía archivó.', 'ARCHIVADO', 'gris', 'El Español, 21-4-2026', '15:Quinto frasco', '15:Sexto frasco')],
   acciones=[A('voluntarios', 'camina', '15:recogió donativos', g=180, hasta='15:Dos miembros'), A('carro', 'arrastra', '15:recogió donativos', g=140, hasta='15:La Fiscalía'), A('balcon', 'tiembla', '15:quedarse parte', g=1.5)]),
 T('15:Sexto frasco', 'tribunal', [700, 300, 1.25], [700, 330, 1.15], musica='tension',
   capas=[frasco('Un diputado', 'Diputado', '2024: diputado de Vox en Castilla-La Mancha, 6 meses por administración desleal en un negocio privado.', 'CONDENADO', 'rojo', 'Juzgado de lo Penal, 2024', '15:Sexto frasco', '15:Y el último')],
   acciones=[A('balanza', 'inclina', '15:fue condenado', g=7, hasta='15:Y el último'), A('r3', 'inclina', '15:administración desleal', g=5), A('r4', 'niega', '15:no por dinero público')]),
 T('15:Y el último', 'fundacion', [640, 360, 1.1], [330, 340, 1.5], musica='tension',
   capas=[frasco('Los que se fueron', 'Fugas', 'Vidal-Quadras, Espinosa de los Monteros, Olona… varios se fueron pidiendo cuentas.', 'SIN CAUSA', 'gris', 'Valencia Plaza · Newtral', '15:Y el último', '15:Lección del Decano')],
   acciones=[A('f2', 'sale', '15:Vidal-Quadras', g=-900, hasta='15:Espinosa'), A('f4', 'sale', '15:Espinosa', g=900, hasta='15:Macarena'), A('perro', 'sale', '15:Macarena', g=900, hasta='15:Casi todos'), A('f3', 'niega', '15:no explicaba')]),
 DEC('15:Lección del Decano', [870, 245, 2.5], [800, 260, 2.1], musica='misterio',
     capas=[dict(tipo='dato', pos='der', valor='Poco tiempo, poco poder', texto='Sin condenas al partido. ¿Y con mucho poder?', en='15:no haya condenas')], sfx=[['impacto', '15:qué haría con mucho', .3]]),
 # 7 · lo que promete
 T('16:Para el veintinueve', 'muralla', [640, 360, 1.05], [520, 330, 1.35], musica='tension',
   particulas=[PT('papeles', en='16:menos impuestos', n=20)],
   capas=[dict(tipo='lista', titulo='Programa para el 29 de noviembre', items=[dict(texto='«Prioridad nacional» en ayudas y vivienda', en='16:prioridad nacional'), dict(texto='Más expulsiones', en='16:más expulsiones'), dict(texto='Menos impuestos', en='16:menos impuestos')], en='16:prioridad nacional', hasta='16:Acascar lo tiene')],
   acciones=[A('orador', 'golpea', '16:Vox pone', hasta='16:Acascar lo tiene'), A('muro', 'sube', '16:más expulsiones', g=40, hasta='16:Acascar lo tiene'), A('viajeros', 'camina', '16:más expulsiones', g=260, hasta='17:Yo')]),
 R('17:Yo prometo', 'p1', 1, (1.2, 1.32), 40),
 DEC('18:Pregunta del Decano', [870, 245, 2.3], [870, 250, 2.6], musica='misterio',
     capas=[dict(tipo='lista', titulo='La misma pregunta de siempre', marca='?', items=[dict(texto='¿Cuánto cuesta?', en='18:cuánto cuesta'), dict(texto='¿Quién lo paga?', en='18:quién lo paga'), dict(texto='¿Quién hará esos trabajos?', en='18:quién hará')], en='18:cuánto cuesta')]),
 # 8 · balanza y consejo
 T('19:Balance', 'tribunal', [780, 200, 1.5], [700, 330, 1.15], musica='neutro',
   capas=[dict(tipo='comparacion', izq=dict(titulo='En un plato', texto='Creció bajo la amenaza de ETA · escucha a millones · ninguna condena al partido'),
               der=dict(titulo='En el otro', texto='Sueldo público alto · campaña pagada desde fuera · banco de Orbán · fundación propia · fundadores que se fueron', en='19:En el otro'), en='19:En un plato', hasta='19:Cuál pesa más'),
          dict(tipo='sello', texto='LO DECIDES TÚ', en='19:Eso lo decides')], sfx=[['golpe', '19:Eso lo decides', .4]],
   acciones=[A('balanza', 'balancea', '19:En un plato', hasta='19:En el otro', g=4), A('balanza', 'balancea', '19:En el otro', hasta='19:Eso lo decides', g=7), A('decano', 'asiente', '19:Eso lo decides')]),
 DEC('19:Hume', [860, 250, 2.4], [760, 260, 2.1], capas=[cita('DAVID HUME', 'El sabio ajusta lo que cree a las pruebas.', '19:el sabio')]),
 T('19:Las tres preguntas', 'hemiciclo', [640, 360, 1.05], [640, 330, 1.2], musica='neutro',
   capas=[dict(tipo='lista', titulo='Tres preguntas, con este partido y con todos', marca='?', items=[dict(texto='¿Qué prometieron y qué cumplieron donde ya mandan?', en='19:qué prometieron'), dict(texto='¿Son euros o porcentajes?', en='19:Son euros'), dict(texto='¿Me fío de la gente de la que se rodean?', en='19:Me fío')], hasta='19:Aquí no te decimos'),
          dict(tipo='sello', texto='VOTA PENSANDO', en='19:votes pensando')], sfx=[['impacto', '19:votes pensando', .35]],
   acciones=[A('orador', 'asiente', '19:Aquí no te decimos')]),
 dict(en='19:En el próximo episodio', tipo='cueva', cam=[640, 360, 1.05], cam2=[640, 330, 1.2], musica='misterio',
      capas=[dict(tipo='titulo', h1='ESPAÑISTÁN', h2='Próximo episodio: el bipartidismo', p='Listas cerradas: ¿a quién le deben su sillón?', en='19:En el próximo episodio')]),
 T('20:Y no te olvides', 'caballo', [640, 360, 1.05], [640, 360, 1.12], musica='neutro',
   particulas=[PT('pajaros', n=10, zona=[0, 40, 1280, 260]), PT('papeles', n=25)],
   capas=[dict(tipo='suscribete', en='20:dale a like', hasta='20:próximo episodio'), dict(tipo='titulo', h1='ESPAÑISTÁN', h2='Episodio 3 · Acascar y Vox', p='Fuentes en la descripción', en='20:próximo episodio')],
   acciones=[A('publico', 'salta', '20:dale a like'), A('bandera', 'balancea', '20:dale a like', g=8, hasta='20:próximo episodio'), A('jinete', 'alza', '20:suscríbete', g=5), A('m1', 'salta', '20:la campana'), A('m2', 'salta', '20:la campana')]),
]
NEG = ['Acascar', 'Vox', 'Montaigne', 'tercer partido', 'veinte por ciento', 'datos públicos', 'palabra exacta', 'lo bueno', 'ETA', 'quemada', 'escolta', 'Aristóteles',
       'miedo', 'Esperanza Aguirre', 'ochenta y dos mil', 'setenta y ocho mil', 'Ese mismo día', 'Rajoy', 'blando', 'Ortega Lara', 'quinientos treinta y dos días',
       'ni un escaño', 'ochenta por ciento', 'oposición iraní', 'todo era legal', 'causa judicial', 'doce diputados', 'cincuenta y dos', 'treinta y tres', 'diecinueve por ciento',
       'sesenta y ocho', 'menores de cuarenta y cinco', 'nadie les escuchaba', 'se debe entender', 'propone', 'contra quién', 'chiringuitos', 'letra pequeña', 'dinero público',
       'cuatro millones y medio', 'Disenso', 'cinco gobiernos', 'menores migrantes', 'prioridad nacional', 'a quién beneficia', 'donde ya mandan', 'Juvenal', 'vigila a los vigilantes',
       'sentencia', 'sin causa', 'banco húngaro', 'Orbán', 'archivado', 'ochocientos sesenta y dos mil', 'anuló la multa', 'anulado', 'veintisiete mil', 'sin empleados',
       'sesenta y tres mil seiscientos', 'Preguntas abiertas', 'Revuelta', 'Fiscalía', 'administración desleal', 'condenado', 'pedir cuentas', 'no explicaba bien sus cuentas',
       'poco poder', 'inmigración', 'expulsiones', 'menos impuestos', 'cuánto cuesta', 'quién lo paga', 'lo decides tú', 'a las pruebas', 'votes pensando', 'el bipartidismo',
       'listas cerradas', 'dale a like', 'suscríbete', 'la campana']
cfg = {'titulo': 'Españistán 3 · Acascar y Vox', 'guion': 'fabrica/herramientas/guion_espanistan-03.txt', 'sombras': 'historias/espanistan/sombras/ep03',
       'retratos': 'historias/espanistan/retratos/acascar', 'pausa': .6, 'voces': voces, 'negrita': NEG, 'planos': P}
json.dump(cfg, open('escenas.json', 'w'), ensure_ascii=False, indent=1)
print(len(P), 'planos', len(voces), 'voces')
