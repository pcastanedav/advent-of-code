import {readLines, inc} from '../helpers/streams.mjs'
import {walkBasin, adjacentLowpoints} from './basin.mjs'

const heights = await readLines(import.meta.url, 'input')
    .map(l => l.split('').map(h => parseInt(h) + 1))
    .toArray()

const adjacentPoints = adjacentLowpoints(heights)

const lowPoints = heights.reduce((lows, row, i) => {
  return lows.concat(row.reduce((acc, point,j) => {
    adjacentPoints.map(p => p(i,j)).every(p => point < p) && acc.push({i, j})
    return acc
  }, []))
}, [])

console.log('Part 1: ', lowPoints.map(({i,j}) => heights[i][j]).reduce(inc, 0))

function compareNumbers(a, b) { return a - b; }

const basins = lowPoints.reduce((acc, lowpoint) => {
  const basin = []
  for (const point of walkBasin(lowpoint, heights)) {
    basin.push(point)
  }
  const size = basin.length
  const largest = acc.largest.concat([size]).sort(compareNumbers).reverse().slice(0, 3)
  const basins = acc.basins.concat({...lowpoint, basin, size})
  return {largest, basins}
}, {largest: [], indexes:[], basins: []})

console.log('Part 2: ', basins.largest.reduce((a, b) => a * b, 1))

