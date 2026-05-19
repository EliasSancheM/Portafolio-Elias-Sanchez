import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initGSAPAnimations() {
  // Remove CSS reveal classes from GSAP-controlled elements to avoid conflicts
  document.querySelectorAll('.section-header .reveal-up').forEach(el => {
    el.classList.remove('reveal-up');
  });
  document.querySelectorAll('.skill-category.reveal-up').forEach(el => {
    el.classList.remove('reveal-up');
  });
  document.querySelectorAll('.timeline-item').forEach(el => {
    el.classList.remove('reveal-left', 'reveal-right');
  });
  document.querySelectorAll('.contact-info.reveal-left, .contact-form.reveal-right').forEach(el => {
    el.classList.remove('reveal-left', 'reveal-right');
  });

  // Hero parallax on scroll
  gsap.to('.hero-content', {
    y: 150,
    opacity: 0,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5,
    },
  });

  // Section titles - stagger in
  gsap.utils.toArray('.section-header').forEach(header => {
    const children = header.querySelectorAll('.section-tag, .section-title, .section-subtitle');
    gsap.set(children, { opacity: 0, y: 30 });
    gsap.to(children, {
      y: 0,
      opacity: 1,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });

  // Project cards 3D tilt on hover
  document.querySelectorAll('.project-card').forEach(card => {
    const inner = card.querySelector('.project-card-inner');
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -6;
      const rotateY = (x - centerX) / centerX * 6;
      gsap.to(inner, {
        rotateX, rotateY,
        duration: 0.4,
        ease: 'power2.out',
        transformPerspective: 800,
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(inner, {
        rotateX: 0, rotateY: 0,
        duration: 0.6,
        ease: 'power3.out',
      });
    });
  });

  // Timeline items
  gsap.utils.toArray('.timeline-item').forEach((item, i) => {
    gsap.set(item, { opacity: 0, x: i % 2 === 0 ? -40 : 40 });
    gsap.to(item, {
      x: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 88%',
        toggleActions: 'play none none none',
        onEnter: () => item.classList.add('revealed'),
      },
    });
  });

  // Skill categories
  gsap.utils.toArray('.skill-category').forEach((cat, i) => {
    gsap.set(cat, { opacity: 0, y: 60 });
    gsap.to(cat, {
      y: 0,
      opacity: 1,
      duration: 0.7,
      delay: i * 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: cat,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
  });

  // Contact section
  const contactGrid = document.querySelector('.contact-grid');
  if (contactGrid) {
    const contactInfo = contactGrid.querySelector('.contact-info');
    const contactForm = contactGrid.querySelector('.contact-form');
    if (contactInfo) {
      gsap.set(contactInfo, { opacity: 0, x: -40 });
      gsap.to(contactInfo, {
        x: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: contactGrid, start: 'top 85%' },
      });
    }
    if (contactForm) {
      gsap.set(contactForm, { opacity: 0, x: 40 });
      gsap.to(contactForm, {
        x: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: contactGrid, start: 'top 85%' },
      });
    }
  }
}
