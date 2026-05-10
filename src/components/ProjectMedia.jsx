import React, { useEffect, useRef, useState } from 'react';
import { getProjectMediaSrc, isProjectVideoMedia } from '../utils/projectMedia';

const usePrefersReducedMotion = () => {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined' || !window.matchMedia) return undefined;

        const query = window.matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => setPrefersReducedMotion(query.matches);

        update();
        if (query.addEventListener) {
            query.addEventListener('change', update);
            return () => query.removeEventListener('change', update);
        }

        query.addListener(update);
        return () => query.removeListener(update);
    }, []);

    return prefersReducedMotion;
};

const ProjectMedia = ({ media, alt = '', className, ...props }) => {
    const src = getProjectMediaSrc(media);
    const label = typeof media === 'string' ? alt : media?.alt || alt;
    const prefersReducedMotion = usePrefersReducedMotion();
    const [isVisible, setIsVisible] = useState(true);
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || typeof window === 'undefined' || !window.IntersectionObserver) return undefined;

        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { rootMargin: '160px 0px' }
        );

        observer.observe(video);
        return () => observer.disconnect();
    }, [src]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || prefersReducedMotion || !isVisible) {
            video?.pause();
            return;
        }

        video.muted = true;
        video.defaultMuted = true;
        const play = video.play();
        if (play?.catch) play.catch(() => {});
    }, [isVisible, prefersReducedMotion, src]);

    if (!src) return null;

    if (isProjectVideoMedia(media)) {
        const poster = typeof media === 'string' ? undefined : media?.poster;

        return (
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                aria-label={label || undefined}
                aria-hidden={label ? undefined : true}
                className={className}
                autoPlay={!prefersReducedMotion}
                muted
                loop
                playsInline
                preload="metadata"
                {...props}
            />
        );
    }

    return (
        <img
            src={src}
            alt={label}
            className={className}
            {...props}
        />
    );
};

export default ProjectMedia;
