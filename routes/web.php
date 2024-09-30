<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function() {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('/project', ProjectController::class);
    Route::get('/task/my-tasks', [TaskController::class, 'myTasks'])->name('task.myTasks');
    Route::resource('/task', TaskController::class);
    Route::resource('/user', UserController::class);
    Route::post('/task/{task}/threads', [TaskController::class, 'storeThread'])->name('task.threads.store');
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Route to show the chat page
    Route::get('/chat', [MessageController::class, 'showChatPage'])->name('chat');

    // Route to fetch messages for a specific user
    Route::get('/messages/{receiverId}', [MessageController::class, 'fetchMessages']);

    // Route to send a new message
    Route::post('/messages', [MessageController::class, 'sendMessages']);
    Route::get('/users', [MessageController::class, 'getUsers']); // Fetch list of users
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
