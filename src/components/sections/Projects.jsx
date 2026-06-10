import { PROJECTS } from '../../data/content.js';
import { useTilt } from '../../hooks/useTilt.js';

function ProjectArt({ type }) {
  switch (type) {
    case 'dashboard':
      return (
        <div className="project-art dashboard-art">
          <div className="art-bar bar-1" /><div className="art-bar bar-2" /><div className="art-bar bar-3" />
        </div>
      );
    case 'calendar':
      return (
        <div className="project-art calendar-art">
          <div className="calendar-grid">
            <div className="cal-day" /><div className="cal-day" /><div className="cal-day" />
            <div className="cal-day active-day"><i className="ph ph-check" /></div>
            <div className="cal-day" /><div className="cal-day" />
          </div>
        </div>
      );
    case 'landing':
      return (
        <div className="project-art landing-art">
          <div className="landing-header" />
          <div className="landing-hero"><div className="hero-block" /><div className="hero-circle" /></div>
        </div>
      );
    default:
      return (
        <div className="project-art orb-art">
          <div className="orb-core" /><div className="orb-ring orb-ring-1" /><div className="orb-ring orb-ring-2" />
        </div>
      );
  }
}

function ProjectCard({ project, index }) {
  const tiltRef = useTilt({ max: 10, scale: 1.025 });

  return (
    <article className="project-card" data-reveal data-delay={index * 0.12} style={{ '--card-hue': project.hue }}>
      <div className="project-card-inner" ref={tiltRef}>
        <div className="project-image">
          <ProjectArt type={project.art} />
          <div className="project-sheen" />
        </div>
        <div className="project-info">
          <span className="project-number">{project.number}</span>
          <h3 className="project-title">{project.title}</h3>
          <p className="project-desc">{project.desc}</p>
          <div className="project-tech">
            {project.tech.map((t) => <span key={t}>{t}</span>)}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="section projects">
      <div className="container">
        <div className="section-header">
          <span className="section-tag" data-reveal><i className="ph ph-folder-open" /> Proyectos</span>
          <h2 className="section-title" data-reveal>
            Trabajos<br /><span className="text-gradient">destacados</span>
          </h2>
        </div>
        <div className="projects-grid">
          {PROJECTS.map((p, i) => <ProjectCard key={p.number} project={p} index={i} />)}
        </div>
      </div>
    </section>
  );
}
