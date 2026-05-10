// Blog post data — structured like projects.js

export const posts = [
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
