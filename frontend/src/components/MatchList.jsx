import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MatchList = () => {
    const [exchanges, setExchanges] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchExchanges();
    }, []);

    const fetchExchanges = async () => {
        try {
            const res = await axios.get('/api/exchange/my-exchanges');
            setExchanges(res.data);
        } catch (error) {
            console.error('Error fetching exchanges:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await axios.put(`/api/exchange/${id}/status`, { status });
            fetchExchanges();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const rateExchange = async (id, rating, review) => {
        try {
            await axios.put(`/api/exchange/${id}/rate`, { rating, review });
            fetchExchanges();
        } catch (error) {
            console.error('Error rating exchange:', error);
        }
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">My Exchanges</h1>

            {exchanges.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-lg shadow-md">
                    <p className="text-gray-500 text-lg">No exchanges yet. Start searching for matches!</p>
                    <Link to="/search" className="mt-4 inline-block bg-primary text-white px-6 py-2 rounded-lg">
                        Search Skills
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {exchanges.map(exchange => (
                        <div key={exchange._id} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center mb-4">
                                <img
                                    src={exchange.requester._id === exchange.requester._id 
                                        ? exchange.provider.photo 
                                        : exchange.requester.photo}
                                    alt="User"
                                    className="w-16 h-16 rounded-full mr-4"
                                />
                                <div>
                                    <h3 className="text-xl font-bold">
                                        {exchange.requester._id === exchange.requester._id
                                            ? exchange.provider.name
                                            : exchange.requester.name}
                                    </h3>
                                    <p className="text-gray-600">
                                        {exchange.requester._id === exchange.requester._id
                                            ? exchange.provider.city
                                            : exchange.requester.city}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-green-600 font-semibold">Offered:</span>
                                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded">
                                        {exchange.offeredSkill}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-blue-600 font-semibold">Needed:</span>
                                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
                                        {exchange.neededSkill}
                                    </span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <span className={`px-3 py-1 rounded text-sm font-semibold ${
                                    exchange.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    exchange.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                                    exchange.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                    {exchange.status.toUpperCase()}
                                </span>
                            </div>

                            {exchange.status === 'pending' && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => updateStatus(exchange._id, 'in_progress')}
                                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                                    >
                                        Start
                                    </button>
                                    <button
                                        onClick={() => updateStatus(exchange._id, 'cancelled')}
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}

                            {exchange.status === 'in_progress' && (
                                <div className="space-y-2">
                                    <Link
                                        to={`/chat/${exchange._id}`}
                                        className="block bg-primary text-white text-center px-4 py-2 rounded hover:bg-indigo-700"
                                    >
                                        Chat
                                    </Link>
                                    <button
                                        onClick={() => {
                                            const rating = prompt('Rate 1-5:');
                                            const review = prompt('Write a review:');
                                            if (rating && review) {
                                                rateExchange(exchange._id, parseInt(rating), review);
                                            }
                                        }}
                                        className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                    >
                                        Complete & Rate
                                    </button>
                                </div>
                            )}

                            {exchange.status === 'completed' && exchange.rating && (
                                <div className="mt-4 bg-gray-100 p-3 rounded">
                                    <p className="font-semibold">Rating: {exchange.rating}/5 ⭐</p>
                                    <p className="text-gray-700">{exchange.review}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MatchList;