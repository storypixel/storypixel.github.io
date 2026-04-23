import React, { useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FullscreenDemo = ({ open, onClose, title, children }) => {
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [open, onClose]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 9999,
                        background: '#0a0a0a',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                    role="dialog"
                    aria-modal="true"
                    aria-label={title}
                >
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem 1.5rem',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                        background: 'rgba(0, 0, 0, 0.6)',
                        backdropFilter: 'blur(8px)',
                    }}>
                        <span style={{
                            fontSize: '0.8rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            color: 'var(--text-secondary)',
                        }}>
                            Demo — {title}
                        </span>
                        <button
                            onClick={onClose}
                            aria-label="Close demo"
                            style={{
                                background: 'transparent',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '999px',
                                color: '#fff',
                                width: '36px',
                                height: '36px',
                                fontSize: '18px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontFamily: 'inherit',
                                lineHeight: 1,
                            }}
                        >
                            ×
                        </button>
                    </div>
                    <div style={{
                        flex: 1,
                        overflow: 'auto',
                        position: 'relative',
                    }}>
                        <Suspense fallback={
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                color: 'var(--text-secondary)',
                            }}>
                                Loading demo…
                            </div>
                        }>
                            {children}
                        </Suspense>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default FullscreenDemo;
