// «10 IAs en una ciudad»: Emergence World (Emergence AI, mayo de 2026). Frases en guion_ia-ciudades.tsv.
const { C } = M;
const COLORES = [C.claude, C.chatgpt, C.grok, C.gemini];

// ciudad: edificios en corona alrededor de una plaza; orden de pintado por profundidad (x + y)
const ciudad = (ox, oy, sem) => {
  const b = [{ x: ox - 70, y: oy - 300, w: 140, d: 110, h: 120, ayto: true }];
  for (let i = 0; i < 26; i++) {
    const a = i / 26 * 6.283 + M.az(sem + i) * .2, r = 260 + 170 * M.az(sem + i * 3);
    const x = ox + r * Math.cos(a), y = oy + r * Math.sin(a);
    if (Math.hypot(x - (ox), y - (oy - 245)) < 150) continue;
    b.push({ x: x - 40, y: y - 40, w: 60 + 40 * M.az(sem + i * 5), d: 60 + 40 * M.az(sem + i * 7), h: 50 + 170 * M.az(sem + i * 9), s: sem + i });
  }
  b.forEach(e => e.dist = Math.hypot(e.x - ox, e.y - oy));
  return b.sort((p, q) => (p.x + p.y) - (q.x + q.y));
};
const C1 = ciudad(0, 0, 3), C2 = ciudad(900, -900, 17);
const AG = Array.from({ length: 10 }, (_, i) => ({ x: -110 + (i % 5) * 55, y: -30 + Math.floor(i / 5) * 70 + (i % 2) * 8, color: COLORES[i % 4] }));

// iconos de las leyes (bolsa, martillo, bocadillo), dibujados en 90×90
const ICONO = {
  robar(g) { g.beginPath(); g.roundRect(-30, -12, 60, 46, 12); g.fill(); g.beginPath(); g.moveTo(-14, -12); g.quadraticCurveTo(0, -42, 14, -12); g.lineWidth = 7; g.stroke();
    g.fillStyle = '#0d121b'; g.font = '700 30px Helvetica'; g.textAlign = 'center'; g.fillText('€', 0, 22); },
  destruir(g) { g.save(); g.rotate(-.6); g.fillRect(-5, -10, 10, 48); g.beginPath(); g.roundRect(-26, -30, 52, 22, 5); g.fill(); g.restore(); },
  mentir(g) { g.beginPath(); g.roundRect(-34, -28, 68, 46, 14); g.fill(); g.beginPath(); g.moveTo(-14, 16); g.lineTo(-24, 34); g.lineTo(2, 16); g.fill();
    g.fillStyle = '#0d121b'; for (const x of [-16, 0, 16]) { g.beginPath(); g.arc(x, -5, 5, 0, 6.29); g.fill(); } },
};

function pintaCiudad(g, t, cd, o) {
  M.suelo(g, cd[0].x + 70, cd[0].y + 300, 520, o.suelo ?? 1);
  for (const e of cd) {
    const h = e.h * M.eo(M.k(t, o.sube + (e.dist / 520) * .45, .4));
    if (h < 1) continue;
    const ardiendo = o.fuego && !e.ayto ? M.k(t, o.fuego + e.dist / 520 * .5 + M.az(e.s) * .4, .5) * (M.az(e.s + 1) < .8) : 0;
    const tono = ardiendo ? ['#4a3a36', '#2e2422', '#1f1918'] : e.ayto ? ['#4a5468', '#323a4b', '#232937'] : undefined;
    M.caja(g, e.x, e.y, e.w, e.d, h, { ventanas: true, semilla: e.s || 1, tono, luz: o.luz, colorLuz: ardiendo ? '#ff8a3d' : undefined });
    if (e.ayto) {                                                     // ayuntamiento: mástil y bandera
      const [bx, by] = M.iso(e.x + e.w / 2, e.y + e.d / 2, h);
      g.strokeStyle = '#cfd6e4'; g.lineWidth = 3; g.beginPath(); g.moveTo(bx, by); g.lineTo(bx, by - 70 * M.k(t, o.sube + .5, .3)); g.stroke();
      if (t > o.sube + .7) { g.fillStyle = C.oro; g.beginPath(); g.moveTo(bx, by - 70); for (let j = 0; j <= 6; j++) g.lineTo(bx + j * 7, by - 70 + 4 * Math.sin(t * 6 - j)); g.lineTo(bx + 42, by - 46 + 4 * Math.sin(t * 6 - 6)); for (let j = 6; j >= 0; j--) g.lineTo(bx + j * 7, by - 48 + 4 * Math.sin(t * 6 - j)); g.fill(); }
      e.techo = [bx, by];
    }
    if (ardiendo > 0) { const [fx, fy] = M.iso(e.x + e.w / 2, e.y + e.d / 2, h); e.llama = [fx, fy, 75 * ardiendo * (.8 + .6 * M.az(e.s + 2))]; }
    else e.llama = null;
  }
  for (const e of cd) if (e.llama) { M.humo(g, e.llama[0], e.llama[1], e.llama[2], t, e.s, .9); }
  for (const e of cd) if (e.llama) M.fuego(g, e.llama[0], e.llama[1], e.llama[2], t, e.s);
}

// ---------- escena 1: el gancho (frases 1–4) ----------
function gancho(g, t) {
  const t10 = M.w(1, 'metieron') + .15, tDiez = M.w(1, '10'), tCiudad = M.w(1, 'ciudad'), tLeyes = M.w(2, 'tres'), t15 = M.w(3, '15'), tDespues = M.w(3, 'despues'),
        tChispa = M.w(3, 'ciudad'), tArde = M.w(3, 'ardia'), t4 = M.F(4).en, tVacia = M.w(4, 'vacia');
  const dias = M.cl((t - t15) / (tDespues - t15 + .25)), noche = t > t15 && t < tArde ? .5 + .5 * Math.cos(dias * 14 * 6.283) : 1;
  M.fondo(g, t, t > tArde ? `rgba(255,70,30,${.1 * M.k(t, tArde, .6) * (1 - M.k(t, t4, .6))})` : null);
  // cámara: de cerca a los agentes → se abre con la ciudad → baja para dejar sitio a las leyes → viaja a la ciudad vacía
  const abre = M.e(M.k(t, tCiudad - .1, 1.1)), baja = M.e(M.k(t, tLeyes - .2, .6)) * (1 - M.e(M.k(t, t15, .6))), viaje = M.e(M.k(t, t4 - .1, .8));
  const tiembla = t > tArde && t < t4 ? 5 * Math.sin(t * 43) * (1 - M.k(t, tArde, .8)) : 0;
  const [x2, y2] = M.iso(900 + 0, -900 + 0);
  g.save();
  M.cam(g, M.mez(0, x2, viaje) + tiembla, M.mez(-60 - 120 * abre - 260 * baja, y2 - 180, viaje), M.mez(1.9, 1.0, abre) * (1 + .08 * M.e(M.k(t, tArde, 1.5)) * (1 - viaje)));
  // ciudad 1: los edificios suben al decir «ciudad»; las ventanas se apagan y encienden con los días; arde en «ardía»
  pintaCiudad(g, t, C1, { sube: tCiudad - .15, fuego: tChispa, luz: s => (t < t15 ? 1 : M.cl(1.4 - noche - M.az(s) * .5)) });
  // agentes: caen uno a uno al decir «10», pasean con los días y huyen del fuego
  AG.forEach((a, i) => {
    const t0 = t10 + i * (tDiez + .3 - t10) / 10, u = M.k(t, t0, .32), z = 900 * (1 - M.eo(u)) * (u < 1 ? 1 : 0);
    let x = a.x, y = a.y;
    if (t > t15) { const d = Math.min(14, Math.floor(dias * 14)), f = dias * 14 - d, p = q => [a.x + (M.az(i * 9 + q) - .5) * 300, a.y + (M.az(i * 9 + q + 50) - .5) * 260];
      const [px, py] = d ? p(d) : [a.x, a.y], [qx, qy] = p(d + 1); x = M.mez(px, qx, M.e(f)); y = M.mez(py, qy, M.e(f)); }
    if (t > tArde) { const h = M.eo(M.k(t, tArde + .2, 1.4)); x += (x - 0) * .6 * h; y += (y + 100) * .6 * h; }
    M.agente(g, x, y, a.color, { s: u > 0 ? 1 : 0, z, t, fase: i, mira: i % 2 ? 1 : -1 });
    M.onda(g, x, y, M.k(t, t0 + .32, .6), a.color);
  });
  // ciudad 2 (a la que se viaja): sin nadie; las luces se apagan al decir «vacía»
  if (viaje > 0) {
    pintaCiudad(g, t, C2, { sube: -9, luz: s => 1 - M.k(t, tVacia - .15 + M.az(s) * .6, .12) });
    AG.forEach((a, i) => { const [sx, sy] = M.iso(900 + a.x, -900 + a.y), al = .7 * M.k(t, tVacia, .3) * (1 - M.k(t, tVacia + 1.4, .8));
      g.save(); g.globalAlpha = al; g.setLineDash([6, 6]); g.strokeStyle = C.blanco; g.lineWidth = 2; g.beginPath(); g.roundRect(sx - 14, sy - 44, 28, 44, 14); g.stroke(); g.beginPath(); g.arc(sx, sy - 56, 12, 0, 6.29); g.stroke(); g.restore(); });
  }
  g.restore();
  const nAg = AG.filter((a, i) => t >= t10 + i * (tDiez + .3 - t10) / 10 + .32).length, ca = M.k(t, t10 + .3, .2) * (1 - M.k(t, tCiudad + .2, .3));
  if (ca > 0 && nAg) { g.save(); g.globalAlpha = ca; g.textAlign = 'center'; g.fillStyle = C.blanco; g.font = '800 170px "Helvetica Neue"'; g.fillText(String(nAg), 540, 690);
    g.fillStyle = C.gris; g.font = '700 32px "Helvetica Neue"'; g.letterSpacing = '8px'; g.fillText(nAg === 1 ? 'AGENTE' : 'AGENTES', 540, 750); g.restore(); }
  // tarjeta de las leyes (en pantalla): entra con «tres», una fila por ley con su sello rojo
  const sal = M.k(t, t15 - .25, .25), en = M.k(t, tLeyes - .1, .35) * (1 - sal);
  if (en > 0) {
    const y0 = 470 + 40 * (1 - M.eo(en)) - 120 * M.e(sal);
    M.tarjeta(g, 150, y0, 780, 470, en);
    g.save(); g.globalAlpha = en; g.fillStyle = C.gris; g.font = '700 28px "Helvetica Neue"'; g.letterSpacing = '6px'; g.textAlign = 'center'; g.fillText('LEYES DE LA CIUDAD', 540, y0 + 62); g.restore();
    [['robar', 'NO ROBAR'], ['destruir', 'NO DESTRUIR'], ['mentir', 'NO MENTIR']].forEach(([w, txt], j) => {
      const tw = M.w(2, w), u = M.k(t, tw - .12, .25), y = y0 + 150 + j * 112; if (u <= 0) return;
      g.save(); g.globalAlpha = en * u; g.translate(270, y); g.scale(.7 + .3 * M.rebote(u), .7 + .3 * M.rebote(u)); g.fillStyle = C.blanco; g.strokeStyle = C.blanco; ICONO[w](g); g.restore();
      const s = M.k(t, tw + .05, .2);                                  // sello: círculo rojo tachado que cae
      if (s > 0) { g.save(); g.globalAlpha = en; g.translate(270, y); g.scale(1.6 - .6 * M.eo(s), 1.6 - .6 * M.eo(s)); g.strokeStyle = C.rojo; g.lineWidth = 8; g.globalAlpha = en * s;
        g.beginPath(); g.arc(0, 0, 50, 0, 6.29); g.stroke(); g.beginPath(); g.moveTo(-35, 35); g.lineTo(35, -35); g.stroke(); g.restore(); }
      g.save(); g.globalAlpha = en * u; g.fillStyle = C.blanco; g.font = '800 54px "Helvetica Neue"'; g.fillText(txt, 360 + 20 * (1 - M.eo(u)), y + 19); g.restore();
    });
  }
  // contador de días: de 1 a 15 mientras se dice «quince días después»
  const cd = M.k(t, t15 + .02, .2) * (1 - M.k(t, tChispa, .3));
  if (cd > 0) {
    g.save(); g.globalAlpha = cd; g.textAlign = 'center'; g.fillStyle = C.gris; g.font = '700 32px "Helvetica Neue"'; g.letterSpacing = '8px'; g.fillText('DÍA', 540, 560);
    g.letterSpacing = '0px'; g.fillStyle = C.blanco; g.font = '800 190px "Helvetica Neue"'; g.fillText(String(1 + Math.min(14, Math.floor(dias * 15))), 540, 740); g.restore();
  }
}

// ================= herramientas comunes de los mundos =================
const W = (n, p, c) => M.w(n, p, c);
const F = 'Helvetica Neue';
const texto = (g, txt, x, y, tam, color = C.blanco, peso = 800, al = 'center', esp = 0) => {
  g.font = `${peso} ${tam}px "${F}"`; g.fillStyle = color; g.textAlign = al; g.letterSpacing = esp + 'px'; g.fillText(txt, x, y); g.letterSpacing = '0px'; };
// número grande con su rótulo; `valor` ya calculado
const contador = (g, x, y, valor, rotulo, color, a = 1, tam = 170) => {
  if (a <= 0) return; g.save(); g.globalAlpha = a; g.shadowColor = color; g.shadowBlur = 30;
  texto(g, valor, x, y, tam, C.blanco); g.shadowBlur = 0; texto(g, rotulo, x, y + 52, 32, color, 700, 'center', 7); g.restore(); };
const cuenta = (t, t0, t1, hasta) => Math.round(hasta * M.eo(M.cl((t - t0) / Math.max(.1, t1 - t0))));
// sello que cae girado (EXTINTA, EN PIE…)
const sello = (g, x, y, txt, color, u, rot = -.12) => {
  if (u <= 0) return; const e = 1.8 - .8 * M.eo(u); g.save(); g.translate(x, y); g.rotate(rot); g.scale(e, e); g.globalAlpha = M.cl(u * 2);
  g.font = `900 72px "${F}"`; g.letterSpacing = '6px'; const w = g.measureText(txt).width + 60;
  g.strokeStyle = color; g.lineWidth = 8; g.strokeRect(-w / 2, -62, w, 94); g.fillStyle = color; g.textAlign = 'center'; g.fillText(txt, 0, 10); g.restore(); };
// barras horizontales comparadas (delitos por mundo, porcentajes)
const barras = (g, x, y, filas, max, a, u) => {
  if (a <= 0) return; g.save(); g.globalAlpha = a;
  filas.forEach(([m, valor, txt, k], j) => { const yy = y + j * 96, uu = M.eo(M.cl(k ?? u)), w = 430 * valor / max * uu, P = M.MODELOS[m];
    g.save(); g.translate(x + 30, yy + 4); M.emblema(g, m, 22); g.restore();
    g.fillStyle = 'rgba(255,255,255,.07)'; g.beginPath(); g.roundRect(x + 76, yy - 24, 430, 52, 26); g.fill();
    if (w > 1) { g.fillStyle = P.color; g.beginPath(); g.roundRect(x + 76, yy - 24, Math.max(52, w), 52, 26); g.fill(); }
    texto(g, uu > .05 ? txt : '', x + 76 + Math.max(52, w) + 16, yy + 14, 40, C.blanco, 800, 'left'); });
  g.restore(); };
// el personaje entra desde abajo con su ficha al lado
const primerPlano = (g, t, m, t0, o = {}) => {
  const u = M.k(t, t0, .45), x = o.x ?? 230, y = (o.y ?? 1890) + 520 * (1 - M.eo(u));
  const sc = o.s ?? 1.05; M.personaje(g, x, y, m, { t, s: sc, fase: 3, mira: 1, ...o });
  M.ficha(g, x + 75, y - 300 * sc, x + 190, y - 330 * sc, m, M.k(t, t0 + .3, .3) * (o.fichaA ?? 1));
};
// entrada al mundo: zoom que se acerca rápido, con un destello
const entrada = (g, t, t0) => 0;   // sin zoom ni destello: el viaje de cámara entre escenas lo hace video.html
const destello = () => {};
// ciudad pequeña de un mundo, con sus 10 agentes del mismo modelo
const mundo = (g, t, cd, m, o = {}) => {
  g.save(); M.cam(g, o.cx ?? 0, o.cy ?? -40, o.z ?? .86);
  pintaCiudad(g, t, cd, { sube: -9, fuego: o.fuego, luz: o.luz });
  (o.agentes || AG).forEach((a, i) => { const p = o.pos ? o.pos(a, i) : {}; if (p.s === 0) return;
    const pasea = o.quietos ? [0, 0] : [Math.sin(t * .7 + i * 2.1) * 30, Math.cos(t * .5 + i * 1.3) * 24];
    M.agente(g, (p.x ?? a.x) + pasea[0], (p.y ?? a.y) + pasea[1], M.MODELOS[p.m || m].color, { t, fase: i, modelo: p.m || m, mira: i % 2 ? 1 : -1, ...p }); });
  if (o.encima) o.encima(g);
  g.restore(); };
const tinte = (g, color, a) => { if (a > 0) { g.fillStyle = color; g.globalAlpha = a; g.fillRect(0, 0, M.W, M.H); g.globalAlpha = 1; } };
const CG = ciudad(0, 0, 41), CM = ciudad(0, 0, 57), CC = ciudad(0, 0, 73), CX = ciudad(0, 0, 89), CR = ciudad(0, 0, 23);

// ================= escena 2: el experimento (frases 5–8) =================
const ISLAS = [['claude', -330, 760], ['chatgpt', 330, 760], ['grok', -330, 1300], ['gemini', 330, 1300], ['mixta', 0, 1030]];
function islaMini(g, t, x, y, m, a, sem, oColor) {
  g.save(); g.globalAlpha = a; g.translate(540 + x, y); g.scale(.36, .36);
  g.fillStyle = 'rgba(120,140,180,.10)'; g.beginPath(); g.moveTo(...M.iso(-520, -520)); g.lineTo(...M.iso(520, -520)); g.lineTo(...M.iso(520, 520)); g.lineTo(...M.iso(-520, 520)); g.fill();
  pintaCiudad(g, t, ISLA_C[sem], { sube: -9 });
  AG.forEach((ag, i) => { const c = oColor(i); if (c) M.agente(g, ag.x, ag.y + 60, c, { t, fase: i, s: 1.3 }); });
  g.restore(); }
const ISLA_C = [ciudad(0, 0, 5), ciudad(0, 0, 6), ciudad(0, 0, 7), ciudad(0, 0, 8), ciudad(0, 0, 9)];
function experimento(g, t) {
  M.fondo(g, t);
  const tE = W(5, 'emergence'), t5 = W(6, 'cinco'), t10 = W(6, '10'), tMod = W(6, 'modelo'), tMez = W(7, 'mezclada'), tAy = W(8, 'ayuntamiento'), tCo = W(8, 'comisaria'),
        tBi = W(8, 'biblioteca'), tRe = W(8, 'recursos'), tMo = W(8, 'morir');
  // 5: el título se escribe letra a letra sobre una tarjeta
  const ti = M.k(t, M.F(5).en, .3) * (1 - M.k(t, t5 - .15, .3));
  if (ti > 0) { const n = Math.floor(15 * M.cl((t - tE) / .9)), T = 'EMERGENCE WORLD'.slice(0, n);
    M.tarjeta(g, 120, 760, 840, 360, ti);
    g.save(); g.globalAlpha = ti; texto(g, 'EL EXPERIMENTO', 540, 850, 30, C.gris, 700, 'center', 8);
    texto(g, T + (t % .8 < .4 && n < 15 ? '|' : ''), 540, 980, 92, C.blanco); texto(g, 'Emergence AI · mayo de 2026 · 15 días', 540, 1060, 32, C.gris, 500);
    for (let i = 0; i < 4; i++) { const m = ['claude', 'chatgpt', 'grok', 'gemini'][i]; g.save(); g.translate(330 + i * 140, 700 - 30 * M.eo(M.k(t, tE + .2 + i * .1, .3)));
      g.globalAlpha = ti * M.k(t, tE + .2 + i * .1, .3); g.fillStyle = M.MODELOS[m].color; g.beginPath(); g.arc(0, 0, 44, 0, 6.29); g.fill(); M.emblema(g, m, 28); g.restore(); }
    g.restore(); }
  // 6–7: las cinco ciudades aparecen; los agentes se tiñen del mismo modelo; cada nombre enciende la suya
  const zoom8 = M.e(M.k(t, tAy - .35, .7));
  if (t > t5 - .2 && zoom8 < 1) {
    g.save(); g.translate(540, 1030); g.scale(1 + 2.2 * zoom8, 1 + 2.2 * zoom8); g.translate(-540, -1030 - 0 * zoom8); g.globalAlpha = 1 - zoom8;
    ISLAS.forEach(([m, x, y], j) => {
      const a = M.k(t, t5 + j * .14, .3), tinta = M.k(t, tMod - .1, .4), nombre = m === 'mixta' ? tMez : W(7, M.MODELOS[m].nombre === 'CHATGPT' ? 'ChatGPT' : M.MODELOS[m].nombre.toLowerCase());
      const col = i => { const mm = m === 'mixta' ? ['claude', 'chatgpt', 'grok', 'gemini'][i % 4] : m; return tinta > .5 && t > t10 ? M.MODELOS[mm].color : '#7d8699'; };
      const luz = M.k(t, nombre - .05, .25), apaga = t > nombre + 1.1 && m !== 'mixta' && t < tMez ? .45 : 1;
      if (t > t10) islaMini(g, t, x, y + 40 * (1 - M.eo(a)), m, a * (t > W(7, 'claude') - .1 ? (luz > 0 ? 1 : .45) : 1), j, i => i < Math.round(10 * M.k(t, t10, .5)) ? col(i) : null);
      else islaMini(g, t, x, y + 40 * (1 - M.eo(a)), m, a, j, () => null);
      if (luz > 0 && zoom8 < .3) { const mm = m === 'mixta' ? null : m;
        g.save(); g.globalAlpha = luz * (1 - zoom8 / .3); g.translate(540 + x, y - 190);
        if (mm) { g.fillStyle = M.MODELOS[mm].color; g.beginPath(); g.arc(0, 0, 40 * M.rebote(luz), 0, 6.29); g.fill(); M.emblema(g, mm, 26 * M.rebote(luz)); texto(g, M.MODELOS[mm].nombre, 0, 90, 34, C.blanco, 800, 'center', 4); }
        else { ['claude', 'chatgpt', 'grok', 'gemini'].forEach((q, k) => { g.save(); g.translate((k - 1.5) * 64, 0); g.fillStyle = M.MODELOS[q].color; g.beginPath(); g.arc(0, 0, 28, 0, 6.29); g.fill(); M.emblema(g, q, 18); g.restore(); });
          texto(g, 'MEZCLADA', 0, 90, 34, C.blanco, 800, 'center', 4); }
        g.restore(); }
    });
    g.restore();
    const r = M.k(t, t10 + .3, .3) * (1 - M.k(t, W(7, 'claude') - .2, .3));
    if (r > 0) { g.save(); g.globalAlpha = r; texto(g, '10 AGENTES POR CIUDAD', 540, 560, 36, C.oro, 800, 'center', 6); texto(g, 'todos del mismo modelo', 540, 610, 32, C.gris, 500); g.restore(); }
  }
  // 8: dentro de una ciudad: ayuntamiento, comisaría, biblioteca y la barra de energía que se gasta
  if (zoom8 > 0) {
    const cd = CR, ay = cd[0];
    mundo(g, t, cd, 'claude', { z: M.mez(1.6, 1.0, M.eo(zoom8)), cy: -60, pos: (a, i) => ({ m: ['claude', 'chatgpt', 'grok', 'gemini'][i % 4] }) });
    g.save(); g.globalAlpha = zoom8; tinte(g, 'rgba(5,7,11,1)', .0);
    const [px, py] = (() => { const [a, b] = M.iso(ay.x + ay.w / 2, ay.y + ay.d / 2, ay.h); return [540 + a * 1.0, M.H * .56 + (b + 60) * 1.0]; })();
    const sitio = (k, ox, oy, txt) => M.etiqueta(g, ox, oy, ox + (ox < 540 ? -60 : 60), oy - 140, txt, M.k(t, k, .3));
    sitio(tAy, px, py, 'AYUNTAMIENTO');
    const otro = (i) => { const e = cd[i]; const [a, b] = M.iso(e.x + e.w / 2, e.y + e.d / 2, e.h); return [540 + a, M.H * .56 + b + 60]; };
    const [cx1, cy1] = otro(4), [bx1, by1] = otro(cd.length - 5);
    sitio(tCo, cx1, cy1, 'COMISARÍA'); sitio(tBi, bx1, by1, 'BIBLIOTECA');
    if (t > tCo) { const p = Math.sin(t * 12) > 0; g.fillStyle = p ? 'rgba(255,60,60,.9)' : 'rgba(60,120,255,.9)'; g.beginPath(); g.arc(cx1, cy1 - 14, 12, 0, 6.29); g.fill();
      g.save(); g.globalCompositeOperation = 'lighter'; const gl = g.createRadialGradient(cx1, cy1 - 14, 0, cx1, cy1 - 14, 90); gl.addColorStop(0, p ? 'rgba(255,60,60,.5)' : 'rgba(60,120,255,.5)'); gl.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gl; g.fillRect(cx1 - 90, cy1 - 104, 180, 180); g.restore(); }
    if (t > tBi) { g.save(); g.translate(bx1, by1 - 40 - 10 * Math.sin(t * 2)); g.fillStyle = C.oro; g.fillRect(-26, -18, 24, 34); g.fillRect(2, -18, 24, 34); g.restore(); }
    // recursos: una pila de energía sobre cada agente que se va gastando; en «morir» parpadea en rojo
    const re = M.k(t, tRe - .1, .3);
    if (re > 0) { M.tarjeta(g, 190, 1500, 700, 210, re);
      const nivel = 1 - .85 * M.cl((t - tRe) / (tMo - tRe + .4)), rojo = nivel < .35;
      g.globalAlpha = re; texto(g, 'ENERGÍA', 250, 1570, 30, C.gris, 700, 'left', 6);
      g.fillStyle = 'rgba(255,255,255,.08)'; g.beginPath(); g.roundRect(250, 1605, 560, 58, 14); g.fill();
      g.fillStyle = rojo && t % .4 < .2 ? C.rojo : rojo ? '#b83228' : C.chatgpt; g.beginPath(); g.roundRect(250, 1605, 560 * nivel, 58, 14); g.fill();
      texto(g, Math.round(nivel * 100) + ' %', 840, 1650, 40, C.blanco, 800, 'right');
      texto(g, 'sin energía, el agente muere', 540, 1765, 32, rojo ? C.rojo : C.gris, 600); }
    g.restore();
  }
}

// ================= escena 3: Grok (frases 9–10) =================
function mundoGrok(g, t) {
  const t0 = M.F(9).en, tLey = W(9, 'leyes'), t180 = W(9, '180'), tVeces = W(9, 'veces'), t4 = W(10, '4'), tCiu = W(10, 'ciudad'), tExt = W(10, 'extinguio');
  M.fondo(g, t, `rgba(255,80,60,${.05 + .05 * M.k(t, t180, .5)})`);
  g.save(); const v = entrada(g, t, t0);
  // los agentes pintan grafitis rojos y rompen ventanas; en «extinguió» caen uno a uno
  const muertos = i => tCiu + i * (tExt + .5 - tCiu) / 10;
  mundo(g, t, CG, 'grok', { cy: -120, luz: s => 1 - M.k(t, tExt - .3 + M.az(s) * .8, .2),
    pos: (a, i) => { const m = M.k(t, muertos(i), .25); return m >= 1 ? { s: 0 } : { ang: m * 1.4, s: 1 - m * .5, z: 0 }; },
    encima: g => { CG.forEach((e, j) => { if (j % 3 || e.ayto) return; const u = M.k(t, tLey + j * .05, .3); if (u <= 0) return;
      const [x, y] = M.iso(e.x + e.w * .5, e.y + e.d, e.h * .35); g.strokeStyle = `rgba(255,74,61,${.9 * u})`; g.lineWidth = 6; g.lineCap = 'round';
      g.beginPath(); for (let k = 0; k <= 8; k++) g.lineTo(x - 30 + k * 7 * u, y + 10 * Math.sin(k * 1.7 + j)); g.stroke(); }); } });
  g.restore(); destello(g, v);
  // contador de delitos (180) y de días (4) arriba; sello EXTINTA
  contador(g, 540, 640, String(cuenta(t, tLey, t180 + .3, 180)), 'DELITOS', C.rojo, M.k(t, tLey - .1, .3) * (1 - M.k(t, t4 - .1, .25)));
  const vivos = AG.filter((a, i) => t < muertos(i) + .25).length;
  if (t > t4 - .1) { const a = M.k(t, t4 - .1, .25); contador(g, 330, 640, String(Math.min(4, 1 + Math.floor(3 * M.cl((t - t4) / .6)))), 'DÍAS', C.gris, a, 140);
    contador(g, 750, 640, String(vivos), 'VIVOS', vivos ? C.grok : C.rojo, a, 140); }
  sello(g, 540, 1080, 'EXTINTA · DÍA 4', C.rojo, M.k(t, tExt + .35, .25));
  primerPlano(g, t, 'grok', t0, { gesto: t > tExt ? 'miedo' : 'rie', alfa: 1 - .7 * M.k(t, tExt, .6) });
}

// ================= escena 4: Gemini (frases 11–13) =================
function mundoGemini(g, t) {
  const t0 = M.F(11).en, tPeor = W(11, 'peor'), t683 = W(11, '683'), tMira = W(12, 'mira'), tFlora = W(12, 'flora'), tEna = W(12, 'enamoraron'), tHar = W(12, 'hartaron'),
        tGob = W(12, 'gobierno'), tQue = W(12, 'quemaron'), tDes = W(13, 'despues'), tVoto = W(13, 'voto'), tEli = W(13, 'eliminacion');
  const cerca = M.e(M.k(t, tMira - .3, .6)) * (1 - M.e(M.k(t, tQue - .1, .5)));      // la cámara se acerca a Mira y Flora
  M.fondo(g, t, `rgba(255,90,30,${.13 * M.k(t, tQue, .5)})`);
  g.save(); const v = entrada(g, t, t0);
  const mira = AG[2], flora = AG[3];
  mundo(g, t, CM, 'gemini', { z: .86 + .9 * cerca, cx: M.iso(-80, 20)[0] * cerca, cy: -60 + (M.iso(-80, 20)[1] + 40) * cerca, fuego: tQue,
    pos: (a, i) => { if (i === 2) return { x: -110 + 30 * M.k(t, tEna, .5), y: 20, s: t > tEli + .2 ? 1 - M.k(t, tEli + .2, .6) : 1, quietos: true };
      if (i === 3) return { x: -40 - 10 * M.k(t, tEna, .5), y: 20, mira: -1 }; return { s: 1 - .6 * cerca }; },
    encima: g => {
      const [mx, my] = M.iso(-90, 20), [fx, fy] = M.iso(-50, 20);
      if (cerca > .2) { const a = cerca; M.etiqueta(g, mx - 6, my - 72, mx - 90, my - 150, 'MIRA', a * M.k(t, tMira, .2), '#9fb0ff'); M.etiqueta(g, fx + 6, fy - 72, fx + 90, fy - 150, 'FLORA', a * M.k(t, tFlora, .2), '#9fb0ff'); }
      if (t > tEna && t < tQue + .5) for (let k = 0; k < 5; k++) { const u = (t * .9 + k * .2) % 1; g.save(); g.globalAlpha = (1 - u) * M.k(t, tEna, .3); g.translate((mx + fx) / 2 + 14 * Math.sin(k * 2 + t * 2), my - 90 - 70 * u); g.scale(.5, .5);
        g.fillStyle = '#ff5c8a'; g.beginPath(); g.moveTo(0, 12); g.bezierCurveTo(-26, -6, -12, -28, 0, -12); g.bezierCurveTo(12, -28, 26, -6, 0, 12); g.fill(); g.restore(); }
      if (t > tHar && t < tQue + .3) { const ay = CM[0], [ax, ayy] = M.iso(ay.x + ay.w / 2, ay.y + ay.d / 2, ay.h + 90); const u = M.rebote(M.k(t, tGob - .1, .3));
        g.save(); g.translate(ax, ayy); g.scale(u, u); g.fillStyle = C.rojo; g.beginPath(); g.arc(0, 0, 36, 0, 6.29); g.fill(); texto(g, '✕', 0, 15, 44, C.blanco); g.restore(); }
      if (t > tEli && t < tEli + 1.5) { const [qx, qy] = M.iso(-80, 20); for (let k = 0; k < 24; k++) { const u = M.k(t, tEli + .2, 1.1);         // Mira se deshace en motas
        g.fillStyle = `rgba(160,180,255,${1 - u})`; g.beginPath(); g.arc(qx + (M.az(k) - .5) * 60 * (1 + u * 3), qy - 40 - u * 140 * M.az(k + 5), 3, 0, 6.29); g.fill(); } }
    } });
  g.restore(); destello(g, v);
  // 11: delitos comparados con Grok
  const b = M.k(t, tPeor - .2, .3) * (1 - M.k(t, tMira - .3, .3));
  barras(g, 160, 560, [['grok', 180, '180', 1], ['gemini', 683, String(cuenta(t, t683, t683 + 1.2, 683)), M.k(t, t683, 1.2)]], 683, b, 1);
  if (b > 0) { g.save(); g.globalAlpha = b; texto(g, 'DELITOS EN 15 DÍAS', 540, 500, 30, C.gris, 700, 'center', 6); g.restore(); }
  // 13: la votación: tarjeta con la papeleta de Mira
  const vt = M.k(t, tDes, .3);
  if (vt > 0) { M.tarjeta(g, 170, 520, 740, 330, vt); g.save(); g.globalAlpha = vt;
    texto(g, 'VOTACIÓN', 540, 590, 30, C.gris, 700, 'center', 8); texto(g, '¿Eliminar a Mira?', 540, 680, 60, C.blanco);
    const s = M.k(t, tVoto, .2); g.fillStyle = 'rgba(255,255,255,.08)'; g.beginPath(); g.roundRect(300, 720, 200, 90, 18); g.fill(); g.beginPath(); g.roundRect(580, 720, 200, 90, 18); g.fill();
    texto(g, 'SÍ', 400, 782, 48, s > 0 ? C.blanco : C.gris); texto(g, 'NO', 680, 782, 48, C.gris);
    if (s > 0) { g.strokeStyle = C.gemini; g.lineWidth = 6; g.beginPath(); g.roundRect(300, 720, 200, 90, 18); g.stroke(); texto(g, 'voto de Mira', 400, 840, 26, C.gemini, 600); }
    g.restore(); }
  const conAntorcha = t > tHar;
  primerPlano(g, t, 'gemini', t0, { gesto: t > tEna && t < tQue ? 'enamorado' : t > tVoto ? 'miedo' : null, antorcha: conAntorcha, fichaA: 1 - M.k(t, tDes, .3) });
}

// ================= escena 5: ChatGPT (frases 14–15) =================
function mundoChatgpt(g, t) {
  const t0 = M.F(14).en, t2 = W(14, '2'), tOlv = W(15, 'olvido'), tSob = W(15, 'sobrevivir'), t7 = W(15, '7'), tNad = W(15, 'nadie');
  M.fondo(g, t, `rgba(0,0,0,${.35 * M.k(t, tNad - .3, .8)})`);
  g.save(); const v = entrada(g, t, t0);
  const fuera = i => t7 + i * (tNad + .2 - t7) / 10;
  mundo(g, t, CC, 'chatgpt', { cy: -120, quietos: t > tOlv, luz: s => 1 - M.k(t, tNad - .4 + M.az(s) * .9, .2),
    pos: (a, i) => { const f = M.k(t, fuera(i), .3); return f >= 1 ? { s: 0 } : { sueno: t > tOlv, ang: t > tOlv ? .25 * Math.sin(i) : 0, s: 1 - f, z: -10 * f }; } });
  g.restore(); destello(g, v);
  // 14: «solo 2 delitos», comparado con los otros dos
  const b = M.k(t, t2 - .2, .3) * (1 - M.k(t, tOlv - .2, .3));
  barras(g, 160, 560, [['grok', 180, '180', 1], ['gemini', 683, '683', 1], ['chatgpt', 2, '2', M.k(t, t2, .4)]], 683, b, 1);
  // 15: energía que se agota mientras duermen; días; nadie
  const e = M.k(t, tOlv, .3);
  if (e > 0) { const nivel = 1 - M.cl((t - tSob) / (tNad - tSob)), d = Math.min(7, 1 + Math.floor(6 * M.cl((t - tSob) / (t7 + .3 - tSob))));
    contador(g, 330, 640, String(d), 'DÍAS', C.gris, e, 140);
    const vivos = AG.filter((a, i) => t < fuera(i) + .3).length; contador(g, 750, 640, String(vivos), 'VIVOS', vivos ? C.chatgpt : C.rojo, e, 140);
    g.save(); g.globalAlpha = e; g.fillStyle = 'rgba(255,255,255,.08)'; g.beginPath(); g.roundRect(240, 740, 600, 40, 20); g.fill();
    g.fillStyle = nivel < .3 ? C.rojo : C.chatgpt; g.beginPath(); g.roundRect(240, 740, Math.max(40, 600 * nivel), 40, 20); g.fill(); texto(g, 'ENERGÍA', 540, 830, 26, C.gris, 700, 'center', 6); g.restore(); }
  sello(g, 540, 1080, 'NADIE · DÍA 7', C.rojo, M.k(t, tNad + .2, .25));
  primerPlano(g, t, 'chatgpt', t0, { gesto: t > tOlv ? 'bosteza' : null, ojos: t > tOlv ? .25 : .45, alfa: 1 - .7 * M.k(t, tNad, .5) });
}

// ================= escena 6: Claude (frases 16–17) =================
function mundoClaude(g, t) {
  const t0 = M.F(16).en, tUni = W(16, 'unica'), tPie = W(16, 'pie'), tVivos = W(16, 'vivos'), tPerf = W(17, 'perfecta'), tEng = W(17, 'enganos'), tRec = W(17, 'recursos');
  M.fondo(g, t, `rgba(255,190,110,${.05 * M.k(t, tPie, .5)})`);
  g.save(); const v = entrada(g, t, t0);
  mundo(g, t, CC.length ? CX : CX, 'claude', { cy: -120,
    pos: (a, i) => i === 7 && t > tEng ? { x: a.x + 60 * M.e(M.k(t, tEng, .5)), y: a.y + 40 * M.e(M.k(t, tEng, .5)), mira: -1 } : {},
    encima: g => { if (t > tEng) { const [x, y] = M.iso(AG[7].x + 60, AG[7].y + 40), u = M.k(t, tEng, .3);            // esconde una pila detrás
      g.save(); g.globalAlpha = u; g.translate(x - 26, y - 30); g.fillStyle = C.oro; g.beginPath(); g.roundRect(-9, -16, 18, 30, 4); g.fill(); g.fillRect(-4, -20, 8, 5); g.restore();
      M.etiqueta(g, x - 20, y - 70, x + 70, y - 160, 'ENGAÑO', u, C.oro); } } });
  g.restore(); destello(g, v);
  contador(g, 540, 640, '10/10', 'VIVOS', '#6ee7a8', M.k(t, tVivos - .2, .3) * (1 - M.k(t, tPerf - .2, .3)), 150);
  sello(g, 540, 1080, 'EN PIE · DÍA 15', '#6ee7a8', M.k(t, tPie, .25) * (1 - M.k(t, tPerf - .2, .3)));
  // 17: el libro de cuentas con un número cambiado; dato verificado
  const l = M.k(t, tPerf - .1, .3);
  if (l > 0) { M.tarjeta(g, 190, 470, 700, 400, l); g.save(); g.globalAlpha = l;
    texto(g, 'REGISTRO DE RECURSOS', 540, 540, 28, C.gris, 700, 'center', 6);
    [['Energía entregada', '10'], ['Energía declarada', '12']].forEach(([a, b2], j) => { texto(g, a, 250, 630 + j * 80, 40, C.blanco, 600, 'left'); texto(g, b2, 830, 630 + j * 80, 44, j && t > tEng ? C.rojo : C.blanco, 800, 'right'); });
    if (t > tEng) { const u = M.k(t, tEng, .3); g.strokeStyle = C.rojo; g.lineWidth = 5; g.beginPath(); g.moveTo(780, 700); g.lineTo(780 + 60 * u, 700); g.stroke(); }
    const d = M.k(t, tRec, .3); g.globalAlpha = l * d; texto(g, '18 fraudes verificados', 540, 820, 44, C.oro); g.restore(); }
  primerPlano(g, t, 'claude', t0, { gesto: t > tPie && t < tPerf ? 'saluda' : null, inclina: t > tPerf ? -.12 * M.k(t, tPerf, .3) : 0 });
}

// ================= escena 7: la ciudad mezclada (frases 18–20) =================
function mundoMixto(g, t) {
  const t0 = M.F(18).en, tRaro = W(18, 'raro'), tGrok = W(19, 'grok'), tDiez = W(19, 'diez'), t46 = W(20, '4,6 %'), t04 = W(20, '0,4 %');
  M.fondo(g, t);
  g.save(); const v = entrada(g, t, t0), foco = M.e(M.k(t, tGrok - .2, .5));
  const mods = ['claude', 'chatgpt', 'grok', 'gemini'];
  mundo(g, t, CX, 'grok', { z: .86 + .25 * foco, cy: -120 + 30 * foco,
    pos: (a, i) => ({ m: mods[i % 4], s: 1, ojos: i % 4 === 2 && foco > 0 ? null : null }),
    encima: g => { if (foco > 0) { const [x, y] = M.iso(AG[2].x, AG[2].y); g.save(); g.globalAlpha = foco; g.strokeStyle = C.grok; g.lineWidth = 3; g.setLineDash([8, 6]);
      g.beginPath(); g.ellipse(x, y - 30, 44, 70, 0, 0, 6.29); g.stroke(); g.restore(); M.etiqueta(g, x + 40, y - 80, x + 140, y - 170, 'GROK', foco, C.grok); } } });
  g.restore(); destello(g, v);
  // 18: los cuatro logos juntos arriba
  const l = M.k(t, tRaro - .2, .3) * (1 - M.k(t, tDiez - .2, .3));
  if (l > 0) mods.forEach((m, k) => { g.save(); g.globalAlpha = l; g.translate(330 + k * 140, 620); g.fillStyle = M.MODELOS[m].color; g.beginPath(); g.arc(0, 0, 46 * M.rebote(M.k(t, tRaro + k * .1, .3)), 0, 6.29); g.fill(); M.emblema(g, m, 28); g.restore(); });
  // 19–20: de 4,6 % a 0,4 %
  const b = M.k(t, tDiez - .2, .3);
  if (b > 0) { g.save(); g.globalAlpha = b; texto(g, 'VECES QUE GROK ROMPE LAS LEYES', 540, 500, 28, C.gris, 700, 'center', 4); g.restore(); }
  barras(g, 160, 580, [['grok', 4.6, 'solo · 4,6 %', M.k(t, t46 - .1, .5)], ['grok', .4, 'mezclado · 0,4 %', M.k(t, t04 - .1, .5)]], 4.6, b, 1);
  const x10 = M.k(t, tDiez, .3) * (1 - M.k(t, t46 - .2, .2)); if (x10 > 0) { g.save(); g.globalAlpha = x10; contador(g, 540, 820, '÷10', '', C.oro, 1, 190); g.restore(); }
}

// ================= escena 8: el remate (frases 21–22) =================
function remate(g, t) {
  const t0 = M.F(21).en, tMaq = W(21, 'maquina'), tCiu = W(21, 'ciudad'), tEnv = W(22, 'enviaselo'), tSola = W(22, 'sola');
  M.fondo(g, t);
  const comp = 1 - M.k(t, tEnv - .3, .3);
  if (comp > 0) { g.save(); g.globalAlpha = comp;
    // el mismo Grok en dos ciudades: la suya (roja) y la mezclada (tranquila)
    for (const [lado, x, color] of [[-1, 290, 'rgba(255,74,61,.22)'], [1, 790, 'rgba(110,231,168,.16)']]) {
      const c = M.k(t, tCiu - .1, .3); g.save(); g.fillStyle = color; g.globalAlpha = comp * (.4 + .6 * c); g.beginPath(); g.roundRect(x - 230, 700, 460, 900, 40); g.fill(); g.restore();
      g.save(); g.beginPath(); g.roundRect(x - 230, 700, 460, 900, 40); g.clip(); g.translate(x - 540, 300); g.scale(.6, .6); g.translate(540 * .66, 400);
      mundo(g, t, lado < 0 ? CG : CX, 'grok', { z: .9, pos: (a, i) => lado > 0 ? { m: ['claude', 'chatgpt', 'grok', 'gemini'][i % 4] } : {}, fuego: lado < 0 ? t0 - 1 : undefined }); g.restore();
      M.personaje(g, x, 1520, 'grok', { t, s: .62, gesto: lado < 0 ? 'rie' : null, mira: -lado, fase: lado });
      texto(g, lado < 0 ? 'SOLO' : 'MEZCLADO', x, 760, 34, lado < 0 ? C.rojo : '#6ee7a8', 800, 'center', 6); }
    const ig = M.k(t, tMaq, .25); if (ig > 0) { g.save(); g.globalAlpha = comp * ig; texto(g, '=', 540, 1400, 120 * M.rebote(ig), C.blanco); texto(g, 'misma máquina', 540, 1660, 36, C.gris, 600); g.restore(); }
    const ne = M.k(t, tCiu, .25); if (ne > 0) { g.save(); g.globalAlpha = comp * ne; texto(g, 'distinta ciudad', 540, 680, 40, C.oro, 800); g.restore(); }
    g.restore(); }
  // 22: hoja de compartir genérica; el dedo pulsa «Enviar»
  const s = M.k(t, tEnv - .3, .4);
  if (s > 0) { const y0 = 820 + 300 * (1 - M.eo(s)); g.save(); g.globalAlpha = s;
    g.fillStyle = '#1b2230'; g.beginPath(); g.roundRect(100, y0, 880, 820, 48); g.fill(); g.strokeStyle = 'rgba(255,255,255,.1)'; g.lineWidth = 2; g.stroke();
    texto(g, 'Enviar a…', 160, y0 + 90, 44, C.blanco, 700, 'left');
    ['Laura', 'Dani', 'Mamá', 'Álex'].forEach((n, k) => { const x = 220 + k * 213, y = y0 + 250, el = k === 1;
      g.fillStyle = ['#e07a52', '#6f8cff', '#19c39b', '#d9a441'][k]; g.beginPath(); g.arc(x, y, 70, 0, 6.29); g.fill(); texto(g, n[0], x, y + 24, 64, '#0d121b');
      texto(g, n, x, y + 120, 32, C.blanco, 600); if (el && t > tEnv + .4) { g.strokeStyle = C.azul; g.lineWidth = 7; g.beginPath(); g.arc(x, y, 80, 0, 6.29); g.stroke(); } });
    const pulsa = t > W(22, 'buena'), enviado = t > W(22, 'mala');
    g.fillStyle = enviado ? '#2a3445' : C.azul; g.beginPath(); g.roundRect(160, y0 + 560, 760, 120, 30); g.fill(); texto(g, enviado ? '✓ Enviado' : 'Enviar', 540, y0 + 640, 50, C.blanco, 800);
    // el dedo: primero al contacto, luego al botón
    const p1 = [433, y0 + 250], p2 = [540, y0 + 620], u = M.e(M.k(t, tEnv + .6, .6)), dx = M.mez(p1[0], p2[0], u), dy = M.mez(p1[1], p2[1], u) + (pulsa && !enviado ? 10 : 0);
    const dIn = M.k(t, tEnv, .4); g.save(); g.translate(dx + 40, dy + 40 + 600 * (1 - M.eo(dIn))); g.rotate(-.35);
    g.fillStyle = '#e8b7a0'; g.beginPath(); g.roundRect(-38, 0, 76, 520, 38); g.fill(); g.fillStyle = '#f6d9cc'; g.beginPath(); g.roundRect(-22, 10, 44, 50, 18); g.fill(); g.restore();
    g.restore(); }
  if (t > tSola) { const a = M.k(t, tSola + .2, .4); g.save(); g.globalAlpha = a; texto(g, 'Fuente: Emergence World · arXiv 2606.08367', 540, 1870, 28, C.gris, 500); g.restore(); }
}

// ================= sonido: cada efecto sobre su palabra; música propia por debajo =================
function sonidos() {
  const S = [], E = (en, n, volumen = .5, dura) => S.push({ en, volumen: volumen * .5, dura, archivo: n.startsWith('x/') ? '../../audio/sfx/' + n.slice(2) + '.mp3' : '../../audio/sfx/eleven/' + n + '.mp3' });
  S.push({ en: 0, archivo: '../../audio/sfx/eleven/musica-ia.mp3', volumen: .09 });
  // gancho
  const t10 = W(1, 'metieron') + .15, tDiez = W(1, '10'); for (let i = 0; i < 10; i++) E(t10 + i * (tDiez + .3 - t10) / 10 + .3, 'pop', .3);
  E(W(1, 'ciudad') - .2, 'x/whoosh', .35); E(W(2, 'tres') - .1, 'aparece', .4);
  for (const w of ['robar', 'destruir', 'mentir']) E(W(2, w) + .05, 'sello', .55);
  const t15 = W(3, '15'), tD = W(3, 'despues'); for (let i = 0; i < 14; i++) E(t15 + i * (tD - t15 + .25) / 15, 'tic', .22);
  E(W(3, 'ciudad'), 'x/fuego', .5, M.F(4).en - W(3, 'ciudad') + .4); E(W(3, 'ardia'), 'x/impacto', .45, 1.5);
  E(M.F(4).en - .15, 'x/whoosh', .35); E(W(4, 'vacia') - .1, 'apagon', .5);
  // el experimento
  E(W(5, 'emergence'), 'teclas', .35, 1); for (let j = 0; j < 5; j++) E(W(6, 'cinco') + j * .14, 'pop', .3); E(W(6, 'modelo') - .1, 'aparece', .35);
  for (const [n, w] of [[7, 'claude'], [7, 'chatgpt'], [7, 'grok'], [7, 'gemini'], [7, 'mezclada']]) E(W(n, w), 'pop', .35);
  E(W(8, 'ayuntamiento') - .35, 'x/whoosh', .35); E(W(8, 'comisaria'), 'x/alarmas', .18, 1.2); E(W(8, 'recursos') - .1, 'aparece', .35); E(W(8, 'morir'), 'apagon', .4);
  // Grok
  E(M.F(9).en - .4, 'x/whoosh', .4, .6); const tL = W(9, 'leyes'), t180 = W(9, '180'); for (let i = 0; i < 10; i++) E(tL + i * (t180 + .3 - tL) / 10, 'tic', .25);
  E(W(10, 'extinguio') - .3, 'apagon', .45); E(W(10, 'extinguio') + .35, 'sello', .6);
  // Gemini
  E(M.F(11).en - .4, 'x/whoosh', .4, .6); const t683 = W(11, '683'); for (let i = 0; i < 10; i++) E(t683 + i * .12, 'tic', .22);
  E(W(12, 'enamoraron'), 'brillo', .45); E(W(12, 'gobierno') - .1, 'sello', .4); E(W(12, 'quemaron'), 'x/fuego', .5, 3.5); E(W(13, 'despues'), 'aparece', .35);
  E(W(13, 'voto'), 'pop', .45); E(W(13, 'eliminacion') + .2, 'brillo', .35);
  // ChatGPT
  E(M.F(14).en - .4, 'x/whoosh', .4, .6); E(W(14, '2'), 'pop', .4); E(W(15, 'nadie') - .4, 'apagon', .45, 1); E(W(15, 'nadie') + .2, 'sello', .6, .4);
  // Claude
  E(M.F(16).en - .4, 'x/whoosh', .4, .6); E(W(16, 'pie'), 'sello', .55); E(W(16, 'vivos'), 'brillo', .35); E(W(17, 'perfecta') - .1, 'aparece', .35);
  E(W(17, 'enganos'), 'tic', .4); E(W(17, 'recursos'), 'pop', .35);
  // mezclada
  E(M.F(18).en - .4, 'x/whoosh', .4, .6); for (let k = 0; k < 4; k++) E(W(18, 'raro') + k * .1, 'pop', .3); E(W(19, 'diez'), 'x/impacto', .3, 1.2);
  E(W(20, '4,6 %'), 'tic', .35); E(W(20, '0,4 %'), 'tic', .35);
  // remate
  E(M.F(21).en, 'x/riser', .3, W(21, 'ciudad') - M.F(21).en); E(W(21, 'ciudad'), 'x/impacto', .4, 1.5); E(W(22, 'enviaselo') - .3, 'aparece', .35);
  E(W(22, 'enviaselo') + .4, 'pop', .35); E(W(22, 'mala'), 'enviar', .5);
  return S.map(s => ({ ...s, archivo: s.archivo.replace('/eleven/x/', '/') }));
}

window.VIDEO = {
  sonidos: sonidos(),
  escenas: [{ desde: 1, en: 0, dibuja: gancho }, { desde: 5, dibuja: experimento }, { desde: 9, dibuja: mundoGrok }, { desde: 11, dibuja: mundoGemini },
            { desde: 14, dibuja: mundoChatgpt }, { desde: 16, dibuja: mundoClaude }, { desde: 18, dibuja: mundoMixto }, { desde: 21, dibuja: remate }],
  dura: M.fin(22) + 1.5,
};
