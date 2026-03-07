import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from './Navigation';
import Footer from './Footer';
import { getPost } from '../data/posts';

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

const ThoughtPost = () => {
    const { slug } = useParams();
    const post = getPost(slug);

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1, transition: { duration: 0.5 } },
    };

    if (!post) {
        return (
            <article style={{ minHeight: '100vh' }}>
                <Navigation />
                <div style={{
                    paddingTop: '12rem',
                    paddingLeft: 'var(--spacing-container)',
                    paddingRight: 'var(--spacing-container)',
                }}>
                    <p style={{ color: 'var(--text-secondary)' }}>Post not found.</p>
                    <Link
                        to="/thoughts"
                        style={{
                            display: 'inline-block',
                            marginTop: '1rem',
                            fontSize: '0.9rem',
                            borderBottom: '1px solid #444',
                            paddingBottom: '4px',
                        }}
                    >
                        Back to Thoughts
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
                {/* Post header */}
                <motion.section
                    variants={item}
                    style={{
                        padding: '4rem var(--spacing-container) 4rem',
                        borderBottom: '1px solid var(--border-color)',
                    }}
                >
                    <div className="page-grid" style={{ padding: 0 }}>
                        <span className="section-label" style={{ paddingTop: '0.4rem' }}>
                            {post.dateDisplay}
                        </span>
                        <div className="section-content">
                            <h1 style={{
                                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                                fontWeight: 400,
                                lineHeight: 1.1,
                                marginBottom: '1.5rem',
                            }}>
                                {post.title}
                            </h1>
                            <p style={{
                                fontSize: '1.1rem',
                                color: 'var(--text-secondary)',
                                maxWidth: '50ch',
                                lineHeight: 1.6,
                            }}>
                                {post.excerpt}
                            </p>
                        </div>
                    </div>
                </motion.section>

                {/* Post body sections */}
                {post.sections.map((section, sectionIndex) => {
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
                                            {section.items.map((ing, i) => (
                                                <motion.li
                                                    key={i}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 0.3, delay: i * 0.03 }}
                                                    style={{
                                                        fontSize: '1rem',
                                                        color: 'var(--text-secondary)',
                                                        paddingBottom: '0.75rem',
                                                        borderBottom: '1px solid var(--border-color)',
                                                    }}
                                                >
                                                    {ing}
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </motion.section>
                        );
                    }

                    if (section.type === 'steps') {
                        return (
                            <motion.section
                                key={sectionIndex}
                                variants={item}
                                style={{
                                    padding: '4rem 0',
                                    borderBottom: '1px solid var(--border-color)',
                                }}
                            >
                                <div className="page-grid" style={{ marginBottom: '2rem' }}>
                                    <span className="section-label">
                                        {section.label}
                                    </span>
                                </div>
                                <div style={{ padding: '0 var(--spacing-container)' }}>
                                    {section.steps.map((step, i) => (
                                        <motion.div
                                            key={i}
                                            className="content-grid"
                                            initial={{ opacity: 0, y: 30 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, margin: '-10%' }}
                                            transition={{ duration: 0.6, delay: i * 0.1 }}
                                            style={{
                                                borderBottom: '1px solid var(--border-color)',
                                                paddingTop: '2rem',
                                                paddingBottom: '2rem',
                                            }}
                                        >
                                            <span className="section-label" style={{ paddingTop: '0.25rem' }}>
                                                {String(i + 1).padStart(2, '0')}
                                            </span>
                                            <div className="section-content">
                                                <h3 style={{
                                                    fontSize: '1.5rem',
                                                    fontWeight: 500,
                                                    marginBottom: '0.75rem',
                                                }}>
                                                    {step.title}
                                                </h3>
                                                <p style={{
                                                    color: 'var(--text-secondary)',
                                                    maxWidth: '50ch',
                                                    lineHeight: 1.6,
                                                }}>
                                                    {step.text}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.section>
                        );
                    }

                    if (section.type === 'reviews') {
                        return (
                            <motion.section
                                key={sectionIndex}
                                variants={item}
                                style={{
                                    padding: '4rem 0',
                                    borderBottom: '1px solid var(--border-color)',
                                }}
                            >
                                <div className="page-grid" style={{ marginBottom: '2rem' }}>
                                    <span className="section-label">
                                        {section.label}
                                    </span>
                                </div>
                                <div style={{ padding: '0 var(--spacing-container)' }}>
                                    {section.reviews.map((review, i) => (
                                        <motion.div
                                            key={i}
                                            className="content-grid"
                                            initial={{ opacity: 0, y: 30 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, margin: '-10%' }}
                                            transition={{ duration: 0.6, delay: i * 0.1 }}
                                            style={{
                                                borderBottom: '1px solid var(--border-color)',
                                                paddingTop: '2rem',
                                                paddingBottom: '2rem',
                                            }}
                                        >
                                            <span className="section-label" style={{ paddingTop: '0.25rem' }}>
                                                {review.name}
                                            </span>
                                            <div className="section-content">
                                                <p style={{
                                                    color: 'var(--text-secondary)',
                                                    maxWidth: '55ch',
                                                    lineHeight: 1.6,
                                                    fontStyle: 'italic',
                                                }}>
                                                    "{review.text}"
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
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

                {/* Back link */}
                <motion.div
                    variants={item}
                    style={{
                        padding: '3rem var(--spacing-container)',
                    }}
                >
                    <Link
                        to="/thoughts"
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
                        All posts
                    </Link>
                </motion.div>
            </motion.div>

            <Footer />
        </article>
    );
};

export default ThoughtPost;
