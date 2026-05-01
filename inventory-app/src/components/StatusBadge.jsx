// src/components/StatusBadge.jsx
import Badge from './Badge';

const CONFIG = {
  ok:   { variant: 'green',   label: 'In stock',  dot: true },
  low:  { variant: 'amber',   label: 'Low stock', dot: true },
  none: { variant: 'red',     label: 'No stock',  dot: true },
};

export default function StatusBadge({ status }) {
  const { variant, label, dot } = CONFIG[status] || CONFIG.ok;
  return <Badge variant={variant} dot={dot}>{label}</Badge>;
}
