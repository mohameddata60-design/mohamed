// إعداد المشهد، الكاميرا، والمُسيّر
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 15, 12);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// الإضاءة
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(0, 20, 10);
scene.add(pointLight);

// لوحة اللعب
const boardGeo = new THREE.BoxGeometry(10, 0.5, 10);
const boardMat = new THREE.MeshStandardMaterial({ color: 0x2b3e50, roughness: 0.3 });
const board = new THREE.Mesh(boardGeo, boardMat);
scene.add(board);

const gridHelper = new THREE.GridHelper(10, 10, 0x00ff66, 0x555555);
gridHelper.position.y = 0.3;
scene.add(gridHelper);

// قطعة اللاعب
const playerGeo = new THREE.ConeGeometry(0.4, 1.2, 16);
const playerMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.5 });
const player = new THREE.Mesh(playerGeo, playerMat);

let currentPosition = 1;
player.position.set(-4.5, 0.9, 4.5);
scene.add(player);

const snakesAndLadders = {
    3: 22,
    11: 26,
    17: 4,
    20: 35
};

function getCoordinates(pos) {
    let index = pos - 1;
    let row = Math.floor(index / 10);
    let col = index % 10;
    
    if (row % 2 === 1) {
        col = 9 - col;
    }

    let x = -4.5 + (col * 1);
    let z = 4.5 - (row * 1);
    return { x: x, z: z };
}

function playTurn() {
    let diceRoll = Math.floor(Math.random() * 6) + 1;
    currentPosition += diceRoll;

    if (currentPosition > 50) {
        currentPosition = 50;
    }

    let coords = getCoordinates(currentPosition);
    player.position.x = coords.x;
    player.position.z = coords.z;

    let message = `رميت النرد طلع: 🎲 ${diceRoll} | وصلت للمربع: ${currentPosition}`;

    if (snakesAndLadders[currentPosition]) {
        let oldPos = currentPosition;
        currentPosition = snakesAndLadders[currentPosition];
        let newCoords = getCoordinates(currentPosition);
        player.position.x = newCoords.x;
        player.position.z = newCoords.z;

        if (currentPosition > oldPos) {
            message += ` 🚀 صعدت سلماً إلى ${currentPosition}`;
        } else {
            message += ` 🐍 نزلت مع ثعبان إلى ${currentPosition}`;
        }
    }

    if (currentPosition === 50) {
        message += " 🎉 فزت باللعبة!";
        currentPosition = 1;
    }

    document.getElementById("status").innerText = message;
}

function animate() {
    requestAnimationFrame(animate);
    let time = Date.now() * 0.0005;
    camera.position.x = Math.cos(time) * 15;
    camera.position.z = Math.sin(time) * 15;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});