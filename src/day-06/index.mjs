import {readLines, inc, dec, linesToNumbers} from '../helpers/streams.mjs'
import Lazy from 'lazy.js'

const school = await readLines(import.meta.url, 'input')
  .map(l => l.split(','))
  .flatten()
  .map(n => parseInt(n))
  .reduce((fishes, fish) => {
    fishes[fish] = (fishes[fish] + 1) || 1
    return fishes
  }, {})

const schedule = Array(7).fill(0).map((n, i) => school[i] || n)
const maturing = Array(9).fill(0)

for (let day = 0; day < 256; day++) {
  const id = day % 7
  const newadults = maturing.shift() 
  if (newadults) schedule[id] += newadults
  maturing.push(schedule[id])
  if (day == 79)
    console.log('Part 1: ', schedule.reduce(inc) + maturing.reduce(inc), ' fishes.')
}

console.log('Part 2: ', schedule.reduce(inc) + maturing.reduce(inc), ' fishes.')
