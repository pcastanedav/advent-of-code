import {readLines, inc} from '../helpers/streams.mjs'
import * as math from 'mathjs'
import Lazy from 'lazy.js'


const lines = await readLines(import.meta.url, 'input')

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
  const vertical = axis == 'x'
  const x1 = math.range(0, vertical ? value : width)
  const x2 = math.range(vertical ? value + 1 : 0, width)
  const y1 = math.range(0, vertical ? height : value)
  const y2 = math.range(vertical ? 0 : value + 1, height)
  const A = matrix.subset(math.index(y1, x1))
  const B = matrix.subset(math.index(y2, x2))
  const mirror = M => {
    const [height, width] = M.size()
    return M.map((a, [y0, x0]) => {
      const y1 = vertical ? y0 : (height - 1) - y0
      const x1 = vertical ? (width - 1) - x0 : x0
      return M.subset(math.index(y1, x1))
  })}
  const MB = mirror(B)
  return math.or(A, MB)
}

function matrixToString(matrix) {
  return  matrix.map(s => s ? '▌' : ' ').toArray().map(s => s.join(''))
}

function foldMatrixUsingInstructions(M, ops) {
  return ops.reduce(foldMatrix, M)
}

function countDots(M) {
  return math.flatten(M).toArray().reduce(inc, 0)
}

const transformOnce = foldMatrix(matrix, foldingInstructions[0])


console.log('Part 1: ', countDots(transformOnce))

const transformed = foldMatrixUsingInstructions(matrix, foldingInstructions)

console.table(matrixToString(transformed))
