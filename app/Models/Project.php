<?php

namespace App\Models;

use App\Models\Task;
use App\Models\User;
use App\Models\Company;
use App\Models\Scopes\CompanyScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Project extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected static function booted()
    {
        static::addGlobalScope(new CompanyScope);
    }

    public function tasks() {
        return $this->hasMany(Task::class);
    }
    
    public function createdBy() {
        return $this->belongsTo(User::class, 'created_by');
    }
    
    public function updatedBy() {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function companies() {
        return $this->belongsTo(Company::class);
    }
}
