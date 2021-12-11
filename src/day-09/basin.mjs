
function adjacentPoints({i, j}, heights) {
  return [
    heights[i][j - 1] ? {i, j: j - 1} : false, 
    heights[i][j + 1] ? {i, j: j + 1} : false, 
    heights[i + 1] ? {i: i + 1, j} : false,
    heights[i - 1] ? {i: i - 1, j} : false
  ].filter(a => a)
}

export function adjacentLowpoints (heights) {
  return [
    (i,j) => (((heights[i]     || [])[j - 1] || 11)),
    (i,j) => ((heights[i]      || [])[j + 1] || 11),
    (i,j) => ((heights[i - 1]  || [])[j]     || 11),
    (i,j) => ((heights[i + 1]  || [])[j]     || 11)
  ]
}

const id = ({i, j}) => `${i}.${j}`

export function* walkBasin(point, heights, visited = {}) {
  visited[id(point)] = true
  yield point
  for (const adjacent of adjacentPoints(point, heights)) {
    if (visited[id(adjacent)]) continue
    if (heights[adjacent.i][adjacent.j] > 9) continue  
    yield * walkBasin(adjacent, heights, visited)
  }
}
