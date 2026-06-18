import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const Chat = () => {
    const { exchangeId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);
    // const [exchange, setExchange] = useState(null);
    const [receiverId, setReceiverId] = useState('');

    const queryParams = new URLSearchParams(location.search);
    const userIdFromQuery = queryParams.get('userId');

    useEffect(() => {
        if (userIdFromQuery && !exchangeId) {
            navigate(`/chat?userId=${userIdFromQuery}`);
        }
    }, [userIdFromQuery, exchangeId, navigate]);

    useEffect(() => {
        if (!token) return;

        const newSocket = io('http://localhost:5001', {
            auth: { token }
        });

        setSocket(newSocket);

        newSocket.on('receive-message', (message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            newSocket.close();
        };
    }, [token]);

    useEffect(() => {
        if (socket && user) {
            socket.emit('user-connect', user.id);
        }
    }, [socket, user]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                if (exchangeId) {
                    const res = await axios.get(`/api/chat/exchange/${exchangeId}`);
                    setMessages(res.data);
                    
                    // Get exchange details to find receiver
                    const exchangeRes = await axios.get('/api/exchange/my-exchanges');
                    const currentExchange = exchangeRes.data.find(ex => ex._id === exchangeId);
                    if (currentExchange) {
                        const otherUserId = currentExchange.requester._id === user.id
                            ? currentExchange.provider._id
                            : currentExchange.requester._id;
                        setReceiverId(otherUserId);
                    }
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();
    }, [exchangeId, user]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket) return;

        if (exchangeId && receiverId) {
            socket.emit('send-message', {
                senderId: user.id,
                receiverId,
                exchangeId,
                message: newMessage
            });

            setMessages((prev) => [
                ...prev,
                {
                    _id: Date.now(),
                    sender: { _id: user.id, name: user.name },
                    message: newMessage,
                    createdAt: new Date().toISOString()
                }
            ]);

            setNewMessage('');
        } else {
            try {
                await axios.post('/api/chat/send', {
                    exchangeId,
                    receiverId,
                    message: newMessage
                });
                setNewMessage('');
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    const createExchangeAndChat = async () => {
        try {
            const res = await axios.post('/api/exchange/create', {
                providerId: userIdFromQuery,
                offeredSkill: 'React',
                neededSkill: 'Python'
            });
            navigate(`/chat/${res.data.exchange._id}`);
        } catch (error) {
            console.error('Error creating exchange:', error);
        }
    };

    if (!exchangeId) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold mb-4">Select a conversation</h1>
                <p className="text-gray-600 mb-4">Choose a match from Search Skills to start chatting</p>
                {userIdFromQuery && (
                    <button
                        onClick={createExchangeAndChat}
                        className="bg-primary text-white px-6 py-2 rounded-lg"
                    >
                        Create Exchange & Chat
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md h-[600px] flex flex-col">
                <div className="bg-primary text-white p-4 rounded-t-lg">
                    <h2 className="text-xl font-bold">Chat</h2>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => (
                        <div
                            key={msg._id}
                            className={`flex ${
                                msg.sender?._id === user.id ? 'justify-end' : 'justify-start'
                            }`}
                        >
                            <div
                                className={`max-w-xs px-4 py-2 rounded-lg ${
                                    msg.sender?._id === user.id
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-200 text-gray-900'
                                }`}
                            >
                                <p>{msg.message}</p>
                                <p className="text-xs mt-1 opacity-75">
                                    {new Date(msg.createdAt).toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <form onSubmit={sendMessage} className="p-4 border-t">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button
                            type="submit"
                            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
                        >
                            Send
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Chat;