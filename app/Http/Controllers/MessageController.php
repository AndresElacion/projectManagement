<?php

// Update your MessageController
namespace App\Http\Controllers;

use Log;
use Inertia\Inertia;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User; // Import User model

class MessageController extends Controller
{
    public function showChatPage() {
        // Fetch all users except the authenticated one
        $users = User::where('id', '!=', Auth::id())->where('company_id', Auth::user()->company_id)->get();

        return inertia('Chat/Chat', [
            'user' => Auth::user(),
            'users' => $users,
        ]);
    }

    // Fetch messages between the authenticated user and a specified receiver
    public function fetchMessages($receiverId) {
        $receiver = User::findOrFail($receiverId);

        // Check if the receiver is in the same company
        if ($receiver->company_id !== Auth::user()->company_id) {
            return response()->json(['error' => 'Unauthorized action'], 403);
        }

        $fetchMessages = Message::where(function ($query) use ($receiverId) {
            $query->where('sender_id', Auth::id())
                  ->where('receiver_id', $receiverId)
                  ->orWhere(function ($q) use ($receiverId) {
                      $q->where('sender_id', $receiverId)
                        ->where('receiver_id', Auth::id());
                  });
        })->with(['sender', 'receiver'])->get();

        return response()->json([
        'fetchMessages' => $fetchMessages,
    ]);
    }

    public function sendMessages(Request $request) {
        $request->validate([
            'message' => 'required|string|max:255',
            'receiver_id' => 'required|exists:users,id',
        ]);

        $receiver = User::findOrFail($request->receiver_id);

        // Ensure the receiver is in the same company
        if ($receiver->company_id !== Auth::user()->company_id) {
            return response()->json(['error' => 'Unauthorized action'], 403);
        }

        Message::create([
            'sender_id' => Auth::id(),
            'receiver_id' => $request->receiver_id,
            'message' => $request->message
        ]);

        // Fetch the updated messages for the current user
        $messages = Message::where(function ($query) use ($request) {
            $query->where('sender_id', Auth::id())
                ->where('receiver_id', $request->receiver_id)
                ->orWhere(function ($q) use ($request) {
                    $q->where('sender_id', $request->receiver_id)
                        ->where('receiver_id', Auth::id());
                });
        })->with(['sender', 'receiver'])->get();

        return Inertia::render('Chat/Chat', [
            'user' => Auth::user(),
            'users' => User::where('id', '!=', Auth::id())->where('company_id', Auth::user()->company_id)->get(),
            'fetchMessages' => $messages,
            'receiverId' => $request->receiver_id
        ]);
    }




    // Fetch a list of users to chat with
    public function getUsers() {
        $users = User::where('id', '!=', Auth::id())->where('company_id', Auth::user()->company_id)->get();

        return response()->json($users);
    }
}
