import { useEffect, useRef } from 'react';

/** Tilt 3D ligero por mousemove, sin dependencias. */
export function useTilt({ max = 10, scale = 1.02, perspective = 900 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia('(pointer: fine)').matches) return;

    let raf = 0;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform =
          `perspective(${perspective}px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`;
        el.style.setProperty('--sheen-x', `${(px + 0.5) * 100}%`);
        el.style.setProperty('--sheen-y', `${(py + 0.5) * 100}%`);
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    };

    el.style.transition = 'transform 0.25s ease-out';
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, [max, scale, perspective]);

  return ref;
}
