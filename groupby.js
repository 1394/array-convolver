const groupby = (arr, idx, defKey = 'default') => arr.reduce((acc, el) => {
  const key = el[idx] || defKey
  acc[key] = acc[key] || []
  acc[key].push(el)
  return acc
}, {})

const groupbyFn = (arr, idx, defKey = 'default') => arr.reduce((acc, el) => {
  const key = idx(el) || defKey
  acc[key] = acc[key] || []
  acc[key].push(el)
  return acc
}, {})

const sortFn = ({prop, dir = 'asc', convert, debug}) => {
  dir = dir.toLowerCase()
  if (dir === 'asc') {
    return (a, b) => {
      const a1 = typeof convert === 'function' ? convert(a[prop]) : a[prop]
      const b1 = typeof convert === 'function' ? convert(b[prop]) : b[prop]
      debug && console.log('sort asc: type a, type b, a, b, result', typeof a1, typeof b1, a1, b1, a1 === b1 ? 0 : (a1 > b1 ? 1 : -1))
      return a1 === b1 ? 0 : (a1 > b1 ? 1 : -1)
    }
  } else {
    return (a, b) => {
      const a1 = a[prop]
      const b1 = b[prop]
      debug && console.log('sort desc: type a, type b, a, b, result', typeof a1, typeof b1, a1, b1, a1 === b1 ? 0 : (a1 < b1 ? 1 : -1))
      return a1 === b1 ? 0 : (a1 < b1 ? 1 : -1)
    }
  }
}

/**
 * 
 * @param {Array} data 
 * @param {Object} rule 
 * @param {String|Function} rule.groupby key for grouping elements of input array
 * @param {String|Function} rule.assemble function for creating element of resulting array, (key, groupValues, source)
 * @param {Object|Function} rule.sort comparator for sorting result
 * @param {Array} rule.compute array of prop and handler for compute prop by handler with grouped element array
 * @param {String} rule.compute[].prop property name for compute
 * @param {Function} rule.compute[].handler handler(elements, parentComputedData, objectWithPreviouslyComputedPropsInCurrentRule)
 * @param {Object} rule.values next rule for transform array of grouped elements by given key
 * @param {Object} parentData internal use for exchanging between rule results
 * @returns 
 */
const convolve = (data, rule, parentData = {}) => {
  const result = {}

  if (!['string', 'function'].includes(typeof rule.groupby)) {
    throw new Error('rule.groupby must be string and cant be empty')
  }

  result.groupby = typeof rule.groupby === 'string' ? groupby(data, rule.groupby) : groupbyFn(data, rule.groupby)

  if (typeof rule.assemble !== 'function') {
    rule.assemble = (key, values) => {
      return {
        key,
        values: rule.values ? convolve(values, rule.values) : values
      }
    }
  }
  result.arr = Object.entries(result.groupby).map(([key, values]) => {
    let element
    if (Array.isArray(rule.compute) && rule.compute.length) {
      element = rule.compute.reduce((acc, {prop, handler}) => {
        if (typeof handler === 'function') {
          acc[prop] = handler(values, parentData, acc)
        } else {
          console.log(JSON.stringify(handler, true))
          console.error(`compute handler for prop "${prop}" must be a function`)
        }
        return acc
      }, {})
      // parentData[rule.compute.$name] = element
    }
    const assemled = rule.assemble(
      key,
      rule.values ? convolve(values, rule.values, element) : values,
      values,
      element,
      parentData,
    )
    return element ? Object.assign(element, assemled) : assembled
  })
  if (typeof rule.sort === 'object' && typeof rule.sort.prop === 'string') {
    rule.sort = sortFn(rule.sort)
  }
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
  sortFn,
}
