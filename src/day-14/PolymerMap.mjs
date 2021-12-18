
const RULE_SIZE = 500000

export default class PolymerMap extends Map {

  set(key, value) {
    return super.set(Symbol.for(key), Buffer.from(value))
  }

  has(key) {
    return super.has(Symbol.for(key))
  }

  get(raw) {
    const key = Symbol.for(raw)
    if (super.has(key))
      return super.get(key)
    const value = Buffer.from(raw[0])
    this.set(key, value)
    return value
  }

  find(source, finish) {
    if (this.has(source))
      return this.get(source)
    let size = 0
    const buffer = Buffer.alloc(RULE_SIZE)
    for (let i = 0; i < source.length - 1; i++) {
      const value = this.get([source[i], source[i + 1]])
      value.copy(buffer, size, 0)
      size += value.length
    }

    this.set(source, buffer.slice(0, size)) 
    if (finish) {
      buffer.writeUInt8(source[source.length - 1], size)
      size += 1
    }
    return buffer.slice(0, size)
  }

}
