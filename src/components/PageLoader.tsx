import { useNavigation } from '../contexts/NavigationContext';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface PageLoaderProps {
    children: React.ReactNode;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ children }) => {
    const [phase, setPhase] = useState<'loading' | 'fade-out' | 'done'>('loading');
    const [contentVisible, setContentVisible] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const { isNavigating } = useNavigation();
    const location = useLocation();

    useEffect(() => {
        // If user is navigating (clicked a link), skip loading
        if (isNavigating) {
            setIsLoading(false);
            setIsInitialLoad(false);
            setContentVisible(true);
            return;
        }

        // Only show loading on initial page load/reload for non-homepage routes
        if (isInitialLoad && location.pathname !== '/') {
            // Start animation immediately
            const duration = 2000;
            const startTime = performance.now();
            
            const animate = (currentTime: number) => {
                const elapsed = currentTime - startTime;
                const t = Math.min(elapsed / duration, 1);
                
                // Use same easing as homepage
                const base = 1 - Math.pow(1 - t, 3);
                const undulation = 0.015 * Math.sin(2 * Math.PI * 1.2 * t) + 0.008 * Math.sin(2 * Math.PI * 2.1 * t * t);
                const eased = Math.min(1, Math.max(0, base + undulation));
                
                setProgress(eased);
                
                if (t >= 1) {
                    setPhase('fade-out');
                    setTimeout(() => {
                    setIsLoading(false);
                    setIsInitialLoad(false);
                    setPhase('done');
                    // Start content fade-in after loader disappears
                    setTimeout(() => {
                        setContentVisible(true);
                    }, 100);
                    }, 400);
                    return;
                }
                
                requestAnimationFrame(animate);
            };
            
            // Start animation immediately
            requestAnimationFrame(animate);
        } else if (location.pathname === '/') {
            // For homepage, don't show loading (it has its own animation)
            setIsLoading(false);
            setIsInitialLoad(false);
            setContentVisible(true);
        }
    }, [isInitialLoad, isNavigating, location.pathname]);

    // Show loading for non-homepage routes
    if (isLoading && isInitialLoad && location.pathname !== '/') {
        return (
            <div className={`page-loader-stage ${phase === 'fade-out' ? 'fade-out' : ''}`}>
                <div className={`loading-group ${phase !== 'loading' ? 'fade-out' : ''}`} aria-hidden={phase !== 'loading'}>
                    <div className="loading-text" role="status" aria-live="polite" aria-atomic="true">
                        <span className="word">LOADING</span>
                        <span className="dots" aria-hidden="true">
                            <span>.</span><span>.</span><span>.</span>
                        </span>
                    </div>
                </div>
                <div className="page-frame">
                    <div className="page-image-bar" style={{ width: `${Math.max(0, Math.min(100, progress * 100))}%`,}}>
                        <div className="page-blackout" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`page-content ${contentVisible ? 'fade-in' : ''}`}>
            {children}
        </div>
    );
}; // By John Michael