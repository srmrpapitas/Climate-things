// Españistán ep. 7 · secuencia 10, «Los que lo hacen mejor» (bloques 41–42). `cartoon`, 60 fps.
//   b41  el mapa de la Unión Soviética se resquebraja y Estonia se separa (1991).
//   b42  viento → el bosque nevado: el aula de cristal se enciende; la nota de PISA 2025; «confianza» → la profesora cambia la pizarra a su gusto.
const G = T.guion([41, 42]), en = G.en, k = G.k, P = PERSONAJES;
const cartoon = { cartoon: true, jack: true, figura: '#2b2235', sombra: 8, contraluz: 0, bordes: ['rgb(150,210,255)', 'rgb(255,150,90)'], borde: .8 };
const profesora = ciudadano(919, { ropa: 'vestido', pelo: 'mono', objeto: 'papel' });
const ESTONIA = k(41, 'Estonia'), SALIA = k(41, 'salía'), PRIMERA = k(42, 'primera'), SEGUNDA = k(42, 'segunda'), DINERO = k(42, 'dinero'), CONFIANZA = k(42, 'confianza'), LIBERTAD = k(42, 'libertad');
window.ESCENA = {
  dura: G.fin, fps: 60, suelo: 600, voces: G.voces,
  sonidos: [{ en: SALIA, archivo: 'audio/sfx/derrumbe.mp3', volumen: .3 }, { en: en.b42 - .6, archivo: 'audio/sfx/whoosh.mp3', volumen: .35 },
    { en: en.b42, hasta: G.fin, archivo: 'audio/sfx/viento.mp3', volumen: .18, bucle: true }, { en: CONFIANZA, archivo: 'audio/sfx/eleven/brillo.mp3', volumen: .35 }],
  carteles: [{ en: PRIMERA - .4, hasta: DINERO - .2, x: 720, y: 50, ancho: 500, titulo: 'Estonia · PISA 2025', fuente: 'Ministerio de Educación de Estonia, 8-9-2026',
    filas: [['Ciencias · 1.ª de Europa', '527', '#2c5a2c'], ['Matemáticas · 1.ª de Europa', '508', '#2c5a2c'], ['Lectura · 2.ª de Europa', '499']], tiempos: [PRIMERA, PRIMERA + 1.2, SEGUNDA] }],
  planos: [
    { desde: 0, ...cartoon, decorado: [{ tipo: 'cieloNoche', arriba: '#1c1a2c', abajo: '#4a3a5a', n: 20, par: .2 }],
      delante: [{ tipo: 'mapaURSS', rompe: SALIA - .2 }, { tipo: 'nombre', x: 700, y: 120, texto: 'Unión Soviética', en: en.b41 + .4, hasta: SALIA }],
      camara: [[0, 700, 300, 1.05], [SALIA + 1, 420, 260, 1.3]] },
    { desde: en.b42 - .3, transicion: 'viento', ...cartoon, viento: .3, decorado: [{ tipo: 'cieloNoche', arriba: '#2a3a5a', abajo: '#e8c8a8', n: 0, par: .2 }, { tipo: 'bosqueNieve', aula: [[en.b42, 0], [en.b42 + 1.5, 1]], par: .9 }],
      delante: [{ tipo: 'burbuja', x: 360, y: 200, texto: 'CONFIANZA', en: CONFIANZA, hasta: G.fin, ancho: 280, tam: 34, color: '#2c5a2c' },
        { tipo: 'nombre', x: 820, y: 330, texto: 'una profesora', en: LIBERTAD - .6, hasta: LIBERTAD + 2 }],
      actores: [{ p: profesora, x: 820, mira: -1, acciones: [{ hace: 'brazos', en: CONFIANZA + .2, hasta: CONFIANZA + 1.6 }, { hace: 'senala', en: LIBERTAD, hasta: G.fin }] }],
      camara: [[en.b42, 640, 380, 1.05], [DINERO, 640, 420, 1.12], [LIBERTAD, 760, 420, 1.22]] },
  ],
};
