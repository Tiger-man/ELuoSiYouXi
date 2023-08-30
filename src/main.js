import Shape from "./shape";
import Drawer from './drawer'
import { randomColor } from './tools'

import Game from "./game";


const cSize = 32
const width = cSize * 9, height = cSize * 16

const game = new Game({ canvasId: 'canvas', cSize, width, height })
game.init()
// const canvas = document.getElementById('canvas')
// const ctx = canvas.getContext('2d')
// canvas.width = width
// canvas.height = height

// const shape = new Shape()

// const drawer = new Drawer({ ctx, width, height, cw, ch })
// drawer.init()

// const randomShapeItem = shape.next()

// console.log(randomShapeItem)