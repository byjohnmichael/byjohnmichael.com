import React, { useRef, MouseEvent, useEffect } from 'react';
import { Link as CustomLink } from '../components/CustomLink';

const Projects: React.FC = () => {
    const imageRefs = useRef<(HTMLImageElement | null)[]>([null, null]);
    const animationFrameRefs = useRef<(number | undefined)[]>([undefined, undefined]);

    useEffect(() => {
        return () => {
            animationFrameRefs.current.forEach(frame => {
                if (frame) {
                    cancelAnimationFrame(frame);
                }
            });
        };
    }, []);

    const handleMouseMove = (event: MouseEvent<HTMLImageElement>, imageIndex: number) => {
        if (animationFrameRefs.current[imageIndex]) {
            cancelAnimationFrame(animationFrameRefs.current[imageIndex]!);
        }

        animationFrameRefs.current[imageIndex] = requestAnimationFrame(() => {
            const rect = imageRefs.current[imageIndex]?.getBoundingClientRect();
            if (!rect) return;

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const px = (x / rect.width - 0.5) * 2; // -1..1
            const py = (y / rect.height - 0.5) * 2; // -1..1

            const rotateX = Math.max(-1, Math.min(1, -py)) * 6; // clamp and scale
            const rotateY = Math.max(-1, Math.min(1, px)) * 6;
            const translateX = px * 6;
            const translateY = py * 6;

            if (imageRefs.current[imageIndex]) {
                imageRefs.current[imageIndex]!.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate(${translateX}px, ${translateY}px)`;
                imageRefs.current[imageIndex]!.style.boxShadow = `${-rotateY * 2}px ${rotateX * 2 + 12}px 40px rgba(0, 0, 0, 0.2)`;
            }
        });
    };

    const handleMouseLeave = (imageIndex: number) => {
        if (animationFrameRefs.current[imageIndex]) {
            cancelAnimationFrame(animationFrameRefs.current[imageIndex]!);
        }
        
        if (imageRefs.current[imageIndex]) {
            imageRefs.current[imageIndex]!.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translate(0, 0)';
            imageRefs.current[imageIndex]!.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.18)';
        }
    };

    return (
        <div className="App">
            <nav className="nav-immediate" aria-label="Primary">
                <ul>
                    <li><CustomLink to="/projects">Projects</CustomLink></li>
                    <li><CustomLink to="/" className="nav-brand">By John Michael</CustomLink></li>
                    <li><CustomLink to="/donate">Donate</CustomLink></li>
                </ul>
            </nav>
            
            <section id="projects" className="projects-section">
                <div className="content-wrapper">
                    {/* Juan Zhingre Project */}
                    <div className="project-item">
                        <div className="project-content">
                            <div className="project-text">
                                <h2>
                                    <a href="https://juanzhingre.com" target="_blank" rel="noopener noreferrer" className="project-link">juanzhingre.com</a>
                                    <sup><a href="https://github.com/byjohnmichael/juanzhingre.com" target="_blank" rel="noopener noreferrer" className="version-link">1.1.1</a></sup>
                                </h2>
                                <p>A personal portfolio for Juan Zhingre that highlights his music, photography, and barbering services. Built in close collaboration with Juan, the site blends an indie aesthetic with a nostalgic Windows 98–inspired design. It features a booking system for barber appointments and serves as a creative showcase of his artistic identity.</p>
                                <div className="project-tags">
                                    <span><strong>Typescript</strong></span>
                                    <span><strong>SQL</strong></span>
                                    <span><strong>SMS</strong></span>
                                    <span><strong>Appointment System</strong></span>
                                </div>
                            </div>
                            <div className="project-image">
                                <img 
                                    ref={(el) => { imageRefs.current[0] = el; }}
                                    src="/images/projects/juanzhingre.com.png" 
                                    alt="Juan Zhingre website screenshot" 
                                    className="project-screenshot"
                                    onMouseMove={(e) => handleMouseMove(e, 0)}
                                    onMouseLeave={() => handleMouseLeave(0)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* By John Michael Project */}
                    <div className="project-item">
                        <div className="project-content">
                            <div className="project-text">
                                <h2>
                                    <a href="https://byjohnmichael.com" target="_blank" rel="noopener noreferrer" className="project-link">byjohnmichael.com</a>
                                    <sup><a href="https://github.com/byjohnmichael/byjohnmichael.com" target="_blank" rel="noopener noreferrer" className="version-link">1.0.0</a></sup>
                                </h2>
                                <p>A digital space expressing John Michael's creative identity and projects. Built with a minimalist approach, it reflects his focus on precision, clarity, and deliberate design. The layout emphasizes balance and restraint, highlighting his dedication to clean structure and thoughtful visual rhythm. It stands as both a reflection of his process and a platform for his evolving body of work.</p>
                                <div className="project-tags">
                                    <span><strong>Typescript</strong></span>
                                    <span><strong>CSS</strong></span>
                                    <span><strong>Cryptocurrency</strong></span>
                                </div>
                            </div>
                            <div className="project-image">
                                <img 
                                    ref={(el) => { imageRefs.current[1] = el; }}
                                    src="/images/projects/byjohnmichael.com.png" 
                                    alt="By John Michael website screenshot" 
                                    className="project-screenshot"
                                    onMouseMove={(e) => handleMouseMove(e, 1)}
                                    onMouseLeave={() => handleMouseLeave(1)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Projects;

