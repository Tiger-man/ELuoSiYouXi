import Drawer from './drawer'
import Shape from './shape'
import Grid from './grid'

class Game {
  constructor({ canvasId, cSize, width, height }) {
    const canvas = document.getElementById(canvasId)
    const ctx = canvas.getContext('2d')
    canvas.width = width
    canvas.height = height

    // this.cSize = cSize
    // this.width = width
    // this.height = height
    // this.ctx = ctx
    this.grid = new Grid({ width, height, cw: cSize, ch: cSize })
    this.drawer = new Drawer({ ctx, width, height, cw: cSize, ch: cSize })
    this.shape = new Shape()
    this.listener()
  }

  getCellList() {
    return this.grid.getCellList()
  }

  getCurrentCoordinate() {
    return { x: 3, y: 0 }
  }

  init() {
    const cellList = this.getCellList()
    console.log('cellList:', cellList)
    this.drawer.paintCellList(cellList)

    // 随机生成一个形状
    const shape = this.shape.next()

    // 以(3, 0)处为起点 绘制该点
    const coordinate = { x: 3, y: 0 }

    this.drawer.paintShapeByCoordinate({
      coordinate,
      shape,
      cellList
    })

    // const cell = cellList[coordinate[y]][x]
    // cell.changeColor()
    // this.drawer.paint(coordinate, nextShape)
    // console.log('nexShape:', nextShape)
    // const changeShape = this.shape.changeShape()
    // console.log("changeShape:", changeShape)
  }

  listener() {
    window.addEventListener('keydown', event => {
      const key = event.key
      // this.drawer.init()

      if (key === 'ArrowUp') {
        // console.log('----变形:----')
        this.changeShape()
        // console.log("changeShape:", changeShape)
      }
      else if (key === 'ArrowDown') {
        // console.log('----下移----')
        const nextShape = this.shape.next()
        this.drawer.paint({ x: 3, y: 0 }, nextShape)
      }
      else if (key === 'ArrowLeft') {
        // console.log('----左移----')
      }
      else if (key === 'ArrowRight') {
        // console.log('----右移----')
      }
    })
  }

  // 变形shape
  changeShape() {
    const coordinate = this.getCurrentCoordinate()
    // 将当前的形态的点位 恢复为默认状态
    const currentShape = this.shape.getCurrentShape()
    this.drawer.paintShapeByCoordinate({
      coordinate,
      shape: currentShape,
      cellList: this.getCellList(),
      color: '#fff'
    })

    // 绘制最新的点位
    const changeShape = this.shape.changeShape()
    this.drawer.paintShapeByCoordinate({
      coordinate,
      shape: changeShape,
      cellList: this.getCellList()
    })
  }
}

export default Game