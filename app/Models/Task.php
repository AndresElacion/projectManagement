<?php

namespace App\Models;

use App\Models\User;
use App\Models\Company;
use App\Models\Project;
use App\Models\TaskThread;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Task extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function project() {
        return $this->belongsTo(Project::class);
    }

    public function assigneduser() {
        return $this->belongsTo(User::class, 'assigned_user_id');
    }

    public function createdBy() {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy() {
        return $this->belongsTo(Project::class, 'updated_by');
    }

    public function taskThread() {
        return $this->hasMany(TaskThread::class);
    }

    public function companies() {
        return $this->belongsTo(Company::class);
    }
}
