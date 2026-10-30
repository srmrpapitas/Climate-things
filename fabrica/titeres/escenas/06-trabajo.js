// Españistán ep. 6 · secuencia 5, «El trabajo» (bloques 11–14). `cartoon`, de día. Plan: CAPITULO-06-PLANOS.md.
//   b11  el contador de afiliados corre hasta 3.635.979; «dieciséis por ciento» → la tarta de seis trozos, uno sale y se ilumina.
//   b12  metamorfosis en hojas: un paisaje largo y la cámara lo recorre sin cortar: el campo (invernaderos), el bar y la casa del abuelo,
//        cada sitio en su palabra; en «mayores» el recién llegado ayuda al abuelo a levantarse.
//   b13  (tajo) las dos líneas: GENTE sube deprisa, CASAS despacio; el hueco se pinta de rojo con «+6 % a +11 % en el precio».
//   b14  (sin cortar) la cámara baja: «setecientas cincuenta mil casas» → contador en rojo; «Pero suma» → sello.
const G = T.guion([11, 12, 13, 14]), en = G.en, k = G.k, P = PERSONAJES;
const cartoon = { cartoon: true, jack: true, figura: '#2b2235', sombra: 8, contraluz: 0, bordes: ['rgb(150,210,255)', 'rgb(255,150,90)'], borde: .8 };
const COTIZABAN = k(11, 'cotizaban'), RECORD = k(11, 'Récord'), DIECISEIS = k(11, 'dieciséis'), CAMPO = k(12, 'campo'), HOSTE = k(12, 'hostelería'), MAYORES = k(12, 'mayores'),
  DEPRISA = k(13, 'deprisa'), CASAS = k(13, 'casas'), ESTUDIO = k(13, 'estudio'), PRECIO = k(13, 'precio'), SEIS = k(13, 'seis y un once'), FALTAN = k(14, 'faltan'), SUMA = k(14, 'Pero suma');
const nota = (en0, hasta, titulo, filas, fuente, x = 830) => ({ en: en0, hasta, x, y: 40, ancho: 420, titulo, filas, fuente });
const cielo = [{ tipo: 'cieloNoche', arriba: '#3d74b8', abajo: '#f7d79a', n: 0, par: .2 }, { tipo: 'astro', x: 1050, y: 130, r: 50, par: .2 }];
window.ESCENA = {
  dura: G.fin, fps: 30, suelo: 600, voces: G.voces,
  sonidos: [
    { en: 0, hasta: en.b12, archivo: 'audio/sfx/eleven/teclas.mp3', volumen: .2, bucle: true }, { en: RECORD, archivo: 'audio/sfx/eleven/sello.mp3', volumen: .45 },
    { en: DIECISEIS, archivo: 'audio/sfx/eleven/pop.mp3', volumen: .45 }, { en: en.b12 - 1.2, archivo: 'audio/sfx/whoosh.mp3', volumen: .4 },
    { en: en.b12, hasta: en.b13, archivo: 'audio/sfx/ciudad.mp3', volumen: .2, bucle: true }, { en: en.b13 - .2, archivo: 'audio/sfx/whoosh.mp3', volumen: .35 },
    { en: SEIS, archivo: 'audio/sfx/impacto.mp3', volumen: .35 }, { en: SUMA, archivo: 'audio/sfx/eleven/sello.mp3', volumen: .5 }],
  carteles: [
    nota(PRECIO + .3, FALTAN - .3, 'La inmigración y el precio', [['Subida atribuida (1998-2024)', '+5,6 % a +11 %', '#7a1410']], 'Estudio de Joan Monràs (2026)'),
    nota(FALTAN + .3, G.fin - .2, 'Lo que falta', [['Viviendas', '≈ 750.000', '#7a1410']], 'Ep. 5 · Banco de España'),
  ],
  planos: [
    { desde: 0, ...cartoon, decorado: [...cielo, { tipo: 'rascacielos', y: 600, tono: .35, n: 9, par: .5 }, { tipo: 'suelo', par: 1, matas: 0 }],
      delante: [{ tipo: 'contador', en: COTIZABAN, dura: 2.2, a: 3635979, x: 400, y: 260, tam: 78, rotulo: 'EXTRANJEROS COTIZANDO' }, { tipo: 'sello', en: RECORD, texto: 'RÉCORD', x: 400, y: 420, escala: .7 },
        { tipo: 'quesito', aparece: RECORD - .2, en: DIECISEIS, trozos: 6, resalta: 1, texto: '16 %', x: 900, y: 330, r: 150 }],
      camara: [[0, 640, 360, 1.1], [DIECISEIS, 760, 340, 1.12], [en.b12, 820, 330, 1.25]] },
    { desde: en.b12 - .2, transicion: 'metamorfosis', materia: 'hojas', ...cartoon, viento: .2,
      decorado: [...cielo, { tipo: 'colinas', tono: .3, par: .5, y: 540 }, { tipo: 'invernadero', x: -60, n: 3, par: 1 }, { tipo: 'barra', x: 1000, par: 1, texto: 'BAR' },
        { tipo: 'casa', x: 1700, par: 1 }, { tipo: 'suelo', par: 1, matas: 4 }],
      delante: [{ tipo: 'nombre', x: 1580, y: 330, texto: 'el recién llegado', en: MAYORES + .2, hasta: MAYORES + 2.6 }],
      actores: [
        { p: ciudadano(720, { escala: .9 }), x: 210, mira: 1, acciones: [{ hace: 'agacha', en: 0, hasta: HOSTE, g: .55 }, { hace: 'brazos', en: CAMPO - .2, hasta: HOSTE, h: 1.4, c: .4, mano: 'agarra' }] },
        { p: P.camarero, x: 960, mira: 1, acciones: [{ hace: 'brazos', en: HOSTE - .2, hasta: MAYORES, h: 1.5, c: .3, mano: 'abierta' }] },
        { p: ciudadano(721, { escala: .8 }), x: 880, mira: 1, acciones: [{ hace: 'habla', en: HOSTE, hasta: HOSTE + 1.6 }] },
        { p: { ...ciudadano(722, { escala: .9 }), encorvado: .25 }, x: 1720, mira: -1, acciones: [{ hace: 'agacha', en: 0, hasta: MAYORES + .5, g: .45 }, { hace: 'mano', en: MAYORES + .2, hasta: MAYORES + 2.2 }] },
        { p: P.llegado, x: 1600, mira: 1, acciones: [{ hace: 'mano', en: MAYORES + .2, hasta: MAYORES + 2.2 }, { hace: 'miraCamara', en: MAYORES + 2.4, hasta: G.fin }] }],
      camara: [[en.b12, 200, 380, 1.25], [CAMPO + .3, 210, 380, 1.2], [HOSTE, 960, 380, 1.2], [MAYORES, 1660, 380, 1.25], [en.b13, 1660, 380, 1.2]] },
    { desde: en.b13 - .1, transicion: 'tajo', ...cartoon, decorado: [{ tipo: 'cieloNoche', arriba: '#20203f', abajo: '#4a3a6e', n: 20, par: .2 }],
      delante: [{ tipo: 'lineas', en: en.b13 + .2, dura: 2.6, x: 300, y: 600, ancho: 600, alto: 360, lineas: [['GENTE', 1, '#f0a03a'], ['CASAS', .45, '#7fb3e6']], hueco: CASAS + .2, etiqueta: '+6 % a +11 % en el precio' },
        { tipo: 'contador', en: FALTAN, dura: 1.6, a: 750000, x: 640, y: 1000, tam: 80, color: '#ff8a70', antes: '−', rotulo: 'CASAS QUE FALTAN' }, { tipo: 'sello', en: SUMA, texto: 'PERO SUMA', x: 640, y: 1140, escala: .7 }],
      camara: [[en.b13, 640, 360, 1], [SEIS, 700, 330, 1.12], [FALTAN - .8, 640, 360, 1], [FALTAN, 640, 1040, 1], [G.fin, 640, 1060, 1.06]] },
  ],
};
