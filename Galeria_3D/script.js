const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const createScene = () => {
    const scene = new BABYLON.Scene(engine);

    // Desactiva el loading que es el por defecto :D
    engine.loadingScreen = new BABYLON.DefaultLoadingScreen(document.getElementById("renderCanvas"));
    engine.loadingScreen.displayLoadingUI = function() {}; // desactiva mostrar
    engine.loadingScreen.hideLoadingUI = function() {};    // desactiva ocultar


//----------------------------------lo q tiene q ver mas con la parte visual escenario---------------------------//
    // Gravedad y colisiones
    scene.gravity = new BABYLON.Vector3(0, -0.5, 0);
    scene.collisionsEnabled = true;

    // Cámara primera persona
    const camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 6, 0), scene);
    camera.attachControl(canvas, true);
    camera.checkCollisions = true;
    camera.applyGravity = true;
    camera.speed = 0.2;
    camera.ellipsoid = new BABYLON.Vector3(3, 7, 3);
    camera.ellipsoidOffset = new BABYLON.Vector3(0, 6, 0);
    camera.position.y = 8;
    camera.inputs.addTouch();
camera.inputs.attached.touch.touchMoveSensibility = 400;

///////////////////////////////////////////// IMPORTANTE tiene que ver con el joystick del movil///////////////////////////////////////////
// Mostrar joystick solo en móviles
if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    document.getElementById("joystickContainer").style.display = "block";

    const joystick = document.getElementById("joystick");
    const container = document.getElementById("joystickContainer");

    let dragging = false;
    let startX, startY;

    // Guardar el movimiento del joystick
    let moveX = 0, moveY = 0;

    joystick.addEventListener("touchstart", (e) => {
        dragging = true;
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
    });

    joystick.addEventListener("touchmove", (e) => {
        if (!dragging) return;
        const touch = e.touches[0];
        let dx = touch.clientX - startX;
        let dy = touch.clientY - startY;

        // Limitar dentro del radio
        const distance = Math.min(Math.sqrt(dx*dx + dy*dy), 40);
        const angle = Math.atan2(dy, dx);
        const offsetX = Math.cos(angle) * distance;
        const offsetY = Math.sin(angle) * distance;

        joystick.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

        // Guardar normalizado (-1 a 1)
        moveX = offsetX / 40;
        moveY = offsetY / 40;
    });

    joystick.addEventListener("touchend", () => {
        dragging = false;
        joystick.style.transform = "translate(0,0)";
        moveX = 0;
        moveY = 0;
    });

scene.onBeforeRenderObservable.add(() => {
    const forward = camera.getDirection(BABYLON.Axis.Z);
    const right = camera.getDirection(BABYLON.Axis.X);

    // Mover cámara respetando colisiones en UniversalCamera
    camera.cameraDirection.addInPlace(
        forward.scale(-moveY * 0.05).add(right.scale(moveX * 0.05))
    );
});
        
    
}
////////////////////--------------------------------------------------------------------------------////////////////////////////////////////

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

    //------------------------------------obras---------------------------------------------------------//
    const obras = {
        "Box032": {
            titulo: "Obra: Doritos",
            desc: "Proyecto que trataba sobre el lenguaje visual, hablando sobre hacer pensar al emisor final y hacer que el producto le llegue a su mente.",
            img: "imagenes/doritos.png"
        },
        "Box056": {
            titulo: "Obra: Moral Dividida",
            desc: "Empeze organizando mis elementos, ajuste luces e ilumiacion para que se centre mejor en los protagonistas y pensando en una idea para esta obra decidi tomarlo como un poster para un pelicula.",
            img: "imagenes/marvel.jpeg"
        },
        "Box076": {
            titulo: "Obra: Destino final",
            desc: "Me fascina esta saga de peliculas y queria hacer un recuento de todos sus films, dando un enfoque a su ojos por que de alli provienen sus visiones, queria jugar con la estetica tenebrosa pero funcional en cuesiton de jerarquia visual.",
            img: "imagenes/poster2.png"
        },
        "Box092": {
            titulo: "Obra: Mandala Creativo",
            desc: "Proyecto que me enseño la creatividad y leyes de gestalt, sobre todo paciencia. Empeze Planeando la idea para luego con regla y lapiz delinear todo el dibujo, después lo repase con un estilografo.",
            img: "imagenes/mandalaa.jpeg"
        },
        "Box098": {
            titulo: "Obra: Eterno Primavera",
            desc: "Todo pintando con colores y tecnicas de degradado para que tenga un matiz atractivo, el proyecto me enseño sobre el arte nouveau y a liberar la creatividad e imaginación.",
            img: "imagenes/arte.jpg"
    
        },
        "Box099": {
            titulo: "Obra: Cuento harry potter",
            desc: "Planifique la tematica y empeze con varios bocetos, luego usando pinceles, filtros, capas fui pintando en una tableta digital. Este proyecto me enseño mucho acerca de la ilustración digital en piezas graficas y la creatividad.",
            img: "imagenes/harry_proces" 
        },
        "Box074": {
            titulo: "Obra: Vitral de paz",
            desc: "Al inicio lo que hice fue seleccionar una idea, plasmarla con lapiz, hacer el troquelado manualmente con cutter y corte pieza por pieza cada color del vitrial y pegue solidamente. Este proyecto me enseño mucho sobre el detalle y la planificación.",
            img: "imagenes/vitrial.jpg" 
        },
        "Box144": {
            titulo: "Obra: Grises en pintura",
            desc: "Primero planifique la imagen, luego dividi por sectores donde la saturación de iluminación se visualizaba, dividi por 9 tonos de grises y lo pinte con pinturas acrilicas que le daban un toque mate. Este proyecto me enseño sobre identificar la saturación e iluminación en una imagen",
            img: "imagenes/grises.jpg" 
        }, 
        "Box077": {
            titulo: "Obra: Poster de Dark ",
            desc: "Esta serie me encanta y decidi rendirle honor haciendo un poster. Primero hice mi maqueta basandome en la idea que tenia luego en photoshop usando filtros y efectos, tales como desenfoque de movimiento, efecto de semitono y jugando con valores como saturacion/tono le di ese toque misterioso",
            img: "imagenes/maqueta.png" 
        }, 
        "Box075": {
            titulo: "Obra: Sensación de verano",
            desc: "Pintura que realice usando pinturas al óleo, basandome de un dibujo propio, primero yo buscaba darle toques impresionistas, que se note cada pincelada y tono para que contraste y destaque. Esto me enseño a no rendirme y ser más creativo",
            img: "imagenes/boceto_1.jpg" 
        },  
          "Box249": {
            titulo: "Obra: Corazón de escritor",
            desc: "Retrate el sentimiento de una persona que es sensible, todo pintado al óleo. Queria agregar elementos como tipografia caligrafica, un corazón semi real y la luz del sol radiando, que simbolizan que una persona asi siempre brilla.",
            img: "imagenes/process_1.jpg"
          },
          "Box131": {
            titulo: "Obra: Expresión de caridad",
            desc: "Use como referencia una figura religiosa, me base en los vitrales de las capillas pra el fondo y su estetica, todo pintando en un lienzo A2 con pinturas al óleo, dando matizes de tono en la piel y en el vitral.",
            img: "imagenes/process_3.jpg"
          },
           "Box078": {
            titulo: "Obra: Venganza Roja",
            desc: "Mi idea se basaba en una historia alternativa sobre el cuento de la caperucita roja para volverla a una categoria de venganza, miedo o suspenso, realize mi maqueta y en photoshop usando filtros, efectos y capas logre el efecto de poster de pelicula",
            img: "imagenes/maqueta_2.png"
          },
           "Box132": {
            titulo: "Obra: Pop art",
            desc: "Realice la etiqueta con el movimiento artistico del Pop art, para un efecto de vintage. Se usaron colores fosforecentes, semitono, manchas y tipografia extravagante",
            img: "imagenes/gaseosa.png"
          },
           "Box244": {
            titulo: "Obra: Foquita en petalos de cerezo",
            desc: "Realice la etiqueta con el movimiento artistico del Pop art, para un efecto de vintage. Se usaron colores fosforecentes, semitono, manchas y tipografia extravagante",
            img: "imagenes/foquita.jpg"
          }
    };

    // Cargar modelo
     BABYLON.SceneLoader.Append("models/", "galeria.glb", scene, function () {
        console.log("✅ Modelo cargado: galeria.glb");

        // Colisiones en todos los meshes
        scene.meshes.forEach(mesh => {
            mesh.checkCollisions = true;
            mesh.isPickable = true;
        });
/* --------------------------identificador de clicks xd---------------------------------------*/
scene.onPointerObservable.add((pointerInfo) => {
  if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERPICK) {
    const pickResult = pointerInfo.pickInfo;
    if (pickResult.hit && pickResult.pickedMesh) {
      const meshName = pickResult.pickedMesh.name;
      console.log("👉 Click en:", meshName);

    }
  }
});

// Click sobre objetos-------------------------------
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

// --- Función popup ------------------------------------------//
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


//sirve para darle ese toque de cielo al techo (funciona como un agregador de textura en vez de la textura modara de babylon)
scene.createDefaultSkybox(scene.environmentTexture, true, 1000);

//---------------funciones de pantalla de carga:3-------------------------------------------------------------------------------------//

// Mostrar el loader con la intro
document.getElementById("customLoading").style.display = "flex";

// Ocultar cuando la escena ya esté lista
scene.executeWhenReady(() => {
  const loader = document.getElementById("customLoading");
  loader.classList.add("fade-out");
});
setTimeout(() => {
  loader.style.display = "none";
}, 500);

loader.load("galeria.glb", function (gltf) {
  gltf.scene.traverse((child) => {
    if (child.isMesh && child.material) {
      
      // --- Ventana de la caja (vidrio/plástico) ---
      if (child.material.name === "Vidrio_Funko") {
        child.material.transparent = true;   
        child.material.opacity = 0.25;        
        child.material.depthWrite = false;    
        child.material.roughness = 0.05;      // casi espejo
        child.material.metalness = 2;         // Refleja el HDRI
        child.material.envMapIntensity = 3;   // Reflejo del entorno
        mesh.material.alpha = 0.3;
mesh.material.transparencyMode = BABYLON.Material.MATERIAL_ALPHABLEND;
         }
        }
  });

  scene.add(gltf.scene);
});