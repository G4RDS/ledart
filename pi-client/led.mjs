import PiGpio from 'pigpio'
import Color from './color.mjs'

const Gpio = PiGpio.Gpio

export default class Led {
  constructor() {
    // led gpio
    this.gpioRed = new Gpio(4, { mode: Gpio.OUTPUT })
    this.gpioGreen = new Gpio(17, { mode: Gpio.OUTPUT })
    this.gpioBlue = new Gpio(27, { mode: Gpio.OUTPUT })
    // led value
    this.color = new Color(0, 0, 0)

    // 初期化処理
    this.gpioRed.digitalWrite(0)
    this.gpioGreen.digitalWrite(0)
    this.gpioBlue.digitalWrite(0)

    // プロセスが落ちるときに呼ばれる
    process.on('SIGINT', () => {
      this.gpioRed.digitalWrite(0)
      this.gpioGreen.digitalWrite(0)
      this.gpioBlue.digitalWrite(0)
      process.exit()
    })
  }

  changeColor(color) {
    this.color = color

    // update pwm value
    gpioRed.pwmWrite(this.color.red)
    gpioGreen.pwmWrite(this.color.green)
    gpioBlue.pwmWrite(this.color.blue)
  }
}
