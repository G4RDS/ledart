// 一定時間待機するユーティリティ関数
export function sleep(duration) {
  return new Promise(resolve => {
    setTimeout(() => resolve(), duration)
  })
}
