import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Section = ({ title, children, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.8 }}
        style={{ marginBottom: '6rem' }}
    >
        <h3 style={{
            fontSize: '0.9rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '2rem',
            color: 'var(--text-secondary)',
            borderBottom: '1px solid #333',
            paddingBottom: '1rem'
        }}>
            {title}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {children}
        </div>
    </motion.div>
);

const AboutPage = () => {
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
                    ← Back
                </Link>
            </div>

            <div style={{ padding: '0 var(--spacing-container)', maxWidth: '900px', margin: '0 auto' }}>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                        fontSize: 'clamp(3rem, 6vw, 5rem)',
                        lineHeight: 1,
                        marginBottom: '4rem',
                    }}
                >
                    Facts.
                </motion.h1>

                <Section title="About Myself" delay={0.1}>
                    <p className="thought">I am <span style={{ color: '#fff' }}>Sam Wilson</span>, a dev living in Austin, Texas. The calligraphy on the office whiteboards is my fault. Pumped on <a href="https://medium.com/@samwilson_73699/strategy-vs-tactics-in-dodgeball-eb62caf36c6f" style={{ color: '#fff' }}>dodgeball</a>.</p>
                    <p className="thought">I used to have a dog named Puff and he had issues with chronic licking.</p>
                </Section>

                <Section title="Involving My Code" delay={0.2}>
                    <p className="thought">Even in the editor, I have the user in mind. JavaScript is the means, but good experience is always my goal. Currently enjoying React, Vue, WebAssembly, Mithril, and Android development.</p>
                    <p className="thought">I work at <a href="https://digital.heb.com" style={{ color: '#fff' }}>H-E-B Digital</a> where I help craft online experiences which connect our customers to their goals. It is a wonderful place to work because people genuinely just want to do right by the customers.</p>
                    <p className="thought">My real name is Jeremy. My grandmother just called me Sam so much I thought it was my name. She did this, in part, to irk my father who chose and liked the name Jeremy.</p>
                    <p className="thought">I started app development at a concierge kiosk startup in 2001. My Flash interface was in local news footage. I was over the moon. My mom cared but no one else really did.</p>
                    <p className="thought">Near the end a sales guy came up to me and said, in the context of a huge contract for becoming a data provider, "Hey I told Lycos we know XML. Do we?"</p>
                    <p className="thought">In 2004 I transitioned from Flash to JavaScript, HTML, and CSS. At the time ExpressionEngine was a big deal, so I worked a lot in that. About ten years later I was hired to their small remote team, EllisLab. There is something to be said for the pocket cultures within the tech and design space. I learned a lot and met some great folks.</p>
                </Section>

                <Section title="Of a Random Kind" delay={0.3}>
                    <p className="thought">In my early twenties, most nights I'd lose track of time while working. Afterwards I'd go to Wendy's because it was next to the office, and get a burger and fries. Maybe I did this too much because one day I was doing pull-ups casually and passed out. This was the moment that got me into fitness and nutrition.</p>
                    <p className="thought">I have an amazing girlfriend named Laura she's the funniest person I know with the best eyebrows on the planet.</p>
                </Section>

                <Section title="On Creative Habits" delay={0.4}>
                    <p className="thought">For me, the harder the creative work is to start, the less likely it is I'll do it. It's why I love calligraphy. It's easy to do something cool quickly. Oil painting, while amazing and fun, has a higher threshold of effort therefore I don't paint much.</p>
                    <p className="thought">Cooking, especially baking, is something I really enjoy and a creative outlet. My best cookies involve sage and apricot.</p>
                    <p className="thought">One of my happy spaces is Figure 8 coffee shop, and not just because I'm addicted to three espressos per diem. Which I totally am.</p>
                </Section>

                <Section title="About My Softer Side" delay={0.5}>
                    <p className="thought">Growing up in a small town in Kentucky, most folks were extroverted. And although I lived in a slightly larger Lexington for several years, I moved to Pittsburgh. Here I experienced some culture shock, which I kinda needed. Though it wasn't for me long-term, I came out of Pittsburgh with crucial friendships and experiences that I can't imagine missing out on.</p>
                    <p className="thought">The way my children revere me reminds me that they share in all of my successes as well as any of my failures. The risk inherent in anything I consider is shared by them. It's a good thing.</p>
                    <p className="thought">To my occasional chagrin, I find it hard to dislike people even if they are at first unfriendly. When someone is antagonistic or off-putting, I tend to try to win them over or figure out why they are that way. I've made a lot of friends this way and I find first impressions are only true half the time. But also not everyone is going to love me and I'm okay with that these days.</p>
                </Section>

                <Section title="Assorted" delay={0.6}>
                    <p className="thought">I suffered daily headaches as a child. These headaches could make me throw up. Out of necessity, I knelt down similar to how a toddler naps. I'd put my forehead on the ground and would then visualize my pain as a red syrupy substance leaving the front of my head through a small hole, draining down into the Earth. It took about 20 minutes and then I felt better.</p>
                    <p className="thought">The sun makes me sneeze, this is called Photic Sneeze Reflex. I don't think of it as a problem though, sneezing rules.</p>
                    <p className="thought">My escape hatch for insomnia is a book on pop chemistry on my iPad. When I can't sleep I break it open. Three to ten paragraphs in and it's Snoozington.</p>
                    <p className="thought">When I was 4 years old, I got a Suzuki JR 50 with training wheels. I didn't die on it, but I did get a scar on my leg that looked like the parallel grill marks on a burger.</p>
                </Section>

                <Section title="On My Recreation" delay={0.7}>
                    <p className="thought">Exercise is underrated. <a href="https://www.muvintegrated.com/" style={{ color: '#fff' }}>Training</a> from Jhonphillip Yonan (not a misspelling) gave me back the command of my body.</p>
                    <p className="thought">I broke my wrist skateboarding down a long hill in Glasgow, Kentucky. This was a hard way to learn about the power of the long tail.</p>
                    <p className="thought">I play on a dodgeball team in Austin Social Sports League.</p>
                    <p className="thought">I am not Sam, but I go by that name and I make apps and stuff on the internet. Thanks for visiting my site.</p>
                </Section>
            </div>
            <style>{`
                .thought {
                    font-size: 1.1rem;
                    line-height: 1.6;
                    color: var(--text-secondary);
                }
            `}</style>
        </article>
    );
};

export default AboutPage;
