import ci from 'caller-id'
import {dirname, join} from 'path'

import lodash from 'lodash'
import lazy from 'lazy.js'
import {pipeline} from 'lodash-contrib'

const {partial} = lodash 
const {readFile} = lazy

export function getInputPath (url, name = 'input') {
  const directory = dirname(url).substring(7)
  return join(directory, name)
}

export function inputAsLazyLines(path) {
  return readFile(path).lines().filter(l => l)
}

export function linesToNumbers(lines, radix = 10) {
  return lines.map(partial(parseInt, lodash, radix))
}

export function linesToDirections(lines) {
  return lines.map(line => {
    const [direction, amount] = line.split(' ')
    return {direction, amount: parseInt(amount)}
  })
}

export function linesToBinaryArray(lines) {
  return lines.map(line => line.split(''))
}

export const readNumbersFromInput = pipeline(getInputPath, inputAsLazyLines, linesToNumbers)

export const readBinariesFromInput = pipeline(getInputPath, inputAsLazyLines, linesToBinaryArray)

export const readDirectionsFromInput = pipeline(getInputPath, inputAsLazyLines, linesToDirections)

export const inc = (a, b) => a + b
export const dec = (a, b) => a - b
