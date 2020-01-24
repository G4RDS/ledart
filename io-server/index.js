const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)

const PORT = 8080

io.on('connection', socket => {
  console.log('A client has been connected.')

  socket.on('clientHello', clientName => {
    console.log(`Hello from client: `, clientName)
  })

  socket.on('changeColor', color => {
    console.log(`Change color request has been received.`)
    socket.broadcast.emit('changeColor', color)
  })
})

http.listen(PORT, () => console.log(`listening on *:${PORT}`))
