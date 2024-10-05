import React from 'react';

export default function TaskFilters({ 
    searchTerm, 
    setSearchTerm, 
    filterProject, 
    setFilterProject, 
    projects 
}) {
    return (
        <div className="mb-6 flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
                <input
                    type="text"
                    placeholder="Search tasks..."
                    className="w-full border rounded-lg px-4 py-2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="w-48">
                <select
                    className="w-full border rounded-lg px-4 py-2"
                    value={filterProject}
                    onChange={(e) => setFilterProject(e.target.value)}
                >
                    <option value="">All Projects</option>
                    {projects.map(project => (
                        <option key={project} value={project}>{project}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}