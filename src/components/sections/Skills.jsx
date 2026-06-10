import { useEffect, useRef, useState } from 'react';
import { SKILL_CATEGORIES } from '../../data/content.js';

function SkillBar({ skill }) {
  const ref = useRef(null);
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => setFilled(true), 120);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="skill-item" ref={ref} style={{ '--brand-color': skill.color }}>
      <span className="skill-dot" />
      <div className="skill-meta">
        <div className="skill-meta-top">
          <span className="skill-name">{skill.name}</span>
          <span className={`skill-level-badge tier-${skill.tier}`}>{skill.badge}</span>
        </div>
        <div className="skill-bar-track">
          <div className="skill-bar-fill" style={{ width: filled ? `${skill.level}%` : '0%' }} />
        </div>
      </div>
    </div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="section skills">
      <div className="container">
        <div className="section-header">
          <span className="section-tag" data-reveal><i className="ph ph-lightning" /> Skills</span>
          <h2 className="section-title" data-reveal>
            Mi stack<br /><span className="text-gradient">tecnológico</span>
          </h2>
        </div>
        <div className="skills-grid">
          {SKILL_CATEGORIES.map((cat, i) => (
            <div className="skill-category glass-panel" key={cat.title} data-reveal data-delay={i * 0.12}>
              <div className="skill-category-header">
                <div className="skill-icon-wrapper"><i className={`ph ${cat.icon}`} /></div>
                <h3>{cat.title}</h3>
                <span className="skill-cat-badge">{cat.skills.length} skills</span>
              </div>
              <div className="skill-items">
                {cat.skills.map((s) => <SkillBar key={s.name} skill={s} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
