<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Resources\Json\JsonResource;

class ThreadResource extends JsonResource
{
    /** This is to populate the data to frontend */
    public static $wrap = false;
    
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'task_id' => $this->task_id,
            'description' => $this->description,
            'image_path' => $this->image_path ? Storage::url($this->image_path) : '',
            'attachment_file' => $this->attachment_file ? Storage::url($this->attachment_file) : '',
            'user' => new UserResource($this->user),
            'created_at' => Carbon::parse($this->created_at)
            ->timezone('Asia/Manila')
            ->format('M d, Y g:i A'), // Format with date and AM/PM
        ];
    }
}
