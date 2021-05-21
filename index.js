const {pathSet} = require('./pathset')

const convolve = (arr, rulesHandler) => {
  return arr.reduce((acc, row) => {
    const rules = rulesHandler(row)
    rules.forEach((rule) => {
      acc = pathSet(acc, rule.path, rule.handler)
    })
    return acc
  }, {})
}

module.exports = {
  convolve
}
