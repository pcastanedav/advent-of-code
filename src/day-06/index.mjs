import {readLines, inc, dec, linesToNumbers} from '../helpers/streams.mjs'
import Lazy from 'lazy.js'

const readings = await readLines(import.meta.url, 'input.test')

class Lanternfish {

  constructor(timer) {
    this.timer = timer
  }

  age() {
    if (this.timer)
      this.timer -= 1
    else {
      this.timer = 6
      return new Lanternfish(8)
    }
  }

  static create(timer) {
    return new Lanternfish(timer)
  }

  static age (fishes, fish) {
    const newFish = fish.age()
    if (newFish) fishes.push(newFish)
    return fishes
  }

  static toTimersString(school) {
    return school.map(fish => fish.timer).join(',')
  }

}


const initialSchool = await readings
  .map(l => l.split(','))
  .flatten()
  .map(n => parseInt(n))

let school = await initialSchool
  .map(Lanternfish.create)
  .toArray()

//console.log(`Initial state: ${Lanternfish.toTimersString(school)}`)

for (let day = 1; day <= 80; day++) {
  school = school.concat(school.reduce(Lanternfish.age, []))
  //console.log(`${school.length} fishes after ${day} day${day > 1 ? 's: ' : ':  '} ${Lanternfish.toTimersString(school)}`)
}

console.log('Part 1: ', school.length, ' fishes.')

let secondSchool = await initialSchool
  .reduce((fishes, fish) => {
    fishes[fish] = (fishes[fish] + 1) || 1
    return fishes
  }, {})

const schedule = Array(7).fill(0).map((n, i) => secondSchool[i] || n)
const newbornSchedule = Array(9).fill(0)

//console.log(`Initial: ${scheduleToString(schedule)},${scheduleToString(newbornSchedule)}`)

for (let day = 0; day < 256; day++) {
  const id = day % 7
  const newborns = newbornSchedule.shift() 
  if (newborns) schedule[id] += newborns 
  newbornSchedule.push(schedule[id])
}


console.log('Part 2: ', schedule.reduce(inc) + newbornSchedule.reduce(inc), ' fishes.')
