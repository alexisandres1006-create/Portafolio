// Escena, cámara y render
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75, // FOV
  window.innerWidth / window.innerHeight, // Aspect ratio
  0.1, // near
  1000 // far
);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("gameCanvas") });
renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.6);

// Luces
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// Controles tipo videojuego
const controls = new THREE.PointerLockControls(camera, renderer.domElement);
document.addEventListener("click", () => controls.lock());

// Movimiento con teclado
const keys = {};
document.addEventListener("keydown", (e) => (keys[e.code] = true));
document.addEventListener("keyup", (e) => (keys[e.code] = false));

function movePlayer() {
  const speed = 0.1;
  if (keys["KeyW"]) controls.moveForward(speed);
  if (keys["KeyS"]) controls.moveForward(-speed);
  if (keys["KeyA"]) controls.moveRight(-speed);
  if (keys["KeyD"]) controls.moveRight(speed);
}

// Cargar tu sala
const loader = new THREE.GLTFLoader();
loader.load("modelos/Salitapequeña.glb", (gltf) => {
  const sala = gltf.scene;
  sala.scale.set(0.5, 0.5, 0.5); // Ajusta el tamaño si es muy grande
  sala.position.set(0, 0, 0);
  scene.add(sala);
});

// Posición inicial de la cámara
camera.position.set(0, 1.6, 3); // altura como persona

// Animación
function animate() {
  requestAnimationFrame(animate);
  movePlayer();
  renderer.render(scene, camera);
}
animate();

// Ajustar canvas al cambiar tamaño ventana
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.6);
});
