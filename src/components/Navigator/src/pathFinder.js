
export default function pathFinder(vertices, start, finish) {

  let distances = new Array(vertices.length).fill(Infinity);
  distances[start] = 1;
  let used = new Array(vertices.length).fill(0);
  let p = new Array(vertices.length);

  for (let i = 0; i < vertices.length; i++) {
    let v = -1;
    for (let j = 0; j < vertices.length; j++) {
      if (used[j] == 0 && (v == -1 || distances[j] < distances[v])) {
        v = j;
      }
    }
    if (distances[v] == Infinity || v == finish) {
      break;
    }

    used[v] = 1;

    vertices[v].neighbours.forEach(to => {
      if (distances[v] + to.dist < distances[to.id]) {
        distances[to.id] = distances[v] + to.dist;
        p[to.id] = v;
      }
    });
  }

  if (distances[finish] == Infinity) {
    return false;
  }
  
  let path = [];
  path.push(vertices[finish]);
  let v = p[finish];
  while (v != start) {
    path.push(vertices[v]);
    v = p[v];
  }
  path.push(vertices[start]);

  return path;
}