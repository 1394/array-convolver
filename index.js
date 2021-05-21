const {pathSet} = require('./pathset')

const convolve = (arr, rules) => {
  return arr.reduce((acc, row) => {
    rules.forEach((rule) => {
      pathSet(acc, rule.path, (val) => rule.handler(row, val), {modifySource: true})
    })
    return acc
  }, {})
}

module.exports = {
  convolve
}
