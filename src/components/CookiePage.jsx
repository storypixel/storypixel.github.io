import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navigation from './Navigation';

const CookiePage = () => {
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

    const ingredients = [
        '1 stick (1/2 cup) unsalted butter, softened well',
        '3/4 cup sugar',
        '1 large egg',
        '3/4 cup plus 2 tablespoons all-purpose flour',
        '1/2 teaspoon baking soda',
        '1/4 cup chopped dried apricots',
        '2 tablespoons finely chopped fresh sage leaves',
        '1/2 cup cornmeal',
        '1/2 teaspoon salt',
    ];

    const steps = [
        { title: 'Preheat', text: 'Oven to 350\u00B0F. Lightly grease 2 baking sheets.' },
        { title: 'Mix', text: 'Whisk together butter, sugar, and egg until smooth. Sift in flour and baking soda. Add apricots, sage, cornmeal, and salt. Stir until just combined.' },
        { title: 'Bake', text: 'Drop tablespoons of dough about 1 inch apart onto baking sheets. Bake in batches in the middle of the oven for 10 minutes, or until pale golden. Cool on sheets 2 minutes, then transfer to a rack.' },
    ];

    const reviews = [
        { name: 'storypixel9467', text: "It's incredible, use fresh sage if you can and highest quality no-sugar-added apricots e.g. Trader Joe's organic Turkish unsulphured." },
        { name: 'robynruffi', text: "I have been making these cookies for a while now and they never disappoint! The sage adds an earthy element that enhances the apricots and the cornmeal gives them a wonderful bit of crunch. These are my son's favorite cookie." },
        { name: 'aperloe', text: "So, so good. The sage gives the cookies a really unique taste, yet they're not over the top. They're great for potlucks, picnics, BBQs, since they're a mix between sweet and savory." },
        { name: 'kldckldc', text: "Darn good cookies made as written. In fact, my hair stylist requests these cookies instead of a tip! Use the finer cornmeal and you will be fine." },
    ];

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
                    minHeight: '70vh',
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '6rem',
                    marginLeft: 'var(--spacing-container)',
                    marginRight: 'var(--spacing-container)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #2a1f14 0%, #1a1206 50%, #0d0a05 100%)',
                }}>
                    {/* Warm texture overlay */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'radial-gradient(ellipse at 70% 50%, rgba(200, 150, 80, 0.08) 0%, transparent 70%)',
                        zIndex: 0,
                    }} />

                    {/* Content */}
                    <div style={{
                        position: 'relative',
                        zIndex: 1,
                        width: '100%',
                        padding: '4rem',
                        maxWidth: '900px',
                    }}>
                        <motion.div variants={item} style={{
                            fontSize: '0.75rem',
                            color: 'rgba(255,255,255,0.4)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            marginBottom: '2rem',
                        }}>
                            Gourmet / Epicurious / August 2004
                        </motion.div>

                        <motion.h1 variants={item} style={{
                            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                            fontWeight: 400,
                            lineHeight: 1.1,
                            marginBottom: '1.5rem',
                            color: '#fff',
                        }}>
                            Apricot, Cornmeal,<br />and Sage Cookies
                        </motion.h1>

                        <motion.p variants={item} style={{
                            fontSize: '1.1rem',
                            color: 'rgba(255,255,255,0.5)',
                            maxWidth: '50ch',
                            lineHeight: 1.6,
                            marginBottom: '2rem',
                        }}>
                            A sweet and savory cookie that shouldn't work but absolutely does. Cornmeal crunch, Turkish apricot sweetness, and fresh sage earthiness in every bite.
                        </motion.p>

                        <motion.div variants={item} style={{
                            display: 'flex',
                            gap: '3rem',
                            fontSize: '0.85rem',
                            color: 'rgba(255,255,255,0.4)',
                        }}>
                            <div>
                                <div style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500, marginBottom: '0.25rem' }}>Yield</div>
                                ~18 cookies
                            </div>
                            <div>
                                <div style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500, marginBottom: '0.25rem' }}>Time</div>
                                25 min
                            </div>
                            <div>
                                <div style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500, marginBottom: '0.25rem' }}>Rating</div>
                                4.4 / 5
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Ingredients Section */}
                <section style={{
                    padding: '4rem 0',
                    borderTop: '1px solid var(--border-color)',
                }}>
                    <div className="page-grid">
                        <span className="section-label" style={{ paddingTop: '0.25rem' }}>
                            Ingredients
                        </span>
                        <div className="section-content">
                            <ul style={{
                                listStyle: 'none',
                                padding: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.75rem',
                            }}>
                                {ingredients.map((ing, i) => (
                                    <motion.li
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.3, delay: i * 0.03 }}
                                        style={{
                                            fontSize: '1rem',
                                            color: 'var(--text-secondary)',
                                            paddingBottom: '0.75rem',
                                            borderBottom: '1px solid var(--border-color)',
                                        }}
                                    >
                                        {ing}
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Preparation Section */}
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
                            Preparation
                        </motion.h2>
                    </div>

                    <div style={{ padding: '0 var(--spacing-container)' }}>
                        {steps.map((step, i) => (
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
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                <div className="section-content">
                                    <h3 style={{
                                        fontSize: '1.5rem',
                                        fontWeight: 500,
                                        marginBottom: '0.75rem',
                                    }}>
                                        {step.title}
                                    </h3>
                                    <p style={{
                                        color: 'var(--text-secondary)',
                                        maxWidth: '50ch',
                                        lineHeight: 1.6,
                                    }}>
                                        {step.text}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Field Notes Section */}
                <section style={{
                    padding: '6rem 0',
                    borderTop: '1px solid var(--border-color)',
                }}>
                    <div className="page-grid">
                        <span className="section-label" style={{ paddingTop: '0.5rem' }}>
                            Field Notes
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
                                Twenty Years of This Cookie
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
                                    I found this recipe in Gourmet magazine in 2004 and it immediately became one of those rare things you make once and never stop making. The combination sounds strange on paper, but fresh sage with dried apricots and cornmeal creates something that lives in the space between sweet and savory.
                                </p>
                                <p>
                                    Use fresh sage. Use the best Turkish apricots you can find. Use fine cornmeal, not coarse. These three things are the difference between a good cookie and the cookie your hair stylist requests instead of a tip.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Reviews Section */}
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
                            Reviews
                        </motion.h2>
                    </div>

                    <div style={{ padding: '0 var(--spacing-container)' }}>
                        {reviews.map((review, i) => (
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
                                    {review.name}
                                </span>
                                <div className="section-content">
                                    <p style={{
                                        color: 'var(--text-secondary)',
                                        maxWidth: '55ch',
                                        lineHeight: 1.6,
                                        fontStyle: 'italic',
                                    }}>
                                        "{review.text}"
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Source Credit */}
                <div className="page-grid" style={{
                    paddingTop: '2rem',
                    borderTop: '1px solid var(--border-color)',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                }}>
                    <span style={{ gridColumn: '1 / -1' }}>
                        Originally published in Gourmet, August 2004. Via Epicurious.
                    </span>
                </div>
            </motion.div>
        </article>
    );
};

export default CookiePage;
