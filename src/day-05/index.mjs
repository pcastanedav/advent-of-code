import {readLines, inc} from '../helpers/streams.mjs'
import Lazy from 'lazy.js'

const readings = await readLines(import.meta.url, 'input.test')

const ventSegments = await readings.map(line => line.split(' -> ').map(parsePoint)).toArray()

const ventPoints = ventSegments.map(s => getPoints(s))

const pointsMap = ventPoints.reduce(accPoints, {})
const overlapPoints = Object.values(pointsMap).filter(a => a > 1).length
console.log('Part 1: ', overlapPoints)


const ventAllPoints = ventSegments.map(s => getPoints(s, true))
const allPointsMap = ventAllPoints.reduce(accPoints,{})

const screen = Lazy('....................................................................................................'.split('')).chunk(10).toArray()

for (let y = 0; y < screen.length; y++) {
  const line = screen[y]
  for (let x = 0; x < line.length; x++) {
    line[x] = allPointsMap[`${x}.${y}`] || '.'
  }
}

screen.forEach(line => {
  console.log(line.join(''))
})

function parsePoint(raw) { return raw.split(',').map(a => parseInt(a)) }

function getPoints([[x1, y1], [x2, y2]], allowSlope = false) {
  const a = {x: x1, y: y1}
  const b = {x: x2, y: y2}
  const m = getSlope(a, b)
  const deltaX = Math.abs(x2 - x1) + 1
  const deltaY = Math.abs(y2 - y1) + 1
  if (!allowSlope && m > 0) return []
  let segments = []
  if (deltaX > 1) {
    const startPoint = a.x > b.x ? b : a
    //segments = segments.concat(plotPointsX(deltaX, m, startPoint))
  }
  if (deltaY > 1) {
    const startPoint = a.y > b.y ? b : a
    segments = segments.concat(plotPointsY(deltaY, m, startPoint))
  }
  if (allowSlope)
    console.log(a, ' to ', b, m, segments)
  return [...new Set(segments)]
}

function plotPointsY(delta, m, start) {
    return Array(delta).fill(0).map((_,i) => {
      const y = start.y + i
      const x = get(m, start.x, i)
      return `${x}.${y}`
    })
}

function plotPointsX(delta, m, start) {
    return Array(delta).fill(0).map((_,i) => {
      const x = start.x + i
      const y = getY(m, start.y, i)
      return `${x}.${y}`
    })
}

function getSlope(a, b) {
  const dX = Math.abs(a.x - b.x)
  return dX && Math.abs(a.y - b.y) / dX 
}

function get(m, a, i) {
  return m ? (m * i + a) : a 
}

function accPoints (acc, points) {
  points.forEach(point => {
    if(acc[point]) acc[point] = acc[point] + 1
    else acc[point] = 1
  })
  return acc
}

