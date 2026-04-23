import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from './Navigation';
import Footer from './Footer';
import { experiments } from '../data/experiments';

const ExperimentsPage = () => {
    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.08 } },
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1, transition: { duration: 0.5 } },
    };

    return (
        <article style={{ minHeight: '100vh' }}>
            <Navigation />

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                style={{ paddingTop: '8rem' }}
            >
                <motion.div
                    variants={item}
                    className="page-grid"
                    style={{
                        paddingTop: '4rem',
                        paddingBottom: '4rem',
                        borderBottom: '1px solid var(--border-color)',
                    }}
                >
                    <span className="section-label" style={{ paddingTop: '0.4rem' }}>
                        Building
                    </span>
                    <div className="section-content">
                        <h1 style={{
                            fontSize: 'clamp(2rem, 4vw, 3rem)',
                            fontWeight: 400,
                            lineHeight: 1.15,
                        }}>
                            Experiments
                        </h1>
                        <p style={{
                            marginTop: '1rem',
                            color: 'var(--text-secondary)',
                            maxWidth: '50ch',
                            lineHeight: 1.6,
                        }}>
                            Things I try. Usually prompted by something I saw online that looked too clean to be true. Each one gets pulled, built, and written down.
                        </p>
                    </div>
                </motion.div>

                <div>
                    {experiments.map((exp) => (
                        <motion.div
                            key={exp.slug}
                            variants={item}
                            style={{
                                borderBottom: '1px solid var(--border-color)',
                            }}
                        >
                            <Link
                                to={`/experiments/${exp.slug}`}
                                style={{ display: 'block' }}
                            >
                                <motion.div
                                    className="page-grid"
                                    style={{
                                        paddingTop: '2.5rem',
                                        paddingBottom: '2.5rem',
                                    }}
                                    whileHover={{ x: 4 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <span
                                        className="section-label"
                                        style={{ paddingTop: '0.3rem' }}
                                    >
                                        {exp.dateDisplay}
                                    </span>
                                    <div className="section-content">
                                        <h2 style={{
                                            fontSize: '1.5rem',
                                            fontWeight: 400,
                                            marginBottom: '0.6rem',
                                            transition: 'opacity 0.2s ease',
                                        }}>
                                            {exp.title}
                                        </h2>
                                        <p style={{
                                            fontSize: '0.9rem',
                                            color: 'var(--text-secondary)',
                                            lineHeight: 1.6,
                                            maxWidth: '55ch',
                                        }}>
                                            {exp.excerpt}
                                        </p>
                                    </div>
                                </motion.div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            <Footer />
        </article>
    );
};

export default ExperimentsPage;
