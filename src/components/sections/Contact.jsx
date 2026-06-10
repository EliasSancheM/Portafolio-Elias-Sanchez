import { useState } from 'react';
import { CONTACT } from '../../data/content.js';

export default function Contact() {
  const [status, setStatus] = useState('idle'); // idle | sending | ok | error
  const [copied, setCopied] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus('sending');
    try {
      const res = await fetch(CONTACT.formspree, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      setStatus(res.ok ? 'ok' : 'error');
      if (res.ok) form.reset();
    } catch {
      setStatus('error');
    }
    setTimeout(() => setStatus('idle'), 3000);
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(CONTACT.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const btnContent = {
    idle: <><span>Enviar mensaje</span><i className="ph ph-paper-plane-tilt" /></>,
    sending: <><span>Enviando...</span><i className="ph ph-circle-notch spinner" /></>,
    ok: <><span>¡Mensaje enviado!</span><i className="ph ph-check-circle" /></>,
    error: <><span>Error al enviar</span><i className="ph ph-warning" /></>,
  }[status];

  return (
    <section id="contact" className="section contact">
      <div className="container">
        <div className="section-header">
          <span className="section-tag" data-reveal><i className="ph ph-envelope" /> Contacto</span>
          <h2 className="section-title" data-reveal>
            ¿Tienes un proyecto<br /><span className="text-gradient">en mente?</span>
          </h2>
          <p className="section-subtitle" data-reveal>
            Estoy disponible para proyectos freelance y oportunidades laborales. ¡Hablemos!
          </p>
        </div>
        <div className="contact-grid">
          <div className="contact-info" data-reveal>
            <div className="contact-card glass-panel">
              <div className="contact-item">
                <div className="contact-icon"><i className="ph ph-envelope-simple" /></div>
                <div>
                  <span className="contact-label">Email</span>
                  <div className="email-copy-wrapper">
                    <a href={`mailto:${CONTACT.email}`} className="contact-value">{CONTACT.email}</a>
                    <button className={`copy-email-btn${copied ? ' copied' : ''}`} aria-label="Copiar correo" onClick={copyEmail}>
                      <i className={`ph ${copied ? 'ph-check' : 'ph-copy'}`} />
                      <span className="tooltip">{copied ? '¡Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon"><i className="ph ph-phone" /></div>
                <div>
                  <span className="contact-label">Teléfono</span>
                  <a href={CONTACT.phoneHref} className="contact-value">{CONTACT.phone}</a>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon"><i className="ph ph-map-pin" /></div>
                <div>
                  <span className="contact-label">Ubicación</span>
                  <span className="contact-value">{CONTACT.location}</span>
                </div>
              </div>
            </div>
            <div className="contact-socials">
              <a href={CONTACT.github} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub">
                <i className="ph ph-github-logo" />
              </a>
              <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
                <i className="ph ph-linkedin-logo" />
              </a>
              <a href={`mailto:${CONTACT.email}`} className="social-link" aria-label="Email">
                <i className="ph ph-envelope-simple" />
              </a>
            </div>
          </div>
          <form className="contact-form glass-panel" data-reveal data-delay="0.15" onSubmit={onSubmit}>
            <div className="form-group">
              <input type="text" id="form-name" name="name" required placeholder=" " autoComplete="name" />
              <label htmlFor="form-name">Tu nombre</label>
              <div className="form-line" />
            </div>
            <div className="form-group">
              <input type="email" id="form-email" name="email" required placeholder=" " autoComplete="email" />
              <label htmlFor="form-email">Tu email</label>
              <div className="form-line" />
            </div>
            <div className="form-group">
              <textarea id="form-message" name="message" rows="4" required placeholder=" " />
              <label htmlFor="form-message">Tu mensaje</label>
              <div className="form-line" />
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={status === 'sending'}>
              {btnContent}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
