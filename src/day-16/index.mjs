import {readLines, inc} from '../helpers/streams.mjs'
import Packet from './Packet.mjs'


const packets = await readLines(import.meta.url, 'input').map(Packet.create).toArray()


const [packet, packet2] = packets

//console.log(packet.version)
//console.log(packet.type)
//console.log(packet.literal)

//console.log(packet2.version)
//console.log(packet2.type)
console.log(packets.map(({value, type}) => ({value, type})))
