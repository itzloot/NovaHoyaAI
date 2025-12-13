const container = document.getElementById("floating-lines-container");

const scene = new THREE.Scene();

const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
camera.position.z = 1;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

/* ================= SHADERS ================= */

const vertexShader = `
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

float wave(vec2 uv, float offset) {
  float y = sin(uv.x * 4.0 + iTime + offset) * 0.15;
  float d = abs(uv.y - y);
  return 0.02 / (d + 0.01);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;

  vec3 col = vec3(0.0);

  for(int i = 0; i < 20; i++) {
    float fi = float(i);
    col += vec3(0.6, 0.3, 1.0) * wave(uv, fi * 0.35);
  }

  gl_FragColor = vec4(col, 1.0);
}
`;

/* ================= MATERIAL ================= */

const uniforms = {
  iTime: { value: 0 },
  iResolution: { value: new THREE.Vector2() },
  iMouse: { value: new THREE.Vector2(-10, -10) }
};

const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms
});

const geometry = new THREE.PlaneGeometry(2, 2);
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

/* ================= RESIZE ================= */

function resize() {
  const w = container.clientWidth;
  const h = container.clientHeight;
  renderer.setSize(w, h);
  uniforms.iResolution.value.set(w, h);
}
window.addEventListener("resize", resize);
resize();

/* ================= MOUSE ================= */

window.addEventListener("mousemove", (e) => {
  uniforms.iMouse.value.set(e.clientX, window.innerHeight - e.clientY);
});

/* ================= LOOP ================= */

const clock = new THREE.Clock();

function animate() {
  uniforms.iTime.value = clock.getElapsedTime();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();