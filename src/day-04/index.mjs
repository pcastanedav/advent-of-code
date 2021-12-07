import {readLines, inc} from '../helpers/streams.mjs'
import Lazy from 'lazy.js'

const readings = await readLines(import.meta.url).toArray()

const bingoNumbers = readings[0].split(',')
const bingoBoards = Lazy(readings).rest().map(line => line.split(' ').filter(c => c != '')).chunk(5)

const [winner] = playBingo(bingoBoards.map(createBoard).toArray())
const winners = playBingo(bingoBoards.map(createBoard).toArray(), true)

if (winner)
  console.log('Part 1: ', winner.unmarkedValue * winner.lastNumber)

if (winners.length > 0) {
  const lastWinner = winners[winners.length - 1]
  console.log('Part 2: ', lastWinner.unmarkedValue * lastWinner.lastNumber)
}

function createBoard(entries) {
  const data = entries.reduce((map, row, y) => {
    row.forEach((num, x) => map[num] = {x, y} )
    return map
  }, {})
  const rows = Array(5).fill(0)
  const columns = Array(5).fill(0)
  return {data, rows, columns} 
}

function playBingo(boards, complete = false) {
  const winners = []
  for (const number of bingoNumbers) {
    for (const board of boards) {
      if (board.lastNumber) continue
      const spot = board.data[number]
      if (spot) {
        spot.marked = true
        board.rows[spot.y] += 1
        board.columns[spot.x] += 1
        if (board.rows[spot.y] == 5 || board.columns[spot.x] == 5) {
          board.lastNumber = parseInt(number)
          board.unmarkedValue = getUnmarkedValue(board)
          winners.push(board)
          if (!complete) break
        }
      }
    }
  }
  return winners
}

function getUnmarkedValue(board) {
  return Object
    .entries(board.data)
    .filter(([_, {marked}]) => !marked)
    .map(([value]) => parseInt(value))
    .reduce(inc)
}
