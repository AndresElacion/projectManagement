import React, { useState, useMemo, useCallback } from 'react';
import { Search, Filter, Calendar, Download } from 'lucide-react';
import { parseDate } from './Utils';

export default function GanttChart({ tasks }) {
    const [expandedProjects, setExpandedProjects] = useState(new Set());
    const [tooltip, setTooltip] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilters, setSelectedFilters] = useState({
        status: new Set(['completed', 'in_progress', 'pending', 'blocked']),
        dateRange: 'all'
    });

    const { projectsData, dateRange } = useMemo(() => {
        const projectMap = new Map();
        let minDate = null;
        let maxDate = null;

        tasks.data.forEach(task => {
            const projectName = task.project?.name || 'No Project';
            if (!projectMap.has(projectName)) {
                projectMap.set(projectName, {
                    name: projectName,
                    tasks: [],
                    stats: { total: 0, completed: 0 }
                });
            }
            
            const project = projectMap.get(projectName);
            project.stats.total++;
            if (task.status === 'completed') {
                project.stats.completed++;
            }
            
            const startDate = parseDate(task.created_at);
            const endDate = parseDate(task.due_date);
            
            if (!minDate || startDate < minDate) minDate = startDate;
            if (!maxDate || endDate > maxDate) maxDate = endDate;
            
            project.tasks.push({
                ...task,
                start: startDate.getTime(),
                end: endDate.getTime()
            });
        });

        // Calculate completion percentage for each project
        projectMap.forEach(project => {
            project.completionPercentage = 
                project.stats.total > 0 
                    ? Math.round((project.stats.completed / project.stats.total) * 100) 
                    : 0;
        });

        const startQuarter = Math.floor(minDate.getMonth() / 3);
        const startYear = minDate.getFullYear();
        const bufferedMinDate = new Date(startYear, startQuarter * 3, 1);

        const endQuarter = Math.ceil((maxDate.getMonth() + 1) / 3);
        const endYear = maxDate.getFullYear();
        const bufferedMaxDate = new Date(endYear, endQuarter * 3, 0);

        return {
            projectsData: Array.from(projectMap.values()),
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
        const taskStart = Math.max(task.start, dateRange.min.getTime());
        const taskEnd = Math.min(task.end, dateRange.max.getTime());
        
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
                    start: formatDate(task.start),
                    end: formatDate(task.end),
                    status: task.status
                }
            });
        } else {
            setTooltip(null);
        }
    };

    const filteredProjectsData = useMemo(() => {
        return projectsData.map(project => ({
            ...project,
            tasks: project.tasks.filter(task => {
                const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesStatus = selectedFilters.status.has(task.status);
                return matchesSearch && matchesStatus;
            })
        })).filter(project => project.tasks.length > 0);
    }, [projectsData, searchTerm, selectedFilters]);

    // Export functionality
    const exportToCSV = useCallback(() => {
        const csvContent = filteredProjectsData
            .flatMap(project => project.tasks.map(task => ({
                project: project.name,
                task: task.name,
                start: formatDate(task.start),
                end: formatDate(task.end),
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

    return (
        <div className="p-4 bg-[#1B1F3B]">

            <div className="mb-4 flex items-center gap-4">

                <button
                    className="flex items-center gap-2 px-4 py-2 bg-[#292f4c] rounded-lg text-white hover:bg-[#353b5c]"
                    onClick={exportToCSV}
                >
                    <Download size={16} />
                    Export
                </button>
            </div>


            <div className="bg-[#292f4c] rounded-lg shadow">
                {/* Quarters Timeline at the top */}
                <div className="flex border-b border-gray-700">
                    <div className="w-[300px] min-w-[300px] border-r border-gray-700" />
                    <div className="flex-1 relative h-16">
                        {quarters.map((quarter) => {
                            const totalDuration = dateRange.max.getTime() - dateRange.min.getTime();
                            const quarterDuration = quarter.end.getTime() - quarter.start.getTime();
                            const width = (quarterDuration / totalDuration) * 100;
                            const left = ((quarter.start.getTime() - dateRange.min.getTime()) / totalDuration) * 100;

                            return (
                                <div
                                    key={`${quarter.year}-Q${quarter.quarter}`}
                                    className="absolute flex flex-col items-center justify-center h-full border-r border-gray-700/30"
                                    style={{
                                        left: `${left}%`,
                                        width: `${width}%`
                                    }}
                                >
                                    <div className="text-sm text-white/80">{quarter.year}</div>
                                    <div className="text-sm text-white/80">Q{quarter.quarter}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Main content area */}
                <div className="flex">
                    {/* Project/Task Names Column */}
                    <div className="w-[300px] min-w-[300px] border-r border-gray-700">
                        {projectsData.map((project) => (
                            <div key={project.name}>
                                <div className="relative">
                                    <div 
                                        className="h-10 flex items-center px-4 bg-[#292f4c] border-b border-gray-700/30 cursor-pointer"
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
                                        <div className="flex justify-between items-center">
                                            <div className="mr-4">
                                                <span className="font-medium text-white">{project.name}</span>
                                                <span className="ml-2 text-sm text-gray-400">
                                                    ({project.tasks.length})
                                                </span>
                                            </div>
                                            <div>
                                                {/* Progress bar */}
                                                <div className="mt-1 h-1 bg-gray-700 rounded-full">
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
                                        className="h-10 flex items-center px-8 text-sm text-white/80 border-b border-gray-700/30"
                                    >
                                        <span className="truncate">{task.name}</span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Gantt Chart Area */}
                    <div className="flex-1 relative">
                        {/* Background grid lines */}
                        {quarters.map((quarter) => {
                            const totalDuration = dateRange.max.getTime() - dateRange.min.getTime();
                            const left = ((quarter.start.getTime() - dateRange.min.getTime()) / totalDuration) * 100;
                            
                            return (
                                <div
                                    key={`${quarter.year}-Q${quarter.quarter}-grid`}
                                    className="absolute h-full border-r border-gray-700/30"
                                    style={{ left: `${left}%` }}
                                />
                            );
                        })}

                        {/* Tasks */}
                        {projectsData.map((project) => (
                            <div key={project.name}>
                                <div className="h-10" /> {/* Space for project header */}
                                {expandedProjects.has(project.name) && project.tasks.map((task) => {
                                    const position = getTaskPosition(task);
                                    return (
                                        <div key={task.id} className="h-10 relative border-b border-gray-700/30">
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
                <div className="flex items-center justify-center gap-6 p-4 border-t border-gray-700/30">
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
                            <span className="text-sm text-white/80">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tooltip */}
            {tooltip && (
                <div
                    className="fixed bg-white p-3 rounded-lg shadow-lg border z-50"
                    style={{
                        left: tooltip.x + 10,
                        top: tooltip.y + 10
                    }}
                >
                    <p className="font-medium">{tooltip.task.name}</p>
                    <p className="text-sm text-gray-600">
                        {tooltip.task.start} - {tooltip.task.end}
                    </p>
                    <p className="text-sm text-gray-600 capitalize">Status: {tooltip.task.status}</p>
                </div>
            )}
        </div>
    );
}