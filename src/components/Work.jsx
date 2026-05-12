import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { projects, projectDetails } from '../data/projects';
import ProjectMedia from './ProjectMedia';
import { getProjectMediaKey } from '../utils/projectMedia';
import './Work.css';

const Work = () => {
    return (
        <section className="work-section">
            <div className="work-list">
                {projects.map((project, index) => {
                    const details = projectDetails[project.id];
                    const inner = (
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
                            <div className="project-images-grid">
                                {(details?.cardMedia || details?.heroImages || [project.image]).slice(0, 3).map((media, imgIndex) => (
                                    <div
                                        key={getProjectMediaKey(media, imgIndex)}
                                        className="project-image-wrapper"
                                        style={{ backgroundColor: project.color }}
                                    >
                                        <ProjectMedia
                                            media={media}
                                            alt={`${project.title} ${imgIndex + 1}`}
                                            className="project-image"
                                        />
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    );

                    if (project.external && project.url) {
                        return (
                            <a
                                key={project.id}
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="project-item"
                            >
                                {inner}
                            </a>
                        );
                    }

                    if (!project.url) {
                        return (
                            <div key={project.id} className="project-item project-item--static">
                                {inner}
                            </div>
                        );
                    }

                    return (
                        <Link key={project.id} to={project.url} className="project-item">
                            {inner}
                        </Link>
                    );
                })}
            </div>
        </section>
    );
};

export default Work;
