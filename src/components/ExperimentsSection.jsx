import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { experiments } from '../data/experiments';

const ExperimentsSection = () => {
    const latest = experiments.slice(0, 3);

    return (
        <section style={{
            padding: '10vh var(--spacing-container)',
            borderTop: '1px solid var(--border-color)',
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <h2 style={{
                    fontSize: '14px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '3rem',
                    color: 'var(--text-secondary)',
                }}>
                    Experiments
                </h2>
            </motion.div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {latest.map((exp, index) => (
                    <motion.div
                        key={exp.slug}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.08 }}
                        style={{
                            borderTop: '1px solid var(--border-color)',
                            paddingTop: '2rem',
                            paddingBottom: '2rem',
                        }}
                    >
                        <Link
                            to={`/experiments/${exp.slug}`}
                            style={{ display: 'block' }}
                            className="thought-row"
                        >
                            <div className="page-grid" style={{ padding: 0 }}>
                                <span className="thought-date-col">
                                    {exp.dateDisplay}
                                </span>
                                <div className="thought-content-col">
                                    <h3 style={{
                                        fontSize: '1.4rem',
                                        fontWeight: 400,
                                        marginBottom: '0.5rem',
                                        transition: 'opacity 0.2s ease',
                                    }}>
                                        {exp.title}
                                    </h3>
                                    <p style={{
                                        fontSize: '0.9rem',
                                        color: 'var(--text-secondary)',
                                        lineHeight: 1.6,
                                        maxWidth: '55ch',
                                    }}>
                                        {exp.excerpt}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                style={{
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: '2rem',
                }}
            >
                <Link
                    to="/experiments"
                    style={{
                        fontSize: '0.9rem',
                        borderBottom: '1px solid #444',
                        paddingBottom: '4px',
                        transition: 'border-color 0.3s ease',
                        display: 'inline-block',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#fff'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#444'}
                >
                    All experiments
                </Link>
            </motion.div>
        </section>
    );
};

export default ExperimentsSection;
