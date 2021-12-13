
export default class Graph {
    constructor (edges) { 
      this.graph = edges.reduce((acc, [a, b]) => {
          acc[a] = {...(acc[a] || {}), [b]: 1}
          acc[b] = {...(acc[b] || {}), [a]: 1}
        return acc
      }, {})
    }
    printAllPaths(s, d) {
      const visited = Object.keys(this.graph).filter(k => k[0].toLowerCase() == k[0]).reduce((g, k) => ({
        ...g, [k]: false
      }), {})
      return printAllPathsUtil(this.graph, s, d, visited) 
    }


}

function caveType(key) {
  switch (key) {
    case 'start':
    case 'end':
      return key
    default:
      return key[0].toLowerCase() == key[0] ? 'small' : 'big'
  }
}

export function* printAllPaths2({graph}, start, destination, visited = {start: true}, path = []) {
  path.push(start) 
  const type = caveType(start)
  if (type == 'small') {
     visited[start] = (visited[start] || 0) + 1
  }
  if (start == destination) {
    yield path
  } else {
    for (const i in graph[start]) {
        const iType = caveType(i)
        const notrepeated = Object.values(visited).every(k => k < 2)
        if (iType == 'start') continue
        else if (iType != 'small')
            yield * printAllPaths2({graph}, i, destination, visited, path) 
        else if (!visited[i])
            yield * printAllPaths2({graph}, i, destination, visited, path) 
        else if (notrepeated) 
            yield * printAllPaths2({graph}, i, destination, visited, path) 
    }
  }
  path.pop() 
  type == 'small' && (visited[start] = visited[start] - 1)
}

  
function *  printAllPathsUtil (graph, u, d, visited, path = []) {
      const setVisited = (value) => visited[u] != undefined && (visited[u] = value)
      setVisited(true)
      path.push(u) 
      if (u == d) {
        yield path
      } else {
        for (const i in graph[u]) {
            if (!visited[i])
                yield * printAllPathsUtil(graph, i, d, visited, path) 
        }
      }
      path.pop() 
      setVisited(false)
}
