import {readLines, inc} from '../helpers/streams.mjs'
import lazy from 'lazy.js'

const lines = await readLines(import.meta.url, 'input')
    .map(l => l.split('').map(l => parseInt(l)))

const value = (i, j) => {
  const value = (octopuses[i]||[])[j]
  return {i, j, value: value == undefined ? 10 : value}
}

function adjacent () {
  return [
    (i,j) => value(i - 1, j + 1),
    (i,j) => value(i - 1, j - 1),
    (i,j) => value(i + 1, j + 1),
    (i,j) => value(i + 1, j - 1),
    (i,j) => value(i, j - 1),
    (i,j) => value(i, j + 1),
    (i,j) => value(i - 1, j),
    (i,j) => value(i + 1, j)
  ]
}
const id = (i, j) => `${i}.${j}`

const octopuses = await lines.toArray()
const near = adjacent()

function step() {
  return octopuses.reduce((pulsing, row, i) => {
    return pulsing.concat(row.reduce((acc, octopus, j) => {
      const value = octopus + 1
      octopuses[i][j] = value 
      if (value > 9) {
        const a = near.map(point => point(i,j)).filter(p => p.value < 10)
        return acc.concat(a)
      }
      return acc
    }, []))
  }, [])
}

function pulse(pulsing) {
  const a = pulsing.reduce((acc, {i,j}) => {
    if (octopuses[i][j] < 10) {
      octopuses[i][j] += 1 
      if (octopuses[i][j] > 9) {
        return acc.concat(near.map(point => point(i,j)).filter(p => p.value < 10))
      }
    }
    return acc
  }, [])
  return a
}

function flash() {
  return octopuses.reduce((acc, row, i) => {
    return acc + (row.reduce((acc, octopus, j) => {
      if (octopus < 10) return acc
      octopuses[i][j] = 0
      return acc + 1
    }, 0))
  }, 0)
}

function printO() {
  for (let row of octopuses) {
    console.log(row.join(''))
  }
}

const flashes = []
let n = 0;
while(!octopuses.every(row => row.every(o => o == 0))) {
  n++
  let pulsing = step()
  while(pulsing.length > 0) {
    pulsing = pulse(pulsing)
  }
  flashes.push(flash())
}


console.log('Part 1:', await lazy(flashes).take(100).reduce(inc, 0))

console.log('Part 2: ', n)
