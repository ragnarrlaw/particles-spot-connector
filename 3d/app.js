const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 200;

const particles = [];
const numParticles = 200;

const particleGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(numParticles * 3);
const sizes = new Float32Array(numParticles);

for (let i = 0; i < numParticles; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 400;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 400;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 400;
    sizes[i] = Math.random() * 3 + 1;
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

const particleMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 3, sizeAttenuation: true });
const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particleSystem);

let mouseX = null;
let mouseY = null;

document.addEventListener("mousemove", (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

function drawConnections() {
    const lines = [];
    for (let i = 0; i < numParticles; i++) {
        for (let j = i + 1; j < numParticles; j++) {
            const dx = positions[i * 3] - positions[j * 3];
            const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
            const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (distance < 50) {
                const opacity = 1 - distance / 50;
                const material = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: opacity });
                const geometry = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]),
                    new THREE.Vector3(positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2])
                ]);
                const line = new THREE.Line(geometry, material);
                lines.push(line);
            }
        }
    }
    lines.forEach(line => scene.add(line));
}

function animate() {
    requestAnimationFrame(animate);

    particleSystem.rotation.x += 0.001;
    particleSystem.rotation.y += 0.001;

    drawConnections();

    renderer.render(scene, camera);
}

animate();