const io = require('socket.io-client')
const socket = io('http://localhost:8080')
socket.on('chat message', (msg) => {
  console.log(`CLI: ${msg}`)
})
