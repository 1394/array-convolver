const getPathProp = (obj, pathArr) => {
  return pathArr.reduce((acc, el) => {
    if (typeof acc === 'object') {
      acc = acc[el]
    } else {
      acc = undefined
    }
    return acc
  }, obj)
}

const pathSet = (src, path, handlerOrInitVal, opts = {}) => {
  const {modifySource} = opts
  const source = Object.fromEntries(Object.entries(src))
  // const source = JSON.parse(JSON.stringify(src))

  if (!source) {
    throw new Error('source cant be empty')
  }
  if (typeof path === 'string') {
    path = path.split('.')
  }
  if (!path || !Array.isArray(path)) {
    throw new Error('path must be array or string')
  }

  let acc;

  if (typeof handlerOrInitVal === 'function') {
    acc = handlerOrInitVal(getPathProp(source, path))
  } else {
    acc = getPathProp(source, path) || handlerOrInitVal
  }

  const pathLength = path.length
  for(let idx = 0; idx < pathLength; idx++) {
    const prop = path.pop()
    const acc2 = {}
    acc2[prop] = acc
    console.log({prop, type: typeof prop, acc2, acc})
    if (modifySource) {
      acc = Object.assign(getPathProp(source, path), acc2)
    } else {
      acc = Object.assign({}, getPathProp(source, path), acc2)
    }
  }
  return acc
}

const test = () => {
  const obj = {a: {b: {c: 4}}}
  return {
    val: pathSet(obj, 'a.b.c', () => 5),
    func: pathSet(obj, 'a.b.c', (val) => (val || 0) + 10, {modifySource: true}),
    obj
  }
}

module.exports = {
  pathSet,
  getPathProp,
  test,
}
