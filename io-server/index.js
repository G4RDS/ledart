const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)

const PORT = 8080

const COLORS = [
  {
    red: 255,
    green: 0,
    blue: 0,
  },
  {
    red: 0,
    green: 255,
    blue: 0,
  },
  {
    red: 0,
    green: 0,
    blue: 255,
  },
]
let currentColorIndex = COLORS.length - 1

function getNextColor() {
  if (++currentColorIndex >= COLORS.length) {
    currentColorIndex = 0
  }

  return COLORS[currentColorIndex]
}

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'))

io.on('connection', socket => {
  console.log('A client has been connected.')

  socket.on('clientHello', clientName => {
    console.log(`Hello from client: `, clientName)
  })

  socket.on('balloonPushed', () => {
    console.log(`A balloon was pressed.`)

    io.emit('changeColor', getNextColor())
  })

  // socket.on('changeColor', color => {
  //   console.log(`Change color request has been received.`)
  //   socket.broadcast.emit('changeColor', color)
  // })
})

http.listen(PORT, () => console.log(`listening on *:${PORT}`))
