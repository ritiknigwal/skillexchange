import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
    const { user, updateProfile, updateSkills } = useAuth();
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [skillsMode, setSkillsMode] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        city: ''
    });
    const [skillsData, setSkillsData] = useState({
        offers: [],
        needs: []
    });
    const [newOffer, setNewOffer] = useState({ skill: '', category: 'Technology' });
    const [newNeed, setNewNeed] = useState({ skill: '', category: 'Technology' });

    const categories = ['Technology', 'Arts', 'Food', 'Fitness', 'Language', 'Music', 'Other'];

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                bio: user.bio,
                city: user.city
            });
            setSkillsData({
                offers: user.offers || [],
                needs: user.needs || []
            });
        }
    }, [user]);

    const handleEditChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await updateProfile(formData);
        if (result.success) {
            setEditMode(false);
        }
        setLoading(false);
    };

    const handleAddOffer = () => {
        if (newOffer.skill && newOffer.category) {
            setSkillsData({
                ...skillsData,
                offers: [...skillsData.offers, newOffer]
            });
            setNewOffer({ skill: '', category: 'Technology' });
        }
    };

    const handleAddNeed = () => {
        if (newNeed.skill && newNeed.category) {
            setSkillsData({
                ...skillsData,
                needs: [...skillsData.needs, newNeed]
            });
            setNewNeed({ skill: '', category: 'Technology' });
        }
    };

    const handleRemoveOffer = (index) => {
        setSkillsData({
            ...skillsData,
            offers: skillsData.offers.filter((_, i) => i !== index)
        });
    };

    const handleRemoveNeed = (index) => {
        setSkillsData({
            ...skillsData,
            needs: skillsData.needs.filter((_, i) => i !== index)
        });
    };

    const handleSaveSkills = async () => {
        setLoading(true);
        const result = await updateSkills(skillsData);
        if (result.success) {
            setSkillsMode(false);
        }
        setLoading(false);
    };

    if (!user) return <div className="text-center py-10">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                    <button
                        onClick={() => setEditMode(!editMode)}
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                    >
                        {editMode ? 'Cancel' : 'Edit Profile'}
                    </button>
                </div>

                {editMode ? (
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleEditChange}
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Bio</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleEditChange}
                                rows="3"
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleEditChange}
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <img
                                src={user.photo}
                                alt={user.name}
                                className="w-20 h-20 rounded-full mr-4"
                            />
                            <div>
                                <h2 className="text-2xl font-bold">{user.name}</h2>
                                <p className="text-gray-600">{user.email}</p>
                                <p className="text-gray-500">{user.city}</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Bio</h3>
                            <p className="text-gray-700">{user.bio}</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-green-100 px-4 py-2 rounded">
                                <span className="text-green-800 font-semibold">Rating: </span>
                                <span className="text-green-800">{user.ratings || 0}</span>
                            </div>
                            <div className="bg-blue-100 px-4 py-2 rounded">
                                <span className="text-blue-800 font-semibold">Exchanges: </span>
                                <span className="text-blue-800">{user.completedExchanges || 0}</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold">My Skills</h2>
                        <button
                            onClick={() => setSkillsMode(!skillsMode)}
                            className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-emerald-600"
                        >
                            {skillsMode ? 'Cancel' : 'Manage Skills'}
                        </button>
                    </div>

                    {skillsMode ? (
                        <div className="space-y-6">
                            <div className="border p-4 rounded-lg">
                                <h3 className="text-lg font-semibold mb-3 text-green-600">Skills I Offer</h3>
                                <div className="space-y-2 mb-3">
                                    {skillsData.offers.map((skill, index) => (
                                        <div key={index} className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded">
                                            <span>{skill.skill} ({skill.category})</span>
                                            <button
                                                onClick={() => handleRemoveOffer(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newOffer.skill}
                                        onChange={(e) => setNewOffer({ ...newOffer, skill: e.target.value })}
                                        placeholder="Skill name"
                                        className="px-3 py-2 border rounded w-1/2"
                                    />
                                    <select
                                        value={newOffer.category}
                                        onChange={(e) => setNewOffer({ ...newOffer, category: e.target.value })}
                                        className="px-3 py-2 border rounded"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={handleAddOffer}
                                        className="bg-green-500 text-white px-4 py-2 rounded"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="border p-4 rounded-lg">
                                <h3 className="text-lg font-semibold mb-3 text-blue-600">Skills I Need</h3>
                                <div className="space-y-2 mb-3">
                                    {skillsData.needs.map((skill, index) => (
                                        <div key={index} className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded">
                                            <span>{skill.skill} ({skill.category})</span>
                                            <button
                                                onClick={() => handleRemoveNeed(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newNeed.skill}
                                        onChange={(e) => setNewNeed({ ...newNeed, skill: e.target.value })}
                                        placeholder="Skill name"
                                        className="px-3 py-2 border rounded w-1/2"
                                    />
                                    <select
                                        value={newNeed.category}
                                        onChange={(e) => setNewNeed({ ...newNeed, category: e.target.value })}
                                        className="px-3 py-2 border rounded"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={handleAddNeed}
                                        className="bg-blue-500 text-white px-4 py-2 rounded"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleSaveSkills}
                                disabled={loading}
                                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 w-full"
                            >
                                {loading ? 'Saving...' : 'Save Skills'}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-green-600 mb-2">Skills I Offer</h3>
                                {user.offers?.length > 0 ? (
                                    <div className="flex gap-2">
                                        {user.offers.map((skill, index) => (
                                            <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded">
                                                {skill.skill} ({skill.category})
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No skills added yet</p>
                                )}
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-blue-600 mb-2">Skills I Need</h3>
                                {user.needs?.length > 0 ? (
                                    <div className="flex gap-2">
                                        {user.needs.map((skill, index) => (
                                            <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
                                                {skill.skill} ({skill.category})
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No skills needed yet</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;