import React from 'react';
import { Calendar, Clock, Users } from 'lucide-react';
import { STATUS_COLORS } from './Constants';
import { StatusBadge } from './StatusBadge';

export const TaskCard = ({ task }) => {
  const statusColor = STATUS_COLORS[task.status]?.bg || '#E5E7EB';

  return (
    <div className="bg-white rounded-lg shadow-lg border p-4 min-w-[300px]">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500">{task.task.project?.name}</span>
        <StatusBadge status={task.status} />
      </div>
      
      <h3 className="font-medium text-gray-900 mb-3">{task.name}</h3>
      
      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Start: {new Date(task.startDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-2" />
          <span>Due: {new Date(task.endDate).toLocaleDateString()}</span>
        </div>
        {task.task.assignees && (
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2" />
            <span>{task.task.assignees.length} assignees</span>
          </div>
        )}
      </div>
    </div>
  );
};