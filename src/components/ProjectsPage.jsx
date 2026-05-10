import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from './Navigation';
import Footer from './Footer';
import { projects, projectDetails } from '../data/projects';
import './Work.css';

const MotionLink = motion.create(Link);
const MotionAnchor = motion.create('a');
const MotionDiv = motion.create('div');

const ProjectsPage = () => {
    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.08 } },
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1, transition: { duration: 0.5 } },
    };

    const renderProject = (project) => {
        const details = projectDetails[project.id];
        const images = (details?.heroImages || [project.image]).filter(Boolean).slice(0, 3);
        const content = (
            <>
                <div className="project-meta">
                    <span className="project-year">{details?.year || '2026'}</span>
                    <h2 className="project-title">{project.title}</h2>
                    <p className="project-description">
                        {details?.roleBlurb || details?.description || project.category}
                    </p>
                    <span className="project-category">{project.category}</span>
                </div>

                <div className="project-images-grid">
                    {images.map((img, imgIndex) => (
                        <div
                            key={img}
                            className="project-image-wrapper"
                            style={{ backgroundColor: project.color }}
                        >
                            <img
                                src={img}
                                alt={`${project.title} ${imgIndex + 1}`}
                                className="project-image"
                            />
                        </div>
                    ))}
                </div>
            </>
        );

        const sharedProps = {
            variants: item,
            className: 'project-item',
            style: { display: 'block' },
        };

        if (project.external && project.url) {
            return (
                <MotionAnchor
                    key={project.id}
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    {...sharedProps}
                >
                    {content}
                </MotionAnchor>
            );
        }

        if (project.url) {
            return (
                <MotionLink key={project.id} to={project.url} {...sharedProps}>
                    {content}
                </MotionLink>
            );
        }

        return (
            <MotionDiv
                key={project.id}
                {...sharedProps}
                className="project-item project-item--static"
            >
                {content}
            </MotionDiv>
        );
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
                        Selected Work
                    </span>
                    <div className="section-content">
                        <h1 style={{
                            fontSize: 'clamp(2rem, 4vw, 3rem)',
                            fontWeight: 400,
                            lineHeight: 1.15,
                        }}>
                            Projects
                        </h1>
                        <p style={{
                            marginTop: '1rem',
                            color: 'var(--text-secondary)',
                            maxWidth: '52ch',
                            lineHeight: 1.6,
                        }}>
                            Products, tools, and systems shaped from the first sketch through working software.
                        </p>
                    </div>
                </motion.div>

                <section className="work-section" style={{ paddingTop: '4rem' }}>
                    <div className="work-list">
                        {projects.map(renderProject)}
                    </div>
                </section>
            </motion.div>

            <Footer />
        </article>
    );
};

export default ProjectsPage;
