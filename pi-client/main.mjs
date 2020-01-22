import Accelerometer from './accelerometer.mjs'

const ACC_THRESHOLD = 50

;(async function() {
  const acc = new Accelerometer()
  await acc.init()

  // 値をひたすらとる
  while (true) {
    let gx = acc.getGX()
    let gy = acc.getGY()
    let gz = acc.getGZ()
    let ax = acc.getAX()
    let ay = acc.getAY()
    let az = acc.getAZ()
    let t = acc.getTemp()

    ;[gx, gy, gz, ax, ay, az, t] = await Promise.all([
      gx,
      gy,
      gz,
      ax,
      ay,
      az,
      t,
    ])

    console.log('Gyro X', gx)
    console.log('Gyro Y', gy)
    console.log('Gyro Z', gz)
    console.log('Acc. X', ax)
    console.log('Acc. Y', ay)
    console.log('Acc. Z', az)
    console.log('Temp. ', t)

    await sleep(500)
  }
})()
