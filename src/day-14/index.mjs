import {readLines} from '../helpers/streams.mjs'

const lines = await readLines(import.meta.url, 'input.test')

const [starting] = await lines.take(1).toArray()

const rules = await lines.reduce((rules, line) => {
  const [m, v] = line.split(' -> ')
  return {...rules, [m]: `${m[0]}${v}` }
})

function matchRule(a, b) {return rules[a + b] || a}

await transform(starting, 4)
