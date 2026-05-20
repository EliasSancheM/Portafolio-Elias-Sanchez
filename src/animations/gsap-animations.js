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
  document.querySelectorAll('.project-card.reveal-up').forEach(el => {
    el.classList.remove('reveal-up');
  });
  document.querySelectorAll('.timeline-item').forEach(el => {
    el.classList.remove('reveal-left', 'reveal-right');
  });
  document.querySelectorAll('.contact-info.reveal-left, .contact-form.reveal-right').forEach(el => {
    el.classList.remove('reveal-left', 'reveal-right');
  });

  // Scroll progress bar
  gsap.to('.scroll-progress', {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.1,
    },
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

  // Project cards 3D entrance animation on scroll
  const projectGrid = document.querySelector('.projects-grid');
  if (projectGrid) {
    const cards = projectGrid.querySelectorAll('.project-card');
    gsap.set(cards, { 
      opacity: 0, 
      y: 80, 
      scale: 0.9, 
      rotateX: -12, 
      transformPerspective: 1000 
    });
    gsap.to(cards, {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      duration: 1.0,
      ease: 'back.out(1.1)',
      stagger: 0.15,
      scrollTrigger: {
        trigger: projectGrid,
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    });
  }

  // Project cards 3D tilt on hover (interactive mousemove)
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
      const pctX = (x / rect.width) * 100;
      const pctY = (y / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${pctX}%`);
      card.style.setProperty('--mouse-y', `${pctY}%`);

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

  // Profile picture 3D tilt & floating badges parallax
  const profileContainer = document.querySelector('.profile-tilt');
  if (profileContainer) {
    const img = profileContainer.querySelector('.about-image');
    const border = profileContainer.querySelector('.about-image-border');
    const float1 = profileContainer.querySelector('.about-float-1');
    const float2 = profileContainer.querySelector('.about-float-2');

    profileContainer.addEventListener('mousemove', (e) => {
      const rect = profileContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Subtle 3D rotation based on mouse position relative to center
      const rotateX = ((y - centerY) / centerY) * -8; // max 8deg
      const rotateY = ((x - centerX) / centerX) * 8; // max 8deg

      // Dynamic parallax translation for the floating cards (different depths)
      const float1X = (x - centerX) * 0.15; // moves with the mouse for extra depth
      const float1Y = (y - centerY) * 0.15;
      const float2X = (x - centerX) * -0.1;  // moves in the opposite direction
      const float2Y = (y - centerY) * -0.1;

      gsap.to([img, border], {
        rotateX,
        rotateY,
        transformPerspective: 1000,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto'
      });

      if (float1) {
        gsap.to(float1, {
          x: float1X,
          y: float1Y,
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }

      if (float2) {
        gsap.to(float2, {
          x: float2X,
          y: float2Y,
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }
    });

    profileContainer.addEventListener('mouseleave', () => {
      gsap.to([img, border], {
        rotateX: 0,
        rotateY: 0,
        duration: 0.8,
        ease: 'power3.out',
        overwrite: 'auto'
      });

      if (float1) {
        gsap.to(float1, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      }

      if (float2) {
        gsap.to(float2, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      }
    });
  }


  // Experience timeline vertical path progress tracking on scroll
  const timeline = document.querySelector('.timeline');
  if (timeline) {
    gsap.fromTo(timeline, 
      { '--scroll-progress': '0%' },
      {
        '--scroll-progress': '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: timeline,
          start: 'top 70%',
          end: 'bottom 70%',
          scrub: true,
        }
      }
    );
  }

  // Timeline items slide out gracefully from the vertical timeline line
  gsap.utils.toArray('.timeline-item').forEach((item) => {
    gsap.set(item, { opacity: 0, x: -30 });
    gsap.to(item, {
      x: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 85%',
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
