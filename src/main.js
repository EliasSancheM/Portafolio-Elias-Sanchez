import './style.css';
import { initScrollReveal } from './animations/scroll-reveal.js';
import { initGSAPAnimations } from './animations/gsap-animations.js';
import { initTextSplit } from './animations/text-split.js';
import { initMagneticCursor } from './animations/magnetic-cursor.js';
import { initSmoothScroll } from './utils/smooth-scroll.js';
import { initTextScramble } from './animations/text-scramble.js';
import { initCommandPalette } from './utils/command-palette.js';
import { initLoader } from './effects/loader.js';
import { animate, stagger, createScope } from 'animejs';
import Lenis from '@studio-freight/lenis';

document.addEventListener('DOMContentLoaded', () => {
  // NOTA: no se usa prefers-reduced-motion como interruptor global.
  // Windows 11 lo activa silenciosamente (ahorro de batería / "Efectos de
  // animación" desactivado) y dejaba la página sin ningún efecto.

  // ── Loader ─────────────────────────────────────────────────
  initLoader();

  // ── Lenis ultra-smooth scroll ──────────────────────────────
  const lenis = new Lenis({ duration: 1.3, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
  window.lenis = lenis;

  // ── Mobile nav toggle ──────────────────────────────────────
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
  toggle?.addEventListener('click', () => {
    toggle.classList.toggle('active');
    menu.classList.toggle('open');
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggle?.classList.remove('active');
      menu?.classList.remove('open');
    });
  });

  // ── Navbar scroll effect ────────────────────────────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 50);
  });

  // ── Typewriter ──────────────────────────────────────────────
  const typewriterEl = document.querySelector('.typewriter');
  if (typewriterEl) {
    const text = typewriterEl.textContent;
    typewriterEl.textContent = '';
    let i = 0;
    const type = () => {
      if (i < text.length) { typewriterEl.textContent += text.charAt(i); i++; setTimeout(type, 80); }
    };
    setTimeout(type, 1400);
  }

  // ── Hero stats counter animation ───────────────────────────
  function countUp(el, target, duration) {
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  const statNumbers = document.querySelectorAll('.stat-number');
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      countUp(el, parseInt(el.dataset.target || '0', 10), 1800);
      statsObserver.unobserve(el);
    });
  }, { threshold: 0.2 });
  statNumbers.forEach(el => statsObserver.observe(el));

  // ── Skill power bar animation ──────────────────────────────
  const skillItems = document.querySelectorAll('.skill-item[data-level]');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const item = entry.target;
      const level = parseInt(item.dataset.level || '0', 10);
      const fill = item.querySelector('.skill-bar-fill');
      if (fill) {
        setTimeout(() => {
          fill.style.width = level + '%';
          item.classList.add('skill-bar-animated');
        }, 100);
      }
      skillObserver.unobserve(item);
    });
  }, { threshold: 0.3 });
  skillItems.forEach(item => skillObserver.observe(item));

  // ── Contact form ────────────────────────────────────────────
  const form = document.getElementById('contact-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const origHTML = btn.innerHTML;
    btn.innerHTML = '<span>Enviando...</span><i class="ph ph-circle-notch spinner"></i>';
    btn.style.pointerEvents = 'none';
    const formData = new FormData(form);
    fetch('https://formspree.io/f/xnjrjzwl', { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } })
      .then(r => {
        btn.innerHTML = r.ok
          ? '<span>¡Mensaje enviado!</span><i class="ph ph-check-circle"></i>'
          : '<span>Error al enviar</span><i class="ph ph-warning"></i>';
        if (r.ok) form.reset();
      })
      .catch(() => { btn.innerHTML = '<span>Error de red</span><i class="ph ph-warning"></i>'; })
      .finally(() => { setTimeout(() => { btn.innerHTML = origHTML; btn.style.pointerEvents = ''; }, 3000); });
  });

  // ── Copy email ─────────────────────────────────────────────
  const copyBtn = document.getElementById('copy-email-btn');
  copyBtn?.addEventListener('click', () => {
    const email = copyBtn.dataset.email;
    if (!email) return;
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
  });

  // ── Core modules ────────────────────────────────────────────
  initSmoothScroll();
  initScrollReveal();
  initCommandPalette();

  // ── Motion-rich modules ─────────────────────────────────────
  initMagneticCursor();
  initTextScramble();
  initTextSplit();
  initGSAPAnimations();

  // Sakura petals
  import('./effects/sakura.js').then(({ initSakura }) => initSakura());

  // Vanilla Tilt on cards
  import('./effects/tilt.js').then(({ initTilt }) => initTilt());

  // Three.js particles (heaviest — loads last)
  import('./three/particles.js').then(({ initParticles }) => initParticles());

  // anime.js section reveals with stagger
  const sectionRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const items = entry.target.querySelectorAll('.skill-item, .project-card, .timeline-item, .contact-item');
      if (items.length) {
        animate(items, { opacity: [0, 1], translateY: [30, 0],
          delay: stagger(80), duration: 700, ease: 'easeOutExpo' });
      }
      sectionRevealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.section').forEach(s => sectionRevealObserver.observe(s));
});
