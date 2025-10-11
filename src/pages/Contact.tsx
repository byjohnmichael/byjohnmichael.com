import React from 'react';
import { Link } from 'react-router-dom';

const Contact: React.FC = () => {
    return (
        <div className="App">
            <nav className="nav-immediate" aria-label="Primary">
                <ul>
                    <li><Link to="/projects">Projects</Link></li>
                    <li><Link to="/accolades">Accolades</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                </ul>
            </nav>
            
            <section id="contact" className="contact-section">
                <div className="content-wrapper">
                    <div className="text-content">
                        <h2>Contact</h2>
                        <p>Ready to collaborate on your next project? Let's discuss how we can bring your vision to life through thoughtful design and seamless technology integration. Reach out to start the conversation.</p>
                    </div>
                    <div className="image-content">
                        <div className="contact-form">
                            <form>
                                <div className="form-group">
                                    <label htmlFor="name">Name</label>
                                    <input type="text" id="name" name="name" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" id="email" name="email" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="message">Message</label>
                                    <textarea id="message" name="message" rows={5}></textarea>
                                </div>
                                <button type="submit" className="submit-button">
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
