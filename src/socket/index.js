const { Server } = require('socket.io');

let io;

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: ['http://localhost:5173', 'https://openchatx.vercel.app'],
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        socket.on('setup', (userData) => {
            socket.join(userData._id);
            console.log(`User ${userData._id} connected`);
            socket.emit('connected');
        });

        socket.on('join chat', (room) => {
            socket.join(room);
            console.log(`User joined chat: ${room}`);
        });

        socket.on('new message', (newMessageReceived) => {
            var chat = newMessageReceived.chat;

            if (!chat.users) return console.log('Chat.users not defined');

            chat.users.forEach((user) => {
                if (user._id === newMessageReceived.sender._id) return;

                socket.in(user._id).emit('message received', newMessageReceived);
            });
        });

        socket.on('typing', (room) => socket.in(room).emit('typing'));
        socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

        // WebRTC Signaling
        socket.on('callUser', (data) => {
            socket.to(data.userToCall).emit('callUser', {
                signal: data.signalData,
                from: data.from,
                name: data.name
            });
        });

        socket.on('answerCall', (data) => {
            socket.to(data.to).emit('callAccepted', data.signal);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
            socket.broadcast.emit('callEnded');
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};

module.exports = { initSocket, getIO };
