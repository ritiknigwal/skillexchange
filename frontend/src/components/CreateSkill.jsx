import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const CreateSkill = () => {
    const { user, updateSkills } = useAuth();
    const [loading, setLoading] = useState(false);
    const [skillsData, setSkillsData] = useState({
        offers: user?.offers || [],
        needs: user?.needs || []
    });
    const [newOffer, setNewOffer] = useState({ skill: '', category: 'Technology' });
    const [newNeed, setNewNeed] = useState({ skill: '', category: 'Technology' });

    const categories = ['Technology', 'Arts', 'Food', 'Fitness', 'Language', 'Music', 'Other'];

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
            alert('Skills saved successfully!');
        }
        setLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Add Your Skills</h1>

                <div className="space-y-6">
                    <div className="border p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-3 text-green-600">Skills I Offer</h3>
                        <div className="space-y-2 mb-3">
                            {skillsData.offers.map((skill, index) => (
                                <div key={index} className="flex items-center justify-between bg-green-50 px-3 py-2 rounded">
                                    <span className="text-green-800">
                                        {skill.skill} ({skill.category})
                                    </span>
                                    <button
                                        onClick={() => handleRemoveOffer(index)}
                                        className="text-red-500 hover:text-red-700 font-bold"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <input
                                type="text"
                                value={newOffer.skill}
                                onChange={(e) => setNewOffer({ ...newOffer, skill: e.target.value })}
                                placeholder="Skill name (e.g., React)"
                                className="px-3 py-2 border rounded w-full md:w-1/2"
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
                                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                            >
                                + Add
                            </button>
                        </div>
                    </div>

                    <div className="border p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-3 text-blue-600">Skills I Need</h3>
                        <div className="space-y-2 mb-3">
                            {skillsData.needs.map((skill, index) => (
                                <div key={index} className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded">
                                    <span className="text-blue-800">
                                        {skill.skill} ({skill.category})
                                    </span>
                                    <button
                                        onClick={() => handleRemoveNeed(index)}
                                        className="text-red-500 hover:text-red-700 font-bold"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <input
                                type="text"
                                value={newNeed.skill}
                                onChange={(e) => setNewNeed({ ...newNeed, skill: e.target.value })}
                                placeholder="Skill name (e.g., Python)"
                                className="px-3 py-2 border rounded w-full md:w-1/2"
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
                                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                            >
                                + Add
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleSaveSkills}
                        disabled={loading}
                        className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-lg font-semibold"
                    >
                        {loading ? 'Saving...' : 'Save Skills'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateSkill;