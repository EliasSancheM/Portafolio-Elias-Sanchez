import { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';

const PHASES = ['INICIALIZANDO...', 'CARGANDO ESCENA 3D...', 'LISTO'];

export default function Loader() {
  const { progress } = useProgress(); // progreso real de los assets WebGL
  const [shown, setShown] = useState(0);
  const [gone, setGone] = useState(false);
  const [out, setOut] = useState(false);

  // El número mostrado persigue al progreso real para que nunca salte hacia atrás
  useEffect(() => {
    const id = setInterval(() => {
      setShown((s) => {
        const target = Math.max(progress, s);
        return s + (target - s) * 0.2 + 0.6 > target ? target : s + (target - s) * 0.2 + 0.6;
      });
    }, 50);
    return () => clearInterval(id);
  }, [progress]);

  useEffect(() => {
    if (shown >= 100) {
      const t1 = setTimeout(() => setOut(true), 350);
      const t2 = setTimeout(() => setGone(true), 1100);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [shown]);

  if (gone) return null;

  const pct = Math.min(100, Math.floor(shown));
  const phase = pct >= 100 ? PHASES[2] : pct >= 40 ? PHASES[1] : PHASES[0];

  return (
    <div className={`page-loader${out ? ' loader-out' : ''}`} aria-hidden="true">
      <div className="loader-inner">
        <div className="loader-logo"><span>&lt;</span>ESM<span>/&gt;</span></div>
        <div className="loader-text">{phase}</div>
        <div className="loader-bar"><div className="loader-bar-fill" style={{ width: `${pct}%` }} /></div>
        <div className="loader-percent">{pct}%</div>
      </div>
    </div>
  );
}
