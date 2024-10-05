import React, { useState, useMemo, useCallback } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import TaskFilters from '../TaskFilters';
import CustomBar from "@/Components/GanttChart/CustomBar";

const parseDate = (dateString) => {
  if (!dateString) return new Date();
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? new Date() : date;
};

const getDateRange = (tasks) => {
  if (!tasks?.length) {
    const today = new Date();
    return {
      min: new Date(today.getFullYear(), today.getMonth(), 1),
      max: new Date(today.getFullYear(), today.getMonth() + 1, 0),
    };
  }

  const dates = tasks.flatMap(task => [
    parseDate(task.created_at),
    parseDate(task.due_date),
  ]);

  const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));

  minDate.setDate(1);
  maxDate.setDate(maxDate.getDate() + 7);

  return { min: minDate, max: maxDate };
};

function GanttTooltip({ active, payload }) {
  if (!active || !payload?.[0]?.payload) return null;

  const task = payload[0].payload;
  const startDate = parseDate(task.task.created_at);
  const endDate = parseDate(task.task.due_date);
  
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white p-3 rounded-lg shadow-lg border">
      <p className="font-medium">{task.name}</p>
      <p className="text-sm text-gray-600">Start: {formatDate(startDate)}</p>
      <p className="text-sm text-gray-600">End: {formatDate(endDate)}</p>
      <p className="text-sm text-gray-600">Status: {task.status}</p>
      {task.task.project && (
        <p className="text-sm text-gray-600">Project: {task.task.project.name}</p>
      )}
      <p className="text-sm text-gray-600">Duration: {task.duration} days</p>
    </div>
  );
}

export default function GanttChart({ tasks: initialTasks }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProject, setFilterProject] = useState('');

  const projects = useMemo(() => {
    const projectSet = new Set(initialTasks.data.map(task => task.project?.name).filter(Boolean));
    return Array.from(projectSet);
  }, [initialTasks]);

  const filteredTasks = useMemo(() => {
    return initialTasks.data.filter(task => {
      const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProject = !filterProject || task.project?.name === filterProject;
      return matchesSearch && matchesProject;
    });
  }, [initialTasks.data, searchTerm, filterProject]);

  const calculateDuration = useCallback((start, end) => {
    const startDate = parseDate(start);
    const endDate = parseDate(end);
    return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  }, []);

  const ganttData = useMemo(() => {
    return filteredTasks.map(task => {
      const startDate = parseDate(task.created_at);
      const endDate = parseDate(task.due_date);
      const duration = calculateDuration(task.created_at, task.due_date);

      return {
        name: task.name,
        start: startDate.getTime(),
        end: endDate.getTime(),
        duration: duration,
        status: task.status,
        task: task,
        startPosition: startDate.getTime(),
        endPosition: endDate.getTime(),
      };
    }).sort((a, b) => a.start - b.start);
  }, [filteredTasks, calculateDuration]);

  const dateRange = useMemo(() => getDateRange(ganttData), [ganttData]);

  const formatXAxisTick = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const generateTicks = useMemo(() => {
    const ticks = [];
    const startTime = dateRange.min.getTime();
    const endTime = dateRange.max.getTime();
    const weekInMs = 7 * 24 * 60 * 60 * 1000;

    let currentTime = startTime;
    while (currentTime <= endTime) {
      ticks.push(currentTime);
      currentTime += weekInMs;
    }

    if (!ticks.includes(startTime)) ticks.unshift(startTime);
    if (!ticks.includes(endTime)) ticks.push(endTime);

    return ticks.sort((a, b) => a - b);
  }, [dateRange]);

  const chartConfig = {
    xAxis: {
      type: 'number',
      domain: [dateRange.min.getTime(), dateRange.max.getTime()],
      tickFormatter: formatXAxisTick,
      ticks: generateTicks,
      scale: 'time',
      tick: { 
        fontSize: 12, 
        angle: -45, // Rotate tick labels
        textAnchor: 'end', // Anchor text to the end
        dy: 10, // Adjust vertical positioning
      },
      axisLine: { stroke: '#E5E7EB' },
      tickLine: { stroke: '#E5E7EB' },
      height: 70,
    },
    yAxis: {
      type: 'category',
      dataKey: 'name',
      width: 150,
      tick: { fontSize: 12 },
      axisLine: { stroke: '#E5E7EB' },
      tickLine: { stroke: '#E5E7EB' },
    },
  };
  

  return (
    <div className="p-4">
      <TaskFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterProject={filterProject}
        setFilterProject={setFilterProject}
        projects={projects}
      />

      <div className="bg-white rounded-lg shadow p-4 mt-4">
        <div className="h-[600px] w-full">
          {ganttData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ganttData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 20, bottom: 90 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis {...chartConfig.xAxis} />
                <YAxis {...chartConfig.yAxis} />
                <Tooltip content={<GanttTooltip />} />
                <Bar
                  dataKey="duration"
                  minPointSize={20}
                  shape={(props) => (
                    <CustomBar 
                      {...props} 
                      task={props.payload}
                      startPosition={props.payload.startPosition}
                      endPosition={props.payload.endPosition}
                      dateRange={dateRange}
                    />
                  )}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No tasks found matching your criteria</p>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#FCD34D] rounded"></div>
            <span className="text-sm text-gray-600">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#60A5FA] rounded"></div>
            <span className="text-sm text-gray-600">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#34D399] rounded"></div>
            <span className="text-sm text-gray-600">Completed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
