import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import http from 'http';
import { connectDB } from './config/db.js';
import peerRoutes from './routes/peerRoutes.js';
import { initSocketServer } from './server/socketServer.js';
import authRoutes from './routes/auth.js';


const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
initSocketServer(server);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/peer', peerRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Main server + Socket.io running on http://localhost:${PORT}`);
});