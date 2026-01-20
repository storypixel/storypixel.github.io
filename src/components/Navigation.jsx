import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Navigation.css';

const Navigation = () => {
    return (
        <motion.nav
            className="main-nav"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
        >
            {/* Left: Name */}
            <Link to="/" className="nav-name">
                Sam Wilson
            </Link>

            {/* Center: Location & Role */}
            <div className="nav-info">
                <span>Austin, TX</span>
                <span>Artist</span>
            </div>

            {/* Right: Navigation Links */}
            <div className="nav-links">
                <a href="mailto:jeremy@storypixel.io" className="nav-link">
                    Email <span className="nav-arrow">┐</span>
                </a>
                <Link to="/about" className="nav-link">
                    About <span className="nav-arrow">┐</span>
                </Link>
            </div>
        </motion.nav>
    );
};

export default Navigation;
