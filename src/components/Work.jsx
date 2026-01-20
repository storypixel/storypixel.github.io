import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { projects, projectDetails } from '../data/projects';
import './Work.css';

const Work = () => {
    return (
        <section className="work-section">
            <div className="work-list">
                {projects.map((project, index) => {
                    const details = projectDetails[project.id];
                    return (
                        <Link
                            key={project.id}
                            to={project.url || `/work/${project.id}`}
                            className="project-item"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-5%" }}
                                transition={{ duration: 0.6, delay: index * 0.05 }}
                            >
                                <div className="project-meta">
                                    <span className="project-year">{details?.year || '2024'}</span>
                                    <h3 className="project-title">{project.title}</h3>
                                    <p className="project-description">
                                        {details?.description || project.category}
                                    </p>
                                    <span className="project-category">{project.category}</span>
                                </div>
                                <div
                                    className="project-image-wrapper"
                                    style={{ backgroundColor: project.color }}
                                >
                                    <motion.img
                                        src={project.image}
                                        alt={project.title}
                                        className="project-image"
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ duration: 0.4 }}
                                    />
                                </div>
                            </motion.div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
};

export default Work;
