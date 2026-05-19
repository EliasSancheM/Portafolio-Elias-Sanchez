import gsap from 'gsap';

export function initTextSplit() {
  const elements = document.querySelectorAll('.text-split');

  elements.forEach(el => {
    const text = el.textContent;
    el.textContent = '';
    el.setAttribute('aria-label', text);

    // Remove reveal classes from all ancestors up to hero-title
    let parent = el.parentElement;
    while (parent && !parent.classList.contains('hero-title')) {
      if (parent.classList.contains('reveal-up')) {
        parent.classList.remove('reveal-up');
        parent.classList.add('revealed');
        parent.style.opacity = '1';
        parent.style.transform = 'none';
      }
      parent = parent.parentElement;
    }

    [...text].forEach((char) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.display = 'inline-block';
      el.appendChild(span);
    });

    // Animate letters in with GSAP
    const spans = el.querySelectorAll('span');
    gsap.set(spans, { opacity: 0, y: 40, rotateX: -40 });
    gsap.to(spans, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: 0.6,
      stagger: 0.04,
      ease: 'power3.out',
      delay: 0.5,
    });
  });
}
