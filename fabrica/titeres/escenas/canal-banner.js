// Banner del canal (2560×1440; la zona que se ve en todos los aparatos es la franja central de 1546×423): todos los títeres en fila,
// de frente, al atardecer, delante del mundo (un sol enorme con el mapa de Españistán dentro). Un fotograma en t = 1,5.
const P = PERSONAJES, fila = ['camarero', 'fragata', 'vendehumos', 'felipon', 'suavez', 'ansar', 'zapatitos', 'decano', 'elegido', 'acascar', 'rajoyo', 'sanchis', 'feijolo', 'condesa', 'lucia', 'dani'];
const jack = { jack: true, quieto: true, figura: '#2b2522', sombra: 9, contraluz: 0, bordes: ['rgb(255,226,190)', 'rgb(255,120,70)'], borde: .6 };
window.ESCENA = {
  dura: 2, fps: 30, suelo: 600,
  planos: [
    { desde: 0, ...jack, viento: 0, camara: [[0, 640, 427, .55]],
      decorado: [{ tipo: 'plano', color: '#c8611f', raya: 'rgba(90,20,6,.25)', luz: 'rgba(255,170,80,.12)', par: 1 },
        { tipo: 'disco', x: 640, y: 420, r: 330, color: '#eba13c', par: 1 }, { tipo: 'mapa05', x: 640, y: 380, ancho: 470, relleno: '#d8452a', par: 1 },
        { tipo: 'ciudad', tono: .35, par: 1, y: 600, s: 3 }, { tipo: 'suelo', par: 1, matas: 0 }],
      actores: fila.map((n, i) => ({ p: { ...P[n], escala: n === 'elegido' ? 1.05 : .9 }, x: 640 + (i - 7.5) * 80, mira: i < 8 ? 1 : -1,
        acciones: [{ hace: 'vista', a: 'frente', en: 0 }, ...(n === 'elegido' ? [{ hace: 'puno', en: 0, hasta: 9 }] : [])] })) },
  ],
};
