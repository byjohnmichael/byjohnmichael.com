import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NavigationProvider } from './contexts/NavigationContext';
import { PageLoader } from './components/PageLoader';
import Projects from './pages/Projects';
import Donate from './pages/Donate';
import Home from './pages/Home';
import React from 'react';
import './App.css';

function App(): React.ReactElement {
    return (
        <Router>
            <NavigationProvider>
                <PageLoader>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/donate" element={<Donate />} />
                    </Routes>
                </PageLoader>
            </NavigationProvider>
        </Router>
    );
} export default App; // By John Michael