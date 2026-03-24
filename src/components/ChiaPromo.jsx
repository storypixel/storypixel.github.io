import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';

const ChiaPromo = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1, transition: { duration: 0.5 } }
    };

    return (
        <article style={{ minHeight: '100vh', paddingBottom: '10vh' }}>
            <Navigation />

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                style={{ paddingTop: '8rem' }}
            >
                {/* Hero Section */}
                <section style={{
                    position: 'relative',
                    minHeight: '70vh',
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '6rem',
                    marginLeft: 'var(--spacing-container)',
                    marginRight: 'var(--spacing-container)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: '#1a1a1a'
                }}>
                    <div style={{
                        position: 'relative',
                        zIndex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        padding: '4rem 2rem',
                        textAlign: 'center',
                        gap: '2rem'
                    }}>
                        {/* Logo repeated in different colors */}
                        <motion.div
                            variants={item}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.5rem',
                                marginBottom: '1rem'
                            }}
                        >
                            {['#ffffff', 'rgba(255,255,255,0.25)', 'rgba(255,255,255,0.08)'].map((color, i) => (
                                <img
                                    key={i}
                                    src="/images/chia/chia-logo.svg"
                                    alt={i === 0 ? 'Chia' : ''}
                                    style={{
                                        width: 260 - i * 40,
                                        filter: i === 0 ? 'none' : `brightness(0) invert(1) opacity(${i === 1 ? 0.25 : 0.08})`,
                                        opacity: i === 0 ? 1 : i === 1 ? 0.25 : 0.08,
                                    }}
                                />
                            ))}
                        </motion.div>
                        <motion.p
                            variants={item}
                            style={{ color: '#888', fontSize: '0.9rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}
                        >
                            CSS Framework
                        </motion.p>
                        <motion.h1
                            variants={item}
                            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 300, lineHeight: 1.1, letterSpacing: '-0.03em', maxWidth: 600 }}
                        >
                            Plain CSS.<br />No build step.<br />No dependencies.
                        </motion.h1>
                    </div>
                </section>

                {/* Details */}
                <section style={{
                    marginLeft: 'var(--spacing-container)',
                    marginRight: 'var(--spacing-container)',
                    marginBottom: '6rem'
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'var(--grid-columns, 80px 280px 1fr 160px)',
                        gap: '2rem'
                    }}>
                        <motion.div variants={item} style={{ gridColumn: '1 / 3' }}>
                            <p style={{ color: '#888', fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Details</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                                <div><span style={{ color: '#888' }}>Year</span> <span style={{ marginLeft: '1rem' }}>2026</span></div>
                                <div><span style={{ color: '#888' }}>Role</span> <span style={{ marginLeft: '1rem' }}>Design & Development</span></div>
                                <div><span style={{ color: '#888' }}>Stack</span> <span style={{ marginLeft: '1rem' }}>CSS, Open Props, Custom Properties</span></div>
                            </div>
                        </motion.div>
                        <motion.div variants={item} style={{ gridColumn: '3 / -1' }}>
                            <p style={{ color: '#888', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                                After fighting Tailwind specificity wars on a production app, I extracted the useful patterns into a standalone CSS framework. No build step, no JavaScript, no utility class soup. Just real selectors with flat specificity that work anywhere.
                            </p>
                            <p style={{ color: '#888', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                                Components use <code style={{ color: '#fff', background: 'rgba(255,255,255,0.08)', padding: '0.15rem 0.4rem', borderRadius: 4, fontSize: '0.85rem' }}>data-slot</code> attribute selectors instead of classes. Variants with <code style={{ color: '#fff', background: 'rgba(255,255,255,0.08)', padding: '0.15rem 0.4rem', borderRadius: 4, fontSize: '0.85rem' }}>data-variant</code>. Flat specificity, easy overrides, works with any framework or none at all.
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <a
                                    href="https://iamnotsam.com/chia/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: '#fff', fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: 2 }}
                                >
                                    Live Demo &nearr;
                                </a>
                                <a
                                    href="https://github.com/storypixel/chia"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: '#888', fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 2 }}
                                >
                                    GitHub &nearr;
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Modules */}
                <section style={{
                    marginLeft: 'var(--spacing-container)',
                    marginRight: 'var(--spacing-container)',
                    marginBottom: '6rem',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    paddingTop: '3rem'
                }}>
                    <motion.p variants={item} style={{ color: '#888', fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '2rem' }}>
                        Modules
                    </motion.p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '2.5rem' }}>
                        {[
                            { name: 'tokens.css', desc: 'Design tokens for typography, radius, color, spacing, and transitions.' },
                            { name: 'reset.css', desc: 'Modern CSS reset with sensible defaults. No design opinions.' },
                            { name: 'components.css', desc: 'UI components via data-slot selectors. Button, card, badge, input, avatar.' },
                            { name: 'utilities.css', desc: 'Minimal layout utilities. Flex, grid, gap, padding, margin.' },
                            { name: 'animations.css', desc: 'Keyframes for fade, slide, scale, collapse, ping, shimmer, spin.' },
                            { name: 'prose.css', desc: 'Rich text typography via .prose class. For editors and markdown.' },
                        ].map(mod => (
                            <motion.div key={mod.name} variants={item}>
                                <p style={{ fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.4rem' }}>{mod.name}</p>
                                <p style={{ color: '#888', fontSize: '0.85rem', lineHeight: 1.5 }}>{mod.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Philosophy */}
                <section style={{
                    marginLeft: 'var(--spacing-container)',
                    marginRight: 'var(--spacing-container)',
                    marginBottom: '6rem',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    paddingTop: '3rem'
                }}>
                    <motion.p variants={item} style={{ color: '#888', fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '2rem' }}>
                        Philosophy
                    </motion.p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '2.5rem' }}>
                        {[
                            { name: 'One selector per rule', desc: 'No compound selectors. No nesting. Every rule targets exactly one thing.' },
                            { name: 'No !important', desc: 'Flat specificity so the cascade works for you, not against you.' },
                            { name: 'Attributes over classes', desc: 'data-slot for identity, data-variant for styling. No BEM, no utility soup.' },
                            { name: 'Custom properties everywhere', desc: 'Theme by overriding tokens, not by forking component CSS.' },
                            { name: 'No build step', desc: 'Import the CSS file. Works in a CDN link tag. No PostCSS, no config.' },
                            { name: 'Framework agnostic', desc: 'React, Vue, Svelte, plain HTML. Styles elements, not components.' },
                        ].map(p => (
                            <motion.div key={p.name} variants={item}>
                                <p style={{ fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.4rem' }}>{p.name}</p>
                                <p style={{ color: '#888', fontSize: '0.85rem', lineHeight: 1.5 }}>{p.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Back */}
                <div style={{ marginLeft: 'var(--spacing-container)', marginBottom: '4rem' }}>
                    <Link to="/" style={{ color: '#888', fontSize: '0.9rem' }}>&larr; Back</Link>
                </div>
            </motion.div>
        </article>
    );
};

export default ChiaPromo;
