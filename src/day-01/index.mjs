import {pipeline} from 'lodash-contrib'
import {readNumbersFromInput, inc} from '../helpers/streams.mjs'

const readings = readNumbersFromInput(import.meta.url)
const countIncrements = ({increments = 0, lastVal}, reading) => ({increments: reading > lastVal ? increments + 1 : increments, lastVal: reading})

const {increments} = await readings.reduce(countIncrements, {})
const {increments: windowedIncrements} = await readings.consecutive(3).map(w => w.reduce(inc)).reduce(countIncrements, {})

console.log('Part 1: ', increments)
console.log('Part 2: ', windowedIncrements)


