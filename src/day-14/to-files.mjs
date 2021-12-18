import {readLines, streamCharacters, getInputPath} from '../helpers/streams.mjs'
import {open, rename} from 'fs/promises'

console.log(import.meta.url)
const lines = await readLines(import.meta.url, 'input.test')

const [starting] = await lines.take(1).toArray()
const tail = starting[starting.length - 1]

const rules = await lines.reduce((rules, line) => {
  const [m, v] = line.split(' -> ')
  return {...rules, [m]: `${m[0]}${v}` }
})

function matchRule(a, b) {return rules[a + b] || a}

const memo = {
}

function applyRule (source) {
  const size = source.length
  if (size < 30) {
    memo[source] = memo[source] || Array(size - 1).fill(0).reduce((p, _, i) => `${p}${matchRule(source[i], source[i + 1])}`, "")
    return memo[source]
  } else {
    const split = Math.floor(size / 2)
    return applyRule(source.substring(0, split + 1)) + applyRule(source.substring(split))
  }
}

async function applyRules (n) {
  console.time(`Proccessed in ${n + 1}`)
  const getPath = target => getInputPath('file:///home/backup/outputs/', `outputs/polymer-${target}`)
  const chars = await streamCharacters(getPath('input'))
  const output = await open(getPath('output'), 'w')
  let c
  for await (c of chars) {
    await output.write(applyRule(c))
  }
  await output.write(tail)
  await output.sync()
  await output.close()
  await rename(getPath('output'), getPath('input'))
  console.timeEnd(`Proccessed in ${n + 1}`)
}

async function transform(starting, n) {
  const startingFile = await open(getInputPath('file:///home/backup/outputs/', `outputs/polymer-input`), 'w')
  await startingFile.write(starting)
  await startingFile.sync()
  await startingFile.close()
  for (let i = 0; i < n; i++) {
    await applyRules(i)
  }
  //return () => open(getInputPath(import.meta.url, `outputs/polymer-output`), 'r')
}

await transform(starting, 40)
//const counts = countElements(polymer)
//const elements = Object.values(counts).sort((a, b) => a - b)
//const part1 = elements[elements.length - 1] - elements[0]

/*

function countElements(polymer) {
  return polymer.split('').reduce((acc, c) => ({...acc, [c]: (acc[c] || 0) + 1}), {})
}

const polymer  = transform(starting, 40)

//console.table(['NBBBCNCCNBBNBNBBCHBHHBCHB', polymer])

//After step 2: 
//After step 4: NBBNBNBBCCNBCNCCNBBNBBNBBBNBBNBBCBHCBHHNHCBBCBHCB


console.log('Part 1: ', part1)

/*
const polymer2  = await transform(starting, 40)
console.log('Polymer yay')
const counts2 = countElements(polymer2)
const elements2 = Object.values(counts2).sort((a, b) => a - b)
const part2 = elements2[elements2.length - 1] - elements2[0]

console.log('Part 2: ', part2)
*/
