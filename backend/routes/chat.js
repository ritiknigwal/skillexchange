const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Exchange = require('../models/Exchange');
const auth = require('../middleware/auth');

// Get messages for an exchange
router.get('/exchange/:exchangeId', auth, async (req, res) => {
    try {
        const messages = await Message.find({
            exchangeId: req.params.exchangeId
        })
        .populate('sender', 'name')
        .populate('receiver', 'name')
        .sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Send message
router.post('/send', auth, async (req, res) => {
    try {
        const { exchangeId, receiverId, message } = req.body;

        const msg = new Message({
            exchangeId,
            sender: req.user._id,
            receiver: receiverId,
            message
        });

        await msg.save();

        res.status(201).json({
            message: 'Message sent',
            newMessage: msg
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;