// Españistán ep. 7 · secuencia 3, «Prusia» (bloques 4–8). `cartoon`, 60 fps. Los pupitres no se mueven: la época cambia a su alrededor.
//   b4   cuartel prusiano, 1717: los soldados en fila. «obliga» → desfilan.
//   b5   metamorfosis: las filas de soldados se deshacen en tinta y quedan las filas de pupitres (1763); el reglamento se desenrolla con su
//        sello en «ley»; «Edades, filas, maestro, timbre» encienden cada palabra y en «timbre» suena la campana.
//   b6   viento → Jena, 1806: cañonazos y Napoleón. Fichte se forma con hojas; su cita en una nota.
//   b7   viento → el Atlántico: el barco de Horace Mann cruza (sin cortar); «Massachusetts» → la escuela de madera y su campana.
//   b8   viento → escuela de pueblo española, 1857: Moyano y la ley; los niños en sus pupitres.
const G = T.guion([4, 5, 6, 7, 8]), en = G.en, k = G.k, P = PERSONAJES;
const cartoon = { cartoon: true, jack: true, figura: '#2b2235', sombra: 8, contraluz: 0, bordes: ['rgb(150,210,255)', 'rgb(255,150,90)'], borde: .8 };
const fichte = { ropa: 'traje', pelo: 'peinado', nariz: 1.2, narizForma: 'aguilena', menton: 'marcado', alto: 1.02, grueso: .9, piernas: 1.08, cintura: .86, semilla: 107 };
const mann = { ropa: 'traje', pelo: 'loco', nariz: 1.1, narizForma: 'recta', menton: 'marcado', arrugas: .6, alto: 1.04, grueso: .88, piernas: 1.08, objetoLejos: 'papel', semilla: 109 };
const moyano = { ropa: 'traje', pelo: 'entradas', barba: 'larga', nariz: 1.1, narizForma: 'gruesa', menton: 'redondo', arrugas: .7, alto: 1, grueso: 1.05, objeto: 'papel', semilla: 113 };
const OBLIGA = k(4, 'obliga'), LEY = k(5, 'ley'), EDADES = k(5, 'Edades'), FILAS = k(5, 'filas'), MAESTRO = k(5, 'maestro'), TIMBRE = k(5, 'timbre'),
  APLASTA = k(6, 'aplasta'), FICHTE = k(6, 'Fichte'), RECETA = k(6, 'receta'), MOLDEARLO = k(6, 'moldearlo'), VISITA = k(7, 'visita'), MASSA = k(7, 'Massachusetts'),
  MOYANO = k(8, 'Moyano'), SEIS = k(8, 'seis');
const muro = (arriba, abajo) => ({ tipo: 'cieloNoche', arriba, abajo, n: 0, par: .2 });
window.ESCENA = {
  dura: G.fin, fps: 60, suelo: 600, voces: G.voces,
  sonidos: [
    { en: 0, hasta: en.b6 - .3, archivo: 'audio/sfx/viento.mp3', volumen: .15, bucle: true }, { en: OBLIGA, archivo: 'audio/sfx/impacto.mp3', volumen: .3 },
    { en: LEY + .2, archivo: 'audio/sfx/eleven/sello.mp3', volumen: .45 }, { en: TIMBRE, archivo: 'audio/sfx/campana.mp3', volumen: .4 },
    { en: en.b6 - .5, archivo: 'audio/sfx/whoosh.mp3', volumen: .35 }, { en: APLASTA, archivo: 'audio/sfx/trueno.mp3', volumen: .4 }, { en: APLASTA + .4, archivo: 'audio/sfx/impacto.mp3', volumen: .3 },
    { en: en.b7 - .5, archivo: 'audio/sfx/whoosh.mp3', volumen: .35 }, { en: en.b7, hasta: MASSA, archivo: 'audio/sfx/ola.mp3', volumen: .3, bucle: true },
    { en: MASSA + .4, archivo: 'audio/sfx/campana.mp3', volumen: .35 }, { en: en.b8 - .5, archivo: 'audio/sfx/whoosh.mp3', volumen: .35 }, { en: SEIS, archivo: 'audio/sfx/campana.mp3', volumen: .3 }],
  carteles: [
    { en: MOLDEARLO - 1.2, hasta: en.b7 - .4, x: 700, y: 80, ancho: 520, titulo: 'Fichte, Discursos a la nación alemana (1808)', fuente: '2.º discurso',
      filas: [['«No basta con hablarle:', ''], ['hay que moldearlo»', '']], tiempos: [RECETA, MOLDEARLO] },
    { en: SEIS - .6, hasta: G.fin, x: 720, y: 70, ancho: 480, titulo: 'Ley Moyano · 1857', fuente: 'RAE, Diccionario panhispánico del español jurídico',
      filas: [['Escuela obligatoria', '6 a 9 años'], ['Analfabetos en 1857', '≈ 75 %', '#7a1410']], tiempos: [SEIS, SEIS + 1.6] }],
  planos: [
    { desde: 0, ...cartoon, viento: .3, decorado: [muro('#3a2a4a', '#c87a4a'), { tipo: 'plazaPrusia', n: 12, marcha: OBLIGA, par: .8 }],
      delante: [{ tipo: 'nombre', x: 640, y: 80, texto: 'Prusia · 1717', en: en.b4 + 1.2, hasta: en.b5 - .6 }],
      particulas: [{ tipo: 'hojas', n: 14, zona: [-100, 200, 1380, 520] }],
      camara: [[0, 640, 300, 1.2], [OBLIGA, 640, 360, 1], [en.b5, 540, 380, 1.05]] },
    { desde: en.b5 - .4, transicion: 'metamorfosis', ...cartoon, decorado: [muro('#2a2030', '#7a5a3a')],
      delante: [{ tipo: 'pergamino', en: LEY - .9, x: 640, y: 230, ancho: 560, alto: 300, titulo: 'Reglamento general de escuelas · 1763', sello: LEY + .1,
          items: [[EDADES, 'edades'], [FILAS, 'filas'], [MAESTRO, 'maestro del Estado'], [TIMBRE, 'timbre']] },
        { tipo: 'campana', x: 1150, y: 600, escala: .55, toca: [TIMBRE] }, { tipo: 'pupitres', epoca: 1763, filas: 3, cols: 6, ninos: true, y: 640 }],
      camara: [[en.b5, 640, 360, 1], [LEY, 640, 300, 1.15], [EDADES - .3, 640, 330, 1.05], [TIMBRE, 900, 360, 1.15], [en.b6, 760, 360, 1.1]] },
    { desde: en.b6 - .3, transicion: 'viento', ...cartoon, viento: .5, decorado: [muro('#2a1a2a', '#d8783a'), { tipo: 'campoJena', fogonazos: [APLASTA - .2, APLASTA + 1.4], par: .9 }],
      delante: [{ tipo: 'nombre', x: 1010, y: 230, texto: 'Napoleón · Jena, 1806', en: APLASTA + .2, hasta: FICHTE - .4 }, { tipo: 'nombre', x: 330, y: 330, texto: 'Fichte', en: FICHTE + 1.4, hasta: RECETA }],
      particulas: [{ tipo: 'hojas', n: 24, zona: [-100, 200, 1380, 540] }, { tipo: 'remolino', n: 26, x: 330, y: 560, r: 120, ciclo: 5, en: FICHTE - 1 }],
      actores: [{ p: fichte, x: 330, mira: 1, forma: { aparece: FICHTE - .3, dura: 1.6 }, acciones: [{ hace: 'senala', en: FICHTE + 1.8, hasta: RECETA - .2 }, { hace: 'puno', en: MOLDEARLO - .2, hasta: MOLDEARLO + 1.6 }] }],
      camara: [[en.b6, 900, 340, 1.1], [APLASTA + 1, 820, 360, 1], [FICHTE, 520, 380, 1.15], [MOLDEARLO, 380, 380, 1.35], [en.b7, 380, 380, 1.35]] },
    { desde: en.b7 - .3, transicion: 'viento', ...cartoon, viento: .45, decorado: [muro('#1a2440', '#e8a868'), { tipo: 'barcoAtlantico', en: en.b7, llega: MASSA, de: -150, a: 1450, par: 1 }],
      delante: [{ tipo: 'nombre', x: 640, y: 120, texto: 'Horace Mann · 1843', en: VISITA - .4, hasta: MASSA - .2 }],
      particulas: [{ tipo: 'papeles', n: 6, zona: [-100, 100, 1380, 300] }],
      camara: [[en.b7, 300, 380, 1.2], [MASSA - .2, 1000, 380, 1.2]] },
    { desde: MASSA - .1, ...cartoon, viento: .2, decorado: [muro('#5a8ac8', '#e8d8b0'), { tipo: 'colinas', par: .5, tono: .25 }, { tipo: 'escuelaMadera', x: 640, toca: [[0, 0], [MASSA + .3, 1], [MASSA + 1.5, 0]], par: 1 }],
      delante: [{ tipo: 'nombre', x: 640, y: 90, texto: 'Massachusetts · 1852', en: MASSA + .3, hasta: en.b8 - .3 }],
      actores: [{ p: mann, x: 330, mira: 1, acciones: [{ hace: 'senala', en: MASSA + .6, hasta: en.b8 - .4 }] }],
      camara: [[MASSA, 640, 360, 1.1], [en.b8, 600, 350, 1.2]] },
    { desde: en.b8 - .3, transicion: 'viento', ...cartoon, decorado: [{ tipo: 'escuelaRural', anio: 1857, par: .3 }],
      delante: [{ tipo: 'pupitres', epoca: 1857, filas: 2, cols: 5, ninos: true, y: 660 }, { tipo: 'nombre', x: 300, y: 300, texto: 'Claudio Moyano', en: MOYANO, hasta: SEIS + .4 }],
      actores: [{ p: moyano, x: 300, mira: 1, acciones: [{ hace: 'mano', en: MOYANO + .3, hasta: SEIS + 1.5 }] }],
      camara: [[en.b8, 640, 360, 1.05], [SEIS, 560, 340, 1.15], [G.fin, 600, 330, 1.22]] },
  ],
};
