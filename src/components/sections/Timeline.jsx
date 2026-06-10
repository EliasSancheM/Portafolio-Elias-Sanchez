import { TIMELINE } from '../../data/content.js';

export default function Timeline() {
  return (
    <section id="experience" className="section experience">
      <div className="container">
        <div className="section-header">
          <span className="section-tag" data-reveal><i className="ph ph-briefcase" /> Experiencia</span>
          <h2 className="section-title" data-reveal>
            Mi trayectoria<br /><span className="text-gradient">profesional</span>
          </h2>
        </div>
        <div className="timeline">
          {TIMELINE.map((item, i) => (
            <div className="timeline-item" key={item.title} data-reveal data-delay={i * 0.15}>
              <div className="timeline-marker"><div className="timeline-dot" /></div>
              <div className="timeline-content glass-panel">
                <div className="timeline-header">
                  <span className="timeline-date">{item.date}</span>
                  <span className={`timeline-badge${item.badgeType === 'edu' ? ' badge-edu' : ''}`}>{item.badge}</span>
                </div>
                <h3 className="timeline-title">{item.title}</h3>
                <p className="timeline-company">{item.company}</p>
                <ul className="timeline-list">
                  {item.items.map((li) => <li key={li}>{li}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
