// Prueba de giros (antes / después de las poses de tres cuartos): el Decano anda, se da la vuelta, vuelve, mira a cámara y se pone
// de frente; Feijolo se gira dos veces sin moverse. 8 s.
const P = PERSONAJES;
window.ESCENA = {
  dura: 8, fps: 30, suelo: 600,
  titulos: [],
  planos: [{ desde: 0, cartoon: true, decorado: [{ tipo: 'cieloNoche', luna: [640, 160, 70], par: .3 }, { tipo: 'ciudad', tono: .3, par: .6, y: 600, s: 4 }, { tipo: 'suelo', par: 1, matas: 3 }],
    camara: [[0, 640, 380, 1.1]],
    actores: [
      { p: P.decano, x: 200, mira: 1, acciones: [{ hace: 'camina', en: .3, hasta: 1.8, a: 520 }, { hace: 'camina', en: 2.4, hasta: 3.6, a: 300 }, { hace: 'gira', en: 4 },
        { hace: 'miraCamara', en: 4.8, hasta: 5.8 }, { hace: 'vista', en: 6.3, a: 'frente' }, { hace: 'vista', en: 7.3, a: 'perfil' }] },
      { p: P.feijolo, x: 950, mira: -1, acciones: [{ hace: 'gira', en: 1 }, { hace: 'gira', en: 2.6 }, { hace: 'habla', en: 3.2, hasta: 5 }, { hace: 'miraCamara', en: 5.4, hasta: 6.6 }] }] }],
};
