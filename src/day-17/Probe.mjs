export default class Probe {

  constructor(initialPosition, target) {
    console.log(target)
    this.position = initialPosition
    this.maxHeight = initialPosition.y
    this.target = target
  }

  moveStep (velocity) {
    this.position.x += velocity.x
    const newHeight = this.position.y + velocity.y
    this.maxHeight = Math.max(this.position.y, newHeight)
    this.position.y = newHeight
    this.velocity.y -= 1
    this.velocity.x = velocity.x > 0
      ? velocity.x - 1
      : velocity.x < 0
        ? velocity.x + 1
        : 0
  }

  relationToTarget() {
    if (this.position.y < this.target.y.max) return 'passed' 
    if (this.position.x > this.target.x.max) return 'passed'
    if (this.position.x < this.target.x.min) return 'behind'
    if (this.position.y > this.target.y.min) return 'behind' 
    return 'within'
  }

  moveToTarget (velocity) {
    let path = []
    let relation = this.relationToTarget()
    const recordPosition = () => path.push({relation, position: this.position})
    while (relation == 'behind') {
      this.moveStep(velocity)
      recordPosition()
      relation = relationToTarget()
    }
    return path
  }

}
