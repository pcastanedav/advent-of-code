import {readLines, inc} from '../helpers/streams.mjs'
import Probe from './Probe.mjs'
import lodash from 'lodash'


const createPoint = (x, y) => ({x, y})

const targetArea = await readLines(import.meta.url, 'input')
  .map(a => a.substring('target area: '.length).split(', '))
  .flatten()
  .reduce((acc, s) => {
    const [p, r] = s.split('=')
    const [min,max] = r.split('..').map(s => parseInt(s))
    return {...acc, [p]: {min, max}}
  }, {})

const probe = new Probe(createPoint(0,0), targetArea)

function test (probe) {
  let paths = []
  const x0 = Math.floor(Math.sqrt(2 * probe.target.x.min))
  const X = probe.target.x.max
  console.log(x0, X)
  for (let x = x0; x <= X; x++) {
    for (let y = -500; y < 500; y++) {
      let current = probe.moveToTarget(createPoint(x, y))
      if (current.hit) {
        //console.log('hit at: ', y)
        paths.push({pos: `${x}.${y}`, max: current.max})
      }
    }
  }
  return paths
}

const positions = test(probe)
const [highest]  = lodash.orderBy(positions, ['max'], ['desc'])
console.log(highest)
console.log(positions.length)

//console.table(test(probe))
