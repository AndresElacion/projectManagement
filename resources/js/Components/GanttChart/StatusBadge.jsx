import React from 'react';
import { STATUS_COLORS } from './Constants';

export const StatusBadge = ({ status }) => {
  const config = STATUS_COLORS[status] || { bg: '#E5E7EB', text: '#374151' };

  return (
    <span
      className="px-2 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: config.lightBg, color: config.text }}
    >
      {status.replace('_', ' ').toUpperCase()}
    </span>
  );
};