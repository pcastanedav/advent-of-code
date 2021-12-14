import {readLines} from '../helpers/streams.mjs'

const lines = await readLines(import.meta.url, 'input.test')

const [starting] = await lines.take(1).toArray()

const rules = await lines.reduce((rules, line) => {
  const [m, v] = line.split(' -> ')
  return {...rules, [m]: `${m[0]}${v}` }
})

class Stream {

  constructor(source, rules) {
    if (source instanceof Stream) {
      this.source = source
      this.memo = source.memo
      this.rules = source.rules
    } else {
      this.memo = {}
      this.starting = source
      this.rules = rules
    }
  }

  applyRule (source) {
    const size = source.length
    console.log(size)
    if (size < 12) {
      this.memo[source] = this.memo[source] || Array(size - 1).fill(0).reduce((p, _, i) => {
        return `${p}${this.matchRule(source[i], source[i + 1])}`
      }, "")
      return this.memo[source]
    } else {
      const split = Math.floor(size / 2)
      return this.applyRule(source.substring(0, split + 1)) + this.applyRule(source.substring(split))
    }
  }

  matchRule(a, b) {
    return this.rules[a + b] || a
  }

  async* read() {
    if (this.starting) {
      yield this.applyRule(this.starting) + this.starting[this.starting.length - 1]
    }
    if (this.source) {

      const gen = this.source.read()
      let first = gen.next()
      let second = gen.next()
      do {

        if (first.value.length < 1001) {
          yield this.applyRule(first.value)
        }

        first = second
        second = gen.next()
      } while (!second.done)

      for await (stream of this.source.read()) {
        console.log(stream)
        if (stream.length < 1001) {
          yield this.applyRule(stream)
        } else {
          const first = stream.substring(0, 1001)
          const second = stream.substring(1000)
          yield this.applyRule(first)
          yield this.applyRule(second)
        }
      }
    }
  }

  static create(starting, rules, depth) {
    return Array(depth).fill(0).reduce((source) => new Stream(source), new Stream(starting, rules))
  }

}

const reader = Stream.create(starting, rules, 1)

for await (let s of reader.read()) {
  console.table([s, 'NBCCNBBBCBHCB'])
}



/*
async function applyRules (n) {
  for await (c of chars) {
    await output.write(applyRule(c))
  }
}
*/

