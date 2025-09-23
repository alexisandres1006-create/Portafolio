const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const createScene = function () {
  const scene = new BABYLON.Scene(engine);

  // Desactiva el loading por defecto
  engine.loadingScreen = new BABYLON.DefaultLoadingScreen(canvas);
  engine.loadingScreen.displayLoadingUI = function() {};
  engine.loadingScreen.hideLoadingUI = function() {};


  // Cámara
  const camera = new BABYLON.ArcRotateCamera("camera", Math.PI/2, Math.PI/2.5, 5, BABYLON.Vector3.Zero(), scene);
  camera.attachControl(canvas, true);
  camera.checkCollisions = true;
  camera.collisionRadius = new BABYLON.Vector3(0.5, 1, 0.1);
  camera.lowerRadiusLimit = 1.5;
  camera.lowerRadiusLimit = 1;
  camera.upperRadiusLimit = 8;  // distancia máxima de alejamiento
  camera.wheelDeltaPercentage = 0.01; // sensibilidad del zoom con la ruedita (más bajo = más suave)
  camera.pinchDeltaPercentage = 0.01; 

  // Luces
  const topLight = new BABYLON.HemisphericLight("topLight", new BABYLON.Vector3(0, 1, 0), scene);
  topLight.intensity = 2;

  const bottomLight = new BABYLON.HemisphericLight("bottomLight", new BABYLON.Vector3(0, -1, 0), scene);
  bottomLight.intensity = 2;

  scene.clearColor = new BABYLON.Color3(0, 0, 0);
  

  

  // Variable para animaciones
  let animGroup = null;

  // Cargar modelo GLB
  BABYLON.SceneLoader.Append("model/", "Revista.glb", scene, function (scene) {
    console.log("cargada con éxito 🚀");
    

    // Activar colisiones
    scene.meshes.forEach(mesh => mesh.checkCollisions = true);

    if (scene.animationGroups.length > 0) {
      animGroup = scene.animationGroups[0];
      animGroup.stop(); // NO lo inicies en loop
    }

    // Loading
    const loader = document.getElementById("customLoading");
    loader.style.display = "flex";

    scene.executeWhenReady(() => {
      loader.classList.add("fade-out");
      setTimeout(() => loader.style.display = "none", 500);
    });

    // =========================
    // RANGOS DE ANIMACIÓN
    // =========================
    const pageRanges = [
      { from: 0, to: 1 },   // portada
      { from: 1, to: 70 },  // página 1
      { from: 60, to: 150 }, // página 2
      { from: 160, to: 200}, // pag3 
      { from: 210, to: 290},
      { from: 290, to: 380},
      { from: 390, to: 450},
      { from: 460, to: 520},
      { from: 520, to: 610},
      { from: 610, to: 680},
      { from: 680, to: 800},
      { from: 800, to: 880},
      { from: 880, to: 950},
      { from: 950, to: 1020},
      { from: 1020, to: 1100},
    ];

    let currentPage = 0;

    // =========================
    // CONTROLES DE TECLADO
    // =========================
    window.addEventListener("keydown", (ev) => {
      if (!animGroup) return;

      const key = ev.key.toLowerCase();

      switch (key) {
        case "n": // avanzar
          if (currentPage < pageRanges.length - 1) {
            currentPage++;
            const range = pageRanges[currentPage];
            animGroup.start(false, 1.0, range.from, range.to);
          }
          break;
case "m": // retroceder
  if (currentPage > 0) {
    const prevPage = currentPage - -1;
    const range = pageRanges[currentPage]; // rango actual, no el anterior aún

    animGroup.stop();
    animGroup.goToFrame(range.from); // arrancar desde donde está la página actual
    animGroup.play(false);
    animGroup.speedRatio = 1; // retroceder

    currentPage = prevPage; // ahora sí cambiamos de página
  }
  break;
  case "b": // vovlera l incio
  if (currentPage > 0) {
    const prevPage = currentPage - 0;
    const range = pageRanges[currentPage]; // rango actual, no el anterior aún

    animGroup.stop();
    animGroup.goToFrame(range.from); // arrancar desde donde está la página actual
    animGroup.play(false);
    animGroup.speedRatio = -8; // retroceder

    currentPage = prevPage; // ahora sí cambiamos de página
  }
    
  break;
       
        case "e":
        case " ": // Pausar/reanudar
          if (animGroup.isPlaying) {
            animGroup.pause();
          } else {
            animGroup.play();
          }
          break;
      }
    });
  });

  return scene;
}



// Crear la escena y render loop
const scene = createScene();
engine.runRenderLoop(() => scene.render());
window.addEventListener("resize", () => engine.resize());






let animGroup = null;
let currentPage = 0;
let pageRanges = [];

const btnNext = document.getElementById("btnNext");
const btnPrev = document.getElementById("btnPrev");
const btnStop = document.getElementById("btnStop");

// NEXT (avanzar página)
btnNext.addEventListener("pointerdown", () => {
  if (!animGroup || pageRanges.length === 0) return;
  if (currentPage < pageRanges.length - 1) {
    currentPage++;
    const range = pageRanges[currentPage];
    animGroup.start(false, 1.0, range.from, range.to);
  }
});

// PREV (retroceder página)
btnPrev.addEventListener("pointerdown", () => {
  if (!animGroup || pageRanges.length === 0) return;
  if (currentPage > 0) {
    const prevPage = currentPage - 1;
    const range = pageRanges[currentPage]; // rango actual
    
    animGroup.stop();
    animGroup.goToFrame(range.from);
    animGroup.play(false);
    animGroup.speedRatio = -1; // retrocede
    currentPage = prevPage;
  }
});

// STOP (pausar)
btnStop.addEventListener("pointerdown", () => {
  if (!animGroup) return;
  animGroup.pause();
});



///////////////////////////////////////// instruciones de teclado uwu

function makeButton(mesh, key) {
  mesh.actionManager = new BABYLON.ActionManager(scene);

  mesh.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      BABYLON.ActionManager.OnPickTrigger,
      function () {
        // Simular que se presionó esa tecla
        window.dispatchEvent(new KeyboardEvent("keydown", { key: key }));
      }
    )
  );
}

// Crear primer bloque bloque
const key = BABYLON.MeshBuilder.CreateBox("key", { width: 0.6, height: 0.2, depth: 0.6 }, scene);
const keyMat = new BABYLON.StandardMaterial("keyMat", scene);
keyMat.diffuseColor = new BABYLON.Color3(1, 1, 1);
key.material = keyMat;
key.position = new BABYLON.Vector3(2, 1, -5);
key.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
key.scaling = new BABYLON.Vector3(1.2, 0.3, 1.2);
makeButton(key, "n");


const mat = new BABYLON.StandardMaterial("mat", scene);
mat.diffuseTexture = new BABYLON.Texture("n.png", scene); 
key.material = mat


// Crear segundo bloque
const key2 = BABYLON.MeshBuilder.CreateBox("key2", { width: 0.6, height: 0.2, depth: 0.6 }, scene);
const keyMat2 = new BABYLON.StandardMaterial("keyMat2", scene);
keyMat2.diffuseColor = new BABYLON.Color3(1, 1, 1);
key2.material = keyMat2;
key2.position = new BABYLON.Vector3(1, 1, -5);
key2.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
key2.scaling = new BABYLON.Vector3(1.2, 0.3, 1.2);
makeButton(key2, "m");

const mat2 = new BABYLON.StandardMaterial("mat2", scene);
mat2.diffuseTexture = new BABYLON.Texture("m.png", scene); 
key2.material = mat2

// Crear tercer bloque
const key3 = BABYLON.MeshBuilder.CreateBox("key3", { width: 0.6, height: 0.2, depth: 0.6 }, scene);
const keyMat3 = new BABYLON.StandardMaterial("keyMat3", scene);
keyMat3.diffuseColor = new BABYLON.Color3(1, 1, 1);
key3.material = keyMat3;
key3.position = new BABYLON.Vector3(3, 1, -5);
key3.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
key3.scaling = new BABYLON.Vector3(1.2, 0.3, 1.2);
makeButton(key3, "b");

const mat3 = new BABYLON.StandardMaterial("mat3", scene);
mat3.diffuseTexture = new BABYLON.Texture("b.png", scene); 
key3.material = mat3



// Crear cuarto bloque
const key5 = BABYLON.MeshBuilder.CreateBox("key5", { width: 4, height: 0.2, depth: 0.6 }, scene);
const keyMat5 = new BABYLON.StandardMaterial("keyMat5", scene);
keyMat5.diffuseColor = new BABYLON.Color3(1, 1, 1);
key5.material = keyMat3;
key5.position = new BABYLON.Vector3(-2, 1, -5);
key5.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
key5.scaling = new BABYLON.Vector3(1.2, 0.3, 1.2);
makeButton(key5, " ");

const mat5 = new BABYLON.StandardMaterial("mat5", scene);
mat5.diffuseTexture = new BABYLON.Texture("s.png", scene); 
key5.material = mat5


