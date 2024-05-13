const express = require('express');
const app = express();
const router = require("express").Router();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const messages = []

app.use(express.json());

io.on('connection', (socket) => {
  const username = socket.handshake.query.username
  socket.on('message', (data) => {
    const message = {
      message: data.message,
      senderUsername: username,
      sentAt: Date.now()
    }
    messages.push(message)
    io.emit('message', message)
    io.emit('length', messages.length)

  })
});

// io.on('connection', (socket) => {
//   socket.on('length', () => {
//     io.emit('length', messages.length)
//   })
// });

app.use("/api", router.get("/ping", (req, res) => {
  return res.json({
    message: 'Server Test'
  })
}))

server.listen(3000, () => {
  console.log('listening on *:3000');
});

