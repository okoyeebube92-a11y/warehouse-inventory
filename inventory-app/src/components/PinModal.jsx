
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
      setError('Incorrect PIN.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Enter Admin PIN</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={input}
            onChange={e => setInput(e.target.value)}
            autoFocus
          />
          <button type="submit">Submit</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
}
