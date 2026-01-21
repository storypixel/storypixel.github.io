import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
    return (
        <footer style={{
            padding: '10vh var(--spacing-container)',
            borderTop: '1px solid #222',
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <div>
                    <p style={{
                        fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                        fontWeight: '400',
                        lineHeight: '1.3',
                        marginBottom: '1rem',
                    }}>
                        Thanks for stopping by.
                    </p>
                    <a
                        href="mailto:sam@iamnotsam.com?subject=Hello"
                        style={{
                            display: 'inline-block',
                            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                            fontWeight: '400',
                            borderBottom: '2px solid #fff',
                            paddingBottom: '4px',
                            transition: 'opacity 0.3s ease',
                        }}
                        onMouseEnter={(e) => e.target.style.opacity = '0.7'}
                        onMouseLeave={(e) => e.target.style.opacity = '1'}
                    >
                        Say hello
                    </a>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: '2rem',
                        borderTop: '1px solid #222',
                        marginTop: '4rem',
                        flexWrap: 'wrap',
                        gap: '1rem'
                    }}
                >
                    <span style={{
                        fontSize: '14px',
                        color: 'var(--text-secondary)',
                    }}>
                        Sam Wilson / Storypixel
                    </span>
                    <span style={{
                        fontSize: '0.9rem',
                        color: 'var(--text-secondary)',
                    }}>
                        Austin, TX
                    </span>
                </motion.div>
            </motion.div>
        </footer>
    );
};

export default Footer;
