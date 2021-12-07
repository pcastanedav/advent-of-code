import {pipeline} from 'lodash-contrib'
import {readDirectionsFromInput, inc, dec} from '../helpers/streams.mjs'

const readings = readDirectionsFromInput(import.meta.url)

const {x, y} = await readings.reduce(move, {x: 0, y:0})

const adjustedPosition = await readings.reduce(moveAndAim, {x: 0, y:0, aim: 0})


console.log('Part 1: ', x * y)

console.log('Part 2: ', adjustedPosition.x * adjustedPosition.y)


export function move(position, {direction, amount}) {
  switch(direction) {
    case 'forward': return {...position, x: position.x + amount}
    case 'up': return {...position, y: position.y - amount}
    case 'down': return {...position, y: position.y + amount}
    default: return position
  }
}

export function moveAndAim(position, {direction, amount}) {
  switch(direction) {
    case 'forward': return {...position, x: position.x + amount, y: position.y + position.aim * amount}
    case 'up': return {...position, aim: position.aim - amount}
    case 'down': return {...position, aim: position.aim + amount}
    default: return position
  }
}
