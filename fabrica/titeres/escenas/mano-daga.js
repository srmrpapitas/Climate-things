// Españistán ep. 3 · acto 6, «La mano y la daga» (≈ 18 s, sin voz todavía). Estilo `jack`: color plano, dos tonos, cámara quieta.
// La daga es la metáfora de romper un pacto (lleva escrito RUPTURA) y la esconden los dos. Datos: 03-abascal.md, bloque 5.
//   0–4,5     2023: Feijolo y Acascar se dan la mano ante cinco tronos; los dos esconden una daga.
//   4,5–6,2   primer plano de las manos.
//   6,2–7,6   plano bajo: las dos dagas a la espalda.
//   7,6–12    julio de 2024 (rojo): Feijolo se va hacia los tronos; Acascar se acerca por detrás y se la clava. Se marcha.
//   12–13,6   la daga en la espalda de Feijolo.
//   13,6–18   2026: vuelven a darse la mano, Feijolo con una tirita, y otra vez las dagas detrás. Tres tronos.
const AC = PERSONAJES.acascar, FE = PERSONAJES.feijolo;
const jack = { jack: true, quieto: true, figura: '#3b3431', sombra: 9, contraluz: 0, bordes: ['rgb(255,226,190)', 'rgb(255,120,70)'], borde: .7 };
const fondoDe = (color, n) => [{ tipo: 'plano', color, par: .3 },
  ...Array.from({ length: n }, (_, i) => ({ tipo: 'trono', x: 640 + (i - (n - 1) / 2) * 150, y: 470, escala: .75, tono: .35, par: .8 })),
  { tipo: 'suelo', par: 1, matas: 0 }];
const pacto = fondoDe('#c06a28', 5), rojo = [{ tipo: 'plano', color: '#b11d18', par: .3 }, ...fondoDe('#b11d18', 5).slice(1)], vuelta = fondoDe('#c06a28', 3);
// el apretón: los dos con la daga escondida (mano de atrás) y la mano de delante estirada
const saludo = (en, hasta, extra = []) => [
  { p: FE, x: 492, mira: 1, acciones: [{ hace: 'coge', que: 'daga', mano: 'lejos', en: 0 }, { hace: 'esconde', en: 0, hasta: 99, entra: .01 }, { hace: 'mano', en, hasta, h: .1 }, ...extra] },
  { p: AC, x: 788, mira: -1, acciones: [{ hace: 'coge', que: 'daga', mano: 'lejos', en: 0 }, { hace: 'esconde', en: 0, hasta: 99, entra: .01 }, { hace: 'mano', en, hasta, h: -.1 }] }];
window.ESCENA = {
  dura: 18, fps: 12, suelo: 600,
  carteles: [
    { en: .3, hasta: 4.2, x: 40, y: 40, ancho: 470, titulo: '2023', filas: [['Gobiernos PP + Vox', '5']], fuente: 'BOE de cada comunidad' },
    { en: 7.8, hasta: 11.8, x: 40, y: 40, ancho: 470, titulo: 'Julio de 2024', filas: [['Vox sale de los gobiernos', '5 de 5']], fuente: 'prensa, julio de 2024 (reparto de menores migrantes)' },
    { en: 13.8, hasta: 17.8, x: 40, y: 40, ancho: 470, titulo: '2026', filas: [['Vuelven a gobernar juntos', '3']], fuente: 'acuerdos PP-Vox: Extremadura, Aragón, Castilla y León' }],
  planos: [
    { desde: 0, ...jack, viento: .5, decorado: pacto, actores: saludo(1.2, 6.4), camara: [[0, 640, 400, 1.3]] },
    { desde: 4.5, ...jack, viento: .5, decorado: pacto, actores: saludo(1.2, 6.4), camara: [[4.5, 640, 330, 3.4]], mira: 'manos' },
    { desde: 6.2, ...jack, viento: .5, decorado: pacto, actores: saludo(1.2, 6.4), camara: [[6.2, 640, 470, 2.1]] },
    { desde: 7.6, ...jack, viento: .9, decorado: rojo, camara: [[7.6, 600, 400, 1.3]],
      actores: [
        { p: FE, x: 560, mira: 1, acciones: [{ hace: 'camina', en: 7.8, hasta: 9.3, a: 680 }, { hace: 'clavada', en: 9.6 }, { hace: 'recibe', en: 9.6, hasta: 13.6, sale: .6 }] },
        { p: AC, x: 300, mira: 1, acciones: [{ hace: 'coge', que: 'daga', mano: 'cerca', en: 0 }, { hace: 'camina', en: 7.9, hasta: 9.2, a: 495 },
          { hace: 'apunala', en: 9.55, hasta: 10.6 }, { hace: 'suelta', mano: 'cerca', en: 9.7 }, { hace: 'gira', en: 10.7 }, { hace: 'camina', en: 10.9, hasta: 12, a: 120 }] }] },
    { desde: 12, ...jack, viento: .9, decorado: rojo, camara: [[12, 640, 330, 3]],
      actores: [{ p: FE, x: 680, mira: 1, acciones: [{ hace: 'clavada', en: 0 }, { hace: 'recibe', en: 11.2, hasta: 13.8, sale: .6 }] }] },
    { desde: 13.6, ...jack, viento: .5, decorado: vuelta, actores: saludo(14.4, 17.6, [{ hace: 'tirita', en: 0 }]), camara: [[13.6, 640, 400, 1.3]] },
  ],
};
