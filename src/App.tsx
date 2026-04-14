import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Projects from './pages/Projects';
import Donate from './pages/Donate';
import Home from './pages/Home';
import React from 'react';

function App(): React.ReactElement {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/donate" element={<Donate />} />
            </Routes>
        </Router>
    );
} export default App; // By John Michael
