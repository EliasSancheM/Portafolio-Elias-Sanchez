import { useEffect, useRef, useState } from 'react';
import { HERO_STATS, CONTACT } from '../../data/content.js';
import { scrollToSection } from '../../lib/scroll.js';
import { gsap } from '../../lib/scroll.js';

const NAME = 'Elias Sanchez';
const ROLE = 'Full Stack Developer';

function Counter({ target, label }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const obs = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        obs.disconnect();
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / 1800, 1);
          el.textContent = Math.round((1 - Math.pow(1 - p, 4)) * target);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return (
    <div className="hero-stat">
      <span className="stat-number" ref={ref}>0</span>
      <span className="stat-plus">+</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

function Typewriter({ text, delay = 1600 }) {
  const [shown, setShown] = useState('');
  useEffect(() => {
    let i = 0;
    let interval;
    const start = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setShown(text.slice(0, i));
        if (i >= text.length) clearInterval(interval);
      }, 75);
    }, delay);
    return () => { clearTimeout(start); clearInterval(interval); };
  }, [text, delay]);
  return <span className="typewriter">{shown}<span className="caret" /></span>;
}

export default function Hero() {
  const nameRef = useRef(null);

  useEffect(() => {
    // Entrada cinematográfica del nombre, letra por letra
    const chars = nameRef.current.querySelectorAll('.char');
    const tl = gsap.fromTo(
      chars,
      { opacity: 0, y: 60, rotateX: -90 },
      { opacity: 1, y: 0, rotateX: 0, duration: 0.9, stagger: 0.045, ease: 'back.out(1.6)', delay: 0.5 }
    );
    return () => tl.kill();
  }, []);

  return (
    <section id="hero" className="hero">
      <div className="hero-kana" aria-hidden="true">開発者</div>
      <div className="hero-kana hero-kana-2" aria-hidden="true">全力</div>

      <div className="hero-content">
        <div className="hero-badge" data-reveal>
          <span className="badge-dot" />
          Disponible para trabajar
        </div>

        <h1 className="hero-title">
          <span className="hero-greeting" data-reveal data-delay="0.15">Hola, soy</span>
          <span className="hero-name" ref={nameRef} aria-label={NAME}>
            {NAME.split('').map((c, i) => (
              <span key={i} className="char" aria-hidden="true">{c === ' ' ? ' ' : c}</span>
            ))}
          </span>
          <span className="hero-role">
            <Typewriter text={ROLE} />
          </span>
        </h1>

        <p className="hero-description" data-reveal data-delay="0.4">
          Ingeniero en Informática con +3 años de experiencia creando
          soluciones web <span className="text-accent">eficientes</span>,{' '}
          <span className="text-accent">accesibles</span> y{' '}
          <span className="text-accent">centradas en el usuario</span>.
        </p>

        <div className="hero-stats" data-reveal data-delay="0.55">
          {HERO_STATS.map((s, i) => (
            <Counter key={s.label} target={s.target} label={s.label} />
          ))}
        </div>

        <div className="hero-cta" data-reveal data-delay="0.7">
          <a
            href="#projects"
            className="btn btn-primary"
            onClick={(e) => { e.preventDefault(); scrollToSection('projects'); }}
          >
            <span>Ver proyectos</span>
            <i className="ph ph-arrow-right" />
          </a>
          <a href={CONTACT.cv} download className="btn btn-ghost">
            <span>Descargar CV</span>
            <i className="ph ph-download-simple" />
          </a>
        </div>
      </div>

      <div className="hero-scroll-indicator" aria-hidden="true">
        <div className="scroll-line" />
        <span>Scroll</span>
      </div>
    </section>
  );
}
