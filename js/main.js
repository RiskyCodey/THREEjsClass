import * as THREE from "three";
import { RGBELoader } from "https://unpkg.com/three@0.153/examples/jsm/loaders/RGBELoader.js";
 

let renderer, scene, container, camera;
let arrowPressed = {left: false, right: false, up: false, down: false};
let keyPressed = {" ": false};
let increment = 0.025;


window.addEventListener("load", function() {
    start();
});

async function start() {

    renderer = new THREE.WebGLRenderer({antialias: true}); 
    scene = new THREE.Scene();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container = document.querySelector("#threejsContainer");
    container.appendChild(renderer.domElement);
    
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0.5, 5);

    const loader = new THREE.TextureLoader();
    const backgroundTexture = loader.load("assets/images/racetrack.jpg");
    scene.background = backgroundTexture;

    const light01 = new THREE.PointLight(0xffffff, 1, 400, 50);
    light01.position.set(-5.2, 5, 5);
    light01.castShadow = true;
    scene.add(light01)

    
    const light02 = new THREE.PointLight(0xffffff, 1, 400, 50);
    light02.position.set(5.2, 5, 5);
    light02.castShadow = true;
    scene.add(light02);

    const geometry = new THREE.CylinderGeometry(0.2, 0.2, 0.5);
    const material = new THREE.MeshPhongMaterial({color: 0x8b7500, specular: 0xffd700, shininess: 50});
    const cylinder = new THREE.Mesh(geometry, material);
    cylinder.position.y = -0.25;
    cylinder.castShadow = true;
    cylinder.receiveShadow = true;
    scene.add(cylinder);


    const chessboardTexture = loader.load("assets/images/chessboard.jpg");
    chessboardTexture.wrapS = THREE.RepeatWrapping;
    chessboardTexture.wrapT = THREE.RepeatWrapping;

    chessboardTexture.repeat.set(1, 1);


    const planeGeometry = new THREE.PlaneGeometry(10, 10);
    const planeMaterial = new THREE.MeshStandardMaterial({color: 0xcdaa7d, map:chessboardTexture});
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(0, -0.5, 0);
    plane.rotation.set(-Math.PI / 2, 0, 0);
    plane.receiveShadow = true;
    scene.add(plane);

    document.addEventListener(
        "keydown", 
        (event) => {
            const keyName = event.key;
            switch (keyName) {
                case "ArrowUp":
                    arrowPressed.up = true;
                    break;
                case "ArrowDown":
                    arrowPressed.down = true;
                    break;
                case "ArrowRight":
                    arrowPressed.right = true;
                    break;
                case "ArrowLeft":
                    arrowPressed.left = true;
                    break;
                case " ":
                    keyPressed.space = true;
                    break;
            }
        },
        false,
    );

    document.addEventListener(
        "keyup",
        (event) => {
            arrowPressed.up = false;
            arrowPressed.down = false;
            arrowPressed.right = false;
            arrowPressed.left = false;
            keyPressed.space = false;
        },
        false,
    );
 
animate();

function animate() {
    
    if (arrowPressed.left) cylinder.position.x -= increment;
    if (arrowPressed.right) cylinder.position.x += increment;
    if (arrowPressed.up) cylinder.position.z -= increment;
    if (arrowPressed.down) cylinder.position.z += increment;

    if (keyPressed.space) {
        cylinder.position.y += increment; 
      }else if(cylinder.position.y > -0.25) {
        cylinder.position.y -= increment; 
      }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    animate();
}
window.addEventListener("resize", onWindowResize);
}