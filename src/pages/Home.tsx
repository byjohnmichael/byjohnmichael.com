import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigation } from '../contexts/NavigationContext';
import { Link as CustomLink } from '../components/CustomLink';

const IMAGE_SRC = process.env.PUBLIC_URL + '/images/intro.jpeg';
const SEATTLE_SRC = process.env.PUBLIC_URL + '/images/seattle.jpeg';
const PHILOSOPHY_VIDEO = process.env.PUBLIC_URL + '/videos/philosophy.mov';
const COLLABORATE_SRC = process.env.PUBLIC_URL + '/images/suit.jpeg';

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
        if (prefersReducedMotion) return 1500; // shorter but still noticeable
        return 2000; // 2 seconds
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
                    <nav className="final-nav animate" aria-label="Primary">
                        <ul>
                            <li><CustomLink to="/projects">Projects</CustomLink></li>
                            <li><CustomLink to="/" className="nav-brand">By John Michael</CustomLink></li>
                            <li><CustomLink to="/donate">Donate</CustomLink></li>
                        </ul>
                    </nav>
                    <div className="final-top animate">John Michael</div>
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
                <div className="final-bottom animate">Creative Director</div>
            )}
        </div>
    );
}

// Simple image display for when coming from navigation
function SimpleImageDisplay(): React.ReactElement {
    return (
        <div className="simple-image-display">
            <nav className="final-nav" aria-label="Primary">
                <ul>
                    <li><CustomLink to="/projects">Projects</CustomLink></li>
                    <li><CustomLink to="/" className="nav-brand">By John Michael</CustomLink></li>
                    <li><CustomLink to="/donate">Donate</CustomLink></li>
                </ul>
            </nav>
            <div className="final-top">John Michael</div>
            <div className="simple-image-container">
                <img 
                    src={IMAGE_SRC} 
                    alt="John Michael" 
                    className="simple-image"
                />
            </div>
            <div className="final-bottom">Creative Director</div>
        </div>
    );
}

const Home: React.FC = () => {
    const [seattleImageVisible, setSeattleImageVisible] = useState<boolean>(false);
    const [suitImageVisible, setSuitImageVisible] = useState<boolean>(false);
    const [videoVisible, setVideoVisible] = useState<boolean>(false);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [cameFromNavigation, setCameFromNavigation] = useState<boolean>(false);
    const { isNavigating, setIsNavigating } = useNavigation();
    const seattleImageRef = useRef<HTMLDivElement>(null);
    const suitImageRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLDivElement>(null);

    const scrollToNext = (): void => {
        const nextSection = document.getElementById('next-section');
        nextSection?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        // If we came from navigation, mark it and reset the navigation state immediately
        if (isNavigating) {
            setCameFromNavigation(true);
            setIsNavigating(false); // Reset immediately
        }
    }, [isNavigating, setIsNavigating]);

    useEffect(() => {
        // Prevent scrolling until loaded OR if we came from navigation
        if (!isLoaded && !cameFromNavigation) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isLoaded, cameFromNavigation]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    if (entry.target === seattleImageRef.current) {
                        setSeattleImageVisible(true);
                    } else if (entry.target === suitImageRef.current) {
                        setSuitImageVisible(true);
                    } else if (entry.target === videoRef.current) {
                        setVideoVisible(true);
                    }
                }
            },
            { threshold: 0.3 }
        );

        if (seattleImageRef.current) {
            observer.observe(seattleImageRef.current);
        }
        if (suitImageRef.current) {
            observer.observe(suitImageRef.current);
        }
        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div className="App">
            <div className="first-section">
                {cameFromNavigation ? (
                    <SimpleImageDisplay />
                ) : (
                    <LoadingReveal onLoadComplete={() => setIsLoaded(true)} />
                )}
                
                <a 
                    href="#next-section" 
                    className={`scroll-down ${isLoaded || cameFromNavigation ? 'fade-in' : ''}`} 
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
                        <p>Born in Seattle, surrounded by art, technology, and moody cityscapes, a mindset took shape that valued both creativity and precision. A fascination with technology turned into long hours of learning how things worked beneath the surface. Early on, my passion became clear: to blend art and technology into a single pursuit. In every project, each detail is refined until the work can be called complete.</p>
                    </div>
                    <div className="image-content" ref={seattleImageRef}>
                        <img 
                            src={SEATTLE_SRC} 
                            alt="Seattle skyline" 
                            className={`seattle-image ${seattleImageVisible ? 'fade-in' : ''}`}
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
                        <p>Design stands at the center of everything—it signals importance, value, and intent. Design thrives in tension. Resistance, patience, and resilience form the foundation of creative work. What looks like failure is often redirection—a quiet shift guiding the process toward clarity. The most compelling designs are not those untouched by difficulty but those refined in its presence.</p>
                    </div>
                </div>
            </section>

            <section id="next-section" className="next-section">
                <div className="content-wrapper">
                    <div className="text-content">
                        <h2>Authentically Me</h2>
                        <p>My pursuit of excellence is God-given; as a result, my life and work are rooted in my faith in the Lord Jesus Christ, who guides my path and decisions. Because of this, I hold myself to the highest standard of excellence—not only in the projects I create, but in the actions I take each day. I can confidently say that whether my actions are public or private, they reflect my values and faith in Him. That same conviction shapes how I create—every detail, seen and unseen, is crafted with care, integrity, and respect for the craft. Each work I complete bears my signature of integrity and devotion.</p>
                        <p>—By John Michael.</p>
                        <br/>
                        <p>To work with me, email me at <strong><a href="mailto:jm@byjohnmichael.com" style={{textDecoration: 'none', color: 'inherit'}}>jm@byjohnmichael.com</a></strong></p>
                    </div>
                    <div className="image-content" ref={suitImageRef}>
                        <img 
                            src={COLLABORATE_SRC} 
                            alt="John Michael in a suit" 
                            className={`suit-image ${suitImageVisible ? 'fade-in' : ''}`}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}; export default Home; // By John Michael