// src/components/Badge.jsx
// Reusable badge. variant: 'green' | 'amber' | 'red' | 'blue' | 'neutral'

export default function Badge({ variant = 'neutral', children, dot = false }) {
  const dotClass = {
    green:   'dot-green',
    amber:   'dot-amber',
    red:     'dot-red',
    blue:    'dot-green',
    neutral: '',
  }[variant];

  return (
    <span className={`badge badge-${variant}`}>
      {dot && <span className={`dot ${dotClass}`} />}
      {children}
    </span>
  );
}
