import {readLines, inc} from '../helpers/streams.mjs'
import lodash from 'lodash'
const {mapValues} = lodash

const readings = await readLines(import.meta.url, 'input')
  .map(line => line.split(' | '))
  .map(([signals, outputs]) => ({
    signals: signals.split(' '), outputs: outputs.split(' ')
  }))

const digits = {
  '0': [1,1,1,1,1,1,0],
  '1': [0,1,1,0,0,0,0],
  '2': [1,1,0,1,1,0,1],
  '3': [1,1,1,1,0,0,1],
  '4': [0,1,1,0,0,1,1],
  '5': [1,0,1,1,0,1,1],
  '6': [1,0,1,1,1,1,1],
  '7': [1,1,1,0,0,0,0],
  '8': [1,1,1,1,1,1,1],
  '9': [1,1,1,1,0,1,1]
}

const digitLengths = mapValues(digits, a => a.filter(a => a).length)

const gateFrequencies = Object.entries(digitLengths).reduce((freq, [digit, gates]) => {
  if (freq[gates]) freq[gates].push(digit)
  else freq[gates] = [digit]
  return freq
}, {})

const outputLengths = await readings
  .map(r => r.outputs.map(o => o.length))
  .flatten()
  .filter(length => gateFrequencies[length].length == 1)
  .toArray()

console.log(gateFrequencies)
