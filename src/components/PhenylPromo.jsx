import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import { projectDetails } from '../data/projects';

const PHENYL_SCREENSHOTS = projectDetails.phenyl.heroImages.slice(0, 3);

const PhenylPromo = () => {
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

            <motion.div variants={container} initial="hidden" animate="show" style={{ paddingTop: '8rem' }}>
                {/* Hero */}
                <section className="promo-hero" style={{ background: '#1a1410' }}>
                    <div className="promo-hero-bg" style={{ opacity: 0.45 }}>
                        <img src={PHENYL_SCREENSHOTS[0]} alt="" />
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(to right, rgba(26,20,16,0.95) 0%, rgba(26,20,16,0.65) 50%, rgba(26,20,16,0.25) 100%)'
                        }} />
                    </div>

                    <div className="promo-hero-content">
                        <div className="promo-hero-text">
                            <motion.h1 variants={item} style={{
                                fontSize: 'clamp(2.25rem, 5vw, 4.5rem)',
                                fontWeight: 400, lineHeight: 1.1,
                                marginBottom: '1.5rem', color: '#f5e8d8'
                            }}>
                                Custom perfumery,<br />talked through.
                            </motion.h1>
                            <motion.p variants={item} style={{
                                fontSize: '1.05rem',
                                color: 'rgba(245,232,216,0.75)',
                                maxWidth: '90%', marginBottom: '2.5rem', lineHeight: 1.6
                            }}>
                                Phenyl pairs an AI concierge with a real perfumer. Chat through what you want a fragrance to feel like. The concierge translates it into accords. The perfumer builds the bottle.
                            </motion.p>
                            <motion.div variants={item}>
                                <a href="https://phenyl.klerb.io" target="_blank" rel="noopener noreferrer" style={{
                                    display: 'inline-block',
                                    background: '#f5e8d8', color: '#1a1410',
                                    padding: '1rem 2rem', borderRadius: '50px',
                                    fontWeight: 500, textDecoration: 'none', fontSize: '1rem'
                                }}>
                                    Talk to the concierge
                                </a>
                            </motion.div>
                        </div>

                        <motion.div variants={item} className="promo-hero-screenshot">
                            <div style={{ borderColor: 'rgba(245,232,216,0.1)' }}>
                                <img src={PHENYL_SCREENSHOTS[1]} alt="Phenyl app interface" />
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Features */}
                <section style={{ padding: '4rem 0', borderTop: '1px solid var(--border-color)' }}>
                    <div className="page-grid">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="section-label"
                        >
                            Features
                        </motion.h2>
                    </div>
                    <div style={{ padding: '0 var(--spacing-container)' }}>
                        {[
                            { number: '01', title: '500+ raw materials, categorized', text: 'A working library of essences sorted into 14 olfactive families: amber, balsam, citrus, floral, floral-lactonic, fougère, green, hesperidic, marine, musk, oriental, spicy, woody, ozonic. Built and refined over 100+ review cycles.' },
                            { number: '02', title: 'Concierge that listens', text: 'A 24/7 AI agent on Telegram and the web. It learns your vocabulary for scent — not technical perfumer jargon — and converts it into accords the human perfumer can build against.' },
                            { number: '03', title: 'Real perfumer in the loop', text: 'Every order routes to a working perfumer who composes the final formula. The agent does the conversation. The human does the craft.' },
                            { number: '04', title: 'Composable accords', text: 'See your scent as a structure of head, heart, and base notes — not a single fragrance name. Adjust the balance before the formula leaves the studio.' },
                        ].map((feature, i) => (
                            <motion.div key={i} className="content-grid"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-10%" }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                style={{
                                    borderBottom: '1px solid var(--border-color)',
                                    paddingTop: '2rem', paddingBottom: '2rem'
                                }}>
                                <span className="section-label" style={{ paddingTop: '0.25rem' }}>
                                    {feature.number}
                                </span>
                                <div className="section-content">
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 500, marginBottom: '0.75rem' }}>
                                        {feature.title}
                                    </h3>
                                    <p style={{ color: 'var(--text-secondary)', maxWidth: '50ch', lineHeight: 1.6 }}>
                                        {feature.text}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Full-width screenshot */}
                <section style={{ padding: '4rem var(--spacing-container)', borderTop: '1px solid var(--border-color)' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        style={{
                            borderRadius: '12px', overflow: 'hidden',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                        <img src={PHENYL_SCREENSHOTS[2]}
                             alt="Phenyl marketing site"
                             style={{ width: '100%', height: 'auto', display: 'block' }} />
                    </motion.div>
                </section>

                {/* Background */}
                <section style={{ padding: '6rem 0', borderTop: '1px solid var(--border-color)' }}>
                    <div className="page-grid">
                        <span className="section-label" style={{ paddingTop: '0.5rem' }}>Background</span>
                        <div className="section-content">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                style={{
                                    fontSize: '2.5rem', fontWeight: 400, lineHeight: 1.2,
                                    marginBottom: '2rem', maxWidth: '20ch'
                                }}>
                                Why I built this
                            </motion.h2>
                            <div style={{
                                color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7,
                                display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '55ch'
                            }}>
                                <p>
                                    Custom perfume is one of the oldest forms of bespoke craft and one of the worst-served by software. Most apps that touch fragrance push you toward a SKU. Phenyl pushes you toward a composition.
                                </p>
                                <p>
                                    The categorization engine alone took 25 cycles of automated review to land at 98.5% coverage of the materials library. The concierge runs on the same agent framework as the rest of the workspace, which means it has long memory: it remembers what you reacted to last time, and what you steered away from.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer CTA */}
                <section style={{ padding: '4rem 0', borderTop: '1px solid var(--border-color)' }}>
                    <div className="page-grid" style={{ alignItems: 'center' }}>
                        <div className="cw-cta-text">
                            <p style={{ fontSize: '1.5rem', fontWeight: 400, marginBottom: '0.5rem' }}>
                                Try Phenyl
                            </p>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                Concierge live at phenyl.klerb.io
                            </p>
                        </div>
                        <div className="cw-cta-button">
                            <a href="https://phenyl.klerb.io" target="_blank" rel="noopener noreferrer" style={{
                                display: 'inline-block',
                                background: '#fff', color: '#000',
                                padding: '1rem 2rem', borderRadius: '50px',
                                fontWeight: 500, textDecoration: 'none', fontSize: '1rem'
                            }}>
                                Open Phenyl
                            </a>
                        </div>
                    </div>
                </section>

                <div className="page-grid" style={{
                    paddingTop: '2rem',
                    borderTop: '1px solid var(--border-color)',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)'
                }}>
                    <Link to="/" style={{ textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                        Back to Home
                    </Link>
                </div>
            </motion.div>
        </article>
    );
};

export default PhenylPromo;
