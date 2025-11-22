const { Server } = require('socket.io');

/**
 * Initialize Socket.IO on the given HTTP server.
 * This sets up basic connection / disconnection logging and can be
 * extended with chat/message events later.
 */
function initSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: ['http://localhost:5173', 'https://openchatx.vercel.app'],
            credentials: true,
        },
    });

    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        // Example placeholder events – can be expanded as needed
        socket.on('joinRoom', (room) => {
            socket.join(room);
            console.log(`${socket.id} joined room ${room}`);
        });

        socket.on('leaveRoom', (room) => {
            socket.leave(room);
            console.log(`${socket.id} left room ${room}`);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });

    // Export the io instance for potential use elsewhere (optional)
    return io;
}

module.exports = { initSocket };
