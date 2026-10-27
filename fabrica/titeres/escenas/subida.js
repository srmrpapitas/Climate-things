// Españistán ep. 3 · acto 5, «La subida» (≈ 22 s, sin voz todavía). Estilo `jack`. Datos: 03-abascal.md, bloque 4.
//   0–12     general: Acascar en lo alto de la roca; el público, de espaldas a él (de cara a nosotros), se va girando hacia él
//            a escalones: 12, 24, 52… en 2023 unos cuantos se vuelven (33) y en 2026 se gira todo el mundo (≈ 68 en las encuestas).
//   12–15    (viento) contraplano desde detrás de la roca: la gente mirándolo, algunos jóvenes alzan el puño. Lo bueno también se cuenta.
//   15–19,5  primer plano de frente: «Los jóvenes me adoran. Será por el caballo.»
//   19,5–22  (viento) general final con la bandera al viento.
// Las voces: audio/voz/es/subida/NN_quien.mp3 (si no existen, sale mudo con subtítulos).
const AC = PERSONAJES.acascar;
const jack = { jack: true, quieto: true, figura: '#3b3431', sombra: 9, contraluz: 0, bordes: ['rgb(255,226,190)', 'rgb(255,120,70)'], borde: .7 };
const cielo = [{ tipo: 'plano', color: '#b11d18', par: .3 }, { tipo: 'astro', x: 1010, y: 170, r: 46, par: .3 }];
const roca = (x, y = 560, e = 1.2) => ({ tipo: 'roca', x, y, escala: e, par: 1 });
const voces = [{ en: 15.5, dura: 3.4, quien: 'Acascar', texto: 'Los jóvenes me adoran. Será por el caballo.', archivo: 'audio/voz/es/subida/01_acascar.mp3' }];
// el público: 12 personas en primer término. `gira` = cuándo se vuelve hacia Acascar; `vuelve` = cuándo le da la espalda otra vez (2023)
const GIRA = [2, 2, 4, 4, 6, 6, 6, 6, 6, 10, 10, 10], VUELVE = { 4: 8, 6: 8, 8: 8 };
const publico = GIRA.map((g, i) => {
  const acciones = [{ hace: 'vista', a: 'espalda', en: g }];
  if (VUELVE[i]) acciones.push({ hace: 'vista', a: 'frente', en: VUELVE[i] }, { hace: 'vista', a: 'espalda', en: 10 });
  acciones.push({ hace: i % 3 ? 'aplaude' : 'celebra', en: 10.4 + (i % 4) * .15, hasta: 11.8 });
  return { p: ciudadano(i + 40, { escala: 1.05, tono: 1 }), x: 70 + i * 104 + 20 * T.azar(i), y: 110, vista: 'frente', acciones };
});
window.ESCENA = {
  dura: 22, fps: 12, suelo: 600, voces,
  carteles: [
    { en: 1.5, hasta: 11.8, x: 770, y: 24, ancho: 480, titulo: 'Diputados de Vox', paso: 2,
      filas: [['Andalucía 2018', '12'], ['Congreso, abril 2019', '24'], ['Congreso, nov. 2019', '52'], ['Congreso, 2023', '33', '#3a2410'], ['Encuestas, oct. 2026', '≈ 68']],
      fuente: 'Ministerio del Interior · Sigma Dos y GAD3 (12-10-2026)' },
    { en: 12.3, hasta: 14.8, x: 40, y: 40, ancho: 560, titulo: 'Dónde más sube', filas: [['Menores de 45 años', '▲']], fuente: 'Sigma Dos y GAD3 (12-10-2026)' }],
  planos: [
    { desde: 0, ...jack, viento: .8, decorado: [...cielo, roca(400)], particulas: [{ tipo: 'cuervos', n: 4, zona: [0, 70, 1280, 260] }],
      actores: [{ p: Object.assign({}, AC, { objeto: 'bandera', escala: .75 }), x: 380, y: -55, mira: 1, acciones: [{ hace: 'brazos', h: 2.75, c: .1, en: 0, hasta: 99, entra: .01 }] }, ...publico],
      camara: [[0, 640, 380, 1]] },
    { desde: 12, transicion: 'pajaros', ...jack, viento: .8, decorado: [...cielo, roca(1180, 640, 1.6)],
      actores: [0, 1, 2, 3, 4, 5].map(i => ({ p: ciudadano(i + 40, { escala: .9 }), x: 120 + i * 150, mira: 1,
        acciones: i % 2 ? [{ hace: 'puno', en: 12.6 + i * .2, hasta: 14.8, entra: .1 }] : [{ hace: 'asiente', en: 12.8 + i * .2, hasta: 14 }] })),
      camara: [[12, 640, 380, 1.05]] },
    { desde: 15, ...jack, viento: .6, decorado: [...cielo],
      actores: [{ p: AC, x: 640, vista: 'frente', acciones: [{ hace: 'habla', en: 15.5, hasta: 18.9 }, { hace: 'encoge', en: 17.6, hasta: 19.3, entra: .12 }] }],
      camara: [[15, 640, 250, 2.6]] },
    { desde: 19.5, transicion: 'tinta', ...jack, viento: 1, decorado: [...cielo, roca(640, 600, 1.5)],
      actores: [{ p: Object.assign({}, AC, { objeto: 'bandera', escala: .6 }), x: 620, y: -100, mira: 1, acciones: [{ hace: 'brazos', h: 2.75, c: .1, en: 0, hasta: 99, entra: .01 }] }],
      camara: [[19.5, 640, 380, 1]] },
  ],
};
