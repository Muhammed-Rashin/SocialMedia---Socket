console.log('Yes its Here');
const io = require('socket.io')(7000, {
  cors: {
    origin: 'https://polite-pie-664ba6.netlify.app',
  },
});

let activeUsers = [];

io.on('connection', (socket) => {
  socket.on('new-user-add', (newUserId) => {
    console.log(newUserId);
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({
        userId: newUserId,
        socketId: socket.id,
      });
    }
    io.emit('get-users', activeUsers);
  });

  socket.on('send-message', (obj) => {
    const user = activeUsers.find((user) => user.userId === obj.to);
    console.log(user);

    if (user) {
      io.to(user.socketId).emit('recieve-message', obj.message);
    }
  });
  socket.on('disconnect', () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    io.emit('get-users', activeUsers);
  });
});
