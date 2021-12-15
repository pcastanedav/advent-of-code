import {readLines} from '../helpers/streams.mjs'

const lines = await readLines(import.meta.url, 'input.test')

const [firstPolymer] = await lines.take(1).toArray()

const rules = await lines.skip(1)
  .map(l => l.split(' -> '))
  .reduce((R, [k, v]) => ({...R, [k]: `${k[0]}${v}`}), {})

const MEMO_SIZE = 8 
const SPLIT_SIZE = 10000

class PolymerStream {

  constructor(source, depth = 0) {
    this.depth = depth
    this.starting = !(source instanceof PolymerStream)
    if (this.starting) this.first = source.first
    else this.source = source
    this.memo = source.memo || {}
    this.rules = source.rules
  }

  static create(depth, first, rules) {
    const firstStream = new PolymerStream({first: firstPolymer, rules})
    return Array(depth - 1).fill(0).reduce(source => new PolymerStream(source, source.depth + 1), firstStream)
  }

  subscribe(event, cb) {
    this.subscribers = this.subscribers || []
    this.subscribers.push([event, cb])
    let source = this.source
    while(source) {
      source.subscribers = source.subscribers || []
      source.subscribers.push([event, cb])
      source = source.source
    }
  }

  publish(event, ...args) {
    const subscribers = this.source.subscribers || []
    subscribers.filter(([ev]) => ev == event).forEach(([event, cb]) => {
      cb.apply(this, args)
    })
  }

  matchRule(a, b) { return this.rules[a + b] || a }

  handleSmall(source) {
    if (!this.memo[source]) {
      this.memo[source] = ""
      for (let i = 0; i < source.length - 1; i++) {
        this.memo[source] += this.matchRule(source[i], source[i + 1])
      }
    }
    return this.memo[source]
  }


  async* applyRule (source) {
    const size = source.length
    if (size < MEMO_SIZE) yield this.handleSmall(source)
    console.log('aaa')
    for (let i = 0; i < source.length; i += MEMO_SIZE) {
      const p = source.substring(i, i + MEMO_SIZE + 1)
      yield this.handleSmall(p)
    }
  }

  async* read() {
    if (this.starting) {
      yield this.handleSmall(this.first) + this.first[this.first.length - 1]
    } else if (this.source) {
      const gen = this.source.read()
      this.publish('START_READ', this.depth)
      let first
      let buffer = ""
      do {
        first = await gen.next()
        if (first.value) {
          const missing = SPLIT_SIZE - buffer.length
          if (missing <= first.value.length) {
            console.log('hi')
            buffer = first.value.substring(0, SPLIT_SIZE - buffer.length)
            for await (let r of this.applyRule(buffer)) {
              yield r
            }
            buffer = first.value.substring(SPLIT_SIZE - buffer.length - 1)
          } else {
            buffer += first.value
          }
        }
        if (first.done) {
          console.table(['NBCCNBBBCBHCB', buffer])
            for await (let r of this.applyRule(buffer)) {
              yield r
            }
            yield buffer[buffer.length - 1]
            buffer = ""
            this.publish('END_READ', this.depth)
        }
      } while (!first.done)
    }
  }
}

const reader = PolymerStream.create(3, firstPolymer, rules)
reader.subscribe('START_READ', depth => console.log('Started Working at depth: ', depth))
reader.subscribe('END_READ', depth => console.log('Finished Working at depth: ', depth))

let counts = {}
for await (let polymer of reader.read()) {
  for (let element of polymer) {
    counts[element] = (counts[element] || 0) + 1
  }
}
const elements = Object.values(counts).sort((a, b) => a - b)

console.log(counts)
console.log(elements[elements.length - 1] - elements[0])

