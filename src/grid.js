import Cell from './cell'
import { randomColor } from './tools'

class Grid {
  constructor({ width, height, cw, ch }) {
    const xNum = Math.ceil(width / cw)
    const yNum = Math.ceil(height / ch)
    this.xNum = xNum
    this.yNum = yNum
    this.cw = cw
    this.ch = ch
  }

  getCellList() {
    if (this.gridList) {
      return this.gridList
    }
    const { yNum, xNum, cw, ch } = this
    const gridList = []
    let y0 = 0
    while (y0 < yNum) {
      const gridItem = []
      let x0 = 0
      while (x0 < xNum) {
        const cell = new Cell({
          coordinate: { x: x0, y: y0 },
          size: { w: cw, h: ch },
          color: '#fff',
          lineWidth: 2
        })
        gridItem.push(cell)
        x0++
      }
      gridList.push(gridItem)
      y0++
    }
    this.gridList = gridList
    return gridList
  }
}

export default Grid