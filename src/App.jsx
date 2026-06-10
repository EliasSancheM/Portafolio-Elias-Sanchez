import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Experience from './components/three/Experience.jsx';
import Loader from './components/Loader.jsx';
import Navbar from './components/Navbar.jsx';
import Cursor from './components/Cursor.jsx';
import CommandPalette from './components/CommandPalette.jsx';
import Hero from './components/sections/Hero.jsx';
import About from './components/sections/About.jsx';
import Skills from './components/sections/Skills.jsx';
import Projects from './components/sections/Projects.jsx';
import Timeline from './components/sections/Timeline.jsx';
import Contact from './components/sections/Contact.jsx';
import Footer from './components/sections/Footer.jsx';
import { initSmoothScroll, gsap, ScrollTrigger } from './lib/scroll.js';

export default function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    initSmoothScroll();

    // Reveals genéricos: todo elemento con data-reveal entra con fade+rise
    const ctx = gsap.context(() => {
      document.querySelectorAll('[data-reveal]').forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 36 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            delay: parseFloat(el.dataset.delay || '0'),
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          }
        );
      });
    });

    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);

    // Recalcular triggers cuando carguen fuentes/imágenes
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);

    return () => {
      ctx.revert();
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('load', onLoad);
    };
  }, []);

  return (
    <>
      <Loader />
      <Cursor />

      <div className="webgl-wrap" aria-hidden="true">
        <Canvas
          dpr={[1, 1.75]}
          gl={{ antialias: false, powerPreference: 'high-performance' }}
          camera={{ fov: 42, position: [0, 0, 7.5] }}
        >
          <Suspense fallback={null}>
            <Experience />
          </Suspense>
        </Canvas>
      </div>

      <Navbar onOpenPalette={() => setPaletteOpen(true)} />

      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Timeline />
        <Contact />
      </main>

      <Footer />

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}
