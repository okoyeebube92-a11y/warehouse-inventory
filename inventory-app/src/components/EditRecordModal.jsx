import React, { useState, useEffect } from 'react';
import { useInventory } from '../hooks/useInventory';
import '../styles/Modal.css';

export default function EditRecordModal({ open, onClose, id, type }) {
  const { entries, exits, updateEntry, updateExit } = useInventory();
  const [form, setForm] = useState({ model: '', date: '', qty: '', unit: '', supplier: '', location: '' });

  useEffect(() => {
    if (!open) return;
    const record = (type === 'entries' ? entries : exits).find(r => r.id === id);
    if (record) {
      setForm({
        model: record.model,
        date: record.date,
        qty: record.qty,
        unit: record.unit,
        supplier: record.supplier || '',
        location: record.location || '',
      });
    }
  }, [open, id, type, entries, exits]);

  if (!open) return null;

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const updateData = {
      model: form.model.toUpperCase().trim(),
      date: form.date,
      qty: Number(form.qty),
      unit: form.unit,
    };
    if (type === 'exits') {
      updateData.supplier = form.supplier.trim() || null;
      updateData.location = form.location.trim() || null;
    }

    try {
      if (type === 'entries') {
        await updateEntry(id, updateData);
      } else {
        await updateExit(id, updateData);
      }
      onClose();
    } catch (err) {
      alert("Failed to update record: " + err.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3 style={{ fontFamily: 'var(--font-head)', marginBottom: '10px' }}>
          Edit {type === 'entries' ? 'Entry' : 'Exit'} Record
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Model No.</label>
            <input name="model" value={form.model} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input name="date" type="date" value={form.date} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Quantity</label>
            <input name="qty" type="number" value={form.qty} onChange={handleChange} required min="1" />
          </div>
          <div className="form-group">
            <label className="form-label">Unit</label>
            <select name="unit" value={form.unit} onChange={handleChange} required>
              <option value="pcs">pcs — pieces</option>
              <option value="ctn">ctn — cartons</option>
            </select>
          </div>
          {type === 'exits' && (
            <>
              <div className="form-group">
                <label className="form-label">Supplier / Client</label>
                <input name="supplier" value={form.supplier} onChange={handleChange} placeholder="e.g. OKEY SHOP 2" />
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. LAGOS" />
              </div>
            </>
          )}
          <div className="btn-row" style={{ borderTop: '1px solid var(--border)', marginTop: '20px', paddingTop: '15px' }}>
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}
