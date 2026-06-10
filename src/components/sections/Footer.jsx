import { CONTACT } from '../../data/content.js';
import { scrollToSection } from '../../lib/scroll.js';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <a href="#hero" className="footer-logo" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}>
          <span className="logo-bracket">&lt;</span>ESM<span className="logo-bracket"> /&gt;</span>
        </a>
        <p className="footer-text">
          Diseñado y desarrollado por <strong>Elias Sanchez Mendoza</strong> — 2026
        </p>
        <div className="footer-links">
          <a href={CONTACT.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><i className="ph ph-github-logo" /></a>
          <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i className="ph ph-linkedin-logo" /></a>
        </div>
      </div>
    </footer>
  );
}
