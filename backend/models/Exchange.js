const mongoose = require('mongoose');

const ExchangeSchema = new mongoose.Schema({
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    offeredSkill: {
        type: String,
        required: true
    },
    neededSkill: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    review: {
        type: String,
        maxlength: 500
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Exchange', ExchangeSchema);