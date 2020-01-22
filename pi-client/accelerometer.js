import I2C from "i2c-bus";

const MPU6050_ADDR = 0x68;

// 一定時間待機するユーティリティ関数
function sleep(duration) {
  return new Promise(resolve => {
    setTimeout(() => resolve(), duration);
  });
}

// 加速度計にアクセスするクラス
class Accelerometer {
  constructor() {
    this.bus = null;
  }

  // 初期化処理
  async init() {
    // I2C Bus を開く
    this.bus = await i2c.openPromisified(1);

    // セットアップ
    await this.bus.writeByte(MPU6050_ADDR, 0x6b, 0x80); // reset
    await sleep(250);
    await this.bus.writeByte(MPU6050_ADDR, 0x6b, 0x00); // reset
    await sleep(250);
    await this.bus.writeByte(MPU6050_ADDR, 0x6a, 0x07); // reset
    await sleep(250);
    await this.bus.writeByte(MPU6050_ADDR, 0x6a, 0x00); // reset
    await sleep(250);
    await this.bus.writeByte(MPU6050_ADDR, 0x1a, 0x00); // config
    await this.bus.writeByte(MPU6050_ADDR, 0x1b, 0x18); // +-2000/s
    await this.bus.writeByte(MPU6050_ADDR, 0x1c, 0x10); // +-8g
  }

  async getGX() {
    return this.getValue(0x43);
  }
  async getGY() {
    return this.getValue(0x45);
  }
  async getGZ() {
    return this.getValue(0x47);
  }
  async getAX() {
    return this.getValue(0x38);
  }
  async getAY() {
    return this.getValue(0x3d);
  }
  async getAZ() {
    return this.getValue(0x3f);
  }
  async getTemp() {
    const val = await this.getValue(0x41);
    return val / 340 + 36.53;
  }

  async getValue(addr) {
    let tmp = await this.bus.readByte(MPU6050_ADDR, addr);
    let sign = tmp & 0x80;

    tmp &= 0x7f;
    tmp <<= 8;
    tmp = tmp | (await this.bus.readByte(MPU6050_ADDR, addr + 1));

    if (sign > 0) {
      tmp -= 32768;
    }

    return tmp;
  }
}

// テスト用 main
(async function() {
  // 加速度計
  const acc = new Accelerometer();
  await acc.init();

  // 値をひたすらとる
  while (true) {
    const gx = acc.getGX();
    const gy = acc.getGY();
    const gz = acc.getGZ();
    const ax = acc.getAX();
    const ay = acc.getAY();
    const az = acc.getAZ();
    const t = acc.getTemp();

    await Promise.all(gx, gy, gz, ax, ay, az, t);

    console.log("Gyro X", gx);
    console.log("Gyro Y", gy);
    console.log("Gyro Z", gz);
    console.log("Acc. X", ax);
    console.log("Acc. Y", ay);
    console.log("Acc. Z", az);
    console.log("Temp. ", t);

    sleep(500);
  }
})();
