const io = require('socket.io-client')
const Gpio = require('pigpio').Gpio

const socket = io('http://192.168.0.6:8080')

const piId = 'pi5'
// gpio
const gpioRed = new Gpio(4, { mode: Gpio.OUTPUT })
const gpioGreen = new Gpio(17, { mode: Gpio.OUTPUT })
const gpioBlue = new Gpio(27, { mode: Gpio.OUTPUT })
// rgb value
let red = 0
let green = 0
let blue = 0

// init
gpioRed.digitalWrite(0)
gpioGreen.digitalWrite(0)
gpioBlue.digitalWrite(0)

function updateColor(color) {
  ;({ red, green, blue } = color)
}

function ledUpdatePwm() {
  gpioRed.pwmWrite(red)
  gpioGreen.pwmWrite(green)
  gpioBlue.pwmWrite(blue)
}

socket.on('connect', () => {
  console.log('Connected to the server.')
  socket.emit('clientHello', piId)

  socket.on('changeColor', color => {
    console.log('Change color request has been received.')

    updateColor(color)
    ledUpdatePwm()

    console.log('Updated the color to: ', { red, green, blue })
  })
})

// プロセスが落ちるときに呼ばれる
process.on('SIGINT', () => {
  gpioRed.digitalWrite(0)
  gpioGreen.digitalWrite(0)
  gpioBlue.digitalWrite(0)
  process.exit()
})
