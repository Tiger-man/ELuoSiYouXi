/**
 * 生成一个给定区间内的随机整数数
 */
export function random(start = 0, end = 1) {
  const s = Math.min(start, end)
  const e = Math.max(start, end)
  const len = e - s
  return Math.floor(Math.random() * len + s)
}

/**
 * 生成一个随机颜色
 */
export function randomColor() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`
}