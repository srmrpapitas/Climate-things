// Archivos que carga el juego al arrancar. Cada escenario va en escenarios/<clave>.js
// (window.ESCENARIOS.<clave> = {...}) y cada fenómeno en fenomenos/<tipo>.js (window.FENOMENOS.<tipo> = {...}).
window.ESCENARIOS = {};
window.FENOMENOS = {};
window.LISTA = {
  // comun.js va primero: utilidades que usan los demás fenómenos (window.COMUN)
  fenomenos: ['fenomenos/comun.js', 'fenomenos/ola.js', 'fenomenos/terremoto.js', 'fenomenos/decibelios.js', 'fenomenos/calor.js', 'fenomenos/frio.js', 'fenomenos/co2.js'],
  escenarios: ['escenarios/ola.js', 'escenarios/terremoto.js', 'escenarios/decibelios.js', 'escenarios/calor.js', 'escenarios/frio.js', 'escenarios/co2.js'],
};
