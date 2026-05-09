import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { exampleHtmlPath, findExample } from './diyDailyData';

// Detail route: keep the clean URL (`/clients/diy-daily/<id>`) while showing
// the raw email — no React shell, no toolbar, no iframe.
//
// Approach: fetch the master email HTML (same file the index iframes), parse
// it with DOMParser, and replace the live <html> element with the parsed one.
// URL is unchanged because there's no navigation; only the document body and
// head are swapped in place.
//
// Both surfaces (index iframe + this route) consume the same static file as
// the master, so edits land in both places without copy-divergence.
export default function DIYDailyExample() {
  const { exampleId } = useParams();
  const example = findExample(exampleId);

  useEffect(() => {
    if (!example) return;
    let cancelled = false;
    fetch(exampleHtmlPath(example.id))
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load example: ${response.status}`);
        }
        return response.text();
      })
      .then((html) => {
        if (cancelled) return;
        const parsed = new DOMParser().parseFromString(html, 'text/html');
        const incoming = parsed.documentElement;
        if (!incoming) return;
        const adopted = document.adoptNode(incoming);
        document.replaceChild(adopted, document.documentElement);
      })
      .catch(() => {
        if (cancelled) return;
        // Fallback: hard redirect to the static file so the user still sees
        // the email even if the in-place swap fails.
        window.location.replace(exampleHtmlPath(example.id));
      });
    return () => {
      cancelled = true;
    };
  }, [example]);

  if (!example) {
    return <Navigate to="/clients/diy-daily" replace />;
  }

  return null;
}
