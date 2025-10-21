import React from 'react';
import { Link as CustomLink } from '../components/CustomLink';

const Show: React.FC = () => {
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
            
            <section id="show" className="projects-section">
                <div className="content-wrapper">
                    <div className="text-content">
                        <h2>Show</h2>
                        <p>A curated collection of creative work, design explorations, and visual storytelling. This space showcases the intersection of art and technology through carefully crafted experiences and thoughtful design.</p>
                    </div>
                    <div className="image-content">
                        <div className="projects-grid">
                            {/* Show placeholders - you can add actual show content here */}
                            <div className="project-item">
                                <div className="project-placeholder">
                                    <span>Design Gallery</span>
                                </div>
                            </div>
                            <div className="project-item">
                                <div className="project-placeholder">
                                    <span>Visual Stories</span>
                                </div>
                            </div>
                            <div className="project-item">
                                <div className="project-placeholder">
                                    <span>Creative Process</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Show;
