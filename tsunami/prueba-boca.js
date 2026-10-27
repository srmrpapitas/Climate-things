// Banco de pruebas de la boca de Nico: primer plano de frente y de tres cuartos con la boca medio y muy abierta.
// http://localhost:8765/tsunami/peli.html?prueba=boca  →  __prueba(k, angulo) pinta un fotograma.
import { THREE, actual, camera, nico, cargarNico, nicoReposo, nicoBrazos, nicoCabeza, pintar, V } from './motor.js';
export async function prueba() {
  const s = actual.scene; s.background = new THREE.Color(0x8a5a4a);
  s.add(new THREE.HemisphereLight(0xffffff, 0x445566, 1.6)); const d = new THREE.DirectionalLight(0xffffff, 1.4); d.position.set(1, 2, 3); s.add(d);
  await cargarNico(); s.add(nico.g); document.getElementById('carga')?.remove();
  window.__prueba = (k, ang) => { nicoReposo(); nicoBrazos(0); nico.g.updateMatrixWorld(true); nico.boca.abrir(k);
    const h = nicoCabeza().add(V(0, -.1, 0)); camera.position.copy(h).add(V(Math.sin(ang) * .42, .01, Math.cos(ang) * .42)); camera.fov = 30; camera.lookAt(h); camera.updateProjectionMatrix(); pintar(0); };
  window.__peli = { listo: true };
}
