import { randomColor } from "./tools"

/**
 * Cell
 * cell所在的点位坐标 coordinate: { x, y }
 * cell的长宽 size: { w, h }
 */
class Cell {
  constructor({ coordinate, size, color, lineWidth }) {
    this.coordinate = coordinate
    this.size = size
    this.color = color
    this.lineWidth = lineWidth
  }

  changeColor(color) {
    this.color = color
  }

}

export default Cell