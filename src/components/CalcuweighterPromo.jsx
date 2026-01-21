import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import Phone3D from './Phone3D';

const CalcuweighterPromo = () => {
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
                    minHeight: '80vh',
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '6rem',
                    marginLeft: 'var(--spacing-container)',
                    marginRight: 'var(--spacing-container)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: '#000'
                }}>
                    {/* Collage Background */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        zIndex: 0,
                        opacity: 0.3,
                        filter: 'grayscale(100%) brightness(0.7)'
                    }}>
                        {[
                            '/images/calcuweighter-model-1.png',
                            '/images/calcuweighter-model-2.png',
                            '/images/calcuweighter-model-3.png',
                            '/images/calcuweighter-model-4.png'
                        ].map((src, i) => (
                            <div key={i} style={{ flex: 1, height: '100%', overflow: 'hidden' }}>
                                <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        ))}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)'
                        }} />
                    </div>

                    {/* Content Overlay */}
                    <div style={{
                        position: 'relative',
                        zIndex: 1,
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        width: '100%',
                        height: '100%',
                        padding: '4rem',
                        gap: '2rem'
                    }}>
                        {/* Left: Text */}
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <motion.h1 variants={item} style={{
                                fontSize: 'clamp(3rem, 5vw, 4.5rem)',
                                fontWeight: 400,
                                lineHeight: 1.1,
                                marginBottom: '1.5rem',
                                color: '#fff'
                            }}>
                                Focus on Lifting,<br />Not Math
                            </motion.h1>
                            <motion.p variants={item} style={{
                                fontSize: '1.1rem',
                                color: 'rgba(255,255,255,0.7)',
                                maxWidth: '90%',
                                marginBottom: '2.5rem',
                                lineHeight: 1.6
                            }}>
                                The ultimate percentage calculator for strength training. Get instant plate math via voice, camera, or touch.
                            </motion.p>
                            <motion.div variants={item}>
                                <a href="https://apps.apple.com/app/id6756983846" style={{
                                    display: 'inline-block',
                                    background: '#fff',
                                    color: '#000',
                                    padding: '1rem 2rem',
                                    borderRadius: '50px',
                                    fontWeight: 500,
                                    textDecoration: 'none',
                                    fontSize: '1rem'
                                }}>
                                    Get Calcuweighter
                                </a>
                            </motion.div>
                        </div>

                        {/* Right: 3D Phone */}
                        <div style={{
                            height: '600px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Phone3D screenshots={[
                                '/images/calcuweighter/01-onboarding.png',
                                '/images/calcuweighter/05-main-workout.png',
                                '/images/calcuweighter/06-percentage-grid.png',
                                '/images/calcuweighter/07-multiple-lifts.png'
                            ]} />
                        </div>
                    </div>
                </section>

                {/* Features Section - using universal grid */}
                <section style={{
                    padding: '4rem 0',
                    borderTop: '1px solid var(--border-color)',
                }}>
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
                            { number: '01', title: 'Photo Magic', text: "Snap the gym's whiteboard. App reads percentages and calculates your weights." },
                            { number: '02', title: 'Voice Input', text: 'Say "80% deadlifts, then 70, 80, 90 percent back squats" and see your plate breakdowns instantly. Completely hands-free.' },
                            { number: '03', title: 'Zero Mental Math', text: 'Your PRs are saved. Pick percentages. See exact plate breakdowns. Done.' }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                className="content-grid"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-10%" }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                style={{
                                    borderBottom: '1px solid var(--border-color)',
                                    paddingTop: '2rem',
                                    paddingBottom: '2rem',
                                }}
                            >
                                <span className="section-label" style={{ paddingTop: '0.25rem' }}>
                                    {feature.number}
                                </span>
                                <div className="section-content">
                                    <h3 style={{
                                        fontSize: '1.5rem',
                                        fontWeight: '500',
                                        marginBottom: '0.75rem',
                                    }}>
                                        {feature.title}
                                    </h3>
                                    <p style={{
                                        color: 'var(--text-secondary)',
                                        maxWidth: '50ch',
                                        lineHeight: '1.6',
                                    }}>
                                        {feature.text}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Why I Built This Section - using universal grid */}
                <section style={{
                    padding: '6rem 0',
                    borderTop: '1px solid var(--border-color)',
                }}>
                    <div className="page-grid">
                        <span className="section-label" style={{ paddingTop: '0.5rem' }}>
                            Background
                        </span>
                        <div className="section-content">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                style={{
                                    fontSize: '2.5rem',
                                    fontWeight: 400,
                                    lineHeight: 1.2,
                                    marginBottom: '2rem',
                                    maxWidth: '20ch',
                                }}
                            >
                                Why I Built This
                            </motion.h2>
                            <div style={{
                                color: 'var(--text-secondary)',
                                fontSize: '1rem',
                                lineHeight: 1.7,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1.5rem',
                                maxWidth: '55ch',
                            }}>
                                <p>
                                    I've been lifting for years, and every session used to involve the same frustrating dance: staring at the gym whiteboard, pulling out my phone, opening the calculator app, and doing fractional math just to figure out what plates to put on the bar. It was a constant distraction that took me out of the zone.
                                </p>
                                <p>
                                    I wanted a tool that felt invisible. No typing, no mental gymnastics. Just point a camera at the whiteboard or speak the percentages, and instantly see the exact plate layout. I built Calcuweighter to solve my own problem, so I could focus on the lift, not the math.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer CTA - using universal grid */}
                <section style={{
                    padding: '4rem 0',
                    borderTop: '1px solid var(--border-color)',
                }}>
                    <div className="page-grid" style={{ alignItems: 'center' }}>
                        <div style={{ gridColumn: '1 / 3' }}>
                            <p style={{ fontSize: '1.5rem', fontWeight: 400, marginBottom: '0.5rem' }}>
                                Ready to simplify your workouts?
                            </p>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                Available on iOS and Apple Watch
                            </p>
                        </div>
                        <div style={{ gridColumn: '3 / 5', display: 'flex', justifyContent: 'flex-end' }}>
                            <a href="https://apps.apple.com/app/id6756983846" style={{
                                display: 'inline-block',
                                background: '#fff',
                                color: '#000',
                                padding: '1rem 2rem',
                                borderRadius: '50px',
                                fontWeight: 500,
                                textDecoration: 'none',
                                fontSize: '1rem'
                            }}>
                                Download on App Store
                            </a>
                        </div>
                    </div>
                </section>

                {/* Privacy Link */}
                <div className="page-grid" style={{
                    paddingTop: '2rem',
                    borderTop: '1px solid var(--border-color)',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                }}>
                    <Link to="/privacy" style={{ textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                        Privacy Policy
                    </Link>
                </div>
            </motion.div>
        </article>
    );
};

export default CalcuweighterPromo;
