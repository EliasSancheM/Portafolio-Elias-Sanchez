import { useEffect, useMemo, useRef, useState } from 'react';
import { NAV_LINKS, CONTACT } from '../data/content.js';
import { scrollToSection } from '../lib/scroll.js';

export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const inputRef = useRef(null);

  const commands = useMemo(() => [
    ...NAV_LINKS.map(({ id, label }) => ({
      icon: 'ph-arrow-bend-up-right',
      label: `Ir a ${label}`,
      keywords: `ir ${label} seccion navegar`,
      run: () => scrollToSection(id),
    })),
    {
      icon: 'ph-copy',
      label: 'Copiar email',
      keywords: 'copiar email correo contacto',
      run: () => navigator.clipboard.writeText(CONTACT.email),
    },
    {
      icon: 'ph-download-simple',
      label: 'Descargar CV',
      keywords: 'descargar cv curriculum pdf',
      run: () => window.open(CONTACT.cv, '_blank'),
    },
    {
      icon: 'ph-github-logo',
      label: 'Abrir GitHub',
      keywords: 'github codigo repositorio',
      run: () => window.open(CONTACT.github, '_blank'),
    },
    {
      icon: 'ph-linkedin-logo',
      label: 'Abrir LinkedIn',
      keywords: 'linkedin perfil red',
      run: () => window.open(CONTACT.linkedin, '_blank'),
    },
  ], []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => (c.label + ' ' + c.keywords).toLowerCase().includes(q));
  }, [commands, query]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setIndex(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  useEffect(() => { setIndex(0); }, [query]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (!filtered.length) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); setIndex((i) => (i + 1) % filtered.length); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setIndex((i) => (i - 1 + filtered.length) % filtered.length); }
      if (e.key === 'Enter') {
        e.preventDefault();
        filtered[index]?.run();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, filtered, index, onClose]);

  if (!open) return null;

  return (
    <div className="cmd-palette" role="dialog" aria-modal="true">
      <div className="cmd-overlay" onClick={onClose} />
      <div className="cmd-dialog">
        <div className="cmd-header">
          <i className="ph ph-terminal-window" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Escribe un comando o busca..."
            autoComplete="off"
            spellCheck="false"
          />
          <span className="cmd-key-badge">ESC</span>
        </div>
        <ul className="cmd-list">
          {filtered.length === 0 && <li className="cmd-empty">Sin resultados</li>}
          {filtered.map((cmd, i) => (
            <li key={cmd.label}>
              <button
                className={`cmd-item${i === index ? ' selected' : ''}`}
                onMouseEnter={() => setIndex(i)}
                onClick={() => { cmd.run(); onClose(); }}
              >
                <i className={`ph ${cmd.icon}`} />
                <span>{cmd.label}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="cmd-footer">
          <span>Navegar <kbd>↑</kbd> <kbd>↓</kbd></span>
          <span>Seleccionar <kbd>Enter</kbd></span>
          <span>Cerrar <kbd>Esc</kbd></span>
        </div>
      </div>
    </div>
  );
}
