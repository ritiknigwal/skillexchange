import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SearchSkills = () => {
    const [searchParams, setSearchParams] = useState({
        skill: '',
        category: '',
        city: ''
    });
    const [results, setResults] = useState({ perfectMatches: [], partialMatches: [] });
    const [loading, setLoading] = useState(false);

    const categories = ['Technology', 'Arts', 'Food', 'Fitness', 'Language', 'Music', 'Other'];

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const query = new URLSearchParams(searchParams).toString();
            const res = await axios.get(`/api/skills/search?${query}`);
            setResults(res.data);
        } catch (error) {
            console.error('Search error:', error);
        }

        setLoading(false);
    };

    const handleChange = (e) => {
        setSearchParams({
            ...searchParams,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Search Skills</h1>

            <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow-md mb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Skill</label>
                        <input
                            type="text"
                            name="skill"
                            value={searchParams.skill}
                            onChange={handleChange}
                            placeholder="React, Python..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            name="category"
                            value={searchParams.category}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                            type="text"
                            name="city"
                            value={searchParams.city}
                            onChange={handleChange}
                            placeholder="Indore, Delhi..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                </div>
            </form>

            {results.perfectMatches?.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-green-600 mb-4">
                        🎯 Perfect Matches ({results.perfectMatches.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {results.perfectMatches.map(user => (
                            <Link
                                key={user._id}
                                to={`/chat?userId=${user._id}`}
                                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
                            >
                                <img
                                    src={user.photo}
                                    alt={user.name}
                                    className="w-16 h-16 rounded-full mb-3"
                                />
                                <h3 className="text-lg font-bold">{user.name}</h3>
                                <p className="text-gray-600">{user.city}</p>
                                <div className="mt-2">
                                    <p className="text-green-600 font-semibold">Offers:</p>
                                    <div className="flex gap-1">
                                        {user.offers?.map((skill, i) => (
                                            <span key={i} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                                                {skill.skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <p className="text-blue-600 font-semibold">Needs:</p>
                                    <div className="flex gap-1">
                                        {user.needs?.map((skill, i) => (
                                            <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                                                {skill.skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {results.partialMatches?.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold text-yellow-600 mb-4">
                        ⚡ Partial Matches ({results.partialMatches.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {results.partialMatches.map(user => (
                            <Link
                                key={user._id}
                                to={`/chat?userId=${user._id}`}
                                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
                            >
                                <img
                                    src={user.photo}
                                    alt={user.name}
                                    className="w-16 h-16 rounded-full mb-3"
                                />
                                <h3 className="text-lg font-bold">{user.name}</h3>
                                <p className="text-gray-600">{user.city}</p>
                                <div className="mt-2">
                                    <p className="text-green-600 font-semibold">Offers:</p>
                                    <div className="flex gap-1">
                                        {user.offers?.map((skill, i) => (
                                            <span key={i} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                                                {skill.skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <p className="text-blue-600 font-semibold">Needs:</p>
                                    <div className="flex gap-1">
                                        {user.needs?.map((skill, i) => (
                                            <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                                                {skill.skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {results.perfectMatches?.length === 0 && results.partialMatches?.length === 0 && (
                <div className="text-center py-10">
                    <p className="text-gray-500 text-lg">No matches found. Try different search criteria.</p>
                </div>
            )}
        </div>
    );
};

export default SearchSkills;