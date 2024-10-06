import React from 'react';
import CustomBar from './CustomBar';

export default function TaskRow({ task, dateRange, index }) {
  return (
    <div className="flex justify-between items-center h-10 text-sm text-white/80 border-b border-gray-700/30">
        <span className="truncate flex-grow">{task.name}</span>
        {/* Render the CustomBar next to the task name */}
        <div style={{ width: '100%', height: '20px', marginLeft: '8px' }}>
            <CustomBar task={task} dateRange={dateRange} index={index} />
        </div>
    </div>

  );
}
