import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './IdiotPopup.css';

const sounds = [
    'vine-boom',
    'metal-pipe-clang',
    'wrong-answer-sound-effect',
    'taco-bell-bong-sfx',
    'bone-crack',
    'spongebob-fail',
    'm-e-o-w',
    'baby-laughing-meme',
    'yeah-boiii-i-i-i',
    'cat-laugh-meme-1',
    'ding-sound-effect_2',
];

const IdiotPopup = ({ children }) => {
    const [showing, setShowing] = useState(false);

    const trigger = useCallback(() => {
        if (showing) return;

        const sound = sounds[Math.floor(Math.random() * sounds.length)];
        const audio = new Audio(`/easter-egg/sounds/${sound}.mp3`);
        audio.play().catch(() => {});

        setShowing(true);
        setTimeout(() => setShowing(false), 1500);
    }, [showing]);

    return (
        <>
            <span onClick={trigger} style={{ cursor: 'pointer' }}>
                {children}
            </span>

            <AnimatePresence>
                {showing && (
                    <motion.div
                        className="idiot-overlay"
                        initial={{ y: '100%' }}
                        animate={{ y: '10%' }}
                        exit={{ y: '100%' }}
                        transition={{
                            enter: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                            exit: { duration: 1.8, ease: 'easeIn' },
                        }}
                    >
                        <img
                            src="/easter-egg/idiot.png"
                            alt=""
                            className="idiot-image"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default IdiotPopup;
