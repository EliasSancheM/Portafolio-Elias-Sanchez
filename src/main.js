import './style.css';
import { initParticles } from './three/particles.js';
import { initScrollReveal } from './animations/scroll-reveal.js';
import { initGSAPAnimations } from './animations/gsap-animations.js';
import { initTextSplit } from './animations/text-split.js';
import { initMagneticCursor } from './animations/magnetic-cursor.js';
import { initSmoothScroll } from './utils/smooth-scroll.js';

// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
  toggle?.addEventListener('click', () => {
    toggle.classList.toggle('active');
    menu.classList.toggle('open');
  });

  // Close menu on link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggle?.classList.remove('active');
      menu?.classList.remove('open');
    });
  });

  // Navbar scroll effect
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Typewriter effect
  const typewriterEl = document.querySelector('.typewriter');
  if (typewriterEl) {
    const text = typewriterEl.textContent;
    typewriterEl.textContent = '';
    let i = 0;
    const type = () => {
      if (i < text.length) {
        typewriterEl.textContent += text.charAt(i);
        i++;
        setTimeout(type, 80);
      }
    };
    setTimeout(type, 1200);
  }

  // Skill bars animation
  const skillItems = document.querySelectorAll('.skill-item');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const item = entry.target;
        const level = item.dataset.level;
        item.style.setProperty('--level', level + '%');
        item.classList.add('animated');
        skillObserver.unobserve(item);
      }
    });
  }, { threshold: 0.5 });
  skillItems.forEach(item => skillObserver.observe(item));

  // Contact form
  const form = document.getElementById('contact-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const origHTML = btn.innerHTML;
    btn.innerHTML = '<span>¡Mensaje enviado!</span><i class="ph ph-check-circle"></i>';
    btn.style.pointerEvents = 'none';
    setTimeout(() => {
      btn.innerHTML = origHTML;
      btn.style.pointerEvents = '';
      form.reset();
    }, 3000);
  });

  // Initialize modules
  initSmoothScroll();
  initScrollReveal();
  initMagneticCursor();
  initParticles();

  // GSAP + text split (loaded async)
  initTextSplit();
  initGSAPAnimations();
});
