import { useEffect, useState } from 'react';
import { NAV_LINKS } from '../data/content.js';
import { scrollToSection } from '../lib/scroll.js';

export default function Navbar({ onOpenPalette }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('hero');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    NAV_LINKS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, []);

  const go = (id) => (e) => {
    e.preventDefault();
    setOpen(false);
    scrollToSection(id);
  };

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <a href="#hero" className="nav-logo" onClick={go('hero')}>
        <span className="logo-bracket">&lt;</span>ESM<span className="logo-bracket"> /&gt;</span>
      </a>
      <button
        className={`nav-toggle${open ? ' active' : ''}`}
        aria-label="Abrir menú"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="hamburger" />
      </button>
      <ul className={`nav-menu${open ? ' open' : ''}`}>
        {NAV_LINKS.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={`nav-link${active === id ? ' active' : ''}`}
              onClick={go(id)}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
      <button className="nav-cmd-btn" title="Abrir consola (Ctrl+K)" onClick={onOpenPalette}>
        <i className="ph ph-command" />
        <span className="cmd-badge">Ctrl+K</span>
      </button>
    </nav>
  );
}
