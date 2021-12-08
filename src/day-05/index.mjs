import {readLines, inc, dec} from '../helpers/streams.mjs'
import Lazy from 'lazy.js'

const readings = await readLines(import.meta.url, 'input')

class Segment {

  constructor([a, b]) {
    this.a = a
    this.b = b
    this.dX = Math.abs(this.a.x - this.b.x)
    this.dY = Math.abs(this.a.y - this.b.y)
    this.slope = this.dX && this.dY / this.dX 
  }

  points () {
    return this.slope
      ? this.#diagonalPoints()
      : this.dX
        ? this.#horizontalPoints()
        : this.#verticalPoints()
  }

  #diagonalPoints() {
    const x = this.a.x > this.b.x ? dec : inc
    const y = this.a.y > this.b.y ? dec : inc
    return Array(this.dX + 1).fill(0).map((_,i) => `${x(this.a.x, i)}.${y(this.a.y, i)}`)
  }

  #horizontalPoints() {
    const x = Math.min(this.a.x, this.b.x)
    return Array(this.dX + 1).fill(0).map((_,i) => `${i + x}.${this.a.y}`)
  }

  #verticalPoints() {
    const y = Math.min(this.a.y, this.b.y)
    return Array(this.dY + 1).fill(0).map((_,i) => `${this.a.x}.${i + y}`)
  }

  static create(points) {
    return new Segment(points)
  }

  static parsePoint(raw) {
    const [x, y] = raw.split(',').map(a => parseInt(a))
    return {x, y}
  }

  static accumulatePoints (acc, points) {
    points.forEach(point => {
      if(acc[point]) acc[point] = acc[point] + 1
      else acc[point] = 1
    })
    return acc
  }

  static overlap (pointsMap) {
    return Object.values(pointsMap).filter(n => n > 1).length
  }

  static plotPoints(points, size = 100) {
    const plotLine = (line, y) => line.map((dot, x) => points[`${x}.${y}`] || dot)
    const plot = Lazy(Array(size).fill('.')).chunk(10).map(plotLine)
    plot.draw = () => plot.forEach(line => console.log(line.join('')))
    return plot
  }

}


const ventSegments = await readings
  .map(line => line.split(' -> ')
  .map(Segment.parsePoint))
  .map(Segment.create)

const part1Points = await ventSegments
  .filter(s => s.slope == 0)
  .map(s => s.points())
  .reduce(Segment.accumulatePoints, {})

const part1Overlap = Segment.overlap(part1Points)
const part1Plot = Segment.plotPoints(part1Points)


console.log('Part 1: ', part1Overlap)

//part1Plot.draw()

const part2Points = await ventSegments
  .map(s => s.points())
  .reduce(Segment.accumulatePoints, {})

const part2Overlap = Segment.overlap(part2Points)
const part2Plot = Segment.plotPoints(part2Points)

console.log('Part 2: ', part2Overlap)

//part2Plot.draw()
