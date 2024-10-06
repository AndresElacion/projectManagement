import React, { useState, useMemo } from 'react';
import { parseDate } from './Utils';

export default function GanttChart({ tasks }) {
    const [expandedProjects, setExpandedProjects] = useState(new Set());
    const [tooltip, setTooltip] = useState(null);

    const { projectsData, dateRange } = useMemo(() => {
        const projectMap = new Map();
        let minDate = new Date();
        let maxDate = new Date();

        tasks.data.forEach(task => {
            const projectName = task.project?.name || 'No Project';
            if (!projectMap.has(projectName)) {
                projectMap.set(projectName, { name: projectName, tasks: [] });
            }
            
            const startDate = parseDate(task.created_at);
            const endDate = parseDate(task.due_date);
            
            minDate = new Date(Math.min(minDate, startDate));
            maxDate = new Date(Math.max(maxDate, endDate));
            
            projectMap.get(projectName).tasks.push({
                ...task,
                start: startDate.getTime(),
                end: endDate.getTime()
            });
        });

        return {
            projectsData: Array.from(projectMap.values()),
            dateRange: { min: minDate, max: maxDate }
        };
    }, [tasks]);

    const generateQuarters = useMemo(() => {
        const quarters = [];
        const startYear = dateRange.min.getFullYear();
        const endYear = dateRange.max.getFullYear();
        
        for (let year = startYear; year <= endYear; year++) {
            for (let quarter = 1; quarter <= 4; quarter++) {
                quarters.push({
                    year,
                    quarter,
                    label: `Q${quarter}`,
                    start: new Date(year, (quarter - 1) * 3, 1),
                    end: new Date(year, quarter * 3, 0)
                });
            }
        }
        
        return quarters.filter(q => 
            q.start >= dateRange.min && q.start <= dateRange.max ||
            q.end >= dateRange.min && q.end <= dateRange.max
        );
    }, [dateRange]);

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
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
                    start: formatDate(new Date(task.start)),
                    end: formatDate(new Date(task.end)),
                    status: task.status
                }
            });
        } else {
            setTooltip(null);
        }
    };

    return (
        <div className="p-4 bg-[#1B1F3B]">
            <div className="bg-[#292f4c] rounded-lg shadow">
                <div className="flex">
                    {/* Project/Task Names Column */}
                    <div className="w-[300px] min-w-[300px] pt-16 border-r border-gray-700 bg-[#292f4c] z-10">
                        <div className="task-names">
                            {projectsData.map((project) => (
                                <div key={project.name} className="project-group">
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
                                        <span className="font-medium text-white">{project.name}</span>
                                        <span className="ml-2 text-sm text-gray-400">
                                            ({project.tasks.length})
                                        </span>
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
                    </div>

                    {/* Gantt Chart Column */}
                    <div className="flex-1 overflow-x-auto">
                        {/* Timeline Header */}
                        <div className="h-16 border-b border-gray-700/30">
                            <div className="flex h-full">
                                {generateQuarters.map((quarter, index) => {
                                    const startOffset = Math.max(0, (quarter.start - dateRange.min) / (dateRange.max - dateRange.min));
                                    const width = (quarter.end - quarter.start) / (dateRange.max - dateRange.min);
                                    
                                    return (
                                        <div
                                            key={`${quarter.year}-${quarter.quarter}`}
                                            className="flex flex-col items-center justify-center border-r border-gray-700/30 text-white/80"
                                            style={{
                                                width: `${width * 100}%`,
                                                marginLeft: index === 0 ? `${startOffset * 100}%` : 0
                                            }}
                                        >
                                            <div className="text-sm">{quarter.year}</div>
                                            <div className="text-sm">{quarter.label}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Tasks Timeline */}
                        <div className="relative">
                            {projectsData.map((project) => (
                                <div key={project.name}>
                                    <div className="h-10" />
                                    {expandedProjects.has(project.name) && (
                                        project.tasks.map((task) => (
                                            <div key={task.id} className="h-10 relative border-b border-gray-700/30">
                                                <div 
                                                    className="absolute h-6 rounded cursor-pointer transition-opacity hover:opacity-80"
                                                    style={{
                                                        left: `${((task.start - dateRange.min.getTime()) / (dateRange.max.getTime() - dateRange.min.getTime())) * 100}%`,
                                                        width: `${((task.end - task.start) / (dateRange.max.getTime() - dateRange.min.getTime())) * 100}%`,
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
                                        ))
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
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
                    <p className="text-sm text-gray-600">Start: {tooltip.task.start}</p>
                    <p className="text-sm text-gray-600">End: {tooltip.task.end}</p>
                    <p className="text-sm text-gray-600">Status: {tooltip.task.status}</p>
                </div>
            )}
        </div>
    );
}