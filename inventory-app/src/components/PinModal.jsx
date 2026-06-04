import React, { useState } from 'react';
import { useInventory } from '../hooks/useInventory';
import '../styles/Modal.css';

export default function PinModal({ open, onClose, onSuccess }) {
  const { adminPin } = useInventory();
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input === adminPin) {
      setInput('');
      setError('');
      onSuccess();
      onClose();
    } else {
      setError('Incorrect admin PIN. Please try again.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: '360px' }}>
        <h3 style={{ fontFamily: 'var(--font-head)', marginBottom: '5px' }}>Security Verification</h3>
        <p style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '15px' }}>
          An admin PIN is required to perform edits or deletions.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Admin PIN</label>
            <input
              type="password"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="••••"
              autoFocus
              required
              style={{ letterSpacing: '0.2em', textAlign: 'center', fontSize: '18px' }}
            />
          </div>
          {error && <div className="error" style={{ marginBottom: '15px', fontSize: '12px', fontWeight: 600 }}>⚠ {error}</div>}
          <div className="btn-row" style={{ borderTop: 'none', paddingTop: 0, marginTop: 0 }}>
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Verify</button>
          </div>
        </form>
      </div>
    </div>
  );
}
