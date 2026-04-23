import React from 'react';

const IsolatedFrame = ({ html, title = 'demo', style }) => {
    return (
        <iframe
            title={title}
            srcDoc={html}
            sandbox="allow-scripts allow-same-origin"
            style={{
                width: '100%',
                height: '100%',
                border: 'none',
                background: 'transparent',
                display: 'block',
                ...style,
            }}
        />
    );
};

export default IsolatedFrame;
