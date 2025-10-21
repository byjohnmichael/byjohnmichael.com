import React from 'react';
import { Link as CustomLink } from '../components/CustomLink';

const Skills: React.FC = () => {
    return (
        <div className="App">
            <nav className="nav-immediate" aria-label="Primary">
                <ul>
                    <li><CustomLink to="/skills">Skills</CustomLink></li>
                    <li><CustomLink to="/projects">Projects</CustomLink></li>
                    <li><CustomLink to="/" className="nav-brand">By John Michael</CustomLink></li>
                    <li><CustomLink to="/show">Show</CustomLink></li>
                    <li><CustomLink to="/donate">Donate</CustomLink></li>
                </ul>
            </nav>
            
            <section id="skills" className="projects-section">
                <div className="content-wrapper">
                    <div className="text-content">
                        <h2>Skills</h2>
                        <p>Technical expertise and creative capabilities that drive innovative solutions. From frontend development to backend architecture, each skill is refined through hands-on experience and continuous learning.</p>
                    </div>
                    <div className="image-content">
                        <div className="projects-grid">
                            {/* Skills placeholders - you can add actual skills here */}
                            <div className="project-item">
                                <div className="project-placeholder">
                                    <span>Frontend Development</span>
                                </div>
                            </div>
                            <div className="project-item">
                                <div className="project-placeholder">
                                    <span>Backend Architecture</span>
                                </div>
                            </div>
                            <div className="project-item">
                                <div className="project-placeholder">
                                    <span>UI/UX Design</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Skills;
