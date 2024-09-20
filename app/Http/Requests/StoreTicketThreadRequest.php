<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class StoreTicketThreadRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "name" => ['nullable', 'max:255'],
            'image_path' => ['nullable', 'image'],
            "description" => ['nullable', 'string'],
            'project_id' => ['required', 'exists:projects,id'],
            'status' => ['nullable', Rule::in(['pending', 'in_progress', 'completed'])],
        ];
    }
}
