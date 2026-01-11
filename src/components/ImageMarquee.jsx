import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useAnimationFrame } from 'framer-motion';

const ImageMarquee = ({ images, speed = 20 }) => {
    // A simple continuous loop marquee
    // We duplicate the images to create a seamless loop
    const duplicatedImages = [...images, ...images, ...images]; // Triple to be safe for wide screens

    return (
        <div style={{
            position: 'relative',
            width: '100%',
            height: '100%', // Ensure full height
            overflow: 'hidden',
            display: 'flex',
            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
        }}>
            <motion.div
                style={{
                    display: 'flex',
                    gap: '0', // No gap
                    width: 'max-content',
                    height: '100%' // Propagate height
                }}
                animate={{
                    x: ['0%', '-33.333%']
                }}
                transition={{
                    duration: speed * 3,
                    ease: "linear",
                    repeat: Infinity
                }}
            >
                {duplicatedImages.map((src, index) => (
                    <div key={index} style={{
                        position: 'relative',
                        height: '100%', // Ensure full height fill
                        width: 'auto', // Let width be determined by aspect ratio
                        aspectRatio: '3/4', // Maintain portrait ratio
                        flexShrink: 0,
                        overflow: 'hidden'
                    }}>
                        <img
                            src={src}
                            alt={`Gallery item ${index}`}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block'
                            }}
                        />
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.6))'
                        }} />
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default ImageMarquee;
