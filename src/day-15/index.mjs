import {readLines, inc} from '../helpers/streams.mjs'
import Graph from 'node-dijkstra'
import * as math from 'mathjs'


const lines = await readLines(import.meta.url, 'input')



const map = await lines.map(l => l.split('').map(s => parseInt(s))).toArray()


function createCave (map) {

  const id = (row, column) => `${row}.${column}`
  const width = map[0].length
  const height = map.length

  function adjacentPoints(row, column) {
    return [[-1,0],[0,-1], [0, 1], [1, 0]]
      .map(([x, y]) => [row + x, column + y])
      .filter(([x, y]) => x >= 0 && x < width && y >= 0 && y < height)
  }

  const routes = map.reduce((routes, line, column) => {
    line.forEach((weight, row) => {
      const key = id(row, column)
      routes[key] = adjacentPoints(row, column).reduce((r, [x, y]) => {
        const point = id(x, y)
        return {...r, [point]: map[y][x]}  
      }, {})
    })
    return routes
  }, {})

  const cave = Object.entries(routes).reduce((cave, [id, routes]) => {
    cave.addNode(id, routes)
    return cave
  }, new Graph())

  const lastPoint = id(width - 1, height - 1)

  return {cave, lastPoint}

}


const {cave, lastPoint} = createCave(map)

const {cost, path} = cave.path('0.0', lastPoint, {cost:true})



console.log('Part 1: ', cost)


const matrix = math.matrix(map)

const shiftMatrix = (m, i)  => math.map(m.clone(), v => {
  const n = v + i
  if (n < 10) return n
  return n % 10 + 1 
})

let rowShifted = matrix

for (let i = 1; i < 5; i++) {
  rowShifted = math.concat(rowShifted, shiftMatrix(matrix, i))
}

let columnShifted = rowShifted

for (let i = 1; i < 5; i++) {
  columnShifted = math.concat(columnShifted, shiftMatrix(rowShifted, i), 0)
}

const {cave: cave2, lastPoint: lastPoint2} = createCave(columnShifted.toArray())
const {cost: cost2, path: path2} = cave2.path('0.0', lastPoint2, {cost:true})

console.log('Part 2: ', cost2)


