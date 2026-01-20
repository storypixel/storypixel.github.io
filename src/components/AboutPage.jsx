import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';

const Section = ({ title, children, delay }) => (
    <motion.div
        className="content-grid"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.8 }}
        style={{
            paddingTop: '4rem',
            paddingBottom: '4rem',
            borderTop: '1px solid var(--border-color)',
        }}
    >
        <h3 className="section-label">{title}</h3>
        <div className="section-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {children}
        </div>
    </motion.div>
);

const AboutPage = () => {
    return (
        <article style={{ minHeight: '100vh', paddingBottom: '10vh' }}>
            <Navigation />

            <div style={{ paddingTop: '8rem' }}>
                {/* Hero section with grid */}
                <div className="page-grid" style={{ marginBottom: '4rem' }}>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                            gridColumn: '1 / 3',
                            fontSize: 'clamp(3rem, 6vw, 5rem)',
                            lineHeight: 1.1,
                            fontWeight: 400,
                        }}
                    >
                        Facts.
                    </motion.h1>
                </div>

                {/* Main content grid */}
                <div className="page-grid" style={{ marginBottom: '6rem' }}>
                    {/* Image in columns 1-2 */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        style={{
                            gridColumn: '1 / 3',
                            aspectRatio: '3/4',
                            background: '#222',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <img
                            src="/not-sam.svg"
                            alt="Sam Wilson"
                            style={{ width: '60%', height: 'auto', opacity: 0.8 }}
                        />
                    </motion.div>

                    {/* Bio content in columns 3-4 */}
                    <div style={{ gridColumn: '3 / 5', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                        >
                            <p style={{ fontSize: '1.25rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                                I am Sam Wilson, a dev living in Austin, Texas. The calligraphy on the office whiteboards is my fault.
                            </p>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                                I work at H-E-B Digital where I help craft online experiences which connect our customers to their goals. It is a wonderful place to work because people genuinely just want to do right by the customers.
                            </p>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                My real name is Jeremy. My grandmother just called me Sam so much I thought it was my name.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                        >
                            <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Expertise</h3>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '1rem' }}>
                                <li>iOS / Swift Development</li>
                                <li>React & Vue</li>
                                <li>User Experience</li>
                                <li>Web Development</li>
                                <li>Android Development</li>
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                        >
                            <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Contact</h3>
                            <a href="mailto:jeremy@storypixel.io" style={{ fontSize: '1rem', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                                jeremy@storypixel.io
                            </a>
                        </motion.div>
                    </div>
                </div>

                {/* Extended Bio Sections - using universal grid */}
                <div style={{ padding: '0 var(--spacing-container)' }}>
                    <Section title="Code" delay={0.1}>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                            Even in the editor, I have the user in mind. JavaScript is the means, but good experience is always my goal. Currently enjoying React, Vue, WebAssembly, Mithril, and Android development.
                        </p>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                            I started app development at a concierge kiosk startup in 2001. My Flash interface was in local news footage. I was over the moon.
                        </p>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                            In 2004 I transitioned from Flash to JavaScript, HTML, and CSS. About ten years later I was hired to EllisLab's small remote team. There is something to be said for the pocket cultures within the tech and design space. I learned a lot and met some great folks.
                        </p>
                    </Section>

                    <Section title="Random" delay={0.2}>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                            I used to have a dog named Puff and he had issues with chronic licking.
                        </p>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                            In my early twenties, most nights I'd lose track of time while working. Afterwards I'd go to Wendy's because it was next to the office, and get a burger and fries. One day I was doing pull-ups casually and passed out. This was the moment that got me into fitness and nutrition.
                        </p>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                            The sun makes me sneeze. This is called Photic Sneeze Reflex. I don't think of it as a problem though, sneezing rules.
                        </p>
                    </Section>

                    <Section title="Creative Habits" delay={0.3}>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                            For me, the harder the creative work is to start, the less likely it is I'll do it. It's why I love calligraphy. It's easy to do something cool quickly.
                        </p>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                            Cooking, especially baking, is something I really enjoy and a creative outlet. My best cookies involve sage and apricot.
                        </p>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                            One of my happy spaces is Figure 8 coffee shop, and not just because I'm addicted to three espressos per diem. Which I totally am.
                        </p>
                    </Section>

                    <Section title="Recreation" delay={0.4}>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                            Exercise is underrated. Training from Jhonphillip Yonan (not a misspelling) gave me back the command of my body.
                        </p>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                            I broke my wrist skateboarding down a long hill in Glasgow, Kentucky. This was a hard way to learn about the power of the long tail.
                        </p>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                            I play on a dodgeball team in Austin Social Sports League.
                        </p>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                            I am not Sam, but I go by that name and I make apps and stuff on the internet. Thanks for visiting my site.
                        </p>
                    </Section>
                </div>
            </div>
        </article>
    );
};

export default AboutPage;
