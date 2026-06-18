const express = require('express');
const router = express.Router();
const Exchange = require('../models/Exchange');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Create exchange
router.post('/create', auth, async (req, res) => {
    try {
        const { providerId, offeredSkill, neededSkill } = req.body;

        const exchange = new Exchange({
            requester: req.user._id,
            provider: providerId,
            offeredSkill,
            neededSkill
        });

        await exchange.save();

        res.status(201).json({
            message: 'Exchange created',
            exchange
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get my exchanges
router.get('/my-exchanges', auth, async (req, res) => {
    try {
        const exchanges = await Exchange.find({
            $or: [
                { requester: req.user._id },
                { provider: req.user._id }
            ]
        })
        .populate('requester', 'name email city')
        .populate('provider', 'name email city')
        .sort({ createdAt: -1 });

        res.json(exchanges);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update exchange status
router.put('/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;

        const exchange = await Exchange.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        res.json({
            message: 'Status updated',
            exchange
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Rate exchange
router.put('/:id/rate', auth, async (req, res) => {
    try {
        const { rating, review } = req.body;

        const exchange = await Exchange.findByIdAndUpdate(
            req.params.id,
            { rating, review, status: 'completed' },
            { new: true }
        );

        // Update user ratings
        const provider = await User.findById(exchange.provider);
        provider.completedExchanges += 1;
        provider.ratings = ((provider.ratings * provider.completedExchanges) + rating) / (provider.completedExchanges + 1);
        await provider.save();

        res.json({
            message: 'Rated successfully',
            exchange
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;