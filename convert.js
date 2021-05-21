const getComparator = (key) => {
  if (key === '>') {
    return (a,b) => a > b
  }
  if (key === '>=') {
    return (a,b) => a >= b
  }
  if (key === '<=') {
    return (a,b) => a <= b
  }
  if (key === '<') {
    return (a,b) => a < b
  }
}

const convert = (data, rule, {parent} = {}) => {
  const result = {}

  if (rule.from) {
    result.src = data[rule.from]
  } else {
    result.src = data
  }

  if (rule.to === 'array') {
    result.dst = Object.values(result.src)
  }

  if (typeof rule.to === 'function') {
    result.dst = rule.to(result.src)
  }

  if (typeof rule.map === 'function') {
    result.dst = result.dst.map((el, idx) => rule.map(parent, el,idx))
  } else if (Array.isArray(rule.map)) {
    const mapFn = (el, idx) => rule.map.reduce((acc, mapRule) => {
      return convert(el, mapRule, {parent: el})
    }, {})
    result.dst = result.dst.map(mapFn)
  }

  if (typeof rule.sort === 'object' && rule.sort.key && ['function', 'string'].includes(typeof(rule.sort.compare))) {
    let {compare, key} = rule.sort
    if (typeof compare === 'string') {
      compare = getComparator(compare)
    }
    rule.sort = (a, b) => {
      return compare(a[key], b[key])
    }
  }

  if (typeof rule.sort === 'function') {
    result.dst = rule.sort(result.dst)
  }
}

module.exports = {
  getComparator,
  convert,
}