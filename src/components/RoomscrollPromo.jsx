import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';

const RoomscrollPromo = () => {
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
                    background: '#080a0c'
                }}>
                    {/* Screenshot Background */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 0,
                        opacity: 0.35,
                        filter: 'brightness(0.7)'
                    }}>
                        <img
                            src="/images/roomscroll/roomscroll-hero.png"
                            alt=""
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(to right, rgba(8,10,12,0.95) 0%, rgba(8,10,12,0.6) 50%, rgba(8,10,12,0.2) 100%)'
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
                                A Window to<br />the Outside
                            </motion.h1>
                            <motion.p variants={item} style={{
                                fontSize: '1.1rem',
                                color: 'rgba(255,255,255,0.7)',
                                maxWidth: '90%',
                                marginBottom: '2.5rem',
                                lineHeight: 1.6
                            }}>
                                A VS Code extension that fills your screen with live outdoor streams while Claude is thinking. Surveillance grid aesthetic, hardware-accelerated video, zero effort.
                            </motion.p>
                            <motion.div variants={item}>
                                <a href="https://marketplace.visualstudio.com/items?itemName=storypixel.roomscroll" style={{
                                    display: 'inline-block',
                                    background: '#fff',
                                    color: '#000',
                                    padding: '1rem 2rem',
                                    borderRadius: '50px',
                                    fontWeight: 500,
                                    textDecoration: 'none',
                                    fontSize: '1rem'
                                }}>
                                    Get on VS Code Marketplace
                                </a>
                            </motion.div>
                        </div>

                        {/* Right: Screenshot preview */}
                        <motion.div
                            variants={item}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <div style={{
                                borderRadius: '8px',
                                overflow: 'hidden',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                                border: '1px solid rgba(90,122,90,0.2)',
                                maxWidth: '100%',
                            }}>
                                <img
                                    src="/images/roomscroll/roomscroll-3x2.png"
                                    alt="Roomscroll surveillance grid showing live outdoor streams"
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        display: 'block',
                                    }}
                                />
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Features Section */}
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
                            { number: '01', title: 'Live Outdoor Streams', text: 'Wildlife cameras, ocean cams, weather feeds, and nature channels from around the world. A rotating pool of 60+ streams, always something new.' },
                            { number: '02', title: 'Surveillance Aesthetic', text: 'Dark theme with green accents, scanline overlays, camera IDs, blinking REC indicators, and vignette effects. Each cell looks like a feed from a monitoring room.' },
                            { number: '03', title: 'Smart Activation', text: 'Detects when Claude is thinking and you are idle. The grid appears automatically, and disappears when you start typing again.' },
                            { number: '04', title: 'Hardware Video Decoding', text: 'Custom WebCodecs pipeline using macOS VideoToolbox for H.264 decoding. Bypasses VS Code\'s codec limitations with a hand-built MPEG-TS demuxer.' },
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

                {/* Full-width Screenshot */}
                <section style={{
                    padding: '4rem var(--spacing-container)',
                    borderTop: '1px solid var(--border-color)',
                }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        style={{
                            borderRadius: '12px',
                            overflow: 'hidden',
                            border: '1px solid rgba(255,255,255,0.05)',
                        }}
                    >
                        <img
                            src="/images/roomscroll/roomscroll-grid-4x3.png"
                            alt="Roomscroll 4x3 grid with 12 live streams"
                            style={{ width: '100%', height: 'auto', display: 'block' }}
                        />
                    </motion.div>
                </section>

                {/* Why I Built This Section */}
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
                                    I spend hours a day in VS Code with Claude Code, and there's a lot of idle time while the AI is thinking. I'd find myself switching tabs, checking my phone, losing focus. I wanted something that kept my eyes on the screen without demanding attention.
                                </p>
                                <p>
                                    Roomscroll turns that dead time into something ambient and interesting. Live nature cams, wildlife, ocean feeds. The surveillance aesthetic makes it feel like you're monitoring the world while your code is being written. It's passive entertainment that doesn't pull you out of flow.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Technical Section */}
                <section style={{
                    padding: '6rem 0',
                    borderTop: '1px solid var(--border-color)',
                }}>
                    <div className="page-grid">
                        <span className="section-label" style={{ paddingTop: '0.5rem' }}>
                            Under the Hood
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
                                The Hard Part
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
                                    VS Code's Electron runtime ships a custom ffmpeg build that's missing the H.264 decoder. This means standard video playback simply doesn't work. HLS.js loads and buffers correctly, but the video element can never actually decode the frames.
                                </p>
                                <p>
                                    The solution was to build a complete video pipeline from scratch: a custom MPEG-TS demuxer that parses 188-byte transport stream packets, extracts H.264 NAL units, and feeds them into the WebCodecs VideoDecoder API. This uses macOS VideoToolbox for hardware-accelerated decoding, bypassing VS Code's broken ffmpeg entirely. Each grid cell renders frames directly to a canvas element.
                                </p>
                                <p>
                                    Audio follows the same pattern: ADTS frame extraction from the transport stream, fed into WebCodecs AudioDecoder with per-cell gain control. Hover a cell to hear its audio, move away to mute.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer CTA */}
                <section style={{
                    padding: '4rem 0',
                    borderTop: '1px solid var(--border-color)',
                }}>
                    <div className="page-grid" style={{ alignItems: 'center' }}>
                        <div style={{ gridColumn: '1 / 3' }}>
                            <p style={{ fontSize: '1.5rem', fontWeight: 400, marginBottom: '0.5rem' }}>
                                Try Roomscroll
                            </p>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                Free on the VS Code Marketplace
                            </p>
                        </div>
                        <div style={{ gridColumn: '3 / 5', display: 'flex', justifyContent: 'flex-end' }}>
                            <a href="https://marketplace.visualstudio.com/items?itemName=storypixel.roomscroll" style={{
                                display: 'inline-block',
                                background: '#fff',
                                color: '#000',
                                padding: '1rem 2rem',
                                borderRadius: '50px',
                                fontWeight: 500,
                                textDecoration: 'none',
                                fontSize: '1rem'
                            }}>
                                Install Extension
                            </a>
                        </div>
                    </div>
                </section>

                {/* Back to home */}
                <div className="page-grid" style={{
                    paddingTop: '2rem',
                    borderTop: '1px solid var(--border-color)',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                }}>
                    <Link to="/" style={{ textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                        Back to Home
                    </Link>
                </div>
            </motion.div>
        </article>
    );
};

export default RoomscrollPromo;
