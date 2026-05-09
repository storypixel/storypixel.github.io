import React from 'react';
import './DIYDailyExamples.css';

const issueDate = '2026-05-09';

const examples = [
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

export default function DIYDailyExamples() {
  return (
    <div className="diy-client-root">
      <header className="diy-client-hero">
        <div className="diy-client-kicker">Client Preview</div>
        <h1>DIY Daily</h1>
        <p>
          Morning markets email concepts for Quint Tatro, keyed from the current DIY Money site:
          official coin mark, navy/gold palette, and Live on Less / Invest the Rest positioning.
        </p>
        <a className="diy-client-site-link" href="https://diymoney.org" target="_blank" rel="noreferrer">
          diymoney.org
        </a>
      </header>

      <section className="diy-client-gallery" aria-label="DIY Daily email examples">
        {examples.map((example) => {
          const src = `/client-previews/diy-daily/${issueDate}-${example.id}.html`;
          return (
            <article className="diy-client-example" key={example.id}>
              <div className="diy-client-example-header">
                <div>
                  <span className="diy-client-label">Example {example.label}</span>
                  <h2>{example.name}</h2>
                </div>
                <a href={src} target="_blank" rel="noreferrer">Open</a>
              </div>
              <p>{example.note}</p>
              <div className="diy-client-frame-wrap">
                <iframe
                  title={`DIY Daily ${example.name}`}
                  src={src}
                  className="diy-client-frame"
                />
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
