import { useEffect, useRef } from 'react';

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    // Solo para dispositivos con puntero fino (desktop)
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    let x = innerWidth / 2, y = innerHeight / 2;
    let rx = x, ry = y;
    let raf;
    let hovering = false;

    const onMove = (e) => {
      x = e.clientX; y = e.clientY;
      dot.style.transform = `translate(${x}px, ${y}px)`;
    };

    const tick = () => {
      rx += (x - rx) * 0.14;
      ry += (y - ry) * 0.14;
      ring.style.transform = `translate(${rx}px, ${ry}px) scale(${hovering ? 1.9 : 1})`;
      raf = requestAnimationFrame(tick);
    };

    const onOver = (e) => {
      hovering = !!e.target.closest('a, button, input, textarea, [data-hover]');
      ring.classList.toggle('cursor-hover', hovering);
    };

    document.documentElement.classList.add('has-custom-cursor');
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
