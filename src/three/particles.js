import * as THREE from 'three';

export function initParticles() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 3;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Particle system
  const count = 2000;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  const color1 = new THREE.Color('#6c63ff');
  const color2 = new THREE.Color('#00d4aa');

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    // Spherical distribution
    const radius = 2.5 + Math.random() * 2.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);

    // Gradient colors
    const mixRatio = Math.random();
    const mixedColor = color1.clone().lerp(color2, mixRatio);
    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;

    sizes[i] = Math.random() * 3 + 1;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    size: 0.02,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // Mouse interaction
  const mouse = { x: 0, y: 0, target: { x: 0, y: 0 } };
  window.addEventListener('mousemove', (e) => {
    mouse.target.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.target.y = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Animation loop
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    // Smooth mouse follow
    mouse.x += (mouse.target.x - mouse.x) * 0.05;
    mouse.y += (mouse.target.y - mouse.y) * 0.05;

    // Rotate particles
    particles.rotation.y = elapsed * 0.05 + mouse.x * 0.3;
    particles.rotation.x = mouse.y * 0.2;

    // Wave effect on positions
    const pos = geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = positions[i3];
      const y = positions[i3 + 1];
      const z = positions[i3 + 2];
      pos[i3 + 1] = y + Math.sin(elapsed * 0.5 + x * 0.5) * 0.05;
    }
    geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }

  animate();
}
