import React, { useState } from 'react';
import { useInventory } from '../hooks/useInventory';

export default function Settings() {
  const { adminPin, setAdminPin } = useInventory();
  const [pin, setPin] = useState(adminPin || '');
  const [newPin, setNewPin] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');

  const handleSetPin = (e) => {
    e.preventDefault();
    if (newPin !== confirm) {
      setMessage('PINs do not match.');
      return;
    }
    setAdminPin(newPin);
    setPin(newPin);
    setNewPin('');
    setConfirm('');
    setMessage('PIN set successfully.');
  };

  const handleRemovePin = () => {
    setAdminPin('');
    setPin('');
    setMessage('PIN removed.');
  };

  return (
    <div className="settings-page">
      <h2>Admin PIN Settings</h2>
      <form onSubmit={handleSetPin}>
        <div>
          <label>New PIN:</label>
          <input type="password" value={newPin} onChange={e => setNewPin(e.target.value)} />
        </div>
        <div>
          <label>Confirm PIN:</label>
          <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} />
        </div>
        <button type="submit">{pin ? 'Change PIN' : 'Set PIN'}</button>
        {pin && <button type="button" onClick={handleRemovePin}>Remove PIN</button>}
      </form>
      {message && <div className="message">{message}</div>}
    </div>
  );
}
