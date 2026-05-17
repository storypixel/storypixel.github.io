// Shared helpers for the DIY Daily export actions.
// Used by both the in-page injected pill on the detail route and the React
// pill on the gallery card.

export async function writeClipboard(text) {
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

export function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export async function buildZipBlob(html) {
  const { default: JSZip } = await import('jszip');
  const zip = new JSZip();
  zip.file('index.html', html);
  return zip.generateAsync({ type: 'blob' });
}

export function masterUrlFor(htmlUrl) {
  return new URL(htmlUrl, window.location.origin).toString().split('?')[0];
}
