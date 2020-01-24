import io from 'socket.io-client'
import Led from './led.mjs'
import Accelerometer from './accelerometer.mjs'
import { sleep } from './util.mjs'

// 定数
const THRESHOLD = 3

const socket = io('http://10.7.31.36:8080')
const led = new Led()
const acc = new Accelerometer()


socket.on('connect', () => {
  console.log('Connected to the server.')
  socket.emit('clientHello', piId)

  // 加速度計を初期化
  await acc.init()

  // サーバーから色を変更する命令がきたら、その色に変更する
  socket.on('changeColor', color => {
    led.changeColor(new Color(color.red, color.green, color.blue))
  })

  // 値をひたすらとる
  while (true) {
    [gx, gy, gz, ax, ay, az] = await Promise.all([
      acc.getGX(),
      acc.getGY(),
      acc.getGZ(),
      acc.getAX(),
      acc.getAY(),
      acc.getAZ(),
    ])

    console.log('\nGyro X', gx)
    console.log('Gyro Y', gy)
    console.log('Gyro Z', gz)
    console.log('Acc. X', ax)
    console.log('Acc. Y', ay)
    console.log('Acc. Z', az)

    await sleep(500)
  }
})
