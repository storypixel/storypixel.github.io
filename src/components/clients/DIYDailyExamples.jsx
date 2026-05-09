import React from 'react';
import { Link } from 'react-router-dom';
import './DIYDailyExamples.css';
import { examples, exampleHtmlPath } from './diyDailyData';

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
          const src = exampleHtmlPath(example.id);
          const detailPath = `/clients/diy-daily/${example.id}`;
          return (
            <article className="diy-client-example" key={example.id}>
              <div className="diy-client-example-header">
                <div>
                  <span className="diy-client-label">Example {example.label}</span>
                  <h2>{example.name}</h2>
                </div>
                <Link to={detailPath}>Open</Link>
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
