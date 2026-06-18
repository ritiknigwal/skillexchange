import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
const router = express.Router();
// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, city } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user
        const user = new User({
            name,
            email,
            password,
            city: city || 'Indore'
        });

        await user.save();

        // Generate token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                city: user.city
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                city: user.city,
                isPremium: user.isPremium
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get current user
router.get('/me', auth, async (req, res) => {
    res.json(req.user);
});

// Update profile
router.put('/profile', auth, async (req, res) => {
    try {
        const { name, bio, city } = req.body;
        
        const user = await User.findById(req.user._id);
        
        if (name) user.name = name;
        if (bio) user.bio = bio;
        if (city) user.city = city;
        
        await user.save();
        
        res.json({
            message: 'Profile updated',
            user
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Add skills
router.put('/skills', auth, async (req, res) => {
    try {
        const { offers, needs } = req.body;
        
        const user = await User.findById(req.user._id);
        
        if (offers) user.offers = offers;
        if (needs) user.needs = needs;
        
        await user.save();
        
        res.json({
            message: 'Skills updated',
            user
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;