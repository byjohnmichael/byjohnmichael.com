import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PageLoader } from './components/PageLoader';
import { NavigationProvider } from './contexts/NavigationContext';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Skills from './pages/Skills';
import Show from './pages/Show';
import Donate from './pages/Donate';

function App(): React.ReactElement {
    return (
        <Router>
            <NavigationProvider>
                <PageLoader>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/skills" element={<Skills />} />
                        <Route path="/show" element={<Show />} />
                        <Route path="/donate" element={<Donate />} />
                    </Routes>
                </PageLoader>
            </NavigationProvider>
        </Router>
    );
}

export default App;