import {readLines, inc} from '../helpers/streams.mjs'

const crabs = await readLines(import.meta.url, 'input').map(l => l.split(',')).flatten().map(n => parseInt(n)).toArray()

console.log('Part 1: ', calculateFuelCost(crabs))
console.log('Part 2: ', calculateFuelCost(crabs, steps => steps * (steps +1) /2))

function calculateFuelCost(crabs, fuel = (a) => a) {
  return crabs.reduce((cost, crab, position) => Math.min(
    cost,
    crabs.map(x => fuel(Math.abs(x - position))).reduce(inc)
  ), Infinity)
}
