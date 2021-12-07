import {pipeline} from 'lodash-contrib'
import Seq from 'lazy.js'
import {readBinariesFromInput, inc} from '../helpers/streams.mjs'

const readings = readBinariesFromInput(import.meta.url)

const accumulatedReadings = await readings.reduce(countBits, [])

const {gamma, epsilon} = await accumulatedReadings.reduce((acc, reading) => {
  const gamma = reading['1'] > reading['0'] ? '1' : '0'
  const epsilon = gamma == '1' ? '0' : '1' 
  acc.gamma.push(gamma)
  acc.epsilon.push(epsilon)
  return acc
}, {gamma: [], epsilon: []})

const parsedGamma = parseBinaryArray(gamma)
const parsedEpsilon = parseBinaryArray(epsilon)

const oxygenRating = await findRating(readings, (ones, zeroes) =>  zeroes > ones ? '0' : '1')
const epsilonRating = await findRating(readings, (ones, zeroes) => ones < zeroes ? '1' : '0')

console.log('Part 1: ', parsedGamma * parsedEpsilon)
console.log('Part 2: ', oxygenRating * epsilonRating)



async function findRating(readings, digitMapper, bit = 0) {
  const accumulatedReadings = await readings.reduce(countBits, [])
  const countsAtBit = accumulatedReadings[bit]
  const digit = digitMapper(countsAtBit['1'], countsAtBit['0'])
  const filtered = await readings.filter(reading => reading[bit] == digit).toArray()
  return filtered.length < 2
    ? parseBinaryArray(filtered[0])
    : findRating(Seq(filtered), digitMapper, bit + 1)
}

function parseBinaryArray(binary) {
  return parseInt(binary.join(''), 2)
}

function countBits(acc, reading) {
  return reading.map((v, i) => {
    const bit = acc[i] || {}
    const count = bit[v] || 0
    return {...bit, [v]: count + 1}
  })
}
