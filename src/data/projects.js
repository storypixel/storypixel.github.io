// Centralized project data for Work grid and ProjectDetail pages

export const projects = [
    {
        id: 'calcuweight',
        title: 'Calcuweight',
        category: 'iOS App / Watch App',
        size: 'full',
        image: '/images/calcuweight-model-1.png',
        color: '#1c1c1e',
        url: '/calcuweight',
    },
    {
        id: 'roomscroll',
        title: 'Roomscroll',
        category: 'VS Code Extension',
        size: 'full',
        image: '/images/roomscroll/roomscroll-hero.png',
        color: '#080a0c',
        url: '/roomscroll',
    },
    {
        id: 'chia',
        title: 'Chia',
        category: 'CSS Framework',
        size: 'full',
        image: '/images/chia/chia-hero.png',
        color: '#1a1a1a',
        url: '/chia',
    },
];

export const projectDetails = {
    calcuweight: {
        title: 'Calcuweight',
        category: 'iOS App / Watch App',
        color: '#1c1c1e',
        skills: ['SwiftUI', 'iOS Development', 'WatchOS', 'Speech Recognition'],
        year: '2025',
        role: 'Design & Development',
        roleBlurb: 'Built a powerful percentages calculator for strength training with camera OCR, voice input, and Apple Watch companion app.',
        description: 'A powerful percentages calculator for strength training. Enter your PRs and instantly see what weight to load for any percentage. Calcuweight allows you to snap a photo of your workout whiteboard to automatically identify lifts, supports hands-free voice input, and visualizes plate loading. Includes a companion Apple Watch app.',
        workDescription: 'Every session used to involve the same frustrating dance: staring at the gym whiteboard, pulling out my phone, opening the calculator app, and doing fractional math just to figure out what plates to put on the bar. I wanted a tool that felt invisible. No typing, no mental gymnastics. Just point a camera at the whiteboard or speak the percentages, and instantly see the exact plate layout.',
        hero: '/images/calcuweight-model-1.png',
        heroImages: [
            '/images/calcuweight-model-1.png',
            '/images/calcuweight-model-2.png',
            '/images/calcuweight-model-3.png',
            '/images/calcuweight-model-4.png',
            '/images/calcuweight-model-5.png',
            '/images/calcuweight-model-6.png'
        ],
        appScreenshots: [
            '/images/calcuweight/01-onboarding.png',
            '/images/calcuweight/05-main-workout.png',
            '/images/calcuweight/06-percentage-grid.png',
            '/images/calcuweight/07-multiple-lifts.png'
        ],
        gallery: [
            '/images/calcuweight-model-1.png',
            '/images/calcuweight-model-2.png',
            '/images/calcuweight-model-3.png',
            '/images/calcuweight-model-4.png',
        ],
        appStoreUrl: 'https://apps.apple.com/app/id6756983846',
    },
    roomscroll: {
        title: 'Roomscroll',
        category: 'VS Code Extension',
        color: '#080a0c',
        skills: ['TypeScript', 'WebCodecs API', 'HLS Streaming', 'VS Code Extensions'],
        year: '2025',
        role: 'Design & Development',
        roleBlurb: 'Built a VS Code extension that fills your screen with live outdoor TV streams while Claude is thinking.',
        description: 'A VS Code extension that displays a surveillance grid of live outdoor TV streams while your AI assistant is working. Hardware-accelerated video decoding, custom MPEG-TS demuxer, and a retro surveillance aesthetic.',
        workDescription: 'Long AI coding sessions mean a lot of idle waiting. I wanted something ambient and interesting to watch during those gaps, without leaving my editor. Roomscroll turns that dead time into a window to the outside world.',
        hero: '/images/roomscroll/roomscroll-hero.png',
        heroImages: [
            '/images/roomscroll/roomscroll-hero.png',
            '/images/roomscroll/roomscroll-3x2.png',
            '/images/roomscroll/roomscroll-grid-4x3.png',
        ],
        marketplaceUrl: 'https://marketplace.visualstudio.com/items?itemName=storypixel.roomscroll',
    },
    chia: {
        title: 'Chia',
        category: 'CSS Framework',
        color: '#1a1a1a',
        skills: ['CSS', 'Design Systems', 'Open Props', 'Custom Properties'],
        year: '2026',
        role: 'Design & Development',
        roleBlurb: 'A plain CSS component library. No Tailwind, no build step, no dependencies.',
        description: 'A framework-agnostic CSS component library that uses data-slot attribute selectors and CSS custom properties. Tokens, reset, animations, prose, utilities, and components in six standalone modules.',
        workDescription: 'After fighting Tailwind specificity wars on a production app, I extracted the useful patterns into a standalone CSS framework. No build step, no JavaScript, no utility class soup. Just real selectors with flat specificity that work anywhere.',
        hero: '/images/chia/chia-hero.png',
        heroImages: [
            '/images/chia/chia-hero.png',
        ],
        liveUrl: 'https://iamnotsam.com/chia/',
        githubUrl: 'https://github.com/storypixel/chia',
    },
};
