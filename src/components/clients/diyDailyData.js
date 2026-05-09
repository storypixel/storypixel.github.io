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
    id: 'coin',
    label: 'A',
    name: 'Coin Masthead',
    note: 'Logo-forward, most explicitly DIY Money.',
  },
  {
    id: 'ticker',
    label: 'B',
    name: 'Market Tape',
    note: 'Fastest markets read, data first.',
  },
  {
    id: 'letter',
    label: 'C',
    name: 'Quint Letter',
    note: 'Editorial first, quieter data support.',
  },
  {
    id: 'homepage',
    label: 'D',
    name: 'Homepage Echo',
    note: 'Closest to diymoney.org brand language.',
  },
  {
    id: 'ledger',
    label: 'E',
    name: 'Morning Ledger',
    note: 'Clean daily briefing format.',
  },
  {
    id: 'signal',
    label: 'F',
    name: 'Signal Stack',
    note: 'Markets-native structure with a strong L3 block.',
  },
];

export function exampleHtmlPath(exampleId) {
  return `/client-previews/diy-daily/${issueDate}-${exampleId}.html`;
}

export function findExample(id) {
  return examples.find((ex) => ex.id === id);
}
