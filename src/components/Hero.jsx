import React from 'react';
import { motion } from 'framer-motion';

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
                ease: [0.16, 1, 0.3, 1], // Custom bezier for premium feel
            }
        },
    };

    return (
        <section style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 var(--spacing-container)',
        }}>
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
            >
                <motion.p variants={item} style={{
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '2rem'
                }}>
                    Sam Wilson — Portfolio
                </motion.p>

                <motion.h1 variants={item} style={{
                    fontSize: 'clamp(3rem, 8vw, 6rem)',
                    lineHeight: '1.1',
                    fontWeight: '500',
                    maxWidth: '20ch',
                    letterSpacing: '-0.02em',
                }}>
                    I make apps and stuff on the internet.
                </motion.h1>
            </motion.div>
        </section>
    );
};

export default Hero;
