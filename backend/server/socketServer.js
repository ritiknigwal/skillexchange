import { Server } from 'socket.io';

export const initSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.frontend_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-chat', (data) => {
      const { callerId, peerId } = data;
      const room = `${callerId}-${peerId}`;
      
      socket.join(room);
      socket.currentRoom = room;
      
      console.log(`User ${callerId} joined room: ${room}`);
      
      socket.to(room).emit('user-joined', {
        callerId,
        message: `${callerId} joined the chat`
      });
    });

    socket.on('send-message', (data) => {
      const { room, message, senderId, timestamp } = data;
      
      io.to(room).emit('receive-message', {
        senderId,
        message,
        timestamp,
        isMe: senderId === socket.id
      });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      
      if (socket.currentRoom) {
        socket.to(socket.currentRoom).emit('user-left', {
          message: `${socket.id} left the chat`
        });
      }
    });
  });

  return io;
};