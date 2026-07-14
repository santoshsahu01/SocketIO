const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: { origin: '*' } // Allows your React Native app to connect
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for incoming messages from a client
  socket.on('sendMessage', (message) => {
    console.log('Message received:', message);
    // Broadcast the message to all OTHER connected users
    socket.broadcast.emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Render provides the PORT dynamically
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Real-time server running on port ${PORT}`);
});