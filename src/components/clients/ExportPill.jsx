import { useEffect, useRef, useState } from 'react';
import {
  writeClipboard,
  triggerDownload,
  buildZipBlob,
  masterUrlFor,
} from './exportUtils';

// Compact "Export" pill used inside React-rendered surfaces (e.g. the
// /clients/diy-daily gallery card). Mirrors the in-page injected pill on
// the detail route: same three actions, same visual language.
export default function ExportPill({ exampleId, htmlUrl, label = 'Export' }) {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState('');
  const rootRef = useRef(null);
  const toastTimer = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  const flash = (text) => {
    setToast(text);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 1900);
  };

  const handle = async (action) => {
    setOpen(false);
    try {
      if (action === 'copy-url') {
        await writeClipboard(masterUrlFor(htmlUrl));
        flash('URL copied');
        return;
      }
      // Lazy-fetch the email HTML only when actually needed.
      const html = await fetch(htmlUrl).then((r) => {
        if (!r.ok) throw new Error(`fetch failed ${r.status}`);
        return r.text();
      });
      if (action === 'copy-html') {
        await writeClipboard(html);
        flash('HTML copied');
      } else if (action === 'download-zip') {
        flash('Building zip…');
        const blob = await buildZipBlob(html);
        triggerDownload(blob, `diy-daily-${exampleId}.zip`);
        flash('Zip downloaded');
      }
    } catch {
      flash('Action failed');
    }
  };

  return (
    <div
      ref={rootRef}
      className={`diy-export-pill-root${open ? ' is-open' : ''}`}
      data-toast={toast || undefined}
    >
      {toast && <div className="diy-export-pill-toast" role="status" aria-live="polite">{toast}</div>}
      {open && (
        <div className="diy-export-pill-menu" role="menu" aria-label="Export options">
          <button type="button" role="menuitem" className="diy-export-pill-action" onClick={() => handle('copy-url')}>
            <Chevron type="link" />
            <span>Copy URL <small>· for Mailchimp Import-from-URL</small></span>
          </button>
          <button type="button" role="menuitem" className="diy-export-pill-action" onClick={() => handle('copy-html')}>
            <Chevron type="code" />
            <span>Copy HTML <small>· paste into Code-your-own</small></span>
          </button>
          <button type="button" role="menuitem" className="diy-export-pill-action" onClick={() => handle('download-zip')}>
            <Chevron type="zip" />
            <span>Download .zip <small>· Mailchimp template upload</small></span>
          </button>
        </div>
      )}
      <button
        type="button"
        className="diy-export-pill-button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
      >
        {label}
        <Chevron type="caret" />
      </button>
    </div>
  );
}

function Chevron({ type }) {
  switch (type) {
    case 'caret':
      return (
        <svg viewBox="0 0 12 12" width="11" height="11" fill="none" aria-hidden="true">
          <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'link':
      return (
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
          <path d="M6.5 9.5l3-3 M9 5h2a3 3 0 0 1 0 6H9 M7 11H5a3 3 0 0 1 0-6h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'code':
      return (
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
          <path d="M5 4.5L1.5 8 5 11.5 M11 4.5L14.5 8 11 11.5 M9.5 3l-3 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'zip':
      return (
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
          <path d="M3 2h7l3 3v9H3V2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M7.5 6h1 M7.5 8h1 M7.5 10h1 M7.5 12h1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}
