const {pathSet} = require('./pathset')

const {convert} = require('./convert')

const convolve = (arr, rulesHandler, {after} = {}) => {
  const result = arr.reduce((acc, row) => {
    const rules = rulesHandler(row)
    rules.forEach((rule) => {
      acc = pathSet(acc, rule.path, rule.handler)
    })
    return acc
  }, {})
  if (typeof after === 'function') {
    return after(result)
  } else if (typeof after === 'object') {
    return convert(result, after)
  }
  return result
}

module.exports = {
  convolve
}
