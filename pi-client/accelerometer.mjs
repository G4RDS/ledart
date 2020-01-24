import i2c from 'i2c-bus'
import { sleep } from './util.mjs'

const MPU6050_ADDR = 0x68

// 補正のための基準値
const GX_STD = -55
const GY_STD = 10
const GZ_STD = -30
const AX_STD = 0
const AY_STD = 130
const AZ_STD = 4460

// 加速度計にアクセスするクラス
export default class Accelerometer {
  constructor() {
    this.bus = null
  }

  // 初期化処理
  async init() {
    try {
      // I2C Bus を開く
      this.bus = await i2c.openPromisified(1)

      // セットアップ
      await this.bus.writeByte(MPU6050_ADDR, 0x6b, 0x80) // reset
      await sleep(250)
      await this.bus.writeByte(MPU6050_ADDR, 0x6b, 0x00) // reset
      await sleep(250)
      await this.bus.writeByte(MPU6050_ADDR, 0x6a, 0x07) // reset
      await sleep(250)
      await this.bus.writeByte(MPU6050_ADDR, 0x6a, 0x00) // reset
      await sleep(250)
      await this.bus.writeByte(MPU6050_ADDR, 0x1a, 0x00) // config
      await this.bus.writeByte(MPU6050_ADDR, 0x1b, 0x18) // +-2000/s
      await this.bus.writeByte(MPU6050_ADDR, 0x1c, 0x10) // +-8g
    } catch (err) {
      throw new Error('Device was not detected')
    }
  }

  async getGX() {
    const val = await this.getValue(0x43)
    return val - GX_STD / 131
  }
  async getGY() {
    const val = await this.getValue(0x45)
    return val - GY_STD / 131
  }
  async getGZ() {
    const val = await this.getValue(0x47)
    return val - GZ_STD / 131
  }
  async getAX() {
    const val = await this.getValue(0x3b)
    return val - AX_STD / 16384
  }
  async getAY() {
    const val = await this.getValue(0x3d)
    return val - AY_STD / 16384
  }
  async getAZ() {
    const val = await this.getValue(0x3f)
    return val - AZ_STD / 16384
  }
  async getTemp() {
    const val = await this.getValue(0x41)
    return val / 340 + 36.53
  }

  async getValue(addr) {
    let tmp = await this.bus.readByte(MPU6050_ADDR, addr)
    let sign = tmp & 0x80

    tmp &= 0x7f
    tmp <<= 8
    tmp = tmp | (await this.bus.readByte(MPU6050_ADDR, addr + 1))

    if (sign > 0) {
      tmp -= 32768
    }

    return tmp
  }
}

// テスト用 main
// ;(async function() {
//   // 加速度計
//   const acc = new Accelerometer()
//   await acc.init()

//   // 値をひたすらとる
//   while (true) {
//     let gx = acc.getGX()
//     let gy = acc.getGY()
//     let gz = acc.getGZ()
//     let ax = acc.getAX()
//     let ay = acc.getAY()
//     let az = acc.getAZ()
//     let t = acc.getTemp()

//     ;[gx, gy, gz, ax, ay, az, t] = await Promise.all([
//       gx,
//       gy,
//       gz,
//       ax,
//       ay,
//       az,
//       t,
//     ])

//     console.log('Gyro X', gx)
//     console.log('Gyro Y', gy)
//     console.log('Gyro Z', gz)
//     console.log('Acc. X', ax)
//     console.log('Acc. Y', ay)
//     console.log('Acc. Z', az)
//     console.log('Temp. ', t)

//     await sleep(500)
//   }
// })()
