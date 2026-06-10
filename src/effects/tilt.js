import VanillaTilt from 'vanilla-tilt';

export function initTilt() {
  // Project cards - strong cinematic tilt
  VanillaTilt.init(document.querySelectorAll('.project-card'), {
    max: 12,
    speed: 600,
    glare: true,
    'max-glare': 0.25,
    perspective: 1000,
    scale: 1.03,
    easing: 'cubic-bezier(0.03, 0.98, 0.52, 0.99)',
  });

  // Profile image - subtle tilt
  VanillaTilt.init(document.querySelectorAll('.about-image-container'), {
    max: 8,
    speed: 800,
    glare: true,
    'max-glare': 0.15,
    perspective: 1200,
    scale: 1.02,
  });

  // Skill category cards - light tilt
  VanillaTilt.init(document.querySelectorAll('.skill-category'), {
    max: 5,
    speed: 700,
    glare: false,
    perspective: 1500,
    scale: 1.01,
  });
}
