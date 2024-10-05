<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use App\Http\Resources\TaskResource;
use Illuminate\Support\Facades\Auth;

class GanttController extends Controller
{
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

        return inertia("Task/Gantt", [
            'tasks' => TaskResource::collection($tasks),
            'queryParams' => request()->query() ?: null,
            'success' => session('success')
        ]);
    }
}
