const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Search skills with matching algorithm
router.get('/search', auth, async (req, res) => {
    try {
        const { skill, category, city } = req.query;
        const currentUser = await User.findById(req.user._id);

        let query = {
            _id: { $ne: currentUser._id } // Exclude self
        };

        // Perfect match logic
        const perfectMatchQuery = {
            _id: { $ne: currentUser._id },
            $or: [
                { 'offers.skill': { $in: currentUser.needs.map(n => n.skill) } },
                { 'needs.skill': { $in: currentUser.offers.map(o => o.skill) } }
            ]
        };

        // Apply filters
        if (skill) {
            query['offers.skill'] = { $regex: skill, $options: 'i' };
            perfectMatchQuery['offers.skill'] = { $regex: skill, $options: 'i' };
        }

        if (category) {
            query['offers.category'] = category;
            perfectMatchQuery['offers.category'] = category;
        }

        if (city) {
            query.city = city;
            perfectMatchQuery.city = city;
        }

        // Find matches
        const perfectMatches = await User.find(perfectMatchQuery).select('-password');
        const partialMatches = await User.find(query).select('-password');

        // Remove duplicates
        const matchIds = new Set(perfectMatches.map(m => m._id.toString()));
        const filteredPartial = partialMatches.filter(p => !matchIds.has(p._id.toString()));

        res.json({
            perfectMatches,
            partialMatches: filteredPartial
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all users with skills
router.get('/all', auth, async (req, res) => {
    try {
        const users = await User.find({
            _id: { $ne: req.user._id },
            $or: [
                { 'offers': { $exists: true, $ne: [] } },
                { 'needs': { $exists: true, $ne: [] } }
            ]
        }).select('-password');

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;