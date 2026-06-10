import { CONTACT } from '../../data/content.js';
import { useTilt } from '../../hooks/useTilt.js';

export default function About() {
  const tiltRef = useTilt({ max: 8, scale: 1.02 });

  return (
    <section id="about" className="section about">
      <div className="container">
        <div className="section-header">
          <span className="section-tag" data-reveal><i className="ph ph-user" /> Sobre mí</span>
          <h2 className="section-title" data-reveal>
            Conoce quién está detrás<br /><span className="text-gradient">del código</span>
          </h2>
        </div>
        <div className="about-grid">
          <div className="about-image-wrapper" data-reveal>
            <div className="about-image-container" ref={tiltRef}>
              <img src="/assets/profile.jpg" alt="Elias Sanchez Mendoza" className="about-image" />
              <div className="about-image-border" />
              <div className="about-float-card about-float-1">
                <i className="ph-fill ph-code" />
                <div>
                  <span className="float-number">+3</span>
                  <span className="float-label">Años exp.</span>
                </div>
              </div>
              <div className="about-float-card about-float-2">
                <i className="ph-fill ph-devices" />
                <div>
                  <span className="float-number">Full Stack</span>
                  <span className="float-label">Developer</span>
                </div>
              </div>
            </div>
          </div>
          <div className="about-content" data-reveal data-delay="0.15">
            <p className="about-text">
              Soy <strong>Elias Sanchez Mendoza</strong>, Ingeniero en Informática egresado de{' '}
              <strong>DuocUC</strong> (2023–2026). Con más de 3 años de experiencia en desarrollo web
              tanto Frontend como Backend, me especializo en crear soluciones tecnológicas que combinan
              rendimiento, accesibilidad y una experiencia de usuario excepcional.
            </p>
            <p className="about-text">
              Como desarrollador Full Stack freelance, he trabajado con pequeñas y medianas empresas
              diseñando interfaces modernas y responsivas, integrando APIs y desarrollando lógica de
              negocio robusta. Me apasiona la comunicación directa con clientes para transformar sus
              ideas en productos funcionales.
            </p>
            <div className="about-details">
              <div className="about-detail-item"><i className="ph ph-map-pin" /><span>Chile · Remoto</span></div>
              <div className="about-detail-item"><i className="ph ph-graduation-cap" /><span>Ing. Informática — DuocUC</span></div>
              <div className="about-detail-item"><i className="ph ph-translate" /><span>Español (Nativo) · Inglés (Intermedio)</span></div>
              <div className="about-detail-item"><i className="ph ph-envelope" /><span>{CONTACT.email}</span></div>
            </div>
            <div className="about-cta">
              <a href="#contact" className="btn btn-primary"><span>Hablemos</span><i className="ph ph-chat-dots" /></a>
              <a href={CONTACT.cv} download className="btn btn-ghost"><span>Descargar CV</span><i className="ph ph-download-simple" /></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
