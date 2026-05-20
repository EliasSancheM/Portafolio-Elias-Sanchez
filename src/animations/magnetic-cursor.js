export function initMagneticCursor() {
  // Skip on touch devices
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor || !follower) return;

  let cursorX = 0, cursorY = 0;
  let followerX = 0, followerY = 0;
  let prevFollowerX = 0, prevFollowerY = 0;

  document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
  });

  // Smooth follower animation with dynamic organic jelly physics
  function animate() {
    // Keep track of previous frame position
    prevFollowerX = followerX;
    prevFollowerY = followerY;

    // LERP interpolation
    followerX += (cursorX - followerX) * 0.14;
    followerY += (cursorY - followerY) * 0.14;

    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';

    // Calculate movement vector components
    const dx = followerX - prevFollowerX;
    const dy = followerY - prevFollowerY;
    
    // Calculate speed
    const speed = Math.sqrt(dx * dx + dy * dy);
    
    // Stretch along velocity vector, shrink on the perpendicular axis
    // Clamp the stretch factor to prevent the cursor from looking distorted
    const stretch = Math.min(speed * 0.08, 0.5); 
    
    // Angle in degrees
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

    if (speed > 0.1) {
      follower.style.transform = `translate3d(-50%, -50%, 0) rotate(${angle}deg) scale(${1 + stretch}, ${1 - stretch})`;
    } else {
      follower.style.transform = 'translate3d(-50%, -50%, 0) scale(1, 1)';
    }

    requestAnimationFrame(animate);
  }
  animate();

  // Magnetic effect on interactive elements
  const magnetics = document.querySelectorAll('.magnetic');
  magnetics.forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
      el.style.transform = '';
    });
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
  });

  // Also apply hover effect to all links and buttons
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    follower.style.opacity = '1';
  });
}
