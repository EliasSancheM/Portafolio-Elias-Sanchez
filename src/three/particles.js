import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initParticles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 3.2;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Particle configuration
  const count = 2000;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  // Pre-calculate 5 morph targets (Sphere, Helix/DNA, Saturn Ring, Wave Grid, Vortex)
  const shapes = [];

  // Shape 0: Sphere (Hero Section)
  shapes[0] = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const radius = 1.6 + Math.random() * 1.4;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    shapes[0][i3] = radius * Math.sin(phi) * Math.cos(theta);
    shapes[0][i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    shapes[0][i3 + 2] = radius * Math.cos(phi);
  }

  // Shape 1: DNA Helix (About Section)
  shapes[1] = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const strand = (i % 2 === 0) ? 0 : Math.PI;
    const t = (i / count) * Math.PI * 8; // Turns
    const r = 0.9; // Radius
    shapes[1][i3] = r * Math.sin(t + strand);
    shapes[1][i3 + 1] = (i / count - 0.5) * 5.0; // Vertical span
    shapes[1][i3 + 2] = r * Math.cos(t + strand);
  }

  // Shape 2: Saturn/Orbital Ring (Skills Section)
  shapes[2] = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const r = 1.6 + Math.random() * 1.5;
    const theta = Math.random() * Math.PI * 2;
    shapes[2][i3] = r * Math.cos(theta);
    shapes[2][i3 + 1] = (Math.random() - 0.5) * 0.15; // Tilted slightly, flat Ring
    shapes[2][i3 + 2] = r * Math.sin(theta);
  }

  // Shape 3: Wave Grid (Projects Section)
  shapes[3] = new Float32Array(count * 3);
  const cols = Math.floor(Math.sqrt(count));
  const spacing = 0.16;
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const r = i % cols;
    const c = Math.floor(i / cols);
    shapes[3][i3] = (r - cols / 2) * spacing;
    shapes[3][i3 + 1] = (Math.sin(r * 0.25) + Math.cos(c * 0.25)) * 0.25;
    shapes[3][i3 + 2] = (c - cols / 2) * spacing - 0.8;
  }

  // Shape 4: Vortex (Experience & Contact Sections)
  shapes[4] = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const t = (i / count) * Math.PI * 24;
    const r = 0.1 + (i / count) * 2.8;
    shapes[4][i3] = r * Math.cos(t);
    shapes[4][i3 + 1] = -((i / count) * 1.6) + 0.8;
    shapes[4][i3 + 2] = r * Math.sin(t);
  }

  // Initialize the baseline reference positions with the Sphere shape
  for (let i = 0; i < count * 3; i++) {
    positions[i] = shapes[0][i];
  }

  // Custom dual color mapping
  const color1 = new THREE.Color('#6c63ff');
  const color2 = new THREE.Color('#00d4aa');

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const mixRatio = Math.random();
    const mixedColor = color1.clone().lerp(color2, mixRatio);
    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Procedural soft glowing circle texture (same as original, provides soft bokeh style)
  function createCircleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
    
    return new THREE.CanvasTexture(canvas);
  }

  const material = new THREE.PointsMaterial({
    size: 0.08,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    map: createCircleTexture(),
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // Dynamic Active shape state
  let activeTargetPositions = shapes[0];

  function setShape(index) {
    if (index >= 0 && index < shapes.length) {
      activeTargetPositions = shapes[index];
    }
  }

  // Register ScrollTriggers to morph shapes dynamic based on current visible sections
  const sections = ['#hero', '#about', '#skills', '#projects', '#experience', '#contact'];
  const sectionShapes = [0, 1, 2, 3, 4, 4]; // Shape mapping index

  sections.forEach((selector, idx) => {
    const triggerEl = document.querySelector(selector);
    if (triggerEl) {
      ScrollTrigger.create({
        trigger: triggerEl,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => setShape(sectionShapes[idx]),
        onEnterBack: () => setShape(sectionShapes[idx]),
      });
    }
  });

  // Mouse interaction
  const mouse = { x: 0, y: 0, target: { x: 0, y: 0 } };
  window.addEventListener('mousemove', (e) => {
    mouse.target.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.target.y = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Resize listener
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Pre-allocated objects to prevent GC overhead inside animation loop
  const mouse3D = new THREE.Vector3();
  const localMouse = new THREE.Vector3();

  // Animation render loop
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    // LERP transition for reference baseline positions
    for (let i = 0; i < count * 3; i++) {
      positions[i] += (activeTargetPositions[i] - positions[i]) * 0.05;
    }

    // Smooth mouse follower LERP
    mouse.x += (mouse.target.x - mouse.x) * 0.05;
    mouse.y += (mouse.target.y - mouse.y) * 0.05;

    // Gentle global rotations
    particles.rotation.y = elapsed * 0.03 + mouse.x * 0.2;
    particles.rotation.x = mouse.y * 0.12;

    // Map screen cursor position into 3D world space coordinates
    mouse3D.set(mouse.x * 4.5, mouse.y * 3.2, 0);

    localMouse.copy(mouse3D);
    particles.worldToLocal(localMouse);

    const pos = geometry.attributes.position.array;
    const repulsionRadius = 1.6;
    const repulsionStrength = 0.45;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = positions[i3];
      const y = positions[i3 + 1];
      const z = positions[i3 + 2];

      // Subtle ambient waving motion
      const wave = Math.sin(elapsed * 0.7 + x * 0.5) * 0.06;
      const currentY = y + wave;

      // Mouse repulsion math
      const dx = x - localMouse.x;
      const dy = currentY - localMouse.y;
      const dz = z - localMouse.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      let rx = 0, ry = 0, rz = 0;

      if (dist < repulsionRadius && dist > 0.01) {
        const force = (repulsionRadius - dist) / repulsionRadius;
        const push = force * repulsionStrength;
        
        rx = (dx / dist) * push;
        ry = (dy / dist) * push;
        rz = (dz / dist) * push;
      }

      pos[i3] = x + rx;
      pos[i3 + 1] = currentY + ry;
      pos[i3 + 2] = z + rz;
    }
    geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }

  animate();
}
