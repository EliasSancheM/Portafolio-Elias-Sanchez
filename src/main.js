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

  // Skill radial gauges animation
  const skillItems = document.querySelectorAll('.skill-item');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const item = entry.target;
        const level = parseInt(item.dataset.level || '0', 10);
        const circumference = 2 * Math.PI * 34; // ~213.63
        const offset = circumference - (circumference * level / 100);
        
        item.style.setProperty('--level', level + '%');
        item.style.setProperty('--offset', offset);
        item.classList.add('animated');
        skillObserver.unobserve(item);
      }
    });
  }, { threshold: 0.2 });
  skillItems.forEach(item => skillObserver.observe(item));

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
  initMagneticCursor();
  initParticles();

  // GSAP + text split (loaded async)
  initTextSplit();
  initGSAPAnimations();
});
