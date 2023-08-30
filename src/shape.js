import { RectBlockCollect, StraightBlockCollect, LBlockCollect, KBlockCollect, Z2BlockCollect, ZBlockCollect } from '../config/shape.config'
import { random } from './tools'

/**
 * 负责生成下一个形状及当前形状的下一个状态
 */
class Shape {

  shapeList = [RectBlockCollect, StraightBlockCollect, LBlockCollect, KBlockCollect, Z2BlockCollect, ZBlockCollect]

  // 存放当前形状[A]形态的集合及记录当前的形态所在的下标位置
  currentShapeCollect = { children: null, index: null }

  /**
   * 随机生成一个形状 [A]
   * 随机设置[A]的一个状态
   */
  next() {
    const index = random(0, this.shapeList.length)
    const shape = this.shapeList[index]
    const shapeItemIndex = random(0, shape.length)

    // 设置生成的形状及形状的形态
    this.currentShapeCollect = {
      children: shape,
      index: shapeItemIndex
    }
    return this.currentShapeCollect.children[shapeItemIndex]
  }

  // 当前形状->变化下一个形态
  changeShape() {
    const { children, index } = this.currentShapeCollect
    const nextIndex = index + 1 <= children.length - 1 ? index + 1 : 0
    this.currentShapeCollect.index = nextIndex
    return this.currentShapeCollect.children[nextIndex]
  }

  // 获取当前形态
  getCurrentShape() {
    const { children, index } = this.currentShapeCollect
    return children[index]
  }

}

export default Shape