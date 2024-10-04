import React, { useState, useRef, useMemo } from 'react';
import { Link, router } from '@inertiajs/react';
import { TASK_STATUS_CLASS_MAP, TASK_STATUS_TEXT_MAP } from "@/constants.js";

import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/Components/Alert';

export default function TaskTable({ tasks, tasks: initialTasks, success }) {
    const [draggingTask, setDraggingTask] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [updatingTaskId, setUpdatingTaskId] = useState(null);
    const [updateError, setUpdateError] = useState(null);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [filterProject, setFilterProject] = useState('');
    const draggedItem = useRef(null);

    // Get unique projects for filter dropdown
    const projects = useMemo(() => {
        const projectSet = new Set(initialTasks.data.map(task => task.project?.name).filter(Boolean));
        return Array.from(projectSet);
    }, [initialTasks]);

    // Filter and sort tasks
    const filteredTasks = useMemo(() => {
        return initialTasks.data.filter(task => {
            const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesProject = !filterProject || task.project?.name === filterProject;
            return matchesSearch && matchesProject;
        });
    }, [initialTasks.data, searchTerm, filterProject]);

    // Organize filtered tasks into columns
    const columns = useMemo(() => ({
        pending: {
            title: 'Pending',
            tasks: filteredTasks.filter(task => task.status === 'pending')
        },
        in_progress: {
            title: 'In Progress',
            tasks: filteredTasks.filter(task => task.status === 'in_progress')
        },
        completed: {
            title: 'Completed',
            tasks: filteredTasks.filter(task => task.status === 'completed')
        }
    }), [filteredTasks]);

    const handleDragStart = (task, e) => {
        setDraggingTask(task);
        setIsDragging(true);
        draggedItem.current = task;
        
        // Create a custom drag image
        const dragPreview = e.target.cloneNode(true);
        dragPreview.style.transform = 'rotate(3deg)';
        dragPreview.style.position = 'absolute';
        dragPreview.style.left = '-9999px';
        dragPreview.style.opacity = '0.8';
        document.body.appendChild(dragPreview);
        e.dataTransfer.setDragImage(dragPreview, 20, 20);
        
        // Clean up the preview element after drag starts
        setTimeout(() => {
            document.body.removeChild(dragPreview);
        }, 0);
        
        e.dataTransfer.effectAllowed = 'move';
        e.target.style.opacity = '0.5';
    };

    const handleDragEnd = (e) => {
        setDraggingTask(null);
        setIsDragging(false);
        e.target.style.opacity = '1';
        draggedItem.current = null;
    };

    const handleDragOver = (status, e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        // Add visual feedback for the column being dragged over
        const column = e.currentTarget;
        column.style.backgroundColor = '#f3f4f6';
    };

    const handleDragLeave = (e) => {
        // Remove visual feedback when leaving a column
        e.currentTarget.style.backgroundColor = '';
    };

    const updateTaskStatus = async (taskId, newStatus) => {
        setUpdatingTaskId(taskId);
        setUpdateError(null);
        
        try {
            const task = tasks.data.find(t => t.id === taskId);
            if (!task) {
                throw new Error('Task not found');
            }

            console.log('Attempting to update task:', {
                taskId,
                oldStatus: task.status,
                newStatus,
            });
            
            const updateData = {
                _method: 'PUT',
                status: newStatus,
                // Include all required fields from the existing task
                project_id: task.project_id,
                assigned_user_id: task.assigned_user_id,
                priority: task.priority,
                name: task.name,
                description: task.description,
                due_date: task.due_date,
                // Add any other fields that might be required by your backend
            };

            console.log('Sending update data:', updateData);

            router.put(route('task.update', taskId), updateData, {
                preserveScroll: true,
                onSuccess: (page) => {
                    console.log('Task update successful:', page);
                    setUpdatingTaskId(null);
                    setUpdateError(null);
                },
                onError: (errors) => {
                    console.error('Task update failed:', errors);
                    setUpdatingTaskId(null);
                    
                    // Format validation errors into a readable message
                    if (typeof errors === 'object') {
                        const errorMessages = Object.entries(errors)
                            .map(([field, message]) => `${message}`)
                            .join('. ');
                        setUpdateError(errorMessages);
                    } else {
                        setUpdateError('Failed to update task status. Please try again.');
                    }
                    
                    setTimeout(() => setUpdateError(null), 5000);
                }
            });
        } catch (error) {
            console.error('Error in updateTaskStatus:', error);
            setUpdatingTaskId(null);
            setUpdateError(error.message || 'An unexpected error occurred. Please try again.');
            setTimeout(() => setUpdateError(null), 5000);
        }
    };
    
    const handleDrop = (newStatus, e) => {
        e.preventDefault();
        e.currentTarget.style.backgroundColor = '';
        
        if (!draggingTask) {
            console.log('No dragging task found');
            return;
        }

        if (draggingTask.status === newStatus) {
            console.log('Task already in this status');
            return;
        }

        console.log('Dropping task:', {
            taskId: draggingTask.id,
            newStatus,
            currentStatus: draggingTask.status
        });

        // Update the task status
        updateTaskStatus(draggingTask.id, newStatus);
    };

    const deleteTask = (task) => {
        if (!window.confirm('Are you sure you want to delete the task?')) {
            return;
        }
        router.delete(route('task.destroy', task.id));
    };

    return (
        <div className="p-4">
            {success && (
                <div className="bg-emerald-500 py-2 px-4 text-right rounded mb-4 text-white">
                    {success}
                </div>
            )}

           {updateError && (
                <Alert variant="destructive">
                    <svg 
                        className="w-5 h-5 shrink-0" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <AlertDescription>{updateError}</AlertDescription>
                </Alert>
            )}

            {/* Search and Filter Controls */}
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
            
            <div className="flex gap-4 overflow-x-auto min-h-[calc(100vh-200px)]">
                {Object.entries(columns).map(([status, column]) => (
                    <div 
                        key={status}
                        className={`
                            flex-1 min-w-[300px] bg-gray-100 rounded-lg p-4
                            transition-colors duration-200
                            ${isDragging ? 'border-2 border-dashed border-gray-300' : ''}
                        `}
                        onDragOver={(e) => handleDragOver(status, e)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(status, e)}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-lg text-gray-700">
                                {column.title}
                            </h3>
                            <span className="bg-gray-200 px-2 py-1 rounded-full text-sm text-gray-600">
                                {column.tasks.length}
                            </span>
                        </div>
                        
                        <div className="space-y-3">
                            {column.tasks.map((task) => (
                                <div
                                    key={task.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(task, e)}
                                    onDragEnd={handleDragEnd}
                                    className={`
                                        relative bg-white rounded-lg shadow p-3 cursor-move
                                        border-l-4 ${TASK_STATUS_CLASS_MAP[task.status].replace('rounded', 'border')}
                                        transition-transform duration-200
                                        hover:transform hover:scale-[1.02]
                                        ${updatingTaskId === task.id ? 'opacity-50' : ''}
                                        ${updateError?.taskId === task.id ? 'border-red-500' : ''}
                                    `}
                                >
                                    {updatingTaskId === task.id && (
                                        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center rounded-lg">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                                        </div>
                                    )}
                                    
                                    <div className="flex items-center gap-3 mb-2">
                                        {task.image_path && (
                                            <img 
                                                src={task.image_path} 
                                                alt="" 
                                                className="w-10 h-10 rounded object-cover"
                                            />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <Link 
                                                href={route("task.show", task.id)}
                                                className="font-medium text-gray-900 hover:text-blue-600 block truncate"
                                            >
                                                {task.name}
                                            </Link>
                                        </div>
                                    </div>
                                    
                                    <div className="text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>Due: {task.due_date}</span>
                                        </div>
                                        <div className="flex items-center gap-1 mt-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span>{task.createdBy.name}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-2 flex gap-2 justify-end">
                                        <Link 
                                            href={route('task.edit', task.id)} 
                                            className="text-sm text-blue-600 hover:underline"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => deleteTask(task)}
                                            className="text-sm text-red-600 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}