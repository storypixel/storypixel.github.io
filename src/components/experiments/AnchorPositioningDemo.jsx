import React, { useEffect, useRef, useState } from 'react';

const supported = typeof CSS !== 'undefined' && CSS.supports && CSS.supports('anchor-name: --x');

const AnchorPositioningDemo = () => {
    const containerRef = useRef(null);
    const cardRef = useRef(null);
    const [pos, setPos] = useState({ x: 80, y: 80 });
    const dragging = useRef(false);
    const offset = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const onMove = (e) => {
            if (!dragging.current || !containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            setPos({
                x: Math.max(0, Math.min(rect.width - 180, clientX - rect.left - offset.current.x)),
                y: Math.max(0, Math.min(rect.height - 100, clientY - rect.top - offset.current.y)),
            });
        };
        const onUp = () => { dragging.current = false; };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        window.addEventListener('touchmove', onMove, { passive: false });
        window.addEventListener('touchend', onUp);
        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
            window.removeEventListener('touchmove', onMove);
            window.removeEventListener('touchend', onUp);
        };
    }, []);

    const startDrag = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        offset.current = { x: clientX - rect.left, y: clientY - rect.top };
        dragging.current = true;
    };

    return (
        <div style={{
            padding: '2rem',
            maxWidth: '900px',
            margin: '0 auto',
            color: '#fff',
        }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 400, marginBottom: '0.5rem' }}>
                Drag the card around
            </h2>
            <p style={{ color: '#aaa', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                Three tooltips are positioned via <code>position-anchor</code>. Zero JavaScript for their placement — they follow the card because CSS knows where the anchor is.
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
                    Your browser does not support CSS Anchor Positioning. Demo will show, but the tooltip positioning will fall back to absolute coordinates via JavaScript. Try latest Chrome.
                </div>
            )}

            <div
                ref={containerRef}
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '500px',
                    background: 'repeating-linear-gradient(45deg, #1a1a1a, #1a1a1a 10px, #151515 10px, #151515 20px)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    overflow: 'hidden',
                    touchAction: 'none',
                }}
            >
                <div
                    ref={cardRef}
                    onMouseDown={startDrag}
                    onTouchStart={startDrag}
                    style={{
                        position: 'absolute',
                        left: `${pos.x}px`,
                        top: `${pos.y}px`,
                        width: '180px',
                        height: '100px',
                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                        borderRadius: '12px',
                        cursor: 'grab',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '0.9rem',
                        userSelect: 'none',
                        anchorName: '--card',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
                    }}
                >
                    Drag me
                </div>

                {supported ? (
                    <>
                        <div style={anchorStyle({ positionArea: 'top', offset: 12 })}>
                            top: anchor(top)
                        </div>
                        <div style={anchorStyle({ positionArea: 'right', offset: 12 })}>
                            left: anchor(right)
                        </div>
                        <div style={anchorStyle({ positionArea: 'bottom', offset: 12 })}>
                            top: anchor(bottom)
                        </div>
                    </>
                ) : (
                    <>
                        <div style={fallbackStyle(pos.x + 90 - 90, pos.y - 36)}>top: anchor(top)</div>
                        <div style={fallbackStyle(pos.x + 192, pos.y + 38)}>left: anchor(right)</div>
                        <div style={fallbackStyle(pos.x + 90 - 90, pos.y + 108)}>top: anchor(bottom)</div>
                    </>
                )}
            </div>
        </div>
    );
};

const pillBase = {
    padding: '6px 12px',
    background: 'rgba(255,255,255,0.92)',
    color: '#111',
    borderRadius: '999px',
    fontSize: '12px',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    whiteSpace: 'nowrap',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    position: 'absolute',
};

function anchorStyle({ positionArea, offset }) {
    const base = {
        ...pillBase,
        positionAnchor: '--card',
        positionArea,
    };
    if (positionArea === 'top') base.marginBottom = `${offset}px`;
    if (positionArea === 'right') base.marginLeft = `${offset}px`;
    if (positionArea === 'bottom') base.marginTop = `${offset}px`;
    if (positionArea === 'left') base.marginRight = `${offset}px`;
    return base;
}

function fallbackStyle(left, top) {
    return {
        ...pillBase,
        left: `${left}px`,
        top: `${top}px`,
    };
}

export default AnchorPositioningDemo;
