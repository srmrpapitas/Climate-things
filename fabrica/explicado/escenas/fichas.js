// Hoja de personajes: los cuatro modelos con su logo, objeto y gesto.
window.VIDEO = { dura: 4, escenas: [{ en: 0, dibuja(g, t) {
  M.fondo(g, t);
  const L = [['claude', 290, 900, 'saluda'], ['chatgpt', 790, 900, 'bosteza'], ['grok', 290, 1700, 'rie'], ['gemini', 790, 1700, 'enamorado']];
  for (const [m, x, y, gesto] of L) { M.personaje(g, x, y, m, { t, s: .95, gesto, antorcha: true, fase: x, mira: x < 540 ? 1 : -1 });
    M.ficha(g, x - 30, y - 470, x - 90, y - 560, m); }
} }] };
