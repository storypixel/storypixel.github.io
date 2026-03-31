import React from 'react';
import { motion } from 'framer-motion';
import { Crown } from '@phosphor-icons/react';
import IdiotPopup from './IdiotPopup';
import './Hero.css';

const Hero = () => {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
            },
        },
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
            }
        },
    };

    return (
        <section className="hero-section">
            <motion.div
                className="hero-content"
                variants={container}
                initial="hidden"
                animate="show"
            >
                {/* Left: Selected Work Label */}
                <motion.div className="hero-left" variants={item}>
                    <span className="hero-label">Selected Work</span>
                    <span className="hero-years">2004 - Present</span>
                </motion.div>

                {/* Right: Headline */}
                <motion.div className="hero-quote-block" variants={item}>
                    <h1 className="hero-headline">
                        {"With so much power now brought by machines, we have to find a refuge in our humanity. It\u2019s about our creativity, our intuition, our human qualities."}
                    </h1>
                    <p className="hero-attribution">Garry Kasparov <IdiotPopup><Crown size={14} weight="fill" className="hero-skull" /></IdiotPopup></p>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Hero;
