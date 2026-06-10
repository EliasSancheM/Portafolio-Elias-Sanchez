export function initCommandPalette() {
  const palette = document.getElementById('cmd-palette');
  const input = document.getElementById('cmd-input');
  const list = document.getElementById('cmd-list');
  const openBtn = document.getElementById('cmd-palette-btn');
  
  if (!palette || !input || !list) return;

  const commands = [
    { id: 'nav-hero', title: 'Ir a Inicio', category: 'Navegación', shortcut: 'G H', icon: 'ph-house', action: () => scrollToSection('#hero') },
    { id: 'nav-about', title: 'Ir a Sobre mí', category: 'Navegación', shortcut: 'G A', icon: 'ph-user', action: () => scrollToSection('#about') },
    { id: 'nav-skills', title: 'Ir a Skills', category: 'Navegación', shortcut: 'G S', icon: 'ph-lightning', action: () => scrollToSection('#skills') },
    { id: 'nav-projects', title: 'Ir a Proyectos', category: 'Navegación', shortcut: 'G P', icon: 'ph-folder-open', action: () => scrollToSection('#projects') },
    { id: 'nav-experience', title: 'Ir a Experiencia', category: 'Navegación', shortcut: 'G E', icon: 'ph-briefcase', action: () => scrollToSection('#experience') },
    { id: 'nav-contact', title: 'Ir a Contacto', category: 'Navegación', shortcut: 'G C', icon: 'ph-envelope', action: () => scrollToSection('#contact') },
    { id: 'action-cv', title: 'Descargar CV (PDF)', category: 'Acciones', shortcut: 'D C', icon: 'ph-file-pdf', action: () => downloadCV() },
    { id: 'action-email', title: 'Copiar correo de contacto', category: 'Acciones', shortcut: 'C E', icon: 'ph-copy', action: () => copyEmail() },
    { id: 'action-theme', title: 'Tema Matrix Neon / Cyberpunk', category: 'Estilo', shortcut: 'T M', icon: 'ph-alien', action: () => toggleCyberTheme() },
    { id: 'action-close', title: 'Cerrar consola', category: 'Sistema', shortcut: 'ESC', icon: 'ph-x', action: () => closePalette() }
  ];

  let selectedIndex = 0;
  let filteredCommands = [...commands];

  function scrollToSection(selector) {
    const target = document.querySelector(selector);
    if (target) {
      closePalette();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
      const top = target.offsetTop - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  function downloadCV() {
    closePalette();
    const link = document.createElement('a');
    link.href = '/Elias Sanchez Mendoza.pdf';
    link.download = 'Elias Sanchez Mendoza.pdf';
    link.click();
  }

  function copyEmail() {
    closePalette();
    navigator.clipboard.writeText('sanchezmendozae382@gmail.com').then(() => {
      const btn = document.getElementById('copy-email-btn');
      if (btn) btn.click(); // Reuse visual copying alert
    });
  }

  function toggleCyberTheme() {
    closePalette();
    document.body.classList.toggle('theme-cyber');
    const isActive = document.body.classList.contains('theme-cyber');
    localStorage.setItem('theme-cyber', isActive ? 'true' : 'false');
  }

  // Restore theme on load
  if (localStorage.getItem('theme-cyber') === 'true') {
    document.body.classList.add('theme-cyber');
  }

  function openPalette() {
    palette.classList.add('open');
    palette.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    input.value = '';
    selectedIndex = 0;
    filterCommands('');
    setTimeout(() => input.focus(), 100);
  }

  function closePalette() {
    palette.classList.remove('open');
    palette.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    input.blur();
  }

  function filterCommands(query) {
    const cleanQuery = query.toLowerCase().trim();
    if (!cleanQuery) {
      filteredCommands = [...commands];
    } else {
      filteredCommands = commands.filter(cmd => 
        cmd.title.toLowerCase().includes(cleanQuery) || 
        cmd.category.toLowerCase().includes(cleanQuery)
      );
    }
    selectedIndex = 0;
    renderList();
  }

  function renderList() {
    list.innerHTML = '';
    
    if (filteredCommands.length === 0) {
      list.innerHTML = `<li class="cmd-no-results">No se encontraron resultados para "${input.value}"</li>`;
      return;
    }

    filteredCommands.forEach((cmd, index) => {
      const li = document.createElement('li');
      li.className = `cmd-item ${index === selectedIndex ? 'active' : ''}`;
      li.innerHTML = `
        <div class="cmd-item-left">
          <i class="ph ${cmd.icon}"></i>
          <div class="cmd-item-info">
            <span class="cmd-item-title">${cmd.title}</span>
            <span class="cmd-item-category">${cmd.category}</span>
          </div>
        </div>
        <div class="cmd-item-right">
          <kbd class="cmd-kbd">${cmd.shortcut}</kbd>
        </div>
      `;

      li.addEventListener('click', () => {
        cmd.action();
      });

      li.addEventListener('mouseenter', () => {
        selectedIndex = index;
        document.querySelectorAll('.cmd-item').forEach((item, idx) => {
          item.classList.toggle('active', idx === selectedIndex);
        });
      });

      list.appendChild(li);
    });

    const activeItem = list.children[selectedIndex];
    if (activeItem) {
      activeItem.scrollIntoView({ block: 'nearest' });
    }
  }

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (palette.classList.contains('open')) {
        closePalette();
      } else {
        openPalette();
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && palette.classList.contains('open')) {
      closePalette();
    }
  });

  input.addEventListener('keydown', (e) => {
    if (!palette.classList.contains('open')) return;
    if (filteredCommands.length === 0) return; // evita módulo por cero con 0 resultados

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % filteredCommands.length;
      renderList();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + filteredCommands.length) % filteredCommands.length;
      renderList();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    }
  });

  input.addEventListener('input', (e) => {
    filterCommands(e.target.value);
  });

  openBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    openPalette();
  });

  palette.querySelector('.cmd-overlay')?.addEventListener('click', () => {
    closePalette();
  });
}
