const groupby = (arr, idx, defKey = 'default') => arr.reduce((acc, el) => {
  const key = el[idx] || defKey
  acc[key] = acc[key] || []
  acc[key].push(el)
  return acc
}, {})

const convolve = (data, rule) => {
  const result = {}
  if (rule.groupby && typeof rule.groupby === 'string') {
    result.groupby = groupby(data, rule.groupby)
  } else {
    throw new Error('rule.groupby must be string and cant be empty')
  }
  if (typeof rule.assemble !== 'function') {
    rule.assemble = (key, values) => {
      return {
        key,
        values: rule.values ? convolve(values, rule.values) : values
      }
    }
  }
  result.arr = Object.entries(result.groupby).map(([key, values]) => {
    return rule.assemble(
      key,
      rule.values ? convolve(values, rule.values) : values
    )
  })
  if (rule.sort) {
    return result.arr.sort(rule.sort)
  } else {
    return result.arr
  }
}

const reduceby = (values, fn, initVal) => values.reduce((acc, el) => {
  acc = fn(acc, el)
  return acc
}, initVal)

module.exports = {
  convolve,
  groupby,
  reduceby,
}
