import PolymerMap from './PolymerMap.mjs'

const RULE_SIZE = 100 
const SPLIT_SIZE = 10000

export default class PolymerStream {

  constructor(source, depth = 0) {
    this.source = source
    this.depth = depth
    this.first = source.first
    this.rules = source.rules
  }

  static create(depth, first, rules) {
    const firstStream = new PolymerStream({first, rules})
    return Array(depth).fill(0).reduce(source => new PolymerStream(source, source.depth + 1), firstStream)
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

  async counts(withPolymer = false) {
    const counts = {}
    withPolymer && (counts.polymer = "")
    for await (const polymer of this.read()) {
      for (const element of polymer) {
        counts[element] = (counts[element] || 0) + 1
      }
      this.publish('COUNT_UPDATED', counts)
      withPolymer && (counts.polymer += polymer.toString())
    }
    return counts
  }

  async* transform (source) {
    const size = source.length
    if (size < RULE_SIZE)
      return yield this.rules.find(source)
    for (let i = 0; i < source.length - 1; i += RULE_SIZE) {
      const target = source.slice(i, i + RULE_SIZE + 1)
      const result = this.rules.find(target)
      yield result
    }
  }

  async* read() {

    if (!this.depth)
      return yield this.first

    let first;
    let bufferSize = 0
    let buffer = Buffer.alloc(SPLIT_SIZE)
    const source = this.source.read()

    this.publish('START_READ', this.depth)

    do {

      first = await source.next()

      if (first.value) {

        const value = Buffer.from(first.value)

        const missing = SPLIT_SIZE - bufferSize

        if (missing <= value.length) {
          value.copy(buffer, bufferSize, 0, missing)
          for await (const transformed of this.transform(buffer)) {
            yield transformed
          }
          const remaining = value.length - missing + 1
          value.copy(buffer, 0, missing - 1)
          bufferSize = remaining
        } else {
          value.copy(buffer, bufferSize, 0)
          bufferSize += value.length
        }

      }

    } while(!first.done)


    if (bufferSize > 0) {
      for await (const transformed of this.transform(buffer.slice(0, bufferSize))) {
        yield transformed 
      }
      yield buffer.slice(bufferSize - 1, bufferSize)
    }
    this.publish('END_READ', this.depth)
  }
}
