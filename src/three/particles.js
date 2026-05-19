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

  // Create a procedural soft glowing circle texture
  function createCircleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    // Radial gradient for smooth round glowing points (bokeh effect)
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
    size: 0.07, // Larger size to appreciate the soft bokeh glow
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    map: createCircleTexture(),
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

  // Pre-allocate vectors for performance (avoids GC thrashing in animation loop)
  const mouse3D = new THREE.Vector3();
  const localMouse = new THREE.Vector3();

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

    // Map screen-space mouse to 3D world space (camera is at z=3, fov=75)
    mouse3D.set(mouse.x * 4.5, mouse.y * 3.2, 0);

    // Convert mouse3D into particles local coordinate space to align with rotation
    localMouse.copy(mouse3D);
    particles.worldToLocal(localMouse);

    const pos = geometry.attributes.position.array;
    const repulsionRadius = 1.8;
    const repulsionStrength = 0.5;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = positions[i3];
      const y = positions[i3 + 1];
      const z = positions[i3 + 2];

      // Base fluid waving motion
      const wave = Math.sin(elapsed * 0.8 + x * 0.5) * 0.08;
      const currentY = y + wave;

      // Calculate distance to cursor in local space
      const dx = x - localMouse.x;
      const dy = currentY - localMouse.y;
      const dz = z - localMouse.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      let rx = 0, ry = 0, rz = 0;

      // Repulsion force if within radius
      if (dist < repulsionRadius && dist > 0.01) {
        const force = (repulsionRadius - dist) / repulsionRadius; // 0 to 1
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
