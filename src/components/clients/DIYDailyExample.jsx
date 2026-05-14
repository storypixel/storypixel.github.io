import { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { exampleHtmlPath, findExample } from './diyDailyData';

// Detail route: keep the clean URL (`/clients/diy-daily/<id>`) while showing
// the raw email — no React shell, no toolbar, no iframe. After the in-place
// document swap, a small floating export pill is injected so Quint can copy
// the URL, copy the HTML, or download a Mailchimp-ready .zip without any
// chrome over the email itself.
export default function DIYDailyExample() {
  const { exampleId } = useParams();
  const example = findExample(exampleId);

  useEffect(() => {
    if (!example) return;
    let cancelled = false;
    const sourceUrl = exampleHtmlPath(example.id);

    fetch(sourceUrl)
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
        injectExportPill({ exampleId: example.id, html, sourceUrl });
      })
      .catch(() => {
        if (cancelled) return;
        window.location.replace(sourceUrl);
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

function injectExportPill({ exampleId, html, sourceUrl }) {
  if (document.getElementById('diy-export-root')) return;

  const masterUrl = `${window.location.origin}${sourceUrl.split('?')[0]}`;

  const style = document.createElement('style');
  style.id = 'diy-export-style';
  style.textContent = `
    #diy-export-root {
      position: fixed;
      right: 18px;
      bottom: 18px;
      z-index: 2147483600;
      font: 500 13px/1.3 -apple-system, BlinkMacSystemFont, 'Segoe UI',
        'Helvetica Neue', Arial, sans-serif;
      letter-spacing: 0.01em;
      color: #f7f4ed;
    }
    #diy-export-root *, #diy-export-root *::before, #diy-export-root *::after {
      box-sizing: border-box;
    }
    #diy-export-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      background: rgba(23, 47, 61, 0.92);
      color: #e7c97a;
      border: 0;
      border-radius: 999px;
      cursor: pointer;
      backdrop-filter: blur(6px) saturate(120%);
      -webkit-backdrop-filter: blur(6px) saturate(120%);
      box-shadow: 0 6px 22px -8px rgba(8, 18, 26, 0.55),
        0 1px 0 rgba(255, 255, 255, 0.06) inset;
      transition: transform 160ms ease, background 160ms ease;
      font-weight: 600;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      font-size: 11.5px;
    }
    #diy-export-pill:hover { background: rgba(31, 60, 76, 0.95); transform: translateY(-1px); }
    #diy-export-pill:focus-visible { outline: 2px solid #e7c97a; outline-offset: 3px; }
    #diy-export-pill svg { width: 12px; height: 12px; transition: transform 200ms ease; }
    #diy-export-root[data-open="true"] #diy-export-pill svg { transform: rotate(180deg); }
    #diy-export-menu {
      position: absolute;
      bottom: calc(100% + 10px);
      right: 0;
      min-width: 220px;
      padding: 6px;
      background: rgba(23, 47, 61, 0.96);
      backdrop-filter: blur(10px) saturate(120%);
      -webkit-backdrop-filter: blur(10px) saturate(120%);
      border-radius: 14px;
      box-shadow: 0 18px 40px -16px rgba(8, 18, 26, 0.6),
        0 1px 0 rgba(255, 255, 255, 0.06) inset;
      display: flex;
      flex-direction: column;
      opacity: 0;
      transform: translateY(6px) scale(0.98);
      transform-origin: 100% 100%;
      pointer-events: none;
      transition: opacity 140ms ease, transform 160ms ease;
    }
    #diy-export-root[data-open="true"] #diy-export-menu {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }
    .diy-export-action {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      background: transparent;
      border: 0;
      border-radius: 10px;
      color: #f7f4ed;
      font: inherit;
      text-align: left;
      cursor: pointer;
      transition: background 120ms ease, color 120ms ease;
    }
    .diy-export-action:hover,
    .diy-export-action:focus-visible {
      background: rgba(231, 201, 122, 0.14);
      color: #e7c97a;
      outline: none;
    }
    .diy-export-action svg { width: 16px; height: 16px; flex: 0 0 16px; opacity: 0.85; }
    .diy-export-action span { flex: 1; }
    .diy-export-action small {
      color: rgba(247, 244, 237, 0.55);
      font-weight: 500;
      letter-spacing: 0.02em;
    }
    #diy-export-toast {
      position: absolute;
      bottom: calc(100% + 10px);
      right: 0;
      padding: 10px 14px;
      background: #e7c97a;
      color: #172f3d;
      font-weight: 600;
      letter-spacing: 0.04em;
      border-radius: 999px;
      box-shadow: 0 10px 24px -10px rgba(8, 18, 26, 0.5);
      opacity: 0;
      transform: translateY(6px);
      pointer-events: none;
      transition: opacity 160ms ease, transform 200ms ease;
    }
    #diy-export-toast.is-visible {
      opacity: 1;
      transform: translateY(0);
    }
    @media print { #diy-export-root { display: none !important; } }
    @media (prefers-reduced-motion: reduce) {
      #diy-export-pill, #diy-export-menu, #diy-export-toast,
      #diy-export-pill svg { transition: none; }
    }
    @media (max-width: 480px) {
      #diy-export-root { right: 12px; bottom: 12px; }
      #diy-export-menu { min-width: 200px; }
    }
  `;
  document.head.appendChild(style);

  const root = document.createElement('div');
  root.id = 'diy-export-root';
  root.dataset.open = 'false';

  const toast = document.createElement('div');
  toast.id = 'diy-export-toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');

  const menu = document.createElement('div');
  menu.id = 'diy-export-menu';
  menu.setAttribute('role', 'menu');
  menu.setAttribute('aria-label', 'Export options');

  const actions = [
    { id: 'copy-url', label: 'Copy URL', sub: '· for Mailchimp Import-from-URL', icon: iconLinkPath },
    { id: 'copy-html', label: 'Copy HTML', sub: '· paste into Code-your-own', icon: iconCodePath },
    { id: 'download-zip', label: 'Download .zip', sub: '· Mailchimp template upload', icon: iconZipPath },
  ];

  for (const action of actions) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'diy-export-action';
    btn.dataset.action = action.id;
    btn.setAttribute('role', 'menuitem');
    btn.appendChild(makeIcon(action.icon));
    const span = document.createElement('span');
    span.textContent = `${action.label} `;
    const small = document.createElement('small');
    small.textContent = action.sub;
    span.appendChild(small);
    btn.appendChild(span);
    menu.appendChild(btn);
  }

  const pill = document.createElement('button');
  pill.id = 'diy-export-pill';
  pill.type = 'button';
  pill.setAttribute('aria-haspopup', 'true');
  pill.setAttribute('aria-expanded', 'false');
  pill.appendChild(document.createTextNode('Export '));
  pill.appendChild(makeIcon(iconChevronPath));

  root.appendChild(toast);
  root.appendChild(menu);
  root.appendChild(pill);
  document.body.appendChild(root);

  let toastTimer = null;

  const setOpen = (open) => {
    root.dataset.open = open ? 'true' : 'false';
    pill.setAttribute('aria-expanded', open ? 'true' : 'false');
  };

  const flashToast = (text) => {
    toast.textContent = text;
    toast.classList.add('is-visible');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 1900);
  };

  pill.addEventListener('click', (e) => {
    e.stopPropagation();
    setOpen(root.dataset.open !== 'true');
  });

  document.addEventListener('click', (e) => {
    if (!root.contains(e.target)) setOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });

  menu.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    setOpen(false);
    try {
      if (action === 'copy-url') {
        await writeClipboard(masterUrl);
        flashToast('URL copied');
      } else if (action === 'copy-html') {
        await writeClipboard(html);
        flashToast('HTML copied');
      } else if (action === 'download-zip') {
        flashToast('Building zip…');
        const { default: JSZip } = await import('jszip');
        const zip = new JSZip();
        zip.file('index.html', html);
        const blob = await zip.generateAsync({ type: 'blob' });
        triggerDownload(blob, `diy-daily-${exampleId}.zip`);
        flashToast('Zip downloaded');
      }
    } catch (err) {
      flashToast('Action failed');
      // eslint-disable-next-line no-console
      console.warn('Export action failed', err);
    }
  });
}

async function writeClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

const SVG_NS = 'http://www.w3.org/2000/svg';

function makeIcon(buildPaths) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 16 16');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('aria-hidden', 'true');
  for (const node of buildPaths()) {
    svg.appendChild(node);
  }
  return svg;
}

function svgPath(d, extra = {}) {
  const p = document.createElementNS(SVG_NS, 'path');
  p.setAttribute('d', d);
  p.setAttribute('stroke', 'currentColor');
  p.setAttribute('stroke-width', '1.5');
  p.setAttribute('stroke-linecap', 'round');
  p.setAttribute('stroke-linejoin', 'round');
  for (const [k, v] of Object.entries(extra)) p.setAttribute(k, v);
  return p;
}

function iconChevronPath() {
  return [svgPath('M4 6.5l4 4 4-4', { 'stroke-width': '1.6' })];
}
function iconLinkPath() {
  return [svgPath('M6.5 9.5l3-3 M9 5h2a3 3 0 0 1 0 6H9 M7 11H5a3 3 0 0 1 0-6h2')];
}
function iconCodePath() {
  return [svgPath('M5 4.5L1.5 8 5 11.5 M11 4.5L14.5 8 11 11.5 M9.5 3l-3 10')];
}
function iconZipPath() {
  const out = [svgPath('M3 2h7l3 3v9H3V2z', { 'stroke-width': '1.4' })];
  // tiny zipper teeth
  for (const y of [6, 8, 10, 12]) {
    out.push(svgPath(`M7.5 ${y}h1`, { 'stroke-width': '1.2' }));
  }
  return out;
}
