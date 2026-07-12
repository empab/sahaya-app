import React from 'react';
import { STATUS_META } from '../data/mock.js';

export default function StatusPill({ status }) {
  const meta = STATUS_META[status] || STATUS_META.pending;
  return (
    <span className="sh-pill" style={{ background: meta.color + '22', color: meta.color }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: meta.color }} />
      {meta.label}
    </span>
  );
}
