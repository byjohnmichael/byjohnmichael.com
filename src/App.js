import './App.css';
import { useEffect, useMemo, useRef, useState } from 'react';

const IMAGE_SRC = process.env.PUBLIC_URL + '/ProPic.jpeg';

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(!!mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);
  return reduced;
}

function LoadingReveal() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [progress, setProgress] = useState(0); // 0..1
  const [phase, setPhase] = useState('loading'); // 'loading' | 'text-fade' | 'expanding' | 'done'
  const rafRef = useRef(null);
  const startRef = useRef(null);

  const duration = useMemo(() => {
    if (prefersReducedMotion) return 2500; // shorter but still noticeable
    return 5200 + Math.random() * 800; // ≥5s
  }, [prefersReducedMotion]);

  useEffect(() => {
    function tick(now) {
      if (!startRef.current) startRef.current = now;
      const elapsed = now - startRef.current;
      const t = Math.min(elapsed / duration, 1);

      // Ease with gentle bumps unless reduced motion
      let eased;
      if (prefersReducedMotion) {
        // smooth ease-out
        eased = 1 - Math.pow(1 - t, 2);
      } else {
        // smooth, non-linear, not jagged: base ease with gentle, continuous undulation
        const base = 1 - Math.pow(1 - t, 3); // cubic ease-out
        const undulation = 0.015 * Math.sin(2 * Math.PI * 1.2 * t) + 0.008 * Math.sin(2 * Math.PI * 2.1 * t * t);
        eased = Math.min(1, Math.max(0, base + undulation));
      }

      setProgress(eased);
      if (t >= 1) {
        cancelAnimationFrame(rafRef.current);
        // 1) fade out LOADING… (about 1s)
        setPhase('text-fade');
        // 2) after fade completes, start expansion
        setTimeout(() => setPhase('expanding'), prefersReducedMotion ? 200 : 1000);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [duration, prefersReducedMotion]);

  return (
    <div className="loader-stage">
      <div className={`loading-group ${phase !== 'loading' ? 'fade-out' : ''}`} aria-hidden={phase !== 'loading'}>
        <div className="loading-text" role="status" aria-live="polite" aria-atomic="true">
          <span className="word">LOADING</span>
          <span className="dots" aria-hidden="true">
            <span>.</span><span>.</span><span>.</span>
          </span>
        </div>
      </div>

      {phase === 'done' && (
        <>
          <nav className="final-nav" aria-label="Primary">
            <ul>
              <li><a href="#projects">Projects</a></li>
              <li><a href="#accolades">Accolades</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </nav>
          <div className="final-top">John Michael</div>
        </>
      )}

      <div className="frame">
        <div
          className={`image-bar ${phase !== 'loading' ? 'expand' : ''}`}
          style={{
            backgroundImage: `url(${IMAGE_SRC})`,
            width: `${Math.max(0, Math.min(100, progress * 100))}%`,
            '--expand-dur': prefersReducedMotion ? '600ms' : '1600ms'
          }}
          onTransitionEnd={() => phase === 'expanding' && setPhase('done')}
        >
          <div className={`blackout ${phase !== 'loading' ? 'transparent' : ''}`} />
        </div>
      </div>

      {phase === 'done' && (
        <div className="final-bottom">Creative Director</div>
      )}
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <LoadingReveal />
    </div>
  );
}

export default App;
