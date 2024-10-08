import React, { useState, useMemo, useCallback } from 'react';
import { parseDate } from './Utils';
import TaskFilters from '../TaskFilters';

export default function GanttChart({ tasks }) {
    const [expandedProjects, setExpandedProjects] = useState(new Set());
    const [tooltip, setTooltip] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterProject, setFilterProject] = useState('');
    const [filteredProjectsData, setFilteredProjectsData] = useState([]);

    const { dateRange } = useMemo(() => {
        let minDate = null;
        let maxDate = null;

        tasks.data.forEach(task => {
            const startDate = parseDate(task.created_at);
            const endDate = parseDate(task.due_date);
            
            if (!minDate || startDate < minDate) minDate = startDate;
            if (!maxDate || endDate > maxDate) maxDate = endDate;
        });

        const startQuarter = Math.floor(minDate.getMonth() / 3);
        const startYear = minDate.getFullYear();
        const bufferedMinDate = new Date(startYear, startQuarter * 3, 1);

        const endQuarter = Math.ceil((maxDate.getMonth() + 1) / 3);
        const endYear = maxDate.getFullYear();
        const bufferedMaxDate = new Date(endYear, endQuarter * 3, 0);

        return {
            dateRange: { 
                min: bufferedMinDate, 
                max: bufferedMaxDate
            }
        };
    }, [tasks]);

    const quarters = useMemo(() => {
        if (!dateRange.min || !dateRange.max) return [];
        
        const quarters = [];
        const startYear = dateRange.min.getFullYear();
        const endYear = dateRange.max.getFullYear();
        
        for (let year = startYear; year <= endYear; year++) {
            for (let quarter = 1; quarter <= 4; quarter++) {
                const quarterStart = new Date(year, (quarter - 1) * 3, 1);
                const quarterEnd = new Date(year, quarter * 3, 0);
                
                if (quarterEnd >= dateRange.min && quarterStart <= dateRange.max) {
                    quarters.push({
                        year,
                        quarter,
                        start: quarterStart,
                        end: quarterEnd
                    });
                }
            }
        }
        
        return quarters;
    }, [dateRange]);

    const getTaskPosition = (task) => {
        const totalDuration = dateRange.max.getTime() - dateRange.min.getTime();
        const taskStart = Math.max(parseDate(task.created_at).getTime(), dateRange.min.getTime());
        const taskEnd = Math.min(parseDate(task.due_date).getTime(), dateRange.max.getTime());
        
        const start = ((taskStart - dateRange.min.getTime()) / totalDuration) * 100;
        const width = ((taskEnd - taskStart) / totalDuration) * 100;
        
        return { start, width };
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handleTaskHover = (event, task) => {
        if (event.type === 'mouseenter') {
            setTooltip({
                x: event.clientX,
                y: event.clientY,
                task: {
                    name: task.name,
                    start: formatDate(task.created_at),
                    end: formatDate(task.due_date),
                    status: task.status
                }
            });
        } else if (event.type === 'mouseleave') {
            setTooltip(null);
        }
    };

    const exportToCSV = useCallback(() => {
        const csvContent = filteredProjectsData
            .flatMap(project => project.tasks.map(task => ({
                project: project.name,
                task: task.name,
                start: formatDate(task.created_at),
                end: formatDate(task.due_date),
                status: task.status
            })))
            .map(row => Object.values(row).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'gantt-export.csv';
        a.click();
    }, [filteredProjectsData]);

    const handleFilteredDataChange = useCallback((data) => {
        setFilteredProjectsData(data);
    }, []);

    return (
        <div className="p-5 m-5 bg-white border overflow-hidden shadow-lg sm:rounded-lg">
            <TaskFilters 
                tasks={tasks}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterProject={filterProject}
                setFilterProject={setFilterProject}
                onExport={exportToCSV}
                onFilteredDataChange={handleFilteredDataChange}
            />

            <div className="bg-white rounded-lg shadow">
                {/* Quarters Timeline at the top */}
                <div className="flex border rounded-lg border-gray-300">
                    <div className="w-[300px] min-w-[300px] border" />
                    <div className="flex-1 relative h-16 ml-1">
                        {quarters.map((quarter) => {
                            const totalDuration = dateRange.max.getTime() - dateRange.min.getTime();
                            const quarterDuration = quarter.end.getTime() - quarter.start.getTime();
                            const width = (quarterDuration / totalDuration) * 100;
                            const left = ((quarter.start.getTime() - dateRange.min.getTime()) / totalDuration) * 100;

                            return (
                                <div
                                    key={`${quarter.year}-Q${quarter.quarter}`}
                                    className="absolute flex flex-col items-center justify-center h-full border-r border-gray-300"
                                    style={{
                                        left: `${left}%`,
                                        width: `${width}%`
                                    }}
                                >
                                    <div className="text-sm text-gray-800">{quarter.year}</div>
                                    <div className="text-sm text-gray-800">Q{quarter.quarter}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Project/Task Names Column */}
                <div className="flex">
                    <div className="w-[300px] min-w-[300px] border-r border-gray-300">
                        {filteredProjectsData.map((project) => (
                            <div key={project.name}>
                                <div className="relative">
                                    <div 
                                        className="h-10 flex items-center px-4 bg-white border-b border-gray-300 cursor-pointer"
                                        onClick={() => {
                                            setExpandedProjects(prev => {
                                                const next = new Set(prev);
                                                if (next.has(project.name)) {
                                                    next.delete(project.name);
                                                } else {
                                                    next.add(project.name);
                                                }
                                                return next;
                                            });
                                        }}
                                    >
                                        <span className={`mr-2 transform transition-transform ${
                                            expandedProjects.has(project.name) ? 'rotate-90' : ''
                                        }`}>▶</span>
                                        <div className="flex justify-between items-center w-full">
                                            <div className="mr-4">
                                                <span className="font-medium text-gray-800">{project.name}</span>
                                                <span className="ml-2 text-sm text-gray-800">
                                                    ({project.tasks.length})
                                                </span>
                                            </div>
                                            <div>
                                                <div className="mt-1 h-1 w-20 bg-gray-700 rounded-full">
                                                    <div
                                                        className="h-full bg-green-500 rounded-full"
                                                        style={{ width: `${project.completionPercentage}%` }}
                                                    />
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    {project.completionPercentage}% Complete
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {expandedProjects.has(project.name) && project.tasks.map((task) => (
                                    <div 
                                        key={task.id}
                                        className="h-10 flex items-center px-8 text-sm text-gray-800 border-b border-gray-300"
                                    >
                                        <span className="truncate">{task.name}</span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Gantt Chart Area */}
                    <div className="flex-1 relative">
                        {quarters.map((quarter) => {
                            const totalDuration = dateRange.max.getTime() - dateRange.min.getTime();
                            const left = ((quarter.start.getTime() - dateRange.min.getTime()) / totalDuration) * 100;
                            
                            return (
                                <div
                                    key={`${quarter.year}-Q${quarter.quarter}-grid`}
                                    className="absolute h-full border-r border-gray-300"
                                    style={{ left: `${left}%` }}
                                />
                            );
                        })}

                        {filteredProjectsData.map((project) => (
                            <div key={project.name}>
                                <div className="h-10 border-b" />
                                {expandedProjects.has(project.name) && project.tasks.map((task) => {
                                    const position = getTaskPosition(task);
                                    return (
                                        <div key={task.id} className="h-10 relative border-b border-gray-300">
                                            <div 
                                                className="absolute h-6 rounded cursor-pointer transition-opacity hover:opacity-80"
                                                style={{
                                                    left: `${position.start}%`,
                                                    width: `${position.width}%`,
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    backgroundColor: task.status === 'completed' ? '#00C875' : 
                                                                   task.status === 'in_progress' ? '#0073EA' :
                                                                   task.status === 'blocked' ? '#E44258' : '#fdab3d'
                                                }}
                                                onMouseEnter={(e) => handleTaskHover(e, task)}
                                                onMouseLeave={(e) => handleTaskHover(e, task)}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-6 p-4 border-t border-gray-300">
                    {[
                        { status: 'completed', color: '#00C875', label: 'Completed' },
                        { status: 'in_progress', color: '#0073EA', label: 'In Progress' },
                        { status: 'pending', color: '#fdab3d', label: 'Pending' },
                    ].map((item) => (
                        <div key={item.status} className="flex items-center gap-2">
                            <div 
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm text-gray-800">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tooltip */}
            {tooltip && (
                <div
                    className="fixed z-50 min-w-[280px] transform-gpu animate-in fade-in-0 zoom-in-95"
                    style={{
                        left: tooltip.x + 10,
                        top: tooltip.y + 10
                    }}
                >
                    <div className="bg-white rounded-lg shadow-xl border border-gray-300 overflow-hidden">
                        {/* Header with status indicator */}
                        <div className="p-4 border-b border-gray-300">
                            <div className="flex items-center gap-2 mb-1">
                                <div 
                                    className="w-2 h-2 rounded-full animate-pulse"
                                    style={{
                                        backgroundColor: 
                                            tooltip.task.status === 'completed' ? '#00C875' : 
                                            tooltip.task.status === 'in_progress' ? '#0073EA' :
                                            tooltip.task.status === 'blocked' ? '#E44258' : '#fdab3d'
                                    }}
                                />
                                <span className="text-gray-800 capitalize text-sm">
                                    {tooltip.task.status}
                                </span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 leading-tight">
                                {tooltip.task.name}
                            </h3>
                        </div>

                        {/* Timeline info */}
                        <div className="p-4 bg-white">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <div className="text-xs font-medium uppercase text-gray-800">Start</div>
                                    <div className="text-sm text-gray-800">{tooltip.task.start}</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-xs font-medium uppercase text-gray-800">End</div>
                                    <div className="text-sm text-gray-800">{tooltip.task.end}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}