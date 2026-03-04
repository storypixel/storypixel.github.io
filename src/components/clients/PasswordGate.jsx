import React, { useState } from 'react';
import './ERPPrototype.css';

export default function PasswordGate({ password, children }) {
  const storageKey = `pw-gate-${password}`;
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(storageKey) === 'true');
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);

  if (authed) return children;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.toLowerCase() === password.toLowerCase()) {
      sessionStorage.setItem(storageKey, 'true');
      setAuthed(true);
    } else {
      setError(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
      setInput('');
    }
  };

  return (
    <div className="pw-gate">
      <form onSubmit={handleSubmit} className={`pw-gate-card ${shaking ? 'pw-gate-shake' : ''}`}>
        <h1 className="pw-gate-title">Client Preview</h1>
        <p className="pw-gate-sub">Enter password to continue</p>
        <input
          className="pw-gate-input"
          type="password"
          placeholder="Password"
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(false); }}
          autoFocus
        />
        <button className="pw-gate-submit" type="submit">Enter</button>
        {error && <p className="pw-gate-error">Incorrect password</p>}
      </form>
    </div>
  );
}
