import React from 'react';
import { STATUS_COLORS } from './Constants';

export default function CustomBar({ x, y, width, height, task, startPosition, endPosition, dateRange }) {
  const color = STATUS_COLORS[task.status]?.bg || '#E5E7EB';
  
  // Calculate the position and width based on the full date range
  const totalRange = dateRange.max.getTime() - dateRange.min.getTime();
  const barStart = ((startPosition - dateRange.min.getTime()) / totalRange) * width;
  const barWidth = Math.max(((endPosition - startPosition) / totalRange) * width, 20);

  return (
    <g>
      <rect
        x={x + barStart}
        y={y}
        width={barWidth}
        height={height}
        fill={color}
        rx={4}
        ry={4}
        className="cursor-pointer hover:opacity-80 transition-opacity"
      />
    </g>
  );
}