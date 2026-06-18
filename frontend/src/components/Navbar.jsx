import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold text-primary">
                            SkillExchange
                        </Link>
                        <div className="hidden md:flex ml-10 space-x-8">
                            <Link to="/dashboard" className="text-gray-700 hover:text-primary px-3 py-2">
                                Dashboard
                            </Link>
                            <Link to="/search" className="text-gray-700 hover:text-primary px-3 py-2">
                                Search Skills
                            </Link>
                            <Link to="/matches" className="text-gray-700 hover:text-primary px-3 py-2">
                                My Matches
                            </Link>
                            <Link to="/create-skill" className="text-gray-700 hover:text-primary px-3 py-2">
                                Add Skills
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link to="/profile" className="text-gray-700 hover:text-primary">
                            <img
                                src={user?.photo}
                                alt={user?.name}
                                className="h-8 w-8 rounded-full"
                            />
                        </Link>
                        <span className="text-gray-700">{user?.name}</span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;