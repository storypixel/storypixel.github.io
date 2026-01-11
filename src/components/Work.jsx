import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { projects } from '../data/projects';
import './Work.css';

const Work = () => {
    return (
        <section className="work-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: '400', marginBottom: '0.5rem' }}>12 Apps in 12 Months</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>A personal challenge for 2025</p>
                </div>
                <span style={{ color: 'var(--text-secondary)' }}>2025</span>
            </div>

            <div className="work-grid">
                {projects.map((project, index) => (
                    <Link
                        key={project.id}
                        to={`/work/${project.id}`}
                        style={{ display: 'block' }}
                    >
                        <motion.div
                            className={`project-card ${project.size === 'full' ? 'full-width' : ''}`}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            style={{
                                backgroundColor: project.color,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: project.image ? 'flex-end' : 'center',
                                alignItems: project.image ? 'stretch' : 'center',
                                position: 'relative'
                            }}
                        >
                            {project.image ? (
                                <div className="project-image-container" style={{ height: '100%' }}>
                                    <img src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                </div>
                            ) : (
                                <div style={{
                                    padding: '2rem',
                                    textAlign: 'center',
                                    opacity: 0.3,
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>{project.id}</span>
                                    <span>Coming Soon</span>
                                </div>
                            )}

                            <div className="project-info">
                                <h3 className="project-title" style={{ color: project.textColor || '#fff' }}>
                                    {project.title}
                                </h3>
                                <p className="project-category" style={{ color: project.textColor ? 'rgba(255,255,255,0.6)' : '#888' }}>
                                    {project.category}
                                </p>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default Work;
