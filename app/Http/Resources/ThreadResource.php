<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
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
            'description' => $this->description,
            'user' => new UserResource($this->user),
            'created_at' => Carbon::parse($this->created_at)
            ->timezone('Asia/Manila')
            ->format('M d, Y g:i A'), // Format with date and AM/PM
        ];
    }
}
