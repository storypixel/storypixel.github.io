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
                    Privacy
                </h1>

                <div style={{
                    fontSize: '1.1rem',
                    lineHeight: 1.6,
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem'
                }}>
                    <p>
                        This site does not collect personal data. No accounts, no cookies
                        beyond what the hosting provider requires, no analytics that
                        identify individual users.
                    </p>

                    <p>
                        Questions? <a href="mailto:storypixel@gmail.com" style={{ color: '#fff', textDecoration: 'underline' }}>storypixel@gmail.com</a>
                    </p>
                </div>
            </motion.div>
        </article>
    );
};

export default Privacy;
