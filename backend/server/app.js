import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import peerServer from './peerServer.js'; // Import PeerJS server

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Your existing routes here...
// app.use('/api/auth', authRoutes);
// app.use('/api/skills', skillRoutes);

// Start PeerJS server separately
peerServer();

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Main server running on http://localhost:${PORT}`);
});