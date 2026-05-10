import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowLeft } from '@phosphor-icons/react';
import Navigation from './Navigation';
import { projectDetails } from '../data/projects';

const CHIA_SCREENSHOTS = projectDetails.chia.heroImages.slice(0, 3);
const CHIA_SCREENSHOT_ALTS = [
    'Chia dashboard components',
    'Chia form controls and buttons',
    'Chia data table and badges',
];

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
        <article className="chia-promo">
            <Navigation />

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="chia-promo-body"
            >
                {/* Hero: kitchen sink screenshots */}
                <motion.section variants={item} className="chia-hero">
                    {CHIA_SCREENSHOTS.map((src, index) => (
                        <div key={src} className="chia-hero-panel chia-hero-screenshot">
                            <img src={src} alt={CHIA_SCREENSHOT_ALTS[index]} className="chia-hero-screenshot-img" />
                        </div>
                    ))}
                </motion.section>

                {/* Title + tagline */}
                <section className="chia-intro">
                    <div className="chia-intro-grid">
                        <motion.div variants={item} className="chia-intro-meta">
                            <p className="chia-meta-label">Details</p>
                            <dl className="chia-meta-list">
                                <div className="chia-meta-row">
                                    <dt>Year</dt><dd>2026</dd>
                                </div>
                                <div className="chia-meta-row">
                                    <dt>Role</dt><dd>Design & Development</dd>
                                </div>
                                <div className="chia-meta-row">
                                    <dt>Stack</dt><dd>CSS, Open Props, Custom Properties</dd>
                                </div>
                            </dl>
                        </motion.div>
                        <motion.div variants={item} className="chia-intro-content">
                            <p className="chia-intro-desc">
                                After fighting Tailwind specificity wars on a production app, I extracted the useful patterns into a standalone CSS framework. No build step, no JavaScript, no utility class soup. Just real selectors with flat specificity that work anywhere.
                            </p>
                            <p className="chia-intro-desc">
                                Components use <code className="chia-code">data-slot</code> attribute selectors instead of classes. Variants with <code className="chia-code">data-variant</code>. Flat specificity, easy overrides, works with any framework or none at all.
                            </p>
                            <div className="chia-links">
                                <a href="https://iamnotsam.com/chia/" target="_blank" rel="noopener noreferrer" className="chia-link-primary">
                                    Live Demo <ArrowUpRight size={16} weight="bold" />
                                </a>
                                <a href="https://github.com/storypixel/chia" target="_blank" rel="noopener noreferrer" className="chia-link-secondary">
                                    GitHub <ArrowUpRight size={16} weight="bold" />
                                </a>
                                <Link to="/chia/kitchen-sink" className="chia-link-secondary">
                                    Kitchen Sink <ArrowUpRight size={16} weight="bold" />
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Modules */}
                <section className="chia-section">
                    <motion.p variants={item} className="chia-section-label">Modules</motion.p>
                    <div className="chia-modules">
                        {[
                            { name: 'tokens.css', desc: 'Design tokens for typography, radius, color, spacing, and transitions.' },
                            { name: 'reset.css', desc: 'Modern CSS reset with sensible defaults. No design opinions.' },
                            { name: 'components.css', desc: 'UI components via data-slot selectors. Button, card, badge, input, avatar.' },
                            { name: 'utilities.css', desc: 'Minimal layout utilities. Flex, grid, gap, padding, margin.' },
                            { name: 'grid.css', desc: 'CSS Grid system. Auto-fill, fixed columns, named layouts, breakpoints.' },
                            { name: 'animations.css', desc: 'Keyframes for fade, slide, scale, collapse, ping, shimmer, spin.' },
                        ].map(mod => (
                            <motion.div key={mod.name} variants={item} className="chia-module">
                                <p className="chia-module-name">{mod.name}</p>
                                <p className="chia-module-desc">{mod.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Philosophy */}
                <section className="chia-section">
                    <motion.p variants={item} className="chia-section-label">Philosophy</motion.p>
                    <div className="chia-modules">
                        {[
                            { name: 'One selector per rule', desc: 'No compound selectors. No nesting. Every rule targets exactly one thing.' },
                            { name: 'No !important', desc: 'Flat specificity so the cascade works for you, not against you.' },
                            { name: 'Attributes over classes', desc: 'data-slot for identity, data-variant for styling. No BEM, no utility soup.' },
                            { name: 'Custom properties everywhere', desc: 'Theme by overriding tokens, not by forking component CSS.' },
                            { name: 'No build step', desc: 'Import the CSS file. Works in a CDN link tag. No PostCSS, no config.' },
                            { name: 'Framework agnostic', desc: 'React, Vue, Svelte, plain HTML. Styles elements, not components.' },
                        ].map(p => (
                            <motion.div key={p.name} variants={item} className="chia-module">
                                <p className="chia-module-name">{p.name}</p>
                                <p className="chia-module-desc">{p.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Back */}
                <div className="chia-back">
                    <Link to="/projects" className="chia-back-link">
                        <ArrowLeft size={16} weight="bold" aria-hidden="true" />
                        <span>Back to Projects</span>
                    </Link>
                </div>
            </motion.div>

            <style>{`
                .chia-promo { min-height: 100vh; padding-bottom: 10vh; }
                .chia-promo-body { padding-top: 8rem; }

                .chia-hero {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 0.75rem;
                    margin: 0 var(--spacing-container, 2.5rem) 6rem;
                }
                .chia-hero-panel {
                    aspect-ratio: 3/4;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                    overflow: hidden;
                }
                .chia-hero-logo {
                    width: 80%;
                    max-width: 240px;
                    height: auto;
                    object-fit: contain;
                }
                .chia-hero-screenshot {
                    padding: 0;
                    background: #1a1a1a;
                    border: 1px solid rgba(255,255,255,0.08);
                }
                .chia-hero-screenshot-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 8px;
                }

                .chia-intro {
                    margin: 0 var(--spacing-container, 2.5rem) 6rem;
                }
                .chia-intro-grid {
                    display: grid;
                    grid-template-columns: minmax(12rem, 20rem) minmax(0, 1fr);
                    gap: clamp(2rem, 6vw, 5rem);
                    align-items: start;
                }
                .chia-intro-meta,
                .chia-intro-content { min-width: 0; }

                .chia-meta-label {
                    color: var(--text-secondary);
                    font-size: 0.75rem;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    margin-bottom: 0.75rem;
                }
                .chia-meta-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    font-size: 0.9rem;
                    margin: 0;
                }
                .chia-meta-row {
                    display: grid;
                    grid-template-columns: 4rem minmax(0, 1fr);
                    gap: 1rem;
                    align-items: start;
                }
                .chia-meta-row dt { color: var(--text-secondary); }
                .chia-meta-row dd {
                    margin: 0;
                    line-height: 1.35;
                    overflow-wrap: anywhere;
                }

                .chia-intro-desc {
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                    line-height: 1.6;
                    margin-bottom: 1.5rem;
                }
                .chia-code {
                    color: #fff;
                    background: rgba(255,255,255,0.08);
                    padding: 0.15rem 0.4rem;
                    border-radius: 4px;
                    font-size: 0.85rem;
                }
                .chia-links {
                    display: flex;
                    gap: 1rem;
                    flex-wrap: wrap;
                    margin-top: 0.5rem;
                }
                .chia-link-primary {
                    color: #fff;
                    font-size: 0.9rem;
                    border-bottom: 1px solid rgba(255,255,255,0.3);
                    padding-bottom: 2px;
                }
                .chia-link-secondary {
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                    padding-bottom: 2px;
                }

                .chia-section {
                    margin: 0 var(--spacing-container, 2.5rem) 6rem;
                    border-top: 1px solid rgba(255,255,255,0.1);
                    padding-top: 3rem;
                }
                .chia-section-label {
                    color: var(--text-secondary);
                    font-size: 0.75rem;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    margin-bottom: 2rem;
                }
                .chia-modules {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
                    gap: 2.5rem;
                }
                .chia-module-name {
                    font-size: 0.95rem;
                    font-weight: 500;
                    margin-bottom: 0.4rem;
                }
                .chia-module-desc {
                    color: var(--text-secondary);
                    font-size: 0.85rem;
                    line-height: 1.5;
                }

                .chia-back {
                    margin: 0 var(--spacing-container, 2.5rem) 4rem;
                }
                .chia-back-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.45rem;
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                    line-height: 1.2;
                }
                .chia-back-link svg {
                    display: block;
                    flex: 0 0 auto;
                    width: 1rem;
                    height: 1rem;
                }
                .chia-back-link span {
                    display: block;
                    padding-top: 0.02em;
                }

                @media (max-width: 900px) {
                    .chia-intro-grid { grid-template-columns: 1fr; }
                }

                @media (max-width: 768px) {
                    .chia-hero { grid-template-columns: 1fr; }
                }
            `}</style>
        </article>
    );
};

export default ChiaPromo;
