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
  topLight.intensity = 1.2;

  const bottomLight = new BABYLON.HemisphericLight("bottomLight", new BABYLON.Vector3(0, -1, 0), scene);
  bottomLight.intensity = 1.0;

  scene.clearColor = new BABYLON.Color3(0, 0, 0);
  
    // HDRI
    scene.environmentTexture = BABYLON.CubeTexture.CreateFromPrefilteredData(
        "../galeria_3D/textures/venice_sunset.env",
        scene
    );
  

  // Variable para animaciones
  let animGroup = null;

  // Cargar modelo GLB
  BABYLON.SceneLoader.Append("model/", "revista.glb", scene, function (scene) {
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
    const prevPage = currentPage - 1;
    const range = pageRanges[currentPage]; // rango actual, no el anterior aún

    animGroup.stop();
    animGroup.goToFrame(range.from); // arrancar desde donde está la página actual
    animGroup.play(false);
    animGroup.speedRatio = -1; // retroceder

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
};


// Crear la escena y render loop
const scene = createScene();
engine.runRenderLoop(() => scene.render());
window.addEventListener("resize", () => engine.resize());







let animGroup = null;
let currentPage = 0;
let pageRanges = [];

// Funciones reutilizables

function nextPage() {
  if (!animGroup || pageRanges.length === 0) return;
 if (currentPage < pageRanges.length - 1) {
            currentPage++;
            const range = pageRanges[currentPage];
            animGroup.start(false, 1.0, range.from, range.to);
          
  }
}


function prevPage() {
  if (!animGroup || pageRanges.length === 0) return;
  if (currentPage > 0) {
    const prevPage = currentPage - 1;
    const range = pageRanges[currentPage];
    animGroup.stop();
    animGroup.goToFrame(range.from);
    animGroup.play(false);
    animGroup.speedRatio = -1;
    currentPage = prevPage;
  }
}

function stopPage() {
  if (!animGroup) return;
  animGroup.pause();
}