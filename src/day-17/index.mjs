import {readLines, inc} from '../helpers/streams.mjs'
import Probe from './Probe.mjs'


const createPoint = (x, y) => ({x, y})

const targetArea = await readLines(import.meta.url, 'input.test')
  .map(a => a.substring('target area: '.length).split(', '))
  .flatten()
  .reduce((acc, s) => {
    const [p, r] = s.split('=')
    const [min,max] = r.split('..').map(s => parseInt(s))
    return {...acc, [p]: {min, max}}
  }, {})

const probe = new Probe(createPoint(0,0), targetArea)

const path = probe.moveToTarget(createPoint(7,2))

console.log(path)
