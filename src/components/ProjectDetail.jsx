import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projects } from '../data/projects';
import ImageMarquee from './ImageMarquee';
import ProjectHeroPhone from './ProjectHeroPhone';

const ProjectDetail = () => {
    const { id } = useParams();
    const project = projects.find(p => p.id === parseInt(id));

    if (!project) return <div style={{ padding: '4rem' }}>Project not found</div>;

    const textColor = project.textColor || '#fff';

    return (
        <article style={{ minHeight: '100vh', paddingBottom: '10vh' }}>
            <div style={{ padding: '2rem var(--spacing-container)' }}>
                <Link to="/" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '2rem'
                }}>
                    ← Back
                </Link>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    height: '60vh',
                    width: 'calc(100% - 2 * var(--spacing-container))',
                    margin: '0 auto',
                    position: 'relative',
                }}
            >
                {/* Background & Marquee Container (Clipped) */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: project.color,
                    display: 'flex',
                    // alignItems: 'flex-end', // Removed to allow full height fill
                    padding: '4rem',
                    zIndex: 1
                }}>
                    {project.heroImages ? (
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            // alignItems: 'center', // Removed to allow full height fill
                            zIndex: 0
                        }}>
                            <ImageMarquee images={project.heroImages} />
                        </div>
                    ) : project.image && (
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <img
                                src={project.image}
                                alt={project.title}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                    opacity: 0.8
                                }}
                            />
                        </div>
                    )}
                    <h1 style={{
                        fontSize: 'clamp(3rem, 6vw, 5rem)',
                        lineHeight: 1,
                        margin: 0,
                        color: textColor,
                        position: 'relative',
                        zIndex: 2,
                        textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                    }}>
                        {project.title}
                    </h1>
                </div>

                {/* 3D Phone Container (Unclipped) */}
                <ProjectHeroPhone screenshots={project.appScreenshots} />
            </motion.div>

            <div style={{
                padding: '6rem var(--spacing-container)',
                display: 'grid',
                gridTemplateColumns: '1fr 2fr',
                gap: '4rem'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div>
                        <h3 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Client</h3>
                        <p>{project.client}</p>
                    </div>
                    <div>
                        <h3 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Role</h3>
                        <p>{project.role}</p>
                    </div>
                    <div>
                        <h3 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Year</h3>
                        <p>{project.year}</p>
                    </div>
                    {project.startDate && (
                        <div>
                            <h3 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Started</h3>
                            <p>{project.startDate}</p>
                        </div>
                    )}
                    {project.endDate && (
                        <div>
                            <h3 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Completed</h3>
                            <p>{project.endDate}</p>
                        </div>
                    )}
                    {project.url && (
                        <div>
                            <h3 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Live URL</h3>
                            <a href={project.url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>
                                {project.url.replace(/^https?:\/\//, '')}
                            </a>
                        </div>
                    )}
                </div>

                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 400, lineHeight: 1.6, maxWidth: '40ch' }}>
                        {project.description}
                    </h2>

                    {/* Gallery Placeholders - could add more specific screenshots here if available in data */}
                </div>
            </div>
        </article>
    );
};

export default ProjectDetail;
