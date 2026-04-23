import React from 'react';
import IsolatedFrame from './IsolatedFrame';

const supported = typeof CSS !== 'undefined' && CSS.supports && CSS.supports('animation-timeline: view()');

const demoHtml = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
    :root { color-scheme: dark; }
    html, body {
        margin: 0;
        padding: 0;
        height: 100%;
        background: #0a0a0a;
        color: #fff;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
    }
    body {
        display: flex;
        flex-direction: column;
    }

    header {
        padding: 1.25rem 2rem;
        border-bottom: 1px solid rgba(255,255,255,0.08);
        flex-shrink: 0;
        background: #0a0a0a;
        position: sticky;
        top: 0;
        z-index: 10;
    }
    header h2 {
        font-size: 1.25rem;
        font-weight: 400;
        margin: 0 0 0.5rem 0;
    }
    header p {
        color: #aaa;
        font-size: 0.9rem;
        margin: 0 0 0.75rem 0;
        max-width: 60ch;
    }
    header code {
        background: rgba(255,255,255,0.06);
        padding: 0.1em 0.35em;
        border-radius: 3px;
        font-size: 0.85em;
    }

    .progress-track {
        height: 3px;
        background: rgba(255,255,255,0.08);
        border-radius: 2px;
        overflow: hidden;
    }
    .progress-bar {
        height: 100%;
        background: linear-gradient(90deg, #3b82f6, #ec4899);
        transform-origin: left center;
        transform: scaleX(0);
        animation: sd-bar linear both;
        animation-timeline: scroll(root);
    }
    @keyframes sd-bar {
        from { transform: scaleX(0); }
        to   { transform: scaleX(1); }
    }

    main {
        padding: 4rem 2rem;
        display: flex;
        flex-direction: column;
        gap: 2rem;
        align-items: center;
    }

    .card {
        width: 100%;
        max-width: 520px;
        height: 180px;
        border-radius: 16px;
        display: flex;
        align-items: flex-end;
        padding: 1.5rem;
        font-size: 1.1rem;
        color: #fff;
        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        box-sizing: border-box;
        animation: sd-reveal linear both;
        animation-timeline: view();
        animation-range: entry 0% cover 40%;
    }
    @keyframes sd-reveal {
        from { opacity: 0; transform: translateY(40px) scale(0.92) rotate(-2deg); }
        to   { opacity: 1; transform: translateY(0) scale(1) rotate(0deg); }
    }

    footer {
        padding: 2rem;
        color: #666;
        font-size: 0.85rem;
        text-align: center;
    }
</style>
</head>
<body>
    <header>
        <h2>Scroll through the column</h2>
        <p>Each card animates itself as it enters the viewport. No IntersectionObserver, no scroll listener — just <code>animation-timeline: view()</code> in CSS.</p>
        <div class="progress-track"><div class="progress-bar"></div></div>
    </header>
    <main>
${Array.from({ length: 12 }, (_, i) => {
    const hue = (i * 30) % 360;
    const label = `Card ${String(i + 1).padStart(2, '0')}`;
    return `        <div class="card" style="background: linear-gradient(135deg, hsl(${hue}, 70%, 45%), hsl(${(hue + 40) % 360}, 70%, 35%));">${label}</div>`;
}).join('\n')}
    </main>
    <footer>End of column.</footer>
</body>
</html>`;

const ScrollDrivenDemo = () => {
    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            color: '#fff',
            background: '#0a0a0a',
        }}>
            {!supported && (
                <div style={{
                    padding: '0.75rem 1rem',
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    color: '#fca5a5',
                    borderRadius: '6px',
                    margin: '1rem 2rem 0',
                    fontSize: '0.9rem',
                    flexShrink: 0,
                }}>
                    Your browser does not support <code>animation-timeline: view()</code>. The demo will render but cards won't animate on scroll. Needs Chrome/Edge 115+.
                </div>
            )}
            <div style={{ flex: 1, minHeight: 0 }}>
                <IsolatedFrame html={demoHtml} title="Scroll-driven animation demo" />
            </div>
        </div>
    );
};

export default ScrollDrivenDemo;
