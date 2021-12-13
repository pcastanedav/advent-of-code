import {readLines, inc} from '../helpers/streams.mjs'
import * as math from 'mathjs'
import Lazy from 'lazy.js'


const lines = await readLines(import.meta.url, 'input.test')

const paper = await lines.takeWhile(s => /^\d/.test(s))
  .map(s => s.split(',').map(s => parseInt(s)))
  .toArray()

const foldingInstructions = await lines.dropWhile(s => /^(\d|\s)/.test(s))
    .map(s => {
      const [axis, value] = s.substring('fold along '.length).split('=')
      return { axis, value: parseInt(value)}
    })
    .toArray()

const maxHeight = await Lazy(foldingInstructions).filter(({axis}) => axis == 'y').map(({value}) => value).max()
const maxWidth = await Lazy(foldingInstructions).filter(({axis}) => axis == 'x').map(({value}) => value).max()
const calculateSize = n => 2 * n + 1

const matrix = paper.reduce((acc, [x, y]) => {
  return acc.subset(math.index(y,x), 1)
}, math.zeros(calculateSize(maxHeight), calculateSize(maxWidth)))

function foldMatrix(matrix, {axis, value}) {
  const [height, width] = matrix.size() 
  const x1 = math.range(0, axis == 'x' ? value : width)
  const x2 = math.range(axis == 'x' ? value + 1 : 0, width)
  const y1 = math.range(0, axis == 'y' ? value : height)
  const y2 = math.range(axis == 'y' ? value + 1 : 0, height)
  const mirror = m => axis == 'y'
    ? math.matrixFromRows(...matrix.rows().map(s => s.toArray().reverse()))
    : math.matrixFromColumns(...matrix.columns().map(s => s.toArray().reverse()))
  const b = matrix.subset(math.index(y2, x2))
  return math.or(matrix.subset(math.index(y1, x1)), b)
}
function matrixToString(matrix) {
  return  matrix.map(s => s ? '#' : '.').toArray().map(s => s.join(''))
}

const transformed = foldingInstructions.reduce((matrix, instruction) => {
    return foldMatrix(matrix, instruction)
}, matrix)

console.table(matrixToString(foldMatrix(matrix, {axis: 'y', value: 7})))
console.table(matrixToString(matrix))
console.table(matrixToString(transformed))

console.log('Part 1: \n')
