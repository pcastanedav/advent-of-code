import {readLines} from '../helpers/streams.mjs'
import PolymerMap from './PolymerMap.mjs'
import PolymerStream from './PolymerStream.mjs'

console.time('codezup')

const lines = await readLines(import.meta.url, 'input.test')

const [firstPolymer] = await lines.take(1).map(line => line.split('').map(s => s.charCodeAt(0))).toArray()

const rules = await lines.skip(1)
  .map(l => l.split(' -> '))
  .reduce((R, [k, v]) => {
    const k1 = k.charCodeAt(0)
    const k2 = k.charCodeAt(1)
    const vc = v.charCodeAt(0)
    R.set([k1,k2], [k1, vc]) 
    return R
  }, new PolymerMap())



const depth = 40
const reader = PolymerStream.create(depth, firstPolymer, rules)

reader.subscribe('START_READ', depth => console.log('Started Working at depth: ', depth))
reader.subscribe('END_READ', depth => console.log('Finished Working at depth: ', depth))
reader.subscribe('COUNT_UPDATED', counts => {
  console.log(counts)
})

const values = []
let source = reader
const tests = ['NNCB', 'NCNBCHB', 'NBCCNBBBCBHCB', 'NBBBCNCCNBBNBNBBCHBHHBCHB', 'NBBNBNBBCCNBCNCCNBBNBBNBBBNBBNBBCBHCBHHNHCBBCBHCB']

const counts = await reader.counts()
const elements = Object.values(counts).sort((a, b) => a - b)


console.log(counts)
console.log(elements[elements.length - 1] - elements[0])


console.timeEnd('codezup')
