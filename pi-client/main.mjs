import io from 'socket.io-client'
import Led from './led.mjs'
import Color from './color.mjs'
import Accelerometer from './accelerometer.mjs'
import { sleep } from './util.mjs'

// 定数
const piId = 1
const THRESHOLD = 1.5
const TIMEOUT_DURATION = 1000

const socket = io('http://10.7.31.37:8080')
const led = new Led()
const acc = new Accelerometer()

const lastPushed = 0

socket.on('connect', async () => {
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
    const [gx, gy, gz] = await Promise.all([
      acc.getGX(),
      acc.getGY(),
      acc.getGZ(),
    ])

    // ジャイロの三軸のうち一つでも閾値を超え、最後に押されてから一定時間が経過しているなら、
    // バルーンが押されたと判定してサーバーに通知
    if (
      (gx >= THRESHOLD || gy >= THRESHOLD || gz >= THRESHOLD) &&
      Date.now() - lastPushed >= TIMEOUT_DURATION
    ) {
      lastPushed = Date.now()
      socket.emit('balloonPushed')
    }

    await sleep(500)
  }
})
