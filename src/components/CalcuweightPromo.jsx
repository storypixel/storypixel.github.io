import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import Phone3D from './Phone3D';
import { projectDetails } from '../data/projects';
import './CalcuweightPromo.css';

const HERO_IMAGES = projectDetails.calcuweight.heroImages.slice(0, 3);

const PHONE_SCREENSHOTS = [
    '/images/calcuweight/01-onboarding.webp',
    '/images/calcuweight/05-main-workout.webp',
    '/images/calcuweight/06-percentage-grid.webp',
    '/images/calcuweight/07-multiple-lifts.webp',
];

const FEATURES = [
    {
        number: '01',
        title: 'Photo Magic',
        text: "Snap the gym's whiteboard. App reads percentages and calculates your weights.",
    },
    {
        number: '02',
        title: 'Voice Input',
        text: 'Say "80% deadlifts, then 70, 80, 90 percent back squats" and see your plate breakdowns instantly. Completely hands-free.',
    },
    {
        number: '03',
        title: 'Zero Mental Math',
        text: 'Your PRs are saved. Pick percentages. See exact plate breakdowns. Done.',
    },
];

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

const reveal = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
};

const CalcuweightPromo = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <article className="calcuweight-page">
            <Navigation />

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="calcuweight-page-body"
            >
                <section className="calcuweight-hero-section">
                    <div className="calcuweight-hero-media" aria-hidden="true">
                        {HERO_IMAGES.map((src) => (
                            <div key={src} className="calcuweight-hero-media-panel">
                                <img src={src} alt="" loading="eager" decoding="async" />
                            </div>
                        ))}
                        <div className="calcuweight-hero-vignette" />
                    </div>

                    <div className="calcuweight-hero-grid">
                        <div className="calcuweight-hero-copy">
                            <motion.h1 variants={item} className="calcuweight-hero-title">
                                Focus on Lifting,<br />Not Math
                            </motion.h1>
                            <motion.p variants={item} className="calcuweight-hero-subtitle">
                                The ultimate percentage calculator for strength training. Get instant plate math via voice, camera, or touch.
                            </motion.p>
                            <motion.div variants={item}>
                                <a
                                    href="https://apps.apple.com/app/id6756983846"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="calcuweight-button"
                                >
                                    Get Calcuweight
                                </a>
                            </motion.div>
                        </div>

                        <div className="calcuweight-phone">
                            <Phone3D screenshots={PHONE_SCREENSHOTS} />
                        </div>
                    </div>
                </section>

                <section className="calcuweight-section">
                    <div className="page-grid">
                        <motion.h2
                            {...reveal}
                            className="section-label"
                        >
                            Features
                        </motion.h2>
                    </div>

                    <div className="calcuweight-feature-list">
                        {FEATURES.map((feature, i) => (
                            <motion.div
                                key={feature.number}
                                className="content-grid calcuweight-feature-row"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-10%' }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                            >
                                <span className="section-label calcuweight-feature-number">
                                    {feature.number}
                                </span>
                                <div className="section-content">
                                    <h3 className="calcuweight-feature-title">
                                        {feature.title}
                                    </h3>
                                    <p className="calcuweight-copy">
                                        {feature.text}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <section className="calcuweight-section calcuweight-section-large">
                    <div className="page-grid">
                        <span className="section-label calcuweight-section-marker">
                            Background
                        </span>
                        <div className="section-content">
                            <motion.h2
                                {...reveal}
                                className="calcuweight-section-title"
                            >
                                Why I Built This
                            </motion.h2>
                            <div className="calcuweight-copy-stack">
                                <p>
                                    I've been lifting for years, and every session used to involve the same frustrating dance: staring at the gym whiteboard, pulling out my phone, opening the calculator app, and doing fractional math just to figure out what plates to put on the bar. It was a constant distraction that took me out of the zone.
                                </p>
                                <p>
                                    I wanted a tool that felt invisible. No typing, no mental gymnastics. Just point a camera at the whiteboard or speak the percentages, and instantly see the exact plate layout. I built Calcuweight to solve my own problem, so I could focus on the lift, not the math.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="calcuweight-section calcuweight-cta-section">
                    <div className="page-grid calcuweight-cta-grid">
                        <div className="calcuweight-cta-text">
                            <p className="calcuweight-cta-title">
                                Ready to simplify your workouts?
                            </p>
                            <p className="calcuweight-copy">
                                Available on iOS and Apple Watch
                            </p>
                        </div>
                        <div className="calcuweight-cta-button">
                            <a
                                href="https://apps.apple.com/app/id6756983846"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="calcuweight-button"
                            >
                                Download on App Store
                            </a>
                        </div>
                    </div>
                </section>

                <section id="support" className="calcuweight-section calcuweight-section-large">
                    <div className="page-grid">
                        <span className="section-label calcuweight-section-marker">
                            Support
                        </span>
                        <div className="section-content">
                            <motion.h2
                                {...reveal}
                                className="calcuweight-section-title"
                            >
                                Need Help?
                            </motion.h2>
                            <div className="calcuweight-copy-stack">
                                <p>
                                    I built this and I actually want to hear from you if something's off. Shoot me an email and I'll get back to you.
                                </p>
                                <p>
                                    <a href="mailto:sam@iamnotsam.com" className="calcuweight-text-link">sam@iamnotsam.com</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="page-grid calcuweight-legal">
                    <Link to="/privacy" className="calcuweight-text-link">
                        Privacy Policy
                    </Link>
                </div>
            </motion.div>
        </article>
    );
};

export default CalcuweightPromo;
