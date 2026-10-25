// Archivos que carga el juego al arrancar. Cada escenario va en escenarios/<clave>.js
// (window.ESCENARIOS.<clave> = {...}) y cada fenómeno en fenomenos/<tipo>.js (window.FENOMENOS.<tipo> = {...}).
// Idioma: ?lang=en o ?lang=es (inglés por defecto). Se recuerda en el navegador.
window.LANG = (() => { const q = new URLSearchParams(location.search).get('lang'); let l = q;
  try { if (q) localStorage.setItem('lang', q); else l = localStorage.getItem('lang'); } catch (e) {}
  return l === 'es' ? 'es' : 'en'; })();
document.documentElement.lang = window.LANG;
// T('texto en español', 'text in English'): devuelve el del idioma elegido
window.T = (es, en) => window.LANG === 'en' ? en : es;
window.ESCENARIOS = {};
window.FENOMENOS = {};
window.LISTA = {
  // comun.js va primero: utilidades que usan los demás fenómenos (window.COMUN)
  fenomenos: ['fenomenos/comun.js', 'fenomenos/ola.js', 'fenomenos/terremoto.js', 'fenomenos/decibelios.js', 'fenomenos/calor.js', 'fenomenos/frio.js', 'fenomenos/co2.js', 'fenomenos/gravedad.js', 'fenomenos/meteorito.js', 'fenomenos/viento.js', 'fenomenos/virus.js', 'fenomenos/anime.js', 'fenomenos/boxeo.js', 'fenomenos/altura.js'],
  // historias 2D para YouTube (historia.html?h=<ruta>): [ruta, título en el menú]
  historias: [['espanistan/01-sanchis', 'Españistán · Ep. 1: Sanchís (YouTube 16:9)']],
  escenarios: ['escenarios/ola.js', 'escenarios/terremoto.js', 'escenarios/decibelios.js', 'escenarios/calor.js', 'escenarios/frio.js', 'escenarios/co2.js', 'escenarios/gravedad.js', 'escenarios/meteorito.js', 'escenarios/viento.js', 'escenarios/virus.js', 'escenarios/punetazo.js', 'escenarios/altura.js'],
};
