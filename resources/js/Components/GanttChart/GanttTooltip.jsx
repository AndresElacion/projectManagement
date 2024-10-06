import React from 'react';
import { parseDate } from './Utils'; // Assuming you've moved parseDate to utils.js

function GanttTooltip({ active, payload }) {
    if (!active || !payload?.[0]?.payload) return null;

    const task = payload[0].payload;
    const startDate = parseDate(task.created_at);
    const endDate = parseDate(task.due_date);

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
            <p className="font-medium">{task.name}</p>
            <p className="text-sm text-gray-600">Start: {formatDate(startDate)}</p>
            <p className="text-sm text-gray-600">End: {formatDate(endDate)}</p>
            <p className="text-sm text-gray-600">Status: {task.status}</p>
        </div>
    );
}

export default GanttTooltip;
