import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import './DIYDailyExample.css';
import { exampleHtmlPath, findExample } from './diyDailyData';

export default function DIYDailyExample() {
  const { exampleId } = useParams();
  const example = findExample(exampleId);

  if (!example) {
    return <Navigate to="/clients/diy-daily" replace />;
  }

  const src = exampleHtmlPath(example.id);
  const openInNewTab = src;

  return (
    <div className="diy-detail-root">
      <header className="diy-detail-toolbar">
        <Link to="/clients/diy-daily" className="diy-detail-back">
          ← All examples
        </Link>
        <div className="diy-detail-meta">
          <span className="diy-detail-label">Example {example.label}</span>
          <h1>{example.name}</h1>
          <p>{example.note}</p>
        </div>
        <a
          className="diy-detail-rawlink"
          href={openInNewTab}
          target="_blank"
          rel="noreferrer"
        >
          Open raw HTML ↗
        </a>
      </header>

      <div className="diy-detail-frame-wrap">
        <iframe
          title={`DIY Daily ${example.name}`}
          src={src}
          className="diy-detail-frame"
        />
      </div>
    </div>
  );
}
