import React, { useMemo, useEffect } from 'react';
import { Search, Download } from 'lucide-react';

export default function TaskFilters({ 
    tasks,
    searchTerm, 
    setSearchTerm, 
    filterProject, 
    setFilterProject,
    onExport,
    onFilteredDataChange
}) {
    const { projectsData, projects } = useMemo(() => {
        const projectMap = new Map();
        const projectNames = new Set();

        tasks.data.forEach(task => {
            const projectName = task.project?.name || 'No Project';
            projectNames.add(projectName);
            
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
            
            project.tasks.push(task);
        });

        // Calculate completion percentage for each project
        projectMap.forEach(project => {
            project.completionPercentage = 
                project.stats.total > 0 
                    ? Math.round((project.stats.completed / project.stats.total) * 100) 
                    : 0;
        });

        return {
            projectsData: Array.from(projectMap.values()),
            projects: Array.from(projectNames)
        };
    }, [tasks]);

    const filteredData = useMemo(() => {
        return projectsData
            .filter(project => !filterProject || project.name === filterProject)
            .map(project => ({
                ...project,
                tasks: project.tasks.filter(task => {
                    const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase());
                    return matchesSearch;
                })
            }))
            .filter(project => project.tasks.length > 0);
    }, [projectsData, searchTerm, filterProject]);

    // Update parent component when filtered data changes
    useEffect(() => {
        onFilteredDataChange(filteredData);
    }, [filteredData, onFilteredDataChange]);

    return (
        <div className="mb-4 space-y-4">
            <div className="flex gap-4 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            className="w-full bg-[#292f4c] text-white border-none rounded-lg pl-10 pr-4 py-2 placeholder-gray-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="w-48">
                    <select
                        className="w-full bg-[#292f4c] text-white border-none rounded-lg px-4 py-2"
                        value={filterProject}
                        onChange={(e) => setFilterProject(e.target.value)}
                    >
                        <option value="">All Projects</option>
                        {projects.map(project => (
                            <option key={project} value={project}>{project}</option>
                        ))}
                    </select>
                </div>
                <button
                    className="flex items-center gap-2 px-4 py-2 bg-[#292f4c] rounded-lg text-white hover:bg-[#353b5c]"
                    onClick={onExport}
                >
                    <Download size={16} />
                    Export
                </button>
            </div>
        </div>
    );
}