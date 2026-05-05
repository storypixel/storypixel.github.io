import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';

const KlerbPromo = () => {
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
                <section className="promo-hero" style={{ background: '#0a4d2e' }}>
                    <div className="promo-hero-bg" style={{ opacity: 0.35 }}>
                        <img src="/images/klerb/klerb-hero.png" alt="" />
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(to right, rgba(10,77,46,0.95) 0%, rgba(10,77,46,0.6) 50%, rgba(10,77,46,0.2) 100%)'
                        }} />
                    </div>

                    <div className="promo-hero-content">
                        <div className="promo-hero-text">
                            <motion.h1 variants={item} style={{
                                fontSize: 'clamp(2.25rem, 5vw, 4.5rem)',
                                fontWeight: 400, lineHeight: 1.1,
                                marginBottom: '1.5rem', color: '#fff'
                            }}>
                                Small rooms,<br />real people.
                            </motion.h1>
                            <motion.p variants={item} style={{
                                fontSize: '1.05rem',
                                color: 'rgba(255,255,255,0.75)',
                                maxWidth: '90%', marginBottom: '2.5rem', lineHeight: 1.6
                            }}>
                                Klerb is a community platform for small invite-only groups. Voice rooms, shared classrooms, ambient presence — sized for groups where you actually know who is in the room.
                            </motion.p>
                            <motion.div variants={item}>
                                <a href="https://klerb.io" target="_blank" rel="noopener noreferrer" style={{
                                    display: 'inline-block',
                                    background: '#fff', color: '#0a4d2e',
                                    padding: '1rem 2rem', borderRadius: '50px',
                                    fontWeight: 500, textDecoration: 'none', fontSize: '1rem'
                                }}>
                                    Visit klerb.io
                                </a>
                            </motion.div>
                        </div>

                        <motion.div variants={item} className="promo-hero-screenshot">
                            <div>
                                <img src="/images/klerb/klerb-discover.png"
                                     alt="Klerb discover view" />
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
                            { number: '01', title: 'Invite-only by default', text: 'Every group is bounded. New members arrive through invitations from existing members. The platform never recommends strangers into your room.' },
                            { number: '02', title: 'Live voice rooms', text: 'Peer-to-peer audio over a custom Cloudflare TURN stack. Drop into a room, leave when done — no scheduling, no meeting links.' },
                            { number: '03', title: 'Shared classrooms', text: 'Group lessons with a companion agent. Run a study session, a critique, a book club, with a working surface that stays focused on the cohort.' },
                            { number: '04', title: 'Ambient presence', text: 'See who is around without being pinged. Klerb is designed for the time-of-day texture of a real community, not the engagement spike of a feed.' },
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
                        <img src="/images/klerb/klerb-pricing.png"
                             alt="Klerb pricing page"
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
                                    Most community apps optimize for scale, which makes them feel like everywhere and nowhere at once. Klerb is the opposite. The whole product is shaped around small, trust-rich groups — neighborhoods, alumni cohorts, study clubs, working teams.
                                </p>
                                <p>
                                    The hardest parts were the invite flow, voice connectivity across mobile carriers and home routers, and the design language. Classroom-feeling without being austere. Social without being noisy. Calm enough to live in for a while.
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
                                Try Klerb
                            </p>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                Live at klerb.io
                            </p>
                        </div>
                        <div className="cw-cta-button">
                            <a href="https://klerb.io" target="_blank" rel="noopener noreferrer" style={{
                                display: 'inline-block',
                                background: '#fff', color: '#000',
                                padding: '1rem 2rem', borderRadius: '50px',
                                fontWeight: 500, textDecoration: 'none', fontSize: '1rem'
                            }}>
                                Open Klerb
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

export default KlerbPromo;
