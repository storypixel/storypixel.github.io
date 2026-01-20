import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const About = () => {
    const sideProjects = [
        { name: 'H-E-B Digital', url: 'https://digital.heb.com' },
        { name: 'GitHub', url: 'https://github.com/storypixel' },
        { name: 'Medium', url: 'https://medium.com/@samwilson_73699' },
    ];

    return (
        <section style={{
            padding: '10vh var(--spacing-container)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4rem',
            alignItems: 'center',
            borderTop: '1px solid #222',
            marginTop: '4rem'
        }}>
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <h2 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                    About
                </h2>
                <h3 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: '1.2', marginBottom: '2rem' }}>
                    Hey, I'm Sam Wilson.
                </h3>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '45ch', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    (But my real name is Jeremy). I'm a developer living in Austin, Texas. I help craft online experiences using code, creativity, and a bit of obsession with user experience.
                </p>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '45ch', marginBottom: '2rem', lineHeight: '1.6' }}>
                    Currently working at H-E-B Digital where I help connect customers to their goals through thoughtful digital experiences.
                </p>

                <div style={{ marginTop: '2rem' }}>
                    <p style={{
                        fontSize: '12px',
                        color: 'var(--text-secondary)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '1rem',
                    }}>
                        More
                    </p>
                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                        {sideProjects.map((project) => (
                            <a
                                key={project.name}
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    fontSize: '0.9rem',
                                    borderBottom: '1px solid #444',
                                    paddingBottom: '4px',
                                    transition: 'border-color 0.3s ease',
                                }}
                                onMouseEnter={(e) => e.target.style.borderColor = '#fff'}
                                onMouseLeave={(e) => e.target.style.borderColor = '#444'}
                            >
                                {project.name}
                            </a>
                        ))}
                    </div>
                </div>

                <Link to="/about" style={{
                    display: 'inline-block',
                    marginTop: '2rem',
                    borderBottom: '1px solid #fff',
                    paddingBottom: '4px',
                    fontSize: '0.9rem'
                }}>
                    Read full story
                </Link>
            </motion.div>

            <motion.div
                style={{
                    width: '100%',
                    aspectRatio: '1',
                    background: '#222',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <img
                    src="/not-sam.svg"
                    alt="Sam Wilson"
                    style={{ width: '60%', height: 'auto', opacity: 0.8 }}
                />
            </motion.div>
        </section>
    );
};

export default About;
