import React, { lazy, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from './Navigation';
import Footer from './Footer';
import FullscreenDemo from './FullscreenDemo';
import { getExperiment } from '../data/experiments';

// Lazy-load demo components so each one ships its own chunk.
const demoRegistry = {
    ViewTransitions: lazy(() => import('./experiments/ViewTransitionsDemo')),
    ScrollDriven: lazy(() => import('./experiments/ScrollDrivenDemo')),
    AnchorPositioning: lazy(() => import('./experiments/AnchorPositioningDemo')),
    DocumentPiP: lazy(() => import('./experiments/DocumentPiPDemo')),
    HoudiniPaint: lazy(() => import('./experiments/HoudiniPaintDemo')),
};

// Parse simple markdown-style links [text](url) into clickable elements
function RichText({ children }) {
    if (typeof children !== 'string') return children;
    const parts = children.split(/(\[[^\]]+\]\([^)]+\))/g);
    return parts.map((part, i) => {
        const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (match) {
            return (
                <a
                    key={i}
                    href={match[2]}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        color: 'var(--text-color)',
                        borderBottom: '1px solid var(--text-secondary)',
                        paddingBottom: '1px',
                        transition: 'border-color 0.2s ease',
                    }}
                >
                    {match[1]}
                </a>
            );
        }
        return <span key={i}>{part}</span>;
    });
}

const ExperimentPost = () => {
    const { slug } = useParams();
    const exp = getExperiment(slug);
    const [demoOpen, setDemoOpen] = useState(false);

    const DemoComponent = exp && exp.demo ? demoRegistry[exp.demo] : null;

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1, transition: { duration: 0.5 } },
    };

    if (!exp) {
        return (
            <article style={{ minHeight: '100vh' }}>
                <Navigation />
                <div style={{
                    paddingTop: '12rem',
                    paddingLeft: 'var(--spacing-container)',
                    paddingRight: 'var(--spacing-container)',
                }}>
                    <p style={{ color: 'var(--text-secondary)' }}>Experiment not found.</p>
                    <Link
                        to="/experiments"
                        style={{
                            display: 'inline-block',
                            marginTop: '1rem',
                            fontSize: '0.9rem',
                            borderBottom: '1px solid #444',
                            paddingBottom: '4px',
                        }}
                    >
                        Back to Experiments
                    </Link>
                </div>
            </article>
        );
    }

    return (
        <article style={{ minHeight: '100vh', paddingBottom: '10vh' }}>
            <Navigation />

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                style={{ paddingTop: '8rem' }}
            >
                <motion.section
                    variants={item}
                    style={{
                        padding: '4rem var(--spacing-container) 4rem',
                        borderBottom: '1px solid var(--border-color)',
                    }}
                >
                    <div className="page-grid" style={{ padding: 0 }}>
                        <span className="section-label" style={{ paddingTop: '0.4rem' }}>
                            {exp.dateDisplay}
                        </span>
                        <div className="section-content">
                            <h1 style={{
                                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                                fontWeight: 400,
                                lineHeight: 1.1,
                                marginBottom: '1.5rem',
                            }}>
                                {exp.title}
                            </h1>
                            <p style={{
                                fontSize: '1.1rem',
                                color: 'var(--text-secondary)',
                                maxWidth: '50ch',
                                lineHeight: 1.6,
                            }}>
                                {exp.excerpt}
                            </p>
                            {DemoComponent && (
                                <button
                                    onClick={() => setDemoOpen(true)}
                                    style={{
                                        marginTop: '1.75rem',
                                        padding: '0.75rem 1.5rem',
                                        background: '#fff',
                                        color: '#000',
                                        border: 'none',
                                        borderRadius: '999px',
                                        fontSize: '0.9rem',
                                        cursor: 'pointer',
                                        fontFamily: 'inherit',
                                        fontWeight: 500,
                                    }}
                                >
                                    Launch demo ↗
                                </button>
                            )}
                        </div>
                    </div>
                </motion.section>

                {exp.sections.map((section, sectionIndex) => {
                    if (section.type === 'text') {
                        return (
                            <motion.section
                                key={sectionIndex}
                                variants={item}
                                style={{
                                    padding: '4rem 0',
                                    borderBottom: '1px solid var(--border-color)',
                                }}
                            >
                                <div className="page-grid">
                                    {section.label && (
                                        <span className="section-label" style={{ paddingTop: '0.25rem' }}>
                                            {section.label}
                                        </span>
                                    )}
                                    <div className={section.label ? 'section-content' : ''} style={!section.label ? { gridColumn: '3 / 5' } : {}}>
                                        <div style={{
                                            color: 'var(--text-secondary)',
                                            fontSize: '1rem',
                                            lineHeight: 1.7,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '1.5rem',
                                            maxWidth: '55ch',
                                        }}>
                                            {section.paragraphs.map((para, i) => (
                                                <p key={i}><RichText>{para}</RichText></p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.section>
                        );
                    }

                    if (section.type === 'demo') {
                        const inlineDemo = demoRegistry[section.component];
                        return (
                            <motion.section
                                key={sectionIndex}
                                variants={item}
                                style={{
                                    padding: '4rem 0',
                                    borderBottom: '1px solid var(--border-color)',
                                }}
                            >
                                <div className="page-grid">
                                    <span className="section-label" style={{ paddingTop: '0.25rem' }}>
                                        {section.label}
                                    </span>
                                    <div className="section-content">
                                        <div style={{
                                            border: '1px solid var(--border-color)',
                                            borderRadius: '8px',
                                            padding: '2rem',
                                            background: 'rgba(255,255,255,0.02)',
                                            maxWidth: '55ch',
                                        }}>
                                            {section.caption && (
                                                <p style={{
                                                    fontSize: '0.95rem',
                                                    color: 'var(--text-secondary)',
                                                    lineHeight: 1.6,
                                                    marginBottom: '1.5rem',
                                                }}>
                                                    <RichText>{section.caption}</RichText>
                                                </p>
                                            )}
                                            {inlineDemo ? (
                                                <button
                                                    onClick={() => setDemoOpen(true)}
                                                    style={{
                                                        padding: '0.65rem 1.25rem',
                                                        background: '#fff',
                                                        color: '#000',
                                                        border: 'none',
                                                        borderRadius: '999px',
                                                        fontSize: '0.85rem',
                                                        cursor: 'pointer',
                                                        fontFamily: 'inherit',
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    Launch demo ↗
                                                </button>
                                            ) : (
                                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                                    Demo unavailable.
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.section>
                        );
                    }

                    if (section.type === 'list') {
                        return (
                            <motion.section
                                key={sectionIndex}
                                variants={item}
                                style={{
                                    padding: '4rem 0',
                                    borderBottom: '1px solid var(--border-color)',
                                }}
                            >
                                <div className="page-grid">
                                    <span className="section-label" style={{ paddingTop: '0.25rem' }}>
                                        {section.label}
                                    </span>
                                    <div className="section-content">
                                        <ul style={{
                                            listStyle: 'none',
                                            padding: 0,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '0.75rem',
                                        }}>
                                            {section.items.map((it, i) => (
                                                <li
                                                    key={i}
                                                    style={{
                                                        fontSize: '1rem',
                                                        color: 'var(--text-secondary)',
                                                        paddingBottom: '0.75rem',
                                                        borderBottom: '1px solid var(--border-color)',
                                                    }}
                                                >
                                                    {it}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </motion.section>
                        );
                    }

                    if (section.type === 'footnote') {
                        return (
                            <motion.div
                                key={sectionIndex}
                                variants={item}
                                className="page-grid"
                                style={{
                                    paddingTop: '2rem',
                                    paddingBottom: '2rem',
                                    borderBottom: '1px solid var(--border-color)',
                                    fontSize: '0.85rem',
                                    color: 'var(--text-secondary)',
                                }}
                            >
                                <span style={{ gridColumn: '1 / -1' }}>
                                    <RichText>{section.text}</RichText>
                                </span>
                            </motion.div>
                        );
                    }

                    return null;
                })}

                <motion.div
                    variants={item}
                    style={{
                        padding: '3rem var(--spacing-container)',
                    }}
                >
                    <Link
                        to="/experiments"
                        style={{
                            fontSize: '0.9rem',
                            borderBottom: '1px solid #444',
                            paddingBottom: '4px',
                            display: 'inline-block',
                            transition: 'border-color 0.3s ease',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#fff'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#444'}
                    >
                        All experiments
                    </Link>
                </motion.div>
            </motion.div>

            <Footer />

            {DemoComponent && (
                <FullscreenDemo
                    open={demoOpen}
                    onClose={() => setDemoOpen(false)}
                    title={exp.title}
                >
                    <DemoComponent />
                </FullscreenDemo>
            )}
        </article>
    );
};

export default ExperimentPost;
