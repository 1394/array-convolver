const getComparator = (key) => {
  if (key === '>') {
    return (a,b) => a > b ? 1 : (a === b ? 0 : -1)
  }
  if (key === '<') {
    return (a,b) => a < b ? 1 : (a === b ? 0 : -1)
  }
}

const convert = (data, rule, {parent} = {}) => {
  console.log('before convert')
  console.dir(data, {depth: 4})
  const result = {}

  if (rule.from) {
    result.src = data[rule.from]
  } else {
    result.src = data
  }

  if (rule.to === 'array') {
    rule.to = Object.values
  }

  if (typeof rule.to === 'function') {
    result.dst = rule.to(result.src)
  }

  if (typeof rule.mapTo === 'function') {
    const mapFn = rule.mapTo
    result.dst = result.dst.map((el, idx) => mapFn(parent, el,idx, convert))
  } else if (Array.isArray(rule.mapTo)) {
    const mapFn = (el, idx) => rule.mapTo.reduce((acc, mapRule) => {
      Object.assign(acc, convert(el, mapRule, {parent: Array.isArray(parent) ? [el, ...parent] : [el]}))
      return acc
    }, {})
    result.dst = result.dst.map(mapFn)
  }

  if (typeof rule.sort === 'object' && rule.sort.key && ['function', 'string'].includes(typeof(rule.sort.compare))) {
    let {compare, key} = rule.sort
    if (typeof compare === 'string') {
      compare = getComparator(compare)
    }
    rule.sort = (a, b) => {
      if (a === undefined || b === undefined) {
        console.error({a,b})
        throw new Error('a or b undefined. error sort function')
      }
      return compare(a[key], b[key])
    }
  }

  if (typeof rule.sort === 'function' && Array.isArray(result.dst)) {
    result.dst = result.dst.sort(rule.sort)
  }
  if (rule.from) {
    data[rule.from] = result.dst
  }
  return result.dst
}

module.exports = {
  getComparator,
  convert,
}
