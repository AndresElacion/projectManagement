import { useEffect, useState, useRef } from 'react';

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Inertia } from '@inertiajs/inertia';
import InputError from '@/Components/InputError';
import { Head, router } from '@inertiajs/react';

export default function Chat({ user, auth, users }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const messagesEndRef = useRef(null); // Create a ref for the messages container

    const fetchMessages = async (userId) => {
        try {
            const response = await fetch(`/messages/${userId}`);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setMessages(data.fetchMessages);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
            alert('An error occurred while fetching messages. Please try again later.');
        }
    };

    // Fetch messages when the selected user changes
    useEffect(() => {
        if (selectedUser) {
            fetchMessages(selectedUser.id);
        }
    }, [selectedUser]);

    // Scroll to the latest message when messages state updates
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!newMessage.trim() || !selectedUser) return;

        try {
            await router.post('/messages', {
                message: newMessage,
                receiver_id: selectedUser.id,
            });

            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    id: Date.now(), // Use a temporary ID for the new message
                    sender: { name: user.name },
                    message: newMessage,
                },
            ]);

            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
                <AuthenticatedLayout user={auth.user} header={
            <div className="flex justify-between items-center">
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Create New Project
                </h2>
            </div>
        }>
        
            <Head title="Create Project" />

        <div className="flex">
            <div className="user-list w-1/4 border-r p-4">
                <h2 className="text-lg font-bold mb-4">Users</h2>
                <ul>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <li
                                key={user.id}
                                className="cursor-pointer mb-2"
                                onClick={() => {
                                    setSelectedUser(user);
                                    fetchMessages(user.id);
                                }}
                            >
                                {user.name}
                            </li>
                        ))
                    ) : (
                        <li>No users found</li>
                    )}
                </ul>
            </div>

            <div className="chat-window w-3/4 p-4">
                <h2 className="text-lg font-bold mb-4">Chat with {selectedUser ? selectedUser.name : '...'}</h2>
                <div className="messages border rounded p-4 mb-4 h-60 overflow-auto">
                    {messages.length > 0 ? (
                        messages.map((msg) => (
                            <div key={msg.id} className="my-2">
                                <strong>{msg.sender.name}:</strong> {msg.message}
                            </div>
                        ))
                    ) : (
                        <p>No messages found</p>
                    )}
                    {/* Add the ref here for scrolling */}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="chat-input flex">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="border rounded p-2 flex-grow"
                    />
                    <button className="ml-2 bg-blue-500 text-white rounded p-2">Send</button>
                </form>
            </div>
            </div>
            </AuthenticatedLayout>
    );
}
