import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageFader = ({ images, interval = 4000, borderRadius = '24px' }) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (!images || images.length === 0) return;
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, interval);
        return () => clearInterval(timer);
    }, [images, interval]);

    if (!images || images.length === 0) return null;

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: borderRadius, overflow: 'hidden' }}>
            <AnimatePresence mode="popLayout">
                <motion.img
                    key={images[index]}
                    src={images[index]}
                    alt={`Slide ${index}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                />
            </AnimatePresence>
        </div>
    );
};

export default ImageFader;
