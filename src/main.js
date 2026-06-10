import './style.css';
import { initScrollReveal } from './animations/scroll-reveal.js';
import { initGSAPAnimations } from './animations/gsap-animations.js';
import { initTextSplit } from './animations/text-split.js';
import { initMagneticCursor } from './animations/magnetic-cursor.js';
import { initSmoothScroll } from './utils/smooth-scroll.js';
import { initTextScramble } from './animations/text-scramble.js';
import { initCommandPalette } from './utils/command-palette.js';


// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  if (typewriterEl && !reducedMotion) {
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

  // Contact form
  const form = document.getElementById('contact-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const origHTML = btn.innerHTML;
    
    // Change to loading/sending state with a spinning notch icon
    btn.innerHTML = '<span>Enviando...</span><i class="ph ph-circle-notch spinner"></i>';
    btn.style.pointerEvents = 'none';
    
    // Collect form data
    const formData = new FormData(form);
    
    // Formspree API Endpoint
    fetch('https://formspree.io/f/xnjrjzwl', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        // Success state
        btn.innerHTML = '<span>¡Mensaje enviado!</span><i class="ph ph-check-circle"></i>';
        form.reset();
      } else {
        // Formspree error
        btn.innerHTML = '<span>Error al enviar</span><i class="ph ph-warning"></i>';
      }
    })
    .catch(() => {
      // Network/Connection error
      btn.innerHTML = '<span>Error de red</span><i class="ph ph-warning"></i>';
    })
    .finally(() => {
      // Reset button back to original state after 3 seconds
      setTimeout(() => {
        btn.innerHTML = origHTML;
        btn.style.pointerEvents = '';
      }, 3000);
    });
  });

  // Copy email to clipboard
  const copyBtn = document.getElementById('copy-email-btn');
  copyBtn?.addEventListener('click', () => {
    const email = copyBtn.dataset.email;
    if (email) {
      navigator.clipboard.writeText(email).then(() => {
        const icon = copyBtn.querySelector('i');
        const tooltip = copyBtn.querySelector('.tooltip');
        
        copyBtn.classList.add('copied');
        if (icon) icon.className = 'ph ph-check';
        if (tooltip) tooltip.textContent = '¡Copiado!';
        
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          if (icon) icon.className = 'ph ph-copy';
          if (tooltip) tooltip.textContent = 'Copiar';
        }, 2000);
      });
    }
  });

  // Initialize modules
  initSmoothScroll();
  initScrollReveal();
  initCommandPalette();

  // Con prefers-reduced-motion activo, el CSS muestra el contenido de
  // inmediato y aquí se omiten todos los efectos de movimiento
  if (!reducedMotion) {
    initMagneticCursor();
    initTextScramble();

    // Three.js es lo más pesado del bundle: se carga en un chunk aparte
    // para no bloquear la interactividad inicial de la página
    import('./three/particles.js').then(({ initParticles }) => initParticles());

    // GSAP + text split (loaded async)
    initTextSplit();
    initGSAPAnimations();
  }
});
