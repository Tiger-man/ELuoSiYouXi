// 正方形点位
const RectBlockCollect = [
  [[0, 0], [1, 0], [1, 1], [0, 1]]
]

// 直线形点位
const StraightBlockCollect = [
  [[0, 0], [0, 1], [0, 2], [0, 3]],
  [[0, 0], [1, 0], [2, 0], [3, 0]]
]

// L行点位[顺时针变化]
const LBlockCollect = [
  [[0, 0], [0, 1], [0, 2], [1, 2]],
  [[0, 0], [1, 0], [2, 0], [0, 1]],
  [[0, 0], [1, 0], [1, 1], [1, 2]],
  [[0, 1], [1, 1], [2, 1], [2, 0]],
]

// K行点位[顺时针变化]
const KBlockCollect = [
  [[0, 0], [0, 1], [0, 2], [1, 1]],
  [[0, 0], [1, 0], [2, 0], [1, 1]],
  [[0, 1], [1, 0], [1, 1], [1, 2]],
  [[0, 1], [1, 1], [2, 1], [1, 0]],
]

// Z行点位[1][顺时针变化]
const ZBlockCollect = [
  [[0, 0], [0, 1], [1, 1], [1, 2]],
  [[0, 1], [1, 1], [1, 0], [2, 0]],
]

// Z行点位[1][顺时针变化]
const Z2BlockCollect = [
  [[1, 0], [1, 1], [0, 1], [0, 2]],
  [[0, 0], [1, 0], [1, 1], [2, 1]]
]

export { RectBlockCollect, StraightBlockCollect, LBlockCollect, KBlockCollect, Z2BlockCollect, ZBlockCollect }