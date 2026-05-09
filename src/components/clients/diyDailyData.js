// Shared data for DIY Daily preview pages.
//
// `issueDate` is the dated sample these designs were generated against.
// Per Sam (2026-05-09): "These are designs not instances so the tweaking
// applies to the template, instances come later." The date in the static
// filename is incidental — the URL routes (e.g. `/clients/diy-daily/coin`)
// stay date-free and stable.
export const issueDate = '2026-05-09';

export const examples = [
  {
    id: 'ticker',
    label: 'B',
    name: 'Market Tape',
    note: 'Fastest markets read, data first.',
  },
];

export function exampleHtmlPath(exampleId) {
  return `/client-previews/diy-daily/${issueDate}-${exampleId}.html`;
}

export function findExample(id) {
  return examples.find((ex) => ex.id === id);
}
