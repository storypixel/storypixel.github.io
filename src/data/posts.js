// Blog post data — structured like projects.js

export const posts = [
    {
        slug: 'ai-roundup-2026-04-17',
        title: 'AI Roundup — Week of April 17, 2026',
        date: '2026-04-17',
        dateDisplay: 'April 2026',
        excerpt: 'Anthropic ships Claude Opus 4.7, Qwen drops open weights that beat it at some tasks, OpenAI reframes Codex, and the dev-tool trust layer takes three body blows in one week.',
        sections: [
            {
                type: 'text',
                label: null,
                paragraphs: [
                    'Opus 4.7 is out and the discourse is louder than usual. Part of that is the model — 87.6% on SWE-bench is hard to argue with — and part of it is Qwen dropping open weights that beat Opus on select tasks the same week. Meanwhile the dev-tool trust conversation is having a genuinely bad week: Laravel injecting ads into agents, SDL banning AI-written commits, and a Cloudflare platform bug that quietly burned $34k in eight days. The agents are getting better and the ground underneath them is getting more interesting.',
                ],
            },
            {
                type: 'text',
                label: 'Claude Platform',
                paragraphs: [
                    '[Claude Opus 4.7](https://www.anthropic.com/news/claude-opus-4-7) launched on April 16. 87.6% on SWE-bench Verified, 94.2% on GPQA, 1M token context, 3.3\u00d7 vision resolution, priced flat at $5/$25 per million tokens. GA on the API, Bedrock, Vertex AI, and Microsoft Foundry from day one. 1,816 points on HN; the comment thread is mostly developers comparing concrete results on their own workloads.',
                    'Two wrinkles worth knowing before you migrate. First, [prompts tuned for 4.6 may break on 4.7](https://bsky.app/profile/kautious.com/post/3mjowmq2gkd26) \u2014 Anthropic flagged this in the release notes. Second, the new tokenizer maps the same input to roughly 1.0\u20131.35\u00d7 more tokens, so real-world costs can rise even though list pricing is unchanged. Benchmark your actual harness before declaring victory.',
                    'The [Mythos](https://www.reuters.com/technology/white-house-give-us-agencies-anthropic-mythos-access-bloomberg-news-reports-2026-04-16/) story continued: the White House is requesting access for US agencies, and Anthropic\'s public framing is that the model "can rapidly identify \u2014 and potentially create \u2014 new cyberthreats." The line between safety-motivated access control and federal-government go-to-market is thinner than it was three months ago.',
                ],
            },
            {
                type: 'text',
                label: 'Claude Code',
                paragraphs: [
                    'Quiet release cycle on Claude Code itself, but the community shipped. [SPICE simulation via Claude Code + LeCroy MCP](https://lucasgerads.com/blog/lecroy-mcp-spice-demo/) is the demo of the week \u2014 a full electronics verification loop, oscilloscope and all, driven from a terminal agent. 94 points on HN. MCP is quietly eating every category where an agent needs a physical or proprietary tool interface.',
                    '[Marky](https://github.com/GRVYDEV/marky), a lightweight Markdown viewer designed specifically for agentic coding workflows, landed on HN with 62 points. Small, sharp tools for the inner loop are becoming their own genre.',
                ],
            },
            {
                type: 'text',
                label: 'Ecosystem',
                paragraphs: [
                    '[Qwen3.6-35B-A3B](https://qwen.ai/blog?id=qwen3.6-35b-a3b) dropped as open weights, 1,146 points on HN. Simon Willison ran a head-to-head and reported that [Qwen drew a better pelican SVG than Opus 4.7 on his laptop](https://simonwillison.net/2026/Apr/16/qwen-beats-opus/). One synthetic test is one synthetic test, but open weights that are competitive on laptop-class hardware the same week the flagship closed model ships is the kind of pressure that keeps the price-per-token curve moving.',
                    '[OpenAI rebranded Codex for almost everything](https://openai.com/index/codex-for-almost-everything/) \u2014 general-purpose agentic workhorse across coding, research, and analysis (913 HN points). Separately, [GPT-Rosalind](https://openai.com/index/introducing-gpt-rosalind/) shipped as a life-sciences research model. The "one vertical model per industry" play from OpenAI is starting to look like a strategy, not a series of one-offs.',
                    'Cloudflare shipped two infrastructure pieces: the [AI Platform](https://blog.cloudflare.com/ai-platform/), an inference layer designed for agents, and [Artifacts](https://blog.cloudflare.com/artifacts-git-for-agents-beta/), a Git-flavored versioned storage system where multiple agents can commit and branch against shared state. Google contributed the [Android CLI](https://android-developers.googleblog.com/2026/04/build-android-apps-3x-faster-using-any-agent.html), an agent-native toolchain for Android apps claiming a 3\u00d7 speedup.',
                    'Three data points on dev-tool trust in the same week. [Laravel raised money and started injecting ads directly into agent output](https://techstackups.com/articles/laravel-raised-money-and-now-injects-ads-directly-into-your-agent/) \u2014 198 points, 115 comments, overwhelmingly negative. [SDL banned AI-written commits](https://github.com/libsdl-org/SDL/issues/15350) \u2014 125 points, 122 comments, heated both ways. And a [Cloudflare Durable Object alarm loop quietly burned $34k in 8 days with zero platform warnings](https://news.ycombinator.com/item?id=47787042). Different vectors, same signal: the tooling layer is learning that agents mean the blast radius of bad defaults is much larger than the blast radius of bad UX.',
                    'Two more worth your click. [Andon Labs gave an AI a 3-year retail lease](https://andonlabs.com/blog/andon-market-launch) and asked it to turn a profit \u2014 194 points, 272 comments; the experiment design is genuinely interesting. And [antirez argues AI cybersecurity is not proof of work](https://antirez.com/news/163) \u2014 a thoughtful counterweight to the Mythos coverage, pointing out that auto-finding vulns is not the same thing as the craft of finding them.',
                ],
            },
            {
                type: 'text',
                label: 'What It Means',
                paragraphs: [
                    'The Opus 4.7 / Qwen 3.6 pair is the headline. The closed frontier keeps moving \u2014 87.6% on SWE-bench was, until this week, an aspirational number \u2014 and open weights keep arriving a few months later at a hardware tier that\'s accessible to normal humans. The gap is narrower and the choice is real.',
                    'The dev-tool trust story is the one worth paying attention to. Laravel, SDL, and the Cloudflare alarm bug are three different failure modes \u2014 incentive misalignment, governance friction, and platform defaults \u2014 but they all point at the same thing: when agents multiply the throughput of every tool in the chain, the cost of getting the tool wrong multiplies too. The governance tooling we saw from Microsoft and AWS last week wasn\'t premature.',
                    'Finally, the migration cost on Opus 4.7 is a tell. Anthropic is now confident enough in the upgrade path to ship a release that openly breaks prompts tuned for the prior version and meaningfully shifts the token-to-cost ratio. That\'s a healthy signal \u2014 frontier labs that are scared of losing users don\'t ship like that.',
                ],
            },
            {
                type: 'footnote',
                text: 'Published by Sam Wilson. Sources: anthropic.com, news.ycombinator.com, qwen.ai, simonwillison.net, openai.com, blog.cloudflare.com, android-developers.googleblog.com, reuters.com, antirez.com, andonlabs.com.',
            },
        ],
    },
    {
        slug: 'ai-roundup-2026-04-10',
        title: 'AI Roundup — Week of April 10, 2026',
        date: '2026-04-10',
        dateDisplay: 'April 2026',
        excerpt: 'Anthropic ships Managed Agents, Cowork goes GA, the MCP vs Skills debate heats up, and Microsoft open-sources an agent governance toolkit.',
        sections: [
            {
                type: 'text',
                label: null,
                paragraphs: [
                    'Anthropic dropped a triple launch this week: Managed Agents in public beta, Cowork graduating to GA, and a Claude Code update. Meanwhile, the community is fighting about MCP vs Skills, Microsoft is open-sourcing agent governance tools, and a research paper on viral misalignment in multi-agent systems is making the rounds. Three weeks of signal compressed into one digest.',
                ],
            },
            {
                type: 'text',
                label: 'Claude Platform',
                paragraphs: [
                    '[Managed Agents](https://www.anthropic.com/engineering/managed-agents) hit public beta. Deploy production agents without managing infrastructure yourself. A credential proxy keeps secrets out of the harness, and there are Notion and Asana integrations out of the box. This is essentially what folks have been building manually with CortextOS, OpenClaw, and similar frameworks \u2014 Anthropic is now offering a hosted version.',
                    '[Cowork](https://claude.ai/cowork) is out of research preview and available on all paid plans. Enterprise controls are the headline: role-based access, per-group spend limits, and usage analytics. PayPal published a case study on scaling from pilot to enterprise-wide deployment.',
                    'The Mythos model story is worth noting. A reportedly withheld model that Anthropic says poses cybersecurity risks \u2014 official language says models have "surpassed all but the most skilled humans at finding and exploiting software vulnerabilities." Whether this is genuine safety caution or competitive positioning is an exercise for the reader.',
                ],
            },
            {
                type: 'text',
                label: 'Claude Code',
                paragraphs: [
                    'Smaller update this cycle compared to the March wave. SessionEnd hook timeout is now configurable via an environment variable. Plugin install fix in REPL mode. The `/claude-api` skill was updated to cover Managed Agents.',
                    'The community drama was more interesting than the release: a [Vercel Claude Code plugin](https://news.ycombinator.com/item?id=47704881) was caught sending prompts as telemetry. 267 points on HN and a lot of people auditing their plugin configs. Worth checking what you have installed.',
                ],
            },
            {
                type: 'text',
                label: 'Ecosystem',
                paragraphs: [
                    'The MCP vs Skills debate went mainstream. An HN post titled "[I still prefer MCP over skills](https://news.ycombinator.com/item?id=47712718)" pulled 256 points and 213 comments. The argument: MCP servers are more portable and composable. Skills are faster to author but locked to Claude Code. If you run both \u2014 and you should \u2014 the rule of thumb is MCP for tools (databases, APIs, browsers) and skills for workflows (deployment checklists, code review, project-specific conventions).',
                    'Microsoft open-sourced two things worth watching: a [SQL MCP Server](https://github.com/microsoft/mssql-mcp-server) for structured, role-aware database access without NL2SQL fragility, and an [agent governance toolkit](https://github.com/microsoft/agent-governance-toolkit) with kill switches and audit trails. AWS followed with agentic root-cause analysis tooling. The infrastructure layer for managing AI agents \u2014 not just building them \u2014 is starting to take shape.',
                    '[GitButler raised $17M](https://blog.gitbutler.com/series-a) to build "what comes after Git." 181 points, 402 comments on HN. Version control designed for the agent era, where you might have three agents working on different parts of the same codebase simultaneously. Early, but the problem is real.',
                    'A research paper on viral misalignment in multi-agent systems went viral itself. The premise: subliminal prompt injection in one agent can cascade through a fleet. Relevant if you\'re running any kind of multi-agent setup. Worth reading the full paper before dismissing it.',
                ],
            },
            {
                type: 'text',
                label: 'What It Means',
                paragraphs: [
                    'Anthropic is doing what every platform company eventually does: absorbing the ecosystem. Managed Agents competes directly with the community frameworks that grew around Claude\'s gaps. Cowork GA competes with every "AI for enterprise" startup. The credential proxy in Managed Agents solves a problem that every DIY agent builder has hacked around.',
                    'The governance tooling from Microsoft and AWS is the signal to watch. When the infrastructure giants start shipping kill switches and audit trails for AI agents, it means they expect agents in production at scale. We\'re past the "should we use agents?" phase and into "how do we govern them?"',
                    'The MCP vs Skills debate will resolve itself the way most format wars do: you\'ll use both. The important thing is that the ecosystem is standardizing on interop patterns, not fragmenting into incompatible islands.',
                ],
            },
            {
                type: 'footnote',
                text: 'Published by Sam Wilson. Sources: anthropic.com, news.ycombinator.com, github.com/microsoft, blog.gitbutler.com',
            },
        ],
    },
    {
        slug: 'ai-roundup-2026-03-20',
        title: 'AI Roundup — Week of March 20, 2026',
        date: '2026-03-20',
        dateDisplay: 'March 2026',
        excerpt: 'Claude gets memory for everyone, Opus 4.6 hits 128k output, voice mode lands in Claude Code, and Anthropic doubles usage limits through March 27.',
        sections: [
            {
                type: 'text',
                label: null,
                paragraphs: [
                    'Anthropic had a monster week. Memory went GA for all users, Claude Code got voice mode and a massive token ceiling bump, and they\'re running a usage limit doubler through March 27. Meanwhile, OpenAI shipped GPT-5.4 mini and Google dropped Gemini 3.1 Flash-Lite. The pace is relentless.',
                ],
            },
            {
                type: 'text',
                label: 'Claude Platform',
                paragraphs: [
                    'The headline: [memory from chat history](https://support.claude.com/en/articles/12138966-release-notes) is now available for all Claude users, including free tier. Claude remembers your name, writing style, preferences, and ongoing projects across conversations. For anyone using Claude daily, this is a fundamental shift in the experience.',
                    'Self-serve Enterprise plans are now live — any org can purchase directly on Anthropic\'s site with no sales call required. Plans include Claude, Claude Code, and Cowork.',
                    'Usage limits are [doubled across all plans](https://releasebot.io/updates/anthropic/claude) (Free, Pro, Max, Team) from March 15-27 during non-peak hours, with doubled limits all day on weekends. Doesn\'t count toward weekly caps. If you\'ve been hitting rate limits, now\'s your window.',
                ],
            },
            {
                type: 'text',
                label: 'Claude Code',
                paragraphs: [
                    '[Voice mode](https://pasqualepillitteri.it/en/news/381/claude-code-march-2026-updates) is rolling out to all users. Activate with /voice, hold spacebar to talk, release to send. Push-to-talk, not always-listening. It\'s surprisingly natural for thinking out loud about architecture or talking through a bug.',
                    'The bigger infrastructure move: default output tokens bumped to 64k, model upper bound to 128k for Opus 4.6. Long-form code generation just got a lot more room to breathe.',
                    'Other notable additions: /effort command to set model effort level, MCP elicitation support (servers can request structured input mid-task via interactive dialogs), new allowRead sandbox setting, and lsof/pgrep/tput/ss/fd added to bash auto-approval. Fewer permission prompts for read-only ops.',
                ],
            },
            {
                type: 'text',
                label: 'The Competition',
                paragraphs: [
                    'OpenAI shipped [GPT-5.4 mini](https://releasebot.io/updates/openai) on March 17, available in ChatGPT for Free and Go users via Thinking mode. GPT-5.4 nano is API-only at $0.20/M input tokens — aggressively cheap.',
                    'Google released [Gemini 3.1 Flash-Lite](https://llm-stats.com/llm-updates), an efficiency model with 2.5x faster response times and 45% faster output generation vs. earlier Gemini versions. Priced at $0.25/M input tokens. The low-cost inference race continues.',
                    'The industry tracked 271+ model releases in Q1 2026 alone — roughly three new AI models every single day. The firehose shows no signs of slowing.',
                ],
            },
            {
                type: 'text',
                label: 'What It Means',
                paragraphs: [
                    'Memory going GA is the most consequential change this week. It turns Claude from a tool you use into an assistant that knows you. Combined with doubled limits and 128k output tokens, Anthropic is clearly pushing toward Claude as a persistent daily companion, not just a prompt-and-response interface.',
                    'The pricing pressure from GPT-5.4 nano and Gemini Flash-Lite is real, but Anthropic seems to be competing on capability and experience rather than cost. Smart play when you\'re already on the Max plan.',
                ],
            },
            {
                type: 'footnote',
                text: 'Published by Sam Wilson. Sources: releasebot.io, code.claude.com, support.claude.com, llm-stats.com',
            },
        ],
    },
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
                    'The two headliners: [/loop](https://code.claude.com/docs/en/scheduled-tasks) and [/remote-control](https://winbuzzer.com/2026/02/28/anthropic-remote-control-claude-code-mobile-access-xcxwbn/). The /loop command lets you schedule recurring prompts inside a session — "check this deployment every 5 minutes" or "remind me at 3pm." It\'s cron for your coding session, built on CronCreate/CronList/CronDelete tools. The catch: it\'s session-scoped. Close the terminal, lose the schedule.',
                    '/remote-control is the bigger deal for daily use. Start a [Claude Code](https://code.claude.com) session on your desktop, type /remote-control, and you get a URL you can open on your phone. Full session handoff — approve permissions, see output, give input, all from mobile. This is Anthropic\'s answer to "how do I use my coding agent when I\'m not at my desk."',
                    'Other notable fixes: prompt cache preservation during compaction (cheaper long sessions), 74% reduction in prompt re-renders, VS Code spark icon for session management, and native MCP server management via /mcp in VS Code. They also fixed the annoying API 400 errors with third-party gateways. [Full release notes here.](https://releasebot.io/updates/anthropic/claude-code)',
                ],
            },
            {
                type: 'text',
                label: 'OpenClaw',
                paragraphs: [
                    '[OpenClaw](https://github.com/openclaw/openclaw) version 2026.3.2 landed. The release continues the pattern of steady infrastructure improvements — better session management, more reliable cron delivery, and channel stability. OpenClaw\'s strength remains what Claude Code can\'t do natively: persistent 24/7 operation, multi-channel messaging (Telegram, Signal, Discord, 20+ channels), durable cron jobs that survive restarts, and multi-agent orchestration.',
                    'The [Anthropic skills repo](https://github.com/anthropics/skills) also went public this week with official skill templates including an MCP builder skill. Worth browsing if you\'re writing skills for either platform.',
                ],
            },
            {
                type: 'text',
                label: 'Ecosystem',
                paragraphs: [
                    'The [planning-with-files](https://github.com/OthmanAdi/planning-with-files) pattern from OthmanAdi hit 6,600+ stars — it\'s the Manus approach to persistent planning: write your plan to files, not memory. Context window is RAM, filesystem is disk. Simple idea, surprisingly effective.',
                    '[VoltAgent](https://github.com/VoltAgent/awesome-claude-code-subagents) dropped awesome-claude-code-subagents with 100+ specialized agent templates (security auditor, code reviewer, debugger, devops engineer, multi-agent coordinator). Good reference library for anyone spawning sub-agents.',
                    'The "replace OpenClaw" discourse [kicked off on r/ClaudeCode](https://www.reddit.com/r/ClaudeCode/comments/1rew8t0/remotecontrol_negates_the_need_for_openclaw/). Someone posted that /remote-control "negates the need for OpenClaw." The verdict from builders actually running both: Claude Code is great for coding sessions you want to access from your phone. OpenClaw is for always-on personal agents with messaging, scheduling, and multi-agent comms. Different tools, different jobs. You can run both.',
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
