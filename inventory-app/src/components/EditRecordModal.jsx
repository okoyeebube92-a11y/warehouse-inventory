
import React, { useState, useEffect } from 'react';
import { useInventory } from '../hooks/useInventory';
import '../styles/Modal.css';

export default function EditRecordModal({ open, onClose, id, type }) {
  const { entries, exits, updateEntry, updateExit } = useInventory();
  const [form, setForm] = useState({ model: '', date: '', qty: '', unit: '' });

  useEffect(() => {
    if (!open) return;
    const record = (type === 'entries' ? entries : exits).find(r => r.id === id);
    if (record) setForm({ model: record.model, date: record.date, qty: record.qty, unit: record.unit });
  }, [open, id, type, entries, exits]);

  if (!open) return null;

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (type === 'entries') updateEntry(id, { ...form, qty: Number(form.qty) });
    else updateExit(id, { ...form, qty: Number(form.qty) });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Edit Record</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Model:</label>
            <input name="model" value={form.model} onChange={handleChange} required />
          </div>
          <div>
            <label>Date:</label>
            <input name="date" type="date" value={form.date} onChange={handleChange} required />
          </div>
          <div>
            <label>Quantity:</label>
            <input name="qty" type="number" value={form.qty} onChange={handleChange} required />
          </div>
          <div>
            <label>Unit:</label>
            <input name="unit" value={form.unit} onChange={handleChange} required />
          </div>
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
}
