import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();
    const [exchanges, setExchanges] = useState([]);
    const [stats, setStats] = useState({
        totalMatches: 0,
        pendingExchanges: 0,
        completedExchanges: 0
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const exchangesRes = await axios.get('/api/exchange/my-exchanges');
            setExchanges(exchangesRes.data);

            setStats({
                totalMatches: exchangesRes.data.length,
                pendingExchanges: exchangesRes.data.filter(ex => ex.status === 'pending').length,
                completedExchanges: exchangesRes.data.filter(ex => ex.status === 'completed').length
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Welcome back, {user?.name}! 👋</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Matches</h3>
                    <p className="text-4xl font-bold text-primary">{stats.totalMatches}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Pending Exchanges</h3>
                    <p className="text-4xl font-bold text-yellow-500">{stats.pendingExchanges}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Completed</h3>
                    <p className="text-4xl font-bold text-green-500">{stats.completedExchanges}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Link
                    to="/search"
                    className="bg-gradient-to-r from-primary to-indigo-600 text-white p-8 rounded-lg shadow-md hover:shadow-lg transition"
                >
                    <h2 className="text-2xl font-bold mb-2">🔍 Search Skills</h2>
                    <p className="opacity-90">Find people who can teach what you want to learn</p>
                </Link>

                <Link
                    to="/create-skill"
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8 rounded-lg shadow-md hover:shadow-lg transition"
                >
                    <h2 className="text-2xl font-bold mb-2">➕ Add Skills</h2>
                    <p className="opacity-90">Tell others what you can teach</p>
                </Link>

                <Link
                    to="/matches"
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-8 rounded-lg shadow-md hover:shadow-lg transition"
                >
                    <h2 className="text-2xl font-bold mb-2">📋 My Exchanges</h2>
                    <p className="opacity-90">Track your skill exchange progress</p>
                </Link>

                <Link
                    to="/profile"
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-8 rounded-lg shadow-md hover:shadow-lg transition"
                >
                    <h2 className="text-2xl font-bold mb-2">👤 My Profile</h2>
                    <p className="opacity-90">Update your information and skills</p>
                </Link>
            </div>

            {exchanges.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-4">Recent Exchanges</h2>
                    <div className="space-y-3">
                        {exchanges.slice(0, 5).map(exchange => (
                            <div key={exchange._id} className="border-b pb-3">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">
                                            {exchange.offeredSkill} ↔ {exchange.neededSkill}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {exchange.status.toUpperCase()}
                                        </p>
                                    </div>
                                    <Link
                                        to={`/chat/${exchange._id}`}
                                        className="text-primary hover:text-indigo-700"
                                    >
                                        Chat →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;