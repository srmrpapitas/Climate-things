// Reparto de Españistán para los títeres. Cada personaje es una ficha: proporciones, ropa, pelo, barba, gafas, sombrero y
// lo que lleva en las manos. Para uno nuevo, copiar una ficha y cambiarle cosas. `semilla` hace que cada uno se mueva distinto.
//   nariz (tamaño), narizForma: recta | aguilena | respingona | gruesa   menton: marcado | redondo | doble   arrugas: 0–1
//   ropa: traje | tunica | vestido     pelo: corto | peinado | entradas | loco | mono | coleta | calvo
//   barba: corta | larga | bigote      gafas: redondas | cuadradas    sombrero: gorra | chistera | boina
//   estilizado (a lo Samurai Jack): piernas (largo), hombros (ancho), cintura (estrecha < 1), jirones (bajo de la túnica al viento)
//   objeto (mano de delante) / objetoLejos (mano de atrás): candil | lupa | bandera | baston | papel
const PERSONAJES = {
  decano:  { ropa: 'tunica', pelo: 'loco', gafas: 'redondas', nariz: 1.3, narizForma: 'aguilena', arrugas: 1, alto: 1.04, grueso: .95, encorvado: .05, piernas: 1.1, hombros: 1.05, cintura: .85, jirones: true, objeto: 'lupa', objetoLejos: 'candil', semilla: 3 },
  acascar: { ropa: 'traje', pelo: 'corto', barba: 'corta', nariz: 1, narizForma: 'recta', menton: 'marcado', alto: 1.08, grueso: 1.1, piernas: 1.12, hombros: 1.22, cintura: .8, semilla: 7 },
  sanchis: { ropa: 'traje', pelo: 'peinado', nariz: 1.05, narizForma: 'recta', menton: 'marcado', alto: 1.16, grueso: 1, piernas: 1.15, hombros: 1.15, cintura: .82, semilla: 11 },
  feijolo: { ropa: 'traje', pelo: 'entradas', nariz: 1.1, narizForma: 'gruesa', menton: 'doble', arrugas: .6, alto: 1.02, grueso: 1.05, barriga: .4, piernas: 1.06, hombros: 1.1, cintura: .95, semilla: 13 },
};
// gente del pueblo: variaciones deterministas (la misma n da siempre la misma persona)
function ciudadano(n, extra = {}) {
  const a = i => T.azar(n * 31 + i), mujer = a(1) < .45;
  const f = mujer
    ? { ropa: 'vestido', pelo: ['mono', 'coleta', 'corto'][Math.floor(a(2) * 3)], alto: .9 + .12 * a(3), grueso: .85 + .15 * a(4) }
    : { ropa: 'traje', pelo: ['corto', 'entradas', 'calvo', 'peinado'][Math.floor(a(2) * 4)], alto: .92 + .16 * a(3), grueso: .9 + .3 * a(4),
        barba: a(5) < .3 ? 'bigote' : a(5) < .45 ? 'corta' : null, sombrero: a(6) < .25 ? 'gorra' : a(6) < .4 ? 'boina' : null, barriga: a(7) * .6 };
  return Object.assign(f, { nariz: .8 + .6 * a(8), narizForma: ['recta', 'aguilena', 'respingona', 'gruesa'][Math.floor(a(10) * 4)], menton: ['redondo', 'marcado', 'doble'][Math.floor(a(11) * 3)], arrugas: a(12) < .3 ? .7 : 0, semilla: 100 + n, gafas: a(9) < .15 ? 'cuadradas' : null }, extra);
}
