import React, { useState } from 'react';
import { useInventory } from '../hooks/useInventory';
import PinModal from '../components/PinModal';
import EditRecordModal from '../components/EditRecordModal';

export default function History() {
  const { entries, exits, deleteEntry, deleteExit, adminPin } = useInventory();
  const [view, setView] = useState('entries');
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [action, setAction] = useState(null); // 'edit' or 'delete'

  const records = view === 'entries' ? entries : exits;

  const handleAction = (id, act) => {
    setSelectedId(id);
    setAction(act);
    if (adminPin) setPinModalOpen(true);
    else proceedAction();
  };

  const proceedAction = () => {
    if (action === 'edit') setEditModalOpen(true);
    if (action === 'delete') {
      if (view === 'entries') deleteEntry(selectedId);
      else deleteExit(selectedId);
    }
    setPinModalOpen(false);
  };

  return (
    <div className="history-page">
      <h2>History Logs</h2>
      <div>
        <button onClick={() => setView('entries')} disabled={view==='entries'}>View Entries</button>
        <button onClick={() => setView('exits')} disabled={view==='exits'}>View Exits</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Model</th>
            <th>Qty</th>
            <th>Unit</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map(r => (
            <tr key={r.id}>
              <td>{r.date}</td>
              <td>{r.model}</td>
              <td>{r.qty}</td>
              <td>{r.unit}</td>
              <td>
                <button onClick={() => handleAction(r.id, 'edit')}>Edit</button>
                <button onClick={() => handleAction(r.id, 'delete')}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <PinModal open={pinModalOpen} onClose={() => setPinModalOpen(false)} onSuccess={proceedAction} />
      <EditRecordModal open={editModalOpen} onClose={() => setEditModalOpen(false)} id={selectedId} type={view} />
    </div>
  );
}
