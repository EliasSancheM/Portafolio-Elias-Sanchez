export const NAV_LINKS = [
  { id: 'hero', label: 'Inicio' },
  { id: 'about', label: 'Sobre mí' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Proyectos' },
  { id: 'experience', label: 'Experiencia' },
  { id: 'contact', label: 'Contacto' },
];

export const HERO_STATS = [
  { target: 3, label: 'años exp.' },
  { target: 15, label: 'proyectos' },
  { target: 10, label: 'tecnologías' },
];

export const SKILL_CATEGORIES = [
  {
    title: 'Frontend',
    icon: 'ph-browser',
    skills: [
      { name: 'HTML5', level: 95, badge: 'AVANZADO', tier: 'adv', color: '#e34c26' },
      { name: 'CSS3 / Bootstrap', level: 90, badge: 'AVANZADO', tier: 'adv', color: '#2965f1' },
      { name: 'JS / jQuery', level: 85, badge: 'AVANZADO', tier: 'adv', color: '#f7df1e' },
      { name: 'VueJS', level: 88, badge: 'PRODUCCIÓN', tier: 'gold', color: '#4fc08d' },
      { name: 'AngularJS', level: 70, badge: 'MEDIO', tier: 'mid', color: '#dd0031' },
      { name: 'UX/UI · Responsive', level: 80, badge: 'AVANZADO', tier: 'adv', color: '#00d4aa' },
    ],
  },
  {
    title: 'Backend',
    icon: 'ph-hard-drives',
    skills: [
      { name: 'Node.js / Express', level: 85, badge: 'PRODUCCIÓN', tier: 'gold', color: '#339933' },
      { name: 'PHP', level: 75, badge: 'MEDIO', tier: 'mid', color: '#777bb4' },
      { name: 'MySQL', level: 80, badge: 'MEDIO', tier: 'mid', color: '#00758f' },
      { name: 'MongoDB', level: 75, badge: 'MEDIO', tier: 'mid', color: '#47a248' },
      { name: 'REST APIs', level: 82, badge: 'AVANZADO', tier: 'adv', color: '#ff6c37' },
    ],
  },
  {
    title: 'Herramientas',
    icon: 'ph-wrench',
    skills: [
      { name: 'Git / GitHub', level: 85, badge: 'AVANZADO', tier: 'adv', color: '#f05032' },
      { name: 'Docker', level: 60, badge: 'BÁSICO', tier: 'low', color: '#2496ed' },
      { name: 'VS Code', level: 92, badge: 'EXPERTO', tier: 'gold', color: '#007acc' },
      { name: 'Postman', level: 83, badge: 'AVANZADO', tier: 'adv', color: '#ff6c37' },
      { name: 'AI Tools', level: 80, badge: 'AVANZADO', tier: 'adv', color: '#ab63ff' },
    ],
  },
];

export const PROJECTS = [
  {
    number: '01',
    title: 'E-Commerce Dashboard',
    desc: 'Panel de administración para tienda online con gestión de productos, pedidos y analíticas en tiempo real.',
    tech: ['VueJS', 'Node.js', 'MongoDB', 'Express'],
    art: 'dashboard',
    hue: '#7c5cfc',
  },
  {
    number: '02',
    title: 'Sistema de Reservas',
    desc: 'Aplicación web para gestión de citas y reservas con notificaciones automáticas y panel de reportes.',
    tech: ['HTML5', 'Bootstrap', 'PHP', 'MySQL'],
    art: 'calendar',
    hue: '#00e5c3',
  },
  {
    number: '03',
    title: 'Landing Page Corporativa',
    desc: 'Sitio web responsivo para empresa con animaciones, formulario de contacto y optimización SEO.',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'GSAP'],
    art: 'landing',
    hue: '#ff2d78',
  },
  {
    number: '04',
    title: 'Portafolio 3D',
    desc: 'Este mismo portafolio — React Three Fiber, modelos glTF con Draco, GSAP ScrollTrigger y postprocesado WebGL.',
    tech: ['React', 'R3F', 'GSAP', 'Three.js'],
    art: 'orb',
    hue: '#00f5ff',
  },
];

export const TIMELINE = [
  {
    date: '2023 — Actualidad',
    badge: 'Remoto',
    badgeType: 'work',
    title: 'Desarrollador Full Stack Freelance',
    company: 'Autónomo',
    items: [
      'Desarrollo de soluciones web personalizadas para PYMEs',
      'Diseño e implementación de interfaces modernas y responsivas con VueJS, Bootstrap, HTML5 y CSS3',
      'Integración de APIs y desarrollo de lógica de negocio en Node.js y PHP',
      'Comunicación directa con clientes para levantar requerimientos y definir alcances',
      'Mantenimiento, optimización de rendimiento y mejoras continuas',
    ],
  },
  {
    date: '2023 — 2026',
    badge: 'Educación',
    badgeType: 'edu',
    title: 'Ingeniero en Informática',
    company: 'DuocUC',
    items: [
      'Formación integral en desarrollo de software y arquitectura de sistemas',
      'Proyectos académicos con metodologías ágiles y trabajo en equipo',
      'Especialización en tecnologías web modernas y bases de datos',
    ],
  },
];

export const CONTACT = {
  email: 'sanchezmendozae382@gmail.com',
  phone: '+56 9 4845 9924',
  phoneHref: 'tel:+56948459924',
  location: 'Chile · Disponible remoto',
  github: 'https://github.com/EliasSancheM',
  linkedin: 'https://www.linkedin.com/in/elias-sanchez-mendoza/',
  formspree: 'https://formspree.io/f/xnjrjzwl',
  cv: '/Elias Sanchez Mendoza.pdf',
};
