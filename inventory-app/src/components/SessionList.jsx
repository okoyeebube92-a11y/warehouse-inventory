// src/components/SessionList.jsx
// Displays the staged items before they are saved.
// mode: 'entry' | 'exit'
import Badge from './Badge';
import { fmtDate, getBalance } from '../utils/inventory';
import '../styles/SessionList.css';

export default function SessionList({ items, mode, onRemove, entries, exits }) {
  if (items.length === 0) {
    return (
      <div className="empty">
        No {mode === 'exit' ? 'exits' : 'entries'} added yet.{' '}
        Fill the form and click &quot;
        {mode === 'exit' ? '− Add to exit list' : '+ Add to list'}&quot;.
      </div>
    );
  }

  return (
    <div className="session-list">
      <div className="session-list__header">
        <span>Model</span>
        <span>Qty</span>
        <span>Unit</span>
        <span />
      </div>
      {items.map((item, i) => {
        const remaining = mode === 'exit'
          ? getBalance(item.model, entries, exits) - item.qty
          : null;

        return (
          <div className="session-item" key={i}>
            <div>
              <div className="session-model">{item.model}</div>
              <div className="session-date">
                {fmtDate(item.date)}
                {mode === 'exit' && remaining !== null && (
                  <> · {remaining} remaining after</>
                )}
              </div>
            </div>
            <div className={`session-qty${mode === 'exit' ? ' session-qty--exit' : ''}`}>
              {mode === 'exit' ? `−${item.qty}` : item.qty}
            </div>
            <Badge variant={item.unit === 'pcs' ? 'blue' : 'neutral'}>
              {item.unit}
            </Badge>
            <button
              className="remove-btn"
              onClick={() => onRemove(i)}
              aria-label="Remove item"
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}
