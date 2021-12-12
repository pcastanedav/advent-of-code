
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

    printAllPaths2(s, d) {
      const visited = Object
        .keys(this.graph)
        .filter(k => k[0].toLowerCase() == k[0])
        .reduce((g, k) => ({...g, [k]: false}), {})
      return printAllPathsUtil2(this.graph, s, d, visited) 
    }
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

function *  printAllPathsUtil2 (graph, u, d, visited, path = [], init = {}) {
      const setVisited = (value) => {
        if (visited[u] == undefined) return
        if (u == 'start' || u == 'end') return (visited[u] = value)
        if (init[u]) return (visited[u] = value)
        init[u] = value
      }
      setVisited(true)
      path.push(u) 
      if (u == d) {
        yield path
      } else {
        for (const i in graph[u]) {
            if (!visited[i])
                yield * printAllPathsUtil2(graph, i, d, visited, path, init) 
        }
      }
      path.pop() 
      setVisited(false)
}
