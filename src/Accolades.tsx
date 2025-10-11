import React from 'react';

const Accolades: React.FC = () => {
    return (
        <section id="accolades" className="accolades-section">
            <div className="content-wrapper">
                <div className="text-content">
                    <h2>Accolades</h2>
                    <p>Recognition and achievements that reflect dedication to excellence in design and technology. These accolades represent milestones in a journey of continuous learning and creative innovation.</p>
                </div>
                <div className="image-content">
                    <div className="accolades-list">
                        {/* Accolades placeholders - you can add actual accolades here */}
                        <div className="accolade-item">
                            <div className="accolade-placeholder">
                                <span>Award 2024</span>
                            </div>
                        </div>
                        <div className="accolade-item">
                            <div className="accolade-placeholder">
                                <span>Recognition 2023</span>
                            </div>
                        </div>
                        <div className="accolade-item">
                            <div className="accolade-placeholder">
                                <span>Achievement 2022</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Accolades;
