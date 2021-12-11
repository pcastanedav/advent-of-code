import {readLines, inc} from '../helpers/streams.mjs'

const lines = await readLines(import.meta.url, 'input')
    .map(l => l.split(''))

const chars = {
')': [3,'('],
']': [57,'['],
'}': [1197,'{'],
'>': [25137, '<']
}

const openning = {'(': 1, '[': 2, '{': 3, '<': 4}

function match(open, char) {
  const [points, target] = chars[char] || []
  return points && target == open && points 
}

const parsed = lines.map((line) => {
  const opened = [] 
  for (const char of line) {
    const [points, target] = chars[char] || []
    if (points && opened.length == 0) return {corrupted: true, points}
    if (openning[char]) opened.push(char)
    else if (target == opened.pop()) continue
    else return {corrupted: true, points}
  }
  return {corrupted: false, opened: opened.reverse()}
})


const part1 = await parsed.filter(a => a.corrupted).map(a => a.points).reduce(inc, 0)

console.log('Part 1: ', part1)

const part2 = await parsed.filter(a => !a.corrupted).map(a => a.opened.map(a => openning[a]).reduce((score, value) => {
  return score * 5 + value
}, 0)).toArray()

const middle = Math.floor(part2.length / 2)
part2.sort((a, b) => a - b)

console.log('Part 2: ', part2[middle])
