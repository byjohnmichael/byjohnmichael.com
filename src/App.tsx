import './App.css';
import React, { useEffect, useMemo, useRef, useState } from 'react';

const IMAGE_SRC = process.env.PUBLIC_URL + '/images/intro.jpeg';
const SEATTLE_SRC = process.env.PUBLIC_URL + '/seattle.jpeg';
const PHILOSOPHY_VIDEO = process.env.PUBLIC_URL + '/videos/philosophy.mov';

interface LoadingRevealProps {
    onLoadComplete?: () => void;
}

type LoadingPhase = 'loading' | 'text-fade' | 'expanding' | 'done';

function usePrefersReducedMotion(): boolean {
    const [reduced, setReduced] = useState<boolean>(false);
    
    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => setReduced(!!mq.matches);
        update();
        mq.addEventListener?.('change', update);
        return () => mq.removeEventListener?.('change', update);
    }, []);
    
    return reduced;
}

function LoadingReveal({ onLoadComplete }: LoadingRevealProps): React.ReactElement {
    const prefersReducedMotion = usePrefersReducedMotion();
    const [progress, setProgress] = useState<number>(0); // 0..1
    const [phase, setPhase] = useState<LoadingPhase>('loading');
    const rafRef = useRef<number | null>(null);
    const startRef = useRef<number | null>(null);

    const duration = useMemo(() => {
        if (prefersReducedMotion) return 2500; // shorter but still noticeable
        return 5200 + Math.random() * 800; // ≥5s
    }, [prefersReducedMotion]);

    useEffect(() => {
        function tick(now: number) {
            if (!startRef.current) startRef.current = now;
            const elapsed = now - startRef.current;
            const t = Math.min(elapsed / duration, 1);

            // Ease with gentle bumps unless reduced motion
            let eased: number;
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
                cancelAnimationFrame(rafRef.current!);
                // 1) fade out LOADING… (about 1s)
                setPhase('text-fade');
                // 2) after fade completes, start expansion
                setTimeout(() => setPhase('expanding'), prefersReducedMotion ? 200 : 1000);
                return;
            }
            rafRef.current = requestAnimationFrame(tick);
        }
        rafRef.current = requestAnimationFrame(tick);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
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
                    } as React.CSSProperties}
                    onTransitionEnd={() => {
                        if (phase === 'expanding') {
                            setPhase('done');
                            onLoadComplete?.();
                        }
                    }}
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

function App(): React.ReactElement {
    const [imageVisible, setImageVisible] = useState<boolean>(false);
    const [videoVisible, setVideoVisible] = useState<boolean>(false);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const imageRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLDivElement>(null);

    const scrollToNext = (): void => {
        const nextSection = document.getElementById('next-section');
        nextSection?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        // Prevent scrolling until loaded
        if (!isLoaded) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isLoaded]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    if (entry.target === imageRef.current) {
                        setImageVisible(true);
                    } else if (entry.target === videoRef.current) {
                        setVideoVisible(true);
                    }
                }
            },
            { threshold: 0.3 }
        );

        if (imageRef.current) {
            observer.observe(imageRef.current);
        }
        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div className="App">
            <div className="first-section">
                <LoadingReveal onLoadComplete={() => setIsLoaded(true)} />
                
                <a 
                    href="#next-section" 
                    className={`scroll-down ${isLoaded ? 'fade-in' : ''}`} 
                    onClick={(e) => { 
                        e.preventDefault(); 
                        scrollToNext(); 
                    }} 
                    aria-label="Scroll to next section"
                >
                    <span className="sr-only">Scroll down</span>
                </a>
            </div>
            
            <section id="next-section" className="next-section">
                <div className="content-wrapper">
                    <div className="text-content">
                        <h2>John Michael</h2>
                        <p>Born in Seattle, surrounded by art, technology, and rain, a mindset took shape that valued both creativity and precision. A fascination with technology turned into long hours of learning how things worked beneath the surface of code. Early on, my passion became clear: to blend art and technology into a single pursuit. In every project, each detail is refined with a perfectionist’s eye until the work is complete.</p>
                    </div>
                    <div className="image-content" ref={imageRef}>
                        <img 
                            src={SEATTLE_SRC} 
                            alt="Seattle skyline" 
                            className={`seattle-image ${imageVisible ? 'fade-in' : ''}`}
                        />
                    </div>
                </div>
            </section>

            <section id="philosophy-section" className="philosophy-section">
                <div className="content-wrapper philosophy-layout">
                    <div className="video-content" ref={videoRef}>
                        <video 
                            className={`philosophy-video ${videoVisible ? 'fade-in' : ''}`}
                            controls
                            muted
                            loop
                        >
                            <source src={PHILOSOPHY_VIDEO} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                    <div className="text-content philosophy-text">
                        <h2>Philosophy</h2>
                        <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default App;
