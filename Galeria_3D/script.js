const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const createScene = () => {
    const scene = new BABYLON.Scene(engine);

    // Gravedad y colisiones
    scene.gravity = new BABYLON.Vector3(0, -0.5, 0);
    scene.collisionsEnabled = true;

    // Cámara primera persona
    const camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(2, 3, 0), scene);
    camera.attachControl(canvas, true);
    camera.checkCollisions = true;
    camera.applyGravity = true;
    camera.speed = 0.2;
    camera.ellipsoid = new BABYLON.Vector3(1, 4, 3);
    camera.ellipsoidOffset = new BABYLON.Vector3(0, -3, 0);
    camera.position.y = 5;

    // Orientación en móviles
     // 📱 Orientación en móviles
    if (window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation", (evt) => {
            if (evt.alpha !== null && evt.beta !== null && evt.gamma !== null) {
                // Rotaciones del móvil → cámara
                camera.rotation.y = BABYLON.Tools.ToRadians(evt.alpha);      // giro horizontal
                camera.rotation.x = BABYLON.Tools.ToRadians(evt.beta - 90); // inclinación
                camera.rotation.z = BABYLON.Tools.ToRadians(evt.gamma);     // rotación lateral
            }
        }, true);
    }

    // Teclas WASD
    camera.keysUp.push(87);
    camera.keysDown.push(83);
    camera.keysLeft.push(65);
    camera.keysRight.push(68);

    // Sensibilidad
    camera.angularSensibility = 800;
    camera.inputs.addTouch();
    camera.inputs.attached.touch.touchAngularSensibility = 800;
    camera.inputs.attached.touch.touchMoveSensibility = 1000;

    // Luces
    const hemiLight = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);
    hemiLight.intensity = 0.6;

    const sun = new BABYLON.DirectionalLight("sun", new BABYLON.Vector3(-1, -2, -1), scene);
    sun.position = new BABYLON.Vector3(20, 40, 20);
    sun.intensity = 1.2;

    // HDRI
    scene.environmentTexture = BABYLON.CubeTexture.CreateFromPrefilteredData(
        "./textures/venice_sunset.env",
        scene
    );

    // Suelo invisible
    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 50, height: 50 }, scene);
    ground.position.y = 0;
    ground.checkCollisions = true;
    ground.isVisible = false;

    // Diccionario de obras
    const obras = {
        "Box032": {
            titulo: "Obra: Doritos",
            desc: "Fue parte del curso de semiótica",
            img: "poster.jpeg"
        },
        "Box056": {
            titulo: "Obra: Otra obra",
            desc: "Así explico xd",
            img: "./imgs/otra.png"
        },
        "Box076": {
            titulo: "Obra: Destino final",
            desc: "queria hacer un poster de terror",
            img: "poster2.png"
        }
        
    };

    // Cargar modelo
    BABYLON.SceneLoader.Append("models/", "galeria.glb", scene, function () {
        console.log("✅ Modelo cargado: galeria.glb");

        scene.meshes.forEach(mesh => {
            mesh.checkCollisions = true;
            mesh.isPickable = true;
        });
/* identificador de clicks xd*/
scene.onPointerObservable.add((pointerInfo) => {
  if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERPICK) {
    const pickResult = pointerInfo.pickInfo;
    if (pickResult.hit && pickResult.pickedMesh) {
      const meshName = pickResult.pickedMesh.name;
      console.log("👉 Click en:", meshName);

    }
  }
});

        // Click sobre objetos
        scene.onPointerObservable.add((pointerInfo) => {
            if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERPICK) {
                const pickResult = pointerInfo.pickInfo;
                if (pickResult.hit && pickResult.pickedMesh) {
                    const clickedMesh = pickResult.pickedMesh.name;
                    if (obras[clickedMesh]) {
                        const { titulo, desc, img } = obras[clickedMesh];
                        showPopup(titulo, desc, img);
                    }
                }
            }
        });
    });

    return scene;
};

const scene = createScene();

engine.runRenderLoop(() => {
    scene.render();
});

window.addEventListener("resize", () => {
    engine.resize();
});

// --- Función popup ---
function showPopup(title, desc, img = "") {
    document.getElementById("popupTitle").textContent = title;
    document.getElementById("popupDesc").textContent = desc;
    if (img) {
        document.getElementById("popupImg").src = img;
        document.getElementById("popupImg").style.display = "block";
    } else {
        document.getElementById("popupImg").style.display = "none";
    }
    const popup = document.getElementById("popup");
    popup.style.display = "block";
}

// Cerrar popup
document.getElementById("closePopup").onclick = () => {
    document.getElementById("popup").style.display = "none";
};
