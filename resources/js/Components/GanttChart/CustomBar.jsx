import React from 'react';

export default function CustomBar({ task, dateRange, yIndex }) {
  const startDate = new Date(task.start);
  const endDate = new Date(task.end);
  
  if (!dateRange || !dateRange.min || !dateRange.max) {
    console.error('Invalid dateRange:', dateRange);
    return null;
  }

  const totalDuration = dateRange.max.getTime() - dateRange.min.getTime();
  const barStart = ((startDate.getTime() - dateRange.min.getTime()) / totalDuration) * 100;
  const barWidth = ((endDate.getTime() - startDate.getTime()) / totalDuration) * 100;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return '#00C875';
      case 'in_progress':
        return '#0073EA';
      case 'blocked':
        return '#E44258';
      default:
        return '#fdab3d';
    }
  };

  // Constants for positioning
  const ROW_HEIGHT = 40;
  const BAR_HEIGHT = 24;
  
  // Calculate vertical position based on the task's absolute index
  const yPosition = yIndex * ROW_HEIGHT;

  return (
    <g>
      <rect
        x={`${barStart}%`}
        y={yPosition + (ROW_HEIGHT - BAR_HEIGHT) / 2}
        width={`${barWidth}%`}
        height={BAR_HEIGHT}
        rx={4}
        fill={getStatusColor(task.status)}
        opacity={0.9}
      />
    </g>
  );
}