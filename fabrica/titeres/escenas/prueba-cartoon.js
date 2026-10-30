// Prueba del modo dibujo animado (antes / después): arriba el modo viejo `jack`, abajo `cartoon`. El Decano anda, se para, señala y se asusta;
// Sanchís habla con la mano. 8 s.
const P = PERSONAJES;
const jack = { jack: true, quieto: true, figura: '#2b2235', sombra: 8, contraluz: 0, bordes: ['rgb(150,210,255)', 'rgb(255,150,90)'], borde: .8 };
const reparto = () => [
  { p: P.decano, x: 150, mira: 1, acciones: [{ hace: 'camina', en: .3, hasta: 2.6, a: 520 }, { hace: 'senala', en: 3, hasta: 4.6 }, { hace: 'sorprende', en: 5.2, hasta: 6.2 }, { hace: 'piensa', en: 6.6, hasta: 8 }] },
  { p: P.sanchis, x: 900, mira: -1, acciones: [{ hace: 'habla', en: .5, hasta: 4.8 }, { hace: 'encoge', en: 5.3, hasta: 6.4 }, { hace: 'celebra', en: 6.8, hasta: 8 }] }];
const fondoP = [{ tipo: 'cieloNoche', luna: [640, 160, 70], par: .3 }, { tipo: 'ciudad', tono: .3, par: .6, y: 600, s: 4 }, { tipo: 'suelo', par: 1, matas: 3 }];
window.ESCENA = {
  dura: 8, fps: 30, suelo: 600,
  titulos: [],
  planos: [{ desde: 0, ...jack, decorado: [{ tipo: 'plano', color: '#14141c', par: .3 }], actores: [], camara: [[0, 640, 360, 1]], paneles: [
    { en: 0, rect: [0, 0, 1280, 356], entra: 'izq', ...jack, camara: [[0, 640, 400, 1]], decorado: fondoP, actores: reparto() },
    { en: 0, rect: [0, 364, 1280, 356], entra: 'der', ...jack, cartoon: true, camara: [[0, 640, 400, 1]], decorado: fondoP, actores: reparto() }] }],
};
