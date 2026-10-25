// Efectos de anime para los fenómenos: líneas de velocidad (集中線), fotogramas de impacto en negativo, destellos,
// rótulos de grito ("BOMBO… CLAAAT!!" con su katakana), aura dorada y rayos alrededor de un personaje.
// Todo va dentro de la escena 3D (no en el HTML) para que salga igual en el vídeo exportado.
// Los rótulos y las líneas se dibujan en coordenadas de pantalla y se compensa el tono ACES del motor
// (el color que se pide es el que se ve), así que valen con y sin posproceso.
window.ANIME = (() => {
  let ctx = null, T = null, lin = null, neg = null, fla = null, rotulos = [], t = 0;
  const VERT = 'varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }';
  // color de pantalla (sRGB 0-1) → color lineal antes del tono ACES de three r160 (su inversa exacta)
  const INV = `
    vec3 lin(vec3 c) { return mix(c / 12.92, pow((c + .055) / 1.055, vec3(2.4)), step(.04045, c)); }
    vec3 antesDelTono(vec3 c, float expo) {
      const mat3 IN = mat3(vec3(0.59719, 0.07600, 0.02840), vec3(0.35458, 0.90834, 0.13383), vec3(0.04823, 0.01566, 0.83777));
      const mat3 OUT = mat3(vec3(1.60475, -0.10208, -0.00327), vec3(-0.53108, 1.10813, -0.07276), vec3(-0.07367, -0.00605, 1.07602));
      vec3 y = clamp(inverse(OUT) * clamp(lin(c), 0.0, .8), 0.0, .8);   // hasta 0,8: así no pasa del umbral del brillo (bloom) y no se lava el color
      vec3 a = .983729 * y - 1.0, b = .4329510 * y - .0245786, k = .238081 * y + .000090537;
      vec3 v = (-b - sqrt(max(b * b - 4.0 * a * k, 0.0))) / (2.0 * a);
      return max(inverse(IN) * v, 0.0) * .6 / expo;
    }`;
  const FIN = '\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n';   // los #include, cada uno en su línea
  const quad = (mat, orden) => { const m = new T.Mesh(new T.PlaneGeometry(2, 2), mat); m.frustumCulled = false; m.renderOrder = orden;
    m.userData.fenPropio = m.userData.sobrePlaneta = true; m.visible = false; ctx.scene.add(m); return m; };

  function crear(c) {
    if (ctx === c) return; ctx = c; T = c.THREE; rotulos = [];
    const expo = { value: c.renderer.toneMappingExposure };
    // líneas de velocidad que salen del centro (o de donde se diga), blancas o negras, y un destello encima
    lin = quad(new T.ShaderMaterial({ transparent: true, depthTest: false, depthWrite: false, fog: false,
      uniforms: { k: { value: 0 }, t: { value: 0 }, aspecto: { value: .5625 }, centro: { value: new T.Vector2(.5, .5) }, negro: { value: 0 }, expo },
      vertexShader: VERT,
      fragmentShader: `uniform float k, t, aspecto, negro, expo; uniform vec2 centro; varying vec2 vUv; ${INV}
        float h(float n) { return fract(sin(n) * 43758.5453); }
        void main() { vec2 p = vUv - centro; p.x *= aspecto; float r = length(p);
          float a = (atan(p.y, p.x) / 6.2831853 + .5) * 150.0, s = floor(a), f = fract(a), tt = floor(t * 16.0);
          float on = step(.42, h(s * 1.7 + tt * 3.1)), r0 = .16 + .3 * h(s * 3.3 + tt * 1.3);
          float ancho = mix(.12, .45, h(s * 7.1 + tt)) * smoothstep(r0, r0 + .4, r);
          float l = on * (1.0 - smoothstep(ancho * .5, ancho * .5 + .06, abs(f - .5))) * smoothstep(r0, r0 + .08, r);
          float al = clamp(l * k, 0.0, 1.0); if (al < .004) discard;
          gl_FragColor = vec4(antesDelTono(vec3(1.0 - negro), expo), al); ${FIN} }` }), 9e6);
    // fotograma de impacto: invierte los colores de lo que hay pintado (el negativo de los golpes de anime)
    neg = quad(new T.ShaderMaterial({ depthTest: false, depthWrite: false, fog: false, toneMapped: false, transparent: true,
      blending: T.CustomBlending, blendEquation: T.AddEquation, blendSrc: T.OneMinusDstColorFactor, blendDst: T.ZeroFactor,
      vertexShader: VERT, fragmentShader: 'void main() { gl_FragColor = vec4(1.0); }' }), 9e6 + 1);
    fla = quad(new T.ShaderMaterial({ transparent: true, depthTest: false, depthWrite: false, fog: false,
      uniforms: { k: { value: 0 }, color: { value: new T.Color(1, 1, 1) }, expo },
      vertexShader: VERT, fragmentShader: `uniform float k, expo; uniform vec3 color; varying vec2 vUv; ${INV}
        void main() { gl_FragColor = vec4(antesDelTono(color, expo), clamp(k, 0.0, 1.0)); ${FIN} }` }), 9e6 + 2);
    estado.lin = 0; estado.linObj = 0; estado.neg = 0; estado.fla = 0;
  }

  const estado = { lin: 0, linObj: 0, neg: 0, fla: 0, flaDur: .3 };
  // k: 0-1 (cuántas líneas); centro en coordenadas de pantalla 0-1; negro: líneas negras (para el negativo)
  function lineas(k, centro, negro = false) { estado.linObj = k; if (centro) lin.material.uniforms.centro.value.set(...centro); lin.material.uniforms.negro.value = negro ? 1 : 0; }
  function negativo(seg = .1) { estado.neg = seg; }
  function destello(k = 1, seg = .3, color = 0xffffff) { estado.fla = k; estado.flaDur = seg; fla.material.uniforms.color.value.set(color); }

  // ---------- rótulos de grito ----------
  const ESTILOS = {
    oro: ['#fff7c2', '#ffd21f', '#ff6a00', '#1a0d00', '#ff2d2d'],
    azul: ['#eaffff', '#7fe0ff', '#1f6bff', '#04102a', '#ffffff'],
    rojo: ['#fff0f0', '#ff5a4a', '#b0000f', '#1a0000', '#ffe14a'],
  };
  const FUENTE = "'Archivo Black', 'Arial Black', Impact, sans-serif", KANA = "'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Noto Sans JP', 'Noto Sans CJK JP', 'IPAGothic', 'IPAPGothic', sans-serif";
  function lienzo(texto, kana, estilo) {
    const W = 1024, H = 420, cv = document.createElement('canvas'); cv.width = W; cv.height = H; const g = cv.getContext('2d');
    const [c0, c1, c2, borde, ck] = ESTILOS[estilo] || ESTILOS.oro;
    let fs = 190; g.font = `italic 900 ${fs}px ${FUENTE}`; const w = g.measureText(texto).width; if (w > W * .9) fs *= W * .9 / w;
    g.font = `italic 900 ${fs}px ${FUENTE}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round';
    const y = kana ? H * .62 : H * .5;
    g.lineWidth = fs * .3; g.strokeStyle = borde; g.strokeText(texto, W / 2, y);
    g.lineWidth = fs * .1; g.strokeStyle = '#ffffff'; g.strokeText(texto, W / 2, y);
    const gr = g.createLinearGradient(0, y - fs * .5, 0, y + fs * .5); gr.addColorStop(0, c0); gr.addColorStop(.45, c1); gr.addColorStop(1, c2);
    g.fillStyle = gr; g.fillText(texto, W / 2, y);
    if (kana) { const fk = fs * .42; g.font = `900 ${fk}px ${KANA}`; g.lineWidth = fk * .28; g.strokeStyle = borde;
      g.strokeText(kana, W / 2, H * .19); g.fillStyle = ck; g.fillText(kana, W / 2, H * .19); }
    const tx = new T.CanvasTexture(cv); tx.colorSpace = T.NoColorSpace; tx.generateMipmaps = false; tx.minFilter = T.LinearFilter; return tx;
  }
  // texto: lo que se grita · kana: su katakana encima · y: altura en pantalla (-1 abajo, 1 arriba) · ancho: fracción de la pantalla
  function rotulo({ texto, kana = '', estilo = 'oro', x = 0, y = -.32, ancho = 1.85, dur = 1.2, rot = -.1, temblor = 1 }) {
    const expo = { value: ctx.renderer.toneMappingExposure };
    const m = quad(new T.ShaderMaterial({ transparent: true, depthTest: false, depthWrite: false, fog: false,
      uniforms: { mapa: { value: lienzo(texto, kana, estilo) }, op: { value: 1 }, centro: { value: new T.Vector2(x, y) }, escala: { value: new T.Vector2(ancho, ancho * .41 * .5625) }, rot: { value: rot }, aspecto: { value: .5625 }, expo },
      vertexShader: `uniform vec2 centro, escala; uniform float rot, aspecto; varying vec2 vUv;
        void main() { vUv = uv; vec2 q = position.xy * .5 * escala; q.x *= aspecto; q = mat2(cos(rot), sin(rot), -sin(rot), cos(rot)) * q; q.x /= aspecto;
          gl_Position = vec4(centro + q, 0.0, 1.0); }`,
      fragmentShader: `uniform sampler2D mapa; uniform float op, expo; varying vec2 vUv; ${INV}
        void main() { vec4 c = texture2D(mapa, vUv); float a = c.a * op; if (a < .01) discard; gl_FragColor = vec4(antesDelTono(c.rgb / max(c.a, .001), expo), a); ${FIN} }` }), 9e6 + 3);
    m.visible = true; const r = { m, t: 0, dur, ancho, x, y, temblor }; rotulos.push(r); return r;
  }

  function tick(dt) {
    if (!ctx) return; t += dt; const asp = ctx.camera.aspect;
    estado.lin += (estado.linObj - estado.lin) * Math.min(1, dt * 14);
    const u = lin.material.uniforms; u.k.value = estado.lin; u.t.value = t; u.aspecto.value = asp; lin.visible = estado.lin > .01;
    neg.visible = estado.neg > 0; estado.neg -= dt;
    if (estado.fla > 0) { estado.fla = Math.max(0, estado.fla - dt / estado.flaDur); } fla.material.uniforms.k.value = estado.fla; fla.visible = estado.fla > .005;
    for (let i = rotulos.length - 1; i >= 0; i--) { const r = rotulos[i], u = r.m.material.uniforms; r.t += dt;
      // entra de golpe desde grande, tiembla, y al final se va desvaneciendo y creciendo un poco
      const ent = Math.min(1, r.t / .12), s = (1 + 1.6 * Math.pow(1 - ent, 2)) * (1 + Math.max(0, r.t - r.dur + .25) * .5);
      u.escala.value.set(r.ancho * s, r.ancho * .41 * asp * s); u.aspecto.value = asp;
      const tb = r.temblor * Math.max(0, 1 - r.t / r.dur) * .012; u.centro.value.set(r.x + (Math.random() - .5) * tb, r.y + (Math.random() - .5) * tb * asp);
      u.op.value = Math.min(1, (r.dur - r.t) / .25);
      if (r.t >= r.dur) { ctx.scene.remove(r.m); r.m.material.uniforms.mapa.value.dispose(); r.m.material.dispose(); rotulos.splice(i, 1); } }
  }
  function limpiar() { for (const r of rotulos) r.t = Math.max(r.t, r.dur - .15); }

  // ---------- aura dorada y rayos ----------
  // alrededor de una figura humana (de pie en y = 0 de su grupo): tres capas de llama que suben, un brillo en el suelo,
  // una luz que la ilumina y rayos que saltan. nivel(0-1) la enciende; rayos(0-1) los rayos.
  function aura(fig, color = 0xffc23a) {
    const g = new T.Group(); g.userData.fenPropio = g.userData.sobrePlaneta = true; fig.add(g);
    const col = new T.Color(color), capas = [];
    for (let k = 0; k < 3; k++) {
      const m = new T.Mesh(new T.SphereGeometry(1, 28, 20), new T.ShaderMaterial({ transparent: true, depthWrite: false, blending: T.AdditiveBlending, fog: false,
        uniforms: { t: { value: 0 }, k: { value: 0 }, col: { value: col }, sem: { value: k * 7.3 } },
        vertexShader: `uniform float t, sem; varying vec3 vN, vV; varying vec3 vP;
          float h(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
          float n2(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
            return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), f.x), f.y); }
          void main() { vec3 p = position; float a = atan(p.z, p.x);
            float lengua = n2(vec2(a * 2.5 + sem, p.y * 2.0 - t * 5.0)); p.y += max(0.0, p.y) * (lengua * 1.6 + .2);
            p.xz *= 1.0 - max(0.0, p.y) * .35;
            vP = p; vec4 mv = modelViewMatrix * vec4(p, 1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
        fragmentShader: `uniform float t, k, sem; uniform vec3 col; varying vec3 vN, vV, vP;
          float h(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
          float n2(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
            return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), f.x), f.y); }
          void main() { float fr = clamp(1.0 - abs(dot(normalize(vN), normalize(vV))), 0.0, 1.0);
            float a = atan(vP.z, vP.x), n = n2(vec2(a * 6.0 + sem, vP.y * 5.0 - t * 9.0));
            float al = clamp((pow(fr, 1.6) * .9 + .12) * (.35 + .9 * n) * k * (1.0 - smoothstep(.6, 2.6, vP.y)), 0.0, 1.0);
            gl_FragColor = vec4(col * al * 2.2, al); }` }));
      m.scale.set(.5 + k * .12, .9 + k * .18, .42 + k * .1); m.position.y = .95; m.renderOrder = 5; g.add(m); capas.push(m);
    }
    const suelo = new T.Mesh(new T.CircleGeometry(1.4, 40), new T.ShaderMaterial({ transparent: true, depthWrite: false, blending: T.AdditiveBlending, fog: false,
      uniforms: { k: { value: 0 }, col: { value: col } }, vertexShader: 'varying vec2 vU; void main() { vU = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: 'uniform float k; uniform vec3 col; varying vec2 vU; void main() { float r = length(vU - .5) * 2.0; float a = clamp((1.0 - r) * (1.0 - r) * k, 0.0, 1.0); gl_FragColor = vec4(col * a * 1.6, a); }' }));
    suelo.rotation.x = -Math.PI / 2; suelo.position.y = .03; g.add(suelo);
    const luz = new T.PointLight(color, 0, 9, 2); luz.position.y = 1.1; g.add(luz);
    // rayos: cajitas finas que siguen un camino quebrado; se rehacen cada pocos fotogramas
    const N = 64, rayo = new T.InstancedMesh(new T.BoxGeometry(1, 1, 1), new T.MeshBasicMaterial({ color: new T.Color(2.2, 2.4, 3.2), toneMapped: false, fog: false }), N);
    rayo.frustumCulled = false; rayo.count = 0; g.add(rayo);
    const m4 = new T.Matrix4(), q = new T.Quaternion(), arriba = new T.Vector3(0, 1, 0), A = new T.Vector3(), B = new T.Vector3(), d = new T.Vector3(), s = new T.Vector3();
    let nivel = 0, nivelObj = 0, rayos = 0, tr = 0, tt = 0;
    function rehacerRayos() {
      let n = 0; const nr = Math.round(rayos * 4);
      for (let b = 0; b < nr && n < N - 8; b++) {
        const a0 = Math.random() * 6.283, y0 = .4 + Math.random() * 1.3; A.set(Math.cos(a0) * .3, y0, Math.sin(a0) * .25);
        const a1 = a0 + (Math.random() - .5) * 2, r1 = .9 + Math.random() * .9; const fin = new T.Vector3(Math.cos(a1) * r1, y0 + (Math.random() - .3) * 1.6, Math.sin(a1) * r1);
        for (let k = 1; k <= 7 && n < N; k++) {
          B.lerpVectors(A, fin, k / 7); if (k < 7) B.add(new T.Vector3((Math.random() - .5) * .35, (Math.random() - .5) * .35, (Math.random() - .5) * .35));
          d.subVectors(B, A); const L = d.length(); q.setFromUnitVectors(arriba, d.normalize());
          m4.compose(A.clone().lerp(B, .5), q, s.set(.022, L, .022)); rayo.setMatrixAt(n++, m4); A.copy(B);
        }
      }
      rayo.count = n; rayo.instanceMatrix.needsUpdate = true;
    }
    return { g, luz,
      nivel(k) { nivelObj = k; }, rayos(k) { rayos = k; }, get valor() { return nivel; },
      grande(k) { for (let i = 0; i < 3; i++) capas[i].scale.set((.5 + i * .12) * k, (.9 + i * .18) * k, (.42 + i * .1) * k); },
      tick(dt) { tt += dt; nivel += (nivelObj - nivel) * Math.min(1, dt * 5);
        for (const c of capas) { c.material.uniforms.t.value = tt; c.material.uniforms.k.value = nivel * (.85 + Math.sin(tt * 23) * .15); }
        suelo.material.uniforms.k.value = nivel; luz.intensity = nivel * (6 + Math.sin(tt * 31) * 2.5); g.visible = nivel > .01 || rayos > 0;
        if (rayos > 0 && (tr -= dt) <= 0) { tr = .05; rehacerRayos(); } else if (!rayos) rayo.count = 0; } };
  }

  return { crear, lineas, negativo, destello, rotulo, tick, limpiar, aura };
})();
