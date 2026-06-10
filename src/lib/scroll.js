import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Estado compartido que la escena 3D lee cada frame (sin re-renders de React)
export const scrollState = { progress: 0, velocity: 0 };

let lenis = null;

export function initSmoothScroll() {
  if (lenis) return lenis;

  lenis = new Lenis({
    duration: 1.25,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on('scroll', (e) => {
    scrollState.progress = e.limit > 0 ? e.scroll / e.limit : 0;
    scrollState.velocity = e.velocity;
    ScrollTrigger.update();
  });

  // GSAP maneja el rAF de Lenis para mantener todo sincronizado
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  window.lenis = lenis;
  return lenis;
}

export function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.4 });
  else el.scrollIntoView({ behavior: 'smooth' });
}

export { gsap, ScrollTrigger };
