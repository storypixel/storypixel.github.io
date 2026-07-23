// Blog post data — structured like projects.js

export const posts = [
    {
        slug: 'ai-roundup-2026-07-17',
        title: 'AI Roundup: Week of July 17, 2026',
        date: '2026-07-17',
        dateDisplay: 'July 2026',
        excerpt: 'Open weights hit frontier scale, LM Studio turns local models into a real agent product, 1Password gives browser agents delegated identity, OpenAI trains an automated red team, and Linux rejects an AI contribution ban.',
        sections: [
            {
                type: 'text',
                label: null,
                paragraphs: [
                    'Open models stopped looking like the budget aisle this week. Kimi announced a 2.8-trillion-parameter model with a million-token context window, Thinking Machines released a 975B multimodal model built to be fine-tuned, and LM Studio wrapped the whole category in an agent that can actually work across code and documents. At the same time, the security layer is becoming concrete: delegated credentials, automated red teams, and explicit governance for AI contributions. The models are getting more capable, but the more important shift is everything being built around them.',
                ],
            },
            {
                type: 'text',
                label: 'Open weights arrive at frontier scale',
                paragraphs: [
                    '[Kimi K3](https://www.kimi.com/fr-fr/blog/kimi-k3) is a 2.8T-parameter mixture-of-experts model with native vision and a 1M-token context window. Kimi says the full weights land July 27. The company is refreshingly direct that K3 still trails the strongest proprietary models overall, but this is the first open model in the 3T class. That changes what "open" can mean even if almost nobody is running the full thing under a desk.',
                    '[Thinking Machines Inkling](https://thinkingmachines.ai/inkling/) takes the more practical route: 975B total parameters, 41B active, a 1M-token context window, and text, image, and audio input. It is available to fine-tune through Tinker. K3 is the scale headline. Inkling may be the more interesting product because customization is part of the launch instead of a promise for later.',
                ],
            },
            {
                type: 'text',
                label: 'Local agents become a product',
                paragraphs: [
                    '[LM Studio Bionic](https://lmstudio.ai/blog/introducing-lm-studio-bionic) turns LM Studio from a model runner into an agent for coding, research, documents, slides, and spreadsheets. It can use local models, LM Link, or open models in LM Studio Secure Cloud. Code changes arrive as reviewable inline diffs. Document work runs in a sandbox with previews, automatic checkpoints, and rollback.',
                    'The quiet killer feature is local voice. Bionic ships Voxtral transcription and can dictate into any app without sending audio away. Local models have had enough raw capability for a while. What they lacked was a coherent product surface. Bionic is a serious attempt to provide one.',
                ],
            },
            {
                type: 'text',
                label: 'Agents get an identity layer',
                paragraphs: [
                    '[1Password for Claude](https://1password.com/blog/1password-for-claude) lets a browser agent use a login or one-time code after explicit biometric approval without exposing the secret to the model or its memory. Access is scoped to the current task, and Agentic Mode locks the rest of the vault away while an agent controls the browser.',
                    'This is the right abstraction. An agent does not need your password. It needs permission to use a credential for one job. Treating agents as their own class of identity is much cleaner than stuffing secrets into prompts, environment files, or browser profiles and hoping the boundary holds.',
                ],
            },
            {
                type: 'text',
                label: 'Security starts training against itself',
                paragraphs: [
                    'OpenAI trained [GPT-Red](https://openai.com/index/unlocking-self-improvement-gpt-red/) through self-play against defender models across realistic prompt-injection scenarios. The attacker is rewarded for causing a valid failure; defenders are rewarded for resisting it while still completing the original task. OpenAI then used those attacks to train GPT-5.6 Sol, which it reports had six times fewer failures than its best production model from four months earlier on its hardest direct prompt-injection benchmark.',
                    'The important part is not one internal benchmark. It is the loop: train an attacker, use it to harden the production model, then force the attacker to adapt. Red-teaming becomes a compounding training system instead of a checklist before launch.',
                ],
            },
            {
                type: 'text',
                label: 'Linux rejects an AI contribution ban',
                paragraphs: [
                    'Linus Torvalds answered calls to make Linux explicitly anti-AI with a blunt no: Linux is an open-source project, and people who want a different policy can [fork it or walk away](https://lore.kernel.org/linux-media/CAHk-=wi4zC+Ze8e+p3tMv8TtG_80KzsZ1syL9anBtmEh5Z40vg@mail.gmail.com/). That does not settle how maintainers should review generated code, disclose tool use, or assign responsibility. It does settle the top-level governance question for Linux: contributions are judged through the project process, not prohibited by the tool used to make them.',
                ],
            },
            {
                type: 'text',
                label: 'Claude changes with its language',
                paragraphs: [
                    'Anthropic measured [how Claude\'s expressed values vary](https://www.anthropic.com/research/claude-values-models-languages) across models and the top 20 languages on Claude.ai. English responses leaned most toward caution and depth. Arabic leaned most toward deference and brevity. The company does not yet know what drives the differences or how much of the variation is desirable.',
                    'That is more than a localization footnote. Two users can ask the same kind of question in different languages and receive meaningfully different styles of judgment. Multilingual evaluation needs to measure the model\'s posture, not just whether it translated the nouns correctly.',
                ],
            },
            {
                type: 'text',
                label: 'What it means',
                paragraphs: [
                    'The center of gravity is moving away from model access alone. Open weights are scaling up, local runtimes are turning into complete work surfaces, credential managers are issuing task-scoped authority, and safety teams are building adversaries that improve alongside defenders. The next durable advantage is not simply having the smartest model. It is giving that model a useful environment, a bounded identity, and a feedback loop that catches failure before the user does.',
                ],
            },
            {
                type: 'footnote',
                text: 'Published by Sam Wilson. Primary sources: kimi.com, thinkingmachines.ai, lmstudio.ai, 1password.com, openai.com, lore.kernel.org, and anthropic.com.',
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
