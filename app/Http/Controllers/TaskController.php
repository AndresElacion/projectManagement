<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use App\Models\Project;
use App\Models\TaskThread;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Resources\TaskResource;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\ThreadResource;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Resources\ProjectResource;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\UpdateTaskRequest;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Task::query();

        if (Auth::check()) {
            $query->where('company_id', Auth::user()->company_id);
        }

        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", "desc");

        if (request("name")) {
            $query->where("name", "like", "%". request("name") . "%");
        }

        if (request("status")) {
            $query->where("status", request("status"));
        }

        $tasks = $query->orderBy($sortField, $sortDirection)->paginate(10);

        return inertia("Task/Index", [
            'tasks' => TaskResource::collection($tasks),
            'queryParams' => request()->query() ?: null,
            'success' => session('success')
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $companyId = Auth::user()->company_id;

        $projects = Project::query()->orderBy('name')->get();
        $users = User::where('company_id', $companyId)->get();
        
        return inertia("Task/Create", [
            'projects' => ProjectResource::collection($projects),
            'users' => UserResource::collection($users)
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        $data = $request->validated();
        $data['company_id'] = Auth::user()->company_id;
        $image = $data['image_path'] ?? null;
        $data['created_by'] = Auth::id();
        $data['updated_by'] = Auth::id();
        if ($image) {
            $data['image_path'] = $image->store('task/' . Str::random(), 'public');
        }
        Task::create($data);

        return to_route('task.index')
            ->with('success', 'Task was created');
    }

    public function storeThread(Request $request, Task $task)
    {
        $request->validate([
            'description' => 'required|string|max:500',
            'image_path' => 'nullable|image',
            'attachment_file' => 'nullable|file|mimes:pdf,doc,docx|max:10240'
        ]);

        $request['company_id'] = Auth::user()->company_id;

        if ($request->hasFile('image_path')) {
            // Store the file and get the path
            $image = $request->file('image_path');
            $imagePath = $image->store('task/threads/' . Str::random(), 'public');
        } else {
            $imagePath = null;
        }

        if ($request->hasFile('attachment_file')) {
            $attachment = $request->file('attachment_file');
            $attachmentFile = $attachment->store('task/threads/' . Str::random(), 'public');
        } else {
            $attachmentFile = null;
        }

        // Save the thread with the uploaded image path
        TaskThread::create([
            'task_id' => $task->id,
            'user_id' => Auth::id(),
            'description' => $request->description,
            'image_path' => $imagePath,
            'attachment_file' => $attachmentFile,
            'company_id' =>$request->company_id
        ]);

        return redirect()->route('task.show', $task->id)
            ->with('success', 'Thread added successfully');
    }

    
    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        $threads = $task->taskThread()->with('user')->orderBy('created_at', 'desc')->get();

        return inertia('Task/Show', [
            'task' => new TaskResource($task),
            'threads' => ThreadResource::collection($threads),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {
        $projects = Project::query()->orderBy('name')->get();
        $users = User::query()->orderBy('name')->get();

        return inertia("Task/Edit", [
            'task' => new TaskResource($task),
            'projects' => ProjectResource::collection($projects),
            'users' => UserResource::collection($users)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        $data = $request->validated();
        $data['company_id'] = Auth::user()->company_id;
        $image = $data['image_path'] ?? null;
        $data['updated_by'] = Auth::id();

        if ($image) {
            if ($task->image_path) {
                Storage::disk('public')->deleteDirectory(dirname($task->image_path));
            }
            $data['image_path'] = $image->store('task/' . Str::random(), 'public');
        }

        $task->update($data);

        return back()->with('success', "Task \"$task->name\" was updated");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $name = $task->name;
        $task->delete();
        if ($task->image_path) {
                Storage::disk('public')->deleteDirectory(dirname($task->image_path));
            }

        return back()->with('success', "Task \"$name\" was deleted");
    }
    
    public function myTasks() 
    {
        $user = Auth::user();
        $query = Task::query()->where('assigned_user_id', $user->id);

        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", "desc");

        if (request("name")) {
            $query->where("name", "like", "%". request("name") . "%");
        }

        if (request("status")) {
            $query->where("status", request("status"));
        }

        $tasks = $query->orderBy($sortField, $sortDirection)->paginate(10);

        return inertia("Task/Index", [
            'tasks' => TaskResource::collection($tasks),
            'queryParams' => request()->query() ?: null,
            'success' => session('success')
        ]);
    }
}
