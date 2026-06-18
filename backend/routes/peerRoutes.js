import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.put('/update-peer-id', async (req, res) => {
  try {
    const { userId, peerId } = req.body;

    if (!userId || !peerId) {
      return res.status(400).json({ message: 'userId and peerId required' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { peerId: peerId },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Peer ID updated successfully', user });
  } catch (error) {
    console.error('Error updating peer ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/user-by-peer-id/:peerId', async (req, res) => {
  try {
    const { peerId } = req.params;
    const user = await User.findOne({ peerId: peerId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/available-users/:currentUserId', async (req, res) => {
  try {
    const { currentUserId } = req.params;
    const users = await User.find({
      peerId: { $exists: true, $ne: null },
      _id: { $ne: currentUserId }
    }).select('name email skills location peerId');

    res.json({ users });
  } catch (error) {
    console.error('Error fetching available users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;