import React, { useState } from 'react';
import ERPPrototype from './ERPPrototype';
import AdminPrototype from './AdminPrototype';

export default function ERPDemo() {
  const [mode, setMode] = useState('patient');

  return (
    <>
      <div style={{
        position: 'fixed',
        top: 12,
        left: 12,
        zIndex: 100,
        display: 'flex',
        gap: 4,
        background: 'rgba(0,0,0,0.5)',
        borderRadius: 10,
        padding: 4,
        fontFamily: "'Quicksand', sans-serif",
      }}>
        <button
          onClick={() => setMode('patient')}
          style={{
            padding: '8px 16px',
            fontSize: 13,
            fontWeight: 600,
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            background: mode === 'patient' ? '#c8b8e8' : 'transparent',
            color: mode === 'patient' ? '#1a1a2e' : '#888',
            transition: 'all 0.2s',
          }}
        >
          Patient
        </button>
        <button
          onClick={() => setMode('admin')}
          style={{
            padding: '8px 16px',
            fontSize: 13,
            fontWeight: 600,
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            background: mode === 'admin' ? '#c8b8e8' : 'transparent',
            color: mode === 'admin' ? '#1a1a2e' : '#888',
            transition: 'all 0.2s',
          }}
        >
          Therapist
        </button>
      </div>
      {mode === 'patient' ? <ERPPrototype /> : <AdminPrototype />}
    </>
  );
}
