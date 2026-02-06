import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Privacy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    maxWidth: '800px',
                    margin: '0 auto',
                    padding: '0 var(--spacing-container)'
                }}
            >
                <h1 style={{
                    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                    fontWeight: 500,
                    marginBottom: '3rem',
                    lineHeight: 1.1
                }}>
                    Privacy Policy
                </h1>

                <div style={{
                    fontSize: '1.1rem',
                    lineHeight: 1.6,
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem'
                }}>
                    <p>
                        <strong>Last updated: December 26, 2024</strong>
                    </p>
                    <p>
                        Calcuweighter is a barbell plate calculator app developed by Storypixel.
                    </p>

                    <h2 style={{ fontSize: '1.5rem', color: '#fff', marginTop: '1rem' }}>Data Stored Locally</h2>
                    <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <li><strong>Personal Records (PRs):</strong> Stored locally on your device.</li>
                        <li><strong>Preferences:</strong> Settings stored locally.</li>
                        <li><strong>No Account Required:</strong> Works entirely offline.</li>
                    </ul>

                    <h2 style={{ fontSize: '1.5rem', color: '#fff', marginTop: '1rem' }}>Camera Feature</h2>
                    <p>
                        Photos are sent to Google Gemini API for text recognition to extract workout information. Photos are:
                    </p>
                    <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <li><strong>Not stored</strong> on any server</li>
                        <li><strong>Not linked</strong> to your identity (no user accounts exist)</li>
                        <li><strong>Not used for tracking</strong> or advertising purposes</li>
                    </ul>

                    <h2 style={{ fontSize: '1.5rem', color: '#fff', marginTop: '1rem' }}>Voice Input Feature</h2>
                    <p>
                        Audio is processed on-device using Apple's Speech Recognition. Transcribed text is interpreted locally.
                    </p>

                    <h2 style={{ fontSize: '1.5rem', color: '#fff', marginTop: '1rem' }}>What We Don't Collect</h2>
                    <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <li>No personal information</li>
                        <li>No analytics or tracking</li>
                        <li>No advertising</li>
                        <li>No location data</li>
                    </ul>

                    <h2 style={{ fontSize: '1.5rem', color: '#fff', marginTop: '1rem' }}>Data Deletion</h2>
                    <p>
                        Deleting the app removes all data.
                    </p>

                    <h2 style={{ fontSize: '1.5rem', color: '#fff', marginTop: '1rem' }}>Contact</h2>
                    <p>
                        Questions? Email <a href="mailto:privacy@storypixel.io" style={{ color: '#fff', textDecoration: 'underline' }}>privacy@storypixel.io</a>
                    </p>
                </div>
            </motion.div>
        </article>
    );
};

export default Privacy;
