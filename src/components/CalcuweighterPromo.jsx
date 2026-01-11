import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ImageFader from './ImageFader';

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
            <div style={{ padding: '2rem var(--spacing-container)' }}>
                <Link to="/" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '2rem'
                }}>
                    ← Home
                </Link>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                style={{
                    maxWidth: '1000px',
                    margin: '0 auto',
                    padding: '0 var(--spacing-container)'
                }}
            >
                {/* Hero */}
                <header style={{ textAlign: 'center', marginBottom: '6rem' }}>
                    <motion.h1 variants={item} style={{
                        fontSize: 'clamp(3rem, 6vw, 5rem)',
                        fontWeight: 500,
                        lineHeight: 1.1,
                        marginBottom: '1.5rem'
                    }}>
                        Stop Doing Math<br />at the Gym
                    </motion.h1>
                    <motion.p variants={item} style={{
                        fontSize: '1.25rem',
                        color: 'var(--text-secondary)',
                        maxWidth: '600px',
                        margin: '0 auto 3rem'
                    }}>
                        Snap a photo, speak your sets, or tap percentages. Your weights, calculated instantly.
                    </motion.p>
                    <motion.div variants={item}>
                        <a href="#" style={{
                            display: 'inline-block',
                            background: '#fff',
                            color: '#000',
                            padding: '1rem 2rem',
                            borderRadius: '50px',
                            fontWeight: 600,
                            textDecoration: 'none',
                            fontSize: '1.1rem'
                        }}>
                            Get Calcuweighter
                        </a>
                    </motion.div>
                </header>

                {/* Main Feature Image - Reverted to static */}
                {/* Main Feature - Magazine Layout */}
                <motion.div variants={item} style={{
                    marginBottom: '6rem',
                    height: '600px', // Fixed height for hero
                    width: '100%',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    position: 'relative'
                }}>
                    <ImageFader
                        images={[
                            '/images/calcuweighter-model-1.png',
                            '/images/calcuweighter-model-2.png',
                            '/images/calcuweighter-model-3.png',
                            '/images/calcuweighter-model-4.png',
                            '/images/calcuweighter-model-5.png',
                            '/images/calcuweighter-model-6.png'
                        ]}
                        interval={3500}
                    />
                </motion.div>

                {/* Features Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '3rem',
                    marginBottom: '6rem'
                }}>
                    {[
                        { icon: '📸', title: 'Photo Magic', text: 'Snap the gym\'s whiteboard. App reads percentages and calculates your weights.' },
                        { icon: '🎤', title: 'Voice Input', text: 'Just speak "80, 85, 90" and see your weights instantly. Completely hands-free.' },
                        { icon: '⚡', title: 'Zero Mental Math', text: 'Your PRs are saved. Pick percentages. See exact plate breakdowns. Done.' }
                    ].map((feature, i) => (
                        <motion.div key={i} variants={item} style={{
                            background: '#1a1a1a',
                            padding: '2rem',
                            borderRadius: '16px'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{feature.icon}</div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{feature.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{feature.text}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Illustration Carousel */}
                <div style={{ marginBottom: '6rem', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '3rem' }}>Built for Lifters</h2>
                    <div style={{
                        display: 'flex',
                        gap: '2rem',
                        overflowX: 'auto',
                        padding: '2rem var(--spacing-container)',
                        justifyContent: 'flex-start',
                        scrollSnapType: 'x mandatory',
                        WebkitOverflowScrolling: 'touch',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none'
                    }}>
                        {[
                            '/images/calcuweighter-model-1.png',
                            '/images/calcuweighter-model-2.png',
                            '/images/calcuweighter-model-3.png',
                            '/images/calcuweighter-model-4.png',
                            '/images/calcuweighter-model-5.png',
                            '/images/calcuweighter-model-6.png'
                        ].map((src, i) => (
                            <motion.div
                                key={i}
                                variants={item}
                                style={{
                                    minWidth: '300px', // Wider cards for landscape-ish illustrations if needed, but these are phone proportions typically
                                    height: '600px',
                                    flex: '0 0 auto',
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                                    scrollSnapAlign: 'center',
                                    // border: '1px solid rgba(255,255,255,0.1)' // Optional border for illustrations
                                }}
                            >
                                <img
                                    src={src}
                                    alt={`Calcuweighter Illustration ${i + 1}`}
                                    style={{
                                        height: '100%',
                                        width: 'auto',
                                        display: 'block'
                                    }}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>

            </motion.div>
        </article>
    );
};

export default CalcuweighterPromo;
