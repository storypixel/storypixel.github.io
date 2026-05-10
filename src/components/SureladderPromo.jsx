import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import { projectDetails } from '../data/projects';

const SURELADDER_SCREENSHOTS = projectDetails.sureladder.heroImages.slice(0, 3);

const SureladderPromo = () => {
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
                <section className="promo-hero" style={{ background: '#1c1a2e' }}>
                    <div className="promo-hero-bg" style={{ opacity: 0.3 }}>
                        <img src={SURELADDER_SCREENSHOTS[1] || SURELADDER_SCREENSHOTS[0]} alt="" />
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(to right, rgba(28,26,46,0.95) 0%, rgba(28,26,46,0.65) 50%, rgba(28,26,46,0.25) 100%)'
                        }} />
                    </div>

                    <div className="promo-hero-content">
                        <div className="promo-hero-text">
                            <motion.h1 variants={item} style={{
                                fontSize: 'clamp(2.25rem, 5vw, 4.5rem)',
                                fontWeight: 400, lineHeight: 1.1,
                                marginBottom: '1.5rem', color: '#fff'
                            }}>
                                ERP therapy,<br />one rung at a time.
                            </motion.h1>
                            <motion.p variants={item} style={{
                                fontSize: '1.05rem',
                                color: 'rgba(255,255,255,0.75)',
                                maxWidth: '90%', marginBottom: '2.5rem', lineHeight: 1.6
                            }}>
                                Sureladder is an Exposure & Response Prevention companion for kids with OCD and the parents and clinicians guiding them. Climb a ladder of small daily exposures with the support team behind you.
                            </motion.p>
                            <motion.div variants={item}>
                                <span style={{
                                    display: 'inline-block',
                                    background: 'rgba(255,255,255,0.1)',
                                    color: '#fff',
                                    padding: '1rem 2rem',
                                    borderRadius: '50px',
                                    fontWeight: 500, fontSize: '1rem',
                                    border: '1px solid rgba(255,255,255,0.2)'
                                }}>
                                    Coming to iOS
                                </span>
                            </motion.div>
                        </div>

                        <motion.div variants={item} className="promo-hero-screenshot">
                            <div>
                                <img src={SURELADDER_SCREENSHOTS[0]} alt="Sureladder ERP screen" />
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
                            { number: '01', title: 'Patient mode for kids', text: 'A daily ladder of exposure tasks framed for a young user. Earn rungs as you go. Designed soft enough that kids actually open it, structured enough that the clinical work shows up.' },
                            { number: '02', title: 'Clinician mode for therapists', text: 'A configurable session view with alarm tracking, belief-evidence cards, and per-patient ladder editing. Built around the rhythm of an actual ERP session, not a generic checklist.' },
                            { number: '03', title: 'Belief-evidence cards', text: 'Tap-through cards that surface the specific beliefs behind each exposure and the evidence the patient has gathered against them — the core of what makes ERP work over time.' },
                            { number: '04', title: 'Parent visibility', text: 'A guardian view that shows progress and effort without exposing every private moment. Trust without surveillance.' },
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

                {/* Mockup gallery */}
                <section style={{ padding: '4rem var(--spacing-container)', borderTop: '1px solid var(--border-color)' }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {SURELADDER_SCREENSHOTS.map((src, i) => (
                            <motion.div
                                key={src}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                style={{
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    background: '#0d0c1a'
                                }}>
                                <img src={src} alt={`Sureladder screen ${i + 1}`}
                                     style={{ width: '100%', height: 'auto', display: 'block' }} />
                            </motion.div>
                        ))}
                    </div>
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
                                    Exposure & Response Prevention is the gold standard for treating OCD, but the workbook-and-photocopy era is rough on kids. They lose the page. They forget the wins. The clinician spends a third of the session reconstructing what happened between visits.
                                </p>
                                <p>
                                    Sureladder turns the homework into a structured, chartable practice. The visual language took four design rounds to land — soft enough that a 10-year-old wants to open it, structured enough that a clinician trusts the data.
                                </p>
                            </div>
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

export default SureladderPromo;
