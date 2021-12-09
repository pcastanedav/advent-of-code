import {readLines, inc} from '../helpers/streams.mjs'
import lodash from 'lodash'
const {mapValues} = lodash

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

function createSignalsMap(signals) {
  const signalsMap = signals.reduce((acc, id) => {
    const digits = gateFrequencies[id.length]
    digits.forEach(digit => {
      if (acc[digit]) acc[digit].push(id)
      else acc[digit] = [id]
    })
    return acc
  }, {})
  identifySix(signalsMap)
  identifyNineAndZero(signalsMap)
  identifyThree(signalsMap)
  identifyTwoAndFive(signalsMap)
  return Object.entries(signalsMap).reduce((acc, [key, [value]]) => {
    return {...acc, [sortString(value)]: key}
  }, {})
}

function identifySix (signals) {
  const oneGates = signals['1'][0].split('')
  const six = signals['6'].find(signal => !oneGates.every(gate => signal.indexOf(gate) > -1))
  signals['6'] = signals['6'].filter(a => a == six)
  signals['9'] = signals['9'].filter(a => a != six)
  signals['0'] = signals['0'].filter(a => a != six)
  return six
}

function identifyNineAndZero (signals) {
  const fourGates = signals['4'][0].split('')
  const nine = signals['9'].find(signal => fourGates.every(gate => signal.indexOf(gate) > -1))
  signals['9'] = signals['9'].filter(a => a == nine)
  signals['0'] = signals['0'].filter(a => a != nine)
}

function identifyThree (signals) {
  const sevenGates = signals['7'][0].split('')
  const three = signals['3'].find(signal => sevenGates.every(gate => signal.indexOf(gate) > -1))
  signals['3'] = signals['3'].filter(a => a == three)
  signals['2'] = signals['2'].filter(a => a != three)
  signals['5'] = signals['5'].filter(a => a != three)
}

function identifyTwoAndFive (signals) {
  const nine = signals['9'][0]
  const fiveGates = signals['5'].map(s => s.split(''))
  const five = fiveGates.find(gates => gates.every(gate => nine.indexOf(gate) > -1)).join('')
  signals['5'] = signals['5'].filter(a => a == five)
  signals['2'] = signals['2'].filter(a => a != five)
}

function sortString(value) {
  return value.split('').sort().join('')
}

const readings = await readLines(import.meta.url, 'input')
  .map(line => line.split(' | '))
  .map(([signals, outputs]) => ({
    signals: createSignalsMap(signals.split(' ')), outputs: outputs.split(' ')
  }))
  .map(({signals, outputs}) => ({
    signals, outputs, digits: outputs.reduce((digits, digit) => {
      return digits + signals[sortString(digit)]
    }, "")
  }))
 

const outputLengths = await readings
  .map(r => r.outputs.map(o => o.length))
  .flatten()
  .filter(length => gateFrequencies[length].length == 1)
  .toArray()

console.log("Part 1: ", outputLengths.length)


const processed = await readings.map(({digits}) => parseInt(digits)).reduce(inc, 0)
console.log("Part 2: ", processed)
