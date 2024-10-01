import { useEffect, useState, useRef } from 'react';

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
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
            router.post('/messages', {
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
            <div className="flex items-center justify-between">
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Chat
                </h2>
            </div>  
        }>
        
            <Head title="Chat" />

            <div className='mt-12'>
                <div className="flex max-w-7xl mx-auto sm:px-6 lg:px-8 bg-white overflow-hidden shadow-sm sm:rounded-lg h-[80vh]">
                    <div className="w-1/4 border-r p-4">
                        <h2 className="text-lg font-bold mb-4">Users</h2>
                        <ul>
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <li
                                        key={user.id}
                                        className="cursor-pointer mb-2 hover:bg-blue-500 hover:text-white hover:rounded-lg hover:shadow-lg p-2"
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

                    <div className="w-3/4 p-4 flex flex-col h-full">
                        <h2 className="text-lg font-bold mb-4 text-center border-b pb-2">
                            Chat with {selectedUser ? selectedUser.name : '...'}
                        </h2>

                        {/* Chat container */}
                        <div className="flex-1 overflow-y-auto bg-gray-100 p-6 rounded-lg shadow-inner h-0 grow">
                            {messages.length > 0 ? (
                                messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${
                                            msg.sender.name === user.name
                                                ? 'justify-end'  // Sender's message on the right
                                                : 'justify-start' // Receiver's message on the left
                                        } my-2`}
                                    >
                                        <div
                                            className={`max-w-xs px-4 py-2 rounded-xl shadow-lg ${
                                                msg.sender.name === user.name
                                                    ? 'bg-blue-500 text-white' // Style for sender
                                                    : 'bg-gray-200 text-gray-800' // Style for receiver
                                            }`}
                                        >
                                            <span className="block text-sm font-semibold">{msg.sender.name}</span>
                                            <p className="text-sm">{msg.message}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center">No messages found</p>
                            )}

                            {/* Ref for scrolling */}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input and send button */}
                        <form onSubmit={handleSendMessage} className="mt-4 flex items-center gap-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="border rounded-full p-2 flex-grow shadow focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-full shadow hover:bg-blue-600 transition">
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    );
}
