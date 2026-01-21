// Centralized project data for Work grid and ProjectDetail pages

export const projects = [
    {
        id: 'calcuweighter',
        title: 'Calcuweighter',
        category: 'iOS App / Watch App',
        size: 'full',
        image: '/images/calcuweighter-model-1.png',
        color: '#1c1c1e',
        url: '/calcuweighter',
    },
];

export const projectDetails = {
    calcuweighter: {
        title: 'Calcuweighter',
        category: 'iOS App / Watch App',
        color: '#1c1c1e',
        skills: ['SwiftUI', 'iOS Development', 'WatchOS', 'Vision AI', 'Speech Recognition'],
        year: '2025',
        role: 'Design & Development',
        roleBlurb: 'Built a powerful percentages calculator for strength training with camera OCR, voice input, and Apple Watch companion app.',
        description: 'A powerful percentages calculator for strength training. Enter your PRs and instantly see what weight to load for any percentage. Calcuweighter allows you to snap a photo of your workout whiteboard to automatically identify lifts, supports hands-free voice input, and visualizes plate loading. Includes a companion Apple Watch app.',
        workDescription: 'Every session used to involve the same frustrating dance: staring at the gym whiteboard, pulling out my phone, opening the calculator app, and doing fractional math just to figure out what plates to put on the bar. I wanted a tool that felt invisible. No typing, no mental gymnastics. Just point a camera at the whiteboard or speak the percentages, and instantly see the exact plate layout.',
        hero: '/images/calcuweighter-model-1.png',
        heroImages: [
            '/images/calcuweighter-model-1.png',
            '/images/calcuweighter-model-2.png',
            '/images/calcuweighter-model-3.png',
            '/images/calcuweighter-model-4.png',
            '/images/calcuweighter-model-5.png',
            '/images/calcuweighter-model-6.png'
        ],
        appScreenshots: [
            '/images/calcuweighter/01-onboarding.png',
            '/images/calcuweighter/05-main-workout.png',
            '/images/calcuweighter/06-percentage-grid.png',
            '/images/calcuweighter/07-multiple-lifts.png'
        ],
        gallery: [
            '/images/calcuweighter-model-1.png',
            '/images/calcuweighter-model-2.png',
            '/images/calcuweighter-model-3.png',
            '/images/calcuweighter-model-4.png',
        ],
        appStoreUrl: 'https://apps.apple.com/app/id6756983846',
    },
};
