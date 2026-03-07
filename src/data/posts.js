// Blog post data — structured like projects.js

export const posts = [
    {
        slug: 'ai-roundup-2026-03-07',
        title: 'AI Roundup — Week of March 7, 2026',
        date: '2026-03-07',
        dateDisplay: 'March 2026',
        excerpt: 'Claude Code shipped /loop and /remote-control. OpenClaw hit 2026.3.2. And the "replace OpenClaw with Claude Code" discourse officially began.',
        sections: [
            {
                type: 'text',
                label: null,
                paragraphs: [
                    'Big week in AI agent tooling. Claude Code is eating its way toward being a full personal assistant, OpenClaw keeps shipping, and the community is starting to ask the obvious question: do you even need both?',
                    'Here\'s what actually shipped and what it means if you\'re building with this stuff.',
                ],
            },
            {
                type: 'text',
                label: 'Claude Code',
                paragraphs: [
                    'The two headliners: /loop and /remote-control. The /loop command lets you schedule recurring prompts inside a session — "check this deployment every 5 minutes" or "remind me at 3pm." It\'s cron for your coding session, built on CronCreate/CronList/CronDelete tools. The catch: it\'s session-scoped. Close the terminal, lose the schedule.',
                    '/remote-control is the bigger deal for daily use. Start a Claude Code session on your desktop, type /remote-control, and you get a URL you can open on your phone. Full session handoff — approve permissions, see output, give input, all from mobile. This is Anthropic\'s answer to "how do I use my coding agent when I\'m not at my desk."',
                    'Other notable fixes: prompt cache preservation during compaction (cheaper long sessions), 74% reduction in prompt re-renders, VS Code spark icon for session management, and native MCP server management via /mcp in VS Code. They also fixed the annoying API 400 errors with third-party gateways.',
                ],
            },
            {
                type: 'text',
                label: 'OpenClaw',
                paragraphs: [
                    'Version 2026.3.2 landed. The release continues the pattern of steady infrastructure improvements — better session management, more reliable cron delivery, and channel stability. OpenClaw\'s strength remains what Claude Code can\'t do natively: persistent 24/7 operation, multi-channel messaging (Telegram, Signal, Discord, 20+ channels), durable cron jobs that survive restarts, and multi-agent orchestration.',
                    'The Anthropic skills repo also went public this week with official skill templates including an MCP builder skill. Worth browsing if you\'re writing skills for either platform.',
                ],
            },
            {
                type: 'text',
                label: 'Ecosystem',
                paragraphs: [
                    'The planning-with-files pattern from OthmanAdi hit 6,600+ stars — it\'s the Manus approach to persistent planning: write your plan to files, not memory. Context window is RAM, filesystem is disk. Simple idea, surprisingly effective.',
                    'VoltAgent dropped awesome-claude-code-subagents with 100+ specialized agent templates (security auditor, code reviewer, debugger, devops engineer, multi-agent coordinator). Good reference library for anyone spawning sub-agents.',
                    'The "replace OpenClaw" discourse kicked off on r/ClaudeCode. Someone posted that /remote-control "negates the need for OpenClaw." The verdict from builders actually running both: Claude Code is great for coding sessions you want to access from your phone. OpenClaw is for always-on personal agents with messaging, scheduling, and multi-agent comms. Different tools, different jobs. You can run both.',
                ],
            },
            {
                type: 'text',
                label: 'What It Means',
                paragraphs: [
                    'The convergence is real. Claude Code is adding features that OpenClaw pioneered (scheduled tasks, mobile access, skills). OpenClaw is adding features that Claude Code does well (ACP sessions, sub-agent spawning). They\'re eating toward each other.',
                    'But the gap that matters is persistence. Claude Code sessions are ephemeral — they exist while your terminal is open. OpenClaw sessions are durable — they run on a Mac Mini in your closet 24/7, checking your email, monitoring your projects, responding to messages while you sleep. Until Claude Code ships a daemon mode, these are complementary tools, not competitors.',
                    'My bet: within 6 months, Claude Code adds persistent background sessions. When that happens, the conversation changes entirely. Until then, run both.',
                ],
            },
            {
                type: 'footnote',
                text: 'Published by Sam Wilson. Sources: releasebot.io, code.claude.com, github.com/openclaw, r/ClaudeCode',
            },
        ],
    },
    {
        slug: 'twenty-years-of-this-cookie',
        title: 'Twenty Years of This Cookie',
        date: '2024-11-01',
        dateDisplay: 'November 2024',
        excerpt: 'A sweet and savory cookie found in a 2004 Gourmet magazine. Fresh sage, Turkish apricots, cornmeal — and I have never stopped making it.',
        sections: [
            {
                type: 'text',
                label: null,
                paragraphs: [
                    'I found this recipe in Gourmet magazine in 2004 and it immediately became one of those rare things you make once and never stop making. The combination sounds strange on paper, but fresh sage with dried apricots and cornmeal creates something that lives in the space between sweet and savory.',
                    'Use fresh sage. Use the best Turkish apricots you can find. Use fine cornmeal, not coarse. These three things are the difference between a good cookie and the cookie your hair stylist requests instead of a tip.',
                ],
            },
            {
                type: 'list',
                label: 'Ingredients',
                items: [
                    '1 stick (1/2 cup) unsalted butter, softened well',
                    '3/4 cup sugar',
                    '1 large egg',
                    '3/4 cup plus 2 tablespoons all-purpose flour',
                    '1/2 teaspoon baking soda',
                    '1/4 cup chopped dried apricots',
                    '2 tablespoons finely chopped fresh sage leaves',
                    '1/2 cup cornmeal',
                    '1/2 teaspoon salt',
                ],
            },
            {
                type: 'steps',
                label: 'Preparation',
                steps: [
                    { title: 'Preheat', text: 'Oven to 350\u00B0F. Lightly grease 2 baking sheets.' },
                    { title: 'Mix', text: 'Whisk together butter, sugar, and egg until smooth. Sift in flour and baking soda. Add apricots, sage, cornmeal, and salt. Stir until just combined.' },
                    { title: 'Bake', text: 'Drop tablespoons of dough about 1 inch apart onto baking sheets. Bake in batches in the middle of the oven for 10 minutes, or until pale golden. Cool on sheets 2 minutes, then transfer to a rack.' },
                ],
            },
            {
                type: 'footnote',
                text: 'Originally published in Gourmet, August 2004. Via Epicurious.',
            },
        ],
    },
];

export function getPost(slug) {
    return posts.find(p => p.slug === slug) || null;
}
