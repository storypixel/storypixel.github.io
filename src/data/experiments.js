// Experiments — things I try, demo, and think out loud about.
// Each experiment has a `demo` field naming a React component from the
// demoRegistry in ExperimentPost.jsx. That component is lazy-loaded and
// launched full-screen via FullscreenDemo when the reader clicks "Launch demo".

export const experiments = [
    {
        slug: 'view-transitions',
        title: 'One Line of CSS, a Morph Between States',
        date: '2026-04-20',
        dateDisplay: 'April 2026',
        demo: 'ViewTransitions',
        excerpt: 'document.startViewTransition() is the single most under-used modern web API. Give two DOM elements the same view-transition-name and the browser animates between them for you.',
        sections: [
            {
                type: 'text',
                label: null,
                paragraphs: [
                    'The [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API) lets you wrap any state change in `document.startViewTransition(callback)`. The browser snapshots the page before the callback, waits for it to finish mutating the DOM, snapshots the page after, then cross-fades and morphs between the two.',
                    'If you tag an element in the old state and an element in the new state with the same `view-transition-name`, the browser treats them as the same object and animates position, size, border-radius, and contents between them. No FLIP math, no manual animation.',
                ],
            },
            {
                type: 'demo',
                label: 'Live Demo',
                component: 'ViewTransitions',
                caption: 'Click a tile. The thumbnail morphs into the detail view because both share a view-transition-name. Chrome 111+, Safari 18+. Firefox — not yet.',
            },
            {
                type: 'text',
                label: 'Why It Matters',
                paragraphs: [
                    'Most "morph" animations on the web are faked with FLIP, ghost elements, or Framer Motion layoutId. Those work, but they require the author to hold the before/after DOM in their head. View Transitions let the browser do that bookkeeping, which means you can ship this on ordinary React re-renders — no animation library, no wrapper component.',
                ],
            },
            {
                type: 'footnote',
                text: 'Spec: [CSS View Transitions Module Level 1](https://drafts.csswg.org/css-view-transitions-1/). Good writeup: [Jake Archibald — "view transitions"](https://developer.chrome.com/docs/web-platform/view-transitions).',
            },
        ],
    },
    {
        slug: 'scroll-driven-animations',
        title: 'Animations That Use the Scrollbar as a Clock',
        date: '2026-04-20',
        dateDisplay: 'April 2026',
        demo: 'ScrollDriven',
        excerpt: 'animation-timeline: view() binds a CSS animation to an element\'s position in the viewport. No IntersectionObserver, no scroll listener, no raf loop.',
        sections: [
            {
                type: 'text',
                label: null,
                paragraphs: [
                    '[CSS Scroll-Driven Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations) replace the clock that drives `@keyframes` — instead of elapsed time, the animation\'s progress is a function of scroll position. You pick between `scroll()` (how far the container has scrolled) and `view()` (how much of a child is in the viewport).',
                    'Paired with `animation-range`, you can say things like "start when the element enters from the bottom, finish when it is 40% covered." The browser handles every frame on the compositor.',
                ],
            },
            {
                type: 'demo',
                label: 'Live Demo',
                component: 'ScrollDriven',
                caption: 'Each card reveals itself as it enters the viewport. The progress bar at the top is driven by animation-timeline: scroll(self). Chrome 115+.',
            },
            {
                type: 'text',
                label: 'Why It Matters',
                paragraphs: [
                    'Scroll-linked animation on the web has historically meant JS scroll listeners, IntersectionObservers, or GSAP ScrollTrigger. Those burn main-thread cycles and have to fight the browser for frame budget. Doing it in CSS hands the work to the compositor and costs nothing once you are past the declaration.',
                ],
            },
            {
                type: 'footnote',
                text: 'Spec: [Scroll-driven Animations Module Level 1](https://drafts.csswg.org/scroll-animations-1/). Playground: [scroll-driven-animations.style](https://scroll-driven-animations.style).',
            },
        ],
    },
    {
        slug: 'anchor-positioning',
        title: 'Tooltips That Follow Their Anchor, From CSS',
        date: '2026-04-20',
        dateDisplay: 'April 2026',
        demo: 'AnchorPositioning',
        excerpt: 'CSS Anchor Positioning lets a floating element reference another element by name and stay glued to it, even as it moves. Popovers, tooltips, and dropdowns with zero layout JS.',
        sections: [
            {
                type: 'text',
                label: null,
                paragraphs: [
                    '[CSS Anchor Positioning](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning) is the long-overdue fix for a problem every component library has hand-rolled: positioning a popover relative to a button. You set `anchor-name: --my-button` on the anchor and `position-anchor: --my-button` on the popover, then place it with `position-area: top` or `top: anchor(bottom)`.',
                    'Because it is CSS, it updates whenever the anchor moves — scrolling, transforms, flex reflow — without a single JavaScript handler. [Floating UI](https://floating-ui.com) in 12 declarations.',
                ],
            },
            {
                type: 'demo',
                label: 'Live Demo',
                component: 'AnchorPositioning',
                caption: 'Drag the card. The three pills follow because they are anchored to --card via CSS. JS runs only to move the card itself. Chrome 125+.',
            },
            {
                type: 'text',
                label: 'Why It Matters',
                paragraphs: [
                    'Every serious web app ends up with a dropdown library. Anchor positioning deletes the need. And because the browser can see the anchor\'s real layout in real time, it can flip, shift, or shrink the popover to stay on screen — things JS libraries approximate with measure/position/measure loops.',
                ],
            },
            {
                type: 'footnote',
                text: 'Spec: [CSS Anchor Positioning](https://drafts.csswg.org/css-anchor-position-1/). Writeup: [Bramus — Anchor positioning explainer](https://developer.chrome.com/blog/anchor-positioning-api).',
            },
        ],
    },
    {
        slug: 'document-pip',
        title: 'Floating DOM Windows That Outlive the Tab',
        date: '2026-04-20',
        dateDisplay: 'April 2026',
        demo: 'DocumentPiP',
        excerpt: 'documentPictureInPicture opens an always-on-top browser window with a live DOM subtree. Not a video element. React state, event handlers, CSS — all intact.',
        sections: [
            {
                type: 'text',
                label: null,
                paragraphs: [
                    'Video PiP is old news — a `<video>` element can pop out into a floating system window. [Document Picture-in-Picture](https://developer.chrome.com/docs/web-platform/document-picture-in-picture) generalises that to arbitrary DOM. You call `documentPictureInPicture.requestWindow({ width, height })` and get a second `Window` whose `document` you can append nodes into.',
                    'The crucial part: if you *move* a live DOM node (via `appendChild`) into that window, its React fiber, event listeners, and state stay attached. You get a floating, interactive sub-app that persists while the user is doing something else.',
                ],
            },
            {
                type: 'demo',
                label: 'Live Demo',
                component: 'DocumentPiP',
                caption: 'A metronome you can pop out of the page. The window floats above everything, state stays in the main React tree, and clicks on the PiP window update both. Chrome 116+, desktop only.',
            },
            {
                type: 'text',
                label: 'Why It Matters',
                paragraphs: [
                    'This unlocks the design of web apps that the OS has always done better — floating call controls, persistent timers, hover-over-everything dashboards. The API is small enough to retrofit: your modal already has the DOM it needs; you just rehost the node in a different window.',
                ],
            },
            {
                type: 'footnote',
                text: 'Spec: [Document Picture-in-Picture](https://wicg.github.io/document-picture-in-picture/). Guide: [Thomas Steiner — "Document PiP"](https://developer.chrome.com/docs/web-platform/document-picture-in-picture).',
            },
        ],
    },
    {
        slug: 'houdini-paint',
        title: 'JavaScript That Paints Your CSS Backgrounds',
        date: '2026-04-20',
        dateDisplay: 'April 2026',
        demo: 'HoudiniPaint',
        excerpt: 'CSS Paint Worklets let you register a JavaScript draw function and use it as a CSS background. It runs on the render thread and reads animated CSS custom properties.',
        sections: [
            {
                type: 'text',
                label: null,
                paragraphs: [
                    'The [CSS Paint API](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Painting_API) is part of Houdini — a family of low-level APIs that expose the browser\'s rendering pipeline to script. You write a class with a `paint(ctx, geom, props)` method, register it as a worklet, and CSS gets a new function: `background: paint(my-worklet)`.',
                    'Combined with [`@property`](https://developer.mozilla.org/en-US/docs/Web/CSS/@property), the custom properties the worklet reads can be type-checked and *animated* — transitions and keyframes apply to them, and your paint function re-runs on every frame.',
                ],
            },
            {
                type: 'demo',
                label: 'Live Demo',
                component: 'HoudiniPaint',
                caption: 'A checker pattern painted by a worklet. Sliders change CSS custom properties, and the background re-rasterises on the render thread. Chrome 65+, no Safari, no Firefox.',
            },
            {
                type: 'text',
                label: 'Why It Matters',
                paragraphs: [
                    'Before Houdini, "custom CSS" meant SVG filters, canvases positioned behind content, or a shader-slathered `<div>` that broke accessibility. Paint worklets give you real background-image semantics — tiling, clipping, responsive sizing — with arbitrary drawing code. And because they run on the render thread, they do not block layout or main-thread JS.',
                ],
            },
            {
                type: 'footnote',
                text: 'Spec: [CSS Painting API Level 1](https://drafts.css-houdini.org/css-paint-api-1/). Showcase: [houdini.how](https://houdini.how).',
            },
        ],
    },
];

export function getExperiment(slug) {
    return experiments.find(e => e.slug === slug) || null;
}
