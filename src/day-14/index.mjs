import {readLines} from '../helpers/streams.mjs'

const lines = await readLines(import.meta.url, 'input')

const [starting] = await lines.take(1).toArray()

const insert_pairs = await lines.reduce((rules, line) => {
  const [m, v] = line.split(' -> ')
  return {...rules, [m]: v }
})

const counter = {}

const addCount = (obj, index, count = 1) => {
  obj[index] = obj[index]
    ? obj[index] + count
    : count
}

for (const char of starting) {
  addCount(counter, char)
}

let pairs = {}
for (let i = 1; i < starting.length; i++) {
  addCount(pairs, starting[i - 1] + starting[i])
}

for (let step = 1; step <= 40; step++){
  const new_pairs = {...pairs}
  for (const [pair, count] of Object.entries(pairs)) {
    new_pairs[pair] -= count
    const insert = insert_pairs[pair]
    addCount(new_pairs, pair[0] + insert, count)
    addCount(new_pairs, insert + pair[1], count)
    addCount(counter, insert, count)
  }
  pairs = new_pairs
  print_results(counter, step)
}

function print_results(counter, step) {
  const elements = Object.values(counter).sort((a, b) => a - b)
  console.log(`After step ${step}: most common - least common = ${elements[elements.length - 1] - elements[0]}`)
}
