import { randomColor } from './tools'

/**
 * Drawer对象
 * ctx canvas2d
 * cw每个单元格的宽度 ch 每个单元格的高度 
 */
class Drawer {
  borderWidth = 2

  constructor({ ctx, cw, ch, width, height }) {
    this.ctx = ctx
    this.cw = cw
    this.ch = ch
    this.width = width
    this.height = height
  }

  init() {
    this.ctx.clearRect(0, 0, this.width, this.height)
    this.drawerBorder()
    this.drawerLine()
  }

  drawerBorder() {
    const { ctx, width, height, borderWidth } = this
    ctx.lineWidth = borderWidth
    ctx.strokeStyle = randomColor()

    // ctx.fillStyle = randomColor()
    // ctx.fillRect(borderWidth / 2, borderWidth / 2, width - borderWidth, height - borderWidth)
    ctx.strokeRect(borderWidth / 2, borderWidth / 2, width - borderWidth, height - borderWidth)
  }

  drawerLine() {
    const { ctx, width, height, cw, ch, borderWidth } = this
    const xBlockNum = Math.ceil(width / cw)
    const yBlockNum = Math.ceil(height / ch)

    let x = 1
    // 竖线
    while (x < xBlockNum) {
      ctx.beginPath()
      ctx.fillStyle = randomColor()
      ctx.fillRect(x * cw - borderWidth / 2, borderWidth, borderWidth, height - 2 * borderWidth)
      ctx.closePath()
      x++
    }

    let y = 1
    // 横线
    while (y < yBlockNum) {
      ctx.beginPath()
      ctx.fillStyle = randomColor()
      ctx.fillRect(borderWidth, y * ch - borderWidth / 2, width - 2 * borderWidth, borderWidth)
      ctx.closePath()
      y++
    }

  }

  paintCell(cell) {
    const ctx = this.ctx
    const { color, coordinate: { x, y }, lineWidth, size: { w, h } } = cell
    const dx = x * w
    const dy = y * h
    ctx.clearRect(dx, dy, w, h)
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = color
    ctx.strokeRect(dx, dy, w, h)
    ctx.fillStyle = color
    ctx.fillRect(dx, dy, w, h)
  }

  paintCellList(cellList) {
    let y0 = 0, len = cellList.length
    while (y0 < len) {
      const rowCells = cellList[y0]
      let x0 = 0
      while (x0 < rowCells.length) {
        const cell = rowCells[x0]
        this.paintCell(cell)
        x0++
      }
      y0++
    }
  }

  paintShapeByCoordinate({ coordinate, shape, cellList, color }) {
    color = color || randomColor()
    const { x, y } = coordinate
    const _cellList = shape.map(([_x, _y]) => {
      const cell = cellList[y + _y][x + _x]
      cell.changeColor(color)
      return [cell]
    })
    console.log(_cellList)
    this.paintCellList(_cellList)
  }
}

export default Drawer