import{b as n,j as e,m as i,L as c}from"./vendor-D4QWGx82.js";import{N as l}from"./index-aLKgDymD.js";import"./three-CbER0GNn.js";const p=()=>{n.useEffect(()=>{window.scrollTo(0,0)},[]);const o={hidden:{opacity:0},show:{opacity:1,transition:{staggerChildren:.1}}},s={hidden:{y:20,opacity:0},show:{y:0,opacity:1,transition:{duration:.5}}},t=[{bg:"#2a4a38",label:"Forest"},{bg:"#1a1a1a",label:"Carbon"},{bg:"#41747B",label:"Teal"}];return e.jsxs("article",{className:"chia-promo",children:[e.jsx(l,{}),e.jsxs(i.div,{variants:o,initial:"hidden",animate:"show",className:"chia-promo-body",children:[e.jsx(i.section,{variants:s,className:"chia-hero",children:t.map((a,r)=>e.jsx("div",{className:"chia-hero-panel",style:{backgroundColor:a.bg},children:e.jsx("img",{src:"/images/chia/chia-logo.svg",alt:r===0?"Chia":"",className:"chia-hero-logo"})},r))}),e.jsx("section",{className:"chia-intro",children:e.jsxs("div",{className:"chia-intro-grid",children:[e.jsxs(i.div,{variants:s,className:"chia-intro-meta",children:[e.jsx("p",{className:"chia-meta-label",children:"Details"}),e.jsxs("dl",{className:"chia-meta-list",children:[e.jsxs("div",{className:"chia-meta-row",children:[e.jsx("dt",{children:"Year"}),e.jsx("dd",{children:"2026"})]}),e.jsxs("div",{className:"chia-meta-row",children:[e.jsx("dt",{children:"Role"}),e.jsx("dd",{children:"Design & Development"})]}),e.jsxs("div",{className:"chia-meta-row",children:[e.jsx("dt",{children:"Stack"}),e.jsx("dd",{children:"CSS, Open Props, Custom Properties"})]})]})]}),e.jsxs(i.div,{variants:s,className:"chia-intro-content",children:[e.jsx("p",{className:"chia-intro-desc",children:"After fighting Tailwind specificity wars on a production app, I extracted the useful patterns into a standalone CSS framework. No build step, no JavaScript, no utility class soup. Just real selectors with flat specificity that work anywhere."}),e.jsxs("p",{className:"chia-intro-desc",children:["Components use ",e.jsx("code",{className:"chia-code",children:"data-slot"})," attribute selectors instead of classes. Variants with ",e.jsx("code",{className:"chia-code",children:"data-variant"}),". Flat specificity, easy overrides, works with any framework or none at all."]}),e.jsxs("div",{className:"chia-links",children:[e.jsx("a",{href:"https://iamnotsam.com/chia/",target:"_blank",rel:"noopener noreferrer",className:"chia-link-primary",children:"Live Demo &nearr;"}),e.jsx("a",{href:"https://github.com/storypixel/chia",target:"_blank",rel:"noopener noreferrer",className:"chia-link-secondary",children:"GitHub &nearr;"})]})]})]})}),e.jsxs("section",{className:"chia-section",children:[e.jsx(i.p,{variants:s,className:"chia-section-label",children:"Modules"}),e.jsx("div",{className:"chia-modules",children:[{name:"tokens.css",desc:"Design tokens for typography, radius, color, spacing, and transitions."},{name:"reset.css",desc:"Modern CSS reset with sensible defaults. No design opinions."},{name:"components.css",desc:"UI components via data-slot selectors. Button, card, badge, input, avatar."},{name:"utilities.css",desc:"Minimal layout utilities. Flex, grid, gap, padding, margin."},{name:"grid.css",desc:"CSS Grid system. Auto-fill, fixed columns, named layouts, breakpoints."},{name:"animations.css",desc:"Keyframes for fade, slide, scale, collapse, ping, shimmer, spin."}].map(a=>e.jsxs(i.div,{variants:s,className:"chia-module",children:[e.jsx("p",{className:"chia-module-name",children:a.name}),e.jsx("p",{className:"chia-module-desc",children:a.desc})]},a.name))})]}),e.jsxs("section",{className:"chia-section",children:[e.jsx(i.p,{variants:s,className:"chia-section-label",children:"Philosophy"}),e.jsx("div",{className:"chia-modules",children:[{name:"One selector per rule",desc:"No compound selectors. No nesting. Every rule targets exactly one thing."},{name:"No !important",desc:"Flat specificity so the cascade works for you, not against you."},{name:"Attributes over classes",desc:"data-slot for identity, data-variant for styling. No BEM, no utility soup."},{name:"Custom properties everywhere",desc:"Theme by overriding tokens, not by forking component CSS."},{name:"No build step",desc:"Import the CSS file. Works in a CDN link tag. No PostCSS, no config."},{name:"Framework agnostic",desc:"React, Vue, Svelte, plain HTML. Styles elements, not components."}].map(a=>e.jsxs(i.div,{variants:s,className:"chia-module",children:[e.jsx("p",{className:"chia-module-name",children:a.name}),e.jsx("p",{className:"chia-module-desc",children:a.desc})]},a.name))})]}),e.jsx("div",{className:"chia-back",children:e.jsx(c,{to:"/",children:"← Back"})})]}),e.jsx("style",{children:`
                .chia-promo { min-height: 100vh; padding-bottom: 10vh; }
                .chia-promo-body { padding-top: 8rem; }

                .chia-hero {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 0.75rem;
                    margin: 0 var(--spacing-container, 2.5rem) 6rem;
                }
                .chia-hero-panel {
                    aspect-ratio: 4/3;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                    overflow: hidden;
                }
                .chia-hero-logo {
                    width: 80%;
                    max-width: 240px;
                    height: auto;
                    object-fit: contain;
                }

                .chia-intro {
                    margin: 0 var(--spacing-container, 2.5rem) 6rem;
                }
                .chia-intro-grid {
                    display: grid;
                    grid-template-columns: var(--grid-columns, 80px 280px 1fr 160px);
                    gap: 2rem;
                }
                .chia-intro-meta { grid-column: 1 / 3; }
                .chia-intro-content { grid-column: 3 / -1; }

                .chia-meta-label {
                    color: #888;
                    font-size: 0.75rem;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    margin-bottom: 0.75rem;
                }
                .chia-meta-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    font-size: 0.9rem;
                }
                .chia-meta-row { display: flex; gap: 1rem; }
                .chia-meta-row dt { color: #888; min-width: 3rem; }

                .chia-intro-desc {
                    color: #888;
                    font-size: 0.9rem;
                    line-height: 1.6;
                    margin-bottom: 1.5rem;
                }
                .chia-code {
                    color: #fff;
                    background: rgba(255,255,255,0.08);
                    padding: 0.15rem 0.4rem;
                    border-radius: 4px;
                    font-size: 0.85rem;
                }
                .chia-links {
                    display: flex;
                    gap: 1rem;
                    flex-wrap: wrap;
                }
                .chia-link-primary {
                    color: #fff;
                    font-size: 0.9rem;
                    border-bottom: 1px solid rgba(255,255,255,0.3);
                    padding-bottom: 2px;
                }
                .chia-link-secondary {
                    color: #888;
                    font-size: 0.9rem;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                    padding-bottom: 2px;
                }

                .chia-section {
                    margin: 0 var(--spacing-container, 2.5rem) 6rem;
                    border-top: 1px solid rgba(255,255,255,0.1);
                    padding-top: 3rem;
                }
                .chia-section-label {
                    color: #888;
                    font-size: 0.75rem;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    margin-bottom: 2rem;
                }
                .chia-modules {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
                    gap: 2.5rem;
                }
                .chia-module-name {
                    font-size: 0.95rem;
                    font-weight: 500;
                    margin-bottom: 0.4rem;
                }
                .chia-module-desc {
                    color: #888;
                    font-size: 0.85rem;
                    line-height: 1.5;
                }

                .chia-back {
                    margin-left: var(--spacing-container, 2.5rem);
                    margin-bottom: 4rem;
                }
                .chia-back a { color: #888; font-size: 0.9rem; }

                @media (max-width: 768px) {
                    .chia-hero { grid-template-columns: 1fr; }
                    .chia-intro-grid { grid-template-columns: 1fr; }
                    .chia-intro-meta { grid-column: 1; }
                    .chia-intro-content { grid-column: 1; }
                }
            `})]})};export{p as default};
