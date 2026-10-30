// Españistán ep. 3 · secuencia H, «Los frascos» (bloques 29–40 y la frase f4). Estilo `jack`, 30 fps. Tiempos del audio (tiempos.js).
// Datos: 03-abascal.md, bloques 6 y 7 (El País; Anticorrupción; Tribunal Supremo; El Español; Fiscalía; TSJ de Castilla-La Mancha).
// Nadie es culpable sin sentencia: cada frasco lleva su etiqueta, tal cual la dice el narrador.
//   b29     Juvenal: dos vigilantes se vigilan con sus lupas. b29.2: los dos se vuelven hacia Acascar.
//   b30     (viento) el laboratorio del Decano: siete frascos en la balda; él entra con el candil.
//   b31–39  cortes secos a cada frasco (el candil lo ilumina) y su sello cuando el narrador dice la etiqueta.
//   b33, f4 (tinta) Acascar de frente: «Los bancos españoles no me querían. Los húngaros, sí. Será por el idioma.» (tinta) y vuelta.
//   b40     la balda entera, todos sellados; el Decano: la lección.
const G = T.guion([29, 30, 31, 32, 33, 'f4', 34, 35, 36, 37, 38, 39, 40]), en = G.en;
const AC = PERSONAJES.acascar, DE = PERSONAJES.decano;
const jack = { jack: true, quieto: true, figura: '#3b3431', sombra: 9, contraluz: 0, bordes: ['rgb(255,226,190)', 'rgb(255,120,70)'], borde: .7 };
const vigilante = n => ciudadano(n, { sombrero: 'gorra', barba: null, gafas: null, objeto: 'lupa', ropa: 'traje' });
const noche = [{ tipo: 'plano', color: '#1f2a44', raya: 'rgba(0,0,0,.25)', luz: 'rgba(120,150,220,.07)', par: .3 }, { tipo: 'astro', x: 1080, y: 120, r: 30, luna: true, par: .3 }, { tipo: 'suelo', par: 1, matas: 0 }];
// los siete frascos: [titulo, icono, etiqueta, bloque en el que se habla de él, cuándo cae el sello]
const F = [
  ['IRÁN · 2014', 'euros', 'SIN CAUSA', en.b31, en.b31 + 4.2],
  ['BANCO\nHÚNGARO', 'banco', 'ARCHIVADO', en.b32, en['b32.2'] + 4.1],
  ['HUCHAS', 'hucha', 'ANULADO', en.b34, en['b34.2'] + 2.3],
  ['PROVEEDORES', 'factura', 'PREGUNTAS\nABIERTAS', en.b35, en.b36 + 4.4],
  ['DANA', 'agua', 'ARCHIVADO', en.b37, en['b37.2'] + 3.4],
  ['DIPUTADO\nCASTILLA-LA MANCHA', 'mazo', 'CONDENADO', en.b38, en['b38.2'] + 5],
  ['LOS QUE\nSE FUERON', 'sillas', 'SIN CAUSA', en.b39, en['b39.2'] + 4.9]];
const X = F.map((_, i) => 100 + i * 150), FIN = [en.b32, en.b33, en.b35, en.b37, en.b38, en.b39, en.b40];   // cuándo deja de hablarse de cada uno
const lab = [{ tipo: 'plano', color: '#5a3a22', raya: 'rgba(0,0,0,.2)', luz: 'rgba(255,200,130,.07)', par: .3 }, { tipo: 'estante', y: 520, x0: 10, x1: 1040, par: 1 },
  ...F.map(([titulo, icono, etiqueta, desde, sella], i) => ({ tipo: 'frasco', x: X[i], y: 520, par: 1, titulo, icono, etiqueta, sella, luz: [desde, FIN[i]] })),
  { tipo: 'suelo', par: 1, matas: 0 }];
// la cámara del laboratorio: general, y un corte seco a cada frasco cuando empieza su bloque (y otro más cerca cuando cae el sello)
const corte = (t, x, y, z) => [[t, x, y, z]];
const camLab = [[0, 600, 380, 1], ...F.flatMap(([, , , desde, sella], i) => [[desde - .05, 600, 380, 1], [desde - .05, X[i], 400, 2.3], [sella - .3, X[i], 400, 2.3], [sella - .3, X[i], 430, 3]])];
const camaraDesde = t0 => { const c = camLab.filter(k => k[0] >= t0); const antes = camLab.filter(k => k[0] < t0).pop() || camLab[0]; return [[t0, antes[1], antes[2], antes[3]], ...c]; };
window.ESCENA = {
  dura: G.fin, fps: 30, suelo: 600, voces: G.voces,
  sonidos: F.map(f => ({ en: f[4], archivo: 'audio/sfx/impacto.mp3', volumen: .22 })),
  carteles: [
    { en: en.b29 + .5, hasta: en.b30 - .3, x: 40, y: 40, ancho: 560, titulo: 'Juvenal', filas: [['«¿Quién vigila a los vigilantes?»', '']], fuente: 'Juvenal, Sátiras' },
    { en: en.b30 + .3, hasta: en.b31 - .2, x: 40, y: 40, ancho: 560, titulo: 'Las reglas', paso: 1.6, filas: [['Nadie es culpable', 'sin sentencia'], ['Cada frasco', 'con su etiqueta']], fuente: 'Españistán' },
    { en: en.b32 + .5, hasta: en.b33 - .2, x: 40, y: 40, ancho: 520, titulo: 'Préstamo de 2023', filas: [['De un banco húngaro', '6,5 millones €']], fuente: 'El País · Anticorrupción (2025)' },
    { en: en.b34 + .5, hasta: en.b35 - .2, x: 40, y: 40, ancho: 560, titulo: 'Las huchas', paso: en['b34.2'] - en.b34 - .5, filas: [['Multa del Tribunal de Cuentas', '862.000 €'], ['Tribunal Supremo, junio de 2026', 'anulada', '#2c4a1a']], fuente: 'Tribunal Supremo (2026)' },
    { en: en.b35 + .5, hasta: en.b37 - .2, x: 40, y: 40, ancho: 600, titulo: 'Los proveedores', paso: 1.2, filas: [['A la empresa del asesor', '≈ 27.000 €/mes'], ['Empleados de esa empresa', '0']], fuente: 'El Español (2026)' },
    { en: en.b38 + .5, hasta: en.b39 - .2, x: 40, y: 40, ancho: 620, titulo: 'Diputado en Castilla-La Mancha · 2024', filas: [['Administración desleal (negocio privado)', '6 meses']], fuente: 'TSJ de Castilla-La Mancha' },
    { en: en.b40 + .4, hasta: G.fin - .2, x: 40, y: 40, ancho: 600, titulo: 'Lección del Decano', paso: (en['b40.2'] - en.b40) / 2,
      filas: [['Ninguna condena al partido', 'a favor', '#2c4a1a'], ['La corrupción crece', 'con tiempo y poder'], ['Vox ha tenido', 'poco de los dos']], fuente: 'estudio del ep. 2' }],
  planos: [
    { desde: 0, ...jack, tinte: 'noche', viento: .3, decorado: noche, camara: [[0, 640, 330, 1.05]],
      actores: [
        { p: vigilante(90), x: 300, mira: 1, acciones: [{ hace: 'senala', en: en.b29 + 1, hasta: en.b29 + 3 }, { hace: 'senala', en: en.b29 + 4.4, hasta: en['b29.2'] }] },
        { p: vigilante(91), x: 980, mira: -1, acciones: [{ hace: 'senala', en: en.b29 + 2.6, hasta: en['b29.2'] }] }] },
    { desde: en['b29.2'] - .1, ...jack, tinte: 'noche', viento: .3, decorado: noche, camara: [[0, 640, 330, 1.1]],   // corte: los dos vigilantes, ahora hacia Acascar
      actores: [
        { p: vigilante(90), x: 360, mira: 1, acciones: [{ hace: 'senala', en: en['b29.2'] + .3, hasta: en.b30 }] },
        { p: vigilante(91), x: 920, mira: -1, acciones: [{ hace: 'senala', en: en['b29.2'] + .5, hasta: en.b30 }] },
        { p: AC, x: 640, vista: 'frente', acciones: [{ hace: 'encoge', en: en['b29.2'] + 1.2, hasta: en['b29.2'] + 3 }] }] },
    { desde: en.b30 - .2, transicion: 'viento', ...jack, viento: .1, decorado: lab, camara: camaraDesde(en.b30 - .2),
      actores: [{ p: DE, x: 1360, mira: -1, acciones: [{ hace: 'camina', en: en.b30, hasta: en.b30 + 2.8, a: 1180 }, { hace: 'senala', en: en.b30 + 3, hasta: en.b31 }] }] },
    { desde: en.b33 - .2, transicion: 'tinta', ...jack, viento: .3, decorado: [{ tipo: 'plano', color: '#7a2a1c', par: .3 }, { tipo: 'suelo', par: 1, matas: 0 }],
      actores: [{ p: AC, x: 640, vista: 'frente', acciones: [{ hace: 'habla', en: en.f4, hasta: en.f4 + 5.5 }, { hace: 'encoge', en: en.f4 + 3.6, hasta: en.f4 + 5.6 }] }],
      camara: [[0, 640, 290, 2], [en.b34, 640, 285, 2.12]] },
    { desde: en.b34 - .2, transicion: 'tinta', ...jack, viento: .1, decorado: lab, camara: camaraDesde(en.b34 - .2), actores: [] },
    { desde: en.b40 - .2, ...jack, viento: .1, decorado: lab, camara: [[0, 640, 380, 1], [G.fin, 620, 370, 1.05]],
      actores: [{ p: DE, x: 1180, mira: -1, acciones: [{ hace: 'piensa', en: en.b40 + .3, hasta: en['b40.2'] - .3 }, { hace: 'senala', en: en['b40.2'], hasta: G.fin }] }] },
  ],
};
