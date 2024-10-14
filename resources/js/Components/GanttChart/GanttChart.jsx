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
        <div className="container mx-auto mt-12 p-6 bg-gradient-to-b from-gray-50 to-white rounded-xl shadow-lg">
            <div className="mb-6">
                <TaskFilters 
                    tasks={tasks}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filterProject={filterProject}
                    setFilterProject={setFilterProject}
                    onExport={exportToCSV}
                    onFilteredDataChange={handleFilteredDataChange}
                />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Quarters Timeline */}
                <div className="flex border-b border-gray-200">
                    <div className="w-[300px] min-w-[300px] bg-gray-50 border-r border-gray-200 flex items-center justify-center py-4">
                        <h1 className="text-sm font-semibold text-gray-700 tracking-wider">PROJECTS</h1>
                    </div>
                    <div className="flex-1 relative h-16 bg-gray-50">
                        {quarters.map((quarter) => {
                            const totalDuration = dateRange.max.getTime() - dateRange.min.getTime();
                            const quarterDuration = quarter.end.getTime() - quarter.start.getTime();
                            const width = (quarterDuration / totalDuration) * 100;
                            const left = ((quarter.start.getTime() - dateRange.min.getTime()) / totalDuration) * 100;

                            return (
                                <div
                                    key={`${quarter.year}-Q${quarter.quarter}`}
                                    className="absolute flex flex-col items-center justify-center h-full"
                                    style={{
                                        left: `${left}%`,
                                        width: `${width}%`
                                    }}
                                >
                                    <div className="font-medium text-gray-700">{quarter.year}</div>
                                    <div className="text-sm text-gray-500">Q{quarter.quarter}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Project/Task Names Column */}
                <div className="flex">
                    <div className="w-[300px] min-w-[300px] border-r border-gray-200">
                        {filteredProjectsData.map((project) => (
                            <div key={project.name}>
                                <div 
                                    className="relative hover:bg-gray-50 transition-colors duration-150"
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
                                    <div className="h-12 flex items-center px-4 cursor-pointer group">
                                        <span className={`mr-2 transform transition-transform duration-200 text-gray-400 group-hover:text-gray-600 ${
                                            expandedProjects.has(project.name) ? 'rotate-90' : ''
                                        }`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                            </svg>
                                        </span>
                                        <div className="flex justify-between items-center w-full">
                                            <div className="mr-4">
                                                <span className="font-medium text-gray-800">{project.name}</span>
                                                <span className="ml-2 text-sm text-gray-500">
                                                    ({project.tasks.length})
                                                </span>
                                            </div>
                                            <div>
                                                <div className="mt-1 h-1.5 w-24 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full transition-all duration-300"
                                                        style={{ 
                                                            width: `${project.completionPercentage}%`,
                                                            backgroundColor: project.completionPercentage === 100 ? '#10B981' : '#3B82F6'
                                                        }}
                                                    />
                                                </div>
                                                <div className="text-xs text-gray-400 mt-1">
                                                    {project.completionPercentage}% Complete
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {expandedProjects.has(project.name) && (
                                    <div className="animate-in slide-in-from-top duration-200">
                                        {project.tasks.map((task) => (
                                            <div 
                                                key={task.id}
                                                className="h-10 flex items-center px-8 text-sm text-gray-600 hover:bg-gray-50 transition-colors duration-150"
                                            >
                                                <span className="truncate">{task.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Gantt Chart Area */}
                    <div className="flex-1 relative bg-gray-50">
                        {quarters.map((quarter) => {
                            const totalDuration = dateRange.max.getTime() - dateRange.min.getTime();
                            const left = ((quarter.start.getTime() - dateRange.min.getTime()) / totalDuration) * 100;
                            
                            return (
                                <div
                                    key={`${quarter.year}-Q${quarter.quarter}-grid`}
                                    className="absolute h-full border-l border-gray-200"
                                    style={{ left: `${left}%` }}
                                />
                            );
                        })}

                        {filteredProjectsData.map((project) => (
                            <div key={project.name}>
                                <div className="h-12" />
                                {expandedProjects.has(project.name) && project.tasks.map((task) => {
                                    const position = getTaskPosition(task);
                                    return (
                                        <div key={task.id} className="h-10 relative">
                                            <div 
                                                className="absolute h-6 rounded-full shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
                                                style={{
                                                    left: `${position.start}%`,
                                                    width: `${position.width}%`,
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    backgroundColor: task.status === 'completed' ? '#10B981' : 
                                                                   task.status === 'in_progress' ? '#3B82F6' :
                                                                   task.status === 'blocked' ? '#EF4444' : '#F59E0B'
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
                <div className="flex items-center justify-center gap-8 p-4 bg-gray-50 border-t border-gray-200">
                    {[
                        { status: 'pending', color: '#F59E0B', label: 'Pending' },
                        { status: 'in_progress', color: '#3B82F6', label: 'In Progress' },
                        { status: 'completed', color: '#10B981', label: 'Completed' },
                    ].map((item) => (
                        <div key={item.status} className="flex items-center gap-2">
                            <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm text-gray-600">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tooltip */}
            {tooltip && (
                <div
                    className="fixed z-50 transform-gpu animate-in fade-in-0 zoom-in-95 duration-200"
                    style={{
                        left: tooltip.x + 10,
                        top: tooltip.y + 10
                    }}
                >
                    <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden min-w-[300px]">
                        <div className="p-4 border-b border-gray-200 bg-gray-50">
                            <div className="flex items-center gap-2 mb-2">
                                <div 
                                    className="w-2.5 h-2.5 rounded-full animate-pulse"
                                    style={{
                                        backgroundColor: 
                                            tooltip.task.status === 'completed' ? '#10B981' : 
                                            tooltip.task.status === 'in_progress' ? '#3B82F6' :
                                            tooltip.task.status === 'blocked' ? '#EF4444' : '#F59E0B'
                                    }}
                                />
                                <span className="text-gray-600 capitalize text-sm">
                                    {tooltip.task.status.replace('_', ' ')}
                                </span>
                            </div>
                            <h3 className="text-lg font-medium text-gray-800 leading-tight">
                                {tooltip.task.name}
                            </h3>
                        </div>

                        <div className="p-4">
                            <div className="space-y-3">
                                <div className="flex items-center gap-4">
                                    <div className="text-xs font-medium uppercase text-gray-500">Start</div>
                                    <div className="text-sm text-gray-700">{tooltip.task.start}</div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-xs font-medium uppercase text-gray-500">End</div>
                                    <div className="text-sm text-gray-700">{tooltip.task.end}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}