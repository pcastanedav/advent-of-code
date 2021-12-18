import {readLines, inc} from '../helpers/streams.mjs'

const lines = await readLines(import.meta.url, 'input.test')

const [starting] = await lines.take(1).toArray()

const rules = await lines.reduce((rules, line) => {
  const [m, v] = line.split(' -> ')
  return {...rules, [m]: v }
})

function applyRule(a, b) {
  return rules[`${a}${b}`] || a
}


const pairCounts = {
}

const elements = [...new Set(Object.keys(rules)
  .reduce((a, r) => a.concat(r.split('')), []))]


let buffer = starting.substring(0, 2)
for (let i = 0; i < 5; i++) {
  buffer = applyRule(buffer[0], buffer[1])
  
}
