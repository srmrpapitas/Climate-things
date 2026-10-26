// personas.js: personajes humanos de Españistán pintados a pincel (misma técnica que Clawd: wash plano + tinta que hierve).
// persona(x, y, u, P, o): (x, y) = suelo entre los pies; u = unidad (la persona mide ~20u). P = diseño (PERSONAS.*), o = pose y cara.
// o: aL, aR (ángulo del hombro: 0 = abajo, + = hacia fuera/arriba), eL, eR (codo), lean (inclinación), dy, lookX,
//    boca (0..1 apertura), parp (0..1 párpado), cejas (-1 enfado .. 1 sorpresa), manoR / manoL (fn(u) que pinta algo en la mano), flip.
const SEPIA = { fondo: '#E7D0A1', papel: '#F1E3C4', tinta: '#2B1D12', sombra: '#3A2615', ambar: '#E8A34A', candil: '#FFC66B',
  piel: '#E4AF86', pielDk: '#C58A63', blanco: '#F3ECDD', canas: '#E9E2D2', marino: '#2E3A5C', marinoDk: '#222B45', camisa: '#F4EEE2',
  corbata: '#6F95C7', tweed: '#7A5634', tweedDk: '#5C3F24', chaleco: '#4E6B47', zapato: '#2A2220' };

const PERSONAS = {
  feijolo: { traje: SEPIA.marino, trajeDk: SEPIA.marinoDk, corbata: SEPIA.corbata, chaleco: null, pelo: 'calvo', barba: 'corta', gafas: 'rect', cabeza: [2.2, 2.9] },
  decano:  { traje: SEPIA.tweed, trajeDk: SEPIA.tweedDk, corbata: null, chaleco: SEPIA.chaleco, pelo: 'loco', barba: 'grande', gafas: 'redondas', cabeza: [2.5, 2.8], encorvado: .12 },
};

function persona(x, y, u, P, o = {}) {
  const sw = Math.max(.5, u * .032), SIL = o.silueta, C = c => SIL || c, OP = SIL ? (o.siluetaOp || 170) : 255;
  const pnt = (pts, q) => paint(pts, SIL ? { ...q, wash: SIL, washOp: OP, ink: null } : q);
  push(); translate(x, y - (o.dy || 0) * u); if (o.flip) scale(-1, 1); rotate((o.lean || 0) + (P.encorvado || 0) * .3);
  const pie = (s) => { boilSeed('pie' + s); pnt(ellPts(s * 1.9 * u, -.35 * u, 1.3 * u, .55 * u, 16), { wash: SEPIA.zapato, sw }); };
  // piernas: una cinta por pierna
  [-1, 1].forEach(s => { boilSeed('pierna' + s); pnt(ribbon([[s * 1.2 * u, -8 * u], [s * 1.5 * u, -4 * u], [s * 1.8 * u, -.6 * u]], 1.7 * u, 1.4 * u), { wash: P.trajeDk, sw }); pie(s); });
  // brazo de detrás (izquierdo en pantalla = derecho del personaje si no hay flip)
  const brazo = (s, a, e, mano) => {          // s = lado en pantalla (-1 izq, 1 der); a = abre el hombro; e = dobla el codo hacia arriba
    const hx = s * 3.0 * u, hy = -13.6 * u, L1 = 3.4 * u, L2 = 3.1 * u;
    const ang1 = Math.PI / 2 - s * (.12 + a), x1 = hx + Math.cos(ang1) * L1, y1 = hy + Math.sin(ang1) * L1;
    const ang2 = ang1 - s * (e || 0), x2 = x1 + Math.cos(ang2) * L2, y2 = y1 + Math.sin(ang2) * L2;
    boilSeed('brazo' + s); pnt(ribbon([[hx, hy], [x1, y1], [x2, y2]], 1.25 * u, 1.0 * u), { wash: P.traje, sw });
    boilSeed('mano' + s); pnt(ellPts(x2 + Math.cos(ang2) * .5 * u, y2 + Math.sin(ang2) * .5 * u, .62 * u, .72 * u, 14), { wash: SEPIA.piel, sw });
    if (mano && !SIL) { push(); translate(x2 + Math.cos(ang2) * .8 * u, y2 + Math.sin(ang2) * .8 * u); mano(u, sw); pop(); }
  };
  brazo(-1, o.aR || 0, o.eR || 0, o.manoR);
  // torso: chaqueta con hombros y faldón
  boilSeed('torso'); pnt([[-3.1 * u, -14 * u], [3.1 * u, -14 * u], [2.6 * u, -9 * u], [2.4 * u, -7.4 * u], [-2.4 * u, -7.4 * u], [-2.6 * u, -9 * u]], { wash: P.traje, sw, curv: .3 });
  if (P.chaleco) { boilSeed('chaleco'); pnt([[-1.1 * u, -13.6 * u], [1.1 * u, -13.6 * u], [1.3 * u, -9 * u], [0, -8.4 * u], [-1.3 * u, -9 * u]], { wash: P.chaleco, sw: sw * .8 }); }
  boilSeed('camisa'); pnt([[-1.0 * u, -14.1 * u], [1.0 * u, -14.1 * u], [0, -11.2 * u]], { wash: SEPIA.camisa, sw: sw * .8 });
  if (P.corbata) { boilSeed('corbata'); pnt([[-.32 * u, -13.8 * u], [.32 * u, -13.8 * u], [.42 * u, -10.4 * u], [0, -9.8 * u], [-.42 * u, -10.4 * u]], { wash: P.corbata, sw: sw * .7 }); }
  boilSeed('solapas'); SIL || inkLine([[-1.0 * u, -14.1 * u], [-.2 * u, -11 * u], [0, -9.2 * u]], sw * .8, SEPIA.tinta, 'inkfine'); SIL || inkLine([[1.0 * u, -14.1 * u], [.2 * u, -11 * u]], sw * .8, SEPIA.tinta, 'inkfine');
  // cabeza
  const [rx, ry] = P.cabeza, cy = -17.2 * u, lx = (o.lookX || 0) * .35 * u;
  push(); rotate((o.cabezaRot || 0));
  boilSeed('cuello'); pnt(rectPts(-.7 * u, -15 * u, 1.4 * u, 1.3 * u), { wash: SEPIA.pielDk, ink: null });
  if (P.pelo === 'loco') { boilSeed('melena'); for (let i = 0; i < 9; i++) { const a = -Math.PI + i * Math.PI / 8; pnt(ellPts(Math.cos(a) * rx * 1.05 * u, cy + Math.sin(a) * ry * .95 * u - .2 * u, 1.0 * u, .8 * u, 10, .15 * u, a), { wash: SEPIA.canas, sw: sw * .8 }); } }
  boilSeed('cara'); pnt(ellPts(0, cy, rx * u, ry * u, 26), { wash: SEPIA.piel, sw });
  if (P.pelo === 'calvo') { boilSeed('sienes'); [-1, 1].forEach(s => pnt(ellPts(s * (rx - .25) * u, cy - .5 * u, .55 * u, 1.2 * u, 12), { wash: SEPIA.canas, sw: sw * .7 })); boilSeed('brillo'); SIL || inkLine([[-.6 * u, cy - 2.2 * u], [.3 * u, cy - 2.5 * u]], sw * .6, SEPIA.blanco, 'inkfine'); }
  // barba
  if (P.barba) { boilSeed('barba'); const g = P.barba === 'grande'; pnt([[-rx * .95 * u, cy + (g ? .2 : .9) * u], [rx * .95 * u, cy + (g ? .2 : .9) * u], [rx * .7 * u, cy + (g ? 2.6 : 1.8) * u], [0, cy + (g ? 4.4 : 2.9) * u], [-rx * .7 * u, cy + (g ? 2.6 : 1.8) * u]], { wash: SEPIA.canas, sw: sw * .8, curv: .6 }); }
  // ojos, párpados y gafas
  const ey = cy - .3 * u, parp = clamp(o.parp || 0);
  [-1, 1].forEach(s => { boilSeed('ojo' + s); pnt(ellPts(s * .85 * u + lx, ey, .22 * u, .26 * u * (1 - parp * .9), 10), { wash: SEPIA.tinta, ink: null }); });
  boilSeed('cejas'); [-1, 1].forEach(s => SIL || inkLine([[s * 1.35 * u, ey - (.75 + .25 * (o.cejas || 0) * (s > 0 ? 1 : 1)) * u], [s * .45 * u, ey - (.7 + .15 * (o.cejas || 0)) * u - (o.cejas < 0 ? -.15 * u : 0)]], sw * 1.1, P.pelo === 'calvo' ? '#8A8478' : SEPIA.canas, 'ink'));
  boilSeed('gafas'); if (P.gafas === 'redondas') [-1, 1].forEach(s => pnt(ellPts(s * .9 * u, ey, .62 * u, .62 * u, 18), { ink: SEPIA.tinta, sw: sw * 1.2, wash: SEPIA.blanco, washOp: 60 }));
  else [-1, 1].forEach(s => pnt(rrPts(s * .9 * u - .58 * u, ey - .38 * u, 1.16 * u, .76 * u, .12 * u), { ink: SEPIA.tinta, sw: sw * .7, wash: SEPIA.blanco, washOp: 40 }));
  SIL || inkLine([[-.3 * u, ey], [.3 * u, ey]], sw * .6, SEPIA.tinta, 'inkfine');
  // nariz y boca (abre con la voz)
  boilSeed('nariz'); SIL || inkLine([[.1 * u, ey + .2 * u], [.35 * u, ey + 1.1 * u], [0, ey + 1.25 * u]], sw * .8, SEPIA.pielDk, 'inkfine');
  const b = clamp(o.boca || 0), my = cy + 1.55 * u;
  boilSeed('boca'); if (b > .08) pnt(ellPts(0, my + .1 * u, .55 * u, (.12 + .45 * b) * u, 14), { wash: '#5A2A20', sw: sw * .7 });
  else SIL || inkLine([[-.5 * u, my], [0, my + .12 * u], [.5 * u, my - .04 * u]], sw * .9, SEPIA.tinta, 'ink');
  pop();
  brazo(1, o.aL || 0, o.eL || 0, o.manoL);
  pop();
}

// accesorios del Decano
function lupa(u, sw) { boilSeed('lupa'); inkLine([[0, 0], [1.6 * u, -1.6 * u]], sw * 2.2, SEPIA.sombra); paint(ellPts(2.4 * u, -2.4 * u, 1.2 * u, 1.2 * u, 20), { ink: SEPIA.tinta, sw: sw * 1.6, wash: '#DDEBF0', washOp: 90 }); }
function candil(u, sw) { boilSeed('candil'); inkLine([[0, 0], [0, 1.2 * u]], sw * 1.2, SEPIA.sombra); paint(rrPts(-.8 * u, 1.2 * u, 1.6 * u, 1.9 * u, .3 * u), { wash: SEPIA.ambar, sw }); paint(ellPts(0, 2.1 * u, .35 * u, .5 * u, 10), { wash: SEPIA.candil, ink: null }); }
