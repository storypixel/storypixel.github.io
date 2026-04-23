import React, { useEffect, useState } from 'react';

const supported = typeof CSS !== 'undefined' && 'paintWorklet' in CSS;

const HoudiniPaintDemo = () => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [size, setSize] = useState(32);
    const [hue, setHue] = useState(220);
    const [warp, setWarp] = useState(0.3);

    useEffect(() => {
        if (!supported || loaded) return;
        CSS.paintWorklet.addModule('/worklets/checker-paint.js')
            .then(() => setLoaded(true))
            .catch((e) => setError(String(e)));
    }, [loaded]);

    const canvasStyle = {
        width: '100%',
        height: '320px',
        borderRadius: '12px',
        background: supported && loaded
            ? 'paint(checker)'
            : `conic-gradient(from 0deg at 50% 50%, hsl(${hue}, 70%, 45%), hsl(${(hue + 120) % 360}, 70%, 45%), hsl(${(hue + 240) % 360}, 70%, 45%), hsl(${hue}, 70%, 45%))`,
        '--checker-size': `${size}`,
        '--checker-hue': `${hue}`,
        '--checker-warp': `${warp}`,
        border: '1px solid rgba(255,255,255,0.08)',
        transition: 'background 0.1s',
    };

    return (
        <div style={{
            padding: '2rem',
            maxWidth: '900px',
            margin: '0 auto',
            color: '#fff',
        }}>
            <style>{`
                @property --checker-size { syntax: '<number>'; inherits: false; initial-value: 20; }
                @property --checker-hue { syntax: '<number>'; inherits: false; initial-value: 220; }
                @property --checker-warp { syntax: '<number>'; inherits: false; initial-value: 0; }
            `}</style>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 400, marginBottom: '0.5rem' }}>
                A custom CSS paint function
            </h2>
            <p style={{ color: '#aaa', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                The checkered surface below is painted by a CSS Paint Worklet — JavaScript running on the render thread, drawing into a canvas that CSS consumes as <code>background: paint(checker)</code>. Three CSS custom properties are declared with <code>@property</code> so they animate.
            </p>

            {!supported && (
                <div style={{
                    padding: '0.75rem 1rem',
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    color: '#fca5a5',
                    borderRadius: '6px',
                    marginBottom: '1.5rem',
                    fontSize: '0.9rem',
                }}>
                    Your browser does not support CSS Paint Worklets (Houdini). Falling back to a static conic gradient. Try desktop Chrome.
                </div>
            )}
            {error && (
                <div style={{
                    padding: '0.75rem 1rem',
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    color: '#fca5a5',
                    borderRadius: '6px',
                    marginBottom: '1.5rem',
                    fontSize: '0.85rem',
                }}>
                    Worklet load failed: {error}
                </div>
            )}

            <div style={canvasStyle} />

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1.25rem',
                marginTop: '1.5rem',
            }}>
                <label style={labelStyle}>
                    <span>Cell size: {size}px</span>
                    <input type="range" min="8" max="80" value={size} onChange={(e) => setSize(Number(e.target.value))} />
                </label>
                <label style={labelStyle}>
                    <span>Hue: {hue}°</span>
                    <input type="range" min="0" max="360" value={hue} onChange={(e) => setHue(Number(e.target.value))} />
                </label>
                <label style={labelStyle}>
                    <span>Warp: {warp.toFixed(2)}</span>
                    <input type="range" min="0" max="1" step="0.01" value={warp} onChange={(e) => setWarp(Number(e.target.value))} />
                </label>
            </div>

            <p style={{ color: '#666', fontSize: '0.8rem', marginTop: '1.5rem' }}>
                {supported && loaded ? 'Worklet loaded — sliders drive the paint function directly.' : supported ? 'Loading worklet…' : 'Fallback gradient active.'}
            </p>
        </div>
    );
};

const labelStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
    fontSize: '0.85rem',
    color: '#ccc',
};

export default HoudiniPaintDemo;
