const socketIO = require('socket.io')
const setupSocketIO = (http) => {
  const io = socketIO(http)
  io.on('connection', (socket) => {
    console.log('a user connected')
    socket.emit('chat message', 'hola nuevo usuario!')
    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
    socket.on('chat message', (msg) => {
      console.log('message: ' + msg)
      io.emit('chat message', msg)
    })
  })
}
module.exports = setupSocketIO
