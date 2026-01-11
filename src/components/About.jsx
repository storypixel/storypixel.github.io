import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <section style={{
            padding: '10vh var(--spacing-container)',
            display: 'block',
            maxWidth: '800px',
            margin: '4rem auto',
            borderTop: '1px solid #222',
        }}>
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <h2 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                    About Me
                </h2>
                <h3 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: '1.2', marginBottom: '2rem' }}>
                    Hey, I'm Sam Wilson.
                </h3>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '40ch', marginBottom: '2rem' }}>
                    (But my real name is Jeremy). I'm a developer living in Austin, Texas. I help craft online experiences using code, creativity, and a bit of obsession with user experience.
                </p>
                <Link to="/about" style={{
                    display: 'inline-block',
                    borderBottom: '1px solid #fff',
                    paddingBottom: '4px',
                    fontSize: '0.9rem'
                }}>
                    Read full story
                </Link>
            </motion.div>


        </section>
    );
};

export default About;
