export default class Probe {

  constructor(initialPosition, target) {
    this.initialPosition = initialPosition
    this.target = target
  }

  initialize(velocity) {
    this.velocity = velocity
    this.relation = 'behind'
    this.position = {...this.initialPosition}
    this.maxHeight = this.initialPosition.y
  }

  moveStep () {
    this.position.x += this.velocity.x
    const newHeight = this.position.y + this.velocity.y
    this.maxHeight = Math.max(this.maxHeight, newHeight)
    this.position.y = newHeight
    this.velocity.y -= 1
    this.velocity.x = this.velocity.x > 0
      ? this.velocity.x - 1
      : this.velocity.x < 0
        ? this.velocity.x + 1
        : 0
    return this.relationToTarget()
  }

  relationToTarget() {
    //console.log({...this.position},  {...this.target})
    if (this.position.y < this.target.y.min) this.relation = 'passed'
    else if (this.position.x > this.target.x.max) this.relation = 'passed'
    else if (this.position.x < this.target.x.min) this.relation = 'behind'
    else if (this.position.y > this.target.y.max) this.relation = 'behind'
    else this.relation = 'within'
    return this.relation
  }

  moveToTarget (velocity) {
    let path = []
    this.initialize(velocity)
    while (this.moveStep() == 'behind') {
      path.push({...this.position, relation: this.relation})
    }
    path.push({...this.position, relation: this.relation})
    const hit = path.find(s => s.relation == 'within')
    return {path, max: this.maxHeight, hit}
  }

}
