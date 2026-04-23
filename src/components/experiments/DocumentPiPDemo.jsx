import React, { useEffect, useRef, useState } from 'react';

const supported = typeof window !== 'undefined' && 'documentPictureInPicture' in window;

const DocumentPiPDemo = () => {
    const [bpm, setBpm] = useState(96);
    const [running, setRunning] = useState(false);
    const [beat, setBeat] = useState(0);
    const pipWindowRef = useRef(null);
    const pipContentRef = useRef(null);
    const hostRef = useRef(null);
    const tickRef = useRef(null);

    useEffect(() => {
        if (!running) return;
        const interval = 60000 / bpm;
        tickRef.current = setInterval(() => {
            setBeat((b) => (b + 1) % 4);
        }, interval);
        return () => clearInterval(tickRef.current);
    }, [running, bpm]);

    const openPiP = async () => {
        if (!supported) return;
        if (pipWindowRef.current && !pipWindowRef.current.closed) {
            pipWindowRef.current.focus();
            return;
        }
        const pipWindow = await window.documentPictureInPicture.requestWindow({
            width: 360,
            height: 220,
        });
        pipWindowRef.current = pipWindow;

        [...document.styleSheets].forEach((sheet) => {
            try {
                const css = [...sheet.cssRules].map((r) => r.cssText).join('');
                const style = pipWindow.document.createElement('style');
                style.textContent = css;
                pipWindow.document.head.appendChild(style);
            } catch { /* cross-origin sheets */ }
        });

        pipWindow.document.body.style.margin = '0';
        pipWindow.document.body.style.background = '#0a0a0a';
        pipWindow.document.body.style.color = '#fff';
        pipWindow.document.body.style.fontFamily = 'inherit';

        if (hostRef.current && pipContentRef.current) {
            pipWindow.document.body.appendChild(pipContentRef.current);
        }

        pipWindow.addEventListener('pagehide', () => {
            if (hostRef.current && pipContentRef.current) {
                hostRef.current.appendChild(pipContentRef.current);
            }
            pipWindowRef.current = null;
        });
    };

    return (
        <div style={{
            padding: '2rem',
            maxWidth: '800px',
            margin: '0 auto',
            color: '#fff',
        }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 400, marginBottom: '0.5rem' }}>
                Pop this metronome out of the page
            </h2>
            <p style={{ color: '#aaa', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                Document Picture-in-Picture opens a real, styled browser window backed by a live DOM subtree. Click <strong>Pop out</strong> — the metronome floats above every other window while the React state stays intact.
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
                    Your browser does not support <code>documentPictureInPicture</code>. Available in desktop Chrome/Edge 116+.
                </div>
            )}

            <div style={{
                display: 'flex',
                gap: '0.75rem',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
            }}>
                <button
                    onClick={openPiP}
                    disabled={!supported}
                    style={{
                        padding: '0.6rem 1.2rem',
                        background: supported ? '#3b82f6' : '#333',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        cursor: supported ? 'pointer' : 'not-allowed',
                        fontFamily: 'inherit',
                    }}
                >
                    Pop out ↗
                </button>
                <button
                    onClick={() => setRunning((r) => !r)}
                    style={{
                        padding: '0.6rem 1.2rem',
                        background: 'transparent',
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                    }}
                >
                    {running ? 'Stop' : 'Start'} metronome
                </button>
            </div>

            <div ref={hostRef}>
                <div
                    ref={pipContentRef}
                    style={{
                        padding: '1.5rem',
                        background: '#151515',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1rem',
                        color: '#fff',
                    }}
                >
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {[0, 1, 2, 3].map((i) => (
                            <div
                                key={i}
                                style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    background: beat === i && running ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                                    transition: 'background 0.08s',
                                }}
                            />
                        ))}
                    </div>
                    <div style={{ fontSize: '2rem', fontVariantNumeric: 'tabular-nums' }}>
                        {bpm} BPM
                    </div>
                    <input
                        type="range"
                        min="40"
                        max="200"
                        value={bpm}
                        onChange={(e) => setBpm(Number(e.target.value))}
                        style={{ width: '200px' }}
                    />
                    <div style={{ fontSize: '0.75rem', color: '#888' }}>
                        {running ? 'Running' : 'Paused'} · state lives in the original page
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentPiPDemo;
