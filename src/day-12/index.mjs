import {readLines, inc} from '../helpers/streams.mjs'
import Graph, {printAllPaths2} from './graph.mjs'


const edges = await readLines(import.meta.url, 'input')
    .map(l => l.split('-'))
    .toArray()


const graph = new Graph(edges)

const paths = graph.printAllPaths('start', 'end')
let i = 0;
for (let path of paths) {
  i++
}

console.log('Part 1:',  i)

const paths2 = printAllPaths2(graph, 'start', 'end')
let j = 0;
let pathsA = []
for (let path of paths2) {
  pathsA.push(path.join(','))
  j++
}
console.log('Part 2:',  j)
console.log(pathsA)


