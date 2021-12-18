import ci from 'caller-id'
import {dirname, join} from 'path'
import {open} from 'fs/promises'
import {Buffer} from 'buffer'

import lodash from 'lodash'
import lazy from 'lazy.js'
import {pipeline} from 'lodash-contrib'

const {partial} = lodash 
const {readFile} = lazy

export function getInputPath (url, name = 'input') {
  const directory = dirname(url).substring(7)
  return join(directory, name)
}

export async function* streamCharacters(path) {
  const buffer = Buffer.alloc(2000000)
  const handle = await open(path, 'r')
  const stats = await handle.stat()
  const read = () => handle.read({buffer, length: buffer.size}).then(r => r.bytesRead)
  let bytesRead = await read()
  let previous = ''
  while (bytesRead) {
    const output = buffer.toString('utf8', 0, bytesRead)
    yield previous + output
    previous = output[0]
    bytesRead = await read()
  }
  await handle.close()
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

export const readLines = (url, name) => inputAsLazyLines(getInputPath(url, name))
export const readNumbersFromInput = pipeline(getInputPath, inputAsLazyLines, linesToNumbers)
export const readBinariesFromInput = pipeline(getInputPath, inputAsLazyLines, linesToBinaryArray)
export const readDirectionsFromInput = pipeline(getInputPath, inputAsLazyLines, linesToDirections)

export const inc = (a, b) => a + b
export const dec = (a, b) => a - b
