
const valueHandlers = [
  p => p.subpackets.reduce((a, b) => a + b.value, 0),
  p => p.subpackets.reduce((a, b) => a * b.value, 1),
  p => p.subpackets.reduce((a, b) => Math.min(a, b.value), Infinity),
  p => p.subpackets.reduce((a, b) => Math.max(a, b.value), -Infinity),
  p => p.value,
  p => p.subpackets[0].value > p.subpackets[1].value ? 1 : 0,
  p => p.subpackets[0].value < p.subpackets[1].value ? 1 : 0,
  p => p.subpackets[0].value == p.subpackets[1].value ? 1 : 0, 
]

export default class Packet {

  constructor(bits) {
    this.bits = bits
    this.parseType()
    this.parseLiteral()
    this.parseSubpackets()
    this.parseVersion()
    this.parseValue()
  }

  get(offset, length) {
    return parseInt(this.bits.substring(offset, offset + length), 2)
  }

  parseLiteral() {
    if (this.type != 4) return false
    let literal = ''
    let segment
    let i = 6
    do {
      segment = this.get(i, 5)
      literal += (segment & 0b01111).toString(2).padStart(4, '0')
      i += 5
    } while ((segment & 0b10000) == 0b10000)
    this.packetLength = i
    this.value = parseInt(literal, 2)
  }

  parseSubpackets () {
    if (!this.hasSubpackets) return
    const counting = this.get(6,1)
    return counting
      ? this.parseSubpacketsByCount(this.get(7,11))
      : this.parseSubpacketsByLength(this.get(7, 15))
  }

  parseSubpacketsByCount(n) {
    if (this.type == 4) return false
    let processed = 0
    let subpackets = []
    const source = this.bits.substring(18)
    for (let i = 0; i < n; i++) {
      const packet = new Packet(source.substring(processed))
      subpackets.push(packet)
      processed += packet.packetLength
    }
    this.subpackets = subpackets
    this.packetLength = 18 + processed
  }

  parseSubpacketsByLength(length) {
    const source = this.bits.substring(22, 22 + length)
    let processed = 0
    let subpackets = []
    while (processed < length) {
      const packet = new Packet(source.substring(processed))
      subpackets.push(packet)
      processed += packet.packetLength
    }
    this.subpackets = subpackets
    this.packetLength = 22 + processed
  }

  get hasSubpackets() {
    return this.type != 4
  }

  parseVersion() {
    this.version = this.hasSubpackets
      ? this.subpackets.reduce((a, s) => a + s.version, this.get(0, 3))
      : this.get(0, 3)
  }

  parseType() {
    this.type = this.get(3, 3)
  }

  parseValue() {
    const handler = valueHandlers[this.type]
    handler && (this.value = handler(this))
  }

  static create(source) {
    const bits = source.split('').reduce((s, d) => s + parseInt(d, 16).toString(2).padStart(4, '0'), "")
    return new Packet(bits)
  }

}

