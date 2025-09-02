const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const createScene = () => {
    const scene = new BABYLON.Scene(engine);

    // Gravedad y colisiones
    scene.gravity = new BABYLON.Vector3(0, -0.5, 0);
    scene.collisionsEnabled = true;

    // Cámara primera persona
    const camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(2, 2, 0), scene);
    camera.attachControl(canvas, true);
    camera.checkCollisions = true;
    camera.applyGravity = true;
    camera.speed = 0.3;
    camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);

    // Teclas WASD
    camera.keysUp.push(87);
    camera.keysDown.push(83);
    camera.keysLeft.push(65);
    camera.keysRight.push(68);

    // Luz
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 1.2;

    // Suelo invisible
    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 50, height: 50 }, scene);
    ground.position.y = 0;
    ground.checkCollisions = true;
    ground.isVisible = false;

    // --- Diccionario de obras ---
    const obras = {
        "box032": {
            titulo: "Obra Box032",
            desc: "Esta es la explicación de la obra seleccionada."
        },
        "box056": {
            titulo: "Obra Box 056",
            desc: "Otra descripción para esta obra."
        }
        // 👉 aquí puedes agregar más objetos
    };

    // Cargar modelo GLB
    BABYLON.SceneLoader.Append("models/", "galeria.glb", scene, function () {
        console.log("✅ Modelo cargado: galeria.glb");

        // Activar colisiones y pickeable en todos los meshes
        scene.meshes.forEach(mesh => {
            mesh.checkCollisions = true;
            mesh.isPickable = true; // 👈 IMPORTANTE para poder hacer click
        });

        // Interacción con click
        scene.onPointerObservable.add((pointerInfo) => {
            if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERPICK) {
                const pickResult = pointerInfo.pickInfo;
                if (pickResult.hit && pickResult.pickedMesh) {
                    const clickedMesh = pickResult.pickedMesh;
                    console.log("👉 Click en:", clickedMesh.name);

                    // Buscar en el diccionario si hay una obra con ese nombre
                    if (obras[clickedMesh.name]) {
                        const { titulo, desc } = obras[clickedMesh.name];
                        showPopup(titulo, desc);
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

// --- Funciones para el popup ---
canvas.addEventListener("click", function () {
    const pickResult = scene.pick(scene.pointerX, scene.pointerY);

    if (pickResult.hit) {
        console.log("👉 Click en:", pickResult.pickedMesh.name);

        if (pickResult.pickedMesh.name === "Box032") {
            showPopup("Obra: Doritos", "Fue parte del curso de semiotica");
        }
         if (pickResult.pickedMesh.name === "Box056") {
            showPopup("Obra: otra obra", "asi explico xd");
        }
        
    }
});

function showPopup(title, desc) {
    document.getElementById("popupTitle").textContent = title;
    document.getElementById("popupDesc").textContent = desc;
    const popup = document.getElementById("popup");
    popup.style.display = "block";
    popup.style.zIndex = "10000"; // 🔑 aseguramos que quede encima
}

document.getElementById("closePopup").onclick = () => {
    document.getElementById("popup").style.display = "none";
};

window.onclick = (event) => {
    if (event.target === document.getElementById("popup")) {
        document.getElementById("popup").style.display = "none";
    }
};
document.getElementById("popupClose").onclick = () => {
    document.getElementById("popup").style.display = "none";
};

