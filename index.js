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

/**
 * 俄罗斯游戏
 * 参数 { selector: 选择器， width: 宽度， height: 高度 }
 */
class ELuoSiGame {
  canvas = null
  ctx = null

  ratio = window.devicePixelRatio

  // 游戏是否结束
  die = false
  // 游戏暂停
  pause = false

  // 辅助线
  help = false

  // 自由掉落计数器Id
  dropIntervalTimer = null
  // 掉落速度
  dropSpeed = 1

  // 数字集合[0 空白单元  1 当前活动的block  2 被冻结的单元]
  boardList = []

  width = 300
  height = 600

  cellWidth = 10 * this.ratio
  cellHeight = 10 * this.ratio
  cellRectRatio = .4

  activeBlockInitPosition = { col: 15, row: 0 }

  activeBlock = {
    blockCollect: null,
    styleIndex: 0,
    position: this.activeBlockInitPosition
  }

  blockStyleCollect = [RectBlockCollect, ZBlockCollect, Z2BlockCollect, StraightBlockCollect, LBlockCollect, KBlockCollect]

  constructor({ selector, width, height }) {
    this.insertCanvas(selector, width, height)
    this.init()
    this.registerEventLister()
  }

  // 创建canvas
  insertCanvas(selector, width, height) {
    const canvas = document.createElement('canvas')

    const ratio = this.ratio

    this.width = (width || this.width) * ratio
    this.height = (height || this.height) * ratio

    canvas.width = this.width
    canvas.height = this.height

    canvas.style.width = this.width / ratio + 'px'
    canvas.style.height = this.height / ratio + 'px'

    document.querySelector(selector).appendChild(canvas)
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
  }

  // 初始化游戏
  init() {
    this.pause = false
    this.die = false
    this.companyBoardCollect()
    this.companyNewBlock()
    this.drawBoard()
    this.openDropBlockTimer()
  }

  // 生成新的block
  companyNewBlock() {
    const { blockCollect, styleIndex, position } = this.companyRandomBlock()
    this.setNewActiveBlock(blockCollect, styleIndex, position)
  }
}

ELuoSiGame.prototype.toggleHelp = function () {
  this.help = !this.help
}

ELuoSiGame.prototype.setNewActiveBlock = function (blockCollect, styleIndex, position) {
  this.setActiveBlock(blockCollect)
  this.setActiveBlockStyleIndex(styleIndex)
  this.setActiveBlockPosition(position)
  this.setActiveBoardValue(1)
}

ELuoSiGame.prototype.companyRandomBlock = function () {
  const { blockStyleCollect, activeBlockInitPosition } = this
  let randomBlockStyleCollectIndex = this.getInitRandom(blockStyleCollect.length)

  const randomBlockCollect = blockStyleCollect[randomBlockStyleCollectIndex]

  let randomColRowBlockCollectIndex = this.getInitRandom(randomBlockCollect.length)

  return { blockCollect: randomBlockCollect, styleIndex: randomColRowBlockCollectIndex, position: activeBlockInitPosition }
}

ELuoSiGame.prototype.getHelpAreaColAndRow = function () {
  const activeBlockColAndRows = this.getActiveBoardColRow()
  // 当前block占用的行数及列数
  const currentRowList = Array.from(new Set(activeBlockColAndRows.map(({ row }) => row)))
  const currentColList = Array.from(new Set(activeBlockColAndRows.map(({ col }) => col)))

  const { col, row } = this.getNextVerticalBlockPosition(currentRowList.length)

  return {
    cols: new Array(currentColList.length).fill(1).map((value, index) => col + index),
    row: row
  }
}

ELuoSiGame.prototype.drawBoard = function () {
  const ctx = this.ctx
  ctx.clearRect(0, 0, this.width, this.height)
  const boardList = this.boardList

  const { cols, row } = this.getHelpAreaColAndRow()

  for (let r = 0; r < boardList.length; r++) {
    for (let c = 0; c < boardList[r].length; c++) {
      const cellValue = boardList[r][c]
      if (cellValue === 0) {
        // 空白单元
        this.drawEmptyCell(c, r)
        // 绘制辅助线
        if (this.help && r >= row) {
          const inHelpArea = cols.includes(c)
          if (inHelpArea) {
            this.drawHelpCell(c, r)
          }
        }
      } else if (cellValue === 1) {
        // 当前活动的单元
        this.drawActiveCell(c, r)
      } else {
        // 被冻结的单元
        this.drawActiveCell(c, r)
      }
    }
  }

}

// 注册事件监听
ELuoSiGame.prototype.registerEventLister = function () {
  window.addEventListener('keydown', event => {
    if (this.pause || this.die) return
    const key = event.key
    const { blockCollect, styleIndex, position } = this.activeBlock

    let nextBlockCollect = blockCollect
    let nextStyleIndex = styleIndex;
    let nextPosition = { ...position }
    if (key === 'ArrowUp') {
      // console.log('----变形:----')
      nextStyleIndex = this.getNextBlockStyleIndex()
    }
    else if (key === 'ArrowDown') {
      // console.log('----下移----')
      nextPosition = this.getNextVerticalBlockPosition(1)
    }
    else if (key === 'ArrowLeft') {
      // console.log('----左移----')
      nextPosition = this.getNextHorizontalBlockPosition(-1)
    }
    else if (key === 'ArrowRight') {
      // console.log('----右移----')
      nextPosition = this.getNextHorizontalBlockPosition(1)
    }
    this.moveBlock(nextBlockCollect, nextStyleIndex, nextPosition)
  })
}

// 将block移动到指定的区域
ELuoSiGame.prototype.moveBlock = function (nextBlockCollect, nextStyleIndex, nextPosition) {
  // 左右触边  下移其区域若被占用  都是false
  const canNextChange = this.getCanNextChange(nextBlockCollect, nextStyleIndex, nextPosition)
  if (canNextChange) {
    this.setActiveBoardValue(0)
    this.activeBlock.styleIndex = nextStyleIndex
    this.activeBlock.position = nextPosition
    this.activeBlock.blockCollect = nextBlockCollect
    this.setActiveBoardValue(1)
    this.drawBoard()
  } else {
    // 检测是否可以下移
    const { blockCollect, styleIndex, position } = this.activeBlock
    const canDropChange = this.getCanDropChange(blockCollect, styleIndex, position)
    if (!canDropChange) {
      // 本次block结束 冻结对应cell
      this.freezeActiveBlockBoardCell()
      this.removeFulledRow()
      const { blockCollect, styleIndex, position } = this.companyRandomBlock()
      this.drawBoard()

      this.canDrawNextActiveBlock(blockCollect, styleIndex, position)

      this.setNewActiveBlock(blockCollect, styleIndex, position)
    }
  }
}

// 判断游戏是否结束
ELuoSiGame.prototype.canDrawNextActiveBlock = function (blockCollect, styleIndex, position) {
  this.die = !this.getCanNextChange(blockCollect, styleIndex, position)
  if (this.die) {
    // this.die = true
    alert('游戏结束')
  }
}

// 消除全部充满的行
ELuoSiGame.prototype.removeFulledRow = function () {
  const boardList = this.boardList.filter(row => row.some(v => v !== 2))
  const fulledRowNum = this.boardList.length - boardList.length
  if (fulledRowNum) {
    console.log(`---消除${fulledRowNum}行---`)
  }
  const newRow = new Array(boardList[0].length).fill(0)
  for (let i = 0; i < fulledRowNum; i++) {
    boardList.unshift(newRow.slice())
  }
  this.boardList = boardList
}

// 添加block自动掉落
ELuoSiGame.prototype.openDropBlockTimer = function () {
  if (this.dropIntervalTimer) {
    clearInterval(this.dropIntervalTimer)
    this.dropIntervalTimer = null
  }
  this.dropIntervalTimer = setInterval(() => {
    const { blockCollect, styleIndex } = this.activeBlock
    const die = this.die
    if (die) {
      clearInterval(this.dropIntervalTimer)
      this.dropIntervalTimer = null
      return
    }
    if (this.dropSpeed < 0) {
      console.error('自由掉落速度只能是不小于0的正整数')
      return
    }
    if (this.pause) {
      console.error('游戏已经暂停')
      return
    }
    const nextPosition = this.getNextVerticalBlockPosition(this.dropSpeed)
    this.moveBlock(blockCollect, styleIndex, nextPosition)
  }, 500)
}

// 冻结指定区域
ELuoSiGame.prototype.freezeActiveBlockBoardCell = function () {
  this.setActiveBoardValue(2)
}

// 检测是否可以进行next变化
ELuoSiGame.prototype.getCanNextChange = function (nextBlockCollect, nextStyleIndex, nextPosition) {
  const nextBoardColAndRowsCollect = this.getBoardColAndRow(nextBlockCollect, nextStyleIndex, nextPosition)
  // 判断依据是boardList中指定行列的值 是否被冻结  即 值 = 2 若等  则该点已被占用  无法移动
  const boardList = this.boardList
  return nextBoardColAndRowsCollect.every(({ col, row }) => boardList[row] && boardList[row][col] !== undefined && boardList[row][col] !== 2)
}

// 检测是否可以下移变化
ELuoSiGame.prototype.getCanDropChange = function (nextBlockCollect, nextStyleIndex, nextPosition) {
  const nextBoardColAndRowsCollect = this.getBoardColAndRow(nextBlockCollect, nextStyleIndex, nextPosition)
  const boardList = this.boardList
  return nextBoardColAndRowsCollect.every(({ col, row }) => boardList[row + 1] && boardList[row + 1][col] !== undefined && boardList[row + 1][col] !== 2)
}

// 水平移动block
ELuoSiGame.prototype.getNextHorizontalBlockPosition = function (step = 1) {
  const { position: { col, row } } = this.activeBlock
  const next_col = col + step
  return { col: next_col, row }
}

// 垂直移动block
ELuoSiGame.prototype.getNextVerticalBlockPosition = function (step = 1) {
  const { position: { row, col } } = this.activeBlock
  const next_row = row + step
  return { col, row: next_row }
}

// 变形
ELuoSiGame.prototype.getNextBlockStyleIndex = function () {
  const { styleIndex, blockCollect } = this.activeBlock
  const nextStyleIndex = (styleIndex + 1) < blockCollect.length ? (styleIndex + 1) : 0
  return nextStyleIndex
}

// 获取当前移动的block坐标
ELuoSiGame.prototype.getActiveBoardColRow = function () {
  const { blockCollect, styleIndex, position } = this.activeBlock
  return this.getBoardColAndRow(blockCollect, styleIndex, position)
}

ELuoSiGame.prototype.getBoardColAndRow = function (blockCollect, styleIndex, position) {
  const { col, row } = position
  return blockCollect[styleIndex].map(([c, r]) => {
    return { col: +col + +c, row: +row + +r }
  })
}

// 设置当前移动的block在board中的value值
ELuoSiGame.prototype.setActiveBoardValue = function (value) {
  const activeBorderColRowCollect = this.getActiveBoardColRow()
  activeBorderColRowCollect.forEach(({ col, row }) => {
    // 单元格描边
    this.setBoardCellValue(col, row, value)
  })
}

ELuoSiGame.prototype.setBoardCellValue = function (c, r, value) {
  const boardList = this.boardList
  boardList[r][c] = value
}

// 绘制空白单元
ELuoSiGame.prototype.drawEmptyCell = function (c, r) {
  const ctx = this.ctx
  // 单元格描边
  ctx.strokeStyle = 'rgba(0, 0, 0, .2)'
  this.strokeRect(c, r)

  // 单元格内填充
  ctx.fillStyle = 'rgba(0, 0, 0, .2)'
  this.fillRect(c, r)
}

// 绘制活动的单元
ELuoSiGame.prototype.drawActiveCell = function (c, r) {
  const ctx = this.ctx
  // 单元格描边
  ctx.strokeStyle = 'rgba(0, 0, 0, 1)'
  this.strokeRect(c, r)

  // 单元格内填充
  ctx.fillStyle = 'rgba(0, 0, 0, 1)'
  this.fillRect(c, r)
}

// 绘制辅助的单元
ELuoSiGame.prototype.drawHelpCell = function (c, r) {
  const ctx = this.ctx
  // 单元格描边
  ctx.strokeStyle = 'rgba(0, 0, 0, .25)'
  this.strokeRect(c, r)

  // 单元格内填充
  ctx.fillStyle = 'rgba(0, 0, 0, .25)'
  this.fillRect(c, r)
}

// 生成背景点点位
ELuoSiGame.prototype.companyBoardCollect = function () {
  const { width, height, cellWidth, cellHeight } = this
  const colNum = width / cellWidth
  const rowNum = height / cellHeight
  const boardList = []

  this.activeBlockInitPosition.col = Math.ceil(colNum / 2)

  for (let r = 0; r < rowNum; r++) {
    const rowItem = []
    for (let c = 0; c < colNum; c++) {
      rowItem.push(0)
    }
    boardList.push(rowItem)
  }
  this.boardList = boardList
}

// 生成随机数
ELuoSiGame.prototype.getInitRandom = function (num) {
  return Math.floor(Math.random() * num)
}

// 填充指定单元格 参数【列， 行】
ELuoSiGame.prototype.fillRect = function (col, row) {
  const { ctx, cellWidth, cellHeight, cellRectRatio } = this
  const gutter = (1 - cellRectRatio) / 2
  ctx.fillRect((col + gutter) * cellWidth, (row + gutter) * cellHeight, cellWidth * cellRectRatio, cellHeight * cellRectRatio)
}

// 描边指定单元格 参数【列， 行】
ELuoSiGame.prototype.strokeRect = function (col, row) {
  const { ctx, cellWidth, cellHeight } = this
  ctx.strokeRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight)
}

ELuoSiGame.prototype.setActiveBlock = function (blockCollect) {
  const { activeBlock } = this
  activeBlock.blockCollect = blockCollect
}

ELuoSiGame.prototype.setActiveBlockStyleIndex = function (styleIndex) {
  const { activeBlock } = this
  activeBlock.styleIndex = styleIndex
}

ELuoSiGame.prototype.setActiveBlockPosition = function (position) {
  const { activeBlock } = this
  activeBlock.position = position
}

// 暂停游戏
ELuoSiGame.prototype.pauseGame = function () {
  this.pause = !this.pause
}

// 重新开始游戏
ELuoSiGame.prototype.reStartGame = function () {
  this.init()
}