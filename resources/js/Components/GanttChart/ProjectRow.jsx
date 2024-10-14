import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const ProjectRow = ({ project, isExpanded, onToggle, level = 0, index }) => (
    <div 
        className="h-[40px] px-4 flex items-center text-sm text-white border-b border-gray-700/30 cursor-pointer hover:bg-gray-700/20"
        style={{ paddingLeft: `${level * 16 + 16}px` }}
        onClick={onToggle}
    >
        {isExpanded ? 
        <ChevronDown className="w-4 h-4 mr-2" /> : 
        <ChevronRight className="w-4 h-4 mr-2" />
        }
        <span className="font-medium">{project.name}</span>
        <span className="ml-2 text-xs text-gray-400">({project.tasks.length} tasks)</span>
    </div>
);

export default ProjectRow;
