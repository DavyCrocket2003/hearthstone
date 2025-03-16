export default function setupSocket(io) {
  io.on('connection', (socket) => {
    console.log('User connected: ID - ' + socket.id);

    socket.on('disconnect', () => {
      console.log('User disconnected - ' + socket.id);
    });
  });
}