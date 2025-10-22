import React from 'react';
import { Link as CustomLink } from '../components/CustomLink';

const Projects: React.FC = () => {
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
                    <div className="text-content">
                        <h2>Projects</h2>
                        <p>Explore a collection of custom websites and digital experiences that showcase the intersection of design and technology. Each project represents a unique challenge solved through careful attention to detail, user experience, and seamless backend integration.</p>
                    </div>
                    <div className="image-content">
                        <div className="projects-grid">
                            {/* Project placeholders - you can add actual project content here */}
                            <div className="project-item">
                                <div className="project-placeholder">
                                    <span>Project 1</span>
                                </div>
                            </div>
                            <div className="project-item">
                                <div className="project-placeholder">
                                    <span>Project 2</span>
                                </div>
                            </div>
                            <div className="project-item">
                                <div className="project-placeholder">
                                    <span>Project 3</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Projects;
